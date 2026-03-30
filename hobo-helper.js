// ==UserScript==
// @name         HoboWars Helper Toolkit
// @namespace    http://tampermonkey.net/
// @version      7.6
// @description  Combines original HoboWars helpers into a single modular script.
// @author       Gemini (Combined)
// @match        *://www.hobowars.com/game/game.php?*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const Helpers = {
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
                return parseInt(levelSpan.textContent.replace(/,/g, ''), 10);
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
                return parseInt(cashEl.textContent.trim().replace(/[$,]/g, ''), 10) || 0;
            }
            return 0;
        },
        getBankBalance: function() {
            const bankEl = document.querySelector('.no-mobile.displayBank');
            if (bankEl) {
                return parseInt(bankEl.textContent.trim().replace(/[$,]/g, ''), 10) || 0;
            }
            return 0;
        }
    };

    const Modules = {
        DrinksData: {
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
        },

        DrinksHelper: {
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
        },

        StatRatioTracker: {
            init: function() {
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
                        const valMatch = target.textContent.replace(/,/g, '').match(/[\d.]+/g);
                        return valMatch ? parseFloat(valMatch[0]) : null;
                    };

                    const scraped = {
                        speed: findValue('Speed:'),
                        power: findValue('Power:'),
                        strength: findValue('Strength:'),
                        today: findValue('Gained Today:'),
                        biggest: findValue('Biggest Gain:')
                    };

                    if (scraped.speed && scraped.today !== null) {
                        const currentTotal = scraped.speed + scraped.power + scraped.strength;
                        const minsElapsed = Helpers.getHoboMinutes();
                        
                        let estDays = "---";

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

                            const minTarget = Math.max(target, scraped.speed/spdPct, scraped.power/pwrPct, scraped.strength/strPct);

                            config.needs = {
                                speed: Math.max(0, (spdPct * minTarget) - scraped.speed),
                                power: Math.max(0, (pwrPct * minTarget) - scraped.power),
                                strength: Math.max(0, (strPct * minTarget) - scraped.strength)
                            };

                            const totalNeeded = config.needs.speed + config.needs.power + config.needs.strength;
                            config.estDays = config.dailyGain > 1 ? (totalNeeded / config.dailyGain).toFixed(1) : "---";

                            localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
                            renderLivingAreaTags(ratioSum);
                            renderPanel(statsBlock, minTarget);
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
                            diffEl.innerHTML = `<span style="color:${displayDiff > 0 ? '#008000' : '#999'}">(${displayDiff > 0 ? '+' : ''}${displayDiff.toLocaleString()} / ${((config[key]/ratioSum)*100).toFixed(1)}%)</span>`;
                        }
                    });
                }

                function renderPanel(anchor, target) {
                    if (document.activeElement && ['r_goal','r_spd','r_pwr','r_str'].includes(document.activeElement.id)) return;
                    let panel = document.getElementById('stat_ratio_panel');
                    if (!panel) {
                        panel = document.createElement('div');
                        panel.id = 'stat_ratio_panel';
                        panel.style.cssText = 'margin:12px 0; padding:12px; background:#f4f4f4; border:1px solid #ddd; border-left:4px solid #eec111; font-family: Arial; width: 100%; box-sizing: border-box;';
                        anchor.appendChild(panel);
                    }

                    panel.innerHTML = `
                        <div style="font-size:13px; margin-bottom:5px;"><b>Effective Goal:</b> ${Math.round(target).toLocaleString()} <span id="cog_toggle" style="float:right; cursor:pointer; opacity:0.5;">⚙️</span></div>
                        <div style="font-size:11px; color:#666; margin-bottom:8px; border-bottom:1px solid #ddd; padding-bottom:5px;">Est: ~${config.estDays} days (@ ${Math.round(config.dailyGain)}/day)</div>
                        <div id="settings_area" style="display:${config.showSettings ? 'block' : 'none'};">
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

                        config.targetTotal = parseFloat(document.getElementById('r_goal').value.replace(/,/g, '')) || 0;
                        config.speed = parseFloat(document.getElementById('r_spd').value) || 0;
                        config.power = parseFloat(document.getElementById('r_pwr').value) || 0;
                        config.strength = parseFloat(document.getElementById('r_str').value) || 0;
                        config.lastUpdated = Date.now();
                        inMemoryLastUpdated = config.lastUpdated;
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
                        updateTracker();
                    };
                }

                // Run once on page load instead of constantly polling
                updateTracker();
            }
        },

        WellnessClinicHelper: {
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
                    if (costMatch) detectedCost = parseInt(costMatch[0].replace(/[$,]/g, ''));

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
                        const cellStyle = isBlue ? 'background-color: lightblue; font-weight: bold;' : '';
                        const interactiveStyle = isCurrentOrFuture ? 'cursor: pointer; color: #800;' : 'color: #888;';

                        tableRows += `
                            <tr ${rowID} style="background-color: ${bg}; border-bottom: 1px solid #ddd;">
                                <td style="padding: 4px; text-align: center; border-right: 1px solid #bbb;">${row.lv}</td>
                                <td style="padding: 4px; text-align: right; border-right: 1px solid #bbb;">$${row.fee.toLocaleString()}</td>
                                <td style="padding: 4px; text-align: right; border-right: 1px solid #bbb;">$${runningTotalSpentDay.toLocaleString()}</td>
                                <td class="hw-wellness-finish-cell" data-val="${runningFutureCost}" style="padding: 4px; text-align: right; ${interactiveStyle} ${cellStyle}">
                                    ${isCurrentOrFuture ? `$${runningFutureCost.toLocaleString()}` : '-'}
                                </td>
                            </tr>
                        `;
                    });

                    const spentToday = (currentIndex !== -1) ? (runningTotalSpentDay - runningFutureCost) : 0;

                    const trackerHtml = `
                        <div id="hw-tracker-container" style="margin: 20px auto; width: 95%; max-width: 580px; font-family: Verdana, sans-serif;">
                            <div id="hw-scroll-box" style="max-height: 350px; overflow-y: auto; border: 1px solid #666; border-radius: 4px; background-color: rgba(255,255,255,0.7);">
                                <table style="width: 100%; border-collapse: collapse; color: #000; font-size: 11px;">
                                    <thead style="position: sticky; top: 0; background: #f0f0f0; z-index: 10; border-bottom: 2px solid #999;">
                                        <tr>
                                            <th style="padding: 6px; border-right: 1px solid #bbb;">Lv</th>
                                            <th style="padding: 6px; border-right: 1px solid #bbb;">Fee</th>
                                            <th style="padding: 6px; border-right: 1px solid #bbb;">Total Spent Day</th>
                                            <th style="padding: 6px; background: #f9f9e8;">To Finish</th>
                                        </tr>
                                    </thead>
                                    <tbody>${tableRows}</tbody>
                                </table>
                            </div>
                            <div style="font-size: 12px; margin-top: 8px; color: #333; text-align: right; font-weight: bold;">
                               Total Spent Today: <span style="color: #800;">$${spentToday.toLocaleString()}</span>
                            </div>
                        </div>
                    `;

                    contentArea.insertAdjacentHTML('beforeend', trackerHtml);

                    document.querySelectorAll('.hw-wellness-finish-cell').forEach(cell => {
                        cell.addEventListener('click', function() {
                            const val = this.getAttribute('data-val');
                            if (val === "0") return;
                            const isAlreadyBlue = (this.style.backgroundColor === 'lightblue');
                            document.querySelectorAll('.hw-wellness-finish-cell').forEach(c => { c.style.backgroundColor = 'transparent'; c.style.fontWeight = 'normal'; });

                            if (!isAlreadyBlue) {
                                this.style.backgroundColor = 'lightblue';
                                this.style.fontWeight = 'bold';
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
        },

        BankHelper: {
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
        },

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
        },

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
        },

        MixerHelper: {
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
                                                const cwPrice = Helpers.getCWPrice();
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
                                        listHtml += `<div style="margin-top: 5px; font-weight: bold; color: #333; border-top: 1px dashed #ccc; padding-top: 3px;">Estimated Cost: <span style="color:red;">$${totalFixed.toLocaleString()}</span> <button id="add-drinks-bank-goal" style="margin-left: 5px; cursor: pointer; font-size: 10px;">+ Bank</button></div>`;
                                        listHtml += `<div style="margin-top: 2px; font-size: 10px; color: #888;">* 10% Bartender's Guide discount applied</div>`;
                                    }

                                    shoppingListContent.innerHTML = listHtml;
                                    shoppingListContainer.style.display = 'block';

                                    const bankBtn = document.getElementById('add-drinks-bank-goal');
                                    if (bankBtn) {
                                        bankBtn.addEventListener('click', function(e) {
                                            e.preventDefault();
                                            Modules.BankHelper.addBankGoal('Drink Ingredients', totalFixed);
                                            
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

                                            this.textContent = 'Added!';
                                            this.disabled = true;
                                        });
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
        },

        LiquorStoreHelper: {
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
                                    amount = parseInt(amountMatch[1], 10);
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
    };

    // Initialize all modules
    Object.values(Modules).forEach(module => {
        if (typeof module.init === 'function') {
            module.init();
        }
    });

})();

