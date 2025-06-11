from application_layer.classes.experience import Experience
from application_layer.interfaces.repository_interface import IRepository
from application_layer.interfaces.experience_service_interface import IExperienceService

class ExperienceService(IExperienceService):
    def __init__(self, experience_db_manager: IRepository):
        self.experience_db_manager = experience_db_manager
        
    def add_experience(self, experience: Experience):
        result = self.experience_db_manager.create(experience)
        return result

    def search_experiences_of_an_employee(self, employee_id):
        experiences = self.experience_db_manager.get(employee_id)
        return experiences

    def delete_an_experience_of_an_employee(self, experience_id):
        result = self.experience_db_manager.delete(experience_id)
        return result

    def update_an_experience_of_an_employee(self, experience_id, experience: Experience):
        result = self.experience_db_manager.update(experience_id, experience)
        return result