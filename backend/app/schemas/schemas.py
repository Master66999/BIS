from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from datetime import datetime

# --- Auth Schemas ---
class UserCreate(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None
    organization: Optional[str] = None
    role: Optional[str] = "user"

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    role: str
    organization: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[str] = None
    role: Optional[str] = None

# --- Chat & RAG Schemas ---
class SourceCitation(BaseModel):
    document_id: Optional[str] = None
    title: str
    standard_number: Optional[str] = None
    clause: Optional[str] = None
    sub_clause: Optional[str] = None
    page: Optional[int] = None
    booklet_name: Optional[str] = None
    department: Optional[str] = None
    source_type: Optional[str] = "standard"  # 'standard', 'clause', 'booklet', 'catalog'
    source_url: Optional[str] = None
    relevance_score: Optional[float] = None
    rerank_score: Optional[float] = None
    final_score: Optional[float] = None
    evidence_snippet: Optional[str] = None

class ExplainabilityData(BaseModel):
    intent: str
    detected_entities: Dict[str, Any] = {}
    query_language: str = "en"
    retrieved_documents_count: int = 0
    confidence_level: str = "High" # "VERY_HIGH", "High", "Medium", "Low"
    confidence_score: float = 0.85
    search_strategy: str = "Hybrid (BM25 + Dense Vector + Cross-Encoder Reranker)"
    reasoning_summary: Optional[str] = None
    rl_action: Optional[Dict[str, Any]] = None
    timing_ms: Optional[Dict[str, float]] = None
    confidence_breakdown: Optional[Dict[str, Any]] = None
    reranker_applied: bool = True


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    language: Optional[str] = "en" # 'en', 'hi', 'mr'
    stream: Optional[bool] = False

class ChatResponse(BaseModel):
    conversation_id: str
    message_id: str
    answer: str
    confidence: float
    confidence_level: str # 'High', 'Medium', 'Low'
    intent: str
    sources: List[SourceCitation] = []
    explainability: Optional[ExplainabilityData] = None

class MessageOut(BaseModel):
    id: str
    conversation_id: str
    sender: str
    content: str
    intent: Optional[str] = None
    confidence: Optional[float] = None
    sources: Optional[List[SourceCitation]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationOut(BaseModel):
    id: str
    title: str
    language: str
    created_at: datetime
    updated_at: datetime
    messages: List[MessageOut] = []

    class Config:
        from_attributes = True

# --- Standards Schemas ---
class StandardOut(BaseModel):
    id: int
    standard_number: str
    title: str
    date_of_publish: Optional[str] = None
    type_of_standard: Optional[str] = None
    degree_of_equivalence: Optional[str] = None
    product_category: Optional[str] = None
    is_mandatory: Optional[bool] = False
    certification_scheme: Optional[str] = "Scheme I (ISI Mark)"
    summary: Optional[str] = None
    key_requirements: Optional[str] = None
    source_url: Optional[str] = None

    class Config:
        from_attributes = True

class ProductFinderRequest(BaseModel):
    product_name: str
    category: Optional[str] = None
    description: Optional[str] = None

class ProductFinderResult(BaseModel):
    standard_number: str
    title: str
    product_category: str
    relevance: str # "High", "Medium", "Recommended"
    is_mandatory: bool
    certification_scheme: str
    key_requirements: List[str] = []
    testing_requirements: List[str] = []
    source_url: Optional[str] = None
    clauses: List[str] = []

class ProductFinderResponse(BaseModel):
    query_product: str
    detected_category: str
    overview: str
    standards: List[ProductFinderResult] = []

# --- Document Schemas ---
class DocumentOut(BaseModel):
    id: int
    document_id: str
    title: str
    document_type: str
    standard_number: Optional[str] = None
    version: Optional[str] = None
    source_url: Optional[str] = None
    status: str
    total_chunks: int
    created_at: datetime

    class Config:
        from_attributes = True

class DocumentChunkOut(BaseModel):
    id: int
    document_id: Optional[str] = None
    standard_number: Optional[str] = None
    title: str
    clause_number: Optional[str] = None
    sub_clause: Optional[str] = None
    page_number: Optional[int] = None
    product_category: Optional[str] = None
    content: str

    class Config:
        from_attributes = True

# --- Laboratory Schema ---
class LaboratoryOut(BaseModel):
    id: int
    lab_name: str
    state: str
    city: str
    address: Optional[str] = None
    contact: Optional[str] = None
    accredited_scope: Optional[str] = None
    recognized_standards: Optional[str] = None
    status: str

    class Config:
        from_attributes = True

# --- Feedback Schema ---
class FeedbackCreate(BaseModel):
    message_id: Optional[str] = None
    rating: int # 1 or -1
    comment: Optional[str] = None
    query: Optional[str] = None
    answer: Optional[str] = None

class FeedbackOut(BaseModel):
    id: int
    message_id: Optional[str] = None
    rating: int
    comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Admin & Health ---
class AdminStatsOut(BaseModel):
    total_documents: int
    total_standards: int
    total_chunks: int
    total_queries: int
    active_users: int
    average_retrieval_confidence: float
    unanswered_queries: int
    user_satisfaction_percent: float

class HealthOut(BaseModel):
    status: str
    version: str
    database: str
    standards_count: int
    llm_provider: str
