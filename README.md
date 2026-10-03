# BIS SmartAssist 🇮🇳
### AI-powered Intelligent Assistant for Indian Standards and BIS Services
**Smart India Hackathon (SIH26107)** • Bureau of Indian Standards (BIS)

---

## 1. Project Overview

**BIS SmartAssist** is a production-grade full-stack conversational platform designed for **industries, MSMEs, startups, manufacturers, students, and citizens** to quickly discover, verify, and understand Indian Standards (IS), mandatory certification schemes, Quality Control Orders (QCOs), testing protocols, and hallmarking rules.

The core principle guiding the system is:
> **Every factual answer is strictly traceable to its source document, standard number, clause, page, and official BIS portal reference.**

---

## 2. Key Capabilities & Innovations

## 2. Key Capabilities & Innovations

- **23,866 Published Standards Indexed**: Directly preloaded from official Bureau of Indian Standards catalogues with instant keyword, category, and standard-number search.
- **17 Official Departmental Resource Handouts & Technical Booklets**: Full-text extracted and semantically indexed across core engineering and safety divisions (Automotive Braking, Building Materials, Chemicals, Electro-Mechanical, Food & Agriculture, Electronics & IT, Machine Safety, Medical Textiles, Petroleum, Water Resources, AYUSH, etc.).
- **Automated Data Quality & Normalization Pipeline**: Robust ingestion module with dynamic header detection, Unicode/dash cleanup, exact IS regex extractors, and ISO date standardization.
- **Strict Grounding & Zero Hallucination**: Multi-source RAG pipeline (Standards Catalogue + Clause Knowledge Base + Departmental Handouts) prevents fabrication of standard numbers, clauses, test limits, or fees.
- **Clause-Level & Booklet Citations**: Clickable source cards displaying Standard Number, Clause, Booklet Department, Page Number, and direct links to official BIS portals (Manakonline & e-BIS).
- **Retrieval Confidence Meter & Explainability**: Real-time confidence score (High, Medium, Low) with RL-optimized weights (Dense Vectors + BM25 Lexical + Exact Booster).
- **Multilingual Support**: Supports **English, हिन्दी (Hindi), and मराठी (Marathi)** with instant UI toggling and multilingual query comprehension.
- **Product Standard Finder & Services Hub**: Dedicated tool allowing users to enter product names/categories to view mandatory QCO status, certification schemes, technical requirements, and laboratory testing directories.

---

## 3. Directory Structure

```text
BIS/
├── backend/
│   ├── app/
│   │   ├── api/                  # REST API routes (chat, standards, booklets, audit, auth, verify, qco)
│   │   ├── core/                 # Config, database engine, security
│   │   ├── ingestion/            # Dataset inspection, CSV loader, Booklet PDF extraction
│   │   ├── models/               # SQLAlchemy DB models
│   │   ├── rag/                  # Hybrid retriever, BM25, RL optimizer, generator
│   │   └── schemas/              # Pydantic schemas
│   └── main.py                   # FastAPI server entry point
│
├── frontend/                     # Next.js 14 App Router UI
│
├── data/
│   ├── raw/
│   │   ├── bis_standards.csv     # Raw catalogue dataset
│   │   └── booklets/             # 17 Official BIS Technical Booklet PDFs
│   ├── processed/
│   │   ├── bis_standards_clean.csv # Cleaned & normalized dataset (23,866 records)
│   │   ├── data_quality_report.json # Inspection metrics
│   │   └── standards_embeddings.npy # Precomputed dense vectors
│   └── chroma_db/                # Persistent vector database
│
├── scripts/
│   ├── inspect_dataset.py        # Dynamic header & quality inspection tool
│   ├── clean_dataset.py          # Data cleaning & normalization pipeline
│   ├── ingest_booklets.py        # Booklet PDF extraction & vector ingestion
│   ├── store_in_chromadb.py      # ChromaDB multi-collection builder
│   ├── test_search.py            # CLI & interactive standards search
│   └── test_booklet_search.py    # CLI booklet knowledge search
│
└── tests/                        # Comprehensive test suite (Dataset, Cleaning, Retrieval, API, Booklets)
```

---

## 4. Ingestion & In-Memory Pipeline

Run the end-to-end data pipeline:
```bash
# 1. Inspect raw dataset quality & detected headers
python scripts/inspect_dataset.py

# 2. Clean and normalize standards records
python scripts/clean_dataset.py

# 3. Ingest departmental booklets into ChromaDB
python scripts/ingest_booklets.py

# 4. Seed primary database & vectorize
python scripts/seed_database.py
```

---

## 5. Running Tests

Execute the automated test suite:
```bash
pytest tests/
```

---

## 6. Quick Start (Local Setup)

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### Step 1: Start Backend API
```bash
cd BIS
pip install -r requirements.txt
python scripts/seed_database.py
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
API running at `http://127.0.0.1:8000` (Docs at `http://127.0.0.1:8000/docs`).

### Step 2: Start Frontend UI
```bash
cd BIS/frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. API Endpoints

- `POST /api/chat`: Main conversational RAG endpoint with intent, confidence, citations, and explainability.
- `GET /api/standards`: Search across 23,866 Indian Standards with category and mandatory filters.
- `GET /api/standards/booklets/search`: Semantic search over 17 BIS Departmental Resource Handouts.
- `POST /api/standards/product-finder`: AI product compliance search.
- `GET /api/services`: 8 BIS operational branches & FAQs.
- `GET /api/laboratories`: Directory of accredited testing labs.
- `GET /api/admin/stats`: Real-time system telemetry and accuracy rate.

---

## 8. License & Attribution
Developed for **Smart India Hackathon (SIH26107)**. Data sourced from official published standards and technical resource booklets released by the **Bureau of Indian Standards (BIS)**, Ministry of Consumer Affairs, Food & Public Distribution, Government of India.

