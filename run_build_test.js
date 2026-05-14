const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const scriptPath = process.argv[2];
if (!scriptPath) {
    console.error("Please provide a script path to test.");
    process.exit(1);
}

const scriptContent = fs.readFileSync(scriptPath, 'utf8');

const virtualConsole = new jsdom.VirtualConsole();

let hasError = false;

virtualConsole.on("jsdomError", (e) => {
    console.error("JSDOM Error caught (likely ReferenceError or SyntaxError):");
    console.error(e.stack || e);
    hasError = true;
});

virtualConsole.on("error", (e) => {
    console.error("Window Error caught:");
    console.error(e);
    hasError = true;
});

const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`, {
    url: "https://www.hobowars.com/game/game.php",
    runScripts: "dangerously",
    virtualConsole
});

// Mock some Greasemonkey/Tampermonkey functions and standard browser globals usually provided by TM
dom.window.GM_setValue = () => {};
dom.window.GM_getValue = () => null;
dom.window.GM_addStyle = () => {};
dom.window.unsafeWindow = dom.window;

// Execute the script
try {
    const scriptEl = dom.window.document.createElement("script");
    scriptEl.textContent = scriptContent;
    dom.window.document.body.appendChild(scriptEl);
} catch (e) {
    console.error("Caught exception during script insertion:");
    console.error(e);
    hasError = true;
}

if (hasError) {
    console.error("\n❌ Build Test Failed: Script execution threw an error.");
    process.exit(1);
} else {
    console.log("✅ Build Test Passed: Script executed without synchronous errors.");
    process.exit(0);
}

