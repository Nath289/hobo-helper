const MessageBoardHelper = {
    init: function() {
        if (!Utils.isCurrentPage('cmd=gathering')) return;

        const settings = Utils.getSettings();
        if (settings?.MessageBoardHelper?.enabled === false) return;

        this.initMessageBoardFeatures(settings);

        if (Utils.isCurrentPage('do=vpost')) {
            this.initGangPostFeatures(settings);
        }
    },

    initMessageBoardFeatures: function(settings) {
        this.enhanceMessageEditor(settings);
    },

    enhanceMessageEditor: function(settings) {
        const messageArea = document.querySelector('textarea[name="t_message"]');
        if (!messageArea) return;

        // Ctrl + Enter to submit
        if (settings?.MessageBoardHelper_CtrlEnter !== false) {
            messageArea.addEventListener('keydown', function(e) {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    const submitBtn = document.querySelector('input[type="submit"][name="button"]') ||
                                      document.querySelector('input[type="submit"][value*="Post"]');
                    if (submitBtn) {
                        e.preventDefault();
                        submitBtn.click();
                    }
                }
            });
        }

        this.addPaidMessageButton(messageArea);
    },

    addPaidMessageButton: function(messageArea) {
        const editButton = document.querySelector('input[type="submit"][value*="Edit Post"]');
        if (!editButton) return;

        const parentDiv = editButton.parentElement;
        if (!parentDiv) return;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = 'Add Paid Message';
        // Match existing button CSS
        btn.style.webkitFontSmoothing = 'antialiased';
        btn.style.color = '#636363';
        btn.style.background = '#ddd';
        btn.style.fontWeight = 'bold';
        btn.style.textDecoration = 'none';
        btn.style.padding = '5px 16px';
        btn.style.borderRadius = '3px';
        btn.style.border = '0';
        btn.style.cursor = 'pointer';
        btn.style.margin = '3px 2px';
        btn.style.webkitAppearance = 'none';
        btn.style.display = 'inline-block';
        
        btn.addEventListener('click', () => {
            const hoboName = Utils.getHoboName();
            const appendText = `\n\n[i]${hoboName} Edit: Paid[/i]`;

            messageArea.value += appendText;
            messageArea.focus();
        });

        parentDiv.appendChild(btn);
    },

    initGangPostFeatures: function(settings) {
        const pageText = document.body.innerText || "";
        // Check if we're on the Gang Board by looking at the page breadcrumb
        const breadcrumbMatch = pageText.match(/Board Selection\s*\/\s*Gang Board\s*\/\s*Topic:\s*(.*?)\s*(?:\[Page:\[Latest\]\n$|)/i);
        if (!breadcrumbMatch) return; // Not a Gang Board post or format didn't match

        // Check if the user is Gang Staff
        const topOps = document.getElementById('topOps');
        const isGangStaff = topOps && (topOps.querySelector('a[title="Toggle Lock"]') || topOps.querySelector('a[title="Delete"]'));

        if (!isGangStaff) return;

        const topicName = breadcrumbMatch[1].trim();

        this.addSaveRepliersButton(topicName);
        this.addPaymentButtons(topicName);
    },

    addSaveRepliersButton: function(topicName) {
        // Find "Now Viewing Topic & Replies" text nodes
        const headerNodes = Array.from(document.querySelectorAll('b, strong, th, td, div, font, span')).filter(el => el.textContent.trim() === 'Now Viewing Topic & Replies');
        if (headerNodes.length === 0) return;
        
        // Grab the deepest node to inject our button right above it
        const headerToInjectAbove = headerNodes[headerNodes.length - 1]; 
        const tableNode = headerToInjectAbove.closest('table');

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = '💾 Save Repliers List';
        btn.title = 'Collects the names of everyone who has replied to this post';
        btn.style.cssText = 'margin-bottom: 8px; padding: 5px 12px; cursor: pointer; font-weight: bold; background: #eee; border: 1px solid #aaa; border-radius: 3px; color: #333; font-family: Tahoma, sans-serif; font-size: 11px; display: block;';
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Only search inside the replies table to avoid grabbing the current logged-in user from the top nav
            const searchScope = tableNode || document;
            const playerLinks = Array.from(searchScope.querySelectorAll('a[href*="cmd=player&ID="]'));
            const hoboMap = new Map();
            
            let firstPostTr = null;

            playerLinks.forEach(link => {
                const nameNode = link.querySelector('.player-name') || link;
                if (!nameNode) return;

                const tr = link.closest('tr');
                if (!firstPostTr && tr) {
                    firstPostTr = tr; // The first row containing a player is the original topic post
                }

                // Skip any player links found within the original topic post
                if (tr && tr === firstPostTr) return;

                const idMatch = link.href.match(/ID=(\d+)/i);
                if (idMatch) {
                    const id = idMatch[1];
                    const name = nameNode.textContent.trim();
                    if (name && !hoboMap.has(id)) {
                        hoboMap.set(id, { id: id, name: name });
                    }
                }
            });
            
            const hoboList = Array.from(hoboMap.values());
            
            const savedPosts = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
            savedPosts[topicName] = { 
                timestamp: Date.now(),
                topic: topicName,
                totalHobos: hoboList.length,
                hobos: hoboList 
            };
            localStorage.setItem('hw_helper_gang_posts', JSON.stringify(savedPosts));
            
            console.log(`[Hobo Helper] Gathered gang replies for topic: "${topicName}"`, savedPosts[topicName]);
            
            btn.textContent = `✅ Saved ${hoboList.length} Unique Hobos!`;
            setTimeout(() => { btn.textContent = '💾 Save Repliers List'; }, 3000);
        });

        // Insert just above the header text's table container and replace preceding <br> tags
        if (tableNode) {
            // Traverse backwards to remove empty text nodes and <br> tags
            let prev = tableNode.previousSibling;
            while (prev && (prev.nodeName === 'BR' || (prev.nodeType === 3 && prev.nodeValue.trim() === ''))) {
                const toRemove = prev;
                prev = prev.previousSibling;
                toRemove.parentNode.removeChild(toRemove);
            }
            tableNode.parentNode.insertBefore(btn, tableNode);
        } else {
            headerToInjectAbove.parentNode.insertBefore(btn, headerToInjectAbove);
        }
    },

    addPaymentButtons: function(topicName) {
        const posts = document.querySelectorAll('tr[id^="tr_post_"]');
        posts.forEach(post => {
            const tds = post.querySelectorAll('td');
            if (tds.length >= 2) {
                const firstTd = tds[0];
                const secondTd = tds[1];
                const postId = post.id.replace('tr_post_', '');

                const btn = document.createElement('input');
                btn.type = 'button';
                btn.value = 'Add Payment';
                btn.style.display = 'block';
                btn.style.margin = '15px auto 5px auto';
                btn.style.fontSize = '12px';
                btn.style.padding = '4px 10px';
                btn.style.fontWeight = 'bold';
                btn.style.cursor = 'pointer';
                btn.setAttribute('data-post-id', postId);

                btn.addEventListener('click', () => {
                    const nameNode = firstTd.querySelector('.player-name') || firstTd.querySelector('a[href*="cmd=player"]');
                    const hoboName = nameNode ? nameNode.textContent.trim() : '';

                    let hoboId = '';
                    const playerLink = firstTd.querySelector('a[href*="cmd=player&ID="]');
                    if (playerLink) {
                        const idMatch = playerLink.href.match(/ID=(\d+)/i);
                        if (idMatch) hoboId = idMatch[1];
                    }
                    if (!hoboId) {
                        const idTextMatch = firstTd.innerText.match(/ID:\s*(\d+)/i);
                        if (idTextMatch) hoboId = idTextMatch[1];
                    }

                    let parsedAmount = '';
                    const messageText = secondTd.innerText || "";
                    const dollarMatch = messageText.match(/\$([\d,]+)/);
                    if (dollarMatch) {
                        parsedAmount = dollarMatch[1].replace(/,/g, '');
                    }

                    let panel = document.getElementById('payment-panel-' + postId);
                    if (panel) {
                        panel.style.display = 'block';
                        return;
                    }

                    secondTd.style.position = 'relative';

                    panel = document.createElement('div');
                    panel.id = 'payment-panel-' + postId;
                    panel.style.position = 'absolute';
                    panel.style.top = '10px';
                    panel.style.right = '-310px';
                    panel.style.width = '260px';
                    panel.style.backgroundColor = '#fdfdfd';
                    panel.style.border = '2px solid #555';
                    panel.style.padding = '10px';
                    panel.style.boxShadow = '2px 2px 8px rgba(0,0,0,0.2)';
                    panel.style.zIndex = '1000';
                    panel.style.fontFamily = 'Tahoma, sans-serif';
                    panel.style.fontSize = '12px';
                    panel.style.color = '#333';

                    panel.innerHTML = `
                        <div style="font-weight:bold; margin-bottom:10px; border-bottom:1px solid #ccc; padding-bottom:5px;">Add Payment</div>
                        <div style="margin-bottom:5px;">
                            <label style="display:inline-block; width:80px; font-weight:bold;">Hobo Name:</label>
                            <input type="text" id="pay-name-${postId}" value="${hoboName}" style="width:140px; font-size:11px;" />
                        </div>
                        <div style="margin-bottom:5px;">
                            <label style="display:inline-block; width:80px; font-weight:bold;">Hobo ID:</label>
                            <input type="text" id="pay-id-${postId}" value="${hoboId}" style="width:140px; font-size:11px;" />
                        </div>
                        <div style="margin-bottom:5px;">
                            <label style="display:inline-block; width:80px; font-weight:bold;">Description:</label>
                            <input type="text" id="pay-desc-${postId}" style="width:140px; font-size:11px;" />
                        </div>
                        <div style="margin-bottom:10px;">
                            <label style="display:inline-block; width:80px; font-weight:bold;">Amount:</label>
                            <input type="number" id="pay-amt-${postId}" value="${parsedAmount}" style="width:140px; font-size:11px;" />
                        </div>
                        <div style="text-align:right;">
                            <button type="button" id="pay-save-${postId}" style="cursor:pointer; font-weight:bold; margin-right:5px; padding:2px 8px; background:#eee; border:1px solid #aaa; border-radius:3px;">Save</button>
                            <button type="button" id="pay-cancel-${postId}" style="cursor:pointer; padding:2px 8px; background:#eee; border:1px solid #aaa; border-radius:3px;">Cancel</button>
                        </div>
                    `;

                    secondTd.appendChild(panel);

                    document.getElementById('pay-save-' + postId).addEventListener('click', () => {
                        const hoboNameVal = document.getElementById(`pay-name-${postId}`).value.trim();
                        const hoboIdVal = document.getElementById(`pay-id-${postId}`).value.trim();
                        const descVal = document.getElementById(`pay-desc-${postId}`).value.trim();
                        const amtVal = document.getElementById(`pay-amt-${postId}`).value.trim();

                        const savedPosts = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');

                        if (!savedPosts[topicName]) {
                            savedPosts[topicName] = {
                                timestamp: Date.now(),
                                topic: topicName,
                                totalHobos: 0,
                                hobos: []
                            };
                        }
                        if (!savedPosts[topicName].paymentsToHobos) {
                            savedPosts[topicName].paymentsToHobos = [];
                        }

                        savedPosts[topicName].paymentsToHobos.push({
                            postId: postId,
                            hoboName: hoboNameVal,
                            hoboId: hoboIdVal,
                            description: descVal,
                            amount: amtVal,
                            timestamp: Date.now()
                        });

                        localStorage.setItem('hw_helper_gang_posts', JSON.stringify(savedPosts));

                        // Visual feedback
                        btn.value = 'Added ✅';
                        btn.style.backgroundColor = '#d4edda';
                        btn.style.borderColor = '#c3e6cb';

                        panel.style.display = 'none';
                    });

                    document.getElementById('pay-cancel-' + postId).addEventListener('click', () => {
                        panel.style.display = 'none';
                    });
                });

                // Remove trailing <br> if it exists at the bottom of the td
                if (firstTd.lastElementChild && firstTd.lastElementChild.tagName === 'BR') {
                    firstTd.removeChild(firstTd.lastElementChild);
                }

                firstTd.appendChild(btn);
            }
        });
    }
};
