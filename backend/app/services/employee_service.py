from sqlalchemy.orm import Session
from app.dao.employee_dao import employee_dao
from app.schemas.employee import EmployeeCreate
from app.core.logger import log_event
from fastapi import HTTPException, status

class EmployeeService:
    def create_employee(self, db: Session, employee: EmployeeCreate):
        existing_employee = employee_dao.get_employee_by_email(db, employee.email)
        if existing_employee:
            log_event(f"Attempt to create duplicate employee: {employee.email}", "warning")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Employee with this email already exists"
            )
        
        new_employee = employee_dao.create_employee(db, employee)
        log_event(f"Employee created: {new_employee.email}", "info")
        return new_employee

    def get_employees(self, db: Session, skip: int = 0, limit: int = 100):
        return employee_dao.get_all_employees(db, skip, limit)

    def delete_employee(self, db: Session, employee_id: int):
        success = employee_dao.soft_delete_employee(db, employee_id)
        if not success:
            log_event(f"Attempt to delete non-existent employee: {employee_id}", "warning")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found"
            )
        log_event(f"Employee soft deleted: {employee_id}", "info")
        return {"message": "Employee deleted successfully"}

    def update_employee(self, db: Session, employee_id: int, employee: EmployeeCreate):
        # Check if employee exists
        existing_employee = employee_dao.get_employee(db, employee_id)
        if not existing_employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Employee not found"
            )

        # Check for duplicate email (excluding current employee)
        email_check = employee_dao.get_employee_by_email(db, employee.email)
        if email_check and email_check.id != employee_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already assigned to another employee"
            )

        updated_employee = employee_dao.update_employee(db, employee_id, employee)
        log_event(f"Employee updated: {updated_employee.email}", "info")
        return updated_employee

employee_service = EmployeeService()
