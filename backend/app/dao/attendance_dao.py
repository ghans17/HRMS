from sqlalchemy.orm import Session
from app.models.attendance import Attendance
from app.models.employee import Employee
from app.schemas.attendance import AttendanceCreate, AttendanceStatus
from datetime import date
from typing import Optional

class AttendanceDAO:
    def create_attendance(self, db: Session, attendance: AttendanceCreate):
        db_attendance = Attendance(
            employee_id=attendance.employee_id,
            date=attendance.date,
            status=attendance.status
        )
        db.add(db_attendance)
        db.commit()
        db.refresh(db_attendance)
        return db_attendance

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
        query = db.query(Attendance).join(Employee)

        if employee_name:
            query = query.filter(Employee.full_name.ilike(f"%{employee_name}%"))
        
        if department:
            query = query.filter(Employee.department.ilike(f"%{department}%"))
        
        if attendance_date:
            query = query.filter(Attendance.date == attendance_date)
        
        if status:
            query = query.filter(Attendance.status == status)
        
        return query.offset(skip).limit(limit).all()

    def get_attendance_by_employee_date(self, db: Session, employee_id: int, date: date):
        return db.query(Attendance).filter(
            Attendance.employee_id == employee_id, 
            Attendance.date == date
        ).first()

    def get_total_present_days(self, db: Session, employee_id: int):
        return db.query(Attendance).filter(
            Attendance.employee_id == employee_id,
            Attendance.status == AttendanceStatus.PRESENT
        ).count()

attendance_dao = AttendanceDAO()
