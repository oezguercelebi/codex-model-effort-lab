Both typecheck and build pass cleanly.

Built Weekender, a single-page trip planner with two views:

- **Compare** — a card grid of 4 realistic weekend destinations (Big Sur, Lake Tahoe, Asheville, Santa Fe) showing budget/person, travel time & mode, rating, weather, highlights, and live vote avatars from a group of 6 friends. Users can cast/change their own vote (toggle), see the leading destination highlighted with a trophy badge, and jump to any destination's itinerary preview.
- **Itinerary** — day-by-day (Fri–Sun) timeline for the currently winning (or selected) destination, with times, activity titles/descriptions, and stat tiles (cost, travel, distance, rating), plus quick-switch chips to preview other destinations' itineraries.

Fully responsive (mobile-first grid/nav), no backend or sign-in — all state is local React state seeded with sample votes. Ran `npm run check` (typecheck + build) — both succeeded.
