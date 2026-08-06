Done. Here's what I built.

## Weekender

A four-section trip-planning app for a group of friends, running entirely on sample data.

**Explore** — 10 real European weekend destinations (Lisbon, Prague, Chamonix, Kraków, Copenhagen, Lake Bled, Saxon Switzerland, Rügen, San Sebastián, Edinburgh), each with an all-in per-person price, door-to-door travel time, late-October weather, and live vote standing. Filter by budget, travel time, vibe or search; sort by match, votes, price, travel or name.

**Trip setup** — departure city (Berlin/Munich/Hamburg), Fri–Sun or Thu–Sun, and who's actually coming. The budget model is real: the group books *whole* places, so the per-head cost falls as more people join and steps up when the party outgrows a unit. Each destination has multiple travel options per origin (train vs. flight vs. coach, with CO₂), and picking one recalculates the budget and travel time everywhere.

**Compare** — up to three side by side across cost split, journey, stay, weather, feel and votes, with the best value in each row flagged. Sticky label column, horizontal scroll on mobile.

**Vote** — approval voting (yes = 2, maybe = 1) seeded with five friends mid-poll, so the tally moves the moment you vote. Ballot progress, leaderboard, full member × destination grid, and lock-in with a confetti moment.

**Plan** — the winning weekend hour by hour (three days, ~13 stops each, all 10 destinations written out), with per-day spend, cost breakdown, shared-kitty suggestion, an assigned prep checklist and a packing list.

Design notes: no image assets — the postcard artwork is seven procedural SVG scene generators tinted per destination. Custom Tailwind v4 theme with dark mode driven purely by CSS-variable overrides (plus a pre-paint script so it never flashes). Bottom tab bar on mobile, sidebar filters on desktop. Toasts with undo on every vote, loading skeletons, an empty state for over-filtering, focus-trapped dialogs, `/` to search, reduced-motion support, and full `localStorage` persistence with a reset.

## Checks

- `npm run check` (typecheck + build) — passes clean
- `vite preview` — verified serving the built app (HTML/CSS/JS all 200)
- Since there's no browser tooling in this environment, I additionally did a temporary SSR render of every view, all 10 destinations, both plan variants and all detail panels to catch runtime errors — clean, then removed the scratch files
- Spot-verified the emitted CSS actually contains the custom-theme, arbitrary-value and gradient utilities used

One thing worth flagging: prices, travel times and weather are hand-written realistic estimates, not live quotes — the footer and README say so explicitly. Changes are left uncommitted.
