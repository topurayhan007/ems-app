export const renderEmployeeTable = (employees) => {
    const tbody = document.querySelector("#employee-table tbody");
    tbody.innerHTML = "";

    if (employees.length > 0) {
        employees.forEach((emp) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${emp._employee_id || "-"}</td>
                <td>${emp._name || "-"}</td>
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
              <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                Menu
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <a class="dropdown-item" href="#">Something else here</a>
              </div>
            </div>

            <button class="d-none"> CLick me </button>
          </td>
            `;
            tbody.appendChild(tr);

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
