// ==UserScript==
// @name         HoboWars Helper Toolkit
// @namespace    http://tampermonkey.net/
// @version      7.53
// @description  Combines original HoboWars helpers into a single modular script.
// @author       Gemini (Combined)
// @match        *://www.hobowars.com/game/game.php?*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
const Utils = {
        getHoboMinutes: function() {
            const clockEl = document.getElementById('clock');
            if (!clockEl) return null;
            const match = clockEl.textContent.trim().toLowerCase().match(/(\d+):(\d+):(\d+)\s*(am|pm)/);
            if (!match) return null;
            let hours = parseInt(match[1]);
            const minutes = parseInt(match[2]);
            if (match[4] === 'pm' && hours !== 12) hours += 12;
            if (match[4] === 'am' && hours === 12) hours = 0;
            return (hours * 60) + minutes;
        },
        getHoboLevel: function() {
            const levelSpan = document.getElementById('statValueLvl');
            if (levelSpan) {
                return this.parseNumber(levelSpan.textContent);
            }
            return 0; // Default if not found
        },
        getHoboName: function() {
            const nameElement = document.querySelector('.pname span a');
            if (nameElement) {
                return nameElement.textContent.trim();
            }
            return 'Unknown'; 
        },
        getHoboId: function() {
            const nameElement = document.querySelector('.pname span a');
            if (nameElement && nameElement.href) {
                const match = nameElement.href.match(/[?&]ID=(\d+)/i);
                if (match) {
                    return match[1];
                }
            }
            return 'Unknown';
        },
        getCWPrice: function() {
            const level = this.getHoboLevel();
            if (level === 0) return 0;
            return 257.5 + (level * 2.5);
        },
        getCashBalance: function() {
            const cashEl = document.querySelector('.no-mobile.displayMoney');
            if (cashEl) {
                return this.parseNumber(cashEl.textContent);
            }
            return 0;
        },
        getBankBalance: function() {
            const bankEl = document.querySelector('.no-mobile.displayBank');
            if (bankEl) {
                return this.parseNumber(bankEl.textContent);
            }
            return 0;
        },
        parseNumber: function(str) {
            if (!str) return 0;
            return parseFloat(str.replace(/[$,]/g, '')) || 0;
        },
        createBankButton: function(goalName, amount) {
            const btn = document.createElement('button');
            btn.textContent = '+ Bank';
            btn.style.marginLeft = '8px';
            btn.style.fontSize = '10px';
            btn.style.cursor = 'pointer';

            btn.onclick = function(e) {
                if (e) e.preventDefault();
                Modules.BankHelper.addBankGoal(goalName, amount);
                this.textContent = 'Added!';
                this.disabled = true;
            };
            return btn;
        },
        isCurrentPage: function(query) {
            return window.location.search.includes(query);
        },
        getSettings: function() {
            return JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
        }

};
const BankHelper = {
            getBankGoals: function() {
                try {
                    return JSON.parse(localStorage.getItem('hw_bank_goals') || '{}');
                } catch(e) {
                    return {};
                }
            },
            addBankGoal: function(actionName, cost) {
                const goals = this.getBankGoals();
                if (cost === 0 || cost === null) {
                    delete goals[actionName];
                } else {
                    goals[actionName] = cost;
                }
                if (Object.keys(goals).length === 0) {
                    localStorage.removeItem('hw_bank_goals');
                } else {
                    localStorage.setItem('hw_bank_goals', JSON.stringify(goals));
                }
            },
            init: function() {
                const url = window.location.href;
                if (!url.includes('cmd=bank')) return;

                const goals = this.getBankGoals();
                if (Object.keys(goals).length === 0) return;

                const withdrawInput = document.getElementById('w_money');
                const withdrawForm = document.querySelector('form[name="with"]');
                const nativeWithdrawBtn = withdrawForm ? withdrawForm.querySelector('input[type="submit"]') : null;

                if (!withdrawInput || !nativeWithdrawBtn) return;

                Object.keys(goals).forEach(goalName => {
                    const goalVal = parseInt(goals[goalName]);
                    if (isNaN(goalVal) || goalVal <= 0) return;

                    const btn = document.createElement('input');
                    btn.type = 'button';
                    btn.value = ` + Add ${goalName} ($${goalVal.toLocaleString()}) `;
                    btn.style.marginLeft = '10px';
                    btn.style.cursor = 'pointer';
                    btn.style.backgroundColor = '#e6f7ff';
                    btn.style.border = '1px solid #91d5ff';

                    btn.onclick = function() {
                        let currentVal = parseInt(withdrawInput.value.replace(/,/g, '')) || 0;
                        withdrawInput.value = (currentVal + goalVal).toString();

                        Modules.BankHelper.addBankGoal(goalName, 0);

                        this.value = "Added!";
                        this.disabled = true;
                        this.style.backgroundColor = '#f5f5f5';
                        this.style.border = '1px solid #d9d9d9';
                    };

                    nativeWithdrawBtn.parentNode.insertBefore(btn, nativeWithdrawBtn.nextSibling);
                });
            }
        }

const BernardsMansionHelper = {
    init: function() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('cmd') !== 'bernards') return;

        const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
        
        if (savedSettings['BernardsMansionHelper_BasementMap'] !== false) {
            this.initBasementMap();
        }
    },

    initBasementMap: function() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('room') !== 'basement') return;

        const navForm = document.getElementById('nav_form');
        if (!navForm) return;

        // Traverse up to find the main layout table of the directional pad
        const directionTable = navForm.closest('table');
        if (!directionTable) return;

        // Try to get current coordinates
        let currentX = 0;
        let currentY = 0;
        const fontTags = directionTable.querySelectorAll('font');
        fontTags.forEach(f => {
            if (f.textContent.includes('X Y')) {
                const match = f.textContent.match(/(\d+)\s*,\s*(\d+)/);
                if (match) {
                    currentX = parseInt(match[1], 10);
                    currentY = parseInt(match[2], 10);
                }
            }
        });

        // Create map container
        const mapHTML = `
        <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" style="border-collapse: collapse; border-style: ridge; border-color: black; border-width: 5px;" align="center">
            <tbody>
                ${Array.from({ length: 20 }, (_, r) => {
                    const y = 20 - r; // 20 to 1 (top to bottom)
                    return `<tr>
                        ${Array.from({ length: 20 }, (_, c) => {
                            const x = c + 1; // 1 to 20 (left to right)
                            return `<td class="bernards-map-cell" data-x="${x}" data-y="${y}" width="6" height="6" title="${x}, ${y}" bgcolor="#FFFFFF" style="border: 1px solid #ddd;"></td>`;
                        }).join('')}
                    </tr>`;
                }).join('')}
            </tbody>
        </table>
        `;

        const mapContainer = document.createElement('div');
        mapContainer.id = 'bernards_map_container';
        mapContainer.style.cssText = 'position: absolute; left: 100%; top: 50%; transform: translateY(-50%); margin-left: 20px; text-align: center;';
        mapContainer.innerHTML = mapHTML;

        // Color cell for current position
        const cells = mapContainer.querySelectorAll('.bernards-map-cell');
        cells.forEach(cell => {
            const cx = parseInt(cell.getAttribute('data-x'), 10);
            const cy = parseInt(cell.getAttribute('data-y'), 10);

            if (cx === currentX && cy === currentY) {
                cell.setAttribute('bgcolor', '#880000'); // Current position
                cell.title = "You!";
            }
        });

        // Use a relative wrapper to prevent any layout shifts of the directional pad
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'position: relative; width: 250px; margin: 0 auto;';
        
        directionTable.parentNode.insertBefore(wrapper, directionTable);
        wrapper.appendChild(directionTable);
        wrapper.appendChild(mapContainer);
    }
};

const CanDepoHelper = {
    init: function() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('cmd') !== 'depo') return;

        const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');

        if (savedSettings['CanDepoHelper_TotalValue'] !== false) {
            this.initTotalValue();
        }
    },

    initTotalValue: function() {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        let cansCount = 0;
        let price = 0;
        let targetNode = null;

        const walkDom = document.createTreeWalker(contentArea, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walkDom.nextNode())) {
            const text = node.textContent;

            const cansMatch = text.match(/You have:\s*([0-9,]+)\s*cans!/);
            if (cansMatch) {
                cansCount = Utils.parseNumber(cansMatch[1]);
                targetNode = node;
            }

            const priceMatch = text.match(/for\s*\$?([0-9,]+)\s*each/);
            if (priceMatch && !price) {
                price = Utils.parseNumber(priceMatch[1]);
            }
        }

        if (targetNode && cansCount > 0 && price > 0) {
            const totalValue = cansCount * price;
            const span = document.createElement('span');
            span.innerHTML = ` <b>(Total Value: $${totalValue.toLocaleString()})</b>`;
            span.style.color = 'green';
            targetNode.parentNode.insertBefore(span, targetNode.nextSibling);
        }
    }
};

