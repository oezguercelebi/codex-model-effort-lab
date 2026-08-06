import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { DESTINATIONS, MEMBERS, ORIGINS, SEED_VOTES } from "./data"
import { consensusPct, estimateCost, estimateTravel, overBudgetFor, scoreVotes } from "./engine"
import type { LodgingTier, Scored, TripSettings, Vibe, VoteValue } from "./types"

export type SortKey = "consensus" | "price" | "time" | "name"
export type ViewKey = "explore" | "vote" | "plan"

export interface Filters {
  vibes: Vibe[]
  maxHours: number
  hideOverBudget: boolean
  query: string
  sort: SortKey
}

interface PersistedState {
  settings: TripSettings
  votes: Record<string, Record<string, VoteValue>>
  shortlist: string[]
  lockedId: string | null
  theme: "light" | "dark"
  packed: string[]
}

const STORAGE_KEY = "weekender.v1"

/** The first Friday of the sample trip — fixed so the demo is reproducible. */
const DEFAULT_DEPARTURE = "2026-09-11"

const DEFAULT_SETTINGS: TripSettings = {
  originId: "ber",
  nights: 2,
  departure: DEFAULT_DEPARTURE,
  lodging: "midrange",
  budgetCap: 550,
  travelers: 6,
}

export const DEFAULT_FILTERS: Filters = {
  vibes: [],
  maxHours: 0,
  hideOverBudget: false,
  query: "",
  sort: "consensus",
}

function defaultVotes(): Record<string, Record<string, VoteValue>> {
  const out: Record<string, Record<string, VoteValue>> = {}
  for (const d of DESTINATIONS) out[d.id] = { ...(SEED_VOTES[d.id] ?? {}) }
  return out
}

function initialState(): PersistedState {
  const base: PersistedState = {
    settings: DEFAULT_SETTINGS,
    votes: defaultVotes(),
    shortlist: [],
    lockedId: null,
    theme: "light",
    packed: [],
  }
  if (typeof window === "undefined") return base
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return base
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    return {
      ...base,
      ...parsed,
      settings: { ...base.settings, ...(parsed.settings ?? {}) },
      votes: { ...base.votes, ...(parsed.votes ?? {}) },
    }
  } catch {
    return base
  }
}

