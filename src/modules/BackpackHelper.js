const BackpackHelper = {
    init: function() {
        const settings = Utils.getSettings();
        if (settings?.BackpackHelper?.enabled === false) return;


        this.observeBackpack();
    },

    observeBackpack: function() {
        let drinkMap = null;

        const processItems = () => {
            const items = document.querySelectorAll('.bp-itm:not([data-bh-tooltip-processed])');
            if (items.length === 0) return;

            // Initialize map lazily
            if (!drinkMap && typeof DrinksData !== 'undefined' && DrinksData.drinks) {
                drinkMap = {};
                const combined = [...DrinksData.drinks.alcoholic, ...DrinksData.drinks.mixed];
                combined.forEach(d => {
                    drinkMap[d.name] = d;
                });
            }
            // If we still can't find drinks data, skip processing
            if (!drinkMap) return;

            items.forEach(item => {
                // Mark processed immediately
                item.setAttribute('data-bh-tooltip-processed', 'true');

                const img = item.querySelector('img');
                if (!img) return;

                const name = img.title.trim();
                const drinkInfo = drinkMap[name];

                if (drinkInfo) {
                    let tooltipParts = [];
                    if (drinkInfo.base_stat_gain && drinkInfo.base_stat_gain.trim() !== "") {
                        tooltipParts.push(`Stats: ${drinkInfo.base_stat_gain.trim()}`);
                    }
                    if (drinkInfo.effect && drinkInfo.effect.trim() !== "") {
                        tooltipParts.push(`Effect: ${drinkInfo.effect.trim()}`);
                    }

                    if (tooltipParts.length > 0) {
                        const target = item.closest('td') ? item.closest('td') : item;
                        const tooltipText = tooltipParts.join(' - ');
                        target.setAttribute('title', tooltipText);

                        // If it has children with titles (like the img), clear them so they don't override the td
                        if (img.hasAttribute('title')) {
                            // We can reset the img title to empty or match the parent
                            img.setAttribute('title', tooltipText);
                        }

                        // Check if the link has a title
                        const a = item.querySelector('a');
                        if (a && a.hasAttribute('title')) {
                            a.setAttribute('title', tooltipText);
                        }
                    }
                }
            });
        };

        let timeout = null;
        const observer = new MutationObserver(() => {
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(processItems, 250);
        });

        const targetNode = document.getElementById('backpackTab') ? document.getElementById('backpackTab') : document.body;
        observer.observe(targetNode, { childList: true, subtree: true });

        // Initial run
        processItems();
    }
};
