document.addEventListener("DOMContentLoaded", () => {
    const infrastructure = document.querySelector(".infr");

    if (infrastructure) {
        // Делегування для .infrastructure__filling_table-wrapper
        infrastructure.addEventListener("click", (e) => {
            const arrow = e.target.closest(".arrow-table");
            if (!arrow) return;

            // Знаходимо найближчий .infr__table__wrap
            const tableWrap = arrow.closest(".infr__table__wrap");
            const tableRow = arrow.closest(".infr__table__param");
            const optionsList = tableWrap?.querySelector(".infr__table__info");

            if (optionsList && tableRow) {
                optionsList.classList.toggle("visible");
                tableRow.classList.toggle("rotated");
            }
        });

        // Делегування для .infrastructure__head_arrow
        infrastructure.addEventListener("click", (e) => {
            const arrow = e.target.closest(".infr__drop__h4");
            if (!arrow) return;

            const wrapper = arrow.closest(".infr__drop")
                ?.querySelector(".infr__drop__wrap");

            if (wrapper) {
                wrapper.classList.toggle("visible");
                arrow.classList.toggle("rotated");
            }
        });
    }
});
//
// document.addEventListener("DOMContentLoaded", () => {
//     const infrastructure = document.querySelector(".infr");
//
//     if (infrastructure) {
//         // Функція для синхронізації ширини між заголовками та значеннями
//         const syncColumnWidths = () => {
//             const tables = infrastructure.querySelectorAll(".infr__table");
//
//             tables.forEach((table) => {
//                 const headerRow = table.querySelector(".infr__table__col.w-100");
//                 const dataRow = table.querySelector(".infr__table__rows .infr__table__row .infr__table__col:not(:first-child)");
//
//                 if (!headerRow || !dataRow) return;
//
//                 const headerCells = Array.from(headerRow.children);
//                 const dataCells = Array.from(dataRow.children);
//
//                 headerCells.forEach((headerCell, index) => {
//                     const dataCell = dataCells[index];
//                     if (!dataCell) return;
//
//                     headerCell.style.width = "auto";
//                     dataCell.style.width = "auto";
//
//                     const headerWidth = headerCell.getBoundingClientRect().width;
//                     const dataWidth = dataCell.getBoundingClientRect().width;
//
//                     const maxWidth = Math.max(headerWidth, dataWidth);
//
//                     headerCell.style.width = `${maxWidth}px`;
//                     dataCell.style.width = `${maxWidth}px`;
//
//                     headerCell.style.display = "flex";
//                     headerCell.style.justifyContent = "center";
//                     headerCell.style.textAlign = "center";
//
//                     dataCell.style.display = "flex";
//                     dataCell.style.justifyContent = "center";
//                     dataCell.style.textAlign = "center";
//                 });
//             });
//         };
//
//         syncColumnWidths();
//
//         infrastructure.addEventListener("click", (e) => {
//             const arrow = e.target.closest(".infr__table__wrap");
//             if (!arrow) return;
//
//             const table = arrow.closest(".infr__table__row");
//             const addition = table?.querySelector(".infr__table__info");
//
//             if (addition) {
//                 addition.classList.toggle("visible");
//                 table.classList.toggle("rotated");
//             }
//         });
//
//         infrastructure.addEventListener("click", (e) => {
//             const arrow = e.target.closest(".infr__drop__h4");
//             if (!arrow) return;
//
//             const wrapper = arrow.closest(".infr__drop")
//                 ?.querySelector(".infr__drop__wrap");
//
//             if (wrapper) {
//                 wrapper.classList.toggle("visible");
//                 arrow.classList.toggle("rotated");
//             }
//         });
//
//         window.addEventListener("resize", syncColumnWidths);
//     }
// });