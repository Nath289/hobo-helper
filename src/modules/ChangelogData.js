const ChangelogData = {
    init: function() {} ,
    changes: [
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
        },
        {
            version: "7.83",
            date: "2026-04-05",
            type: "Added",
            notes: [
                "Added an \"Export Totals\" button to the GangLoansHelper to automatically sum up all processed cash values from both individual actions and bulk replier lists into a single clipboard string.",
                "Implemented dependent validation states for GangLoansHelper export buttons to explicitly disable interaction until missing dynamic elements are entered."
            ]
        },
        {
            version: "7.82",
            date: "2026-04-05",
            type: "Changed",
            notes: [
                "Modified the MessageBoardHelper dollar matching logic to iteratively extract and map the final trailing dollar volume in instances where text strings list multiplier equations prior to a total summation format."
            ]
        }
    ]
};
