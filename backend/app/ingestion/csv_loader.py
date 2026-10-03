"""
BIS Standards Data Loading and Processing Module
Handles raw BIS dataset inspection, dynamic header detection, normalization,
data quality assessment, and structured search document formatting.
"""

import json
import re
import unicodedata
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple
import pandas as pd


COLUMN_MAPPING = {
    "sl#": "serial_number",
    "sl no": "serial_number",
    "sl. no.": "serial_number",
    "serial number": "serial_number",
    "standard number": "standard_number",
    "is number": "standard_number",
    "standard_no": "standard_number",
    "date of publish": "publication_date",
    "publication date": "publication_date",
    "publish date": "publication_date",
    "title": "title",
    "standard title": "title",
    "type of standard": "standard_type",
    "standard type": "standard_type",
    "degree of equivalence": "degree_of_equivalence",
    "equivalence": "degree_of_equivalence",
}


def detect_header_row(file_path: str, max_scan_rows: int = 15) -> Tuple[int, List[str]]:
    """
    Dynamically scans the top rows of a CSV or Excel file to detect the actual header row.
    Returns (header_row_index, header_columns).
    """
    path = Path(file_path)
    if path.suffix.lower() in [".xlsx", ".xls"]:
        df_scan = pd.read_excel(file_path, header=None, nrows=max_scan_rows, dtype=str)
    else:
        try:
            df_scan = pd.read_csv(file_path, header=None, nrows=max_scan_rows, dtype=str, encoding="utf-8")
        except UnicodeDecodeError:
            df_scan = pd.read_csv(file_path, header=None, nrows=max_scan_rows, dtype=str, encoding="latin-1")

    best_idx = 0
    max_matched_cols = 0
    best_headers = []

    for i in range(len(df_scan)):
        row_vals = [str(x).strip().lower() for x in df_scan.iloc[i].values if pd.notna(x)]
        matched = 0
        for val in row_vals:
            for key in COLUMN_MAPPING:
                if key in val or val in key:
                    matched += 1
                    break
        if matched > max_matched_cols:
            max_matched_cols = matched
            best_idx = i
            best_headers = [str(x).strip() if pd.notna(x) else f"col_{c}" for c, x in enumerate(df_scan.iloc[i].values)]

    if max_matched_cols == 0:
        best_headers = [f"col_{c}" for c in range(df_scan.shape[1])]

    return best_idx, best_headers


def normalize_text(text: Any) -> str:
    """Cleans Unicode characters, dashes, and extra whitespaces from text."""
    if text is None or pd.isna(text):
        return ""

    val = str(text).strip()
    val = unicodedata.normalize("NFKC", val)
    val = val.replace("\ufffd", " - ")
    val = re.sub(r"[\u2010\u2011\u2012\u2013\u2014\u2015]", " - ", val)
    val = re.sub(r"\s*-\s*-\s*", " - ", val)
    val = re.sub(r"\s+", " ", val)
    return val.strip()


def normalize_standard_number(std_no: Any) -> str:
    """
    Normalizes BIS standard number formatting (e.g. 'IS  456 : 2000' -> 'IS 456:2000')
    without altering its semantic meaning.
    """
    if std_no is None or pd.isna(std_no):
        return ""

    val = normalize_text(std_no)

    if val.lower().startswith("is ") or val.lower().startswith("is/"):
        val = "IS" + val[2:]
    elif val.lower().startswith("sp ") or val.lower().startswith("sp:"):
        val = "SP" + val[2:]

    val = re.sub(r"\s*\(\s*", " (", val)
    val = re.sub(r"\s*\)\s*", ")", val)
    val = re.sub(r"\s*:\s*", ":", val)
    val = re.sub(r"\s+", " ", val).strip()
    return val


def parse_publication_date(date_val: Any) -> str:
    """Parses various date formats into standard ISO YYYY-MM-DD format."""
    if date_val is None or pd.isna(date_val) or str(date_val).strip() in ["", "-", "nan", "None"]:
        return ""

    raw = str(date_val).strip()
    try:
        dt = pd.to_datetime(raw, format="mixed", errors="coerce")
        if pd.notna(dt):
            return dt.strftime("%Y-%m-%d")
    except Exception:
        pass
    return raw


