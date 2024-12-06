let excursionsCarousel = document.getElementById("excursionsCarousel");

if (excursionsCarousel) {
    window.addEventListener('load', () => {
        const carouselUri = {
            css: sportcamps.js + 'carousel/carousel.css',
            js: sportcamps.js + 'carousel/carousel.umd.js',
            moduleCss: sportcamps.templates + 'sportcamps/modules/excursions/excursions.css',
        };

        // Загружаем стили и скрипты carousel
        loaderBody(carouselUri.css, () => {
            carouselUri.css = '';
        }, 'link');

        loaderBody(carouselUri.js, () => {
            carouselUri.js = '';
            const options = {
                dragFree: false,
                center: false,
                infinite: true,
                breakpoints: {
                    "(min-width: 320px)": {
                        slidesPerPage: 1,
                    },
                    "(min-width: 430px)": {
                        slidesPerPage: 2,
                    },
                    "(min-width: 670px)": {
                        gap: 24,
                        slidesPerPage: 3,
                    },
                    "(min-width: 1024px)": {
                        gap: 24,
                        slidesPerPage: 4,
                    },
                },
            };

            function tryCreateCarousel() {
                new Carousel(excursionsCarousel, options);
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