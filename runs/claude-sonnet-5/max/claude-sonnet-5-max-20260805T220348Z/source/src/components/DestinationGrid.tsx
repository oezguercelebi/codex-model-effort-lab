import type { Destination, Friend } from "../types"
import { DestinationCard } from "./DestinationCard"
import { DestinationCardSkeleton } from "./Skeleton"

interface DestinationGridProps {
  destinations: Destination[]
  isLoading: boolean
  votersByDestination: Record<string, Friend[]>
  totalFriends: number
  leadingIds: Set<string>
  votedDestinationId: string | null
  onVote: (destination: Destination) => void
  onOpenDetails: (destination: Destination) => void
}

export function DestinationGrid({
  destinations,
  isLoading,
  votersByDestination,
  totalFriends,
  leadingIds,
  votedDestinationId,
  onVote,
  onOpenDetails,
}: DestinationGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <DestinationCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {destinations.map((destination, index) => (
        <DestinationCard
          key={destination.id}
          destination={destination}
          voters={votersByDestination[destination.id] ?? []}
          totalFriends={totalFriends}
          isLeading={leadingIds.has(destination.id)}
          votedByYou={votedDestinationId === destination.id}
          onVote={() => onVote(destination)}
          onOpenDetails={() => onOpenDetails(destination)}
          style={{ animationDelay: `${Math.min(index, 6) * 45}ms` }}
        />
      ))}
    </div>
  )
}
