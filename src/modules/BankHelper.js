const BankHelper = {
            getBankGoals: function() {
                try {
                    return JSON.parse(localStorage.getItem('hw_bank_goals') || '{}');
                } catch(e) {
                    return {};
                }
            },
            addBankGoal: function(actionName, cost) {
                const goals = this.getBankGoals();
                if (cost === 0 || cost === null) {
                    delete goals[actionName];
                } else {
                    goals[actionName] = cost;
                }
                if (Object.keys(goals).length === 0) {
                    localStorage.removeItem('hw_bank_goals');
                } else {
                    localStorage.setItem('hw_bank_goals', JSON.stringify(goals));
                }
            },
            init: function() {
                const url = window.location.href;
                if (!url.includes('cmd=bank')) return;

                const goals = this.getBankGoals();
                if (Object.keys(goals).length === 0) return;

                const withdrawInput = document.getElementById('w_money');
                const withdrawForm = document.querySelector('form[name="with"]');
                const nativeWithdrawBtn = withdrawForm ? withdrawForm.querySelector('input[type="submit"]') : null;

                if (!withdrawInput || !nativeWithdrawBtn) return;

                Object.keys(goals).forEach(goalName => {
                    const goalVal = parseInt(goals[goalName]);
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

                        Modules.BankHelper.addBankGoal(goalName, 0);

                        this.value = "Added!";
                        this.disabled = true;
                        this.style.backgroundColor = '#f5f5f5';
                        this.style.border = '1px solid #d9d9d9';
                    };

                    nativeWithdrawBtn.parentNode.insertBefore(btn, nativeWithdrawBtn.nextSibling);
                });
            }
        }

