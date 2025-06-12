import mysql.connector
from application_layer.classes.experience import Experience
from application_layer.interfaces.database_manager_interface import IDatabaseManager
from application_layer.interfaces.repository_interface import IRepository
from application_layer.mappers.experience_mapper import ExperienceMapper
class ExperienceDBManager(IRepository):
    def __init__(self, db_manager: IDatabaseManager, experience_mapper: ExperienceMapper):
        self.db_manager = db_manager
        self.experience_mapper = experience_mapper

    def create(self, experience: Experience):
        db_connection = self.db_manager.get_db_connection()
        cursor = db_connection.cursor()

        query = (
            "INSERT INTO experiences "
            "(employee_id, company_name, position, joining_date, ending_date, location) "
            "VALUES (%s, %s, %s, %s, %s, %s)"
        )

        experience_data = self.experience_mapper._to_tuple(experience)

        try:
            cursor.execute(query, experience_data)
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
            "SELECT * FROM experiences "
            "WHERE employee_id = %s"
        )

        try:
            cursor.execute(query, (employee_id,))
            result = cursor.fetchall()   
            experiences = self.db_data_to_experience_list(result)

            cursor.close()
            db_connection.close()
            return experiences
        
        except mysql.connector.Error as err:
            print("error:", err.msg)
            cursor.close()
            db_connection.close()
            return None

    def delete(self, experience_id):
        db_connection = self.db_manager.get_db_connection()
        cursor = db_connection.cursor()

        query = (
            "DELETE FROM experiences "
            "WHERE experience_id=%s"
        )

        try:
            cursor.execute(query, (experience_id,))
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

    def update(self, experience_id, experience: Experience):
        db_connection = self.db_manager.get_db_connection()
        cursor = db_connection.cursor()

        query = (
            "UPDATE experiences SET " 
            "employee_id=%s, " 
            "company_name=%s, " 
            "position=%s, " 
            "joining_date=%s, " 
            "ending_date=%s, " 
            "location=%s " 
            "WHERE experience_id=%s"
        )

        updated_experience_data = list(self.experience_mapper._to_tuple(experience))
        updated_experience_data.append(experience_id)
        tuple(updated_experience_data)

        try:
            cursor.execute(query, updated_experience_data)
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
    def experience_object_to_tuple(self, experience: Experience):
        return (
            experience._employee_id,
            experience._company_name,
            experience._position,
            experience._joining_date,
            experience._ending_date,
            experience._location
        )
    
    def db_data_to_experience_list(self, data) -> list[Experience]:
        experiences: list[Experience] = []
        for row in data:
            experience = self.experience_mapper._db_data_to_obj(row)
            experiences.append(experience)
        return experiences