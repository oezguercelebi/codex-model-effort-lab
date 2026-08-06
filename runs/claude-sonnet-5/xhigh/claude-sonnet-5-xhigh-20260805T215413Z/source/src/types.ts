import type { LucideIcon } from "lucide-react"

export type VibeTag =
  | "Nature"
  | "Nightlife"
  | "Food & Drink"
  | "Relaxing"
  | "Culture"
  | "Beaches"
  | "Adventure"

export interface Member {
  id: string
  name: string
  colorClass: string
  isYou?: boolean
}

export interface BudgetBreakdown {
  lodging: number
  food: number
  activities: number
  transport: number
}

export interface Budget {
  low: number
  high: number
  typical: number
  breakdown: BudgetBreakdown
}

export type WeatherCondition = "sunny" | "partly-cloudy" | "cloudy" | "rainy"

export interface WeatherForecast {
  day: "Sat" | "Sun"
  high: number
  low: number
  condition: WeatherCondition
}

export interface ItineraryActivity {
  time: string
  title: string
  description: string
  icon: LucideIcon
}

export interface ItineraryDay {
  day: "Friday" | "Saturday" | "Sunday"
  summary: string
  activities: ItineraryActivity[]
}

export interface Destination {
  id: string
  name: string
  region: string
  tagline: string
  description: string
  vibeTags: VibeTag[]
  icon: LucideIcon
  gradient: string
  distanceMiles: number
  driveTimeMinutes: number
  budget: Budget
  weather: WeatherForecast[]
  highlights: string[]
  packingTip: string
  itinerary: ItineraryDay[]
}
