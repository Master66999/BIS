from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from backend.app.core.database import get_db
from backend.app.models.models import Laboratory
from backend.app.schemas.schemas import LaboratoryOut

router = APIRouter(prefix="", tags=["BIS Services & Laboratories"])

BIS_SERVICES_DIRECTORY = [
    {
        "id": "standards-formulation",
        "title": "Indian Standards Formulation",
        "subtitle": "National Standards Body of India (BIS Act 2016)",
        "description": "BIS formulates Indian Standards across 15 technical divisions covering civil, chemical, mechanical, electrical, food, and emerging technologies like AI, IoT, and clean energy.",
        "icon": "BookOpen",
        "portal_url": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/",
        "key_features": [
            "Over 23,800+ active published Indian Standards",
            "Harmonization with ISO / IEC international standards",
            "Wide stakeholder consultation & draft standards portal",
            "Standards Clubs in schools and colleges across India"
        ],
        "faqs": [
            {
                "q": "How can I purchase an Indian Standard?",
                "a": "You can search and buy official PDF copies of Indian Standards directly from the official BIS Manakonline portal."
            },
            {
                "q": "Can I suggest revisions to an Indian Standard?",
                "a": "Yes, any stakeholder, industry member, or citizen can submit comments during the draft public review stage on the BIS portal."
            }
        ]
    },
    {
        "id": "isi-mark-certification",
        "title": "Product Certification (ISI Mark)",
        "subtitle": "Scheme I — Conformity Assessment Regulations, 2018",
        "description": "The iconic ISI Mark represents product safety, quality, and reliability. BIS grants licences to manufacturers based on conformity assessment, factory audit, and independent testing.",
        "icon": "ShieldCheck",
        "portal_url": "https://www.manakonline.in/MANAK/productCertification",
        "key_features": [
            "Conformity assessment under Scheme I",
            "Mandatory for products under Quality Control Orders (QCO)",
            "Simplified procedure for MSMEs with 30-day turnaround",
            "Continuous surveillance and unannounced market sampling"
        ],
        "faqs": [
            {
                "q": "Is ISI mark compulsory for all products?",
                "a": "It is compulsory for over 600 products notified under Quality Control Orders (QCOs) by Government of India, including Cement, Steel, Helmets, Toys, and Bottled Water."
            },
            {
                "q": "How long is a BIS licence valid?",
                "a": "A BIS licence is initially granted for 1 to 2 years and can be renewed for up to 5 years upon satisfactory performance."
            }
        ]
    },
    {
        "id": "crs-electronics",
        "title": "Compulsory Registration Scheme (CRS)",
        "subtitle": "Scheme II — Electronics & IT Products",
        "description": "Jointly administered with the Ministry of Electronics and Information Technology (MeitY) and MNRE to regulate electronics, IT goods, and solar components.",
        "icon": "Cpu",
        "portal_url": "https://www.crsbis.in/BIS/",
        "key_features": [
            "Self-Declaration of Conformity (R-number)",
            "Covers 64+ product categories including Laptops, Mobiles, and LEDs",
            "Testing exclusively conducted at BIS-recognized laboratories",
            "Paperless, fast-track digital registration on crsbis.in"
        ],
        "faqs": [
            {
                "q": "What is an R-number?",
                "a": "The R-number is a unique 8-digit registration code issued by BIS under CRS, which must be clearly embossed on the product alongside the standard mark."
            }
        ]
    },
    {
        "id": "fmcs-foreign",
        "title": "Foreign Manufacturers Certification Scheme (FMCS)",
        "subtitle": "Scheme IV — Certification of Overseas Units",
        "description": "Enables overseas manufacturers exporting goods to India to obtain the BIS Standard Mark (ISI mark) following factory audits and lab conformity.",
        "icon": "Globe",
        "portal_url": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/fmcs/",
        "key_features": [
            "Requires nomination of an Authorized Indian Representative (AIR)",
            "Factory inspection conducted by BIS technical auditors abroad",
            "Mandatory for foreign goods notified under Indian QCOs"
        ],
        "faqs": [
            {
                "q": "Who can be an Authorized Indian Representative (AIR)?",
                "a": "The AIR must be an Indian resident or an Indian registered entity representing the foreign manufacturer."
            }
        ]
    },
    {
        "id": "gold-hallmarking",
        "title": "Hallmarking of Gold & Silver",
        "subtitle": "6-digit HUID & Consumer Purity Guarantee",
        "description": "Hallmarking is mandatory in more than 343 districts across India, guaranteeing the exact purity of gold jewellery via laser-etched 6-digit Hallmark Unique Identification (HUID).",
        "icon": "Gem",
        "portal_url": "https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/hallmarking/",
        "key_features": [
            "Three mandatory laser marks: BIS Logo, Purity (e.g. 22K916), and HUID",
            "Permitted grades: 14K (585), 18K (750), 20K (833), 22K (916), 23K (958), 24K (999)",
            "Assaying & Hallmarking Centres (AHC) accredited by BIS",
            "Real-time verification of jeweller and purity on the BIS CARE App"
        ],
        "faqs": [
            {
                "q": "How can a consumer verify HUID?",
                "a": "Download the official 'BIS CARE' app, enter the 6-digit alphanumeric HUID printed on your jewellery, and immediately see the jeweller, AHC centre, and caratage."
            }
        ]
    },
    {
        "id": "laboratories-testing",
        "title": "Laboratory Network & LRS",
        "subtitle": "Central, Regional & Recognized Testing Labs",
        "description": "BIS maintains a nationwide network of high-tech testing laboratories and accredits private and public commercial labs under the Laboratory Recognition Scheme (LRS).",
        "icon": "FlaskConical",
        "portal_url": "https://www.bis.gov.in/index.php/laboratory-network/overview-of-laboratories/",
        "key_features": [
            "Central Laboratory (CL Sahibabad) & 4 Regional Laboratories",
            "Over 100+ BIS Recognized Laboratories across India",
            "Testing for physical, mechanical, chemical, and microbiological conformity",
            "Electronic test request and reporting via e-BIS"
        ],
        "faqs": [
            {
                "q": "How can a lab become BIS-recognized?",
                "a": "Laboratories with NABL accreditation under ISO/IEC 17025 can apply online under the Laboratory Recognition Scheme (LRS) on Manakonline."
            }
        ]
    },
    {
        "id": "consumer-affairs",
        "title": "Consumer Services & BIS CARE",
        "subtitle": "Consumer Protection & Grievance Redressal",
        "description": "Empowering Indian consumers to verify authenticity of ISI marks, CRS registrations, and Gold HUID, and file complaints against counterfeit goods.",
        "icon": "Smartphone",
        "portal_url": "https://www.bis.gov.in/index.php/consumer-affairs/consumer-overview/",
        "key_features": [
            "Official 'BIS CARE' app on Android & iOS",
            "Licence verification by CM/L, R-number, or HUID",
            "Direct complaint filing for sub-standard or fake ISI products",
            "Compensation and replacement enforcement under BIS Act 2016"
        ],
        "faqs": [
            {
                "q": "What happens if a complaint is lodged on BIS CARE?",
                "a": "BIS enforcement officers investigate the premises, seize counterfeit goods, and prosecute offenders under penal provisions of the BIS Act."
            }
        ]
    }
]

@router.get("/services")
def get_bis_services():
    return BIS_SERVICES_DIRECTORY

@router.get("/laboratories", response_model=List[LaboratoryOut])
def get_laboratories(
    search: Optional[str] = Query(None, description="Search lab name, city, or standard"),
    state: Optional[str] = Query(None, description="Filter by Indian State"),
    db: Session = Depends(get_db)
):
    query = db.query(Laboratory)
    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Laboratory.lab_name.ilike(s),
                Laboratory.city.ilike(s),
                Laboratory.accredited_scope.ilike(s),
                Laboratory.recognized_standards.ilike(s)
            )
        )
    if state and state != "All":
        query = query.filter(Laboratory.state == state)
        
    return query.all()
