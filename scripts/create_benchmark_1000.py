import os
import sys
import json
import random
import re
from typing import List, Dict, Any

# Ensure stdout handles utf-8 on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(PROJECT_ROOT)

from backend.app.core.database import SessionLocal
from backend.app.models.models import Standard
from backend.app.rag.knowledge_seed import SEED_DOCUMENTS

OUTPUT_PATH = os.path.join(PROJECT_ROOT, "data", "benchmark_1000_questions.json")

# Persona templates and intent mappings
PERSONAS = [
    "MSME Applicant",
    "Manufacturer",
    "Consumer",
    "Quality Engineer",
    "Lab Technician",
    "Importer / Foreign Manufacturer",
    "BIS Enforcement Officer",
    "Student / Citizen",
]

INTENT_TEMPLATES = {
    "STANDARD_LOOKUP": [
        "Which Indian Standard applies to {product}?",
        "What is the official BIS standard number for {product}?",
        "Could you tell me the IS specification code for {product} in India?",
        "I am looking for the applicable Bureau of Indian Standards document for {product}.",
        "What standard should I refer to for manufacturing and quality control of {product}?",
    ],
    "CERTIFICATION": [
        "Is BIS certification or ISI mark mandatory for {product} under Government QCOs?",
        "Does {product} require mandatory Scheme I ISI mark certification before selling in India?",
        "Can I sell or import {product} in the Indian market without a valid BIS licence?",
        "What certification scheme does {product} fall under, and is a Quality Control Order active for it?",
        "What is the licensing procedure and mandatory status for {product} according to BIS?",
    ],
    "TESTING": [
        "What are the mandatory laboratory testing parameters and requirements for {product}?",
        "Which physical and chemical tests must {product} undergo as per {standard}?",
        "What testing protocol and tolerance limits are specified in {standard} for {product}?",
        "How is compliance verified and what are the performance test limits for {product}?",
        "What is the sampling frequency and test procedure for {product} under {standard}?",
    ],
    "LICENSING": [
        "How can an MSME apply for a BIS licence for {product} under the simplified procedure?",
        "What documentation and factory inspection are required to get an ISI mark for {product}?",
        "What are the statutory application and marking fees for {product} certification?",
        "Can a startup get concessions on BIS licensing fees when manufacturing {product}?",
        "How long does it take to obtain a BIS licence for {product} from application to grant?",
    ],
    "LABORATORY": [
        "Where can I get {product} tested at a BIS recognized laboratory?",
        "Which testing laboratories in India are accredited to test {product} according to {standard}?",
        "Are there central or regional BIS labs that conduct testing for {product}?",
        "How do I submit pre-licence testing samples of {product} to an approved BIS lab?",
    ],
    "CONSUMER_QUERY": [
        "How can a consumer verify if the ISI mark on {product} is genuine or fake?",
        "How do I check the 7-digit CM/L licence number printed on {product} using the BIS CARE app?",
        "What should I do if I purchased sub-standard or counterfeit {product} bearing a fake ISI mark?",
        "Is it legal for a retailer to sell {product} without an ISI mark in India?",
    ]
}

def clean_title(title: str) -> str:
    if not title:
        return ""
    t = re.sub(r'[\ufffd\?]+', ' - ', title)
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def extract_product_keyword(title: str) -> str:
    cleaned = clean_title(title)
    # Remove IS numbers like 'IS 269:2015', 'IS 14543', 'IS/ISO 9001'
    cleaned = re.sub(r'(?i)\b(?:IS|is)\s*(?:/[A-Za-z]+)?\s*\d+(?:\s*\([^)]*\))?(?::\d{4})?\b', '', cleaned)
    # Remove standard boilerplate phrases
    cleaned = re.sub(r'(?i)\b(?:specification for|specification|code of practice for|methods of test for|guidelines for|requirements for|method of test for|glossary of terms relating to)\b', '', cleaned)
    cleaned = re.sub(r'^[\s\-–—:;,()]+', '', cleaned)
    parts = [p.strip() for p in re.split(r'[-–—:;,()]', cleaned) if p.strip()]
    candidate = parts[0] if parts else ""
    if candidate.lower().startswith("for "):
        candidate = candidate[4:].strip()
    words = candidate.split()
    if len(words) > 5:
        candidate = " ".join(words[:4])
    return candidate.title() if candidate and len(candidate) > 2 else "Industrial Product"

