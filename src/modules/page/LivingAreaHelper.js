const LivingAreaHelper = {
    cmds: '',
    settings: [
        { key: 'LivingAreaHelper_StatRatioTracker', label: 'Stat Ratio Tracker' },
        { key: 'LivingAreaHelper_CopyStatsBtn', label: 'Copy Stats Button' },
        { key: 'LivingAreaHelper_AlwaysShowSpecialItem', label: 'Always Show Special Item' },
        { key: 'LivingAreaHelper_MixerLink', label: 'Mixer Link' },
        { key: 'LivingAreaHelper_VersionDisplay', label: 'Version Display' },
        { key: 'LivingAreaHelper_WinPercentageCalc', label: 'Win Percentage Calc' },
        { key: 'LivingAreaHelper_WideShowAll', label: 'Always Show More Info<br><span style="font-size: 11px; color: #555;">(Requires Display Helper Page Width >= 850px)</span>' },
        { key: 'LivingAreaHelper_ReturnBranded', label: 'Quick Return Branded Button' }
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
            this.initWinPercentageCalc(savedSettings);
        }
        if (savedSettings['LivingAreaHelper_WideShowAll'] !== false) {
            this.initWideShowAll(savedSettings);
        }
        if (savedSettings['LivingAreaHelper_ReturnBranded'] !== false) {
            this.initReturnBranded();
        }

        this.initInactiveSpecialItemBg();
        this.syncHealingTracker();
    },

    syncHealingTracker: function() {
        const lastHealSaved = localStorage.getItem('hw_healing_last_used');

        const urlParams = new URLSearchParams(window.location.search);
        const cmd = urlParams.get('cmd');
        
        // Ensure we're in the main living area, without a sub-command like 'food' or 'points'
        if (cmd && cmd !== '') return;

        // Check if alive
        const lifeLabel = document.getElementById('lifeValue');
        if (lifeLabel && lifeLabel.textContent.trim() === '0%') return;

        // Parse "Alive: 27 min 30 sec" or "Alive: 03 secs"
        const statsLines = document.querySelectorAll('#generalDisplay .line');
        let aliveLine = null;
        statsLines.forEach(line => {
            if (line.textContent.includes('Alive:')) {
                aliveLine = line;
            }
        });

        if (aliveLine) {
            const aliveText = aliveLine.textContent;
            let totalSeconds = 0;

            const minMatch = aliveText.match(/(\d+)\s*mins?/i);
            if (minMatch) {
                totalSeconds += parseInt(minMatch[1], 10) * 60;
            }

            const secMatch = aliveText.match(/(\d+)\s*secs?/i);
            if (secMatch) {
                totalSeconds += parseInt(secMatch[1], 10);
            }

            if (totalSeconds > 0) {
                const estimatedHealTime = Date.now() - (totalSeconds * 1000);
                const savedTime = lastHealSaved ? parseInt(lastHealSaved, 10) : 0;
                
                // Allow a tiny margin of error (e.g., 5 seconds) to prevent constant overwriting
                // if it's already generally correct from the hospital click.
                // If it differs by more than 5s, the game's actual server time is offset from local storage.
                if (!lastHealSaved || Math.abs(estimatedHealTime - savedTime) > 5000) {
                    localStorage.setItem('hw_healing_last_used', estimatedHealTime.toString());
                    console.log('LivingAreaHelper: Synced healing tracker local storage to server Alive time.');
                }
            }
        }
    },

    initReturnBranded: function() {
        const viewListLinks = Array.from(document.querySelectorAll("a[href*=\x22cmd=wep\x22]"));
        const targetLink = viewListLinks.find(a => a.textContent.trim() === "View List");

        if (targetLink) {
            const btn = document.createElement("button");
            btn.textContent = "Return Branded";
            btn.className = "btn";
            btn.style.display = "block";
            btn.style.margin = "4px auto";
            btn.style.userSelect = "none";
            btn.style.webkitUserSelect = "none";

            btn.onclick = function(e) {
                e.preventDefault();
                if (confirm("Are you sure you want to return all your loaned branded items to the Gang Armory?")) {
                    const sr = Utils.getSr();
                    if (sr) {
                        window.location.href = "game.php?sr=" + sr + "&cmd=wep&do=return_branded";
                    }
                }
            };

            let insertBeforeNode = targetLink.nextSibling;
            if (insertBeforeNode && insertBeforeNode.nodeName === 'IMG') {
                insertBeforeNode = insertBeforeNode.nextSibling;
            }

            const br = document.createElement("br");
            targetLink.parentNode.insertBefore(br, insertBeforeNode);
            targetLink.parentNode.insertBefore(btn, insertBeforeNode);
        }
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

    initWinPercentageCalc: function(settings) {
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

            const isWiden = settings['LivingAreaHelper_WideShowAll'] !== false && settings['DisplayHelper_WidenPage'];
            const pageWidth = parseInt(settings['DisplayHelper_PageWidth'] || 660, 10);

            if (isWiden && pageWidth >= 850) {
                const personalInfo = document.getElementById('personalInfo');
                if (personalInfo) {
                    const block = document.createElement('div');
                    block.className = 'statBlock line more_info';
                    block.style.display = 'block';
                    block.innerHTML = calcHtml;
                    personalInfo.insertAdjacentElement('afterend', block);

                    const winCalc = block.querySelector('#winCalc');
                    if (winCalc) {
                        winCalc.style.borderTop = 'none';
                        winCalc.style.marginTop = '0';
                        winCalc.style.paddingTop = '0';
                    }
                    return;
                }
            }

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
