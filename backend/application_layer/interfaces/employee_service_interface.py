from abc import ABC, abstractmethod
from application_layer.classes.employee import Employee

class IEmployeeService(ABC):
    @abstractmethod
    def add_employee(self, employee: Employee):
        pass

    @abstractmethod
    def get_all_employee(self) -> list[Employee]:
        pass

    @abstractmethod
    def search_employee(self, input_text):
        pass

    @abstractmethod
    def delete_an_employee(self, employee_id):
        pass

    @abstractmethod
    def update_an_employee(self, employee: Employee):
        pass

    