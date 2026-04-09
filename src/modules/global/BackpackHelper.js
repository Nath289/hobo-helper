const BackpackHelper = {
    init: function() {
        const settings = Utils.getSettings();
        if (settings?.BackpackHelper?.enabled === false) return;
        
        this.initDrinkStats();
        this.observeBackpack();
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

    observeBackpack: function() {
        let drinkMap = null;
        let lastInjected = 0;

        const processItems = () => {
            const now = Date.now();
            if (now - lastInjected > 1000) {
                this.injectFavourites();
                lastInjected = now;
            }

            const items = document.querySelectorAll('.bp-itm:not([data-bh-tooltip-processed])');
            if (items.length === 0) return;

            // Initialize map lazily
            if (!drinkMap && typeof DrinksData !== 'undefined' && DrinksData.drinks) {
                drinkMap = {};
                const combined = [...DrinksData.drinks.alcoholic, ...DrinksData.drinks.mixed];
                combined.forEach(d => {
                    drinkMap[d.name] = d;
                });
            }
            // If we still can't find drinks data, skip processing
            if (!drinkMap) return;

            items.forEach(item => {
                // Mark processed immediately
                item.setAttribute('data-bh-tooltip-processed', 'true');

                const img = item.querySelector('img');
                if (!img) return;

                const name = (img.getAttribute('alt') || img.title || '').trim();
                const drinkInfo = drinkMap[name];

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

                        // If it has children with titles (like the img), clear them so they don't override the td
                        if (img.hasAttribute('title')) {
                            // We can reset the img title to empty or match the parent
                            img.setAttribute('title', tooltipText);
                        }

                        // Check if the link has a title
                        const a = item.querySelector('a');
                        if (a && a.hasAttribute('title')) {
                            a.setAttribute('title', tooltipText);
                        }
                    }
                }
            });
        };

        let timeout = null;
        const observer = new MutationObserver(() => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(processItems, 250);
        });

        const targetNode = document.getElementById('backpackTab') ? document.getElementById('backpackTab') : document.body;
        observer.observe(targetNode, { childList: true, subtree: true });

        // Initial run
        processItems();
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
