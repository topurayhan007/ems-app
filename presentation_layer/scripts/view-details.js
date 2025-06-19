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

import {
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
    fillDegrees,
    fillExperiences,
    fillEmployeeDetails,
} from "./utils.js";

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

window.addEventListener("resize", updateSidebarState);
