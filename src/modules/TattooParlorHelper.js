        TattooParlorHelper: {
            init: function() {
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('cmd') === 'tattoo_parlor') {
                    const links = document.querySelectorAll('a[href*="tattoo_parlor"]');
                    links.forEach(link => {
                        const text = link.textContent;
                        if (text.includes('Retouch') || text.includes('Remove')) {
                            const costMatch = text.match(/\$?([0-9,]+)/);
                            if (costMatch) {
                                const cost = parseInt(costMatch[1].replace(/,/g, ''), 10);
                                if (!isNaN(cost) && cost > 0) {
                                    const actionName = text.includes('Retouch') ? 'Tattoo Retouch' : 'Tattoo Remove';

                                    const btn = document.createElement('button');
                                    btn.textContent = '+ Bank';
                                    btn.style.marginLeft = '8px';
                                    btn.style.fontSize = '10px';
                                    btn.style.cursor = 'pointer';

                                    btn.onclick = function(e) {
                                        e.preventDefault();
                                        Modules.BankHelper.addBankGoal(actionName, cost);

                                        this.textContent = 'Added!';
                                        this.disabled = true;
                                    };

                                    // Move button outside the link's parent if it's wrapped in square brackets
                                    if (link.nextSibling && link.nextSibling.nodeType === Node.TEXT_NODE && link.nextSibling.textContent.includes(']')) {
                                        link.parentNode.insertBefore(btn, link.nextSibling.nextSibling);
                                    } else {
                                        link.parentNode.insertBefore(btn, link.nextSibling);
                                    }
                                }
                            }
                        }
                    });
                }
            }
        }
