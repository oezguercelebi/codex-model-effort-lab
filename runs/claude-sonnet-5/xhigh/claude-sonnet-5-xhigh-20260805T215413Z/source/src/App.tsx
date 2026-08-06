import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { DESTINATIONS, MEMBERS, SEED_VOTES, VIBE_TAGS } from "./data"
import type { VibeTag } from "./types"
import { useLocalStorage } from "./lib/useLocalStorage"
import { Header } from "./components/Header"
import { TabNav, type TabKey } from "./components/TabNav"
import { StatusBanner } from "./components/StatusBanner"
import { FilterBar, type SortKey } from "./components/FilterBar"
import { DestinationCard } from "./components/DestinationCard"
import { DestinationModal } from "./components/DestinationModal"
import { Leaderboard } from "./components/Leaderboard"
import { ItineraryView } from "./components/ItineraryView"
import { EmptyState } from "./components/EmptyState"
import { SkeletonCard } from "./components/SkeletonCard"
import { Toast } from "./components/Toast"

export default function App() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabKey>("compare")
  const [search, setSearch] = useState("")
  const [activeTags, setActiveTags] = useState<VibeTag[]>([])
  const [sortKey, setSortKey] = useState<SortKey>("votes")
  const [modalDestinationId, setModalDestinationId] = useState<string | null>(null)
  const [manualItineraryId, setManualItineraryId] = useState<string | null>(null)
  const [yourVote, setYourVote] = useLocalStorage<string | null>("weekender-your-vote", null)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimeout = useRef<number | undefined>(undefined)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 600)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => () => window.clearTimeout(toastTimeout.current), [])

  const memberById = useMemo(() => new Map(MEMBERS.map((member) => [member.id, member])), [])

  const votesMap = useMemo(() => {
    const map: Record<string, string[]> = {}
    for (const destination of DESTINATIONS) {
      const seeded = SEED_VOTES[destination.id] ?? []
      map[destination.id] = yourVote === destination.id ? [...seeded, "you"] : seeded
    }
    return map
  }, [yourVote])

  const votesFor = useCallback(
    (destinationId: string) => (votesMap[destinationId] ?? []).map((id) => memberById.get(id)!),
    [votesMap, memberById],
  )

  const maxVotes = useMemo(
    () => Math.max(...DESTINATIONS.map((destination) => votesFor(destination.id).length)),
    [votesFor],
  )

  const leaderId = useMemo(
    () => DESTINATIONS.find((destination) => votesFor(destination.id).length === maxVotes)?.id ?? DESTINATIONS[0].id,
    [votesFor, maxVotes],
  )

  const isTied = useMemo(
    () => maxVotes > 0 && DESTINATIONS.filter((destination) => votesFor(destination.id).length === maxVotes).length > 1,
    [votesFor, maxVotes],
  )

  const totalVoted = useMemo(
    () => DESTINATIONS.reduce((sum, destination) => sum + votesFor(destination.id).length, 0),
    [votesFor],
  )

  const yourVoteDestination = useMemo(
    () => DESTINATIONS.find((destination) => destination.id === yourVote) ?? null,
    [yourVote],
  )

  const itineraryDestinationId = manualItineraryId ?? leaderId

  function showToast(message: string) {
    setToast(message)
    window.clearTimeout(toastTimeout.current)
    toastTimeout.current = window.setTimeout(() => setToast(null), 2500)
  }

  function toggleVote(destinationId: string) {
    const destination = DESTINATIONS.find((d) => d.id === destinationId)!
    if (yourVote === destinationId) {
      setYourVote(null)
      showToast(`Vote removed from ${destination.name}`)
    } else {
      setYourVote(destinationId)
      showToast(`You voted for ${destination.name}`)
    }
  }

  function toggleTag(tag: VibeTag) {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  function resetFilters() {
    setSearch("")
    setActiveTags([])
  }

  function openItineraryFor(destinationId: string) {
    setManualItineraryId(destinationId)
    setModalDestinationId(null)
    setActiveTab("itinerary")
  }

  const filteredDestinations = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = DESTINATIONS.filter((destination) => {
      const matchesQuery =
        query === "" ||
        destination.name.toLowerCase().includes(query) ||
        destination.region.toLowerCase().includes(query)
      const matchesTags = activeTags.length === 0 || activeTags.some((tag) => destination.vibeTags.includes(tag))
      return matchesQuery && matchesTags
    })

    return filtered.sort((a, b) => {
      switch (sortKey) {
        case "votes":
          return votesFor(b.id).length - votesFor(a.id).length || a.name.localeCompare(b.name)
        case "budget":
          return a.budget.typical - b.budget.typical
        case "time":
          return a.driveTimeMinutes - b.driveTimeMinutes
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })
  }, [search, activeTags, sortKey, votesFor])

  const modalDestination = DESTINATIONS.find((d) => d.id === modalDestinationId) ?? null

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <TabNav active={activeTab} onChange={setActiveTab} />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === "compare" ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <aside className="order-1 space-y-4 lg:order-2 lg:sticky lg:top-20 lg:self-start">
              <StatusBanner
                yourVote={yourVoteDestination}
                isTied={isTied}
                totalVoted={totalVoted}
                totalMembers={MEMBERS.length}
              />
              <Leaderboard destinations={DESTINATIONS} votesFor={votesFor} maxVotes={maxVotes} onSelect={setModalDestinationId} />
            </aside>

            <div className="order-2 space-y-5 lg:order-1">
              <FilterBar
                allTags={VIBE_TAGS}
                activeTags={activeTags}
                onToggleTag={toggleTag}
                search={search}
                onSearchChange={setSearch}
                sortKey={sortKey}
                onSortChange={setSortKey}
                onReset={resetFilters}
              />

              {loading ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </div>
              ) : filteredDestinations.length === 0 ? (
                <EmptyState onReset={resetFilters} />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredDestinations.map((destination) => (
                    <DestinationCard
                      key={destination.id}
                      destination={destination}
                      voters={votesFor(destination.id)}
                      isLeading={maxVotes > 0 && votesFor(destination.id).length === maxVotes}
                      hasYourVote={yourVote === destination.id}
                      onToggleVote={() => toggleVote(destination.id)}
                      onOpenDetails={() => setModalDestinationId(destination.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <ItineraryView
            destinations={DESTINATIONS}
            selectedId={itineraryDestinationId}
            onSelect={setManualItineraryId}
            votesFor={votesFor}
            maxVotes={maxVotes}
          />
        )}
      </main>

      {modalDestination && (
        <DestinationModal
          destination={modalDestination}
          voters={votesFor(modalDestination.id)}
          hasYourVote={yourVote === modalDestination.id}
          onToggleVote={() => toggleVote(modalDestination.id)}
          onClose={() => setModalDestinationId(null)}
          onViewItinerary={() => openItineraryFor(modalDestination.id)}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  )
}
