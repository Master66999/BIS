import re
from typing import Dict, Any, List, Tuple

INTENTS = [
    "GREETING",
    "BOT_CAPABILITIES",
    "STANDARD_LOOKUP",
    "CERTIFICATION",
    "LICENSING",
    "TESTING",
    "HALLMARKING",
    "LABORATORY",
    "PRODUCT_REQUIREMENTS",
    "CONSUMER_QUERY",
    "BIS_SERVICE",
    "DOCUMENT_LOOKUP",
    "CLAUSE_LOOKUP",
    "GENERAL_INFORMATION"
]

# Common product keywords & aliases
PRODUCT_CATALOG = {
    "cement": ["cement", "opc", "ppc", "psc", "ordinary portland cement", "portland", "portland pozzolana", "सिमेंट", "सीमेंट"],
    "concrete": ["concrete", "reinforced concrete", "rcc", "plain concrete", "cement concrete", "कंक्रीट"],
    "pressure cooker": ["pressure cooker", "cooker", "domestic pressure cooker", "कुकर"],
    "electric fan": ["fan", "ceiling fan", "electric fan", "table fan", "pedestal fan", "पंखा", "पंखे"],
    "packaged drinking water": ["drinking water", "packaged water", "mineral water", "bottled water", "water bottle", "पाणी", "पानी"],
    "steel rebar": ["steel", "rebar", "tmt", "deformed bar", "iron rod", "लोहा", "स्टील", "सरिया"],
    "helmet": ["helmet", "helmets", "headgear", "motorcycle helmet", "safety helmet", "हेल्मेट", "हेलमेट"],
    "gold hallmarking": ["gold", "jewellery", "jewelry", "hallmark", "hallmarking", "huid", "silver", "सोने", "सोना", "चांदी"],
    "toys": ["toy", "toys", "safety of toys", "doll", "dolls", "खेळणी", "खिलौने"],
    "solar pv": ["solar", "solar panel", "pv module", "photovoltaic", "solar water heater", "सौर ऊर्जा"],
    "cables": ["cable", "cables", "wire", "wires", "pvc insulated cable", "वायर", "केबल"],
    "batteries": ["battery", "batteries", "lead acid battery", "lithium", "बैटरी"],
    "medical mask": ["mask", "surgical mask", "ppe", "n95", "मास्क"],
    "electrical appliances": ["electrical appliance", "electrical appliances", "appliances", "electronic goods", "refrigerator", "विद्युत उपकरण"],
    "gas stove": ["gas stove", "lpg stove", "cookstove", "गैस चूल्हा"],
    "electric iron": ["electric iron", "steam iron", "dry iron", "इस्त्री"],
    "immersion heater": ["immersion water heater", "immersion heater", "water heater", "geyser", "water heating rod"],
    "mixer grinder": ["mixer grinder", "food mixer", "food processor", "blender", "मिक्सर"],
    "microwave oven": ["microwave oven", "microwave"],
    "fire extinguisher": ["fire extinguisher", "fire extinguishers", "अग्निशामक"],
    "circuit breaker": ["circuit breaker", "mcb", "miniature circuit breaker", "rccb"],
    "switch": ["switch", "switches", "electrical switch", "socket", "plug"],
    "transformer": ["transformer", "distribution transformer", "power transformer"],
    "footwear": ["safety footwear", "leather footwear", "shoes", "safety shoe", "जूते"],
    "plywood": ["plywood", "blockboard", "flush door", "प्लाईवुड"],
    "pipe": ["pvc pipe", "hdpe pipe", "upvc pipe", "polyethylene pipe", "पाइप"],
    "laptop": ["laptop", "notebook", "tablet", "computer"],
    "mobile phone": ["mobile phone", "smartphone", "cellular phone", "मोबाइल"],
    "cctv": ["cctv", "cctv camera", "surveillance camera"],
    "led light": ["led lamp", "led light", "led luminaire", "bulb", "एलईडी"]
}

