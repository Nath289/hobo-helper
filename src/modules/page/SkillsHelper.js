const SkillsHelper = {
    cmds: 'skills',
    settings: [
        { key: 'SkillsHelper_EnableMaxBuy', label: 'Enable Max Buy button for skill sets' },
        { key: 'SkillsHelper_MoveSkillShop', label: 'Move Skill Shop link to top' }
    ],
    init: function() {
        const settings = Utils.getSettings();

        if (settings['SkillsHelper_EnableMaxBuy'] !== false) {
            this.addMaxBuyButton();
        }

        if (settings['SkillsHelper_MoveSkillShop'] !== false) {
            this.moveSkillShopLink();
        }

        if (settings['DisplayHelper_WidenPage']) {
            this.widenSkillRepository();
        }

        this.moveSaveSkillSetControls();
        this.alignOrderAndUnequipButtons();

        this.styleActionButtons();
        this.moveTopUnequipButton();
        this.highlightEmptySkills();
    },
    moveTopUnequipButton: function() {
        const unequipBtns = Array.from(document.querySelectorAll('input[type="button"]')).filter(btn => btn.value === 'Unequip All');
        if (unequipBtns.length > 0) {
            const topUnequipBtn = unequipBtns[0]; // The one from the top Skill Sets list
            const saveSetBtn = document.querySelector('input[name="save_set"]');
            
            if (topUnequipBtn && saveSetBtn) {
                const saveSetForm = saveSetBtn.closest('form');
                if (saveSetForm && saveSetForm.parentNode) {
                    const wrapper = document.createElement('div');
                    wrapper.style.marginTop = '10px';
                    wrapper.appendChild(topUnequipBtn);
                    
                    // Insert right after the saveSetForm
                    saveSetForm.parentNode.insertBefore(wrapper, saveSetForm.nextSibling);
                    
                    // Clean up any stray <br> tags left behind where the Unquip All button used to be
                    // But we don't strictly need to, as it's just some extra spacing
                }
            }
        }
    },
    alignOrderAndUnequipButtons: function() {
        const setOrderBtn = document.querySelector('input[name="BAT"]');
        if (!setOrderBtn) return;

        setOrderBtn.className = 'btn';
        setOrderBtn.style.cssText = 'user-select: none; -webkit-user-select: none; margin: 4px 6px;';

        const form = setOrderBtn.closest('form');
        const unequipDiv = form ? form.querySelector('div[align="right"]') : null;

        if (unequipDiv) {
            unequipDiv.removeAttribute('align');

            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.justifyContent = 'space-between';
            wrapper.style.alignItems = 'center';
            wrapper.style.marginTop = '5px';

            form.insertBefore(wrapper, unequipDiv);
            wrapper.appendChild(setOrderBtn);
            wrapper.appendChild(unequipDiv);
        }
    },
    moveSaveSkillSetControls: function() {
        const setNameInput = document.querySelector('input[name="set_name"]');
        const saveSetBtn = document.querySelector('input[name="save_set"]');
        const skillsTable = document.getElementById('skills_table');

        if (setNameInput && saveSetBtn && skillsTable) {
            const originalForm = setNameInput.closest('form');
            if (!originalForm) return;

            const wrapperDiv = skillsTable.parentNode;
            const skillSetsHeader = Array.from(document.querySelectorAll('b')).find(b => b.textContent && b.textContent.includes('Skill Sets'));

            let insertTarget;
            let insertBefore;

            if (skillSetsHeader && skillSetsHeader.closest('td')) {
                // moveSkillShopLink executed, it's inside tdLeft
                insertTarget = skillSetsHeader.closest('td');
                insertBefore = null; // append to the end of tdLeft
            } else {
                // moveSkillShopLink did not execute, insert before the wrapperDiv
                insertTarget = wrapperDiv.parentNode;
                insertBefore = wrapperDiv;
            }

            // Clean up old <br> tags left behind in the original form
            let prev = setNameInput.previousSibling;
            while (prev && (prev.tagName === 'BR' || prev.nodeType === Node.TEXT_NODE)) {
                let toRemove = prev;
                prev = prev.previousSibling;
                toRemove.parentNode.removeChild(toRemove);
            }

            const newForm = document.createElement('form');
            newForm.method = 'POST';
            newForm.action = originalForm.action || window.location.href;

            if (insertBefore) {
                newForm.style.marginBottom = '10px';
            }

            newForm.appendChild(setNameInput);
            saveSetBtn.style.marginLeft = '5px';
            saveSetBtn.className = 'btn';
            newForm.appendChild(saveSetBtn);

            if (insertBefore) {
                insertTarget.insertBefore(newForm, insertBefore);
            } else {
                insertTarget.appendChild(newForm);
            }
        }
    },
    highlightEmptySkills: function() {
        const skillsTable = document.getElementById('skills_table');
        if (!skillsTable) return;

        const rows = skillsTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const amountSpan = row.querySelector('span[id^="skill_amnt_"]');
            if (amountSpan && amountSpan.textContent.trim() === '0') {
                row.style.backgroundColor = 'rgba(255, 200, 200, 0.3)';
            }
        });
    },
    styleActionButtons: function() {
        const actionLinks = document.querySelectorAll('a[href*="empty=true"], a[href*="remove="], a[href*="del_skill_set="], a[href*="&skill_set="]:not([href*="del_skill_set="])');
        actionLinks.forEach(link => {
            // Clean up the surrounding brackets
            if (link.previousSibling && link.previousSibling.nodeType === Node.TEXT_NODE && link.previousSibling.textContent.includes('[')) {
                link.previousSibling.textContent = link.previousSibling.textContent.replace('[', '').trim();
            }
            if (link.nextSibling && link.nextSibling.nodeType === Node.TEXT_NODE && link.nextSibling.textContent.includes(']')) {
                link.nextSibling.textContent = link.nextSibling.textContent.replace(']', '').trim();
            }

            if (link.href.includes('empty=true')) {
                const btn = document.createElement('input');
                btn.type = 'button';
                btn.value = link.textContent;
                btn.className = 'btn';
                btn.style.cssText = 'user-select: none; -webkit-user-select: none; margin: 4px 6px;';
                btn.onclick = (e) => { e.preventDefault(); window.location.href = link.href; };
                link.parentNode.replaceChild(btn, link);
            } else {
                link.className = 'btn';
                link.style.cssText = 'user-select: none; -webkit-user-select: none; text-decoration: none; padding: 6px 10px; font-size: 12px; display: inline-block; margin: 4px 6px;';

                if (link.href.includes('&skill_set=') && !link.href.includes('del_skill_set=')) {
                    link.style.minWidth = '120px';
                    link.style.textAlign = 'center';
                }
            }
        });
    },
    moveSkillShopLink: function() {
        const shopLink = document.querySelector('a[href*="cmd=skill_shop"]');
        const skillSetsHeader = Array.from(document.querySelectorAll('b')).find(b => b.textContent && b.textContent.includes('Skill Sets'));

        if (shopLink && skillSetsHeader) {
            // Find all nodes belonging to the Skill Sets list up to the next div
            let current = skillSetsHeader;
            let nodesToMove = [];
            while (current && current.tagName !== 'DIV') {
                nodesToMove.push(current);
                current = current.nextSibling;
            }

            if (nodesToMove.length > 0) {
                const parent = skillSetsHeader.parentNode;

                // Create a wrapper table
                const table = document.createElement('table');
                table.style.width = '100%';
                table.style.marginBottom = '20px';
                const tr = document.createElement('tr');
                const tdLeft = document.createElement('td');
                tdLeft.style.width = '50%';
                const tdRight = document.createElement('td');
                tdRight.style.width = '50%';
                tdRight.style.textAlign = 'center';
                tdRight.style.verticalAlign = 'middle';

                tr.appendChild(tdLeft);
                tr.appendChild(tdRight);
                table.appendChild(tr);

                // Insert the new layout table where the original header was
                parent.insertBefore(table, nodesToMove[0]);

                // Move the original Skill Sets list nodes into the left column
                nodesToMove.forEach(node => tdLeft.appendChild(node));

                // Build the custom Skill Shop button in the right column
                const btn = document.createElement('a');
                btn.href = shopLink.href;
                btn.textContent = 'Skill Shop';
                btn.className = 'btn';
                btn.style.cssText = 'user-select: none; -webkit-user-select: none; text-decoration: none; padding: 6px 16px; font-size: 13px;';

                tdRight.appendChild(btn);

                // Hide the original link
                const center = shopLink.closest('center');
                if (center) {
                    center.style.display = 'none';
                } else {
                    shopLink.style.display = 'none';
                }
            }
        }
    },
    widenSkillRepository: function() {
        const repoHeaders = Array.from(document.querySelectorAll('u')).filter(u => u.textContent.includes('Skill Repository'));
        if (repoHeaders.length > 0) {
            const repoTable = repoHeaders[0].closest('table');
            if (repoTable) {
                repoTable.style.width = '100%';
            }
        }
    },
    addMaxBuyButton: function() {
        const qtyInput = document.getElementById('qty');
        if (!qtyInput) return;

        const maxButton = document.createElement('input');
        maxButton.type = 'button';
        maxButton.value = 'Max';
        maxButton.className = 'btn';
        maxButton.style.cssText = 'user-select: none; -webkit-user-select: none; margin-left: 5px;';

        maxButton.addEventListener('click', (e) => {
            e.preventDefault();
            const tokens = Utils.getTokenBalance();
            const cost = parseInt(qtyInput.dataset.cost, 10) || 2200;
            if (cost > 0) {
                const maxAffordable = Math.floor(tokens / cost);
                const maxVal = Math.min(9999, maxAffordable);
                qtyInput.value = maxVal;
                // Trigger change event to update the cost text
                qtyInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        // Insert after qty input
        qtyInput.parentNode.insertBefore(maxButton, qtyInput.nextSibling);
    }
};
