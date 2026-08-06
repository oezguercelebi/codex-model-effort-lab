import { Clock, Heart, Trophy, Wallet } from "lucide-react"
import type { Destination, Member } from "../types"
import { formatBudgetRange, formatDriveTime } from "../lib/format"
import { WEATHER_ICONS } from "../lib/weatherIcons"
import { AvatarStack } from "./Avatar"

export function DestinationCard({
  destination,
  voters,
  isLeading,
  hasYourVote,
  onToggleVote,
  onOpenDetails,
}: {
  destination: Destination
  voters: Member[]
  isLeading: boolean
  hasYourVote: boolean
  onToggleVote: () => void
  onOpenDetails: () => void
}) {
  const Icon = destination.icon
  const satWeather = destination.weather[0]
  const WeatherIcon = WEATHER_ICONS[satWeather.condition]

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md ${
        isLeading ? "border-amber-300 ring-1 ring-amber-200" : "border-stone-200"
      }`}
    >
      <button
        type="button"
        onClick={onOpenDetails}
        className="relative h-36 w-full overflow-hidden text-left"
        aria-label={`View details for ${destination.name}`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${destination.gradient}`} />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <Icon className="absolute -bottom-4 -right-4 size-28 text-white/25" strokeWidth={1.5} />
        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-stone-700 backdrop-blur">
          {destination.vibeTags[0]}
        </div>
        {isLeading && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            <Trophy className="size-3.5" />
            Leading
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-lg font-bold leading-tight drop-shadow-sm">{destination.name}</p>
          <p className="text-sm font-medium text-white/90 drop-shadow-sm">{destination.region}</p>
        </div>
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-sm text-stone-500">{destination.tagline}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-stone-600">
          <span className="flex items-center gap-1.5">
            <Clock className="size-4 text-stone-400" />
            {formatDriveTime(destination.driveTimeMinutes)}
          </span>
          <span className="flex items-center gap-1.5">
            <Wallet className="size-4 text-stone-400" />
            {formatBudgetRange(destination.budget.low, destination.budget.high)}
          </span>
          <span className="flex items-center gap-1.5">
            <WeatherIcon className="size-4 text-stone-400" />
            {satWeather.high}°F Sat
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {destination.vibeTags.map((tag) => (
            <span key={tag} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto space-y-2.5 border-t border-stone-100 pt-3">
          <AvatarStack members={voters} size="sm" />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenDetails}
              className="flex-1 rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:border-stone-300 hover:bg-stone-50"
            >
              Details
            </button>
            <button
              type="button"
              onClick={onToggleVote}
              aria-pressed={hasYourVote}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                hasYourVote
                  ? "bg-rose-500 text-white hover:bg-rose-600"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              <Heart className={`size-3.5 ${hasYourVote ? "fill-white" : ""}`} />
              {hasYourVote ? "Voted" : "Vote"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
