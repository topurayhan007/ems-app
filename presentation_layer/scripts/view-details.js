import {
    fetchDegrees,
    fetchExperiences,
    addDegree,
    addExperience,
    updateEmployee,
    deleteDegree,
    deleteExperience,
    fetchEmployeeByID,
    deleteEmployee,
} from "./api-calls.js";

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const employeeId = params.get("id");

    const sidebarLinks = document.querySelectorAll("#sidebarMenu .nav-link");

    const employeeData = await fetchEmployeeByID(employeeId);
    const employee = employeeData.employee[0];
    const degreeData = await fetchDegrees(employeeId);
    const degrees = degreeData.degrees;
    const experienceData = await fetchExperiences(employeeId);
    const experiences = experienceData.experiences;
    // console.log(employee, degrees, experiences);

    sidebarLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = link.getAttribute("data-target");

            switch (targetId) {
                case "dashboard":
                    window.location.href = "/";
                    break;

                case "view-emp-section":
                    window.location.href = "../templates/employees.html";
                    break;

                default:
                    console.warn("Unknown target:", targetId);
            }
        });
    });

    // fill employee data
    fillEmployeeDetails(employee);

    // Fill Degrees
    fillDegrees(degrees);

    // Fill Degrees
    fillExperiences(experiences);

    // Edit Button Function
    document
        .querySelector('[data-bs-target="#editEmployeeFormModal"]')
        .addEventListener("click", async () => {
            if (employee) {
                setValuesToEmployeeEditFormFields(employee);
            }

            const education_fields_wrapper = document.getElementById(
                "edit_education_fields_container"
            );
            const education_fields_parent = document.getElementById(
                "edit_education_fields"
            );
            education_fields_wrapper.innerHTML = "";
            education_fields_parent.classList.remove("d-none");

            const addEducationButtonContainer =
                createAddDegreeOrExperienceButton(degrees, "degree");
            degrees.forEach((degree, index) => {
                education_fields_wrapper.appendChild(
                    createDegreeFormFields(degree, index)
                );
            });
            education_fields_wrapper.appendChild(addEducationButtonContainer);

            // Experience
            const experience_fields_wrapper = document.getElementById(
                "edit_experience_fields_container"
            );
            const experience_fields_parent = document.getElementById(
                "edit_experience_fields"
            );
            experience_fields_wrapper.innerHTML = "";
            experience_fields_parent.classList.remove("d-none");

            const addExperienceButtonContainer =
                createAddDegreeOrExperienceButton(experiences, "experience");
            experiences.forEach((exp, index) => {
                experience_fields_wrapper.appendChild(
                    createExperienceFormFields(exp, index)
                );
            });
            experience_fields_wrapper.appendChild(addExperienceButtonContainer);

            addDegreeOrExperienceButtonHandler(
                "addDegreeButton",
                education_fields_wrapper,
                "degree-form",
                createDegreeFormFields,
                addEducationButtonContainer
            );
            removeFormButtonHandler(
                "edit_education_fields_container",
                "remove-degree-btn",
                "degree-form"
            );
            addDegreeOrExperienceButtonHandler(
                "addExperienceButton",
                experience_fields_wrapper,
                "experience-form",
                createExperienceFormFields,
                addExperienceButtonContainer
            );
            removeFormButtonHandler(
                "edit_experience_fields_container",
                "remove-experience-btn",
                "experience-form"
            );
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

            // Date checks
            const now = new Date();
            // Date of birth can't be in the future
            if (
                data.employee._date_of_birth &&
                new Date(data.employee._date_of_birth) > now
            ) {
                showToast(
                    "Date of birth cannot be in the future.",
                    "bg-danger"
                );
                return;
            }
            // Joining date not in the future
            if (
                data.employee._joining_date &&
                new Date(data.employee._joining_date) > now
            ) {
                showToast("Joining date cannot be in the future.", "bg-danger");
                return;
            }

            // Email check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.employee._email)) {
                showToast("Invalid email address.", "bg-danger");
                return;
            }

            // NID check: 10 to 17 digits
            if (
                data.employee._nid.length < 10 ||
                data.employee._nid.length > 17
            ) {
                showToast("NID must be 10 to 17 digits.", "bg-danger");
                return;
            }

            // Phone number: exactly 11 digits
            if (!data.employee._phone_no.length === 11) {
                showToast(
                    "Phone number must be exactly 11 digits.",
                    "bg-danger"
                );
                return;
            }

            // Check GPA values for degrees
            for (let deg of data.degrees) {
                if (deg._gpa > deg._gpa_scale) {
                    showToast(
                        `GPA must be smaller than GPA scale for degree: ${deg._degree_name}`,
                        "bg-danger"
                    );
                    return;
                }
            }

            // Check experience dates
            for (let exp of data.experiences) {
                if (new Date(exp._joining_date) > now) {
                    showToast(
                        "Experience joining date cannot be in the future.",
                        "bg-danger"
                    );
                    return;
                }
                if (new Date(exp._ending_date) > now) {
                    showToast(
                        "Experience ending date cannot be in the future.",
                        "bg-danger"
                    );
                    return;
                }
                if (new Date(exp._joining_date) >= new Date(exp._ending_date)) {
                    showToast(
                        "There should be difference between Joining and Ending date for experiences.",
                        "bg-danger"
                    );
                    return;
                }
            }

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
                    try {
                        await deleteExperience(exp._experience_id);
                    } catch (error) {
                        spinner.classList.add("d-none");
                        save_button.classList.remove("disabled");
                        close_button.classList.remove("disabled");

                        console.log(error);
                        showToast(error.message, "bg-danger");
                    }
                }

                // Add new updated degrees
                for (let deg of data.degrees) {
                    try {
                        await addDegree({
                            _degree_id: null,
                            _employee_id: employee_id,
                            ...deg,
                        });
                    } catch (error) {
                        spinner.classList.add("d-none");
                        save_button.classList.remove("disabled");
                        close_button.classList.remove("disabled");

                        console.log(error);
                        showToast(error.message, "bg-danger");
                    }
                }

                // Add new updated experiences
                for (let exp of data.experiences) {
                    try {
                        await addExperience({
                            _experience_id: null,
                            _employee_id: employee_id,
                            ...exp,
                        });
                    } catch (error) {
                        spinner.classList.add("d-none");
                        save_button.classList.remove("disabled");
                        close_button.classList.remove("disabled");

                        console.log(error);
                        showToast(error.message, "bg-danger");
                    }
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
                showToast(error.message, "bg-danger");
            }
        });

    // Delete button
    document
        .querySelector("#delete-emp-button")
        .addEventListener("click", (e) => {
            const modalElement = document.getElementById("deleteEmployeeModal");
            const modal = bootstrap.Modal.getInstance(modalElement);

            // Attach only one handler
            document.getElementById("deleteEmployeeButton").onclick = async (
                e
            ) => {
                try {
                    const result = await deleteEmployee(employeeId);

                    if (result.result == 1) {
                        modal.hide();
                        showToast("Deleted Successfully!", "bg-success");
                        setTimeout(() => {
                            window.location.href =
                                "../templates/employees.html";
                            // location.reload();
                        }, 1200);
                    } else {
                        modal.hide();
                        showToast("Something went wrong!", "bg-danger");
                    }
                } catch (error) {
                    console.log(error);
                    modal.hide();
                    showToast("Something went wrong!", "bg-danger");
                }
            };
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
        main.classList.remove("col-md-9", "col-lg-10", "ms-sm-auto");
        main.classList.add("col-md-12");
    } else {
        sidebar.classList.remove("collapsed");
        backdrop.classList.add("d-none");
        main.classList.remove("col-md-12");
        main.classList.add("col-md-9", "col-lg-10", "ms-sm-auto");
    }
};

