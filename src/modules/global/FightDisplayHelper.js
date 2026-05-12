/*
 * FightDisplayHelper
 * Enhances the fight display by adding a highlight link to bold the active player's rows.
 */
const FightDisplayHelper = {
    settings: [
        {
            key: 'FightDisplayHelper_Highlight',
            label: 'Show Fight Highlight Button',
            default: true
        }
    ],

    init: function() {
        const settings = Utils.getSettings();
        if (settings?.FightDisplayHelper_Highlight === false) return;

        const fightBtn = document.getElementById('fightDisplayButton');
        const fightDisplay = document.getElementById('fightDisplay');

        if (fightBtn && fightDisplay) {
            // Get player ID to accurately find their name in the fight display
            const playerLink = document.querySelector('.pname span a');
            if (!playerLink) {
                Utils.log('FightDisplayHelper: No player link found');
                return;
            }
            
            // The name used in battle text usually drops the title/rank. 
            // In the header (.pname span a), the title is often inside a nested <span>.
            const titleSpan = playerLink.querySelector('span');
            let rawFightName = playerLink.textContent;
            if (titleSpan) {
                rawFightName = rawFightName.replace(titleSpan.textContent, '').trim();
            }
            if (!rawFightName) {
                Utils.log('FightDisplayHelper: Could not determine raw fight name');
                return;
            }

            const highlightLink = document.createElement('a');
            highlightLink.href = 'javascript:void(0);';
            highlightLink.id = 'fightHighlightButton';
            highlightLink.innerText = 'highlight';

            highlightLink.addEventListener('click', () => {
                const lines = fightDisplay.innerHTML.split(/<br\s*\/?>/i);
                const newLines = lines.map(line => {
                    if (line.includes(rawFightName) && !line.includes('<hr')) {
                        // Prevent double-highlighting if clicked multiple times
                        if (!line.includes('&gt;&nbsp;&nbsp;')) {
                            return `<b>&gt;&nbsp;&nbsp;${line}</b>`;
                        }
                    }
                    return line;
                });
                fightDisplay.innerHTML = newLines.join('<br>');
            });

            // If the fight display is inside a container, let's just insert the highlight button right after the collapse button's closing bracket
            const wrapper = document.createElement('span');
            wrapper.appendChild(document.createTextNode(' ['));
            wrapper.appendChild(highlightLink);
            wrapper.appendChild(document.createTextNode('] '));

            // fightBtn is typically inside the text flow like `[<a id="fightDisplayButton">collapse</a>]`
            // Let's insert it right before the fightDisplay div itself to ensure it's visible and consistently placed
            fightDisplay.parentNode.insertBefore(wrapper, fightDisplay);
        }
    }
};
