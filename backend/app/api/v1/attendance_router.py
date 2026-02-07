from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.attendance import AttendanceCreate, AttendanceResponse, AttendanceStatus
from app.services.attendance_service import attendance_service
from typing import List, Optional
from datetime import date

router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)

@router.post("/", response_model=AttendanceResponse)
def mark_attendance(attendance: AttendanceCreate, db: Session = Depends(get_db)):
    return attendance_service.mark_attendance(db, attendance)

@router.get("/", response_model=List[AttendanceResponse])
def get_attendance_records(
    employee_name: Optional[str] = None,
    department: Optional[str] = None,
    attendance_date: Optional[date] = None,
    status: Optional[AttendanceStatus] = None,
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    return attendance_service.get_attendance_records(db, employee_name, department, attendance_date, status, skip, limit)
