import { useState } from "react"
import { Car, Clock, Plane, Trophy } from "lucide-react"
import { destinations, budgetTotal } from "../data/destinations"
import { getIcon } from "../lib/icons"
import type { ItineraryDay } from "../types"

export function ItineraryView({
  selectedId,
  onSelect,
  leaderId,
  voteCount,
}: {
  selectedId: string
  onSelect: (id: string) => void
  leaderId: string | null
  voteCount: (id: string) => number
}) {
  const destination = destinations.find((d) => d.id === selectedId) ?? destinations[0]
  const [activeDay, setActiveDay] = useState<ItineraryDay["day"]>("Friday")
  const day = destination.itinerary.find((d) => d.day === activeDay) ?? destination.itinerary[0]
  const Icon = getIcon(destination.icon)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap gap-2">
        {destinations.map((d) => {
          const isSelected = d.id === destination.id
          return (
            <button
              key={d.id}
              onClick={() => onSelect(d.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                isSelected ? "bg-stone-900 text-white" : "bg-white text-stone-600 ring-1 ring-inset ring-stone-200 hover:bg-stone-100"
              }`}
            >
              {d.id === leaderId && <Trophy className="h-3.5 w-3.5 text-amber-400" />}
              {d.name}
              {voteCount(d.id) > 0 && (
                <span className={`tabular-nums ${isSelected ? "text-white/70" : "text-stone-400"}`}>
                  {voteCount(d.id)}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className={`relative mt-5 overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white ${destination.gradient}`}>
        <Icon className="absolute -bottom-8 -right-8 h-40 w-40 text-white/15" strokeWidth={1.5} />
        {destination.id === leaderId && (
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-amber-700">
            <Trophy className="h-3.5 w-3.5" strokeWidth={2.5} />
            Current group favorite
          </span>
        )}
        <h2 className="text-2xl font-semibold">{destination.name}</h2>
        <p className="mt-1 max-w-lg text-sm text-white/85">{destination.description}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <span className="inline-flex items-center gap-1.5">
            {destination.travel.mode === "flight" ? <Plane className="h-4 w-4" /> : <Car className="h-4 w-4" />}
            {destination.travel.duration}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" />${budgetTotal(destination.budget)} / person
          </span>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        {destination.itinerary.map((d) => (
          <button
            key={d.day}
            onClick={() => setActiveDay(d.day)}
            className={`flex-1 rounded-xl border px-4 py-3 text-left transition-colors ${
              d.day === activeDay ? "border-teal-300 bg-teal-50" : "border-stone-200 bg-white hover:bg-stone-50"
            }`}
          >
            <p className={`text-sm font-semibold ${d.day === activeDay ? "text-teal-800" : "text-stone-800"}`}>{d.day}</p>
            <p className="text-xs text-stone-500">{d.date}</p>
          </button>
        ))}
      </div>

      <ol className="mt-6 flex flex-col">
        {day.items.map((item, idx) => {
          const ItemIcon = getIcon(item.icon)
          const isLast = idx === day.items.length - 1
          return (
            <li key={`${item.time}-${item.title}`} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 ring-4 ring-white">
                  <ItemIcon className="h-5 w-5" strokeWidth={2.25} />
                </span>
                {!isLast && <span className="mt-1 w-px flex-1 bg-stone-200" />}
              </div>
              <div className="flex-1 pb-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">{item.time}</p>
                <p className="mt-0.5 text-sm font-semibold text-stone-900">{item.title}</p>
                <p className="mt-0.5 text-sm leading-6 text-stone-600">{item.description}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
