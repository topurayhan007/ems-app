// Toggle sidebar
const main = document.getElementById("main");
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("sidebarToggle");
const backdrop = document.getElementById("sidebarBackdrop");

export const updateSidebarState = () => {
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
export const convertDateToYearMonthDay = (date) => {
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
};

// Function to set employee data to edit form
export const setValuesToEmployeeEditFormFields = (selectedEmployee) => {
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

// Add deg/exp button handler
export const addDegreeOrExperienceButtonHandler = (
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
export const removeFormButtonHandler = (
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

export const getEmployeeFormData = (formId, typeOfOperation) => {
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
export const showToast = (message, colorClass = "bg-primary") => {
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

// For View Details page
export const fillEmployeeDetails = (employee) => {
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

// For View Details page
export const fillDegrees = (degrees) => {
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

// For View Details page
export const fillExperiences = (experiences) => {
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
