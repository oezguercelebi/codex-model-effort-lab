export type Vibe =
  | "beach"
  | "city"
  | "nature"
  | "food"
  | "nightlife"
  | "culture"
  | "wellness"
  | "adventure"

export type TravelMode = "train" | "flight" | "car" | "ferry"

export type Budget = {
  lodging: number
  food: number
  activities: number
  transport: number
}

export type ItineraryItem = {
  time: string
  title: string
  detail: string
  cost: number
  tag: "food" | "activity" | "travel" | "rest"
}

export type ItineraryDay = {
  label: string
  date: string
  summary: string
  items: ItineraryItem[]
}

export type Destination = {
  id: string
  name: string
  country: string
  tagline: string
  blurb: string
  vibes: Vibe[]
  travelHours: number
  travelMode: TravelMode
  travelNote: string
  budget: Budget
  weather: { high: number; low: number; summary: string }
  walkability: number
  highlights: string[]
  knownFor: string
  from: string
  to: string
  itinerary: ItineraryDay[]
}

export type Traveler = {
  id: string
  name: string
  initials: string
  accent: string
  budgetMax: number
  maxTravelHours: number
  loves: Vibe[]
}

export type VoteValue = "yes" | "maybe" | "no"

/** votes[travelerId][destinationId] */
export type Votes = Record<string, Record<string, VoteValue>>
