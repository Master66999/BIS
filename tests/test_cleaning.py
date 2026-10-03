"""
Unit tests for data cleaning, normalization, duplicate handling, and document formatting.
"""

import pytest
from backend.app.ingestion.csv_loader import (
    normalize_standard_number,
    normalize_text,
    parse_publication_date,
    format_search_document,
)


def test_normalize_standard_number():
    assert normalize_standard_number("IS  456 : 2000") == "IS 456:2000"
    assert normalize_standard_number("is 456:2000") == "IS 456:2000"
    assert normalize_standard_number("IS 6092  ( Part 6 ) : 2026") == "IS 6092 (Part 6):2026"
    assert normalize_standard_number("sp 16") == "SP 16"
    assert normalize_standard_number(None) == ""


def test_normalize_text():
    assert normalize_text("Concrete \u2014 Specification") == "Concrete - Specification"
    assert normalize_text("Multi - - crop   thresher") == "Multi - crop thresher"
    assert normalize_text(None) == ""


def test_parse_publication_date():
    assert parse_publication_date("28 Aug 2026") == "2026-08-28"
    assert parse_publication_date("2020-05-15") == "2020-05-15"
    assert parse_publication_date(None) == ""
    assert parse_publication_date("-") == ""


def test_format_search_document():
    record = {
        "standard_number": "IS 456:2000",
        "title": "Plain and Reinforced Concrete",
        "publication_date": "2000-01-01",
        "standard_type": "Product Specification",
        "degree_of_equivalence": "Indigenous",
    }
    doc = format_search_document(record)
    assert "Standard Number: IS 456:2000" in doc
    assert "Title: Plain and Reinforced Concrete" in doc
    assert "Standard Type: Product Specification" in doc
    assert "Degree of Equivalence: Indigenous" in doc
