## Summary

I built **Weekender**, a full single-page React/TypeScript app for a group of six friends planning a weekend trip out of Chicago, with realistic sample data and no backend.

**Core features:**
- **Compare & Vote** — a grid of 6 real Midwest destinations (Door County, Traverse City, Milwaukee, Lake Geneva, Indianapolis, Saugatuck), each with drive time, per-person budget range, weather, and vibe tags. Search, multi-select vibe filters, and sort (votes/budget/drive time/A–Z), with a dedicated empty state when filters match nothing.
- **Voting** — "You" can cast/change a vote on any card or in the details modal; a status banner adapts to unvoted/voted/tied states (seed data is pre-tied 2–2 so your vote genuinely breaks the tie), a sticky leaderboard shows live rankings with avatar stacks, and toasts confirm each vote action. Your vote persists via localStorage across reloads.
- **Destination details modal** — full description, budget breakdown bar chart, highlights, weather, and a "View full itinerary" handoff.
- **Itinerary** — a Friday/Saturday/Sunday timeline (checked-in activities with times, icons, descriptions) for any destination, defaulting to whichever is currently leading the vote, plus a "good to know" packing tip.
- **Polish/states**: skeleton loading on first mount, responsive layout (sidebar leaderboard on desktop reflows above the grid on mobile), accessible modal (Esc/backdrop/focus), and a countdown-to-vote-deadline pill in the header.

**Verification:**
- `npm run check` (typecheck + `vite build`) passes cleanly.
- Since no run skill existed for this repo, I started the Vite dev server and drove it with a headless Playwright script (fetched via npx) across desktop and mobile viewports — checked filtering, sorting, the empty state, voting/un-voting, the details modal, and itinerary switching, with zero console errors.
- That testing caught a real layout bug: the card footer clipped the "Voted" button text once three avatars were shown (e.g., after casting the tie-breaking vote). Fixed by restructuring the footer into two rows (avatars, then full-width action buttons) and re-verified visually with a 3-avatar and worst-case scenario.

The app is ready to preview locally with `npm run dev`.
