# AI Agent Instructions

Welcome to the `hobo-helper` project! Since this project uses a custom build process without standard Node.js bundlers, please adhere strictly to these guidelines when making modifications:

## Project Structure
- `src/` - The main source code directory.
  - `src/template.js` - The master template file containing the userscript header, initialization logic, and interpolation markers (`// {{HELPERS}}`, etc.).
  - `src/utils.js` - General helper functions.
  - `src/modules/` - Contains individual module logic and static data objects.
    - `data/` - Static game data definitions (e.g., `DrinksData.js`, `OresData.js`).
    - `global/` - Modules that load on every page (e.g., `DisplayHelper.js`, `SettingsHelper.js`).
    - `page/` - Modules that only load on specific pages (e.g., `BankHelper.js`, `MixerHelper.js`). These modules must specify a `cmds` property indicating which pages they apply to.
- `html/` - Contains offline HTML snapshots of game pages. **Crucial for AI agents:** Since you cannot log into the game, always read the relevant `.html` files in this directory to analyze the DOM structure and formulate accurate query selectors before creating or modifying helpers.
- `tools/` - PowerShell scripts for extracting static game data (e.g., wiki data) into JSON format.
- `output/` - The destination for compiled userscripts. The build script automatically manages this folder by keeping only the 5 most recent versioned files and the latest build.
- `test/` - Contains test files and sandboxes. Any future sandbox/test scripts created during development must be placed here and they are ignored by version control.

## Game Knowledge
Whenever you handle a user request, always review the `GAME_KNOWLEDGE.md` file to understand game mechanics, UI rules, and layout logic. Furthermore, whenever the user provides new facts or you discover new game constraints, you must add them to `GAME_KNOWLEDGE.md` so that future agents have the same information.

**Wiki Data Retrieval:** If you need to look up game rules, item stats, or mechanics that are not explicitly documented in `GAME_KNOWLEDGE.md`, you should use the built-in Wiki Toolkit script to search the HoboWars wiki. Run `.\tools\wiki_toolkit.ps1 -Action search -Query 'Topic'` to find pages, and `.\tools\wiki_toolkit.ps1 -Action get -Query 'Exact_Page_Name'` to read the cleaned textual content in your terminal.

**Sync Data Retrieval:** If you need to retrieve a user's cloud-synced save data (e.g., to debug an issue with the Cloud Sync system or inspect raw storage), you can use the sync data retrieval script by running `.\get_sync_data.ps1`. If the script requires a Hobo ID, pass it as a parameter (e.g., `.\get_sync_data.ps1 -HoboId 12345`) or ensure `hobo_id` is set in `conf/couchdb-local.json`. The script will output the user's CouchDB sync document in JSON format.

## Adding a New Module / Helper
1. **Always ask the user** for the URL of the page they want to create the new helper for if they have not provided it. **Do not guess or try to determine the URL yourself.** You must ask the user for the URL in order to proceed with the change. When they provide it, the important part to match is after and including `cmd=`. For example, in `https://www.hobowars.com/game/game.php?sr=141&cmd=preferences`, the `sr` number changes, so it cannot be hardcoded (use `cmd=preferences` to identify the page).
2. **Context Gathering:** Use PowerShell to search recursively through the `html/` directory subfolders to find the specific layout file (e.g., `Get-ChildItem -Path html -Recurse -Filter *.html | Select-String -Pattern "cmd=rats"` or search for unique text headers) to understand the DOM.
3. Create your new module file in `src/modules/page/` (e.g., `src/modules/page/JobHelper.js`). If the module needs to run on every single page, place it in `src/modules/global/`.
4. Ensure the code inside is formatted as a valid constant variable allocation. Every module can define several special properties to control its behavior:
   - `cmds`: For page modules, you **must include a `cmds` property** containing the string or array of strings matching the `cmd=` parameter of the URLs it applies to (e.g., `cmds: 'job'` or `cmds: ['job', 'job2']`).
   - `staff`: Set to `true` if this module should only be compiled into the staff-only build.
   - `localKeys`: An array of local storage key strings or setting keys that **must not** sync across the CouchDB Cloud Sync system because they are device-dependent (e.g., `localKeys: ['hw_bank_goals', 'DisplayHelper_WidenPage']`).
   - `settings`: An array of configuration objects representing toggleable UI features routed automatically to the Preferences page (e.g. `settings: [{ key: 'DisplayHelper_WidenPage', label: 'Widen Content Area' }]`). To prevent a specific setting toggle from cloud syncing, add its `key` to the `localKeys` array of the module.
   - `init`: The primary execution constructor function fired when the script loads the module.
