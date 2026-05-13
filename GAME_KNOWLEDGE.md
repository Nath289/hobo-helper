# HoboWars Game Knowledge

This document contains a general knowledge base about the mechanics, layout, and structure of the game HoboWars. When new information about the game's mechanics or rules is discovered or provided by the user, it should be added here.

## General Information
- The game has various layouts. This project focuses strictly on **"The Future"** layout.
- The game uses `jqplot` for charting natively. To render graphs, you can load `/js/jqplot/jquery.jqplot.min.js` and plugins like `jqplot.barRenderer.min.js` if they are not currently loaded in the DOM. If your graph container is dynamically resizable via CSS `resize: both`, use a `ResizeObserver` along with `plot.replot({ resetAxes: false })` to seamlessly rescale the graph.
- Awakeness Regeneration: Donators regenerate 5 Awakeness every 10 minutes. Non-donators regenerate 5 Awakeness every 15 minutes.
- The UI often uses standard HTML tables (`<tr>`, `<td>`) structured around older design principles.
- Time in the game is often represented as "T" (e.g. Awake time), and resetting or gaining features is usually tied to specific server time intervals (00:00, 03:00, etc.).
- Offline HTML snapshots stored in the `html/` directory are grouped into specific functional subfolders (e.g., `living-area/`, `gang/`, `mb/`, `rats/`, `wiki/`). Always ensure recursive matching when searching them in powershell.
- When dynamically injecting standard `.img` icons into the topbar `.bmenu`, inline styles must apply `!important` keywords (e.g., `background-image: ... !important; background-size: contain !important;`) to resist override by native HoboWars responsive caching logic.
- On the message boards, `do=vpost` is the URL parameter for viewing a topic and its replies, while `do=edit` is the URL parameter for editing a specific post. Some staff or helper functionalities must distinguish between these to inject UI elements in the correct location (such as on the textarea when editing, or on the topic replies table when viewing).

## Rats
- Rat Life values usually tend to reach around 3000 days (though this is not an absolute mechanical maximum). Rat Age maxes out much lower (usually around 200). Graphs representing rat life vs age should be appropriately scaled together. When graphing history, stats should be keyed by `ratId` and `age`.

## Mines
- The `cmd=mines` area allows players to explore a grid and mine ores.
- Navigating the grid (using directional arrows) natively consumes 1T (unless you lack Awake).
- A page refresh that maintains position (e.g. `cmd=mines&move=nowhere`) does NOT consume grid movement T. 
- History navigation (Back/Forward browser buttons) does not execute a new server action, and the `PerformanceNavigation` API should be used to intercept and zero-out tracked stat deltas/T-used to prevent duplicate log counting.
- **Sidebox vs. Blasting `T used`:**
  - While navigating the grid (moving), the UI displays a sidebox (often inside a `<center>` tag containing text like `Mine Section 1`) that dynamically tracks the cumulative "T used:" for the entire session. By referencing this exact number directly from the page, you can get perfect synchronization with the game's actual server tracking without manually compiling deltas.
  - While inside the Blast/Canvas view (`cmd=mines&blast=...`), the sidebox is removed. In its place, the actual blast result string returns the cumulative stats explicitly across a single line: `T used: 16, Mine stat: 0.24, Ore found: 7 [2]`.
  - Scripts aggregating daily Mining data must prioritize reading the T value directly from the returned text of a blast result. If a blast hasn't just occurred, the script should fall back to grabbing the T value from the sidebox when moving.
- The Mines active display box aggregates total "T used" incrementally rather than logging delta per action, requiring scripts to manual compute action deltas to avoid inflating logs.

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
- **Vegetarianism:** A "one off" rat upgrade. It generally adds +1 Exp and +1 Life to non-meat foods. If the player possesses the **Rattoo** tattoo in their Living Area, the Vegetarianism bonus doubles to +2 Exp and +2 Life. Meat cannot be fed to a vegetarian rat. If a vegetarian rat only has meat in the trolley, the UI displays "Eww, meat!" as a list item instead of a feed link.
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
- When alive, the "Alive Time" text can contain several dynamic formats including singular and plural variations: `Alive: 01 hr 12 min 05 sec`, `Alive: 01 min 14 sec`, `Alive: 27 mins 30 secs`, `Alive: 03 secs`, or `Alive: 05 min 25 sec`. Parsing it requires case-insensitive regex accounting for the optional 's' and alternate spellings (`/(\d+)\s*(?:hr|hour)s?/i`, `/(\d+)\s*mins?/i`, `/(\d+)\s*secs?/i`).

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
- Just like the Backpack, the Food tab within the Living Area is loaded dynamically via AJAX when the in-page tab link (`rel='food'`) is clicked. Wait for DOM mutations or an explicitly attached click event on the tab when interacting with Living Area food inventories.

