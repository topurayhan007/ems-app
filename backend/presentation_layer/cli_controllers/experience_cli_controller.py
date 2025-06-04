from application_layer.classes.experience import Experience
from application_layer.interfaces.experience_service_interface import IExperienceService
from application_layer.services.input_validator_service import InputValidator
from presentation_layer.table_printer import Printer
from api.requester import Requester
from datetime import datetime

class ExperienceCliController:
    def __init__(self, experience_service: IExperienceService):
        self.validator = InputValidator()
        self.printer = Printer()
        self.experience_service = experience_service
        self.requester = Requester()

    def add_experience(self, _employee_id):
        _company_name = self.validator.get_input_and_validate(str, "Enter company's name: ")
        _position = self.validator.get_input_and_validate(str, "Enter the job title: ")
        _joining_date = self.validator.get_input_and_validate(str, "Enter joining date (YYYY-MM-DD): ", self.validator.validate_date, "⚠️  Invalid date format")
        _ending_date = self.validator.get_input_and_validate(str, "Enter leaving date (YYYY-MM-DD): ", self.validator.validate_date, "⚠️  Invalid date format")
        _location = self.validator.get_input_and_validate(str, "Enter company's location: ")
    
        experience = Experience(None, _employee_id, _company_name, _position, _joining_date, _ending_date, _location)

        # experience_id = self.experience_service.add_experience(experience)
        response = self.requester.request("POST", "http://localhost:8000/api/experiences", experience)
        experience_id = response["result"]

        if experience_id is not None:
            print(f"✅ Experience with ID: {experience_id} saved into database!")
        else:
            print("⚠️  Couldn't add to database!")        

    def search_experience(self, employee_id):
        # experiences = self.experience_service.search_experiences_of_an_employee(employee_id)
        response = self.requester.request("GET", f"http://localhost:8000/api/experiences/{employee_id}")
        json_data = response["experiences"]
        experiences = self.__json_to_experience_obj(json_data)

        if experiences is None or len(experiences) == 0:
            print("⚠️  No experiences found for the employee!")
            return None
        else: 
            print(self.printer.print_experience_table(experiences, "multiple"))
            return experiences

    def delete_experience(self, experience_id):
        # result = self.experience_service.delete_an_experience_of_an_employee(experience_id)
        response = self.requester.request("DELETE", f"http://localhost:8000/api/experiences/{experience_id}")

        if response["result"] and response["result"] == 1:
            print("✅ Experience deleted from database!")
        else:
            print("⚠️  Couldn't delete from database!")

    
    def update_experience_fields_and_put_into_db(self, experience:Experience):
        item = experience
        print("=> Experience selected:")
        print(self.printer.print_experience_table(item, "single"))
        print("These are the fields you can update: ")
        print("Company Name, Position, Joining Date, Ending Date, Location")
        fields = input("From the above fields type the fields you want to update separated by commas: ")
        fields = fields.split(",")  

        for field in fields:
            if field.strip().lower() in "Company Name".lower():
                 item._company_name = self.validator.get_input_and_validate(str, "Enter new company's name: ")
            elif field.strip().lower() in "Position".lower():
                 item._position = self.validator.get_input_and_validate(str, "Enter new job title: ")
            elif field.strip().lower() in "Joining Date".lower():
                 item._joining_date = self.validator.get_input_and_validate(str, "Enter new joining date (YYYY-MM-DD): ", self.validator.validate_date, "⚠️  Invalid date format")
            elif field.strip().lower() in "Ending Date".lower():
                 item._ending_date = self.validator.get_input_and_validate(str, "Enter new leaving date (YYYY-MM-DD): ", self.validator.validate_date, "⚠️  Invalid date format")
            elif field.strip().lower() in "Location".lower():
                 item._location = self.validator.get_input_and_validate(str, "Enter new company's location: ")
            else:
                print("⚠️  You entered an invalid field, skipping this field...")
            
        try:
            datetime.strptime(item._joining_date, "%Y-%m-%d")
        except ValueError:
            item._joining_date = datetime.strptime(item._joining_date, "%d-%m-%Y").strftime("%Y-%m-%d")

        try:
            datetime.strptime(item._joining_date, "%Y-%m-%d")
        except ValueError:
            item._ending_date = datetime.strptime(item._ending_date, "%d-%m-%Y").strftime("%Y-%m-%d")

        # result = self.experience_service.update_an_experience_of_an_employee(item)
        response = self.requester.request("PUT", "http://localhost:8000/api/experiences", item)
        
        if response["result"] and response["result"] == 1:
            print("✅ Experience updated successfully!") 
        else:
            print("⚠️  Couldn't update experience, please try again!")


    def update_experience(self, experiences: list[Experience], experience_id):
        for item in experiences:
            if  item._experience_id == experience_id:
                self.update_experience_fields_and_put_into_db(item)

    
    def __json_to_experience_obj(self, data) -> list[Experience]:
        experiences: list[Experience] = []
        for row in data:
            experience = Experience(
                row['_experience_id'],
                row['_employee_id'],
                row['_company_name'],
                row['_position'],
                row['_joining_date'],
                row['_ending_date'],
                row['_location']
            )
            experiences.append(experience)
        return experiences


        