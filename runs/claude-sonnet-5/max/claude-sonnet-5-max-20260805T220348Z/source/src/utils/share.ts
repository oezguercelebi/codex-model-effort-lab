import type { Destination } from "../types"
import type { TripWeekend } from "./dates"
import { formatDateRange } from "./dates"
import { formatBudgetRange } from "./format"

export function buildShareText(destination: Destination, tripWeekend: TripWeekend): string {
  const lines = [
    `Weekender — ${destination.name}, ${destination.region}`,
    formatDateRange(tripWeekend.start, tripWeekend.end),
    `Budget: ${formatBudgetRange(destination.budget.low, destination.budget.high)} per person`,
    `Stay: ${destination.lodging.name} · ${destination.lodging.neighborhood}`,
    "",
    ...destination.itinerary.flatMap((day) => [
      `${day.label.toUpperCase()} — ${day.summary}`,
      ...day.items.map((item) => `  ${item.time}  ${item.title}`),
      "",
    ]),
  ]
  return lines.join("\n").trim()
}
