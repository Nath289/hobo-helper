const ChangelogData = {
    init: function() {} ,
    changes: [
        {
            version: "7.71",
            date: "2026-04-04",
            type: "Added",
            notes: [
                "Added a configurable toggle for the HitlistHelper's 'Highlight Online Players' feature within the SettingsHelper preferences page."
            ]
        },
        {
            version: "7.70",
            date: "2026-04-04",
            type: "Added",
            notes: [
                "Added the HitlistHelper module to provide usability improvements to the Personal Hitlist page.",
                "Formatted Personal Hitlist elements to automatically map and highlight any currently online opponents with a light green row background, dramatically improving visual recognition instead of having to spot the small online icon."
            ]
        },
        {
            version: "7.69",
            date: "2026-04-04",
            type: "Added",
            notes: [
                "Added the GangLoansHelper module which introduces a robust tracking dashboard to the Gang Loans page specifically for bulk post-payments and replier workflow administration.",
                "Formatted Export features attached to tracked topics, allowing clipboard export of both saved repliers and generated payment objects directly mapped with dollar outputs.",
                "Integrated a generic 'Save' and dynamic insertion mechanism onto the dashboard, automatically filling out the site's default input forms from tracked payments.",
                "The 'Add Payment' and 'Save Repliers List' buttons that appear over Gang Message Board posts are now inherently restricted to users posessing Gang Staff status.",
                "Removed the obsolete 'Save Repliers List Button' option from Hobo Helper settings."
            ]
        },
        {
            version: "7.68",
            date: "2026-04-04",
            type: "Added",
            notes: [
                "Added an \"Add Payment\" button to individual replies within Gang Message Board posts locally tracking custom transactions linked to specific topic responses.",
                "The button opens a floating panel pre-populated with the replier's Hobo Name, Hobo ID, and a suggested amount securely parsed from the post text, allowing local storage of expected payments."
            ]
        },
        {
            version: "7.67",
            date: "2026-04-04",
            type: "Fixed",
            notes: [
                "Fixed an issue where LockoutHelper failed to display the changelog because it was incorrectly referencing the ChangelogData module structure."
            ]
        }
    ]
};
