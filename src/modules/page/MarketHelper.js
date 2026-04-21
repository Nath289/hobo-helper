const MarketHelper = {
    cmds: 'mart',
    staff: false,
    settings: [
        { key: 'MarketHelper_Enable', label: 'Enable Market Helper' },
        { key: 'MarketHelper_TableWatcher', label: 'Convert Market Watcher to Table' },
        { key: 'MarketHelper_ButtonBuy', label: 'Convert "Buy" links to Buttons' },
        { key: 'MarketHelper_FormatSwitchLinks', label: 'Convert "Switch to" links to Buttons' },
        { key: 'MarketHelper_WeaponImages', label: 'Show Weapon Images' },
        { key: 'MarketHelper_ArmorImages', label: 'Show Armor Images' },
        { key: 'MarketHelper_CartPartImages', label: 'Show Cart Part Images' }
    ],
    init: function() {
        const settings = Utils.getSettings();
        if (settings.MarketHelper_Enable === false) return;

        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('do');
        const type = urlParams.get('type');

        if (settings.MarketHelper_ButtonBuy !== false) {
            const actionLinks = document.querySelectorAll('a[href*="&buy="], a[href*="&remove="]');
            if (actionLinks.length > 0) {
                this.ensureBtnStyle();

                actionLinks.forEach(link => {
                    const text = link.textContent.trim().toLowerCase();
                    if (text === 'buy' || text === 'remove') {
                        // Apply button styling
                        link.classList.add('btn');

                        // Remove surrounding brackets if they exist in the parent text node
                        const parent = link.parentNode;
                        if (parent && parent.tagName !== 'A') {
                            parent.childNodes.forEach(node => {
                                if (node.nodeType === Node.TEXT_NODE) {
                                    node.textContent = node.textContent.replace(/\[/g, '').replace(/\]/g, '');
                                }
                            });
                        }
                    }
                });
            }
        }

        if (settings.MarketHelper_FormatSwitchLinks !== false) {
            const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
                acceptNode: function(node) {
                    if (node.textContent.includes('Switch to:')) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            }, false);

            const switchNode = walk.nextNode();
            if (switchNode) {
                this.ensureBtnStyle();

                let current = switchNode.nextSibling;
                while (current) {
                    if (current.nodeType === Node.ELEMENT_NODE && current.tagName === 'A') {
                        current.classList.add('btn');
                    } else if (current.nodeType === Node.TEXT_NODE && current.textContent.trim() === ',') {
                        current.textContent = ' ';
                    } else if (current.nodeName === 'BR') {
                        break; // Stop iteration when we hit the break after the links
                    }
                    current = current.nextSibling;
                }
            }
        }

        if (settings.MarketHelper_TableWatcher !== false && !action) {
            this.initMarketWatcherTable();
        }

        // Page specific routing
        if (action === 'list') {
            switch(type) {
                case '4': // Weapons
                    this.initItemsPage(settings.MarketHelper_WeaponImages, typeof EquipmentData !== 'undefined' ? EquipmentData : null);
                    break;
                case '5': // Armor
                    this.initItemsPage(settings.MarketHelper_ArmorImages, typeof EquipmentData !== 'undefined' ? EquipmentData : null);
                    break;
                case '6': // Cart Parts
                    this.initItemsPage(settings.MarketHelper_CartPartImages, '/images/xcart_parts.gif.pagespeed.ic.S-Xl1EpX3o.webp');
                    break;
                // Add more cases here
            }
        }
    },

    ensureBtnStyle: function() {
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
                }
                a.btn {
                    line-height: 1em
                }
                input[type="button"]:hover,input[type="submit"]:hover,.btn:hover {
                    color: #fff;
                    background: #1b9eff;
                    box-shadow: 0 0 0 rgba(0,0,0,.4);
                    animation: pulse 1.5s infinite
                }
            `;
            document.head.appendChild(style);
        }
    },

    initMarketWatcherTable: function() {
        // Find Market Watcher <b><u> header
        const bsuElements = document.querySelectorAll('b u');
        let watcherHeader = null;
        for (const u of bsuElements) {
            if (u.textContent.includes('Market Watcher')) {
                watcherHeader = u.closest('b');
                break;
            }
        }

        if (!watcherHeader) return;

        let nextNode = watcherHeader.nextSibling;
        // Skip any BRs immediately after
        while (nextNode && nextNode.nodeName === 'BR') {
            nextNode = nextNode.nextSibling;
        }

        // We will collect entries until we hit a double BR or an element like <center>
        const entries = [];
        let currentEntryNodes = [];

        while (nextNode) {
            if (nextNode.nodeName === 'BR') {
                if (currentEntryNodes.length > 0) {
                    entries.push(currentEntryNodes);
                    currentEntryNodes = [];
                }
                
                // If the next sibling is also a BR or center, we are done
                if (nextNode.nextSibling && (nextNode.nextSibling.nodeName === 'BR' || nextNode.nextSibling.nodeName === 'CENTER')) {
                    break;
                }
            } else if (nextNode.nodeName === 'CENTER') {
                break;
            } else {
                currentEntryNodes.push(nextNode);
            }
            nextNode = nextNode.nextSibling;
        }

        if (entries.length === 0) return;

        // Build the table
        const table = document.createElement('table');
        table.className = 'table table-bordered table-striped';
        table.style.margin = '10px auto';
        table.style.width = '100%';
        table.style.maxWidth = '800px';

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr style="background-color: #444; color: #fff;">
                <th style="padding: 5px; text-align: left;">Time</th>
                <th style="padding: 5px; text-align: left;">Seller</th>
                <th style="padding: 5px; text-align: left;">Item</th>
                <th style="padding: 5px; text-align: left;">Total</th>
                <th style="padding: 5px; text-align: left;">Price</th>
                <th style="padding: 5px; text-align: center;">Action</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        let rowCount = 0;

        // Go back and create the table rows while removing the original nodes
        entries.forEach(entryNodes => {
            const tr = document.createElement('tr');
            tr.style.backgroundColor = (rowCount++ % 2 === 0) ? 'rgba(0, 0, 0, 0.05)' : 'transparent';
            
            // Expected parsing:
            // "5 minutes ago : " (TEXT)
            // <a> player </a> (A)
            // " listed " (TEXT)
            // <b> amount item </b> (B)
            // " for " (TEXT)
            // <b> total price </b> (B)
            // <span> (price each) </span> (SPAN)
            // " [" (TEXT)
            // <a>Buy</a> (A)
            // "]" (TEXT)

            let timeStr = "";
            let sellerNode = null;
            let itemNode = null;
            let priceNode = null;
            let eachNode = null;
            let actionNodes = [];

            for (const node of entryNodes) {
                if (node.nodeType === Node.TEXT_NODE) {
                    if (node.textContent.includes(' ago :')) {
                        timeStr = node.textContent.replace(' :', '').trim();
                    }
                } else if (node.nodeName === 'A' && node.href.includes('cmd=player')) {
                    sellerNode = node.cloneNode(true);
                } else if (node.nodeName === 'B' && !itemNode) {
                    itemNode = node.cloneNode(true);
                } else if (node.nodeName === 'B' && itemNode) {
                    priceNode = node.cloneNode(true);
                } else if (node.nodeName === 'SPAN') {
                    const match = node.textContent.match(/\$[\d,]+/);
                    if (match) {
                        eachNode = document.createElement('span');
                        eachNode.textContent = match[0];
                    }
                } else if (node.nodeName === 'A' && node.href.includes('cmd=mart')) {
                    actionNodes.push(node.cloneNode(true));
                }
            }

            const tdTime = document.createElement('td');
            tdTime.style.padding = '5px';
            tdTime.textContent = timeStr;
            tr.appendChild(tdTime);

            const tdSeller = document.createElement('td');
            tdSeller.style.padding = '5px';
            if (sellerNode) tdSeller.appendChild(sellerNode);
            tr.appendChild(tdSeller);

            const tdItem = document.createElement('td');
            tdItem.style.padding = '5px';
            if (itemNode) tdItem.appendChild(itemNode);
            tr.appendChild(tdItem);

            const tdPrice = document.createElement('td');
            tdPrice.style.padding = '5px';
            if (priceNode) tdPrice.appendChild(priceNode);
            tr.appendChild(tdPrice);

            const tdEach = document.createElement('td');
            tdEach.style.padding = '5px';
            if (eachNode) tdEach.appendChild(eachNode);
            tr.appendChild(tdEach);

            const tdAction = document.createElement('td');
            tdAction.style.padding = '5px';
            tdAction.style.textAlign = 'center';
            actionNodes.forEach(an => tdAction.appendChild(an));
            tr.appendChild(tdAction);

            tbody.appendChild(tr);

            // Hide or remove original nodes
            entryNodes.forEach(node => {
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            });
        });

        table.appendChild(tbody);

        watcherHeader.parentNode.insertBefore(table, watcherHeader.nextSibling);
        
        // Remove the hanging <br>s that used to trail each line
        // The while loop collected the ones that ended entries but didn't remove them
        const parent = watcherHeader.parentNode;
        let pNext = watcherHeader.nextSibling;
        while (pNext && pNext.nodeName === 'BR') {
            const temp = pNext;
            pNext = pNext.nextSibling;
            if (temp !== table) parent.removeChild(temp);
        }

        // Convert the action links into buttons if necessary
        const actionLinks = table.querySelectorAll('td:last-child a');
        actionLinks.forEach(a => {
            a.classList.add('btn');
            const p = a.parentNode;
            Array.from(p.childNodes).forEach(n => {
                if(n.nodeType === Node.TEXT_NODE) n.nodeValue = n.nodeValue.replace(/\[|\]/g, '');
            });
        });
    },

    initItemsPage: function(settingToggle, itemData) {
        if (settingToggle !== false && itemData) {
            const headerLink = document.querySelector('a[href*="order=item"]');
            if (headerLink) {
                const headerRow = headerLink.closest('tr');
                const table = headerRow.closest('table');

                if (table) {
                    const imgHeader = document.createElement('td');
                    imgHeader.width = "40";
                    headerRow.insertBefore(imgHeader, headerRow.firstElementChild);

                    const rows = table.querySelectorAll('tr');
                    for (let i = 1; i < rows.length; i++) {
                        const row = rows[i];
                        const firstTd = row.firstElementChild;
                        if (!firstTd) continue;

                        const nameMatch = firstTd.textContent.trim().match(/^([^(]+)/);
                        const newTd = document.createElement('td');
                        newTd.align = 'center';
                        newTd.style.verticalAlign = 'middle';

                        if (nameMatch) {
                            const itemName = nameMatch[1].trim();
                            const imgUrl = typeof itemData === 'string' ? itemData : itemData[itemName];
                            if (imgUrl) {
                                const img = document.createElement('img');
                                img.src = imgUrl;
                                img.style.maxWidth = '40px';
                                img.style.maxHeight = '40px';
                                newTd.appendChild(img);
                            }
                        }

                        row.insertBefore(newTd, firstTd);
                    }
                }
            }
        }
    },

    initInteractiveBuyButtons: function() {
        const table = document.querySelector('table');
        if (!table) return;

        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const lastCell = row.cells[row.cells.length - 1];
            if (!lastCell) return;

            if (lastCell.textContent.includes('[Buy]') || lastCell.textContent.includes('[Remove]')) {
                const actionLink = lastCell.querySelector('a');
                if (actionLink) {
                    actionLink.textContent = actionLink.textContent.replace(/\[|\]/g, '');
                    actionLink.classList.add('btn');

                    // Strip the brackets from the text node
                    Array.from(lastCell.childNodes).forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            node.nodeValue = node.nodeValue.replace(/\[|\]/g, '');
                        }
                    });
                }
            }
        });
    }
};
