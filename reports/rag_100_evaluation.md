# BIS SmartAssist - 100-Question RAG Evaluation Report

## 1. Executive Summary
This report details the benchmark evaluation of the Bureau of Indian Standards (BIS) SmartAssist RAG system over **100 high-quality, verified questions**. The questions test full-text standards retrieval, clause extraction, technical reasoning, departmental booklets, and hallucination prevention.

---

## 2. Benchmark Comparison (Baseline vs. Reranked)

| Metric | Baseline (Hybrid RRF) | Improved (Candidate Pooling + Reranker) | Improvement |
| :--- | :---: | :---: | :---: |
| **Recall @ 1** | **84.00%** | **90.00%** | +6.00% |
| **Recall @ 5** | **96.00%** | **98.00%** | +2.00% |
| **Recall @ 10** | **96.00%** | **98.00%** | +2.00% |
| **MRR (Mean Reciprocal Rank)** | **0.8875** | **0.9323** | +0.0448 |
| **NDCG @ 5** | **0.8769** | **0.9060** | +0.0291 |
| **Standard Accuracy** | **95.79%** | **97.89%** | +2.10% |
| **Clause Accuracy** | **100.00%** | **100.00%** | +0.00% |
| **Citation Accuracy** | **95.00%** | **95.00%** | +0.00% |
| **Unsupported Query Accuracy** | **100.00%** | **100.00%** | +0.00% |
| **Average Total Latency** | **1460.4 ms** | **2386.1 ms** | +925.7 ms |
| **P95 Total Latency** | **1655.2 ms** | **2941.7 ms** | +1286.5 ms |

---

## 3. Dataset Distribution
- **Total Questions**: 100
- **Category Breakdown**:
  - Standard ID Lookup: 15
  - Product to Standard: 10
  - Clause / Subclause: 15
  - Technical Engineering: 15
  - BIS Department Booklets: 10
  - Cross-Source Multi-Source: 10
  - Ambiguous / Fuzzy Queries: 10
  - Similar / Overlapping Standards: 5
  - Exact Citation Grounding: 5
  - Insufficient Evidence: 5
- **Difficulty Breakdown**:
  - Easy: 25
  - Medium: 45
  - Difficult: 30
