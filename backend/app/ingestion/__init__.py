"""
BIS Ingestion Module
Handles dataset quality inspection, CSV/Excel loading, normalization, and booklet PDF processing.
"""

from .csv_loader import (
    detect_header_row,
    normalize_text,
    normalize_standard_number,
    parse_publication_date,
    inspect_dataset,
    format_search_document,
    clean_and_process_dataset,
)
from .booklet_loader import (
    extract_pdf_pages,
    chunk_text,
    process_booklet_directory,
)

__all__ = [
    "detect_header_row",
    "normalize_text",
    "normalize_standard_number",
    "parse_publication_date",
    "inspect_dataset",
    "format_search_document",
    "clean_and_process_dataset",
    "extract_pdf_pages",
    "chunk_text",
    "process_booklet_directory",
]
