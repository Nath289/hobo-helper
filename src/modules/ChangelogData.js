const ChangelogData = {
    init: function() {} ,
    changes: [
        {
            version: "7.67",
            date: "2026-04-04",
            type: "Fixed",
            notes: [
                "Fixed an issue where LockoutHelper failed to display the changelog because it was incorrectly referencing the ChangelogData module structure."
            ]
        },
        {
            version: "7.66",
            date: "2026-04-04",
            type: "Added",
            notes: [
                "Added Display Helper, with initial display tweaks."
            ]
        },
        {
            version: "7.65",
            date: "2026-04-04",
            type: "Changed",
            notes: [
                "Updated the \"5 Fighter's Lunches\" BankHelper button to support multiple sequential clicks, allowing withdrawals in multiples of 5 lunches at a time, while dynamically tracking and updating the total count added in the button's display value."
            ]
        },
        {
            version: "7.64",
            date: "2026-04-04",
            type: "Added",
            notes: [
                "Added a \"5 Fighter's Lunches\" withdraw goal to the BankHelper, dynamic to your Hobo Level.",
                "Added a configuration toggle for the 5 Fighter's Lunches Goal within the SettingsHelper."
            ]
        },
        {
            version: "7.63",
            date: "2026-04-04",
            type: "Changed",
            notes: [
                "Updated the success message text on the FoodHelper button to say \"✅ Updated Crap!\" for better clarity."
            ]
        }
    ]
};
