const FortSlugworthHelper = {
    cmds: 'fort_slugworth',
    init: function() {
        const settings = Utils.getSettings();
        if (settings['FortSlugworthHelper'] === false) return;

        if (window.location.search.includes('room=4')) {
            this.initRipaparter();
        }
    },

    initRipaparter: function() {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;
        
        const form = contentArea.querySelector('form[action*="room=4"]');
        if (!form) return;

        const select = form.querySelector('select[name="ripapart"]');
        if (!select) return;

        // Container for tiles
        const tilesContainer = document.createElement('div');
        tilesContainer.style.display = 'flex';
        tilesContainer.style.flexWrap = 'wrap';
        tilesContainer.style.gap = '10px';
        tilesContainer.style.justifyContent = 'center';
        tilesContainer.style.marginBottom = '20px';
        tilesContainer.style.maxWidth = '500px';

        // Add tiles before the select
        form.insertBefore(tilesContainer, select);

        // For each option in select, create a tile
        Array.from(select.options).forEach(opt => {
            const val = opt.value;
            let text = opt.textContent.trim(); // e.g. "Fighters Lunch (6)"
            let imgName = 'unknown.gif';

            const match = text.match(/^(.*?)\s*\((\d+)\)$/);
            let rawName = text;
            let qty = 1;
            if(match) {
                rawName = match[1].trim();
                qty = match[2];
            }

            if(typeof FoodData !== 'undefined' && FoodData[rawName]) {
                imgName = FoodData[rawName].img;
            } else {
                imgName = rawName.replace(/[']/g, '%27').replace(/\s+/g, '-') + '.gif';
            }

            const tile = document.createElement('div');
            tile.style.border = '2px solid #ccc';
            tile.style.borderRadius = '5px';
            tile.style.padding = '8px';
            tile.style.cursor = 'pointer';
            tile.style.textAlign = 'center';
            tile.style.width = '85px';
            tile.style.backgroundColor = '#fff';
            tile.className = 'rip-tile';
            tile.dataset.val = val;

            tile.innerHTML = `
                <img src="/images/items/gifs/${imgName}" width="50" height="50" alt="${rawName}" onerror="this.src='/images/items/gifs/Trolly.gif'" title="${rawName}"><br>
                <div style="font-size:11px; margin-top:6px; line-height:1.2; word-wrap:break-word;">${rawName}</div>
                <div style="font-size:12px; font-weight:bold; color:#0b61a4; margin-top:3px;">(${qty})</div>
            `;

            tile.addEventListener('click', () => {
                tilesContainer.querySelectorAll('.rip-tile').forEach(t => {
                    t.style.borderColor = '#ccc';
                    t.style.backgroundColor = '#fff';
                });
                tile.style.borderColor = '#2196F3';
                tile.style.backgroundColor = '#e3f2fd';

                select.value = val;
            });

            tilesContainer.appendChild(tile);
        });

        console.log('FortSlugworthHelper: Room 4 (The Ripaparter) loaded tiles.');
    }
};
