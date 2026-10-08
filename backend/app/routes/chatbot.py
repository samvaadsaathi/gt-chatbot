import time
import asyncio
import re
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field, model_validator

from app.services import gemini_service
from app.services.rag_service import retrieve_context
from app.routes.faq import FAQS

router = APIRouter(prefix="/api", tags=["Chatbot"])


class MessageItem(BaseModel):
    role: str = Field(..., description="Role: 'user' or 'assistant'")
    content: str = Field(..., description="Message text")


class ChatRequest(BaseModel):
    query: Optional[str] = Field(default=None, min_length=1, max_length=2000, description="User query")
    message: Optional[str] = Field(default=None, description="Alternative field for user query")
    history: Optional[List[MessageItem]] = Field(default=[], description="Recent conversation turns")

    @model_validator(mode="before")
    @classmethod
    def populate_query(cls, values: dict):
        if isinstance(values, dict):
            if not values.get("query") and values.get("message"):
                values["query"] = values["message"]
            elif not values.get("query") and not values.get("message"):
                raise ValueError("Either 'query' or 'message' is required.")
        return values


class SourceCitation(BaseModel):
    document: str
    page: int
    relevance_score: float
    preview: str


class ChatResponse(BaseModel):
    answer: str
    source_type: str  # "faq", "rag", or "llm_direct"
    sources: List[SourceCitation] = []
    latency_ms: float
    status: str = "success"


def find_best_faq_match(query: str, threshold: float = 0.65) -> Optional[str]:
    """
    Find best FAQ match using normalized token similarity and keyword containment.
    """
    clean_q = re.sub(r'[^\w\s]', '', query.lower()).strip()
    q_tokens = set(clean_q.split())
    if not q_tokens:
        return None

    best_score = 0.0
    best_answer = None

    for faq in FAQS:
        faq_q = re.sub(r'[^\w\s]', '', faq["question"].lower()).strip()
        faq_tokens = set(faq_q.split())

        # Jaccard / Token overlap
        intersection = q_tokens.intersection(faq_tokens)
        union = q_tokens.union(faq_tokens)
        jaccard_score = len(intersection) / len(union) if union else 0.0

        # Substring / phrase bonus
        containment_score = 0.0
        if clean_q in faq_q or faq_q in clean_q:
            containment_score = 0.4

        final_score = jaccard_score + containment_score

        if final_score > best_score:
            best_score = final_score
            best_answer = faq["answer"]

    if best_score >= threshold:
        print(f"[FAQ Match] Score: {best_score:.2f} for query '{query[:40]}'")
        return best_answer

    return None


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Core RAG Chat endpoint with multi-turn history, FAQ caching, and source citations.
    """
    start_time = time.time()
    query_text = request.query.strip()

    if not query_text:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    try:
        # Step 1: FAQ High-Speed Match
        faq_answer = find_best_faq_match(query_text, threshold=0.7)
        if faq_answer:
            latency = round((time.time() - start_time) * 1000, 2)
            return ChatResponse(
                answer=faq_answer,
                source_type="faq",
                sources=[
                    SourceCitation(
                        document="Gram Tarang Official FAQs",
                        page=1,
                        relevance_score=1.0,
                        preview=faq_answer[:120] + "..."
                    )
                ],
                latency_ms=latency
            )

        # Step 2: In-Memory FAISS Vector Retrieval
        context_chunks, source_citations = retrieve_context(query_text, top_k=6)
        context_str = "\n\n".join(context_chunks)

        # Format history for multi-turn Gemini reasoning
        history_dicts = [{"role": msg.role, "content": msg.content} for msg in request.history]

        # Step 3: Gemini Synthesis
        source_type = "rag" if context_chunks else "llm_direct"
        answer = gemini_service.generate_answer(
            query=query_text,
            context=context_str,
            history=history_dicts
        )

        latency = round((time.time() - start_time) * 1000, 2)

        return ChatResponse(
            answer=answer,
            source_type=source_type,
            sources=[SourceCitation(**s) for s in source_citations],
            latency_ms=latency
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"[Chatbot Endpoint Error]: {e}")
        latency = round((time.time() - start_time) * 1000, 2)
        return ChatResponse(
            answer="I am currently having trouble processing your query. Please contact Gram Tarang directly at +91-674-2386827 or info@gramtarang.org.in.",
            source_type="fallback",
            sources=[],
            latency_ms=latency,
            status="error"
        )


@router.post("/chat/stream")
async def chat_stream_endpoint(request: ChatRequest):
    """
    Server-Sent Events (SSE) Streaming endpoint for real-time word-by-word streaming.
    """
    query_text = request.query.strip()
    if not query_text:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    # Check FAQ first
    faq_answer = find_best_faq_match(query_text, threshold=0.7)
    if faq_answer:
        async def stream_faq():
            words = faq_answer.split(" ")
            for w in words:
                yield f"data: {w} \n\n"
                await asyncio.sleep(0.015)
            yield "data: [DONE]\n\n"
        return StreamingResponse(stream_faq(), media_type="text/event-stream")

    context_chunks, _ = retrieve_context(query_text, top_k=3)
    context_str = "\n\n".join(context_chunks)
    history_dicts = [{"role": msg.role, "content": msg.content} for msg in request.history]

    def stream_gemini():
        for chunk in gemini_service.generate_answer_stream(query_text, context_str, history_dicts):
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(stream_gemini(), media_type="text/event-stream")