# Canonical primary standard mapping for products
PRODUCT_CANONICAL_STANDARDS = {
    "pressure cooker": "IS 2347:2023",
    "cement": "IS 269:2015",
    "concrete": "IS 456:2000",
    "reinforced concrete": "IS 456:2000",
    "steel rebar": "IS 1786:2008",
    "electric fan": "IS 374:2019",
    "packaged drinking water": "IS 14543:2024",
    "helmet": "IS 4151:2020",
    "gold hallmarking": "IS 1417:2016",
    "toys": "IS 9873 (Part 1):2019",
    "cables": "IS 694:2010",
    "batteries": "IS 16046:2018",
    "solar pv": "IS 14286:2010",
    "medical mask": "IS 16289:2014",
    "electrical appliances": "IS 302 (Part 1):2024",
    "gas stove": "IS 4246",
    "electric iron": "IS 366",
    "immersion heater": "IS 368",
    "mixer grinder": "IS 4250",
    "microwave oven": "IS 302 (Part 2/Sec 25)",
    "fire extinguisher": "IS 15683",
    "circuit breaker": "IS/IEC 60898",
    "switch": "IS 3854",
    "transformer": "IS 1180",
    "footwear": "IS 15298",
    "plywood": "IS 303",
    "pipe": "IS 4984",
    "laptop": "IS 13252",
    "mobile phone": "IS 13252",
    "cctv": "IS 13252",
    "led light": "IS 16102"
}

# Multilingual intent cues
HINDI_INTENT_PATTERNS = [
    (r"(प्रमाणन|सर्टिफिकेशन|लाइसेंस|लाईसेंस)", "CERTIFICATION"),
    (r"(हॉलमार्क|हॉलमार्किंग|सोने|चांदी)", "HALLMARKING"),
    (r"(परीक्षण|टेस्टिंग|जांच|रासायनिक)", "TESTING"),
    (r"(मानक|स्टैंडर्ड|लागू)", "STANDARD_LOOKUP"),
    (r"(प्रयोगशाला|लैब)", "LABORATORY"),
    (r"(शिकायत|कंज्यूमर|उपभोक्ता)", "CONSUMER_QUERY")
]

MARATHI_INTENT_PATTERNS = [
    (r"(प्रमाणपत्र|प्रमाणीकरण|परवाना|लायसन्स)", "CERTIFICATION"),
    (r"(हॉलमार्क|हॉलमार्किंग|सोने|चांदी)", "HALLMARKING"),
    (r"(चाचणी|टेस्टिंग|तपासणी|रासायनिक)", "TESTING"),
    (r"(मानक|स्टँडर्ड|लागू)", "STANDARD_LOOKUP"),
    (r"(प्रयोगशाळा|लॅब)", "LABORATORY"),
    (r"(तक्रार|ग्राहक)", "CONSUMER_QUERY")
]

def detect_language(text: str) -> str:
    devanagari_chars = sum(1 for c in text if '\u0900' <= c <= '\u097F')
    total_alpha = sum(1 for c in text if c.isalpha())
    if total_alpha > 0 and (devanagari_chars / total_alpha) > 0.3:
        marathi_markers = ["आहे", "का", "माझ्या", "कोणता", "कसा", "करावे", "नाही", "सांगा", "मिळेल"]
        text_lower = text.lower()
        if any(marker in text_lower for marker in marathi_markers):
            return "mr"
        return "hi"
    return "en"

def extract_standard_number(text: str) -> str | None:
    # Matches patterns like IS 269:2015, IS 12437:2026, IS 14543, IS/ISO 9001, IS 456:2000
    pattern = r'\b(IS\s*(?:\/[A-Z]+)?\s*\d+(?:\s*\([Pp]art\s*\d+\))?(?::\d{4})?)\b'
    match = re.search(pattern, text, re.IGNORECASE)
    if match:
        return match.group(1).upper().replace("  ", " ")
    return None

def extract_clause(text: str) -> str | None:
    pattern = r'\b(?:clause|cl|section|sec|para)\.?\s*([0-9]+(?:\.[0-9]+)*)\b'
    match = re.search(pattern, text, re.IGNORECASE)
    if match:
        return f"Clause {match.group(1)}"
    return None

def extract_product(text: str) -> Tuple[str | None, str | None]:
    text_lower = text.lower()
    for canonical_name, aliases in PRODUCT_CATALOG.items():
        for alias in aliases:
            # Tolerant regex supporting optional 's' or 'es' plural suffixes
            if re.search(rf'\b{re.escape(alias)}(?:s|es)?\b', text_lower):
                return canonical_name.title(), alias
    return None, None

