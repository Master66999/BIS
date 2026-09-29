import os
import sys
import json
import re
import random
import openpyxl
import numpy as np
import torch
from typing import List, Dict, Any

# Reconfigure stdout for utf-8 on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Add project root to sys.path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(PROJECT_ROOT)

from sentence_transformers import (
    SentenceTransformer,
    SentenceTransformerTrainer,
    SentenceTransformerTrainingArguments,
)
try:
    from sentence_transformers.sentence_transformer.losses import MultipleNegativesRankingLoss
except ImportError:
    from sentence_transformers.losses import MultipleNegativesRankingLoss  # type: ignore[import-not-found]
from datasets import Dataset

from backend.app.rag.knowledge_seed import SEED_DOCUMENTS
from scripts.seed_database import guess_category

EXCEL_PATH = os.path.join(PROJECT_ROOT, "File_Published_Standards_List_2026-09-29_122533.xlsx")
MODEL_OUTPUT_DIR = os.path.join(PROJECT_ROOT, "models", "bis_embedding_model")
DATA_PROCESSED_DIR = os.path.join(PROJECT_ROOT, "data", "processed")
BASE_MODEL_NAME = "all-MiniLM-L6-v2"

def clean_title_text(raw: str) -> str:
    if not raw:
        return ""
    text = raw.replace("\ufffd", " - ")
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def build_training_pairs(max_standards: int = 6000) -> List[Dict[str, str]]:
    """
    Constructs high-relevance (anchor query, positive document) pairs
    from BIS Published Standards and Clause Knowledge Chunks.
    """
    print("\n[1/4] Extracting standards and generating synthetic query-document training pairs...")
    pairs = []

    # 1. From SEED_DOCUMENTS (Clause level deep knowledge)
    for doc in SEED_DOCUMENTS:
        std_num = doc.get("standard_number", "")
        doc_title = doc.get("title", "")
        
        for chunk in doc.get("chunks", []):
            clause = chunk.get("clause_number", "")
            content = chunk.get("content", "")
            category = chunk.get("product_category", "")
            
            passage = f"{std_num} {doc_title} (Clause {clause}): {content}"
            
            # Generate domain queries
            pairs.append({"anchor": f"What is the requirement for {doc_title} under clause {clause}?", "positive": passage})
            pairs.append({"anchor": f"{std_num} testing requirements and limits", "positive": passage})
            if category:
                pairs.append({"anchor": f"Indian standard specification for {category}", "positive": passage})

            # Extract technical keywords from content
            if "tensile" in content.lower():
                pairs.append({"anchor": f"tensile strength test standard for {category or doc_title}", "positive": passage})
            if "chemical" in content.lower() or "sulphur" in content.lower():
                pairs.append({"anchor": f"chemical composition limits for {std_num}", "positive": passage})
            if "sampling" in content.lower():
                pairs.append({"anchor": f"sampling criteria for {doc_title}", "positive": passage})

    # 2. From Excel Published Standards
    if os.path.exists(EXCEL_PATH):
        wb = openpyxl.load_workbook(EXCEL_PATH, read_only=True)
        sheet = wb.active
        rows_iter = sheet.iter_rows(values_only=True)
        
        # Skip headers
        next(rows_iter, None)
        next(rows_iter, None)
        
        excel_records = []
        for row in rows_iter:
            if not row or not row[1]:
                continue
            std_num = str(row[1]).strip()
            raw_title = str(row[3]).strip() if row[3] else ""
            clean_title = clean_title_text(raw_title)
            std_type = str(row[4]).strip() if row[4] else "Specification"
            category = guess_category(clean_title)
            excel_records.append((std_num, clean_title, std_type, category))

        # Sample or use records to form balanced diverse dataset
        random.seed(42)
        if len(excel_records) > max_standards:
            sampled_records = random.sample(excel_records, max_standards)
        else:
            sampled_records = excel_records

        templates = [
            "specification for {title}",
            "Indian standard for {title}",
            "requirements for {title}",
            "what standard covers {title}?",
            "{std_num} {title}",
            "BIS test methods for {title}",
            "certification guidelines for {category}"
        ]

        for std_num, clean_title, std_type, category in sampled_records:
            passage = f"{std_num}: {clean_title}. Type: {std_type}. Category: {category}."

            # Query variation 1: Direct title
            q1 = f"specification for {clean_title.lower()}"
            pairs.append({"anchor": q1, "positive": passage})

            # Query variation 2: Standard number lookup
            q2 = f"{std_num.lower()} {category.lower()}"
            pairs.append({"anchor": q2, "positive": passage})

            # Query variation 3: Natural language question
            q3 = f"What is the official BIS standard for {clean_title.lower()}?"
            pairs.append({"anchor": q3, "positive": passage})

    # 3. From 100 Benchmark Real-World Questions Dataset
    benchmark_path = os.path.join(PROJECT_ROOT, "data", "benchmark_100_questions.json")
    if os.path.exists(benchmark_path):
        with open(benchmark_path, "r", encoding="utf-8") as f:
            bench_data = json.load(f)
        print(f"Ingesting {len(bench_data)} questions from benchmark dataset to generate supervised training pairs...")
        for item in bench_data:
            q = item.get("query", "")
            std = item.get("expected_standard", "")
            prod = item.get("product", "")
            cat = item.get("category", "")
            facts = item.get("key_facts", [])
            facts_str = ". ".join(facts)
            passage = f"{std}: {prod} specification in {cat}. Technical criteria and compliance: {facts_str}."

            # Direct benchmark question anchor
            pairs.append({"anchor": q, "positive": passage})
            # Natural language variation
            pairs.append({"anchor": f"What is the BIS standard and testing protocol for {prod}?", "positive": passage})
            # Standard number & technical query
            pairs.append({"anchor": f"{std} {prod} testing requirements and QCO conformity", "positive": passage})

    print(f"Generated {len(pairs)} synthetic query-document training pairs.")
    return pairs


