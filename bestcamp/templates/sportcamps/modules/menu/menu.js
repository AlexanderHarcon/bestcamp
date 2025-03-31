document.addEventListener('DOMContentLoaded', () => {
    const $ = (s) => document.querySelector(s);
    const $$ = (s) => [...document.querySelectorAll(s)];
    const pathImg = 'images/';
    const toggleState = (el, className, isOpen) => el.classList.toggle(className, isOpen);

    const elements = {
        destinationsWrapper: $('.menu__destinations-wrapper'),
        destinationsLink: $('.menu__headline-link[data-toggle="destinations"]'),
        destinations: $('.menu__destinations'),
        aboutItem: $('.menu__headline-item'),
        aboutSubmenu: $('.menu__headline-submenu'),
        aboutLink: $('.menu__headline-item .menu__headline-link'),
        customSelect: $('.custom-select'),
        customToggle: $('.custom-select__toggle'),
        customOptions: $('.custom-select__options'),
        customLabel: $('.custom-select__label'),
        customArrow: $('.custom-select__arrow img'),
        container: $('.container'),
        continentList: $('.continent-list'),
        continents: $$('.continent'),
        countryGroups: $$('.country-group'),
        backToMainMenuBtn: $('.menu__mobile-back--js'),
    };

    let activeContinent = null;
    let timeoutId = null;

    const activateContinent = (continentName) => {
        if (activeContinent === continentName) {
            if (isMobile() && !isTablet()) {
                elements.continents.forEach(c => c.classList.remove('active'));
                elements.countryGroups.forEach(g => g.style.display = 'none');
                activeContinent = null;
                return;
            }
            return;
        }
        elements.continents.forEach(c => c.classList.remove('active'));
        elements.countryGroups.forEach(g => g.style.display = 'none');
        const continent = $(`.continent[data-continent="${continentName}"]`);
        const group = $(`.country-group[data-continent="${continentName}"]`);
        continent.classList.add('active');
        // group.style.display = 'grid';
        group.style.display = 'block';
        activeContinent = continentName;

        if ((isTablet() || isDesktop()) && elements.container && group.scrollHeight > 0) {
            if (group.scrollHeight >= elements.continentList.scrollHeight) {
                let calculated = group.scrollHeight;
                elements.container.style.height = `${calculated}px`;
            }else{
                elements.container.style.height = `${elements.continentList.scrollHeight}px`;
            }
        }
    };

    const closeOthers = (keepOpen) => {
        clearTimeout(timeoutId);
        if (keepOpen !== 'destinations') {
            toggleState(elements.destinations, 'menu__destinations--active', false);
            toggleState(elements.destinationsLink, 'active', false);
        }
        if (keepOpen !== 'about') {
            toggleState(elements.aboutSubmenu, 'menu__submenu--active', false);
            toggleState(elements.aboutLink, 'active', false);
        }
        if (keepOpen !== 'language') {
            toggleState(elements.customSelect, 'custom-select--open', false);
        }
    };

    if (elements.destinationsWrapper && elements.destinations) {
        if (isMobile()) {
            elements.destinationsWrapper.addEventListener('click', (e) => {
                // clearTimeout(timeoutId);
                elements.destinations.classList.toggle('menu__destinations--active');
                elements.destinationsLink.classList.toggle('active');
                // toggleState(elements.destinations, 'menu__destinations--active', true);
                // toggleState(elements.destinationsLink, 'active', true);
                closeOthers('destinations');

                if (isTablet()) {
                    activateContinent(elements.continents[0].dataset.continent);
                }
            });
        }

        if (isDesktop()) {
            elements.destinationsWrapper.addEventListener('mouseover', (e) => {
                toggleState(elements.destinations, 'menu__destinations--active', true);
                toggleState(elements.destinationsLink, 'active', true);
                closeOthers('destinations');
                if (isTablet() || isDesktop()) {
                    activateContinent(elements.continents[0].dataset.continent);
                }
                e.stopPropagation();
            });

            elements.destinationsWrapper.addEventListener('mouseout', (e) => {
                if (
                    !elements.destinationsWrapper.contains(e.relatedTarget) &&
                    !elements.destinationsLink.contains(e.relatedTarget)
                ) {
                    toggleState(elements.destinations, 'menu__destinations--active', false);
                    toggleState(elements.destinationsLink, 'active', false);
                }
                e.stopPropagation();
            });
        }
    }

    // Back to main menu btn
    if (elements.backToMainMenuBtn) {
        elements.backToMainMenuBtn.addEventListener('click', (e) => {
            toggleState(elements.destinations, 'menu__destinations--active', false);
            toggleState(elements.destinationsLink, 'active', false);
            e.stopPropagation();
        });
    }

    // About Us
    if (elements.aboutItem && elements.aboutSubmenu && elements.aboutLink) {
        [elements.aboutItem, elements.aboutSubmenu].forEach(el => {
            if (!isMobile()) {
                el.addEventListener('mouseover', () => {
                    // clearTimeout(timeoutId);
                    toggleState(elements.aboutSubmenu, 'menu__submenu--active', true);
                    toggleState(elements.aboutLink, 'active', true);
                    closeOthers('about');
                });
                el.addEventListener('mouseout', (e) => {
                    if (!elements.aboutItem.contains(e.relatedTarget) && !elements.aboutSubmenu.contains(e.relatedTarget)) {
                        // timeoutId = setTimeout(() => {
                            toggleState(elements.aboutSubmenu, 'menu__submenu--active', false);
                            toggleState(elements.aboutLink, 'active', false);
                        // }, 200);
                    }
                });
            } else {
                el.addEventListener('click', () => {
                    let isOpen = !elements.aboutSubmenu.classList.contains('menu__submenu--active');
                    toggleState(elements.aboutSubmenu, 'menu__submenu--active', isOpen);
                    toggleState(elements.aboutLink, 'active', isOpen);
                });
            }
        });
    }

    // Custom Select (Language)
    if (elements.customSelect && elements.customOptions && elements.customToggle) {
        const updateArrowAndLabel = (isHover) => {
            elements.customLabel.style.color = isHover ? '#f7943d' : '#333';
        };

        elements.customSelect.addEventListener('mouseover', () => {
            clearTimeout(timeoutId);
            toggleState(elements.customSelect, 'custom-select--open', true);
            closeOthers('language');
        });
        elements.customSelect.addEventListener('mouseout', (e) => {
            if (!elements.customSelect.contains(e.relatedTarget)) {
                timeoutId = setTimeout(() => {
                    toggleState(elements.customSelect, 'custom-select--open', false);
                }, 200);
            }
        });

        elements.customToggle.addEventListener('mouseover', () => updateArrowAndLabel(true));
        elements.customToggle.addEventListener('mouseout', (e) => {
            if (!elements.customToggle.contains(e.relatedTarget)) updateArrowAndLabel(false);
        });

        elements.customOptions.addEventListener('click', (e) => {
            const option = e.target.closest('.custom-select__option');
            if (!option) return;
            e.preventDefault();
            const label = option.textContent;
            $$('.custom-select__option').forEach(opt => opt.classList.remove('custom-select__option--selected'));
            option.classList.add('custom-select__option--selected');
            elements.customLabel.textContent = label;
            toggleState(elements.customSelect, 'custom-select--open', false);
        });

        const initialLabel = elements.customLabel.textContent;
        $$('.custom-select__option').forEach(opt => {
            if (opt.textContent === initialLabel) opt.classList.add('custom-select__option--selected');
        });
    }

    // Continents
    if (elements.continents.length) {
        // if (isTablet() || isDesktop()) {
        //     activateContinent(elements.continents[0].dataset.continent);
        // }
        let eventName = isMobile() ? 'click' : 'mouseover';
        elements.continents.forEach(c => c.addEventListener(eventName, (e) => {
            activateContinent(c.dataset.continent);
            e.stopPropagation();
        }));
    }

    document.querySelectorAll('.country-group a').forEach(country => {
        country.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    });


    (function () {
        const mainmenubtn = document.getElementById('mainmenu-btn');

        //- Menu top Button mobile
        attachEvents(mainmenubtn, "click", function () {
            if (document.defaultView.getComputedStyle(mainmenubtn, null).display !== 'none') {
                document.body.classList.remove('menuopen-js');

                if (mainmenubtn.querySelector('input').checked)
                    document.body.classList.add('menuopen-js');
            }
        });
    }());

    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 1044;
    }

    function isDesktop() {
        return window.innerWidth >= 1044;
    }

    function isTablet() {
        return window.innerWidth >= 744 && window.innerWidth < 1044;
    }
});
