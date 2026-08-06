import type { Destination, VotesState } from "../types"

export function tallyVotes(votes: VotesState): Record<string, string[]> {
  const tally: Record<string, string[]> = {}
  for (const [friendId, destinationId] of Object.entries(votes)) {
    if (!destinationId) continue
    if (!tally[destinationId]) tally[destinationId] = []
    tally[destinationId].push(friendId)
  }
  return tally
}

export function countVotes(votes: VotesState): number {
  return Object.values(votes).filter(Boolean).length
}

export interface Leaders {
  destinations: Destination[]
  count: number
}

/** Destinations tied for the most votes right now (empty array if nobody has voted). */
export function getLeaders(destinations: Destination[], votes: VotesState): Leaders {
  const tally = tallyVotes(votes)
  let maxCount = 0
  for (const destination of destinations) {
    maxCount = Math.max(maxCount, tally[destination.id]?.length ?? 0)
  }
  if (maxCount === 0) return { destinations: [], count: 0 }
  return { destinations: destinations.filter((d) => (tally[d.id]?.length ?? 0) === maxCount), count: maxCount }
}

/** Most votes wins; ties break toward the cheaper trip. */
export function getWinner(destinations: Destination[], votes: VotesState): Destination | null {
  const { destinations: leaders } = getLeaders(destinations, votes)
  if (leaders.length === 0) return null
  if (leaders.length === 1) return leaders[0]
  return [...leaders].sort((a, b) => a.budget.low - b.budget.low)[0]
}
