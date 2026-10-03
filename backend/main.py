import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.core.config import settings
from backend.app.core.database import engine, Base, SessionLocal
from backend.app.models.models import DocumentChunk
from backend.app.rag.retriever import hybrid_retriever

from backend.app.api.auth import router as auth_router
from backend.app.api.chat import router as chat_router
from backend.app.api.standards import router as standards_router
from backend.app.api.services import router as services_router
from backend.app.api.admin import router as admin_router
from backend.app.api.audit import router as audit_router
from backend.app.api.journey import router as journey_router
from backend.app.api.qco import router as qco_router
from backend.app.api.verify import router as verify_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Pre-warm hybrid retriever corpus
    print("Pre-warming MANAKAI RAG vector index...")
    db = SessionLocal()
    try:
        chunks = db.query(DocumentChunk).all()
        if chunks:
            hybrid_retriever.fit_corpus(chunks)
            print(f"[OK] RAG Retriever pre-warmed with {len(chunks)} clause chunks.")
        else:
            print("[INFO] No document chunks found. Run scripts/seed_database.py to populate.")
    except Exception as e:
        print(f"[WARN] Vector index pre-warming error: {e}")
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Official AI-powered Intelligent Assistant for Indian Standards and BIS Services (SIH26107)",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins in development and preview
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)
app.include_router(standards_router, prefix=settings.API_V1_STR)
app.include_router(services_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)
app.include_router(audit_router, prefix=settings.API_V1_STR)
app.include_router(journey_router, prefix=settings.API_V1_STR)
app.include_router(qco_router, prefix=settings.API_V1_STR)
app.include_router(verify_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to MANAKAI API",
        "description": "AI-powered Intelligent Assistant for Indian Standards and BIS Services",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "api_prefix": settings.API_V1_STR
    }

@app.get("/api/health")
@app.get("/health")
def health():
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "message": "MANAKAI API is running smoothly"
    }

@app.get("/api")
def api_status():
    return {
        "status": "online",
        "version": settings.VERSION,

        "endpoints": [
            "/api/auth/demo",
            "/api/chat",
            "/api/standards",
            "/api/standards/product-finder",
            "/api/services",
            "/api/laboratories",
            "/api/admin/stats",
            "/api/admin/system-design",
            "/api/admin/tasks"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
