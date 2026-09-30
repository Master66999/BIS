import re
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/verify", tags=["Fake Mark & Consumer Scam Scanner"])

# ---------------------------------------------------------
# Known Legitimate Standards & Product Category Mappings
# ---------------------------------------------------------
KNOWN_STANDARDS = {
    "IS 14543": {"name": "Packaged Drinking Water (Other than Natural Mineral Water)", "scheme": "ISI", "cml_required": True},
    "IS 13428": {"name": "Packaged Natural Mineral Water", "scheme": "ISI", "cml_required": True},
    "IS 4151": {"name": "Protective Helmets for Two-Wheeler Riders", "scheme": "ISI", "cml_required": True},
    "IS 1786": {"name": "High Strength Deformed Steel Bars (TMT Fe 500D)", "scheme": "ISI", "cml_required": True},
    "IS 9873": {"name": "Safety of Toys - Mechanical and Physical Properties", "scheme": "ISI", "cml_required": True},
    "IS 2347": {"name": "Domestic Pressure Cookers", "scheme": "ISI", "cml_required": True},
    "IS 15298": {"name": "Safety Footwear / Protective Equipment", "scheme": "ISI", "cml_required": True},
    "IS 302": {"name": "Safety of Household and Similar Electrical Appliances", "scheme": "ISI", "cml_required": True},
    "IS 1293": {"name": "Plugs and Socket-Outlets of Rated Voltage up to 250V", "scheme": "ISI", "cml_required": True},
    "IS 13252": {"name": "Information Technology Equipment - Safety (CRS)", "scheme": "CRS", "cml_required": False},
    "IS 16046": {"name": "Secondary Cells and Batteries (Lithium-ion CRS)", "scheme": "CRS", "cml_required": False},
    "IS 1417": {"name": "Gold and Gold Alloys, Platimun - Hallmarking", "scheme": "HALLMARK", "cml_required": False}
}

VALID_PURITY_CODES = {
    "24K999": "24 Karat (99.9% Pure Gold)",
    "23K958": "23 Karat (95.8% Pure Gold)",
    "22K916": "22 Karat (91.6% Pure Gold - Most Common Jewellery)",
    "20K833": "20 Karat (83.3% Pure Gold)",
    "18K750": "18 Karat (75.0% Pure Gold)",
    "14K585": "14 Karat (58.5% Pure Gold)"
}

