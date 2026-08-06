import { Vote } from "lucide-react"
import type { Destination, Friend, VotesState } from "../types"
import { useCountdown } from "../hooks/useCountdown"
import { countVotes, getLeaders } from "../utils/votes"
import { AvatarStack } from "./AvatarStack"

interface VotingSummaryProps {
  destinations: Destination[]
  votes: VotesState
  friends: Friend[]
  votingDeadline: Date
}

export function VotingSummary({ destinations, votes, friends, votingDeadline }: VotingSummaryProps) {
  const countdown = useCountdown(votingDeadline)
  const { destinations: leaders, count } = getLeaders(destinations, votes)
  const totalVotes = countVotes(votes)
  const votedFriends = friends.filter((friend) => votes[friend.id])

  let headline: string
  if (totalVotes === 0) {
    headline = "No one has voted yet — cast the first vote"
  } else if (leaders.length === 1) {
    headline = `${leaders[0].name} is leading with ${count} vote${count === 1 ? "" : "s"}`
  } else {
    headline = `It's a tie between ${leaders.map((destination) => destination.name).join(" & ")}`
  }

  const countdownText = countdown.isPast
    ? "Voting's closed, but you can still change your pick"
    : countdown.days > 0
      ? `Voting closes in ${countdown.days}d ${countdown.hours}h`
      : `Voting closes in ${countdown.hours}h ${countdown.minutes}m`

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white">
          <Vote className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-900">{headline}</p>
          <p className="text-xs text-stone-500">{countdownText}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <AvatarStack friends={votedFriends} max={6} size="sm" />
        <span className="whitespace-nowrap text-xs font-medium text-stone-500">
          {votedFriends.length} of {friends.length} voted
        </span>
      </div>
    </div>
  )
}
