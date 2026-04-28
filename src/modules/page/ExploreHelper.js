const ExploreHelper = {
    cmds: 'explore',
    staff: false,
    settings: [
        { key: 'ExploreHelper_Enable', label: 'Enable Explore Helper', defaultValue: true },
        { key: 'ExploreHelper_Log', label: 'Display Explore Log', defaultValue: true }
    ],
    init: function() {
        const settings = Utils.getSettings();
        if (settings['ExploreHelper_Enable'] === false) return;

        const urlParams = new URLSearchParams(window.location.search);
        const doParam = urlParams.get('do');
        const enterParam = urlParams.get('enter');

        const isMovePage = doParam === 'move' || enterParam === 'true';

        if (isMovePage) {
            this.initMovePage();
        } else {
            this.initLobbyPage();
        }

        if (settings['ExploreHelper_Log'] !== false) {
            this.renderLogPanel();
        }
    },

    getCurrentCoordinates: function() {
        // Method 1: Try reading from the minimap yellow square
        const mapSpot = document.querySelector('#miniMap td[style*="yellow"]');
        if (mapSpot && mapSpot.title) {
            const parts = mapSpot.title.split(',');
            if (parts.length === 2) {
                return { x: parseInt(parts[0], 10), y: parseInt(parts[1], 10) };
            }
        }

        // Method 2: Fallback to extracting from the directional movement links
        const moveLinks = document.querySelectorAll('a[href*="cmd=explore&do=move&dir="]');
        for (let i = 0; i < moveLinks.length; i++) {
            const match = moveLinks[i].href.match(/x=(\d+)&y=(\d+)/);
            if (match) {
                return { x: parseInt(match[1], 10), y: parseInt(match[2], 10) };
            }
        }

        return { x: '?', y: '?' };
    },

    addToLog: function(message, type, coords) {
        let logs = JSON.parse(localStorage.getItem('hw_explore_log') || '[]');

        const now = Date.now();
        // Prevent duplicate logging (caused by browser reload within 5 seconds of event)
        if (logs.length > 0) {
            const lastLog = logs[0];
            if (lastLog.message === message &&
                lastLog.x === coords.x &&
                lastLog.y === coords.y &&
                (now - lastLog.time < 5000)) {
                return;
            }
        }

        logs.unshift({
            message: message,
            type: type,
            x: coords.x,
            y: coords.y,
            time: now
        });

        // Keep last 50 logs
        if (logs.length > 50) logs = logs.slice(0, 50);

        localStorage.setItem('hw_explore_log', JSON.stringify(logs));
    },

    initLobbyPage: function() {
        // Future Lobby specific tooling
    },

    initMovePage: function() {
        const contentArea = document.querySelector('.content-area') || document.body;
        const text = contentArea.textContent;
        const coords = this.getCurrentCoordinates();

        // 1. Detect Shiny Object
        if (text.includes('You see a shiny object, but as soon as you go to pick it up it vanishes.')) {
            this.addToLog('Saw a vanishing shiny object.', 'shiny', coords);
        }

        // Other events can be easily added here
    },

    renderLogPanel: function() {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        const existingLog = document.getElementById('hh_explore_log_wrapper');
        if (existingLog) existingLog.remove();

        const logs = JSON.parse(localStorage.getItem('hw_explore_log') || '[]');

        const logWrapper = document.createElement('div');
        logWrapper.id = 'hh_explore_log_wrapper';
        logWrapper.style.cssText = 'margin: 15px auto; max-width: 600px; background: #fff; border: 1px solid #ccc; padding: 10px; border-radius: 4px; text-align: left; font-family: Tahoma, Arial, sans-serif;';

        let html = `
            <div style="font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 8px;">
                Explore Log 
                <span id="hh_exp_cleardata" style="float: right; font-weight: normal; font-size: 11px; cursor: pointer; color: #d9534f; user-select: none;">&#10006; Clear</span>
            </div>
        `;

        if (logs.length === 0) {
            html += '<div style="font-size: 11px; color: #777; text-align: center; padding: 10px 0;">No explore events recorded yet.<br>Go explore the city!</div>';
        } else {
            html += '<div style="max-height: 200px; overflow-y: auto;">';
            html += '<ul style="margin: 0; padding-left: 20px; font-size: 12px; line-height: 1.6;">';
            logs.forEach(log => {
                const date = new Date(log.time);
                const timeStr = date.getHours().toString().padStart(2, '0') + ':' +
                                date.getMinutes().toString().padStart(2, '0') + ':' +
                                date.getSeconds().toString().padStart(2, '0');

                let color = '#333';
                if (log.type === 'shiny') color = '#B8860B'; // Goldenrod for Shiny Items

                html += `
                    <li style="color: ${color}; list-style-type: square;">
                        <span style="color: #999; font-size: 10px;">[${timeStr}]</span> 
                        <strong style="color: #555;">(${log.x}, ${log.y})</strong> - ${log.message}
                    </li>`;
            });
            html += '</ul></div>';
        }

        logWrapper.innerHTML = html;

        contentArea.appendChild(logWrapper);

        const clearBtn = logWrapper.querySelector('#hh_exp_cleardata');
        if (clearBtn) {
            clearBtn.onclick = () => {
                if (confirm('Are you sure you want to clear your entire Explore Log?')) {
                    localStorage.removeItem('hw_explore_log');
                    this.renderLogPanel();
                }
            };
        }
    }
};
