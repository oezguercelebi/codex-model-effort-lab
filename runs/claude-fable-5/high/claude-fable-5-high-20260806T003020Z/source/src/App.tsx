import { useEffect, useMemo, useState } from "react"
import { CalendarDays, Compass, MapPin, Scale, Trophy, Users } from "lucide-react"
import { DESTINATIONS, FRIENDS, TRIP, YOU, budgetTotal } from "./data"
import { CompareView } from "./components/CompareView"
import { DestinationModal } from "./components/DestinationModal"
import { ExploreView } from "./components/ExploreView"
import { ResultsView } from "./components/ResultsView"

export interface Voter {
  id: string
  name: string
  initials: string
  color: string
}

export type View = "explore" | "compare" | "results"

const STORAGE_KEY = "weekender-v1"

interface PersistedState {
  userVotes: string[]
  locked: boolean
  checked: string[]
}

function loadState(): PersistedState {
  const fallback: PersistedState = { userVotes: [], locked: false, checked: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    const validIds = new Set(DESTINATIONS.map((d) => d.id))
    return {
      userVotes: Array.isArray(parsed.userVotes)
        ? parsed.userVotes.filter((id): id is string => typeof id === "string" && validIds.has(id))
        : [],
      locked: parsed.locked === true,
      checked: Array.isArray(parsed.checked)
        ? parsed.checked.filter((c): c is string => typeof c === "string")
        : [],
    }
  } catch {
    return fallback
  }
}

const NAV_ITEMS: { view: View; label: string; icon: typeof Compass }[] = [
  { view: "explore", label: "Explore", icon: Compass },
  { view: "compare", label: "Compare", icon: Scale },
  { view: "results", label: "Results", icon: Trophy },
]

export default function App() {
  const [initial] = useState(loadState)
  const [userVotes, setUserVotes] = useState<string[]>(initial.userVotes)
  const [locked, setLocked] = useState(initial.locked)
  const [checked, setChecked] = useState<string[]>(initial.checked)
  const [view, setView] = useState<View>("explore")
  const [detailId, setDetailId] = useState<string | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ userVotes, locked, checked }))
    } catch {
      // Private-mode storage failures shouldn't break the app
    }
  }, [userVotes, locked, checked])

  const votesById = useMemo(() => {
    const map: Record<string, Voter[]> = {}
    for (const d of DESTINATIONS) map[d.id] = []
    for (const friend of FRIENDS) {
      for (const id of friend.votes) map[id]?.push(friend)
    }
    for (const id of userVotes) map[id]?.push(YOU)
    return map
  }, [userVotes])

  const standings = useMemo(() => {
    return [...DESTINATIONS].sort((a, b) => {
      const diff = (votesById[b.id]?.length ?? 0) - (votesById[a.id]?.length ?? 0)
      if (diff !== 0) return diff
      return budgetTotal(a.budget) - budgetTotal(b.budget)
    })
  }, [votesById])

  const winner = standings[0]
  const isTie =
    standings.length > 1 &&
    (votesById[standings[0].id]?.length ?? 0) === (votesById[standings[1].id]?.length ?? 0)

  const toggleVote = (id: string) => {
    if (locked) return
    setUserVotes((prev) => {
      if (prev.includes(id)) return prev.filter((v) => v !== id)
      if (prev.length >= TRIP.maxVotesPerPerson) return prev
      return [...prev, id]
    })
  }

  const lockVotes = () => {
    setLocked(true)
    setView("results")
  }

  const resetDemo = () => {
    setUserVotes([])
    setLocked(false)
    setChecked([])
    setView("explore")
    setDetailId(null)
  }

  const detail = detailId ? (DESTINATIONS.find((d) => d.id === detailId) ?? null) : null

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-500 text-white shadow-sm">
              <Compass className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-base font-bold leading-tight tracking-tight">Weekender</p>
              <p className="truncate text-xs text-stone-500">{TRIP.title}</p>
            </div>
          </div>

          <div className="hidden items-center gap-4 text-xs font-medium text-stone-500 md:flex">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" aria-hidden />
              {TRIP.dates}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden />
              from {TRIP.origin}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5" aria-hidden />
              {TRIP.groupSize} friends
            </span>
          </div>

          <nav className="ml-auto hidden gap-1 rounded-full bg-stone-100 p-1 sm:flex" aria-label="Main">
            {NAV_ITEMS.map(({ view: v, label, icon: Icon }) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-current={view === v ? "page" : undefined}
                className={`relative inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  view === v
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                <Icon className="size-4" aria-hidden />
                {label}
                {v === "results" && !locked && (
                  <span
                    className="absolute right-2 top-1.5 size-1.5 rounded-full bg-amber-500"
                    aria-hidden
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:pb-16">
        {view === "explore" && (
          <ExploreView
            votesById={votesById}
            userVotes={userVotes}
            locked={locked}
            onToggleVote={toggleVote}
            onOpenDetail={setDetailId}
            onGoToResults={() => setView("results")}
          />
        )}
        {view === "compare" && <CompareView votesById={votesById} onOpenDetail={setDetailId} />}
        {view === "results" && (
          <ResultsView
            standings={standings}
            votesById={votesById}
            userVotes={userVotes}
            locked={locked}
            isTie={isTie}
            winner={winner}
            checked={checked}
            onToggleCheck={(key) =>
              setChecked((prev) =>
                prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
              )
            }
            onLock={lockVotes}
            onUnlock={() => setLocked(false)}
            onReset={resetDemo}
            onGoExplore={() => setView("explore")}
            onOpenDetail={setDetailId}
          />
        )}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur sm:hidden"
        aria-label="Main"
      >
        <div className="grid grid-cols-3">
          {NAV_ITEMS.map(({ view: v, label, icon: Icon }) => (
            <button
              key={v}
              onClick={() => setView(v)}
              aria-current={view === v ? "page" : undefined}
              className={`relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${
                view === v ? "text-amber-600" : "text-stone-500"
              }`}
            >
              <span className="relative">
                <Icon className="size-5" aria-hidden />
                {v === "results" && !locked && (
                  <span
                    className="absolute -right-1 -top-0.5 size-1.5 rounded-full bg-amber-500"
                    aria-hidden
                  />
                )}
              </span>
              {label}
            </button>
          ))}
        </div>
      </nav>

      {detail && (
        <DestinationModal
          destination={detail}
          voters={votesById[detail.id] ?? []}
          userVotes={userVotes}
          locked={locked}
          onToggleVote={toggleVote}
          onClose={() => setDetailId(null)}
        />
      )}
    </div>
  )
}
