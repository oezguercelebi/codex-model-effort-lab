import type { Friend } from "../types"

export const YOU_ID = "you"

export const friends: Friend[] = [
  { id: YOU_ID, name: "You", initials: "You", bg: "bg-teal-600", fg: "text-white" },
  { id: "maya", name: "Maya Chen", initials: "MC", bg: "bg-amber-500", fg: "text-white" },
  { id: "jordan", name: "Jordan Lee", initials: "JL", bg: "bg-rose-500", fg: "text-white" },
  { id: "priya", name: "Priya Patel", initials: "PP", bg: "bg-violet-500", fg: "text-white" },
  { id: "sam", name: "Sam Okafor", initials: "SO", bg: "bg-sky-500", fg: "text-white" },
  { id: "theo", name: "Theo Martinez", initials: "TM", bg: "bg-emerald-600", fg: "text-white" },
]

export function getFriend(id: string): Friend | undefined {
  return friends.find((f) => f.id === id)
}
