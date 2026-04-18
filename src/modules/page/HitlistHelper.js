const HitlistHelper = {
    cmds: 'battle',
    settings: [
        { key: 'HitlistHelper_HighlightOnline', label: 'Highlight Online Players' },
        { key: 'HitlistHelper_RememberSort', label: 'Enable Client-side Sorting & Remember' }
    ],
    init: function() {
        if (!window.location.search.includes('do=phlist')) return;

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        const settings = Utils.getSettings();
        if (settings?.HitlistHelper?.enabled === false) return;

        console.log('[Hobo Helper] Initializing HitlistHelper');

        if (settings?.HitlistHelper_HighlightOnline !== false) {
            this.highlightOnlinePlayers();
        }

        if (settings?.HitlistHelper_RememberSort !== false) {
            this.initSorting();
        }

        this.highlightOutOfRangePlayers();
        this.addLegend();
    },

    addLegend: function() {
        const table = document.querySelector('form[action*="do=phlist"] table');
        if (!table) return;

        const legend = document.createElement('div');
        legend.style.marginTop = '15px';
        legend.style.padding = '10px';
        legend.style.background = '#eee';
        legend.style.border = '1px solid #ccc';
        legend.style.borderRadius = '5px';
        legend.innerHTML = `
            <strong>Legend:</strong><br/>
            <div style="margin-top: 5px;">
                <span style="display:inline-block; width:15px; height:15px; background-color:#d4edda; margin-right:5px; vertical-align:middle; border:1px solid #ccc;"></span> Currently Online
            </div>
            <div style="margin-top: 5px;">
                <span style="display:inline-block; width:15px; height:15px; background-color:#f8d7da; margin-right:5px; vertical-align:middle; border:1px solid #ccc;"></span> Outside Attack Range
            </div>
        `;

        table.parentElement.insertBefore(legend, table.nextSibling);
    },

    highlightOutOfRangePlayers: function() {
        const playerLvl = Utils.getHoboLevel();
        if (playerLvl === 0) return;

        const table = document.querySelector('form[action*="do=phlist"] table');
        if (!table) return;

        const tbody = table.querySelector('tbody') || table;
        const rows = Array.from(tbody.querySelectorAll('tr')).slice(1);

        rows.forEach(row => {
            const tds = row.querySelectorAll('td');
            if (tds.length > 2) {
                const targetLvl = parseInt(tds[2].textContent.replace(/,/g, '').trim(), 10);
                if (!isNaN(targetLvl) && Math.abs(targetLvl - playerLvl) > 200) {
                    tds.forEach(td => {
                        td.style.backgroundColor = '#f8d7da'; // Light red
                    });
                }
            }
        });
    },

    initSorting: function() {
        const table = document.querySelector('form[action*="do=phlist"] table');
        if (!table) return;

        const tbody = table.querySelector('tbody') || table;
        const rows = Array.from(tbody.querySelectorAll('tr'));
        if (rows.length < 2) return;

        const headerRow = rows[0];
        const dataRows = rows.slice(1);

        // Remove native sort links from header
        const headers = headerRow.querySelectorAll('td');
        headers.forEach(headerTd => {
            const strong = headerTd.querySelector('strong');
            if (strong) {
                const links = headerTd.querySelectorAll('a');
                links.forEach(l => l.remove());
            }
        });

        // Build Multi-Sort UI Form
        const container = document.createElement('div');
        container.style.marginTop = '15px';
        container.style.padding = '10px';
        container.style.background = '#eee';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '5px';
        container.innerHTML = `<strong>Multi-Column Hitlist Sort</strong><br/><br/>`;

        const sorts = ['Sort 1', 'Sort 2', 'Sort 3'];
        const options = [
            { val: 'online', label: 'Online Status' },
            { val: 'alive', label: 'Alive Status' },
            { val: 'level', label: 'Hobo Level' },
            { val: 'name', label: 'Hobo Name' },
            { val: 'respect', label: 'Respect' },
            { val: 'city', label: 'City Side' },
            { val: 'battle', label: 'Battle Count' },
            { val: 'none', label: '-- None --' }
        ];

        const selects = [];
        const dirSelects = [];

        sorts.forEach((sort, i) => {
            const wrapper = document.createElement('span');
            wrapper.style.marginRight = '15px';
            wrapper.innerHTML = `${sort}: `;

            const sel = document.createElement('select');
            sel.style.marginRight = '5px';
            options.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt.val;
                o.textContent = opt.label;
                sel.appendChild(o);
            });

            const dirSel = document.createElement('select');
            dirSel.innerHTML = `<option value="asc">Asc</option><option value="desc">Desc</option>`;

            wrapper.appendChild(sel);
            wrapper.appendChild(dirSel);
            container.appendChild(wrapper);
            selects.push(sel);
            dirSelects.push(dirSel);
        });

        const btn = document.createElement('button');
        btn.textContent = 'Apply Sort';
        btn.className = 'btn';
        btn.style.marginLeft = '10px';
        container.appendChild(btn);

        // Load Default or Saved
        let savedConfig;
        try {
            savedConfig = JSON.parse(localStorage.getItem('hw_hitlist_multisort'));
        } catch(e) {}

        if (!savedConfig || !savedConfig.length) {
            savedConfig = [
                { col: 'online', dir: 'desc' },
                { col: 'alive', dir: 'desc' },
                { col: 'level', dir: 'desc' }
            ];
        }

        // Apply config to UI
        savedConfig.forEach((cfg, i) => {
            if (i < 3) {
                selects[i].value = cfg.col;
                dirSelects[i].value = cfg.dir;
            }
        });

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const config = [];
            for(let i=0; i<3; i++) {
                if(selects[i].value !== 'none') {
                    config.push({ col: selects[i].value, dir: dirSelects[i].value });
                }
            }
            localStorage.setItem('hw_hitlist_multisort', JSON.stringify(config));
            this.applyMultiSort(dataRows, tbody, config);
        });

        table.parentElement.insertBefore(container, table.nextSibling);

        // Auto apply sort on load
        this.applyMultiSort(dataRows, tbody, savedConfig);
    },

    applyMultiSort: function(dataRows, tbody, config) {
        if (!config || config.length === 0) return;

        // Helper to extract values
        const getVal = (row, colType) => {
            const tds = row.querySelectorAll('td');
            switch (colType) {
                case 'online':
                    return row.querySelector('img[src*="online_now"]') ? 1 : 0;
                case 'alive':
                    return tds[5]?.textContent.trim().toLowerCase() === 'no' ? 1 : 0; // 'No' is dead. We want ascending to mean 'No' then 'Yes' or whatever. Let's make Alive=1, Dead=0
                case 'level':
                    return parseInt(tds[2]?.textContent.replace(/,/g, '').trim(), 10) || 0;
                case 'name':
                    return tds[1]?.textContent.trim().toLowerCase() || '';
                case 'respect':
                    return parseInt(tds[3]?.textContent.replace(/,/g, '').trim(), 10) || 0;
                case 'city':
                    return tds[4]?.textContent.trim().toLowerCase() || '';
                case 'battle':
                    return parseInt(tds[6]?.textContent.replace(/,/g, '').trim(), 10) || 0;
                default:
                    return 0;
            }
        };

        // Fix 'alive' to be more intuitive: 1 = Alive, 0 = Dead
        const getAliveVal = (row) => {
           const tds = row.querySelectorAll('td');
           const val = tds[5]?.textContent.trim().toLowerCase();
           return val === 'yes' ? 1 : 0;
        };

        dataRows.sort((a, b) => {
            for (let i = 0; i < config.length; i++) {
                const c = config[i];
                let valA, valB;

                if (c.col === 'alive') {
                    valA = getAliveVal(a);
                    valB = getAliveVal(b);
                } else {
                    valA = getVal(a, c.col);
                    valB = getVal(b, c.col);
                }

                if (valA !== valB) {
                    const modifier = c.dir === 'desc' ? -1 : 1;
                    if (typeof valA === 'number' && typeof valB === 'number') {
                        return (valA - valB) * modifier;
                    } else {
                        return String(valA).localeCompare(String(valB)) * modifier;
                    }
                }
            }
            return 0;
        });

        // Re-append rows in new order
        dataRows.forEach(row => tbody.appendChild(row));
    },

    highlightOnlinePlayers: function() {
        const onlineImages = document.querySelectorAll('img[src*="online_now"]');
        onlineImages.forEach(img => {
            const tr = img.closest('tr');
            if (tr) {
                const tds = tr.querySelectorAll('td');
                tds.forEach(td => {
                    td.style.backgroundColor = '#d4edda'; // Light green highlight
                });
            }
        });
    }
};
