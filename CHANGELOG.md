# Changelog
All notable changes to this project will be documented in this file.

## [9.47] - 2026-05-12
- Extended `MinesHelper` to capture and retain the absolute daily values of ores accumulated and mining experience earned, directly populating those values back into the `LivingAreaHelper` dedicated Mining Stats readout dynamically.

## [9.46] - 2026-05-12
- Added `SwimTeamImage` feature to `LivingAreaHelper` that dynamically injects the dynamic Swim Team image beside the reference links, aligning correctly with flexbox layouts.

## [9.45] - 2026-05-12
- Separated mining trade stat extraction from the visual post formatting in `MinesHelper` so stats continue to populate the Living Area even if Trade Formatting is disabled.

## [9.44] - 2026-05-12
- Extended LivingAreaHelper to extract and display 'Net Stat Gain' and 'Stat Trades Today' locally from MinesHelper caching mechanisms, populating dynamically within the injected Dedicated Mining Stats Section.
- Added regex matching and DOM extraction into MinesHelper to natively capture daily trading values implicitly presented within the `do=trade` and `what=trade` views, storing them in local storage to act as cross-helper data bridges.

## [9.43] - 2026-05-12
- Dynamically rescaled the `leftStats` container (min 40%, max 55%) inside the Living Area when both "Widen Page" and "Always Show More Info" are active to more evenly distribute white space.

