// ==UserScript==
// @name         HoboWars Helper Toolkit (Staff)
// @namespace    http://tampermonkey.net/
// @version      8.75
// @description  Provides HoboWars staff-only helper tools.
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
            version: "8.75",
            date: "2026-04-21",
            type: "Changed",
            notes: [
                "Converted the Recycling Bin Helper's quick-add buttons to be fully customizable dynamically from the page via an inline floating Configure panel instead of a native prompt. Users can create, delete, and modify their preferred numeric additions with ease."
            ]
        },
        {
            version: "8.74",
            date: "2026-04-21",
            type: "Changed",
            notes: [
                "Reverted the default build script output naming conventions to protect existing users. The standard non-staff features script is now correctly output to `hobo-helper-latest.user.js` again, while the all-inclusive bundle has been shifted to `hobo-helper-all-latest.user.js`."
            ]
        },
        {
            version: "8.73",
            date: "2026-04-21",
            type: "Added",
            notes: [
                "Added completely new GangBoardStaffHelper to streamline staff tasks directly from gang message boards.",
                "Added \"Save Repliers List\" on Gang message boards allowing staff to collect a quick list of everyone who has replied to a staff topic.",
                "Added \"Add Payment\" side panel strictly on topic replies to define specific event payouts directly over the thread natively, seamlessly exporting to the Gang Loans Manager.",
                "Organised project structure: Gang-specific admin scripts (GangStaffHelper, GangLoansHelper, and GangBoardStaffHelper) have been grouped and placed correctly within the `src/modules/page/staff/` directory.",
                "`GangHelper` was officially renamed to `GangStaffHelper` to reflect its access constraints and internal structures. All dashboard toggles now read properly for Staff members.",
                "Validated all remaining general member module scripts to guarantee that no staff-only logic was accidentally hidden inside the free tier."
            ]
        },
        {
            version: "8.72",
            date: "2026-04-21",
            type: "Changed",
            notes: [
                "Updated the release build outputs: standard release has been renamed to output/hobo-helper-member-latest.user.js, and output/hobo-helper-latest.user.js now compiles all available modules.",
                "Refactored build.ps1 DEV build argument passing logic, and it now generates outputs correctly incorporating all modules."
            ]
        },
        {
            version: "8.71",
            date: "2026-04-21",
            type: "Added",
            notes: [
                "Added a 3-build release system with per-build templates and build-time module filtering.",
                "Implemented script segregation so distinct production scripts are built independently for Standard Users and Staff members based on module configuration flags."
            ]
        }
    ]
};

