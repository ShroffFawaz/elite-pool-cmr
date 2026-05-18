from database import SessionLocal
from models import FollowupSchedule

db = SessionLocal()
try:
    fs = db.query(FollowupSchedule).all()
    print("FollowupSchedule count:", len(fs))
    for f in fs:
        print(f"ID: {f.id}, Lead ID: {f.lead_id}, Lead Type: {f.lead_type.value if f.lead_type else None}, Client Name: {f.client_name}")
finally:
    db.close()
