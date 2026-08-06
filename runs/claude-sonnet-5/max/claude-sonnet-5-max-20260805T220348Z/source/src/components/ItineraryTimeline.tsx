import type { ItineraryCategory, ItineraryDay } from "../types"
import { formatItineraryDate } from "../utils/dates"
import { cn } from "../utils/format"

interface ItineraryTimelineProps {
  days: ItineraryDay[]
  tripStart: Date
}

const categoryStyles: Record<ItineraryCategory, string> = {
  travel: "bg-sky-100 text-sky-600",
  food: "bg-orange-100 text-orange-600",
  activity: "bg-violet-100 text-violet-600",
  lodging: "bg-emerald-100 text-emerald-600",
  downtime: "bg-amber-100 text-amber-600",
}

export function ItineraryTimeline({ days, tripStart }: ItineraryTimelineProps) {
  return (
    <div className="flex flex-col gap-8">
      {days.map((day) => (
        <div key={day.label}>
          <div className="mb-1 flex flex-wrap items-baseline gap-x-2">
            <h3 className="text-lg font-semibold text-stone-900">{day.label}</h3>
            <span className="text-sm text-stone-400">{formatItineraryDate(tripStart, day.dateOffset)}</span>
          </div>
          <p className="mb-4 text-sm text-stone-500">{day.summary}</p>
          <ol className="flex flex-col">
            {day.items.map((item, index) => {
              const isLast = index === day.items.length - 1
              const Icon = item.icon
              return (
                <li key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        categoryStyles[item.category],
                      )}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    {!isLast && <span className="w-px flex-1 bg-stone-200" aria-hidden="true" />}
                  </div>
                  <div className={cn("flex-1", !isLast && "pb-6")}>
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-stone-400">{item.time}</span>
                      <p className="text-sm font-semibold text-stone-900">{item.title}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-stone-600">{item.description}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      ))}
    </div>
  )
}
