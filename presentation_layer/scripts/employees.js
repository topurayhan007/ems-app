import {
    fetchEmployees,
    searchEmployees,
    deleteEmployee,
    fetchDegrees,
    deleteDegree,
    fetchExperiences,
    deleteExperience,
    addExperience,
    addDegree,
    updateEmployee,
    addEmployee,
} from "./api-calls.js";
import { renderEmployeeCount, renderEmployeeTable } from "./renderer.js";

document.addEventListener("DOMContentLoaded", async () => {
    let employee_data = [];

    const showSpinner = (show) => {
        document.getElementById("spinner").style.display = show
            ? "block"
            : "none";
    };
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

    // Search Functionality
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

    // Employee Table Edit Button Handler
    document
        .querySelector("#employee-table tbody")
        .addEventListener("click", async (e) => {
            if (e.target.classList.contains("btn-edit")) {
                const employeeId = e.target.getAttribute("data-id");

                const selectedEmployee = employee_data.find(
                    (emp) => emp._employee_id === parseInt(employeeId)
                );

                // Set all the values to employee edit form
                setValuesToEmployeeEditFormFields(selectedEmployee);

                const education_fields_parent = document.getElementById(
                    "edit_education_fields"
                );
                const education_fields_wrapper = document.getElementById(
                    "edit_education_fields_container"
                );

                const experience_fields_parent = document.getElementById(
                    "edit_experience_fields"
                );
                const experience_fields_wrapper = document.getElementById(
                    "edit_experience_fields_container"
                );

                // Fetch degrees data
                const degrees_data = await fetchDegrees(
                    selectedEmployee._employee_id
                );
                const degrees = degrees_data.degrees;

                // Fetch experiences data
                const experience_data = await fetchExperiences(
                    selectedEmployee._employee_id
                );
                const experiences = experience_data.experiences;
                console.log(experiences);

                // Add "Add Degree" button
                const addEducationButtonContainer =
                    createAddDegreeOrExperienceButton(degrees, "degree");

                // Add "Add Experience" button
                const addExperienceButtonContainer =
                    createAddDegreeOrExperienceButton(
                        experiences,
                        "experience"
                    );

                if (degrees.length > 0) {
                    education_fields_wrapper.innerHTML = "";
                    education_fields_parent.classList.remove("d-none");

                    degrees.forEach((degree, index) => {
                        education_fields_wrapper.appendChild(
                            createDegreeFormFields(degree, index)
                        );

                        education_fields_wrapper.appendChild(
                            addEducationButtonContainer
                        );
                    });
                } else {
                    education_fields_wrapper.innerHTML = "";
                    education_fields_parent.classList.remove("d-none");
                    education_fields_wrapper.appendChild(
                        addEducationButtonContainer
                    );
                }

                if (experiences.length > 0) {
                    experience_fields_wrapper.innerHTML = "";
                    experience_fields_parent.classList.remove("d-none");

                    experiences.forEach((experience, index) => {
                        experience_fields_wrapper.appendChild(
                            createExperienceFormFields(experience, index)
                        );

                        experience_fields_wrapper.appendChild(
                            addExperienceButtonContainer
                        );
                    });
                } else {
                    experience_fields_wrapper.innerHTML = "";
                    experience_fields_parent.classList.remove("d-none");
                    experience_fields_wrapper.appendChild(
                        addExperienceButtonContainer
                    );
                }

                // Add degree button function
                addDegreeOrExperienceButtonHandler(
                    "addDegreeButton",
                    education_fields_wrapper,
                    "degree-form",
                    createDegreeFormFields,
                    addEducationButtonContainer
                );

                // Add experience button function
                addDegreeOrExperienceButtonHandler(
                    "addExperienceButton",
                    experience_fields_wrapper,
                    "experience-form",
                    createExperienceFormFields,
                    addExperienceButtonContainer
                );

                // Remove degree button function
                removeFormButtonHandler(
                    "edit_education_fields_container",
                    "remove-degree-btn",
                    "degree-form"
                );

                // Remove experience button function
                removeFormButtonHandler(
                    "edit_experience_fields_container",
                    "remove-experience-btn",
                    "experience-form"
                );
            }
        });

    // Edit form submission
    document
        .getElementById("editEmployeeForm")
        .addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = getEmployeeFormData("editEmployeeForm", "edit");
            const employee_id =
                document.getElementById("edit_employee_id").value;
            console.log(data);

            const spinner = document.getElementById("edit_confirm_btn_spinner");
            spinner.classList.remove("d-none");

            const save_button = document.getElementById(
                "edit-employee-submit-btn"
            );
            save_button.classList.add("disabled");

            const close_button = document.getElementById("edit_form_close_btn");
            close_button.classList.add("disabled");

            try {
                // Update the employee data
                await updateEmployee(employee_id, data.employee);

                // Fetch existing degrees and delete one by one
                const degrees_res = await fetchDegrees(employee_id);
                const degrees = degrees_res.degrees;
                for (let deg of degrees) {
                    await deleteDegree(deg._degree_id);
                }

                // Fetch existing experiences and delete one by one
                const exps_res = await fetchExperiences(employee_id);
                const experiences = exps_res.experiences;
                for (let exp of experiences) {
                    await deleteExperience(exp._experience_id);
                }

                // Add new updated degrees
                for (let deg of data.degrees) {
                    await addDegree({
                        _degree_id: null,
                        _employee_id: employee_id,
                        ...deg,
                    });
                }

                // Add new updated experiences
                for (let exp of data.experiences) {
                    await addExperience({
                        _experience_id: null,
                        _employee_id: employee_id,
                        ...exp,
                    });
                }
                spinner.classList.add("d-none");
                save_button.classList.remove("disabled");
                close_button.classList.remove("disabled");

                showToast("Employee Updated Successfully!", "bg-success");
                setTimeout(() => {
                    location.reload();
                }, 1200);
            } catch (error) {
                spinner.classList.add("d-none");
                save_button.classList.remove("disabled");
                close_button.classList.remove("disabled");

                console.log(error);
                showToast("Something went wrong!", "bg-success");
            }
        });

    // Employee Table Delete Button Handler
    document
        .querySelector("#employee-table tbody")
        .addEventListener("click", (e) => {
            if (e.target.classList.contains("btn-delete")) {
                const employeeId = e.target.getAttribute("data-id");

                const modalElement = document.getElementById(
                    "deleteEmployeeModal"
                );
                const modal = bootstrap.Modal.getInstance(modalElement);
                // Delete Employee Confirm Button
                document
                    .getElementById("deleteEmployeeButton")
                    .addEventListener("click", async (e) => {
                        try {
                            const result = await deleteEmployee(employeeId);

                            if (result.result == 1) {
                                modal.hide();
                                showToast(
                                    "Deleted Successfully!",
                                    "bg-success"
                                );
                                setTimeout(() => {
                                    location.reload();
                                }, 1200);
                            } else {
                                modal.hide();
                                showToast(
                                    "Something went wrong!",
                                    "bg-warning"
                                );
                            }
                        } catch (error) {
                            console.log(error);
                            modal.hide();
                            showToast("Something went wrong!", "bg-warning");
                        }
                    });
            }
        });

    // Employee Table Add Employee Button
    document
        .getElementById("addEmployeeButton")
        .addEventListener("click", () => {
            // Add "Add Degree" button
            const addEducationButtonContainerAdd =
                createAddDegreeOrExperienceButton([], "degree");

            // Add "Add Experience" button
            const addExperienceButtonContainerAdd =
                createAddDegreeOrExperienceButton([], "experience");

            // Degree form wrappers
            const education_fields_parent = document.getElementById(
                "add_education_fields"
            );
            const education_fields_wrapper = document.getElementById(
                "add_education_fields_container"
            );
            education_fields_wrapper.innerHTML = "";
            education_fields_parent.classList.remove("d-none");
            education_fields_wrapper.appendChild(
                addEducationButtonContainerAdd
            );

            // Experience form wrappers
            const experience_fields_parent = document.getElementById(
                "add_experience_fields"
            );
            const experience_fields_wrapper = document.getElementById(
                "add_experience_fields_container"
            );
            experience_fields_wrapper.innerHTML = "";
            experience_fields_parent.classList.remove("d-none");
            experience_fields_wrapper.appendChild(
                addExperienceButtonContainerAdd
            );

            // Add degree button handler
            addDegreeOrExperienceButtonHandler(
                "addDegreeButton",
                education_fields_wrapper,
                "degree-form",
                createDegreeFormFields,
                addEducationButtonContainerAdd
            );

            // Remove button handler
            removeFormButtonHandler(
                "add_education_fields_container",
                "remove-degree-btn",
                "degree-form"
            );

            // Add experience button handler
            addDegreeOrExperienceButtonHandler(
                "addExperienceButton",
                experience_fields_wrapper,
                "experience-form",
                createExperienceFormFields,
                addExperienceButtonContainerAdd
            );

            // Remove button handler
            removeFormButtonHandler(
                "add_experience_fields_container",
                "remove-experience-btn",
                "experience-form"
            );
        });

    // Employee Table View Employee Button
    document
        .querySelector("#employee-table tbody")
        .addEventListener("click", async (e) => {
            if (e.target.classList.contains("btn-view")) {
                const employeeId = e.target.getAttribute("data-id");

                const employee = employee_data.find(
                    (emp) => emp._employee_id == employeeId
                );
                const degreesData = await fetchDegrees(employeeId);
                const experiencesData = await fetchExperiences(employeeId);

                localStorage.setItem("employee", JSON.stringify(employee));
                localStorage.setItem(
                    "degrees",
                    JSON.stringify(degreesData.degrees)
                );
                localStorage.setItem(
                    "experiences",
                    JSON.stringify(experiencesData.experiences)
                );
                // window.location.href = `/`;
                window.location.href = `../templates/view-details.html?id=${employeeId}`;
            }
        });

    // Add employee form submission
    document
        .getElementById("addEmployeeForm")
        .addEventListener("submit", async (e) => {
            e.preventDefault();
            const data = getEmployeeFormData("addEmployeeForm", "add");
            console.log(data);

            const spinner = document.getElementById("add_employee_btn_spinner");
            spinner.classList.remove("d-none");

            const save_button = document.getElementById(
                "add-employee-submit-btn"
            );
            save_button.classList.add("disabled");

            const close_button = document.getElementById("add_form_close_btn");
            close_button.classList.add("disabled");

            try {
                // Add employee data
                const employee = data.employee;
                const result = await addEmployee({
                    _employee_id: null,
                    ...employee,
                });
                const employee_id = result.result;
                console.log(12333, employee_id);

                // Add new updated degrees
                for (let deg of data.degrees) {
                    await addDegree({
                        _degree_id: null,
                        _employee_id: employee_id,
                        ...deg,
                    });
                }

                // Add new updated experiences
                for (let exp of data.experiences) {
                    await addExperience({
                        _experience_id: null,
                        _employee_id: employee_id,
                        ...exp,
                    });
                }
                spinner.classList.add("d-none");
                save_button.classList.remove("disabled");
                close_button.classList.remove("disabled");

                showToast("Employee Added Successfully!", "bg-success");
                setTimeout(() => {
                    location.reload();
                }, 1200);
            } catch (error) {
                spinner.classList.add("d-none");
                save_button.classList.remove("disabled");
                close_button.classList.remove("disabled");

                console.log(error);
                showToast("Something went wrong!", "bg-warning");
            }
        });

    // Update the sidebar state
    updateSidebarState();
});

