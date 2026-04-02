# Changelog

All notable changes to this project will be documented in this file.

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
