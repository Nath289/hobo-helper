const FoodBankHelper = {
    cmds: 'food_bank',
    staff: false,
    settings: [
        {
            key: 'FoodBankHelper_enabled',
            label: 'Enable Food Bank Helper',
            default: true,
            description: 'Improves the layout of the food bank making it easier to select, freeze, and unfreeze foods.'
        }
    ],

    init: function() {
        const settings = Utils.getSettings();
        if (settings?.FoodBankHelper_enabled === false) return;

        this.formatTables();
    },

    formatTables: function() {
        this.buildTable('unfreeze_food', 'checkMe2', 'checkAll2', 'Unfreeze');
        this.buildTable('freeze_food', 'checkMe', 'checkAll', 'Freeze');
    },

    buildTable: function(formId, checkboxClass, checkAllId, actionName) {
        const form = document.getElementById(formId);
        if (!form) return;

        // Prevent running multiple times
        if (form.hasAttribute('data-fbh-table-injected')) return;
        form.setAttribute('data-fbh-table-injected', 'true');

        const checkboxes = Array.from(form.querySelectorAll(`input.${checkboxClass}`));
        if (checkboxes.length === 0) return;

        const table = document.createElement('table');
        table.style.width = 'auto';
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '10px';
        table.style.marginBottom = '10px';

        const tbody = document.createElement('tbody');
        table.appendChild(tbody);

        // Track where the first checkbox was to insert the table there
        const anchorNode = checkboxes[0];

        checkboxes.forEach((cb, index) => {
            const tr = document.createElement('tr');
            tr.style.borderBottom = '1px solid #ddd';
            const baseBg = index % 2 === 0 ? '#f9f9f9' : '#fff';
            tr.style.backgroundColor = baseBg;

            const updateHighlight = () => {
                if (cb.checked) {
                    tr.style.backgroundColor = '#e0e0e0';
                } else {
                    tr.style.backgroundColor = baseBg;
                }
            };
            cb.addEventListener('change', updateHighlight);

            const td1 = document.createElement('td');
            td1.style.padding = '8px 5px';
            td1.style.width = '30px';
            td1.style.textAlign = 'center';

            const td2 = document.createElement('td');
            td2.style.padding = '8px 5px';

            const td3 = document.createElement('td');
            td3.style.padding = '8px 5px';
            td3.style.textAlign = 'right';

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);

            // Collect all siblings until the next <br>
            let curr = cb.nextSibling;
            let nodeBatch = [];
            while (curr) {
                if (curr.nodeType === 1 && (curr.classList.contains(checkboxClass) || curr.id === checkAllId)) {
                    break;
                }
                const isBr = curr.nodeType === 1 && curr.tagName === 'BR';
                nodeBatch.push(curr);
                curr = curr.nextSibling;
                if (isBr) break;
            }

            td1.appendChild(cb);

            nodeBatch.forEach(node => {
                if (node.nodeType === 1 && node.tagName === 'A' && node.textContent.trim() === actionName) {
                    node.classList.add('btn');
                    node.style.userSelect = 'none';
                    node.style.webkitUserSelect = 'none';
                    td3.appendChild(node);
                } else if (node.nodeType === 3) {
                    // Process text nodes to remove brackets around action link
                    let text = node.textContent;
                    if (text.includes('[')) text = text.replace(/\[\s*$/, '');
                    if (text.includes(']')) text = text.replace(/^\s*\]/, '');
                    node.textContent = text;
                    if (text.trim() !== '') {
                        td2.appendChild(node);
                    } else if (node.parentNode) {
                        node.parentNode.removeChild(node);
                    }
                } else if (node.nodeType === 1 && node.tagName === 'BR') {
                    // Drop internal BRs that separate rows
                    if (node.parentNode) {
                        node.parentNode.removeChild(node);
                    }
                } else {
                    td2.appendChild(node);
                }
            });

            tbody.appendChild(tr);
        });

        if (anchorNode && anchorNode.parentNode === form) {
            form.insertBefore(table, anchorNode);
        } else {
            form.insertBefore(table, form.firstChild);
        }

        // Style the Check All button to contain the checkbox
        const checkAll = document.getElementById(checkAllId);
        
        let actualSpan = null;
        if (checkAll) {
            let next = checkAll.nextSibling;
            while(next) {
                if (next.nodeType === 1 && next.tagName === 'SPAN') {
                    actualSpan = next;
                    break;
                } else if (next.nodeType === 3 && next.textContent.trim().toLowerCase().includes('check all')) {
                    // wrap it manually
                    actualSpan = document.createElement('span');
                    actualSpan.textContent = next.textContent;
                    next.parentNode.replaceChild(actualSpan, next);
                    break;
                }
                next = next.nextSibling;
            }
        }

        if (checkAll && actualSpan && !checkAll.hasAttribute('data-fbh-styled')) {
            checkAll.setAttribute('data-fbh-styled', 'true');

            const btnLabel = document.createElement('label');
            btnLabel.className = 'btn';
            btnLabel.style.display = 'inline-flex';
            btnLabel.style.alignItems = 'center';
            btnLabel.style.cursor = 'pointer';
            btnLabel.style.userSelect = 'none';
            btnLabel.style.webkitUserSelect = 'none';
            btnLabel.style.marginRight = '10px';

            checkAll.style.margin = '0 5px 0 0';
            checkAll.style.cursor = 'pointer';

            // Insert label before the checkbox
            checkAll.parentNode.insertBefore(btnLabel, checkAll);

            // Move checkbox and span into the label
            btnLabel.appendChild(checkAll);
            btnLabel.appendChild(actualSpan);

            // Fix the game's duplicate ID bug that updates the wrong toggle text
            actualSpan.removeAttribute('id');
            checkAll.removeAttribute('id');
            
            checkAll.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                actualSpan.textContent = isChecked ? "Uncheck all" : "Check all";
                checkboxes.forEach(cb => {
                    cb.checked = isChecked;
                    cb.dispatchEvent(new Event('change'));
                });
            });

            // Remove previous <br> elements before checkAll if they exist
            let prevNode = btnLabel.previousSibling;
            while (prevNode) {
                if (prevNode.nodeType === 1 && prevNode.tagName === 'BR') {
                    const toDel = prevNode;
                    prevNode = prevNode.previousSibling;
                    toDel.parentNode.removeChild(toDel);
                } else if (prevNode.nodeType === 3 && prevNode.textContent.trim() === '') {
                    const toDel = prevNode;
                    prevNode = prevNode.previousSibling;
                    toDel.parentNode.removeChild(toDel);
                } else {
                    break;
                }
            }
        }

        // Trigger change on checkboxes to set initial state correctly
        checkboxes.forEach(cb => {
            const ev = new Event('change');
            cb.dispatchEvent(ev);
        });
    }
};
