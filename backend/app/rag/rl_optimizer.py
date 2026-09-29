import os
import re
import json
import logging
import numpy as np
from typing import Dict, Any, Tuple, List, Optional

logger = logging.getLogger(__name__)

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
POLICY_WEIGHTS_PATH = os.path.join(PROJECT_ROOT, "data", "processed", "rl_policy_weights.json")

# Default heuristic baseline weights
DEFAULT_WEIGHTS = {
    "dense_weight": 0.55,
    "bm25_weight": 0.45,
    "exact_boost": 0.40,
    "top_k": 4
}

class ContextualRLOptimizer:
    """
    Reinforcement Learning (Contextual Bandits + Policy Gradient) Optimizer for RAG.
    Dynamically adjusts retrieval weights (Dense vs BM25 vs Exact Boosting)
    based on the state of the query and reward signals (Benchmark hits, user feedback).
    """

    def __init__(self):
        self.learning_rate = 0.05
        self.exploration_epsilon = 0.10
        self.intent_policies: Dict[str, Dict[str, float]] = {}
        self.experience_buffer: List[Dict[str, Any]] = []
        self._load_policy()

    def _load_policy(self):
        """Loads learned policy parameters from disk if available."""
        if os.path.exists(POLICY_WEIGHTS_PATH):
            try:
                with open(POLICY_WEIGHTS_PATH, "r", encoding="utf-8") as f:
                    self.intent_policies = json.load(f)
                logger.info(f"Loaded RL policy weights for {len(self.intent_policies)} intents from {POLICY_WEIGHTS_PATH}")
                return
            except Exception as e:
                logger.warning(f"Could not load RL policy: {e}")

        # Initialize with domain-informed priors
        self.intent_policies = {
            "STANDARD_LOOKUP": {
                "dense_weight": 0.35,
                "bm25_weight": 0.65,
                "exact_boost": 0.50,
                "top_k": 3
            },
            "CERTIFICATION": {
                "dense_weight": 0.45,
                "bm25_weight": 0.55,
                "exact_boost": 0.40,
                "top_k": 4
            },
            "TESTING": {
                "dense_weight": 0.60,
                "bm25_weight": 0.40,
                "exact_boost": 0.35,
                "top_k": 4
            },
            "HALLMARKING": {
                "dense_weight": 0.30,
                "bm25_weight": 0.70,
                "exact_boost": 0.55,
                "top_k": 3
            },
            "LABORATORY": {
                "dense_weight": 0.40,
                "bm25_weight": 0.60,
                "exact_boost": 0.45,
                "top_k": 4
            },
            "CONSUMER_QUERY": {
                "dense_weight": 0.65,
                "bm25_weight": 0.35,
                "exact_boost": 0.25,
                "top_k": 4
            },
            "GENERAL": {
                "dense_weight": 0.55,
                "bm25_weight": 0.45,
                "exact_boost": 0.35,
                "top_k": 4
            }
        }
        self.save_policy()

    def save_policy(self):
        """Persists learned policy weights to disk."""
        try:
            os.makedirs(os.path.dirname(POLICY_WEIGHTS_PATH), exist_ok=True)
            with open(POLICY_WEIGHTS_PATH, "w", encoding="utf-8") as f:
                json.dump(self.intent_policies, f, indent=2)
        except Exception as e:
            logger.warning(f"Failed to save RL policy: {e}")

    def extract_features(self, query: str, intent: str, entities: Dict[str, Any]) -> Dict[str, Any]:
        """Extracts contextual state representation of the incoming request."""
        has_std_code = bool(entities.get("standard_number") or re.search(r'\b(?:IS|is)\s*\d+', query))
        has_product = bool(entities.get("product"))
        query_words = len(query.split())

        return {
            "intent": intent or "GENERAL",
            "has_std_code": has_std_code,
            "has_product": has_product,
            "query_length": query_words
        }

    def select_action(
        self,
        query: str,
        intent: str,
        entities: Dict[str, Any],
        explore: bool = False
    ) -> Dict[str, float]:
        """
        Policy action selection:
        Returns optimal (dense_weight, bm25_weight, exact_boost, top_k) for the current state.
        Uses ε-greedy exploration during RL training sessions.
        """
        features = self.extract_features(query, intent, entities)
        int_key = features["intent"] if features["intent"] in self.intent_policies else "GENERAL"
        base_policy = self.intent_policies.get(int_key, DEFAULT_WEIGHTS)

        w_dense = base_policy["dense_weight"]
        w_bm25 = base_policy["bm25_weight"]
        boost = base_policy["exact_boost"]
        k = int(base_policy.get("top_k", 4))

        # Dynamic heuristic adjustment for explicit standard codes
        if features["has_std_code"]:
            w_bm25 = min(0.85, w_bm25 + 0.15)
            w_dense = max(0.15, 1.0 - w_bm25)
            boost = min(0.60, boost + 0.10)

        # Exploration perturbance (for training/bandit exploration)
        if explore and np.random.rand() < self.exploration_epsilon:
            noise = float(np.random.normal(0, 0.08))
            w_dense = float(np.clip(w_dense + noise, 0.10, 0.90))
            w_bm25 = float(np.clip(1.0 - w_dense, 0.10, 0.90))
            boost = float(np.clip(boost + np.random.normal(0, 0.05), 0.10, 0.60))

        return {
            "dense_weight": round(w_dense, 3),
            "bm25_weight": round(w_bm25, 3),
            "exact_boost": round(boost, 3),
            "top_k": k
        }

    def compute_reward(
        self,
        standard_hit: bool,
        top1_hit: bool,
        has_citations: bool,
        latency_ms: float,
        user_rating: Optional[int] = None
    ) -> float:
        """
        Calculates scalar reinforcement learning reward R ∈ [-1.0, +1.0]:
        - Correct standard retrieved (+0.50)
        - Top-1 precision hit (+0.30)
        - Evidence citation present (+0.10)
        - Latency penalty (negative if > 150ms)
        - Explicit human feedback rating (+0.40 for thumbs-up, -0.60 for thumbs-down)
        """
        reward = 0.0

        if standard_hit:
            reward += 0.50
        else:
            reward -= 0.30

        if top1_hit:
            reward += 0.30

        if has_citations:
            reward += 0.10

        # Latency penalty: penalize slow queries
        if latency_ms > 200:
            reward -= min(0.20, (latency_ms - 200) / 1000)

        # Human feedback
        if user_rating is not None:
            if user_rating > 0:
                reward += 0.40
            elif user_rating < 0:
                reward -= 0.60

        return float(np.clip(reward, -1.0, 1.0))

    def update_policy(
        self,
        intent: str,
        action: Dict[str, float],
        reward: float
    ):
        """
        Policy Gradient update:
        Adjusts policy parameters in the direction of positive reward.
        """
        int_key = intent if intent in self.intent_policies else "GENERAL"
        current = self.intent_policies.get(int_key, dict(DEFAULT_WEIGHTS))

        # Gradient step proportional to advantage (reward)
        step = self.learning_rate * reward

        # If reward > 0, nudge towards the action taken; if reward < 0, nudge away
        new_dense = float(np.clip(current["dense_weight"] + step * (action["dense_weight"] - current["dense_weight"]), 0.15, 0.85))
        new_bm25 = float(np.clip(1.0 - new_dense, 0.15, 0.85))
        new_boost = float(np.clip(current["exact_boost"] + step * 0.1, 0.20, 0.60))

        self.intent_policies[int_key] = {
            "dense_weight": round(new_dense, 3),
            "bm25_weight": round(new_bm25, 3),
            "exact_boost": round(new_boost, 3),
            "top_k": current.get("top_k", 4)
        }

        self.save_policy()
        logger.info(f"RL Policy updated for intent [{int_key}] with reward {reward:.2f}: {self.intent_policies[int_key]}")

    def log_interaction(self, query: str, intent: str, action: Dict[str, Any], reward: float):
        """Buffers interaction experience for batch reinforcement learning."""
        self.experience_buffer.append({
            "query": query,
            "intent": intent,
            "action": action,
            "reward": reward
        })
        if len(self.experience_buffer) > 500:
            self.experience_buffer.pop(0)

# Global singleton
rl_optimizer = ContextualRLOptimizer()
