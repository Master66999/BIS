import sqlite3

conn = sqlite3.connect('bis_smartassist.db')
cursor = conn.cursor()
cursor.execute("SELECT id, title, file_path, document_type, total_pages FROM documents")
rows = cursor.fetchall()
print(f"Total documents: {len(rows)}")
for r in rows:
    print(r)

conn.close()
