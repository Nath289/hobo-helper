# AI Agent Instructions

Welcome to the `hobo-helper` project! Since this project uses a custom build process without standard Node.js bundlers, please adhere strictly to these guidelines when making modifications:

## Project Structure
- `src/` - The main source code directory.
  - `src/template.js` - The master template file containing the userscript header, initialization logic, and interpolation markers (`// {{HELPERS}}`, etc.).
  - `src/helpers.js` - General helper functions.
  - `src/modules/` - Contains individual module logic (e.g., `BankHelper.js`, `MixerHelper.js`).

## Adding a New Module / Helper
1. Create your new module file in `src/modules/` (e.g., `src/modules/JobHelper.js`).
2. Ensure the code inside is formatted as a valid constant variable allocation (e.g., `const JobHelper = { init: function() { ... } }`).
The build script automatically detects and includes all JavaScript files in the `src/modules/` directory.

## Updating the Version
**CRITICAL:** Every time you make *any functional change* or fix to the codebase, you must bump the `@version` number inside `src/template.js` so that Tampermonkey knows an update is available. Usually, simply incrementing the minor version is sufficient (e.g., from `7.6` to `7.7`).

## Building the Script
Instead of using Webpack, Rollup, or NPM, this project uses a custom PowerShell script to stitch the raw `.js` files together into a single Tampermonkey script.

**After making ANY code changes, you must run:**
```powershell
.\build.ps1
```

This will write the unified final file to `output/hobo-helper-v[VERSION].user.js` (e.g. `output/hobo-helper-v7.6.user.js`). Provide this compiled file path to the user if they need to copy it into Tampermonkey.

## Terminal Commands
- **Git Diff:** When running `git diff` in the terminal to verify your edits, **you must use the `--no-pager` flag** to prevent the terminal from hanging interactively (e.g. `git --no-pager diff`).
