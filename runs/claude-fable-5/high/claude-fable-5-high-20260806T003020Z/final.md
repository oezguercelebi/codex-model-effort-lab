Done. **Weekender** is built and verified — `npm run check` (typecheck + production build) passes, and `vite preview` serves the app correctly.

## What I built

A single-page trip-planning app for a group of five friends choosing a September weekend away from Berlin, with three views and no backend — everything runs on realistic sample data plus `localStorage` persistence.

**Explore** — Six destination cards (Lisbon, Barcelona, Prague, Copenhagen, Amsterdam, Interlaken), each with a gradient hero, weather, per-person budget, travel time and mode, and vibe tags. You can filter by vibe (with a proper empty state), sort by votes/price/travel time, and cast up to 3 heart-votes. Four friends have pre-seeded votes, so the leaderboard is live from the first visit; a votes-remaining tracker explains the rules.

**Compare** — A side-by-side matrix (horizontally scrollable with a sticky label column on mobile) covering vote counts, full budget breakdowns, travel details, expected weather, and 5-dot ratings for food, nightlife, culture, and outdoors. The best value in each row gets a green highlight with a medal.

**Results** — Live standings with vote bars and voter avatars, a "who's voted" panel with each friend's comment, and a tie-breaker note (ties resolve to the cheaper trip). Once you lock in your votes, the winner is revealed with an animated hero card, a full Friday-to-Sunday hour-by-hour itinerary (written individually for all six destinations, so any winner has a real plan), and an interactive "Before you go" checklist. You can reopen voting or reset the whole demo.

Engineering details: your votes, lock status, and checklist progress persist across reloads (with validation and private-mode safety); the modal supports Escape/backdrop close and body-scroll locking; navigation is a header pill bar on desktop and a fixed bottom tab bar on mobile with a "needs your vote" badge; animations respect `prefers-reduced-motion`; vote buttons expose `aria-pressed` and disabled-state tooltips.

## Checks run

- `npm run check` — typecheck + `vite build` both pass.
- SSR smoke tests: rendered all three views (Results in both open and locked states) and the detail modal with real vote data to catch runtime errors the type checker can't see — all render correctly.
- `vite preview` — serves the built app with the correct title and assets. Run `npm run dev` or `npm run build && npx vite preview` to explore it.
