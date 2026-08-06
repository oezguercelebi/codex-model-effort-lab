import { crew } from "../data/trip"
import type {
  BudgetBreakdown,
  CrewMember,
  Destination,
  SortKey,
  Tally,
  TravelOption,
  Vibe,
  VoteValue,
} from "../types"
import { currency, minutesToLabel } from "./format"

export const VOTE_WEIGHT: Record<VoteValue, number> = { love: 2, yes: 1, pass: -1 }

/** Nightly rate for an extra room when the group outgrows the listing. */
const EXTRA_ROOM_NIGHTLY = 140

export function travelOptions(dest: Destination): TravelOption[] {
  return [dest.travel.primary, ...dest.travel.alternatives]
}

export function selectedTravel(
  dest: Destination,
  choices: Record<string, string>,
): TravelOption {
  const picked = choices[dest.id]
  return travelOptions(dest).find((o) => o.mode === picked) ?? dest.travel.primary
}

export type Plan = {
  travelers: number
  nights: number
  budgetCap: number
  maxTravelMinutes: number
  travelChoices: Record<string, string>
}

export function budgetFor(dest: Destination, plan: Plan): BudgetBreakdown & { overflowRooms: number } {
  const option = selectedTravel(dest, plan.travelChoices)
  const days = plan.nights + 1
  const overflowRooms =
    plan.travelers > dest.costs.lodgingSleeps
      ? Math.ceil((plan.travelers - dest.costs.lodgingSleeps) / 2)
      : 0
  const nightly = dest.costs.lodgingPerNight + overflowRooms * EXTRA_ROOM_NIGHTLY
  const travel = option.costPerPerson
  const lodging = Math.round((nightly * plan.nights) / plan.travelers)
  const food = dest.costs.foodPerPersonPerDay * days
  const activities = dest.costs.activitiesPerPerson
  return {
    travel,
    lodging,
    food,
    activities,
    total: travel + lodging + food + activities,
    overflowRooms,
  }
}

export function groupTotal(dest: Destination, plan: Plan): number {
  return budgetFor(dest, plan).total * plan.travelers
}

/* --------------------------------- votes -------------------------------- */

export type VoteBook = Record<string, Record<string, VoteValue>>

export function tallyFor(destinationId: string, votes: VoteBook): Tally {
  let score = 0
  let love = 0
  let yes = 0
  let pass = 0
  for (const member of crew) {
    const v = votes[member.id]?.[destinationId]
    if (!v) continue
    score += VOTE_WEIGHT[v]
    if (v === "love") love += 1
    else if (v === "yes") yes += 1
    else pass += 1
  }
  const votesCast = love + yes + pass
  return {
    destinationId,
    score,
    love,
    yes,
    pass,
    votesCast,
    consensus: votesCast === 0 ? 0 : (love + yes) / votesCast,
  }
}

export function maxPossibleScore(): number {
  return crew.length * VOTE_WEIGHT.love
}

/** Bar width for a tally, mapped onto the 0…max range with negatives clamped. */
export function tallyFraction(tally: Tally): number {
  return Math.max(0, tally.score) / maxPossibleScore()
}

export function memberVoteCount(memberId: string, votes: VoteBook, total: number): number {
  const book = votes[memberId]
  if (!book) return 0
  return Math.min(total, Object.keys(book).length)
}

/* ---------------------------------- fit --------------------------------- */

export type Fit = {
  score: number
  matchedCrew: CrewMember[]
  reasons: { tone: "good" | "warn"; text: string }[]
}

