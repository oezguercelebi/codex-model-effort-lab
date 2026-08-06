import type {
  Coords,
  CostBreakdown,
  Destination,
  LodgingTier,
  Member,
  Origin,
  TravelEstimate,
  TravelMode,
  TripSettings,
  VoteValue,
} from "./types"

const VOTE_WEIGHT: Record<VoteValue, number> = { in: 2, maybe: 1, out: -2 }

export const LODGING_TIERS: { id: LodgingTier; label: string; hint: string; factor: number }[] = [
  { id: "hostel", label: "Hostel", hint: "Shared rooms, split everything", factor: 0.55 },
  { id: "midrange", label: "Mid-range", hint: "Apartment or 3-star hotel", factor: 1 },
  { id: "boutique", label: "Boutique", hint: "The nice one, once a year", factor: 1.75 },
]

export function haversineKm(a: Coords, b: Coords): number {
  const R = 6371
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return 2 * R * Math.asin(Math.sqrt(h))
}

/**
 * Roads and rails are never straight lines, so we inflate the great-circle
 * distance before turning it into a duration.
 */
const ROUTE_FACTOR = 1.24

function pickMode(destination: Destination, km: number): TravelMode {
  // An island always means flying; alpine valleys need a car at the far end.
  if (destination.id === "mallorca") return "fly"
  if (destination.id === "dolomites") return km <= 800 ? "drive" : "fly"
  if (km <= 320) return "drive"
  if (km <= 750) return "train"
  return "fly"
}

export function estimateTravel(origin: Origin, destination: Destination): TravelEstimate {
  const straight = haversineKm(origin.coords, destination.coords)
  const km = Math.round(straight * ROUTE_FACTOR)
  const mode = pickMode(destination, km)

  if (mode === "fly") {
    // Airport transfers, security, boarding, and baggage on the far side.
    const air = straight / 720
    const hours = round1(air + 3.4)
    // Return fare booked a few weeks out, not a last-minute walk-up.
    const cost = Math.round(clamp(70 + straight * 0.075, 90, 420))
    return { mode, distanceKm: km, hours, cost, label: `${formatHours(hours)} door to door` }
  }

  if (mode === "train") {
    const hours = round1(km / 105 + 0.6)
    const cost = Math.round(clamp(km * 0.13, 22, 150) * 2)
    return { mode, distanceKm: km, hours, cost, label: `${formatHours(hours)} by rail` }
  }

  const hours = round1(km / 88 + 0.5)
  // Fuel, tolls, and a rental share, split across a carful of four.
  const cost = Math.round(((km * 2 * 0.29 + 90) / 4) * 10) / 10
  return { mode, distanceKm: km, hours, cost: Math.round(cost), label: `${formatHours(hours)} drive` }
}

export function estimateCost(
  destination: Destination,
  travel: TravelEstimate,
  settings: TripSettings,
): CostBreakdown {
  const tier = LODGING_TIERS.find((t) => t.id === settings.lodging) ?? LODGING_TIERS[1]
  const nights = settings.nights
  const days = nights + 1
  const lodging = Math.round(destination.lodgingPerNight * tier.factor * nights)
  const food = Math.round(destination.foodPerDay * days)
  const activities = Math.round(destination.activitiesPerDay * days)
  const total = travel.cost + lodging + food + activities
  return { travel: travel.cost, lodging, food, activities, total }
}

export function scoreVotes(votes: Record<string, VoteValue>) {
  const tally = { in: 0, maybe: 0, out: 0 }
  let score = 0
  for (const value of Object.values(votes)) {
    tally[value] += 1
    score += VOTE_WEIGHT[value]
  }
  return { tally, score }
}

export function overBudgetFor(members: Member[], total: number): Member[] {
  return members.filter((m) => total > m.budget)
}

/** Consensus as a 0-100 percentage of the best possible score. */
export function consensusPct(score: number, voterCount: number): number {
  if (voterCount === 0) return 0
  const max = voterCount * VOTE_WEIGHT.in
  const min = voterCount * VOTE_WEIGHT.out
  return Math.round(((score - min) / (max - min)) * 100)
}

export function formatHours(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  if (h === 0) return `${m}m`
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

export function formatMoney(value: number): string {
  return `€${Math.round(value).toLocaleString("en-GB")}`
}

export function formatDateRange(departure: string, nights: number): string {
  const start = new Date(`${departure}T00:00:00`)
  if (Number.isNaN(start.getTime())) return "Dates to confirm"
  const end = new Date(start)
  end.setDate(end.getDate() + nights)
  const sameMonth = start.getMonth() === end.getMonth()
  const startText = start.toLocaleDateString("en-GB", {
    day: "numeric",
    month: sameMonth ? undefined : "short",
  })
  const endText = end.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
  return `${startText} – ${endText}`
}

export function weekdayOf(departure: string, offset: number): string {
  const d = new Date(`${departure}T00:00:00`)
  if (Number.isNaN(d.getTime())) return ""
  d.setDate(d.getDate() + offset)
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function round1(value: number): number {
  return Math.round(value * 10) / 10
}
