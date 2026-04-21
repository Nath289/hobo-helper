const BackpackHelper = {
    cmds: ['backpack', ''],
    staff: false,
    settings: [
        { key: 'BackpackHelper_Tooltips', label: 'Item Tooltips (Stats/Effects)' },
        { key: 'BackpackHelper_Favourites', label: 'Favourite Drinks UI' }
    ],
    init: function() {
        const settings = Utils.getSettings();

        const enableTooltips = settings['BackpackHelper_Tooltips'] !== false;
        const enableFavourites = settings['BackpackHelper_Favourites'] !== false;

        const urlParams = new URLSearchParams(window.location.search);
        const currentCmd = urlParams.get('cmd') || '';

        if (enableFavourites) {
            this.initDrinkStats();
        }

        if (currentCmd === 'backpack') {
            this.processItems(enableTooltips, enableFavourites);
        } else if (currentCmd === '') {
            this.observeBackpack(enableTooltips, enableFavourites);
        }
    },

    drinkMap: null,
    lastInjected: 0,

    processItems: function(enableTooltips, enableFavourites) {
        const now = Date.now();
        if (enableFavourites && (now - this.lastInjected > 1000)) {
            this.injectFavourites();
            this.lastInjected = now;
        }

        if (!enableTooltips) return;

        const items = document.querySelectorAll('.bp-itm:not([data-bh-tooltip-processed])');
        if (items.length === 0) return;

        if (!this.drinkMap && typeof DrinksData !== 'undefined' && DrinksData.drinks) {
            this.drinkMap = {};
            const combined = [...DrinksData.drinks.alcoholic, ...DrinksData.drinks.mixed];
            combined.forEach(d => {
                this.drinkMap[d.name] = d;
            });
        }
        if (!this.drinkMap) return;

        items.forEach(item => {
            item.setAttribute('data-bh-tooltip-processed', 'true');

            const img = item.querySelector('img');
            if (!img) return;

            const name = (img.getAttribute('alt') || img.title || '').trim();
            const drinkInfo = this.drinkMap[name];

            if (drinkInfo) {
                let tooltipParts = [];
                if (drinkInfo.base_stat_gain && drinkInfo.base_stat_gain.trim() !== "") {
                    tooltipParts.push(`Stats: ${drinkInfo.base_stat_gain.trim()}`);
                }
                if (drinkInfo.effect && drinkInfo.effect.trim() !== "") {
                    tooltipParts.push(`Effect: ${drinkInfo.effect.trim()}`);
                }

                if (tooltipParts.length > 0) {
                    const target = item.closest('td') ? item.closest('td') : item;
                    const tooltipText = tooltipParts.join(' - ');
                    target.setAttribute('title', tooltipText);

                    if (img.hasAttribute('title')) {
                        img.setAttribute('title', tooltipText);
                    }

                    const a = item.querySelector('a');
                    if (a && a.hasAttribute('title')) {
                        a.setAttribute('title', tooltipText);
                    }
                }
            }
        });
    },

    initDrinkStats: function() {
        if (!localStorage.getItem('bh_drink_stats')) {
            localStorage.setItem('bh_drink_stats', JSON.stringify({}));
        }

        document.removeEventListener('click', this.handleDrinkClick);
        this.handleDrinkClick = (e) => {
            const a = e.target.closest('a');
            if (!a) return;
            const href = a.getAttribute('href') || '';
            const onclick = a.getAttribute('onclick') || '';
            const isDrink = href.includes('do=drink') || onclick.includes('do=drink');
            if (isDrink) {
                const img = a.querySelector('img');
                const name = img ? (img.getAttribute('alt') || img.title).trim() : a.textContent.trim();
                const src = img ? img.getAttribute('src') : '';
                if (name) {
                    let stats = JSON.parse(localStorage.getItem('bh_drink_stats') || '{}');
                    let current = stats[name];
                    if (typeof current === 'number') {
                        current = { count: current, src: src };
                    } else if (!current) {
                        current = { count: 0, src: src };
                    } else if (src && (!current.src || current.src.startsWith('data:'))) {
                        current.src = src;
                    }
                    current.count++;
                    stats[name] = current;
                    localStorage.setItem('bh_drink_stats', JSON.stringify(stats));
                }
            }
        };
        document.addEventListener('click', this.handleDrinkClick);
    },

    observeBackpack: function(enableTooltips, enableFavourites) {
        // Run once immediately in case the backpack is somehow already loaded
        this.processItems(enableTooltips, enableFavourites);

        // In the Living Area, the backpack content is loaded via AJAX when the tab is clicked.
        // We will watch for the user clicking the backpack tab and strictly trigger our observer then.
        const backpackTabLink = document.querySelector('a[rel="backpack"]');
        if (backpackTabLink) {
            backpackTabLink.addEventListener('click', () => {
                if (this._bpObserver) return; // Prevent multiple observers

                // When clicked, wait briefly to allow the AJAX call to initiate and the loading text to appear
                setTimeout(() => {
                    const targetNode = document.getElementById('backpackTab');
                    if (targetNode) {
                        let timeout = null;
                        this._bpObserver = new MutationObserver(() => {
                            // Only process if the tab is actually visible
                            if (targetNode.style.display === 'none') return;

                            if (timeout) clearTimeout(timeout);
                            timeout = setTimeout(() => {
                                // Double check if items need processing before running full logic
                                const unprocessed = targetNode.querySelectorAll('.bp-itm:not([data-bh-tooltip-processed])');
                                const needsFavInject = enableFavourites && !targetNode.querySelector('table[data-bh-favorites-added]');

                                if (unprocessed.length > 0 || needsFavInject) {
                                    this.processItems(enableTooltips, enableFavourites);
                                }
                            }, 250);
                        });

                        // We only need to observe the backpackTab container. Once it mutates (loads content), we process.
                        this._bpObserver.observe(targetNode, { childList: true, subtree: true });
                    }
                }, 50);
            });
        }
    },

    injectFavourites: function() {
        let bpTable = null;
        const headers = Array.from(document.querySelectorAll('td[bgcolor="#CCCCCC"] b'));
        const usable = headers.find(el => el.textContent.includes('Usable'));
        if (usable) bpTable = usable.closest('table');

        if (!bpTable || bpTable.hasAttribute('data-bh-favorites-added')) return;
        
        bpTable.setAttribute('data-bh-favorites-added', 'true');

        let stats = JSON.parse(localStorage.getItem('bh_drink_stats') || '{}');
        const getCount = (val) => typeof val === 'number' ? val : (val ? val.count : 0);
        const sortedDrinks = Object.keys(stats).sort((a,b) => getCount(stats[b]) - getCount(stats[a])).slice(0, 5);

        if (sortedDrinks.length === 0) return;

        // we need to find the drink elements in the table
        const favRow = document.createElement('tr');
        favRow.innerHTML = `<td colspan="9" bgcolor="#CCCCCC"><div style="padding:3px;font-size:10pt; display:flex; justify-content:space-between;"><b>Favourite Drinks</b> <button id="bh_view_drink_stats" style="font-size:10px; cursor:pointer;" onclick="return false;">View Stats</button></div></td>`;

        const usableRow = Array.from(bpTable.querySelectorAll('tr')).find(tr => tr.querySelector('b') && tr.querySelector('b').textContent.includes('Usable'));
        if (!usableRow) return;

        usableRow.parentNode.insertBefore(favRow, usableRow);

        let tr = document.createElement('tr');
        let count = 0;

        // Build a map of drink names to their anchor elements to avoid nested DOM querying
        const drinkNodeMap = {};
        bpTable.querySelectorAll('img').forEach(img => {
            const name = (img.getAttribute('alt') || img.title || '').trim();
            if (name && !drinkNodeMap[name]) {
                const a = img.closest('a');
                if (a && ((a.getAttribute('href') || '').includes('do=drink') || (a.getAttribute('onclick') || '').includes('do=drink'))) {
                    drinkNodeMap[name] = { a, img };
                }
            }
        });

        sortedDrinks.forEach(drinkName => {
            const match = drinkNodeMap[drinkName];
            if (!match) return;

            const clonedA = match.a.cloneNode(true);
            const clonedImg = clonedA.querySelector('img');
            if (clonedImg) {
                clonedImg.width = 35;
                clonedImg.height = 35;
            }
            
            let td = document.createElement('td');
            td.onmouseover = function() { this.style.backgroundColor='#F3F3F3'; };
            td.onmouseout = function() { this.style.backgroundColor=''; };
            td.innerHTML = `<div align="left" class="bp-itm"></div>`;
            td.querySelector('.bp-itm').appendChild(clonedA);
            
            tr.appendChild(td);
            count++;

            if (count % 3 === 0) {
                usableRow.parentNode.insertBefore(tr, usableRow);
                tr = document.createElement('tr');
            }
        });

        if (count > 0 && count % 3 !== 0) {
            while (count % 3 !== 0) {
                const td = document.createElement('td');
                tr.appendChild(td);
                count++;
            }
            usableRow.parentNode.insertBefore(tr, usableRow);
        } else if (count === 0) {
            favRow.remove();
        }

        const statsBtn = document.getElementById('bh_view_drink_stats');
        if (statsBtn) {
            statsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showStatsModal();
            });
        }
    },

    showStatsModal: function() {
        let modal = document.getElementById('bh_drink_stats_modal');
        if (modal) {
            modal.remove();
        }

        let stats = JSON.parse(localStorage.getItem('bh_drink_stats') || '{}');
        const getCount = (val) => typeof val === 'number' ? val : (val ? val.count : 0);
        const getSrc = (name, val) => {
            if (val && val.src && !val.src.startsWith('data:')) return val.src;
            return `/images/items/gifs/${name.replace(/'/g, '').replace(/ /g, '-')}.gif`;
        };
        const sortedDrinks = Object.keys(stats).sort((a,b) => {
            const diff = getCount(stats[b]) - getCount(stats[a]);
            if (diff === 0) return a.localeCompare(b);
            return diff;
        });

        let html = `<div id="bh_drink_stats_modal" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:#fff; color:#000; border:1px solid #ccc; padding:20px; z-index:9999; max-height:80%; overflow-y:auto; box-shadow:0 0 10px rgba(0,0,0,0.5); min-width: 250px;">
            <h3 style="margin-top: 0; padding-bottom: 10px; border-bottom: 1px solid #ddd;">Drink Stats</h3>
            <table width="100%" style="border-collapse: collapse; text-align: left;">
            ${sortedDrinks.map(d => `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 5px; width: 30px;"><img src="${getSrc(d, stats[d])}" alt="${d}" width="25" height="25" onerror="this.style.display='none'"></td>
                    <td style="padding: 5px; font-weight: bold;">${d}</td>
                    <td style="padding: 5px; text-align: right;">${getCount(stats[d])}</td>
                    <td style="padding: 5px; text-align: right; width: 30px;">
                        <button class="bh-drink-stats-remove" data-drink="${d.replace(/"/g, '&quot;')}" style="cursor: pointer; padding: 2px 6px; font-size: 10px; color: red; background: transparent; border: 1px solid red; border-radius: 3px; user-select: none; -webkit-user-select: none;" title="Remove this drink">X</button>
                    </td>
                </tr>`).join('')}
            </table>
            <br>
            <div style="text-align: center;">
                <button style="padding: 5px 15px; cursor: pointer; margin-right: 10px;" id="bh_drink_stats_reset">Reset</button>
                <button style="padding: 5px 15px; cursor: pointer;" onclick="document.getElementById('bh_drink_stats_modal').remove()">Close</button>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', html);

        const resetBtn = document.getElementById('bh_drink_stats_reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all your drink stats?')) {
                    localStorage.setItem('bh_drink_stats', JSON.stringify({}));
                    this.showStatsModal();
                }
            });
        }

        document.querySelectorAll('.bh-drink-stats-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                let drink = e.target.getAttribute('data-drink');
                if (confirm(`Are you sure you want to remove stats for: ${drink}?`)) {
                    let currentStats = JSON.parse(localStorage.getItem('bh_drink_stats') || '{}');
                    delete currentStats[drink];
                    localStorage.setItem('bh_drink_stats', JSON.stringify(currentStats));
                    this.showStatsModal();
                }
            });
        });
    }
};
