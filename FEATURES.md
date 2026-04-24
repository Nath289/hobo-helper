# Hobo Helper Modules & Features

The Hobo Helper script breaks its functionality down into individual modules. Below is a full list of all active helpers included in the latest version:

> **Layout Warning:** HoboWars can be viewed in various layouts (Simple, Original, Stripped, Darkened, Classic, Modern, Stylish, SFW, and The Future). So far this tool has only been built for **"The Future"** layout. Unexpected behavior may occur if using a different layout.

### 1. Bank Helper (`BankHelper.js`)
Helps manage bank savings by allowing you to add and display custom financial goals. Makes withdrawing and depositing the exact amounts you need much easier.
- **5 Fighter's Lunches Goal**: Adds a button to withdraw the exact cost of 5 Fighter's Lunches based on your current Hobo Level. Can be disabled in Settings.

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

### 5. Fort Slugworth Helper (`FortSlugworthHelper.js`)
Assists in navigating Fort Slugworth (`cmd=fort_slugworth`).
- **The Ripaparter Feature**: Provides functionality inside The Ripaparter (The Deinventing Room) (`room=4`).

### 6. Settings Helper (`SettingsHelper.js`)
Integrates directly into your HoboWars in-game "Preferences" page (`cmd=preferences`). It provides a centralized hub to customize how Hobo Helper behaves across the game, allowing you to globally disable the script or granularly toggle individual modules and sub-features (like toggling specific Living Area Helper functionalities) to tailor your experience.

### 7. Tattoo Parlor Helper (`TattooParlorHelper.js`)
Helps optimize your time at the Tattoo Parlor. Displays relevant stat impacts of different tattoos so you can plan your character build efficiently.

### 8. University Helper (`UniversityHelper.js`)
A tool designed to make stat training smoother at the University. It can help track your stat ratios and highlight optimal training options.

### 9. Wellness Clinic Helper (`WellnessClinicHelper.js`)
Enhances the Wellness Clinic by displaying real-time data on your health, hospitalizations, or relevant cooldown timers directly into the UI.

### 10. Message Board Helper (`MessageBoardHelper.js`)
Provides functionality and quality-of-life improvements specifically on the Message Board gathering pages (`cmd=gathering`). 
- **Ctrl+Enter to Post**: Rapidly submit replies using the keyboard shortcut.
- **Add Paid Message**: Adds a button to the post editor that appends your current hobo name and a paid message statement. 
- **Gang Board Tools**: Allows Gang Staff to save topic replier lists and record manual payments per-post.
- **Larger Vote Buttons**: Converts the tiny Up/Down vote links into larger, easy-to-click buttons while perfectly preserving the native vote info tooltips.

### 11. Kurtz Camp Helper (`KurtzCampHelper.js`)
Assists at Kurtz's Camp by keeping a running tally of Fire and Empty Bottles collected while lighting sticks. Retains this count across sessions using local storage, and includes a toggle to reset the counts at any time. Features dynamic display that only exhibits the empty bottle tally if any have been collected.

### 12. Bernards Basement Helper (`BernardsBasementHelper.js`)
Provides tools and helpers when exploring Bernard's Basement (`cmd=bernards&room=basement`). 
- **Basement Map**: Displays a minimap of the coordinates you are currently standing on while inside the basement.

### 13. Can Depo Helper (`CanDepoHelper.js`)
Assists when selling cans at the Can Depo (`cmd=depo`). 
- **Total Value**: Displays the total monetary value of all your collected cans based on the current per-can price.

### 14. Recycling Bin Helper (`RecyclingBinHelper.js`)
Helper functionality for the Recycling Bin screen.
- **Quick Recycle Buttons**: Adds customizable quick-add amount buttons next to the native recycle input. Values can be added, removed, or changed dynamically via an inline configuration panel.

### 15. Backpack Helper (`BackpackHelper.js`)
Assists with inventory management when viewing the Backpack.
- **Drink Tooltips**: Hovering over alcoholic or mixed drinks will display their base stat gains and effects right in the tooltip.

