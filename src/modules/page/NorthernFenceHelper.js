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
                                    const btn = Utils.createBankButton(`Pikies (${name})`, totalCost);

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
