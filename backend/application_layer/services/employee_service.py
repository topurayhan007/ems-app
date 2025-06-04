# Bridge between CLI controllers and DB managers
from application_layer.classes.employee import Employee
from application_layer.interfaces.employee_repository_interface import IEmployeeRepository
from application_layer.interfaces.employee_service_interface import IEmployeeService

class EmployeeService(IEmployeeService):
    def __init__(self, employee_db_manager: IEmployeeRepository):
        self.employee_db_manager = employee_db_manager
    
    def add_employee(self, employee: Employee):
        result = self.employee_db_manager.create(employee)
        return result
    
    def get_all_employee(self)-> list[Employee]:
        employees = self.employee_db_manager.get_all()
        return employees
    
    def search_employee(self, input_text):
        employees = self.employee_db_manager.search(input_text)
        return employees
    
    def delete_an_employee(self, employee_id):
        result = self.employee_db_manager.delete(employee_id)
        return result

    def update_an_employee(self, employee_id, employee: Employee):
        result = self.employee_db_manager.update(employee_id, employee)
        return result
