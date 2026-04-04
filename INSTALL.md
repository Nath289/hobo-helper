# Installing Hobo Helper

Hobo Helper is a userscript that runs inside your browser via the **Tampermonkey** extension. Follow the steps below to get it set up.

---

## Step 1 – Install the Tampermonkey Extension

Tampermonkey is a free browser extension available for all major browsers. Click the link for your browser to install it from the official store:

| Browser | Link |
|---------|------|
| Chrome / Brave / Edge (Chromium) | [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) |
| Firefox | [Firefox Add-ons](https://addons.mozilla.org/firefox/addon/tampermonkey/) |
| Safari | [Mac App Store](https://apps.apple.com/app/tampermonkey/id1482490089) |
| Opera | [Opera Add-ons](https://addons.opera.com/extensions/details/tampermonkey-beta/) |

Once installed, you will see the Tampermonkey icon (a dark square with two overlapping circles) in your browser toolbar.

---

## Step 2 – Install the Hobo Helper Script

1. Navigate to the latest compiled Hobo Helper script file in this repository:  
   **[`output/hobo-helper-v7.66.user.js`](output/hobo-helper-v7.66.user.js)** (or the latest version in the `output` directory).

2. Click the **Raw** button to open the raw script file (or this URL: [hobo-helper-v7.66.user.js](https://github.com/Nath289/hobo-helper/raw/refs/heads/main/output/hobo-helper-v7.66.user.js))

3. Tampermonkey should automatically detect the userscript and open an installation prompt.

4. Review the script permissions shown in the prompt, then click **Install** (or **Update** if you are upgrading an existing installation).

   > If the installation prompt does not appear automatically, you can install manually:
   > 1. Click the Tampermonkey icon in your toolbar.
   > 2. Select **Dashboard**.
   > 3. Click the **+** (new script) tab.
   > 4. Paste the entire contents of the latest `output/hobo-helper-v7.66.user.js` file into the editor.
   > 5. Press **Ctrl + S** (or **Cmd + S** on Mac) to save.

---

## Step 3 – Verify the Installation

1. Open [HoboWars](https://hobowars.com) and log in to your account.
2. Click the Tampermonkey icon in your toolbar.
3. You should see **Hobo Helper** listed with a green dot, indicating it is active.
4. The enhancements provided by the script should now be visible on the game pages.

---

## Updating the Script

By default, Tampermonkey will check for updates periodically. However, you can configure it to always pull the latest version automatically from the main repository.

**To set up Auto-Updates:**
1. Open the Tampermonkey **Dashboard**.
2. Click on **Hobo Helper** to edit the script.
3. Click on the **Settings** tab.
4. In the **Includes/Excludes** or **Update URL** section, ensure the **Update URL** and **Download URL** are set to:
   ```
   https://github.com/Nath289/hobo-helper/raw/refs/heads/main/output/hobo-helper-latest.user.js
   ```
5. Tampermonkey will now automatically keep Hobo Helper updated to the latest version. Alternatively, you can always manually install the latest version from this link.

---

## Disabling or Removing the Script

- **Disable temporarily** – Click the Tampermonkey icon → click the toggle next to *Hobo Helper* to turn it off without uninstalling.
- **Remove permanently** – Open the Tampermonkey Dashboard, find *Hobo Helper*, and click the **Delete** button.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| The script does not appear in the Tampermonkey dashboard after installation | Make sure you clicked **Install** on the confirmation page and that Tampermonkey is enabled for your browser. |
| Hobo Helper features are not visible on HoboWars pages | Check that the script is enabled (green dot) and that you are logged in to HoboWars. Try a hard refresh with **Ctrl + Shift + R**. |
| The installation prompt did not appear when viewing the raw file | Install manually using the steps in the note under Step 2. |

---

If you run into any issues not covered above, please [open an issue](../../issues) on the repository and we will do our best to help.
