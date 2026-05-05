const MinesHelper = {
    cmds: 'mines',

    settings: [
        { key: 'MinesHelper_Widen', label: 'Widen Mines Content Area', type: 'checkbox', default: true },
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

        // Widen the view
        if (settings['MinesHelper_Widen'] !== false) {
            const contentArea = document.querySelector('.content-area');
            if (contentArea) {
                contentArea.style.maxWidth = '1000px';
                contentArea.style.minWidth = '1000px';
            }
        }

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

        if (settings['MinesHelper_FormatStats'] !== false) {
            try { this.formatStats(); } catch (e) { Utils.log(e); }
        }

        if (settings['MinesHelper_FormatOres'] !== false) {
            try { this.formatOres(); } catch (e) { Utils.log(e); }
        }

        if (settings['MinesHelper_FormatTrades'] !== false) {
            try { this.formatTrades(); } catch (e) { Utils.log(e); }
        }

        if (settings['MinesHelper_Log'] !== false) {
            try { this.processMiningLog(); } catch (e) { Utils.log(e); }
        }
    },

    processMiningLog: function() {
        let newExp = 0;
        let newOres = [];
        let tUsedVal = 2; // Default if not found

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        let parsedAction = false;
        const html = contentArea.innerHTML || '';

        if (html.includes('You gain') || html.includes('You get the') || html.includes('Suddenly the wall crumbles') || html.includes('hit a sweet spot') || html.includes('narrowly avoid') || html.includes('ROCKSLIDE')) {
            const expMatch = html.match(/You gain(?:ed)?\s*(?:<b>)?([\d.]+)(?:<\/b>)?\s*mining/i);
            if (expMatch) newExp += parseFloat(expMatch[1]);

            // Matches "You get the <b>Orange Ore</b>" or plain text gracefully up to the next HTML tag
            const oreRegex = /You get the (?:<b>)?([A-Za-z ]+?)(?:<\/b>)?(?=\s*(?:<a|<br>|<\/span>|<img)|$)/gi;
            let match;
            while ((match = oreRegex.exec(html)) !== null) {
                let name = match[1].trim();
                name = name.replace(/^(.+)\s+\1$/i, '$1');
                newOres.push(name);
            }
            parsedAction = true;
        }

        if (parsedAction) {
            // Try to extract T used and Mine stat from the summary center tag if it exists
            let tFound = false;
            const centers = contentArea.querySelectorAll('center');
            for (const c of centers) {
                if (c.textContent.includes('T used:') && c.textContent.includes('Mine stat:')) {
                    const tMatch = c.textContent.match(/T used:\s*(\d+)/i);
                    if (tMatch) {
                        tUsedVal = parseInt(tMatch[1], 10);
                        tFound = true;
                    }
                    const expMatch2 = c.textContent.match(/Mine stat:\s*([\d.]+)/i);
                    if (expMatch2) {
                        newExp = parseFloat(expMatch2[1]);
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
                            tUsedVal = parseInt(nextTd.textContent, 10) || 0;
                            tFound = true;
                        }
                        break;
                    }
                }
            }
            if (!tFound && window.location.href.includes('&move=')) {
                tUsedVal = 1;
            }
        } else if (window.location.href.includes('&move=') && !document.body.textContent.includes("enough Awake")) {
            // Moving around the grid arrows costs 1T natively
            parsedAction = true;
            tUsedVal = 1;
            newExp = 0; // Just to be explicit
        }

        const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
        let logData = Utils.getItem('hw_mines_log_data') || {};

        if (!logData[today]) {
            logData[today] = { exp: 0, tUsed: 0, ores: {} };
        }

        if (parsedAction) {
            logData[today].exp += newExp;
            logData[today].tUsed += tUsedVal;

            for (const ore of newOres) {
                logData[today].ores[ore] = (logData[today].ores[ore] || 0) + 1;
            }
            Utils.setItem('hw_mines_log_data', logData);
        }

        const logWrapper = document.createElement('div');
        logWrapper.style.cssText = 'margin: 20px auto; max-width: 800px; padding: 10px; background: #fdfdfd; border: 1px solid #ccc; border-radius: 4px;';

        let logHtml = '<h3 style="margin-top: 0; text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Mining Log</h3>';

        const dates = Object.keys(logData).sort((a,b) => new Date(b) - new Date(a));

        if (dates.length === 0) {
            logHtml += '<div style="text-align: center; padding: 10px; color: #666;">No mining history recorded yet.</div>';
        }

        for (const date of dates) {
            const data = logData[date];
            logHtml += `<div style="margin-bottom: 10px; border: 1px solid #eee; background: #fff; padding: 8px;">`;
            logHtml += `<div style="font-weight: bold; background: #f0f0f0; padding: 4px; margin: -8px -8px 8px -8px;">${date}</div>`;
            logHtml += `<div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 5px;">`;
            logHtml += `<span><b>Exp Gained:</b> ${data.exp.toFixed(2)}</span>`;

            const totalOres = Object.entries(data.ores).reduce((a, [name, count]) => {
                return a + (name.toLowerCase().includes('shard') ? count * 3 : count);
            }, 0);
            const oresPerT = data.tUsed > 0 ? (totalOres / data.tUsed).toFixed(3) : '0.000';

            logHtml += `<span><b>Ores/T:</b> ${oresPerT} (${totalOres} from ${data.tUsed}T)</span>`;
            logHtml += `</div>`;

            if (Object.keys(data.ores).length > 0) {
                logHtml += `<div style="display: flex; flex-wrap: wrap; gap: 5px;">`;
                for (const [ore, count] of Object.entries(data.ores)) {
                    logHtml += `<span style="background: #eef; padding: 2px 6px; border-radius: 3px; font-size: 11px;">${ore}: <b>${count}</b></span>`;
                }
                logHtml += `</div>`;
            } else {
                logHtml += `<div style="font-size: 11px; color: #999;">No ores found on this day.</div>`;
            }
            logHtml += `</div>`;
        }

        logWrapper.innerHTML = logHtml;
        contentArea.appendChild(logWrapper);
    },

    formatTrades: function() {
        const tradeTable = document.querySelector('table[cellpadding="0"][cellspacing="0"]');
        if (!tradeTable) return;

        const rows = tradeTable.querySelectorAll('tr');
        if (rows.length < 2) return;

        // Verify this is the trade table
        if (!rows[0].textContent.includes('Give me') || !rows[0].textContent.includes("I'll give you")) return;

        const container = document.createElement('div');
        container.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin: 15px auto; max-width: 800px; padding: 10px; background: #f8f9fc; border: 1px solid #d3e0f0; border-radius: 6px;';

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

            // Extract stats and force them onto unique lines
            const statHtml = getHtmlNode.innerHTML.replace(/<\/font>\s*,\s*<font/g, '</font><font')
                                                  .replace(/<font color="?green"?>/g, '<span style="color: green; font-weight: bold; display: block; margin-bottom: 2px;">')
                                                  .replace(/<font color="?red"?>/g, '<span style="color: #d9534f; font-weight: bold; display: block;">')
                                                  .replace(/<\/font>/g, '</span>');

            const netGainTitle = getHtmlNode.getAttribute('title') || '';

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
                    card.style.boxShadow = '0 0 4px rgba(0,0,0,.2)';
                    card.style.transform = 'scale(1.03)';
                };
                card.onmouseout = () => {
                    card.style.borderColor = '#c0c0c0';
                    card.style.boxShadow = 'none';
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
            
            // Only highlight low inventory items (not the exchange preview boxes)
            if (!isSingleSpan && countVal < threshold) {
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
                min-height: 65px;
                padding: 4px 4px 14px 4px;
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
                    const trimmed = n.textContent.trim();
                    if (trimmed) {
                        n.textContent = trimmed;
                        countWrapper.appendChild(n);
                    }
                } else {
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
        }
    },

    formatStats: function() {
        const centerTags = document.querySelectorAll('center');
        const statsCenter = Array.from(centerTags).find(c => c.textContent.includes('Mine Section') && c.textContent.includes('Mining:'));
        if (!statsCenter) return;

        const text = statsCenter.innerHTML.replace(/<[^>]+>/g, "");
        const sectionMatch = text.match(/Mine Section\s+(\d+)/i);
        const miningMatch = text.match(/Mining:\s*([\d.,]+)/i);
        const oreFoundMatch = text.match(/Ore found:\s*([\d,]+(?:\s*\[\s*\d+\s*\])?)/i);
        const oreTradedMatch = text.match(/Ore traded:\s*([\d,]+(?:\s*\[\s*\d+\s*\])?)/i);
        const tUsedMatch = text.match(/T used:\s*([\d,]+)/i);

        if (!sectionMatch) return;

        const section = sectionMatch[1];
        const mining = miningMatch ? miningMatch[1] : '0';
        const oreFound = oreFoundMatch ? oreFoundMatch[1] : '0';
        const oreTraded = oreTradedMatch ? oreTradedMatch[1] : '0';
        const tUsed = tUsedMatch ? tUsedMatch[1] : '0';

        let tableHtml = '<div style="width: 130px; margin: 10px auto; padding: 4px; outline: 1px solid #CCCCCC; border: 2px solid #E8E8E8; background: #F9F9F9; font-size: 13px;">';
        tableHtml += '<table style="width: 100%; border-collapse: collapse;">';
        tableHtml += '<tr><th colspan="2" style="padding: 2px; text-align: center;">Mine Section ' + section + '</th></tr>';
        tableHtml += '<tr><td colspan="2" style="padding: 2px 2px 8px 2px; text-align: center;">Mining: ' + mining + '</td></tr>';
        tableHtml += '<tr><td style="padding: 2px; text-align: left;">Ore found:</td><td style="padding: 2px; text-align: right;">' + oreFound + '</td></tr>';
        tableHtml += '<tr><td style="padding: 2px; text-align: left;">Ore traded:</td><td style="padding: 2px; text-align: right;">' + oreTraded + '</td></tr>';
        tableHtml += '<tr><td style="padding: 2px; text-align: left;">T used:</td><td style="padding: 2px; text-align: right;">' + tUsed + '</td></tr>';
        tableHtml += '</table>';
        tableHtml += '</div>';

        statsCenter.outerHTML = tableHtml;
    },

    formatActiveList: function() {
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
            mapTable.insertAdjacentElement('afterend', legend);
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
    }
};
