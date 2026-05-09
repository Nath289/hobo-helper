const NorthernFenceHelper = {
    cmds: 'hill3',
    staff: false,
    group: 'City',
    settings: [
        { key: 'NorthernFenceHelper_PaginationButtons', label: 'Previous/Next Page Buttons (Hall of Fame)' }
    ],
    init: function() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('cmd') === 'hill3') {
            if (urlParams.get('do') === 'npc') {
                this.initNpcRacingHelper();
            } else if (urlParams.get('do') === 'hof') {
                this.initHallOfFameHelper();
            } else if (urlParams.get('do') === 'list') {
                this.initListHelper();
            } else if (urlParams.get('do') === 'npc_race') {
                this.initNpcRaceAgainHelper();
            }
        }
    },

    initListHelper: function() {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        let trackerData = {};
        try {
            const rawData = Utils.getItem('hw_cart_tracker');
            if (rawData) {
                trackerData = JSON.parse(rawData);
            }
        } catch (e) {}

        const playerId = Utils.getHoboId();

        const htmlRaw = contentArea.innerHTML;
        const lines = htmlRaw.split(/<br\s*\/?>/i);
        
        let introText = '';
        const racers = [];
        let footerHtml = '';

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (!line) continue;

            const match = line.match(/^(\d+)\.\s*(<a.*?href=".*?ID=(\d+)".*?>.*?<\/a>)\s*using the\s*(<strong>.*?<\/strong>)/i);
            
            if (match) {
                racers.push({
                    pos: match[1],
                    link: match[2],
                    id: match[3],
                    cart: match[4]
                });
            } else if (line.includes('These hobos are in the same class')) {
                introText = line;
            } else if (line.includes('<center>') || line.includes('[<a href')) {
                footerHtml += line + '<br>';
            }
        }

        if (racers.length === 0) return;

        let tableHtml = `
            <p style="margin-bottom: 10px;text-align:center;">${introText}</p>
            <table align="center" width="auto" style="min-width: 50%; margin-bottom:20px;" cellspacing="2" cellpadding="4">
                <tbody>
                    <tr>
                        <td bgcolor="#dddddd" colspan="4" align="center"><strong>Registered Racers</strong></td>
                    </tr>
                    <tr>
                        <td bgcolor="#eeeeee" align="center" width="30"><strong>#</strong></td>
                        <td bgcolor="#eeeeee"><strong>Hobo</strong></td>
                        <td bgcolor="#eeeeee"><strong>Cart</strong></td>
                        <td bgcolor="#eeeeee" align="center" width="100"><strong>Skill</strong></td>
                    </tr>
        `;

        racers.forEach(r => {
            const skill = (trackerData[r.id] && typeof trackerData[r.id].ls !== 'undefined') 
                ? parseFloat(trackerData[r.id].ls).toFixed(3) 
                : 'Unknown';
                
            let bgColor = '#f0f0f0';
            let rowStyle = '';
            
            if (r.id === playerId) {
                bgColor = '#fffec8';
                rowStyle = 'font-weight: bold;';
            }

            tableHtml += `
                <tr style="${rowStyle}">
                    <td bgcolor="${bgColor}" align="center">${r.pos}</td>
                    <td bgcolor="${bgColor}">${r.link}</td>
                    <td bgcolor="${bgColor}">${r.cart}</td>
                    <td bgcolor="${bgColor}" align="center">${skill}</td>
                </tr>
            `;
        });

        tableHtml += `
                </tbody>
            </table>
            <div style="text-align:center; margin-top:20px;">${footerHtml}</div>
        `;

        contentArea.innerHTML = tableHtml;
    },

    initNpcRacingHelper: function() {
        const table = document.querySelector('.content-area table');
        if (!table) return;

        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 6) {
                const costCell = cells[4];
                const costText = costCell.textContent.trim();
                if (costText.startsWith('$')) {
                    const costMatch = costText.match(/\$?([0-9,]+)/);
                    if (costMatch) {
                        const cost = Utils.parseNumber(costMatch[1]);
                        if (!isNaN(cost)) {
                            const totalCost = cost * 2; // Can race twice
                            const name = cells[0].textContent.trim();

                            const actionCell = cells[5];

                            // Parse original race link
                            const raceLink = actionCell.querySelector('a');
                            let raceHref = '';
                            if (raceLink) {
                                raceHref = raceLink.getAttribute('href');
                            }

                            // Replace inner text with clear flex layout for buttons
                            actionCell.innerHTML = '';
                            actionCell.style.display = 'flex';
                            actionCell.style.alignItems = 'center';
                            actionCell.style.justifyContent = 'center';

                            const commonBtnStyle = '-webkit-font-smoothing: antialiased; color: #636363; background: #ddd; font-weight: bold; text-decoration: none; padding: 0; width: 80px; height: 26px; line-height: 26px; text-align: center; border-radius: 3px; border: none; cursor: pointer; margin: 3px 2px; -webkit-appearance: none; display: inline-block; user-select: none; -webkit-user-select: none; font-family: inherit; font-size: 13px; box-sizing: border-box; vertical-align: middle;';

                            if (raceHref) {
                                const raceBtn = document.createElement('a');
                                raceBtn.href = raceHref;
                                raceBtn.textContent = 'Race';

                                raceBtn.className = 'btn';
                                raceBtn.style.cssText = commonBtnStyle;

                                raceBtn.addEventListener('mouseover', () => raceBtn.style.background = '#ccc');
                                raceBtn.addEventListener('mouseout', () => raceBtn.style.background = '#ddd');

                                actionCell.appendChild(raceBtn);
                            }

                            const btn = Utils.createBankButton(`Pikies (${name})`, totalCost);
                            btn.className = 'btn';
                            btn.style.cssText = commonBtnStyle;

                            btn.addEventListener('mouseover', () => { if (!btn.disabled) btn.style.background = '#ccc'; });
                            btn.addEventListener('mouseout', () => { if (!btn.disabled) btn.style.background = '#ddd'; });
                            // Make sure disabled state looks reasonable when clicked
                            const originalOnclick = btn.onclick;
                            btn.onclick = function(e) {
                                if (originalOnclick) originalOnclick.call(this, e);
                                this.style.background = '#eee';
                                this.style.color = '#aaa';
                                this.style.cursor = 'not-allowed';
                            };

                            actionCell.appendChild(btn);
                        }
                    }
                }
            }
        });
    },

    initHallOfFameHelper: function() {
        const savedSettings = Utils.getSettings();
        if (savedSettings['NorthernFenceHelper_PaginationButtons'] !== false) {
            this.initPaginationButtons();
        }

        this.initBottomPagination();

        const playerId = Utils.getHoboId();
        const table = document.querySelector('.content-area table');

        if (table) {
            const trackerData = this.trackHallOfFameData(table);
            this.renderTrackingTable(table, trackerData);
        }

        let foundPlayer = false;

        if (table && playerId !== 'Unknown') {
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length >= 3) {
                    const hoboLink = cells[0].querySelector('a');
                    if (hoboLink && hoboLink.href.includes(`ID=${playerId}`)) {
                        row.style.fontWeight = 'bold';
                        foundPlayer = true;
                    }
                }
            });
        }

        const urlParams = new URLSearchParams(window.location.search);
        const urlPage = urlParams.get('page');
        const currentPageNum = urlPage ? parseInt(urlPage) + 1 : 1;

        if (foundPlayer) {
            Utils.setItem('hof_player_page', currentPageNum);
        }

        const savedPageNum = Utils.getItem('hof_player_page');
        if (savedPageNum) {
            const strongs = document.querySelectorAll('.content-area strong');
            let pagesContainer = null;
            for (const s of strongs) {
                if (s.textContent.trim() === 'Pages:') {
                    pagesContainer = s.parentNode;
                    break;
                }
            }

            if (pagesContainer) {
                const links = pagesContainer.querySelectorAll('a');
                links.forEach(link => {
                    if (link.href && link.href.includes('do=hof') && link.textContent.trim() === savedPageNum.toString()) {
                        link.style.fontWeight = 'bold';
                        link.style.color = '#008000';
                        link.style.textDecoration = 'underline';
                        link.classList.add('hof-saved-page');
                    }
                });

                const pagesStrongs = pagesContainer.querySelectorAll('strong');
                pagesStrongs.forEach(s => {
                    if (s.textContent.trim() === savedPageNum.toString()) {
                        s.style.color = '#008000';
                        s.style.textDecoration = 'underline';
                        s.classList.add('hof-saved-page');
                    }
                });
            }
        }
    },

    initPaginationButtons: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlPage = urlParams.get('page');
        const currentPageIndex = urlPage ? parseInt(urlPage, 10) : 0;
        const currentPageNum = currentPageIndex + 1;

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        const table = contentArea.querySelector('table');
        if (!table) return;

        const strongs = contentArea.querySelectorAll('strong');
        let pagesContainer = null;
        for (const s of strongs) {
            if (s.textContent.trim() === 'Pages:') {
                pagesContainer = s.parentNode;
                break;
            }
        }

        if (!pagesContainer) return;

        let maxPageNum = 1;
        const allLinks = pagesContainer.querySelectorAll('a[href*="do=hof"]');
        allLinks.forEach(a => {
            const pageText = a.textContent.trim();
            const pNum = parseInt(pageText, 10);
            if (!isNaN(pNum) && pNum > maxPageNum) {
                maxPageNum = pNum;
            }
        });

        // Also check if current page is the max natively via bold <strong> tag
        const allStrongs = pagesContainer.querySelectorAll('strong');
        allStrongs.forEach(s => {
            const pNum = parseInt(s.textContent.trim(), 10);
            if (!isNaN(pNum) && pNum > maxPageNum) {
                maxPageNum = pNum;
            }
        });

        const navWrap = document.createElement('div');
        navWrap.style.display = 'flex';
        navWrap.style.justifyContent = 'space-between';
        navWrap.style.alignItems = 'center';
        navWrap.style.padding = '0 5px 8px 5px';
        navWrap.style.marginBottom = '5px';

        const baseHref = `game.php?sr=${Utils.getSr() || ''}&cmd=hill3&do=hof`;

        const prevDisabled = currentPageIndex <= 0;
        let prevHref = `${baseHref}&page=${currentPageIndex - 1}`;
        if (prevDisabled) prevHref = '#';

        const nextDisabled = currentPageNum >= maxPageNum;
        let nextHref = `${baseHref}&page=${currentPageIndex + 1}`;
        if (nextDisabled) nextHref = '#';

        const prevBtn = document.createElement('a');
        prevBtn.href = prevHref;
        prevBtn.textContent = '<< Previous Page';
        prevBtn.className = 'btn';
        prevBtn.style.padding = '5px 12px';
        prevBtn.style.textDecoration = 'none';
        if (prevDisabled) {
            prevBtn.style.background = '#eee';
            prevBtn.style.color = '#aaa';
            prevBtn.style.cursor = 'not-allowed';
            prevBtn.onclick = (e) => e.preventDefault();
        } else {
            prevBtn.addEventListener('mouseover', () => prevBtn.style.background = '#ccc');
            prevBtn.addEventListener('mouseout', () => prevBtn.style.background = '#ddd');
        }

        const nextBtn = document.createElement('a');
        nextBtn.href = nextHref;
        nextBtn.textContent = 'Next Page >>';
        nextBtn.className = 'btn';
        nextBtn.style.padding = '5px 12px';
        nextBtn.style.textDecoration = 'none';
        if (nextDisabled) {
            nextBtn.style.background = '#eee';
            nextBtn.style.color = '#aaa';
            nextBtn.style.cursor = 'not-allowed';
            nextBtn.onclick = (e) => e.preventDefault();
        } else {
            nextBtn.addEventListener('mouseover', () => nextBtn.style.background = '#ccc');
            nextBtn.addEventListener('mouseout', () => nextBtn.style.background = '#ddd');
        }

        const centerWrap = document.createElement('div');
        centerWrap.style.display = 'flex';
        centerWrap.style.flexDirection = 'column';
        centerWrap.style.alignItems = 'center';
        centerWrap.style.fontSize = '12px';
        centerWrap.style.fontWeight = 'bold';
        centerWrap.style.color = '#555';

        const pageTextDiv = document.createElement('div');
        pageTextDiv.innerHTML = `Page <span style="color:#000;">${currentPageNum}</span> of ${maxPageNum}`;
        centerWrap.appendChild(pageTextDiv);

        const savedPageStr = Utils.getItem('hof_player_page');
        if (savedPageStr) {
            const savedPageNum = parseInt(savedPageStr, 10);
            if (!isNaN(savedPageNum) && savedPageNum !== currentPageNum) {
                const savedHref = `${baseHref}&page=${savedPageNum - 1}`;
                const savedLink = document.createElement('a');
                savedLink.href = savedHref;
                savedLink.textContent = 'Jump to your Rank';
                savedLink.className = 'btn';
                savedLink.style.display = 'inline-block';
                savedLink.style.marginTop = '6px';
                savedLink.style.padding = '3px 10px';
                savedLink.style.textDecoration = 'none';
                savedLink.style.fontWeight = 'normal';

                savedLink.addEventListener('mouseover', () => savedLink.style.background = '#ccc');
                savedLink.addEventListener('mouseout', () => savedLink.style.background = '#ddd');

                centerWrap.appendChild(savedLink);
            } else if (savedPageNum === currentPageNum) {
                const foundText = document.createElement('div');
                foundText.textContent = `(You are on this page)`;
                foundText.style.fontSize = '10px';
                foundText.style.color = '#008000';
                foundText.style.fontWeight = 'normal';
                foundText.style.marginTop = '6px';
                centerWrap.appendChild(foundText);
            }
        }

        navWrap.appendChild(prevBtn);
        navWrap.appendChild(centerWrap);
        navWrap.appendChild(nextBtn);

        table.parentNode.insertBefore(navWrap, table.nextSibling);
    },

    initBottomPagination: function() {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        const strongs = contentArea.querySelectorAll('strong');
        let pagesLabel = null;
        for (const s of strongs) {
            if (s.textContent.trim() === 'Pages:') {
                pagesLabel = s;
                break;
            }
        }

        if (pagesLabel) {
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.flexWrap = 'wrap';
            container.style.gap = '4px';
            container.style.alignItems = 'center';
            container.style.justifyContent = 'center';
            container.style.marginTop = '10px';
            container.style.marginBottom = '15px';

            pagesLabel.parentNode.insertBefore(container, pagesLabel);
            pagesLabel.style.marginRight = '5px';
            container.appendChild(pagesLabel);

            let curr = pagesLabel.nextSibling;
            while (curr) {
                let next = curr.nextSibling;
                if (curr.nodeName === 'BR' || curr.nodeName === 'CENTER') {
                    if (curr.nodeName === 'BR') {
                        curr.remove();
                    } else if (curr.nodeName === 'CENTER') {
                        break;
                    }
                } else {
                    if (curr.nodeName === '#text') {
                        if (curr.textContent.trim() === '') {
                            curr.remove();
                        } else {
                            container.appendChild(curr);
                        }
                    } else if (curr.nodeName === 'A' || curr.nodeName === 'STRONG') {
                        const isA = curr.nodeName === 'A';
                        curr.style.padding = '3px 7px';
                        curr.style.border = '1px solid #ccc';
                        curr.style.borderRadius = '3px';
                        curr.style.textDecoration = 'none';
                        curr.style.fontSize = '11px';
                        curr.style.background = isA ? '#fdfdfd' : '#ddd';
                        curr.style.color = '#333';
                        curr.style.minWidth = '14px';
                        curr.style.textAlign = 'center';

                        if (isA) {
                            curr.addEventListener('mouseover', () => curr.style.background = '#efefef');
                            curr.addEventListener('mouseout', () => curr.style.background = '#fdfdfd');
                        }
                        container.appendChild(curr);
                    } else {
                        container.appendChild(curr);
                    }
                }
                curr = next;
            }
        }

        const backLink = contentArea.querySelector('center a[href*="cmd=hill3"]');
        if (backLink && backLink.textContent.includes('Back')) {
            const centerNode = backLink.closest('center');
            if (centerNode) {
                backLink.className = 'btn';
                backLink.style.display = 'inline-block';
                backLink.style.padding = '5px 16px';
                backLink.style.textDecoration = 'none';
                centerNode.innerHTML = '';
                centerNode.appendChild(backLink);
            }
        }
    },

    trackHallOfFameData: function(table) {
        let trackerData = {};
        try {
            const rawData = Utils.getItem('hw_cart_tracker');
            if (rawData) {
                trackerData = JSON.parse(rawData);
            }
        } catch (e) {
            trackerData = {};
        }
        if (!trackerData || typeof trackerData !== 'object') trackerData = {};

        const now = Date.now();
        const dDate = new Date(now);
        const dayOfWeek = dDate.getDay();
        const diffToMonday = dDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const currentWeekStart = new Date(dDate.setDate(diffToMonday)).setHours(0, 0, 0, 0);

        const rows = table.querySelectorAll('tr');
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length === 3) {
                // Ignore headers
                if (cells[0].textContent.includes('Hobo') && cells[1].textContent.includes('Skill')) {
                    return;
                }
                
                const hoboCell = cells[0];
                const link = hoboCell.querySelector('a');
                if (link) {
                    const idMatch = link.href.match(/ID=(\d+)/);
                    if (idMatch) {
                        const id = idMatch[1];
                        const name = link.textContent.trim();
                        // Skill text may have commas or decimals
                        const skillValStr = cells[1].textContent.replace(/,/g, '').trim();
                        const skillVal = parseFloat(skillValStr);
                        const rallyLevel = cells[2].textContent.trim();

                        if (!isNaN(skillVal)) {
                            if (!trackerData[id]) {
                                trackerData[id] = {
                                    n: name,
                                    c: rallyLevel,
                                    ft: now,
                                    fs: skillVal,
                                    lt: now,
                                    ls: skillVal,
                                    wt: currentWeekStart,
                                    ws: skillVal
                                };
                            } else {
                                // Check for weekly reset
                                if (!trackerData[id].wt || trackerData[id].wt < currentWeekStart) {
                                    trackerData[id].wt = currentWeekStart;
                                    // Set weekly start skill to the most recently known past value, or current if it didn't exist
                                    trackerData[id].ws = trackerData[id].ls || skillVal;
                                }

                                // Update name and class just in case
                                trackerData[id].n = name;
                                trackerData[id].c = rallyLevel;
                                // Update the last seen values
                                trackerData[id].lt = now;
                                trackerData[id].ls = skillVal;
                            }
                        }
                    }
                }
            }
        });

        Utils.setItem('hw_cart_tracker', JSON.stringify(trackerData));
        return trackerData;
    },

    renderTrackingTable: function(table, trackerData) {
        const pTag = document.createElement('p');
        pTag.innerHTML = `<strong>Super-Cart Racing Skill Tracker</strong><br>
        <span style="font-size:11px; color:#555;">View pages on the Hall of Fame periodically to update tracked Hobos and calculate their skill gains over time.</span>
        `;
        pTag.style.textAlign = 'center';
        pTag.style.marginTop = '20px';

        const controlsDiv = document.createElement('div');
        controlsDiv.style.textAlign = 'center';
        controlsDiv.style.marginBottom = '10px';

        const filterLabel = document.createElement('label');
        filterLabel.textContent = 'Filter by Class (Rally Level): ';
        filterLabel.style.fontWeight = 'bold';
        
        const filterSelect = document.createElement('select');
        filterSelect.innerHTML = '<option value="All">All</option>';
        for (let i = 1; i <= 10; i++) {
            filterSelect.innerHTML += `<option value="${i}">${i}</option>`;
        }
        
        const hideZeroWeeklyLabel = document.createElement('label');
        hideZeroWeeklyLabel.innerHTML = `<input type="checkbox"> Hide 0 Weekly Gains`;
        hideZeroWeeklyLabel.style.marginLeft = '15px';
        hideZeroWeeklyLabel.style.fontSize = '12px';
        hideZeroWeeklyLabel.style.cursor = 'pointer';

        const hideZeroTotalLabel = document.createElement('label');
        hideZeroTotalLabel.innerHTML = `<input type="checkbox"> Hide 0 Total Gains`;
        hideZeroTotalLabel.style.marginLeft = '15px';
        hideZeroTotalLabel.style.fontSize = '12px';
        hideZeroTotalLabel.style.cursor = 'pointer';

        controlsDiv.appendChild(filterLabel);
        controlsDiv.appendChild(filterSelect);
        controlsDiv.appendChild(hideZeroWeeklyLabel);
        controlsDiv.appendChild(hideZeroTotalLabel);

        const newTable = document.createElement('table');
        newTable.align = 'center';
        newTable.width = '80%';
        newTable.cellSpacing = '2';
        newTable.cellPadding = '4';
        newTable.style.marginBottom = '20px';

        // We prepare data
        const dataArr = Object.keys(trackerData).map(id => {
            const d = trackerData[id];
            const gained = d.ls - d.fs;
            const weekGained = (typeof d.ws !== 'undefined') ? (d.ls - d.ws) : 0;
            const timePassedMs = d.lt - d.ft;
            let timeStr = '0m';
            if (timePassedMs > 0) {
                const days = Math.floor(timePassedMs / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timePassedMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const mins = Math.floor((timePassedMs % (1000 * 60 * 60)) / (1000 * 60));
                if (days > 0) timeStr = `${days}d ${hours}h`;
                else if (hours > 0) timeStr = `${hours}h ${mins}m`;
                else timeStr = `${mins}m`;
            }

            return {
                id: id,
                name: d.n,
                cls: d.c,
                skill: d.ls,
                gained: gained,
                wgained: weekGained,
                time: timeStr
            };
        });

        // Compute racers summary (Active vs Total)
        const activeCounts = { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0 };
        const totalCounts = { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0 };
        let totalActive = 0;
        let globalTotal = 0;
        dataArr.forEach(d => {
            // Ensure proper numeric or string mapping
            let clsNum = String(d.cls).replace(/\D/g, ''); 
            if (clsNum) {
                if (totalCounts[clsNum] !== undefined) {
                    totalCounts[clsNum]++;
                    globalTotal++;
                } else {
                    totalCounts[clsNum] = 1;
                    globalTotal++;
                }

                if (d.gained > 0) {
                    if (activeCounts[clsNum] !== undefined) {
                        activeCounts[clsNum]++;
                        totalActive++;
                    } else {
                        activeCounts[clsNum] = 1;
                        totalActive++;
                    }
                }
            }
        });

        const summaryDiv = document.createElement('div');
        summaryDiv.style.textAlign = 'center';
        summaryDiv.style.marginBottom = '15px';
        summaryDiv.style.fontSize = '12px';
        
        const summaryToggleBtn = document.createElement('button');
        summaryToggleBtn.type = 'button';
        summaryToggleBtn.className = 'btn';
        summaryToggleBtn.textContent = 'Show Racers Summary';
        summaryToggleBtn.style.marginBottom = '10px';
        
        const summaryTable = document.createElement('table');
        summaryTable.align = 'center';
        summaryTable.width = '60%';
        summaryTable.cellSpacing = '2';
        summaryTable.cellPadding = '4';
        summaryTable.style.display = 'none';

        let rowsHtml = `
            <tr>
                <td bgcolor="#dddddd" colspan="3" align="center"><strong>Racers Summary</strong></td>
            </tr>
            <tr>
                <td bgcolor="#eeeeee" align="center"><strong>Racing Class</strong></td>
                <td bgcolor="#eeeeee" align="center"><strong>Active Racers</strong></td>
                <td bgcolor="#eeeeee" align="center"><strong>Total Racers</strong></td>
            </tr>
        `;
        for (let i = 1; i <= 10; i++) {
            rowsHtml += `
                <tr>
                    <td bgcolor="#f0f0f0" align="center">${i}</td>
                    <td bgcolor="#f0f0f0" align="center">${activeCounts[i] || 0}</td>
                    <td bgcolor="#f0f0f0" align="center">${totalCounts[i] || 0}</td>
                </tr>
            `;
        }
        rowsHtml += `
            <tr>
                <td bgcolor="#ececec" align="center"><strong>Total</strong></td>
                <td bgcolor="#e0e0e0" align="center"><strong>${totalActive}</strong></td>
                <td bgcolor="#e0e0e0" align="center"><strong>${globalTotal}</strong></td>
            </tr>
        `;

        summaryTable.innerHTML = `
            <tbody>
                ${rowsHtml}
            </tbody>
        `;

        summaryToggleBtn.onclick = (e) => {
            e.preventDefault();
            if (summaryTable.style.display === 'none') {
                summaryTable.style.display = 'table';
                summaryToggleBtn.textContent = 'Hide Racers Summary';
            } else {
                summaryTable.style.display = 'none';
                summaryToggleBtn.textContent = 'Show Racers Summary';
            }
        };

        summaryDiv.appendChild(summaryToggleBtn);
        summaryDiv.appendChild(summaryTable);

        // Restore tracker UI state
        let savedTrackerFilter = sessionStorage.getItem('hw_cart_filter') || 'All';
        let savedTrackerSort = sessionStorage.getItem('hw_cart_sort') || 'TotalGains';
        let savedTrackerSortDir = sessionStorage.getItem('hw_cart_sort_dir') || 'desc';
        let savedTrackerPage = parseInt(sessionStorage.getItem('hw_cart_page'), 10) || 1;
        let hideZW = sessionStorage.getItem('hw_cart_hide_zw') === 'true';
        let hideZT = sessionStorage.getItem('hw_cart_hide_zt') === 'true';

        filterSelect.value = savedTrackerFilter;
        if (!filterSelect.value) filterSelect.value = 'All';

        const cbZW = hideZeroWeeklyLabel.querySelector('input');
        cbZW.checked = hideZW;
        const cbZT = hideZeroTotalLabel.querySelector('input');
        cbZT.checked = hideZT;

        let currentSortBy = savedTrackerSort;
        let currentSortDir = savedTrackerSortDir;

        const sortData = (data, filterClass, sortBy, sortDir, hZW, hZT) => {
            return data.filter(d => {
                           if (filterClass !== 'All' && d.cls !== filterClass) return false;
                           if (hZW && d.wgained <= 0) return false;
                           if (hZT && d.gained <= 0) return false;
                           return true;
                       })
                       .sort((a, b) => {
                           let diff = 0;
                           if (sortBy === 'WeeklyGains') diff = b.wgained - a.wgained;
                           else if (sortBy === 'CurrentSkill') diff = b.skill - a.skill;
                           else diff = b.gained - a.gained; // Default TotalGains
                           return sortDir === 'asc' ? -diff : diff;
                       });
        };

        let currentPage = savedTrackerPage;
        const itemsPerPage = 50;

        const paginationDiv = document.createElement('div');
        paginationDiv.style.textAlign = 'center';
        paginationDiv.style.marginBottom = '10px';

        const renderRows = (filterClass, sortBy, sortDir, page = 1) => {
            newTable.innerHTML = `
                <tbody>
                    <tr>
                        <td bgcolor="#dddddd" colspan="7" align="center"><strong>Skill Gains</strong></td>
                    </tr>
                    <tr>
                        <td bgcolor="#eeeeee" align="center" width="20"><strong>#</strong></td>
                        <td bgcolor="#eeeeee"><strong>Hobo</strong></td>
                        <td bgcolor="#eeeeee" align="center"><strong>Class</strong></td>
                        <td bgcolor="#eeeeee" align="center" style="cursor:pointer; user-select:none;" class="sort-header" data-sort="CurrentSkill" title="Click to sort by Current Skill"><strong>Current Skill ${sortBy === 'CurrentSkill' ? (sortDir === 'asc' ? '▲' : '▼') : '<span style="color:#aaa;">▬</span>'}</strong></td>
                        <td bgcolor="#eeeeee" align="center" style="cursor:pointer; user-select:none;" class="sort-header" data-sort="WeeklyGains" title="Click to sort by Weekly Gains"><strong>Weekly Gains ${sortBy === 'WeeklyGains' ? (sortDir === 'asc' ? '▲' : '▼') : '<span style="color:#aaa;">▬</span>'}</strong></td>
                        <td bgcolor="#eeeeee" align="center" style="cursor:pointer; user-select:none;" class="sort-header" data-sort="TotalGains" title="Click to sort by Total Gains"><strong>Total Gains ${sortBy === 'TotalGains' ? (sortDir === 'asc' ? '▲' : '▼') : '<span style="color:#aaa;">▬</span>'}</strong></td>
                        <td bgcolor="#eeeeee" align="center"><strong>Time Passed</strong></td>
                    </tr>
                </tbody>
            `;
            const tbody = newTable.querySelector('tbody');
            
            const hZW = cbZW.checked;
            const hZT = cbZT.checked;
            const sorted = sortData(dataArr, filterClass, sortBy, sortDir, hZW, hZT);

            let totalPages = Math.ceil(sorted.length / itemsPerPage);
            if (totalPages === 0) totalPages = 1;
            if (page > totalPages) page = totalPages;

            currentPage = page;
            sessionStorage.setItem('hw_cart_filter', filterClass);
            sessionStorage.setItem('hw_cart_sort', sortBy);
            sessionStorage.setItem('hw_cart_sort_dir', sortDir);
            sessionStorage.setItem('hw_cart_hide_zw', hZW);
            sessionStorage.setItem('hw_cart_hide_zt', hZT);
            sessionStorage.setItem('hw_cart_page', currentPage);

            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pagedData = sorted.slice(startIndex, endIndex);

            if (sorted.length === 0) {
                tbody.innerHTML += `<tr><td colspan="7" bgcolor="#f0f0f0" align="center">No hobos tracked yet.</td></tr>`;
            }

            pagedData.forEach((row, index) => {
                const tr = document.createElement('tr');
                const rowNum = startIndex + index + 1;
                const gainedStr = row.gained > 0 ? '+' + row.gained.toFixed(3) : row.gained.toFixed(3);
                const wGainedStr = row.wgained > 0 ? '+' + row.wgained.toFixed(3) : row.wgained.toFixed(3);
                tr.innerHTML = `
                    <td bgcolor="#f0f0f0" align="center">${rowNum}</td>
                    <td bgcolor="#f0f0f0"><a href="game.php?cmd=player&ID=${row.id}">${row.name}</a></td>
                    <td bgcolor="#f0f0f0" align="center">${row.cls}</td>
                    <td bgcolor="#f0f0f0" align="center">${parseFloat(row.skill).toFixed(3)}</td>
                    <td bgcolor="#f0f0f0" align="center" style="color: ${row.wgained > 0 ? 'green' : '#333'}; font-weight: ${row.wgained > 0 ? 'bold' : 'normal'};">${wGainedStr}</td>
                    <td bgcolor="#f0f0f0" align="center" style="color: ${row.gained > 0 ? 'green' : '#333'}; font-weight: ${row.gained > 0 ? 'bold' : 'normal'};">${gainedStr}</td>
                    <td bgcolor="#f0f0f0" align="center">${row.time}</td>
                `;
                tbody.appendChild(tr);
            });

            // Build pagination UI
            paginationDiv.innerHTML = '';
            if (totalPages > 1) {
                const prevBtn = document.createElement('button');
                prevBtn.type = 'button';
                prevBtn.textContent = '<< Previous';
                prevBtn.className = 'btn';
                prevBtn.disabled = currentPage === 1;
                prevBtn.onclick = (e) => { e.preventDefault(); renderRows(filterSelect.value, currentSortBy, currentSortDir, currentPage - 1); };

                const pageLabel = document.createElement('span');
                pageLabel.textContent = ` Page ${currentPage} of ${totalPages} `;
                pageLabel.style.margin = '0 10px';
                pageLabel.style.fontWeight = 'bold';

                const nextBtn = document.createElement('button');
                nextBtn.type = 'button';
                nextBtn.textContent = 'Next >>';
                nextBtn.className = 'btn';
                nextBtn.disabled = currentPage === totalPages;
                nextBtn.onclick = (e) => { e.preventDefault(); renderRows(filterSelect.value, currentSortBy, currentSortDir, currentPage + 1); };

                paginationDiv.appendChild(prevBtn);
                paginationDiv.appendChild(pageLabel);
                paginationDiv.appendChild(nextBtn);
            }
        };

        newTable.addEventListener('click', (e) => {
            const th = e.target.closest('.sort-header');
            if (th) {
                const clickedSortBy = th.getAttribute('data-sort');
                if (currentSortBy === clickedSortBy) {
                    currentSortDir = currentSortDir === 'desc' ? 'asc' : 'desc';
                } else {
                    currentSortBy = clickedSortBy;
                    currentSortDir = 'desc'; // Default to desc on new column click
                }
                renderRows(filterSelect.value, currentSortBy, currentSortDir, 1);
            }
        });

        filterSelect.addEventListener('change', (e) => {
            renderRows(e.target.value, currentSortBy, currentSortDir, 1);
        });

        cbZW.addEventListener('change', () => {
            renderRows(filterSelect.value, currentSortBy, currentSortDir, 1);
        });

        cbZT.addEventListener('change', () => {
            renderRows(filterSelect.value, currentSortBy, currentSortDir, 1);
        });

        renderRows(filterSelect.value, currentSortBy, currentSortDir, savedTrackerPage);

        // We insert them after the table, but there's pagination below it. Let's see...
        // `table.nextSibling` might be the pagination which is added dynamically.
        // It's safe to insert right after the table
        let targetNode = table;
        
        // Let's actually insert at the very end of content area or right after the existing table.
        // If there's pagination navWrap inserted after table (by initPaginationButtons), we could insert after it.
        
        // We'll put it right after the table
        const contentArea = document.querySelector('.content-area');
        if (contentArea) {
            contentArea.appendChild(pTag);
            contentArea.appendChild(summaryDiv);
            contentArea.appendChild(controlsDiv);
            contentArea.appendChild(paginationDiv);
            contentArea.appendChild(newTable);
        } else {
            targetNode.insertAdjacentElement('afterend', newTable);
            targetNode.insertAdjacentElement('afterend', paginationDiv);
            targetNode.insertAdjacentElement('afterend', controlsDiv);
            targetNode.insertAdjacentElement('afterend', summaryDiv);
            targetNode.insertAdjacentElement('afterend', pTag);
        }
    },

    initNpcRaceAgainHelper: function() {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        const urlParams = new URLSearchParams(window.location.search);
        const npcId = urlParams.get('ID');
        if (!npcId) return;

        const btnHtml = `<div style="text-align: center; margin-bottom: 15px; margin-top: 10px;"><a href="game.php?sr=${Utils.getSr() || ''}&cmd=hill3&do=npc_race&ID=${npcId}" class="btn" style="-webkit-user-select:none;user-select:none;padding:5px 16px;text-decoration:none;display:inline-block;">Race Again</a></div>`;
        contentArea.insertAdjacentHTML('afterbegin', btnHtml);
    }
}
