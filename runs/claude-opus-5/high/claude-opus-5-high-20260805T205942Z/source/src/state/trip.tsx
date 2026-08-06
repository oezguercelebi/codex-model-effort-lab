import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react"
import { DESTINATIONS, WEEKENDS } from "../data/destinations"
import { MEMBERS, SEED_VOTES, YOU_ID } from "../data/group"
import { ITINERARY_BY_DESTINATION } from "../data/itineraries"
import {
  estimateCost,
  findTravel,
  groupFit,
  rankDestinations,
  selectedBlocks,
  tallyVotes,
  type Ranked,
} from "../lib/trip"
import type { Member, TravelMode, VibeId, VoteValue, Weekend } from "../types"

export type SortKey = "fit" | "votes" | "cost" | "time"
export type ViewId = "explore" | "compare" | "vote" | "plan"

export const SORT_LABELS: Record<SortKey, string> = {
  fit: "Best match",
  votes: "Most votes",
  cost: "Cheapest",
  time: "Shortest trip",
}

export type TripState = {
  weekendId: string
  /** Soft target used for flags and plan scoring, not a filter on its own. */
  budget: number
  maxHours: number
  vibes: VibeId[]
  hideOverBudget: boolean
  flightFreeOnly: boolean
  query: string
  sort: SortKey
  goingIds: string[]
  currentMemberId: string
  votes: Record<string, Record<string, VoteValue>>
  compare: string[]
  shortlist: string[]
  modes: Record<string, TravelMode>
  removedBlocks: Record<string, string[]>
  addedBlocks: Record<string, string[]>
  lockedWinner: string | null
}

export const MAX_COMPARE = 4
export const BUDGET_BOUNDS = { min: 150, max: 800, step: 10 }
export const HOURS_BOUNDS = { min: 2, max: 10, step: 0.5 }

const initialState: TripState = {
  weekendId: WEEKENDS[1].id,
  budget: 450,
  maxHours: 10,
  vibes: [],
  hideOverBudget: false,
  flightFreeOnly: false,
  query: "",
  sort: "fit",
  goingIds: MEMBERS.filter((m) => m.going).map((m) => m.id),
  currentMemberId: YOU_ID,
  votes: structuredClone(SEED_VOTES),
  compare: ["prague", "krakow", "copenhagen"],
  shortlist: [],
  modes: {},
  removedBlocks: {},
  addedBlocks: {},
  lockedWinner: null,
}

