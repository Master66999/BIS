import os
import re
import json
import logging
import numpy as np
from typing import List, Dict, Any, Tuple, Optional
from sqlalchemy.orm import Session
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rank_bm25 import BM25Okapi

from backend.app.models.models import DocumentChunk, Document, Standard
from backend.app.schemas.schemas import SourceCitation
from backend.app.rag.rl_optimizer import rl_optimizer

logger = logging.getLogger(__name__)

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
LOCAL_MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "bis_embedding_model")
STANDARDS_VECTORS_PATH = os.path.join(PROJECT_ROOT, "data", "processed", "standards_embeddings.npy")
STANDARDS_META_PATH = os.path.join(PROJECT_ROOT, "data", "processed", "standards_metadata.json")
CHUNKS_VECTORS_PATH = os.path.join(PROJECT_ROOT, "data", "processed", "chunks_embeddings.npy")
CHUNKS_META_PATH = os.path.join(PROJECT_ROOT, "data", "processed", "chunks_metadata.json")
CHROMA_DB_PATH = os.path.join(PROJECT_ROOT, "data", "chroma_db")

def tokenize_text(text: str) -> List[str]:
    """Helper to tokenize text for BM25 search."""
    if not text:
        return []
    return re.findall(r'\b\w+\b', text.lower())

def extract_std_components(std_str: str) -> Tuple[str, Optional[str], Optional[str]]:
    """Extracts (base_number, part, year) from a standard string like 'IS 1786 (Part 1):2008'"""
    if not std_str:
        return ("", None, None)
    clean = std_str.strip().upper()
    m_base = re.search(r'IS(?:\/([A-Z]+))?\s*(\d+)', clean)
    if not m_base:
        return (clean.replace(" ", ""), None, None)
    base = f"{m_base.group(1) or ''}{m_base.group(2)}"
    m_part = re.search(r'\(PART\s*(\d+)\)', clean)
    part = m_part.group(1) if m_part else None
    m_year = re.search(r':(\d{4})', clean)
    year = m_year.group(1) if m_year else None
    return (base, part, year)

def standards_match(std1: str, std2: str) -> bool:
    if not std1 or not std2:
        return False
    b1, p1, y1 = extract_std_components(std1)
    b2, p2, y2 = extract_std_components(std2)
    if not b1 or not b2 or b1 != b2:
        return False
    if p1 and p2 and p1 != p2:
        return False
    return True

