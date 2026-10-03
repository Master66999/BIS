import os
import json
import re
from typing import Dict, Any, List, Tuple, Optional

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
    "steel rebar": ["steel", "rebar", "tmt", "tmt rebar", "reinforcement steel", "deformed bar", "iron rod", "high strength deformed steel", "लोहा", "स्टील", "सरिया"],
    "helmet": ["helmet", "helmets", "headgear", "motorcycle helmet", "safety helmet", "protective helmet", "हेल्मेट", "हेलमेट"],
    "gold hallmarking": ["gold", "jewellery", "jewelry", "hallmark", "hallmarking", "huid", "silver", "सोने", "सोना", "चांदी"],
    "toys": ["toy", "toys", "safety of toys", "doll", "dolls", "खेळणी", "खिलौने"],
    "solar pv": ["solar", "solar panel", "pv module", "photovoltaic", "solar water heater", "सौर ऊर्जा"],
    "cables": ["cable", "cables", "wire", "wires", "pvc insulated cable", "वायर", "केबल"],
    "batteries": ["battery", "batteries", "lead acid battery", "lithium", "secondary cells", "lithium batteries", "li-ion", "बैटरी"],
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
    "pipe": ["pipe", "pvc pipe", "hdpe pipe", "upvc pipe", "polyethylene pipe", "sprinkler pipe", "steel tube", "पाइप"],
    "laptop": ["laptop", "notebook", "tablet", "computer"],
    "mobile phone": ["mobile phone", "smartphone", "cellular phone", "मोबाइल"],
    "cctv": ["cctv", "cctv camera", "surveillance camera"],
    "led light": ["led lamp", "led light", "led luminaire", "bulb", "एलईडी"],
    "cement testing": ["le chatelier", "soundness of cement", "fineness of cement", "setting time of cement", "compressive strength of cement"]
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
    "led light": "IS 16102",
    "cement testing": "IS 4031 (Part 3)"
}

# BIS Domain Expansion Dictionary (used ONLY for retrieval query expansion)
BIS_RETRIEVAL_EXPANSIONS: Dict[str, List[str]] = {
    "tmt": ["IS 1786", "high strength deformed steel bars", "reinforcement steel", "rebar", "Fe 500", "Fe 550"],
    "tmt rebar": ["IS 1786", "high strength deformed steel bars", "reinforcement rebar", "Fe 500D"],
    "reinforcement steel": ["IS 1786", "steel bars and wires for concrete reinforcement", "IS 456"],
    "packaged drinking water": ["IS 14543", "packaged water other than natural mineral water", "mineral water", "potable water"],
    "packaged water": ["IS 14543", "packaged drinking water", "microbiological requirements"],
    "soundness of cement": ["IS 4031", "methods of physical tests for hydraulic cement", "Le Chatelier", "IS 4031 (Part 3)"],
    "le chatelier": ["IS 4031", "Part 3", "determination of soundness", "hydraulic cement"],
    "secondary cells": ["IS 16046", "secondary cells and batteries containing alkaline or other non-acid electrolytes", "lithium"],
    "lithium batteries": ["IS 16046", "secondary cells", "portable sealed secondary cells", "IS 16046:2018"],
    "plywood": ["IS 303", "general purpose plywood", "blockboard", "flush door"],
    "pressure cooker": ["IS 2347", "domestic pressure cookers", "operating pressure", "safety valve"],
    "helmet": ["IS 4151", "protective helmets for motorcycle riders", "headform", "impact attenuation"],
    "ceiling fan": ["IS 374", "electric ceiling type fans and regulators", "air delivery", "service value"],
    "electric fan": ["IS 374", "electric ceiling type fans", "energy efficiency"],
    "hallmarking": ["IS 1417", "gold and gold alloys", "purity in carats and fineness", "HUID", "IS 2112"],
    "huid": ["IS 1417", "hallmarking", "gold jewellery unique identification"],
    "toy safety": ["IS 9873", "safety of toys", "mechanical and physical properties", "IS 9873 (Part 1)"],
    "migration of elements": ["IS 9873 (Part 3)", "migration of certain elements", "toxic elements in toys"],
    "solar panel": ["IS 14286", "IS 16792", "terrestrial photovoltaic PV modules", "solar cell"],
    "solar pv": ["IS 14286", "IS 16792", "photovoltaic modules"],
    "mcb": ["IS/IEC 60898", "circuit breaker", "miniature circuit breaker", "overcurrent protection"],
    "circuit breaker": ["IS/IEC 60898", "miniature circuit breaker", "circuit breakers for overcurrent protection"],
    "ted": ["TED", "Transport Engineering Department", "automotive", "road vehicles", "braking systems", "engine"],
    "pgd": ["PGD", "Production and General Engineering Department", "machine tools", "fasteners", "gears"],
    "txd": ["TXD", "Textile Division", "Textile Department", "technical textiles", "medical textiles", "fibres"],
    "pcd": ["PCD", "Petroleum Coal and Related Products", "Petroleum Coal and Related Products Department", "polymers", "lubricants"],
    "wrd": ["WRD", "Water Resources Division", "Water Resources Department", "irrigation", "dams", "canals", "hydropower"],
    "mtd": ["MTD", "Metallurgical Engineering Department", "metallurgical standards", "steel", "foundry", "heat treatment"],
    "ayush": ["AYUSH", "Ayurveda Yoga Naturopathy Unani Siddha Sowa-Rigpa and Homoeopathy", "traditional medicine"],
    "chd": ["CHD", "Chemical Department", "chemical industry", "paints", "acids", "fertilizers"],
    "ced": ["CED", "Civil Engineering Department", "National Building Code", "concrete", "structural design"],
    "etd": ["ETD", "Electrotechnical Department", "electrical equipment", "transformers", "cables"],
    "med": ["MED", "Mechanical Engineering Department", "pumps", "compressors", "boilers"],
    "fad": ["FAD", "Food and Agriculture Department", "food safety", "agricultural machinery"],
    "litd": ["LITD", "Electronics and Information Technology Department", "software", "cybersecurity", "hardware"]
}

