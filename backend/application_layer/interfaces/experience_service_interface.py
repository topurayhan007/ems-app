from abc import ABC, abstractmethod
from application_layer.classes.experience import Experience

class IExperienceService(ABC):
    @abstractmethod
    def add_experience(self, experience: Experience):
        pass

    @abstractmethod
    def search_experiences_of_an_employee(self, employee_id):
        pass

    @abstractmethod
    def delete_an_experience_of_an_employee(self, experience_id):
        pass

    @abstractmethod
    def update_an_experience_of_an_employee(self, experience: Experience):
        pass
