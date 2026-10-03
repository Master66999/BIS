"""
Unified Candidate Data Structure for BIS RAG Pipeline
Encapsulates standards, clause chunks, and departmental booklet sources with unified metadata.
"""

from typing import Optional, Dict, Any, Literal
from dataclasses import dataclass, field
from backend.app.schemas.schemas import SourceCitation


@dataclass
class RetrievedCandidate:
    source_type: Literal["standard", "clause", "booklet", "catalog"]
    title: str
    content: str
    standard_number: Optional[str] = None
    clause: Optional[str] = None
    sub_clause: Optional[str] = None
    page: Optional[int] = None
    booklet_name: Optional[str] = None
    department: Optional[str] = None
    document_id: Optional[str] = None
    source_url: Optional[str] = None
    bm25_score: float = 0.0
    vector_score: float = 0.0
    normalized_score: float = 0.0
    rerank_score: Optional[float] = None
    final_score: float = 0.0
    evidence_snippet: str = ""
    metadata: Dict[str, Any] = field(default_factory=dict)

    @property
    def deduplication_key(self) -> str:
        """Returns a canonical key for deduplicating candidates across retrieval channels."""
        if self.source_type == "clause" and self.standard_number:
            cl = self.clause or "general"
            return f"clause:{self.standard_number.upper().strip()}:{cl.upper().strip()}"
        elif self.source_type == "booklet" and self.booklet_name:
            pg = self.page or 1
            return f"booklet:{self.booklet_name.lower().strip()}:p{pg}"
        elif self.standard_number:
            return f"standard:{self.standard_number.upper().strip()}"
        return f"doc:{self.document_id or hash(self.title)}"

    def to_citation(self) -> SourceCitation:
        """Converts candidate to API SourceCitation schema."""
        snippet = self.evidence_snippet or (self.content[:240] + "..." if len(self.content) > 240 else self.content)
        return SourceCitation(
            document_id=self.document_id or self.source_type.upper(),
            title=self.title,
            standard_number=self.standard_number,
            clause=self.clause,
            sub_clause=self.sub_clause,
            page=self.page,
            source_url=self.source_url or "https://www.services.bis.gov.in/",
            relevance_score=round(self.final_score, 3),
            evidence_snippet=snippet,
            source_type=self.source_type,
            booklet_name=self.booklet_name,
            department=self.department,
            rerank_score=round(self.rerank_score, 3) if self.rerank_score is not None else None,
            final_score=round(self.final_score, 3)
        )
