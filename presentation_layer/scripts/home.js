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
    const sidebarLinks = document.querySelectorAll("#sidebarMenu .nav-link");
    let employee_data = [];

    const showSpinner = (show) => {
        document.getElementById("spinner").style.display = show
            ? "block"
            : "none";
    };

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

    sidebarLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = link.getAttribute("data-target");

            if (targetId === "view-emp-section") {
                window.location.href =
                    "/presentation_layer/templates/employees.html";
            }
        });
    });

    // Update the sidebar state
    updateSidebarState();
});

// Toggle sidebar
const main = document.getElementById("main");
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
