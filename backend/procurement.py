from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from models import ProcurementModel
from database import get_db
from sqlalchemy import func
from datetime import date

router = APIRouter(prefix="/procurements", tags=["procurements"])

@router.get("/all")
async def get_all_procurements(db: Session = Depends(get_db)):
    procurements = db.query(ProcurementModel).order_by(ProcurementModel.logged_at.desc()).all()
    result = []
    for p in procurements:
        result.append({
            "id": p.id,
            "code": p.procurement_code,
            "client": p.client_name,
            "siteName": p.site_name,
            "siteType": p.site_type,
            "requirements": p.requirements,
            "date": p.logged_at,
            "status": p.status
        })
    return result

@router.put("/mark-done/{procurement_id}")
async def mark_procured(procurement_id: int, db: Session = Depends(get_db)):
    item = db.query(ProcurementModel).filter(ProcurementModel.id == procurement_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Procurement item not found")
    
    item.status = "done"
    db.commit()
    return {"message": "Item marked as procured"}

@router.delete("/delete/{procurement_id}")
async def delete_procurement(procurement_id: int, db: Session = Depends(get_db)):
    item = db.query(ProcurementModel).filter(ProcurementModel.id == procurement_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Procurement item not found")
    db.delete(item)
    db.commit()
    return {"message": "Procurement item deleted successfully"}

# Internal helper to add procurement from other routers
def create_procurement_entry(db: Session, client: str, site_name: str, site_type: str, requirements: str, source_id: int = None):
    count = db.query(func.count(ProcurementModel.id)).scalar()
    code = f"PR-{str(count + 1).zfill(4)}"
    
    new_entry = ProcurementModel(
        procurement_code=code,
        client_name=client,
        site_name=site_name,
        site_type=site_type,
        requirements=requirements,
        source_id=source_id,
        status="pending"
    )
    db.add(new_entry)
    # We don't commit here, let the calling route handle the commit
