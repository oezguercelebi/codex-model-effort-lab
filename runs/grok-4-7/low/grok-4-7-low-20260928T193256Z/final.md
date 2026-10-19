I'll start by inspecting the repo and installed dependencies so Weekender can be built as a finished local app.The starter is a Vite + React + Tailwind app. I’ll turn it into a self-contained Weekender: sample trip data, voting, budgets, and an itinerary that works on desktop and mobile.**Weekender** is a local trip planner for six friends leaving Brooklyn for the weekend of October 9–11. It compares six destinations on budget, travel time, and vibe, lets you vote, and builds an itinerary for the leader (or either side of a tie).

- The shortlist shows per-person and group costs, door-to-door time, and who already voted. You can search, filter, sort, and compare up to three places.
- Opening a destination shows the cost breakdown, how you get there, a Friday–Sunday plan, and a vote button.
- The itinerary view shows the tally, a packing checklist saved in the browser, and the winning plan.
- Sample votes are already in place. Your vote and checklist stay in local storage, so there is no sign-in.

`npm run check` passed: TypeScript is clean and the production build succeeded. I could not click through the UI in a browser from this session. Preview it with `npm run dev`.
