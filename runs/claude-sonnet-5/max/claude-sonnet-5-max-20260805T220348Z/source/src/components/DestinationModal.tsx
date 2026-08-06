import { Car, Check, CloudSun, MapPin, Plane, Sparkles, Star, Wallet } from "lucide-react"
import type { Destination, Friend } from "../types"
import { cn, formatBudgetRange, formatCurrency } from "../utils/format"
import { AvatarStack } from "./AvatarStack"
import { Modal } from "./Modal"
import { StatTile } from "./StatTile"

interface DestinationModalProps {
  destination: Destination
  voters: Friend[]
  totalFriends: number
  votedByYou: boolean
  onVote: () => void
  onClose: () => void
  onPreviewItinerary: () => void
}

export function DestinationModal({
  destination,
  voters,
  totalFriends,
  votedByYou,
  onVote,
  onClose,
  onPreviewItinerary,
}: DestinationModalProps) {
  const TravelIcon = destination.travel.mode === "flight" ? Plane : Car
  const HeroIcon = destination.icon
  const maxBudgetItem = Math.max(...destination.budget.items.map((item) => item.high))

  return (
    <Modal open onClose={onClose} title={destination.name}>
      <div className={cn("relative flex h-40 items-center justify-center bg-gradient-to-br sm:h-48", destination.gradient)}>
        <HeroIcon className="h-16 w-16 text-white/90" strokeWidth={1.5} aria-hidden="true" />
        <div className="absolute -bottom-3 right-4 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-stone-700 shadow-md">
          <CloudSun className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
          {destination.weather.high}°/{destination.weather.low}° · {destination.weather.condition}
        </div>
      </div>

      <div className="flex flex-col gap-6 p-6 pt-8">
        <div>
          <div className="flex items-center gap-1.5 text-sm text-stone-500">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {destination.region}
          </div>
          <h2 className="mt-1 text-2xl font-semibold text-stone-900">{destination.name}</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">{destination.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {destination.vibes.map((vibe) => (
              <span key={vibe} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-600">
                {vibe}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatTile
            icon={Wallet}
            label="Budget"
            value={formatBudgetRange(destination.budget.low, destination.budget.high)}
            detail="per person"
          />
          <StatTile
            icon={TravelIcon}
            label="Travel time"
            value={destination.travel.duration}
            detail={destination.travel.detail}
          />
          <StatTile
            icon={CloudSun}
            label="Weather"
            value={`${destination.weather.high}°/${destination.weather.low}°F`}
            detail={destination.weather.condition}
          />
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">Budget breakdown</h3>
          <div className="mt-3 space-y-3">
            {destination.budget.items.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-600">{item.label}</span>
                  <span className="font-medium text-stone-800">{formatBudgetRange(item.low, item.high)}</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
                  <div
                    className={cn("h-full rounded-full bg-gradient-to-r", destination.gradient)}
                    style={{ width: `${(item.high / maxBudgetItem) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">Why this weekend works</h3>
          <ul className="mt-3 space-y-2">
            {destination.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2 text-sm text-stone-700">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">Where you'd stay</h3>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <div>
              <p className="text-sm font-semibold text-stone-900">{destination.lodging.name}</p>
              <p className="text-xs text-stone-500">
                {destination.lodging.type} · {destination.lodging.neighborhood}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold text-stone-900">
                {formatCurrency(destination.lodging.pricePerNight)}
                <span className="font-normal text-stone-400">/night</span>
              </p>
              <p className="flex items-center justify-end gap-0.5 text-xs text-amber-600">
                <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                {destination.lodging.rating}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">Pack for it</h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {destination.packingNotes.map((note) => (
              <span key={note} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-600">
                {note}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-stone-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {voters.length > 0 ? (
              <>
                <AvatarStack friends={voters} max={6} size="sm" />
                <span className="text-xs text-stone-500">
                  {voters.length} of {totalFriends} voted for this
                </span>
              </>
            ) : (
              <span className="text-xs text-stone-400">No votes yet</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPreviewItinerary}
              className="rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              See the itinerary
            </button>
            <button
              type="button"
              onClick={onVote}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition",
                votedByYou ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-stone-900 text-white hover:bg-stone-700",
              )}
            >
              {votedByYou ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  Your pick
                </>
              ) : (
                "Vote for this"
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
