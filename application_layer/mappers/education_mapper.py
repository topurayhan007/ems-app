from application_layer.classes.education import EducationalDegree

class EducationMapper:
    @staticmethod
    def _to_obj(degree: dict) -> EducationalDegree:
        return EducationalDegree(
            degree["_degree_id"],
            degree["_employee_id"],
            degree["_degree_name"],
            degree["_institute_name"],
            degree["_major"],
            degree["_location"],
            degree["_gpa"],
            degree["_gpa_scale"],
            degree["_year_of_passing"]
        )
    
    @staticmethod
    def _db_data_to_obj(degree: dict) -> EducationalDegree:
        return EducationalDegree(
            degree["degree_id"],
            degree["employee_id"],
            degree["degree_name"],
            degree["institute_name"],
            degree["major"],
            degree["location"],
            degree["gpa"],
            degree["gpa_scale"],
            degree["year_of_passing"]
        )
    
    @staticmethod
    def _to_tuple(degree:EducationalDegree):
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