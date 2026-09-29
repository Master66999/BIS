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

- **23,866 Published Standards Indexed**: Directly preloaded from official Bureau of Indian Standards catalogues with instant keyword, category, and standard-number search.
- **Strict Grounding & Zero Hallucination**: RAG pipeline prevents fabrication of standard numbers, clauses, test limits, or fees. If information is insufficient, a low-confidence warning is generated.
- **Clause-Level Citations**: Clickable source cards displaying Standard Number, Clause, Page Number, and direct link to official BIS portals (Manakonline & e-BIS).
- **Retrieval Confidence Meter**: Real-time confidence score (High 92%, Medium 74%, Low 42%) with cautionary alerts for regulatory verification.
- **Retrieval Explainability ("Why this answer?")**: Audit drawer disclosing detected intent, extracted entities (product, standard number, clause), language, search strategy, and matching evidence clauses.
- **Multilingual Support**: Supports **English, हिन्दी (Hindi), and मराठी (Marathi)** with instant UI toggling and multilingual query comprehension.
- **Product Standard Finder**: Dedicated tool allowing users to enter a product name and category to view applicable standards, mandatory QCO status, certification schemes, technical requirements, and side-by-side standard comparison.
- **BIS Services Hub**: In-depth interactive guides covering all 8 BIS service branches (Scheme I ISI mark, Scheme II CRS, Scheme IV FMCS, Gold/Silver Hallmarking & HUID, Testing Labs LRS, Consumer BIS CARE App).
- **Recognized Testing Laboratories Directory**: Searchable directory of central, regional, and commercial laboratories with testing scopes and recognized Indian Standards.
- **Admin Telemetry & Document Ingestion**: Real-time telemetry dashboard (retrieval confidence, queries, active users, satisfaction rate) and document ingestion pipeline.

---

## 3. Architecture

```text
User Query (English / हिन्दी / मराठी)
         ↓
    [Next.js UI]
         ↓
  [FastAPI Backend]
         ↓
[Query Understanding Engine]
  • Intent Classification (12 Intents)
  • Entity Extraction (Product, Standard, Clause, Scheme)
  • Language Detection & Normalization
         ↓
[Hybrid Retrieval Engine]
  • Vector Semantic Search (TF-IDF sublinear n-grams)
  • Full-Text Keyword Search
  • Standard Number & Clause Booster
         ↓
    [Reranker]
  • Relevance & Confidence Scoring
         ↓
[Grounded Answer Generator]
  • Gemini API / OpenAI API / Deterministic Grounded Synthesis
  • Clause-Level Citation Verification
         ↓
Verified Response + Clickable Citations + Confidence Gauge + Explainability Audit
```

---

## 4. Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Indian Gov-Tech color scheme: Deep Blue `#0A2540`, Saffron `#FF9933`, White/Slate)
- **Icons**: Lucide React
- **Markdown**: React Markdown

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Data Validation**: Pydantic v2
- **Database**: SQLite (built-in default) & PostgreSQL + pgvector (production ready)
- **ORM**: SQLAlchemy
- **Search & RAG**: Scikit-Learn (TF-IDF vectorizer + Cosine Similarity) + Clause Reranker
- **LLM**: Google Gemini REST integration (`gemini-1.5-flash`) + Grounded fallback engine
- **Authentication**: JWT tokens + SHA-256 password hashing + 1-Click Demo Persona switcher

---

## 5. Quick Start (Local Setup)

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### Step 1: Clone & Configure Backend
```bash
# Navigate to project root
cd BIS

# Install Python requirements
pip install -r requirements.txt

# Seed database with 23,866 Indian Standards and curated clause repository
python scripts/seed_database.py

# Start FastAPI backend
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API is now running at `http://127.0.0.1:8000` (API documentation at `http://127.0.0.1:8000/docs`).

### Step 2: Configure & Start Frontend
```bash
# In a new terminal window:
cd BIS/frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Docker Deployment (PostgreSQL + pgvector)

To run the complete production stack with PostgreSQL and pgvector:
```bash
docker-compose up --build
```
This launches:
- `db`: PostgreSQL 16 with `pgvector` extension on port 5432
- `backend`: FastAPI API server on port 8000
- `frontend`: Next.js web application on port 3000

---

## 7. Sample Demo Questions to Test

| Question | Tested Feature | Expected Outcome |
| :--- | :--- | :--- |
| **"What BIS standard is applicable to cement?"** | Standard Lookup & Physical Requirements | Retrieves **IS 269:2015**, Compressive strength (Clause 4.2), Setting times (Clause 5.1), and Cement QCO mandatory status. |
| **"What certification is required for electric fans?"** | Product Certification (ISI Mark) | Retrieves **IS 374:2019**, Air delivery & Star rating (Clause 5.3), High-voltage safety test (Clause 6.2). |
| **"What is 6-digit HUID in gold hallmarking?"** | Hallmarking & Consumer Verification | Retrieves **IS 1417:2016**, 6 recognized grades (Clause 4.1), 3 mandatory marks (Clause 6.1), and BIS CARE App verification (Clause 7.2). |
| **"What testing is required for packaged drinking water?"** | Testing & Toxic Limits | Retrieves **IS 14543:2024**, Microbiological limits (Clause 5.1: E.coli & Coliforms absent), Toxic limits (Clause 5.2). |
| **"What are the chemical limits for TMT steel rebars?"** | Technical Clause Lookup | Retrieves **IS 1786:2008**, Clause 4.2 Carbon, Sulphur, and Phosphorus limits for Fe 500D grade. |
| **"माझ्या उत्पादनासाठी कोणता BIS standard लागू आहे?"** | Multilingual (Marathi) | Analyzes query in Marathi and guides user to provide product name or category in Marathi. |
| **"सीमेंट के लिए कौन सा भारतीय मानक लागू है?"** | Multilingual (Hindi) | Synthesizes response in Hindi with Hindi clause citations and links. |

---

## 8. API Endpoints

- `POST /api/chat`: Main conversational RAG endpoint with intent, confidence, citations, and explainability.
- `GET /api/chat/conversations`: Fetch user conversation history.
- `POST /api/standards/product-finder`: AI product compliance search.
- `GET /api/standards`: Paginated search across 23,866 Indian Standards.
- `GET /api/services`: 8 BIS operational branches & FAQs.
- `GET /api/laboratories`: Directory of accredited testing labs.
- `POST /api/feedback`: Submit user helpfulness ratings and corrections.
- `GET /api/admin/stats`: Real-time system telemetry and accuracy rate.
- `POST /api/admin/documents/upload`: Live document ingestion pipeline.
- `POST /api/auth/demo`: 1-click test login for hackathon evaluators.

---

## 9. License & Attribution
Developed for **Smart India Hackathon (SIH26107)**. Data sourced from official published standards released by the **Bureau of Indian Standards (BIS)**, Ministry of Consumer Affairs, Food & Public Distribution, Government of India.
