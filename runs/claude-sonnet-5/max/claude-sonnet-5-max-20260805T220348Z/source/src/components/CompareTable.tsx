import { Car, Check, Crown, Plane } from "lucide-react"
import type { Destination, Friend, SortKey } from "../types"
import { cn, formatBudgetRange } from "../utils/format"
import { AvatarStack } from "./AvatarStack"

interface CompareTableProps {
  destinations: Destination[]
  votersByDestination: Record<string, Friend[]>
  totalFriends: number
  leadingIds: Set<string>
  votedDestinationId: string | null
  sortKey: SortKey
  onSortChange: (key: SortKey) => void
  onVote: (destination: Destination) => void
  onOpenDetails: (destination: Destination) => void
}

function HeaderButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide transition",
        active ? "text-stone-900" : "text-stone-400 hover:text-stone-600",
      )}
    >
      {label}
    </button>
  )
}

export function CompareTable({
  destinations,
  votersByDestination,
  totalFriends,
  leadingIds,
  votedDestinationId,
  sortKey,
  onSortChange,
  onVote,
  onOpenDetails,
}: CompareTableProps) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white shadow-sm">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr className="border-b border-stone-100">
            <th className="px-5 py-3">
              <HeaderButton label="Destination" active={sortKey === "az"} onClick={() => onSortChange("az")} />
            </th>
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-stone-400">Vibe</th>
            <th className="px-5 py-3">
              <HeaderButton label="Budget / person" active={sortKey === "budget"} onClick={() => onSortChange("budget")} />
            </th>
            <th className="px-5 py-3">
              <HeaderButton label="Travel time" active={sortKey === "travel"} onClick={() => onSortChange("travel")} />
            </th>
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-stone-400">Weather</th>
            <th className="px-5 py-3">
              <HeaderButton label="Votes" active={sortKey === "votes"} onClick={() => onSortChange("votes")} />
            </th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {destinations.map((destination) => {
            const TravelIcon = destination.travel.mode === "flight" ? Plane : Car
            const WeatherIcon = destination.weather.icon
            const voters = votersByDestination[destination.id] ?? []
            const votedByYou = votedDestinationId === destination.id
            const isLeading = leadingIds.has(destination.id)

            return (
              <tr key={destination.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50/60">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white", destination.gradient)}>
                      <destination.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-stone-900">{destination.name}</p>
                        {isLeading && <Crown className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />}
                      </div>
                      <p className="text-xs text-stone-500">{destination.region}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {destination.vibes.slice(0, 2).map((vibe) => (
                      <span key={vibe} className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
                        {vibe}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-stone-800">
                  {formatBudgetRange(destination.budget.low, destination.budget.high)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-stone-700">
                  <span className="inline-flex items-center gap-1.5">
                    <TravelIcon className="h-3.5 w-3.5 text-stone-400" aria-hidden="true" />
                    {destination.travel.duration}
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-stone-700">
                  <span className="inline-flex items-center gap-1.5">
                    <WeatherIcon className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                    {destination.weather.high}°/{destination.weather.low}°
                  </span>
                </td>
                <td className="px-5 py-4">
                  {voters.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <AvatarStack friends={voters} max={3} size="sm" />
                      <span className="text-xs text-stone-500">{voters.length}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-stone-400">—</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenDetails(destination)}
                      className="whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-semibold text-stone-500 transition hover:text-stone-900"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onVote(destination)}
                      aria-pressed={votedByYou}
                      className={cn(
                        "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition",
                        votedByYou
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "bg-stone-900 text-white hover:bg-stone-700",
                      )}
                    >
                      {votedByYou ? (
                        <>
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          Voted
                        </>
                      ) : (
                        "Vote"
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
