import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
import { DESTINATIONS, FRIENDS, TRIP, YOU_ID } from "./data"
import type { BudgetBreakdown, Destination, Friend, Standing, TravelOption } from "./types"

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

export function euro(amount: number): string {
  return `€${Math.round(amount).toLocaleString("en-IE")}`
}

export function duration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} h`
  return `${h} h ${String(m).padStart(2, "0")}`
}

export function budgetTotal(b: BudgetBreakdown): number {
  return b.travel + b.stay + b.food + b.activities
}

export function bestTravel(d: Destination): TravelOption {
  return d.travel.reduce((a, b) => (b.durationMin < a.durationMin ? b : a))
}

export function cheapestTravel(d: Destination): TravelOption {
  return d.travel.reduce((a, b) => (b.pricePerPerson < a.pricePerPerson ? b : a))
}

export function budgetFitCount(d: Destination): number {
  const total = budgetTotal(d.budget)
  return FRIENDS.filter((f) => f.maxBudget >= total).length
}

export function daysUntil(date: Date): number {
  const now = new Date()
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const b = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

/** All ballots, with your live votes merged in. */
export function withYourVotes(yourVotes: string[]): Friend[] {
  return FRIENDS.map((f) => (f.id === YOU_ID ? { ...f, votes: yourVotes } : f))
}

/** Vote standings, sorted by count (ties keep data order). */
export function computeStandings(yourVotes: string[]): Standing[] {
  const ballots = withYourVotes(yourVotes)
  const standings = DESTINATIONS.map((destination) => {
    const voters = ballots.filter((f) => f.votes.includes(destination.id))
    return { destination, voters, count: voters.length }
  })
  return standings.sort((a, b) => b.count - a.count)
}

export function leadersOf(standings: Standing[]): Standing[] {
  const top = standings[0]?.count ?? 0
  if (top === 0) return []
  return standings.filter((s) => s.count === top)
}

export const CATEGORY_SLOTS = {
  // Validated categorical palette, slots 1–4 (light mode).
  travel: { label: "Getting there", color: "#2a78d6" },
  stay: { label: "Stay · 2 nights", color: "#eb6834" },
  food: { label: "Food & drinks", color: "#1baf7a" },
  activities: { label: "Activities", color: "#eda100" },
} as const

export type BudgetKey = keyof typeof CATEGORY_SLOTS

export const BUDGET_KEYS: BudgetKey[] = ["travel", "stay", "food", "activities"]

export function useStoredState<T>(
  key: string,
  initial: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Private mode etc. — the app still works, it just won't persist.
    }
  }, [key, value])
  return [value, setValue]
}

export function tripCountdown(): string {
  const days = daysUntil(TRIP.startDate)
  if (days > 1) return `${days} days to go`
  if (days === 1) return "Tomorrow!"
  if (days === 0) return "It's trip day"
  return "Trip memories"
}

export function votingCountdown(): string {
  const days = daysUntil(TRIP.votingDeadlineDate)
  if (days > 1) return `Voting closes in ${days} days`
  if (days === 1) return "Voting closes tomorrow"
  if (days === 0) return "Voting closes today"
  return "Voting closed"
}
