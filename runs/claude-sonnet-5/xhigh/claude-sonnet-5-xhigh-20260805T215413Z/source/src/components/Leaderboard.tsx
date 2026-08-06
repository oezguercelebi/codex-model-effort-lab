import { Trophy } from "lucide-react"
import type { Destination, Member } from "../types"
import { AvatarStack } from "./Avatar"

export function Leaderboard({
  destinations,
  votesFor,
  maxVotes,
  onSelect,
}: {
  destinations: Destination[]
  votesFor: (destinationId: string) => Member[]
  maxVotes: number
  onSelect: (destinationId: string) => void
}) {
  const ranked = [...destinations].sort((a, b) => votesFor(b.id).length - votesFor(a.id).length)

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-stone-800">
        <Trophy className="size-4 text-amber-500" />
        Leaderboard
      </h2>
      <ul className="space-y-3">
        {ranked.map((destination, index) => {
          const voters = votesFor(destination.id)
          const isLeading = maxVotes > 0 && voters.length === maxVotes
          const width = maxVotes > 0 ? (voters.length / maxVotes) * 100 : 0
          return (
            <li key={destination.id}>
              <button
                type="button"
                onClick={() => onSelect(destination.id)}
                className="group w-full rounded-xl p-1.5 text-left transition-colors hover:bg-stone-50"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 truncate text-sm font-medium text-stone-800">
                    <span className="text-xs tabular-nums text-stone-400">{index + 1}</span>
                    {destination.name}
                    {isLeading && (
                      <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                        Leading
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-stone-500">
                    {voters.length} {voters.length === 1 ? "vote" : "votes"}
                  </span>
                </div>
                <div className="mb-1.5 h-1.5 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className={`h-full rounded-full transition-all ${isLeading ? "bg-amber-500" : "bg-stone-300"}`}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <AvatarStack members={voters} size="sm" max={5} />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
