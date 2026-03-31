const MixerHelper = {
            init: function() {
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.get('cmd') === 'mixer') {
                    const makeManyInput = document.querySelector('input[name="make_many"]');
                    if (makeManyInput) {
                        const maxBtn = document.createElement('button');
                        maxBtn.textContent = 'Max';
                        maxBtn.style.marginLeft = '8px';
                        maxBtn.style.fontSize = '10px';
                        maxBtn.style.cursor = 'pointer';

                        maxBtn.onclick = function(e) {
                            e.preventDefault();

                            const form = document.getElementById('mixer');
                            if (!form) return;

                            const hiddenInputs = form.querySelectorAll('input[type="hidden"][name^="ingreds["]');
                            if (hiddenInputs.length === 0) return;

                            let maxCanMake = Infinity;

                            hiddenInputs.forEach(input => {
                                const id = input.value;
                                const amountEl = document.getElementById('amnt_' + id);
                                if (amountEl) {
                                    // The game subtracts 1 from the innerHTML amount when you add it to the mixer.
                                    // The true total inventory limit is the displayed amount + 1.
                                    const available = parseInt(amountEl.textContent, 10) + 1;
                                    if (!isNaN(available) && available < maxCanMake) {
                                        maxCanMake = available;
                                    }
                                }
                            });

                            if (maxCanMake !== Infinity) {
                                makeManyInput.value = maxCanMake.toString();
                            }
                        };

                        makeManyInput.parentNode.insertBefore(maxBtn, makeManyInput.nextSibling);
                    }

                    // --- Possible Drinks Helper ---
                    const mixAwayBtn = document.querySelector('input[value="Mix Away"]');
                    const myMixer = document.getElementById('myMixer');

                    if (mixAwayBtn && myMixer) {
                        // 1. Determine which drinks are unlocked by reading the Bartender Guide DOM
                        let unlockedDrinks = [];
                        const uTags = document.querySelectorAll('u');
                        let guideContainer = null;

                        uTags.forEach(u => {
                            if (u.textContent.includes('Bartender Guide')) {
                                // The <u> is inside a <div>, and the drinks are siblings to that <div> inside a <td>
                                guideContainer = u.closest('td');
                            }
                        });

                        if (guideContainer) {
                            // Any img with a title in the guide container is considered unlocked here
                            // even if it lacks an <a> tag (greyed out due to missing ingredients)
                            const unlockedImgs = guideContainer.querySelectorAll('img[title], img[alt]');
                            unlockedImgs.forEach(img => {
                                let name = img.title || img.alt;
                                if (name) {
                                    name = name.replace(/&amp;/g, '&').trim();
                                    // Make sure it's valid title and not empty
                                    if (name && !unlockedDrinks.includes(name)) {
                                        unlockedDrinks.push(name);
                                    }
                                }
                            });
                        }

                        // 2. Setup the UI container above 'Mix Away'
                        const possibleDrinksDiv = document.createElement('div');
                        possibleDrinksDiv.id = 'possible-drinks-helper';
                        possibleDrinksDiv.style.marginBottom = '5px';
                        possibleDrinksDiv.style.fontWeight = 'bold';
                        possibleDrinksDiv.style.fontSize = '13px';

                        mixAwayBtn.parentNode.insertBefore(possibleDrinksDiv, mixAwayBtn);

                        // 3. Update logic when ingredients change
                        const updatePossibleDrinks = () => {
                            const amtSpans = myMixer.querySelectorAll('span[id^="mix_amt_"]');
                            let currentIngredients = [];

                            amtSpans.forEach(span => {
                                let text = span.textContent.trim();
                                text = text.replace(/^\d+\s*x\s*/, '').trim();
                                if (text) {
                                    currentIngredients.push(text);
                                }
                            });

                            if (currentIngredients.length === 0) {
                                possibleDrinksDiv.innerHTML = '';
                                return;
                            }

                            const mixedDrinksData = Modules.DrinksData.drinks.mixed || [];
                            let possibleDrinkNames = [];

                            mixedDrinksData.forEach(drink => {
                                // Must be previously unlocked AND contain all current ingredients in its recipe
                                if (unlockedDrinks.includes(drink.name) && drink.ingredients && Array.isArray(drink.ingredients)) {
                                    let isPossible = currentIngredients.every(ing => drink.ingredients.includes(ing));
                                    if (isPossible) {
                                        possibleDrinkNames.push(drink.name);
                                    }
                                }
                            });

                            if (possibleDrinkNames.length > 0) {
                                possibleDrinksDiv.innerHTML = `<span style="color: #666;">Possible Drinks:</span> <span style="color: #000;">${possibleDrinkNames.join(', ')}</span><br><br>`;
                            } else {
                                possibleDrinksDiv.innerHTML = `<span style="color: #888; font-style: italic;">No unlocked drinks match these ingredients.</span><br><br>`;
                            }
                        };

                        // 4. Setup an observer to watch for additions/removals in the virtual mixer
                        const observer = new MutationObserver((mutations) => {
                            updatePossibleDrinks();
                            if (!window.isAutomatedMixerChange) {
                                window.lastClickedRecipe = null;
                            }
                            if (typeof window.updateShoppingList === 'function') {
                                window.updateShoppingList();
                            }
                        });
                        observer.observe(myMixer, { childList: true, subtree: true });

                        // Initial update on load
                        updatePossibleDrinks();

                        // Build map of items to IDs and counts
                        const inventoryMap = {};
                        document.querySelectorAll('div[id^="itemimg_"]').forEach(div => {
                            const b = div.querySelector('b[id^="amnt_"]');
                            const img = div.querySelector('img');
                            if (b && img) {
                                const idMatch = b.id.match(/amnt_(\d+)/);
                                if (idMatch) {
                                    const id = idMatch[1];
                                    let nameMatch = img.getAttribute('onmouseover')?.match(/ShowName\('([^']+)'\)/);
                                    if (nameMatch) {
                                        const name = nameMatch[1].replace(/&amp;/g, '&');
                                        inventoryMap[name] = id;
                                    }
                                }
                            }
                        });

                        if (guideContainer) {
                            // Find all gray icons (images not wrapped in an <a> tag)
                            const grayImgs = Array.from(guideContainer.querySelectorAll('img')).filter(img => img.parentElement.tagName.toLowerCase() !== 'a');
                            grayImgs.forEach(img => {
                                img.style.cursor = 'pointer';
                                img.onclick = function() {
                                    window.isAutomatedMixerChange = true;

                                    const drinkName = img.title || img.alt;
                                    const mixedDrinksData = Modules.DrinksData.drinks.mixed || [];
                                    const drink = mixedDrinksData.find(d => d.name === drinkName);

                                    window.lastClickedRecipe = drink;

                                    let scriptAdd = ["if (typeof deleteAll === 'function') deleteAll();"];

                                    if (drink && drink.ingredients) {
                                        drink.ingredients.forEach(ing => {
                                            const id = inventoryMap[ing];
                                            let available = false;
                                            if (id) {
                                                const amountEl = document.getElementById('amnt_' + id);
                                                if (amountEl) {
                                                    const amount = parseInt(amountEl.textContent, 10);
                                                    if (amount > 0) {
                                                        available = true;
                                                        scriptAdd.push(`if (typeof AddDrink === 'function') AddDrink(${id}, "${ing}");`);
                                                    }
                                                }
                                            }
                                        });
                                    }

                                    if (scriptAdd.length > 0) {
                                        const script = document.createElement('script');
                                        script.textContent = scriptAdd.join('\n');
                                        document.body.appendChild(script);
                                        script.remove();
                                    }

                                    setTimeout(() => { window.isAutomatedMixerChange = false; }, 100);
                                };
                            });

                            // Also clear tracking state when clicking a normal (colored) drink link
                            const normalLinks = guideContainer.querySelectorAll('a[href*="AddDrink"]');
                            normalLinks.forEach(link => {
                                link.addEventListener('click', () => {
                                    window.isAutomatedMixerChange = true;

                                    const img = link.querySelector('img');
                                    const drinkName = img ? (img.title || img.alt) : '';
                                    const mixedDrinksData = Modules.DrinksData.drinks.mixed || [];
                                    const drink = mixedDrinksData.find(d => d.name === drinkName);
                                    window.lastClickedRecipe = drink;

                                    setTimeout(() => { window.isAutomatedMixerChange = false; }, 100);
                                });
                            });
                        }

                        const startOverLink = document.querySelector('a[href$="cmd=mixer"]');
                        if (startOverLink) {
                            startOverLink.addEventListener('click', () => {
                                window.lastClickedRecipe = null;
                                if (typeof window.updateShoppingList === 'function') window.updateShoppingList();
                            });
                        }

                        // --- Shopping List Helper ---
                        const makeManyInput = document.querySelector('input[name="make_many"]');
                        if (mixAwayBtn && makeManyInput) {
                            const shoppingListContainer = document.createElement('div');
                            shoppingListContainer.id = 'shopping-list-container';
                            shoppingListContainer.style.marginBottom = '15px';
                            shoppingListContainer.style.display = 'none';
                            shoppingListContainer.innerHTML = `<div class="style1" style="font-weight:bold; margin-bottom:5px;"><u>Shopping List:</u></div>
                                                               <div id="shopping_list_items" style="font-size: 13px; color:#555; text-align: left; display: inline-block;"></div>`;

                            // Insert above "Mix Away" button
                            mixAwayBtn.parentNode.insertBefore(shoppingListContainer, mixAwayBtn);

                            const shoppingListContent = shoppingListContainer.querySelector('#shopping_list_items');

                            window.updateShoppingList = function() {
                                let ingredientsNeeded = [];

                                if (window.lastClickedRecipe && window.lastClickedRecipe.ingredients) {
                                    ingredientsNeeded = window.lastClickedRecipe.ingredients;
                                } else {
                                    // Extract from items currently in mixer
                                    const amtSpans = myMixer.querySelectorAll('span[id^="mix_amt_"]');
                                    amtSpans.forEach(span => {
                                        let text = span.textContent.trim();
                                        text = text.replace(/^\d+\s*x\s*/, '').trim();
                                        if (text && !ingredientsNeeded.includes(text)) {
                                            ingredientsNeeded.push(text);
                                        }
                                    });
                                }

                                let makeMany = parseInt(makeManyInput.value, 10);
                                if (isNaN(makeMany) || makeMany < 1) makeMany = 1;

                                let missingTableRows = [];
                                let totalFixed = 0;

                                ingredientsNeeded.forEach(ingName => {
                                    const id = inventoryMap[ingName];
                                    let hasCount = 0;

                                    if (id) {
                                        const amountEl = document.getElementById('amnt_' + id);
                                        if (amountEl) {
                                            hasCount = parseInt(amountEl.textContent, 10);
                                            if (document.getElementById('mix_amt_' + id)) {
                                                hasCount += 1;
                                            }
                                        }
                                    }

                                    const neededAmount = makeMany - hasCount;
                                    if (neededAmount > 0) {
                                        const allDrinks = [
                                            ...(Modules.DrinksData.drinks.alcoholic || []),
                                            ...(Modules.DrinksData.drinks.non_alcoholic || [])
                                        ];
                                        const baseDrink = allDrinks.find(d => d.name === ingName);

                                        let itemCostStr = '';

                                        if (baseDrink && baseDrink.cost) {
                                            let hasDiscount = false;
                                            
                                            if (baseDrink.cost.type === 'cw_multiplier') {
                                                const costVal = baseDrink.cost.value * neededAmount;
                                                const cwPrice = Helpers.getCWPrice();
                                                let dollarCost = Math.round(costVal * cwPrice);
                                                
                                                if (baseDrink.location === 'Liquor Store') {
                                                    dollarCost = Math.round(dollarCost * 0.9);
                                                    hasDiscount = true;
                                                }

                                                totalFixed += dollarCost;
                                                itemCostStr = `$${dollarCost.toLocaleString()}${hasDiscount ? '*' : ''}`;
                                            } else if (baseDrink.cost.type === 'fixed' && typeof baseDrink.cost.value === 'number') {
                                                let costVal = baseDrink.cost.value * neededAmount;
                                                
                                                if (baseDrink.location === 'Liquor Store') {
                                                    costVal = Math.round(costVal * 0.9);
                                                    hasDiscount = true;
                                                }

                                                totalFixed += costVal;
                                                itemCostStr = `$${costVal.toLocaleString()}${hasDiscount ? '*' : ''}`;
                                            } else if (baseDrink.cost.type === 'fixed' && typeof baseDrink.cost.value === 'string') {
                                                itemCostStr = `${neededAmount}x ${baseDrink.cost.value}`;
                                            }
                                        }

                                        missingTableRows.push(`
                                            <tr>
                                                <td style="padding: 2px 8px 2px 0;"><span style="color:#d9534f; font-weight:bold;">✗</span></td>
                                                <td style="padding: 2px 15px 2px 0; color:#000;">${neededAmount} x ${ingName} <span style="color:#888; font-size:11px;">(Have: ${hasCount})</span></td>
                                                <td style="padding: 2px 0; color:#666; text-align: right; white-space: nowrap;">${itemCostStr}</td>
                                            </tr>
                                        `);
                                    }
                                });

                                if (missingTableRows.length > 0 && ingredientsNeeded.length > 0) {
                                    let listHtml = `<table style="border-collapse: collapse; font-size: 13px; min-width: 200px;">${missingTableRows.join('')}</table>`;
                                    
                                    if (totalFixed > 0) {
                                        listHtml += `<div style="margin-top: 5px; font-weight: bold; color: #333; border-top: 1px dashed #ccc; padding-top: 3px;">Estimated Cost: <span style="color:red;">$${totalFixed.toLocaleString()}</span> <span id="bank-btn-container"></span></div>`;
                                        listHtml += `<div style="margin-top: 2px; font-size: 10px; color: #888;">* 10% Bartender's Guide discount applied</div>`;
                                    }

                                    shoppingListContent.innerHTML = listHtml;
                                    shoppingListContainer.style.display = 'block';

                                    const bankBtnContainer = document.getElementById('bank-btn-container');
                                    if (bankBtnContainer) {
                                        const bankBtn = Helpers.createBankButton('Drink Ingredients', totalFixed);
                                        bankBtn.addEventListener('click', function() {
                                            let saveObj = {};
                                            ingredientsNeeded.forEach(ingName => {
                                                const id = inventoryMap[ingName];
                                                let hasCount = 0;
                                                if (id) {
                                                    const amountEl = document.getElementById('amnt_' + id);
                                                    if (amountEl) {
                                                        hasCount = parseInt(amountEl.textContent, 10);
                                                        if (document.getElementById('mix_amt_' + id)) {
                                                            hasCount += 1;
                                                        }
                                                    }
                                                }
                                                const neededAmount = makeMany - hasCount;
                                                if (neededAmount > 0) {
                                                    saveObj[ingName] = neededAmount;
                                                }
                                            });

                                            localStorage.setItem('hobowarsDrinkShoppingList', JSON.stringify(saveObj));
                                            if (window.lastClickedRecipe && window.lastClickedRecipe.name) {
                                                localStorage.setItem('hobowarsDrinkShoppingList_TargetDrink', window.lastClickedRecipe.name);
                                            } else {
                                                localStorage.removeItem('hobowarsDrinkShoppingList_TargetDrink');
                                            }
                                        });
                                        bankBtnContainer.appendChild(bankBtn);
                                    }
                                } else {
                                    shoppingListContent.innerHTML = '';
                                    shoppingListContainer.style.display = 'none';
                                }
                            };

                            makeManyInput.addEventListener('input', () => {
                                if (typeof window.updateShoppingList === 'function') window.updateShoppingList();
                            });
                        }
                    }
                }
            }
        }
