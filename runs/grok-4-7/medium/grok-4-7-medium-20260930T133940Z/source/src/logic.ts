import { destinations, friends } from "./data"
import type { BudgetLine, Destination, TripState, VibeId } from "./types"

export const BUDGET_FILTERS: { id: string; label: string; max: number | null }[] = [
  { id: "any", label: "Any", max: null },
  { id: "350", label: "Under $350", max: 350 },
  { id: "400", label: "Under $400", max: 400 },
  { id: "550", label: "Under $550", max: 550 },
]

export const TRAVEL_FILTERS: { id: string; label: string; max: number | null }[] = [
  { id: "any", label: "Any", max: null },
  { id: "2h", label: "Under 2 hours", max: 120 },
  { id: "4h", label: "Under 4 hours", max: 240 },
  { id: "6h", label: "Under 6 hours", max: 360 },
]

export const SORTS: { id: TripState["sort"]; label: string }[] = [
  { id: "votes", label: "Most votes" },
  { id: "cost", label: "Lowest cost" },
  { id: "travel", label: "Shortest travel" },
  { id: "name", label: "Name" },
]

export const lineColors: Record<BudgetLine["id"], string> = {
  air: "#1D4E89",
  transport: "#0F6E62",
  lodging: "#B23326",
  food: "#A87412",
  activities: "#5C3D86",
}

export type Standings = {
  ids: string[]
  count: number
  voted: number
  coming: number
  decided: boolean
}

export function perPersonCost(dest: Destination, party: number): number {
  const size = Math.max(party, 1)
  const shared = (dest.lodgingTotal + dest.sharedTransportTotal) / size
  return Math.round(dest.personalTransport + dest.foodEach + dest.activitiesEach + shared)
}

export function budgetLines(dest: Destination, party: number): BudgetLine[] {
  if (party < 1) return []
  const split = party === 1 ? "one person" : `split ${party} ways`
  const lines: BudgetLine[] = []
  if (dest.personalTransport > 0) {
    lines.push({
      id: "air",
      label: "Airfare",
      amount: dest.personalTransport,
      note: "each",
    })
  }
  lines.push({
    id: "transport",
    label: dest.transportLabel,
    amount: dest.sharedTransportTotal / party,
    note: split,
  })
  lines.push({
    id: "lodging",
    label: dest.lodgingLabel,
    amount: dest.lodgingTotal / party,
    note: split,
  })
  lines.push({ id: "food", label: "Food", amount: dest.foodEach, note: "each" })
  lines.push({
    id: "activities",
    label: "Activities",
    amount: dest.activitiesEach,
    note: "each",
  })
  const rounded = lines.map((line) => ({ ...line, amount: Math.round(line.amount) }))
  const drift = perPersonCost(dest, party) - rounded.reduce((sum, line) => sum + line.amount, 0)
  const lodging = rounded.find((line) => line.id === "lodging")
  if (lodging) lodging.amount += drift
  else rounded[0].amount += drift
  return rounded
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins} min`
  if (mins === 0) return hours === 1 ? "1 hour" : `${hours} hours`
  return `${hours} hr ${mins} min`
}

export function joinNames(names: string[]): string {
  if (names.length === 0) return "No one"
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`
}

export function comingFriends(coming: TripState["coming"]) {
  return friends.filter((friend) => coming[friend.id])
}

export function votersFor(
  destId: string,
  votes: TripState["votes"],
  coming: TripState["coming"],
) {
  return friends.filter((friend) => coming[friend.id] && votes[friend.id] === destId)
}

export function getStandings(votes: TripState["votes"], coming: TripState["coming"]): Standings {
  const present = comingFriends(coming)
  const voted = present.filter((friend) => votes[friend.id]).length
  const counts = destinations.map((dest) => ({
    id: dest.id,
    count: present.filter((friend) => votes[friend.id] === dest.id).length,
  }))
  const count = counts.reduce((max, item) => Math.max(max, item.count), 0)
  const ids =
    count === 0
      ? []
      : destinations
          .filter((dest) => counts.find((item) => item.id === dest.id)?.count === count)
          .map((dest) => dest.id)
  return {
    ids,
    count,
    voted,
    coming: present.length,
    decided: count > 0 && ids.length === 1 && voted === present.length && present.length > 0,
  }
}

