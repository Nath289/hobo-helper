# Hobo Helper Modules & Features

The Hobo Helper script breaks its functionality down into individual modules. Below is a full list of all active helpers included in the latest version:

> **Layout Warning:** HoboWars can be viewed in various layouts (Simple, Original, Stripped, Darkened, Classic, Modern, Stylish, SFW, and The Future). So far this tool has only been built for **"The Future"** layout. Unexpected behavior may occur if using a different layout.

### 1. Bank Helper (`BankHelper.js`)
Helps manage bank savings by allowing you to add and display custom financial goals. Makes withdrawing and depositing the exact amounts you need much easier.

### 2. Drinks & Mixing System (`DrinksHelper.js`, `DrinksData.js`, `LiquorStoreHelper.js`, `MixerHelper.js`)
A suite of tools centered around drinking and stat enhancement:
- Information on in-game drinks and their potential effects.
- Assistants in the Liquor Store for easier bulk purchasing or selecting specific drinks.
- An overlay in the Mixer that helps you find and create specific mixed drinks faster without looking up recipes externally.

### 3. Living Area Helper (`LivingAreaHelper.js`)
Provides quality-of-life additions to your Living Area. May include highlighting, timers, or fast-action buttons depending on your specific living area upgrades.
- **Mixer Link**: Adds a convenient link to the Mixer directly next to the Hobo Grail, Kings Kiddie Cup, and Golden Trolley icons. Can be disabled in Settings.

### 4. Northern Fence Helper (`NorthernFenceHelper.js`)
Assists in navigating the Northern Fence. Enhances the interface by displaying relevant stats and chances to help streamline exploration or related activities.

### 5. Settings Helper (`SettingsHelper.js`)
Integrates directly into your HoboWars in-game "Preferences" page (`cmd=preferences`). It provides a centralized hub to customize how Hobo Helper behaves across the game, allowing you to globally disable the script or granularly toggle individual modules and sub-features (like toggling specific Living Area Helper functionalities) to tailor your experience.

### 6. Tattoo Parlor Helper (`TattooParlorHelper.js`)
Helps optimize your time at the Tattoo Parlor. Displays relevant stat impacts of different tattoos so you can plan your character build efficiently.

### 7. University Helper (`UniversityHelper.js`)
A tool designed to make stat training smoother at the University. It can help track your stat ratios and highlight optimal training options.

### 8. Wellness Clinic Helper (`WellnessClinicHelper.js`)
Enhances the Wellness Clinic by displaying real-time data on your health, hospitalizations, or relevant cooldown timers directly into the UI.

### 9. Message Board Helper (`MessageBoardHelper.js`)
Provides functionality and quality-of-life improvements specifically on the Message Board gathering pages (`cmd=gathering`). Automatically adds an "Edit: Paid" button to the post editor that appends the current hobo name and a paid message statement. Automatically added structural support for future enhancements.

### 10. Kurtz Camp Helper (`KurtzCampHelper.js`)
Assists at Kurtz's Camp by keeping a running tally of Fire and Empty Bottles collected while lighting sticks. Retains this count across sessions using local storage, and includes a toggle to reset the counts at any time. Features dynamic display that only exhibits the empty bottle tally if any have been collected.

### 11. Bernards Mansion Helper (`BernardsMansionHelper.js`)
Provides tools and helpers when exploring Bernard's Mansion (`cmd=bernards`). 
- **Basement Map**: Displays a map when venturing into Bernard's Basement (`cmd=bernards&room=basement`).

### 12. Can Depo Helper (`CanDepoHelper.js`)
Assists when selling cans at the Can Depo (`cmd=depo`). 
- **Total Value**: Displays the total monetary value of all your collected cans based on the current per-can price.

### 13. Recycling Bin Helper (`RecyclingBinHelper.js`)
Helper functionality for the Recycling Bin screen.
- **Quick Recycle Buttons**: Adds "+100", "+200", and "+500" buttons next to the recycle button to quickly add those amounts to the recycle input.

### 14. Backpack Helper (`BackpackHelper.js`)
Assists with inventory management when viewing the Backpack.
- **Drink Tooltips**: Hovering over alcoholic or mixed drinks will display their base stat gains and effects right in the tooltip.

### 15. Lockout Helper (`LockoutHelper.js`)
Helper functionality activated during the game's 12-hour resets (lockout periods).
- **Changelog Display**: While the game is locked for resetting, this feature prominently displays the most recent Hobo Helper changelog notes via an overlaid UI directly on the reset screen, providing reading material during the wait.

---
*Note: We are constantly updating and tweaking these modules. If you encounter any bugs, please report them!*
