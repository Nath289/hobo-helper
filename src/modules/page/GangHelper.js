const GangHelper = {
    settings: [
        { key: 'GangHelper_EnableFeature', label: 'Enable Gang Helper' }
    ],
    init: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const cmd = urlParams.get('cmd');
        const doParam = urlParams.get('do');
        const wParam = urlParams.get('w');
        
        // Ensure we are on the Gang page
        if (cmd !== 'gang' || doParam !== 'enter') return;

        const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');

        if (savedSettings['GangHelper_EnableFeature'] !== false) {
            // Check if we are viewing the last gang happenings
            if (wParam === 'lastsh') {
                this.initGangHappenings();
            } else {
                this.initGangFeature();
            }
        }
    },
    
    initGangFeature: function() {
        console.log("GangHelper loaded on dashboard.");
        // TODO: Implement gang page specifics
    },

    initGangHappenings: function() {
        console.log("GangHelper loaded on last happenings page.");

        // Verify this is the correct event by checking the raw HTML Structure
        const htmlContent = document.body.innerHTML || "";
        const isSundayFunday = /<b>\s*<u>Last Gang Happening Stats:<\/u><\/b>\s*Gangsters Sunday = Funday/i.test(htmlContent);

        if (!isSundayFunday) {
            console.log("GangHelper: Event is not 'Gangsters Sunday = Funday'. Aborting.");
            return;
        }

        // Verify user is Gang Staff by checking for Manage Loans access
        const isStaff = !!document.querySelector('a[href*="cmd=gang2&do=loans"]');
        if (!isStaff) {
            console.log("GangHelper: User is not Gang Staff. Aborting.");
            return;
        }

        console.log("GangHelper: 'Gangsters Sunday = Funday' event detected! Ready for next steps.");
        
        const table = document.querySelector('table[cellspacing="2"][cellpadding="3"]');
        if (!table) return;

        const panel = document.createElement('div');
        panel.style.cssText = 'margin-bottom: 15px; padding: 10px; border: 1px solid #ccc; background: #eee; font-family: Tahoma, sans-serif; text-align: left;';
        
        panel.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px;">Gangsters Sunday = Funday Payouts</div>
            <label style="font-size: 11px; margin-right: 10px;">
                Amount per Point ($): 
                <input type="number" id="hh_sf_rate" value="1000" style="width: 80px; padding: 2px;">
            </label>
            <label style="font-size: 11px; margin-right: 10px;">
                Max Payout per Hobo ($): 
                <input type="number" id="hh_sf_max" value="500000" style="width: 100px; padding: 2px;">
            </label>
            <button type="button" id="hh_sf_save_btn" style="padding: 3px 8px; cursor: pointer; font-weight: bold; background: #ddd; border: 1px solid #999; border-radius: 3px;">
                💾 Save Event Payouts
            </button>
            <span id="hh_sf_status" style="font-size: 11px; font-weight: bold; color: green; margin-left: 10px;"></span>
        `;

        table.parentElement.insertBefore(panel, table);

        document.getElementById('hh_sf_save_btn').addEventListener('click', () => {
            const rows = table.querySelectorAll('tr[bgcolor="#F3F3F3"], tr[bgcolor="#DCDCDC"]');
            const rate = parseInt(document.getElementById('hh_sf_rate').value, 10) || 1000;
            const maxPayout = parseInt(document.getElementById('hh_sf_max').value, 10) || 500000;

            const payments = [];

            Array.from(rows).forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length < 2) return;
                
                const link = cells[0].querySelector('a');
                if (!link) return;

                const nameText = link.innerText.trim();
                const urlParams = new URLSearchParams(link.href.split('?')[1]);
                const hoboId = urlParams.get('ID');

                const scoreText = cells[1].innerText.replace(/,/g, '').trim();
                const score = parseInt(scoreText, 10);

                if (hoboId && !isNaN(score) && score > 0) {
                    let payout = score * rate;
                    if (payout > maxPayout) payout = maxPayout;

                    payments.push({
                        id: hoboId,
                        name: nameText,
                        description: `Stats: Sunday=Funday (Score: ${score})`,
                        amount: payout.toString(),
                        timestamp: Date.now(),
                        completed: false,
                        cleared: false
                    });
                }
            });

            if (payments.length > 0) {
                const topicName = "Gangsters Sunday = Funday Payouts";
                const savedPosts = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                savedPosts[topicName] = {
                    timestamp: Date.now(),
                    topic: topicName,
                    totalHobos: 0,
                    hobos: [],
                    paymentsToHobos: payments
                };
                localStorage.setItem('hw_helper_gang_posts', JSON.stringify(savedPosts));
                
                const statusEl = document.getElementById('hh_sf_status');
                statusEl.innerText = `✅ Saved ${payments.length} payouts to Gang Loans dashboard!`;
                setTimeout(() => { statusEl.innerText = ''; }, 3000);
            }
        });
    }
};
