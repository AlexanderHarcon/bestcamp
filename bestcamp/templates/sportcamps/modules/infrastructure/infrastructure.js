document.addEventListener("DOMContentLoaded", () => {
    const infrastructure = document.querySelector(".infrastructure");

    if (infrastructure) {
        // Делегування для .infrastructure__filling_table-wrapper
        infrastructure.addEventListener("click", (e) => {
            const arrow = e.target.closest(".infrastructure__filling_table-wrapper");
            if (!arrow) return;

            const table = arrow.closest(".infrastructure__filling_table");
            const addition = table?.querySelector(".infrastructure__filling_table_addition");

            if (addition) {
                addition.classList.toggle("visible");
                table.classList.toggle("rotated");
            }
        });

        // Делегування для .infrastructure__head_arrow
        infrastructure.addEventListener("click", (e) => {
            const arrow = e.target.closest(".infrastructure__head_arrow");
            if (!arrow) return;

            const wrapper = arrow.closest(".infrastructure__filling_table_info")
                ?.querySelector(".infrastructure__filling_table_info-wrapper");

            if (wrapper) {
                wrapper.classList.toggle("visible");
                arrow.classList.toggle("rotated");
            }
        });
    }
});