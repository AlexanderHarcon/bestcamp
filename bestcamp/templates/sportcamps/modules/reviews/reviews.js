let reviewsCarousel = document.getElementById("reviewsCarousel");

if (reviewsCarousel) {
    window.addEventListener('load', () => {
        const carouselUri = {
            css: sportcamps.js + 'carousel/carousel.css',
            js: sportcamps.js + 'carousel/carousel.umd.js',
            moduleCss: sportcamps.templates + 'sportcamps/modules/reviews/reviews.css',
        };

        // Загружаем стили и скрипты carousel
        loaderBody(carouselUri.css, () => {
            carouselUri.css = '';
        }, 'link');
        loaderBody(carouselUri.js, () => {
            carouselUri.js = '';

            const options = {
                dragFree: false,
                infinite: true,
                center: false,
                breakpoints: {
                    "(min-width: 320px)": {
                        slidesPerPage: 1,
                    },
                    "(min-width: 664px)": {
                        slidesPerPage: 2,
                    },
                    "(min-width: 1024px)": {
                        slidesPerPage: 3,
                    },
                },
            };

            function tryCreateCarousel() {
                new Carousel(reviewsCarousel, options);
            }

            if (typeof Carousel !== 'undefined') {
                tryCreateCarousel();
            } else {
                // Если библиотека или элемент еще не готовы, пытаемся снова через 100 мс
                setTimeout(tryCreateCarousel, 100);
            }
        });
        loaderBody(carouselUri.moduleCss, null, 'link');
    });
}

