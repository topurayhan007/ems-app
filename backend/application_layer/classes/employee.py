# Employee Class
class Employee:
    def __init__(self, _employee_id: None, _name, _date_of_birth, _nid, _email, _phone_no, _gender, _father_name, _mother_name, _marital_status, _role, _dept, _designation, _salary, _nationality, _joining_date, _present_address, _permanent_address):
        self._employee_id = _employee_id
        self._name = _name
        self._date_of_birth = _date_of_birth
        self._nid = _nid
        self._email = _email
        self._phone_no = _phone_no
        self._gender = _gender
        self._father_name = _father_name
        self._mother_name = _mother_name
        self._marital_status = _marital_status
        self._role = _role
        self._dept = _dept
        self._designation = _designation
        self._salary = _salary
        self._nationality = _nationality
        self._joining_date = _joining_date
        self._present_address = _present_address
        self._permanent_address = _permanent_address

    def __to_json(self):
        return {
            "employee_id" : self._employee_id,
            "name" : self._name,
            "date_of_birth" : self._date_of_birth,
            "nid" : self._nid,
            "email" : self._email,
            "phone_no" : self._phone_no,
            "gender" : self._gender,
            "father_name" : self._father_name,
            "mother_name" : self._mother_name,
            "marital_status" : self._marital_status,
            "role" : self._role,
            "dept" : self._dept,
            "designation" : self._designation,
            "salary" : self._salary,
            "nationality" : self._nationality,
            "joining_date" : self._joining_date,
            "present_address" : self._present_address,
            "permanent_address" : self._permanent_address
        }
    
    @classmethod
    def __to_obj(cls, data):
        return cls (
            data.get("employee_id"),
            data.get("name"),
            data.get("date_of_birth"),
            data.get("nid"),
            data.get("email"),
            data.get("phone_no"),
            data.get("gender"),
            data.get("father_name"),
            data.get("mother_name"),
            data.get("marital_status"),
            data.get("role"),
            data.get("dept"),
            data.get("designation"),
            data.get("salary"),
            data.get("nationality"),
            data.get("joining_date"),
            data.get("present_address"),
            data.get("permanent_address")
        )
