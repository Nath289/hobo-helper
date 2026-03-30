// ==UserScript==
// @name         HoboWars Helper Toolkit
// @namespace    http://tampermonkey.net/
// @version      7.20
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

    // Initialize all modules
    Object.values(Modules).forEach(module => {
        if (typeof module.init === 'function') {
            module.init();
        }
    });
})();
