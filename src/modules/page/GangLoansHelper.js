const GangLoansHelper = {
    init: function() {
        const isLoans = window.location.search.includes('cmd=gang2') && window.location.search.includes('do=loans');
        const isLoanAdd = window.location.search.includes('cmd=gang2') && window.location.search.includes('do=loan_add');
        const isLoanDel = window.location.search.includes('cmd=gang2') && window.location.search.includes('do=loan_del');

        if (!isLoans && !isLoanAdd && !isLoanDel) return;

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        if (isLoanAdd && contentArea.innerText.includes('You have successfully completed the transfer')) {
            const pendingStr = sessionStorage.getItem('hw_helper_pending_loan');
            if (pendingStr) {
                try {
                    const pending = JSON.parse(pendingStr);
                    const d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                    if (d[pending.topic]) {
                        if (pending.type === 'bulk' && d[pending.topic].hobos && d[pending.topic].hobos[pending.index]) {
                            d[pending.topic].hobos[pending.index].completed = true;
                        } else if (pending.type === 'payment' && d[pending.topic].paymentsToHobos && d[pending.topic].paymentsToHobos[pending.index]) {
                            d[pending.topic].paymentsToHobos[pending.index].completed = true;
                        }
                        localStorage.setItem('hw_helper_gang_posts', JSON.stringify(d));
                    }
                } catch (e) {
                    console.error('Error parsing pending loan', e);
                }
                sessionStorage.removeItem('hw_helper_pending_loan');
            }
        }

        if (isLoanDel && contentArea.innerText.includes('This loan has been removed')) {
            const pendingClearStr = sessionStorage.getItem('hw_helper_pending_clear');
            if (pendingClearStr) {
                try {
                    const pending = JSON.parse(pendingClearStr);
                    const d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                    if (d[pending.topic]) {
                        if (pending.type === 'bulk' && d[pending.topic].hobos && d[pending.topic].hobos[pending.index]) {
                            d[pending.topic].hobos[pending.index].cleared = true;
                        } else if (pending.type === 'payment' && d[pending.topic].paymentsToHobos && d[pending.topic].paymentsToHobos[pending.index]) {
                            d[pending.topic].paymentsToHobos[pending.index].cleared = true;
                        }
                        localStorage.setItem('hw_helper_gang_posts', JSON.stringify(d));
                    }
                } catch (e) {
                    console.error('Error parsing pending clear', e);
                }
                sessionStorage.removeItem('hw_helper_pending_clear');
            }
        }

        this.renderPanel(contentArea);
    },

    renderPanel: function(container) {
        const savedPosts = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
        const postKeys = Object.keys(savedPosts);

        const banksEl = document.getElementById('banks');
        const banksSelectHtml = banksEl ? banksEl.innerHTML : '';

        const panel = document.createElement('div');
        panel.style.cssText = 'border: 2px solid #336699; background: #eef5ff; padding: 15px; margin-bottom: 20px; border-radius: 5px; color: black; font-size: 13px; line-height: 1.4;';

        const header = document.createElement('h3');
        header.style.cssText = 'margin: 0 0 10px 0; border-bottom: 1px solid #336699; padding-bottom: 5px; font-weight: bold; font-size: 16px; display: flex; justify-content: space-between; align-items: center;';
        header.innerHTML = `
            <span>Saved Gang Posts & Payments</span>
            <span style="font-size: 12px; font-weight: normal; cursor: pointer; color: #ff0000; text-decoration: underline;" id="hw-clear-all-gang-posts">[Clear All]</span>
        `;

        panel.appendChild(header);

        if (postKeys.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.style.fontStyle = 'italic';
            emptyMsg.style.color = '#555';
            emptyMsg.innerText = 'No saved gang posts or payments found.';
            panel.appendChild(emptyMsg);
        } else {
            const listContainer = document.createElement('div');
            listContainer.style.display = 'flex';
            listContainer.style.flexDirection = 'column';
            listContainer.style.gap = '10px';

            postKeys.forEach(topic => {
                const data = savedPosts[topic];
                const hobos = data.hobos || [];
                const payments = data.paymentsToHobos || [];
                
                const savedBulkAmt = data.bulkAmount || '';
                const savedBulkMemo = data.bulkMemo || '';

                const item = document.createElement('div');
                item.style.cssText = 'border: 1px solid #b3d4fc; background: #ffffff; padding: 10px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);';

                const safeTopicId = topic.replace(/[^a-zA-Z0-9]/g, '');

                let exportBtnsHtml = '';
                const isBulkAmtMissing = hobos.length > 0 && !savedBulkAmt.trim();
                const disabledStyle = isBulkAmtMissing ? 'opacity: 0.5; cursor: not-allowed;' : 'cursor: pointer;';
                const disabledAttr = isBulkAmtMissing ? 'disabled="disabled"' : '';

                if (hobos.length > 0) {
                    exportBtnsHtml += `<button class="hw-export-repliers" data-topic="${topic}" data-ctrl="${safeTopicId}" ${disabledAttr} style="padding: 3px 8px; background: #e6f3ff; border: 1px solid #99c2ff; border-radius: 3px; font-size: 11px; color: #0055aa; margin-right: 5px; ${disabledStyle}">Export Saved Repliers</button>`;
                }
                if (payments.length > 0) {
                    exportBtnsHtml += `<button class="hw-export-payments" data-topic="${topic}" style="padding: 3px 8px; cursor: pointer; background: #e6f3ff; border: 1px solid #99c2ff; border-radius: 3px; font-size: 11px; color: #0055aa; margin-right: 5px;">Export Payments</button>`;
                }
                if (hobos.length > 0 || payments.length > 0) {
                    const isTotalBulkMissing = hobos.length > 0 && !savedBulkAmt.trim();
                    const totalDisabledStyle = isTotalBulkMissing ? 'opacity: 0.5; cursor: not-allowed;' : 'cursor: pointer;';
                    const totalDisabledAttr = isTotalBulkMissing ? 'disabled="disabled"' : '';
                    exportBtnsHtml += `<button class="hw-export-totals" data-topic="${topic}" data-ctrl="${safeTopicId}" ${totalDisabledAttr} style="padding: 3px 8px; background: #e6f3ff; border: 1px solid #99c2ff; border-radius: 3px; font-size: 11px; color: #0055aa; margin-right: 5px; ${totalDisabledStyle}">Export Totals</button>`;
                }

                const titleRow = document.createElement('div');
                titleRow.style.cssText = 'font-weight: bold; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; background: #f7faff; padding: 5px 8px; border-radius: 3px; border: 1px solid #e1eeff;';
                titleRow.innerHTML = `
                    <span style="font-size: 14px; color: #003366;">📝 Topic: ${topic}</span>
                    <div style="display:flex; align-items:center;">
                        ${exportBtnsHtml}
                        <button class="hw-delete-topic" data-topic="${topic}" style="padding: 3px 8px; cursor: pointer; background: #ffe6e6; border: 1px solid #ff9999; border-radius: 3px; font-size: 11px; color: #cc0000;">Remove</button>
                    </div>
                `;

                item.appendChild(titleRow);

                const savedBank = data.bankAccount || '';
                let bankOptions = banksSelectHtml;
                if (savedBank && bankOptions) {
                    // Replace the generic selected attribute if found, then set the correct one
                    bankOptions = bankOptions.replace(/selected(="selected"|="")?/g, '');
                    bankOptions = bankOptions.replace(`value="${savedBank}"`, `value="${savedBank}" selected`);
                }

                let dynamicTotalAmt = 0;
                payments.forEach(p => {
                    const amtParts = String(p.amount || '').replace(/[^0-9]/g, '');
                    dynamicTotalAmt += parseInt(amtParts, 10) || 0;
                });
                if (hobos.length > 0) {
                    const amtRaw = String(savedBulkAmt || '').replace(/[^0-9]/g, '');
                    const bulkAmt = parseInt(amtRaw, 10) || 0;
                    dynamicTotalAmt += (hobos.length * bulkAmt);
                }
                const formattedTotalInit = dynamicTotalAmt > 0 ? '$' + dynamicTotalAmt.toLocaleString() : '$0';

                const settingsRow = document.createElement('div');
                settingsRow.style.cssText = 'padding: 5px 8px; margin-bottom: 8px; background: #eef5ff; border: 1px solid #b3d4fc; border-radius: 3px; display: flex; align-items: center; justify-content: space-between; font-size: 13px;';
                settingsRow.innerHTML = `
                    <span><strong>Bank Account:</strong> <select class="hw-topic-bank" data-topic="${topic}" style="max-width: 250px; font-size: 13px; padding: 4px; margin-left: 5px;">${bankOptions}</select></span>
                    <span style="font-weight: bold; color: #0055aa; margin-left: 15px;">Total: <span id="total-amt-${safeTopicId}">${formattedTotalInit}</span></span>
                `;
                item.appendChild(settingsRow);

                if (hobos.length === 0 && payments.length === 0) {
                    const emptyRecord = document.createElement('div');
                    emptyRecord.style.fontStyle = 'italic';
                    emptyRecord.style.color = '#999';
                    emptyRecord.innerText = 'Empty record.';
                    item.appendChild(emptyRecord);
                }

                if (hobos.length > 0) {
                    const hobosDiv = document.createElement('div');
                    hobosDiv.style.cssText = 'margin-bottom: 12px; font-size: 12px;';
                    
                    let hobosHtml = `
                        <div style="font-weight: bold; color: #333; margin-bottom: 3px;">Saved Repliers (Bulk Payment Workflow - ${hobos.length} Repliers):</div>
                        <div style="margin-bottom: 5px; padding: 5px; background: #eef5ff; border: 1px solid #b3d4fc; border-radius: 3px; display: flex; align-items: center; gap: 10px;">
                            <span><strong>Bulk Amount:</strong> <input type="text" id="amt-${safeTopicId}" value="${savedBulkAmt}" placeholder="e.g. 5000000" style="width: 100px;"></span>
                            <span><strong>Bulk Memo:</strong> <input type="text" id="memo-${safeTopicId}" value="${savedBulkMemo}" placeholder="Optional" maxlength="60" style="width: 200px;"></span>
                            <button class="hw-save-bulk-details" data-topic="${topic}" data-ctrl="${safeTopicId}" style="cursor:pointer; background:#e6f3ff; border:1px solid #99c2ff; border-radius:3px; padding:2px 8px; font-weight:bold; color:#0055aa;">Save</button>
                        </div>
                        <div style="max-height: 150px; overflow-y: auto; border: 1px solid #e0e0e0; padding: 6px; background: #fcfcfc; border-radius: 3px; line-height: 1.6;">
                            <table style="width: 100%; border-collapse: collapse;">
                                <tbody>
                    `;

                    hobos.forEach((h, hIndex) => {
                        const isCompleted = h.completed;
                        const isCleared = h.cleared;
                        const rowBg = isCleared ? '#f0f0f0' : (isCompleted ? '#e6ffe6' : 'transparent');

                        let actionsHtml = '';
                        if (isCleared) {
                            actionsHtml = `<span style="color: #666; font-weight: bold; font-style: italic;">Completed</span>`;
                        } else if (!isCompleted) {
                            actionsHtml = `
                                <button class="hw-insert-bulk" data-id="${h.id}" data-ctrl="${safeTopicId}" data-topic="${topic}" data-index="${hIndex}" style="cursor:pointer; background:#e6f3ff; border:1px solid #99c2ff; border-radius:3px; padding:3px 8px; margin-right:4px;">Insert</button>
                                <button class="hw-complete-bulk" data-topic="${topic}" data-index="${hIndex}" style="cursor:pointer; background:#e6ffe6; border:1px solid #66cc66; border-radius:3px; padding:3px 8px; margin-right:4px;">Done</button>
                                <button class="hw-remove-bulk" data-topic="${topic}" data-index="${hIndex}" style="cursor:pointer; background:#ffe6e6; border:1px solid #ff9999; border-radius:3px; padding:3px 8px;">Remove</button>
                            `;
                        } else {
                            actionsHtml = `
                                <span style="color: #00aa00; font-weight: bold; margin-right: 8px;">Loan Created ✅</span>
                                <button class="hw-select-loan" data-id="${h.id}" data-type="bulk" data-ctrl="${safeTopicId}" data-topic="${topic}" data-index="${hIndex}" style="cursor:pointer; background:#fff2cc; border:1px solid #ffcc00; border-radius:3px; padding:3px 8px;">Select Loan</button>
                            `;
                        }

                        hobosHtml += `
                            <tr style="border-bottom: 1px solid #eee; background: ${rowBg};">
                                <td style="padding: 4px;">
                                    <a href="game.php?sr=${this.getSr()}&cmd=player&ID=${h.id}" target="_blank" style="text-decoration: none; color: #0055aa; font-weight: bold;">${h.name}</a> 
                                    <span style="color: #666; font-size: 11px;">[ID: ${h.id}]</span>
                                </td>
                                <td style="padding: 4px; text-align: right; white-space: nowrap;">
                                    ${actionsHtml}
                                </td>
                            </tr>
                        `;
                    });

                    hobosHtml += `
                                </tbody>
                            </table>
                        </div>
                    `;
                    hobosDiv.innerHTML = hobosHtml;
                    item.appendChild(hobosDiv);
                }

                if (payments.length > 0) {
                    const payDiv = document.createElement('div');
                    payDiv.style.cssText = 'font-size: 12px;';

                    let payHtml = `
                        <div style="font-weight: bold; color: #333; margin-bottom: 3px;">Payments to Action (${payments.length}):</div>
                        <div style="overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse; margin-top: 2px;">
                                <thead>
                                    <tr style="background: #eef5ff; text-align: left; border-bottom: 2px solid #b3d4fc;">
                                        <th style="padding: 6px; border: 1px solid #d9e8fa; white-space: nowrap;">ID</th>
                                        <th style="padding: 6px; border: 1px solid #d9e8fa; white-space: nowrap;">Name</th>
                                        <th style="padding: 6px; border: 1px solid #d9e8fa; white-space: nowrap;">Amount</th>
                                        <th style="padding: 6px; border: 1px solid #d9e8fa; width: 100%;">Description</th>
                                        <th style="padding: 6px; border: 1px solid #d9e8fa; white-space: nowrap;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                    `;

                    payments.forEach((p, pIndex) => {
                        const hoboId = p.hoboId || p.id || '';
                        const hoboName = p.hoboName || p.name || '';
                        const isCompleted = p.completed;
                        const isCleared = p.cleared;
                        const rowBg = isCleared ? '#f0f0f0' : (isCompleted ? '#e6ffe6' : '#fff');

                        let payActionsHtml = '';
                        if (isCleared) {
                            payActionsHtml = `<span style="color: #666; font-weight: bold; font-style: italic;">Completed</span>`;
                        } else if (!isCompleted) {
                            payActionsHtml = `
                                <button class="hw-insert-payment" data-id="${hoboId}" data-amount="${p.amount || ''}" data-desc="${p.description || ''}" data-topic="${topic}" data-index="${pIndex}" style="cursor:pointer; background:#e6f3ff; border:1px solid #99c2ff; border-radius:3px; padding:3px 8px; margin-right:6px;">Insert</button>
                                <button class="hw-complete-payment" data-topic="${topic}" data-index="${pIndex}" style="cursor:pointer; background:#e6ffe6; border:1px solid #66cc66; border-radius:3px; padding:3px 8px; margin-right:6px;">Done</button>
                                <button class="hw-remove-payment" data-topic="${topic}" data-index="${pIndex}" style="cursor:pointer; background:#ffe6e6; border:1px solid #ff9999; border-radius:3px; padding:3px 8px;">Remove</button>
                            `;
                        } else {
                            payActionsHtml = `
                                <span style="color: #00aa00; font-weight: bold; margin-right: 8px;">Loan Created ✅</span>
                                <button class="hw-select-loan" data-id="${hoboId}" data-amount="${p.amount || ''}" data-type="payment" data-topic="${topic}" data-index="${pIndex}" style="cursor:pointer; background:#fff2cc; border:1px solid #ffcc00; border-radius:3px; padding:3px 8px;">Select Loan</button>
                            `;
                        }

                        payHtml += `
                            <tr style="background: ${rowBg}; border-bottom: 1px solid #f0f0f0;">
                                <td style="padding: 5px; border: 1px solid #ececec;"><a href="game.php?sr=${this.getSr()}&cmd=player&ID=${hoboId}" target="_blank" style="color:#0055aa;text-decoration:none;">${hoboId}</a></td>
                                <td style="padding: 5px; border: 1px solid #ececec;">${hoboName}</td>
                                <td style="padding: 5px; border: 1px solid #ececec; font-family: monospace; font-size: 13px;">${p.amount || ''}</td>
                                <td style="padding: 5px; border: 1px solid #ececec;">${p.description || ''}</td>
                                <td style="padding: 5px; border: 1px solid #ececec; text-align: center; white-space: nowrap;">
                                    ${payActionsHtml}
                                </td>
                            </tr>
                        `;
                    });

                    payHtml += `
                                </tbody>
                            </table>
                        </div>
                    `;
                    payDiv.innerHTML = payHtml;
                    item.appendChild(payDiv);
                }

                listContainer.appendChild(item);
            });

            panel.appendChild(listContainer);
        }

        container.insertBefore(panel, container.firstChild);

        // Bind events
        panel.querySelectorAll('input[id^="amt-"]').forEach(input => {
            input.addEventListener('input', (e) => {
                const ctrlId = e.target.id.replace('amt-', '');
                const hasValue = e.target.value.trim() !== '';
                
                const exportRepliersBtn = panel.querySelector(`.hw-export-repliers[data-ctrl="${ctrlId}"]`);
                if (exportRepliersBtn) {
                    exportRepliersBtn.disabled = !hasValue;
                    exportRepliersBtn.style.opacity = hasValue ? '1' : '0.5';
                    exportRepliersBtn.style.cursor = hasValue ? 'pointer' : 'not-allowed';
                }
                
                const exportTotalsBtn = panel.querySelector(`.hw-export-totals[data-ctrl="${ctrlId}"]`);
                if (exportTotalsBtn) {
                    exportTotalsBtn.disabled = !hasValue;
                    exportTotalsBtn.style.opacity = hasValue ? '1' : '0.5';
                    exportTotalsBtn.style.cursor = hasValue ? 'pointer' : 'not-allowed';
                }

                // Update dynamic total
                const topicSpan = panel.querySelector('#total-amt-' + ctrlId);
                if (topicSpan) {
                    const topicBtn = exportTotalsBtn || exportRepliersBtn;
                    if (topicBtn) {
                        const topicStr = topicBtn.getAttribute('data-topic');
                        const d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                        const topicPayments = d[topicStr]?.paymentsToHobos || [];
                        const topicHobos = d[topicStr]?.hobos || [];

                        let totalNow = 0;
                        topicPayments.forEach(p => {
                            const amtParts = String(p.amount || '').replace(/[^0-9]/g, '');
                            totalNow += parseInt(amtParts, 10) || 0;
                        });

                        if (topicHobos.length > 0) {
                            const newBulkVal = e.target.value.replace(/[^0-9]/g, '');
                            const parsedBulk = parseInt(newBulkVal, 10) || 0;
                            totalNow += (topicHobos.length * parsedBulk);
                        }

                        topicSpan.innerText = totalNow > 0 ? '$' + totalNow.toLocaleString() : '$0';
                    }
                }
            });
        });

        const clearAllBtn = panel.querySelector('#hw-clear-all-gang-posts');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                if (confirm('Are you absolutely sure you want to clear all saved gang posts and payment data? This cannot be undone.')) {
                    localStorage.removeItem('hw_helper_gang_posts');
                    window.location.reload();
                }
            });
        }

        const deleteBtns = panel.querySelectorAll('.hw-delete-topic');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTopic = e.target.getAttribute('data-topic');
                if (confirm(`Remove saved data for topic "${targetTopic}"?`)) {
                    let d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                    delete d[targetTopic];
                    localStorage.setItem('hw_helper_gang_posts', JSON.stringify(d));

                    // re-render by reloading
                    window.location.reload();
                }
            });
        });

        panel.querySelectorAll('.hw-topic-bank').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const topic = e.target.getAttribute('data-topic');
                let d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                if (d[topic]) {
                    d[topic].bankAccount = e.target.value;
                    localStorage.setItem('hw_helper_gang_posts', JSON.stringify(d));
                }
            });
        });

        panel.querySelectorAll('.hw-save-bulk-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                const ctrlId = e.target.getAttribute('data-ctrl');
                const bulkAmtInput = document.getElementById('amt-' + ctrlId);
                const bulkMemoInput = document.getElementById('memo-' + ctrlId);
                
                let d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                if (d[topic]) {
                    d[topic].bulkAmount = bulkAmtInput ? bulkAmtInput.value : '';
                    d[topic].bulkMemo = bulkMemoInput ? bulkMemoInput.value.substring(0, 60) : '';
                    localStorage.setItem('hw_helper_gang_posts', JSON.stringify(d));
                    
                    const oldText = e.target.innerText;
                    e.target.innerText = 'Saved!';
                    setTimeout(() => { e.target.innerText = oldText; }, 2000);
                }
            });
        });

        const insertBtns = panel.querySelectorAll('.hw-insert-payment');
        insertBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                const index = parseInt(e.target.getAttribute('data-index'), 10);
                sessionStorage.setItem('hw_helper_pending_loan', JSON.stringify({topic, index, type: 'payment'}));

                const hoboField = document.getElementById('hobo');
                const amtField = document.getElementById('addAmt');
                const memoField = document.querySelector('input[name="l_memo"]');
                const bankField = document.getElementById('banks');

                if (hoboField) hoboField.value = e.target.getAttribute('data-id');
                if (amtField) amtField.value = e.target.getAttribute('data-amount').replace(/[^0-9.]/g, ''); // strip non-numeric just in case
                if (memoField) memoField.value = e.target.getAttribute('data-desc').substring(0, 60);

                let d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                if (bankField && d[topic] && d[topic].bankAccount) {
                    bankField.value = d[topic].bankAccount;
                }

                e.target.innerText = 'Inserted';
                window.scrollTo(0, document.body.scrollHeight);
            });
        });

        const removePaymentBtns = panel.querySelectorAll('.hw-remove-payment');
        removePaymentBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                const index = parseInt(e.target.getAttribute('data-index'), 10);

                let d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                if (d[topic] && d[topic].paymentsToHobos) {
                    d[topic].paymentsToHobos.splice(index, 1);
                    localStorage.setItem('hw_helper_gang_posts', JSON.stringify(d));
                    window.location.reload();
                }
            });
        });

        const completePaymentBtns = panel.querySelectorAll('.hw-complete-payment');
        completePaymentBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                const index = parseInt(e.target.getAttribute('data-index'), 10);

                let d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                if (d[topic] && d[topic].paymentsToHobos) {
                    d[topic].paymentsToHobos[index].completed = !d[topic].paymentsToHobos[index].completed;
                    localStorage.setItem('hw_helper_gang_posts', JSON.stringify(d));
                    window.location.reload();
                }
            });
        });

        // BIND BULK REPLIERS EVENTS
        panel.querySelectorAll('.hw-insert-bulk').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                const index = parseInt(e.target.getAttribute('data-index'), 10);
                sessionStorage.setItem('hw_helper_pending_loan', JSON.stringify({topic, index, type: 'bulk'}));

                const ctrlId = e.target.getAttribute('data-ctrl');
                const bulkAmtInput = document.getElementById('amt-' + ctrlId);
                const bulkMemoInput = document.getElementById('memo-' + ctrlId);
                
                const hoboField = document.getElementById('hobo');
                const amtField = document.getElementById('addAmt');
                const memoField = document.querySelector('input[name="l_memo"]');
                const bankField = document.getElementById('banks');

                if (hoboField) hoboField.value = e.target.getAttribute('data-id');
                if (amtField && bulkAmtInput) amtField.value = bulkAmtInput.value.replace(/[^0-9]/g, '');
                if (memoField && bulkMemoInput) memoField.value = bulkMemoInput.value.substring(0, 60);

                let d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                if (bankField && d[topic] && d[topic].bankAccount) {
                    bankField.value = d[topic].bankAccount;
                }

                e.target.innerText = 'Inserted';
                window.scrollTo(0, document.body.scrollHeight);
            });
        });

        panel.querySelectorAll('.hw-complete-bulk').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                const index = parseInt(e.target.getAttribute('data-index'), 10);

                let d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                if (d[topic] && d[topic].hobos) {
                    d[topic].hobos[index].completed = true;
                    localStorage.setItem('hw_helper_gang_posts', JSON.stringify(d));
                    window.location.reload();
                }
            });
        });

        panel.querySelectorAll('.hw-remove-bulk').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                const index = parseInt(e.target.getAttribute('data-index'), 10);

                let d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                if (d[topic] && d[topic].hobos) {
                    d[topic].hobos.splice(index, 1);
                    localStorage.setItem('hw_helper_gang_posts', JSON.stringify(d));
                    window.location.reload();
                }
            });
        });

        // BIND EXPORTS
        const copyToCb = (text, btn) => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(() => {
                    const oldText = btn.innerText;
                    btn.innerText = 'Copied!';
                    setTimeout(() => { btn.innerText = oldText; }, 2000);
                }).catch(err => {
                    console.error("Clipboard export failed", err);
                    alert("Clipboard export failed. Here is your text:\n\n" + text);
                });
            } else {
                // Fallback for older browsers or insecure contexts
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                try {
                    document.execCommand('copy');
                    const oldText = btn.innerText;
                    btn.innerText = 'Copied!';
                    setTimeout(() => { btn.innerText = oldText; }, 2000);
                } catch (e) {
                    alert("Clipboard export failed. Here is your text:\n\n" + text);
                }
                document.body.removeChild(ta);
            }
        };

        panel.querySelectorAll('.hw-export-repliers').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                const ctrlId = e.target.getAttribute('data-ctrl');
                const d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                const hobos = d[topic]?.hobos || [];
                
                const bulkInput = document.getElementById('amt-' + ctrlId);
                const memoInput = document.getElementById('memo-' + ctrlId);
                
                const amtRaw = bulkInput ? bulkInput.value.replace(/[^0-9]/g, '') : '';
                const bulkAmt = parseInt(amtRaw, 10) || 0;
                const formattedAmt = bulkAmt > 0 ? bulkAmt.toLocaleString() : '0';
                
                const memoStr = memoInput && memoInput.value.trim() ? memoInput.value.trim() : 'No description';

                const dateStr = typeof Utils !== 'undefined' && Utils.getFormattedHoboDateTime ? Utils.getFormattedHoboDateTime() : 'Unknown Date';

                let hoboTotals = {};
                hobos.forEach(h => {
                    if (!hoboTotals[h.id]) hoboTotals[h.id] = 0;
                    hoboTotals[h.id] += bulkAmt;
                });

                let parts = Object.keys(hoboTotals).map(id => {
                    const totalForHobo = hoboTotals[id];
                    const formatted = totalForHobo > 0 ? totalForHobo.toLocaleString() : '0';
                    return `${dateStr} - [hoboname=${id}] - ${memoStr} - $${formatted}`;
                });

                copyToCb(parts.join('\n'), e.target);
            });
        });

        panel.querySelectorAll('.hw-export-payments').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                const d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                const payments = d[topic]?.paymentsToHobos || [];
                
                const dateStr = typeof Utils !== 'undefined' && Utils.getFormattedHoboDateTime ? Utils.getFormattedHoboDateTime() : 'Unknown Date';

                let parts = payments.map(p => {
                    const amtParts = String(p.amount || '').replace(/[^0-9]/g, '');
                    const amtInt = parseInt(amtParts, 10) || 0;
                    const formatted = amtInt > 0 ? amtInt.toLocaleString() : '0';
                    return `${dateStr} - [hoboname=${p.hoboId || p.id}] - ${p.description || 'No description'} - $${formatted}`;
                });
                
                copyToCb(parts.join('\n'), e.target);
            });
        });

        panel.querySelectorAll('.hw-export-totals').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topic = e.target.getAttribute('data-topic');
                const ctrlId = e.target.getAttribute('data-ctrl');
                const d = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                const payments = d[topic]?.paymentsToHobos || [];
                const hobos = d[topic]?.hobos || [];

                const dateStr = typeof Utils !== 'undefined' && Utils.getFormattedHoboDateTime ? Utils.getFormattedHoboDateTime() : 'Unknown Date';

                let totalAmt = 0;
                payments.forEach(p => {
                    const amtParts = String(p.amount || '').replace(/[^0-9]/g, '');
                    totalAmt += parseInt(amtParts, 10) || 0;
                });

                if (hobos.length > 0) {
                    const bulkInput = document.getElementById('amt-' + ctrlId);
                    const amtRaw = bulkInput ? bulkInput.value.replace(/[^0-9]/g, '') : (d[topic]?.bulkAmount || '').replace(/[^0-9]/g, '');
                    const bulkAmt = parseInt(amtRaw, 10) || 0;
                    totalAmt += (hobos.length * bulkAmt);
                }

                const formatted = totalAmt > 0 ? totalAmt.toLocaleString() : '0';
                const text = `${dateStr} - ${topic} - $${formatted}`;

                copyToCb(text, e.target);
            });
        });

        // BIND SELECT LOAN
        panel.querySelectorAll('.hw-select-loan').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const hoboId = e.target.getAttribute('data-id');
                let amount = '';
                if (e.target.getAttribute('data-type') === 'bulk') {
                    const ctrlId = e.target.getAttribute('data-ctrl');
                    const bulkInput = document.getElementById('amt-' + ctrlId);
                    if (bulkInput) amount = bulkInput.value;
                } else {
                    amount = e.target.getAttribute('data-amount');
                }

                const tables = document.querySelectorAll('table[cellspacing="1"]');
                const lastTable = tables[tables.length - 1]; // The loans table is the last one
                if (!lastTable) return;

                const rows = lastTable.querySelectorAll('tr');
                let bestMatchId = null;
                const cleanTargetAmt = String(amount).replace(/[^0-9]/g, '');

                for (let row of rows) {
                    const link = row.querySelector(`a[href*="cmd=player&ID=${hoboId}"]`);
                    if (link) {
                        const toggle = row.querySelector('a.toggle[data-target^="td#td_"]');
                        if (toggle) {
                            const loanIdMatch = toggle.getAttribute('data-target').match(/td_(\d+)/);
                            if (loanIdMatch) {
                                const loanId = loanIdMatch[1];
                                const tds = row.querySelectorAll('td');
                                if (tds.length >= 3 && cleanTargetAmt) {
                                    // Parse only the text before a slash to avoid merging with limits
                                    const cellAmtText = tds[2].innerText.split('/')[0];
                                    const cleanRowAmt = cellAmtText.replace(/[^0-9]/g, '');

                                    if (cleanRowAmt === cleanTargetAmt) {
                                        bestMatchId = loanId;
                                        break;
                                    }
                                }
                                if (!bestMatchId) bestMatchId = loanId;
                            }
                        }
                    }
                }

                if (bestMatchId) {
                    const select = document.getElementById('clearLoan') || document.querySelector('select[name="ID"]');
                    if (select) {
                        select.value = bestMatchId;
                        window.scrollTo(0, select.offsetTop - 100);
                        const oldText = e.target.innerText;
                        e.target.innerText = 'Selected!';
                        setTimeout(() => { e.target.innerText = oldText; }, 2000);

                        const topic = e.target.getAttribute('data-topic');
                        const index = parseInt(e.target.getAttribute('data-index'), 10);
                        const type = e.target.getAttribute('data-type');
                        sessionStorage.setItem('hw_helper_selected_loan_for_clear', JSON.stringify({id: bestMatchId, topic, index, type}));
                    } else {
                        alert('Clear Loan dropdown not found.');
                    }
                } else {
                    alert('Could not locate a matching loan in the table.');
                }
            });
        });

        // BIND CLEAR LOAN SUBMISSION
        const clearForm = document.querySelector('form[action*="do=loan_del"]');
        if (clearForm) {
            clearForm.addEventListener('submit', () => {
                const select = clearForm.querySelector('select[name="ID"]');
                if (select) {
                    const val = select.value;
                    const storedStr = sessionStorage.getItem('hw_helper_selected_loan_for_clear');
                    if (storedStr) {
                        const stored = JSON.parse(storedStr);
                        if (stored.id === val) {
                            sessionStorage.setItem('hw_helper_pending_clear', JSON.stringify({topic: stored.topic, index: stored.index, type: stored.type}));
                        }
                    }
                }
            });
        }

    },

    getSr: function() {
        const match = window.location.search.match(/sr=(\d+)/);
        return match ? match[1] : '';
    }
};






























