document.addEventListener('DOMContentLoaded', function() {
    // Утиліти для селекторів
    const $ = (s) => document.querySelector(s);
    const $$ = (s) => [...document.querySelectorAll(s)];

    // Отримуємо всі елементи з класом menu__dropdown
    const dropdowns = document.querySelectorAll('.menu__dropdown');

    // Об'єкт для елементів
    const elements = {
        mainMenuBtn: $('#mainmenu-btn'),
        destinations: $('.menu__destinations'),
        customSelect: $('.custom-select'),
        customToggle: $('.custom-select__toggle'),
        customOptions: $('.custom-select__options'),
        customLabel: $('.custom-select__label'),
        container: $('.container'), // Додано container
        continentList: $('.continent-list'),
        continents: $$('.continent'),
        countryGroups: $$('.mcountry-group'),
        backToMainMenuBtn: $('.menu__mobile-back--js'),
    };

    // Змінна для відстеження активного континенту
    let activeContinent = null;

    // Функція для закриття всіх відкритих submenu
    function closeAllSubmenus() {
        dropdowns.forEach(dropdown => {
            const siblingSubmenu = dropdown.nextElementSibling;
            if (siblingSubmenu && siblingSubmenu.classList.contains('menu__submenu')) {
                siblingSubmenu.style.display = 'none';
                dropdown.classList.remove('active'); // Прибираємо клас active
            }
        });
        // Закриваємо кастомний селект, якщо відкритий
        if (elements.customSelect) {
            elements.customSelect.classList.remove('custom-select--open');
            if (elements.customLabel) {
                elements.customLabel.style.color = '#333';
            }
        }
        // Скидаємо активний континент
        if (elements.continents.length) {
            elements.continents.forEach(c => c.classList.remove('active'));
            elements.countryGroups.forEach(g => g.style.display = 'none');
            activeContinent = null;
        }
        // Скидаємо висоту контейнера
        if (elements.container) {
            elements.container.style.height = '';
        }
    }

    // Обробник кліку по dropdown
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Знаходимо наступний елемент з класом menu__submenu
            const siblingSubmenu = this.nextElementSibling;

            if (siblingSubmenu && siblingSubmenu.classList.contains('menu__submenu')) {
                // Перевіряємо, чи видимий елемент
                const isVisible = siblingSubmenu.style.display === 'block';

                // Закриваємо всі submenu та інші компоненти
                closeAllSubmenus();

                // Якщо елемент був невидимий, відкриваємо його
                if (!isVisible) {
                    siblingSubmenu.style.display = 'block';
                    this.classList.add('active'); // Додаємо клас active до dropdown
                    // Активуємо перший континент для десктопів/планшетів
                    if ((isTablet() || isDesktop()) && elements.continents.length) {
                        activateContinent(elements.continents[0].dataset.continent);
                    }
                }
            }
        });
    });

    // Закриття submenu при кліку поза меню
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.menu__dropdown') &&
            !e.target.closest('.menu__submenu') &&
            !e.target.closest('.custom-select')) {
            closeAllSubmenus();
        }
    });

    // Обробник для кнопки "Back to Main Menu"
    if (elements.backToMainMenuBtn) {
        elements.backToMainMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const parentSubmenu = this.closest('.menu__submenu');
            if (parentSubmenu) {
                parentSubmenu.style.display = 'none';
                const relatedDropdown = parentSubmenu.previousElementSibling;
                if (relatedDropdown && relatedDropdown.classList.contains('menu__dropdown')) {
                    relatedDropdown.classList.remove('active'); // Прибираємо клас active
                }
            }
        });
    }

    // Функціонал головного меню (бургер-меню)
    if (elements.mainMenuBtn) {
        elements.mainMenuBtn.addEventListener('click', function() {
            const isChecked = this.querySelector('input')?.checked;
            document.body.classList.toggle('menuopen-js', isChecked);
            if (!isChecked) {
                closeAllSubmenus(); // Закриваємо всі підменю при закритті бургер-меню
            }
        });
    }

    // Функціонал кастомного селекта
    if (elements.customSelect && elements.customToggle && elements.customOptions) {
        // Оновлення стилів мітки
        const updateLabelStyle = (isOpen) => {
            if (elements.customLabel) {
                elements.customLabel.style.color = isOpen ? '#f7943d' : '#333';
            }
        };

        // Відкриття/закриття селекта
        elements.customToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = !elements.customSelect.classList.contains('custom-select--open');
            elements.customSelect.classList.toggle('custom-select--open', isOpen);
            updateLabelStyle(isOpen);
            // Закриваємо submenu, але не селект
            dropdowns.forEach(dropdown => {
                const siblingSubmenu = dropdown.nextElementSibling;
                if (siblingSubmenu && siblingSubmenu.classList.contains('menu__submenu')) {
                    siblingSubmenu.style.display = 'none';
                    dropdown.classList.remove('active');
                }
            });
        });

        // Вибір оп HANDLINGції
        elements.customOptions.addEventListener('click', function(e) {
            const option = e.target.closest('.custom-select__option');
            if (!option) return;
            e.preventDefault();
            e.stopPropagation();
            const label = option.textContent;
            $$('.custom-select__option').forEach(opt => opt.classList.remove('custom-select__option--selected'));
            option.classList.add('custom-select__option--selected');
            if (elements.customLabel) {
                elements.customLabel.textContent = label;
            }
            elements.customSelect.classList.remove('custom-select--open');
            updateLabelStyle(false);
        });

        // Ініціалізація вибраної опції
        if (elements.customLabel) {
            const initialLabel = elements.customLabel.textContent;
            $$('.custom-select__option').forEach(opt => {
                if (opt.textContent === initialLabel) {
                    opt.classList.add('custom-select__option--selected');
                }
            });
        }
    }

    // Функціонал континентів і країн
    function activateContinent(continentName) {
        if (activeContinent === continentName && isMobile() && !isTablet()) {
            // На мобільних закриваємо при повторному кліку
            elements.continents.forEach(c => c.classList.remove('active'));
            elements.countryGroups.forEach(g => {
                g.style.display = 'none';
                g.style.minHeight = ''; // Скидаємо minHeight
            });
            activeContinent = null;
            if (elements.container) {
                elements.container.style.height = ''; // Скидаємо висоту контейнера
            }
            return;
        }
        // Деактивуємо попередні
        elements.continents.forEach(c => c.classList.remove('active'));
        elements.countryGroups.forEach(g => {
            g.style.display = 'none';
            g.style.minHeight = ''; // Скидаємо minHeight
        });
        // Активуємо вибраний
        const continent = $(`.continent[data-continent="${continentName}"]`);
        const group = $(`.mcountry-group[data-continent="${continentName}"]`);
        if (continent && group) {
            continent.classList.add('active');
            group.style.display = 'block';
            activeContinent = continentName;

            // Додано функціонал адаптації висоти для планшетів і десктопів
            if ((isTablet() || isDesktop()) && elements.container && group.scrollHeight > 0) {
                if (group.scrollHeight >= elements.continentList.scrollHeight) {
                    let calculated = group.scrollHeight;
                    elements.container.style.height = `${calculated}px`;
                } else {
                    elements.container.style.height = `${elements.continentList.scrollHeight}px`;
                    group.style.minHeight = `${elements.continentList.scrollHeight}px`;
                }
            }
        }
    }

    if (elements.continents.length) {
        elements.continents.forEach(continent => {
            continent.addEventListener('click', function(e) {
                e.stopPropagation();
                activateContinent(this.dataset.continent);
            });
        });
    }

    // Запобігаємо закриттю меню при кліку по країнах
    $$('.mcountry-group a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // Адаптивність
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 744;
    }

    function isTablet() {
        return window.innerWidth >= 744 && window.innerWidth < 1044;
    }

    function isDesktop() {
        return window.innerWidth >= 1044;
    }
});