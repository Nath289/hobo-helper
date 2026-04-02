const RecyclingBinHelper = {
    init: function() {
        if (!Utils.isCurrentPage('cmd=recycling_bin')) return;

        const settings = Utils.getSettings();
        if (settings.global_enabled === false) return;
        if (settings.RecyclingBinHelper === false) return;

        this.initRecycleButtons();
    },

    initRecycleButtons: function() {
        const sCansInput = document.getElementById('s_cans');
        const submitBtn = document.querySelector('form[name="bin"] input[type="submit"][name="Submit"]');

        if (sCansInput && submitBtn) {
            const amounts = [100, 200, 500];

            amounts.forEach(amount => {
                const btn = document.createElement('input');
                btn.type = 'button';
                btn.value = '+' + amount;
                btn.style.marginRight = '5px';
                btn.onclick = function(e) {
                    e.preventDefault();
                    const currentVal = parseInt(sCansInput.value) || 0;
                    sCansInput.value = currentVal + amount;
                };
                submitBtn.parentNode.insertBefore(btn, submitBtn);
            });
        }
    }
};
