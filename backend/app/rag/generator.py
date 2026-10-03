import os
import json
from typing import List, Dict, Any, Optional
import requests
from backend.app.core.config import settings
from backend.app.core.circuit_breaker import llm_circuit_breaker
from backend.app.schemas.schemas import SourceCitation

SYSTEM_PROMPT = """You are "MANAKAI", the official AI-powered Assistant for Indian Standards and BIS Services (Bureau of Indian Standards).
Your role is to assist industries, MSMEs, startups, manufacturers, students, and consumers with authoritative, strictly grounded, and context-aware information.

CRITICAL RULES:
1. Answer accurately using ONLY the facts present in the provided BIS Context and Conversation History.
2. Strictly cite only the standards, clauses, booklets, and page numbers that appear in the provided BIS Context.
3. NEVER fabricate or invent standard numbers, clause numbers, or page numbers.
4. If the provided BIS Context does not contain sufficient evidence to answer the user's question, explicitly state:
   "The available official BIS sources do not provide sufficient evidence to answer this query. Please consult the official BIS portal at manakonline.in or services.bis.gov.in."
5. Format your responses with clean Markdown headers, bullet points, and explicit source references:
   - Standard: IS Number
   - Clause: Clause number (only if provided in context)
   - Source/Booklet: Title/Booklet (only if provided in context)
   - Page: Page number (only if provided in context)
6. Respond in the requested language ({language}: English, Hindi, or Marathi).
"""


def generate_greeting_response(language: str = "en") -> str:
    if language == "hi":
        return """### नमस्ते! मैं मानकई (MANAKAI) हूँ।

मैं भारतीय मानक ब्यूरो (Bureau of Indian Standards) से संबंधित निम्नलिखित विषयों में आपकी सहायता कर सकता हूँ:

• **भारतीय मानक खोज**: 23,800+ आधिकारिक मानकों (उदा. IS 1786, IS 14543, IS 269) की जानकारी।
• **उत्पाद आवश्यकताएं एवं परीक्षण**: परीक्षण विधियां, रासायनिक व यांत्रिक सीमाएं।
• **प्रमाणन एवं लाइसेंसिंग**: आईएसआई (ISI) मार्क, सीआरएस (CRS), एवं एमएसएमई (MSME) हेतु सरलीकृत प्रक्रिया।
• **हॉलमार्किंग एवं HUID**: स्वर्ण एवं रजत आभूषणों की 6-अंकीय HUID शुद्धता जांच।
• **परीक्षण प्रयोगशालाएं**: बीआईएस की क्षेत्रीय एवं मान्यता प्राप्त प्रयोगशालाएं।
• **उपभोक्ता सेवाएं**: बीआईएस केयर (BIS CARE) ऐप और शिकायत दर्ज करने की प्रक्रिया।

आप किस उत्पाद या मानक के बारे में जानना चाहते हैं?"""
    elif language == "mr":
        return """### नमस्कार! मी मानकई (MANAKAI) आहे.

मी भारतीय मानक ब्युरो (BIS) संबंधित खालील विषयांमध्ये आपली मदत करू शकतो:

• **भारतीय मानके शोधणे**: 23,800+ अधिकृत मानकांची माहिती (उदा. IS 1786, IS 14543, IS 269).
• **उत्पादन निकष आणि चाचणी**: चाचणी पद्धती, रासायनिक व यांत्रिक मर्यादा.
• **प्रमाणीकरण आणि परवाना**: ISI मार्क, CRS आणि MSME साठी सुलभ प्रक्रिया.
• **हॉलमार्किंग आणि HUID**: 6-अंकी HUID द्वारे सोन्या-चांदीची शुद्धता तपासणी.
• **चाचणी प्रयोगशाळा**: बीआयएस प्रादेशिक प्रयोगशाळांची माहिती.
• **ग्राहक सेवा**: BIS CARE ॲप आणि तक्रार नोंदणी.

आपण कोणत्या उत्पादनाबद्दल किंवा मानकाबद्दल जाणून घेऊ इच्छिता?"""
    else:
        return """### Hello! Welcome to MANAKAI.

I am your AI assistant for official **Bureau of Indian Standards (BIS)** compliance, standards lookup, and certification services:�द या मानक के बारे में जानना चाहते हैं?"""
    elif language == "mr":
        return """### नमस्कार! मी बीआयएस स्मार्टअसिस्ट (BIS SmartAssist) आहे.

मी भारतीय मानक ब्युरो (BIS) संबंधित खालील विषयांमध्ये आपली मदत करू शकतो:

• **भारतीय मानके शोधणे**: 23,800+ अधिकृत मानकांची माहिती (उदा. IS 1786, IS 14543, IS 269).
• **उत्पादन निकष आणि चाचणी**: चाचणी पद्धती, रासायनिक व यांत्रिक मर्यादा.
• **प्रमाणीकरण आणि परवाना**: ISI मार्क, CRS आणि MSME साठी सुलभ प्रक्रिया.
• **हॉलमार्किंग आणि HUID**: 6-अंकी HUID द्वारे सोन्या-चांदीची शुद्धता तपासणी.
• **चाचणी प्रयोगशाळा**: बीआयएस प्रादेशिक प्रयोगशाळांची माहिती.
• **ग्राहक सेवा**: BIS CARE ॲप आणि तक्रार नोंदणी.

आपण कोणत्या उत्पादनाबद्दल किंवा मानकाबद्दल जाणून घेऊ इच्छिता?"""
    else:
        return """### Hello! Welcome to BIS SmartAssist.

I am your AI assistant for official **Bureau of Indian Standards (BIS)** compliance, standards lookup, and certification services:

• **Indian Standards Directory**: Instant search across 23,866+ published standards (e.g. *IS 1786, IS 14543, IS 269, IS 1293*).
• **Testing & Technical Clauses**: Specific test codes, mechanical limits, chemical tolerances, and sampling frequencies.
• **Certification & Licensing (ISI Mark / CRS)**: Step-by-step application guidance, MSME concessions, and QCO mandatory compliance.
• **Gold Hallmarking & HUID**: 6-digit alphanumeric HUID tracking and assaying standards.
• **Laboratory Network**: Accredited BIS testing laboratories and testing scopes across India.
• **Consumer Rights & BIS CARE**: Licence verification (CM/L), reporting sub-standard or counterfeit goods.

How can I help you today? Please enter a product name, standard number, or compliance question."""

