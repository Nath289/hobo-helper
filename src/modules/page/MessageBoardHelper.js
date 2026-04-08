const MessageBoardHelper = {
    settings: [
        { key: 'MessageBoardHelper_CtrlEnter', label: 'Ctrl+Enter to Post' },
        { key: 'MessageBoardHelper_VoteButtons', label: 'Larger Vote Buttons' },
        {
            key: 'MessageBoardHelper_AddPaidMessageTemplate',
            label: 'Add Paid Message Text',
            type: 'text',
            defaultValue: '[hoboname={hoboId}][hex=777777][i]edit: [b]PAID[/b][/i][/hex]',
            width: '100%',
            description: 'Available variables: {hoboname}, {hoboId}, {date}'
        }
    ],
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
        
        if (settings?.MessageBoardHelper_VoteButtons !== false) {
            this.enhanceVoteButtons();
            this.fixVoteTooltipBug();
        }
    },

    enhanceVoteButtons: function() {
        const voteSpans = document.querySelectorAll('span[id^="vote-"]');
        voteSpans.forEach(span => {
            const upLink = span.querySelector('a[title="Vote Up"]');
            const downLink = span.querySelector('a[title="Vote Down"]');

            if (upLink && !upLink.hasAttribute('data-enhanced')) {
                this.convertVoteLinkToButton(upLink, 'Vote Up');
            }
            if (downLink && !downLink.hasAttribute('data-enhanced')) {
                this.convertVoteLinkToButton(downLink, 'Vote Down');
            }
        });
    },

    fixVoteTooltipBug: function() {
        // The game's original votelinker script permanently erases the tooltip class and hover bindings when you vote
        // This injects a fixed version of that function to ensure the tooltip works after voting
        const script = document.createElement('script');
        script.textContent = `
            if (typeof window.votelinker === 'function' && !window.votelinker_fixed) {
                window.votelinker = function(id, post_id, type, curvote) {
                    var link = window.ulink + "&post=" + post_id + "&do=vote&type=" + type;
                    $.get(link, function() {
                        $("#vote-" + id).html('');
                        type = type * 1;
                        if (type === 1) { curvote++; } else { curvote--; }
                        $("#votecountwrapper-" + id).hide();
                        
                        let color = "gray";
                        let displayVote = curvote > 0 ? "+" + curvote : curvote;
                        if (curvote > 0) color = "green";
                        else if (curvote < 0) color = "red";
                        
                        $("#votecountwrapper-" + id).html('<span class="tooltip" id="votecount-' + id + '" title="Loading..."><font color="' + color + '">' + displayVote + '</font></span>');
                        $("#votecountwrapper-" + id).fadeIn();
                        
                        if (typeof $.fn.tipTip !== "undefined") {
                            setTimeout(function() {
                                // Initialize the new element immediately to absorb "Loading..." just like page load
                                $("#votecount-" + id).tipTip({delay: 10, edgeOffset: 12, maxWidth: 400});
                                
                                // Re-bind the click/hover event that fetches the exact vote info
                                $("#votecount-" + id).on("hover click", function() {
                                    this.style.cursor = 'help';
                                    var t_id = this.id.replace("votecount-", "");
                                    $.get("../game/vote_info.php", { id: t_id, vc: "0" }, function(data) {
                                        jQuery('#tiptip_content').html(data);
                                        $("#votecount-" + t_id).tipTip({ delay: 10, edgeOffset: 12 });
                                    });
                                });
                            }, 5);
                        }
                    });
                };
                window.votelinker_fixed = true;
            }
        `;
        document.body.appendChild(script);
    },

    convertVoteLinkToButton: function(link, text) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.title = link.title || text;
        btn.setAttribute('data-enhanced', 'true');
        btn.style.cssText = 'cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 5px; margin: 0 4px; padding: 4px 8px; font-size: 11px; font-weight: bold; background: #f0f0f0; border: 1px solid #ccc; border-radius: 4px; color: #333; user-select: none; -webkit-user-select: none; text-decoration: none;';
        
        if (link.hasAttribute('onclick')) {
            btn.setAttribute('onclick', link.getAttribute('onclick'));
        }
        
        const img = link.querySelector('img');
        if (img) {
            const imgClone = img.cloneNode(true);
            imgClone.style.opacity = '1'; 
            btn.appendChild(imgClone);
        }
        
        const txtSpan = document.createElement('span');
        txtSpan.textContent = text;
        btn.appendChild(txtSpan);
        
        link.parentNode.replaceChild(btn, link);
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

        this.addPaidMessageButton(messageArea, settings);
    },

    addPaidMessageButton: function(messageArea, settings) {
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
            const hoboName = Utils.getHoboName() || 'Unknown';
            const hoboId = Utils.getHoboId() || 'Unknown';
            const dateStr = Utils.getFormattedHoboDateTime ? Utils.getFormattedHoboDateTime() : new Date().toLocaleDateString();

            let rawTemplate = settings?.MessageBoardHelper_AddPaidMessageTemplate;
            if (rawTemplate === undefined || rawTemplate === null) {
                rawTemplate = '[hoboname={hoboId}][hex=777777][i]edit: [b]PAID[/b][/i][/hex]';
            }

            const appendText = '\n\n' + String(rawTemplate)
                .replace(/{hoboname}/gi, hoboName)
                .replace(/{hoboId}/gi, hoboId)
                .replace(/{date}/gi, dateStr);

            messageArea.value += appendText;
            messageArea.focus();
        });

        parentDiv.appendChild(btn);
    },

    initGangPostFeatures: function(settings) {
        let topicName = '';
        const titleEl = document.getElementById('thread-topic');
        if (titleEl) {
            topicName = titleEl.textContent.trim();
        } else {
            const pageText = document.body.innerText || "";
            const breadcrumbMatch = pageText.match(/Board Selection\s*\/\s*Gang Board\s*\/\s*Topic:\s*(.*)/i);
            if (!breadcrumbMatch) return;
            topicName = breadcrumbMatch[1].split(/(\[Page:|Jump to Bottom|Gang:)/)[0].trim();
        }

        // Check if the user is Gang Staff
        const topOps = document.getElementById('topOps');
        const isGangStaff = topOps && (topOps.querySelector('a[title="Toggle Lock"]') || topOps.querySelector('a[title="Delete"]'));

        if (!isGangStaff) return;

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
            
            const hoboMap = new Map();
            let isFirstPost = true;
            
            const posts = document.querySelectorAll('tr[id^="tr_post_"]');

            posts.forEach(post => {
                if (isFirstPost) {
                    isFirstPost = false; // Skip the original topic post
                    return;
                }

                const firstTd = post.querySelector('td');
                if (!firstTd) return;

                const link = firstTd.querySelector('a[href*="cmd=player&ID="]');
                if (!link) return;

                const nameNode = link.querySelector('.player-name') || link;
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

                const initSaved = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                const isAlreadyAdded = (initSaved[topicName] && initSaved[topicName].paymentsToHobos)
                    ? initSaved[topicName].paymentsToHobos.some(p => String(p.postId) === String(postId))
                    : false;

                if (isAlreadyAdded) {
                    btn.value = 'Added ✅';
                    btn.style.backgroundColor = '#d4edda';
                    btn.style.borderColor = '#c3e6cb';
                }

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
                    const amountRegex = /(?:\$([\d,]+(?:\.\d+)?)\s*(k|m|mil|mill|million)?\b)|(?:([\d,]+(?:\.\d+)?)\s*(k|m|mil|mill|million)\b)/gi;

                    let dollarMatch = null;
                    let match;
                    while ((match = amountRegex.exec(messageText)) !== null) {
                        dollarMatch = match;
                    }

                    if (dollarMatch) {
                        let amountStr = dollarMatch[1] || dollarMatch[3];
                        let multStr = (dollarMatch[2] || dollarMatch[4] || "").toLowerCase();
                        let num = parseFloat(amountStr.replace(/,/g, ''));
                        if (['m', 'mil', 'mill', 'million'].includes(multStr)) {
                            num *= 1000000;
                        } else if (multStr === 'k') {
                            num *= 1000;
                        }
                        parsedAmount = '$' + Math.round(num).toLocaleString();
                    }

                    const savedPostsCheck = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                    const existingPayments = (savedPostsCheck[topicName] && savedPostsCheck[topicName].paymentsToHobos) ? savedPostsCheck[topicName].paymentsToHobos : [];
                    const existingPayment = existingPayments.find(p => String(p.postId) === String(postId));

                    let panel = document.getElementById('payment-panel-' + postId);
                    if (panel) {
                        panel.style.display = 'block';
                        document.getElementById(`pay-name-${postId}`).value = existingPayment ? existingPayment.hoboName : hoboName;
                        document.getElementById(`pay-id-${postId}`).value = existingPayment ? existingPayment.hoboId : hoboId;
                        document.getElementById(`pay-desc-${postId}`).value = existingPayment ? existingPayment.description : '';
                        document.getElementById(`pay-amt-${postId}`).value = existingPayment ? existingPayment.amount : parsedAmount;
                        document.getElementById(`pay-remove-${postId}`).style.display = existingPayment ? 'inline-block' : 'none';
                        document.getElementById(`pay-save-${postId}`).innerText = existingPayment ? 'Update' : 'Save';
                        return;
                    }

                    secondTd.style.position = 'relative';

                    const initName = existingPayment ? existingPayment.hoboName : hoboName;
                    const initId = existingPayment ? existingPayment.hoboId : hoboId;
                    const initDesc = existingPayment ? existingPayment.description : '';
                    const initAmt = existingPayment ? existingPayment.amount : parsedAmount;

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
                            <input type="text" id="pay-name-${postId}" value="${initName}" style="width:140px; font-size:11px;" />
                        </div>
                        <div style="margin-bottom:5px;">
                            <label style="display:inline-block; width:80px; font-weight:bold;">Hobo ID:</label>
                            <input type="text" id="pay-id-${postId}" value="${initId}" style="width:140px; font-size:11px;" />
                        </div>
                        <div style="margin-bottom:5px;">
                            <label style="display:inline-block; width:80px; font-weight:bold;">Description:</label>
                            <input type="text" id="pay-desc-${postId}" value="${initDesc}" style="width:140px; font-size:11px;" />
                        </div>
                        <div style="margin-bottom:10px;">
                            <label style="display:inline-block; width:80px; font-weight:bold;">Amount:</label>
                            <input type="text" id="pay-amt-${postId}" value="${initAmt}" style="width:140px; font-size:11px;" />
                        </div>
                        <div style="text-align:right;">
                            <button type="button" id="pay-remove-${postId}" style="cursor:pointer; font-weight:bold; margin-right:5px; padding:2px 8px; background:#fcc; border:1px solid #c88; border-radius:3px; display:${existingPayment ? 'inline-block' : 'none'};">Remove</button>
                            <button type="button" id="pay-save-${postId}" style="cursor:pointer; font-weight:bold; margin-right:5px; padding:2px 8px; background:#eee; border:1px solid #aaa; border-radius:3px;">${existingPayment ? 'Update' : 'Save'}</button>
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

                        const existingIdx = savedPosts[topicName].paymentsToHobos.findIndex(p => String(p.postId) === String(postId));
                        const newPaymentObj = {
                            postId: postId,
                            hoboName: hoboNameVal,
                            hoboId: hoboIdVal,
                            description: descVal,
                            amount: amtVal,
                            timestamp: Date.now()
                        };

                        if (existingIdx !== -1) {
                            const prev = savedPosts[topicName].paymentsToHobos[existingIdx];
                            newPaymentObj.completed = prev.completed;
                            newPaymentObj.cleared = prev.cleared;
                            savedPosts[topicName].paymentsToHobos[existingIdx] = newPaymentObj;
                        } else {
                            savedPosts[topicName].paymentsToHobos.push(newPaymentObj);
                        }

                        localStorage.setItem('hw_helper_gang_posts', JSON.stringify(savedPosts));

                        document.getElementById(`pay-remove-${postId}`).style.display = 'inline-block';

                        // Visual feedback
                        btn.value = 'Added ✅';
                        btn.style.backgroundColor = '#d4edda';
                        btn.style.borderColor = '#c3e6cb';

                        panel.style.display = 'none';
                    });

                    document.getElementById('pay-remove-' + postId).addEventListener('click', () => {
                        const savedPosts = JSON.parse(localStorage.getItem('hw_helper_gang_posts') || '{}');
                        if (savedPosts[topicName] && savedPosts[topicName].paymentsToHobos) {
                            const existingIdx = savedPosts[topicName].paymentsToHobos.findIndex(p => String(p.postId) === String(postId));
                            if (existingIdx !== -1) {
                                savedPosts[topicName].paymentsToHobos.splice(existingIdx, 1);
                                localStorage.setItem('hw_helper_gang_posts', JSON.stringify(savedPosts));
                            }
                        }

                        btn.value = 'Add Payment';
                        btn.style.backgroundColor = '';
                        btn.style.borderColor = '';
                        document.getElementById(`pay-name-${postId}`).value = hoboName;
                        document.getElementById(`pay-id-${postId}`).value = hoboId;
                        document.getElementById(`pay-desc-${postId}`).value = '';
                        document.getElementById(`pay-amt-${postId}`).value = parsedAmount;
                        document.getElementById(`pay-remove-${postId}`).style.display = 'none';

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
