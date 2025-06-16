# Utility for mapping MySQL errors to user-friendly messages
import re

def map_mysql_error_to_message(error_msg: str) -> str:
    # Duplicate entry 'value' for key 'table.field' or 'field'
    duplicate_entry_pattern = r"Duplicate entry '(.+)' for key '(.+)'"
    match = re.search(duplicate_entry_pattern, error_msg)
    if match:
        value, key = match.groups()
        # Try to extract the field name from the key
        # MySQL key can be 'employees.email' or just 'email' or 'phone_no'
        field = key.split('.')[-1].replace('_UNIQUE', '').replace('UNIQUE', '')
        field_map = {
            'email': 'Email',
            'phone_no': 'Phone number',
            'nid': 'National ID',
        }
        field_name = field_map.get(field, field.replace('_', ' ').capitalize())
        return f"{field_name} must be unique."
    # Add more mappings as needed
    return error_msg
