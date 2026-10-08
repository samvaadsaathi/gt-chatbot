import os
import warnings
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routes import chatbot, upload, faq
from app.services.rag_service import get_vector_store, get_index_stats
from app.services.gemini_service import API_KEY

# Suppress framework deprecation warnings
warnings.filterwarnings('ignore', category=DeprecationWarning)

# Load environment variables
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Pre-warm in-memory vector store on server boot
    for instant sub-second responses.
    """
    print(
        "[Server Boot] Pre-warming Gram Tarang "
        "RAG vector store and embeddings..."
    )
    try:
        vs = get_vector_store()
        if vs is not None:
            stats = get_index_stats()
            print(
                f"[Server Boot] Vector store ready! "
                f"Total vectors: {stats.get('total_vectors')}"
            )
        else:
            print(
                "[Server Boot] Vector store not found on disk; "
                "will build on demand."
            )
    except Exception as e:
        print(f"[Server Boot] Warm-up notice: {e}")
    yield
    print("[Server Shutdown] Clean shutdown completed.")


app = FastAPI(
    title="Gram Tarang Employability & AI Portal API",
    description=(
        "High-performance RAG Vector Search & "
        "Gemini Conversational API for Gram Tarang"
    ),
    version="2.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(chatbot.router)
app.include_router(upload.router)
app.include_router(faq.router)


@app.get("/")
def health_check():
    return {
        "status": "success",
        "service": "Gram Tarang Employability AI & RAG Backend",
        "version": "2.0.0",
        "gemini_api_configured": bool(API_KEY)
    }


@app.get("/api/health")
def deep_health_check():
    """Deep diagnostics endpoint for UI System Status monitor."""
    index_stats = get_index_stats()
    return {
        "status": "healthy",
        "version": "2.0.0",
        "gemini_api_configured": bool(API_KEY),
        "rag_index": index_stats,
        "environment": os.getenv("ENV", "production")
    }
