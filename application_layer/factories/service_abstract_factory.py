from abc import ABC, abstractmethod
from application_layer.interfaces.employee_service_interface import IEmployeeService
from application_layer.interfaces.education_service_interface import IEducationService
from application_layer.interfaces.experience_service_interface import IExperienceService
from application_layer.interfaces.database_manager_interface import IDatabaseManager
from application_layer.services.employee_service import EmployeeService
from application_layer.services.education_service import EducationService
from application_layer.services.experience_service import ExperienceService
from database_layer.storage_managers.employee_db_manager import EmployeeDBManager
from database_layer.storage_managers.education_db_manager import EducationDBManager
from database_layer.storage_managers.experience_db_manager import ExperienceDBManager


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
    def __init__(
        self,
        employee_db_manager: EmployeeDBManager,
        education_db_manager: EducationDBManager,
        experience_db_manager: ExperienceDBManager,
    ):
        self.employee_db_manager = employee_db_manager
        self.education_db_manager = education_db_manager
        self.experience_db_manager = experience_db_manager

    def create_employee_service(self) -> IEmployeeService:
        return EmployeeService(self.employee_db_manager)

    def create_education_service(self) -> IEducationService:
        return EducationService(self.education_db_manager)

    def create_experience_service(self) -> IExperienceService:
        return ExperienceService(self.experience_db_manager)