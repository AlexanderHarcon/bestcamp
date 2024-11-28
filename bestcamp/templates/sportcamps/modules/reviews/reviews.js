

window.addEventListener('load', () =>
{
    const carouselUri = {
        css: sportcamps.js + 'carousel/carousel.css',
        js: sportcamps.js + 'carousel/carousel.umd.js'
    };

    // Загружаем стили и скрипты intlTelInput
    loaderBody(intl.css, () =>
    {
        intl.css = '';

        loaderBody(intl.js, () =>
        {
            intl.js = '';

            document.querySelectorAll('[type ="tel"]').forEach((input) =>
            {
                intlTelInput(input, {
                    autoPlaceholder: 'aggressive',
                    initialCountry: 'gb',
                    preferredCountries: ['gb', 'de', 'il', 'fr', 'ch'],
                    utilsScript: intl.utils
                });
            });

            loaderBody(carouselUri.css, () =>
            {
                carouselUri.css = '';

                loaderBody(carouselUri.js, () =>
                {
                    carouselUri.js = '';

                    FetchIt.Message = {
                        success(message)
                        {
                            Swal.fire({
                                icon: 'success',
                                title: message,
                                //showConfirmButton: false,
                            });
                        },
                        error(message)
                        {
                            Swal.fire({
                                icon: 'error',
                                title: message,
                                //showConfirmButton: false,
                            });
                        },
                    };
                });
            }, 'link');
        });

    }, 'link');
});

const container = document.getElementById("reviewsCarousel");
const options = {
    dragFree: false,
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

new Carousel(container, options);

const sportcamps = {
    templates: 'assets/templates/',
    js: 'assets/templates/js/'
};