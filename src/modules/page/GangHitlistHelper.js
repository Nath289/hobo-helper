const GangHitlistHelper = {
    cmds: ['gang', 'gang2'],
    staff: false,
    settings: [
        { key: 'GangHitlistHelper_HitlistPageTracker', label: 'Hitlist Page Tracker' },
        { key: 'GangHitlistHelper_HitlistMarkRed', label: 'Hitlist Mark Red' },
        { key: 'GangHitlistHelper_AutoMarkRange', label: 'Auto-Mark Out of Attack Range' },
        { key: 'GangHitlistHelper_WrapPagination', label: 'Wrap Hitlist Pagination' },
        { key: 'GangHitlistHelper_TopPagination', label: 'Top Pagination Links' }
    ],
    init: function() {
        const queryParams = new URLSearchParams(window.location.search);
        const doParam = queryParams.get('do');

        if (doParam !== 'hitlist') return;

        const savedSettings = Utils.getSettings();

        if (savedSettings['GangHitlistHelper_TopPagination'] !== false) {
            this.initTopPagination();
        }

        if (savedSettings['GangHitlistHelper_HitlistPageTracker'] !== false) {
            this.initGangHitlistPageTracker(queryParams);
        }
        if (savedSettings['GangHitlistHelper_HitlistMarkRed'] !== false || savedSettings['GangHitlistHelper_AutoMarkRange'] !== false) {
            this.initGangHitlistRowModifiers(savedSettings['GangHitlistHelper_HitlistMarkRed'] !== false, savedSettings['GangHitlistHelper_AutoMarkRange'] !== false);
        }
        if (savedSettings['GangHitlistHelper_WrapPagination'] !== false) {
            this.initWrapPagination();
        }
    },

    initWrapPagination: function() {
        const pageLabels = Array.from(document.querySelectorAll('td')).filter(td => td.textContent.match(/Page \d+ out of \d+:/));
        pageLabels.forEach(td => {
            const row = td.parentElement;
            if (row && row.children.length >= 3) {
                const paginationTd = row.children[2];
                const innerTable = paginationTd.querySelector('table');
                if (innerTable) {
                    const tbodyTr = innerTable.querySelector('tbody > tr');
                    if (tbodyTr) {
                        tbodyTr.style.display = 'flex';
                        tbodyTr.style.flexWrap = 'wrap';
                        tbodyTr.style.gap = '2px';
                    }
                }
            }
        });
    },

    initTopPagination: function() {
        const tables = document.querySelectorAll('table[width="100%"]');
        let hitlistTable = null;
        tables.forEach(t => {
            if (t.rows.length > 0 && t.rows[0].textContent.includes('Player') && t.rows[0].textContent.includes('Options')) {
                hitlistTable = t;
            }
        });

        if (!hitlistTable) return;

        const pageLabels = Array.from(document.querySelectorAll('td')).filter(td => td.textContent.match(/Page \d+ out of \d+:/));
        if (pageLabels.length === 0) return;

        const match = pageLabels[0].textContent.match(/Page (\d+) out of (\d+):/);
        if (!match) return;

        const currentPage = parseInt(match[1], 10);
        const lastPageLength = parseInt(match[2], 10);

        const row = pageLabels[0].parentElement;
        const anyPageLink = row ? row.querySelector('a[href*="page="]') : null;
        const baseHref = anyPageLink ? anyPageLink.getAttribute('href') : window.location.href;

        const navWrap = document.createElement('div');
        navWrap.style.display = 'flex';
        navWrap.style.justifyContent = 'space-between';
        navWrap.style.alignItems = 'center';
        navWrap.style.padding = '0 5px 8px 5px';
        navWrap.style.marginBottom = '5px';

        const style = document.createElement('style');
        style.innerHTML = `
            .hw-hitlist-btn {
                -webkit-font-smoothing: antialiased;
                color: #636363;
                background: #ddd;
                font-weight: bold;
                text-decoration: none;
                padding: 5px 16px;
                border-radius: 3px;
                border: 0;
                cursor: pointer;
                margin: 3px 2px;
                -webkit-appearance: none;
                display: inline-block;
                line-height: 1em;
                user-select: none;
                -webkit-user-select: none;
            }
            .hw-hitlist-btn:hover {
                color: #fff;
                background: #1b9eff;
                box-shadow: 0 0 0 rgba(0,0,0,.4);
            }
        `;
        document.head.appendChild(style);

        const leftDiv = document.createElement('div');
        leftDiv.style.flex = '1';
        leftDiv.style.textAlign = 'left';

        const midDiv = document.createElement('div');
        midDiv.style.flex = '1';
        midDiv.style.textAlign = 'center';

        const rightDiv = document.createElement('div');
        rightDiv.style.flex = '1';
        rightDiv.style.textAlign = 'right';

        const createButton = (text, targetPageNum, normalSize = false) => {
            const a = document.createElement('a');
            a.textContent = text;
            a.className = 'hw-hitlist-btn';

            if (normalSize) {
                a.style.fontWeight = 'normal';
                a.style.fontSize = '11px';
                a.style.padding = '4px 12px';
            }

            const paramVal = Math.max(0, targetPageNum - 1);
            let newHref = baseHref;
            if (newHref.includes('page=')) {
                newHref = newHref.replace(/page=\d+/, `page=${paramVal}`);
            } else {
                newHref += `&page=${paramVal}`;
            }
            a.href = newHref;
            return a;
        };

        if (currentPage > 1) {
            leftDiv.appendChild(createButton(`« Previous Page`, currentPage - 1));
        } else {
            const btn = createButton(`« Previous Page`, 1);
            btn.style.color = '#aaa';
            btn.style.cursor = 'default';
            btn.href = '#';
            btn.onclick = (e) => e.preventDefault();
            leftDiv.appendChild(btn);
        }

        const savedPageRaw = localStorage.getItem('hw_helper_gang_hitlist_page');
        const savedPageIdx = parseInt(savedPageRaw, 10);
        if (!isNaN(savedPageIdx)) {
            const savedDisplayNum = savedPageIdx + 1;
            if (savedDisplayNum !== currentPage && savedDisplayNum > 0) {
                midDiv.appendChild(createButton(`Last Viewed Page (${savedDisplayNum})`, savedDisplayNum, true));
            }
        }

        if (currentPage < lastPageLength) {
            rightDiv.appendChild(createButton(`Next Page »`, currentPage + 1));
        } else {
            const btn = createButton(`Next Page »`, lastPageLength);
            btn.style.color = '#aaa';
            btn.style.cursor = 'default';
            btn.href = '#';
            btn.onclick = (e) => e.preventDefault();
            rightDiv.appendChild(btn);
        }

        navWrap.appendChild(leftDiv);
        navWrap.appendChild(midDiv);
        navWrap.appendChild(rightDiv);

        hitlistTable.parentElement.insertBefore(navWrap, hitlistTable);
    },

    initGangHitlistPageTracker: function(queryParams) {
        const pageParam = queryParams.get('page');
        let savedPage = localStorage.getItem('hw_helper_gang_hitlist_page');

        if (pageParam !== null) {
            if (parseInt(pageParam, 10) > 0) {
                savedPage = pageParam;
                localStorage.setItem('hw_helper_gang_hitlist_page', savedPage);
            }
        }

        if (savedPage !== null && parseInt(savedPage, 10) > 0) {
            const pageLinks = document.querySelectorAll('a[href*="do=hitlist"]');
            pageLinks.forEach(link => {
                try {
                    const url = new URL(link.href, window.location.origin);
                    if (url.searchParams.get('page') === savedPage) {
                        link.style.fontSize = '32px';
                        link.style.fontWeight = 'bold';

                        const td = link.parentElement;
                        if (td && td.tagName === 'TD') {
                            if (td.getAttribute('bgcolor') !== '#7799ff') {
                                td.style.backgroundColor = '#fffacd';
                                td.setAttribute('bgcolor', '#fffacd');
                                td.onmouseover = function() { this.style.backgroundColor = '#ffeb8a'; };
                                td.onmouseout = function() { this.style.backgroundColor = '#fffacd'; };
                            }
                        }
                    }
                } catch (e) {}
            });
        }
    },

    initGangHitlistRowModifiers: function(enableMarkRed, enableAutoMarkRange) {
        const tables = document.querySelectorAll('table[width="100%"]');
        let hitlistTable = null;
        tables.forEach(t => {
            if (t.rows.length > 0 && t.rows[0].textContent.includes('Player') && t.rows[0].textContent.includes('Options')) {
                hitlistTable = t;
            }
        });

        if (!hitlistTable) return;

        if (hitlistTable.rows[0]) {
            const headerCells = hitlistTable.rows[0].querySelectorAll('td');
            if (headerCells.length >= 5) {
                headerCells[4].setAttribute('width', '15%');
                headerCells[4].style.whiteSpace = 'nowrap';

                if (headerCells[3] && headerCells[3].getAttribute('width') === '20%') {
                    headerCells[3].setAttribute('width', '15%');
                }
            }
        }

        let markedHobos = JSON.parse(localStorage.getItem('hw_helper_gang_hitlist_marked') || '[]');
        const playerLvl = Utils.getHoboLevel();

        for (let i = 1; i < hitlistTable.rows.length; i++) {
            const row = hitlistTable.rows[i];
            const cells = row.querySelectorAll('td');
            if (cells.length < 5) continue;

            const link = cells[0].querySelector('a[href*="ID="]');
            if (!link) continue;

            const urlParams = new URLSearchParams(link.href.split('?')[1]);
            const hoboId = urlParams.get('ID');
            if (!hoboId) continue;

            let isOutOfRange = false;
            if (enableAutoMarkRange && playerLvl > 0) {
                const targetLvl = parseInt(cells[1].textContent.replace(/,/g, '').trim(), 10);
                if (!isNaN(targetLvl) && Math.abs(targetLvl - playerLvl) > 200) {
                    isOutOfRange = true;
                }
            }

            const origBg = cells[0].getAttribute('bgcolor') || '#eeeeee';

            const optionsCell = cells[4];
            optionsCell.style.whiteSpace = 'nowrap';

            const markContainer = document.createElement('span');
            markContainer.style.marginLeft = '4px';

            const renderRow = () => {
                const isMarkedManually = enableMarkRed && markedHobos.includes(hoboId);
                const isColoredRed = isMarkedManually || isOutOfRange;
                const targetBg = isColoredRed ? (isOutOfRange ? '#f8d7da' : '#ffcccc') : origBg;

                cells.forEach(td => {
                    td.setAttribute('bgcolor', targetBg);
                    td.style.backgroundColor = targetBg;
                });

                if (enableMarkRed) {
                    if (isOutOfRange) {
                        markContainer.innerHTML = '[<span style="color:gray;">Out of Range</span>]';
                    } else {
                        markContainer.innerHTML = isMarkedManually
                            ? '[<a href="#" style="text-decoration:none; color:gray;">Unmark</a>]'
                            : '[<a href="#" style="text-decoration:none; color:red;">Mark</a>]';

                        const toggleLink = markContainer.querySelector('a');
                        if (toggleLink) {
                            toggleLink.addEventListener('click', (e) => {
                                e.preventDefault();
                                const currentlyMarked = markedHobos.includes(hoboId);
                                if (currentlyMarked) {
                                    markedHobos = markedHobos.filter(id => id !== hoboId);
                                } else {
                                    if (!markedHobos.includes(hoboId)) markedHobos.push(hoboId);
                                }
                                localStorage.setItem('hw_helper_gang_hitlist_marked', JSON.stringify(markedHobos));
                                renderRow();
                            });
                        }
                    }
                }
            };

            renderRow();
            if (enableMarkRed) {
                optionsCell.appendChild(markContainer);
            }
        }
    }
};
