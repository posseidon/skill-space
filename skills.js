document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-dropdown');
    const searchResults = document.getElementById('search-results');
    const skillCard = document.getElementById('skill-card');
    const skillName = document.getElementById('skill-name');
    const shortDescription = document.getElementById('short-description');
    const skillDescription = document.getElementById('skill-description');
    const dropdownButton = document.getElementById('dropdown-button');
    const dropdown = document.getElementById('dropdown');
    let skills = [];
    let profiles = [];
    let paths = [];
    let searchCategory = 'Skill'; // Default search category
    let currentSkill = null;


    // Fetch skills data

    // Fetch skills data
    fetch('data/skills.json')
        .then(response => response.json())
        .then(data => {
            skills = data;
        });

    // Fetch profiles data
    fetch('data/profiles.json')
        .then(response => response.json())
        .then(data => {
            profiles = data;
        });

    // Fetch paths data
    fetch('data/paths.json')
        .then(response => response.json())
        .then(data => {
            paths = data;
        });

    // Dropdown category selection
    dropdown.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            searchCategory = e.target.textContent;
            dropdownButton.textContent = searchCategory;
            dropdown.classList.add('hidden');
            searchInput.dispatchEvent(new Event('input'));
        }
    });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm.length === 0) {
            searchResults.classList.add('hidden');
            return;
        }

        let results = [];
        if (searchCategory === 'Skill') {
            results = skills.filter(skill => skill.name.toLowerCase().includes(searchTerm));
        } else if (searchCategory === 'Profile') {
            results = profiles.filter(profile => profile.name.toLowerCase().includes(searchTerm));
        } else if (searchCategory === 'Path') {
            results = paths.filter(path => path.name.toLowerCase().includes(searchTerm));
        }

        displayResults(results);
    });

    function displaySkill(skill) {
        if (currentSkill && currentSkill.name === skill.name) {
            return;
        }
        currentSkill = skill;

        skillName.textContent = skill.name;
        shortDescription.textContent = skill.description_short;
        skillDescription.textContent = skill.description_long;

        const skillDomain = document.getElementById('skill-domain');
        skillDomain.innerHTML = '<span class="text-lg font-semibold text-gray-900 dark:text-white mr-2">Domain:</span>';
        const domainContainer = document.createElement('div');
        domainContainer.classList.add('flex', 'flex-wrap');
        if (skill.domain) {
            skill.domain.forEach((relatedSkill) => {
                domainContainer.appendChild(createBadge(relatedSkill));
            });
        }

        if (skill.sub_domains) {
            skill.sub_domains.forEach((subDomain) => {
                domainContainer.appendChild(createBadge(subDomain));
            });
        }
        skillDomain.appendChild(domainContainer);

        const skillMarket = document.getElementById('skill-market');
        skillMarket.innerHTML = '<span class="text-lg font-semibold text-gray-900 dark:text-white mr-2">Market:</span>';
        skillMarket.appendChild(createRating('Demand', skill.demand));
        skillMarket.appendChild(createRating('Trend', skill.trend));
        skillMarket.appendChild(createRating('Future Need', skill.future_need));


        // Clear and set industries
        const skillIndustries = document.getElementById('skill-industries');
        skillIndustries.innerHTML = '<span class="text-lg font-semibold text-gray-900 dark:text-white mr-2">Industries:</span>';
        if (skill.industries) {
            const industriesContainer = document.createElement('div');
            industriesContainer.classList.add('flex', 'flex-wrap');
            skill.industries.forEach((industry) => {
                industriesContainer.appendChild(createBadge(industry));
            });
            skillIndustries.appendChild(industriesContainer);
        }

        // Clear and set resources
        const skillResources = document.getElementById('skill-resources');
        skillResources.innerHTML = '<span class="text-lg font-semibold text-gray-900 dark:text-white mr-2">Resources:</span>';
        if (skill.resources) {
            const resourceLink = document.createElement('a');
            resourceLink.href = skill.resources;
            resourceLink.textContent = skill.resources;
            resourceLink.target = '_blank';
            resourceLink.classList.add('text-blue-600', 'dark:text-blue-500', 'hover:underline');
            skillResources.appendChild(resourceLink);
        }

        skillCard.classList.remove('hidden');
    }

    function createRating(label, value) {
        const ratingContainer = document.createElement('div');
        ratingContainer.classList.add('flex', 'items-center', 'mt-2');

        const labelSpan = document.createElement('span');
        labelSpan.classList.add('text-sm', 'font-medium', 'text-gray-900', 'dark:text-white', 'mr-2');
        labelSpan.textContent = label + ':';
        ratingContainer.appendChild(labelSpan);

        const ratingValue = document.createElement('span');
        ratingValue.classList.add('text-sm', 'font-medium');

        switch (value) {
            case 'low':
                ratingValue.classList.add('text-red-500');
                break;
            case 'medium':
                ratingValue.classList.add('text-yellow-500');
                break;
            case 'high':
                ratingValue.classList.add('text-green-500');
                break;
        }

        ratingValue.textContent = value;
        ratingContainer.appendChild(ratingValue);

        return ratingContainer;
    }

    function createBadge(text, color = 'blue') {
        const badge = document.createElement('span');
        badge.className = `bg-${color}-100 text-${color}-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-${color}-900 dark:text-${color}-300`;
        badge.textContent = text;
        return badge;
    }

    function displayProfile(profile) {
        skillName.textContent = profile.name;
        skillDescription.textContent = profile.title;
    }

    function displayPath(path) {
        skillName.textContent = path.name;
        skillDescription.textContent = path.description;
    }

    function displayResults(results) {
        searchResults.innerHTML = '';
        if (results.length > 0) {
            results.forEach(result => {
                const resultItem = document.createElement('a');
                resultItem.href = '#';
                resultItem.classList.add('block', 'px-4', 'py-2', 'text-sm', 'text-gray-700', 'hover:bg-gray-100');
                resultItem.textContent = result.name;
                resultItem.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (searchCategory === 'Skill') {
                        displaySkill(result);
                    } else if (searchCategory === 'Profile') {
                        displayProfile(result);
                    } else if (searchCategory === 'Path') {
                        displayPath(result);
                    }
                    searchResults.classList.add('hidden');
                });
                searchResults.appendChild(resultItem);
            });
            searchResults.classList.remove('hidden');
        } else {
            searchResults.classList.add('hidden');
        }
    }


    document.addEventListener('click', function (event) {
        const isClickInside = searchResults.contains(event.target) || searchInput.contains(event.target);
        if (!isClickInside) {
            searchResults.classList.add('hidden');
        }
    });
});