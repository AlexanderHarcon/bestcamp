document.addEventListener("DOMContentLoaded", () => {
    const infrastructure = document.querySelector(".infr");

    if (infrastructure) {
        infrastructure.addEventListener("click", (e) => {
            const arrow = e.target.closest(".arrow-table_js");
            if (!arrow) return;

            const tableWrap = arrow.closest(".infr__table_js");
            const tableRow = arrow.closest(".infr__table_js");
            const optionsList = tableWrap?.querySelector(".infr__table__info_js");

            if (optionsList && tableRow) {
                optionsList.classList.toggle("visible");
                arrow.classList.toggle("rotated");
            }
        });

        infrastructure.addEventListener("click", (e) => {
            const arrow = e.target.closest(".drop__header");
            if (!arrow) return;

            const wrapper = arrow.closest(".drop_js")
                ?.querySelector(".drop__wrap_js");

            if (wrapper) {
                wrapper.classList.toggle("visible");
                arrow.querySelector(".drop__icon_js")?.classList.toggle("rotated");
            }
        });
    }
});