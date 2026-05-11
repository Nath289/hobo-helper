const BernardsBasementHelper = {
    cmds: 'bernards',
    staff: false,
    group: 'City',
    settings: [
        { key: 'BernardsBasementHelper_EnableMap', label: 'Enable Basement Map' },
        { key: 'BernardsBasementHelper_ExploreLog', label: 'Enable Basement Explore Log' }
    ],

    init: function() {
        const savedSettings = Utils.getSettings();
        if (savedSettings?.BernardsBasementHelper_EnableMap !== false) {
            if (window.location.search.includes('room=basement')) {
                this.initBasementMap();
            }
        }
        
        if (savedSettings?.BernardsBasementHelper_ExploreLog !== false) {
            if (window.location.search.includes('room=basement')) {
                this.processAndRenderLog();
            }
        }
    },

    processAndRenderLog: function() {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        // Extract coordinates if they exist
        let currentX = null;
        let currentY = null;
        const navForm = document.getElementById('nav_form');
        if (navForm) {
            const directionTable = navForm.closest('table');
            if (directionTable) {
                const fontTags = directionTable.querySelectorAll('font');
                fontTags.forEach(f => {
                    if (f.textContent.includes('X Y')) {
                        const match = f.textContent.match(/(\d+)\s*,\s*(\d+)/);
                        if (match) {
                            currentX = parseInt(match[1], 10);
                            currentY = parseInt(match[2], 10);
                        }
                    }
                });
            }
        }

        const textContent = contentArea.textContent;
        const soupMatch = textContent.match(/You take the (Garlic Salmon Bisque|Cream of Okra Soup|Texas Fajita Soup|Beef Mushroom Stew)/i);
        
        let logs = [];
        try {
            logs = JSON.parse(Utils.getItem('hw_bernards_explore_log') || '[]');
        } catch (e) {
            logs = [];
        }

        if (soupMatch && currentX !== null && currentY !== null) {
            const soupName = soupMatch[1];
            const timeStr = typeof Utils !== 'undefined' && Utils.getHoboTime ? Utils.getHoboTime() : new Date().toLocaleTimeString();
            const logEntry = {
                soup: soupName,
                x: currentX,
                y: currentY,
                time: timeStr,
                timestamp: Date.now()
            };
            
            // Prevent duplicate adjacent logs if refreshed
            if (logs.length === 0 || logs[0].timestamp < Date.now() - 30000) {
                logs.unshift(logEntry);
                if (logs.length > 50) logs.length = 50; // keep last 50
                Utils.setItem('hw_bernards_explore_log', JSON.stringify(logs));
            }
        }

        // Always render log container so user sees it's active
        const logWrapper = document.createElement('div');
        logWrapper.id = 'hh_bernards_explore_log_wrapper';
        logWrapper.style.cssText = 'margin: 15px auto; max-width: 400px; background: #fff; border: 1px solid #ccc; padding: 10px; border-radius: 4px; text-align: left; font-family: Tahoma, Arial, sans-serif;';

        let html = `
            <div style="font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 8px;">
                Explore Log 
                <span id="hw_bernards_clear_log" style="float: right; font-weight: normal; font-size: 11px; cursor: pointer; color: #d9534f; user-select: none;" ${logs.length === 0 ? 'hidden' : ''}>&#10006; Clear</span>
            </div>
        `;

        if (logs.length === 0) {
            html += '<div style="font-size: 11px; color: #777; text-align: center; padding: 10px 0;">No soups discovered yet.<br>Go explore the basement!</div>';
        } else {
            html += '<div style="max-height: 200px; overflow-y: auto;">';

            let currentDateStr = '';
            logs.forEach(L => {
                const date = new Date(L.timestamp || Date.now());
                const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
                const dayStr = date.toLocaleDateString(undefined, dateOptions);

                if (dayStr !== currentDateStr) {
                    if (currentDateStr !== '') {
                        html += '</ul>';
                    }
                    html += `<div style="font-weight: bold; background: #f5f5f5; padding: 2px 5px; margin: 4px 0 2px 0; border-radius: 3px;">${dayStr}</div>`;
                    html += '<ul style="margin: 0; padding-left: 20px; font-size: 12px; line-height: 1.6;">';
                    currentDateStr = dayStr;
                }

                const gameTimeStr = L.time ? L.time : `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

                html += `
                    <li style="color: #333; font-weight: normal; list-style-type: square;">
                        <span style="color: #999; font-size: 10px; font-weight: normal;">[${gameTimeStr}]</span> 
                        <strong style="color: #555;">(${L.x}, ${L.y})</strong> - Found ${L.soup}
                    </li>`;
            });
            if (currentDateStr !== '') {
                html += '</ul>';
            }
            html += '</div>';
        }

        logWrapper.innerHTML = html;

        // Find best place to append
        const backToCityLink = Array.from(contentArea.querySelectorAll('a')).find(a => a.textContent.includes('Back to city'));
        if (backToCityLink) {
            const centerTag = backToCityLink.closest('center');
            if (centerTag) {
                // Insert after the <center> tag containing the link
                if (centerTag.nextSibling) {
                    centerTag.parentNode.insertBefore(logWrapper, centerTag.nextSibling);
                } else {
                    centerTag.parentNode.appendChild(logWrapper);
                }
            } else {
                // Insert after the link itself
                if (backToCityLink.nextSibling) {
                    backToCityLink.parentNode.insertBefore(logWrapper, backToCityLink.nextSibling);
                } else {
                    backToCityLink.parentNode.appendChild(logWrapper);
                }
            }
        } else {
            contentArea.appendChild(logWrapper);
        }

        const clearBtn = logWrapper.querySelector('#hw_bernards_clear_log');
        if (clearBtn) {
            clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Are you sure you want to clear your entire Basement Explore Log?')) {
                    Utils.removeItem('hw_bernards_explore_log');
                    logWrapper.remove();
                    this.processAndRenderLog(); // Re-render empty state to match ExploreHelper style reset
                }
            });
        }
    },

    initBasementMap: function() {

        const navForm = document.getElementById('nav_form');
        if (!navForm) return;

        // Traverse up to find the main layout table of the directional pad
        const directionTable = navForm.closest('table');
        if (!directionTable) return;

        // Try to get current coordinates
        let currentX = 0;
        let currentY = 0;
        const fontTags = directionTable.querySelectorAll('font');
        fontTags.forEach(f => {
            if (f.textContent.includes('X Y')) {
                const match = f.textContent.match(/(\d+)\s*,\s*(\d+)/);
                if (match) {
                    currentX = parseInt(match[1], 10);
                    currentY = parseInt(match[2], 10);
                }
            }
        });

        // Create map container
        const mapHTML = `
        <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" style="border-collapse: collapse; border-style: ridge; border-color: black; border-width: 5px; table-layout: fixed;" align="center">
            <tbody>
                ${Array.from({ length: 20 }, (_, r) => {
                    const y = 20 - r; // 20 to 1 (top to bottom)
                    return `<tr>
                        ${Array.from({ length: 20 }, (_, c) => {
                            const x = c + 1; // 1 to 20 (left to right)
                            return `<td class="bernards-map-cell" data-x="${x}" data-y="${y}" title="${x}, ${y}" bgcolor="#FFFFFF" style="border: 1px solid #ddd; width: 8px; height: 8px; min-width: 8px; min-height: 8px; max-width: 8px; max-height: 8px; padding: 0; box-sizing: border-box;"></td>`;
                        }).join('')}
                    </tr>`;
                }).join('')}
            </tbody>
        </table>
        `;

        const mapContainer = document.createElement('div');
        mapContainer.id = 'bernards_map_container';
        mapContainer.style.cssText = 'position: absolute; left: 100%; top: 50%; transform: translateY(-50%); margin-left: 20px; text-align: center;';
        mapContainer.innerHTML = mapHTML;

        // Color cell for current position
        const cells = mapContainer.querySelectorAll('.bernards-map-cell');
        cells.forEach(cell => {
            const cx = parseInt(cell.getAttribute('data-x'), 10);
            const cy = parseInt(cell.getAttribute('data-y'), 10);

            if (cx === currentX && cy === currentY) {
                cell.setAttribute('bgcolor', '#880000'); // Current position
                cell.title = "You!";
            }
        });

        // Use a relative wrapper to prevent any layout shifts of the directional pad
        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'position: relative; width: 250px; margin: 0 auto;';
        
        directionTable.parentNode.insertBefore(wrapper, directionTable);
        wrapper.appendChild(directionTable);
        wrapper.appendChild(mapContainer);
    }
};