const DrinksData = {
            // Data structure containing all drinks in the game
            drinks: {
                alcoholic: [
                    { name: "Crudweiser", cost: { type: "cw_multiplier", value: 1 }, location: "Liquor Store" },
                    { name: "Goon Sack", cost: { type: "cw_multiplier", value: 4 }, location: "Liquor Store" },
                    { name: "Albino Ale", cost: { type: "cw_multiplier", value: 4 }, location: "Liquor Store" },
                    { name: "Purple Pigeon Vodka", cost: { type: "cw_multiplier", value: 6 }, location: "Liquor Store" },
                    { name: "John Cuervo Tequila", cost: { type: "cw_multiplier", value: 6 }, location: "Liquor Store" },
                    { name: "Birdbath Gin", cost: { type: "cw_multiplier", value: 6 }, location: "Liquor Store" },
                    { name: "Rev's Rum", cost: { type: "cw_multiplier", value: 8 }, location: "Liquor Store" },
                    { name: "Ruiner's Rum", cost: { type: "cw_multiplier", value: 8 }, location: "Liquor Store" },
                    { name: "Wild Terrier Whiskey", cost: { type: "cw_multiplier", value: 8 }, location: "Liquor Store" },
                    { name: "Zima Light", cost: { type: "cw_multiplier", value: 10 }, location: "Liquor Store" },
                    { name: "Portly Stout", cost: { type: "cw_multiplier", value: 10 }, location: "Liquor Store" },
                    { name: "Boxcar Boxed Wine", cost: { type: "cw_multiplier", value: 10 }, location: "Liquor Store" },
                    { name: "Octuple Sec", cost: { type: "cw_multiplier", value: 12 }, location: "Liquor Store" },
                    { name: "Montreal Bourbon", cost: { type: "cw_multiplier", value: 12 }, location: "Liquor Store" },
                    { name: "Brandy Brand Brandy", cost: { type: "cw_multiplier", value: 12 }, location: "Liquor Store" },
                    { name: "Aunt Flo Amaretto", cost: { type: "cw_multiplier", value: 14 }, location: "Liquor Store" },
                    { name: "Mutton Chop Scotch", cost: { type: "cw_multiplier", value: 16 }, location: "Liquor Store" },
                    { name: "Homeless Hennessy", cost: { type: "cw_multiplier", value: 20 }, location: "Liquor Store" },
                    { name: "Lemon Drop", cost: { type: "cw_multiplier", value: 4 }, location: "Dive Bar" },
                    { name: "Buttery Nipple", cost: { type: "cw_multiplier", value: 8 }, location: "Dive Bar" },
                    { name: "Canadian Flag", cost: { type: "cw_multiplier", value: 12 }, location: "Dive Bar" },
                    { name: "The CMYK", cost: { type: "cw_multiplier", value: 16 }, location: "Dive Bar" },
                    { name: "Five Star General", cost: { type: "cw_multiplier", value: 20 }, location: "Dive Bar" },
                    { name: "Rainbow Road", cost: { type: "cw_multiplier", value: 24 }, location: "Dive Bar" },
                    { name: "Shot of Whiskey", cost: { type: "fixed", value: 3000 }, location: "Alcoholic Rat / Shakedown Saloon" },
                    { name: "Shot of Ruiner's Rum", cost: { type: "fixed", value: 3000 }, location: "Alcoholic Rat / Shakedown Saloon" },
                    { name: "Shot of Tequila", cost: { type: "fixed", value: 3000 }, location: "Alcoholic Rat / Shakedown Saloon" },
                    { name: "Bottle of Bernard's Barbaresco", cost: { type: "fixed", value: "50 RP" }, location: "Recycling Bin" },
                    { name: "Bottle of Two Buck Chuck", cost: { type: "fixed", value: 100000 }, location: "Matching Game / Dive Bar (Tip Jar)" },
                    { name: "Decaf Kahlua", cost: { type: "tiredness", value: 5 }, location: "Sailing" },
                    { name: "Everclear", cost: { type: "tiredness", value: 5 }, location: "Sailing" },
                    { name: "Irish Cream", cost: { type: "tiredness", value: 5 }, location: "Sailing" },
                    { name: "Jack Daniel's", cost: { type: "tiredness", value: 5 }, location: "Sailing" },
                    { name: "Jagermeister", cost: { type: "tiredness", value: 5 }, location: "Sailing" },
                    { name: "Tapped Keg", cost: { type: "tiredness", value: 5 }, location: "Alcoholic Rat / 7/11 Dumpster" },
                    { name: "Fotey", cost: { type: "tiredness", value: 5 }, location: "Sailing" }
                ],
                mixed: [
                    { name: "Amish Highball", cost: { type: "mixed", text: "10CW+$200" }, location: "Mixer", ingredients: ["Boxcar Boxed Wine", "Cola"] },
                    { name: "Angry Mother", cost: { type: "mixed", text: "14CW+$400" }, location: "Mixer", ingredients: ["Aunt Flo Amaretto", "Sweet & Sour"] },
                    { name: "Bawling Baby", cost: { type: "mixed", text: "Awake+6CW+$250" }, location: "Mixer", ingredients: ["Decaf Kahlua", "Purple Pigeon Vodka", "Milk"] },
                    { name: "Bloody Murray", cost: { type: "mixed", text: "Awake+6CW+10Cans+$50,000+200PP" }, location: "Mixer", ingredients: ["Purple Pigeon Vodka", "Celery", "Hair of the Dog", "Tabasco"] },
                    { name: "Centrifuge", cost: { type: "mixed", text: "38CW+$600" }, location: "Mixer", ingredients: ["Birdbath Gin", "John Cuervo Tequila", "Octuple Sec", "Purple Pigeon Vodka", "Rev's Rum", "Sweet & Sour", "Cola"] },
                    { name: "Dead Man Walking", cost: { type: "mixed", text: "Awake+28CW+$400" }, location: "Mixer", ingredients: ["Octuple Sec", "Orange Juice", "Rev's Rum", "Ruiner's Rum", "Sweet & Sour"] },
                    { name: "Eggnog", cost: { type: "mixed", text: "Orange Gift (Awake)" }, location: "Mixer", ingredients: ["Orange Gift"] },
                    { name: "Egyptini", cost: { type: "mixed", text: "Awake+6CW+$50" }, location: "Mixer", ingredients: ["Birdbath Gin", "Olive", "Wonka Bar Wrapper", "Bath Salts", "Ice"] },
                    { name: "Erupting Volcano", cost: { type: "mixed", text: "Awake+20CW+$800" }, location: "Mixer", ingredients: ["Homeless Hennessy", "Dry Ice", "Fire", "Red Bull"] },
                    { name: "Eye Gouger", cost: { type: "mixed", text: "6CW+$200" }, location: "Mixer", ingredients: ["Purple Pigeon Vodka", "Soda Water"] },
                    { name: "Filthy Leprechaun", cost: { type: "mixed", text: "Awake+16CW" }, location: "Mixer", ingredients: ["Irish Cream", "Mutton Chop Scotch"] },
                    { name: "Flaming Hedgehog", cost: { type: "mixed", text: "Awake+$300" }, location: "Mixer", ingredients: ["Jagermeister", "Fire", "Red Bull"] },
                    { name: "Full Moon", cost: { type: "mixed", text: "Awake+$50" }, location: "Mixer", ingredients: ["Irish Cream", "Jack Daniel's", "Bath Salts", "Ice"] },
                    { name: "Gin & Juice", cost: { type: "mixed", text: "Awake+6CW" }, location: "Mixer", ingredients: ["Birdbath Gin", "Orange Juice"] },
                    { name: "Happy Puppy", cost: { type: "mixed", text: "8CW+$200" }, location: "Mixer", ingredients: ["Wild Terrier Whiskey", "Cola"] },
                    { name: "Hedgehog", cost: { type: "mixed", text: "Awake+$300" }, location: "Mixer", ingredients: ["Jagermeister", "Red Bull"] },
                    { name: "Hungry Hippo", cost: { type: "mixed", text: "Awake+6CW+$250" }, location: "Mixer", ingredients: ["Decaf Kahlua", "Irish Cream", "Purple Pigeon Vodka", "Milk"] },
                    { name: "Jolly Gentleman", cost: { type: "mixed", text: "Awake+6CW" }, location: "Mixer", ingredients: ["Birdbath Gin", "Olive"] },
                    { name: "Lemonade", cost: { type: "mixed", text: "April Fool's Mini Adventure" }, location: "Mixer", ingredients: ["April Fool's Mini Adventure"] },
                    { name: "Prison Hooch", cost: { type: "mixed", text: "HoboArena Reward" }, location: "Mixer", ingredients: ["HoboArena Reward"] },
                    { name: "Purring Kitty", cost: { type: "mixed", text: "6CW+$200" }, location: "Mixer", ingredients: ["Birdbath Gin", "Soda Water"] },
                    { name: "Rocket Juice", cost: { type: "mixed", text: "HoboArena Reward" }, location: "Mixer", ingredients: ["HoboArena Reward"] },
                    { name: "Self Immolation", cost: { type: "mixed", text: "Awake+15CW" }, location: "Mixer", ingredients: ["Aunt Flo Amaretto", "Crudweiser", "Everclear", "Fire"] },
                    { name: "Sludge", cost: { type: "mixed", text: "Made from mixing drinks that do not form a proper mixed drink" }, location: "Mixer", ingredients: ["Made from mixing drinks that do not form a proper mixed drink"] },
                    { name: "Sorrowful Penguin", cost: { type: "mixed", text: "Awake+10CW+$50" }, location: "Mixer", ingredients: ["Ice", "Jolly Rancher", "Zima Light"] },
                    { name: "Ten Foot Drop", cost: { type: "mixed", text: "18CW+$400" }, location: "Mixer", ingredients: ["Octuple Sec", "Purple Pigeon Vodka", "Sweet & Sour"] },
                    { name: "The Long Walk", cost: { type: "mixed", text: "36CW" }, location: "Mixer", ingredients: ["Montreal Bourbon", "Mutton Chop Scotch", "Wild Terrier Whiskey"] },
                    { name: "Time Traveler", cost: { type: "mixed", text: "Awake+12CW+$500" }, location: "Mixer", ingredients: ["Brandy Brand Brandy", "Dry Ice", "Jolly Rancher", "Orange Juice"] },
                    { name: "Transylvania Slammer", cost: { type: "mixed", text: "Awake+18CW+$50" }, location: "Mixer", ingredients: ["Albino Ale", "Aunt Flo Amaretto", "Jagermeister", "Bath Salts", "Ice"] }
                ],
                non_alcoholic: [
                    { name: "Cola", cost: { type: "fixed", value: 200 }, location: "Liquor Store" },
                    { name: "Sweet & Sour", cost: { type: "fixed", value: 400 }, location: "Liquor Store" },
                    { name: "Milk", cost: { type: "fixed", value: 250 }, location: "Liquor Store" },
                    { name: "Celery", cost: { type: "unknown", value: 0 }, location: "Food Store" },
                    { name: "Tabasco", cost: { type: "unknown", value: 0 }, location: "Food Store" },
                    { name: "Orange Juice", cost: { type: "unknown", value: 0 }, location: "Liquor Store" },
                    { name: "Soda Water", cost: { type: "fixed", value: 200 }, location: "Liquor Store" },
                    { name: "Dry Ice", cost: { type: "unknown", value: 0 }, location: "Liquor Store" },
                    { name: "Ice", cost: { type: "fixed", value: 50 }, location: "Liquor Store" },
                    { name: "Red Bull", cost: { type: "fixed", value: 300 }, location: "Convenience Store" },
                    { name: "Olive", cost: { type: "unknown", value: 0 }, location: "Food Store" }
                ]
            }
        }

