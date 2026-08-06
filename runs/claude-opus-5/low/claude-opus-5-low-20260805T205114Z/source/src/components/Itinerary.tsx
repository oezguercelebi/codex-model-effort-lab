import { Bed, MapPin, Route, UtensilsCrossed } from "lucide-react"
import { useState } from "react"
import { cx, formatMoney } from "../lib"
import type { Destination, ItineraryItem } from "../types"

const TAG_META: Record<
  ItineraryItem["tag"],
  { icon: typeof MapPin; className: string; label: string }
> = {
  food: { icon: UtensilsCrossed, className: "bg-rose-100 text-rose-700", label: "Food" },
  activity: { icon: MapPin, className: "bg-sky-100 text-sky-700", label: "Do" },
  travel: { icon: Route, className: "bg-violet-100 text-violet-700", label: "Move" },
  rest: { icon: Bed, className: "bg-stone-200 text-stone-700", label: "Stay" },
}

export function Itinerary({ destination }: { destination: Destination }) {
  const [activeDay, setActiveDay] = useState(0)
  const day = destination.itinerary[activeDay]
  const dayTotal = day.items.reduce((sum, item) => sum + item.cost, 0)

  return (
    <div>
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        role="tablist"
        aria-label="Itinerary days"
      >
        {destination.itinerary.map((d, index) => {
          const total = d.items.reduce((sum, item) => sum + item.cost, 0)
          const active = index === activeDay
          return (
            <button
              key={d.label}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveDay(index)}
              className={cx(
                "flex-1 rounded-2xl border px-4 py-3 text-left transition-colors",
                active
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50",
              )}
            >
              <p className="text-sm font-semibold">{d.label}</p>
              <p
                className={cx(
                  "text-xs",
                  active ? "text-stone-300" : "text-stone-500",
                )}
              >
                {d.date} · {formatMoney(total)}
              </p>
            </button>
          )
        })}
      </div>

      <p className="mt-5 text-sm leading-6 text-stone-600">{day.summary}</p>

      <ol className="mt-5 space-y-0">
        {day.items.map((item, index) => {
          const meta = TAG_META[item.tag]
          const Icon = meta.icon
          const last = index === day.items.length - 1
          return (
            <li key={`${item.time}-${item.title}`} className="flex gap-4">
              <div className="flex w-14 shrink-0 flex-col items-end pt-0.5">
                <span className="text-sm font-semibold text-stone-900 tabular-nums">
                  {item.time}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span
                  className={cx(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full",
                    meta.className,
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {!last ? <span className="w-px flex-1 bg-stone-200" /> : null}
              </div>
              <div className={cx("min-w-0 flex-1", last ? "pb-0" : "pb-6")}>
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-semibold text-stone-900">{item.title}</h4>
                  <span className="shrink-0 text-xs font-semibold text-stone-500 tabular-nums">
                    {item.cost > 0 ? formatMoney(item.cost) : "Free"}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 text-stone-600">{item.detail}</p>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3 text-sm">
        <span className="font-medium text-stone-600">
          {day.label} spend, per person
        </span>
        <span className="font-semibold text-stone-900">{formatMoney(dayTotal)}</span>
      </div>
    </div>
  )
}
