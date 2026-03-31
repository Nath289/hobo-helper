const UniversityHelper = {
    init: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const cmd = urlParams.get('cmd');
        const doParam = urlParams.get('do');
        
        if (cmd === 'uni') {
            if (['str', 'pow', 'spd'].includes(doParam)) {
                this.updateStatsFromTrain();
            }
            this.displayNeededStats();
        }
    },

    updateStatsFromTrain: function() {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;
        
        const text = contentArea.textContent;
        const gainMatch = text.match(/You gained ([\d.,]+) (speed|power|strength)/i);

        if (gainMatch) {
            let amount = Helpers.parseNumber(gainMatch[1]);
            const stat = gainMatch[2].toLowerCase();
            
            const statsConfigStr = localStorage.getItem('hoboStatRatio');
            if (statsConfigStr) {
                try {
                    let config = JSON.parse(statsConfigStr);
                    if (config && config.needs && config.needs[stat] !== undefined) {
                        config.needs[stat] -= amount;
                        // Keep integer values consistent and avoid float precision issues later
                        config.needs[stat] = Math.round(config.needs[stat] * 10) / 10;
                        localStorage.setItem('hoboStatRatio', JSON.stringify(config));
                    }
                } catch (e) {}
            }
        }
    },
    
    displayNeededStats: function() {
        const statsConfigStr = localStorage.getItem('hoboStatRatio');
        if (!statsConfigStr) return;
        
        let config;
        try {
            config = JSON.parse(statsConfigStr);
        } catch (e) {
            return;
        }

        if (!config || !config.needs) return;

        const links = document.querySelectorAll('.trainlinks a');
        
        links.forEach(link => {
            const text = link.textContent.trim();
            let amount = -1;
            
            if (text === 'Train Strength') {
                amount = config.needs.strength || 0;
            } else if (text === 'Train Power') {
                amount = config.needs.power || 0;
            } else if (text === 'Train Speed') {
                amount = config.needs.speed || 0;
            }

            if (amount !== -1) {
                const span = document.createElement('span');
                span.style.marginLeft = '5px';
                span.style.fontWeight = 'bold';
                if (amount > 0) {
                    span.style.color = '#008000';
                    span.textContent = `[+${amount.toLocaleString()}]`;
                } else if (amount < 0) {
                    span.style.color = '#d9534f';
                    span.textContent = `[-${Math.abs(amount).toLocaleString()}]`;
                } else {
                    span.style.color = '#999';
                    span.textContent = `[+0]`;
                }
                link.parentNode.insertBefore(span, link.nextSibling);
            }
        });
    }
};
