export const renderEmployeeTable = (employees) => {
    const tbody = document.querySelector("#employee-table tbody");
    tbody.innerHTML = "";

    employees.forEach((emp) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${emp._employee_id || ""}</td>
            <td>${emp._name || ""}</td>
            <td>${emp._email || ""}</td>
            <td>${emp._dept || ""}</td>
            <td>${emp._designation || ""}</td>
            <td>${emp._role || ""}</td>
            <td>${emp._phone_no || ""}</td>
            <td>${emp._present_address || ""}</td>
            <td>${emp._marital_status || ""}</td>
            <td>${emp._gender || ""}</td>
            
            <td>
                <div class="d-flex gap-2">
                    <button class="btn btn-action btn-edit" data-id="${
                        emp._employee_id
                    }">Edit</button>
                    <button class="btn btn-action btn-delete" data-id="${
                        emp._employee_id
                    }">Delete</button>
                </div>
            </td>
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
