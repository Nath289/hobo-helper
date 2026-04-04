// ==UserScript==
// @name         HoboWars Helper Toolkit
// @namespace    http://tampermonkey.net/
// @version      7.76
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
        },
        getFightersLunchCost: function(level) {
            return ((10 * (level + 3)) / 2) * 2;
        },
        getHoboAgeInDays: function() {
            const ageLine = document.querySelector('#personalInfo .line font[title*="days"]');
            if (ageLine && ageLine.title) {
                const match = ageLine.title.match(/(\d+)\s*days/i);
                if (match) {
                    return parseInt(match[1], 10);
                }
            }
            return null;
        }

};
const BackpackHelper = {
    init: function() {
        const settings = Utils.getSettings();
        if (settings?.BackpackHelper?.enabled === false) return;


        this.observeBackpack();
    },

    observeBackpack: function() {
        let drinkMap = null;

        const processItems = () => {
            const items = document.querySelectorAll('.bp-itm:not([data-bh-tooltip-processed])');
            if (items.length === 0) return;

            // Initialize map lazily
            if (!drinkMap && typeof DrinksData !== 'undefined' && DrinksData.drinks) {
                drinkMap = {};
                const combined = [...DrinksData.drinks.alcoholic, ...DrinksData.drinks.mixed];
                combined.forEach(d => {
                    drinkMap[d.name] = d;
                });
            }
            // If we still can't find drinks data, skip processing
            if (!drinkMap) return;

            items.forEach(item => {
                // Mark processed immediately
                item.setAttribute('data-bh-tooltip-processed', 'true');

                const img = item.querySelector('img');
                if (!img) return;

                const name = img.title.trim();
                const drinkInfo = drinkMap[name];

                if (drinkInfo) {
                    let tooltipParts = [];
                    if (drinkInfo.base_stat_gain && drinkInfo.base_stat_gain.trim() !== "") {
                        tooltipParts.push(`Stats: ${drinkInfo.base_stat_gain.trim()}`);
                    }
                    if (drinkInfo.effect && drinkInfo.effect.trim() !== "") {
                        tooltipParts.push(`Effect: ${drinkInfo.effect.trim()}`);
                    }

                    if (tooltipParts.length > 0) {
                        const target = item.closest('td') ? item.closest('td') : item;
                        const tooltipText = tooltipParts.join(' - ');
                        target.setAttribute('title', tooltipText);

                        // If it has children with titles (like the img), clear them so they don't override the td
                        if (img.hasAttribute('title')) {
                            // We can reset the img title to empty or match the parent
                            img.setAttribute('title', tooltipText);
                        }

                        // Check if the link has a title
                        const a = item.querySelector('a');
                        if (a && a.hasAttribute('title')) {
                            a.setAttribute('title', tooltipText);
                        }
                    }
                }
            });
        };

        let timeout = null;
        const observer = new MutationObserver(() => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(processItems, 250);
        });

        const targetNode = document.getElementById('backpackTab') ? document.getElementById('backpackTab') : document.body;
        observer.observe(targetNode, { childList: true, subtree: true });

        // Initial run
        processItems();
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

                const settings = Utils.getSettings();
                const withdrawInput = document.getElementById('w_money');
                const withdrawForm = document.querySelector('form[name="with"]');
                const nativeWithdrawBtn = withdrawForm ? withdrawForm.querySelector('input[type="submit"]') : null;

                if (!withdrawInput || !nativeWithdrawBtn) return;

                if (settings.BankHelper_5FightersLunches !== false) {
                    const level = Utils.getHoboLevel();
                    const lunchCost = Utils.getFightersLunchCost(level);
                    const totalCost = lunchCost * 5;

                    if (totalCost > 0) {
                        let clickCount = 0;
                        const lunchBtn = document.createElement('input');
                        lunchBtn.type = 'button';
                        lunchBtn.value = ` + Add 5 Fighter's Lunches ($${totalCost.toLocaleString()}) `;
                        lunchBtn.style.marginLeft = '10px';
                        lunchBtn.style.cursor = 'pointer';
                        lunchBtn.style.backgroundColor = '#e6f7ff';
                        lunchBtn.style.border = '1px solid #91d5ff';

                        lunchBtn.onclick = function() {
                            clickCount++;
                            let currentVal = parseInt(withdrawInput.value.replace(/,/g, '')) || 0;
                            withdrawInput.value = (currentVal + totalCost).toString();
                            
                            this.value = ` + Add 5 Fighter's Lunches ($${totalCost.toLocaleString()}) [Added ${clickCount * 5}] `;
                        };

                        nativeWithdrawBtn.parentNode.insertBefore(lunchBtn, nativeWithdrawBtn.nextSibling);
                    }
                }

                const goals = this.getBankGoals();
                if (Object.keys(goals).length === 0) return;

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
        <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" style="border-collapse: collapse; border-style: ridge; border-color: black; border-width: 5px; table-layout: fixed;" align="center">
            <tbody>
                ${Array.from({ length: 20 }, (_, r) => {
                    const y = 20 - r; // 20 to 1 (top to bottom)
                    return `<tr>
                        ${Array.from({ length: 20 }, (_, c) => {
                            const x = c + 1; // 1 to 20 (left to right)
                            return `<td class="bernards-map-cell" data-x="${x}" data-y="${y}" title="${x}, ${y}" bgcolor="#FFFFFF" style="border: 1px solid #ddd; width: 8px; height: 8px; min-width: 8px; min-height: 8px; max-width: 8px; max-height: 8px; padding: 0; box-sizing: border-box;"></td>`;
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

const ChangelogData = {
    init: function() {} ,
    changes: [
        {
            version: "7.76",
            date: "2026-04-04",
            type: "Changed",
            notes: [
                "Enhanced the MessageBoardHelper 'Add Payment' dollar amount parser to correctly interpret multiplier suffixes (k, m, mil, mill, million) and automatically format the mapped value with commas and a dollar sign."
            ]
        },
        {
            version: "7.75",
            date: "2026-04-04",
            type: "Changed",
            notes: [
                "Adjusted the padding of the SettingsHelper card boxes and global toggle container for a tighter, cleaner appearance."
            ]
        },
        {
            version: "7.74",
            date: "2026-04-04",
            type: "Changed",
            notes: [
                "Overhauled the SettingsHelper Game Preferences page layout, migrating from a continuous vertical list to a balanced and stylized two-column card grid to improve readability and aesthetics."
            ]
        },
        {
            version: "7.73",
            date: "2026-04-04",
            type: "Added",
            notes: [
                "Added \"Enable Improved Avatars\" sub-feature to DisplayHelper to apply custom CSS shaping and styling to avatar images, including online status indicators. This can be configured in the Settings menu."
            ]
        },
        {
            version: "7.72",
            date: "2026-04-04",
            type: "Added",
            notes: [
                "Added the SoupKitchenHelper module to display the current tracked age of your Hobo in days and present an informational wiki table showing which soup items correspond to each age range when visiting the soup line."
            ]
        }
    ]
};

const DisplayHelper = {
    alwaysInit: function() {
        // This function will always run upon loading any page,
        // regardless of whether this specific module is enabled or totally disabled globally.
        const targetHoboId = "2924510";

        const playerLinks = document.querySelectorAll(`a[href*="cmd=player&ID=${targetHoboId}"]`);
        playerLinks.forEach(link => {
            if (!link.innerHTML.includes('The Fake')) {
                link.innerHTML = `<span style="color: red; font-weight: bold; text-shadow: 1px 1px 2px black;">The Fake</span> ` + link.innerHTML;
            }
        });
    },
    init: function() {
        const settings = Utils.getSettings();
        // This function only runs if the global helper is enabled,
        // and if this specific 'DisplayHelper' is enabled via SettingsHelper.
        if (settings['DisplayHelper_ImprovedAvatars'] !== false) {
            this.initImprovedAvatars();
        }
    },
    initImprovedAvatars: function() {
        const style = document.createElement('style');
        style.innerHTML = `
            /* Avatars */
            .pavatar .avatar-circle {
                border-radius: 35% 35% 25% 35% !important;
                border: 3px solid #531 !important;
            }
            .pavatar .avatar-special.don {
                border-radius: 35% 35% 24% 35% !important;
                border-style: solid!important;
                border-width: 4px!important;
                border-color: #fa0!important;
            }
            .pavatar .avatar-special {
                border-radius: 35% 35% 24% 35% !important;
                border-style: solid!important;
                border-width: 4px!important;
                border-color: #000 !important;
            }
            .pavatar .avatar-circle .avatar-active {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 30%;
                height: 30%;
                border: 2px solid #531!important;
                border-bottom-width: 0!important;
                border-right-width: 0!important;
                border-radius: 70%;
                border-top-right-radius: 0;
                border-bottom-left-radius: 0;
                border-top-left-radius: 100%;
                cursor: progress;
            }
            .pavatar .avatar-circle .avatar-active.recently {
                background-color: #5fd05f;
            }
            .pavatar .avatar-circle .avatar-active.pulse {
                background-color: #00f406;
                animation: 1.5s Online linear infinite !important;
            }
            .pavatar.tt {
                padding: 0 !important;
            }
        `;
        document.head.appendChild(style);
    }
};

const DrinksData = {
            // Data structure containing all drinks in the game
            drinks: {
                alcoholic: [
                    { name: "Crudweiser", cost: { type: "cw_multiplier", value: 1 }, location: "Liquor Store", base_stat_gain: "", effect: "" },
                    { name: "Goon Sack", cost: { type: "cw_multiplier", value: 4 }, location: "Liquor Store", base_stat_gain: "+0.050 Power", effect: "" },
                    { name: "Albino Ale", cost: { type: "cw_multiplier", value: 4 }, location: "Liquor Store", base_stat_gain: "+0.050 Strength", effect: "" },
                    { name: "Purple Pigeon Vodka", cost: { type: "cw_multiplier", value: 6 }, location: "Liquor Store", base_stat_gain: "+0.050 Speed +0.050 Power", effect: "" },
                    { name: "John Cuervo Tequila", cost: { type: "cw_multiplier", value: 6 }, location: "Liquor Store", base_stat_gain: "+0.050 Power +0.050 Strength", effect: "" },
                    { name: "Birdbath Gin", cost: { type: "cw_multiplier", value: 6 }, location: "Liquor Store", base_stat_gain: "+0.050 Speed +0.050 Strength", effect: "" },
                    { name: "Rev's Rum", cost: { type: "cw_multiplier", value: 8 }, location: "Liquor Store", base_stat_gain: "+0.100 Strength", effect: "" },
                    { name: "Ruiner's Rum", cost: { type: "cw_multiplier", value: 8 }, location: "Liquor Store", base_stat_gain: "+0.100 Power", effect: "" },
                    { name: "Wild Terrier Whiskey", cost: { type: "cw_multiplier", value: 8 }, location: "Liquor Store", base_stat_gain: "+0.100 Speed", effect: "" },
                    { name: "Zima Light", cost: { type: "cw_multiplier", value: 10 }, location: "Liquor Store", base_stat_gain: "-0.025 Strength", effect: "" },
                    { name: "Portly Stout", cost: { type: "cw_multiplier", value: 10 }, location: "Liquor Store", base_stat_gain: "+0.100 Strength", effect: "" },
                    { name: "Boxcar Boxed Wine", cost: { type: "cw_multiplier", value: 10 }, location: "Liquor Store", base_stat_gain: "+0.075 Power", effect: "" },
                    { name: "Octuple Sec", cost: { type: "cw_multiplier", value: 12 }, location: "Liquor Store", base_stat_gain: "+0.125 Power", effect: "" },
                    { name: "Montreal Bourbon", cost: { type: "cw_multiplier", value: 12 }, location: "Liquor Store", base_stat_gain: "+0.125 Strength", effect: "" },
                    { name: "Brandy Brand Brandy", cost: { type: "cw_multiplier", value: 12 }, location: "Liquor Store", base_stat_gain: "+0.125 Speed", effect: "" },
                    { name: "Aunt Flo Amaretto", cost: { type: "cw_multiplier", value: 14 }, location: "Liquor Store", base_stat_gain: "+0.150 Speed", effect: "" },
                    { name: "Mutton Chop Scotch", cost: { type: "cw_multiplier", value: 16 }, location: "Liquor Store", base_stat_gain: "+0.075 Power +0.100 Strength", effect: "" },
                    { name: "Homeless Hennessy", cost: { type: "cw_multiplier", value: 20 }, location: "Liquor Store", base_stat_gain: "+0.050 Speed +0.050 Power +0.075 Strength", effect: "" },
                    { name: "Lemon Drop", cost: { type: "cw_multiplier", value: 4 }, location: "Dive Bar", base_stat_gain: "+0.050 Speed", effect: "" },
                    { name: "Buttery Nipple", cost: { type: "cw_multiplier", value: 8 }, location: "Dive Bar", base_stat_gain: "+0.050 Speed", effect: "" },
                    { name: "Canadian Flag", cost: { type: "cw_multiplier", value: 12 }, location: "Dive Bar", base_stat_gain: "+0.075 Speed", effect: "" },
                    { name: "The CMYK", cost: { type: "cw_multiplier", value: 16 }, location: "Dive Bar", base_stat_gain: "+0.075 Speed", effect: "" },
                    { name: "Five Star General", cost: { type: "cw_multiplier", value: 20 }, location: "Dive Bar", base_stat_gain: "+0.100 Speed", effect: "" },
                    { name: "Rainbow Road", cost: { type: "cw_multiplier", value: 24 }, location: "Dive Bar", base_stat_gain: "+0.100 Speed", effect: "" },
                    { name: "Shot of Whiskey", cost: { type: "fixed", value: 3000 }, location: "Alcoholic Rat / Shakedown Saloon", base_stat_gain: "+0.050 Speed", effect: "" },
                    { name: "Shot of Ruiner's Rum", cost: { type: "fixed", value: 3000 }, location: "Alcoholic Rat / Shakedown Saloon", base_stat_gain: "+0.050 Speed +0.050 Power", effect: "" },
                    { name: "Shot of Tequila", cost: { type: "fixed", value: 3000 }, location: "Alcoholic Rat / Shakedown Saloon", base_stat_gain: "+0.050 Speed +0.050 Strength", effect: "" },
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
                    { name: "Amish Highball", cost: { type: "mixed", text: "10CW+$200" }, location: "Mixer", ingredients: ["Boxcar Boxed Wine", "Cola"], base_stat_gain: "+0.025 Speed +0.050 Strength", effect: "Amish" },
                    { name: "Angry Mother", cost: { type: "mixed", text: "14CW+$400" }, location: "Mixer", ingredients: ["Aunt Flo Amaretto", "Sweet & Sour"], base_stat_gain: "+0.075 Power", effect: "Angry" },
                    { name: "Bawling Baby", cost: { type: "mixed", text: "Awake+6CW+$250" }, location: "Mixer", ingredients: ["Decaf Kahlua", "Purple Pigeon Vodka", "Milk"], base_stat_gain: "+0.007 Begging", effect: "Bawling like a baby" },
                    { name: "Bloody Murray", cost: { type: "mixed", text: "Awake+6CW+10Cans+$50,000+200PP" }, location: "Mixer", ingredients: ["Purple Pigeon Vodka", "Celery", "Hair of the Dog", "Tabasco"], base_stat_gain: "+0.075 Power +0.075 Strength", effect: "Chance to decrease BAC by 0.12%." },
                    { name: "Centrifuge", cost: { type: "mixed", text: "38CW+$600" }, location: "Mixer", ingredients: ["Birdbath Gin", "John Cuervo Tequila", "Octuple Sec", "Purple Pigeon Vodka", "Rev's Rum", "Sweet & Sour", "Cola"], base_stat_gain: "", effect: "Uranium Enriched" },
                    { name: "Dead Man Walking", cost: { type: "mixed", text: "Awake+28CW+$400" }, location: "Mixer", ingredients: ["Octuple Sec", "Orange Juice", "Rev's Rum", "Ruiner's Rum", "Sweet & Sour"], base_stat_gain: "", effect: "Zombified" },
                    { name: "Eggnog", cost: { type: "mixed", text: "Orange Gift (Awake)" }, location: "Mixer", ingredients: ["Orange Gift"], base_stat_gain: "+0.075 Speed +0.075 Power +0.075 Strength +0.025 Intelligence +0.004 Begging", effect: "" },
                    { name: "Egyptini", cost: { type: "mixed", text: "Awake+6CW+$50" }, location: "Mixer", ingredients: ["Birdbath Gin", "Olive", "Wonka Bar Wrapper", "Bath Salts", "Ice"], base_stat_gain: "-0.250 Speed +0.250 Power +0.250 Strength", effect: "Mummified" },
                    { name: "Erupting Volcano", cost: { type: "mixed", text: "Awake+20CW+$800" }, location: "Mixer", ingredients: ["Homeless Hennessy", "Dry Ice", "Fire", "Red Bull"], base_stat_gain: "+0.100 Power +0.100 Strength", effect: "Enraged" },
                    { name: "Eye Gouger", cost: { type: "mixed", text: "6CW+$200" }, location: "Mixer", ingredients: ["Purple Pigeon Vodka", "Soda Water"], base_stat_gain: "", effect: "Blind" },
                    { name: "Filthy Leprechaun", cost: { type: "mixed", text: "Awake+16CW" }, location: "Mixer", ingredients: ["Irish Cream", "Mutton Chop Scotch"], base_stat_gain: "+0.075 Speed", effect: "Green Noser" },
                    { name: "Flaming Hedgehog", cost: { type: "mixed", text: "Awake+$300" }, location: "Mixer", ingredients: ["Jagermeister", "Fire", "Red Bull"], base_stat_gain: "+0.125 Power", effect: "Flame-tipped Spiked Hair" },
                    { name: "Full Moon", cost: { type: "mixed", text: "Awake+$50" }, location: "Mixer", ingredients: ["Irish Cream", "Jack Daniel's", "Bath Salts", "Ice"], base_stat_gain: "+0.125 Power +0.125 Strength", effect: "Warwolf" },
                    { name: "Gin & Juice", cost: { type: "mixed", text: "Awake+6CW" }, location: "Mixer", ingredients: ["Birdbath Gin", "Orange Juice"], base_stat_gain: "+0.050 Intel", effect: "Laid Back" },
                    { name: "Happy Puppy", cost: { type: "mixed", text: "8CW+$200" }, location: "Mixer", ingredients: ["Wild Terrier Whiskey", "Cola"], base_stat_gain: "+0.100 Power", effect: "Puppy Power" },
                    { name: "Hedgehog", cost: { type: "mixed", text: "Awake+$300" }, location: "Mixer", ingredients: ["Jagermeister", "Red Bull"], base_stat_gain: "+0.100 Power", effect: "Spiked Hair" },
                    { name: "Hungry Hippo", cost: { type: "mixed", text: "Awake+6CW+$250" }, location: "Mixer", ingredients: ["Decaf Kahlua", "Irish Cream", "Purple Pigeon Vodka", "Milk"], base_stat_gain: "", effect: "You can eat another meal." },
                    { name: "Jolly Gentleman", cost: { type: "mixed", text: "Awake+6CW" }, location: "Mixer", ingredients: ["Birdbath Gin", "Olive"], base_stat_gain: "+0.100 Power", effect: "Classy as Hell" },
                    { name: "Lemonade", cost: { type: "mixed", text: "April Fool's Mini Adventure" }, location: "Mixer", ingredients: ["April Fool's Mini Adventure"], base_stat_gain: "+1.250 Speed +1.250 Power +1.250 Strength", effect: "Requires the Open Packet of Sugar to drink." },
                    { name: "Prison Hooch", cost: { type: "mixed", text: "HoboArena Reward" }, location: "Mixer", ingredients: ["HoboArena Reward"], base_stat_gain: "+0.150 Speed +0.150 Power +0.150 Strength", effect: "Meleeria" },
                    { name: "Purring Kitty", cost: { type: "mixed", text: "6CW+$200" }, location: "Mixer", ingredients: ["Birdbath Gin", "Soda Water"], base_stat_gain: "+0.100 Speed", effect: "Kitten Pox" },
                    { name: "Rocket Juice", cost: { type: "mixed", text: "HoboArena Reward" }, location: "Mixer", ingredients: ["HoboArena Reward"], base_stat_gain: "+0.075 Speed +0.075 Power +0.075 Strength +2 Intelligence +2 Begging 100,000 Respect +1 Level", effect: "" },
                    { name: "Self Immolation", cost: { type: "mixed", text: "Awake+15CW" }, location: "Mixer", ingredients: ["Aunt Flo Amaretto", "Crudweiser", "Everclear", "Fire"], base_stat_gain: "+0.200 Power +0.075 Strength", effect: "On Fire" },
                    { name: "Sludge", cost: { type: "mixed", text: "Made from mixing drinks that do not form a proper mixed drink" }, location: "Mixer", ingredients: ["Made from mixing drinks that do not form a proper mixed drink"], base_stat_gain: "", effect: "Collect 1000 to unlock a new wish" },
                    { name: "Sorrowful Penguin", cost: { type: "mixed", text: "Awake+10CW+$50" }, location: "Mixer", ingredients: ["Ice", "Jolly Rancher", "Zima Light"], base_stat_gain: "", effect: "Sorrowful" },
                    { name: "Ten Foot Drop", cost: { type: "mixed", text: "18CW+$400" }, location: "Mixer", ingredients: ["Octuple Sec", "Purple Pigeon Vodka", "Sweet & Sour"], base_stat_gain: "", effect: "You lose all your life." },
                    { name: "The Long Walk", cost: { type: "mixed", text: "36CW" }, location: "Mixer", ingredients: ["Montreal Bourbon", "Mutton Chop Scotch", "Wild Terrier Whiskey"], base_stat_gain: "", effect: "Shoegazer" },
                    { name: "Time Traveler", cost: { type: "mixed", text: "Awake+12CW+$500" }, location: "Mixer", ingredients: ["Brandy Brand Brandy", "Dry Ice", "Jolly Rancher", "Orange Juice"], base_stat_gain: "+0.250 Speed", effect: "Time Displacement" },
                    { name: "Transylvania Slammer", cost: { type: "mixed", text: "Awake+18CW+$50" }, location: "Mixer", ingredients: ["Albino Ale", "Aunt Flo Amaretto", "Jagermeister", "Bath Salts", "Ice"], base_stat_gain: "+0.125 Speed +0.125 Power", effect: "Glampire" }
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

const FoodHelper = {
    init: function() {
        const settings = Utils.getSettings();
        if (settings?.FoodHelper?.enabled === false) return;

        // Ensure we are either on the food page or living area page
        const urlParams = new URLSearchParams(window.location.search);
        const cmd = urlParams.get('cmd');
        const isFoodMenu = cmd === 'food';
        const isLivingArea = !cmd; // Matches null or ""

        if (!isFoodMenu && !isLivingArea) return;

        this.observeFood();
    },

    observeFood: function() {
        const bindButtons = () => {
            const throwBtn = document.getElementById('throw');
            if (!throwBtn || throwBtn.hasAttribute('data-fh-injected')) return;

            throwBtn.setAttribute('data-fh-injected', 'true');

            // inject "Select Crap" and "Mark as Crap" buttons next to the throw button
            const btnMark = document.createElement('input');
            btnMark.type = 'button';
            btnMark.value = 'Mark as Crap';
            btnMark.style.marginLeft = '10px';
            btnMark.onclick = (e) => {
                e.preventDefault();
                this.markAsCrap(e.target);
            };

            const btnSelect = document.createElement('input');
            btnSelect.type = 'button';
            btnSelect.value = 'Select Crap';
            btnSelect.style.marginLeft = '10px';
            btnSelect.onclick = (e) => {
                e.preventDefault();
                this.selectCrap();
            };

            // Insert after throwBtn (in reverse order because we rely on nextSibling)
            throwBtn.parentNode.insertBefore(btnMark, throwBtn.nextSibling);
            throwBtn.parentNode.insertBefore(btnSelect, throwBtn.nextSibling);
        };

        let timeout = null;
        const observer = new MutationObserver(() => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(bindButtons, 250);
        });

        // The UI might be inside a #foodTab container (living area) or the main document body
        const targetNode = document.getElementById('foodTab') ? document.getElementById('foodTab') : document.body;
        if (targetNode) {
            observer.observe(targetNode, { childList: true, subtree: true });
        }

        // Initial run
        bindButtons();
    },

    getFoodNameFromCheckbox: function(checkbox) {
        // The food name is usually in the title of the image within the next <a> element
        const nextLink = checkbox.nextElementSibling;
        if (nextLink && nextLink.tagName === 'A') {
            const img = nextLink.querySelector('img');
            if (img && img.title) {
                return img.title.trim();
            }
            // Fallback: extract text directly
            return nextLink.innerText.trim();
        }
        return null;
    },

    selectCrap: function() {
        const crapList = JSON.parse(localStorage.getItem('hw_helper_food_crap') || '[]');
        const checkboxes = document.querySelectorAll('.checkMe');

        checkboxes.forEach(cb => {
            const foodName = this.getFoodNameFromCheckbox(cb);
            if (foodName && crapList.includes(foodName)) {
                cb.checked = true;
            } else {
                cb.checked = false;
            }
        });
    },

    markAsCrap: function(btn) {
        const checkboxes = document.querySelectorAll('.checkMe');
        let crapList = JSON.parse(localStorage.getItem('hw_helper_food_crap') || '[]');

        // Track the desired state of foods currently visible on the page
        const presentFoods = {};

        checkboxes.forEach(cb => {
            const foodName = this.getFoodNameFromCheckbox(cb);
            if (foodName) {
                if (cb.checked) {
                    presentFoods[foodName] = true; // At least one is checked, keep it
                } else if (presentFoods[foodName] === undefined) {
                    presentFoods[foodName] = false; // Seen but not checked (yet)
                }
            }
        });

        // Update the crapList based on the visible foods' states
        Object.keys(presentFoods).forEach(foodName => {
            if (presentFoods[foodName]) {
                if (!crapList.includes(foodName)) {
                    crapList.push(foodName);
                }
            } else {
                crapList = crapList.filter(name => name !== foodName);
            }
        });

        localStorage.setItem('hw_helper_food_crap', JSON.stringify(crapList));
        if (btn) {
            btn.value = `✅ Updated Crap!`;
            setTimeout(() => { btn.value = 'Mark as Crap'; }, 3000);
        }
    }
};

const GangLoansHelper = {
    init: function() {
        if (!window.location.search.includes('cmd=gang2') || !window.location.search.includes('do=loans')) return;

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        console.log('[Hobo Helper] Initializing GangLoansHelper');
        this.renderPanel(contentArea);
    },

    renderPanel: function(container) {
        const savedPosts = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
        const postKeys = Object.keys(savedPosts);

        const panel = document.createElement('div');
        panel.style.cssText = 'border: 2px solid #336699; background: #eef5ff; padding: 15px; margin-bottom: 20px; border-radius: 5px; color: black; font-size: 13px; line-height: 1.4;';

        const header = document.createElement('h3');
        header.style.cssText = 'margin: 0 0 10px 0; border-bottom: 1px solid #336699; padding-bottom: 5px; font-weight: bold; font-size: 16px; display: flex; justify-content: space-between; align-items: center;';
        header.innerHTML = `
            <span>Saved Gang Posts & Payments</span>
            <span style="font-size: 12px; font-weight: normal; cursor: pointer; color: #ff0000; text-decoration: underline;" id="hw-clear-all-gang-posts">[Clear All]</span>
        `;

        panel.appendChild(header);

        if (postKeys.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.style.fontStyle = 'italic';
            emptyMsg.style.color = '#555';
            emptyMsg.innerText = 'No saved gang posts or payments found.';
            panel.appendChild(emptyMsg);
        } else {
            const listContainer = document.createElement('div');
            listContainer.style.display = 'flex';
            listContainer.style.flexDirection = 'column';
            listContainer.style.gap = '10px';

            postKeys.forEach(topic => {
                const data = savedPosts[topic];
                const hobos = data.hobos || [];
                const payments = data.paymentsToHobos || [];
                
                const savedBulkAmt = data.bulkAmount || '';
                const savedBulkMemo = data.bulkMemo || '';

                const item = document.createElement('div');
                item.style.cssText = 'border: 1px solid #b3d4fc; background: #ffffff; padding: 10px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);';

                const safeTopicId = topic.replace(/[^a-zA-Z0-9]/g, '');

                let exportBtnsHtml = '';
                if (hobos.length > 0) {
                    exportBtnsHtml += `<button class="hw-export-repliers" data-topic="${topic}" data-ctrl="${safeTopicId}" style="padding: 3px 8px; cursor: pointer; background: #e6f3ff; border: 1px solid #99c2ff; border-radius: 3px; font-size: 11px; color: #0055aa; margin-right: 5px;">Export Saved Repliers</button>`;
                }
                if (payments.length > 0) {
                    exportBtnsHtml += `<button class="hw-export-payments" data-topic="${topic}" style="padding: 3px 8px; cursor: pointer; background: #e6f3ff; border: 1px solid #99c2ff; border-radius: 3px; font-size: 11px; color: #0055aa; margin-right: 5px;">Export Payments</button>`;
                }

                const titleRow = document.createElement('div');
                titleRow.style.cssText = 'font-weight: bold; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; background: #f7faff; padding: 5px 8px; border-radius: 3px; border: 1px solid #e1eeff;';
                titleRow.innerHTML = `
                    <span style="font-size: 14px; color: #003366;">📝 Topic: ${topic}</span>
                    <div style="display:flex; align-items:center;">
                        ${exportBtnsHtml}
                        <button class="hw-delete-topic" data-topic="${topic}" style="padding: 3px 8px; cursor: pointer; background: #ffe6e6; border: 1px solid #ff9999; border-radius: 3px; font-size: 11px; color: #cc0000;">Remove Topic</button>
                    </div>
                `;

                item.appendChild(titleRow);

                if (hobos.length === 0 && payments.length === 0) {
                    const emptyRecord = document.createElement('div');
                    emptyRecord.style.fontStyle = 'italic';
                    emptyRecord.style.color = '#999';
                    emptyRecord.innerText = 'Empty record.';
                    item.appendChild(emptyRecord);
                }

                if (hobos.length > 0) {
                    const hobosDiv = document.createElement('div');
                    hobosDiv.style.cssText = 'margin-bottom: 12px; font-size: 12px;';
                    
                    let hobosHtml = `
                        <div style="font-weight: bold; color: #333; margin-bottom: 3px;">Saved Repliers (Bulk Payment Workflow - ${hobos.length} Repliers):</div>
                        <div style="margin-bottom: 5px; padding: 5px; background: #eef5ff; border: 1px solid #b3d4fc; border-radius: 3px; display: flex; align-items: center; gap: 10px;">
                            <span><strong>Bulk Amount:</strong> <input type="text" id="amt-${safeTopicId}" value="${savedBulkAmt}" placeholder="e.g. 5000000" style="width: 100px;"></span>
                            <span><strong>Bulk Memo:</strong> <input type="text" id="memo-${safeTopicId}" value="${savedBulkMemo}" placeholder="Optional" maxlength="60" style="width: 200px;"></span>
                            <button class="hw-save-bulk-details" data-topic="${topic}" data-ctrl="${safeTopicId}" style="cursor:pointer; background:#e6f3ff; border:1px solid #99c2ff; border-radius:3px; padding:2px 8px; font-weight:bold; color:#0055aa;">Save</button>
                        </div>
                        <div style="max-height: 150px; overflow-y: auto; border: 1px solid #e0e0e0; padding: 6px; background: #fcfcfc; border-radius: 3px; line-height: 1.6;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tbody>
                    `;

                    hobos.forEach((h, hIndex) => {
                        const isCompleted = h.completed;
                        const rowBg = isCompleted ? '#e6ffe6' : 'transparent';
                        hobosHtml += `
                            <tr style="border-bottom: 1px solid #eee; background: ${rowBg};">
                                <td style="padding: 4px;">
                                    <a href="game.php?sr=${this.getSr()}&cmd=player&ID=${h.id}" target="_blank" style="text-decoration: none; color: #0055aa; font-weight: bold;">${h.name}</a> 
                                    <span style="color: #666; font-size: 11px;">[ID: ${h.id}]</span>
                                </td>
                                <td style="padding: 4px; text-align: right; white-space: nowrap;">
                                    <button class="hw-insert-bulk" data-id="${h.id}" data-ctrl="${safeTopicId}" style="cursor:pointer; background:#e6f3ff; border:1px solid #99c2ff; border-radius:3px; padding:3px 8px; margin-right:4px;">Insert</button>
                                    <button class="hw-complete-bulk" data-topic="${topic}" data-index="${hIndex}" style="cursor:pointer; background:#e6ffe6; border:1px solid #66cc66; border-radius:3px; padding:3px 8px; margin-right:4px;">${isCompleted ? 'Undo' : 'Done'}</button>
                                    <button class="hw-remove-bulk" data-topic="${topic}" data-index="${hIndex}" style="cursor:pointer; background:#ffe6e6; border:1px solid #ff9999; border-radius:3px; padding:3px 8px;">Remove</button>
                                </td>
                            </tr>
                        `;
                    });

                    hobosHtml += `
                                </tbody>
                            </table>
                        </div>
                    `;
                    hobosDiv.innerHTML = hobosHtml;
                    item.appendChild(hobosDiv);
                }

                if (payments.length > 0) {
                    const payDiv = document.createElement('div');
                    payDiv.style.cssText = 'font-size: 12px;';

                    let payHtml = `
                        <div style="font-weight: bold; color: #333; margin-bottom: 3px;">Payments to Action (${payments.length}):</div>
                        <div style="overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse; margin-top: 2px;">
                                <thead>
                                    <tr style="background: #eef5ff; text-align: left; border-bottom: 2px solid #b3d4fc;">
                                        <th style="padding: 6px; border: 1px solid #d9e8fa; white-space: nowrap;">ID</th>
                                        <th style="padding: 6px; border: 1px solid #d9e8fa; white-space: nowrap;">Name</th>
                                        <th style="padding: 6px; border: 1px solid #d9e8fa; white-space: nowrap;">Amount</th>
                                        <th style="padding: 6px; border: 1px solid #d9e8fa; width: 100%;">Description</th>
                                        <th style="padding: 6px; border: 1px solid #d9e8fa; white-space: nowrap;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                    `;

                    payments.forEach((p, pIndex) => {
                        const hoboId = p.hoboId || p.id || '';
                        const hoboName = p.hoboName || p.name || '';
                        const isCompleted = p.completed;
                        const rowBg = isCompleted ? '#e6ffe6' : '#fff';
                        payHtml += `
                            <tr style="background: ${rowBg}; border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 5px; border: 1px solid #ececec;"><a href="game.php?sr=${this.getSr()}&cmd=player&ID=${hoboId}" target="_blank" style="color:#0055aa;text-decoration:none;">${hoboId}</a></td>
                                <td style="padding: 5px; border: 1px solid #ececec;">${hoboName}</td>
                                <td style="padding: 5px; border: 1px solid #ececec; font-family: monospace; font-size: 13px;">${p.amount || ''}</td>
                                <td style="padding: 5px; border: 1px solid #ececec;">${p.description || ''}</td>
                                <td style="padding: 5px; border: 1px solid #ececec; text-align: center; white-space: nowrap;">
                                    <button class="hw-insert-payment" data-id="${hoboId}" data-amount="${p.amount || ''}" data-desc="${p.description || ''}" style="cursor:pointer; background:#e6f3ff; border:1px solid #99c2ff; border-radius:3px; padding:3px 8px; margin-right:6px;">Insert</button>
                                    <button class="hw-complete-payment" data-topic="${topic}" data-index="${pIndex}" style="cursor:pointer; background:#e6ffe6; border:1px solid #66cc66; border-radius:3px; padding:3px 8px; margin-right:6px;">${isCompleted ? 'Undo' : 'Done'}</button>
                                    <button class="hw-remove-payment" data-topic="${topic}" data-index="${pIndex}" style="cursor:pointer; background:#ffe6e6; border:1px solid #ff9999; border-radius:3px; padding:3px 8px;">Remove</button>
                                </td>
                            </tr>
                        `;
                    });

                    payHtml += `
                                </tbody>
                            </table>
                        </div>
                    `;
                    payDiv.innerHTML = payHtml;
                    item.appendChild(payDiv);
                }

                listContainer.appendChild(item);
            });

            panel.appendChild(listContainer);
        }

        container.insertBefore(panel, container.firstChild);

        // Bind events
        const clearAllBtn = panel.querySelector('#hw-clear-all-gang-posts');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                if (confirm('Are you absolutely sure you want to clear all saved gang posts and payment data? This cannot be undone.')) {
                    localStorage.removeItem('hw_helper_gang_posts');
                    window.location.reload();
                }
            });
        }

        const deleteBtns = panel.querySelectorAll('.hw-delete-topic');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTopic = e.target.getAttribute('data-topic');
                if (confirm(`Remove saved data for topic "${targetTopic}"?`)) {
                    let d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                    delete d[targetTopic];
                    localStorage.setItem('hw_helper_gang_posts', JSON.stringify(d));

                    // re-render by reloading
                    window.location.reload();
                }
            });
        });

        panel.querySelectorAll('.hw-save-bulk-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                const ctrlId = e.target.getAttribute('data-ctrl');
                const bulkAmtInput = document.getElementById('amt-' + ctrlId);
                const bulkMemoInput = document.getElementById('memo-' + ctrlId);
                
                let d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                if (d[topic]) {
                    d[topic].bulkAmount = bulkAmtInput ? bulkAmtInput.value : '';
                    d[topic].bulkMemo = bulkMemoInput ? bulkMemoInput.value.substring(0, 60) : '';
                    localStorage.setItem('hw_helper_gang_posts', JSON.stringify(d));
                    
                    const oldText = e.target.innerText;
                    e.target.innerText = 'Saved!';
                    setTimeout(() => { e.target.innerText = oldText; }, 2000);
                }
            });
        });

        const insertBtns = panel.querySelectorAll('.hw-insert-payment');
        insertBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hoboField = document.getElementById('hobo');
                const amtField = document.getElementById('addAmt');
                const memoField = document.querySelector('input[name="l_memo"]');

                if (hoboField) hoboField.value = e.target.getAttribute('data-id');
                if (amtField) amtField.value = e.target.getAttribute('data-amount').replace(/[^0-9.]/g, ''); // strip non-numeric just in case
                if (memoField) memoField.value = e.target.getAttribute('data-desc').substring(0, 60);

                e.target.innerText = 'Inserted';
                window.scrollTo(0, document.body.scrollHeight);
            });
        });

        const removePaymentBtns = panel.querySelectorAll('.hw-remove-payment');
        removePaymentBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                const index = parseInt(e.target.getAttribute('data-index'), 10);

                let d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                if (d[topic] && d[topic].paymentsToHobos) {
                    d[topic].paymentsToHobos.splice(index, 1);
                    localStorage.setItem('hw_helper_gang_posts', JSON.stringify(d));
                    window.location.reload();
                }
            });
        });

        const completePaymentBtns = panel.querySelectorAll('.hw-complete-payment');
        completePaymentBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                const index = parseInt(e.target.getAttribute('data-index'), 10);

                let d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                if (d[topic] && d[topic].paymentsToHobos) {
                    d[topic].paymentsToHobos[index].completed = !d[topic].paymentsToHobos[index].completed;
                    localStorage.setItem('hw_helper_gang_posts', JSON.stringify(d));
                    window.location.reload();
                }
            });
        });

        // BIND BULK REPLIERS EVENTS
        panel.querySelectorAll('.hw-insert-bulk').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const ctrlId = e.target.getAttribute('data-ctrl');
                const bulkAmtInput = document.getElementById('amt-' + ctrlId);
                const bulkMemoInput = document.getElementById('memo-' + ctrlId);
                
                const hoboField = document.getElementById('hobo');
                const amtField = document.getElementById('addAmt');
                const memoField = document.querySelector('input[name="l_memo"]');

                if (hoboField) hoboField.value = e.target.getAttribute('data-id');
                if (amtField && bulkAmtInput) amtField.value = bulkAmtInput.value.replace(/[^0-9.]/g, ''); 
                if (memoField && bulkMemoInput) memoField.value = bulkMemoInput.value.substring(0, 60);

                e.target.innerText = 'Inserted';
                window.scrollTo(0, document.body.scrollHeight);
            });
        });

        panel.querySelectorAll('.hw-complete-bulk').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                const index = parseInt(e.target.getAttribute('data-index'), 10);

                let d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                if (d[topic] && d[topic].hobos) {
                    d[topic].hobos[index].completed = !d[topic].hobos[index].completed;
                    localStorage.setItem('hw_helper_gang_posts', JSON.stringify(d));
                    window.location.reload();
                }
            });
        });

        panel.querySelectorAll('.hw-remove-bulk').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                const index = parseInt(e.target.getAttribute('data-index'), 10);

                let d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                if (d[topic] && d[topic].hobos) {
                    d[topic].hobos.splice(index, 1);
                    localStorage.setItem('hw_helper_gang_posts', JSON.stringify(d));
                    window.location.reload();
                }
            });
        });

        // BIND EXPORTS
        const copyToCb = (text, btn) => {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
                const oldText = btn.innerText;
                btn.innerText = 'Copied!';
                setTimeout(() => { btn.innerText = oldText; }, 2000);
            } catch (e) {
                alert("Clipboard export failed. Here is your text:\n\n" + text);
            }
            document.body.removeChild(ta);
        };

        panel.querySelectorAll('.hw-export-repliers').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                const ctrlId = e.target.getAttribute('data-ctrl');
                const d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                const hobos = d[topic]?.hobos || [];
                
                const bulkInput = document.getElementById('amt-' + ctrlId);
                const memoInput = document.getElementById('memo-' + ctrlId);
                
                const amtRaw = bulkInput ? bulkInput.value.replace(/[^0-9]/g, '') : '';
                const bulkAmt = parseInt(amtRaw, 10) || 0;
                const total = hobos.length * bulkAmt;
                
                const memoPrefix = memoInput && memoInput.value.trim() ? `${memoInput.value.trim()} - ` : '';
                const formatted = total > 0 ? total.toLocaleString() : '0';
                const text = `${memoPrefix}Total: ${hobos.length} Hobos - $${formatted}`;
                
                copyToCb(text, e.target);
            });
        });

        panel.querySelectorAll('.hw-export-payments').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                const d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                const payments = d[topic]?.paymentsToHobos || [];
                
                let parts = payments.map(p => {
                    const amtParts = String(p.amount || '').replace(/[^0-9]/g, '');
                    const amtInt = parseInt(amtParts, 10) || 0;
                    const formatted = amtInt > 0 ? amtInt.toLocaleString() : '0';
                    return `[hoboname=${p.hoboId || p.id}] - ${p.description || 'No description'} - $${formatted}`;
                });
                
                copyToCb(parts.join('\n'), e.target);
            });
        });

    },

    getSr: function() {
        const match = window.location.search.match(/sr=(\d+)/);
        return match ? match[1] : '';
    }
};

