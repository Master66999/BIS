"""
BIS Booklet Knowledge Ingestion Module
Extracts, cleans, and chunks official BIS Departmental Resource Handouts and Technical Booklets (PDFs).
"""

import os
import re
from pathlib import Path
from typing import List, Dict, Any, Optional

try:
    import pymupdf  # PyMuPDF / fitz
except ImportError:
    try:
        import fitz as pymupdf
    except ImportError:
        pymupdf = None


def clean_text(text: str) -> str:
    """Clean extracted PDF text from null bytes and excess whitespace."""
    if not text:
        return ""
    text = text.replace("\x00", " ")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n\s*\n+", "\n\n", text)
    return text.strip()


def extract_pdf_pages(pdf_path: str) -> List[Dict[str, Any]]:
    """
    Extract readable text page-by-page from a PDF booklet.
    """
    if pymupdf is None:
        raise ImportError("PyMuPDF (fitz) is required for extracting booklet PDFs. Install via pip install pymupdf")

    document = pymupdf.open(pdf_path)
    pages = []

    for page_number, page in enumerate(document, start=1):
        text = page.get_text("text")
        cleaned = clean_text(text)
        if cleaned and len(cleaned) > 20:
            pages.append({
                "page": page_number,
                "text": cleaned
            })

    document.close()
    return pages


def chunk_text(text: str, chunk_size: int = 1200, chunk_overlap: int = 200) -> List[str]:
    """
    Splits text into overlapping semantic chunks.
    """
    if not text:
        return []
    if len(text) <= chunk_size:
        return [text]

    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        if end >= len(text):
            break
        start += (chunk_size - chunk_overlap)

    return chunks


def process_booklet_directory(
    booklet_dir: str,
    chunk_size: int = 1200,
    chunk_overlap: int = 200
) -> List[Dict[str, Any]]:
    """
    Processes all PDF booklets in the directory and returns list of chunk records with metadata.
    """
    dir_path = Path(booklet_dir)
    if not dir_path.exists():
        return []

    pdf_files = sorted(dir_path.glob("*.pdf"))
    all_chunks = []

    for pdf_file in pdf_files:
        booklet_name = pdf_file.stem
        # Extract departmental code if present (e.g. TED, CED, LITD, CHD)
        dept_match = re.match(r"^([A-Z]{3,4})", booklet_name)
        department = dept_match.group(1) if dept_match else "BIS"

        try:
            pages = extract_pdf_pages(str(pdf_file))
            for p in pages:
                page_chunks = chunk_text(p["text"], chunk_size=chunk_size, chunk_overlap=chunk_overlap)
                for c_idx, c_text in enumerate(page_chunks):
                    all_chunks.append({
                        "booklet_name": booklet_name,
                        "filename": pdf_file.name,
                        "department": department,
                        "page_number": p["page"],
                        "chunk_index": c_idx,
                        "content": c_text,
                        "document": f"[{department} Booklet: {booklet_name}, Page {p['page']}]\n{c_text}"
                    })
        except Exception as e:
            print(f"Error processing booklet {pdf_file.name}: {e}")

    return all_chunks
