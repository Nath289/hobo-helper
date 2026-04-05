const ChangelogData = {
    init: function() {} ,
    changes: [
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
        },
        {
            version: "7.79",
            date: "2026-04-05",
            type: "Changed",
            notes: [
                "The SoupKitchenHelper has been refined to consistently display the Hobo age metadata and soup rewards table independently of specific URL query parameters."
            ]
        },
        {
            version: "7.78",
            date: "2026-04-05",
            type: "Added",
            notes: [
                "Added automated state handling to GangLoansHelper which tracks when 'Add' and 'Clear' actions resolve via persistent cache across synchronous page loads.",
                "The GangLoansHelper dashboard now seamlessly transitions rows through permanent workflow states ('Loan Created', 'Loan Cleared') after confirming system responses.",
                "Added a native 'Select Loan' shortcut button on 'Loan Created' items which instantly parses the existing HTML DOM and form elements to prepare a specific loan ID for immediate clearing."
            ]
        }
    ]
};
