import os
from typing import Optional

try:
    from pydantic_settings import BaseSettings
except ImportError:
    try:
        from pydantic import BaseSettings
    except ImportError:
        class BaseSettings:
            def __init__(self, **kwargs):
                for k, v in kwargs.items():
                    setattr(self, k, v)

class Settings(BaseSettings):
    PROJECT_NAME: str = "MANAKAI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "bis-smartassist-secret-sih26107-token-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./bis_smartassist.db")
    USE_PGVECTOR: bool = False
    
    # LLM API Settings
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "auto")  # auto, gemini, openai, local_grounded
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gemini-1.5-flash")
    
    # Embedding settings
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    EMBEDDING_DIM: int = 384
    
    # RAG Retrieval Settings
    TOP_K_RETRIEVAL: int = int(os.getenv("TOP_K_RETRIEVAL", "5"))
    RAG_BM25_TOP_K: int = int(os.getenv("RAG_BM25_TOP_K", "25"))
    RAG_VECTOR_TOP_K: int = int(os.getenv("RAG_VECTOR_TOP_K", "25"))
    RAG_CANDIDATE_TOP_K: int = int(os.getenv("RAG_CANDIDATE_TOP_K", "40"))
    RAG_FINAL_TOP_K: int = int(os.getenv("RAG_FINAL_TOP_K", "5"))
    RAG_RERANK_ENABLED: bool = os.getenv("RAG_RERANK_ENABLED", "true").lower() in ("true", "1", "yes")
    RAG_RERANKER_MODEL: str = os.getenv("RAG_RERANKER_MODEL", "cross-encoder/ms-marco-MiniLM-L-6-v2")
    RAG_DEBUG_MODE: bool = os.getenv("RAG_DEBUG_MODE", "false").lower() in ("true", "1", "yes")

    # Confidence Thresholds
    CONFIDENCE_VERY_HIGH_THRESHOLD: float = float(os.getenv("CONFIDENCE_VERY_HIGH_THRESHOLD", "0.88"))
    CONFIDENCE_HIGH_THRESHOLD: float = float(os.getenv("CONFIDENCE_HIGH_THRESHOLD", "0.72"))
    CONFIDENCE_MEDIUM_THRESHOLD: float = float(os.getenv("CONFIDENCE_MEDIUM_THRESHOLD", "0.50"))
    SIMILARITY_THRESHOLD: float = float(os.getenv("SIMILARITY_THRESHOLD", "0.35"))
    
    # Paths
    CHROMA_PATH: str = os.getenv("CHROMA_PATH", "./data/chroma_db")
    BOOKLETS_DIR: str = os.getenv("BOOKLETS_DIR", "./data/raw/booklets")
    RAW_DATA_PATH: str = os.getenv("RAW_DATA_PATH", "./data/raw/bis_standards.csv")
    CLEAN_DATA_PATH: str = os.getenv("CLEAN_DATA_PATH", "./data/processed/bis_standards_clean.csv")
    REPORT_PATH: str = os.getenv("REPORT_PATH", "./data/processed/data_quality_report.json")
    
    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8000"]
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()


