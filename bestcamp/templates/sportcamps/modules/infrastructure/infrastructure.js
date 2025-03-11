document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".infrastructure__filling_table-wrapper").forEach(arrow => {
        arrow.addEventListener("click", function () {
            const tableAddition = this.closest(".infrastructure__filling_table")
                .querySelector(".infrastructure__filling_table_addition")

            if (tableAddition) {
                tableAddition.classList.toggle("visible");
                this.closest(".infrastructure__filling_table").classList.toggle("rotated");
            }
        });
    });

    document.querySelectorAll(".infrastructure__head_arrow").forEach(arrow => {
        arrow.addEventListener("click", function () {
            const wrapper = this.closest(".infrastructure__filling_table_info")
                .querySelector(".infrastructure__filling_table_info-wrapper");

            if (wrapper) {
                wrapper.classList.toggle("visible");
                this.classList.toggle("rotated");
            }
        });
    });
});
