const GangHelper = {
    cmds: 'gang',
    settings: [
        { key: 'GangHelper_EnableFeature', label: 'Enable Gang Helper' }
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
            }
        }
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
        panel.style.cssText = 'margin-bottom: 15px; padding: 10px; border: 1px solid #ccc; background: #eee; font-family: Tahoma, sans-serif; text-align: left;';
        
        panel.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">Gangsters Sunday = Funday Payouts</div>
            <label style="font-size: 11px; margin-right: 10px;">
                Amount per Point ($): 
                <input type="number" id="hh_sf_rate" value="1000" style="width: 80px; padding: 2px;">
            </label>
            <label style="font-size: 11px; margin-right: 10px;">
                Max Payout per Hobo ($): 
                <input type="number" id="hh_sf_max" value="500000" style="width: 100px; padding: 2px;">
            </label>
            <button type="button" id="hh_sf_save_btn" style="padding: 3px 8px; cursor: pointer; font-weight: bold; background: #ddd; border: 1px solid #999; border-radius: 3px;">
                💾 Save Event Payouts
            </button>
            <span id="hh_sf_status" style="font-size: 11px; font-weight: bold; color: green; margin-left: 10px;"></span>
        `;

        table.parentElement.insertBefore(panel, table);

        document.getElementById('hh_sf_save_btn').addEventListener('click', () => {
            const rows = table.querySelectorAll('tr[bgcolor="#F3F3F3"], tr[bgcolor="#DCDCDC"]');
            const rate = parseInt(document.getElementById('hh_sf_rate').value, 10) || 1000;
            const maxPayout = parseInt(document.getElementById('hh_sf_max').value, 10) || 500000;

            const payments = [];

            Array.from(rows).forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length < 2) return;
                
                const link = cells[0].querySelector('a');
                if (!link) return;

                const nameText = link.innerText.trim();
                const urlParams = new URLSearchParams(link.href.split('?')[1]);
                const hoboId = urlParams.get('ID');

                const scoreText = cells[1].innerText.replace(/,/g, '').trim();
                const score = parseInt(scoreText, 10);

                if (hoboId && !isNaN(score) && score > 0) {
                    let payout = score * rate;
                    if (payout > maxPayout) payout = maxPayout;

                    payments.push({
                        id: hoboId,
                        name: nameText,
                        description: `Stats: Sunday=Funday (Score: ${score})`,
                        amount: payout.toString(),
                        timestamp: Date.now(),
                        completed: false,
                        cleared: false
                    });
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
                statusEl.innerText = `✅ Saved ${payments.length} payouts to Gang Loans dashboard!`;
                setTimeout(() => { statusEl.innerText = ''; }, 3000);
            }
        });
    }
};
