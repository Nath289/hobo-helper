// ==UserScript==
// @name         HoboWars Helper Toolkit (All)
// @namespace    http://tampermonkey.net/
// @version      8.70
// @description  Combines all HoboWars helpers including staff modules into a single modular script.
// @author       Gemini (Combined)
// @match        *://www.hobowars.com/game/game.php?*
// @match        *://hobowars.com/game/game.php?*
// @grant        GM_notification
// @noframes
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
const Utils = {
    abbreviateNumber: function(num) {
        if (typeof num === 'string') num = parseInt(num.replace(/,/g, ''), 10);
        if (isNaN(num)) return 0;

        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
        }
        if (num >= 10000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        }

        return num.toLocaleString();
    },
        getHoboDateTime: function() {
            const clockEl = document.getElementById('clock');
            if (!clockEl) return null;

            let dateStr = '';
            if (clockEl.parentElement) {
                const dateEl = clockEl.parentElement.querySelector('i');
                if (dateEl) {
                    // Remove suffixes like st, nd, rd, th (e.g., "Apr 5th" -> "Apr 5")
                    dateStr = dateEl.textContent.trim().replace(/(st|nd|rd|th),?/i, '');
                }
            }

            const timeStr = clockEl.textContent.trim();
            if (dateStr && timeStr) {
                const currentYear = new Date().getFullYear();
                const parsedDate = new Date(`${dateStr} ${currentYear} ${timeStr}`);
                if (!isNaN(parsedDate.getTime())) {
                    return parsedDate;
                }
            }

            return null;
        },
        getFormattedHoboDateTime: function() {
            const dateObj = this.getHoboDateTime() || new Date();
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[dateObj.getMonth()]} ${dateObj.getDate()} ${dateObj.getFullYear()}`;
        },
        getHoboTime: function() {
            const clockEl = document.getElementById('clock');
            if (!clockEl) return null;
            return clockEl.textContent.trim().toLowerCase();
        },
        getHoboMinutes: function() {
            const timeStr = this.getHoboTime();
            if (!timeStr) return null;
            const match = timeStr.match(/(\d+):(\d+):(\d+)\s*(am|pm)/);
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
                const match = ageLine.title.match(/(\d+)\s+days/);
                if (match) return parseInt(match[1], 10);
            }
            return 0;
        },
        getSr: function() {
            const params = new URLSearchParams(window.location.search);
            return params.get('sr');
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

const EquipmentData = {"Plastic Bag":"/images/items/gifs/Plastic-Bag.gif","Mithril Garbage Bin":"/images/items/gifs/Mithril-Garbage-Bin.gif","Garbage Bag":"/images/items/gifs/Garbage-Bag.gif","Plastic Spoon":"/images/items/gifs/Plastic-Spoon.gif","Power Glove":"/images/items/gifs/Power-Glove.gif","Respect Ring":"/images/items/gifs/Respect-Ring.gif","Large Stick":"/images/items/gifs/Large-Stick.gif","Ak-47":"/images/items/gifs/Ak-47.gif","Double Hobos":"/images/items/gifs/Double-Hobos.gif","Full-Body Trap":"/images/items/gifs/Full-Body-Trap.gif","Jester\u0027s Cap":"/images/items/gifs/Jesters-Cap.gif","Bling Necklace":"/images/items/gifs/Bling-Necklace.gif","Plastic Helmet":"/images/items/gifs/Plastic-Helmet.gif","Plastic Ring":"/images/items/gifs/Plastic-Ring.gif","Nippled Breastplate":"/images/items/gifs/Nippled-Breastplate.gif","Shot-Gun":"/images/items/gifs/Shot-Gun.gif","Adamantium Pasties":"/images/items/gifs/Adamantium-Pasties.gif","Ratarang":"/images/items/gifs/Ratarang.gif","Fight Club Ring":"/images/items/gifs/Fight-Club-Ring.gif","Paper Cup":"/images/items/gifs/Paper-Cup.gif","Gold Ring":"/images/items/gifs/Gold-Ring.gif","Filthy Socks":"/images/items/gifs/Filthy-Socks.gif","Gold Ring with Diamond":"/images/items/gifs/Gold-Ring-with-Diamond.gif","Iron Man Armor":"/images/items/gifs/Iron-Man-Armor.gif","Ring of Revelation":"/images/items/gifs/Ring-of-Revelation.gif","Potato Gun":"/images/items/gifs/Potato-Gun.gif","Symbiote":"/images/items/gifs/Symbiote.gif","Bloody Knife":"/images/items/gifs/Bloody-Knife.gif","Hi-Tech Tuxedo":"/images/items/gifs/Hi-Tech-Tuxedo.gif","Silver Ring":"/images/items/gifs/Silver-Ring.gif","Water Cannon":"/images/items/gifs/Water-Cannon.gif","Utility Belt":"/images/items/gifs/Utility-Belt.gif","Balltop Cane":"/images/items/gifs/Balltop-Cane.gif","Mystery Hat":"/images/items/gifs/Mystery-Hat.gif","Revolver":"/images/items/gifs/Revolver.gif","Singlet":"/images/items/gifs/Singlet.gif","Tron Armor":"/images/items/gifs/Tron-Armor.gif","Yellow Jumpsuit":"/images/items/gifs/Yellow-Jumpsuit.gif","Championship Belt":"/images/items/gifs/Championship-Belt.gif","Metal Ring":"/images/items/gifs/Metal-Ring.gif","Long Black Trenchcoat":"/images/items/gifs/Long-Black-Trenchcoat.gif","Diamond Tuxedo":"/images/items/gifs/Diamond-Tuxedo.gif","Metal Knife":"/images/items/gifs/Metal-Knife.gif","Hybrid Ring":"/images/items/gifs/Hybrid-Ring.gif","Diamond Shuriken":"/images/items/gifs/Diamond-Shuriken.gif","Can Cannon":"/images/items/gifs/Can-Cannon.gif","Gold Folding Chair":"/images/items/gifs/Gold-Folding-Chair.gif","Valyrian Steel Blade":"/images/items/gifs/Valyrian-Steel-Blade.gif","Bulletproof Shield":"/images/items/gifs/Bulletproof-Shield.gif","Gang Ring":"/images/items/gifs/Gang-Ring.gif","Blaster":"/images/items/gifs/Blaster.gif","Gold Pickaxe":"/images/items/gifs/Gold-Pickaxe.gif","Livestrong Ring":"/images/items/gifs/Livestrong-Ring.gif","Cricket Bat":"/images/items/gifs/Cricket-Bat.gif","Hazmat Suit":"/images/items/gifs/Hazmat-Suit.gif","Chest Armor":"/images/items/gifs/Chest-Armor.gif","Juggernaut Helmet":"/images/items/gifs/Juggernaut-Helmet.gif","Kobayashi Ring":"/images/items/gifs/Kobayashi-Ring.gif","Beggar Ring":"/images/items/gifs/Beggar-Ring.gif","Pipe":"/images/items/gifs/Pipe.gif","Dress":"/images/items/gifs/Dress.gif","MHGA Hat":"/images/items/gifs/MHGA-Hat.gif","Wooden Bat":"/images/items/gifs/Wooden-Bat.gif","Bin Lid":"/images/items/gifs/Bin-Lid.gif","Rodent Ring":"/images/items/gifs/Rodent-Ring.gif","Hackeysack":"/images/items/gifs/Hackeysack.gif","Paper Bag":"/images/items/gifs/Paper-Bag.gif","Engagement Ring":"/images/items/gifs/Engagement-Ring.gif","Sting":"/images/items/gifs/Sting.gif","Green Lantern Ring":"/images/items/gifs/Green-Lantern-Ring.gif","Slurpee Cup":"/images/items/gifs/Slurpee-Cup.gif","Police Baton":"/images/items/gifs/Police-Baton.gif","Coffee-Soaked Mop":"/images/items/gifs/Coffee-Soaked-Mop.gif","Metal Rod":"/images/items/gifs/Metal-Rod.gif","Ring Pop":"/images/items/gifs/Ring-Pop.gif","Phaser":"/images/items/gifs/Phaser.gif","Nights Watch Cloak":"/images/items/gifs/Nights-Watch-Cloak.gif","BFG":"/images/items/gifs/BFG.gif","Water Pistol":"/images/items/gifs/Water-Pistol.gif","Onion Ring":"/images/items/gifs/Onion-Ring.gif","Full-Body Armor":"/images/items/gifs/Full-Body-Armor.gif","Grizzly Armor":"/images/items/gifs/Grizzly-Armor.gif","Small Stick":"/images/items/gifs/Small-Stick.gif","Vest":"/images/items/gifs/Vest.gif","HK G11":"/images/items/gifs/HK-G11.gif","Lightsaber":"/images/items/gifs/Lightsaber.gif","Rocks":"/images/items/gifs/Rocks.gif","Crow-bar":"/images/items/gifs/Crow-bar.gif","Thor\u0027s Hammer":"/images/items/gifs/Thors-Hammer.gif","T-Shirt":"/images/items/gifs/T-Shirt.gif","Bad to the Bone T-Shirt":"/images/items/gifs/Bad-to-the-Bone-T-Shirt.gif","Metal Helmet":"/images/items/gifs/Metal-Helmet.gif","Beggar\u0027s Bludgeon":"/images/items/gifs/Beggars-Bludgeon.gif","Amish Hat":"/images/items/gifs/Amish-Hat.gif","BB-Gun":"/images/items/gifs/BB-Gun.gif","Chainsaw":"/images/items/gifs/Chainsaw.gif","Wolf Shirt":"/images/items/gifs/Wolf-Shirt.gif","Hacksaw":"/images/items/gifs/Hacksaw.gif","Hattori-Hanzo Sword":"/images/items/gifs/Hattori-Hanzo-Sword.gif","Mithril Grocery Bag":"/images/items/gifs/Mithril-Grocery-Bag.gif","MHGA Sign":"/images/items/gifs/MHGA-Sign.gif","Metal Shield":"/images/items/gifs/Metal-Shield.gif","Weaponized Bindle":"/images/items/gifs/Weaponized-Bindle.gif","Rubber Knife":"/images/items/gifs/Rubber-Knife.gif","Fat Suit":"/images/items/gifs/Fat-Suit.gif","Golden Rod":"/images/items/gifs/Golden-Rod.gif","Wonka Ring":"/images/items/gifs/Wonka-Ring.gif","Rags":"/images/items/gifs/Rags.gif","Ad Sign":"/images/items/gifs/Ad-Sign.gif","Jacket":"/images/items/gifs/Jacket.gif","Another Hobo":"/images/items/gifs/Another-Hobo.gif","Steel Bat":"/images/items/gifs/Steel-Bat.gif","Bloody Prisoner Uniform":"/images/items/gifs/Bloody-Prisoner-Uniform.gif","Gemini Ring":"/images/items/gifs/Gemini-Ring.gif","Eagle Shirt":"/images/items/gifs/Eagle-Shirt.gif","Mac-10":"/images/items/gifs/Mac-10.gif","Wooden Shield":"/images/items/gifs/Wooden-Shield.gif","Suicide Ring":"/images/items/gifs/Suicide-Ring.gif","Adamantium Claws":"/images/items/gifs/Adamantium-Claws.gif","Viking Helmet":"/images/items/gifs/Viking-Helmet.gif","Bulletproof Vest":"/images/items/gifs/Bulletproof-Vest.gif","Desert-Eagle":"/images/items/gifs/Desert-Eagle.gif","Excalibur":"/images/items/gifs/Excalibur.gif","M16":"/images/items/gifs/M16.gif","Riot Shield":"/images/items/gifs/Riot-Shield.gif"};

/**
 * Feeding Rats
 * The only way for rats to level up or increase their lifespan is to feed them. Foods give different exp and life gains, these gains can be affected by the Vegetarianism upgrade. Rats can only eat when they have a meal available. If you do not wish to manually feed a rat, you can purchase a Rat Trough to automatically feed them. Your rat gains a meal based on the HoboWars clock; A meal is gained at 00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00.
 *
 * Food Bonuses
 * Awake	Exp	Life
 * 0T	1	11
 * 1T	3	10
 * 2-4T	5	9
 * 5-9T	7	8
 * 10-15T	9	7
 * 16-25T	11	6
 * 26-49T	13	5
 * 50-99T*	17	3
 * 100T	21	1
 * *Exceptions: Fruit by the Furlong (55T) exp = 17, life = -7. Kit Rat Bar (20T) exp = 10, life = 8
 * **Vegetarianism Upgrade will add +1 to exp and life, but will restrict food intake to vegetarian meals only.
 */
const FoodData = {
    "Apple Core": { "img": "Apple-Core.gif", "ratExp": 3, "ratLife": 10 },
    "Half a Donut": { "img": "Half-a-Donut.gif", "ratExp": 5, "ratLife": 9 },
    "Piece of Bread": { "img": "Piece-of-Bread.gif", "ratExp": 5, "ratLife": 9 },
    "Can of Coke": { "img": "Can-of-Coke.gif", "ratExp": 5, "ratLife": 9 },
    "Piece of Pizza": { "img": "Piece-of-Pizza.gif", "ratExp": 5, "ratLife": 9 },
    "Meat Pie": { "img": "Meat-Pie.gif", "ratExp": 5, "ratLife": 9 },
    "Can of Pepsi": { "img": "Can-of-Pepsi.gif", "ratExp": 5, "ratLife": 9 },
    "Rotten Fish": { "img": "Rotten-Fish.gif", "ratExp": 3, "ratLife": 10 },
    "Half Eaten Burger": { "img": "Half-Eaten-Burger.gif", "ratExp": 5, "ratLife": 9 },
    "Packet of Fries": { "img": "Packet-of-Fries.gif", "ratExp": 5, "ratLife": 9 },
    "New Pizza": { "img": "New-Pizza.gif", "ratExp": 7, "ratLife": 8 },
    "Chewed Chicken Leg": { "img": "Chewed-Chicken-Leg.gif", "ratExp": 5, "ratLife": 9 },
    "Raw Chicken Leg": { "img": "Raw-Chicken-Leg.gif", "ratExp": 3, "ratLife": 10 },
    "Cooked Chicken": { "img": "Cooked-Chicken.gif", "ratExp": 7, "ratLife": 8 },
    "Half a HotDog": { "img": "Half-a-HotDog.gif", "ratExp": 5, "ratLife": 9 },
    "HotDog": { "img": "HotDog.gif", "ratExp": 7, "ratLife": 8 },
    "KFC Meal": { "img": "KFC-Meal.gif", "ratExp": 9, "ratLife": 7 },
    "Raw Potato": { "img": "Raw-Potato.gif", "ratExp": 3, "ratLife": 10 },
    "Vanilla Ice Cream": { "img": "Vanilla-Ice-Cream.gif", "ratExp": 5, "ratLife": 9 },
    "Chocolate Ice Cream": { "img": "Chocolate-Ice-Cream.gif", "ratExp": 7, "ratLife": 8 },
    "Fresh Apple": { "img": "Fresh-Apple.gif", "ratExp": 5, "ratLife": 9 },
    "Fighters Lunch": { "img": "Fighters-Lunch.gif", "ratExp": 11, "ratLife": 6 },
    "Double-Double": { "img": "Double-Double.gif", "ratExp": 21, "ratLife": 1 },
    "Bachelor Chow": { "img": "Bachelor-Chow.gif", "ratExp": 9, "ratLife": 7 },
    "Smart Bread": { "img": "Smart-Bread.gif", "ratExp": 5, "ratLife": 9 },
    "Day Old Coffee Naan": { "img": "Day-Old-Coffee-Naan.gif", "ratExp": 7, "ratLife": 8 },
    "Half a Sandwich Naan": { "img": "Half-a-Sandwich-Naan.gif", "ratExp": 7, "ratLife": 8 },
    "Discarded Taco Naan": { "img": "Discarded-Taco-Naan.gif", "ratExp": 7, "ratLife": 8 },
    "Wonka Bar": { "img": "Wonka-Bar.gif", "ratExp": 5, "ratLife": 9 },
    "Single-Single": { "img": "Single-Single.gif", "ratExp": 17, "ratLife": 3 },
    "Wonka-stripe Candy Cane": { "img": "Wonka-stripe-Candy-Cane.gif", "ratExp": 7, "ratLife": 8 },
    "Rainbow Drop": { "img": "Rainbow-Drop.gif", "ratExp": 7, "ratLife": 8 },
    "Roast Beef": { "img": "Roast-Beef.gif", "ratExp": 9, "ratLife": 7 },
    "Pre-Chewed Gum": { "img": "Pre-Chewed-Gum.gif", "ratExp": 3, "ratLife": 10 },
    "Roast Beef Flavored Gum": { "img": "Roast-Beef-Flavored-Gum.gif", "ratExp": 9, "ratLife": 7 },
    "Semi-Lasting Gobstopper": { "img": "Semi-Lasting-Gobstopper.gif", "ratExp": 7, "ratLife": 8 },
    "Sweet Bomb": { "img": "Sweet-Bomb.gif", "ratExp": 11, "ratLife": 6 },
    "Blueberry Blast Jelly Beans": { "img": "Blueberry-Blast-Jelly-Beans.gif", "ratExp": 7, "ratLife": 8 },
    "Beef Mushroom Stew": { "img": "Beef-Mushroom-Stew.gif", "ratExp": 9, "ratLife": 7 },
    "Texas Fajita Soup": { "img": "Texas-Fajita-Soup.gif", "ratExp": 9, "ratLife": 7 },
    "Cream of Okra Soup": { "img": "Cream-of-Okra-Soup.gif", "ratExp": 9, "ratLife": 7 },
    "Garlic Salmon Bisque": { "img": "Garlic-Salmon-Bisque.gif", "ratExp": 9, "ratLife": 7 },
    "Beggars Bouillon": { "img": "Beggar%27s-Bouillon.gif", "ratExp": 9, "ratLife": 7 },
    "Fizzy Lifting Soda": { "img": "Fizzy-Lifting-Soda.gif", "ratExp": 7, "ratLife": 8 },
    "Wonkas Peppermint Spirits": { "img": "Wonka%27s-Peppermint-Spirits.gif", "ratExp": 7, "ratLife": 8 },
    "Altoids": { "img": "Altoids.gif", "ratExp": 5, "ratLife": 9 },
    "Junior Mints": { "img": "Junior-Mints.gif", "ratExp": 11, "ratLife": 6 },
    "Red Hots": { "img": "Red-Hots.gif", "ratExp": 9, "ratLife": 7 },
    "Crystal Pepsi": { "img": "Crystal-Pepsi.gif", "ratExp": 7, "ratLife": 8 },
    "Chocolate Vanilla Swirl Ice Cream": { "img": "Chocolate-Vanilla-Swirl-Ice-Cream.gif", "ratExp": 7, "ratLife": 8 },
    "Redder Hots": { "img": "Redder-Hots.gif", "ratExp": 9, "ratLife": 7 },
    "Gas Soaked Red Hots": { "img": "Gas-Soaked-Red-Hots.gif", "ratExp": 9, "ratLife": 7 },
    "Gummi Gorilla": { "img": "Gummi-Gorilla.gif", "ratExp": 7, "ratLife": 8 },
    "Gummi Peregrine Falcon": { "img": "Gummi-Peregrine-Falcon.gif", "ratExp": 7, "ratLife": 8 },
    "Gummi Raptor": { "img": "Gummi-Raptor.gif", "ratExp": 7, "ratLife": 8 },
    "Quantum Candy": { "img": "Quantum-Candy.gif", "ratExp": 7, "ratLife": 8 },
    "Gummi Spaghetti Monster": { "img": "Gummi-Spaghetti-Monster.gif", "ratExp": 7, "ratLife": 8 },
    "Fruit by the Furlong": { "img": "Fruit-by-the-Furlong.gif", "ratExp": 17, "ratLife": -7 },
    "Candy Cigarette": { "img": "Candy-Cigarette.gif", "ratExp": 3, "ratLife": 10 },
    "Pack of Candy Cigarettes": { "img": "Pack-of-Candy-Cigarettes.gif", "ratExp": 17, "ratLife": 3 },
    "Freeze-Packed Dippin Dots": { "img": "Freeze-Packed-Dippin-Dots.gif", "ratExp": 9, "ratLife": 7 },
    "Dippin Dots": { "img": "Dippin-Dots.gif", "ratExp": 9, "ratLife": 7 },
    "Military Rations": { "img": "Military-Rations.gif", "ratExp": 11, "ratLife": 6 },
    "Can of Whipped Cream": { "img": "Can-of-Whipped-Cream.gif", "ratExp": 9, "ratLife": 7 },
    "Faberge Cream Egg": { "img": "Faberge-Cream-Egg.gif", "ratExp": 13, "ratLife": 5 },
    "Apple Flavored Gum": { "img": "Apple-Flavored-Gum.gif", "ratExp": 9, "ratLife": 7 },
    "Cinnamon Flavored Gum": { "img": "Cinnamon-Flavored-Gum.gif", "ratExp": 9, "ratLife": 7 },
    "Dark Chocolate Wonka Bar": { "img": "Dark-Chocolate-Wonka-Bar.gif", "ratExp": 5, "ratLife": 9 },
    "Special Brownie": { "img": "Special-Brownie.gif", "ratExp": 5, "ratLife": 9 },
    "Bacon Blast Jelly Beans": { "img": "Bacon-Blast-Jelly-Beans.gif", "ratExp": 7, "ratLife": 8 },
    "Fizzy Falling Soda": { "img": "Fizzy-Falling-Soda.gif", "ratExp": 7, "ratLife": 8 },
    "Caulipop": { "img": "Caulipop.gif", "ratExp": 9, "ratLife": 7 },
    "Dalipop": { "img": "Dalipop.gif", "ratExp": 9, "ratLife": 7 },
    "Volleypop": { "img": "Volleypop.gif", "ratExp": 9, "ratLife": 7 },
    "Polypop": { "img": "Polypop.gif", "ratExp": 9, "ratLife": 7 },
    "Mountain Honeydew Melon": { "img": "Mountain-Honeydew-Melon.gif", "ratExp": 7, "ratLife": 8 },
    "Mountain Dew": { "img": "Mountain-Dew.gif", "ratExp": 11, "ratLife": 6 },
    "Salmon": { "img": "Salmon.gif", "ratExp": 7, "ratLife": 8 },
    "Catfish": { "img": "Catfish.gif", "ratExp": 9, "ratLife": 7 },
    "Fish Sticks": { "img": "Fish-Sticks.gif", "ratExp": 9, "ratLife": 7 },
    "Octopus": { "img": "Octopus.gif", "ratExp": 11, "ratLife": 6 },
    "Blowfish": { "img": "Blowfish.gif", "ratExp": 11, "ratLife": 6 },
    "Hobo Stew": { "img": "Hobo-Stew.gif", "ratExp": 11, "ratLife": 6 },
    "Beggars Brunch": { "img": "Beggars-Brunch.gif", "ratExp": 11, "ratLife": 6 },
    "Hangover Omelette": { "img": "Hangover-Omelette.gif", "ratExp": 11, "ratLife": 6 },
    "Stomach Parasite": { "img": "Stomach-Parasite.gif", "ratExp": 1, "ratLife": 11 },
    "Forest Shroom": { "img": "Forest-Shroom.gif", "ratExp": 7, "ratLife": 8 },
    "Garlic Clove": { "img": "Garlic-Clove.gif", "ratExp": 5, "ratLife": 9 },
    "Chili Pepper": { "img": "Chili-Pepper.gif", "ratExp": 7, "ratLife": 8 },
    "Okra": { "img": "Okra.gif", "ratExp": 5, "ratLife": 9 },
    "Gingerbread Bum": { "img": "Gingerbread-Bum.gif", "ratExp": 11, "ratLife": 6 },
    "Bernard Burger": { "img": "Bernard-Burger.gif", "ratExp": 9, "ratLife": 7 },
    "Flying Dutchman": { "img": "Flying-Dutchman.gif", "ratExp": 11, "ratLife": 6 },
    "Animal Style Fries": { "img": "Animal-Style-Fries.gif", "ratExp": 13, "ratLife": 5 },
    "Neapolitan Shake": { "img": "Neapolitan-Shake.gif", "ratExp": 1, "ratLife": 11 },
    "SARS Bar": { "img": "SARS-Bar.gif", "ratExp": 9, "ratLife": 7 },
    "Hobowarheads": { "img": "Hobowarheads.gif", "ratExp": 9, "ratLife": 7 },
    "Mop Rocks": { "img": "Mop-Rocks.gif", "ratExp": 9, "ratLife": 7 },
    "ICPeanut Butter Cup": { "img": "ICPeanut-Butter-Cup.gif", "ratExp": 9, "ratLife": 7 },
    "Sugarfree Gum": { "img": "Sugarfree-Gum.gif", "ratExp": 9, "ratLife": 7 },
    "Kit Rat Bar": { "img": "Kit-Rat-Bar.gif", "ratExp": 10, "ratLife": 8 },
    "Butlerfinger": { "img": "Butlerfinger.gif", "ratExp": 9, "ratLife": 7 },
    "Life Savers": { "img": "Life-Savers.gif", "ratExp": 11, "ratLife": 6 },
    "Pay Day": { "img": "Pay-Day.gif", "ratExp": 11, "ratLife": 6 },
    "Candycorn": { "img": "Candycorn.gif", "ratExp": 11, "ratLife": 6 },
    "Sourpatch Bums": { "img": "Sourpatch-Bums.gif", "ratExp": 9, "ratLife": 7 },
    "L&amp;Ls": { "img": "L&amp;Ls.gif", "ratExp": 9, "ratLife": 7 },
    "Apple Surprise": { "img": "Apple-Surprise.gif", "ratExp": 11, "ratLife": 6 },
    "Death Mints": { "img": "Death-Mints.gif", "ratExp": 9, "ratLife": 7 },
    "Blow-Up Pop": { "img": "Blow-Up-Pop.gif", "ratExp": 9, "ratLife": 7 },
    "Peppermint Burger Patties": { "img": "Peppermint-Burger-Patties.gif", "ratExp": 11, "ratLife": 6 },
    "Rock Candy": { "img": "Rock-Candy.gif", "ratExp": 9, "ratLife": 7 },
    "Walking Taco": { "img": "Walking-Taco.gif", "ratExp": 11, "ratLife": 6 },
    "Freedom Fries": { "img": "Freedom-Fries.gif", "ratExp": 9, "ratLife": 7 },
    "Jugger-Nut": { "img": "Jugger-Nut.gif", "ratExp": 9, "ratLife": 7 },
    "Pizza Del Mare": { "img": "Pizza-Del-Mare.gif", "ratExp": 7, "ratLife": 8 },
    "Bottle of Coke": { "img": "Bottle-of-Coke.gif", "ratExp": 13, "ratLife": 5 },
    "Brains": { "img": "Brains.gif", "ratExp": 13, "ratLife": 5 },
    "Death By Chocolate": { "img": "Death-By-Chocolate.gif", "ratExp": 11, "ratLife": 6 },
    "Spooky Biscuit": { "img": "Spooky-Biscuit.gif", "ratExp": 9, "ratLife": 7 },
    "Twozzlers": { "img": "Twozzlers.gif", "ratExp": 9, "ratLife": 7 },
    "Red Hot Chili Pepper": { "img": "Red-Hot-Chili-Pepper.gif", "ratExp": 9, "ratLife": 7 },
    "Longer-Lasting Gobstopper": { "img": "Longer-Lasting-Gobstopper.gif", "ratExp": 9, "ratLife": 7 },
    "Double Gorillas": { "img": "Double-Gorillas.gif", "ratExp": 9, "ratLife": 7 },
    "Double Falcons": { "img": "Double-Falcons.gif", "ratExp": 9, "ratLife": 7 },
    "Double Raptors": { "img": "Double-Raptors.gif", "ratExp": 9, "ratLife": 7 },
    "Triple Dipps": { "img": "Triple-Dipps.gif", "ratExp": 13, "ratLife": 5 },
    "Rainbow Balls": { "img": "Rainbow-Balls.gif", "ratExp": 11, "ratLife": 6 },
    "Wonka Quadra Candy Cane": { "img": "Wonka-Quadra-Candy-Cane.gif", "ratExp": 11, "ratLife": 6 },
};

const PrimesData = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];

const RatData = {
    "Two-Headed Rat": { "life": 60, "speed": 10, "attack": 11, "defense": 10, "mealsPerDay": 12, "maxMeals": 20 },
    "Shadow Rat": { "life": 90, "speed": 16, "attack": 14, "defense": 16, "mealsPerDay": 8, "maxMeals": 10 },
    "Vampire Rat": { "life": 10, "speed": 14, "attack": 6, "defense": 6, "mealsPerDay": 8, "maxMeals": 10 },
    "Golden Rat": { "life": 160, "speed": 18, "attack": 18, "defense": 18, "mealsPerDay": 8, "maxMeals": 10 },
    "Octo Rat": { "life": 80, "speed": 10, "attack": 10, "defense": 10, "mealsPerDay": 8, "maxMeals": 10 },
    "Gumshoe Rat": { "life": 110, "speed": 11, "attack": 8, "defense": 9, "mealsPerDay": 8, "maxMeals": 10 },
    "Old Rat": { "life": 30, "speed": 5, "attack": 7, "defense": 6, "mealsPerDay": 8, "maxMeals": 10 },
    "Winged Rat": { "life": 170, "speed": 13, "attack": 9, "defense": 7, "mealsPerDay": 8, "maxMeals": 10 },
    "Pincher Rat": { "life": 120, "speed": 13, "attack": 19, "defense": 19, "mealsPerDay": 8, "maxMeals": 10 },
    "Rat Bandit": { "life": 60, "speed": 15, "attack": 8, "defense": 7, "mealsPerDay": 8, "maxMeals": 10 },
    "Rollerderby Rat": { "life": 80, "speed": 19, "attack": 13, "defense": 8, "mealsPerDay": 8, "maxMeals": 10 },
    "Obese Rat": { "life": 60, "speed": 6, "attack": 10, "defense": 15, "mealsPerDay": 8, "maxMeals": 10 },
    "Space Rat": { "life": 140, "speed": 16, "attack": 16, "defense": 16, "mealsPerDay": 8, "maxMeals": 10 },
    "Breakdancing Rat": { "life": 70, "speed": 17, "attack": 10, "defense": 5, "mealsPerDay": 8, "maxMeals": 10 },
    "Country Rat": { "life": 100, "speed": 13, "attack": 15, "defense": 10, "mealsPerDay": 8, "maxMeals": 10 },
    "Ballerina Rat": { "life": 80, "speed": 16, "attack": 9, "defense": 6, "mealsPerDay": 8, "maxMeals": 10 },
    "Cave Rat": { "life": 90, "speed": 10, "attack": 13, "defense": 12, "mealsPerDay": 8, "maxMeals": 10 },
    "Raver Rat": { "life": 100, "speed": 14, "attack": 9, "defense": 9, "mealsPerDay": 8, "maxMeals": 10 },
    "Alcoholic Rat": { "life": 50, "speed": 9, "attack": 9, "defense": 8, "mealsPerDay": 8, "maxMeals": 10 },
    "Disco Rat": { "life": 90, "speed": 15, "attack": 11, "defense": 10, "mealsPerDay": 8, "maxMeals": 10 },
    "Boxing Rat": { "life": 100, "speed": 14, "attack": 20, "defense": 8, "mealsPerDay": 8, "maxMeals": 10 },
    "Pirate Rat": { "life": 110, "speed": 15, "attack": 17, "defense": 15, "mealsPerDay": 8, "maxMeals": 10 }
};

const RespectData = [
    { rank: 0, posTitle: "Hobo", negTitle: "Hobo", minRespect: 0 },
    { rank: 1, posTitle: "Homeless", negTitle: "Lowlife", minRespect: 5000 },
    { rank: 2, posTitle: "Bum", negTitle: "Delinquent", minRespect: 10000 },
    { rank: 3, posTitle: "Freeloader", negTitle: "Thug", minRespect: 20000 },
    { rank: 4, posTitle: "Drifter", negTitle: "Outcast", minRespect: 40000 },
    { rank: 5, posTitle: "Showered", negTitle: "Addict", minRespect: 80000 },
    { rank: 6, posTitle: "Citizen", negTitle: "Tramp", minRespect: 160000 },
    { rank: 7, posTitle: "Worker", negTitle: "Criminal", minRespect: 320000 },
    { rank: 8, posTitle: "Medic", negTitle: "Mental patient", minRespect: 640000 },
    { rank: 9, posTitle: "Preacher", negTitle: "Murderer", minRespect: 1000000 },
    { rank: 10, posTitle: "Actor", negTitle: "Hit man", minRespect: 1600000 },
    { rank: 11, posTitle: "Officer", negTitle: "Mass murderer", minRespect: 2800000 },
    { rank: 12, posTitle: "Peacemaker", negTitle: "Politician", minRespect: 4000000 },
    { rank: 13, posTitle: "John McClane", negTitle: "Freddy Kreuger", minRespect: 6000000 },
    { rank: 14, posTitle: "Organ Donor", negTitle: "Dexter", minRespect: 8000000 },
    { rank: 15, posTitle: "Hobo Jesus", negTitle: "Batman", minRespect: 10000000 }
];

const ChangelogData = {
    changes: [
        {
            version: "8.70",
            date: "2026-04-21",
            type: "Added",
            notes: [
                "Added Top Pagination links above the Gang Hitlist table (Previous Page, Last Viewed Page, Next Page)."
            ]
        },
        {
            version: "8.69",
            date: "2026-04-21",
            type: "Added",
            notes: [
                "Added an option to wrap long pagination lists on the Gang Hitlist into multiple lines to prevent horizontal scrolling.",
                "Added an option to automatically highlight players outside your attack range (level discrepancy > 200) on the Gang Hitlist."
            ]
        },
        {
            version: "8.68",
            date: "2026-04-20",
            type: "Changed",
            notes: [
                "Increased maximum height of the Saved Gang Posts & Payments panel in GangHelper for better visibility.",
                "The Saved Gang Posts & Payments panel now automatically scrolls to the next pending replier or payment action smoothly so you don't lose your place."
            ]
        },
        {
            version: "8.67",
            date: "2026-04-20",
            type: "Added",
            notes: [
                "Added Cans directly to the top navigation bar alongside Points and Tokens.",
                "The Cans icon uses CSS injection that correctly mimics native icon hover animations.",
                "Added a global number abbreviation function \\Utils.abbreviateNumber()\\ that formats large numbers into \\k\\ and \\m\\ suffixes for cleaner UI display."
            ]
        },
        {
            version: "8.66",
            date: "2026-04-20",
            type: "Added",
            notes: [
                "Added an \"Export All\" and \"Import\" functionality to the Gang Mass Mail templates (`GangHelper.js`), empowering users to easily backup, transfer, or share template data using clipboard JSON string arrays."
            ]
        }
    ]
};

const BackpackHelper = {
    staff: false,
    settings: [
        { key: 'BackpackHelper_Tooltips', label: 'Item Tooltips (Stats/Effects)' },
        { key: 'BackpackHelper_Favourites', label: 'Favourite Drinks UI' }
    ],
    init: function() {
        const settings = Utils.getSettings();

        const enableTooltips = settings['BackpackHelper_Tooltips'] !== false;
        const enableFavourites = settings['BackpackHelper_Favourites'] !== false;

        if (enableFavourites) {
            this.initDrinkStats();
        }

        this.observeBackpack(enableTooltips, enableFavourites);
    },

    initDrinkStats: function() {
        if (!localStorage.getItem('bh_drink_stats')) {
            localStorage.setItem('bh_drink_stats', JSON.stringify({}));
        }

        document.removeEventListener('click', this.handleDrinkClick);
        this.handleDrinkClick = (e) => {
            const a = e.target.closest('a');
            if (!a) return;
            const href = a.getAttribute('href') || '';
            const onclick = a.getAttribute('onclick') || '';
            const isDrink = href.includes('do=drink') || onclick.includes('do=drink');
            if (isDrink) {
                const img = a.querySelector('img');
                const name = img ? (img.getAttribute('alt') || img.title).trim() : a.textContent.trim();
                const src = img ? img.getAttribute('src') : '';
                if (name) {
                    let stats = JSON.parse(localStorage.getItem('bh_drink_stats') || '{}');
                    let current = stats[name];
                    if (typeof current === 'number') {
                        current = { count: current, src: src };
                    } else if (!current) {
                        current = { count: 0, src: src };
                    } else if (src && (!current.src || current.src.startsWith('data:'))) {
                        current.src = src;
                    }
                    current.count++;
                    stats[name] = current;
                    localStorage.setItem('bh_drink_stats', JSON.stringify(stats));
                }
            }
        };
        document.addEventListener('click', this.handleDrinkClick);
    },

    observeBackpack: function(enableTooltips, enableFavourites) {
        let drinkMap = null;
        let lastInjected = 0;

        const processItems = () => {
            const now = Date.now();
            if (enableFavourites && (now - lastInjected > 1000)) {
                this.injectFavourites();
                lastInjected = now;
            }

            if (!enableTooltips) return;

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

                const name = (img.getAttribute('alt') || img.title || '').trim();
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
    },

    injectFavourites: function() {
        let bpTable = null;
        const headers = Array.from(document.querySelectorAll('td[bgcolor="#CCCCCC"] b'));
        const usable = headers.find(el => el.textContent.includes('Usable'));
        if (usable) bpTable = usable.closest('table');

        if (!bpTable || bpTable.hasAttribute('data-bh-favorites-added')) return;
        
        bpTable.setAttribute('data-bh-favorites-added', 'true');

        let stats = JSON.parse(localStorage.getItem('bh_drink_stats') || '{}');
        const getCount = (val) => typeof val === 'number' ? val : (val ? val.count : 0);
        const sortedDrinks = Object.keys(stats).sort((a,b) => getCount(stats[b]) - getCount(stats[a])).slice(0, 5);

        if (sortedDrinks.length === 0) return;

        // we need to find the drink elements in the table
        const favRow = document.createElement('tr');
        favRow.innerHTML = `<td colspan="9" bgcolor="#CCCCCC"><div style="padding:3px;font-size:10pt; display:flex; justify-content:space-between;"><b>Favourite Drinks</b> <button id="bh_view_drink_stats" style="font-size:10px; cursor:pointer;" onclick="return false;">View Stats</button></div></td>`;

        const usableRow = Array.from(bpTable.querySelectorAll('tr')).find(tr => tr.querySelector('b') && tr.querySelector('b').textContent.includes('Usable'));
        if (!usableRow) return;

        usableRow.parentNode.insertBefore(favRow, usableRow);

        let tr = document.createElement('tr');
        let count = 0;

        // Build a map of drink names to their anchor elements to avoid nested DOM querying
        const drinkNodeMap = {};
        bpTable.querySelectorAll('img').forEach(img => {
            const name = (img.getAttribute('alt') || img.title || '').trim();
            if (name && !drinkNodeMap[name]) {
                const a = img.closest('a');
                if (a && ((a.getAttribute('href') || '').includes('do=drink') || (a.getAttribute('onclick') || '').includes('do=drink'))) {
                    drinkNodeMap[name] = { a, img };
                }
            }
        });

        sortedDrinks.forEach(drinkName => {
            const match = drinkNodeMap[drinkName];
            if (!match) return;

            const clonedA = match.a.cloneNode(true);
            const clonedImg = clonedA.querySelector('img');
            if (clonedImg) {
                clonedImg.width = 35;
                clonedImg.height = 35;
            }
            
            let td = document.createElement('td');
            td.onmouseover = function() { this.style.backgroundColor='#F3F3F3'; };
            td.onmouseout = function() { this.style.backgroundColor=''; };
            td.innerHTML = `<div align="left" class="bp-itm"></div>`;
            td.querySelector('.bp-itm').appendChild(clonedA);
            
            tr.appendChild(td);
            count++;

            if (count % 3 === 0) {
                usableRow.parentNode.insertBefore(tr, usableRow);
                tr = document.createElement('tr');
            }
        });

        if (count > 0 && count % 3 !== 0) {
            while (count % 3 !== 0) {
                const td = document.createElement('td');
                tr.appendChild(td);
                count++;
            }
            usableRow.parentNode.insertBefore(tr, usableRow);
        } else if (count === 0) {
            favRow.remove();
        }

        const statsBtn = document.getElementById('bh_view_drink_stats');
        if (statsBtn) {
            statsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showStatsModal();
            });
        }
    },

    showStatsModal: function() {
        let modal = document.getElementById('bh_drink_stats_modal');
        if (modal) {
            modal.remove();
        }

        let stats = JSON.parse(localStorage.getItem('bh_drink_stats') || '{}');
        const getCount = (val) => typeof val === 'number' ? val : (val ? val.count : 0);
        const getSrc = (name, val) => {
            if (val && val.src && !val.src.startsWith('data:')) return val.src;
            return `/images/items/gifs/${name.replace(/'/g, '').replace(/ /g, '-')}.gif`;
        };
        const sortedDrinks = Object.keys(stats).sort((a,b) => {
            const diff = getCount(stats[b]) - getCount(stats[a]);
            if (diff === 0) return a.localeCompare(b);
            return diff;
        });

        let html = `<div id="bh_drink_stats_modal" style="position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); background:#fff; color:#000; border:1px solid #ccc; padding:20px; z-index:9999; max-height:80%; overflow-y:auto; box-shadow:0 0 10px rgba(0,0,0,0.5); min-width: 250px;">
            <h3 style="margin-top: 0; padding-bottom: 10px; border-bottom: 1px solid #ddd;">Drink Stats</h3>
            <table width="100%" style="border-collapse: collapse; text-align: left;">
            ${sortedDrinks.map(d => `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 5px; width: 30px;"><img src="${getSrc(d, stats[d])}" alt="${d}" width="25" height="25" onerror="this.style.display='none'"></td>
                    <td style="padding: 5px; font-weight: bold;">${d}</td>
                    <td style="padding: 5px; text-align: right;">${getCount(stats[d])}</td>
                    <td style="padding: 5px; text-align: right; width: 30px;">
                        <button class="bh-drink-stats-remove" data-drink="${d.replace(/"/g, '&quot;')}" style="cursor: pointer; padding: 2px 6px; font-size: 10px; color: red; background: transparent; border: 1px solid red; border-radius: 3px; user-select: none; -webkit-user-select: none;" title="Remove this drink">X</button>
                    </td>
                </tr>`).join('')}
            </table>
            <br>
            <div style="text-align: center;">
                <button style="padding: 5px 15px; cursor: pointer; margin-right: 10px;" id="bh_drink_stats_reset">Reset</button>
                <button style="padding: 5px 15px; cursor: pointer;" onclick="document.getElementById('bh_drink_stats_modal').remove()">Close</button>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', html);

        const resetBtn = document.getElementById('bh_drink_stats_reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to reset all your drink stats?')) {
                    localStorage.setItem('bh_drink_stats', JSON.stringify({}));
                    this.showStatsModal();
                }
            });
        }

        document.querySelectorAll('.bh-drink-stats-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                let drink = e.target.getAttribute('data-drink');
                if (confirm(`Are you sure you want to remove stats for: ${drink}?`)) {
                    let currentStats = JSON.parse(localStorage.getItem('bh_drink_stats') || '{}');
                    delete currentStats[drink];
                    localStorage.setItem('bh_drink_stats', JSON.stringify(currentStats));
                    this.showStatsModal();
                }
            });
        });
    }
};

const DisplayHelper = {
    staff: false,
    settings: [
        { key: 'DisplayHelper_ImprovedAvatars', label: 'Enable Improved Avatars' },
        { key: 'DisplayHelper_CustomTitles', label: 'Enable Custom Player Titles', defaultValue: true },
        { key: 'DisplayHelper_ScrollableTopbar', label: 'Swipeable Topbar Menu (Mobile)', defaultValue: true },
        { key: 'DisplayHelper_WidenPage', label: 'Widen Content Area' },
        { key: 'DisplayHelper_PageWidth', label: 'Page Width (px)', type: 'number', defaultValue: 660, parent: 'DisplayHelper_WidenPage' },
        { key: 'DisplayHelper_AwakeNotify', label: 'Awake Full Notification (Desktop)', defaultValue: false },
        { key: 'DisplayHelper_AwakeNotifyInactive', label: 'Notify Only if Inactive (mins)', type: 'number', defaultValue: 30, parent: 'DisplayHelper_AwakeNotify' },
        { key: 'DisplayHelper_InterestingLevel', label: 'Show Next Interesting Level', defaultValue: true },
        { key: 'DisplayHelper_LiveAliveTime', label: 'Show Live Alive Time in Top Menu', defaultValue: true },
        { key: 'DisplayHelper_ShowCans', label: 'Show Cans in Top Menu', defaultValue: true }
    ],
    init: function() {
        const settings = Utils.getSettings();
        // This function only runs if the global helper is enabled,
        // and if this specific 'DisplayHelper' is enabled via SettingsHelper.
        if (settings['DisplayHelper_ImprovedAvatars'] !== false) {
            this.initImprovedAvatars();
        }
        if (settings['DisplayHelper_CustomTitles'] !== false) {
            this.initFakeQwee();
            this.initJackReacher();
            this.initGrabow();
            this.initPirateKingMugi();
            this.initUberLeetRoot();
            this.initSeventhHeaven();
        }
        if (settings['DisplayHelper_ScrollableTopbar'] !== false) {
            this.initScrollableTopbar();
        }
        if (settings['DisplayHelper_WidenPage'] === true) {
            const width = settings['DisplayHelper_PageWidth'] || 660;
            this.initWidenPage(width);
        }
        if (settings['DisplayHelper_AwakeNotify'] === true) {
            const waitMins = parseInt(settings['DisplayHelper_AwakeNotifyInactive'] || 30, 10);
            this.initAwakeNotification(waitMins);
        }
        if (settings['DisplayHelper_InterestingLevel'] !== false) {
            this.initInterestingLevel();
        }
        if (settings['DisplayHelper_LiveAliveTime'] !== false) {
            this.initLiveAliveTime();
        }
        if (settings['DisplayHelper_ShowCans'] !== false) {
            this.initShowCans();
        }
    },
    initShowCans: function() {
        if (!document.getElementById('hobohelper-cans-style')) {
            const style = document.createElement('style');
            style.id = 'hobohelper-cans-style';
            style.innerHTML = `
                .topbar .bmenu a .img.cans {
                    background-image: url('data:image/webp;base64,UklGRoIDAABXRUJQVlA4THUDAAAvO8AOEH+gqJEkZcm/QnrtHkogG2oCAGn4SUGLjdo/hN+2gwraSFKO//0bZAYNP/8BAADg/1/0YL9rnm3dY55tnWPsJUenlAh76AYQnfaAzrNta+RqwtB9geVdSxNOyUnFWDEzcw4zM58TZnCYE2u6oEdboq2to+fzD/D3jTQLAwa94deH+oj+M3DbSFGXt3vYgT+k/itl2y+ndvVOPJt+zRBCfJ20LSoJQSTEmoTzamGunD37uHExGQriwJxZH+6aUBT9k7Sj4sCL3dPBpJLxbpK9mvzE2T8cmFgxL6B8gptcEQs+PPnrnNnlYxaJfjyqD12j0xuXXn+76tOssZBtm4RpXvvMvPnbMfOKV8cTXfnS/ICsuR/QvLKOeaLiYnHbmmDh1uDto650+JtWvVvYecLcHpizywrgierFV8haWb446WpWQtdu5lBzYMfJT8rW/A8OlADEF1kQBfTbpB9oeBGALfqy3ccfr5j940MrXQAAYwC3TeYvvwRZHQ7rAqDrFnPIPiJq0ToacUkBqP+Wu1FjDroNeDLmO/8lwelQmZGQ5MNZONMDANGPUxD6ieUBVrpJArp24ZvxjVCO8ZMrdTyqCwDiQ4zRGX68eokr4Sw8nIioao+GHw8AHU7MygR/emhjPPp6UQFPFhYUoOsYiQ/m28wdZQ0g/NGVAGdbi4T/mJ5CImd/HSiAta3q9hyeZCFbdXTj5WAMZP50RuropheTcsyyD80Z9UGhEX/mht2+jk66kicMP6LJZHb5cL4uqBfEAM4AInM7WZc96OgDV2rOqK/k20JqoW2uhD22oHTdt5yj+Wh7FI4OFLDxPY8lphuejok2drpS30nflw5nPRWZ3JlxZdpGQDzysAJHXBD67SNdj6YV/RfETI+VeJHhn3n/sHf7e1fKhekHkjXq6vZo5CU/nkrQe9OdKjrEoDtjW2XlvF1Q+kz6sB9y+Eaox1nghRA6GrbEJQ7TDd8m6PB7D/GIccQiVdEYk3pFP3vUODK+5dCVicnPRd970h6zhPiI+I54TG6rdcmDPfaKlSCo1TwloqndPuwDdPOV8MCJGNHqWYHWNh2ofoXhDFNFRG7OCemGGMBjk3DR2oK2kE4br9yVXeazLY9DopvGa2GYvZiIiKyapLmj+pUqxIHeybDJEC/LZ6mk5YObRLdWpf4PJQUA') !important;
                    background-size: contain !important;
                    background-repeat: no-repeat !important;
                    background-position: center bottom !important;
                }
            `;
            document.head.appendChild(style);
        }

        const currencyUl = document.querySelector('.section.currency ul');
        const bmenuUl = document.querySelector('.section.bmenu ul');
        
        if (!currencyUl || !bmenuUl) return;

        let tokensLi = null;
        let cansCommentNode = null;
        let existingCansLi = null;

        currencyUl.childNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const text = node.textContent || '';
                if (text.includes('Tokens')) tokensLi = node;
                if (text.includes('Cans:')) existingCansLi = node;
            } else if (node.nodeType === Node.COMMENT_NODE) {
                if (node.nodeValue.includes('Cans:') || node.nodeValue.includes('displayCans')) {
                    cansCommentNode = node;
                }
            }
        });

        if (tokensLi) {
            tokensLi.classList.remove('no-mobile');
        }

        let targetCansLi = existingCansLi;
        if (cansCommentNode) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = '<ul>' + cansCommentNode.nodeValue + '</ul>';
            targetCansLi = tempDiv.querySelector('li');
            cansCommentNode.remove();
        }

        if (targetCansLi) {
            const span = targetCansLi.querySelector('.displayCans');
            let cValue = span ? span.textContent.trim() : '';
            if (!cValue) {
                const cMatch = targetCansLi.textContent.match(/[\d,]+/);
                cValue = cMatch ? cMatch[0] : '';
            }

            const aLink = targetCansLi.querySelector('a');
            const href = aLink ? aLink.getAttribute('href') : 'game.php?cmd=depo';
            
            const abbreviatedCans = Utils.abbreviateNumber(cValue);

            const bmenuCansLi = document.createElement('li');
            bmenuCansLi.classList.add('no-mobile');
            bmenuCansLi.innerHTML = `<a href="${href}" title="Go to Can Depot"><div class="img cans"></div>${abbreviatedCans}</a>`;
            bmenuUl.appendChild(bmenuCansLi);

            if (existingCansLi) {
                existingCansLi.remove();
            }
        }
    },
    initLiveAliveTime: function() {
        const topbarUl = document.querySelector('.topbar-menu ul');
        if (!topbarUl) return;
        
        const lifeLabel = document.getElementById('lifeValue');
        if (lifeLabel && lifeLabel.textContent.trim() === '0%') {
            localStorage.removeItem('hw_healing_last_used');
            return;
        }

        const lastHealSaved = localStorage.getItem('hw_healing_last_used');
        // Do not render anything if they have never healed/synced since the script update
        if (!lastHealSaved) return;

        const li = document.createElement('li');
        const displayLink = document.createElement('a');
        displayLink.href = '#';
        displayLink.style.cursor = 'default';
        displayLink.onclick = (e) => e.preventDefault();
        li.appendChild(displayLink);
        topbarUl.appendChild(li);

        const updateAliveTime = () => {
            const currentSaved = localStorage.getItem('hw_healing_last_used');
            if (!currentSaved) return;

            const elapsedSecs = Math.floor((Date.now() - parseInt(currentSaved, 10)) / 1000);
            if (elapsedSecs < 0) {
                displayLink.textContent = 'Alive: 00 secs';
                return;
            }

            const mins = Math.floor(elapsedSecs / 60);
            const secs = elapsedSecs % 60;
            
            let timeStr = 'Alive: ';
            if (mins > 0) {
                timeStr += `${mins.toString().padStart(2, '0')} min${mins === 1 ? '' : 's'} `;
            }
            timeStr += `${secs.toString().padStart(2, '0')} sec${secs === 1 ? '' : 's'}`;
            
            displayLink.textContent = timeStr;
        };

        updateAliveTime();
        setInterval(updateAliveTime, 1000);
    },
    initWidenPage: function(width) {
        const style = document.createElement('style');
        style.innerHTML = `
            .content-area {
                max-width: ${width}px !important;
                min-width: ${width}px !important;
            }
        `;
        document.head.appendChild(style);
    },
    initScrollableTopbar: function() {
        const style = document.createElement('style');
        style.innerHTML = `
            .topbar-menu, .topbar {
                overflow-x: auto;
                white-space: nowrap;
                -webkit-overflow-scrolling: touch;
            }
            .topbar-menu::-webkit-scrollbar, .topbar::-webkit-scrollbar {
                display: none;
            }
            .topbar-menu, .topbar {
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
            .topbar-menu > li, .topbar-menu > div, .topbar-menu > a {
                display: inline-block;
            }
        `;
        document.head.appendChild(style);

        // Optional mouse drag-to-scroll support for desktop testing
        const topbar = document.querySelector('.topbar-menu') || document.querySelector('.topbar');
        if (topbar) {
            let isDown = false;
            let startX;
            let scrollLeft;

            topbar.addEventListener('mousedown', (e) => {
                isDown = true;
                startX = e.pageX - topbar.offsetLeft;
                scrollLeft = topbar.scrollLeft;
            });
            topbar.addEventListener('mouseleave', () => { isDown = false; });
            topbar.addEventListener('mouseup', () => { isDown = false; });
            topbar.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - topbar.offsetLeft;
                const walk = (x - startX) * 2; // Scroll speed multiplier
                topbar.scrollLeft = scrollLeft - walk;
            });
        }
    },
    addTitleToPlayer: function(targetHoboId, plainTitle, styledTitle, position = 'prefix') {
        const playerLinks = document.querySelectorAll(`a[href*="cmd=player&ID=${targetHoboId}"]`);
        playerLinks.forEach(link => {
            if (!link.innerHTML.includes(plainTitle) && 
                !link.innerHTML.includes('<img') && 
                !link.classList.contains('pavatar') && 
                !link.innerHTML.includes('avatar-circle')) {
                if (position === 'suffix') {
                    link.innerHTML = link.innerHTML + ` ${styledTitle}`;
                } else {
                    link.innerHTML = `${styledTitle} ` + link.innerHTML;
                }
            }
        });
    },
    initFakeQwee: function() {
        this.addTitleToPlayer("2924510", "The Fake", `<span style="color: red; font-weight: bold; text-shadow: 1px 1px 2px black;">The Fake</span>`, 'prefix');
    },
    initJackReacher: function() {
        this.addTitleToPlayer("107380", "Major", `<span style="color: #00EE00; font-weight: bold; text-shadow: 1px 1px 2px black;">Major</span>`, 'prefix');
    },
    initGrabow: function() {
        this.addTitleToPlayer("1003713", "The", `<span style="color: #A71930; font-weight: bold;">The</span>`, 'prefix');
        this.addTitleToPlayer("1003713", "the Great", `<span style="color: #A71930; font-weight: bold;">the Great</span>`, 'suffix');
    },
    initPirateKingMugi: function() {
        this.addTitleToPlayer("1554846", "Pirate King", `<span style="color: red; font-weight: bold; text-shadow: 1px 1px 2px black;">Pirate King</span>`, 'prefix');
    },
    initUberLeetRoot: function() {
        const targetHoboId = "1140606";
        const playerLinks = document.querySelectorAll(`a[href*="cmd=player&ID=${targetHoboId}"]`);
        playerLinks.forEach(link => {
            if (!link.innerHTML.includes('1337') && 
                !link.innerHTML.includes('<img') && 
                !link.classList.contains('pavatar') && 
                !link.innerHTML.includes('avatar-circle')) {
                link.innerHTML = `<span style="color: #36ba01;">${link.innerHTML}</span> <span style="color: #0561CB; font-weight: bold; text-shadow: 1px 1px 2px black;">1337</span>`;
            }
        });
    },
    initSeventhHeaven: function() {
        this.addTitleToPlayer("2924238", "Нeaveп", `<span style="color: #40e0d0; font-weight: bold; text-shadow: 1px 1px 2px black;">Нeaveп</span>`, 'suffix');
    },
    initInterestingLevel: function() {
        const levelSpan = document.getElementById('statValueLvl');
        if (!levelSpan) return;

        const currentLevel = parseInt(levelSpan.textContent, 10);
        if (isNaN(currentLevel)) return;

        if (typeof PrimesData === 'undefined') {
            console.log("DisplayHelper: PrimesData is not defined.");
            return;
        }

        const nextPrime = PrimesData.find(p => p >= currentLevel);
        if (!nextPrime) return;

        const nextLvlSpan = document.createElement('span');
        nextLvlSpan.style.cssText = 'font-size: 11px; margin-left: 4px; font-style: italic; white-space: nowrap;';
        nextLvlSpan.title = 'The next interesting level';
        nextLvlSpan.innerHTML = `(<strong>${nextPrime}</strong>)`;

        levelSpan.appendChild(nextLvlSpan);
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
    },
    initAwakeNotification: function(inactiveWaitMins) {
        const awakeSpan = document.getElementById('awakeValue');
        if (!awakeSpan) return;

        const awakeMatch = awakeSpan.textContent.match(/(\d+)\/(\d+)/);
        if (!awakeMatch) return;

        const currentAwake = parseInt(awakeMatch[1], 10);
        const maxAwake = parseInt(awakeMatch[2], 10);

        let isDonator = false;
        if (document.documentElement.innerHTML.match(/var\s+donator=(\d+);/)) {
            const m = document.documentElement.innerHTML.match(/var\s+donator=(\d+);/);
            if (m && parseInt(m[1], 10) > 0) isDonator = true;
        } else if (document.documentElement.innerHTML.includes('Donator Days:')) {
            isDonator = true;
        }

        const now = Date.now();
        localStorage.setItem('hw_awake_last_active', now.toString());
        localStorage.setItem('hw_awake_current', currentAwake.toString());
        localStorage.setItem('hw_awake_max', maxAwake.toString());
        localStorage.setItem('hw_awake_is_donator', isDonator.toString());
        localStorage.removeItem('hw_awake_notified');

        if (currentAwake < maxAwake) {
            setInterval(() => {
                const lastActive = parseInt(localStorage.getItem('hw_awake_last_active') || '0', 10);
                const isNotified = localStorage.getItem('hw_awake_notified');
                if (isNotified) return;

                const inactiveMins = (Date.now() - lastActive) / 60000;
                const savedCurrent = parseInt(localStorage.getItem('hw_awake_current') || '0', 10);
                const savedMax = parseInt(localStorage.getItem('hw_awake_max') || '100', 10);
                const savedDonator = localStorage.getItem('hw_awake_is_donator') === 'true';

                const tickInterval = savedDonator ? 10 : 15;
                const ticks = Math.floor(inactiveMins / tickInterval);
                const estimatedAwake = Math.min(savedMax, savedCurrent + (ticks * 5));

                if (estimatedAwake >= savedMax && inactiveMins >= inactiveWaitMins) {
                    localStorage.setItem('hw_awake_notified', '1');
                    if (typeof GM_notification !== 'undefined') {
                        GM_notification({
                            title: 'HoboWars Awake Full',
                            text: 'Your Awakeness has reached its maximum. Time to play!',
                            timeout: 10000,
                            onclick: function() {
                                window.focus();
                            }
                        });
                    }
                }
            }, 60000);
        }
    }
};

const DrinksHelper = {
    staff: false,
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
    staff: false,
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
            if (throwBtn && !throwBtn.hasAttribute('data-fh-injected')) {
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
            }

            // Convert food list into a table
            this.buildFoodTable();
            
            // Reapply table check on mutations where DOM gets re-written (e.g., Living Area reload)
            const form = document.getElementById('throw_food');
            if (form && !form.hasAttribute('data-fh-table-injected')) {
                this.buildFoodTable();
            }
        };

        let rafId = null;
        const observer = new MutationObserver(() => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(bindButtons);
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
        // In the table format, it's inside td2 which is next padding sibling or child.
        // It's safer to just look inside the row.
        const tr = checkbox.closest('tr');
        if (tr) {
            const link = tr.querySelector('td:nth-child(2) a');
            if (link) {
                const img = link.querySelector('img');
                if (img && img.title) return img.title.trim();
                return link.textContent.trim();
            }
        }

        // Fallback for before table conversion or if structure differs
        const nextLink = checkbox.nextElementSibling;
        if (nextLink && nextLink.tagName === 'A') {
            const img = nextLink.querySelector('img');
            if (img && img.title) {
                return img.title.trim();
            }
            return nextLink.textContent.trim();
        }
        return null;
    },

    buildFoodTable: function() {
        const form = document.getElementById('throw_food');
        if (!form) return;
        
        // Prevent running multiple times
        if (form.hasAttribute('data-fh-table-injected')) return;
        form.setAttribute('data-fh-table-injected', 'true');

        const checkboxes = Array.from(form.querySelectorAll('input.checkMe'));
        if (checkboxes.length === 0) return;

        const table = document.createElement('table');
        table.style.width = 'auto';
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '10px';
        table.style.marginBottom = '10px';
        
        const tbody = document.createElement('tbody');
        table.appendChild(tbody);

        // Track where the first checkbox was to insert the table there
        const anchorNode = checkboxes[0];

        checkboxes.forEach((cb, index) => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid #ddd';
            const baseBg = index % 2 === 0 ? '#f9f9f9' : '#fff';
            tr.style.backgroundColor = baseBg;

            const updateHighlight = () => {
                if (cb.checked) {
                    tr.style.backgroundColor = '#e0e0e0';
                } else {
                    tr.style.backgroundColor = baseBg;
                }
            };
            cb.addEventListener('change', updateHighlight);

            const td1 = document.createElement('td');
            td1.style.padding = '8px 5px';
            td1.style.width = '30px';
            td1.style.textAlign = 'center';

            const td2 = document.createElement('td');
            td2.style.padding = '8px 5px';
            
            const td3 = document.createElement('td');
            td3.style.padding = '8px 5px';
            td3.style.textAlign = 'right';

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);

            // Collect all siblings until the next <br>
            let curr = cb.nextSibling;
            let nodeBatch = [];
            while (curr) {
                if (curr.nodeType === 1 && (curr.classList.contains('checkMe') || curr.id === 'checkAll')) {
                    break;
                }
                const isBr = curr.nodeType === 1 && curr.tagName === 'BR';
                nodeBatch.push(curr);
                curr = curr.nextSibling;
                if (isBr) break;
            }

            td1.appendChild(cb);
            
            nodeBatch.forEach(node => {
                if (node.nodeType === 1 && node.tagName === 'A' && node.textContent.trim() === 'Consume') {
                    node.classList.add('btn');
                    node.style.userSelect = 'none';
                    node.style.webkitUserSelect = 'none';
                    td3.appendChild(node);
                } else if (node.nodeType === 3) {
                    // Process text nodes to remove brackets around Consume
                    let text = node.textContent;
                    if (text.includes('[')) text = text.replace(/\[\s*$/, '');
                    if (text.includes(']')) text = text.replace(/^\s*\]/, '');
                    node.textContent = text;
                    if (text.trim() !== '') {
                        td2.appendChild(node);
                    } else if (node.parentNode) {
                        node.parentNode.removeChild(node);
                    }
                } else if (node.nodeType === 1 && node.tagName === 'BR') {
                    // Drop internal BRs that separate rows
                    if (node.parentNode) {
                        node.parentNode.removeChild(node);
                    }
                } else {
                    td2.appendChild(node);
                }
            });

            tbody.appendChild(tr);
        });

        if (anchorNode && anchorNode.parentNode === form) {
            form.insertBefore(table, anchorNode);
        } else {
            form.insertBefore(table, form.firstChild);
        }

        // Style the Check All button to contain the checkbox
        const checkAll = document.getElementById('checkAll');
        const toggleSpan = document.getElementById('toggleSpan');
        if (checkAll && toggleSpan && !checkAll.hasAttribute('data-fh-styled')) {
            checkAll.setAttribute('data-fh-styled', 'true');

            const btnLabel = document.createElement('label');
            btnLabel.className = 'btn';
            btnLabel.style.display = 'inline-flex';
            btnLabel.style.alignItems = 'center';
            btnLabel.style.cursor = 'pointer';
            btnLabel.style.userSelect = 'none';
            btnLabel.style.webkitUserSelect = 'none';
            btnLabel.style.marginRight = '10px';

            checkAll.style.margin = '0 5px 0 0';
            checkAll.style.cursor = 'pointer';

            // Insert label before the checkbox
            checkAll.parentNode.insertBefore(btnLabel, checkAll);

            // Move checkbox and span into the label
            btnLabel.appendChild(checkAll);
            btnLabel.appendChild(toggleSpan);

            // Remove previous <br> elements before checkAll if they exist
            let prevNode = btnLabel.previousSibling;
            while (prevNode) {
                if (prevNode.nodeType === 1 && prevNode.tagName === 'BR') {
                    const toDel = prevNode;
                    prevNode = prevNode.previousSibling;
                    toDel.parentNode.removeChild(toDel);
                } else if (prevNode.nodeType === 3 && prevNode.textContent.trim() === '') {
                    const toDel = prevNode;
                    prevNode = prevNode.previousSibling;
                    toDel.parentNode.removeChild(toDel);
                } else {
                    break;
                }
            }
        }

        // Trigger change on checkboxes to set initial state correctly
        checkboxes.forEach(cb => {
            const ev = new Event('change');
            cb.dispatchEvent(ev);
        });
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
    const DataModules = {
        DrinksData,
        EquipmentData,
        FoodData,
        PrimesData,
        RatData,
        RespectData,
        ChangelogData
    };

    const GlobalModules = {
        BackpackHelper,
        DisplayHelper,
        DrinksHelper,
        FoodHelper,
    };

    const PageModules = {
        ActiveListHelper,
        BankHelper,
        BernardsBasementHelper,
        CanDepoHelper,
        FoodBankHelper,
        FortSlugworthHelper,
        GangArmoryHelper,
        GangHelper,
        GangHitlistHelper,
        GangLoansHelper,
        HitlistHelper,
        HospitalHelper,
        KurtzCampHelper,
        LiquorStoreHelper,
        LivingAreaHelper,
        LockoutHelper,
        MarketHelper,
        MessageBoardHelper,
        MixerHelper,
        NorthernFenceHelper,
        PlayerHelper,
        RatsHelper,
        RecyclingBinHelper,
        SettingsHelper,
        SoupKitchenHelper,
        TattooParlorHelper,
        UniversityHelper,
        WeaponsHelper,
        WellnessClinicHelper,
    };

    // Alias for easy access across helpers if needed
    const Modules = Object.assign({}, DataModules, GlobalModules, PageModules);
    if (typeof window !== 'undefined') {
        window.HoboHelperModules = Modules;
        window.HoboHelperVersion = '8.70';
    }

    const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');

    // Cache the settings globally so individual modules do not repeatedly block the main thread on synchronous LocalStorage I/O during initialization
    if (typeof Utils !== 'undefined') {
        Utils.getSettings = function() { return savedSettings; };
    }

    const globalEnabled = savedSettings['global_enabled'] !== false;
    const urlParams = new URLSearchParams(window.location.search);
    const currentCmd = urlParams.get('cmd') || '';

    // To prevent DOM flash, run script at document-start, hide the document visually, apply modifications, then show it.
    if (document.documentElement) {
        document.documentElement.style.visibility = 'hidden';
    }

    const initModules = () => {
        // Initialize Global Modules first
        Object.entries(GlobalModules).forEach(([moduleName, module]) => {
            if (typeof module.alwaysInit === 'function') {
                module.alwaysInit();
            }

            if (typeof module.init === 'function') {
                const moduleEnabled = savedSettings[moduleName] !== false;
                
                if (globalEnabled && moduleEnabled) {
                    module.init();
                }
            }
        });

        // Filter and Initialize Page Modules in a single pass
        Object.entries(PageModules).forEach(([moduleName, module]) => {
            let isMatch = false;
            if (module.cmds === undefined || module.cmds === null) {
                isMatch = true;
            } else if (Array.isArray(module.cmds)) {
                isMatch = module.cmds.includes(currentCmd);
            } else {
                isMatch = module.cmds === currentCmd;
            }

            if (isMatch) {
                if (typeof module.alwaysInit === 'function') {
                    module.alwaysInit();
                }

                if (typeof module.init === 'function') {
                    const moduleEnabled = savedSettings[moduleName] !== false;

                    if (moduleName === 'SettingsHelper' || (globalEnabled && moduleEnabled)) {
                        module.init();
                    }
                }
            }
        });

        // Show document again after modifications
        if (document.documentElement) {
            document.documentElement.style.visibility = '';
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModules);
    } else {
        initModules();
    }
})();

