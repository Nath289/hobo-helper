const CanDepoHelper = {
    cmds: 'depo',
    staff: false,
    init: function() {
        const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');

        if (savedSettings['CanDepoHelper_TotalValue'] !== false) {
            this.initTotalValue();
        }
    },

    initTotalValue: function() {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        let cansCount = 0;
        let price = 0;
        let targetNode = null;

        const walkDom = document.createTreeWalker(contentArea, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walkDom.nextNode())) {
            const text = node.textContent;

            const cansMatch = text.match(/You have:\s*([0-9,]+)\s*cans!/);
            if (cansMatch) {
                cansCount = Utils.parseNumber(cansMatch[1]);
                targetNode = node;
            }

            const priceMatch = text.match(/for\s*\$?([0-9,]+)\s*each/);
            if (priceMatch && !price) {
                price = Utils.parseNumber(priceMatch[1]);
            }
        }

        if (targetNode && cansCount > 0 && price > 0) {
            const totalValue = cansCount * price;
            const span = document.createElement('span');
            span.innerHTML = ` <b>(Total Value: $${totalValue.toLocaleString()})</b>`;
            span.style.color = 'green';
            targetNode.parentNode.insertBefore(span, targetNode.nextSibling);
        }
    }
};
