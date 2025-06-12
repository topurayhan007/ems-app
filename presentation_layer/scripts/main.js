import { fetchDegrees, fetchEmployees, searchEmployees } from "./api-calls.js";
import { renderEmployeeCount, renderEmployeeTable } from "./renderer.js";

document.addEventListener("DOMContentLoaded", function () {
    const sidebarLinks = document.querySelectorAll("#sidebarMenu .nav-link");
    let employee_data = [];

    const setActiveLink = (clickedLink) => {
        sidebarLinks.forEach((link) => link.classList.remove("active"));
        clickedLink.classList.add("active");
    };

    const showSpinner = (show) => {
        document.getElementById("spinner").style.display = show
            ? "block"
            : "none";
    };

    const showSection = (targetId) => {
        document.querySelectorAll(".content-section").forEach((section) => {
            section.classList.remove("active");
        });
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add("active");
        }
    };

    sidebarLinks.forEach((link) => {
        link.addEventListener("click", async function (e) {
            e.preventDefault();

            setActiveLink(link);
            const targetId = link.getAttribute("data-target");
            showSection(targetId);

            switch (targetId) {
                case "dashboard":
                    showSpinner(true);
                    try {
                        const data = await fetchEmployees();
                        console.log(data.employees);
                        renderEmployeeCount(data.employees);
                        showSpinner(false);
                    } catch (error) {
                        console.log(error);
                        showSpinner(false);
                    }
                    break;

                case "view-emp-section":
                    showSpinner(true);
                    try {
                        const data = await fetchEmployees();
                        employee_data = data.employees;
                        console.log(employee_data);
                        renderEmployeeTable(data.employees);
                        showSpinner(false);
                    } catch (error) {
                        console.error(error);
                        showSpinner(false);
                    }

                    break;

                default:
                    break;
            }
        });
    });

    const defaultActiveLink = document.querySelector(
        "#sidebarMenu .nav-link.active"
    );
    if (defaultActiveLink) {
        defaultActiveLink.click();
    }

    document
        .querySelector("#employee-table tbody")
        .addEventListener("click", async (e) => {
            if (e.target.classList.contains("btn-edit")) {
                const employeeId = e.target.getAttribute("data-id");

                const selectedEmployee = employee_data.find(
                    (emp) => emp._employee_id === parseInt(employeeId)
                );

                document.getElementById("edit_name").value =
                    selectedEmployee?._name;
                document.getElementById("edit_date_of_birth").value =
                    convertDateToYearMonthDay(selectedEmployee._date_of_birth);
                document.getElementById("edit_nid").value =
                    selectedEmployee?._nid;
                document.getElementById("edit_gender").value =
                    selectedEmployee?._gender;
                document.getElementById("edit_marital_status").value =
                    selectedEmployee?._marital_status;
                document.getElementById("edit_nationality").value =
                    selectedEmployee?._nationality;
                document.getElementById("edit_email").value =
                    selectedEmployee?._email;
                document.getElementById("edit_phone_no").value =
                    selectedEmployee?._phone_no;
                document.getElementById("edit_present_address").value =
                    selectedEmployee?._present_address;
                document.getElementById("edit_permanent_address").value =
                    selectedEmployee?._permanent_address;
                document.getElementById("edit_father_name").value =
                    selectedEmployee?._father_name;
                document.getElementById("edit_mother_name").value =
                    selectedEmployee?._mother_name;
                document.getElementById("edit_joining_date").value =
                    convertDateToYearMonthDay(selectedEmployee?._joining_date);
                document.getElementById("edit_dept").value =
                    selectedEmployee?._dept;
                document.getElementById("edit_designation").value =
                    selectedEmployee?._designation;
                document.getElementById("edit_role").value =
                    selectedEmployee?._role;
                document.getElementById("edit_salary").value =
                    selectedEmployee?._salary;

                // Fetch degrees data
                const degrees_data = await fetchDegrees(
                    selectedEmployee._employee_id
                );
                const degrees = degrees_data.degrees;

                const fieldset = document.getElementById(
                    "edit_education_fields"
                );
                const fields_wrapper = document.getElementById(
                    "edit_education_fields_container"
                );

                // Add "Add Degree" button
                const addButtonContainer = document.createElement("div");
                addButtonContainer.className = "col-12 mt-3";
                addButtonContainer.innerHTML = `
                    <button type="button" class="btn btn-sm btn-outline-primary" id="addDegreeButton">
                        ${
                            degrees.length > 0
                                ? "+ Add Another Degree"
                                : "+ Add a Degree"
                        }
                    </button>
                `;

                if (degrees.length > 0) {
                    fields_wrapper.innerHTML = "";
                    fieldset.classList.remove("d-none");

                    degrees.forEach((degree, index) => {
                        fields_wrapper.appendChild(
                            createDegreeFormFields(degree, index)
                        );

                        fields_wrapper.appendChild(addButtonContainer);
                    });
                } else {
                    fields_wrapper.innerHTML = "";
                    fieldset.classList.remove("d-none");
                    fields_wrapper.appendChild(addButtonContainer);
                }

                // Add degree button function
                document
                    .getElementById("addDegreeButton")
                    .addEventListener("click", () => {
                        if (fields_wrapper.lastChild.id === "addDegreeButton") {
                            fields_wrapper.removeChild(
                                fields_wrapper.lastChild
                            );
                        }
                        const currentCount =
                            fields_wrapper.querySelectorAll(
                                ".degree-form"
                            ).length;

                        fields_wrapper.appendChild(
                            createDegreeFormFields(null, currentCount)
                        );
                        fields_wrapper.appendChild(addButtonContainer);
                    });

                // Remove degree button function
                document
                    .getElementById("edit_education_fields_container")
                    .addEventListener("click", function (e) {
                        if (e.target.classList.contains("remove-degree-btn")) {
                            const degreeForm = e.target.closest(".degree-form");
                            if (degreeForm) {
                                degreeForm.remove();
                            }
                        }
                    });
            }
        });

    document
        .querySelector("#employee-table tbody")
        .addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-delete")) {
                const employeeId = e.target.getAttribute("data-id");
                // TODO: Open edit modal
                console.log("Edit clicked for employee ID:", employeeId);
                // fetch employee data and edit modal
            }
        });

    // Search
    document
        .getElementById("searchEmployeeForm")
        .addEventListener("submit", async (e) => {
            e.preventDefault();
            const searchInput = document.getElementById(
                "employee_search_input"
            );
            const query = searchInput.value.trim();
            if (!query) return;

            try {
                const data = await searchEmployees(query);
                renderEmployeeTable(data.employees || []);
            } catch (error) {
                console.error(error);
            }
        });
});

