"""
BIS SmartAssist - Dataset Inspection Script
Inspects the raw BIS standards dataset, detects headers dynamically, and generates data quality metrics.
"""

import os
import sys
import argparse
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from backend.app.core.config import settings
from backend.app.ingestion.csv_loader import inspect_dataset


def main():
    parser = argparse.ArgumentParser(description="Inspect raw BIS dataset for data quality.")
    parser.add_argument(
        "--file",
        type=str,
        default=os.path.join(PROJECT_ROOT, "data", "raw", "bis_standards.csv"),
        help="Path to raw BIS CSV/Excel file",
    )
    args = parser.parse_args()

    file_path = args.file
    print("=" * 65)
    print("  BIS SmartAssist — Dataset Quality & Header Inspection")
    print("=" * 65)
    print(f"Target File: {file_path}")

    if not Path(file_path).exists():
        xlsx_alt = Path(file_path).with_suffix(".xlsx")
        if xlsx_alt.exists():
            file_path = str(xlsx_alt)
            print(f"Using alternative file: {file_path}")
        else:
            print(f"Error: File not found at {file_path}")
            sys.exit(1)

    report = inspect_dataset(file_path)

    print("\n--- DATA QUALITY REPORT ---")
    print(f"Detected Header Row Index : {report['detected_header_row_index']}")
    print(f"Total Rows In File        : {report['total_rows']}")
    print(f"Number of Columns         : {report['number_of_columns']}")
    print(f"Columns Found             : {report['columns_found']}")
    print(f"Mapped Columns            : {report['mapped_columns']}")
    print(f"Valid Standards (Estimate): {report['valid_standards']}")
    print(f"Duplicate Standards       : {report['duplicate_standards']}")
    print(f"Missing Standard Numbers  : {report['missing_standard_numbers']}")
    print(f"Missing Titles            : {report['missing_titles']}")
    print(f"Missing Publication Dates : {report['missing_publication_dates']}")
    print(f"Empty Rows                : {report['empty_rows']}")
    print(f"Encoding Artifacts Found  : {report['encoding_issues_detected']}")
    print("=" * 65)


if __name__ == "__main__":
    main()
