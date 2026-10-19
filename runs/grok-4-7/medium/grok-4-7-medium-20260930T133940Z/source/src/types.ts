export type VibeId = "coast" | "desert" | "city" | "wine" | "art"

export type SortKey = "votes" | "cost" | "travel" | "name"

export type TransportMode = "fly" | "drive"

export type Friend = {
  id: string
  name: string
  initial: string
  color: string
}

export type ItineraryBlock = {
  time: string
  title: string
  detail: string
}

export type ItineraryDay = {
  id: string
  label: string
  date: string
  blocks: ItineraryBlock[]
}

export type TravelStep = {
  label: string
  detail: string
}

export type Destination = {
  id: string
  name: string
  region: string
  tagline: string
  summary: string
  vibes: VibeId[]
  weather: string
  stay: string
  foodNote: string
  bestFor: string
  packing: string
  lodgingLabel: string
  lodgingTotal: number
  transportLabel: string
  transportMode: TransportMode
  personalTransport: number
  sharedTransportTotal: number
  foodEach: number
  activitiesEach: number
  doorToDoorMinutes: number
  travelSummary: string
  travelSteps: TravelStep[]
  highlights: string[]
  watchouts: string[]
  itinerary: ItineraryDay[]
}

export type TripState = {
  votes: Record<string, string | null>
  coming: Record<string, boolean>
  voterId: string
  compareIds: string[]
  maxBudget: number | null
  maxMinutes: number | null
  vibes: VibeId[]
  sort: SortKey
}

export type Route =
  | { name: "board" }
  | { name: "compare" }
  | { name: "plan" }
  | { name: "detail"; id: string }

export type BudgetLineId = "air" | "transport" | "lodging" | "food" | "activities"

export type BudgetLine = {
  id: BudgetLineId
  label: string
  amount: number
  note: string
}
