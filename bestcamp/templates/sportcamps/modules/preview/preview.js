let previewCarousel = document.getElementById("previewCarousel");

if (previewCarousel) {
    window.addEventListener('load', () => {
        const carouselUri = {
            css: sportcamps.js + 'carousel/carousel.css',
            js: sportcamps.js + 'carousel/carousel.umd.js',
            moduleCss: sportcamps.templates + 'sportcamps/modules/preview/preview.css'
            // css: '../../../../templates/js/carousel/carousel.css',
            // js: '../../../../templates/js/carousel/carousel.umd.js',
            // moduleCss: 'preview.css',
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
                breakpoints: {
                    "(min-width: 320px)": {
                        slidesPerPage: 1,
                    },
                    "(min-width: 633px)": {
                        slidesPerPage: 2,
                    },
                    "(min-width: 958px)": {
                        slidesPerPage: 3,
                    },
                },
            };

            function tryCreateCarousel() {
                new Carousel(previewCarousel, options);
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