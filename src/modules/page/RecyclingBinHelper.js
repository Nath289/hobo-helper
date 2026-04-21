const RecyclingBinHelper = {
    cmds: 'recycling_bin',
    staff: false,
    settings: [
        { key: 'RecyclingBinHelper_Enable', label: 'Enable Recycling Quick-Add Buttons' },
        { key: 'RecyclingBinHelper_Amounts', label: 'Quick-Add Amounts', type: 'text', defaultValue: '100, 200, 500, 750', description: 'Comma separated list of amounts for quick-add buttons' }
    ],
    init: function() {
        const settings = Utils.getSettings();
        if (settings?.RecyclingBinHelper_Enable === false) return;

        this.initRecycleButtons(settings);
    },

    initRecycleButtons: function(settings) {
        const sCansInput = document.getElementById('s_cans');
        const submitBtn = document.querySelector('form[name="bin"] input[type="submit"][name="Submit"]');

        if (sCansInput && submitBtn) {
            let amountsStr = settings?.RecyclingBinHelper_Amounts;
            if (amountsStr === undefined || amountsStr === null) {
                amountsStr = '100, 200, 500, 750, 900';
            }

            let amounts = amountsStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            if (amounts.length === 0) amounts = [100, 200, 500, 750];

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

            const configBtn = document.createElement('input');
            configBtn.type = 'button';
            configBtn.value = '⚙ Configure';
            configBtn.style.marginLeft = '5px';
            configBtn.title = 'Configure the amounts for the quick-add buttons';
            configBtn.onclick = function(e) {
                e.preventDefault();
                let panel = document.getElementById('hh_recycling_panel');
                if (panel) {
                    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                    return;
                }

                submitBtn.parentNode.style.position = 'relative';

                panel = document.createElement('div');
                panel.id = 'hh_recycling_panel';
                panel.style.cssText = 'position: absolute; bottom: 35px; left: 100px; background: #fdfdfd; border: 2px solid #555; padding: 10px; box-shadow: 2px 2px 8px rgba(0,0,0,0.2); z-index: 1000; font-family: Tahoma, sans-serif; font-size: 12px; color: #333; display: block; width: 220px;';

                let currentEditAmounts = [...amounts];

                panel.innerHTML = `
                    <div style="font-weight:bold; margin-bottom:5px; border-bottom:1px solid #ccc; padding-bottom:5px;">Configure Amounts</div>
                    <div id="hh_recycling_inputs_container" style="margin-bottom:10px; max-height: 150px; overflow-y: auto;"></div>
                    <div style="margin-bottom:10px;">
                        <button type="button" id="hh_recycling_add" style="cursor:pointer; padding:2px 6px; font-size:11px; background:#ddd; border:1px solid #999; border-radius:3px;">+ Add Amount</button>
                    </div>
                    <div style="text-align: right;">
                        <button type="button" id="hh_recycling_save" style="cursor:pointer; font-weight:bold; margin-right:5px; padding:2px 8px; background:#eee; border:1px solid #aaa; border-radius:3px;">Save</button>
                        <button type="button" id="hh_recycling_cancel" style="cursor:pointer; padding:2px 8px; background:#eee; border:1px solid #aaa; border-radius:3px;">Cancel</button>
                    </div>
                `;

                submitBtn.parentNode.appendChild(panel);

                const renderInputs = () => {
                    const container = document.getElementById('hh_recycling_inputs_container');
                    container.innerHTML = '';
                    currentEditAmounts.forEach((amt, idx) => {
                        const row = document.createElement('div');
                        row.style.marginBottom = '5px';
                        row.innerHTML = `
                            <input type="number" class="hh_recycling_amount_input" value="${amt}" style="width: 100px; padding: 2px; font-size: 11px;" />
                            <button type="button" data-idx="${idx}" class="hh_recycling_del_btn" style="cursor:pointer; font-size:10px; margin-left:5px; color:red; border:1px solid red; background:none; border-radius:3px;">X</button>
                        `;
                        container.appendChild(row);
                    });

                    container.querySelectorAll('.hh_recycling_del_btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            updateCurrentFromDOM();
                            const idx = parseInt(e.target.getAttribute('data-idx'), 10);
                            currentEditAmounts.splice(idx, 1);
                            renderInputs();
                        });
                    });
                };

                const updateCurrentFromDOM = () => {
                    currentEditAmounts = [];
                    document.querySelectorAll('.hh_recycling_amount_input').forEach(input => {
                        const val = parseInt(input.value, 10);
                        if (!isNaN(val)) currentEditAmounts.push(val);
                    });
                };

                renderInputs();

                document.getElementById('hh_recycling_add').addEventListener('click', () => {
                    updateCurrentFromDOM();
                    currentEditAmounts.push(100);
                    renderInputs();
                });

                document.getElementById('hh_recycling_save').addEventListener('click', () => {
                    updateCurrentFromDOM();
                    const val = currentEditAmounts.join(', ');
                    const currentSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
                    currentSettings['RecyclingBinHelper_Amounts'] = val;
                    localStorage.setItem('hw_helper_settings', JSON.stringify(currentSettings));
                    window.location.reload();
                });

                document.getElementById('hh_recycling_cancel').addEventListener('click', () => {
                    panel.style.display = 'none';
                });
            };
            submitBtn.parentNode.insertBefore(configBtn, submitBtn.nextSibling);
        }
    }
};
