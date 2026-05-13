const MinesHelper = {
    cmds: 'mines',
    group: 'Canbodia',

    settings: [
        { key: 'MinesHelper_TopMinersTable', label: 'Format Top Miners Table', type: 'checkbox', default: true },
        { key: 'MinesHelper_ThreeColumnLayout', label: 'Use Three Column Layout', type: 'checkbox', default: true },
        { key: 'MinesHelper_EnlargeMap', label: 'Enlarge Map Size', type: 'checkbox', default: true },
        { key: 'MinesHelper_StyleButtons', label: 'Style Buttons & Links', type: 'checkbox', default: true },
        { key: 'MinesHelper_SafeZones', label: 'Highlight Safe Zones', type: 'checkbox', default: true },
        { key: 'MinesHelper_ActiveTable', label: 'Format Active List into Table', type: 'checkbox', default: true },
        { key: 'MinesHelper_FormatStats', label: 'Format Mining Stats', type: 'checkbox', default: true },
        { key: 'MinesHelper_FormatOres', label: 'Format Ores & Shards', type: 'checkbox', default: true },
        { key: 'MinesHelper_FormatTrades', label: 'Format Trading Post', type: 'checkbox', default: true },
        { key: 'MinesHelper_Log', label: 'Enable Mining Log', type: 'checkbox', default: true }
    ],

    init: function() {
        Utils.log('MinesHelper initialized');
        const settings = Utils.getSettings();

        if (settings['MinesHelper_StyleButtons'] !== false) {
            this.styleLobbyLinks();
            this.styleInsideLinks();
        }

        if (settings['MinesHelper_SafeZones'] !== false) {
            try { this.markSafeZones(); } catch (e) { Utils.log(e); }
        }

        if (settings['MinesHelper_ActiveTable'] !== false) {
            try { this.formatActiveList(); } catch (e) { Utils.log(e); }
        }

        if (settings['MinesHelper_EnlargeMap'] !== false) {
            try { this.enlargeMap(); } catch (e) { Utils.log(e); }
        }

        if (settings['MinesHelper_FormatStats'] !== false) {
            try { this.formatStats(); } catch (e) { Utils.log(e); }
        }

        try { this.extractTradeStats(); } catch (e) { Utils.log(e); }

        // Run formatTrades before formatOres so that oreStockMap can safely read the untouched DOM
        if (settings['MinesHelper_FormatTrades'] !== false) {
            try { this.formatTrades(); } catch (e) { Utils.log(e); }
        }

        if (settings['MinesHelper_FormatOres'] !== false) {
            try { this.formatOres(); } catch (e) { Utils.log(e); }
        }

        if (settings['MinesHelper_TopMinersTable'] !== false) {
            try { this.formatTopMinersTable(); } catch (e) { Utils.log(e); }
        }

        if (settings['MinesHelper_Log'] !== false) {
            try { this.processMiningLog(); } catch (e) { Utils.log(e); }
        }

        if (settings['MinesHelper_ThreeColumnLayout'] !== false) {
            try { this.formatThreeColumnLayout(); } catch (e) { Utils.log(e); }
        }

        if (settings['MinesHelper_HighlightPlayers'] !== false) {
            try { this.highlightPlayers(); } catch (e) { Utils.log(e); }
        }

        if (settings['MinesHelper_ThreeColumnLayout'] !== false) {
            try { this.buildMiniMapActiveList(); } catch (e) { Utils.log(e); }
        }

        // Setup active view layout overrides
        if (window.location.search.includes('view=active')) {
            const contentArea = document.querySelector('.content-area');
            if (contentArea) {
                contentArea.style.display = 'flex';
                contentArea.style.flexDirection = 'column';
                contentArea.style.alignItems = 'center';
            }
        }
    },

    widenView: function() {
        // Expand the container specifically for the mines for better visibility
        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            contentArea.style.width = '100%';
            contentArea.style.maxWidth = '1000px';
        }
    },

    formatThreeColumnLayout: function() {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        // Widen the view for better visibility of 3 columns
        contentArea.style.width = '100%';
        contentArea.style.maxWidth = '1000px';

        // Skip non-standard pages
        if (window.location.search.includes('view=active') || window.location.search.includes('do=trade') || window.location.search.includes('what=trade')) {
            return;
        }

        const mainTables = contentArea.querySelectorAll('table[width="100%"]');
        let layoutTable = null;
        for (const t of mainTables) {
            const cells = t.querySelectorAll('td[width="70%"], td[width="30%"]');
            if (cells.length >= 2) {
                layoutTable = t;
                break;
            }
        }

        if (!layoutTable) return;

        const tbody = layoutTable.querySelector('tbody');
        if (!tbody) return;
        const tr = tbody.querySelector('tr[valign="top"]') || tbody.querySelector('tr');
        if (!tr) return;

        const tds = Array.from(tr.querySelectorAll(':scope > td'));
        if (tds.length < 2) return;

        const navTd = tds[0];
        const mapTd = tds[1];

        const mapCell = document.getElementById('1001');
        const mapTable = mapCell ? mapCell.closest('table') : mapTd.querySelector('table');

        if (!mapTable) return;

        let statsElement = null;
        const divs = mapTd.querySelectorAll('div[align="left"]');
        for (const d of divs) {
            if (d.textContent.includes('Mine Section')) {
                statsElement = d;
                break;
            }
        }
        if (!statsElement) {
            const centers = mapTd.querySelectorAll('center');
            for (const c of centers) {
                if (c.textContent.includes('Mine Section')) {
                    statsElement = c;
                    break;
                }
            }
        }

        if (!statsElement) return;

        navTd.setAttribute('width', '40%');
        mapTd.setAttribute('width', '30%');

        const leftTd = document.createElement('td');
        leftTd.setAttribute('width', '30%');
        leftTd.setAttribute('valign', 'top');
        leftTd.style.paddingTop = '10px';

        leftTd.appendChild(statsElement);
        tr.insertBefore(leftTd, navTd);
    },

    processMiningLog: function() {
        let newExp = 0;
        let newOres = [];
        let newSaves = [];
        let tUsedVal = 0;
        let shouldLog = false;
        let serverTUsed = null;
        let serverExp = null;

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        let hasActionText = false;
        const html = contentArea.innerHTML || '';

        // Exclude trade pages from action parsing
        if (!globalThis.location.href.includes('do=trade') && !globalThis.location.href.includes('what=trade')) {
            if (html.includes('You gain') || html.includes('You get the') || html.includes('Suddenly the wall crumbles') || html.includes('hit a sweet spot') || html.includes('narrowly avoid') || html.includes('ROCKSLIDE') || html.includes('trapped back there')) {
                const expMatchText = html.replaceAll(/<[^>]+>/g, '');
                const expMatch = /You gain(?:ed)?\s*([\d.]+)\s*mining/i.exec(expMatchText);
                if (expMatch) newExp += Number.parseFloat(expMatch[1]);

                const oreRegex = /You get (?:the )?(?:\((?:<b>)?(\d+)(?:<\/b>)?\)\s+)?(?:<b>)?([A-Za-z]+ ?[A-Za-z]+?)(?:<\/b>)?(?=\s*(?:<a|<br>|<\/span>|<img)|$)/gi;
                let match;
                while ((match = oreRegex.exec(html)) !== null) {
                    let count = Number.parseInt(match[1]) || 1;
                    let name = match[2].trim();
                    name = name.replace(/^(.+)\s+\1$/i, '$1');

                    if (count > 1) {
                        name = name.replace(/ Ores$/i, ' Ore').replace(/ Shards$/i, ' Shard');
                    }

                    // Ignore equipment items or non-ores that mistakenly match the parser
                    const ignoredItems = ['Spelunking Satchel', 'Spelunking Sachel', 'Pickaxe', 'Lantern', 'Helmet', 'Hard Helmet'];
                    if (ignoredItems.some(item => name.toLowerCase().includes(item.toLowerCase()))) {
                        continue;
                    }

                    for (let i = 0; i < count; i++) {
                        newOres.push(name);
                    }
                }

                const saveRegex = /pull\s+<a[^>]+ID=(\d+)[^>]*>([^<]+)<\/a>\s+out to safety/gi;
                let saveMatch;
                while ((saveMatch = saveRegex.exec(html)) !== null) {
                    newSaves.push({ id: saveMatch[1], name: saveMatch[2] });
                }

                hasActionText = true;
            }
        }

        let currentSection = null;
        let currentTUsed = null;
        let tFound = false;

        const centers = contentArea.querySelectorAll('center');
        for (const c of centers) {
            if (c.textContent.includes('T used:') && c.textContent.includes('Mining')) {
                const text = c.textContent;
                const sectionMatch = /Section\s*(\d+)/i.exec(text);
                const tMatch = /T used:\s*([\d,]+)/i.exec(text);

                if (sectionMatch && tMatch) {
                    currentSection = Number.parseInt(sectionMatch[1], 10);
                    currentTUsed = Number.parseInt(tMatch[1].replaceAll(/,/g, ''), 10);
                    tFound = true;
                }
                break;
            }
        }

        if (!tFound) {
            const allTds = contentArea.querySelectorAll('td');
            for (const t of allTds) {
                if (t.textContent.trim() === 'T used:') {
                    const nextTd = t.nextElementSibling;
                    if (nextTd) {
                        currentTUsed = Number.parseInt(nextTd.textContent.replaceAll(/,/g, ''), 10) || 0;
                        currentSection = -1;
                        tFound = true;
                    }
                    break;
                }
            }
        }

        let isBackForward = performance.getEntriesByType("navigation")[0]?.type === "back_forward" || performance.navigation?.type === 2;
        let isRefresh = isBackForward;

        if (tFound && currentTUsed !== null) {
            let lastState = null;
            try {
                lastState = JSON.parse(Utils.getItem('hw_mines_last_state') || 'null');
            } catch(e) {
                Utils.log(e);
            }

            if (lastState && lastState.section === currentSection) {
                if (currentTUsed > lastState.tUsed) {
                    tUsedVal = currentTUsed - lastState.tUsed;
                } else if (currentTUsed < lastState.tUsed) {
                    tUsedVal = currentTUsed;
                } else {
                    tUsedVal = 0;
                    isRefresh = true;
                }
            } else {
                tUsedVal = currentTUsed;
            }

            if (isBackForward) {
                tUsedVal = 0;
            } else {
                Utils.setItem('hw_mines_last_state', JSON.stringify({ section: currentSection, tUsed: currentTUsed }));
            }
        }

        // Canvas/Blast screen parsing
        if (html.includes('Mine stat:')) {
            const blastTextHtml = contentArea.innerHTML.replace(/<[^>]+>/g, ' ');
            const blastMatch = /T used:\s*([\d,]+)\s*,\s*Mine stat:\s*([\d.]+)\s*,\s*Ore found:\s*([\d,]+)(?:\s*\[\s*([\d,]+)\s*\])?/i.exec(blastTextHtml);

            if (blastMatch) {
                const blastT = Number.parseInt(blastMatch[1].replace(/,/g, ''), 10) || 0;
                const blastExp = Number.parseFloat(blastMatch[2]) || 0;

                serverTUsed = blastT;
                serverExp = blastExp;

                let lastBlast = { t: 0, exp: 0 };
                try { lastBlast = JSON.parse(Utils.getItem('hw_mines_blast_state') || '{"t":0,"exp":0}'); } catch(e) {}

                let dT = 0, dExp = 0;

                if (blastT >= lastBlast.t) {
                    dT = blastT - lastBlast.t;
                    dExp = blastExp - lastBlast.exp;
                } else {
                    dT = blastT;
                    dExp = blastExp;
                }

                // Never count negatives
                if (dT < 0) dT = 0;
                if (dExp < 0) dExp = 0;

                if (isBackForward) {
                    dT = 0;
                    dExp = 0;
                }

                if (dT > 0 || dExp > 0) {
                    if (newExp < dExp) newExp = dExp;
                    if (dT > tUsedVal) tUsedVal = dT;

                    shouldLog = true;
                    isRefresh = false;
                }

                if (!isBackForward) {
                    Utils.setItem('hw_mines_blast_state', JSON.stringify({ t: blastT, exp: blastExp }));
                }
            }
        }

        if (isRefresh) {
            hasActionText = false;
            newExp = 0;
            newOres = [];
            newSaves = [];
        }

        if (hasActionText || tUsedVal > 0) shouldLog = true;

        let today = 'Unknown';
        try {
            const hoboDate = Utils.getHoboDateTime();
            if (hoboDate) {
                today = `${hoboDate.getFullYear()}-${String(hoboDate.getMonth() + 1).padStart(2, '0')}-${String(hoboDate.getDate()).padStart(2, '0')}`;
            } else {
                today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
            }
        } catch (err) {
            Utils.log(err);
            today = new Date().toISOString().split('T')[0];
        }

        let logData = {};
        try {
            logData = JSON.parse(Utils.getItem('hw_mines_log_data') || '{}');
        } catch (e) {
            Utils.log(e);
            logData = {};
        }

        if (!logData || typeof logData !== 'object' || Array.isArray(logData)) {
            logData = {};
        }

        let initializedNewDay = false;
        if (!logData[today] || typeof logData[today] !== 'object' || !logData[today].ores) {
            logData[today] = { exp: 0, tUsed: 0, ores: {}, saves: [] };
            if (currentTUsed !== null && currentTUsed > 0 && currentSection !== -1) {
                logData[today].tUsed = currentTUsed;
            }
            initializedNewDay = true;
        }

        if (shouldLog || initializedNewDay) {
            if (shouldLog) {
                logData[today].exp = (Number.parseFloat(logData[today].exp) || 0) + newExp;

                let bestT = null;
                if (serverTUsed !== null && serverTUsed >= 0) {
                    bestT = serverTUsed;
                } else if (currentTUsed !== null && currentTUsed >= 0) {
                    bestT = currentTUsed;
                }

                if (bestT !== null) {
                    logData[today].tUsed = bestT;
                } else if (!initializedNewDay || logData[today].tUsed === 0) {
                    logData[today].tUsed = (Number.parseInt(logData[today].tUsed) || 0) + tUsedVal;
                }

                if (serverExp !== null && serverExp >= 0) {
                    logData[today].exp = serverExp;
                }

                if (typeof logData[today].ores !== 'object') {
                    logData[today].ores = {};
                }

                if (!Array.isArray(logData[today].saves)) {
                    logData[today].saves = [];
                }

                for (const ore of newOres) {
                    logData[today].ores[ore] = (logData[today].ores[ore] || 0) + 1;
                }

                if (newSaves.length > 0) {
                    logData[today].saves.push(...newSaves);
                }
            }

            for (const d of Object.keys(logData)) {
                if (d === today) continue;
                const data = logData[d];
                if (!data) continue;
                const dailyExp = Number.parseFloat(data.exp) || 0;
                const dailyOresCount = Object.values(data.ores || {}).reduce((sum, count) => sum + (Number.parseInt(count) || 0), 0);
                const dailySavesCount = Array.isArray(data.saves) ? data.saves.length : 0;
                if (dailyExp === 0 && dailyOresCount === 0 && dailySavesCount === 0) {
                    delete logData[d];
                }
            }

            Utils.setItem('hw_mines_log_data', JSON.stringify(logData));
        }

        if (logData[today]) {
            const todayStats = Number.parseFloat(logData[today].exp) || 0;
            const todayOres = Object.values(logData[today].ores || {}).reduce((sum, count) => sum + (Number.parseInt(count) || 0), 0);
            Utils.setItem('hw_MinesHelper_TodayStats', todayStats.toFixed(2));
            Utils.setItem('hw_MinesHelper_TodayOres', todayOres.toString());
        }

        const logWrapper = document.createElement('div');
        logWrapper.style.cssText = 'margin: 20px auto; max-width: 800px; padding: 10px; background: #fdfdfd; border: none; border-radius: 4px;';

        let logHtml = '<h3 style="margin-top: 0; text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Mining Log</h3>';

        const dates = Object.keys(logData).sort((a,b) => {
            const dA = new Date(a);
            const dB = new Date(b);
            return (isNaN(dB) ? 0 : dB) - (isNaN(dA) ? 0 : dA);
        });

        if (dates.length === 0) {
            logHtml += '<div style="text-align: center; padding: 10px; color: #666;">No mining history recorded yet.</div>';
        }

        const oreImages = OresData;

        if (dates.length > 0) {
            for (const date of dates) {
                const data = logData[date];
                if (!data || typeof data !== 'object' || !data.ores || typeof data.ores !== 'object') continue;

                const dailyExpCheck = Number.parseFloat(data.exp) || 0;
                const dailyOresCheck = Object.values(data.ores || {}).reduce((sum, count) => sum + (Number.parseInt(count) || 0), 0);
                const dailySavesCheck = Array.isArray(data.saves) ? data.saves.length : 0;
                if (date !== today && dailyExpCheck === 0 && dailyOresCheck === 0 && dailySavesCheck === 0) continue;

                logHtml += `<div style="margin-bottom: 10px; border: 1px solid #eee; background: #fff; padding: 8px;">`;
                logHtml += `<div style="font-weight: bold; background: #f0f0f0; padding: 4px; margin: -8px -8px 8px -8px; display: flex; justify-content: space-between; align-items: center;">
                                <span>${date}</span>
                                <a href="javascript:void(0);" class="clear-log-btn" data-date="${date}" style="color: #d9534f; text-decoration: none; font-size: 11px; font-weight: normal; padding: 2px 6px; border: 1px solid #d9534f; border-radius: 3px; background: 
#fff;">Clear</a>
                            </div>`;
                logHtml += `<div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px;">`;

                const expFixed = (parseFloat(data.exp) || 0).toFixed(2);

                const totalActualOres = Object.entries(data.ores).reduce((a, [name, count]) => {
                    const c = parseInt(count) || 0;
                    return a + c;
                }, 0);

                const totalImpliedOres = totalActualOres + Object.entries(data.ores).reduce((a, [name, count]) => {
                    const c = parseInt(count) || 0;
                    // Adds an extra x2 for shards making them effectively count as x3 total
                    return a + ((name && name.toLowerCase().includes('shard')) ? c * 2 : 0);
                }, 0);

                const tUsedSafe = parseInt(data.tUsed) || 0;
                
                const actualOresPerT = tUsedSafe > 0 ? (totalActualOres / tUsedSafe).toFixed(3) : '0.000';
                const impliedOresPerT = tUsedSafe > 0 ? (totalImpliedOres / tUsedSafe).toFixed(3) : '0.000';
                const expPerT = tUsedSafe > 0 ? (parseFloat(data.exp) / tUsedSafe).toFixed(3) : '0.000';

                logHtml += `<div style="text-align: left;">`;
                logHtml += `<div><b>Exp Gained:</b> ${expFixed}</div>`;
                logHtml += `<div><b>Exp/T:</b> ${expPerT}</div>`;
                logHtml += `</div>`;

                logHtml += `<div style="text-align: right;">`;
                logHtml += `<div><i>(Hobalt Shards count as 1)</i> <b>Actual Ore/T:</b> ${actualOresPerT} (${totalActualOres} from ${tUsedSafe}T)</div>`;
                logHtml += `<div><i>(Hobalt Shards count as 3)</i> <b>Implied Ore/T:</b> ${impliedOresPerT} (${totalImpliedOres} from ${tUsedSafe}T)</div>`;
                logHtml += `</div>`;
                logHtml += `</div>`;

                if (Object.keys(data.ores).length > 0) {
                    logHtml += `<div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">`;
                    for (const [ore, count] of Object.entries(data.ores)) {
                        let normalizedOre = String(ore).toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                        let oreImageSrc = oreImages[normalizedOre] || oreImages[ore] || '';

                        if (!oreImageSrc) {
                            const existingImg = document.querySelector(`img[title="${ore}"], img[alt="${ore}"]`);
                            if (existingImg) oreImageSrc = existingImg.src;
                            if (!oreImageSrc) {
                                const existingImgNorm = document.querySelector(`img[title="${normalizedOre}"], img[alt="${normalizedOre}"]`);
                                if (existingImgNorm) oreImageSrc = existingImgNorm.src;
                            }
                        }

                        let bgCss = oreImageSrc ? `background-image: url('${oreImageSrc}'); background-repeat: no-repeat; background-position: center top 4px; background-size: 32px; background-color: #fff;` : `background: #fff;`;
                            let textMargin = oreImageSrc ? 'margin-top: auto;' : '';

                            logHtml += `
                                <div style="display: inline-flex; flex-direction: column; align-items: center; justify-content: center; width: 80px; min-height: 75px; padding: 4px 4px 18px 4px; border: 1px solid #c0c0c0; border-radius: 4px; color: #000; position: relative; box-sizing: border-box; font-family: Arial, sans-serif; ${bgCss}">
                                    <span style="font-size: 11px; line-height: 1.2; text-align: center; width: 100%; display: block; margin-bottom: 2px; ${textMargin}">${ore}</span>
                                    <div style="font-size: 12px; font-weight: bold; color: #0055aa; position: absolute; bottom: 4px; text-shadow: 1px 1px 0px #fff, -1px -1px 0px #fff, 1px -1px 0px #fff, -1px 1px 0px #fff;">${count}</div>
                                </div>`;
                    }
                    logHtml += `</div>`;
                } else {
                    logHtml += `<div style="font-size: 11px; color: #999;">No ores found on this day.</div>`;
                }

                if (data.saves && data.saves.length > 0) {
                    logHtml += `<div style="margin-top: 8px; font-size: 12px; padding-top: 5px; border-top: 1px solid #f0f0f0;"><b>Hobos Saved:</b> `;
                    const saveMap = {};
                    for (const s of data.saves) {
                        if (!saveMap[s.id]) saveMap[s.id] = { name: s.name, count: 0 };
                        saveMap[s.id].count++;
                    }
                    const saveLinks = Object.entries(saveMap).map(([id, info]) => {
                        const countStr = info.count > 1 ? ` (x${info.count})` : '';
                        return `<a href="game.php?cmd=player&ID=${id}" class="black_dark_link" style="text-decoration: underline;">${info.name}</a>${countStr}`;
                    });
                    logHtml += saveLinks.join(', ');
                    logHtml += `</div>`;
                }

                logHtml += `</div>`;
            }
        }

        logWrapper.innerHTML = logHtml;
        contentArea.appendChild(logWrapper);

        const clearBtns = logWrapper.querySelectorAll('.clear-log-btn');
        clearBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const d = btn.getAttribute('data-date');
                if (globalThis.confirm(`Are you sure you want to clear the mining log for ${d}?`)) {
                    let st = {};
                    try {
                        st = JSON.parse(Utils.getItem('hw_mines_log_data') || '{}');
                    } catch(err) {
                        Utils.log(err);
                    }
                    delete st[d];
                    Utils.setItem('hw_mines_log_data', JSON.stringify(st));
                    globalThis.location.reload();
                }
            });
        });
    },

    formatTrades: function() {
        const tradeTable = document.querySelector('table[cellpadding="0"][cellspacing="0"]');
        if (!tradeTable) return;

        const rows = tradeTable.querySelectorAll('tr');
        if (rows.length < 2) return;

        // Verify this is the trade table
        if (!rows[0].textContent.includes('Give me')) return;

        const container = document.createElement('div');
        container.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin: 15px auto; max-width: 800px; padding: 10px; background: #f8f9fc; border: 1px solid #d3e0f0; border-radius: 6px;';

        const oreStockMap = {};
        const stockSpans = document.querySelectorAll('span[id^="exc_ore_stock_"]');
        stockSpans.forEach(span => {
            let current = span.previousElementSibling;
            let img = null;
            while (current) {
                if (current.tagName === 'A' && current.querySelector('img')) {
                    img = current.querySelector('img');
                    break;
                }
                current = current.previousElementSibling;
            }
            if (!img && span.closest('div')) {
                img = span.closest('div').querySelector('img');
            }
            if (img) {
                const name = img.title || img.alt;
                if (name) oreStockMap[name.trim()] = parseInt(span.textContent, 10) || 0;
            }
        });

        const cards = [];
        let summaryHtml = null;

        // Skip the header row
        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].querySelectorAll('td');

            // Some rows are just text (like the Net stat gain summary at the bottom)
            if (cells.length === 1 && cells[0].hasAttribute('colspan')) {
                summaryHtml = cells[0].innerHTML;
                continue;
            }

            if (cells.length < 2) continue;

            const giveHtmlNode = cells[0];
            const getHtmlNode = cells[1];

            const imgNode = giveHtmlNode.querySelector('img');
            const linkNode = giveHtmlNode.querySelector('a');

            // Re-construct the requirement text cleanly
            let reqText = giveHtmlNode.textContent.trim();
            let reqName = reqText;
            let reqAmount = 1;
            const reqMatch = reqText.match(/^(.*?)\s*\((\d+)\)$/);
            if (reqMatch) {
                reqName = reqMatch[1].trim();
                reqAmount = parseInt(reqMatch[2], 10) || 1;
            }

            // Extract stats and force them onto unique lines
            const statHtml = getHtmlNode.innerHTML.replaceAll(/<\/font>\s*,\s*<font/g, '</font><font')
                                                  .replaceAll(/<font color="?green"?>/g, '<span style="color: green; font-weight: bold; display: block; margin-bottom: 2px;">')
                                                  .replaceAll(/<font color="?red"?>/g, '<span style="color: #d9534f; font-weight: bold; display: block;">')
                                                  .replaceAll(/<\/font>/g, '</span>');

            const card = document.createElement(linkNode ? 'a' : 'div');
            card.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 5px;
                width: 140px;
                min-height: 85px;
                padding: 10px;
                background: #fff;
                border: 1px solid #c0c0c0;
                border-radius: 6px;
                text-decoration: none;
                color: #000;
                transition: transform 0.1s, box-shadow 0.1s;
                position: relative;
            `;

            if (linkNode) {
                card.href = linkNode.href;
                card.style.cursor = 'pointer';
                card.onmouseover = () => {
                    card.style.borderColor = '#888';
                    card.style.transform = 'scale(1.03)';
                };
                card.onmouseout = () => {
                    card.style.borderColor = '#c0c0c0';
                    card.style.transform = 'none';
                };
            } else {
                // If it lacks a link, it's not tradable, so visually ghost it
                card.style.background = '#f9f9f9';
                card.style.opacity = '0.6';
            }

            if (imgNode) {
                imgNode.removeAttribute('align');
                imgNode.style.marginBottom = '5px';
            }

            const topSection = document.createElement('div');
            topSection.style.cssText = 'display: flex; flex-direction: column; align-items: center;';
            if (imgNode) topSection.appendChild(imgNode);

            const nameSpan = document.createElement('span');
            nameSpan.style.cssText = 'font-size: 12px; font-weight: bold; text-align: center; margin-bottom: 2px;';
            nameSpan.textContent = reqText;
            topSection.appendChild(nameSpan);

            card.appendChild(topSection);

            const statSection = document.createElement('div');
            statSection.style.cssText = 'font-size: 11px; text-align: center; line-height: 1.4;';
            statSection.innerHTML = statHtml;
            card.appendChild(statSection);

            if (linkNode && oreStockMap[reqName] !== undefined) {
                const tradesPossible = Math.floor(oreStockMap[reqName] / reqAmount);
                const badgeBg = tradesPossible > 0 ? '#5fd05f' : '#d9534f';
                const badgeHtml = `<div style="position: absolute; top: -6px; right: -6px; background: ${badgeBg}; color: #fff; font-size: 11px; font-weight: bold; padding: 2px 6px; border-radius: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.3); z-index: 2;">${tradesPossible}</div>`;
                card.insertAdjacentHTML('beforeend', badgeHtml);
            }

            card.dataset.oreName = reqName;
            cards.push(card);
        }

        // Group rows as requested
        const rowGroups = [
            ['Green Ore', 'White Ore', 'Yellow Ore'],
            ['Orange Ore', 'Red Ore', 'Purple Ore'],
            ['Black Ore']
        ];

        rowGroups.forEach(group => {
            const groupCards = [];
            group.forEach(oreName => {
                const idx = cards.findIndex(c => c.dataset.oreName === oreName);
                if (idx !== -1) {
                    groupCards.push(cards[idx]);
                    cards.splice(idx, 1);
                }
            });

            if (groupCards.length > 0) {
                const rowContainer = document.createElement('div');
                rowContainer.style.cssText = 'display: flex; gap: 10px; justify-content: center; width: 100%;';
                groupCards.forEach(c => rowContainer.appendChild(c));
                container.appendChild(rowContainer);
            }
        });

        // Add remaining items (Hobalt pieces)
        const leftoverContainer = document.createElement('div');
        leftoverContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; width: 100%;';
        cards.forEach(card => leftoverContainer.appendChild(card));
        if (leftoverContainer.children.length > 0) {
            container.appendChild(leftoverContainer);
        }

        if (summaryHtml) {

            const summary = document.createElement('div');
            summary.style.cssText = 'width: 100%; text-align: center; margin-top: 10px; font-size: 12px; color: #333;';
            summary.innerHTML = summaryHtml;
            container.appendChild(summary);
        }

        tradeTable.parentNode.replaceChild(container, tradeTable);
    },

    formatOres: function() {
        // 1. Process standard <center> tags with ores (Main page & top list on Trade page)
        const centerTags = document.querySelectorAll('.content-area center');
        for (const c of centerTags) {
            const firstImg = c.querySelector('img');
            if (firstImg && firstImg.title && (firstImg.title.includes('Ore') || firstImg.title.includes('Hobalt'))) {
                this.formatRawOreContainer(c, false);
            }
        }

        // 2. Process the Trading page "Exchange" selected ores container
        const formTd = document.querySelector('form[action*="do=trade"]');
        if (formTd) {
            const formSpans = formTd.querySelectorAll('span[id^="exc_ore_show_"]');
            if (formSpans.length > 0) {
                const flexContainer = document.createElement('div');
                flexContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin: 10px auto; max-width: 800px;';
                
                formSpans[0].parentNode.insertBefore(flexContainer, formSpans[0]);
                
                formSpans.forEach(span => {
                    flexContainer.appendChild(span);
                    this.formatRawOreContainer(span, true);
                });
            }
        }
    },

    formatRawOreContainer: function(container, isSingleSpan = false) {
        const items = [];
        let currentItem = null;

        Array.from(container.childNodes).forEach(node => {
            if (node.nodeType === 1 && (node.tagName === 'IMG' || node.tagName === 'A')) {
                const img = node.tagName === 'IMG' ? node : node.querySelector('img');
                if (!img) return;

                currentItem = {
                    node: node,
                    name: img.getAttribute('title') || img.getAttribute('alt') || 'Unknown',
                    countNodes: []
                };
                items.push(currentItem);
            } else if (currentItem && (node.nodeType === 3 || (node.nodeType === 1 && node.tagName === 'SPAN'))) {
                if (node.nodeType === 1 && node.tagName !== 'SPAN') return;
                currentItem.countNodes.push(node);
            }
        });

        if (items.length === 0) return;

        const wrapper = document.createElement('div');
        wrapper.style.cssText = isSingleSpan 
            ? 'display: inline-block;' 
            : 'display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin: 15px auto; max-width: 800px;';

        items.forEach(item => {
            const combinedText = item.countNodes.map(n => n.textContent).join('');
            const countMatch = combinedText.match(/(\d+)/);
            const countVal = countMatch ? parseInt(countMatch[1], 10) : 0;

            let threshold = 5;
            if (item.name.includes('Hobalt')) threshold = 1;

            let bg = '#fff';
            let border = '#c0c0c0';
            
            const isTradePage = globalThis.location.search.includes('do=trade') || globalThis.location.search.includes('what=trade');

            // Only highlight low inventory items on the trade page (and not the exchange preview boxes)
            if (isTradePage && !isSingleSpan && countVal < threshold) {
                bg = '#ffe6e6';
                border = '#ffb3b3';
            }

            const tile = document.createElement('div');
            tile.style.cssText = `
                display: inline-flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                width: 80px;
                min-height: 75px;
                padding: 4px 4px 18px 4px;
                background: ${bg};
                border: 1px solid ${border};
                border-radius: 4px;
                color: #000;
                position: relative;
                box-sizing: border-box;
                font-family: Arial, sans-serif;
                margin: ${isSingleSpan ? '4px' : '0'};
            `;

            const img = item.node.tagName === 'IMG' ? item.node : item.node.querySelector('img');
            img.removeAttribute('align');
            img.style.marginBottom = '4px';
            
            tile.appendChild(item.node);

            const nameSpan = document.createElement('span');
            nameSpan.style.cssText = 'font-size: 11px; line-height: 1.2; text-align: center; width: 100%; display: block; margin-bottom: 2px;';
            nameSpan.textContent = item.name;
            tile.appendChild(nameSpan);

            const countWrapper = document.createElement('div');
            countWrapper.style.cssText = 'font-size: 12px; font-weight: bold; color: #0055aa; position: absolute; bottom: 4px;';
            
            item.countNodes.forEach(n => {
                if (n.nodeType === 3) {
                    let trimmed = n.textContent.trim();
                    if (trimmed) {
                        if (trimmed === '()' || trimmed === '( )') {
                            trimmed = '(0)';
                        }
                        n.textContent = trimmed;
                        countWrapper.appendChild(n);
                    }
                } else {
                    if (n.tagName === 'B' && n.textContent.trim() === '') {
                        n.textContent = '0';
                    }
                    countWrapper.appendChild(n);
                }
            });

            tile.appendChild(countWrapper);
            wrapper.appendChild(tile);
        });

        if (isSingleSpan) {
            container.innerHTML = '';
            container.appendChild(wrapper.firstChild);
        } else {
            container.parentNode.replaceChild(wrapper, container);

            // Clean up trailing breaks and paragraph tags specifically after the main page inventory list
            let next = wrapper.nextSibling;
            let removedCount = 0;
            while (next && removedCount < 4) {
                const current = next;
                next = next.nextSibling;
                if (current.nodeType === 1 && (current.tagName === 'BR' || (current.tagName === 'P' && current.innerHTML.trim() === ''))) {
                    current.remove();
                    removedCount++;
                } else if (current.nodeType === 3 && current.textContent.trim() === '') {
                    current.remove(); // Remove trailing empty text nodes
                } else {
                    break;
                }
            }
        }
    },

    formatStats: function() {
        const centerTags = document.querySelectorAll('center');
        const statsCenter = Array.from(centerTags).find(c => c.textContent.includes('Mine Section') && c.textContent.includes('Mining:'));
        if (!statsCenter) return;

        const viewActiveLink = Array.from(statsCenter.querySelectorAll('a')).find(a => a.textContent.includes('View Active'));
        const viewActiveHtml = viewActiveLink ? `<div style="margin-bottom: 10px; text-align: center;">${viewActiveLink.outerHTML}</div>` : '';

        const text = statsCenter.innerHTML.replaceAll(/<[^>]+>/g, " ");
        const sectionMatch = /Mine Section\s+(\d+)/i.exec(text);
        const miningMatch = /Mining:\s*([\d.,]+)/i.exec(text);
        const oreFoundMatch = /Ore found:\s*([\d,]+(?:\s*\[\s*\d+\s*\])?)/i.exec(text);
        const oreTradedMatch = /Ore traded:\s*([\d,]+(?:\s*\[\s*\d+\s*\])?)/i.exec(text);
        const tUsedMatch = /T used:\s*([\d,]+)/i.exec(text);

        if (!sectionMatch) return;

        const formatOreValue = (val) => {
            const shardMatch = /\[\s*(\d+)\s*\]/.exec(val);
            if (shardMatch) {
                const ores = val.split('[')[0].trim();
                return `${ores} [<span style="cursor: help;" title="shards found today"><span style="color: blue;">${shardMatch[1]}</span></span>]`;
            }
            return val;
        };

        const section = sectionMatch[1];
        const mining = miningMatch ? miningMatch[1] : '0';
        const oreFoundStr = oreFoundMatch ? formatOreValue(oreFoundMatch[1]) : '0';
        const oreTradedStr = oreTradedMatch ? formatOreValue(oreTradedMatch[1]) : '0';
        const tUsed = tUsedMatch ? tUsedMatch[1] : '0';

        let tableHtml = viewActiveHtml;
        tableHtml += '<div style="width: 155px; margin: 10px auto; padding: 4px; outline: 1px solid #CCCCCC; border: 2px solid #E8E8E8; background: #F9F9F9; font-size: 13px;">';
        tableHtml += '<table style="width: 100%; border-collapse: collapse;">';
        tableHtml += '<tr><th colspan="2" style="padding: 2px; text-align: center;">Mine Section ' + section + '</th></tr>';
        tableHtml += '<tr><td colspan="2" style="padding: 2px 2px 8px 2px; text-align: center;">Mining: ' + mining + '</td></tr>';
        tableHtml += '<tr><td style="padding: 2px; text-align: left;">Ore found:</td><td style="padding: 2px; text-align: right; font-weight: bold;">' + oreFoundStr + '</td></tr>';
        tableHtml += '<tr><td style="padding: 2px; text-align: left;">Ore traded:</td><td style="padding: 2px; text-align: right; font-weight: bold;">' + oreTradedStr + '</td></tr>';
        tableHtml += '<tr><td style="padding: 2px; text-align: left;">T used:</td><td style="padding: 2px; text-align: right; font-weight: bold;">' + tUsed + '</td></tr>';
        tableHtml += '</table>';
        tableHtml += '</div>';

        statsCenter.outerHTML = '<center>' + tableHtml + '</center>';
    },

    formatActiveList: function() {
        if (!window.location.search.includes('view=active')) return;

        // More robust header text finding across all tags natively
        let activeHeader = null;
        let walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        while (walker.nextNode()) {
            if (walker.currentNode.textContent.includes('Currently active hobos in the mines')) {
                 activeHeader = walker.currentNode.parentElement;
                 break;
            }
        }

        if (!activeHeader) {
            Utils.log('MinesHelper: Could not find active hobos header.');
            return;
        }

        // Just find the container holding the list. Usually it's a UL next to the P
        let pTag = activeHeader.closest('p') || activeHeader;
        let ulTag = null;
        let nextNode = pTag.nextElementSibling;

        while (nextNode) {
            if (nextNode.tagName === 'UL') {
                ulTag = nextNode;
                break;
            }
            if (nextNode.tagName === 'P' || nextNode.tagName === 'TABLE' || nextNode.tagName === 'DIV') {
                break; // stop searching if we hit another major block
            }
            nextNode = nextNode.nextElementSibling;
        }

        let rawLinksMode = false;

        // If we can't find a UL, we fallback to searching all raw player links after the header
        if (!ulTag) {
            rawLinksMode = true;
        }

        if (!rawLinksMode) {
            // Process the standard UL format
            const listItems = ulTag.querySelectorAll('li');
            if (listItems.length === 0) return;

            let tableHtml = '<table class="bmenu" style="width: 400px; border-collapse: collapse; margin: 10px 0;">';
            tableHtml += '<tr style="background: #ccc; border-bottom: 2px solid #aaa; color: #333;"><th style="padding: 5px; text-align: left;">Hobo</th><th style="padding: 5px;">ID</th><th style="padding: 5px;">X,Y</th></tr>';

            listItems.forEach((li, index) => {
                const aTag = li.querySelector('a');
                let nameHtml = aTag ? aTag.outerHTML : li.innerHTML.split('(')[0].trim();

                const preSpan = li.querySelector('span[style*="text-shadow"]');
                if (preSpan && aTag && !aTag.contains(preSpan)) {
                    nameHtml = preSpan.outerHTML + ' ' + nameHtml;
                }

                const textContent = li.textContent;
                const match = textContent.match(/\(#(\d+)\)\s*at\s*(\d+)\s*,\s*(\d+)/i);

                let id = '-', x = '-', y = '-';
                if (match) {
                    id = match[1];
                    x = match[2];
                    y = match[3];
                }

                const bg = index % 2 === 0 ? 'rgba(0,0,0,0.05)' : 'transparent';
                tableHtml += `<tr style="background: ${bg}; border-bottom: 1px solid #ddd;">`;
                tableHtml += `<td style="padding: 5px; text-align: left;">${nameHtml}</td>`;
                tableHtml += `<td style="padding: 5px; text-align: center;">${id}</td>`;
                tableHtml += `<td style="padding: 5px; font-weight: bold; text-align: center;">${x}, ${y}</td>`;
                tableHtml += `</tr>`;
            });

            tableHtml += '</table>';
            ulTag.outerHTML = tableHtml;
        } else {
            // Process raw standalone links if UL is wiped by layout
            let htmlChunks = [];
            let linkWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, null, false);
            linkWalker.currentNode = activeHeader;

            while (linkWalker.nextNode()) {
                const node = linkWalker.currentNode;
                if (node.textContent.includes('Return to exploring')) break;

                if (node.tagName === 'A' && node.href.includes('cmd=player')) {
                    let textAfter = '';
                    let n = node.nextSibling;
                    while (n && n.tagName !== 'A' && n.tagName !== 'BR') {
                        textAfter += n.textContent;
                        n = n.nextSibling;
                    }

                    let preSpanHtml = '';
                    let p = node.previousSibling;
                    while (p && p.tagName !== 'BR' && p.tagName !== 'A') {
                        if (p.nodeType === 1 && p.tagName === 'SPAN') preSpanHtml = p.outerHTML + preSpanHtml;
                        p = p.previousSibling;
                    }

                    htmlChunks.push({ aTag: node, preHtml: preSpanHtml, text: textAfter });
                }
            }

            if (htmlChunks.length > 0) {
                 let tableHtml = '<table class="bmenu" style="width: 400px; border-collapse: collapse; margin: 10px 0;">';
                 tableHtml += '<tr style="background: #ccc; border-bottom: 2px solid #aaa; color: #333;"><th style="padding: 5px; text-align: left;">Hobo</th><th style="padding: 5px;">ID</th><th style="padding: 5px;">X,Y</th></tr>';

                 htmlChunks.forEach((chunk, index) => {
                     let nameHtml = chunk.preHtml + chunk.aTag.outerHTML;
                     const match = chunk.text.match(/\s*\(#(\d+)\)\s*at\s*(\d+)\s*,\s*(\d+)/i);
                     let id = '-', x = '-', y = '-';
                     if (match) {
                         id = match[1]; x = match[2]; y = match[3];
                     }

                     const bg = index % 2 === 0 ? 'rgba(0,0,0,0.05)' : 'transparent';
                     tableHtml += `<tr style="background: ${bg}; border-bottom: 1px solid #ddd;">`;
                     tableHtml += `<td style="padding: 5px; text-align: left;">${nameHtml}</td>`;
                     tableHtml += `<td style="padding: 5px; text-align: center;">${id}</td>`;
                     tableHtml += `<td style="padding: 5px; font-weight: bold; text-align: center;">${x}, ${y}</td>`;
                     tableHtml += `</tr>`;

                     chunk.aTag.style.display = 'none';
                     let n = chunk.aTag.nextSibling;
                     while (n && n.tagName !== 'BR' && n.tagName !== 'A') {
                          if (n.nodeType === 3) n.textContent = '';
                          else if (n.nodeType === 1) n.style.display = 'none';
                          n = n.nextSibling;
                     }
                     let p = chunk.aTag.previousSibling;
                     while (p && p.tagName !== 'BR' && p.tagName !== 'A') {
                          if (p.nodeType === 1) p.style.display = 'none';
                          p = p.previousSibling;
                     }
                 });

                 tableHtml += '</table>';
                 activeHeader.insertAdjacentHTML('afterend', tableHtml);
            }
        }
    },

    extractTradeStats: function() {
        if (!window.location.search.includes('do=trade')) return;
        const pageText = document.body.textContent || document.body.innerText || '';
        const statMatch = pageText.match(/Net stat gain for trade:\s*([\d.]+)/i);
        const tradesMatch = pageText.match(/Stat Trades today:\s*(\d+)/i);
        if (statMatch) {
            Utils.setItem('hw_MiningHelper_StatGain', statMatch[1]);
        }
        if (tradesMatch) {
            Utils.setItem('hw_MiningHelper_TradesToday', tradesMatch[1]);
        }
    },

    markSafeZones: function() {
        let mapTable = null;
        for (let y = 1; y <= 30; y++) {
            for (let x = 1; x <= 20; x++) {
                if (this.isSafeZone(x, y)) {
                    // Grid IDs are sequential starting at 1001 for (1,1)
                    let id = 1000 + ((y - 1) * 20) + x;
                    let cell = document.getElementById(id.toString());
                    if (cell) {
                        if (!mapTable) mapTable = cell.closest('table');
                        let bg = cell.getAttribute('bgcolor');
                        // Only change empty/wall cells, leaving players/items alone
                        if (bg === '#FFFFFF' || bg === '#000000') {
                            cell.setAttribute('bgcolor', '#e0f8e0'); // Pale Green
                        }
                    }
                }
            }
        }

        if (mapTable && !document.getElementById('mines-legend')) {
            const legend = document.createElement('div');
            legend.id = 'mines-legend';
            legend.style.cssText = 'text-align: center; margin-top: 5px; font-size: 12px; font-weight: bold;';
            legend.innerHTML = '<span style="display: inline-block; width: 12px; height: 12px; background-color: #e0f8e0; border: 1px solid #999; vertical-align: middle; margin-right: 5px;"></span> = Safe Zone';
            mapTable.after(legend);
        }
    },

    isSafeZone: function(x, y) {
        if (x < 7 || x > 14) return false;

        // Horizontal bars
        if ([13, 17, 21, 25, 29].includes(y)) return true;

        // Vertical edges matching the U-shapes
        if ((x === 7 || x === 14) && [16, 19, 20, 24, 28].includes(y)) return true; // Spikes matching image

        return false;
    },

    styleLobbyLinks: function() {
        // Find 'Head inside the mines' link
        const links = document.querySelectorAll('.content-area a');
        links.forEach(link => {
            if (link.textContent.includes('Head inside the mines') || 
                link.textContent.includes('Purchase some Mining Gear') || 
                link.textContent.includes('Trade some Ore') || 
                link.textContent.includes('Read the Mining Primer') || 
                link.textContent.includes('Read the Plaque')) {
                link.classList.add('btn');
                link.style.cssText += 'padding: 10px 20px; font-size: 14px; display: inline-block; margin: 5px; text-decoration: none;';
            }
        });
    },

    styleInsideLinks: function() {
        // Find 'Go back to Mine Entrance (1T)' link
        const links = document.querySelectorAll('.content-area a');
        links.forEach(link => {
            if (link.textContent.includes('Go back to Mine Entrance') || 
                link.textContent.includes('Leave the Mines') || 
                link.textContent.includes('Return to exploring the mines') ||
                link.textContent.includes('View Active')) {
                link.classList.add('btn');
                link.style.cssText += 'padding: 5px 16px; display: inline-block; text-decoration: none; margin: 5px;';
            }
        });
    },

    enlargeMap: function() {
        const mapStartCell = document.getElementById('1001');
        if (!mapStartCell) return;

        const mapTable = mapStartCell.closest('table');
        if (!mapTable) return;

        mapTable.classList.add('mines-map-grid');
        if (!document.getElementById('mines-map-grid-style')) {
            const style = document.createElement('style');
            style.id = 'mines-map-grid-style';
            style.textContent = `
                .mines-map-grid { border-collapse: collapse; }
                .mines-map-grid td[id] { 
                    border-bottom: 1px solid #ccc; 
                    border-right: 1px solid #ccc; 
                    width: 14px !important;
                    height: 14px !important;
                }
                .mines-map-grid td[title="You!"] { 
                    width: 14px !important; 
                    height: 14px !important; 
                }
            `;
            document.head.appendChild(style);
        }
    },

    highlightPlayers: function() {
        const mapStartCell = document.getElementById('1001');
        if (!mapStartCell) return;

        const mapTable = mapStartCell.closest('table');
        if (!mapTable) return;

        const cells = mapTable.querySelectorAll('td[id]');
        cells.forEach(cell => {
            const title = cell.getAttribute('title');
            if (title && title !== 'You!' && title.match(/\(\d+\)/)) {
                cell.style.outline = '2px solid #f00';
                cell.style.outlineOffset = '-1.5px';
            } else if (title === 'You!') {
                cell.style.outline = '2px solid #0f0';
                cell.style.outlineOffset = '-1.5px';
            }
        });
    },

    buildMiniMapActiveList: function() {
        const mapStartCell = document.getElementById('1001');
        if (!mapStartCell) return;

        const mapTable = mapStartCell.closest('table');
        if (!mapTable) return;

        const cells = mapTable.querySelectorAll('td[id]');
        const activePlayers = [];
        cells.forEach(cell => {
            const title = cell.getAttribute('title');
            if (title && title !== 'You!') {
                const match = title.match(/^(.*?)\s*\((?:#)?(\d+)\)$/);
                if (match) {
                    const cellIdNum = parseInt(cell.id, 10);
                    let x = 0, y = 0;
                    if (!isNaN(cellIdNum) && cellIdNum > 1000) {
                        const val = cellIdNum - 1000;
                        x = val % 20;
                        if (x === 0) x = 20;
                        y = Math.ceil(val / 20);
                    }
                    activePlayers.push({ name: match[1], id: match[2], cellId: cell.id, x, y });
                }
            }
        });

        if (activePlayers.length === 0) return;

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        const mainTables = contentArea.querySelectorAll('table[width="100%"]');
        let layoutTable = null;
        for (const t of mainTables) {
            const layoutCells = t.querySelectorAll('td[width="70%"], td[width="30%"]');
            if (layoutCells.length >= 2) {
                layoutTable = t;
                break;
            }
        }

        let container = null;
        if (layoutTable) {
            const tbody = layoutTable.querySelector('tbody');
            if (tbody) {
                const tr = tbody.querySelector('tr[valign="top"]') || tbody.querySelector('tr');
                if (tr) {
                    const layoutTds = Array.from(tr.querySelectorAll(':scope > td'));
                    if (layoutTds.length > 0) {
                        container = layoutTds[0];
                    }
                }
            }
        }

        if (!container) return;

        if (!document.getElementById('mines-flash-style')) {
            const style = document.createElement('style');
            style.id = 'mines-flash-style';
            style.textContent = `
                @keyframes grow-outline {
                    0% { outline: 2px solid rgba(27, 158, 255, 1); outline-offset: 0px; }
                    100% { outline: 10px solid rgba(27, 158, 255, 0); outline-offset: 10px; }
                }
            `;
            document.head.appendChild(style);
        }

        const listDiv = document.createElement('div');
        listDiv.style.cssText = 'width: 185px; margin: 15px auto; border: 2px solid #E8E8E8; outline: 1px solid #CCCCCC; background: #F9F9F9; padding: 4px; max-height: 250px; overflow-y: auto;';

        const header = document.createElement('div');
        header.textContent = 'Active Miners';
        header.style.cssText = 'font-weight: bold; text-align: center; border-bottom: 1px solid #ddd; margin-bottom: 4px; padding-bottom: 2px; font-size: 12px; color: #333;';
        listDiv.appendChild(header);

        const ul = document.createElement('ul');
        ul.style.cssText = 'list-style: none; margin: 0; padding: 0; font-size: 11px;';

        activePlayers.forEach(player => {
            const li = document.createElement('li');
            li.style.cssText = 'padding: 3px 4px; cursor: pointer; border-bottom: 1px solid #eee; transition: background 0.2s; display: flex; justify-content: space-between; align-items: center;';
            li.innerHTML = `
                <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 135px;"><span style="font-weight: bold; color: #333;">${player.name}</span></div>
                <div style="font-size: 10px; font-weight: bold; color: #555;">${player.x},${player.y}</div>
            `;

            li.addEventListener('mouseenter', () => li.style.background = '#e8f4f8');
            li.addEventListener('mouseleave', () => li.style.background = 'transparent');
            li.addEventListener('click', () => {
                cells.forEach(c => {
                    const t = c.getAttribute('title');
                    if (t && t !== 'You!' && t.match(/\(\d+\)/)) {
                        c.style.outline = '2px solid #f00';
                        c.style.zIndex = '1';
                        c.style.animation = '';
                    }
                });

                const targetCell = document.getElementById(player.cellId);
                if (targetCell) {
                    targetCell.style.outline = '2px solid #1b9eff';
                    targetCell.style.zIndex = '10';
                    targetCell.style.animation = 'none';
                    // Trigger reflow to restart animation
                    void targetCell.offsetWidth;
                    targetCell.style.animation = 'grow-outline 1s 5';
                }
            });
            ul.appendChild(li);
        });

        listDiv.appendChild(ul);

        const footer = document.createElement('div');
        footer.textContent = 'Click to highlight on mini map';
        footer.style.cssText = 'font-size: 9px; color: #888; text-align: center; margin-top: 4px; font-style: italic;';
        listDiv.appendChild(footer);

        container.appendChild(listDiv);
    },

    formatTopMinersTable: function() {
        const tds = document.querySelectorAll('td');
        let headerTd = null;
        for (const td of tds) {
            if (td.textContent.trim() === 'Top 10 Miners') {
                headerTd = td;
                break;
            }
        }
        if (!headerTd) return;

        const table = headerTd.closest('table');
        if (!table) return;

        table.classList.add('bmenu');
        table.style.cssText = 'width: 100%; border-collapse: collapse;';

        const rows = table.querySelectorAll('tr');
        if (rows.length > 0) {
            const headerRow = rows[0];
            headerRow.style.cssText = 'background: #ccc; border-bottom: 2px solid #aaa; color: #333; font-weight: bold; text-align: left;';
            const headerCells = headerRow.querySelectorAll('td, th');
            headerCells.forEach(cell => {
                cell.style.padding = '5px';
            });

            for (let i = 1; i < rows.length; i++) {
                const cells = rows[i].querySelectorAll('td');
                cells.forEach(cell => {
                    cell.style.padding = '4px 5px';
                    cell.style.borderBottom = '1px solid #ddd';
                });
                if (i % 2 === 0) {
                    rows[i].style.background = '#f9f9f9';
                }
            }
        }
    }
};