5. **Settings Helper Integration:** Always add the ability to disable the new helper sub-features via the `SettingsHelper` using the `settings` array mentioned above. The `SettingsHelper` will automatically detect and render them in the preferences page.
   - **Retrieving Settings:** When you need to check if a setting is enabled in your module, DO NOT guess the function name or read directly from localStorage if possible. Always use the built-in system function `const settings = Utils.getSettings();` which returns the parsed settings object. **CRITICAL:** Defaults defined in the `settings` array are not automatically hydrated into the saved storage object until the user visits the Preferences page. For toggleable features defaulting to `true`, you MUST check against explicit `false` (e.g., `if (settings?.MyHelper_Feature === false) return;`) rather than using truthy evaluations (like `if (!settings['MyHelper_Feature']) return;`), otherwise the feature will mistakenly disable itself for new users!
6. **Utilizing `src/utils.js`:** Always use and expand upon the core functions located within the `Utils` class where possible rather than duplicating common logic across modules. For example, grabbing standard user values (`Utils.getHoboLevel()`, `Utils.getHoboAgeInDays()`, etc.) or formatting standard data displays. If an operation acts on standard game mechanics spanning multiple generic pages, abstract it into `src/utils.js`.
   - **Date and Time:** Always use HoboTime (`Utils.getHoboTimestamp()`, `Utils.getHoboDateTime()`, etc.) when working with dates and times to ensure accuracy with the game's timezone. Do not use native `Date.now()` or `new Date()` directly.
   - **Logging:** Never use `console.log()` directly. Always use `Utils.log()` to ensure messages only output in development builds and keep the production console clean.
   - **Local Storage Management:** Never use `localStorage.setItem`, `localStorage.getItem`, or `localStorage.removeItem` directly unless writing root configuration system logic. Always use the built-in wrappers `Utils.setItem`, `Utils.getItem`, `Utils.removeItem`, and `Utils.setConfig`. By routing cache through the wrappers, you explicitly ensure data fires across the bidirectional Cloud Sync mechanism.
   - **Naming Local Storage Keys:** When creating new local storage keys, follow the standard format: `hw_{helperName}_{propertyName}`. For example, if adding a setting to the MinesHelper to track trades today, name the key `hw_MinesHelper_TradesToday`.
