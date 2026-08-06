import { useEffect, useMemo, useRef, useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  ArrowLeftRight,
  CalendarRange,
  CheckCircle2,
  Compass,
  Heart,
  TentTree,
  Vote,
} from "lucide-react"
import {
  DESTINATIONS,
  FRIENDS,
  PACKING_ITEMS,
  TRIP,
  YOU,
  eur,
  getDestination,
  totalCost,
  type Person,
} from "./data"
import CompareView from "./components/CompareView"
import DestinationModal from "./components/DestinationModal"
import ExploreView from "./components/ExploreView"
import ItineraryView from "./components/ItineraryView"
import VotesView from "./components/VotesView"

type Tab = "explore" | "compare" | "votes" | "itinerary"

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "explore", label: "Explore", icon: Compass },
  { id: "compare", label: "Compare", icon: ArrowLeftRight },
  { id: "votes", label: "Votes", icon: Vote },
  { id: "itinerary", label: "Itinerary", icon: CalendarRange },
]

const STORAGE_KEY = "weekender:v1"

interface Persisted {
  myVotes: string[]
  packed: string[]
}

function loadPersisted(): Persisted {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Persisted>
      const destIds = new Set(DESTINATIONS.map((d) => d.id))
      const packIds = new Set(PACKING_ITEMS.map((p) => p.id))
      return {
        myVotes: Array.isArray(parsed.myVotes)
          ? parsed.myVotes.filter((id) => destIds.has(id)).slice(0, TRIP.votesPerPerson)
          : [],
        packed: Array.isArray(parsed.packed) ? parsed.packed.filter((id) => packIds.has(id)) : [],
      }
    }
  } catch {
    // corrupted or unavailable storage — start fresh
  }
  return { myVotes: [], packed: [] }
}

