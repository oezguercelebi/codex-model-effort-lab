I'll start by inspecting the repository and installed dependencies so Weekender can be built as a finished local app without new packages.The starter is a blank Vite screen, so I’m building Weekender as a local trip board: sample destinations, shared costs, votes, and an itinerary for whatever the group picks.Weekender is a local trip board for five friends leaving Austin on October 16–18, 2026. They can compare five real weekends, see how the budget splits, vote, and open an itinerary for whichever place is ahead.

- The board shows who is coming, who has voted, and which place is ahead. Sam starts without a vote. Switch who you are voting as, mark someone as sitting out, and the tally and per-person price update.
- Each place breaks down airfare, shared gas or a rental car, lodging, food, and activities. Lodging and the shared ride divide across the people who are coming.
- You can compare two or three places, filter by budget, travel time, and character, and open a day-by-day plan for the leader. A tie lets you read either itinerary. Votes and filters stay in this browser.

`npm run check` passed (typecheck and production build). Preview it with `npm run dev`.The preview server and the headless browser used to check Weekender were stopped after that pass. The app itself is unchanged: `npm run check` succeeded, and you can open it again with `npm run dev`.
