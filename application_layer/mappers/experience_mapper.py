from application_layer.classes.experience import Experience

class ExperienceMapper:
    @staticmethod
    def _to_obj(experience: dict) -> Experience:
        def format_date(date_value):
            if hasattr(date_value, 'strftime'):  
                return date_value.strftime("%d-%m-%Y")
            return date_value 
        
        return Experience(
            experience["_experience_id"],
            experience["_employee_id"],
            experience["_company_name"],
            experience["_position"],
            format_date(experience["_joining_date"]),
            format_date(experience["_ending_date"]),
            experience["_location"]
        )
    
    @staticmethod
    def _db_data_to_obj(experience: dict) -> Experience:
        def format_date(date_value):
            if hasattr(date_value, 'strftime'):  
                return date_value.strftime("%d-%m-%Y")
            return date_value 
        
        return Experience(
            experience["experience_id"],
            experience["employee_id"],
            experience["company_name"],
            experience["position"],
            format_date(experience["joining_date"]),
            format_date(experience["ending_date"]),
            experience["location"]
        )
    
    @staticmethod
    def _to_tuple(experience: Experience):
        return (
            experience._employee_id,
            experience._company_name,
            experience._position,
            experience._joining_date,
            experience._ending_date,
            experience._location
        )