// Toggle sidebar
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("sidebarToggle");
const backdrop = document.getElementById("sidebarBackdrop");

const updateSidebarState = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
        sidebar.classList.add("collapsed");
        backdrop.classList.add("d-none");
    } else {
        sidebar.classList.remove("collapsed");
        backdrop.classList.add("d-none");
    }
};

window.addEventListener("resize", updateSidebarState);

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");

    const mobile = window.innerWidth < 768;
    const sidebarOpen = !sidebar.classList.contains("collapsed");

    if (mobile && sidebarOpen) {
        backdrop.classList.remove("d-none");
    } else {
        backdrop.classList.add("d-none");
    }
});

backdrop.addEventListener("click", () => {
    sidebar.classList.add("collapsed");
    backdrop.classList.add("d-none");
});

// Change date format
const convertDateToYearMonthDay = (date) => {
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
};

// Function to set employee data to edit form
const setValuesToEmployeeEditFormFields = (selectedEmployee) => {
    document.getElementById("edit_employee_id").value =
        selectedEmployee?._employee_id;
    document.getElementById("edit_name").value = selectedEmployee?._name;
    document.getElementById("edit_date_of_birth").value =
        convertDateToYearMonthDay(selectedEmployee._date_of_birth);
    document.getElementById("edit_nid").value = selectedEmployee?._nid;
    document.getElementById("edit_gender").value = selectedEmployee?._gender;
    document.getElementById("edit_marital_status").value =
        selectedEmployee?._marital_status;
    document.getElementById("edit_nationality").value =
        selectedEmployee?._nationality;
    document.getElementById("edit_email").value = selectedEmployee?._email;
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
    document.getElementById("edit_dept").value = selectedEmployee?._dept;
    document.getElementById("edit_designation").value =
        selectedEmployee?._designation;
    document.getElementById("edit_role").value = selectedEmployee?._role;
    document.getElementById("edit_salary").value = selectedEmployee?._salary;
};