## [9.42] - 2026-05-12
- Reorganized `MinesHelper` trading interface grids. Complementary stat ores are grouped together in a 3-column layout (Green/White/Yellow, Orange/Red/Purple) to reduce vertical space usage.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.39] - 2026-05-11
### Fixed
- Fixed an issue in `MinesHelper.js` where the mining log would double-count ores and experience if the user navigated via the browser's "Back" or "Forward" buttons. Utilizes the `PerformanceNavigation` API to correctly ignore cached view states.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.38] - 2026-05-11
### Added
- Added an Explore Log feature to `BernardsBasementHelper.js` out of necessity to track soup findings (Garlic Salmon Bisque, Cream of Okra Soup, Texas Fajita Soup, Beef Mushroom Stew) linked with their XY coordinates. Employs the `ExploreHelper.js` styled display log format grouped by date.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.37] - 2026-05-11
### Added
- Added Developer Credits link functionality and modal to `LivingAreaHelper.js`.
### Fixed
- Fixed an encoding bug causing non-ASCII graphical characters to become corrupted during PowerShell builds by explicitly enforcing `UTF-8` encoding pipelines across `build.ps1` and directly enabling the `javascript-obfuscator` `--unicode-escape-sequence true` feature.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.36] - 2026-05-10
### Added
- Added build artifact obfuscation support directly into the primary compilation pipeline utilizing `javascript-obfuscator` to protect released configurations.
- Updated agent instructions to seamlessly incorporate testing against obfuscated byte-code across all development workflows.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.35] - 2026-05-10
### Added
- Added comprehensive active page image map definitions to natively support highlighting all areas, subpages, and custom layouts without caching issues.
- Refactored native Active Page Image tracking to support robust dynamically decoupled CSS multi-parameter matching (supports 'do', 'tent', 'room', 'place') stopping dual-highlights entirely.
- Added a toggle configuration option `NorthernFenceHelper_RestoreBanner` to conditionally restore or disable the classic custom Suicide Hill UI header graphic cleanly based on user preference.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.34] - 2026-05-10
### Changed
- Dummy version for update testing.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.33] - 2026-05-10
### Fixed
- Fixed an issue where the Update Checker inside the Settings page would only point to the standard release script, downgrading installed Staff builds. It now accurately dynamically parses the active script type (Beta, Core, All) to download the correct branch.
- Included explicit Build Type indicators alongside the version string on the settings page for easier debug reference.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.32] - 2026-05-10
### Added
- Added an optional link to the Gang Hitlist at the end of the top bar menu (can be toggled in Preferences).

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.31] - 2026-05-10
### Changed
- Food Bank lists (Frozen and In Trolly) now display side-by-side if the page is widened (over 950px layout).

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.30] - 2026-05-10
### Added
- Added a "Race Again" button to the results page when racing an NPC Pikie in the Northern Fence.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.29] - 2026-05-09
### Fixed
- Fixed an issue where breaking a 'Spelunking Satchel' or other equipment in the mines would mistakenly parse and log it as an acquired ore type.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.28] - 2026-05-08
- **Changed:** Swapped the Active Miners list map outline animation from a flashing color to a continuous expanding blue pulse overlay for 5 seconds using `outline-offset` instead of `box-shadow` (for robust table compatibility).

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.27] - 2026-05-08
- **Added:** Added an Active Miners list to the left column while exploring the Mines. It lists all players visible on the map and their coordinates. Clicking on a player initiates a 5-second flashing highlight on their map location for easy tracking.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.26] - 2026-05-08
- **Added:** Added a new setting to the Mines helper to highlight players on the mini-map. Other players are outlined in red, and the player character ("You!") is outlined in green.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.25] - 2026-05-08
- **Changed:** Optimised helper module categorisation by reassigning ExploreHelper, BankHelper, BernardsBasementHelper, LiquorStoreHelper, and CanDepoHelper to the City group. MessageBoardHelper has been shifted to General, LockoutHelper to Global, and RecyclingBinHelper to the Canbodia group.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.24] - 2026-05-08
- **Removed:** Abandoned experimental Mine Pattern helper and canvas scaling features.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.23] - 2026-05-07
- **Changed:** Grouped repeated saved hobos in the Mining Log by ID and added count indicators next to their names (e.g., PlayerName (x3)).
- **Fixed:** Reverted fixed base64 strings for Green Ore, Yellow Ore, and Orange Ore that were causing image display issues.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.22] - 2026-05-07
- **Added:** Added support for recording saved hobos inside the Mining Log. "Hobos Saved" will now render as a bulleted section containing player name links when a trapped player is pulled to safety.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.21] - 2026-05-07
- **Fixed:** Fixed an issue where the trade limits (badges) and formatted Ore quantities were disappearing from the Trading Post because the display formatting was executing out of order and destroying the DOM layout prematurely.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.20] - 2026-05-06
- **Added:** Added an HTML table restyling the native list of registered racers on the race registration page (`cmd=hill3&do=list`).
- **Added:** Added an exact historical skill readout per racer dynamically pulled from the Super-Cart Racing Skill Tracker object data.
- **Added:** Automatically highlights the current player's row if they are actively signed up for the given race class.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.19] - 2026-05-05
- **Changed:** Increased height and bottom padding for the Ore icons inside formatted elements to prevent bottom overflow text overlapping.
- **Fixed:** Fixed an issue where the Mining Log was inflating "T used" values endlessly by grabbing the total instead of delta. Also added explicit zeroing for URL refreshes containing `move=nowhere`.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.18] - 2026-05-05
- **Fixed:** Fixed an issue where the side box mining stats table was parsing formatting HTML tags incorrectly, resulting in "0's".
- **Fixed:** Overhauled data cache integrity iteration for the Mining Log rendering system. Fixed a fatal crash preventing the log from appending correctly at the bottom of the `.content-area` view if historical JSON entries were skewed.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.17] - 2026-05-05
- **Added:** Added dynamic "#" row numbers to the Super-Cart Racing Skill Tracker table to easily identify ranks across pagination.
- **Added:** Added "Hide 0 Weekly Gains" and "Hide 0 Total Gains" checkboxes to the Super-Cart Racing Skill Tracker filters, allowing users to cleanly exclude stagnant inactive hobos from their tracked readouts natively.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.16] - 2026-05-05
- **Added:** Expanded the Super-Cart Racing Skill Tracker to include an independent Weekly Gains metric alongside Total Gains. Metrics automatically checkpoint every Monday at midnight server time without resetting the all-time history.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.15] - 2026-05-05
- **Added:** Added a "Super-Cart Racing Skill Tracker" element inside `NorthernFenceHelper` for the Hall of Fame interface. It actively records and maps rank changes across Hall of Fame pages and builds a dynamic, sortable, locally paginated table of Top Hobos exhibiting stat progression, while saving layout persistence locally.
- **Added:** Appended a collapsible active/total racers summary chart mapping activity breakdown per racing tier inside the Super-Cart Racing Skill Tracker.
- **Fixed:** Corrected a localized regression in helper scripts causing data object corruption due to improper local storage literal string casting.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.14] - 2026-05-05
- **Changed:** Refined the 'Trading Post' visual layout in `MinesHelper`. Restored the net stat gain total header, split individual stats onto multiple lines for better readability, fixed missing image parsing bugs on non-stat purchases, and condensed card heights.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.13] - 2026-05-04
- **Added:** Added `MinesHelper` functionality. Overhauls the visual display of the active hobo list inside the mines into a neat sortable HTML table.
- **Added:** A light green overlay is now drawn directly onto the Mines map to visualize and highlight standard safe-zone tiles where items drop and combat pauses.
- **Added:** The text-based Mining Stats readout has been completely overhauled into a formatted block data table.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.12] - 2026-05-03
- **Added:** Added a "Full Width Log Graphs" setting (enabled by default) to force the native Living Area stat log charts to utilize 100% of the page width.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.11] - 2026-05-03
- **Fixed:** Corrected execution order inside `HitlistHelper` to ensure the Experience dictionary data is properly loaded into the DOM before the automatic Multi-Sort logic attempts to evaluate rows.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.10] - 2026-05-03
- **Fixed:** Resolved an issue where the Gang Staff Helper would fail to display the "Sunday Funday" estimated payouts panel due to missing URL parameters on modern gang overview pages.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.09] - 2026-05-03
- **Fixed:** Disabled browser autofill specifically on SyncHelper credential inputs within the Settings UI to prevent accidental overwriting of database configurations with standard game passwords.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.08] - 2026-05-03
- **Added:** Added a "Show Experience" settings toggle to the `HitlistHelper` to easily hide or display the experience column within the native Preferences menu.
- **Fixed:** Prevented `BattleLogHelper` from caching instances of `0` experience, keeping the experience mapping strictly to positive gains.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.07] - 2026-05-02
- **Fixed:** Resolved a critical cross-device settings wiping issue in the Cloud Sync implementation by strictly scrubbing and gracefully repacking `hw_helper_settings` during downstream sync execution.
- **Added:** Introduced a `get_sync_data` script testing tool for inspecting active CouchDB replication sync payloads server-side.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.06] - 2026-05-02
- **Added:** Automatically group items within the explore log visually by date.
- **Added:** Cloud Sync settings (Server URL, Username, Password, and Enable flag) are now explicitly locked to the local device and will not synchronize externally.
- **Added:** Integrated an automated startup migration loop that automatically extracts trapped local-only configuration variables from the legacy synchronisation payload mapping.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.05] - 2026-05-02
- **Fixed:** Corrected the URL matching logic and settings label for the Bernard's Basement map feature.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.04] - 2026-05-02
- **Fixed:** Resolved a regression where the Living Area layout auto-expansion wasn't operating properly due to older module settings retrieval ignoring device-local boundaries.
- **Changed:** Refactored all remaining legacy modules (Weapons, GangStaff, Can Deposit, Recycling Bin, Bernard's Basement) to rely on the centralized caching layer for configuration loading.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.03] - 2026-05-01
- **Fixed:** Resolved a configuration loading glitch in the script bootstrap wrapper that caused newly segregated local-only settings (like Widen Content Area) to appear unresponsive when interacting with their UI toggles.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.02] - 2026-05-01
- **Added:** Implemented local-only storage capabilities to selectively disable Cloud Sync synchronization on specific device-dependent variables.
- **Changed:** Refactored `DisplayHelper` "Widen Content Area" settings to remain device-specific and ignore cross-device syncs.
- **Changed:** Refactored Custom Bank Goal configurations to remain device-specific and ignore cross-device syncs, along with several background awakeness tracker metrics.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.01] - 2026-04-30
- **Fixed:** Resolved the "Update Goals" stat ratio settings failing to save or retract due to stale cache overwrites in `LivingAreaHelper.js`.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.00] - 2026-04-30
- **Changed:** Refactored Cloud Sync interval checks so local state updates dynamically skip external CouchDB network loops during standard UI reads, only pushing data when explicitly saving configurations.
- **Changed:** Synchronised Cloud Sync debounce interval queue down to 100ms, creating instantaneous near-real-time active background updates across multiple tabs.
- **Changed:** Removed obsolete `src` image properties from tracked `bh_drink_stats` storage arrays to drastically reduce the sync payload size. Passive migration logic silently handles legacy data types.
- **Fixed:** Resolved a double-sync race condition inside the `LivingAreaHelper` stat tracker caused by rapid, continuous callback loops.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.99] - 2026-04-30
- **Added:** Cloud Sync auto-pulls settings data from the server automatically if the device has been inactive for more than 5 minutes.
- **Changed:** Refactored Cloud Sync to use the `Utils.getItem` and `Utils.setItem` wrappers instead of direct `localStorage` access.
- **Fixed:** Prevented infinite synchronization loops by correctly ignoring internal `hw_sync_` meta keys from triggering syncs.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.98] - 2026-04-30
- **Added:** Implemented seamless cross-browser Cloud Sync via the new `SyncHelper`! By placing custom CouchDB configuration credentials directly in your Preferences menu, your device will now automatically push and pull local script data using intelligent, bidirectional conflict resolution merging.
- **Added:** A "Force Sync" quick-toggle button has been added directly to the "Hobo Helper Version" footer block inside your Living Area.
- **Added:** Testing backend connection integrity is now possible directly from within the Preferences page with a functional status text readout.
- **Changed:** Rewrote internal helper memory cache handling to natively interface with `Utils.setItem`, `Utils.getItem`, `Utils.removeItem`, unifying and protecting Cloud Sync trigger hooks.
- **Changed:** Restricted internal debugger output directly to local `Dev` builds by wrapping `console.log` instances inside `Utils.log`.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.97] - 2026-04-29
- **Added:** Added a note to the bottom of the automatic update popup indicating that it can be disabled in the preferences via the Display Helper settings.
- **Changed:** Centered the changelog modal vertically and horizontally on the screen for better readability.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.96] - 2026-04-29
- **Added:** Introduced granular configuration settings to the `Explore Helper` allowing users to specifically toggle exactly which events (`Shiny Objects`, `Arena Passes`) populate their custom exploration log.
- **Added:** The `Explore Helper` now detects and records "Arena Pass" discovery events highlighting them in bold purple within the log interface.
- **Added:** Implemented an automatic Update Checker that proactively displays a filtered changelog of all new features since your last installed version, directly in the game UI.
- **Added:** `Show Update Features on New Version` setting added to the Display Helper to allow toggling of the automatic update notification popups.
- **Changed:** Expanded the changelog modal data buffer to include the 10 most recent versions instead of 5, providing a deeper history for returning players.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.95] - 2026-04-28
- **Added:** Implemented the `ExploreHelper` to track and log in-game explore events across the main Lobby and Movement screens (`cmd=explore`). Events are stored persistently across sessions.
- **Added:** Explore Log now specifically captures vanishing "Shiny Objects" with a gold color-coding mapping, tracking the time and exact coordinates.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.94] - 2026-04-28
- **Added:** Display Helper's Live Alive Time string will now dynamically render hour increments for significantly extended sessions.
- **Fixed:** The Living Area Helper offline healing timer array parser correctly hooks into durations exceeding an hour with non-standard formatting gaps syntax (`Alive: 01 hr 12 min 05 sec`).

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.93] - 2026-04-28
- **Changed:** Heavily optimized DisplayHelper sub-features by batching injected `<style>` elements into a single DOM paint, significantly reducing browser CSS recalculations.
- **Fixed:** Replaced `innerHTML` destructive mutations with `insertAdjacentHTML` when applying Custom Player Titles, eliminating heavy DOM serialization processing in high-density member pages.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.92] - 2026-04-28
- **Changed:** Refactored the Display Helper Custom Player Titles feature to utilize a single unified array mapped DOM scanner, resulting in dramatically improved script performance on pages with high member concentrations compared to iterating multiple separate DOM scans.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.91] - 2026-04-25
- **Changed:** Restructured the `HitlistHelper` multi-column sorting configuration UI to start collapsed above the table, drastically reducing vertical clutter while remaining easily accessible for editing.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.90] - 2026-04-25
- **Changed:** Moved the Configure button in the Recycling Bin Helper to the far right of the submit controls for better layout flow.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.89] - 2026-04-24
- **Changed:** Swapped the Battle Graph chart types: Health Remaining is now a descending Line chart for continuous tracking, and Damage Dealt is now a stacked Bar chart to better illustrate each fighter's individual hits per round without jarring line drops.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.88] - 2026-04-24
- **Enhanced:** The Battle Graph panel is now resizable via CSS `resize: both`. The internal jqplot charts automatically resize to fit using a ResizeObserver to maintain aspect ratios correctly alongside the frame.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.87] - 2026-04-24
- **Added:** Added a [show graph] button to battle results pages. Clicking it opens a floating panel containing two jqplot graphs: a bar chart displaying health remaining per round, and a line chart plotting damage dealt per round.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.86] - 2026-04-24
- **Added:** New system to track continuous "session rejoin time", preventing 30-min-inactive users from being marked active initially until they establish a 30s session.
- **Added:** New logic to conditionally bypass 30s session tracking wait if the user returns with 0 Awakeness.
- **Added:** Display of calculated "Lost Awake" for players logging back in with a full awake bar after being inactive for more than 30 mins.
- **Changed:** Rewrote the donator checking logic to solely utilize the newer `.becomedon` interface matching standard DOM text content, greatly improving check speed and dropping legacy regex evaluations.
- **Changed:** Slightly increased the height of action buttons in the Rats UI.
- **Fixed:** Corrected an issue where checkboxes inside the Food Helper UI did not trigger the underlying game event listeners for updating row highlights.
- **Removed:** staff-latest.user.js from the build compilation pipeline.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.85] - 2026-04-23
### Fixed
- Replaced the purple check mark with a proper green tick emoji in the `FoodHelper` "Updated Crap!" notification button for better visual feedback.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.84] - 2026-04-23
### Fixed
- Reverted a regression in `FoodHelper` where marking "crap" food inadvertently cleared out items that were unseen on the page, restoring accurate retention of the list across different device sorting views.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.83] - 2026-04-23
### Changed
- Reverted the `DocumentFragment` updates from the `GangArmoryHelper` due to JavaScript iteration bottlenecking causing lag during initial render.
- Refactored `ActiveListHelper` and `BackpackHelper` DOM generation logic to inject batched elements via `DocumentFragments` to prevent multi-reflow UI execution slowdowns.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.82] - 2026-04-22
### Changed
- Heavily optimized the Gang Armory page (`GangArmoryHelper`) by buffering UI element construction inside off-DOM `DocumentFragments` before appending them, significantly improving performance by preventing repetitive browser native layout calculation slowdowns.

