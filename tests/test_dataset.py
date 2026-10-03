"""
Unit tests for BIS Standards raw dataset loading, header detection, and data inspection.
"""

import pytest
from pathlib import Path
from backend.app.core.config import settings
from backend.app.ingestion.csv_loader import detect_header_row, inspect_dataset


def test_header_detection():
    raw_path = settings.RAW_DATA_PATH
    if not Path(raw_path).exists():
        raw_path = str(Path(raw_path).with_suffix(".xlsx"))

    assert Path(raw_path).exists(), f"Raw dataset not found at {raw_path}"
    header_idx, headers = detect_header_row(raw_path)
    assert header_idx >= 0
    assert any("standard number" in h.lower() or "is number" in h.lower() for h in headers)
    assert any("title" in h.lower() for h in headers)


def test_inspect_dataset_metrics():
    raw_path = settings.RAW_DATA_PATH
    if not Path(raw_path).exists():
        raw_path = str(Path(raw_path).with_suffix(".xlsx"))

    report = inspect_dataset(raw_path)
    assert report["total_rows"] > 20000
    assert report["valid_standards"] > 20000
    assert "detected_header_row_index" in report
    assert "missing_standard_numbers" in report
    assert "missing_titles" in report
