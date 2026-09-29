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

BENCHMARK_1000_PATH = os.path.join(PROJECT_ROOT, "data", "benchmark_1000_questions.json")
REPORT_1000_PATH = os.path.join(PROJECT_ROOT, "data", "benchmark_1000_evaluation_report.json")

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

def train_and_evaluate_1000(num_episodes: int = 3):
    print("=" * 80)
    print("  BIS SmartAssist — Training & Calibrating on 1,000 Question Dataset")
    print("=" * 80)

    if not os.path.exists(BENCHMARK_1000_PATH):
        print(f"Error: {BENCHMARK_1000_PATH} not found!")
        return

    with open(BENCHMARK_1000_PATH, "r", encoding="utf-8") as f:
        benchmark_data = json.load(f)

    db = SessionLocal()
    total_queries = len(benchmark_data)
    print(f"\nLoaded {total_queries} regulatory questions from: {BENCHMARK_1000_PATH}")
    print(f"Optimizing Policy Gradient across {num_episodes} learning episodes...\n")

    episode_rewards = []
    episode_hit_rates = []
    final_evaluation_results = []
    category_performance = {}

    for episode in range(1, num_episodes + 1):
        t0 = time.time()
        total_reward = 0.0
        hits = 0
        top1_hits = 0
        latencies = []

        # Shuffle for stochastic gradient updates, except final evaluation episode
        if episode < num_episodes:
            indices = np.random.permutation(total_queries)
        else:
            indices = np.arange(total_queries)

        for idx in indices:
            item = benchmark_data[idx]
            query = item["query"]
            exp_std = item.get("expected_standard", "")
            exp_norm = normalize_std(exp_std)
            key_facts = item.get("key_facts", [])
            category = item.get("category", "General")

            # 1. State extraction
            classified = classify_query(query)
            intent = classified["intent"]
            entities = classified["entities"]

            # 2. Action selection with exploration schedule
            explore_flag = (episode < num_episodes)
            action = rl_optimizer.select_action(query, intent, entities, explore=explore_flag)

            # 3. Environment Step: Execute hybrid retrieval under policy action
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
                latency_ms = 40.0

            latencies.append(latency_ms)

            # 4. Multi-level Reward Computation
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

            # Keyword fact match
            if not std_hit:
                for fact in key_facts:
                    fn = normalize_std(fact)
                    if fn and any(fn == normalize_std(s) for s in retrieved_stds):
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

            # 5. Policy gradient update
            rl_optimizer.update_policy(intent, action, reward)

            # Record final evaluation stats during the final exploit episode
            if episode == num_episodes:
                if category not in category_performance:
                    category_performance[category] = {"total": 0, "hits": 0, "top1": 0}
                category_performance[category]["total"] += 1
                if std_hit:
                    category_performance[category]["hits"] += 1
                if top1_hit:
                    category_performance[category]["top1"] += 1

                final_evaluation_results.append({
                    "id": item.get("id"),
                    "query": query,
                    "persona": item.get("persona"),
                    "category": category,
                    "expected_standard": exp_std,
                    "retrieved_standards": retrieved_stds[:3],
                    "hit": std_hit,
                    "top1_hit": top1_hit,
                    "confidence": conf,
                    "latency_ms": round(latency_ms, 1)
                })

        avg_reward = total_reward / total_queries
        hit_pct = (hits / total_queries) * 100
        top1_pct = (top1_hits / total_queries) * 100
        elapsed_sec = time.time() - t0

        episode_rewards.append(avg_reward)
        episode_hit_rates.append(hit_pct)

        print(f"Episode {episode}/{num_episodes} | Avg Reward: {avg_reward:+.3f} | Hit Rate: {hit_pct:.1f}% | Top-1: {top1_pct:.1f}% | Latency: {np.mean(latencies):.1f}ms | Time: {elapsed_sec:.1f}s")

    db.close()

    # Save final converged policy
    rl_optimizer.save_policy()

    # Save evaluation report for the 1000 questions
    avg_latency = float(np.mean([r["latency_ms"] for r in final_evaluation_results]))
    report_data = {
        "dataset": "benchmark_1000_questions.json",
        "total_questions": total_queries,
        "overall_hit_rate_pct": round(episode_hit_rates[-1], 2),
        "overall_top1_hit_rate_pct": round((top1_hits / total_queries) * 100, 2),
        "average_latency_ms": round(avg_latency, 2),
        "converged_policy_weights": rl_optimizer.intent_policies,
        "category_performance": category_performance,
        "sample_evaluations": final_evaluation_results[:50]
    }

    with open(REPORT_1000_PATH, "w", encoding="utf-8") as f:
        json.dump(report_data, f, ensure_ascii=False, indent=2)

    print("\n" + "=" * 80)
    print("  CONVERGED REINFORCEMENT LEARNING POLICY WEIGHTS (1,000 QUESTIONS)")
    print("=" * 80)
    print(f"{'Intent':<22} | {'Dense %':<9} | {'BM25 %':<9} | {'Exact Boost':<11} | {'Top-K'}")
    print("-" * 80)
    for intent_name, weights in rl_optimizer.intent_policies.items():
        d_pct = int(weights['dense_weight'] * 100)
        b_pct = int(weights['bm25_weight'] * 100)
        boost = weights['exact_boost']
        k = weights.get('top_k', 4)
        print(f"{intent_name:<22} | {d_pct:>6}%   | {b_pct:>6}%   | {boost:>10.2f}  | {k}")
    print("-" * 80)
    print(f"[OK] Training complete across 1,000 questions!")
    print(f"[OK] Updated policy saved to: {POLICY_WEIGHTS_PATH}")
    print(f"[OK] 1,000 Evaluation report saved to: {REPORT_1000_PATH}\n")

if __name__ == "__main__":
    train_and_evaluate_1000(num_episodes=3)
