import urllib.request
import json
import re

print("=== 1. Checking Frontend (http://localhost:3000) ===")
try:
    with urllib.request.urlopen("http://localhost:3000", timeout=10) as resp:
        html = resp.read().decode("utf-8")
        print(f"[OK] Frontend HTTP Status: {resp.status}")
        print(f"[OK] HTML Size: {len(html)} bytes")
        
        # Extract title
        title_match = re.search(r"<title>(.*?)</title>", html)
        if title_match:
            print(f"[OK] Document Title: '{title_match.group(1)}'")
            
        # Check key DOM elements in Next.js SSR
        for keyword in ["BIS", "SmartAssist", "Indian Standards", "Search"]:
            if keyword in html:
                print(f"[OK] Found DOM text: '{keyword}'")
except Exception as e:
    print(f"[FAIL] Frontend error: {e}")

print("\n=== 2. Checking Backend Standards API ===")
try:
    with urllib.request.urlopen("http://127.0.0.1:8000/api/standards?limit=3", timeout=10) as resp:
        stds = json.loads(resp.read().decode("utf-8"))
        print(f"[OK] Backend Standards Status: {resp.status} (Retrieved {len(stds)} records)")
        for s in stds:
            print(f"     - {s.get('standard_number')}: {s.get('title')[:55]}")
except Exception as e:
    print(f"[FAIL] Backend Standards error: {e}")

print("\n=== 3. Testing Semantic Product Finder API (ChromaDB/Neural) ===")
try:
    post_data = json.dumps({"product_name": "packaged drinking water", "category": "All"}).encode("utf-8")
    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/standards/product-finder",
        data=post_data,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=10) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        print(f"[OK] Product Finder Status: {resp.status}")
        print(f"[OK] Detected Category: {res.get('detected_category')}")
        matches = res.get("standards", [])
        print(f"[OK] Found {len(matches)} matching standards:")
        for m in matches[:3]:
            print(f"     - {m.get('standard_number')}: {m.get('title')[:55]} (Mandatory: {m.get('is_mandatory')})")
except Exception as e:
    print(f"[FAIL] Product Finder error: {e}")

print("\n=== 4. Checking Laboratories API ===")
try:
    with urllib.request.urlopen("http://127.0.0.1:8000/api/services/laboratories", timeout=10) as resp:
        labs = json.loads(resp.read().decode("utf-8"))
        print(f"[OK] Laboratories Status: {resp.status} (Retrieved {len(labs)} testing labs)")
        for lab in labs[:2]:
            print(f"     - {lab.get('lab_name')} ({lab.get('city')}, {lab.get('state')})")
except Exception as e:
    print(f"[FAIL] Laboratories error: {e}")
