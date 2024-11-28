window.addEventListener('DOMContentLoaded', function() {

    'use strict';
    let tab = document.querySelectorAll('.tabs__head'),
        header = document.querySelector('.tabs'),
        tabContent = document.querySelectorAll('.tabs-content');

    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
            tab[i].classList.remove('active');
        }
    }

    hideTabContent(1);

    function showTabContent(b) {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
            tab[b].classList.add('active');
        }
    }

    header.addEventListener('click', function(event) {
        let target = event.target;
        if (target && target.classList.contains('tabs__head')) {
            for(let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }

    });
});

document.addEventListener('DOMContentLoaded', function () {
    const inputs = document.querySelectorAll('.room-form__input');
    const submitButton = document.getElementById('submitButton');

    function checkInputs() {
        let isAnyInputFilled = false;
        inputs.forEach(input => {
            if (parseInt(input.value) > 0) {
                input.classList.add('filled'); // Змінюємо стиль заповнених полів
                isAnyInputFilled = true;
            } else {
                input.classList.remove('filled');
            }
        });
        submitButton.disabled = !isAnyInputFilled; // Активуємо кнопку, якщо є заповнені поля
        submitButton.classList.toggle('active', isAnyInputFilled);
    }

    inputs.forEach(input => {
        input.addEventListener('input', checkInputs);
    });
});