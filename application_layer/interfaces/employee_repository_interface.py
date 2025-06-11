from application_layer.interfaces.repository_interface import IRepository
from abc import abstractmethod
from application_layer.classes.employee import Employee

class IEmployeeRepository(IRepository):
    @abstractmethod
    def get_all(self):
        pass

    @abstractmethod
    def search(self, search_input: str)-> list[Employee]:
        pass