def generate_1000_questions():
    print(f"\n{'='*75}")
    print("  BIS SmartAssist — Generating 1,000 Comprehensive Persona Questions & Ground Truth")
    print(f"{'='*75}\n")

    db = SessionLocal()
    try:
        standards = db.query(Standard).filter(Standard.title != "").all()
        print(f"Loaded {len(standards)} published standards from database.")
    finally:
        db.close()

    # Load seed document knowledge
    seed_map = {doc.get("standard_number", "").split(":")[0].strip().upper(): doc for doc in SEED_DOCUMENTS}

    # Selected curated key standards to ensure high distribution of critical domains
    curated_stds = [s for s in standards if s.is_mandatory or s.product_category in [
        "Civil & Construction", "Electrical", "Food & Agriculture", "Chemicals & Petrochemicals", "Mechanical", "Medical Equipment"
    ]]

    random.seed(42)
    questions = []
    q_id = 1

    # Phase 1: High-depth seed questions with clause-level grounding (first ~150)
    for doc in SEED_DOCUMENTS:
        std_num = doc.get("standard_number", "")
        std_title = clean_title(doc.get("title", ""))
        chunks = doc.get("chunks", [])
        prod = extract_product_keyword(std_title)

        for chunk in chunks[:4]:
            clause = chunk.get("clause_number", "General")
            content = chunk.get("content", "")
            
            # Formulate query
            intents = ["TESTING", "STANDARD_LOOKUP", "CERTIFICATION", "CONSUMER_QUERY"]
            intent = intents[(q_id) % len(intents)]
            persona = PERSONAS[q_id % len(PERSONAS)]
            tpl = random.choice(INTENT_TEMPLATES[intent])
            query = tpl.format(product=prod, standard=std_num)

            ans = f"According to {std_num} ({std_title}), Clause {clause} specifies: {content[:350].strip()}... Conformity is assessed under BIS Scheme I with strict testing and quality verification."

            questions.append({
                "id": q_id,
                "query": query,
                "persona": persona,
                "category": chunk.get("product_category") or "General",
                "intent": intent,
                "expected_standard": std_num,
                "product": prod,
                "clause_reference": clause,
                "is_mandatory": True,
                "certification_scheme": "Scheme I (ISI Mark)",
                "ground_truth_answer": ans,
                "key_facts": [std_num.split(":")[0], f"Clause {clause}", "Scheme I", prod]
            })
            q_id += 1
            if q_id > 150:
                break

    # Phase 2: Domain-specific questions across all 23,866 standards (up to 1,000)
    shuffled_stds = list(curated_stds)
    random.shuffle(shuffled_stds)

    std_idx = 0
    while q_id <= 1000:
        std = shuffled_stds[std_idx % len(shuffled_stds)]
        std_idx += 1

        std_num = std.standard_number
        std_title = clean_title(std.title)
        category = std.product_category or "General"
        is_mand = bool(std.is_mandatory)
        scheme = std.certification_scheme or "Scheme I (ISI Mark)"
        prod = extract_product_keyword(std_title)

        intents_pool = ["STANDARD_LOOKUP", "CERTIFICATION", "TESTING", "LICENSING", "LABORATORY", "CONSUMER_QUERY"]
        intent = intents_pool[q_id % len(intents_pool)]
        persona = PERSONAS[q_id % len(PERSONAS)]
        
        tpl = random.choice(INTENT_TEMPLATES[intent])
        query = tpl.format(product=prod, standard=std_num)

        mand_text = "mandatory under Government Quality Control Order (QCO)" if is_mand else "voluntary certification scheme unless notified under a mandatory QCO"
        
        gt_answer = (
            f"The applicable Indian Standard is **{std_num}** ({std_title}). "
            f"This standard establishes technical requirements, quality benchmarks, and testing criteria for {prod}. "
            f"Certification is administered under **{scheme}**, and compliance is {mand_text}. "
            f"Manufacturers must establish in-house testing facilities or test at BIS-recognized laboratories to obtain the ISI mark."
        )

        facts = [std_num.split(":")[0].strip()]
        if is_mand:
            facts.append("Mandatory QCO")
        facts.append(scheme)
        facts.append(prod)

        questions.append({
            "id": q_id,
            "query": query,
            "persona": persona,
            "category": category,
            "intent": intent,
            "expected_standard": std_num,
            "product": prod,
            "clause_reference": "Standard Specification",
            "is_mandatory": is_mand,
            "certification_scheme": scheme,
            "ground_truth_answer": gt_answer,
            "key_facts": facts
        })
        q_id += 1

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)

    print(f"[OK] Generated {len(questions)} high-quality questions and ground-truth answers.")
    print(f"[OK] Saved to: {OUTPUT_PATH}")

if __name__ == "__main__":
    generate_1000_questions()
