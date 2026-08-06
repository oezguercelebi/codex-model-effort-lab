Built and verified. Summary:

**Weekender** — a single-page React/TypeScript/Tailwind app with three pieces of state-driven UX:

- **Destinations tab**: a card grid of 6 realistic weekend-trip options (Lake Tahoe, Austin, Asheville, Charleston, Joshua Tree, Portland ME), each with a gradient "hero" (no external images needed), vibe tags, star rating, flight time, price/person, and live vote-avatar stack. Filterable by vibe tag and sortable by votes/price/travel time. Clicking a card opens a detail sheet with full travel-time breakdown (flight/drive/train), a per-person budget table, highlights, and a vote toggle.
- **Voting**: single-vote-per-person model seeded with sample votes from 4 friends; "You" can vote/unvote from either the card or the detail sheet, persisted to `localStorage` so it survives reloads.
- **Itinerary tab**: auto-shows the current vote leader's day-by-day (Fri/Sat/Sun) plan with times and details; handles the zero-votes empty state and a tie state (banner + prompt to break the tie).

Fully responsive (stacked cards/bottom-sheet modal on mobile, grid/centered modal on desktop), built only with the pre-installed deps (React, Tailwind, lucide-react).

Checks run: `npm run check` (tsc --noEmit + vite build) passes cleanly; also smoke-tested `npm run dev` to confirm the app serves correctly.
