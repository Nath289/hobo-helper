const MinesHelper = {
    cmds: 'mines',

    settings: [
        { key: 'MinesHelper_Widen', label: 'Widen Mines Content Area', type: 'checkbox', default: true },
        { key: 'MinesHelper_StyleButtons', label: 'Style Buttons & Links', type: 'checkbox', default: true },
        { key: 'MinesHelper_SafeZones', label: 'Highlight Safe Zones', type: 'checkbox', default: true },
        { key: 'MinesHelper_ActiveTable', label: 'Format Active List into Table', type: 'checkbox', default: true },
        { key: 'MinesHelper_FormatStats', label: 'Format Mining Stats', type: 'checkbox', default: true }
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
    },

    formatStats: function() {
        const centerTags = document.querySelectorAll('center');
        const statsCenter = Array.from(centerTags).find(c => c.textContent.includes('Mine Section') && c.textContent.includes('Mining:'));
        if (!statsCenter) return;

        const text = statsCenter.innerHTML;
        const sectionMatch = text.match(/Mine Section\s+(\d+)/i);
        const miningMatch = text.match(/Mining:\s*([\d.,]+)/i);
        const oreFoundMatch = text.match(/Ore found:\s*([\d,]+)/i);
        const oreTradedMatch = text.match(/Ore traded:\s*([\d,]+)/i);
        const tUsedMatch = text.match(/T used:\s*([\d,]+)/i);

        if (!sectionMatch) return;

        const section = sectionMatch[1];
        const mining = miningMatch ? miningMatch[1] : '0';
        const oreFound = oreFoundMatch ? oreFoundMatch[1] : '0';
        const oreTraded = oreTradedMatch ? oreTradedMatch[1] : '0';
        const tUsed = tUsedMatch ? tUsedMatch[1] : '0';

        let tableHtml = '<table class="bmenu" style="width: 160px; border-collapse: collapse; margin: 10px auto; font-size: 13px;">';
        tableHtml += '<tr style="background: #ccc; border-bottom: 2px solid #aaa; color: #333;"><th colspan="2" style="padding: 5px; text-align: center; font-weight: normal;">Mine Section ' + section + '</th></tr>';
        tableHtml += '<tr style="background: rgba(0,0,0,0.05); border-bottom: 1px solid #ddd;"><td colspan="2" style="padding: 5px; text-align: center;">Mining: ' + mining + '</td></tr>';
        tableHtml += '<tr style="background: transparent; border-bottom: 1px solid #ddd;"><td style="padding: 5px; text-align: left;">Ore found:</td><td style="padding: 5px; text-align: right;">' + oreFound + '</td></tr>';
        tableHtml += '<tr style="background: rgba(0,0,0,0.05); border-bottom: 1px solid #ddd;"><td style="padding: 5px; text-align: left;">Ore traded:</td><td style="padding: 5px; text-align: right;">' + oreTraded + '</td></tr>';
        tableHtml += '<tr style="background: transparent; border-bottom: 1px solid #ddd;"><td style="padding: 5px; text-align: left;">T used:</td><td style="padding: 5px; text-align: right;">' + tUsed + '</td></tr>';
        tableHtml += '</table>';

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