### Fixed
- Fixed an issue in `RatsHelper` where the grid UI failed to render for Vegetarian rats when the only items in the player's trolley were meat, introducing a defensive fallback to detect "Eww, meat!" items when action links natively disappear.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.81] - 2026-04-22
### Changed
- Changed the "Last Page" button in the Gang Hitlist top pagination to "Last Viewed Page".

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.80] - 2026-04-22
### Changed
- Refactored `FoodHelper` from a global module to a specific page module (`src/modules/page/FoodHelper.js`) to increase execution efficiency.
- Modified the `FoodHelper` table injection specifically restricting the code to only initiate when explicitly matching the standalone page (`cmd=food`) or when the "Food" tab (`a[rel="food"]`) within the Living Area is actively clicked by the user.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.79] - 2026-04-22
### Changed
- Improved Skills helper layout:
  - Faded the red background alert for empty quantity skills
  - Repositioned the "Save as Skill Set", "Set Order", and "Unequip All" configuration controls below the Skills List for better logical grouping
  - Constrained layout bounds to prevent "Skill Shop" link overlapping

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.78] - 2026-04-22
### Changed
- Moved the `DrinksHelper` Bartender Guide UI injection logic natively into the `BackpackHelper` module to increase efficiency and accurately target the specific game URL (`?cmd=backpack&use=3`).

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.77] - 2026-04-22
### Changed
- Heavily optimized the Backpack Helper by ensuring its `MutationObserver` strictly initializes when the in-page Backpack tab is clicked in the Living Area, preventing duplicate observers, verifying visibility before processing DOM elements, and avoiding unnecessary looping.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.76] - 2026-04-21
### Changed
- Replaced the direct DOM `visibility: hidden` script blocker approach with a custom injected `<style>` tag that properly mimics the native HoboWars "#222" dark gray background instead of glaring white, vastly improving visual comfort via reduced flash artifacting during module compilation.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.75] - 2026-04-21
### Changed
- Converted the Recycling Bin Helper's quick-add buttons to be fully customizable dynamically from the page via an inline floating Configure panel instead of a native prompt. Users can create, delete, and modify their preferred numeric additions with ease.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.74] - 2026-04-21
### Changed
- Reverted the default build script output naming conventions to protect existing users. The standard non-staff features script is now correctly output to `hobo-helper-latest.user.js` again, while the all-inclusive bundle has been shifted to `hobo-helper-all-latest.user.js`.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.73] - 2026-04-21
### Added
- Added completely new GangBoardStaffHelper to streamline staff tasks directly from gang message boards.
- Added "Save Repliers List" on Gang message boards allowing staff to collect a quick list of everyone who has replied to a staff topic.
- Added "Add Payment" side panel strictly on topic replies to define specific event payouts directly over the thread natively, seamlessly exporting to the Gang Loans Manager.