window.addEventListener("resize", updateSidebarState);

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");

    const mobile = window.innerWidth < 768;
    const sidebarOpen = sidebar.classList.contains("collapsed");
    if (sidebarOpen) {
        main.classList.remove("col-md-9", "col-lg-10", "ms-sm-auto");
        main.classList.add("col-md-12");
    } else {
        main.classList.remove("col-md-12");
        main.classList.add("col-md-9", "col-lg-10", "ms-sm-auto");
    }

    if (mobile && !sidebarOpen) {
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
            <input type="number" step="0.01" class="form-control" id="edit_gpa_scale_${index}" 
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
        if (key === "_employee_id" || key === "_salary") {
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
    toastElement.classList.remove(
        "bg-primary",
        "bg-danger",
        "bg-success",
        "bg-warning",
        "bg-info",
        "bg-secondary",
        "bg-dark",
        "bg-light"
    );
    toastElement.classList.add(colorClass);
    toastBody.textContent = message;
    const toast = bootstrap.Toast.getOrCreateInstance(toastElement);
    toast.show();
};

const fillEmployeeDetails = (employee) => {
    if (!employee) return;
    const names = document.querySelectorAll("#name");
    names.forEach((name) => {
        name.textContent = employee._name || "";
    });

    document.getElementById("name").textContent = employee._name || "";
    document.getElementById("designation").textContent =
        employee._designation || "";
    document.getElementById("dept").textContent = employee._dept || "";
    const emails = document.querySelectorAll("#email");
    emails.forEach((email) => {
        email.textContent = employee._email || "";
    });
    const phone_nos = document.querySelectorAll("#phone_no");
    phone_nos.forEach((phone_no) => {
        phone_no.textContent = employee._phone_no || "";
    });
    document.getElementById("joining_date").textContent =
        employee._joining_date || "";
    document.getElementById("role").textContent = employee._role || "";
    document.getElementById("nid").textContent = employee._nid || "";
    document.getElementById("date_of_birth").textContent =
        employee._date_of_birth || "";
    document.getElementById("father_name").textContent =
        employee._father_name || "";
    document.getElementById("mother_name").textContent =
        employee._mother_name || "";
    document.getElementById("marital_status").textContent =
        employee._marital_status || "";
    document.getElementById("nationality").textContent =
        employee._nationality || "";
    document.getElementById("present_address").textContent =
        employee._present_address || "";
    document.getElementById("permanent_address").textContent =
        employee._permanent_address || "";
    document.getElementById("gender").textContent = employee._gender || "";
};

const fillDegrees = (degrees) => {
    const container = document.getElementById("education-list");
    container.innerHTML = "";
    if (degrees.length > 0) {
        degrees.forEach((degree) => {
            container.innerHTML += `
            <div class="border border-1 border-dark-subtle p-3 pt-4 rounded-3 ${
                degrees.length > 1 ? "mt-3" : ""
            }">
                <h6 class="fs-5 fw-medium">
                    <span><i class="me-2" data-lucide="graduation-cap"></i>${
                        degree._degree_name
                    }</span>
                    in <span>${degree._major}</span>
                </h6>
                <p>${degree._institute_name}</p>
                <ul class="list-unstyled d-flex flex-wrap gap-2 gap-md-3 mb-0">
                    <li class="text-muted d-flex gap-2">
                        <i data-lucide="mail"></i>
                        <p class="mb-0">Graduated <span>${
                            degree._year_of_passing
                        }</span></p>
                    </li>
                    <li class="text-muted d-flex gap-2">
                        <i data-lucide="map-pin"></i>
                        <p class="mb-0"><span>${degree._location}</span></p>
                    </li>
                    <li class="text-muted d-flex gap-2">
                        <i data-lucide="trophy"></i>
                        <p class="mb-0">GPA <span>${
                            degree._gpa
                        }</span> / <span>${degree._gpa_scale}</span></p>
                    </li>
                </ul>
            </div>
        `;
        });
    } else {
        container.innerHTML = `No Data found`;
    }
    if (window.lucide) lucide.createIcons();
};

const fillExperiences = (experiences) => {
    const container = document.getElementById("experience-list");
    container.innerHTML = "";
    if (experiences.length > 0) {
        experiences.forEach((exp) => {
            container.innerHTML += `
            <div class="border border-1 border-dark-subtle p-3 pt-4 rounded-3 ${
                experiences.length > 1 ? "mt-3" : ""
            }">
                <h6 class="fs-5 fw-medium">
                    <span class="d-flex align-items-center">
                        <i class="me-2" data-lucide="briefcase"></i>${
                            exp._position
                        }
                    </span>
                </h6>
                <p>${exp._company_name}</p>
                <ul class="list-unstyled d-flex flex-wrap gap-2 gap-md-3 mb-0">
                    <li class="text-muted d-flex gap-2">
                        <i data-lucide="calendar"></i>
                        <p class="mb-0"><span>${
                            exp._joining_date
                        }</span> to <span>${exp._ending_date}</span></p>
                    </li>
                    <li class="text-muted d-flex gap-2">
                        <i data-lucide="map-pin"></i>
                        <p class="mb-0"><span>${exp._location}</span></p>
                    </li>
                </ul>
            </div>
        `;
        });
    } else {
        container.innerHTML = `No Data found`;
    }
    if (window.lucide) lucide.createIcons();
};
