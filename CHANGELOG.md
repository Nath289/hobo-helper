# Changelog

All notable changes to this project will be documented in this file.

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
- Drink consumption is now successfully tracked automatically when drank directly from backpack/living area locations.
m- Included an interactive "View Stats" table modal showing lifetime consumption stats, fully populated with images and sorted highest to lowest. Also features a handy Reset button.

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
