import { CalendarDays, ListChecks, MapPinned, Palmtree, SlidersHorizontal } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { AvatarStack } from "./components/AvatarStack"
import { DestinationCard } from "./components/DestinationCard"
import { DestinationDetail } from "./components/DestinationDetail"
import { ItineraryView } from "./components/ItineraryView"
import { destinations, friends, seedVotes } from "./data"

const STORAGE_KEY = "weekender-votes-v1"
const YOU_ID = "you"
type SortKey = "votes" | "price" | "time"

function loadVotes(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Record<string, string[]>
  } catch {
    // ignore corrupt storage
  }
  return seedVotes
}

export default function App() {
  const [votes, setVotes] = useState<Record<string, string[]>>(loadVotes)
  const [activeTab, setActiveTab] = useState<"compare" | "itinerary">("compare")
  const [sortBy, setSortBy] = useState<SortKey>("votes")
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(votes))
  }, [votes])

  const allTags = useMemo(
    () => Array.from(new Set(destinations.flatMap((d) => d.tags))).sort(),
    [],
  )

  const voteCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const d of destinations) counts[d.id] = votes[d.id]?.length ?? 0
    return counts
  }, [votes])

  const maxVotes = Math.max(0, ...Object.values(voteCounts))
  const leaders = destinations.filter((d) => maxVotes > 0 && voteCounts[d.id] === maxVotes)
  const winner = leaders[0] ?? null
  const isTie = leaders.length > 1

  const visibleDestinations = useMemo(() => {
    let list = destinations.slice()
    if (activeTag) list = list.filter((d) => d.tags.includes(activeTag))
    list.sort((a, b) => {
      if (sortBy === "votes") return voteCounts[b.id] - voteCounts[a.id]
      if (sortBy === "price") return a.pricePerPerson - b.pricePerPerson
      return (a.travelTimes.flight ?? 99) - (b.travelTimes.flight ?? 99)
    })
    return list
  }, [activeTag, sortBy, voteCounts])

  function votersFor(id: string) {
    const ids = votes[id] ?? []
    return friends.filter((f) => ids.includes(f.id))
  }

  function toggleVote(id: string) {
    setVotes((prev) => {
      const next: Record<string, string[]> = {}
      for (const d of destinations) {
        const current = prev[d.id] ?? []
        next[d.id] = current.filter((v) => v !== YOU_ID)
      }
      const alreadyVoted = (prev[id] ?? []).includes(YOU_ID)
      if (!alreadyVoted) {
        next[id] = [...next[id], YOU_ID]
      }
      return next
    })
  }

  const openDestination = destinations.find((d) => d.id === openId) ?? null
  const totalVoters = friends.length

  return (
    <div className="min-h-screen bg-stone-100 pb-16 text-stone-950">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-900 text-white">
              <Palmtree className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight tracking-tight">Weekender</h1>
              <p className="flex items-center gap-1 text-xs text-stone-500">
                <CalendarDays className="h-3 w-3" /> Aug 14 – 16, 2026
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AvatarStack voters={friends} size="md" />
            <span className="hidden text-sm text-stone-500 sm:inline">{friends.length} friends planning</span>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-1 px-4 sm:px-6">
          <button
            onClick={() => setActiveTab("compare")}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-3.5 text-sm font-semibold transition ${
              activeTab === "compare"
                ? "border-stone-900 text-stone-900"
                : "border-transparent text-stone-400 hover:text-stone-600"
            }`}
          >
            <MapPinned className="h-4 w-4" /> Destinations
          </button>
          <button
            onClick={() => setActiveTab("itinerary")}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-3.5 text-sm font-semibold transition ${
              activeTab === "itinerary"
                ? "border-stone-900 text-stone-900"
                : "border-transparent text-stone-400 hover:text-stone-600"
            }`}
          >
            <ListChecks className="h-4 w-4" /> Itinerary
            {winner && (
              <span className="ml-1 rounded-full bg-amber-400 px-1.5 py-0.5 text-[10px] font-bold text-amber-950">
                {winner.name}
              </span>
            )}
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {activeTab === "compare" ? (
          <>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setActiveTag(null)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    activeTag === null
                      ? "bg-stone-900 text-white"
                      : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50"
                  }`}
                >
                  All vibes
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      activeTag === tag
                        ? "bg-stone-900 text-white"
                        : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-2 text-sm text-stone-600">
                <SlidersHorizontal className="h-4 w-4 text-stone-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className="rounded-lg border border-stone-200 bg-white px-2.5 py-1.5 text-sm font-medium text-stone-700"
                >
                  <option value="votes">Sort by votes</option>
                  <option value="price">Sort by price</option>
                  <option value="time">Sort by travel time</option>
                </select>
              </label>
            </div>

            {visibleDestinations.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
                No destinations match that vibe. Try another filter.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visibleDestinations.map((d) => (
                  <DestinationCard
                    key={d.id}
                    destination={d}
                    voters={votersFor(d.id)}
                    hasYourVote={(votes[d.id] ?? []).includes(YOU_ID)}
                    isWinner={winner?.id === d.id && maxVotes > 0}
                    onOpen={() => setOpenId(d.id)}
                    onToggleVote={() => toggleVote(d.id)}
                  />
                ))}
              </div>
            )}
          </>
        ) : winner ? (
          <ItineraryView
            destination={winner}
            voters={votersFor(winner.id)}
            totalVoters={totalVoters}
            isTie={isTie}
            tiedNames={leaders.map((d) => d.name)}
          />
        ) : (
          <div className="mx-auto max-w-md rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center">
            <ListChecks className="mx-auto h-8 w-8 text-stone-300" />
            <h2 className="mt-3 font-semibold text-stone-800">No votes yet</h2>
            <p className="mt-1 text-sm text-stone-500">
              Head to Destinations and vote for your favorite to unlock the itinerary.
            </p>
            <button
              onClick={() => setActiveTab("compare")}
              className="mt-4 rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700"
            >
              Browse destinations
            </button>
          </div>
        )}
      </main>

      {openDestination && (
        <DestinationDetail
          destination={openDestination}
          voters={votersFor(openDestination.id)}
          hasYourVote={(votes[openDestination.id] ?? []).includes(YOU_ID)}
          isWinner={winner?.id === openDestination.id && maxVotes > 0}
          onClose={() => setOpenId(null)}
          onToggleVote={() => toggleVote(openDestination.id)}
        />
      )}
    </div>
  )
}
