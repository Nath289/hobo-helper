const SyncHelper = {
    settings: [
        { key: 'SyncHelper_Enable', label: 'Enable Cloud Sync (CouchDB)', defaultValue: false },
        { key: 'SyncHelper_ServerURL', label: 'Sync Server URL', type: 'text' },
        { key: 'SyncHelper_Username', label: 'Sync Username', type: 'text' },
        { key: 'SyncHelper_Password', label: 'Sync Password', type: 'password' }
    ],

    // Local variables
    syncTimeout: null,
    isSyncing: false,

    getLocalTimestamps: function() {
        return JSON.parse(localStorage.getItem('hw_sync_timestamps') || '{}');
    },

    saveLocalTimestamps: function(timestamps) {
        localStorage.setItem('hw_sync_timestamps', JSON.stringify(timestamps));
    },

    recordLocalUpdate: function(key) {
        // Exclude the timestamp tracker itself
        if (key === 'hw_sync_timestamps') return;

        let timestamps = this.getLocalTimestamps();
        timestamps[key] = Date.now();
        this.saveLocalTimestamps(timestamps);
    },

    init: function() {
        const settings = Utils.getSettings();
        if (!settings['SyncHelper_Enable']) return;

        // Auto sync on load if enabled
        const url = settings['SyncHelper_ServerURL'];
        if (url) {
            this.syncAllNow();
        }
    },

    getBaseDbUrl: function() {
        const settings = Utils.getSettings();
        const url = settings['SyncHelper_ServerURL'];
        
        if (!url) return null;
        
        try {
            const dbUrl = new URL(url);
            // We strip auth from the URL to prevent Chrome "Request cannot be constructed from a URL that includes credentials" error
            dbUrl.username = '';
            dbUrl.password = '';
            // Ensure no trailing slash
            return dbUrl.toString().replace(/\/$/, '');
        } catch(e) {
            return null;
        }
    },

    getAuthHeaders: function(customHeaders = {}) {
        const settings = Utils.getSettings();
        const user = settings['SyncHelper_Username'];
        const pass = settings['SyncHelper_Password'];
        
        const headers = { ...customHeaders };
        if (user && pass) {
            headers['Authorization'] = 'Basic ' + btoa(user + ':' + pass);
        }
        return headers;
    },

    getDocId: function() {
        const hoboId = Utils.getHoboId();
        return hoboId && hoboId !== 'Unknown' ? `hobo_sync_${hoboId}` : 'hobo_sync_general';
    },

    triggerSync: function() {
        if (!Utils.getSettings()['SyncHelper_Enable']) return;

        if (this.syncTimeout) clearTimeout(this.syncTimeout);
        this.syncTimeout = setTimeout(() => {
            this.performSync();
        }, 5000); // 5 second debounce
    },

    fetchGM: function(url, options = {}) {
        return new Promise((resolve, reject) => {
            if (typeof GM_xmlhttpRequest === 'undefined') {
                reject(new Error('GM_xmlhttpRequest is not available. Please ensure your userscript manager is configured correctly.'));
                return;
            }
            
            GM_xmlhttpRequest({
                method: options.method || 'GET',
                url: url,
                headers: options.headers || {},
                data: options.body,
                onload: function(response) {
                    resolve({
                        ok: response.status >= 200 && response.status < 300,
                        status: response.status,
                        statusText: response.statusText,
                        json: () => {
                            try {
                                return Promise.resolve(JSON.parse(response.responseText || '{}'));
                            } catch(e) {
                                return Promise.resolve({});
                            }
                        },
                        text: () => Promise.resolve(response.responseText)
                    });
                },
                onerror: function(err) {
                    reject(new Error('Network or CORS error via GM_xmlhttpRequest'));
                }
            });
        });
    },

    syncAllNow: function() {
        return this.performSync();
    },

    getLocalStorageData: function() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            // Sync all hw_ keys that the helper uses
            if (key && (key.startsWith('hw_') || key.startsWith('hobowars') || key.startsWith('hof_') || key.startsWith('ActiveListHelper') || key.startsWith('bh_') || key.startsWith('GangArmory'))) {
                if (key !== 'hw_sync_timestamps') { // Prevent infinite loops
                    data[key] = localStorage.getItem(key);
                }
            }
        }
        return data;
    },

    performSync: async function() {
        if (this.isSyncing) return;
        const dbUrl = this.getBaseDbUrl();
        if (!dbUrl) return;

        this.isSyncing = true;
        try {
            const docId = this.getDocId();
            let remoteDoc = null;
            let rev = null;

            try {
                const getRes = await this.fetchGM(`${dbUrl}/${docId}`, { headers: this.getAuthHeaders() });
                if (getRes.ok) {
                    remoteDoc = await getRes.json();
                    rev = remoteDoc._rev;
                }
            } catch(e) { }

            const localData = this.getLocalStorageData();
            const localTimestamps = this.getLocalTimestamps();
            const now = Date.now();

            // Setup new payload starting with remote if it exists
            const payload = {
                data: remoteDoc && remoteDoc.data ? { ...remoteDoc.data } : {},
                timestamps: remoteDoc && remoteDoc.timestamps ? { ...remoteDoc.timestamps } : {},
                last_updated: now
            };

            let needsPush = false;
            let localChanged = false;

            // Merge logic
            // 1. Process remote keys first
            if (remoteDoc && remoteDoc.data && remoteDoc.timestamps) {
                for (const [key, remoteVal] of Object.entries(remoteDoc.data)) {
                    const remoteTime = remoteDoc.timestamps[key] || 0;
                    const localTime = localTimestamps[key] || 0;

                    if (remoteTime > localTime) {
                        // Remote is newer, update local storage
                        const currentLocalVal = localStorage.getItem(key);
                        if (currentLocalVal !== remoteVal) {
                            localStorage.setItem(key, remoteVal);
                            localTimestamps[key] = remoteTime;
                            localChanged = true;
                        }
                    }
                }
            }

            // 2. Process local keys
            for (const [key, localVal] of Object.entries(localData)) {
                const localTime = localTimestamps[key] || 0;
                const remoteTime = payload.timestamps[key] || 0;

                // Push new or modified local keys
                if (localTime > remoteTime || (!remoteDoc && localVal)) {
                    payload.data[key] = localVal;
                    payload.timestamps[key] = localTime || now; // Make sure it has a timestamp
                    needsPush = true;
                }
            }

            if (localChanged) {
                this.saveLocalTimestamps(localTimestamps);
                if (window.location.search.includes('cmd=')) {
                    Utils.log('HoboHelper sync pulled new data.');
                }
            }

            // Push to remote if any local overrides were stronger or doc is brand new
            if (needsPush || !remoteDoc) {
                if (rev) payload._rev = rev;

                await this.fetchGM(`${dbUrl}/${docId}`, {
                    method: 'PUT',
                    headers: this.getAuthHeaders({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify(payload)
                });
            }

        } catch (e) {
            console.error('HoboHelper Sync Error:', e);
        } finally {
            this.isSyncing = false;
        }
    },
};

