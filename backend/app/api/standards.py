from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_

from backend.app.core.database import get_db
from backend.app.models.models import Standard, DocumentChunk
from backend.app.schemas.schemas import StandardOut, ProductFinderRequest, ProductFinderResponse, ProductFinderResult
from backend.app.rag.retriever import hybrid_retriever

router = APIRouter(prefix="/standards", tags=["Indian Standards"])

@router.get("", response_model=List[StandardOut])
def get_standards(
    search: Optional[str] = Query(None, description="Search term for standard number or title"),
    category: Optional[str] = Query(None, description="Filter by product category"),
    mandatory_only: Optional[bool] = Query(False, description="Filter for mandatory standards under QCO"),
    semantic: Optional[bool] = Query(False, description="Use neural semantic embedding search"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    # Semantic search mode
    if semantic and search and search.strip():
        semantic_results = hybrid_retriever.search_standards_semantic(search.strip(), top_k=limit, category=category)
        if semantic_results:
            std_nums = [item["standard_number"] for item in semantic_results]
            stds = db.query(Standard).filter(Standard.standard_number.in_(std_nums)).all()
            std_map = {s.standard_number: s for s in stds}
            ordered_stds = [std_map[num] for num in std_nums if num in std_map]
            if mandatory_only:
                ordered_stds = [s for s in ordered_stds if s.is_mandatory]
            return ordered_stds

    query = db.query(Standard)
    
    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Standard.standard_number.ilike(search_term),
                Standard.title.ilike(search_term),
                Standard.product_category.ilike(search_term)
            )
        )
    
    if category and category != "All":
        query = query.filter(Standard.product_category == category)
        
    if mandatory_only:
        query = query.filter(Standard.is_mandatory == True)
        
    return query.order_by(Standard.id.asc()).offset(offset).limit(limit).all()

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Standard.product_category).distinct().all()
    clean_cats = [c[0] for c in categories if c[0]]
    clean_cats.sort()
    return clean_cats

@router.get("/{standard_id}", response_model=StandardOut)
def get_standard_by_id(standard_id: int, db: Session = Depends(get_db)):
    std = db.query(Standard).filter(Standard.id == standard_id).first()
    if not std:
        raise HTTPException(status_code=404, detail="Standard not found")
    return std

@router.post("/product-finder", response_model=ProductFinderResponse)
def product_standard_finder(req: ProductFinderRequest, db: Session = Depends(get_db)):
    product_query = req.product_name.strip()
    category = req.category
    
    # 1. First try Neural Vector Search across 23,866 Indian Standards
    matched_stds = []
    semantic_matches = hybrid_retriever.search_standards_semantic(product_query, top_k=8, category=category)
    
    if semantic_matches:
        std_nums = [m["standard_number"] for m in semantic_matches]
        stds_from_db = db.query(Standard).filter(Standard.standard_number.in_(std_nums)).all()
        std_map = {s.standard_number: s for s in stds_from_db}
        matched_stds = [std_map[num] for num in std_nums if num in std_map]

    # 2. If neural search returned fewer than 3 matches, supplement with SQL ILIKE
    if len(matched_stds) < 3:
        search_term = f"%{product_query}%"
        db_query = db.query(Standard).filter(
            or_(
                Standard.title.ilike(search_term),
                Standard.standard_number.ilike(search_term),
                Standard.product_category.ilike(search_term)
            )
        )
        if category and category != "All":
            db_query = db_query.filter(Standard.product_category == category)
            
        additional = db_query.limit(8).all()
        seen = {s.standard_number for s in matched_stds}
        for s in additional:
            if s.standard_number not in seen:
                matched_stds.append(s)
                seen.add(s.standard_number)

    # 3. Query any deep document chunks for these standards
    results = []
    for s in matched_stds[:8]:
        chunks = db.query(DocumentChunk).filter(
            DocumentChunk.standard_number.ilike(f"%{s.standard_number.split(':')[0]}%")
        ).all()
        
        reqs = []
        testing = []
        clauses_list = []
        
        if chunks:
            for c in chunks:
                if c.clause_number:
                    clauses_list.append(f"{c.clause_number}: {c.content[:80]}...")
                if "test" in c.content.lower() or "strength" in c.content.lower():
                    testing.append(c.content[:150])
                else:
                    reqs.append(c.content[:150])
        else:
            reqs = [
                s.key_requirements or "Conformity to dimensions, material specification, and performance criteria.",
                f"Sampling according to BIS Scheme of Inspection and Testing (SIT)."
            ]
            testing = [
                "Routine factory testing according to standard methods.",
                "Third-party independent testing at BIS-recognized laboratory."
            ]

        results.append(ProductFinderResult(
            standard_number=s.standard_number,
            title=s.title,
            product_category=s.product_category or "Technical Product",
            relevance="High" if s.is_mandatory else "Recommended",
            is_mandatory=s.is_mandatory,
            certification_scheme=s.certification_scheme or "Scheme I (ISI Mark)",
            key_requirements=reqs[:3],
            testing_requirements=testing[:2],
            source_url=s.source_url or "https://www.services.bis.gov.in/",
            clauses=clauses_list[:3]
        ))

    detected_cat = category if category and category != "All" else (results[0].product_category if results else "General")
    overview = (
        f"Found {len(results)} relevant Indian Standard(s) applicable to '{product_query}'. "
        f"Under BIS regulations and relevant Quality Control Orders (QCOs), products must conform to the specified standard before commercial distribution in India."
    ) if results else f"No direct Indian Standards found matching '{product_query}'. Try searching by generic term or category."

    return ProductFinderResponse(
        query_product=product_query,
        detected_category=detected_cat,
        overview=overview,
        standards=results
    )

@router.get("/booklets/search")
def search_booklets(
    q: str = Query(..., description="Search query for BIS Departmental Resource Booklets"),
    top_k: int = Query(5, ge=1, le=20)
):
    """
    Searches across all 17 official BIS Departmental Resource Handouts & Technical Booklets
    (e.g., Automotive Braking, Building Materials, Machine Safety, Medical Textiles, Petroleum).
    """
    results = hybrid_retriever.search_booklets(query=q, top_k=top_k)
    return {
        "query": q,
        "total_results": len(results),
        "results": results
    }

