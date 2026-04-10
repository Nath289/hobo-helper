const GangHelper = {
    cmds: ['gang', 'gang2'],
    settings: [
        { key: 'GangHelper_EnableFeature', label: 'Enable Gang Helper' },
        { key: 'GangHelper_FormatMassMails', label: 'Format Mass Mails' }
    ],
    init: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const doParam = urlParams.get('do');
        const wParam = urlParams.get('w');
        
        const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');

        if (savedSettings['GangHelper_EnableFeature'] !== false) {
            if (doParam === 'list_mem') {
                this.initGangMemberList();
            } else if (doParam === 'enter') {
                // Check if we are viewing the last gang happenings
                if (wParam === 'lastsh') {
                    this.initGangHappenings();
                } else {
                    this.initGangFeature();
                }
            } else if (doParam === 'read_mail') {
                if (savedSettings['GangHelper_FormatMassMails'] !== false) {
                    this.formatMassMail();
                }
            }
        }
    },
    
    formatMassMail: function() {
        const bTags = document.querySelectorAll('td > b, div > b');
        let sentToTd = null;
        for (const b of bTags) {
            if (b.textContent.includes('Sent to:')) {
                sentToTd = b.parentElement;
                break;
            }
        }
        
        if (!sentToTd) return;
        
        const htmlContent = sentToTd.innerHTML;
        const sentToPrefix = '<b>Sent to:</b>';
        if (!htmlContent.includes(sentToPrefix)) return;
        
        // Find the ul tag that contains the list
        const ulTag = sentToTd.querySelector('ul');
        if (!ulTag) return;
        
        let allUnread = 0;
        let allRead = 0;
        const records = [];
        
        // Parse the list items
        const liElements = ulTag.querySelectorAll('li');
        liElements.forEach(li => {
            const link = li.querySelector('a');
            if (link) {
                const url = link.getAttribute('href');
                const name = link.textContent.trim();
                const isUnread = li.textContent.includes('(unread)');
                const status = isUnread ? 'unread' : 'read';
                
                if (status === 'read') allRead++;
                else allUnread++;
                
                records.push({ url, name, status, originalHtml: link.innerHTML });
            }
        });
        
        if (records.length === 0) return;
        
        const container = document.createElement('div');
        container.style.marginTop = '10px';
        container.style.userSelect = 'none';
        container.style.WebkitUserSelect = 'none';
        
        const headerDiv = document.createElement('div');
        headerDiv.style.marginBottom = '10px';
        headerDiv.innerHTML = `
            <strong>Mass Mail Status:</strong> 
            <span style="color: green;">Read: ${allRead}</span> | 
            <span style="color: red;">Unread: ${allUnread}</span> | 
            Total: ${allRead + allUnread}
        `;
        
        const filterDiv = document.createElement('div');
        filterDiv.style.marginBottom = '10px';
        filterDiv.innerHTML = `
            <button id="show-all-mail" style="margin-right: 5px; cursor: pointer;">Show All</button>
            <button id="show-read-mail" style="margin-right: 5px; cursor: pointer;">Show Read</button>
            <button id="show-unread-mail" style="margin-right: 5px; cursor: pointer;">Show Unread</button>
        `;
        
        const table = document.createElement('table');
        table.className = 'table gang-mail-table';
        table.style.width = '100%';
        table.style.marginTop = '10px';
        
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr class="header">
                <th style="text-align: left; padding: 5px;">Hobo</th>
                <th style="text-align: left; padding: 5px;">Status</th>
            </tr>
        `;
        table.appendChild(thead);
        
        const tbody = document.createElement('tbody');
        records.forEach((r, i) => {
            const tr = document.createElement('tr');
            tr.className = `mail-row ${r.status} ${i % 2 === 0 ? 'even' : 'odd'}`;
            tr.innerHTML = `
                <td style="padding: 5px;"><a href="${r.url}">${r.originalHtml}</a></td>
                <td style="padding: 5px; color: ${r.status === 'read' ? 'green' : 'red'}; font-weight: bold;">${r.status.toUpperCase()}</td>
            `;
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        
        container.appendChild(headerDiv);
        container.appendChild(filterDiv);
        container.appendChild(table);
        
        // Replace the ul with our new container
        ulTag.replaceWith(container);
        
        // Add event listeners for filters
        sentToTd.querySelector('#show-all-mail').addEventListener('click', (e) => {
            e.preventDefault();
            sentToTd.querySelectorAll('.mail-row').forEach(row => row.style.display = '');
            this.recolorRows(sentToTd);
        });
        
        sentToTd.querySelector('#show-read-mail').addEventListener('click', (e) => {
            e.preventDefault();
            sentToTd.querySelectorAll('.mail-row').forEach(row => {
                row.style.display = row.classList.contains('read') ? '' : 'none';
            });
            this.recolorRows(sentToTd);
        });
        
        sentToTd.querySelector('#show-unread-mail').addEventListener('click', (e) => {
            e.preventDefault();
            sentToTd.querySelectorAll('.mail-row').forEach(row => {
                row.style.display = row.classList.contains('unread') ? '' : 'none';
            });
            this.recolorRows(sentToTd);
        });
    },
    
    recolorRows: function(container) {
        let visibleIndex = 0;
        container.querySelectorAll('.mail-row').forEach(row => {
            if (row.style.display !== 'none') {
                row.className = row.className.replace(/\b(even|odd)\b/g, '').trim();
                row.classList.add(visibleIndex % 2 === 0 ? 'even' : 'odd');
                visibleIndex++;
            }
        });
    },
    
    initGangFeature: function() {
        console.log("GangHelper loaded on dashboard.");
        // TODO: Implement gang page specifics
    },

    initGangMemberList: function() {
        console.log("GangHelper loaded on member list page.");

        const style = document.createElement('style');
        style.textContent = `
            #sortabletable tbody tr.even td { background-color: #f3f3f3; }
            #sortabletable tbody tr.odd td { background-color: #ffffff; }
            #sortabletable tbody tr:hover td { background-color: #e8f4f8; }
        `;
        document.head.appendChild(style);

        let mainNav = document.querySelector('a.nav.show1');
        let battleNav = document.querySelector('a.nav.show2');
        let otherNav = document.querySelector('a.nav.show3');
        let hofNav = document.querySelector('a.nav.show4');

        // Non-staff only have main and hall of fame, so only require mainNav
        if (!mainNav) return;

        const navParent = mainNav.parentNode;
        Array.from(navParent.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue.includes('-')) {
                node.nodeValue = node.nodeValue.replace(/-/g, '');
            }
        });

        const turnIntoButton = (nav) => {
            if (!nav) return null;
            const btn = document.createElement('button');
            btn.textContent = nav.textContent;
            btn.style.cssText = 'font-size: 11px; padding: 4px 8px; border: 1px solid #aaa; border-radius: 4px; cursor: pointer; margin: 0 4px; user-select: none; -webkit-user-select: none;';
            
            if (nav.style.fontWeight === 'bold') {
                btn.style.fontWeight = 'bold';
                btn.style.background = '#add8e6';
                btn.style.borderColor = '#5f9ea0';
            } else {
                btn.style.fontWeight = 'normal';
                btn.style.background = '#fff';
                btn.style.borderColor = '#aaa';
            }
            
            nav.replaceWith(btn);
            return btn;
        };

        const availableNavs = [];
        mainNav = turnIntoButton(mainNav); if (mainNav) availableNavs.push(mainNav);
        battleNav = turnIntoButton(battleNav); if (battleNav) availableNavs.push(battleNav);
        otherNav = turnIntoButton(otherNav); if (otherNav) availableNavs.push(otherNav);
        hofNav = turnIntoButton(hofNav); if (hofNav) availableNavs.push(hofNav);

        const table = document.getElementById('sortabletable');
        if (!table) return;

        const headers = Array.from(table.querySelectorAll('th'));
        const cols = [];
        headers.forEach((th, index) => {
            const classList = Array.from(th.classList);
            const tsClass = classList.find(c => c.startsWith('ts_'));
            if (tsClass) {
                // Use textContent instead of innerText because innerText is empty for display:none elements
                let colName = th.textContent.replace(/↓/g, '').trim();
                if (!colName) {
                    colName = tsClass.replace('ts_', '');
                }
                cols.push({
                    id: tsClass,
                    name: colName,
                    index: index
                });
            }
        });

        const panel = document.createElement('div');
        panel.style.cssText = 'margin-bottom: 10px; padding: 10px; border: 1px solid #ccc; background: #eee; font-family: Tahoma, sans-serif; text-align: left; display: flex; flex-wrap: wrap; gap: 8px;';
        
        const savedColsStr = localStorage.getItem('hw_helper_gang_cols');
        const availableColIds = cols.map(c => c.id);
        let selectedCols = savedColsStr ? JSON.parse(savedColsStr) : ['ts_name', 'ts_level', 'ts_age', 'ts_la', 'ts_chamber', 'ts_tired', 'ts_options'];
        
        // Filter out any columns that aren't available to this user
        selectedCols = selectedCols.filter(id => availableColIds.includes(id));

        const renderCols = () => {
            cols.forEach(col => {
                const isSelected = selectedCols.includes(col.id);
                // The actual cells have the same class name
                const cells = table.querySelectorAll(`.${col.id}`);
                cells.forEach(cell => {
                    cell.style.display = isSelected ? 'table-cell' : 'none';
                });
            });
            localStorage.setItem('hw_helper_gang_cols', JSON.stringify(selectedCols));
        };

        const updateCheckboxes = () => {
            cols.forEach(col => {
                const cb = document.getElementById(`hh_col_${col.id}`);
                if (cb) {
                    cb.checked = selectedCols.includes(col.id);
                    // Trigger change event to update button styles automatically
                    cb.dispatchEvent(new Event('change'));
                }
            });
        };

        cols.forEach(col => {
            const label = document.createElement('label');
            label.style.cssText = 'font-size: 11px; display: inline-flex; align-items: center; cursor: pointer; user-select: none; -webkit-user-select: none; padding: 4px 8px; border: 1px solid #aaa; border-radius: 4px; background: #ddd; transition: background 0.2s, border-color 0.2s;';
            
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.id = `hh_col_${col.id}`;
            cb.style.marginRight = '5px';
            cb.checked = selectedCols.includes(col.id);
            if (col.id === 'ts_name') cb.disabled = true; // Always show name

            const updateStyle = () => {
                if (cb.checked) {
                    label.style.background = '#add8e6';
                    label.style.borderColor = '#5f9ea0';
                } else {
                    label.style.background = '#ddd';
                    label.style.borderColor = '#aaa';
                }
            };
            updateStyle();

            cb.addEventListener('change', (e) => {
                if (e.target.checked) {
                    if (!selectedCols.includes(col.id)) selectedCols.push(col.id);
                } else {
                    selectedCols = selectedCols.filter(id => id !== col.id);
                }
                updateStyle();
                renderCols();
            });

            label.appendChild(cb);
            label.appendChild(document.createTextNode(col.name));
            panel.appendChild(label);
        });

        const showAllBtn = document.createElement('button');
        showAllBtn.textContent = 'Show All';
        showAllBtn.style.cssText = 'font-size: 11px; padding: 4px 8px; border: 1px solid #aaa; border-radius: 4px; background: #fff; cursor: pointer; font-weight: normal; margin-left: auto;';
        showAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            selectedCols = cols.map(c => c.id);
            updateCheckboxes();
            renderCols();
            [...availableNavs, showAllBtn].forEach(n => {
                n.style.fontWeight = 'normal';
                n.style.background = '#fff';
                n.style.borderColor = '#aaa';
            });
            showAllBtn.style.fontWeight = 'bold';
            showAllBtn.style.background = '#add8e6';
            showAllBtn.style.borderColor = '#5f9ea0';
        });
        panel.appendChild(showAllBtn);

        table.parentElement.insertBefore(panel, table);
        renderCols(); // initial render

        const hookNav = (nav, presetCols) => {
            if (!nav) return;
            // override the onclick
            nav.addEventListener('click', (e) => {
                e.preventDefault();
                selectedCols = presetCols.filter(c => availableColIds.includes(c));
                updateCheckboxes();
                renderCols();
                
                // update font weights
                [...availableNavs, showAllBtn].forEach(n => {
                    n.style.fontWeight = 'normal';
                    n.style.background = '#fff';
                    n.style.borderColor = '#aaa';
                });
                nav.style.fontWeight = 'bold';
                nav.style.background = '#add8e6';
                nav.style.borderColor = '#5f9ea0';
            });
        };

        hookNav(mainNav, ['ts_name', 'ts_level', 'ts_age', 'ts_la', 'ts_chamber', 'ts_tired', 'ts_options']);
        hookNav(battleNav, ['ts_name', 'ts_speed', 'ts_power', 'ts_strength', 'ts_tbs', 'ts_life', 'ts_options']);
        hookNav(otherNav, ['ts_name', 'ts_beg', 'ts_intel', 'ts_drinking', 'ts_mining', 'ts_options']);
        hookNav(hofNav, ['ts_name', 'ts_exp', 'ts_beg_income', 'ts_cash', 'ts_points', 'ts_tokens', 'ts_dps', 'ts_options']);
        
        // Remove the original script functions if possible, but overriding onclick and preventing default should be enough.
    },

    initGangHappenings: function() {
        console.log("GangHelper loaded on last happenings page.");

        // Verify this is the correct event by checking the raw HTML Structure
        const htmlContent = document.body.innerHTML || "";
        const isSundayFunday = /<b>\s*<u>Last Gang Happening Stats:<\/u><\/b>\s*Gangsters Sunday = Funday/i.test(htmlContent);

        if (!isSundayFunday) {
            console.log("GangHelper: Event is not 'Gangsters Sunday = Funday'. Aborting.");
            return;
        }

        // Verify user is Gang Staff by checking for Manage Loans access
        const isStaff = !!document.querySelector('a[href*="cmd=gang2&do=loans"]');
        if (!isStaff) {
            console.log("GangHelper: User is not Gang Staff. Aborting.");
            return;
        }

        console.log("GangHelper: 'Gangsters Sunday = Funday' event detected! Ready for next steps.");
        
        const table = document.querySelector('table[cellspacing="2"][cellpadding="3"]');
        if (!table) return;

        const panel = document.createElement('div');
        panel.style.cssText = 'margin-bottom: 15px; padding: 10px; border: 1px solid #ccc; background: #eee; font-family: Tahoma, sans-serif; text-align: left; max-width: 600px;';

        let savedTiers = JSON.parse(localStorage.getItem('hw_helper_sf_tiers') || '[]');
        if (savedTiers.length === 0) {
            savedTiers = [
                { min: 0, max: 100, rate: 60000 },
                { min: 100, max: 200, rate: 80000 },
                { min: 200, max: 300, rate: 100000 }
            ];
        }
        let maxPayout = parseInt(localStorage.getItem('hw_helper_sf_max') || '5000000', 10);

        let panelHtml = `
            <div style="font-weight: bold; margin-bottom: 10px; font-size: 14px;">Gangsters Sunday = Funday Payouts</div>
            <div id="hh_sf_tiers_container" style="margin-bottom: 10px;">
            </div>
            <div style="margin-bottom: 10px;">
                <button type="button" id="hh_sf_add_tier_btn" style="padding: 2px 6px; cursor: pointer; font-size: 11px;">+ Add Tier</button>
            </div>
            <label style="font-size: 11px; margin-right: 10px; font-weight: bold;">
                Max Payout per Hobo ($): 
                <input type="text" id="hh_sf_max" value="${maxPayout.toLocaleString()}" style="width: 100px; padding: 2px;">
            </label>
            <div style="margin-top: 15px;">
                <button type="button" id="hh_sf_save_btn" style="padding: 4px 10px; cursor: pointer; font-weight: bold; background: #ddd; border: 1px solid #999; border-radius: 3px;">
                    💾 Save Event Payouts
                </button>
                <span id="hh_sf_status" style="font-size: 11px; font-weight: bold; color: green; margin-left: 10px;"></span>
            </div>
        `;
        panel.innerHTML = panelHtml;
        table.parentElement.insertBefore(panel, table);

        const tiersContainer = document.getElementById('hh_sf_tiers_container');

        const renderTiers = () => {
            tiersContainer.innerHTML = '';
            savedTiers.forEach((tier, idx) => {
                const row = document.createElement('div');
                row.style.marginBottom = '5px';
                row.innerHTML = `
                    <span style="font-size: 11px; display: inline-block; width: 45px;">Tier ${idx + 1}:</span>
                    <input type="number" class="hh-sf-min" value="${tier.min}" style="width: 60px; padding: 2px; font-size: 11px;" placeholder="Min">
                    <span style="font-size: 11px;"> - </span>
                    <input type="number" class="hh-sf-max" value="${tier.max}" style="width: 60px; padding: 2px; font-size: 11px;" placeholder="Max">
                    <span style="font-size: 11px;"> pts @ $ </span>
                    <input type="text" class="hh-sf-rate" value="${tier.rate.toLocaleString()}" style="width: 80px; padding: 2px; font-size: 11px;" placeholder="Rate / pt">
                    <span style="font-size: 11px;"> per point </span>
                    <button type="button" class="hh-sf-del-tier" data-idx="${idx}" style="cursor:pointer; font-size:10px; margin-left:5px; color:red; border:1px solid red; background:none; border-radius:3px; user-select:none; -webkit-user-select:none;">X</button>
                `;
                tiersContainer.appendChild(row);
            });

            // Bind delete buttons
            tiersContainer.querySelectorAll('.hh-sf-del-tier').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.target.getAttribute('data-idx'), 10);
                    savedTiers.splice(idx, 1);
                    saveAndRenderTiers();
                });
            });

            // Bind inputs to update model on change
            tiersContainer.querySelectorAll('input').forEach(input => {
                input.addEventListener('change', () => {
                    updateTiersFromDOM();
                    saveAndRenderTiers();
                });
            });
        };

        const updateTiersFromDOM = () => {
            savedTiers = [];
            const rows = tiersContainer.children;
            for (let i = 0; i < rows.length; i++) {
                const min = parseInt(rows[i].querySelector('.hh-sf-min').value, 10) || 0;
                const max = parseInt(rows[i].querySelector('.hh-sf-max').value, 10) || 0;
                const rate = parseInt(rows[i].querySelector('.hh-sf-rate').value.replace(/,/g, ''), 10) || 0;
                savedTiers.push({ min, max, rate });
            }
        };

        const saveAndRenderTiers = () => {
            localStorage.setItem('hw_helper_sf_tiers', JSON.stringify(savedTiers));
            renderTiers();
        };

        document.getElementById('hh_sf_add_tier_btn').addEventListener('click', () => {
            updateTiersFromDOM();
            let nextMin = 0;
            if (savedTiers.length > 0) {
                nextMin = savedTiers[savedTiers.length - 1].max;
            }
            savedTiers.push({ min: nextMin, max: nextMin + 100, rate: 0 });
            saveAndRenderTiers();
        });

        document.getElementById('hh_sf_max').addEventListener('change', (e) => {
            const val = parseInt(e.target.value.replace(/,/g, ''), 10) || 0;
            localStorage.setItem('hw_helper_sf_max', val.toString());
            e.target.value = val.toLocaleString();
        });

        renderTiers();

        document.getElementById('hh_sf_save_btn').addEventListener('click', () => {
            updateTiersFromDOM();
            localStorage.setItem('hw_helper_sf_tiers', JSON.stringify(savedTiers));
            const currentMaxPayoutStr = document.getElementById('hh_sf_max').value;
            const currentMaxPayout = parseInt(currentMaxPayoutStr.replace(/,/g, ''), 10) || 0;
            localStorage.setItem('hw_helper_sf_max', currentMaxPayout.toString());

            const rows = table.querySelectorAll('tr[bgcolor="#F3F3F3"], tr[bgcolor="#DCDCDC"]');

            const payments = [];

            Array.from(rows).forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length < 2) return;
                
                const link = cells[0].querySelector('a');
                if (!link) return;

                const nameText = link.textContent.trim();
                const urlParams = new URLSearchParams(link.href.split('?')[1]);
                const hoboId = urlParams.get('ID');

                const scoreText = cells[1].textContent.replace(/,/g, '').trim();
                const score = parseInt(scoreText, 10);

                if (hoboId && !isNaN(score) && score > 0) {
                    let payout = 0;

                    savedTiers.forEach(tier => {
                        if (score > tier.min) {
                            const ptsInTier = Math.min(score, tier.max) - tier.min;
                            if (ptsInTier > 0) {
                                payout += ptsInTier * tier.rate;
                            }
                        }
                    });

                    if (payout > currentMaxPayout) payout = currentMaxPayout;

                    // Only generate payment if payout is greater than 0
                    if (payout > 0) {
                        payments.push({
                            id: hoboId,
                            name: nameText,
                            description: `Stats: Sunday=Funday (Score: ${score})`,
                            amount: '$' + payout.toLocaleString(),
                            timestamp: Date.now(),
                            completed: false,
                            cleared: false
                        });
                    }
                }
            });

            if (payments.length > 0) {
                const topicName = "Gangsters Sunday = Funday Payouts";
                const savedPosts = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                savedPosts[topicName] = {
                    timestamp: Date.now(),
                    topic: topicName,
                    totalHobos: 0,
                    hobos: [],
                    paymentsToHobos: payments
                };
                localStorage.setItem('hw_helper_gang_posts', JSON.stringify(savedPosts));
                
                const statusEl = document.getElementById('hh_sf_status');
                statusEl.textContent = `✅ Saved ${payments.length} payouts to Gang Loans dashboard!`;
                setTimeout(() => { statusEl.textContent = ''; }, 3000);
            } else {
                const statusEl = document.getElementById('hh_sf_status');
                statusEl.style.color = 'red';
                statusEl.textContent = `❌ No payouts to save (check if scores/tiers yield $0).`;
                setTimeout(() => { statusEl.textContent = ''; statusEl.style.color = 'green'; }, 3000);
            }
        });
    }
};
