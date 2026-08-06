export type VibeId =
  | "nature"
  | "city"
  | "food"
  | "nightlife"
  | "beach"
  | "culture"
  | "adventure"
  | "chill"

export type SceneryKind =
  | "coast"
  | "city"
  | "alpine"
  | "oldtown"
  | "lake"
  | "cliffs"
  | "forest"

export type TravelMode = "plane" | "train" | "car" | "bus" | "ferry"

export type WeatherCondition = "sunny" | "partly" | "cloudy" | "rain" | "snow"

export type VoteValue = "yes" | "maybe" | "no"

export type OriginId = "berlin" | "munich" | "hamburg"

export interface Origin {
  id: OriginId
  city: string
  hub: string
}

export interface Member {
  id: string
  name: string
  initials: string
  color: string
  /** Short line shown in the crew list. */
  note: string
  attending: boolean
  /** Vibes this person keeps asking for — used for the crew-fit read-out. */
  wants: VibeId[]
}

export interface TravelOption {
  mode: TravelMode
  /** Door-to-door hours, one way. */
  hours: number
  /** Return trip, per person, in EUR. */
  price: number
  label: string
  detail: string
  /** Round trip, per person, kg CO2e. */
  co2: number
}

export interface Stay {
  name: string
  kind: string
  /** Nightly price for the whole unit, in EUR. */
  nightlyTotal: number
  /** How many people the unit sleeps. */
  sleeps: number
  rating: number
  note: string
}

export interface Highlight {
  title: string
  detail: string
  icon: HighlightIcon
}

export type HighlightIcon =
  | "food"
  | "view"
  | "walk"
  | "water"
  | "night"
  | "museum"
  | "market"
  | "hike"
  | "coffee"
  | "boat"

export type ItineraryTag = "travel" | "food" | "activity" | "stay" | "free"

export interface ItineraryItem {
  time: string
  title: string
  detail: string
  tag: ItineraryTag
  /** Per person, in EUR. Omitted when it is already covered by the budget lines. */
  cost?: number
}

export interface ItineraryDay {
  id: string
  label: string
  subtitle: string
  items: ItineraryItem[]
}

export interface Stats {
  /** 1–5 scales used by the compare view. */
  food: number
  nature: number
  nightlife: number
  walkability: number
  crowds: number
}

export interface Destination {
  id: string
  name: string
  country: string
  region: string
  tagline: string
  summary: string
  scenery: SceneryKind
  palette: {
    skyTop: string
    skyBottom: string
    sun: string
    far: string
    mid: string
    near: string
    accent: string
  }
  vibes: VibeId[]
  travel: Record<OriginId, TravelOption[]>
  stay: Stay
  /** Per person, per day, in EUR. */
  dailyFood: number
  dailyActivities: number
  weather: {
    condition: WeatherCondition
    highC: number
    lowC: number
    rainChance: number
    note: string
  }
  stats: Stats
  highlights: Highlight[]
  knownFor: string[]
  heads: string
  packing: string[]
  itinerary: ItineraryDay[]
}

export interface BudgetBreakdown {
  travel: number
  lodging: number
  food: number
  activities: number
  total: number
  /** Whole-group total, in EUR. */
  groupTotal: number
  units: number
}

export interface Tally {
  yes: number
  maybe: number
  no: number
  score: number
  maxScore: number
  pending: number
  ratio: number
}

export type SortKey = "match" | "votes" | "price" | "travel" | "name"

export type ViewId = "explore" | "compare" | "vote" | "plan"
