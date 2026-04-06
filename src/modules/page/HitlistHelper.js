const HitlistHelper = {
    cmds: 'battle',
    settings: [
        { key: 'HitlistHelper_HighlightOnline', label: 'Highlight Online Players' }
    ],
    init: function() {
        if (!window.location.search.includes('do=phlist')) return;

        const contentArea = document.querySelector('.content-area');
        if (!contentArea) return;

        const settings = Utils.getSettings();
        if (settings?.HitlistHelper?.enabled === false) return;

        console.log('[Hobo Helper] Initializing HitlistHelper');

        if (settings?.HitlistHelper_HighlightOnline !== false) {
            this.highlightOnlinePlayers();
        }
    },

    highlightOnlinePlayers: function() {
        const onlineImages = document.querySelectorAll('img[src*="online_now"]');
        onlineImages.forEach(img => {
            const tr = img.closest('tr');
            if (tr) {
                const tds = tr.querySelectorAll('td');
                tds.forEach(td => {
                    td.style.backgroundColor = '#d4edda'; // Light green highlight
                });
            }
        });
    }
};
