import asyncio
from database import SessionLocal
from models import ConstructionSiteModel, ConstructionLeadModel, ConstructionPlan
from sqlalchemy.orm import Session

def get_all_sites_debug():
    db = SessionLocal()
    sites = db.query(ConstructionSiteModel).all()
    print(f"DEBUG: Found {len(sites)} sites in DB")
    results = []
    for s in sites:
        lead = db.query(ConstructionLeadModel).filter(ConstructionLeadModel.id == s.lead_id).first()
        plans = db.query(ConstructionPlan).filter(ConstructionPlan.site_id == s.id).all()
        
        results.append({
            "id": s.site_code,
            "db_id": s.id,
            "site_code": s.site_code,
            "client": lead.name if lead else "Unknown",
            "location": lead.location if lead else "N/A",
            "phone": lead.phone if lead else "N/A",
            "leadId": lead.lead_code if lead else "N/A",
            "startDate": str(s.start_date),
            "status": s.status,
        })
    print(f"DEBUG: Returning {len(results)} results")
    for r in results:
        print(f" - {r['site_code']}: {r['client']}")

if __name__ == "__main__":
    get_all_sites_debug()
