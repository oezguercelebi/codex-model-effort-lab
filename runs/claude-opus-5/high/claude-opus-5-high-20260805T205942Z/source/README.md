# Weekender

A planner for the weekend trip your group chat keeps failing to book. Compare ten
destinations on money and travel time, see how each one suits the people actually coming,
vote, and get an hour-by-hour plan for whatever wins.

Everything runs on sample data in the browser — no sign-in, no backend, no network calls.
Votes, crew and plan edits are kept in `localStorage`.

## What's in it

- **Explore** — cards with a per-person cost, door-to-door travel time, group match score,
  forecast and live vote tallies. Search, sort, and filter by vibe, travel time and budget.
- **Compare** — up to four destinations side by side, with the best number in each row marked.
- **Vote** — a three-way ballot (in / maybe / out) per person, live standings, an agreement
  read-out, and a lock-in that decides the trip.
- **Plan** — the winning itinerary from Friday to Sunday. Drop what you don't want, add the
  optional extras, change how you're travelling, and watch the budget follow.

The numbers are derived rather than hard-coded: beds are split across whoever is coming, car
costs are split across however many cars the group needs, and the chosen weekend shifts both
prices and the forecast.

Illustrations are generated as SVG from each destination's palette, so there are no image
requests.

## Commands

- `npm run dev` — local dev server
- `npm run typecheck` — TypeScript, no emit
- `npm run build` — typecheck plus production build
- `npm run check` — both of the above
- `npx vite preview` — serve the built output

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4 and Lucide icons — nothing else added.
