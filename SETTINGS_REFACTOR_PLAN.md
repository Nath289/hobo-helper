# Settings & LocalStorage Refactor Plan

Based on the requirement to eliminate the split `hw_helper_settings` and `hw_helper_local_settings` objects, the following architecture will be implemented to dynamically manage settings and group local storage values by their respective module.

## 1. Data Restructuring (`localStorage` Grouping)
Instead of having massive shared objects (`hw_helper_settings` and `hw_helper_local_settings`) or scattering individual tracking variables all over the root of `localStorage`, **every module** will now get a single, unified JSON object wrapper named after itself (e.g., `hw_BankHelper`).

Inside this object, the data will be cleanly grouped:
```json
{
  "settings": {
    "BankHelper_FixedGoals": true
  },
  "data": {
    "goals": [...]
  }
}
```

## 2. Dynamic Settings Retrieval (`SettingsHelper.js`)
The `SettingsHelper` will be rewritten so that when the preferences page is opened, it iterates through the global `Modules` object list.
For each module (e.g., `BankHelper`), it will:
1. Look for its defined `settings` array.
2. Dynamically pull *only* that module's saved settings block (`Utils.getModuleSettings('BankHelper')`).
3. Render the UI toggles and collapse wrappers.

When the user toggles a UI switch, it will natively save exactly to that specific module's isolated container.

## 3. Resolving the Sync vs. Local Device Grief
Because `hw_helper_settings` and `hw_helper_local_settings` are currently split, it has caused synchronization headaches. 
Under the new architecture, since everything is grouped within `hw_[ModuleName]`, we will update the Cloud Sync engine to intelligently traverse these module blocks. If a module has a `localKeys` property defined (e.g. `localKeys: ['WidenContentArea']`), the CouchDB sync will securely scrub only that specific key out of the `hw_[ModuleName].settings` object before external push/pull, removing the need for a fractured dual-object structure.

## 4. Implementation Steps
1. **API Expansion:** Update `Utils.js` with new helper methods such as `Utils.getModuleSettings(moduleName)`, `Utils.getModuleData(moduleName)`, and their respective setters.
2. **Refactor Existing Modules:** Iterate through all global and page modules, converting statements like `if (settings['Option'])` to `if (Utils.getModuleSettings('ModuleName')['Option'])`.
3. **Migration Script:** Add a seamless, one-time silent migration routine that loads the legacy `hw_helper_settings` arrays on startup, correctly distributes the variables to their respective new `hw_[ModuleName]` objects, and then finally deletes the legacy keys so users don't lose all their defined preferences during the transition.
4. **Cloud Sync Update:** Alter the sync push/pull to merge objects dynamically based on the active Module library, effectively replacing the hardcoded `hw_helper_settings` references.

