import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { CalendarDays, Compass, MapPin, RotateCcw, Sun, Vote } from "lucide-react"
import { DESTINATIONS, TRIP } from "./data"
import type { PackingState, Tab } from "./types"
import { computeStandings, cx, leadersOf, useStoredState, withYourVotes } from "./utils"
import { AvatarStack } from "./components/ui"
import { ExploreView } from "./views/ExploreView"
import { VotesView } from "./views/VotesView"
import { PlanView } from "./views/PlanView"
import { DetailModal } from "./views/DetailModal"
import { CompareSheet } from "./views/CompareSheet"

const VOTES_KEY = "weekender.your-votes.v1"
const PACKING_KEY = "weekender.packing.v1"

const TABS: Array<{ id: Tab; label: string; icon: typeof Compass }> = [
  { id: "explore", label: "Explore", icon: Compass },
  { id: "votes", label: "Votes", icon: Vote },
  { id: "plan", label: "Plan", icon: CalendarDays },
]

function initialTab(): Tab {
  const hash = window.location.hash.replace("#", "")
  return TABS.some((t) => t.id === hash) ? (hash as Tab) : "explore"
}

export default function App() {
  const [tab, setTab] = useState<Tab>(initialTab)
  const [yourVotes, setYourVotes] = useStoredState<string[]>(VOTES_KEY, [])
  const [packing, setPacking] = useStoredState<PackingState>(PACKING_KEY, {
    checked: [],
    custom: [],
  })
  const [detailId, setDetailId] = useState<string | null>(null)
  const [compareMode, setCompareMode] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [compareOpen, setCompareOpen] = useState(false)
  const [toast, setToast] = useState<{ key: number; msg: string } | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  const standings = useMemo(() => computeStandings(yourVotes), [yourVotes])
  const standingsById = useMemo(
    () => new Map(standings.map((s) => [s.destination.id, s])),
    [standings],
  )
  const leaders = useMemo(() => leadersOf(standings), [standings])
  const leaderIds = useMemo(() => leaders.map((l) => l.destination.id), [leaders])
  const crew = useMemo(() => withYourVotes(yourVotes), [yourVotes])

  const notify = useCallback((msg: string) => {
    window.clearTimeout(toastTimer.current)
    setToast({ key: Date.now(), msg })
    toastTimer.current = window.setTimeout(() => setToast(null), 2800)
  }, [])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])
  useEffect(() => {
    window.scrollTo({ top: 0 })
    window.history.replaceState(null, "", `#${tab}`)
  }, [tab])

  const toggleVote = useCallback(
    (id: string) => {
      const next = yourVotes.includes(id)
        ? yourVotes.filter((v) => v !== id)
        : [...yourVotes, id]
      const prevLeaders = leadersOf(computeStandings(yourVotes))
      const nextLeaders = leadersOf(computeStandings(next))
      setYourVotes(next)

      const name = (destId: string) => DESTINATIONS.find((d) => d.id === destId)?.name ?? destId
      if (nextLeaders.length === 1) {
        const winner = nextLeaders[0].destination.id
        const wasAlreadySoleLeader =
          prevLeaders.length === 1 && prevLeaders[0].destination.id === winner
        if (!wasAlreadySoleLeader) notify(`${name(winner)} takes the lead!`)
      } else if (nextLeaders.length > 1 && prevLeaders.length === 1) {
        notify("It's a dead heat at the top")
      }
    },
    [yourVotes, setYourVotes, notify],
  )

  const toggleCompare = useCallback(
    (id: string) => {
      setCompareIds((prev) => {
        if (prev.includes(id)) return prev.filter((c) => c !== id)
        if (prev.length >= 3) {
          notify("Compare holds three — remove one first")
          return prev
        }
        return [...prev, id]
      })
    },
    [notify],
  )

  const toggleCompareMode = useCallback(() => {
    setCompareMode((on) => {
      if (on) {
        setCompareIds([])
        setCompareOpen(false)
      }
      return !on
    })
  }, [])

  const resetDemo = useCallback(() => {
    setYourVotes([])
    setPacking({ checked: [], custom: [] })
    setCompareIds([])
    setCompareMode(false)
    setCompareOpen(false)
    setDetailId(null)
    notify("Demo reset — fresh ballots for everyone")
  }, [setYourVotes, setPacking, notify])

  const detail = detailId ? DESTINATIONS.find((d) => d.id === detailId) : undefined
  const compareDestinations = compareIds
    .map((id) => DESTINATIONS.find((d) => d.id === id))
    .filter((d): d is (typeof DESTINATIONS)[number] => Boolean(d))

  return (
    <div className="min-h-dvh bg-[#faf9f7] text-stone-900 antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-stone-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-[#faf9f7]/90 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <button
            type="button"
            onClick={() => setTab("explore")}
            className="flex items-center gap-2.5"
            aria-label="Weekender home"
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-sm">
              <Sun className="size-4.5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Weekender</span>
          </button>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1 rounded-full border border-stone-200 bg-white p-1 shadow-sm">
              {TABS.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => setTab(t.id)}
                    aria-current={tab === t.id ? "page" : undefined}
                    className={cx(
                      "relative inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors",
                      tab === t.id
                        ? "bg-stone-900 text-white"
                        : "text-stone-600 hover:text-stone-900",
                    )}
                  >
                    <t.icon className="size-4" />
                    {t.label}
                    {t.id === "votes" && yourVotes.length === 0 && tab !== "votes" && (
                      <span
                        className="absolute right-2 top-1 size-1.5 rounded-full bg-orange-500"
                        aria-label="You haven't voted yet"
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 lg:inline-flex">
              <MapPin className="size-3.5 text-stone-400" />
              {TRIP.origin} · {TRIP.dates}
            </span>
            <button
              type="button"
              onClick={() => setTab("votes")}
              aria-label="See everyone's votes"
              className="transition hover:opacity-80"
            >
              <AvatarStack friends={crew} size="sm" ringClass="ring-[#faf9f7]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main id="main" className="pb-24 md:pb-10">
        {tab === "explore" && (
          <ExploreView
            standings={standings}
            leaderIds={leaderIds}
            yourVotes={yourVotes}
            compareMode={compareMode}
            compareIds={compareIds}
            onToggleVote={toggleVote}
            onOpenDetail={setDetailId}
            onToggleCompareMode={toggleCompareMode}
            onToggleCompare={toggleCompare}
            onOpenCompare={() => setCompareOpen(true)}
          />
        )}
        {tab === "votes" && (
          <VotesView
            standings={standings}
            leaders={leaders}
            yourVotes={yourVotes}
            onToggleVote={toggleVote}
            onOpenDetail={setDetailId}
          />
        )}
        {tab === "plan" && (
          <PlanView
            leader={leaders[0] ?? standings[0] ?? null}
            leaders={leaders}
            packing={packing}
            onPackingChange={setPacking}
            onNotify={notify}
          />
        )}

        <footer className="mx-auto mt-4 flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-stone-200/70 px-4 py-6 text-xs text-stone-400 sm:px-6">
          <p>Weekender · a demo planned with sample data — no account, no backend.</p>
          <button
            type="button"
            onClick={resetDemo}
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 font-medium text-stone-500 transition hover:border-stone-300 hover:text-stone-800"
          >
            <RotateCcw className="size-3" />
            Reset demo
          </button>
        </footer>
      </main>

      {/* Mobile tab bar */}
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <ul className="mx-auto flex max-w-md">
          {TABS.map((t) => (
            <li key={t.id} className="flex-1">
              <button
                type="button"
                onClick={() => setTab(t.id)}
                aria-current={tab === t.id ? "page" : undefined}
                className={cx(
                  "relative flex w-full flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors",
                  tab === t.id ? "text-orange-600" : "text-stone-400 hover:text-stone-600",
                )}
              >
                <t.icon className="size-5" />
                {t.label}
                {t.id === "votes" && yourVotes.length === 0 && tab !== "votes" && (
                  <span
                    className="absolute right-[calc(50%-16px)] top-1.5 size-1.5 rounded-full bg-orange-500"
                    aria-label="You haven't voted yet"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Overlays */}
      {detail && (
        <DetailModal
          destination={detail}
          standing={standingsById.get(detail.id)}
          voted={yourVotes.includes(detail.id)}
          isLeader={leaderIds.includes(detail.id)}
          tied={leaders.length > 1}
          onToggleVote={() => toggleVote(detail.id)}
          onClose={() => setDetailId(null)}
          onGoToPlan={() => {
            setDetailId(null)
            setTab("plan")
          }}
        />
      )}
      {compareOpen && compareDestinations.length >= 2 && (
        <CompareSheet
          destinations={compareDestinations}
          standings={standingsById}
          yourVotes={yourVotes}
          onToggleVote={toggleVote}
          onRemove={(id) => {
            const next = compareIds.filter((c) => c !== id)
            setCompareIds(next)
            if (next.length < 2) setCompareOpen(false)
          }}
          onClose={() => setCompareOpen(false)}
        />
      )}

      {/* Toast */}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-36 z-[60] flex justify-center px-4 md:bottom-8"
      >
        {toast && (
          <div
            key={toast.key}
            className="animate-slide-up rounded-full bg-stone-900 px-4 py-2.5 text-sm font-medium text-white shadow-xl"
          >
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  )
}
