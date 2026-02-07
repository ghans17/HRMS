from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional
from enum import Enum

class AttendanceStatus(str, Enum):
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"

class AttendanceBase(BaseModel):
    date: date
    status: AttendanceStatus

class AttendanceCreate(AttendanceBase):
    employee_id: int

from app.schemas.employee import EmployeeResponse

class AttendanceResponse(AttendanceBase):
    id: int
    employee_id: int
    created_at: datetime
    employee: Optional[EmployeeResponse] = None

    class Config:
        from_attributes = True

class AttendanceFilter(BaseModel):
    employee_name: Optional[str] = None
    department: Optional[str] = None
    date: Optional[date] = None
    status: Optional[AttendanceStatus] = None
