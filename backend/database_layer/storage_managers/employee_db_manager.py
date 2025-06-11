# Database Class with queries, methods to perform queries to DB, retrieve data to class object
import mysql.connector
from application_layer.classes.employee import Employee
from application_layer.interfaces.database_manager_interface import IDatabaseManager
from application_layer.interfaces.employee_repository_interface import IEmployeeRepository

class EmployeeDBManager(IEmployeeRepository):
    def __init__(self, db_manager: IDatabaseManager):
        self.db_manager = db_manager

    def create(self, employee:Employee):
        db_connection = self.db_manager.get_db_connection()
        cursor = db_connection.cursor()
        query = (
            "INSERT INTO employees "
            "(name, date_of_birth, nid, email, phone_no, gender, father_name, mother_name, marital_status, role, dept, designation, salary, nationality, joining_date, present_address, permanent_address) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        )
        employee_data = self.employee_object_to_tuple(employee)

        try:
            cursor.execute(query, employee_data)
            emp_id = cursor.lastrowid
            db_connection.commit()
            cursor.close()
            db_connection.close()
            return emp_id
        
        except mysql.connector.Error as err:
            print("error:", err.msg)
            cursor.close()
            db_connection.close()
            return None

    def get(self, employee_id):
        db_connection = self.db_manager.get_db_connection()
        cursor = db_connection.cursor(dictionary=True)
        
        query = (
            "SELECT * FROM employees "
            "WHERE employee_id=%s"
        )

        try:
            cursor.execute(query, (employee_id,))
            result = cursor.fetchall()
            employee = self.db_data_to_employee_list(result)
            
            cursor.close()
            db_connection.close()
            return employee
        
        except mysql.connector.Error as err:
            print("error:", err.msg)
            cursor.close()
            db_connection.close()
            return None
    

    def get_all(self):
        db_connection = self.db_manager.get_db_connection()
        cursor = db_connection.cursor(dictionary=True)
        
        query = (
            "SELECT * FROM employees "
        )

        try:
            cursor.execute(query)
            result = cursor.fetchall()
            employees = self.db_data_to_employee_list(result)
            
            cursor.close()
            db_connection.close()
            return employees
        
        except mysql.connector.Error as err:
            print("error:", err.msg)
            cursor.close()
            db_connection.close()
            return None
        
    def search(self, search_text):
        db_connection = self.db_manager.get_db_connection()
        cursor = db_connection.cursor(dictionary=True)

        params = tuple(["%" + search_text + "%"] * 17)
        query = (
            "SELECT * FROM employees WHERE "
            "name LIKE %s OR "
            "date_of_birth LIKE %s OR "
            "nid LIKE %s OR "
            "email LIKE %s OR "
            "phone_no LIKE %s OR "
            "gender LIKE %s OR "
            "father_name LIKE %s OR "
            "mother_name LIKE %s OR "
            "marital_status LIKE %s OR "
            "role LIKE %s OR "
            "dept LIKE %s OR "
            "designation LIKE %s OR "
            "salary LIKE %s OR "
            "nationality LIKE %s OR "
            "joining_date LIKE %s OR "
            "present_address LIKE %s OR "
            "permanent_address LIKE %s"
        )

        try:
            cursor.execute(query, params)
            result = cursor.fetchall()
            employees = self.db_data_to_employee_list(result)

            cursor.close()
            db_connection.close()
            return employees
        
        except mysql.connector.Error as err:
            print("error:", err.msg)
            cursor.close()
            db_connection.close()
            return None

    def delete(self, employee_id):
        db_connection = self.db_manager.get_db_connection()
        cursor = db_connection.cursor()

        query = (
            "DELETE FROM employees WHERE employee_id=%s;"
        )
        
        try:
            cursor.execute(query, (employee_id,))
            db_connection.commit()
            result = cursor.rowcount
            cursor.close()
            db_connection.close()
            return result
        
        except mysql.connector.Error as err:
            print("error:", err.msg)
            cursor.close()
            db_connection.close()
            return None
        
    def update(self, employee_id, employee: Employee):
        db_connection = self.db_manager.get_db_connection()
        cursor = db_connection.cursor()
        
        query = (
            "UPDATE employees SET "
            "name=%s, "
            "date_of_birth=%s, "
            "nid=%s, "
            "email=%s, "
            "phone_no=%s, "
            "gender=%s, "
            "father_name=%s, "
            "mother_name=%s, "
            "marital_status=%s, "
            "role=%s, "
            "dept=%s, "
            "designation=%s, "
            "salary=%s, "
            "nationality=%s, "
            "joining_date=%s, "
            "present_address=%s, "
            "permanent_address=%s "
            "WHERE employee_id=%s"
        )

        updated_employee_data = list(self.employee_object_to_tuple(employee))
        updated_employee_data.append(employee_id)
        tuple(updated_employee_data)

        try:
            cursor.execute(query, updated_employee_data)
            db_connection.commit()
            result = cursor.rowcount
            
            cursor.close()
            db_connection.close()
            return result
        
        except mysql.connector.Error as err:
            print("error:", err.msg)
            cursor.close()
            db_connection.close()
            return None

    # Some helper methods
    def employee_object_to_tuple(self, employee: Employee):
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

    
    def db_data_to_employee_list(self, data) -> list[Employee]:
        employees: list[Employee] = []
        for row in data:
            employee = Employee(
                row['employee_id'],
                row['name'],
                row['date_of_birth'].strftime("%d-%m-%Y"),
                row['nid'],
                row['email'],
                row['phone_no'],
                row['gender'],
                row['father_name'],
                row['mother_name'],
                row['marital_status'],
                row['role'],
                row['dept'],
                row['designation'],
                row['salary'],
                row['nationality'],
                row['joining_date'].strftime("%d-%m-%Y"),
                row['present_address'],
                row['permanent_address']
            )
            employees.append(employee)
        return employees
    