const HitlistHelper = {
    init: function() {
        if (!window.location.search.includes('cmd=battle') || !window.location.search.includes('do=phlist')) return;

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        const settings = Utils.getSettings();
        if (settings?.HitlistHelper?.enabled === false) return;

        console.log('[Hobo Helper] Initializing HitlistHelper');

        if (settings?.HitlistHelper_HighlightOnline !== false) {
            this.highlightOnlinePlayers();
        }
    },

    highlightOnlinePlayers: function() {
        const onlineImages = document.querySelectorAll('img[src*="online_now"]');
        onlineImages.forEach(img => {
            const tr = img.closest('tr');
            if (tr) {
                const tds = tr.querySelectorAll('td');
                tds.forEach(td => {
                    td.style.backgroundColor = '#d4edda'; // Light green highlight
                });
            }
        });
    }
};

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

                                // Highlight drinks in the shop that are on the shopping list
                                const costs = contentArea.querySelectorAll('.shopCost');
                                costs.forEach(costDiv => {
                                    const td = costDiv.parentElement;
                                    if (!td) return;

                                    const textContent = td.textContent.trim();
                                    let isMatch = false;
                                    for (let i = 0; i < items.length; i++) {
                                        if (textContent.startsWith(items[i])) {
                                            isMatch = true;
                                            break;
                                        }
                                    }

                                    if (isMatch) {
                                        const tr = td.closest('tr');
                                        if (tr) {
                                            const img = tr.querySelector('img.shopimg') || tr.querySelector('img');
                                            if (img && img.parentElement && img.parentElement.tagName === 'TD') {
                                                img.parentElement.style.backgroundColor = '#fff3cd';
                                                img.parentElement.style.borderRadius = '5px';
                                            } else {
                                                td.style.backgroundColor = '#fff3cd';
                                                td.style.borderRadius = '5px';
                                            }
                                        }
                                    }
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
        
        const hoboAgeDays = Utils.getHoboAgeInDays();
        if (hoboAgeDays !== null) {
            localStorage.setItem('hw_helper_hobo_age_days', hoboAgeDays);
        }

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
        const cmd = urlParams.get('cmd');
        if (cmd) return;

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
                today: findValue('Gained Today:') !== null ? findValue('Gained Today:') : 0,
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
        const cmd = urlParams.get('cmd');
        if (cmd) return;

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

const LockoutHelper = {
    init: function() {
        // The game auto-locks during the 12-hour reset.
        // We detect this specific screen via document title or body text.
        const titleText = document.title || "";
        const bodyText = document.body.innerText || "";
        const isLockoutScreen = titleText.includes("Closed for daily maintenance") || 
                                bodyText.includes("Temporary Lockout");

        if (!isLockoutScreen) return;

        console.log("LockoutHelper: Detected game lockout screen.");

        const savedSettings = Utils.getSettings();

        if (savedSettings['LockoutHelper_ShowChangelog'] !== false) {
            this.renderChangelog();
        }
    },

    renderChangelog: function() {
        if (typeof Modules === 'undefined' || typeof Modules.ChangelogData === 'undefined' || !Modules.ChangelogData.changes) {
            console.error("LockoutHelper: ChangelogData is missing. Cannot display changelog.");
            return;
        }

        const container = document.createElement("div");
        container.id = "hw-helper-changelog-container";
        // Styling matches "The Future" layout aesthetic broadly, but forces visibility
        container.style.cssText = "margin: 20px auto; padding: 15px; max-width: 600px; background-color: #f9f9f9; border: 1px dashed #777; border-radius: 8px; text-align: left; font-family: Tahoma, Arial, sans-serif; color: #333; box-shadow: 0px 4px 6px rgba(0,0,0,0.1);";

        const title = document.createElement("h2");
        title.innerText = "Hobo Helper - Recent Updates";
        title.style.margin = "0 0 10px 0";
        title.style.borderBottom = "1px solid #ccc";
        title.style.paddingBottom = "5px";
        title.style.fontSize = "16px";
        container.appendChild(title);

        Modules.ChangelogData.changes.forEach(release => {
            const releaseBlock = document.createElement("div");
            releaseBlock.style.marginTop = "10px";

            const versionHeader = document.createElement("div");
            versionHeader.innerHTML = `<strong>v${release.version}</strong> <span style="font-size: 11px; color: #666;">(${release.date})</span>`;
            versionHeader.style.fontSize = "14px";
            releaseBlock.appendChild(versionHeader);

            const changesList = document.createElement("ul");
            changesList.style.margin = "5px 0 0 0";
            changesList.style.paddingLeft = "20px";
            changesList.style.fontSize = "12px";

            if (release.notes && Array.isArray(release.notes)) {
                release.notes.forEach(noteText => {
                    const li = document.createElement("li");
                    li.style.marginBottom = "3px";
                    // Simple markdown parsing for inline code blocks (backticks)
                    let formattedChange = noteText.replace(/`([^`]+)`/g, '<code style="background-color: #eaeaea; padding: 1px 4px; border-radius: 3px; font-family: monospace;">$1</code>');
                    // Add bold prefix for the type if not present
                    formattedChange = `<strong>${release.type}:</strong> ` + formattedChange;
                    li.innerHTML = formattedChange;
                    changesList.appendChild(li);
                });
            }

            releaseBlock.appendChild(changesList);
            container.appendChild(releaseBlock);
        });

        const note = document.createElement("div");
        note.innerHTML = "<em>You can disable this popup in the Hobo Helper Settings on the Preferences page.</em>";
        note.style.fontSize = "10px";
        note.style.color = "#888";
        note.style.marginTop = "15px";
        note.style.textAlign = "center";
        container.appendChild(note);

        // Inject below the main lockout message content.
        // The lockout screen content lives inside a white table data cell.
        const targetTd = document.querySelector('td[bgcolor="#FFFFFF"]');

        if (targetTd) {
            // Append it nicely inside the white background area
            targetTd.appendChild(container);
        } else {
            // Fallback
            const centerWrapper = document.createElement('div');
            centerWrapper.align = 'center';
            centerWrapper.appendChild(container);
            document.body.appendChild(centerWrapper);
        }
    }
};

const MessageBoardHelper = {
    init: function() {
        if (!Utils.isCurrentPage('cmd=gathering')) return;

        const settings = Utils.getSettings();
        if (settings?.MessageBoardHelper?.enabled === false) return;

        this.initMessageBoardFeatures(settings);

        if (Utils.isCurrentPage('do=vpost')) {
            this.initGangPostFeatures(settings);
        }
    },

    initMessageBoardFeatures: function(settings) {
        this.enhanceMessageEditor(settings);
    },

    enhanceMessageEditor: function(settings) {
        const messageArea = document.querySelector('textarea[name="t_message"]');
        if (!messageArea) return;

        // Ctrl + Enter to submit
        if (settings?.MessageBoardHelper_CtrlEnter !== false) {
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
        }

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
    },

    initGangPostFeatures: function(settings) {
        let topicName = '';
        const titleEl = document.getElementById('thread-topic');
        if (titleEl) {
            topicName = titleEl.textContent.trim();
        } else {
            const pageText = document.body.innerText || "";
            const breadcrumbMatch = pageText.match(/Board Selection\s*\/\s*Gang Board\s*\/\s*Topic:\s*(.*)/i);
            if (!breadcrumbMatch) return;
            topicName = breadcrumbMatch[1].split(/(\[Page:|Jump to Bottom|Gang:)/)[0].trim();
        }

        // Check if the user is Gang Staff
        const topOps = document.getElementById('topOps');
        const isGangStaff = topOps && (topOps.querySelector('a[title="Toggle Lock"]') || topOps.querySelector('a[title="Delete"]'));

        if (!isGangStaff) return;

        this.addSaveRepliersButton(topicName);
        this.addPaymentButtons(topicName);
    },

    addSaveRepliersButton: function(topicName) {
        // Find "Now Viewing Topic & Replies" text nodes
        const headerNodes = Array.from(document.querySelectorAll('b, strong, th, td, div, font, span')).filter(el => el.textContent.trim() === 'Now Viewing Topic & Replies');
        if (headerNodes.length === 0) return;
        
        // Grab the deepest node to inject our button right above it
        const headerToInjectAbove = headerNodes[headerNodes.length - 1]; 
        const tableNode = headerToInjectAbove.closest('table');

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = '💾 Save Repliers List';
        btn.title = 'Collects the names of everyone who has replied to this post';
        btn.style.cssText = 'margin-bottom: 8px; padding: 5px 12px; cursor: pointer; font-weight: bold; background: #eee; border: 1px solid #aaa; border-radius: 3px; color: #333; font-family: Tahoma, sans-serif; font-size: 11px; display: block;';
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const hoboMap = new Map();
            let isFirstPost = true;
            
            const posts = document.querySelectorAll('tr[id^="tr_post_"]');

            posts.forEach(post => {
                if (isFirstPost) {
                    isFirstPost = false; // Skip the original topic post
                    return;
                }

                const firstTd = post.querySelector('td');
                if (!firstTd) return;

                const link = firstTd.querySelector('a[href*="cmd=player&ID="]');
                if (!link) return;

                const nameNode = link.querySelector('.player-name') || link;
                const idMatch = link.href.match(/ID=(\d+)/i);
                if (idMatch) {
                    const id = idMatch[1];
                    const name = nameNode.textContent.trim();
                    if (name && !hoboMap.has(id)) {
                        hoboMap.set(id, { id: id, name: name });
                    }
                }
            });
            
            const hoboList = Array.from(hoboMap.values());
            
            const savedPosts = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
            savedPosts[topicName] = { 
                timestamp: Date.now(),
                topic: topicName,
                totalHobos: hoboList.length,
                hobos: hoboList 
            };
            localStorage.setItem('hw_helper_gang_posts', JSON.stringify(savedPosts));
            
            console.log(`[Hobo Helper] Gathered gang replies for topic: "${topicName}"`, savedPosts[topicName]);
            
            btn.textContent = `✅ Saved ${hoboList.length} Unique Hobos!`;
            setTimeout(() => { btn.textContent = '💾 Save Repliers List'; }, 3000);
        });

        // Insert just above the header text's table container and replace preceding <br> tags
        if (tableNode) {
            // Traverse backwards to remove empty text nodes and <br> tags
            let prev = tableNode.previousSibling;
            while (prev && (prev.nodeName === 'BR' || (prev.nodeType === 3 && prev.nodeValue.trim() === ''))) {
                const toRemove = prev;
                prev = prev.previousSibling;
                toRemove.parentNode.removeChild(toRemove);
            }
            tableNode.parentNode.insertBefore(btn, tableNode);
        } else {
            headerToInjectAbove.parentNode.insertBefore(btn, headerToInjectAbove);
        }
    },

    addPaymentButtons: function(topicName) {
        const posts = document.querySelectorAll('tr[id^="tr_post_"]');
        posts.forEach(post => {
            const tds = post.querySelectorAll('td');
            if (tds.length >= 2) {
                const firstTd = tds[0];
                const secondTd = tds[1];
                const postId = post.id.replace('tr_post_', '');

                const btn = document.createElement('input');
                btn.type = 'button';
                btn.value = 'Add Payment';
                btn.style.display = 'block';
                btn.style.margin = '15px auto 5px auto';
                btn.style.fontSize = '12px';
                btn.style.padding = '4px 10px';
                btn.style.fontWeight = 'bold';
                btn.style.cursor = 'pointer';
                btn.setAttribute('data-post-id', postId);

                btn.addEventListener('click', () => {
                    const nameNode = firstTd.querySelector('.player-name') || firstTd.querySelector('a[href*="cmd=player"]');
                    const hoboName = nameNode ? nameNode.textContent.trim() : '';

                    let hoboId = '';
                    const playerLink = firstTd.querySelector('a[href*="cmd=player&ID="]');
                    if (playerLink) {
                        const idMatch = playerLink.href.match(/ID=(\d+)/i);
                        if (idMatch) hoboId = idMatch[1];
                    }
                    if (!hoboId) {
                        const idTextMatch = firstTd.innerText.match(/ID:\s*(\d+)/i);
                        if (idTextMatch) hoboId = idTextMatch[1];
                    }

                    let parsedAmount = '';
                    const messageText = secondTd.innerText || "";
                    const amountRegex = /(?:\$([\d,]+(?:\.\d+)?)\s*(k|m|mil|mill|million)?\b)|(?:([\d,]+(?:\.\d+)?)\s*(k|m|mil|mill|million)\b)/i;
                    const dollarMatch = messageText.match(amountRegex);
                    if (dollarMatch) {
                        let amountStr = dollarMatch[1] || dollarMatch[3];
                        let multStr = (dollarMatch[2] || dollarMatch[4] || "").toLowerCase();
                        let num = parseFloat(amountStr.replace(/,/g, ''));
                        if (['m', 'mil', 'mill', 'million'].includes(multStr)) {
                            num *= 1000000;
                        } else if (multStr === 'k') {
                            num *= 1000;
                        }
                        parsedAmount = '$' + Math.round(num).toLocaleString();
                    }

                    let panel = document.getElementById('payment-panel-' + postId);
                    if (panel) {
                        panel.style.display = 'block';
                        return;
                    }

                    secondTd.style.position = 'relative';

                    panel = document.createElement('div');
                    panel.id = 'payment-panel-' + postId;
                    panel.style.position = 'absolute';
                    panel.style.top = '10px';
                    panel.style.right = '-310px';
                    panel.style.width = '260px';
                    panel.style.backgroundColor = '#fdfdfd';
                    panel.style.border = '2px solid #555';
                    panel.style.padding = '10px';
                    panel.style.boxShadow = '2px 2px 8px rgba(0,0,0,0.2)';
                    panel.style.zIndex = '1000';
                    panel.style.fontFamily = 'Tahoma, sans-serif';
                    panel.style.fontSize = '12px';
                    panel.style.color = '#333';

                    panel.innerHTML = `
                        <div style="font-weight:bold; margin-bottom:10px; border-bottom:1px solid #ccc; padding-bottom:5px;">Add Payment</div>
                        <div style="margin-bottom:5px;">
                            <label style="display:inline-block; width:80px; font-weight:bold;">Hobo Name:</label>
                            <input type="text" id="pay-name-${postId}" value="${hoboName}" style="width:140px; font-size:11px;" />
                        </div>
                        <div style="margin-bottom:5px;">
                            <label style="display:inline-block; width:80px; font-weight:bold;">Hobo ID:</label>
                            <input type="text" id="pay-id-${postId}" value="${hoboId}" style="width:140px; font-size:11px;" />
                        </div>
                        <div style="margin-bottom:5px;">
                            <label style="display:inline-block; width:80px; font-weight:bold;">Description:</label>
                            <input type="text" id="pay-desc-${postId}" style="width:140px; font-size:11px;" />
                        </div>
                        <div style="margin-bottom:10px;">
                            <label style="display:inline-block; width:80px; font-weight:bold;">Amount:</label>
                            <input type="text" id="pay-amt-${postId}" value="${parsedAmount}" style="width:140px; font-size:11px;" />
                        </div>
                        <div style="text-align:right;">
                            <button type="button" id="pay-save-${postId}" style="cursor:pointer; font-weight:bold; margin-right:5px; padding:2px 8px; background:#eee; border:1px solid #aaa; border-radius:3px;">Save</button>
                            <button type="button" id="pay-cancel-${postId}" style="cursor:pointer; padding:2px 8px; background:#eee; border:1px solid #aaa; border-radius:3px;">Cancel</button>
                        </div>
                    `;

                    secondTd.appendChild(panel);

                    document.getElementById('pay-save-' + postId).addEventListener('click', () => {
                        const hoboNameVal = document.getElementById(`pay-name-${postId}`).value.trim();
                        const hoboIdVal = document.getElementById(`pay-id-${postId}`).value.trim();
                        const descVal = document.getElementById(`pay-desc-${postId}`).value.trim();
                        const amtVal = document.getElementById(`pay-amt-${postId}`).value.trim();

                        const savedPosts = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');

                        if (!savedPosts[topicName]) {
                            savedPosts[topicName] = {
                                timestamp: Date.now(),
                                topic: topicName,
                                totalHobos: 0,
                                hobos: []
                            };
                        }
                        if (!savedPosts[topicName].paymentsToHobos) {
                            savedPosts[topicName].paymentsToHobos = [];
                        }

                        savedPosts[topicName].paymentsToHobos.push({
                            postId: postId,
                            hoboName: hoboNameVal,
                            hoboId: hoboIdVal,
                            description: descVal,
                            amount: amtVal,
                            timestamp: Date.now()
                        });

                        localStorage.setItem('hw_helper_gang_posts', JSON.stringify(savedPosts));

                        // Visual feedback
                        btn.value = 'Added ✅';
                        btn.style.backgroundColor = '#d4edda';
                        btn.style.borderColor = '#c3e6cb';

                        panel.style.display = 'none';
                    });

                    document.getElementById('pay-cancel-' + postId).addEventListener('click', () => {
                        panel.style.display = 'none';
                    });
                });

                // Remove trailing <br> if it exists at the bottom of the td
                if (firstTd.lastElementChild && firstTd.lastElementChild.tagName === 'BR') {
                    firstTd.removeChild(firstTd.lastElementChild);
                }

                firstTd.appendChild(btn);
            }
        });
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
            const amounts = [100, 200, 500, 750];

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
        const headerContainer = document.createElement('div');
        headerContainer.style.textAlign = 'center';
        headerContainer.style.margin = '20px 0';
        headerContainer.style.padding = '10px';
        headerContainer.style.background = 'rgba(128, 128, 128, 0.1)';
        headerContainer.style.border = '1px solid rgba(128, 128, 128, 0.3)';
        headerContainer.style.borderRadius = '5px';

        const titleDiv = document.createElement('div');
        titleDiv.innerHTML = "<h2 style='margin: 0; font-family: Arial, sans-serif; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;'>Hobo Helper Settings</h2>";
        headerContainer.appendChild(titleDiv);
        contentArea.appendChild(headerContainer);

        const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
        
        // Helper function for toggles
        const createToggle = (key, labelText, isGlobal = false) => {
            const container = document.createElement('div');
            container.style.marginBottom = '8px';
            container.style.paddingLeft = isGlobal ? '0' : '5px';
            container.style.display = 'flex';
            container.style.alignItems = 'center';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `hw_helper_${key}`;
            // default to true if undefined
            checkbox.checked = savedSettings[key] !== false;
            checkbox.style.cursor = 'pointer';
            checkbox.style.transform = 'scale(1.2)';
            checkbox.style.marginRight = '8px';
            checkbox.style.accentColor = '#2196F3';

            const label = document.createElement('label');
            label.htmlFor = `hw_helper_${key}`;
            label.innerHTML = ` ${labelText}`;
            label.style.cursor = 'pointer';
            label.style.fontFamily = 'Arial, sans-serif';
            label.style.fontSize = '14px';

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

        const topDiv = document.createElement('div');
        topDiv.style.background = 'rgba(128, 128, 128, 0.05)';
        topDiv.style.border = '1px solid rgba(128, 128, 128, 0.2)';
        topDiv.style.borderRadius = '5px';
        topDiv.style.padding = '10px';
        topDiv.style.marginBottom = '20px';

        // Add global toggle
        topDiv.appendChild(createToggle('global_enabled', 'Enable Hobo Helper (Global)', true));
        contentArea.appendChild(topDiv);

        const modsLabel = document.createElement('div');
        modsLabel.innerText = "Active Modules:";
        modsLabel.style.fontWeight = 'bold';
        modsLabel.style.fontSize = '16px';
        modsLabel.style.marginBottom = '10px';
        modsLabel.style.borderBottom = '2px solid rgba(128, 128, 128, 0.3)';
        modsLabel.style.paddingBottom = '5px';
        contentArea.appendChild(modsLabel);

        const subFeatures = {
            'LivingAreaHelper': [
                { key: 'LivingAreaHelper_StatRatioTracker', label: 'Stat Ratio Tracker' },
                { key: 'LivingAreaHelper_AlwaysShowSpecialItem', label: 'Always Show Special Item' },
                { key: 'LivingAreaHelper_MixerLink', label: 'Mixer Link' },
                { key: 'LivingAreaHelper_WinPercentageCalc', label: 'Win Percentage Calc' }
            ],
            'BernardsMansionHelper': [
                { key: 'BernardsMansionHelper_BasementMap', label: 'Basement Map' }
            ],
            'LockoutHelper': [
                { key: 'LockoutHelper_ShowChangelog', label: 'Show Changelog' }
            ],
            'MessageBoardHelper': [
                { key: 'MessageBoardHelper_CtrlEnter', label: 'Ctrl+Enter to Post' }
            ],
            'BankHelper': [
                { key: 'BankHelper_5FightersLunches', label: '5 Fighter\'s Lunches Goal' }
            ],
            'HitlistHelper': [
                { key: 'HitlistHelper_HighlightOnline', label: 'Highlight Online Players' }
            ],
            'DisplayHelper': [
                { key: 'DisplayHelper_ImprovedAvatars', label: 'Enable Improved Avatars' }
            ]
        };

        const gridContainer = document.createElement('div');
        gridContainer.style.display = 'flex';
        gridContainer.style.justifyContent = 'space-between';
        gridContainer.style.alignItems = 'flex-start';
        contentArea.appendChild(gridContainer);

        const col1 = document.createElement('div');
        col1.style.width = '48%';
        gridContainer.appendChild(col1);

        const col2 = document.createElement('div');
        col2.style.width = '48%';
        gridContainer.appendChild(col2);

        if (typeof Modules !== 'undefined') {
            const activeModules = Object.keys(Modules).filter(modName => {
                return modName !== 'SettingsHelper' && typeof Modules[modName].init === 'function';
            });

            activeModules.sort().forEach((modName) => {
                const moduleBlock = document.createElement('div');
                moduleBlock.style.marginBottom = '12px';
                moduleBlock.style.padding = '8px 10px';
                moduleBlock.style.background = 'rgba(128, 128, 128, 0.05)';
                moduleBlock.style.border = '1px solid rgba(128, 128, 128, 0.2)';
                moduleBlock.style.borderRadius = '6px';
                moduleBlock.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';

                moduleBlock.appendChild(createToggle(modName, `<b>Enable ${modName}</b>`));

                // Render sub-features if this module has them defined
                if (subFeatures[modName]) {
                    const subContainer = document.createElement('div');
                    subContainer.style.paddingLeft = '25px';
                    subContainer.style.marginTop = '8px';
                    subContainer.style.borderLeft = '2px solid #2196F3';
                    subFeatures[modName].forEach(feature => {
                        subContainer.appendChild(createToggle(feature.key, feature.label));
                    });
                    moduleBlock.appendChild(subContainer);
                }

                // Custom settings for FoodHelper
                if (modName === 'FoodHelper') {
                    const foodContainer = document.createElement('div');
                    foodContainer.style.paddingLeft = '25px';
                    foodContainer.style.marginTop = '10px';

                    const label = document.createElement('b');
                    label.innerText = 'Crap Foods List:';
                    label.style.display = 'block';
                    label.style.marginBottom = '5px';
                    foodContainer.appendChild(label);

                    const listContainer = document.createElement('div');
                    listContainer.style.background = 'rgba(0, 0, 0, 0.05)';
                    listContainer.style.padding = '10px';
                    listContainer.style.border = '1px solid rgba(128, 128, 128, 0.3)';
                    listContainer.style.borderRadius = '4px';
                    listContainer.style.maxWidth = '100%';

                    const crapList = JSON.parse(localStorage.getItem('hw_helper_food_crap') || '[]');
                    if (crapList.length === 0) {
                        listContainer.innerText = 'No foods marked as crap.';
                    } else {
                        const ul = document.createElement('ul');
                        ul.style.margin = '0';
                        ul.style.paddingLeft = '20px';
                        crapList.forEach(food => {
                            const li = document.createElement('li');
                            const a = document.createElement('a');
                            a.href = '#';
                            a.innerText = '[x]';
                            a.style.color = 'red';
                            a.style.textDecoration = 'none';
                            a.style.marginRight = '5px';
                            a.title = 'Remove from Crap list';
                            a.onclick = (e) => {
                                e.preventDefault();
                                let currentList = JSON.parse(localStorage.getItem('hw_helper_food_crap') || '[]');
                                const updatedList = currentList.filter(f => f !== food);
                                localStorage.setItem('hw_helper_food_crap', JSON.stringify(updatedList));
                                li.remove();
                                if (updatedList.length === 0) {
                                    listContainer.innerText = 'No foods marked as crap.';
                                }
                            };
                            li.appendChild(a);
                            li.appendChild(document.createTextNode(food));
                            ul.appendChild(li);
                        });
                        listContainer.appendChild(ul);
                    }
                    foodContainer.appendChild(listContainer);
                    moduleBlock.appendChild(foodContainer);
                }

                // Manually balance columns: FoodHelper's large box goes left, the rest goes right.
                if (modName <= 'FoodHelper') {
                    col1.appendChild(moduleBlock);
                } else {
                    col2.appendChild(moduleBlock);
                }
            });
        }
    }
}

const SoupKitchenHelper = {
    init: function() {
        if (!window.location.search.includes('cmd=soup_kitchen')) return;

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        const settings = Utils.getSettings();
        if (settings['SoupKitchenHelper'] === false) return;

        const isSoupLine = window.location.search.includes('action=line') ||
                           Array.from(contentArea.querySelectorAll('a')).some(a => a.href.includes('action=bowl'));

        if (isSoupLine) {
            this.initSoupLine();
        }
    },

    initSoupLine: function() {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        const hoboAgeDays = localStorage.getItem('hw_helper_hobo_age_days');
        if (hoboAgeDays) {
            this.renderAgeDisplay(contentArea, hoboAgeDays);
        }

        this.renderSoupTable(contentArea);
    },

    renderAgeDisplay: function(contentArea, hoboAgeDays) {
        const ageContainer = document.createElement('div');
        ageContainer.style.cssText = 'margin-top: 15px; margin-bottom: 15px; font-size: 14px; font-weight: bold; text-align: center; color: #333; border: 1px solid #ccc; background: #fdfdfd; padding: 10px; border-radius: 4px; width: 60%; margin-left: auto; margin-right: auto;';
        ageContainer.innerHTML = `Your Hobo is currently <span style="color: #d9534f;">${hoboAgeDays}</span> days old!`;

        const firstLink = contentArea.querySelector('a[href*="action=bowl"]');
        if (firstLink && firstLink.previousElementSibling && firstLink.previousElementSibling.tagName === 'BR') {
            contentArea.insertBefore(ageContainer, firstLink.previousElementSibling);
        } else if (firstLink) {
            contentArea.insertBefore(ageContainer, firstLink);
        } else {
            contentArea.appendChild(ageContainer);
        }
    },

    renderSoupTable: function(contentArea) {
        const soups = [
            { img: 'Beef-Mushroom-Stew.gif', name: 'Beef Mushroom Stew', stats: '+12T<br>+1 Strength', endsIn: [0, 5] },
            { img: 'Texas-Fajita-Soup.gif', name: 'Texas Fajita Soup', stats: '+12T<br>+1 Speed', endsIn: [1, 6] },
            { img: 'Cream-of-Okra-Soup.gif', name: 'Cream of Okra Soup', stats: '+12T<br>+1 Power', endsIn: [2, 7] },
            { img: 'Garlic-Salmon-Bisque.gif', name: 'Garlic Salmon Bisque', stats: '+12T<br>+1 Intelligence', endsIn: [3, 8] },
            { img: 'Beggar%27s-Bouillon.gif', name: "Beggar's Bouillon", stats: '+12T<br>+0.5 Begging', endsIn: [4, 9] }
        ];

        const tableContainer = document.createElement('div');
        tableContainer.style.cssText = 'margin-top: 20px; font-size: 12px; width: 100%; display: flex; justify-content: center;';

        let html = `
            <table style="border-collapse: collapse; background: #fff; border: 1px solid #ccc; width: 80%;">
                <thead>
                    <tr style="background: #e0e0e0; text-align: center;">
                        <th style="padding: 5px; border: 1px solid #ccc;" colspan="2">Soup</th>
                        <th style="padding: 5px; border: 1px solid #ccc;">Stats</th>
                        <th style="padding: 5px; border: 1px solid #ccc;">Age Ends In</th>
                    </tr>
                </thead>
                <tbody>
        `;

        soups.forEach(soup => {
            html += `
                <tr style="background: #fff; text-align: center; border-bottom: 1px solid #eee;">
                    <td style="padding: 5px; border: 1px solid #ccc; width: 40px;">
                        <img src="/images/items/gifs/${soup.img}" width="30" height="30" alt="${soup.name}">
                    </td>
                    <td style="padding: 5px; border: 1px solid #ccc;">${soup.name}</td>
                    <td style="padding: 5px; border: 1px solid #ccc;">${soup.stats}</td>
                    <td style="padding: 5px; border: 1px solid #ccc;">${soup.endsIn.join(' or ')}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        tableContainer.innerHTML = html;
        contentArea.appendChild(tableContainer);
    }
};

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
        BackpackHelper,
        BankHelper,
        BernardsMansionHelper,
        CanDepoHelper,
        ChangelogData,
        DisplayHelper,
        DrinksData,
        DrinksHelper,
        FoodHelper,
        GangLoansHelper,
        HitlistHelper,
        KurtzCampHelper,
        LiquorStoreHelper,
        LivingAreaHelper,
        LockoutHelper,
        MessageBoardHelper,
        MixerHelper,
        NorthernFenceHelper,
        RecyclingBinHelper,
        SettingsHelper,
        SoupKitchenHelper,
        TattooParlorHelper,
        UniversityHelper,
        WellnessClinicHelper
    };

    const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
    const globalEnabled = savedSettings['global_enabled'] !== false;

    // Initialize all modules
    Object.keys(Modules).forEach(moduleName => {
        if (typeof Modules[moduleName].alwaysInit === 'function') {
            Modules[moduleName].alwaysInit();
        }

        if (typeof Modules[moduleName].init === 'function') {
            const moduleEnabled = savedSettings[moduleName] !== false;
            if (moduleName === 'SettingsHelper' || (globalEnabled && moduleEnabled)) {
                Modules[moduleName].init();
            }
        }
    });
})();