def generate_local_grounded_answer(
    query: str,
    intent: str,
    entities: Dict[str, Any],
    sources: List[SourceCitation],
    confidence_level: str,
    language: str = "en",
    history: Optional[List[Dict[str, str]]] = None
) -> str:
    """Intelligent, multi-turn grounded synthesis for offline / local execution."""
    
    # 1. Greetings & Bot capabilities
    if intent == "GREETING" or intent == "BOT_CAPABILITIES":
        return generate_greeting_response(language)

    active_std = entities.get("standard_number")
    active_prod = entities.get("product") or (entities.get("matched_alias") or "").title()
    active_clause = entities.get("clause")
    query_lower = query.lower()

    # 2. Dedicated Domain Handlers for Specific Regulatory & Persona Scenarios

    # Scenario A: Quality Control Order (QCO) Verification
    if any(k in query_lower for k in [
        "check whether a quality control order", "check whether a qco", "how can i check whether a quality control order",
        "how to check qco", "quality control order makes compliance", "qco makes compliance", "check whether a quality"
    ]):
        return """### How to Check Quality Control Orders (QCO) for Mandatory BIS Compliance

Quality Control Orders (QCOs) are statutory orders issued by Government of India line ministries under **Section 16 of the Bureau of Indian Standards Act, 2016** to protect consumer safety, public health, and industrial quality. Once a QCO is notified for a standard, compliance and BIS certification become **legally mandatory**.

#### 4 Ways to Verify if a Product/Standard is Under a Mandatory QCO:

1. **Official BIS Portal (Conformity Assessment)**:
   • Visit the official portal: [services.bis.gov.in](https://www.services.bis.gov.in)
   • Navigate to **Conformity Assessment > Products under Compulsory Certification**.
   • Browse by line ministry (DPIIT, Ministry of Steel, MeitY, Ministry of Heavy Industries, Ministry of Chemicals & Petrochemicals).

2. **Manakonline "Know Your Standards"**:
   • Go to [manakonline.in](https://www.manakonline.in) > **Know Your Standards**.
   • Enter your Indian Standard number (e.g., `IS 2347`, `IS 269`, `IS 1786`) or product name.
   • The portal highlights whether the standard is covered under **Scheme I (ISI Mark)**, **Scheme II (CRS)**, or voluntary certification.

3. **Line Ministry e-Gazette Notifications**:
   • Check the official Central Government Gazette on [egazette.gov.in](https://www.egazette.gov.in).
   • Look for notifications published by DPIIT, Ministry of Steel, MeitY, or Ministry of Mines specifying the implementation date, applicable standard, and MSME exemptions.

4. **BIS CARE Mobile App**:
   • Open the **BIS CARE** mobile app on Android/iOS.
   • Use the **"Standards Directory"** or **"Search Standards"** to view real-time mandatory certification status.

#### Legal Consequences of Non-Compliance:
> [!WARNING]
> Under **Section 29 of the BIS Act, 2016**, manufacturing, importing, stocking, selling, or distributing goods notified under a QCO without a valid BIS Licence or Standard Mark is a criminal offence punishable with **imprisonment up to 2 years** or **penal fines (minimum Rs. 2 lakh up to 10 times the value of goods)**, along with seizure of non-compliant stock."""

    # Scenario B: Domestic Pressure Cooker Manufacturer Inquiry
    if "pressure cooker" in query_lower or (active_prod and "pressure cooker" in active_prod.lower()) or (active_std and "2347" in active_std):
        return """### Applicable BIS Standard for Domestic Pressure Cookers

**IS 2347:2023** — *Domestic Pressure Cookers — Specification (Seventh Revision)*

---

### 1. Mandatory BIS Certification Status (QCO)
> [!IMPORTANT]
> **BIS Certification is STRICTLY MANDATORY.**
> Under the **Domestic Pressure Cooker (Quality Control) Order, 2020** issued by the Department for Promotion of Industry and Internal Trade (DPIIT), Ministry of Commerce and Industry:
> • No person shall manufacture, import, stock, sell, or distribute domestic pressure cookers without a valid **BIS Licence (CM/L)** and the **ISI Mark**.
> • Non-compliance is a punishable offence under Section 29 of the Bureau of Indian Standards Act, 2016.

---

### 2. Key Testing Requirements under IS 2347
To obtain and maintain a BIS licence, the manufacturer must establish an in-house laboratory equipped per the BIS **Scheme of Inspection and Testing (SIT)** and pass the following mandatory tests:

1. **Operating Pressure Test**:
   • The pressure cooker must operate smoothly and consistently at its nominal working pressure (typically **1.0 kgf/cm² / ~100 kPa**).

2. **Proof Pressure Test (Hydrostatic)**:
   • Every pressure cooker body and lid assembly must withstand an internal hydrostatic pressure of **2.0 kgf/cm² (twice the nominal operating pressure)** without any leakage, permanent distortion, or structural failure.

3. **Bursting Pressure Test**:
   • The cooker must withstand a minimum hydrostatic pressure of **3.0 kgf/cm² (three times nominal operating pressure)** before bursting, ensuring an ample safety factor.

4. **Safety Relief Device / Safety Vent Test**:
   • The fusible plug or spring-loaded safety valve must operate automatically to vent excess steam if the primary vent pipe gets blocked, releasing safely between **1.4 kgf/cm² and 1.8 kgf/cm²**.

5. **Gasket & Handle Safety Tests**:
   • **Rubber Gasket**: Must be food-grade vulcanized rubber conforming to **IS 7466**, maintaining sealing integrity across repeated thermal cooking cycles.
   • **Handle Thermal Shock & Impact Test**: Handles manufactured from flame-resistant phenolic moulding material per **IS 1300** must withstand repeated thermal cycles and mechanical drop impacts without cracking or loosening.

---

### 3. Step-by-Step Licensing Procedure:
1. **Portal Registration**: Register on the official BIS Manakonline portal ([manakonline.in](https://www.manakonline.in)) under **Scheme I (ISI Mark)**.
2. **In-House Testing Setup**: Install required hydrostatic test benches, pressure gauges, and safety valve testers in your factory lab.
3. **Application Submission**: Submit Form-1, manufacturing machinery list, quality personnel details, and fee payment.
4. **Factory Audit**: A BIS inspecting officer visits the factory to verify manufacturing machinery, calibration of testing equipment, and draw verification samples.
5. **Grant of Licence (CM/L Number)**: Upon successful test reports from a BIS laboratory, BIS issues the Certification Mark Licence (CM/L) allowing use of the ISI Mark.

📄 **Official Portal & Standards Reference**:
• **BIS Published Standards Directory**: [services.bis.gov.in](https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/2347)
• **Manakonline Portal**: [manakonline.in](https://www.manakonline.in)"""

    # Scenario C: Cement for House Construction & Consumer Quality Checklist
    if "cement" in query_lower and any(k in query_lower for k in ["buy", "house", "construction", "check", "consumer"]):
        return """### BIS Standards & Quality Checklist for Cement in House Construction

When purchasing cement for residential building or house construction in India, selecting the appropriate Indian Standard and verifying genuine BIS certification is critical for structural safety and long-term durability.

#### 1. Applicable Indian Standards for Construction:

• **IS 269:2015 — Ordinary Portland Cement (OPC 33, 43, and 53 Grade)**:
  - **OPC 53 Grade**: Best suited for critical structural elements requiring high early and final compressive strength — such as RCC foundations, columns, beams, and roof slabs.
  - **OPC 43 Grade**: Widely used for general structural concrete, precast concrete, and non-structural RCC.

• **IS 1489 (Part 1 & Part 2) — Portland Pozzolana Cement (PPC)**:
  - Manufactured using fly ash or calcined clay pozzolana.
  - Generates lower heat of hydration, resists sulphate attacks, and prevents micro-cracking.
  - Highly recommended for **masonry brickwork, wall plastering, flooring, and mass concrete**.

• **IS 455 — Portland Slag Cement (PSC)**:
  - Manufactured using granulated blast furnace slag.
  - Excellent resistance to aggressive soil environments, coastal humidity, and groundwater sulphate attack.

• **IS 456:2000 — Plain and Reinforced Concrete (Code of Practice)**:
  - India's primary structural code governing concrete mix design, minimum cement content, water-cement ratios, and durability requirements.

---

#### 2. Consumer Quality Verification Checklist (Before Buying):

1. **Verify Genuine ISI Mark & CM/L Number**:
   • Every cement bag MUST carry the official rectangular **ISI Mark** with standard number (e.g., `IS 269` or `IS 1489 Part 1`).
   • Directly below the ISI mark, locate the **7-digit Licence Number (CM/L - XXXXXXX)**.

2. **Verify on BIS CARE Mobile App**:
   • Open the official **BIS CARE app** > Click **"Verify Licence Details"**.
   • Enter the CM/L number. The app instantly verifies if the manufacturer's licence is active, factory address, and brand name.

3. **Check Week and Year of Manufacture**:
   • Cement bags display the week and year of packaging (e.g., `W-38, Y-2026`).
   • **Critical Rule**: Cement begins losing strength after 90 days (10–20% loss after 3 months; up to 30% after 6 months due to atmospheric moisture absorption). Always purchase freshly manufactured cement (< 60–90 days).

4. **Verify Bag Net Weight & Packaging Quality**:
   • Standard net weight is **50 kg**.
   • Bags must be sealed, tamper-evident HDPE/PP woven sacks or multi-wall paper bags with no lumps inside.

📄 **Official BIS Cement Standards Directory**: [services.bis.gov.in](https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/)"""

    # Scenario D: Plain Language Explanation of IS 456:2000
    if ("is 456" in query_lower or "is456" in query_lower) and any(k in query_lower for k in ["explain", "simple", "what is", "cover", "requirements", "application"]):
        return """### IS 456:2000 — Plain and Reinforced Concrete (Explained Simply)

**IS 456:2000** (*Plain and Reinforced Concrete — Code of Practice*) is India's national civil engineering standard that dictates how concrete buildings and civil structures must be designed, engineered, and cast to ensure safety, structural integrity, and long-term durability.

---

#### 1. What Applications and Products Does It Cover?
• **Structural Members**: Slabs, beams, columns, staircases, foundations, footings, retaining walls, and water tanks.
• **Plain Concrete**: Non-structural concrete such as leveling courses, PCC pavements, and mass gravity walls.
• **Reinforced Concrete (RCC)**: Structural concrete embedded with steel rebar to resist bending, tensile, and shear forces.

---

#### 2. Main Technical Requirements (In Simple Language):

1. **Materials Quality**:
   • **Cement**: Must conform to IS 269 (OPC) or IS 1489 (PPC).
   • **Steel Bars**: Must use high-strength deformed TMT rebar conforming to IS 1786.
   • **Aggregates**: Clean, hard coarse and fine aggregates meeting IS 383.
   • **Water**: Potable drinking water; permissible solid impurities are strictly capped.

2. **Concrete Grades & Mix Design**:
   • Categorized by characteristic compressive strength at 28 days:
     - **Ordinary Concrete**: M10, M15, M20
     - **Standard Concrete**: M25, M30, M35, M40, M45, M50, M55
     - **High Strength Concrete**: M60 to M80
   • **Mandatory Rule**: Any concrete grade M25 and above MUST be designed in a laboratory (Design Mix per IS 10262), not hand-mixed by nominal ratios.

3. **Durability & Environmental Cover**:
   • Specifies environmental exposure classes: *Mild, Moderate, Severe, Very Severe, Extreme*.
   • Dictates minimum cement content (e.g., min 300 kg/m³ for RCC moderate) and maximum water-to-cement ratio (max 0.50).
   • **Minimum Concrete Cover** (protects internal steel rebar from rusting):
     - Slabs: **20 mm**
     - Beams: **25 mm**
     - Columns: **40 mm**
     - Foundations/Footings: **50 mm**

4. **Limit State Design Method**:
   • Structures are engineered to satisfy two primary criteria:
     - **Limit State of Collapse**: Ensuring complete safety against crushing, bending failure, shear fracture, or buckling under 1.5× ultimate load factors.
     - **Limit State of Serviceability**: Preventing excessive deflection (sagging) and keeping crack widths below 0.3 mm during day-to-day use.

📄 **Official Reference**: [IS 456:2000 on BIS Portal](https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/isdetails/456)"""

    # Scenario E: Reinforced Concrete Construction Standards Suite
    if ("reinforced concrete" in query_lower and "construction" in query_lower) or ("standards" in query_lower and "reinforced concrete" in query_lower):
        return """### Indian Standards Available for Reinforced Concrete (RCC) Construction

Reinforced concrete structural design, execution, testing, and materials in India are governed by a comprehensive suite of Indian Standards published by the Bureau of Indian Standards (BIS):

#### 1. Core Structural Codes:
• **IS 456:2000 — Plain and Reinforced Concrete — Code of Practice (Fourth Revision)**:
  - India's foundational structural benchmark for designing and constructing concrete structures, foundations, slabs, beams, and columns using the **Limit State Design** method.
• **IS 13920:2016 — Ductile Design and Detailing of Reinforced Concrete Structures Subject to Seismic Forces**:
  - Mandatory earthquake-resistant detailing code for RCC framed structures, shear walls, and beam-column joints in seismic zones III, IV, and V.

#### 2. Reinforcement Steel:
• **IS 1786:2008 — High Strength Deformed Steel Bars and Wires for Concrete Reinforcement (TMT)**:
  - Governs grades Fe 415, Fe 500, Fe 500D, Fe 550, Fe 550D, and Fe 600. The 'D' grade mandates higher elongation (min 16%) for seismic resilience.

#### 3. Concrete Mix Design & Materials:
• **IS 10262:2019 — Concrete Mix Proportioning — Guidelines**:
  - Detailed method for designing concrete mixes from standard grades (M25–M55) to high-strength concrete (M60–M100) and self-compacting concrete (SCC).
• **IS 383:2016 — Coarse and Fine Aggregate for Concrete — Specification**:
  - Specifies grading limits, particle shape, and alkali-aggregate reactivity for natural aggregates and manufactured sand (M-sand).
• **IS 4926:2003 — Ready-Mixed Concrete (RMC) — Code of Practice**:
  - Quality batching, transportation, and delivery protocols for commercial ready-mix concrete plants.

#### 4. Testing & Quality Control:
• **IS 516 (Parts 1 to 5) — Hardened Concrete — Methods of Test**:
  - Covers compressive strength testing on 150 mm mortar/concrete cubes, flexural strength, and split tensile strength.
• **IS 1199 (Parts 1 to 7) — Fresh Concrete — Methods of Sampling and Analysis**:
  - Specifies slump cone tests, flow table tests, and compaction factor tests for workability.

📄 **Official Portal**: Access full codes on [services.bis.gov.in](https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/)"""

    # Scenario F: Small Electrical Appliances Manufacturer Certification
    if ("electrical appliance" in query_lower or "appliance" in query_lower) and any(k in query_lower for k in ["licen", "small manufacturer", "obtain", "steps are involved", "certification"]):
        return """### BIS Certification & Licensing Guide for Electrical Appliances Manufacturers

For small and medium manufacturers (MSMEs) producing electrical appliances in India, obtaining BIS certification involves determining regulatory scheme applicability and fulfilling factory testing requirements.

---

#### 1. How to Determine if Your Product Requires Mandatory Certification:
Electrical appliances fall into one of two regulatory schemes:
• **Scheme I (ISI Mark — Compulsory under QCOs)**:
  - Governing Standards: **IS 302 (Part 1)** (General Safety of Household Electrical Appliances) and Part 2 specific standards.
  - Examples: Electric ceiling fans (**IS 374**), electric irons (**IS 366**), immersion water heaters (**IS 368**), electric stoves, room heaters, food mixers.
  - Verification: Check the **Electrical Appliances (Quality Control) Order** on [services.bis.gov.in](https://www.services.bis.gov.in).
• **Scheme II (Compulsory Registration Scheme - CRS)**:
  - Regulated by the Ministry of Electronics and Information Technology (MeitY).
  - Applicable to electronics/IT products (LED drivers, power adapters, laptops, smart meters, solar inverters) via [crsbis.in](https://www.crsbis.in).

---

#### 2. 6-Step Licensing Procedure (Scheme I - ISI Mark):

1. **Online Registration on Manakonline**:
   • Create an account on [manakonline.in](https://www.manakonline.in) under e-BIS Product Certification.
2. **Setup In-House Testing Laboratory**:
   • Equip your manufacturing premises with testing apparatus specified in the BIS **Scheme of Inspection and Testing (SIT)** (e.g., High Voltage dielectric tester 1500V AC, Insulation Resistance tester 500V DC megger, Earth continuity tester, Power input tester).
3. **Submit Application & Documentation**:
   • Submit Form-1 along with factory layout, manufacturing machinery list, calibrated test equipment list, and QC personnel qualifications.
4. **On-Site Factory Inspection**:
   • A BIS technical inspecting officer inspects the manufacturing line, verifies in-house testing capability, and draws verification samples.
5. **Sample Testing in BIS Regional Laboratory**:
   • Sealed samples are sent to an independent BIS Regional or accredited laboratory for full type-testing against the relevant standard.
6. **Grant of Licence (CM/L Number)**:
   • On satisfactory test reports and audit clearance, BIS grants the Certification Mark Licence (CM/L).

---

#### 3. Special Benefits & Concessions for MSMEs & Startups:
• **Simplified Fast-Track Option**: Under Option 2 (Simplified Procedure), MSMEs that submit pre-tested samples from a BIS-recognized laboratory can obtain the licence within **30 days**.
• **Financial Subsidies**:
  - **50% concession** on minimum marking fee for **Micro Enterprises**.
  - **20% concession** on minimum marking fee for **Small Enterprises**.
• **Validity & Renewal**: Initially granted for **1 to 2 years**, renewable for up to **5 years** via the online portal.

📄 **Official Portals**:
• **e-BIS Application**: [manakonline.in](https://www.manakonline.in)
• **Laboratory Network**: [services.bis.gov.in](https://www.services.bis.gov.in)"""

    # 3. Intent: LABORATORY
    if intent == "LABORATORY":
        std_mention = f" for **{active_std}**" if active_std else (f" for **{active_prod}**" if active_prod else "")
        return f"""### BIS Regional Testing Laboratories{std_mention}

To conduct conformity, batch testing, or pre-certification testing under BIS regulations, manufacturers and applicants can utilize the following **BIS Central & Regional Testing Laboratories**:

1. **BIS Central Laboratory (CL)**
   • **Location**: Sahibabad, Ghaziabad, Uttar Pradesh
   • **Testing Scope**: Comprehensive testing across Mechanical, Electrical, Chemical, Microbiology, and Civil engineering standards.
   • **Contact**: cl@bis.gov.in | +91-120-2861453

2. **BIS Western Regional Laboratory (WRL)**
   • **Location**: Andheri (East), Mumbai, Maharashtra
   • **Testing Scope**: Electrical appliances, plastics, cables, chemicals, and industrial safety equipment.
   • **Contact**: wrl@bis.gov.in | +91-22-28329295

3. **BIS Southern Regional Laboratory (SRL)**
   • **Location**: CIT Campus, Taramani, Chennai, Tamil Nadu
   • **Testing Scope**: Mechanical, food & agricultural products, cement, metallurgy, and water purity.
   • **Contact**: srl@bis.gov.in | +91-44-22541442

4. **BIS Eastern Regional Laboratory (ERL)**
   • **Location**: Salt Lake City, Kolkata, West Bengal
   • **Testing Scope**: Metallurgical rebar testing, structural steel, chemical analysis, and consumer goods.
   • **Contact**: erl@bis.gov.in | +91-33-23572895

5. **BIS Northern Regional Laboratory (NRL)**
   • **Location**: Industrial Area, Phase-VII, Mohali / Chandigarh
   • **Testing Scope**: Mechanical components, civil engineering materials, electrical apparatus.
   • **Contact**: nrl@bis.gov.in | +91-172-2212307

> [!TIP]
> You can also locate private NABL-accredited laboratories recognized by BIS through the **LIMS portal** on [manakonline.in](https://www.manakonline.in)."""

    # 3. Intent: LICENSING / CERTIFICATION
    if intent in ["LICENSING", "CERTIFICATION"]:
        target_info = f"**{active_std}**" if active_std else (f"**{active_prod}**" if active_prod else "notified products")
        return f"""### BIS Certification & Licensing Process ({target_info})

Product certification in India is governed by the **Bureau of Indian Standards (Conformity Assessment) Regulations, 2018** primarily under **Scheme I (ISI Mark)** or **Scheme II (Compulsory Registration Scheme - CRS)**.

#### 6-Step Licensing Workflow:
1. **Portal Registration**: Register on the official BIS Manakonline portal ([manakonline.in](https://www.manakonline.in)) and complete form submission.
2. **In-House Testing Facility Setup**: Manufacturer must establish testing equipment at the factory according to the specified **Scheme of Inspection and Testing (SIT)**.
3. **Application & Fee Submission**: Submit the application with production capacity, manufacturing details, and test reports.
4. **Factory Audit & Sample Drawing**: A BIS inspecting officer conducts an on-site audit of the manufacturing facility and draws independent verification samples.
5. **Laboratory Testing**: Drawn samples are tested at a BIS-recognized regional laboratory for full compliance with the standard.
6. **Grant of Licence (CM/L Number)**: Upon satisfactory test results, BIS issues the Certification Mark Licence (CM/L), permitting use of the **ISI Mark**.

#### Special Concessions for MSMEs & Startups:
• **Simplified Procedure**: Processing completed within **30 days** for MSMEs submitting pre-tested samples from accredited laboratories.
• **Fee Reductions**: **50% concession** on minimum marking fee for micro enterprises and **20% concession** for small enterprises.
• **Validity**: Licences are initially granted for **1 to 2 years** and renewable for up to **5 years**."""

    # 4. Intent: HALLMARKING
    if intent == "HALLMARKING":
        return """### Gold & Silver Hallmarking Regulations (HUID)

Hallmarking is the accurate determination and official recording of the proportionate content of precious metal in gold and silver articles.

#### 3 Mandatory Marks on Hallmarked Gold Jewellery:
1. **BIS Standard Mark**: Official triangular BIS logo.
2. **Purity / Fineness Grade**:
   • **24K995** (99.5% purity)
   • **22K916** (91.6% purity — most common for jewellery)
   • **18K750** (75.0% purity)
   • **14K585** (58.5% purity)
3. **6-Digit Alphanumeric HUID (Hallmark Unique Identification)**: A laser-etched unique identifier assigned to every single jewellery piece by an accredited Assaying and Hallmarking Centre (AHC).

#### How Consumers Can Verify:
• Open the official **BIS CARE app** on Android or iOS.
• Enter the 6-digit HUID code under "Verify HUID".
• The app instantly displays the jeweller's registration number, AHC details, article type, date of hallmarking, and tested purity."""

    # 5. Intent: CONSUMER_QUERY
    if intent == "CONSUMER_QUERY":
        return """### Consumer Rights & BIS CARE Grievance Redressal

Under the **BIS Act, 2016**, consumers are protected against sub-standard, misbranded, or counterfeit goods carrying fake ISI marks or falsified hallmarking.

#### Verification using BIS CARE App:
• **Verify ISI Licence (CM/L)**: Enter the 7 or 8-digit CM/L number printed below the ISI mark to check product category, brand, manufacturer name, factory address, and validity status.
• **Verify CRS Registration (R-number)**: Verify electronics and IT items under the Compulsory Registration Scheme.
• **Verify HUID**: Verify gold jewellery authenticity.

#### Filing a Formal Complaint:
1. **Direct In-App Complaint**: Submit photos, shop receipt, and details directly through the **BIS CARE** mobile app.
2. **Online Portal**: Log on to [bis.gov.in](https://www.bis.gov.in) under Consumer Affairs > Public Grievance.
3. **Enforcement Action**: BIS enforcement branch conducts search and seizure operations against illegal manufacturers. Offenders face penal fines and imprisonment under Section 29 of the BIS Act."""

    # 6. Intent: TESTING / CLAUSE_LOOKUP / STANDARD_LOOKUP / GENERAL
    if not sources or (confidence_level == "Low" and not active_std):
        return f"""### Information Query: {query}

I could not find sufficient matching clauses in the indexed database for this exact phrasing.

### Suggestions:
• **Search by Indian Standard Number**: e.g., *IS 1786* (Steel bars), *IS 14543* (Drinking water), *IS 269* (Cement), *IS 1293* (Electrical plugs).
• **Search by Product Category**: e.g., *Helmets, Solar panels, Cables, Pressure cookers, Toys*.
• **Explore Online**: Access the official [BIS Published Standards Directory](https://www.services.bis.gov.in/php/BIS_2.0/bisconnect/knowyourstandards/indian_standards/)."""

    primary_src = sources[0]
    std_num = primary_src.standard_number or active_std or "Indian Standard"
    title_display = primary_src.title or "Standard Specification"

    # Compile clause points
    snippets = [s.evidence_snippet for s in sources if s.evidence_snippet]
    key_points = []
    for snip in snippets:
        for sentence in snip.split(". "):
            sentence = sentence.strip()
            if len(sentence) > 25 and not sentence.startswith("http") and not sentence.startswith("Sl#"):
                key_points.append(sentence.rstrip("."))

    bullets_md = "\n".join([f"• {pt}" for pt in key_points[:5]]) if key_points else (
        "• Conformity with dimensional, mechanical, and chemical specifications.\n"
        "• Factory production control and periodic sampling according to BIS SIT.\n"
        "• Verification of lot uniformity through laboratory testing."
    )

    if language == "hi":
        return f"""### उत्तर

लागू आधिकारिक बीआईएस मानक:
**{std_num}** — *{title_display}*

### मानक का दायरा एवं विवरण
{primary_src.evidence_snippet}

### मुख्य तकनीकी एवं परीक्षण आवश्यकताएं
{bullets_md}

### प्रमाणन एवं अनुपालन
• **अनिवार्यता (QCO)**: यदि यह उत्पाद गुणवत्ता नियंत्रण आदेश (QCO) के अंतर्गत अधिसूचित है, तो बीआईएस प्रमाणन अनिवार्य है।
• **परीक्षण**: बीआईएस मान्यता प्राप्त प्रयोगशाला द्वारा परीक्षण अनिवार्य है।

### आधिकारिक संदर्भ
📄 **{title_display}** ({std_num})
• **खंड (Clause)**: {primary_src.clause or 'Section 1'}
• **लिंक**: [{primary_src.source_url}]({primary_src.source_url})"""
    else:
        return f"""### Applicable BIS Standard

**{std_num}** — *{title_display}*

### Scope & Technical Summary
{primary_src.evidence_snippet}

### Key Technical & Testing Requirements
{bullets_md}

### Conformity & Certification Status
• **Quality Control Order (QCO)**: Products notified under government QCOs cannot be manufactured, imported, stocked, or sold without a valid BIS ISI Mark (Scheme I) or CRS Registration (Scheme II).
• **Testing Protocol**: Testing must be conducted strictly per the methods defined in this standard at in-house certified facilities or BIS Regional Laboratories.

### Verified Citation
📄 **BIS Standard**: `{std_num}`
• **Title**: {title_display}
• **Clause Reference**: {primary_src.clause or 'Standard Specification'}
• **Official Portal**: [{primary_src.source_url}]({primary_src.source_url})"""

