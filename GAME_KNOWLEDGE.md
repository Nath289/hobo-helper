# HoboWars Game Knowledge

This document contains a general knowledge base about the mechanics, layout, and structure of the game HoboWars. When new information about the game's mechanics or rules is discovered or provided by the user, it should be added here.

## General Information
- The game has various layouts. This project focuses strictly on **"The Future"** layout.
- The UI often uses standard HTML tables (`<tr>`, `<td>`) structured around older design principles.
- Time in the game is often represented as "T" (e.g. Awake time), and resetting or gaining features is usually tied to specific server time intervals (00:00, 03:00, etc.).

## Rats
- Rats help the user fight in battles and find items (seafood, treasure, etc.).
- Rats have stats like Level, Experience, Age, Life, Meals, Speed, Attack, Defense, and Cheese.
- **Meals:** A rat gains 1 Meal every 3 Hours (max 10 meals). Meals are required to feed a rat.
- **Feeding:** Feeding a rat increases its Life and Experience. However, the exact Exp and Life gained vary wildly depending on the player's current "Awake" time (measured in `T`). Generally, higher Awake time yields more Exp but less Life gain, with some exceptions like *Fruit by the Furlong* which actually decreases Life.
- **Vegetarianism:** Some rats can have a "Vegetarianism" upgrade. This restricts them from eating meat-based foods (which will show an "Eww, meat!" tooltip). This upgrade generally adds extra +1 Exp and +1 Life to non-meat foods.
- When a rat needs food, a "Feed" option appears in their action links.
- Rats earn 1 Cheese every level, which is used (along with cash) to buy permanent upgrades for the rat.
- Rat UI usually relies on nested tables. Manipulating the DOM here requires care not to unbalance table rows when action buttons (like "Feed") conditionally appear.

## Gangs
- Gang members have stats like Level, Life, main stats, battle stats, and other stats.
- Not all columns/stats are visible to all users. Depending on permission levels (e.g., normal users vs. staff), certain links like "Battle Stats" or "Other Stats" may simply not exist in the DOM. Any modifications to gang pages must gracefully handle missing columns/headers.
- Features like Sunday Funday allow configuring multi-tier payouts based on points.

## Inventory & Items
- The **Trolley** is an inventory container that can hold up to exactly **25 items** at maximum capacity. When building UI for Trolley items, keep in mind lists can be comfortably large up to this limit.
- **The Ripaparter** is a machine located in Slugworth's Evil Fortress where you can toss items.
- Duplicate items are often listed individually in the DOM (e.g., 5 single links for 5 "Smart Bread"). Helpers should group these visually to keep the UI clean.

## Mass Mails / Messaging
- The game has mass mail functionality where standard layouts display sent messages with a plaintext list of all recipients and whether they have read the mail.
- Message Board (MB) posts are stored in specific span containers (`<span id="post-content-...">`).

## Automation Rules
- Automation of game activities (Macros, Refreshers, Autonomous Scripts) is strictly forbidden by the game rules. Always use manual user interaction like buttons instead of fully automated tasks. Never create a feature that clicks buttons or refreshes pages on a timer without direct user input.
