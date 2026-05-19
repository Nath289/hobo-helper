const MessageBoardSettingsHelper = {
    cmds: 'preferences',
    settings: [
        { key: 'MessageBoardSettingsHelper_CharTracker', label: 'Message Board Signature Tracker', default: true }
    ],

    init() {
        // We only want this to run on the MB preferences tab
        if (new URLSearchParams(window.location.search).get('do') !== 'mb') return;

        this.initSignatureLengthTracker();
    },

    initSignatureLengthTracker() {
        if (Utils.getSettings()?.MessageBoardSettingsHelper_CharTracker === false) return;

        const sigTextArea = document.querySelector('textarea[name="n_sig"]');
        if (!sigTextArea) return;

        const maxChars = 1500;

        // Create the UI display for the length
        const charCountDisplay = document.createElement('div');
        charCountDisplay.style.fontWeight = 'bold';
        charCountDisplay.style.marginTop = '5px';
        charCountDisplay.style.fontSize = '12px';

        // Insert it right after the textarea
        sigTextArea.parentNode.insertBefore(charCountDisplay, sigTextArea.nextSibling);

        const calculateLength = (text) => {
            // HoboWars runs on ISO-8859-1. When you submit characters outside of this charset (like Emojis or fancy symbols),
            // the browser natively encodes them as HTML decimal entities (e.g., &#9574;) in the POST payload.
            // Additionally, newlines count as \r\n (2 characters) in the raw POST payload.
            let count = 0;
            // The browser will internally enforce \r\n for line breaks upon submission.
            const normalizedText = text.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n');

            for (let i = 0; i < normalizedText.length; i++) {
                const charCode = normalizedText.charCodeAt(i);

                // Characters > 255 cannot exist in ISO-8859-1 natively, so they submit as &#NUM;
                if (charCode > 255) {
                    // Length of "&#" (2) + length of number string + ";" (1) = 3 + length.
                    count += 3 + charCode.toString().length;
                } else {
                    count += 1;
                }
            }
            return count;
        };

        const updateCharCount = () => {
            const count = calculateLength(sigTextArea.value);

            if (count > maxChars) {
                const over = count - maxChars;
                charCountDisplay.innerHTML = `Characters Used: ${count} / ${maxChars} <span style="color: red; margin-left: 5px;">[${over} over]</span>`;
                charCountDisplay.style.color = 'red';
            } else {
                const remaining = maxChars - count;
                charCountDisplay.innerHTML = `Characters Used: ${count} / ${maxChars} <span style="color: green; margin-left: 5px;">[${remaining} remaining]</span>`;
                charCountDisplay.style.color = '#333';
            }
        };

        sigTextArea.addEventListener('input', updateCharCount);
        updateCharCount(); // Initialize on page load
    }
};


