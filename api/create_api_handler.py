from api_request_handler import APIRequestHandler

from application_layer.interfaces.employee_service_interface import IEmployeeService
from application_layer.interfaces.education_service_interface import IEducationService
from application_layer.interfaces.experience_service_interface import IExperienceService
from application_layer.mappers.employee_mapper import EmployeeMapper
from application_layer.mappers.education_mapper import EducationMapper
from application_layer.mappers.experience_mapper import ExperienceMapper

def create_handler(employee_service: IEmployeeService, education_service: IEducationService, experience_service: IExperienceService, employee_mapper:EmployeeMapper, education_mapper: EducationMapper, experience_mapper: ExperienceMapper):
    def handler(*args, **kwargs):
        return APIRequestHandler(employee_service, education_service, experience_service, employee_mapper, education_mapper, experience_mapper, *args, **kwargs)
    
    return handler