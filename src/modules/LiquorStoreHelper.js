const LiquorStoreHelper = {
            init: function() {
                if (window.location.href.includes('cmd=liquor_store')) {
                    try {
                        const contentArea = document.querySelector('.content-area') || document.body;
                        const spans = contentArea.querySelectorAll('span');
                        let purchasedItem = null;
                        let purchasedAmount = 0;
                        
                        for (let i = 0; i < spans.length; i++) {
                            const span = spans[i];
                            if (span.textContent.includes('You get') && span.querySelector('img')) {
                                const img = span.querySelector('img');
                                const itemName = img.title || img.alt;
                                
                                let amount = 1;
                                const amountMatch = span.textContent.match(/\(\s*(\d+)\s*\)/);
                                if (amountMatch) {
                                    amount = Utils.parseNumber(amountMatch[1]);
                                }
                                
                                if (itemName) {
                                    purchasedItem = itemName.replace(/&amp;/g, '&').trim();
                                    purchasedAmount = amount;
                                    break;
                                }
                            }
                        }

                        if (purchasedItem && purchasedAmount > 0) {
                            const shoppingListStr = localStorage.getItem('hobowarsDrinkShoppingList');
                            if (shoppingListStr) {
                                let shoppingList = JSON.parse(shoppingListStr);
                                if (shoppingList[purchasedItem]) {
                                    shoppingList[purchasedItem] -= purchasedAmount;
                                    if (shoppingList[purchasedItem] <= 0) {
                                        delete shoppingList[purchasedItem];
                                    }
                                    if (Object.keys(shoppingList).length === 0) {
                                        localStorage.removeItem('hobowarsDrinkShoppingList');
                                        localStorage.removeItem('hobowarsDrinkShoppingList_TargetDrink');
                                    } else {
                                        localStorage.setItem('hobowarsDrinkShoppingList', JSON.stringify(shoppingList));
                                    }
                                }
                            }
                        }
                    } catch (e) {
                        console.error('Error handling purchase check', e);
                    }

                    const shoppingListStr = localStorage.getItem('hobowarsDrinkShoppingList');
                    if (shoppingListStr) {
                        try {
                            const shoppingList = JSON.parse(shoppingListStr);
                            const items = Object.keys(shoppingList);
                            if (items.length > 0) {
                                const targetDrink = localStorage.getItem('hobowarsDrinkShoppingList_TargetDrink');
                                const titleText = targetDrink ? `🛍️ Mixer Shopping List - ${targetDrink}` : `🛍️ Mixer Shopping List`;

                                let contentHtml = `
                                    <div style="font-weight: bold; margin-bottom: 8px; font-size: 14px; display: flex; justify-content: space-between; align-items: center;">
                                        <span>${titleText}</span>
                                        <button id="clear-shopping-list" style="cursor: pointer; font-size: 11px; padding: 2px 6px;">Clear List</button>
                                    </div>
                                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                                        <tbody>`;
                                items.forEach(item => {
                                    contentHtml += `
                                        <tr style="border-bottom: 1px dotted #ccc;">
                                            <td style="padding: 4px 0;"><strong>${item}</strong></td>
                                            <td style="padding: 4px 0; text-align: right; color: #d9534f; font-weight: bold;">${shoppingList[item]} required</td>
                                        </tr>`;
                                });
                                contentHtml += `</tbody></table>`;

                                const listContainer = document.createElement('div');
                                listContainer.style.cssText = 'margin: 10px auto 15px auto; border: 1px solid #ccc; padding: 10px; background-color: #f9f9f9; width: 80%; display: block;';
                                listContainer.innerHTML = contentHtml;
                                
                                const contentArea = document.querySelector('.content-area') || document.body;
                                const firstTable = contentArea.querySelector('table.shop-list') || contentArea.querySelector('table[width="100%"]');
                                
                                if (firstTable) {
                                    firstTable.parentNode.insertBefore(listContainer, firstTable);
                                } else {
                                    contentArea.appendChild(listContainer);
                                }

                                document.getElementById('clear-shopping-list').addEventListener('click', function(e) {
                                    e.preventDefault();
                                    localStorage.removeItem('hobowarsDrinkShoppingList');
                                    localStorage.removeItem('hobowarsDrinkShoppingList_TargetDrink');
                                    listContainer.style.display = 'none';
                                });

                                // Highlight drinks in the shop that are on the shopping list
                                const costs = contentArea.querySelectorAll('.shopCost');
                                costs.forEach(costDiv => {
                                    const td = costDiv.parentElement;
                                    if (!td) return;

                                    const textContent = td.textContent.trim();
                                    let isMatch = false;
                                    for (let i = 0; i < items.length; i++) {
                                        if (textContent.startsWith(items[i])) {
                                            isMatch = true;
                                            break;
                                        }
                                    }

                                    if (isMatch) {
                                        const tr = td.closest('tr');
                                        if (tr) {
                                            const img = tr.querySelector('img.shopimg') || tr.querySelector('img');
                                            if (img && img.parentElement && img.parentElement.tagName === 'TD') {
                                                img.parentElement.style.backgroundColor = '#fff3cd';
                                                img.parentElement.style.borderRadius = '5px';
                                            } else {
                                                td.style.backgroundColor = '#fff3cd';
                                                td.style.borderRadius = '5px';
                                            }
                                        }
                                    }
                                });
                            }
                        } catch (e) {
                            console.error('Error parsing shopping list', e);
                        }
                    }
                }
            }
        }
