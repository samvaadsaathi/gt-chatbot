import os
from pathlib import Path
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.pdf_service import process_document_bytes
from app.services.rag_service import add_to_index, get_index_stats, rebuild_index, DOCUMENTS_FOLDER

router = APIRouter(prefix="/api", tags=["Documents & Knowledge Base"])

ALLOWED_EXTENSIONS = {".pdf", ".txt", ".md"}
MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB


@router.post("/upload")
async def upload_files(
    files: List[UploadFile] = File(...)
):
    """
    Upload one or multiple PDF/text files, save to Documents, and index immediately into FAISS.
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files provided.")

    os.makedirs(DOCUMENTS_FOLDER, exist_ok=True)
    results = []

    for file in files:
        filename = file.filename or "uploaded_doc.pdf"
        ext = Path(filename).suffix.lower()

        if ext not in ALLOWED_EXTENSIONS:
            results.append({
                "filename": filename,
                "status": "error",
                "message": f"Unsupported file type '{ext}'. Allowed: .pdf, .txt, .md"
            })
            continue

        try:
            content_bytes = await file.read()
            if len(content_bytes) > MAX_FILE_SIZE:
                results.append({
                    "filename": filename,
                    "status": "error",
                    "message": "File exceeds maximum size limit of 25MB."
                })
                continue

            # Save file to Documents directory
            target_path = Path(DOCUMENTS_FOLDER) / filename
            with open(target_path, "wb") as f:
                f.write(content_bytes)

            # Process and chunk
            chunks = process_document_bytes(content_bytes, filename=filename)

            if not chunks:
                results.append({
                    "filename": filename,
                    "status": "warning",
                    "message": "File saved but no readable text could be extracted."
                })
                continue

            # Add immediately to in-memory and on-disk Vector Store (Auto-RAG)
            add_to_index(chunks)

            results.append({
                "filename": filename,
                "status": "success",
                "chunks_indexed": len(chunks)
            })

        except Exception as e:
            print(f"[Upload Error] {filename}: {e}")
            results.append({
                "filename": filename,
                "status": "error",
                "message": str(e)
            })

    return {
        "status": "completed",
        "results": results,
        "index_stats": get_index_stats()
    }


@router.get("/documents")
def list_documents():
    """
    List all documents currently stored in the knowledge base and index stats.
    """
    os.makedirs(DOCUMENTS_FOLDER, exist_ok=True)
    doc_list = []

    for p in sorted(Path(DOCUMENTS_FOLDER).glob("*.*")):
        if p.suffix.lower() in ALLOWED_EXTENSIONS:
            doc_list.append({
                "name": p.name,
                "size_kb": round(p.stat().st_size / 1024, 1),
                "last_modified": p.stat().st_mtime
            })

    return {
        "documents": doc_list,
        "stats": get_index_stats()
    }


@router.post("/reindex")
def trigger_reindex():
    """
    Rebuild the entire FAISS vector database from all documents in Documents folder.
    """
    try:
        result = rebuild_index()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/documents/{filename}")
def delete_document(filename: str):
    """
    Delete a document from Documents folder and automatically re-index the vector store.
    """
    safe_name = Path(filename).name
    target_path = Path(DOCUMENTS_FOLDER) / safe_name

    if not target_path.exists():
        raise HTTPException(status_code=404, detail=f"Document '{safe_name}' not found.")

    try:
        target_path.unlink()
        reindex_result = rebuild_index()
        return {
            "status": "success",
            "message": f"Document '{safe_name}' successfully removed and vector index rebuilt.",
            "reindex": reindex_result,
            "stats": get_index_stats()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete document: {e}")


@router.get("/documents/{filename}/preview")
def preview_document(filename: str):
    """
    Preview the first 3500 characters and extracted chunks of an indexed document.
    """
    safe_name = Path(filename).name
    target_path = Path(DOCUMENTS_FOLDER) / safe_name

    if not target_path.exists():
        raise HTTPException(status_code=404, detail=f"Document '{safe_name}' not found.")

    try:
        with open(target_path, "rb") as f:
            file_bytes = f.read()

        chunks = process_document_bytes(file_bytes, filename=safe_name)
        text_preview = ""
        if safe_name.lower().endswith((".txt", ".md")):
            text_preview = file_bytes.decode("utf-8", errors="ignore")[:3500]
        else:
            text_preview = "\n\n--- [Chunk Sample] ---\n\n".join([c["text"] for c in chunks[:4]])

        return {
            "filename": safe_name,
            "size_kb": round(target_path.stat().st_size / 1024, 1),
            "total_chunks": len(chunks),
            "preview_text": text_preview,
            "chunks_sample": chunks[:3]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to preview document: {e}")


@router.post("/admin/rag-test")
async def admin_rag_test(payload: dict):
    """
    Deep RAG Diagnostic query endpoint for Admin Console.
    Returns synthesized answer, raw retrieved vector chunks, scores, and sub-millisecond latencies.
    """
    import time
    from app.services.rag_service import retrieve_context
    from app.services import gemini_service

    query = (payload.get("query") or payload.get("message") or "").strip()
    top_k = int(payload.get("top_k", 6))

    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    t0 = time.time()
    context_chunks, source_citations = retrieve_context(query, top_k=top_k)
    t_retrieval = round((time.time() - t0) * 1000, 2)

    t1 = time.time()
    context_str = "\n\n".join(context_chunks)
    try:
        answer = gemini_service.generate_answer(query=query, context=context_str)
    except Exception as gen_err:
        print(f"[Admin RAG Test Gemini Error]: {gen_err}")
        answer = (
            "Here is the context retrieved from Gram Tarang official documentation:\n\n"
            + (context_str[:600] + "..." if context_str else "No context available.")
        )
    t_generation = round((time.time() - t1) * 1000, 2)
    t_total = round((time.time() - t0) * 1000, 2)

    stats = get_index_stats()

    return {
        "status": "success",
        "query": query,
        "answer": answer,
        "retrieval_latency_ms": t_retrieval,
        "generation_latency_ms": t_generation,
        "total_latency_ms": t_total,
        "chunks_retrieved_count": len(context_chunks),
        "source_citations": source_citations,
        "raw_chunks": context_chunks,
        "vector_store_stats": stats
    }