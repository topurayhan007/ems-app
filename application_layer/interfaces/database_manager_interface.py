from abc import ABC, abstractmethod

class IDatabaseManager(ABC):
    @abstractmethod
    def create_database(self, cursor):
        pass

    @abstractmethod
    def initialize_database(self):
        pass

    @abstractmethod
    def get_db_connection(self):
        pass
    