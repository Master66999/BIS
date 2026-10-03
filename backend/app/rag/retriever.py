"""
BIS SmartAssist - Improved Hybrid RAG Retriever
Combines BM25 Lexical Ranking, Dense Neural Vector Search, Multi-Source Candidate Pooling,
Cross-Encoder Reranking, and Multi-Signal Calibrated Confidence Estimation.
"""

import os
import re
import json
import time
import logging
import numpy as np
from typing import List, Dict, Any, Tuple, Optional
from sqlalchemy.orm import Session
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

try:
    from rank_bm25 import BM25Okapi
except ImportError:
    BM25Okapi = None


class PureBM25Okapi:
    """
    Pure Python/NumPy BM25Okapi implementation with inverted index for fast retrieval.
    Guarantees BM25 functionality even if rank_bm25 package is not installed.
    """
    def __init__(self, corpus: List[List[str]], k1: float = 1.5, b: float = 0.75):
        self.k1 = k1
        self.b = b
        self.corpus_size = len(corpus)
        self.doc_len = np.array([len(x) for x in corpus], dtype=np.float32)
        self.avgdl = float(np.mean(self.doc_len)) if self.corpus_size > 0 else 1.0
        
        self.inverted_index: Dict[str, List[Tuple[int, int]]] = {}
        self.idf: Dict[str, float] = {}

        for doc_id, doc in enumerate(corpus):
            freqs = {}
            for w in doc:
                freqs[w] = freqs.get(w, 0) + 1
            for w, count in freqs.items():
                if w not in self.inverted_index:
                    self.inverted_index[w] = []
                self.inverted_index[w].append((doc_id, count))

        for w, postings in self.inverted_index.items():
            df = len(postings)
            idf_val = np.log((self.corpus_size - df + 0.5) / (df + 0.5) + 1.0)
            self.idf[w] = float(max(1e-5, idf_val))

    def get_scores(self, query: List[str]) -> np.ndarray:
        scores = np.zeros(self.corpus_size, dtype=np.float32)
        for q in query:
            if q not in self.inverted_index:
                continue
            q_idf = self.idf[q]
            postings = self.inverted_index[q]
            for doc_id, freq in postings:
                d_len = self.doc_len[doc_id]
                denom = freq + self.k1 * (1.0 - self.b + self.b * (d_len / self.avgdl))
                scores[doc_id] += q_idf * (freq * (self.k1 + 1.0)) / max(1e-5, denom)
        return scores


BM25_ENGINE = BM25Okapi if BM25Okapi is not None else PureBM25Okapi

from backend.app.core.config import settings
from backend.app.models.models import DocumentChunk, Document, Standard
from backend.app.schemas.schemas import SourceCitation
from backend.app.rag.candidate import RetrievedCandidate
from backend.app.rag.reranker import reranker
from backend.app.rag.rl_optimizer import rl_optimizer

logger = logging.getLogger(__name__)

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
LOCAL_MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "bis_embedding_model")
STANDARDS_VECTORS_PATH = os.path.join(PROJECT_ROOT, "data", "processed", "standards_embeddings.npy")
STANDARDS_META_PATH = os.path.join(PROJECT_ROOT, "data", "processed", "standards_metadata.json")
CHUNKS_VECTORS_PATH = os.path.join(PROJECT_ROOT, "data", "processed", "chunks_embeddings.npy")
CHUNKS_META_PATH = os.path.join(PROJECT_ROOT, "data", "processed", "chunks_metadata.json")
BOOKLETS_META_PATH = os.path.join(PROJECT_ROOT, "data", "processed", "booklet_chunks_metadata.json")
from backend.app.rag.query_understanding import normalize_standard_id, expand_query_for_retrieval

CHROMA_DB_PATH = os.path.join(PROJECT_ROOT, "data", "chroma_db")


def tokenize_text(text: str) -> List[str]:
    """Helper to tokenize text for BM25 search."""
    if not text:
        return []
    return re.findall(r'\b\w+\b', text.lower())


def extract_std_components(std_str: str) -> Tuple[str, Optional[str], Optional[str]]:
    """Extracts (base_id, part, year) using strict normalization."""
    return normalize_standard_id(std_str)


