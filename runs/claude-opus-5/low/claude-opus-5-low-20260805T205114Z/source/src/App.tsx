import { Compass, Map, RotateCcw, Vote as VoteIcon } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { DestinationDetail } from "./components/DestinationDetail"
import { ExploreView } from "./components/ExploreView"
import { PlanView } from "./components/PlanView"
import { VoteView } from "./components/VoteView"
import { Avatar } from "./components/ui"
import { DESTINATIONS, TRAVELERS } from "./data"
import {
  SEED_VOTES,
  TOTAL_POSSIBLE_VOTES,
  cx,
  rankDestinations,
  votesCast,
} from "./lib"
import type { VoteValue, Votes } from "./types"

const STORAGE_KEY = "weekender.v1"

type Tab = "explore" | "vote" | "plan"

const TABS: { key: Tab; label: string; icon: typeof Compass }[] = [
  { key: "explore", label: "Explore", icon: Compass },
  { key: "vote", label: "Vote", icon: VoteIcon },
  { key: "plan", label: "Plan", icon: Map },
]

type Stored = { votes: Votes; travelerId: string }

function loadStored(): Stored {
  const fallback: Stored = { votes: SEED_VOTES, travelerId: TRAVELERS[0].id }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<Stored>
    return {
      votes:
        parsed.votes && typeof parsed.votes === "object" ? parsed.votes : SEED_VOTES,
      travelerId: TRAVELERS.some((t) => t.id === parsed.travelerId)
        ? (parsed.travelerId as string)
        : TRAVELERS[0].id,
    }
  } catch {
    return fallback
  }
}

export default function App() {
  const [initial] = useState(loadStored)
  const [votes, setVotes] = useState<Votes>(initial.votes)
  const [travelerId, setTravelerId] = useState(initial.travelerId)
  const [tab, setTab] = useState<Tab>("explore")
  const [openId, setOpenId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ votes, travelerId }))
    } catch {
      /* storage unavailable — the app still works for this session */
    }
  }, [votes, travelerId])

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const notify = useCallback((message: string) => {
    setToast(message)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2400)
  }, [])

  const castVote = useCallback(
    (voterId: string, destinationId: string, value: VoteValue) => {
      const destination = DESTINATIONS.find((d) => d.id === destinationId)
      const voter = TRAVELERS.find((t) => t.id === voterId)
      const previous = votes[voterId]?.[destinationId]
      setVotes((current) => {
        const ballot = { ...(current[voterId] ?? {}) }
        if (ballot[destinationId] === value) delete ballot[destinationId]
        else ballot[destinationId] = value
        return { ...current, [voterId]: ballot }
      })
      notify(
        previous === value
          ? `Vote cleared for ${destination?.name}`
          : value === "yes"
            ? `${voter?.name} is in for ${destination?.name}`
            : value === "maybe"
              ? `${voter?.name} is on the fence about ${destination?.name}`
              : `${voter?.name} is out for ${destination?.name}`,
      )
    },
    [notify, votes],
  )

  const ranked = useMemo(() => rankDestinations(votes), [votes])
  const traveler = TRAVELERS.find((t) => t.id === travelerId) ?? TRAVELERS[0]
  const myVotes = votes[travelerId] ?? {}
  const cast = votesCast(votes)
  const openDestination = DESTINATIONS.find((d) => d.id === openId) ?? null
  const openTally = openDestination
    ? (ranked.find((r) => r.destination.id === openDestination.id)?.tally ?? null)
    : null

  const resetAll = () => {
    setVotes(SEED_VOTES)
    notify("Votes reset to the starting shortlist")
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-950">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-30 border-b border-stone-800 bg-stone-950 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 text-sm font-bold text-stone-950">
                W
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight">Weekender</p>
                <p className="truncate text-xs text-stone-400">
                  Autumn trip · 17–19 Oct · {TRAVELERS.length} friends
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden text-right sm:block">
                <p className="text-[11px] text-stone-400">Voting as</p>
                <p className="text-sm font-semibold">{traveler.name}</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-stone-900 p-1">
                {TRAVELERS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTravelerId(t.id)}
                    aria-pressed={t.id === travelerId}
                    aria-label={`Switch to ${t.name}`}
                    className={cx(
                      "rounded-full transition-opacity",
                      t.id === travelerId ? "opacity-100" : "opacity-45 hover:opacity-80",
                    )}
                  >
                    <Avatar traveler={t} size="sm" ring={t.id === travelerId} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <nav
            className="flex items-center gap-1 overflow-x-auto pb-px"
            aria-label="Sections"
          >
            {TABS.map((item) => {
              const Icon = item.icon
              const active = tab === item.key
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTab(item.key)}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
                    active
                      ? "border-white text-white"
                      : "border-transparent text-stone-400 hover:text-stone-200",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {item.key === "vote" ? (
                    <span className="rounded-full bg-stone-800 px-1.5 py-0.5 text-[10px] font-semibold text-stone-300 tabular-nums">
                      {cast}/{TOTAL_POSSIBLE_VOTES}
                    </span>
                  ) : null}
                </button>
              )
            })}
            <button
              type="button"
              onClick={resetAll}
              className="ml-auto flex shrink-0 items-center gap-1.5 py-3 pl-3 text-xs font-medium text-stone-500 transition-colors hover:text-stone-200"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </nav>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {tab === "explore" ? (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {DESTINATIONS.length} weekends. One decision.
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                Everything below is priced per person for two nights, door to door, in
                October. Rate what you&apos;d be up for and the group picks the winner.
              </p>
            </div>
            <ExploreView
              ranked={ranked}
              myVotes={myVotes}
              travelerName={traveler.name}
              onVote={(destinationId, value) => castVote(travelerId, destinationId, value)}
              onOpen={setOpenId}
            />
          </>
        ) : null}

        {tab === "vote" ? (
          <VoteView
            ranked={ranked}
            votes={votes}
            currentTravelerId={travelerId}
            onVote={castVote}
            onOpen={setOpenId}
          />
        ) : null}

        {tab === "plan" ? (
          <PlanView ranked={ranked} votes={votes} onGoVote={() => setTab("vote")} />
        ) : null}
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-10 text-xs text-stone-400 sm:px-6">
        Sample data for demonstration. Prices are indicative October estimates per person.
      </footer>

      {openDestination && openTally ? (
        <DestinationDetail
          destination={openDestination}
          tally={openTally}
          votes={votes}
          currentTravelerId={travelerId}
          onVote={(voterId, value) => castVote(voterId, openDestination.id, value)}
          onClose={() => setOpenId(null)}
        />
      ) : null}

      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4"
      >
        {toast ? (
          <div className="rounded-full bg-stone-950 px-4 py-2.5 text-sm font-medium text-white shadow-lg motion-safe:animate-[riseIn_.2s_ease-out]">
            {toast}
          </div>
        ) : null}
      </div>
    </div>
  )
}
