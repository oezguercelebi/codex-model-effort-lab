import { ArrowLeft, Check, Copy, Crown, Eye, Info, Luggage, Wallet } from "lucide-react"
import {
  COST_CATEGORIES,
  DESTINATIONS,
  PACKING_ITEMS,
  TRIP,
  eur,
  totalCost,
  type Destination,
} from "../data"
import DestinationArt from "./DestinationArt"
import { Chip, SectionHeading } from "./ui"

interface ItineraryViewProps {
  shown: Destination
  leader: Destination
  isTied: boolean
  votes: number
  packed: string[]
  onTogglePacked: (id: string) => void
  onPreview: (id: string | null) => void
  onCopy: () => void
}

export default function ItineraryView({
  shown,
  leader,
  isTied,
  votes,
  packed,
  onTogglePacked,
  onPreview,
  onCopy,
}: ItineraryViewProps) {
  const isLeaderShown = shown.id === leader.id
  const total = totalCost(shown)
  const TravelIcon = shown.travel.icon
  const WeatherIcon = shown.weather.icon

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="The plan"
          title={isLeaderShown ? "Your weekend, drafted" : "Trying on another weekend"}
          description="A ready-to-argue-about itinerary for the winning city. It updates live as the vote moves."
        />
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-stone-700 active:scale-95"
        >
          <Copy className="h-4 w-4" aria-hidden /> Copy plan
        </button>
      </div>

      {/* Destination switcher */}
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Preview a destination">
        <div className="flex w-max gap-2">
          {DESTINATIONS.map((d) => {
            const active = d.id === shown.id
            return (
              <button
                key={d.id}
                role="tab"
                aria-selected={active}
                onClick={() => onPreview(d.id === leader.id ? null : d.id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3.5 text-sm font-medium transition-all ${
                  active
                    ? "border-stone-900 bg-stone-900 text-white shadow-sm"
                    : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                }`}
              >
                <span
                  className="h-6 w-6 rounded-full"
                  style={{ background: `linear-gradient(160deg, ${d.art.sky[0]}, ${d.art.sky[1]})` }}
                  aria-hidden
                />
                {d.name}
                {d.id === leader.id && (
                  <Crown className={`h-3.5 w-3.5 ${active ? "text-amber-300" : "text-amber-500"}`} aria-hidden />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {!isLeaderShown && (
        <div className="anim-rise flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <Eye className="h-4 w-4 shrink-0" aria-hidden />
          <span className="min-w-0 flex-1">
            You're previewing <strong>{shown.name}</strong> — <strong>{leader.name}</strong> is
            currently winning the vote.
          </span>
          <button
            onClick={() => onPreview(null)}
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-900 px-3 py-1.5 text-xs font-semibold text-amber-50 transition-colors hover:bg-amber-800"
          >
            <ArrowLeft className="h-3 w-3" aria-hidden /> Back to {leader.name}
          </button>
        </div>
      )}

      {/* Hero banner */}
      <section className="relative overflow-hidden rounded-3xl shadow-sm">
        <div className="h-48 sm:h-64">
          <DestinationArt destination={shown} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/40 to-stone-950/10" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-300">
            {isLeaderShown
              ? isTied
                ? "Leading on the tiebreak"
                : `The group pick · ${votes} of ${TRIP.travelers * TRIP.votesPerPerson} votes`
              : "Just looking"}
          </p>
          <h3 className="mt-1 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {shown.name} <span aria-hidden>{shown.flag}</span>
          </h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Chip className="border-white/20 bg-white/15 text-white backdrop-blur">{TRIP.dateLabel}</Chip>
            <Chip icon={TravelIcon} className="border-white/20 bg-white/15 text-white backdrop-blur [&_svg]:text-white/70">
              {shown.travel.duration} from {TRIP.origin}
            </Chip>
            <Chip icon={WeatherIcon} className="border-white/20 bg-white/15 text-white backdrop-blur [&_svg]:text-white/70">
              around {shown.weather.tempC}°
            </Chip>
            <Chip className="border-white/20 bg-white/15 text-white backdrop-blur">
              {eur(total)} pp
            </Chip>
          </div>
        </div>
      </section>

      {/* Day-by-day */}
      <section className="grid gap-4 lg:grid-cols-3" aria-label="Day by day plan">
        {shown.itinerary.map((day, i) => (
          <article
            key={day.label}
            className="anim-rise rounded-3xl border border-stone-200/70 bg-white p-5 shadow-sm"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <header className="flex items-baseline justify-between gap-2">
              <h4 className="text-base font-semibold tracking-tight text-stone-900">{day.label}</h4>
              <span className="text-xs font-medium text-stone-400">{day.date}</span>
            </header>
            <p className="mt-0.5 text-xs font-medium text-orange-600">{day.theme}</p>
            <ol className="mt-4 space-y-0">
              {day.items.map((item, j) => (
                <li key={item.time} className="relative flex gap-3 pb-5 last:pb-0">
                  {j < day.items.length - 1 && (
                    <span className="absolute left-[15px] top-9 h-[calc(100%-2.25rem)] w-px bg-stone-200" aria-hidden />
                  )}
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-stone-100 text-stone-500">
                    <item.icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-semibold text-stone-900">
                      <span className="mr-1.5 font-medium tabular-nums text-stone-400">{item.time}</span>
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-stone-500">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {/* Budget summary */}
        <article className="rounded-3xl border border-stone-200/70 bg-white p-5 shadow-sm">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-stone-900">
            <Wallet className="h-4 w-4 text-stone-400" aria-hidden /> The damage
          </h4>
          <dl className="mt-4 space-y-2.5">
            {COST_CATEGORIES.map((c) => (
              <div key={c.key} className="flex items-center justify-between gap-3 text-sm">
                <dt className="flex items-center gap-2 text-stone-600">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.color }} aria-hidden />
                  {c.label}
                </dt>
                <dd className="font-medium tabular-nums text-stone-900">{eur(shown.costs[c.key])}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3.5">
            <p className="text-sm font-semibold text-stone-900">Per person</p>
            <p className="text-lg font-semibold tracking-tight text-stone-900">{eur(total)}</p>
          </div>
          <p className="mt-1 text-xs text-stone-400">
            ≈ {eur(total * TRIP.travelers)} for all {TRIP.travelers} of you · {TRIP.nights} nights
          </p>
        </article>

        {/* Packing list */}
        <article className="rounded-3xl border border-stone-200/70 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-stone-900">
              <Luggage className="h-4 w-4 text-stone-400" aria-hidden /> Packing check
            </h4>
            <span className="text-xs font-medium tabular-nums text-stone-500">
              {packed.length} of {PACKING_ITEMS.length}
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-orange-100">
            <div
              className="h-full rounded-full bg-orange-500 transition-all duration-500"
              style={{ width: `${(packed.length / PACKING_ITEMS.length) * 100}%` }}
            />
          </div>
          <ul className="mt-4 grid gap-1 sm:grid-cols-2">
            {PACKING_ITEMS.map((item) => {
              const done = packed.includes(item.id)
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onTogglePacked(item.id)}
                    aria-pressed={done}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left text-sm transition-colors hover:bg-stone-50"
                  >
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors ${
                        done ? "border-orange-500 bg-orange-500 text-white" : "border-stone-300 bg-white text-transparent"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <span className={done ? "text-stone-400 line-through" : "text-stone-700"}>{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </article>
      </section>

      <p className="flex items-start gap-2 text-xs leading-5 text-stone-400">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        Voting stays open until {TRIP.votingCloses} — if the lead changes, so does this page.
      </p>
    </div>
  )
}
