export const renderEmployeeTable = (employees) => {
    const tbody = document.querySelector("#employee-table tbody");
    tbody.innerHTML = "";

    employees.forEach((emp) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${emp._name || ""}</td>
            <td>${emp._email || ""}</td>
            <td>${emp._phone_no || ""}</td>
            <td>${emp._dept || ""}</td>
            <td>${emp._gender || ""}</td>
        `;
        tbody.appendChild(tr);
    });
};

export const renderEmployeeCount = (employees) => {
    const employeeCountText = document.querySelector(
        ".stat-card #employeeCount"
    );
    employeeCountText.innerHTML = "";
    const noOfEmployees = employees.length;
    employeeCountText.innerHTML = noOfEmployees;
};


