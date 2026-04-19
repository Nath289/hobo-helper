# HoboWars Game Knowledge

This document contains a general knowledge base about the mechanics, layout, and structure of the game HoboWars. When new information about the game's mechanics or rules is discovered or provided by the user, it should be added here.

## General Information
- The game has various layouts. This project focuses strictly on **"The Future"** layout.
- The UI often uses standard HTML tables (`<tr>`, `<td>`) structured around older design principles.
- Time in the game is often represented as "T" (e.g. Awake time), and resetting or gaining features is usually tied to specific server time intervals (00:00, 03:00, etc.).
- Offline HTML snapshots stored in the `html/` directory are grouped into specific functional subfolders (e.g., `living-area/`, `gang/`, `mb/`, `rats/`, `wiki/`). Always ensure recursive matching when searching them in powershell.

## Rats
- Rats help the user fight in battles and find items (seafood, treasure, etc.).
- Rats have stats like Level, Experience, Age, Life, Meals, Speed, Attack, Defense, and Cheese.
- **Meals:** A rat gains 1 Meal every 3 Hours (max 10 meals). Meals are required to feed a rat.
- **Feeding:** Feeding a rat increases its Life and Experience. However, the exact Exp and Life gained vary wildly depending on the player's current "Awake" time (measured in `T`). Generally, higher Awake time yields more Exp but less Life gain, with some exceptions like *Fruit by the Furlong* which actually decreases Life.
- **Vegetarianism:** Some rats can have a "Vegetarianism" upgrade. This restricts them from eating meat-based foods (which will show an "Eww, meat!" tooltip). This upgrade generally adds extra +1 Exp and +1 Life to non-meat foods.
- When a rat needs food, a "Feed" option appears in their action links.
- Rats earn 1 Cheese every level, which is used (along with cash) to buy permanent upgrades for the rat.
- Permanent rat upgrades (like Buddhism, Vegetarianism, Materialism) disappear completely from the upgrade list once purchased. If they are unaffordable due to insufficient cheese or cash, their clickable purchase links are removed and replaced with a grayed-out strikethrough, but the text remains visible.
- Rat UI usually relies on nested tables. Manipulating the DOM here requires care not to unbalance table rows when action buttons (like "Feed") conditionally appear.

## Gangs
- Gang members have stats like Level, Life, main stats, battle stats, and other stats.
- Not all columns/stats are visible to all users. Depending on permission levels (e.g., normal users vs. staff), certain links like "Battle Stats" or "Other Stats" may simply not exist in the DOM. Any modifications to gang pages must gracefully handle missing columns/headers.
- Features like Sunday Funday allow configuring multi-tier payouts based on points.
- **Staff Detection:** A reliable way to check if a user is "Gang Staff" is the presence of the "Manage Loans" link (`a[href*="cmd=gang2&do=loans"]`) in the DOM.
- **Current vs Last Happenings:** Event stats (like "Gangsters Sunday = Funday") lack semantic classes or IDs. The text headers (e.g., `<u>Current Gang Happening Stats:</u>` or `<u>Last Gang Happening Stats:</u>`) must be located first, then the immediate sibling `<table>` containing the "Hobo" and "Score" headers must be traversed to extract scores.
- **Table Row Inconsistencies:** The "Last Happenings" table usually color-codes member rows (`bgcolor="#F3F3F3"` or `#DCDCDC`), but the "Current Happenings" table lacks these entirely. Querying rows dynamically requires checking the text content rather than relying on CSS or `bgcolor`.
- **Gang Hitlist Table:** The paginated gang hitlist (`cmd=gang&do=hitlist`) doesn't have an easily targetable ID; it's a generic table where rows typically start with `Player` and end with `Options`. To adjust styling dynamically across lines with interactive action text elements like `[Attack]` or `[Mark]`, manipulating specific table cells without forcing whitespace breaks is necessary to keep row alignment consistent.

## Inventory & Items
- The **Trolley** is an inventory container that can hold up to exactly **25 items** at maximum capacity. When building UI for Trolley items, keep in mind lists can be comfortably large up to this limit.
- **The Ripaparter** is a machine located in Slugworth's Evil Fortress where you can toss items.
- Duplicate items are often listed individually in the DOM (e.g., 5 single links for 5 "Smart Bread"). Helpers should group these visually to keep the UI clean.

## Mass Mails / Messaging
- The game has mass mail functionality where standard layouts display sent messages with a plaintext list of all recipients and whether they have read the mail.
- Message Board (MB) posts are stored in specific span containers (`<span id="post-content-...">`).
- **Gang Mass Mail Form**: When composing a gang mass mail (`cmd=gang2&do=mail`), the form inputs use specific names (`name="send_type"` for the recipient group radio buttons, `name="subject"` for the subject line, and `name="msg"` for the message body), which differ from standard mail input names (`Mgroup`, `Subject`, `Body`).

## UI & Topbar Elements
- The game's main top navigation bar uses a specific list structure (`<div class="topbar-menu"><ul><li><a href="...">...</a></li></ul></div>`). Injected topbar elements should match the `<li><a href="#" style="cursor: default;">Text</a></li>` pattern to inherit native spacing and styles properly.

## Player State & Alive Time
- The "Alive" state of a player is represented in the global navigation panel (`<span id="lifeValue">`).
- When a player is dead, the element's text simply says `"0%"`, not "Dead".
- When alive, the "Alive Time" text can contain several dynamic formats including singular and plural variations: `Alive: 01 min 14 sec`, `Alive: 27 mins 30 secs`, `Alive: 03 secs`, or `Alive: 05 min 25 sec`. Parsing it requires case-insensitive regex accounting for the optional 's' (`/(\d+)\s*mins?/i`, `/(\d+)\s*secs?/i`).

## Automation Rules
- Automation of game activities (Macros, Refreshers, Autonomous Scripts) is strictly forbidden by the game rules. Always use manual user interaction like buttons instead of fully automated tasks. Never create a feature that clicks buttons or refreshes pages on a timer without direct user input.
- Message Board side panels displaying the user ID and avatar are contained within `<td width="140" bgcolor="#EEEEEE">`

- Player profile pages (cmd=player) contain the user details under a bolded 'Citizen Information:' text section.

## Food & Consumption
- The "Consume" links in the native cmd=food form are originally simple text nodes surrounded by square brackets ([<a href="...">Consume</a>]) and separated by <br> tags rather than structured lists or tables. When reformatting this list, you must manually iterate through textual siblings to clear these brackets and line breaks.

## Respect Mechanics
- Respect rank thresholds scale from 0 to 15 (max starting at 10,000,000 respect). The rank names differ depending on whether respect is positive (e.g. `Preacher`) or negative (e.g. `Murderer`).
- Dispay in Living Area includes the title and number inside parentheses e.g. `Preacher (1,216,971)`. It can also have negative numbers that have the same magnitude but distinct titles and a red `#FF1100` color, whereas positive numbers use `#22A100`.
