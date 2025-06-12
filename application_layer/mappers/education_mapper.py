from application_layer.classes.education import EducationalDegree

class EducationMapper:
    @staticmethod
    def __to_obj(degree: dict) -> EducationalDegree:
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
    def __to_tuple(degree:EducationalDegree):
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