### 16. Lockout Helper (`LockoutHelper.js`)
Helper functionality activated during the game's 12-hour resets (lockout periods).
- **Changelog Display**: While the game is locked for resetting, this feature prominently displays the most recent Hobo Helper changelog notes via an overlaid UI directly on the reset screen, providing reading material during the wait.

### 17. Display Helper (`DisplayHelper.js`)
A core helper that runs display improvement related functions.
- **Enable Improved Avatars**: Custom styled shapes and online indicators for avatars.
- **Enable the Fake Qwee**: Places a "The Fake" prefix label in front of all player links referencing ID 2924510.
- **Show Next Interesting Level**: Automatically displays the next prime level next to your current level on the UI.

### 18. Gang Loans Helper (`GangLoansHelper.js`)
A gang management tool that creates a specialized dashboard within the Gang Loans page (`cmd=gang2&do=loans`).
- **Saved Posts & Payments Panel**: Aggregates and displays all saved gang post repliers and recorded payments from the Message Board Helper into a single convenient panel, making it easy to action bulk loans or payments and track who has replied to recruitment or event threads.

### 19. Hitlist Helper (`HitlistHelper.js`)
A helper designed to operate on the main game Hitlist page (`cmd=battle&do=phlist`).
- **Highlight Online Players**: Scans your hitlist for opponents currently online and highlights their entire row green, avoiding the need to search for the small online icon.

### 20. Gang Hitlist Helper (`GangHitlistHelper.js`)
A helper designed to operate on the Gang Hitlist page (`cmd=gang&do=hitlist`).
- **Hitlist Page Tracker**: Remembers the currently selected paginated hitlist page number and highlights the selected page number in a larger, bold font with a yellow background.
- **Hitlist Mark Red**: Adds an interactive link to the "Options" column to manually mark individual hobos, turning their row red persistently across page reloads.

### 21. Soup Kitchen Helper (`SoupKitchenHelper.js`)
A helper designed to operate on the Soup Kitchen page (`cmd=soup_kitchen`).
- **Soup Line Predictor**: Displays your Hobo's exact age in days right alongside a handy wiki reference table to help you determine exactly which soup rewards correlate to which age ranges when waiting in the soup line.

### 22. Rats Helper (`RatsHelper.js`)
A new helper designed to operate on the Rats page (`cmd=rats`).
- **Life Progress Bar**: Automatically calculates and displays a colorful life remaining progress bar beneath each rat.
- **Experience Progress Bar**: Shows a small colored background bar over each rats experience td cell.
- **Action Buttons**: Restyles text action links as stylized UI buttons for improved usability.
- **Custom Upgrade Buttons UI**: Enhances the rat upgrade page with dedicated pill buttons and icons for permanent/standard upgrades.
- **Rat News Filter**: Provides an easy filter row for hiding or showing news related to specific rats.
- **Cheese Visuals**: Adds a small cheese emoji to cheese number cells.

### 23. Weapons Helper (`WeaponsHelper.js`)
A new helper designed to operate on the Weapons page (`cmd=wep`).
- **Highlight Equipped Items**: Automatically highlights weapons, armor, and rings that you currently have equipped in your inventory list.
- **Quick Equip/Unequip**: Converts item images into clickable links that will instantly equip or unequip the item based on its current state.

### 24. Gang Staff Helper (`GangStaffHelper.js`)
Helper designed to function on Gang-related pages (`cmd=gang`).
- **Gang Event Data Save**: Injects an admin-only dashboard specifically within the event stats for events like "Gangsters Sunday = Funday", dynamically tracking and storing custom event payments.
- **Member List Columns**: Exposes a completely configurable column selection UI right above the "list members" table so users aren't locked into the rigid pre-set columns. Fully integrated with LocalStorage and safely adapts between User and Staff column restrictions.
- **Format Mass Mails**: Formats the list of recipients on the mass mail reading page into an easy-to-read table with read/unread status filters and total counts.
- **Mass Mail Templates**: Adds a comprehensive templating system to the Gang Send Mass Mail page. Allows saving, updating, loading, deleting, exporting, and importing templates that store the 'Send To' grouping, Subject, and Body content. Includes support for dynamic `{date}` and `{fullDate}` insertion in the subject line.
- **Gang Armory Dashboard (`GangArmoryHelper.js`)**: Overhauls the Gang Armory interface (`cmd=gang&do=armory`) by grouping identical items by name and sorting dynamically by power stats. Includes a favorite items dashboard pinning priority gear to the top, and interactive buttons to hide selected clutter items permanently. Adds an Unbrand action next to Claim Back for players with permissions, and includes global Expand/Collapse/Toggle All capabilities.

