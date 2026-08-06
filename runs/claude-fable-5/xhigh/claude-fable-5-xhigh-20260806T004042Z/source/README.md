# Weekender

A weekend-trip planner for groups of friends: compare a shortlist of destinations
on budget, travel time, and weather; spend your two votes; and get a ready-made
itinerary for whichever city is winning. Everything runs on realistic sample data —
no sign-in or backend required. Your ballot and packing list persist in
`localStorage`.

Built with React, TypeScript, Vite, Tailwind CSS, and Lucide icons.

## Views

- **Explore** — destination cards with illustrated art, per-person cost, travel
  time, October weather, tags, and live vote counts; tap a card for a detail sheet.
- **Compare** — stacked cost-breakdown bars (transport / stay / food / activities)
  sortable by price, travel time, or votes.
- **Votes** — your two-slot ballot, live standings with a budget tiebreak, and
  everyone's picks.
- **Itinerary** — a three-day plan for the current leader (previewable for any
  city), budget summary, packing checklist, and a copy-to-clipboard trip summary.

## Commands

- `npm run dev` — local dev server
- `npm run typecheck` — TypeScript check
- `npm run build` — production build to `dist/`
- `npm run check` — typecheck + build
- `npx vite preview` — preview the production build
