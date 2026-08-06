Done — Weekender v1 is built and verified. `npm run check` (typecheck + production build) passes, and I confirmed the app renders and behaves correctly by driving the built preview in headless Chrome at both 1440px and a true 390px mobile viewport.

## What I built

A light, warm-toned single-page app (React + TypeScript + Tailwind 4 + Lucide, no new packages) around a sample trip: six friends from Berlin picking a city for Oct 9–11, with five seeded ballots and yours live. Four views, top-pill nav on desktop and a fixed bottom tab bar on mobile:

- **Explore** — hero with stat tiles (days to go, budget spread, ballots in, front-runner), then six destination cards (Lisbon, Prague, Barcelona, Amsterdam, Copenhagen, Interlaken) with hand-drawn SVG scene art (coast/city/canal/mountain variants), per-person cost, travel time, October weather, "Best value"/"Quickest hop"/"In the lead" badges, and voter avatar stacks. Cards open a detail sheet with budget breakdown, highlights, and vote/plan actions (Esc, backdrop close, scroll lock).
- **Compare** — stacked cost bars (transport/stay/food/activities) with comparable lengths across rows, a legend, all four values as visible text, and sorting by price, travel time, or votes. Chart colors are the dataviz skill's validated categorical palette (I ran the validator; the contrast warning on two hues is satisfied by the always-visible value labels).
- **Votes** — a two-slot ballot with empty/complete states and reset, live standings with leader-emphasis bars, an explicit budget tiebreak (Prague leads a 3–3 tie with Lisbon until you vote — your ballot can genuinely flip the race), and everyone's picks with a quip each.
- **Itinerary** — always follows the current leader: banner, full Fri–Sun timeline (hand-written for all six cities), budget summary with group total, a persisted packing checklist with progress meter, copy-plan-to-clipboard, and a "previewing, not the leader" state with a one-tap way back.

States and polish include toasts (vote cast/removed, out-of-votes, ballot complete, copy), localStorage persistence of votes and packing with corrupt-data guards, staggered entrance animations with `prefers-reduced-motion` support, focus-visible rings, aria labels/pressed/current throughout, and safe-area padding for the mobile bar.

## Checks run

- `npm run check` — clean (TypeScript strict + Vite production build).
- Screenshot pass over all four views, the modal, and the vote-twice interaction flow on desktop and mobile; verified the leader flip, toast, and "Ballot in" states visually, and fixed three nits it surfaced (banner text contrast, a wrapping modal button, a truncated vote count).

To preview: `npm run build && npx vite preview` (or `npm run dev`).
