import { useEffect } from "react"
import {
  BedDouble,
  Bus,
  Heart,
  Plane,
  Ticket,
  TrainFront,
  Utensils,
  X,
} from "lucide-react"
import {
  TRIP,
  budgetTotal,
  formatDuration,
  formatEuro,
  type Destination,
} from "../data"
import type { Voter } from "../App"
import { Avatar, ScoreDots, VibePill, WeatherBadge, weatherLabel } from "./ui"

const BUDGET_ROWS = [
  { key: "transport", label: "Getting there", icon: Bus },
  { key: "stay", label: "Stay · 2 nights", icon: BedDouble },
  { key: "food", label: "Food & drink", icon: Utensils },
  { key: "activities", label: "Activities", icon: Ticket },
] as const

export function DestinationModal({
  destination: d,
  voters,
  userVotes,
  locked,
  onToggleVote,
  onClose,
}: {
  destination: Destination
  voters: Voter[]
  userVotes: string[]
  locked: boolean
  onToggleVote: (id: string) => void
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    const { overflow } = document.body.style
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = overflow
    }
  }, [onClose])

  const total = budgetTotal(d.budget)
  const youVoted = userVotes.includes(d.id)
  const votesLeft = TRIP.maxVotesPerPerson - userVotes.length
  const voteDisabled = locked || (!youVoted && votesLeft === 0)
  const TravelIcon = d.travel.mode === "flight" ? Plane : TrainFront

  return (
    <div
      className="fixed inset-0 z-40 grid place-items-center bg-stone-950/40 p-0 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${d.name} details`}
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up flex h-full w-full max-w-2xl flex-col overflow-hidden bg-white shadow-xl sm:h-auto sm:max-h-[90vh] sm:rounded-3xl"
      >
        <div className={`relative shrink-0 bg-gradient-to-br ${d.gradient} px-6 pb-5 pt-14`}>
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/80 text-stone-700 backdrop-blur transition-colors hover:bg-white"
          >
            <X className="size-5" aria-hidden />
          </button>
          <span className="absolute left-6 top-4 rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-stone-700 backdrop-blur">
            {d.flag} {d.country}
          </span>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-stone-900">
                {d.name} <span aria-hidden>{d.emoji}</span>
              </h2>
              <p className="mt-1 max-w-md text-sm leading-relaxed text-stone-700">{d.tagline}</p>
            </div>
            <span className="rounded-full bg-white/80 px-3 py-1.5 backdrop-blur">
              <WeatherBadge kind={d.weather.kind} tempC={d.weather.tempC} />
            </span>
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6">
          <div className="flex flex-wrap gap-1.5">
            {d.vibes.map((v) => (
              <VibePill key={v} vibe={v} />
            ))}
          </div>

          <section>
            <div className="flex items-baseline justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wide text-stone-400">
                Budget per person
              </h3>
              <p className="text-lg font-bold tracking-tight">{formatEuro(total)}</p>
            </div>
            <ul className="mt-3 space-y-2.5">
              {BUDGET_ROWS.map(({ key, label, icon: Icon }) => {
                const value = d.budget[key]
                return (
                  <li key={key} className="grid grid-cols-[1.25rem_8rem_1fr_3rem] items-center gap-2 text-sm">
                    <Icon className="size-4 text-stone-400" aria-hidden />
                    <span className="text-stone-600">{label}</span>
                    <span className="h-2 overflow-hidden rounded-full bg-stone-100">
                      <span
                        className="block h-full rounded-full bg-amber-400"
                        style={{ width: `${(value / total) * 100}%` }}
                      />
                    </span>
                    <span className="text-right font-semibold">{formatEuro(value)}</span>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-stone-50 p-4">
              <h3 className="text-sm font-bold uppercase tracking-wide text-stone-400">
                Getting there
              </h3>
              <p className="mt-2 flex items-center gap-2 font-semibold">
                <TravelIcon className="size-4 text-stone-400" aria-hidden />
                {formatDuration(d.travel.durationMin)} from {TRIP.origin}
              </p>
              <p className="mt-1 text-sm text-stone-500">{d.travel.detail}</p>
              <p className="mt-3 text-sm text-stone-500">
                <span className="font-medium text-stone-700">Weather that weekend:</span>{" "}
                {weatherLabel(d.weather.kind).toLowerCase()}, around {d.weather.tempC}°.
              </p>
              <p className="mt-1 text-sm text-stone-500">
                <span className="font-medium text-stone-700">Stay:</span> {d.stayArea}
              </p>
            </div>
            <div className="rounded-2xl bg-stone-50 p-4">
              <h3 className="text-sm font-bold uppercase tracking-wide text-stone-400">
                What it's great at
              </h3>
              <ul className="mt-2 space-y-2 text-sm">
                {(
                  [
                    ["Food scene", d.scores.food],
                    ["Nightlife", d.scores.nightlife],
                    ["Culture", d.scores.culture],
                    ["Outdoors", d.scores.outdoors],
                  ] as const
                ).map(([label, score]) => (
                  <li key={label} className="flex items-center justify-between gap-3">
                    <span className="text-stone-600">{label}</span>
                    <ScoreDots score={score} label={label} />
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-sm font-bold uppercase tracking-wide text-stone-400">
              If {d.name} wins
            </h3>
            <ul className="mt-2 space-y-1.5">
              {d.itinerary.map((day) => (
                <li key={day.label} className="flex gap-2 text-sm">
                  <span className="w-20 shrink-0 font-semibold text-stone-700">{day.label}</span>
                  <span className="text-stone-500">{day.summary}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-stone-400">
              The full hour-by-hour plan unlocks on the Results tab once voting closes.
            </p>
          </section>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-stone-100 p-4 sm:px-6">
          <div className="flex items-center gap-2">
            {voters.length > 0 ? (
              <>
                <span className="flex -space-x-2">
                  {voters.map((v) => (
                    <Avatar
                      key={v.id}
                      initials={v.initials}
                      color={v.color}
                      size="sm"
                      ring
                      title={v.name}
                    />
                  ))}
                </span>
                <span className="text-sm text-stone-500">
                  {voters.length === 1
                    ? `${voters[0].name === "You" ? "You're" : `${voters[0].name} is`} in`
                    : `${voters.length} of ${TRIP.groupSize} are in`}
                </span>
              </>
            ) : (
              <span className="text-sm text-stone-400">No votes yet — be the first</span>
            )}
          </div>
          <button
            onClick={() => onToggleVote(d.id)}
            disabled={voteDisabled}
            aria-pressed={youVoted}
            title={
              locked
                ? "Voting is locked"
                : !youVoted && votesLeft === 0
                  ? "All 3 votes used — remove one first"
                  : undefined
            }
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
              youVoted
                ? "bg-rose-500 text-white shadow-sm hover:bg-rose-600"
                : "bg-stone-900 text-white hover:bg-stone-700"
            } ${voteDisabled ? "cursor-not-allowed opacity-50" : "active:scale-95"}`}
          >
            <Heart className={`size-4 ${youVoted ? "fill-current" : ""}`} aria-hidden />
            {youVoted ? "Voted — tap to remove" : `Vote for ${d.name}`}
          </button>
        </div>
      </div>
    </div>
  )
}
