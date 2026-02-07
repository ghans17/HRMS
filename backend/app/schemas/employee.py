from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class EmployeeBase(BaseModel):
    full_name: str
    email: EmailStr
    department: str

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True
