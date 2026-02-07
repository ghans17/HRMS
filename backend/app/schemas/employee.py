from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class EmployeeBase(BaseModel):
    full_name: str = Field(..., min_length=1, description="Full name of the employee")
    email: EmailStr
    department: str = Field(..., min_length=1, description="Department of the employee")

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True