### 25. Market Helper (`MarketHelper`)
- Converts plain-text inline "Buy" links and Market navigation headers into large, interactive button elements for an improved desktop/mobile marketplace experience.
- Cross-references the HoboWars wiki to dynamically inject highly-visible 40x40 item thumbnails natively into the Market listings for Weapons, Armor, and Cart Parts.
- Transforms the SGHM Market Watcher text feed into a structured, readable HTML table, with alternating rows, styled headers, and extracted values.

### 26. Drink Helpers
- [x] Automatically inject stat and effect data as tooltips to all drinks when hovering your mouse over them inside of your backpack and living area page.

### 27. Food Helpers
- [x] Food Menu Management: Add a "Mark as Crap" button to mark selected foods as "crap". Unchecked foods will be removed from the list.
- [x] Add a "Select Crap" button to automatically select all foods you have marked as crap, making it easy to throw them away.
- [x] Works both in the main Food page and within the Living Area Food tab.

### 28. Active List Helper (`ActiveListHelper.js`)
Helper functionality for the Active List page (`cmd=active`).
- **Interactive Alive/Dead Filter**: Adds pill-styled buttons allowing users to dynamically hide dead players or show everyone.
- **Attack Range Filter**: Automatically restricts the opponent list to players within your immediate attackable level range (± 200 levels).

---
*Note: We are constantly updating and tweaking these modules. If you encounter any bugs, please report them!*
### 29. Player Helper (\PlayerHelper.js\)
Provides enhanced functionality and specific shortcuts when viewing the \cmd=player\ profiles.
- **Copy Hoboname**: Embeds a clickable icon under the "Citizen Information" box that allows for quickly copying the player's formatted \[hoboname=ID]\ tag. Can be disabled in Settings.

### 30. Gang Board Staff Helper (`GangBoardStaffHelper.js`)
Helper available on Message Board threads exclusively designed for Gang Staff.
- **Save Repliers List**: Collects the names and IDs of everyone who has replied to a staff topic and saves it locally for future events, roll-calls, or loan administration.
- **Payment Distribution UI**: Adds an "Add Payment" capability to every single board reply allowing staff members to quickly define a scheduled payout for event attendees directly from the thread view. This directly exports to the Gang Loans Dashboard.

### Display Helpers
Helper available on Message Board threads exclusively designed for Gang Staff.
- **Save Repliers List**: Collects the names and IDs of everyone who has replied to a staff topic and saves it locally for future events, roll-calls, or loan administration.
- **Payment Distribution UI**: Adds an "Add Payment" capability to every single board reply allowing staff members to quickly define a scheduled payout for event attendees directly from the thread view. This directly exports to the Gang Loans Dashboard.

### Display Helpers
- **Improved Avatars**: Restyles user avatars to have rounded edges, distinctive borders (special styling for Donators), and custom pulsing online status indicators.
- **Fake Qwee**: Automatically prepends "The Fake" with a red shadow to any user link pointing to "The Fake Qwee" (ID `2924510`).
- **Jack Reacher**: Automatically prepends "Major" with a bright green shadow to any user link pointing to "Jack Reacher" (ID `107380`).
- **Widen Content Area**: Expands the historically narrow game content container to a customizable width (default 660px) for better readability on modern monitors.
- **Swipeable Topbar Menu**: Converts the crowded top navigation bar (Dirt Road, Recycling Bin, etc.) into a horizontally scrollable container, preventing off-screen clipping on mobile devices.