### Changed
- Organised project structure: Gang-specific admin scripts (GangStaffHelper, GangLoansHelper, and GangBoardStaffHelper) have been grouped and placed correctly within the `src/modules/page/staff/` directory.
- `GangHelper` was officially renamed to `GangStaffHelper` to reflect its access constraints and internal structures. All dashboard toggles now read properly for Staff members.
- Validated all remaining general member module scripts to guarantee that no staff-only logic was accidentally hidden inside the free tier.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.72] - 2026-04-21
### Changed
- Updated the release build outputs: standard release has been renamed to output/hobo-helper-member-latest.user.js, and output/hobo-helper-latest.user.js now compiles all available modules.
- Refactored build.ps1 DEV build argument passing logic, and it now generates outputs correctly incorporating all modules.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.71] - 2026-04-21
### Added
- Added a 3-build release system with per-build templates and build-time module filtering.
- Implemented script segregation so distinct production scripts are built independently for Standard Users and Staff members based on module configuration flags.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.70] - 2026-04-21
### Added
- Added Top Pagination links above the Gang Hitlist table (Previous Page, Last Viewed Page, Next Page).

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.69] - 2026-04-21
### Added
- Added an option to wrap long pagination lists on the Gang Hitlist into multiple lines to prevent horizontal scrolling.
- Added an option to automatically highlight players outside your attack range (level discrepancy > 200) on the Gang Hitlist.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.68] - 2026-04-20
### Changed
- Increased maximum height of the Saved Gang Posts & Payments panel in GangHelper for better visibility.
- The Saved Gang Posts & Payments panel now automatically scrolls to the next pending replier or payment action smoothly so you don't lose your place.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.67] - 2026-04-20
### Added
- Added Cans directly to the top navigation bar alongside Points and Tokens.
- The Cans icon uses CSS injection that correctly mimics native icon hover animations.
- Added a global number abbreviation function \Utils.abbreviateNumber()\ that formats large numbers into \k\ and \m\ suffixes for cleaner UI display.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.66] - 2026-04-20
### Added
- Added an "Export All" and "Import" functionality to the Gang Mass Mail templates (`GangHelper.js`), empowering users to easily backup, transfer, or share template data using clipboard JSON string arrays.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.65] - 2026-04-19
### Added
- Added a structured table view for the Market Watcher section on the SGHM page, including alternate row coloring and precise dollar value extraction.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.64] - 2026-04-19
### Added
- Added custom 'Нeaveп' title display for SeventhHeaven.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.63] - 2026-04-19
### Changed
- The Rat Life Progress Bar now dynamically shifts color from green to yellow to red as the rat approaches the end of its estimated lifespan.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.62] - 2026-04-19
### Changed
- Modified the Rat Life Progress Bar to fill up from the left based on the percentage of the rat's total estimated life that has already been lived, approaching 100% as the rat nears death.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.61] - 2026-04-19
### Added
- Added a visual Life Progress Bar to the Rats page showing the percentage of lifespan remaining.
- Added an Extrapolated Days calculation to the Rat Life tooltip, estimating total days to live based on expected daily meals.
- Included specialized meal tracking for **Two-Headed Rats** (12 meals/day) and **Two-Headed Sub-Rats** (10 meals/day).
- Included bonus life calculations for the **Vegetarianism** rat upgrade (`+1` life/meal).
- The `LivingAreaHelper` now automatically detects and saves your current tattoo to support other modules.
- The `RatsHelper` now properly applies the player's **Rattoo** tattoo bonuses (`+2` life/meal) to Vegetarianism calculations for extrapolation.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.60] - 2026-04-19
### Added
- Created the new `GangHitlistHelper` module specifically for the Gang Hitlist page (`cmd=gang&do=hitlist`).
- Added a "Hitlist Page Tracker" feature that remembers and visually highlights the currently selected paginated hitlist page.
- Added a "Hitlist Mark Red" interactive toggle link within the "Options" column of the hitlist table, allowing users to permanently shade specific opponent rows red across page reloads.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.59] - 2026-04-19
### Added
- Added a comprehensive Mass Mail template system allowing the saving, loading, updating, and deletion of mass mail presets on the Gang Send Mass Mail page.
- Templates automatically save the 'Send To' selection, Subject, and Body content.
- Added support for dynamic date variables in mass mail templates: `{date}` (e.g. Apr 16) and `{fullDate}` (e.g. Apr 16 2026).

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.58] - 2026-04-19
### Changed
- Updated the Gang Armory Favorites dashboard to display "Loaned to You" in green instead of a red "Not Available" warning for items currently loaned to the active user.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.57] - 2026-04-19
### Changed
- Aligned the new Sunday Funday projected payout column text to the right for improved numeric readability.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.56] - 2026-04-19
### Added
- Added a new projected payout column to individual Hobo score rows during the Sunday Funday gang event (Current and Last Happenings).

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.55] - 2026-04-19
### Changed
- Removed the text shadow styling from Grabow's custom title within the Display Helper.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.54] - 2026-04-19
### Fixed
- Fixed the base64 image asset for the permanent Buddhism rat upgrade in `RatsHelper` to precisely match the actual game icon.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.53] - 2026-04-19
### Added
- Added a legend at the bottom of the Hitlist table indicating row highlight colors (Green for currently online, Red for outside attack range).

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.52] - 2026-04-19
### Added
- Added individual configuration toggles within the Settings menu for `BackpackHelper` sub-features (Item Tooltips and Favourite Drinks UI).

