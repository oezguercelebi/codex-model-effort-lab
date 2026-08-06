import type {
  BudgetBreakdown,
  Destination,
  Member,
  OriginId,
  SortKey,
  Tally,
  TravelOption,
  VibeId,
  VoteValue,
} from "../types"
import { clamp } from "./format"

export const VOTE_WEIGHT: Record<VoteValue, number> = { yes: 2, maybe: 1, no: 0 }

export function travelKey(originId: OriginId, destinationId: string): string {
  return `${originId}::${destinationId}`
}

export function travelOptionsFor(
  destination: Destination,
  originId: OriginId,
): TravelOption[] {
  return destination.travel[originId]
}

export function selectedTravel(
  destination: Destination,
  originId: OriginId,
  choices: Record<string, number>,
): { option: TravelOption; index: number; options: TravelOption[] } {
  const options = travelOptionsFor(destination, originId)
  const raw = choices[travelKey(originId, destination.id)] ?? 0
  const index = clamp(raw, 0, options.length - 1)
  return { option: options[index], index, options }
}

export interface BudgetInput {
  destination: Destination
  travel: TravelOption
  nights: number
  groupSize: number
}

/**
 * The group books whole places, so lodging per head drops as more people come
 * — until the party outgrows a unit and a second one is needed.
 */
export function computeBudget({
  destination,
  travel,
  nights,
  groupSize,
}: BudgetInput): BudgetBreakdown {
  const size = Math.max(1, groupSize)
  const days = nights + 1
  const units = Math.max(1, Math.ceil(size / destination.stay.sleeps))
  const lodgingTotal = destination.stay.nightlyTotal * units * nights
  const lodging = lodgingTotal / size
  const food = destination.dailyFood * days
  const activities = destination.dailyActivities * days
  const total = travel.price + lodging + food + activities

  return {
    travel: travel.price,
    lodging,
    food,
    activities,
    total,
    groupTotal: total * size,
    units,
  }
}

export function attendingMembers(members: Member[], attending: Record<string, boolean>) {
  return members.filter((member) => attending[member.id] ?? member.attending)
}

export function tallyFor(
  destinationId: string,
  votes: Record<string, Record<string, VoteValue>>,
  voterIds: string[],
): Tally {
  let yes = 0
  let maybe = 0
  let no = 0
  let cast = 0

  for (const voterId of voterIds) {
    const vote = votes[voterId]?.[destinationId]
    if (!vote) continue
    cast += 1
    if (vote === "yes") yes += 1
    else if (vote === "maybe") maybe += 1
    else no += 1
  }

  const score = yes * VOTE_WEIGHT.yes + maybe * VOTE_WEIGHT.maybe
  const maxScore = Math.max(1, voterIds.length * VOTE_WEIGHT.yes)

  return {
    yes,
    maybe,
    no,
    score,
    maxScore,
    pending: voterIds.length - cast,
    ratio: score / maxScore,
  }
}

export interface MatchInput {
  destination: Destination
  total: number
  hours: number
  budgetCap: number
  maxTravelHours: number
  vibes: VibeId[]
  crew: Member[]
}

export interface MatchResult {
  score: number
  budget: number
  travel: number
  vibe: number
  crew: number
}

/** A 0–100 read on how well a destination fits the current trip settings. */
export function matchScore({
  destination,
  total,
  hours,
  budgetCap,
  maxTravelHours,
  vibes,
  crew,
}: MatchInput): MatchResult {
  const budgetFit =
    total <= budgetCap
      ? 82 + 18 * (1 - total / Math.max(1, budgetCap))
      : clamp(82 - ((total - budgetCap) / Math.max(1, budgetCap)) * 190, 0, 82)

  const travelFit =
    hours <= maxTravelHours
      ? 82 + 18 * (1 - hours / Math.max(0.5, maxTravelHours))
      : clamp(82 - ((hours - maxTravelHours) / Math.max(0.5, maxTravelHours)) * 170, 0, 82)

  const vibeFit = vibes.length
    ? (vibes.filter((vibe) => destination.vibes.includes(vibe)).length / vibes.length) * 100
    : 72

  const crewHits = crew.filter((member) =>
    member.wants.some((want) => destination.vibes.includes(want)),
  ).length
  const crewFit = crew.length ? (crewHits / crew.length) * 100 : 70

  const score = budgetFit * 0.3 + travelFit * 0.25 + vibeFit * 0.28 + crewFit * 0.17

  return {
    score: Math.round(clamp(score, 0, 100)),
    budget: Math.round(budgetFit),
    travel: Math.round(travelFit),
    vibe: Math.round(vibeFit),
    crew: Math.round(crewFit),
  }
}

