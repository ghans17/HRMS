from sqlalchemy.orm import Session
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate

class EmployeeDAO:
    def get_employee(self, db: Session, employee_id: int):
        return db.query(Employee).filter(Employee.id == employee_id, Employee.is_active == True).first()

    def get_employee_by_email(self, db: Session, email: str):
        return db.query(Employee).filter(Employee.email == email, Employee.is_active == True).first()

    def get_all_employees(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(Employee).filter(Employee.is_active == True).offset(skip).limit(limit).all()

    def create_employee(self, db: Session, employee: EmployeeCreate):
        db_employee = Employee(
            full_name=employee.full_name,
            email=employee.email,
            department=employee.department
        )
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
        return db_employee

    def soft_delete_employee(self, db: Session, employee_id: int):
        employee = db.query(Employee).filter(Employee.id == employee_id).first()
        if employee:
            employee.is_active = False
            db.commit()
            return True
        return False

    def update_employee(self, db: Session, employee_id: int, employee_data: EmployeeCreate):
        db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
        if db_employee:
            db_employee.full_name = employee_data.full_name
            db_employee.email = employee_data.email
            db_employee.department = employee_data.department
            db.commit()
            db.refresh(db_employee)
            return db_employee
        return None

employee_dao = EmployeeDAO()
