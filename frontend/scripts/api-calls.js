const baseURL = "http://localhost:8000";

export const fetchEmployees = async () => {
    const response = await fetch(`${baseURL}/api/employees`);
    if (!response.ok) {
        throw new Error("Something went wrong!");
    }
    const data = await response.json();
    return data;
};

