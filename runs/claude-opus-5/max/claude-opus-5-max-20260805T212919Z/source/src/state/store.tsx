import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react"
import { DESTINATIONS } from "../data/destinations"
import { DEFAULT_ORIGIN, MEMBERS, SEED_VOTES, YOU_ID } from "../data/trip"
import { clearStored, readStored, writeStored } from "../lib/hooks"
import {
  buildCards,
  filterCards,
  rankCards,
  sortCards,
  travelKey,
  type DestinationCard,
} from "../lib/trip"
import type { Destination, Member, OriginId, SortKey, VibeId, VoteValue } from "../types"

const STORAGE_KEY = "weekender.state.v2"

export interface TripState {
  originId: OriginId
  nights: number
  attending: Record<string, boolean>
  budgetCap: number
  maxTravelHours: number
  strictBudget: boolean
  strictTravel: boolean
  vibes: VibeId[]
  search: string
  sort: SortKey
  votes: Record<string, Record<string, VoteValue>>
  travelChoice: Record<string, number>
  compare: string[]
  lockedId: string | null
  prepDone: Record<string, boolean>
  packed: Record<string, boolean>
}

export const MAX_COMPARE = 3

const initialState: TripState = {
  originId: DEFAULT_ORIGIN,
  nights: 2,
  attending: Object.fromEntries(MEMBERS.map((member) => [member.id, member.attending])),
  budgetCap: 600,
  maxTravelHours: 8,
  strictBudget: true,
  strictTravel: true,
  vibes: [],
  search: "",
  sort: "match",
  votes: structuredClone(SEED_VOTES),
  travelChoice: {},
  compare: [],
  lockedId: null,
  prepDone: {},
  packed: {},
}

export type TripAction =
  | { type: "hydrate"; state: TripState }
  | { type: "origin"; originId: OriginId }
  | { type: "nights"; nights: number }
  | { type: "attending"; memberId: string; value: boolean }
  | { type: "budgetCap"; value: number }
  | { type: "maxTravelHours"; value: number }
  | { type: "strict"; field: "strictBudget" | "strictTravel"; value: boolean }
  | { type: "vibe"; vibe: VibeId }
  | { type: "search"; value: string }
  | { type: "sort"; value: SortKey }
  | { type: "vote"; memberId: string; destinationId: string; value: VoteValue | undefined }
  | { type: "clearMyVotes" }
  | { type: "travelChoice"; originId: OriginId; destinationId: string; index: number }
  | { type: "toggleCompare"; destinationId: string }
  | { type: "setCompare"; ids: string[] }
  | { type: "lock"; destinationId: string | null }
  | { type: "prep"; taskId: string; value: boolean }
  | { type: "pack"; key: string; value: boolean }
  | { type: "resetFilters" }
  | { type: "resetAll" }

function reducer(state: TripState, action: TripAction): TripState {
  switch (action.type) {
    case "hydrate":
      return action.state
    case "origin":
      return { ...state, originId: action.originId }
    case "nights":
      return { ...state, nights: action.nights }
    case "attending":
      return {
        ...state,
        attending: { ...state.attending, [action.memberId]: action.value },
      }
    case "budgetCap":
      return { ...state, budgetCap: action.value }
    case "maxTravelHours":
      return { ...state, maxTravelHours: action.value }
    case "strict":
      return { ...state, [action.field]: action.value }
    case "vibe":
      return {
        ...state,
        vibes: state.vibes.includes(action.vibe)
          ? state.vibes.filter((vibe) => vibe !== action.vibe)
          : [...state.vibes, action.vibe],
      }
    case "search":
      return { ...state, search: action.value }
    case "sort":
      return { ...state, sort: action.value }
    case "vote": {
      const current = { ...(state.votes[action.memberId] ?? {}) }
      if (action.value) current[action.destinationId] = action.value
      else delete current[action.destinationId]
      return { ...state, votes: { ...state.votes, [action.memberId]: current } }
    }
    case "clearMyVotes":
      return { ...state, votes: { ...state.votes, [YOU_ID]: {} } }
    case "travelChoice":
      return {
        ...state,
        travelChoice: {
          ...state.travelChoice,
          [travelKey(action.originId, action.destinationId)]: action.index,
        },
      }
    case "toggleCompare": {
      if (state.compare.includes(action.destinationId)) {
        return {
          ...state,
          compare: state.compare.filter((id) => id !== action.destinationId),
        }
      }
      const next = [...state.compare, action.destinationId]
      return { ...state, compare: next.slice(-MAX_COMPARE) }
    }
    case "setCompare":
      return { ...state, compare: action.ids.slice(0, MAX_COMPARE) }
    case "lock":
      return { ...state, lockedId: action.destinationId }
    case "prep":
      return { ...state, prepDone: { ...state.prepDone, [action.taskId]: action.value } }
    case "pack":
      return { ...state, packed: { ...state.packed, [action.key]: action.value } }
    case "resetFilters":
      return {
        ...state,
        vibes: [],
        search: "",
        budgetCap: initialState.budgetCap,
        maxTravelHours: initialState.maxTravelHours,
        strictBudget: initialState.strictBudget,
        strictTravel: initialState.strictTravel,
        sort: initialState.sort,
      }
    case "resetAll":
      clearStored(STORAGE_KEY)
      return { ...initialState, votes: structuredClone(SEED_VOTES) }
    default:
      return state
  }
}