// Change date format
const convertDateToYearMonthDay = (date) => {
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
};

// Function to create a degree form fields
const createDegreeFormFields = (degree = null, index = null) => {
    const formId =
        index !== null ? `degree-${index}` : `degree-new-${Date.now()}`;
    const isExisting = degree !== null;

    const formDiv = document.createElement("div");
    formDiv.className = "row g-3 mt-0 degree-form";
    formDiv.id = formId;
    formDiv.innerHTML = `
        <!-- Degree Name -->
        <div class="col-md-6">
            <label for="edit_degree_name_${index}" class="form-label">Degree Name</label>
            <input type="text" class="form-control" id="edit_degree_name_${index}" 
                name="_degree_name" value="${
                    degree?._degree_name || ""
                }" required />
        </div>
        
        <!-- Institute Name -->
        <div class="col-md-6">
            <label for="edit_institute_name_${index}" class="form-label">Institute Name</label>
            <input type="text" class="form-control" id="edit_institute_name_${index}" 
                name="_institute_name" value="${
                    degree?._institute_name || ""
                }" required />
        </div>
        
        <!-- Major/Field of Study -->
        <div class="col-md-6">
            <label for="edit_major_${index}" class="form-label">Major/Field of Study</label>
            <input type="text" class="form-control" id="edit_major_${index}" 
                name="_major" value="${degree?._major || ""}" required />
        </div>
        
        <!-- Location -->
        <div class="col-md-6">
            <label for="edit_location_${index}" class="form-label">Location</label>
            <input type="text" class="form-control" id="edit_location_${index}" 
                name="_location" value="${degree?._location || ""}" required />
        </div>
        
        <!-- GPA -->
        <div class="col-md-4">
            <label for="edit_gpa_${index}" class="form-label">GPA</label>
            <input type="number" step="0.01" class="form-control" id="edit_gpa_${index}" 
                name="_gpa" value="${degree?._gpa || ""}" required />
        </div>
        
        <!-- GPA Scale -->
        <div class="col-md-4">
            <label for="edit_gpa_scale_${index}" class="form-label">GPA Scale</label>
            <input type="number" class="form-control" id="edit_gpa_scale_${index}" 
                name="_gpa_scale" value="${
                    degree?._gpa_scale || ""
                }" required />
        </div>
        
        <!-- Year of Passing -->
        <div class="col-md-4">
            <label for="edit_year_of_passing_${index}" class="form-label">Year of Passing</label>
            <input type="number" min="1900" max="2099" class="form-control" 
                id="edit_year_of_passing_${index}" name="_year_of_passing" 
                value="${degree?._year_of_passing || ""}" required />
        </div>
        
        ${
            isExisting
                ? `<input type="hidden" name="_degree_id" value="${degree._degree_id}">`
                : `
                <div class="col-12">
                    <button class="btn btn-sm btn-outline-danger remove-degree-btn" id="addDegreeButton">
                        - Remove Degree
                    </button>
                </div>
                `
        }

        <hr class="mt-5 mb-4">
    `;

    return formDiv;
};
