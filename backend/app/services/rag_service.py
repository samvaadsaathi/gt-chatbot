import os
import threading
from typing import List, Dict, Any, Tuple
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
FAISS_INDEX_PATH = str(BASE_DIR / "faiss_index")
DOCUMENTS_FOLDER = BASE_DIR / "Documents"

# Singleton state
_vector_store: Any = None
_embeddings: Any = None
_lock = threading.RLock()


def _load_embeddings_class() -> Any:
    """Safely load HuggingFace embeddings class with fallback."""
    try:
        from langchain_huggingface import (  # type: ignore
            HuggingFaceEmbeddings,
        )
        return HuggingFaceEmbeddings
    except ImportError:
        from langchain_community.embeddings import (  # type: ignore
            HuggingFaceEmbeddings as FallbackEmbeddings,
        )
        return FallbackEmbeddings


def _get_faiss_class() -> Any:
    """Safely load FAISS vector store class."""
    from langchain_community.vectorstores import (  # type: ignore
        FAISS,
    )
    return FAISS


def get_embeddings() -> Any:
    """Lazy load HuggingFace Embeddings model into memory once."""
    global _embeddings
    if _embeddings is None:
        with _lock:
            if _embeddings is None:
                print(
                    "[RAG Service] Loading HuggingFace embeddings: "
                    "all-MiniLM-L6-v2..."
                )
                embeddings_cls = _load_embeddings_class()
                _embeddings = embeddings_cls(
                    model_name="all-MiniLM-L6-v2",
                    model_kwargs={"device": "cpu"},
                    encode_kwargs={"normalize_embeddings": True}
                )
                print("[RAG Service] Embeddings model loaded successfully.")
    return _embeddings


def get_vector_store() -> Any:
    """Thread-safe access to cached in-memory FAISS vector store."""
    global _vector_store
    if _vector_store is None:
        with _lock:
            if _vector_store is None:
                if os.path.exists(FAISS_INDEX_PATH):
                    print(
                        f"[RAG Service] Loading FAISS index into memory "
                        f"from {FAISS_INDEX_PATH}..."
                    )
                    FAISS = _get_faiss_class()
                    embed = get_embeddings()
                    _vector_store = FAISS.load_local(
                        FAISS_INDEX_PATH,
                        embed,
                        allow_dangerous_deserialization=True
                    )
                    print("[RAG Service] FAISS index loaded into RAM.")
                else:
                    print(
                        "[RAG Service] No existing FAISS index "
                        "found on disk."
                    )
    return _vector_store


def add_to_index(chunks: List[Any]) -> None:
    """
    Add document chunks to FAISS vector database.
    Accepts either list of dicts (with 'text', 'source', 'page')
    or list of strings.
    """
    global _vector_store
    if not chunks:
        print("[RAG Service] No chunks provided to index.")
        return

    # Initialize embeddings first outside lock
    embed = get_embeddings()

    with _lock:
        FAISS = _get_faiss_class()

        texts: List[str] = []
        metadatas: List[Dict[str, Any]] = []

        for item in chunks:
            if isinstance(item, dict):
                texts.append(str(item.get("text", "")))
                metadatas.append({
                    "source": item.get("source", "uploaded_document.pdf"),
                    "page": item.get("page", 1),
                    "chunk_id": item.get("chunk_id", "")
                })
            else:
                texts.append(str(item))
                metadatas.append({"source": "manual_entry", "page": 1})

        if _vector_store is not None:
            print(
                f"[RAG Service] Appending {len(texts)} chunks "
                "to in-memory FAISS index..."
            )
            _vector_store.add_texts(texts=texts, metadatas=metadatas)
        else:
            if os.path.exists(FAISS_INDEX_PATH):
                _vector_store = FAISS.load_local(
                    FAISS_INDEX_PATH,
                    embed,
                    allow_dangerous_deserialization=True
                )
                _vector_store.add_texts(texts=texts, metadatas=metadatas)
            else:
                print(
                    f"[RAG Service] Initializing new FAISS index "
                    f"with {len(texts)} chunks..."
                )
                _vector_store = FAISS.from_texts(
                    texts=texts,
                    embedding=embed,
                    metadatas=metadatas
                )

        # Persist updated index to disk
        os.makedirs(FAISS_INDEX_PATH, exist_ok=True)
        _vector_store.save_local(FAISS_INDEX_PATH)
        print(
            f"[RAG Service] Index updated and persisted to "
            f"{FAISS_INDEX_PATH}."
        )


