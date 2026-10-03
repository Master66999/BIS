import urllib.request
import json

def test_api():
    print("=" * 60)
    print("  Testing Live BIS SmartAssist Endpoints")
    print("=" * 60)

    # 1. Test Chat
    req_body = json.dumps({
        "message": "What BIS standard is applicable to cement?",
        "language": "en"
    }).encode("utf-8")

    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/chat",
        data=req_body,
        headers={"Content-Type": "application/json"}
    )

    with urllib.request.urlopen(req) as res:
        data = json.loads(res.read().decode("utf-8"))
        print("[1] POST /api/chat")
        print(f"    Intent: {data.get('intent')}")
        print(f"    Confidence: {data.get('confidence_level')} ({data.get('confidence')})")
        print(f"    Sources Found: {len(data.get('sources', []))}")
        if data.get("sources"):
            top = data["sources"][0]
            print(f"    Top Citation: {top.get('standard_number')} — {top.get('title')}")
        print(f"    Answer Snippet: {data.get('answer', '')[:140]}...")

    # 2. Test Booklet Search
    with urllib.request.urlopen("http://127.0.0.1:8000/api/standards/booklets/search?q=braking&top_k=2") as res:
        b_data = json.loads(res.read().decode("utf-8"))
        print("\n[2] GET /api/standards/booklets/search")
        print(f"    Query: '{b_data.get('query')}' | Results: {b_data.get('total_results')}")

    # 3. Test Standards Catalog
    with urllib.request.urlopen("http://127.0.0.1:8000/api/standards?limit=2") as res:
        stds = json.loads(res.read().decode("utf-8"))
        print(f"\n[3] GET /api/standards -> Loaded {len(stds)} standards from DB.")
        for s in stds:
            print(f"    • {s.get('standard_number')}: {s.get('title')[:60]}...")

    print("\n[4] GET http://localhost:3000 (Next.js Frontend)")
    with urllib.request.urlopen("http://localhost:3000") as res:
        print(f"    HTTP Status: {res.status} OK (Rendered {len(res.read())} bytes)")

    print("=" * 60)

if __name__ == "__main__":
    test_api()