function loadInitialState(): TripState {
  const stored = readStored<Partial<TripState>>(STORAGE_KEY)
  if (!stored) return initialState
  return {
    ...initialState,
    ...stored,
    attending: { ...initialState.attending, ...(stored.attending ?? {}) },
    votes: { ...initialState.votes, ...(stored.votes ?? {}) },
    travelChoice: { ...(stored.travelChoice ?? {}) },
    compare: Array.isArray(stored.compare) ? stored.compare.slice(0, MAX_COMPARE) : [],
    vibes: Array.isArray(stored.vibes) ? stored.vibes : [],
  }
}

export interface TripValue {
  state: TripState
  dispatch: Dispatch<TripAction>
  crew: Member[]
  cards: DestinationCard[]
  cardById: Map<string, DestinationCard>
  visible: DestinationCard[]
  ranked: DestinationCard[]
  leader: DestinationCard | undefined
  locked: DestinationCard | undefined
  compareCards: DestinationCard[]
  compareIsAuto: boolean
  yourVoteCount: number
  filtersActive: boolean
  destinations: Destination[]
}

const TripContext = createContext<TripValue | null>(null)

export function TripProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState)

  useEffect(() => {
    writeStored(STORAGE_KEY, state)
  }, [state])

  const value = useMemo<TripValue>(() => {
    const crew = MEMBERS.filter((member) => state.attending[member.id] ?? member.attending)
    const cards = buildCards({
      destinations: DESTINATIONS,
      originId: state.originId,
      nights: state.nights,
      crew,
      travelChoice: state.travelChoice,
      votes: state.votes,
      budgetCap: state.budgetCap,
      maxTravelHours: state.maxTravelHours,
      vibes: state.vibes,
      youId: YOU_ID,
    })

    const cardById = new Map(cards.map((card) => [card.destination.id, card]))
    const visible = sortCards(
      filterCards(cards, {
        search: state.search,
        vibes: state.vibes,
        budgetCap: state.budgetCap,
        maxTravelHours: state.maxTravelHours,
        strictBudget: state.strictBudget,
        strictTravel: state.strictTravel,
      }),
      state.sort,
    )

    const ranked = rankCards(cards)
    const compareIsAuto = state.compare.length === 0
    const compareIds = compareIsAuto
      ? ranked.slice(0, MAX_COMPARE).map((card) => card.destination.id)
      : state.compare

    return {
      state,
      dispatch,
      crew,
      cards,
      cardById,
      visible,
      ranked,
      leader: ranked[0],
      locked: state.lockedId ? cardById.get(state.lockedId) : undefined,
      compareCards: compareIds
        .map((id) => cardById.get(id))
        .filter((card): card is DestinationCard => Boolean(card)),
      compareIsAuto,
      yourVoteCount: Object.keys(state.votes[YOU_ID] ?? {}).length,
      filtersActive:
        state.vibes.length > 0 ||
        state.search.trim().length > 0 ||
        state.budgetCap !== initialState.budgetCap ||
        state.maxTravelHours !== initialState.maxTravelHours,
      destinations: DESTINATIONS,
    }
  }, [state])

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export function useTrip(): TripValue {
  const value = useContext(TripContext)
  if (!value) throw new Error("useTrip must be used inside <TripProvider>")
  return value
}