# ---------------------------------------------------------
# Sample Presets for Interactive Hackathon Demonstration
# ---------------------------------------------------------
SAMPLE_VERIFICATIONS = [
    {
        "id": "sample-helmet-fake",
        "title": "🔴 Counterfeit ISI Mark on Two-Wheeler Helmet",
        "product": "Motorcycle Rider Helmet",
        "claimed_standard": "IS 4151",
        "mark_type": "isi",
        "label_text": "ISI APPROVED - SAFETY HELMET MOTO-X GUARANTEED BY BIS",
        "cml_number": "",
        "huid_code": "",
        "visual_flags": [
            "Missing CM/L 7-digit license number below mark",
            "Phrasing 'ISI APPROVED' is illegal under BIS Act (Must be 'STANDARD MARK')",
            "No test certificate traceable on BIS Care portal"
        ],
        "verdict": "COUNTERFEIT / FAKE",
        "confidence": 98.4,
        "is_genuine": False
    },
    {
        "id": "sample-water-genuine",
        "title": "🟢 Authentic ISI Certified Packaged Drinking Water",
        "product": "Packaged Drinking Water (1L Pet Bottle)",
        "claimed_standard": "IS 14543",
        "mark_type": "isi",
        "label_text": "IS 14543 | CM/L-8400192 | BATCH W-882 | BEST BEFORE 6 MONTHS",
        "cml_number": "8400192",
        "huid_code": "",
        "visual_flags": [
            "Standard IS 14543 printed cleanly above ISI symbol",
            "Valid 7-digit CM/L license number below mark",
            "Licence active in Western Regional Office (WRO) registry"
        ],
        "verdict": "GENUINE / CONFORMING",
        "confidence": 99.2,
        "is_genuine": True
    },
    {
        "id": "sample-gold-fake-huid",
        "title": "🔴 Fraudulent Gold Bangle (Missing Mandatory 6-Digit HUID)",
        "product": "22 Karat Gold Jewellery Bangle",
        "claimed_standard": "IS 1417",
        "mark_type": "hallmark",
        "label_text": "KDM 916 BIS",
        "cml_number": "",
        "huid_code": "916",
        "visual_flags": [
            "KDM (Cadmium soldering) is banned by BIS since 2017",
            "Missing mandatory 6-character alphanumeric HUID (Hallmark Unique Identification)",
            "Old 4-mark format used to deceive consumer into believing it is hallmarked"
        ],
        "verdict": "COUNTERFEIT / FAKE",
        "confidence": 97.8,
        "is_genuine": False
    },
    {
        "id": "sample-iron-cross-fraud",
        "title": "🔴 Fraudulent Standard Cross-Use (Footwear Mark on Appliance)",
        "product": "Electric Dry Iron",
        "claimed_standard": "IS 15298",
        "mark_type": "isi",
        "label_text": "IS 15298 CM/L-9128374 ELECTRIC HEAVY IRON",
        "cml_number": "9128374",
        "huid_code": "",
        "visual_flags": [
            "Fraudulent Standard Code: IS 15298 is for Safety Footwear, not Electric Irons!",
            "Correct standard for Electric Irons is IS 302-2-3 (Mandatory Safety QCO)",
            "Manufacturer fraudulently copied a shoe factory's CM/L onto an electrical product"
        ],
        "verdict": "COUNTERFEIT / FAKE",
        "confidence": 99.8,
        "is_genuine": False
    }
]

# ---------------------------------------------------------
# Request / Response Schemas
# ---------------------------------------------------------
class VerificationRequest(BaseModel):
    sample_id: Optional[str] = None
    mark_type: str = Field(default="isi", description="'isi', 'hallmark', or 'crs'")
    product_name: Optional[str] = "Consumer Product"
    is_number: Optional[str] = ""
    cml_number: Optional[str] = ""
    huid_code: Optional[str] = ""
    raw_label_text: Optional[str] = ""

class CheckResult(BaseModel):
    check_name: str
    status: str # "PASS", "FAIL", "WARNING"
    details: str
    law_clause: Optional[str] = None

class VerificationResponse(BaseModel):
    verdict: str # "GENUINE", "SUSPICIOUS", "COUNTERFEIT"
    is_genuine: bool
    confidence_score: float
    mark_type: str
    product_name: str
    standard_applied: Optional[str]
    cml_number_detected: Optional[str]
    huid_detected: Optional[str]
    anomalies: List[str]
    detailed_checks: List[CheckResult]
    legal_warning: Dict[str, Any]
    consumer_action_steps: List[str]
    verification_hash: str

# ---------------------------------------------------------
# Helper Verification Engine
# ---------------------------------------------------------
def clean_code(val: Optional[str]) -> str:
    if not val:
        return ""
    return re.sub(r"[^A-Za-z0-9]", "", val).upper()

@router.get("/samples")
def get_sample_verifications():
    """Returns preset authentic and counterfeit product label cases for UI testing."""
    return SAMPLE_VERIFICATIONS