### Changed
- Overhauled the Settings menu UI to display clean, human-readable module names.
- Settings menu sub-features are now dynamically wrapped in collapsible containers that hide automatically when their parent module is disabled, drastically reducing visual clutter.
- Refactored `DrinksHelper` from a global background script to a targeted page module restricted to the Mixer page, improving overall execution performance.
- Relocated static data object files to their proper data directory structure.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.51] - 2026-04-18
### Fixed
- Fixed an accessibility issue in the `RatsHelper` permanent upgrade buttons by adding `alt` attributes to injected `<img>` tags.
- Cleaned up redundant variable initialization logic in the `RatsHelper` feed UI function.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.50] - 2026-04-18
### Changed
- Improved the styling of maxed permanent Rat upgrades to include a green tick in the top-left corner and a distinct light green background for better visibility.
- Adjusted the alignment of text and icons inside permanent Rat upgrade buttons to perfectly center them vertically.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.49] - 2026-04-18
### Added
- Completely redesigned the Rat Upgrades UI into a new square-button layout with separated sections for standard and permanent upgrades.
- Added custom icons for Vegetarianism, Buddhism, and Materialism.
- Standard upgrade buttons now abbreviate their cash costs to be more compact (e.g. $15k instead of $15,000).
- Permanent upgrades now display a green tick mark when purchased.
- The standard Cheese quantity table globally displays a cheese emoji for quick reference.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.48] - 2026-04-18
### Added
- Added a "Show Next Respect Needed" feature in the Living Area that automatically calculates and displays the threshold amount for your next respect rank beneath your current respect total.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.47] - 2026-04-18
### Fixed
- Fixed a bug where the new Alive Time tracker would incorrectly reset and disappear when a player's health reached exactly 100% due to a faulty death-state check.

