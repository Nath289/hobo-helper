// ==UserScript==
// @name         {{NAME}}
// @namespace    http://tampermonkey.net/
// @version      {{VERSION}}
// @description  Combines original HoboWars helpers into a single modular script (non-staff modules).
// @author       Jack Reacher (107380)
// @match        *://www.hobowars.com/game/game.php?*
// @match        *://hobowars.com/game/game.php?*
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @noframes
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // Prevent multiple instances from running
    if (document.getElementById('hh-instance-marker')) {
        document.addEventListener('DOMContentLoaded', () => {
            if (!document.getElementById('hh-multiple-warning')) {
                const warningDiv = document.createElement('div');
                warningDiv.id = 'hh-multiple-warning';
                warningDiv.style.cssText = 'background: red; color: white; text-align: center; padding: 10px; font-weight: bold; position: fixed; top: 0; left: 0; width: 100%; z-index: 999999; border-bottom: 2px solid darkred;';
                warningDiv.innerHTML = '⚠️ WARNING: Multiple versions of Hobo Helper are currently running! Please open your Tampermonkey dashboard and disable duplicate or old versions to prevent game-breaking conflicts. ⚠️';
                if (document.body) document.body.appendChild(warningDiv);
            }
        });
        return;
    }

    // Set the instance marker
    const marker = document.createElement('div');
    marker.id = 'hh-instance-marker';
    marker.style.display = 'none';
    if (document.documentElement) {
        document.documentElement.appendChild(marker);
    }

    const DataModules = {
// {{DATA_MODULE_EXPORTS}}
    };

    const GlobalModules = {
// {{GLOBAL_MODULE_EXPORTS}}
    };

    const PageModules = {
// {{PAGE_MODULE_EXPORTS}}
    };

    // Alias for easy access across helpers if needed
    const Modules = Object.assign({}, DataModules, GlobalModules, PageModules);
    if (typeof window !== 'undefined') {
        window.HoboHelperModules = Modules;
        window.HoboHelperVersion = '{{VERSION}}';
    }

    const globalSettings = JSON.parse(Utils.getItem('hw_helper_settings') || '{}');
    let localSettings = JSON.parse(Utils.getItem('hw_helper_local_settings') || '{}');
    let migrationNeeded = false;

    // Migrate any localKeys that are stuck in globalSettings to localSettings
    for (const modName in Modules) {
        const mod = Modules[modName];
        if (mod && Array.isArray(mod.localKeys)) {
            mod.localKeys.forEach(key => {
                if (key in globalSettings) {
                    localSettings[key] = globalSettings[key];
                    delete globalSettings[key];
                    migrationNeeded = true;
                }
            });
        }
    }

    if (migrationNeeded) {
        localStorage.setItem('hw_helper_settings', JSON.stringify(globalSettings));
        localStorage.setItem('hw_helper_local_settings', JSON.stringify(localSettings));
        
        // Also trick the timestamp so that SyncHelper knows this stripped string needs to be pushed up
        let timestamps = JSON.parse(localStorage.getItem('hw_sync_timestamps') || '{}');
        timestamps['hw_helper_settings'] = Date.now();
        localStorage.setItem('hw_sync_timestamps', JSON.stringify(timestamps));
    }

    const savedSettings = Object.assign({}, globalSettings, localSettings);

    // Cache the settings globally so individual modules do not repeatedly block the main thread on synchronous LocalStorage I/O during initialization
    if (typeof Utils !== 'undefined') {
        Utils.getSettings = function() { return savedSettings; };
    }

    const globalEnabled = savedSettings['global_enabled'] !== false;
    const urlParams = new URLSearchParams(window.location.search);
    const currentCmd = urlParams.get('cmd') || '';

    const djb2Hash = (str) => {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
        }
        return hash;
    };

    const currentId = Utils.getHoboId();
    // Replace 0 with the actual hash of the target Hobo ID
    // You can find the hash of an ID by opening your browser console on HoboWars and typing:
    // let h=5381,s="123456"; for(let i=0;i<s.length;i++) h=((h<<5)+h)+s.charCodeAt(i); console.log(h);
    const BANNED_HASH = 0;

    if (currentId !== 'Unknown' && djb2Hash(currentId) === BANNED_HASH) {
        return; // Halt execution entirely for this exact Hobo ID
    }

    // To prevent DOM flash, run script at document-start, hide the document visually, apply modifications, then show it.
    if (document.documentElement) {
        const flashStyle = document.createElement('style');
        flashStyle.id = 'hh-flash-prevention';
        flashStyle.innerHTML = `
            html { background-color: #222 !important; }
            body { visibility: hidden !important; }
        `;
        document.documentElement.appendChild(flashStyle);
    }

    const initModules = () => {
        // Initialize Global Modules first
        Object.entries(GlobalModules).forEach(([moduleName, module]) => {
            if (typeof module.alwaysInit === 'function') {
                module.alwaysInit();
            }

            if (typeof module.init === 'function') {
                const moduleEnabled = savedSettings[moduleName] !== false;
                
                if (globalEnabled && moduleEnabled) {
                    module.init();
                }
            }
        });

        // Filter and Initialize Page Modules in a single pass
        Object.entries(PageModules).forEach(([moduleName, module]) => {
            let isMatch = false;
            if (module.cmds === undefined || module.cmds === null) {
                isMatch = true;
            } else if (Array.isArray(module.cmds)) {
                isMatch = module.cmds.includes(currentCmd);
            } else {
                isMatch = module.cmds === currentCmd;
            }

            if (isMatch) {
                if (typeof module.alwaysInit === 'function') {
                    module.alwaysInit();
                }

                if (typeof module.init === 'function') {
                    const moduleEnabled = savedSettings[moduleName] !== false;

                    if (moduleName === 'SettingsHelper' || (globalEnabled && moduleEnabled)) {
                        module.init();
                    }
                }
            }
        });

        // Show document again after modifications
        const styleRemover = document.getElementById('hh-flash-prevention');
        if (styleRemover) styleRemover.remove();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModules);
    } else {
        initModules();
    }
})();
