# Weekender

A responsive web app that helps a group of friends pick and plan a weekend trip.
Six friends from Berlin are choosing between six destinations for Sep 18–20;
everything runs on realistic sample data — no account, no backend.

## Features

- **Explore** — destination cards with hand-drawn SVG scenes, all-in per-person
  cost, fastest travel option, September weather, vibe filters, and sorting
  (group favorites / cheapest / quickest / warmest).
- **Details** — per-destination budget breakdown (validated categorical palette,
  value-labeled legend), travel options, stay, highlights, and a draft 3-day plan.
- **Compare** — pick up to three destinations and line them up in a side-by-side
  table; the best value in each row gets a crown.
- **Votes** — approval voting with seeded ballots (starts as a Lisbon/Prague
  dead heat your vote can break), live standings with meters, and everyone's
  ballots with budget caps.
- **Plan** — an hour-by-hour itinerary for the current leader, day subtotals,
  cost recap, a persistent packing checklist, and a copy-to-clipboard plan.

Your votes and packing list persist in `localStorage`; use “Reset demo” in the
footer to start over. Tabs deep-link via `#explore`, `#votes`, `#plan`.

## Stack

React + TypeScript, Vite, Tailwind CSS 4, Lucide icons. No other dependencies.

## Commands

- `npm run dev` — start the dev server
- `npm run typecheck` — TypeScript only
- `npm run build` — typecheck + production build
- `npm run check` — typecheck + build
- `npx vite preview` — serve the production build
