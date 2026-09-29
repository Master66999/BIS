from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/journey", tags=["MSME Product Compliance Journey Generator"])

PRODUCT_DATABASE: Dict[str, Dict[str, Any]] = {
    "packaged-water": {
        "id": "packaged-water",
        "name": "Packaged Drinking Water (Other than Natural Mineral Water)",
        "category": "Food & Beverages",
        "standard_code": "IS 14543:2016",
        "standard_title": "Packaged Drinking Water - Specification (Second Revision)",
        "scheme": "Scheme I (Product Certification - ISI Mark)",
        "qco_mandatory": True,
        "qco_notification": "Ministry of Consumer Affairs Order (Mandatory ISI Mark since 2001)",
        "ministry": "Ministry of Consumer Affairs, Food & Public Distribution",
        "penalty_clause": "Section 29 of BIS Act 2016 (Fine up to ₹5,00,000 and/or 2 years imprisonment for non-certified bottling)",
        "testing_equipment": [
            {"name": "Laminar Air Flow Clean Bench (Class 100)", "purpose": "Aseptic microbiological sample plating", "estimated_cost": "₹1,20,000", "calibration": "Annual"},
            {"name": "Autoclave (Vertical High Pressure)", "purpose": "Sterilization of culture media and glassware", "estimated_cost": "₹45,000", "calibration": "6 Months"},
            {"name": "BOD / Bacteriological Incubator (37°C & 44°C)", "purpose": "Incubation for E. coli and coliform count", "estimated_cost": "₹65,000", "calibration": "Annual"},
            {"name": "Digital Turbidity Meter (Nephelometric)", "purpose": "Measurement of water clarity (Max 2 NTU)", "estimated_cost": "₹28,000", "calibration": "Quarterly"},
            {"name": "Digital pH Meter with Glass Electrode", "purpose": "Acidity / Alkalinity testing (6.5 to 8.5 range)", "estimated_cost": "₹15,000", "calibration": "Monthly buffer check"},
            {"name": "TDS Conductivity Meter", "purpose": "Total Dissolved Solids monitoring (75 - 500 mg/l)", "estimated_cost": "₹18,000", "calibration": "Quarterly"}
        ],
        "base_fees": {
            "application_fee": 1000,
            "processing_fee": 7000,
            "inspection_fee": 7000,
            "annual_licence_fee": 1000,
            "min_marking_fee": 160000,
            "sample_test_fee": 35000
        },
        "sample_size": "24 bottles of 1000ml in original retail packaging",
        "typical_timeline_days": {"simplified": 30, "normal": 85},
        "nearby_labs": [
            "Central Laboratory, BIS Sahibabad (Ghaziabad)",
            "Western Regional Office Laboratory (Mumbai)",
            "Southern Regional Laboratory (Chennai)",
            "National Test House (Kolkata / Alipore)"
        ]
    },
    "helmets": {
        "id": "helmets",
        "name": "Protective Helmets for Two-Wheeler Riders",
        "category": "Automotive Safety & Transport",
        "standard_code": "IS 4151:2015",
        "standard_title": "Protective Helmets for Two Wheeler Riders - Specification",
        "scheme": "Scheme I (Product Certification - ISI Mark)",
        "qco_mandatory": True,
        "qco_notification": "Ministry of Road Transport and Highways (MoRTH) QCO 2021",
        "ministry": "Ministry of Road Transport & Highways",
        "penalty_clause": "Motor Vehicles Act Section 129 + BIS Act Section 29 (Ban on sale of non-ISI helmets nationwide)",
        "testing_equipment": [
            {"name": "Guided Fall Impact Attenuation Drop Rig", "purpose": "Shock absorption test on flat & hemispherical anvils", "estimated_cost": "₹4,50,000", "calibration": "Annual (Accelerometer)"},
            {"name": "Retention System (Chinstrap) Dynamic Rig", "purpose": "Chinstrap displacement and dynamic elongation", "estimated_cost": "₹1,80,000", "calibration": "Annual"},
            {"name": "Visor Optical & Impact Test Apparatus", "purpose": "Luminous transmittance and high-speed projectile shatter test", "estimated_cost": "₹2,20,000", "calibration": "Annual"},
            {"name": "Conditioning Chambers (Hot +50°C, Cold -10°C, Water Spray)", "purpose": "Environmental pre-conditioning before impact testing", "estimated_cost": "₹3,10,000", "calibration": "Annual"}
        ],
        "base_fees": {
            "application_fee": 1000,
            "processing_fee": 7000,
            "inspection_fee": 7000,
            "annual_licence_fee": 1000,
            "min_marking_fee": 115000,
            "sample_test_fee": 28000
        },
        "sample_size": "12 complete helmet sets with visors across all manufactured shell sizes",
        "typical_timeline_days": {"simplified": 35, "normal": 90},
        "nearby_labs": [
            "Central Laboratory, BIS Sahibabad",
            "Automotive Research Association of India (ARAI, Pune)",
            "International Centre for Automotive Technology (ICAT, Manesar)",
            "CIRT (Central Institute of Road Transport, Pune)"
        ]
    },
    "tmt-steel": {
        "id": "tmt-steel",
        "name": "High Strength Deformed Steel Bars for Concrete (TMT Rebars)",
        "category": "Civil & Metallurgical Engineering",
        "standard_code": "IS 1786:2008",
        "standard_title": "High Strength Deformed Steel Bars and Wires for Concrete Reinforcement",
        "scheme": "Scheme I (Product Certification - ISI Mark)",
        "qco_mandatory": True,
        "qco_notification": "Steel and Steel Products (Quality Control) Order, Ministry of Steel",
        "ministry": "Ministry of Steel, Govt of India",
        "penalty_clause": "Complete seizure of uncertified rolling mill production lots; criminal prosecution under BIS Act 2016",
        "testing_equipment": [
            {"name": "Universal Testing Machine (UTM - 600 kN / 1000 kN)", "purpose": "Yield strength (0.2% proof stress), UTS, elongation", "estimated_cost": "₹8,50,000", "calibration": "Annual NABL verified"},
            {"name": "Mandrel Cold Bend & Rebend Testing Machine", "purpose": "180° cold bend and 135° reverse bend without surface cracking", "estimated_cost": "₹1,90,000", "calibration": "Visual & dimension"},
            {"name": "Optical Emission Spectrometer (OES)", "purpose": "Rapid chemical assay of C, S, P, Mn, Si in billet heats", "estimated_cost": "₹14,00,000", "calibration": "Certified CRM blocks monthly"}
        ],
        "base_fees": {
            "application_fee": 1000,
            "processing_fee": 7000,
            "inspection_fee": 14000,
            "annual_licence_fee": 1000,
            "min_marking_fee": 210000,
            "sample_test_fee": 42000
        },
        "sample_size": "4 test pieces of 1 meter length per heat for each diameter",
        "typical_timeline_days": {"simplified": 30, "normal": 75},
        "nearby_labs": [
            "National Test House (NTH Ghaziabad / Mumbai)",
            "CSIR - National Metallurgical Laboratory (Jamshedpur)",
            "Central Laboratory, BIS Sahibabad",
            "Regional Testing Centre (Bhilai / Durgapur)"
        ]
    },
    "toys": {
        "id": "toys",
        "name": "Children's Toys (Electric & Non-Electric)",
        "category": "Consumer Products & Child Safety",
        "standard_code": "IS 9873 (Part 1, 2, 3) & IS 15644",
        "standard_title": "Safety of Toys - Mechanical, Physical & Electrical Safety",
        "scheme": "Scheme I (Product Certification - ISI Mark)",
        "qco_mandatory": True,
        "qco_notification": "Toys (Quality Control) Order, 2020 by DPIIT",
        "ministry": "Ministry of Commerce and Industry (DPIIT)",
        "penalty_clause": "Ban on import, manufacture, distribution, and retail sale of uncertified toys under Section 29",
        "testing_equipment": [
            {"name": "Small Parts Cylinder & Sharp Edge / Sharp Point Tester", "purpose": "Choking and laceration hazard verification for children under 36 months", "estimated_cost": "₹75,000", "calibration": "Annual"},
            {"name": "Torque & Tension Test Fixtures", "purpose": "Integrity of seams, eyes, limbs under 90N pull force", "estimated_cost": "₹85,000", "calibration": "Annual"},
            {"name": "Impact Drop & Dynamic Impact Tester", "purpose": "Drop test onto steel plate from 850mm height", "estimated_cost": "₹1,10,000", "calibration": "Semi-Annual"},
            {"name": "Flammability Testing Apparatus", "purpose": "Surface flame spread rate of plush and textile fabrics", "estimated_cost": "₹1,40,000", "calibration": "Annual"}
        ],
        "base_fees": {
            "application_fee": 1000,
            "processing_fee": 7000,
            "inspection_fee": 7000,
            "annual_licence_fee": 1000,
            "min_marking_fee": 84000,
            "sample_test_fee": 22000
        },
        "sample_size": "6 representative toy samples in retail packaging with instruction manual",
        "typical_timeline_days": {"simplified": 30, "normal": 60},
        "nearby_labs": [
            "BIS Testing Lab (Sahibabad)",
            "Shriram Institute for Industrial Research (Delhi)",
            "Central Institute of Petrochemicals Engineering & Technology (CIPET)",
            "Intertek / TÜV SÜD BIS-recognized laboratories"
        ]
    },
    "solar-pv": {
        "id": "solar-pv",
        "name": "Solar Photovoltaic (PV) Crystalline Silicon Modules",
        "category": "Renewable & Clean Energy",
        "standard_code": "IS 14286:2010 / IEC 61215",
        "standard_title": "Design Qualification and Type Approval for Crystalline Silicon Terrestrial PV Modules",
        "scheme": "Scheme II (Compulsory Registration Scheme - CRS)",
        "qco_mandatory": True,
        "qco_notification": "Ministry of New and Renewable Energy (MNRE) Solar Photovoltaics Quality Control Order",
        "ministry": "Ministry of New and Renewable Energy (MNRE)",
        "penalty_clause": "Ineligibility for central/state solar subsidies, rooftop scheme disqualification, customs seizure",
        "testing_equipment": [
            {"name": "Electroluminescence (EL) Defect Camera", "purpose": "Micro-crack and finger interruption inspection in PV cells", "estimated_cost": "₹6,00,000", "calibration": "Annual"},
            {"name": "Class AAA Pulsed Sun Simulator", "purpose": "Peak power (Pmax) and I-V characteristic measurement at STC", "estimated_cost": "₹18,00,000", "calibration": "6 Months with reference cell"},
            {"name": "Wet Leakage & Insulation Resistance Tester", "purpose": "High-voltage dielectric withstand in wet immersion (3000V DC)", "estimated_cost": "₹2,50,000", "calibration": "Annual"}
        ],
        "base_fees": {
            "application_fee": 1000,
            "processing_fee": 20000,
            "inspection_fee": 0,  # CRS has no preliminary factory audit
            "annual_licence_fee": 2000,
            "min_marking_fee": 0,
            "sample_test_fee": 85000
        },
        "sample_size": "2 full-size solar panels with junction boxes and connectors",
        "typical_timeline_days": {"simplified": 25, "normal": 45},
        "nearby_labs": [
            "National Institute of Solar Energy (NISE, Gwalpahari, Gurugram)",
            "Solar Energy Corporation of India partner labs",
            "UL India Private Limited (Bengaluru)",
            "TÜV Rheinland Solar Lab (Bengaluru)"
        ]
    }
}

