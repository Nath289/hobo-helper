const KurtzCampHelper = {
    cmds: 'camp_kurtz',
    init: function() {
        // Check Settings
        const settings = Utils.getSettings();
        if (settings.kurtzCampHelper === false) return;

        this.trackItems();
        this.displayTally();
    },

    trackItems: function() {
        const content = document.querySelector('.content-area');
        if (!content) return;

        let fireCount = parseInt(localStorage.getItem('hw_kurtz_fire_count') || '0');
        let bottleCount = parseInt(localStorage.getItem('hw_kurtz_bottle_count') || '0');

        // Check for Fire
        if (content.innerHTML.includes('<b>Fire</b>')) {
            fireCount++;
            localStorage.setItem('hw_kurtz_fire_count', fireCount);
        }
        // Check for Empty Bottles (case-insensitive check for Empty Bottle(s))
        else if (content.innerHTML.toLowerCase().includes('empty bottle')) {
            bottleCount++;
            localStorage.setItem('hw_kurtz_bottle_count', bottleCount);
        }
    },

    displayTally: function() {
        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        let fireCount = parseInt(localStorage.getItem('hw_kurtz_fire_count') || '0');
        let bottleCount = parseInt(localStorage.getItem('hw_kurtz_bottle_count') || '0');

        const tallyDiv = document.createElement('div');
        tallyDiv.style.textAlign = 'center';
        tallyDiv.style.marginTop = '20px';
        tallyDiv.style.fontWeight = 'bold';
        tallyDiv.style.fontSize = '12px';

        let html = `Fire Collected: ${fireCount}`;
        if (bottleCount > 0) {
            html += `<br>Empty Bottles Collected: ${bottleCount}`;
        }

        html += `<br><br><span style="font-size: 10px; cursor: pointer; color: #888;" id="resetKurtzTally">[Reset Tally]</span>`;

        tallyDiv.innerHTML = html;
        contentArea.appendChild(tallyDiv);

        document.getElementById('resetKurtzTally').addEventListener('click', () => {
            if (confirm('Reset your Kurtz Camp tallies?')) {
                localStorage.setItem('hw_kurtz_fire_count', '0');
                localStorage.setItem('hw_kurtz_bottle_count', '0');
                location.reload();
            }
        });
    }
};