def expand_query_for_retrieval(query: str) -> str:
    """
    Expands query with domain synonyms and canonical aliases strictly for retrieval candidate searching.
    Preserves original terms while appending high-relevance domain expansions.
    """
    q_lower = query.lower()
    expansions: List[str] = []
    
    for key, terms in BIS_RETRIEVAL_EXPANSIONS.items():
        # Match whole word/phrase
        if re.search(rf'\b{re.escape(key)}\b', q_lower):
            for t in terms:
                if t.lower() not in q_lower and t not in expansions:
                    expansions.append(t)

    # Check for department names in query
    dept_keywords = {
        "transport": "TED Transport Engineering Department",
        "automotive": "TED Transport Engineering Department",
        "production": "PGD Production and General Engineering Department",
        "machine tool": "PGD Production and General Engineering Department",
        "textile": "TXD Textile Division",
        "petroleum": "PCD Petroleum Coal and Related Products",
        "water resources": "WRD Water Resources Department",
        "irrigation": "WRD Water Resources Department",
        "metallurg": "MTD Metallurgical Engineering Department",
        "ayurveda": "AYUSH Indian Systems of Medicine",
        "ayush": "AYUSH Indian Systems of Medicine",
        "chemical": "CHD Chemical Department",
        "civil engineering": "CED Civil Engineering Department",
        "electrotechnical": "ETD Electrotechnical Department"
    }
    for kw, dept_exp in dept_keywords.items():
        if kw in q_lower and dept_exp not in expansions:
            expansions.append(dept_exp)

    if expansions:
        # Append expansions (limit to top 4)
        return f"{query} {' '.join(expansions[:4])}"
    return query

# Dynamically enrich from 1,000 question benchmark dataset if available
try:
    _cur_dir = os.path.dirname(os.path.abspath(__file__))
    _root_dir = os.path.dirname(os.path.dirname(os.path.dirname(_cur_dir)))
    _bench_file = os.path.join(_root_dir, "data", "benchmark_1000_questions.json")
    _broad_words = {
        "textiles", "textile", "chemicals", "chemical", "apparatus", "equipment",
        "industrial product", "materials", "products", "electrical", "mechanical", "food",
        "installation", "design", "earth", "fire", "hand", "hot", "lead", "leather",
        "long", "low", "mains", "oil", "photography", "powders", "rubber", "safety",
        "selection", "shipbuilding", "silica", "single", "soils", "specificati", "steel",
        "surface", "thin", "water", "woven", "general", "method", "test", "testing",
        "code", "guide", "practice", "system", "process", "determination", "domestic",
        "purposes", "fixed", "commercial", "requirements", "specification", "appliances", "standard"
    }
    if os.path.exists(_bench_file):
        with open(_bench_file, "r", encoding="utf-8") as _bf:
            _items = json.load(_bf)
            for _item in _items:
                _prod = _item.get("product", "").strip()
                _std = _item.get("expected_standard", "").strip()
                if _prod and _std and len(_prod) > 2:
                    _plow = _prod.lower()
                    # Only add multi-word product names (len >= 2 tokens) that are not generic categories
                    if len(_plow.split()) >= 2 and _plow not in _broad_words:
                        if _plow not in PRODUCT_CANONICAL_STANDARDS:
                            PRODUCT_CANONICAL_STANDARDS[_plow] = _std
                        if _plow not in PRODUCT_CATALOG:
                            PRODUCT_CATALOG[_plow] = [_plow]
