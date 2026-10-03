import sqlite3

conn = sqlite3.connect('bis_smartassist.db')
cursor = conn.cursor()
cursor.execute("SELECT id, document_id, title, document_type, standard_number, total_chunks FROM documents")
for r in cursor.fetchall():
    print(r)
conn.close()
