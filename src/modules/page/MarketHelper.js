const MarketHelper = {
    cmds: 'mart',
    settings: [
        { key: 'MarketHelper_Enable', label: 'Enable Market Helper' },
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
            const buyLinks = document.querySelectorAll('a[href*="&buy="]');
            if (buyLinks.length > 0) {
                this.ensureBtnStyle();

                buyLinks.forEach(link => {
                    const text = link.textContent.trim().toLowerCase();
                    if (text === 'buy') {
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
    }
};