const GangBoardStaffHelper = {
    cmds: 'gathering',
    staff: true,
    settings: [
        { key: 'GangBoardStaffHelper_Enable', label: 'Enable Gang Board Staff Tools' }
    ],
    init: function() {
        if (!Utils.isCurrentPage('do=vpost')) return;

        const settings = Utils.getSettings();
        if (settings?.GangBoardStaffHelper_Enable === false) return;

        this.initGangPostFeatures(settings);
    },

    initGangPostFeatures: function(settings) {
        let topicName = '';
        const titleEl = document.getElementById('thread-topic');
        if (titleEl) {
            topicName = titleEl.textContent.trim();
        } else {
            const pageText = document.body.textContent || "";
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

                const initSaved = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                const isAlreadyAdded = (initSaved[topicName] && initSaved[topicName].paymentsToHobos)
                    ? initSaved[topicName].paymentsToHobos.some(p => String(p.postId) === String(postId))
                    : false;

                if (isAlreadyAdded) {
                    btn.value = 'Added ✅';
                    btn.style.backgroundColor = '#d4edda';
                    btn.style.borderColor = '#c3e6cb';
                }

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
                        const idTextMatch = firstTd.textContent.match(/ID:\s*(\d+)/i);
                        if (idTextMatch) hoboId = idTextMatch[1];
                    }

                    let parsedAmount = '';
                    const messageText = secondTd.textContent || "";
                    const amountRegex = /(?:\$([\d,]+(?:\.\d+)?)\s*(k|m|mil|mill|million)?\b)|(?:([\d,]+(?:\.\d+)?)\s*(k|m|mil|mill|million)\b)/gi;

                    let dollarMatch = null;
                    let match;
                    while ((match = amountRegex.exec(messageText)) !== null) {
                        dollarMatch = match;
                    }

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

                    const savedPostsCheck = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                    const existingPayments = (savedPostsCheck[topicName] && savedPostsCheck[topicName].paymentsToHobos) ? savedPostsCheck[topicName].paymentsToHobos : [];
                    const existingPayment = existingPayments.find(p => String(p.postId) === String(postId));

                    let panel = document.getElementById('payment-panel-' + postId);
                    if (panel) {
                        panel.style.display = 'block';
                        document.getElementById(`pay-name-${postId}`).value = existingPayment ? existingPayment.hoboName : hoboName;
                        document.getElementById(`pay-id-${postId}`).value = existingPayment ? existingPayment.hoboId : hoboId;
                        document.getElementById(`pay-desc-${postId}`).value = existingPayment ? existingPayment.description : '';
                        document.getElementById(`pay-amt-${postId}`).value = existingPayment ? existingPayment.amount : parsedAmount;
                        document.getElementById(`pay-remove-${postId}`).style.display = existingPayment ? 'inline-block' : 'none';
                        document.getElementById(`pay-save-${postId}`).textContent = existingPayment ? 'Update' : 'Save';
                        return;
                    }

                    secondTd.style.position = 'relative';

                    const initName = existingPayment ? existingPayment.hoboName : hoboName;
                    const initId = existingPayment ? existingPayment.hoboId : hoboId;
                    const initDesc = existingPayment ? existingPayment.description : '';
                    const initAmt = existingPayment ? existingPayment.amount : parsedAmount;

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
                            <input type="text" id="pay-name-${postId}" value="${initName}" style="width:140px; font-size:11px;" />
                        </div>
                        <div style="margin-bottom:5px;">
                            <label style="display:inline-block; width:80px; font-weight:bold;">Hobo ID:</label>
                            <input type="text" id="pay-id-${postId}" value="${initId}" style="width:140px; font-size:11px;" />
                        </div>
                        <div style="margin-bottom:5px;">
                            <label style="display:inline-block; width:80px; font-weight:bold;">Description:</label>
                            <input type="text" id="pay-desc-${postId}" value="${initDesc}" style="width:140px; font-size:11px;" />
                        </div>
                        <div style="margin-bottom:10px;">
                            <label style="display:inline-block; width:80px; font-weight:bold;">Amount:</label>
                            <input type="text" id="pay-amt-${postId}" value="${initAmt}" style="width:140px; font-size:11px;" />
                        </div>
                        <div style="text-align:right;">
                            <button type="button" id="pay-remove-${postId}" style="cursor:pointer; font-weight:bold; margin-right:5px; padding:2px 8px; background:#fcc; border:1px solid #c88; border-radius:3px; display:${existingPayment ? 'inline-block' : 'none'};">Remove</button>
                            <button type="button" id="pay-save-${postId}" style="cursor:pointer; font-weight:bold; margin-right:5px; padding:2px 8px; background:#eee; border:1px solid #aaa; border-radius:3px;">${existingPayment ? 'Update' : 'Save'}</button>
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

                        const existingIdx = savedPosts[topicName].paymentsToHobos.findIndex(p => String(p.postId) === String(postId));
                        const newPaymentObj = {
                            postId: postId,
                            hoboName: hoboNameVal,
                            hoboId: hoboIdVal,
                            description: descVal,
                            amount: amtVal,
                            timestamp: Date.now()
                        };

                        if (existingIdx !== -1) {
                            const prev = savedPosts[topicName].paymentsToHobos[existingIdx];
                            newPaymentObj.completed = prev.completed;
                            newPaymentObj.cleared = prev.cleared;
                            savedPosts[topicName].paymentsToHobos[existingIdx] = newPaymentObj;
                        } else {
                            savedPosts[topicName].paymentsToHobos.push(newPaymentObj);
                        }

                        localStorage.setItem('hw_helper_gang_posts', JSON.stringify(savedPosts));

                        document.getElementById(`pay-remove-${postId}`).style.display = 'inline-block';

                        // Visual feedback
                        btn.value = 'Added ✅';
                        btn.style.backgroundColor = '#d4edda';
                        btn.style.borderColor = '#c3e6cb';

                        panel.style.display = 'none';
                    });

                    document.getElementById('pay-remove-' + postId).addEventListener('click', () => {
                        const savedPosts = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                        if (savedPosts[topicName] && savedPosts[topicName].paymentsToHobos) {
                            const existingIdx = savedPosts[topicName].paymentsToHobos.findIndex(p => String(p.postId) === String(postId));
                            if (existingIdx !== -1) {
                                savedPosts[topicName].paymentsToHobos.splice(existingIdx, 1);
                                localStorage.setItem('hw_helper_gang_posts', JSON.stringify(savedPosts));
                            }
                        }

                        btn.value = 'Add Payment';
                        btn.style.backgroundColor = '';
                        btn.style.borderColor = '';
                        document.getElementById(`pay-name-${postId}`).value = hoboName;
                        document.getElementById(`pay-id-${postId}`).value = hoboId;
                        document.getElementById(`pay-desc-${postId}`).value = '';
                        document.getElementById(`pay-amt-${postId}`).value = parsedAmount;
                        document.getElementById(`pay-remove-${postId}`).style.display = 'none';

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

const GangLoansHelper = {
    cmds: 'gang2',
    staff: true,
    init: function() {
        const isLoans = window.location.search.includes('cmd=gang2') && window.location.search.includes('do=loans');
        const isLoanAdd = window.location.search.includes('cmd=gang2') && window.location.search.includes('do=loan_add');
        const isLoanDel = window.location.search.includes('cmd=gang2') && window.location.search.includes('do=loan_del');

        if (!isLoans && !isLoanAdd && !isLoanDel) return;

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        if (isLoanAdd && contentArea.textContent.includes('You have successfully completed the transfer')) {
            const pendingStr = sessionStorage.getItem('hw_helper_pending_loan');
            if (pendingStr) {
                try {
                    const pending = JSON.parse(pendingStr);
                    const d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                    if (d[pending.topic]) {
                        if (pending.type === 'bulk' && d[pending.topic].hobos && d[pending.topic].hobos[pending.index]) {
                            d[pending.topic].hobos[pending.index].completed = true;
                        } else if (pending.type === 'payment' && d[pending.topic].paymentsToHobos && d[pending.topic].paymentsToHobos[pending.index]) {
                            d[pending.topic].paymentsToHobos[pending.index].completed = true;
                        }
                        localStorage.setItem('hw_helper_gang_posts', JSON.stringify(d));
                    }
                } catch (e) {
                    console.error('Error parsing pending loan', e);
                }
                sessionStorage.removeItem('hw_helper_pending_loan');
            }
        }

        if (isLoanDel && contentArea.textContent.includes('This loan has been removed')) {
            const pendingClearStr = sessionStorage.getItem('hw_helper_pending_clear');
            if (pendingClearStr) {
                try {
                    const pending = JSON.parse(pendingClearStr);
                    const d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                    if (d[pending.topic]) {
                        if (pending.type === 'bulk' && d[pending.topic].hobos && d[pending.topic].hobos[pending.index]) {
                            d[pending.topic].hobos[pending.index].cleared = true;
                        } else if (pending.type === 'payment' && d[pending.topic].paymentsToHobos && d[pending.topic].paymentsToHobos[pending.index]) {
                            d[pending.topic].paymentsToHobos[pending.index].cleared = true;
                        }
                        localStorage.setItem('hw_helper_gang_posts', JSON.stringify(d));
                    }
                } catch (e) {
                    console.error('Error parsing pending clear', e);
                }
                sessionStorage.removeItem('hw_helper_pending_clear');
            }
        }

        this.styleForms();
        this.renderPanel(contentArea);
    },

    styleForms: function() {
        const addForm = document.querySelector('form[action*="do=loan_add"]');
        if (addForm) {
            addForm.style.cssText = 'padding: 10px 0; display: grid; grid-template-columns: 120px 1fr; gap: 10px; align-items: center; max-width: 600px; margin-bottom: 20px;';

            // Clean up direct text nodes and <br>s
            addForm.querySelectorAll('br').forEach(br => br.remove());
            Array.from(addForm.childNodes).forEach(node => {
                if (node.nodeType === 3 && node.textContent.trim().includes('(optional)')) {
                    node.remove();
                }
            });

            // Style labels (strong tags)
            addForm.querySelectorAll('strong').forEach(s => {
                s.style.cssText = 'font-weight: bold; text-align: right; padding-right: 10px;';
            });

            // Make the 'To (Hobo ID):' and 'Amount:' inputs look nice
            const inputs = addForm.querySelectorAll('input:not([type="submit"]), select');
            inputs.forEach(input => {
                input.style.cssText = 'padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px; width: 100%; box-sizing: border-box; font-size: 13px;';
            });

            const hoboInput = addForm.querySelector('#hobo');
            const memsSelect = addForm.querySelector('#money-mems');
            if (hoboInput && memsSelect) {
                const wrapper = document.createElement('div');
                wrapper.style.cssText = 'display: flex; gap: 10px; width: 100%;';
                hoboInput.parentNode.insertBefore(wrapper, hoboInput);
                wrapper.appendChild(hoboInput);
                wrapper.appendChild(memsSelect);
                hoboInput.style.flex = '1';
                memsSelect.style.flex = '2';
            }

            const memoInput = addForm.querySelector('input[name="l_memo"]');
            if (memoInput) {
                memoInput.placeholder = '(optional)';
            }

            // Submit button styling
            const submitBtn = addForm.querySelector('input[type="submit"]');
            if (submitBtn) {
                submitBtn.style.cssText = 'grid-column: 2; padding: 8px 20px; background: #0055aa; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; width: fit-content; text-transform: uppercase; letter-spacing: 0.5px;';
                submitBtn.addEventListener('mouseover', () => submitBtn.style.background = '#004488');
                submitBtn.addEventListener('mouseout', () => submitBtn.style.background = '#0055aa');
            }
        }

        const clearForm = document.querySelector('form[action*="do=loan_del"]');
        if (clearForm) {
            clearForm.style.cssText = 'padding: 10px 0; display: grid; grid-template-columns: 120px 1fr; gap: 10px; align-items: center; max-width: 600px; margin-bottom: 20px;';

            clearForm.querySelectorAll('br').forEach(br => br.remove());

            clearForm.querySelectorAll('strong').forEach(s => {
                s.style.cssText = 'font-weight: bold; text-align: right; padding-right: 10px;';
            });

            const clearSelect = clearForm.querySelector('select[name="ID"]');
            if (clearSelect) {
                clearSelect.style.cssText = 'padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px; width: 100%; box-sizing: border-box; font-size: 13px;';
            }

            const clearSubmit = clearForm.querySelector('input[type="submit"]');
            if (clearSubmit) {
                clearSubmit.style.cssText = 'grid-column: 2; padding: 8px 20px; background: #cc0000; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; width: fit-content; text-transform: uppercase; letter-spacing: 0.5px;';
                clearSubmit.addEventListener('mouseover', () => clearSubmit.style.background = '#aa0000');
                clearSubmit.addEventListener('mouseout', () => clearSubmit.style.background = '#cc0000');
            }
        }
    },

    renderPanel: function(container) {
        const savedPosts = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
        const postKeys = Object.keys(savedPosts);

        const banksEl = document.getElementById('banks');
        const banksSelectHtml = banksEl ? banksEl.innerHTML : '';

        const panel = document.createElement('div');
        panel.style.cssText = 'border: 2px solid #336699; background: #eef5ff; padding: 15px; margin-bottom: 20px; border-radius: 5px; color: black; font-size: 13px; line-height: 1.4; max-height: 500px; overflow-y: auto;';

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
            emptyMsg.textContent = 'No saved gang posts or payments found.';
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
                const isBulkAmtMissing = hobos.length > 0 && !savedBulkAmt.trim();
                const disabledStyle = isBulkAmtMissing ? 'opacity: 0.5; cursor: not-allowed;' : 'cursor: pointer;';
                const disabledAttr = isBulkAmtMissing ? 'disabled="disabled"' : '';

                if (hobos.length > 0) {
                    exportBtnsHtml += `<button class="hw-export-repliers" data-topic="${topic}" data-ctrl="${safeTopicId}" ${disabledAttr} style="padding: 3px 8px; background: #e6f3ff; border: 1px solid #99c2ff; border-radius: 3px; font-size: 11px; color: #0055aa; margin-right: 5px; ${disabledStyle}">Export Saved Repliers</button>`;
                }
                if (payments.length > 0) {
                    exportBtnsHtml += `<button class="hw-export-payments" data-topic="${topic}" style="padding: 3px 8px; cursor: pointer; background: #e6f3ff; border: 1px solid #99c2ff; border-radius: 3px; font-size: 11px; color: #0055aa; margin-right: 5px;">Export Payments</button>`;
                }
                if (hobos.length > 0 || payments.length > 0) {
                    const isTotalBulkMissing = hobos.length > 0 && !savedBulkAmt.trim();
                    const totalDisabledStyle = isTotalBulkMissing ? 'opacity: 0.5; cursor: not-allowed;' : 'cursor: pointer;';
                    const totalDisabledAttr = isTotalBulkMissing ? 'disabled="disabled"' : '';
                    exportBtnsHtml += `<button class="hw-export-totals" data-topic="${topic}" data-ctrl="${safeTopicId}" ${totalDisabledAttr} style="padding: 3px 8px; background: #e6f3ff; border: 1px solid #99c2ff; border-radius: 3px; font-size: 11px; color: #0055aa; margin-right: 5px; ${totalDisabledStyle}">Export Totals</button>`;
                }

                const titleRow = document.createElement('div');
                titleRow.style.cssText = 'font-weight: bold; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; background: #f7faff; padding: 5px 8px; border-radius: 3px; border: 1px solid #e1eeff;';
                titleRow.innerHTML = `
                    <span style="font-size: 14px; color: #003366;">📝 Topic: ${topic}</span>
                    <div style="display:flex; align-items:center;">
                        ${exportBtnsHtml}
                        <button class="hw-delete-topic" data-topic="${topic}" style="padding: 3px 8px; cursor: pointer; background: #ffe6e6; border: 1px solid #ff9999; border-radius: 3px; font-size: 11px; color: #cc0000;">Remove</button>
                    </div>
                `;

                item.appendChild(titleRow);

                const savedBank = data.bankAccount || '';
                let bankOptions = banksSelectHtml;
                if (savedBank && bankOptions) {
                    // Replace the generic selected attribute if found, then set the correct one
                    bankOptions = bankOptions.replace(/selected(="selected"|="")?/g, '');
                    bankOptions = bankOptions.replace(`value="${savedBank}"`, `value="${savedBank}" selected`);
                }

                let dynamicTotalAmt = 0;
                payments.forEach(p => {
                    const amtParts = String(p.amount || '').replace(/[^0-9]/g, '');
                    dynamicTotalAmt += parseInt(amtParts, 10) || 0;
                });
                if (hobos.length > 0) {
                    const amtRaw = String(savedBulkAmt || '').replace(/[^0-9]/g, '');
                    const bulkAmt = parseInt(amtRaw, 10) || 0;
                    dynamicTotalAmt += (hobos.length * bulkAmt);
                }
                const formattedTotalInit = dynamicTotalAmt > 0 ? '$' + dynamicTotalAmt.toLocaleString() : '$0';

                const settingsRow = document.createElement('div');
                settingsRow.style.cssText = 'padding: 5px 8px; margin-bottom: 8px; background: #eef5ff; border: 1px solid #b3d4fc; border-radius: 3px; display: flex; align-items: center; justify-content: space-between; font-size: 13px;';
                settingsRow.innerHTML = `
                    <span><strong>Bank Account:</strong> <select class="hw-topic-bank" data-topic="${topic}" style="max-width: 250px; font-size: 13px; padding: 4px; margin-left: 5px;">${bankOptions}</select></span>
                    <span style="font-weight: bold; color: #0055aa; margin-left: 15px;">Total: <span id="total-amt-${safeTopicId}">${formattedTotalInit}</span></span>
                `;
                item.appendChild(settingsRow);

                if (hobos.length === 0 && payments.length === 0) {
                    const emptyRecord = document.createElement('div');
                    emptyRecord.style.fontStyle = 'italic';
                    emptyRecord.style.color = '#999';
                    emptyRecord.textContent = 'Empty record.';
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
                        const isCleared = h.cleared;
                        const rowBg = isCleared ? '#f0f0f0' : (isCompleted ? '#e6ffe6' : 'transparent');

                        let actionsHtml = '';
                        if (isCleared) {
                            actionsHtml = `<span style="color: #666; font-weight: bold; font-style: italic;">Completed</span>`;
                        } else if (!isCompleted) {
                            actionsHtml = `
                                <button class="hw-insert-bulk" data-id="${h.id}" data-ctrl="${safeTopicId}" data-topic="${topic}" data-index="${hIndex}" style="cursor:pointer; background:#e6f3ff; border:1px solid #99c2ff; border-radius:3px; padding:3px 8px; margin-right:4px;">Insert</button>
                                <button class="hw-complete-bulk" data-topic="${topic}" data-index="${hIndex}" style="cursor:pointer; background:#e6ffe6; border:1px solid #66cc66; border-radius:3px; padding:3px 8px; margin-right:4px;">Done</button>
                                <button class="hw-remove-bulk" data-topic="${topic}" data-index="${hIndex}" style="cursor:pointer; background:#ffe6e6; border:1px solid #ff9999; border-radius:3px; padding:3px 8px;">Remove</button>
                            `;
                        } else {
                            actionsHtml = `
                                <span style="color: #00aa00; font-weight: bold; margin-right: 8px;">Loan Created ✅</span>
                                <button class="hw-select-loan" data-id="${h.id}" data-type="bulk" data-ctrl="${safeTopicId}" data-topic="${topic}" data-index="${hIndex}" style="cursor:pointer; background:#fff2cc; border:1px solid #ffcc00; border-radius:3px; padding:3px 8px;">Select Loan</button>
                            `;
                        }

                        hobosHtml += `
                            <tr class="${(!isCompleted && !isCleared) ? 'hw-pending-action' : ''}" style="border-bottom: 1px solid #eee; background: ${rowBg};">
                                <td style="padding: 4px;">
                                    <a href="game.php?sr=${this.getSr()}&cmd=player&ID=${h.id}" target="_blank" style="text-decoration: none; color: #0055aa; font-weight: bold;">${h.name}</a> 
                                    <span style="color: #666; font-size: 11px;">[ID: ${h.id}]</span>
                                </td>
                                <td style="padding: 4px; text-align: right; white-space: nowrap;">
                                    ${actionsHtml}
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
                        const isCleared = p.cleared;
                        const rowBg = isCleared ? '#f0f0f0' : (isCompleted ? '#e6ffe6' : '#fff');

                        let payActionsHtml = '';
                        if (isCleared) {
                            payActionsHtml = `<span style="color: #666; font-weight: bold; font-style: italic;">Completed</span>`;
                        } else if (!isCompleted) {
                            payActionsHtml = `
                                <button class="hw-insert-payment" data-id="${hoboId}" data-amount="${p.amount || ''}" data-desc="${p.description || ''}" data-topic="${topic}" data-index="${pIndex}" style="cursor:pointer; background:#e6f3ff; border:1px solid #99c2ff; border-radius:3px; padding:3px 8px; margin-right:6px;">Insert</button>
                                <button class="hw-complete-payment" data-topic="${topic}" data-index="${pIndex}" style="cursor:pointer; background:#e6ffe6; border:1px solid #66cc66; border-radius:3px; padding:3px 8px; margin-right:6px;">Done</button>
                                <button class="hw-remove-payment" data-topic="${topic}" data-index="${pIndex}" style="cursor:pointer; background:#ffe6e6; border:1px solid #ff9999; border-radius:3px; padding:3px 8px;">Remove</button>
                            `;
                        } else {
                            payActionsHtml = `
                                <span style="color: #00aa00; font-weight: bold; margin-right: 8px;">Loan Created ✅</span>
                                <button class="hw-select-loan" data-id="${hoboId}" data-amount="${p.amount || ''}" data-type="payment" data-topic="${topic}" data-index="${pIndex}" style="cursor:pointer; background:#fff2cc; border:1px solid #ffcc00; border-radius:3px; padding:3px 8px;">Select Loan</button>
                            `;
                        }

                        payHtml += `
                            <tr class="${(!isCompleted && !isCleared) ? 'hw-pending-action' : ''}" style="background: ${rowBg}; border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 5px; border: 1px solid #ececec;"><a href="game.php?sr=${this.getSr()}&cmd=player&ID=${hoboId}" target="_blank" style="color:#0055aa;text-decoration:none;">${hoboId}</a></td>
                                <td style="padding: 5px; border: 1px solid #ececec;">${hoboName}</td>
                                <td style="padding: 5px; border: 1px solid #ececec; font-family: monospace; font-size: 13px;">${p.amount || ''}</td>
                                <td style="padding: 5px; border: 1px solid #ececec;">${p.description || ''}</td>
                                <td style="padding: 5px; border: 1px solid #ececec; text-align: center; white-space: nowrap;">
                                    ${payActionsHtml}
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
        panel.querySelectorAll('input[id^="amt-"]').forEach(input => {
            input.addEventListener('input', (e) => {
                const ctrlId = e.target.id.replace('amt-', '');
                const hasValue = e.target.value.trim() !== '';
                
                const exportRepliersBtn = panel.querySelector(`.hw-export-repliers[data-ctrl="${ctrlId}"]`);
                if (exportRepliersBtn) {
                    exportRepliersBtn.disabled = !hasValue;
                    exportRepliersBtn.style.opacity = hasValue ? '1' : '0.5';
                    exportRepliersBtn.style.cursor = hasValue ? 'pointer' : 'not-allowed';
                }
                
                const exportTotalsBtn = panel.querySelector(`.hw-export-totals[data-ctrl="${ctrlId}"]`);
                if (exportTotalsBtn) {
                    exportTotalsBtn.disabled = !hasValue;
                    exportTotalsBtn.style.opacity = hasValue ? '1' : '0.5';
                    exportTotalsBtn.style.cursor = hasValue ? 'pointer' : 'not-allowed';
                }

                // Update dynamic total
                const topicSpan = panel.querySelector('#total-amt-' + ctrlId);
                if (topicSpan) {
                    const topicBtn = exportTotalsBtn || exportRepliersBtn;
                    if (topicBtn) {
                        const topicStr = topicBtn.getAttribute('data-topic');
                        const d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                        const topicPayments = d[topicStr]?.paymentsToHobos || [];
                        const topicHobos = d[topicStr]?.hobos || [];

                        let totalNow = 0;
                        topicPayments.forEach(p => {
                            const amtParts = String(p.amount || '').replace(/[^0-9]/g, '');
                            totalNow += parseInt(amtParts, 10) || 0;
                        });

                        if (topicHobos.length > 0) {
                            const newBulkVal = e.target.value.replace(/[^0-9]/g, '');
                            const parsedBulk = parseInt(newBulkVal, 10) || 0;
                            totalNow += (topicHobos.length * parsedBulk);
                        }

                        topicSpan.textContent = totalNow > 0 ? '$' + totalNow.toLocaleString() : '$0';
                    }
                }
            });
        });

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

        panel.querySelectorAll('.hw-topic-bank').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const topic = e.target.getAttribute('data-topic');
                let d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                if (d[topic]) {
                    d[topic].bankAccount = e.target.value;
                    localStorage.setItem('hw_helper_gang_posts', JSON.stringify(d));
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
                    
                    const oldText = e.target.textContent;
                    e.target.textContent = 'Saved!';
                    setTimeout(() => { e.target.textContent = oldText; }, 2000);
                }
            });
        });

        const insertBtns = panel.querySelectorAll('.hw-insert-payment');
        insertBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                const index = parseInt(e.target.getAttribute('data-index'), 10);
                sessionStorage.setItem('hw_helper_pending_loan', JSON.stringify({topic, index, type: 'payment'}));

                const hoboField = document.getElementById('hobo');
                const amtField = document.getElementById('addAmt');
                const memoField = document.querySelector('input[name="l_memo"]');
                const bankField = document.getElementById('banks');

                if (hoboField) hoboField.value = e.target.getAttribute('data-id');
                if (amtField) amtField.value = e.target.getAttribute('data-amount').replace(/[^0-9.]/g, ''); // strip non-numeric just in case
                if (memoField) memoField.value = e.target.getAttribute('data-desc').substring(0, 60);

                let d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                if (bankField && d[topic] && d[topic].bankAccount) {
                    bankField.value = d[topic].bankAccount;
                }

                e.target.textContent = 'Inserted';
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
                const topic = e.target.getAttribute('data-topic');
                const index = parseInt(e.target.getAttribute('data-index'), 10);
                sessionStorage.setItem('hw_helper_pending_loan', JSON.stringify({topic, index, type: 'bulk'}));

                const ctrlId = e.target.getAttribute('data-ctrl');
                const bulkAmtInput = document.getElementById('amt-' + ctrlId);
                const bulkMemoInput = document.getElementById('memo-' + ctrlId);
                
                const hoboField = document.getElementById('hobo');
                const amtField = document.getElementById('addAmt');
                const memoField = document.querySelector('input[name="l_memo"]');
                const bankField = document.getElementById('banks');

                if (hoboField) hoboField.value = e.target.getAttribute('data-id');
                if (amtField && bulkAmtInput) amtField.value = bulkAmtInput.value.replace(/[^0-9]/g, '');
                if (memoField && bulkMemoInput) memoField.value = bulkMemoInput.value.substring(0, 60);

                let d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                if (bankField && d[topic] && d[topic].bankAccount) {
                    bankField.value = d[topic].bankAccount;
                }

                e.target.textContent = 'Inserted';
                window.scrollTo(0, document.body.scrollHeight);
            });
        });

        panel.querySelectorAll('.hw-complete-bulk').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                const index = parseInt(e.target.getAttribute('data-index'), 10);

                let d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                if (d[topic] && d[topic].hobos) {
                    d[topic].hobos[index].completed = true;
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
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    const oldText = btn.textContent;
                    btn.textContent = 'Copied!';
                    setTimeout(() => { btn.textContent = oldText; }, 2000);
                }).catch(err => {
                    console.error("Clipboard export failed", err);
                    alert("Clipboard export failed. Here is your text:\n\n" + text);
                });
            } else {
                // Fallback for older browsers or insecure contexts
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                try {
                    document.execCommand('copy');
                    const oldText = btn.textContent;
                    btn.textContent = 'Copied!';
                    setTimeout(() => { btn.textContent = oldText; }, 2000);
                } catch (e) {
                    alert("Clipboard export failed. Here is your text:\n\n" + text);
                }
                document.body.removeChild(ta);
            }
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
                const formattedAmt = bulkAmt > 0 ? bulkAmt.toLocaleString() : '0';
                
                const memoStr = memoInput && memoInput.value.trim() ? memoInput.value.trim() : 'No description';

                const dateStr = typeof Utils !== 'undefined' && Utils.getFormattedHoboDateTime ? Utils.getFormattedHoboDateTime() : 'Unknown Date';

                let hoboTotals = {};
                hobos.forEach(h => {
                    if (!hoboTotals[h.id]) hoboTotals[h.id] = 0;
                    hoboTotals[h.id] += bulkAmt;
                });

                let parts = Object.keys(hoboTotals).map(id => {
                    const totalForHobo = hoboTotals[id];
                    const formatted = totalForHobo > 0 ? totalForHobo.toLocaleString() : '0';
                    return `${dateStr} - [hoboname=${id}] - ${memoStr} - $${formatted}`;
                });

                copyToCb(parts.join('\n'), e.target);
            });
        });

        panel.querySelectorAll('.hw-export-payments').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                const d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                const payments = d[topic]?.paymentsToHobos || [];
                
                const dateStr = typeof Utils !== 'undefined' && Utils.getFormattedHoboDateTime ? Utils.getFormattedHoboDateTime() : 'Unknown Date';

                let parts = payments.map(p => {
                    const amtParts = String(p.amount || '').replace(/[^0-9]/g, '');
                    const amtInt = parseInt(amtParts, 10) || 0;
                    const formatted = amtInt > 0 ? amtInt.toLocaleString() : '0';
                    return `${dateStr} - [hoboname=${p.hoboId || p.id}] - ${p.description || 'No description'} - $${formatted}`;
                });
                
                copyToCb(parts.join('\n'), e.target);
            });
        });

        panel.querySelectorAll('.hw-export-totals').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                const ctrlId = e.target.getAttribute('data-ctrl');
                const d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                const payments = d[topic]?.paymentsToHobos || [];
                const hobos = d[topic]?.hobos || [];

                const dateStr = typeof Utils !== 'undefined' && Utils.getFormattedHoboDateTime ? Utils.getFormattedHoboDateTime() : 'Unknown Date';

                let totalAmt = 0;
                payments.forEach(p => {
                    const amtParts = String(p.amount || '').replace(/[^0-9]/g, '');
                    totalAmt += parseInt(amtParts, 10) || 0;
                });

                if (hobos.length > 0) {
                    const bulkInput = document.getElementById('amt-' + ctrlId);
                    const amtRaw = bulkInput ? bulkInput.value.replace(/[^0-9]/g, '') : (d[topic]?.bulkAmount || '').replace(/[^0-9]/g, '');
                    const bulkAmt = parseInt(amtRaw, 10) || 0;
                    totalAmt += (hobos.length * bulkAmt);
                }

                const formatted = totalAmt > 0 ? totalAmt.toLocaleString() : '0';
                const text = `${dateStr} - ${topic} - $${formatted}`;

                copyToCb(text, e.target);
            });
        });

        // BIND SELECT LOAN
        panel.querySelectorAll('.hw-select-loan').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hoboId = e.target.getAttribute('data-id');
                let amount = '';
                if (e.target.getAttribute('data-type') === 'bulk') {
                    const ctrlId = e.target.getAttribute('data-ctrl');
                    const bulkInput = document.getElementById('amt-' + ctrlId);
                    if (bulkInput) amount = bulkInput.value;
                } else {
                    amount = e.target.getAttribute('data-amount');
                }

                const tables = document.querySelectorAll('table[cellspacing="1"]');
                const lastTable = tables[tables.length - 1]; // The loans table is the last one
                if (!lastTable) return;

                const rows = lastTable.querySelectorAll('tr');
                let bestMatchId = null;
                const cleanTargetAmt = String(amount).replace(/[^0-9]/g, '');

                for (let row of rows) {
                    const link = row.querySelector(`a[href*="cmd=player&ID=${hoboId}"]`);
                    if (link) {
                        const toggle = row.querySelector('a.toggle[data-target^="td#td_"]');
                        if (toggle) {
                            const loanIdMatch = toggle.getAttribute('data-target').match(/td_(\d+)/);
                            if (loanIdMatch) {
                                const loanId = loanIdMatch[1];
                                const tds = row.querySelectorAll('td');
                                if (tds.length >= 3 && cleanTargetAmt) {
                                    // Parse only the text before a slash to avoid merging with limits
                                    const cellAmtText = tds[2].textContent.split('/')[0];
                                    const cleanRowAmt = cellAmtText.replace(/[^0-9]/g, '');

                                    if (cleanRowAmt === cleanTargetAmt) {
                                        bestMatchId = loanId;
                                        break;
                                    }
                                }
                                if (!bestMatchId) bestMatchId = loanId;
                            }
                        }
                    }
                }

                if (bestMatchId) {
                    const select = document.getElementById('clearLoan') || document.querySelector('select[name="ID"]');
                    if (select) {
                        select.value = bestMatchId;
                        window.scrollTo(0, select.offsetTop - 100);
                        const oldText = e.target.textContent;
                        e.target.textContent = 'Selected!';
                        setTimeout(() => { e.target.textContent = oldText; }, 2000);

                        const topic = e.target.getAttribute('data-topic');
                        const index = parseInt(e.target.getAttribute('data-index'), 10);
                        const type = e.target.getAttribute('data-type');
                        sessionStorage.setItem('hw_helper_selected_loan_for_clear', JSON.stringify({id: bestMatchId, topic, index, type}));
                    } else {
                        alert('Clear Loan dropdown not found.');
                    }
                } else {
                    alert('Could not locate a matching loan in the table.');
                }
            });
        });

        // BIND CLEAR LOAN SUBMISSION
        const clearForm = document.querySelector('form[action*="do=loan_del"]');
        if (clearForm) {
            clearForm.addEventListener('submit', () => {
                const select = clearForm.querySelector('select[name="ID"]');
                if (select) {
                    const val = select.value;
                    const storedStr = sessionStorage.getItem('hw_helper_selected_loan_for_clear');
                    if (storedStr) {
                        const stored = JSON.parse(storedStr);
                        if (stored.id === val) {
                            sessionStorage.setItem('hw_helper_pending_clear', JSON.stringify({topic: stored.topic, index: stored.index, type: stored.type}));
                        }
                    }
                }
            });
        }

        setTimeout(() => {
            const firstPending = panel.querySelector('.hw-pending-action');
            if (firstPending) {
                const panelRect = panel.getBoundingClientRect();
                const pendingRect = firstPending.getBoundingClientRect();
                const scrollPos = pendingRect.top - panelRect.top + panel.scrollTop - 40;
                if (scrollPos > 0) {
                    panel.scrollTo({
                        top: scrollPos,
                        behavior: 'smooth'
                    });
                }
            }
        }, 100);

    },

    getSr: function() {
        const match = window.location.search.match(/sr=(\d+)/);
        return match ? match[1] : '';
    }
};

