const SettingsHelper = {
    init: function() {
        if (!window.location.search.endsWith('cmd=preferences')) return;

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        console.log('Settings Helper loaded for preferences page');
        
        // Add divider and title
        const headerContainer = document.createElement('div');
        headerContainer.style.textAlign = 'center';
        headerContainer.style.margin = '20px 0';
        headerContainer.style.padding = '10px';
        headerContainer.style.background = 'rgba(128, 128, 128, 0.1)';
        headerContainer.style.border = '1px solid rgba(128, 128, 128, 0.3)';
        headerContainer.style.borderRadius = '5px';

        const titleDiv = document.createElement('div');
        titleDiv.innerHTML = "<h2 style='margin: 0; font-family: Arial, sans-serif; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;'>Hobo Helper Settings</h2>";
        headerContainer.appendChild(titleDiv);
        contentArea.appendChild(headerContainer);

        const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
        
        // Helper function for toggles
        const createToggle = (key, labelText, isGlobal = false) => {
            const container = document.createElement('div');
            container.style.marginBottom = '8px';
            container.style.paddingLeft = isGlobal ? '0' : '5px';
            container.style.display = 'flex';
            container.style.alignItems = 'center';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `hw_helper_${key}`;
            // default to true if undefined
            checkbox.checked = savedSettings[key] !== false;
            checkbox.style.cursor = 'pointer';
            checkbox.style.transform = 'scale(1.2)';
            checkbox.style.marginRight = '8px';
            checkbox.style.accentColor = '#2196F3';

            const label = document.createElement('label');
            label.htmlFor = `hw_helper_${key}`;
            label.innerHTML = ` ${labelText}`;
            label.style.cursor = 'pointer';
            label.style.fontFamily = 'Arial, sans-serif';
            label.style.fontSize = '14px';

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

        const topDiv = document.createElement('div');
        topDiv.style.background = 'rgba(128, 128, 128, 0.05)';
        topDiv.style.border = '1px solid rgba(128, 128, 128, 0.2)';
        topDiv.style.borderRadius = '5px';
        topDiv.style.padding = '10px';
        topDiv.style.marginBottom = '20px';

        // Add global toggle
        topDiv.appendChild(createToggle('global_enabled', 'Enable Hobo Helper (Global)', true));
        contentArea.appendChild(topDiv);

        const modsLabel = document.createElement('div');
        modsLabel.innerText = "Active Modules:";
        modsLabel.style.fontWeight = 'bold';
        modsLabel.style.fontSize = '16px';
        modsLabel.style.marginBottom = '10px';
        modsLabel.style.borderBottom = '2px solid rgba(128, 128, 128, 0.3)';
        modsLabel.style.paddingBottom = '5px';
        contentArea.appendChild(modsLabel);

        const subFeatures = {};
        if (typeof Modules !== 'undefined') {
            Object.keys(Modules).forEach(modName => {
                if (Modules[modName].settings) {
                    subFeatures[modName] = Modules[modName].settings;
                }
            });
        }

        const gridContainer = document.createElement('div');
        gridContainer.style.display = 'flex';
        gridContainer.style.justifyContent = 'space-between';
        gridContainer.style.alignItems = 'flex-start';
        contentArea.appendChild(gridContainer);

        const col1 = document.createElement('div');
        col1.style.width = '48%';
        gridContainer.appendChild(col1);

        const col2 = document.createElement('div');
        col2.style.width = '48%';
        gridContainer.appendChild(col2);

        if (typeof Modules !== 'undefined') {
            const activeModules = Object.keys(Modules).filter(modName => {
                return modName !== 'SettingsHelper' && typeof Modules[modName].init === 'function';
            });

            activeModules.sort().forEach((modName) => {
                const moduleBlock = document.createElement('div');
                moduleBlock.style.marginBottom = '12px';
                moduleBlock.style.padding = '8px 10px';
                moduleBlock.style.background = 'rgba(128, 128, 128, 0.05)';
                moduleBlock.style.border = '1px solid rgba(128, 128, 128, 0.2)';
                moduleBlock.style.borderRadius = '6px';
                moduleBlock.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';

                moduleBlock.appendChild(createToggle(modName, `<b>Enable ${modName}</b>`));

                // Render sub-features if this module has them defined
                if (subFeatures[modName]) {
                    const subContainer = document.createElement('div');
                    subContainer.style.paddingLeft = '25px';
                    subContainer.style.marginTop = '8px';
                    subContainer.style.borderLeft = '2px solid #2196F3';
                    subFeatures[modName].forEach(feature => {
                        subContainer.appendChild(createToggle(feature.key, feature.label));
                    });
                    moduleBlock.appendChild(subContainer);
                }

                // Custom settings for FoodHelper
                if (modName === 'FoodHelper') {
                    const foodContainer = document.createElement('div');
                    foodContainer.style.paddingLeft = '25px';
                    foodContainer.style.marginTop = '10px';

                    const label = document.createElement('b');
                    label.innerText = 'Crap Foods List:';
                    label.style.display = 'block';
                    label.style.marginBottom = '5px';
                    foodContainer.appendChild(label);

                    const listContainer = document.createElement('div');
                    listContainer.style.background = 'rgba(0, 0, 0, 0.05)';
                    listContainer.style.padding = '10px';
                    listContainer.style.border = '1px solid rgba(128, 128, 128, 0.3)';
                    listContainer.style.borderRadius = '4px';
                    listContainer.style.maxWidth = '100%';

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
                    moduleBlock.appendChild(foodContainer);
                }

                // Manually balance columns: FoodHelper's large box goes left, the rest goes right.
                if (modName <= 'FoodHelper') {
                    col1.appendChild(moduleBlock);
                } else {
                    col2.appendChild(moduleBlock);
                }
            });
        }
    }
}
