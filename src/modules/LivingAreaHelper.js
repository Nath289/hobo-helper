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
