import { useEffect, useRef } from "react"
import { CalendarRange, Check, Crown, X } from "lucide-react"
import { COST_CATEGORIES, TRIP, eur, totalCost, type Destination, type Person } from "../data"
import DestinationArt from "./DestinationArt"
import VoteButton from "./VoteButton"
import { AvatarStack, Chip } from "./ui"

interface DestinationModalProps {
  dest: Destination
  voters: Person[]
  voted: boolean
  outOfVotes: boolean
  isLeader: boolean
  onVote: () => void
  onClose: () => void
  onPlan: () => void
}

export default function DestinationModal({
  dest,
  voters,
  voted,
  outOfVotes,
  isLeader,
  onVote,
  onClose,
  onPlan,
}: DestinationModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const total = totalCost(dest)
  const TravelIcon = dest.travel.icon
  const WeatherIcon = dest.weather.icon

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return (
    <div
      className="anim-fade fixed inset-0 z-50 flex items-end justify-center bg-stone-950/40 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${dest.name} details`}
    >
      <div
        className="anim-slide-up flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[85dvh] sm:max-w-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="relative h-44 shrink-0 sm:h-52">
            <DestinationArt destination={dest} />
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close details"
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-stone-700 shadow-sm backdrop-blur transition-colors hover:bg-white"
            >
              <X className="h-4.5 w-4.5" aria-hidden />
            </button>
            {isLeader && (
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-stone-900/80 px-2.5 py-1 text-[11px] font-semibold text-amber-300 backdrop-blur">
                <Crown className="h-3 w-3" aria-hidden /> In the lead
              </span>
            )}
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            <header>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight text-stone-900">
                    {dest.name} <span aria-hidden>{dest.flag}</span>
                  </h3>
                  <p className="text-sm font-medium text-stone-400">{dest.country}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-semibold tracking-tight text-stone-900">{eur(total)}</p>
                  <p className="text-xs text-stone-400">per person, all-in</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-500">{dest.tagline}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Chip icon={TravelIcon}>{dest.travel.detail}</Chip>
                <Chip icon={WeatherIcon}>
                  {dest.weather.tempC}° · {dest.weather.summary}
                </Chip>
                {dest.tags.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </header>

            <section aria-label="Budget breakdown">
              <h4 className="text-sm font-semibold text-stone-900">Where the money goes</h4>
              <div className="mt-3 flex h-3.5 w-full gap-[2px]" aria-hidden>
                {COST_CATEGORIES.map((c, i) => (
                  <span
                    key={c.key}
                    title={`${c.label}: ${eur(dest.costs[c.key])}`}
                    className={`h-full ${i === COST_CATEGORIES.length - 1 ? "rounded-r-[4px]" : ""}`}
                    style={{ width: `${(dest.costs[c.key] / total) * 100}%`, backgroundColor: c.color }}
                  />
                ))}
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2">
                {COST_CATEGORIES.map((c) => (
                  <div key={c.key} className="flex items-center justify-between gap-2 text-sm">
                    <dt className="flex items-center gap-2 text-stone-600">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: c.color }} aria-hidden />
                      {c.label}
                    </dt>
                    <dd className="font-medium tabular-nums text-stone-900">{eur(dest.costs[c.key])}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-label="Highlights">
              <h4 className="text-sm font-semibold text-stone-900">You'd be doing this</h4>
              <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {dest.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm leading-5 text-stone-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" aria-hidden />
                    {h}
                  </li>
                ))}
              </ul>
            </section>

            <section className="flex items-center gap-2 rounded-2xl bg-stone-50 px-4 py-3">
              {voters.length > 0 ? (
                <>
                  <AvatarStack people={voters} size="sm" max={6} />
                  <p className="text-xs font-medium text-stone-500">
                    {voters.length} of {TRIP.travelers * TRIP.votesPerPerson} votes so far
                  </p>
                </>
              ) : (
                <p className="text-xs font-medium text-stone-400">
                  No votes yet — someone has to be first.
                </p>
              )}
            </section>
          </div>
        </div>

        <footer className="flex shrink-0 gap-2.5 border-t border-stone-100 bg-white/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur sm:px-7">
          <button
            onClick={onPlan}
            className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50"
          >
            <CalendarRange className="h-4 w-4" aria-hidden /> See itinerary
          </button>
          <VoteButton voted={voted} outOfVotes={outOfVotes} onToggle={onVote} size="lg" className="flex-1" />
        </footer>
      </div>
    </div>
  )
}
