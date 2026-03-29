// ==UserScript==
// @name         HoboWars Stat Ratio (Delta Fix)
// @namespace    http://tampermonkey.net/
// @version      9.8
// @description  Displays only the ADDITIONAL stats needed to reach the goal.
// @author       Gemini
// @match        https://www.hobowars.com/game/game.php?*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'hoboStatRatio';
    const DEFAULT_DATA = {
        speed: 25, power: 20, strength: 55,
        targetTotal: 0, showSettings: true,
        needs: { speed: 0, power: 0, strength: 0 },
        estDays: "---",
        dailyGain: 0
    };

    let config = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_DATA;

    function getHoboMinutes() {
        const clockEl = document.getElementById('clock');
        if (!clockEl) return null;
        const match = clockEl.textContent.trim().toLowerCase().match(/(\d+):(\d+):(\d+)\s*(am|pm)/);
        if (!match) return null;
        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        if (match[4] === 'pm' && hours !== 12) hours += 12;
        if (match[4] === 'am' && hours === 12) hours = 0;
        return (hours * 60) + minutes;
    }

    function updateTracker() {
        if (window.location.href.includes('cmd=uni')) return;

        const statsBlock = document.getElementById('combatStats');
        if (!statsBlock) return;

        const findValue = (label) => {
            const lines = Array.from(statsBlock.querySelectorAll('.line'));
            const target = lines.find(l => l.textContent.includes(label));
            if (!target) return null;
            // Get the base stat (ignoring the green +boosts)
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
            const minsElapsed = getHoboMinutes();

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

                // Auto-adjust target if current stats make the goal impossible at this ratio
                const minTarget = Math.max(target, scraped.speed/spdPct, scraped.power/pwrPct, scraped.strength/strPct);

                // --- THE DELTA FIX ---
                // We calculate (Target Stat) - (Current Stat) to get the "Extra Needed"
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

                // Only show the green "+" if there is actually a need > 0
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
            config.showSettings = !config.showSettings;
            document.getElementById('settings_area').style.display = config.showSettings ? 'block' : 'none';
            localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        };

        document.getElementById('r_save').onclick = () => {
            config.targetTotal = parseFloat(document.getElementById('r_goal').value.replace(/,/g, '')) || 0;
            config.speed = parseFloat(document.getElementById('r_spd').value) || 0;
            config.power = parseFloat(document.getElementById('r_pwr').value) || 0;
            config.strength = parseFloat(document.getElementById('r_str').value) || 0;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
            updateTracker();
        };
    }

    setInterval(updateTracker, 3000);
    updateTracker();
})();