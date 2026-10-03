"""
BIS SmartAssist - Booklet Vector Ingestion Script
Extracts, chunks, embeds, and indexes 17 official BIS Departmental Resource Handouts & Technical Booklets into ChromaDB.
"""

import os
import sys
import json
import numpy as np
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from backend.app.ingestion.booklet_loader import process_booklet_directory

BOOKLETS_DIR = os.path.join(PROJECT_ROOT, "data", "raw", "booklets")
CHROMA_DB_PATH = os.path.join(PROJECT_ROOT, "data", "chroma_db")
OUTPUT_METADATA = os.path.join(PROJECT_ROOT, "data", "processed", "booklet_chunks_metadata.json")
LOCAL_MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "bis_embedding_model")


def ingest_booklets_into_chromadb(batch_size: int = 64):
    print("=" * 65)
    print("  BIS SmartAssist — Departmental Booklet Vector Ingestion")
    print("=" * 65)
    print(f"Booklets Directory: {BOOKLETS_DIR}")

    if not os.path.exists(BOOKLETS_DIR):
        print(f"Error: Directory not found at {BOOKLETS_DIR}")
        return

    # 1. Process all PDF booklets
    print("\n[1/4] Extracting text and chunking PDF booklets...")
    chunks = process_booklet_directory(BOOKLETS_DIR, chunk_size=1200, chunk_overlap=200)
    total_chunks = len(chunks)
    print(f"Extracted {total_chunks} chunks from booklet repository.")

    if total_chunks == 0:
        print("No chunks extracted. Please verify PyMuPDF is installed and PDF files are present.")
        return

    # Save metadata
    os.makedirs(os.path.dirname(OUTPUT_METADATA), exist_ok=True)
    with open(OUTPUT_METADATA, "w", encoding="utf-8") as f:
        json.dump(chunks, f, indent=2)
    print(f"Saved chunk metadata to {OUTPUT_METADATA}")

    # 2. Load Embedding Model
    print("\n[2/4] Loading Sentence Transformer embedding model...")
    try:
        from sentence_transformers import SentenceTransformer
        model_name = LOCAL_MODEL_PATH if os.path.exists(LOCAL_MODEL_PATH) else "sentence-transformers/all-MiniLM-L6-v2"
        model = SentenceTransformer(model_name)
        print(f"Loaded embedding model: {model_name}")
    except Exception as e:
        print(f"Error loading SentenceTransformer: {e}")
        return

    # 3. Connect to ChromaDB
    print(f"\n[3/4] Connecting to ChromaDB at: {CHROMA_DB_PATH}")
    os.makedirs(CHROMA_DB_PATH, exist_ok=True)
    try:
        import chromadb
        client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
        booklet_col = client.get_or_create_collection(
            name="bis_booklets",
            metadata={"hnsw:space": "cosine", "description": "17 Official BIS Departmental Resource Handouts"}
        )
    except Exception as e:
        print(f"Error initializing ChromaDB: {e}")
        return

    # 4. Compute Embeddings and Upsert in Batches
    print(f"\n[4/4] Ingesting {total_chunks} booklet chunks into ChromaDB...")
    for i in range(0, total_chunks, batch_size):
        end = min(i + batch_size, total_chunks)
        batch = chunks[i:end]

        batch_ids = [f"bk_{idx}_{b['booklet_name']}_p{b['page_number']}_c{b['chunk_index']}" for idx, b in enumerate(batch, start=i)]
        batch_docs = [b["document"] for b in batch]
        batch_metas = [
            {
                "booklet_name": b["booklet_name"],
                "filename": b["filename"],
                "department": b["department"],
                "page_number": int(b["page_number"]),
                "chunk_index": int(b["chunk_index"]),
            }
            for b in batch
        ]

        batch_embeddings = model.encode(batch_docs, normalize_embeddings=True, show_progress_bar=False).tolist()

        booklet_col.upsert(
            ids=batch_ids,
            embeddings=batch_embeddings,
            documents=batch_docs,
            metadatas=batch_metas
        )
        print(f"   -> Ingested {end}/{total_chunks} chunks...")

    print(f"\n[SUCCESS] Collection 'bis_booklets' now contains {booklet_col.count()} vectors.")

    # Test Query
    print("\n--- Test ChromaDB Query over Booklets ---")
    test_q = "automotive braking safety standards and requirements"
    q_vec = model.encode([test_q], normalize_embeddings=True).tolist()
    res = booklet_col.query(query_embeddings=q_vec, n_results=3)
    for idx, (doc, meta, dist) in enumerate(zip(res["documents"][0], res["metadatas"][0], res["distances"][0])):
        similarity = round(1 - dist, 3)
        print(f"  {idx+1}. [Similarity: {similarity}] {meta['department']} - {meta['booklet_name']} (Page {meta['page_number']})")
    print("=" * 65)


if __name__ == "__main__":
    ingest_booklets_into_chromadb()
