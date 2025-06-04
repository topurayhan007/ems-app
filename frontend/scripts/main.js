document.addEventListener("DOMContentLoaded", function () {
    const sidebarLinks = document.querySelectorAll("#sidebarMenu .nav-link");

    sidebarLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            sidebarLinks.forEach((item) => {
                item.classList.remove("active");
            });

            this.classList.add("active");

            document.querySelectorAll(".content-section").forEach((section) => {
                section.classList.remove("active");
            });

            const targetId = this.getAttribute("data-target");
            document.getElementById(targetId).classList.add("active");
        });
    });
});
