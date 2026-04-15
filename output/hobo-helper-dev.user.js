// ==UserScript==
// @name         HoboWars Helper Toolkit (Dev)
// @namespace    http://tampermonkey.net/
// @version      8.30.20260415.1300
// @description  Combines original HoboWars helpers into a single modular script.
// @author       Gemini (Combined)
// @match        *://www.hobowars.com/game/game.php?*
// @grant        GM_notification
// @noframes
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
const Utils = {
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
                const match = ageLine.title.match(/(\d+)\s*days/i);
                if (match) {
                    return parseInt(match[1], 10);
                }
            }
            return null;
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
 * 50-99T*	17	2
 * 100T	21	1
 * *Exception: Fruit by the Furlong (55T) exp = 17, life = -7
 * **Vegetarianism Upgrade will add +1 to exp and life, but will restrict food intake to vegetarian meals only.
 */
const FoodData = {
    "Apple Core": { "img": "Apple-Core.gif" },
    "Half a Donut": { "img": "Half-a-Donut.gif" },
    "Piece of Bread": { "img": "Piece-of-Bread.gif" },
    "Can of Coke": { "img": "Can-of-Coke.gif" },
    "Piece of Pizza": { "img": "Piece-of-Pizza.gif" },
    "Meat Pie": { "img": "Meat-Pie.gif" },
    "Can of Pepsi": { "img": "Can-of-Pepsi.gif" },
    "Rotten Fish": { "img": "Rotten-Fish.gif" },
    "Half Eaten Burger": { "img": "Half-Eaten-Burger.gif" },
    "Packet of Fries": { "img": "Packet-of-Fries.gif" },
    "New Pizza": { "img": "New-Pizza.gif" },
    "Chewed Chicken Leg": { "img": "Chewed-Chicken-Leg.gif" },
    "Raw Chicken Leg": { "img": "Raw-Chicken-Leg.gif" },
    "Cooked Chicken": { "img": "Cooked-Chicken.gif" },
    "Half a HotDog": { "img": "Half-a-HotDog.gif" },
    "HotDog": { "img": "HotDog.gif" },
    "KFC Meal": { "img": "KFC-Meal.gif" },
    "Raw Potato": { "img": "Raw-Potato.gif" },
    "Vanilla Ice Cream": { "img": "Vanilla-Ice-Cream.gif" },
    "Chocolate Ice Cream": { "img": "Chocolate-Ice-Cream.gif" },
    "Fresh Apple": { "img": "Fresh-Apple.gif" },
    "Fighters Lunch": { "img": "Fighters-Lunch.gif" },
    "Double-Double": { "img": "Double-Double.gif" },
    "Bachelor Chow": { "img": "Bachelor-Chow.gif" },
    "Smart Bread": { "img": "Smart-Bread.gif" },
    "Day Old Coffee Naan": { "img": "Day-Old-Coffee-Naan.gif" },
    "Half a Sandwich Naan": { "img": "Half-a-Sandwich-Naan.gif" },
    "Discarded Taco Naan": { "img": "Discarded-Taco-Naan.gif" },
    "Wonka Bar": { "img": "Wonka-Bar.gif" },
    "Single-Single": { "img": "Single-Single.gif" },
    "Wonka-stripe Candy Cane": { "img": "Wonka-stripe-Candy-Cane.gif" },
    "Rainbow Drop": { "img": "Rainbow-Drop.gif" },
    "Roast Beef": { "img": "Roast-Beef.gif" },
    "Pre-Chewed Gum": { "img": "Pre-Chewed-Gum.gif" },
    "Roast Beef Flavored Gum": { "img": "Roast-Beef-Flavored-Gum.gif" },
    "Semi-Lasting Gobstopper": { "img": "Semi-Lasting-Gobstopper.gif" },
    "Sweet Bomb": { "img": "Sweet-Bomb.gif" },
    "Blueberry Blast Jelly Beans": { "img": "Blueberry-Blast-Jelly-Beans.gif" },
    "Beef Mushroom Stew": { "img": "Beef-Mushroom-Stew.gif" },
    "Texas Fajita Soup": { "img": "Texas-Fajita-Soup.gif" },
    "Cream of Okra Soup": { "img": "Cream-of-Okra-Soup.gif" },
    "Garlic Salmon Bisque": { "img": "Garlic-Salmon-Bisque.gif" },
    "Beggars Bouillon": { "img": "Beggar%27s-Bouillon.gif" },
    "Fizzy Lifting Soda": { "img": "Fizzy-Lifting-Soda.gif" },
    "Wonkas Peppermint Spirits": { "img": "Wonka%27s-Peppermint-Spirits.gif" },
    "Altoids": { "img": "Altoids.gif" },
    "Junior Mints": { "img": "Junior-Mints.gif" },
    "Red Hots": { "img": "Red-Hots.gif" },
    "Crystal Pepsi": { "img": "Crystal-Pepsi.gif" },
    "Chocolate Vanilla Swirl Ice Cream": { "img": "Chocolate-Vanilla-Swirl-Ice-Cream.gif" },
    "Redder Hots": { "img": "Redder-Hots.gif" },
    "Gas Soaked Red Hots": { "img": "Gas-Soaked-Red-Hots.gif" },
    "Gummi Gorilla": { "img": "Gummi-Gorilla.gif" },
    "Gummi Peregrine Falcon": { "img": "Gummi-Peregrine-Falcon.gif" },
    "Gummi Raptor": { "img": "Gummi-Raptor.gif" },
    "Quantum Candy": { "img": "Quantum-Candy.gif" },
    "Gummi Spaghetti Monster": { "img": "Gummi-Spaghetti-Monster.gif" },
    "Fruit by the Furlong": { "img": "Fruit-by-the-Furlong.gif" },
    "Candy Cigarette": { "img": "Candy-Cigarette.gif" },
    "Pack of Candy Cigarettes": { "img": "Pack-of-Candy-Cigarettes.gif" },
    "Freeze-Packed Dippin Dots": { "img": "Freeze-Packed-Dippin-Dots.gif" },
    "Dippin Dots": { "img": "Dippin-Dots.gif" },
    "Military Rations": { "img": "Military-Rations.gif" },
    "Can of Whipped Cream": { "img": "Can-of-Whipped-Cream.gif" },
    "Faberge Cream Egg": { "img": "Faberge-Cream-Egg.gif" },
    "Apple Flavored Gum": { "img": "Apple-Flavored-Gum.gif" },
    "Cinnamon Flavored Gum": { "img": "Cinnamon-Flavored-Gum.gif" },
    "Dark Chocolate Wonka Bar": { "img": "Dark-Chocolate-Wonka-Bar.gif" },
    "Special Brownie": { "img": "Special-Brownie.gif" },
    "Bacon Blast Jelly Beans": { "img": "Bacon-Blast-Jelly-Beans.gif" },
    "Fizzy Falling Soda": { "img": "Fizzy-Falling-Soda.gif" },
    "Caulipop": { "img": "Caulipop.gif" },
    "Dalipop": { "img": "Dalipop.gif" },
    "Volleypop": { "img": "Volleypop.gif" },
    "Polypop": { "img": "Polypop.gif" },
    "Mountain Honeydew Melon": { "img": "Mountain-Honeydew-Melon.gif" },
    "Mountain Dew": { "img": "Mountain-Dew.gif" },
    "Salmon": { "img": "Salmon.gif" },
    "Catfish": { "img": "Catfish.gif" },
    "Fish Sticks": { "img": "Fish-Sticks.gif" },
    "Octopus": { "img": "Octopus.gif" },
    "Blowfish": { "img": "Blowfish.gif" },
    "Hobo Stew": { "img": "Hobo-Stew.gif" },
    "Beggars Brunch": { "img": "Beggars-Brunch.gif" },
    "Hangover Omelette": { "img": "Hangover-Omelette.gif" },
    "Stomach Parasite": { "img": "Stomach-Parasite.gif" },
    "Forest Shroom": { "img": "Forest-Shroom.gif" },
    "Garlic Clove": { "img": "Garlic-Clove.gif" },
    "Chili Pepper": { "img": "Chili-Pepper.gif" },
    "Okra": { "img": "Okra.gif" },
    "Gingerbread Bum": { "img": "Gingerbread-Bum.gif" },
    "Bernard Burger": { "img": "Bernard-Burger.gif" },
    "Flying Dutchman": { "img": "Flying-Dutchman.gif" },
    "Animal Style Fries": { "img": "Animal-Style-Fries.gif" },
    "Neapolitan Shake": { "img": "Neapolitan-Shake.gif" },
    "SARS Bar": { "img": "SARS-Bar.gif" },
    "Hobowarheads": { "img": "Hobowarheads.gif" },
    "Mop Rocks": { "img": "Mop-Rocks.gif" },
    "ICPeanut Butter Cup": { "img": "ICPeanut-Butter-Cup.gif" },
    "Sugarfree Gum": { "img": "Sugarfree-Gum.gif" },
    "Kit Rat Bar": { "img": "Kit-Rat-Bar.gif" },
    "Butlerfinger": { "img": "Butlerfinger.gif" },
    "Life Savers": { "img": "Life-Savers.gif" },
    "Pay Day": { "img": "Pay-Day.gif" },
    "Candycorn": { "img": "Candycorn.gif" },
    "Sourpatch Bums": { "img": "Sourpatch-Bums.gif" },
    "L&amp;Ls": { "img": "L&amp;Ls.gif" },
    "Apple Surprise": { "img": "Apple-Surprise.gif" },
    "Death Mints": { "img": "Death-Mints.gif" },
    "Blow-Up Pop": { "img": "Blow-Up-Pop.gif" },
    "Peppermint Burger Patties": { "img": "Peppermint-Burger-Patties.gif" },
    "Rock Candy": { "img": "Rock-Candy.gif" },
    "Walking Taco": { "img": "Walking-Taco.gif" },
    "Freedom Fries": { "img": "Freedom-Fries.gif" },
    "Jugger-Nut": { "img": "Jugger-Nut.gif" },
    "Pizza Del Mare": { "img": "Pizza-Del-Mare.gif" },
    "Bottle of Coke": { "img": "Bottle-of-Coke.gif" },
    "Brains": { "img": "Brains.gif" },
    "Death By Chocolate": { "img": "Death-By-Chocolate.gif" },
    "Spooky Biscuit": { "img": "Spooky-Biscuit.gif" },
    "Twozzlers": { "img": "Twozzlers.gif" },
    "Red Hot Chili Pepper": { "img": "Red-Hot-Chili-Pepper.gif" },
    "Longer-Lasting Gobstopper": { "img": "Longer-Lasting-Gobstopper.gif" },
    "Double Gorillas": { "img": "Double-Gorillas.gif" },
    "Double Falcons": { "img": "Double-Falcons.gif" },
    "Double Raptors": { "img": "Double-Raptors.gif" },
    "Triple Dipps": { "img": "Triple-Dipps.gif" },
    "Rainbow Balls": { "img": "Rainbow-Balls.gif" },
    "Wonka Quadra Candy Cane": { "img": "Wonka-Quadra-Candy-Cane.gif" },
};

const PrimesData = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];