def classify_query(
    query: str,
    prior_intent: str | None = None,
    prior_product: str | None = None,
    prior_standard: str | None = None
) -> Dict[str, Any]:
    text = query.strip()
    text_lower = text.lower()
    lang = detect_language(text)
    
    std_num = extract_standard_number(text)
    clause = extract_clause(text)
    product, matched_alias = extract_product(text)
    
    # 1. Check greetings & bot inquiries first
    greetings = ["hi", "hello", "hey", "namaste", "namaskar", "good morning", "good afternoon", "good evening", "नमस्ते", "नमस्कार"]
    if any(text_lower == g or text_lower.startswith(g + " ") or text_lower.rstrip(".!?") == g for g in greetings):
        return {
            "intent": "GREETING",
            "entities": {"product": prior_product, "standard_number": prior_standard, "clause": None, "matched_alias": None},
            "language": lang,
            "canonical_product": prior_product
        }

    if any(k in text_lower for k in ["who are you", "what can you do", "what is this app", "how can you help", "features", "introduce yourself"]):
        return {
            "intent": "BOT_CAPABILITIES",
            "entities": {"product": prior_product, "standard_number": prior_standard, "clause": None, "matched_alias": None},
            "language": lang,
            "canonical_product": prior_product
        }

    # 2. Canonical standard resolution and multi-turn inheritance
    if not std_num and product:
        canonical_std = PRODUCT_CANONICAL_STANDARDS.get(product.lower())
        if canonical_std and any(k in text_lower for k in [
            "standard", "manufacture", "test", "testing", "certif", "qco", "quality", "licen",
            "requirement", "rule", "guideline", "limit", "manak", "isi", "construction", "check", "buy"
        ]):
            std_num = canonical_std

    if not std_num and prior_standard:
        std_num = prior_standard

    if not product and prior_product:
        product = prior_product
    
    # 3. Intent heuristics
    detected_intent = "GENERAL_INFORMATION"
    
    if clause:
        detected_intent = "CLAUSE_LOOKUP"
    elif any(k in text_lower for k in [
        "which standard", "applicable standard", "standard for", "what is the standard",
        "standard number", "what indian standards", "explain is", "available for", "which bis standards", "standards should i check", "कोणता", "कौनसा", "मानक"
    ]):
        detected_intent = "STANDARD_LOOKUP"
    elif any(k in text_lower for k in ["hallmark", "huid", "carat", "purity", "22k", "24k", "assay", "हॉलमार्क"]):
        detected_intent = "HALLMARKING"
    elif re.search(r'\b(lab|labs|laboratory|laboratories|testing facility|lrs|where to test|who tests|प्रयोगशाला|लॅब)\b', text_lower):
        detected_intent = "LABORATORY"
    elif any(k in text_lower for k in ["qco", "quality control order"]):
        detected_intent = "CERTIFICATION"
    elif any(k in text_lower for k in ["licence", "license", "grant of licence", "how to apply", "fees", "portal", "manakonline", "procedure", "process", "steps", "obtain", "perwana", "परवाना", "लाईसेंस"]):
        detected_intent = "LICENSING"
    elif any(k in text_lower for k in ["certif", "isi mark", "scheme i", "scheme ii", "crs", "fmcs", "certificate", "mandatory", "compulsory", "प्रमाणन", "प्रमाणीकरण"]):
        detected_intent = "CERTIFICATION"
    elif any(k in text_lower for k in ["test", "testing", "sampling", "tensile", "compressive", "chemical", "limit", "limits", "tolerance", "bend", "elongation", "parameter", "strength", "composition", "चाचणी", "परीक्षण"]):
        detected_intent = "TESTING"
    elif any(k in text_lower for k in ["buy", "buying", "consumer", "complaint", "bis care", "fake", "counterfeit", "verify", "mobile app", "cheat", "sub-standard", "तक्रार", "उपभोक्ता"]):
        detected_intent = "CONSUMER_QUERY"
    elif any(k in text_lower for k in ["requirement", "specification", "dimension", "safety"]):
        detected_intent = "PRODUCT_REQUIREMENTS"
    elif std_num and not prior_intent:
        detected_intent = "STANDARD_LOOKUP"
    elif any(k in text_lower for k in ["what is bis", "services", "scheme", "mandate", "headquarter", "regional office"]):
        detected_intent = "BIS_SERVICE"
    elif prior_intent:
        detected_intent = prior_intent
        
    # Check language patterns
    if lang == "hi":
        for pat, intent_name in HINDI_INTENT_PATTERNS:
            if re.search(pat, text):
                detected_intent = intent_name
                break
    elif lang == "mr":
        for pat, intent_name in MARATHI_INTENT_PATTERNS:
            if re.search(pat, text):
                detected_intent = intent_name
                break

    entities = {
        "product": product,
        "standard_number": std_num,
        "clause": clause,
        "matched_alias": matched_alias
    }

    return {
        "intent": detected_intent,
        "entities": entities,
        "language": lang,
        "canonical_product": product
    }
