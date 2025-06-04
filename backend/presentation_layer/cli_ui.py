# The UI
from presentation_layer.cli_controllers.employee_cli_controller import EmployeeCliController
from presentation_layer.cli_controllers.education_cli_controller import EducationCliController
from presentation_layer.cli_controllers.experience_cli_controller import ExperienceCliController

class CLI:
    def __init__(self, employee_cli_controller:EmployeeCliController, education_cli_controller:EducationCliController, experience_cli_controller:ExperienceCliController):
        self.employee_cli_controller = employee_cli_controller
        self.education_cli_controller = education_cli_controller
        self.experience_cli_controller = experience_cli_controller

    def print_menu(self):
        options = """Select an option to continue: 
1.  Add an employee 
2.  Show all employees
3.  Find employee
4.  Update an employee
5.  Delete an employee
6.  Add degree/experience to an employee
7.  Find degrees/experiences of an employee
8.  Update degree/experience of an employee
9.  Delete degree/experience of an employee
10. Exit app
help: Help \n"""
        print(options)

    def run(self):
        print("====================================")
        print("||   Employee Management System   ||")
        print("==================================== \n")
        self.print_menu()
        
        while True: 
            choice = input("=> ")

            match choice:
                case "1":
                    print("=> Please give all the information: ")
                    self.employee_cli_controller.add_an_employee()
                    print("✅ Employee info saved!")

                case "2":
                    print("=> All Employee Details:")
                    self.employee_cli_controller.getAllEmployees()

                case "3":
                    search_input = input("=> Search for employee: ")
                    self.employee_cli_controller.searchAnEmployee(search_input.strip())

                case "4":
                    print("=> Update operation selected: ")
                    search_input = input("=> Search for employee: ")
                    search_result = self.employee_cli_controller.searchAnEmployee(search_input.strip())
                    if search_result is not None:
                        self.employee_cli_controller.selectEmployeeAndPerformUpdateOrDelete(search_result, "update")

                case "5":
                    print("=> Delete operation selected:")
                    search_input = input("=> Search for employee: ")
                    search_result = self.employee_cli_controller.searchAnEmployee(search_input.strip())
                    if search_result is not None:
                        self.employee_cli_controller.selectEmployeeAndPerformUpdateOrDelete(search_result, "delete")

                case "6":
                    print("Add degree/experience operation selected:")
                    choice_input = input("=> Type degree/experience that you want to add to an employee: ")
                    if choice_input.strip().lower() in "Degree".lower():
                        employee_id = input("=> Type the employee ID: ")
                        self.education_cli_controller.add_educational_degree(employee_id)
                    elif choice_input.strip().lower() in "Experience".lower():
                        employee_id = input("=> Type the employee ID: ")
                        self.experience_cli_controller.add_experience(employee_id)
                    else:
                        print("⚠️  Invalid, please try again!")
                        pass
                    
                case "7":
                    print("=> Finding degree/experience operation selected:")
                    choice_input = input("=> Type degree/experience that you want to see of an employee: ")
                    if choice_input.strip().lower() in "Degree".lower():
                        employee_id = input("=> Type the employee ID: ")
                        self.education_cli_controller.search_educational_degrees_of_an_employee(employee_id)
                    elif choice_input.strip().lower() in "Experience".lower():
                        employee_id = input("=> Type the employee ID: ")
                        self.experience_cli_controller.search_experience(employee_id)
                    else:
                        print("⚠️  Invalid, please try again!")
                        pass

                case "8":
                    print("=> Updating degree/experience operation selected:")
                    choice_input = input("=> Type degree/experience that you want to update of an employee: ")
                    if choice_input.strip().lower() in "Degree".lower():
                        employee_id = input("=> Type the employee ID: ")
                        degrees = self.education_cli_controller.search_educational_degrees_of_an_employee(employee_id)
                        if degrees is not None:
                            degree_id = int(input("Type the ID that you want to update: "))
                            self.education_cli_controller.update_educational_degree(degrees, degree_id)

                    elif choice_input.strip().lower() in "Experience".lower():
                        employee_id = input("=> Type the employee ID: ")
                        experiences = self.experience_cli_controller.search_experience(employee_id)
                        if experiences is not None:
                            experience_id = int(input("Type the ID that you want to update: "))
                            self.experience_cli_controller.update_experience(experiences, experience_id)

                    else:
                        print("⚠️  Invalid, please try again!")
                        pass

                case "9":
                    print("=> Deleting degree/experience operation selected:")
                    choice_input = input("=> Type degree/experience that you want to update of an employee: ")
                    if choice_input.strip().lower() in "Degree".lower():
                        employee_id = input("=> Type the employee ID: ")
                        degrees = self.education_cli_controller.search_educational_degrees_of_an_employee(employee_id)
                        if degrees is not None:
                            degree_id = int(input("Type the ID that you want to delete: "))
                            self.education_cli_controller.delete_educational_degree(degree_id)

                    elif choice_input.strip().lower() in "Experience".lower():
                        employee_id = input("=> Type the employee ID: ")
                        experiences = self.experience_cli_controller.search_experience(employee_id)
                        if experiences is not None:
                            experience_id = int(input("Type the ID that you want to delete: "))
                            self.experience_cli_controller.delete_experience(experience_id)

                    else:
                        print("⚠️  Invalid, please try again!")
                        pass

                case "10":
                    print("Exiting the app....")
                    break

                case "help":
                    self.print_menu()

                