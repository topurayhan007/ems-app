import { fetchEmployees } from "./api-calls.js";
import { renderEmployeeCount, renderEmployeeTable } from "./renderer.js";

document.addEventListener("DOMContentLoaded", function () {
    const sidebarLinks = document.querySelectorAll("#sidebarMenu .nav-link");

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
                        console.log(data.employees);
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
});
