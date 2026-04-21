const TattooParlorHelper = {
    cmds: 'tattoo_parlor',
    staff: false,
    init: function() {
        const links = document.querySelectorAll('a[href*="tattoo_parlor"]');
        links.forEach(link => {
            const text = link.textContent;
            if (text.includes('Retouch') || text.includes('Remove')) {
                const costMatch = text.match(/\$?([0-9,]+)/);
                if (costMatch) {
                    const cost = Utils.parseNumber(costMatch[1]);
                    if (!isNaN(cost) && cost > 0) {
                        const actionName = text.includes('Retouch') ? 'Tattoo Retouch' : 'Tattoo Remove';

                        const btn = Utils.createBankButton(actionName, cost);

                        // Move button outside the link's parent if it's wrapped in square brackets
                        if (link.nextSibling && link.nextSibling.nodeType === Node.TEXT_NODE && link.nextSibling.textContent.includes(']')) {
                            link.parentNode.insertBefore(btn, link.nextSibling.nextSibling);
                        } else {
                            link.parentNode.insertBefore(btn, link.nextSibling);
                        }
                    }
                }
            }
        });
    }
};
