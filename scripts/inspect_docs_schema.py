import sqlite3

conn = sqlite3.connect('bis_smartassist.db')
cursor = conn.cursor()
cursor.execute("PRAGMA table_info(documents)")
print("documents columns:", cursor.fetchall())
cursor.execute("SELECT * FROM documents LIMIT 5")
print("documents sample:", cursor.fetchall())
conn.close()
