import { Compass } from "lucide-react"
import { useMemo } from "react"
import { TRIP_END, TRIP_NAME, TRIP_START } from "../data/votes"
import { friends } from "../data/friends"
import { AvatarStack } from "./Avatar"

function formatRange(startIso: string, endIso: string): string {
  const start = new Date(startIso + "T00:00:00")
  const end = new Date(endIso + "T00:00:00")
  const startStr = start.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  const endStr = end.toLocaleDateString("en-US", { day: "numeric", year: "numeric" })
  return `${startStr}–${endStr}`
}

function useCountdown(startIso: string): string {
  return useMemo(() => {
    const start = new Date(startIso + "T00:00:00")
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const days = Math.round((start.getTime() - now.getTime()) / 86_400_000)
    if (days > 1) return `${days} days to go`
    if (days === 1) return "Tomorrow!"
    if (days === 0) return "This is the weekend!"
    return "Trip complete"
  }, [startIso])
}

export function TripHeader() {
  const countdown = useCountdown(TRIP_START)

  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-sm">
            <Compass className="h-6 w-6" strokeWidth={2.25} />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-stone-950">Weekender</h1>
            <p className="text-sm text-stone-500">{TRIP_NAME} &middot; {formatRange(TRIP_START, TRIP_END)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:justify-end">
          <div className="flex items-center gap-2">
            <AvatarStack friends={friends} max={6} />
            <span className="hidden text-sm text-stone-500 sm:inline">{friends.length} going</span>
          </div>
          <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800 ring-1 ring-inset ring-amber-200">
            {countdown}
          </span>
        </div>
      </div>
    </header>
  )
}
