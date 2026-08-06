Done. **Weekender is built, checked, and previewable** — `npm run check` passes on the final code, and I verified the running app in headless Chrome across desktop, true-390px mobile, and both overlays.

## What I built

A single-page React + TypeScript + Tailwind 4 app (no new packages) where six friends from Berlin pick a Sep 18–20 trip from six sample destinations (Lisbon, Prague, Copenhagen, Rügen, Garmisch, Barcelona), each with per-person budget breakdowns, travel options, September weather, highlights, a stay, and a full 3-day itinerary.

- **Explore** — destination cards with hand-drawn inline-SVG travel-poster art (no external images), vibe filters, sorting (group favorites / cheapest / quickest / warmest), leader badges, and one-tap voting. A compare mode lets you select up to three destinations for a **side-by-side table** where the best value per row gets a crown.
- **Detail modal** — stat tiles, a stacked budget bar with value-labeled legend, "fits 4 of 6 budgets" signal, travel options with a "fastest" badge, highlights, and the draft weekend plan.
- **Votes** — approval voting with seeded ballots that start as a deliberate **Lisbon/Prague 3–3 dead heat your vote breaks** (with "X takes the lead!" toasts on lead changes), standings with meters, and everyone's ballots with budget caps and comments.
- **Plan** — the current leader's hour-by-hour itinerary with day subtotals, a cost recap, a persistent packing checklist with add-your-own items, and copy-plan-to-clipboard for the group chat.

States and details: tie banners, unvoted-yet indicator dot, empty-filter state, localStorage persistence with a footer "Reset demo", tab deep-links (`#votes`, `#plan`), mobile bottom tab bar with safe-area padding, Escape/backdrop-close modals with scroll lock, `aria-pressed` voting, skip link, and reduced-motion support.

## Checks I ran

- `npm run check` (tsc + vite build) — **passes**; production preview served and verified.
- Chart colors follow the dataviz skill: the budget bar's four categorical slots **pass the palette validator** (CVD ΔE 9.1, normal-vision 22.9); the low-contrast slots are relieved by value-labeled legends, and vote meters use an accent fill on a same-ramp track.
- An esbuild SSR smoke test rendered all six views/overlays without errors and asserted the seeded tie and data shape.
- Headless-Chrome screenshots of every tab, the modal, the compare sheet, and a true-390px mobile frame — which caught and fixed three real bugs: compare-bar/toast overlapping the tab bar at 640–768px, a squeezed mobile filter row, and truncated legend labels in the modal.

To preview: `npm run dev`, or `npm run build && npx vite preview`.
