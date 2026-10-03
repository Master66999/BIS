import json

with open('data/processed/chunks_metadata.json', 'r', encoding='utf-8') as f:
    chunks = json.load(f)

print(f"Total chunks: {len(chunks)}")
stds = {}
for c in chunks:
    s = c.get('standard_number')
    cl = f"{c.get('clause_number')} ({c.get('sub_clause')})"
    stds.setdefault(s, []).append((cl, c.get('content')[:90]))

for s, cl_list in stds.items():
    print(f"\nStandard: {s} -> {len(cl_list)} clauses")
    for cl, snippet in cl_list:
        print(f"   {cl}: {snippet}...")

with open('data/processed/booklet_chunks_metadata.json', 'r', encoding='utf-8') as f:
    bklts = json.load(f)

print(f"\nTotal Booklet Chunks: {len(bklts)}")
bk_depts = {}
for b in bklts:
    d = b.get('department')
    n = b.get('booklet_name')
    bk_depts.setdefault(d, set()).add(n)

for d, names in bk_depts.items():
    print(f"Dept {d}: {len(names)} booklets -> {list(names)[:2]}")
