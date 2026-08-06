import type { BudgetBreakdown, Destination } from "../types"
import type { Plan } from "../lib/compute"
import { budgetFor, selectedTravel } from "../lib/compute"
import { currency, pluralize } from "../lib/format"
import { Eyebrow } from "./ui"

export const COST_SERIES = [
  { key: "travel", label: "Getting there", swatch: "bg-viz-1" },
  { key: "lodging", label: "The stay", swatch: "bg-viz-2" },
  { key: "food", label: "Food & drink", swatch: "bg-viz-3" },
  { key: "activities", label: "Doing things", swatch: "bg-viz-4" },
] as const

type CostKey = (typeof COST_SERIES)[number]["key"]

/**
 * Stacked magnitude bar: one row, four categorical segments in fixed slot order,
 * separated by a 2px surface gap. Every segment is also direct-labelled in the
 * legend below, so identity never rests on colour alone.
 */
export function CostStack({
  breakdown,
  height = "h-2.5",
}: {
  breakdown: BudgetBreakdown
  height?: string
}) {
  return (
    <div className={`flex w-full gap-[2px] overflow-hidden rounded-full ${height}`}>
      {COST_SERIES.map((s) => {
        const value = breakdown[s.key as CostKey]
        const pct = breakdown.total > 0 ? (value / breakdown.total) * 100 : 0
        if (pct <= 0) return null
        return (
          <div
            key={s.key}
            className={`${s.swatch} wk-bar h-full first:rounded-l-full last:rounded-r-full`}
            style={{ width: `${pct}%` }}
            title={`${s.label}: ${currency(value)}`}
          />
        )
      })}
    </div>
  )
}

export function BudgetPanel({
  destination,
  plan,
}: {
  destination: Destination
  plan: Plan
}) {
  const breakdown = budgetFor(destination, plan)
  const option = selectedTravel(destination, plan.travelChoices)
  const groupTotal = breakdown.total * plan.travelers
  const over = breakdown.total - plan.budgetCap

  const details: Record<CostKey, string> = {
    travel: `${option.label}, return`,
    lodging: `${destination.costs.lodgingLabel} · ${currency(
      destination.costs.lodgingPerNight,
    )}/night split ${plan.travelers} ways`,
    food: `${currency(destination.costs.foodPerPersonPerDay)} a day × ${plan.nights + 1} days`,
    activities: "Tickets, rentals and entries in the plan",
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Eyebrow>Per person</Eyebrow>
          <p className="font-display text-4xl leading-none tracking-tight text-ink">
            {currency(breakdown.total)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[13px] text-ink-3">
            {currency(groupTotal)} for {pluralize(plan.travelers, "person", "people")}
          </p>
          <p
            className={`text-[13px] font-medium ${over > 0 ? "text-clay" : "text-pine"}`}
          >
            {over > 0
              ? `${currency(over)} over the ${currency(plan.budgetCap)} cap`
              : `${currency(-over)} under the ${currency(plan.budgetCap)} cap`}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <CostStack breakdown={breakdown} />
      </div>

      <ul className="mt-4 divide-y divide-line">
        {COST_SERIES.map((s) => {
          const value = breakdown[s.key as CostKey]
          const pct = breakdown.total > 0 ? Math.round((value / breakdown.total) * 100) : 0
          return (
            <li key={s.key} className="flex items-start gap-3 py-2.5">
              <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-sm ${s.swatch}`} aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium text-ink">{s.label}</span>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-ink">
                    {currency(value)}
                    <span className="ml-1.5 text-[12px] font-normal text-ink-3">{pct}%</span>
                  </span>
                </span>
                <span className="mt-0.5 block text-[12.5px] leading-5 text-ink-3">
                  {details[s.key as CostKey]}
                </span>
              </span>
            </li>
          )
        })}
      </ul>

      {breakdown.overflowRooms > 0 ? (
        <p className="mt-3 rounded-xl bg-clay-tint px-3 py-2 text-[12.5px] leading-5 text-clay-2">
          The stay sleeps {destination.costs.lodgingSleeps}, so{" "}
          {pluralize(breakdown.overflowRooms, "extra room")} is included at $140 a night.
        </p>
      ) : null}
    </div>
  )
}
