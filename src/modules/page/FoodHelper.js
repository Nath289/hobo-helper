const FoodHelper = {
    cmds: ['food', ''],
    staff: false,
    init: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const cmd = urlParams.get('cmd') || '';

        if (cmd === 'food') {
            this.observeFood();
        } else if (cmd === '') {
            this.observeLivingArea();
        }
    },

    observeLivingArea: function() {
        // Run once in case it's already there
        this.observeFood();

        // In the Living Area, the food content is loaded via AJAX when the tab is clicked.
        // We will watch for the user clicking the food tab and strictly trigger our observer then.
        const foodTabLink = document.querySelector('a[rel="food"]');
        if (foodTabLink) {
            foodTabLink.addEventListener('click', () => {
                if (this._foodObserverAdded) return;
                this._foodObserverAdded = true;

                setTimeout(() => {
                    this.observeFood();
                }, 50);
            });
        }
    },

    observeFood: function() {
        const bindButtons = () => {
            const throwBtn = document.getElementById('throw');
            if (throwBtn && !throwBtn.hasAttribute('data-fh-injected')) {
                throwBtn.setAttribute('data-fh-injected', 'true');

                // inject "Select Crap" and "Mark as Crap" buttons next to the throw button
                const btnMark = document.createElement('input');
                btnMark.type = 'button';
                btnMark.value = 'Mark as Crap';
                btnMark.style.marginLeft = '10px';
                btnMark.onclick = (e) => {
                    e.preventDefault();
                    this.markAsCrap(e.target);
                };

                const btnSelect = document.createElement('input');
                btnSelect.type = 'button';
                btnSelect.value = 'Select Crap';
                btnSelect.style.marginLeft = '10px';
                btnSelect.onclick = (e) => {
                    e.preventDefault();
                    this.selectCrap();
                };

                // Insert after throwBtn (in reverse order because we rely on nextSibling)
                throwBtn.parentNode.insertBefore(btnMark, throwBtn.nextSibling);
                throwBtn.parentNode.insertBefore(btnSelect, throwBtn.nextSibling);
            }

            // Convert food list into a table
            this.buildFoodTable();
            
            // Reapply table check on mutations where DOM gets re-written (e.g., Living Area reload)
            const form = document.getElementById('throw_food');
            if (form && !form.hasAttribute('data-fh-table-injected')) {
                this.buildFoodTable();
            }
        };

        let rafId = null;
        const observer = new MutationObserver(() => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(bindButtons);
        });

        // The UI might be inside a #foodTab container (living area), a #food_table, or the main document body
        const targetNode = document.getElementById('foodTab') || document.body;
        if (targetNode) {
            observer.observe(targetNode, { childList: true, subtree: true });
        }

        // Initial run
        bindButtons();
    },

    getFoodNameFromCheckbox: function(checkbox) {
        // The food name is usually in the title of the image within the next <a> element
        // In the table format, it's inside td2 which is next padding sibling or child.
        // It's safer to just look inside the row.
        const tr = checkbox.closest('tr');
        if (tr) {
            const link = tr.querySelector('td:nth-child(2) a');
            if (link) {
                const img = link.querySelector('img');
                if (img && img.title) return img.title.trim();
                return link.textContent.trim();
            }
        }

        // Fallback for before table conversion or if structure differs
        const nextLink = checkbox.nextElementSibling;
        if (nextLink && nextLink.tagName === 'A') {
            const img = nextLink.querySelector('img');
            if (img && img.title) {
                return img.title.trim();
            }
            return nextLink.textContent.trim();
        }
        return null;
    },

    buildFoodTable: function() {
        const form = document.getElementById('throw_food');
        if (!form) return;
        
        // Prevent running multiple times
        if (form.hasAttribute('data-fh-table-injected')) return;
        form.setAttribute('data-fh-table-injected', 'true');

        const checkboxes = Array.from(form.querySelectorAll('input.checkMe'));
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
                if (curr.nodeType === 1 && (curr.classList.contains('checkMe') || curr.id === 'checkAll')) {
                    break;
                }
                const isBr = curr.nodeType === 1 && curr.tagName === 'BR';
                nodeBatch.push(curr);
                curr = curr.nextSibling;
                if (isBr) break;
            }

            td1.appendChild(cb);
            
            nodeBatch.forEach(node => {
                if (node.nodeType === 1 && node.tagName === 'A' && node.textContent.trim() === 'Consume') {
                    node.classList.add('btn');
                    node.style.userSelect = 'none';
                    node.style.webkitUserSelect = 'none';
                    td3.appendChild(node);
                } else if (node.nodeType === 3) {
                    // Process text nodes to remove brackets around Consume
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
        const checkAll = document.getElementById('checkAll');
        const toggleSpan = document.getElementById('toggleSpan');
        if (checkAll && toggleSpan && !checkAll.hasAttribute('data-fh-styled')) {
            checkAll.setAttribute('data-fh-styled', 'true');

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
            btnLabel.appendChild(toggleSpan);

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
    },

    selectCrap: function() {
        const crapList = JSON.parse(localStorage.getItem('hw_helper_food_crap') || '[]');
        const checkboxes = document.querySelectorAll('.checkMe');

        checkboxes.forEach(cb => {
            const foodName = this.getFoodNameFromCheckbox(cb);
            if (foodName && crapList.includes(foodName)) {
                cb.checked = true;
            } else {
                cb.checked = false;
            }
        });
    },

    markAsCrap: function(btn) {
        const checkboxes = document.querySelectorAll('.checkMe');
        let crapList = JSON.parse(localStorage.getItem('hw_helper_food_crap') || '[]');

        // Track the desired state of foods currently visible on the page
        const presentFoods = {};

        checkboxes.forEach(cb => {
            const foodName = this.getFoodNameFromCheckbox(cb);
            if (foodName) {
                if (cb.checked) {
                    presentFoods[foodName] = true; // At least one is checked, keep it
                } else if (presentFoods[foodName] === undefined) {
                    presentFoods[foodName] = false; // Seen but not checked (yet)
                }
            }
        });

        // Update the crapList based on the visible foods' states
        Object.keys(presentFoods).forEach(foodName => {
            if (presentFoods[foodName]) {
                if (!crapList.includes(foodName)) {
                    crapList.push(foodName);
                }
            } else {
                crapList = crapList.filter(name => name !== foodName);
            }
        });

        localStorage.setItem('hw_helper_food_crap', JSON.stringify(crapList));
        if (btn) {
            btn.value = `Γ Updated Crap!`;
            setTimeout(() => { btn.value = 'Mark as Crap'; }, 3000);
        }

        // Reselect crap items after marking
        this.selectCrap();
    },
};