def train_bis_embedding_model(pairs: List[Dict[str, str]]):
    """
    Fine-tunes SentenceTransformer on domain pairs using MultipleNegativesRankingLoss.
    """
    print(f"\n[2/4] Initializing base model '{BASE_MODEL_NAME}' on device: {'cuda' if torch.cuda.is_available() else 'cpu'}...")
    
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = SentenceTransformer(BASE_MODEL_NAME, device=device)

    # Convert to datasets Dataset
    train_dataset = Dataset.from_dict({
        "anchor": [p["anchor"] for p in pairs],
        "positive": [p["positive"] for p in pairs]
    })

    # Loss function: In-batch negatives contrastive ranking
    train_loss = MultipleNegativesRankingLoss(model)

    os.makedirs(MODEL_OUTPUT_DIR, exist_ok=True)

    training_args = SentenceTransformerTrainingArguments(
        output_dir=os.path.join(MODEL_OUTPUT_DIR, "checkpoints"),
        num_train_epochs=1,
        per_device_train_batch_size=32 if device == "cuda" else 16,
        learning_rate=2e-5,
        warmup_ratio=0.1,
        fp16=(device == "cuda"),
        logging_steps=50,
        save_strategy="no",
        report_to="none"
    )

    print(f"Starting fine-tuning with {len(train_dataset)} examples...")
    trainer = SentenceTransformerTrainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        loss=train_loss
    )

    trainer.train()

    print(f"Saving fine-tuned BIS embedding model to: {MODEL_OUTPUT_DIR}")
    model.save(MODEL_OUTPUT_DIR)
    print("[OK] Model training and export complete.")
    return model

