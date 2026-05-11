# Changelog
All notable changes to this project will be documented in this file.

## [9.38] - 2026-05-11
### Added
- Added an Explore Log feature to `BernardsBasementHelper.js` out of necessity to track soup findings (Garlic Salmon Bisque, Cream of Okra Soup, Texas Fajita Soup, Beef Mushroom Stew) linked with their XY coordinates. Employs the `ExploreHelper.js` styled display log format grouped by date.

## [9.37] - 2026-05-11
### Added
- Added Developer Credits link functionality and modal to `LivingAreaHelper.js`.
### Fixed
- Fixed an encoding bug causing non-ASCII graphical characters to become corrupted during PowerShell builds by explicitly enforcing `UTF-8` encoding pipelines across `build.ps1` and directly enabling the `javascript-obfuscator` `--unicode-escape-sequence true` feature.

## [9.36] - 2026-05-10
### Added
- Added build artifact obfuscation support directly into the primary compilation pipeline utilizing `javascript-obfuscator` to protect released configurations.
- Updated agent instructions to seamlessly incorporate testing against obfuscated byte-code across all development workflows.

## [9.35] - 2026-05-10
### Added
- Added comprehensive active page image map definitions to natively support highlighting all areas, subpages, and custom layouts without caching issues.
- Refactored native Active Page Image tracking to support robust dynamically decoupled CSS multi-parameter matching (supports 'do', 'tent', 'room', 'place') stopping dual-highlights entirely.
- Added a toggle configuration option `NorthernFenceHelper_RestoreBanner` to conditionally restore or disable the classic custom Suicide Hill UI header graphic cleanly based on user preference.

## [9.34] - 2026-05-10
### Changed
- Dummy version for update testing.

## [9.33] - 2026-05-10
### Fixed
- Fixed an issue where the Update Checker inside the Settings page would only point to the standard release script, downgrading installed Staff builds. It now accurately dynamically parses the active script type (Beta, Core, All) to download the correct branch.
- Included explicit Build Type indicators alongside the version string on the settings page for easier debug reference.

## [9.32] - 2026-05-10
### Added
- Added an optional link to the Gang Hitlist at the end of the top bar menu (can be toggled in Preferences).

## [9.31] - 2026-05-10
### Changed
- Food Bank lists (Frozen and In Trolly) now display side-by-side if the page is widened (over 950px layout).

## [9.30] - 2026-05-10
### Added
- Added a "Race Again" button to the results page when racing an NPC Pikie in the Northern Fence.

## [9.29] - 2026-05-09
### Fixed
- Fixed an issue where breaking a 'Spelunking Satchel' or other equipment in the mines would mistakenly parse and log it as an acquired ore type.

## [9.28] - 2026-05-08
- **Changed:** Swapped the Active Miners list map outline animation from a flashing color to a continuous expanding blue pulse overlay for 5 seconds using `outline-offset` instead of `box-shadow` (for robust table compatibility).

## [9.27] - 2026-05-08
- **Added:** Added an Active Miners list to the left column while exploring the Mines. It lists all players visible on the map and their coordinates. Clicking on a player initiates a 5-second flashing highlight on their map location for easy tracking.

## [9.26] - 2026-05-08
- **Added:** Added a new setting to the Mines helper to highlight players on the mini-map. Other players are outlined in red, and the player character ("You!") is outlined in green.

## [9.25] - 2026-05-08
- **Changed:** Optimised helper module categorisation by reassigning ExploreHelper, BankHelper, BernardsBasementHelper, LiquorStoreHelper, and CanDepoHelper to the City group. MessageBoardHelper has been shifted to General, LockoutHelper to Global, and RecyclingBinHelper to the Canbodia group.

## [9.24] - 2026-05-08
- **Removed:** Abandoned experimental Mine Pattern helper and canvas scaling features.

## [9.23] - 2026-05-07
- **Changed:** Grouped repeated saved hobos in the Mining Log by ID and added count indicators next to their names (e.g., PlayerName (x3)).
- **Fixed:** Reverted fixed base64 strings for Green Ore, Yellow Ore, and Orange Ore that were causing image display issues.

## [9.22] - 2026-05-07
- **Added:** Added support for recording saved hobos inside the Mining Log. "Hobos Saved" will now render as a bulleted section containing player name links when a trapped player is pulled to safety.

## [9.21] - 2026-05-07
- **Fixed:** Fixed an issue where the trade limits (badges) and formatted Ore quantities were disappearing from the Trading Post because the display formatting was executing out of order and destroying the DOM layout prematurely.

## [9.20] - 2026-05-06
- **Added:** Added an HTML table restyling the native list of registered racers on the race registration page (`cmd=hill3&do=list`).
- **Added:** Added an exact historical skill readout per racer dynamically pulled from the Super-Cart Racing Skill Tracker object data.
- **Added:** Automatically highlights the current player's row if they are actively signed up for the given race class.

## [9.19] - 2026-05-05
- **Changed:** Increased height and bottom padding for the Ore icons inside formatted elements to prevent bottom overflow text overlapping.
- **Fixed:** Fixed an issue where the Mining Log was inflating "T used" values endlessly by grabbing the total instead of delta. Also added explicit zeroing for URL refreshes containing `move=nowhere`.

## [9.18] - 2026-05-05
- **Fixed:** Fixed an issue where the side box mining stats table was parsing formatting HTML tags incorrectly, resulting in "0's".
- **Fixed:** Overhauled data cache integrity iteration for the Mining Log rendering system. Fixed a fatal crash preventing the log from appending correctly at the bottom of the `.content-area` view if historical JSON entries were skewed.

## [9.17] - 2026-05-05
- **Added:** Added dynamic "#" row numbers to the Super-Cart Racing Skill Tracker table to easily identify ranks across pagination.
- **Added:** Added "Hide 0 Weekly Gains" and "Hide 0 Total Gains" checkboxes to the Super-Cart Racing Skill Tracker filters, allowing users to cleanly exclude stagnant inactive hobos from their tracked readouts natively.

## [9.16] - 2026-05-05
- **Added:** Expanded the Super-Cart Racing Skill Tracker to include an independent Weekly Gains metric alongside Total Gains. Metrics automatically checkpoint every Monday at midnight server time without resetting the all-time history.

## [9.15] - 2026-05-05
- **Added:** Added a "Super-Cart Racing Skill Tracker" element inside `NorthernFenceHelper` for the Hall of Fame interface. It actively records and maps rank changes across Hall of Fame pages and builds a dynamic, sortable, locally paginated table of Top Hobos exhibiting stat progression, while saving layout persistence locally.
- **Added:** Appended a collapsible active/total racers summary chart mapping activity breakdown per racing tier inside the Super-Cart Racing Skill Tracker.
- **Fixed:** Corrected a localized regression in helper scripts causing data object corruption due to improper local storage literal string casting.

