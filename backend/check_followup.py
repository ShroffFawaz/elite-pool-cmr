from database import SessionLocal
from sqlalchemy import text

db = SessionLocal()
result = db.execute(text("""
    SELECT column_name, data_type, udt_name
    FROM information_schema.columns 
    WHERE table_name = 'followup_calls'
""")).mappings().all()
print("Columns in followup_calls:")
for row in result:
    print(f"  - {row['column_name']}: {row['data_type']} ({row['udt_name']})")
db.close()
