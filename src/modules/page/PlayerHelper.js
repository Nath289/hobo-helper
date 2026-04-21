const PlayerHelper = {
    cmds: 'player',
    staff: false,
    settings: [
        { key: 'PlayerHelper_CopyHoboName', label: 'Show Copy [hoboname] Link' }
    ],
    init: function() {
        const settings = Utils.getSettings();
        if (settings['PlayerHelper_CopyHoboName'] !== false) {
            this.addCopyHoboNameLink();
        }
    },

    addCopyHoboNameLink: function() {
        // Find the "Citizen Information" section
        const citizenB = Array.from(document.querySelectorAll('b')).find(el => el.textContent.trim() === 'Citizen Information:');
        if (!citizenB) return;

        const container = citizenB.closest('div');
        if (!container) return;

        // Find the player's name link inside that container
        const playerLink = container.querySelector('a[href*="cmd=player&ID="]');
        if (!playerLink) return;

        const match = playerLink.href.match(/ID=(\d+)/i);
        if (!match) return;
        const hoboId = match[1];

        // The text node containing ` (107380)` usually comes right after the <a> tag
        let insertAfterNode = playerLink;
        if (playerLink.nextSibling && playerLink.nextSibling.nodeType === 3) {
            insertAfterNode = playerLink.nextSibling;
        }

        const existingLinkCopy = document.querySelector('img.linkcopy');
        const imgSrc = (existingLinkCopy && existingLinkCopy.src)
            ? existingLinkCopy.src
            : 'data:image/webp;base64,UklGRswAAABXRUJQVlA4TMAAAAAvDYABAK/BoJEkRRk6hjf1/kX9i1DQRpIay9IzmXoFbSSpsSw9k6mf/zq8/weApCRse95jm20kSUISACQlAQBJpRRJkCQJSZIAAABJktgmyZyTbQCQRFLv3a8YYwDAtiRI+oreu1IKAEgiSRIwDACwaHRGtm27iP7Hf9de6h6Xl3r1/b9pcO5dkKz7EKRvay4OZqHBsFOZrW/PD2rGPkfPbPuZOlkAEgKBNanZzqOyiFU9LsqI799GhSK7WVME3T4=';

        const copyImg = document.createElement('img');
        copyImg.src = imgSrc;
        copyImg.style.cursor = 'pointer';
        copyImg.title = `Copy [hoboname=${hoboId}]`;
        copyImg.className = 'tooltip';
        copyImg.id = `copy-hobo-${hoboId}-${Math.random().toString(36).substring(2,8)}`;
        copyImg.style.verticalAlign = 'middle';
        copyImg.style.marginLeft = '4px';

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

        // Insert exactly after the hobo ID text node (or the link if text node isn't found)
        insertAfterNode.parentNode.insertBefore(copyImg, insertAfterNode.nextSibling);

        // Bind the native tipTip plugin to our new image
        if (typeof jQuery !== 'undefined' && jQuery.fn.tipTip) {
            setTimeout(() => {
                jQuery('#' + copyImg.id).tipTip({delay: 10, edgeOffset: 12});
            }, 10);
        }
    }
};