## [9.14] - 2026-05-05
- **Changed:** Refined the 'Trading Post' visual layout in `MinesHelper`. Restored the net stat gain total header, split individual stats onto multiple lines for better readability, fixed missing image parsing bugs on non-stat purchases, and condensed card heights.

## [9.13] - 2026-05-04
- **Added:** Added `MinesHelper` functionality. Overhauls the visual display of the active hobo list inside the mines into a neat sortable HTML table.
- **Added:** A light green overlay is now drawn directly onto the Mines map to visualize and highlight standard safe-zone tiles where items drop and combat pauses.
- **Added:** The text-based Mining Stats readout has been completely overhauled into a formatted block data table.

## [9.12] - 2026-05-03
- **Added:** Added a "Full Width Log Graphs" setting (enabled by default) to force the native Living Area stat log charts to utilize 100% of the page width.

## [9.11] - 2026-05-03
- **Fixed:** Corrected execution order inside `HitlistHelper` to ensure the Experience dictionary data is properly loaded into the DOM before the automatic Multi-Sort logic attempts to evaluate rows.

## [9.10] - 2026-05-03
- **Fixed:** Resolved an issue where the Gang Staff Helper would fail to display the "Sunday Funday" estimated payouts panel due to missing URL parameters on modern gang overview pages.

## [9.09] - 2026-05-03
- **Fixed:** Disabled browser autofill specifically on SyncHelper credential inputs within the Settings UI to prevent accidental overwriting of database configurations with standard game passwords.

## [9.08] - 2026-05-03
- **Added:** Added a "Show Experience" settings toggle to the `HitlistHelper` to easily hide or display the experience column within the native Preferences menu.
- **Fixed:** Prevented `BattleLogHelper` from caching instances of `0` experience, keeping the experience mapping strictly to positive gains.

## [9.07] - 2026-05-02
- **Fixed:** Resolved a critical cross-device settings wiping issue in the Cloud Sync implementation by strictly scrubbing and gracefully repacking `hw_helper_settings` during downstream sync execution.
- **Added:** Introduced a `get_sync_data` script testing tool for inspecting active CouchDB replication sync payloads server-side.

## [9.06] - 2026-05-02
- **Added:** Automatically group items within the explore log visually by date.
- **Added:** Cloud Sync settings (Server URL, Username, Password, and Enable flag) are now explicitly locked to the local device and will not synchronize externally.
- **Added:** Integrated an automated startup migration loop that automatically extracts trapped local-only configuration variables from the legacy synchronisation payload mapping.

## [9.05] - 2026-05-02
- **Fixed:** Corrected the URL matching logic and settings label for the Bernard's Basement map feature.

