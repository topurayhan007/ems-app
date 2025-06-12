from application_layer.classes.employee import Employee

class EmployeeMapper:
    @staticmethod
    def __to_obj(employee: dict) -> Employee:
        return Employee(
            employee["_employee_id"],
            employee["_name"],
            employee["_date_of_birth"].strftime("%d-%m-%Y"),
            employee["_nid"],
            employee["_email"],
            employee["_phone_no"],
            employee["_gender"],
            employee["_father_name"],
            employee["_mother_name"],
            employee["_marital_status"],
            employee["_role"],
            employee["_dept"],
            employee["_designation"],
            employee["_salary"],
            employee["_nationality"],
            employee["_joining_date"].strftime("%d-%m-%Y"),
            employee["_present_address"],
            employee["_permanent_address"]
        )
    
    @staticmethod
    def __to_tuple(employee: Employee):
        return (
            employee._name,
            employee._date_of_birth,
            employee._nid,
            employee._email,
            employee._phone_no,
            employee._gender,
            employee._father_name,
            employee._mother_name,
            employee._marital_status,
            employee._role,
            employee._dept,
            employee._designation,
            employee._salary,
            employee._nationality,
            employee._joining_date,
            employee._present_address,
            employee._permanent_address
        )