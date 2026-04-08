const WeaponsHelper = {
    cmds: 'wep',
    settings: [
        { key: 'WeaponsHelper_EnableFeature', label: 'Enable Weapons Helper' }
    ],
    init: function() {
        if (!window.location.search.includes('cmd=wep')) return;

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
        const enableFeature = savedSettings['WeaponsHelper_EnableFeature'] !== false;

        if (enableFeature) {
            this.initFeature(contentArea);
        }
    },

    initFeature: function(contentArea) {
        const itemCells = contentArea.querySelectorAll('td[width="33%"]');

        itemCells.forEach(cell => {
            const links = Array.from(cell.querySelectorAll('a'));
            const actionLink = links.find(a => a.textContent.trim() === 'Equip' || a.textContent.trim() === 'Unequip');

            if (actionLink) {
                const isEquipped = actionLink.textContent.trim() === 'Unequip';

                // Highlight if equipped
                if (isEquipped) {
                    const wrapper = document.createElement('div');
                    wrapper.style.backgroundColor = 'rgba(128, 128, 128, 0.15)';
                    wrapper.style.border = '1px solid #999';
                    wrapper.style.borderRadius = '10px';
                    wrapper.style.padding = '4px';
                    wrapper.style.margin = '2px';
                    wrapper.style.height = '100%';
                    wrapper.style.boxSizing = 'border-box';

                    while (cell.firstChild) {
                        wrapper.appendChild(cell.firstChild);
                    }
                    cell.appendChild(wrapper);
                }

                // Make image a hyperlink
                const img = cell.querySelector('img');
                if (img && !img.closest('a')) {
                    const aWrapper = document.createElement('a');
                    aWrapper.href = actionLink.href;
                    aWrapper.style.display = 'inline-block';
                    // We only wrap the image, but maintain its position
                    img.parentNode.insertBefore(aWrapper, img);
                    aWrapper.appendChild(img);
                }
            }
        });
    }
};

