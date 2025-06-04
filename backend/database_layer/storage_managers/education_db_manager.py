import mysql.connector
from application_layer.classes.education import EducationalDegree
from application_layer.interfaces.database_manager_interface import IDatabaseManager
from application_layer.interfaces.repository_interface import IRepository
class EducationDBManager(IRepository):
    def __init__(self, db_manager: IDatabaseManager):
        self.db_manager = db_manager

    def create(self, degree: EducationalDegree):
        db_connection = self.db_manager.get_db_connection()
        cursor = db_connection.cursor()

        add_degree_query = (
            "INSERT INTO degrees "
            "(employee_id, degree_name, institute_name, major, location, gpa, gpa_scale, year_of_passing) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        )

        degree_data = self.degree_object_to_tuple(degree)

        try:
            cursor.execute(add_degree_query, degree_data)
            degree_id = cursor.lastrowid
            db_connection.commit()
            cursor.close()
            db_connection.close()
            return degree_id
        
        except mysql.connector.Error as err:
            print("error:", err.msg)
            cursor.close()
            db_connection.close()
            return None

    def get(self, employee_id):
        db_connection = self.db_manager.get_db_connection()
        cursor = db_connection.cursor(dictionary=True)

        query = (
            "SELECT * FROM degrees "
            "WHERE employee_id = %s"
        )

        try:
            cursor.execute(query, (employee_id,))
            result = cursor.fetchall()
            degrees = self.db_data_to_degree_list(result)
                    
            cursor.close()
            db_connection.close()
            return degrees
        
        except mysql.connector.Error as err:
            print("error:", err.msg)
            cursor.close()
            db_connection.close()
            return None

    def delete(self, degree_id):
        db_connection = self.db_manager.get_db_connection()
        cursor = db_connection.cursor()
        
        query = (
            "DELETE FROM degrees "
            "WHERE degree_id=%s"
        )

        try:
            cursor.execute(query, (degree_id,))
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

    def update(self, degree_id, degree: EducationalDegree):
        db_connection = self.db_manager.get_db_connection()
        cursor = db_connection.cursor()

        query = (
            "UPDATE degrees SET " 
            "employee_id=%s, " 
            "degree_name=%s, " 
            "institute_name=%s, " 
            "major=%s, " 
            "location=%s, " 
            "gpa=%s, " 
            "gpa_scale=%s, " 
            "year_of_passing=%s "
            "WHERE degree_id=%s"
        )

        updated_degree_data = list(self.degree_object_to_tuple(degree))
        updated_degree_data.append(degree_id)
        tuple(updated_degree_data)
        

        try:
            cursor.execute(query, updated_degree_data)
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
    def degree_object_to_tuple(self, degree: EducationalDegree):
        return (
            degree._employee_id,
            degree._degree_name,
            degree._institute_name,
            degree._major,
            degree._location,
            degree._gpa,
            degree._gpa_scale,
            degree._year_of_passing
        )
    
    def db_data_to_degree_list(self, data) -> list[EducationalDegree]:
        degrees: list[EducationalDegree] = []
        for row in data:
            degree = EducationalDegree(
                row['degree_id'],
                row['employee_id'],
                row['degree_name'],
                row['institute_name'],
                row['major'],
                row['location'],
                row['gpa'],
                row['gpa_scale'],
                row['year_of_passing']                
            )
            degrees.append(degree)
        return degrees