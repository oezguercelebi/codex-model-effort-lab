import { CalendarDays, MapPinned, Tent } from "lucide-react"
import { TRIP } from "../data"
import { formatDaysUntil } from "../lib/format"

export function Header() {
  const daysLeft = formatDaysUntil(TRIP.voteDeadline)

  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-sm">
            <Tent className="size-6" strokeWidth={2.25} />
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight text-stone-900">Weekender</p>
            <p className="text-xs font-medium text-stone-500">{TRIP.groupName}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-stone-600">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="size-4 text-stone-400" />
            <span>{TRIP.dateRange}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPinned className="size-4 text-stone-400" />
            <span>From {TRIP.homeBase}</span>
          </div>
          {daysLeft > 0 ? (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              {daysLeft} {daysLeft === 1 ? "day" : "days"} left to vote
            </span>
          ) : (
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
              Voting closed
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
