document.addEventListener('DOMContentLoaded', function() {
    let activeContinent = null;

    const continents = document.querySelectorAll('.continent');

    const countryGroups = document.querySelectorAll('.country-group');

    function activateContinent(continentName) {
        continents.forEach(continent => continent.classList.remove('active'));
        countryGroups.forEach(group => group.style.display = 'none');

        const continent = document.querySelector(`.continent[data-continent="${continentName}"]`);
        if (continent) continent.classList.add('active');

        const currentCountryGroup = document.querySelector(`.country-group[data-continent="${continentName}"]`);
        if (currentCountryGroup) {
            currentCountryGroup.style.display = 'block';
        }

        activeContinent = continentName;
    }

    continents.forEach(continent => {
        continent.addEventListener('click', function() {
            if (activeContinent === continent.dataset.continent) {
                return;
            }

            activateContinent(continent.dataset.continent);
        });
    });

    if (continents.length > 0) {
        activateContinent(continents[0].dataset.continent);
    }
});
