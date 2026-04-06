// ==UserScript==
// @name         {{NAME}}
// @namespace    http://tampermonkey.net/
// @version      {{VERSION}}
// @description  Combines original HoboWars helpers into a single modular script.
// @author       Gemini (Combined)
// @match        *://www.hobowars.com/game/game.php?*
// @grant        GM_notification
// ==/UserScript==

(function() {
    'use strict';
// {{HELPERS}}
// {{MODULES}}
    const Modules = {
// {{MODULE_EXPORTS}}
    };

    const savedSettings = JSON.parse(localStorage.getItem('hw_helper_settings') || '{}');
    const globalEnabled = savedSettings['global_enabled'] !== false;
    const urlParams = new URLSearchParams(window.location.search);
    const currentCmd = urlParams.get('cmd') || '';

    // Initialize all modules
    Object.keys(Modules).forEach(moduleName => {
        const module = Modules[moduleName];

        if (typeof module.alwaysInit === 'function') {
            module.alwaysInit();
        }

        if (typeof module.init === 'function') {
            const moduleEnabled = savedSettings[moduleName] !== false;
            
            // Check if module specifies cmds constraint
            const hasCmdRestriction = module.cmds !== undefined && module.cmds !== null;
            let isCmdMatch = false;
            
            if (hasCmdRestriction) {
                if (Array.isArray(module.cmds)) {
                    isCmdMatch = module.cmds.includes(currentCmd);
                } else if (typeof module.cmds === 'string') {
                    isCmdMatch = module.cmds === currentCmd;
                }
            } else {
                // If no cmds specified, assume it's a global module
                isCmdMatch = true;
            }

            if (isCmdMatch && (moduleName === 'SettingsHelper' || (globalEnabled && moduleEnabled))) {
                module.init();
            }
        }
    });
})();
