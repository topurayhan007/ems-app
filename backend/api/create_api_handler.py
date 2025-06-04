from api_request_handler import APIRequestHandler

from application_layer.interfaces.employee_service_interface import IEmployeeService
from application_layer.interfaces.education_service_interface import IEducationService
from application_layer.interfaces.experience_service_interface import IExperienceService

def create_handler(employee_service: IEmployeeService, education_service: IEducationService, experience_service: IExperienceService):
    def handler(*args, **kwargs):
        return APIRequestHandler(employee_service, education_service, experience_service, *args, **kwargs)
    
    return handler