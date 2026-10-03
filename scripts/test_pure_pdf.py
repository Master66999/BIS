import re
import zlib
from pathlib import Path

def extract_text_pure_python(pdf_path: str):
    with open(pdf_path, 'rb') as f:
        content = f.read()

    text_pieces = []
    # Find all streams
    streams = re.findall(rb'stream[\r\n]+([\s\S]*?)[\r\n]+endstream', content)
    for s in streams:
        decompressed = None
        try:
            decompressed = zlib.decompress(s)
        except Exception:
            try:
                decompressed = zlib.decompress(s, -zlib.MAX_WBITS)
            except Exception:
                decompressed = s

        if decompressed:
            # Extract strings within parenthesis (text in PDF BT ... ET operators)
            # Find ( ... ) Tj or TJ text blocks
            strings = re.findall(rb'\(([\s\S]*?)\)', decompressed)
            for st in strings:
                try:
                    decoded = st.decode('utf-8', errors='ignore')
                    if len(decoded.strip()) > 1 and any(c.isalnum() for c in decoded):
                        text_pieces.append(decoded.strip())
                except Exception:
                    pass

    return " ".join(text_pieces)

p = "data/raw/booklets/TED_AUTOMATIVE-BRAKING_Resource-Book-02-For-net.pdf"
txt = extract_text_pure_python(p)
print(f"Extracted {len(txt)} chars from {p}")
print("Sample:", txt[:300])
