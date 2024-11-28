/**
 * < home.tpl
*/
//- Модальное окно для Формы обратной связи
attachEvents('.formrequest_js', "click", function()
{
    const FancyboxUri = {
        css: sportcamps.js + 'fancybox4016/fancybox.css',
        js: sportcamps.js + 'fancybox4016/fancybox.umd.js'
    };

    loaderBody(FancyboxUri.css, () =>
    {
        FancyboxUri.css = '';

        loaderBody(FancyboxUri.js, () =>
        {
            FancyboxUri.js = '';

            Fancybox.close();
            Fancybox.show([{
                src: "#request",
                animationEffect: "zoom-in-out",
                animationDuration: 400,
                type: "inline"
            }],{
                mainClass: 'popap_form',
                on: {
                    shouldClose: (fancybox, slide) =>
                    {
                        /*const request = document.getElementById('request');

                        setInterval(() =>
                        {
                            request.style.display = 'block';
                        }, 100);*/

                        //console.log('shouldClose');
                    }
                }
            });
        });
    }, 'link');
});

window.addEventListener('load', () =>
{
    const intl = {
        css: sportcamps.js + 'intl-tel-input/css/intlTelInput.min.css',
        js: sportcamps.js + 'intl-tel-input/js/intlTelInput.min.js',
        utils: sportcamps.js + 'intl-tel-input/js/utils.js'
    };
    const alert2_uri = {
        css: sportcamps.js + 'sweetalert2/sweetalert2.min.css',
        js: sportcamps.js + 'sweetalert2/sweetalert2.min.js'
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

            loaderBody(alert2_uri.css, () =>
            {
                alert2_uri.css = '';

                loaderBody(alert2_uri.js, () =>
                {
                    alert2_uri.js = '';

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

document.addEventListener('fetchit:before', (e) =>
{
    // Получим ссылку на форму, экземпляры FormData и FetchIt
    const { form, formData, fetchit } = e.detail;

    // Поищем в форме поле с телефоном
    const phoneInput = form.querySelector('[name="tel"]');

    // Если не нашли, то прерываем работу обработчика
    if (!phoneInput) return;

    // Получаем экземпляр поля intlTelInput
    const iti = window.intlTelInputGlobals.getInstance(phoneInput);

    //console.log(iti.getNumber());
    if (!iti.getNumber()) return;

    // Проверяем поле на валидность и если валидно...
    if (iti.isValidNumber())
    {
        // Приводим введенное пользователем значение в нормальный формат
        formData.set('tel', iti.getNumber());

        return; // И прерываем работу обработчика
    }

    // Иначе
    // Выводим сообщение об ошибке
    fetchit.setError('tel', 'Please enter a valid phone number');

    // Прерываем отправку формы
    e.preventDefault();
});

document.addEventListener('fetchit:after', (e) =>
{
    const { response } = e.detail;

    //- переопределяем сообщения при тотальной ошибке отправки почты
    if (response.message === 'The form has errors')
    {
        response.success = true;
        response.message = formerror; //- Сообщение об успехе отправки из шаблона
    }

    //console.log(response.success); // true|false
    //console.log(response.message); // Сообщение от сервера
    //console.log(response.data); // Данные от сервера
});

console.log('dev.formrequest.js');