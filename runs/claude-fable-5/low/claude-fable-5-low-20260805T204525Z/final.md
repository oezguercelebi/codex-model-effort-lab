`npm run check` passes (typecheck + production build both clean).

I built Weekender as a single-page React + Tailwind app with three views, using realistic sample data for a six-person friend group planning a September weekend (`src/data.ts` holds all data — six European destinations with full budgets, travel details, highlights, and three-day itineraries, plus five friends with pre-cast votes).

**What's in the app:**

- **Explore** — a hero explaining the trip and vote rules, filter chips by vibe (Beach, City, Mountains…), a sort control (votes / budget / travel time / rating), and destination cards showing per-person budget, door-to-door travel time, September weather, voter avatars, and a "Leading" badge on the current favorite. An empty state appears when a filter matches nothing.
- **Destination detail** — clicking a card opens a modal (bottom sheet on mobile) with a description, travel/weather/vote stats, a segmented per-person budget bar broken into travel/lodging/food/activities, highlights, who's voted, and a vote button. Closes on Escape, backdrop click, or the X.
- **Votes** — a live leaderboard with proportional vote bars, crown on the leader, voter avatars, rating tiebreaker, and inline vote toggles.
- **Itinerary** — a ready-made plan for whichever destination is currently winning, with a gradient hero (dates, budget, travel mode), day tabs (Fri/Sat/Sun), and a timeline of stops with times, icons by type (food/activity/travel/chill), and descriptions. It updates automatically if the standings change.

**Interactions and states:** you get two votes, toggleable anywhere, with a toast confirming each action or telling you you're out of votes; your votes persist in localStorage (validated on load) and immediately reshuffle the leaderboard and itinerary. Responsive throughout — pill navigation on desktop, a fixed bottom tab bar on mobile.

No new packages were added. Preview locally with `npm run dev`.
