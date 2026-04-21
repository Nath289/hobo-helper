const MessageBoardHelper = {
    cmds: 'gathering',
    staff: false,
    settings: [
        { key: 'MessageBoardHelper_CtrlEnter', label: 'Ctrl+Enter to Post' },
        { key: 'MessageBoardHelper_RenderTables', label: 'Render Data Tables in Posts' },
        { key: 'MessageBoardHelper_VoteButtons', label: 'Larger Vote Buttons' },
        { key: 'MessageBoardHelper_CopyHoboName', label: 'Show Copy [hoboname] Link' },
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

        const settings = Utils.getSettings();
        if (settings?.MessageBoardHelper?.enabled === false) return;

        this.initMessageBoardFeatures(settings);
    },

    initMessageBoardFeatures: function(settings) {
        this.enhanceMessageEditor(settings);
        
        if (settings?.MessageBoardHelper_RenderTables !== false) {
            this.parseTablesInPosts();
        }

        if (settings?.MessageBoardHelper_VoteButtons !== false) {
            this.enhanceVoteButtons();
            this.fixVoteTooltipBug();
        }

        if (settings?.MessageBoardHelper_CopyHoboName !== false) {
            this.addCopyHoboNameLinks();
        }
    },

    addCopyHoboNameLinks: function() {
        const tds = document.querySelectorAll('td[bgcolor="#EEEEEE"]');

        // Grab the native linkcopy image if available to use the same asset
        const existingLinkCopy = document.querySelector('img.linkcopy');
        const imgSrc = (existingLinkCopy && existingLinkCopy.src)
            ? existingLinkCopy.src
            : 'data:image/webp;base64,UklGRswAAABXRUJQVlA4TMAAAAAvDYABAK/BoJEkRRk6hjf1/kX9i1DQRpIay9IzmXoFbSSpsSw9k6mf/zq8/weApCRse95jm20kSUISACQlAQBJpRRJkCQJSZIAAABJktgmyZyTbQCQRFLv3a8YYwDAtiRI+oreu1IKAEgiSRIwDACwaHRGtm27iP7Hf9de6h6Xl3r1/b9pcO5dkKz7EKRvay4OZqHBsFOZrW/PD2rGPkfPbPuZOlkAEgKBNanZzqOyiFU9LsqI799GhSK7WVME3T4=';

        tds.forEach(td => {
            Array.from(td.childNodes).some(node => {
                if (node.nodeType === 3) {
                    const match = node.nodeValue.match(/ID:\s*(\d+)/i);
                    if (match) {
                        const hoboId = match[1];

                        const textBefore = node.nodeValue.substring(0, match.index);
                        const matchedText = match[0];
                        const textAfter = node.nodeValue.substring(match.index + matchedText.length);

                        const wrapper = document.createElement('span');
                        wrapper.style.display = 'inline-flex';
                        wrapper.style.alignItems = 'center';
                        wrapper.style.gap = '4px';

                        wrapper.appendChild(document.createTextNode(matchedText));

                        const copyImg = document.createElement('img');
                        copyImg.src = imgSrc;
                        copyImg.style.cursor = 'pointer';
                        copyImg.title = `Copy [hoboname=${hoboId}]`;
                        copyImg.className = 'tooltip';
                        copyImg.id = `copy-hobo-${hoboId}-${Math.random().toString(36).substring(2,8)}`;
                        copyImg.style.verticalAlign = 'middle';

                        copyImg.addEventListener('click', (e) => {
                            e.preventDefault();
                            const textToCopy = `[hoboname=${hoboId}]`;

                            if (navigator.clipboard) {
                                navigator.clipboard.writeText(textToCopy).catch(err => {
                                    prompt("Copy to clipboard: Ctrl+C, Enter", textToCopy);
                                });
                            } else {
                                prompt("Copy to clipboard: Ctrl+C, Enter", textToCopy);
                            }

                            const oldTitle = copyImg.title;
                            copyImg.title = 'Copied!';
                            copyImg.style.filter = 'brightness(0.5) sepia(1) hue-rotate(90deg) saturate(3)';

                            const tipContent = document.getElementById('tiptip_content');
                            if (tipContent) {
                                tipContent.innerHTML = '<span style="color:#4caf50;font-weight:bold;">Copied!</span>';
                            }

                            setTimeout(() => {
                                copyImg.title = oldTitle;
                                copyImg.style.filter = '';
                                if (tipContent && tipContent.textContent === 'Copied!') {
                                    tipContent.innerHTML = oldTitle;
                                }
                            }, 1000);
                        });

                        wrapper.appendChild(copyImg);

                        const fragment = document.createDocumentFragment();
                        if (textBefore) fragment.appendChild(document.createTextNode(textBefore));
                        fragment.appendChild(wrapper);
                        if (textAfter) fragment.appendChild(document.createTextNode(textAfter));

                        td.replaceChild(fragment, node);

                        // Bind the native tipTip plugin to our new image
                        if (typeof jQuery !== 'undefined' && jQuery.fn.tipTip) {
                            // setTimeout ensures element is in DOM
                            setTimeout(() => {
                                jQuery('#' + copyImg.id).tipTip({delay: 10, edgeOffset: 12});
                            }, 10);
                        }

                        return true;
                    }
                }
                return false;
            });
        });
    },

    parseTablesInPosts: function() {
        const posts = document.querySelectorAll('span[id^="post-content-"]');
        posts.forEach(post => {
            let html = post.innerHTML;
            if (!html.includes('[hobo-helper-table]')) return;

            const tableRegex = /\[hobo-helper-table\]([\s\S]*?)\[\/hobo-helper-table\]/gi;

            html = html.replace(tableRegex, (match, content) => {
                let lines = content.replace(/<br\s*\/?>/gi, '\n').split('\n').filter(l => l.trim() !== '');

                let tableHtml = '<table class="hobo-helper-rendered-table" style="border-collapse: collapse; width: 100%; border: 1px solid #ccc; margin: 10px 0; font-size: 11px;">';

                let rowIndex = 0;

                lines.forEach(line => {
                    line = line.trim();
                    if (!line) return;

                    let headerMatch = line.match(/^\[header\](.*)\[\/header\]$/i);
                    let footerMatch = line.match(/^\[footer\](.*)\[\/footer\]$/i);

                    if (headerMatch) {
                        tableHtml += '<tr>';
                        headerMatch[1].split(',').forEach(cell => {
                            tableHtml += `<th style="border: 1px solid #ccc; padding: 4px; background: #eee; font-weight: bold; text-align: center;">${cell.trim()}</th>`;
                        });
                        tableHtml += '</tr>';
                    } else if (footerMatch) {
                        tableHtml += '<tr>';
                        footerMatch[1].split(',').forEach(cell => {
                            tableHtml += `<td style="border: 1px solid #ccc; padding: 4px; background: #f9f9f9; font-weight: bold;">${cell.trim()}</td>`;
                        });
                        tableHtml += '</tr>';
                    } else {
                        let bg = rowIndex % 2 === 0 ? '' : '#f5f5f5';
                        tableHtml += `<tr style="background-color: ${bg};">`;
                        line.split(',').forEach(cell => {
                            tableHtml += `<td style="border: 1px solid #ccc; padding: 4px;">${cell.trim()}</td>`;
                        });
                        tableHtml += '</tr>';
                        rowIndex++;
                    }
                });

                tableHtml += '</table>';
                return tableHtml;
            });
            post.innerHTML = html;
        });
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

        this.addHoboNameFormatButton();
        this.addPaidMessageButton(messageArea, settings);
    },

    addHoboNameFormatButton: function() {
        const ddButton = document.getElementById('DDbutton');
        if (!ddButton) return;

        const img = document.createElement('img');
        img.className = 'sfw';
        img.title = 'hoboname embed';
        img.src = '../images/mb_icons/hobo.gif';
        img.setAttribute('onmouseover', "this.style.cursor='pointer'");
        img.setAttribute('onclick', "utml('[hoboname=', ']','')");
        img.setAttribute('border', '0');
        img.style.cursor = 'pointer';

        ddButton.parentNode.insertBefore(img, ddButton);
        ddButton.parentNode.insertBefore(document.createTextNode(' '), ddButton);
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
    }
};