// Add new exp/deg form button
const createAddDegreeOrExperienceButton = (data, type) => {
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

// Add deg/exp button handler
const addDegreeOrExperienceButtonHandler = (
    addBtnId,
    fieldsWrapper,
    formClass,
    createFormFieldsFn,
    addButtonContainer
) => {
    document.getElementById(addBtnId).addEventListener("click", () => {
        if (fieldsWrapper.lastChild.id === addBtnId) {
            fieldsWrapper.removeChild(fieldsWrapper.lastChild);
        }
        const currentCount = fieldsWrapper.querySelectorAll(
            `.${formClass}`
        ).length;

        fieldsWrapper.appendChild(createFormFieldsFn(null, currentCount));
        fieldsWrapper.appendChild(addButtonContainer);
    });
};

// Remove exp/deg button
const removeFormButtonHandler = (
    container_id,
    remove_btn_classname,
    form_classname
) => {
    document
        .getElementById(container_id)
        .addEventListener("click", function (e) {
            if (e.target.classList.contains(remove_btn_classname)) {
                const form = e.target.closest(`.${form_classname}`);
                if (form) {
                    form.remove();
                }
            }
        });
};

// Function to create a degree form fields
const createDegreeFormFields = (degree = null, index = null) => {
    const formId = `degree-${index}`;

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
            <label for="edit_degree_location_${index}" class="form-label">Location</label>
            <input type="text" class="form-control" id="edit_degree_location_${index}" 
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
const createExperienceFormFields = (experience = null, index = null) => {
    const formId = `experience-${index}`;

    const formDiv = document.createElement("div");
    formDiv.className = "row g-3 mt-0 experience-form";
    formDiv.id = formId;
    formDiv.innerHTML = `
        <!-- Company Name -->
        <div class="col-md-6">
            <label for="edit_company_name_${index}" class="form-label">Company Name</label>
            <input type="text" class="form-control" id="edit_company_name_${index}" 
                name="_company_name" value="${
                    experience?._company_name || ""
                }" required />
        </div>
        
        <!-- Position -->
        <div class="col-md-6">
            <label for="edit_position_${index}" class="form-label">Position</label>
            <input type="text" class="form-control" id="edit_position_${index}" 
                name="_position" value="${
                    experience?._position || ""
                }" required />
        </div>
        
        <!-- Joining Date -->
        <div class="col-md-6">
            <label for="edit_exp_joining_date_${index}" class="form-label">Joining Date</label>
            <input type="date" class="form-control" id="edit_exp_joining_date_${index}" 
                name="_joining_date" value="${
                    experience?._joining_date
                        ? convertDateToYearMonthDay(experience?._joining_date)
                        : ""
                }" required />
        </div>

        <!-- Ending Date -->
        <div class="col-md-6">
            <label for="edit_ending_date_${index}" class="form-label">Ending Date</label>
            <input type="date" class="form-control" id="edit_ending_date_${index}" 
                name="_ending_date" value="${
                    experience?._ending_date
                        ? convertDateToYearMonthDay(experience?._ending_date)
                        : ""
                }" required />
        </div>
        
        <!-- Location -->
        <div class="col-md-12">
            <label for="edit_location_${index}" class="form-label">Location</label>
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

const getEmployeeFormData = (formId, typeOfOperation) => {
    const form = document.getElementById(formId);
    const formData = new FormData(form);

    const employeeData = {};
    for (const [key, value] of formData.entries()) {
        if (key === "_employee_id" || key === "_nid" || key === "_salary") {
            employeeData[key] = parseInt(value);
        } else {
            employeeData[key] = value;
        }
    }

    // Degree
    const degreeFieldNames = [
        "_degree_name",
        "_institute_name",
        "_major",
        "_location",
        "_gpa",
        "_gpa_scale",
        "_year_of_passing",
    ];

    degreeFieldNames.forEach((field) => {
        delete employeeData[field];
    });

    const degrees = [];
    document
        .querySelectorAll(
            `#${typeOfOperation}_education_fields_container .degree-form`
        )
        .forEach((degreeDiv) => {
            const degreeInputs = degreeDiv.querySelectorAll("input, select");
            const degreeObj = {};
            degreeInputs.forEach((input) => {
                if (input.name === "_gpa" || input.name === "_gpa_scale") {
                    degreeObj[input.name] = parseFloat(input.value);
                } else if (input.name === "_year_of_passing") {
                    degreeObj[input.name] = parseInt(input.value);
                } else {
                    degreeObj[input.name] = input.value;
                }
            });
            degrees.push(degreeObj);
        });

    // Experience
    const experienceFieldNames = [
        "_company_name",
        "_position",
        "_joining_date",
        "_ending_date",
        "_location",
    ];

    experienceFieldNames.forEach((field) => {
        if (field !== "_joining_date") {
            delete employeeData[field];
        }
    });

    const experiences = [];
    document
        .querySelectorAll(
            `#${typeOfOperation}_experience_fields_container .experience-form`
        )
        .forEach((experienceDiv) => {
            const experienceInputs =
                experienceDiv.querySelectorAll("input, select");
            const experienceObj = {};
            experienceInputs.forEach((input) => {
                if (input.name) {
                    experienceObj[input.name] = input.value;
                }
            });
            experiences.push(experienceObj);
        });

    return {
        employee: employeeData,
        degrees: degrees,
        experiences: experiences,
    };
};

// Show toast function
const showToast = (message, colorClass = "bg-primary") => {
    const toastElement = document.getElementById("mainToast");
    const toastBody = document.getElementById("mainToastBody");
    toastElement.classList.remove("bg-primary", "bg-danger", "bg-success");
    toastElement.classList.add(colorClass);
    toastBody.textContent = message;
    const toast = bootstrap.Toast.getOrCreateInstance(toastElement);
    toast.show();
};
