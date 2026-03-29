// ==UserScript==
// @name         HoboWars - Win % Calculator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Calculates battles needed for target win percentages in the Living Area (dark text version)
// @author       Gemini
// @match        https://www.hobowars.com/game/game.php?sr=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 1. Ensure we are in the Living Area (No 'cmd=' in URL)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('cmd')) return;

    // 2. Locate the Battle Records block
    const battleBlock = document.getElementById('battleRecord');
    if (!battleBlock) return;

    // 3. Extract Wins and Total Battles
    const lines = battleBlock.querySelectorAll('.line');
    let winLossLine = Array.from(lines).find(el => el.textContent.includes('Wins/Losses:'));

    if (winLossLine) {
        const text = winLossLine.textContent;
        // Regex to pull integers: [0] Wins, [1] Losses, [2] Current %
        // stats.match returns an array of matching strings (like "27,485", "10,818").
        // map then converts these to clean integers.
        const matches = text.match(/\d+(,\d+)*/g);
        if (!matches || matches.length < 2) return; // Fail safe if format changes

        const stats = matches.map(s => parseInt(s.replace(/,/g, '')));

        const wins = stats[0];
        const losses = stats[1];
        const total = wins + losses;

        // 4. Calculation Helper
        const getBattlesNeeded = (target) => {
            const decimal = target / 100;
            if ((wins / total) >= decimal) return 0;
            // Solve (W + x) / (B + x) = T  => x = (T*B - W) / (1 - T)
            return Math.ceil((decimal * total - wins) / (1 - decimal));
        };

        // 5. Create the Display with updated styling
        const targets = [75, 80, 85, 90];
        // Style changed to color: #333 (near black), margin adjusted
        let calcHtml = `<div id="winCalc" style="font-size: 0.85em; margin-top: 8px; padding-top: 8px; border-top: 1px dashed #999; color: #333;">`;
        calcHtml += `<strong style="color: black;">Wins to Target Ratio:</strong><br>`;

        targets.forEach(t => {
            const needed = getBattlesNeeded(t);
            if (needed > 0) {
                // Changed text color and bolded the win number for better contrast
                calcHtml += `<span style="display:inline-block; width: 40px; color: black; font-weight: bold;">${t}%:</span> +<span style="color: black; font-weight: bold;">${needed.toLocaleString()}</span> consecutive wins<br>`;
            }
        });

        calcHtml += `</div>`;

        // Append to the battleRecord block
        battleBlock.insertAdjacentHTML('beforeend', calcHtml);
    }
})();