import { useEffect, useMemo, useState } from "react"
import { ArrowDownUp, CalendarDays, Compass, MapPin, SearchX, Vote } from "lucide-react"
import { DestinationCard } from "./components/DestinationCard"
import { DestinationModal } from "./components/DestinationModal"
import { ItineraryView } from "./components/ItineraryView"
import { VotesView } from "./components/VotesView"
import { Avatar } from "./components/ui"
import { budgetTotal, DESTINATIONS, FRIENDS, TRIP, YOU, type Vibe } from "./data"

type Tab = "explore" | "votes" | "itinerary"
type SortKey = "votes" | "price" | "time"

const VOTES_KEY = "weekender.myVotes"
const ALL_VIBES: Vibe[] = ["Culture", "Nightlife", "Nature", "Food", "Beach", "Wellness"]

const TABS: { id: Tab; label: string; icon: typeof Compass }[] = [
  { id: "explore", label: "Explore", icon: Compass },
  { id: "votes", label: "Votes", icon: Vote },
  { id: "itinerary", label: "Itinerary", icon: CalendarDays },
]

function loadVotes(): string[] {
  try {
    const raw = localStorage.getItem(VOTES_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((v): v is string => typeof v === "string" && DESTINATIONS.some((d) => d.id === v))
      .slice(0, TRIP.votesPerPerson)
  } catch {
    return []
  }
}

export default function App() {
  const [tab, setTab] = useState<Tab>("explore")
  const [myVotes, setMyVotes] = useState<string[]>(loadVotes)
  const [openId, setOpenId] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>("votes")
  const [vibeFilter, setVibeFilter] = useState<Vibe | null>(null)
  const [itineraryId, setItineraryId] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(VOTES_KEY, JSON.stringify(myVotes))
  }, [myVotes])

  const tally = useMemo(() => {
    const t = new Map<string, number>()
    for (const d of DESTINATIONS) t.set(d.id, 0)
    for (const f of FRIENDS) for (const v of f.votes) t.set(v, (t.get(v) ?? 0) + 1)
    for (const v of myVotes) t.set(v, (t.get(v) ?? 0) + 1)
    return t
  }, [myVotes])

  const { leaderIds, winner, tie } = useMemo(() => {
    const max = Math.max(...[...tally.values()])
    const leaders = DESTINATIONS.filter((d) => (tally.get(d.id) ?? 0) === max && max > 0)
    return {
      leaderIds: leaders.map((d) => d.id),
      winner: leaders[0] ?? null,
      tie: leaders.length > 1,
    }
  }, [tally])

  const visible = useMemo(() => {
    const list = DESTINATIONS.filter((d) => vibeFilter === null || d.vibes.includes(vibeFilter))
    return [...list].sort((a, b) => {
      if (sortKey === "price") return budgetTotal(a.budget) - budgetTotal(b.budget)
      if (sortKey === "time") return a.travelTimeH - b.travelTimeH
      return (tally.get(b.id) ?? 0) - (tally.get(a.id) ?? 0)
    })
  }, [sortKey, vibeFilter, tally])

  const maxBudget = useMemo(() => Math.max(...DESTINATIONS.map((d) => budgetTotal(d.budget))), [])
  const canVote = myVotes.length < TRIP.votesPerPerson
  const openDestination = openId ? (DESTINATIONS.find((d) => d.id === openId) ?? null) : null

  const toggleVote = (id: string) => {
    setMyVotes((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : prev.length < TRIP.votesPerPerson
          ? [...prev, id]
          : prev,
    )
  }

  return (
    <div className="min-h-dvh bg-stone-100 pb-20 text-stone-900 sm:pb-10">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 text-lg shadow-sm">
                🧳
              </span>
              <div>
                <h1 className="text-lg font-bold tracking-tight">Weekender</h1>
                <p className="flex items-center gap-1 text-xs font-medium text-stone-500">
                  <MapPin className="size-3" aria-hidden />
                  {TRIP.name} · from {TRIP.origin} · {TRIP.dates}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-3 hidden text-xs font-medium text-stone-400 sm:block">
                5 travelers
              </span>
              <span className="flex -space-x-2">
                {FRIENDS.map((f) => (
                  <Avatar key={f.id} initials={f.initials} color={f.color} size="size-8" ring />
                ))}
                <Avatar initials={YOU.initials} color={YOU.color} size="size-8" ring />
              </span>
            </div>
          </div>

          <nav className="mt-4 hidden gap-1 sm:flex" aria-label="Sections">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                aria-current={tab === id ? "page" : undefined}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  tab === id ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <Icon className="size-4" aria-hidden />
                {label}
                {id === "votes" && myVotes.length < TRIP.votesPerPerson && (
                  <span className="size-1.5 rounded-full bg-amber-400" aria-label="Votes pending" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {tab === "explore" && (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Where to, team?</h2>
                <p className="text-sm text-stone-500">
                  {DESTINATIONS.length} shortlisted trips · budgets are per person for {TRIP.nights}{" "}
                  nights
                </p>
              </div>
              <label className="flex items-center gap-2 text-sm text-stone-600">
                <ArrowDownUp className="size-4 text-stone-400" aria-hidden />
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium shadow-sm focus:outline-2 focus:outline-stone-900"
                  aria-label="Sort destinations"
                >
                  <option value="votes">Most votes</option>
                  <option value="price">Cheapest first</option>
                  <option value="time">Shortest travel</option>
                </select>
              </label>
            </div>

            <div className="mb-5 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setVibeFilter(null)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                  vibeFilter === null
                    ? "bg-stone-900 text-white"
                    : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                }`}
              >
                All vibes
              </button>
              {ALL_VIBES.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVibeFilter(vibeFilter === v ? null : v)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                    vibeFilter === v
                      ? "bg-stone-900 text-white"
                      : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            {visible.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-stone-300 bg-white/60 py-16 text-center">
                <SearchX className="size-8 text-stone-300" aria-hidden />
                <p className="font-medium text-stone-600">No destinations match that vibe.</p>
                <button
                  type="button"
                  onClick={() => setVibeFilter(null)}
                  className="text-sm font-semibold text-stone-900 underline"
                >
                  Clear filter
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((d) => (
                  <DestinationCard
                    key={d.id}
                    destination={d}
                    voters={FRIENDS.filter((f) => f.votes.includes(d.id))}
                    youVoted={myVotes.includes(d.id)}
                    isLeader={leaderIds.includes(d.id) && !tie}
                    canVote={canVote}
                    maxBudget={maxBudget}
                    onToggleVote={() => toggleVote(d.id)}
                    onOpen={() => setOpenId(d.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {tab === "votes" && (
          <VotesView
            destinations={DESTINATIONS}
            tally={tally}
            myVotes={myVotes}
            leaderIds={leaderIds}
            onToggleVote={toggleVote}
            onOpenDestination={setOpenId}
            onResetVotes={() => setMyVotes([])}
          />
        )}

        {tab === "itinerary" && (
          <ItineraryView
            winner={winner}
            tie={tie}
            selectedId={itineraryId}
            tally={tally}
            onSelect={setItineraryId}
          />
        )}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex border-t border-stone-200 bg-white/95 backdrop-blur sm:hidden"
        aria-label="Sections"
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-current={tab === id ? "page" : undefined}
            className={`relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold ${
              tab === id ? "text-stone-900" : "text-stone-400"
            }`}
          >
            <Icon className="size-5" aria-hidden />
            {label}
            {id === "votes" && myVotes.length < TRIP.votesPerPerson && (
              <span className="absolute right-[28%] top-2 size-1.5 rounded-full bg-amber-400" />
            )}
          </button>
        ))}
      </nav>

      {openDestination && (
        <DestinationModal
          destination={openDestination}
          voteCount={tally.get(openDestination.id) ?? 0}
          youVoted={myVotes.includes(openDestination.id)}
          canVote={canVote}
          onToggleVote={() => toggleVote(openDestination.id)}
          onViewItinerary={() => {
            setItineraryId(openDestination.id)
            setTab("itinerary")
            setOpenId(null)
          }}
          onClose={() => setOpenId(null)}
        />
      )}
    </div>
  )
}
