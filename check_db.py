import sqlite3

conn = sqlite3.connect('app.db')
cursor = conn.cursor()

print("Checking developers table:")
cursor.execute("SELECT * FROM developers")
print(cursor.fetchall())

print("\nChecking projects table:")
cursor.execute("SELECT * FROM projects")
print(cursor.fetchall())

print("\nChecking builds table:")
cursor.execute("SELECT * FROM builds")
print(cursor.fetchall())

conn.close() 