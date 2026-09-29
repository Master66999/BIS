import os
import sys
import json
import time
import re
import urllib.request
import urllib.error

# Ensure stdout is utf-8 on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BENCHMARK_PATH = os.path.join(PROJECT_ROOT, "data", "benchmark_100_questions.json")
REPORT_PATH = os.path.join(PROJECT_ROOT, "data", "benchmark_100_evaluation_report.json")
API_URL = "http://127.0.0.1:8000/api/chat"

def normalize_std(text: str) -> str:
    """Extract canonical numeric standard identifier, e.g. 'IS 2347:2023' -> '2347'."""
    if not text:
        return ""
    m = re.search(r'\b(?:IS|is)\s*(?:/ISO|/IEC)?\s*(\d+)', text)
    if m:
        return m.group(1)
    # Check general digits
    m2 = re.search(r'\b(\d{3,5})\b', text)
    if m2:
        return m2.group(1)
    return text.strip().lower()

def run_evaluation():
    if not os.path.exists(BENCHMARK_PATH):
        print(f"Benchmark file not found at: {BENCHMARK_PATH}")
        return

    with open(BENCHMARK_PATH, "r", encoding="utf-8") as f:
        benchmark_data = json.load(f)

    print(f"\n{'='*75}")
    print(f"  BIS SmartAssist — Evaluating 100 Real-World Persona Benchmark Questions")
    print(f"{'='*75}\n")
    print(f"Loaded {len(benchmark_data)} test questions from {BENCHMARK_PATH}.")
    print(f"Target Endpoint: {API_URL}\n")

    results = []
    category_stats = {}
    latencies = []

    passed_count = 0
    intent_correct_count = 0
    mandatory_correct_count = 0

    for i, item in enumerate(benchmark_data, start=1):
        q_id = item.get("id", i)
        query = item.get("query", "")
        persona = item.get("persona", "General")
        category = item.get("category", "General")
        exp_std = item.get("expected_standard", "")
        exp_norm = normalize_std(exp_std)
        exp_intent = item.get("intent", "")
        is_mand = item.get("is_mandatory", None)
        key_facts = item.get("key_facts", [])

        if category not in category_stats:
            category_stats[category] = {"total": 0, "standard_hits": 0, "intent_hits": 0}
        category_stats[category]["total"] += 1

        payload = {
            "message": query,
            "conversation_id": f"eval-bench-100-{q_id}"
        }

        req = urllib.request.Request(
            API_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )

        start_time = time.time()
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                elapsed_ms = int((time.time() - start_time) * 1000)
                latencies.append(elapsed_ms)
                body = json.loads(resp.read().decode("utf-8"))
        except Exception as e:
            elapsed_ms = int((time.time() - start_time) * 1000)
            print(f"[{q_id}/100] ERROR querying API: {e}")
            results.append({
                "id": q_id,
                "query": query,
                "error": str(e),
                "status": "FAIL",
                "latency_ms": elapsed_ms
            })
            continue

        response_text = body.get("answer", "") or body.get("text", "")
        sources = body.get("sources", [])
        intent_classified = body.get("intent", "")

        # 1. Standard Matching
        source_stds = [s.get("standard_number", "") for s in sources if isinstance(s, dict)]
        source_titles = [s.get("title", "") for s in sources if isinstance(s, dict)]
        
        # Check if expected standard is found in top source, in any sources, or in response text
        std_hit = False
        top1_hit = False

        if source_stds:
            top_norm = normalize_std(source_stds[0])
            if exp_norm and top_norm and exp_norm == top_norm:
                top1_hit = True
                std_hit = True

        if not std_hit:
            for s_num in source_stds:
                if exp_norm and normalize_std(s_num) == exp_norm:
                    std_hit = True
                    break

        if not std_hit:
            # Check response text for standard number or name
            if exp_norm and (f"IS {exp_norm}" in response_text or f"IS:{exp_norm}" in response_text or exp_std.lower() in response_text.lower()):
                std_hit = True
            elif exp_std.lower() in response_text.lower():
                std_hit = True

        # Special cases where expected_standard is a Scheme, regulation, or Act
        if not std_hit or any(kw in exp_std for kw in ["Scheme", "BIS Act", "CRS", "FMCS", "Hallmark", "Guidelines", "NABL", "Regulation", "Ministry"]):
            # Check core standard phrase
            clean_exp = exp_std.replace("BIS Act", "").replace("Guidelines", "").strip()
            if clean_exp and clean_exp.lower() in response_text.lower():
                std_hit = True
            if not std_hit:
                for kw in key_facts:
                    if kw.lower() in response_text.lower():
                        std_hit = True
                        break
                    # Also check sub-phrases of key facts
                    sub_parts = [p.strip() for p in re.split(r'[,;]|\s+and\s+', kw) if len(p.strip()) > 3]
                    if any(sp.lower() in response_text.lower() for sp in sub_parts):
                        std_hit = True
                        break

        if std_hit:
            passed_count += 1
            category_stats[category]["standard_hits"] += 1

        # 2. Intent Matching
        intent_match = (exp_intent.upper() in intent_classified.upper()) or (intent_classified.upper() in exp_intent.upper())
        if intent_match:
            intent_correct_count += 1
            category_stats[category]["intent_hits"] += 1

        # 3. Mandatory / QCO check
        mand_match = True
        if is_mand is True:
            # Should mention mandatory / QCO / ISI / CRS / compulsory
            text_lower = response_text.lower()
            mand_match = any(w in text_lower for w in ["mandatory", "qco", "isi", "scheme i", "scheme ii", "crs", "compulsory", "required"])
            if mand_match:
                mandatory_correct_count += 1
        elif is_mand is False:
            # Should mention voluntary / not mandatory / optional
            text_lower = response_text.lower()
            mand_match = any(w in text_lower for w in ["voluntary", "optional", "not mandatory", "not under qco", "not compulsory"])
            if mand_match:
                mandatory_correct_count += 1

        status_flag = "[PASS]" if std_hit else "[WARN]"
        print(f"{status_flag} Q{q_id:03d} [{persona} - {category[:15]}] StdHit: {std_hit} | Top1: {top1_hit} | {elapsed_ms}ms")
        if not std_hit:
            print(f"       Expected: {exp_std} | Got Sources: {source_stds[:3]}")

        results.append({
            "id": q_id,
            "persona": persona,
            "category": category,
            "query": query,
            "expected_standard": exp_std,
            "retrieved_standards": source_stds[:3],
            "standard_hit": std_hit,
            "top1_hit": top1_hit,
            "intent_expected": exp_intent,
            "intent_classified": intent_classified,
            "intent_match": intent_match,
            "mandatory_match": mand_match,
            "latency_ms": elapsed_ms,
            "response_snippet": response_text[:200] + "..." if len(response_text) > 200 else response_text
        })

    # Summary calculations
    total = len(benchmark_data)
    hit_rate = (passed_count / total) * 100 if total else 0
    intent_rate = (intent_correct_count / total) * 100 if total else 0
    avg_latency = sum(latencies) / len(latencies) if latencies else 0
    latencies.sort()
    p95_latency = latencies[int(len(latencies) * 0.95)] if latencies else 0

    summary_report = {
        "total_questions": total,
        "standard_hit_count": passed_count,
        "standard_hit_rate_pct": round(hit_rate, 2),
        "intent_accuracy_pct": round(intent_rate, 2),
        "avg_latency_ms": round(avg_latency, 1),
        "p95_latency_ms": p95_latency,
        "category_breakdown": category_stats,
        "test_results": results
    }

    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(summary_report, f, indent=2, ensure_ascii=False)

    print(f"\n{'='*75}")
    print(f"  BENCHMARK 100 EVALUATION REPORT SUMMARY")
    print(f"{'='*75}")
    print(f"Total Questions Evaluated : {total}")
    print(f"Standard Retrieval Hit Rate: {passed_count}/{total} ({hit_rate:.1f}%)")
    print(f"Intent Classification Rate : {intent_correct_count}/{total} ({intent_rate:.1f}%)")
    print(f"Average Response Latency   : {avg_latency:.1f} ms")
    print(f"P95 Response Latency       : {p95_latency} ms")
    print(f"\nCategory Performance Breakdown:")
    print(f"{'-'*75}")
    print(f"{'Category':<28} | {'Total':<6} | {'Std Hits':<10} | {'Hit Rate %':<10}")
    print(f"{'-'*75}")
    for cat, stat in category_stats.items():
        rate = (stat['standard_hits'] / stat['total']) * 100 if stat['total'] else 0
        print(f"{cat:<28} | {stat['total']:<6} | {stat['standard_hits']:<10} | {rate:.1f}%")
    print(f"{'-'*75}")
    print(f"Full evaluation report saved to: {REPORT_PATH}\n")

if __name__ == "__main__":
    run_evaluation()
