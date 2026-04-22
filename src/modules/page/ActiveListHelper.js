const ActiveListHelper = {
    cmds: 'active',
    staff: false,
    settings: [
        { key: 'ActiveListHelper_Filter', label: 'Enable Alive/Dead Filters' }
    ],
    init: function() {
        const settings = Utils.getSettings();

        if (settings.ActiveListHelper_Filter !== false) {
            this.initFilters();
        }
    },

    initFilters: function() {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        // Ensure button styling
        if (!document.getElementById('hobo-helper-btn-style')) {
            const style = document.createElement('style');
            style.id = 'hobo-helper-btn-style';
            style.innerHTML = `
                input[type="button"], input[type="submit"], .btn {
                    -webkit-font-smoothing: antialiased;
                    color: #636363;
                    background: #ddd;
                    font-weight: bold;
                    text-decoration: none;
                    padding: 5px 16px;
                    border-radius: 3px;
                    border: 0;
                    cursor: pointer;
                    margin: 3px 2px;
                    -webkit-appearance: none;
                    display: inline-block;
                    user-select: none;
                    -webkit-user-select: none;
                }
                a.btn {
                    line-height: 1em
                }
                input[type="button"]:hover,input[type="submit"]:hover,.btn:hover, .btn.active {
                    color: #fff;
                    background: #1b9eff;
                    box-shadow: 0 0 0 rgba(0,0,0,.4);
                }
                .hobo-helper-hidden {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }

        // Parse and group players
        let currentWrapper = null;
        let isAlive = false;
        let isDead = false;
        const nodes = Array.from(contentArea.childNodes);
        
        const frag = document.createDocumentFragment();

        nodes.forEach(node => {
            // Check if node is the start of a player line (date pattern e.g., "4/12 11:01.27 PM: ")
            if (node.nodeType === Node.TEXT_NODE && /^\s*\d{1,2}\/\d{1,2} \d{1,2}:\d{2}\.\d{2} [AP]M:/.test(node.textContent)) {
                currentWrapper = document.createElement('span');
                currentWrapper.className = 'hobo-helper-player-row';
                // Span is used instead of div to avoid unexpected block spacing since they end with BR natively
                frag.appendChild(currentWrapper);
                currentWrapper.appendChild(node);
                isAlive = false;
                isDead = false;
            } else if (currentWrapper) {
                // Include node in the wrapper
                currentWrapper.appendChild(node);
                
                if (node.textContent && node.textContent.includes('Alive')) isAlive = true;
                if (node.textContent && node.textContent.includes('Dead')) isDead = true;

                // Stop at the first line break which ends the player line
                if (node.nodeName === 'BR') {
                    if (isAlive) currentWrapper.classList.add('hobo-helper-alive');
                    if (isDead) currentWrapper.classList.add('hobo-helper-dead');
                    
                    const lvlMatch = currentWrapper.textContent.match(/\(Lvl:\s*(\d+)\)/);
                    if (lvlMatch) {
                        currentWrapper.setAttribute('data-level', lvlMatch[1]);
                    }
                    
                    currentWrapper = null;
                }
            } else {
                // Push non-player row nodes (like headers or empty space) into the fragment
                frag.appendChild(node);
            }
        });
        
        // Re-inject the parsed, grouped DOM in one single reflow
        contentArea.innerHTML = '';
        contentArea.appendChild(frag);

        // Retrieve saved filter
        const savedFilter = localStorage.getItem('ActiveListHelper_CurrentFilter') || 'all';
        const savedRange = localStorage.getItem('ActiveListHelper_CurrentRangeFilter') === 'true';

        // Create UI Filter Buttons
        const filterContainer = document.createElement('div');
        filterContainer.style.marginBottom = '15px';
        filterContainer.style.textAlign = 'center';
        filterContainer.innerHTML = `
            <strong style="margin-right:10px;">Filter:</strong>
            <button class="btn ${savedFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
            <button class="btn ${savedFilter === 'alive' ? 'active' : ''}" data-filter="alive">Alive</button>
            <button class="btn ${savedFilter === 'dead' ? 'active' : ''}" data-filter="dead">Dead</button>
            <label style="margin-left: 15px; cursor: pointer; user-select: none;">
                <input type="checkbox" id="hobo-helper-range-checkbox" ${savedRange ? 'checked' : ''} style="vertical-align: middle;"> Attack Range
            </label>
        `;

        contentArea.insertBefore(filterContainer, contentArea.firstChild);

        const playerLevel = typeof Utils.getHoboLevel === 'function' ? Utils.getHoboLevel() : 0;

        const applyFilters = () => {
            const activeBtn = filterContainer.querySelector('.btn.active');
            const filter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
            const rangeOnly = filterContainer.querySelector('#hobo-helper-range-checkbox').checked;

            localStorage.setItem('ActiveListHelper_CurrentFilter', filter);
            localStorage.setItem('ActiveListHelper_CurrentRangeFilter', rangeOnly);

            const allRows = contentArea.querySelectorAll('.hobo-helper-player-row');

            allRows.forEach(row => {
                row.classList.remove('hobo-helper-hidden');
                
                // Status Filter
                if (filter === 'alive' && !row.classList.contains('hobo-helper-alive')) {
                    row.classList.add('hobo-helper-hidden');
                    return;
                }
                if (filter === 'dead' && !row.classList.contains('hobo-helper-dead')) {
                    row.classList.add('hobo-helper-hidden');
                    return;
                }

                // Range Filter
                if (rangeOnly && playerLevel > 0) {
                    const targetLvl = parseInt(row.getAttribute('data-level'), 10);
                    if (!isNaN(targetLvl)) {
                        if (targetLvl < playerLevel - 200 || targetLvl > playerLevel + 200) {
                            row.classList.add('hobo-helper-hidden');
                        }
                    }
                }
            });
        };

        // Bind filter events
        const buttons = filterContainer.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyFilters();
            });
        });

        const rangeCheckbox = filterContainer.querySelector('#hobo-helper-range-checkbox');
        if (rangeCheckbox) {
            rangeCheckbox.addEventListener('change', applyFilters);
        }

        // Apply saved filter on load
        applyFilters();
    }
};
