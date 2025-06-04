# Class that gets input, validates, and pass to the service class
from application_layer.classes.employee import Employee
from application_layer.services.input_validator_service import InputValidator
from presentation_layer.cli_controllers.education_cli_controller import EducationCliController
from presentation_layer.cli_controllers.experience_cli_controller import ExperienceCliController
from application_layer.interfaces.employee_service_interface import IEmployeeService
from presentation_layer.table_printer import Printer
from api.requester import Requester
from datetime import datetime
from application_layer.builders.employee_builder import EmployeeBuilder

class EmployeeCliController:
    def __init__(self, employee_service: IEmployeeService, education_cli_controller: EducationCliController, experience_cli_controller: ExperienceCliController, employee_builder: EmployeeBuilder):
        self.validator = InputValidator()
        self.education_cli_controller = education_cli_controller
        self.experience_cli_controller = experience_cli_controller
        self.printer = Printer()
        self.employee_service = employee_service
        self.requester = Requester()
        self.employee_builder = employee_builder
    

    def add_an_employee(self):
        self.employee_builder.add_name(self.validator.get_input_and_validate(str, "Enter name: "))
        self.employee_builder.add_date_of_birth(self.validator.get_input_and_validate(str, "Enter date of birth (YYYY-MM-DD): ", self.validator.validate_date, "⚠️  Invalid date format"))
        self.employee_builder.add_nid(self.validator.get_input_and_validate(int, "Enter NID no: ", self.validator.validate_nid, "⚠️  NID should be between 10 and 17 digits"))
        self.employee_builder.add_email(self.validator.get_input_and_validate(str, "Enter email address: ", self.validator.validate_email, "⚠️  Invalid email format"))
        self.employee_builder.add_phone_no(self.validator.get_input_and_validate(str, "Enter phone no: ", self.validator.validate_phone_number, "⚠️  Phone no. should be 11 digits"))
        self.employee_builder.add_gender(self.validator.get_input_and_validate(str, "Enter gender (Male/Female/Other): ", self.validator.validate_gender, "⚠️  Invalid gender input"))
        self.employee_builder.add_father_name(self.validator.get_input_and_validate(str, "Enter father's name: "))
        self.employee_builder.add_mother_name(self.validator.get_input_and_validate(str, "Enter mother's name: "))
        self.employee_builder.add_marital_status(self.validator.get_input_and_validate(str, "Enter marital status (Single/Married): "))
        self.employee_builder.add_role(self.validator.get_input_and_validate(str, "Enter role: "))
        self.employee_builder.add_dept(self.validator.get_input_and_validate(str, "Enter department name: "))
        self.employee_builder.add_designation(self.validator.get_input_and_validate(str, "Enter designation: "))
        self.employee_builder.add_nationality(self.validator.get_input_and_validate(str, "Enter nationality: "))
        self.employee_builder.add_joining_date(self.validator.get_input_and_validate(str, "Enter joining date (YYYY-MM-DD): ", self.validator.validate_date, "⚠️  Invalid date format"))
        self.employee_builder.add_present_address(self.validator.get_input_and_validate(str, "Enter present address: "))
        self.employee_builder.add_permanent_address(self.validator.get_input_and_validate(str, "Enter permanent address: "))

        # employee = Employee(None, _name, _date_of_birth, _nid, _email, _phone_no, _gender, _father_name, _mother_name, _marital_status, _dept, _designation, _nationality, _joining_date, _present_address, _permanent_address)
        employee = self.employee_builder.build()

        # Send to employee service to add employee
        # _employee_id = self.employee_service.add_employee(employee)
        response = self.requester.request("POST", "http://localhost:8000/api/employees", employee)
        _employee_id = response["result"]

        if _employee_id is not None:
            print(f"✅ Employee with ID: {_employee_id} added successfully")
            no_of_degrees = int(input("How many educational degress do you want to add? => "))
            for i in range(no_of_degrees):
                # TODO: 
                self.education_cli_controller.add_educational_degree(_employee_id)

            no_of_exp = int(input("How many job experiences do you want to add? => "))
            for i in range(no_of_exp):
                self.experience_cli_controller.add_experience(_employee_id)
        
        else:
            print("Something went wrong")
            

    def getAllEmployees(self):
        # Get employees from API
        # employees = self.employee_service.get_all_employee()
        response = self.requester.request("GET", "http://localhost:8000/api/employees")
        json_data = response['employees']
        employees = self.__json_to_employee_obj(json_data)

        if employees is None or len(employees) == 0:
            print("⚠️  No data found!")
            return None
        else: 
            print(self.printer.print_employee_table(employees, "multiple"))
            return employees
    
    def searchAnEmployee(self, input_text):
        # search_result = self.employee_service.search_employee(input_text)
        results = self.requester.request("GET", f"http://localhost:8000/api/employees?q={input_text}")
        json_data = results['employees']
        search_result = self.__json_to_employee_obj(json_data)
        
        if search_result is None or len(search_result) == 0:
            print("⚠️  Employee not found!")
            return None
        else: 
            print(self.printer.print_employee_table(search_result, "multiple")) 
            return search_result
            
    def updateEmployeeFields(self, employee: Employee):
        item = employee
        print("=> Employee selected: ")
        print(self.printer.print_employee_table(item, "single"))
        print("These are the fields you can update: ")
        print("Name, Date of Birth, NID, Email, Phone Number, Gender, Father's Name, Mother's Name, Marital Status, Role, Department, Designation, Nationality, Joining Date, Present Address, Permanent Address")
        fields = input("From the above fields type the fields you want to update separated by commas: ")
        fields = fields.split(",")

        for field in fields:
            if field.strip().lower() in "Name".lower():
                item._name = self.validator.get_input_and_validate(str, "Enter new name: ")
            elif field.strip().lower() in "Date of Birth".lower():
                item._date_of_birth = self.validator.get_input_and_validate(str, "Enter new date of birth (YYYY-MM-DD): ", self.validator.validate_date, "⚠️  Invalid date format")
            elif field.strip().lower() in "NID".lower():
                item._nid = self.validator.get_input_and_validate(int, "Enter new NID no: ", self.validator.validate_nid, "⚠️  NID should be between 10 and 17 digits")
            elif field.strip().lower() in "Email".lower():
                item._email = self.validator.get_input_and_validate(str, "Enter new email address: ", self.validator.validate_email, "⚠️  Invalid email format")
            elif field.strip().lower() in "Phone number".lower():
                item._phone_no = self.validator.get_input_and_validate(str, "Enter new phone no: ", self.validator.validate_phone_number, "⚠️  Phone no. should be 11 digits")
            elif field.strip().lower() in "Gender".lower():
                item._gender = self.validator.get_input_and_validate(str, "Enter new gender (Male/Female/Other): ", self.validator.validate_gender, "⚠️  Invalid gender input")
            elif field.strip().lower() in "Father's Name".lower():
                item._father_name = self.validator.get_input_and_validate(str, "Enter new father's name: ")
            elif field.strip().lower() in "Mother's Name".lower():
                item._mother_name = self.validator.get_input_and_validate(str, "Enter new mother's name: ")
            elif field.strip().lower() in "Marital Status".lower():
                item._marital_status = self.validator.get_input_and_validate(str, "Enter new marital status (Single/Married): ")
            elif field.strip().lower() in "Role".lower():
                item._role = self.validator.get_input_and_validate(str, "Enter new role: ")
            elif field.strip().lower() in "Department".lower():
                item._dept = self.validator.get_input_and_validate(str, "Enter new department name: ")
            elif field.strip().lower() in "Designation".lower():
                item._designation = self.validator.get_input_and_validate(str, "Enter new designation: ")
            elif field.strip().lower() in "Nationality".lower():
                item._nationality = self.validator.get_input_and_validate(str, "Enter new nationality: ")
            elif field.strip().lower() in "Joining Date".lower():
                item._joining_date = self.validator.get_input_and_validate(str, "Enter new joining date (YYYY-MM-DD): ", self.validator.validate_date, "⚠️  Invalid date format")
            elif field.strip().lower() in "Present Address".lower():
                item._present_address = self.validator.get_input_and_validate(str, "Enter new present address: ")
            elif field.strip().lower() in "Permanent Address".lower():
                item._permanent_address = self.validator.get_input_and_validate(str, "Enter new permanent address: ")
            else:
                print("⚠️  You entered an invalid field, skipping this field...")
        
        try:
            datetime.strptime(employee._date_of_birth, "%Y-%m-%d")
        except ValueError:
            employee._date_of_birth = datetime.strptime(employee._date_of_birth, "%d-%m-%Y").strftime("%Y-%m-%d")

        try:
            datetime.strptime(employee._joining_date, "%Y-%m-%d")
        except ValueError:
            employee._joining_date = datetime.strptime(employee._joining_date, "%d-%m-%Y").strftime("%Y-%m-%d")

        # self.employee_service.update_an_employee(item)
        response = self.requester.request("PUT", f"http://localhost:8000/api/employees/{employee._employee_id}", employee)
        
        if response["result"] and response["result"] == 1:
            print("✅ Employee updated successfully!") 
        else:
            print("⚠️  Couldn't update employee!")
    
    def deleteAnEmployee(self, employee:Employee):
        # self.employee_service.delete_an_employee(employee._employee_id)
        response = self.requester.request("DELETE", f"http://localhost:8000/api/employees/{employee._employee_id}", employee)
        
        if response["result"] and response["result"] == 1:
            print("✅ Employee deleted successfully!") 
        else:
            print("⚠️  Couldn't delete employee!")


    def selectEmployeeAndPerformUpdateOrDelete(self, search_result: list[Employee], action):
        if isinstance(search_result, str):
                print(search_result)
        else: 
            if len(search_result) > 1:
                selected_emp = None
                while True:
                    emp_id = input(f"Type the employee ID you want to {action} from the above result: ")
                    for item in search_result:
                        if item._employee_id == int(emp_id):
                            selected_emp = item
                            break
                    if selected_emp is not None:
                        break
                    else: 
                        print("⚠️  ID didn't match, please try again")

                self.updateEmployeeFields(selected_emp) if action == "update" else self.deleteAnEmployee(selected_emp) 
            else:
                self.updateEmployeeFields(search_result[0]) if action == "update" else self.deleteAnEmployee(search_result[0])

    def __json_to_employee_obj(self, data) -> list[Employee]:
        employees: list[Employee] = []
        for row in data:
            employee = Employee(
                row['_employee_id'],
                row['_name'],
                row['_date_of_birth'],
                row['_nid'],
                row['_email'],
                row['_phone_no'],
                row['_gender'],
                row['_father_name'],
                row['_mother_name'],
                row['_marital_status'],
                row['_role'],
                row['_dept'],
                row['_designation'],
                row['_nationality'],
                row['_joining_date'],
                row['_present_address'],
                row['_permanent_address']
            )
            employees.append(employee)
        return employees
    
      