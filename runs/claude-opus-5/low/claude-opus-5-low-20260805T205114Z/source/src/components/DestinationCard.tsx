import {
  AlertTriangle,
  Car,
  Clock,
  Plane,
  Ship,
  Sun,
  Train,
  Wallet,
} from "lucide-react"
import { TRAVELERS } from "../data"
import { cx, fitFor, formatHours, formatMoney, totalPerPerson } from "../lib"
import type { Tally } from "../lib"
import type { Destination, TravelMode, VoteValue } from "../types"
import { VibeChip, VoteButtons, VoteDots } from "./ui"

export const MODE_ICON: Record<TravelMode, typeof Plane> = {
  flight: Plane,
  train: Train,
  car: Car,
  ferry: Ship,
}

export function DestinationCard({
  destination,
  tally,
  rank,
  myVote,
  onVote,
  onOpen,
  travelerName,
}: {
  destination: Destination
  tally: Tally
  rank: number
  myVote: VoteValue | undefined
  onVote: (value: VoteValue) => void
  onOpen: () => void
  travelerName: string
}) {
  const total = totalPerPerson(destination)
  const fit = fitFor(destination)
  const ModeIcon = MODE_ICON[destination.travelMode]
  const warnings = [
    fit.overBudgetFor.length > 0 &&
      `Over budget for ${fit.overBudgetFor.map((t) => t.name).join(", ")}`,
    fit.tooFarFor.length > 0 &&
      `Too far for ${fit.tooFarFor.map((t) => t.name).join(", ")}`,
  ].filter(Boolean) as string[]

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-lg hover:shadow-stone-900/5">
      <button
        type="button"
        onClick={onOpen}
        className="relative block h-36 w-full text-left focus:outline-none"
        aria-label={`Open details for ${destination.name}`}
      >
        <div
          className={cx(
            "absolute inset-0 bg-gradient-to-br transition-transform duration-500 group-hover:scale-105",
            destination.from,
            destination.to,
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          {rank <= 3 && tally.score > 0 ? (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-stone-900 shadow-sm">
              #{rank} pick
            </span>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-1.5 rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            <Sun className="h-3 w-3" />
            {destination.weather.high}°
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="text-[11px] font-semibold tracking-[0.16em] uppercase opacity-90">
            {destination.country}
          </p>
          <h3 className="text-2xl leading-tight font-semibold tracking-tight">
            {destination.name}
          </h3>
        </div>
      </button>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <p className="text-sm leading-6 text-stone-600">{destination.tagline}</p>

        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-stone-50 p-3">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-stone-500 uppercase">
              <Wallet className="h-3 w-3" /> Per person
            </div>
            <p className="mt-0.5 text-base font-semibold text-stone-900">
              {formatMoney(total)}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-stone-500 uppercase">
              <Clock className="h-3 w-3" /> Door to door
            </div>
            <p className="mt-0.5 flex items-center gap-1.5 text-base font-semibold text-stone-900">
              <ModeIcon className="h-3.5 w-3.5 text-stone-500" />
              {formatHours(destination.travelHours)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {destination.vibes.slice(0, 4).map((vibe) => (
            <VibeChip key={vibe} vibe={vibe} />
          ))}
        </div>

        {warnings.length > 0 ? (
          <div className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{warnings.join(" · ")}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
            Fits everyone&apos;s budget and travel limits
          </div>
        )}

        <div className="mt-auto space-y-3 border-t border-stone-100 pt-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium text-stone-500">
              {tally.cast === TRAVELERS.length
                ? `All ${TRAVELERS.length} voted · ${tally.score} pts`
                : `${tally.cast} of ${TRAVELERS.length} voted · ${tally.score} pts`}
            </p>
            <VoteDots
              yes={tally.yes}
              maybe={tally.maybe}
              no={tally.no}
              pending={TRAVELERS.length - tally.cast}
            />
          </div>
          <VoteButtons
            value={myVote}
            onChange={onVote}
            travelerName={travelerName}
            destinationName={destination.name}
            size="sm"
          />
          <button
            type="button"
            onClick={onOpen}
            className="w-full rounded-xl px-3 py-1.5 text-xs font-semibold text-stone-500 transition-colors hover:bg-stone-50 hover:text-stone-900"
          >
            View details & itinerary
          </button>
        </div>
      </div>
    </article>
  )
}
