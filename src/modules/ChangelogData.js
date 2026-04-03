const ChangelogData = [
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
  },
  {
    version: "7.58",
    date: "2026-04-03",
    changes: [
      "Added: Added `FoodHelper` to manage unwanted food items.",
      "Added: Added a \"Select Crap\" button to automatically check all previously marked \"crap\" foods.",
      "Added: Added a \"Mark as Crap\" button to add selected foods to the \"crap\" list, saving them for future sweeps.",
      "Added: Integrated the new `FoodHelper` into both the main Food page (`cmd=food`) and within the Living Area.",
      "Added: Added a \"Crap Foods List\" section inside the Game Preferences \"Helper Settings\", allowing you to view and delete items you've previously marked."
    ]
  },
  {
    version: "7.57",
    date: "2026-04-03",
    changes: [
      "Added: Added custom settings configurations for Message Board features (`MessageBoardHelper_CtrlEnter`).",
      "Added: Added a `💾 Save Repliers List` button to `MessageBoardHelper` explicitly for Gang Board posts (`cmd=gathering&do=vpost`), securely extracting and exporting a unique timestamped list of user names and IDs replying to the active topic locally.",
      "Added: Established foundations for `LockoutHelper` (presently disabled but accessible), designed to intelligently inject recent changelog activity directly over the intermittent 12-hour game reset lockout screen.",
      "Added: Extensively documented and injected `Supported Layouts` layout warnings noting only `The Future` layout format has been officially tested throughout README, INTRO, FEATURES, and internal AGENT reference files.",
      "Added: Appended concrete rule compliance references directly into `AGENTS.md` explicitly banning automated Macros/Refreshers implementation."
    ]
  }
];