### 11. Skills Helper (`SkillsHelper.js`)
Adds functionality to the Skills page to make managing and buying skill sets easier.
- **Max Buy Button**: Adds a "Max" button to the Buy All Skill Set section, allowing you to instantly input the maximum number of skill sets you can afford with your current tokens. Can be disabled in Settings.
- **Dynamic Width**: If the page has been widened via the Display Helper, the Skills Repository table will automatically scale to take up the available screen space, providing a less cluttered layout.
- **Quick Skill Shop**: Transforms the small Skill Shop link at the bottom of the page into a large button and relocates it above the Skill Repository for quick access. Can be disabled in Settings.
- **Style Unequip Buttons**: Modifies the plaintext `[Unequip All]` links on the page into properly styled interactive buttons.
- **Highlight Empty Skills**: Automatically applies a faint red background to any active equipped skills in your list that have 0 uses remaining, making them easy to spot at a glance.

### 12. Bernards Basement Helper (`BernardsBasementHelper.js`)
Provides tools and helpers when exploring Bernard's Basement (`cmd=bernards&room=basement`). 
- **Basement Map**: Displays a minimap of the coordinates you are currently standing on while inside the basement.

### 13. Can Depo Helper (`CanDepoHelper.js`)
Assists when selling cans at the Can Depo (`cmd=depo`). 
- **Total Value**: Displays the total monetary value of all your collected cans based on the current per-can price.

### 14. Recycling Bin Helper (`RecyclingBinHelper.js`)
Helper functionality for the Recycling Bin screen.
- **Quick Recycle Buttons**: Adds customizable quick-add amount buttons next to the native recycle input. Values can be added, removed, or changed dynamically via an inline configuration panel.

### 15. Backpack Helper (`BackpackHelper.js`)
Assists with inventory management when viewing the Backpack.
- **Drink Tooltips**: Hovering over alcoholic or mixed drinks will display their base stat gains and effects right in the tooltip.

### 16. Lockout Helper (`LockoutHelper.js`)
Helper functionality activated during the game's 12-hour resets (lockout periods).
- **Changelog Display**: While the game is locked for resetting, this feature prominently displays the most recent Hobo Helper changelog notes via an overlaid UI directly on the reset screen, providing reading material during the wait.

### 17. Display Helper (`DisplayHelper.js`)
A core helper that runs display improvement related functions.
- **Enable Improved Avatars**: Custom styled shapes and online indicators for avatars.
- **Enable the Fake Qwee**: Places a "The Fake" prefix label in front of all player links referencing ID 2924510.
- **Show Next Interesting Level**: Automatically displays the next prime level next to your current level on the UI.

### 18. Gang Loans Helper (`GangLoansHelper.js`)
A gang management tool that creates a specialized dashboard within the Gang Loans page (`cmd=gang2&do=loans`).
- **Saved Posts & Payments Panel**: Aggregates and displays all saved gang post repliers and recorded payments from the Message Board Helper into a single convenient panel, making it easy to action bulk loans or payments and track who has replied to recruitment or event threads.

### 19. Hitlist Helper (`HitlistHelper.js`)
A helper designed to operate on the main game Hitlist page (`cmd=battle&do=phlist`).
- **Highlight Online Players**: Scans your hitlist for opponents currently online and highlights their entire row green, avoiding the need to search for the small online icon.

### 20. Gang Hitlist Helper (`GangHitlistHelper.js`)
A helper designed to operate on the Gang Hitlist page (`cmd=gang&do=hitlist`).
- **Hitlist Page Tracker**: Remembers the currently selected paginated hitlist page number and highlights the selected page number in a larger, bold font with a yellow background.
- **Hitlist Mark Red**: Adds an interactive link to the "Options" column to manually mark individual hobos, turning their row red persistently across page reloads.

