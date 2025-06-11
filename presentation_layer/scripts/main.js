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
                if (degrees.length > 0) {
                    const fieldset = document.getElementById(
                        "edit_education_fields"
                    );
                    fieldset.classList.remove("d-none");

                    const fields_wrapper = document.getElementById(
                        "edit_education_fields_container"
                    );
                    fields_wrapper.innerHTML
                }
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
