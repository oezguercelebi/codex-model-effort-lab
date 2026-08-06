import type { Friend, VotesState } from "../types"

export const YOU_ID = "you"

export const friends: Friend[] = [
  { id: YOU_ID, name: "You", initials: "Y", color: "bg-indigo-500", ring: "ring-indigo-300", isYou: true },
  { id: "maya", name: "Maya Chen", initials: "MC", color: "bg-rose-500", ring: "ring-rose-300" },
  { id: "jordan", name: "Jordan Reyes", initials: "JR", color: "bg-amber-500", ring: "ring-amber-300" },
  { id: "priya", name: "Priya Nair", initials: "PN", color: "bg-emerald-500", ring: "ring-emerald-300" },
  { id: "sam", name: "Sam O'Neill", initials: "SO", color: "bg-sky-500", ring: "ring-sky-300" },
  { id: "chris", name: "Chris Bailey", initials: "CB", color: "bg-violet-500", ring: "ring-violet-300" },
]

export const friendsById: Record<string, Friend> = Object.fromEntries(
  friends.map((friend) => [friend.id, friend]),
)

/** Seed votes so the app feels like a trip already in motion. Chris is intentionally undecided. */
export const initialVotes: VotesState = {
  [YOU_ID]: "austin",
  maya: "nashville",
  jordan: "austin",
  priya: "austin",
  sam: "charleston",
  chris: null,
}
