const ChangelogData = {
    init: function() {} ,
    changes: [
        {
            version: "7.88",
            date: "2026-04-05",
            type: "Added",
            notes: [
                "Added a \"Version Display\" to the LivingAreaHelper beneath the Mixer link to show the current Helper Tool version.",
                "Added an interactive \"View Changelog\" link in the LivingAreaHelper that opens a floating modal with the 5 most recent changelog updates without having to wait for the Lockout Screen."
            ]
        },
        {
            version: "7.87",
            date: "2026-04-05",
            type: "Changed",
            notes: [
                "Updated the LivingAreaHelper \"Update Ratio\" button to display \"Update Goals\" and configured it to automatically collapse the input window when settings are saved."
            ]
        },
        {
            version: "7.86",
            date: "2026-04-05",
            type: "Added",
            notes: [
                "Added an \"Enable the Fake Qwee\" setting to the DisplayHelper to allow toggling the \"The Fake\" prefix for user ID 2924510."
            ]
        },
        {
            version: "7.85",
            date: "2026-04-05",
            type: "Added",
            notes: [
                "Added a RatsHelper for the Rat page (cmd=rats) that includes an interactive \"Rat News Filter\" using checkbox pills.",
                "Refactored SettingsHelper architecture: all modules now export their own settings configurations, automatically populating the Preferences page dynamically."
            ]
        },
        {
            version: "7.84",
            date: "2026-04-05",
            type: "Changed",
            notes: [
                "Updated the \"Export Saved Repliers\" button to output granular line-by-line payment details for each individual recipient instead of a single total summary string."
            ]
        }
    ]
};