const DrinksHelper = {
            init: function() {
                function getInventory() {
                    const inventory = {};
                    document.querySelectorAll('.bp-itm').forEach(item => {
                        try {
                            const img = item.querySelector('img');
                            if (!img) return;

                            const name = img.title.trim();
                            const text = item.textContent.trim();
                            const countMatch = text.match(/\((\d+)\)/);
                            const count = countMatch ? parseInt(countMatch[1], 10) : 1;

                            inventory[name] = (inventory[name] || 0) + count;
                        } catch (e) { /* silent fail on malformed items */ }
                    });
                    return inventory;
                }

                function handleBartenderGuide() {
                    const mixerLinks = document.querySelectorAll('a[href*="cmd=mixer&make="]');
                    if (mixerLinks.length === 0) return;

                    const inventory = getInventory();

                    mixerLinks.forEach(link => {
                        try {
                            const row = link.closest('tr');
                            if (!row || row.hasAttribute('data-dh-processed')) return;

                            row.setAttribute('data-dh-processed', 'true');

                            const cells = row.querySelectorAll('td');
                            if (cells.length < 2) return;

                            const recipeCell = cells[0];
                            const actionCell = cells[1];

                            const images = recipeCell.querySelectorAll('img');
                            const ingredients = Array.from(images).slice(1).map(img => img.title.trim());

                            if (ingredients.length === 0) return;

                            let maxCanMake = Infinity;
                            let limitingIngredient = "Unknown";

                            ingredients.forEach(ing => {
                                const owned = inventory[ing] || 0;
                                if (owned < maxCanMake) {
                                    maxCanMake = owned;
                                    limitingIngredient = ing;
                                }
                            });

                            const limiterDiv = document.createElement('div');
                            limiterDiv.className = 'dh-helper-text';
                            limiterDiv.style.fontSize = '0.82em';
                            limiterDiv.style.marginTop = '4px';
                            limiterDiv.style.display = 'block';

                            if (maxCanMake > 0) {
                                limiterDiv.style.color = '#555';
                                limiterDiv.textContent = `Limit: ${limitingIngredient}`;
                            } else {
                                limiterDiv.style.color = '#aa0000';
                                limiterDiv.style.fontWeight = 'bold';
                                limiterDiv.textContent = `Missing: ${limitingIngredient}`;
                            }

                            actionCell.appendChild(limiterDiv);
                        } catch (err) {
                            console.error("HoboWars Drinks Helper Error:", err);
                        }
                    });
                }

                let timeout = null;
                const observer = new MutationObserver(() => {
                    if (timeout) clearTimeout(timeout);
                    timeout = setTimeout(handleBartenderGuide, 100);
                });

                observer.observe(document.body, { childList: true, subtree: true });
                handleBartenderGuide();
            }
        }

const KurtzCampHelper = {
    init: function() {
        if (!Utils.isCurrentPage('cmd=camp_kurtz')) return;
        
        // Check Settings
        const settings = Utils.getSettings();
        if (settings.kurtzCampHelper === false) return;

        this.trackItems();
        this.displayTally();
    },

    trackItems: function() {
        const content = document.querySelector('.content-area');
        if (!content) return;

        let fireCount = parseInt(localStorage.getItem('hw_kurtz_fire_count') || '0');
        let bottleCount = parseInt(localStorage.getItem('hw_kurtz_bottle_count') || '0');

        // Check for Fire
        if (content.innerHTML.includes('<b>Fire</b>')) {
            fireCount++;
            localStorage.setItem('hw_kurtz_fire_count', fireCount);
        }
        // Check for Empty Bottles (case-insensitive check for Empty Bottle(s))
        else if (content.innerHTML.toLowerCase().includes('empty bottle')) {
            bottleCount++;
            localStorage.setItem('hw_kurtz_bottle_count', bottleCount);
        }
    },

    displayTally: function() {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        let fireCount = parseInt(localStorage.getItem('hw_kurtz_fire_count') || '0');
        let bottleCount = parseInt(localStorage.getItem('hw_kurtz_bottle_count') || '0');

        const tallyDiv = document.createElement('div');
        tallyDiv.style.textAlign = 'center';
        tallyDiv.style.marginTop = '20px';
        tallyDiv.style.fontWeight = 'bold';
        tallyDiv.style.fontSize = '12px';

        let html = `Fire Collected: ${fireCount}`;
        if (bottleCount > 0) {
            html += `<br>Empty Bottles Collected: ${bottleCount}`;
        }

        html += `<br><br><span style="font-size: 10px; cursor: pointer; color: #888;" id="resetKurtzTally">[Reset Tally]</span>`;

        tallyDiv.innerHTML = html;
        contentArea.appendChild(tallyDiv);

        document.getElementById('resetKurtzTally').addEventListener('click', () => {
            if (confirm('Reset your Kurtz Camp tallies?')) {
                localStorage.setItem('hw_kurtz_fire_count', '0');
                localStorage.setItem('hw_kurtz_bottle_count', '0');
                location.reload();
            }
        });
    }
};

const LiquorStoreHelper = {
            init: function() {
                if (window.location.href.includes('cmd=liquor_store')) {
                    try {
                        const contentArea = document.querySelector('.content-area') || document.body;
                        const spans = contentArea.querySelectorAll('span');
                        let purchasedItem = null;
                        let purchasedAmount = 0;
                        
                        for (let i = 0; i < spans.length; i++) {
                            const span = spans[i];
                            if (span.textContent.includes('You get') && span.querySelector('img')) {
                                const img = span.querySelector('img');
                                const itemName = img.title || img.alt;
                                
                                let amount = 1;
                                const amountMatch = span.textContent.match(/\(\s*(\d+)\s*\)/);
                                if (amountMatch) {
                                    amount = Utils.parseNumber(amountMatch[1]);
                                }
                                
                                if (itemName) {
                                    purchasedItem = itemName.replace(/&amp;/g, '&').trim();
                                    purchasedAmount = amount;
                                    break;
                                }
                            }
                        }

                        if (purchasedItem && purchasedAmount > 0) {
                            const shoppingListStr = localStorage.getItem('hobowarsDrinkShoppingList');
                            if (shoppingListStr) {
                                let shoppingList = JSON.parse(shoppingListStr);
                                if (shoppingList[purchasedItem]) {
                                    shoppingList[purchasedItem] -= purchasedAmount;
                                    if (shoppingList[purchasedItem] <= 0) {
                                        delete shoppingList[purchasedItem];
                                    }
                                    if (Object.keys(shoppingList).length === 0) {
                                        localStorage.removeItem('hobowarsDrinkShoppingList');
                                        localStorage.removeItem('hobowarsDrinkShoppingList_TargetDrink');
                                    } else {
                                        localStorage.setItem('hobowarsDrinkShoppingList', JSON.stringify(shoppingList));
                                    }
                                }
                            }
                        }
                    } catch (e) {
                        console.error('Error handling purchase check', e);
                    }

                    const shoppingListStr = localStorage.getItem('hobowarsDrinkShoppingList');
                    if (shoppingListStr) {
                        try {
                            const shoppingList = JSON.parse(shoppingListStr);
                            const items = Object.keys(shoppingList);
                            if (items.length > 0) {
                                const targetDrink = localStorage.getItem('hobowarsDrinkShoppingList_TargetDrink');
                                const titleText = targetDrink ? `🛍️ Mixer Shopping List - ${targetDrink}` : `🛍️ Mixer Shopping List`;

                                let contentHtml = `
                                    <div style="font-weight: bold; margin-bottom: 8px; font-size: 14px; display: flex; justify-content: space-between; align-items: center;">
                                        <span>${titleText}</span>
                                        <button id="clear-shopping-list" style="cursor: pointer; font-size: 11px; padding: 2px 6px;">Clear List</button>
                                    </div>
                                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                                        <tbody>`;
                                items.forEach(item => {
                                    contentHtml += `
                                        <tr style="border-bottom: 1px dotted #ccc;">
                                            <td style="padding: 4px 0;"><strong>${item}</strong></td>
                                            <td style="padding: 4px 0; text-align: right; color: #d9534f; font-weight: bold;">${shoppingList[item]} required</td>
                                        </tr>`;
                                });
                                contentHtml += `</tbody></table>`;

                                const listContainer = document.createElement('div');
                                listContainer.style.cssText = 'margin: 10px auto 15px auto; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9; width: 80%; display: block;';
                                listContainer.innerHTML = contentHtml;
                                
                                const contentArea = document.querySelector('.content-area') || document.body;
                                const firstTable = contentArea.querySelector('table.shop-list') || contentArea.querySelector('table[width="100%"]');
                                
                                if (firstTable) {
                                    firstTable.parentNode.insertBefore(listContainer, firstTable);
                                } else {
                                    contentArea.appendChild(listContainer);
                                }

                                document.getElementById('clear-shopping-list').addEventListener('click', function(e) {
                                    e.preventDefault();
                                    localStorage.removeItem('hobowarsDrinkShoppingList');
                                    localStorage.removeItem('hobowarsDrinkShoppingList_TargetDrink');
                                    listContainer.style.display = 'none';
                                });
                            }
                        } catch (e) {
                            console.error('Error parsing shopping list', e);
                        }
                    }
                }
            }
        }

