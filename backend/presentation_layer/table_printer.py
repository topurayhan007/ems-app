# Prints the tables for each classes
from tabulate import tabulate
from application_layer.classes.employee import Employee
from application_layer.classes.education import EducationalDegree
from application_layer.classes.experience import Experience

class Printer:
    def print_employee_table(self, employees: list[Employee], flag):
        headers = ["ID", "Name", "DoB", "NID", "Email", "Phone no.", "Gender", "Marital Status", "Department", "Designation", "Joining Date", "Present Address"]
        employeesData = []
        if flag == "single":
            item = employees
            employeesData.append([item._employee_id, item._name, item._date_of_birth, item._nid, item._email, item._phone_no, item._gender, item._marital_status, item._dept, item._designation, item._joining_date, item._present_address])
            return tabulate(employeesData, headers=headers, tablefmt="fancy_grid")  
        else:   
            for item in employees:
                employeesData.append([item._employee_id, item._name, item._date_of_birth, item._nid, item._email, item._phone_no, item._gender, item._marital_status, item._dept, item._designation, item._joining_date, item._present_address])
            return tabulate(employeesData, headers=headers, tablefmt="fancy_grid")  

    def print_degree_table(self, degrees: list[EducationalDegree], flag):
        headers = ["ID", "Employee ID", "Degree Name", "Institute Name", "Major", "Location", "GPA", "GPA Scale", "Year of Passing"]
        degreesData = []
        if flag == "single":
            item = degrees
            degreesData.append([item._degree_id, item._employee_id, item._degree_name, item._institute_name, item._major, item._location, item._gpa, item._gpa_scale, item._year_of_passing])
            return tabulate(degreesData, headers=headers, tablefmt="fancy_grid")  
        else:   
            for item in degrees:
                degreesData.append([item._degree_id, item._employee_id, item._degree_name, item._institute_name, item._major, item._location, item._gpa, item._gpa_scale, item._year_of_passing])
            return tabulate(degreesData, headers=headers, tablefmt="fancy_grid") 
        
    def print_experience_table(self, experiences: list[Experience], flag):
        headers = ["ID", "Employee ID", "Company Name", "Position", "Joining Date", "Ending Date", "Location"]
        experiencesData = []
        if flag == "single":
            item = experiences
            experiencesData.append([item._experience_id, item._employee_id, item._company_name, item._position, item._joining_date, item._ending_date, item._location])
            return tabulate(experiencesData, headers=headers, tablefmt="fancy_grid")  
        else:   
            for item in experiences:
                experiencesData.append([item._experience_id, item._employee_id, item._company_name, item._position, item._joining_date, item._ending_date, item._location])
            return tabulate(experiencesData, headers=headers, tablefmt="fancy_grid") 