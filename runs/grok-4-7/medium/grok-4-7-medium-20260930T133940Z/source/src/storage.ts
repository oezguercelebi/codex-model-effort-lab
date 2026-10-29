import { defaultVotes, destinations, friends } from "./data"
import { isAllowedBudget, isAllowedTravel, isVibe } from "./logic"
import type { SortKey, TripState } from "./types"

const KEY = "weekender-v1"
const SORTS: SortKey[] = ["votes", "cost", "travel", "name"]

export function defaultTripState(): TripState {
  return {
    votes: Object.fromEntries(friends.map((friend) => [friend.id, defaultVotes[friend.id] ?? null])),
    coming: Object.fromEntries(friends.map((friend) => [friend.id, true])),
    voterId: "sam",
    compareIds: [],
    maxBudget: null,
    maxMinutes: null,
    vibes: [],
    sort: "votes",
  }
}

export function loadState(): TripState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultTripState()
    return sanitize(JSON.parse(raw))
  } catch {
    return defaultTripState()
  }
}

export function saveState(state: TripState) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

function sanitize(value: unknown): TripState {
  const base = defaultTripState()
  if (!value || typeof value !== "object") return base
  const record = value as Partial<TripState>
  const friendIds = new Set(friends.map((friend) => friend.id))
  const destIds = new Set(destinations.map((dest) => dest.id))

  const votes = { ...base.votes }
  if (record.votes && typeof record.votes === "object") {
    for (const friend of friends) {
      const vote = record.votes[friend.id]
      votes[friend.id] = typeof vote === "string" && destIds.has(vote) ? vote : null
    }
  }

  const coming = { ...base.coming }
  if (record.coming && typeof record.coming === "object") {
    for (const friend of friends) {
      const flag = record.coming[friend.id]
      if (typeof flag === "boolean") coming[friend.id] = flag
    }
  }

  const compareIds = Array.isArray(record.compareIds)
    ? [...new Set(record.compareIds.filter((id): id is string => typeof id === "string" && destIds.has(id)))].slice(0, 3)
    : []

  const vibes = Array.isArray(record.vibes) ? record.vibes.filter((vibe): vibe is TripState["vibes"][number] => typeof vibe === "string" && isVibe(vibe)) : []

  return {
    votes,
    coming,
    voterId: typeof record.voterId === "string" && friendIds.has(record.voterId) ? record.voterId : base.voterId,
    compareIds,
    maxBudget: isAllowedBudget(record.maxBudget ?? null) ? (record.maxBudget ?? null) : null,
    maxMinutes: isAllowedTravel(record.maxMinutes ?? null) ? (record.maxMinutes ?? null) : null,
    vibes,
    sort: SORTS.includes(record.sort as SortKey) ? (record.sort as SortKey) : "votes",
  }
}