const LivingAreaHelper = {
    init: function() {
        const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
        
        if (savedSettings['LivingAreaHelper_StatRatioTracker'] !== false) {
            this.initStatRatioTracker();
        }
        if (savedSettings['LivingAreaHelper_AlwaysShowSpecialItem'] !== false) {
            this.initAlwaysShowSpecialItem();
        }
        if (savedSettings['LivingAreaHelper_MixerLink'] !== false) {
            this.initMixerLink();
        }
        if (savedSettings['LivingAreaHelper_WinPercentageCalc'] !== false) {
            this.initWinPercentageCalc();
        }
    },

    initAlwaysShowSpecialItem: function() {
        if (window.location.href.includes('cmd=uni')) return;
        
        const statsDisplays = document.querySelectorAll('.more_info.statsDisplay');
        statsDisplays.forEach(display => {
            if (display.textContent.includes('Special Item')) {
                display.classList.remove('more_info');
                display.style.display = 'block';
            }
        });
    },

    initMixerLink: function() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('cmd') && !window.location.href.includes('cmd=living_area')) return;

        const gearInfo = document.getElementById('gearInfo');
        if (!gearInfo) return;
        
        const icons = gearInfo.querySelectorAll('img[title="Hobo Grail"], img[title="Kings Kiddie Cup"], img[title="Golden Trolly"]');
        if (icons.length > 0) {
            const targetIcon = icons[icons.length - 1]; // Append after the last found cup/trolly
            let appendTarget = targetIcon;
            if (targetIcon.parentElement.tagName === 'A') {
                appendTarget = targetIcon.parentElement;
            }
            
            const srObj = new URLSearchParams(window.location.search).get('sr');
            const srParam = srObj ? `sr=${srObj}&` : '';
            const mixerLinkHtml = `<a href="game.php?${srParam}cmd=mixer"><img src="/images/items/gifs/Mixer.gif" title="Mixer" alt="Mixer" border="0" height="38"></a>`;
            
            appendTarget.insertAdjacentHTML('afterend', mixerLinkHtml);
        }
    },

    initStatRatioTracker: function() {
        const STORAGE_KEY = 'hoboStatRatio';
        const DEFAULT_DATA = {
            speed: 1, power: 1, strength: 1,
            targetTotal: 0, showSettings: true,
            needs: { speed: 0, power: 0, strength: 0 },
            estDays: "---",
            dailyGain: 0,
            lastUpdated: Date.now()
        };

        let config = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_DATA;
        let inMemoryLastUpdated = config.lastUpdated;

        function updateTracker() {
            if (window.location.href.includes('cmd=uni')) return;

            const statsBlock = document.getElementById('combatStats');
            if (!statsBlock) return;

            // Fetch latest from storage to prevent background tabs from reverting settings
            try {
                const savedConfig = JSON.parse(localStorage.getItem(STORAGE_KEY));
                if (savedConfig) {
                    config = Object.assign(config, savedConfig);
                }
            } catch (e) {}

            const findValue = (label) => {
                const lines = Array.from(statsBlock.querySelectorAll('.line'));
                const target = lines.find(l => l.textContent.includes(label));
                if (!target) return null;
                const valMatch = target.textContent.match(/[\d,.]+/g);
                return valMatch ? Utils.parseNumber(valMatch[0]) : null;
            };

            const scraped = {
                speed: findValue('Speed:'),
                power: findValue('Power:'),
                strength: findValue('Strength:'),
                today: findValue('Gained Today:'),
                biggest: findValue('Biggest Gain:')
            };

            if (scraped.speed && scraped.today !== null) {
                const minsElapsed = Utils.getHoboMinutes();

                if (minsElapsed !== null) {
                    const rate = scraped.today / Math.max(1, minsElapsed);
                    const projected = scraped.today + (rate * (1440 - minsElapsed));
                    config.dailyGain = Math.min(projected, scraped.biggest || 375);
                    if (minsElapsed < 60 && config.dailyGain < (scraped.biggest * 0.5)) config.dailyGain = scraped.biggest;
                }

                const ratioSum = config.speed + config.power + config.strength;
                let target = parseFloat(config.targetTotal) || 0;

                if (ratioSum > 0) {
                    const spdPct = config.speed / ratioSum;
                    const pwrPct = config.power / ratioSum;
                    const strPct = config.strength / ratioSum;

                    const effectiveTarget = target > 0 ? target : Math.max(scraped.speed/spdPct, scraped.power/pwrPct, scraped.strength/strPct);

                    config.needs = {
                        speed: Math.round((spdPct * effectiveTarget) - scraped.speed),
                        power: Math.round((pwrPct * effectiveTarget) - scraped.power),
                        strength: Math.round((strPct * effectiveTarget) - scraped.strength)
                    };

                    const totalNeeded = Math.max(0, config.needs.speed) + Math.max(0, config.needs.power) + Math.max(0, config.needs.strength);
                    config.estDays = config.dailyGain > 1 ? (totalNeeded / config.dailyGain).toFixed(1) : "---";

                    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
                    renderLivingAreaTags(ratioSum);
                    renderPanel(statsBlock, effectiveTarget);
                }
            }
        }

        function renderLivingAreaTags(ratioSum) {
            const statsBlock = document.getElementById('combatStats');
            Array.from(statsBlock.querySelectorAll('.line')).forEach(row => {
                const label = row.querySelector('span')?.textContent.trim();
                if (label && ['Speed:', 'Power:', 'Strength:'].includes(label)) {
                    const key = label.replace(':','').toLowerCase();
                    const diff = config.needs[key];
                    let diffEl = row.querySelector('.stat-diff-tag') || document.createElement('div');
                    diffEl.className = 'stat-diff-tag';
                    diffEl.style.cssText = 'font-weight:bold; margin-left:10px; font-size:11px; display:inline-block;';
                    if (!row.contains(diffEl)) row.appendChild(diffEl);

                    const displayDiff = Math.round(diff);
                    const color = displayDiff > 0 ? '#008000' : (displayDiff < 0 ? '#d9534f' : '#999');
                    const prefix = displayDiff > 0 ? '+' : (displayDiff < 0 ? '- ' : '+ ');
                    const absoluteDiff = Math.abs(displayDiff);
                    
                    diffEl.innerHTML = `<span style="color:${color}">(${prefix}${absoluteDiff.toLocaleString()} / ${((config[key]/ratioSum)*100).toFixed(1)}%)</span>`;
                }
            });
        }

        function renderPanel(anchor, target) {
            if (document.activeElement && ['r_goal','r_spd','r_pwr','r_str'].includes(document.activeElement.id)) return;
            let panel = document.getElementById('stat_ratio_panel');
            if (!panel) {
                panel = document.createElement('div');
                panel.id = 'stat_ratio_panel';
                panel.style.cssText = 'margin:5px 0; padding:12px; background:#f4f4f4; outline: 1px solid #CCCCCC;border:2px solid #E8E8E8; font-family: Arial; width: 100%; box-sizing: border-box;';
                anchor.appendChild(panel);
            }

            panel.innerHTML = `
                <div style="font-size:13px; margin-bottom:5px;"><b>Effective Goal:</b> ${Math.round(target).toLocaleString()} <span id="cog_toggle" style="float:right; cursor:pointer; opacity:0.5;">⚙️</span></div>
                <div style="font-size:11px; color:#666;">Est: ~${config.estDays} days (@ ${Math.round(config.dailyGain)}/day)</div>
                <div id="settings_area" style="margin-top:8px; padding-top:5px; border-top:1px solid #ddd; display:${config.showSettings ? 'block' : 'none'};">
                    <div style="font-size:11px; font-weight:bold; color:#0066cc;">Target Total (0 for Auto)</div>
                    <input type="text" id="r_goal" value="${config.targetTotal}" style="width:100%; margin-bottom:8px; box-sizing: border-box;">
                    <div style="font-size:11px; font-weight:bold;">Ratio (Spd : Pwr : Str)</div>
                    <div style="display:flex; gap:4px; margin-bottom:10px;">
                        <input type="number" id="r_spd" value="${config.speed}" style="width:33%; box-sizing: border-box;">
                        <input type="number" id="r_pwr" value="${config.power}" style="width:33%; box-sizing: border-box;">
                        <input type="number" id="r_str" value="${config.strength}" style="width:33%; box-sizing: border-box;">
                    </div>
                    <button id="r_save" style="width:100%; cursor:pointer; background:#666; color:#fff; border:none; padding:5px; font-weight:bold;">Update Ratio</button>
                </div>
            `;

            document.getElementById('cog_toggle').onclick = () => {
                try {
                    const savedConfig = JSON.parse(localStorage.getItem(STORAGE_KEY));
                    if (savedConfig) {
                        // If memory is stale compared to storage, alert and reload instead of overwriting
                        if (savedConfig.lastUpdated && savedConfig.lastUpdated > inMemoryLastUpdated) {
                            alert("Settings were updated in another tab. Reloading new values.");
                            config = Object.assign(config, savedConfig);
                            inMemoryLastUpdated = config.lastUpdated;
                            config.showSettings = !config.showSettings;
                            document.getElementById('settings_area').style.display = config.showSettings ? 'block' : 'none';
                            config.lastUpdated = Date.now();
                            inMemoryLastUpdated = config.lastUpdated;
                            localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
                            updateTracker();
                            return;
                        }
                        config = Object.assign(config, savedConfig);
                    }
                } catch(e) {}

                config.showSettings = !config.showSettings;
                document.getElementById('settings_area').style.display = config.showSettings ? 'block' : 'none';
                config.lastUpdated = Date.now();
                inMemoryLastUpdated = config.lastUpdated;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
            };

            document.getElementById('r_save').onclick = () => {
                try {
                    const savedConfig = JSON.parse(localStorage.getItem(STORAGE_KEY));
                    if (savedConfig) {
                        // If memory is stale compared to storage, alert and reload instead of overwriting
                        if (savedConfig.lastUpdated && savedConfig.lastUpdated > inMemoryLastUpdated) {
                            alert("Settings were updated in another tab. Reloading new values. Please try your save again.");
                            config = Object.assign(config, savedConfig);
                            inMemoryLastUpdated = config.lastUpdated;
                            document.getElementById('r_goal').value = config.targetTotal;
                            document.getElementById('r_spd').value = config.speed;
                            document.getElementById('r_pwr').value = config.power;
                            document.getElementById('r_str').value = config.strength;
                            updateTracker();
                            return; // Block save
                        }
                        config = Object.assign(config, savedConfig);
                    }
                } catch(e) {}

                config.targetTotal = Utils.parseNumber(document.getElementById('r_goal').value);
                config.speed = Utils.parseNumber(document.getElementById('r_spd').value);
                config.power = Utils.parseNumber(document.getElementById('r_pwr').value);
                config.strength = Utils.parseNumber(document.getElementById('r_str').value);
                config.lastUpdated = Date.now();
                inMemoryLastUpdated = config.lastUpdated;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
                updateTracker();
            };
        }

        // Run once on page load instead of constantly polling
        updateTracker();
    },

    initWinPercentageCalc: function() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('cmd')) return;

        const battleBlock = document.getElementById('battleRecord');
        if (!battleBlock) return;

        const lines = battleBlock.querySelectorAll('.line');
        let winLossLine = Array.from(lines).find(el => el.textContent.includes('Wins/Losses:'));

        if (winLossLine) {
            const text = winLossLine.textContent;
            const matches = text.match(/\d+(,\d+)*/g);
            if (!matches || matches.length < 2) return;

            const stats = matches.map(s => Utils.parseNumber(s));

            const wins = stats[0];
            const losses = stats[1];
            const total = wins + losses;

            const getBattlesNeeded = (target) => {
                const decimal = target / 100;
                if ((wins / total) >= decimal) return 0;
                return Math.ceil((decimal * total - wins) / (1 - decimal));
            };

            const targets = [75, 80, 85, 90];
            let calcHtml = `<div id="winCalc" style="font-size: 0.85em; margin-top: 8px; padding-top: 8px; border-top: 1px dashed #999; color: #333;">`;
            calcHtml += `<strong style="color: black;">Wins to Target Ratio:</strong><br>`;

            targets.forEach(t => {
                const needed = getBattlesNeeded(t);
                if (needed > 0) {
                    calcHtml += `<span style="display:inline-block; width: 40px; color: black; font-weight: bold;">${t}%:</span> +<span style="color: black; font-weight: bold;">${needed.toLocaleString()}</span> consecutive wins<br>`;
                }
            });

            calcHtml += `</div>`;

            battleBlock.insertAdjacentHTML('beforeend', calcHtml);
        }
    }
}