def inspect_dataset(file_path: str) -> Dict[str, Any]:
    """
    Performs comprehensive data quality inspection on the raw BIS dataset.
    Returns a quality report dictionary.
    """
    header_idx, raw_headers = detect_header_row(file_path)

    path = Path(file_path)
    if path.suffix.lower() in [".xlsx", ".xls"]:
        df = pd.read_excel(file_path, skiprows=header_idx, dtype=str)
    else:
        try:
            df = pd.read_csv(file_path, skiprows=header_idx, dtype=str, encoding="utf-8")
        except UnicodeDecodeError:
            df = pd.read_csv(file_path, skiprows=header_idx, dtype=str, encoding="latin-1")

    col_map = {}
    for col in df.columns:
        col_clean = str(col).strip().lower()
        for k, v in COLUMN_MAPPING.items():
            if k == col_clean or k in col_clean:
                col_map[col] = v
                break

    df_mapped = df.rename(columns=col_map)
    total_raw_rows = len(df)
    empty_rows = df.isna().all(axis=1).sum()

    std_col = df_mapped.get("standard_number", pd.Series(dtype=str))
    title_col = df_mapped.get("title", pd.Series(dtype=str))
    date_col = df_mapped.get("publication_date", pd.Series(dtype=str))

    missing_std = std_col.isna().sum() + (std_col.astype(str).str.strip() == "").sum()
    missing_title = title_col.isna().sum() + (title_col.astype(str).str.strip() == "").sum()
    missing_date = date_col.isna().sum() + (date_col.astype(str).str.strip().isin(["", "-", "nan", "None"])).sum()

    non_empty_stds = std_col.dropna().astype(str).str.strip()
    duplicate_stds = non_empty_stds[non_empty_stds != ""].duplicated().sum()
    valid_standards = total_raw_rows - max(missing_std, missing_title) - duplicate_stds

    report = {
        "file_path": str(file_path),
        "detected_header_row_index": header_idx,
        "total_rows": int(total_raw_rows),
        "number_of_columns": int(df.shape[1]),
        "columns_found": [str(c) for c in df.columns],
        "mapped_columns": list(col_map.values()),
        "valid_standards": int(valid_standards),
        "duplicate_standards": int(duplicate_stds),
        "missing_standard_numbers": int(missing_std),
        "missing_titles": int(missing_title),
        "missing_publication_dates": int(missing_date),
        "empty_rows": int(empty_rows),
        "encoding_issues_detected": True,
    }
    return report


def format_search_document(record: Dict[str, Any]) -> str:
    """
    Creates a standard searchable text representation for a BIS standard record.
    """
    std_no = record.get("standard_number", "Not Specified")
    title = record.get("title", "Not Specified")
    pub_date = record.get("publication_date") or "Not Specified"
    std_type = record.get("standard_type") or "Not Specified"
    equiv = record.get("degree_of_equivalence") or "Not Specified"

    doc = (
        f"Standard Number: {std_no}\n"
        f"Title: {title}\n"
        f"Publication Date: {pub_date}\n"
        f"Standard Type: {std_type}\n"
        f"Degree of Equivalence: {equiv}"
    )
    return doc


def clean_and_process_dataset(
    raw_file_path: str,
    output_clean_csv: str,
    output_report_json: str,
) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Cleans, normalizes, and validates the raw BIS dataset.
    Generates clean CSV and quality report JSON.
    """
    inspection = inspect_dataset(raw_file_path)
    header_idx = inspection["detected_header_row_index"]

    path = Path(raw_file_path)
    if path.suffix.lower() in [".xlsx", ".xls"]:
        df = pd.read_excel(raw_file_path, skiprows=header_idx, dtype=str)
    else:
        try:
            df = pd.read_csv(raw_file_path, skiprows=header_idx, dtype=str, encoding="utf-8")
        except UnicodeDecodeError:
            df = pd.read_csv(raw_file_path, skiprows=header_idx, dtype=str, encoding="latin-1")

    col_map = {}
    for col in df.columns:
        col_clean = str(col).strip().lower()
        for k, v in COLUMN_MAPPING.items():
            if k == col_clean or k in col_clean:
                col_map[col] = v
                break

    df = df.rename(columns=col_map)

    # Ensure required columns exist
    for col in ["serial_number", "standard_number", "title", "publication_date", "standard_type", "degree_of_equivalence"]:
        if col not in df.columns:
            df[col] = ""

    # Drop completely empty rows
    df = df.dropna(how="all").copy()

    # Normalize fields
    df["standard_number"] = df["standard_number"].apply(normalize_standard_number)
    df["title"] = df["title"].apply(normalize_text)
    df["standard_type"] = df["standard_type"].apply(normalize_text)
    df["degree_of_equivalence"] = df["degree_of_equivalence"].apply(normalize_text)
    df["publication_date"] = df["publication_date"].apply(parse_publication_date)

    # Filter invalid records
    df = df[df["standard_number"] != ""].copy()
    df = df[df["title"] != ""].copy()

    # Remove duplicates on standard_number
    df = df.drop_duplicates(subset=["standard_number"], keep="first").copy()

    df["source"] = "BIS Standards Dataset"
    df["search_document"] = df.apply(lambda row: format_search_document(row.to_dict()), axis=1)

    summary = {
        "total_clean_records": int(len(df)),
        "unique_standard_numbers": int(df["standard_number"].nunique()),
        "records_with_publication_date": int((df["publication_date"] != "").sum()),
        "records_without_publication_date": int((df["publication_date"] == "").sum()),
        "removed_records_count": int(inspection["total_rows"] - len(df)),
        "output_clean_csv": str(output_clean_csv)
    }
    inspection["clean_dataset_summary"] = summary

    # Save cleaned output
    out_csv_path = Path(output_clean_csv)
    out_csv_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_clean_csv, index=False, encoding="utf-8")

    out_json_path = Path(output_report_json)
    out_json_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_report_json, "w", encoding="utf-8") as f:
        json.dump(inspection, f, indent=2)

    return df, inspection

