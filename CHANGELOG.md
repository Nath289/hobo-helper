# Changelog

All notable changes to this project will be documented in this file.

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
- Added custom 'ÐeaveÐ¿' title display for SeventhHeaven.

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
- Implemented a combat window highlighter within the `HitlistHelper` that automatically shades rows an alerting light red if an opponent's level drastically falls outside the player's immediate attack limits (Â±200 combat levels).
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
- Added an "Attack Range" checkbox filter to `ActiveListHelper` that instantly restricts the viewable opponent list exclusively to players falling within your immediate combat level range (Â±200 levels of your current Hobo level). Filter persistently saves to local storage.

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
- Updated the success message text on the `FoodHelper` button to say "âœ… Updated Crap!" for better clarity.

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
- Added a `ðŸ’¾ Save Repliers List` button to `MessageBoardHelper` explicitly for Gang Board posts (`cmd=gathering&do=vpost`), securely extracting and exporting a unique timestamped list of user names and IDs replying to the active topic locally.
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
# #   [ 8 . 6 7 ]   -   2 0 2 6 - 0 4 - 2 0 
 
 # # #   A d d e d 
 
 -   A d d e d   C a n s   d i r e c t l y   t o   t h e   t o p   n a v i g a t i o n   b a r   a l o n g s i d e   P o i n t s   a n d   T o k e n s . 
 
 -   T h e   C a n s   i c o n   u s e s   C S S   i n j e c t i o n   t h a t   c o r r e c t l y   m i m i c s   n a t i v e   i c o n   h o v e r   a n i m a t i o n s . 
 
 -   A d d e d   a   g l o b a l   n u m b e r   a b b r e v i a t i o n   f u n c t i o n   \ U t i l s . a b b r e v i a t e N u m b e r ( ) \   t h a t   f o r m a t s   l a r g e   n u m b e r s   i n t o   \ k \   a n d   \ m \   s u f f i x e s   f o r   c l e a n e r   U I   d i s p l a y . 
 
 
 
 #   #       [   8   .   6   6   ]       -       2   0   2   6   -   0   4   -   2   0   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a   n       "   E   x   p   o   r   t       A   l   l   "       a   n   d       "   I   m   p   o   r   t   "       f   u   n   c   t   i   o   n   a   l   i   t   y       t   o       t   h   e       G   a   n   g       M   a   s   s       M   a   i   l       t   e   m   p   l   a   t   e   s       (   `   G   a   n   g   H   e   l   p   e   r   .   j   s   `   )   ,       e   m   p   o   w   e   r   i   n   g       u   s   e   r   s       t   o       e   a   s   i   l   y       b   a   c   k   u   p   ,       t   r   a   n   s   f   e   r   ,       o   r       s   h   a   r   e       t   e   m   p   l   a   t   e       d   a   t   a       u   s   i   n   g       c   l   i   p   b   o   a   r   d       J   S   O   N       s   t   r   i   n   g       a   r   r   a   y   s   .   
 
   
 
   
 
   
 
   #   #       [   8   .   6   5   ]       -       2   0   2   6   -   0   4   -   1   9   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       s   t   r   u   c   t   u   r   e   d       t   a   b   l   e       v   i   e   w       f   o   r       t   h   e       M   a   r   k   e   t       W   a   t   c   h   e   r       s   e   c   t   i   o   n       o   n       t   h   e       S   G   H   M       p   a   g   e   ,       i   n   c   l   u   d   i   n   g       a   l   t   e   r   n   a   t   e       r   o   w       c   o   l   o   r   i   n   g       a   n   d       p   r   e   c   i   s   e       d   o   l   l   a   r       v   a   l   u   e       e   x   t   r   a   c   t   i   o   n   .   
 
   
 
   
 
   
 
   #   #       [   8   .   6   4   ]       -       2   0   2   6   -   0   4   -   1   9   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       c   u   s   t   o   m       '   Ð      e   a   v   e   Ð   ¿   '       t   i   t   l   e       d   i   s   p   l   a   y       f   o   r       S   e   v   e   n   t   h   H   e   a   v   e   n   .   
 
   
 
   
 
   
 
   #   #       [   8   .   6   3   ]       -       2   0   2   6   -   0   4   -   1   9   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       T   h   e       R   a   t       L   i   f   e       P   r   o   g   r   e   s   s       B   a   r       n   o   w       d   y   n   a   m   i   c   a   l   l   y       s   h   i   f   t   s       c   o   l   o   r       f   r   o   m       g   r   e   e   n       t   o       y   e   l   l   o   w       t   o       r   e   d       a   s       t   h   e       r   a   t       a   p   p   r   o   a   c   h   e   s       t   h   e       e   n   d       o   f       i   t   s       e   s   t   i   m   a   t   e   d       l   i   f   e   s   p   a   n   .   
 
   
 
   
 
   
 
   #   #       [   8   .   6   2   ]       -       2   0   2   6   -   0   4   -   1   9   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       M   o   d   i   f   i   e   d       t   h   e       R   a   t       L   i   f   e       P   r   o   g   r   e   s   s       B   a   r       t   o       f   i   l   l       u   p       f   r   o   m       t   h   e       l   e   f   t       b   a   s   e   d       o   n       t   h   e       p   e   r   c   e   n   t   a   g   e       o   f       t   h   e       r   a   t   '   s       t   o   t   a   l       e   s   t   i   m   a   t   e   d       l   i   f   e       t   h   a   t       h   a   s       a   l   r   e   a   d   y       b   e   e   n       l   i   v   e   d   ,       a   p   p   r   o   a   c   h   i   n   g       1   0   0   %       a   s       t   h   e       r   a   t       n   e   a   r   s       d   e   a   t   h   .   
 
   
 
   
 
   
 
   #   #       [   8   .   6   1   ]       -       2   0   2   6   -   0   4   -   1   9   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       v   i   s   u   a   l       L   i   f   e       P   r   o   g   r   e   s   s       B   a   r       t   o       t   h   e       R   a   t   s       p   a   g   e       s   h   o   w   i   n   g       t   h   e       p   e   r   c   e   n   t   a   g   e       o   f       l   i   f   e   s   p   a   n       r   e   m   a   i   n   i   n   g   .   
 
   
 
   -       A   d   d   e   d       a   n       E   x   t   r   a   p   o   l   a   t   e   d       D   a   y   s       c   a   l   c   u   l   a   t   i   o   n       t   o       t   h   e       R   a   t       L   i   f   e       t   o   o   l   t   i   p   ,       e   s   t   i   m   a   t   i   n   g       t   o   t   a   l       d   a   y   s       t   o       l   i   v   e       b   a   s   e   d       o   n       e   x   p   e   c   t   e   d       d   a   i   l   y       m   e   a   l   s   .   
 
   
 
   -       I   n   c   l   u   d   e   d       s   p   e   c   i   a   l   i   z   e   d       m   e   a   l       t   r   a   c   k   i   n   g       f   o   r       *   *   T   w   o   -   H   e   a   d   e   d       R   a   t   s   *   *       (   1   2       m   e   a   l   s   /   d   a   y   )       a   n   d       *   *   T   w   o   -   H   e   a   d   e   d       S   u   b   -   R   a   t   s   *   *       (   1   0       m   e   a   l   s   /   d   a   y   )   .   
 
   
 
   -       I   n   c   l   u   d   e   d       b   o   n   u   s       l   i   f   e       c   a   l   c   u   l   a   t   i   o   n   s       f   o   r       t   h   e       *   *   V   e   g   e   t   a   r   i   a   n   i   s   m   *   *       r   a   t       u   p   g   r   a   d   e       (   `   +   1   `       l   i   f   e   /   m   e   a   l   )   .   
 
   
 
   -       T   h   e       `   L   i   v   i   n   g   A   r   e   a   H   e   l   p   e   r   `       n   o   w       a   u   t   o   m   a   t   i   c   a   l   l   y       d   e   t   e   c   t   s       a   n   d       s   a   v   e   s       y   o   u   r       c   u   r   r   e   n   t       t   a   t   t   o   o       t   o       s   u   p   p   o   r   t       o   t   h   e   r       m   o   d   u   l   e   s   .   
 
   
 
   -       T   h   e       `   R   a   t   s   H   e   l   p   e   r   `       n   o   w       p   r   o   p   e   r   l   y       a   p   p   l   i   e   s       t   h   e       p   l   a   y   e   r   '   s       *   *   R   a   t   t   o   o   *   *       t   a   t   t   o   o       b   o   n   u   s   e   s       (   `   +   2   `       l   i   f   e   /   m   e   a   l   )       t   o       V   e   g   e   t   a   r   i   a   n   i   s   m       c   a   l   c   u   l   a   t   i   o   n   s       f   o   r       e   x   t   r   a   p   o   l   a   t   i   o   n   .   
 
   
 
   
 
   
 
   #   #       [   8   .   6   0   ]       -       2   0   2   6   -   0   4   -   1   9   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       C   r   e   a   t   e   d       t   h   e       n   e   w       `   G   a   n   g   H   i   t   l   i   s   t   H   e   l   p   e   r   `       m   o   d   u   l   e       s   p   e   c   i   f   i   c   a   l   l   y       f   o   r       t   h   e       G   a   n   g       H   i   t   l   i   s   t       p   a   g   e       (   `   c   m   d   =   g   a   n   g   &   d   o   =   h   i   t   l   i   s   t   `   )   .   
 
   
 
   -       A   d   d   e   d       a       "   H   i   t   l   i   s   t       P   a   g   e       T   r   a   c   k   e   r   "       f   e   a   t   u   r   e       t   h   a   t       r   e   m   e   m   b   e   r   s       a   n   d       v   i   s   u   a   l   l   y       h   i   g   h   l   i   g   h   t   s       t   h   e       c   u   r   r   e   n   t   l   y       s   e   l   e   c   t   e   d       p   a   g   i   n   a   t   e   d       h   i   t   l   i   s   t       p   a   g   e   .   
 
   
 
   -       A   d   d   e   d       a       "   H   i   t   l   i   s   t       M   a   r   k       R   e   d   "       i   n   t   e   r   a   c   t   i   v   e       t   o   g   g   l   e       l   i   n   k       w   i   t   h   i   n       t   h   e       "   O   p   t   i   o   n   s   "       c   o   l   u   m   n       o   f       t   h   e       h   i   t   l   i   s   t       t   a   b   l   e   ,       a   l   l   o   w   i   n   g       u   s   e   r   s       t   o       p   e   r   m   a   n   e   n   t   l   y       s   h   a   d   e       s   p   e   c   i   f   i   c       o   p   p   o   n   e   n   t       r   o   w   s       r   e   d       a   c   r   o   s   s       p   a   g   e       r   e   l   o   a   d   s   .   
 
   
 
   
 
   
 
   #   #       [   8   .   5   9   ]       -       2   0   2   6   -   0   4   -   1   9   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       c   o   m   p   r   e   h   e   n   s   i   v   e       M   a   s   s       M   a   i   l       t   e   m   p   l   a   t   e       s   y   s   t   e   m       a   l   l   o   w   i   n   g       t   h   e       s   a   v   i   n   g   ,       l   o   a   d   i   n   g   ,       u   p   d   a   t   i   n   g   ,       a   n   d       d   e   l   e   t   i   o   n       o   f       m   a   s   s       m   a   i   l       p   r   e   s   e   t   s       o   n       t   h   e       G   a   n   g       S   e   n   d       M   a   s   s       M   a   i   l       p   a   g   e   .   
 
   
 
   -       T   e   m   p   l   a   t   e   s       a   u   t   o   m   a   t   i   c   a   l   l   y       s   a   v   e       t   h   e       '   S   e   n   d       T   o   '       s   e   l   e   c   t   i   o   n   ,       S   u   b   j   e   c   t   ,       a   n   d       B   o   d   y       c   o   n   t   e   n   t   .   
 
   
 
   -       A   d   d   e   d       s   u   p   p   o   r   t       f   o   r       d   y   n   a   m   i   c       d   a   t   e       v   a   r   i   a   b   l   e   s       i   n       m   a   s   s       m   a   i   l       t   e   m   p   l   a   t   e   s   :       `   {   d   a   t   e   }   `       (   e   .   g   .       A   p   r       1   6   )       a   n   d       `   {   f   u   l   l   D   a   t   e   }   `       (   e   .   g   .       A   p   r       1   6       2   0   2   6   )   .   
 
   
 
   
 
   
 
   #   #       [   8   .   5   8   ]       -       2   0   2   6   -   0   4   -   1   9   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       U   p   d   a   t   e   d       t   h   e       G   a   n   g       A   r   m   o   r   y       F   a   v   o   r   i   t   e   s       d   a   s   h   b   o   a   r   d       t   o       d   i   s   p   l   a   y       "   L   o   a   n   e   d       t   o       Y   o   u   "       i   n       g   r   e   e   n       i   n   s   t   e   a   d       o   f       a       r   e   d       "   N   o   t       A   v   a   i   l   a   b   l   e   "       w   a   r   n   i   n   g       f   o   r       i   t   e   m   s       c   u   r   r   e   n   t   l   y       l   o   a   n   e   d       t   o       t   h   e       a   c   t   i   v   e       u   s   e   r   .   
 
   
 
   
 
   
 
   #   #       [   8   .   5   7   ]       -       2   0   2   6   -   0   4   -   1   9   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       A   l   i   g   n   e   d       t   h   e       n   e   w       S   u   n   d   a   y       F   u   n   d   a   y       p   r   o   j   e   c   t   e   d       p   a   y   o   u   t       c   o   l   u   m   n       t   e   x   t       t   o       t   h   e       r   i   g   h   t       f   o   r       i   m   p   r   o   v   e   d       n   u   m   e   r   i   c       r   e   a   d   a   b   i   l   i   t   y   .   
 
   
 
   
 
   
 
   #   #       [   8   .   5   6   ]       -       2   0   2   6   -   0   4   -   1   9   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       n   e   w       p   r   o   j   e   c   t   e   d       p   a   y   o   u   t       c   o   l   u   m   n       t   o       i   n   d   i   v   i   d   u   a   l       H   o   b   o       s   c   o   r   e       r   o   w   s       d   u   r   i   n   g       t   h   e       S   u   n   d   a   y       F   u   n   d   a   y       g   a   n   g       e   v   e   n   t       (   C   u   r   r   e   n   t       a   n   d       L   a   s   t       H   a   p   p   e   n   i   n   g   s   )   .   
 
   
 
   
 
   
 
   #   #       [   8   .   5   5   ]       -       2   0   2   6   -   0   4   -   1   9   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       R   e   m   o   v   e   d       t   h   e       t   e   x   t       s   h   a   d   o   w       s   t   y   l   i   n   g       f   r   o   m       G   r   a   b   o   w   '   s       c   u   s   t   o   m       t   i   t   l   e       w   i   t   h   i   n       t   h   e       D   i   s   p   l   a   y       H   e   l   p   e   r   .   
 
   
 
   
 
   
 
   #   #       [   8   .   5   4   ]       -       2   0   2   6   -   0   4   -   1   9   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       F   i   x   e   d       t   h   e       b   a   s   e   6   4       i   m   a   g   e       a   s   s   e   t       f   o   r       t   h   e       p   e   r   m   a   n   e   n   t       B   u   d   d   h   i   s   m       r   a   t       u   p   g   r   a   d   e       i   n       `   R   a   t   s   H   e   l   p   e   r   `       t   o       p   r   e   c   i   s   e   l   y       m   a   t   c   h       t   h   e       a   c   t   u   a   l       g   a   m   e       i   c   o   n   .   
 
   
 
   
 
   
 
   #   #       [   8   .   5   3   ]       -       2   0   2   6   -   0   4   -   1   9   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       l   e   g   e   n   d       a   t       t   h   e       b   o   t   t   o   m       o   f       t   h   e       H   i   t   l   i   s   t       t   a   b   l   e       i   n   d   i   c   a   t   i   n   g       r   o   w       h   i   g   h   l   i   g   h   t       c   o   l   o   r   s       (   G   r   e   e   n       f   o   r       c   u   r   r   e   n   t   l   y       o   n   l   i   n   e   ,       R   e   d       f   o   r       o   u   t   s   i   d   e       a   t   t   a   c   k       r   a   n   g   e   )   .   
 
   
 
   
 
   
 
   #   #       [   8   .   5   2   ]       -       2   0   2   6   -   0   4   -   1   9   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       i   n   d   i   v   i   d   u   a   l       c   o   n   f   i   g   u   r   a   t   i   o   n       t   o   g   g   l   e   s       w   i   t   h   i   n       t   h   e       S   e   t   t   i   n   g   s       m   e   n   u       f   o   r       `   B   a   c   k   p   a   c   k   H   e   l   p   e   r   `       s   u   b   -   f   e   a   t   u   r   e   s       (   I   t   e   m       T   o   o   l   t   i   p   s       a   n   d       F   a   v   o   u   r   i   t   e       D   r   i   n   k   s       U   I   )   .   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       O   v   e   r   h   a   u   l   e   d       t   h   e       S   e   t   t   i   n   g   s       m   e   n   u       U   I       t   o       d   i   s   p   l   a   y       c   l   e   a   n   ,       h   u   m   a   n   -   r   e   a   d   a   b   l   e       m   o   d   u   l   e       n   a   m   e   s   .   
 
   
 
   -       S   e   t   t   i   n   g   s       m   e   n   u       s   u   b   -   f   e   a   t   u   r   e   s       a   r   e       n   o   w       d   y   n   a   m   i   c   a   l   l   y       w   r   a   p   p   e   d       i   n       c   o   l   l   a   p   s   i   b   l   e       c   o   n   t   a   i   n   e   r   s       t   h   a   t       h   i   d   e       a   u   t   o   m   a   t   i   c   a   l   l   y       w   h   e   n       t   h   e   i   r       p   a   r   e   n   t       m   o   d   u   l   e       i   s       d   i   s   a   b   l   e   d   ,       d   r   a   s   t   i   c   a   l   l   y       r   e   d   u   c   i   n   g       v   i   s   u   a   l       c   l   u   t   t   e   r   .   
 
   
 
   -       R   e   f   a   c   t   o   r   e   d       `   D   r   i   n   k   s   H   e   l   p   e   r   `       f   r   o   m       a       g   l   o   b   a   l       b   a   c   k   g   r   o   u   n   d       s   c   r   i   p   t       t   o       a       t   a   r   g   e   t   e   d       p   a   g   e       m   o   d   u   l   e       r   e   s   t   r   i   c   t   e   d       t   o       t   h   e       M   i   x   e   r       p   a   g   e   ,       i   m   p   r   o   v   i   n   g       o   v   e   r   a   l   l       e   x   e   c   u   t   i   o   n       p   e   r   f   o   r   m   a   n   c   e   .   
 
   
 
   -       R   e   l   o   c   a   t   e   d       s   t   a   t   i   c       d   a   t   a       o   b   j   e   c   t       f   i   l   e   s       t   o       t   h   e   i   r       p   r   o   p   e   r       d   a   t   a       d   i   r   e   c   t   o   r   y       s   t   r   u   c   t   u   r   e   .   
 
   
 
   
 
   
 
   #   #       [   8   .   5   1   ]       -       2   0   2   6   -   0   4   -   1   8   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       F   i   x   e   d       a   n       a   c   c   e   s   s   i   b   i   l   i   t   y       i   s   s   u   e       i   n       t   h   e       `   R   a   t   s   H   e   l   p   e   r   `       p   e   r   m   a   n   e   n   t       u   p   g   r   a   d   e       b   u   t   t   o   n   s       b   y       a   d   d   i   n   g       `   a   l   t   `       a   t   t   r   i   b   u   t   e   s       t   o       i   n   j   e   c   t   e   d       `   <   i   m   g   >   `       t   a   g   s   .   
 
   
 
   -       C   l   e   a   n   e   d       u   p       r   e   d   u   n   d   a   n   t       v   a   r   i   a   b   l   e       i   n   i   t   i   a   l   i   z   a   t   i   o   n       l   o   g   i   c       i   n       t   h   e       `   R   a   t   s   H   e   l   p   e   r   `       f   e   e   d       U   I       f   u   n   c   t   i   o   n   .   
 
   
 
   
 
   
 
   #   #       [   8   .   5   0   ]       -       2   0   2   6   -   0   4   -   1   8   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       I   m   p   r   o   v   e   d       t   h   e       s   t   y   l   i   n   g       o   f       m   a   x   e   d       p   e   r   m   a   n   e   n   t       R   a   t       u   p   g   r   a   d   e   s       t   o       i   n   c   l   u   d   e       a       g   r   e   e   n       t   i   c   k       i   n       t   h   e       t   o   p   -   l   e   f   t       c   o   r   n   e   r       a   n   d       a       d   i   s   t   i   n   c   t       l   i   g   h   t       g   r   e   e   n       b   a   c   k   g   r   o   u   n   d       f   o   r       b   e   t   t   e   r       v   i   s   i   b   i   l   i   t   y   .   
 
   
 
   -       A   d   j   u   s   t   e   d       t   h   e       a   l   i   g   n   m   e   n   t       o   f       t   e   x   t       a   n   d       i   c   o   n   s       i   n   s   i   d   e       p   e   r   m   a   n   e   n   t       R   a   t       u   p   g   r   a   d   e       b   u   t   t   o   n   s       t   o       p   e   r   f   e   c   t   l   y       c   e   n   t   e   r       t   h   e   m       v   e   r   t   i   c   a   l   l   y   .   
 
   
 
   
 
   
 
   #   #       [   8   .   4   9   ]       -       2   0   2   6   -   0   4   -   1   8   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       C   o   m   p   l   e   t   e   l   y       r   e   d   e   s   i   g   n   e   d       t   h   e       R   a   t       U   p   g   r   a   d   e   s       U   I       i   n   t   o       a       n   e   w       s   q   u   a   r   e   -   b   u   t   t   o   n       l   a   y   o   u   t       w   i   t   h       s   e   p   a   r   a   t   e   d       s   e   c   t   i   o   n   s       f   o   r       s   t   a   n   d   a   r   d       a   n   d       p   e   r   m   a   n   e   n   t       u   p   g   r   a   d   e   s   .   
 
   
 
   -       A   d   d   e   d       c   u   s   t   o   m       i   c   o   n   s       f   o   r       V   e   g   e   t   a   r   i   a   n   i   s   m   ,       B   u   d   d   h   i   s   m   ,       a   n   d       M   a   t   e   r   i   a   l   i   s   m   .   
 
   
 
   -       S   t   a   n   d   a   r   d       u   p   g   r   a   d   e       b   u   t   t   o   n   s       n   o   w       a   b   b   r   e   v   i   a   t   e       t   h   e   i   r       c   a   s   h       c   o   s   t   s       t   o       b   e       m   o   r   e       c   o   m   p   a   c   t       (   e   .   g   .       $   1   5   k       i   n   s   t   e   a   d       o   f       $   1   5   ,   0   0   0   )   .   
 
   
 
   -       P   e   r   m   a   n   e   n   t       u   p   g   r   a   d   e   s       n   o   w       d   i   s   p   l   a   y       a       g   r   e   e   n       t   i   c   k       m   a   r   k       w   h   e   n       p   u   r   c   h   a   s   e   d   .   
 
   
 
   -       T   h   e       s   t   a   n   d   a   r   d       C   h   e   e   s   e       q   u   a   n   t   i   t   y       t   a   b   l   e       g   l   o   b   a   l   l   y       d   i   s   p   l   a   y   s       a       c   h   e   e   s   e       e   m   o   j   i       f   o   r       q   u   i   c   k       r   e   f   e   r   e   n   c   e   .   
 
   
 
   
 
   
 
   #   #       [   8   .   4   8   ]       -       2   0   2   6   -   0   4   -   1   8   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       "   S   h   o   w       N   e   x   t       R   e   s   p   e   c   t       N   e   e   d   e   d   "       f   e   a   t   u   r   e       i   n       t   h   e       L   i   v   i   n   g       A   r   e   a       t   h   a   t       a   u   t   o   m   a   t   i   c   a   l   l   y       c   a   l   c   u   l   a   t   e   s       a   n   d       d   i   s   p   l   a   y   s       t   h   e       t   h   r   e   s   h   o   l   d       a   m   o   u   n   t       f   o   r       y   o   u   r       n   e   x   t       r   e   s   p   e   c   t       r   a   n   k       b   e   n   e   a   t   h       y   o   u   r       c   u   r   r   e   n   t       r   e   s   p   e   c   t       t   o   t   a   l   .   
 
   
 
   
 
   
 
   #   #       [   8   .   4   7   ]       -       2   0   2   6   -   0   4   -   1   8   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       F   i   x   e   d       a       b   u   g       w   h   e   r   e       t   h   e       n   e   w       A   l   i   v   e       T   i   m   e       t   r   a   c   k   e   r       w   o   u   l   d       i   n   c   o   r   r   e   c   t   l   y       r   e   s   e   t       a   n   d       d   i   s   a   p   p   e   a   r       w   h   e   n       a       p   l   a   y   e   r   '   s       h   e   a   l   t   h       r   e   a   c   h   e   d       e   x   a   c   t   l   y       1   0   0   %       d   u   e       t   o       a       f   a   u   l   t   y       d   e   a   t   h   -   s   t   a   t   e       c   h   e   c   k   .   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       R   e   m   o   v   e   d       t   h   e       r   e   d   u   n   d   a   n   t       p   a   r   e   n   t       t   o   g   g   l   e       f   o   r       P   l   a   y   e   r       f   e   a   t   u   r   e   s       i   n       t   h   e       h   e   l   p   e   r       s   e   t   t   i   n   g   s   .   
 
   
 
   
 
   
 
   #   #       [   8   .   4   6   ]       -       2   0   2   6   -   0   4   -   1   8   
 
   
 
   -       C   o   l   l   a   p   s   e   d       a   l   l       d   i   s   t   i   n   c   t       c   u   s   t   o   m       p   l   a   y   e   r       t   i   t   l   e   s       i   n   t   o       o   n   e       n   e   w       s   e   t   t   i   n   g   :       "   E   n   a   b   l   e       C   u   s   t   o   m       P   l   a   y   e   r       T   i   t   l   e   s   "   .   
 
   
 
   -       A   d   d   e   d       a       c   u   s   t   o   m       r   e   d       "   P   i   r   a   t   e       K   i   n   g   "       p   r   e   f   i   x       t   i   t   l   e       f   o   r       M   u   g   i   .   
 
   
 
   -       A   d   d   e   d       a       c   u   s   t   o   m       g   r   e   e   n       n   a   m   e       c   o   l   o   r       a   n   d       b   l   u   e       "   1   3   3   7   "       s   u   f   f   i   x       t   i   t   l   e       f   o   r       L   e   e   t   .   
 
   
 
   -       A   d   d   e   d       a       c   u   s   t   o   m       r   e   d       "   T   h   e   "       p   r   e   f   i   x       t   o       G   r   a   b   o   w       t   o       c   o   m   p   l   e   m   e   n   t       t   h   e       e   x   i   s   t   i   n   g       "   t   h   e       G   r   e   a   t   "       s   u   f   f   i   x   .   
 
   
 
   
 
   
 
   #   #       [   8   .   4   4   ]       -       2   0   2   6   -   0   4   -   1   8   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       n   e   w       o   p   t   i   o   n       t   o       t   r   a   c   k       a   n   d       s   y   n   c       "   A   l   i   v   e       T   i   m   e   "       i   n       l   o   c   a   l       s   t   o   r   a   g   e   .   
 
   
 
   -       A   d   d   e   d       a       n   e   w       t   o   p       m   e   n   u       b   a   r       e   l   e   m   e   n   t       t   o       d   i   s   p   l   a   y       a       l   i   v   e       u   p   d   a   t   i   n   g       r   e   l   a   t   i   v   e       A   l   i   v   e       T   i   m   e   .   
 
   
 
   -       A   d   d   e   d       a       m   e   c   h   a   n   i   s   m       t   o       w   i   p   e       l   o   c   a   l       t   r   a   c   k   i   n   g       i   f       t   h   e       p   l   a   y   e   r   '   s       l   i   f   e       d   r   o   p   s       t   o       0   %   .   
 
   
 
   -       A   d   d   e   d       s   y   n   c       l   o   g   i   c       t   o       t   h   e       L   i   v   i   n   g       A   r   e   a       t   h   a   t       g   r   a   c   e   f   u   l   l   y       u   p   d   a   t   e   s       y   o   u   r       a   l   i   v   e       t   r   a   c   k   e   r   .   
 
   
 
   
 
   
 
   #   #       [   8   .   4   3   ]       -       2   0   2   6   -   0   4   -   1   7   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       S   w   a   p   p   e   d       `   s   e   t   T   i   m   e   o   u   t   `       d   e   b   o   u   n   c   e       f   o   r       `   r   e   q   u   e   s   t   A   n   i   m   a   t   i   o   n   F   r   a   m   e   `       i   n       t   h   e       `   F   o   o   d   H   e   l   p   e   r   `       o   b   s   e   r   v   e   r       t   o       e   n   s   u   r   e       i   m   m   e   d   i   a   t   e   ,       j   i   t   t   e   r   -   f   r   e   e       U   I       u   p   d   a   t   e   s       w   h   e   n       r   e   n   d   e   r   i   n   g       f   o   o   d       t   a   b   l   e   s   .   
 
   
 
   
 
   
 
   #   #       [   8   .   4   2   ]       -       2   0   2   6   -   0   4   -   1   7   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       `   F   o   o   d   B   a   n   k   H   e   l   p   e   r   `       t   o       e   x   p   l   i   c   i   t   l   y       m   a   n   a   g   e       a   n   d       i   m   p   r   o   v   e       t   h   e       m   a   i   n       F   o   o   d       B   a   n   k       o   v   e   r   v   i   e   w       i   n   t   e   r   f   a   c   e       (   `   c   m   d   =   f   o   o   d   _   b   a   n   k   `   )   .   
 
   
 
   -       R   e   -   f   o   r   m   a   t   t   e   d       t   h   e       "   F   r   o   z   e   n       F   o   o   d   "       a   n   d       "   I   n       T   r   o   l   l   y   "       l   i   s   t   s       i   n   t   o       d   y   n   a   m   i   c   ,       r   e   s   p   o   n   s   i   v   e       t   a   b   l   e   s       m   a   t   c   h   i   n   g       t   h   e       F   o   o   d       p   a   g   e       r   e   d   e   s   i   g   n   .   
 
   
 
   -       C   o   n   v   e   r   t   e   d       t   h   e       r   a   w       s   t   r   i   n   g       "   F   r   e   e   z   e   "       a   n   d       "   U   n   f   r   e   e   z   e   "       t   e   x   t       l   i   n   k   s       i   n   t   o       p   r   o   m   i   n   e   n   t       a   c   t   i   o   n       b   u   t   t   o   n   s   .   
 
   
 
   -       S   t   y   l   e   d       f   l   o   a   t   i   n   g       "   C   h   e   c   k       a   l   l   "       l   a   b   e   l       i   n   p   u   t   s       i   n   t   o       u   n   i   f   i   e   d       U   I       `   .   b   t   n   `       t   o   g   g   l   e   s       a   c   r   o   s   s       b   o   t   h       t   a   b   l   e   s   .   
 
   
 
   -       A   d   d   e   d       a   d   a   p   t   i   v   e       r   o   w       h   i   g   h   l   i   g   h   t   i   n   g       l   o   g   i   c       s   o       u   s   e   r       s   e   l   e   c   t   i   o   n   s       n   a   t   i   v   e   l   y       c   o   l   o   r   i   z   e       r   o   w   s       g   r   e   y       u   p   o   n       c   h   e   c   k   i   n   g   .   
 
   
 
   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       E   l   i   m   i   n   a   t   e   d       a       n   a   t   i   v   e       c   o   d   e       b   u   g       i   n       H   o   b   o   W   a   r   s       g   e   n   e   r   a   t   e   d       b   y       d   u   p   l   i   c   a   t   e   d       d   e   f   a   u   l   t       t   o   g   g   l   e       t   e   x   t       e   l   e   m   e   n   t       I   D   s       (   `   i   d   =   "   t   o   g   g   l   e   S   p   a   n   "   `   )       w   h   i   c   h       t   r   i   g   g   e   r   e   d       t   e   x   t       c   o   r   r   u   p   t   i   o   n       w   h   e   n   e   v   e   r       m   u   l   t   i   p   l   e       "   C   h   e   c   k       a   l   l   "       b   o   x   e   s       w   e   r   e       r   e   n   d   e   r   e   d       o   n       t   h   e       s   a   m   e       F   o   o   d       B   a   n   k       v   i   e   w   ;       i   s   o   l   a   t   i   n   g       t   o   g   g   l   e       l   i   s   t   e   n   e   r   s       s   p   e   c   i   f   i   c   a   l   l   y       t   o       c   o   r   r   e   s   p   o   n   d   i   n   g       s   e   t   s   .   
 
   
 
   
 
   
 
   #   #       [   8   .   4   1   ]       -       2   0   2   6   -   0   4   -   1   7   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       R   e   -   f   o   r   m   a   t   t   e   d       t   h   e       F   o   o   d       t   a   b       c   o   n   s   u   m   e       m   e   n   u       i   n   t   o       a       c   l   e   a   n   e   r       a   n   d       m   u   c   h       m   o   r   e       r   e   s   p   o   n   s   i   v   e       t   a   b   l   e       l   a   y   o   u   t   .   
 
   
 
   -       C   o   n   v   e   r   t   e   d       f   l   o   a   t   i   n   g       "   C   o   n   s   u   m   e   "       a   c   t   i   o   n       l   i   n   k   s       i   n   t   o       s   t   a   n   d   a   r   d       U   I       b   u   t   t   o   n   s   .   
 
   
 
   -       C   o   n   v   e   r   t   e   d       f   l   o   a   t   i   n   g       "   C   h   e   c   k       a   l   l   "       f   o   r   m       a   c   t   i   o   n   s       i   n   t   o       u   n   i   f   i   e   d       m   a   t   c   h   i   n   g       U   I       b   u   t   t   o   n   s   .   
 
   
 
   -       A   d   d   e   d       v   i   s   u   a   l       r   o   w   -   h   i   g   h   l   i   g   h   t   i   n   g       f   o   r       c   h   e   c   k   e   d   /   s   e   l   e   c   t   e   d       f   o   o   d       i   t   e   m   s   .   
 
   
 
   
 
   
 
   #   #       [   8   .   4   0   ]       -       2   0   2   6   -   0   4   -   1   6   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       A   d   d   e   d       a       c   o   n   f   i   r   m   a   t   i   o   n       d   i   a   l   o   g       t   o       t   h   e       "   Q   u   i   c   k       R   e   t   u   r   n       B   r   a   n   d   e   d       B   u   t   t   o   n   "       i   n       t   h   e       L   i   v   i   n   g       A   r   e   a       t   o       p   r   e   v   e   n   t       a   c   c   i   d   e   n   t   a   l       i   t   e   m       r   e   t   u   r   n   s   .   
 
   
 
   
 
   
 
   #   #       [   8   .   3   9   ]       -       2   0   2   6   -   0   4   -   1   6   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       "   Q   u   i   c   k       R   e   t   u   r   n       B   r   a   n   d   e   d       B   u   t   t   o   n   "       t   o       t   h   e       L   i   v   i   n   g       A   r   e   a       h   e   l   p   e   r       w   h   i   c   h       i   n   s   e   r   t   s       a       p   e   r   s   i   s   t   e   n   t       b   u   t   t   o   n       n   e   x   t       t   o       t   h   e       V   i   e   w       L   i   s   t       l   i   n   k       t   o       i   m   m   e   d   i   a   t   e   l   y       r   e   t   u   r   n       a   l   l       l   o   a   n   e   d       b   r   a   n   d   e   d       w   e   a   p   o   n   s   .   
 
   
 
   
 
   
 
   #   #       [   8   .   3   8   ]       -       2   0   2   6   -   0   4   -   1   6   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       T   h   e       W   i   n       P   e   r   c   e   n   t   a   g   e       C   a   l   c   u   l   a   t   o   r       o   n       t   h   e       L   i   v   i   n   g       A   r   e   a       p   a   g   e       d   y   n   a   m   i   c   a   l   l   y       r   e   l   o   c   a   t   e   s       b   e   n   e   a   t   h       t   h   e       P   e   r   s   o   n   a   l       I   n   f   o       s   e   c   t   i   o   n       w   h   e   n       t   h   e       '   A   l   w   a   y   s       S   h   o   w       M   o   r   e       I   n   f   o   '       f   e   a   t   u   r   e       i   s       t   o   g   g   l   e   d       o   n       a       w   i   d   e   n   e   d       p   a   g   e   .   
 
   
 
   
 
   
 
   #   #       [   8   .   3   7   ]       -       2   0   2   6   -   0   4   -   1   6   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       M   o   d   i   f   i   e   d       t   h   e       `   G   a   n   g   A   r   m   o   r   y   H   e   l   p   e   r   `       t   o       e   n   s   u   r   e       t   h   a   t       a   n   y       i   t   e   m   s       c   u   r   r   e   n   t   l   y       l   o   a   n   e   d       t   o       t   h   e       a   c   t   i   v   e       u   s   e   r       a   r   e       a   l   w   a   y   s       v   i   s   i   b   l   e       o   u   t   -   o   f   -   t   h   e   -   b   o   x   ,       b   y   p   a   s   s   i   n   g       t   h   e       "   H   i   d   e       A   l   l   "       g   r   o   u   p       c   o   n   s   o   l   i   d   a   t   i   o   n       l   o   g   i   c       s   o       u   s   e   r   s       n   o       l   o   n   g   e   r       h   a   v   e       t   o       h   u   n   t       t   h   r   o   u   g   h       c   o   l   l   a   p   s   e   d       g   r   o   u   p   s       f   o   r       t   h   e   i   r       o   w   n       g   e   a   r   .   
 
   
 
   
 
   
 
   #   #       [   8   .   3   6   ]       -       2   0   2   6   -   0   4   -   1   6   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       E   x   t   e   n   d   e   d       t   h   e       s   c   r   i   p   t   '   s       g   l   o   b   a   l       e   x   e   c   u   t   i   o   n       d   o   m   a   i   n       s   c   o   p   e       (   v   i   a       `   @   m   a   t   c   h   `       h   e   a   d   e   r   s   )       t   o       s   e   a   m   l   e   s   s   l   y       s   u   p   p   o   r   t       b   o   t   h       t   h   e       s   t   a   n   d   a   r   d       `   w   w   w   .   h   o   b   o   w   a   r   s   .   c   o   m   `       a   d   d   r   e   s   s       a   n   d       t   h   e       n   o   n   -   w   w   w       `   h   o   b   o   w   a   r   s   .   c   o   m   `       v   a   r   i   a   t   i   o   n   ,       f   i   x   i   n   g       i   n   s   t   a   n   c   e   s       w   h   e   r   e       T   a   m   p   e   r   m   o   n   k   e   y       r   e   f   u   s   e   d       t   o       r   u   n       t   h   e       c   o   d   e   .   
 
   
 
   
 
   
 
   #   #       [   8   .   3   5   ]       -       2   0   2   6   -   0   4   -   1   6   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       d   e   s   c   r   i   p   t   i   v   e       h   o   v   e   r       t   o   o   l   t   i   p   s       (   a   l   t   e   r   n   a   t   e       t   e   x   t   )       t   o       t   h   e       `   G   a   n   g   A   r   m   o   r   y   H   e   l   p   e   r   `       g   l   o   b   a   l       a   c   t   i   o   n       b   u   t   t   o   n   s       (   S   h   o   w       H   i   d   d   e   n   ,       H   i   d   e       S   e   l   e   c   t   e   d   ,       S   a   v   e       F   a   v   o   r   i   t   e   s   ,       E   x   p   a   n   d       A   l   l   )       t   o       c   l   e   a   r   l   y       c   o   n   v   e   y       e   x   a   c   t   l   y       w   h   a   t       e   a   c   h       a   c   t   i   o   n       p   e   r   f   o   r   m   s   .   
 
   
 
   
 
   
 
   #   #       [   8   .   3   4   ]       -       2   0   2   6   -   0   4   -   1   6   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       F   i   x   e   d       a   n       i   s   s   u   e       i   n       `   G   a   n   g   A   r   m   o   r   y   H   e   l   p   e   r   `       w   h   e   r   e       b   r   o   w   s   e   r   s       w   e   r   e       a   g   g   r   e   s   s   i   v   e       c   a   c   h   i   n   g       a   n   d       i   n   c   o   r   r   e   c   t   l   y       r   e   s   t   o   r   i   n   g       t   h   e       s   e   l   e   c   t   i   o   n       s   t   a   t   e       o   f       c   h   e   c   k   b   o   x   e   s       u   p   o   n       r   e   l   o   a   d   i   n   g       t   h   e       p   a   g   e   .       U   n   c   h   e   c   k   i   n   g       c   h   e   c   k   b   o   x   e   s       i   s       n   o   w       e   n   f   o   r   c   e   d       p   r   o   g   r   a   m   m   a   t   i   c   a   l   l   y       v   i   a       s   c   r   i   p   t       d   e   f   a   u   l   t       a   n   d       `   a   u   t   o   c   o   m   p   l   e   t   e   =   "   o   f   f   "   `       a   t   t   r   i   b   u   t   e   s   .   
 
   
 
   -       R   e   f   i   n   e   d       G   a   n   g       A   r   m   o   r   y       c   h   e   c   k   b   o   x       l   o   g   i   c       s   o       t   h   a   t       "   S   a   v   e       F   a   v   o   r   i   t   e   s   "       a   n   d       "   H   i   d   e       S   e   l   e   c   t   e   d   "       o   p   e   r   a   t   i   o   n   s       e   x   p   l   i   c   i   t   l   y       d   e   s   e   l   e   c   t       t   h   e       c   h   e   c   k   b   o   x   e   s       i   n   t   e   r   n   a   l   l   y       b   e   f   o   r   e       p   r   o   m   p   t   i   n   g       a       p   a   g   e       r   e   l   o   a   d       t   o       g   u   a   r   a   n   t   e   e       a       c   l   e   a   n       s   l   a   t   e   .   
 
   
 
   
 
   
 
   #   #       [   8   .   3   3   ]       -       2   0   2   6   -   0   4   -   1   6   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       `   G   a   n   g   A   r   m   o   r   y   H   e   l   p   e   r   `       t   o       c   o   m   p   l   e   t   e   l   y       o   v   e   r   h   a   u   l       t   h   e       G   a   n   g       A   r   m   o   r   y       i   n   t   e   r   f   a   c   e       (   `   c   m   d   =   g   a   n   g   &   d   o   =   a   r   m   o   r   y   `   )   .   
 
   
 
   -       G   r   o   u   p   e   d       i   d   e   n   t   i   c   a   l       w   e   a   p   o   n   s   ,       a   r   m   o   r   ,       a   n   d       r   i   n   g   s       b   y       n   a   m   e       i   n   t   o       e   x   p   a   n   d   a   b   l   e       c   a   t   e   g   o   r   i   c   a   l       t   a   b   l   e   s   ,       s   o   r   t   e   d       d   y   n   a   m   i   c   a   l   l   y       b   y       t   h   e   i   r       p   r   i   m   a   r   y       p   o   w   e   r       s   t   a   t   i   s   t   i   c   s       r   a   t   h   e   r       t   h   a   n       a   l   p   h   a   b   e   t   i   c   a   l   l   y   .   
 
   
 
   -       A   d   d   e   d       a       "   F   a   v   o   r   i   t   e       I   t   e   m   s   "       d   a   s   h   b   o   a   r   d       a   b   o   v   e       t   h   e       A   r   m   o   r   y       t   a   b   s       t   h   a   t       l   e   t   s       u   s   e   r   s       p   i   n       p   r   i   o   r   i   t   y       i   t   e   m   s   ,       d   i   s   p   l   a   y   i   n   g       r   e   a   l   -   t   i   m   e       a   v   a   i   l   a   b   i   l   i   t   y       a   n   d       w   a   r   n   i   n   g       i   n       r   e   d       i   f       a   l   l       c   o   p   i   e   s       a   r   e       l   o   a   n   e   d       o   u   t   .   
 
   
 
   -       A   d   d   e   d       a   n       i   n   t   e   r   a   c   t   i   v   e       "   H   i   d   e       S   e   l   e   c   t   e   d   "       s   y   s   t   e   m       a   l   l   o   w   i   n   g       u   s   e   r   s       t   o       p   e   r   m   a   n   e   n   t   l   y       h   i   d   e       u   n   w   a   n   t   e   d       c   l   u   t   t   e   r       i   t   e   m   s       f   r   o   m       t   h   e       A   r   m   o   r   y       v   i   e   w   .       H   i   d   d   e   n       i   t   e   m   s       c   a   n       b   e       t   o   g   g   l   e   d       b   a   c   k       i   n   t   o       v   i   e   w       v   i   a       a       "   S   h   o   w       H   i   d   d   e   n   "       b   u   t   t   o   n   .   
 
   
 
   -       I   n   t   e   g   r   a   t   e   d       r   o   b   u   s   t       m   a   n   a   g   e   m   e   n   t       f   o   r       "   F   a   v   o   r   i   t   e       I   t   e   m   s   "       a   n   d       "   H   i   d   d   e   n       I   t   e   m   s   "       d   i   r   e   c   t   l   y       i   n   t   o       t   h   e       `   S   e   t   t   i   n   g   s   H   e   l   p   e   r   `       p   r   e   f   e   r   e   n   c   e   s       p   a   g   e       t   o       e   a   s   i   l   y       r   e   m   o   v   e       i   n   d   i   v   i   d   u   a   l       i   t   e   m   s       o   r       r   e   s   e   t       e   n   t   i   r   e       l   i   s   t   s   .   
 
   
 
   -       I   m   p   l   e   m   e   n   t   e   d       g   l   o   b   a   l       a   c   t   i   o   n       b   u   t   t   o   n   s       f   o   r       "   E   x   p   a   n   d       A   l   l   "   ,       "   C   o   l   l   a   p   s   e       A   l   l   "   ,       a   n   d       c   o   l   u   m   n       h   e   a   d   e   r       c   h   e   c   k   b   o   x   e   s       t   o       q   u   i   c   k   l   y       s   e   l   e   c   t       o   r       d   e   s   e   l   e   c   t       a   l   l       i   t   e   m   s       i   n       a       g   r   o   u   p       a   t       o   n   c   e   .   
 
   
 
   
 
   
 
   #   #       [   8   .   3   2   ]       -       2   0   2   6   -   0   4   -   1   5   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       F   i   x   e   d       D   i   s   p   l   a   y   H   e   l   p   e   r       c   u   s   t   o   m       t   i   t   l   e   s       (   F   a   k   e       Q   w   e   e       a   n   d       J   a   c   k       R   e   a   c   h   e   r   )       i   n   c   o   r   r   e   c   t   l   y       i   n   j   e   c   t   i   n   g       t   e   x   t       i   n   t   o       p   l   a   y   e   r       a   v   a   t   a   r       e   l   e   m   e   n   t   s       b   y       s   k   i   p   p   i   n   g       `   .   p   a   v   a   t   a   r   `       e   l   e   m   e   n   t   s   .   
 
   
 
   
 
   
 
   #   #       [   8   .   3   1   ]       -       2   0   2   6   -   0   4   -   1   5   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       U   p   d   a   t   e   d       `   M   a   r   k   e   t   H   e   l   p   e   r   `       t   o       c   o   n   v   e   r   t       i   n   l   i   n   e       `   [   R   e   m   o   v   e   ]   `       l   i   n   k   s       i   n   t   o       i   n   t   e   r   a   c   t   i   v   e       f   o   r   m   a   t       b   u   t   t   o   n   s       a   l   o   n   g   s   i   d   e       `   [   B   u   y   ]   `       l   i   n   k   s   .   
 
   
 
   
 
   
 
   #   #       [   8   .   3   0   ]       -       2   0   2   6   -   0   4   -   1   5   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       *   *   D   i   s   p   l   a   y       H   e   l   p   e   r   *   *   :       A   d   d   e   d       a       n   e   w       s   e   t   t   i   n   g       t   o       d   i   s   p   l   a   y       a       g   r   e   e   n       "   M   a   j   o   r   "       t   i   t   l   e       t   a   g       n   e   x   t       t   o       a   l   l       p   r   o   f   i   l   e       l   i   n   k   s       p   o   i   n   t   i   n   g       t   o       J   a   c   k       R   e   a   c   h   e   r       (   1   0   7   3   8   0   )   .   
 
   
 
   
 
   
 
   #   #       [   8   .   2   9   ]       -       2   0   2   6   -   0   4   -   1   4   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       *   *   P   l   a   y   e   r       H   e   l   p   e   r   *   *   :       A   d   d   e   d       a       c   l   i   c   k   a   b   l   e       i   c   o   n       t   o       u   s   e   r       p   r   o   f   i   l   e   s       (   c   m   d   =   p   l   a   y   e   r   )       t   h   a   t       e   a   s   i   l   y       c   o   p   i   e   s       t   h   e       u   s   e   r   '   s       [   h   o   b   o   n   a   m   e   =   I   D   ]       t   a   g       t   o       t   h   e       c   l   i   p   b   o   a   r   d   .   
 
   
 
   #   #       [   8   .   2   8   ]       -       2   0   2   6   -   0   4   -   1   4   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       \   [   h   o   b   o   n   a   m   e   =   ]   \       f   o   r   m   a   t   t   i   n   g       i   n   s   e   r   t   i   o   n       b   u   t   t   o   n       t   o       t   h   e       m   e   s   s   a   g   e       e   d   i   t   o   r       t   o   o   l   b   a   r   s       (   M   e   s   s   a   g   e   B   o   a   r   d   H   e   l   p   e   r   .   j   s   )   .   
 
   
 
   
 
   
 
   #   #       [   8   .   2   7   ]       -       2   0   2   6   -   0   4   -   1   4   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       c   l   i   c   k   a   b   l   e       c   o   p   y       l   i   n   k       i   c   o   n       n   e   x   t       t   o       u   s   e   r       I   D   s       i   n       t   h   e       M   e   s   s   a   g   e       B   o   a   r   d       t   o       q   u   i   c   k   l   y       f   o   r   m   a   t       a   n   d       c   o   p   y       t   h   e   i   r       [   h   o   b   o   n   a   m   e   =   I   D   ]       f   o   r       r   e   p   l   i   e   s   ,       i   n   t   e   g   r   a   t   i   n   g       t   h   e       g   a   m   e   '   s       n   a   t   i   v   e       t   i   p   T   i   p       t   o   o   l   t   i   p   ,       w   i   t   h   i   n       \   M   e   s   s   a   g   e   B   o   a   r   d   H   e   l   p   e   r   .   j   s   \   .   
 
   
 
   
 
   
 
   #   #       [   8   .   2   6   ]       -       2   0   2   6   -   0   4   -   1   4   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       m   u   l   t   i   -   c   o   l   u   m   n       i   n   t   e   r   a   c   t   i   v   e       c   l   i   e   n   t   -   s   i   d   e       s   o   r   t   i   n   g       f   o   r       t   h   e       H   i   t   l   i   s   t       t   a   b   l   e       (   `   H   i   t   l   i   s   t   H   e   l   p   e   r   `   )   ,       r   e   p   l   a   c   i   n   g       t   h   e       s   l   o   w       n   a   t   i   v   e       s   e   r   v   e   r   -   r   e   f   r   e   s   h       s   o   r   t   i   n   g       l   i   n   k   s   .       S   o   r   t   i   n   g       c   o   n   f   i   g   u   r   a   t   i   o   n   s       s   e   c   u   r   e   l   y       p   e   r   s   i   s   t       v   i   a       b   r   o   w   s   e   r       l   o   c   a   l       s   t   o   r   a   g   e   .   
 
   
 
   -       I   m   p   l   e   m   e   n   t   e   d       a       c   o   m   b   a   t       w   i   n   d   o   w       h   i   g   h   l   i   g   h   t   e   r       w   i   t   h   i   n       t   h   e       `   H   i   t   l   i   s   t   H   e   l   p   e   r   `       t   h   a   t       a   u   t   o   m   a   t   i   c   a   l   l   y       s   h   a   d   e   s       r   o   w   s       a   n       a   l   e   r   t   i   n   g       l   i   g   h   t       r   e   d       i   f       a   n       o   p   p   o   n   e   n   t   '   s       l   e   v   e   l       d   r   a   s   t   i   c   a   l   l   y       f   a   l   l   s       o   u   t   s   i   d   e       t   h   e       p   l   a   y   e   r   '   s       i   m   m   e   d   i   a   t   e       a   t   t   a   c   k       l   i   m   i   t   s       (   Â   ±   2   0   0       c   o   m   b   a   t       l   e   v   e   l   s   )   .   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       U   p   d   a   t   e   d       `   A   G   E   N   T   S   .   m   d   `       i   n   s   t   r   u   c   t   i   o   n   s       s   p   e   c   i   f   i   c   a   l   l   y       t   o       m   a   n   d   a   t   e       t   h   e       c   o   n   t   i   n   u   e   d       u   s   a   g   e       a   n   d       e   x   p   a   n   s   i   o   n       o   f       c   e   n   t   r   a   l   i   z   e   d       i   n   t   e   r   n   a   l       g   a   m   e       v   a   l   u   e       r   e   t   r   i   e   v   a   l       m   e   t   h   o   d   s       l   o   c   a   t   e   d       w   i   t   h   i   n       t   h   e       `   U   t   i   l   s   `       c   l   a   s   s       i   n   s   t   e   a   d       o   f       c   o   n   t   i   n   u   o   u   s   l   y       d   u   p   l   i   c   a   t   i   n   g       g   e   n   e   r   i   c       o   p   e   r   a   t   i   o   n   s       w   i   t   h   i   n       s   e   p   a   r   a   t   e       m   o   d   u   l   e   s   .   
 
   
 
   
 
   
 
   #   #       [   8   .   2   5   ]       -       2   0   2   6   -   0   4   -   1   3   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       U   p   d   a   t   e   d       t   h   e       "   N   e   x   t       I   n   t   e   r   e   s   t   i   n   g       L   e   v   e   l   "       d   i   s   p   l   a   y       t   o       i   n   d   i   c   a   t   e       w   h   e   n       y   o   u   r       c   u   r   r   e   n   t       l   e   v   e   l       i   s       a       p   r   i   m   e       n   u   m   b   e   r   .   
 
   
 
   -       O   p   t   i   m   i   s   e   d       t   h   e       u   n   d   e   r   l   y   i   n   g       p   r   i   m   e   s       d   a   t   a       s   e   t       t   o       o   n   l   y       t   r   a   c   k       p   r   i   m   e   s       u   p       t   o       l   e   v   e   l       1   0   0   0   .   
 
   
 
   
 
   
 
   #   #       [   8   .   2   4   ]       -       2   0   2   6   -   0   4   -   1   3   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       f   u   n   c   t   i   o   n   a   l   i   t   y       t   o       e   x   p   l   i   c   i   t   l   y       d   i   s   p   l   a   y       t   h   e       c   a   l   c   u   l   a   t   e   d       T   o   t   a   l       P   a   y   o   u   t       a   m   o   u   n   t       d   i   r   e   c   t   l   y       w   i   t   h   i   n       t   h   e       "   P   u   s   h       P   a   y   o   u   t   s       t   o       D   a   s   h   b   o   a   r   d   "       p   a   n   e   l       o   n       c   o   m   p   l   e   t   e   d       '   G   a   n   g   s   t   e   r   s       S   u   n   d   a   y       =       F   u   n   d   a   y   '       e   v   e   n   t       s   u   m   m   a   r   y       p   a   g   e   s   .   
 
   
 
   
 
   
 
   #   #       [   8   .   2   3   ]       -       2   0   2   6   -   0   4   -   1   3   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       F   i   x   e   d       a   n       i   s   s   u   e       w   h   e   r   e       t   h   e       `   G   a   n   g   H   e   l   p   e   r   `       i   n   c   o   r   r   e   c   t   l   y       a   t   t   e   m   p   t   e   d       t   o       r   u   n       n   o   n   -   e   x   i   s   t   e   n   t       l   o   a   n   s       l   o   g   i   c       o   n       t   h   e       g   a   n   g       l   o   a   n   s       p   a   g   e       i   n   s   t   e   a   d       o   f       c   l   e   a   n   l   y       d   e   f   e   r   r   i   n   g       t   o       `   G   a   n   g   L   o   a   n   s   H   e   l   p   e   r   `   .   
 
   
 
   
 
   
 
   #   #       [   8   .   2   2   ]       -       2   0   2   6   -   0   4   -   1   2   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a   n       "   A   t   t   a   c   k       R   a   n   g   e   "       c   h   e   c   k   b   o   x       f   i   l   t   e   r       t   o       `   A   c   t   i   v   e   L   i   s   t   H   e   l   p   e   r   `       t   h   a   t       i   n   s   t   a   n   t   l   y       r   e   s   t   r   i   c   t   s       t   h   e       v   i   e   w   a   b   l   e       o   p   p   o   n   e   n   t       l   i   s   t       e   x   c   l   u   s   i   v   e   l   y       t   o       p   l   a   y   e   r   s       f   a   l   l   i   n   g       w   i   t   h   i   n       y   o   u   r       i   m   m   e   d   i   a   t   e       c   o   m   b   a   t       l   e   v   e   l       r   a   n   g   e       (   Â   ±   2   0   0       l   e   v   e   l   s       o   f       y   o   u   r       c   u   r   r   e   n   t       H   o   b   o       l   e   v   e   l   )   .       F   i   l   t   e   r       p   e   r   s   i   s   t   e   n   t   l   y       s   a   v   e   s       t   o       l   o   c   a   l       s   t   o   r   a   g   e   .   
 
   
 
   
 
   
 
   #   #       [   8   .   2   1   ]       -       2   0   2   6   -   0   4   -   1   2   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       `   A   c   t   i   v   e   L   i   s   t   H   e   l   p   e   r   `       m   o   d   u   l   e       f   o   r       t   h   e       R   e   c   e   n   t   l   y       A   c   t   i   v   e       p   l   a   y   e   r   s       l   i   s   t       p   a   g   e       (   `   c   m   d   =   a   c   t   i   v   e   `   )   .   
 
   
 
   -       A   d   d   e   d       a   n       i   n   t   e   r   a   c   t   i   v   e       "   A   l   i   v   e       /       D   e   a   d   "       f   i   l   t   e   r   i   n   g       b   u   t   t   o   n       s   y   s   t   e   m       t   o       t   h   e       A   c   t   i   v   e       L   i   s   t       p   a   g   e   ,       a   l   l   o   w   i   n   g       u   s   e   r   s       t   o       d   y   n   a   m   i   c   a   l   l   y       h   i   d   e       d   e   a   d       p   l   a   y   e   r   s       o   r       s   h   o   w       e   v   e   r   y   o   n   e   .       T   h   e       s   e   l   e   c   t   e   d       f   i   l   t   e   r       s   t   a   t   e       i   s       a   u   t   o   m   a   t   i   c   a   l   l   y       s   a   v   e   d       s   e   c   u   r   e   l   y       v   i   a       l   o   c   a   l       s   t   o   r   a   g   e       t   o       p   e   r   s   i   s   t       b   e   t   w   e   e   n       p   a   g   e       r   e   l   o   a   d   s   .   
 
   
 
   
 
   
 
   #   #       [   8   .   2   0   ]       -       2   0   2   6   -   0   4   -   1   2   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       `   M   a   r   k   e   t   H   e   l   p   e   r   `       f   o   r       t   h   e       m   a   r   k   e   t   p   l   a   c   e   ,       e   n   a   b   l   i   n   g       n   e   w       c   u   s   t   o   m   i   z   e   d       f   e   a   t   u   r   e   s       i   n   s   i   d   e       t   h   e       S   u   p   e   r   G   l   o   b   a   l   H   y   p   e   r   M   a   r   t   .   
 
   
 
   -       A   d   d   e   d       v   i   s   u   a   l       i   n   j   e   c   t   i   o   n   s       f   o   r       t   h   e       m   a   r   k   e   t   p   l   a   c   e       t   a   b   l   e       t   o       d   y   n   a   m   i   c   a   l   l   y       e   m   b   e   d       4   0   x   4   0       i   t   e   m       t   h   u   m   b   n   a   i   l   s       a   l   o   n   g   s   i   d   e       t   h   e   i   r       t   e   x   t       e   n   t   r   y   .       A   u   t   o   m   a   t   i   c   a   l   l   y       f   e   t   c   h   e   s       v   i   s   u   a   l   s       f   o   r       W   e   a   p   o   n   s   ,       A   r   m   o   r   ,       a   n   d       C   a   r   t       P   a   r   t   s   .   
 
   
 
   -       U   p   g   r   a   d   e   d       t   h   e       M   a   r   k   e   t       n   a   v   i   g   a   t   i   o   n       U   I   :       "   S   w   i   t   c   h       t   o   :   "       d   e   s   t   i   n   a   t   i   o   n       l   i   n   k   s       (   P   o   i   n   t   s   ,       T   o   k   e   n   s   ,       D   P   S   ,       W   e   a   p   o   n   s   ,       A   r   m   o   r   ,       C   a   r   t       P   a   r   t   s   )       a   n   d       i   n   d   i   v   i   d   u   a   l       r   o   w       `   [   B   u   y   ]   `       t   e   x   t       l   i   n   k   s       h   a   v   e       b   e   e   n       s   t   r   i   p   p   e   d       o   f       b   r   a   c   k   e   t   s   /   c   o   m   m   a   s       a   n   d       s   t   y   l   i   z   e   d       a   s       n   a   t   i   v   e       p   l   a   t   f   o   r   m       b   u   t   t   o   n   s       i   n   s   t   e   a   d       o   f       s   m   a   l   l       l   i   n   k   s       f   o   r       i   m   p   r   o   v   e   d       c   l   i   c   k   i   n   g       e   x   p   e   r   i   e   n   c   e   .   
 
   
 
   
 
   
 
   #   #       [   8   .   1   9   ]       -       2   0   2   6   -   0   4   -   1   2   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       p   e   r   m   a   n   e   n   t       B   a   n   k       G   o   a   l       s   h   o   r   t   c   u   t       b   u   t   t   o   n   s       (   +   5   k   ,       +   1   0   k   ,       +   5   0   k   )       t   o       t   h   e       B   a   n   k       w   i   t   h   d   r   a   w       i   n   t   e   r   f   a   c   e   .       T   h   e   s   e       c   a   n       b   e       t   o   g   g   l   e   d       v   i   a       t   h   e       n   e   w       `   B   a   n   k   H   e   l   p   e   r   _   F   i   x   e   d   G   o   a   l   s   `       s   e   t   t   i   n   g   .   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       R   e   m   o   v   e   d       t   h   e       i   n   l   i   n   e       c   l   i   c   k   -   c   o   u   n   t       t   r   a   c   k   i   n   g       t   e   x   t       o   n       t   h   e       5       F   i   g   h   t   e   r   '   s       L   u   n   c   h   e   s       B   a   n   k       G   o   a   l       b   u   t   t   o   n   ,       a   s       t   h   e       m   a   i   n       d   o   l   l   a   r       a   m   o   u   n   t       i   n   p   u   t       f   i   e   l   d       c   l   e   a   r   l   y       s   h   o   w   s       t   h   e       t   o   t   a   l       p   r   o   g   r   e   s   s   .   
 
   
 
   
 
   
 
   #   #       [   8   .   1   8   ]       -       2   0   2   6   -   0   4   -   1   2   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       C   a   p   p   e   d       t   h   e       "   S   h   o   w       N   e   x   t       I   n   t   e   r   e   s   t   i   n   g       L   e   v   e   l   "       f   e   a   t   u   r   e       b   y       r   e   m   o   v   i   n   g       p   r   i   m   e   s       o   v   e   r       1   0   0   0       f   r   o   m       t   h   e       l   o   c   a   l       d   a   t   a       r   e   g   i   s   t   r   y   ,       a   s       h   i   g   h   e   r       v   a   l   u   e   s       a   r   e       n   o   t       n   e   e   d   e   d   .   
 
   
 
   
 
   
 
   #   #       [   8   .   1   7   ]       -       2   0   2   6   -   0   4   -   1   2   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       R   e   f   i   n   e   d       t   h   e       "   S   h   o   w       N   e   x   t       I   n   t   e   r   e   s   t   i   n   g       L   e   v   e   l   "       f   e   a   t   u   r   e       t   o       u   s   e       y   o   u   r       c   u   r   r   e   n   t       l   e   v   e   l       a   s       t   h   e       g   o   a   l       i   n   d   i   c   a   t   o   r       i   f       y   o   u       a   r   e       c   u   r   r   e   n   t   l   y       a   t       a       p   r   i   m   e       l   e   v   e   l   ,       i   n   s   t   e   a   d       o   f       s   k   i   p   p   i   n   g       t   o       t   h   e       s   u   b   s   e   q   u   e   n   t       p   r   i   m   e   .   
 
   
 
   
 
   
 
   #   #       [   8   .   1   6   ]       -       2   0   2   6   -   0   4   -   1   2   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       "   S   h   o   w       N   e   x   t       I   n   t   e   r   e   s   t   i   n   g       L   e   v   e   l   "       f   e   a   t   u   r   e       t   o       `   D   i   s   p   l   a   y   H   e   l   p   e   r   `       t   h   a   t       a   u   t   o   m   a   t   i   c   a   l   l   y       d   i   s   p   l   a   y   s       t   h   e       n   e   x   t       p   r   i   m   e       l   e   v   e   l       n   e   x   t       t   o       y   o   u   r       c   u   r   r   e   n   t       l   e   v   e   l       o   n       t   h   e       U   I   .       T   h   i   s       c   a   n       b   e       t   o   g   g   l   e   d       v   i   a       s   e   t   t   i   n   g   s   .   
 
   
 
   
 
   
 
   #   #       [   8   .   1   5   ]       -       2   0   2   6   -   0   4   -   1   2   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       t   h   e       p   r   o   j   e   c   t   e   d       E   v   e   n   t       P   a   y   o   u   t       M   a   n   a   g   e   r       t   o       t   h   e       c   u   r   r   e   n   t       g   a   n   g       h   a   p   p   e   n   i   n   g   s       p   a   g   e       o   n       S   u   n   d   a   y   s   ,       r   e   s   t   r   i   c   t   e   d       t   o       u   s   e   r   s       w   i   t   h       G   a   n   g       S   t   a   f   f       a   c   c   e   s   s   .   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       U   n   i   f   i   e   d       t   h   e       E   v   e   n   t       P   a   y   o   u   t       M   a   n   a   g   e   r       U   I       b   e   t   w   e   e   n       t   h   e       l   a   s   t       h   a   p   p   e   n   i   n   g   s       a   n   d       c   u   r   r   e   n   t       h   a   p   p   e   n   i   n   g   s       p   a   g   e   ,       d   i   s   p   l   a   y   i   n   g       p   r   o   j   e   c   t   e   d       t   o   t   a   l   s       a   u   t   o   n   o   m   o   u   s   l   y   .   
 
   
 
   -       S   p   l   i   t       t   h   e       E   v   e   n   t       P   a   y   o   u   t       M   a   n   a   g   e   r   '   s       s   a   v   e       f   u   n   c   t   i   o   n   a   l   i   t   y       s   o       '   S   a   v   e       T   i   e   r       S   e   t   t   i   n   g   s   '       o   p   e   r   a   t   e   s       i   n   d   e   p   e   n   d   e   n   t   l   y       o   f       '   P   u   s   h       P   a   y   o   u   t   s       t   o       D   a   s   h   b   o   a   r   d   '   .   
 
   
 
   
 
   
 
   #   #       [   8   .   1   4   ]       -       2   0   2   6   -   0   4   -   1   2   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       I   m   p   r   o   v   e   d       t   h   e       v   i   s   u   a   l       p   r   e   s   e   n   t   a   t   i   o   n       o   f       t   h   e       r   a   t       e   x   p   e   r   i   e   n   c   e       b   a   r   s       o   n       t   h   e       `   R   a   t   s   H   e   l   p   e   r   `       f   e   e   d       p   a   g   e       b   y       a   d   d   i   n   g       a       d   i   s   t   i   n   c   t       b   o   r   d   e   r       t   o       c   l   e   a   r   l   y       i   n   d   i   c   a   t   e       1   0   0   %       c   a   p   a   c   i   t   y   .   
 
   
 
   -       C   o   m   p   a   c   t   e   d       t   h   e       "   F   e   e   d   "       b   u   t   t   o   n   s       o   n       t   h   e       `   R   a   t   s   H   e   l   p   e   r   `       f   e   e   d       p   a   g   e       t   o       r   e   d   u   c   e       v   e   r   t   i   c   a   l       f   o   o   t   p   r   i   n   t       a   n   d       i   m   p   r   o   v   e       r   e   a   d   a   b   i   l   i   t   y   .   
 
   
 
   -       C   o   n   v   e   r   t   e   d       t   h   e       m   a   i   n       n   a   v   i   g   a   t   i   o   n       t   e   x   t       l   i   n   k   s       o   n       t   h   e       p   r   i   m   a   r   y       R   a   t       p   a   g   e       (   A   c   t   i   v   e       r   a   t   ,       P   e   t       C   e   m   e   t   e   r   y   ,       R   a   t       S   t   o   r   e   ,       M   o   r   e       I   n   f   o   r   m   a   t   i   o   n   ,       R   a   t       F   u   n   d   ,       N   e   w   s       a   l   e   r   t   s   )       i   n   t   o       a       u   n   i   f   i   e   d   ,       b   u   t   t   o   n   -   b   a   s   e   d       U   I       l   a   y   o   u   t       f   o   r       a       m   o   r   e       t   a   c   t   i   l   e       e   x   p   e   r   i   e   n   c   e   .   
 
   
 
   
 
   
 
   #   #       [   8   .   1   3   ]       -       2   0   2   6   -   0   4   -   1   1   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       I   m   p   r   o   v   e   d       t   h   e       v   i   s   u   a   l       s   t   y   l   i   n   g       o   f       t   h   e       n   e   w   l   y       a   d   d   e   d       "   M   a   s   s       M   a   i   l   s   "       f   i   l   t   e   r       b   u   t   t   o   n   s       i   n       `   G   a   n   g   H   e   l   p   e   r   `   ,       c   o   n   v   e   r   t   i   n   g       t   h   e   m       i   n   t   o       p   o   l   i   s   h   e   d   ,       i   n   t   e   r   a   c   t   i   v   e       p   i   l   l   -   s   t   y   l   e       b   u   t   t   o   n   s       w   i   t   h       a   c   t   i   v   e       s   t   a   t   e       i   n   d   i   c   a   t   o   r   s   .   
 
   
 
   
 
   
 
   #   #       [   8   .   1   2   ]       -       2   0   2   6   -   0   4   -   1   0   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       f   o   r   m   a   t   t   i   n   g       t   o       t   h   e       M   a   s   s       M   a   i   l   s       l   i   s   t       o   n       t   h   e       G   a   n   g       R   e   a   d       M   a   i   l       p   a   g   e       v   i   a       `   G   a   n   g   H   e   l   p   e   r   `   .       C   o   n   v   e   r   t   s       t   h   e       t   e   x   t       l   i   s   t       i   n   t   o       a       r   e   a   d   a   b   l   e       t   a   b   l   e       w   i   t   h       c   o   l   o   r   e   d       r   e   a   d   /   u   n   r   e   a   d       s   t   a   t   u   s   ,       n   u   m   e   r   i   c       c   o   u   n   t   s   ,       a   n   d       t   a   b   l   e       r   o   w       f   i   l   t   e   r   i   n   g       o   p   t   i   o   n   s   .   
 
   
 
   
 
   
 
   #   #       [   8   .   1   1   ]       -       2   0   2   6   -   0   4   -   0   9   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       R   e   p   l   a   c   e   d       t   h   e       f   l   a   t       p   a   y   m   e   n   t       r   a   t   e       f   o   r       `   G   a   n   g   s   t   e   r   s       S   u   n   d   a   y       =       F   u   n   d   a   y   `       p   a   y   o   u   t   s       v   i   a       `   G   a   n   g   H   e   l   p   e   r   `       w   i   t   h       a       h   i   g   h   l   y       c   o   n   f   i   g   u   r   a   b   l   e       m   u   l   t   i   -   t   i   e   r       d   y   n   a   m   i   c       p   a   y   o   u   t       s   y   s   t   e   m   .       U   s   e   r   s       c   a   n       n   o   w       d   e   f   i   n   e       m   i   n   i   m   u   m   ,       m   a   x   i   m   u   m       p   o   i   n   t       b   r   a   c   k   e   t   s   ,       a   n   d       u   n   i   q   u   e   l   y       c   o   r   r   e   s   p   o   n   d   i   n   g       p   r   i   c   e   -   p   e   r   -   p   o   i   n   t       t   i   e   r       r   a   t   e   s   .   
 
   
 
   -       A   u   t   o   m   a   t   i   c   a   l   l   y       f   o   r   m   a   t   t   e   d       M   a   x       P   a   y   o   u   t       a   n   d       t   i   e   r       r   a   t   e       i   n   p   u   t       v   a   l   u   e   s   ,       a   s       w   e   l   l       a   s       g   e   n   e   r   a   t   e   d       p   a   y   o   u   t       a   m   o   u   n   t   s   ,       w   i   t   h       c   o   m   m   a       s   e   p   a   r   a   t   i   o   n       a   n   d       d   o   l   l   a   r       s   i   g   n   s       f   o   r       c   l   e   a   n       d   a   t   a       p   r   e   s   e   n   t   a   t   i   o   n   .   
 
   
 
   
 
   
 
   #   #       [   8   .   1   0   ]       -       2   0   2   6   -   0   4   -   0   9   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       t   h   e       a   b   i   l   i   t   y       t   o       s   u   c   c   e   s   s   f   u   l   l   y       p   a   r   s   e       a   n   d       r   e   n   d   e   r       i   n   l   i   n   e       C   S   V       d   a   t   a       i   n   t   o       f   u   l   l   y       s   t   y   l   e   d       H   T   M   L       t   a   b   l   e   s       w   i   t   h   i   n       M   e   s   s   a   g   e       B   o   a   r   d       p   o   s   t   s       u   t   i   l   i   z   i   n   g       t   h   e       c   u   s   t   o   m       `   [   h   o   b   o   -   h   e   l   p   e   r   -   t   a   b   l   e   ]   `       t   a   g       s   y   s   t   e   m   .       
 
   
 
   -       F   o   r   m   a   t   t   e   d       r   e   n   d   e   r   e   d       t   a   b   l   e       r   o   w   s       w   i   t   h       a   l   t   e   r   n   a   t   i   n   g       c   e   l   l       h   i   g   h   l   i   g   h   t   i   n   g       f   o   r       e   a   s   i   e   r       r   e   a   d   i   n   g       o   f       l   a   r   g   e       d   a   t   a       s   h   e   e   t   s   .       C   a   n       b   e       t   o   g   g   l   e   d       o   n       o   r       o   f   f       v   i   a       t   h   e       n   e   w       "   R   e   n   d   e   r       D   a   t   a       T   a   b   l   e   s       i   n       P   o   s   t   s   "       s   e   t   t   i   n   g       w   i   t   h   i   n       t   h   e       H   e   l   p   e   r       S   e   t   t   i   n   g   s       m   e   n   u   .   
 
   
 
   
 
   
 
   #   #       [   8   .   0   9   ]       -       2   0   2   6   -   0   4   -   0   9   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       t   h   e       a   b   i   l   i   t   y       t   o       r   e   m   o   v   e       s   t   a   t   i   s   t   i   c   s       f   o   r       i   n   d   i   v   i   d   u   a   l       d   r   i   n   k   s       w   i   t   h   i   n       t   h   e       `   B   a   c   k   p   a   c   k   H   e   l   p   e   r   `       F   a   v   o   u   r   i   t   e       D   r   i   n   k   s       s   t   a   t   s       m   o   d   a   l   ,       a   l   o   n   g   s   i   d   e       t   h   e       e   x   i   s   t   i   n   g       r   e   s   e   t       a   l   l       c   a   p   a   b   i   l   i   t   y   .   
 
   
 
   
 
   
 
   #   #       [   8   .   0   8   ]       -       2   0   2   6   -   0   4   -   0   9   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       G   l   o   b   a   l   l   y       r   e   p   l   a   c   e   d       `   .   i   n   n   e   r   T   e   x   t   `       w   i   t   h       `   .   t   e   x   t   C   o   n   t   e   n   t   `       a   c   r   o   s   s       a   l   l       h   e   l   p   e   r       s   c   r   i   p   t   s       t   o       p   e   r   m   a   n   e   n   t   l   y       e   r   a   d   i   c   a   t   e       a       w   i   d   e   s   p   r   e   a   d       b   u   g       w   h   e   r   e       H   o   b   o   W   a   r   s   '       R   e   s   p   o   n   s   i   v   e       L   a   y   o   u   t       h   i   d   i   n   g       e   l   e   m   e   n   t   s       f   r   o   m       v   i   e   w       c   a   u   s   e   d       J   a   v   a   S   c   r   i   p   t       t   e   x   t       s   c   r   a   p   i   n   g       t   o       f   a   i   l       a   n   d       r   e   t   u   r   n       b   l   a   n   k       s   t   r   i   n   g   s   .       
 
   
 
   -       R   e   s   t   o   r   e   d       b   r   o   k   e   n       f   u   n   c   t   i   o   n   a   l   i   t   y       t   o       t   h   e       `   W   e   l   l   n   e   s   s   C   l   i   n   i   c   H   e   l   p   e   r   `       c   u   m   u   l   a   t   i   v   e       s   p   e   n   d       t   r   a   c   k   e   r       l   o   g   i   c       d   i   r   e   c   t   l   y       r   e   s   u   l   t   i   n   g       f   r   o   m       t   h   i   s       b   u   g   .   
 
   
 
   
 
   
 
   #   #       [   8   .   0   7   ]       -       2   0   2   6   -   0   4   -   0   9   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       F   i   x   e   d       a       b   u   g       i   n       `   R   a   t   s   H   e   l   p   e   r   `       w   h   e   r   e       t   h   e       R   a   t       N   e   w   s       f   i   l   t   e   r       w   a   s       f   a   i   l   i   n   g       t   o       p   o   p   u   l   a   t   e       r   a   t       n   a   m   e   s   .       S   w   i   t   c   h   e   d       t   o       u   s   i   n   g       `   t   e   x   t   C   o   n   t   e   n   t   `       i   n   s   t   e   a   d       o   f       `   i   n   n   e   r   T   e   x   t   `       t   o       r   e   l   i   a   b   l   y       e   x   t   r   a   c   t       t   e   x   t       f   r   o   m       t   h   e       D   O   M   .   
 
   
 
   
 
   
 
   #   #       [   8   .   0   6   ]       -       2   0   2   6   -   0   4   -   0   9   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       F   i   x   e   d       t   h   e       G   a   n   g       M   e   m   b   e   r       L   i   s   t       t   a   b   l   e       s   t   y   l   i   n   g       b   y       r   e   -   i   n   j   e   c   t   i   n   g       C   S   S       t   o       s   u   p   p   o   r   t       n   a   t   i   v   e       `   .   e   v   e   n   `   /   `   .   o   d   d   `       r   o   w       b   a   c   k   g   r   o   u   n   d       c   o   l   o   u   r   s       a   n   d       a   n       i   n   t   e   r   a   c   t   i   v   e       `   #   e   8   f   4   f   8   `       h   o   v   e   r       e   f   f   e   c   t   .   
 
   
 
   
 
   
 
   #   #       [   8   .   0   5   ]       -       2   0   2   6   -   0   4   -   0   9   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       c   u   s   t   o   m   i   z   a   b   l   e       c   o   l   u   m   n       s   e   l   e   c   t   o   r       t   o       t   h   e       `   G   a   n   g   H   e   l   p   e   r   `       M   e   m   b   e   r       L   i   s   t       p   a   g   e       (   `   c   m   d   =   g   a   n   g   &   d   o   =   l   i   s   t   _   m   e   m   `   )   ,       a   l   l   o   w   i   n   g       u   s   e   r   s       t   o       t   o   g   g   l   e       s   p   e   c   i   f   i   c       d   a   t   a       c   o   l   u   m   n   s       o   n       a   n   d       o   f   f       d   y   n   a   m   i   c   a   l   l   y   .   
 
   
 
   -       T   h   e       M   e   m   b   e   r       L   i   s   t       t   o   p       n   a   v   i   g   a   t   i   o   n       l   i   n   k   s       (   M   a   i   n   ,       B   a   t   t   l   e       S   t   a   t   s   ,       O   t   h   e   r       S   t   a   t   s   ,       H   a   l   l       o   f       F   a   m   e   )       h   a   v   e       b   e   e   n       c   o   n   v   e   r   t   e   d       i   n   t   o       p   i   l   l       b   u   t   t   o   n   s       t   h   a   t       a   c   t       a   s       a   u   t   o   m   a   t   i   c       p   r   e   s   e   t   s       t   o       q   u   i   c   k   l   y       t   o   g   g   l   e       r   e   l   e   v   a   n   t       c   o   l   u   m   n       s   e   t   s       w   i   t   h   o   u   t       l   o   s   i   n   g       s   t   o   r   e   d       c   u   s   t   o   m       c   o   n   f   i   g   u   r   a   t   i   o   n   s   .   
 
   
 
   -       I   n   c   l   u   d   e   d       a   n       a   d   a   p   t   i   v   e       "   S   h   o   w       A   l   l   "       t   o   g   g   l   e       b   u   t   t   o   n       t   o       i   n   s   t   a   n   t   l   y       d   i   s   p   l   a   y       e   v   e   r   y       s   t   r   i   c   t   l   y       a   c   c   e   s   s   i   b   l   e       c   o   l   u   m   n       c   o   n   s   t   r   a   i   n   t       f   o   r       t   h   e       a   c   t   i   v   e       u   s   e   r       a   c   c   o   u   n   t   .   
 
   
 
   -       C   o   l   u   m   n       c   o   n   f   i   g   u   r   a   t   i   o   n   s       s   e   c   u   r   e   l   y       p   e   r   s   i   s   t       v   i   a       b   r   o   w   s   e   r       l   o   c   a   l       s   t   o   r   a   g   e       a   n   d       g   r   a   c   e   f   u   l   l   y       f   i   l   t   e   r       o   u   t       u   n   a   v   a   i   l   a   b   l   e       s   e   l   e   c   t   i   o   n   s       w   h   e   n       s   w   i   t   c   h   i   n   g       b   e   t   w   e   e   n       r   e   g   u   l   a   r       U   s   e   r       a   n   d       G   a   n   g       S   t   a   f   f       a   c   c   o   u   n   t       a   c   c   e   s   s       l   e   v   e   l   s   .   
 
   
 
   
 
   
 
   #   #       [   8   .   0   4   ]       -       2   0   2   6   -   0   4   -   0   8   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       C   r   e   a   t   e   d       a       c   o   n   f   i   g   u   r   a   b   l   e       i   n   t   e   r   f   a   c   e       f   o   r       t   h   e       `   M   e   s   s   a   g   e   B   o   a   r   d   H   e   l   p   e   r   `       "   A   d   d       P   a   i   d       M   e   s   s   a   g   e       T   e   x   t   "       a   p   p   e   n   d       b   u   t   t   o   n   .       U   s   e   r   s       c   a   n       n   o   w       o   v   e   r   r   i   d   e       t   h   e       p   r   e   p   e   n   d   e   d       m   e   s   s   a   g   e       f   o   r   m   a   t       u   s   i   n   g       c   u   s   t   o   m       t   e   x   t       c   o   m   b   i   n   e   d       w   i   t   h       d   y   n   a   m   i   c       v   a   r   i   a   b   l   e   s       `   {   h   o   b   o   n   a   m   e   }   `   ,       `   {   h   o   b   o   I   d   }   `   ,       a   n   d       `   {   d   a   t   e   }   `   .   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       E   x   p   a   n   d   e   d       `   S   e   t   t   i   n   g   s   H   e   l   p   e   r   `       l   a   y   o   u   t       a   r   c   h   i   t   e   c   t   u   r   e       t   o       h   a   n   d   l   e       f   l   u   i   d       i   n   p   u   t       s   c   a   l   i   n   g       (   e   .   g   .       `   1   0   0   %   `       w   i   d   t   h       b   l   o   c   k   s   )       a   n   d       t   r   a   i   l   i   n   g       f   e   a   t   u   r   e       d   e   s   c   r   i   p   t   i   o   n       t   e   x   t   s       n   a   t   i   v   e   l   y   .   
 
   
 
   
 
   
 
   #   #       [   8   .   0   3   ]       -       2   0   2   6   -   0   4   -   0   8   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       v   i   s   u   a   l       i   n   d   i   c   a   t   o   r       t   o       t   h   e       L   i   v   i   n   g       A   r   e   a       t   h   a   t       a   p   p   l   i   e   s       a       p   a   l   e       r   e   d       b   a   c   k   g   r   o   u   n   d       t   o       t   h   e       S   p   e   c   i   a   l       I   t   e   m       c   o   n   t   a   i   n   e   r       w   h   e   n       t   h   e       i   t   e   m       i   s       i   n   a   c   t   i   v   e   .   
 
   
 
   
 
   
 
   #   #       [   8   .   0   2   ]       -       2   0   2   6   -   0   4   -   0   8   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       R   e   f   a   c   t   o   r   e   d       `   B   a   c   k   p   a   c   k   H   e   l   p   e   r   `   '   s       F   a   v   o   u   r   i   t   e       D   r   i   n   k   s       l   o   g   i   c       t   o       b   u   i   l   d       a       s   i   n   g   l   e       D   O   M       n   o   d   e       m   a   p       i   n   s   t   e   a   d       o   f       r   e   l   y   i   n   g       o   n       r   e   c   u   r   s   i   v   e       q   u   e   r   y       l   o   o   p   s   .       T   h   i   s       s   e   v   e   r   e   l   y       l   i   m   i   t   s       b   r   o   w   s   e   r       m   e   m   o   r   y       u   s   a   g   e       a   n   d       p   r   e   v   e   n   t   s       l   a   g   /   s   t   u   t   t   e   r   s       o   n       a   c   c   o   u   n   t   s       w   i   t   h       m   a   s   s   i   v   e       i   n   v   e   n   t   o   r   i   e   s   .   
 
   
 
   
 
   
 
   #   #       [   8   .   0   1   ]       -       2   0   2   6   -   0   4   -   0   8   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       "   F   a   v   o   u   r   i   t   e       D   r   i   n   k   s   "       s   e   c   t   i   o   n       t   h   a   t       a   u   t   o   m   a   t   i   c   a   l   l   y       d   i   s   p   l   a   y   s       y   o   u   r       t   o   p       5       c   o   n   s   u   m   e   d       d   r   i   n   k   s       i   n       t   h   e       b   a   c   k   p   a   c   k       a   n   d       l   i   v   i   n   g       a   r   e   a       m   o   d   e   s   ,       i   n   c   r   e   a   s   i   n   g       i   m   a   g   e       s   i   z   e   s       f   o   r       q   u   i   c   k       t   a   p   p   i   n   g   .   
 
   
 
   -       D   r   i   n   k       c   o   n   s   u   m   p   t   i   o   n       i   s       n   o   w       s   u   c   c   e   s   s   f   u   l   l   y       t   r   a   c   k   e   d       a   u   t   o   m   a   t   i   c   a   l   l   y       w   h   e   n       d   r   a   n   k       d   i   r   e   c   t   l   y       f   r   o   m       b   a   c   k   p   a   c   k   /   l   i   v   i   n   g       a   r   e   a       l   o   c   a   t   i   o   n   s   .   
 
   
 
   m   -       I   n   c   l   u   d   e   d       a   n       i   n   t   e   r   a   c   t   i   v   e       "   V   i   e   w       S   t   a   t   s   "       t   a   b   l   e       m   o   d   a   l       s   h   o   w   i   n   g       l   i   f   e   t   i   m   e       c   o   n   s   u   m   p   t   i   o   n       s   t   a   t   s   ,       f   u   l   l   y       p   o   p   u   l   a   t   e   d       w   i   t   h       i   m   a   g   e   s       a   n   d       s   o   r   t   e   d       h   i   g   h   e   s   t       t   o       l   o   w   e   s   t   .       A   l   s   o       f   e   a   t   u   r   e   s       a       h   a   n   d   y       R   e   s   e   t       b   u   t   t   o   n   .   
 
   
 
   
 
   
 
   #   #       [   8   .   0   0   ]       -       2   0   2   6   -   0   4   -   0   8   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       "   S   w   i   p   e   a   b   l   e       T   o   p   b   a   r       M   e   n   u   "       f   e   a   t   u   r   e       t   o       `   D   i   s   p   l   a   y   H   e   l   p   e   r   `       t   h   a   t       a   u   t   o   m   a   t   i   c   a   l   l   y       m   a   k   e   s       t   h   e       n   a   t   i   v   e   l   y       w   i   d   e       t   o   p   b   a   r       m   e   n   u       (   D   i   r   t       R   o   a   d   ,       R   e   c   y   c   l   i   n   g       B   i   n   ,       e   t   c   .   )       h   o   r   i   z   o   n   t   a   l   l   y       s   c   r   o   l   l   a   b   l   e       (   s   w   i   p   e   a   b   l   e   )       o   n       m   o   b   i   l   e       d   e   v   i   c   e   s       t   o       p   r   e   v   e   n   t       i   t       f   r   o   m       c   l   i   p   p   i   n   g       o   f   f   -   s   c   r   e   e   n   .       C   a   n       b   e       d   i   s   a   b   l   e   d       v   i   a       s   e   t   t   i   n   g   s   .   
 
   
 
   -       D   e   s   k   t   o   p       u   s   e   r   s       a   l   s   o       g   a   i   n       a   n       i   n   v   i   s   i   b   l   e       d   r   a   g   -   t   o   -   s   c   r   o   l   l       i   n   t   e   r   a   c   t   i   v   i   t   y       a   c   r   o   s   s       t   h   e       t   o   p   b   a   r       m   e   n   u       f   o   r       t   e   s   t   i   n   g       a   n   d       a   c   c   e   s   s   i   b   i   l   i   t   y   .   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       I   m   p   r   o   v   e   d       t   h   e       s   t   y   l   i   n   g       o   f       "   R   a   c   e   "       a   n   d       "   P   i   k   i   e   s   "       a   c   t   i   o   n       b   u   t   t   o   n   s       i   n       t   h   e       N   o   r   t   h   e   r   n       F   e   n   c   e       r   a   c   i   n   g       p   a   g   e       f   o   r       a       c   l   e   a   n   e   r       l   a   y   o   u   t   .   
 
   
 
   
 
   
 
   #   #       [   7   .   9   9   ]       -       2   0   2   6   -   0   4   -   0   8   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       I   m   p   r   o   v   e   d       l   a   y   o   u   t       a   n   d       s   t   y   l   i   n   g       o   f       "   G   i   v   e       a       L   o   a   n   "       a   n   d       "   C   l   e   a   r       a       L   o   a   n   "       f   o   r   m   s       i   n       t   h   e       G   a   n   g       L   o   a   n   s       h   e   l   p   e   r   .   
 
   
 
   
 
   
 
   #   #       [   7   .   9   8   ]       -       2   0   2   6   -   0   4   -   0   8   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       "   R   e   m   o   v   e   "       b   u   t   t   o   n       t   o       t   h   e       `   M   e   s   s   a   g   e   B   o   a   r   d   H   e   l   p   e   r   `       "   A   d   d       P   a   y   m   e   n   t   "       p   a   n   e   l       t   o       c   l   e   a   n   l   y       d   e   l   e   t   e       p   r   e   v   i   o   u   s   l   y       s   a   v   e   d       p   a   y   m   e   n   t   s   .   
 
   
 
   -       A   d   d   e   d       a       "   C   a   n   c   e   l   "       b   u   t   t   o   n       t   o       e   a   s   i   l   y       d   i   s   m   i   s   s       t   h   e       "   A   d   d       P   a   y   m   e   n   t   "       p   a   n   e   l       w   i   t   h   o   u   t       s   a   v   i   n   g       c   h   a   n   g   e   s   .   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       T   h   e       `   M   e   s   s   a   g   e   B   o   a   r   d   H   e   l   p   e   r   `       "   A   d   d       P   a   y   m   e   n   t   "       l   o   g   i   c       h   a   s       b   e   e   n       r   e   f   a   c   t   o   r   e   d       t   o       a   c   t       a   s       a   n       u   p   d   a   t   e       f   o   r       e   x   i   s   t   i   n   g       p   a   y   m   e   n   t   s       i   n   s   t   e   a   d       o   f       c   r   e   a   t   i   n   g       d   u   p   l   i   c   a   t   e       r   e   c   o   r   d   s   .       T   h   e       s   u   b   m   i   t       b   u   t   t   o   n       n   o   w       d   y   n   a   m   i   c   a   l   l   y       d   i   s   p   l   a   y   s       "   U   p   d   a   t   e   "       o   r       "   S   a   v   e   "       b   a   s   e   d       o   n       t   h   e       p   a   y   m   e   n   t   '   s       s   a   v   e   d       s   t   a   t   u   s   .   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       F   i   x   e   d       a   n       i   s   s   u   e       w   h   e   r   e       s   a   v   i   n   g       a   n       a   l   r   e   a   d   y       t   r   a   c   k   e   d       p   o   s   t       p   a   y   m   e   n   t       w   o   u   l   d       e   n   d   l   e   s   s   l   y       d   u   p   l   i   c   a   t   e       t   h   e       r   o   w       w   i   t   h   i   n       t   h   e       `   G   a   n   g   L   o   a   n   s   H   e   l   p   e   r   `       d   a   s   h   b   o   a   r   d       i   n   s   t   e   a   d       o   f       r   e   p   l   a   c   i   n   g       t   h   e       o   l   d       r   e   c   o   r   d   .   
 
   
 
   
 
   
 
   #   #       [   7   .   9   7   ]       -       2   0   2   6   -   0   4   -   0   8   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       "   B   a   n   k       A   c   c   o   u   n   t   "       d   r   o   p   d   o   w   n       t   o       t   h   e       `   G   a   n   g   L   o   a   n   s   H   e   l   p   e   r   `       d   a   s   h   b   o   a   r   d   ,       a   l   l   o   w   i   n   g       o   p   e   r   a   t   o   r   s       t   o       s   e   l   e   c   t       a   n   d       s   a   v   e       t   h   e       a   p   p   l   i   c   a   b   l   e       b   a   n   k       a   c   c   o   u   n   t       p   e   r       t   o   p   i   c   .       T   h   i   s       s   e   c   u   r   e   l   y       s   y   n   c   s       n   a   t   i   v   e   l   y       w   i   t   h       t   h   e       s   i   t   e   '   s       d   e   f   a   u   l   t       i   n   p   u   t       f   o   r   m   s   .   
 
   
 
   -       A   d   d   e   d       a   n       i   n   l   i   n   e       d   y   n   a   m   i   c       "   T   o   t   a   l   "       a   m   o   u   n   t       r   e   a   d   o   u   t       n   e   x   t       t   o       t   h   e       B   a   n   k       A   c   c   o   u   n   t       s   e   l   e   c   t   o   r       i   n       e   v   e   r   y       t   o   p   i   c       p   a   n   e   l       t   o       c   o   n   t   i   n   u   o   u   s   l   y       d   i   s   p   l   a   y       t   h   e       p   r   e   c   i   s   e       s   u   m       o   f       a   l   l       i   n   d   i   v   i   d   u   a   l       p   a   y   m   e   n   t   s       a   n   d       c   a   l   c   u   l   a   t   e   d       b   u   l   k       r   e   p   l   i   e   r   s   .   
 
   
 
   
 
   
 
   #   #       [   7   .   9   6   ]       -       2   0   2   6   -   0   4   -   0   7   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       *   *   L   a   r   g   e   r       V   o   t   e       B   u   t   t   o   n   s       (   M   e   s   s   a   g   e       B   o   a   r   d   )   :   *   *       T   h   e       t   i   n   y       U   p   /   D   o   w   n       v   o   t   e       l   i   n   k   s       o   n       m   e   s   s   a   g   e       b   o   a   r   d       p   o   s   t   s       a   r   e       n   o   w       c   o   n   v   e   r   t   e   d       i   n   t   o       l   a   r   g   e   r   ,       e   a   s   y   -   t   o   -   c   l   i   c   k       b   u   t   t   o   n   s   .       T   h   i   s       f   e   a   t   u   r   e       c   a   n       b   e       t   o   g   g   l   e   d       v   i   a       s   e   t   t   i   n   g   s   .   
 
   
 
   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       *   *   M   e   s   s   a   g   e       B   o   a   r   d       V   o   t   e       T   o   o   l   t   i   p   s   :   *   *       F   i   x   e   d       a       n   a   t   i   v   e       g   a   m   e       b   u   g       w   h   e   r   e       t   h   e       d   e   t   a   i   l   e   d       v   o   t   e       c   o   u   n   t       t   o   o   l   t   i   p       (   "   L   o   a   d   i   n   g   .   .   .   "   ,       f   o   l   l   o   w   e   d       b   y       p   e   r   c   e   n   t   a   g   e       b   r   e   a   k   d   o   w   n   )       w   o   u   l   d       p   e   r   m   a   n   e   n   t   l   y       b   r   e   a   k       a   f   t   e   r       c   a   s   t   i   n   g       a       v   o   t   e       w   i   t   h   o   u   t       a       p   a   g   e       r   e   f   r   e   s   h   .   
 
   
 
   
 
   
 
   #   #       [   7   .   9   5   ]       -       2   0   2   6   -   0   4   -   0   6   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       *   *   P   e   r   f   o   r   m   a   n   c   e       R   e   f   a   c   t   o   r   :   *   *       S   e   p   a   r   a   t   e   d       h   e   l   p   e   r       s   c   r   i   p   t   s       i   n   t   o       G   l   o   b   a   l       a   n   d       P   a   g   e   -   s   p   e   c   i   f   i   c       m   o   d   u   l   e   s       t   o       p   r   e   v   e   n   t       D   O   M       v   i   s   u   a   l       j   o   l   t   s       o   n       u   n   r   e   l   a   t   e   d       p   a   g   e   s   .   
 
   
 
   -       *   *   P   a   g   e       R   o   u   t   i   n   g   :   *   *       H   e   l   p   e   r   s       n   o   w       c   o   n   d   i   t   i   o   n   a   l   l   y       l   o   a   d       s   t   r   i   c   t   l   y       o   n       t   h   e       p   a   g   e   s       t   h   e   y       a   f   f   e   c   t       v   i   a       d   e   c   l   a   r   a   t   i   v   e       U   R   L       r   o   u   t   i   n   g   .   
 
   
 
   -       R   e   n   a   m   e   d       B   e   r   n   a   r   d   s       M   a   n   s   i   o   n       H   e   l   p   e   r       t   o       B   e   r   n   a   r   d   s       B   a   s   e   m   e   n   t       H   e   l   p   e   r       t   o       a   c   c   u   r   a   t   e   l   y       r   e   f   l   e   c   t       l   o   c   a   t   i   o   n       e   n   d   p   o   i   n   t   s   .   
 
   
 
   
 
   
 
   #   #       [   7   .   9   4   ]       -       2   0   2   6   -   0   4   -   0   6   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       t   h   e       `   W   e   a   p   o   n   s   H   e   l   p   e   r   `       m   o   d   u   l   e       f   o   r       t   h   e       W   e   a   p   o   n   s       p   a   g   e       (   `   c   m   d   =   w   e   p   `   )   .   
 
   
 
   -       *   *   H   i   g   h   l   i   g   h   t       E   q   u   i   p   p   e   d       I   t   e   m   s   *   *   :       A   u   t   o   m   a   t   i   c   a   l   l   y       h   i   g   h   l   i   g   h   t   s       t   h   e       c   o   n   t   a   i   n   e   r       o   f       w   e   a   p   o   n   s   ,       a   r   m   o   r   ,       a   n   d       r   i   n   g   s       y   o   u       c   u   r   r   e   n   t   l   y       h   a   v   e       e   q   u   i   p   p   e   d   .   
 
   
 
   -       *   *   Q   u   i   c   k       E   q   u   i   p   /   U   n   e   q   u   i   p   *   *   :       I   t   e   m       i   m   a   g   e   s       a   r   e       n   o   w       h   y   p   e   r   l   i   n   k   e   d       t   o       a   c   t       a   s       q   u   i   c   k       t   o   g   g   l   e       b   u   t   t   o   n   s       t   o       e   q   u   i   p       o   r       u   n   e   q   u   i   p       t   h   a   t       s   p   e   c   i   f   i   c       i   t   e   m   .   
 
   
 
   
 
   
 
   #   #       [   7   .   9   3   ]       -       2   0   2   6   -   0   4   -   0   6   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       R   e   n   a   m   e   d       L   i   v   i   n   g       A   r   e   a       H   e   l   p   e   r       s   e   t   t   i   n   g       "   W   i   d   e       L   a   y   :       S   h   o   w       3       C   o   l   u   m   n   s   "       t   o       "   A   l   w   a   y   s       S   h   o   w       M   o   r   e       I   n   f   o   "   .   
 
   
 
   -       A   d   d   e   d       c   l   e   a   r   e   r       r   e   q   u   i   r   e   m   e   n   t       t   e   x   t       t   o       S   e   t   t   i   n   g   s       H   e   l   p   e   r       f   o   r       t   h   e       "   A   l   w   a   y   s       S   h   o   w       M   o   r   e       I   n   f   o   "       f   e   a   t   u   r   e   .   
 
   
 
   
 
   
 
   #   #       [   7   .   9   2   ]       -       2   0   2   6   -   0   4   -   0   6   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       "   C   o   p   y       S   t   a   t   s   "       b   u   t   t   o   n       t   o       t   h   e       `   L   i   v   i   n   g   A   r   e   a   H   e   l   p   e   r   `       c   o   m   b   a   t       s   t   a   t   s       b   o   x       t   o       i   n   s   t   a   n   t   l   y       c   o   p   y       t   h   e       d   i   s   p   l   a   y   e   d       b   a   t   t   l   e       s   t   a   t   s       +       t   o   t   a   l   s       d   i   r   e   c   t   l   y       t   o       t   h   e       c   l   i   p   b   o   a   r   d   .   
 
   
 
   -       A   d   d   e   d       a       "   W   i   d   e       L   a   y   :       S   h   o   w       3       C   o   l   u   m   n   s   "       o   p   t   i   o   n       i   n       `   L   i   v   i   n   g   A   r   e   a   H   e   l   p   e   r   `       w   h   i   c   h       f   o   r   c   e   s       t   h   e       L   i   v   i   n   g       A   r   e   a       l   a   y   o   u   t       t   o       r   e   v   e   a   l       a   l   l       c   o   l   u   m   n   s       n   a   t   i   v   e   l   y       w   h   e   n       `   D   i   s   p   l   a   y   H   e   l   p   e   r   `       "   W   i   d   e   n       C   o   n   t   e   n   t       A   r   e   a   "       i   s       a   c   t   i   v   e       (   >   =       8   5   0   p   x   )   ,       b   y   p   a   s   s   i   n   g       t   h   e       t   o   g   g   l   e       b   u   t   t   o   n   s       e   n   t   i   r   e   l   y   .   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       E   n   f   o   r   c   e   d       s   t   r   i   c   t       s   p   a   c   i   n   g       l   o   g   i   c       o   n       `   L   i   v   i   n   g   A   r   e   a   H   e   l   p   e   r   `       w   i   d   e       l   a   y   o   u   t       i   m   p   l   e   m   e   n   t   a   t   i   o   n       u   s   i   n   g       d   y   n   a   m   i   c       c   a   l   c       g   r   i   d   s       a   n   d       s   p   e   c   i   f   i   c       C   S   S       w   h   i   t   e   s   p   a   c   e       o   v   e   r   r   i   d   e   s   ,       p   r   e   v   e   n   t   i   n   g       u   n   e   x   p   e   c   t   e   d       b   o   x       l   i   n   e       w   r   a   p   p   i   n   g   .   
 
   
 
   
 
   
 
   #   #       [   7   .   9   1   ]       -       2   0   2   6   -   0   4   -   0   6   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a   n       "   A   w   a   k   e       F   u   l   l       N   o   t   i   f   i   c   a   t   i   o   n   "       f   e   a   t   u   r   e       t   o       `   D   i   s   p   l   a   y   H   e   l   p   e   r   `       w   h   i   c   h       a   u   t   o   m   a   t   i   c   a   l   l   y       t   r   a   c   k   s       o   f   f   l   i   n   e       a   w   a   k   e   n   e   s   s       r   e   g   e   n   e   r   a   t   i   o   n       a   n   d       d   i   s   p   a   t   c   h   e   s       a       d   e   s   k   t   o   p       T   a   m   p   e   r   m   o   n   k   e   y       n   o   t   i   f   i   c   a   t   i   o   n       w   h   e   n       m   a   x       a   w   a   k   e   n   e   s   s       i   s       r   e   a   c   h   e   d       a   f   t   e   r       a       c   o   n   f   i   g   u   r   a   b   l   e       p   e   r   i   o   d       o   f       i   n   a   c   t   i   v   i   t   y   .       D   i   s   a   b   l   e   d       b   y       d   e   f   a   u   l   t   .   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       F   i   x   e   d       a   n       i   s   s   u   e       i   n       `   S   e   t   t   i   n   g   s   H   e   l   p   e   r   `       w   h   e   r   e       s   u   b   -   f   e   a   t   u   r   e   s       s   t   r   u   c   t   u   r   e   d       w   i   t   h       a       f   a   l   s   e       d   e   f   a   u   l   t       v   a   l   u   e       w   e   r   e       i   n   c   o   r   r   e   c   t   l   y       d   e   f   a   u   l   t   i   n   g       t   o       c   h   e   c   k   e   d       u   p   o   n       f   i   r   s   t       i   n   i   t   i   a   l   i   z   a   t   i   o   n   .   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       E   n   h   a   n   c   e   d       t   h   e       `   L   i   v   i   n   g   A   r   e   a   H   e   l   p   e   r   `       "   W   i   n       P   e   r   c   e   n   t   a   g   e       C   a   l   c   "       t   o       c   a   l   c   u   l   a   t   e       a   n   d       d   i   s   p   l   a   y       b   o   t   h       t   h   e       c   o   n   s   e   c   u   t   i   v   e       w   i   n   s       n   e   e   d   e   d       t   o       r   e   a   c   h       t   h   e       n   e   x   t       b   o   n   u   s       b   r   a   c   k   e   t   ,       a   n   d       t   h   e       c   o   n   s   e   c   u   t   i   v   e       l   o   s   s   e   s       a   l   l   o   w   e   d       b   e   f   o   r   e       d   r   o   p   p   i   n   g       a       b   r   a   c   k   e   t   .   
 
   
 
   -       S   m   o   o   t   h   e   d       o   u   t       t   h   e       m   i   l   e   s   t   o   n   e       t   h   r   e   s   h   o   l   d       c   u   r   v   e       i   n       t   h   e       "   W   i   n       P   e   r   c   e   n   t   a   g   e       C   a   l   c   "       u   s   i   n   g       a       d   y   n   a   m   i   c       1   0   -   9   9   %       b   r   a   c   k   e   t       s   y   s   t   e   m       f   o   r       m   o   r   e       r   e   a   l   i   s   t   i   c       a   n   d       m   a   n   a   g   e   a   b   l   e       s   h   o   r   t   -   t   e   r   m       g   o   a   l       t   r   a   c   k   i   n   g   .   
 
   
 
   
 
   
 
   #   #       [   7   .   9   0   ]       -       2   0   2   6   -   0   4   -   0   6   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       P   r   e   v   e   n   t   e   d       `   C   h   a   n   g   e   l   o   g   D   a   t   a   `       f   r   o   m       i   n   c   o   r   r   e   c   t   l   y       d   i   s   p   l   a   y   i   n   g       a   s       a   n       a   c   t   i   v   e       m   o   d   u   l   e       i   n       t   h   e       P   r   e   f   e   r   e   n   c   e   s       s   e   t   t   i   n   g   s       w   i   n   d   o   w   .   
 
   
 
   
 
   
 
   #   #       [   7   .   8   9   ]       -       2   0   2   6   -   0   4   -   0   6   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       t   h   e       `   G   a   n   g   H   e   l   p   e   r   `       m   o   d   u   l   e   ,       i   n   i   t   i   a   l   i   z   e   d       o   n       t   h   e       G   a   n   g       p   a   g   e       (   `   c   m   d   =   g   a   n   g   &   d   o   =   e   n   t   e   r   `   )   .   
 
   
 
   -       A   d   d   e   d       a       "   S   a   v   e       E   v   e   n   t       P   a   y   o   u   t   s   "       U   I       t   o       t   h   e       "   V   i   e   w       l   a   s   t       g   a   n   g       h   a   p   p   e   n   i   n   g       r   e   s   u   l   t   s   "       p   a   g   e       (   `   w   =   l   a   s   t   s   h   `   )       s   p   e   c   i   f   i   c   a   l   l   y       f   o   r       t   h   e       "   G   a   n   g   s   t   e   r   s       S   u   n   d   a   y       =       F   u   n   d   a   y   "       e   v   e   n   t       (   v   i   s   i   b   l   e       o   n   l   y       t   o       G   a   n   g       S   t   a   f   f   )   .       I   t       a   u   t   o   m   a   t   i   c   a   l   l   y       c   a   l   c   u   l   a   t   e   s       a   n   d       s   a   v   e   s       p   a   y   o   u   t   s       p   e   r       p   o   i   n   t       b   a   s   e   d       o   n       c   u   s   t   o   m       r   a   t   e       a   n   d       m   a   x       p   a   y   o   u   t       i   n   p   u   t   s   ,       p   u   s   h   i   n   g       t   h   e   m       d   i   r   e   c   t   l   y       t   o       t   h   e       `   G   a   n   g   L   o   a   n   s   H   e   l   p   e   r   `       d   a   s   h   b   o   a   r   d   .   
 
   
 
   
 
   
 
   #   #       [   7   .   8   8   ]       -       2   0   2   6   -   0   4   -   0   5   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       "   V   e   r   s   i   o   n       D   i   s   p   l   a   y   "       t   o       t   h   e       `   L   i   v   i   n   g   A   r   e   a   H   e   l   p   e   r   `       b   e   n   e   a   t   h       t   h   e       M   i   x   e   r       l   i   n   k       t   o       s   h   o   w       t   h   e       c   u   r   r   e   n   t       H   e   l   p   e   r       T   o   o   l       v   e   r   s   i   o   n   .   
 
   
 
   -       A   d   d   e   d       a   n       i   n   t   e   r   a   c   t   i   v   e       "   V   i   e   w       C   h   a   n   g   e   l   o   g   "       l   i   n   k       i   n       t   h   e       `   L   i   v   i   n   g   A   r   e   a   H   e   l   p   e   r   `       t   h   a   t       o   p   e   n   s       a       f   l   o   a   t   i   n   g       m   o   d   a   l       w   i   t   h       t   h   e       5       m   o   s   t       r   e   c   e   n   t       c   h   a   n   g   e   l   o   g       u   p   d   a   t   e   s       w   i   t   h   o   u   t       h   a   v   i   n   g       t   o       w   a   i   t       f   o   r       t   h   e       L   o   c   k   o   u   t       S   c   r   e   e   n   .       A   d   m   i   n   i   s   t   e   r   s       s   e   t   t   i   n   g   s       v   i   a       t   h   e       `   L   i   v   i   n   g   A   r   e   a   H   e   l   p   e   r   _   V   e   r   s   i   o   n   D   i   s   p   l   a   y   `       t   o   g   g   l   e   .   
 
   
 
   
 
   
 
   #   #       [   7   .   8   7   ]       -       2   0   2   6   -   0   4   -   0   5   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       U   p   d   a   t   e   d       t   h   e       `   L   i   v   i   n   g   A   r   e   a   H   e   l   p   e   r   `       "   U   p   d   a   t   e       R   a   t   i   o   "       b   u   t   t   o   n       t   o       d   i   s   p   l   a   y       "   U   p   d   a   t   e       G   o   a   l   s   "       a   n   d       c   o   n   f   i   g   u   r   e   d       i   t       t   o       a   u   t   o   m   a   t   i   c   a   l   l   y       c   o   l   l   a   p   s   e       t   h   e       i   n   p   u   t       w   i   n   d   o   w       w   h   e   n       s   e   t   t   i   n   g   s       a   r   e       s   a   v   e   d   .   
 
   
 
   
 
   
 
   #   #       [   7   .   8   6   ]       -       2   0   2   6   -   0   4   -   0   5   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a   n       "   E   n   a   b   l   e       t   h   e       F   a   k   e       Q   w   e   e   "       s   e   t   t   i   n   g       t   o       t   h   e       `   D   i   s   p   l   a   y   H   e   l   p   e   r   `       t   o       a   l   l   o   w       t   o   g   g   l   i   n   g       t   h   e       "   T   h   e       F   a   k   e   "       p   r   e   f   i   x       f   o   r       u   s   e   r       I   D       2   9   2   4   5   1   0   .   
 
   
 
   
 
   
 
   #   #       [   7   .   8   5   ]       -       2   0   2   6   -   0   4   -   0   5   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       `   R   a   t   s   H   e   l   p   e   r   `       f   o   r       t   h   e       R   a   t       p   a   g   e       (   `   c   m   d   =   r   a   t   s   `   )       t   h   a   t       i   n   c   l   u   d   e   s       a   n       i   n   t   e   r   a   c   t   i   v   e       "   R   a   t       N   e   w   s       F   i   l   t   e   r   "       u   s   i   n   g       c   h   e   c   k   b   o   x       p   i   l   l   s   .   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       R   e   f   a   c   t   o   r   e   d       `   S   e   t   t   i   n   g   s   H   e   l   p   e   r   `       a   r   c   h   i   t   e   c   t   u   r   e   :       a   l   l       m   o   d   u   l   e   s       n   o   w       e   x   p   o   r   t       t   h   e   i   r       o   w   n       s   e   t   t   i   n   g   s       c   o   n   f   i   g   u   r   a   t   i   o   n   s   ,       a   u   t   o   m   a   t   i   c   a   l   l   y       p   o   p   u   l   a   t   i   n   g       t   h   e       P   r   e   f   e   r   e   n   c   e   s       p   a   g   e       d   y   n   a   m   i   c   a   l   l   y   .   
 
   
 
   
 
   
 
   #   #       [   7   .   8   4   ]       -       2   0   2   6   -   0   4   -   0   5   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       U   p   d   a   t   e   d       t   h   e       "   E   x   p   o   r   t       S   a   v   e   d       R   e   p   l   i   e   r   s   "       b   u   t   t   o   n       t   o       o   u   t   p   u   t       g   r   a   n   u   l   a   r       l   i   n   e   -   b   y   -   l   i   n   e       p   a   y   m   e   n   t       d   e   t   a   i   l   s       f   o   r       e   a   c   h       i   n   d   i   v   i   d   u   a   l       r   e   c   i   p   i   e   n   t       i   n   s   t   e   a   d       o   f       a       s   i   n   g   l   e       t   o   t   a   l       s   u   m   m   a   r   y       s   t   r   i   n   g   .   
 
   
 
   
 
   
 
   #   #       [   7   .   8   3   ]       -       2   0   2   6   -   0   4   -   0   5   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a   n       "   E   x   p   o   r   t       T   o   t   a   l   s   "       b   u   t   t   o   n       t   o       t   h   e       `   G   a   n   g   L   o   a   n   s   H   e   l   p   e   r   `       t   o       a   u   t   o   m   a   t   i   c   a   l   l   y       s   u   m       u   p       a   l   l       p   r   o   c   e   s   s   e   d       c   a   s   h       v   a   l   u   e   s       f   r   o   m       b   o   t   h       i   n   d   i   v   i   d   u   a   l       a   c   t   i   o   n   s       a   n   d       b   u   l   k       r   e   p   l   i   e   r       l   i   s   t   s       i   n   t   o       a       s   i   n   g   l   e       c   l   i   p   b   o   a   r   d       s   t   r   i   n   g   .   
 
   
 
   -       I   m   p   l   e   m   e   n   t   e   d       d   e   p   e   n   d   e   n   t       v   a   l   i   d   a   t   i   o   n       s   t   a   t   e   s       f   o   r       `   G   a   n   g   L   o   a   n   s   H   e   l   p   e   r   `       e   x   p   o   r   t       b   u   t   t   o   n   s       t   o       e   x   p   l   i   c   i   t   l   y       d   i   s   a   b   l   e       i   n   t   e   r   a   c   t   i   o   n       u   n   t   i   l       m   i   s   s   i   n   g       d   y   n   a   m   i   c       e   l   e   m   e   n   t   s       (   s   u   c   h       a   s       t   h   e       b   u   l   k       a   m   o   u   n   t       m   a   p   p   i   n   g       f   i   e   l   d   )       a   r   e       e   n   t   e   r   e   d       b   y       o   p   e   r   a   t   o   r   s   .   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       R   e   -   f   o   r   m   a   t   t   e   d       t   h   e       e   x   p   o   r   t       t   e   x   t       t   e   m   p   l   a   t   e   s       i   n       t   h   e       `   G   a   n   g   L   o   a   n   s   H   e   l   p   e   r   `       t   o       u   t   i   l   i   z   e       a       c   e   n   t   r   a   l   i   z   e   d   ,       t   r   u   e       g   a   m   e   -   s   y   n   c   e   d       d   a   t   e   s   t   r   i   n   g       g   e   n   e   r   a   t   e   d       v   i   a       `   U   t   i   l   s   `   .   
 
   
 
   -       I   m   p   r   o   v   e   d       s   p   a   c   e       u   s   a   g   e       b   y       s   h   o   r   t   e   n   i   n   g       t   h   e       "   R   e   m   o   v   e       T   o   p   i   c   "       b   u   t   t   o   n       s   i   m   p   l   y       t   o       "   R   e   m   o   v   e   "       d   i   r   e   c   t   l   y       w   i   t   h   i   n       t   h   e       `   G   a   n   g   L   o   a   n   s   H   e   l   p   e   r   `       U   I   .   
 
   
 
   
 
   
 
   #   #       [   7   .   8   2   ]       -       2   0   2   6   -   0   4   -   0   5   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       M   o   d   i   f   i   e   d       t   h   e       `   M   e   s   s   a   g   e   B   o   a   r   d   H   e   l   p   e   r   `       d   o   l   l   a   r       m   a   t   c   h   i   n   g       l   o   g   i   c       t   o       i   t   e   r   a   t   i   v   e   l   y       e   x   t   r   a   c   t       a   n   d       m   a   p       t   h   e       f   i   n   a   l       t   r   a   i   l   i   n   g       d   o   l   l   a   r       v   o   l   u   m   e       i   n       i   n   s   t   a   n   c   e   s       w   h   e   r   e       t   e   x   t       s   t   r   i   n   g   s       l   i   s   t       m   u   l   t   i   p   l   i   e   r       e   q   u   a   t   i   o   n   s       p   r   i   o   r       t   o       a       t   o   t   a   l       s   u   m   m   a   t   i   o   n       f   o   r   m   a   t   .   
 
   
 
   
 
   
 
   #   #       [   7   .   8   1   ]       -       2   0   2   6   -   0   4   -   0   5   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       F   i   x   e   d       a   n       i   s   s   u   e       w   h   e   r   e       t   h   e       `   F   o   o   d   D   a   t   a   `       m   a   p   p   i   n   g       i   n   c   o   r   r   e   c   t   l   y       a   s   s   o   c   i   a   t   e   d       t   h   e       "   A   p   p   l   e       C   o   r   e   "       f   o   o   d       i   t   e   m       w   i   t   h       t   h   e       w   r   o   n   g       i   m   a   g   e       a   s   s   e   t       w   i   t   h   i   n       `   F   o   r   t   S   l   u   g   w   o   r   t   h   H   e   l   p   e   r   `       R   i   p   a   p   a   r   t   e   r   '   s       m   e   n   u   .   
 
   
 
   
 
   
 
   #   #       [   7   .   8   0   ]       -       2   0   2   6   -   0   4   -   0   5   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       `   F   o   r   t   S   l   u   g   w   o   r   t   h   H   e   l   p   e   r   `       w   i   t   h       f   u   n   c   t   i   o   n   a   l   i   t   y       f   o   r       T   h   e       R   i   p   a   p   a   r   t   e   r       (   `   r   o   o   m   =   4   `   )   .   
 
   
 
   -       I   n   t   r   o   d   u   c   e   d       a       t   i   l   e   -   b   a   s   e   d       U   I       r   e   p   l   a   c   e   m   e   n   t       t   o       T   h   e       R   i   p   a   p   a   r   t   e   r       f   o   r       s   e   l   e   c   t   i   n   g       t   r   o   l   l   e   y       f   o   o   d   s   ,       g   e   n   e   r   a   t   i   n   g       v   i   s   u   a   l       i   n   t   e   r   a   c   t   i   v   e       g   r   i   d   s       u   s   i   n   g       t   h   e       n   e   w   l   y       a   d   d   e   d       `   F   o   o   d   D   a   t   a   .   j   s   `       a   s   s   e   t       m   a   p   ,       v   a   s   t   l   y       i   m   p   r   o   v   i   n   g       s   o   r   t   i   n   g       a   n   d       s   p   e   e   d   .       I   n   c   l   u   d   e   s       d   y   n   a   m   i   c       i   m   a   g   e       d   e   t   e   c   t   i   o   n       p   a   r   s   i   n   g       n   a   m   e   s       m   a   p   p   e   d       t   o       w   i   k   i       r   e   c   o   r   d   s   .   
 
   
 
   
 
   
 
   #   #       [   7   .   7   9   ]       -       2   0   2   6   -   0   4   -   0   5   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       T   h   e       `   S   o   u   p   K   i   t   c   h   e   n   H   e   l   p   e   r   `       h   a   s       b   e   e   n       r   e   f   i   n   e   d       t   o       c   o   n   s   i   s   t   e   n   t   l   y       d   i   s   p   l   a   y       t   h   e       H   o   b   o       a   g   e       m   e   t   a   d   a   t   a       a   n   d       s   o   u   p       r   e   w   a   r   d   s       t   a   b   l   e       i   n   d   e   p   e   n   d   e   n   t   l   y       o   f       s   p   e   c   i   f   i   c       U   R   L       q   u   e   r   y       p   a   r   a   m   e   t   e   r   s   .   
 
   
 
   
 
   
 
   #   #       [   7   .   7   8   ]       -       2   0   2   6   -   0   4   -   0   5   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a   u   t   o   m   a   t   e   d       s   t   a   t   e       h   a   n   d   l   i   n   g       t   o       `   G   a   n   g   L   o   a   n   s   H   e   l   p   e   r   `       w   h   i   c   h       t   r   a   c   k   s       w   h   e   n       "   A   d   d   "       a   n   d       "   C   l   e   a   r   "       a   c   t   i   o   n   s       r   e   s   o   l   v   e       v   i   a       p   e   r   s   i   s   t   e   n   t       c   a   c   h   e       a   c   r   o   s   s       s   y   n   c   h   r   o   n   o   u   s       p   a   g   e       l   o   a   d   s   .   
 
   
 
   -       T   h   e       `   G   a   n   g   L   o   a   n   s   H   e   l   p   e   r   `       d   a   s   h   b   o   a   r   d       n   o   w       s   e   a   m   l   e   s   s   l   y       t   r   a   n   s   i   t   i   o   n   s       r   o   w   s       t   h   r   o   u   g   h       p   e   r   m   a   n   e   n   t       w   o   r   k   f   l   o   w       s   t   a   t   e   s       (   "   L   o   a   n       C   r   e   a   t   e   d   "   ,       "   L   o   a   n       C   l   e   a   r   e   d   "   )       a   f   t   e   r       c   o   n   f   i   r   m   i   n   g       s   y   s   t   e   m       r   e   s   p   o   n   s   e   s   .   
 
   
 
   -       A   d   d   e   d       a       n   a   t   i   v   e       "   S   e   l   e   c   t       L   o   a   n   "       s   h   o   r   t   c   u   t       b   u   t   t   o   n       o   n       "   L   o   a   n       C   r   e   a   t   e   d   "       i   t   e   m   s       w   h   i   c   h       i   n   s   t   a   n   t   l   y       p   a   r   s   e   s       t   h   e       e   x   i   s   t   i   n   g       H   T   M   L       D   O   M       a   n   d       f   o   r   m       e   l   e   m   e   n   t   s       t   o       p   r   e   p   a   r   e       a       s   p   e   c   i   f   i   c       l   o   a   n       I   D       f   o   r       i   m   m   e   d   i   a   t   e       c   l   e   a   r   i   n   g   .   
 
   
 
   
 
   
 
   #   #       [   7   .   7   7   ]       -       2   0   2   6   -   0   4   -   0   4   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       I   m   p   r   o   v   e   d       `   M   e   s   s   a   g   e   B   o   a   r   d   H   e   l   p   e   r   `       t   o   p   i   c       n   a   m   e       e   x   t   r   a   c   t   i   o   n       r   e   l   i   a   b   i   l   i   t   y       o   n       G   a   n   g       B   o   a   r   d       p   o   s   t   s   ,       f   i   x   i   n   g       b   u   g   s       t   h   a   t       p   r   e   v   e   n   t   e   d       t   h   e       S   a   v   e       R   e   p   l   i   e   r   s   /   A   d   d       P   a   y   m   e   n   t       b   u   t   t   o   n   s       f   r   o   m       a   p   p   e   a   r   i   n   g       c   o   r   r   e   c   t   l   y   .   
 
   
 
   
 
   
 
   #   #       [   7   .   7   6   ]       -       2   0   2   6   -   0   4   -   0   4   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       E   n   h   a   n   c   e   d       t   h   e       `   M   e   s   s   a   g   e   B   o   a   r   d   H   e   l   p   e   r   `       '   A   d   d       P   a   y   m   e   n   t   '       d   o   l   l   a   r       a   m   o   u   n   t       p   a   r   s   e   r       t   o       c   o   r   r   e   c   t   l   y       i   n   t   e   r   p   r   e   t       m   u   l   t   i   p   l   i   e   r       s   u   f   f   i   x   e   s       (   k   ,       m   ,       m   i   l   ,       m   i   l   l   ,       m   i   l   l   i   o   n   )       a   n   d       a   u   t   o   m   a   t   i   c   a   l   l   y       f   o   r   m   a   t       t   h   e       m   a   p   p   e   d       v   a   l   u   e       w   i   t   h       c   o   m   m   a   s       a   n   d       a       d   o   l   l   a   r       s   i   g   n   .   
 
   
 
   
 
   
 
   #   #       [   7   .   7   5   ]       -       2   0   2   6   -   0   4   -   0   4   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       A   d   j   u   s   t   e   d       t   h   e       p   a   d   d   i   n   g       o   f       t   h   e       `   S   e   t   t   i   n   g   s   H   e   l   p   e   r   `       c   a   r   d       b   o   x   e   s       a   n   d       g   l   o   b   a   l       t   o   g   g   l   e       c   o   n   t   a   i   n   e   r       f   o   r       a       t   i   g   h   t   e   r   ,       c   l   e   a   n   e   r       a   p   p   e   a   r   a   n   c   e   .   
 
   
 
   
 
   
 
   #   #       [   7   .   7   4   ]       -       2   0   2   6   -   0   4   -   0   4   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       O   v   e   r   h   a   u   l   e   d       t   h   e       `   S   e   t   t   i   n   g   s   H   e   l   p   e   r   `       G   a   m   e       P   r   e   f   e   r   e   n   c   e   s       p   a   g   e       l   a   y   o   u   t   ,       m   i   g   r   a   t   i   n   g       f   r   o   m       a       c   o   n   t   i   n   u   o   u   s       v   e   r   t   i   c   a   l       l   i   s   t       t   o       a       b   a   l   a   n   c   e   d       a   n   d       s   t   y   l   i   z   e   d       t   w   o   -   c   o   l   u   m   n       c   a   r   d       g   r   i   d       t   o       i   m   p   r   o   v   e       r   e   a   d   a   b   i   l   i   t   y       a   n   d       a   e   s   t   h   e   t   i   c   s   .   
 
   
 
   
 
   
 
   #   #       [   7   .   7   3   ]       -       2   0   2   6   -   0   4   -   0   4   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       "   E   n   a   b   l   e       I   m   p   r   o   v   e   d       A   v   a   t   a   r   s   "       s   u   b   -   f   e   a   t   u   r   e       t   o       `   D   i   s   p   l   a   y   H   e   l   p   e   r   `       t   o       a   p   p   l   y       c   u   s   t   o   m       C   S   S       s   h   a   p   i   n   g       a   n   d       s   t   y   l   i   n   g       t   o       a   v   a   t   a   r       i   m   a   g   e   s   ,       i   n   c   l   u   d   i   n   g       o   n   l   i   n   e       s   t   a   t   u   s       i   n   d   i   c   a   t   o   r   s   .       T   h   i   s       c   a   n       b   e       c   o   n   f   i   g   u   r   e   d       i   n       t   h   e       S   e   t   t   i   n   g   s       m   e   n   u   .   
 
   
 
   
 
   
 
   #   #       [   7   .   7   2   ]       -       2   0   2   6   -   0   4   -   0   4   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       t   h   e       `   S   o   u   p   K   i   t   c   h   e   n   H   e   l   p   e   r   `       m   o   d   u   l   e       t   o       d   i   s   p   l   a   y       t   h   e       c   u   r   r   e   n   t       t   r   a   c   k   e   d       a   g   e       o   f       y   o   u   r       H   o   b   o       i   n       d   a   y   s       a   n   d       p   r   e   s   e   n   t       a   n       i   n   f   o   r   m   a   t   i   o   n   a   l       w   i   k   i       t   a   b   l   e       s   h   o   w   i   n   g       w   h   i   c   h       s   o   u   p       i   t   e   m   s       c   o   r   r   e   s   p   o   n   d       t   o       e   a   c   h       a   g   e       r   a   n   g   e       w   h   e   n       v   i   s   i   t   i   n   g       t   h   e       s   o   u   p       l   i   n   e   .   
 
   
 
   
 
   
 
   #   #       [   7   .   7   1   ]       -       2   0   2   6   -   0   4   -   0   4   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       c   o   n   f   i   g   u   r   a   b   l   e       t   o   g   g   l   e       f   o   r       t   h   e       `   H   i   t   l   i   s   t   H   e   l   p   e   r   `   '   s       "   H   i   g   h   l   i   g   h   t       O   n   l   i   n   e       P   l   a   y   e   r   s   "       f   e   a   t   u   r   e       w   i   t   h   i   n       t   h   e       `   S   e   t   t   i   n   g   s   H   e   l   p   e   r   `       p   r   e   f   e   r   e   n   c   e   s       p   a   g   e   .   
 
   
 
   
 
   
 
   #   #       [   7   .   7   0   ]       -       2   0   2   6   -   0   4   -   0   4   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       t   h   e       `   H   i   t   l   i   s   t   H   e   l   p   e   r   `       m   o   d   u   l   e       t   o       p   r   o   v   i   d   e       u   s   a   b   i   l   i   t   y       i   m   p   r   o   v   e   m   e   n   t   s       t   o       t   h   e       P   e   r   s   o   n   a   l       H   i   t   l   i   s   t       p   a   g   e       (   `   c   m   d   =   b   a   t   t   l   e   &   d   o   =   p   h   l   i   s   t   `   )   .   
 
   
 
   -       F   o   r   m   a   t   t   e   d       P   e   r   s   o   n   a   l       H   i   t   l   i   s   t       e   l   e   m   e   n   t   s       t   o       a   u   t   o   m   a   t   i   c   a   l   l   y       m   a   p       a   n   d       h   i   g   h   l   i   g   h   t       a   n   y       c   u   r   r   e   n   t   l   y       o   n   l   i   n   e       o   p   p   o   n   e   n   t   s       w   i   t   h       a       l   i   g   h   t       g   r   e   e   n       r   o   w       b   a   c   k   g   r   o   u   n   d   ,       d   r   a   m   a   t   i   c   a   l   l   y       i   m   p   r   o   v   i   n   g       v   i   s   u   a   l       r   e   c   o   g   n   i   t   i   o   n       i   n   s   t   e   a   d       o   f       h   a   v   i   n   g       t   o       s   p   o   t       t   h   e       s   m   a   l   l       o   n   l   i   n   e       i   c   o   n   .   
 
   
 
   
 
   
 
   #   #       [   7   .   6   9   ]       -       2   0   2   6   -   0   4   -   0   4   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       t   h   e       `   G   a   n   g   L   o   a   n   s   H   e   l   p   e   r   `       m   o   d   u   l   e       w   h   i   c   h       i   n   t   r   o   d   u   c   e   s       a       r   o   b   u   s   t       t   r   a   c   k   i   n   g       d   a   s   h   b   o   a   r   d       t   o       t   h   e       G   a   n   g       L   o   a   n   s       p   a   g   e       s   p   e   c   i   f   i   c   a   l   l   y       f   o   r       b   u   l   k       p   o   s   t   -   p   a   y   m   e   n   t   s       a   n   d       r   e   p   l   i   e   r       w   o   r   k   f   l   o   w       a   d   m   i   n   i   s   t   r   a   t   i   o   n   .   
 
   
 
   -       F   o   r   m   a   t   t   e   d       `   E   x   p   o   r   t   `       f   e   a   t   u   r   e   s       a   t   t   a   c   h   e   d       t   o       t   r   a   c   k   e   d       t   o   p   i   c   s   ,       a   l   l   o   w   i   n   g       c   l   i   p   b   o   a   r   d       e   x   p   o   r   t       o   f       b   o   t   h       s   a   v   e   d       r   e   p   l   i   e   r   s       a   n   d       g   e   n   e   r   a   t   e   d       p   a   y   m   e   n   t       o   b   j   e   c   t   s       d   i   r   e   c   t   l   y       m   a   p   p   e   d       w   i   t   h       d   o   l   l   a   r       o   u   t   p   u   t   s   .       
 
   
 
   -       I   n   t   e   g   r   a   t   e   d       a       g   e   n   e   r   i   c       "   S   a   v   e   "       a   n   d       d   y   n   a   m   i   c       i   n   s   e   r   t   i   o   n       m   e   c   h   a   n   i   s   m       o   n   t   o       t   h   e       d   a   s   h   b   o   a   r   d   ,       a   u   t   o   m   a   t   i   c   a   l   l   y       f   i   l   l   i   n   g       o   u   t       t   h   e       s   i   t   e   '   s       d   e   f   a   u   l   t       i   n   p   u   t       f   o   r   m   s       f   r   o   m       t   r   a   c   k   e   d       p   a   y   m   e   n   t   s   .   
 
   
 
   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       T   h   e       "   A   d   d       P   a   y   m   e   n   t   "       a   n   d       "   S   a   v   e       R   e   p   l   i   e   r   s       L   i   s   t   "       b   u   t   t   o   n   s       t   h   a   t       a   p   p   e   a   r       o   v   e   r       G   a   n   g       M   e   s   s   a   g   e       B   o   a   r   d       p   o   s   t   s       a   r   e       n   o   w       i   n   h   e   r   e   n   t   l   y       r   e   s   t   r   i   c   t   e   d       t   o       u   s   e   r   s       p   o   s   e   s   s   i   n   g       G   a   n   g       S   t   a   f   f       s   t   a   t   u   s   .   
 
   
 
   -       R   e   m   o   v   e   d       t   h   e       o   b   s   o   l   e   t   e       "   S   a   v   e       R   e   p   l   i   e   r   s       L   i   s   t       B   u   t   t   o   n   "       o   p   t   i   o   n       f   r   o   m       H   o   b   o       H   e   l   p   e   r       s   e   t   t   i   n   g   s   .   
 
   
 
   
 
   
 
   #   #       [   7   .   6   8   ]       -       2   0   2   6   -   0   4   -   0   4   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a   n       "   A   d   d       P   a   y   m   e   n   t   "       b   u   t   t   o   n       t   o       i   n   d   i   v   i   d   u   a   l       r   e   p   l   i   e   s       w   i   t   h   i   n       G   a   n   g       M   e   s   s   a   g   e       B   o   a   r   d       p   o   s   t   s       l   o   c   a   l   l   y       t   r   a   c   k   i   n   g       c   u   s   t   o   m       t   r   a   n   s   a   c   t   i   o   n   s       l   i   n   k   e   d       t   o       s   p   e   c   i   f   i   c       t   o   p   i   c       r   e   s   p   o   n   s   e   s   .   
 
   
 
   -       T   h   e       b   u   t   t   o   n       o   p   e   n   s       a       f   l   o   a   t   i   n   g       p   a   n   e   l       p   r   e   -   p   o   p   u   l   a   t   e   d       w   i   t   h       t   h   e       r   e   p   l   i   e   r   '   s       H   o   b   o       N   a   m   e   ,       H   o   b   o       I   D   ,       a   n   d       a       s   u   g   g   e   s   t   e   d       a   m   o   u   n   t       s   e   c   u   r   e   l   y       p   a   r   s   e   d       f   r   o   m       t   h   e       p   o   s   t       t   e   x   t   ,       a   l   l   o   w   i   n   g       l   o   c   a   l       s   t   o   r   a   g   e       o   f       e   x   p   e   c   t   e   d       p   a   y   m   e   n   t   s   .   
 
   
 
   
 
   
 
   #   #       [   7   .   6   7   ]       -       2   0   2   6   -   0   4   -   0   4   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       F   i   x   e   d       a   n       i   s   s   u   e       w   h   e   r   e       `   L   o   c   k   o   u   t   H   e   l   p   e   r   `       f   a   i   l   e   d       t   o       d   i   s   p   l   a   y       t   h   e       c   h   a   n   g   e   l   o   g       b   e   c   a   u   s   e       i   t       w   a   s       i   n   c   o   r   r   e   c   t   l   y       r   e   f   e   r   e   n   c   i   n   g       t   h   e       `   C   h   a   n   g   e   l   o   g   D   a   t   a   `       m   o   d   u   l   e       s   t   r   u   c   t   u   r   e   .   
 
   
 
   
 
   
 
   #   #       [   7   .   6   6   ]       -       2   0   2   6   -   0   4   -   0   4   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       D   i   s   p   l   a   y       H   e   l   p   e   r   ,       w   i   t   h       i   n   i   t   i   a   l       d   i   s   p   l   a   y       t   w   e   a   k   s   .   
 
   
 
   
 
   
 
   #   #       [   7   .   6   5   ]       -       2   0   2   6   -   0   4   -   0   4   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       U   p   d   a   t   e   d       t   h   e       "   5       F   i   g   h   t   e   r   '   s       L   u   n   c   h   e   s   "       `   B   a   n   k   H   e   l   p   e   r   `       b   u   t   t   o   n       t   o       s   u   p   p   o   r   t       m   u   l   t   i   p   l   e       s   e   q   u   e   n   t   i   a   l       c   l   i   c   k   s   ,       a   l   l   o   w   i   n   g       w   i   t   h   d   r   a   w   a   l   s       i   n       m   u   l   t   i   p   l   e   s       o   f       5       l   u   n   c   h   e   s       a   t       a       t   i   m   e   ,       w   h   i   l   e       d   y   n   a   m   i   c   a   l   l   y       t   r   a   c   k   i   n   g       a   n   d       u   p   d   a   t   i   n   g       t   h   e       t   o   t   a   l       c   o   u   n   t       a   d   d   e   d       i   n       t   h   e       b   u   t   t   o   n   '   s       d   i   s   p   l   a   y       v   a   l   u   e   .   
 
   
 
   
 
   
 
   #   #       [   7   .   6   4   ]       -       2   0   2   6   -   0   4   -   0   4   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       "   5       F   i   g   h   t   e   r   '   s       L   u   n   c   h   e   s   "       w   i   t   h   d   r   a   w       g   o   a   l       t   o       t   h   e       `   B   a   n   k   H   e   l   p   e   r   `   ,       d   y   n   a   m   i   c       t   o       y   o   u   r       H   o   b   o       L   e   v   e   l   .   
 
   
 
   -       A   d   d   e   d       a       c   o   n   f   i   g   u   r   a   t   i   o   n       t   o   g   g   l   e       f   o   r       t   h   e       5       F   i   g   h   t   e   r   '   s       L   u   n   c   h   e   s       G   o   a   l       w   i   t   h   i   n       t   h   e       `   S   e   t   t   i   n   g   s   H   e   l   p   e   r   `   .   
 
   
 
   
 
   
 
   #   #       [   7   .   6   3   ]       -       2   0   2   6   -   0   4   -   0   4   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       U   p   d   a   t   e   d       t   h   e       s   u   c   c   e   s   s       m   e   s   s   a   g   e       t   e   x   t       o   n       t   h   e       `   F   o   o   d   H   e   l   p   e   r   `       b   u   t   t   o   n       t   o       s   a   y       "   â   S  &       U   p   d   a   t   e   d       C   r   a   p   !   "       f   o   r       b   e   t   t   e   r       c   l   a   r   i   t   y   .   
 
   
 
   
 
   
 
   #   #       [   7   .   6   2   ]       -       2   0   2   6   -   0   4   -   0   4   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       R   e   -   a   r   c   h   i   t   e   c   t   e   d       t   h   e       `   F   o   o   d   H   e   l   p   e   r   `       "   M   a   r   k       a   s       C   r   a   p   "       l   o   g   i   c   .       T   h   e       s   c   r   i   p   t       n   o   w       e   x   c   l   u   s   i   v   e   l   y       m   o   n   i   t   o   r   s       i   t   e   m   s       c   u   r   r   e   n   t   l   y       p   r   e   s   e   n   t       i   n       y   o   u   r       i   n   v   e   n   t   o   r   y       w   h   e   n       u   p   d   a   t   i   n   g       t   h   e       "   c   r   a   p   "       l   i   s   t   ,       e   n   s   u   r   i   n   g       o   f   f   -   s   c   r   e   e   n       p   r   e   v   i   o   u   s   l   y       m   a   r   k   e   d       "   c   r   a   p   "       f   o   o   d   s       a   r   e       s   a   f   e   l   y       p   r   e   s   e   r   v   e   d       r   a   t   h   e   r       t   h   a   n       b   e   i   n   g       a   u   t   o   m   a   t   i   c   a   l   l   y       w   i   p   e   d       o   u   t   .   
 
   
 
   
 
   
 
   #   #       [   7   .   6   1   ]       -       2   0   2   6   -   0   4   -   0   4   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       A   d   d   e   d       a       +   7   5   0       q   u   i   c   k       a   d   d       b   u   t   t   o   n       t   o       t   h   e       `   R   e   c   y   c   l   i   n   g   B   i   n   H   e   l   p   e   r   `   .   
 
   
 
   
 
   
 
   #   #       [   7   .   6   0   ]       -       2   0   2   6   -   0   4   -   0   4   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       F   i   x   e   d       a   n       i   s   s   u   e       i   n       `   L   i   v   i   n   g   A   r   e   a   H   e   l   p   e   r   `       w   h   e   r   e       `   S   t   a   t   R   a   t   i   o   T   r   a   c   k   e   r   `       w   o   u   l   d       c   r   a   s   h       a   n   d       f   a   i   l       t   o       d   i   s   p   l   a   y       i   f       a       u   s   e   r       h   a   d       g   a   i   n   e   d       p   r   e   c   i   s   e   l   y       0       s   t   a   t   s       t   h   a   t       d   a   y   ,       c   a   u   s   i   n   g       t   h   e       "   G   a   i   n   e   d       T   o   d   a   y   "       t   e   x   t       t   o       b   e       m   i   s   s   i   n   g       f   r   o   m       t   h   e       D   O   M   .   
 
   
 
   -       F   i   x   e   d       a       b   u   g       i   n       `   F   o   o   d   H   e   l   p   e   r   `       w   h   e   r   e       s   e   l   e   c   t   i   n   g       a   n       i   t   e   m       t   h   a   t       w   a   s       a   l   r   e   a   d   y       i   n       y   o   u   r       C   r   a   p       F   o   o   d   s       L   i   s   t       b   u   t       l   e   a   v   i   n   g       o   t   h   e   r   s       u   n   c   h   e   c   k   e   d       w   o   u   l   d       a   c   c   i   d   e   n   t   a   l   l   y       p   u   r   g   e       t   h   e       o   t   h   e   r   s       f   r   o   m       t   h   e       t   r   a   c   k   e   r   .       N   o   w       p   r   o   p   e   r   l   y       s   y   n   c   s       c   h   e   c   k   e   d   /   u   n   c   h   e   c   k   e   d       s   t   a   t   e       f   o   r       v   i   s   i   b   l   e       i   t   e   m   s       w   h   i   l   e       p   r   e   s   e   r   v   i   n   g       s   t   o   r   e   d       o   f   f   -   s   c   r   e   e   n       i   t   e   m   s   .   
 
   
 
   
 
   
 
   #   #       [   7   .   5   9   ]       -       2   0   2   6   -   0   4   -   0   4   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       A   d   d   r   e   s   s   e   d       b   u   g   s       a   c   r   o   s   s       `   L   i   v   i   n   g   A   r   e   a   H   e   l   p   e   r   `       a   n   d       `   F   o   o   d   H   e   l   p   e   r   `       w   h   i   c   h       c   a   u   s   e   d       h   e   l   p   e   r   s       t   o       i   n   c   o   r   r   e   c   t   l   y       r   e   l   y       o   n       a       n   o   n   -   e   x   i   s   t   e   n   t       `   c   m   d   =   l   i   v   i   n   g   _   a   r   e   a   `       U   R   L       p   a   r   a   m   e   t   e   r       p   a   r   a   m   e   t   e   r       r   e   s   u   l   t   i   n   g       i   n       U   I       e   l   e   m   e   n   t   s       f   r   e   q   u   e   n   t   l   y       f   a   i   l   i   n   g       t   o       l   o   a   d   .   
 
   
 
   
 
   
 
   #   #       [   7   .   5   8   ]       -       2   0   2   6   -   0   4   -   0   3   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       `   F   o   o   d   H   e   l   p   e   r   `       t   o       m   a   n   a   g   e       u   n   w   a   n   t   e   d       f   o   o   d       i   t   e   m   s   .   
 
   
 
   -       A   d   d   e   d       a       "   S   e   l   e   c   t       C   r   a   p   "       b   u   t   t   o   n       t   o       a   u   t   o   m   a   t   i   c   a   l   l   y       c   h   e   c   k       a   l   l       p   r   e   v   i   o   u   s   l   y       m   a   r   k   e   d       "   c   r   a   p   "       f   o   o   d   s   .   
 
   
 
   -       A   d   d   e   d       a       "   M   a   r   k       a   s       C   r   a   p   "       b   u   t   t   o   n       t   o       a   d   d       s   e   l   e   c   t   e   d       f   o   o   d   s       t   o       t   h   e       "   c   r   a   p   "       l   i   s   t   ,       s   a   v   i   n   g       t   h   e   m       f   o   r       f   u   t   u   r   e       s   w   e   e   p   s   .   
 
   
 
   -       I   n   t   e   g   r   a   t   e   d       t   h   e       n   e   w       `   F   o   o   d   H   e   l   p   e   r   `       i   n   t   o       b   o   t   h       t   h   e       m   a   i   n       F   o   o   d       p   a   g   e       (   `   c   m   d   =   f   o   o   d   `   )       a   n   d       w   i   t   h   i   n       t   h   e       L   i   v   i   n   g       A   r   e   a   .   
 
   
 
   -       A   d   d   e   d       a       "   C   r   a   p       F   o   o   d   s       L   i   s   t   "       s   e   c   t   i   o   n       i   n   s   i   d   e       t   h   e       G   a   m   e       P   r   e   f   e   r   e   n   c   e   s       "   H   e   l   p   e   r       S   e   t   t   i   n   g   s   "   ,       a   l   l   o   w   i   n   g       y   o   u       t   o       v   i   e   w       a   n   d       d   e   l   e   t   e       i   t   e   m   s       y   o   u   '   v   e       p   r   e   v   i   o   u   s   l   y       m   a   r   k   e   d   .   
 
   
 
   
 
   
 
   #   #       [   7   .   5   7   ]       -       2   0   2   6   -   0   4   -   0   3   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       c   u   s   t   o   m       s   e   t   t   i   n   g   s       c   o   n   f   i   g   u   r   a   t   i   o   n   s       f   o   r       M   e   s   s   a   g   e       B   o   a   r   d       f   e   a   t   u   r   e   s       (   `   M   e   s   s   a   g   e   B   o   a   r   d   H   e   l   p   e   r   _   C   t   r   l   E   n   t   e   r   `   )   .   
 
   
 
   -       A   d   d   e   d       a       `   ð   x     ¾       S   a   v   e       R   e   p   l   i   e   r   s       L   i   s   t   `       b   u   t   t   o   n       t   o       `   M   e   s   s   a   g   e   B   o   a   r   d   H   e   l   p   e   r   `       e   x   p   l   i   c   i   t   l   y       f   o   r       G   a   n   g       B   o   a   r   d       p   o   s   t   s       (   `   c   m   d   =   g   a   t   h   e   r   i   n   g   &   d   o   =   v   p   o   s   t   `   )   ,       s   e   c   u   r   e   l   y       e   x   t   r   a   c   t   i   n   g       a   n   d       e   x   p   o   r   t   i   n   g       a       u   n   i   q   u   e       t   i   m   e   s   t   a   m   p   e   d       l   i   s   t       o   f       u   s   e   r       n   a   m   e   s       a   n   d       I   D   s       r   e   p   l   y   i   n   g       t   o       t   h   e       a   c   t   i   v   e       t   o   p   i   c       l   o   c   a   l   l   y   .   
 
   
 
   -       E   s   t   a   b   l   i   s   h   e   d       f   o   u   n   d   a   t   i   o   n   s       f   o   r       `   L   o   c   k   o   u   t   H   e   l   p   e   r   `   ,       i   n   j   e   c   t   i   n   g       r   e   c   e   n   t       c   h   a   n   g   e   l   o   g       a   c   t   i   v   i   t   y       d   i   r   e   c   t   l   y       i   n   t   o       t   h   e       i   n   t   e   r   m   i   t   t   e   n   t       1   2   -   h   o   u   r       g   a   m   e       r   e   s   e   t       l   o   c   k   o   u   t       s   c   r   e   e   n   .   
 
   
 
   -       E   x   t   e   n   s   i   v   e   l   y       d   o   c   u   m   e   n   t   e   d       a   n   d       i   n   j   e   c   t   e   d       `   S   u   p   p   o   r   t   e   d       L   a   y   o   u   t   s   `       l   a   y   o   u   t       w   a   r   n   i   n   g   s       n   o   t   i   n   g       o   n   l   y       `   T   h   e       F   u   t   u   r   e   `       l   a   y   o   u   t       f   o   r   m   a   t       h   a   s       b   e   e   n       o   f   f   i   c   i   a   l   l   y       t   e   s   t   e   d       t   h   r   o   u   g   h   o   u   t       R   E   A   D   M   E   ,       I   N   T   R   O   ,       F   E   A   T   U   R   E   S   ,       a   n   d       i   n   t   e   r   n   a   l       A   G   E   N   T       r   e   f   e   r   e   n   c   e       f   i   l   e   s   .   
 
   
 
   -       A   p   p   e   n   d   e   d       c   o   n   c   r   e   t   e       r   u   l   e       c   o   m   p   l   i   a   n   c   e       r   e   f   e   r   e   n   c   e   s       d   i   r   e   c   t   l   y       i   n   t   o       `   A   G   E   N   T   S   .   m   d   `       e   x   p   l   i   c   i   t   l   y       b   a   n   n   i   n   g       a   u   t   o   m   a   t   e   d       M   a   c   r   o   s   /   R   e   f   r   e   s   h   e   r   s       i   m   p   l   e   m   e   n   t   a   t   i   o   n   .   
 
   
 
   
 
   
 
   #   #       [   7   .   5   6   ]       -       2   0   2   6   -   0   4   -   0   2   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       U   p   d   a   t   e   d       `   L   i   q   u   o   r   S   t   o   r   e   H   e   l   p   e   r   `       t   o       v   i   s   u   a   l   l   y       h   i   g   h   l   i   g   h   t       i   t   e   m   s       f   r   o   m       y   o   u   r       a   c   t   i   v   e       s   h   o   p   p   i   n   g       l   i   s   t       w   i   t   h       a       f   a   i   n   t       y   e   l   l   o   w       b   a   c   k   g   r   o   u   n   d       d   i   r   e   c   t   l   y       a   r   o   u   n   d       t   h   e       i   t   e   m   '   s       i   m   a   g   e       c   e   l   l   .   
 
   
 
   
 
   
 
   #   #       [   7   .   5   5   ]       -       2   0   2   6   -   0   4   -   0   2   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       C   r   e   a   t   e   d       `   B   a   c   k   p   a   c   k   H   e   l   p   e   r   `       t   o       d   y   n   a   m   i   c   a   l   l   y       d   i   s   p   l   a   y       s   t   a   n   d   a   r   d       a   n   d       m   i   x   e   d       d   r   i   n   k       d   e   t   a   i   l   s       (   B   a   s   e       S   t   a   t       G   a   i   n   s   ,       E   f   f   e   c   t   s   )       o   n       h   o   v   e   r       t   o   o   l   t   i   p   s       w   i   t   h   i   n       t   h   e       i   n   v   e   n   t   o   r   y   .   
 
   
 
   -       A   d   d   e   d       s   u   p   p   o   r   t       f   o   r       A   J   A   X   -   l   o   a   d   e   d       i   n   v   e   n   t   o   r   y       t   a   b   s       l   i   k   e       t   h   e       L   i   v   i   n   g       A   r   e   a       b   a   c   k   p   a   c   k   .   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       E   x   p   a   n   d   e   d       `   D   r   i   n   k   s   D   a   t   a   `       c   o   n   f   i   g   u   r   a   t   i   o   n       t   o       i   n   c   l   u   d   e       f   u   l   l       s   t   a   t   i   s   t   i   c   s       (   `   b   a   s   e   _   s   t   a   t   _   g   a   i   n   `   ,       `   e   f   f   e   c   t   `   )       f   o   r       i   t   e   m   s       u   s   i   n   g       s   c   r   a   p   e   d       d   a   t   a       f   r   o   m       t   h   e       H   o   b   o   W   a   r   s       w   i   k   i   .   
 
   
 
   -       C   o   m   b   i   n   e   d       a   n   d       u   p   d   a   t   e   d       d   o   c   u   m   e   n   t   a   t   i   o   n       o   u   t       o   f       v   a   r   i   o   u   s       i   n   t   e   r   n   a   l       f   i   l   e   s       d   i   r   e   c   t   l   y       i   n   t   o       `   R   E   A   D   M   E   .   m   d   `   .   
 
   
 
   
 
   
 
   #   #       [   7   .   5   4   ]       -       2   0   2   6   -   0   4   -   0   2   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       F   i   x   e   d       `   B   e   r   n   a   r   d   s   M   a   n   s   i   o   n   H   e   l   p   e   r   `       b   a   s   e   m   e   n   t       m   a   p       l   a   y   o   u   t       c   o   l   l   a   p   s   i   n   g       i   n   t   o       a       t   a   l   l       r   e   c   t   a   n   g   l   e       a   n   d       s   i   z   i   n   g       i   s   s   u   e   s       b   y       e   n   f   o   r   c   i   n   g       a       s   t   r   i   c   t       f   i   x   e   d       l   a   y   o   u   t       w   i   t   h       `   8   x   8   `       p   i   x   e   l       c   e   l   l   s   .   
 
   
 
   
 
   
 
   #   #       [   7   .   5   3   ]       -       2   0   2   6   -   0   4   -   0   2   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       A   d   j   u   s   t   e   d       t   h   e       p   o   s   i   t   i   o   n       o   f       t   h   e       `   R   e   c   y   c   l   i   n   g   B   i   n   H   e   l   p   e   r   `       r   a   p   i   d       a   d   d       b   u   t   t   o   n   s       t   o       a   p   p   e   a   r       b   e   f   o   r   e       t   h   e       "   R   e   c   y   c   l   e       e   m   !   "       b   u   t   t   o   n       i   n   s   t   e   a   d       o   f       a   f   t   e   r       i   t   .   
 
   
 
   
 
   
 
   #   #       [   7   .   5   2   ]       -       2   0   2   6   -   0   4   -   0   2   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       `   R   e   c   y   c   l   i   n   g   B   i   n   H   e   l   p   e   r   `       t   o       q   u   i   c   k   l   y       a   d   d       f   i   x   e   d       a   m   o   u   n   t   s       (   +   1   0   0   ,       +   2   0   0   ,       +   5   0   0   )       t   o       t   h   e       r   e   c   y   c   l   i   n   g       b   i   n       i   n   p   u   t   .   
 
   
 
   
 
   
 
   #   #       [   7   .   5   1   ]       -       2   0   2   6   -   0   4   -   0   2   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       C   r   e   a   t   e   d       `   C   a   n   D   e   p   o   H   e   l   p   e   r   `       t   o       c   a   l   c   u   l   a   t   e       a   n   d       d   i   s   p   l   a   y       t   h   e       t   o   t   a   l       v   a   l   u   e       o   f       c   o   l   l   e   c   t   e   d       c   a   n   s       a   t       t   h   e       C   a   n       D   e   p   o   .   
 
   
 
   -       E   x   t   r   a   c   t   e   d       a   n   d       g   e   n   e   r   a   l   i   z   e   d       H   T   M   L       t   e   m   p   l   a   t   e   s   .   
 
   
 
   #   #   #       F   i   x   e   d   
 
   
 
   -       F   i   x   e   d       a   n       i   s   s   u   e       i   n       `   B   e   r   n   a   r   d   s   M   a   n   s   i   o   n   H   e   l   p   e   r   `       w   h   e   r   e       i   n   s   e   r   t   i   n   g       t   h   e       b   a   s   e   m   e   n   t       m   a   p       w   o   u   l   d       h   o   r   i   z   o   n   t   a   l   l   y       s   h   i   f   t       t   h   e       d   i   r   e   c   t   i   o   n   a   l       n   a   v   i   g   a   t   i   o   n       l   i   n   k   s       u   p   o   n       p   a   g   e       l   o   a   d   .   
 
   
 
   
 
   
 
   #   #       [   7   .   5   0   ]       -       2   0   2   6   -   0   4   -   0   2   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       I   m   p   r   o   v   e   d       `   W   e   l   l   n   e   s   s   C   l   i   n   i   c   H   e   l   p   e   r   `       b   y       c   h   a   n   g   i   n   g       t   h   e       l   a   b   e   l       "   T   o       F   i   n   i   s   h   "       t   o       "   C   u   m   u   l   a   t   i   v   e       S   p   e   n   d   "   .   
 
   
 
   -       A   d   d   e   d       a       v   i   s   u   a   l       h   o   v   e   r       e   f   f   e   c   t       o   n       "   C   u   m   u   l   a   t   i   v   e       S   p   e   n   d   "       c   e   l   l   s       (   t   u   r   n   i   n   g       l   i   g   h   t       b   l   u   e   )   .   
 
   
 
   -       C   l   i   c   k   i   n   g       a       c   e   l   l       i   n       t   h   e       "   C   u   m   u   l   a   t   i   v   e       S   p   e   n   d   "       c   o   l   u   m   n       n   o   w       v   i   s   u   a   l   l   y       s   e   l   e   c   t   s       i   t       (   d   a   r   k   e   r       b   l   u   e       b   o   l   d   )       a   n   d       a   u   t   o   m   a   t   i   c   a   l   l   y       s   e   t   s       i   t       a   s       a       B   a   n   k       W   i   t   h   d   r   a   w       G   o   a   l   .   
 
   
 
   -       A   d   d   e   d       a       v   i   s   u   a   l       h   e   l   p   e   r       h   i   n   t       i   n   d   i   c   a   t   i   n   g       t   h   a   t       c   l   i   c   k   i   n   g       t   h   e       "   C   u   m   u   l   a   t   i   v   e       S   p   e   n   d   "       s   e   t   s       t   h   e       B   a   n   k       W   i   t   h   d   r   a   w       G   o   a   l   .   
 
   
 
   
 
   
 
   #   #       [   7   .   4   9   ]       -       2   0   2   6   -   0   4   -   0   2   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       A   d   d   e   d       a       t   h   i   n       b   o   r   d   e   r       a   r   o   u   n   d       i   n   d   i   v   i   d   u   a   l       c   e   l   l   s       i   n       t   h   e       `   B   e   r   n   a   r   d   s   M   a   n   s   i   o   n   H   e   l   p   e   r   `       b   a   s   e   m   e   n   t       m   a   p       g   r   i   d       t   o       v   i   s   u   a   l   l   y       d   i   s   t   i   n   g   u   i   s   h       t   h   e       s   q   u   a   r   e   s   .   
 
   
 
   
 
   
 
   #   #       [   7   .   4   8   ]       -       2   0   2   6   -   0   4   -   0   2   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       A   u   t   o   m   a   t   i   c   a   l   l   y       c   l   e   a   r       o   u   t       o   l   d       b   u   i   l   d       f   i   l   e   s       d   u   r   i   n   g       c   o   m   p   i   l   a   t   i   o   n   ,       o   n   l   y       k   e   e   p   i   n   g       t   h   e       5       m   o   s   t       r   e   c   e   n   t       v   e   r   s   i   o   n   e   d       f   i   l   e   s       a   n   d       t   h   e       l   a   t   e   s   t       b   u   i   l   d   .   
 
   
 
   
 
   
 
   #   #       [   7   .   4   7   ]       -       2   0   2   6   -   0   4   -   0   2   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       R   e   m   o   v   e   d       l   o   c   a   l       s   t   o   r   a   g   e       h   i   s   t   o   r   y   /   e   x   p   l   o   r   e   d       s   t   a   t   e       f   u   n   c   t   i   o   n   a   l   i   t   y       f   r   o   m       `   B   e   r   n   a   r   d   s   M   a   n   s   i   o   n   H   e   l   p   e   r   `       b   a   s   e   m   e   n   t       m   a   p       s   i   n   c   e       a   l   l       s   q   u   a   r   e   s       a   r   e       n   a   v   i   g   a   b   l   e   .       R   e   m   o   v   e   d       r   e   s   e   t       m   a   p       b   u   t   t   o   n   .   
 
   
 
   
 
   
 
   #   #       [   7   .   4   6   ]       -       2   0   2   6   -   0   4   -   0   2   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       R   e   f   i   n   e   d       `   B   e   r   n   a   r   d   s   M   a   n   s   i   o   n   H   e   l   p   e   r   `       b   a   s   e   m   e   n   t       m   a   p       s   t   a   r   t   i   n   g       b   a   c   k   g   r   o   u   n   d       t   o       b   e       e   n   t   i   r   e   l   y       w   h   i   t   e       a   n   d       a   d   j   u   s   t   e   d       c   o   o   r   d   i   n   a   t   e       s   c   a   l   i   n   g       f   r   o   m       (   1   ,   1   )       u   p       t   o       (   2   0   ,   2   0   )   .   
 
   
 
   
 
   
 
   #   #       [   7   .   4   5   ]       -       2   0   2   6   -   0   4   -   0   2   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       R   e   d   e   s   i   g   n   e   d       `   B   e   r   n   a   r   d   s   M   a   n   s   i   o   n   H   e   l   p   e   r   `       b   a   s   e   m   e   n   t       m   a   p       t   o       l   o   o   k       l   i   k   e       t   h   e       R   e   d       L   i   g   h   t       D   i   s   t   r   i   c   t       m   a   p       a   n   d       s   t   a   r   t       c   o   o   r   d   i   n   a   t   e   s       f   r   o   m       0   ,   0       a   t       b   o   t   t   o   m       l   e   f   t   .   
 
   
 
   
 
   
 
   #   #       [   7   .   4   4   ]       -       2   0   2   6   -   0   4   -   0   2   
 
   
 
   #   #   #       C   h   a   n   g   e   d   
 
   
 
   -       I   m   p   r   o   v   e   d       `   B   e   r   n   a   r   d   s   M   a   n   s   i   o   n   H   e   l   p   e   r   `       t   o       i   n   j   e   c   t       a   n       i   n   t   e   r   a   c   t   i   v   e       b   a   s   e   m   e   n   t       m   a   p       n   e   x   t       t   o       t   h   e       d   i   r   e   c   t   i   o   n   a   l       p   a   d       a   r   r   o   w   s   .   
 
   
 
   
 
   
 
   #   #       [   7   .   4   3   ]       -       2   0   2   6   -   0   4   -   0   2   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       `   B   e   r   n   a   r   d   s   M   a   n   s   i   o   n   H   e   l   p   e   r   `       t   o       h   a   n   d   l   e       t   o   o   l   s       s   p   e   c   i   f   i   c   a   l   l   y       f   o   r       B   e   r   n   a   r   d   '   s       M   a   n   s   i   o   n       (   `   c   m   d   =   b   e   r   n   a   r   d   s   `   )   .   
 
   
 
   -       A   d   d   e   d       a       s   u   b   -   f   e   a   t   u   r   e       `   B   a   s   e   m   e   n   t       M   a   p   `       w   h   i   c   h       t   r   i   g   g   e   r   s       w   h   e   n       v   i   s   i   t   i   n   g       t   h   e       b   a   s   e   m   e   n   t       i   n       B   e   r   n   a   r   d   '   s       M   a   n   s   i   o   n       (   `   c   m   d   =   b   e   r   n   a   r   d   s   &   r   o   o   m   =   b   a   s   e   m   e   n   t   `   )   .       C   a   n       b   e       c   o   n   f   i   g   u   r   e   d       i   n       S   e   t   t   i   n   g   s   .   
 
   
 
   
 
   
 
   #   #       [   7   .   4   2   ]       -       2   0   2   6   -   0   4   -   0   2   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       A   d   d   e   d       a       s   e   t   t   i   n   g       t   o       d   i   s   a   b   l   e       t   h   e       M   i   x   e   r       L   i   n   k       i   n       t   h   e       L   i   v   i   n   g       A   r   e   a       h   e   l   p   e   r       (   a   c   c   e   s   s   i   b   l   e       v   i   a       t   h   e       S   e   t   t   i   n   g   s       H   e   l   p   e   r       t   o   g   g   l   e   )   .   
 
   
 
   
 
   
 
   #   #       [   7   .   4   1   ]       -       2   0   2   6   -   0   4   -   0   2   
 
   
 
   #   #   #       A   d   d   e   d   
 
   
 
   -       L   i   v   i   n   g       A   r   e   a       M   i   x   e   r       L   i   n   k       f   e   a   t   u   r   e       (   a   d   d   e   d       l   i   n   k       t   o       M   i   x   e   r       n   e   x   t       t   o       H   o   b   o       G   r   a   i   l   /   K   i   n   g   s       K   i   d   d   i   e       C   u   p   /   G   o   l   d   e   n       T   r   o   l   l   y   )   .   
 
   
 
   
 
 
