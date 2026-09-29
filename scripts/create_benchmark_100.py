import json
import os

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
OUTPUT_FILE = os.path.join(DATA_DIR, "benchmark_100_questions.json")

BENCHMARK_100 = [
    # 1. Domestic Appliances & Kitchenware (1-10)
    {
        "id": 1,
        "query": "I manufacture pressure cookers for domestic use. I want to know which Indian Standard applies to my product, whether BIS certification is mandatory, and what testing requirements I need to follow. Please provide the relevant IS number and official source.",
        "persona": "Manufacturer",
        "category": "Kitchenware",
        "intent": "CERTIFICATION",
        "expected_standard": "IS 2347:2023",
        "product": "Pressure Cooker",
        "is_mandatory": True,
        "key_facts": ["IS 2347", "Domestic Pressure Cooker QCO 2020", "Scheme I ISI mark", "proof pressure 2.0 kgf/cm2", "burst pressure 3.0 kgf/cm2"]
    },
    {
        "id": 2,
        "query": "Which Indian Standard specifies safety requirements for domestic gas stoves using LPG?",
        "persona": "Manufacturer",
        "category": "Kitchenware",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 4246",
        "product": "Gas Stove",
        "is_mandatory": True,
        "key_facts": ["IS 4246", "Domestic Gas Stoves for use with LPG", "thermal efficiency", "gas leakage test"]
    },
    {
        "id": 3,
        "query": "What is the BIS standard and testing protocol for electric ceiling fans?",
        "persona": "Manufacturer",
        "category": "Electrical Appliances",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 374:2019",
        "product": "Electric Fan",
        "is_mandatory": True,
        "key_facts": ["IS 374", "air delivery min 210 m3/min", "service value", "dielectric 1500V"]
    },
    {
        "id": 4,
        "query": "Are electric immersion water heaters covered under mandatory BIS certification in India?",
        "persona": "Manufacturer",
        "category": "Electrical Appliances",
        "intent": "CERTIFICATION",
        "expected_standard": "IS 368",
        "product": "Immersion Water Heater",
        "is_mandatory": True,
        "key_facts": ["IS 368", "mandatory ISI mark", "Electrical Appliances QCO", "leakage current test"]
    },
    {
        "id": 5,
        "query": "Which standard applies to electric dry and steam irons for household use?",
        "persona": "Manufacturer",
        "category": "Electrical Appliances",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 366",
        "product": "Electric Iron",
        "is_mandatory": True,
        "key_facts": ["IS 366", "Electric Irons specification", "soleplate temperature", "thermostat cycle"]
    },
    {
        "id": 6,
        "query": "What are the safety requirements for electric food mixers and grinders under BIS?",
        "persona": "Manufacturer",
        "category": "Electrical Appliances",
        "intent": "PRODUCT_REQUIREMENTS",
        "expected_standard": "IS 4250",
        "product": "Mixer Grinder",
        "is_mandatory": True,
        "key_facts": ["IS 4250", "Domestic electric food mixer", "interlock safety", "overload protector"]
    },
    {
        "id": 7,
        "query": "Which standard covers general safety for household electrical appliances in India?",
        "persona": "Engineer",
        "category": "Electrical Appliances",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 302 (Part 1)",
        "product": "Electrical Appliances",
        "is_mandatory": True,
        "key_facts": ["IS 302 Part 1", "General requirements for safety of household electrical appliances"]
    },
    {
        "id": 8,
        "query": "What standard applies to commercial electric cooking ranges, ovens, and hobs?",
        "persona": "Manufacturer",
        "category": "Kitchenware",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 302 (Part 2/Sec 36)",
        "product": "Commercial Cooking Range",
        "is_mandatory": True,
        "key_facts": ["IS 302 Part 2 Sec 36", "commercial cooking ranges and ovens"]
    },
    {
        "id": 9,
        "query": "What testing requirements apply to domestic microwave ovens under BIS?",
        "persona": "Lab Technician",
        "category": "Electrical Appliances",
        "intent": "TESTING",
        "expected_standard": "IS 302 (Part 2/Sec 25)",
        "product": "Microwave Oven",
        "is_mandatory": True,
        "key_facts": ["IS 302 Part 2 Sec 25", "microwave leakage radiation", "interlock door switch"]
    },
    {
        "id": 10,
        "query": "What BIS standard specifies requirements for rubber gaskets used in pressure cookers?",
        "persona": "Manufacturer",
        "category": "Kitchenware",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 7466",
        "product": "Rubber Gasket",
        "is_mandatory": False,
        "key_facts": ["IS 7466", "Rubber Gasket for Pressure Cooker", "food grade rubber", "aging test"]
    },

    # 2. Civil, Building & Construction Materials (11-22)
    {
        "id": 11,
        "query": "I want to buy a cement product for house construction. Which BIS standards should I check to make sure the product meets the required quality standards?",
        "persona": "Consumer",
        "category": "Civil & Construction",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 269:2015",
        "product": "Cement",
        "is_mandatory": True,
        "key_facts": ["IS 269", "IS 1489 PPC", "IS 455 PSC", "check ISI mark", "CM/L number on BIS CARE app", "freshness < 90 days"]
    },
    {
        "id": 12,
        "query": "Please explain IS 456:2000 in simple language. What products or applications does it cover, and what are its main requirements?",
        "persona": "Student/Engineer",
        "category": "Civil & Construction",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 456:2000",
        "product": "Concrete",
        "is_mandatory": False,
        "key_facts": ["IS 456:2000", "Plain and reinforced concrete code of practice", "M10 to M80 grades", "durability cover", "Limit State Design"]
    },
    {
        "id": 13,
        "query": "What Indian Standards are available for reinforced concrete construction?",
        "persona": "Engineer",
        "category": "Civil & Construction",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 456:2000",
        "product": "Concrete",
        "is_mandatory": False,
        "key_facts": ["IS 456:2000", "IS 1786 rebar", "IS 10262 mix proportioning", "IS 13920 seismic detailing", "IS 4926 RMC"]
    },
    {
        "id": 14,
        "query": "What are the chemical composition limits for Fe 500D grade TMT steel bars under IS 1786?",
        "persona": "Engineer",
        "category": "Civil & Construction",
        "intent": "TESTING",
        "expected_standard": "IS 1786:2008",
        "product": "Steel Rebar",
        "is_mandatory": True,
        "key_facts": ["IS 1786:2008", "Clause 4", "Carbon max 0.25%", "Sulphur max 0.040%", "Phosphorus max 0.040%", "CE max 0.42%"]
    },
    {
        "id": 15,
        "query": "What is the minimum elongation percentage required for Fe 500D steel rebar under IS 1786?",
        "persona": "Lab Technician",
        "category": "Civil & Construction",
        "intent": "TESTING",
        "expected_standard": "IS 1786:2008",
        "product": "Steel Rebar",
        "is_mandatory": True,
        "key_facts": ["IS 1786:2008", "Clause 7", "16.0% minimum elongation", "tensile ratio min 1.10"]
    },
    {
        "id": 16,
        "query": "Which Indian Standard provides guidelines for concrete mix design proportioning?",
        "persona": "Engineer",
        "category": "Civil & Construction",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 10262:2019",
        "product": "Concrete",
        "is_mandatory": False,
        "key_facts": ["IS 10262:2019", "Concrete Mix Proportioning Guidelines", "target strength", "water-cement ratio"]
    },
    {
        "id": 17,
        "query": "Which code governs ductile detailing of reinforced concrete structures for earthquake resistance?",
        "persona": "Engineer",
        "category": "Civil & Construction",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 13920:2016",
        "product": "Concrete",
        "is_mandatory": False,
        "key_facts": ["IS 13920:2016", "Ductile design and detailing", "seismic forces", "beam-column joints"]
    },
    {
        "id": 18,
        "query": "What Indian Standard specifies coarse and fine aggregates from natural sources for concrete?",
        "persona": "Engineer",
        "category": "Civil & Construction",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 383:2016",
        "product": "Concrete",
        "is_mandatory": False,
        "key_facts": ["IS 383:2016", "Coarse and fine aggregate specification", "M-sand", "flakiness index"]
    },
    {
        "id": 19,
        "query": "What standard governs Ready-Mixed Concrete (RMC) plants in India?",
        "persona": "Manufacturer",
        "category": "Civil & Construction",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 4926:2003",
        "product": "Concrete",
        "is_mandatory": False,
        "key_facts": ["IS 4926:2003", "Ready-Mixed Concrete Code of Practice", "batching accuracy", "transit mixers"]
    },
    {
        "id": 20,
        "query": "What is the standard compressive strength test method for hardened concrete cubes?",
        "persona": "Lab Technician",
        "category": "Civil & Construction",
        "intent": "TESTING",
        "expected_standard": "IS 516",
        "product": "Concrete",
        "is_mandatory": False,
        "key_facts": ["IS 516", "150 mm cube compressive strength", "loading rate", "7-day and 28-day testing"]
    },
    {
        "id": 21,
        "query": "Which Indian Standard covers transparent float glass used in building windows?",
        "persona": "Manufacturer",
        "category": "Civil & Construction",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 14900:2026",
        "product": "Glass",
        "is_mandatory": False,
        "key_facts": ["IS 14900", "Transparent float glass specification"]
    },
    {
        "id": 22,
        "query": "What standard applies to unplasticized PVC profiles for framed doors and windows?",
        "persona": "Manufacturer",
        "category": "Civil & Construction",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 19609:2026",
        "product": "uPVC Profiles",
        "is_mandatory": False,
        "key_facts": ["IS 19609", "uPVC Profiles Framed Doors Windows and sliders"]
    },

    # 3. Consumer Goods, Safety & Personal Protection (23-32)
    {
        "id": 23,
        "query": "What is the mandatory Indian Standard for motorcycle and two-wheeler protective helmets?",
        "persona": "Consumer",
        "category": "Safety Equipment",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 4151:2020",
        "product": "Helmet",
        "is_mandatory": True,
        "key_facts": ["IS 4151:2020", "MoRTH Helmet QCO", "mandatory ISI mark", "max weight 1.2 kg", "impact attenuation test"]
    },
    {
        "id": 24,
        "query": "What tests are conducted on protective helmets to ensure impact absorption under IS 4151?",
        "persona": "Lab Technician",
        "category": "Safety Equipment",
        "intent": "TESTING",
        "expected_standard": "IS 4151:2020",
        "product": "Helmet",
        "is_mandatory": True,
        "key_facts": ["Clause 5.2", "drop velocity 7.5 m/s", "peak acceleration under 300g", "flat and kerbstone anvils"]
    },
    {
        "id": 25,
        "query": "Which Indian Standard specifies mechanical safety and heavy metal limits for children's toys?",
        "persona": "Manufacturer",
        "category": "Toys",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 9873 (Part 1):2019",
        "product": "Toys",
        "is_mandatory": True,
        "key_facts": ["IS 9873", "Toys QCO by DPIIT", "small parts cylinder test", "heavy metal migration limits"]
    },
    {
        "id": 26,
        "query": "What are the migration limits for toxic heavy metals like Lead and Cadmium in toys under IS 9873?",
        "persona": "Lab Technician",
        "category": "Toys",
        "intent": "TESTING",
        "expected_standard": "IS 9873 (Part 3)",
        "product": "Toys",
        "is_mandatory": True,
        "key_facts": ["Lead max 90 mg/kg", "Cadmium max 75 mg/kg", "Mercury max 60 mg/kg", "Arsenic max 25 mg/kg"]
    },
    {
        "id": 27,
        "query": "What Indian Standard applies to packaged drinking water (other than natural mineral water)?",
        "persona": "Manufacturer",
        "category": "Food & Beverage",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 14543:2024",
        "product": "Packaged Drinking Water",
        "is_mandatory": True,
        "key_facts": ["IS 14543:2024", "mandatory ISI mark", "TDS 75 to 500 mg/l", "microbiological limits E. coli 0/250ml"]
    },
    {
        "id": 28,
        "query": "What microbiological test parameters are mandatory for packaged drinking water under IS 14543?",
        "persona": "Lab Technician",
        "category": "Food & Beverage",
        "intent": "TESTING",
        "expected_standard": "IS 14543:2024",
        "product": "Packaged Drinking Water",
        "is_mandatory": True,
        "key_facts": ["E. coli nil in 250ml", "Coliform nil in 250ml", "Faecal streptococci nil", "total viable count max 100 CFU/ml"]
    },
    {
        "id": 29,
        "query": "Which standard specifies natural mineral water in India?",
        "persona": "Consumer",
        "category": "Food & Beverage",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 13428",
        "product": "Mineral Water",
        "is_mandatory": True,
        "key_facts": ["IS 13428", "Packaged Natural Mineral Water", "mandatory certification"]
    },
    {
        "id": 30,
        "query": "What standard governs surgical face masks and medical PPE masks under BIS?",
        "persona": "Manufacturer",
        "category": "Medical Equipment",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 16289:2014",
        "product": "Medical Mask",
        "is_mandatory": False,
        "key_facts": ["IS 16289", "Medical face masks", "bacterial filtration efficiency (BFE)", "differential pressure"]
    },
    {
        "id": 31,
        "query": "Which Indian Standard specifies portable fire extinguishers of ABC dry powder type?",
        "persona": "Safety Officer",
        "category": "Safety Equipment",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 15683",
        "product": "Fire Extinguisher",
        "is_mandatory": True,
        "key_facts": ["IS 15683", "Portable fire extinguishers performance and construction", "fire rating"]
    },
    {
        "id": 32,
        "query": "What is the standard for safety footwear and industrial protective shoes?",
        "persona": "Safety Officer",
        "category": "Safety Equipment",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 15298",
        "product": "Safety Shoes",
        "is_mandatory": True,
        "key_facts": ["IS 15298", "Footwear QCO", "steel toe cap 200J impact resistance"]
    },

    # 4. Precious Metals, Gold Hallmarking & HUID (33-40)
    {
        "id": 33,
        "query": "What are the official purity grades recognized for gold jewellery hallmarking in India?",
        "persona": "Consumer",
        "category": "Hallmarking",
        "intent": "HALLMARKING",
        "expected_standard": "IS 1417:2016",
        "product": "Gold Hallmarking",
        "is_mandatory": True,
        "key_facts": ["IS 1417:2016", "24K995", "22K916", "20K833", "18K750", "14K585"]
    },
    {
        "id": 34,
        "query": "What three marks must be present on genuine hallmarked gold jewellery in India?",
        "persona": "Consumer",
        "category": "Hallmarking",
        "intent": "HALLMARKING",
        "expected_standard": "IS 1417:2016",
        "product": "Gold Hallmarking",
        "is_mandatory": True,
        "key_facts": ["BIS triangular logo", "Purity/Fineness grade (e.g. 22K916)", "6-digit alphanumeric HUID"]
    },
    {
        "id": 35,
        "query": "How can a consumer verify the authenticity of a 6-digit HUID number on gold jewellery?",
        "persona": "Consumer",
        "category": "Hallmarking",
        "intent": "CONSUMER_QUERY",
        "expected_standard": "IS 1417:2016",
        "product": "Gold Hallmarking",
        "is_mandatory": True,
        "key_facts": ["BIS CARE Mobile App", "Verify HUID option", "displays jeweler name, AHC centre, hallmarking date, tested purity"]
    },
    {
        "id": 36,
        "query": "Which standard specifies silver and silver alloy jewellery hallmarking?",
        "persona": "Jeweler",
        "category": "Hallmarking",
        "intent": "HALLMARKING",
        "expected_standard": "IS 2112",
        "product": "Silver Hallmarking",
        "is_mandatory": False,
        "key_facts": ["IS 2112", "Silver hallmarking fineness", "990, 970, 925, 900, 835, 800"]
    },
    {
        "id": 37,
        "query": "What is the procedure for an Assaying and Hallmarking Centre (AHC) to obtain BIS recognition?",
        "persona": "Lab Technician",
        "category": "Hallmarking",
        "intent": "HALLMARKING",
        "expected_standard": "IS 15820",
        "product": "Gold Hallmarking",
        "is_mandatory": True,
        "key_facts": ["IS 15820", "fire assay method", "XRF spectrometry", "laser engraving machine"]
    },
    {
        "id": 38,
        "query": "Is gold hallmarking mandatory across all districts in India?",
        "persona": "Jeweler",
        "category": "Hallmarking",
        "intent": "HALLMARKING",
        "expected_standard": "IS 1417:2016",
        "product": "Gold Hallmarking",
        "is_mandatory": True,
        "key_facts": ["Mandatory hallmarking notified in phased manner across 340+ districts", "6-digit HUID mandatory"]
    },
    {
        "id": 39,
        "query": "What assaying method is used as the referee test for gold purity under BIS?",
        "persona": "Lab Technician",
        "category": "Hallmarking",
        "intent": "TESTING",
        "expected_standard": "IS 1418",
        "product": "Gold Hallmarking",
        "is_mandatory": True,
        "key_facts": ["IS 1418", "Fire Assay / Cupellation method", "accuracy within +/- 0.5 parts per thousand"]
    },
    {
        "id": 40,
        "query": "What are the penalties if a jeweler sells non-hallmarked or sub-standard gold in mandatory districts?",
        "persona": "Jeweler",
        "category": "Hallmarking",
        "intent": "HALLMARKING",
        "expected_standard": "IS 1417:2016",
        "product": "Gold Hallmarking",
        "is_mandatory": True,
        "key_facts": ["Section 29 BIS Act", "fine minimum 1 lakh up to 5 times value", "imprisonment up to 1 year"]
    },

    # 5. Electronics, IT & Solar CRS Scheme II (41-50)
    {
        "id": 41,
        "query": "What is the Compulsory Registration Scheme (CRS) for electronics and IT goods?",
        "persona": "Manufacturer",
        "category": "Electronics CRS",
        "intent": "CERTIFICATION",
        "expected_standard": "Scheme II (CRS)",
        "product": "Electronics CRS",
        "is_mandatory": True,
        "key_facts": ["Scheme II of BIS Conformity Assessment", "regulated under MeitY orders", "R-number", "Self-Declaration of Conformity"]
    },
    {
        "id": 42,
        "query": "Which safety standard applies to mobile phones and laptops under BIS CRS?",
        "persona": "Manufacturer",
        "category": "Electronics CRS",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 13252 (Part 1)",
        "product": "Mobile Phones",
        "is_mandatory": True,
        "key_facts": ["IS 13252 Part 1", "Information Technology Equipment Safety", "IEC 60950 equivalent"]
    },
    {
        "id": 43,
        "query": "What Indian Standard covers safety testing for Lithium-ion batteries and secondary cells?",
        "persona": "Manufacturer",
        "category": "Electronics CRS",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 16046 (Part 2)",
        "product": "Batteries",
        "is_mandatory": True,
        "key_facts": ["IS 16046 Part 2", "Secondary cells and batteries containing alkaline", "lithium systems"]
    },
    {
        "id": 44,
        "query": "What tests are performed on lithium-ion batteries under IS 16046?",
        "persona": "Lab Technician",
        "category": "Electronics CRS",
        "intent": "TESTING",
        "expected_standard": "IS 16046 (Part 2)",
        "product": "Batteries",
        "is_mandatory": True,
        "key_facts": ["continuous charging", "external short circuit", "thermal abuse test", "crush test", "overcharge test"]
    },
    {
        "id": 45,
        "query": "Which standard applies to self-ballasted LED lamps for general lighting services?",
        "persona": "Manufacturer",
        "category": "Electronics CRS",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 16102 (Part 1)",
        "product": "LED Lamps",
        "is_mandatory": True,
        "key_facts": ["IS 16102 Part 1", "Self-ballasted LED lamps safety requirements", "CRS registration"]
    },
    {
        "id": 46,
        "query": "What standard governs design qualification and type approval for crystalline silicon terrestrial photovoltaic (PV) modules?",
        "persona": "Manufacturer",
        "category": "Solar Energy",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 14286",
        "product": "Solar PV",
        "is_mandatory": True,
        "key_facts": ["IS 14286", "IEC 61215 equivalent", "MNRE solar mandatory order", "thermal cycling", "damp heat test"]
    },
    {
        "id": 47,
        "query": "What is the difference between Scheme I (ISI Mark) and Scheme II (CRS)?",
        "persona": "Manufacturer",
        "category": "Certification",
        "intent": "CERTIFICATION",
        "expected_standard": "Scheme I & II",
        "product": "Certification",
        "is_mandatory": True,
        "key_facts": ["Scheme I has factory audit, SIT, and ISI mark with CM/L number", "Scheme II is self-declaration of conformity based on lab test reports with R-number"]
    },
    {
        "id": 48,
        "query": "Which standard specifies power adapters and chargers for IT equipment?",
        "persona": "Manufacturer",
        "category": "Electronics CRS",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 13252 (Part 1)",
        "product": "Power Adapter",
        "is_mandatory": True,
        "key_facts": ["IS 13252 Part 1", "power adapters safety", "electric shock protection"]
    },
    {
        "id": 49,
        "query": "Are Smart Televisions and LED displays required to have BIS CRS registration?",
        "persona": "Importer",
        "category": "Electronics CRS",
        "intent": "CERTIFICATION",
        "expected_standard": "IS 616",
        "product": "Television",
        "is_mandatory": True,
        "key_facts": ["IS 616", "Audio video and similar electronic apparatus safety", "mandatory CRS under MeitY"]
    },
    {
        "id": 50,
        "query": "What standard covers electronic utility energy meters (smart meters)?",
        "persona": "Manufacturer",
        "category": "Electrical",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 16444",
        "product": "Smart Meter",
        "is_mandatory": True,
        "key_facts": ["IS 16444", "AC static direct connected smart meter", "Scheme I ISI mark"]
    },

    # 6. Electrical Cables, Transformers & Industrial Equipment (51-60)
    {
        "id": 51,
        "query": "What Indian Standard covers PVC insulated unsheathed and sheathed electrical wires and cables for working voltages up to 1100V?",
        "persona": "Manufacturer",
        "category": "Electrical",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 694:2010",
        "product": "Cables",
        "is_mandatory": True,
        "key_facts": ["IS 694:2010", "PVC insulated cables up to 1100V", "conductor resistance test", "spark test", "insulation resistance"]
    },
    {
        "id": 52,
        "query": "What are the routine tests required for household wiring cables under IS 694?",
        "persona": "Lab Technician",
        "category": "Electrical",
        "intent": "TESTING",
        "expected_standard": "IS 694:2010",
        "product": "Cables",
        "is_mandatory": True,
        "key_facts": ["conductor resistance test", "high voltage test in water", "spark testing"]
    },
    {
        "id": 53,
        "query": "Which Indian Standard specifies energy efficiency ratings and specifications for outdoor distribution transformers up to 2500 kVA?",
        "persona": "Manufacturer",
        "category": "Electrical",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 1180 (Part 1)",
        "product": "Transformer",
        "is_mandatory": True,
        "key_facts": ["IS 1180 Part 1", "Distribution transformers", "mandatory QCO", "total losses limits"]
    },
    {
        "id": 54,
        "query": "What standard governs three-phase induction motors energy efficiency in India?",
        "persona": "Manufacturer",
        "category": "Electrical",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 12615",
        "product": "Electric Motor",
        "is_mandatory": True,
        "key_facts": ["IS 12615", "Energy efficient induction motors", "IE2 and IE3 efficiency classes"]
    },
    {
        "id": 55,
        "query": "What Indian Standard specifies miniature circuit breakers (MCBs) for household installations?",
        "persona": "Engineer",
        "category": "Electrical",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS/IEC 60898",
        "product": "Circuit Breaker",
        "is_mandatory": True,
        "key_facts": ["IS/IEC 60898", "Circuit breakers for overcurrent protection", "breaking capacity test 10kA"]
    },
    {
        "id": 56,
        "query": "Which standard governs switches for domestic and similar fixed electrical installations?",
        "persona": "Manufacturer",
        "category": "Electrical",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 3854",
        "product": "Electrical Switch",
        "is_mandatory": True,
        "key_facts": ["IS 3854", "Switches for domestic use", "endurance test 40000 operations", "temperature rise test"]
    },
    {
        "id": 57,
        "query": "What standard applies to three-pin plugs and socket outlets for domestic use?",
        "persona": "Consumer",
        "category": "Electrical",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 1293",
        "product": "Plugs and Sockets",
        "is_mandatory": True,
        "key_facts": ["IS 1293", "Plugs and socket-outlets rated up to 16A", "mandatory ISI mark", "shutter safety"]
    },
    {
        "id": 58,
        "query": "What standard applies to Cross-linked Polyethylene (XLPE) insulated power cables for voltages from 3.3 kV up to 33 kV?",
        "persona": "Engineer",
        "category": "Electrical",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 7098 (Part 2)",
        "product": "Cables",
        "is_mandatory": True,
        "key_facts": ["IS 7098 Part 2", "XLPE insulated cables 3.3kV to 33kV", "partial discharge test"]
    },
    {
        "id": 59,
        "query": "What standard governs welded low carbon steel gas cylinders for low pressure liquefiable gases (LPG cylinders)?",
        "persona": "Manufacturer",
        "category": "Mechanical",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 3196",
        "product": "LPG Cylinder",
        "is_mandatory": True,
        "key_facts": ["IS 3196 Part 1", "Welded low carbon steel gas cylinders for LPG", "PESO and BIS mandatory"]
    },
    {
        "id": 60,
        "query": "What standard specifies rubber hoses for liquefied petroleum gas (LPG) domestic use (Suraksha hose)?",
        "persona": "Consumer",
        "category": "Mechanical",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 9573",
        "product": "LPG Hose",
        "is_mandatory": True,
        "key_facts": ["IS 9573", "Rubber hoses for LPG", "flame resistance", "burst pressure test"]
    },

    # 7. Food, Beverages & Agriculture (61-70)
    {
        "id": 61,
        "query": "Which standard specifies multi-crop power threshers specifications and safety requirements?",
        "persona": "Farmer/Manufacturer",
        "category": "Food & Agriculture",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 11691:2026",
        "product": "Thresher",
        "is_mandatory": False,
        "key_facts": ["IS 11691", "Multi-crop thresher specification", "feeding chute safety"]
    },
    {
        "id": 62,
        "query": "What standard covers Sugarcane Juice Extractors specifications and test codes?",
        "persona": "Manufacturer",
        "category": "Food & Agriculture",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 1973:2026",
        "product": "Sugarcane Extractor",
        "is_mandatory": False,
        "key_facts": ["IS 1973:2026", "Sugarcane Juice Extractor specification and test code"]
    },
    {
        "id": 63,
        "query": "What standard governs infant milk food and follow-up formula in India?",
        "persona": "Consumer",
        "category": "Food & Agriculture",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 14433",
        "product": "Infant Food",
        "is_mandatory": True,
        "key_facts": ["IS 14433", "Infant milk food", "mandatory ISI certification under FSSAI regulations"]
    },
    {
        "id": 64,
        "query": "Which standard specifies sampling and test methods for chemical fertilizers?",
        "persona": "Lab Technician",
        "category": "Food & Agriculture",
        "intent": "TESTING",
        "expected_standard": "IS 6092 (Part 6):2026",
        "product": "Fertilizer",
        "is_mandatory": False,
        "key_facts": ["IS 6092 Part 6", "Methods of sampling and test for fertilizers moisture and impurities"]
    },
    {
        "id": 65,
        "query": "What is the standard for square tin containers used for packaging ghee, vanaspati, and edible oils?",
        "persona": "Manufacturer",
        "category": "Food & Agriculture",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 10325:2026",
        "product": "Tin Container",
        "is_mandatory": False,
        "key_facts": ["IS 10325:2026", "Square tins of 15 kg or 15 litre capacity for edible oils"]
    },
    {
        "id": 66,
        "query": "What standard governs fortified rice kernels (FRK) used in public distribution?",
        "persona": "Miller",
        "category": "Food & Agriculture",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 17782",
        "product": "Fortified Rice",
        "is_mandatory": True,
        "key_facts": ["IS 17782", "Fortified Rice Kernels specification", "iron, folic acid, vitamin B12"]
    },
    {
        "id": 67,
        "query": "What standard governs cattle feed and compounded livestock feeds in India?",
        "persona": "Manufacturer",
        "category": "Food & Agriculture",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 2052",
        "product": "Cattle Feed",
        "is_mandatory": False,
        "key_facts": ["IS 2052", "Compounded feeds for cattle", "crude protein min 20%", "aflatoxin limits"]
    },
    {
        "id": 68,
        "query": "What standard specifies plastic containers used for packaging drinking water?",
        "persona": "Manufacturer",
        "category": "Food & Agriculture",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 15410",
        "product": "Plastic Container",
        "is_mandatory": True,
        "key_facts": ["IS 15410", "PET and PC containers for packaged drinking water", "overall migration test"]
    },
    {
        "id": 69,
        "query": "What standard specifies black tea requirements in India?",
        "persona": "Consumer",
        "category": "Food & Agriculture",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 3633",
        "product": "Tea",
        "is_mandatory": False,
        "key_facts": ["IS 3633", "Black tea specification", "water soluble extract min 32%"]
    },
    {
        "id": 70,
        "query": "What standard specifies iodized salt for direct human consumption?",
        "persona": "Consumer",
        "category": "Food & Agriculture",
        "intent": "STANDARD_LOOKUP",
        "expected_standard": "IS 7224",
        "product": "Iodized Salt",
        "is_mandatory": True,
        "key_facts": ["IS 7224", "Iodized salt specification", "iodine content min 15 ppm at retail level"]
    },

    # 8. Regulatory QCOs, Mandatory Certification & Legal Compliance (71-80)
    {
        "id": 71,
        "query": "I manufacture a product that falls under an Indian Standard. How can I check whether a Quality Control Order makes compliance with that standard mandatory?",
        "persona": "Manufacturer",
        "category": "Regulatory",
        "intent": "CERTIFICATION",
        "expected_standard": "Section 16 BIS Act",
        "product": "QCO",
        "is_mandatory": True,
        "key_facts": ["Section 16 BIS Act 2016", "services.bis.gov.in mandatory products portal", "manakonline know your standards", "egazette notifications", "BIS CARE app"]
    },
    {
        "id": 72,
        "query": "Under which section of the BIS Act 2016 does the government issue Quality Control Orders?",
        "persona": "Officer",
        "category": "Regulatory",
        "intent": "CERTIFICATION",
        "expected_standard": "Section 16 BIS Act",
        "product": "QCO",
        "is_mandatory": True,
        "key_facts": ["Section 16 of BIS Act, 2016", "central government line ministries power to mandate standard mark"]
    },
    {
        "id": 73,
        "query": "What are the legal penalties under Section 29 of the BIS Act 2016 for violating a mandatory QCO?",
        "persona": "Legal Officer",
        "category": "Regulatory",
        "intent": "CERTIFICATION",
        "expected_standard": "Section 29 BIS Act",
        "product": "QCO",
        "is_mandatory": True,
        "key_facts": ["imprisonment up to 2 years", "fine min Rs. 2 lakh up to 10 times value of goods", "confiscation of non-compliant stock"]
    },
    {
        "id": 74,
        "query": "Can imported goods enter India without a BIS licence if the product is under a mandatory QCO?",
        "persona": "Importer",
        "category": "Regulatory",
        "intent": "CERTIFICATION",
        "expected_standard": "FMCS & QCO",
        "product": "Import",
        "is_mandatory": True,
        "key_facts": ["Strictly prohibited", "customs will detain shipment without valid BIS licence (FMCS / ISI Mark)", "DGFT import policy"]
    },
    {
        "id": 75,
        "query": "Which ministry notifies QCOs for toys, pressure cookers, and leather footwear?",
        "persona": "Manufacturer",
        "category": "Regulatory",
        "intent": "CERTIFICATION",
        "expected_standard": "DPIIT",
        "product": "QCO",
        "is_mandatory": True,
        "key_facts": ["DPIIT (Department for Promotion of Industry and Internal Trade)", "Ministry of Commerce and Industry"]
    },
    {
        "id": 76,
        "query": "Which ministry notifies QCOs for steel rebar, structural steel, and steel pipes?",
        "persona": "Manufacturer",
        "category": "Regulatory",
        "intent": "CERTIFICATION",
        "expected_standard": "Ministry of Steel",
        "product": "Steel QCO",
        "is_mandatory": True,
        "key_facts": ["Ministry of Steel", "Steel Quality Control Order 2020"]
    },
    {
        "id": 77,
        "query": "Do small and micro enterprises get extended compliance timelines when a new QCO is notified?",
        "persona": "MSME",
        "category": "Regulatory",
        "intent": "CERTIFICATION",
        "expected_standard": "MSME QCO Guidelines",
        "product": "MSME",
        "is_mandatory": True,
        "key_facts": ["Yes", "DPIIT typically grants 6 months extension for small enterprises and 12 months for micro enterprises"]
    },
    {
        "id": 78,
        "query": "How can I verify whether a manufacturer's ISI licence is currently active or suspended?",
        "persona": "Consumer",
        "category": "Regulatory",
        "intent": "CONSUMER_QUERY",
        "expected_standard": "BIS CARE",
        "product": "Licence Verification",
        "is_mandatory": True,
        "key_facts": ["BIS CARE app", "manakonline.in search licence directory", "enter CM/L number"]
    },
    {
        "id": 79,
        "query": "What is the difference between a voluntary standard and a mandatory standard in India?",
        "persona": "Student",
        "category": "Regulatory",
        "intent": "CERTIFICATION",
        "expected_standard": "BIS Regulatory Framework",
        "product": "Standards",
        "is_mandatory": False,
        "key_facts": ["All Indian standards are voluntary by default unless notified under a mandatory QCO or government technical regulation"]
    },
    {
        "id": 80,
        "query": "Can an e-commerce platform sell products that violate a mandatory QCO without an ISI mark?",
        "persona": "Consumer",
        "category": "Regulatory",
        "intent": "CONSUMER_QUERY",
        "expected_standard": "BIS Act & CCPA",
        "product": "E-Commerce",
        "is_mandatory": True,
        "key_facts": ["No, e-commerce platforms are legally prohibited from listing or selling notified products without valid BIS mark", "CCPA notices"]
    },

    # 9. Licensing, MSME Concessions & Scheme of Inspection (81-90)
    {
        "id": 81,
        "query": "I am a small manufacturer of electrical appliances. How can I find out whether my product requires BIS certification and what steps are involved in obtaining the licence?",
        "persona": "MSME",
        "category": "Licensing",
        "intent": "LICENSING",
        "expected_standard": "Scheme I (ISI Mark)",
        "product": "Electrical Appliances",
        "is_mandatory": True,
        "key_facts": ["Scheme I ISI mark", "in-house lab per SIT", "manakonline.in application", "factory inspection", "30-day fast track", "50% fee concession for micro enterprises"]
    },
    {
        "id": 82,
        "query": "What is the Simplified Procedure (Option 2) for grant of BIS licence?",
        "persona": "MSME",
        "category": "Licensing",
        "intent": "LICENSING",
        "expected_standard": "Scheme I (Option 2)",
        "product": "Licensing",
        "is_mandatory": True,
        "key_facts": ["Simplified procedure allows grant of licence within 30 days based on pre-tested sample report from recognized lab and factory audit"]
    },
    {
        "id": 83,
        "query": "What marking fee concessions does BIS offer to micro, small, and women entrepreneurs?",
        "persona": "MSME",
        "category": "Licensing",
        "intent": "LICENSING",
        "expected_standard": "MSME Concessions",
        "product": "Licensing",
        "is_mandatory": True,
        "key_facts": ["50% concession for Micro Enterprises", "20% concession for Small Enterprises", "additional concessions for Women entrepreneurs and Startups"]
    },
    {
        "id": 84,
        "query": "What is a Scheme of Inspection and Testing (SIT) issued by BIS?",
        "persona": "Manufacturer",
        "category": "Licensing",
        "intent": "TESTING",
        "expected_standard": "SIT Guidelines",
        "product": "Testing",
        "is_mandatory": True,
        "key_facts": ["SIT defines sampling frequency, test methods, routine tests, and test records a licensee must maintain in their factory lab"]
    },
    {
        "id": 85,
        "query": "What happens during a BIS preliminary factory audit?",
        "persona": "Manufacturer",
        "category": "Licensing",
        "intent": "LICENSING",
        "expected_standard": "Scheme I Audit",
        "product": "Licensing",
        "is_mandatory": True,
        "key_facts": ["Inspection officer verifies manufacturing machinery, quality control testing equipment, instrument calibration, and draws verification samples"]
    },
    {
        "id": 86,
        "query": "What is market surveillance under BIS product certification?",
        "persona": "Officer",
        "category": "Licensing",
        "intent": "LICENSING",
        "expected_standard": "Surveillance Guidelines",
        "product": "Licensing",
        "is_mandatory": True,
        "key_facts": ["Unannounced factory audits and random market sample purchases from open retail stores to verify ongoing conformity"]
    },
    {
        "id": 87,
        "query": "How long is a BIS Scheme I certification licence valid and how is it renewed?",
        "persona": "Manufacturer",
        "category": "Licensing",
        "intent": "LICENSING",
        "expected_standard": "Licence Renewal",
        "product": "Licensing",
        "is_mandatory": True,
        "key_facts": ["Initially granted for 1 to 2 years", "renewable up to 5 years upon payment of annual marking fee and satisfactory surveillance"]
    },
    {
        "id": 88,
        "query": "Can a manufacturer use the ISI mark on multiple factory locations under a single licence?",
        "persona": "Manufacturer",
        "category": "Licensing",
        "intent": "LICENSING",
        "expected_standard": "Scheme I Regulations",
        "product": "Licensing",
        "is_mandatory": True,
        "key_facts": ["No", "BIS licence is premises-specific; every manufacturing facility must obtain a separate licence (CM/L)"]
    },
    {
        "id": 89,
        "query": "What documents are required to apply for a BIS licence on Manakonline?",
        "persona": "MSME",
        "category": "Licensing",
        "intent": "LICENSING",
        "expected_standard": "Manakonline Checklist",
        "product": "Licensing",
        "is_mandatory": True,
        "key_facts": ["Form 1, factory premise proof, manufacturing machinery list, test equipment list with calibration certificates, layout plan, test report"]
    },
    {
        "id": 90,
        "query": "What are the grounds on which BIS can cancel or stop marking of a licence?",
        "persona": "Legal Officer",
        "category": "Licensing",
        "intent": "LICENSING",
        "expected_standard": "Conformity Regulations",
        "product": "Licensing",
        "is_mandatory": True,
        "key_facts": ["Repeated sample failure, non-compliance with SIT, non-payment of marking fees, misuse of ISI mark, obstruction of audit"]
    },

    # 10. Foreign Manufacturers & Import Schemes (91-95)
    {
        "id": 91,
        "query": "What is the Foreign Manufacturers Certification Scheme (FMCS) of BIS?",
        "persona": "Importer",
        "category": "FMCS",
        "intent": "CERTIFICATION",
        "expected_standard": "FMCS Scheme",
        "product": "FMCS",
        "is_mandatory": True,
        "key_facts": ["Enables foreign manufacturers outside India to obtain BIS licence to affix ISI mark on goods exported to India", "requires factory audit abroad"]
    },
    {
        "id": 92,
        "query": "Who can be appointed as an Authorized Indian Representative (AIR) under FMCS?",
        "persona": "Importer",
        "category": "FMCS",
        "intent": "LICENSING",
        "expected_standard": "AIR Guidelines",
        "product": "FMCS",
        "is_mandatory": True,
        "key_facts": ["Indian citizen or registered entity in India who assumes legal responsibility on behalf of the foreign manufacturer for BIS compliance"]
    },
    {
        "id": 93,
        "query": "What is the timeline and fee structure for foreign manufacturers under FMCS?",
        "persona": "Foreign Manufacturer",
        "category": "FMCS",
        "intent": "LICENSING",
        "expected_standard": "FMCS Timeline",
        "product": "FMCS",
        "is_mandatory": True,
        "key_facts": ["Processing typically takes 3 to 6 months", "applicant pays application fee, inspection audit travel costs, marking fee, and performance bank guarantee"]
    },
    {
        "id": 94,
        "query": "What happens if an imported container contains goods covered under a QCO without BIS registration?",
        "persona": "Importer",
        "category": "FMCS",
        "intent": "CERTIFICATION",
        "expected_standard": "Customs QCO",
        "product": "Import",
        "is_mandatory": True,
        "key_facts": ["Customs officer will not grant out-of-charge", "shipment will be re-exported or destroyed", "penalty on importer"]
    },
    {
        "id": 95,
        "query": "Can a foreign company register electronics under CRS without a factory audit?",
        "persona": "Foreign Manufacturer",
        "category": "Electronics CRS",
        "intent": "CERTIFICATION",
        "expected_standard": "CRS Guidelines",
        "product": "Electronics CRS",
        "is_mandatory": True,
        "key_facts": ["Yes, under Scheme II (CRS), factory audit is not required; registration is granted based on test reports from BIS-recognized labs in India with an AIR"]
    },

    # 11. Testing Laboratories, BIS CARE App & Consumer Redressal (96-100)
    {
        "id": 96,
        "query": "Where are the official BIS Regional Testing Laboratories located in India?",
        "persona": "Lab Technician",
        "category": "Laboratories",
        "intent": "LABORATORY",
        "expected_standard": "BIS Lab Network",
        "product": "Laboratories",
        "is_mandatory": False,
        "key_facts": ["CL Sahibabad Ghaziabad", "WRL Mumbai", "SRL Chennai", "ERL Kolkata", "NRL Mohali/Chandigarh"]
    },
    {
        "id": 97,
        "query": "How can a private laboratory obtain BIS recognition for product testing?",
        "persona": "Lab Technician",
        "category": "Laboratories",
        "intent": "LABORATORY",
        "expected_standard": "LIMS Guidelines",
        "product": "Laboratories",
        "is_mandatory": False,
        "key_facts": ["NABL accreditation according to ISO/IEC 17025", "apply via BIS Laboratory Information Management System (LIMS) on manakonline.in"]
    },
    {
        "id": 98,
        "query": "What four main services does the BIS CARE mobile app offer to consumers?",
        "persona": "Consumer",
        "category": "Consumer Services",
        "intent": "CONSUMER_QUERY",
        "expected_standard": "BIS CARE",
        "product": "Consumer Services",
        "is_mandatory": False,
        "key_facts": ["Verify ISI mark licence (CM/L)", "Verify CRS registration (R-number)", "Verify gold hallmarking HUID", "File public grievances/complaints"]
    },
    {
        "id": 99,
        "query": "How can a consumer file a complaint against fake ISI marked products or sub-standard goods?",
        "persona": "Consumer",
        "category": "Consumer Services",
        "intent": "CONSUMER_QUERY",
        "expected_standard": "Grievance Redressal",
        "product": "Consumer Services",
        "is_mandatory": False,
        "key_facts": ["Submit photos, purchase invoice, shop location via BIS CARE app or portal", "enforcement branch conducts raids, seizure, and prosecutes under Section 29"]
    },
    {
        "id": 100,
        "query": "Is a consumer entitled to compensation or product replacement if a BIS certified product fails quality standards?",
        "persona": "Consumer",
        "category": "Consumer Services",
        "intent": "CONSUMER_QUERY",
        "expected_standard": "BIS Act Redressal",
        "product": "Consumer Services",
        "is_mandatory": True,
        "key_facts": ["Yes, under Section 18 of BIS Act 2016 and Consumer Protection Act, manufacturer is liable to replace the product, refund the cost, or pay compensation"]
    }
]

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(BENCHMARK_100, f, indent=2, ensure_ascii=False)

print(f"Created {len(BENCHMARK_100)} benchmark questions dataset at: {OUTPUT_FILE}")
