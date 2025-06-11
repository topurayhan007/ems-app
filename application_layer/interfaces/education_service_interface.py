from abc import ABC, abstractmethod
from application_layer.classes.education import EducationalDegree

class IEducationService(ABC):
    @abstractmethod
    def add_degree(self, degree: EducationalDegree):
        pass

    @abstractmethod
    def search_degrees_of_an_employee(self, employee_id):
        pass

    @abstractmethod
    def delete_a_degree_of_an_employee(self, degree_id):
        pass

    @abstractmethod
    def update_a_degree_of_an_employee(self, degree: EducationalDegree):
        pass