class HybridRetriever:
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

        # BM25 Lexical search models
        self.bm25_standards: Optional[BM25Okapi] = None
        self.bm25_chunks: Optional[BM25Okapi] = None

        # ChromaDB vector database client
        self.chroma_client = None
        self.chroma_standards = None
        self.chroma_clauses = None

        self._load_neural_resources()

    def _load_neural_resources(self):
        """Attempts to load fine-tuned model, precomputed vector indices, and BM25 indices."""
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
                self.chroma_standards = self.chroma_client.get_collection("bis_standards")
                self.chroma_clauses = self.chroma_client.get_collection("bis_clauses")
                logger.info(f"Connected to persistent ChromaDB at {CHROMA_DB_PATH}")
        except Exception as e:
            logger.warning(f"ChromaDB collection connection error: {e}")

        try:
            if os.path.exists(STANDARDS_VECTORS_PATH) and os.path.exists(STANDARDS_META_PATH):
                self.standards_vectors = np.load(STANDARDS_VECTORS_PATH)
                with open(STANDARDS_META_PATH, "r", encoding="utf-8") as f:
                    self.standards_meta = json.load(f)
                logger.info(f"Loaded {len(self.standards_meta)} published standards vectors into memory.")

                # Build BM25 index for all 23,866 standards
                std_corpus = [
                    tokenize_text(f"{m.get('standard_number', '')} {m.get('title', '')} {m.get('product_category', '')} {m.get('type_of_standard', '')}")
                    for m in self.standards_meta
                ]
                self.bm25_standards = BM25Okapi(std_corpus)
                logger.info(f"Initialized BM25 index over {len(self.standards_meta)} published standards.")
        except Exception as e:
            logger.warning(f"Could not load standards vector/BM25 index: {e}")

        try:
            if os.path.exists(CHUNKS_VECTORS_PATH) and os.path.exists(CHUNKS_META_PATH):
                self.chunks_vectors = np.load(CHUNKS_VECTORS_PATH)
                with open(CHUNKS_META_PATH, "r", encoding="utf-8") as f:
                    self.chunks_meta = json.load(f)
                logger.info(f"Loaded {len(self.chunks_meta)} clause chunks vectors into memory.")

                # Build BM25 index for clause chunks
                chunk_corpus = [
                    tokenize_text(f"{c.get('standard_number', '')} {c.get('title', '')} {c.get('clause_number', '')} {c.get('content', '')}")
                    for c in self.chunks_meta
                ]
                self.bm25_chunks = BM25Okapi(chunk_corpus)
                logger.info(f"Initialized BM25 index over {len(self.chunks_meta)} clause chunks.")
        except Exception as e:
            logger.warning(f"Could not load chunks vector/BM25 index: {e}")

    def fit_corpus(self, chunks: List[DocumentChunk]):
        if not chunks:
            return
        self.chunk_ids = [c.id for c in chunks]
        texts = [
            f"{c.standard_number or ''} {c.title} {c.clause_number or ''} {c.product_category or ''} {c.content}"
            for c in chunks
        ]
        self.corpus_matrix = self.vectorizer.fit_transform(texts)
        self.is_fitted = True

    def search_standards_semantic(
        self,
        query: str,
        top_k: int = 5,
        category: Optional[str] = None,
        w_dense: Optional[float] = None,
        w_bm25: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        """
        Performs ultra-accurate Reciprocal Rank Fusion (RRF) combining
        Dense Neural Vector search and BM25 lexical keyword matching across 23,866 Indian Standards.
        Weights are dynamically provided by the Contextual Reinforcement Learning Policy.
        """
        if self.standards_meta is None:
            return []

        dense_ranks: Dict[int, int] = {}
        bm25_ranks: Dict[int, int] = {}

        # 1. Dense Neural Search
        if self.neural_model is not None and self.standards_vectors is not None:
            q_vec = self.neural_model.encode([query], normalize_embeddings=True, convert_to_numpy=True)
            dense_scores = np.dot(self.standards_vectors, q_vec.T).flatten()
            sorted_dense_indices = np.argsort(dense_scores)[::-1]
            for rank, idx in enumerate(sorted_dense_indices[:150]):
                dense_ranks[int(idx)] = rank

        # 2. BM25 Lexical Search
        if self.bm25_standards is not None:
            tokenized_q = tokenize_text(query)
            if tokenized_q:
                bm25_scores = self.bm25_standards.get_scores(tokenized_q)
                sorted_bm25_indices = np.argsort(bm25_scores)[::-1]
                for rank, idx in enumerate(sorted_bm25_indices[:150]):
                    if bm25_scores[idx] > 0.1:
                        bm25_ranks[int(idx)] = rank

        # 3. Reciprocal Rank Fusion using RL policy weights
        candidate_indices = set(dense_ranks.keys()) | set(bm25_ranks.keys())
        if not candidate_indices:
            return []

        k_rrf = 60
        eff_dense = w_dense if w_dense is not None else 0.55
        eff_bm25 = w_bm25 if w_bm25 is not None else 0.45
        rrf_scored = []

        for idx in candidate_indices:
            r_dense = dense_ranks.get(idx, 400)
            r_bm25 = bm25_ranks.get(idx, 400)
            rrf_score = (eff_dense / (k_rrf + r_dense)) + (eff_bm25 / (k_rrf + r_bm25))

            if category and category != "All":
                if self.standards_meta[idx].get("product_category", "").lower() != category.lower():
                    continue

            rrf_scored.append((rrf_score, idx))

        rrf_scored.sort(key=lambda x: x[0], reverse=True)
        top_matches = rrf_scored[:top_k]

        max_possible = (w_dense / k_rrf) + (w_bm25 / k_rrf)
        results = []
        for s, idx in top_matches:
            normalized_score = round(s / max_possible, 3)
            item = dict(self.standards_meta[idx])
            item["semantic_score"] = normalized_score
            results.append(item)

        return results

    def query_chromadb(
        self,
        query: str,
        n_results: int = 5,
        where: Optional[Dict[str, Any]] = None,
        target: str = "standards"
    ) -> Dict[str, Any]:
        """
        Queries ChromaDB directly using the fine-tuned embedding model.
        Supports rich metadata filtering (e.g. where={'is_mandatory': True}).
        """
        collection = self.chroma_standards if target == "standards" else self.chroma_clauses
        if collection is None or self.neural_model is None:
            return {"error": "ChromaDB or neural model not initialized."}

        q_vec = self.neural_model.encode([query], normalize_embeddings=True).tolist()
        return collection.query(
            query_embeddings=q_vec,
            n_results=n_results,
            where=where
        )

    def retrieve(
        self,
        db: Session,
        query: str,
        intent: str,
        entities: Dict[str, Any],
        top_k: int = 4
    ) -> Tuple[List[SourceCitation], float, str, Dict[str, Any]]:
        query_clean = query.strip()
        chunks = db.query(DocumentChunk).all()
        scored_chunks = []
        search_strategy = "Hybrid (Neural Vector + Intent/Entity Re-ranking)"

        target_std_raw = entities.get("standard_number") or ""
        target_product = (entities.get("product") or "").lower()
        target_clause = (entities.get("clause") or "").lower()

        # 1. Contextual Reinforcement Learning Action Selection
        rl_action = rl_optimizer.select_action(query_clean, intent, entities)
        w_dense = rl_action["dense_weight"]
        w_bm25 = rl_action["bm25_weight"]
        exact_boost = rl_action["exact_boost"]
        top_k = rl_action.get("top_k", top_k)

        search_strategy = f"Hybrid RL Policy ({int(w_dense*100)}% Dense, {int(w_bm25*100)}% BM25)"

        # 2. Hybrid (Neural Dense + BM25 Lexical) scoring on Document Chunks
        if chunks:
            # Dense neural encoding
            if self.neural_model is not None and self.chunks_vectors is not None and len(self.chunks_vectors) == len(chunks):
                q_vec = self.neural_model.encode([query_clean], normalize_embeddings=True, convert_to_numpy=True)
                dense_scores = np.dot(self.chunks_vectors, q_vec.T).flatten()
            else:
                if not self.is_fitted or len(self.chunk_ids) != len(chunks):
                    self.fit_corpus(chunks)
                q_tfidf = self.vectorizer.transform([query_clean])
                dense_scores = cosine_similarity(q_tfidf, self.corpus_matrix)[0]

            # BM25 Lexical scoring
            bm25_chunk_scores = [0.0] * len(chunks)
            if self.bm25_chunks is not None:
                tokenized_q = tokenize_text(query_clean)
                if tokenized_q:
                    raw_bm = self.bm25_chunks.get_scores(tokenized_q)
                    max_b = max(raw_bm) if len(raw_bm) > 0 and max(raw_bm) > 0 else 1.0
                    bm25_chunk_scores = [float(s / max_b) for s in raw_bm]

            for idx, chunk in enumerate(chunks):
                d_score = float(dense_scores[idx])
                b_score = float(bm25_chunk_scores[idx]) if idx < len(bm25_chunk_scores) else 0.0
                base_score = (w_dense * d_score) + (w_bm25 * b_score)
                boost = 0.0

                chunk_content_lower = chunk.content.lower()
                chunk_clause_lower = (chunk.clause_number or "").lower()
                chunk_prod_lower = (chunk.product_category or "").lower()

                # Boost exact standard match with RL exact_boost
                if target_std_raw and chunk.standard_number:
                    if standards_match(target_std_raw, chunk.standard_number):
                        boost += exact_boost
                
                # Boost product match
                if target_product and (target_product in chunk_prod_lower or target_product in chunk_content_lower):
                    boost += 0.25

                # Boost clause match
                if target_clause and target_clause in chunk_clause_lower:
                    boost += 0.30

                # Boost intent relevance
                if intent == "TESTING" and any(w in chunk_content_lower for w in ["test", "strength", "limit", "sample"]):
                    boost += 0.15
                elif intent == "CERTIFICATION" and any(w in chunk_content_lower for w in ["scheme", "licence", "mark", "isi", "mandatory"]):
                    boost += 0.15
                elif intent == "HALLMARKING" and "hallmark" in chunk_content_lower:
                    boost += 0.25

                total_score = min(0.98, base_score * 0.70 + boost)
                if total_score > 0.18 or boost > 0.20:
                    scored_chunks.append((total_score, chunk))

            scored_chunks.sort(key=lambda x: x[0], reverse=True)

        top_matches = scored_chunks[:top_k]

        # Check if chunks with exact standard match were found
        exact_std_in_chunks = False
        if target_std_raw and top_matches:
            exact_std_in_chunks = any(standards_match(target_std_raw, ch.standard_number or "") for _, ch in top_matches)

        # 2. If target standard is specified and not covered by chunks, look up exact standard from DB
        if target_std_raw and not exact_std_in_chunks:
            b_target, _, _ = extract_std_components(target_std_raw)
            if b_target:
                candidate_stds = db.query(Standard).filter(Standard.standard_number.ilike(f"%{b_target}%")).all()
                for c_std in candidate_stds:
                    if standards_match(target_std_raw, c_std.standard_number):
                        exact_citation = SourceCitation(
                            document_id="BIS-CATALOG",
                            title=c_std.title,
                            standard_number=c_std.standard_number,
                            clause="Published Indian Standard",
                            page=1,
                            source_url=c_std.source_url or "https://www.services.bis.gov.in/",
                            relevance_score=0.92,
                            evidence_snippet=c_std.summary or f"{c_std.standard_number}: {c_std.title} ({c_std.product_category or 'General'}). Type: {c_std.type_of_standard or 'Product Specification'}."
                        )
                        return [exact_citation], 0.90, "High", {
                            "top_score": 0.92,
                            "matched_standard": c_std.standard_number,
                            "search_strategy": "Direct Catalog Exact Match",
                            "rl_action": rl_action,
                            "category": c_std.product_category
                        }

        # 3. Fallback or augment with the 23,866 Standards dense vector index
        if not top_matches or top_matches[0][0] < 0.45:
            semantic_standards = self.search_standards_semantic(
                query_clean,
                top_k=3,
                w_dense=w_dense,
                w_bm25=w_bm25
            )
            if semantic_standards:
                top_std = semantic_standards[0]
                std_score = top_std.get("semantic_score", 0.60)
                
                citations = []
                for std_item in semantic_standards:
                    citations.append(SourceCitation(
                        document_id="BIS-CATALOG",
                        title=std_item.get("title", ""),
                        standard_number=std_item.get("standard_number", ""),
                        clause="Published Indian Standard",
                        page=1,
                        source_url=std_item.get("source_url") or "https://www.services.bis.gov.in/",
                        relevance_score=round(float(std_item.get("semantic_score", 0.5)), 3),
                        evidence_snippet=f"{std_item.get('standard_number')}: {std_item.get('title')} ({std_item.get('product_category')}). Type: {std_item.get('type_of_standard')}."
                    ))

                confidence_val = round(min(0.95, max(0.40, float(std_score) + 0.15)), 2)
                conf_level = "High" if confidence_val >= 0.75 else ("Medium" if confidence_val >= 0.55 else "Low")
                
                return citations, confidence_val, conf_level, {
                    "top_score": round(float(std_score), 3),
                    "matched_standard": top_std.get("standard_number"),
                    "search_strategy": search_strategy,
                    "rl_action": rl_action,
                    "category": top_std.get("product_category")
                }

        if not top_matches:
            # Final direct DB fallback
            db_std = db.query(Standard).filter(
                (Standard.title.ilike(f"%{query_clean}%")) |
                (Standard.standard_number.ilike(f"%{query_clean}%"))
            ).first()

            if db_std:
                citation = SourceCitation(
                    document_id="BIS-CATALOG",
                    title=db_std.title,
                    standard_number=db_std.standard_number,
                    clause="Standard Catalog Entry",
                    page=1,
                    source_url=db_std.source_url or "https://www.services.bis.gov.in/",
                    relevance_score=0.60,
                    evidence_snippet=db_std.summary or db_std.title
                )
                return [citation], 0.60, "Medium", {
                    "matched_standard": db_std.standard_number,
                    "search_strategy": "Database Substring Match",
                    "rl_action": rl_action
                }

            return [], 0.30, "Low", {
                "reasoning": "No relevant BIS standard or clause met the relevance threshold.",
                "rl_action": rl_action
            }

        best_score = top_matches[0][0]
        confidence_val = round(min(0.96, max(0.35, best_score + 0.15)), 2)
        conf_level = "High" if confidence_val >= 0.75 else ("Medium" if confidence_val >= 0.55 else "Low")

        citations = []
        for score, ch in top_matches:
            parent_doc = db.query(Document).filter(Document.document_id == ch.document_id).first()
            source_url = parent_doc.source_url if parent_doc else "https://www.services.bis.gov.in/"
            
            citations.append(SourceCitation(
                document_id=ch.document_id,
                title=ch.title,
                standard_number=ch.standard_number,
                clause=ch.clause_number,
                sub_clause=ch.sub_clause,
                page=ch.page_number,
                source_url=source_url,
                relevance_score=round(score, 3),
                evidence_snippet=ch.content[:240] + "..." if len(ch.content) > 240 else ch.content
            ))

        explain_data = {
            "top_score": round(best_score, 3),
            "matched_chunks": len(top_matches),
            "search_strategy": search_strategy,
            "rl_action": rl_action,
            "evidence_clauses": [f"{c.standard_number or ''} {c.clause or ''}".strip() for c in citations]
        }

        return citations, confidence_val, conf_level, explain_data

hybrid_retriever = HybridRetriever()
