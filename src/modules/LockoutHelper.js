const LockoutHelper = {
    init: function() {
        // The game auto-locks during the 12-hour reset.
        // We detect this specific screen via document title or body text.
        const titleText = document.title || "";
        const bodyText = document.body.innerText || "";
        const isLockoutScreen = titleText.includes("Closed for daily maintenance") || 
                                bodyText.includes("Temporary Lockout");

        if (!isLockoutScreen) return;

        console.log("LockoutHelper: Detected game lockout screen.");

        const savedSettings = Utils.getSettings();

        if (savedSettings['LockoutHelper_ShowChangelog'] !== false) {
            this.renderChangelog();
        }
    },

    renderChangelog: function() {
        if (typeof Modules === 'undefined' || typeof Modules.ChangelogData === 'undefined' || !Modules.ChangelogData.changes) {
            console.error("LockoutHelper: ChangelogData is missing. Cannot display changelog.");
            return;
        }

        const container = document.createElement("div");
        container.id = "hw-helper-changelog-container";
        // Styling matches "The Future" layout aesthetic broadly, but forces visibility
        container.style.cssText = "margin: 20px auto; padding: 15px; max-width: 600px; background-color: #f9f9f9; border: 1px dashed #777; border-radius: 8px; text-align: left; font-family: Tahoma, Arial, sans-serif; color: #333; box-shadow: 0px 4px 6px rgba(0,0,0,0.1);";

        const title = document.createElement("h2");
        title.innerText = "Hobo Helper - Recent Updates";
        title.style.margin = "0 0 10px 0";
        title.style.borderBottom = "1px solid #ccc";
        title.style.paddingBottom = "5px";
        title.style.fontSize = "16px";
        container.appendChild(title);

        Modules.ChangelogData.changes.forEach(release => {
            const releaseBlock = document.createElement("div");
            releaseBlock.style.marginTop = "10px";

            const versionHeader = document.createElement("div");
            versionHeader.innerHTML = `<strong>v${release.version}</strong> <span style="font-size: 11px; color: #666;">(${release.date})</span>`;
            versionHeader.style.fontSize = "14px";
            releaseBlock.appendChild(versionHeader);

            const changesList = document.createElement("ul");
            changesList.style.margin = "5px 0 0 0";
            changesList.style.paddingLeft = "20px";
            changesList.style.fontSize = "12px";

            if (release.notes && Array.isArray(release.notes)) {
                release.notes.forEach(noteText => {
                    const li = document.createElement("li");
                    li.style.marginBottom = "3px";
                    // Simple markdown parsing for inline code blocks (backticks)
                    let formattedChange = noteText.replace(/`([^`]+)`/g, '<code style="background-color: #eaeaea; padding: 1px 4px; border-radius: 3px; font-family: monospace;">$1</code>');
                    // Add bold prefix for the type if not present
                    formattedChange = `<strong>${release.type}:</strong> ` + formattedChange;
                    li.innerHTML = formattedChange;
                    changesList.appendChild(li);
                });
            }

            releaseBlock.appendChild(changesList);
            container.appendChild(releaseBlock);
        });

        const note = document.createElement("div");
        note.innerHTML = "<em>You can disable this popup in the Hobo Helper Settings on the Preferences page.</em>";
        note.style.fontSize = "10px";
        note.style.color = "#888";
        note.style.marginTop = "15px";
        note.style.textAlign = "center";
        container.appendChild(note);

        // Inject below the main lockout message content.
        // The lockout screen content lives inside a white table data cell.
        const targetTd = document.querySelector('td[bgcolor="#FFFFFF"]');

        if (targetTd) {
            // Append it nicely inside the white background area
            targetTd.appendChild(container);
        } else {
            // Fallback
            const centerWrapper = document.createElement('div');
            centerWrapper.align = 'center';
            centerWrapper.appendChild(container);
            document.body.appendChild(centerWrapper);
        }
    }
};
