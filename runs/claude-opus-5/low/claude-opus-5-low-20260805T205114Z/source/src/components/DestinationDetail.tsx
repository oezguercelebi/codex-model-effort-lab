import { Check, Clock, Footprints, Sparkles, Sun, Wallet, X } from "lucide-react"
import { useEffect, useRef } from "react"
import { TRAVELERS } from "../data"
import type { Tally } from "../lib"
import { cx, fitFor, formatHours, formatMoney, totalPerPerson } from "../lib"
import type { Destination, VoteValue, Votes } from "../types"
import { MODE_ICON } from "./DestinationCard"
import { Itinerary } from "./Itinerary"
import { Avatar, Stat, VibeChip, VoteButtons } from "./ui"

const BUDGET_ROWS = [
  { key: "lodging", label: "Lodging (2 nights)", className: "bg-indigo-500" },
  { key: "transport", label: "Getting there", className: "bg-violet-500" },
  { key: "food", label: "Food & drink", className: "bg-rose-500" },
  { key: "activities", label: "Activities", className: "bg-amber-500" },
] as const

export function DestinationDetail({
  destination,
  tally,
  votes,
  currentTravelerId,
  onVote,
  onClose,
}: {
  destination: Destination
  tally: Tally
  votes: Votes
  currentTravelerId: string
  onVote: (travelerId: string, value: VoteValue) => void
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  const total = totalPerPerson(destination)
  const fit = fitFor(destination)
  const ModeIcon = MODE_ICON[destination.travelMode]
  const currentTraveler =
    TRAVELERS.find((t) => t.id === currentTravelerId) ?? TRAVELERS[0]

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-stone-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${destination.name} details`}
        className="relative flex h-full w-full max-w-2xl flex-col bg-stone-50 shadow-2xl duration-300 motion-safe:animate-[slideIn_.25s_ease-out]"
      >
        <div className="relative h-44 shrink-0 sm:h-56">
          <div
            className={cx(
              "absolute inset-0 bg-gradient-to-br",
              destination.from,
              destination.to,
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-stone-800 shadow-sm transition-colors hover:bg-white"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase opacity-90">
              {destination.country} · {destination.knownFor}
            </p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              {destination.name}
            </h2>
            <p className="mt-1 max-w-md text-sm opacity-95">{destination.tagline}</p>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-5 pb-24 sm:p-7">
          <p className="leading-7 text-stone-700">{destination.blurb}</p>

          <div className="flex flex-wrap gap-1.5">
            {destination.vibes.map((vibe) => (
              <VibeChip key={vibe} vibe={vibe} />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-stone-200 bg-white p-4 sm:grid-cols-4">
            <Stat
              icon={<Wallet className="h-3 w-3" />}
              label="Per person"
              value={formatMoney(total)}
              hint={`${formatMoney(total * TRAVELERS.length)} for the group`}
            />
            <Stat
              icon={<Clock className="h-3 w-3" />}
              label="Travel"
              value={formatHours(destination.travelHours)}
              hint={destination.travelNote}
            />
            <Stat
              icon={<Sun className="h-3 w-3" />}
              label="Weather"
              value={`${destination.weather.high}° / ${destination.weather.low}°`}
              hint={destination.weather.summary}
            />
            <Stat
              icon={<Footprints className="h-3 w-3" />}
              label="Walkable"
              value={`${destination.walkability}/100`}
              hint={destination.walkability > 75 ? "No car needed" : "Some transfers"}
            />
          </div>

          <section className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold text-stone-900">Budget breakdown</h3>
              <span className="text-xs text-stone-500">per person, 2 nights</span>
            </div>
            <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-stone-100">
              {BUDGET_ROWS.map((row) => (
                <div
                  key={row.key}
                  className={row.className}
                  style={{ width: `${(destination.budget[row.key] / total) * 100}%` }}
                />
              ))}
            </div>
            <dl className="mt-4 space-y-2.5">
              {BUDGET_ROWS.map((row) => (
                <div key={row.key} className="flex items-center gap-3 text-sm">
                  <span className={cx("h-2.5 w-2.5 rounded-full", row.className)} />
                  <dt className="flex-1 text-stone-600">{row.label}</dt>
                  <dd className="font-semibold text-stone-900 tabular-nums">
                    {formatMoney(destination.budget[row.key])}
                  </dd>
                </div>
              ))}
              <div className="flex items-center gap-3 border-t border-stone-100 pt-2.5 text-sm">
                <span className="h-2.5 w-2.5" />
                <dt className="flex-1 font-semibold text-stone-900">Total each</dt>
                <dd className="font-semibold text-stone-900 tabular-nums">
                  {formatMoney(total)}
                </dd>
              </div>
            </dl>
            <div className="mt-4 space-y-1.5">
              {TRAVELERS.map((t) => {
                const over = total - t.budgetMax
                const far = destination.travelHours - t.maxTravelHours
                return (
                  <div key={t.id} className="flex items-center gap-2.5 text-xs">
                    <Avatar traveler={t} size="sm" />
                    <span className="w-14 font-medium text-stone-700">{t.name}</span>
                    <span
                      className={cx(
                        "flex-1",
                        over > 0 || far > 0 ? "text-amber-700" : "text-emerald-700",
                      )}
                    >
                      {over > 0 && far > 0
                        ? `${formatMoney(over)} over budget and ${formatHours(far)} past their travel limit`
                        : over > 0
                          ? `${formatMoney(over)} over their ${formatMoney(t.budgetMax)} cap`
                          : far > 0
                            ? `${formatHours(far)} past their ${formatHours(t.maxTravelHours)} travel limit`
                            : `Comfortably within budget and travel time`}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-stone-900">
              <Sparkles className="h-4 w-4 text-amber-500" /> What you&apos;ll actually do
            </h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {destination.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2 text-sm text-stone-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {highlight}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-semibold text-stone-900">Where the group is</h3>
              <span className="text-xs text-stone-500">
                {tally.score} of {TRAVELERS.length * 2} points
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {TRAVELERS.map((t) => {
                const vote = votes[t.id]?.[destination.id]
                return (
                  <div key={t.id} className="flex items-center gap-3">
                    <Avatar traveler={t} size="sm" />
                    <span className="flex-1 text-sm font-medium text-stone-700">
                      {t.name}
                      {t.id === currentTravelerId ? (
                        <span className="ml-1.5 text-xs font-normal text-stone-400">
                          (you)
                        </span>
                      ) : null}
                    </span>
                    <div className="w-52 max-w-[55%]">
                      <VoteButtons
                        value={vote}
                        onChange={(next) => onVote(t.id, next)}
                        travelerName={t.name}
                        destinationName={destination.name}
                        size="sm"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            {fit.lovedBy.length > 0 ? (
              <p className="mt-4 rounded-xl bg-stone-50 px-3 py-2 text-xs text-stone-600">
                Matches what {fit.lovedBy.map((t) => t.name).join(", ")}{" "}
                said they wanted from this trip.
              </p>
            ) : null}
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-center gap-2">
              <ModeIcon className="h-4 w-4 text-stone-500" />
              <h3 className="text-sm font-semibold text-stone-900">
                Weekend plan · Fri 17 – Sun 19 October
              </h3>
            </div>
            <div className="mt-4">
              <Itinerary destination={destination} />
            </div>
          </section>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-stone-200 bg-white/95 p-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <Avatar traveler={currentTraveler} size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-stone-500">
                Voting as {currentTraveler.name}
              </p>
              <div className="mt-1">
                <VoteButtons
                  value={votes[currentTravelerId]?.[destination.id]}
                  onChange={(next) => onVote(currentTravelerId, next)}
                  travelerName={currentTraveler.name}
                  destinationName={destination.name}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
