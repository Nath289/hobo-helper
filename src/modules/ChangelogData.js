const ChangelogData = {
    init: function() {} ,
    changes: [
        {
            version: "7.78",
            date: "2026-04-05",
            type: "Added",
            notes: [
                "Added automated state handling to GangLoansHelper which tracks when 'Add' and 'Clear' actions resolve via persistent cache across synchronous page loads.",
                "The GangLoansHelper dashboard now seamlessly transitions rows through permanent workflow states ('Loan Created', 'Loan Cleared') after confirming system responses.",
                "Added a native 'Select Loan' shortcut button on 'Loan Created' items which instantly parses the existing HTML DOM and form elements to prepare a specific loan ID for immediate clearing."
            ]
        },
        {
            version: "7.77",
            date: "2026-04-04",
            type: "Fixed",
            notes: [
                "Improved MessageBoardHelper topic name extraction reliability on Gang Board posts, fixing bugs that prevented the Save Repliers/Add Payment buttons from appearing correctly."
            ]
        },
        {
            version: "7.76",
            date: "2026-04-04",
            type: "Changed",
            notes: [
                "Enhanced the MessageBoardHelper 'Add Payment' dollar amount parser to correctly interpret multiplier suffixes (k, m, mil, mill, million) and automatically format the mapped value with commas and a dollar sign."
            ]
        },
        {
            version: "7.75",
            date: "2026-04-04",
            type: "Changed",
            notes: [
                "Adjusted the padding of the SettingsHelper card boxes and global toggle container for a tighter, cleaner appearance."
            ]
        },
        {
            version: "7.74",
            date: "2026-04-04",
            type: "Changed",
            notes: [
                "Overhauled the SettingsHelper Game Preferences page layout, migrating from a continuous vertical list to a balanced and stylized two-column card grid to improve readability and aesthetics."
            ]
        }
    ]
};