7. **UI Best Practices:** 
   - When creating custom interactive UI elements like buttons, toggle pills, or custom checkboxes, always add `user-select: none; -webkit-user-select: none;` to the CSS to prevent annoying text highlighting during rapid clicking.
   - When creating buttons, always use or match the site's native `.btn` class styling. If you need to inject custom CSS for buttons, use the following pattern to match the game's native style (typically by injecting a `<style>` block):
     ```css
     input[type="button"], input[type="submit"], .btn {
         -webkit-font-smoothing: antialiased;
         color: #636363;
         background: #ddd;
         font-weight: bold;
         text-decoration: none;
         padding: 5px 16px;
         border-radius: 3px;
         border: 0;
         cursor: pointer;
         margin: 3px 2px;
         -webkit-appearance: none;
         display: inline-block;
     }

     a.btn {
         line-height: 1em
     }

     input[type="button"]:hover,input[type="submit"]:hover,.btn:hover {
         color: #fff;
         background: #1b9eff;
         box-shadow: 0 0 0 rgba(0,0,0,.4);
         animation: pulse 1.5s infinite
     }
     ```
     *(Make sure to include the `@keyframes pulse` animation if not already present in the context, though it's usually defined natively.)*
   - **Disconnected DOM Node Queries:** When constructing custom UI elements programmatically (e.g., `const div = document.createElement('div')`), you cannot immediately query nested inputs utilizing `document.getElementById` globally because the wrapper is not yet appended to the `document`. You must safely scope your queries to the created wrapper element itself (e.g. `wrapperDiv.querySelector('#my_id')`).
8. **Update Documentation:** Whenever you create a new module or add a new feature to an existing module, you must update the `FEATURES.md` file to reflect the new functionality.
The build script automatically detects and includes all JavaScript files in the `src/modules/global/` and `src/modules/page/` directories, loading globals first.

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
**Testing Unfinalized Changes (Local Dev Workflow):** Whenever you make code changes, you must always run `.\build.ps1 -Obfuscate` so the user can test your unfinalized changes via `output/hobo-helper-dev.user.js`. Do not update the version or changelog at this stage.

**CRITICAL - Proactive Dev Setup:** If the user is beginning development and the file `output/dev-proxy-local.user.js` does not exist, you should proactively generate it for the user. Read the template `output/dev-proxy.template.user.js`, modify the `@require` path on line 7 to point to the exact absolute path of `output/hobo-helper-dev.user.js` on the user's system, and save it as `output/dev-proxy-local.user.js`. After generating it, explicitly direct the user to read `LOCAL_DEV.md` so they can understand how to initialize their fast-iteration local environment.
**CRITICAL - Userscript Header Changes:** Whenever you make structural modifications to the Userscript header inside `src/template.js` (such as adding `@noframes`, varying `@match` lines, or anything inside the `// ==UserScript==` block), **you must also mirror** these exact updates to BOTH `output/dev-proxy.template.user.js` AND `output/dev-proxy-local.user.js`. This is critical for users testing changes locally without encountering script mismatches or multiple fires.

**CRITICAL - STRICT RULES FOR RELEASE BUILDS (BETA):** Only update the changelog and run the beta release build **AFTER** the user has specifically tested your changes via the dev build (`.\build.ps1`), AND the user **explicitly uses the exact word "finalise" or "finalize"**. 
UNDER NO CIRCUMSTANCES should you execute `.\build.ps1 -Release`, edit `CHANGELOG.md`, or assume the user wants to finalize un-asked. Even if the request appears completely resolved, or even if the code works flawlessly, DO NOT FINALIZE. If you believe the change is final, you must **ask the user** if they want to finalize the change and document it. You MUST wait for their subsequent prompt containing the word "finalise" or "finalize" before taking release actions.

**SUPER CRITICAL - NEVER PREEMPTIVELY FINALIZE:** You are strictly forbidden from writing `.\build.ps1 -Release` to the terminal or making modifications to `CHANGELOG.md` unless the user's VERY LAST message contains the exact word "finalise" or "finalize". Do NOT anticipate it. Wait for the user to tell you. If you break this rule, you have failed.

When finalizing a change:
1. **Update Game Knowledge:** Review the current conversation for any new game mechanics, DOM structure details, or constraints discovered. If any new information was learned, you must append it to `GAME_KNOWLEDGE.md` before proceeding.
2. **Increment the Version Number:** You **MUST ALWAYS** create a new, incremented version number when finalizing. Tampermonkey strictly requires a new version number in order to detect and pull updates. Add a new entry to the top of `CHANGELOG.md` for ALL internal code and repository updates, logging what was added, changed, or fixed. Additionally, you **must also** add a separate entry to the top of `CHANGELOG_USERS.md` documenting ONLY exactly what has functionally changed for the end consumer. Both files share the same incremented version numbers. Format the version headers like `## [7.43] - YYYY-MM-DD`. Note: The build script automatically parses `CHANGELOG_USERS.md` to dynamically generate the in-game floating changelog popup UI for the player, keeping confusing behind-the-scenes engine developer chatter out of their view!
3. **DO NOT** update the file links inside `INSTALL.md` to point to a specific version number. All script links in `INSTALL.md` must ALWAYS point to `output/hobo-helper-latest.user.js` to ensure users continue receiving auto-updates via Tampermonkey.
4. Run the beta release build script (ensure it is obfuscated):
```powershell
.\build.ps1 -Release -Obfuscate
```
This will compile the unified code into `output/hobo-helper-beta.user.js` for beta testers on secondary devices.

**PROMOTING TO LATEST:** When the user is satisfied with the Beta workflow and issues the exact word "promote", you must execute the promotion build. Do NOT update `CHANGELOG.md` when promoting (as it was already updated during finalize). Simply run:
```powershell
.\build.ps1 -Promote -Obfuscate
```
This strictly compiles the current code into `output/hobo-helper-latest.user.js` to serve production users making it the default remote deployment.

## Terminal Commands
- **Git Diff:** When running `git diff` in the terminal to verify your edits, **you must use the `--no-pager` flag** to prevent the terminal from hanging interactively (e.g. `git --no-pager diff`).