export function decisionCopy(
  standings: Standings,
  votes: TripState["votes"],
  coming: TripState["coming"],
  voterId: string,
): { title: string; detail: string } {
  const voter = friends.find((friend) => friend.id === voterId)
  const voterName = voter?.name ?? "You"
  const voterComing = Boolean(coming[voterId])
  const voterHasVote = Boolean(votes[voterId])

  if (standings.coming === 0) {
    return {
      title: "No one is coming",
      detail: "Mark at least one person as coming to plan the weekend.",
    }
  }
  if (standings.ids.length === 0) {
    return {
      title: "The weekend is still open",
      detail: voterComing
        ? `${voterName} can cast the first vote.`
        : "No votes yet. Choose a place to start.",
    }
  }

  const placeNames = standings.ids.map(
    (id) => destinations.find((dest) => dest.id === id)?.name ?? id,
  )

  let detail: string
  let title: string
  if (standings.ids.length === 1) {
    const who = joinNames(votersFor(standings.ids[0], votes, coming).map((friend) => friend.name))
    title = standings.decided ? `${placeNames[0]} wins the weekend` : `${placeNames[0]} is ahead`
    detail = standings.decided
      ? `${who} chose it. Everyone coming has voted.`
      : `${who} chose it. ${voteProgress(standings.voted, standings.coming)}`
  } else {
    title = `${joinNames(placeNames)} are tied`
    const voteWord = standings.count === 1 ? "vote" : "votes"
    const open = standings.coming - standings.voted
    const opener =
      open === 0
        ? "Change a vote to break the tie."
        : open === 1
          ? "1 vote is still open."
          : `${open} votes are still open.`
    detail = `Each has ${standings.count} ${voteWord}. ${opener}`
  }

  if (voterComing && !voterHasVote && !standings.decided) {
    detail = `${detail} ${voterName} has not voted.`
  }
  return { title, detail }
}

function voteProgress(voted: number, coming: number): string {
  if (coming === 1) return voted === 1 ? "The only vote is in." : "The only vote is still open."
  const verb = voted === 1 ? "is" : "are"
  return `${voted} of ${coming} votes ${verb} in.`
}

export function visibleDestinations(state: TripState): Destination[] {
  const party = comingFriends(state.coming).length
  const priceParty = Math.max(party, 1)
  const list = destinations.filter((dest) => {
    if (state.maxMinutes != null && dest.doorToDoorMinutes > state.maxMinutes) return false
    if (state.vibes.length > 0 && !dest.vibes.some((vibe) => state.vibes.includes(vibe))) return false
    if (party > 0 && state.maxBudget != null && perPersonCost(dest, party) > state.maxBudget) {
      return false
    }
    return true
  })
  const voteCount = (id: string) => votersFor(id, state.votes, state.coming).length
  return [...list].sort((a, b) => {
    if (state.sort === "name") return a.name.localeCompare(b.name)
    if (state.sort === "travel") {
      return a.doorToDoorMinutes - b.doorToDoorMinutes || a.name.localeCompare(b.name)
    }
    if (state.sort === "cost") {
      return perPersonCost(a, priceParty) - perPersonCost(b, priceParty) || a.name.localeCompare(b.name)
    }
    return (
      voteCount(b.id) - voteCount(a.id) ||
      perPersonCost(a, priceParty) - perPersonCost(b, priceParty) ||
      a.name.localeCompare(b.name)
    )
  })
}

export function supportLabel(names: string[], count: number): string {
  if (count === 0) return "No votes yet"
  const voteWord = count === 1 ? "vote" : "votes"
  return `${joinNames(names)}, ${count} ${voteWord}`
}

export function filtersActive(state: TripState): boolean {
  return state.maxBudget != null || state.maxMinutes != null || state.vibes.length > 0
}

export function destinationById(id: string): Destination | undefined {
  return destinations.find((dest) => dest.id === id)
}

export function bestIndex(values: number[], mode: "min" | "max"): number | null {
  if (values.length < 2) return null
  const target = mode === "min" ? Math.min(...values) : Math.max(...values)
  const matches = values.reduce<number[]>((indexes, value, index) => {
    if (value === target) indexes.push(index)
    return indexes
  }, [])
  return matches.length === 1 ? matches[0] : null
}

export function isAllowedBudget(value: number | null): boolean {
  return BUDGET_FILTERS.some((option) => option.max === value)
}

export function isAllowedTravel(value: number | null): boolean {
  return TRAVEL_FILTERS.some((option) => option.max === value)
}

export function isVibe(value: string): value is VibeId {
  return value === "coast" || value === "desert" || value === "city" || value === "wine" || value === "art"
}