### Changed
- Removed the redundant parent toggle for Player features in the helper settings.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.46] - 2026-04-18
### Collapsed
- Collapsed all distinct custom player titles into one new setting: "Enable Custom Player Titles".
- Added a custom red "Pirate King" prefix title for Mugi.
- Added a custom green name color and blue "1337" suffix title for Leet.
- Added a custom red "The" prefix to Grabow to complement the existing "the Great" suffix.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.44] - 2026-04-18
### Added
- Added a new option to track and sync "Alive Time" in local storage.
- Added a new top menu bar element to display a live updating relative Alive Time.
- Added a mechanism to wipe local tracking if the player's life drops to 0%.
- Added sync logic to the Living Area that gracefully updates your alive tracker.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.43] - 2026-04-17
### Changed
- Swapped `setTimeout` debounce for `requestAnimationFrame` in the `FoodHelper` observer to ensure immediate, jitter-free UI updates when rendering food tables.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.42] - 2026-04-17
### Added
- Added `FoodBankHelper` to explicitly manage and improve the main Food Bank overview interface (`cmd=food_bank`).
- Re-formatted the "Frozen Food" and "In Trolly" lists into dynamic, responsive tables matching the Food page redesign.
- Converted the raw string "Freeze" and "Unfreeze" text links into prominent action buttons.
- Styled floating "Check all" label inputs into unified UI `.btn` toggles across both tables.
- Added adaptive row highlighting logic so user selections natively colorize rows grey upon checking.

