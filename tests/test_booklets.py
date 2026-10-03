"""
Unit tests for BIS Departmental Resource Handouts & Booklets extraction and chunking.
"""

import os
import pytest
from pathlib import Path
from backend.app.core.config import settings
from backend.app.ingestion.booklet_loader import process_booklet_directory, chunk_text


def test_chunk_text():
    sample = "A" * 2500
    chunks = chunk_text(sample, chunk_size=1000, chunk_overlap=200)
    assert len(chunks) >= 3
    assert all(len(c) <= 1000 for c in chunks)


def test_booklet_files_exist():
    booklet_dir = Path(settings.BOOKLETS_DIR)
    assert booklet_dir.exists(), f"Booklet directory not found at {booklet_dir}"
    pdf_files = list(booklet_dir.glob("*.pdf"))
    assert len(pdf_files) >= 15, f"Expected at least 15 booklets, found {len(pdf_files)}"
