const baseURL = "http://localhost:8000";

// Employee API
export const fetchEmployees = async () => {
    const response = await fetch(`${baseURL}/api/employees`);
    if (!response.ok) {
        throw new Error("Something went wrong!");
    }
    const data = await response.json();
    return data;
};

export const searchEmployees = async (query) => {
    const response = await fetch(
        `${baseURL}/api/employees?q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
        throw new Error("Search failed");
    }
    return await response.json();
};

export const addEmployee = async (employeeData) => {
    const response = await fetch(`${baseURL}/api/employees`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
    });
    if (!response.ok) {
        throw new Error("Failed to add employee");
    }
    return await response.json();
};

export const updateEmployee = async (employeeId, employeeData) => {
    const response = await fetch(`${baseURL}/api/employees/${employeeId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(employeeData),
    });
    if (!response.ok) {
        throw new Error("Failed to update employee");
    }
    return await response.json();
};

export const deleteEmployee = async (employeeId) => {
    const response = await fetch(`${baseURL}/api/employees/${employeeId}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete employee");
    }
    return await response.json();
};

// Education APIs
export const fetchDegrees = async (employeeId) => {
    const response = await fetch(`${baseURL}/api/degrees/${employeeId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch degrees");
    }
    return await response.json();
};

export const addDegree = async (degreeData) => {
    const response = await fetch(`${baseURL}/api/degrees`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(degreeData),
    });
    if (!response.ok) {
        throw new Error("Failed to add degree");
    }
    return await response.json();
};

export const updateDegree = async (degreeId, degreeData) => {
    const response = await fetch(`${baseURL}/api/degrees/${degreeId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(degreeData),
    });
    if (!response.ok) {
        throw new Error("Failed to update degree");
    }
    return await response.json();
};

export const deleteDegree = async (degreeId) => {
    const response = await fetch(`${baseURL}/api/degrees/${degreeId}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete degree");
    }
    return await response.json();
};

// Experience APIs
export const fetchExperiences = async (employeeId) => {
    const response = await fetch(`${baseURL}/api/experiences/${employeeId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch experiences");
    }
    return await response.json();
};

export const addExperience = async (experienceData) => {
    const response = await fetch(`${baseURL}/api/experiences`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(experienceData),
    });
    if (!response.ok) {
        throw new Error("Failed to add experience");
    }
    return await response.json();
};

export const updateExperience = async (experienceId, experienceData) => {
    const response = await fetch(`${baseURL}/api/experiences/${experienceId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(experienceData),
    });
    if (!response.ok) {
        throw new Error("Failed to update experience");
    }
    return await response.json();
};

export const deleteExperience = async (experienceId) => {
    const response = await fetch(`${baseURL}/api/experiences/${experienceId}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete experience");
    }
    return await response.json();
};

export default {
    // Employee
    fetchEmployees,
    searchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,

    // Education
    fetchDegrees,
    addDegree,
    updateDegree,
    deleteDegree,

    // Experience
    fetchExperiences,
    addExperience,
    updateExperience,
    deleteExperience,
};
