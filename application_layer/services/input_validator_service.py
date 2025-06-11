from datetime import datetime
import re
from tabulate import tabulate

# Input Validation Class
class InputValidator:
    
    def get_input_and_validate(self, data_type, input_text, custom_validator= None, error_msg="⚠️  Invalid input format"):
        while True:
            try:
                x = data_type(input(input_text))
                if not x:
                    print("⚠️  Input required")
                    continue
                if custom_validator and not custom_validator(x):
                    print(error_msg)
                    continue
                else:
                    return x
            except ValueError:
                print("⚠️  Invalid input, please try again")

    def validate_date(self, input):
        format = "%Y-%m-%d"
        return datetime.strptime(input, format)
    
    def validate_email(self, input):
        format = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(format, input)
    
    def validate_year(self, input):
        format = "%Y"
        return datetime.strptime(input, format)
    
    def validate_phone_number(self, input):
        length = 11
        return len(input) == length
    
    def validate_gender(self, input):
        return input.lower() == "male" or input.lower() == "female" or input.lower() == "other"
    
    def validate_nid(self, input):
        min_length = 10
        max_length = 17
        return len(str(input)) >= min_length and len(str(input)) <= max_length
    
    