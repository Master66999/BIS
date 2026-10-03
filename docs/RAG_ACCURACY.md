# BIS SmartAssist - RAG Accuracy Architecture & Evaluation Guide

## 1. Overview
The Bureau of Indian Standards (BIS) SmartAssist RAG pipeline combines lexical (BM25) and semantic vector retrieval over **23,866 Indian Standards**, deep **clause-level chunk extractions**, and **17 official technical department booklets** with cross-encoder neural reranking and multi-signal confidence estimation.

---

## 2. RAG Pipeline Architecture

```
                                 USER QUERY
                                     │
                        ┌────────────┴────────────┐
                        ▼                         ▼
            Intent & Entity Extraction    RL Dynamic Weighting
                        │                         │
                        ▼                         ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                  CANDIDATE POOLING ENGINE                   │
   │  ┌─────────────────────────┐   ┌─────────────────────────┐  │
   │  │   BM25 Lexical Channel  │   │  Dense Vector Channel   │  │
   │  │ (Standards/Chunks/Bklt) │   │ (Standards/Chunks/Bklt) │  │
   │  │     Top 30 Candidates   │   │    Top 30 Candidates    │  │
   │  └────────────┬────────────┘   └────────────┬────────────┘  │
   └───────────────┼─────────────────────────────┼───────────────┘
                   └──────────────┬──────────────┘
                                  ▼
                     Deduplication & Normalization
                                  │
                                  ▼
                   CROSS-ENCODER RERANKING STAGE
              (Model: cross-encoder/ms-marco-MiniLM-L-6-v2)
                                  │
                                  ▼
                    TOP FINAL CANDIDATES (Top 5–10)
                                  │
                   ┌──────────────┴──────────────┐
                   ▼                             ▼
       Multi-Signal Confidence          Anti-Hallucination
         Calibration Engine              Grounded Context
                   │                             │
                   └──────────────┬──────────────┘
                                  ▼
                          FASTAPI / NEXT.JS UI
```

---

## 3. Retrieval & Candidate Pooling

1. **BM25 Lexical Engine**: `PureBM25Okapi` inverted index with token-frequency weighting ($k_1=1.5, b=0.75$).
2. **Dense Vector Engine**: Precomputed `standards_embeddings.npy` (384-d) with fallback to sublinear TF-IDF semantic cosine similarity.
3. **Multi-Channel Candidate Pooling**:
   - Retrieves `RAG_BM25_TOP_K` (default 30) from BM25.
   - Retrieves `RAG_VECTOR_TOP_K` (default 30) from dense vectors.
   - Merges and deduplicates via canonical keys: `standard:{id}`, `clause:{id}:{clause}`, `booklet:{name}:{page}`.
   - Normalizes scores into $[0.0, 1.0]$.

---

## 4. Cross-Encoder Reranking & Training

The reranker scores $(Query, Document)$ pairs:
- **Neural Model**: `cross-encoder/ms-marco-MiniLM-L-6-v2`
- **Fallback Mode**: Statistical hybrid scoring blending lexical overlap, standard number exact matches, and clause proximity.
- **Scoring Blend**:
  $$\text{FinalScore} = 0.70 \times \text{RerankScore} + 0.30 \times \text{NormalizedRetrievalScore}$$
- **Training Dataset**: `data/evaluation/reranker_training_100.jsonl` contains 95 query-positive pairs with hard negatives (similar standards, nearby clauses, differing product types).
- **Training Pipeline**: `scripts/train_reranker.py` implements PyTorch DataLoader with `CEBinaryClassificationEvaluator` and 80/20 train/validation split.

---

## 5. Calibrated Source Confidence Estimation

Confidence is derived from five independent signals:
1. **Top Candidate Score ($S_{\text{top}}$)** (35% weight)
2. **Exact Standard / Clause Verification ($S_{\text{exact}}$)** (25% weight)
3. **Retrieval Channel Agreement ($S_{\text{agree}}$)** (20% weight)
4. **Score Margin over Rank 2 ($S_{\text{margin}}$)** (20% weight)

$$\text{Confidence} = 0.35 \cdot S_{\text{top}} + 0.25 \cdot S_{\text{exact}} + 0.20 \cdot S_{\text{agree}} + 0.20 \cdot S_{\text{margin}}$$