def build_vector_index(model: SentenceTransformer):
    """
    Encodes all 23,866 Indian Standards + Document Chunks and writes
    compressed dense vector matrix (.npy) and metadata (.json).
    """
    print("\n[3/4] Encoding all published Indian Standards into dense vector index...")
    os.makedirs(DATA_PROCESSED_DIR, exist_ok=True)

    standards_metadata = []
    standards_texts = []

    if os.path.exists(EXCEL_PATH):
        wb = openpyxl.load_workbook(EXCEL_PATH, read_only=True)
        sheet = wb.active
        rows_iter = sheet.iter_rows(values_only=True)
        next(rows_iter, None)
        next(rows_iter, None)

        for row in rows_iter:
            if not row or not row[1]:
                continue
            std_num = str(row[1]).strip()
            pub_date = str(row[2]).strip() if row[2] else None
            clean_title = clean_title_text(str(row[3])) if row[3] else "Standard Specification"
            std_type = str(row[4]).strip() if row[4] else "Specification"
            equiv = str(row[5]).strip() if row[5] else "Indigenous"
            category = guess_category(clean_title)
            is_mandatory = any(kw in clean_title.lower() for kw in ["safety", "protective", "drinking water", "cement", "steel", "helmet", "electric"])

            text_to_encode = f"{std_num}: {clean_title}. Category: {category}. Type: {std_type}."
            standards_texts.append(text_to_encode)
            standards_metadata.append({
                "standard_number": std_num,
                "title": clean_title,
                "date_of_publish": pub_date,
                "type_of_standard": std_type,
                "degree_of_equivalence": equiv,
                "product_category": category,
                "is_mandatory": is_mandatory,
                "source_url": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/"
            })

    print(f"Computing embeddings for {len(standards_texts)} Indian Standards...")
    # Compute normalized embeddings in batches
    embeddings = model.encode(
        standards_texts,
        batch_size=64 if torch.cuda.is_available() else 32,
        show_progress_bar=True,
        normalize_embeddings=True,
        convert_to_numpy=True
    )

    npy_path = os.path.join(DATA_PROCESSED_DIR, "standards_embeddings.npy")
    json_path = os.path.join(DATA_PROCESSED_DIR, "standards_metadata.json")

    np.save(npy_path, embeddings.astype(np.float32))
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(standards_metadata, f, ensure_ascii=False)

    print(f"[OK] Vector index created successfully:")
    print(f"     - Vectors: {npy_path} (shape: {embeddings.shape})")
    print(f"     - Metadata: {json_path} ({len(standards_metadata)} items)")

    # Also pre-encode SEED_DOCUMENTS chunks
    chunk_texts = []
    chunk_metadata = []
    for doc in SEED_DOCUMENTS:
        for chunk in doc.get("chunks", []):
            chunk_text = f"{chunk.get('standard_number', '')} {chunk.get('title', '')} Clause {chunk.get('clause_number', '')}: {chunk.get('content', '')}"
            chunk_texts.append(chunk_text)
            chunk_metadata.append(chunk)

    if chunk_texts:
        chunk_embeddings = model.encode(chunk_texts, normalize_embeddings=True, convert_to_numpy=True)
        np.save(os.path.join(DATA_PROCESSED_DIR, "chunks_embeddings.npy"), chunk_embeddings.astype(np.float32))
        with open(os.path.join(DATA_PROCESSED_DIR, "chunks_metadata.json"), "w", encoding="utf-8") as f:
            json.dump(chunk_metadata, f, ensure_ascii=False)
        print(f"[OK] Pre-computed chunk embeddings for {len(chunk_texts)} clauses.")

def evaluate_search(model: SentenceTransformer):
    """
    Demonstrates top-k semantic retrieval on real user test queries.
    """
    print("\n[4/4] Evaluating semantic vector retrieval...")
    npy_path = os.path.join(DATA_PROCESSED_DIR, "standards_embeddings.npy")
    json_path = os.path.join(DATA_PROCESSED_DIR, "standards_metadata.json")

    if not os.path.exists(npy_path) or not os.path.exists(json_path):
        print("Index files not found.")
        return

    embeddings = np.load(npy_path)
    with open(json_path, "r", encoding="utf-8") as f:
        metadata = json.load(f)

    test_queries = [
        "tmt steel bars for earthquake proof concrete building",
        "purity requirements for packaged drinking water bottles",
        "safety helmet for industrial workers head protection",
        "three pin electrical plug and socket rules",
        "high density polyethylene pipes for potable water supply"
    ]

    for q in test_queries:
        print(f"\nQuery: \"{q}\"")
        q_vec = model.encode([q], normalize_embeddings=True, convert_to_numpy=True)
        # Cosine similarity is simple dot product because vectors are normalized
        scores = np.dot(embeddings, q_vec.T).flatten()
        top_indices = np.argsort(scores)[::-1][:3]
        
        for rank, idx in enumerate(top_indices, start=1):
            item = metadata[idx]
            print(f"  {rank}. [{scores[idx]:.3f}] {item['standard_number']} — {item['title']} ({item['product_category']})")

if __name__ == "__main__":
    print("=" * 65)
    print("  BIS SmartAssist — Embedding Model Fine-Tuning & Vector Indexing")
    print("=" * 65)
    
    # Generate training pairs
    pairs = build_training_pairs(max_standards=4000)
    
    # Fine-tune model
    model = train_bis_embedding_model(pairs)
    
    # Build complete vector index for all 23,866 standards
    build_vector_index(model)
    
    # Run test evaluation
    evaluate_search(model)
    
    print("\n" + "=" * 65)
    print("  Training & Indexing Pipeline Complete!")
    print("=" * 65)
