// ==UserScript==
// @name         {{NAME}}
// @namespace    http://tampermonkey.net/
// @version      {{VERSION}}
// @description  Combines original HoboWars helpers into a single modular script.
// @author       Gemini (Combined)
// @match        *://www.hobowars.com/game/game.php?*
// @grant        none
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

    // Initialize all modules
    Object.keys(Modules).forEach(moduleName => {
        if (typeof Modules[moduleName].alwaysInit === 'function') {
            Modules[moduleName].alwaysInit();
        }

        if (typeof Modules[moduleName].init === 'function') {
            const moduleEnabled = savedSettings[moduleName] !== false;
            if (moduleName === 'SettingsHelper' || (globalEnabled && moduleEnabled)) {
                Modules[moduleName].init();
            }
        }
    });
})();
