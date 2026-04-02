const WellnessClinicHelper = {
            init: function() {
                const url = window.location.href;

                const clinicData = [
                    {lv: 1, fee: 2500}, {lv: 2, fee: 12500}, {lv: 3, fee: 42500}, {lv: 4, fee: 92500}, {lv: 5, fee: 162500},
                    {lv: 6, fee: 252500}, {lv: 7, fee: 362500}, {lv: 8, fee: 492500}, {lv: 9, fee: 642500}, {lv: 10, fee: 812500},
                    {lv: 11, fee: 1002500}, {lv: 12, fee: 1212500}, {lv: 13, fee: 1442500}, {lv: 14, fee: 1692500}, {lv: 15, fee: 1962500},
                    {lv: 16, fee: 2252500}, {lv: 17, fee: 2562500}, {lv: 18, fee: 2892500}, {lv: 19, fee: 3242500}, {lv: 20, fee: 3612500},
                    {lv: 21, fee: 4002500}, {lv: 22, fee: 4412500}, {lv: 23, fee: 4842500}, {lv: 24, fee: 5292500}, {lv: 25, fee: 5762500},
                    {lv: 26, fee: 6252500}, {lv: 27, fee: 6762500}, {lv: 28, fee: 7292500}, {lv: 29, fee: 7842500}, {lv: 30, fee: 8412500},
                    {lv: 31, fee: 9002500}, {lv: 32, fee: 9612500}, {lv: 33, fee: 10242500}, {lv: 34, fee: 10892500}, {lv: 35, fee: 11562500},
                    {lv: 36, fee: 12252500}, {lv: 37, fee: 12962500}, {lv: 38, fee: 13692500}, {lv: 39, fee: 14442500}, {lv: 40, fee: 15212500},
                    {lv: 41, fee: 16002500}, {lv: 42, fee: 16812500}, {lv: 43, fee: 17642500}, {lv: 44, fee: 18492500}, {lv: 45, fee: 19362500},
                    {lv: 46, fee: 20252500}, {lv: 47, fee: 21162500}, {lv: 48, fee: 22092500}, {lv: 49, fee: 23042500}, {lv: 50, fee: 24012500},
                    {lv: 51, fee: 25002500}, {lv: 52, fee: 26012500}, {lv: 53, fee: 27042500}, {lv: 54, fee: 28092500}, {lv: 55, fee: 29162500},
                    {lv: 56, fee: 30252500}, {lv: 57, fee: 31362500}, {lv: 58, fee: 32492500}, {lv: 59, fee: 33642500}, {lv: 60, fee: 34812500},
                    {lv: 61, fee: 36002500}, {lv: 62, fee: 37212500}, {lv: 63, fee: 38442500}, {lv: 64, fee: 39692500}, {lv: 65, fee: 40962500},
                    {lv: 66, fee: 42252500}, {lv: 67, fee: 43562500}, {lv: 68, fee: 44892500}, {lv: 69, fee: 46242500}, {lv: 70, fee: 47612500},
                    {lv: 71, fee: 49002500}, {lv: 72, fee: 50412500}, {lv: 73, fee: 51842500}, {lv: 74, fee: 53292500}, {lv: 75, fee: 54762500},
                    {lv: 76, fee: 56252500}, {lv: 77, fee: 57762500}, {lv: 78, fee: 59292500}, {lv: 79, fee: 60842500}, {lv: 80, fee: 62412500},
                    {lv: 81, fee: 64002500}, {lv: 82, fee: 65612500}, {lv: 83, fee: 67242500}, {lv: 84, fee: 68892500}, {lv: 85, fee: 70562500},
                    {lv: 86, fee: 72252500}, {lv: 87, fee: 73962500}, {lv: 88, fee: 75692500}, {lv: 89, fee: 77442500}, {lv: 90, fee: 79212500},
                    {lv: 91, fee: 81002500}, {lv: 92, fee: 82812500}, {lv: 93, fee: 84642500}, {lv: 94, fee: 86492500}, {lv: 95, fee: 88362500},
                    {lv: 96, fee: 90252500}, {lv: 97, fee: 92162500}, {lv: 98, fee: 94092500}, {lv: 99, fee: 96042500}, {lv: 100, fee: 98012500}
                ];

                if (url.includes('cmd=wellness_clinic')) {
                    const contentArea = document.querySelector('.content-area');
                    if (!contentArea) return;

                    const text = contentArea.innerText;
                    const costMatch = text.match(/\$?([0-9]{1,3}(,[0-9]{3})+|[0-9]{4,})/);
                    let detectedCost = 0;
                    if (costMatch) detectedCost = Utils.parseNumber(costMatch[0]);

                    const hasPaid = url.includes('do=pay');
                    let currentIndex = clinicData.findIndex(row => row.fee === detectedCost);
                    if (hasPaid && currentIndex !== -1 && currentIndex < clinicData.length - 1) currentIndex += 1;

                    let runningTotalSpentDay = 0;
                    let runningFutureCost = 0;
                    let tableRows = "";

                    let savedGoals = Modules.BankHelper.getBankGoals();
                    const savedGoal = savedGoals['Wellness'];

                    clinicData.forEach((row, index) => {
                        runningTotalSpentDay += row.fee;
                        const isCurrentOrFuture = (index >= currentIndex && currentIndex !== -1);
                        if (isCurrentOrFuture) runningFutureCost += row.fee;

                        const isCurrentRow = (index === currentIndex);
                        const rowID = isCurrentRow ? 'id="hw-current-row"' : '';
                        const bg = isCurrentRow ? 'rgba(255, 255, 153, 0.4)' : 'transparent';
                        const isBlue = (savedGoal && parseInt(savedGoal) === runningFutureCost);
                        const activeClass = isBlue ? 'active' : '';
                        const interactiveClass = isCurrentOrFuture ? 'interactive' : '';
                        const cellClasses = `hw-wellness-finish-cell ${interactiveClass} ${activeClass}`.trim();
                        const interactiveStyle = isCurrentOrFuture ? 'cursor: pointer; color: #800;' : 'color: #888;';

                        tableRows += `
                            <tr ${rowID} style="background-color: ${bg}; border-bottom: 1px solid #ddd;">
                                <td style="padding: 4px; text-align: center; border-right: 1px solid #bbb;">${row.lv}</td>
                                <td style="padding: 4px; text-align: right; border-right: 1px solid #bbb;">$${row.fee.toLocaleString()}</td>
                                <td style="padding: 4px; text-align: right; border-right: 1px solid #bbb;">$${runningTotalSpentDay.toLocaleString()}</td>
                                <td class="${cellClasses}" data-val="${runningFutureCost}" style="padding: 4px; text-align: right; ${interactiveStyle}">
                                    ${isCurrentOrFuture ? `$${runningFutureCost.toLocaleString()}` : '-'}
                                </td>
                            </tr>
                        `;
                    });

                    const spentToday = (currentIndex !== -1) ? (runningTotalSpentDay - runningFutureCost) : 0;

                    const trackerHtml = `
                        <style>
                            .hw-wellness-finish-cell.interactive:hover:not(.active) {
                                background-color: #e0f0ff !important;
                            }
                            .hw-wellness-finish-cell.active {
                                background-color: lightblue !important;
                                font-weight: bold;
                            }
                        </style>
                        <div id="hw-tracker-container" style="margin: 20px auto; width: 95%; max-width: 580px; font-family: Verdana, sans-serif;">
                            <div id="hw-scroll-box" style="max-height: 350px; overflow-y: auto; border: 1px solid #666; border-radius: 4px; background-color: rgba(255,255,255,0.7);">
                                <table style="width: 100%; border-collapse: collapse; color: #000; font-size: 11px;">
                                    <thead style="position: sticky; top: 0; background: #f0f0f0; z-index: 10; border-bottom: 2px solid #999;">
                                        <tr>
                                            <th style="padding: 6px; border-right: 1px solid #bbb;">Lv</th>
                                            <th style="padding: 6px; border-right: 1px solid #bbb;">Fee</th>
                                            <th style="padding: 6px; border-right: 1px solid #bbb;">Total Spent Day</th>
                                            <th style="padding: 6px; background: #f9f9e8;">Cumulative Spend</th>
                                        </tr>
                                    </thead>
                                    <tbody>${tableRows}</tbody>
                                </table>
                            </div>
                            <div style="font-size: 11px; font-style: italic; color: #555; margin-top: 4px; text-align: center;">
                               💡 Click any amount in the <b>Cumulative Spend</b> column to set it as a Bank Withdraw Goal.
                            </div>
                            <div style="font-size: 12px; margin-top: 8px; color: #333; text-align: right; font-weight: bold;">
                               Total Spent Today: <span style="color: #800;">$${spentToday.toLocaleString()}</span>
                            </div>
                        </div>
                    `;

                    contentArea.insertAdjacentHTML('beforeend', trackerHtml);

                    document.querySelectorAll('.hw-wellness-finish-cell').forEach(cell => {
                        cell.addEventListener('click', function() {
                            if (!this.classList.contains('interactive')) return;
                            const val = this.getAttribute('data-val');
                            if (val === "0") return;
                            const isAlreadyActive = this.classList.contains('active');
                            document.querySelectorAll('.hw-wellness-finish-cell').forEach(c => c.classList.remove('active'));

                            if (!isAlreadyActive) {
                                this.classList.add('active');
                                Modules.BankHelper.addBankGoal('Wellness', parseInt(val));
                            } else {
                                Modules.BankHelper.addBankGoal('Wellness', 0);
                            }
                        });
                    });

                    setTimeout(() => {
                        const row = document.getElementById('hw-current-row');
                        const box = document.getElementById('hw-scroll-box');
                        if (row && box) box.scrollTop = row.offsetTop - 100;
                    }, 150);
                }
            }
        }