interface StoreValue extends PersistedState {
  filters: Filters
  view: ViewKey
  members: typeof MEMBERS
  origin: (typeof ORIGINS)[number]
  scored: Scored[]
  visible: Scored[]
  ranked: Scored[]
  winner: Scored | null
  locked: Scored | null
  yourVoteCount: number
  setView: (view: ViewKey) => void
  setFilters: (update: Partial<Filters>) => void
  resetFilters: () => void
  updateSettings: (update: Partial<TripSettings>) => void
  castVote: (destinationId: string, value: VoteValue) => void
  clearVote: (destinationId: string) => void
  toggleShortlist: (destinationId: string) => void
  clearShortlist: () => void
  lockIn: (destinationId: string | null) => void
  togglePacked: (item: string) => void
  toggleTheme: () => void
  resetAll: () => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(initialState)
  const [filters, setFiltersState] = useState<Filters>(DEFAULT_FILTERS)
  const [view, setView] = useState<ViewKey>("explore")

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Private browsing or a full quota — the app still works in-memory.
    }
  }, [state])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme === "dark")
    document.documentElement.style.colorScheme = state.theme
  }, [state.theme])

  const origin = useMemo(
    () => ORIGINS.find((o) => o.id === state.settings.originId) ?? ORIGINS[0],
    [state.settings.originId],
  )

  const scored = useMemo<Scored[]>(() => {
    return DESTINATIONS.map((destination) => {
      const travel = estimateTravel(origin, destination)
      const cost = estimateCost(destination, travel, state.settings)
      const votes = state.votes[destination.id] ?? {}
      const { tally, score } = scoreVotes(votes)
      return {
        destination,
        travel,
        cost,
        votes,
        score,
        tally,
        overBudgetFor: overBudgetFor(MEMBERS, cost.total),
        fitsFilters: true,
      }
    })
  }, [origin, state.settings, state.votes])

  const visible = useMemo(() => {
    const query = filters.query.trim().toLowerCase()
    const list = scored.filter((item) => {
      const d = item.destination
      if (filters.vibes.length && !filters.vibes.every((v) => d.vibes.includes(v))) return false
      if (filters.maxHours > 0 && item.travel.hours > filters.maxHours) return false
      if (filters.hideOverBudget && item.cost.total > state.settings.budgetCap) return false
      if (query) {
        const haystack =
          `${d.name} ${d.country} ${d.region} ${d.tagline} ${d.knownFor} ${d.vibes.join(" ")}`.toLowerCase()
        if (!haystack.includes(query)) return false
      }
      return true
    })
    const sorted = [...list]
    sorted.sort((a, b) => {
      switch (filters.sort) {
        case "price":
          return a.cost.total - b.cost.total
        case "time":
          return a.travel.hours - b.travel.hours
        case "name":
          return a.destination.name.localeCompare(b.destination.name)
        default:
          return b.score - a.score || a.cost.total - b.cost.total
      }
    })
    return sorted
  }, [scored, filters, state.settings.budgetCap])

  const ranked = useMemo(
    () => [...scored].sort((a, b) => b.score - a.score || a.cost.total - b.cost.total),
    [scored],
  )

  const winner = ranked[0] ?? null
  const locked = useMemo(
    () => scored.find((s) => s.destination.id === state.lockedId) ?? null,
    [scored, state.lockedId],
  )

  const yourVoteCount = useMemo(
    () => Object.values(state.votes).filter((v) => v.you !== undefined).length,
    [state.votes],
  )

  const setFilters = useCallback((update: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...update }))
  }, [])

  const value: StoreValue = {
    ...state,
    filters,
    view,
    members: MEMBERS,
    origin,
    scored,
    visible,
    ranked,
    winner,
    locked,
    yourVoteCount,
    setView,
    setFilters,
    resetFilters: () => setFiltersState(DEFAULT_FILTERS),
    updateSettings: (update) =>
      setState((prev) => ({ ...prev, settings: { ...prev.settings, ...update } })),
    castVote: (destinationId, value) =>
      setState((prev) => ({
        ...prev,
        votes: {
          ...prev.votes,
          [destinationId]: { ...(prev.votes[destinationId] ?? {}), you: value },
        },
      })),
    clearVote: (destinationId) =>
      setState((prev) => {
        const next = { ...(prev.votes[destinationId] ?? {}) }
        delete next.you
        return { ...prev, votes: { ...prev.votes, [destinationId]: next } }
      }),
    toggleShortlist: (destinationId) =>
      setState((prev) => {
        const has = prev.shortlist.includes(destinationId)
        if (has) return { ...prev, shortlist: prev.shortlist.filter((id) => id !== destinationId) }
        if (prev.shortlist.length >= 3) {
          return { ...prev, shortlist: [...prev.shortlist.slice(1), destinationId] }
        }
        return { ...prev, shortlist: [...prev.shortlist, destinationId] }
      }),
    clearShortlist: () => setState((prev) => ({ ...prev, shortlist: [] })),
    lockIn: (destinationId) => setState((prev) => ({ ...prev, lockedId: destinationId })),
    togglePacked: (item) =>
      setState((prev) => ({
        ...prev,
        packed: prev.packed.includes(item)
          ? prev.packed.filter((p) => p !== item)
          : [...prev.packed, item],
      })),
    toggleTheme: () =>
      setState((prev) => ({ ...prev, theme: prev.theme === "dark" ? "light" : "dark" })),
    resetAll: () => {
      setState((prev) => ({
        settings: DEFAULT_SETTINGS,
        votes: defaultVotes(),
        shortlist: [],
        lockedId: null,
        theme: prev.theme,
        packed: [],
      }))
      setFiltersState(DEFAULT_FILTERS)
    },
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>")
  return ctx
}

export { consensusPct }
export type { LodgingTier }
