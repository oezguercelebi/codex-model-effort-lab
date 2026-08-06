Done. **Weekender** is built and passing all checks.

## What I built

A client-only React + Tailwind SPA where a group of five friends plans a September weekend trip from Berlin, with realistic sample data for six destinations (Prague, Barcelona, Copenhagen, Amsterdam, Kraków, Rügen Island) — no backend or sign-in needed. Three sections, switchable via a top nav on desktop and a fixed bottom tab bar on mobile:

- **Explore** — destination cards with per-person budget, travel time and mode, September weather, vibe tags, a budget-vs-priciest bar, and voter avatars. Cards can be sorted (votes / cheapest / shortest travel) and filtered by vibe, with an empty state when nothing matches. Tapping a card opens a detail modal with a segmented budget breakdown (travel/stay/food/activities), accommodation, highlights, and vote / preview-itinerary actions. It closes on Escape or backdrop click and locks background scroll.
- **Votes** — a live leaderboard with animated vote bars, rank badges, and a crown on the leader (with explicit tie messaging), plus a sidebar showing each friend's votes and a comment. Four friends have pre-cast votes; you get two votes of your own, toggleable anywhere in the app, persisted to localStorage (with validation on load), and resettable. A "votes left" pill and pending-dot on the tab nudge you to vote.
- **Itinerary** — a full Friday–Sunday timeline for the current group winner (crowned automatically from the tally), with per-item times, notes, and costs, a per-day spend footer, day tabs, and a picker to preview any other destination's plan.

Code lives in `src/data.ts` (types + sample data) and five components under `src/components/`.

## Checks

- `npm run check` (tsc --noEmit + `vite build`) — passes cleanly.
- Served the production build via `vite preview` and confirmed the page and bundle load with HTTP 200. You can preview it locally with `npm run dev` or `npm run build && npx vite preview`.
