const ChangelogData = [
  {
    version: "7.63",
    date: "2026-04-04",
    changes: [
      "Changed: Updated the success message text on the `FoodHelper` button to say \"✅ Updated Crap!\" for better clarity."
    ]
  },
  {
    version: "7.62",
    date: "2026-04-04",
    changes: [
      "Fixed: Re-architected the `FoodHelper` \"Mark as Crap\" logic. The script now exclusively monitors items currently present in your inventory when updating the \"crap\" list, ensuring off-screen previously marked \"crap\" foods are safely preserved rather than being automatically wiped out."
    ]
  },
  {
    version: "7.61",
    date: "2026-04-04",
    changes: [
      "Changed: Added a +750 quick add button to the `RecyclingBinHelper`."
    ]
  },
  {
    version: "7.60",
    date: "2026-04-04",
    changes: [
      "Fixed: Fixed an issue in `LivingAreaHelper` where `StatRatioTracker` would crash and fail to display if a user had gained precisely 0 stats that day, causing the \"Gained Today\" text to be missing from the DOM.",
      "Fixed: Fixed a bug in `FoodHelper` where selecting an item that was already in your Crap Foods List but leaving others unchecked would accidentally purge the others from the tracker. Now properly syncs checked/unchecked state for visible items while preserving stored off-screen items."
    ]
  },
  {
    version: "7.59",
    date: "2026-04-04",
    changes: [
      "Fixed: Addressed bugs across `LivingAreaHelper` and `FoodHelper` which caused helpers to incorrectly rely on a non-existent `cmd=living_area` URL parameter parameter resulting in UI elements frequently failing to load."
    ]
  }
];

