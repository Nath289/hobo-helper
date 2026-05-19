# User Changelog
This file tracks player-facing feature updates and bug fixes. The build script automatically parses this to generate the floating changelog UI in the game whenever the version number increments.

## [9.74] - 2026-05-20
- **Northern Fence:** Updated the Super-Cart Racing Skill Tracker so the "Active" racers count in the Racers Summary is now based on weekly gains instead of total gains.
- **Northern Fence:** Added a new configuration setting in your Preferences to customize the minimum weekly skill gain required for a racer to be considered "Active".

## [9.73] - 2026-05-19
- **Bank Goals:** Separated temporary bank goals from the Pikies (Permanent) bank goals to resolve an issue where session-specific goals were constantly overwriting and wiping cloud-synced device instances.
- **Message Board:** Fixed a bug in the new Signature Character Tracker where backslashes (`\`) and quotation marks (`'` or `"`) were under-calculated against the strict 1,500 limit.

## [9.72] - 2026-05-19
- **Added:** Added a real-time character counter to the Message Board Signature editor! Easily see exactly how many characters you have left, including accurate predictions of how special characters and formatting symbols eat into your cap limit.
- **Message Board:** Added a real-time character limit tracker underneath the Message Board Signature editor that perfectly mimics the game's exact underlying character restrictions, including emojis and line-break encoding bloat.

## [9.71] - 2026-05-19
- **Removed:** Removed the "max payout per hobo" feature from the GangStaff helper for the Sunday Funday tier settings.

## [9.70] - 2026-05-19
- Removed the custom title configuration for SeventhHeaven.

## [9.69] - 2026-05-19
- **Fixed:** Resolved display issues in "The Future" layout on mobile devices where the "Tokens" and "Cans" would indefinitely stretch off the screen instead of wrapping.
- **Fixed:** Fixed a bug on the Rats page where certain items (like the Pack of Candy Cigarettes) would break the consolidated visual feeding interface.

## [9.67] - 2026-05-18
- The internal 'Trade Stat Gain' metric provided at the Trading Post is now recorded directly into the Mining Log JSON structure and correctly overlays onto the daily visual log layout alignment.

## [9.66] - 2026-05-18
- Fixed an issue where the mining log would unnecessarily auto-clear/create entries for today before any stats were earned.
- Added a much easier tracking setup for saving up to race specific Pikies at the Northern Fence! Just click "Set Bank Goal" next to a Pikie.

## [9.65] - 2026-05-17
- Minor bug fix preventing unnecessary syncing and data thrashing for Rat's status graphs.

## [9.64] - 2026-05-17
- Fixed an issue where the Mines daily log was intermittently clearing its captured stats across page navigation.

## [9.63] - 2026-05-16
- Updated Northern Fence Helper to add a side-by-side list format to view signed up racers on the signup page natively by clicking a "Load Registered Racers" button, preventing game rule violation.

## [9.61] - 2026-05-16
- Added settings to the Preferences page allowing you to configure the Assumed EXP and Assumed Life per meal for your Rats. This gives you more accurate life span estimates based on your feeding habits!

## [9.60] - 2026-05-16
- **Fixed:** Resolved a large vertical gap appearing under the Swim Team image on computer screens by properly grouping the meals and refill lists together.

## [9.59] - 2026-05-15
- Fixed a critical layout bug affecting mobile phones where the Living Area layout restructure inadvertently squished your basic profile links (List Hobos Referred, Settings, Purchases Log, Chat) to the point of vanishing completely!

## [9.58] - 2026-05-15
- Added a new option to the preferences page to completely hide the "Invite Friends" text box from your Living Area.
- Fixed a long-standing janky visual bug where your Swim Team image could overlap the News section, and squish your referral links entirely out of existence on mobile devices.

## [9.57] - 2026-05-14
- Internal engine layout updates and AI framework tweaks for consistency.

## [9.56] - 2026-05-14
- Fixed formatting issues where mining multiple ores or hitting ores while at the mining exp cap wouldn't properly update the Mining Log.
- Fixed a bug where purchasing Dynamite Pouches or other equipment at the Mine Store would mistakenly appear in your Mining Log, and automatically cleaned up any incorrectly logged items.

## [9.55] - 2026-05-14
- Under-the-hood engine optimizations and security improvements.

## [9.54] - 2026-05-14
- Fixed an issue where the Rats 'Days to Live' graph would skew vastly out of mathematical proportion because it incorrectly interpreted raw rat life-points instead of 'days to live'. Your graph scale will automatically self-repair upon visiting the page!

## [9.53] - 2026-05-14
- Relocated the injected Hobo Helper version and sync metadata component inside the Living Area UI to properly align beneath tattoos and respect the new layout structure.

## [9.52] - 2026-05-13
- Fixed an issue where today's Mining Log header would temporarily disappear if you had not completed any stat-altering actions yet. It now properly stays visible, and only empty older days are secretly swept away at midnight.

## [9.51] - 2026-05-13
- Simplified the look of the Mining Stats panel inside the Living Area, making it cleaner and more consistent with standard text.

## [9.50] - 2026-05-13
- Added a `[latest]` link directly on the Message Board topic list for multi-page threads, letting you jump straight to the end of massive topics with a single click.

## [9.49] - 2026-05-13
- Fixed a bug where Mining Stats in your Living Area did not correctly respect the "Show More" visibility tracking toggle.

## [9.48] - 2026-05-13
- The extrapolated Rat Life progress bar in your Rats page is now clickable! Clicking it dynamically reveals a beautifully animated drop-down charting your rat's combat stats (`Speed`, `Attack`, `Defense`), `Level`, and complete `Life` decay cleanly tracked over time.

## [9.47] - 2026-05-12
- Expanded the new Mining Stats readout in your Living Area to explicitly show the exact absolute number of ores you have found and total mining experience you have gained today, independent of 'T used'.

## [9.46] - 2026-05-12
- Added a visual Swim Team Image block to the Living Area that floats beside your basic user links, helping keep your active information compact. Includes a fresh user preference toggle for you to enable or disable it freely!

## [9.45] - 2026-05-12
- Expanded the internal system architecture to gather your mining trade data continuously in the background, preserving accurate stat updates natively within your Living Area regardless of any interface format preferences.

## [9.44] - 2026-05-12
- Expanded the 'Mine Stats' readout on your Living Area page to natively pull and display your "Net Stat Gain" and "Stat Trades Today" data natively from caching layers within the Mining Interface. Data will automatically begin tracking once you interact with the Mine Trades window.

## [9.43] - 2026-05-12
- Dynamically rescaled the Living Area left stat column when both "Widen Page" and "Always Show More Info" are active to more evenly distribute white space.

## [9.42] - 2026-05-12
- Reorganized `MinesHelper` trading interface grids. Complementary stat ores are grouped together in a 3-column layout (Green/White/Yellow, Orange/Red/Purple) to reduce vertical space usage.

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.40] - 2026-05-12
- Added a **Fight Display Helper**. Multi-hobo log reading just got way easier; click [highlight] to auto-bold and tab over every row that you hit (or got hit) on!
- **Duplicate Safety Prevention**: The script will now loudly complain natively on the webpage via a blaring red UI banner if you accidentally leave multiple versions enabled at the same time in your extension! Keep your TamperMonkey clean, folks!

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.39] - 2026-05-11
### Fixed
- Fixed an issue in the Mines where the Mining Log would erroneously double-count ores and experience if you navigated using your browser's "Back" or "Forward" buttons.

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.40] - 2026-05-12
- Added a **Fight Display Helper**. Multi-hobo log reading just got way easier; click [highlight] to auto-bold and tab over every row that you hit (or got hit) on!
- **Duplicate Safety Prevention**: The script will now loudly complain natively on the webpage via a blaring red UI banner if you accidentally leave multiple versions enabled at the same time in your extension! Keep your TamperMonkey clean, folks!

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.38] - 2026-05-11
### Added
- Added an Explore Log feature to Bernard's Basement that tracks the valuable rare soups you discover (Garlic Salmon Bisque, Cream of Okra Soup, Texas Fajita Soup, Beef Mushroom Stew) and logs their XY coordinates so you can track findings across sessions!

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.40] - 2026-05-12
- Added a **Fight Display Helper**. Multi-hobo log reading just got way easier; click [highlight] to auto-bold and tab over every row that you hit (or got hit) on!
- **Duplicate Safety Prevention**: The script will now loudly complain natively on the webpage via a blaring red UI banner if you accidentally leave multiple versions enabled at the same time in your extension! Keep your TamperMonkey clean, folks!

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.37] - 2026-05-11
### Added
- Added a Developer Credits link to the Living Area panel above the Changelog.

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.40] - 2026-05-12
- Added a **Fight Display Helper**. Multi-hobo log reading just got way easier; click [highlight] to auto-bold and tab over every row that you hit (or got hit) on!
- **Duplicate Safety Prevention**: The script will now loudly complain natively on the webpage via a blaring red UI banner if you accidentally leave multiple versions enabled at the same time in your extension! Keep your TamperMonkey clean, folks!

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.36] - 2026-05-10
### Changed
- Under-the-hood engine optimizations and security improvements.

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.40] - 2026-05-12
- Added a **Fight Display Helper**. Multi-hobo log reading just got way easier; click [highlight] to auto-bold and tab over every row that you hit (or got hit) on!
- **Duplicate Safety Prevention**: The script will now loudly complain natively on the webpage via a blaring red UI banner if you accidentally leave multiple versions enabled at the same time in your extension! Keep your TamperMonkey clean, folks!

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.35] - 2026-05-10
### Added
- Added a toggle configuration option `NorthernFenceHelper_RestoreBanner` to conditionally restore or disable the classic custom Suicide Hill UI header graphic cleanly based on user preference.
### Fixed
- Fixed an issue causing duplicate page highlighting on specific subpages.

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.40] - 2026-05-12
- Added a **Fight Display Helper**. Multi-hobo log reading just got way easier; click [highlight] to auto-bold and tab over every row that you hit (or got hit) on!
- **Duplicate Safety Prevention**: The script will now loudly complain natively on the webpage via a blaring red UI banner if you accidentally leave multiple versions enabled at the same time in your extension! Keep your TamperMonkey clean, folks!

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.33] - 2026-05-10
### Fixed
- Fixed an issue where the Update Checker inside the Settings page would only point to the standard release script, downgrading installed Staff builds.
- Included explicit Build Type indicators alongside the version string on the settings page for easier debug reference.

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.40] - 2026-05-12
- Added a **Fight Display Helper**. Multi-hobo log reading just got way easier; click [highlight] to auto-bold and tab over every row that you hit (or got hit) on!
- **Duplicate Safety Prevention**: The script will now loudly complain natively on the webpage via a blaring red UI banner if you accidentally leave multiple versions enabled at the same time in your extension! Keep your TamperMonkey clean, folks!

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.32] - 2026-05-10
### Added
- Added an optional link to the Gang Hitlist at the end of the top bar menu (can be toggled in Preferences).

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.40] - 2026-05-12
- Added a **Fight Display Helper**. Multi-hobo log reading just got way easier; click [highlight] to auto-bold and tab over every row that you hit (or got hit) on!
- **Duplicate Safety Prevention**: The script will now loudly complain natively on the webpage via a blaring red UI banner if you accidentally leave multiple versions enabled at the same time in your extension! Keep your TamperMonkey clean, folks!

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.31] - 2026-05-10
### Changed
- Food Bank lists (Frozen and In Trolly) now display side-by-side if the page is widened (over 950px layout).

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.40] - 2026-05-12
- Added a **Fight Display Helper**. Multi-hobo log reading just got way easier; click [highlight] to auto-bold and tab over every row that you hit (or got hit) on!
- **Duplicate Safety Prevention**: The script will now loudly complain natively on the webpage via a blaring red UI banner if you accidentally leave multiple versions enabled at the same time in your extension! Keep your TamperMonkey clean, folks!

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.30] - 2026-05-10
### Added
- Added a "Race Again" button to the results page when racing an NPC Pikie in the Northern Fence.

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.40] - 2026-05-12
- Added a **Fight Display Helper**. Multi-hobo log reading just got way easier; click [highlight] to auto-bold and tab over every row that you hit (or got hit) on!
- **Duplicate Safety Prevention**: The script will now loudly complain natively on the webpage via a blaring red UI banner if you accidentally leave multiple versions enabled at the same time in your extension! Keep your TamperMonkey clean, folks!

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.29] - 2026-05-09
### Fixed
- Fixed an issue where breaking a 'Spelunking Satchel' or other equipment in the mines would mistakenly parse and log it as an acquired ore type.

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.40] - 2026-05-12
- Added a **Fight Display Helper**. Multi-hobo log reading just got way easier; click [highlight] to auto-bold and tab over every row that you hit (or got hit) on!
- **Duplicate Safety Prevention**: The script will now loudly complain natively on the webpage via a blaring red UI banner if you accidentally leave multiple versions enabled at the same time in your extension! Keep your TamperMonkey clean, folks!

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.28] - 2026-05-08
### Changed
- Swapped the Active Miners list map outline animation from a flashing color to a continuous expanding blue pulse overlay for 5 seconds.

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.40] - 2026-05-12
- Added a **Fight Display Helper**. Multi-hobo log reading just got way easier; click [highlight] to auto-bold and tab over every row that you hit (or got hit) on!
- **Duplicate Safety Prevention**: The script will now loudly complain natively on the webpage via a blaring red UI banner if you accidentally leave multiple versions enabled at the same time in your extension! Keep your TamperMonkey clean, folks!

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.27] - 2026-05-08
### Added
- Added an Active Miners list to the left column while exploring the Mines. It lists all players visible on the map and their coordinates. Clicking on a player initiates a 5-second flashing highlight on their map location for easy tracking.

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.40] - 2026-05-12
- Added a **Fight Display Helper**. Multi-hobo log reading just got way easier; click [highlight] to auto-bold and tab over every row that you hit (or got hit) on!
- **Duplicate Safety Prevention**: The script will now loudly complain natively on the webpage via a blaring red UI banner if you accidentally leave multiple versions enabled at the same time in your extension! Keep your TamperMonkey clean, folks!

## [9.41] - 2026-05-12
- **Living Area Helper**: Your active tattoo now displays the number of days left directly below its icon! No more hover required.

## [9.26] - 2026-05-08
### Added
- Added a new setting to the Mines helper to highlight players on the mini-map. Other players are outlined in red, and the player character ("You!") is outlined in green.
