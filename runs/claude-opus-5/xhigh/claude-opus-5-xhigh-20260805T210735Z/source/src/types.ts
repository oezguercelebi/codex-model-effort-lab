export type Vibe =
  | "Beach"
  | "Mountains"
  | "Big city"
  | "Food & drink"
  | "Nightlife"
  | "Nature"
  | "Culture"
  | "Slow & spa"

export type TravelMode = "drive" | "train" | "fly" | "ferry"

export type VoteValue = "love" | "yes" | "pass"

export type Scene = "coast" | "mountains" | "city" | "forest" | "harbor"

export type ArtPalette = {
  skyTop: string
  skyBottom: string
  sun: string
  far: string
  mid: string
  near: string
  water: string
}

export type TravelOption = {
  mode: TravelMode
  /** Realistic door-to-door minutes, including transfers and buffers. */
  minutes: number
  label: string
  detail: string
  costPerPerson: number
}

export type Destination = {
  id: string
  name: string
  region: string
  tagline: string
  summary: string
  scene: Scene
  palette: ArtPalette
  vibes: Vibe[]
  travel: {
    primary: TravelOption
    alternatives: TravelOption[]
  }
  costs: {
    /** Whole-group nightly rate for the stay — splits across travelers. */
    lodgingPerNight: number
    lodgingLabel: string
    lodgingSleeps: number
    foodPerPersonPerDay: number
    activitiesPerPerson: number
  }
  weather: { highF: number; lowF: number; label: string }
  crowd: "Quiet" | "Balanced" | "Buzzing"
  walkability: number
  highlights: { title: string; detail: string }[]
  headsUp: string
  bestFor: string
}

export type CrewMember = {
  id: string
  name: string
  initials: string
  role: string
  wants: Vibe[]
  isYou?: boolean
}

export type ItineraryKind =
  | "travel"
  | "food"
  | "activity"
  | "outdoors"
  | "nightlife"
  | "rest"
  | "checkin"

export type ItineraryItem = {
  id: string
  time: string
  title: string
  detail: string
  kind: ItineraryKind
  costPerPerson: number
  durationLabel: string
  /** Optional swap so the plan feels editable rather than fixed. */
  alt?: {
    title: string
    detail: string
    kind: ItineraryKind
    costPerPerson: number
    durationLabel: string
  }
}

export type ItineraryDay = {
  id: string
  label: string
  dayName: string
  subtitle: string
  items: ItineraryItem[]
}

export type Itinerary = {
  destinationId: string
  intro: string
  days: ItineraryDay[]
  packing: string[]
  bookNow: { id: string; label: string; detail: string }[]
}

export type BudgetBreakdown = {
  travel: number
  lodging: number
  food: number
  activities: number
  total: number
}

export type Tally = {
  destinationId: string
  score: number
  love: number
  yes: number
  pass: number
  votesCast: number
  /** Share of cast votes that were positive, 0–1. */
  consensus: number
}

export type SortKey = "fit" | "price-asc" | "travel-asc" | "votes-desc" | "name"

export type ViewKey = "explore" | "compare" | "vote" | "plan"
