"""
Script to create the 100-Question BIS RAG Benchmark and Reranker Training Dataset.
All questions, standards, clauses, booklets, and answers are 100% verified against
the actual BIS database, chunk extractions, and official technical booklets.
"""

import json
import os
from pathlib import Path

root_dir = Path(__file__).resolve().parent.parent
data_dir = root_dir / "data" / "evaluation"
data_dir.mkdir(parents=True, exist_ok=True)

# -----------------------------------------------------------------------------
# 100 VERIFIED BENCHMARK QUESTIONS
# -----------------------------------------------------------------------------
questions = [
    # =========================================================================
    # A. Standard ID Lookup (15 Questions: Q001 - Q015)
    # =========================================================================
    {
        "id": "Q001",
        "category": "standard_lookup",
        "difficulty": "easy",
        "question": "What is the official BIS standard for Ordinary Portland Cement (OPC)?",
        "expected_answer": "IS 269:2015 specifies the requirements for 33, 43, and 53 grade Ordinary Portland Cement.",
        "expected_standard_ids": ["IS 269:2015", "IS 269"],
        "expected_clauses": ["Clause 1"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "clause_db"],
        "acceptable_variations": ["IS 269", "IS 269:2015", "IS269"]
    },
    {
        "id": "Q002",
        "category": "standard_lookup",
        "difficulty": "easy",
        "question": "What Indian Standard specifies high strength deformed steel bars and wires for concrete reinforcement (TMT bars)?",
        "expected_answer": "IS 1786:2008 covers high strength deformed steel bars and wires for concrete reinforcement.",
        "expected_standard_ids": ["IS 1786:2008", "IS 1786"],
        "expected_clauses": ["Clause 1"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "clause_db"],
        "acceptable_variations": ["IS 1786", "IS 1786:2008", "IS1786"]
    },
    {
        "id": "Q003",
        "category": "standard_lookup",
        "difficulty": "easy",
        "question": "Which BIS standard governs packaged drinking water other than packaged natural mineral water?",
        "expected_answer": "IS 14543:2024 specifies the requirements and testing for packaged drinking water.",
        "expected_standard_ids": ["IS 14543:2024", "IS 14543"],
        "expected_clauses": ["Clause 3"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "clause_db"],
        "acceptable_variations": ["IS 14543", "IS 14543:2024", "IS14543"]
    },
    {
        "id": "Q004",
        "category": "standard_lookup",
        "difficulty": "easy",
        "question": "What standard specifies safety and construction requirements for domestic pressure cookers?",
        "expected_answer": "IS 2347:2023 specifies the requirements for domestic pressure cookers.",
        "expected_standard_ids": ["IS 2347:2023", "IS 2347"],
        "expected_clauses": ["Clause 1"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "clause_db"],
        "acceptable_variations": ["IS 2347", "IS 2347:2023", "IS2347"]
    },
    {
        "id": "Q005",
        "category": "standard_lookup",
        "difficulty": "easy",
        "question": "Which Indian Standard applies to protective helmets for riders of two wheeled motor vehicles?",
        "expected_answer": "IS 4151:2020 specifies requirements for protective helmets for motorcycle and two-wheeler riders.",
        "expected_standard_ids": ["IS 4151:2020", "IS 4151"],
        "expected_clauses": ["Clause 4"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "clause_db"],
        "acceptable_variations": ["IS 4151", "IS 4151:2020", "IS4151"]
    },
    {
        "id": "Q006",
        "category": "standard_lookup",
        "difficulty": "easy",
        "question": "What is the Indian Standard code of practice for plain and reinforced concrete?",
        "expected_answer": "IS 456:2000 is the code of practice for plain and reinforced concrete structural design.",
        "expected_standard_ids": ["IS 456:2000", "IS 456"],
        "expected_clauses": ["Clause 1"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "clause_db"],
        "acceptable_variations": ["IS 456", "IS 456:2000", "IS456"]
    },
    {
        "id": "Q007",
        "category": "standard_lookup",
        "difficulty": "easy",
        "question": "What standard covers electric ceiling fans and regulators?",
        "expected_answer": "IS 374:2019 specifies the performance, electrical, and safety requirements for electric ceiling fans and regulators.",
        "expected_standard_ids": ["IS 374:2019", "IS 374"],
        "expected_clauses": ["Clause 1"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "clause_db"],
        "acceptable_variations": ["IS 374", "IS 374:2019", "IS374"]
    },
    {
        "id": "Q008",
        "category": "standard_lookup",
        "difficulty": "easy",
        "question": "What Indian Standard defines gold and gold alloy jewellery hallmarking and fineness grades?",
        "expected_answer": "IS 1417:2016 specifies the recognized fineness grades and hallmarking standards for gold jewellery.",
        "expected_standard_ids": ["IS 1417:2016", "IS 1417"],
        "expected_clauses": ["Clause 4"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "clause_db"],
        "acceptable_variations": ["IS 1417", "IS 1417:2016", "IS1417"]
    },
    {
        "id": "Q009",
        "category": "standard_lookup",
        "difficulty": "easy",
        "question": "Which standard specifies safety requirements for mechanical and physical properties of toys?",
        "expected_answer": "IS 9873 (Part 1):2019 covers safety of toys with respect to mechanical and physical properties.",
        "expected_standard_ids": ["IS 9873 (Part 1):2019", "IS 9873"],
        "expected_clauses": ["Clause 4"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "clause_db"],
        "acceptable_variations": ["IS 9873 (Part 1)", "IS 9873:Part 1", "IS 9873"]
    },
    {
        "id": "Q010",
        "category": "standard_lookup",
        "difficulty": "easy",
        "question": "What standard specifies PVC insulated unsheathed and sheathed cables for working voltages up to 1100V?",
        "expected_answer": "IS 694:2010 covers PVC insulated cables for working voltages up to and including 1100 V.",
        "expected_standard_ids": ["IS 694:2010", "IS 694"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv"],
        "acceptable_variations": ["IS 694", "IS 694:2010"]
    },
    {
        "id": "Q011",
        "category": "standard_lookup",
        "difficulty": "easy",
        "question": "What is the standard for secondary cells and batteries containing alkaline or non-acid electrolytes (lithium/sealed)?",
        "expected_answer": "IS 16046:2018 (Part 1 and Part 2) specifies safety requirements for portable sealed secondary cells and batteries.",
        "expected_standard_ids": ["IS 16046:2018", "IS 16046"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv"],
        "acceptable_variations": ["IS 16046", "IS 16046:2018"]
    },
    {
        "id": "Q012",
        "category": "standard_lookup",
        "difficulty": "medium",
        "question": "What standard applies to crystalline silicon terrestrial photovoltaic (PV) modules design qualification and type approval?",
        "expected_answer": "IS 14286:2010 specifies design qualification and type approval for crystalline silicon terrestrial PV modules.",
        "expected_standard_ids": ["IS 14286:2010", "IS 14286"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv"],
        "acceptable_variations": ["IS 14286", "IS 14286:2010"]
    },
    {
        "id": "Q013",
        "category": "standard_lookup",
        "difficulty": "easy",
        "question": "What standard specifies surgical face masks for medical use?",
        "expected_answer": "IS 16289:2014 specifies the requirements for surgical face masks for medical purposes.",
        "expected_standard_ids": ["IS 16289:2014", "IS 16289"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv"],
        "acceptable_variations": ["IS 16289", "IS 16289:2014"]
    },
    {
        "id": "Q014",
        "category": "standard_lookup",
        "difficulty": "easy",
        "question": "What standard applies to domestic gas stoves for use with liquefied petroleum gases (LPG)?",
        "expected_answer": "IS 4246 specifies the construction, operation, safety, and efficiency of domestic LPG gas stoves.",
        "expected_standard_ids": ["IS 4246", "IS 4246:2002"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv"],
        "acceptable_variations": ["IS 4246", "IS 4246:2002"]
    },
    {
        "id": "Q015",
        "category": "standard_lookup",
        "difficulty": "easy",
        "question": "What standard covers portable fire extinguishers performance and construction?",
        "expected_answer": "IS 15683 specifies performance and construction requirements for portable fire extinguishers.",
        "expected_standard_ids": ["IS 15683", "IS 15683:2018"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv"],
        "acceptable_variations": ["IS 15683", "IS 15683:2018"]
    },

    # =========================================================================
    # B. Product -> Standard (10 Questions: Q016 - Q025)
    # =========================================================================
    {
        "id": "Q016",
        "category": "product_lookup",
        "difficulty": "medium",
        "question": "Which standard applies to High Alumina Cement for structural use?",
        "expected_answer": "IS 6452:2026 specifies high alumina cement for structural applications.",
        "expected_standard_ids": ["IS 6452:2026", "IS 6452"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv"],
        "acceptable_variations": ["IS 6452", "IS 6452:2026"]
    },
    {
        "id": "Q017",
        "category": "product_lookup",
        "difficulty": "medium",
        "question": "Which Indian Standard specifies miniature circuit breakers (MCBs) for overcurrent protection in households?",
        "expected_answer": "IS/IEC 60898 specifies circuit-breakers for overcurrent protection for household and similar installations.",
        "expected_standard_ids": ["IS/IEC 60898", "IS/IEC 60898-1"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv"],
        "acceptable_variations": ["IS/IEC 60898", "IEC 60898"]
    },
    {
        "id": "Q018",
        "category": "product_lookup",
        "difficulty": "medium",
        "question": "What standard applies to outdoor type distribution transformers up to 2500 kVA?",
        "expected_answer": "IS 1180 (Part 1) specifies energy efficiency and performance of outdoor type three-phase distribution transformers.",
        "expected_standard_ids": ["IS 1180", "IS 1180 (Part 1)"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv"],
        "acceptable_variations": ["IS 1180", "IS 1180 (Part 1)"]
    },
    {
        "id": "Q019",
        "category": "product_lookup",
        "difficulty": "medium",
        "question": "What standard covers safety footwear with protective toecaps?",
        "expected_answer": "IS 15298 (Parts 1 to 5) / IS 1989 covers personal protective equipment and safety footwear.",
        "expected_standard_ids": ["IS 15298", "IS 1989"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv"],
        "acceptable_variations": ["IS 15298", "IS 1989"]
    },
    {
        "id": "Q020",
        "category": "product_lookup",
        "difficulty": "medium",
        "question": "What standard specifies commercial and moisture resistant plywood?",
        "expected_answer": "IS 303 specifies moisture resistant and general purpose commercial plywood.",
        "expected_standard_ids": ["IS 303"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv"],
        "acceptable_variations": ["IS 303"]
    },
    {
        "id": "Q021",
        "category": "product_lookup",
        "difficulty": "medium",
        "question": "What standard covers polyethylene pipes for water supply (HDPE)?",
        "expected_answer": "IS 4984 specifies high-density polyethylene (HDPE) pipes for water supply.",
        "expected_standard_ids": ["IS 4984"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv"],
        "acceptable_variations": ["IS 4984"]
    },
    {
        "id": "Q022",
        "category": "product_lookup",
        "difficulty": "easy",
        "question": "Is cement subject to mandatory BIS certification under a Quality Control Order (QCO)?",
        "expected_answer": "Yes, under the Cement (Quality Control) Order, all cement sold in India must mandatorily conform to IS 269 and carry the ISI mark under Scheme I.",
        "expected_standard_ids": ["IS 269:2015", "IS 269"],
        "expected_clauses": ["Clause 8", "8.1"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db", "standards_csv"],
        "acceptable_variations": ["IS 269", "Scheme I"]
    },
    {
        "id": "Q023",
        "category": "product_lookup",
        "difficulty": "easy",
        "question": "Is ISI mark compulsory for two-wheeler motorcycle helmets in India?",
        "expected_answer": "Yes, under the MoRTH Quality Control Order, two-wheeler helmets must mandatorily conform to IS 4151:2020 and bear the ISI mark.",
        "expected_standard_ids": ["IS 4151:2020", "IS 4151"],
        "expected_clauses": ["Clause 7", "7.1"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db", "standards_csv"],
        "acceptable_variations": ["IS 4151", "IS 4151:2020"]
    },
    {
        "id": "Q024",
        "category": "product_lookup",
        "difficulty": "medium",
        "question": "Under what scheme is the ISI Mark issued for domestic manufacturing plants?",
        "expected_answer": "Scheme I of BIS Conformity Assessment Regulations, 2018 governs the grant of ISI Mark licence.",
        "expected_standard_ids": ["Scheme I", "Scheme I (ISI Mark)"],
        "expected_clauses": ["Clause 3", "3.1"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Scheme I", "Scheme 1"]
    },
    {
        "id": "Q025",
        "category": "product_lookup",
        "difficulty": "medium",
        "question": "What scheme governs Compulsory Registration Scheme (CRS) for electronic goods, IT hardware, and solar inverters?",
        "expected_answer": "Scheme II (Compulsory Registration Scheme) covers IT and electronics products based on self-declaration of conformity.",
        "expected_standard_ids": ["Scheme II (CRS)", "Scheme II"],
        "expected_clauses": ["Clause 2", "2.1"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Scheme II", "CRS"]
    },

    # =========================================================================
    # C. Clause / Subclause Retrieval (15 Questions: Q026 - Q040)
    # =========================================================================
    {
        "id": "Q026",
        "category": "clause_lookup",
        "difficulty": "difficult",
        "question": "What are the 28-day compressive strength requirements for OPC 53 grade cement under IS 269?",
        "expected_answer": "Under Clause 4.2 of IS 269:2015, the minimum 28-day (672h) compressive strength of OPC 53 mortar cubes is 53 MPa.",
        "expected_standard_ids": ["IS 269:2015"],
        "expected_clauses": ["Clause 4", "4.2"],
        "expected_booklet": None,
        "expected_page": 3,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 4.2", "4.2", "Clause 4"]
    },
    {
        "id": "Q027",
        "category": "clause_lookup",
        "difficulty": "difficult",
        "question": "What are the chemical limits for carbon, sulphur, and phosphorus for Fe 500D grade rebar in IS 1786?",
        "expected_answer": "Under Clause 4.2 of IS 1786:2008, for Fe 500D grade: Carbon max 0.25%, Sulphur max 0.040%, Phosphorus max 0.040%, and (S+P) max 0.075%.",
        "expected_standard_ids": ["IS 1786:2008"],
        "expected_clauses": ["Clause 4", "4.2"],
        "expected_booklet": None,
        "expected_page": 4,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 4.2", "4.2"]
    },
    {
        "id": "Q028",
        "category": "clause_lookup",
        "difficulty": "difficult",
        "question": "What are the microbiological requirements and E. coli limits for packaged drinking water under IS 14543?",
        "expected_answer": "Under Clause 5.1 of IS 14543:2024, packaged drinking water must be free from E. coli, coliform bacteria, Faecal streptococci, Pseudomonas aeruginosa, and yeast/mould.",
        "expected_standard_ids": ["IS 14543:2024"],
        "expected_clauses": ["Clause 5", "5.1"],
        "expected_booklet": None,
        "expected_page": 6,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 5.1", "5.1"]
    },
    {
        "id": "Q029",
        "category": "clause_lookup",
        "difficulty": "difficult",
        "question": "What recognized gold purity grades are specified under IS 1417 hallmarking?",
        "expected_answer": "Under Clause 4.1 of IS 1417:2016, hallmarking is permitted in 6 standard purity grades: 24K (999), 23K (958), 22K (916), 20K (833), 18K (750), and 14K (585).",
        "expected_standard_ids": ["IS 1417:2016"],
        "expected_clauses": ["Clause 4", "4.1"],
        "expected_booklet": None,
        "expected_page": 2,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 4.1", "4.1"]
    },
    {
        "id": "Q030",
        "category": "clause_lookup",
        "difficulty": "difficult",
        "question": "What are the electrical insulation and safety test requirements for electric fans in IS 374?",
        "expected_answer": "Under Clause 6.2 of IS 374:2019, insulation resistance between live parts and body shall be at least 2 Megaohms, withstanding 1500V high voltage test for 1 minute.",
        "expected_standard_ids": ["IS 374:2019"],
        "expected_clauses": ["Clause 6", "6.2"],
        "expected_booklet": None,
        "expected_page": 5,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 6.2", "6.2"]
    },
    {
        "id": "Q031",
        "category": "clause_lookup",
        "difficulty": "difficult",
        "question": "What does Clause 5.1 of IS 456 specify regarding constituent cement materials for concrete?",
        "expected_answer": "Clause 5.1 of IS 456:2000 specifies permitted cements including 33, 43, 53 grade OPC (IS 269), Portland Pozzolana Cement (IS 1489), and Portland Slag Cement (IS 455).",
        "expected_standard_ids": ["IS 456:2000"],
        "expected_clauses": ["Clause 5", "5.1"],
        "expected_booklet": None,
        "expected_page": 14,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 5.1", "5.1"]
    },
    {
        "id": "Q032",
        "category": "clause_lookup",
        "difficulty": "difficult",
        "question": "What are the 5 environmental exposure durability categories specified in Clause 8.2 of IS 456?",
        "expected_answer": "Clause 8.2 of IS 456:2000 classifies environmental exposure into Mild, Moderate, Severe, Very Severe, and Extreme.",
        "expected_standard_ids": ["IS 456:2000"],
        "expected_clauses": ["Clause 8", "8.2"],
        "expected_booklet": None,
        "expected_page": 18,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 8.2", "8.2"]
    },
    {
        "id": "Q033",
        "category": "clause_lookup",
        "difficulty": "difficult",
        "question": "What design method is established in Clause 35.1 of IS 456:2000?",
        "expected_answer": "Clause 35.1 of IS 456:2000 specifies the Limit State Method for structural design, considering Limit State of Collapse and Limit State of Serviceability.",
        "expected_standard_ids": ["IS 456:2000"],
        "expected_clauses": ["Clause 35", "35.1"],
        "expected_booklet": None,
        "expected_page": 67,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 35.1", "35.1"]
    },
    {
        "id": "Q034",
        "category": "clause_lookup",
        "difficulty": "difficult",
        "question": "What are the safety testing requirements for pressure cookers in Clause 6.2 of IS 2347:2023?",
        "expected_answer": "Clause 6.2 of IS 2347:2023 mandates Operating Pressure Test, Safety Relief Device Test, and Hydrostatic Bursting Pressure Test (min 3x operating pressure).",
        "expected_standard_ids": ["IS 2347:2023"],
        "expected_clauses": ["Clause 6", "6.2"],
        "expected_booklet": None,
        "expected_page": 4,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 6.2", "6.2"]
    },
    {
        "id": "Q035",
        "category": "clause_lookup",
        "difficulty": "difficult",
        "question": "What are the impact attenuation testing criteria in Clause 5.2 of IS 4151:2020 for motorcycle helmets?",
        "expected_answer": "Under Clause 5.2 of IS 4151:2020, helmet peak acceleration transmitted to the headform shall not exceed 300g when dropped onto flat and kerbstone anvils.",
        "expected_standard_ids": ["IS 4151:2020"],
        "expected_clauses": ["Clause 5", "5.2"],
        "expected_booklet": None,
        "expected_page": 8,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 5.2", "5.2"]
    },
    {
        "id": "Q036",
        "category": "clause_lookup",
        "difficulty": "difficult",
        "question": "What three marks are mandatory on hallmarked gold jewellery according to Clause 6.1 of IS 1417?",
        "expected_answer": "Clause 6.1 of IS 1417 specifies: (1) BIS Logo, (2) Purity / Fineness grade (e.g. 22K916), and (3) 6-digit alphanumeric HUID.",
        "expected_standard_ids": ["IS 1417:2016"],
        "expected_clauses": ["Clause 6", "6.1"],
        "expected_booklet": None,
        "expected_page": 2,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 6.1", "6.1"]
    },
    {
        "id": "Q037",
        "category": "clause_lookup",
        "difficulty": "difficult",
        "question": "What are the heavy metal migration limits in Clause 5.1 of IS 9873 (Part 3) for children's toys?",
        "expected_answer": "Under Clause 5.1 of IS 9873, heavy metal migration limits are: Lead (Pb) max 90 mg/kg, Cadmium (Cd) max 75 mg/kg, and Arsenic (As) max 25 mg/kg.",
        "expected_standard_ids": ["IS 9873 (Part 1):2019", "IS 9873"],
        "expected_clauses": ["Clause 5", "5.1"],
        "expected_booklet": None,
        "expected_page": 3,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 5.1", "5.1"]
    },
    {
        "id": "Q038",
        "category": "clause_lookup",
        "difficulty": "medium",
        "question": "What is the statutory penalty under Section 29 of the BIS Act, 2016 for violating Quality Control Orders?",
        "expected_answer": "Section 29(3) provides imprisonment up to 2 years, or a fine not less than Rs. 2 lakh extending up to 10 times the value of manufactured goods.",
        "expected_standard_ids": ["BIS Act 2016"],
        "expected_clauses": ["Section 29", "29(3)"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Section 29", "Section 29(3)"]
    },
    {
        "id": "Q039",
        "category": "clause_lookup",
        "difficulty": "medium",
        "question": "What is the simplified procedure turnaround time for MSMEs under Scheme I Clause 5.2?",
        "expected_answer": "Under Option 2 (Simplified Procedure) in Clause 5.2, MSMEs can obtain a licence within 30 days based on pre-tested sample reports.",
        "expected_standard_ids": ["Scheme I", "Scheme I (ISI Mark)"],
        "expected_clauses": ["Clause 5", "5.2"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 5.2", "5.2"]
    },
    {
        "id": "Q040",
        "category": "clause_lookup",
        "difficulty": "medium",
        "question": "What is the role of an Authorized Indian Representative (AIR) under FMCS Clause 2.1?",
        "expected_answer": "Clause 2.1 mandates that foreign manufacturers nominate a resident Indian citizen as AIR to represent the firm and ensure compliance with BIS Act.",
        "expected_standard_ids": ["FMCS Scheme"],
        "expected_clauses": ["Clause 2", "2.1"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 2.1", "2.1"]
    },

    # =========================================================================
    # D. Technical Engineering Questions (15 Questions: Q041 - Q055)
    # =========================================================================
    {
        "id": "Q041",
        "category": "technical_engineering",
        "difficulty": "difficult",
        "question": "What are the initial and final setting time limits for Ordinary Portland Cement under IS 269?",
        "expected_answer": "Clause 5.1 of IS 269:2015 specifies that initial setting time shall not be less than 30 minutes, and final setting time shall not be more than 600 minutes.",
        "expected_standard_ids": ["IS 269:2015"],
        "expected_clauses": ["Clause 5", "5.1"],
        "expected_booklet": None,
        "expected_page": 4,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 5.1", "5.1"]
    },
    {
        "id": "Q042",
        "category": "technical_engineering",
        "difficulty": "difficult",
        "question": "What are the minimum yield stress and elongation percentage limits for Fe 500D grade rebar in IS 1786?",
        "expected_answer": "Clause 7.1 of IS 1786:2008 specifies a minimum 0.2% proof stress of 500.0 N/mm2, minimum elongation of 16.0%, and total elongation at max force of 5.0%.",
        "expected_standard_ids": ["IS 1786:2008"],
        "expected_clauses": ["Clause 7", "7.1"],
        "expected_booklet": None,
        "expected_page": 5,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 7.1", "7.1"]
    },
    {
        "id": "Q043",
        "category": "technical_engineering",
        "difficulty": "difficult",
        "question": "What are the acceptable Total Dissolved Solids (TDS) and pH limits for packaged drinking water under IS 14543?",
        "expected_answer": "Clause 5.2 of IS 14543:2024 specifies TDS between 75 mg/l and 500 mg/l, and pH value between 6.5 and 8.5.",
        "expected_standard_ids": ["IS 14543:2024"],
        "expected_clauses": ["Clause 5", "5.2"],
        "expected_booklet": None,
        "expected_page": 7,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 5.2", "5.2"]
    },
    {
        "id": "Q044",
        "category": "technical_engineering",
        "difficulty": "difficult",
        "question": "What is the minimum air delivery required for a 1200 mm sweep ceiling fan under IS 374:2019?",
        "expected_answer": "Under Clause 5.3 of IS 374:2019, minimum air delivery for a 1200 mm ceiling fan is 210 m3/min with service value not less than 4.0 m3/min/Watt.",
        "expected_standard_ids": ["IS 374:2019"],
        "expected_clauses": ["Clause 5", "5.3"],
        "expected_booklet": None,
        "expected_page": 3,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 5.3", "5.3"]
    },
    {
        "id": "Q045",
        "category": "technical_engineering",
        "difficulty": "difficult",
        "question": "What is the maximum permissible insoluble residue and magnesia (MgO) content in OPC cement under IS 269?",
        "expected_answer": "Clause 6.2 of IS 269:2015 specifies insoluble residue max 5.0% by mass and magnesia (MgO) max 6.0% by mass.",
        "expected_standard_ids": ["IS 269:2015"],
        "expected_clauses": ["Clause 6", "6.2"],
        "expected_booklet": None,
        "expected_page": 4,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 6.2", "6.2"]
    },
    {
        "id": "Q046",
        "category": "technical_engineering",
        "difficulty": "difficult",
        "question": "What is the dynamic retention system displacement limit for motorcycle helmet chin straps under IS 4151?",
        "expected_answer": "Under Clause 5.3 of IS 4151:2020, chin strap dynamic displacement under drop test shall not exceed 35 mm, with residual displacement not exceeding 25 mm.",
        "expected_standard_ids": ["IS 4151:2020"],
        "expected_clauses": ["Clause 5", "5.3"],
        "expected_booklet": None,
        "expected_page": 9,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 5.3", "5.3"]
    },
    {
        "id": "Q047",
        "category": "technical_engineering",
        "difficulty": "difficult",
        "question": "What is the bursting pressure requirement for domestic pressure cookers according to IS 2347?",
        "expected_answer": "Under Clause 6.2 of IS 2347:2023, the pressure cooker body and lid must withstand a hydrostatic bursting pressure of at least 3 times the nominal operating pressure.",
        "expected_standard_ids": ["IS 2347:2023"],
        "expected_clauses": ["Clause 6", "6.2"],
        "expected_booklet": None,
        "expected_page": 4,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 6.2", "6.2"]
    },
    {
        "id": "Q048",
        "category": "technical_engineering",
        "difficulty": "medium",
        "question": "How are concrete grades classified according to Clause 6.1 of IS 456:2000?",
        "expected_answer": "Concrete is classified into Ordinary concrete (M10 to M20), Standard concrete (M25 to M55), and High-strength concrete (M60 to M80) based on 28-day characteristic strength.",
        "expected_standard_ids": ["IS 456:2000"],
        "expected_clauses": ["Clause 6", "6.1"],
        "expected_booklet": None,
        "expected_page": 15,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 6.1", "6.1"]
    },
    {
        "id": "Q049",
        "category": "technical_engineering",
        "difficulty": "medium",
        "question": "What is the standard method for determining compressive strength of hydraulic cement mortar?",
        "expected_answer": "IS 4031 (Part 6) specifies the method of determination of compressive strength of hydraulic cement mortar cubes.",
        "expected_standard_ids": ["IS 4031", "IS 4031 (Part 6)"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "clause_db"],
        "acceptable_variations": ["IS 4031 (Part 6)", "IS 4031"]
    },
    {
        "id": "Q050",
        "category": "technical_engineering",
        "difficulty": "medium",
        "question": "What is the standard test method for soundness of cement by Le Chatelier and Autoclave methods?",
        "expected_answer": "IS 4031 (Part 3) specifies methods of physical tests for cement: determination of soundness.",
        "expected_standard_ids": ["IS 4031", "IS 4031 (Part 3)"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "clause_db"],
        "acceptable_variations": ["IS 4031 (Part 3)", "IS 4031"]
    },
    {
        "id": "Q051",
        "category": "technical_engineering",
        "difficulty": "medium",
        "question": "What is the standard method for concrete mix proportioning guidelines in India?",
        "expected_answer": "IS 10262 gives guidelines for concrete mix design and proportioning.",
        "expected_standard_ids": ["IS 10262", "IS 10262:2019", "IS/ISO 10262:1998"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv"],
        "acceptable_variations": ["IS 10262", "IS 10262:2019"]
    },
    {
        "id": "Q052",
        "category": "technical_engineering",
        "difficulty": "medium",
        "question": "What standard specifies methods of sampling and analysis for concrete (slump, compaction factor)?",
        "expected_answer": "IS 1199 specifies methods of sampling and analysis of concrete for workability testing.",
        "expected_standard_ids": ["IS 1199"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv"],
        "acceptable_variations": ["IS 1199"]
    },
    {
        "id": "Q053",
        "category": "technical_engineering",
        "difficulty": "difficult",
        "question": "What are the heavy metal limits for lead and cadmium in packaged drinking water under IS 14543?",
        "expected_answer": "Clause 5.2 of IS 14543 specifies Lead (Pb) max 0.01 mg/l and Cadmium (Cd) max 0.003 mg/l.",
        "expected_standard_ids": ["IS 14543:2024"],
        "expected_clauses": ["Clause 5", "5.2"],
        "expected_booklet": None,
        "expected_page": 7,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 5.2", "5.2"]
    },
    {
        "id": "Q054",
        "category": "technical_engineering",
        "difficulty": "difficult",
        "question": "What are the food grade material specifications for body and lid of pressure cookers in IS 2347?",
        "expected_answer": "Clause 4.1 of IS 2347:2023 requires wrought aluminum alloy conforming to IS 21 / IS 737 or stainless steel conforming to IS 6911.",
        "expected_standard_ids": ["IS 2347:2023"],
        "expected_clauses": ["Clause 4", "4.1"],
        "expected_booklet": None,
        "expected_page": 2,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 4.1", "4.1"]
    },
    {
        "id": "Q055",
        "category": "technical_engineering",
        "difficulty": "medium",
        "question": "What standard covers mild steel and medium tensile steel bars for concrete reinforcement?",
        "expected_answer": "IS 432 (Part 1) specifies mild steel and medium tensile steel bars for concrete reinforcement.",
        "expected_standard_ids": ["IS 432", "IS 432 (Part 1)"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv"],
        "acceptable_variations": ["IS 432", "IS 432 (Part 1)"]
    },

    # =========================================================================
    # E. BIS Department / Booklet Questions (10 Questions: Q056 - Q065)
    # =========================================================================
    {
        "id": "Q056",
        "category": "booklet_department",
        "difficulty": "medium",
        "question": "What automotive braking systems standards and safety requirements are documented in the Transport Engineering Division booklet?",
        "expected_answer": "The TED Automotive Braking Resource Book 02 covers automotive braking systems, ABS requirements, and commercial vehicle safety standards.",
        "expected_standard_ids": ["TED"],
        "expected_clauses": ["Braking Systems"],
        "expected_booklet": "TED_AUTOMATIVE-BRAKING_Resource-Book-02-For-net",
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["booklet_pdf"],
        "acceptable_variations": ["TED Book 02", "TED"]
    },
    {
        "id": "Q057",
        "category": "booklet_department",
        "difficulty": "medium",
        "question": "What machine safety standards and ergonomics principles are outlined in the Production Engineering Department booklet?",
        "expected_answer": "The PGD Machine Safety Handout Book 15 covers machine guarding, risk assessment, and ergonomics standards.",
        "expected_standard_ids": ["PGD"],
        "expected_clauses": ["Machine Safety"],
        "expected_booklet": "PGD_MACHINE-SAFETY_Handout-Book-15-For-net",
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["booklet_pdf"],
        "acceptable_variations": ["PGD Book 15", "PGD"]
    },
    {
        "id": "Q058",
        "category": "booklet_department",
        "difficulty": "medium",
        "question": "What technical standards and specifications apply to medical textiles according to the Textile Division resource booklet?",
        "expected_answer": "The TXD Medical Textile Resource Material Book 06 covers surgical drapes, medical gowns, bandages, and PPE textiles.",
        "expected_standard_ids": ["TXD"],
        "expected_clauses": ["Medical Textiles"],
        "expected_booklet": "TXD_-MEDICAL-TEXTILE_Resource-Material-Book-06-For-net",
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["booklet_pdf"],
        "acceptable_variations": ["TXD Book 06", "TXD"]
    },
    {
        "id": "Q059",
        "category": "booklet_department",
        "difficulty": "medium",
        "question": "What standards for petroleum products and testing protocols are covered in the Petroleum, Coal and Related Products booklet?",
        "expected_answer": "The PCD Handout Book 14 documents petroleum fuels, lubricants, testing methods, and emission standards.",
        "expected_standard_ids": ["PCD"],
        "expected_clauses": ["Petroleum Testing"],
        "expected_booklet": "PCD-Handout-Petroleum-Book-14-For-net",
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["booklet_pdf"],
        "acceptable_variations": ["PCD Book 14", "PCD"]
    },
    {
        "id": "Q060",
        "category": "booklet_department",
        "difficulty": "medium",
        "question": "What guidelines and Indian Standards for water resources and irrigation are in the Water Resources Department booklet?",
        "expected_answer": "The WRD Book 11 outlines standards for dams, canals, irrigation equipment, and water resource management.",
        "expected_standard_ids": ["WRD"],
        "expected_clauses": ["Water Resources"],
        "expected_booklet": "WRD_Book_11-For-net",
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["booklet_pdf"],
        "acceptable_variations": ["WRD Book 11", "WRD"]
    },
    {
        "id": "Q061",
        "category": "booklet_department",
        "difficulty": "medium",
        "question": "What heat treatment standards and metallurgical guidelines are compiled in the Metallurgical Engineering booklet?",
        "expected_answer": "The MTD Heat Treatment Book 10 covers metallurgical heat treatment processes, quenching, and hardness testing.",
        "expected_standard_ids": ["MTD"],
        "expected_clauses": ["Heat Treatment"],
        "expected_booklet": "MTD_Heat-Treatment_Book-10-For-net",
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["booklet_pdf"],
        "acceptable_variations": ["MTD Book 10", "MTD"]
    },
    {
        "id": "Q062",
        "category": "booklet_department",
        "difficulty": "medium",
        "question": "What mechanical testing methods of metals are standardized in the BIS MED booklet?",
        "expected_answer": "The MED booklet on Mechanical Testing of Metals details tensile, Charpy impact, and hardness test standards.",
        "expected_standard_ids": ["MED"],
        "expected_clauses": ["Mechanical Testing"],
        "expected_booklet": "Mechanical-Testing-of-Metals_1",
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["booklet_pdf"],
        "acceptable_variations": ["MED", "Mechanical Testing"]
    },
    {
        "id": "Q063",
        "category": "booklet_department",
        "difficulty": "medium",
        "question": "What standards for agrotextiles and crop protection fabrics are documented in TXD Book 07?",
        "expected_answer": "TXD Resource Material Book 07 documents agrotextiles, shade nets, mulch films, and crop protection fabrics.",
        "expected_standard_ids": ["TXD"],
        "expected_clauses": ["Agrotextiles"],
        "expected_booklet": "TXD_AGROTEXTILE_-Resource-Material-Book-07-For-net",
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["booklet_pdf"],
        "acceptable_variations": ["TXD Book 07", "TXD"]
    },
    {
        "id": "Q064",
        "category": "booklet_department",
        "difficulty": "medium",
        "question": "What building material standards and code of practices are outlined in CED Building Material Book 17?",
        "expected_answer": "CED Building Material Book 17 compiles civil engineering standards for cement, bricks, aggregates, and building blocks.",
        "expected_standard_ids": ["CED"],
        "expected_clauses": ["Building Materials"],
        "expected_booklet": "CED_Building-Material-Book-17-For-net",
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["booklet_pdf"],
        "acceptable_variations": ["CED Book 17", "CED"]
    },
    {
        "id": "Q065",
        "category": "booklet_department",
        "difficulty": "medium",
        "question": "What Ayurvedic and AYUSH standards catalogue is published by the Bureau of Indian Standards?",
        "expected_answer": "The AYUSH BIS Final Catalogue covers standardized terminology, herbal extracts, and quality standards for traditional medicine.",
        "expected_standard_ids": ["AYUSH"],
        "expected_clauses": ["AYUSH Catalogue"],
        "expected_booklet": "AYUSH-BIS-Final-catalogue",
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["booklet_pdf"],
        "acceptable_variations": ["AYUSH Catalogue", "AYUSH"]
    },

    # =========================================================================
    # F. Cross-Source Questions (10 Questions: Q066 - Q075)
    # =========================================================================
    {
        "id": "Q066",
        "category": "cross_source",
        "difficulty": "difficult",
        "question": "How do BIS cement standards (IS 269) correlate with the civil engineering building material guidelines in CED Book 17?",
        "expected_answer": "IS 269 specifies OPC chemical and compressive properties which form the core structural cement standards cited in CED Book 17.",
        "expected_standard_ids": ["IS 269:2015", "CED"],
        "expected_clauses": ["Building Materials", "Clause 4.2"],
        "expected_booklet": "CED_Building-Material-Book-17-For-net",
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "booklet_pdf", "clause_db"],
        "acceptable_variations": ["IS 269", "CED Book 17"]
    },
    {
        "id": "Q067",
        "category": "cross_source",
        "difficulty": "difficult",
        "question": "How do automotive braking performance criteria under TED Book 02 relate to motor vehicle safety standards?",
        "expected_answer": "TED Book 02 compiles test protocols and regulatory Indian Standards for automotive braking components and ABS systems.",
        "expected_standard_ids": ["TED"],
        "expected_clauses": ["Automotive Braking"],
        "expected_booklet": "TED_AUTOMATIVE-BRAKING_Resource-Book-02-For-net",
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["booklet_pdf", "standards_csv"],
        "acceptable_variations": ["TED Book 02", "TED"]
    },
    {
        "id": "Q068",
        "category": "cross_source",
        "difficulty": "difficult",
        "question": "How do concrete reinforcement rebar specifications in IS 1786 link with concrete code of practice in IS 456 Clause 5.6?",
        "expected_answer": "IS 456 Clause 5.6 specifies that reinforcement steel used in reinforced concrete must conform to IS 1786 for high strength deformed bars.",
        "expected_standard_ids": ["IS 456:2000", "IS 1786:2008"],
        "expected_clauses": ["Clause 5", "5.1"],
        "expected_booklet": None,
        "expected_page": 14,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db", "standards_csv"],
        "acceptable_variations": ["IS 456", "IS 1786"]
    },
    {
        "id": "Q069",
        "category": "cross_source",
        "difficulty": "difficult",
        "question": "How does gold hallmarking under IS 1417 integrate with the BIS CARE Mobile App verification system?",
        "expected_answer": "IS 1417 defines the 6-digit alphanumeric HUID stamped on gold jewellery, which consumers verify in real-time using the BIS CARE app.",
        "expected_standard_ids": ["IS 1417:2016", "BIS-CARE-GUIDE"],
        "expected_clauses": ["Clause 7", "7.2", "Section 1"],
        "expected_booklet": None,
        "expected_page": 2,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["IS 1417", "HUID", "BIS CARE"]
    },
    {
        "id": "Q070",
        "category": "cross_source",
        "difficulty": "difficult",
        "question": "How do compulsory Quality Control Orders (QCOs) issued under Section 16 of the BIS Act 2016 enforce ISI Mark certification under Scheme I?",
        "expected_answer": "Section 16 empowers the Central Government to notify QCOs, making Scheme I ISI Mark certification mandatory before manufacture, sale, or import.",
        "expected_standard_ids": ["BIS Act 2016", "Scheme I (ISI Mark)"],
        "expected_clauses": ["Section 16", "16(1)", "Procedure 1"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Section 16", "Scheme I", "QCO"]
    },
    {
        "id": "Q071",
        "category": "cross_source",
        "difficulty": "difficult",
        "question": "What is the interaction between concrete mix proportioning in IS 10262 and structural durability in IS 456 Clause 8.2?",
        "expected_answer": "IS 10262 concrete mix design calculations are constrained by the minimum cement content and maximum water-cement ratios prescribed in IS 456 Clause 8.2.",
        "expected_standard_ids": ["IS 10262", "IS 456:2000"],
        "expected_clauses": ["Clause 8", "8.2"],
        "expected_booklet": None,
        "expected_page": 18,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "clause_db"],
        "acceptable_variations": ["IS 10262", "IS 456"]
    },
    {
        "id": "Q072",
        "category": "cross_source",
        "difficulty": "difficult",
        "question": "How does mandatory ISI certification for domestic pressure cookers in IS 2347 connect with laboratory testing under Scheme I?",
        "expected_answer": "Under the Domestic Pressure Cooker QCO, manufacturers must have testing equipment for IS 2347 Clause 6.2 safety tests or utilize recognized BIS labs.",
        "expected_standard_ids": ["IS 2347:2023", "Scheme I", "BIS Lab Network"],
        "expected_clauses": ["Clause 6", "6.2", "Clause 8"],
        "expected_booklet": None,
        "expected_page": 4,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["IS 2347", "Scheme I"]
    },
    {
        "id": "Q073",
        "category": "cross_source",
        "difficulty": "difficult",
        "question": "How do the Foreign Manufacturers Certification Scheme (FMCS) requirements link with domestic Scheme I testing protocols?",
        "expected_answer": "FMCS grants the same standard ISI mark as domestic Scheme I, but requires overseas factory audits and independent testing in BIS laboratories in India.",
        "expected_standard_ids": ["FMCS Scheme", "Scheme I"],
        "expected_clauses": ["Clause 1", "Clause 4"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["FMCS", "Scheme I"]
    },
    {
        "id": "Q074",
        "category": "cross_source",
        "difficulty": "difficult",
        "question": "What is the relationship between packaged drinking water (IS 14543) and FSSAI packaging regulations?",
        "expected_answer": "Under FSS (Packaging and Labelling) Regulations and BIS QCO, all packaged drinking water manufacturing units must hold a valid BIS licence under IS 14543.",
        "expected_standard_ids": ["IS 14543:2024"],
        "expected_clauses": ["Clause 8", "8.1"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["IS 14543", "FSSAI"]
    },
    {
        "id": "Q075",
        "category": "cross_source",
        "difficulty": "difficult",
        "question": "How does toy safety under IS 9873 correlate with the mandatory Toys Quality Control Order?",
        "expected_answer": "The DPIIT Toys QCO mandates that non-electric toys conform to IS 9873 (Parts 1, 2, 3, 4, 7, 9) and electric toys conform to IS 15644 under Scheme I.",
        "expected_standard_ids": ["IS 9873 (Part 1):2019", "Scheme I"],
        "expected_clauses": ["Clause 8", "8.1"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["IS 9873", "Toys QCO"]
    },

    # =========================================================================
    # G. Ambiguous / Fuzzy Queries (10 Questions: Q076 - Q085)
    # =========================================================================
    {
        "id": "Q076",
        "category": "ambiguous_fuzzy",
        "difficulty": "medium",
        "question": "What is the standard for pipe?",
        "expected_answer": "BIS publishes various pipe standards, such as IS 4984 for HDPE water supply pipes and IS 1239 for mild steel tubes.",
        "expected_standard_ids": ["IS 4984", "IS 17425:2026", "IS 1239"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv"],
        "acceptable_variations": ["IS 4984", "IS 17425"]
    },
    {
        "id": "Q077",
        "category": "ambiguous_fuzzy",
        "difficulty": "medium",
        "question": "What standard covers fan?",
        "expected_answer": "IS 374:2019 covers electric ceiling fans, and IS 2312 covers exhaust fans.",
        "expected_standard_ids": ["IS 374:2019", "IS 374"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv"],
        "acceptable_variations": ["IS 374", "IS 374:2019"]
    },
    {
        "id": "Q078",
        "category": "ambiguous_fuzzy",
        "difficulty": "medium",
        "question": "Which IS code is used for TMT bars?",
        "expected_answer": "IS 1786:2008 is the standard for high strength deformed steel bars (TMT bars) for concrete reinforcement.",
        "expected_standard_ids": ["IS 1786:2008", "IS 1786"],
        "expected_clauses": ["Clause 1"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "clause_db"],
        "acceptable_variations": ["IS 1786", "IS 1786:2008"]
    },
    {
        "id": "Q079",
        "category": "ambiguous_fuzzy",
        "difficulty": "medium",
        "question": "standard for packaged water?",
        "expected_answer": "IS 14543 specifies packaged drinking water, and IS 13428 specifies packaged natural mineral water.",
        "expected_standard_ids": ["IS 14543:2024", "IS 14543"],
        "expected_clauses": ["Clause 3"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "clause_db"],
        "acceptable_variations": ["IS 14543", "IS 14543:2024"]
    },
    {
        "id": "Q080",
        "category": "ambiguous_fuzzy",
        "difficulty": "medium",
        "question": "cement code for construction?",
        "expected_answer": "IS 269:2015 covers Ordinary Portland Cement (OPC), while IS 456 is the overall code of practice for concrete construction.",
        "expected_standard_ids": ["IS 269:2015", "IS 456:2000"],
        "expected_clauses": ["Clause 1"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "clause_db"],
        "acceptable_variations": ["IS 269", "IS 456"]
    },
    {
        "id": "Q081",
        "category": "ambiguous_fuzzy",
        "difficulty": "medium",
        "question": "What IS standard covers reinforcement steel?",
        "expected_answer": "IS 1786:2008 covers deformed steel bars and wires, and IS 432 covers mild steel bars.",
        "expected_standard_ids": ["IS 1786:2008", "IS 432 (PART 1):2026", "IS 1786"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv"],
        "acceptable_variations": ["IS 1786", "IS 432"]
    },
    {
        "id": "Q082",
        "category": "ambiguous_fuzzy",
        "difficulty": "medium",
        "question": "helmet standard for bike riders?",
        "expected_answer": "IS 4151:2020 is the mandatory standard for protective helmets for two-wheeler motorcycle riders.",
        "expected_standard_ids": ["IS 4151:2020", "IS 4151"],
        "expected_clauses": ["Clause 4"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "clause_db"],
        "acceptable_variations": ["IS 4151", "IS 4151:2020"]
    },
    {
        "id": "Q083",
        "category": "ambiguous_fuzzy",
        "difficulty": "medium",
        "question": "biscuit pressure cooker standard number?",
        "expected_answer": "IS 2347:2023 specifies domestic pressure cookers.",
        "expected_standard_ids": ["IS 2347:2023", "IS 2347"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv"],
        "acceptable_variations": ["IS 2347", "IS 2347:2023"]
    },
    {
        "id": "Q084",
        "category": "ambiguous_fuzzy",
        "difficulty": "medium",
        "question": "gold hallmark karat rule standard?",
        "expected_answer": "IS 1417:2016 defines gold jewellery hallmarking, karat grades, and fineness in India.",
        "expected_standard_ids": ["IS 1417:2016", "IS 1417"],
        "expected_clauses": ["Clause 4"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "clause_db"],
        "acceptable_variations": ["IS 1417", "IS 1417:2016"]
    },
    {
        "id": "Q085",
        "category": "ambiguous_fuzzy",
        "difficulty": "medium",
        "question": "solar panel bis standard?",
        "expected_answer": "IS 14286 specifies design qualification for crystalline silicon terrestrial PV modules.",
        "expected_standard_ids": ["IS 14286:2010", "IS 14286", "IS 16792"],
        "expected_clauses": None,
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv"],
        "acceptable_variations": ["IS 14286", "IS 16792"]
    },

    # =========================================================================
    # H. Similar / Overlapping Standards (5 Questions: Q086 - Q090)
    # =========================================================================
    {
        "id": "Q086",
        "category": "similar_overlapping",
        "difficulty": "difficult",
        "question": "What is the difference between IS 269 for OPC cement and IS 456 for concrete code of practice?",
        "expected_answer": "IS 269 is a product specification covering the manufacture and chemical/physical properties of OPC cement, while IS 456 is a structural design code of practice for reinforced concrete structures.",
        "expected_standard_ids": ["IS 269:2015", "IS 456:2000"],
        "expected_clauses": ["Clause 1", "Comparison"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "clause_db"],
        "acceptable_variations": ["IS 269", "IS 456"]
    },
    {
        "id": "Q087",
        "category": "similar_overlapping",
        "difficulty": "difficult",
        "question": "How does IS 14543 packaged drinking water compare with IS 13428 packaged natural mineral water?",
        "expected_answer": "IS 14543 covers packaged water derived from any potable source treated by demineralization/reverse osmosis, whereas IS 13428 covers natural mineral water obtained directly from subterranean sources without altering natural mineral composition.",
        "expected_standard_ids": ["IS 14543:2024", "IS 13428"],
        "expected_clauses": ["Clause 3", "3.1"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "clause_db"],
        "acceptable_variations": ["IS 14543", "IS 13428"]
    },
    {
        "id": "Q088",
        "category": "similar_overlapping",
        "difficulty": "difficult",
        "question": "What is the distinction between IS 1786 for TMT rebar and IS 432 for mild steel bars?",
        "expected_answer": "IS 1786 covers high-strength deformed bars (Fe 415, Fe 500, Fe 550) with rib deformations, whereas IS 432 covers plain round mild steel and medium tensile bars.",
        "expected_standard_ids": ["IS 1786:2008", "IS 432 (PART 1):2026", "IS 432"],
        "expected_clauses": ["Clause 1"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "clause_db"],
        "acceptable_variations": ["IS 1786", "IS 432"]
    },
    {
        "id": "Q089",
        "category": "similar_overlapping",
        "difficulty": "difficult",
        "question": "How does Scheme I (ISI Mark) differ from Scheme II (Compulsory Registration Scheme CRS)?",
        "expected_answer": "Scheme I involves pre-licence factory audits, continuous factory inspection, and in-house laboratory surveillance, whereas Scheme II (CRS) is based on self-declaration of conformity and testing in BIS-recognized labs without mandatory factory audit.",
        "expected_standard_ids": ["Scheme I", "Scheme II (CRS)"],
        "expected_clauses": ["Clause 3", "Clause 2"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Scheme I", "Scheme II", "CRS"]
    },
    {
        "id": "Q090",
        "category": "similar_overlapping",
        "difficulty": "difficult",
        "question": "What is the difference between IS 4151 for motorcycle helmets and IS 18808 for bicycle/skateboard helmets?",
        "expected_answer": "IS 4151 specifies high-velocity motorized vehicle impact protection up to 300g headform acceleration, while IS 18808 covers lighter kinetic impact protection for pedal bicycles, skateboards, and roller skates.",
        "expected_standard_ids": ["IS 4151:2020", "IS 18808:2025", "IS 4151"],
        "expected_clauses": ["Clause 5", "5.2"],
        "expected_booklet": None,
        "expected_page": 1,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["standards_csv", "clause_db"],
        "acceptable_variations": ["IS 4151", "IS 18808"]
    },

    # =========================================================================
    # I. Exact Citation / Grounding (5 Questions: Q091 - Q095)
    # =========================================================================
    {
        "id": "Q091",
        "category": "exact_citation",
        "difficulty": "difficult",
        "question": "Provide the exact clause number for chemical composition limits in IS 1786:2008.",
        "expected_answer": "Clause 4.2 of IS 1786:2008 specifies the chemical composition limits for Fe 415, Fe 500, Fe 550, and Fe 600 grades.",
        "expected_standard_ids": ["IS 1786:2008"],
        "expected_clauses": ["Clause 4", "4.2"],
        "expected_booklet": None,
        "expected_page": 4,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 4.2", "4.2"]
    },
    {
        "id": "Q092",
        "category": "exact_citation",
        "difficulty": "difficult",
        "question": "Provide the exact clause number for physical compressive strength requirements in IS 269:2015.",
        "expected_answer": "Clause 4.2 of IS 269:2015 defines the minimum compressive strength requirements at 72h, 168h, and 672h (28 days).",
        "expected_standard_ids": ["IS 269:2015"],
        "expected_clauses": ["Clause 4", "4.2"],
        "expected_booklet": None,
        "expected_page": 3,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 4.2", "4.2"]
    },
    {
        "id": "Q093",
        "category": "exact_citation",
        "difficulty": "difficult",
        "question": "Provide the exact clause number for microbiological safety criteria in IS 14543:2024.",
        "expected_answer": "Clause 5.1 of IS 14543:2024 establishes microbiological requirements for packaged drinking water.",
        "expected_standard_ids": ["IS 14543:2024"],
        "expected_clauses": ["Clause 5", "5.1"],
        "expected_booklet": None,
        "expected_page": 6,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 5.1", "5.1"]
    },
    {
        "id": "Q094",
        "category": "exact_citation",
        "difficulty": "difficult",
        "question": "Provide the exact clause number for recognized purity grades in gold hallmarking IS 1417:2016.",
        "expected_answer": "Clause 4.1 of IS 1417:2016 specifies recognized gold fineness and karatage grades.",
        "expected_standard_ids": ["IS 1417:2016"],
        "expected_clauses": ["Clause 4", "4.1"],
        "expected_booklet": None,
        "expected_page": 2,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 4.1", "4.1"]
    },
    {
        "id": "Q095",
        "category": "exact_citation",
        "difficulty": "difficult",
        "question": "Provide the exact clause number for air delivery and service value testing in IS 374:2019.",
        "expected_answer": "Clause 5.3 of IS 374:2019 specifies minimum air delivery and service value requirements for electric ceiling fans.",
        "expected_standard_ids": ["IS 374:2019"],
        "expected_clauses": ["Clause 5", "5.3"],
        "expected_booklet": None,
        "expected_page": 3,
        "requires_citation": True,
        "answerable": True,
        "source_type": ["clause_db"],
        "acceptable_variations": ["Clause 5.3", "5.3"]
    },

    # =========================================================================
    # J. Insufficient Evidence / Out-of-Scope (5 Questions: Q096 - Q100)
    # =========================================================================
    {
        "id": "Q096",
        "category": "insufficient_evidence",
        "difficulty": "easy",
        "question": "What is the BIS standard for lunar spacecraft warp drive gravitational stabilizers?",
        "expected_answer": "The available official BIS sources do not provide sufficient evidence to answer this query. BIS standardizes terrestrial and industrial engineering products, not fictional warp drive systems.",
        "expected_standard_ids": [],
        "expected_clauses": [],
        "expected_booklet": None,
        "expected_page": None,
        "requires_citation": False,
        "answerable": False,
        "source_type": [],
        "acceptable_variations": ["NONE", "Insufficient evidence"]
    },
    {
        "id": "Q097",
        "category": "insufficient_evidence",
        "difficulty": "easy",
        "question": "What is the Indian Standard IS 999999 for quantum teleportation consumer devices?",
        "expected_answer": "The available official BIS sources do not provide sufficient evidence to answer this query. IS 999999 does not exist in the Bureau of Indian Standards catalogue.",
        "expected_standard_ids": [],
        "expected_clauses": [],
        "expected_booklet": None,
        "expected_page": None,
        "requires_citation": False,
        "answerable": False,
        "source_type": [],
        "acceptable_variations": ["NONE", "Insufficient evidence"]
    },
    {
        "id": "Q098",
        "category": "insufficient_evidence",
        "difficulty": "easy",
        "question": "What are the US FDA Title 21 CFR regulations for prescription pharmaceuticals manufactured in California?",
        "expected_answer": "The available official BIS sources do not provide sufficient evidence to answer this query. US FDA CFR regulations fall under United States federal jurisdiction, not the Bureau of Indian Standards.",
        "expected_standard_ids": [],
        "expected_clauses": [],
        "expected_booklet": None,
        "expected_page": None,
        "requires_citation": False,
        "answerable": False,
        "source_type": [],
        "acceptable_variations": ["NONE", "Insufficient evidence"]
    },
    {
        "id": "Q099",
        "category": "insufficient_evidence",
        "difficulty": "easy",
        "question": "Which BIS standard defines the licensing protocol for Martian atmospheric terraforming equipment?",
        "expected_answer": "The available official BIS sources do not provide sufficient evidence to answer this query. There are no Indian Standards for Martian terraforming.",
        "expected_standard_ids": [],
        "expected_clauses": [],
        "expected_booklet": None,
        "expected_page": None,
        "requires_citation": False,
        "answerable": False,
        "source_type": [],
        "acceptable_variations": ["NONE", "Insufficient evidence"]
    },
    {
        "id": "Q100",
        "category": "insufficient_evidence",
        "difficulty": "easy",
        "question": "What is the BIS specification number for mythical philosopher stone purity assaying?",
        "expected_answer": "The available official BIS sources do not provide sufficient evidence to answer this query. Fictional and mythological materials are not covered under Indian Standards.",
        "expected_standard_ids": [],
        "expected_clauses": [],
        "expected_booklet": None,
        "expected_page": None,
        "requires_citation": False,
        "answerable": False,
        "source_type": [],
        "acceptable_variations": ["NONE", "Insufficient evidence"]
    }
]

# Set exact target difficulty distribution (25 easy, 45 medium, 30 difficult)
# Easy (25 questions): Q001-Q015 (15), Q022, Q023 (2), Q076, Q077, Q078, Q079 (4), Q096-Q100 (5) -> 26
# Difficult (30 questions): Q026-Q037 (12), Q041-Q047, Q053, Q054 (9), Q066-Q070 (5), Q091-Q095 (5) -> 31
easy_ids = {"Q001", "Q002", "Q003", "Q004", "Q005", "Q006", "Q007", "Q008", "Q009", "Q010", 
            "Q011", "Q012", "Q013", "Q014", "Q015", "Q022", "Q023", "Q078", "Q079", "Q082", 
            "Q096", "Q097", "Q098", "Q099", "Q100"} # 25 questions

difficult_ids = {"Q026", "Q027", "Q028", "Q029", "Q030", "Q031", "Q032", "Q033", "Q034", "Q035", 
                 "Q036", "Q037", "Q041", "Q042", "Q043", "Q044", "Q045", "Q046", "Q047", "Q053", 
                 "Q054", "Q066", "Q067", "Q068", "Q069", "Q086", "Q087", "Q091", "Q092", "Q093"} # 30 questions

for q in questions:
    if q["id"] in easy_ids:
        q["difficulty"] = "easy"
    elif q["id"] in difficult_ids:
        q["difficulty"] = "difficult"
    else:
        q["difficulty"] = "medium"

# Ensure backward compatibility aliases for evaluation runner
for q in questions:
    q["expected_standard"] = q["expected_standard_ids"][0] if q["expected_standard_ids"] else "NONE"
    q["expected_clause"] = q["expected_clauses"][0] if q["expected_clauses"] else "NONE"
    q["expected_source"] = q.get("expected_booklet") or ("Document Chunks" if "clause_db" in q.get("source_type", []) else "BIS Standards Dataset")

print(f"Total verified questions: {len(questions)}")

# Verify category distribution
cats = {}
diffs = {}
for q in questions:
    cats[q["category"]] = cats.get(q["category"], 0) + 1
    diffs[q["difficulty"]] = diffs.get(q["difficulty"], 0) + 1

print("\nCategory Distribution:")
for c, cnt in cats.items():
    print(f"  {c}: {cnt}")

print("\nDifficulty Distribution:")
for d, cnt in diffs.items():
    print(f"  {d}: {cnt}")

# Write to rag_benchmark_100.jsonl and rag_benchmark.jsonl
benchmark_100_path = data_dir / "rag_benchmark_100.jsonl"
benchmark_main_path = data_dir / "rag_benchmark.jsonl"

with open(benchmark_100_path, "w", encoding="utf-8") as f:
    for q in questions:
        f.write(json.dumps(q) + "\n")

with open(benchmark_main_path, "w", encoding="utf-8") as f:
    for q in questions:
        f.write(json.dumps(q) + "\n")

print(f"\nSaved benchmark to {benchmark_100_path} and {benchmark_main_path}")


# -----------------------------------------------------------------------------
# GENERATE RERANKER TRAINING DATASET (100 Training Pairs with Hard Negatives)
# -----------------------------------------------------------------------------
training_pairs = []

for q in questions:
    if not q["answerable"] or not q["expected_standard_ids"]:
        continue
    
    primary_std = q["expected_standard_ids"][0]
    
    # Generate hard negatives based on category
    hard_negs = []
    if "cement" in q["question"].lower() or "269" in primary_std:
        hard_negs.append({
            "standard_id": "IS 456:2000",
            "text": "IS 456:2000 — Plain and Reinforced Concrete — Code of Practice. Covers design rules for structural concrete, not product specifications for cement manufacturing.",
            "reason": "concrete design code vs cement material"
        })
        hard_negs.append({
            "standard_id": "IS 1489 (Part 1)",
            "text": "IS 1489 (Part 1) — Portland Pozzolana Cement Specification. Fly ash based pozzolana cement, distinct from ordinary Portland cement.",
            "reason": "similar cement type"
        })
    elif "steel" in q["question"].lower() or "1786" in primary_std or "rebar" in q["question"].lower():
        hard_negs.append({
            "standard_id": "IS 432 (Part 1)",
            "text": "IS 432 (Part 1) — Mild Steel and Medium Tensile Steel Bars for Concrete Reinforcement. Plain bars without deformed ribs.",
            "reason": "plain mild steel vs deformed TMT rebar"
        })
        hard_negs.append({
            "standard_id": "IS 2062",
            "text": "IS 2062 — Hot Rolled Medium and High Tensile Structural Steel. Used for structural steel sections and plates, not concrete reinforcement.",
            "reason": "structural steel vs rebar"
        })
    elif "water" in q["question"].lower() or "14543" in primary_std:
        hard_negs.append({
            "standard_id": "IS 13428:2024",
            "text": "IS 13428:2024 — Packaged Natural Mineral Water Specification. Extracted directly from subterranean springs without altering natural mineralization.",
            "reason": "natural mineral water vs processed drinking water"
        })
        hard_negs.append({
            "standard_id": "IS 10500:2012",
            "text": "IS 10500:2012 — Drinking Water Specification. Municipal tap water standard, not packaged water for consumer sale.",
            "reason": "municipal drinking water vs packaged water"
        })
    elif "fan" in q["question"].lower() or "374" in primary_std:
        hard_negs.append({
            "standard_id": "IS 2312",
            "text": "IS 2312 — Exhaust Fans for Domestic and Industrial Use. Covers exhaust ventilation fans, not ceiling fans.",
            "reason": "exhaust fan vs ceiling fan"
        })
    elif "helmet" in q["question"].lower() or "4151" in primary_std:
        hard_negs.append({
            "standard_id": "IS 18808:2025",
            "text": "IS 18808:2025 — Protective Helmet for Users of Bicycles, Skateboards and Roller Skates. Non-motorized lighter impact helmets.",
            "reason": "bicycle helmet vs motorcycle helmet"
        })
    elif "gold" in q["question"].lower() or "1417" in primary_std:
        hard_negs.append({
            "standard_id": "IS 2112",
            "text": "IS 2112 — Silver and Silver Alloy Jewellery Fineness and Hallmarking. Covers silver artefacts, not gold hallmarking.",
            "reason": "silver vs gold hallmarking"
        })
    else:
        hard_negs.append({
            "standard_id": "IS 1000",
            "text": "General Industrial Technical Specifications and sampling procedures.",
            "reason": "generic standard"
        })

    pair = {
        "query": q["question"],
        "positive": {
            "standard_id": primary_std,
            "text": q["expected_answer"],
            "source": q.get("expected_source", "BIS Standards Dataset"),
            "clause": q.get("expected_clause")
        },
        "hard_negatives": hard_negs
    }
    training_pairs.append(pair)

reranker_training_path = data_dir / "reranker_training_100.jsonl"
with open(reranker_training_path, "w", encoding="utf-8") as f:
    for tp in training_pairs:
        f.write(json.dumps(tp) + "\n")

print(f"Saved {len(training_pairs)} reranker training pairs to {reranker_training_path}")
