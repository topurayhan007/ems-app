from application_layer.classes.experience import Experience

class ExperienceMapper:
    @staticmethod
    def __to_obj(experience: dict) -> Experience:
        return Experience(
            experience["_experience_id"],
            experience["_employee_id"],
            experience["_company_name"],
            experience["_position"],
            experience["_joining_date"],
            experience["_ending_date"],
            experience["_location"]
        )
    
    @staticmethod
    def __to_tuple(experience: Experience):
        return (
            experience._employee_id,
            experience._company_name,
            experience._position,
            experience._joining_date,
            experience._ending_date,
            experience._location
        )
