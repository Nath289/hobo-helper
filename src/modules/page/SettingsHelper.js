const SettingsHelper = {
    cmds: 'preferences',
    staff: false,
    init: function() {

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
        headerContainer.style.position = 'relative';

        const titleDiv = document.createElement('div');
        titleDiv.innerHTML = "<h2 style='margin: 0; font-family: Arial, sans-serif; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;'>Hobo Helper Settings</h2>";
        headerContainer.appendChild(titleDiv);

        const versionStr = window.HoboHelperVersion || (typeof GM_info !== 'undefined' ? GM_info.script.version : 'Unknown');
        const isDev = versionStr !== 'Unknown' && versionStr.split('.').length > 2;

        const versionDiv = document.createElement('div');
        versionDiv.style.fontSize = '12px';
        versionDiv.style.color = '#666';
        versionDiv.style.marginTop = '5px';
        versionDiv.textContent = `v${versionStr}` + (isDev ? ' (Dev Build)' : '');
        headerContainer.appendChild(versionDiv);

        const updateBtn = document.createElement('button');
        updateBtn.className = 'btn';
        updateBtn.textContent = isDev ? 'Updates Disabled (Dev)' : 'Check for Updates';
        updateBtn.style.position = 'absolute';
        updateBtn.style.right = '10px';
        updateBtn.style.top = '10px';
        updateBtn.style.userSelect = 'none';
        updateBtn.style.webkitUserSelect = 'none';
        
        if (isDev) {
            updateBtn.disabled = true;
            updateBtn.style.opacity = '0.6';
            updateBtn.style.cursor = 'not-allowed';
            updateBtn.title = 'Update checking is disabled on local development builds.';
        } else {
            updateBtn.onclick = (e) => {
                e.preventDefault();
                updateBtn.textContent = 'Checking...';
                updateBtn.disabled = true;
                fetch('https://raw.githubusercontent.com/Nath289/hobo-helper/main/output/hobo-helper-latest.user.js?t=' + Date.now())
                    .then(r => r.text())
                    .then(text => {
                        const match = text.match(/@version\s+([\d\.]+)/);
                        if (match && match[1]) {
                            const latest = match[1];
                            if (versionStr !== 'Unknown' && latest !== versionStr) {
                                updateBtn.textContent = 'Update Available (' + latest + ')!';
                                updateBtn.style.backgroundColor = '#4CAF50';
                                updateBtn.style.color = 'white';
                                updateBtn.onclick = () => {
                                    window.location.href = 'https://github.com/Nath289/hobo-helper/raw/refs/heads/main/output/hobo-helper-latest.user.js';
                                };
                            } else {
                                updateBtn.textContent = 'Up to date!';
                                setTimeout(() => { updateBtn.textContent = 'Check for Updates'; }, 3000);
                            }
                        } else {
                            updateBtn.textContent = 'Error parsing version';
                            setTimeout(() => { updateBtn.textContent = 'Check for Updates'; }, 3000);
                        }
                    })
                    .catch(err => {
                        updateBtn.textContent = 'Failed to check';
                        setTimeout(() => { updateBtn.textContent = 'Check for Updates'; }, 3000);
                    })
                    .finally(() => {
                        updateBtn.disabled = false;
                    });
            };
        }
        headerContainer.appendChild(updateBtn);

        contentArea.appendChild(headerContainer);

        const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
        
        // Helper function for toggles
        const createToggle = (key, labelText, isGlobal = false, defaultValue = true) => {
            const container = document.createElement('div');
            container.style.marginBottom = '8px';
            container.style.paddingLeft = isGlobal ? '0' : '5px';
            container.style.display = 'flex';
            container.style.alignItems = 'center';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `hw_helper_${key}`;
            // default to true if undefined
            checkbox.checked = savedSettings[key] !== undefined ? savedSettings[key] : defaultValue;
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
            toast.textContent = ' (Saved! Reload to apply)';
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

        const createInput = (feature) => {
            const { key, label: labelText, type: inputType, defaultValue, width, description } = feature;
            const wrapper = document.createElement('div');
            wrapper.style.marginBottom = '8px';
            wrapper.style.paddingLeft = '5px';

            const container = document.createElement('div');
            container.style.display = 'flex';
            if (width === '100%') {
                container.style.flexDirection = 'column';
                container.style.alignItems = 'flex-start';
            } else {
                container.style.alignItems = 'center';
            }

            const label = document.createElement('label');
            label.htmlFor = `hw_helper_${key}`;
            label.innerHTML = `${labelText}: `;
            label.style.fontFamily = 'Arial, sans-serif';
            label.style.fontSize = '14px';
            label.style.marginRight = '8px';

            const toast = document.createElement('span');
            toast.textContent = ' (Saved! Reload to apply)';
            toast.style.color = 'green';
            toast.style.fontSize = '12px';
            toast.style.display = 'none';
            toast.style.marginLeft = '8px';

            if (width === '100%') {
                label.appendChild(toast);
            }

            const input = document.createElement('input');
            input.type = inputType;
            input.id = `hw_helper_${key}`;
            input.style.width = width || (inputType === 'number' ? '60px' : '150px');
            if (width === '100%') {
                input.style.boxSizing = 'border-box';
                input.style.marginTop = '4px';
            }
            input.value = savedSettings[key] !== undefined ? savedSettings[key] : defaultValue;
            input.style.border = '1px solid #ccc';
            input.style.borderRadius = '3px';
            input.style.padding = '2px 5px';

            let toastTimeout;
            input.addEventListener('input', (e) => {
                const settings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
                settings[key] = e.target.value;
                localStorage.setItem('hw_helper_settings', JSON.stringify(settings));
                
                toast.style.display = 'inline';
                clearTimeout(toastTimeout);
                toastTimeout = setTimeout(() => { toast.style.display = 'none'; }, 2000);
            });

            container.appendChild(label);
            container.appendChild(input);
            if (width !== '100%') {
                container.appendChild(toast);
            }
            wrapper.appendChild(container);

            if (description) {
                const desc = document.createElement('div');
                desc.innerHTML = description;
                desc.style.fontSize = '11px';
                desc.style.color = '#555';
                desc.style.marginTop = '4px';
                wrapper.appendChild(desc);
            }

            return wrapper;
        };

        const topDiv = document.createElement('div');
        topDiv.style.background = 'rgba(128, 128, 128, 0.05)';
        topDiv.style.border = '1px solid rgba(128, 128, 128, 0.2)';
        topDiv.style.borderRadius = '5px';
        topDiv.style.padding = '10px';
        topDiv.style.marginBottom = '20px';

        // Add global toggle
        topDiv.appendChild(createToggle('global_enabled', 'Hobo Helper (Global)', true));
        contentArea.appendChild(topDiv);

        const modsLabel = document.createElement('div');
        modsLabel.textContent = "Active Improvements:";
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

                const displayName = Modules[modName].name || modName.replace(/Helper$/, '').replace(/([a-z])([A-Z])/g, '$1 $2');

                const mainToggle = createToggle(modName, `<b>${displayName}</b>`);
                moduleBlock.appendChild(mainToggle);

                const moduleOptionsContainer = document.createElement('div');
                const mainCheckbox = mainToggle.querySelector('input[type="checkbox"]');

                const toggleSubFeatures = () => {
                    if (mainCheckbox) {
                        moduleOptionsContainer.style.display = mainCheckbox.checked ? 'block' : 'none';
                    }
                };

                toggleSubFeatures();
                if (mainCheckbox) {
                    mainCheckbox.addEventListener('change', toggleSubFeatures);
                }

                // Render sub-features if this module has them defined
                if (subFeatures[modName]) {
                    const subContainer = document.createElement('div');
                    subContainer.style.paddingLeft = '25px';
                    subContainer.style.marginTop = '8px';
                    subContainer.style.borderLeft = '2px solid #2196F3';
                    subFeatures[modName].forEach(feature => {
                        let el;
                        const strippedLabel = feature.label ? feature.label.replace(/^Enable\s+/i, '') : feature.key;
                        if (feature.type === 'number' || feature.type === 'text') {
                            el = createInput({ ...feature, label: strippedLabel });
                        } else {
                            el = createToggle(feature.key, strippedLabel, false, feature.defaultValue !== false);
                        }

                        if (feature.parent) {
                            // DOM insertion delay ensures parent elements are queryable
                            setTimeout(() => {
                                const parentCheckbox = document.getElementById(`hw_helper_${feature.parent}`);
                                if (parentCheckbox) {
                                    const containerDiv = el;
                                    const updateVisibility = () => {
                                        containerDiv.style.opacity = parentCheckbox.checked ? '1' : '0.4';
                                        containerDiv.style.pointerEvents = parentCheckbox.checked ? 'auto' : 'none';
                                    };
                                    parentCheckbox.addEventListener('change', updateVisibility);
                                    updateVisibility();
                                }
                            }, 50);
                        }

                        subContainer.appendChild(el);
                    });
                    moduleOptionsContainer.appendChild(subContainer);
                }

                // Custom settings for FoodHelper
                if (modName === 'FoodHelper') {
                    const foodContainer = document.createElement('div');
                    foodContainer.style.paddingLeft = '25px';
                    foodContainer.style.marginTop = '10px';

                    const label = document.createElement('b');
                    label.textContent = 'Crap Foods List:';
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
                        listContainer.textContent = 'No foods marked as crap.';
                    } else {
                        const ul = document.createElement('ul');
                        ul.style.margin = '0';
                        ul.style.paddingLeft = '20px';
                        crapList.forEach(food => {
                            const li = document.createElement('li');
                            const a = document.createElement('a');
                            a.href = '#';
                            a.textContent = '[x]';
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
                                    listContainer.textContent = 'No foods marked as crap.';
                                }
                            };
                            li.appendChild(a);
                            li.appendChild(document.createTextNode(food));
                            ul.appendChild(li);
                        });
                        listContainer.appendChild(ul);
                    }
                    foodContainer.appendChild(listContainer);
                    moduleOptionsContainer.appendChild(foodContainer);
                }

                // Custom settings for GangArmoryHelper
                if (modName === 'GangArmoryHelper') {
                    const armoryContainer = document.createElement('div');
                    armoryContainer.style.paddingLeft = '25px';
                    armoryContainer.style.marginTop = '10px';

                    const label = document.createElement('b');
                    label.textContent = 'Favorite Items:';
                    label.style.display = 'block';
                    label.style.marginBottom = '5px';
                    armoryContainer.appendChild(label);

                    const listContainer = document.createElement('div');
                    listContainer.style.background = 'rgba(0, 0, 0, 0.05)';
                    listContainer.style.padding = '10px';
                    listContainer.style.border = '1px solid rgba(128, 128, 128, 0.3)';
                    listContainer.style.borderRadius = '4px';
                    listContainer.style.maxWidth = '100%';

                    const renderFavList = () => {
                        listContainer.innerHTML = '';
                        const favList = JSON.parse(localStorage.getItem('GangArmory_Favorites') || '[]');
                        if (favList.length === 0) {
                            listContainer.textContent = 'No favorites selected.';
                        } else {
                            const ul = document.createElement('ul');
                            ul.style.margin = '0 0 10px 0';
                            ul.style.paddingLeft = '20px';
                            favList.forEach(fav => {
                                const li = document.createElement('li');
                                const a = document.createElement('a');
                                a.href = '#';
                                a.textContent = '[x]';
                                a.style.color = 'red';
                                a.style.textDecoration = 'none';
                                a.style.marginRight = '5px';
                                a.title = 'Remove ' + fav;
                                a.onclick = (e) => {
                                    e.preventDefault();
                                    let currentList = JSON.parse(localStorage.getItem('GangArmory_Favorites') || '[]');
                                    const updatedList = currentList.filter(f => f !== fav);
                                    localStorage.setItem('GangArmory_Favorites', JSON.stringify(updatedList));
                                    renderFavList();
                                };
                                li.appendChild(a);
                                li.appendChild(document.createTextNode(fav));
                                ul.appendChild(li);
                            });
                            listContainer.appendChild(ul);

                            const btnReset = document.createElement('input');
                            btnReset.type = 'button';
                            btnReset.value = 'Reset All Favorites';
                            btnReset.style.padding = '4px 8px';
                            btnReset.style.cursor = 'pointer';
                            btnReset.onclick = () => {
                                if(confirm('Are you sure you want to remove all favorites?')) {
                                    localStorage.removeItem('GangArmory_Favorites');
                                    renderFavList();
                                }
                            };
                            listContainer.appendChild(btnReset);
                        }
                    };
                    renderFavList();
                    armoryContainer.appendChild(listContainer);

                    const hiddenLabel = document.createElement('b');
                    hiddenLabel.textContent = 'Hidden Items:';
                    hiddenLabel.style.display = 'block';
                    hiddenLabel.style.margin = '15px 0 5px 0';
                    armoryContainer.appendChild(hiddenLabel);

                    const hiddenListContainer = document.createElement('div');
                    hiddenListContainer.style.background = 'rgba(0, 0, 0, 0.05)';
                    hiddenListContainer.style.padding = '10px';
                    hiddenListContainer.style.border = '1px solid rgba(128, 128, 128, 0.3)';
                    hiddenListContainer.style.borderRadius = '4px';
                    hiddenListContainer.style.maxWidth = '100%';

                    const renderHiddenList = () => {
                        hiddenListContainer.innerHTML = '';
                        const hiddenList = JSON.parse(localStorage.getItem('GangArmory_Hidden') || '[]');
                        if (hiddenList.length === 0) {
                            hiddenListContainer.textContent = 'No hidden items selected.';
                        } else {
                            const ul = document.createElement('ul');
                            ul.style.margin = '0 0 10px 0';
                            ul.style.paddingLeft = '20px';
                            hiddenList.forEach(fav => {
                                const li = document.createElement('li');
                                const a = document.createElement('a');
                                a.href = '#';
                                a.textContent = '[x]';
                                a.style.color = 'red';
                                a.style.textDecoration = 'none';
                                a.style.marginRight = '5px';
                                a.title = 'Remove ' + fav;
                                a.onclick = (e) => {
                                    e.preventDefault();
                                    let currentList = JSON.parse(localStorage.getItem('GangArmory_Hidden') || '[]');
                                    const updatedList = currentList.filter(f => f !== fav);
                                    localStorage.setItem('GangArmory_Hidden', JSON.stringify(updatedList));
                                    renderHiddenList();
                                };
                                li.appendChild(a);
                                li.appendChild(document.createTextNode(fav));
                                ul.appendChild(li);
                            });
                            hiddenListContainer.appendChild(ul);

                            const btnReset = document.createElement('input');
                            btnReset.type = 'button';
                            btnReset.value = 'Reset All Hidden';
                            btnReset.style.padding = '4px 8px';
                            btnReset.style.cursor = 'pointer';
                            btnReset.onclick = () => {
                                if(confirm('Are you sure you want to remove all hidden items?')) {
                                    localStorage.removeItem('GangArmory_Hidden');
                                    renderHiddenList();
                                }
                            };
                            hiddenListContainer.appendChild(btnReset);
                        }
                    };
                    renderHiddenList();
                    armoryContainer.appendChild(hiddenListContainer);

                    moduleOptionsContainer.appendChild(armoryContainer);
                }

                moduleBlock.appendChild(moduleOptionsContainer);

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
