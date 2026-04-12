const RatsHelper = {
    cmds: 'rats',
    settings: [
        { key: 'RatsHelper_NewsFilter', label: 'Rat News Filter' },
        { key: 'RatsHelper_ExpBar', label: 'Show Exp Progress Indicator' },
        { key: 'RatsHelper_ActionButtons', label: 'Convert Action Links to Buttons' }
    ],
    init: function() {
        const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
        const enableNewsFilter = savedSettings['RatsHelper_NewsFilter'] !== false;
        const enableExpBar = savedSettings['RatsHelper_ExpBar'] !== false;
        const enableActionButtons = savedSettings['RatsHelper_ActionButtons'] !== false;

        const style = document.createElement('style');
        style.textContent = `
            .upg-imgs.repositioned {
                position: static !important;
                display: flex !important;
                justify-content: center !important;
                margin-top: 4px;
                width: 100% !important;
                height: auto !important;
            }
            .upg-imgs.repositioned .upg-imgs2 {
                position: static !important;
                display: flex !important;
                flex-wrap: wrap;
                justify-content: center;
                gap: 2px;
                width: 100% !important;
            }
            .upg-imgs.repositioned .upgImg {
                position: static !important;
                margin: 0 !important;
            }
            /* Styling for the pill buttons */
            .pill-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0 8px;
                height: 24px;
                border-radius: 12px;
                font-size: 12px;
                line-height: 1;
                cursor: pointer;
                user-select: none;
                -webkit-user-select: none;
                transition: background 0.3s, transform 0.3s;
            }
            .pill-button:hover {
                background: #e0e7ff;
            }
            .pill-button:active {
                transform: scale(0.95);
            }
            .pill-button.disabled {
                opacity: 0.5;
                pointer-events: none;
            }
            
            /* Native Button Styles to convert Rat Options */
            .rat-opts a.btn {
                -webkit-font-smoothing: antialiased;
                color: #636363;
                background: #ddd;
                font-weight: bold;
                text-decoration: none;
                padding: 3px 12px;
                border-radius: 3px;
                border: 0;
                cursor: pointer;
                margin: 2px 2px;
                -webkit-appearance: none;
                display: inline-block;
                line-height: 1em;
            }

            .rat-opts a.btn:hover {
                color: #fff;
                background: #1b9eff;
                box-shadow: 0 0 0 rgba(0,0,0,.4);
                animation: pulse 1.5s infinite;
            }

            .rat-opts {
                list-style: none;
                padding: 0;
                margin: 2px 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2px;
            }

            /* Feeding UI Button styles */
            .feed-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                width: 80px;
                min-height: 65px;
                text-decoration: none;
                padding: 4px 4px 14px 4px;
                background: #fff;
                border: 1px solid #c0c0c0;
                border-radius: 4px;
                color: #000;
                transition: transform 0.1s, box-shadow 0.1s;
                -webkit-font-smoothing: antialiased;
                font-family: Arial, sans-serif;
                margin: 2px;
                cursor: pointer;
                user-select: none;
                -webkit-user-select: none;
                position: relative;
            }
            a.feed-btn:hover {
                border-color: #888;
                box-shadow: 0 0 4px rgba(0,0,0,.2);
                transform: scale(1.03);
            }
            div.feed-btn.meat {
                background: #ffe6e6;
                border: 1px solid #ffb3b3;
                box-shadow: none;
                cursor: not-allowed;
                color: #999;
            }

            /* Main Rat Actions container */
            .rat-actions-container {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                gap: 10px;
                margin: 15px auto;
                padding: 12px;
                background: #f8f9fc;
                border: 1px solid #d3e0f0;
                border-radius: 6px;
                max-width: 800px;
            }
            .rat-actions-container a.btn {
                margin: 0;
                font-size: 13px;
                padding: 6px 14px;
            }
            .rat-actions-container a.btn.news-on {
                color: #fff;
                background: #5cb85c;
                border: 1px solid #4cae4c;
            }
            .rat-actions-container a.btn.news-off {
                color: #fff;
                background: #d9534f;
                border: 1px solid #d43f3a;
            }
        `;
        document.head.appendChild(style);

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        console.log('[Hobo Helper] Initializing RatsHelper');

        // Reposition upgrade images below the main rat images safely
        const ratCells = document.querySelectorAll('.ratcell');
        ratCells.forEach(cell => {
            const upg = cell.querySelector('.upg-imgs');
            if (upg) {
                upg.classList.add('repositioned');
                cell.appendChild(upg); // Moves it directly beneath the .ratimg container
            }
        });

        // Convert Rat Options links (Upgrade, Rename, Abandon) to Buttons
        const ratOptsLists = document.querySelectorAll('.rat-opts');
        ratOptsLists.forEach(ul => {
            const lists = ul.querySelectorAll('li');
            lists.forEach(li => {
                const link = li.querySelector('a');
                if (link) {
                    // Remove surrounding text nodes like '[' and ']'
                    Array.from(li.childNodes).forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            node.remove();
                        }
                    });

                    // Maintain "Abandon" text color if it's currently inside a <font color="red">
                    const fontTag = link.querySelector('font');
                    if (fontTag || link.textContent.includes('Abandon')) {
                        link.style.color = '#d9534f'; // Maintain red text visually on the button to override #636363
                        if (fontTag) {
                            link.textContent = fontTag.textContent; // pull text out of font tag
                        }
                    }
                    link.classList.add('btn');
                }
            });
        });

        if (enableNewsFilter) {
            this.initNewsFilter(contentArea);
        }
        
        if (enableExpBar) {
            this.initExpBars(contentArea);
        }

        if (enableActionButtons) {
            this.initActionButtons(contentArea);
        }

        if (window.location.search.includes('do=feed')) {
            this.initFeedUI();
        }
    },

    initActionButtons: function(contentArea) {
        // Find the "Choose active rat" or similar link in the bottom ul list
        const activeRatLink = contentArea.querySelector('a[href*="do=hobo_fights"]');
        if (!activeRatLink) return;
        const ul = activeRatLink.closest('ul');
        if (!ul) return;

        const container = document.createElement('div');
        container.className = 'rat-actions-container';

        const listItems = Array.from(ul.querySelectorAll('li'));
        listItems.forEach(li => {
            const link = li.querySelector('a');
            if (!link) return;

            const btn = document.createElement('a');
            btn.className = 'btn';
            btn.href = link.href;
            if (link.onclick) {
                btn.onclick = link.onclick;
            }

            const text = li.textContent.replace(/\s+/g, ' ').trim();

            if (text.includes('Choose active rat')) {
                btn.innerHTML = 'Choose Active Rat <span style="font-weight:normal;font-size:11px;">(Hobo Fights)</span>';
            } else if (text.includes('Visit the Pet Cemetery')) {
                btn.textContent = 'Pet Cemetery';
            } else if (text.includes('Visit the Pet Store')) {
                btn.textContent = 'Pet Store';
            } else if (text.includes('More Information')) {
                btn.textContent = 'More Information';
            } else if (text.includes('Add to Rat Fund')) {
                btn.textContent = 'Add to Rat Fund';
            } else if (text.includes('Living area news alerts')) {
                const isOn = li.querySelector('font[color="green"]');
                btn.textContent = isOn ? 'News: ON' : 'News: OFF';
                btn.classList.add(isOn ? 'news-on' : 'news-off');
            } else {
                // Fallback for unknown links
                btn.textContent = link.textContent.trim();
            }

            container.appendChild(btn);
        });

        // Clean up any extraneous <br> elements right before the ul
        let prev = ul.previousSibling;
        while (prev && (prev.tagName === 'BR' || prev.nodeType === Node.TEXT_NODE)) {
            const nextPrev = prev.previousSibling;
            prev.remove();
            prev = nextPrev;
        }

        ul.parentNode.replaceChild(container, ul);
    },

    initExpBars: function(contentArea) {
        const expHeaders = Array.from(contentArea.querySelectorAll('td')).filter(td => td.textContent.trim() === 'Experience');
        
        expHeaders.forEach(expHeader => {
            const tr = expHeader.closest('tr');
            if (!tr) return;
            const tds = Array.from(tr.children);
            const expIndex = tds.indexOf(expHeader);
            if (expIndex === -1) return;
            const table = tr.closest('table');
            if (!table) return;

            const rows = Array.from(table.rows);
            rows.forEach(row => {
                if (row === tr) return; // Skip header
                if (row.style.verticalAlign === 'top') return; // Skip rat image info rows

                if (row.children.length > expIndex) {
                    const expCell = row.children[expIndex];
                    const text = expCell.textContent.trim();
                    const parts = text.split('/').map(p => parseInt(p.trim(), 10));

                    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[1] > 0) {
                        const percent = Math.min(100, Math.max(0, (parts[0] / parts[1]) * 100));
                        const remaining = parts[1] - parts[0];
                        
                        expCell.style.position = 'relative';
                        expCell.style.zIndex = '1';
                        expCell.title = `XP to Next Level: ${remaining}`;
                        
                        const bgContainer = document.createElement('div');
                        bgContainer.style.position = 'absolute';
                        bgContainer.style.top = '2px';
                        bgContainer.style.left = '2px';
                        bgContainer.style.right = '2px';
                        bgContainer.style.bottom = '2px';
                        bgContainer.style.border = '1px solid #999';
                        bgContainer.style.backgroundColor = '#eee';
                        bgContainer.style.zIndex = '-2';
                        bgContainer.style.borderRadius = '3px';
                        bgContainer.style.overflow = 'hidden';

                        const bar = document.createElement('div');
                        bar.style.position = 'absolute';
                        bar.style.top = '0';
                        bar.style.left = '0';
                        bar.style.height = '100%';
                        bar.style.width = `${percent}%`;
                        bar.style.backgroundColor = 'rgba(76, 175, 80, 0.5)';
                        bar.style.zIndex = '-1';
                        
                        bgContainer.appendChild(bar);
                        expCell.appendChild(bgContainer);
                    }
                }
            });
        });
    },

    initFeedUI: function() {
        const feedLink = document.querySelector('a[href*="&foodID="]');
        if (!feedLink) return;
        const ul = feedLink.closest('ul');
        if (!ul) return;

        const items = Array.from(ul.querySelectorAll('li'));
        if (items.length === 0) return;

        const grouped = {};

        items.forEach(li => {
            let isMeat = false;
            let name = '';
            let exp = 0;
            let life = 0;
            let img = li.querySelector('img');
            let link = li.querySelector('a');

            if (li.title === 'Eww, meat!' || !link) {
                isMeat = true;
                const font = li.querySelector('font');
                name = (font ? font.textContent : li.textContent).trim();
            } else {
                name = link.textContent.trim();
                const textContent = li.textContent;
                const expMatch = textContent.match(/([+-]?\d+)\s+exp/i);
                const lifeMatch = textContent.match(/([+-]?\d+)\s+life/i);
                if (expMatch) exp = parseInt(expMatch[1], 10);
                if (lifeMatch) life = parseInt(lifeMatch[1], 10);
            }

            if (!grouped[name]) {
                grouped[name] = {
                    name: name,
                    img: img ? img.outerHTML : '',
                    exp: exp,
                    life: life,
                    isMeat: isMeat,
                    count: 1,
                    href: link ? link.getAttribute('href') : null
                };
            } else {
                grouped[name].count++;
            }
        });

        const sorted = Object.values(grouped).sort((a, b) => {
            if (a.isMeat && !b.isMeat) return 1;
            if (!a.isMeat && b.isMeat) return -1;
            if (a.exp !== b.exp) return a.exp - b.exp;
            return a.name.localeCompare(b.name);
        });

        const container = document.createElement('div');
        container.style.cssText = 'display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; padding: 10px; max-height: 400px; overflow-y: auto;';

        sorted.forEach(item => {
            const btn = document.createElement(item.isMeat ? 'div' : 'a');
            btn.className = 'feed-btn' + (item.isMeat ? ' meat' : '');
            
            if (item.isMeat) {
                btn.title = 'Eww, meat!';
            } else {
                btn.href = item.href;
            }

            const imgHtml = item.img ? item.img.replace('align="absmiddle"', 'style="margin-bottom: 4px;"') : '';
            btn.innerHTML = `${imgHtml}<span style="font-size: 11px; line-height: 1.2; text-align: center; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; width: 100%; margin-bottom: 2px;">${item.name}</span>`;

            if (!item.isMeat) {
                const expStat = document.createElement('span');
                expStat.style.cssText = 'position: absolute; bottom: 4px; left: 4px; font-size: 12px; line-height: 1; color: blue; font-weight: bold;';
                expStat.textContent = `${item.exp > 0 ? '+' : ''}${item.exp} exp`;
                btn.appendChild(expStat);

                const lifeStat = document.createElement('span');
                lifeStat.style.cssText = `position: absolute; bottom: 4px; right: 4px; font-size: 12px; line-height: 1; font-weight: bold; color: ${item.life < 0 ? 'red' : 'green'};`;
                lifeStat.textContent = `${item.life > 0 ? '+' : ''}${item.life} life`;
                btn.appendChild(lifeStat);
            }

            const countStr = document.createElement('div');
            countStr.style.cssText = 'font-size: 12px; font-weight: bold; color: #0055aa; margin-top: auto; z-index: 1;';
            countStr.textContent = `(${item.count})`;
            btn.appendChild(countStr);

            container.appendChild(btn);
        });

        ul.parentNode.replaceChild(container, ul);
    },

    initNewsFilter: function(contentArea) {
        const form = contentArea.querySelector('form[name="DelSelected"]');
        if (!form) return;

        const table = form.querySelector('table');
        if (!table) return;

        const rows = Array.from(table.querySelectorAll('tr[height="24"]'));
        if (rows.length === 0) return;

        const ratNames = new Set();

        rows.forEach(row => {
            const td = row.querySelectorAll('td')[1];
            if (!td) return;

            let ratName = 'Unknown';
            const strongTag = td.querySelector('b');
            if (strongTag) {
                ratName = strongTag.textContent.trim();
            } else if (td.textContent.includes('passed away')) {
                // Your rat Two Headed Rat passed away... etc
                const match = td.textContent.match(/Your rat (.*?) passed away/);
                if (match && match[1]) {
                    ratName = match[1].trim();
                }
            }

            if (ratName) {
                row.dataset.ratName = ratName;
                ratNames.add(ratName);
            }
        });

        if (ratNames.size === 0 || (ratNames.size === 1 && ratNames.has(''))) return;

        // Build UI
        const filterContainer = document.createElement('div');
        filterContainer.style.cssText = 'margin: 10px 0; padding: 10px; background: #eef5ff; border: 1px solid #b3d4fc; border-radius: 4px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px;';
        
        const label = document.createElement('span');
        label.style.fontWeight = 'bold';
        label.textContent = 'Filter News by Rat:';
        filterContainer.appendChild(label);

        const checkboxes = [];

        const updateFilters = () => {
            const selectedRats = new Set(checkboxes.filter(cb => cb.checked).map(cb => cb.value));
            rows.forEach(row => {
                if (selectedRats.has(row.dataset.ratName)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        };

        Array.from(ratNames).sort().forEach(name => {
            const cbContainer = document.createElement('label');
            cbContainer.style.cssText = 'cursor: pointer; display: flex; align-items: center; gap: 4px; background: #fff; border: 1px solid #ccc; padding: 3px 8px; border-radius: 12px; font-size: 12px; user-select: none; -webkit-user-select: none;';
            
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.value = name;
            cb.checked = true;
            cb.addEventListener('change', updateFilters);
            checkboxes.push(cb);

            cbContainer.appendChild(cb);
            cbContainer.appendChild(document.createTextNode(name));
            filterContainer.appendChild(cbContainer);
        });

        const toggleAllBtn = document.createElement('button');
        toggleAllBtn.textContent = 'Toggle All';
        toggleAllBtn.style.cssText = 'cursor: pointer; background: #e6f3ff; border: 1px solid #99c2ff; border-radius: 3px; padding: 3px 8px; font-size: 11px; color: #0055aa; user-select: none; -webkit-user-select: none;';
        toggleAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const allChecked = checkboxes.every(cb => cb.checked);
            checkboxes.forEach(cb => cb.checked = !allChecked);
            updateFilters();
        });
        filterContainer.appendChild(toggleAllBtn);

        form.parentNode.insertBefore(filterContainer, form);
    }
};
