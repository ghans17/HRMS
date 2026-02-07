from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.employee import EmployeeCreate, EmployeeResponse
from app.services.employee_service import employee_service
from typing import List

router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)

@router.post("/", response_model=EmployeeResponse)
def create_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    return employee_service.create_employee(db, employee)

@router.get("/", response_model=List[EmployeeResponse])
def get_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return employee_service.get_employees(db, skip, limit)

@router.delete("/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    return employee_service.delete_employee(db, employee_id)
