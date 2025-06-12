from application_layer.classes.employee import Employee

class EmployeeMapper:
    @staticmethod
    def _to_obj(employee: dict) -> Employee:
        def format_date(date_value):
            if hasattr(date_value, 'strftime'):  
                return date_value.strftime("%d-%m-%Y")
            return date_value 
        
        return Employee(
            employee["_employee_id"],
            employee["_name"],
            format_date(employee["_date_of_birth"]),
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
            format_date(employee["_joining_date"]),
            employee["_present_address"],
            employee["_permanent_address"]
        )
    
    @staticmethod
    def _db_data_to_obj(employee: dict) -> Employee:
        def format_date(date_value):
            if hasattr(date_value, 'strftime'):  
                return date_value.strftime("%d-%m-%Y")
            return date_value 
        
        return Employee(
            employee["employee_id"],
            employee["name"],
            format_date(employee["date_of_birth"]),
            employee["nid"],
            employee["email"],
            employee["phone_no"],
            employee["gender"],
            employee["father_name"],
            employee["mother_name"],
            employee["marital_status"],
            employee["role"],
            employee["dept"],
            employee["designation"],
            employee["salary"],
            employee["nationality"],
            format_date(employee["joining_date"]),
            employee["present_address"],
            employee["permanent_address"]
        )
    
    @staticmethod
    def _to_tuple(employee: Employee):
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