### 21. Soup Kitchen Helper (`SoupKitchenHelper.js`)
A helper designed to operate on the Soup Kitchen page (`cmd=soup_kitchen`).
- **Soup Line Predictor**: Displays your Hobo's exact age in days right alongside a handy wiki reference table to help you determine exactly which soup rewards correlate to which age ranges when waiting in the soup line.

### 22. Rats Helper (`RatsHelper.js`)
A new helper designed to operate on the Rats page (`cmd=rats`).
- **Life Progress Bar**: Automatically calculates and displays a colorful life remaining progress bar beneath each rat.
- **Experience Progress Bar**: Shows a small colored background bar over each rats experience td cell.
- **Action Buttons**: Restyles text action links as stylized UI buttons for improved usability.
- **Custom Upgrade Buttons UI**: Enhances the rat upgrade page with dedicated pill buttons and icons for permanent/standard upgrades.
- **Rat News Filter**: Provides an easy filter row for hiding or showing news related to specific rats.
- **Cheese Visuals**: Adds a small cheese emoji to cheese number cells.

### 23. Weapons Helper (`WeaponsHelper.js`)
A new helper designed to operate on the Weapons page (`cmd=wep`).
- **Highlight Equipped Items**: Automatically highlights weapons, armor, and rings that you currently have equipped in your inventory list.
- **Quick Equip/Unequip**: Converts item images into clickable links that will instantly equip or unequip the item based on its current state.

### 24. Gang Staff Helper (`GangStaffHelper.js`)
Helper designed to function on Gang-related pages (`cmd=gang`).
- **Gang Event Data Save**: Injects an admin-only dashboard specifically within the event stats for events like "Gangsters Sunday = Funday", dynamically tracking and storing custom event payments.
- **Member List Columns**: Exposes a completely configurable column selection UI right above the "list members" table so users aren't locked into the rigid pre-set columns. Fully integrated with LocalStorage and safely adapts between User and Staff column restrictions.
- **Format Mass Mails**: Formats the list of recipients on the mass mail reading page into an easy-to-read table with read/unread status filters and total counts.
- **Mass Mail Templates**: Adds a comprehensive templating system to the Gang Send Mass Mail page. Allows saving, updating, loading, deleting, exporting, and importing templates that store the 'Send To' grouping, Subject, and Body content. Includes support for dynamic `{date}` and `{fullDate}` insertion in the subject line.
- **Gang Armory Dashboard (`GangArmoryHelper.js`)**: Overhauls the Gang Armory interface (`cmd=gang&do=armory`) by grouping identical items by name and sorting dynamically by power stats. Includes a favorite items dashboard pinning priority gear to the top, and interactive buttons to hide selected clutter items permanently. Adds an Unbrand action next to Claim Back for players with permissions, and includes global Expand/Collapse/Toggle All capabilities.

### 25. Market Helper (`MarketHelper`)
- Converts plain-text inline "Buy" links and Market navigation headers into large, interactive button elements for an improved desktop/mobile marketplace experience.
- Cross-references the HoboWars wiki to dynamically inject highly-visible 40x40 item thumbnails natively into the Market listings for Weapons, Armor, and Cart Parts.
- Transforms the SGHM Market Watcher text feed into a structured, readable HTML table, with alternating rows, styled headers, and extracted values.

### 26. Drink Helpers
- [x] Automatically inject stat and effect data as tooltips to all drinks when hovering your mouse over them inside of your backpack and living area page.

### 27. Food Helpers
- [x] Food Menu Management: Add a "Mark as Crap" button to mark selected foods as "crap". Unchecked foods will be removed from the list.
- [x] Add a "Select Crap" button to automatically select all foods you have marked as crap, making it easy to throw them away.
- [x] Works both in the main Food page and within the Living Area Food tab.

### 28. Active List Helper (`ActiveListHelper.js`)
Helper functionality for the Active List page (`cmd=active`).
- **Interactive Alive/Dead Filter**: Adds pill-styled buttons allowing users to dynamically hide dead players or show everyone.
- **Attack Range Filter**: Automatically restricts the opponent list to players within your immediate attackable level range (± 200 levels).

