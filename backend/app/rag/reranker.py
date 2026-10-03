"""
BIS RAG Reranker Module
Provides Cross-Encoder neural query-document reranking with robust statistical hybrid fallback.
"""

import os
import time
import logging
import re
from typing import List, Tuple, Dict, Any, Optional
import numpy as np

from backend.app.core.config import settings
from backend.app.rag.candidate import RetrievedCandidate

logger = logging.getLogger(__name__)


class CrossEncoderReranker:
    """
    Neural Cross-Encoder reranker that scores full (query, document) pairs
    to evaluate deep semantic relevance, clause context, and exact constraints.
    """

    def __init__(self, model_name: Optional[str] = None):
        self.model_name = model_name or settings.RAG_RERANKER_MODEL
        self.enabled = settings.RAG_RERANK_ENABLED
        self.model = None
        self._is_loaded = False
        self._load_failure = False

        if self.enabled:
            self._init_model()

    def _init_model(self):
        """Attempts to load fine-tuned BIS CrossEncoder or base model once with lazy loading."""
        if self._is_loaded or self._load_failure:
            return

        try:
            from sentence_transformers import CrossEncoder
            import torch
            device = "cuda" if torch.cuda.is_available() else "cpu"
            finetuned_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "models", "bis_cross_encoder_finetuned")
            model_to_load = finetuned_path if os.path.exists(finetuned_path) else self.model_name
            self.model = CrossEncoder(model_to_load, device=device, max_length=512)
            self._is_loaded = True
            logger.info(f"Loaded Cross-Encoder Reranker model '{model_to_load}' on {device}")
        except Exception as e:
            self._load_failure = True
            logger.warning(f"Could not load CrossEncoder ('{self.model_name}'): {e}. Falling back to statistical hybrid reranker.")

    def _fallback_score(self, query: str, candidate: RetrievedCandidate) -> float:
        """
        Lightweight fallback scoring function using lexical overlap, BM25, and vector score.
        """
        q_clean = query.lower().strip()
        doc_clean = f"{candidate.standard_number or ''} {candidate.title} {candidate.clause or ''} {candidate.sub_clause or ''} {candidate.content}".lower()

        # Token overlap ratio
        q_tokens = set(re.findall(r'\b\w+\b', q_clean))
        doc_tokens = set(re.findall(r'\b\w+\b', doc_clean))
        overlap = len(q_tokens & doc_tokens) / max(1, len(q_tokens))

        # Standard number exact match bonus
        std_bonus = 0.0
        if candidate.standard_number:
            std_clean = candidate.standard_number.lower().replace(":", " ").replace("/", " ")
            std_parts = std_clean.split()
            if any(p in q_clean for p in std_parts if len(p) >= 3 and p.isdigit()):
                std_bonus = 0.35
            elif candidate.standard_number.lower() in q_clean:
                std_bonus = 0.35

        # Clause / Sub-clause exact match bonus
        clause_bonus = 0.0
        if candidate.clause and (candidate.clause.lower() in q_clean or (candidate.sub_clause and candidate.sub_clause in q_clean)):
            clause_bonus = 0.25
        elif candidate.sub_clause and candidate.sub_clause in q_clean:
            clause_bonus = 0.25

        score = (
            0.40 * candidate.normalized_score +
            0.30 * overlap +
            std_bonus +
            clause_bonus
        )
        return float(min(1.0, max(0.0, score)))

    def rerank(
        self,
        query: str,
        candidates: List[RetrievedCandidate],
        top_k: int = 5
    ) -> Tuple[List[RetrievedCandidate], Dict[str, Any]]:
        """
        Reranks candidate pool against user query.
        Returns top_k reranked candidates along with diagnostic metrics.
        """
        start_t = time.perf_counter()

        if not candidates:
            return [], {
                "reranker_model": self.model_name if self._is_loaded else "fallback-hybrid",
                "candidates_count": 0,
                "rerank_ms": round((time.perf_counter() - start_t) * 1000, 2),
                "applied": False
            }

        # Ensure model is initialized if enabled
        if self.enabled and not self._is_loaded and not self._load_failure:
            self._init_model()

        applied_neural = False

        if self.enabled and self._is_loaded and self.model is not None:
            try:
                pairs = [
                    [query, f"{c.standard_number or ''} {c.title}: {c.content} (Clause: {c.clause or ''} {c.sub_clause or ''}, Page: {c.page or ''})"]
                    for c in candidates
                ]
                raw_scores = self.model.predict(pairs)
                
                # Apply sigmoid if logits returned
                if isinstance(raw_scores, np.ndarray) and (raw_scores.min() < 0 or raw_scores.max() > 1):
                    scores = 1.0 / (1.0 + np.exp(-raw_scores))
                else:
                    scores = raw_scores

                for idx, c in enumerate(candidates):
                    c.rerank_score = float(scores[idx])
                    # Combined final score blending normalized retrieval score and rerank score
                    c.final_score = float(0.70 * c.rerank_score + 0.30 * c.normalized_score)
                applied_neural = True
            except Exception as e:
                logger.warning(f"CrossEncoder prediction error: {e}. Falling back to statistical scoring.")
                applied_neural = False


        if not applied_neural:
            for c in candidates:
                fb_score = self._fallback_score(query, c)
                c.rerank_score = fb_score
                c.final_score = fb_score

        # Sort candidates descending by final_score
        reranked = sorted(candidates, key=lambda x: x.final_score, reverse=True)
        top_results = reranked[:top_k]

        elapsed_ms = round((time.perf_counter() - start_t) * 1000, 2)

        diagnostics = {
            "reranker_model": self.model_name if applied_neural else "fallback-hybrid",
            "candidates_count": len(candidates),
            "top_k_returned": len(top_results),
            "rerank_ms": elapsed_ms,
            "applied": applied_neural or (not self.enabled)
        }

        if settings.RAG_DEBUG_MODE:
            logger.info(f"[RAG DEBUG] Reranked {len(candidates)} candidates in {elapsed_ms}ms using {diagnostics['reranker_model']}")
            for i, r in enumerate(top_results[:3]):
                logger.info(f"  Rank {i+1}: {r.standard_number or r.booklet_name} (Score: {r.final_score:.3f}, Rerank: {r.rerank_score:.3f})")

        return top_results, diagnostics


# Global singleton instance
reranker = CrossEncoderReranker()


def get_reranker() -> CrossEncoderReranker:
    return reranker