export function fitFor(dest: Destination, plan: Plan): Fit {
  const matchedCrew = crew.filter((m) => m.wants.some((w) => dest.vibes.includes(w)))
  const vibeScore = matchedCrew.length / crew.length

  const total = budgetFor(dest, plan).total
  const over = total - plan.budgetCap
  const budgetScore =
    over <= 0
      ? 0.7 + 0.3 * Math.min(1, -over / plan.budgetCap / 0.35)
      : Math.max(0, 0.7 - (over / plan.budgetCap) * 2.2)

  const minutes = selectedTravel(dest, plan.travelChoices).minutes
  const overTime = minutes - plan.maxTravelMinutes
  const travelScore =
    overTime <= 0
      ? 0.45 + 0.55 * (1 - minutes / plan.maxTravelMinutes)
      : Math.max(0, 0.45 - (overTime / plan.maxTravelMinutes) * 1.5)

  const score = Math.round(100 * (0.45 * vibeScore + 0.3 * budgetScore + 0.25 * travelScore))

  const reasons: Fit["reasons"] = []
  reasons.push({
    tone: matchedCrew.length >= crew.length / 2 ? "good" : "warn",
    text: `${matchedCrew.length} of ${crew.length} people get a vibe they asked for`,
  })
  reasons.push(
    over <= 0
      ? { tone: "good", text: `${currency(-over)} per person under the group cap` }
      : { tone: "warn", text: `${currency(over)} per person over the group cap` },
  )
  reasons.push(
    overTime <= 0
      ? { tone: "good", text: `${minutesToLabel(minutes)} door to door` }
      : { tone: "warn", text: `${minutesToLabel(minutes)} each way — longer than you wanted` },
  )
  if (dest.costs.lodgingSleeps < plan.travelers) {
    reasons.push({
      tone: "warn",
      text: `The stay sleeps ${dest.costs.lodgingSleeps} — you'd need an extra room`,
    })
  }
  return { score, matchedCrew, reasons }
}

/* ------------------------------- filtering ------------------------------ */

export type Filters = {
  vibes: Vibe[]
  search: string
}

export function passesFilters(dest: Destination, plan: Plan, filters: Filters): boolean {
  if (budgetFor(dest, plan).total > plan.budgetCap) return false
  if (selectedTravel(dest, plan.travelChoices).minutes > plan.maxTravelMinutes) return false
  if (filters.vibes.length > 0 && !filters.vibes.some((v) => dest.vibes.includes(v))) return false
  const q = filters.search.trim().toLowerCase()
  if (q) {
    const haystack = `${dest.name} ${dest.region} ${dest.tagline} ${dest.vibes.join(" ")}`.toLowerCase()
    if (!haystack.includes(q)) return false
  }
  return true
}

export function sortDestinations(
  list: Destination[],
  key: SortKey,
  plan: Plan,
  votes: VoteBook,
): Destination[] {
  const copy = [...list]
  copy.sort((a, b) => {
    switch (key) {
      case "price-asc":
        return budgetFor(a, plan).total - budgetFor(b, plan).total
      case "travel-asc":
        return (
          selectedTravel(a, plan.travelChoices).minutes -
          selectedTravel(b, plan.travelChoices).minutes
        )
      case "votes-desc": {
        const d = tallyFor(b.id, votes).score - tallyFor(a.id, votes).score
        return d !== 0 ? d : fitFor(b, plan).score - fitFor(a, plan).score
      }
      case "name":
        return a.name.localeCompare(b.name)
      case "fit":
      default: {
        const d = fitFor(b, plan).score - fitFor(a, plan).score
        return d !== 0 ? d : a.name.localeCompare(b.name)
      }
    }
  })
  return copy
}

/* ------------------------------- standings ------------------------------ */

export type Standing = {
  destination: Destination
  tally: Tally
  fit: Fit
  rank: number
}

export function standings(list: Destination[], plan: Plan, votes: VoteBook): Standing[] {
  const rows = list.map((destination) => ({
    destination,
    tally: tallyFor(destination.id, votes),
    fit: fitFor(destination, plan),
    rank: 0,
  }))
  rows.sort((a, b) => {
    if (b.tally.score !== a.tally.score) return b.tally.score - a.tally.score
    if (b.tally.love !== a.tally.love) return b.tally.love - a.tally.love
    return b.fit.score - a.fit.score
  })
  rows.forEach((row, i) => {
    row.rank = i + 1
  })
  return rows
}

export function leaderState(rows: Standing[]): {
  leader: Standing | null
  tiedWith: Standing[]
} {
  if (rows.length === 0) return { leader: null, tiedWith: [] }
  const leader = rows[0]
  const tiedWith = rows.slice(1).filter((r) => r.tally.score === leader.tally.score)
  return { leader, tiedWith }
}
