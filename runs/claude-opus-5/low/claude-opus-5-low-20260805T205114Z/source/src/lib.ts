import { DESTINATIONS, TRAVELERS } from "./data"
import type { Destination, Traveler, VoteValue, Votes } from "./types"

export const VOTE_POINTS: Record<VoteValue, number> = { yes: 2, maybe: 1, no: 0 }
export const MAX_SCORE = TRAVELERS.length * VOTE_POINTS.yes

export function totalPerPerson(d: Destination): number {
  const b = d.budget
  return b.lodging + b.food + b.activities + b.transport
}

export function formatMoney(n: number): string {
  return `€${Math.round(n).toLocaleString("en-GB")}`
}

export function formatHours(h: number): string {
  const hours = Math.floor(h)
  const minutes = Math.round((h - hours) * 60)
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`
}

export type Tally = {
  yes: number
  maybe: number
  no: number
  cast: number
  score: number
  /** 0-1 share of the maximum possible score */
  share: number
}

export function tallyFor(votes: Votes, destinationId: string): Tally {
  let yes = 0
  let maybe = 0
  let no = 0
  for (const traveler of TRAVELERS) {
    const v = votes[traveler.id]?.[destinationId]
    if (v === "yes") yes++
    else if (v === "maybe") maybe++
    else if (v === "no") no++
  }
  const score = yes * VOTE_POINTS.yes + maybe * VOTE_POINTS.maybe
  return { yes, maybe, no, cast: yes + maybe + no, score, share: score / MAX_SCORE }
}

export type Fit = {
  overBudgetFor: Traveler[]
  tooFarFor: Traveler[]
  lovedBy: Traveler[]
  worksForAll: boolean
}

export function fitFor(d: Destination): Fit {
  const total = totalPerPerson(d)
  const overBudgetFor = TRAVELERS.filter((t) => total > t.budgetMax)
  const tooFarFor = TRAVELERS.filter((t) => d.travelHours > t.maxTravelHours)
  const lovedBy = TRAVELERS.filter((t) => t.loves.some((v) => d.vibes.includes(v)))
  return {
    overBudgetFor,
    tooFarFor,
    lovedBy,
    worksForAll: overBudgetFor.length === 0 && tooFarFor.length === 0,
  }
}

export type Ranked = { destination: Destination; tally: Tally; rank: number }

export function rankDestinations(votes: Votes): Ranked[] {
  const rows = DESTINATIONS.map((destination) => ({
    destination,
    tally: tallyFor(votes, destination.id),
  })).sort((a, b) => {
    if (b.tally.score !== a.tally.score) return b.tally.score - a.tally.score
    if (b.tally.yes !== a.tally.yes) return b.tally.yes - a.tally.yes
    return totalPerPerson(a.destination) - totalPerPerson(b.destination)
  })

  let rank = 0
  let previousScore = Number.NaN
  return rows.map((row, index) => {
    if (row.tally.score !== previousScore) {
      rank = index + 1
      previousScore = row.tally.score
    }
    return { ...row, rank }
  })
}

export function votesCast(votes: Votes): number {
  return TRAVELERS.reduce(
    (sum, t) => sum + Object.keys(votes[t.id] ?? {}).length,
    0,
  )
}

export const TOTAL_POSSIBLE_VOTES = TRAVELERS.length * DESTINATIONS.length

/** A believable starting point so the app has something to show on first load. */
export const SEED_VOTES: Votes = {
  mira: { lisbon: "yes", krakow: "yes", copenhagen: "maybe", amalfi: "maybe" },
  jonas: { dolomites: "yes", cornwall: "yes", lisbon: "maybe", amalfi: "no" },
  ayla: { lisbon: "yes", copenhagen: "yes", krakow: "yes", dolomites: "no" },
  sam: { amalfi: "yes", cornwall: "yes", lisbon: "maybe" },
  noor: { lisbon: "yes", krakow: "maybe", copenhagen: "yes", cornwall: "maybe" },
}

export function cx(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(" ")
}
