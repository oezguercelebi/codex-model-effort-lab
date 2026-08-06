# Weekender

A weekend-trip planner for a group of friends. Compare eight destinations on real
cost and travel time, vote on them together, and get an itinerary for whatever wins.
Everything runs on local sample data — no sign-in, no backend.

## Running it

- `npm run dev` — dev server
- `npm run check` — typecheck + production build
- `npm run build` then `npx vite preview` — preview the built app

## How it's put together

```
src/
  lib/
    types.ts     shared domain types
    data.ts      sample destinations, origins, friends, seed votes
    engine.ts    distance → travel mode/time/cost, budget breakdown, vote scoring
    store.tsx    app state (context), derived rankings, localStorage persistence
  components/    UI primitives, cards, compare table, itinerary, detail sheet
  views/         Explore, Vote, Plan
```

Costs and travel times aren't hardcoded per destination. Each destination and
origin has coordinates; `engine.ts` derives the great-circle distance, picks a
plausible travel mode (drive / rail / fly), and builds a per-person budget from
the destination's nightly, food, and activity rates plus the chosen trip length
and lodging tier. Changing the origin, dates, group size, or lodging tier
recalculates every card.

Votes are weighted — in counts +2, maybe +1, a pass −2 — and normalised to a
consensus percentage. The Plan view shows whichever destination is locked in, or
falls back to the current front-runner with a banner saying so.

State (settings, votes, shortlist, packing checklist, theme) persists to
localStorage. The reset button in the header restores the seeded demo.

Estimates are illustrative sample data, not live prices.
