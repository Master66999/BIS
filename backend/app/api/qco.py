from typing import List, Optional, Dict, Any
from datetime import datetime, date
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

router = APIRouter(prefix="/qco", tags=["Live QCO & Gazette Radar"])

# -------------------------------------------------------------
# Official Quality Control Orders (QCOs) Gazette Database
# -------------------------------------------------------------

QCO_ORDERS_DATABASE: List[Dict[str, Any]] = [
    {
        "id": "qco-footwear-2023",
        "title": "Footwear made from Leather and other materials (Quality Control) Order",
        "order_number": "S.O. 1284(E) / DPIIT",
        "ministry": "Ministry of Commerce and Industry (DPIIT)",
        "hsn_codes": ["6401", "6402", "6403", "6404", "6405"],
        "product_categories": "Footwear & Leather Goods",
        "standards": [
            {"code": "IS 15844 (Part 1):2020", "title": "Sports Footwear - General Requirements"},
            {"code": "IS 15844 (Part 2):2020", "title": "Performance Sports Footwear"},
            {"code": "IS 17043:2018", "title": "Derby Shoes - Specification"},
            {"code": "IS 15298 (Part 2):2016", "title": "Safety Footwear for Industrial Work"}
        ],
        "enforcement_date": "2024-01-01",
        "msme_grace_date": "2026-11-15",
        "status": "imminent",  # for Micro/Small units, transition ends soon
        "msme_provisions": "Micro enterprises (Turnover < ₹5 Cr) exempted until November 2026. Large and medium manufacturers already mandatory since Jan 2024.",
        "penalty_notice": "Section 29 of BIS Act, 2016: Seizure of uncertified inventory. Fine up to ₹5,00,000 or value of seized goods.",
        "gazette_url": "https://www.bis.gov.in/wp-content/uploads/2023/06/Footwear-QCO-2023.pdf",
        "description": "Makes mandatory ISI Mark compliance obligatory for all leather footwear, sports shoes, and canvas shoes manufactured in or imported into India."
    },
    {
        "id": "qco-steel-tmt-2024",
        "title": "Steel and Steel Products (Quality Control) Order, 2024",
        "order_number": "S.O. 2489(E) / Ministry of Steel",
        "ministry": "Ministry of Steel",
        "hsn_codes": ["7214", "7213", "7215", "7228"],
        "product_categories": "Steel, TMT Rebars & Structural Infrastructure",
        "standards": [
            {"code": "IS 1786:2008", "title": "High Strength Deformed Steel Bars (Fe 500, Fe 550D, Fe 600)"},
            {"code": "IS 2062:2011", "title": "Hot Rolled Medium and High Tensile Structural Steel"},
            {"code": "IS 2830:2012", "title": "Carbon Steel Cast Billet Ingots for Re-Rolling"}
        ],
        "enforcement_date": "2023-04-01",
        "msme_grace_date": "2023-04-01",
        "status": "enforced",
        "msme_provisions": "Strict zero-tolerance enforcement across all induction furnaces and rolling mills. No exemptions for secondary re-rollers.",
        "penalty_notice": "Mandatory criminal proceedings under Section 29 of BIS Act 2016. Automatic blacklisting from National Infrastructure Pipeline (NIP) tenders.",
        "gazette_url": "https://steel.gov.in/steel-qco-standards",
        "description": "Prohibits the production, stock, and sale of structural rebars without genuine ISI marking and CM/L verification."
    },
    {
        "id": "qco-toys-2020",
        "title": "Toys (Quality Control) Order, 2020",
        "order_number": "S.O. 858(E) / DPIIT",
        "ministry": "Ministry of Commerce and Industry (DPIIT)",
        "hsn_codes": ["9503", "9504"],
        "product_categories": "Children's Products & Toys",
        "standards": [
            {"code": "IS 9873 (Part 1):2019", "title": "Safety of Toys - Mechanical & Physical Properties"},
            {"code": "IS 9873 (Part 2):2017", "title": "Flammability Requirements of Toys"},
            {"code": "IS 9873 (Part 3):2020", "title": "Migration of Certain Toxic Elements (Heavy Metals)"},
            {"code": "IS 15644:2006", "title": "Safety of Electric Toys"}
        ],
        "enforcement_date": "2021-01-01",
        "msme_grace_date": "2021-01-01",
        "status": "enforced",
        "msme_provisions": "Special simplified grant of licence under Scheme I with 50% marking fee concession for Micro toy artisans.",
        "penalty_notice": "Customs confiscation at all Indian ports for uncertified toy imports. Domestic retail raids under Section 29.",
        "gazette_url": "https://dpiit.gov.in/sites/default/files/Toys_QCO_2020.pdf",
        "description": "Statutory regulation prohibiting unsafe toys with choking hazards or toxic lead paints for children below 14 years."
    },
    {
        "id": "qco-plywood-wood-2024",
        "title": "Plywood and Wooden Flush Door Shutters (Quality Control) Order",
        "order_number": "S.O. 3812(E) / DPIIT",
        "ministry": "Ministry of Commerce and Industry (DPIIT)",
        "hsn_codes": ["4412", "4418"],
        "product_categories": "Wood & Construction Panels",
        "standards": [
            {"code": "IS 303:1989", "title": "Plywood for General Purposes (MR and BWR Grades)"},
            {"code": "IS 710:2010", "title": "Marine Plywood - Specification"},
            {"code": "IS 2202 (Part 1):1999", "title": "Wooden Flush Door Shutters (Solid Core Type)"}
        ],
        "enforcement_date": "2024-02-28",
        "msme_grace_date": "2026-11-28",
        "status": "imminent",
        "msme_provisions": "Small enterprises have deadline until August 2026; Micro units have extended timeline until 28 November 2026.",
        "penalty_notice": "Uncertified plywood seizure. Suspension of forest depot transit passes for non-compliant factories.",
        "gazette_url": "https://dpiit.gov.in/plywood-qco",
        "description": "Mandates ISI Mark verification for boiling water resistant (BWR) and marine plywood to eliminate toxic urea-formaldehyde off-gassing."
    },
    {
        "id": "qco-solar-pv-inverters-2024",
        "title": "Solar Photovoltaics, Systems, Devices and Components Goods (Requirements for Compulsory Registration) Order",
        "order_number": "S.O. 3927(E) / MNRE",
        "ministry": "Ministry of New and Renewable Energy (MNRE)",
        "hsn_codes": ["8504", "8541"],
        "product_categories": "Solar Energy & Power Electronics",
        "standards": [
            {"code": "IS 16221 (Part 2):2015", "title": "Safety of Power Converters for use in Photovoltaic Power Systems"},
            {"code": "IS 14286:2010", "title": "Design Qualification & Type Approval for Crystalline Silicon PV Modules"},
            {"code": "IS/IEC 61683:1999", "title": "Photovoltaic Systems - Power Conditioners - Procedure for Measuring Efficiency"}
        ],
        "enforcement_date": "2024-06-30",
        "msme_grace_date": "2026-12-31",
        "status": "imminent",
        "msme_provisions": "Compulsory Registration Scheme (CRS - Scheme II). R-number registration required before dispatch.",
        "penalty_notice": "Disqualification from PM-KUSUM, PM Surya Ghar Muft Bijli Yojana, and customs detention of inverter shipments.",
        "gazette_url": "https://mnre.gov.in/solar-qco-guidelines",
        "description": "Enforces grid safety and anti-islanding protection for rooftop and utility-scale solar inverters."
    },
    {
        "id": "qco-electric-ceiling-fans-2023",
        "title": "Electrical Appliances for Domestic & Similar Purposes (Ceiling Fans) QCO",
        "order_number": "S.O. 3541(E) / DPIIT",
        "ministry": "Ministry of Commerce and Industry (DPIIT)",
        "hsn_codes": ["8414"],
        "product_categories": "Electrical Appliances",
        "standards": [
            {"code": "IS 374:2019", "title": "Electric Ceiling Type Fans and Regulators - Specification"},
            {"code": "IS 302 (Part 2/Sec 80):2017", "title": "Safety of Household and Similar Electrical Appliances - Fans"}
        ],
        "enforcement_date": "2023-09-01",
        "msme_grace_date": "2024-03-01",
        "status": "enforced",
        "msme_provisions": "Full nationwide enforcement. Mandatory 1-star to 5-star BEE star labelling alongside BIS ISI mark.",
        "penalty_notice": "Confiscation of non-compliant fans under Section 29 of BIS Act and Energy Conservation Act, 2001.",
        "gazette_url": "https://dpiit.gov.in/ceiling-fans-qco",
        "description": "Mandatory safety and star-rated energy efficiency for all ceiling fans sold in India."
    },
    {
        "id": "qco-bolts-nuts-fasteners-2024",
        "title": "Bolts, Nuts and Fasteners (Quality Control) Order, 2024",
        "order_number": "S.O. 4529(E) / DPIIT",
        "ministry": "Ministry of Commerce and Industry (DPIIT)",
        "hsn_codes": ["7318"],
        "product_categories": "Industrial Hardware & Fasteners",
        "standards": [
            {"code": "IS 1363 (Part 1):2019", "title": "Hexagon Head Bolts, Screws and Nuts of Product Grade C"},
            {"code": "IS 1367 (Part 3):2017", "title": "Technical Supply Conditions for Threaded Fasteners - Mechanical Properties"}
        ],
        "enforcement_date": "2024-07-21",
        "msme_grace_date": "2027-01-21",
        "status": "upcoming",
        "msme_provisions": "Micro enterprises have extended transition grace until January 2027 to setup hardness and tensile testing rigs.",
        "penalty_notice": "Automotive and defense tier-1 vendors prohibited from procuring uncertified fasteners.",
        "gazette_url": "https://dpiit.gov.in/fasteners-qco",
        "description": "Regulates mechanical tensile grades (4.6, 8.8, 10.9) to prevent catastrophic failures in infrastructure and machinery."
    }
]

