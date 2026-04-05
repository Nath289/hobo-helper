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
