export type VibeId =
  | "nature"
  | "food"
  | "nightlife"
  | "culture"
  | "chill"
  | "adventure"
  | "beach"

export type TravelMode = "train" | "flight" | "car" | "bus"

export type SceneId = "oldtown" | "harbor" | "canal" | "coast" | "mountains" | "lake" | "city"

export type Vibe = {
  id: VibeId
  label: string
  /** Short line used in filter chips and tooltips. */
  hint: string
}

export type TravelOption = {
  mode: TravelMode
  /** Door-to-door duration one way, in hours. */
  hours: number
  /** Round-trip price per person in EUR. Cars are priced per vehicle instead. */
  pricePerPerson?: number
  /** Round-trip fuel + tolls for one car, split across everyone riding along. */
  pricePerCar?: number
  /** Seats per vehicle, used to work out how many cars the group needs. */
  seatsPerCar?: number
  /** Round-trip CO₂ per person, kilograms. */
  co2: number
  note: string
}

export type Stay = {
  name: string
  kind: string
  /** Nightly price for the whole place, sleeping up to `sleeps` people. */
  nightlyBase: number
  sleeps: number
  /** Nightly surcharge for each guest beyond `sleeps`. */
  extraPerPerson: number
  rating: number
  walkMinutes: number
}

export type DailySpend = {
  food: number
  activities: number
  local: number
}

export type Weather = {
  highC: number
  lowC: number
  summary: string
  rainChance: number
}

export type Destination = {
  id: string
  name: string
  country: string
  countryCode: string
  tagline: string
  blurb: string
  scene: SceneId
  palette: [string, string, string, string, string, string]
  /** Recommended option first — the itinerary is written around it. */
  travel: TravelOption[]
  stay: Stay
  daily: DailySpend
  ratings: Record<VibeId, number>
  weather: Weather
  highlights: string[]
  knownFor: string[]
  crowd: "quiet" | "steady" | "busy"
  walkScore: number
  localTip: string
}

export type ItineraryBlockKind =
  | "travel"
  | "food"
  | "sight"
  | "outdoors"
  | "nightlife"
  | "chill"

export type ItineraryBlock = {
  id: string
  day: 0 | 1 | 2
  time: string
  title: string
  detail: string
  /** Per-person cost in EUR. */
  cost: number
  kind: ItineraryBlockKind
  /** Group member id who put this on the list. */
  by?: string
  /** Optional add-ons start switched off and can be added to the plan. */
  optional?: boolean
}

export type Itinerary = {
  destinationId: string
  summary: string
  blocks: ItineraryBlock[]
  packing: string[]
}

export type Member = {
  id: string
  name: string
  initials: string
  hue: number
  /** Weighting per vibe, 0–5, used to work out how well a trip suits them. */
  weights: Record<VibeId, number>
  blurb: string
  going: boolean
}

export type VoteValue = "in" | "maybe" | "out"

export type Weekend = {
  id: string
  label: string
  range: string
  nights: number
  /** Multiplier applied to travel and lodging for that date range. */
  priceIndex: number
  /** Degrees added to the forecast for that date range. */
  tempDelta: number
  note: string
}
