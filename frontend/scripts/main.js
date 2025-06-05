import { fetchEmployees } from "./api-calls.js";

document.addEventListener("DOMContentLoaded", function () {
    const sidebarLinks = document.querySelectorAll("#sidebarMenu .nav-link");

    const setActiveLink = (clickedLink) => {
        sidebarLinks.forEach((link) => link.classList.remove("active"));
        clickedLink.classList.add("active");
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

            if (targetId === "view-emp-section") {
                try {
                    const data = await fetchEmployees();
                    console.log(data);
                } catch (error) {
                    console.error(error);
                }
            }
        });
    });
});
