const ChangelogData = {
    init: function() {} ,
    changes: [
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
        },
        {
            version: "7.62",
            date: "2026-04-04",
            type: "Fixed",
            notes: [
                "Re-architected the FoodHelper \"Mark as Crap\" logic. The script now exclusively monitors items currently present in your inventory when updating the \"crap\" list, ensuring off-screen previously marked \"crap\" foods are safely preserved rather than being automatically wiped out."
            ]
        }
    ]
};
