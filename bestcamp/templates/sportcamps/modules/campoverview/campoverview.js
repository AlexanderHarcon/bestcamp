let campCarousel = document.getElementById("campCarousel");

if (campCarousel) {
    window.addEventListener('load', () => {
        const carouselUri = {
            css: sportcamps.js + 'assets/templates/js/carousel/carousel.css',
            js: sportcamps.js + 'assets/templates/js/carousel/carousel.umd.js',
            moduleCss: sportcamps.templates + '/campoverview.css'
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
                new Carousel(campCarousel, options);
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