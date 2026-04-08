const NorthernFenceHelper = {
    cmds: 'hill3',
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
            localStorage.setItem('hof_player_page', currentPageNum);
        }

        const savedPageNum = localStorage.getItem('hof_player_page');
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
                    }
                });

                const pagesStrongs = pagesContainer.querySelectorAll('strong');
                pagesStrongs.forEach(s => {
                    if (s.textContent.trim() === savedPageNum.toString()) {
                        s.style.color = '#008000';
                        s.style.textDecoration = 'underline';
                    }
                });
            }
        }
    }
}
