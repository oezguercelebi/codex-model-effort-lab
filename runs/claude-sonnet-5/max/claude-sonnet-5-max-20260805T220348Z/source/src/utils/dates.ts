const DAY_MS = 24 * 60 * 60 * 1000

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function nextFridayOnOrAfter(date: Date): Date {
  const result = new Date(date)
  const day = result.getDay()
  const diff = (5 - day + 7) % 7
  result.setDate(result.getDate() + diff)
  result.setHours(0, 0, 0, 0)
  return result
}

export interface TripWeekend {
  start: Date
  end: Date
}

/** Always a Friday–Sunday that's 3–4 weeks out, so the trip reads as "coming up" whenever this runs. */
export function getTripWeekend(referenceDate: Date = new Date()): TripWeekend {
  const threshold = addDays(referenceDate, 21)
  const start = nextFridayOnOrAfter(threshold)
  const end = addDays(start, 2)
  return { start, end }
}

/** Three days out at 6pm, so voting always has a believable window left. */
export function getVotingDeadline(referenceDate: Date = new Date()): Date {
  const deadline = addDays(referenceDate, 3)
  deadline.setHours(18, 0, 0, 0)
  return deadline
}

export function formatDateRange(start: Date, end: Date): string {
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()
  const startLabel = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(start)
  if (sameMonth) {
    const endLabel = new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(end)
    return `${startLabel}–${endLabel}, ${end.getFullYear()}`
  }
  const endLabel = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(end)
  return `${startLabel} – ${endLabel}, ${end.getFullYear()}`
}

export function formatItineraryDate(start: Date, offset: number): string {
  const date = addDays(start, offset)
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric" }).format(date)
}