const MessageBoardHelper = {
    init: function() {
        if (!Utils.isCurrentPage('cmd=gathering')) return;

        this.initMessageBoardFeatures();
    },

    initMessageBoardFeatures: function() {
        // Basic setup for message board features based on settings
        const settings = Utils.getSettings();
        if (settings?.MessageBoardHelper?.enabled === false) return;

        this.enhanceMessageEditor();
    },

    enhanceMessageEditor: function() {
        const messageArea = document.querySelector('textarea[name="t_message"]');
        if (!messageArea) return;

        // Auto-focus the message area
        messageArea.focus();

        // Ctrl + Enter to submit
        messageArea.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                const submitBtn = document.querySelector('input[type="submit"][name="button"]') ||
                                  document.querySelector('input[type="submit"][value*="Post"]');
                if (submitBtn) {
                    e.preventDefault();
                    submitBtn.click();
                }
            }
        });

        this.addPaidMessageButton(messageArea);
    },

    addPaidMessageButton: function(messageArea) {
        const editButton = document.querySelector('input[type="submit"][value*="Edit Post"]');
        if (!editButton) return;

        const parentDiv = editButton.parentElement;
        if (!parentDiv) return;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'Add Paid Message';
        // Match existing button CSS
        btn.style.webkitFontSmoothing = 'antialiased';
        btn.style.color = '#636363';
        btn.style.background = '#ddd';
        btn.style.fontWeight = 'bold';
        btn.style.textDecoration = 'none';
        btn.style.padding = '5px 16px';
        btn.style.borderRadius = '3px';
        btn.style.border = '0';
        btn.style.cursor = 'pointer';
        btn.style.margin = '3px 2px';
        btn.style.webkitAppearance = 'none';
        btn.style.display = 'inline-block';
        
        btn.addEventListener('click', () => {
            const hoboName = Utils.getHoboName();
            const appendText = `\n\n[i]${hoboName} Edit: Paid[/i]`;

            messageArea.value += appendText;
            messageArea.focus();
        });

        parentDiv.appendChild(btn);
    }
};

