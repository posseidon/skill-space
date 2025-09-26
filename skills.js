document.addEventListener('DOMContentLoaded', function () {
    fetch('data/skills.json')
        .then(response => response.json())
        .then(skills => {
            const skillsContainer = document.getElementById('skills-container');
            for (const profile in skills) {
                const profileDiv = document.createElement('div');
                profileDiv.className = 'mb-8';
                const profileTitle = document.createElement('h2');
                profileTitle.className = 'text-2xl font-bold mb-4';
                profileTitle.textContent = profile;
                profileDiv.appendChild(profileTitle);

                for (const category in skills[profile]) {
                    const categoryDiv = document.createElement('div');
                    categoryDiv.className = 'mb-4';
                    const categoryTitle = document.createElement('h3');
                    categoryTitle.className = 'text-xl font-bold mb-2';
                    categoryTitle.textContent = category;
                    categoryDiv.appendChild(categoryTitle);
                    const skillsList = document.createElement('ul');
                    skillsList.className = 'list-disc list-inside';
                    skills[profile][category].forEach(skill => {
                        const li = document.createElement('li');
                        li.textContent = skill;
                        skillsList.appendChild(li);
                    });
                    categoryDiv.appendChild(skillsList);
                    profileDiv.appendChild(categoryDiv);
                }
                skillsContainer.appendChild(profileDiv);
            }
        });
});