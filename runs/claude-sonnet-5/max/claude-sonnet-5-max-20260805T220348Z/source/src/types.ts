import type { LucideIcon } from "lucide-react"

export type TravelMode = "flight" | "drive"

export interface BudgetLineItem {
  label: string
  low: number
  high: number
}

export interface Budget {
  low: number
  high: number
  items: BudgetLineItem[]
}

export interface Weather {
  high: number
  low: number
  condition: string
  icon: LucideIcon
}

export interface Travel {
  mode: TravelMode
  duration: string
  durationMinutes: number
  distanceMiles: number
  detail: string
}

export type ItineraryCategory = "travel" | "food" | "activity" | "lodging" | "downtime"

export interface ItineraryItem {
  time: string
  title: string
  description: string
  category: ItineraryCategory
  icon: LucideIcon
}

export interface ItineraryDay {
  label: string
  dateOffset: number
  summary: string
  items: ItineraryItem[]
}

export interface Lodging {
  name: string
  type: string
  pricePerNight: number
  rating: number
  neighborhood: string
}

export interface Destination {
  id: string
  name: string
  region: string
  tagline: string
  description: string
  vibes: string[]
  travel: Travel
  budget: Budget
  weather: Weather
  highlights: string[]
  icon: LucideIcon
  gradient: string
  glow: string
  lodging: Lodging
  itinerary: ItineraryDay[]
  packingNotes: string[]
}

export interface Friend {
  id: string
  name: string
  initials: string
  color: string
  ring: string
  isYou?: boolean
}

/** Maps friend id -> destination id they voted for, or null if undecided. */
export type VotesState = Record<string, string | null>

export type SortKey = "votes" | "budget" | "travel" | "az"

export type ViewMode = "grid" | "table"

export type TabKey = "destinations" | "itinerary"
