# Changelog

All notable changes to this project will be documented in this file.

## [7.61] - 2026-04-04
### Changed
- Added a +750 quick add button to the `RecyclingBinHelper`.

## [7.60] - 2026-04-04
### Fixed
- Fixed an issue in `LivingAreaHelper` where `StatRatioTracker` would crash and fail to display if a user had gained precisely 0 stats that day, causing the "Gained Today" text to be missing from the DOM.
- Fixed a bug in `FoodHelper` where selecting an item that was already in your Crap Foods List but leaving others unchecked would accidentally purge the others from the tracker. Now properly syncs checked/unchecked state for visible items while preserving stored off-screen items.

## [7.59] - 2026-04-04
### Fixed
- Addressed bugs across `LivingAreaHelper` and `FoodHelper` which caused helpers to incorrectly rely on a non-existent `cmd=living_area` URL parameter parameter resulting in UI elements frequently failing to load.

## [7.58] - 2026-04-03
### Added
- Added `FoodHelper` to manage unwanted food items.
- Added a "Select Crap" button to automatically check all previously marked "crap" foods.
- Added a "Mark as Crap" button to add selected foods to the "crap" list, saving them for future sweeps.
- Integrated the new `FoodHelper` into both the main Food page (`cmd=food`) and within the Living Area.
- Added a "Crap Foods List" section inside the Game Preferences "Helper Settings", allowing you to view and delete items you've previously marked.

## [7.57] - 2026-04-03
### Added
- Added custom settings configurations for Message Board features (`MessageBoardHelper_CtrlEnter`).
- Added a `💾 Save Repliers List` button to `MessageBoardHelper` explicitly for Gang Board posts (`cmd=gathering&do=vpost`), securely extracting and exporting a unique timestamped list of user names and IDs replying to the active topic locally.
- Established foundations for `LockoutHelper`, injecting recent changelog activity directly into the intermittent 12-hour game reset lockout screen.
- Extensively documented and injected `Supported Layouts` layout warnings noting only `The Future` layout format has been officially tested throughout README, INTRO, FEATURES, and internal AGENT reference files.
- Appended concrete rule compliance references directly into `AGENTS.md` explicitly banning automated Macros/Refreshers implementation.

## [7.56] - 2026-04-02
### Changed
- Updated `LiquorStoreHelper` to visually highlight items from your active shopping list with a faint yellow background directly around the item's image cell.

## [7.55] - 2026-04-02
### Added
- Created `BackpackHelper` to dynamically display standard and mixed drink details (Base Stat Gains, Effects) on hover tooltips within the inventory.
- Added support for AJAX-loaded inventory tabs like the Living Area backpack.
### Changed
- Expanded `DrinksData` configuration to include full statistics (`base_stat_gain`, `effect`) for items using scraped data from the HoboWars wiki.
- Combined and updated documentation out of various internal files directly into `README.md`.

## [7.54] - 2026-04-02
### Fixed
- Fixed `BernardsMansionHelper` basement map layout collapsing into a tall rectangle and sizing issues by enforcing a strict fixed layout with `8x8` pixel cells.

## [7.53] - 2026-04-02
### Changed
- Adjusted the position of the `RecyclingBinHelper` rapid add buttons to appear before the "Recycle em!" button instead of after it.

## [7.52] - 2026-04-02
### Added
- Added `RecyclingBinHelper` to quickly add fixed amounts (+100, +200, +500) to the recycling bin input.

## [7.51] - 2026-04-02
### Added
- Created `CanDepoHelper` to calculate and display the total value of collected cans at the Can Depo.
- Extracted and generalized HTML templates.
### Fixed
- Fixed an issue in `BernardsMansionHelper` where inserting the basement map would horizontally shift the directional navigation links upon page load.

## [7.50] - 2026-04-02
### Changed
- Improved `WellnessClinicHelper` by changing the label "To Finish" to "Cumulative Spend".
- Added a visual hover effect on "Cumulative Spend" cells (turning light blue).
- Clicking a cell in the "Cumulative Spend" column now visually selects it (darker blue bold) and automatically sets it as a Bank Withdraw Goal.
- Added a visual helper hint indicating that clicking the "Cumulative Spend" sets the Bank Withdraw Goal.

## [7.49] - 2026-04-02
### Changed
- Added a thin border around individual cells in the `BernardsMansionHelper` basement map grid to visually distinguish the squares.

## [7.48] - 2026-04-02
### Changed
- Automatically clear out old build files during compilation, only keeping the 5 most recent versioned files and the latest build.

## [7.47] - 2026-04-02
### Changed
- Removed local storage history/explored state functionality from `BernardsMansionHelper` basement map since all squares are navigable. Removed reset map button.

## [7.46] - 2026-04-02
### Changed
- Refined `BernardsMansionHelper` basement map starting background to be entirely white and adjusted coordinate scaling from (1,1) up to (20,20).

## [7.45] - 2026-04-02
### Changed
- Redesigned `BernardsMansionHelper` basement map to look like the Red Light District map and start coordinates from 0,0 at bottom left.

## [7.44] - 2026-04-02
### Changed
- Improved `BernardsMansionHelper` to inject an interactive basement map next to the directional pad arrows.

## [7.43] - 2026-04-02
### Added
- Added `BernardsMansionHelper` to handle tools specifically for Bernard's Mansion (`cmd=bernards`).
- Added a sub-feature `Basement Map` which triggers when visiting the basement in Bernard's Mansion (`cmd=bernards&room=basement`). Can be configured in Settings.

## [7.42] - 2026-04-02
### Added
- Added a setting to disable the Mixer Link in the Living Area helper (accessible via the Settings Helper toggle).

## [7.41] - 2026-04-02
### Added
- Living Area Mixer Link feature (added link to Mixer next to Hobo Grail/Kings Kiddie Cup/Golden Trolly).
