# Database Class with queries, methods to perform queries to DB, retrieve data to class object
import mysql.connector
from application_layer.classes.employee import Employee
from application_layer.interfaces.database_manager_interface import IDatabaseManager
from application_layer.interfaces.employee_repository_interface import IEmployeeRepository
from application_layer.mappers.employee_mapper import EmployeeMapper

class EmployeeDBManager(IEmployeeRepository):
    def __init__(self, db_manager: IDatabaseManager, employee_mapper: EmployeeMapper):
        self.db_manager = db_manager
        self.employee_mapper = employee_mapper

    def create(self, employee:Employee):
        db_connection = self.db_manager.get_db_connection()
        cursor = db_connection.cursor()
        query = (
            "INSERT INTO employees "
            "(name, date_of_birth, nid, email, phone_no, gender, father_name, mother_name, marital_status, role, dept, designation, salary, nationality, joining_date, present_address, permanent_address) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        )
        employee_data = self.employee_mapper._to_tuple(employee)

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
            raise Exception(err.msg)

    def get(self, employee_id):
        db_connection = self.db_manager.get_db_connection()
        cursor = db_connection.cursor(dictionary=True)
        
        query = (
            "SELECT employee_id, name, date_of_birth, nid, email, phone_no, gender, father_name, mother_name, marital_status, role, dept, designation, salary, nationality, joining_date, present_address, permanent_address "
            "FROM employees "
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
            raise Exception(err.msg)

    

    def get_all(self):
        db_connection = self.db_manager.get_db_connection()
        cursor = db_connection.cursor(dictionary=True)
        
        query = (
            "SELECT employee_id, name, date_of_birth, nid, email, phone_no, gender, father_name, mother_name, marital_status, role, dept, designation, salary, nationality, joining_date, present_address, permanent_address "
            "FROM employees "
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
            raise Exception(err.msg)

        
    def search(self, search_text):
        db_connection = self.db_manager.get_db_connection()
        cursor = db_connection.cursor(dictionary=True)

        params = tuple(["%" + search_text + "%"] * 18)
        query = (
            "SELECT employee_id, name, date_of_birth, nid, email, phone_no, gender, father_name, mother_name, marital_status, role, dept, designation, salary, nationality, joining_date, present_address, permanent_address "
            "FROM employees WHERE "
            "employee_id LIKE %s OR "
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
            raise Exception(err.msg)


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
            raise Exception(err.msg)

        
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

        updated_employee_data = list(self.employee_mapper._to_tuple(employee))
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
            raise Exception(err.msg)



    def db_data_to_employee_list(self, data) -> list[Employee]:
        employees: list[Employee] = []
        for row in data:
            employee = self.employee_mapper._db_data_to_obj(row)            
            employees.append(employee)
        return employees
    