### Fixed
- Eliminated a native code bug in HoboWars generated by duplicated default toggle text element IDs (`id="toggleSpan"`) which triggered text corruption whenever multiple "Check all" boxes were rendered on the same Food Bank view; isolating toggle listeners specifically to corresponding sets.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.41] - 2026-04-17
### Changed
- Re-formatted the Food tab consume menu into a cleaner and much more responsive table layout.
- Converted floating "Consume" action links into standard UI buttons.
- Converted floating "Check all" form actions into unified matching UI buttons.
- Added visual row-highlighting for checked/selected food items.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.40] - 2026-04-16
### Changed
- Added a confirmation dialog to the "Quick Return Branded Button" in the Living Area to prevent accidental item returns.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.39] - 2026-04-16
### Added
- Added a "Quick Return Branded Button" to the Living Area helper which inserts a persistent button next to the View List link to immediately return all loaned branded weapons.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.38] - 2026-04-16
### Changed
- The Win Percentage Calculator on the Living Area page dynamically relocates beneath the Personal Info section when the 'Always Show More Info' feature is toggled on a widened page.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.37] - 2026-04-16
### Changed
- Modified the `GangArmoryHelper` to ensure that any items currently loaned to the active user are always visible out-of-the-box, bypassing the "Hide All" group consolidation logic so users no longer have to hunt through collapsed groups for their own gear.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.36] - 2026-04-16
### Added
- Extended the script's global execution domain scope (via `@match` headers) to seamlessly support both the standard `www.hobowars.com` address and the non-www `hobowars.com` variation, fixing instances where Tampermonkey refused to run the code.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.35] - 2026-04-16
### Added
- Added descriptive hover tooltips (alternate text) to the `GangArmoryHelper` global action buttons (Show Hidden, Hide Selected, Save Favorites, Expand All) to clearly convey exactly what each action performs.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.34] - 2026-04-16
### Fixed
- Fixed an issue in `GangArmoryHelper` where browsers were aggressive caching and incorrectly restoring the selection state of checkboxes upon reloading the page. Unchecking checkboxes is now enforced programmatically via script default and `autocomplete="off"` attributes.
- Refined Gang Armory checkbox logic so that "Save Favorites" and "Hide Selected" operations explicitly deselect the checkboxes internally before prompting a page reload to guarantee a clean slate.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.33] - 2026-04-16
### Added
- Added `GangArmoryHelper` to completely overhaul the Gang Armory interface (`cmd=gang&do=armory`).
- Grouped identical weapons, armor, and rings by name into expandable categorical tables, sorted dynamically by their primary power statistics rather than alphabetically.
- Added a "Favorite Items" dashboard above the Armory tabs that lets users pin priority items, displaying real-time availability and warning in red if all copies are loaned out.
- Added an interactive "Hide Selected" system allowing users to permanently hide unwanted clutter items from the Armory view. Hidden items can be toggled back into view via a "Show Hidden" button.
- Integrated robust management for "Favorite Items" and "Hidden Items" directly into the `SettingsHelper` preferences page to easily remove individual items or reset entire lists.
- Implemented global action buttons for "Expand All", "Collapse All", and column header checkboxes to quickly select or deselect all items in a group at once.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.32] - 2026-04-15
### Fixed
- Fixed DisplayHelper custom titles (Fake Qwee and Jack Reacher) incorrectly injecting text into player avatar elements by skipping `.pavatar` elements.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.31] - 2026-04-15
### Changed
- Updated `MarketHelper` to convert inline `[Remove]` links into interactive format buttons alongside `[Buy]` links.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.30] - 2026-04-15
### Added
- **Display Helper**: Added a new setting to display a green "Major" title tag next to all profile links pointing to Jack Reacher (107380).

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.29] - 2026-04-14
### Added
- **Player Helper**: Added a clickable icon to user profiles (cmd=player) that easily copies the user's [hoboname=ID] tag to the clipboard.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.28] - 2026-04-14
### Added
- Added a \[hoboname=]\ formatting insertion button to the message editor toolbars (MessageBoardHelper.js).

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.27] - 2026-04-14
### Added
- Added a clickable copy link icon next to user IDs in the Message Board to quickly format and copy their [hoboname=ID] for replies, integrating the game's native tipTip tooltip, within \MessageBoardHelper.js\.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [9.40] - 2026-05-12
- Added FightDisplayHelper to highlight active player combat rows.
- Implemented strict duplicate script running prevention with UI warnings.
- Updated AGENTS.md with stricter guidelines regarding boolean parsing of settings object cache.

## [9.41] - 2026-05-12
- Added LivingAreaHelper.initShowTattooDays to extract and display tattoo remaining duration from the image title.

## [8.26] - 2026-04-14
### Added
- Added multi-column interactive client-side sorting for the Hitlist table (`HitlistHelper`), replacing the slow native server-refresh sorting links. Sorting configurations securely persist via browser local storage.
- Implemented a combat window highlighter within the `HitlistHelper` that automatically shades rows an alerting light red if an opponent's level drastically falls outside the player's immediate attack limits (±200 combat levels).

