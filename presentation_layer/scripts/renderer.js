export const renderEmployeeTable = (employees) => {
    const tbody = document.querySelector("#employee-table tbody");
    tbody.innerHTML = "";

    if (employees.length > 0) {
        employees.forEach((emp) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${emp._employee_id || "-"}</td>
                <td>
                    <a class="text-decoration-none m-0 fw-semibold btn-view" href="#" data-id="${
                        emp._employee_id
                    }" style="font-weight: 500;">${emp._name || "-"} </a>
                </td>
                <td>
                    <div class="d-flex flex-column">
                        <a class="text-decoration-none m-0" href="mailto:${
                            emp._email
                        }">${emp._email || "-"}</a>
                        <a class="text-decoration-none m-0" href="tel:${
                            emp._phone_no
                        }">${emp._phone_no || "-"}</a>
                    </div>
                </td>
                <td>${emp._dept || "-"}</td>
                <td>${emp._designation || "-"}</td>
                <td>${emp._role || "-"}</td>
                

                <td class="action">
                    <div class="dropdown">
                        <p class="dropdown-toggle text-center text-primary mb-0" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                            <i data-lucide="ellipsis-vertical"></i>
                        </p>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a class="dropdown-item btn-view" href="#" data-id="${
                                emp._employee_id
                            }">View details</a>
                            <a class="dropdown-item btn-edit" href="#" data-id="${
                                emp._employee_id
                            }" data-bs-toggle="modal" data-bs-target="#editEmployeeFormModal">Edit employee</a>
                            <a class="dropdown-item btn-delete" href="#" data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal" data-id="${
                                emp._employee_id
                            }">Delete employee</a>
                        </div>
                    </div>
                </td>

                
            `;
            tbody.appendChild(tr);

            if (window.lucide) lucide.createIcons();

            // This is to fix the stacking of the dropdown menu
            const dropdowns = document.querySelectorAll(".dropdown");

            dropdowns.forEach((dropdown) => {
                dropdown.addEventListener("click", function () {
                    document.querySelectorAll("td.action").forEach((td) => {
                        td.style.zIndex = "0";
                    });
                    this.parentElement.style.zIndex = "1";
                });
            });
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
