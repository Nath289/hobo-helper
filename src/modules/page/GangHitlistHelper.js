const GangHitlistHelper = {
    cmds: ['gang', 'gang2'],
    settings: [
        { key: 'GangHitlistHelper_HitlistPageTracker', label: 'Hitlist Page Tracker' },
        { key: 'GangHitlistHelper_HitlistMarkRed', label: 'Hitlist Mark Red' }
    ],
    init: function() {
        const queryParams = new URLSearchParams(window.location.search);
        const doParam = queryParams.get('do');

        if (doParam !== 'hitlist') return;

        const savedSettings = Utils.getSettings();

        if (savedSettings['GangHitlistHelper_HitlistPageTracker'] !== false) {
            this.initGangHitlistPageTracker(queryParams);
        }
        if (savedSettings['GangHitlistHelper_HitlistMarkRed'] !== false) {
            this.initGangHitlistMarkRed();
        }
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

    initGangHitlistMarkRed: function() {
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

        for (let i = 1; i < hitlistTable.rows.length; i++) {
            const row = hitlistTable.rows[i];
            const cells = row.querySelectorAll('td');
            if (cells.length < 5) continue;

            const link = cells[0].querySelector('a[href*="ID="]');
            if (!link) continue;

            const urlParams = new URLSearchParams(link.href.split('?')[1]);
            const hoboId = urlParams.get('ID');
            if (!hoboId) continue;

            const origBg = cells[0].getAttribute('bgcolor') || '#eeeeee';

            const optionsCell = cells[4];
            optionsCell.style.whiteSpace = 'nowrap';

            const markContainer = document.createElement('span');
            markContainer.style.marginLeft = '4px';

            const renderRow = () => {
                const isMarked = markedHobos.includes(hoboId);
                const targetBg = isMarked ? '#ffcccc' : origBg;

                cells.forEach(td => {
                    td.setAttribute('bgcolor', targetBg);
                    td.style.backgroundColor = targetBg;
                });

                markContainer.innerHTML = isMarked
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
            };

            renderRow();
            optionsCell.appendChild(markContainer);
        }
    }
};
