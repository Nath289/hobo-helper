const DisplayHelper = {
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
