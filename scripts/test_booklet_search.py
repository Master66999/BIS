"""
BIS SmartAssist - Booklet Knowledge Search CLI
Tests cross-source vector search across BIS Departmental Resource Handouts & Booklets.
"""

import os
import sys
import argparse
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from backend.app.rag.retriever import hybrid_retriever


def run_booklet_query(query: str, top_k: int = 4):
    print(f"\nQuery: '{query}'")
    print("-" * 65)

    results = hybrid_retriever.search_booklets(query, top_k=top_k)

    if not results:
        print("No booklet matches found or booklet collection not yet ingested.")
        print("Tip: Run 'python scripts/ingest_booklets.py' to ingest the 17 PDF booklets.")
        return

    for idx, r in enumerate(results, start=1):
        dept = r.get("department", "BIS")
        booklet = r.get("booklet_name", "Unknown")
        page = r.get("page_number", 1)
        sim = r.get("similarity_score", 0.0)
        snippet = r.get("snippet", "")[:180].replace("\n", " ")
        print(f"[{idx}] {dept} — {booklet} (Page {page}) [Similarity: {sim}]")
        print(f"    Snippet: {snippet}...")
        print()


def main():
    parser = argparse.ArgumentParser(description="Test BIS Booklet Retrieval")
    parser.add_argument("--query", "-q", type=str, default="automotive braking safety requirements", help="Query string")
    parser.add_argument("--top-k", "-k", type=int, default=4, help="Number of results")
    args = parser.parse_args()

    print("=" * 65)
    print("  BIS SmartAssist — Booklet Knowledge Retrieval Test")
    print("=" * 65)
    run_booklet_query(args.query, top_k=args.top_k)


if __name__ == "__main__":
    main()
