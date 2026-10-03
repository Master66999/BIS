"""
Comprehensive unit tests for the improved BIS RAG pipeline.
Covers candidate retrieval, deduplication, score normalization,
CrossEncoder reranking, fallback behavior, confidence calculation,
source metadata preservation, and evaluation metrics.
"""

import pytest
import numpy as np
from backend.app.rag.candidate import RetrievedCandidate
from backend.app.rag.reranker import CrossEncoderReranker, get_reranker
from backend.app.rag.retriever import HybridRetriever, hybrid_retriever
from backend.app.rag.generator import generate_rag_answer, SYSTEM_PROMPT
from backend.app.schemas.schemas import SourceCitation


# -----------------------------------------------------------------------------
# 1. Candidate Dataclass & Deduplication
# -----------------------------------------------------------------------------

def test_candidate_deduplication_keys():
    # Standard candidate
    cand_std = RetrievedCandidate(
        source_type="standard",
        standard_number="IS 456",
        title="Plain and Reinforced Concrete",
        content="Concrete design code"
    )
    assert cand_std.deduplication_key == "standard:IS 456"

    # Clause candidate
    cand_clause = RetrievedCandidate(
        source_type="clause",
        standard_number="IS 456",
        title="Plain and Reinforced Concrete",
        clause="Clause 5.1",
        content="Cement requirement"
    )
    assert cand_clause.deduplication_key == "clause:IS 456:CLAUSE 5.1"

    # Booklet candidate
    cand_booklet = RetrievedCandidate(
        source_type="booklet",
        title="Civil Booklet",
        booklet_name="CED_Civil_Engineering",
        page=12,
        content="Civil standards summary"
    )
    assert cand_booklet.deduplication_key == "booklet:ced_civil_engineering:p12"


def test_candidate_to_citation_conversion():
    cand = RetrievedCandidate(
        source_type="clause",
        standard_number="IS 456",
        title="Plain and Reinforced Concrete",
        clause="5.1",
        page=14,
        department="CED",
        content="Portland Pozzolana Cement conforming to IS 1489 shall be used.",
        bm25_score=0.85,
        vector_score=0.92,
        rerank_score=0.88,
        final_score=0.89
    )
    cit = cand.to_citation()
    assert isinstance(cit, SourceCitation)
    assert cit.standard_number == "IS 456"
    assert cit.title == "Plain and Reinforced Concrete"
    assert cit.clause == "5.1"
    assert cit.page == 14
    assert cit.source_type == "clause"
    assert cit.rerank_score == 0.88
    assert cit.final_score == 0.89


# -----------------------------------------------------------------------------
# 2. Reranker Unit Tests & Fallback
# -----------------------------------------------------------------------------

def test_reranker_fallback_mode():
    reranker = CrossEncoderReranker(model_name=None)
    candidates = [
        RetrievedCandidate(
            source_type="standard",
            standard_number="IS 269",
            title="Ordinary Portland Cement",
            content="Specification for 33 grade OPC cement",
            bm25_score=0.9,
            vector_score=0.8,
            normalized_score=0.85
        ),
        RetrievedCandidate(
            source_type="standard",
            standard_number="IS 10262",
            title="Concrete Mix Proportioning",
            content="Guidelines for concrete mix proportioning",
            bm25_score=0.3,
            vector_score=0.4,
            normalized_score=0.35
        ),
    ]

    reranked, diagnostics = reranker.rerank(
        query="What standard specifies Ordinary Portland Cement?",
        candidates=candidates,
        top_k=2
    )

    assert len(reranked) == 2
    assert reranked[0].standard_number == "IS 269"
    assert reranked[0].rerank_score is not None
    assert reranked[0].final_score >= reranked[1].final_score


def test_reranker_empty_candidates():
    reranker = get_reranker()
    reranked, diagnostics = reranker.rerank(query="Test query", candidates=[], top_k=5)
    assert reranked == []



# -----------------------------------------------------------------------------
# 3. Hybrid Retriever Channel Retrieval & Merging
# -----------------------------------------------------------------------------

def test_hybrid_retriever_retrieve_candidates():
    query = "IS 456 reinforced concrete"
    candidates, timing = hybrid_retriever.retrieve_candidates(query=query)

    assert isinstance(candidates, list)
    assert len(candidates) > 0
    assert "retrieval_ms" in timing
    assert "reranking_ms" in timing
    assert "total_retrieval_ms" in timing

    top_std = candidates[0].standard_number
    assert top_std is not None
    assert "456" in top_std


