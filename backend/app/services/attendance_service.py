from sqlalchemy.orm import Session
from app.dao.attendance_dao import attendance_dao
from app.dao.employee_dao import employee_dao
from app.schemas.attendance import AttendanceCreate, AttendanceStatus
from app.core.logger import log_event
from fastapi import HTTPException, status
from datetime import date
from typing import Optional

class AttendanceService:
    def mark_attendance(self, db: Session, attendance: AttendanceCreate):
        # Check if employee exists and is active
        employee = employee_dao.get_employee(db, attendance.employee_id)
        if not employee:
            log_event(f"Attempt to mark attendance for invalid employee: {attendance.employee_id}", "error")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found or inactive"
            )

        # Check for duplicate attendance
        existing_record = attendance_dao.get_attendance_by_employee_date(db, attendance.employee_id, attendance.date)
        if existing_record:
            log_event(f"Duplicate attendance attempt: Emp {attendance.employee_id} on {attendance.date}", "warning")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Attendance already marked for this date"
            )

        new_attendance = attendance_dao.create_attendance(db, attendance)
        log_event(f"Attendance marked: Emp {attendance.employee_id}, Status {attendance.status}", "info")
        return new_attendance

    def get_attendance_records(
        self, 
        db: Session, 
        employee_name: Optional[str] = None,
        department: Optional[str] = None,
        attendance_date: Optional[date] = None,
        status: Optional[AttendanceStatus] = None,
        skip: int = 0, 
        limit: int = 100
    ):
        return attendance_dao.get_attendance_records(db, employee_name, department, attendance_date, status, skip, limit)

attendance_service = AttendanceService()
