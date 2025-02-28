document.addEventListener('DOMContentLoaded', function() {
    const arrow = document.querySelector('.inf-table__head-arrow');
    const list = document.querySelector('.inf-table__list');

    arrow.addEventListener('click', function() {
        list.classList.toggle('visible');
        const arrowIcon = this.querySelector('.arrow');
        if (list.classList.contains('visible')) {
            arrowIcon.textContent = '▼'; // Стрілка вниз
        } else {
            arrowIcon.textContent = '▶'; // Стрілка вправо
        }
    });
});