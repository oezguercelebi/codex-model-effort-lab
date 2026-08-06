import type { CrewMember, Vibe, VoteValue } from "../types"

export const trip = {
  name: "Maya's birthday weekender",
  origin: "New York City",
  originShort: "NYC",
  weekendLabel: "Fri 25 – Sun 27 Sep",
  year: 2026,
  /** Friday of the trip weekend, used to label itinerary days. */
  dates: {
    thursday: "Thu 24 Sep",
    friday: "Fri 25 Sep",
    saturday: "Sat 26 Sep",
    sunday: "Sun 27 Sep",
  },
  votingClosesIn: "3 days",
}

/** Label for the weekend, which grows a day when the group adds a third night. */
export function weekendLabel(nights: number): string {
  return nights >= 3 ? "Thu 24 – Sun 27 Sep" : trip.weekendLabel
}

export const allVibes: Vibe[] = [
  "Food & drink",
  "Nature",
  "Big city",
  "Beach",
  "Mountains",
  "Culture",
  "Nightlife",
  "Slow & spa",
]

export const crew: CrewMember[] = [
  {
    id: "you",
    name: "You",
    initials: "YO",
    role: "Organiser",
    wants: ["Food & drink", "Nature"],
    isYou: true,
  },
  {
    id: "maya",
    name: "Maya",
    initials: "MA",
    role: "Birthday girl",
    wants: ["Food & drink", "Nightlife"],
  },
  {
    id: "devin",
    name: "Devin",
    initials: "DE",
    role: "Will bring the cooler",
    wants: ["Mountains", "Nature"],
  },
  {
    id: "priya",
    name: "Priya",
    initials: "PR",
    role: "Museum person",
    wants: ["Culture", "Big city"],
  },
  {
    id: "jonah",
    name: "Jonah",
    initials: "JO",
    role: "Owns a wetsuit",
    wants: ["Beach", "Slow & spa"],
  },
  {
    id: "noor",
    name: "Noor",
    initials: "NO",
    role: "Books the restaurants",
    wants: ["Food & drink", "Culture"],
  },
]

export const crewById = new Map(crew.map((m) => [m.id, m]))
export const you = crew[0]

/**
 * Votes the rest of the group already cast. "You" start with an empty ballot so
 * the empty state is the first thing a new visitor sees.
 */
export const seedVotes: Record<string, Record<string, VoteValue>> = {
  maya: {
    "hudson-valley": "yes",
    montauk: "yes",
    boston: "pass",
    montreal: "love",
    charleston: "love",
    "portland-me": "love",
    "washington-dc": "pass",
    asheville: "yes",
  },
  devin: {
    "hudson-valley": "love",
    montauk: "pass",
    boston: "yes",
    montreal: "yes",
    charleston: "pass",
    "portland-me": "yes",
    "washington-dc": "pass",
    asheville: "love",
  },
  priya: {
    "hudson-valley": "yes",
    montauk: "pass",
    boston: "love",
    montreal: "love",
    charleston: "yes",
    "portland-me": "yes",
    "washington-dc": "love",
    asheville: "pass",
  },
  jonah: {
    "hudson-valley": "yes",
    montauk: "love",
    boston: "pass",
    montreal: "pass",
    charleston: "love",
    "portland-me": "love",
    "washington-dc": "pass",
    asheville: "yes",
  },
  noor: {
    "hudson-valley": "love",
    montauk: "yes",
    boston: "yes",
    montreal: "yes",
    charleston: "love",
    "portland-me": "yes",
    "washington-dc": "yes",
    asheville: "pass",
  },
}

/** Short notes the crew left, shown on destination detail. */
export const crewNotes: Record<string, { memberId: string; text: string }[]> = {
  "hudson-valley": [
    { memberId: "devin", text: "The farmhouse has a hot tub AND a fire pit. I've already looked." },
    { memberId: "maya", text: "Fine, but I want one real dinner, not just cheese boards." },
  ],
  montauk: [
    { memberId: "jonah", text: "Water's still 62°. I'll bring three boards, first-timers welcome." },
    { memberId: "priya", text: "Four hours on the LIRR each way is a lot for two nights." },
  ],
  boston: [{ memberId: "priya", text: "The Gardner alone is worth the train ticket." }],
  montreal: [
    { memberId: "maya", text: "Bagels at 1am. That's the whole pitch. That's it." },
    { memberId: "jonah", text: "Passports though. Does everyone actually have one?" },
  ],
  charleston: [
    { memberId: "noor", text: "I can get us the 8pm on King Street if we decide this week." },
    { memberId: "devin", text: "Love it, but $300 of it is airfare before we eat anything." },
  ],
  "portland-me": [
    { memberId: "maya", text: "Oysters, and I'll drive the first leg. This is my pick." },
    { memberId: "noor", text: "Eventide takes no reservations — we go at 5 or we wait an hour." },
  ],
  "washington-dc": [
    { memberId: "priya", text: "Free museums means the whole budget goes to dinner." },
    { memberId: "maya", text: "We've all been. Twice." },
  ],
  asheville: [
    { memberId: "devin", text: "Craggy Gardens at sunrise is the single best thing on this list." },
    { memberId: "noor", text: "A flight plus a rental car for two nights is a rough trade." },
  ],
}
