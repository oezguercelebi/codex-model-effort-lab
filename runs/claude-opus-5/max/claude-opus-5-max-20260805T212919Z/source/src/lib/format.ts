export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

const eur = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})

const eurPrecise = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

export function money(value: number): string {
  return eur.format(Math.round(value))
}

export function moneyPrecise(value: number): string {
  return eurPrecise.format(value)
}

/** Decimal hours → "4h 20m", rounded to the nearest five minutes. */
export function duration(hours: number): string {
  const totalMinutes = Math.round((hours * 60) / 5) * 5
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function plural(count: number, one: string, many = `${one}s`): string {
  return `${count} ${count === 1 ? one : many}`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

const dayMonth = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" })
const weekdayDayMonth = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
})

export function formatDay(date: Date): string {
  return weekdayDayMonth.format(date)
}

export function formatRange(from: Date, to: Date): string {
  const sameMonth = from.getMonth() === to.getMonth()
  const left = sameMonth
    ? new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric" }).format(from)
    : weekdayDayMonth.format(from)
  return `${left} – ${weekdayDayMonth.format(to)}`
}

export function shortDate(date: Date): string {
  return dayMonth.format(date)
}

export interface TripDates {
  friday: Date
  saturday: Date
  sunday: Date
  thursday: Date
  deadline: Date
  daysToDeadline: number
}

/**
 * The demo always points at a real upcoming weekend so the dates never
 * look stale, whenever someone opens it.
 */
export function getTripDates(now: Date = new Date()): TripDates {
  const friday = new Date(now)
  friday.setHours(0, 0, 0, 0)
  friday.setDate(friday.getDate() + 17)
  friday.setDate(friday.getDate() + ((5 - friday.getDay() + 7) % 7))

  const dayAfter = (base: Date, offset: number) => {
    const next = new Date(base)
    next.setDate(next.getDate() + offset)
    return next
  }

  const deadline = new Date(now)
  deadline.setHours(23, 59, 0, 0)
  deadline.setDate(deadline.getDate() + 5)

  const msPerDay = 86_400_000
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const daysToDeadline = Math.max(
    0,
    Math.round((deadline.getTime() - today.getTime()) / msPerDay),
  )

  return {
    thursday: dayAfter(friday, -1),
    friday,
    saturday: dayAfter(friday, 1),
    sunday: dayAfter(friday, 2),
    deadline,
    daysToDeadline,
  }
}
