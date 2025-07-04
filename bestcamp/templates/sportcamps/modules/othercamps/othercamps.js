document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".othercamps-sections__js section[id]");
    const nav = document.querySelector(".othercamps-nav__js");
    if (!nav) return;

    const container = document.querySelector(".othercamps-sections__js");
    let navHeight = nav.offsetHeight;
    window.addEventListener("resize", () => navHeight = nav.offsetHeight);

    const clearActive = () => nav.querySelectorAll("a").forEach(link => link.classList.remove("active"));

    window.addEventListener("scroll", () => {
        const currentPosition = window.scrollY + navHeight;
        let activeSection = null;

        sections.forEach(section => {
            const sectionId = section.getAttribute("id");
            if (!sectionId) return;

            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (currentPosition >= sectionTop && currentPosition < sectionBottom) {
                activeSection = section;
            }
        });

        clearActive();
        if (activeSection) {
            const sectionId = activeSection.getAttribute("id");
            const activeLink = nav.querySelector(`a[href="#${sectionId}"]`);
            if (activeLink) activeLink.classList.add("active");
        }

        const containerRect = container.getBoundingClientRect();
        nav.style.visibility = containerRect.bottom < navHeight ? "hidden" : "visible";
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#" || targetId === "") return;

            clearActive();
            link.classList.add("active");

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - navHeight,
                    behavior: "smooth"
                });
            }
        });
    });
});