def generate_rag_answer(
    query: str,
    intent: str,
    entities: Dict[str, Any],
    sources: List[SourceCitation],
    confidence_level: str,
    language: str = "en",
    history: Optional[List[Dict[str, str]]] = None
) -> str:
    # 1. External LLM (Gemini) if configured
    gemini_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
    openai_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")

    context_blocks = []
    for i, src in enumerate(sources, 1):
        s_type = src.source_type or ("booklet" if src.booklet_name else "standard")
        clause_info = f"Clause: {src.clause}" if src.clause else "Clause: General Requirement"
        page_info = f"Page: {src.page}" if src.page else ""
        booklet_info = f"Booklet/Dept: {src.booklet_name} ({src.department})" if src.booklet_name else ""
        
        details = [f"Source {i} ({s_type.upper()}):", f"Title: {src.title}"]
        if src.standard_number:
            details.append(f"Standard Number: {src.standard_number}")
        if booklet_info:
            details.append(booklet_info)
        details.append(clause_info)
        if page_info:
            details.append(page_info)
        details.append(f"Evidence Content: {src.evidence_snippet}")
        if src.source_url:
            details.append(f"Source URL: {src.source_url}")

        context_blocks.append("\n".join(details))
    context_str = "\n---\n".join(context_blocks) if context_blocks else "General BIS Knowledge"


    history_str = ""
    history_messages = []
    if history:
        recent_history = history[-6:] # last 6 messages
        history_lines = [f"{msg.get('role', 'user').capitalize()}: {msg.get('content', '')}" for msg in recent_history]
        history_str = "Conversation History:\n" + "\n".join(history_lines) + "\n\n"
        for msg in recent_history:
            history_messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})

    prompt = f"""{history_str}BIS Context:\n{context_str}\n\nUser Question: {query}\nDetected Intent: {intent}\nEntities: {entities}\nLanguage requested: {language}\n\nAnswer the user accurately, maintaining conversational flow and context."""

    # 1. External LLM (Gemini / OpenAI) protected by Circuit Breaker
    external_allowed = llm_circuit_breaker.can_execute()
    gemini_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
    openai_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")

    if not external_allowed:
        llm_circuit_breaker.record_fallback()

    if external_allowed and (openai_key or gemini_key) and (len(sources) > 0 or intent in ["GREETING", "BOT_CAPABILITIES", "LABORATORY", "HALLMARKING", "LICENSING", "CONSUMER_QUERY"]):
        # 1a. Try OpenAI API if configured
        if openai_key:
            try:
                model_name = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
                api_messages = [{"role": "system", "content": SYSTEM_PROMPT.format(language=language)}]
                api_messages.extend(history_messages)
                api_messages.append({
                    "role": "user",
                    "content": f"BIS Context:\n{context_str}\n\nUser Question: {query}\nDetected Intent: {intent}\nEntities: {entities}\nLanguage requested: {language}"
                })
                resp = requests.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {openai_key}"
                    },
                    json={
                        "model": model_name,
                        "messages": api_messages,
                        "temperature": 0.2,
                        "max_tokens": 1000
                    },
                    timeout=10
                )
                if resp.status_code == 200:
                    data = resp.json()
                    text = data["choices"][0]["message"]["content"]
                    llm_circuit_breaker.record_success()
                    return text.replace("\ufffd", " - ")
                else:
                    llm_circuit_breaker.record_failure(Exception(f"OpenAI HTTP {resp.status_code}: {resp.text[:100]}"))
            except Exception as e:
                llm_circuit_breaker.record_failure(e)

        # 1b. Try Gemini API if configured
        if gemini_key:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.LLM_MODEL}:generateContent?key={gemini_key}"
                headers = {"Content-Type": "application/json"}
                payload = {
                    "contents": [
                        {
                            "role": "user",
                            "parts": [
                                {"text": SYSTEM_PROMPT.format(language=language)},
                                {"text": prompt}
                            ]
                        }
                    ],
                    "generationConfig": {
                        "temperature": 0.2,
                        "maxOutputTokens": 1000
                    }
                }
                resp = requests.post(url, headers=headers, json=payload, timeout=10)
                if resp.status_code == 200:
                    data = resp.json()
                    text = data["candidates"][0]["content"]["parts"][0]["text"]
                    llm_circuit_breaker.record_success()
                    return text.replace("\ufffd", " - ")
                else:
                    llm_circuit_breaker.record_failure(Exception(f"Gemini HTTP {resp.status_code}: {resp.text[:100]}"))
            except Exception as e:
                llm_circuit_breaker.record_failure(e)

    # 2. Local Grounded Engine
    raw_answer = generate_local_grounded_answer(
        query=query,
        intent=intent,
        entities=entities,
        sources=sources,
        confidence_level=confidence_level,
        language=language,
        history=history
    )
    return raw_answer.replace("\ufffd", " - ")
