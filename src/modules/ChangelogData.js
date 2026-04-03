const ChangelogData = [
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
  },
  {
    version: "7.56",
    date: "2026-04-02",
    changes: [
      "Changed: Updated `LiquorStoreHelper` to visually highlight items from your active shopping list with a faint yellow background directly around the item's image cell."
    ]
  },
  {
    version: "7.55",
    date: "2026-04-02",
    changes: [
      "Added: Created `BackpackHelper` to dynamically display standard and mixed drink details (Base Stat Gains, Effects) on hover tooltips within the inventory.",
      "Added: Added support for AJAX-loaded inventory tabs like the Living Area backpack.",
      "Changed: Expanded `DrinksData` configuration to include full statistics (`base_stat_gain`, `effect`) for items using scraped data from the HoboWars wiki.",
      "Changed: Combined and updated documentation out of various internal files directly into `README.md`."
    ]
  },
  {
    version: "7.54",
    date: "2026-04-02",
    changes: [
      "Fixed: Fixed `BernardsMansionHelper` basement map layout collapsing into a tall rectangle and sizing issues by enforcing a strict fixed layout with `8x8` pixel cells."
    ]
  },
  {
    version: "7.53",
    date: "2026-04-02",
    changes: [
      "Changed: Adjusted the position of the `RecyclingBinHelper` rapid add buttons to appear before the \"Recycle em!\" button instead of after it."
    ]
  }
];