def test_retrieval_deduplication_and_normalization():
    query = "packaged drinking water"
    candidates, _ = hybrid_retriever.retrieve_candidates(query=query)

    # Check deduplication
    keys = [c.deduplication_key for c in candidates]
    assert len(keys) == len(set(keys)), "Candidate list contains duplicate items!"

    # Check score normalization range [0.0, 1.0]
    for c in candidates:
        assert 0.0 <= c.final_score <= 1.0
        assert 0.0 <= c.normalized_score <= 1.0


# -----------------------------------------------------------------------------
# 4. Confidence Score Calculation
# -----------------------------------------------------------------------------

def test_confidence_calculation_high_agreement():
    candidates = [
        RetrievedCandidate(
            source_type="standard",
            standard_number="IS 14543",
            title="Packaged Drinking Water",
            content="Specification for packaged drinking water other than mineral water",
            bm25_score=0.95,
            vector_score=0.92,
            rerank_score=0.94,
            final_score=0.94
        ),
        RetrievedCandidate(
            source_type="standard",
            standard_number="IS 13428",
            title="Packaged Natural Mineral Water",
            content="Specification for packaged natural mineral water",
            bm25_score=0.70,
            vector_score=0.65,
            rerank_score=0.68,
            final_score=0.68
        )
    ]

    conf_score, conf_level, breakdown = hybrid_retriever.calculate_confidence(
        top_candidates=candidates,
        intent="lookup",
        entities={"standard_number": "IS 14543"}
    )

    assert conf_level in ["HIGH", "VERY_HIGH"]
    assert conf_score >= 0.70
    assert breakdown["exact_standard_match"] is True


def test_confidence_calculation_empty_candidates():
    conf_score, conf_level, breakdown = hybrid_retriever.calculate_confidence(
        top_candidates=[],
        intent="general",
        entities={}
    )
    assert conf_level == "LOW"
    assert conf_score <= 0.35


# -----------------------------------------------------------------------------
# 5. Generator Context & Citation Prompt Verification
# -----------------------------------------------------------------------------

def test_generator_prompt_and_context_construction():
    sources = [
        SourceCitation(
            source_type="standard",
            standard_number="IS 269:2015",
            title="Ordinary Portland Cement — Specification",
            clause="Clause 6.1",
            content="The compressive strength of 33 grade OPC shall be not less than 33 MPa at 28 days.",
            final_score=0.95
        )
    ]

    answer = generate_rag_answer(
        query="What is the standard for Ordinary Portland Cement?",
        intent="SPECIFICATION",
        entities={"standard_number": "IS 269"},
        sources=sources,
        confidence_level="HIGH"
    )

    assert "IS 269" in answer or "Ordinary Portland Cement" in answer
    # Test system prompt contains anti-hallucination constraint
    assert "DO NOT invent" in SYSTEM_PROMPT or "NEVER fabricate" in SYSTEM_PROMPT


# -----------------------------------------------------------------------------
# 6. Benchmark & Training Dataset Integrity Tests
# -----------------------------------------------------------------------------

def test_benchmark_100_integrity():
    import json
    from pathlib import Path
    benchmark_file = Path(__file__).resolve().parent.parent / "data" / "evaluation" / "rag_benchmark_100.jsonl"
    assert benchmark_file.exists(), f"Benchmark file missing at {benchmark_file}"

    records = []
    with open(benchmark_file, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                records.append(json.loads(line))

    assert len(records) == 100, f"Expected 100 benchmark questions, found {len(records)}"

    # Category checks
    cats = [r["category"] for r in records]
    assert cats.count("standard_lookup") == 15
    assert cats.count("product_lookup") == 10
    assert cats.count("clause_lookup") == 15
    assert cats.count("technical_engineering") == 15
    assert cats.count("booklet_department") == 10
    assert cats.count("cross_source") == 10
    assert cats.count("ambiguous_fuzzy") == 10
    assert cats.count("similar_overlapping") == 5
    assert cats.count("exact_citation") == 5
    assert cats.count("insufficient_evidence") == 5

    # Difficulty checks
    diffs = [r["difficulty"] for r in records]
    assert diffs.count("easy") == 25
    assert diffs.count("medium") == 45
    assert diffs.count("difficult") == 30

    # Answerability
    answerable = [r for r in records if r["answerable"]]
    unsupported = [r for r in records if not r["answerable"]]
    assert len(answerable) == 95
    assert len(unsupported) == 5


def test_reranker_training_dataset_integrity():
    import json
    from pathlib import Path
    training_file = Path(__file__).resolve().parent.parent / "data" / "evaluation" / "reranker_training_100.jsonl"
    assert training_file.exists(), f"Training file missing at {training_file}"

    records = []
    with open(training_file, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                records.append(json.loads(line))

    assert len(records) == 95
    for r in records:
        assert "query" in r
        assert "positive" in r
        assert "hard_negatives" in r
        assert len(r["hard_negatives"]) >= 1


