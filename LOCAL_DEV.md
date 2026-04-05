# Local Development Setup

To streamline your development workflow, you can set up Tampermonkey to read the build script directly from your local hard drive. This entirely removes the need to manually copy/paste code or push to GitHub to test your unfinalized changes.

## Step 1: Allow Tampermonkey to Read Local Files
By default, browser extensions are isolated from your local file system for security reasons.
1. Open your browser's **Extension Manager** (e.g., navigate to `chrome://extensions/` or `edge://extensions/`).
2. Find **Tampermonkey** in your list of extensions and click **Details**.
3. Scroll down and **Turn ON** the toggle for **"Allow access to file URLs"**.

## Step 2: Configure Your Proxy Script
We have provided a template script in the output folder. You will create a personal, git-ignored copy of this script.
1. Navigate to the `output/` directory in your project.
2. Make a copy of `dev-proxy.template.user.js` and rename the copy to `dev-proxy-local.user.js`. *(Note: The `.gitignore` is already configured to ignore files ending in `-local.user.js` so you won't accidentally commit your personal path).*
3. Open your new `dev-proxy-local.user.js` file in your code editor.
4. **IMPORTANT:** Change the `@require` path on line 7 to match the absolute path of this project on your local computer. Make sure to use forward slashes (`/`), and start with `file:///` followed by your drive letter on Windows, or just your root path on Mac/Linux.
   * *Example Windows:* `// @require      file:///C:/Users/Username/Documents/GitHub/hobo-helper/output/hobo-helper-dev.user.js`
   * *Example Mac/Linux:* `// @require      file:///Users/Username/Documents/GitHub/hobo-helper/output/hobo-helper-dev.user.js`
5. Save the file.

## Step 3: Install the Proxy Script
1. Simply drag and drop your new `dev-proxy-local.user.js` file directly into a new browser tab. Tampermonkey will intercept it and prompt you to install it.
2. In Tampermonkey, **Disable** the standard `HoboWars Helper Toolkit` temporarily so that the production script and dev script don't conflict or execute at the same time.

## Your New Workflow
Instead of pasting the entire compiled bundle into Tampermonkey every time, the proxy script simply uses the `@require` tag to point directly to your local `output/hobo-helper-dev.user.js` file.

Now, your iteration loop is incredibly fast:
1. Edit any source file(s) in your code editor and save.
2. Run `.\build.ps1` in the terminal to compile your latest unfinalized changes into `hobo-helper-dev.user.js`.
3. **Refresh your browser tab** in HoboWars.

Tampermonkey will automatically fetch the newly compiled local file on every single page load!
