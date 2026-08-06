Built **Weekender**, a four-screen group trip planner running entirely on local sample data.

## What's there

**Explore** — 10 real weekend destinations from Berlin (Prague, Kraków, Copenhagen, Lake Bled, Saxon Switzerland, Rügen, Lisbon, Amsterdam, Hamburg, Vienna). Each card shows a per-person all-in cost, door-to-door travel time and mode, a group-match ring, forecast, top vibes and live vote tallies. Search, sort (match / votes / cheapest / fastest), vibe chips, and a filter sheet with budget, max journey time, flight-free and hide-over-budget switches.

**Compare** — up to four side by side, 12 rows deep, with the winning number in each row marked "Best". Sticky row labels, horizontal scroll on mobile.

**Vote** — three-way ballot (in / maybe / out) per person, a member switcher so any of the six friends' ballots can be filled in, ballot progress, live standings with an agreement percentage, and a lock-in that decides the trip.

**Plan** — the winner's Friday-to-Sunday itinerary (all 10 are written out, ~13 blocks each). Remove blocks, add the optional extras, put removed ones back, change travel mode — the budget panel follows live and compares against the target. Plus packing checklist, crew split and a preview mode when you open an itinerary that isn't the group's pick.

**Detail sheet** — cost breakdown by category, per-member fit bars, all travel options with CO₂ and a recommended marker, rated vibes, highlights, a local tip and group-chat comments.

## Engineering notes

- Numbers are derived, not hard-coded: beds split across whoever's coming (with a surcharge past the listed sleeps), car costs split across however many cars the group needs, and the chosen weekend shifts both prices and the forecast.
- Reducer + context with `localStorage` persistence and validation on rehydrate; "Reset the demo" restores the seed.
- No images — each destination's artwork is a deterministic SVG scene (seven scene types) drawn from its palette, so there are zero network requests.
- Light/dark via semantic CSS-variable tokens mapped through Tailwind v4's `@theme inline`; respects the OS by default.
- Responsive throughout: bottom nav under `lg`, sticky sidebars above it. Focus rings, `aria-pressed`/`role="switch"`, Esc-to-close and focus trapping in sheets, `prefers-reduced-motion` honoured, number keys 1–4 to switch screens.
- States covered: skeleton load, empty filter results, empty ballot, no-winner-yet plan, over-budget flags, toasts with undo on destructive actions.

## Checks

`npm run check` (typecheck + build) passes clean. I also built an SSR bundle and rendered every view, the detail sheet and the plan preview to catch render-time errors — all rendered, and I read the output back to verify the money/duration formatting, vote maths and itinerary content. Finally served `dist` with `vite preview` and confirmed the HTML, JS and CSS all return 200. Two bugs found and fixed this way: the "#1 with the group" badge was keyed off display order rather than the vote leaderboard, and opening an itinerary from the detail sheet silently overwrote the locked winner instead of previewing it.
