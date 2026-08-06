**Weekender** is built — a three-tab React/TS app for a five-friend October weekend trip.

**What's there**

- **Explore** — six hand-written destinations (Lisbon, Val Gardena, Copenhagen, St Ives, Kraków, Amalfi Coast) as gradient cards showing per-person cost, door-to-door travel time with mode icon, weather, vibe tags, and an automatic fit warning ("Over budget for Jonas · Too far for Ayla") computed against each friend's stated budget and travel caps. Filters for max spend, max travel time, vibe chips, and a "works for everyone" toggle, plus sorts by group favourite / cheapest / closest, with a reset and an empty state.
- **Detail drawer** — full blurb, four-stat row, a stacked budget breakdown (lodging / transport / food / activities) with per-friend over-budget maths, highlights, the whole group's vote row (you can vote as anyone), and the hour-by-hour itinerary. Escape/backdrop close, scroll lock, focus moved to the close button.
- **Vote** — your ballot with progress, live standings with score bars and a tie warning, and a "who still owes votes" panel. In = 2 pts, Maybe = 1, Out = 0; clicking your current vote clears it.
- **Plan** — the winning destination's dates/budget/travel/attendee summary, a tabbed Fri–Sun itinerary with per-day spend and typed timeline items, backup picks, and a tie caveat when the top is level.

State persists to localStorage, seeded with plausible existing votes so the app is alive on first load; toasts confirm each vote and a header Reset restores the seed. Responsive down to 320px, keyboard-navigable with a skip link, `aria-pressed`/`aria-live` on the interactive bits.

**Checks:** `npm run check` (typecheck + build) passes clean; `npm run dev` serves 200 on localhost:5173. No packages added.
