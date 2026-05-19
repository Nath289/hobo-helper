const DisplayHelper = {
    staff: false,
    group: 'Global',
    localKeys: [
        'hw_last_active_time',
        'hw_rejoin_time',
        'hw_last_active_awakeness',
        'hw_session_lost_awake_checked',
        'hw_session_lost_awake',
        'hw_awake_last_active',
        'hw_awake_current',
        'hw_awake_max',
        'hw_awake_is_donator',
        'hw_awake_notified',
        'DisplayHelper_WidenPage',
        'DisplayHelper_PageWidth'
    ],
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
        { key: 'DisplayHelper_ShowCans', label: 'Show Cans in Top Menu', defaultValue: true },
        { key: 'DisplayHelper_ShowGangHitlistLink', label: 'Show Gang Hitlist in Top Menu', defaultValue: true },
        { key: 'DisplayHelper_LastActiveTime', label: 'Display Last Active Time in Panel', defaultValue: true },
        { key: 'DisplayHelper_ActivePageImages', label: 'Display Active Page Menu Images', defaultValue: true },
        { key: 'DisplayHelper_ShowUpdateChangelog', label: 'Show Update Features on New Version', defaultValue: true }
    ],
    addedStyles: '',
    init: function() {
        this.addedStyles = '';
        this.initUpdateChecker();
        this.initLastActiveTimeTracking();

        const settings = Utils.getSettings();
        // This function only runs if the global helper is enabled,
        // and if this specific 'DisplayHelper' is enabled via SettingsHelper.
        if (settings['DisplayHelper_ImprovedAvatars'] !== false) {
            this.initImprovedAvatars();
        }
        if (settings['DisplayHelper_CustomTitles'] !== false) {
            this.initCustomTitles();
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
        if (settings['DisplayHelper_ShowGangHitlistLink'] !== false) {
            this.initShowGangHitlistLink();
        }
        if (settings['DisplayHelper_LastActiveTime'] !== false) {
            this.initLastActiveTimeDisplay();
        }
        if (settings['DisplayHelper_ActivePageImages'] !== false) {
            this.initActivePageImages();
        }

        if (this.addedStyles) {
            const style = document.createElement('style');
            style.innerHTML = this.addedStyles;
            document.head.appendChild(style);
        }
    },
    initUpdateChecker: function() {
        const settings = Utils.getSettings();
        const savedVersion = Utils.getItem('hw_helper_version');
        const currentVersion = (typeof Modules !== 'undefined' && Modules.ChangelogData && Modules.ChangelogData.changes && Modules.ChangelogData.changes.length > 0) ? Modules.ChangelogData.changes[0].version : null;

        if (currentVersion) {
            if (savedVersion && savedVersion !== currentVersion) {
                const svFloat = parseFloat(savedVersion);
                const cvFloat = parseFloat(currentVersion);
                if (cvFloat > svFloat && settings['DisplayHelper_ShowUpdateChangelog'] !== false) {
                    Utils.showChangelogModal(null, savedVersion);
                }
            }
            Utils.setItem('hw_helper_version', currentVersion);
        }
    },
    initLastActiveTimeTracking: function() {
        // Track last active time, updating at most every 30 seconds
        const now = Date.now();
        const lastActiveTime = parseInt(Utils.getItem('hw_last_active_time') || '0', 10);
        const timeSinceLast = now - lastActiveTime;

        const updateLastActive = () => {
            Utils.setItem('hw_last_active_time', now.toString());
            Utils.removeItem('hw_rejoin_time');
            Utils.setItem('hw_last_active_awakeness', Utils.getAwakeness().toString());
            Utils.removeItem('hw_session_lost_awake_checked');
            Utils.removeItem('hw_session_lost_awake');
        };

        if (timeSinceLast > 1800000) { // 30 minutes
            // Calculate lost awakeness
            if (lastActiveTime > 0 && !Utils.getItem('hw_session_lost_awake_checked')) {
                const prevAwake = parseInt(Utils.getItem('hw_last_active_awakeness') || '0', 10);
                const inactiveMins = timeSinceLast / 60000;
                const isDonator = Utils.isDonator();
                const tickInterval = isDonator ? 10 : 15;
                const ticks = Math.floor(inactiveMins / tickInterval);
                const estimatedAwake = prevAwake + (ticks * 5);
                
                let maxAwake = 100;
                const currentAwake = Utils.getAwakeness();
                const awakeSpan = document.getElementById('awakeValue');
                if (awakeSpan) {
                    const awakeMatch = awakeSpan.textContent.match(/(\d+)\/(\d+)/);
                    if (awakeMatch) maxAwake = parseInt(awakeMatch[2], 10);
                }

                if (currentAwake >= maxAwake && estimatedAwake > maxAwake) {
                    const lost = estimatedAwake - maxAwake;
                    Utils.setItem('hw_session_lost_awake', lost.toString());
                }
                Utils.setItem('hw_session_lost_awake_checked', '1');
            }

            if (Utils.getAwakeness() === 0) {
                // If awakeness is 0, they are already playing/active, immediately log active time
                updateLastActive();
            } else {
                const rejoinTime = parseInt(Utils.getItem('hw_rejoin_time') || '0', 10);
                // If starting a new session (or it's been > 5 mins since our initial rejoin attempt)
                if (rejoinTime === 0 || (now - rejoinTime) > 300000) {
                    Utils.setItem('hw_rejoin_time', now.toString());
                } else if (now - rejoinTime >= 30000) {
                    // If they've been active for at least 30 seconds since rejoining
                    updateLastActive();
                }
            }
        } else if (timeSinceLast > 30000) {
            updateLastActive();
        }
    },
    initLastActiveTimeDisplay: function() {
        const leftPanel = document.querySelector('.left-panel');
        if (!leftPanel) return;

        const displayDiv = document.createElement('div');
        displayDiv.style.textAlign = 'center';
        displayDiv.style.fontSize = '12px';
        displayDiv.style.padding = '5px 2px';
        displayDiv.style.fontWeight = 'bold';
        
        leftPanel.insertBefore(displayDiv, leftPanel.firstChild);

        const updateDisplay = () => {
            const lastActive = parseInt(Utils.getItem('hw_last_active_time') || '0', 10);
            if (!lastActive) {
                displayDiv.textContent = 'Last Active: Unknown';
                return;
            }

            const elapsedSecs = Math.floor((Date.now() - lastActive) / 1000);
            if (elapsedSecs < 60) {
                displayDiv.textContent = 'Active: Just now';
                return;
            }
            
            const hours = Math.floor(elapsedSecs / 3600);
            const mins = Math.floor((elapsedSecs % 3600) / 60);

            let timeParts = [];
            if (hours > 0) timeParts.push(`${hours}h`);
            if (mins > 0 || hours === 0) timeParts.push(`${mins}m`);
            
            let displayStr = `Last Active: ${timeParts.join(' ')} ago`;
            const lostAwake = parseInt(Utils.getItem('hw_session_lost_awake') || '0', 10);
            if (lostAwake > 0) {
                displayStr += `<br><span style="color: #d9534f; font-weight: normal;">Lost Awake: ${lostAwake}</span>`;
            }
            displayDiv.innerHTML = displayStr;
        };

        updateDisplay();
        setInterval(updateDisplay, 30000); // 30 seconds interval check
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
    initShowGangHitlistLink: function() {
        const topbarMenuUl = document.querySelector('.topbar-menu ul');
        if (!topbarMenuUl) return;

        const existingLinks = Array.from(topbarMenuUl.querySelectorAll('a'));
        if (existingLinks.some(a => a.href.includes('cmd=gang') && a.href.includes('do=hitlist'))) return;

        const lastLink = topbarMenuUl.querySelector('li:last-child a');
        let href = 'game.php?cmd=gang&do=hitlist';
        if (lastLink && lastLink.href) {
            const urlObj = new URL(lastLink.href, window.location.href);
            urlObj.searchParams.set('cmd', 'gang');
            urlObj.searchParams.set('do', 'hitlist');
            href = urlObj.pathname + urlObj.search;
        }

        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = href;
        a.textContent = 'Gang Hitlist';
        li.appendChild(a);
        topbarMenuUl.appendChild(li);
    },
    initActivePageImages: function() {
        const imageMap = {
            'mart': '/images/l/areas/sghm.jpg',
            'hospital': '/images/l/areas/hospital.jpg',
            'city': '/images/l/areas/city.jpg',
            'city2': '/images/l/areas/Second-City.jpg',
            'shopping': '/images/l/areas/walmart.jpg',
            'hill': '/images/l/areas/suicidehill.jpg',
            'hill3': '/images/l/areas/suicidehill.jpg',
            'bank': '/images/l/areas/piggybank.jpg',
            'depo': '/images/l/areas/candepo.jpg',
            'uni': '/images/l/areas/uni.jpg',
            'battle': '/images/l/areas/Battle-1.jpg',
            'rats': '/images/l/areas/rats.jpg',
            'hoburbia': '/images/l/areas/Hoburbia.jpg',
            'canbodia': '/images/l/areas/Canbodia.jpg',
            'camp_kurtz': '/images/l/areas/Kurtz-Camp.jpg',
            'mines': '/images/l/areas/Mines.jpg',
            'wellness_clinic': '/images/l/areas/Wellness-Clinic.jpg',
            'soup_kitchen': '/images/l/areas/Soup-Kitchen.jpg',
            'hoburbs': '/images/l/areas/Hoburbs.jpg',
            'explore': '/images/l/areas/occupy-north-side.jpg',
            'red_light_dis': '/images/l/areas/Red-Light-District.jpg',
            '711': '/images/l/areas/711.jpg',
            'arcade': '/images/l/areas/arcade.jpg',
            'river': '/images/l/areas/Canbodia.jpg',
            'war': '/images/l/areas/duncans-house.jpg',
            'inout': '/images/l/areas/In-N-Out.jpg',
            'mail': '/images/l/areas/mailbox.jpg',
            'gathering': '/images/l/areas/messageboard.jpg',
            'gang': '/images/l/areas/gangsalley.jpg',
            'gangs': '/images/l/areas/gangsalley.jpg',
            'food': '/images/l/areas/trollycontents.jpg',
            'club': '/images/l/areas/Bernards-Mansion2.jpg',
            'bernards': '/images/l/areas/Bernards-Mansion2.jpg',
            'parking_garage': '/images/l/areas/Parking-Garage.jpg',
            'sewer': '/images/l/areas/Sewer.jpg',
            'arena': '/images/l/areas/Arena.jpg',
            'hw_arena': '/images/l/areas/Arena.jpg',
            'army_base': '/images/l/areas/Army-Base.jpg',
            'backpack': '/images/l/areas/Unusually-large-backpack.jpg',
            'beach': '/images/l/areas/Beach.jpg',
            'beeramid': '/images/l/areas/Beeramid.jpg',
            'bowling_alley': '/images/l/areas/Bowling-Alley.jpg',
            'boxing': '/images/l/areas/Boxing-Stadium.jpg',
            'bus': '/images/l/areas/Short-Bus.jpg',
            'bus_station': '/images/l/areas/Bus-Station.jpg',
            'candy_store': '/images/l/areas/Candy-Store.jpg',
            'pvp_flag': '/images/l/areas/Capture-The-Flag.jpg',
            'carnival': '/images/adventures/Ringmaster.jpg',
            'cas': '/images/l/areas/casino.jpg',
            'chocolate_factory': '/images/l/areas/Chocolate-Factory.jpg',
            'city_hall': '/images/l/areas/City-Hall.jpg',
            'courthouse': '/images/l/areas/Court-House.jpg',
            'dive_bar': '/images/l/areas/Dive-Bar.jpg',
            'docks': '/images/l/areas/Docks.jpg',
            'fort_slugworth': '/images/l/areas/Fort-Slugworth.jpg',
            'h_school': '/images/l/areas/highschool.jpg',
            'hot_topic': '/images/l/areas/Hot-Topic.jpg',
            'improved_dumpster': '/images/l/areas/Improved-Dumpster.jpg',
            'jungle': '/images/l/areas/Jungle.jpg',
            'liquor_store': '/images/l/areas/Liquor-Store.jpg',
            'night_club': '/images/l/areas/Night-Club.jpg',
            'nursing_home': '/images/l/areas/Nursing-Home.jpg',
            'park': '/images/l/areas/Park.jpg',
            'park|entrance': '/images/l/areas/Park.jpg',
            'pawn_shop': '/images/l/areas/Pawn-Shop.jpg',
            'playground': '/images/l/areas/Playground.jpg',
            'protest_palace': '/images/l/areas/Protest-Palace.jpg',
            'p_school': '/images/l/areas/primaryschool.jpg',
            'recycling_bin': '/images/l/areas/Recycling-Bin.jpg',
            'skate_park': '/images/l/areas/Skate-Park.jpg',
            'skill_shop': '/images/l/areas/Skill-Shop.jpg',
            'skills': '/images/l/areas/Skill-Shop.jpg',
            'tattoo_parlor': '/images/l/areas/Tattoo-Parlor.jpg',
            'more_jungle': '/images/l/areas/Technicolor-Jungle.jpg',
            'tincan_alley': '/images/l/areas/Tincan-Alley.jpg',
            'store': '/images/l/areas/toysrus.jpg',
            'train_station': '/images/l/areas/Train-Station.jpg',
            'hill|greg': '/images/l/areas/dirtygregswreckers.jpg',
            'rats|shop': '/images/l/areas/rats.jpg',
        };

        const urlParams = new URLSearchParams(window.location.search);
        let cmd = urlParams.get('cmd');

        // Find which specific sub-parameter is defining the subpage (if any)
        let subParamName = ['do', 'tent', 'room', 'place'].find(p => urlParams.has(p));
        let subParamVal = subParamName ? urlParams.get(subParamName) : null;

        let mapKey = (subParamVal && imageMap[`${cmd}|${subParamVal}`]) ? `${cmd}|${subParamVal}` : cmd;

        if (!cmd || !imageMap[mapKey]) return;

        let targetHref = `cmd=${cmd}`;
        if (subParamName && subParamVal) {
            targetHref += `&${subParamName}=${subParamVal}`;
        }

        let excludeDo = '';
        if (!subParamVal) {
            // If we are strictly on the base 'cmd', prevent matching submenu links
            // We explicitly exclude common sub-page parameters
            excludeDo = `:not([href*="&do="]):not([href*="&tent="]):not([href*="&room="]):not([href*="&place="])`;
        }

        this.addedStyles += `
            .left-panel ul a[href$="${targetHref}"]${excludeDo}, .left-panel ul a[href*="${targetHref}&"]${excludeDo} {
                position: relative;
                z-index: 1;
                font-weight: bold;
            }
            .left-panel ul a[href$="${targetHref}"]${excludeDo}::before, .left-panel ul a[href*="${targetHref}&"]${excludeDo}::before {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background-image: url('${imageMap[mapKey]}');
                background-size: cover;
                background-position: center center;
                background-repeat: no-repeat;
                z-index: -1;
                -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
                mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);
                opacity: 0.75;
            }
        `;
    },
    initLiveAliveTime: function() {
        const topbarUl = document.querySelector('.topbar-menu ul');
        if (!topbarUl) return;
        
        const lifeLabel = document.getElementById('lifeValue');
        if (lifeLabel && lifeLabel.textContent.trim() === '0%') {
            Utils.removeItem('hw_healing_last_used');
            return;
        }

        const lastHealSaved = Utils.getItem('hw_healing_last_used');
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
            const currentSaved = Utils.getItem('hw_healing_last_used');
            if (!currentSaved) return;

            const elapsedSecs = Math.floor((Date.now() - parseInt(currentSaved, 10)) / 1000);
            if (elapsedSecs < 0) {
                displayLink.textContent = 'Alive: 00 secs';
                return;
            }

            const hours = Math.floor(elapsedSecs / 3600);
            const mins = Math.floor((elapsedSecs % 3600) / 60);
            const secs = elapsedSecs % 60;
            
            let timeStr = 'Alive: ';
            if (hours > 0) {
                timeStr += `${hours.toString().padStart(2, '0')} hr${hours === 1 ? '' : 's'} `;
            }
            if (mins > 0 || hours > 0) {
                timeStr += `${mins.toString().padStart(2, '0')} min${mins === 1 ? '' : 's'} `;
            }
            timeStr += `${secs.toString().padStart(2, '0')} sec${secs === 1 ? '' : 's'}`;
            
            displayLink.textContent = timeStr;
        };

        updateAliveTime();
        setInterval(updateAliveTime, 1000);
    },
    initWidenPage: function(width) {
        this.addedStyles += `
            .content-area {
                max-width: ${width}px !important;
                min-width: ${width}px !important;
            }
        `;
    },
    initScrollableTopbar: function() {
        this.addedStyles += `
            .topbar-menu {
                overflow-x: auto;
                white-space: nowrap;
                -webkit-overflow-scrolling: touch;
            }
            .topbar-menu::-webkit-scrollbar {
                display: none;
            }
            .topbar-menu {
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
            .topbar-menu > li, .topbar-menu > div, .topbar-menu > a {
                display: inline-block;
            }
        `;

        // Optional mouse drag-to-scroll support for desktop testing
        const topbar = document.querySelector('.topbar-menu');
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
    initCustomTitles: function() {
        const titleRules = {
            "2924510": [{ plain: "The Fake", styled: `<span style="color: red; font-weight: bold; text-shadow: 1px 1px 2px black;">The Fake</span>`, position: 'prefix' }],
            "107380": [{ plain: "Major", styled: `<span style="color: #00EE00; font-weight: bold; text-shadow: 1px 1px 2px black;">Major</span>`, position: 'prefix' }],
            "1003713": [
                { plain: "The", styled: `<span style="color: #A71930; font-weight: bold;">The</span>`, position: 'prefix' },
                { plain: "the Great", styled: `<span style="color: #A71930; font-weight: bold;">the Great</span>`, position: 'suffix' }
            ],
            "1554846": [{ plain: "Pirate King", styled: `<span style="color: red; font-weight: bold; text-shadow: 1px 1px 2px black;">Pirate King</span>`, position: 'prefix' }],
            "1140606": [{ type: 'custom', apply: (link) => {
                if (!link.innerHTML.includes('1337')) {
                    link.innerHTML = `<span style="color: #36ba01;">${link.innerHTML}</span> <span style="color: #0561CB; font-weight: bold; text-shadow: 1px 1px 2px black;">1337</span>`;
                }
            }}]
        };

        const allLinks = document.querySelectorAll('a[href*="cmd=player&ID="]');
        allLinks.forEach(link => {
            if (link.innerHTML.includes('<img') ||
                link.classList.contains('pavatar') ||
                link.innerHTML.includes('avatar-circle')) {
                return;
            }

            const match = link.href.match(/ID=(\d+)/);
            if (!match) return;
            const id = match[1];

            const rules = titleRules[id];
            if (rules) {
                rules.forEach(rule => {
                    if (rule.type === 'custom') {
                        rule.apply(link);
                    } else {
                        if (!link.textContent.includes(rule.plain) && !link.innerHTML.includes(rule.styled)) {
                            if (rule.position === 'suffix') {
                                link.insertAdjacentHTML('beforeend', ` ${rule.styled}`);
                            } else {
                                link.insertAdjacentHTML('afterbegin', `${rule.styled} `);
                            }
                        }
                    }
                });
            }
        });
    },
    initInterestingLevel: function() {
        const levelSpan = document.getElementById('statValueLvl');
        if (!levelSpan) return;

        const currentLevel = parseInt(levelSpan.textContent, 10);
        if (isNaN(currentLevel)) return;

        if (typeof PrimesData === 'undefined') {
            Utils.log("DisplayHelper: PrimesData is not defined.");
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
        this.addedStyles += `
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
    },
    initAwakeNotification: function(inactiveWaitMins) {
        const awakeSpan = document.getElementById('awakeValue');
        if (!awakeSpan) return;

        const awakeMatch = awakeSpan.textContent.match(/(\d+)\/(\d+)/);
        if (!awakeMatch) return;

        const currentAwake = parseInt(awakeMatch[1], 10);
        const maxAwake = parseInt(awakeMatch[2], 10);

        let isDonator = Utils.isDonator();

        const now = Date.now();
        Utils.setItem('hw_awake_last_active', now.toString());
        Utils.setItem('hw_awake_current', currentAwake.toString());
        Utils.setItem('hw_awake_max', maxAwake.toString());
        Utils.setItem('hw_awake_is_donator', isDonator.toString());
        Utils.removeItem('hw_awake_notified');

        if (currentAwake < maxAwake) {
            setInterval(() => {
                const lastActive = parseInt(Utils.getItem('hw_awake_last_active') || '0', 10);
                const isNotified = Utils.getItem('hw_awake_notified');
                if (isNotified) return;

                const inactiveMins = (Date.now() - lastActive) / 60000;
                const savedCurrent = parseInt(Utils.getItem('hw_awake_current') || '0', 10);
                const savedMax = parseInt(Utils.getItem('hw_awake_max') || '100', 10);
                const savedDonator = Utils.getItem('hw_awake_is_donator') === 'true';

                const tickInterval = savedDonator ? 10 : 15;
                const ticks = Math.floor(inactiveMins / tickInterval);
                const estimatedAwake = Math.min(savedMax, savedCurrent + (ticks * 5));

                if (estimatedAwake >= savedMax && inactiveMins >= inactiveWaitMins) {
                    Utils.setItem('hw_awake_notified', '1');
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
