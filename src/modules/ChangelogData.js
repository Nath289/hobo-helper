const ChangelogData = {
    init: function() {} ,
    changes: [
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
        },
        {
            version: "7.81",
            date: "2026-04-05",
            type: "Fixed",
            notes: [
                "Fixed an issue where the FoodData mapping incorrectly associated the 'Apple Core' food item with the wrong image asset within FortSlugworthHelper Ripaparter's menu."
            ]
        },
        {
            version: "7.80",
            date: "2026-04-05",
            type: "Added",
            notes: [
                "Added FortSlugworthHelper with functionality for The Ripaparter (room=4).",
                "Introduced a tile-based UI replacement to The Ripaparter for selecting trolley foods, generating visual interactive grids using the newly added FoodData.js asset map, vastly improving sorting and speed. Includes dynamic image detection parsing names mapped to wiki records."
            ]
        }
    ]
};
