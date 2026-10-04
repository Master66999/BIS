"""
generate_presentation.py
Generates a polished, professional 16:9 presentation (.pptx) for BIS SmartAssist
covering:
1. Title
2. Explanation
3. Innovation & Uniqueness
4. Technologies to be Used and Approach
5. Feasibility
6. Viability
7. Impact and Benefits
8. Research Paper Highlights & Conclusion
"""

import os
import pptx
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation(output_path="BIS_SmartAssist_Presentation.pptx"):
    prs = pptx.Presentation()
    # 16:9 Widescreen
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Theme Colors
    NAVY_DARK = RGBColor(10, 37, 64)       # Primary header & dark cards
    NAVY_BLUE = RGBColor(24, 76, 120)      # Heading blue matching user's image style
    ACCENT_GOLD = RGBColor(212, 160, 23)   # Warm Gold / Saffron
    BG_LIGHT = RGBColor(248, 250, 252)     # Off-white / light slate
    CARD_BG = RGBColor(255, 255, 255)      # White
    CARD_BORDER = RGBColor(226, 232, 240)  # Border subtle
    TEXT_DARK = RGBColor(30, 41, 59)       # Slate 800
    TEXT_MUTED = RGBColor(100, 116, 139)   # Slate 500
    GREEN_ACCENT = RGBColor(16, 149, 93)   # Metric green
    BLUE_PILL = RGBColor(238, 246, 255)

    def add_header(slide, title_text, category_text="Smart India Hackathon • SIH26107 | BIS SmartAssist"):
        # Category Tag
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.35))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(10)
        p_cat.font.bold = True
        p_cat.font.color.rgb = ACCENT_GOLD
        p_cat.font.name = "Arial"

        # Main Title (Styling matching the exact blue from user's uploaded images)
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(28)
        p_title.font.bold = True
        p_title.font.color.rgb = NAVY_BLUE
        p_title.font.name = "Georgia"

        # Subtle divider line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.733), Inches(0.02))
        line.fill.solid()
        line.fill.fore_color.rgb = RGBColor(226, 232, 240)
        line.line.color.rgb = RGBColor(226, 232, 240)

    def add_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=CARD_BORDER):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1)
        return shape

    # -------------------------------------------------------------
    # SLIDE 1: Title Slide
    # -------------------------------------------------------------
    slide1 = prs.slides.add_slide(prs.slide_layouts[6])
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = NAVY_DARK
    bg1.line.fill.background()

    # Badge
    badge = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.2), Inches(5.2), Inches(0.45))
    badge.fill.solid()
    badge.fill.fore_color.rgb = RGBColor(20, 55, 90)
    badge.line.color.rgb = ACCENT_GOLD
    p = badge.text_frame.paragraphs[0]
    p.text = "SMART INDIA HACKATHON 2026 • SIH26107"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT_GOLD
    p.alignment = PP_ALIGN.CENTER

    # Title
    tb = slide1.shapes.add_textbox(Inches(1.0), Inches(1.9), Inches(11.3), Inches(2.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p1 = tf.paragraphs[0]
    p1.text = "BIS SmartAssist"
    p1.font.size = Pt(46)
    p1.font.bold = True
    p1.font.color.rgb = RGBColor(255, 255, 255)
    p1.font.name = "Georgia"

    p2 = tf.add_paragraph()
    p2.text = "AI-Powered Intelligent Assistant for Indian Standards & BIS Services"
    p2.font.size = Pt(22)
    p2.font.bold = True
    p2.font.color.rgb = ACCENT_GOLD
    p2.font.name = "Arial"

    # Subtitle card
    card_sub = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(4.3), Inches(11.3), Inches(2.2))
    card_sub.fill.solid()
    card_sub.fill.fore_color.rgb = RGBColor(16, 48, 80)
    card_sub.line.color.rgb = RGBColor(30, 75, 120)
    tf_sub = card_sub.text_frame
    tf_sub.word_wrap = True
    
    ps1 = tf_sub.paragraphs[0]
    ps1.text = "Core Innovation: Fine-Tuned Cross-Encoder RAG Architecture with Clause-Level Grounding & Zero Hallucination"
    ps1.font.size = Pt(14)
    ps1.font.bold = True
    ps1.font.color.rgb = RGBColor(255, 255, 255)

    ps2 = tf_sub.add_paragraph()
    ps2.text = "• 23,866 Published Indian Standards indexed with full metadata and classification"
    ps2.font.size = Pt(13)
    ps2.font.color.rgb = RGBColor(203, 213, 225)

    ps3 = tf_sub.add_paragraph()
    ps3.text = "• 17 Official Technical Department Booklets extracted with multi-channel candidate pooling"
    ps3.font.size = Pt(13)
    ps3.font.color.rgb = RGBColor(203, 213, 225)

    ps4 = tf_sub.add_paragraph()
    ps4.text = "• Real-Time Calibrated Confidence Meter & Tri-Lingual Support (English, Hindi, Marathi)"
    ps4.font.size = Pt(13)
    ps4.font.color.rgb = RGBColor(203, 213, 225)

    # Speaker notes
    slide1.notes_slide.notes_text_frame.text = (
        "Welcome judges and members of the evaluation committee. Today we present BIS SmartAssist, "
        "our enterprise-grade AI solution engineered for Smart India Hackathon problem statement SIH26107 "
        "under the Bureau of Indian Standards (BIS)."
    )

    # -------------------------------------------------------------
    # SLIDE 2: Explanation
    # -------------------------------------------------------------
    slide2 = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide2, "Explanation")

    # Column 1: The Problem
    add_card(slide2, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    tb_c1 = slide2.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.6))
    tf_c1 = tb_c1.text_frame
    tf_c1.word_wrap = True

    p = tf_c1.paragraphs[0]
    p.text = "The Problem & Critical Challenges"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = NAVY_BLUE

    bullets_c1 = [
        ("Information Overload:", " Over 23,800+ published Indian Standards across diverse technical departments make compliance discovery arduous for MSMEs, startups, and citizens."),
        ("Hallucination Risk in Generic AI:", " Standard LLMs frequently fabricate standard codes, clauses, fee structures, and testing criteria, which is catastrophic for legal conformity."),
        ("Siloed Regulatory Documentation:", " Standards, Quality Control Orders (QCOs), departmental booklets, and laboratory testing directories are fragmented across multiple portals."),
        ("Language & Accessibility Barrier:", " Technical standards are predominantly in complex regulatory English, alienating vernacular manufacturers across Indian states.")
    ]
    for title, desc in bullets_c1:
        p_b = tf_c1.add_paragraph()
        run1 = p_b.add_run()
        run1.text = "• " + title
        run1.font.bold = True
        run1.font.color.rgb = TEXT_DARK
        run1.font.size = Pt(12)
        run2 = p_b.add_run()
        run2.text = desc
        run2.font.color.rgb = TEXT_MUTED
        run2.font.size = Pt(12)

    # Column 2: The Solution & System Architecture
    add_card(slide2, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    tb_c2 = slide2.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.3), Inches(4.6))
    tf_c2 = tb_c2.text_frame
    tf_c2.word_wrap = True

    p = tf_c2.paragraphs[0]
    p.text = "The Solution: BIS SmartAssist"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = NAVY_BLUE

    bullets_c2 = [
        ("End-to-End Grounded Assistant:", " An intelligent conversational platform linking queries to exact clauses, standards, and official e-BIS/Manakonline sources."),
        ("Hybrid Retrieval Engine:", " Blends BM25 Okapi lexical indexing with 384-dimensional dense semantic vector representations for high recall."),
        ("Domain-Adapted Neural Reranker:", " Fine-tuned Cross-Encoder on real PyTorch pipeline with adversarial hard-negative mining for precision scoring."),
        ("Explainability & Trust:", " Every response includes a real-time Calibrated Confidence Score, clause citations, and direct portal verification links."),
        ("Comprehensive Compliance Hub:", " Product Standard Finder, QCO mandatory lookup, accredited lab directory, and audit dossier generator.")
    ]
    for title, desc in bullets_c2:
        p_b = tf_c2.add_paragraph()
        run1 = p_b.add_run()
        run1.text = "• " + title
        run1.font.bold = True
        run1.font.color.rgb = TEXT_DARK
        run1.font.size = Pt(12)
        run2 = p_b.add_run()
        run2.text = desc
        run2.font.color.rgb = TEXT_MUTED
        run2.font.size = Pt(12)

    slide2.notes_slide.notes_text_frame.text = (
        "Explanation slide: Emphasize that generic LLMs fail in regulatory domains because hallucinated standards "
        "cause legal penalties. BIS SmartAssist bridges this gap by grounding 23,866 Indian Standards and 17 technical "
        "department booklets into a single, high-speed, traceable platform."
    )

    # -------------------------------------------------------------
    # SLIDE 3: Innovation & Uniqueness
    # -------------------------------------------------------------
    slide3 = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide3, "Innovation & Uniqueness")

    # 3x2 Grid or 4 Cards
    innovations = [
        ("Zero-Hallucination Strict Grounding",
         "Strict dual-source verification against the published BIS catalogue and departmental booklets. The system is constrained to refuse unsupported queries rather than hallucinating answers (achieving 100% unsupported query accuracy).",
         NAVY_BLUE),
        ("Domain Fine-Tuned Cross-Encoder",
         "Trained on real PyTorch sentence-transformers with 3-phase adversarial hard-negative mining (mining false-positive standard overlaps). Reaches 96.15% validation accuracy and 98% Recall@5.",
         GREEN_ACCENT),
        ("Clause-Level & Page-Level Traceability",
         "Directly pinpoints specific clauses (e.g., IS 4984 Clause 7.2) and departmental booklet pages with clickable source cards directly hyperlinked to official BIS Manakonline & e-BIS portals.",
         NAVY_BLUE),
        ("Multi-Signal Calibrated Confidence Meter",
         "Dynamically computes confidence via an explainable 4-signal formula: Top Candidate Score (35%), Exact IS Number match (25%), Channel Agreement (20%), and Rank-1 vs Rank-2 Margin (20%).",
         ACCENT_GOLD),
        ("Multi-Channel Candidate Pooling (Top-60)",
         "Parallel retrieval retrieves Top 30 BM25 Okapi lexical candidates and Top 30 dense semantic vector candidates, normalized and deduplicated before neural reranking for zero missed edge cases.",
         NAVY_BLUE),
        ("Native Tri-Lingual Accessibility",
         "Full multilingual accessibility supporting English, हिन्दी (Hindi), and मराठी (Marathi) with instant localized UI toggling and multilingual cross-lingual query understanding.",
         NAVY_BLUE),
    ]

    card_coords = [
        (Inches(0.8), Inches(1.8), Inches(3.6), Inches(2.4)),
        (Inches(4.8), Inches(1.8), Inches(3.6), Inches(2.4)),
        (Inches(8.8), Inches(1.8), Inches(3.7), Inches(2.4)),
        (Inches(0.8), Inches(4.5), Inches(3.6), Inches(2.4)),
        (Inches(4.8), Inches(4.5), Inches(3.6), Inches(2.4)),
        (Inches(8.8), Inches(4.5), Inches(3.7), Inches(2.4)),
    ]

    for (title, desc, accent), (x, y, w, h) in zip(innovations, card_coords):
        add_card(slide3, x, y, w, h)
        # Accent top bar
        bar = slide3.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, Inches(0.08))
        bar.fill.solid()
        bar.fill.fore_color.rgb = accent
        bar.line.fill.background()

        tb_box = slide3.shapes.add_textbox(x + Inches(0.2), y + Inches(0.2), w - Inches(0.4), h - Inches(0.3))
        tf_b = tb_box.text_frame
        tf_b.word_wrap = True
        p_t = tf_b.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(13)
        p_t.font.bold = True
        p_t.font.color.rgb = NAVY_BLUE

        p_d = tf_b.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = TEXT_MUTED

    slide3.notes_slide.notes_text_frame.text = (
        "Innovation & Uniqueness: Highlight the fine-tuned cross-encoder with adversarial hard-negative mining, "
        "clause-level citations, multi-signal confidence estimation, and 100% unsupported query refusal that guarantees "
        "zero hallucination."
    )

    # -------------------------------------------------------------
    # SLIDE 4: Technologies to be Used and Approach
    # -------------------------------------------------------------
    slide4 = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide4, "Technologies to be Used and Approach")

    # Left: Technology Stack
    add_card(slide4, Inches(0.8), Inches(1.8), Inches(4.2), Inches(5.1))
    tb_tech = slide4.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(3.8), Inches(4.7))
    tf_tech = tb_tech.text_frame
    tf_tech.word_wrap = True

    p = tf_tech.paragraphs[0]
    p.text = "Technology Stack"
    p.font.size = Pt(17)
    p.font.bold = True
    p.font.color.rgb = NAVY_BLUE

    tech_items = [
        ("Frontend Application:", "Next.js 14 (App Router), React 18, TypeScript, Lucide Icons, Responsive Mobile-First CSS"),
        ("Backend Framework:", "FastAPI (Asynchronous Python 3.11), Pydantic v2, SQLAlchemy ORM"),
        ("Retrieval & Search:", "PureBM25Okapi (k1=1.5, b=0.75), TF-IDF sublinear vectors, ChromaDB persistent store"),
        ("Deep Learning Models:", "PyTorch, Sentence-Transformers, Fine-Tuned Cross-Encoder (MiniLM-L6-v2)"),
        ("Data Pipeline:", "Dynamic header inspection, regex IS extractors, PDFPlumber & PyPDF for departmental booklets"),
        ("Deployment & DevOps:", "Docker, Docker-Compose, Railway / Uvicorn, SQLite/PostgreSQL")
    ]
    for k, v in tech_items:
        p_item = tf_tech.add_paragraph()
        r1 = p_item.add_run()
        r1.text = "• " + k
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = TEXT_DARK
        r2 = p_item.add_run()
        r2.text = " " + v
        r2.font.size = Pt(10.5)
        r2.font.color.rgb = TEXT_MUTED

    # Right: Technical Approach Pipeline
    add_card(slide4, Inches(5.3), Inches(1.8), Inches(7.2), Inches(5.1))
    tb_app = slide4.shapes.add_textbox(Inches(5.5), Inches(2.0), Inches(6.8), Inches(4.7))
    tf_app = tb_app.text_frame
    tf_app.word_wrap = True

    p_app = tf_app.paragraphs[0]
    p_app.text = "Methodological Approach: 4-Stage Pipeline"
    p_app.font.size = Pt(17)
    p_app.font.bold = True
    p_app.font.color.rgb = NAVY_BLUE

    stages = [
        ("Stage 1: Intent & Dual-Channel Candidate Pooling",
         "Extract entities (IS codes, products, clauses). Concurrently query BM25 Lexical Index (Top-30) and Dense Semantic Vector Index (Top-30). Merge, deduplicate, and normalize scores into a candidate pool of 50-60 items."),
        ("Stage 2: Fine-Tuned Neural Cross-Encoder Reranking",
         "Pass (Query, Candidate) pairs into fine-tuned Cross-Encoder. Compute neural matching scores. Blend: Final = 0.70 * RerankScore + 0.30 * NormalizedRetrievalScore to elevate precise standards and eliminate distractors."),
        ("Stage 3: Calibrated Multi-Signal Confidence Calibration",
         "Calculate composite score: Confidence = 0.35 * Stop + 0.25 * Sexact + 0.20 * Sagree + 0.20 * Smargin. Assign dynamic category (VERY_HIGH, HIGH, MEDIUM, LOW) to govern answer generation."),
        ("Stage 4: Grounded Synthesis & Citations Injection",
         "Generate structured factual summary citing Standard Number, Title, Clause, Department, and direct link to Manakonline/e-BIS. Refuse out-of-scope queries if confidence is insufficient.")
    ]
    for st_title, st_desc in stages:
        p_st = tf_app.add_paragraph()
        r_st = p_st.add_run()
        r_st.text = st_title + "\n"
        r_st.font.bold = True
        r_st.font.size = Pt(11.5)
        r_st.font.color.rgb = NAVY_DARK
        r_desc = p_st.add_run()
        r_desc.text = st_desc
        r_desc.font.size = Pt(10)
        r_desc.font.color.rgb = TEXT_MUTED

    slide4.notes_slide.notes_text_frame.text = (
        "Technologies & Approach: Emphasize the four distinct stages: 1) Dual-channel candidate pooling (Top-60), "
        "2) Neural Cross-Encoder reranking fine-tuned on PyTorch, 3) 4-signal confidence scoring, "
        "and 4) Zero-hallucination citation-grounded synthesis."
    )

    # -------------------------------------------------------------
    # SLIDE 5: Feasibility
    # -------------------------------------------------------------
    slide5 = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide5, "Feasibility")

    feas_cards = [
        ("Technical Feasibility",
         "High Readiness Level (TRL 7/8)",
         [
             "Fully functional end-to-end working prototype with 23,866 Indian Standards already ingested and cleaned.",
             "17 Official Departmental Resource Handouts parsed, chunked, and indexed with clause metadata.",
             "Automated PyTest validation suite passing 100% across dataset, cleaning, retrieval, API, and booklets."
         ]),
        ("Computational Feasibility",
         "Ultra-Lightweight & Sub-Second Latency",
         [
             "Average retrieval & rerank latency is under 55 ms on standard CPU hardware without requiring expensive GPUs.",
             "Compact vector index footprint (under 300 MB RAM) allows cost-effective deployment on minimal cloud instances or edge servers.",
             "Asynchronous FastAPI server handles high concurrent user requests with sub-100ms P95 latency."
         ]),
        ("Operational & Integration Feasibility",
         "Seamless API & Portal Integration",
         [
             "RESTful API architecture effortlessly embeds into existing BIS portals: Manakonline, e-BIS, and BIS Care App.",
             "Continuous incremental ingestion script allows dynamic updates whenever new standards or QCO amendments are published.",
             "Ready-to-deploy Docker and Docker-Compose configuration for immediate on-premise or sovereign cloud hosting (NIC/MeitY)."
         ])
    ]

    for i, (title, subtitle, points) in enumerate(feas_cards):
        x = Inches(0.8 + i * 4.0)
        y = Inches(1.8)
        w = Inches(3.7)
        h = Inches(5.1)
        add_card(slide5, x, y, w, h)

        # Top tag
        tag = slide5.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, Inches(0.08))
        tag.fill.solid()
        tag.fill.fore_color.rgb = NAVY_BLUE
        tag.line.fill.background()

        tb_fc = slide5.shapes.add_textbox(x + Inches(0.2), y + Inches(0.2), w - Inches(0.4), h - Inches(0.4))
        tf_fc = tb_fc.text_frame
        tf_fc.word_wrap = True

        p1 = tf_fc.paragraphs[0]
        p1.text = title
        p1.font.size = Pt(16)
        p1.font.bold = True
        p1.font.color.rgb = NAVY_BLUE

        p_sub = tf_fc.add_paragraph()
        p_sub.text = subtitle
        p_sub.font.size = Pt(11)
        p_sub.font.bold = True
        p_sub.font.color.rgb = ACCENT_GOLD

        for pt in points:
            p_pt = tf_fc.add_paragraph()
            r = p_pt.add_run()
            r.text = "• " + pt
            r.font.size = Pt(10.5)
            r.font.color.rgb = TEXT_DARK

    slide5.notes_slide.notes_text_frame.text = (
        "Feasibility: Stress that this is not a mock concept. 23,866 standards and 17 booklets are already running in the "
        "database. CPU inference is under 55ms, meaning it is cost-effective and ready for immediate deployment on MeitY or NIC cloud."
    )

    # -------------------------------------------------------------
    # SLIDE 6: Viability
    # -------------------------------------------------------------
    slide6 = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide6, "Viability")

    viability_pillars = [
        ("Institutional Viability (BIS)",
         NAVY_BLUE,
         [
             "Directly aligns with BIS's mandate for standardization, product quality, and consumer safety.",
             "Drastically reduces manual inquiry burdens on BIS nodal officers and helpline executives.",
             "Provides real-time administrative telemetry, tracking emerging compliance trends and common MSME query hotspots."
         ]),
        ("Economic & MSME Viability",
         GREEN_ACCENT,
         [
             "Zero-cost barrier for MSMEs and startups: Replaces expensive third-party compliance consultants.",
             "Fast-tracks certification cycles: Cuts standards identification time from days to sub-seconds.",
             "Mitigates regulatory penalties: Clear QCO visibility prevents product confiscation or compliance failure."
         ]),
        ("Commercial & Scalability Model",
         ACCENT_GOLD,
         [
             "Public-Private Utility: Free public citizen access with potential premium API webhooks for enterprise ERP integration.",
             "Modular Extensibility: Easily scalable to include state regulations, international ISO/IEC equivalencies, and live lab test slot booking.",
             "Sustainable Maintenance: Automated ingestion scrapers update changes in gazette notifications with zero system downtime."
         ]),
        ("Consumer & Societal Viability",
         NAVY_BLUE,
         [
             "Democratizes quality standards knowledge for consumers checking ISI and Hallmarked gold authenticity.",
             "Multilingual interface ensures equitable access across diverse linguistic demographics.",
             "Builds trust in 'Make in India' and national quality standards infrastructure."
         ])
    ]

    card_coords_v = [
        (Inches(0.8), Inches(1.8), Inches(5.6), Inches(2.4)),
        (Inches(6.8), Inches(1.8), Inches(5.7), Inches(2.4)),
        (Inches(0.8), Inches(4.5), Inches(5.6), Inches(2.4)),
        (Inches(6.8), Inches(4.5), Inches(5.7), Inches(2.4)),
    ]

    for (v_title, accent_color, pts), (x, y, w, h) in zip(viability_pillars, card_coords_v):
        add_card(slide6, x, y, w, h)
        bar = slide6.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, Inches(0.08))
        bar.fill.solid()
        bar.fill.fore_color.rgb = accent_color
        bar.line.fill.background()

        tb_v = slide6.shapes.add_textbox(x + Inches(0.2), y + Inches(0.2), w - Inches(0.4), h - Inches(0.3))
        tf_v = tb_v.text_frame
        tf_v.word_wrap = True

        pv = tf_v.paragraphs[0]
        pv.text = v_title
        pv.font.size = Pt(14)
        pv.font.bold = True
        pv.font.color.rgb = NAVY_BLUE

        for pt in pts:
            ppt = tf_v.add_paragraph()
            r = ppt.add_run()
            r.text = "• " + pt
            r.font.size = Pt(10)
            r.font.color.rgb = TEXT_DARK

    slide6.notes_slide.notes_text_frame.text = (
        "Viability: Highlight that BIS SmartAssist satisfies institutional, economic, and societal viability. "
        "It eliminates consulting expenses for MSMEs, lightens officer workload at BIS, and operates sustainably on open-source stack."
    )

    # -------------------------------------------------------------
    # SLIDE 7: Impact and Benefits
    # -------------------------------------------------------------
    slide7 = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide7, "Impact and Benefits")

    # Metrics Row (4 Badges)
    metrics = [
        ("98.00%", "Recall @ 5", "+13% over baseline hybrid retrieval", GREEN_ACCENT),
        ("90.00%", "Recall @ 1", "Accurate standard at Top-1 result", GREEN_ACCENT),
        ("100.0%", "Clause Accuracy", "Zero hallucinations on technical limits", NAVY_BLUE),
        ("100.0%", "Unsupported Refusal", "Protective zero-hallucination guardrail", ACCENT_GOLD)
    ]

    for i, (val, title, subtitle, col) in enumerate(metrics):
        x = Inches(0.8 + i * 3.0)
        y = Inches(1.8)
        w = Inches(2.7)
        h = Inches(1.4)
        add_card(slide7, x, y, w, h, bg_color=CARD_BG)

        tb_m = slide7.shapes.add_textbox(x, y + Inches(0.1), w, h - Inches(0.2))
        tf_m = tb_m.text_frame
        tf_m.word_wrap = True
        p_val = tf_m.paragraphs[0]
        p_val.text = val
        p_val.font.size = Pt(24)
        p_val.font.bold = True
        p_val.font.color.rgb = col
        p_val.alignment = PP_ALIGN.CENTER

        p_t = tf_m.add_paragraph()
        p_t.text = title
        p_t.font.size = Pt(11)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_DARK
        p_t.alignment = PP_ALIGN.CENTER

        p_s = tf_m.add_paragraph()
        p_s.text = subtitle
        p_s.font.size = Pt(8.5)
        p_s.font.color.rgb = TEXT_MUTED
        p_s.alignment = PP_ALIGN.CENTER

    # Impact Pillars (2 Columns)
    add_card(slide7, Inches(0.8), Inches(3.5), Inches(5.6), Inches(3.4))
    tb_imp1 = slide7.shapes.add_textbox(Inches(1.0), Inches(3.6), Inches(5.2), Inches(3.1))
    tf_imp1 = tb_imp1.text_frame
    tf_imp1.word_wrap = True

    p = tf_imp1.paragraphs[0]
    p.text = "Benefits to Industry & MSMEs"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = NAVY_BLUE

    b_msme = [
        "Instant Standard Discovery: Search by product name, application, or industry sector in seconds.",
        "Clear QCO Enforcement Tracking: Instant warning if mandatory Quality Control Order applies.",
        "Audit Dossier Generation: Automatically export structured compliance checklists for certification filings.",
        "Cost Savings: Estimated 80% reduction in preliminary compliance advisory costs for new startups."
    ]
    for b in b_msme:
        p_b = tf_imp1.add_paragraph()
        r = p_b.add_run()
        r.text = "• " + b
        r.font.size = Pt(10)
        r.font.color.rgb = TEXT_DARK

    add_card(slide7, Inches(6.8), Inches(3.5), Inches(5.7), Inches(3.4))
    tb_imp2 = slide7.shapes.add_textbox(Inches(7.0), Inches(3.6), Inches(5.3), Inches(3.1))
    tf_imp2 = tb_imp2.text_frame
    tf_imp2.word_wrap = True

    p = tf_imp2.paragraphs[0]
    p.text = "Benefits to Government & Citizens"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = NAVY_BLUE

    b_gov = [
        "Empowers 'Make in India': Accelerates adoption of world-class manufacturing standards.",
        "Protects Consumer Welfare: Easy verification of ISI marks, hallmark purities, and safety mandates.",
        "Administrative Efficiency: Eases BIS departmental ticket queues via automated 24/7 self-service.",
        "Transparent Governance: Direct links to official e-BIS gazettes eliminate misinformation."
    ]
    for b in b_gov:
        p_b = tf_imp2.add_paragraph()
        r = p_b.add_run()
        r.text = "• " + b
        r.font.size = Pt(10)
        r.font.color.rgb = TEXT_DARK

    slide7.notes_slide.notes_text_frame.text = (
        "Impact & Benefits: Point to the empirical numbers on top: 98% Recall@5, 100% clause accuracy, "
        "and 100% unsupported query refusal. Explain how this benefits both MSMEs seeking compliance and "
        "the BIS administration managing millions of stakeholder queries."
    )

    # -------------------------------------------------------------
    # SLIDE 8: Research Paper & Conclusion
    # -------------------------------------------------------------
    slide8 = prs.slides.add_slide(prs.slide_layouts[6])
    add_header(slide8, "Research Contribution & Roadmap")

    add_card(slide8, Inches(0.8), Inches(1.8), Inches(5.6), Inches(5.0))
    tb_rp = slide8.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.2), Inches(4.6))
    tf_rp = tb_rp.text_frame
    tf_rp.word_wrap = True

    p = tf_rp.paragraphs[0]
    p.text = "Scientific Research Contribution"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = NAVY_BLUE

    rp_points = [
        ("Novel Benchmark Dataset:", " Curated 100-question multi-category gold benchmark spanning 10 complex regulatory query types with clause-level ground truth."),
        ("Adversarial Hard-Negative Mining:", " Empirical methodology for mining confusing similar standards into fine-tuned Cross-Encoder training, raising MRR to 0.9323."),
        ("Multi-Signal Confidence Formulation:", " Closed-form calibration equation combining top candidate score, exact entity recognition, channel consensus, and ranking margin."),
        ("Zero-Hallucination Regulatory Bounds:", " Proven architecture achieving 100% accuracy on detecting and refusing out-of-domain / unsupported regulatory inquiries.")
    ]
    for t, d in rp_points:
        p_rp = tf_rp.add_paragraph()
        r1 = p_rp.add_run()
        r1.text = "• " + t
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = TEXT_DARK
        r2 = p_rp.add_run()
        r2.text = " " + d
        r2.font.size = Pt(10)
        r2.font.color.rgb = TEXT_MUTED

    add_card(slide8, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0))
    tb_rd = slide8.shapes.add_textbox(Inches(7.0), Inches(2.0), Inches(5.3), Inches(4.6))
    tf_rd = tb_rd.text_frame
    tf_rd.word_wrap = True

    p = tf_rd.paragraphs[0]
    p.text = "Project Roadmap & Scalability"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = NAVY_BLUE

    rd_points = [
        ("Phase 1 (Current):", " Production prototype with 23,866 Indian Standards, 17 Technical Booklets, fine-tuned reranker, and multilingual UI."),
        ("Phase 2 (Integration):", " Official pilot integration with BIS Manakonline & e-BIS portal search bars via lightweight REST microservices."),
        ("Phase 3 (Mobile & Voice):", " WhatsApp chatbot and voice-first AI assistant in 10+ Indian regional languages for on-field factory inspectors and rural artisans."),
        ("Phase 4 (Automated Compliance Auditor):", " PDF upload feature allowing manufacturers to upload lab test reports for automated BIS conformance auditing.")
    ]
    for t, d in rd_points:
        p_rd = tf_rd.add_paragraph()
        r1 = p_rd.add_run()
        r1.text = "• " + t
        r1.font.bold = True
        r1.font.size = Pt(11)
        r1.font.color.rgb = TEXT_DARK
        r2 = p_rd.add_run()
        r2.text = " " + d
        r2.font.size = Pt(10)
        r2.font.color.rgb = TEXT_MUTED

    slide8.notes_slide.notes_text_frame.text = (
        "Conclusion: Summarize the scientific rigor of our research paper and outline our clear, actionable roadmap "
        "for scaling BIS SmartAssist into a nationwide digital public infrastructure."
    )

    # Save
    prs.save(output_path)
    print(f"Presentation successfully created at: {output_path}")

if __name__ == "__main__":
    create_presentation()
