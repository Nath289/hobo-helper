const MinesHelper = {
    cmds: 'mines',

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

        let isRefresh = false;

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

            Utils.setItem('hw_mines_last_state', JSON.stringify({ section: currentSection, tUsed: currentTUsed }));
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

                if (dT > 0 || dExp > 0) {
                    if (newExp < dExp) newExp = dExp;
                    if (dT > tUsedVal) tUsedVal = dT;

                    shouldLog = true;
                    isRefresh = false;
                }

                Utils.setItem('hw_mines_blast_state', JSON.stringify({ t: blastT, exp: blastExp }));
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


            Utils.setItem('hw_mines_log_data', JSON.stringify(logData));
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

        // DO NOT CHANGE THESE BASE64 IMAGES. The current strings are correctly mapped and confirmed working.
        // Modifying them breaks the ore display UI.
        const oreImages = {
            'Hobalt Chunk': 'data:image/webp;base64,UklGRjQDAABXRUJQVlA4TCgDAAAvGAAGELcGOZIkRVJEZR/z6a8Tv04Q7OlaUgJuJEmOnKqZPWrAg2jwG+5BQkCid/e/O7Aj2VatzOy9r6D/kAcRkwcRuXN1ww4FgIDyzrbvPpkmaIAGaYMm0wB9159t23YPAGpQDaohIAIk1F/gC/hXqREgCITUTzUMhFTAH/CvhnbFDnlkwzBS1ArRFLvq69RcKZIhKthajWKltLBri5oaqnQN2KqIlJquiDMkJHY0ggrgGNgFboBfJCgudPVkInbV59GqBcxWRBFoGO6VsaJ+q6PqD/CiDqpBYGhXbfUT9O53Prf/443C1uZ36Gr9wP/P+dODsIQizccm/fJOGOtx/gKxXY+58zXnR6uZs2n4BW7U/PbYJ4DoTb+vrHsbTMp0Ps1i2c2r61urZf1Unzr3yi43tS3cF/Ox+hsfznaZp7O5ZG7cZ1Q6X2ViOKkIWXc2dGzWWKx72w48v14yoNrFKSGmjYYyZRLRkjJwtiMTENAQIhMqbGlSmBIgEKdQX+93+h62I6RG3mfn/dbfV/G6tB2Y9WsejYF20x23b3/W/LVJO/p3Hw92DyWTBvIwmFFKpjAKA0mK3SOcL6Uo3SEarSRGjoA6i0lMGkSgMoEEIJAAhBBJ+Px88nJ/HIds27ZNO9qxbdu2bdu2bdvmzT4Xse2UXfGK80Pme0T/JwB9uLeW2loOUYZPYRPWjZaMX15MkhPVZH4Ug7pCwtLuj09XVwdbMmG8DzEy6cn/gvNjOAWAs98SZnQPuIhJfTs/v4D7zzcUgx+w964Ym5ic/gMAZwDwX3r1Pn4Lz2IyjUakn58f7p0CnMSa3mfu3l/UPYKp5Svb+/sAcBKXdocuwqeXNj5bOlRHGq6cvwCAzyLWd3iMcgja1PX3mUyMqRlHABcLMex3WIzdRilZ61/P11ooRNk/uLwJ1Ud36XUKMCb6svd3UjpJ9V/+JgZaoXsFnLw6MCYa5n5uuja2JcuqhaD72QzEm0kY4/ba1oGSQiFbBvRIVb9qCr530NckCD2WIzygpqmLIMg9Hiqs6PHcNsqCuflVef4a6BntnB2VUiPZnoOLh5eTD71x',
            'Hobalt Shard': 'data:image/webp;base64,UklGRpoDAABXRUJQVlA4TI0DAAAvGAAGEK8Hu7bttNG5ek9SMszwhzVMN1P6NMBMAr82YMm227a5ACTI6b3X/S8mf15Fek8oEQ9ybbuJpCfJbmZc9bZTmPwDwAyYmWdMch3Jtmn1Nd77spl/Ki8P2w4A8AcSoAokQACEQA5EQAAEQAxEQAnEQABEQAaEQAhkQBWoAjEQARUgByKgBDIgBGpACIRABgK8BBpACHSAUugeoysD0k1y/Un2kEtLsoWF9pJ1UxvK2zMmLFF0s8yo1sfmn5wwepSN1QA9CoOrR+WisMyQukxdsuC7qtlf7B0GvuUislZdez4yiVI4WJr/f9Rc+2vQp+lq07b0HbkheV/bw3p0ORA2Yj1iNCUG1Lq2vFlbYv7td6XaX/DXPvFpvjGLVGrVT1O+uXRQwdIR06dmZ/6nxLZ/jPy151N1b6hkpI3s52Xi9GJoJyZS3/h7bEIdrQ2N76HxnVCfvrqwjYavbz8RXDSzjqVFY79/zYfEspFU66nRFa3PlshTuHcoYF7Fb88i5aEklRx0JQWUoIRJCCCEiQiYGgLKBnNRzTKAKOSuJBTOqm/8QGX4VBSiZ2aJR9bSoG//swmJPjSmASH+llfFr7m5vCW+jox8oqZSN1rUFmOEkAvMkP/WU/E9JTOezCHIid+455H5eqLWgbLp8pMqex/GSRCrYGO70WFW8l9E9vxSnD/s5DWiHBShrubu2/DqoglQHI7ftt3t0DHswcPy47bv3bwN5jI516k7uxveRtuGez90fX9qq949X89AYgCAhSTN2bZt27Zt27Zt27Zt27b9NhpQTg1E9F9h27YNMzsugV45EP8E3KN/CUhJSclg/gTVY4XBFxTop2sWuR7Bg/4ITLGz08O5+YXZFRmKR2CLhm2vLl3st+060j6CXt3uV4DDzsHintOjtN99SnY2UDGftqV7xBer91MpveOe+pLSHGjAQv2q8fPD5Zuh7LQfHryYQDjiocH2H98O9vd9/6ZMBETjvxUeouUzeXVz92BIDyrYz7/PN6KsdVSTrm/vXYHwRTZP1mai4y3UfCfG3MFkj4/aW/MyY2w0JfSUGOBB5JY7OhtKC3IyEk2l+NlwAJA5XUoqqitryguz0uMsBchBRxIWIa/hnrqq2rKi3PxYbiRQolCyC5ukjnYX1zc2t8gTQ8DAImTiUjBOGBlo6vJmhB4LXFJSZlZBRTejPx4PBEQ8ampqcuh1AgIA',
            'Green Ore': 'data:image/webp;base64,UklGRooCAABXRUJQVlA4TH0CAAAvGAAGEN8Fq7ZtV82e+9DBvxwEREpGvnoPVYTrSLZto2efi/wDVH5l8OY4jiTJUbJmD+G/gwQvXNAsQbZN/al2sh/BIQif0rKYEDGFmKxnwJSWxWQ5Y0pjPctMDqfDstGyXKNQJlqIqAggiRMGLS1wioI0IpAAiCQAQFEAFIAEAREBQQAScEuRxN2gUO4id5s7j63l9pwCCggyRRABRACk/Mo6TmWBU8mMKX5fRLRABAQoEfGH095Oa/lrLIrGTGb/QfZ22tvvpv+fopcrk1OJ/GHW8j9jiZQEyYy/zWKNlBQNM1J6OoGUh9vd4/3hc518vZ6ef39Pj6e333a83goLGWALAFg2amedzdk727Zt27Zt27Z9Tf/uzPc0ov9q27ZhovRk9BXIDwAgxL/U4djz7RMTw78Q6OPZ0f7uPe1zRx9Oji+J06VSymeOs1emtq9uDtaIZPLHjpPulicujjbHx1aHAingw3CZHG7s2TtqH+hrKCpWR7H3T76r/WPr59flxdU11R011RFabx3THVkgNra6Zrvna8vykhIKy2I1Xx1nNC8Oju6cXxzOtcUHB4THp6VWZHAAAgG3r7eTqG+dma7w9fTxDkiDSVnFhhgCUZu6xqaWquI0GOPlG+wTnZObFp8dTXoxh8ra4sSUpBBHa18/36CEnPTs1MRCCo5g4lRvN1dfd8LWDvoHRSZm5ucmxhfrAQQYyCVSpZ09YWXrHxeVkF5SVpqaFaoNINVEolBZWtnZ2ju7hiVlZqXnw1AjFooDYw+FhZUtobJzcnXzjMgoyLTUoaMAgYBtKhNAvjmPKyS4PJGZvgb6TigAhZDOUWPDtwD4uaCQ/wgEAA==',
            'White Ore': 'data:image/webp;base64,UklGRkQDAABXRUJQVlA4TDcDAAAvGAAGEI2QSduG2u5cRP/juYmCtA1Y1F0hAWGE6P9CAwQkSf8/h/0PvHtKkKNt27FH9/P+5nHEtqtkzNKd2an1TMty9sAteCquILZtf34VcwOQ20hyJEVkdZ/w38/br7ruhCBJcttmbu8I0Dnb//+joglgHUSSGzZbZh9kkpBJRWZFbts28Uyu7SsAP4D9AkkDAGg4wO1IJO+8jQSLCXZC7z3YeAC9vUj2Qbp3j1dDlPiG+ere/335fP79PyeezHYFkAwzD+cFT8le8M3CRH4fvPRVI3eH1l4N507CkTRJA7JVPluPog7L739Fe5D/BUB6kDxIWQ/u7A9vH38a7sUZZtXpisqS7BasPWH0WPZKxrPYYog7vh4p4a2NF9T0cGR1F8Glc7jbwwEcv7yNR0CSSgrJCaZj/UHeRUpv/n/vIikguCytYwva3OzEelKYR9cJFwqS3UCSOprGl2TmkRyrWnfh3+nP7mrvMDZlLLZ0B2tKFEjEUuaS7JTq3dQJkqxnxMhdmqlYqFPKaubOs+52JQz5/8uXjekxrlid0qYDEkHQxWGJ1o678xu1FiS5aFfZtPDVhLIUfP517y6OVLV0u0wKnoWZgi58gl47sTs2DUWWIhlurtiQFAAAoGrT8CWisFZxB8XnygDTZ6j/EheAQrORd2E36YqcRpt0djSdJ1iwaoCkROoOYsdUzSj+nmFyJ2tBnGnpLCxgQF9DhARPCPxbjOKbTfgMfb36eQ+a+Fb3PFMkNjS21MSdlOZMsMHs2GyRtNAWf0KAgoivFsIUoP+hieXXtUX1rT3YMmGcoE3hYoJpYie2ywyTKPwGOwtLCtBg4K+QyTDNMv1j+M2yrL41AToh78X7JqtmI0MjxlcREd2gC6GQwWcKjITTBEl+wCw25sIBbADg3eyhShnGrBGVFAAMaAIJKMEGEmwlUeno1TgA2ARAF+A6rbkgIBiCARUAzOBH+ISli4HKSMKkAPwBt2k0kbjsGSwwCFRoTJs04Edc0GcaUxYIgNHEARpgCzsoVTtm1ZiBN7jCaJpWuiqeGk3cNp8H0NlEHdMkNkCaBIqwYJDErLdtAFhAAAADsH7ZdwAAAA==',
            'Yellow Ore': 'data:image/webp;base64,UklGRroCAABXRUJQVlA4TK0CAAAvGAAGEH/mKJJtV5k5LwCKUIL/BQrY5fje+xrcRpIkKVU9s3tgEZbgv4AFaPcfxEaSFElRPcfsv3HnBMP/NIEgRP9PYRmxSUJz4B0AuJKgJKEoym4ZSv0rBYRSm4SEPqMUtVGSQRdKoR8az7Md3lEKpRQQMCR/2ogk9i+U2vRJG5GgKG2QkJBEbfpESULRpqFspKFAG2xoEwWKTuODUKApEEqCom2AJoi2YdnGDnqCklAKRYFImpKQRCmUUiiKDknRP9qSUKAk0+RUFIhSTQedYAEGnbRBgwkabH0ekoABNiAUWIKAgAIBAQOErkCBctte4ObztFJfr+vucbT3PX2eJShJue8/MF3X6fK/OP/a6XutkqCAvS4+D6DK8bOPQYIk2aZt2bZt27Zt27Zt27Zt+/rcN6jL+H8Ca0f0fwI4/lmMjCisYVRE4ZT4k5cTpDJFxnMJKYBm2Mfj2f0vJzMESfPE4dmJ583lqavTQw0KI4Jy4/TuytrEfP/T+d3N+Q83A7JMXs/QHFpYP9ibPLq4Od6XpdCQyMLu7d0DaOz5+uX09vJ5Y2dbmwYTV9G3982tbRvsPXl4++zsX1zd0qPBGftbWlk6h2aVV39fvr++NYzPLBnQkXZxsEd2LgmZ2aWDI19dfWi01oQGcKrWzsjJxTso3DctLhIVN7b0R3LSAE7Jwhkh5OZiGxgCoXGJpR1NAhgNcKuZOTi5IEefiKjEyIDY1PwWUxwdICoYOXt4u8dEx4dEJuaUFLfEctEDAp+Wl59/UhpARkl5SVY94mUAGF7ROTg2LzO/oAxKcuoqmAAgSNoklpWXVFeWoMyKCB5mACdqnlFd2NpcnpdVqYNjCqh8ap7JZTVF6cUpIhhzQMXxi+m6RmVVGVI4WKfgeaXUzYQwNgAARuYCjv8TAA==',
            'Orange Ore': 'data:image/webp;base64,UklGRtwCAABXRUJQVlA4TNACAAAvGAAGEC8HOZIk10rlvI/w3xz84abhpJ/6RsCOZFu1snptHPL/JiticHc5B3IkSYokj4E90l9Ghh/fdRFk29Sfaid7HQpxhSgCzAQUM8gUgFDCWA6zDEGiKO3duri7+AczyZDcHCdjOQhcjiBKa3d/sdycQJSbY0jGNHPANDfHhClhSoASBinJKEMjBAgCBAhTSiBMCUIIQhBCCSOUyAgETkpRhACJEADCGVxfQWCQEKZcIwmc4ECBhJEIJzpFmYkCZTNdAigzgRJGmCbIKJt21p1lyFgzykJkp6xZxk7S3qzh/2+z/m/WPdbF9LAMGe3DzMi/mVgXBkEOJe0AO9lJStohJeMkKXl6uPf998HBryxr+Hk/PV7x/XLnK0/erpfvj93/7+Hz4c/D5XtrWNdYN8WgaF1AgiTZpm2te59t27Zt27Zt27Zt89u837a19/17JM8YQET/JwCOTjAdjhdxSQr8PQbyh1nG1NWR6Wh0VjktcysjdeqRMI+6nrWdmaGBCP0IiE/T2NbB3Mgg1IPj/2HojPK2LnZ2tpZW3g1tqv8OIkhIx93DycHB2S2wYqCvjpPsRxgUXPw8XZ1sPXwyctuHJ6Yl8D6EQS0xPSHax8bWO668e3J8Z1Z2P6RYWFmclhLtZeKZUd4xNbe+IL4P5ojIzs9JjAkL883uuf7o/ublZWECAITFprS1MivRPyo4oPnB61u0xZlBKgAAUimoqS0pSg6O8g/+8vnTtXtrKyEIALBgbGZ+SUFJRmBkcObHD+/frA5d+oEBgKJdnpZRWFiZExge3zTadOPhnbvb3ykAgKWzy7PSc/NysqJr+rr6r9Ce37z6dQ8g7qSSktz0/NTO5pH5pe0X7549+Y33AOK3r2+sbmkcq+rd2r349tXTl2JkH8DsUrouQRr6FmVzGxdoj29/o8DBGFGoGCMqr9LPX8qibOQQBxOMMSZw7gI=',
            'Red Ore': 'data:image/webp;base64,UklGRqoCAABXRUJQVlA4TJ4CAAAvGAAGEEcGqZEkSZJ59vRrZpc/puUwRPbqE4TjRpIUKbMWD/7n9tl0/jBjj9tIkiQl635E/DcMGQkf3iHItqk/1U72NzgAeAkJhIQh0yFkCnUhhWox8xBmSCBkyDJncbcNXyXLnHW9IJmSurFMQaYPRx0liWR6CJKQAkEKBSFgCEaEEJKUEJJcExKQDTIkIKSQEQoJQRIhQTiY4FqRACGEXAUmuQEZUsftktTBkKCOEpJkZEgSMlnIuJ3qiXCUEKSW+gQRLYqMMLVCatmKxrF68E9t1QDGsBgWtQVDgliMqwCL4OEusnp6Hx+2Gv/1txUqP7cf+8v3+21bvn2f/p7/u8/NzXv38rV9ttXYGrAE2hqQIABgGUnJ2rZte4u1bdu2bdvGrG3zrnzXWg+I6L/atm0YOz2ZyhXgl0mT8D/7lYjhVvz3/CT0BaGEHnf3Djn3Ep8IS3IrPcwOrZ+eHNzxfjwhoFcyOD+4fXh2vjmjQX2gpELG3Ez/SM/Vxtbi1HQKfK+EWuvC+OjkKufomNM7NjUh+a7NiOf29g0Mr+137dyW1Qz2tRiT77xmVVNHZ/fNwcnl9XJrY1tpndRbx+dZWVtd0VDcsLJ0UV9YXtTe7CP4IgwhjSJugaEZOYmFhSEBwcEhsRkV3rwAcKkbWVha2bmGBAQ5BXr5+wcFJKaUpahQgMcVtbZ1tMecPXAb36CQoKDo1KTESgcISGlzBMEwFEMRNCgoKDA6PS8nsThXBACKV17X/MXhLs4R4WFRSTnpGQkZkXxvFi6srGWCunt4BCXHpKRn52QmZse9AWBoQVFZbczLLz4zs6CiPD0yywp+8Bs0KaZiFZSWn5RXkJqZi5Mfn5zgl1M1NdA3MzbUkaHAJ6QpCEkIIUmBP0UA',
            'Purple Ore': 'data:image/webp;base64,UklGRsICAABXRUJQVlA4TLYCAAAvGAAGENcGOZIkRZJHLeqv4IEG98VaEgJSJEmOpPDq1fx/i+Z4HBDdDSGSZFlR5Twu/ypQgwk83Ow+gmyb+lPtZBeQJAMCu6GoQwCwaIYZAFP2skAwiIZFa+m69LyAijXMgLmfdDsyo8sCs7d9nhlEbQwg153v15kBhAG6H83thAiwRjCAGaQgAggAERUzCDTDIIggEAiAIERUYKUwPB1PjCAF2fIiAKg8oC/C5KV70oCAaA1r3AXP6Tnb/2VpEKRYtAaYYQhmWKMC4LKESieVHbbAzCgOhdj/nBxPwoAUYuQQ/v9V/q7L2ZhyaJBKUdvEyZgiPn8ftm2+Pnb/+y/J3952//H7Z18Xh8+709fX7+/X18rh4+btfW3P5mxqEAhj/35Bgm3bph2d2LbzY9u2bdu2bdu2bVtl5N78qtudMhoQ0f8JgP83ecHPtBjRYPITVIwRDQOriJSiAkVVTfjz9wgNi4CkrLqWoZGBoampuamtPeM3BDGrhMaEeTo7OVhbmFlamBjqCT0DEMRBcUvMK86IdHWws7SwMjfU1zXkAyC04o4F5XW5WTHx0Q7mFg4OlpZWjtn8VKDRSUrLqinJSg0P8XYxsXeJDAnLb2qU+AI0QUURmdk5eXHeAd7uxu5xeYX1Pe2tclTAoiUJ6blZuTEeoV4eKaV5pX3D/UPDMi8A3EnZSZmF6YGeHs6+7Ru796/HJ5b7OQkA0qjMT05P8/fxi+h42tw/3pucnddGAIB5g+sKc6MiYgsbXr15fFhfHVvpZicAAIjLpqy2oLOqpa2i+vzkbmZ0QAzBdzGzvH1LV/PgSP/20dveiTUKgh8SjARDuiam5udOz7bmP9LAT2N6i4XFpaub6+FDZfxzQGg0p28vLi+OPzCRXwCCpN8d7Fy+ZyPw65iOR+kTG4HfSvBXAv8w',
            'Black Ore': 'data:image/webp;base64,UklGRtQBAABXRUJQVlA4TMgBAAAvGAAGEDfEoJEkRQNH/iUv3IMChm3bhs1JctuNYdu2YXOS3HYTCKQwszebtg2Z0ypvAAAGDAgwVYs3VCoq3nhDtb+PijeFoUKl0kQB+CcqIa3G9iB3dE+A6jaqea+8lD1vvFGhStj5f1QG2JIkm7a2js/1PbZt3n1s69q2bevD7fc1Ef1XG4AMg/SMrsB+gAQA/qUOJ1VTejaJvhCU+/bq4jTL+lxU+Pry4fHmoJ/5mXD+9urR0/PlDpQZ+Ce73N7mw9XJxvrWcoxJfBi+9ZWxxfOr6aWF0UK1nSLfP9HbixuHd0/1UmsAzUAr1PVWIFg9WD0+md2e2x+qZWJ0vhbufBXOGT9YXju7u7/cHae9bn9fIl5PtREYAv3C/CwamVxHdYfVDp4EiqWKUhJDlHl4DCaaxQQK2xxeezCdidPpEPUCa2OwGI3HvAatwwmeSDqRikXyDBwjdXGHxey0WjRah8sTiKRzmQhdlBEY9CrkCpVWr9MgVzhIJ8u1Sizp7yaAKVQo1SqNFumMJl8sBYlsxi/kUTghsShfO3gJsy2QzIChh0URGAK+WC6VgEiMpCCRySWCDuqdUYBCiMXjc6m3JOBzQ6H/SAQ='
        };

        if (dates.length > 0) {
            for (const date of dates) {
                const data = logData[date];
                if (!data || typeof data !== 'object' || !data.ores || typeof data.ores !== 'object') continue;

                logHtml += `<div style="margin-bottom: 10px; border: 1px solid #eee; background: #fff; padding: 8px;">`;
                logHtml += `<div style="font-weight: bold; background: #f0f0f0; padding: 4px; margin: -8px -8px 8px -8px; display: flex; justify-content: space-between; align-items: center;">
                                <span>${date}</span>
                                <a href="javascript:void(0);" class="clear-log-btn" data-date="${date}" style="color: #d9534f; text-decoration: none; font-size: 11px; font-weight: normal; padding: 2px 6px; border: 1px solid #d9534f; border-radius: 3px; background: #fff;">Clear</a>
                            </div>`;
                logHtml += `<div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px;">`;

                const expFixed = (parseFloat(data.exp) || 0).toFixed(2);
                logHtml += `<span><b>Exp Gained:</b> ${expFixed}</span>`;

                const totalOres = Object.entries(data.ores).reduce((a, [name, count]) => {
                    const c = parseInt(count) || 0;
                    return a + ((name && name.toLowerCase().includes('shard')) ? c * 3 : c);
                }, 0);

                const tUsedSafe = parseInt(data.tUsed) || 0;
                const oresPerT = tUsedSafe > 0 ? (totalOres / tUsedSafe).toFixed(3) : '0.000';
                const expPerT = tUsedSafe > 0 ? (parseFloat(data.exp) / tUsedSafe).toFixed(3) : '0.000';

                logHtml += `<div style="text-align: right;">`;
                logHtml += `<div><b>Ores/T:</b> ${oresPerT} (${totalOres} from ${tUsedSafe}T)</div>`;
                logHtml += `<div><b>Exp/T:</b> ${expPerT}</div>`;
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

        // Skip the header row
        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].querySelectorAll('td');

            // Some rows are just text (like the Net stat gain summary at the bottom)
            if (cells.length === 1 && cells[0].hasAttribute('colspan')) {
                const summary = document.createElement('div');
                summary.style.cssText = 'width: 100%; text-align: center; margin-top: 10px; font-size: 12px; color: #333;';
                summary.innerHTML = cells[0].innerHTML;
                container.appendChild(summary);
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

            container.appendChild(card);
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
