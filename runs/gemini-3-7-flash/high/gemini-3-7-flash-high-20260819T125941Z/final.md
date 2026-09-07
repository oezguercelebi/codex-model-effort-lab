# Weekender v1 — Collaborative Weekend Trip Planner

I have built and verified **Weekender**, a responsive web app designed to help a group of friends compare destinations, evaluate budgets and travel times, vote collaboratively, and view a weekend itinerary.

---

### Key Features & Capabilities

1. **Destination Discovery & Rich Comparison**:
   - **Multi-View Exploration**: Toggle between **Interactive Grid Cards**, a **Side-by-Side Comparison Matrix Table**, and a **Multi-Origin Transit Matrix**.
   - **Deep Comparison Modal**: Compare up to 3 destinations across group match %, total per-person budget, transit duration/modes, weather forecasts, pros & cons, and squad votes.
   - **Filters & Sorting**: Filter by vibe tags (*Mountain & Nature*, *Coastal & Beach*, *Foodie & Wine*, *Arts & Culture*, *Cozy Village*, *Nightlife*), max budget, travel time, and transit mode. Sort by group consensus match, budget, travel time, or votes.
   - **Destination Deep-Dive Modal**: Includes high-resolution photo galleries, signature highlights, top food & drink spots, pros/cons, and day-by-day preview.

2. **Budget & Travel Time Transparency**:
   - **Itemized Per-Person Budget Engine**: Transparent breakdown across lodging (split among the group), transportation, daily dining/drinks, scheduled activities, and buffer reserves.
   - **Multi-Origin Travel Matrix**: Shows transit time and primary travel modes (train, scenic drive, flight) for each friend from their respective neighborhood (Manhattan, Brooklyn, Hoboken, Jersey City, Queens).

3. **Collaborative Group Decision & Voting Hub**:
   - **Interactive Squad Switcher**: Switch between 6 realistic personas (**Alex**, **Maya**, **Liam**, **Elena**, **Samir**, **Chloe**) to simulate individual perspectives, budget tolerances, and votes.
   - **Ranked Choice Ballot**: Rank 1st, 2nd, and 3rd picks with reactions (❤️ *Love*, 👍 *Like*, 👎 *Pass*) and custom pitches.
   - **Consensus Engine**: Calculates weighted Borda scores, budget fit %, and transit penalties in real time.
   - **Weekend Date Poll**: Grid of potential weekend dates with friend availability indicators (✅ *Available*, 🟡 *If needed*, ❌ *Busy*).
   - **Group Discussion Board**: Interactive message stream with pinned notes and friend likes.
   - **"Lock In Winner" Action**: Triggers a celebration confetti effect and locks in the destination.

4. **Winning Destination Itinerary & Trip Prep**:
   - **Time-Blocked Timeline Planner**: Filter by day (Friday arrival, Saturday adventure, Sunday send-off) with activity categories, locations, cost per person, booking status, squad attendee trackers, and upvotes.
   - **Add & Edit Activities**: Interactive modals to customize or add activities to the schedule.
   - **Squad Tasks & Packing Checklist**: Assign shared gear, reservations, and grocery items to friends with one-click completion.
   - **Export & Sharing Tools**: Export to `.ics` calendar files (Apple/Google Calendar), one-click copy formatted trip summary for WhatsApp/iMessage, and print-ready stylesheets.

5. **Persistence & UI Craft**:
   - Dark/Light mode toggle with persistence.
   - Complete `localStorage` state synchronization.
   - Propose custom destinations with custom photo themes, travel times, and budgets.
   - One-click "Reset Demo Data" option.

---

### Verification & Checks

The following checks were executed:
- `npm run check` (`tsc --noEmit`): **Passed with 0 errors**
- `npm run build` (`tsc && vite build`): **Production build succeeded**

The project is located in [`/Users/oezguercelebi/.gemini/antigravity-cli/scratch/weekender`](file:///Users/oezguercelebi/.gemini/antigravity-cli/scratch/weekender) (with root workspace scripts configured in [`scratch`](file:///Users/oezguercelebi/.gemini/antigravity-cli/scratch)). To preview locally, run:

```bash
cd /Users/oezguercelebi/.gemini/antigravity-cli/scratch/weekender
npm run dev
```

