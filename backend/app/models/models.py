import datetime
import uuid
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), default="user") # 'user', 'admin', 'officer'
    organization = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    feedback = relationship("Feedback", back_populates="user")

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    title = Column(String(255), default="New Query")
    language = Column(String(10), default="en") # 'en', 'hi', 'mr'
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan", order_by="Message.created_at")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    conversation_id = Column(String(36), ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False)
    sender = Column(String(20), nullable=False) # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    intent = Column(String(100), nullable=True)
    confidence = Column(Float, nullable=True)
    sources_json = Column(Text, nullable=True) # JSON string of source citations
    explainability_json = Column(Text, nullable=True) # JSON string of reasoning/retrieved chunks
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    conversation = relationship("Conversation", back_populates="messages")
    feedback = relationship("Feedback", back_populates="message")

class Standard(Base):
    __tablename__ = "standards"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    standard_number = Column(String(100), index=True, nullable=False)
    title = Column(Text, nullable=False, index=True)
    date_of_publish = Column(String(50), nullable=True)
    type_of_standard = Column(String(100), nullable=True)
    degree_of_equivalence = Column(String(100), nullable=True)
    product_category = Column(String(150), nullable=True, index=True)
    is_mandatory = Column(Boolean, default=False)
    certification_scheme = Column(String(100), default="Scheme I (ISI Mark)")
    summary = Column(Text, nullable=True)
    key_requirements = Column(Text, nullable=True)
    source_url = Column(String(500), nullable=True)

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    document_id = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    document_type = Column(String(100), default="Indian Standard") # 'Indian Standard', 'Manual', 'Circular', 'QCO', 'Guidelines'
    standard_number = Column(String(100), index=True, nullable=True)
    version = Column(String(50), nullable=True)
    source_url = Column(String(500), nullable=True)
    status = Column(String(50), default="Indexed") # 'Uploaded', 'Processing', 'Indexed', 'Failed'
    total_chunks = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    document_id = Column(String(100), ForeignKey("documents.document_id", ondelete="CASCADE"), nullable=True)
    standard_number = Column(String(100), index=True, nullable=True)
    title = Column(String(255), nullable=False)
    clause_number = Column(String(50), nullable=True, index=True)
    sub_clause = Column(String(50), nullable=True)
    page_number = Column(Integer, nullable=True)
    product_category = Column(String(100), nullable=True, index=True)
    content = Column(Text, nullable=False)
    metadata_json = Column(Text, nullable=True)
    embedding_json = Column(Text, nullable=True) # Precomputed embedding vector as JSON array
    
    document = relationship("Document", back_populates="chunks")

class Laboratory(Base):
    __tablename__ = "laboratories"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    lab_name = Column(String(255), nullable=False)
    state = Column(String(100), nullable=False, index=True)
    city = Column(String(100), nullable=False, index=True)
    address = Column(Text, nullable=True)
    contact = Column(String(255), nullable=True)
    accredited_scope = Column(Text, nullable=True)
    recognized_standards = Column(Text, nullable=True) # Comma-separated or JSON list
    status = Column(String(50), default="Active")

class Feedback(Base):
    __tablename__ = "feedback"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    message_id = Column(String(36), ForeignKey("messages.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    rating = Column(Integer, nullable=False) # 1 for thumbs up, -1 for thumbs down
    comment = Column(Text, nullable=True)
    query = Column(Text, nullable=True)
    answer = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    message = relationship("Message", back_populates="feedback")
    user = relationship("User", back_populates="feedback")

class SearchLog(Base):
    __tablename__ = "search_logs"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(36), nullable=True)
    query = Column(Text, nullable=False)
    intent = Column(String(100), nullable=True)
    detected_entities = Column(Text, nullable=True) # JSON
    results_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
