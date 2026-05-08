const BattleLogHelper = {
    cmds: 'battlel',
    staff: false,
    group: 'Fighting',
    localKeys: ['BattleLogHelper_FoughtHobos'],
    settings: [],

    init: function() {
        // Run only on the battle log page
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('cmd') !== 'battlel') return;

        this.addScanButton();
    },

    addScanButton: function() {
        const table = document.getElementById('sortabletable') || document.querySelector('.content-area table');
        if (!table) return;

        const btn = document.createElement('button');
        btn.textContent = 'Scan Battle Log for Experience';
        btn.className = 'btn';
        btn.style.display = 'block';
        btn.style.margin = '0 auto 10px auto';
        btn.style.userSelect = 'none';
        btn.style.webkitUserSelect = 'none';

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.scanTable();
            const originalText = btn.textContent;
            btn.textContent = 'Scanned & Saved!';
            setTimeout(() => { btn.textContent = originalText; }, 2000);
        });

        table.parentElement.insertBefore(btn, table);
    },

    scanTable: function() {
        const table = document.getElementById('sortabletable') || document.querySelector('.content-area table');
        if (!table) return;

        const tbody = table.querySelector('tbody') || table;
        const rows = Array.from(tbody.querySelectorAll('tr')).slice(1); // skip header

        let expMap = this.getFoughtHobos();
        let changed = false;

        for (let i = rows.length - 1; i >= 0; i--) {
            const row = rows[i];
            const tds = row.querySelectorAll('td');

            if (tds.length >= 5) {
                const outcomeImg = tds[3].querySelector('img');
                if (outcomeImg && outcomeImg.title === 'win') {
                    const defLink = tds[2].querySelector('a[href*="ID="]');
                    if (defLink) {
                        const match = defLink.href.match(/ID=(\d+)/i);
                        if (match && match[1]) {
                            const hoboId = match[1];
                            const expRaw = tds[4].textContent.replace(/,/g, '').trim();
                            const expVal = parseInt(expRaw, 10);

                            if (!isNaN(expVal) && expVal > 0) {
                                expMap[hoboId] = expVal;
                                changed = true;
                            }
                        }
                    }
                }
            }
        }

        if (changed) {
            Utils.setItem('BattleLogHelper_FoughtHobos', JSON.stringify(expMap));
            Utils.log('[Hobo Helper] Scanned battle log and updated experience dictionary.');
        }
    },

    getFoughtHobos: function() {
        try {
            return JSON.parse(Utils.getItem('BattleLogHelper_FoughtHobos') || '{}');
        } catch (e) {
            return {};
        }
    }
};
