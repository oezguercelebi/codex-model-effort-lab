export type Vibe =
  | "beach"
  | "city"
  | "nature"
  | "food"
  | "nightlife"
  | "culture"
  | "budget"
  | "wellness"

export type TravelMode = "drive" | "train" | "fly"

export type LodgingTier = "hostel" | "midrange" | "boutique"

export interface Coords {
  lat: number
  lon: number
}

export interface Origin {
  id: string
  city: string
  country: string
  coords: Coords
}

export interface ItineraryItem {
  time: string
  title: string
  detail: string
  kind: "travel" | "food" | "activity" | "rest" | "nightlife"
  cost?: number
}

export interface ItineraryDay {
  label: string
  subtitle: string
  items: ItineraryItem[]
}

export interface Destination {
  id: string
  name: string
  country: string
  region: string
  coords: Coords
  tagline: string
  summary: string
  vibes: Vibe[]
  /** Nightly price per person, mid-range tier, in EUR. */
  lodgingPerNight: number
  /** Food + drink per person per day, in EUR. */
  foodPerDay: number
  /** Typical activities + local transport per person per day, in EUR. */
  activitiesPerDay: number
  /** 0-100, how walkable / easy the weekend feels. */
  easeScore: number
  weather: { label: string; highC: number; lowC: number; rainChance: number }
  highlights: string[]
  knownFor: string
  bestFor: string
  watchOut: string
  accent: { from: string; to: string; ring: string; text: string }
  itinerary: ItineraryDay[]
}

export type VoteValue = "in" | "maybe" | "out"

export interface Member {
  id: string
  name: string
  initials: string
  color: string
  /** Personal all-in budget ceiling for the weekend, in EUR. */
  budget: number
  isYou?: boolean
  note?: string
}

export interface TripSettings {
  originId: string
  nights: number
  departure: string
  lodging: LodgingTier
  budgetCap: number
  travelers: number
}

export interface TravelEstimate {
  mode: TravelMode
  distanceKm: number
  /** Door-to-door one-way hours. */
  hours: number
  /** Round trip cost per person, in EUR. */
  cost: number
  label: string
}

export interface CostBreakdown {
  travel: number
  lodging: number
  food: number
  activities: number
  total: number
}

export interface Scored {
  destination: Destination
  travel: TravelEstimate
  cost: CostBreakdown
  votes: Record<string, VoteValue>
  score: number
  tally: { in: number; maybe: number; out: number }
  overBudgetFor: Member[]
  fitsFilters: boolean
}
