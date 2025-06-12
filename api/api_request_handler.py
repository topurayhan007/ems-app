from http.server import BaseHTTPRequestHandler
import json

import os
import sys

project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../"))
sys.path.append(project_root)

from application_layer.classes.employee import Employee
from application_layer.classes.education import EducationalDegree
from application_layer.classes.experience import Experience
from application_layer.interfaces.employee_service_interface import IEmployeeService
from application_layer.interfaces.education_service_interface import IEducationService
from application_layer.interfaces.experience_service_interface import IExperienceService
from application_layer.mappers.employee_mapper import EmployeeMapper
from application_layer.mappers.education_mapper import EducationMapper
from application_layer.mappers.experience_mapper import ExperienceMapper

class APIRequestHandler(BaseHTTPRequestHandler):
    def __init__(self, employee_service: IEmployeeService, education_service: IEducationService, experience_service: IExperienceService, employee_mapper: EmployeeMapper, education_mapper: EducationMapper, experience_mapper: ExperienceMapper, *args, **kwargs):
        self.employee_service = employee_service
        self.education_service = education_service
        self.experience_service = experience_service
        self.employee_mapper = employee_mapper
        self.education_mapper = education_mapper
        self.experience_mapper = experience_mapper
        super().__init__(*args, **kwargs)

    def _set_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(200, "ok")
        self._set_cors_headers()
        self.end_headers()

    def _send_response(self, status_code, status_msg, data):
        self.send_response(status_code, status_msg)
        self.send_header("Content-type", "application/json")
        self._set_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def do_GET(self):
        try:
            # http://localhost:8000/api
            if self.path == "/":
                self._send_response(200, "OK", "Server is running....")
            
            # employee APIs
            # http://localhost:8000/api/employees
            elif self.path == "/api/employees":
                employees = self.employee_service.get_all_employee()
                employee_dict = [employee.__dict__ for employee in employees] if employees else []
                self._send_response(200, "OK", {"employees": employee_dict})
            
            # http://localhost:8000/api/employees/{id}
            elif self.path.startswith("/api/employees/"):
                employee_id = self.path.split("employees/")[1]
                employees = self.employee_service.get_employee_by_id(employee_id)
                employee_dict = [employee.__dict__ for employee in employees] if employees else []
                self._send_response(200, "OK", {"employee": employee_dict})
            
            # http://localhost:8000/api/employees?q={input}
            elif self.path.startswith("/api/employees?q="):
                search_text = self.path.split("?q=")[1]
                employees = self.employee_service.search_employee(search_text)
                employee_dict = [employee.__dict__ for employee in employees]
                self._send_response(200, "OK", {"employees": employee_dict})
            
            # Education/Degrees API
            # http://localhost:8000/api/degrees/{id}
            elif self.path.startswith("/api/degrees/"):
                employee_id = self.path.split("degrees/")[1]
                degrees = self.education_service.search_degrees_of_an_employee(employee_id)
                degrees_dict = [edu.__dict__ for edu in degrees] if degrees else []
                self._send_response(200, "OK", {"degrees": degrees_dict})

            # Experiences API
            # http://localhost:8000/api/experiences/{id}
            elif self.path.startswith("/api/experiences/"):
                employee_id = self.path.split("experiences/")[1]
                experiences = self.experience_service.search_experiences_of_an_employee(employee_id)
                experiences_dict = [edu.__dict__ for edu in experiences] if experiences else []
                self._send_response(200, "OK", {"experiences": experiences_dict})
                
            else:
                self._send_response(404, "Not Found", {"error": "Invalid route"})

        except Exception as e:
            self._send_response(500, "Server Error", {"error": str(e)})

    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        
        if content_length:
            input_json = self.rfile.read(content_length).decode('utf-8')
            input_data = json.loads(input_json)
        else:
            input_data = None
        
        try:
            # Employee API
            # http://localhost:8000/api/employees
            if self.path == "/api/employees":
                employee = self.employee_mapper._to_obj(input_data)
                result = self.employee_service.add_employee(employee)
                self._send_response(201, "Created", {"result": result})
            
            # Education/Degress API
            # http://localhost:8000/api/degrees
            elif self.path == "/api/degrees":
                degree = self.education_mapper._to_obj(input_data)
                result = self.education_service.add_degree(degree)
                self._send_response(201, "Created", {"result": result})

            # Experiences API
            # http://localhost:8000/api/experiences
            elif self.path == "/api/experiences":
                experience = self.experience_mapper._to_obj(input_data)                
                result = self.experience_service.add_experience(experience)
                self._send_response(201, "Created", {"result": result})

            else:
                self._send_response(404, "Not Found", {"error": "Invalid route"})

        except Exception as e:
            self._send_response(500, "Server Error", {"error": str(e)})
        
    def do_PUT(self):
        content_length = int(self.headers['Content-Length'])
        
        if content_length:
            input_json = self.rfile.read(content_length).decode('utf-8')
            input_data = json.loads(input_json)
        else:
            input_data = None
        
        try:
            # Employee API
            # http://localhost:8000/api/employees/{id}
            if self.path.startswith("/api/employees/"):
                employee_id = self.path.split("employees/")[1]
                employee = self.employee_mapper._to_obj(input_data)
                result = self.employee_service.update_an_employee(employee_id, employee)
                self._send_response(201, "Created", {"result": result})
            
            # Education/Degress API
            # http://localhost:8000/api/degrees/{id}
            elif self.path.startswith("/api/degrees/"):
                degree_id = self.path.split("degrees/")[1]
                degree = self.education_mapper._to_obj(input_data)
                result = self.education_service.update_a_degree_of_an_employee(degree_id, degree)
                self._send_response(201, "Created", {"result": result})

            # Experiences API
            # http://localhost:8000/api/experiences/{id}
            elif self.path.startswith("/api/experiences/"):
                experience_id = self.path.split("experiences/")[1]
                experience = self.experience_mapper._to_obj(input_data)
                result = self.experience_service.update_an_experience_of_an_employee(experience_id, experience)
                self._send_response(201, "Created", {"result": result})

            else:
                self._send_response(404, "Not Found", {"error": "Invalid route"})

        except Exception as e:
            self._send_response(500, "Server Error", {"error": str(e)})
        
    
    def do_DELETE(self):
        try:
            # Employee API
            # http://localhost:8000/api/degrees/{id}
            if self.path.startswith("/api/employees/"):
                employee_id = self.path.split("employees/")[1]
                result = self.employee_service.delete_an_employee(employee_id)
                self._send_response(200, "OK", {"result": result})

            # Education/Degrees API
            # http://localhost:8000/api/degrees/{id}
            elif self.path.startswith("/api/degrees/"):
                employee_id = self.path.split("degrees/")[1]
                result = self.education_service.delete_a_degree_of_an_employee(employee_id)
                self._send_response(200, "OK", {"result": result})

            # Experiences API
            # http://localhost:8000/api/experiences/{id}
            elif self.path.startswith("/api/experiences/"):
                employee_id = self.path.split("experiences/")[1]
                result = self.experience_service.delete_an_experience_of_an_employee(employee_id)
                self._send_response(200, "OK", {"result": result})

        except Exception as e:
            self._send_response(500, "Server Error", {"error": str(e)})
        

    