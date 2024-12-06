let hotelCarousel = document.getElementById("hotelCarousel");

if (hotelCarousel) {
    window.addEventListener('load', () => {
        const carouselUri = {
            css: sportcamps.js + 'carousel/carousel.css',
            js: sportcamps.js + 'carousel/carousel.umd.js',
            moduleCss: sportcamps.templates + 'sportcamps/modules/hoteloverview/hoteloverview.css',
        };

        // Загружаем стили и скрипты carousel
        loaderBody(carouselUri.css, () => {
            carouselUri.css = '';
        }, 'link');

        loaderBody(carouselUri.js, () => {
            carouselUri.js = '';
            const options = {
                Dots: false,
            };

            function tryCreateCarousel() {
                new Carousel(hotelCarousel, options);
            }

            if (typeof Carousel !== 'undefined') {
                tryCreateCarousel();
            } else {
                setTimeout(tryCreateCarousel, 100);
            }
        });

        loaderBody(carouselUri.moduleCss, null, 'link');
    });
}
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