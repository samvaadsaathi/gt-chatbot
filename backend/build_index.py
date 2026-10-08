import sys
from pathlib import Path

# Add backend to path
sys.path.append(str(Path(__file__).resolve().parent))

from app.services.pdf_service import process_document_bytes
from app.services.rag_service import add_to_index, FAISS_INDEX_PATH

DOCUMENTS_FOLDER = Path(__file__).resolve().parent / "Documents"
ALLOWED_EXTS = {".pdf", ".txt", ".md"}


def build_index():
    print(f"[Build Index] Scanning documents in: {DOCUMENTS_FOLDER}")

    if not DOCUMENTS_FOLDER.exists():
        print(f"[Build Index] Error: Folder '{DOCUMENTS_FOLDER}' does not exist.")
        return

    doc_files = sorted([f for f in DOCUMENTS_FOLDER.glob("*.*") if f.suffix.lower() in ALLOWED_EXTS])

    if not doc_files:
        print("[Build Index] No document files found in Documents directory.")
        return

    print(f"[Build Index] Found {len(doc_files)} document files to index.")
    all_chunks = []

    for doc_file in doc_files:
        print(f"-> Extracting chunks from: {doc_file.name} ({round(doc_file.stat().st_size / 1024, 1)} KB)")
        with open(doc_file, "rb") as f:
            file_bytes = f.read()

        chunks = process_document_bytes(file_bytes, filename=doc_file.name)
        print(f"   Created {len(chunks)} chunks.")
        all_chunks.extend(chunks)

    print(f"\n[Build Index] Total chunks extracted across all documents: {len(all_chunks)}")
    print(f"[Build Index] Embedding and building clean FAISS vector database...")

    import os
    import shutil
    import app.services.rag_service as rag_mod
    rag_mod._vector_store = None
    if os.path.exists(FAISS_INDEX_PATH):
        shutil.rmtree(FAISS_INDEX_PATH, ignore_errors=True)

    add_to_index(all_chunks)

    print("\n==========================================")
    print(f"Indexing Complete!")
    print(f"Total Chunks Indexed: {len(all_chunks)}")
    print(f"Index successfully saved to: {FAISS_INDEX_PATH}")
    print("==========================================")


if __name__ == "__main__":
    build_index()