const GangStaffHelper = {
    cmds: ['gang', 'gang2'],
    staff: true,
    settings: [
        { key: 'GangStaffHelper_FormatMassMails', label: 'Format Mass Mails' },
        { key: 'GangStaffHelper_MassMailTemplates', label: 'Mass Mail Templates' }
    ],
    init: function () {
        const queryParams = new URLSearchParams(window.location.search);
        const doParam = queryParams.get('do');
        const wParam = queryParams.get('w');

        if (doParam === 'enter') {
            this.handleGangEnter();
            this.handleCurrentHappenings();
        }

        const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');

        if (savedSettings['GangStaffHelper_EnableFeature'] !== false) {
            if (doParam === 'list_mem') {
                this.initGangMemberList();
            } else if (doParam === 'enter') {
                // Check if we are viewing the last gang happenings
                if (wParam === 'lastsh') {
                    this.initGangHappenings();
                }
            } else if (doParam === 'read_mail') {
                if (savedSettings['GangStaffHelper_FormatMassMails'] !== false) {
                    this.formatMassMail();
                }
            } else if (doParam === 'mail') {
                if (savedSettings['GangStaffHelper_MassMailTemplates'] !== false) {
                    this.initGangMassMail();
                }
            }
        }
    },

    initGangMassMail: function() {
        const form = document.querySelector('form[action*="do=mail"]');
        if (!form) return;

        let templates = JSON.parse(localStorage.getItem('hw_helper_gang_mail_templates') || '[]');
        let currentTemplateName = null;

        const panel = document.createElement('div');
        panel.style.cssText = 'margin-bottom: 15px; padding: 10px; border: 1px solid #ccc; background: #eee; font-family: Tahoma, sans-serif; text-align: left; max-width: 600px; display: flex; align-items: center; flex-wrap: wrap; gap: 8px;';

        const header = document.createElement('strong');
        header.textContent = 'Templates:';
        panel.appendChild(header);

        const templateSelect = document.createElement('select');
        templateSelect.style.padding = '2px';

        const updateSelect = () => {
            templateSelect.innerHTML = '<option value="">-- Select a Template --</option>';
            templates.forEach(t => {
                const opt = document.createElement('option');
                opt.value = t.name;
                opt.textContent = t.name;
                templateSelect.appendChild(opt);
            });
            if (currentTemplateName) {
                templateSelect.value = currentTemplateName;
            }
        };
        updateSelect();

        templateSelect.addEventListener('change', () => {
            currentTemplateName = templateSelect.value || null;
            updateSaveBtnText();
        });

        const loadBtn = document.createElement('button');
        loadBtn.textContent = 'Load';
        loadBtn.style.cssText = '-webkit-font-smoothing: antialiased; color: #636363; background: #ddd; font-weight: bold; text-decoration: none; padding: 3px 12px; border-radius: 3px; border: 0; cursor: pointer; -webkit-appearance: none; display: inline-block;';
        loadBtn.onmouseover = () => { loadBtn.style.color = '#fff'; loadBtn.style.background = '#1b9eff'; };
        loadBtn.onmouseout = () => { loadBtn.style.color = '#636363'; loadBtn.style.background = '#ddd'; };

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.style.cssText = '-webkit-font-smoothing: antialiased; color: #636363; background: #ddd; font-weight: bold; text-decoration: none; padding: 3px 12px; border-radius: 3px; border: 0; cursor: pointer; -webkit-appearance: none; display: inline-block;';
        delBtn.onmouseover = () => { delBtn.style.color = '#fff'; delBtn.style.background = '#d32f2f'; };
        delBtn.onmouseout = () => { delBtn.style.color = '#636363'; delBtn.style.background = '#ddd'; };

        const exportBtn = document.createElement('button');
        exportBtn.textContent = 'Export All';
        exportBtn.style.cssText = '-webkit-font-smoothing: antialiased; color: #636363; background: #ddd; font-weight: bold; text-decoration: none; padding: 3px 12px; border-radius: 3px; border: 0; cursor: pointer; -webkit-appearance: none; display: inline-block;';
        exportBtn.onmouseover = () => { exportBtn.style.color = '#fff'; exportBtn.style.background = '#1b9eff'; };
        exportBtn.onmouseout = () => { exportBtn.style.color = '#636363'; exportBtn.style.background = '#ddd'; };

        const importBtn = document.createElement('button');
        importBtn.textContent = 'Import';
        importBtn.style.cssText = '-webkit-font-smoothing: antialiased; color: #636363; background: #ddd; font-weight: bold; text-decoration: none; padding: 3px 12px; border-radius: 3px; border: 0; cursor: pointer; -webkit-appearance: none; display: inline-block;';
        importBtn.onmouseover = () => { importBtn.style.color = '#fff'; importBtn.style.background = '#1b9eff'; };
        importBtn.onmouseout = () => { importBtn.style.color = '#636363'; importBtn.style.background = '#ddd'; };

        const hintNote = document.createElement('div');
        hintNote.style.cssText = 'width: 100%; font-size: 11px; color: #555; margin-top: 5px;';
        hintNote.innerHTML = '<em>Hint: Use <strong>{date}</strong> (e.g. Apr 16) or <strong>{fullDate}</strong> (e.g. Apr 16 2026) in your template subject or body to automatically insert the date when loaded.</em>';

        panel.appendChild(templateSelect);
        panel.appendChild(loadBtn);
        panel.appendChild(delBtn);
        panel.appendChild(exportBtn);
        panel.appendChild(importBtn);
        panel.appendChild(hintNote);

        form.parentNode.insertBefore(panel, form);

        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn';
        saveBtn.style.cssText = 'margin-left: 10px; font-weight: bold; cursor: pointer;';

        const updateSaveBtnText = () => {
            saveBtn.textContent = currentTemplateName ? 'Update Template' : 'Save as Template';
        };
        updateSaveBtnText();

        const submitBtn = form.querySelector('input[type="submit"]');
        if (submitBtn) {
            submitBtn.parentNode.insertBefore(saveBtn, submitBtn.nextSibling);
        } else {
            form.appendChild(saveBtn);
        }

        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const subject = form.querySelector('input[name="subject"]').value;
            const body = form.querySelector('textarea[name="msg"]').value;
            const groupInput = form.querySelector('input[name="send_type"]:checked');
            const group = groupInput ? groupInput.value : 'all';

            const defaultName = currentTemplateName || subject || 'New Template';
            const name = prompt('Enter a name for this template (if you change the name, it will save as a new template):', defaultName);
            if (!name) return;

            const existingIndex = templates.findIndex(t => t.name === name);
            const templateData = { name, subject, body, group };
            if (existingIndex >= 0) {
                templates[existingIndex] = templateData;
            } else {
                templates.push(templateData);
            }

            templates.sort((a,b) => a.name.localeCompare(b.name));
            localStorage.setItem('hw_helper_gang_mail_templates', JSON.stringify(templates));

            currentTemplateName = name;
            updateSelect();
            updateSaveBtnText();
            alert('Template saved successfully!');
        });

        loadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const selected = templateSelect.value;
            if (!selected) return;
            const template = templates.find(t => t.name === selected);
            if (!template) return;
            
            const dateObj = (Utils.getHoboDateTime && Utils.getHoboDateTime()) || new Date();
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const shortDateStr = `${months[dateObj.getMonth()]} ${dateObj.getDate()}`;
            const fullDateStr = `${shortDateStr} ${dateObj.getFullYear()}`;
            
            const subjectInput = form.querySelector('input[name="subject"]');
            if (subjectInput) {
                let text = template.subject || '';
                text = text.replace(/\{fullDate\}/g, fullDateStr).replace(/\{date\}/g, shortDateStr);
                subjectInput.value = text;
            }
            
            const bodyInput = form.querySelector('textarea[name="msg"]');
            if (bodyInput) {
                let text = template.body || '';
                text = text.replace(/\{fullDate\}/g, fullDateStr).replace(/\{date\}/g, shortDateStr);
                bodyInput.value = text;
            }
            
            const groupInput = form.querySelector(`input[name="send_type"][value="${template.group}"]`);
            if (groupInput) groupInput.checked = true;
            
            currentTemplateName = template.name;
            updateSaveBtnText();
        });

        delBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const selected = templateSelect.value;
            if (!selected) return;
            if (!confirm(`Are you sure you want to delete template "${selected}"?`)) return;

            templates = templates.filter(t => t.name !== selected);
            localStorage.setItem('hw_helper_gang_mail_templates', JSON.stringify(templates));
            if (currentTemplateName === selected) {
                currentTemplateName = null;
            }
            updateSelect();
            updateSaveBtnText();
        });

        exportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (templates.length === 0) {
                alert('No templates to export!');
                return;
            }
            const dataStr = JSON.stringify(templates);
            if (navigator.clipboard) {
                navigator.clipboard.writeText(dataStr).then(() => {
                    alert('Templates exported to clipboard!');
                }).catch(err => {
                    fallbackCopy(dataStr);
                });
            } else {
                fallbackCopy(dataStr);
            }

            function fallbackCopy(text) {
                const ta = document.createElement('textarea');
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                try {
                    document.execCommand('copy');
                    alert('Templates exported to clipboard! (Fallback)');
                } catch (err) {
                    alert('Failed to copy to clipboard automatically. \n\nPlease copy manually:\n' + text);
                }
                document.body.removeChild(ta);
            }
        });

        importBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const input = prompt('Paste your exported templates JSON string here.\nWarning: This will overwrite existing templates with the same name.');
            if (!input) return;
            try {
                const imported = JSON.parse(input);
                if (!Array.isArray(imported)) throw new Error('Invalid format. Expected an array of templates.');
                
                let added = 0;
                let updated = 0;
                imported.forEach(impT => {
                    if (impT.name && impT.subject !== undefined && impT.body !== undefined && impT.group !== undefined) {
                        const existingIndex = templates.findIndex(t => t.name === impT.name);
                        if (existingIndex >= 0) {
                            templates[existingIndex] = impT;
                            updated++;
                        } else {
                            templates.push(impT);
                            added++;
                        }
                    }
                });
                
                if (added > 0 || updated > 0) {
                    templates.sort((a,b) => a.name.localeCompare(b.name));
                    localStorage.setItem('hw_helper_gang_mail_templates', JSON.stringify(templates));
                    updateSelect();
                    updateSaveBtnText();
                    alert(`Successfully imported templates!\\nAdded: ${added}\\nUpdated: ${updated}`);
                } else {
                    alert('No valid templates found to import.');
                }
            } catch (err) {
                alert('Failed to import: Invalid JSON data format.\\nError: ' + err.message);
            }
        });
    },

    formatMassMail: function() {
        const bTags = document.querySelectorAll('td > b, div > b');
        let sentToTd = null;
        for (const b of bTags) {
            if (b.textContent.includes('Sent to:')) {
                sentToTd = b.parentElement;
                break;
            }
        }
        
        if (!sentToTd) return;
        
        const htmlContent = sentToTd.innerHTML;
        const sentToPrefix = '<b>Sent to:</b>';
        if (!htmlContent.includes(sentToPrefix)) return;
        
        // Find the ul tag that contains the list
        const ulTag = sentToTd.querySelector('ul');
        if (!ulTag) return;
        
        let allUnread = 0;
        let allRead = 0;
        const records = [];
        
        // Parse the list items
        const liElements = ulTag.querySelectorAll('li');
        liElements.forEach(li => {
            const link = li.querySelector('a');
            if (link) {
                const url = link.getAttribute('href');
                const name = link.textContent.trim();
                const isUnread = li.textContent.includes('(unread)');
                const status = isUnread ? 'unread' : 'read';
                
                if (status === 'read') allRead++;
                else allUnread++;
                
                records.push({ url, name, status, originalHtml: link.innerHTML });
            }
        });
        
        if (records.length === 0) return;
        
        const style = document.createElement('style');
        style.textContent = `
            .mail-btn {
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
            }
            .mail-btn:hover {
                color: #fff;
                background: #1b9eff;
                box-shadow: 0 0 0 rgba(0,0,0,.4);
                animation: pulse 1.5s infinite;
            }
            .mail-btn.active {
                background: #bbb;
                color: #222;
            }
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(27, 158, 255, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(27, 158, 255, 0); }
                100% { box-shadow: 0 0 0 0 rgba(27, 158, 255, 0); }
            }
        `;
        document.head.appendChild(style);

        const container = document.createElement('div');
        container.style.marginTop = '10px';
        container.style.userSelect = 'none';
        container.style.WebkitUserSelect = 'none';
        
        const headerDiv = document.createElement('div');
        headerDiv.style.marginBottom = '10px';
        headerDiv.innerHTML = `
            <strong>Mass Mail Status:</strong> 
            <span style="color: green;">Read: ${allRead}</span> | 
            <span style="color: red;">Unread: ${allUnread}</span> | 
            Total: ${allRead + allUnread}
        `;
        
        const filterDiv = document.createElement('div');
        filterDiv.style.marginBottom = '10px';
        filterDiv.innerHTML = `
            <button id="show-all-mail" class="mail-btn active">Show All</button>
            <button id="show-read-mail" class="mail-btn">Show Read</button>
            <button id="show-unread-mail" class="mail-btn">Show Unread</button>
        `;
        
        const table = document.createElement('table');
        table.className = 'table gang-mail-table';
        table.style.width = '100%';
        table.style.marginTop = '10px';
        
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr class="header">
                <th style="text-align: left; padding: 5px;">Hobo</th>
                <th style="text-align: left; padding: 5px;">Status</th>
            </tr>
        `;
        table.appendChild(thead);
        
        const tbody = document.createElement('tbody');
        records.forEach((r, i) => {
            const tr = document.createElement('tr');
            tr.className = `mail-row ${r.status} ${i % 2 === 0 ? 'even' : 'odd'}`;
            tr.innerHTML = `
                <td style="padding: 5px;"><a href="${r.url}">${r.originalHtml}</a></td>
                <td style="padding: 5px; color: ${r.status === 'read' ? 'green' : 'red'}; font-weight: bold;">${r.status.toUpperCase()}</td>
            `;
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        
        container.appendChild(headerDiv);
        container.appendChild(filterDiv);
        container.appendChild(table);
        
        // Replace the ul with our new container
        ulTag.replaceWith(container);
        
        const updateButtonStyles = (activeId) => {
            const btns = [
                sentToTd.querySelector('#show-all-mail'),
                sentToTd.querySelector('#show-read-mail'),
                sentToTd.querySelector('#show-unread-mail')
            ];
            btns.forEach(btn => {
                if (btn.id === activeId) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        };
        
        // Add event listeners for filters
        sentToTd.querySelector('#show-all-mail').addEventListener('click', (e) => {
            e.preventDefault();
            updateButtonStyles('show-all-mail');
            sentToTd.querySelectorAll('.mail-row').forEach(row => row.style.display = '');
            this.recolorRows(sentToTd);
        });
        
        sentToTd.querySelector('#show-read-mail').addEventListener('click', (e) => {
            e.preventDefault();
            updateButtonStyles('show-read-mail');
            sentToTd.querySelectorAll('.mail-row').forEach(row => {
                row.style.display = row.classList.contains('read') ? '' : 'none';
            });
            this.recolorRows(sentToTd);
        });
        
        sentToTd.querySelector('#show-unread-mail').addEventListener('click', (e) => {
            e.preventDefault();
            updateButtonStyles('show-unread-mail');
            sentToTd.querySelectorAll('.mail-row').forEach(row => {
                row.style.display = row.classList.contains('unread') ? '' : 'none';
            });
            this.recolorRows(sentToTd);
        });
    },
    
    recolorRows: function(container) {
        let visibleIndex = 0;
        container.querySelectorAll('.mail-row').forEach(row => {
            if (row.style.display !== 'none') {
                row.className = row.className.replace(/\b(even|odd)\b/g, '').trim();
                row.classList.add(visibleIndex % 2 === 0 ? 'even' : 'odd');
                visibleIndex++;
            }
        });
    },

    initGangMemberList: function() {
        console.log("GangStaffHelper loaded on member list page.");

        const style = document.createElement('style');
        style.textContent = `
            #sortabletable tbody tr.even td { background-color: #f3f3f3; }
            #sortabletable tbody tr.odd td { background-color: #ffffff; }
            #sortabletable tbody tr:hover td { background-color: #e8f4f8; }
        `;
        document.head.appendChild(style);

        let mainNav = document.querySelector('a.nav.show1');
        let battleNav = document.querySelector('a.nav.show2');
        let otherNav = document.querySelector('a.nav.show3');
        let hofNav = document.querySelector('a.nav.show4');

        // Non-staff only have main and hall of fame, so only require mainNav
        if (!mainNav) return;

        const navParent = mainNav.parentNode;
        Array.from(navParent.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue.includes('-')) {
                node.nodeValue = node.nodeValue.replace(/-/g, '');
            }
        });

        const turnIntoButton = (nav) => {
            if (!nav) return null;
            const btn = document.createElement('button');
            btn.textContent = nav.textContent;
            btn.style.cssText = 'font-size: 11px; padding: 4px 8px; border: 1px solid #aaa; border-radius: 4px; cursor: pointer; margin: 0 4px; user-select: none; -webkit-user-select: none;';
            
            if (nav.style.fontWeight === 'bold') {
                btn.style.fontWeight = 'bold';
                btn.style.background = '#add8e6';
                btn.style.borderColor = '#5f9ea0';
            } else {
                btn.style.fontWeight = 'normal';
                btn.style.background = '#fff';
                btn.style.borderColor = '#aaa';
            }
            
            nav.replaceWith(btn);
            return btn;
        };

        const availableNavs = [];
        mainNav = turnIntoButton(mainNav); if (mainNav) availableNavs.push(mainNav);
        battleNav = turnIntoButton(battleNav); if (battleNav) availableNavs.push(battleNav);
        otherNav = turnIntoButton(otherNav); if (otherNav) availableNavs.push(otherNav);
        hofNav = turnIntoButton(hofNav); if (hofNav) availableNavs.push(hofNav);

        const table = document.getElementById('sortabletable');
        if (!table) return;

        const headers = Array.from(table.querySelectorAll('th'));
        const cols = [];
        headers.forEach((th, index) => {
            const classList = Array.from(th.classList);
            const tsClass = classList.find(c => c.startsWith('ts_'));
            if (tsClass) {
                // Use textContent instead of innerText because innerText is empty for display:none elements
                let colName = th.textContent.replace(/↓/g, '').trim();
                if (!colName) {
                    colName = tsClass.replace('ts_', '');
                }
                cols.push({
                    id: tsClass,
                    name: colName,
                    index: index
                });
            }
        });

        const panel = document.createElement('div');
        panel.style.cssText = 'margin-bottom: 10px; padding: 10px; border: 1px solid #ccc; background: #eee; font-family: Tahoma, sans-serif; text-align: left; display: flex; flex-wrap: wrap; gap: 8px;';
        
        const savedColsStr = localStorage.getItem('hw_helper_gang_cols');
        const availableColIds = cols.map(c => c.id);
        let selectedCols = savedColsStr ? JSON.parse(savedColsStr) : ['ts_name', 'ts_level', 'ts_age', 'ts_la', 'ts_chamber', 'ts_tired', 'ts_options'];
        
        // Filter out any columns that aren't available to this user
        selectedCols = selectedCols.filter(id => availableColIds.includes(id));

        const renderCols = () => {
            cols.forEach(col => {
                const isSelected = selectedCols.includes(col.id);
                // The actual cells have the same class name
                const cells = table.querySelectorAll(`.${col.id}`);
                cells.forEach(cell => {
                    cell.style.display = isSelected ? 'table-cell' : 'none';
                });
            });
            localStorage.setItem('hw_helper_gang_cols', JSON.stringify(selectedCols));
        };

        const updateCheckboxes = () => {
            cols.forEach(col => {
                const cb = document.getElementById(`hh_col_${col.id}`);
                if (cb) {
                    cb.checked = selectedCols.includes(col.id);
                    // Trigger change event to update button styles automatically
                    cb.dispatchEvent(new Event('change'));
                }
            });
        };

        cols.forEach(col => {
            const label = document.createElement('label');
            label.style.cssText = 'font-size: 11px; display: inline-flex; align-items: center; cursor: pointer; user-select: none; -webkit-user-select: none; padding: 4px 8px; border: 1px solid #aaa; border-radius: 4px; background: #ddd; transition: background 0.2s, border-color 0.2s;';
            
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.id = `hh_col_${col.id}`;
            cb.style.marginRight = '5px';
            cb.checked = selectedCols.includes(col.id);
            if (col.id === 'ts_name') cb.disabled = true; // Always show name

            const updateStyle = () => {
                if (cb.checked) {
                    label.style.background = '#add8e6';
                    label.style.borderColor = '#5f9ea0';
                } else {
                    label.style.background = '#ddd';
                    label.style.borderColor = '#aaa';
                }
            };
            updateStyle();

            cb.addEventListener('change', (e) => {
                if (e.target.checked) {
                    if (!selectedCols.includes(col.id)) selectedCols.push(col.id);
                } else {
                    selectedCols = selectedCols.filter(id => id !== col.id);
                }
                updateStyle();
                renderCols();
            });

            label.appendChild(cb);
            label.appendChild(document.createTextNode(col.name));
            panel.appendChild(label);
        });

        const showAllBtn = document.createElement('button');
        showAllBtn.textContent = 'Show All';
        showAllBtn.style.cssText = 'font-size: 11px; padding: 4px 8px; border: 1px solid #aaa; border-radius: 4px; background: #fff; cursor: pointer; font-weight: normal; margin-left: auto;';
        showAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            selectedCols = cols.map(c => c.id);
            updateCheckboxes();
            renderCols();
            [...availableNavs, showAllBtn].forEach(n => {
                n.style.fontWeight = 'normal';
                n.style.background = '#fff';
                n.style.borderColor = '#aaa';
            });
            showAllBtn.style.fontWeight = 'bold';
            showAllBtn.style.background = '#add8e6';
            showAllBtn.style.borderColor = '#5f9ea0';
        });
        panel.appendChild(showAllBtn);

        table.parentElement.insertBefore(panel, table);
        renderCols(); // initial render

        const hookNav = (nav, presetCols) => {
            if (!nav) return;
            // override the onclick
            nav.addEventListener('click', (e) => {
                e.preventDefault();
                selectedCols = presetCols.filter(c => availableColIds.includes(c));
                updateCheckboxes();
                renderCols();
                
                // update font weights
                [...availableNavs, showAllBtn].forEach(n => {
                    n.style.fontWeight = 'normal';
                    n.style.background = '#fff';
                    n.style.borderColor = '#aaa';
                });
                nav.style.fontWeight = 'bold';
                nav.style.background = '#add8e6';
                nav.style.borderColor = '#5f9ea0';
            });
        };

        hookNav(mainNav, ['ts_name', 'ts_level', 'ts_age', 'ts_la', 'ts_chamber', 'ts_tired', 'ts_options']);
        hookNav(battleNav, ['ts_name', 'ts_speed', 'ts_power', 'ts_strength', 'ts_tbs', 'ts_life', 'ts_options']);
        hookNav(otherNav, ['ts_name', 'ts_beg', 'ts_intel', 'ts_drinking', 'ts_mining', 'ts_options']);
        hookNav(hofNav, ['ts_name', 'ts_exp', 'ts_beg_income', 'ts_cash', 'ts_points', 'ts_tokens', 'ts_dps', 'ts_options']);
        
        // Remove the original script functions if possible, but overriding onclick and preventing default should be enough.
    },

    initGangHappenings: function() {
        console.log("GangStaffHelper loaded on last happenings page.");

        // Verify this is the correct event by checking the raw HTML Structure
        const htmlContent = document.body.innerHTML || "";
        const isSundayFunday = /<b>\s*<u>Last Gang Happening Stats:<\/u><\/b>\s*Gangsters Sunday = Funday/i.test(htmlContent);

        if (!isSundayFunday) {
            console.log("GangStaffHelper: Event is not 'Gangsters Sunday = Funday'. Aborting.");
            return;
        }

        // Verify user is Gang Staff by checking for Manage Loans access
        const isStaff = !!document.querySelector('a[href*="cmd=gang2&do=loans"]');
        if (!isStaff) {
            console.log("GangStaffHelper: User is not Gang Staff. Aborting.");
            return;
        }

        console.log("GangStaffHelper: 'Gangsters Sunday = Funday' event detected! Ready for next steps.");

        const table = document.querySelector('table[cellspacing="2"][cellpadding="3"]');
        if (!table) return;

        this.renderTierSettingsPanel(table, false);
    },

    renderTierSettingsPanel: function(table, isCurrent) {
        const panel = document.createElement('div');
        panel.style.cssText = 'margin-bottom: 15px; padding: 10px; border: 1px solid #ccc; background: #eee; font-family: Tahoma, sans-serif; text-align: left; max-width: 600px;';

        let savedTiers = JSON.parse(localStorage.getItem('hw_helper_sf_tiers') || '[]');
        if (savedTiers.length === 0) {
            savedTiers = [
                { min: 0, max: 100, rate: 60000 },
                { min: 100, max: 200, rate: 80000 },
                { min: 200, max: 300, rate: 100000 }
            ];
        }
        let maxPayout = parseInt(localStorage.getItem('hw_helper_sf_max') || '5000000', 10);

        let panelHtml = `
            <div style="font-weight: bold; margin-bottom: 10px; font-size: 14px;">Gangsters Sunday = Funday Payouts ${isCurrent ? '(Projected)' : ''}</div>
            <div class="hh_sf_tiers_container" style="margin-bottom: 10px;">
            </div>
            <div style="margin-bottom: 10px;">
                <button type="button" class="hh_sf_add_tier_btn" style="padding: 2px 6px; cursor: pointer; font-size: 11px;">+ Add Tier</button>
            </div>
            <label style="font-size: 11px; margin-right: 10px; font-weight: bold;">
                Max Payout per Hobo ($): 
                <input type="text" class="hh_sf_max" value="${maxPayout.toLocaleString()}" style="width: 100px; padding: 2px;">
            </label>
            <div style="margin-top: 15px;" class="hh_sf_action_area">
                <button type="button" class="hh_sf_save_tiers_btn" style="padding: 4px 10px; cursor: pointer; font-weight: bold; background: #ddd; border: 1px solid #999; border-radius: 3px;">
                    💾 Save Tier Settings
                </button>
                <span class="hh_sf_tiers_status" style="font-size: 11px; font-weight: bold; color: green; margin-left: 10px;"></span>
            </div>
            <div style="margin-top: 10px;" class="hh_sf_payout_area">
                <div style="font-size: 13px; font-weight: bold; color: green; margin-bottom: 5px;" class="hh_sf_projected_total">
                    ${isCurrent ? 'Projected Total' : 'Final Total'}: calculating...
                </div>
                ${!isCurrent ? 
                    `<button type="button" class="hh_sf_save_btn" style="padding: 4px 10px; cursor: pointer; font-weight: bold; background: #ddd; border: 1px solid #999; border-radius: 3px;">
                        💰 Push Payouts to Dashboard
                    </button>
                    <span class="hh_sf_status" style="font-size: 11px; font-weight: bold; color: green; margin-left: 10px;"></span>` : ''
                }
            </div>
        `;
        panel.innerHTML = panelHtml;
        table.parentElement.insertBefore(panel, table);

        const tiersContainer = panel.querySelector('.hh_sf_tiers_container');

        const calculateTotalPayout = () => {
            const currentMaxPayoutStr = panel.querySelector('.hh_sf_max').value;
            const currentMaxPayout = parseInt(currentMaxPayoutStr.replace(/,/g, ''), 10) || 0;
            let total = 0;

            const payments = [];
            const isScoresTable = isCurrent;

            // Handle both table formats
            let rows;
            if (isScoresTable) {
                 rows = table.querySelectorAll('tr'); // First row is header, but points will parse NaN so it's safe
                 const headerRow = rows[0];
                 if (headerRow && !headerRow.querySelector('.hh_sf_payout_header')) {
                     const th = document.createElement('td');
                     th.className = 'hh_sf_payout_header';
                     th.innerHTML = '<b>Payout</b>';
                     th.align = 'right';
                     headerRow.appendChild(th);
                 }
            } else {
                 rows = table.querySelectorAll('tr[bgcolor="#F3F3F3"], tr[bgcolor="#DCDCDC"]');
                 const allRows = table.querySelectorAll('tr');
                 for (let i = 0; i < allRows.length; i++) {
                     if (allRows[i].textContent.includes('Hobo') && allRows[i].textContent.includes('Score')) {
                         if (!allRows[i].querySelector('.hh_sf_payout_header')) {
                             const th = document.createElement('td');
                             th.className = 'hh_sf_payout_header';
                             th.innerHTML = '<b>Payout</b>';
                             th.align = 'right';
                             allRows[i].appendChild(th);
                         }
                         break;
                     }
                 }
            }

            Array.from(rows).forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length < 2) return;

                const link = cells[0].querySelector('a');
                if (!link) return;

                const nameText = link.textContent.trim();
                const urlParams = new URLSearchParams(link.href.split('?')[1]);
                const hoboId = urlParams.get('ID');

                const scoreText = cells[1].textContent.replace(/,/g, '').trim();
                const score = parseInt(scoreText, 10);

                let payout = 0;
                if (hoboId && !isNaN(score) && score > 0) {
                    savedTiers.forEach(tier => {
                        if (score > tier.min) {
                            const ptsInTier = Math.min(score, tier.max) - tier.min;
                            if (ptsInTier > 0) {
                                payout += ptsInTier * tier.rate;
                            }
                        }
                    });
                    if (payout > currentMaxPayout) payout = currentMaxPayout;
                    if (payout > 0) {
                        total += payout;
                        payments.push({
                            id: hoboId,
                            name: nameText,
                            description: `Sunday Funday(Score: ${score})`,
                            amount: '$' + payout.toLocaleString(),
                            timestamp: Date.now(),
                            completed: false,
                            cleared: false
                        });
                    }
                }
                
                let payoutCell = row.querySelector('.hh_sf_payout_cell');
                if (!payoutCell && cells.length >= 2) {
                    payoutCell = document.createElement('td');
                    payoutCell.className = 'hh_sf_payout_cell';
                    payoutCell.align = 'right';
                    row.appendChild(payoutCell);
                }
                if (payoutCell) {
                    payoutCell.textContent = '$' + payout.toLocaleString();
                }
            });
            return { total, payments };
        };

        const updateProjectedTotal = () => {
            const { total } = calculateTotalPayout();
            panel.querySelector('.hh_sf_projected_total').textContent = `${isCurrent ? 'Projected Total' : 'Final Total'}: $${total.toLocaleString()}`;
        };

        const renderTiers = () => {
            tiersContainer.innerHTML = '';
            savedTiers.forEach((tier, idx) => {
                const row = document.createElement('div');
                row.style.marginBottom = '5px';
                row.innerHTML = `
                    <span style="font-size: 11px; display: inline-block; width: 45px;">Tier ${idx + 1}:</span>
                    <input type="number" class="hh-sf-min" value="${tier.min}" style="width: 60px; padding: 2px; font-size: 11px;" placeholder="Min">
                    <span style="font-size: 11px;"> - </span>
                    <input type="number" class="hh-sf-max" value="${tier.max}" style="width: 60px; padding: 2px; font-size: 11px;" placeholder="Max">
                    <span style="font-size: 11px;"> pts @ $ </span>
                    <input type="text" class="hh-sf-rate" value="${tier.rate.toLocaleString()}" style="width: 80px; padding: 2px; font-size: 11px;" placeholder="Rate / pt">
                    <span style="font-size: 11px;"> per point </span>
                    <button type="button" class="hh-sf-del-tier" data-idx="${idx}" style="cursor:pointer; font-size:10px; margin-left:5px; color:red; border:1px solid red; background:none; border-radius:3px; user-select:none; -webkit-user-select:none;">X</button>
                `;
                tiersContainer.appendChild(row);
            });

            // Bind delete buttons
            tiersContainer.querySelectorAll('.hh-sf-del-tier').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.target.getAttribute('data-idx'), 10);
                    savedTiers.splice(idx, 1);
                    saveAndRenderTiers();
                });
            });

            // Bind inputs to update model on change
            tiersContainer.querySelectorAll('input').forEach(input => {
                input.addEventListener('change', () => {
                    updateTiersFromDOM();
                    saveAndRenderTiers();
                });
            });

            updateProjectedTotal();
        };

        const updateTiersFromDOM = () => {
            savedTiers = [];
            const rows = tiersContainer.children;
            for (let i = 0; i < rows.length; i++) {
                const min = parseInt(rows[i].querySelector('.hh-sf-min').value, 10) || 0;
                const max = parseInt(rows[i].querySelector('.hh-sf-max').value, 10) || 0;
                const rate = parseInt(rows[i].querySelector('.hh-sf-rate').value.replace(/,/g, ''), 10) || 0;
                savedTiers.push({ min, max, rate });
            }
        };

        const saveAndRenderTiers = () => {
            localStorage.setItem('hw_helper_sf_tiers', JSON.stringify(savedTiers));
            renderTiers();
        };

        panel.querySelector('.hh_sf_add_tier_btn').addEventListener('click', () => {
            updateTiersFromDOM();
            let nextMin = 0;
            if (savedTiers.length > 0) {
                nextMin = savedTiers[savedTiers.length - 1].max;
            }
            savedTiers.push({ min: nextMin, max: nextMin + 100, rate: 0 });
            saveAndRenderTiers();
        });

        panel.querySelector('.hh_sf_max').addEventListener('change', (e) => {
            const val = parseInt(e.target.value.replace(/,/g, ''), 10) || 0;
            localStorage.setItem('hw_helper_sf_max', val.toString());
            e.target.value = val.toLocaleString();
            updateProjectedTotal();
        });

        renderTiers();

        panel.querySelector('.hh_sf_save_tiers_btn').addEventListener('click', () => {
            updateTiersFromDOM();
            localStorage.setItem('hw_helper_sf_tiers', JSON.stringify(savedTiers));
            const currentMaxPayoutStr = panel.querySelector('.hh_sf_max').value;
            const currentMaxPayout = parseInt(currentMaxPayoutStr.replace(/,/g, ''), 10) || 0;
            localStorage.setItem('hw_helper_sf_max', currentMaxPayout.toString());
            
            const statusEl = panel.querySelector('.hh_sf_tiers_status');
            statusEl.textContent = `✅ Saved settings!`;
            setTimeout(() => { statusEl.textContent = ''; }, 3000);

            updateProjectedTotal();
        });

        if (!isCurrent) {
            panel.querySelector('.hh_sf_save_btn').addEventListener('click', () => {
                updateTiersFromDOM();
                localStorage.setItem('hw_helper_sf_tiers', JSON.stringify(savedTiers));
                const currentMaxPayoutStr = panel.querySelector('.hh_sf_max').value;
                const currentMaxPayout = parseInt(currentMaxPayoutStr.replace(/,/g, ''), 10) || 0;
                localStorage.setItem('hw_helper_sf_max', currentMaxPayout.toString());

                const { payments } = calculateTotalPayout();

                if (payments.length > 0) {
                    const topicName = "Gangsters Sunday = Funday Payouts";
                    const savedPosts = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                    savedPosts[topicName] = {
                        timestamp: Date.now(),
                        topic: topicName,
                        totalHobos: 0,
                        hobos: [],
                        paymentsToHobos: payments
                    };
                    localStorage.setItem('hw_helper_gang_posts', JSON.stringify(savedPosts));

                    const statusEl = panel.querySelector('.hh_sf_status');
                    statusEl.textContent = `✅ Saved ${payments.length} payouts to Gang Loans dashboard!`;
                    setTimeout(() => { statusEl.textContent = ''; }, 3000);
                } else {
                    const statusEl = panel.querySelector('.hh_sf_status');
                    statusEl.style.color = 'red';
                    statusEl.textContent = `❌ No payouts to save.`;
                    setTimeout(() => { statusEl.textContent = ''; statusEl.style.color = 'green'; }, 3000);
                }
            });
        }
    },

    handleGangEnter: function() {
        const settings = Utils.getSettings();
        if (settings['GangStaffHelper_MailList']) {
            const mailLink = document.querySelector('a[href="?sr=101&cmd=gang&w=mail"]');
            if (mailLink) {
                mailLink.click();
                return true;
            }
        }
        return false;
    },

    handleCurrentHappenings: function() {
        const settings = Utils.getSettings();
        if (settings['GangStaffHelper_EventPayouts'] === false) return;

        // Verify user is Gang Staff by checking for Manage Loans access
        const isStaff = !!document.querySelector('a[href*="cmd=gang2&do=loans"]');
        if (!isStaff) {
            console.log("GangStaffHelper (Current Happenings): User is not Gang Staff. Aborting projected payouts panel.");
            return;
        }

        const uElements = Array.from(document.querySelectorAll('u'));
        const statsHeader = uElements.find(u => u.textContent.trim() === 'Current Gang Happening Stats:');

        if (!statsHeader) return;

        let currentElement = statsHeader.closest('b') || statsHeader;
        let scoresTable = null;
        while (currentElement) {
            if (currentElement.tagName === 'TABLE') {
                const firstRow = currentElement.querySelector('tr');
                if (firstRow && firstRow.textContent.includes('Hobo') && firstRow.textContent.includes('Score')) {
                    scoresTable = currentElement;
                    break;
                }
            }
            currentElement = currentElement.nextElementSibling;
        }

        if (!scoresTable) return;

        this.renderTierSettingsPanel(scoresTable, true);
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

    };

    const PageModules = {
        GangBoardStaffHelper,
        GangLoansHelper,
        GangStaffHelper,
    };

    // Alias for easy access across helpers if needed
    const Modules = Object.assign({}, DataModules, GlobalModules, PageModules);
    if (typeof window !== 'undefined') {
        window.HoboHelperModules = Modules;
        window.HoboHelperVersion = '8.75';
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