- **Bartender Guide:** This game UI is accessed via `?cmd=backpack&use=3`. The guide displays a list of possible drinks that can be mixed and is injected natively into the backpack tab or area.

### Skills Page (cmd=skills)
- **Layout**: Contains a list of saved Skill Sets and several un-styled links for removing and unequipping skills.
- **Forms**: The page contains multiple forms side-by-side, such as the Set Order form (input[name=BAT]) and the Save As Skill Set form (input[name=save_set]). Be cautious when manipulating these DOM elements to preserve their nested form boundaries.

## Explore
- The Explore City page (`cmd=explore`) has a lobby and an active move page (`cmd=explore&do=move`).
- The player's current map coordinates can be scraped either from the yellow (`background-color: yellow`) `<td>` tile within the `#miniMap` table, or extracted from the URL query parameters (`x` and `y`) of the directional movement links in the main view.

- Exploring can yield items like the Arena Pass. The success text is `You found the Arena Pass.`

## HTML & Form Quirk
- **Implicit Submit Form Wrappers:** HoboWars wraps many main content areas (such as the main tables on the Northern Fence Hall of Fame) inside overarching `<form>` tags naturally. Therefore, any custom injected `<button>` elements run the risk of defaulting to `type="submit"` and triggering unwanted full page refreshes with query manipulation. Always explicitly set `type="button"` on injected `<button>`'s or use `<a href="#">` with `e.preventDefault()`.

## Mines
- When exploring the game's mining grid, if you move around and one of the black squares in the grid is next to you, you can mine it. When that happens, an 'X' appears on the moving grid, containing a hyperlink with a `blast` query parameter indicating direction (e.g., `cmd=mines&blast=west`).
- Clicking the 'X' changes the view to the blast screen (`cmd=mines&blast=west`). This screen contains an image display of the grid section where you want to mine and allows you to select specific locations on that grid to blast.
- Various blast statuses exist upon submission, including "Suddenly the wall crumbles to reveal a path forward!" and sweet spots (e.g., "Your Gold Pickaxe hit a sweet spot!"). Ores and shards obtained during these events are explicitly written in the DOM with the prefix "You get the " (e.g. `You get the <b>Orange Ore</b>` or `You get the Hobalt Shard`). The server also returns a "T used:" string summarizing the interaction's cost and stats found (e.g. `T used: 28, Mine stat: 0.38, Ore found: 13 [2]`) which should be parsed directly to record true costs rather than assuming static values. Note: The `[2]` in `Ore found` represents the number of Shards found. Elements containing event text do not always carry `align="center"` attributes, parsing the overarching `.content-area` outerHTML is more resilient.
- When calculating overall ore gathering efficiency, Shards hold a heavier weight and count as 3 Ores equivalent.

## Mines Helper (Trading Post Formatting)
- Because `MinesHelper` fully replaces the layout of the `exc_ore_show_` displays, any logic that intends to read stock item availability natively from the DOM (e.g., `formatTrades` scanning `oreStockMap`) must execute `BEFORE` `formatOres` aggressively strips and re-assembles the table chunks.

## Known Issues
- If you use a macro, you will be heavily punished.
- Standard macro punishment generally consists of jail time and massive stat deduction.
- While Mining, players can occasionally save other players who are "trapped back there". This yields ores and mining experience, and produces HTML text containing an ID'd link to the saved player's profile.

- On the \cmd=mines&blast=...\ screen, click coordinates are recorded in the hidden input \#pass_coords\ string using the format \x,y,tool_id,x2,y2,tool_id2\ where \x\ and \y\ are the respective click coordinates.

- **Item Expiration:** Specific game elements have variable timers (like limited tattoo durations) visible in tooltips formatted strictly as `"(X days left)"` or `"(1 day left)"`.
- **Mine Trading Stats:** The trading post implicitly confirms total daily stats under a summary row reading `"Net stat gain for trade:"` and `"Stat Trades today:"`. These values can be extracted for display on other pages.

## Layout Specifics
- The game layout uses a grid system for positioning elements, with specific classes indicating row and column spans (e.g., `class="rowspan-2 colspan-3"`).
- Certain layout elements like the top navigation bar or side panels may not have explicit closing tags in the HTML. Use caution when parsing or manipulating these sections to avoid leaving orphaned elements.
- In the Living Area, the player's avatar/tattoo is located within `#myhobo center`.
- Also in the Living Area, the "List Hobos Referred" link is contained within a `<ul>` list, which can be useful as an anchor for injecting UI horizontally aligned with the layout.
