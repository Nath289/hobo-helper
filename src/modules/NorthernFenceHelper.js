        NorthernFenceHelper: {
            init: function() {
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('cmd') === 'hill3' && urlParams.get('do') === 'npc') {
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
                                    const cost = parseInt(costMatch[1].replace(/,/g, ''), 10);
                                    if (!isNaN(cost)) {
                                        const totalCost = cost * 2; // Can race twice
                                        const name = cells[0].textContent.trim();

                                        const actionCell = cells[5];
                                        const btn = document.createElement('button');
                                        btn.textContent = '+ Bank';
                                        btn.style.marginLeft = '8px';
                                        btn.style.fontSize = '10px';
                                        btn.style.cursor = 'pointer';

                                        btn.onclick = function() {
                                            Modules.BankHelper.addBankGoal(`Pikies (${name})`, totalCost);

                                            this.textContent = 'Added!';
                                            this.disabled = true;
                                        };

                                        actionCell.appendChild(btn);
                                    }
                                }
                            }
                        }
                    });
                }
                
                if (urlParams.get('cmd') === 'hill3' && urlParams.get('do') === 'hof') {
                    const playerId = Helpers.getHoboId();
                    const table = document.querySelector('.content-area table');
                    if (table && playerId !== 'Unknown') {
                        const rows = table.querySelectorAll('tr');
                        rows.forEach(row => {
                            const cells = row.querySelectorAll('td');
                            if (cells.length >= 3) {
                                const hoboLink = cells[0].querySelector('a');
                                if (hoboLink && hoboLink.href.includes(`ID=${playerId}`)) {
                                    row.style.fontWeight = 'bold';
                                }
                            }
                        });
                    }
                }
            }
        }
