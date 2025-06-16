# Initialize database, set connection, create tables
import mysql.connector
from mysql.connector import errorcode
from application_layer.interfaces.database_manager_interface import IDatabaseManager

class DatabaseManager(IDatabaseManager):    
    def __init__(self, config, db_name='ems'):
        self.config = config
        self.db_name = db_name
        self.tables = {
            'employees': (
                "CREATE TABLE `employees` ("
                "  `employee_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,"
                "  `name` varchar(100) NOT NULL,"
                "  `date_of_birth` date NOT NULL,"
                "  `nid` varchar(100) NOT NULL UNIQUE,"
                "  `email` varchar(255) NOT NULL UNIQUE,"
                "  `phone_no` varchar(255) NOT NULL UNIQUE,"
                "  `gender` varchar(100),"
                "  `father_name` varchar(100),"
                "  `mother_name` varchar(100),"
                "  `marital_status` varchar(100),"
                "  `role` enum('Employee', 'Manager', 'Admin') NOT NULL,"
                "  `dept` varchar(100) NOT NULL,"
                "  `designation` varchar(100) NOT NULL,"
                "  `salary` int NOT NULL,"
                "  `nationality` varchar(100),"
                "  `joining_date` date NOT NULL,"
                "  `present_address` varchar(255),"
                "  `permanent_address` varchar(255)"
                ") ENGINE=InnoDB"
            ),
            'experiences': (
                "CREATE TABLE `experiences` ("
                "  `experience_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,"
                "  `employee_id` int NOT NULL,"
                "  `company_name` varchar(255) NOT NULL,"
                "  `position` varchar(255) NOT NULL,"
                "  `joining_date` date NOT NULL,"
                "  `ending_date` date NOT NULL,"
                "  `location` varchar(255) NOT NULL"
                ") ENGINE=InnoDB"
            ),
            'degrees': (
                "CREATE TABLE `degrees` ("
                "  `degree_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,"
                "  `employee_id` int NOT NULL,"
                "  `degree_name` varchar(255) NOT NULL,"
                "  `institute_name` varchar(255) NOT NULL,"
                "  `major` varchar(255) NOT NULL,"
                "  `location` varchar(255) NOT NULL,"
                "  `gpa` float(3) NOT NULL,"
                "  `gpa_scale` float(3) NOT NULL,"
                "  `year_of_passing` year NOT NULL"
                ") ENGINE=InnoDB"
            )
        }

    # Create database
    def create_database(self, cursor):
        try:
            cursor.execute(
                f"CREATE DATABASE {self.db_name} DEFAULT CHARACTER SET 'utf8mb4'")
            print(f"Database {self.db_name} created successfully.")
        except mysql.connector.Error as err:
            print(f"Failed creating database: {err}")
            raise

    # Initialize Database and make tables
    def initialize_database(self):
        db_connection = None
        try:
            config_without_db = self.config.copy()
            config_without_db.pop('database', None)
            db_connection = mysql.connector.connect(**config_without_db)
            # db_connection = mysql.connector.connect(**self.config)
            cursor = db_connection.cursor()

            try:
                cursor.execute(f"USE {self.db_name}")
            except mysql.connector.Error as err:
                if err.errno == errorcode.ER_BAD_DB_ERROR:
                    print(f"Database {self.db_name} does not exist.")
                    self.create_database(cursor)
                    print(f"Database {self.db_name} created successfully.")
                    db_connection.database = self.db_name
                else:
                    print(f"Error using database {self.db_name}: {err}")
                    raise

            for table_name, table_description in self.tables.items():
                try:
                    print(f"Creating table {table_name}: ", end='')
                    cursor.execute(table_description)
                    print("OK")
                except mysql.connector.Error as err:
                    if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
                        print("already exists.")
                    else:
                        print("error:", err.msg)

            cursor.close()

        except mysql.connector.Error as err:
            print(f"Error: {err}")
            raise
        finally:
            if db_connection is not None:
                db_connection.close()

    # Get DB connection when needed by any file to perform DB operations
    def get_db_connection(self):
        try:
            connection = mysql.connector.connect(**self.config)
            return connection
        except mysql.connector.Error as err:
            print(f"Error connecting to database: {err}")
            raise




