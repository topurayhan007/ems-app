import { convertDateToYearMonthDay } from "./utils.js";

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

// Add new exp/deg form button
export const createAddDegreeOrExperienceButton = (data, type) => {
    const addButtonContainer = document.createElement("div");
    addButtonContainer.className = "col-12 mt-3";
    const buttonID =
        type === "experience" ? "addExperienceButton" : "addDegreeButton";
    const anotherButtonText =
        type === "experience"
            ? "+ Add Another Experience"
            : "+ Add Another Degree";
    const newButtonText =
        type === "experience" ? "+ Add a Experience" : "+ Add a Degree";

    addButtonContainer.innerHTML = `
        <button type="button" class="btn btn-sm btn-outline-primary" id="${buttonID}">
            ${data.length > 0 ? anotherButtonText : newButtonText}
        </button>
    `;
    return addButtonContainer;
};

// Function to create a degree form fields
export const createDegreeFormFields = (degree = null, index = null) => {
    const formId = `degree-${index}`;

    const formDiv = document.createElement("div");
    formDiv.className = "row g-3 mt-0 degree-form";
    formDiv.id = formId;
    formDiv.innerHTML = `
        <!-- Degree Name -->
        <div class="col-md-6">
            <label for="edit_degree_name_${index}" class="form-label">Degree Name
                <span class="text-danger">*</span>
             </label>
            <input type="text" class="form-control" id="edit_degree_name_${index}" 
                name="_degree_name" value="${
                    degree?._degree_name || ""
                }" required />
        </div>
        
        <!-- Institute Name -->
        <div class="col-md-6">
            <label for="edit_institute_name_${index}" class="form-label">Institute Name
                <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" id="edit_institute_name_${index}" 
                name="_institute_name" value="${
                    degree?._institute_name || ""
                }" required />
        </div>
        
        <!-- Major/Field of Study -->
        <div class="col-md-6">
            <label for="edit_major_${index}" class="form-label">Major/Field of Study
                <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" id="edit_major_${index}" 
                name="_major" value="${degree?._major || ""}" required />
        </div>
        
        <!-- Location -->
        <div class="col-md-6">
            <label for="edit_degree_location_${index}" class="form-label">Location
                <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" id="edit_degree_location_${index}" 
                name="_location" value="${degree?._location || ""}" required />
        </div>
        
        <!-- GPA -->
        <div class="col-md-4">
            <label for="edit_gpa_${index}" class="form-label">GPA
                <span class="text-danger">*</span>
            </label>
            <input type="number" step="0.01" class="form-control" id="edit_gpa_${index}" 
                name="_gpa" value="${degree?._gpa || ""}" required />
        </div>
        
        <!-- GPA Scale -->
        <div class="col-md-4">
            <label for="edit_gpa_scale_${index}" class="form-label">GPA Scale
                <span class="text-danger">*</span>
            </label>
            <input type="number" step="0.01" class="form-control" id="edit_gpa_scale_${index}" 
                name="_gpa_scale" value="${
                    degree?._gpa_scale || ""
                }" required />
        </div>
        
        <!-- Year of Passing -->
        <div class="col-md-4">
            <label for="edit_year_of_passing_${index}" class="form-label">Year of Passing <span class="text-danger">*</span>
            </label>
            <input type="number" min="1900" max="2099" class="form-control" 
                id="edit_year_of_passing_${index}" name="_year_of_passing" 
                value="${degree?._year_of_passing || ""}" required />
        </div>
        
       
        <div class="col-12">
            <button class="btn btn-sm btn-outline-danger remove-degree-btn" id="removeDegreeButton">
                - Remove Degree
            </button>
        </div>        

        <hr class="mt-5 mb-4">
    `;

    return formDiv;
};

// Function to create a experience form fields
export const createExperienceFormFields = (experience = null, index = null) => {
    const formId = `experience-${index}`;

    const formDiv = document.createElement("div");
    formDiv.className = "row g-3 mt-0 experience-form";
    formDiv.id = formId;
    formDiv.innerHTML = `
        <!-- Company Name -->
        <div class="col-md-6">
            <label for="edit_company_name_${index}" class="form-label">Company Name 
                <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" id="edit_company_name_${index}" 
                name="_company_name" value="${
                    experience?._company_name || ""
                }" required />
        </div>
        
        <!-- Position -->
        <div class="col-md-6">
            <label for="edit_position_${index}" class="form-label">Position 
                <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" id="edit_position_${index}" 
                name="_position" value="${
                    experience?._position || ""
                }" required />
        </div>
        
        <!-- Joining Date -->
        <div class="col-md-6">
            <label for="edit_exp_joining_date_${index}" class="form-label">Joining Date
                <span class="text-danger">*</span>
            </label>
            <input type="date" class="form-control" id="edit_exp_joining_date_${index}" 
                name="_joining_date" value="${
                    experience?._joining_date
                        ? convertDateToYearMonthDay(experience?._joining_date)
                        : ""
                }" required />
        </div>

        <!-- Ending Date -->
        <div class="col-md-6">
            <label for="edit_ending_date_${index}" class="form-label">Ending Date
                <span class="text-danger">*</span>
            </label>
            <input type="date" class="form-control" id="edit_ending_date_${index}" 
                name="_ending_date" value="${
                    experience?._ending_date
                        ? convertDateToYearMonthDay(experience?._ending_date)
                        : ""
                }" required />
        </div>
        
        <!-- Location -->
        <div class="col-md-12">
            <label for="edit_location_${index}" class="form-label">Location
                <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control" id="edit_location_${index}" 
                name="_location" value="${
                    experience?._location || ""
                }" required />
        </div>
        
       
        <div class="col-12">
            <button class="btn btn-sm btn-outline-danger remove-experience-btn" id="removeExperienceButton">
                - Remove Experience
            </button>
        </div>        

        <hr class="mt-5 mb-4">
    `;
    return formDiv;
};
