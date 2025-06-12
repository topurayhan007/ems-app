from http.server import HTTPServer
from create_api_handler import create_handler
import os
from dotenv import load_dotenv
import os
import sys

project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../"))
sys.path.append(project_root)

from database_layer.db_setup import DatabaseManager
from application_layer.services.employee_service import EmployeeService
from application_layer.services.education_service import EducationService
from application_layer.services.experience_service import ExperienceService
from database_layer.storage_managers.employee_db_manager import EmployeeDBManager
from database_layer.storage_managers.education_db_manager import EducationDBManager
from database_layer.storage_managers.experience_db_manager import ExperienceDBManager
from application_layer.mappers.employee_mapper import EmployeeMapper
from application_layer.mappers.education_mapper import EducationMapper
from application_layer.mappers.experience_mapper import ExperienceMapper


load_dotenv()

config = {
    'user': os.getenv("DB_USER"),
    'password': os.getenv("DB_PASSWORD"),
    'host': os.getenv("DB_HOST"),
    'database': os.getenv("DB_NAME"),
    'raise_on_warnings': True
}

def run(server_class, handler_class, port):
    server_address = ('', port)
    print(f"Server running at http://localhost:{port}")
    httpd = server_class(server_address, handler_class)
    httpd.serve_forever()

if __name__ == "__main__":
    db_manager = DatabaseManager(config)

    # Mappers
    employee_mapper = EmployeeMapper()
    education_mapper = EducationMapper()
    experience_mapper = ExperienceMapper()

    # Database Managers
    employee_db_manager = EmployeeDBManager(db_manager, employee_mapper)
    education_db_manager = EducationDBManager(db_manager, education_mapper)
    experience_db_manager = ExperienceDBManager(db_manager, experience_mapper)

    employee_service = EmployeeService(employee_db_manager)
    education_service = EducationService(education_db_manager)
    experience_service = ExperienceService(experience_db_manager)

    PORT = 8000
    server_class = HTTPServer
    handler_class = create_handler(employee_service, education_service, experience_service, employee_mapper, education_mapper, experience_mapper)

    run(server_class, handler_class, PORT)
