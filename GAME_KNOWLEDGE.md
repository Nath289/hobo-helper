# HoboWars Game Knowledge

This document contains a general knowledge base about the mechanics, layout, and structure of the game HoboWars. When new information about the game's mechanics or rules is discovered or provided by the user, it should be added here.

## General Information
- The game has various layouts. This project focuses strictly on **"The Future"** layout.
- The UI often uses standard HTML tables (`<tr>`, `<td>`) structured around older design principles.
- Time in the game is often represented as "T" (e.g. Awake time), and resetting or gaining features is usually tied to specific server time intervals (00:00, 03:00, etc.).
- Offline HTML snapshots stored in the `html/` directory are grouped into specific functional subfolders (e.g., `living-area/`, `gang/`, `mb/`, `rats/`, `wiki/`). Always ensure recursive matching when searching them in powershell.
- When dynamically injecting standard `.img` icons into the topbar `.bmenu`, inline styles must apply `!important` keywords (e.g., `background-image: ... !important; background-size: contain !important;`) to resist override by native HoboWars responsive caching logic.

## Rats
- Rats help the user fight in battles and find items (seafood, treasure, etc.).
- Rats have stats like Level, Experience, Age, Life, Meals, Speed, Attack, Defense, and Cheese.
- **Meals & Capacity:** Standard rats gain 1 meal every 3 hours (8 meals/day, max 10). **Two-Headed Rats** get an extra meal every 6 hours (12 meals/day, max 20). If a rat is a **Two-Headed Sub-rat** (has the trait as a secondary from merging like `Pincher Rat / Two Headed Rat`), it gets an extra meal every 12 hours (10 meals/day, max 20).
- **Life Decay & Extrapolation:** A rat's Age increases by 1 each day at midnight server time. A rat's Life decays by its current Age every day at noon server time. Because the age increment is linear, life decay is compounding, meaning rats cannot live infinitely and will eventually die no matter how much they are fed.
- **Leveling up:** To level up, a rat needs progressively more Exp per level. The formula for the required Exp to reach the next level is `30 + ((currentLevel - 1) * 3)`. Leveling up grants a base life boost (usually 60).
- **Feeding & Awake (T) Dependency:** Feeding a rat increases its Life and Experience based on the player's current "Awake" time (measured in T). Bonus brackets are:
  - 0T: +1 exp / +11 life
  - 1T: +3 exp / +10 life
  - 2-4T: +5 exp / +9 life
  - 5-9T: +7 exp / +8 life
  - 10-15T: +9 exp / +7 life
  - 16-25T: +11 exp / +6 life
  - 26-49T: +13 exp / +5 life
  - 50-99T: +17 exp / +3 life
  - 100T: +21 exp / +1 life
  *Exceptions:* Fruit by the Furlong (+17 exp / -7 life), Kit Rat Bar (+10 exp / +8 life). *Note: Kit Rat Bars are rare Halloween Event items found by dumping Trick-or-Treat Baskets into Trollys or discarded in Improved Dumpsters. They grant 20T and the Chocorat status effect.*
- **Vegetarianism:** A "one off" rat upgrade. It generally adds +1 Exp and +1 Life to non-meat foods. If the player possesses the **Rattoo** tattoo in their Living Area, the Vegetarianism bonus doubles to +2 Exp and +2 Life. Meat cannot be fed to a vegetarian rat.
- **Common Feeding Regimes:** For easily accessible foods, players typically use one of two approaches:
  - **Fighter's Lunches → Apples:** Feeds high-Exp Fighter's Lunches early to quickly level the rat up so it becomes useful in battles and item finding sooner, then switches to Apples (high-Life, low-T food) later to sustain its lifespan against compounding age decay.
  - **Apples → Fighter's Lunches:** Builds a massive life buffer early on with Apples, then switches to Fighter's Lunches later for experience.
- When a rat needs food, a "Feed" option appears in their action links.
- Rats earn 1 Cheese every level, which is used (along with cash) to buy permanent upgrades for the rat.
- **Cheese Upgrades:** 
  - **Meal Boost**: Grants 3 extra meals immediately.
  - **Life Boost**: Increases life value as if you gained a level (e.g., +110 life for a gumshoe rat).
  - Cheese upgrades scale in cost: the cheese cost increases by 1 for every 5 levels purchased in that specific upgrade.
- Permanent rat upgrades (like Buddhism, Vegetarianism, Materialism) disappear completely from the upgrade list once purchased. If they are unaffordable due to insufficient cheese or cash, their clickable purchase links are removed and replaced with a grayed-out strikethrough, but the text remains visible.
- Rat UI usually relies on nested tables. Manipulating the DOM here requires care not to unbalance table rows when action buttons (like "Feed") conditionally appear.

### The Cheese Economy (Upgrades)
When purchasing upgrades for your rat (Vegetarian, Life Boost, Meal Boost), keep in mind the scaling cost mechanic:
1. Every time a rat levels up, it generates **1 Cheese**.
2. Upgrade costs scale based on the number of times you've purchased that specific upgrade type. They cost 1 Cheese for levels 1-5, **2 Cheese for levels 6-10**, 3 Cheese for levels 11-15, etc.

**Optimal Upgrade Strategy (Meal Boost vs Life Boost):**
* **Meal Boosts (Levels 1-5):** These cost 1 Cheese and grant 3 meals. If you feed the rat Fighter's Lunches (16 EXP * 3 = 48 EXP), this is usually enough to gain at least 1 level in the early game. Gaining a level refunds the 1 Cheese cost, making this an "infinite loop" of free stats until the EXP requirement becomes too steep.
* **The Cutoff (Meal Boost Level 6):** Once Meal Boost costs 2 Cheese, you would need to gain **2 levels** from those 3 meals (48 EXP) to break even on Cheese. Because EXP requirements scale up constantly, 48 EXP will not cover 2 levels. At this exact point, you begin losing Cheese rapidly.
* **Switch to Life Boost:** As soon as Meal Boost hits 2 Cheese, stop buying it. Switch entirely to purchasing **Life Boosts** (which grants a flat influx of Life equivalent to a level up, e.g., 110 Life for a Gumshoe) starting at 1 Cheese cost.

## Gangs
- Gang members have stats like Level, Life, main stats, battle stats, and other stats.
- Not all columns/stats are visible to all users. Depending on permission levels (e.g., normal users vs. staff), certain links like "Battle Stats" or "Other Stats" may simply not exist in the DOM. Any modifications to gang pages must gracefully handle missing columns/headers.
- Features like Sunday Funday allow configuring multi-tier payouts based on points.
- **Staff Detection:** A reliable way to check if a user is "Gang Staff" is the presence of the "Manage Loans" link (`a[href*="cmd=gang2&do=loans"]`) in the DOM for Gang pages, or top-level message board ops `a[title="Toggle Lock"]` or `a[title="Delete"]` in the `#topOps` element on a forum thread.
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

## Navigation & URLs
- The Living Area (main page) does not use a `cmd=` parameter in its URL (it is just `game.php?sr=...`). This must be handled by checking for an empty `cmd` parameter (`cmd === ''`).
- There are two distinct Backpack links: The top navigation bar image link (`cmd=backpack`) which triggers a full page load, and the in-page tab link in the Living Area (`rel='backpack'`) which loads the backpack content via AJAX.