---
*Note: We are constantly updating and tweaking these modules. If you encounter any bugs, please report them!*
### 29. Player Helper (\PlayerHelper.js\)
Provides enhanced functionality and specific shortcuts when viewing the \cmd=player\ profiles.
- **Copy Hoboname**: Embeds a clickable icon under the "Citizen Information" box that allows for quickly copying the player's formatted \[hoboname=ID]\ tag. Can be disabled in Settings.

### 30. Gang Board Staff Helper (`GangBoardStaffHelper.js`)
Helper available on Message Board threads exclusively designed for Gang Staff.
- **Save Repliers List**: Collects the names and IDs of everyone who has replied to a staff topic and saves it locally for future events, roll-calls, or loan administration.
- **Payment Distribution UI**: Adds an "Add Payment" capability to every single board reply allowing staff members to quickly define a scheduled payout for event attendees directly from the thread view. This directly exports to the Gang Loans Dashboard.

### Display Helpers
Helper available on Message Board threads exclusively designed for Gang Staff.
- **Save Repliers List**: Collects the names and IDs of everyone who has replied to a staff topic and saves it locally for future events, roll-calls, or loan administration.
- **Payment Distribution UI**: Adds an "Add Payment" capability to every single board reply allowing staff members to quickly define a scheduled payout for event attendees directly from the thread view. This directly exports to the Gang Loans Dashboard.

### Display Helpers
- **Improved Avatars**: Restyles user avatars to have rounded edges, distinctive borders (special styling for Donators), and custom pulsing online status indicators.
- **Fake Qwee**: Automatically prepends "The Fake" with a red shadow to any user link pointing to "The Fake Qwee" (ID `2924510`).
- **Jack Reacher**: Automatically prepends "Major" with a bright green shadow to any user link pointing to "Jack Reacher" (ID `107380`).
- **Widen Content Area**: Expands the historically narrow game content container to a customizable width (default 660px) for better readability on modern monitors.
- **Swipeable Topbar Menu**: Converts the crowded top navigation bar (Dirt Road, Recycling Bin, etc.) into a horizontally scrollable container, preventing off-screen clipping on mobile devices.

### 11. Skills Helper (`SkillsHelper.js`)
Adds functionality to the Skills page to make managing and buying skill sets easier.
- **Max Buy Button**: Adds a "Max" button to the Buy All Skill Set section, allowing you to instantly input the maximum number of skill sets you can afford with your current tokens. Can be disabled in Settings.
- **Dynamic Width**: If the page has been widened via the Display Helper, the Skills Repository table will automatically scale to take up the available screen space, providing a less cluttered layout.
- **Quick Skill Shop**: Transforms the small Skill Shop link at the bottom of the page into a large button and relocates it above the Skill Repository for quick access. Can be disabled in Settings.
- **Style Unequip Buttons**: Modifies the plaintext `[Unequip All]` links on the page into properly styled interactive buttons.

### 12. Bernards Basement Helper (`BernardsBasementHelper.js`)
Provides tools and helpers when exploring Bernard's Basement (`cmd=bernards&room=basement`). 
- **Basement Map**: Displays a minimap of the coordinates you are currently standing on while inside the basement.

### 13. Can Depo Helper (`CanDepoHelper.js`)
Assists when selling cans at the Can Depo (`cmd=depo`). 
- **Total Value**: Displays the total monetary value of all your collected cans based on the current per-can price.

### 14. Recycling Bin Helper (`RecyclingBinHelper.js`)
Helper functionality for the Recycling Bin screen.
- **Quick Recycle Buttons**: Adds customizable quick-add amount buttons next to the native recycle input. Values can be added, removed, or changed dynamically via an inline configuration panel.

### 15. Backpack Helper (`BackpackHelper.js`)
Assists with inventory management when viewing the Backpack.
- **Drink Tooltips**: Hovering over alcoholic or mixed drinks will display their base stat gains and effects right in the tooltip.

### 16. Lockout Helper (`LockoutHelper.js`)
Helper functionality activated during the game's 12-hour resets (lockout periods).
- **Changelog Display**: While the game is locked for resetting, this feature prominently displays the most recent Hobo Helper changelog notes via an overlaid UI directly on the reset screen, providing reading material during the wait.

