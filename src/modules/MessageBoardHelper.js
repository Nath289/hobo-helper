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
        if (settings?.MessageBoardHelper_SaveRepliers === false) return;

        const pageText = document.body.innerText || "";
        // Check if we're on the Gang Board by looking at the page breadcrumb
        const breadcrumbMatch = pageText.match(/Board Selection\s*\/\s*Gang Board\s*\/\s*Topic:\s*(.*?)\s*(?:\[Page:|\[Latest\]|\n|$)/i);
        if (!breadcrumbMatch) return; // Not a Gang Board post or format didn't match

        const topicName = breadcrumbMatch[1].trim();

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
    }
};
