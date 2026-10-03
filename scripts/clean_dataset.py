"""
BIS SmartAssist - Dataset Cleaning Script
Cleans and normalizes the raw BIS standards dataset, standardizes IS formats and ISO dates, and exports processed CSV + quality report JSON.
"""

import os
import sys
import argparse
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from backend.app.core.config import settings
from backend.app.ingestion.csv_loader import clean_and_process_dataset


def main():
    parser = argparse.ArgumentParser(description="Clean and normalize BIS dataset.")
    parser.add_argument(
        "--input",
        type=str,
        default=os.path.join(PROJECT_ROOT, "data", "raw", "bis_standards.csv"),
        help="Path to raw BIS CSV/Excel file",
    )
    parser.add_argument(
        "--output-csv",
        type=str,
        default=os.path.join(PROJECT_ROOT, "data", "processed", "bis_standards_clean.csv"),
        help="Path to output clean CSV",
    )
    parser.add_argument(
        "--output-report",
        type=str,
        default=os.path.join(PROJECT_ROOT, "data", "processed", "data_quality_report.json"),
        help="Path to output JSON quality report",
    )
    args = parser.parse_args()

    input_file = args.input
    if not Path(input_file).exists():
        xlsx_alt = Path(input_file).with_suffix(".xlsx")
        if xlsx_alt.exists():
            input_file = str(xlsx_alt)

    print("=" * 65)
    print("  BIS SmartAssist — Standards Cleaning & Normalization Pipeline")
    print("=" * 65)
    print(f"Input file   : {input_file}")
    print(f"Output CSV   : {args.output_csv}")
    print(f"Output Report: {args.output_report}")

    clean_df, report = clean_and_process_dataset(
        raw_file_path=input_file,
        output_clean_csv=args.output_csv,
        output_report_json=args.output_report,
    )

    print("\n--- CLEANING SUMMARY ---")
    print(f"Total Valid Clean Records Saved : {len(clean_df)}")
    print(f"Unique BIS Standard Numbers     : {clean_df['standard_number'].nunique()}")
    print(f"Clean CSV Exported To           : {args.output_csv}")
    print(f"Quality Report Saved To         : {args.output_report}")
    print("=" * 65)


if __name__ == "__main__":
    main()
