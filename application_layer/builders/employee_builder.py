from application_layer.classes.employee import Employee

class EmployeeBuilder:
    def __init__(self):
        self._employee_id = None
        self._name = None
        self._date_of_birth = None
        self._nid = None
        self._email = None
        self._phone_no = None
        self._gender = None
        self._father_name = None
        self._mother_name = None
        self._marital_status = None
        self._role = None
        self._dept = None
        self._designation = None
        self._salary = None
        self._nationality = None
        self._joining_date = None
        self._present_address = None
        self._permanent_address = None

    def add_employee_id(self, employee_id):
        self._employee_id = employee_id
        return self

    def add_name(self, name):
        self._name = name
        return self

    def add_date_of_birth(self, date_of_birth):
        self._date_of_birth = date_of_birth
        return self

    def add_nid(self, nid):
        self._nid = nid
        return self

    def add_email(self, email):
        self._email = email
        return self

    def add_phone_no(self, phone_no):
        self._phone_no = phone_no
        return self

    def add_gender(self, gender):
        self._gender = gender
        return self

    def add_father_name(self, father_name):
        self._father_name = father_name
        return self

    def add_mother_name(self, mother_name):
        self._mother_name = mother_name
        return self

    def add_marital_status(self, marital_status):
        self._marital_status = marital_status
        return self

    def add_role(self, role):
        self._role = role
        return self
    
    def add_dept(self, dept):
        self._dept = dept
        return self

    def add_designation(self, designation):
        self._designation = designation
        return self
    
    def add_salary(self, salary):
        self._salary = salary
        return self

    def add_nationality(self, nationality):
        self._nationality = nationality
        return self

    def add_joining_date(self, joining_date):
        self._joining_date = joining_date
        return self

    def add_present_address(self, present_address):
        self._present_address = present_address
        return self

    def add_permanent_address(self, permanent_address):
        self._permanent_address = permanent_address
        return self


    def build(self):
        return self
    