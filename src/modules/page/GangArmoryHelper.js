const GangArmoryHelper = {
    cmds: 'gang',
    settings: [
        { key: 'GangArmoryHelper_EnableTabs', label: 'Enable Armory Tabs', default: true }
    ],
    init: function() {
        if (!window.location.href.includes('do=armory')) return;

        const settings = Utils.getSettings();
        if (settings['GangArmoryHelper_EnableTabs'] === false) return;

        this.createTabbedInterface();
    },

    createTabbedInterface: function() {
        const form = document.querySelector('form[action*="do=armory"]');
        if (!form) return;

        const loanedOutText = Array.from(document.querySelectorAll('font')).find(f => f.textContent.includes('Loaned out items:'));

        // Parse Available Items from form
        const formChildren = Array.from(form.childNodes);
        const availableItems = { Weapons: [], Armor: [], Rings: [] };

        const wnameNodes = form.querySelectorAll('.wname');
        wnameNodes.forEach(wnameNode => {
            let curr = wnameNode;
            let section = 'Weapons';
            while(curr) {
                if (curr.nodeType === Node.ELEMENT_NODE && curr.tagName === 'B' && curr.textContent.match(/Weapons:|Armor:|Rings:/)) {
                    section = curr.textContent.replace(':', '').trim();
                    break;
                }
                curr = curr.previousSibling || curr.parentNode.previousSibling;
            }

            let next = wnameNode.nextSibling;
            let transferLink = null;
            while(next) {
                if (next.nodeType === Node.ELEMENT_NODE && next.tagName === 'A' && next.href.includes('do=sendi')) {
                    transferLink = next;
                    break;
                }
                if (next.nodeType === Node.ELEMENT_NODE && (next.classList.contains('wname') || next.tagName === 'BR')) break;
                next = next.nextSibling;
            }

            let coreName = wnameNode.textContent.replace(/^\[.*?\]\s*/, '').trim();
            let stat1 = 0, stat2 = 0;
            const matchStats = wnameNode.textContent.match(/\[([+-]?[\d.]+)(?:\/([+-]?[\d.]+))?\]/);
            if (matchStats) {
                stat1 = parseFloat(matchStats[1]) || 0;
                stat2 = parseFloat(matchStats[2]) || 0;
            }

            availableItems[section].push({
                type: 'available',
                wnameSpan: wnameNode,
                transferLink: transferLink,
                coreName: coreName,
                stat1: stat1,
                stat2: stat2,
                claimLink: null,
                hoboLink: null,
                days: '-',
                inactiveNode: null
            });
        });

        // Parse Loaned Items
        const loanedItems = { Weapons: [], Armor: [], Rings: [] };
        if (loanedOutText) {
            let curr = loanedOutText.nextSibling;
            let section = 'Weapons';
            while(curr) {
                if (curr.nodeType === Node.ELEMENT_NODE && curr.tagName === 'B' && curr.textContent.match(/Weapons:|Armor:|Rings:/)) {
                    section = curr.textContent.replace(':', '').trim();
                } else if (curr.nodeType === Node.ELEMENT_NODE && curr.classList && curr.classList.contains('wname')) {

                    let claimLink = null;
                    let hoboLink = null;
                    let inactiveNode = null;
                    let daysText = '-';

                    let next = curr.nextSibling;
                    while(next) {
                        if (next.nodeType === Node.ELEMENT_NODE) {
                            if (next.tagName === 'A') {
                                if (next.href.includes('do=claim2')) claimLink = next;
                                else if (next.href.includes('ID=')) hoboLink = next;
                            } else if (next.tagName === 'FONT' && next.textContent.includes('Inactive')) {
                                inactiveNode = next;
                            } else if (next.classList.contains('wname') || next.tagName === 'BR') {
                                break;
                            }
                        } else if (next.nodeType === Node.TEXT_NODE) {
                            const match = next.textContent.match(/\((\d+)\s+days?\)/);
                            if (match) daysText = match[1];
                        }
                        next = next.nextSibling;
                    }

                    let coreName = curr.textContent.replace(/^\[.*?\]\s*/, '').trim();
                    let stat1 = 0, stat2 = 0;
                    const matchStats = curr.textContent.match(/\[([+-]?[\d.]+)(?:\/([+-]?[\d.]+))?\]/);
                    if (matchStats) {
                        stat1 = parseFloat(matchStats[1]) || 0;
                        stat2 = parseFloat(matchStats[2]) || 0;
                    }

                    loanedItems[section].push({
                        type: 'loaned',
                        wnameSpan: curr,
                        transferLink: null,
                        coreName: coreName,
                        stat1: stat1,
                        stat2: stat2,
                        claimLink: claimLink,
                        hoboLink: hoboLink,
                        days: daysText,
                        inactiveNode: inactiveNode
                    });
                }
                curr = curr.nextSibling;
            }
        }

        // Clean up Original DOM
        let bottomControlsStarted = false;
        formChildren.forEach(node => {
            if (node.nodeName === 'SELECT' || (node.tagName === 'INPUT' && node.type !== 'hidden') || node.tagName === 'BUTTON') {
                bottomControlsStarted = true;
            }

            if (node.tagName && node.tagName.toLowerCase() === 'b' && node.textContent.match(/Weapons:|Armor:|Rings:/)) {
                node.remove();
            } else if (node.tagName !== 'INPUT' && node.tagName !== 'BUTTON' && node.nodeName !== 'SELECT') {
                if (node.nodeName === 'BR' && !bottomControlsStarted) {
                    if (node.parentNode === form) form.removeChild(node);
                } else if (node.nodeName !== 'BR') {
                    if (node.parentNode === form) form.removeChild(node);
                }
            }
        });

        if (loanedOutText && loanedOutText.parentNode) {
            let limitNode = loanedOutText.nextSibling;
            while (limitNode) {
                let next = limitNode.nextSibling;
                limitNode.parentNode.removeChild(limitNode);
                limitNode = next;
            }
            loanedOutText.parentNode.removeChild(loanedOutText);
        }

        // Build Interface
        const tabContainer = document.createElement('div');
        tabContainer.style.marginTop = '10px';
        tabContainer.style.marginBottom = '20px';
        tabContainer.style.textAlign = 'center';

        const actionContainer = document.createElement('div');
        actionContainer.style.textAlign = 'left';
        actionContainer.style.marginBottom = '10px';

        let isShowingHidden = false;
        const toggleHiddenBtn = document.createElement('button');
        toggleHiddenBtn.className = 'armory-tab-btn';
        toggleHiddenBtn.textContent = 'Show Hidden';
        toggleHiddenBtn.onclick = (e) => {
            e.preventDefault();
            isShowingHidden = !isShowingHidden;
            document.querySelectorAll('.armory-hidden-group').forEach(g => {
                g.style.display = isShowingHidden ? '' : 'none';
            });
            toggleHiddenBtn.textContent = isShowingHidden ? 'Hide Hidden' : 'Show Hidden';
        };

        const hideBtn = document.createElement('button');
        hideBtn.className = 'armory-tab-btn';
        hideBtn.textContent = 'Hide Selected';
        hideBtn.onclick = (e) => {
            e.preventDefault();
            const checkboxes = document.querySelectorAll('.fav-checkbox');
            let hiddenList = JSON.parse(localStorage.getItem('GangArmory_Hidden') || '[]');
            checkboxes.forEach(cb => {
                if (cb.checked && !hiddenList.includes(cb.value)) hiddenList.push(cb.value);
            });
            localStorage.setItem('GangArmory_Hidden', JSON.stringify(hiddenList));
            window.location.reload();
        };

        const saveFavBtn = document.createElement('button');
        saveFavBtn.className = 'armory-tab-btn';
        saveFavBtn.textContent = 'Save Favorites';
        saveFavBtn.onclick = (e) => {
            e.preventDefault();
            const checkboxes = document.querySelectorAll('.fav-checkbox');
            const favs = [];
            checkboxes.forEach(cb => {
                if (cb.checked) favs.push(cb.value);
            });
            localStorage.setItem('GangArmory_Favorites', JSON.stringify(favs));
            window.location.reload();
        };

        let isExpanded = false;
        const expandAllBtn = document.createElement('button');
        expandAllBtn.className = 'armory-tab-btn';
        expandAllBtn.textContent = 'Expand All';

        actionContainer.appendChild(toggleHiddenBtn);
        actionContainer.appendChild(hideBtn);
        actionContainer.appendChild(saveFavBtn);
        actionContainer.appendChild(expandAllBtn);

        tabContainer.appendChild(actionContainer);

        const categories = ['Weapons', 'Armor', 'Rings'];
        const contentContainers = {};

        const style = document.createElement('style');
        style.innerHTML = `
            .armory-tab-btn {
                -webkit-font-smoothing: antialiased;
                color: #636363;
                background: #ddd;
                font-weight: bold;
                text-decoration: none;
                padding: 5px 16px;
                border-radius: 3px 3px 0 0;
                border: 0;
                cursor: pointer;
                margin: 0 2px;
                user-select: none;
            }
            .armory-tab-btn.active {
                color: #fff;
                background: #1b9eff;
            }
            .armory-tab-content {
                display: none;
                border: 1px solid #ccc;
                padding: 10px;
                background: #fff;
                color: #000;
            }
            .armory-tab-content.active {
                display: block;
            }
            .armory-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 5px;
                font-size: 11px;
            }
            .armory-table th {
                background: #eee;
                padding: 6px;
                border-bottom: 2px solid #ccc;
                text-align: left;
            }
            .armory-table td {
                padding: 4px 6px;
                border-bottom: 1px solid #eee;
                vertical-align: middle;
            }
            .armory-table tr:hover {
                background-color: #f9f9f9;
            }
            .armory-item-name {
                font-weight: normal;
            }
        `;
        document.head.appendChild(style);

        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'armory-tab-btn';
            btn.textContent = cat;
            btn.onclick = (e) => {
                e.preventDefault();
                document.querySelectorAll('.armory-tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.armory-tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                contentContainers[cat].classList.add('active');
            };
            tabContainer.appendChild(btn);

            const content = document.createElement('div');
            content.className = 'armory-tab-content';
            contentContainers[cat] = content;

            const table = document.createElement('table');
            table.className = 'armory-table';
            
            const trHead = document.createElement('tr');
            ['Fav', 'Item Name', 'Transfer', 'Claim Back', 'Loaned To', 'Days Inactive'].forEach(text => {
                const th = document.createElement('th');
                if (text === 'Fav') {
                    const selectAllCb = document.createElement('input');
                    selectAllCb.type = 'checkbox';
                    selectAllCb.title = 'Toggle All';
                    selectAllCb.onclick = (e) => {
                        const checked = e.target.checked;
                        const checkboxes = table.querySelectorAll('.fav-checkbox');
                        checkboxes.forEach(cb => cb.checked = checked);
                    };
                    th.appendChild(selectAllCb);
                    th.style.textAlign = 'center';
                } else {
                    th.textContent = text;
                }
                trHead.appendChild(th);
            });
            table.appendChild(trHead);

            const allItems = [...availableItems[cat], ...loanedItems[cat]];
            const savedHidden = JSON.parse(localStorage.getItem('GangArmory_Hidden') || '[]');

            const grouped = {};
            allItems.forEach(item => {
                const key = item.coreName;
                if (!grouped[key]) {
                    grouped[key] = {
                        items: [],
                        stat1: item.stat1,
                        stat2: item.stat2,
                        coreName: item.coreName
                    };
                }
                grouped[key].items.push(item);
            });

            const keys = Object.keys(grouped).sort((a, b) => {
                const gA = grouped[a];
                const gB = grouped[b];
                if (gB.stat1 !== gA.stat1) return gB.stat1 - gA.stat1;
                if (gB.stat2 !== gA.stat2) return gB.stat2 - gA.stat2;
                return a.localeCompare(b);
            });

            keys.forEach((coreName, groupIndex) => {
                const group = grouped[coreName].items;

                group.sort((a,b) => {
                    if (a.type === 'available' && b.type !== 'available') return -1;
                    if (a.type !== 'available' && b.type === 'available') return 1;
                    return 0;
                });
                
                const tbody = document.createElement('tbody');
                if (savedHidden.includes(coreName)) {
                    tbody.classList.add('armory-hidden-group');
                    tbody.style.display = 'none';
                }

                function createRow(item, isFirst) {
                    const tr = document.createElement('tr');

                    if (item.inactiveNode) tr.style.backgroundColor = '#ffe0e0';

                    const tdFav = document.createElement('td');
                    tdFav.style.textAlign = 'center';
                    if (isFirst) {
                        const cb = document.createElement('input');
                        cb.type = 'checkbox';
                        cb.className = 'fav-checkbox';
                        cb.value = item.coreName;
                        let savedFavs = JSON.parse(localStorage.getItem('GangArmory_Favorites') || '[]');
                        if (savedFavs.includes(item.coreName)) cb.checked = true;
                        tdFav.appendChild(cb);
                    }
                    tr.appendChild(tdFav);

                    const tdName = document.createElement('td');
                    tdName.className = 'armory-item-name';
                    if (item.wnameSpan) tdName.appendChild(item.wnameSpan.cloneNode(true));
                    else tdName.textContent = item.coreName;

                    const tdTransfer = document.createElement('td');
                    if (item.type === 'available' && item.transferLink) {
                        const a = item.transferLink.cloneNode(true);
                        a.style.textDecoration = 'none';
                        tdTransfer.appendChild(a);
                    } else {
                        tdTransfer.innerHTML = '-';
                    }

                    const tdClaim = document.createElement('td');
                    if (item.type === 'loaned' && item.claimLink) {
                        const a = item.claimLink.cloneNode(true);
                        a.style.textDecoration = 'none';
                        a.style.color = '#d00';
                        tdClaim.appendChild(a);
                    } else {
                        tdClaim.innerHTML = '-';
                    }

                    const tdHobo = document.createElement('td');
                    if (item.type === 'loaned' && item.hoboLink) {
                        tdHobo.appendChild(item.hoboLink.cloneNode(true));
                    } else {
                        tdHobo.innerHTML = '-';
                    }

                    const tdDays = document.createElement('td');
                    if (item.type === 'loaned') {
                        tdDays.textContent = item.days;
                        if (item.inactiveNode) {
                            const inFont = item.inactiveNode.cloneNode(true);
                            inFont.style.marginLeft = '5px';
                            tdDays.appendChild(inFont);
                        }
                    } else {
                        tdDays.innerHTML = '-';
                    }

                    tr.appendChild(tdName);
                    tr.appendChild(tdTransfer);
                    tr.appendChild(tdClaim);
                    tr.appendChild(tdHobo);
                    tr.appendChild(tdDays);
                    return tr;
                }

                const firstItem = group[0];
                const restItems = group.slice(1);

                tbody.appendChild(createRow(firstItem, true));

                if (restItems.length > 0) {
                    const toggleClass = `custom-group-${cat}-${groupIndex}`;

                    restItems.forEach(item => {
                        const tr = createRow(item, false);
                        tr.className = toggleClass;
                        tr.style.display = 'none';
                        tbody.appendChild(tr);
                    });

                    const toggleTr = document.createElement('tr');
                    const toggleTd = document.createElement('td');
                    toggleTd.colSpan = 6;
                    toggleTd.style.backgroundColor = '#fff';
                    toggleTd.style.textAlign = 'left';
                    const a = document.createElement('a');
                    a.href = "javascript:void(0);";
                    a.style.textDecoration = 'none';
                    a.style.fontWeight = 'bold';
                    a.style.color = '#333';
                    a.textContent = `[⮟ Show All ${group.length}x ${coreName}]`;
                    a.onclick = () => {
                        const c = table.querySelectorAll('.' + toggleClass);
                        const isHidden = c[0].style.display === 'none';
                        c.forEach(el => el.style.display = isHidden ? '' : 'none');
                        a.textContent = isHidden ? `[⮝ Hide All ${group.length}x ${coreName}]` : `[⮟ Show All ${group.length}x ${coreName}]`;
                    };
                    toggleTd.appendChild(a);
                    toggleTr.appendChild(toggleTd);
                    tbody.appendChild(toggleTr);
                }
                table.appendChild(tbody);
            });

            content.appendChild(table);
        });

        expandAllBtn.onclick = (e) => {
            e.preventDefault();
            isExpanded = !isExpanded;

            // Gather all toggle tags and items across all tables
            const allToggles = document.querySelectorAll('a[href="javascript:void(0);"]');
            allToggles.forEach(a => {
                if (a.textContent.includes('Show All') || a.textContent.includes('Hide All')) {
                    const match = a.textContent.match(/(Show|Hide) All (\d+x .*?)\]/);
                    if (match) {
                        a.textContent = isExpanded ? `[⮝ Hide All ${match[2]}]` : `[⮟ Show All ${match[2]}]`;
                    }
                }
            });

            const allHiddenRows = document.querySelectorAll('[class^="custom-group-"]');
            allHiddenRows.forEach(tr => {
                tr.style.display = isExpanded ? '' : 'none';
            });

            expandAllBtn.textContent = isExpanded ? 'Collapse All' : 'Expand All';
        };

        // Render Favorites List Above Tabs
        let activeFavContainer = null;
        const savedFavs = JSON.parse(localStorage.getItem('GangArmory_Favorites') || '[]');
        if (savedFavs.length > 0) {
            const favContainer = document.createElement('div');
            favContainer.style.marginBottom = '20px';
            const favTitle = document.createElement('h3');
            favTitle.textContent = 'Favorite Items';
            favTitle.style.margin = '0 0 5px 0';
            favContainer.appendChild(favTitle);

            const favTable = document.createElement('table');
            favTable.className = 'armory-table';
            const ftrHead = document.createElement('tr');
            ['Item Name', 'Transfer', 'Claim Back', 'Loaned To', 'Days Inactive'].forEach(text => {
                const th = document.createElement('th');
                th.textContent = text;
                ftrHead.appendChild(th);
            });
            favTable.appendChild(ftrHead);

            savedFavs.forEach(favName => {
                let foundItems = [];
                // Search across all
                categories.forEach(c => {
                    const groupItems = [...availableItems[c], ...loanedItems[c]].filter(i => i.coreName === favName);
                    foundItems = foundItems.concat(groupItems);
                });

                if (foundItems.length > 0) {
                    foundItems.sort((a,b) => {
                        if (a.type === 'available' && b.type !== 'available') return -1;
                        if (a.type !== 'available' && b.type === 'available') return 1;
                        return 0;
                    });

                    const firstItem = foundItems[0];
                    const tr = document.createElement('tr');

                    const tdName = document.createElement('td');
                    tdName.className = 'armory-item-name';
                    if (firstItem.wnameSpan) tdName.appendChild(firstItem.wnameSpan.cloneNode(true));
                    else tdName.textContent = firstItem.coreName;
                    tr.appendChild(tdName);

                    const tdTransfer = document.createElement('td');
                    if (firstItem.type === 'available' && firstItem.transferLink) {
                        const a = firstItem.transferLink.cloneNode(true);
                        a.style.textDecoration = 'none';
                        tdTransfer.appendChild(a);
                    } else {
                        tdTransfer.innerHTML = '<span style="color:red; font-weight:bold;">Not Available</span>';
                    }
                    tr.appendChild(tdTransfer);

                    const tdClaim = document.createElement('td');
                    if (firstItem.type === 'loaned' && firstItem.claimLink) {
                        const a = firstItem.claimLink.cloneNode(true);
                        a.style.textDecoration = 'none';
                        a.style.color = '#d00';
                        tdClaim.appendChild(a);
                    } else {
                        tdClaim.innerHTML = '-';
                    }
                    tr.appendChild(tdClaim);

                    const tdHobo = document.createElement('td');
                    if (firstItem.type === 'loaned' && firstItem.hoboLink) {
                        tdHobo.appendChild(firstItem.hoboLink.cloneNode(true));
                    } else {
                        tdHobo.innerHTML = '-';
                    }
                    tr.appendChild(tdHobo);

                    const tdDays = document.createElement('td');
                    if (firstItem.type === 'loaned') {
                        tdDays.textContent = firstItem.days;
                    } else {
                        tdDays.innerHTML = '-';
                    }
                    tr.appendChild(tdDays);

                    favTable.appendChild(tr);
                }
            });
            favContainer.appendChild(favTable);
            activeFavContainer = favContainer;
        }

        const firstTabBtn = Array.from(tabContainer.querySelectorAll('.armory-tab-btn')).find(b => b.textContent === categories[0]);
        if (firstTabBtn) firstTabBtn.classList.add('active');
        contentContainers[categories[0]].classList.add('active');

        const insertBeforeNode = Array.from(form.childNodes).find(n => n.nodeName === 'SELECT' || (n.tagName === 'INPUT' && n.type !== 'hidden') || n.tagName === 'BUTTON' || (n.nodeName === 'BR'));
        if (insertBeforeNode) {
            if (activeFavContainer) form.insertBefore(activeFavContainer, insertBeforeNode);
            form.insertBefore(tabContainer, insertBeforeNode);
            categories.forEach(cat => form.insertBefore(contentContainers[cat], insertBeforeNode));
        } else {
            if (activeFavContainer) form.appendChild(activeFavContainer);
            form.appendChild(tabContainer);
            categories.forEach(cat => form.appendChild(contentContainers[cat]));
        }
    }
};
