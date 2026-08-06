I built **Weekender** — a group weekend-trip planner across four screens, using only the pre-installed deps.

## What's there

**Explore** — 8 realistic weekends out of NYC (Hudson Valley → Charleston), each with a fit score, per-person price, door-to-door time and inline voting. Filters for budget, one-way travel time, vibe and search; five sort orders; a live "where it stands" rail; skeleton loading; and a real empty state when nothing clears the bar.

**Compare** — up to three side by side over ~12 rows (cost stack, travel, weather, walkability, who it suits, crew standing, gotchas) with `cheapest` / `fastest` / `best` markers, sticky label column, horizontal scroll on mobile.

**Vote** — Love it (+2) / Up for it (+1) / Pass (−1). Live standings with per-destination vote-mix bars, crew ballot progress, a focused **Quick Vote** flow, and a genuine tie in the seed data (Hudson Valley and Portland both on 7) so your ballot actually decides it. "Lock it in" freezes the winner.

**The plan** — the locked (or leading) destination's full Fri–Sun itinerary: day tabs, costed timeline, swappable activities, booking checklist, packing list, and a budget roll-up that reconciles planned spend against the food-and-fun line.

## Engineering notes

- **Everything recalculates.** Lodging splits across the group, so the travellers slider moves the per-person price — outgrow the listing and an extra room is added. Switching drive/train/fly on a destination re-prices the whole weekend.
- **Artwork is generated SVG** — five scene types (coast, mountains, city, forest, harbor) with a seeded PRNG and per-destination palettes. No image assets, no external requests.
- **Chart colour** follows the validated categorical palette; stacked segments carry a 2px surface gap and are all direct-labelled, and the vote mix uses the blue↔red diverging pair with a legend.
- State lives in a reducer + context, persists to `localStorage`, syncs the view to the URL hash. Toasts with undo, focus-trapped sheets with Escape and focus restore, `aria-pressed`/`aria-current` throughout, reduced-motion honoured, mobile bottom nav with safe-area padding.

## Checks run

- `npm run check` (typecheck + build) — passes; `npx tsc --noUnusedLocals --noUnusedParameters` clean.
- A logic harness over the data layer: budgets, fit scores, standings, filter counts, and itinerary integrity (no duplicate ids, every destination has a plan, planned spend ≤ budget for all 8).
- Server-rendered every view in every state as a smoke test — fresh, filtered, zero-results, compare×3, voting tied/complete/locked, plan leading/locked/3-night, and the detail sheet. That's what caught the one real bug: locking a non-leading destination left the vote header still promoting the leader. Fixed — a locked pick now always heads the page.
- `npx vite preview` serves the production build (note: port 4173 was already taken by an unrelated server, so I verified on 5199).
