import { useState } from "react"
import { CalendarDays, Crown, MapPin, Wallet } from "lucide-react"
import { budgetTotal, DESTINATIONS, TRIP, type Destination } from "../data"
import { formatEuro, formatHours, TravelModeIcon } from "./ui"

interface Props {
  winner: Destination | null
  tie: boolean
  selectedId: string | null
  tally: Map<string, number>
  onSelect: (id: string) => void
}

export function ItineraryView({ winner, tie, selectedId, tally, onSelect }: Props) {
  const destination = DESTINATIONS.find((d) => d.id === selectedId) ?? winner ?? DESTINATIONS[0]
  const isWinner = winner !== null && destination.id === winner.id
  const [activeDay, setActiveDay] = useState(0)
  const day = destination.itinerary[Math.min(activeDay, destination.itinerary.length - 1)]
  const dayCost = day.items.reduce((sum, item) => sum + item.cost, 0)
  const plannedTotal = destination.itinerary.reduce(
    (sum, dd) => sum + dd.items.reduce((s, item) => s + item.cost, 0),
    0,
  )

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Choose destination">
        {DESTINATIONS.map((d) => (
          <button
            key={d.id}
            type="button"
            role="tab"
            aria-selected={d.id === destination.id}
            onClick={() => {
              onSelect(d.id)
              setActiveDay(0)
            }}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              d.id === destination.id
                ? "bg-stone-900 text-white"
                : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
            }`}
          >
            <span aria-hidden>{d.emoji}</span>
            {d.name}
            {winner?.id === d.id && <Crown className="size-3.5 text-amber-400" aria-hidden />}
          </button>
        ))}
      </div>

      <div className={`overflow-hidden rounded-3xl bg-gradient-to-br ${destination.gradient} p-6 text-white shadow-sm`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            {isWinner && (
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-amber-600">
                <Crown className="size-3.5" aria-hidden />
                {tie ? "Tied for the lead" : `Group winner · ${tally.get(destination.id) ?? 0} votes`}
              </span>
            )}
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {destination.name} weekend
            </h2>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-medium text-white/85">
              <span className="flex items-center gap-1">
                <CalendarDays className="size-4" aria-hidden /> {TRIP.dates}
              </span>
              <span className="flex items-center gap-1">
                <TravelModeIcon mode={destination.travelMode} className="size-4" />
                {formatHours(destination.travelTimeH)} from {TRIP.origin}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-4" aria-hidden /> {destination.stay}
              </span>
            </p>
          </div>
          <div className="rounded-2xl bg-white/15 px-4 py-2.5 text-right backdrop-blur-sm">
            <div className="text-xs font-medium text-white/80">Est. per person</div>
            <div className="text-xl font-bold">{formatEuro(budgetTotal(destination.budget))}</div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex gap-2" role="tablist" aria-label="Day">
        {destination.itinerary.map((dd, i) => (
          <button
            key={dd.label}
            type="button"
            role="tab"
            aria-selected={i === activeDay}
            onClick={() => setActiveDay(i)}
            className={`flex-1 rounded-xl px-3 py-2.5 text-center transition ${
              i === activeDay
                ? "bg-stone-900 text-white shadow-sm"
                : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
            }`}
          >
            <span className="block text-sm font-semibold">{dd.label}</span>
            <span className={`block text-xs ${i === activeDay ? "text-stone-300" : "text-stone-400"}`}>
              {dd.date}
            </span>
          </button>
        ))}
      </div>

      <ol className="mt-5 space-y-0">
        {day.items.map((item, i) => (
          <li key={item.time + item.title} className="relative flex gap-4 pb-6">
            {i < day.items.length - 1 && (
              <span className="absolute left-[2.65rem] top-8 bottom-0 w-px bg-stone-200" aria-hidden />
            )}
            <span className="w-12 shrink-0 pt-1.5 text-right text-sm font-bold tabular-nums text-stone-500">
              {item.time}
            </span>
            <span
              className={`relative mt-2 size-2.5 shrink-0 rounded-full bg-gradient-to-br ${destination.gradient}`}
              aria-hidden
            />
            <div className="min-w-0 flex-1 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <span className="font-semibold text-stone-900">{item.title}</span>
                <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-600">
                  {item.cost > 0 ? formatEuro(item.cost) : "Free"}
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-stone-600">{item.note}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-stone-100 px-4 py-3 text-sm">
        <span className="flex items-center gap-2 font-medium text-stone-600">
          <Wallet className="size-4" aria-hidden /> {day.label} spend: {formatEuro(dayCost)} pp
        </span>
        <span className="text-stone-500">
          Full plan: {formatEuro(plannedTotal)} pp + {formatEuro(destination.budget.stay)} stay
        </span>
      </div>
    </div>
  )
}
