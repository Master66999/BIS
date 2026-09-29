import json
import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.models.models import Conversation, Message, SearchLog, Feedback, User
from backend.app.schemas.schemas import ChatRequest, ChatResponse, SourceCitation, ExplainabilityData, ConversationOut, MessageOut, FeedbackCreate, FeedbackOut
from backend.app.rag.query_understanding import classify_query
from backend.app.rag.retriever import hybrid_retriever
from backend.app.rag.generator import generate_rag_answer
from backend.app.rag.rl_optimizer import rl_optimizer
from backend.app.api.auth import get_current_user

router = APIRouter(prefix="", tags=["Chat & RAG"])

@router.post("/chat", response_model=ChatResponse)
def handle_chat(
    req: ChatRequest,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query_text = req.message.strip()
    if not query_text:
        raise HTTPException(status_code=400, detail="Query message cannot be empty.")

    # 1. Multi-Turn Conversation Management & Memory Retention
    conversation = None
    prior_intent = None
    prior_product = None
    prior_standard = None
    chat_history = []

    if req.conversation_id:
        conversation = db.query(Conversation).filter(Conversation.id == req.conversation_id).first()
        if conversation:
            past_msgs = db.query(Message).filter(
                Message.conversation_id == conversation.id
            ).order_by(Message.created_at.asc()).all()

            for m in past_msgs:
                chat_history.append({"role": m.sender, "content": m.content})
                if m.sender == "assistant":
                    if m.intent:
                        prior_intent = m.intent
                    # Extract active standard or product from explainability
                    if m.explainability_json:
                        try:
                            exp = json.loads(m.explainability_json)
                            det = exp.get("detected_entities", {})
                            if det.get("standard_number"):
                                prior_standard = det.get("standard_number")
                            if det.get("product"):
                                prior_product = det.get("product")
                            if exp.get("matched_standard"):
                                prior_standard = exp.get("matched_standard")
                        except Exception:
                            pass
                    # If still not found, check source citations
                    if not prior_standard and m.sources_json:
                        try:
                            s_list = json.loads(m.sources_json)
                            if s_list and s_list[0].get("standard_number"):
                                prior_standard = s_list[0].get("standard_number")
                        except Exception:
                            pass

    if not conversation:
        title_summary = query_text[:40] + ("..." if len(query_text) > 40 else "")
        conversation = Conversation(
            id=req.conversation_id or str(uuid.uuid4()),
            user_id=current_user.id if current_user else None,
            title=title_summary,
            language=req.language or "en"
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    else:
        conversation.updated_at = datetime.datetime.utcnow()

    # 2. Query Understanding (Intent & Entity Extraction with Memory)
    nlu_result = classify_query(
        query_text,
        prior_intent=prior_intent,
        prior_product=prior_product,
        prior_standard=prior_standard
    )
    intent = nlu_result["intent"]
    entities = nlu_result["entities"]
    detected_lang = req.language or nlu_result["language"] or "en"

    # Contextual query rewriting for retrieval:
    # If the user asks a follow-up query with pronouns ("it", "test", "clause", "limits", "lab", "how to apply")
    # or if the query doesn't explicitly repeat the standard number, expand the search query
    active_std = entities.get("standard_number") or prior_standard
    active_prod = entities.get("product") or prior_product

    effective_search_query = query_text
    if active_std and not any(kw in query_text.upper() for kw in ["IS ", "IS/", "ISO"]):
        effective_search_query = f"{active_std} {active_prod or ''} {query_text}".strip()

    # 3. Hybrid Retrieval & Reranking
    sources = []
    confidence = 0.50
    conf_level = "Medium"
    search_meta = {}

    if intent not in ["GREETING", "BOT_CAPABILITIES"]:
        sources, confidence, conf_level, search_meta = hybrid_retriever.retrieve(
            db=db,
            query=effective_search_query,
            intent=intent,
            entities=entities,
            top_k=4
        )
    else:
        confidence = 0.95
        conf_level = "High"
        search_meta = {"search_strategy": "Conversational Intent Handler"}

    # 4. RAG Grounded Answer Generation with Conversational Context
    answer_text = generate_rag_answer(
        query=query_text,
        intent=intent,
        entities=entities,
        sources=sources,
        confidence_level=conf_level,
        language=detected_lang,
        history=chat_history
    )

    # 5. Build Explainability Data
    explainability = ExplainabilityData(
        intent=intent,
        detected_entities=entities,
        query_language=detected_lang,
        retrieved_documents_count=len(sources),
        confidence_level=conf_level,
        confidence_score=confidence,
        search_strategy=search_meta.get("search_strategy", "Hybrid RAG"),
        reasoning_summary=f"Context: {active_std or active_prod or 'General'}. Query matched intent '{intent}' with {len(sources)} verified clause citations.",
        rl_action=search_meta.get("rl_action")
    )

    # 6. Save User & Assistant Messages
    user_msg = Message(
        id=str(uuid.uuid4()),
        conversation_id=conversation.id,
        sender="user",
        content=query_text
    )
    db.add(user_msg)

    sources_json_str = json.dumps([s.model_dump() for s in sources])
    explain_json_str = json.dumps(explainability.model_dump())

    assistant_msg = Message(
        id=str(uuid.uuid4()),
        conversation_id=conversation.id,
        sender="assistant",
        content=answer_text,
        intent=intent,
        confidence=confidence,
        sources_json=sources_json_str,
        explainability_json=explain_json_str
    )
    db.add(assistant_msg)

    # Log search for admin analytics
    log_entry = SearchLog(
        user_id=current_user.id if current_user else None,
        query=query_text,
        intent=intent,
        detected_entities=json.dumps(entities),
        results_count=len(sources)
    )
    db.add(log_entry)
    db.commit()

    return ChatResponse(
        conversation_id=conversation.id,
        message_id=assistant_msg.id,
        answer=answer_text,
        confidence=confidence,
        confidence_level=conf_level,
        intent=intent,
        sources=sources,
        explainability=explainability
    )

@router.get("/chat/conversations", response_model=List[ConversationOut])
def get_conversations(
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Conversation)
    if current_user:
        query = query.filter(Conversation.user_id == current_user.id)
    conversations = query.order_by(Conversation.updated_at.desc()).limit(20).all()

    result = []
    for c in conversations:
        msgs = db.query(Message).filter(Message.conversation_id == c.id).order_by(Message.created_at.asc()).all()
        msg_outs = []
        for m in msgs:
            sources_list = []
            if m.sources_json:
                try:
                    sources_list = [SourceCitation(**item) for item in json.loads(m.sources_json)]
                except Exception:
                    pass
            msg_outs.append(MessageOut(
                id=m.id,
                conversation_id=m.conversation_id,
                sender=m.sender,
                content=m.content,
                intent=m.intent,
                confidence=m.confidence,
                sources=sources_list,
                created_at=m.created_at
            ))
        result.append(ConversationOut(
            id=c.id,
            title=c.title,
            language=c.language,
            created_at=c.created_at,
            updated_at=c.updated_at,
            messages=msg_outs
        ))
    return result

@router.get("/chat/conversations/{conv_id}", response_model=ConversationOut)
def get_conversation_by_id(conv_id: str, db: Session = Depends(get_db)):
    c = db.query(Conversation).filter(Conversation.id == conv_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    msgs = db.query(Message).filter(Message.conversation_id == c.id).order_by(Message.created_at.asc()).all()
    msg_outs = []
    for m in msgs:
        sources_list = []
        if m.sources_json:
            try:
                sources_list = [SourceCitation(**item) for item in json.loads(m.sources_json)]
            except Exception:
                pass
        msg_outs.append(MessageOut(
            id=m.id,
            conversation_id=m.conversation_id,
            sender=m.sender,
            content=m.content,
            intent=m.intent,
            confidence=m.confidence,
            sources=sources_list,
            created_at=m.created_at
        ))
    return ConversationOut(
        id=c.id,
        title=c.title,
        language=c.language,
        created_at=c.created_at,
        updated_at=c.updated_at,
        messages=msg_outs
    )

@router.delete("/chat/conversations/{conv_id}")
def delete_conversation(conv_id: str, db: Session = Depends(get_db)):
    c = db.query(Conversation).filter(Conversation.id == conv_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Conversation not found")
    db.delete(c)
    db.commit()
    return {"message": "Conversation deleted successfully"}

@router.post("/feedback", response_model=FeedbackOut)
def submit_feedback(
    fb_in: FeedbackCreate,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    fb = Feedback(
        message_id=fb_in.message_id,
        user_id=current_user.id if current_user else None,
        rating=fb_in.rating,
        comment=fb_in.comment,
        query=fb_in.query,
        answer=fb_in.answer
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)

    # Online Reinforcement Learning from Human Feedback (RLHF) Update
    try:
        reward = 0.8 if fb_in.rating > 0 else -0.8
        target_intent = "GENERAL"
        target_action = {"dense_weight": 0.55, "bm25_weight": 0.45, "exact_boost": 0.40}
        
        if fb_in.message_id:
            m = db.query(Message).filter(Message.id == fb_in.message_id).first()
            if m and m.intent:
                target_intent = m.intent
            if m and m.explainability_json:
                exp = json.loads(m.explainability_json)
                if "rl_action" in exp:
                    target_action = exp["rl_action"]

        rl_optimizer.update_policy(target_intent, target_action, reward)
        rl_optimizer.log_interaction(fb_in.query or "", target_intent, target_action, reward)
    except Exception as e:
        pass

    return fb
