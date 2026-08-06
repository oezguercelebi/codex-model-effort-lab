import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { destinations } from "../data/destinations"
import { crew, seedVotes } from "../data/trip"
import type { SortKey, Vibe, ViewKey, VoteValue } from "../types"
import type { Plan, VoteBook } from "../lib/compute"

const STORAGE_KEY = "weekender.v1"

export type TripState = {
  travelers: number
  nights: number
  budgetCap: number
  maxTravelMinutes: number
  vibes: Vibe[]
  search: string
  sort: SortKey
  compare: string[]
  votes: Record<string, VoteValue>
  travelChoices: Record<string, string>
  lockedId: string | null
  checklist: Record<string, boolean>
  swaps: Record<string, boolean>
}

export const initialState: TripState = {
  travelers: 6,
  nights: 2,
  budgetCap: 700,
  maxTravelMinutes: 360,
  vibes: [],
  search: "",
  sort: "fit",
  compare: [],
  votes: {},
  travelChoices: {},
  lockedId: null,
  checklist: {},
  swaps: {},
}

export const MAX_COMPARE = 3

type Action =
  | { type: "set"; patch: Partial<TripState> }
  | { type: "toggleVibe"; vibe: Vibe }
  | { type: "toggleCompare"; id: string }
  | { type: "vote"; id: string; value: VoteValue }
  | { type: "clearVotes" }
  | { type: "resetFilters" }
  | { type: "toggleCheck"; id: string }
  | { type: "toggleSwap"; id: string }
  | { type: "reset" }

function reducer(state: TripState, action: Action): TripState {
  switch (action.type) {
    case "set":
      return { ...state, ...action.patch }
    case "toggleVibe":
      return {
        ...state,
        vibes: state.vibes.includes(action.vibe)
          ? state.vibes.filter((v) => v !== action.vibe)
          : [...state.vibes, action.vibe],
      }
    case "toggleCompare": {
      if (state.compare.includes(action.id)) {
        return { ...state, compare: state.compare.filter((id) => id !== action.id) }
      }
      if (state.compare.length >= MAX_COMPARE) return state
      return { ...state, compare: [...state.compare, action.id] }
    }
    case "vote": {
      const next = { ...state.votes }
      if (next[action.id] === action.value) delete next[action.id]
      else next[action.id] = action.value
      return { ...state, votes: next }
    }
    case "clearVotes":
      return { ...state, votes: {}, lockedId: null }
    case "resetFilters":
      return {
        ...state,
        vibes: [],
        search: "",
        budgetCap: initialState.budgetCap,
        maxTravelMinutes: initialState.maxTravelMinutes,
      }
    case "toggleCheck":
      return { ...state, checklist: { ...state.checklist, [action.id]: !state.checklist[action.id] } }
    case "toggleSwap":
      return { ...state, swaps: { ...state.swaps, [action.id]: !state.swaps[action.id] } }
    case "reset":
      return { ...initialState }
    default:
      return state
  }
}

function loadState(): TripState {
  if (typeof window === "undefined") return initialState
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw) as Partial<TripState>
    return { ...initialState, ...parsed }
  } catch {
    return initialState
  }
}

export type Toast = {
  id: number
  message: string
  tone: "default" | "success"
  action?: { label: string; run: () => void }
}

type TripContextValue = {
  state: TripState
  plan: Plan
  voteBook: VoteBook
  view: ViewKey
  setView: (view: ViewKey) => void
  openId: string | null
  openDestination: (id: string | null) => void
  set: (patch: Partial<TripState>) => void
  dispatch: (action: Action) => void
  toasts: Toast[]
  toast: (message: string, options?: { tone?: Toast["tone"]; action?: Toast["action"] }) => void
  dismissToast: (id: number) => void
  loading: boolean
}

const TripContext = createContext<TripContextValue | null>(null)

const VIEWS: ViewKey[] = ["explore", "compare", "vote", "plan"]

function viewFromHash(): ViewKey {
  const hash = window.location.hash.replace("#", "") as ViewKey
  return VIEWS.includes(hash) ? hash : "explore"
}

export function TripProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  const [view, setViewState] = useState<ViewKey>(() => viewFromHash())
  const [openId, setOpenId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [loading, setLoading] = useState(true)
  const toastId = useRef(0)

  // A short warm-up so the skeleton state is part of the real experience.
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 620)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage can be unavailable in private mode — the app still works */
    }
  }, [state])

  useEffect(() => {
    const onHashChange = () => setViewState(viewFromHash())
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  const setView = useCallback((next: ViewKey) => {
    setViewState(next)
    if (window.location.hash !== `#${next}`) window.location.hash = next
  }, [])

  const set = useCallback((patch: Partial<TripState>) => dispatch({ type: "set", patch }), [])

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback<TripContextValue["toast"]>((message, options) => {
    const id = (toastId.current += 1)
    setToasts((prev) => [
      ...prev.slice(-2),
      { id, message, tone: options?.tone ?? "default", action: options?.action },
    ])
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4200)
  }, [])

  const openDestination = useCallback((id: string | null) => setOpenId(id), [])

  const plan = useMemo<Plan>(
    () => ({
      travelers: state.travelers,
      nights: state.nights,
      budgetCap: state.budgetCap,
      maxTravelMinutes: state.maxTravelMinutes,
      travelChoices: state.travelChoices,
    }),
    [state.travelers, state.nights, state.budgetCap, state.maxTravelMinutes, state.travelChoices],
  )

  const voteBook = useMemo<VoteBook>(() => ({ ...seedVotes, you: state.votes }), [state.votes])

  const value = useMemo<TripContextValue>(
    () => ({
      state,
      plan,
      voteBook,
      view,
      setView,
      openId,
      openDestination,
      set,
      dispatch,
      toasts,
      toast,
      dismissToast,
      loading,
    }),
    [
      state,
      plan,
      voteBook,
      view,
      setView,
      openId,
      openDestination,
      set,
      toasts,
      toast,
      dismissToast,
      loading,
    ],
  )

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export function useTrip(): TripContextValue {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error("useTrip must be used inside a TripProvider")
  return ctx
}

/** How many of the destinations each crew member has voted on. */
export function useBallotProgress(voteBook: VoteBook) {
  return useMemo(() => {
    const total = destinations.length
    return crew.map((member) => {
      const cast = Object.keys(voteBook[member.id] ?? {}).length
      return { member, cast, total, complete: cast >= total }
    })
  }, [voteBook])
}
