import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { destinations, friends } from "./data"
import { comingFriends, destinationById, getStandings, type Standings } from "./logic"
import { defaultTripState, loadState, saveState } from "./storage"
import type { Friend, Route, SortKey, TripState, VibeId } from "./types"

type TripContextValue = {
  state: TripState
  route: Route
  voter: Friend
  party: number
  standings: Standings
  notice: string
  restoreArmed: boolean
  setVoter: (id: string) => void
  toggleComing: (id: string) => void
  vote: (destId: string) => void
  toggleCompare: (id: string) => void
  clearCompare: () => void
  setMaxBudget: (max: number | null) => void
  setMaxMinutes: (max: number | null) => void
  toggleVibe: (vibe: VibeId) => void
  setSort: (sort: SortKey) => void
  clearFilters: () => void
  armRestore: (armed: boolean) => void
  restore: () => void
}

const TripContext = createContext<TripContextValue | null>(null)

function readRoute(): Route {
  const hash = window.location.hash.replace(/^#/, "") || "/"
  const place = /^\/place\/([a-z0-9-]+)$/.exec(hash)
  if (place) {
    return destinationById(place[1]) ? { name: "detail", id: place[1] } : { name: "board" }
  }
  if (hash === "/compare") return { name: "compare" }
  if (hash === "/plan") return { name: "plan" }
  return { name: "board" }
}

export function TripProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TripState>(loadState)
  const [route, setRoute] = useState<Route>(readRoute)
  const [notice, setNotice] = useState("")
  const [restoreArmed, setRestoreArmed] = useState(false)

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    if (!window.location.hash) history.replaceState(null, "", "#/")
    const sync = () => setRoute(readRoute())
    window.addEventListener("hashchange", sync)
    return () => window.removeEventListener("hashchange", sync)
  }, [])

  useEffect(() => {
    if (window.location.hash.startsWith("#/place/") && route.name === "board") {
      history.replaceState(null, "", "#/")
    }
  }, [route])

  useEffect(() => {
    const dest = route.name === "detail" ? destinationById(route.id) : undefined
    document.title =
      route.name === "detail" && dest
        ? `${dest.name} | Weekender`
        : route.name === "compare"
          ? "Compare | Weekender"
          : route.name === "plan"
            ? "Itinerary | Weekender"
            : "Weekender"
    window.scrollTo(0, 0)
    document.getElementById("page-title")?.focus({ preventScroll: true })
  }, [route])

  const voter = friends.find((friend) => friend.id === state.voterId) ?? friends[3]
  const party = comingFriends(state.coming).length
  const standings = useMemo(
    () => getStandings(state.votes, state.coming),
    [state.votes, state.coming],
  )

  const value: TripContextValue = {
    state,
    route,
    voter,
    party,
    standings,
    notice,
    restoreArmed,
    setVoter: (id) => {
      const friend = friends.find((item) => item.id === id)
      if (!friend) return
      setState((prev) => ({ ...prev, voterId: id }))
      setNotice(`Voting as ${friend.name}.`)
    },
    toggleComing: (id) => {
      const friend = friends.find((item) => item.id === id)
      if (!friend) return
      const next = !state.coming[id]
      setState((prev) => ({ ...prev, coming: { ...prev.coming, [id]: next } }))
      setNotice(next ? `${friend.name} is coming.` : `${friend.name} is sitting this one out.`)
    },
    vote: (destId) => {
      const dest = destinations.find((item) => item.id === destId)
      if (!dest) return
      const clearing = state.votes[state.voterId] === destId
      setState((prev) => ({
        ...prev,
        votes: { ...prev.votes, [prev.voterId]: clearing ? null : destId },
      }))
      setNotice(clearing ? `${voter.name} cleared their vote.` : `${voter.name} voted for ${dest.name}.`)
    },
    toggleCompare: (id) => {
      const dest = destinations.find((item) => item.id === id)
      if (!dest) return
      if (state.compareIds.includes(id)) {
        setState((prev) => ({ ...prev, compareIds: prev.compareIds.filter((item) => item !== id) }))
        setNotice(`${dest.name} removed from compare.`)
        return
      }
      if (state.compareIds.length >= 3) {
        setNotice("Compare holds three places. Remove one to add another.")
        return
      }
      setState((prev) => ({ ...prev, compareIds: [...prev.compareIds, id] }))
      setNotice(`${dest.name} added to compare.`)
    },
    clearCompare: () => {
      setState((prev) => ({ ...prev, compareIds: [] }))
      setNotice("Compare list cleared.")
    },
    setMaxBudget: (max) => setState((prev) => ({ ...prev, maxBudget: max })),
    setMaxMinutes: (max) => setState((prev) => ({ ...prev, maxMinutes: max })),
    toggleVibe: (vibe) =>
      setState((prev) => ({
        ...prev,
        vibes: prev.vibes.includes(vibe)
          ? prev.vibes.filter((item) => item !== vibe)
          : [...prev.vibes, vibe],
      })),
    setSort: (sort) => setState((prev) => ({ ...prev, sort })),
    clearFilters: () => {
      setState((prev) => ({ ...prev, maxBudget: null, maxMinutes: null, vibes: [] }))
      setNotice("Filters cleared.")
    },
    armRestore: setRestoreArmed,
    restore: () => {
      setState(defaultTripState())
      setRestoreArmed(false)
      setNotice("Sample trip restored.")
    },
  }

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>
}

export function useTrip() {
  const value = useContext(TripContext)
  if (!value) throw new Error("useTrip must be used inside TripProvider")
  return value
}
