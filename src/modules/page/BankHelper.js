const BankHelper = {
    cmds: ['bank', 'bank2'],
    staff: false,
    group: 'City',
    localKeys: ['hw_bank_goals_local'],
    settings: [
        { key: 'BankHelper_5FightersLunches', label: "5 Fighter's Lunches Goal" },
        { key: 'BankHelper_FixedGoals', label: "Fixed Bank Goals (+5k, +10k, +50k)" }
    ],
    getBankGoals: function() {
        let synced = {};
        let local = {};
        try {
            synced = JSON.parse(Utils.getItem('hw_bank_goals') || '{}');
        } catch(e) {}
        try {
            local = JSON.parse(Utils.getItem('hw_bank_goals_local') || '{}');
        } catch(e) {}
        return {...synced, ...local};
    },
    addBankGoal: function(actionName, cost, permanent = false) {
        let synced = {};
        let local = {};
        try { synced = JSON.parse(Utils.getItem('hw_bank_goals') || '{}'); } catch(e) {}
        try { local = JSON.parse(Utils.getItem('hw_bank_goals_local') || '{}'); } catch(e) {}

        if (cost === 0 || cost === null) {
            delete synced[actionName];
            delete local[actionName];
        } else {
            if (permanent) {
                synced[actionName] = { cost: cost, permanent: permanent };
                delete local[actionName];
            } else {
                local[actionName] = { cost: cost, permanent: permanent };
                delete synced[actionName];
            }
        }

        if (Object.keys(synced).length === 0) {
            Utils.removeItem('hw_bank_goals');
        } else {
            Utils.setItem('hw_bank_goals', JSON.stringify(synced));
        }
        
        if (Object.keys(local).length === 0) {
            Utils.removeItem('hw_bank_goals_local');
        } else {
            Utils.setItem('hw_bank_goals_local', JSON.stringify(local));
        }
    },
    init: function() {
        // Migrate non-permanent goals from synced to local storage
        let synced = {};
        let local = {};
        let needsMigration = false;
        
        try { synced = JSON.parse(Utils.getItem('hw_bank_goals') || '{}'); } catch(e) {}
        try { local = JSON.parse(Utils.getItem('hw_bank_goals_local') || '{}'); } catch(e) {}
        
        Object.keys(synced).forEach(key => {
            let val = synced[key];
            let isPerm = (typeof val === 'object' && val !== null) ? val.permanent === true : false;
            if (!isPerm) {
                local[key] = val;
                delete synced[key];
                needsMigration = true;
            }
        });
        
        if (needsMigration) {
            if (Object.keys(synced).length === 0) Utils.removeItem('hw_bank_goals');
            else Utils.setItem('hw_bank_goals', JSON.stringify(synced));
            
            if (Object.keys(local).length === 0) Utils.removeItem('hw_bank_goals_local');
            else Utils.setItem('hw_bank_goals_local', JSON.stringify(local));
        }

        const settings = Utils.getSettings();
        const withdrawInput = document.getElementById('w_money');
        const withdrawForm = document.querySelector('form[name="with"]');
        const nativeWithdrawBtn = withdrawForm ? withdrawForm.querySelector('input[type="submit"]') : null;

        if (!withdrawInput || !nativeWithdrawBtn) return;

        if (settings.BankHelper_FixedGoals !== false) {
            const fixedAmounts = [5000, 10000, 50000];
            fixedAmounts.reverse().forEach(amount => {
                const btn = document.createElement('input');
                btn.type = 'button';
                btn.value = ` +$${amount.toLocaleString()} `;
                btn.style.marginLeft = '10px';
                btn.style.cursor = 'pointer';
                btn.style.backgroundColor = '#e6f7ff';
                btn.style.border = '1px solid #91d5ff';

                btn.onclick = function() {
                    let currentVal = parseInt(withdrawInput.value.replace(/,/g, '')) || 0;
                    withdrawInput.value = (currentVal + amount).toString();
                };

                nativeWithdrawBtn.parentNode.insertBefore(btn, nativeWithdrawBtn.nextSibling);
            });
        }

        if (settings.BankHelper_5FightersLunches !== false) {
            const level = Utils.getHoboLevel();
            const lunchCost = Utils.getFightersLunchCost(level);
            const totalCost = lunchCost * 5;

            if (totalCost > 0) {
                const lunchBtn = document.createElement('input');
                lunchBtn.type = 'button';
                lunchBtn.value = ` + Add 5 Fighter's Lunches ($${totalCost.toLocaleString()}) `;
                lunchBtn.style.marginLeft = '10px';
                lunchBtn.style.cursor = 'pointer';
                lunchBtn.style.backgroundColor = '#e6f7ff';
                lunchBtn.style.border = '1px solid #91d5ff';

                lunchBtn.onclick = function() {
                    let currentVal = parseInt(withdrawInput.value.replace(/,/g, '')) || 0;
                    withdrawInput.value = (currentVal + totalCost).toString();
                };

                nativeWithdrawBtn.parentNode.insertBefore(lunchBtn, nativeWithdrawBtn.nextSibling);
            }
        }

        const goals = this.getBankGoals();
        if (Object.keys(goals).length === 0) return;

        Object.keys(goals).forEach(goalName => {
            let goalVal = 0;
            let isPermanent = false;

            if (typeof goals[goalName] === 'object' && goals[goalName] !== null) {
                goalVal = parseInt(goals[goalName].cost);
                isPermanent = goals[goalName].permanent === true;
            } else {
                goalVal = parseInt(goals[goalName]);
            }

            if (isNaN(goalVal) || goalVal <= 0) return;

            const btn = document.createElement('input');
            btn.type = 'button';
            btn.value = ` + Add ${goalName} ($${goalVal.toLocaleString()}) `;
            btn.style.marginLeft = '10px';
            btn.style.cursor = 'pointer';
            btn.style.backgroundColor = '#e6f7ff';
            btn.style.border = '1px solid #91d5ff';

            btn.onclick = function() {
                let currentVal = parseInt(withdrawInput.value.replace(/,/g, '')) || 0;
                withdrawInput.value = (currentVal + goalVal).toString();

                if (!isPermanent) {
                    Modules.BankHelper.addBankGoal(goalName, 0);
                    this.value = "Added!";
                    this.disabled = true;
                    this.style.backgroundColor = '#f5f5f5';
                    this.style.border = '1px solid #d9d9d9';
                }
            };

            nativeWithdrawBtn.parentNode.insertBefore(btn, nativeWithdrawBtn.nextSibling);
        });
    }
}
