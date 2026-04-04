const DisplayHelper = {
    alwaysInit: function() {
        // This function will always run upon loading any page,
        // regardless of whether this specific module is enabled or totally disabled globally.
        const targetHoboId = "2924510";

        const playerLinks = document.querySelectorAll(`a[href*="cmd=player&ID=${targetHoboId}"]`);
        playerLinks.forEach(link => {
            if (!link.innerHTML.includes('The Fake')) {
                link.innerHTML = `<span style="color: red; font-weight: bold; text-shadow: 1px 1px 2px black;">The Fake</span> ` + link.innerHTML;
            }
        });
    },
    init: function() {
        const settings = Utils.getSettings();
        // This function only runs if the global helper is enabled,
        // and if this specific 'DisplayHelper' is enabled via SettingsHelper.
    }
};
