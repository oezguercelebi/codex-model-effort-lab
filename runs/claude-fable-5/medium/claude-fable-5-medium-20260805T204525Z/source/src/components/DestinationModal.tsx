import { useEffect } from "react"
import { BedDouble, CalendarDays, Check, Clock, Heart, Sparkles, Thermometer, X } from "lucide-react"
import { budgetTotal, TRIP, type Destination } from "../data"
import { BUDGET_SEGMENTS, formatEuro, formatHours, TravelModeIcon, VibeTag } from "./ui"

interface Props {
  destination: Destination
  voteCount: number
  youVoted: boolean
  canVote: boolean
  onToggleVote: () => void
  onViewItinerary: () => void
  onClose: () => void
}

export function DestinationModal({
  destination: d,
  voteCount,
  youVoted,
  canVote,
  onToggleVote,
  onViewItinerary,
  onClose,
}: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  const total = budgetTotal(d.budget)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${d.name} details`}
    >
      <div
        className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`relative bg-gradient-to-br ${d.gradient} p-6 pb-14 text-white sm:rounded-t-3xl`}>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 transition hover:bg-white/35"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
          <span className="text-5xl" aria-hidden>
            {d.emoji}
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">{d.name}</h2>
          <p className="font-medium text-white/85">
            {d.country} · {d.travelSummary}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {d.vibes.map((v) => (
              <VibeTag key={v} vibe={v} />
            ))}
          </div>
        </div>

        <div className="-mt-8 space-y-6 px-6 pb-6">
          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <div>
              <div className="text-xs font-medium text-stone-500">Per person</div>
              <div className="text-lg font-bold text-stone-900">{formatEuro(total)}</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs font-medium text-stone-500">
                <TravelModeIcon mode={d.travelMode} className="size-3.5" />
                <Clock className="size-3" aria-hidden /> One way
              </div>
              <div className="text-lg font-bold text-stone-900">{formatHours(d.travelTimeH)}</div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs font-medium text-stone-500">
                <Thermometer className="size-3.5" aria-hidden /> Weather
              </div>
              <div className="text-lg font-bold text-stone-900">{d.tempC}°C</div>
              <div className="text-xs text-stone-500">{d.weather}</div>
            </div>
          </div>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
              Budget per person · {TRIP.nights} nights
            </h3>
            <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full">
              {BUDGET_SEGMENTS.map((s) => (
                <div
                  key={s.key}
                  className={s.color}
                  style={{ width: `${(d.budget[s.key] / total) * 100}%` }}
                  title={`${s.label}: ${formatEuro(d.budget[s.key])}`}
                />
              ))}
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
              {BUDGET_SEGMENTS.map((s) => (
                <div key={s.key} className="flex items-center justify-between gap-2 sm:block">
                  <dt className="flex items-center gap-1.5 text-stone-500">
                    <span className={`size-2.5 rounded-full ${s.color}`} aria-hidden />
                    {s.label}
                  </dt>
                  <dd className="font-semibold text-stone-900">{formatEuro(d.budget[s.key])}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl bg-stone-50 p-4">
            <div className="flex items-start gap-3">
              <BedDouble className="mt-0.5 size-5 shrink-0 text-stone-400" aria-hidden />
              <div>
                <div className="text-sm font-semibold text-stone-900">Where we'd stay</div>
                <div className="text-sm text-stone-600">{d.stay}</div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-stone-500">
              <Sparkles className="size-4" aria-hidden /> Don't miss
            </h3>
            <ul className="mt-2 space-y-1.5">
              {d.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-stone-700">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" aria-hidden />
                  {h}
                </li>
              ))}
            </ul>
          </section>

          <div className="flex flex-col gap-2 border-t border-stone-100 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={onToggleVote}
              disabled={!youVoted && !canVote}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                youVoted
                  ? "bg-rose-500 text-white hover:bg-rose-600"
                  : canVote
                    ? "bg-stone-900 text-white hover:bg-stone-700"
                    : "cursor-not-allowed bg-stone-100 text-stone-400"
              }`}
            >
              <Heart className={`size-4 ${youVoted ? "fill-current" : ""}`} aria-hidden />
              {youVoted ? "Remove my vote" : canVote ? "Vote for this trip" : "Both votes used"}
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {voteCount} vote{voteCount === 1 ? "" : "s"}
              </span>
            </button>
            <button
              type="button"
              onClick={onViewItinerary}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
            >
              <CalendarDays className="size-4" aria-hidden /> Preview itinerary
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
