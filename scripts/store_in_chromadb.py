import os
import sys
import json
import numpy as np
import chromadb
from chromadb.config import Settings

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PROCESSED_DIR = os.path.join(PROJECT_ROOT, "data", "processed")
CHROMA_DB_PATH = os.path.join(PROJECT_ROOT, "data", "chroma_db")

STANDARDS_VECTORS_PATH = os.path.join(DATA_PROCESSED_DIR, "standards_embeddings.npy")
STANDARDS_META_PATH = os.path.join(DATA_PROCESSED_DIR, "standards_metadata.json")
CHUNKS_VECTORS_PATH = os.path.join(DATA_PROCESSED_DIR, "chunks_embeddings.npy")
CHUNKS_META_PATH = os.path.join(DATA_PROCESSED_DIR, "chunks_metadata.json")

def store_data_in_chromadb():
    print("=" * 65)
    print("  BIS SmartAssist — ChromaDB Vector Database Ingestion")
    print("=" * 65)

    if not os.path.exists(STANDARDS_VECTORS_PATH) or not os.path.exists(STANDARDS_META_PATH):
        print("Precomputed vectors not found! Please run train_embeddings.py first.")
        return

    print(f"\nInitializing ChromaDB persistent storage at: {CHROMA_DB_PATH}")
    os.makedirs(CHROMA_DB_PATH, exist_ok=True)
    client = chromadb.PersistentClient(path=CHROMA_DB_PATH)

    # 1. Store Published Indian Standards Collection
    print("\n[1/3] Loading precomputed standards vectors...")
    vectors = np.load(STANDARDS_VECTORS_PATH)
    with open(STANDARDS_META_PATH, "r", encoding="utf-8") as f:
        metadata = json.load(f)

    total_records = len(metadata)
    print(f"Loaded {total_records} standards embeddings (shape: {vectors.shape}).")

    # Get or create collection with cosine similarity
    std_collection = client.get_or_create_collection(
        name="bis_standards",
        metadata={"hnsw:space": "cosine", "description": "23,866 Official BIS Published Indian Standards"}
    )

    existing_count = std_collection.count()
    if existing_count >= total_records:
        print(f"Collection 'bis_standards' already contains {existing_count} records.")
    else:
        print(f"Ingesting {total_records} standards into ChromaDB in batches...")
        batch_size = 2000
        for i in range(0, total_records, batch_size):
            end = min(i + batch_size, total_records)
            
            batch_ids = [f"std_{idx}_{metadata[idx]['standard_number']}" for idx in range(i, end)]
            batch_embeddings = vectors[i:end].tolist()
            batch_docs = [
                f"{metadata[idx]['standard_number']}: {metadata[idx]['title']}. Category: {metadata[idx]['product_category']}."
                for idx in range(i, end)
            ]
            batch_metadatas = [
                {
                    "standard_number": str(metadata[idx].get("standard_number") or ""),
                    "title": str(metadata[idx].get("title") or "")[:200],
                    "product_category": str(metadata[idx].get("product_category") or "General"),
                    "type_of_standard": str(metadata[idx].get("type_of_standard") or "Specification"),
                    "is_mandatory": bool(metadata[idx].get("is_mandatory", False)),
                    "date_of_publish": str(metadata[idx].get("date_of_publish") or "")
                }
                for idx in range(i, end)
            ]

            std_collection.upsert(
                ids=batch_ids,
                embeddings=batch_embeddings,
                documents=batch_docs,
                metadatas=batch_metadatas
            )
            print(f"   -> Inserted {end}/{total_records} standards into ChromaDB...")

        print(f"[OK] Collection 'bis_standards' now has {std_collection.count()} vectors.")

    # 2. Store Clause-level Knowledge Chunks
    if os.path.exists(CHUNKS_VECTORS_PATH) and os.path.exists(CHUNKS_META_PATH):
        print("\n[2/3] Ingesting deep clause documents into ChromaDB...")
        chunk_vectors = np.load(CHUNKS_VECTORS_PATH)
        with open(CHUNKS_META_PATH, "r", encoding="utf-8") as f:
            chunk_metadata = json.load(f)

        chunk_collection = client.get_or_create_collection(
            name="bis_clauses",
            metadata={"hnsw:space": "cosine", "description": "Deep clause-level Indian Standard requirements"}
        )

        c_ids = [f"chunk_{idx}_{c.get('standard_number')}_c{c.get('clause_number')}" for idx, c in enumerate(chunk_metadata)]
        c_docs = [f"{c.get('standard_number')} Clause {c.get('clause_number')}: {c.get('content')}" for c in chunk_metadata]
        c_metas = [
            {
                "standard_number": str(c.get("standard_number") or ""),
                "title": str(c.get("title") or ""),
                "clause_number": str(c.get("clause_number") or ""),
                "product_category": str(c.get("product_category") or "General")
            }
            for c in chunk_metadata
        ]

        chunk_collection.upsert(
            ids=c_ids,
            embeddings=chunk_vectors.tolist(),
            documents=c_docs,
            metadatas=c_metas
        )
        print(f"[OK] Collection 'bis_clauses' now has {chunk_collection.count()} clause vectors.")

    # 3. Test ChromaDB Query with Metadata Filtering
    print("\n[3/3] Testing ChromaDB query with metadata filter...")
    test_query_embedding = vectors[0].tolist() # Vector representation
    
    # Query with filter: is_mandatory == True
    results = std_collection.query(
        query_embeddings=[test_query_embedding],
        n_results=3,
        where={"is_mandatory": True}
    )

    print("\nSample ChromaDB Query Result (Mandatory standards only):")
    for idx, (doc, meta, dist) in enumerate(zip(results["documents"][0], results["metadatas"][0], results["distances"][0])):
        similarity = round(1 - dist, 3)
        print(f"  {idx+1}. [Similarity: {similarity}] {meta['standard_number']} — {meta['title']} ({meta['product_category']})")

    print("\n" + "=" * 65)
    print("  ChromaDB Vector Database Ingestion Successful!")
    print("=" * 65)

if __name__ == "__main__":
    store_data_in_chromadb()
