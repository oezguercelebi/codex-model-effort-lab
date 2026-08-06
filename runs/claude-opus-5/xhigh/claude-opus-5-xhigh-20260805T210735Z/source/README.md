# Weekender

A group weekend-trip planner. Six friends, eight candidate weekends out of New York, one
decision to make. Weekender prices each option for *your* group, times it door to door, lets
everyone vote, and builds a Friday-to-Sunday plan around whatever wins.

Everything runs in the browser — no sign-in, no backend, no network calls. State (votes,
filters, comparison, the locked pick, checklists) persists to `localStorage`.

## The four screens

| Screen | What it does |
| --- | --- |
| **Explore** | Filter by budget, one-way travel time, vibe and free text; sort by fit, votes, price or trip length. Every card carries a fit score, per-person price, door-to-door time and inline vote buttons. |
| **Compare** | Up to three weekends side by side across a dozen rows — cost breakdown, travel, weather, walkability, who it suits, where the crew stands — with `cheapest` / `fastest` / `best` markers. |
| **Vote** | Love it (+2) / up for it (+1) / pass (−1). Live standings, per-destination vote mix, crew ballot progress, a focused Quick Vote flow, tie detection, and "lock it in". |
| **The plan** | The winning (or leading) destination's full weekend: day tabs, a costed timeline, swappable activities, a booking checklist and a packing list. |

## How the numbers work

- **Budget** — `travel + (nightly rate × nights ÷ travellers) + food × days + activities`. The
  stay splits across the group, so changing the party size moves the per-person price; outgrow
  the listing and an extra room is added automatically.
- **Travel** — each destination has real door-to-door alternatives (drive / train / fly). Picking
  a different one on the *Getting there* tab re-prices the whole weekend.
- **Fit score** — 45% how many crew members get a vibe they asked for, 30% budget headroom,
  25% travel time, with the reasoning spelled out on the destination detail.

## Structure

```
src/
  data/          destinations, crew + seeded votes, eight full itineraries
  lib/           budget, fit, tally and sort logic (pure functions)
  state/         reducer, context, persistence, toasts
  components/    design-system primitives, generative SVG artwork, cards, sheets
  views/         Explore · Compare · Vote · Plan
```

Destination artwork is generated SVG (seeded per destination), so the app ships with no image
assets and makes no external requests. Chart colours come from a validated categorical palette,
and every stacked segment is direct-labelled so nothing depends on colour alone.

## Commands

- `npm run dev` — local dev server
- `npm run check` — typecheck + production build
- `npm run build` — production build into `dist/`
- `npx vite preview` — preview the production build