## [9.04] - 2026-05-02
- **Fixed:** Resolved a regression where the Living Area layout auto-expansion wasn't operating properly due to older module settings retrieval ignoring device-local boundaries.
- **Changed:** Refactored all remaining legacy modules (Weapons, GangStaff, Can Deposit, Recycling Bin, Bernard's Basement) to rely on the centralized caching layer for configuration loading.

## [9.03] - 2026-05-01
- **Fixed:** Resolved a configuration loading glitch in the script bootstrap wrapper that caused newly segregated local-only settings (like Widen Content Area) to appear unresponsive when interacting with their UI toggles.

## [9.02] - 2026-05-01
- **Added:** Implemented local-only storage capabilities to selectively disable Cloud Sync synchronization on specific device-dependent variables.
- **Changed:** Refactored `DisplayHelper` "Widen Content Area" settings to remain device-specific and ignore cross-device syncs.
- **Changed:** Refactored Custom Bank Goal configurations to remain device-specific and ignore cross-device syncs, along with several background awakeness tracker metrics.

## [9.01] - 2026-04-30
- **Fixed:** Resolved the "Update Goals" stat ratio settings failing to save or retract due to stale cache overwrites in `LivingAreaHelper.js`.

## [9.00] - 2026-04-30
- **Changed:** Refactored Cloud Sync interval checks so local state updates dynamically skip external CouchDB network loops during standard UI reads, only pushing data when explicitly saving configurations.
- **Changed:** Synchronised Cloud Sync debounce interval queue down to 100ms, creating instantaneous near-real-time active background updates across multiple tabs.
- **Changed:** Removed obsolete `src` image properties from tracked `bh_drink_stats` storage arrays to drastically reduce the sync payload size. Passive migration logic silently handles legacy data types.
- **Fixed:** Resolved a double-sync race condition inside the `LivingAreaHelper` stat tracker caused by rapid, continuous callback loops.

## [8.99] - 2026-04-30
- **Added:** Cloud Sync auto-pulls settings data from the server automatically if the device has been inactive for more than 5 minutes.
- **Changed:** Refactored Cloud Sync to use the `Utils.getItem` and `Utils.setItem` wrappers instead of direct `localStorage` access.
- **Fixed:** Prevented infinite synchronization loops by correctly ignoring internal `hw_sync_` meta keys from triggering syncs.

## [8.98] - 2026-04-30
- **Added:** Implemented seamless cross-browser Cloud Sync via the new `SyncHelper`! By placing custom CouchDB configuration credentials directly in your Preferences menu, your device will now automatically push and pull local script data using intelligent, bidirectional conflict resolution merging.
- **Added:** A "Force Sync" quick-toggle button has been added directly to the "Hobo Helper Version" footer block inside your Living Area.
- **Added:** Testing backend connection integrity is now possible directly from within the Preferences page with a functional status text readout.
- **Changed:** Rewrote internal helper memory cache handling to natively interface with `Utils.setItem`, `Utils.getItem`, `Utils.removeItem`, unifying and protecting Cloud Sync trigger hooks.
- **Changed:** Restricted internal debugger output directly to local `Dev` builds by wrapping `console.log` instances inside `Utils.log`.

## [8.97] - 2026-04-29
- **Added:** Added a note to the bottom of the automatic update popup indicating that it can be disabled in the preferences via the Display Helper settings.
- **Changed:** Centered the changelog modal vertically and horizontally on the screen for better readability.

## [8.96] - 2026-04-29
- **Added:** Introduced granular configuration settings to the `Explore Helper` allowing users to specifically toggle exactly which events (`Shiny Objects`, `Arena Passes`) populate their custom exploration log.
- **Added:** The `Explore Helper` now detects and records "Arena Pass" discovery events highlighting them in bold purple within the log interface.
- **Added:** Implemented an automatic Update Checker that proactively displays a filtered changelog of all new features since your last installed version, directly in the game UI.
- **Added:** `Show Update Features on New Version` setting added to the Display Helper to allow toggling of the automatic update notification popups.
- **Changed:** Expanded the changelog modal data buffer to include the 10 most recent versions instead of 5, providing a deeper history for returning players.

## [8.95] - 2026-04-28
- **Added:** Implemented the `ExploreHelper` to track and log in-game explore events across the main Lobby and Movement screens (`cmd=explore`). Events are stored persistently across sessions.
- **Added:** Explore Log now specifically captures vanishing "Shiny Objects" with a gold color-coding mapping, tracking the time and exact coordinates.

## [8.94] - 2026-04-28
- **Added:** Display Helper's Live Alive Time string will now dynamically render hour increments for significantly extended sessions.
- **Fixed:** The Living Area Helper offline healing timer array parser correctly hooks into durations exceeding an hour with non-standard formatting gaps syntax (`Alive: 01 hr 12 min 05 sec`).

## [8.93] - 2026-04-28
- **Changed:** Heavily optimized DisplayHelper sub-features by batching injected `<style>` elements into a single DOM paint, significantly reducing browser CSS recalculations.
- **Fixed:** Replaced `innerHTML` destructive mutations with `insertAdjacentHTML` when applying Custom Player Titles, eliminating heavy DOM serialization processing in high-density member pages.

## [8.92] - 2026-04-28
- **Changed:** Refactored the Display Helper Custom Player Titles feature to utilize a single unified array mapped DOM scanner, resulting in dramatically improved script performance on pages with high member concentrations compared to iterating multiple separate DOM scans.

## [8.91] - 2026-04-25
- **Changed:** Restructured the `HitlistHelper` multi-column sorting configuration UI to start collapsed above the table, drastically reducing vertical clutter while remaining easily accessible for editing.

## [8.90] - 2026-04-25
- **Changed:** Moved the Configure button in the Recycling Bin Helper to the far right of the submit controls for better layout flow.

## [8.89] - 2026-04-24
- **Changed:** Swapped the Battle Graph chart types: Health Remaining is now a descending Line chart for continuous tracking, and Damage Dealt is now a stacked Bar chart to better illustrate each fighter's individual hits per round without jarring line drops.

## [8.88] - 2026-04-24
- **Enhanced:** The Battle Graph panel is now resizable via CSS `resize: both`. The internal jqplot charts automatically resize to fit using a ResizeObserver to maintain aspect ratios correctly alongside the frame.

## [8.87] - 2026-04-24
- **Added:** Added a [show graph] button to battle results pages. Clicking it opens a floating panel containing two jqplot graphs: a bar chart displaying health remaining per round, and a line chart plotting damage dealt per round.

## [8.86] - 2026-04-24
- **Added:** New system to track continuous "session rejoin time", preventing 30-min-inactive users from being marked active initially until they establish a 30s session.
- **Added:** New logic to conditionally bypass 30s session tracking wait if the user returns with 0 Awakeness.
- **Added:** Display of calculated "Lost Awake" for players logging back in with a full awake bar after being inactive for more than 30 mins.
- **Changed:** Rewrote the donator checking logic to solely utilize the newer `.becomedon` interface matching standard DOM text content, greatly improving check speed and dropping legacy regex evaluations.
- **Changed:** Slightly increased the height of action buttons in the Rats UI.
- **Fixed:** Corrected an issue where checkboxes inside the Food Helper UI did not trigger the underlying game event listeners for updating row highlights.
- **Removed:** staff-latest.user.js from the build compilation pipeline.

## [8.85] - 2026-04-23
### Fixed
- Replaced the purple check mark with a proper green tick emoji in the `FoodHelper` "Updated Crap!" notification button for better visual feedback.

## [8.84] - 2026-04-23
### Fixed
- Reverted a regression in `FoodHelper` where marking "crap" food inadvertently cleared out items that were unseen on the page, restoring accurate retention of the list across different device sorting views.

## [8.83] - 2026-04-23
### Changed
- Reverted the `DocumentFragment` updates from the `GangArmoryHelper` due to JavaScript iteration bottlenecking causing lag during initial render.
- Refactored `ActiveListHelper` and `BackpackHelper` DOM generation logic to inject batched elements via `DocumentFragments` to prevent multi-reflow UI execution slowdowns.

## [8.82] - 2026-04-22
### Changed
- Heavily optimized the Gang Armory page (`GangArmoryHelper`) by buffering UI element construction inside off-DOM `DocumentFragments` before appending them, significantly improving performance by preventing repetitive browser native layout calculation slowdowns.

### Fixed
- Fixed an issue in `RatsHelper` where the grid UI failed to render for Vegetarian rats when the only items in the player's trolley were meat, introducing a defensive fallback to detect "Eww, meat!" items when action links natively disappear.

## [8.81] - 2026-04-22
### Changed
- Changed the "Last Page" button in the Gang Hitlist top pagination to "Last Viewed Page".

## [8.80] - 2026-04-22
### Changed
- Refactored `FoodHelper` from a global module to a specific page module (`src/modules/page/FoodHelper.js`) to increase execution efficiency.
- Modified the `FoodHelper` table injection specifically restricting the code to only initiate when explicitly matching the standalone page (`cmd=food`) or when the "Food" tab (`a[rel="food"]`) within the Living Area is actively clicked by the user.

## [8.79] - 2026-04-22
### Changed
- Improved Skills helper layout:
  - Faded the red background alert for empty quantity skills
  - Repositioned the "Save as Skill Set", "Set Order", and "Unequip All" configuration controls below the Skills List for better logical grouping
  - Constrained layout bounds to prevent "Skill Shop" link overlapping

## [8.78] - 2026-04-22
### Changed
- Moved the `DrinksHelper` Bartender Guide UI injection logic natively into the `BackpackHelper` module to increase efficiency and accurately target the specific game URL (`?cmd=backpack&use=3`).

## [8.77] - 2026-04-22
### Changed
- Heavily optimized the Backpack Helper by ensuring its `MutationObserver` strictly initializes when the in-page Backpack tab is clicked in the Living Area, preventing duplicate observers, verifying visibility before processing DOM elements, and avoiding unnecessary looping.

## [8.76] - 2026-04-21
### Changed
- Replaced the direct DOM `visibility: hidden` script blocker approach with a custom injected `<style>` tag that properly mimics the native HoboWars "#222" dark gray background instead of glaring white, vastly improving visual comfort via reduced flash artifacting during module compilation.

## [8.75] - 2026-04-21
### Changed
- Converted the Recycling Bin Helper's quick-add buttons to be fully customizable dynamically from the page via an inline floating Configure panel instead of a native prompt. Users can create, delete, and modify their preferred numeric additions with ease.

## [8.74] - 2026-04-21
### Changed
- Reverted the default build script output naming conventions to protect existing users. The standard non-staff features script is now correctly output to `hobo-helper-latest.user.js` again, while the all-inclusive bundle has been shifted to `hobo-helper-all-latest.user.js`.

## [8.73] - 2026-04-21
### Added
- Added completely new GangBoardStaffHelper to streamline staff tasks directly from gang message boards.
- Added "Save Repliers List" on Gang message boards allowing staff to collect a quick list of everyone who has replied to a staff topic.
- Added "Add Payment" side panel strictly on topic replies to define specific event payouts directly over the thread natively, seamlessly exporting to the Gang Loans Manager.

### Changed
- Organised project structure: Gang-specific admin scripts (GangStaffHelper, GangLoansHelper, and GangBoardStaffHelper) have been grouped and placed correctly within the `src/modules/page/staff/` directory.
- `GangHelper` was officially renamed to `GangStaffHelper` to reflect its access constraints and internal structures. All dashboard toggles now read properly for Staff members.
- Validated all remaining general member module scripts to guarantee that no staff-only logic was accidentally hidden inside the free tier.

## [8.72] - 2026-04-21
### Changed
- Updated the release build outputs: standard release has been renamed to output/hobo-helper-member-latest.user.js, and output/hobo-helper-latest.user.js now compiles all available modules.
- Refactored build.ps1 DEV build argument passing logic, and it now generates outputs correctly incorporating all modules.

## [8.71] - 2026-04-21
### Added
- Added a 3-build release system with per-build templates and build-time module filtering.
- Implemented script segregation so distinct production scripts are built independently for Standard Users and Staff members based on module configuration flags.

## [8.70] - 2026-04-21
### Added
- Added Top Pagination links above the Gang Hitlist table (Previous Page, Last Viewed Page, Next Page).

## [8.69] - 2026-04-21
### Added
- Added an option to wrap long pagination lists on the Gang Hitlist into multiple lines to prevent horizontal scrolling.
- Added an option to automatically highlight players outside your attack range (level discrepancy > 200) on the Gang Hitlist.

## [8.68] - 2026-04-20
### Changed
- Increased maximum height of the Saved Gang Posts & Payments panel in GangHelper for better visibility.
- The Saved Gang Posts & Payments panel now automatically scrolls to the next pending replier or payment action smoothly so you don't lose your place.

## [8.67] - 2026-04-20
### Added
- Added Cans directly to the top navigation bar alongside Points and Tokens.
- The Cans icon uses CSS injection that correctly mimics native icon hover animations.
- Added a global number abbreviation function \Utils.abbreviateNumber()\ that formats large numbers into \k\ and \m\ suffixes for cleaner UI display.

## [8.66] - 2026-04-20
### Added
- Added an "Export All" and "Import" functionality to the Gang Mass Mail templates (`GangHelper.js`), empowering users to easily backup, transfer, or share template data using clipboard JSON string arrays.

## [8.65] - 2026-04-19
### Added
- Added a structured table view for the Market Watcher section on the SGHM page, including alternate row coloring and precise dollar value extraction.

## [8.64] - 2026-04-19
### Added
- Added custom 'Нeaveп' title display for SeventhHeaven.

## [8.63] - 2026-04-19
### Changed
- The Rat Life Progress Bar now dynamically shifts color from green to yellow to red as the rat approaches the end of its estimated lifespan.

## [8.62] - 2026-04-19
### Changed
- Modified the Rat Life Progress Bar to fill up from the left based on the percentage of the rat's total estimated life that has already been lived, approaching 100% as the rat nears death.

## [8.61] - 2026-04-19
### Added
- Added a visual Life Progress Bar to the Rats page showing the percentage of lifespan remaining.
- Added an Extrapolated Days calculation to the Rat Life tooltip, estimating total days to live based on expected daily meals.
- Included specialized meal tracking for **Two-Headed Rats** (12 meals/day) and **Two-Headed Sub-Rats** (10 meals/day).
- Included bonus life calculations for the **Vegetarianism** rat upgrade (`+1` life/meal).
- The `LivingAreaHelper` now automatically detects and saves your current tattoo to support other modules.
- The `RatsHelper` now properly applies the player's **Rattoo** tattoo bonuses (`+2` life/meal) to Vegetarianism calculations for extrapolation.

## [8.60] - 2026-04-19
### Added
- Created the new `GangHitlistHelper` module specifically for the Gang Hitlist page (`cmd=gang&do=hitlist`).
- Added a "Hitlist Page Tracker" feature that remembers and visually highlights the currently selected paginated hitlist page.
- Added a "Hitlist Mark Red" interactive toggle link within the "Options" column of the hitlist table, allowing users to permanently shade specific opponent rows red across page reloads.

## [8.59] - 2026-04-19
### Added
- Added a comprehensive Mass Mail template system allowing the saving, loading, updating, and deletion of mass mail presets on the Gang Send Mass Mail page.
- Templates automatically save the 'Send To' selection, Subject, and Body content.
- Added support for dynamic date variables in mass mail templates: `{date}` (e.g. Apr 16) and `{fullDate}` (e.g. Apr 16 2026).

## [8.58] - 2026-04-19
### Changed
- Updated the Gang Armory Favorites dashboard to display "Loaned to You" in green instead of a red "Not Available" warning for items currently loaned to the active user.

## [8.57] - 2026-04-19
### Changed
- Aligned the new Sunday Funday projected payout column text to the right for improved numeric readability.

## [8.56] - 2026-04-19
### Added
- Added a new projected payout column to individual Hobo score rows during the Sunday Funday gang event (Current and Last Happenings).

## [8.55] - 2026-04-19
### Changed
- Removed the text shadow styling from Grabow's custom title within the Display Helper.

## [8.54] - 2026-04-19
### Fixed
- Fixed the base64 image asset for the permanent Buddhism rat upgrade in `RatsHelper` to precisely match the actual game icon.

## [8.53] - 2026-04-19
### Added
- Added a legend at the bottom of the Hitlist table indicating row highlight colors (Green for currently online, Red for outside attack range).

## [8.52] - 2026-04-19
### Added
- Added individual configuration toggles within the Settings menu for `BackpackHelper` sub-features (Item Tooltips and Favourite Drinks UI).

### Changed
- Overhauled the Settings menu UI to display clean, human-readable module names.
- Settings menu sub-features are now dynamically wrapped in collapsible containers that hide automatically when their parent module is disabled, drastically reducing visual clutter.
- Refactored `DrinksHelper` from a global background script to a targeted page module restricted to the Mixer page, improving overall execution performance.
- Relocated static data object files to their proper data directory structure.

## [8.51] - 2026-04-18
### Fixed
- Fixed an accessibility issue in the `RatsHelper` permanent upgrade buttons by adding `alt` attributes to injected `<img>` tags.
- Cleaned up redundant variable initialization logic in the `RatsHelper` feed UI function.

## [8.50] - 2026-04-18
### Changed
- Improved the styling of maxed permanent Rat upgrades to include a green tick in the top-left corner and a distinct light green background for better visibility.
- Adjusted the alignment of text and icons inside permanent Rat upgrade buttons to perfectly center them vertically.

## [8.49] - 2026-04-18
### Added
- Completely redesigned the Rat Upgrades UI into a new square-button layout with separated sections for standard and permanent upgrades.
- Added custom icons for Vegetarianism, Buddhism, and Materialism.
- Standard upgrade buttons now abbreviate their cash costs to be more compact (e.g. $15k instead of $15,000).
- Permanent upgrades now display a green tick mark when purchased.
- The standard Cheese quantity table globally displays a cheese emoji for quick reference.

## [8.48] - 2026-04-18
### Added
- Added a "Show Next Respect Needed" feature in the Living Area that automatically calculates and displays the threshold amount for your next respect rank beneath your current respect total.

## [8.47] - 2026-04-18
### Fixed
- Fixed a bug where the new Alive Time tracker would incorrectly reset and disappear when a player's health reached exactly 100% due to a faulty death-state check.

### Changed
- Removed the redundant parent toggle for Player features in the helper settings.

## [8.46] - 2026-04-18
- Collapsed all distinct custom player titles into one new setting: "Enable Custom Player Titles".
- Added a custom red "Pirate King" prefix title for Mugi.
- Added a custom green name color and blue "1337" suffix title for Leet.
- Added a custom red "The" prefix to Grabow to complement the existing "the Great" suffix.

## [8.44] - 2026-04-18
### Added
- Added a new option to track and sync "Alive Time" in local storage.
- Added a new top menu bar element to display a live updating relative Alive Time.
- Added a mechanism to wipe local tracking if the player's life drops to 0%.
- Added sync logic to the Living Area that gracefully updates your alive tracker.

## [8.43] - 2026-04-17
### Changed
- Swapped `setTimeout` debounce for `requestAnimationFrame` in the `FoodHelper` observer to ensure immediate, jitter-free UI updates when rendering food tables.

## [8.42] - 2026-04-17
### Added
- Added `FoodBankHelper` to explicitly manage and improve the main Food Bank overview interface (`cmd=food_bank`).
- Re-formatted the "Frozen Food" and "In Trolly" lists into dynamic, responsive tables matching the Food page redesign.
- Converted the raw string "Freeze" and "Unfreeze" text links into prominent action buttons.
- Styled floating "Check all" label inputs into unified UI `.btn` toggles across both tables.
- Added adaptive row highlighting logic so user selections natively colorize rows grey upon checking.

### Fixed
- Eliminated a native code bug in HoboWars generated by duplicated default toggle text element IDs (`id="toggleSpan"`) which triggered text corruption whenever multiple "Check all" boxes were rendered on the same Food Bank view; isolating toggle listeners specifically to corresponding sets.

## [8.41] - 2026-04-17
### Changed
- Re-formatted the Food tab consume menu into a cleaner and much more responsive table layout.
- Converted floating "Consume" action links into standard UI buttons.
- Converted floating "Check all" form actions into unified matching UI buttons.
- Added visual row-highlighting for checked/selected food items.

## [8.40] - 2026-04-16
### Changed
- Added a confirmation dialog to the "Quick Return Branded Button" in the Living Area to prevent accidental item returns.

## [8.39] - 2026-04-16
### Added
- Added a "Quick Return Branded Button" to the Living Area helper which inserts a persistent button next to the View List link to immediately return all loaned branded weapons.

## [8.38] - 2026-04-16
### Changed
- The Win Percentage Calculator on the Living Area page dynamically relocates beneath the Personal Info section when the 'Always Show More Info' feature is toggled on a widened page.

## [8.37] - 2026-04-16
### Changed
- Modified the `GangArmoryHelper` to ensure that any items currently loaned to the active user are always visible out-of-the-box, bypassing the "Hide All" group consolidation logic so users no longer have to hunt through collapsed groups for their own gear.

## [8.36] - 2026-04-16
### Added
- Extended the script's global execution domain scope (via `@match` headers) to seamlessly support both the standard `www.hobowars.com` address and the non-www `hobowars.com` variation, fixing instances where Tampermonkey refused to run the code.

## [8.35] - 2026-04-16
### Added
- Added descriptive hover tooltips (alternate text) to the `GangArmoryHelper` global action buttons (Show Hidden, Hide Selected, Save Favorites, Expand All) to clearly convey exactly what each action performs.

## [8.34] - 2026-04-16
### Fixed
- Fixed an issue in `GangArmoryHelper` where browsers were aggressive caching and incorrectly restoring the selection state of checkboxes upon reloading the page. Unchecking checkboxes is now enforced programmatically via script default and `autocomplete="off"` attributes.
- Refined Gang Armory checkbox logic so that "Save Favorites" and "Hide Selected" operations explicitly deselect the checkboxes internally before prompting a page reload to guarantee a clean slate.

## [8.33] - 2026-04-16
### Added
- Added `GangArmoryHelper` to completely overhaul the Gang Armory interface (`cmd=gang&do=armory`).
- Grouped identical weapons, armor, and rings by name into expandable categorical tables, sorted dynamically by their primary power statistics rather than alphabetically.
- Added a "Favorite Items" dashboard above the Armory tabs that lets users pin priority items, displaying real-time availability and warning in red if all copies are loaned out.
- Added an interactive "Hide Selected" system allowing users to permanently hide unwanted clutter items from the Armory view. Hidden items can be toggled back into view via a "Show Hidden" button.
- Integrated robust management for "Favorite Items" and "Hidden Items" directly into the `SettingsHelper` preferences page to easily remove individual items or reset entire lists.
- Implemented global action buttons for "Expand All", "Collapse All", and column header checkboxes to quickly select or deselect all items in a group at once.

## [8.32] - 2026-04-15
### Fixed
- Fixed DisplayHelper custom titles (Fake Qwee and Jack Reacher) incorrectly injecting text into player avatar elements by skipping `.pavatar` elements.

## [8.31] - 2026-04-15
### Changed
- Updated `MarketHelper` to convert inline `[Remove]` links into interactive format buttons alongside `[Buy]` links.

## [8.30] - 2026-04-15
### Added
- **Display Helper**: Added a new setting to display a green "Major" title tag next to all profile links pointing to Jack Reacher (107380).

## [8.29] - 2026-04-14
### Added
- **Player Helper**: Added a clickable icon to user profiles (cmd=player) that easily copies the user's [hoboname=ID] tag to the clipboard.

## [8.28] - 2026-04-14
### Added
- Added a \[hoboname=]\ formatting insertion button to the message editor toolbars (MessageBoardHelper.js).

## [8.27] - 2026-04-14
### Added
- Added a clickable copy link icon next to user IDs in the Message Board to quickly format and copy their [hoboname=ID] for replies, integrating the game's native tipTip tooltip, within \MessageBoardHelper.js\.

## [8.26] - 2026-04-14
### Added
- Added multi-column interactive client-side sorting for the Hitlist table (`HitlistHelper`), replacing the slow native server-refresh sorting links. Sorting configurations securely persist via browser local storage.
- Implemented a combat window highlighter within the `HitlistHelper` that automatically shades rows an alerting light red if an opponent's level drastically falls outside the player's immediate attack limits (±200 combat levels).

### Changed
- Updated `AGENTS.md` instructions specifically to mandate the continued usage and expansion of centralized internal game value retrieval methods located within the `Utils` class instead of continuously duplicating generic operations within separate modules.

## [8.25] - 2026-04-13
### Changed
- Updated the "Next Interesting Level" display to indicate when your current level is a prime number.
- Optimised the underlying primes data set to only track primes up to level 1000.

## [8.24] - 2026-04-13
### Added
- Added functionality to explicitly display the calculated Total Payout amount directly within the "Push Payouts to Dashboard" panel on completed 'Gangsters Sunday = Funday' event summary pages.

## [8.23] - 2026-04-13
### Fixed
- Fixed an issue where the `GangHelper` incorrectly attempted to run non-existent loans logic on the gang loans page instead of cleanly deferring to `GangLoansHelper`.

## [8.22] - 2026-04-12
### Added
- Added an "Attack Range" checkbox filter to `ActiveListHelper` that instantly restricts the viewable opponent list exclusively to players falling within your immediate combat level range (±200 levels of your current Hobo level). Filter persistently saves to local storage.

## [8.21] - 2026-04-12
### Added
- Added `ActiveListHelper` module for the Recently Active players list page (`cmd=active`).
- Added an interactive "Alive / Dead" filtering button system to the Active List page, allowing users to dynamically hide dead players or show everyone. The selected filter state is automatically saved securely via local storage to persist between page reloads.

## [8.20] - 2026-04-12
### Added
- Added `MarketHelper` for the marketplace, enabling new customized features inside the SuperGlobalHyperMart.
- Added visual injections for the marketplace table to dynamically embed 40x40 item thumbnails alongside their text entry. Automatically fetches visuals for Weapons, Armor, and Cart Parts.
- Upgraded the Market navigation UI: "Switch to:" destination links (Points, Tokens, DPS, Weapons, Armor, Cart Parts) and individual row `[Buy]` text links have been stripped of brackets/commas and stylized as native platform buttons instead of small links for improved clicking experience.

## [8.19] - 2026-04-12
### Added
- Added permanent Bank Goal shortcut buttons (+5k, +10k, +50k) to the Bank withdraw interface. These can be toggled via the new `BankHelper_FixedGoals` setting.

### Changed
- Removed the inline click-count tracking text on the 5 Fighter's Lunches Bank Goal button, as the main dollar amount input field clearly shows the total progress.

## [8.18] - 2026-04-12
### Changed
- Capped the "Show Next Interesting Level" feature by removing primes over 1000 from the local data registry, as higher values are not needed.

## [8.17] - 2026-04-12
### Changed
- Refined the "Show Next Interesting Level" feature to use your current level as the goal indicator if you are currently at a prime level, instead of skipping to the subsequent prime.

## [8.16] - 2026-04-12
### Added
- Added a "Show Next Interesting Level" feature to `DisplayHelper` that automatically displays the next prime level next to your current level on the UI. This can be toggled via settings.

## [8.15] - 2026-04-12
### Added
- Added the projected Event Payout Manager to the current gang happenings page on Sundays, restricted to users with Gang Staff access.

### Changed
- Unified the Event Payout Manager UI between the last happenings and current happenings page, displaying projected totals autonomously.
- Split the Event Payout Manager's save functionality so 'Save Tier Settings' operates independently of 'Push Payouts to Dashboard'.

## [8.14] - 2026-04-12
### Changed
- Improved the visual presentation of the rat experience bars on the `RatsHelper` feed page by adding a distinct border to clearly indicate 100% capacity.
- Compacted the "Feed" buttons on the `RatsHelper` feed page to reduce vertical footprint and improve readability.
- Converted the main navigation text links on the primary Rat page (Active rat, Pet Cemetery, Rat Store, More Information, Rat Fund, News alerts) into a unified, button-based UI layout for a more tactile experience.

## [8.13] - 2026-04-11
### Changed
- Improved the visual styling of the newly added "Mass Mails" filter buttons in `GangHelper`, converting them into polished, interactive pill-style buttons with active state indicators.

## [8.12] - 2026-04-10
### Added
- Added formatting to the Mass Mails list on the Gang Read Mail page via `GangHelper`. Converts the text list into a readable table with colored read/unread status, numeric counts, and table row filtering options.

## [8.11] - 2026-04-09
### Changed
- Replaced the flat payment rate for `Gangsters Sunday = Funday` payouts via `GangHelper` with a highly configurable multi-tier dynamic payout system. Users can now define minimum, maximum point brackets, and uniquely corresponding price-per-point tier rates.
- Automatically formatted Max Payout and tier rate input values, as well as generated payout amounts, with comma separation and dollar signs for clean data presentation.

## [8.10] - 2026-04-09
### Added
- Added the ability to successfully parse and render inline CSV data into fully styled HTML tables within Message Board posts utilizing the custom `[hobo-helper-table]` tag system.
- Formatted rendered table rows with alternating cell highlighting for easier reading of large data sheets. Can be toggled on or off via the new "Render Data Tables in Posts" setting within the Helper Settings menu.

## [8.09] - 2026-04-09
### Added
- Added the ability to remove statistics for individual drinks within the `BackpackHelper` Favourite Drinks stats modal, alongside the existing reset all capability.

## [8.08] - 2026-04-09
### Fixed
- Globally replaced `.innerText` with `.textContent` across all helper scripts to permanently eradicate a widespread bug where HoboWars' Responsive Layout hiding elements from view caused JavaScript text scraping to fail and return blank strings.
- Restored broken functionality to the `WellnessClinicHelper` cumulative spend tracker logic directly resulting from this bug.

## [8.07] - 2026-04-09
### Fixed
- Fixed a bug in `RatsHelper` where the Rat News filter was failing to populate rat names. Switched to using `textContent` instead of `innerText` to reliably extract text from the DOM.

## [8.06] - 2026-04-09
### Fixed
- Fixed the Gang Member List table styling by re-injecting CSS to support native `.even`/`.odd` row background colours and an interactive `#e8f4f8` hover effect.

## [8.05] - 2026-04-09
### Added
- Added a customizable column selector to the `GangHelper` Member List page (`cmd=gang&do=list_mem`), allowing users to toggle specific data columns on and off dynamically.
- The Member List top navigation links (Main, Battle Stats, Other Stats, Hall of Fame) have been converted into pill buttons that act as automatic presets to quickly toggle relevant column sets without losing stored custom configurations.
- Included an adaptive "Show All" toggle button to instantly display every strictly accessible column constraint for the active user account.
- Column configurations securely persist via browser local storage and gracefully filter out unavailable selections when switching between regular User and Gang Staff account access levels.

## [8.04] - 2026-04-08
### Added
- Created a configurable interface for the `MessageBoardHelper` "Add Paid Message Text" append button. Users can now override the prepended message format using custom text combined with dynamic variables `{hoboname}`, `{hoboId}`, and `{date}`.

### Changed
- Expanded `SettingsHelper` layout architecture to handle fluid input scaling (e.g. `100%` width blocks) and trailing feature description texts natively.

## [8.03] - 2026-04-08
### Added
- Added a visual indicator to the Living Area that applies a pale red background to the Special Item container when the item is inactive.

## [8.02] - 2026-04-08
### Changed
- Refactored `BackpackHelper`'s Favourite Drinks logic to build a single DOM node map instead of relying on recursive query loops. This severely limits browser memory usage and prevents lag/stutters on accounts with massive inventories.

## [8.01] - 2026-04-08
### Added
- Added a "Favourite Drinks" section that automatically displays your top 5 consumed drinks in the backpack and living area modes, increasing image sizes for quick tapping.
- Drink consumption is now successfully tracked automatically when drank directly from backpack/living area locations. m- Included an interactive "View Stats" table modal showing lifetime consumption stats, fully populated with images and sorted highest to lowest. Also features a handy Reset button.

## [8.00] - 2026-04-08
### Added
- Added a "Swipeable Topbar Menu" feature to `DisplayHelper` that automatically makes the natively wide topbar menu (Dirt Road, Recycling Bin, etc.) horizontally scrollable (swipeable) on mobile devices to prevent it from clipping off-screen. Can be disabled via settings.
- Desktop users also gain an invisible drag-to-scroll interactivity across the topbar menu for testing and accessibility.

### Changed
- Improved the styling of "Race" and "Pikies" action buttons in the Northern Fence racing page for a cleaner layout.

## [7.99] - 2026-04-08
### Changed
- Improved layout and styling of "Give a Loan" and "Clear a Loan" forms in the Gang Loans helper.

## [7.98] - 2026-04-08
### Added
- Added a "Remove" button to the `MessageBoardHelper` "Add Payment" panel to cleanly delete previously saved payments.
- Added a "Cancel" button to easily dismiss the "Add Payment" panel without saving changes.

### Changed
- The `MessageBoardHelper` "Add Payment" logic has been refactored to act as an update for existing payments instead of creating duplicate records. The submit button now dynamically displays "Update" or "Save" based on the payment's saved status.

### Fixed
- Fixed an issue where saving an already tracked post payment would endlessly duplicate the row within the `GangLoansHelper` dashboard instead of replacing the old record.

## [7.97] - 2026-04-08
### Added
- Added a "Bank Account" dropdown to the `GangLoansHelper` dashboard, allowing operators to select and save the applicable bank account per topic. This securely syncs natively with the site's default input forms.
- Added an inline dynamic "Total" amount readout next to the Bank Account selector in every topic panel to continuously display the precise sum of all individual payments and calculated bulk repliers.

## [7.96] - 2026-04-07
### Added
- **Larger Vote Buttons (Message Board):** The tiny Up/Down vote links on message board posts are now converted into larger, easy-to-click buttons. This feature can be toggled via settings.

### Fixed
- **Message Board Vote Tooltips:** Fixed a native game bug where the detailed vote count tooltip ("Loading...", followed by percentage breakdown) would permanently break after casting a vote without a page refresh.

## [7.95] - 2026-04-06
### Changed
- **Performance Refactor:** Separated helper scripts into Global and Page-specific modules to prevent DOM visual jolts on unrelated pages.
- **Page Routing:** Helpers now conditionally load strictly on the pages they affect via declarative URL routing.
- Renamed Bernards Mansion Helper to Bernards Basement Helper to accurately reflect location endpoints.

## [7.94] - 2026-04-06
### Added
- Added the `WeaponsHelper` module for the Weapons page (`cmd=wep`).
- **Highlight Equipped Items**: Automatically highlights the container of weapons, armor, and rings you currently have equipped.
- **Quick Equip/Unequip**: Item images are now hyperlinked to act as quick toggle buttons to equip or unequip that specific item.

## [7.93] - 2026-04-06
### Changed
- Renamed Living Area Helper setting "Wide Lay: Show 3 Columns" to "Always Show More Info".
- Added clearer requirement text to Settings Helper for the "Always Show More Info" feature.

## [7.92] - 2026-04-06
### Added
- Added a "Copy Stats" button to the `LivingAreaHelper` combat stats box to instantly copy the displayed battle stats + totals directly to the clipboard.
- Added a "Wide Lay: Show 3 Columns" option in `LivingAreaHelper` which forces the Living Area layout to reveal all columns natively when `DisplayHelper` "Widen Content Area" is active (>= 850px), bypassing the toggle buttons entirely.

### Changed
- Enforced strict spacing logic on `LivingAreaHelper` wide layout implementation using dynamic calc grids and specific CSS whitespace overrides, preventing unexpected box line wrapping.

## [7.91] - 2026-04-06
### Added
- Added an "Awake Full Notification" feature to `DisplayHelper` which automatically tracks offline awakeness regeneration and dispatches a desktop Tampermonkey notification when max awakeness is reached after a configurable period of inactivity. Disabled by default.

### Fixed
- Fixed an issue in `SettingsHelper` where sub-features structured with a false default value were incorrectly defaulting to checked upon first initialization.

### Changed
- Enhanced the `LivingAreaHelper` "Win Percentage Calc" to calculate and display both the consecutive wins needed to reach the next bonus bracket, and the consecutive losses allowed before dropping a bracket.
- Smoothed out the milestone threshold curve in the "Win Percentage Calc" using a dynamic 10-99% bracket system for more realistic and manageable short-term goal tracking.

## [7.90] - 2026-04-06
### Fixed
- Prevented `ChangelogData` from incorrectly displaying as an active module in the Preferences settings window.

## [7.89] - 2026-04-06
### Added
- Added the `GangHelper` module, initialized on the Gang page (`cmd=gang&do=enter`).
- Added a "Save Event Payouts" UI to the "View last gang happening results" page (`w=lastsh`) specifically for the "Gangsters Sunday = Funday" event (visible only to Gang Staff). It automatically calculates and saves payouts per point based on custom rate and max payout inputs, pushing them directly to the `GangLoansHelper` dashboard.

## [7.88] - 2026-04-05
### Added
- Added a "Version Display" to the `LivingAreaHelper` beneath the Mixer link to show the current Helper Tool version.
- Added an interactive "View Changelog" link in the `LivingAreaHelper` that opens a floating modal with the 5 most recent changelog updates without having to wait for the Lockout Screen. Administers settings via the `LivingAreaHelper_VersionDisplay` toggle.

## [7.87] - 2026-04-05
### Changed
- Updated the `LivingAreaHelper` "Update Ratio" button to display "Update Goals" and configured it to automatically collapse the input window when settings are saved.

## [7.86] - 2026-04-05
### Added
- Added an "Enable the Fake Qwee" setting to the `DisplayHelper` to allow toggling the "The Fake" prefix for user ID 2924510.

## [7.85] - 2026-04-05
### Added
- Added a `RatsHelper` for the Rat page (`cmd=rats`) that includes an interactive "Rat News Filter" using checkbox pills.

### Changed
- Refactored `SettingsHelper` architecture: all modules now export their own settings configurations, automatically populating the Preferences page dynamically.

## [7.84] - 2026-04-05
### Changed
- Updated the "Export Saved Repliers" button to output granular line-by-line payment details for each individual recipient instead of a single total summary string.

## [7.83] - 2026-04-05
### Added
- Added an "Export Totals" button to the `GangLoansHelper` to automatically sum up all processed cash values from both individual actions and bulk replier lists into a single clipboard string.
- Implemented dependent validation states for `GangLoansHelper` export buttons to explicitly disable interaction until missing dynamic elements (such as the bulk amount mapping field) are entered by operators.

### Changed
- Re-formatted the export text templates in the `GangLoansHelper` to utilize a centralized, true game-synced datestring generated via `Utils`.
- Improved space usage by shortening the "Remove Topic" button simply to "Remove" directly within the `GangLoansHelper` UI.

## [7.82] - 2026-04-05
### Changed
- Modified the `MessageBoardHelper` dollar matching logic to iteratively extract and map the final trailing dollar volume in instances where text strings list multiplier equations prior to a total summation format.

## [7.81] - 2026-04-05
### Fixed
- Fixed an issue where the `FoodData` mapping incorrectly associated the "Apple Core" food item with the wrong image asset within `FortSlugworthHelper` Ripaparter's menu.

## [7.80] - 2026-04-05
### Added
- Added `FortSlugworthHelper` with functionality for The Ripaparter (`room=4`).
- Introduced a tile-based UI replacement to The Ripaparter for selecting trolley foods, generating visual interactive grids using the newly added `FoodData.js` asset map, vastly improving sorting and speed. Includes dynamic image detection parsing names mapped to wiki records.

## [7.79] - 2026-04-05
### Changed
- The `SoupKitchenHelper` has been refined to consistently display the Hobo age metadata and soup rewards table independently of specific URL query parameters.

## [7.78] - 2026-04-05
### Added
- Added automated state handling to `GangLoansHelper` which tracks when "Add" and "Clear" actions resolve via persistent cache across synchronous page loads.
- The `GangLoansHelper` dashboard now seamlessly transitions rows through permanent workflow states ("Loan Created", "Loan Cleared") after confirming system responses.
- Added a native "Select Loan" shortcut button on "Loan Created" items which instantly parses the existing HTML DOM and form elements to prepare a specific loan ID for immediate clearing.

## [7.77] - 2026-04-04
### Fixed
- Improved `MessageBoardHelper` topic name extraction reliability on Gang Board posts, fixing bugs that prevented the Save Repliers/Add Payment buttons from appearing correctly.

## [7.76] - 2026-04-04
### Changed
- Enhanced the `MessageBoardHelper` 'Add Payment' dollar amount parser to correctly interpret multiplier suffixes (k, m, mil, mill, million) and automatically format the mapped value with commas and a dollar sign.

## [7.75] - 2026-04-04
### Changed
- Adjusted the padding of the `SettingsHelper` card boxes and global toggle container for a tighter, cleaner appearance.

## [7.74] - 2026-04-04
### Changed
- Overhauled the `SettingsHelper` Game Preferences page layout, migrating from a continuous vertical list to a balanced and stylized two-column card grid to improve readability and aesthetics.

## [7.73] - 2026-04-04
### Added
- Added "Enable Improved Avatars" sub-feature to `DisplayHelper` to apply custom CSS shaping and styling to avatar images, including online status indicators. This can be configured in the Settings menu.

## [7.72] - 2026-04-04
### Added
- Added the `SoupKitchenHelper` module to display the current tracked age of your Hobo in days and present an informational wiki table showing which soup items correspond to each age range when visiting the soup line.

## [7.71] - 2026-04-04
### Added
- Added a configurable toggle for the `HitlistHelper`'s "Highlight Online Players" feature within the `SettingsHelper` preferences page.

## [7.70] - 2026-04-04
### Added
- Added the `HitlistHelper` module to provide usability improvements to the Personal Hitlist page (`cmd=battle&do=phlist`).
- Formatted Personal Hitlist elements to automatically map and highlight any currently online opponents with a light green row background, dramatically improving visual recognition instead of having to spot the small online icon.

## [7.69] - 2026-04-04
### Added
- Added the `GangLoansHelper` module which introduces a robust tracking dashboard to the Gang Loans page specifically for bulk post-payments and replier workflow administration.
- Formatted `Export` features attached to tracked topics, allowing clipboard export of both saved repliers and generated payment objects directly mapped with dollar outputs.
- Integrated a generic "Save" and dynamic insertion mechanism onto the dashboard, automatically filling out the site's default input forms from tracked payments.

### Changed
- The "Add Payment" and "Save Repliers List" buttons that appear over Gang Message Board posts are now inherently restricted to users posessing Gang Staff status.
- Removed the obsolete "Save Repliers List Button" option from Hobo Helper settings.

## [7.68] - 2026-04-04
### Added
- Added an "Add Payment" button to individual replies within Gang Message Board posts locally tracking custom transactions linked to specific topic responses.
- The button opens a floating panel pre-populated with the replier's Hobo Name, Hobo ID, and a suggested amount securely parsed from the post text, allowing local storage of expected payments.

## [7.67] - 2026-04-04
### Fixed
- Fixed an issue where `LockoutHelper` failed to display the changelog because it was incorrectly referencing the `ChangelogData` module structure.

## [7.66] - 2026-04-04
### Added
- Added Display Helper, with initial display tweaks.

## [7.65] - 2026-04-04
### Changed
- Updated the "5 Fighter's Lunches" `BankHelper` button to support multiple sequential clicks, allowing withdrawals in multiples of 5 lunches at a time, while dynamically tracking and updating the total count added in the button's display value.

## [7.64] - 2026-04-04
### Added
- Added a "5 Fighter's Lunches" withdraw goal to the `BankHelper`, dynamic to your Hobo Level.
- Added a configuration toggle for the 5 Fighter's Lunches Goal within the `SettingsHelper`.

## [7.63] - 2026-04-04
### Changed
- Updated the success message text on the `FoodHelper` button to say "✅ Updated Crap!" for better clarity.

## [7.62] - 2026-04-04
### Fixed
- Re-architected the `FoodHelper` "Mark as Crap" logic. The script now exclusively monitors items currently present in your inventory when updating the "crap" list, ensuring off-screen previously marked "crap" foods are safely preserved rather than being automatically wiped out.

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
- Added a ` Save Repliers List` button to `MessageBoardHelper` explicitly for Gang Board posts (`cmd=gathering&do=vpost`), securely extracting and exporting a unique timestamped list of user names and IDs replying to the active topic locally.
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