export type TripAction =
  | { type: "setWeekend"; id: string }
  | { type: "setBudget"; value: number }
  | { type: "setMaxHours"; value: number }
  | { type: "toggleVibe"; vibe: VibeId }
  | { type: "setHideOverBudget"; value: boolean }
  | { type: "setFlightFree"; value: boolean }
  | { type: "setQuery"; value: string }
  | { type: "setSort"; value: SortKey }
  | { type: "clearFilters" }
  | { type: "toggleGoing"; memberId: string }
  | { type: "setCurrentMember"; memberId: string }
  | { type: "vote"; memberId: string; destinationId: string; value: VoteValue }
  | { type: "clearVotes"; memberId: string }
  | { type: "toggleCompare"; destinationId: string }
  | { type: "clearCompare" }
  | { type: "toggleShortlist"; destinationId: string }
  | { type: "setMode"; destinationId: string; mode: TravelMode }
  | { type: "toggleBlock"; destinationId: string; blockId: string; optional: boolean }
  | { type: "resetPlan"; destinationId: string }
  | { type: "lockWinner"; destinationId: string | null }
  | { type: "restore"; state: TripState }
  | { type: "resetAll" }

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export function tripReducer(state: TripState, action: TripAction): TripState {
  switch (action.type) {
    case "setWeekend":
      return { ...state, weekendId: action.id }
    case "setBudget":
      return { ...state, budget: action.value }
    case "setMaxHours":
      return { ...state, maxHours: action.value }
    case "toggleVibe":
      return { ...state, vibes: toggle(state.vibes, action.vibe) }
    case "setHideOverBudget":
      return { ...state, hideOverBudget: action.value }
    case "setFlightFree":
      return { ...state, flightFreeOnly: action.value }
    case "setQuery":
      return { ...state, query: action.value }
    case "setSort":
      return { ...state, sort: action.value }
    case "clearFilters":
      return {
        ...state,
        vibes: [],
        query: "",
        flightFreeOnly: false,
        hideOverBudget: false,
        maxHours: HOURS_BOUNDS.max,
      }
    case "toggleGoing": {
      const goingIds = toggle(state.goingIds, action.memberId)
      if (goingIds.length === 0) return state
      const currentMemberId = goingIds.includes(state.currentMemberId)
        ? state.currentMemberId
        : goingIds[0]
      return { ...state, goingIds, currentMemberId }
    }
    case "setCurrentMember":
      return { ...state, currentMemberId: action.memberId }
    case "vote": {
      const existing = state.votes[action.memberId]?.[action.destinationId]
      const next = { ...(state.votes[action.memberId] ?? {}) }
      if (existing === action.value) delete next[action.destinationId]
      else next[action.destinationId] = action.value
      return { ...state, votes: { ...state.votes, [action.memberId]: next } }
    }
    case "clearVotes":
      return { ...state, votes: { ...state.votes, [action.memberId]: {} } }
    case "toggleCompare": {
      if (state.compare.includes(action.destinationId)) {
        return { ...state, compare: state.compare.filter((id) => id !== action.destinationId) }
      }
      if (state.compare.length >= MAX_COMPARE) return state
      return { ...state, compare: [...state.compare, action.destinationId] }
    }
    case "clearCompare":
      return { ...state, compare: [] }
    case "toggleShortlist":
      return { ...state, shortlist: toggle(state.shortlist, action.destinationId) }
    case "setMode":
      return { ...state, modes: { ...state.modes, [action.destinationId]: action.mode } }
    case "toggleBlock": {
      const key = action.optional ? "addedBlocks" : "removedBlocks"
      const current = state[key][action.destinationId] ?? []
      return {
        ...state,
        [key]: { ...state[key], [action.destinationId]: toggle(current, action.blockId) },
      }
    }
    case "resetPlan": {
      const removedBlocks = { ...state.removedBlocks }
      const addedBlocks = { ...state.addedBlocks }
      delete removedBlocks[action.destinationId]
      delete addedBlocks[action.destinationId]
      return { ...state, removedBlocks, addedBlocks }
    }
    case "lockWinner":
      return { ...state, lockedWinner: action.destinationId }
    case "restore":
      return action.state
    case "resetAll":
      return { ...initialState, votes: structuredClone(SEED_VOTES) }
    default:
      return state
  }
}

const STORAGE_KEY = "weekender:trip:v1"

function loadState(): TripState {
  if (typeof window === "undefined") return initialState
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw) as Partial<TripState>
    const merged: TripState = { ...initialState, ...parsed }
    // Guard against data that no longer matches the current sample set.
    const validIds = new Set(DESTINATIONS.map((d) => d.id))
    merged.compare = merged.compare.filter((id) => validIds.has(id)).slice(0, MAX_COMPARE)
    merged.shortlist = merged.shortlist.filter((id) => validIds.has(id))
    if (merged.lockedWinner && !validIds.has(merged.lockedWinner)) merged.lockedWinner = null
    if (!WEEKENDS.some((w) => w.id === merged.weekendId)) merged.weekendId = initialState.weekendId
    if (merged.goingIds.length === 0) merged.goingIds = initialState.goingIds
    return merged
  } catch {
    return initialState
  }
}

type TripContextValue = {
  state: TripState
  dispatch: Dispatch<TripAction>
}

const TripContext = createContext<TripContextValue | null>(null)

