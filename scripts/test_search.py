"""
BIS SmartAssist - Interactive and CLI Search Utility
Tests hybrid semantic, exact, and BM25 retrieval over published standards.
"""

import os
import sys
import argparse
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from backend.app.rag.retriever import hybrid_retriever


def run_query(query: str, top_k: int = 5):
    print(f"\nQuery: '{query}'")
    print("-" * 65)

    results = hybrid_retriever.search_standards_semantic(query, top_k=top_k)

    if not results:
        print("No matches found.")
        return

    for idx, r in enumerate(results, start=1):
        std_no = r.get("standard_number", "Unknown")
        title = r.get("title", "Unknown")
        cat = r.get("product_category", "General")
        score = r.get("semantic_score", 0.0)
        print(f"[{idx}] {std_no} — {title}")
        print(f"    Category: {cat} | Score: {score}")
        print()


def interactive_mode():
    print("=" * 65)
    print("  BIS SmartAssist — Interactive Search CLI")
    print("  Type query to test retrieval (or 'exit' / 'quit' to exit)")
    print("=" * 65)

    while True:
        try:
            q = input("\nEnter query: ").strip()
            if q.lower() in ["exit", "quit", "q"]:
                break
            if not q:
                continue
            run_query(q)
        except (KeyboardInterrupt, EOFError):
            break


def main():
    parser = argparse.ArgumentParser(description="Test BIS Standards Retrieval")
    parser.add_argument("--query", "-q", type=str, default=None, help="Query string")
    parser.add_argument("--top-k", "-k", type=int, default=5, help="Number of results")
    args = parser.parse_args()

    if args.query:
        run_query(args.query, top_k=args.top_k)
    else:
        interactive_mode()


if __name__ == "__main__":
    main()
