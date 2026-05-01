const WeaponsHelper = {
    cmds: 'wep',
    staff: false,
    settings: [
        { key: 'WeaponsHelper_HighlightEquipped', label: 'Highlight Equipped Items' },
        { key: 'WeaponsHelper_ClickableImages', label: 'Clickable Item Images' }
    ],
    init: function() {
        const savedSettings = Utils.getSettings();

        if (!window.location.search.includes('cmd=wep')) return;

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        const highlightEquipped = savedSettings['WeaponsHelper_HighlightEquipped'] !== false;
        const clickableImages = savedSettings['WeaponsHelper_ClickableImages'] !== false;

        if (highlightEquipped || clickableImages) {
            this.initFeature(contentArea, highlightEquipped, clickableImages);
        }
    },

    initFeature: function(contentArea, highlightEquipped, clickableImages) {
        const itemCells = contentArea.querySelectorAll('td[width="33%"]');

        itemCells.forEach(cell => {
            const links = Array.from(cell.querySelectorAll('a'));
            const actionLink = links.find(a => a.textContent.trim() === 'Equip' || a.textContent.trim() === 'Unequip');

            if (actionLink) {
                const isEquipped = actionLink.textContent.trim() === 'Unequip';

                // Highlight if equipped
                if (isEquipped && highlightEquipped) {
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
                if (img && !img.closest('a') && clickableImages) {
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
