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
1. **Always ask the user** for the URL of the page they want to create the new helper for if they have not provided it. **Do not guess or try to determine the URL yourself.** You must ask the user for the URL in order to proceed with the change. When they provide it, the important part to match is after and including `cmd=`. For example, in `https://www.hobowars.com/game/game.php?sr=141&cmd=preferences`, the `sr` number changes, so it cannot be hardcoded (use `cmd=preferences` to identify the page).
2. **Context Gathering:** Use PowerShell to search through the `html/` directory to find the specific layout file (e.g., `Select-String -Path "html\*.html" -Pattern "cmd=rats"` or search for unique text headers) to understand the DOM.
3. Create your new module file in `src/modules/` (e.g., `src/modules/JobHelper.js`).
4. Ensure the code inside is formatted as a valid constant variable allocation (e.g., `const JobHelper = { init: function() { ... } }`).
5. **Settings Helper Integration:** Always add the ability to disable the new helper sub-features via the `SettingsHelper`. To do this, include a `settings` array directly inside the module object definition containing the toggle keys and labels (e.g., `const JobHelper = { settings: [{ key: 'JobHelper_EnableFeature', label: 'Enable Feature' }], init: ... }`). The `SettingsHelper` will automatically detect and render them in the preferences page.
6. **UI Best Practices:** When creating custom interactive UI elements like buttons, toggle pills, or custom checkboxes, always add `user-select: none; -webkit-user-select: none;` to the CSS to prevent annoying text highlighting during rapid clicking.
7. **Update Documentation:** Whenever you create a new module or add a new feature to an existing module, you must update the `FEATURES.md` file to reflect the new functionality.
The build script automatically detects and includes all JavaScript files in the `src/modules/` directory.

## Supported Layouts
HoboWars can be viewed in various layouts that significantly change how the UI is displayed, including: Simple, Original, Stripped, Darkened, Classic (v2), Modern (v3), Stylish (v4), SFW, and The Future.
Currently, this tool has **only been built for the layout called "The Future"**. If a user reports issues or requests features, be aware that unexpected behavior may occur if they are using a different layout. Always build and test against "The Future" layout DOM structure.

## Game Rules Compliance
When a user requests a new feature or modification, you must ensure it does not violate the [HoboWars Game Rules](https://wiki.hobowars.com/index.php?title=Game_Rules) regarding automation:
- **Macros:** Programs that play part or all of the game for the user.
- **Refreshers:** Programs (or browser add-ins) that reload a web page at set intervals.
- **Autonomous Scripts:** Lists of commands executed without user interaction.
**Action:** If a user requests functionality that falls into these categories (e.g., auto-clicking, auto-refreshing, playing the game for them), **you must explicitly warn the user** that it violates the game rules. Instead of fully automating the action, suggest a compliant alternative, such as adding a UI button that the user must manually click to perform the action.

## Updating the Version & Building
**Testing Unfinalized Changes (Local Dev Workflow):** Whenever you make code changes, you must always run `.\build.ps1` (with no flags) so the user can test your unfinalized changes via `output/hobo-helper-dev.user.js`. Do not update the version or changelog at this stage.

**CRITICAL - Proactive Dev Setup:** If the user is beginning development and the file `output/dev-proxy-local.user.js` does not exist, you should proactively generate it for the user. Read the template `output/dev-proxy.template.user.js`, modify the `@require` path on line 7 to point to the exact absolute path of `output/hobo-helper-dev.user.js` on the user's system, and save it as `output/dev-proxy-local.user.js`. After generating it, explicitly direct the user to read `LOCAL_DEV.md` so they can understand how to initialize their fast-iteration local environment.

**CRITICAL:** Only update the changelog **when the change has been finalized and the user explicitly instructs you to do so**. 
If you believe the change is final, **ask the user** if they want to finalize the change and document it. Otherwise, suggest additional functionality and improvements.

When finalizing a change:
1. Add an entry to the top of `CHANGELOG.md` under the newly bumped version, logging what was added, changed, or fixed. Format the version headers like `## [7.43] - YYYY-MM-DD`. Note: The build script automatically parses this file to extract the current version and automatically generates the in-game floating changelog popup UI for you.
2. **DO NOT** update the file links inside `INSTALL.md` to point to a specific version number. All script links in `INSTALL.md` must ALWAYS point to `output/hobo-helper-latest.user.js` to ensure users continue receiving auto-updates via Tampermonkey.
3. Run the release build script:
```powershell
.\build.ps1 -Release
```
This will compile the final unified code into `output/hobo-helper-latest.user.js` for production users.

## Terminal Commands
- **Git Diff:** When running `git diff` in the terminal to verify your edits, **you must use the `--no-pager` flag** to prevent the terminal from hanging interactively (e.g. `git --no-pager diff`).
