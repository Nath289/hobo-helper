# AI Agent Instructions

Welcome to the `hobo-helper` project! Since this project uses a custom build process without standard Node.js bundlers, please adhere strictly to these guidelines when making modifications:

## Project Structure
- `src/` - The main source code directory.
  - `src/template.js` - The master template file containing the userscript header, initialization logic, and interpolation markers (`// {{HELPERS}}`, etc.).
  - `src/utils.js` - General helper functions.
  - `src/modules/` - Contains individual module logic (e.g., `BankHelper.js`, `MixerHelper.js`) and static data objects (e.g., `DrinksData.js`).
- `html/` - Contains offline HTML snapshots of game pages. **Crucial for AI agents:** Since you cannot log into the game, always read the relevant `.html` files in this directory to analyze the DOM structure and formulate accurate query selectors before creating or modifying helpers.
- `tools/` - PowerShell scripts for extracting static game data (e.g., wiki data) into JSON format.
- `output/` - The destination for compiled userscripts. The build script automatically manages this folder by keeping only the 5 most recent versioned files and the latest build.

## Adding a New Module / Helper
1. **Always ask the user** for the URL of the page they want to create the new helper for. When they provide it, the important part to match is after and including `cmd=`. For example, in `https://www.hobowars.com/game/game.php?sr=141&cmd=preferences`, the `sr` number changes, so it cannot be hardcoded (use `cmd=preferences` to identify the page).
2. Create your new module file in `src/modules/` (e.g., `src/modules/JobHelper.js`).
3. Ensure the code inside is formatted as a valid constant variable allocation (e.g., `const JobHelper = { init: function() { ... } }`).
4. **Settings Helper Integration:** Always add the ability to disable the new helper via the `SettingsHelper`. Update `SettingsHelper` accordingly if needed.
5. **Update Documentation:** Whenever you create a new module or add a new feature to an existing module, you must update the `FEATURES.md` file to reflect the new functionality.
The build script automatically detects and includes all JavaScript files in the `src/modules/` directory.

## Updating the Version & Building
**Testing Unfinalized Changes:** Whenever you make code changes, you must always run `.\build.ps1` so the user can test your unfinalized changes via `output/hobo-helper-latest.user.js`. Do not update the version or changelog at this stage.

**CRITICAL:** Only update the changelog and bump the version **when the change has been finalized and the user explicitly instructs you to do so**. 
If you believe the change is final, **ask the user** if they want to finalize the change and bump the version. Otherwise, suggest additional functionality and improvements.

When finalizing a change:
1. Bump the `$version` variable at the top of `build.ps1` so that Tampermonkey knows an update is available (e.g., from `7.6` to `7.7`).
2. Update the version number and file links inside `INSTALL.md` to point to the newly compiled version.
3. Add an entry to `CHANGELOG.md` under the newly bumped version, logging what was added, changed, or fixed. Format the version headers like `## [7.43] - YYYY-MM-DD`.
4. Run the build script again:
```powershell
.\build.ps1
```
This will write the unified final file to `output/hobo-helper-v[VERSION].user.js` and `output/hobo-helper-latest.user.js`.

## Terminal Commands
- **Git Diff:** When running `git diff` in the terminal to verify your edits, **you must use the `--no-pager` flag** to prevent the terminal from hanging interactively (e.g. `git --no-pager diff`).
