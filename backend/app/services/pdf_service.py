import io
import re
from pathlib import Path
from typing import List, Dict, Any
from pypdf import PdfReader  # type: ignore
from langchain_text_splitters import (  # type: ignore
    RecursiveCharacterTextSplitter,
)


def clean_text(text: str) -> str:
    """Clean extracted text by collapsing excessive whitespace."""
    if not text:
        return ""
    text = re.sub(r'[\r\n]+', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    return text.strip()


def process_document_bytes(
    file_bytes: bytes,
    filename: str = "document.pdf"
) -> List[Dict[str, Any]]:
    """
    Process document bytes (PDF, TXT, MD) and split into chunks with metadata.
    Returns: list of dicts: {
        "text": str,
        "source": str,
        "page": int,
        "chunk_id": str
    }
    """
    ext = Path(filename).suffix.lower()

    # Plain text / Markdown
    if ext in [".txt", ".md"]:
        try:
            raw_text = file_bytes.decode("utf-8", errors="ignore")
            cleaned = clean_text(raw_text)
            if not cleaned:
                return []

            splitter = RecursiveCharacterTextSplitter(
                chunk_size=550,
                chunk_overlap=100,
                length_function=len,
                separators=["\n\n", "\n", "### ", "## ", "# ", ". ", " ", ""]
            )
            split_texts = splitter.split_text(cleaned)
            chunks: List[Dict[str, Any]] = []
            for idx, chunk in enumerate(split_texts, 1):
                chunk_content = chunk.strip()
                if len(chunk_content) > 25:
                    chunks.append({
                        "text": chunk_content,
                        "source": filename,
                        "page": 1,
                        "chunk_id": f"{filename}_c{idx}"
                    })
            print(
                f"[Doc Service] Extracted {len(chunks)} chunks "
                f"from text file: {filename}"
            )
            return chunks
        except Exception as err:
            print(f"[Doc Service] Error reading text file {filename}: {err}")
            return []

    # PDF Processing
    try:
        pdf_file = io.BytesIO(file_bytes)
        reader = PdfReader(pdf_file)

        all_page_docs: List[Dict[str, Any]] = []
        for page_idx, page in enumerate(reader.pages):
            page_text = page.extract_text() or ""
            cleaned = clean_text(page_text)
            if cleaned:
                all_page_docs.append({
                    "text": cleaned,
                    "page": page_idx + 1,
                    "source": filename
                })

        if not all_page_docs:
            print(f"[Doc Service] No readable text found in PDF {filename}")
            return []

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=550,
            chunk_overlap=100,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""]
        )

        chunks_with_metadata: List[Dict[str, Any]] = []
        chunk_counter = 1

        for doc in all_page_docs:
            page_text_content = str(doc.get("text", ""))
            split_texts = splitter.split_text(page_text_content)
            for text_chunk in split_texts:
                clean_chunk = text_chunk.strip()
                if len(clean_chunk) < 25:
                    continue
                page_num = int(doc.get("page", 1))
                chunks_with_metadata.append({
                    "text": clean_chunk,
                    "source": filename,
                    "page": page_num,
                    "chunk_id": f"{filename}_p{page_num}_c{chunk_counter}"
                })
                chunk_counter += 1

        print(
            f"[Doc Service] Successfully processed {filename}: "
            f"{len(chunks_with_metadata)} chunks created."
        )
        return chunks_with_metadata

    except Exception as e:
        print(f"[Doc Service] Error processing document ({filename}): {e}")
        return []


# Compatibility alias
process_pdf_bytes = process_document_bytes