export function TripProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tripReducer, undefined, loadState)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Storage can be unavailable in private modes — the app still works in memory.
    }
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export function useTrip(): TripContextValue {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error("useTrip must be used inside a TripProvider")
  return ctx
}

export type DerivedTrip = {
  weekend: Weekend
  crew: Member[]
  groupSize: number
  currentMember: Member
  rows: Ranked[]
  rowById: Record<string, Ranked>
  visible: Ranked[]
  ranked: Ranked[]
  leader: Ranked | undefined
  winner: Ranked | undefined
  filtersActive: boolean
  myBallotCount: number
}

export function useDerivedTrip(): DerivedTrip {
  const { state } = useTrip()

  return useMemo(() => {
    const weekend = WEEKENDS.find((w) => w.id === state.weekendId) ?? WEEKENDS[0]
    const crew = MEMBERS.filter((m) => state.goingIds.includes(m.id))
    const groupSize = Math.max(1, crew.length)
    const currentMember =
      MEMBERS.find((m) => m.id === state.currentMemberId) ?? crew[0] ?? MEMBERS[0]

    const rows: Ranked[] = DESTINATIONS.map((destination) => {
      const travel = findTravel(destination, state.modes[destination.id], groupSize, weekend)
      return {
        destination,
        travel,
        cost: estimateCost(destination, travel, groupSize, weekend),
        fit: groupFit(destination, crew),
        tally: tallyVotes(destination.id, state.votes, crew),
      }
    })

    const rowById = Object.fromEntries(rows.map((r) => [r.destination.id, r]))
    const query = state.query.trim().toLowerCase()

    const visible = rows.filter(({ destination, cost, travel }) => {
      if (state.hideOverBudget && cost.total > state.budget) return false
      if (travel.option.hours > state.maxHours) return false
      if (state.flightFreeOnly && destination.travel.every((t) => t.mode === "flight")) return false
      if (state.vibes.length > 0) {
        const matches = state.vibes.every((vibe) => destination.ratings[vibe] >= 60)
        if (!matches) return false
      }
      if (query) {
        const haystack = [
          destination.name,
          destination.country,
          destination.tagline,
          ...destination.knownFor,
        ]
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })

    const sorted = [...visible].sort((a, b) => {
      switch (state.sort) {
        case "cost":
          return a.cost.total - b.cost.total
        case "time":
          return a.travel.option.hours - b.travel.option.hours
        case "votes":
          return b.tally.score - a.tally.score || b.fit - a.fit
        default:
          return b.fit - a.fit
      }
    })

    const ranked = rankDestinations(rows)
    const leader = ranked.find((r) => r.tally.cast > 0)
    const winner = state.lockedWinner ? rowById[state.lockedWinner] : undefined

    const filtersActive =
      state.vibes.length > 0 ||
      state.query.trim() !== "" ||
      state.flightFreeOnly ||
      state.hideOverBudget ||
      state.maxHours < HOURS_BOUNDS.max

    const myBallotCount = Object.keys(state.votes[state.currentMemberId] ?? {}).length

    return {
      weekend,
      crew,
      groupSize,
      currentMember,
      rows: sorted,
      rowById,
      visible,
      ranked,
      leader,
      winner,
      filtersActive,
      myBallotCount,
    }
  }, [state])
}

/** Blocks currently in the plan for a destination, in day/time order. */
export function usePlanBlocks(destinationId: string | undefined) {
  const { state } = useTrip()
  return useMemo(() => {
    if (!destinationId || !ITINERARY_BY_DESTINATION[destinationId]) return []
    return selectedBlocks(
      destinationId,
      state.removedBlocks[destinationId] ?? [],
      state.addedBlocks[destinationId] ?? [],
    ).sort((a, b) => a.day - b.day || a.time.localeCompare(b.time))
  }, [destinationId, state.removedBlocks, state.addedBlocks])
}
