const BernardsMansionHelper = {
    init: function() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('cmd') !== 'bernards') return;

        const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
        
        if (savedSettings['BernardsMansionHelper_BasementMap'] !== false) {
            this.initBasementMap();
        }
    },

    initBasementMap: function() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('room') !== 'basement') return;

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
