Built **Weekender** — a three-part app (Explore → Vote → Plan) over 8 sample European destinations, 6 origin cities, and a group of 6 friends.

**What it does**

- **Explore** — destination cards with per-person cost, travel time, vibe tags, live vote tallies, and inline voting. Search, vibe filters, max-travel-time filters, a "within budget" toggle, and four sort modes. Pick up to 3 destinations for a side-by-side comparison table that highlights the best value in each row. A detail sheet gives each place four tabs: overview, an itemised budget breakdown, the itinerary, and per-person votes.
- **Vote** — ranked leaderboard with weighted voting (in +2, maybe +1, pass −2) normalised to a consensus percentage, a nudge listing what you haven't voted on yet, and a "lock this in" action.
- **Plan** — the locked destination (or the front-runner, clearly banner-flagged as not final) with a day-by-day timeline, cost split for the whole group, who's in and who it's over budget for, a persisted packing checklist, and logistics.

**Engineering notes**

Costs and travel times are derived, not hardcoded: destinations and origins carry coordinates, and `src/lib/engine.ts` computes great-circle distance, picks a plausible mode (drive/rail/fly), and builds a budget from nightly/food/activity rates against the chosen trip length and lodging tier. So changing origin, dates, group size, or lodging tier recalculates every card. State persists to localStorage with a reset button. Class-based dark mode, responsive layout with a mobile bottom nav, keyboard/Escape-dismissable modals, ARIA labelling on controls, empty states, and a `prefers-reduced-motion` guard. Destination artwork is generated SVG, since no network is available.

**Checks run**

- `npm run check` (typecheck + build) passes; clean rebuild verified.
- Built CSS confirmed to use class-based dark mode (97 `.dark` selectors, zero `prefers-color-scheme` fallbacks).
- `vite preview` and `vite dev` both boot and serve 200s.
- A throwaway server-render harness (bundled via esbuild, removed afterwards) rendered all three views without errors and validated 432 setting combinations — every origin × nights × lodging × destination — for finite, self-consistent totals, sane travel durations, correct itinerary-length slicing, and a calibrated consensus scale.

One judgment call worth flagging: with the default €550 cap, 3 of 8 destinations land over budget and the expensive ones exceed most friends' personal ceilings. That's deliberate — it's what makes the over-budget warnings and the hostel/nights trade-offs visible — but it's tuned data, not a neutral default.