def retrieve_context(
    query: str,
    top_k: int = 6
) -> Tuple[List[str], List[Dict[str, Any]]]:
    """
    Retrieve top relevant chunks from in-memory FAISS with normalized scores.
    Returns: (list_of_text_chunks, list_of_source_metadata_dicts)
    """
    try:
        vs = get_vector_store()
        if vs is None:
            return [], []

        results = vs.similarity_search_with_score(query, k=top_k * 2)
        query_words = set(query.lower().split())

        scored_candidates = []
        for doc, distance in results:
            content = doc.page_content
            distance_val = float(distance)
            sim_score = max(0.0, 1.0 - (distance_val / 2.0))

            # Light lexical boost for exact keyword matches
            word_matches = sum(
                1 for w in query_words if len(w) > 3 and w in content.lower()
            )
            boost = min(0.15, word_matches * 0.04)
            final_score = float(min(1.0, sim_score + boost))

            scored_candidates.append((doc, final_score))

        scored_candidates.sort(key=lambda x: x[1], reverse=True)

        selected_texts: List[str] = []
        selected_sources: List[Dict[str, Any]] = []
        seen_texts = set()

        for doc, score in scored_candidates[:top_k]:
            clean_content = doc.page_content.strip()
            snippet_key = clean_content[:80]
            if snippet_key in seen_texts:
                continue
            seen_texts.add(snippet_key)

            selected_texts.append(clean_content)
            selected_sources.append({
                "document": str(
                    doc.metadata.get("source", "Gram Tarang Knowledge Base")
                ),
                "page": int(doc.metadata.get("page", 1)),
                "relevance_score": round(float(score), 3),
                "preview": clean_content[:120] + "..."
            })

        print(
            f"[RAG Service] Retrieved {len(selected_texts)} "
            f"relevant chunks for query: '{query[:40]}...'"
        )
        return selected_texts, selected_sources

    except Exception as e:
        print(f"[RAG Service] Retrieval error: {e}")
        return [], []


def get_index_stats() -> Dict[str, Any]:
    """Return health and statistics about the vector store."""
    try:
        vs = get_vector_store()
        if vs is None:
            return {
                "status": "not_initialized",
                "total_vectors": 0,
                "index_path": FAISS_INDEX_PATH
            }

        total_vectors = vs.index.ntotal if hasattr(vs, "index") else 0
        docs: List[str] = []
        if DOCUMENTS_FOLDER.exists():
            docs = sorted([
                f.name for f in DOCUMENTS_FOLDER.glob("*.*")
                if f.suffix.lower() in [".pdf", ".txt", ".md"]
            ])

        return {
            "status": "active",
            "total_vectors": total_vectors,
            "embedding_model": "all-MiniLM-L6-v2 (384 dims, normalized)",
            "index_path": FAISS_INDEX_PATH,
            "source_documents": docs
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}


def rebuild_index() -> Dict[str, Any]:
    """
    Scan Documents folder and rebuild FAISS index from scratch
    for all .pdf, .txt, and .md files.
    """
    try:
        from app.services.pdf_service import (  # type: ignore
            process_document_bytes,
        )
    except ImportError:
        try:
            from .pdf_service import (  # type: ignore
                process_document_bytes,
            )
        except ImportError:
            from pdf_service import (  # type: ignore
                process_document_bytes,
            )

    if not DOCUMENTS_FOLDER.exists():
        return {
            "status": "error",
            "message": f"Folder {DOCUMENTS_FOLDER} does not exist"
        }

    valid_files = sorted([
        f for f in DOCUMENTS_FOLDER.glob("*.*")
        if f.suffix.lower() in [".pdf", ".txt", ".md"]
    ])
    if not valid_files:
        return {
            "status": "error",
            "message": (
                "No valid documents (.pdf, .txt, .md) "
                "found in Documents"
            )
        }

    all_chunks: List[Dict[str, Any]] = []
    for file_path in valid_files:
        try:
            with open(file_path, "rb") as f:
                doc_bytes = f.read()
            chunks = process_document_bytes(doc_bytes, filename=file_path.name)
            all_chunks.extend(chunks)
        except Exception as err:
            print(f"[RAG Rebuild] Error on {file_path.name}: {err}")

    if all_chunks:
        global _vector_store
        with _lock:
            _vector_store = None
            if os.path.exists(FAISS_INDEX_PATH):
                import shutil
                shutil.rmtree(FAISS_INDEX_PATH, ignore_errors=True)
            add_to_index(all_chunks)

    return {
        "status": "success",
        "indexed_files": len(valid_files),
        "total_chunks": len(all_chunks)
    }
