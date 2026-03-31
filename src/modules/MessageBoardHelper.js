const MessageBoardHelper = {
    init: function() {
        if (!Utils.isCurrentPage('cmd=gathering')) return;

        this.initMessageBoardFeatures();
    },

    initMessageBoardFeatures: function() {
        // Basic setup for message board features based on settings
        const settings = Utils.getSettings();
        if (settings?.MessageBoardHelper?.enabled === false) return;

        this.enhanceMessageEditor();
    },

    enhanceMessageEditor: function() {
        const messageArea = document.querySelector('textarea[name="t_message"]');
        if (!messageArea) return;

        // Auto-focus the message area
        messageArea.focus();

        // Ctrl + Enter to submit
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
    }
};