class JourneyRequest(BaseModel):
    product_id: str
    enterprise_type: str = "micro"  # micro, small, medium, large
    is_women_owned: bool = False
    procedure_type: str = "simplified"  # simplified (30 days) vs normal (80 days)

@router.get("/products")
def list_supported_products():
    """Returns curated list of high-priority BIS products for MSMEs."""
    summary = []
    for pid, data in PRODUCT_DATABASE.items():
        summary.append({
            "id": pid,
            "name": data["name"],
            "category": data["category"],
            "standard_code": data["standard_code"],
            "standard_title": data["standard_title"],
            "scheme": data["scheme"],
            "qco_mandatory": data["qco_mandatory"]
        })
    return {"products": summary}

@router.post("/generate")
def generate_compliance_journey(payload: JourneyRequest):
    """
    Generates a personalized, step-by-step regulatory roadmap with:
    1. Standard & QCO mandates
    2. Mandatory in-house testing equipment (STI)
    3. Discounted fee breakdown (50% micro, 20% small, women enterprise bonus)
    4. Timeline and milestone roadmap
    """
    prod = PRODUCT_DATABASE.get(payload.product_id)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found in compliance database")

    # 1. Calculate Subsidies
    ent = payload.enterprise_type.lower()
    discount_pct = 0
    subsidy_name = "Standard Corporate Fee"
    
    if ent == "micro":
        discount_pct = 50
        subsidy_name = "Government of India 50% Concession for Micro Enterprises (Udyam)"
    elif ent == "small":
        discount_pct = 20
        subsidy_name = "Government of India 20% Concession for Small Enterprises (Udyam)"
    
    women_bonus_pct = 5 if payload.is_women_owned else 0
    total_discount_pct = min(50, discount_pct + women_bonus_pct)

    base = prod["base_fees"]
    discount_multiplier = 1.0 - (total_discount_pct / 100.0)

    application_fee = base["application_fee"]
    processing_fee = round(base["processing_fee"] * discount_multiplier)
    inspection_fee = round(base["inspection_fee"] * discount_multiplier)
    annual_licence_fee = base["annual_licence_fee"]
    min_marking_fee = round(base["min_marking_fee"] * discount_multiplier)
    sample_test_fee = base["sample_test_fee"]

    total_first_year_cost = (
        application_fee + processing_fee + inspection_fee + annual_licence_fee + min_marking_fee + sample_test_fee
    )
    undiscounted_total = (
        base["application_fee"] + base["processing_fee"] + base["inspection_fee"] +
        base["annual_licence_fee"] + base["min_marking_fee"] + base["sample_test_fee"]
    )
    total_savings = undiscounted_total - total_first_year_cost

    # 2. Timeline
    est_days = prod["typical_timeline_days"].get(payload.procedure_type, 30)

    # 3. Step-by-Step Milestones
    milestones = [
        {
            "step": 1,
            "title": "Factory Self-Assessment & Standard Procurement",
            "duration": "Day 1 – 5",
            "desc": f"Purchase official PDF of {prod['standard_code']} from Manakonline. Benchmark existing manufacturing layout against BIS guidelines.",
            "status": "Ready to Start",
            "action": "Procure Standard"
        },
        {
            "step": 2,
            "title": "In-House Testing Facility Setup (STI Compliance)",
            "duration": "Day 6 – 15",
            "desc": f"Install mandatory testing equipment: {', '.join([e['name'] for e in prod['testing_equipment'][:2]])} with valid NABL calibration certificates.",
            "status": "Critical Gate",
            "action": "Calibrate Instruments"
        },
        {
            "step": 3,
            "title": "Sample Pre-Testing & Online Manakonline Application",
            "duration": "Day 16 – 22",
            "desc": f"Submit Form-V on Manakonline with Udyam Registration, test report of sample ({prod['sample_size']}), and pay ₹{application_fee + processing_fee:,}.",
            "status": "Application Submission",
            "action": "Submit Portal Dossier"
        },
        {
            "step": 4,
            "title": "BIS Officer Factory Audit & Verification",
            "duration": "Day 23 – 27",
            "desc": "BIS Nodal Officer conducts physical/virtual inspection of manufacturing process, quality control records, and draws counter-samples.",
            "status": "Auditor Scrutiny",
            "action": "Factory Verification"
        },
        {
            "step": 5,
            "title": "Grant of Licence & CM/L Number Issuance",
            "duration": f"Day {est_days}",
            "desc": f"Upon satisfactory verification, BIS issues official 7-digit CM/L Number. Permission granted to apply ISI Mark on retail packaging.",
            "status": "Final Certification",
            "action": "Start ISI Stamping"
        }
    ]

    return {
        "product": {
            "id": prod["id"],
            "name": prod["name"],
            "category": prod["category"],
            "standard_code": prod["standard_code"],
            "standard_title": prod["standard_title"],
            "scheme": prod["scheme"],
            "qco_mandatory": prod["qco_mandatory"],
            "qco_notification": prod["qco_notification"],
            "ministry": prod["ministry"],
            "penalty_clause": prod["penalty_clause"],
            "sample_size": prod["sample_size"],
            "testing_equipment": prod["testing_equipment"],
            "nearby_labs": prod["nearby_labs"]
        },
        "enterprise_context": {
            "enterprise_type": payload.enterprise_type.capitalize(),
            "is_women_owned": payload.is_women_owned,
            "procedure_type": "Simplified Procedure (30 Days)" if payload.procedure_type == "simplified" else "Normal Procedure (85 Days)",
            "subsidy_applied": subsidy_name,
            "discount_percentage": total_discount_pct,
            "total_savings_inr": total_savings
        },
        "fee_breakdown": {
            "application_fee": application_fee,
            "processing_fee": processing_fee,
            "inspection_fee": inspection_fee,
            "annual_licence_fee": annual_licence_fee,
            "min_marking_fee": min_marking_fee,
            "sample_test_fee": sample_test_fee,
            "total_first_year_inr": total_first_year_cost,
            "undiscounted_total_inr": undiscounted_total
        },
        "timeline": {
            "total_estimated_days": est_days,
            "milestones": milestones
        }
    }