### 17. Display Helper (`DisplayHelper.js`)
A core helper that runs display improvement related functions.
- **Enable Improved Avatars**: Custom styled shapes and online indicators for avatars.
- **Enable the Fake Qwee**: Places a "The Fake" prefix label in front of all player links referencing ID 2924510.
- **Show Next Interesting Level**: Automatically displays the next prime level next to your current level on the UI.

### 18. Gang Loans Helper (`GangLoansHelper.js`)
A gang management tool that creates a specialized dashboard within the Gang Loans page (`cmd=gang2&do=loans`).
- **Saved Posts & Payments Panel**: Aggregates and displays all saved gang post repliers and recorded payments from the Message Board Helper into a single convenient panel, making it easy to action bulk loans or payments and track who has replied to recruitment or event threads.

### 19. Hitlist Helper (`HitlistHelper.js`)
A helper designed to operate on the main game Hitlist page (`cmd=battle&do=phlist`).
- **Highlight Online Players**: Scans your hitlist for opponents currently online and highlights their entire row green, avoiding the need to search for the small online icon.

### 20. Gang Hitlist Helper (`GangHitlistHelper.js`)
A helper designed to operate on the Gang Hitlist page (`cmd=gang&do=hitlist`).
- **Hitlist Page Tracker**: Remembers the currently selected paginated hitlist page number and highlights the selected page number in a larger, bold font with a yellow background.
- **Hitlist Mark Red**: Adds an interactive link to the "Options" column to manually mark individual hobos, turning their row red persistently across page reloads.

### 21. Soup Kitchen Helper (`SoupKitchenHelper.js`)
A helper designed to operate on the Soup Kitchen page (`cmd=soup_kitchen`).
- **Soup Line Predictor**: Displays your Hobo's exact age in days right alongside a handy wiki reference table to help you determine exactly which soup rewards correlate to which age ranges when waiting in the soup line.

### 22. Rats Helper (`RatsHelper.js`)
A new helper designed to operate on the Rats page (`cmd=rats`).
- **Life Progress Bar**: Automatically calculates and displays a colorful life remaining progress bar beneath each rat.
- **Experience Progress Bar**: Shows a small colored background bar over each rats experience td cell.
- **Action Buttons**: Restyles text action links as stylized UI buttons for improved usability.
- **Custom Upgrade Buttons UI**: Enhances the rat upgrade page with dedicated pill buttons and icons for permanent/standard upgrades.
- **Rat News Filter**: Provides an easy filter row for hiding or showing news related to specific rats.
- **Cheese Visuals**: Adds a small cheese emoji to cheese number cells.

### 23. Weapons Helper (`WeaponsHelper.js`)
A new helper designed to operate on the Weapons page (`cmd=wep`).
- **Highlight Equipped Items**: Automatically highlights weapons, armor, and rings that you currently have equipped in your inventory list.
- **Quick Equip/Unequip**: Converts item images into clickable links that will instantly equip or unequip the item based on its current state.

### 24. Gang Staff Helper (`GangStaffHelper.js`)
Helper designed to function on Gang-related pages (`cmd=gang`).
- **Gang Event Data Save**: Injects an admin-only dashboard specifically within the event stats for events like "Gangsters Sunday = Funday", dynamically tracking and storing custom event payments.
- **Member List Columns**: Exposes a completely configurable column selection UI right above the "list members" table so users aren't locked into the rigid pre-set columns. Fully integrated with LocalStorage and safely adapts between User and Staff column restrictions.
- **Format Mass Mails**: Formats the list of recipients on the mass mail reading page into an easy-to-read table with read/unread status filters and total counts.
- **Mass Mail Templates**: Adds a comprehensive templating system to the Gang Send Mass Mail page. Allows saving, updating, loading, deleting, exporting, and importing templates that store the 'Send To' grouping, Subject, and Body content. Includes support for dynamic `{date}` and `{fullDate}` insertion in the subject line.
- **Gang Armory Dashboard (`GangArmoryHelper.js`)**: Overhauls the Gang Armory interface (`cmd=gang&do=armory`) by grouping identical items by name and sorting dynamically by power stats. Includes a favorite items dashboard pinning priority gear to the top, and interactive buttons to hide selected clutter items permanently. Adds an Unbrand action next to Claim Back for players with permissions, and includes global Expand/Collapse/Toggle All capabilities.

