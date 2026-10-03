"""
Automated tests for BIS SmartAssist hybrid retrieval engine.
"""

import pytest
from backend.app.rag.retriever import hybrid_retriever


@pytest.mark.parametrize(
    "query",
    [
        "IS 456",
        "IS 456:2000",
        "cement",
        "reinforced concrete",
        "packaged drinking water",
        "electric fans",
        "gold hallmarking",
        "steel rebar",
    ],
)
def test_standards_retrieval(query):
    results = hybrid_retriever.search_standards_semantic(query, top_k=5)
    assert len(results) > 0, f"No results returned for query: {query}"
    assert "standard_number" in results[0]
    assert "title" in results[0]
