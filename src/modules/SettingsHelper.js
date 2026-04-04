const SettingsHelper = {
    init: function() {
        if (!window.location.search.endsWith('cmd=preferences')) return;

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        console.log('Settings Helper loaded for preferences page');
        
        // Add divider and title
        const hr = document.createElement('hr');
        hr.width = "300";
        contentArea.appendChild(document.createElement('br'));
        contentArea.appendChild(hr);
        contentArea.appendChild(document.createElement('br'));

        const titleDiv = document.createElement('div');
        titleDiv.align = "center";
        titleDiv.innerHTML = "<b><font size=\"3\">Hobo Helper Settings</font></b>";
        contentArea.appendChild(titleDiv);
        contentArea.appendChild(document.createElement('br'));

        const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
        
        // Helper function for toggles
        const createToggle = (key, labelText, isGlobal = false) => {
            const container = document.createElement('div');
            container.style.marginBottom = '5px';
            container.style.paddingLeft = isGlobal ? '0' : '20px';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `hw_helper_${key}`;
            // default to true if undefined
            checkbox.checked = savedSettings[key] !== false;
            
            const label = document.createElement('label');
            label.htmlFor = `hw_helper_${key}`;
            label.innerHTML = ` ${labelText}`;
            if (isGlobal) label.style.fontWeight = 'bold';

            const toast = document.createElement('span');
            toast.innerText = ' (Saved! Reload to apply)';
            toast.style.color = 'green';
            toast.style.fontSize = '12px';
            toast.style.display = 'none';
            label.appendChild(toast);

            let toastTimeout;
            checkbox.addEventListener('change', (e) => {
                const settings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
                settings[key] = e.target.checked;
                localStorage.setItem('hw_helper_settings', JSON.stringify(settings));
                
                // Show saved toast or reload prompt
                toast.style.display = 'inline';
                clearTimeout(toastTimeout);
                toastTimeout = setTimeout(() => { toast.style.display = 'none'; }, 2000);
            });

            container.appendChild(checkbox);
            container.appendChild(label);
            return container;
        };

        // Add global toggle
        contentArea.appendChild(createToggle('global_enabled', 'Enable Hobo Helper (Global)', true));
        
        contentArea.appendChild(document.createElement('br'));
        const modsLabel = document.createElement('b');
        modsLabel.innerText = "Active Modules:";
        contentArea.appendChild(modsLabel);
        contentArea.appendChild(document.createElement('br'));

        const subFeatures = {
            'LivingAreaHelper': [
                { key: 'LivingAreaHelper_StatRatioTracker', label: 'Stat Ratio Tracker' },
                { key: 'LivingAreaHelper_AlwaysShowSpecialItem', label: 'Always Show Special Item' },
                { key: 'LivingAreaHelper_MixerLink', label: 'Mixer Link' },
                { key: 'LivingAreaHelper_WinPercentageCalc', label: 'Win Percentage Calc' }
            ],
            'BernardsMansionHelper': [
                { key: 'BernardsMansionHelper_BasementMap', label: 'Basement Map' }
            ],
            'LockoutHelper': [
                { key: 'LockoutHelper_ShowChangelog', label: 'Show Changelog' }
            ],
            'MessageBoardHelper': [
                { key: 'MessageBoardHelper_CtrlEnter', label: 'Ctrl+Enter to Post' }
            ],
            'BankHelper': [
                { key: 'BankHelper_5FightersLunches', label: '5 Fighter\'s Lunches Goal' }
            ]
        };

        if (typeof Modules !== 'undefined') {
            Object.keys(Modules).forEach(modName => {
                if (modName === 'SettingsHelper') return; 
                if (typeof Modules[modName].init !== 'function') return; // Hide data objects like DrinksData / ChangelogData

                contentArea.appendChild(createToggle(modName, `Enable ${modName}`));

                // Render sub-features if this module has them defined
                if (subFeatures[modName]) {
                    const subContainer = document.createElement('div');
                    subContainer.style.paddingLeft = '40px';
                    subFeatures[modName].forEach(feature => {
                        subContainer.appendChild(createToggle(feature.key, feature.label));
                    });
                    contentArea.appendChild(subContainer);
                }

                // Custom settings for FoodHelper
                if (modName === 'FoodHelper') {
                    const foodContainer = document.createElement('div');
                    foodContainer.style.paddingLeft = '40px';
                    foodContainer.style.marginTop = '10px';

                    const label = document.createElement('b');
                    label.innerText = 'Crap Foods List:';
                    foodContainer.appendChild(label);
                    foodContainer.appendChild(document.createElement('br'));

                    const listContainer = document.createElement('div');
                    listContainer.style.marginTop = '5px';
                    listContainer.style.background = '#f1f1f1';
                    listContainer.style.padding = '10px';
                    listContainer.style.border = '1px solid #ccc';
                    listContainer.style.maxWidth = '300px';

                    const crapList = JSON.parse(localStorage.getItem('hw_helper_food_crap') || '[]');
                    if (crapList.length === 0) {
                        listContainer.innerText = 'No foods marked as crap.';
                    } else {
                        const ul = document.createElement('ul');
                        ul.style.margin = '0';
                        ul.style.paddingLeft = '20px';
                        crapList.forEach(food => {
                            const li = document.createElement('li');
                            const a = document.createElement('a');
                            a.href = '#';
                            a.innerText = '[x]';
                            a.style.color = 'red';
                            a.style.textDecoration = 'none';
                            a.style.marginRight = '5px';
                            a.title = 'Remove from Crap list';
                            a.onclick = (e) => {
                                e.preventDefault();
                                let currentList = JSON.parse(localStorage.getItem('hw_helper_food_crap') || '[]');
                                const updatedList = currentList.filter(f => f !== food);
                                localStorage.setItem('hw_helper_food_crap', JSON.stringify(updatedList));
                                li.remove();
                                if (updatedList.length === 0) {
                                    listContainer.innerText = 'No foods marked as crap.';
                                }
                            };
                            li.appendChild(a);
                            li.appendChild(document.createTextNode(food));
                            ul.appendChild(li);
                        });
                        listContainer.appendChild(ul);
                    }
                    foodContainer.appendChild(listContainer);
                    contentArea.appendChild(foodContainer);
                }
            });
        }
    }
}