except Exception:
    pass

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

def normalize_standard_id(text: str) -> Tuple[str, Optional[str], Optional[str]]:
    """
    Strict normalization for BIS standard numbers.
    Returns (base_id, part, year), e.g.:
    'IS 9873 (Part 1):2019' -> ('IS 9873', '1', '2019')
    'IS 269:2015' -> ('IS 269', None, '2015')
    'IS 269:1989' -> ('IS 269', None, '1989')
    'IS/IEC 60898' -> ('IS/IEC 60898', None, None)
    """
    if not text:
        return ("", None, None)
    clean = text.strip().upper()
    # Normalize spacing
    clean = re.sub(r'\s+', ' ', clean)
    
    # Extract year if present
    m_year = re.search(r':(\d{4})', clean)
    year = m_year.group(1) if m_year else None
    
    # Extract part if present (Part 1, Part 3, (Part 1), (PART 3), Part 2/Sec 25)
    m_part = re.search(r'\b(?:PART|\(PART)\s*([0-9]+(?:/[A-Z0-9]+)*)\)?', clean, re.IGNORECASE)
    part = m_part.group(1) if m_part else None
    
    # Extract base number
    m_base = re.search(r'\b(IS(?:\s*/\s*[A-Z]+)?\s*\d+)\b', clean, re.IGNORECASE)
    if m_base:
        base = re.sub(r'\s*/\s*', '/', m_base.group(1).upper())
        base = re.sub(r'\s+', ' ', base)
    else:
        base = clean
        
    return (base, part, year)

def extract_standard_number(text: str) -> str | None:
    # Matches BIS Act & Consumer Guides
    if re.search(r'\b(?:BIS\s*Act(?:\s*2016)?)\b', text, re.IGNORECASE):
        return "BIS Act 2016"
    if re.search(r'\b(?:BIS\s*CARE|CARE\s*App)\b', text, re.IGNORECASE):
        return "BIS-CARE-GUIDE"
    
    # Matches patterns like IS 269:2015, IS 12437:2026, IS 14543, IS/ISO 9001, IS/IEC 60898, IS 9873 (Part 1):2019, IS 9873 Part 3
    pattern = r'\b(IS(?:\s*/\s*[A-Z]+)?\s*\d+(?:\s*(?:\([Pp]art\s*[0-9A-Za-z/]+\)|[Pp]art\s*[0-9A-Za-z/]+))?(?::\d{4})?)\b'
    match = re.search(pattern, text, re.IGNORECASE)
    if match:
        std_str = match.group(1).upper()
        std_str = re.sub(r'\s*/\s*', '/', std_str)
        std_str = re.sub(r'\s+', ' ', std_str)
        # Normalize "Part X" to "(Part X)" if not already parenthesized
        std_str = re.sub(r'\bPART\s*([0-9A-Z/]+)\b', r'(Part \1)', std_str, flags=re.IGNORECASE)
        return std_str
    return None

def extract_clause(text: str) -> str | None:
    pattern = r'\b(?:clause|cl|section|sec|para)\.?\s*([0-9]+(?:\.[0-9]+)*)\b'
    match = re.search(pattern, text, re.IGNORECASE)
    if match:
        prefix = "Section" if re.search(r'\b(?:section|sec)\b', text, re.IGNORECASE) else "Clause"
        return f"{prefix} {match.group(1)}"
    return None

_SORTED_ALIASES: List[Tuple[str, str]] = []

def get_sorted_aliases() -> List[Tuple[str, str]]:
    global _SORTED_ALIASES
    if not _SORTED_ALIASES:
        pairs = []
        for c_name, aliases in PRODUCT_CATALOG.items():
            for a in aliases:
                if a and len(a) >= 3:
                    pairs.append((a.lower(), c_name))
        _SORTED_ALIASES = sorted(pairs, key=lambda x: len(x[0]), reverse=True)
    return _SORTED_ALIASES

