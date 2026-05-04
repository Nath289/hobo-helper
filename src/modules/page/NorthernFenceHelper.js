const NorthernFenceHelper = {
    cmds: 'hill3',
    staff: false,
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
            }
        }
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
    }
}
