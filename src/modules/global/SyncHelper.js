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
    syncQueued: false,

    getLocalTimestamps: function() {
        return JSON.parse(Utils.getItem('hw_sync_timestamps') || '{}');
    },

    saveLocalTimestamps: function(timestamps) {
        Utils.setItem('hw_sync_timestamps', JSON.stringify(timestamps));
    },

    recordLocalUpdate: function(key) {
        // Exclude the timestamp tracker itself
        if (key.startsWith('hw_sync_')) return;

        let timestamps = this.getLocalTimestamps();
        timestamps[key] = Date.now();
        this.saveLocalTimestamps(timestamps);
    },

    init: function() {
        const settings = Utils.getSettings();
        if (!settings['SyncHelper_Enable']) return;

        const url = settings['SyncHelper_ServerURL'];
        if (url) {
            const now = Date.now();
            const lastSync = parseInt(Utils.getItem('hw_sync_last_sync') || '0', 10);
            const lastActive = parseInt(Utils.getItem('hw_sync_last_active') || '0', 10);

            let assumeStale = false;
            // If the device hasn't been used in 5 minutes, assume settings are stale
            if (lastActive > 0 && (now - lastActive > 300000)) {
                assumeStale = true;
            }

            // Sync from remote if inactive for 5 mins, or never synced before
            if (lastSync === 0 || assumeStale) {
                this.performSync(assumeStale);
            }

            Utils.setItem('hw_sync_last_active', now.toString());
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

        if (this.isSyncing) {
            this.syncQueued = true;
            return;
        }

        if (this.syncTimeout) clearTimeout(this.syncTimeout);
        this.syncTimeout = setTimeout(() => {
            this.performSync();
        }, 100); // 100ms debounce for near-immediate sync
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
            if (key && (key.startsWith('hw_') || key.startsWith('hobowars') || key.startsWith('hof_') || key.startsWith('ActiveListHelper') || key.startsWith('bh_') || key.startsWith('GangArmory') || key === 'hoboStatRatio')) {
                if (!key.startsWith('hw_sync_')) { // Prevent infinite loops and syncing meta logic
                    data[key] = Utils.getItem(key);
                }
            }
        }
        return data;
    },

    performSync: async function(assumeStale = false) {
        if (this.isSyncing) return;
        const dbUrl = this.getBaseDbUrl();
        if (!dbUrl) return;

        this.isSyncing = true;
        // Mark that a sync occurred to reset the 30-second checking clock
        Utils.setItem('hw_sync_last_sync', Date.now().toString());

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
                    const localTime = assumeStale ? 0 : (localTimestamps[key] || 0);

                    if (remoteTime > localTime || (assumeStale && remoteVal !== undefined)) {
                        // Remote is newer, update local storage
                        const currentLocalVal = Utils.getItem(key);
                        if (currentLocalVal !== remoteVal) {
                            Utils.setItem(key, remoteVal);
                            localTimestamps[key] = remoteTime;
                            localChanged = true;
                        }
                    }
                }
            }

            // 2. Process local keys
            for (const [key, localVal] of Object.entries(localData)) {
                const localTime = assumeStale ? 0 : (localTimestamps[key] || 0);
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
                
                if (window.location.search.includes('cmd=')) {
                    Utils.log('HoboHelper sync pushed new data to CouchDB.');
                }
            }

        } catch (e) {
            console.error('HoboHelper Sync Error:', e);
        } finally {
            this.isSyncing = false;
            if (this.syncQueued) {
                this.syncQueued = false;
                this.triggerSync();
            }
        }
    },
};