Categorical mappings:
- $\ge 0.82 \implies \text{VERY\_HIGH}$
- $\ge 0.68 \implies \text{HIGH}$
- $\ge 0.48 \implies \text{MEDIUM}$
- $< 0.48 \implies \text{LOW}$

---

## 6. 100-Question Evaluation Benchmark & Results

The benchmark (`data/evaluation/rag_benchmark_100.jsonl`) contains **exactly 100 verified questions**:

### Category Breakdown
- **A. Standard ID Lookup**: 15 questions
- **B. Product → Standard**: 10 questions
- **C. Clause / Subclause**: 15 questions
- **D. Technical Engineering**: 15 questions
- **E. BIS Department Booklets**: 10 questions
- **F. Cross-Source Multi-Source**: 10 questions
- **G. Ambiguous / Fuzzy Queries**: 10 questions
- **H. Similar / Overlapping Standards**: 5 questions
- **I. Exact Citation Grounding**: 5 questions
- **J. Insufficient Evidence / Out-of-Scope**: 5 questions

### Difficulty Breakdown
- **Easy**: 25 questions
- **Medium**: 45 questions
- **Difficult**: 30 questions

### Benchmark Metrics (Baseline vs Improved Reranked Pipeline)

| Metric | Baseline (Hybrid RRF) | Improved (Candidate Pooling + Reranker) | Improvement |
| :--- | :---: | :---: | :---: |
| **Recall @ 1** | **78.00%** | **78.00%** | +0.00% |
| **Recall @ 5** | **85.00%** | **85.00%** | +0.00% |
| **Recall @ 10** | **87.00%** | **87.00%** | +0.00% |
| **MRR (Mean Reciprocal Rank)** | **0.8091** | **0.8091** | +0.0000 |
| **NDCG @ 5** | **0.7986** | **0.7986** | +0.0000 |
| **Standard Accuracy** | **84.21%** | **84.21%** | +0.00% |
| **Clause Accuracy** | **100.00%** | **100.00%** | +0.00% |
| **Citation Accuracy** | **95.00%** | **95.00%** | +0.00% |
| **Unsupported Query Accuracy** | **100.00%** | **100.00%** | +0.00% |
| **Average Total Latency** | **54.3 ms** | **55.0 ms** | +0.6 ms |
| **P95 Total Latency** | **83.6 ms** | **87.3 ms** | +3.7 ms |

---

## 7. How to Run Tests, Training & Evaluation

### Run Test Suite
```bash
python tests/run_tests.py
```

### Run 100-Question Evaluation Benchmark
```bash
# Comparative evaluation (Baseline vs Reranked)
python scripts/evaluate_rag.py --mode compare

# Single run evaluation
python scripts/evaluate_rag.py --mode reranked
```

### Run Reranker Training Pipeline
```bash
python scripts/train_reranker.py
```

---

## 8. Configuration Parameters (`.env`)

| Variable | Default | Description |
| :--- | :---: | :--- |
| `RAG_BM25_TOP_K` | `30` | Number of BM25 candidates to retrieve into candidate pool |
| `RAG_VECTOR_TOP_K` | `30` | Number of dense vector candidates to retrieve |
| `RAG_CANDIDATE_TOP_K` | `50` | Maximum candidate pool size before reranking |
| `RAG_FINAL_TOP_K` | `5` | Final top sources returned to generator |
| `RAG_RERANK_ENABLED` | `True` | Enable / disable cross-encoder reranking |
| `RAG_RERANKER_MODEL` | `cross-encoder/ms-marco-MiniLM-L-6-v2` | HuggingFace Cross-Encoder model name |
| `RAG_DEBUG_MODE` | `False` | Log candidate pools, rerank scores, and timings |
| `CONFIDENCE_VERY_HIGH_THRESHOLD` | `0.82` | Threshold for VERY_HIGH confidence |
| `CONFIDENCE_HIGH_THRESHOLD` | `0.68` | Threshold for HIGH confidence |
| `CONFIDENCE_MEDIUM_THRESHOLD` | `0.48` | Threshold for MEDIUM confidence |
