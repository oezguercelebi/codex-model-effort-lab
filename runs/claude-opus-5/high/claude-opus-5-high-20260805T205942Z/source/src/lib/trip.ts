import { VIBES } from "../data/destinations"
import { ITINERARY_BY_DESTINATION } from "../data/itineraries"
import type {
  Destination,
  ItineraryBlock,
  Member,
  TravelMode,
  TravelOption,
  VibeId,
  VoteValue,
  Weekend,
} from "../types"

export type PricedTravel = {
  option: TravelOption
  /** Round-trip cost per person, already split across the group where relevant. */
  perPerson: number
  cars?: number
}

export type CostBreakdown = {
  travel: number
  stay: number
  food: number
  activities: number
  local: number
  total: number
}

export const VOTE_WEIGHT: Record<VoteValue, number> = { in: 2, maybe: 1, out: 0 }

export function priceTravel(
  option: TravelOption,
  groupSize: number,
  weekend: Weekend,
): PricedTravel {
  if (option.pricePerCar != null) {
    const seats = option.seatsPerCar ?? 5
    const cars = Math.max(1, Math.ceil(groupSize / seats))
    const perPerson = (option.pricePerCar * cars * weekend.priceIndex) / Math.max(1, groupSize)
    return { option, perPerson, cars }
  }
  return { option, perPerson: (option.pricePerPerson ?? 0) * weekend.priceIndex }
}

export function travelOptions(
  destination: Destination,
  groupSize: number,
  weekend: Weekend,
): PricedTravel[] {
  return destination.travel.map((option) => priceTravel(option, groupSize, weekend))
}

export function findTravel(
  destination: Destination,
  mode: TravelMode | undefined,
  groupSize: number,
  weekend: Weekend,
): PricedTravel {
  const options = travelOptions(destination, groupSize, weekend)
  return options.find((o) => o.option.mode === mode) ?? defaultTravel(options)
}

/**
 * Each destination lists its travel options with the recommended one first — the way
 * the sample itinerary assumes you'll arrive.
 */
function defaultTravel(options: PricedTravel[]): PricedTravel {
  return options[0]
}

export function stayPerPersonPerNight(destination: Destination, groupSize: number): number {
  const { nightlyBase, sleeps, extraPerPerson } = destination.stay
  const extras = Math.max(0, groupSize - sleeps)
  return (nightlyBase + extras * extraPerPerson) / Math.max(1, groupSize)
}

export function estimateCost(
  destination: Destination,
  travel: PricedTravel,
  groupSize: number,
  weekend: Weekend,
): CostBreakdown {
  const nights = weekend.nights
  const days = nights + 1
  const stay = stayPerPersonPerNight(destination, groupSize) * nights * weekend.priceIndex
  const food = destination.daily.food * days
  const activities = destination.daily.activities * days
  const local = destination.daily.local * days
  const travelCost = travel.perPerson
  return {
    travel: travelCost,
    stay,
    food,
    activities,
    local,
    total: travelCost + stay + food + activities + local,
  }
}

/** How well a destination matches one person's stated priorities, 0–1. */
export function memberFit(destination: Destination, member: Member): number {
  let weighted = 0
  let max = 0
  for (const vibe of VIBES) {
    const w = member.weights[vibe.id]
    weighted += w * destination.ratings[vibe.id]
    max += w * 100
  }
  return max === 0 ? 0 : weighted / max
}

export function groupFit(destination: Destination, members: Member[]): number {
  if (members.length === 0) return 0
  return members.reduce((sum, m) => sum + memberFit(destination, m), 0) / members.length
}

/** The vibe this destination serves best for a given person. */
export function topVibesFor(destination: Destination, count = 3): VibeId[] {
  return [...VIBES]
    .sort((a, b) => destination.ratings[b.id] - destination.ratings[a.id])
    .slice(0, count)
    .map((v) => v.id)
}

export type Tally = {
  in: string[]
  maybe: string[]
  out: string[]
  score: number
  /** Share of the maximum possible score, 0–1. */
  ratio: number
  cast: number
}

export function tallyVotes(
  destinationId: string,
  votes: Record<string, Record<string, VoteValue>>,
  members: Member[],
): Tally {
  const result: Tally = { in: [], maybe: [], out: [], score: 0, ratio: 0, cast: 0 }
  for (const member of members) {
    const vote = votes[member.id]?.[destinationId]
    if (!vote) continue
    result[vote].push(member.id)
    result.score += VOTE_WEIGHT[vote]
    result.cast += 1
  }
  const max = members.length * 2
  result.ratio = max === 0 ? 0 : result.score / max
  return result
}

/** 0–1: how much the group agrees, regardless of whether they like it. */
export function consensus(tally: Tally): number {
  if (tally.cast === 0) return 0
  const counts = [tally.in.length, tally.maybe.length, tally.out.length]
  return Math.max(...counts) / tally.cast
}

export type Ranked = {
  destination: Destination
  tally: Tally
  fit: number
  cost: CostBreakdown
  travel: PricedTravel
}

export function rankDestinations(rows: Ranked[]): Ranked[] {
  return [...rows].sort((a, b) => {
    if (b.tally.score !== a.tally.score) return b.tally.score - a.tally.score
    if (b.tally.in.length !== a.tally.in.length) return b.tally.in.length - a.tally.in.length
    return b.fit - a.fit
  })
}

export function selectedBlocks(
  destinationId: string,
  removed: string[],
  added: string[],
): ItineraryBlock[] {
  const itinerary = ITINERARY_BY_DESTINATION[destinationId]
  if (!itinerary) return []
  return itinerary.blocks.filter((block) => {
    if (block.optional) return added.includes(block.id)
    return !removed.includes(block.id)
  })
}

export function plannedTotal(
  destination: Destination,
  travel: PricedTravel,
  groupSize: number,
  weekend: Weekend,
  blocks: ItineraryBlock[],
): { travel: number; stay: number; onTheGround: number; total: number } {
  const stay = stayPerPersonPerNight(destination, groupSize) * weekend.nights * weekend.priceIndex
  const onTheGround = blocks.reduce((sum, b) => sum + b.cost, 0)
  return {
    travel: travel.perPerson,
    stay,
    onTheGround,
    total: travel.perPerson + stay + onTheGround,
  }
}

export function weatherFor(destination: Destination, weekend: Weekend) {
  return {
    ...destination.weather,
    highC: destination.weather.highC + weekend.tempDelta,
    lowC: destination.weather.lowC + Math.round(weekend.tempDelta * 0.7),
  }
}