export interface DestinationCard {
  destination: Destination
  budget: BudgetBreakdown
  travel: TravelOption
  travelIndex: number
  travelOptions: TravelOption[]
  tally: Tally
  match: MatchResult
  yourVote: VoteValue | undefined
  overBudget: boolean
  overTime: boolean
  crewFans: Member[]
}

export interface BuildInput {
  destinations: Destination[]
  originId: OriginId
  nights: number
  crew: Member[]
  travelChoice: Record<string, number>
  votes: Record<string, Record<string, VoteValue>>
  budgetCap: number
  maxTravelHours: number
  vibes: VibeId[]
  youId: string
}

export function buildCards(input: BuildInput): DestinationCard[] {
  const voterIds = input.crew.map((member) => member.id)
  return input.destinations.map((destination) => {
    const { option, index, options } = selectedTravel(
      destination,
      input.originId,
      input.travelChoice,
    )
    const budget = computeBudget({
      destination,
      travel: option,
      nights: input.nights,
      groupSize: input.crew.length,
    })
    const match = matchScore({
      destination,
      total: budget.total,
      hours: option.hours,
      budgetCap: input.budgetCap,
      maxTravelHours: input.maxTravelHours,
      vibes: input.vibes,
      crew: input.crew,
    })

    return {
      destination,
      budget,
      travel: option,
      travelIndex: index,
      travelOptions: options,
      tally: tallyFor(destination.id, input.votes, voterIds),
      match,
      yourVote: input.votes[input.youId]?.[destination.id],
      overBudget: budget.total > input.budgetCap,
      overTime: option.hours > input.maxTravelHours,
      crewFans: input.crew.filter((member) =>
        member.wants.some((want) => destination.vibes.includes(want)),
      ),
    }
  })
}

export interface FilterInput {
  search: string
  vibes: VibeId[]
  budgetCap: number
  maxTravelHours: number
  strictBudget: boolean
  strictTravel: boolean
}

export function filterCards(cards: DestinationCard[], filters: FilterInput): DestinationCard[] {
  const needle = filters.search.trim().toLowerCase()
  return cards.filter((card) => {
    const { destination } = card
    if (filters.strictBudget && card.overBudget) return false
    if (filters.strictTravel && card.overTime) return false
    if (filters.vibes.length && !filters.vibes.every((vibe) => destination.vibes.includes(vibe))) {
      return false
    }
    if (!needle) return true
    return [
      destination.name,
      destination.country,
      destination.region,
      destination.tagline,
      destination.summary,
      ...destination.knownFor,
    ]
      .join(" ")
      .toLowerCase()
      .includes(needle)
  })
}

export function sortCards(cards: DestinationCard[], sort: SortKey): DestinationCard[] {
  const sorted = [...cards]
  switch (sort) {
    case "votes":
      sorted.sort(
        (a, b) =>
          b.tally.score - a.tally.score ||
          b.tally.yes - a.tally.yes ||
          b.match.score - a.match.score,
      )
      break
    case "price":
      sorted.sort((a, b) => a.budget.total - b.budget.total)
      break
    case "travel":
      sorted.sort((a, b) => a.travel.hours - b.travel.hours)
      break
    case "name":
      sorted.sort((a, b) => a.destination.name.localeCompare(b.destination.name))
      break
    default:
      sorted.sort(
        (a, b) => b.match.score - a.match.score || b.tally.score - a.tally.score,
      )
  }
  return sorted
}

export function rankCards(cards: DestinationCard[]): DestinationCard[] {
  return sortCards(cards, "votes")
}

/** Sum of the per-person costs attached to itinerary items, by day. */
export function dayPlannedSpend(destination: Destination, dayId: string): number {
  const day = destination.itinerary.find((entry) => entry.id === dayId)
  if (!day) return 0
  return day.items.reduce((sum, item) => sum + (item.cost ?? 0), 0)
}
