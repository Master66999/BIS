"""
BIS Dataset Quality Inspector
CLI and programmatic utility to inspect raw standards data and report data anomalies.
"""

import os
import json
import argparse
from backend.app.ingestion.csv_loader import inspect_dataset

def main():
    parser = argparse.ArgumentParser(description="Inspect BIS Standards Raw Dataset")
    parser.add_argument("--file", "-f", type=str, default="data/raw/bis_standards.csv", help="Path to raw CSV or Excel")
    parser.add_argument("--output", "-o", type=str, default="data/processed/data_quality_report.json", help="Path to save report")
    args = parser.parse_args()

    print(f"Inspecting dataset: {args.file}")
    report = inspect_dataset(args.file)
    print(json.dumps(report, indent=2))

    if args.output:
        os.makedirs(os.path.dirname(args.output), exist_ok=True)
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
        print(f"Report saved to {args.output}")

if __name__ == "__main__":
    main()
