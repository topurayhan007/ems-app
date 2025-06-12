export const renderEmployeeTable = (employees) => {
    const tbody = document.querySelector("#employee-table tbody");
    tbody.innerHTML = "";

    if (employees.length > 0) {
        employees.forEach((emp) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${emp._employee_id || "-"}</td>
                <td>${emp._name || "-"}</td>
                <td>${emp._date_of_birth || "-"}</td>
                <td>${emp._email || "-"}</td>
                <td>${emp._dept || "-"}</td>
                <td>${emp._designation || "-"}</td>
                <td>${emp._role || "-"}</td>
                <td>${emp._nid || "-"}</td>
                <td>${emp._phone_no || "-"}</td>
                <td>${emp._joining_date || "-"}</td>
                
                
                <td>
                    <div class="d-flex gap-2">
                    <button class="btn btn-action btn-view" data-id="${
                        emp._employee_id
                    }">View</button>
                        <button class="btn btn-action btn-edit" data-id="${
                            emp._employee_id
                        }" data-bs-toggle="modal" data-bs-target="#editEmployeeFormModal">Edit</button>
                        <button class="btn btn-action btn-delete" data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal" data-id="${
                            emp._employee_id
                        }">Delete</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="18" class="w-100 text-left">No Data Found!</td>`;
        tbody.appendChild(tr);
    }
};

export const renderEmployeeCount = (employees) => {
    const employeeCountText = document.querySelector(
        ".stat-card #employeeCount"
    );
    employeeCountText.innerHTML = "";
    const noOfEmployees = employees.length;
    employeeCountText.innerHTML = noOfEmployees;
};