def standards_match(std1: str, std2: str, strict_year: bool = False) -> bool:
    """
    Strict standard matching accounting for variations in year, part, spacing, and casing.
    Never treats different parts (e.g. Part 1 vs Part 3) as identical.
    """
    if not std1 or not std2:
        return False
    s1, s2 = std1.strip().upper(), std2.strip().upper()
    if s1 == s2:
        return True
    b1, p1, y1 = normalize_standard_id(std1)
    b2, p2, y2 = normalize_standard_id(std2)
    if not b1 or not b2 or b1 != b2:
        return False
    # Strict part matching: if both have parts, they must match
    if p1 and p2 and p1 != p2:
        return False
    # If one standard is explicitly querying a specific part, don't match mismatched parts
    if strict_year and y1 and y2 and y1 != y2:
        return False
    return True


class HybridRetriever:
    """
    Production-grade hybrid retriever combining BM25, Neural Dense Vectors,
    Candidate Pooling, Cross-Encoder Reranking, and Multi-Signal Confidence Estimation.
    """

    def __init__(self):
        # TF-IDF fallback vectorizer
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            sublinear_tf=True,
            stop_words='english'
        )
        self.is_fitted = False
        self.chunk_ids = []
        self.corpus_matrix = None

        # Neural bi-encoder (Sentence-Transformers)
        self.neural_model = None
        self.standards_vectors: Optional[np.ndarray] = None
        self.standards_meta: Optional[List[Dict[str, Any]]] = None
        self.chunks_vectors: Optional[np.ndarray] = None
        self.chunks_meta: Optional[List[Dict[str, Any]]] = None
        self.booklets_meta: Optional[List[Dict[str, Any]]] = None

        # BM25 Lexical search models
        self.bm25_standards: Any = None
        self.bm25_chunks: Any = None
        self.bm25_booklets: Any = None

        # Fallback TF-IDF vector indices
        self.standards_tfidf_vectorizer: Optional[TfidfVectorizer] = None
        self.standards_tfidf_matrix: Any = None
        self.chunks_tfidf_vectorizer: Optional[TfidfVectorizer] = None
        self.chunks_tfidf_matrix: Any = None

        # ChromaDB vector database client
        self.chroma_client = None
        self.chroma_standards = None
        self.chroma_clauses = None
        self.chroma_booklets = None

        self._load_neural_resources()

    def _load_neural_resources(self):
        """Attempts to load fine-tuned model, precomputed vector indices, ChromaDB, and BM25 indices."""
        try:
            if os.path.exists(LOCAL_MODEL_PATH):
                from sentence_transformers import SentenceTransformer
                import torch
                device = "cuda" if torch.cuda.is_available() else "cpu"
                self.neural_model = SentenceTransformer(LOCAL_MODEL_PATH, device=device)
                logger.info(f"Loaded fine-tuned BIS Neural Model from {LOCAL_MODEL_PATH} on {device}")
        except Exception as e:
            logger.warning(f"Could not load neural embedding model: {e}")

        try:
            if os.path.exists(CHROMA_DB_PATH):
                import chromadb
                self.chroma_client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
                try:
                    self.chroma_standards = self.chroma_client.get_collection("bis_standards")
                except Exception:
                    pass
                try:
                    self.chroma_clauses = self.chroma_client.get_collection("bis_clauses")
                except Exception:
                    pass
                try:
                    self.chroma_booklets = self.chroma_client.get_collection("bis_booklets")
                except Exception:
                    pass
                logger.info(f"Connected to persistent ChromaDB at {CHROMA_DB_PATH}")
        except Exception as e:
            logger.warning(f"ChromaDB collection connection error: {e}")

        # Standards index & BM25
        try:
            if os.path.exists(STANDARDS_META_PATH):
                with open(STANDARDS_META_PATH, "r", encoding="utf-8") as f:
                    self.standards_meta = json.load(f)
                logger.info(f"Loaded {len(self.standards_meta)} published standards metadata.")

                if os.path.exists(STANDARDS_VECTORS_PATH):
                    try:
                        self.standards_vectors = np.load(STANDARDS_VECTORS_PATH)
                    except Exception:
                        pass

                std_corpus = [
                    tokenize_text(f"{m.get('standard_number', '')} {m.get('title', '')} {m.get('product_category', '')} {m.get('type_of_standard', '')}")
                    for m in self.standards_meta
                ]
                self.bm25_standards = BM25_ENGINE(std_corpus)
                logger.info(f"Initialized BM25 index over {len(self.standards_meta)} published standards.")

                # If neural model is not available, build TF-IDF vector matrix for dense semantic fallback
                if self.neural_model is None:
                    self.standards_tfidf_vectorizer = TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True, max_features=25000)
                    std_texts = [
                        f"{m.get('standard_number', '')} {m.get('title', '')} {m.get('product_category', '')}"
                        for m in self.standards_meta
                    ]
                    self.standards_tfidf_matrix = self.standards_tfidf_vectorizer.fit_transform(std_texts)
                    logger.info("Initialized TF-IDF standards semantic vector index.")
        except Exception as e:
            logger.warning(f"Could not load standards vector/BM25 index: {e}")

        # Clause chunks index & BM25
        try:
            if os.path.exists(CHUNKS_META_PATH):
                with open(CHUNKS_META_PATH, "r", encoding="utf-8") as f:
                    self.chunks_meta = json.load(f)
                logger.info(f"Loaded {len(self.chunks_meta)} clause chunks metadata.")

                if os.path.exists(CHUNKS_VECTORS_PATH):
                    try:
                        self.chunks_vectors = np.load(CHUNKS_VECTORS_PATH)
                    except Exception:
                        pass

                chunk_corpus = [
                    tokenize_text(f"{c.get('standard_number', '')} {c.get('title', '')} {c.get('clause_number', '')} {c.get('content', '')}")
                    for c in self.chunks_meta
                ]
                self.bm25_chunks = BM25_ENGINE(chunk_corpus)
                logger.info(f"Initialized BM25 index over {len(self.chunks_meta)} clause chunks.")

                if self.neural_model is None:
                    self.chunks_tfidf_vectorizer = TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True)
                    ch_texts = [
                        f"{c.get('standard_number', '')} {c.get('title', '')} {c.get('clause_number', '')} {c.get('content', '')}"
                        for c in self.chunks_meta
                    ]
                    self.chunks_tfidf_matrix = self.chunks_tfidf_vectorizer.fit_transform(ch_texts)
        except Exception as e:
            logger.warning(f"Could not load chunks vector/BM25 index: {e}")

        # Booklets metadata & BM25
        try:
            if os.path.exists(BOOKLETS_META_PATH):
                with open(BOOKLETS_META_PATH, "r", encoding="utf-8") as f:
                    self.booklets_meta = json.load(f)
                if self.booklets_meta:
                    bk_corpus = [
                        tokenize_text(f"{b.get('department', '')} {b.get('booklet_name', '')} {b.get('content', '')}")
                        for b in self.booklets_meta
                    ]
                    self.bm25_booklets = BM25_ENGINE(bk_corpus)
                    logger.info(f"Initialized BM25 index over {len(self.booklets_meta)} booklet chunks.")
        except Exception as e:
            logger.warning(f"Could not load booklets metadata: {e}")

    def fit_corpus(self, chunks: List[DocumentChunk]):
        """Fits in-memory TF-IDF vectorizer over DB chunks as fallback."""
        if not chunks:
            return
        self.chunk_ids = [c.id for c in chunks]
        texts = [
            f"{c.standard_number or ''} {c.title} {c.clause_number or ''} {c.product_category or ''} {c.content}"
            for c in chunks
        ]
        self.corpus_matrix = self.vectorizer.fit_transform(texts)
        self.is_fitted = True

    # -------------------------------------------------------------------------
    # Channel Retrieval: Standards Catalogue
    # -------------------------------------------------------------------------
    def _retrieve_standards_candidates(
        self,
        query: str,
        bm25_top_k: int,
        vector_top_k: int,
        w_dense: float,
        w_bm25: float,
        category: Optional[str] = None
    ) -> List[RetrievedCandidate]:
        if not self.standards_meta:
            return []

        candidates_map: Dict[int, RetrievedCandidate] = {}
        tokenized_q = tokenize_text(query)

        # 1. BM25 search over standards
        if self.bm25_standards is not None and tokenized_q:
            bm25_scores = self.bm25_standards.get_scores(tokenized_q)
            max_bm = max(bm25_scores) if len(bm25_scores) > 0 and max(bm25_scores) > 0 else 1.0
            top_bm_indices = np.argsort(bm25_scores)[::-1][:bm25_top_k]
            for idx in top_bm_indices:
                raw_score = float(bm25_scores[idx])
                if raw_score > 0.0:
                    norm_bm = float(raw_score / max_bm)
                    meta = self.standards_meta[idx]
                    cand = RetrievedCandidate(
                        source_type="standard",
                        title=meta.get("title", ""),
                        standard_number=meta.get("standard_number"),
                        content=f"{meta.get('standard_number')}: {meta.get('title')} ({meta.get('product_category')}). Type: {meta.get('type_of_standard')}.",
                        source_url=meta.get("source_url") or "https://www.services.bis.gov.in/",
                        bm25_score=norm_bm,
                        metadata=meta
                    )
                    candidates_map[idx] = cand

        # 2. Vector search over standards (Neural or TF-IDF dense)
        if self.neural_model is not None and self.standards_vectors is not None:
            q_vec = self.neural_model.encode([query], normalize_embeddings=True, convert_to_numpy=True)
            dense_scores = np.dot(self.standards_vectors, q_vec.T).flatten()
            top_vec_indices = np.argsort(dense_scores)[::-1][:vector_top_k]
            for idx in top_vec_indices:
                v_score = float(dense_scores[idx])
                meta = self.standards_meta[idx]
                if idx in candidates_map:
                    candidates_map[idx].vector_score = max(0.0, v_score)
                else:
                    cand = RetrievedCandidate(
                        source_type="standard",
                        title=meta.get("title", ""),
                        standard_number=meta.get("standard_number"),
                        content=f"{meta.get('standard_number')}: {meta.get('title')} ({meta.get('product_category')}). Type: {meta.get('type_of_standard')}.",
                        source_url=meta.get("source_url") or "https://www.services.bis.gov.in/",
                        vector_score=max(0.0, v_score),
                        metadata=meta
                    )
                    candidates_map[idx] = cand
        elif self.standards_tfidf_matrix is not None and self.standards_tfidf_vectorizer is not None:
            q_vec = self.standards_tfidf_vectorizer.transform([query])
            dense_scores = cosine_similarity(q_vec, self.standards_tfidf_matrix).flatten()
            top_vec_indices = np.argsort(dense_scores)[::-1][:vector_top_k]
            for idx in top_vec_indices:
                v_score = float(dense_scores[idx])
                if v_score > 0.0:
                    meta = self.standards_meta[idx]
                    if idx in candidates_map:
                        candidates_map[idx].vector_score = max(0.0, v_score)
                    else:
                        cand = RetrievedCandidate(
                            source_type="standard",
                            title=meta.get("title", ""),
                            standard_number=meta.get("standard_number"),
                            content=f"{meta.get('standard_number')}: {meta.get('title')} ({meta.get('product_category')}). Type: {meta.get('type_of_standard')}.",
                            source_url=meta.get("source_url") or "https://www.services.bis.gov.in/",
                            vector_score=max(0.0, v_score),
                            metadata=meta
                        )
                        candidates_map[idx] = cand

        # Filter and compute normalized hybrid score
        results = []
        for idx, cand in candidates_map.items():
            if category and category != "All":
                if cand.metadata.get("product_category", "").lower() != category.lower():
                    continue
            cand.normalized_score = float((w_dense * cand.vector_score) + (w_bm25 * cand.bm25_score))
            cand.final_score = cand.normalized_score
            results.append(cand)

        return results

    # -------------------------------------------------------------------------
    # Channel Retrieval: Deep Clause Chunks
    # -------------------------------------------------------------------------
    def _retrieve_chunks_candidates(
        self,
        db: Session,
        query: str,
        bm25_top_k: int,
        vector_top_k: int,
        w_dense: float,
        w_bm25: float
    ) -> List[RetrievedCandidate]:
        chunks = db.query(DocumentChunk).all()
        if not chunks:
            return []

        candidates_map: Dict[int, RetrievedCandidate] = {}
        tokenized_q = tokenize_text(query)

        # 1. BM25 over chunks
        if self.bm25_chunks is not None and tokenized_q:
            bm25_scores = self.bm25_chunks.get_scores(tokenized_q)
            max_bm = max(bm25_scores) if len(bm25_scores) > 0 and max(bm25_scores) > 0 else 1.0
            top_bm_indices = np.argsort(bm25_scores)[::-1][:bm25_top_k]
            for idx in top_bm_indices:
                raw_score = float(bm25_scores[idx])
                if raw_score > 0.05 and idx < len(chunks):
                    norm_bm = float(raw_score / max_bm)
                    ch = chunks[idx]
                    cand = RetrievedCandidate(
                        source_type="clause",
                        title=ch.title,
                        standard_number=ch.standard_number,
                        clause=ch.clause_number,
                        sub_clause=ch.sub_clause,
                        page=ch.page_number,
                        document_id=ch.document_id,
                        content=ch.content,
                        bm25_score=norm_bm
                    )
                    candidates_map[idx] = cand

        # 2. Vector search over chunks
        if self.neural_model is not None and self.chunks_vectors is not None and len(self.chunks_vectors) == len(chunks):
            q_vec = self.neural_model.encode([query], normalize_embeddings=True, convert_to_numpy=True)
            dense_scores = np.dot(self.chunks_vectors, q_vec.T).flatten()
            top_vec_indices = np.argsort(dense_scores)[::-1][:vector_top_k]
            for idx in top_vec_indices:
                v_score = float(dense_scores[idx])
                ch = chunks[idx]
                if idx in candidates_map:
                    candidates_map[idx].vector_score = max(0.0, v_score)
                else:
                    cand = RetrievedCandidate(
                        source_type="clause",
                        title=ch.title,
                        standard_number=ch.standard_number,
                        clause=ch.clause_number,
                        sub_clause=ch.sub_clause,
                        page=ch.page_number,
                        document_id=ch.document_id,
                        content=ch.content,
                        vector_score=max(0.0, v_score)
                    )
                    candidates_map[idx] = cand
        else:
            # TF-IDF fallback vector search
            if not self.is_fitted or len(self.chunk_ids) != len(chunks):
                self.fit_corpus(chunks)
            if self.corpus_matrix is not None:
                q_tfidf = self.vectorizer.transform([query])
                dense_scores = cosine_similarity(q_tfidf, self.corpus_matrix)[0]
                top_vec_indices = np.argsort(dense_scores)[::-1][:vector_top_k]
                for idx in top_vec_indices:
                    v_score = float(dense_scores[idx])
                    ch = chunks[idx]
                    if idx in candidates_map:
                        candidates_map[idx].vector_score = max(0.0, v_score)
                    else:
                        cand = RetrievedCandidate(
                            source_type="clause",
                            title=ch.title,
                            standard_number=ch.standard_number,
                            clause=ch.clause_number,
                            sub_clause=ch.sub_clause,
                            page=ch.page_number,
                            document_id=ch.document_id,
                            content=ch.content,
                            vector_score=max(0.0, v_score)
                        )
                        candidates_map[idx] = cand

        results = []
        for idx, cand in candidates_map.items():
            cand.normalized_score = float((w_dense * cand.vector_score) + (w_bm25 * cand.bm25_score))
            cand.final_score = cand.normalized_score
            results.append(cand)

        return results

    # -------------------------------------------------------------------------
    # Channel Retrieval: Departmental Booklets
    # -------------------------------------------------------------------------
    def _retrieve_booklet_candidates(
        self,
        query: str,
        top_k: int = 15
    ) -> List[RetrievedCandidate]:
        results = []
        if self.chroma_booklets is None and self.chroma_client is not None:
            try:
                self.chroma_booklets = self.chroma_client.get_collection("bis_booklets")
            except Exception:
                pass

        if self.chroma_booklets is not None and self.neural_model is not None:
            try:
                q_vec = self.neural_model.encode([query], normalize_embeddings=True).tolist()
                res = self.chroma_booklets.query(query_embeddings=q_vec, n_results=top_k)
                if res and "documents" in res and res["documents"] and len(res["documents"][0]) > 0:
                    for doc, meta, dist in zip(res["documents"][0], res["metadatas"][0], res["distances"][0]):
                        sim = max(0.0, min(1.0, 1.0 - float(dist)))
                        cand = RetrievedCandidate(
                            source_type="booklet",
                            title=f"{meta.get('department', 'BIS')} - {meta.get('booklet_name', '')}",
                            booklet_name=meta.get("booklet_name"),
                            department=meta.get("department"),
                            page=int(meta.get("page_number", 1)),
                            content=doc,
                            vector_score=sim,
                            normalized_score=sim,
                            final_score=sim,
                            metadata=meta
                        )
                        results.append(cand)
            except Exception as e:
                logger.warning(f"Error querying ChromaDB booklets: {e}")

        # In-memory / BM25 booklet search as well for maximal recall
        if self.booklets_meta:
            tokenized_q = tokenize_text(query)
            if self.bm25_booklets is not None and tokenized_q:
                scores = self.bm25_booklets.get_scores(tokenized_q)
                max_s = max(scores) if len(scores) > 0 and max(scores) > 0 else 1.0
                top_idx = np.argsort(scores)[::-1][:top_k]
                for idx in top_idx:
                    if scores[idx] > 0.05:
                        b = self.booklets_meta[idx]
                        norm_s = float(scores[idx] / max_s)
                        cand = RetrievedCandidate(
                            source_type="booklet",
                            title=f"{b.get('department', 'BIS')} - {b.get('booklet_name', '')}",
                            booklet_name=b.get("booklet_name"),
                            department=b.get("department"),
                            page=int(b.get("page_number", 1)),
                            content=b.get("content", ""),
                            bm25_score=norm_s,
                            normalized_score=norm_s,
                            final_score=norm_s,
                            metadata=b
                        )
                        results.append(cand)

        return results

    # -------------------------------------------------------------------------
    # Calibrated Source Confidence Calculation
    # -------------------------------------------------------------------------
    def calculate_confidence(
        self,
        top_candidates: List[RetrievedCandidate],
        intent: str,
        entities: Dict[str, Any]
    ) -> Tuple[float, str, Dict[str, Any]]:
        """
        Multi-signal confidence calculation:
        1. Top candidate score / margin
        2. Agreement between BM25 & Vector channels
        3. Exact standard number / clause entity verification
        4. Evidence density and source consistency
        """
        if not top_candidates:
            return 0.25, "LOW", {"reason": "No candidate met minimum relevance threshold."}

        top = top_candidates[0]
        top_score = top.final_score
        target_std = (entities.get("standard_number") or "").upper()
        target_clause = (entities.get("clause") or "").lower()

        # Signal 1: Top Candidate Score
        s_top = min(1.0, max(0.0, top_score))

        # Signal 2: Method Agreement
        method_agreement = 1.0 if (top.bm25_score > 0.2 and top.vector_score > 0.2) else (0.75 if (top.vector_score > 0.3 or top.bm25_score > 0.3) else 0.5)

        # Signal 3: Exact Standard Match
        exact_std_match = False
        if target_std and top.standard_number:
            exact_std_match = standards_match(target_std, top.standard_number)

        # Signal 4: Exact Clause Match
        exact_clause_match = False
        if target_clause and top.clause:
            exact_clause_match = (target_clause in top.clause.lower()) or (re.search(r'\d+', target_clause) and re.search(r'\d+', target_clause).group(0) in top.clause.lower())

        s_exact = 1.0 if exact_std_match else (0.85 if exact_clause_match else 0.50)

        # Signal 5: Score Margin
        margin = (top.final_score - top_candidates[1].final_score) if len(top_candidates) > 1 else 0.20
        s_margin = min(1.0, max(0.0, 0.5 + margin))

        # Weighted combination
        raw_confidence = (
            0.35 * s_top +
            0.25 * s_exact +
            0.20 * method_agreement +
            0.20 * s_margin
        )

        final_conf = round(float(min(0.98, max(0.20, raw_confidence))), 2)

        # Categorical Level
        if final_conf >= settings.CONFIDENCE_VERY_HIGH_THRESHOLD:
            level = "VERY_HIGH"
        elif final_conf >= settings.CONFIDENCE_HIGH_THRESHOLD:
            level = "HIGH"
        elif final_conf >= settings.CONFIDENCE_MEDIUM_THRESHOLD:
            level = "MEDIUM"
        else:
            level = "LOW"

        breakdown = {
            "top_candidate_score": round(s_top, 3),
            "exact_standard_match": exact_std_match,
            "exact_clause_match": exact_clause_match,
            "method_agreement": round(method_agreement, 3),
            "score_margin": round(margin, 3),
            "raw_confidence": final_conf
        }

        return final_conf, level, breakdown

    # -------------------------------------------------------------------------
    # Main RAG Retrieval Orchestrator
    # -------------------------------------------------------------------------
    def retrieve(
        self,
        db: Session,
        query: str,
        intent: str,
        entities: Dict[str, Any],
        top_k: Optional[int] = None
    ) -> Tuple[List[SourceCitation], float, str, Dict[str, Any]]:
        """
        Executes end-to-end RAG retrieval pipeline:
        1. Contextual query routing & RL parameter selection
        2. Candidate retrieval across standards, clauses, and booklets
        3. Merging & deduplication
        4. Cross-Encoder reranking
        5. Calibrated confidence calculation
        6. Timing and explainability packaging
        """
        t_start = time.perf_counter()
        query_clean = query.strip()
        final_k = top_k or settings.RAG_FINAL_TOP_K
        bm25_k = settings.RAG_BM25_TOP_K
        vector_k = settings.RAG_VECTOR_TOP_K
        candidate_pool_limit = settings.RAG_CANDIDATE_TOP_K

        target_std_raw = entities.get("standard_number") or ""
        target_product = (entities.get("product") or "").lower()

        # 1. Query Routing, RL Policy & Adaptive Candidate Pooling
        query_type = entities.get("query_type") or "standard_lookup"
        rl_action = rl_optimizer.select_action(query_clean, intent, entities)
        w_dense = rl_action.get("dense_weight", 0.55)
        w_bm25 = rl_action.get("bm25_weight", 0.45)
        exact_boost = rl_action.get("exact_boost", 0.35)

        # Expand query strictly for candidate generation
        retrieval_query = expand_query_for_retrieval(query_clean)

        # Dynamic Candidate Pool sizing based on query type (Requirements 4 & 5)
        if query_type in ["ambiguous_query", "technical_requirement", "cross_source_query", "product_lookup"]:
            bm25_k = 50
            vector_k = 50
            chunk_k = 30
            booklet_k = 20
            candidate_pool_limit = 60
        elif query_type == "booklet_query":
            bm25_k = 30
            vector_k = 30
            chunk_k = 15
            booklet_k = 30
            candidate_pool_limit = 60
        elif query_type == "clause_lookup":
            bm25_k = 35
            vector_k = 35
            chunk_k = 40
            booklet_k = 10
            candidate_pool_limit = 40
        else:
            bm25_k = 25
            vector_k = 25
            chunk_k = 15
            booklet_k = 10
            candidate_pool_limit = settings.RAG_CANDIDATE_TOP_K

        t_retrieval_start = time.perf_counter()
        candidates_pool: List[RetrievedCandidate] = []

        # 2. Candidate Generation across channels using expanded retrieval query
        # A. Chunks Channel
        chunk_cands = self._retrieve_chunks_candidates(db, retrieval_query, chunk_k, chunk_k, w_dense, w_bm25)
        candidates_pool.extend(chunk_cands)

        # B. Standards Catalogue Channel
        std_cands = self._retrieve_standards_candidates(retrieval_query, bm25_k, vector_k, w_dense, w_bm25)
        candidates_pool.extend(std_cands)

        # C. Booklets Channel (prioritized for technical & domain queries)
        is_booklet_domain = (
            query_type in ["booklet_query", "cross_source_query", "technical_requirement"] or
            any(term in query_clean.lower() for term in [
                "braking", "brake", "automotive", "engine", "textile", "medical textile",
                "agrotextile", "building material", "petroleum", "machine safety", "powder metallurgy",
                "heat treatment", "ayush", "water resources", "handout", "booklet", "ted", "txd", "pgd", "pcd", "wrd", "mtd"
            ])
        )
        if is_booklet_domain or intent in ["TESTING", "PRODUCT_REQUIREMENTS", "DOCUMENT_LOOKUP"]:
            bk_cands = self._retrieve_booklet_candidates(retrieval_query, top_k=booklet_k)
            candidates_pool.extend(bk_cands)

        # Boost exact standard match in candidate pool
        if target_std_raw:
            for c in candidates_pool:
                if c.standard_number and standards_match(target_std_raw, c.standard_number):
                    c.normalized_score = min(1.0, c.normalized_score + exact_boost)
                    c.final_score = c.normalized_score

        t_retrieval_end = time.perf_counter()
        retrieval_ms = round((t_retrieval_end - t_retrieval_start) * 1000, 2)

        # 3. Deduplication & Candidate Pool Truncation
        dedup_map: Dict[str, RetrievedCandidate] = {}
        for c in candidates_pool:
            key = c.deduplication_key
            if key not in dedup_map or c.normalized_score > dedup_map[key].normalized_score:
                dedup_map[key] = c

        merged_candidates = list(dedup_map.values())
        merged_candidates.sort(key=lambda x: x.normalized_score, reverse=True)
        top_candidates = merged_candidates[:candidate_pool_limit]

        # 4. Cross-Encoder Reranking
        t_rerank_start = time.perf_counter()
        reranked_candidates, rerank_diag = reranker.rerank(
            query=query_clean,
            candidates=top_candidates,
            top_k=final_k
        )
        t_rerank_end = time.perf_counter()
        rerank_ms = round((t_rerank_end - t_rerank_start) * 1000, 2)

        # Fallback to direct DB standard lookup if no candidate found
        if not reranked_candidates and target_std_raw:
            b_target, _, _ = extract_std_components(target_std_raw)
            if b_target:
                candidate_stds = db.query(Standard).filter(Standard.standard_number.ilike(f"%{b_target}%")).all()
                for c_std in candidate_stds:
                    if standards_match(target_std_raw, c_std.standard_number):
                        exact_cand = RetrievedCandidate(
                            source_type="standard",
                            title=c_std.title,
                            standard_number=c_std.standard_number,
                            clause="Published Indian Standard",
                            page=1,
                            content=c_std.summary or f"{c_std.standard_number}: {c_std.title} ({c_std.product_category or 'General'}).",
                            source_url=c_std.source_url or "https://www.services.bis.gov.in/",
                            final_score=0.95
                        )
                        reranked_candidates = [exact_cand]
                        break

        # 5. Multi-Signal Confidence Estimation
        confidence_val, conf_level, conf_breakdown = self.calculate_confidence(
            reranked_candidates, intent, entities
        )

        total_ms = round((time.perf_counter() - t_start) * 1000, 2)

        # Convert to SourceCitation list
        citations = [c.to_citation() for c in reranked_candidates]

        timing_data = {
            "retrieval_ms": retrieval_ms,
            "rerank_ms": rerank_ms,
            "total_ms": total_ms
        }

        search_strategy = (
            f"Hybrid (BM25 + Dense Vectors) + {rerank_diag['reranker_model']} Reranker"
            if rerank_diag.get("applied")
            else f"Hybrid RL Policy ({int(w_dense*100)}% Dense, {int(w_bm25*100)}% BM25)"
        )

        explain_data = {
            "top_score": round(reranked_candidates[0].final_score, 3) if reranked_candidates else 0.0,
            "candidates_pooled": len(merged_candidates),
            "reranked_count": len(reranked_candidates),
            "search_strategy": search_strategy,
            "rl_action": rl_action,
            "timing_ms": timing_data,
            "confidence_breakdown": conf_breakdown,
            "reranker_applied": rerank_diag.get("applied", False),
            "evidence_clauses": [
                f"{c.standard_number or c.booklet_name or ''} {c.clause or ''}".strip()
                for c in citations
            ]
        }

        return citations, confidence_val, conf_level, explain_data

    def retrieve_candidates(
        self,
        query: str,
        category: Optional[str] = None,
        top_k: Optional[int] = None
    ) -> Tuple[List[RetrievedCandidate], Dict[str, float]]:
        """Convenience method to retrieve and rerank candidate pool with timing."""
        t_start = time.perf_counter()
        k = top_k or settings.RAG_FINAL_TOP_K
        std_cands = self._retrieve_standards_candidates(
            query=query,
            bm25_top_k=settings.RAG_BM25_TOP_K,
            vector_top_k=settings.RAG_VECTOR_TOP_K,
            w_dense=0.55,
            w_bm25=0.45,
            category=category
        )
        bk_cands = self._retrieve_booklet_candidates(query=query, top_k=15)
        
        # Deduplicate
        seen = set()
        merged = []
        for c in std_cands + bk_cands:
            key = c.deduplication_key
            if key not in seen:
                seen.add(key)
                merged.append(c)

        t_retrieval = round((time.perf_counter() - t_start) * 1000, 2)
        reranked, diag = reranker.rerank(query=query, candidates=merged, top_k=k)
        t_total = round((time.perf_counter() - t_start) * 1000, 2)
        
        timing = {
            "retrieval_ms": t_retrieval,
            "reranking_ms": diag.get("rerank_ms", 0.0),
            "total_retrieval_ms": t_total
        }
        return reranked, timing


    # -------------------------------------------------------------------------
    # Backward Compatibility Methods
    # -------------------------------------------------------------------------
    def search_standards_semantic(
        self,
        query: str,
        top_k: int = 5,
        category: Optional[str] = None,
        w_dense: Optional[float] = None,
        w_bm25: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        cands = self._retrieve_standards_candidates(
            query=query,
            bm25_top_k=25,
            vector_top_k=25,
            w_dense=w_dense if w_dense is not None else 0.55,
            w_bm25=w_bm25 if w_bm25 is not None else 0.45,
            category=category
        )
        cands.sort(key=lambda x: x.final_score, reverse=True)
        results = []
        for c in cands[:top_k]:
            item = dict(c.metadata) if c.metadata else {
                "standard_number": c.standard_number,
                "title": c.title
            }
            item["semantic_score"] = round(c.final_score, 3)
            results.append(item)
        return results

    def search_booklets(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        cands = self._retrieve_booklet_candidates(query, top_k=top_k)
        return [
            {
                "booklet_name": c.booklet_name,
                "department": c.department,
                "page_number": c.page,
                "similarity_score": round(c.final_score, 3),
                "snippet": c.content
            }
            for c in cands[:top_k]
        ]

    def query_chromadb(
        self,
        query: str,
        n_results: int = 5,
        where: Optional[Dict[str, Any]] = None,
        target: str = "standards"
    ) -> Dict[str, Any]:
        if target == "standards":
            collection = self.chroma_standards
        elif target == "booklets":
            collection = self.chroma_booklets
        else:
            collection = self.chroma_clauses

        if collection is None or self.neural_model is None:
            return {"error": "ChromaDB collection or neural model not initialized."}

        q_vec = self.neural_model.encode([query], normalize_embeddings=True).tolist()
        return collection.query(
            query_embeddings=q_vec,
            n_results=n_results,
            where=where
        )


# Global singleton instance
hybrid_retriever = HybridRetriever()
