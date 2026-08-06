export interface BudgetBreakdown {
  flight: number
  stay: number
  food: number
  activities: number
}

export interface TravelTimes {
  flight?: number
  train?: number
  drive?: number
}

export interface ItineraryItem {
  time: string
  activity: string
  detail: string
}

export interface ItineraryDay {
  day: string
  label: string
  items: ItineraryItem[]
}

export interface Destination {
  id: string
  name: string
  region: string
  tagline: string
  tags: string[]
  gradient: string
  icon: "mountain" | "waves" | "building" | "trees" | "sun" | "landmark"
  travelTimes: TravelTimes
  pricePerPerson: number
  budget: BudgetBreakdown
  rating: number
  highlights: string[]
  bestFor: string
  weather: string
  itinerary: ItineraryDay[]
}

export interface Friend {
  id: string
  name: string
  initials: string
  color: string
  isYou?: boolean
}
