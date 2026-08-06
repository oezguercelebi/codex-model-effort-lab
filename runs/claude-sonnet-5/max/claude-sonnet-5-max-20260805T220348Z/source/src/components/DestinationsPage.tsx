import { useMemo, useState } from "react"
import { MapPinOff } from "lucide-react"
import { allVibes, destinations } from "../data/destinations"
import { YOU_ID } from "../data/friends"
import type { Destination, Friend, SortKey, ViewMode, VotesState } from "../types"
import { getLeaders } from "../utils/votes"
import { CompareTable } from "./CompareTable"
import { DestinationGrid } from "./DestinationGrid"
import { DestinationModal } from "./DestinationModal"
import { EmptyState } from "./EmptyState"
import { FilterBar } from "./FilterBar"
import { VotingSummary } from "./VotingSummary"

interface DestinationsPageProps {
  votes: VotesState
  onVote: (destination: Destination) => void
  friends: Friend[]
  votingDeadline: Date
  isLoading: boolean
  onPreviewItinerary: (destinationId: string) => void
}

export function DestinationsPage({
  votes,
  onVote,
  friends,
  votingDeadline,
  isLoading,
  onPreviewItinerary,
}: DestinationsPageProps) {
  const [search, setSearch] = useState("")
  const [selectedVibes, setSelectedVibes] = useState<string[]>([])
  const [sortKey, setSortKey] = useState<SortKey>("votes")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [detailDestinationId, setDetailDestinationId] = useState<string | null>(null)

  const votersByDestination = useMemo(() => {
    const map: Record<string, Friend[]> = {}
    for (const friend of friends) {
      const destinationId = votes[friend.id]
      if (!destinationId) continue
      if (!map[destinationId]) map[destinationId] = []
      map[destinationId].push(friend)
    }
    return map
  }, [friends, votes])

  const leadingIds = useMemo(() => {
    const { destinations: leaders } = getLeaders(destinations, votes)
    return new Set(leaders.map((destination) => destination.id))
  }, [votes])

  const votedDestinationId = votes[YOU_ID] ?? null

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return destinations.filter((destination) => {
      const matchesVibe = selectedVibes.length === 0 || selectedVibes.some((vibe) => destination.vibes.includes(vibe))
      if (!matchesVibe) return false
      if (!query) return true
      const haystack = `${destination.name} ${destination.region} ${destination.tagline} ${destination.vibes.join(" ")}`.toLowerCase()
      return haystack.includes(query)
    })
  }, [search, selectedVibes])

  const sorted = useMemo(() => {
    const list = [...filtered]
    switch (sortKey) {
      case "budget":
        list.sort((a, b) => a.budget.low - b.budget.low)
        break
      case "travel":
        list.sort((a, b) => a.travel.durationMinutes - b.travel.durationMinutes)
        break
      case "az":
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "votes":
      default:
        list.sort((a, b) => (votersByDestination[b.id]?.length ?? 0) - (votersByDestination[a.id]?.length ?? 0))
        break
    }
    return list
  }, [filtered, sortKey, votersByDestination])

  const hasActiveFilters = search.trim() !== "" || selectedVibes.length > 0

  function toggleVibe(vibe: string) {
    setSelectedVibes((current) => (current.includes(vibe) ? current.filter((item) => item !== vibe) : [...current, vibe]))
  }

  function clearFilters() {
    setSearch("")
    setSelectedVibes([])
  }

  const detailDestination = detailDestinationId ? (destinations.find((d) => d.id === detailDestinationId) ?? null) : null

  return (
    <div className="flex flex-col gap-6">
      <VotingSummary destinations={destinations} votes={votes} friends={friends} votingDeadline={votingDeadline} />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        vibes={allVibes}
        selectedVibes={selectedVibes}
        onToggleVibe={toggleVibe}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        sortKey={sortKey}
        onSortChange={setSortKey}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {hasActiveFilters && !isLoading && (
        <p className="-mb-2 -mt-2 text-xs text-stone-500">
          Showing {sorted.length} of {destinations.length} destinations
        </p>
      )}

      {isLoading ? (
        <DestinationGrid
          destinations={[]}
          isLoading
          votersByDestination={{}}
          totalFriends={friends.length}
          leadingIds={leadingIds}
          votedDestinationId={votedDestinationId}
          onVote={onVote}
          onOpenDetails={() => {}}
        />
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={MapPinOff}
          title="No destinations match your filters"
          description="Try clearing a filter or searching for something else — there are 6 spots to choose from."
          action={
            <button
              type="button"
              onClick={clearFilters}
              className="mt-1 rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <>
          <div className={viewMode === "table" ? "block sm:hidden" : "block"}>
            <DestinationGrid
              destinations={sorted}
              isLoading={false}
              votersByDestination={votersByDestination}
              totalFriends={friends.length}
              leadingIds={leadingIds}
              votedDestinationId={votedDestinationId}
              onVote={onVote}
              onOpenDetails={(destination) => setDetailDestinationId(destination.id)}
            />
          </div>
          <div className={viewMode === "table" ? "hidden sm:block" : "hidden"}>
            <CompareTable
              destinations={sorted}
              votersByDestination={votersByDestination}
              totalFriends={friends.length}
              leadingIds={leadingIds}
              votedDestinationId={votedDestinationId}
              sortKey={sortKey}
              onSortChange={setSortKey}
              onVote={onVote}
              onOpenDetails={(destination) => setDetailDestinationId(destination.id)}
            />
          </div>
        </>
      )}

      {detailDestination && (
        <DestinationModal
          destination={detailDestination}
          voters={votersByDestination[detailDestination.id] ?? []}
          totalFriends={friends.length}
          votedByYou={votedDestinationId === detailDestination.id}
          onVote={() => onVote(detailDestination)}
          onClose={() => setDetailDestinationId(null)}
          onPreviewItinerary={() => {
            onPreviewItinerary(detailDestination.id)
            setDetailDestinationId(null)
          }}
        />
      )}
    </div>
  )
}
