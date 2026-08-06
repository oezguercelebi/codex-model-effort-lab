# Weekender

A group of friends has to pick one weekend trip. Weekender is the app that gets them there:
compare ten real destinations, see what the weekend actually costs each person, vote, and get an
hour-by-hour plan for whichever place wins.

Everything runs from sample data in the browser — no sign-in, no backend, no network calls.

## Commands

- `npm run dev` — dev server
- `npm run check` — typecheck plus production build
- `npm run build` then `npx vite preview` — preview the built app

## What's in it

**Explore** — ten destinations reachable from Berlin, Munich or Hamburg for a Fri–Sun or Thu–Sun
weekend. Each card shows the all-in price per person, door-to-door travel time, the late-October
weather and where the group's vote stands. Filter by budget, travel time, vibe or free text; sort by
match, votes, price, travel time or name.

**Trip setup** — departure city, trip length and who's actually coming. Costs recalculate live:
accommodation is booked as whole places, so the per-head price drops as more people join, and jumps
when the group outgrows a unit and needs a second one.

**Compare** — up to three destinations side by side across cost split, travel, stay, weather, feel
and votes, with the best value in each row flagged. Defaults to the group's current top three.

**Vote** — approval-style voting (yes = 2 points, maybe = 1). Your ballot, the crew's progress and a
live leaderboard, plus the full vote grid for every member. Lock in a winner when the group is happy.

**Plan** — the winning weekend hour by hour, with per-day spend, a cost breakdown, a shared-kitty
suggestion, an assigned prep checklist and a packing list. Both checklists persist.

Also included: light and dark themes, keyboard support (`/` to search, `Esc` to close dialogs, focus
trapping in dialogs), toasts with undo on every vote, loading skeletons, an empty state for
over-filtering, reduced-motion support, and full state persistence in `localStorage` with a reset.

## How it's built

React 19 + TypeScript, Vite, Tailwind CSS v4 and lucide-react — nothing added to the starter.

- `src/data/` — destinations, itineraries, crew and seeded votes
- `src/lib/trip.ts` — budget, vote tally, match score, filtering and sorting
- `src/state/` — reducer store with `localStorage` persistence, plus toasts
- `src/components/Scenery.tsx` — the postcard artwork: seven procedural SVG scenes, tinted per
  destination, so the app ships with illustrations and zero image assets

Prices, travel times and weather are realistic estimates written for the demo, not live quotes.
