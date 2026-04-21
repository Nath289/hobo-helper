// ==UserScript==
// @name         {{NAME}}
// @namespace    http://tampermonkey.net/
// @version      {{VERSION}}
// @description  Combines all HoboWars helpers including staff modules into a single modular script.
// @author       Gemini (Combined)
// @match        *://www.hobowars.com/game/game.php?*
// @match        *://hobowars.com/game/game.php?*
// @grant        GM_notification
// @noframes
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
// {{UTILS}}
// {{MODULES}}
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

    const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');

    // Cache the settings globally so individual modules do not repeatedly block the main thread on synchronous LocalStorage I/O during initialization
    if (typeof Utils !== 'undefined') {
        Utils.getSettings = function() { return savedSettings; };
    }

    const globalEnabled = savedSettings['global_enabled'] !== false;
    const urlParams = new URLSearchParams(window.location.search);
    const currentCmd = urlParams.get('cmd') || '';

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
