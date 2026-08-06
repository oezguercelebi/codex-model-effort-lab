export type TravelMode = "drive" | "flight"

export type TagName =
  | "Mountains"
  | "Hiking"
  | "Lake"
  | "Desert"
  | "Stargazing"
  | "City"
  | "Food"
  | "Nightlife"
  | "Beach"
  | "Surfing"
  | "Wine"
  | "Scenic"
  | "Coastal"

export interface Friend {
  id: string
  name: string
  initials: string
  bg: string
  fg: string
}

export interface BudgetBreakdown {
  travel: number
  stay: number
  food: number
  activities: number
}

export interface Weather {
  high: number
  low: number
  condition: string
}

export interface ItineraryItem {
  time: string
  title: string
  description: string
  icon: string
}

export interface ItineraryDay {
  day: "Friday" | "Saturday" | "Sunday"
  date: string
  items: ItineraryItem[]
}

export interface Destination {
  id: string
  name: string
  region: string
  tagline: string
  description: string
  icon: string
  gradient: string
  tags: TagName[]
  travel: {
    mode: TravelMode
    duration: string
    minutes: number
    distanceMiles: number
  }
  budget: BudgetBreakdown
  weather: Weather
  itinerary: ItineraryDay[]
}
