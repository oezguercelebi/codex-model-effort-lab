import { Car, Clock, Heart, Plane, Scale, ThermometerSun, Trophy } from "lucide-react"
import { budgetTotal } from "../data/destinations"
import type { Destination, Friend } from "../types"
import { getIcon } from "../lib/icons"
import { AvatarStack } from "./Avatar"

export function DestinationCard({
  destination,
  voters,
  votedByYou,
  isLeader,
  isComparing,
  compareDisabled,
  onToggleVote,
  onToggleCompare,
  onViewItinerary,
}: {
  destination: Destination
  voters: Friend[]
  votedByYou: boolean
  isLeader: boolean
  isComparing: boolean
  compareDisabled: boolean
  onToggleVote: () => void
  onToggleCompare: () => void
  onViewItinerary: () => void
}) {
  const Icon = getIcon(destination.icon)
  const total = budgetTotal(destination.budget)

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
        isComparing ? "border-teal-400 ring-2 ring-teal-100" : "border-stone-200"
      }`}
    >
      <div className={`relative h-32 bg-gradient-to-br ${destination.gradient} p-4`}>
        <Icon className="absolute -bottom-4 -right-4 h-28 w-28 text-white/15" strokeWidth={1.5} />
        {isLeader && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-amber-700 shadow-sm">
            <Trophy className="h-3.5 w-3.5" strokeWidth={2.5} />
            Leading
          </span>
        )}
        <button
          onClick={onToggleCompare}
          disabled={compareDisabled}
          title={compareDisabled ? "You can compare up to 3 destinations" : "Add to compare"}
          className={`absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            isComparing ? "bg-teal-600 text-white" : "bg-white/95 text-stone-600 hover:bg-white"
          }`}
        >
          <Scale className="h-4 w-4" strokeWidth={2.25} />
        </button>
        <div className="absolute bottom-4 left-4 text-white">
          <p className="text-xs font-medium uppercase tracking-wide text-white/80">{destination.region}</p>
          <h3 className="text-xl font-semibold leading-tight">{destination.name}</h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-sm leading-6 text-stone-600">{destination.tagline}</p>

        <div className="flex flex-wrap gap-1.5">
          {destination.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-3 gap-2 rounded-xl bg-stone-50 p-3 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-stone-400">
              {destination.travel.mode === "flight" ? (
                <Plane className="h-3.5 w-3.5" />
              ) : (
                <Car className="h-3.5 w-3.5" />
              )}
            </div>
            <p className="mt-1 text-sm font-semibold text-stone-900">{destination.travel.duration}</p>
            <p className="text-[11px] text-stone-500">travel</p>
          </div>
          <div className="border-x border-stone-200">
            <div className="flex items-center justify-center gap-1 text-stone-400">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <p className="mt-1 text-sm font-semibold tabular-nums text-stone-900">${total}</p>
            <p className="text-[11px] text-stone-500">per person</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-stone-400">
              <ThermometerSun className="h-3.5 w-3.5" />
            </div>
            <p className="mt-1 text-sm font-semibold tabular-nums text-stone-900">{destination.weather.high}&deg;</p>
            <p className="text-[11px] text-stone-500">{destination.weather.condition}</p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleVote}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                votedByYou
                  ? "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              <Heart className="h-4 w-4" fill={votedByYou ? "currentColor" : "none"} strokeWidth={2.25} />
              {voters.length}
            </button>
            <AvatarStack friends={voters} max={3} />
          </div>
          <button
            onClick={onViewItinerary}
            className="text-sm font-medium text-teal-700 transition-colors hover:text-teal-800"
          >
            Itinerary &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}
