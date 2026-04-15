import sqlite3
import os

db_path = r'd:\AnkHub\VillaMilaBackup\BE\Villa-Milla-Admin-BE\db.sqlite3'
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM villas_villa")
    count = cursor.fetchone()[0]
    print(f"Total Villas: {count}")
    
    cursor.execute("SELECT name, image FROM villas_villa LIMIT 10")
    rows = cursor.fetchall()
    for row in rows:
        print(f"Name: {row[0]}, Image: {row[1]!r}")
    conn.close()
else:
    print("Database not found")
