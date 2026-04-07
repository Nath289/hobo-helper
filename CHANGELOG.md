# Changelog

All notable changes to this project will be documented in this file.

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