const BackpackHelper = {
    init: function() {
        const settings = Utils.getSettings();
        if (settings?.BackpackHelper?.enabled === false) return;
        
        this.initDrinkStats();
        this.observeBackpack();
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

    observeBackpack: function() {
        let drinkMap = null;
        let lastInjected = 0;

        const processItems = () => {
            const now = Date.now();
            if (now - lastInjected > 1000) {
                this.injectFavourites();
                lastInjected = now;
            }

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
    settings: [
        { key: 'DisplayHelper_ImprovedAvatars', label: 'Enable Improved Avatars' },
        { key: 'DisplayHelper_FakeQwee', label: 'Enable the Fake Qwee' },
        { key: 'DisplayHelper_JackReacher', label: 'Enable Jack Reacher Major Title' },
        { key: 'DisplayHelper_ScrollableTopbar', label: 'Swipeable Topbar Menu (Mobile)', defaultValue: true },
        { key: 'DisplayHelper_WidenPage', label: 'Widen Content Area' },
        { key: 'DisplayHelper_PageWidth', label: 'Page Width (px)', type: 'number', defaultValue: 660, parent: 'DisplayHelper_WidenPage' },
        { key: 'DisplayHelper_AwakeNotify', label: 'Awake Full Notification (Desktop)', defaultValue: false },
        { key: 'DisplayHelper_AwakeNotifyInactive', label: 'Notify Only if Inactive (mins)', type: 'number', defaultValue: 30, parent: 'DisplayHelper_AwakeNotify' },
        { key: 'DisplayHelper_InterestingLevel', label: 'Show Next Interesting Level', defaultValue: true }
    ],
    init: function() {
        const settings = Utils.getSettings();
        // This function only runs if the global helper is enabled,
        // and if this specific 'DisplayHelper' is enabled via SettingsHelper.
        if (settings['DisplayHelper_ImprovedAvatars'] !== false) {
            this.initImprovedAvatars();
        }
        if (settings['DisplayHelper_FakeQwee'] !== false) {
            this.initFakeQwee();
        }
        if (settings['DisplayHelper_JackReacher'] !== false) {
            this.initJackReacher();
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
    initFakeQwee: function() {
        const targetHoboId = "2924510";

        const playerLinks = document.querySelectorAll(`a[href*="cmd=player&ID=${targetHoboId}"]`);
        playerLinks.forEach(link => {
            if (!link.innerHTML.includes('The Fake')) {
                link.innerHTML = `<span style="color: red; font-weight: bold; text-shadow: 1px 1px 2px black;">The Fake</span> ` + link.innerHTML;
            }
        });
    },
    initJackReacher: function() {
        const targetHoboId = "107380";

        const playerLinks = document.querySelectorAll(`a[href*="cmd=player&ID=${targetHoboId}"]`);
        playerLinks.forEach(link => {
            if (!link.innerHTML.includes('Major')) {
                link.innerHTML = `<span style="color: #00EE00; font-weight: bold; text-shadow: 1px 1px 2px black;">Major</span> ` + link.innerHTML;
            }
        });
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
            return nextLink.textContent.trim();
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

const ActiveListHelper = {
    cmds: 'active',
    settings: [
        { key: 'ActiveListHelper_Enable', label: 'Enable Active List Helper' },
        { key: 'ActiveListHelper_Filter', label: 'Enable Alive/Dead Filters' }
    ],
    init: function() {
        const settings = Utils.getSettings();
        if (settings.ActiveListHelper_Enable === false) return;

        if (settings.ActiveListHelper_Filter !== false) {
            this.initFilters();
        }
    },

    initFilters: function() {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        // Ensure button styling
        if (!document.getElementById('hobo-helper-btn-style')) {
            const style = document.createElement('style');
            style.id = 'hobo-helper-btn-style';
            style.innerHTML = `
                input[type="button"], input[type="submit"], .btn {
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
                    user-select: none;
                    -webkit-user-select: none;
                }
                a.btn {
                    line-height: 1em
                }
                input[type="button"]:hover,input[type="submit"]:hover,.btn:hover, .btn.active {
                    color: #fff;
                    background: #1b9eff;
                    box-shadow: 0 0 0 rgba(0,0,0,.4);
                }
                .hobo-helper-hidden {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }

        // Parse and group players
        let currentWrapper = null;
        let isAlive = false;
        let isDead = false;
        const nodes = Array.from(contentArea.childNodes);

        nodes.forEach(node => {
            // Check if node is the start of a player line (date pattern e.g., "4/12 11:01.27 PM: ")
            if (node.nodeType === Node.TEXT_NODE && /^\s*\d{1,2}\/\d{1,2} \d{1,2}:\d{2}\.\d{2} [AP]M:/.test(node.textContent)) {
                currentWrapper = document.createElement('span');
                currentWrapper.className = 'hobo-helper-player-row';
                // Span is used instead of div to avoid unexpected block spacing since they end with BR natively
                contentArea.insertBefore(currentWrapper, node);
                currentWrapper.appendChild(node);
                isAlive = false;
                isDead = false;
            } else if (currentWrapper) {
                // Include node in the wrapper
                currentWrapper.appendChild(node);
                
                if (node.textContent && node.textContent.includes('Alive')) isAlive = true;
                if (node.textContent && node.textContent.includes('Dead')) isDead = true;

                // Stop at the first line break which ends the player line
                if (node.nodeName === 'BR') {
                    if (isAlive) currentWrapper.classList.add('hobo-helper-alive');
                    if (isDead) currentWrapper.classList.add('hobo-helper-dead');
                    
                    const lvlMatch = currentWrapper.textContent.match(/\(Lvl:\s*(\d+)\)/);
                    if (lvlMatch) {
                        currentWrapper.setAttribute('data-level', lvlMatch[1]);
                    }
                    
                    currentWrapper = null;
                }
            }
        });

        // Retrieve saved filter
        const savedFilter = localStorage.getItem('ActiveListHelper_CurrentFilter') || 'all';
        const savedRange = localStorage.getItem('ActiveListHelper_CurrentRangeFilter') === 'true';

        // Create UI Filter Buttons
        const filterContainer = document.createElement('div');
        filterContainer.style.marginBottom = '15px';
        filterContainer.style.textAlign = 'center';
        filterContainer.innerHTML = `
            <strong style="margin-right:10px;">Filter:</strong>
            <button class="btn ${savedFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>
            <button class="btn ${savedFilter === 'alive' ? 'active' : ''}" data-filter="alive">Alive</button>
            <button class="btn ${savedFilter === 'dead' ? 'active' : ''}" data-filter="dead">Dead</button>
            <label style="margin-left: 15px; cursor: pointer; user-select: none;">
                <input type="checkbox" id="hobo-helper-range-checkbox" ${savedRange ? 'checked' : ''} style="vertical-align: middle;"> Attack Range
            </label>
        `;

        contentArea.insertBefore(filterContainer, contentArea.firstChild);

        const playerLevel = typeof Utils.getHoboLevel === 'function' ? Utils.getHoboLevel() : 0;

        const applyFilters = () => {
            const activeBtn = filterContainer.querySelector('.btn.active');
            const filter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
            const rangeOnly = filterContainer.querySelector('#hobo-helper-range-checkbox').checked;

            localStorage.setItem('ActiveListHelper_CurrentFilter', filter);
            localStorage.setItem('ActiveListHelper_CurrentRangeFilter', rangeOnly);

            const allRows = contentArea.querySelectorAll('.hobo-helper-player-row');

            allRows.forEach(row => {
                row.classList.remove('hobo-helper-hidden');
                
                // Status Filter
                if (filter === 'alive' && !row.classList.contains('hobo-helper-alive')) {
                    row.classList.add('hobo-helper-hidden');
                    return;
                }
                if (filter === 'dead' && !row.classList.contains('hobo-helper-dead')) {
                    row.classList.add('hobo-helper-hidden');
                    return;
                }

                // Range Filter
                if (rangeOnly && playerLevel > 0) {
                    const targetLvl = parseInt(row.getAttribute('data-level'), 10);
                    if (!isNaN(targetLvl)) {
                        if (targetLvl < playerLevel - 200 || targetLvl > playerLevel + 200) {
                            row.classList.add('hobo-helper-hidden');
                        }
                    }
                }
            });
        };

        // Bind filter events
        const buttons = filterContainer.querySelectorAll('.btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyFilters();
            });
        });

        const rangeCheckbox = filterContainer.querySelector('#hobo-helper-range-checkbox');
        if (rangeCheckbox) {
            rangeCheckbox.addEventListener('change', applyFilters);
        }

        // Apply saved filter on load
        applyFilters();
    }
};

const BankHelper = {
    cmds: 'bank',
    settings: [
        { key: 'BankHelper_5FightersLunches', label: "5 Fighter's Lunches Goal" },
        { key: 'BankHelper_FixedGoals', label: "Fixed Bank Goals (+5k, +10k, +50k)" }
    ],
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
        const settings = Utils.getSettings();
        const withdrawInput = document.getElementById('w_money');
        const withdrawForm = document.querySelector('form[name="with"]');
        const nativeWithdrawBtn = withdrawForm ? withdrawForm.querySelector('input[type="submit"]') : null;

        if (!withdrawInput || !nativeWithdrawBtn) return;

        if (settings.BankHelper_FixedGoals !== false) {
            const fixedAmounts = [5000, 10000, 50000];
            fixedAmounts.reverse().forEach(amount => {
                const btn = document.createElement('input');
                btn.type = 'button';
                btn.value = ` +$${amount.toLocaleString()} `;
                btn.style.marginLeft = '10px';
                btn.style.cursor = 'pointer';
                btn.style.backgroundColor = '#e6f7ff';
                btn.style.border = '1px solid #91d5ff';

                btn.onclick = function() {
                    let currentVal = parseInt(withdrawInput.value.replace(/,/g, '')) || 0;
                    withdrawInput.value = (currentVal + amount).toString();
                };

                nativeWithdrawBtn.parentNode.insertBefore(btn, nativeWithdrawBtn.nextSibling);
            });
        }

        if (settings.BankHelper_5FightersLunches !== false) {
            const level = Utils.getHoboLevel();
            const lunchCost = Utils.getFightersLunchCost(level);
            const totalCost = lunchCost * 5;

            if (totalCost > 0) {
                const lunchBtn = document.createElement('input');
                lunchBtn.type = 'button';
                lunchBtn.value = ` + Add 5 Fighter's Lunches ($${totalCost.toLocaleString()}) `;
                lunchBtn.style.marginLeft = '10px';
                lunchBtn.style.cursor = 'pointer';
                lunchBtn.style.backgroundColor = '#e6f7ff';
                lunchBtn.style.border = '1px solid #91d5ff';

                lunchBtn.onclick = function() {
                    let currentVal = parseInt(withdrawInput.value.replace(/,/g, '')) || 0;
                    withdrawInput.value = (currentVal + totalCost).toString();
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

const BernardsBasementHelper = {
    cmds: 'bernards',
    settings: [
        { key: 'BernardsBasementHelper_BasementMap', label: 'Basement Map' }
    ],
    init: function() {
        const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
        
        if (savedSettings['BernardsBasementHelper_BasementMap'] !== false) {
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
    cmds: 'depo',
    init: function() {
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

const FortSlugworthHelper = {
    cmds: 'fort_slugworth',
    init: function() {
        const settings = Utils.getSettings();
        if (settings['FortSlugworthHelper'] === false) return;

        if (window.location.search.includes('room=4')) {
            this.initRipaparter();
        }
    },

    initRipaparter: function() {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;
        
        const form = contentArea.querySelector('form[action*="room=4"]');
        if (!form) return;

        const select = form.querySelector('select[name="ripapart"]');
        if (!select) return;

        // Container for tiles
        const tilesContainer = document.createElement('div');
        tilesContainer.style.display = 'flex';
        tilesContainer.style.flexWrap = 'wrap';
        tilesContainer.style.gap = '10px';
        tilesContainer.style.justifyContent = 'center';
        tilesContainer.style.marginBottom = '20px';
        tilesContainer.style.maxWidth = '500px';

        // Add tiles before the select
        form.insertBefore(tilesContainer, select);

        // For each option in select, create a tile
        Array.from(select.options).forEach(opt => {
            const val = opt.value;
            let text = opt.textContent.trim(); // e.g. "Fighters Lunch (6)"
            let imgName = 'unknown.gif';

            const match = text.match(/^(.*?)\s*\((\d+)\)$/);
            let rawName = text;
            let qty = 1;
            if(match) {
                rawName = match[1].trim();
                qty = match[2];
            }

            if(typeof FoodData !== 'undefined' && FoodData[rawName]) {
                imgName = FoodData[rawName].img;
            } else {
                imgName = rawName.replace(/[']/g, '%27').replace(/\s+/g, '-') + '.gif';
            }

            const tile = document.createElement('div');
            tile.style.border = '2px solid #ccc';
            tile.style.borderRadius = '5px';
            tile.style.padding = '8px';
            tile.style.cursor = 'pointer';
            tile.style.textAlign = 'center';
            tile.style.width = '85px';
            tile.style.backgroundColor = '#fff';
            tile.className = 'rip-tile';
            tile.dataset.val = val;

            tile.innerHTML = `
                <img src="/images/items/gifs/${imgName}" width="50" height="50" alt="${rawName}" onerror="this.src='/images/items/gifs/Trolly.gif'" title="${rawName}"><br>
                <div style="font-size:11px; margin-top:6px; line-height:1.2; word-wrap:break-word;">${rawName}</div>
                <div style="font-size:12px; font-weight:bold; color:#0b61a4; margin-top:3px;">(${qty})</div>
            `;

            tile.addEventListener('click', () => {
                tilesContainer.querySelectorAll('.rip-tile').forEach(t => {
                    t.style.borderColor = '#ccc';
                    t.style.backgroundColor = '#fff';
                });
                tile.style.borderColor = '#2196F3';
                tile.style.backgroundColor = '#e3f2fd';

                select.value = val;
            });

            tilesContainer.appendChild(tile);
        });

        console.log('FortSlugworthHelper: Room 4 (The Ripaparter) loaded tiles.');
    }
};

const GangHelper = {
    cmds: ['gang', 'gang2'],
    settings: [
        { key: 'GangHelper_EnableFeature', label: 'Enable Gang Helper' },
        { key: 'GangHelper_FormatMassMails', label: 'Format Mass Mails' }
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

        if (savedSettings['GangHelper_EnableFeature'] !== false) {
            if (doParam === 'list_mem') {
                this.initGangMemberList();
            } else if (doParam === 'enter') {
                // Check if we are viewing the last gang happenings
                if (wParam === 'lastsh') {
                    this.initGangHappenings();
                } else {
                    this.initGangFeature();
                }
            } else if (doParam === 'read_mail') {
                if (savedSettings['GangHelper_FormatMassMails'] !== false) {
                    this.formatMassMail();
                }
            }
        }
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
    
    initGangFeature: function() {
        console.log("GangHelper loaded on dashboard.");
        // TODO: Implement gang page specifics
    },

    initGangMemberList: function() {
        console.log("GangHelper loaded on member list page.");

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
        console.log("GangHelper loaded on last happenings page.");

        // Verify this is the correct event by checking the raw HTML Structure
        const htmlContent = document.body.innerHTML || "";
        const isSundayFunday = /<b>\s*<u>Last Gang Happening Stats:<\/u><\/b>\s*Gangsters Sunday = Funday/i.test(htmlContent);

        if (!isSundayFunday) {
            console.log("GangHelper: Event is not 'Gangsters Sunday = Funday'. Aborting.");
            return;
        }

        // Verify user is Gang Staff by checking for Manage Loans access
        const isStaff = !!document.querySelector('a[href*="cmd=gang2&do=loans"]');
        if (!isStaff) {
            console.log("GangHelper: User is not Gang Staff. Aborting.");
            return;
        }

        console.log("GangHelper: 'Gangsters Sunday = Funday' event detected! Ready for next steps.");
        
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
            } else {
                 rows = table.querySelectorAll('tr[bgcolor="#F3F3F3"], tr[bgcolor="#DCDCDC"]');
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

                if (hoboId && !isNaN(score) && score > 0) {
                    let payout = 0;
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
        if (settings['GangHelper_MailList']) {
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
        if (settings['GangHelper_EventPayouts'] === false) return;

        // Verify user is Gang Staff by checking for Manage Loans access
        const isStaff = !!document.querySelector('a[href*="cmd=gang2&do=loans"]');
        if (!isStaff) {
            console.log("GangHelper (Current Happenings): User is not Gang Staff. Aborting projected payouts panel.");
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

const GangLoansHelper = {
    cmds: 'gang2',
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
                            <tr style="border-bottom: 1px solid #eee; background: ${rowBg};">
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
                            <tr style="background: ${rowBg}; border-bottom: 1px solid #f0f0f0;">
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

    },

    getSr: function() {
        const match = window.location.search.match(/sr=(\d+)/);
        return match ? match[1] : '';
    }
};

const HitlistHelper = {
    cmds: 'battle',
    settings: [
        { key: 'HitlistHelper_HighlightOnline', label: 'Highlight Online Players' },
        { key: 'HitlistHelper_RememberSort', label: 'Enable Client-side Sorting & Remember' }
    ],
    init: function() {
        if (!window.location.search.includes('do=phlist')) return;

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        const settings = Utils.getSettings();
        if (settings?.HitlistHelper?.enabled === false) return;

        console.log('[Hobo Helper] Initializing HitlistHelper');

        if (settings?.HitlistHelper_HighlightOnline !== false) {
            this.highlightOnlinePlayers();
        }

        if (settings?.HitlistHelper_RememberSort !== false) {
            this.initSorting();
        }

        this.highlightOutOfRangePlayers();
    },

    highlightOutOfRangePlayers: function() {
        const playerLvl = Utils.getHoboLevel();
        if (playerLvl === 0) return;

        const table = document.querySelector('form[action*="do=phlist"] table');
        if (!table) return;

        const tbody = table.querySelector('tbody') || table;
        const rows = Array.from(tbody.querySelectorAll('tr')).slice(1);

        rows.forEach(row => {
            const tds = row.querySelectorAll('td');
            if (tds.length > 2) {
                const targetLvl = parseInt(tds[2].textContent.replace(/,/g, '').trim(), 10);
                if (!isNaN(targetLvl) && Math.abs(targetLvl - playerLvl) > 200) {
                    tds.forEach(td => {
                        td.style.backgroundColor = '#f8d7da'; // Light red
                    });
                }
            }
        });
    },

    initSorting: function() {
        const table = document.querySelector('form[action*="do=phlist"] table');
        if (!table) return;

        const tbody = table.querySelector('tbody') || table;
        const rows = Array.from(tbody.querySelectorAll('tr'));
        if (rows.length < 2) return;

        const headerRow = rows[0];
        const dataRows = rows.slice(1);

        // Remove native sort links from header
        const headers = headerRow.querySelectorAll('td');
        headers.forEach(headerTd => {
            const strong = headerTd.querySelector('strong');
            if (strong) {
                const links = headerTd.querySelectorAll('a');
                links.forEach(l => l.remove());
            }
        });

        // Build Multi-Sort UI Form
        const container = document.createElement('div');
        container.style.marginTop = '15px';
        container.style.padding = '10px';
        container.style.background = '#eee';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '5px';
        container.innerHTML = `<strong>Multi-Column Hitlist Sort</strong><br/><br/>`;

        const sorts = ['Sort 1', 'Sort 2', 'Sort 3'];
        const options = [
            { val: 'online', label: 'Online Status' },
            { val: 'alive', label: 'Alive Status' },
            { val: 'level', label: 'Hobo Level' },
            { val: 'name', label: 'Hobo Name' },
            { val: 'respect', label: 'Respect' },
            { val: 'city', label: 'City Side' },
            { val: 'battle', label: 'Battle Count' },
            { val: 'none', label: '-- None --' }
        ];

        const selects = [];
        const dirSelects = [];

        sorts.forEach((sort, i) => {
            const wrapper = document.createElement('span');
            wrapper.style.marginRight = '15px';
            wrapper.innerHTML = `${sort}: `;

            const sel = document.createElement('select');
            sel.style.marginRight = '5px';
            options.forEach(opt => {
                const o = document.createElement('option');
                o.value = opt.val;
                o.textContent = opt.label;
                sel.appendChild(o);
            });

            const dirSel = document.createElement('select');
            dirSel.innerHTML = `<option value="asc">Asc</option><option value="desc">Desc</option>`;

            wrapper.appendChild(sel);
            wrapper.appendChild(dirSel);
            container.appendChild(wrapper);
            selects.push(sel);
            dirSelects.push(dirSel);
        });

        const btn = document.createElement('button');
        btn.textContent = 'Apply Sort';
        btn.className = 'btn';
        btn.style.marginLeft = '10px';
        container.appendChild(btn);

        // Load Default or Saved
        let savedConfig;
        try {
            savedConfig = JSON.parse(localStorage.getItem('hw_hitlist_multisort'));
        } catch(e) {}

        if (!savedConfig || !savedConfig.length) {
            savedConfig = [
                { col: 'online', dir: 'desc' },
                { col: 'alive', dir: 'desc' },
                { col: 'level', dir: 'desc' }
            ];
        }

        // Apply config to UI
        savedConfig.forEach((cfg, i) => {
            if (i < 3) {
                selects[i].value = cfg.col;
                dirSelects[i].value = cfg.dir;
            }
        });

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const config = [];
            for(let i=0; i<3; i++) {
                if(selects[i].value !== 'none') {
                    config.push({ col: selects[i].value, dir: dirSelects[i].value });
                }
            }
            localStorage.setItem('hw_hitlist_multisort', JSON.stringify(config));
            this.applyMultiSort(dataRows, tbody, config);
        });

        table.parentElement.insertBefore(container, table.nextSibling);

        // Auto apply sort on load
        this.applyMultiSort(dataRows, tbody, savedConfig);
    },

    applyMultiSort: function(dataRows, tbody, config) {
        if (!config || config.length === 0) return;

        // Helper to extract values
        const getVal = (row, colType) => {
            const tds = row.querySelectorAll('td');
            switch (colType) {
                case 'online':
                    return row.querySelector('img[src*="online_now"]') ? 1 : 0;
                case 'alive':
                    return tds[5]?.textContent.trim().toLowerCase() === 'no' ? 1 : 0; // 'No' is dead. We want ascending to mean 'No' then 'Yes' or whatever. Let's make Alive=1, Dead=0
                case 'level':
                    return parseInt(tds[2]?.textContent.replace(/,/g, '').trim(), 10) || 0;
                case 'name':
                    return tds[1]?.textContent.trim().toLowerCase() || '';
                case 'respect':
                    return parseInt(tds[3]?.textContent.replace(/,/g, '').trim(), 10) || 0;
                case 'city':
                    return tds[4]?.textContent.trim().toLowerCase() || '';
                case 'battle':
                    return parseInt(tds[6]?.textContent.replace(/,/g, '').trim(), 10) || 0;
                default:
                    return 0;
            }
        };

        // Fix 'alive' to be more intuitive: 1 = Alive, 0 = Dead
        const getAliveVal = (row) => {
           const tds = row.querySelectorAll('td');
           const val = tds[5]?.textContent.trim().toLowerCase();
           return val === 'yes' ? 1 : 0;
        };

        dataRows.sort((a, b) => {
            for (let i = 0; i < config.length; i++) {
                const c = config[i];
                let valA, valB;

                if (c.col === 'alive') {
                    valA = getAliveVal(a);
                    valB = getAliveVal(b);
                } else {
                    valA = getVal(a, c.col);
                    valB = getVal(b, c.col);
                }

                if (valA !== valB) {
                    const modifier = c.dir === 'desc' ? -1 : 1;
                    if (typeof valA === 'number' && typeof valB === 'number') {
                        return (valA - valB) * modifier;
                    } else {
                        return String(valA).localeCompare(String(valB)) * modifier;
                    }
                }
            }
            return 0;
        });

        // Re-append rows in new order
        dataRows.forEach(row => tbody.appendChild(row));
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
    cmds: 'camp_kurtz',
    init: function() {
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
    cmds: 'liquor_store',
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
    cmds: '',
    settings: [
        { key: 'LivingAreaHelper_StatRatioTracker', label: 'Stat Ratio Tracker' },
        { key: 'LivingAreaHelper_CopyStatsBtn', label: 'Copy Stats Button' },
        { key: 'LivingAreaHelper_AlwaysShowSpecialItem', label: 'Always Show Special Item' },
        { key: 'LivingAreaHelper_MixerLink', label: 'Mixer Link' },
        { key: 'LivingAreaHelper_VersionDisplay', label: 'Version Display' },
        { key: 'LivingAreaHelper_WinPercentageCalc', label: 'Win Percentage Calc' },
        { key: 'LivingAreaHelper_WideShowAll', label: 'Always Show More Info<br><span style="font-size: 11px; color: #555;">(Requires Display Helper Page Width >= 850px)</span>' }
    ],
    init: function() {
        const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
        
        const hoboAgeDays = Utils.getHoboAgeInDays();
        if (hoboAgeDays !== null) {
            localStorage.setItem('hw_helper_hobo_age_days', hoboAgeDays);
        }

        if (savedSettings['LivingAreaHelper_StatRatioTracker'] !== false) {
            this.initStatRatioTracker();
        }
        if (savedSettings['LivingAreaHelper_CopyStatsBtn'] !== false) {
            this.initCopyStatsBtn();
        }
        if (savedSettings['LivingAreaHelper_AlwaysShowSpecialItem'] !== false) {
            this.initAlwaysShowSpecialItem();
        }
        if (savedSettings['LivingAreaHelper_MixerLink'] !== false) {
            this.initMixerLink();
        }
        if (savedSettings['LivingAreaHelper_VersionDisplay'] !== false) {
            this.initVersionDisplay();
        }
        if (savedSettings['LivingAreaHelper_WinPercentageCalc'] !== false) {
            this.initWinPercentageCalc();
        }
        if (savedSettings['LivingAreaHelper_WideShowAll'] !== false) {
            this.initWideShowAll(savedSettings);
        }

        this.initInactiveSpecialItemBg();
    },

    initInactiveSpecialItemBg: function() {
        const statsDisplays = document.querySelectorAll('.statsDisplay');
        statsDisplays.forEach(display => {
            if (display.textContent.includes('Special Item')) {
                // Check if it does not contain 'Active' (case-sensitive) or if it explicitly says 'Inactive'
                if (!display.textContent.includes('Active') || display.textContent.includes('Inactive')) {
                    const innerBox = display.querySelector('div');
                    if (innerBox) {
                        // Override existing inline background
                        innerBox.style.backgroundColor = '#ffdddd';
                        innerBox.style.setProperty('background', '#ffdddd', 'important');
                    }
                }
            }
        });
    },

    initWideShowAll: function(settings) {
        // Only run if the user has specifically widened the page >= 850px through the display helper
        const isWiden = settings['DisplayHelper_WidenPage'];
        const pageWidth = parseInt(settings['DisplayHelper_PageWidth'] || 660, 10);
        
        if (isWiden && pageWidth >= 850) {
            // First we need to reveal everything that "show_more" normally would
            const moreInfoItems = document.querySelectorAll('.more_info');
            moreInfoItems.forEach(el => {
                if (el.style) el.style.display = (el.tagName.toLowerCase() === 'span') ? 'inline' : 'block';
            });
            const lessInfoItems = document.querySelectorAll('.less_info');
            lessInfoItems.forEach(el => {
                if (el.style) el.style.display = 'none';
            });
            
            // Keep the avatar column visible
            const myHobo = document.getElementById('myhobo');
            if (myHobo) {
                myHobo.style.display = 'inline-block';
            }
            
            // Hide the toggle buttons
            const moreLink = document.getElementById('show_more_link');
            const lessLink = document.getElementById('show_less_link');
            if (moreLink) moreLink.style.display = 'none';
            if (lessLink) lessLink.style.display = 'none';

            // Expand the #tabContent to make room for all 3 columns
            const tabContent = document.getElementById('tabContent');
            if (tabContent) {
                tabContent.style.width = 'calc(100% - 190px)';
            }

            // Force it with CSS so game JS can't overwrite it
            const style = document.createElement('style');
            style.innerHTML = `
                #tabContent {
                    width: calc(100% - 190px) !important;
                    box-sizing: border-box !important;
                    vertical-align: top !important;
                }
                .statsDisplay {
                    white-space: nowrap !important;
                }
                .leftStats, .rightStats {
                    white-space: normal !important;
                    display: inline-block !important;
                    vertical-align: top !important;
                }
            `;
            document.head.appendChild(style);

            // We must rewrite the game functions to do nothing, in case the user navigates backpack tabs
            // and the game tries to hide or show myhobo automatically
            if (typeof window.hide_myhobo !== 'undefined') {
                const script = document.createElement('script');
                script.textContent = `
                    function hide_myhobo() {} 
                    function show_more() {} 
                    function show_less() {}
                `;
                document.body.appendChild(script);
            }
        }
    },

    initAlwaysShowSpecialItem: function() {
        const statsDisplays = document.querySelectorAll('.more_info.statsDisplay');
        statsDisplays.forEach(display => {
            if (display.textContent.includes('Special Item')) {
                display.classList.remove('more_info');
                display.style.display = 'block';
            }
        });
    },

    initMixerLink: function() {
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

    initVersionDisplay: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const cmd = urlParams.get('cmd');
        if (cmd) return;

        const gearInfo = document.getElementById('gearInfo');
        if (!gearInfo) return;

        let latestVersion = "Unknown";
        if (typeof Modules !== 'undefined' && Modules.ChangelogData && Modules.ChangelogData.changes && Modules.ChangelogData.changes.length > 0) {
            latestVersion = Modules.ChangelogData.changes[0].version;
        }

        const versionHtml = `
            <div style="text-align: center; font-size: 11px; margin-top: 8px; color: #666; font-family: Tahoma, Arial, sans-serif; display: block; width: 100%;">
                Hobo Helper v${latestVersion}<br>
                <a href="#" id="hh_show_changelog" style="color: #0066cc; text-decoration: none;">View Changelog</a>
            </div>
        `;

        const mixerLink = gearInfo.querySelector('img[title="Mixer"]');
        if (mixerLink) {
            let container = mixerLink.parentElement;
            if (container.tagName !== 'A') container = mixerLink;
            container.insertAdjacentHTML('afterend', versionHtml);
        } else {
            const icons = gearInfo.querySelectorAll('img[title="Hobo Grail"], img[title="Kings Kiddie Cup"], img[title="Golden Trolly"]');
            if (icons.length > 0) {
                let target = icons[icons.length - 1].parentElement;
                target.insertAdjacentHTML('afterend', versionHtml);
            } else {
                const innerBox = gearInfo.querySelector('div');
                if (innerBox) innerBox.insertAdjacentHTML('beforeend', versionHtml);
            }
        }

        const link = document.getElementById('hh_show_changelog');
        if (link) {
            link.addEventListener('click', (e) => this.showChangelogModal(e));
        }
    },

    showChangelogModal: function(e) {
        if (e) e.preventDefault();

        let existing = document.getElementById('hw-helper-changelog-modal');
        if (existing) { existing.style.display = 'block'; return; }

        if (typeof Modules === 'undefined' || typeof Modules.ChangelogData === 'undefined' || !Modules.ChangelogData.changes) {
            alert("ChangelogData missing."); return;
        }

        const modal = document.createElement("div");
        modal.id = 'hw-helper-changelog-modal';
        modal.style.cssText = "position:fixed; top:10%; left:50%; transform:translateX(-50%); z-index:9999; max-width:600px; width:90%; background-color:#f9f9f9; border:1px dashed #777; border-radius:8px; text-align:left; font-family:Tahoma, Arial, sans-serif; color:#333; box-shadow:0px 4px 6px rgba(0,0,0,0.5); padding:15px; max-height:80vh; overflow-y:auto;";

        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&#10006;';
        closeBtn.style.cssText = "float:right; cursor:pointer; font-size:18px; font-weight:bold; color:#d9534f; user-select: none; -webkit-user-select: none;";
        closeBtn.onclick = () => { modal.style.display = 'none'; };
        modal.appendChild(closeBtn);

        const title = document.createElement("h2");
        title.textContent = "Hobo Helper - Recent Updates";
        title.style.margin = "0 0 10px 0";
        title.style.borderBottom = "1px solid #ccc";
        title.style.paddingBottom = "5px";
        title.style.fontSize = "16px";
        modal.appendChild(title);

        Modules.ChangelogData.changes.forEach(release => {
            const releaseBlock = document.createElement("div");
            releaseBlock.style.marginTop = "10px";

            const versionHeader = document.createElement("div");
            versionHeader.innerHTML = `<strong>v${release.version}</strong> <span style="font-size: 11px; color: #666;">(${release.date})</span>`;
            versionHeader.style.fontSize = "14px";
            releaseBlock.appendChild(versionHeader);

            const changesList = document.createElement("ul");
            changesList.style.margin = "5px 0 10px 20px";
            changesList.style.padding = "0";
            changesList.style.fontSize = "12px";
            changesList.style.lineHeight = "1.4";

            if (release.notes && Array.isArray(release.notes)) {
                release.notes.forEach(noteText => {
                    const li = document.createElement("li");
                    li.style.marginBottom = "3px";
                    let formattedChange = noteText.replace(/`([^`]+)`/g, '<code style="background-color: #eaeaea; padding: 1px 4px; border-radius: 3px; font-family: monospace;">$1</code>');
                    formattedChange = `<strong>${release.type}:</strong> ` + formattedChange;
                    li.innerHTML = formattedChange;
                    changesList.appendChild(li);
                });
            }

            releaseBlock.appendChild(changesList);
            modal.appendChild(releaseBlock);
        });

        document.body.appendChild(modal);
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
                    <button id="r_save" style="width:100%; cursor:pointer; background:#666; color:#fff; border:none; padding:5px; font-weight:bold;">Update Goals</button>
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
                config.showSettings = false;
                document.getElementById('settings_area').style.display = 'none';
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

            const getLossesNeeded = (target) => {
                const decimal = target / 100;
                if ((wins / total) < decimal) return 0;
                return Math.floor(wins / decimal) - total + 1;
            };

            if (total === 0) return;
            const currDecimal = wins / total;
            const allT = [10, 20, 30, 40, 50, 60, 70, 75, 80, 85, 90, 95, 98, 99];

            let winGoals = allT.filter(t => (t / 100) > currDecimal).sort((a, b) => a - b);
            let lossGoals = allT.filter(t => (t / 100) <= currDecimal).sort((a, b) => b - a);

            if (winGoals.length === 0) winGoals = [95, 99].filter(t => (t / 100) > currDecimal);
            if (lossGoals.length === 0) lossGoals = [5, 1].filter(t => (t / 100) <= currDecimal);

            let rows = [];
            if (winGoals[0]) rows.push({ type: 'win', t: winGoals[0] });
            if (winGoals[1]) rows.push({ type: 'win', t: winGoals[1] });
            if (lossGoals[0]) rows.push({ type: 'loss', t: lossGoals[0] });

            if (rows.length < 3 && winGoals[2]) {
                rows.push({ type: 'win', t: winGoals[2] });
            }

            rows = rows.slice(0, 3).sort((a, b) => b.t - a.t);

            let calcHtml = `<div id="winCalc" style="font-size: 0.85em; margin-top: 8px; padding-top: 8px; border-top: 1px dashed #999; color: #333;">`;
            calcHtml += `<strong style="color: black;">Win Percentage Tracker:</strong><br>`;

            rows.forEach(r => {
                if (r.type === 'win') {
                    const needed = getBattlesNeeded(r.t);
                    if (needed > 0) {
                        calcHtml += `<span style="display:inline-block; width: 45px; color: green; font-weight: bold;">${r.t}%:</span> +<span style="color: black; font-weight: bold;">${needed.toLocaleString()}</span> consecutive wins<br>`;
                    }
                } else {
                    const needed = getLossesNeeded(r.t);
                    if (needed > 0) {
                        calcHtml += `<span style="display:inline-block; width: 45px; color: red; font-weight: bold;">&lt;${r.t}%:</span> +<span style="color: black; font-weight: bold;">${needed.toLocaleString()}</span> consecutive losses<br>`;
                    }
                }
            });

            calcHtml += `</div>`;

            battleBlock.insertAdjacentHTML('beforeend', calcHtml);
        }
    },

    initCopyStatsBtn: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const cmd = urlParams.get('cmd');
        if (cmd) return;

        const statsBlock = document.getElementById('combatStats');
        if (!statsBlock) return;

        const lines = Array.from(statsBlock.querySelectorAll('.line'));
        const headerLine = lines.find(l => l.textContent.includes('Combat Stats'));

        if (headerLine) {
            const copyBtn = document.createElement('button');
            copyBtn.textContent = '📋 Copy';
            copyBtn.title = "Copy Stats to Clipboard";
            copyBtn.style.cssText = 'margin-left: 5px; cursor: pointer; font-size: 10px; padding: 1px 4px; border: 1px solid #ccc; background: #fff; border-radius: 3px; user-select: none; -webkit-user-select: none; width: 62px; text-align: left;';

            copyBtn.onclick = (e) => {
                e.preventDefault();
                const getLineText = (label) => {
                    const target = lines.find(l => l.textContent.startsWith(label));
                    return target ? target.textContent.replace(/\s+/g, ' ').trim() : "";
                };

                const spdStr = getLineText('Speed:');
                const pwrStr = getLineText('Power:');
                const strStr = getLineText('Strength:');
                const totStr = getLineText('Total:');

                if (spdStr && pwrStr && strStr) {
                    const copyText = `Combat Stats\n${spdStr}\n${pwrStr}\n${strStr}\n${totStr}`;
                    navigator.clipboard.writeText(copyText).then(() => {
                        const originalText = copyBtn.textContent;
                        copyBtn.textContent = '✅ Copied';
                        setTimeout(() => { copyBtn.textContent = originalText; }, 1500);
                    });
                }
            };

            headerLine.appendChild(copyBtn);
        }
    }
}

const LockoutHelper = {
    settings: [
        { key: 'LockoutHelper_ShowChangelog', label: 'Show Changelog' }
    ],
    init: function() {
        // The game auto-locks during the 12-hour reset.
        // We detect this specific screen via document title or body text.
        const titleText = document.title || "";
        const bodyText = document.body.textContent || "";
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
        title.textContent = "Hobo Helper - Recent Updates";
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

const MarketHelper = {
    cmds: 'mart',
    settings: [
        { key: 'MarketHelper_Enable', label: 'Enable Market Helper' },
        { key: 'MarketHelper_ButtonBuy', label: 'Convert "Buy" links to Buttons' },
        { key: 'MarketHelper_FormatSwitchLinks', label: 'Convert "Switch to" links to Buttons' },
        { key: 'MarketHelper_WeaponImages', label: 'Show Weapon Images' },
        { key: 'MarketHelper_ArmorImages', label: 'Show Armor Images' },
        { key: 'MarketHelper_CartPartImages', label: 'Show Cart Part Images' }
    ],
    init: function() {
        const settings = Utils.getSettings();
        if (settings.MarketHelper_Enable === false) return;

        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('do');
        const type = urlParams.get('type');

        if (settings.MarketHelper_ButtonBuy !== false) {
            const actionLinks = document.querySelectorAll('a[href*="&buy="], a[href*="&remove="]');
            if (actionLinks.length > 0) {
                this.ensureBtnStyle();

                actionLinks.forEach(link => {
                    const text = link.textContent.trim().toLowerCase();
                    if (text === 'buy' || text === 'remove') {
                        // Apply button styling
                        link.classList.add('btn');

                        // Remove surrounding brackets if they exist in the parent text node
                        const parent = link.parentNode;
                        if (parent && parent.tagName !== 'A') {
                            parent.childNodes.forEach(node => {
                                if (node.nodeType === Node.TEXT_NODE) {
                                    node.textContent = node.textContent.replace(/\[/g, '').replace(/\]/g, '');
                                }
                            });
                        }
                    }
                });
            }
        }

        if (settings.MarketHelper_FormatSwitchLinks !== false) {
            const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
                acceptNode: function(node) {
                    if (node.textContent.includes('Switch to:')) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            }, false);

            const switchNode = walk.nextNode();
            if (switchNode) {
                this.ensureBtnStyle();

                let current = switchNode.nextSibling;
                while (current) {
                    if (current.nodeType === Node.ELEMENT_NODE && current.tagName === 'A') {
                        current.classList.add('btn');
                    } else if (current.nodeType === Node.TEXT_NODE && current.textContent.trim() === ',') {
                        current.textContent = ' ';
                    } else if (current.nodeName === 'BR') {
                        break; // Stop iteration when we hit the break after the links
                    }
                    current = current.nextSibling;
                }
            }
        }

        // Page specific routing
        if (action === 'list') {
            switch(type) {
                case '4': // Weapons
                    this.initItemsPage(settings.MarketHelper_WeaponImages, typeof EquipmentData !== 'undefined' ? EquipmentData : null);
                    break;
                case '5': // Armor
                    this.initItemsPage(settings.MarketHelper_ArmorImages, typeof EquipmentData !== 'undefined' ? EquipmentData : null);
                    break;
                case '6': // Cart Parts
                    this.initItemsPage(settings.MarketHelper_CartPartImages, '/images/xcart_parts.gif.pagespeed.ic.S-Xl1EpX3o.webp');
                    break;
                // Add more cases here
            }
        }
    },

    ensureBtnStyle: function() {
        if (!document.getElementById('hobo-helper-btn-style')) {
            const style = document.createElement('style');
            style.id = 'hobo-helper-btn-style';
            style.innerHTML = `
                input[type="button"], input[type="submit"], .btn {
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
                a.btn {
                    line-height: 1em
                }
                input[type="button"]:hover,input[type="submit"]:hover,.btn:hover {
                    color: #fff;
                    background: #1b9eff;
                    box-shadow: 0 0 0 rgba(0,0,0,.4);
                    animation: pulse 1.5s infinite
                }
            `;
            document.head.appendChild(style);
        }
    },

    initItemsPage: function(settingToggle, itemData) {
        if (settingToggle !== false && itemData) {
            const headerLink = document.querySelector('a[href*="order=item"]');
            if (headerLink) {
                const headerRow = headerLink.closest('tr');
                const table = headerRow.closest('table');

                if (table) {
                    const imgHeader = document.createElement('td');
                    imgHeader.width = "40";
                    headerRow.insertBefore(imgHeader, headerRow.firstElementChild);

                    const rows = table.querySelectorAll('tr');
                    for (let i = 1; i < rows.length; i++) {
                        const row = rows[i];
                        const firstTd = row.firstElementChild;
                        if (!firstTd) continue;

                        const nameMatch = firstTd.textContent.trim().match(/^([^(]+)/);
                        const newTd = document.createElement('td');
                        newTd.align = 'center';
                        newTd.style.verticalAlign = 'middle';

                        if (nameMatch) {
                            const itemName = nameMatch[1].trim();
                            const imgUrl = typeof itemData === 'string' ? itemData : itemData[itemName];
                            if (imgUrl) {
                                const img = document.createElement('img');
                                img.src = imgUrl;
                                img.style.maxWidth = '40px';
                                img.style.maxHeight = '40px';
                                newTd.appendChild(img);
                            }
                        }

                        row.insertBefore(newTd, firstTd);
                    }
                }
            }
        }
    },

    initInteractiveBuyButtons: function() {
        const table = document.querySelector('table');
        if (!table) return;

        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const lastCell = row.cells[row.cells.length - 1];
            if (!lastCell) return;

            if (lastCell.textContent.includes('[Buy]') || lastCell.textContent.includes('[Remove]')) {
                const actionLink = lastCell.querySelector('a');
                if (actionLink) {
                    actionLink.textContent = actionLink.textContent.replace(/\[|\]/g, '');
                    actionLink.classList.add('btn');

                    // Strip the brackets from the text node
                    Array.from(lastCell.childNodes).forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            node.nodeValue = node.nodeValue.replace(/\[|\]/g, '');
                        }
                    });
                }
            }
        });
    }
};

const MessageBoardHelper = {
    cmds: 'gathering',
    settings: [
        { key: 'MessageBoardHelper_CtrlEnter', label: 'Ctrl+Enter to Post' },
        { key: 'MessageBoardHelper_RenderTables', label: 'Render Data Tables in Posts' },
        { key: 'MessageBoardHelper_VoteButtons', label: 'Larger Vote Buttons' },
        { key: 'MessageBoardHelper_CopyHoboName', label: 'Show Copy [hoboname] Link' },
        {
            key: 'MessageBoardHelper_AddPaidMessageTemplate',
            label: 'Add Paid Message Text',
            type: 'text',
            defaultValue: '[hoboname={hoboId}][hex=777777][i]edit: [b]PAID[/b][/i][/hex]',
            width: '100%',
            description: 'Available variables: {hoboname}, {hoboId}, {date}'
        }
    ],
    init: function() {

        const settings = Utils.getSettings();
        if (settings?.MessageBoardHelper?.enabled === false) return;

        this.initMessageBoardFeatures(settings);

        if (Utils.isCurrentPage('do=vpost')) {
            this.initGangPostFeatures(settings);
        }
    },

    initMessageBoardFeatures: function(settings) {
        this.enhanceMessageEditor(settings);
        
        if (settings?.MessageBoardHelper_RenderTables !== false) {
            this.parseTablesInPosts();
        }

        if (settings?.MessageBoardHelper_VoteButtons !== false) {
            this.enhanceVoteButtons();
            this.fixVoteTooltipBug();
        }

        if (settings?.MessageBoardHelper_CopyHoboName !== false) {
            this.addCopyHoboNameLinks();
        }
    },

    addCopyHoboNameLinks: function() {
        const tds = document.querySelectorAll('td[bgcolor="#EEEEEE"]');

        // Grab the native linkcopy image if available to use the same asset
        const existingLinkCopy = document.querySelector('img.linkcopy');
        const imgSrc = (existingLinkCopy && existingLinkCopy.src)
            ? existingLinkCopy.src
            : 'data:image/webp;base64,UklGRswAAABXRUJQVlA4TMAAAAAvDYABAK/BoJEkRRk6hjf1/kX9i1DQRpIay9IzmXoFbSSpsSw9k6mf/zq8/weApCRse95jm20kSUISACQlAQBJpRRJkCQJSZIAAABJktgmyZyTbQCQRFLv3a8YYwDAtiRI+oreu1IKAEgiSRIwDACwaHRGtm27iP7Hf9de6h6Xl3r1/b9pcO5dkKz7EKRvay4OZqHBsFOZrW/PD2rGPkfPbPuZOlkAEgKBNanZzqOyiFU9LsqI799GhSK7WVME3T4=';

        tds.forEach(td => {
            Array.from(td.childNodes).some(node => {
                if (node.nodeType === 3) {
                    const match = node.nodeValue.match(/ID:\s*(\d+)/i);
                    if (match) {
                        const hoboId = match[1];

                        const textBefore = node.nodeValue.substring(0, match.index);
                        const matchedText = match[0];
                        const textAfter = node.nodeValue.substring(match.index + matchedText.length);

                        const wrapper = document.createElement('span');
                        wrapper.style.display = 'inline-flex';
                        wrapper.style.alignItems = 'center';
                        wrapper.style.gap = '4px';

                        wrapper.appendChild(document.createTextNode(matchedText));

                        const copyImg = document.createElement('img');
                        copyImg.src = imgSrc;
                        copyImg.style.cursor = 'pointer';
                        copyImg.title = `Copy [hoboname=${hoboId}]`;
                        copyImg.className = 'tooltip';
                        copyImg.id = `copy-hobo-${hoboId}-${Math.random().toString(36).substring(2,8)}`;
                        copyImg.style.verticalAlign = 'middle';

                        copyImg.addEventListener('click', (e) => {
                            e.preventDefault();
                            const textToCopy = `[hoboname=${hoboId}]`;

                            if (navigator.clipboard) {
                                navigator.clipboard.writeText(textToCopy).catch(err => {
                                    prompt("Copy to clipboard: Ctrl+C, Enter", textToCopy);
                                });
                            } else {
                                prompt("Copy to clipboard: Ctrl+C, Enter", textToCopy);
                            }

                            const oldTitle = copyImg.title;
                            copyImg.title = 'Copied!';
                            copyImg.style.filter = 'brightness(0.5) sepia(1) hue-rotate(90deg) saturate(3)';

                            const tipContent = document.getElementById('tiptip_content');
                            if (tipContent) {
                                tipContent.innerHTML = '<span style="color:#4caf50;font-weight:bold;">Copied!</span>';
                            }

                            setTimeout(() => {
                                copyImg.title = oldTitle;
                                copyImg.style.filter = '';
                                if (tipContent && tipContent.textContent === 'Copied!') {
                                    tipContent.innerHTML = oldTitle;
                                }
                            }, 1000);
                        });

                        wrapper.appendChild(copyImg);

                        const fragment = document.createDocumentFragment();
                        if (textBefore) fragment.appendChild(document.createTextNode(textBefore));
                        fragment.appendChild(wrapper);
                        if (textAfter) fragment.appendChild(document.createTextNode(textAfter));

                        td.replaceChild(fragment, node);

                        // Bind the native tipTip plugin to our new image
                        if (typeof jQuery !== 'undefined' && jQuery.fn.tipTip) {
                            // setTimeout ensures element is in DOM
                            setTimeout(() => {
                                jQuery('#' + copyImg.id).tipTip({delay: 10, edgeOffset: 12});
                            }, 10);
                        }

                        return true;
                    }
                }
                return false;
            });
        });
    },

    parseTablesInPosts: function() {
        const posts = document.querySelectorAll('span[id^="post-content-"]');
        posts.forEach(post => {
            let html = post.innerHTML;
            if (!html.includes('[hobo-helper-table]')) return;

            const tableRegex = /\[hobo-helper-table\]([\s\S]*?)\[\/hobo-helper-table\]/gi;

            html = html.replace(tableRegex, (match, content) => {
                let lines = content.replace(/<br\s*\/?>/gi, '\n').split('\n').filter(l => l.trim() !== '');

                let tableHtml = '<table class="hobo-helper-rendered-table" style="border-collapse: collapse; width: 100%; border: 1px solid #ccc; margin: 10px 0; font-size: 11px;">';

                let rowIndex = 0;

                lines.forEach(line => {
                    line = line.trim();
                    if (!line) return;

                    let headerMatch = line.match(/^\[header\](.*)\[\/header\]$/i);
                    let footerMatch = line.match(/^\[footer\](.*)\[\/footer\]$/i);

                    if (headerMatch) {
                        tableHtml += '<tr>';
                        headerMatch[1].split(',').forEach(cell => {
                            tableHtml += `<th style="border: 1px solid #ccc; padding: 4px; background: #eee; font-weight: bold; text-align: center;">${cell.trim()}</th>`;
                        });
                        tableHtml += '</tr>';
                    } else if (footerMatch) {
                        tableHtml += '<tr>';
                        footerMatch[1].split(',').forEach(cell => {
                            tableHtml += `<td style="border: 1px solid #ccc; padding: 4px; background: #f9f9f9; font-weight: bold;">${cell.trim()}</td>`;
                        });
                        tableHtml += '</tr>';
                    } else {
                        let bg = rowIndex % 2 === 0 ? '' : '#f5f5f5';
                        tableHtml += `<tr style="background-color: ${bg};">`;
                        line.split(',').forEach(cell => {
                            tableHtml += `<td style="border: 1px solid #ccc; padding: 4px;">${cell.trim()}</td>`;
                        });
                        tableHtml += '</tr>';
                        rowIndex++;
                    }
                });

                tableHtml += '</table>';
                return tableHtml;
            });
            post.innerHTML = html;
        });
    },

    enhanceVoteButtons: function() {
        const voteSpans = document.querySelectorAll('span[id^="vote-"]');
        voteSpans.forEach(span => {
            const upLink = span.querySelector('a[title="Vote Up"]');
            const downLink = span.querySelector('a[title="Vote Down"]');

            if (upLink && !upLink.hasAttribute('data-enhanced')) {
                this.convertVoteLinkToButton(upLink, 'Vote Up');
            }
            if (downLink && !downLink.hasAttribute('data-enhanced')) {
                this.convertVoteLinkToButton(downLink, 'Vote Down');
            }
        });
    },

    fixVoteTooltipBug: function() {
        // The game's original votelinker script permanently erases the tooltip class and hover bindings when you vote
        // This injects a fixed version of that function to ensure the tooltip works after voting
        const script = document.createElement('script');
        script.textContent = `
            if (typeof window.votelinker === 'function' && !window.votelinker_fixed) {
                window.votelinker = function(id, post_id, type, curvote) {
                    var link = window.ulink + "&post=" + post_id + "&do=vote&type=" + type;
                    $.get(link, function() {
                        $("#vote-" + id).html('');
                        type = type * 1;
                        if (type === 1) { curvote++; } else { curvote--; }
                        $("#votecountwrapper-" + id).hide();
                        
                        let color = "gray";
                        let displayVote = curvote > 0 ? "+" + curvote : curvote;
                        if (curvote > 0) color = "green";
                        else if (curvote < 0) color = "red";
                        
                        $("#votecountwrapper-" + id).html('<span class="tooltip" id="votecount-' + id + '" title="Loading..."><font color="' + color + '">' + displayVote + '</font></span>');
                        $("#votecountwrapper-" + id).fadeIn();
                        
                        if (typeof $.fn.tipTip !== "undefined") {
                            setTimeout(function() {
                                // Initialize the new element immediately to absorb "Loading..." just like page load
                                $("#votecount-" + id).tipTip({delay: 10, edgeOffset: 12, maxWidth: 400});
                                
                                // Re-bind the click/hover event that fetches the exact vote info
                                $("#votecount-" + id).on("hover click", function() {
                                    this.style.cursor = 'help';
                                    var t_id = this.id.replace("votecount-", "");
                                    $.get("../game/vote_info.php", { id: t_id, vc: "0" }, function(data) {
                                        jQuery('#tiptip_content').html(data);
                                        $("#votecount-" + t_id).tipTip({ delay: 10, edgeOffset: 12 });
                                    });
                                });
                            }, 5);
                        }
                    });
                };
                window.votelinker_fixed = true;
            }
        `;
        document.body.appendChild(script);
    },

    convertVoteLinkToButton: function(link, text) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.title = link.title || text;
        btn.setAttribute('data-enhanced', 'true');
        btn.style.cssText = 'cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 5px; margin: 0 4px; padding: 4px 8px; font-size: 11px; font-weight: bold; background: #f0f0f0; border: 1px solid #ccc; border-radius: 4px; color: #333; user-select: none; -webkit-user-select: none; text-decoration: none;';
        
        if (link.hasAttribute('onclick')) {
            btn.setAttribute('onclick', link.getAttribute('onclick'));
        }
        
        const img = link.querySelector('img');
        if (img) {
            const imgClone = img.cloneNode(true);
            imgClone.style.opacity = '1'; 
            btn.appendChild(imgClone);
        }
        
        const txtSpan = document.createElement('span');
        txtSpan.textContent = text;
        btn.appendChild(txtSpan);
        
        link.parentNode.replaceChild(btn, link);
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

        this.addHoboNameFormatButton();
        this.addPaidMessageButton(messageArea, settings);
    },

    addHoboNameFormatButton: function() {
        const ddButton = document.getElementById('DDbutton');
        if (!ddButton) return;

        const img = document.createElement('img');
        img.className = 'sfw';
        img.title = 'hoboname embed';
        img.src = '../images/mb_icons/hobo.gif';
        img.setAttribute('onmouseover', "this.style.cursor='pointer'");
        img.setAttribute('onclick', "utml('[hoboname=', ']','')");
        img.setAttribute('border', '0');
        img.style.cursor = 'pointer';

        ddButton.parentNode.insertBefore(img, ddButton);
        ddButton.parentNode.insertBefore(document.createTextNode(' '), ddButton);
    },

    addPaidMessageButton: function(messageArea, settings) {
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
            const hoboName = Utils.getHoboName() || 'Unknown';
            const hoboId = Utils.getHoboId() || 'Unknown';
            const dateStr = Utils.getFormattedHoboDateTime ? Utils.getFormattedHoboDateTime() : new Date().toLocaleDateString();

            let rawTemplate = settings?.MessageBoardHelper_AddPaidMessageTemplate;
            if (rawTemplate === undefined || rawTemplate === null) {
                rawTemplate = '[hoboname={hoboId}][hex=777777][i]edit: [b]PAID[/b][/i][/hex]';
            }

            const appendText = '\n\n' + String(rawTemplate)
                .replace(/{hoboname}/gi, hoboName)
                .replace(/{hoboId}/gi, hoboId)
                .replace(/{date}/gi, dateStr);

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

const MixerHelper = {
    cmds: 'mixer',
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

const PlayerHelper = {
    cmds: 'player',
    settings: [
        { key: 'PlayerHelper_EnableFeature', label: 'Enable Player Features' },
        { key: 'PlayerHelper_CopyHoboName', label: 'Show Copy [hoboname] Link' }
    ],
    init: function() {
        const settings = Utils.getSettings();
        if (settings['PlayerHelper_EnableFeature'] === false) return;

        if (settings['PlayerHelper_CopyHoboName'] !== false) {
            this.addCopyHoboNameLink();
        }
    },

    addCopyHoboNameLink: function() {
        // Find the "Citizen Information" section
        const citizenB = Array.from(document.querySelectorAll('b')).find(el => el.textContent.trim() === 'Citizen Information:');
        if (!citizenB) return;

        const container = citizenB.closest('div');
        if (!container) return;

        // Find the player's name link inside that container
        const playerLink = container.querySelector('a[href*="cmd=player&ID="]');
        if (!playerLink) return;

        const match = playerLink.href.match(/ID=(\d+)/i);
        if (!match) return;
        const hoboId = match[1];

        // The text node containing ` (107380)` usually comes right after the <a> tag
        let insertAfterNode = playerLink;
        if (playerLink.nextSibling && playerLink.nextSibling.nodeType === 3) {
            insertAfterNode = playerLink.nextSibling;
        }

        const existingLinkCopy = document.querySelector('img.linkcopy');
        const imgSrc = (existingLinkCopy && existingLinkCopy.src)
            ? existingLinkCopy.src
            : 'data:image/webp;base64,UklGRswAAABXRUJQVlA4TMAAAAAvDYABAK/BoJEkRRk6hjf1/kX9i1DQRpIay9IzmXoFbSSpsSw9k6mf/zq8/weApCRse95jm20kSUISACQlAQBJpRRJkCQJSZIAAABJktgmyZyTbQCQRFLv3a8YYwDAtiRI+oreu1IKAEgiSRIwDACwaHRGtm27iP7Hf9de6h6Xl3r1/b9pcO5dkKz7EKRvay4OZqHBsFOZrW/PD2rGPkfPbPuZOlkAEgKBNanZzqOyiFU9LsqI799GhSK7WVME3T4=';

        const copyImg = document.createElement('img');
        copyImg.src = imgSrc;
        copyImg.style.cursor = 'pointer';
        copyImg.title = `Copy [hoboname=${hoboId}]`;
        copyImg.className = 'tooltip';
        copyImg.id = `copy-hobo-${hoboId}-${Math.random().toString(36).substring(2,8)}`;
        copyImg.style.verticalAlign = 'middle';
        copyImg.style.marginLeft = '4px';

        copyImg.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = `[hoboname=${hoboId}]`;

            if (navigator.clipboard) {
                navigator.clipboard.writeText(textToCopy).catch(err => {
                    prompt("Copy to clipboard: Ctrl+C, Enter", textToCopy);
                });
            } else {
                prompt("Copy to clipboard: Ctrl+C, Enter", textToCopy);
            }

            const oldTitle = copyImg.title;
            copyImg.title = 'Copied!';
            copyImg.style.filter = 'brightness(0.5) sepia(1) hue-rotate(90deg) saturate(3)';

            const tipContent = document.getElementById('tiptip_content');
            if (tipContent) {
                tipContent.innerHTML = '<span style="color:#4caf50;font-weight:bold;">Copied!</span>';
            }

            setTimeout(() => {
                copyImg.title = oldTitle;
                copyImg.style.filter = '';
                if (tipContent && tipContent.textContent === 'Copied!') {
                    tipContent.innerHTML = oldTitle;
                }
            }, 1000);
        });

        // Insert exactly after the hobo ID text node (or the link if text node isn't found)
        insertAfterNode.parentNode.insertBefore(copyImg, insertAfterNode.nextSibling);

        // Bind the native tipTip plugin to our new image
        if (typeof jQuery !== 'undefined' && jQuery.fn.tipTip) {
            setTimeout(() => {
                jQuery('#' + copyImg.id).tipTip({delay: 10, edgeOffset: 12});
            }, 10);
        }
    }
};

const RatsHelper = {
    cmds: 'rats',
    settings: [
        { key: 'RatsHelper_NewsFilter', label: 'Rat News Filter' },
        { key: 'RatsHelper_ExpBar', label: 'Show Exp Progress Indicator' },
        { key: 'RatsHelper_ActionButtons', label: 'Convert Action Links to Buttons' }
    ],
    init: function() {
        const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
        const enableNewsFilter = savedSettings['RatsHelper_NewsFilter'] !== false;
        const enableExpBar = savedSettings['RatsHelper_ExpBar'] !== false;
        const enableActionButtons = savedSettings['RatsHelper_ActionButtons'] !== false;

        const style = document.createElement('style');
        style.textContent = `
            .upg-imgs.repositioned {
                position: static !important;
                display: flex !important;
                justify-content: center !important;
                margin-top: 4px;
                width: 100% !important;
                height: auto !important;
            }
            .upg-imgs.repositioned .upg-imgs2 {
                position: static !important;
                display: flex !important;
                flex-wrap: wrap;
                justify-content: center;
                gap: 2px;
                width: 100% !important;
            }
            .upg-imgs.repositioned .upgImg {
                position: static !important;
                margin: 0 !important;
            }
            /* Styling for the pill buttons */
            .pill-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0 8px;
                height: 24px;
                border-radius: 12px;
                font-size: 12px;
                line-height: 1;
                cursor: pointer;
                user-select: none;
                -webkit-user-select: none;
                transition: background 0.3s, transform 0.3s;
            }
            .pill-button:hover {
                background: #e0e7ff;
            }
            .pill-button:active {
                transform: scale(0.95);
            }
            .pill-button.disabled {
                opacity: 0.5;
                pointer-events: none;
            }
            
            /* Native Button Styles to convert Rat Options */
            .rat-opts a.btn {
                -webkit-font-smoothing: antialiased;
                color: #636363;
                background: #ddd;
                font-weight: bold;
                text-decoration: none;
                padding: 3px 12px;
                border-radius: 3px;
                border: 0;
                cursor: pointer;
                margin: 2px 2px;
                -webkit-appearance: none;
                display: inline-block;
                line-height: 1em;
            }

            .rat-opts a.btn:hover {
                color: #fff;
                background: #1b9eff;
                box-shadow: 0 0 0 rgba(0,0,0,.4);
                animation: pulse 1.5s infinite;
            }

            .rat-opts {
                list-style: none;
                padding: 0;
                margin: 2px 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2px;
            }

            /* Feeding UI Button styles */
            .feed-btn {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                width: 80px;
                min-height: 65px;
                text-decoration: none;
                padding: 4px 4px 14px 4px;
                background: #fff;
                border: 1px solid #c0c0c0;
                border-radius: 4px;
                color: #000;
                transition: transform 0.1s, box-shadow 0.1s;
                -webkit-font-smoothing: antialiased;
                font-family: Arial, sans-serif;
                margin: 2px;
                cursor: pointer;
                user-select: none;
                -webkit-user-select: none;
                position: relative;
            }
            a.feed-btn:hover {
                border-color: #888;
                box-shadow: 0 0 4px rgba(0,0,0,.2);
                transform: scale(1.03);
            }
            div.feed-btn.meat {
                background: #ffe6e6;
                border: 1px solid #ffb3b3;
                box-shadow: none;
                cursor: not-allowed;
                color: #999;
            }

            /* Main Rat Actions container */
            .rat-actions-container {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                gap: 10px;
                margin: 15px auto;
                padding: 12px;
                background: #f8f9fc;
                border: 1px solid #d3e0f0;
                border-radius: 6px;
                max-width: 800px;
            }
            .rat-actions-container a.btn {
                margin: 0;
                font-size: 13px;
                padding: 6px 14px;
            }
            .rat-actions-container a.btn.news-on {
                color: #fff;
                background: #5cb85c;
                border: 1px solid #4cae4c;
            }
            .rat-actions-container a.btn.news-off {
                color: #fff;
                background: #d9534f;
                border: 1px solid #d43f3a;
            }
        `;
        document.head.appendChild(style);

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        console.log('[Hobo Helper] Initializing RatsHelper');

        // Reposition upgrade images below the main rat images safely
        const ratCells = document.querySelectorAll('.ratcell');
        ratCells.forEach(cell => {
            const upg = cell.querySelector('.upg-imgs');
            if (upg) {
                upg.classList.add('repositioned');
                cell.appendChild(upg); // Moves it directly beneath the .ratimg container
            }
        });

        // Convert Rat Options links (Upgrade, Rename, Abandon) to Buttons
        const ratOptsLists = document.querySelectorAll('.rat-opts');
        ratOptsLists.forEach(ul => {
            const lists = ul.querySelectorAll('li');
            lists.forEach(li => {
                const link = li.querySelector('a');
                if (link) {
                    // Remove surrounding text nodes like '[' and ']'
                    Array.from(li.childNodes).forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            node.remove();
                        }
                    });

                    // Maintain "Abandon" text color if it's currently inside a <font color="red">
                    const fontTag = link.querySelector('font');
                    if (fontTag || link.textContent.includes('Abandon')) {
                        link.style.color = '#d9534f'; // Maintain red text visually on the button to override #636363
                        if (fontTag) {
                            link.textContent = fontTag.textContent; // pull text out of font tag
                        }
                    }
                    link.classList.add('btn');
                }
            });
        });

        if (enableNewsFilter) {
            this.initNewsFilter(contentArea);
        }
        
        if (enableExpBar) {
            this.initExpBars(contentArea);
        }

        if (enableActionButtons) {
            this.initActionButtons(contentArea);
        }

        if (window.location.search.includes('do=feed')) {
            this.initFeedUI();
        }
    },

    initActionButtons: function(contentArea) {
        // Find the "Choose active rat" or similar link in the bottom ul list
        const activeRatLink = contentArea.querySelector('a[href*="do=hobo_fights"]');
        if (!activeRatLink) return;
        const ul = activeRatLink.closest('ul');
        if (!ul) return;

        const container = document.createElement('div');
        container.className = 'rat-actions-container';

        const listItems = Array.from(ul.querySelectorAll('li'));
        listItems.forEach(li => {
            const link = li.querySelector('a');
            if (!link) return;

            const btn = document.createElement('a');
            btn.className = 'btn';
            btn.href = link.href;
            if (link.onclick) {
                btn.onclick = link.onclick;
            }

            const text = li.textContent.replace(/\s+/g, ' ').trim();

            if (text.includes('Choose active rat')) {
                btn.innerHTML = 'Choose Active Rat <span style="font-weight:normal;font-size:11px;">(Hobo Fights)</span>';
            } else if (text.includes('Visit the Pet Cemetery')) {
                btn.textContent = 'Pet Cemetery';
            } else if (text.includes('Visit the Pet Store')) {
                btn.textContent = 'Pet Store';
            } else if (text.includes('More Information')) {
                btn.textContent = 'More Information';
            } else if (text.includes('Add to Rat Fund')) {
                btn.textContent = 'Add to Rat Fund';
            } else if (text.includes('Living area news alerts')) {
                const isOn = li.querySelector('font[color="green"]');
                btn.textContent = isOn ? 'News: ON' : 'News: OFF';
                btn.classList.add(isOn ? 'news-on' : 'news-off');
            } else {
                // Fallback for unknown links
                btn.textContent = link.textContent.trim();
            }

            container.appendChild(btn);
        });

        // Clean up any extraneous <br> elements right before the ul
        let prev = ul.previousSibling;
        while (prev && (prev.tagName === 'BR' || prev.nodeType === Node.TEXT_NODE)) {
            const nextPrev = prev.previousSibling;
            prev.remove();
            prev = nextPrev;
        }

        ul.parentNode.replaceChild(container, ul);
    },

    initExpBars: function(contentArea) {
        const expHeaders = Array.from(contentArea.querySelectorAll('td')).filter(td => td.textContent.trim() === 'Experience');
        
        expHeaders.forEach(expHeader => {
            const tr = expHeader.closest('tr');
            if (!tr) return;
            const tds = Array.from(tr.children);
            const expIndex = tds.indexOf(expHeader);
            if (expIndex === -1) return;
            const table = tr.closest('table');
            if (!table) return;

            const rows = Array.from(table.rows);
            rows.forEach(row => {
                if (row === tr) return; // Skip header
                if (row.style.verticalAlign === 'top') return; // Skip rat image info rows

                if (row.children.length > expIndex) {
                    const expCell = row.children[expIndex];
                    const text = expCell.textContent.trim();
                    const parts = text.split('/').map(p => parseInt(p.trim(), 10));

                    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[1] > 0) {
                        const percent = Math.min(100, Math.max(0, (parts[0] / parts[1]) * 100));
                        const remaining = parts[1] - parts[0];
                        
                        expCell.style.position = 'relative';
                        expCell.style.zIndex = '1';
                        expCell.title = `XP to Next Level: ${remaining}`;
                        
                        const bgContainer = document.createElement('div');
                        bgContainer.style.position = 'absolute';
                        bgContainer.style.top = '2px';
                        bgContainer.style.left = '2px';
                        bgContainer.style.right = '2px';
                        bgContainer.style.bottom = '2px';
                        bgContainer.style.border = '1px solid #999';
                        bgContainer.style.backgroundColor = '#eee';
                        bgContainer.style.zIndex = '-2';
                        bgContainer.style.borderRadius = '3px';
                        bgContainer.style.overflow = 'hidden';

                        const bar = document.createElement('div');
                        bar.style.position = 'absolute';
                        bar.style.top = '0';
                        bar.style.left = '0';
                        bar.style.height = '100%';
                        bar.style.width = `${percent}%`;
                        bar.style.backgroundColor = 'rgba(76, 175, 80, 0.5)';
                        bar.style.zIndex = '-1';
                        
                        bgContainer.appendChild(bar);
                        expCell.appendChild(bgContainer);
                    }
                }
            });
        });
    },

    initFeedUI: function() {
        const feedLink = document.querySelector('a[href*="&foodID="]');
        if (!feedLink) return;
        const ul = feedLink.closest('ul');
        if (!ul) return;

        const items = Array.from(ul.querySelectorAll('li'));
        if (items.length === 0) return;

        const grouped = {};

        items.forEach(li => {
            let isMeat = false;
            let name = '';
            let exp = 0;
            let life = 0;
            let img = li.querySelector('img');
            let link = li.querySelector('a');

            if (li.title === 'Eww, meat!' || !link) {
                isMeat = true;
                const font = li.querySelector('font');
                name = (font ? font.textContent : li.textContent).trim();
            } else {
                name = link.textContent.trim();
                const textContent = li.textContent;
                const expMatch = textContent.match(/([+-]?\d+)\s+exp/i);
                const lifeMatch = textContent.match(/([+-]?\d+)\s+life/i);
                if (expMatch) exp = parseInt(expMatch[1], 10);
                if (lifeMatch) life = parseInt(lifeMatch[1], 10);
            }

            if (!grouped[name]) {
                grouped[name] = {
                    name: name,
                    img: img ? img.outerHTML : '',
                    exp: exp,
                    life: life,
                    isMeat: isMeat,
                    count: 1,
                    href: link ? link.getAttribute('href') : null
                };
            } else {
                grouped[name].count++;
            }
        });

        const sorted = Object.values(grouped).sort((a, b) => {
            if (a.isMeat && !b.isMeat) return 1;
            if (!a.isMeat && b.isMeat) return -1;
            if (a.exp !== b.exp) return a.exp - b.exp;
            return a.name.localeCompare(b.name);
        });

        const container = document.createElement('div');
        container.style.cssText = 'display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; padding: 10px; max-height: 400px; overflow-y: auto;';

        sorted.forEach(item => {
            const btn = document.createElement(item.isMeat ? 'div' : 'a');
            btn.className = 'feed-btn' + (item.isMeat ? ' meat' : '');
            
            if (item.isMeat) {
                btn.title = 'Eww, meat!';
            } else {
                btn.href = item.href;
            }

            const imgHtml = item.img ? item.img.replace('align="absmiddle"', 'style="margin-bottom: 4px;"') : '';
            btn.innerHTML = `${imgHtml}<span style="font-size: 11px; line-height: 1.2; text-align: center; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; width: 100%; margin-bottom: 2px;">${item.name}</span>`;

            if (!item.isMeat) {
                const expStat = document.createElement('span');
                expStat.style.cssText = 'position: absolute; bottom: 4px; left: 4px; font-size: 12px; line-height: 1; color: blue; font-weight: bold;';
                expStat.textContent = `${item.exp > 0 ? '+' : ''}${item.exp} exp`;
                btn.appendChild(expStat);

                const lifeStat = document.createElement('span');
                lifeStat.style.cssText = `position: absolute; bottom: 4px; right: 4px; font-size: 12px; line-height: 1; font-weight: bold; color: ${item.life < 0 ? 'red' : 'green'};`;
                lifeStat.textContent = `${item.life > 0 ? '+' : ''}${item.life} life`;
                btn.appendChild(lifeStat);
            }

            const countStr = document.createElement('div');
            countStr.style.cssText = 'font-size: 12px; font-weight: bold; color: #0055aa; margin-top: auto; z-index: 1;';
            countStr.textContent = `(${item.count})`;
            btn.appendChild(countStr);

            container.appendChild(btn);
        });

        ul.parentNode.replaceChild(container, ul);
    },

    initNewsFilter: function(contentArea) {
        const form = contentArea.querySelector('form[name="DelSelected"]');
        if (!form) return;

        const table = form.querySelector('table');
        if (!table) return;

        const rows = Array.from(table.querySelectorAll('tr[height="24"]'));
        if (rows.length === 0) return;

        const ratNames = new Set();

        rows.forEach(row => {
            const td = row.querySelectorAll('td')[1];
            if (!td) return;

            let ratName = 'Unknown';
            const strongTag = td.querySelector('b');
            if (strongTag) {
                ratName = strongTag.textContent.trim();
            } else if (td.textContent.includes('passed away')) {
                // Your rat Two Headed Rat passed away... etc
                const match = td.textContent.match(/Your rat (.*?) passed away/);
                if (match && match[1]) {
                    ratName = match[1].trim();
                }
            }

            if (ratName) {
                row.dataset.ratName = ratName;
                ratNames.add(ratName);
            }
        });

        if (ratNames.size === 0 || (ratNames.size === 1 && ratNames.has(''))) return;

        // Build UI
        const filterContainer = document.createElement('div');
        filterContainer.style.cssText = 'margin: 10px 0; padding: 10px; background: #eef5ff; border: 1px solid #b3d4fc; border-radius: 4px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px;';
        
        const label = document.createElement('span');
        label.style.fontWeight = 'bold';
        label.textContent = 'Filter News by Rat:';
        filterContainer.appendChild(label);

        const checkboxes = [];

        const updateFilters = () => {
            const selectedRats = new Set(checkboxes.filter(cb => cb.checked).map(cb => cb.value));
            rows.forEach(row => {
                if (selectedRats.has(row.dataset.ratName)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        };

        Array.from(ratNames).sort().forEach(name => {
            const cbContainer = document.createElement('label');
            cbContainer.style.cssText = 'cursor: pointer; display: flex; align-items: center; gap: 4px; background: #fff; border: 1px solid #ccc; padding: 3px 8px; border-radius: 12px; font-size: 12px; user-select: none; -webkit-user-select: none;';
            
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.value = name;
            cb.checked = true;
            cb.addEventListener('change', updateFilters);
            checkboxes.push(cb);

            cbContainer.appendChild(cb);
            cbContainer.appendChild(document.createTextNode(name));
            filterContainer.appendChild(cbContainer);
        });

        const toggleAllBtn = document.createElement('button');
        toggleAllBtn.textContent = 'Toggle All';
        toggleAllBtn.style.cssText = 'cursor: pointer; background: #e6f3ff; border: 1px solid #99c2ff; border-radius: 3px; padding: 3px 8px; font-size: 11px; color: #0055aa; user-select: none; -webkit-user-select: none;';
        toggleAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const allChecked = checkboxes.every(cb => cb.checked);
            checkboxes.forEach(cb => cb.checked = !allChecked);
            updateFilters();
        });
        filterContainer.appendChild(toggleAllBtn);

        form.parentNode.insertBefore(filterContainer, form);
    }
};

const RecyclingBinHelper = {
    cmds: 'recycling_bin',
    init: function() {

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
    cmds: 'preferences',
    init: function() {

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
        const createToggle = (key, labelText, isGlobal = false, defaultValue = true) => {
            const container = document.createElement('div');
            container.style.marginBottom = '8px';
            container.style.paddingLeft = isGlobal ? '0' : '5px';
            container.style.display = 'flex';
            container.style.alignItems = 'center';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `hw_helper_${key}`;
            // default to true if undefined
            checkbox.checked = savedSettings[key] !== undefined ? savedSettings[key] : defaultValue;
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
            toast.textContent = ' (Saved! Reload to apply)';
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

        const createInput = (feature) => {
            const { key, label: labelText, type: inputType, defaultValue, width, description } = feature;
            const wrapper = document.createElement('div');
            wrapper.style.marginBottom = '8px';
            wrapper.style.paddingLeft = '5px';

            const container = document.createElement('div');
            container.style.display = 'flex';
            if (width === '100%') {
                container.style.flexDirection = 'column';
                container.style.alignItems = 'flex-start';
            } else {
                container.style.alignItems = 'center';
            }

            const label = document.createElement('label');
            label.htmlFor = `hw_helper_${key}`;
            label.innerHTML = `${labelText}: `;
            label.style.fontFamily = 'Arial, sans-serif';
            label.style.fontSize = '14px';
            label.style.marginRight = '8px';

            const toast = document.createElement('span');
            toast.textContent = ' (Saved! Reload to apply)';
            toast.style.color = 'green';
            toast.style.fontSize = '12px';
            toast.style.display = 'none';
            toast.style.marginLeft = '8px';

            if (width === '100%') {
                label.appendChild(toast);
            }

            const input = document.createElement('input');
            input.type = inputType;
            input.id = `hw_helper_${key}`;
            input.style.width = width || (inputType === 'number' ? '60px' : '150px');
            if (width === '100%') {
                input.style.boxSizing = 'border-box';
                input.style.marginTop = '4px';
            }
            input.value = savedSettings[key] !== undefined ? savedSettings[key] : defaultValue;
            input.style.border = '1px solid #ccc';
            input.style.borderRadius = '3px';
            input.style.padding = '2px 5px';

            let toastTimeout;
            input.addEventListener('input', (e) => {
                const settings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
                settings[key] = e.target.value;
                localStorage.setItem('hw_helper_settings', JSON.stringify(settings));
                
                toast.style.display = 'inline';
                clearTimeout(toastTimeout);
                toastTimeout = setTimeout(() => { toast.style.display = 'none'; }, 2000);
            });

            container.appendChild(label);
            container.appendChild(input);
            if (width !== '100%') {
                container.appendChild(toast);
            }
            wrapper.appendChild(container);

            if (description) {
                const desc = document.createElement('div');
                desc.innerHTML = description;
                desc.style.fontSize = '11px';
                desc.style.color = '#555';
                desc.style.marginTop = '4px';
                wrapper.appendChild(desc);
            }

            return wrapper;
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
        modsLabel.textContent = "Active Modules:";
        modsLabel.style.fontWeight = 'bold';
        modsLabel.style.fontSize = '16px';
        modsLabel.style.marginBottom = '10px';
        modsLabel.style.borderBottom = '2px solid rgba(128, 128, 128, 0.3)';
        modsLabel.style.paddingBottom = '5px';
        contentArea.appendChild(modsLabel);

        const subFeatures = {};
        if (typeof Modules !== 'undefined') {
            Object.keys(Modules).forEach(modName => {
                if (Modules[modName].settings) {
                    subFeatures[modName] = Modules[modName].settings;
                }
            });
        }

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
                        let el;
                        if (feature.type === 'number' || feature.type === 'text') {
                            el = createInput(feature);
                        } else {
                            el = createToggle(feature.key, feature.label, false, feature.defaultValue !== false);
                        }

                        if (feature.parent) {
                            const parentCheckbox = document.getElementById(`hw_helper_${feature.parent}`);
                            if (parentCheckbox) {
                                const containerDiv = el;
                                const updateVisibility = () => {
                                    containerDiv.style.opacity = parentCheckbox.checked ? '1' : '0.4';
                                    containerDiv.style.pointerEvents = parentCheckbox.checked ? 'auto' : 'none';
                                };
                                parentCheckbox.addEventListener('change', updateVisibility);
                                updateVisibility();
                            }
                        }

                        subContainer.appendChild(el);
                    });
                    moduleBlock.appendChild(subContainer);
                }

                // Custom settings for FoodHelper
                if (modName === 'FoodHelper') {
                    const foodContainer = document.createElement('div');
                    foodContainer.style.paddingLeft = '25px';
                    foodContainer.style.marginTop = '10px';

                    const label = document.createElement('b');
                    label.textContent = 'Crap Foods List:';
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
                        listContainer.textContent = 'No foods marked as crap.';
                    } else {
                        const ul = document.createElement('ul');
                        ul.style.margin = '0';
                        ul.style.paddingLeft = '20px';
                        crapList.forEach(food => {
                            const li = document.createElement('li');
                            const a = document.createElement('a');
                            a.href = '#';
                            a.textContent = '[x]';
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
                                    listContainer.textContent = 'No foods marked as crap.';
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
    cmds: 'soup_kitchen',
    init: function() {

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        const settings = Utils.getSettings();
        if (settings['SoupKitchenHelper'] === false) return;

        const isSoupLine = window.location.search.includes('action=line') ||
                           Array.from(contentArea.querySelectorAll('a')).some(a => a.href.includes('action=bowl'));

        if (isSoupLine) {
            this.initSoupLine();
        }
        else {
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
    cmds: 'tattoo_parlor',
    init: function() {
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
};

const UniversityHelper = {
    cmds: 'uni',
    init: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const doParam = urlParams.get('do');
        
        if (['str', 'pow', 'spd'].includes(doParam)) {
            this.updateStatsFromTrain();
        }
        this.displayNeededStats();
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

const WeaponsHelper = {
    cmds: 'wep',
    settings: [
        { key: 'WeaponsHelper_EnableFeature', label: 'Enable Weapons Helper' }
    ],
    init: function() {
        if (!window.location.search.includes('cmd=wep')) return;

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
        const enableFeature = savedSettings['WeaponsHelper_EnableFeature'] !== false;

        if (enableFeature) {
            this.initFeature(contentArea);
        }
    },

    initFeature: function(contentArea) {
        const itemCells = contentArea.querySelectorAll('td[width="33%"]');

        itemCells.forEach(cell => {
            const links = Array.from(cell.querySelectorAll('a'));
            const actionLink = links.find(a => a.textContent.trim() === 'Equip' || a.textContent.trim() === 'Unequip');

            if (actionLink) {
                const isEquipped = actionLink.textContent.trim() === 'Unequip';

                // Highlight if equipped
                if (isEquipped) {
                    const wrapper = document.createElement('div');
                    wrapper.style.backgroundColor = 'rgba(128, 128, 128, 0.15)';
                    wrapper.style.border = '1px solid #999';
                    wrapper.style.borderRadius = '10px';
                    wrapper.style.padding = '4px';
                    wrapper.style.margin = '2px';
                    wrapper.style.height = '100%';
                    wrapper.style.boxSizing = 'border-box';

                    while (cell.firstChild) {
                        wrapper.appendChild(cell.firstChild);
                    }
                    cell.appendChild(wrapper);
                }

                // Make image a hyperlink
                const img = cell.querySelector('img');
                if (img && !img.closest('a')) {
                    const aWrapper = document.createElement('a');
                    aWrapper.href = actionLink.href;
                    aWrapper.style.display = 'inline-block';
                    // We only wrap the image, but maintain its position
                    img.parentNode.insertBefore(aWrapper, img);
                    aWrapper.appendChild(img);
                }
            }
        });
    }
};

const WellnessClinicHelper = {
    cmds: 'wellness_clinic',
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

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        const text = contentArea.textContent;
        const costMatch = text.match(/\$([0-9,]+)/);
        let detectedCost = 0;
        if (costMatch) detectedCost = Utils.parseNumber(costMatch[1]);

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

const ChangelogData = {
    changes: [
        {
            version: "8.30",
            date: "2026-04-15",
            type: "Added",
            notes: [
                "**Display Helper**: Added a new setting to display a green \"Major\" title tag next to all profile links pointing to Jack Reacher (107380)."
            ]
        },
        {
            version: "8.29",
            date: "2026-04-14",
            type: "Added",
            notes: [
                "**Player Helper**: Added a clickable icon to user profiles (cmd=player) that easily copies the user's [hoboname=ID] tag to the clipboard."
            ]
        },
        {
            version: "8.28",
            date: "2026-04-14",
            type: "Added",
            notes: [
                "Added a \\[hoboname=]\\ formatting insertion button to the message editor toolbars (MessageBoardHelper.js)."
            ]
        },
        {
            version: "8.27",
            date: "2026-04-14",
            type: "Added",
            notes: [
                "Added a clickable copy link icon next to user IDs in the Message Board to quickly format and copy their [hoboname=ID] for replies, integrating the game's native tipTip tooltip, within \\MessageBoardHelper.js\\."
            ]
        },
        {
            version: "8.26",
            date: "2026-04-14",
            type: "Added",
            notes: [
                "Added multi-column interactive client-side sorting for the Hitlist table (`HitlistHelper`), replacing the slow native server-refresh sorting links. Sorting configurations securely persist via browser local storage.",
                "Implemented a combat window highlighter within the `HitlistHelper` that automatically shades rows an alerting light red if an opponent's level drastically falls outside the player's immediate attack limits (±200 combat levels).",
                "Updated `AGENTS.md` instructions specifically to mandate the continued usage and expansion of centralized internal game value retrieval methods located within the `Utils` class instead of continuously duplicating generic operations within separate modules."
            ]
        }
    ]
};
    const DataModules = {
        DrinksData,
        EquipmentData,
        FoodData,
        PrimesData,
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
        FortSlugworthHelper,
        GangHelper,
        GangLoansHelper,
        HitlistHelper,
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

