import { Bed, Martini, MountainSnow, Plane, UtensilsCrossed } from "lucide-react"
import { formatMoney, weekdayOf } from "../lib/engine"
import type { ItineraryDay, ItineraryItem } from "../lib/types"
import { cx } from "./ui"

const KIND_META: Record<ItineraryItem["kind"], { icon: typeof Plane; tint: string }> = {
  travel: { icon: Plane, tint: "bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300" },
  food: {
    icon: UtensilsCrossed,
    tint: "bg-orange-100 text-orange-700 dark:bg-orange-400/15 dark:text-orange-300",
  },
  activity: {
    icon: MountainSnow,
    tint: "bg-teal-100 text-teal-700 dark:bg-teal-400/15 dark:text-teal-300",
  },
  nightlife: {
    icon: Martini,
    tint: "bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300",
  },
  rest: { icon: Bed, tint: "bg-stone-200 text-stone-700 dark:bg-white/10 dark:text-stone-300" },
}

export function dayCost(day: ItineraryDay): number {
  return day.items.reduce((sum, item) => sum + (item.cost ?? 0), 0)
}

/**
 * Sample itineraries are written for a Friday-to-Sunday weekend. A shorter trip
 * drops the middle day rather than the arrival or departure day.
 */
export function planDays(days: ItineraryDay[], nights: number): ItineraryDay[] {
  const wanted = nights + 1
  if (wanted >= days.length) return days
  if (wanted <= 1) return [days[0]]
  return [days[0], ...days.slice(-(wanted - 1))]
}

export function ItineraryTimeline({
  days,
  departure,
  compact = false,
}: {
  days: ItineraryDay[]
  departure?: string
  compact?: boolean
}) {
  return (
    <div className="space-y-7">
      {days.map((day, dayIndex) => (
        <section key={day.label}>
          <header className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <div>
              <h4 className="text-base font-semibold text-stone-900 dark:text-white">
                {departure ? weekdayOf(departure, dayIndex) || day.label : day.label}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">{day.subtitle}</p>
            </div>
            <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600 dark:bg-white/10 dark:text-stone-300">
              ≈ {formatMoney(dayCost(day))} on the day
            </span>
          </header>

          <ol className="relative space-y-0 border-l border-stone-200 pl-0 dark:border-white/10">
            {day.items.map((item) => {
              const meta = KIND_META[item.kind]
              const Icon = meta.icon
              return (
                <li key={`${day.label}-${item.time}-${item.title}`} className="relative flex gap-3 pb-4 pl-5 last:pb-0">
                  <span className="absolute top-1.5 -left-[9px] grid h-[18px] w-[18px] place-items-center rounded-full bg-white ring-4 ring-white dark:bg-stone-900 dark:ring-stone-900">
                    <span className={cx("grid h-[18px] w-[18px] place-items-center rounded-full", meta.tint)}>
                      <Icon size={10} />
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <time className="text-xs font-semibold tabular-nums text-stone-500 dark:text-stone-400">
                        {item.time}
                      </time>
                      <span className="text-sm font-semibold text-stone-900 dark:text-white">
                        {item.title}
                      </span>
                      {item.cost ? (
                        <span className="ml-auto text-xs font-medium text-stone-500 tabular-nums dark:text-stone-400">
                          {formatMoney(item.cost)}
                        </span>
                      ) : (
                        <span className="ml-auto text-xs font-medium text-teal-600 dark:text-teal-400">
                          free
                        </span>
                      )}
                    </div>
                    {compact ? null : (
                      <p className="mt-0.5 text-sm leading-6 text-stone-600 dark:text-stone-400">
                        {item.detail}
                      </p>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </section>
      ))}
    </div>
  )
}
