export type Tab = "explore" | "votes" | "plan"

export type Vibe =
  | "Beach"
  | "City"
  | "Nature"
  | "Food"
  | "Nightlife"
  | "Culture"
  | "Budget"
  | "Adventure"
  | "Chill"

export type TravelMode = "flight" | "train" | "car" | "bus"

export interface TravelOption {
  mode: TravelMode
  durationMin: number
  pricePerPerson: number
  note: string
}

/** Per person, in euros, for the full weekend (2 nights). */
export interface BudgetBreakdown {
  travel: number
  stay: number
  food: number
  activities: number
}

export type ItemCategory =
  | "travel"
  | "food"
  | "sight"
  | "outdoors"
  | "nightlife"
  | "chill"

export interface ItineraryItem {
  time: string
  title: string
  note: string
  category: ItemCategory
  /** Per person, euros. 0 = free. */
  cost: number
}

export interface ItineraryDay {
  label: string
  date: string
  items: ItineraryItem[]
}

export type ArtVariant = "coast" | "city" | "mountains" | "harbor"

export interface DestinationArt {
  variant: ArtVariant
  skyFrom: string
  skyTo: string
  sun: string
  land: string
}

export interface Destination {
  id: string
  name: string
  country: string
  tagline: string
  vibes: Vibe[]
  art: DestinationArt
  /** Typical mid-September temperatures, °C. */
  tempHigh: number
  tempLow: number
  rainChance: number
  budget: BudgetBreakdown
  travel: TravelOption[]
  stay: string
  highlights: string[]
  itinerary: ItineraryDay[]
}

export interface Friend {
  id: string
  name: string
  color: string
  /** Max per-person budget for the weekend, euros. */
  maxBudget: number
  comment: string
  /** Destination ids this friend approved. Seeded for everyone except you. */
  votes: string[]
  isYou?: boolean
}

export interface PackingItem {
  id: string
  label: string
}

export interface PackingState {
  checked: string[]
  custom: PackingItem[]
}

export interface Standing {
  destination: Destination
  voters: Friend[]
  count: number
}