# -------------------------------------------------------------
# Endpoints
# -------------------------------------------------------------

@router.get("/radar")
def search_qco_radar(
    query: Optional[str] = Query(None, description="Search by product name, HSN code, or standard code"),
    status: Optional[str] = Query(None, description="Filter by status: 'enforced', 'imminent', 'upcoming'"),
    ministry: Optional[str] = Query(None, description="Filter by notifying ministry"),
    category: Optional[str] = Query(None, description="Filter by product category")
):
    """
    Search and filter live Quality Control Orders (QCOs) with calculated countdowns to mandatory enforcement.
    """
    today = date.today()
    results = []

    for item in QCO_ORDERS_DATABASE:
        # Match query (product name, HSN, or standard)
        if query:
            q_lower = query.strip().lower()
            hsn_match = any(q_lower in hsn.lower() for hsn in item["hsn_codes"])
            title_match = q_lower in item["title"].lower() or q_lower in item["product_categories"].lower()
            std_match = any(q_lower in s["code"].lower() or q_lower in s["title"].lower() for s in item["standards"])
            if not (hsn_match or title_match or std_match):
                continue

        # Match status filter
        if status and status != "all" and item["status"].lower() != status.lower():
            continue

        # Match ministry filter
        if ministry and ministry != "all" and ministry.lower() not in item["ministry"].lower():
            continue

        # Match category filter
        if category and category != "all" and category.lower() not in item["product_categories"].lower():
            continue

        # Compute Days Remaining to Mandatory Enforcement
        target_date_str = item["msme_grace_date"] if item["status"] in ["imminent", "upcoming"] else item["enforcement_date"]
        target_date = datetime.strptime(target_date_str, "%Y-%m-%d").date()
        days_delta = (target_date - today).days

        countdown_display = ""
        is_past_deadline = days_delta <= 0

        if is_past_deadline or item["status"] == "enforced":
            countdown_display = "ENFORCED (0 Days Remaining)"
            urgency = "critical"
        elif days_delta <= 90:
            countdown_display = f"⚠️ Mandatory in {days_delta} Days ({target_date.strftime('%d %b %Y')})"
            urgency = "high"
        else:
            countdown_display = f"Effective in {days_delta} Days ({target_date.strftime('%d %b %Y')})"
            urgency = "medium"

        results.append({
            **item,
            "days_remaining": max(0, days_delta),
            "countdown_display": countdown_display,
            "urgency": urgency,
            "is_past_deadline": is_past_deadline
        })

    return {
        "total_qco_indexed": len(QCO_ORDERS_DATABASE),
        "matching_orders": len(results),
        "today_date": today.isoformat(),
        "orders": results
    }


@router.get("/hsn/{code}")
def get_qco_by_hsn(code: str):
    """Direct HSN code lookup to check if a customs classification requires mandatory BIS certification."""
    clean_code = code.strip().replace(".", "")
    matches = []
    
    for item in QCO_ORDERS_DATABASE:
        for hsn in item["hsn_codes"]:
            if clean_code.startswith(hsn) or hsn.startswith(clean_code):
                matches.append(item)
                break

    if not matches:
        return {
            "hsn_code": code,
            "mandatory_qco_found": False,
            "message": f"No mandatory Quality Control Order (QCO) currently active for HSN code {code}. Standard voluntary certification may still apply.",
            "orders": []
        }

    return {
        "hsn_code": code,
        "mandatory_qco_found": True,
        "matching_orders_count": len(matches),
        "orders": matches
    }
