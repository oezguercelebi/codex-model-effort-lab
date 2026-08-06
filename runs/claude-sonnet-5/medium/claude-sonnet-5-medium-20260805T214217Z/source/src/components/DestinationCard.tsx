import { Check, Plane, Star } from "lucide-react"
import type { Destination, Friend } from "../types"
import { AvatarStack } from "./AvatarStack"
import { DestinationIcon } from "./icons"

export function DestinationCard({
  destination,
  voters,
  hasYourVote,
  isWinner,
  onOpen,
  onToggleVote,
}: {
  destination: Destination
  voters: Friend[]
  hasYourVote: boolean
  isWinner: boolean
  onOpen: () => void
  onToggleVote: () => void
}) {
  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${
        isWinner ? "border-amber-400 ring-2 ring-amber-300" : "border-stone-200"
      }`}
    >
      <button
        onClick={onOpen}
        className={`relative h-36 w-full overflow-hidden bg-gradient-to-br ${destination.gradient} text-left`}
      >
        <DestinationIcon
          icon={destination.icon}
          className="absolute -bottom-4 -right-4 h-28 w-28 text-white/25"
        />
        {isWinner && (
          <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-amber-950 shadow">
            Leading
          </span>
        )}
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/30 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          <Star className="h-3 w-3 fill-current" /> {destination.rating}
        </span>
        <div className="absolute bottom-3 left-3 text-white">
          <p className="text-lg font-bold leading-tight">{destination.name}</p>
          <p className="text-xs text-white/85">{destination.region}</p>
        </div>
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-sm text-stone-600">{destination.tagline}</p>

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

        <div className="flex items-center justify-between text-sm text-stone-500">
          <span className="flex items-center gap-1.5">
            <Plane className="h-4 w-4" /> {destination.travelTimes.flight}h flight
          </span>
          <span className="font-semibold text-stone-900">${destination.pricePerPerson}/person</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <AvatarStack voters={voters} />
          <button
            onClick={onToggleVote}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
              hasYourVote
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-stone-900 text-white hover:bg-stone-700"
            }`}
          >
            {hasYourVote ? <Check className="h-4 w-4" /> : null}
            {hasYourVote ? "Voted" : "Vote"}
          </button>
        </div>
      </div>
    </div>
  )
}