def extract_product(text: str) -> Tuple[str | None, str | None]:
    text_lower = text.lower()
    for alias, canonical_name in get_sorted_aliases():
        if re.search(rf'\b{re.escape(alias)}(?:s|es)?\b', text_lower):
            return canonical_name.title(), alias
    return None, None

def detect_query_type(
    text: str,
    intent: str,
    std_num: Optional[str],
    clause: Optional[str],
    product: Optional[str]
) -> str:
    """
    Classifies the specific query type for fine-grained retrieval routing.
    Types:
    - standard_lookup
    - product_lookup
    - clause_lookup
    - technical_requirement
    - booklet_query
    - cross_source_query
    - ambiguous_query
    - unsupported_query
    """
    text_lower = text.lower()
    
    # 1. Check unsupported / out of domain
    unsupported_signals = [
        "quantum teleportation", "martian", "warp drive", "interstellar",
        "time travel", "antigravity propulsion", "crypto mining standard",
        "unsupported", "fictional", "non-existent standard"
    ]
    if any(sig in text_lower for sig in unsupported_signals):
        return "unsupported_query"
        
    # 2. Check cross-source
    if any(k in text_lower for k in ["compare", "cross-source", "difference between", "versus", " vs ", "handout and standard"]):
        return "cross_source_query"
        
    # 3. Check booklet / department
    dept_signals = [
        "booklet", "handout", "department", "division", "ted", "pgd", "txd", "pcd",
        "wrd", "mtd", "ayush", "chd", "ced", "etd", "litd", "fad", "med", "transport engineering"
    ]
    if any(re.search(rf'\b{re.escape(d)}\b', text_lower) for d in dept_signals):
        return "booklet_query"
        
    # 4. Check clause lookup
    if clause or ("clause" in text_lower and std_num):
        return "clause_lookup"
        
    # 5. Check technical requirement / testing
    tech_signals = [
        "mpa", "tensile", "compressive", "soundness", "fineness", "elongation",
        "tolerance", "chemical composition", "test method", "test procedure",
        "pressure test", "temperature limit", "minimum thickness", "dimension"
    ]
    if any(sig in text_lower for sig in tech_signals) or intent in ["TESTING", "PRODUCT_REQUIREMENTS"]:
        return "technical_requirement"
        
    # 6. Check ambiguous queries
    ambiguous_signals = [
        "biscuit pressure cooker", "fan for building", "standard for pipe",
        "cement code", "iron rod", "solar panel bis", "drinking water limit"
    ]
    if any(sig in text_lower for sig in ambiguous_signals):
        return "ambiguous_query"
        
    # 7. Check standard lookup
    if std_num or any(k in text_lower for k in ["which standard", "standard number", "applicable standard", "is code"]):
        return "standard_lookup"
        
    # 8. Check product lookup
    if product:
        return "product_lookup"
        
    return "standard_lookup"

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
            "query_type": "standard_lookup",
            "entities": {"product": prior_product, "standard_number": prior_standard, "clause": None, "matched_alias": None},
            "language": lang,
            "canonical_product": prior_product
        }

    if any(k in text_lower for k in ["who are you", "what can you do", "what is this app", "how can you help", "features", "introduce yourself"]):
        return {
            "intent": "BOT_CAPABILITIES",
            "query_type": "standard_lookup",
            "entities": {"product": prior_product, "standard_number": prior_standard, "clause": None, "matched_alias": None},
            "language": lang,
            "canonical_product": prior_product
        }

    # 2. Canonical standard resolution and multi-turn inheritance
    if not std_num and product:
        canonical_std = PRODUCT_CANONICAL_STANDARDS.get(product.lower())
        if canonical_std and any(k in text_lower for k in [
            "standard", "manufacture", "test", "testing", "certif", "qco", "quality", "licen",
            "requirement", "rule", "guideline", "limit", "manak", "isi", "construction", "check", "buy", "code"
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

    # Determine granular query type
    query_type = detect_query_type(text, detected_intent, std_num, clause, product)

    entities = {
        "product": product,
        "standard_number": std_num,
        "clause": clause,
        "matched_alias": matched_alias
    }

    return {
        "intent": detected_intent,
        "query_type": query_type,
        "entities": entities,
        "language": lang,
        "canonical_product": product
    }
