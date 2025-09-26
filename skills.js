document.addEventListener('DOMContentLoaded', function () {
    let allSkills = [];
    let filteredSkills = [];
    let isSortAscending = false;

    fetch('data/skills.json')
        .then(response => response.json())
        .then(skills => {
            allSkills = skills;
            filteredSkills = allSkills;
            sortAndRenderSkills();
        });

    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', function (event) {
        const searchQuery = event.target.value.toLowerCase();
        filteredSkills = allSkills.filter(skill => {
            return skill.name.toLowerCase().includes(searchQuery) ||
                skill.description_short.toLowerCase().includes(searchQuery) ||
                skill.description_long.toLowerCase().includes(searchQuery) ||
                skill.domain.some(d => d.toLowerCase().includes(searchQuery)) ||
                skill.sub_domains.some(sd => sd.toLowerCase().includes(searchQuery)) ||
                skill.industries.some(i => i.toLowerCase().includes(searchQuery));
        });
        sortAndRenderSkills();
    });

    const sortButton = document.getElementById('sort-button');
    sortButton.addEventListener('click', function () {
        isSortAscending = !isSortAscending;
        sortAndRenderSkills();

        const sortIcon = sortButton.querySelector('i');
        sortIcon.className = isSortAscending ? 'fas fa-sort-alpha-up' : 'fas fa-sort-alpha-down';
    });

    function sortAndRenderSkills() {
        const sortedSkills = [...filteredSkills].sort((a, b) => {
            if (isSortAscending) {
                return a.name.localeCompare(b.name);
            } else {
                return b.name.localeCompare(a.name);
            }
        });
        renderSkills(sortedSkills);
    }

    function renderSkills(skills) {
        const skillsSection = document.getElementById('skills-section');
        skillsSection.innerHTML = ''; // Clear existing skills

        if (skills.length === 0) {
            skillsSection.innerHTML = `
                <div class="col-span-3 text-center">
                    <h2 class="text-2xl font-bold text-gray-700">No results found</h2>
                    <p class="text-gray-500">Try searching for something else.</p>
                </div>
            `;
            return;
        }

        skills.forEach(skill => {
            const cardWrapper = document.createElement('div');
            cardWrapper.className = 'flip-card';

            const cardInner = document.createElement('div');
            cardInner.className = 'flip-card-inner';

            const skillImage = skill.cover ? skill.cover : 'https://via.placeholder.com/300x200.png?text=Skill';

            cardInner.innerHTML = `
                <div class="flip-card-front relative">
                    <img src="${skillImage}" alt="${skill.name}" class="w-full h-full object-cover rounded-lg">
                    <div class="absolute inset-0 bg-black opacity-40 rounded-lg"></div>
                    <div class="absolute bottom-0 left-0 p-4">
                        <h3 class="text-2xl font-bold text-white">${skill.name}</h3>
                    </div>
                </div>
                <div class="flip-card-back bg-white p-6 overflow-auto">
                    <div class="flip-card-back-content">
                        <h4 class="text-xl font-semibold mb-2">${skill.name}</h4>
                        <p class="text-gray-700 mb-2"><strong>Short Description:</strong> ${skill.description_short}</p>
                        <p class="text-gray-700 mb-2"><strong>Long Description:</strong> ${skill.description_long}</p>
                        <p class="text-gray-700 mb-2"><strong>Domain:</strong> ${skill.domain.join(', ')}</p>
                        <p class="text-gray-700 mb-2"><strong>Sub-domains:</strong> ${skill.sub_domains.join(', ')}</p>
                        <p class="text-gray-700 mb-2"><strong>Industries:</strong> ${skill.industries.join(', ')}</p>
                    </div>
                </div>
            `;

            cardWrapper.appendChild(cardInner);
            skillsSection.appendChild(cardWrapper);

            cardWrapper.addEventListener('click', function () {
                cardWrapper.classList.toggle('flipped');
            });
        });
    }
});