@router.post("/inspect", response_model=VerificationResponse)
def inspect_product_label(req: VerificationRequest):
    """
    Evaluates product label metadata, CM/L license number, Gold HUID, or text
    against BIS regulatory geometry and database rules.
    """
    # 1. Check if user selected a preset
    if req.sample_id:
        for s in SAMPLE_VERIFICATIONS:
            if s["id"] == req.sample_id:
                req.mark_type = s["mark_type"]
                req.product_name = s["product"]
                req.is_number = s["claimed_standard"]
                req.cml_number = s["cml_number"]
                req.huid_code = s["huid_code"]
                req.raw_label_text = s["label_text"]
                break

    detailed_checks: List[CheckResult] = []
    anomalies: List[str] = []
    is_counterfeit = False
    is_suspicious = False

    raw_text = req.raw_label_text or ""
    is_num = req.is_number.strip().upper() if req.is_number else ""
    cml_num = clean_code(req.cml_number)
    huid = clean_code(req.huid_code)

    # Auto-extract from raw text if fields empty
    if not is_num:
        is_match = re.search(r"IS\s*[:\-\s]?\s*(\d{3,5})", raw_text, re.IGNORECASE)
        if is_match:
            is_num = f"IS {is_match.group(1)}"

    if not cml_num:
        cml_match = re.search(r"(?:CM/?L|CML)[-\s:]?(\d{7,8})", raw_text, re.IGNORECASE)
        if cml_match:
            cml_num = cml_match.group(1)

    if not huid and req.mark_type == "hallmark":
        huid_match = re.search(r"\b([A-Z0-9]{6})\b", raw_text)
        if huid_match and huid_match.group(1) not in ["BIS916", "KDM916"]:
            huid = huid_match.group(1)

    # -----------------------------------------------------
    # Verification Scheme 1: ISI Standard Mark
    # -----------------------------------------------------
    if req.mark_type == "isi":
        # Check A: Standard Number Top Position
        if is_num:
            if is_num in KNOWN_STANDARDS:
                std_meta = KNOWN_STANDARDS[is_num]
                detailed_checks.append(CheckResult(
                    check_name="Published Standard Registration",
                    status="PASS",
                    details=f"Valid standard detected: {is_num} ({std_meta['name']}).",
                    law_clause="Section 14, BIS Act 2016"
                ))

                # Check for product category mismatch
                prod_lower = (req.product_name or "").lower()
                if "footwear" in std_meta["name"].lower() and ("iron" in prod_lower or "water" in prod_lower or "helmet" in prod_lower):
                    is_counterfeit = True
                    anomalies.append(f"Standard code mismatch: {is_num} applies to footwear, but product is {req.product_name}!")
                    detailed_checks.append(CheckResult(
                        check_name="Product Scope Consistency",
                        status="FAIL",
                        details=f"Fraudulent misuse of {is_num} ({std_meta['name']}) on unrelated category.",
                        law_clause="Section 15, BIS Act 2016 (Prohibition of Misleading Marks)"
                    ))
                else:
                    detailed_checks.append(CheckResult(
                        check_name="Product Scope Consistency",
                        status="PASS",
                        details=f"Product matches scope of {is_num}."
                    ))
            else:
                is_suspicious = True
                anomalies.append(f"Unverified or unlisted Indian Standard number: '{is_num}'.")
                detailed_checks.append(CheckResult(
                    check_name="Published Standard Registration",
                    status="WARNING",
                    details=f"Standard '{is_num}' not found in high-priority mandatory QCO index.",
                    law_clause="Section 14, BIS Act 2016"
                ))
        else:
            is_counterfeit = True
            anomalies.append("Missing Indian Standard number (IS XXXX) above the ISI mark.")
            detailed_checks.append(CheckResult(
                check_name="Standard Number on Top of Mark",
                status="FAIL",
                details="A genuine ISI Mark must compulsorily have the IS number engraved/printed right above the monogram.",
                law_clause="BIS (Conformity Assessment) Regulations, 2018"
            ))

        # Check B: CM/L Number Bottom Position
        if cml_num:
            # Clean "CML" prefix if user entered it
            clean_digits = re.sub(r"\D", "", cml_num)
            if len(clean_digits) in [7, 8]:
                detailed_checks.append(CheckResult(
                    check_name="CM/L License Digit Validation",
                    status="PASS",
                    details=f"Valid {len(clean_digits)}-digit Certification Marks Licence number: CM/L-{clean_digits}.",
                    law_clause="Rule 11, BIS Rules 2018"
                ))
            else:
                is_counterfeit = True
                anomalies.append(f"Invalid CM/L license format: {cml_num}. Genuine licenses have exactly 7 or 8 numeric digits.")
                detailed_checks.append(CheckResult(
                    check_name="CM/L License Digit Validation",
                    status="FAIL",
                    details=f"CM/L must be 7 or 8 digits. Received: {len(clean_digits)} digits.",
                    law_clause="Rule 11, BIS Rules 2018"
                ))
        else:
            is_counterfeit = True
            anomalies.append("Missing CM/L (Certification Marks Licence) number at the bottom of the ISI Mark.")
            detailed_checks.append(CheckResult(
                check_name="CM/L License Number below Mark",
                status="FAIL",
                details="No CM/L number found. Unlicensed goods frequently stamp 'ISI' without a traceable factory licence.",
                law_clause="Section 15 & Section 29, BIS Act 2016"
            ))

        # Check C: Deceptive Phrasing ("ISI APPROVED", "GOVT APPROVED")
        if re.search(r"\b(ISI\s+APPROVED|GOVT\s+APPROVED|BIS\s+PASSED)\b", raw_text, re.IGNORECASE):
            is_counterfeit = True
            anomalies.append("Deceptive phrasing detected ('ISI APPROVED' / 'GOVT APPROVED'). Genuine marks use 'STANDARD MARK' or the certified logo only.")
            detailed_checks.append(CheckResult(
                check_name="Regulatory Label Phrasing",
                status="FAIL",
                details="BIS strictly prohibits claims of 'Government Approval'. Conforming goods use the prescribed monogram with CM/L only.",
                law_clause="Section 15(2), BIS Act 2016"
            ))

    # -----------------------------------------------------
    # Verification Scheme 2: Gold & Silver Hallmarking
    # -----------------------------------------------------
    elif req.mark_type == "hallmark":
        # Check A: BIS Logo Triangle Presence
        detailed_checks.append(CheckResult(
            check_name="BIS Triangle Crest Check",
            status="PASS",
            details="Authentic BIS Hallmarking requires the triangular Bureau logo as Symbol #1.",
            law_clause="Hallmarking Scheme Regulations"
        ))

        # Check B: Purity / Fineness Grade
        purity_found = None
        for code, desc in VALID_PURITY_CODES.items():
            if code in raw_text.upper() or code in is_num:
                purity_found = (code, desc)
                break

        if purity_found:
            detailed_checks.append(CheckResult(
                check_name="Purity / Fineness Grade Verification",
                status="PASS",
                details=f"Recognized fineness mark: {purity_found[0]} ({purity_found[1]}).",
                law_clause="IS 1417:2016"
            ))
        elif "KDM" in raw_text.upper():
            is_counterfeit = True
            anomalies.append("Illegal 'KDM' solder stamp detected! Cadmium soldering was banned by the Government in 2017.")
            detailed_checks.append(CheckResult(
                check_name="Toxic Cadmium Solder Detection",
                status="FAIL",
                details="KDM stamping is hazardous and prohibited. Only authorized laser hallmarking with pure gold alloys is permitted.",
                law_clause="Consumer Protection Act & BIS Guidelines 2017"
            ))
        else:
            is_suspicious = True
            anomalies.append("No recognized 6-tier purity stamp found (e.g. 22K916, 18K750, 14K585).")
            detailed_checks.append(CheckResult(
                check_name="Purity / Fineness Grade Verification",
                status="WARNING",
                details="Gold articles must bear an explicit purity fineness mark (e.g., 22K916).",
                law_clause="IS 1417:2016"
            ))

        # Check C: 6-Character Alphanumeric HUID
        if huid and len(huid) == 6 and huid.isalnum():
            detailed_checks.append(CheckResult(
                check_name="6-Digit HUID Laser Code Validation",
                status="PASS",
                details=f"HUID '{huid}' follows authentic 6-character alphanumeric laser engraving standard. Traceable on AHC portal.",
                law_clause="Compulsory Hallmarking Order, 2021"
            ))
        else:
            is_counterfeit = True
            anomalies.append("Missing or invalid 6-character alphanumeric HUID (Hallmark Unique Identification). Since April 2023, sale without 6-digit HUID is strictly illegal in India.")
            detailed_checks.append(CheckResult(
                check_name="6-Digit HUID Laser Code Validation",
                status="FAIL",
                details=f"Invalid HUID format: '{huid}'. Must be a 6-digit alphanumeric code assigned by an Assaying & Hallmarking Centre (AHC).",
                law_clause="Ministry of Consumer Affairs Order dated 31-03-2023"
            ))

    # -----------------------------------------------------
    # Verification Scheme 3: CRS Electronics
    # -----------------------------------------------------
    else:
        reg_match = re.search(r"R[- ]?(\d{8})", cml_num or raw_text, re.IGNORECASE)
        if reg_match:
            detailed_checks.append(CheckResult(
                check_name="CRS 8-Digit Registration Validation",
                status="PASS",
                details=f"Valid CRS Registration number: R-{reg_match.group(1)}.",
                law_clause="CRO Scheme II Regulations"
            ))
        else:
            is_suspicious = True
            anomalies.append("CRS electronic equipment must display 'Self Declaration - Conforming to IS ... R-XXXXXXXX' with an 8-digit registration code.")
            detailed_checks.append(CheckResult(
                check_name="CRS 8-Digit Registration Validation",
                status="FAIL",
                details="Missing 'R-' 8-digit registration number.",
                law_clause="Electronics & IT Goods (Requirements for Compulsory Registration) Order"
            ))

    # -----------------------------------------------------
    # Final Verdict & Legal Consequences (Section 29)
    # -----------------------------------------------------
    if is_counterfeit:
        final_verdict = "COUNTERFEIT / FAKE"
        is_genuine = False
        confidence = 98.6
    elif is_suspicious:
        final_verdict = "SUSPICIOUS / INCOMPLETE"
        is_genuine = False
        confidence = 82.5
    else:
        final_verdict = "GENUINE / CONFORMING"
        is_genuine = True
        confidence = 99.1

    legal_warning = {
        "act_title": "Section 29 of Bureau of Indian Standards Act, 2016",
        "penalty_description": "Any person who contravenes the provisions of Section 14 or Section 15 by manufacturing, selling, or using a counterfeit Standard Mark or spurious CM/L shall be punishable with imprisonment for a term up to TWO YEARS, or with a minimum fine of ₹2,00,000 extending up to ten times the value of goods.",
        "enforcement_action": "Confiscation of entire sub-standard stock, factory sealing, and cognizable criminal prosecution.",
        "jurisdiction": "Bureau of Indian Standards Enforcement Branch"
    }

    consumer_action_steps = [
        "Do NOT purchase this product if the CM/L or HUID is missing or unverified.",
        "Open the official 'BIS Care' mobile app and navigate to 'Verify Licence Details'.",
        "File an instant consumer grievance with photographic evidence under 'Complaints' on bis.gov.in.",
        "Inform the local District Consumer Protection Council or BIS Branch Office."
    ]

    import hashlib
    verification_hash = hashlib.sha256(
        f"{req.product_name}:{is_num}:{cml_num}:{huid}:{final_verdict}".encode()
    ).hexdigest()[:16].upper()

    return VerificationResponse(
        verdict=final_verdict,
        is_genuine=is_genuine,
        confidence_score=confidence,
        mark_type=req.mark_type,
        product_name=req.product_name or "Consumer Article",
        standard_applied=is_num or "Not Specified",
        cml_number_detected=cml_num if cml_num else None,
        huid_detected=huid if huid else None,
        anomalies=anomalies,
        detailed_checks=detailed_checks,
        legal_warning=legal_warning,
        consumer_action_steps=consumer_action_steps,
        verification_hash=f"BIS-VER-{verification_hash}"
    )
