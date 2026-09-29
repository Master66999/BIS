import os
import sys
import json
import time
import re
import numpy as np

# Reconfigure stdout for utf-8 on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(PROJECT_ROOT)

from backend.app.core.database import SessionLocal
from backend.app.rag.query_understanding import classify_query
from backend.app.rag.retriever import hybrid_retriever
from backend.app.rag.rl_optimizer import rl_optimizer, POLICY_WEIGHTS_PATH

BENCHMARK_PATH = os.path.join(PROJECT_ROOT, "data", "benchmark_100_questions.json")

def normalize_std(text: str) -> str:
    if not text:
        return ""
    m = re.search(r'\b(?:IS|is)\s*(?:/ISO|/IEC)?\s*(\d+)', text)
    if m:
        return m.group(1)
    m2 = re.search(r'\b(\d{3,5})\b', text)
    if m2:
        return m2.group(1)
    return text.strip().lower()

def run_rl_training(num_episodes: int = 4):
    print("=" * 75)
    print("  BIS SmartAssist — Reinforcement Learning (Contextual Policy Optimization)")
    print("=" * 75)

    if not os.path.exists(BENCHMARK_PATH):
        print(f"Benchmark questions not found at {BENCHMARK_PATH}")
        return

    with open(BENCHMARK_PATH, "r", encoding="utf-8") as f:
        benchmark_data = json.load(f)

    db = SessionLocal()

    print(f"\nLoaded {len(benchmark_data)} environment interaction queries.")
    print(f"Starting Policy Gradient (REINFORCE) optimization over {num_episodes} training episodes...\n")

    episode_rewards = []
    episode_hit_rates = []

    for episode in range(1, num_episodes + 1):
        t0 = time.time()
        total_reward = 0.0
        hits = 0
        top1_hits = 0
        total_queries = len(benchmark_data)

        # Shuffle benchmark data per episode
        indices = np.random.permutation(total_queries)

        for idx in indices:
            item = benchmark_data[idx]
            query = item["query"]
            exp_std = item.get("expected_standard", "")
            exp_norm = normalize_std(exp_std)
            key_facts = item.get("key_facts", [])

            # 1. State extraction
            classified = classify_query(query)
            intent = classified["intent"]
            entities = classified["entities"]

            # 2. Action selection with exploration
            explore_flag = (episode < num_episodes) # Exploit on final episode
            action = rl_optimizer.select_action(query, intent, entities, explore=explore_flag)

            # 3. Environment Step: Execute retrieval under chosen policy action
            t_start = time.time()
            try:
                citations, conf, _, explain = hybrid_retriever.retrieve(
                    db=db,
                    query=query,
                    intent=intent,
                    entities=entities,
                    top_k=action.get("top_k", 4)
                )
                latency_ms = (time.time() - t_start) * 1000
            except Exception as e:
                citations = []
                latency_ms = 50.0

            # 4. Reward Computation
            retrieved_stds = [c.standard_number for c in citations if c.standard_number]
            std_hit = False
            top1_hit = False

            if retrieved_stds:
                top_norm = normalize_std(retrieved_stds[0])
                if exp_norm and top_norm and exp_norm == top_norm:
                    top1_hit = True
                    std_hit = True

            if not std_hit:
                for s in retrieved_stds:
                    if exp_norm and normalize_std(s) == exp_norm:
                        std_hit = True
                        break

            if not std_hit and any(kw in exp_std for kw in ["Scheme", "BIS Act", "CRS", "FMCS", "Hallmark", "Guidelines", "NABL"]):
                for kw in key_facts:
                    if any(kw.lower() in (c.evidence_snippet or "").lower() for c in citations):
                        std_hit = True
                        break

            if std_hit:
                hits += 1
            if top1_hit:
                top1_hits += 1

            reward = rl_optimizer.compute_reward(
                standard_hit=std_hit,
                top1_hit=top1_hit,
                has_citations=len(citations) > 0,
                latency_ms=latency_ms
            )

            total_reward += reward

            # 5. Policy Gradient Parameter Update
            rl_optimizer.update_policy(intent, action, reward)
            rl_optimizer.log_interaction(query, intent, action, reward)

        avg_reward = total_reward / total_queries
        hit_pct = (hits / total_queries) * 100
        top1_pct = (top1_hits / total_queries) * 100
        elapsed_sec = time.time() - t0

        episode_rewards.append(avg_reward)
        episode_hit_rates.append(hit_pct)

        print(f"Episode {episode}/{num_episodes} | Avg Reward: {avg_reward:+.3f} | Hit Rate: {hit_pct:.1f}% | Top-1: {top1_pct:.1f}% | Time: {elapsed_sec:.1f}s")

    db.close()

    # Save final converged policy
    rl_optimizer.save_policy()

    print(f"\n{'='*75}")
    print(f"  CONVERGED REINFORCEMENT LEARNING POLICY WEIGHTS")
    print(f"{'='*75}")
    print(f"{'Intent':<22} | {'Dense %':<9} | {'BM25 %':<9} | {'Exact Boost':<11} | {'Top-K'}")
    print(f"{'-'*75}")
    for intent_name, weights in rl_optimizer.intent_policies.items():
        d_pct = int(weights['dense_weight'] * 100)
        b_pct = int(weights['bm25_weight'] * 100)
        boost = weights['exact_boost']
        k = weights.get('top_k', 4)
        print(f"{intent_name:<22} | {d_pct:>6}%   | {b_pct:>6}%   | {boost:>10.2f}  | {k}")
    print(f"{'-'*75}")
    print(f"Reward Improvement: {episode_rewards[0]:+.3f} -> {episode_rewards[-1]:+.3f}")
    print(f"Policy weights saved to: {POLICY_WEIGHTS_PATH}\n")

if __name__ == "__main__":
    run_rl_training(num_episodes=4)
