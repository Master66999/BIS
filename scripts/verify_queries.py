"""
Verification script for 10 representative BIS queries.
"""

import sys
from pathlib import Path

root_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root_dir))

from backend.app.rag.retriever import hybrid_retriever

queries = [
    "What standard applies to Ordinary Portland Cement?",
    "What standard specifies packaged drinking water other than mineral water?",
    "IS 456 reinforced concrete requirements",
    "What does clause 5.1 of IS 456 say about cement?",
    "Which standard applies to High strength deformed steel bars for concrete reinforcement?",
    "What is IS 10262 used for?",
    "Civil engineering booklet guidance for concrete",
    "Gold hallmarking requirements and HUID",
    "What is the standard for solar photovoltaic modules?",
    "Standard for medical surgical face masks"
]

print("=" * 85)
print(f"{'Query':<48} | {'Top Source':<20} | {'Score':<6} | {'Latency'}")
print("=" * 85)

for q in queries:
    cands, timing = hybrid_retriever.retrieve_candidates(q, top_k=3)
    top = cands[0] if cands else None
    std = top.standard_number if top else "None"
    bk = top.booklet_name if top else "None"
    score_str = f"{top.final_score:.2f}" if top else "0.00"
    lat_str = f"{timing['total_retrieval_ms']:.1f}ms"
    src_display = str(std if std != "None" else (bk if bk != "None" else "None"))
    print(f"{q[:46]:<48} | {src_display:<20} | {score_str:<6} | {lat_str}")

print("=" * 85)
