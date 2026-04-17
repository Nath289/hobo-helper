const DisplayHelper = {
    settings: [
        { key: 'DisplayHelper_ImprovedAvatars', label: 'Enable Improved Avatars' },
        { key: 'DisplayHelper_FakeQwee', label: 'Enable the Fake Qwee' },
        { key: 'DisplayHelper_JackReacher', label: 'Enable Jack Reacher Major Title' },
        { key: 'DisplayHelper_Grabow', label: 'Enable Grabow the Great Title' },
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
        if (settings['DisplayHelper_Grabow'] !== false) {
            this.initGrabow();
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
        this.addTitleToPlayer("1003713", "the Great", `<span style="color: red; font-weight: bold; text-shadow: 0 0 5px black, 1px 1px 2px black;">the Great</span>`, 'suffix');
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
