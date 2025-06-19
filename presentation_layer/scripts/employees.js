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

import {
    renderEmployeeTable,
    createAddDegreeOrExperienceButton,
    createDegreeFormFields,
    createExperienceFormFields,
} from "./renderer.js";

import {
    updateSidebarState,
    setValuesToEmployeeEditFormFields,
    addDegreeOrExperienceButtonHandler,
    removeFormButtonHandler,
    getEmployeeFormData,
    showToast,
} from "./utils.js";

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
    const searchInput = document.getElementById("employee_search_input");
    let searchTimeout;
    searchInput.addEventListener("input", () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            const query = searchInput.value.trim();
            if (!query) {
                // Fetch all if cleared
                try {
                    const data = await fetchEmployees();
                    renderEmployeeTable(data.employees || []);
                } catch (error) {
                    console.error(error);
                }
            } else {
                // Live search
                try {
                    const data = await searchEmployees(query);
                    renderEmployeeTable(data.employees || []);
                } catch (error) {
                    console.error(error);
                }
            }
        }, 150);
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
                // console.log(experiences);

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
                            showToast("Something went wrong!", "bg-danger");
                        }
                    });
            }
        });

    // Employee Table Add Employee Button
    const addEmployeeButtons = document.querySelectorAll("#addEmployeeButton");
    addEmployeeButtons.forEach((addButton) => {
        addButton.addEventListener("click", () => {
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

            const employee = data.employee;
            const degrees = data.degrees;
            const experiences = data.experiences;

            // Date checks
            const now = new Date();
            // Date of birth can't be in the future
            if (
                employee._date_of_birth &&
                new Date(employee._date_of_birth) > now
            ) {
                showToast(
                    "Date of birth cannot be in the future.",
                    "bg-danger"
                );
                return;
            }
            // Joining date not in the future
            if (
                employee._joining_date &&
                new Date(employee._joining_date) > now
            ) {
                showToast("Joining date cannot be in the future.", "bg-danger");
                return;
            }

            // Email check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(employee._email)) {
                showToast("Invalid email address.", "bg-danger");
                return;
            }

            // NID check: 10 to 17 digits
            if (
                employee._nid.toString().length < 10 ||
                employee._nid.toString().length > 17
            ) {
                showToast("NID must be 10 to 17 digits.", "bg-danger");
                return;
            }

            // Phone number: exactly 11 digits
            if (!employee._phone_no.length === 11) {
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
                const result = await addEmployee({
                    _employee_id: null,
                    ...employee,
                });
                const employee_id = result.result;
                console.log(12333, employee_id);

                if (employee_id) {
                    // Add new updated degrees
                    for (let deg of degrees) {
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
                    for (let exp of experiences) {
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

                    showToast("Employee Added Successfully!", "bg-success");
                    setTimeout(() => {
                        location.reload();
                    }, 1200);
                }
            } catch (error) {
                spinner.classList.add("d-none");
                save_button.classList.remove("disabled");
                close_button.classList.remove("disabled");

                console.log(error);
                showToast(error.message, "bg-danger");
            }
        });

    // Update the sidebar state
    updateSidebarState();
});

window.addEventListener("resize", updateSidebarState);
