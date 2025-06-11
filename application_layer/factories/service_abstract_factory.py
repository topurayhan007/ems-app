from abc import ABC, abstractmethod
from application_layer.interfaces.employee_service_interface import IEmployeeService
from application_layer.interfaces.education_service_interface import IEducationService
from application_layer.interfaces.experience_service_interface import IExperienceService
from application_layer.interfaces.database_manager_interface import IDatabaseManager
from application_layer.services.employee_service import EmployeeService
from application_layer.services.education_service import EducationService
from application_layer.services.experience_service import ExperienceService


class ServiceAbstractFactory(ABC):
    @abstractmethod
    def create_employee_service(self) -> IEmployeeService:
        pass
    
    @abstractmethod
    def create_education_service(self) -> IEducationService:
        pass
    
    @abstractmethod
    def create_experience_service(self) -> IExperienceService:
        pass

class ConcreteServiceFactory(ServiceAbstractFactory):
    def __init__(self, db_manager: IDatabaseManager):
        self.db_manager = db_manager
    
    def create_employee_service(self) -> IEmployeeService:
        return EmployeeService(self.db_manager)
    
    def create_education_service(self) -> IEducationService:
        return EducationService(self.db_manager)
    
    def create_experience_service(self) -> IExperienceService:
        return ExperienceService(self.db_manager)