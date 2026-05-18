from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from database import get_db
from models import OfficeExpenseModel, OfficeExpenseCategory, UserModel
from typing import Optional, List
from datetime import date
from sqlalchemy.sql import func

router = APIRouter(prefix="/office-expenses", tags=["office_expenses"])



@router.get("/kpi")
async def kpi(db: Session = Depends(get_db)):
    today = date.today()
    current_month = today.month

    def sum_for_category(category):
        result = db.query(func.sum(OfficeExpenseModel.amount)).filter(
            OfficeExpenseModel.category == category,
            func.extract('month', OfficeExpenseModel.expense_date) == current_month
        ).scalar()
        return float(result or 0)

    staff_salaries = sum_for_category(OfficeExpenseCategory.Staffing_Salaries)
    rent_utilities = sum_for_category(OfficeExpenseCategory.Office_Rent_Utilities)
    petty_cash     = sum_for_category(OfficeExpenseCategory.Petty_Office_Expenses)

    return {
        "staff_salaries": staff_salaries,
        "rent_utilities": rent_utilities,
        "petty_cash": petty_cash,
        "total": staff_salaries + rent_utilities + petty_cash,
    }
    



@router.get("/employees", response_model=List[str])
async def get_employee_names(db: Session = Depends(get_db)):
    """
    Returns a list of employee full names for the frontend dropdown.
    """
    users = db.query(UserModel.full_name).filter(UserModel.full_name != None).all()
    return [u.full_name for u in users]

@router.post("/add_office_expense/")
async def add_office_expense(
    category: OfficeExpenseCategory = Form(...),
    payee_name: str = Form(...),
    description: str = Form(...),
    amount: float = Form(...),
    expense_date: date = Form(...),
    note: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    try:
        new_expense = OfficeExpenseModel(
            category=category,
            payee_name=payee_name,
            description=description,
            amount=amount,
            expense_date=expense_date,
            note=note
        )
        db.add(new_expense)
        db.commit()
        return {"message": "Expense added successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/all_office_expenses")
async def get_all_office_expenses(db: Session = Depends(get_db)):
    return db.query(OfficeExpenseModel).order_by(OfficeExpenseModel.expense_date.desc()).all()

@router.delete("/delete_expense/{category}/{payee_name}")
async def delete_expense(
    category: OfficeExpenseCategory, 
    payee_name: str, 
    db: Session = Depends(get_db)
):
    try:
        expense = db.query(OfficeExpenseModel).filter(
            OfficeExpenseModel.category == category,
            OfficeExpenseModel.payee_name == payee_name
        ).first()

        if not expense:
            raise HTTPException(status_code=404, detail="Expense not found")
        
        db.delete(expense)
        db.commit()
        return {"message": f"Expense for {payee_name} in {category} deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
