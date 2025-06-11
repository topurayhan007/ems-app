from application_layer.interfaces.employee_service_interface import IEmployeeService
from application_layer.interfaces.education_service_interface import IEducationService
from application_layer.interfaces.experience_service_interface import IExperienceService
from application_layer.services.employee_service import EmployeeService
from application_layer.services.education_service import EducationService
from application_layer.services.experience_service import ExperienceService
from application_layer.interfaces.database_manager_interface import IDatabaseManager

class ServiceFactory:
    @staticmethod
    def create_employee_service(db_manager: IDatabaseManager) -> IEmployeeService:
        return EmployeeService(db_manager)
    
    @staticmethod
    def create_education_service(db_manager: IDatabaseManager) -> IEducationService:
        return EducationService(db_manager)
    
    @staticmethod
    def create_experience_service(db_manager: IDatabaseManager) -> IExperienceService:
        return ExperienceService(db_manager)