const MixerHelper = {
            init: function() {
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('cmd') === 'mixer') {
                    const makeManyInput = document.querySelector('input[name="make_many"]');
                    if (makeManyInput) {
                        const maxBtn = document.createElement('button');
                        maxBtn.textContent = 'Max';
                        maxBtn.style.marginLeft = '8px';
                        maxBtn.style.fontSize = '10px';
                        maxBtn.style.cursor = 'pointer';

                        maxBtn.onclick = function(e) {
                            e.preventDefault();

                            const form = document.getElementById('mixer');
                            if (!form) return;

                            const hiddenInputs = form.querySelectorAll('input[type="hidden"][name^="ingreds["]');
                            if (hiddenInputs.length === 0) return;

                            let maxCanMake = Infinity;

                            hiddenInputs.forEach(input => {
                                const id = input.value;
                                const amountEl = document.getElementById('amnt_' + id);
                                if (amountEl) {
                                    // The game subtracts 1 from the innerHTML amount when you add it to the mixer.
                                    // The true total inventory limit is the displayed amount + 1.
                                    const available = parseInt(amountEl.textContent, 10) + 1;
                                    if (!isNaN(available) && available < maxCanMake) {
                                        maxCanMake = available;
                                    }
                                }
                            });

                            if (maxCanMake !== Infinity) {
                                makeManyInput.value = maxCanMake.toString();
                            }
                        };

                        makeManyInput.parentNode.insertBefore(maxBtn, makeManyInput.nextSibling);
                    }

                    // --- Possible Drinks Helper ---
                    const mixAwayBtn = document.querySelector('input[value="Mix Away"]');
                    const myMixer = document.getElementById('myMixer');

                    if (mixAwayBtn && myMixer) {
                        // 1. Determine which drinks are unlocked by reading the Bartender Guide DOM
                        let unlockedDrinks = [];
                        const uTags = document.querySelectorAll('u');
                        let guideContainer = null;

                        uTags.forEach(u => {
                            if (u.textContent.includes('Bartender Guide')) {
                                // The <u> is inside a <div>, and the drinks are siblings to that <div> inside a <td>
                                guideContainer = u.closest('td');
                            }
                        });

                        if (guideContainer) {
                            // Any img with a title in the guide container is considered unlocked here
                            // even if it lacks an <a> tag (greyed out due to missing ingredients)
                            const unlockedImgs = guideContainer.querySelectorAll('img[title], img[alt]');
                            unlockedImgs.forEach(img => {
                                let name = img.title || img.alt;
                                if (name) {
                                    name = name.replace(/&amp;/g, '&').trim();
                                    // Make sure it's valid title and not empty
                                    if (name && !unlockedDrinks.includes(name)) {
                                        unlockedDrinks.push(name);
                                    }
                                }
                            });
                        }

                        // 2. Setup the UI container above 'Mix Away'
                        const possibleDrinksDiv = document.createElement('div');
                        possibleDrinksDiv.id = 'possible-drinks-helper';
                        possibleDrinksDiv.style.marginBottom = '5px';
                        possibleDrinksDiv.style.fontWeight = 'bold';
                        possibleDrinksDiv.style.fontSize = '13px';

                        mixAwayBtn.parentNode.insertBefore(possibleDrinksDiv, mixAwayBtn);

                        // 3. Update logic when ingredients change
                        const updatePossibleDrinks = () => {
                            const amtSpans = myMixer.querySelectorAll('span[id^="mix_amt_"]');
                            let currentIngredients = [];

                            amtSpans.forEach(span => {
                                let text = span.textContent.trim();
                                text = text.replace(/^\d+\s*x\s*/, '').trim();
                                if (text) {
                                    currentIngredients.push(text);
                                }
                            });

                            if (currentIngredients.length === 0) {
                                possibleDrinksDiv.innerHTML = '';
                                return;
                            }

                            const mixedDrinksData = Modules.DrinksData.drinks.mixed || [];
                            let possibleDrinkNames = [];

                            mixedDrinksData.forEach(drink => {
                                // Must be previously unlocked AND contain all current ingredients in its recipe
                                if (unlockedDrinks.includes(drink.name) && drink.ingredients && Array.isArray(drink.ingredients)) {
                                    let isPossible = currentIngredients.every(ing => drink.ingredients.includes(ing));
                                    if (isPossible) {
                                        possibleDrinkNames.push(drink.name);
                                    }
                                }
                            });

                            if (possibleDrinkNames.length > 0) {
                                possibleDrinksDiv.innerHTML = `<span style="color: #666;">Possible Drinks:</span> <span style="color: #000;">${possibleDrinkNames.join(', ')}</span><br><br>`;
                            } else {
                                possibleDrinksDiv.innerHTML = `<span style="color: #888; font-style: italic;">No unlocked drinks match these ingredients.</span><br><br>`;
                            }
                        };

                        // 4. Setup an observer to watch for additions/removals in the virtual mixer
                        const observer = new MutationObserver((mutations) => {
                            updatePossibleDrinks();
                            if (!window.isAutomatedMixerChange) {
                                window.lastClickedRecipe = null;
                            }
                            if (typeof window.updateShoppingList === 'function') {
                                window.updateShoppingList();
                            }
                        });
                        observer.observe(myMixer, { childList: true, subtree: true });

                        // Initial update on load
                        updatePossibleDrinks();

                        // Build map of items to IDs and counts
                        const inventoryMap = {};
                        document.querySelectorAll('div[id^="itemimg_"]').forEach(div => {
                            const b = div.querySelector('b[id^="amnt_"]');
                            const img = div.querySelector('img');
                            if (b && img) {
                                const idMatch = b.id.match(/amnt_(\d+)/);
                                if (idMatch) {
                                    const id = idMatch[1];
                                    let nameMatch = img.getAttribute('onmouseover')?.match(/ShowName\('([^']+)'\)/);
                                    if (nameMatch) {
                                        const name = nameMatch[1].replace(/&amp;/g, '&');
                                        inventoryMap[name] = id;
                                    }
                                }
                            }
                        });

                        if (guideContainer) {
                            // Find all gray icons (images not wrapped in an <a> tag)
                            const grayImgs = Array.from(guideContainer.querySelectorAll('img')).filter(img => img.parentElement.tagName.toLowerCase() !== 'a');
                            grayImgs.forEach(img => {
                                img.style.cursor = 'pointer';
                                img.onclick = function() {
                                    window.isAutomatedMixerChange = true;

                                    const drinkName = img.title || img.alt;
                                    const mixedDrinksData = Modules.DrinksData.drinks.mixed || [];
                                    const drink = mixedDrinksData.find(d => d.name === drinkName);

                                    window.lastClickedRecipe = drink;

                                    let scriptAdd = ["if (typeof deleteAll === 'function') deleteAll();"];

                                    if (drink && drink.ingredients) {
                                        drink.ingredients.forEach(ing => {
                                            const id = inventoryMap[ing];
                                            let available = false;
                                            if (id) {
                                                const amountEl = document.getElementById('amnt_' + id);
                                                if (amountEl) {
                                                    const amount = parseInt(amountEl.textContent, 10);
                                                    if (amount > 0) {
                                                        available = true;
                                                        scriptAdd.push(`if (typeof AddDrink === 'function') AddDrink(${id}, "${ing}");`);
                                                    }
                                                }
                                            }
                                        });
                                    }

                                    if (scriptAdd.length > 0) {
                                        const script = document.createElement('script');
                                        script.textContent = scriptAdd.join('\n');
                                        document.body.appendChild(script);
                                        script.remove();
                                    }

                                    setTimeout(() => { window.isAutomatedMixerChange = false; }, 100);
                                };
                            });

                            // Also clear tracking state when clicking a normal (colored) drink link
                            const normalLinks = guideContainer.querySelectorAll('a[href*="AddDrink"]');
                            normalLinks.forEach(link => {
                                link.addEventListener('click', () => {
                                    window.isAutomatedMixerChange = true;

                                    const img = link.querySelector('img');
                                    const drinkName = img ? (img.title || img.alt) : '';
                                    const mixedDrinksData = Modules.DrinksData.drinks.mixed || [];
                                    const drink = mixedDrinksData.find(d => d.name === drinkName);
                                    window.lastClickedRecipe = drink;

                                    setTimeout(() => { window.isAutomatedMixerChange = false; }, 100);
                                });
                            });
                        }

                        const startOverLink = document.querySelector('a[href$="cmd=mixer"]');
                        if (startOverLink) {
                            startOverLink.addEventListener('click', () => {
                                window.lastClickedRecipe = null;
                                if (typeof window.updateShoppingList === 'function') window.updateShoppingList();
                            });
                        }

                        // --- Shopping List Helper ---
                        const makeManyInput = document.querySelector('input[name="make_many"]');
                        if (mixAwayBtn && makeManyInput) {
                            const shoppingListContainer = document.createElement('div');
                            shoppingListContainer.id = 'shopping-list-container';
                            shoppingListContainer.style.marginBottom = '15px';
                            shoppingListContainer.style.display = 'none';
                            shoppingListContainer.innerHTML = `<div class="style1" style="font-weight:bold; margin-bottom:5px;"><u>Shopping List:</u></div>
                                                               <div id="shopping_list_items" style="font-size: 13px; color:#555; text-align: left; display: inline-block;"></div>`;

                            // Insert above "Mix Away" button
                            mixAwayBtn.parentNode.insertBefore(shoppingListContainer, mixAwayBtn);

                            const shoppingListContent = shoppingListContainer.querySelector('#shopping_list_items');

                            window.updateShoppingList = function() {
                                let ingredientsNeeded = [];

                                if (window.lastClickedRecipe && window.lastClickedRecipe.ingredients) {
                                    ingredientsNeeded = window.lastClickedRecipe.ingredients;
                                } else {
                                    // Extract from items currently in mixer
                                    const amtSpans = myMixer.querySelectorAll('span[id^="mix_amt_"]');
                                    amtSpans.forEach(span => {
                                        let text = span.textContent.trim();
                                        text = text.replace(/^\d+\s*x\s*/, '').trim();
                                        if (text && !ingredientsNeeded.includes(text)) {
                                            ingredientsNeeded.push(text);
                                        }
                                    });
                                }

                                let makeMany = parseInt(makeManyInput.value, 10);
                                if (isNaN(makeMany) || makeMany < 1) makeMany = 1;

                                let missingTableRows = [];
                                let totalFixed = 0;

                                ingredientsNeeded.forEach(ingName => {
                                    const id = inventoryMap[ingName];
                                    let hasCount = 0;

                                    if (id) {
                                        const amountEl = document.getElementById('amnt_' + id);
                                        if (amountEl) {
                                            hasCount = parseInt(amountEl.textContent, 10);
                                            if (document.getElementById('mix_amt_' + id)) {
                                                hasCount += 1;
                                            }
                                        }
                                    }

                                    const neededAmount = makeMany - hasCount;
                                    if (neededAmount > 0) {
                                        const allDrinks = [
                                            ...(Modules.DrinksData.drinks.alcoholic || []),
                                            ...(Modules.DrinksData.drinks.non_alcoholic || [])
                                        ];
                                        const baseDrink = allDrinks.find(d => d.name === ingName);

                                        let itemCostStr = '';

                                        if (baseDrink && baseDrink.cost) {
                                            let hasDiscount = false;
                                            
                                            if (baseDrink.cost.type === 'cw_multiplier') {
                                                const costVal = baseDrink.cost.value * neededAmount;
                                                const cwPrice = Utils.getCWPrice();
                                                let dollarCost = Math.round(costVal * cwPrice);
                                                
                                                if (baseDrink.location === 'Liquor Store') {
                                                    dollarCost = Math.round(dollarCost * 0.9);
                                                    hasDiscount = true;
                                                }

                                                totalFixed += dollarCost;
                                                itemCostStr = `$${dollarCost.toLocaleString()}${hasDiscount ? '*' : ''}`;
                                            } else if (baseDrink.cost.type === 'fixed' && typeof baseDrink.cost.value === 'number') {
                                                let costVal = baseDrink.cost.value * neededAmount;
                                                
                                                if (baseDrink.location === 'Liquor Store') {
                                                    costVal = Math.round(costVal * 0.9);
                                                    hasDiscount = true;
                                                }

                                                totalFixed += costVal;
                                                itemCostStr = `$${costVal.toLocaleString()}${hasDiscount ? '*' : ''}`;
                                            } else if (baseDrink.cost.type === 'fixed' && typeof baseDrink.cost.value === 'string') {
                                                itemCostStr = `${neededAmount}x ${baseDrink.cost.value}`;
                                            }
                                        }

                                        missingTableRows.push(`
                                            <tr>
                                                <td style="padding: 2px 8px 2px 0;"><span style="color:#d9534f; font-weight:bold;">✗</span></td>
                                                <td style="padding: 2px 15px 2px 0; color:#000;">${neededAmount} x ${ingName} <span style="color:#888; font-size:11px;">(Have: ${hasCount})</span></td>
                                                <td style="padding: 2px 0; color:#666; text-align: right; white-space: nowrap;">${itemCostStr}</td>
                                            </tr>
                                        `);
                                    }
                                });

                                if (missingTableRows.length > 0 && ingredientsNeeded.length > 0) {
                                    let listHtml = `<table style="border-collapse: collapse; font-size: 13px; min-width: 200px;">${missingTableRows.join('')}</table>`;
                                    
                                    if (totalFixed > 0) {
                                        listHtml += `<div style="margin-top: 5px; font-weight: bold; color: #333; border-top: 1px dashed #ccc; padding-top: 3px;">Estimated Cost: <span style="color:red;">$${totalFixed.toLocaleString()}</span> <span id="bank-btn-container"></span></div>`;
                                        listHtml += `<div style="margin-top: 2px; font-size: 10px; color: #888;">* 10% Bartender's Guide discount applied</div>`;
                                    }

                                    shoppingListContent.innerHTML = listHtml;
                                    shoppingListContainer.style.display = 'block';

                                    const bankBtnContainer = document.getElementById('bank-btn-container');
                                    if (bankBtnContainer) {
                                        const bankBtn = Utils.createBankButton('Drink Ingredients', totalFixed);
                                        bankBtn.addEventListener('click', function() {
                                            let saveObj = {};
                                            ingredientsNeeded.forEach(ingName => {
                                                const id = inventoryMap[ingName];
                                                let hasCount = 0;
                                                if (id) {
                                                    const amountEl = document.getElementById('amnt_' + id);
                                                    if (amountEl) {
                                                        hasCount = parseInt(amountEl.textContent, 10);
                                                        if (document.getElementById('mix_amt_' + id)) {
                                                            hasCount += 1;
                                                        }
                                                    }
                                                }
                                                const neededAmount = makeMany - hasCount;
                                                if (neededAmount > 0) {
                                                    saveObj[ingName] = neededAmount;
                                                }
                                            });

                                            localStorage.setItem('hobowarsDrinkShoppingList', JSON.stringify(saveObj));
                                            if (window.lastClickedRecipe && window.lastClickedRecipe.name) {
                                                localStorage.setItem('hobowarsDrinkShoppingList_TargetDrink', window.lastClickedRecipe.name);
                                            } else {
                                                localStorage.removeItem('hobowarsDrinkShoppingList_TargetDrink');
                                            }
                                        });
                                        bankBtnContainer.appendChild(bankBtn);
                                    }
                                } else {
                                    shoppingListContent.innerHTML = '';
                                    shoppingListContainer.style.display = 'none';
                                }
                            };

                            makeManyInput.addEventListener('input', () => {
                                if (typeof window.updateShoppingList === 'function') window.updateShoppingList();
                            });
                        }
                    }
                }
            }
        }

