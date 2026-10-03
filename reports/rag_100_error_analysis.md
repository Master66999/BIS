# BIS RAG 100-Question Error Analysis & Failure Patterns

## 1. Overview
Out of 100 benchmark questions, the improved RAG pipeline achieved **97.9% Standard Accuracy**, **100.0% Clause Accuracy**, and **100% Unsupported Query Accuracy**.

---

## 2. Top 10 Retrieval Failure Patterns

1. **Broad Generic Token Queries**: Queries like *"pipe"* or *"fan"* retrieve diverse sub-standards (e.g. sprinkler pipes or exhaust fans) that may compete with primary HDPE water pipes.
2. **Clause Corpus Coverage**: Deep clause chunks currently cover priority standards (IS 456, IS 1786, IS 269, IS 374, IS 4151, IS 14543, IS 2347, IS 9873). Standards outside this set fall back to catalog-level descriptions.
3. **Multi-Part Standard Codes**: Standards with sub-parts like `IS 9873 (Part 1):2019` vs `IS 9873 (Part 3)` require strict sub-part matching.
4. **Synonym Variation in Industry Terms**: Informal user terms like *"TMT rebar"* or *"HUID hallmark"* require synonym expansion mapping to formal titles like *high strength deformed steel bars*.
5. **Colloquial Conversational Queries**: Queries with ambiguous phrasing (e.g. *"biscuit pressure cooker"*) test tokenization noise filtering.
6. **Cross-Departmental Overlap**: Overlap between Civil Engineering (`CED`) and Metallurgical (`MTD`) for steel testing standards.
7. **Numeric Year Variations**: Standards with revision years (e.g., `IS 269:2015` vs legacy `IS 269:1989`) require base digit matching.
8. **Booklet Granularity**: Technical booklets encompass broad department scopes where sub-topic page ranking relies on dense embedding semantic coverage.
9. **Dense vs. Sparse Disagreement**: Questions with highly specific technical parameter limits (e.g., *"33 MPa at 28 days"*) benefit heavily from BM25 exact lexical matches.
10. **Zero-Hallucination Guardrails**: Out-of-scope / fictional queries (e.g., quantum teleportation or Martian terraforming) are successfully intercepted with 100% precision.

---

## 3. Detailed Failure Log (2 Items)

| Question ID | Category | Difficulty | Failure Classification | Diagnostic Details |
| :--- | :--- | :--- | :--- | :--- |
| `Q065` | booklet_department | medium | semantic retrieval failure / standard mismatch | Expected ['AYUSH'], but retrieved ['LITD_Book-04-For-net', 'CED_Building-Material-Book-17-For-net', 'LITD_Book-04-For-net'] |
| `Q076` | ambiguous_fuzzy | medium | semantic retrieval failure / standard mismatch | Expected ['IS 4984', 'IS 17425:2026', 'IS 1239'], but retrieved ['IS 269:2015', 'IS 16176:2014', 'Scheme I (ISI Mark)'] |
