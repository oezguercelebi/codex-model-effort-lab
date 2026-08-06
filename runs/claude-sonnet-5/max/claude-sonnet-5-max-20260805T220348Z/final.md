## Summary

Built **Weekender**, a full trip-planning app for a group of friends, replacing the frozen starter screen entirely.

**Product surface:**
- **Destinations tab** — 6 real weekend-trip destinations (Nashville, Charleston, Asheville, Austin, Sedona, Traverse City) as cards with gradient hero art, per-person budget ranges, travel time/mode, weather, vibe tags, and voting. Includes search + multi-select vibe filters, four sort modes, a grid/table view toggle (table on desktop only), a detail modal with full budget breakdown bars/highlights/lodging/packing list, and a live voting summary banner with a countdown to the (dynamically computed, always-future) voting deadline.
- **Itinerary tab** — shows the current vote-winner's day-by-day plan (Friday–Sunday) as a timeline with category icons, plus stat tiles (dates, budget, lodging, weather), a "preview any destination" pill switcher that's clearly distinguished from the group's actual pick, and a copy-to-clipboard trip summary.
- **Shared/group feel** — 6 seeded friends with avatars, one already-undecided friend, votes persisted to `localStorage`, toast notifications for vote changes, a reset-demo-data control, skeleton loading, empty states, an error boundary, and accessible modal/tab semantics.
- Fully responsive (mobile bottom-sheet modal vs. desktop dialog, single-column cards on mobile, hidden table view below `sm`), no backend/auth, all data local and realistic.

**Verification:**
- `npm run check` (typecheck + build) passes cleanly.
- Drove the app end-to-end with a headless-Chromium Playwright script across desktop and mobile viewports (33 automated interaction checks: voting, filtering to an empty state, table/grid toggle, modal open/close via ESC/backdrop/X, cross-tab itinerary preview, clipboard copy, reload persistence, reset) — all passed, zero console errors.
- Visually inspected screenshots of every major state; found and fixed two real polish issues along the way: toasts could stack unbounded on rapid actions (now capped at 3), and the search/sort focus ring was too pale to be a usable focus indicator (now clearly visible). A couple of screenshots that initially looked broken turned out to be animation-timing artifacts in the test itself, confirmed by re-checking after the transitions settled.

The app is ready to preview with `npm run dev`.