const NorthernFenceHelper = {
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

const RecyclingBinHelper = {
    init: function() {
        if (!Utils.isCurrentPage('cmd=recycling_bin')) return;

        const settings = Utils.getSettings();
        if (settings.global_enabled === false) return;
        if (settings.RecyclingBinHelper === false) return;

        this.initRecycleButtons();
    },

    initRecycleButtons: function() {
        const sCansInput = document.getElementById('s_cans');
        const submitBtn = document.querySelector('form[name="bin"] input[type="submit"][name="Submit"]');

        if (sCansInput && submitBtn) {
            const amounts = [100, 200, 500];

            amounts.forEach(amount => {
                const btn = document.createElement('input');
                btn.type = 'button';
                btn.value = '+' + amount;
                btn.style.marginRight = '5px';
                btn.onclick = function(e) {
                    e.preventDefault();
                    const currentVal = parseInt(sCansInput.value) || 0;
                    sCansInput.value = currentVal + amount;
                };
                submitBtn.parentNode.insertBefore(btn, submitBtn);
            });
        }
    }
};

const SettingsHelper = {
    init: function() {
        if (!window.location.search.endsWith('cmd=preferences')) return;

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        console.log('Settings Helper loaded for preferences page');
        
        // Add divider and title
        const hr = document.createElement('hr');
        hr.width = "300";
        contentArea.appendChild(document.createElement('br'));
        contentArea.appendChild(hr);
        contentArea.appendChild(document.createElement('br'));

        const titleDiv = document.createElement('div');
        titleDiv.align = "center";
        titleDiv.innerHTML = "<b><font size=\"3\">Hobo Helper Settings</font></b>";
        contentArea.appendChild(titleDiv);
        contentArea.appendChild(document.createElement('br'));

        const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
        
        // Helper function for toggles
        const createToggle = (key, labelText, isGlobal = false) => {
            const container = document.createElement('div');
            container.style.marginBottom = '5px';
            container.style.paddingLeft = isGlobal ? '0' : '20px';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `hw_helper_${key}`;
            // default to true if undefined
            checkbox.checked = savedSettings[key] !== false;
            
            const label = document.createElement('label');
            label.htmlFor = `hw_helper_${key}`;
            label.innerHTML = ` ${labelText}`;
            if (isGlobal) label.style.fontWeight = 'bold';

            const toast = document.createElement('span');
            toast.innerText = ' (Saved! Reload to apply)';
            toast.style.color = 'green';
            toast.style.fontSize = '12px';
            toast.style.display = 'none';
            label.appendChild(toast);

            let toastTimeout;
            checkbox.addEventListener('change', (e) => {
                const settings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
                settings[key] = e.target.checked;
                localStorage.setItem('hw_helper_settings', JSON.stringify(settings));
                
                // Show saved toast or reload prompt
                toast.style.display = 'inline';
                clearTimeout(toastTimeout);
                toastTimeout = setTimeout(() => { toast.style.display = 'none'; }, 2000);
            });

            container.appendChild(checkbox);
            container.appendChild(label);
            return container;
        };

        // Add global toggle
        contentArea.appendChild(createToggle('global_enabled', 'Enable Hobo Helper (Global)', true));
        
        contentArea.appendChild(document.createElement('br'));
        const modsLabel = document.createElement('b');
        modsLabel.innerText = "Active Modules:";
        contentArea.appendChild(modsLabel);
        contentArea.appendChild(document.createElement('br'));

        const subFeatures = {
            'LivingAreaHelper': [
                { key: 'LivingAreaHelper_StatRatioTracker', label: 'Stat Ratio Tracker' },
                { key: 'LivingAreaHelper_AlwaysShowSpecialItem', label: 'Always Show Special Item' },
                { key: 'LivingAreaHelper_MixerLink', label: 'Mixer Link' },
                { key: 'LivingAreaHelper_WinPercentageCalc', label: 'Win Percentage Calc' }
            ],
            'BernardsMansionHelper': [
                { key: 'BernardsMansionHelper_BasementMap', label: 'Basement Map' }
            ]
        };

        if (typeof Modules !== 'undefined') {
            Object.keys(Modules).forEach(modName => {
                if (modName === 'SettingsHelper') return; 
                contentArea.appendChild(createToggle(modName, `Enable ${modName}`));

                // Render sub-features if this module has them defined
                if (subFeatures[modName]) {
                    const subContainer = document.createElement('div');
                    subContainer.style.paddingLeft = '40px';
                    subFeatures[modName].forEach(feature => {
                        subContainer.appendChild(createToggle(feature.key, feature.label));
                    });
                    contentArea.appendChild(subContainer);
                }
            });
        }
    }
}

const TattooParlorHelper = {
            init: function() {
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('cmd') === 'tattoo_parlor') {
                    const links = document.querySelectorAll('a[href*="tattoo_parlor"]');
                    links.forEach(link => {
                        const text = link.textContent;
                        if (text.includes('Retouch') || text.includes('Remove')) {
                            const costMatch = text.match(/\$?([0-9,]+)/);
                            if (costMatch) {
                                const cost = Utils.parseNumber(costMatch[1]);
                                if (!isNaN(cost) && cost > 0) {
                                    const actionName = text.includes('Retouch') ? 'Tattoo Retouch' : 'Tattoo Remove';

                                    const btn = Utils.createBankButton(actionName, cost);

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

const UniversityHelper = {
    init: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const cmd = urlParams.get('cmd');
        const doParam = urlParams.get('do');
        
        if (cmd === 'uni') {
            if (['str', 'pow', 'spd'].includes(doParam)) {
                this.updateStatsFromTrain();
            }
            this.displayNeededStats();
        }
    },

    updateStatsFromTrain: function() {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;
        
        const text = contentArea.textContent;
        const gainMatch = text.match(/You gained ([\d.,]+) (speed|power|strength)/i);

        if (gainMatch) {
            let amount = Utils.parseNumber(gainMatch[1]);
            const stat = gainMatch[2].toLowerCase();
            
            const statsConfigStr = localStorage.getItem('hoboStatRatio');
            if (statsConfigStr) {
                try {
                    let config = JSON.parse(statsConfigStr);
                    if (config && config.needs && config.needs[stat] !== undefined) {
                        config.needs[stat] -= amount;
                        // Keep integer values consistent and avoid float precision issues later
                        config.needs[stat] = Math.round(config.needs[stat] * 10) / 10;
                        localStorage.setItem('hoboStatRatio', JSON.stringify(config));
                    }
                } catch (e) {}
            }
        }
    },
    
    displayNeededStats: function() {
        const statsConfigStr = localStorage.getItem('hoboStatRatio');
        if (!statsConfigStr) return;
        
        let config;
        try {
            config = JSON.parse(statsConfigStr);
        } catch (e) {
            return;
        }

        if (!config || !config.needs) return;

        const links = document.querySelectorAll('.trainlinks a');
        
        links.forEach(link => {
            const text = link.textContent.trim();
            let amount = -1;
            
            if (text === 'Train Strength') {
                amount = config.needs.strength || 0;
            } else if (text === 'Train Power') {
                amount = config.needs.power || 0;
            } else if (text === 'Train Speed') {
                amount = config.needs.speed || 0;
            }

            if (amount !== -1) {
                const span = document.createElement('span');
                span.style.marginLeft = '5px';
                span.style.fontWeight = 'bold';
                if (amount > 0) {
                    span.style.color = '#008000';
                    span.textContent = `[+${amount.toLocaleString()}]`;
                } else if (amount < 0) {
                    span.style.color = '#d9534f';
                    span.textContent = `[-${Math.abs(amount).toLocaleString()}]`;
                } else {
                    span.style.color = '#999';
                    span.textContent = `[+0]`;
                }
                link.parentNode.insertBefore(span, link.nextSibling);
            }
        });
    }
};

const WellnessClinicHelper = {
            init: function() {
                const url = window.location.href;

                const clinicData = [
                    {lv: 1, fee: 2500}, {lv: 2, fee: 12500}, {lv: 3, fee: 42500}, {lv: 4, fee: 92500}, {lv: 5, fee: 162500},
                    {lv: 6, fee: 252500}, {lv: 7, fee: 362500}, {lv: 8, fee: 492500}, {lv: 9, fee: 642500}, {lv: 10, fee: 812500},
                    {lv: 11, fee: 1002500}, {lv: 12, fee: 1212500}, {lv: 13, fee: 1442500}, {lv: 14, fee: 1692500}, {lv: 15, fee: 1962500},
                    {lv: 16, fee: 2252500}, {lv: 17, fee: 2562500}, {lv: 18, fee: 2892500}, {lv: 19, fee: 3242500}, {lv: 20, fee: 3612500},
                    {lv: 21, fee: 4002500}, {lv: 22, fee: 4412500}, {lv: 23, fee: 4842500}, {lv: 24, fee: 5292500}, {lv: 25, fee: 5762500},
                    {lv: 26, fee: 6252500}, {lv: 27, fee: 6762500}, {lv: 28, fee: 7292500}, {lv: 29, fee: 7842500}, {lv: 30, fee: 8412500},
                    {lv: 31, fee: 9002500}, {lv: 32, fee: 9612500}, {lv: 33, fee: 10242500}, {lv: 34, fee: 10892500}, {lv: 35, fee: 11562500},
                    {lv: 36, fee: 12252500}, {lv: 37, fee: 12962500}, {lv: 38, fee: 13692500}, {lv: 39, fee: 14442500}, {lv: 40, fee: 15212500},
                    {lv: 41, fee: 16002500}, {lv: 42, fee: 16812500}, {lv: 43, fee: 17642500}, {lv: 44, fee: 18492500}, {lv: 45, fee: 19362500},
                    {lv: 46, fee: 20252500}, {lv: 47, fee: 21162500}, {lv: 48, fee: 22092500}, {lv: 49, fee: 23042500}, {lv: 50, fee: 24012500},
                    {lv: 51, fee: 25002500}, {lv: 52, fee: 26012500}, {lv: 53, fee: 27042500}, {lv: 54, fee: 28092500}, {lv: 55, fee: 29162500},
                    {lv: 56, fee: 30252500}, {lv: 57, fee: 31362500}, {lv: 58, fee: 32492500}, {lv: 59, fee: 33642500}, {lv: 60, fee: 34812500},
                    {lv: 61, fee: 36002500}, {lv: 62, fee: 37212500}, {lv: 63, fee: 38442500}, {lv: 64, fee: 39692500}, {lv: 65, fee: 40962500},
                    {lv: 66, fee: 42252500}, {lv: 67, fee: 43562500}, {lv: 68, fee: 44892500}, {lv: 69, fee: 46242500}, {lv: 70, fee: 47612500},
                    {lv: 71, fee: 49002500}, {lv: 72, fee: 50412500}, {lv: 73, fee: 51842500}, {lv: 74, fee: 53292500}, {lv: 75, fee: 54762500},
                    {lv: 76, fee: 56252500}, {lv: 77, fee: 57762500}, {lv: 78, fee: 59292500}, {lv: 79, fee: 60842500}, {lv: 80, fee: 62412500},
                    {lv: 81, fee: 64002500}, {lv: 82, fee: 65612500}, {lv: 83, fee: 67242500}, {lv: 84, fee: 68892500}, {lv: 85, fee: 70562500},
                    {lv: 86, fee: 72252500}, {lv: 87, fee: 73962500}, {lv: 88, fee: 75692500}, {lv: 89, fee: 77442500}, {lv: 90, fee: 79212500},
                    {lv: 91, fee: 81002500}, {lv: 92, fee: 82812500}, {lv: 93, fee: 84642500}, {lv: 94, fee: 86492500}, {lv: 95, fee: 88362500},
                    {lv: 96, fee: 90252500}, {lv: 97, fee: 92162500}, {lv: 98, fee: 94092500}, {lv: 99, fee: 96042500}, {lv: 100, fee: 98012500}
                ];

                if (url.includes('cmd=wellness_clinic')) {
                    const contentArea = document.querySelector('.content-area');
                    if (!contentArea) return;

                    const text = contentArea.innerText;
                    const costMatch = text.match(/\$?([0-9]{1,3}(,[0-9]{3})+|[0-9]{4,})/);
                    let detectedCost = 0;
                    if (costMatch) detectedCost = Utils.parseNumber(costMatch[0]);

                    const hasPaid = url.includes('do=pay');
                    let currentIndex = clinicData.findIndex(row => row.fee === detectedCost);
                    if (hasPaid && currentIndex !== -1 && currentIndex < clinicData.length - 1) currentIndex += 1;

                    let runningTotalSpentDay = 0;
                    let runningFutureCost = 0;
                    let tableRows = "";

                    let savedGoals = Modules.BankHelper.getBankGoals();
                    const savedGoal = savedGoals['Wellness'];

                    clinicData.forEach((row, index) => {
                        runningTotalSpentDay += row.fee;
                        const isCurrentOrFuture = (index >= currentIndex && currentIndex !== -1);
                        if (isCurrentOrFuture) runningFutureCost += row.fee;

                        const isCurrentRow = (index === currentIndex);
                        const rowID = isCurrentRow ? 'id="hw-current-row"' : '';
                        const bg = isCurrentRow ? 'rgba(255, 255, 153, 0.4)' : 'transparent';
                        const isBlue = (savedGoal && parseInt(savedGoal) === runningFutureCost);
                        const activeClass = isBlue ? 'active' : '';
                        const interactiveClass = isCurrentOrFuture ? 'interactive' : '';
                        const cellClasses = `hw-wellness-finish-cell ${interactiveClass} ${activeClass}`.trim();
                        const interactiveStyle = isCurrentOrFuture ? 'cursor: pointer; color: #800;' : 'color: #888;';

                        tableRows += `
                            <tr ${rowID} style="background-color: ${bg}; border-bottom: 1px solid #ddd;">
                                <td style="padding: 4px; text-align: center; border-right: 1px solid #bbb;">${row.lv}</td>
                                <td style="padding: 4px; text-align: right; border-right: 1px solid #bbb;">$${row.fee.toLocaleString()}</td>
                                <td style="padding: 4px; text-align: right; border-right: 1px solid #bbb;">$${runningTotalSpentDay.toLocaleString()}</td>
                                <td class="${cellClasses}" data-val="${runningFutureCost}" style="padding: 4px; text-align: right; ${interactiveStyle}">
                                    ${isCurrentOrFuture ? `$${runningFutureCost.toLocaleString()}` : '-'}
                                </td>
                            </tr>
                        `;
                    });

                    const spentToday = (currentIndex !== -1) ? (runningTotalSpentDay - runningFutureCost) : 0;

                    const trackerHtml = `
                        <style>
                            .hw-wellness-finish-cell.interactive:hover:not(.active) {
                                background-color: #e0f0ff !important;
                            }
                            .hw-wellness-finish-cell.active {
                                background-color: lightblue !important;
                                font-weight: bold;
                            }
                        </style>
                        <div id="hw-tracker-container" style="margin: 20px auto; width: 95%; max-width: 580px; font-family: Verdana, sans-serif;">
                            <div id="hw-scroll-box" style="max-height: 350px; overflow-y: auto; border: 1px solid #666; border-radius: 4px; background-color: rgba(255,255,255,0.7);">
                                <table style="width: 100%; border-collapse: collapse; color: #000; font-size: 11px;">
                                    <thead style="position: sticky; top: 0; background: #f0f0f0; z-index: 10; border-bottom: 2px solid #999;">
                                        <tr>
                                            <th style="padding: 6px; border-right: 1px solid #bbb;">Lv</th>
                                            <th style="padding: 6px; border-right: 1px solid #bbb;">Fee</th>
                                            <th style="padding: 6px; border-right: 1px solid #bbb;">Total Spent Day</th>
                                            <th style="padding: 6px; background: #f9f9e8;">Cumulative Spend</th>
                                        </tr>
                                    </thead>
                                    <tbody>${tableRows}</tbody>
                                </table>
                            </div>
                            <div style="font-size: 11px; font-style: italic; color: #555; margin-top: 4px; text-align: center;">
                               💡 Click any amount in the <b>Cumulative Spend</b> column to set it as a Bank Withdraw Goal.
                            </div>
                            <div style="font-size: 12px; margin-top: 8px; color: #333; text-align: right; font-weight: bold;">
                               Total Spent Today: <span style="color: #800;">$${spentToday.toLocaleString()}</span>
                            </div>
                        </div>
                    `;

                    contentArea.insertAdjacentHTML('beforeend', trackerHtml);

                    document.querySelectorAll('.hw-wellness-finish-cell').forEach(cell => {
                        cell.addEventListener('click', function() {
                            if (!this.classList.contains('interactive')) return;
                            const val = this.getAttribute('data-val');
                            if (val === "0") return;
                            const isAlreadyActive = this.classList.contains('active');
                            document.querySelectorAll('.hw-wellness-finish-cell').forEach(c => c.classList.remove('active'));

                            if (!isAlreadyActive) {
                                this.classList.add('active');
                                Modules.BankHelper.addBankGoal('Wellness', parseInt(val));
                            } else {
                                Modules.BankHelper.addBankGoal('Wellness', 0);
                            }
                        });
                    });

                    setTimeout(() => {
                        const row = document.getElementById('hw-current-row');
                        const box = document.getElementById('hw-scroll-box');
                        if (row && box) box.scrollTop = row.offsetTop - 100;
                    }, 150);
                }
            }
        }
    const Modules = {
        BankHelper,
        BernardsMansionHelper,
        CanDepoHelper,
        DrinksData,
        DrinksHelper,
        KurtzCampHelper,
        LiquorStoreHelper,
        LivingAreaHelper,
        MessageBoardHelper,
        MixerHelper,
        NorthernFenceHelper,
        RecyclingBinHelper,
        SettingsHelper,
        TattooParlorHelper,
        UniversityHelper,
        WellnessClinicHelper
    };

    const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
    const globalEnabled = savedSettings['global_enabled'] !== false;

    // Initialize all modules
    Object.keys(Modules).forEach(moduleName => {
        if (typeof Modules[moduleName].init === 'function') {
            const moduleEnabled = savedSettings[moduleName] !== false;
            if (moduleName === 'SettingsHelper' || (globalEnabled && moduleEnabled)) {
                Modules[moduleName].init();
            }
        }
    });
})();

