const LivingAreaHelper = {
    cmds: '',
    staff: false,
    group: 'General',
    settings: [
        { key: 'LivingAreaHelper_StatRatioTracker', label: 'Stat Ratio Tracker' },
        { key: 'LivingAreaHelper_CopyStatsBtn', label: 'Copy Stats Button' },
        { key: 'LivingAreaHelper_AlwaysShowSpecialItem', label: 'Always Show Special Item' },
        { key: 'LivingAreaHelper_MixerLink', label: 'Mixer Link' },
        { key: 'LivingAreaHelper_VersionDisplay', label: 'Version Display' },
        { key: 'LivingAreaHelper_WinPercentageCalc', label: 'Win Percentage Calc' },
        { key: 'LivingAreaHelper_WideShowAll', label: 'Always Show More Info<br><span style="font-size: 11px; color: #555;">(Requires Display Helper Page Width >= 850px)</span>' },
        { key: 'LivingAreaHelper_ReturnBranded', label: 'Quick Return Branded Button' },
        { key: 'LivingAreaHelper_NextRespectNeeded', label: 'Show Next Respect Needed' },
        { key: 'LivingAreaHelper_ShowTattooDays', label: 'Show Tattoo Expiration Days', default: true },
        { key: 'LivingAreaHelper_SwimTeamImage', label: 'Show Swim Team Image', default: true },
        { key: 'LivingAreaHelper_FullWidthGraph', label: 'Full Width Log Graphs' },
        { key: 'LivingAreaHelper_MiningStatsGroup', label: 'Dedicated Mining Stats Section' }
    ],
    init: function() {
        const savedSettings = Utils.getSettings();

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
        if (savedSettings['LivingAreaHelper_NextRespectNeeded'] !== false) {
            this.initNextRespectNeeded();
        }
        if (savedSettings?.LivingAreaHelper_ShowTattooDays !== false) {
            this.initShowTattooDays();
        }
        if (savedSettings?.LivingAreaHelper_SwimTeamImage !== false) {
            this.initSwimTeamImage();
        }
        if (savedSettings?.LivingAreaHelper_FullWidthGraph !== false) {
            this.initFullWidthGraph();
        }
        if (savedSettings?.LivingAreaHelper_MiningStatsGroup !== false) {
            this.initMiningStatsGroup();
        }

        this.initInactiveSpecialItemBg();
        this.saveTattoo();
        this.syncHealingTracker();
    },

    initFullWidthGraph: function() {
        const style = document.createElement('style');
        style.innerHTML = `
            #jqplot_container { width: 100% !important; margin: 0 auto; box-sizing: border-box; }
            .jqplot-target { width: 100% !important; }
        `;
        document.head.appendChild(style);
    },

    initSwimTeamImage: function() {
        const urlParams = new URLSearchParams(globalThis.location.search);
        const cmd = urlParams.get('cmd');
        if (cmd && cmd !== '') return;

        if (document.getElementById('hh_swimteam_img')) return;

        const links = Array.from(document.querySelectorAll('a'));
        const referredLink = links.find(a => a.textContent.includes('List Hobos Referred'));

        if (referredLink) {
            const ul = referredLink.closest('ul');
            if (ul) {
                const img = document.createElement('img');
                img.id = 'hh_swimteam_img';
                img.src = 'https://bronxme.com/swimteamdm.php';
                img.style.cssText = 'float: right; margin-top: -30px; margin-right: 25px;';

                ul.insertAdjacentElement('beforebegin', img);
            }
        }
    },

    initMiningStatsGroup: function() {
        const generalDisplay = document.getElementById('generalDisplay');
        const resourcesDisplay = document.getElementById('resourcesDisplay');

        if (!generalDisplay || !resourcesDisplay) return;

        const lines = Array.from(generalDisplay.querySelectorAll('.line'));
        const miningLine = lines.find(line => line.textContent.includes('Mining:'));

        if (miningLine) {
            const miningBlock = document.createElement('div');
            miningBlock.className = 'statBlock line more_info';
            if (resourcesDisplay.style.display === 'none') {
                miningBlock.style.display = 'none';
                miningBlock.style.overflow = 'hidden';
            } else {
                miningBlock.style.display = 'block';
            }
            miningBlock.id = 'hh_miningStats';
            
            const titleLine = document.createElement('div');
            titleLine.className = 'line';
            titleLine.innerHTML = '<span><u>Mining Stats</u></span>';
            miningBlock.appendChild(titleLine);
            
            miningLine.className = 'line';
            miningLine.style.display = '';
            miningBlock.appendChild(miningLine);

            const statGain = Utils.getItem('hw_MiningHelper_StatGain');
            if (statGain) {
                const statLine = document.createElement('div');
                statLine.className = 'line';
                statLine.innerHTML = `<span>Net Stat Gain:</span> ${statGain}`;
                miningBlock.appendChild(statLine);
            }

            const tradesToday = Utils.getItem('hw_MiningHelper_TradesToday');
            if (tradesToday) {
                const tradeLine = document.createElement('div');
                tradeLine.className = 'line';
                tradeLine.innerHTML = `<span>Stat Trades Today:</span> ${tradesToday}`;
                miningBlock.appendChild(tradeLine);
            }

            const todayStats = Utils.getItem('hw_MinesHelper_TodayStats');
            if (todayStats) {
                const statLine = document.createElement('div');
                statLine.className = 'line';
                statLine.innerHTML = `<span>Mining Stat Gained Today:</span> ${todayStats}`;
                miningBlock.appendChild(statLine);
            }

            const todayOres = Utils.getItem('hw_MinesHelper_TodayOres');
            if (todayOres) {
                const oreLine = document.createElement('div');
                oreLine.className = 'line';
                oreLine.innerHTML = `<span>Ore Gained Today:</span> ${todayOres}`;
                miningBlock.appendChild(oreLine);
            }
            
            resourcesDisplay.parentNode.insertBefore(miningBlock, resourcesDisplay);

            const br = document.createElement('br');
            resourcesDisplay.parentNode.insertBefore(br, resourcesDisplay);
        }
    },

    saveTattoo: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const cmd = urlParams.get('cmd');
        if (cmd && cmd !== '') return;

        const myHobo = document.getElementById('myhobo');
        if (myHobo) {
            const tattooLink = myHobo.querySelector('a[href*="cmd=tattoo_parlor"] img');
            if (tattooLink && tattooLink.title) {
                const tattooName = tattooLink.title.split(':')[0].trim();
                localStorage.setItem('hw_helper_tattoo', tattooName);
            } else {
                localStorage.removeItem('hw_helper_tattoo');
            }
        }
    },

    initShowTattooDays: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const cmd = urlParams.get('cmd');
        if (cmd && cmd !== '') return;

        const myHobo = document.getElementById('myhobo');
        if (myHobo) {
            const tattooLink = myHobo.querySelector('a[href*="cmd=tattoo_parlor"] img');
            if (tattooLink && tattooLink.title) {
                const match = tattooLink.title.match(/\(([^)]+days?\s+left)\)/i);
                if (match) {
                    const daysLeftStr = match[1];
                    const div = document.createElement('div');
                    div.style.cssText = 'text-align: center; font-size: 11px; margin-top: 2px; margin-bottom: 6px; font-weight: bold; color: #555;';
                    div.innerHTML = daysLeftStr;
                    tattooLink.parentNode.insertAdjacentElement('afterend', div);
                }
            }
        }
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

            const hrMatch = aliveText.match(/(\d+)\s*(?:hr|hour)s?/i);
            if (hrMatch) {
                totalSeconds += parseInt(hrMatch[1], 10) * 3600;
            }

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
                    Utils.log('LivingAreaHelper: Synced healing tracker local storage to server Alive time.');
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

    initNextRespectNeeded: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const cmd = urlParams.get('cmd');
        if (cmd) return;

        const generalDisplay = document.getElementById('generalDisplay');
        if (!generalDisplay) return;

        const lines = generalDisplay.querySelectorAll('.line');
        let respectLine = null;
        for (let line of lines) {
            if (line.querySelector('span') && line.querySelector('span').textContent.includes('Respect:')) {
                respectLine = line;
                break;
            }
        }

        if (!respectLine) return;

        const respectText = respectLine.textContent;
        const match = respectText.match(/\((.*?)\)/);
        if (!match) return;

        const currentRespectStr = match[1].replace(/[^\d-]/g, '');
        if (!currentRespectStr) return;

        const currentRespectInt = parseInt(currentRespectStr, 10);
        const currentRespectAbs = Math.abs(currentRespectInt);

        let nextRankInfo = null;
        for (let i = 0; i < RespectData.length; i++) {
            if (currentRespectAbs < RespectData[i].minRespect) {
                nextRankInfo = RespectData[i];
                break;
            }
        }

        if (nextRankInfo) {
            const needObj = nextRankInfo.minRespect;

            const nextLine = document.createElement('div');
            nextLine.className = 'line';
            nextLine.style.fontSize = '11px';
            nextLine.style.color = '#777';
            
            const nextTitle = currentRespectStr.includes('-') ? nextRankInfo.negTitle : nextRankInfo.posTitle;
            const thresholdStr = currentRespectStr.includes('-') ? '-' + needObj.toLocaleString() : needObj.toLocaleString();
            const color = currentRespectStr.includes('-') ? '#FF1100' : '#22A100';
            
            nextLine.innerHTML = `<span style="width: auto; margin-right: 5px;">&#8627; Next:</span> <span style="color: #444;">${nextTitle} (<font color="${color}">${thresholdStr}</font>)</span>`;

            respectLine.insertAdjacentElement('afterend', nextLine);
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
                .leftStats {
                    width: auto !important;
                    min-width: 40% !important;
                    max-width: 55% !important;
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

        let latestVersion = "Unknown";
        if (typeof Modules !== 'undefined' && Modules.ChangelogData && Modules.ChangelogData.changes && Modules.ChangelogData.changes.length > 0) {
            latestVersion = Modules.ChangelogData.changes[0].version;
        }

        let syncHtml = '';
        if (Utils.getSettings()['SyncHelper_Enable'] === true) {
            let syncTimeStr = "Never";
            const lastSync = parseInt(Utils.getItem('hw_sync_last_sync') || '0', 10);
            if (lastSync > 0) {
                const diffMs = Date.now() - lastSync;
                const diffMins = Math.floor(diffMs / 60000);
                if (diffMins < 1) {
                    syncTimeStr = "Just now";
                } else if (diffMins < 60) {
                    syncTimeStr = `${diffMins}m ago`;
                } else if (diffMins < 1440) {
                    const diffHrs = Math.floor(diffMins / 60);
                    syncTimeStr = `${diffHrs}h ago`;
                } else {
                    const diffDays = Math.floor(diffMins / 1440);
                    syncTimeStr = `${diffDays}d ago`;
                }
            }
            syncHtml = `<br><span style="font-size: 10px; color: #999;">Last Sync: ${syncTimeStr}</span><br><a href="#" id="hh_force_sync" style="color: #009933; text-decoration: none;">Force Sync</a> <span id="hh_force_sync_status" style="color: #4CAF50; display: none;">(&#10003;)</span>`;
        }

        const versionHtml = `
            <div style="text-align: center; font-size: 11px; margin-top: 8px; font-family: Tahoma, Arial, sans-serif; display: block; width: 100%;">
                Hobo Helper v${latestVersion}<br>
                <a href="#" id="hh_show_credits" style="color: #0066cc; text-decoration: none;">Credits</a><br>
                <a href="#" id="hh_show_changelog" style="color: #0066cc; text-decoration: none;">View Changelog</a>${syncHtml}
            </div>
        `;

        const myHoboCenter = document.querySelector('#myhobo center');
        if (myHoboCenter) {
            myHoboCenter.insertAdjacentHTML('beforeend', versionHtml);
        } else {
            const gearInfo = document.getElementById('gearInfo');
            if (gearInfo) {
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
            }
        }

        const creditsLink = document.getElementById('hh_show_credits');
        if (creditsLink) {
            creditsLink.addEventListener('click', (e) => this.showCreditsModal(e));
        }

        const link = document.getElementById('hh_show_changelog');
        if (link) {
            link.addEventListener('click', (e) => Utils.showChangelogModal(e));
        }

        const syncLink = document.getElementById('hh_force_sync');
        if (syncLink && typeof SyncHelper !== 'undefined') {
            syncLink.addEventListener('click', async (e) => {
                e.preventDefault();
                syncLink.textContent = 'Syncing...';
                syncLink.style.opacity = '0.5';
                syncLink.style.pointerEvents = 'none';

                await SyncHelper.syncAllNow();

                const status = document.getElementById('hh_force_sync_status');
                if (status) {
                    status.style.display = 'inline';
                }

                setTimeout(() => {
                    window.location.reload();
                }, 500);
            });
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

        let config = JSON.parse(Utils.getItem(STORAGE_KEY)) || DEFAULT_DATA;
        let inMemoryLastUpdated = config.lastUpdated;

        function updateTracker(shouldSync = false) {
            const statsBlock = document.getElementById('combatStats');
            if (!statsBlock) return;

            // Fetch latest from storage to prevent background tabs from reverting settings
            if (!shouldSync) {
                try {
                    const savedConfig = JSON.parse(Utils.getItem(STORAGE_KEY));
                    if (savedConfig) {
                        config = Object.assign(config, savedConfig);
                    }
                } catch (e) {}
            }

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

                    if (shouldSync) {
                        Utils.setItem(STORAGE_KEY, JSON.stringify(config));
                    } else {
                        // Update local cache but avoid triggering global network sync loops on routine page loading calculation logic
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
                    }

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
                <div style="font-size:13px; margin-bottom:5px;"><b>Effective Goal:</b> ${Math.round(target).toLocaleString()} <span id="cog_toggle" style="float:right; cursor:pointer; opacity:0.5;">&#9881;</span></div>
                <div style="font-size:11px; color:#666;">Est: ~${config.estDays} days (@ ${Math.round(config.dailyGain)}/day)</div>
                <div id="settings_area" style="margin-top:8px; padding-top:5px; border-top:1px solid #ddd; display:${config.showSettings ? 'block' : 'none'};">
                    <div style="font-size:11px; font-weight:bold; color:#0066cc;">Target Total (0 for Auto)</div>
                    <input type="text" id="r_goal" value="${config.targetTotal}" style="width:100%; margin-bottom:8px; box-sizing: border-box;" autocomplete="off">
                    <div style="font-size:11px; font-weight:bold;">Ratio (Spd : Pwr : Str)</div>
                    <div style="display:flex; gap:4px; margin-bottom:10px;">
                        <input type="number" id="r_spd" value="${config.speed}" style="width:33%; box-sizing: border-box;" autocomplete="off">
                        <input type="number" id="r_pwr" value="${config.power}" style="width:33%; box-sizing: border-box;" autocomplete="off">
                        <input type="number" id="r_str" value="${config.strength}" style="width:33%; box-sizing: border-box;" autocomplete="off">
                    </div>
                    <button type="button" id="r_save" style="width:100%; cursor:pointer; background:#666; color:#fff; border:none; padding:5px; font-weight:bold;">Update Goals</button>
                </div>
            `;

            document.getElementById('cog_toggle').onclick = (e) => {
                if (e) e.preventDefault();
                try {
                    const savedConfig = JSON.parse(Utils.getItem(STORAGE_KEY));
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

            document.getElementById('r_save').onclick = (e) => {
                if (e) e.preventDefault();
                try {
                    const savedConfig = JSON.parse(Utils.getItem(STORAGE_KEY));
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
                        // Don't accidentally overwrite the config with stale values right before grabbing inputs
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
                
                // Cache the newly updated config locally right now so `updateTracker` doesn't pull the old version from cache and overwrite our updates
                localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
                
                // updateTracker will parse the new settings and natively call the CouchDB sync hook once
                updateTracker(true);
            };
        }

        // Run once on page load instead of constantly polling
        updateTracker();
    },

    showCreditsModal: function(e) {
        if (e) e.preventDefault();

        let existing = document.getElementById('hw-helper-credits-modal');
        if (existing) { existing.style.display = 'block'; return; }

        const modal = document.createElement("div");
        modal.id = 'hw-helper-credits-modal';
        modal.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); z-index:9999; max-width:400px; width:90%; background-color:#f9f9f9; border:1px dashed #777; border-radius:8px; text-align:left; font-family:Tahoma, Arial, sans-serif; color:#333; box-shadow:0px 4px 6px rgba(0,0,0,0.5); padding:15px; max-height:80vh; overflow-y:auto;";

        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&#10006;';
        closeBtn.style.cssText = "float:right; cursor:pointer; font-size:18px; font-weight:bold; color:#d9534f; user-select: none; -webkit-user-select: none;";
        closeBtn.onclick = () => { modal.style.display = 'none'; };
        modal.appendChild(closeBtn);

        const title = document.createElement("h2");
        title.textContent = "Hobo Helper Credits";
        title.style.margin = "0 0 10px 0";
        title.style.borderBottom = "1px solid #ccc";
        title.style.paddingBottom = "5px";
        title.style.fontSize = "16px";
        modal.appendChild(title);

        const content = document.createElement("div");
        content.style.marginTop = "10px";
        content.style.fontSize = "13px";
        content.style.lineHeight = "1.5";
        
        const srObj = new URLSearchParams(window.location.search).get('sr');
        const srParam = srObj ? `sr=${srObj}&` : '';
        
        content.innerHTML = `
            <b>Creator:</b> <a href="game.php?${srParam}cmd=player&ID=107380" style="color: #0066cc; text-decoration: none;">Jack Reacher (107380)</a><br><br>
            <i>Created with the help, guidance and support of †ëh Fucking Nämêless</i><br><br>
            <i>Donations and suggestions welcome</i>
        `;
        modal.appendChild(content);

        document.body.appendChild(modal);
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














































