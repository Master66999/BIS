"""
Official BIS Technical Booklets Ingestion Pipeline.
Extracts, cleans, chunks, and indexes all 17 official BIS PDF booklets
into data/processed/booklet_chunks_metadata.json and bis_smartassist.db.
"""

import os
import re
import zlib
import json
import sqlite3
from pathlib import Path
from typing import List, Dict, Any

root_dir = Path(__file__).resolve().parent.parent
booklet_dir = root_dir / "data" / "raw" / "booklets"
output_json = root_dir / "data" / "processed" / "booklet_chunks_metadata.json"
output_json.parent.mkdir(parents=True, exist_ok=True)


def extract_text_from_pdf(pdf_path: Path) -> List[Dict[str, Any]]:
    """Extracts text streams and groups into logical page-like sections."""
    with open(pdf_path, 'rb') as f:
        content = f.read()

    # Detect PDF page breaks or stream objects
    streams = re.findall(rb'stream[\r\n]+([\s\S]*?)[\r\n]+endstream', content)
    
    pages = []
    current_tokens = []
    
    for s in streams:
        decompressed = None
        try:
            decompressed = zlib.decompress(s)
        except Exception:
            try:
                decompressed = zlib.decompress(s, -zlib.MAX_WBITS)
            except Exception:
                decompressed = s

        if decompressed:
            # Extract parenthesized strings from text operators (Tj, TJ, ')
            strings = re.findall(rb'\(([\s\S]*?)\)', decompressed)
            stream_text = []
            for st in strings:
                try:
                    # Clean escaped parenthesis and octal escapes
                    clean_str = st.replace(rb'\(', rb'(').replace(rb'\)', rb')')
                    decoded = clean_str.decode('latin1', errors='ignore')
                    # Filter out binary glyph indexes
                    printable = "".join(c for c in decoded if c.isprintable() or c in ' \n\t')
                    if len(printable.strip()) > 1 and any(c.isalnum() for c in printable):
                        stream_text.append(printable.strip())
                except Exception:
                    pass

            if stream_text:
                block = " ".join(stream_text)
                current_tokens.append(block)
                # When block reaches ~1500 chars, consider it a page unit
                if sum(len(t) for t in current_tokens) >= 1800:
                    pages.append(" ".join(current_tokens))
                    current_tokens = []

    if current_tokens:
        pages.append(" ".join(current_tokens))

    return pages


def clean_booklet_text(text: str) -> str:
    """Cleans noisy OCR or PDF text artifacts."""
    text = re.sub(r'[^\x20-\x7E\n\t]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def chunk_booklet(text: str, chunk_size: int = 1000, chunk_overlap: int = 150) -> List[str]:
    """Splits booklet text into semantic chunks."""
    if not text:
        return []
    if len(text) <= chunk_size:
        return [text]

    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        ch = text[start:end].strip()
        if len(ch) > 40:
            chunks.append(ch)
        if end >= len(text):
            break
        start += (chunk_size - chunk_overlap)
    return chunks


def ingest_all_booklets():
    if not booklet_dir.exists():
        print(f"Directory {booklet_dir} not found!")
        return

    pdf_files = sorted(list(booklet_dir.glob("*.pdf")))
    print(f"Found {len(pdf_files)} PDF booklets in {booklet_dir}")

    all_chunks = []
    chunk_counter = 0

    conn = sqlite3.connect(root_dir / 'bis_smartassist.db')
    cursor = conn.cursor()

    for pdf_file in pdf_files:
        stem = pdf_file.stem
        # Extract department code
        if "AYUSH" in stem.upper():
            dept = "AYUSH"
        elif "MECHANICAL" in stem.upper() or "METALS" in stem.upper():
            dept = "MED"
        elif "POWDER" in stem.upper():
            dept = "MTD"
        else:
            dept_match = re.match(r"^([A-Z]{3,4})", stem)
            dept = dept_match.group(1) if dept_match else "BIS"

        doc_title = f"{dept} - {stem.replace('-', ' ').replace('_', ' ')}"
        doc_id = f"BIS-BKL-{dept}-{stem[:15]}"

        print(f"Processing booklet: {stem} [Dept: {dept}]...")
        pages = extract_text_from_pdf(pdf_file)
        print(f"  Extracted {len(pages)} sections/pages.")

        # Register in SQLite documents table if not present
        cursor.execute("SELECT id FROM documents WHERE document_id = ?", (doc_id,))
        doc_row = cursor.fetchone()
        if not doc_row:
            cursor.execute("""
                INSERT INTO documents (document_id, title, document_type, standard_number, version, source_url, status, total_chunks, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
            """, (doc_id, doc_title, "Technical Booklet", dept, "Official Booklet", f"https://www.services.bis.gov.in/booklets/{stem}.pdf", "Indexed", len(pages)))
            doc_db_id = cursor.lastrowid
        else:
            doc_db_id = doc_row[0]

        for page_num, raw_page_text in enumerate(pages, start=1):
            cleaned = clean_booklet_text(raw_page_text)
            page_chunks = chunk_booklet(cleaned, chunk_size=900, chunk_overlap=120)

            for c_idx, ch in enumerate(page_chunks):
                chunk_counter += 1
                chunk_record = {
                    "id": chunk_counter,
                    "document_id": doc_id,
                    "booklet_name": stem,
                    "department": dept,
                    "title": doc_title,
                    "page_number": page_num,
                    "chunk_index": c_idx,
                    "clause_number": f"Page {page_num}",
                    "sub_clause": f"{page_num}.{c_idx+1}",
                    "content": ch,
                    "product_category": f"{dept} Technical Division"
                }
                all_chunks.append(chunk_record)

                # Insert into document_chunks in SQLite
                cursor.execute("""
                    INSERT INTO document_chunks (document_id, standard_number, title, clause_number, sub_clause, page_number, product_category, content, metadata_json)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (doc_id, dept, doc_title, f"Page {page_num}", f"{page_num}.{c_idx+1}", page_num, f"{dept} Technical Division", ch, json.dumps(chunk_record)))

    conn.commit()
    conn.close()

    print(f"\nTotal booklet chunks generated: {len(all_chunks)}")
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(all_chunks, f, indent=2)

    print(f"Successfully saved booklet chunks to {output_json}")


if __name__ == "__main__":
    ingest_all_booklets()
