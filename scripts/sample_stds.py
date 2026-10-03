import json

with open('data/processed/standards_metadata.json', 'r', encoding='utf-8') as f:
    stds = json.load(f)

print(f"Total standards loaded: {len(stds)}")
keywords = ["cement", "steel", "water", "concrete", "pipe", "wire", "cable", "switch", "helmet", "fire", "solar", "transformer", "plywood", "glass", "paint", "textile", "gas", "shoe", "toy", "gold", "silver", "petroleum", "diesel", "fertilizer", "medical", "mask", "pressure cooker"]

found = {}
for item in stds:
    title = (item.get('title') or '').lower()
    num = (item.get('standard_number') or '').upper()
    cat = (item.get('product_category') or '')
    for kw in keywords:
        if kw in title:
            found.setdefault(kw, []).append((num, item.get('title'), cat))

for kw, matches in found.items():
    print(f"\nKeyword '{kw}': {len(matches)} matches. Top 2:")
    for num, title, cat in matches[:2]:
        print(f"   {num} | {title} [{cat}]")
