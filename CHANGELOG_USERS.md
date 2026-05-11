# Users Changelog
All notable user-facing features and bug fixes to this project will be documented in this file.

## [9.39] - 2026-05-11
### Fixed
- Fixed an issue in the Mines where the Mining Log would erroneously double-count ores and experience if you navigated using your browser's "Back" or "Forward" buttons.

## [9.38] - 2026-05-11
### Added
- Added an Explore Log feature to Bernard's Basement that tracks the valuable rare soups you discover (Garlic Salmon Bisque, Cream of Okra Soup, Texas Fajita Soup, Beef Mushroom Stew) and logs their XY coordinates so you can track findings across sessions!

## [9.37] - 2026-05-11
### Added
- Added a Developer Credits link to the Living Area panel above the Changelog.

## [9.36] - 2026-05-10
### Changed
- Under-the-hood engine optimizations and security improvements.

## [9.35] - 2026-05-10
### Added
- Added a toggle configuration option `NorthernFenceHelper_RestoreBanner` to conditionally restore or disable the classic custom Suicide Hill UI header graphic cleanly based on user preference.
### Fixed
- Fixed an issue causing duplicate page highlighting on specific subpages.

## [9.33] - 2026-05-10
### Fixed
- Fixed an issue where the Update Checker inside the Settings page would only point to the standard release script, downgrading installed Staff builds.
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
### Changed
- Swapped the Active Miners list map outline animation from a flashing color to a continuous expanding blue pulse overlay for 5 seconds.

## [9.27] - 2026-05-08
### Added
- Added an Active Miners list to the left column while exploring the Mines. It lists all players visible on the map and their coordinates. Clicking on a player initiates a 5-second flashing highlight on their map location for easy tracking.

## [9.26] - 2026-05-08
### Added
- Added a new setting to the Mines helper to highlight players on the mini-map. Other players are outlined in red, and the player character ("You!") is outlined in green.
