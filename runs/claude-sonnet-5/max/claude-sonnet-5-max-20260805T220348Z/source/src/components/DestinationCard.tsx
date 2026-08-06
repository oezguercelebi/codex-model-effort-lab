import type { CSSProperties } from "react"
import { Car, ChevronRight, Check, Crown, Plane, Wallet } from "lucide-react"
import type { Destination, Friend } from "../types"
import { cn, formatBudgetRange } from "../utils/format"
import { AvatarStack } from "./AvatarStack"

interface DestinationCardProps {
  destination: Destination
  voters: Friend[]
  totalFriends: number
  isLeading: boolean
  votedByYou: boolean
  onVote: () => void
  onOpenDetails: () => void
  style?: CSSProperties
}

export function DestinationCard({
  destination,
  voters,
  totalFriends,
  isLeading,
  votedByYou,
  onVote,
  onOpenDetails,
  style,
}: DestinationCardProps) {
  const TravelIcon = destination.travel.mode === "flight" ? Plane : Car
  const WeatherIcon = destination.weather.icon
  const HeroIcon = destination.icon

  return (
    <article
      style={style}
      className="animate-card-in group flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className={cn("relative flex h-36 items-center justify-center bg-gradient-to-br", destination.gradient)}>
        {isLeading && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-amber-700 shadow-sm">
            <Crown className="h-3.5 w-3.5" aria-hidden="true" />
            Leading
          </span>
        )}
        <HeroIcon className="h-14 w-14 text-white/90" strokeWidth={1.5} aria-hidden="true" />
        <div className="absolute -bottom-3 right-4 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-stone-700 shadow-md">
          <WeatherIcon className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
          {destination.weather.high}°/{destination.weather.low}°
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 pt-6">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold leading-tight text-stone-900">{destination.name}</h3>
            <p className="text-sm text-stone-500">{destination.region}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
            <TravelIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {destination.travel.duration}
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-stone-600">{destination.tagline}</p>

        <div className="flex flex-wrap gap-1.5">
          {destination.vibes.map((vibe) => (
            <span key={vibe} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-600">
              {vibe}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-stone-800">
            <Wallet className="h-4 w-4 text-stone-400" aria-hidden="true" />
            {formatBudgetRange(destination.budget.low, destination.budget.high)}
            <span className="font-normal text-stone-400">/person</span>
          </div>
          <button
            type="button"
            onClick={onOpenDetails}
            className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-1 text-xs font-semibold text-stone-500 transition hover:text-stone-900"
          >
            Details
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
          <div className="flex min-w-0 items-center gap-2">
            {voters.length > 0 ? (
              <>
                <AvatarStack friends={voters} max={4} size="sm" />
                <span className="truncate text-xs text-stone-500">
                  {voters.length} of {totalFriends}
                </span>
              </>
            ) : (
              <span className="text-xs text-stone-400">No votes yet</span>
            )}
          </div>
          <button
            type="button"
            onClick={onVote}
            aria-pressed={votedByYou}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition",
              votedByYou
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-stone-900 text-white hover:bg-stone-700",
            )}
          >
            {votedByYou ? (
              <>
                <Check className="h-4 w-4" aria-hidden="true" />
                Your pick
              </>
            ) : (
              "Vote"
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