### 25. Market Helper (`MarketHelper`)
- Converts plain-text inline "Buy" links and Market navigation headers into large, interactive button elements for an improved desktop/mobile marketplace experience.
- Cross-references the HoboWars wiki to dynamically inject highly-visible 40x40 item thumbnails natively into the Market listings for Weapons, Armor, and Cart Parts.
- Transforms the SGHM Market Watcher text feed into a structured, readable HTML table, with alternating rows, styled headers, and extracted values.

### 26. Drink Helpers
- [x] Automatically inject stat and effect data as tooltips to all drinks when hovering your mouse over them inside of your backpack and living area page.

### 27. Food Helpers
- [x] Food Menu Management: Add a "Mark as Crap" button to mark selected foods as "crap". Unchecked foods will be removed from the list.
- [x] Add a "Select Crap" button to automatically select all foods you have marked as crap, making it easy to throw them away.
- [x] Works both in the main Food page and within the Living Area Food tab.

### 28. Active List Helper (`ActiveListHelper.js`)
Helper functionality for the Active List page (`cmd=active`).
- **Interactive Alive/Dead Filter**: Adds pill-styled buttons allowing users to dynamically hide dead players or show everyone.
- **Attack Range Filter**: Automatically restricts the opponent list to players within your immediate attackable level range (± 200 levels).

---
*Note: We are constantly updating and tweaking these modules. If you encounter any bugs, please report them!*
### 29. Player Helper (\PlayerHelper.js\)
Provides enhanced functionality and specific shortcuts when viewing the \cmd=player\ profiles.
- **Copy Hoboname**: Embeds a clickable icon under the "Citizen Information" box that allows for quickly copying the player's formatted \[hoboname=ID]\ tag. Can be disabled in Settings.

### 30. Gang Board Staff Helper (`GangBoardStaffHelper.js`)
Helper available on Message Board threads exclusively designed for Gang Staff.
- **Save Repliers List**: Collects the names and IDs of everyone who has replied to a staff topic and saves it locally for future events, roll-calls, or loan administration.
- **Payment Distribution UI**: Adds an "Add Payment" capability to every single board reply allowing staff members to quickly define a scheduled payout for event attendees directly from the thread view. This directly exports to the Gang Loans Dashboard.

### Display Helpers
Helper available on Message Board threads exclusively designed for Gang Staff.
- **Save Repliers List**: Collects the names and IDs of everyone who has replied to a staff topic and saves it locally for future events, roll-calls, or loan administration.
- **Payment Distribution UI**: Adds an "Add Payment" capability to every single board reply allowing staff members to quickly define a scheduled payout for event attendees directly from the thread view. This directly exports to the Gang Loans Dashboard.

### Display Helpers
- **Improved Avatars**: Restyles user avatars to have rounded edges, distinctive borders (special styling for Donators), and custom pulsing online status indicators.
- **Fake Qwee**: Automatically prepends "The Fake" with a red shadow to any user link pointing to "The Fake Qwee" (ID `2924510`).
- **Jack Reacher**: Automatically prepends "Major" with a bright green shadow to any user link pointing to "Jack Reacher" (ID `107380`).
- **Widen Content Area**: Expands the historically narrow game content container to a customizable width (default 660px) for better readability on modern monitors.
- **Swipeable Topbar Menu**: Converts the crowded top navigation bar (Dirt Road, Recycling Bin, etc.) into a horizontally scrollable container, preventing off-screen clipping on mobile devices.
- **Battle Helper:** Adds a button to view a line graph of the fight inside a floating panel on the results page.
