try:
    import fitz
    print("fitz is available")
except ImportError:
    print("fitz is NOT available")

try:
    import pypdf
    print("pypdf is available")
except ImportError:
    print("pypdf is NOT available")

try:
    import pdfplumber
    print("pdfplumber is available")
except ImportError:
    print("pdfplumber is NOT available")