export default function App() {
  const [tab, setTab] = useState<Tab>("explore")
  const [{ myVotes, packed }, setPersisted] = useState<Persisted>(loadPersisted)
  const [modalId, setModalId] = useState<string | null>(null)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  const votesLeft = TRIP.votesPerPerson - myVotes.length

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ myVotes, packed }))
    } catch {
      // private mode etc. — the app still works, just without persistence
    }
  }, [myVotes, packed])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [tab])

  const tally = useMemo(() => {
    const map: Record<string, Person[]> = {}
    for (const d of DESTINATIONS) map[d.id] = []
    for (const f of FRIENDS) for (const v of f.votes) map[v].push(f)
    for (const id of myVotes) map[id].push(YOU)
    return map
  }, [myVotes])

  const standings = useMemo(
    () =>
      [...DESTINATIONS].sort(
        (a, b) =>
          tally[b.id].length - tally[a.id].length ||
          totalCost(a) - totalCost(b) ||
          a.name.localeCompare(b.name),
      ),
    [tally],
  )
  const leader = standings[0]
  const isTied = tally[leader.id].length === tally[standings[1].id].length

  const daysToGo = Math.max(
    0,
    Math.ceil((TRIP.departure.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  )

  function showToast(message: string) {
    window.clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), message })
    toastTimer.current = window.setTimeout(() => setToast(null), 2800)
  }

  function toggleVote(id: string) {
    const dest = getDestination(id)
    if (myVotes.includes(id)) {
      setPersisted((p) => ({ ...p, myVotes: p.myVotes.filter((v) => v !== id) }))
      showToast(`Vote removed from ${dest.name}`)
    } else if (myVotes.length >= TRIP.votesPerPerson) {
      showToast("You've spent both votes — remove one first")
    } else {
      setPersisted((p) => ({ ...p, myVotes: [...p.myVotes, id] }))
      showToast(
        myVotes.length + 1 === TRIP.votesPerPerson
          ? `Vote cast for ${dest.name} — your ballot is in!`
          : `Vote cast for ${dest.name}`,
      )
    }
  }

  function togglePacked(id: string) {
    setPersisted((p) => ({
      ...p,
      packed: p.packed.includes(id) ? p.packed.filter((x) => x !== id) : [...p.packed, id],
    }))
  }

  const shownItinerary = previewId ? getDestination(previewId) : leader

  function copyPlan() {
    const d = shownItinerary
    const lines = [
      `WEEKENDER · ${TRIP.title}`,
      `${d.name}, ${d.country} — ${TRIP.dateLabel}, from ${TRIP.origin}`,
      `${eur(totalCost(d))} per person · getting there ${eur(d.costs.travel)} · sleeping ${eur(d.costs.stay)} · food ${eur(d.costs.food)} · activities ${eur(d.costs.fun)}`,
      "",
      ...d.itinerary.flatMap((day) => [
        `${day.label} ${day.date} — ${day.theme}`,
        ...day.items.map((it) => `  ${it.time}  ${it.title}`),
        "",
      ]),
    ]
    navigator.clipboard
      .writeText(lines.join("\n").trimEnd())
      .then(() => showToast("Plan copied — paste it in the group chat"))
      .catch(() => showToast("Couldn't copy on this browser"))
  }

  const modalDest = modalId ? getDestination(modalId) : null

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-stone-900">
      <header className="sticky top-0 z-40 border-b border-stone-200/60 bg-[#f7f5f2]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <button
            onClick={() => setTab("explore")}
            className="flex min-w-0 items-center gap-2.5"
            aria-label="Weekender home"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-white shadow-sm">
              <TentTree className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-lg font-semibold tracking-tight">Weekender</span>
            <span className="ml-1 hidden rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-500 lg:inline">
              {TRIP.origin} → ? · {TRIP.dateLabel}
            </span>
          </button>

          <nav className="hidden md:block" aria-label="Sections">
            <div className="inline-flex items-center gap-0.5 rounded-full bg-stone-200/60 p-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  aria-current={tab === t.id ? "page" : undefined}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                    tab === t.id ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  <t.icon className="h-4 w-4" aria-hidden />
                  {t.label}
                </button>
              ))}
            </div>
          </nav>

          <button
            onClick={() => setTab("votes")}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              votesLeft > 0
                ? "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            {votesLeft > 0 ? (
              <>
                <Heart className="h-3.5 w-3.5" aria-hidden />
                {votesLeft} {votesLeft === 1 ? "vote" : "votes"} left
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                Ballot in
              </>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8 md:pb-16">
        <div key={tab} className="anim-rise">
          {tab === "explore" && (
            <ExploreView
              tally={tally}
              myVotes={myVotes}
              votesLeft={votesLeft}
              leader={leader}
              isTied={isTied}
              daysToGo={daysToGo}
              onVote={toggleVote}
              onOpen={setModalId}
            />
          )}
          {tab === "compare" && (
            <CompareView tally={tally} leaderId={leader.id} onOpen={setModalId} />
          )}
          {tab === "votes" && (
            <VotesView
              standings={standings}
              tally={tally}
              myVotes={myVotes}
              votesLeft={votesLeft}
              isTied={isTied}
              onVote={toggleVote}
              onReset={() => {
                setPersisted((p) => ({ ...p, myVotes: [] }))
                showToast("Ballot cleared — two fresh votes")
              }}
              onExplore={() => setTab("explore")}
              onOpen={setModalId}
            />
          )}
          {tab === "itinerary" && (
            <ItineraryView
              shown={shownItinerary}
              leader={leader}
              isTied={isTied}
              votes={tally[leader.id].length}
              packed={packed}
              onTogglePacked={togglePacked}
              onPreview={setPreviewId}
              onCopy={copyPlan}
            />
          )}
        </div>

        <footer className="mt-14 border-t border-stone-200/70 pt-6 text-center text-xs text-stone-400">
          Weekender · made for the group chat · sample data, no sign-in needed
        </footer>
      </main>

      {/* Mobile tab bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200/80 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label="Sections"
      >
        <div className="grid grid-cols-4">
          {TABS.map((t) => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                  active ? "text-orange-600" : "text-stone-400 hover:text-stone-600"
                }`}
              >
                <span className="relative">
                  <t.icon className="h-5 w-5" aria-hidden />
                  {t.id === "votes" && votesLeft > 0 && (
                    <span className="absolute -right-1.5 -top-1 grid h-3.5 w-3.5 place-items-center rounded-full bg-orange-600 text-[9px] font-bold text-white">
                      {votesLeft}
                    </span>
                  )}
                </span>
                {t.label}
              </button>
            )
          })}
        </div>
      </nav>

      {modalDest && (
        <DestinationModal
          dest={modalDest}
          voters={tally[modalDest.id]}
          voted={myVotes.includes(modalDest.id)}
          outOfVotes={votesLeft === 0}
          isLeader={modalDest.id === leader.id}
          onVote={() => toggleVote(modalDest.id)}
          onClose={() => setModalId(null)}
          onPlan={() => {
            setPreviewId(modalDest.id === leader.id ? null : modalDest.id)
            setModalId(null)
            setTab("itinerary")
          }}
        />
      )}

      {toast && (
        <div
          key={toast.id}
          role="status"
          className="anim-toast fixed bottom-20 left-1/2 z-[60] w-max max-w-[calc(100vw-2rem)] rounded-full bg-stone-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg md:bottom-8"
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}
