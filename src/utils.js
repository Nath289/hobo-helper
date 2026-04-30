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
        getAwakeness: function() {
            const awakeSpan = document.getElementById('awakeValue');
            if (awakeSpan) {
                const match = awakeSpan.textContent.match(/(\d+)/);
                if (match) {
                    return parseInt(match[1], 10);
                }
            }
            return 0;
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
        getTokenBalance: function() {
            const tokenEl = document.querySelector('.displayTokens');
            if (tokenEl) {
                return this.parseNumber(tokenEl.textContent);
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
            return JSON.parse(this.getItem('hw_helper_settings') || '{}');
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
        },
        isDonator: function() {
            const donDiv = document.querySelector('.becomedon');
            return donDiv !== null && donDiv.textContent.includes('Donator Information');
        },
        showChangelogModal: function(e, minVersion = null) {
            if (e) e.preventDefault();

            let existing = document.getElementById('hw-helper-changelog-modal');
            if (existing) { existing.style.display = 'block'; return; }

            if (typeof Modules === 'undefined' || typeof Modules.ChangelogData === 'undefined' || !Modules.ChangelogData.changes) {
                alert("ChangelogData missing."); return;
            }

            let changesToDisplay = Modules.ChangelogData.changes;
            if (minVersion) {
                const minVerFloat = parseFloat(minVersion);
                changesToDisplay = Modules.ChangelogData.changes.filter(release => parseFloat(release.version) > minVerFloat);
                if (changesToDisplay.length === 0) return;
            }

            const modal = document.createElement("div");
            modal.id = 'hw-helper-changelog-modal';
            modal.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); z-index:9999; max-width:600px; width:90%; background-color:#f9f9f9; border:1px dashed #777; border-radius:8px; text-align:left; font-family:Tahoma, Arial, sans-serif; color:#333; box-shadow:0px 4px 6px rgba(0,0,0,0.5); padding:15px; max-height:80vh; overflow-y:auto;";

            const closeBtn = document.createElement('span');
            closeBtn.innerHTML = '&#10006;';
            closeBtn.style.cssText = "float:right; cursor:pointer; font-size:18px; font-weight:bold; color:#d9534f; user-select: none; -webkit-user-select: none;";
            closeBtn.onclick = () => { modal.style.display = 'none'; };
            modal.appendChild(closeBtn);

            const title = document.createElement("h2");
            title.textContent = minVersion ? "Hobo Helper - Update Installed!" : "Hobo Helper - Recent Updates";
            title.style.margin = "0 0 10px 0";
            title.style.borderBottom = "1px solid #ccc";
            title.style.paddingBottom = "5px";
            title.style.fontSize = "16px";
            modal.appendChild(title);

            changesToDisplay.forEach(release => {
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

            if (minVersion) {
                const note = document.createElement("div");
                note.style.cssText = "font-size: 11px; color: #777; margin-top: 10px; border-top: 1px solid #ddd; padding-top: 5px; text-align: center;";
                note.textContent = "Note: This automatic update popup can be disabled in Settings.";
                modal.appendChild(note);
            }

            document.body.appendChild(modal);
        },
        /**
     * Set a configuration value securely
     */
    setConfig: function(key, value) {
        if (!key) return; // Prevent setting blank keys

        let config = this.getSettings();
        config[key] = value;
        // Don't use Utils.setItem here to prevent sync looping, this uses the main settings key
        localStorage.setItem('hw_helper_settings', JSON.stringify(config));

        if (typeof SyncHelper !== 'undefined') {
            SyncHelper.recordLocalUpdate('hw_helper_settings');
            SyncHelper.triggerSync();
        }
    },

    /**
     * Centralized localStorage getItem
     * @param {string} key
     * @returns {string|null}
     */
    getItem: function(key) {
        return localStorage.getItem(key);
    },

    /**
     * Centralized localStorage setItem
     * @param {string} key
     * @param {string} value
     */
    setItem: function(key, value) {
        localStorage.setItem(key, value);
        if (typeof SyncHelper !== 'undefined' && !key.startsWith('hw_sync_')) {
            SyncHelper.recordLocalUpdate(key);
            SyncHelper.triggerSync();
        }
    },

    /**
     * Centralized localStorage removeItem
     * @param {string} key
     */
    removeItem: function(key) {
        localStorage.removeItem(key);
        if (typeof SyncHelper !== 'undefined' && !key.startsWith('hw_sync_')) {
            SyncHelper.recordLocalUpdate(key);
            SyncHelper.triggerSync();
        }
    },

    /**
     * Force sync to remote
     */
    syncAllNow: function() {
        if (typeof SyncHelper !== 'undefined') {
            SyncHelper.syncAllNow();
        }
    },

    /**
     * Log messages if in dev mode
     */
    log: function(...args) {
        const versionStr = (typeof window !== 'undefined' && window.HoboHelperVersion) ? window.HoboHelperVersion : (typeof GM_info !== 'undefined' && GM_info.script ? GM_info.script.version : 'Unknown');
        const isDev = versionStr !== 'Unknown' && versionStr.split('.').length > 2;
        if (isDev) {
            console.log(...args);
        }
    }
};
//# sourceMappingURL=utils.js.map
