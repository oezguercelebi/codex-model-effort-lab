import { useMemo, useState } from "react"
import {
  Backpack,
  Camera,
  Check,
  Coffee,
  Copy,
  Crown,
  Info,
  MoonStar,
  Navigation,
  Plus,
  TreePine,
  Users,
  Utensils,
  Wallet,
} from "lucide-react"
import { FRIENDS, PACKING_LIST, TRIP } from "../data"
import type { Destination, ItemCategory, PackingState, Standing } from "../types"
import { bestTravel, budgetTotal, cx, duration, euro, tripCountdown } from "../utils"
import { DestinationArt } from "../components/Art"
import { BudgetLegend, BudgetStack, TravelIcon, TRAVEL_LABELS } from "../components/ui"

const CATEGORY_ICONS: Record<ItemCategory, typeof Camera> = {
  travel: Navigation,
  food: Utensils,
  sight: Camera,
  outdoors: TreePine,
  nightlife: MoonStar,
  chill: Coffee,
}

export function PlanView({
  leader,
  leaders,
  packing,
  onPackingChange,
  onNotify,
}: {
  leader: Standing | null
  leaders: Standing[]
  packing: PackingState
  onPackingChange: (next: PackingState) => void
  onNotify: (msg: string) => void
}) {
  if (!leader) return null
  const d = leader.destination
  const tied = leaders.length > 1
  const travel = bestTravel(d)

  const copyPlan = async () => {
    const text = buildPlanText(d)
    try {
      await navigator.clipboard.writeText(text)
      onNotify("Plan copied — paste it in the group chat")
    } catch {
      onNotify("Couldn't copy on this device")
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-8 sm:px-6">
      <section className="pt-6 sm:pt-10">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          The plan
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-500 sm:text-base">
          Built around the destination currently winning the vote. It updates live if the
          standings change.
        </p>
      </section>

      {/* Winner banner */}
      <section className="relative mt-6 overflow-hidden rounded-3xl border border-stone-200 shadow-sm">
        <DestinationArt art={d.art} className="h-44 w-full sm:h-56" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-amber-700 backdrop-blur">
            <Crown className="size-3.5" />
            {tied ? "Tied for the lead" : "Winning so far"}
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                {d.name}
                <span className="ml-2 text-base font-normal text-white/70">{d.country}</span>
              </h2>
              <p className="mt-1 text-sm text-white/85">
                {TRIP.dates} · {tripCountdown()} · {leader.count} of {FRIENDS.length} votes
              </p>
            </div>
            <button
              type="button"
              onClick={copyPlan}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-stone-900 shadow-sm backdrop-blur transition hover:bg-white"
            >
              <Copy className="size-3.5" />
              Copy plan
            </button>
          </div>
        </div>
      </section>

      {tied && (
        <p className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <Info className="mt-0.5 size-4 shrink-0" />
          The vote is tied, so this is {d.name}'s draft plan for now. Break the tie in the Votes
          tab before {TRIP.votingDeadline}.
        </p>
      )}

      {/* Key facts */}
      <section className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <FactCard
          icon={<TravelIcon mode={travel.mode} className="size-4" />}
          title={`${TRAVEL_LABELS[travel.mode]} · ${duration(travel.durationMin)}`}
          sub={travel.note}
        />
        <FactCard
          icon={<Wallet className="size-4" />}
          title={`${euro(budgetTotal(d.budget))} per person`}
          sub="incl. travel, stay & fun"
        />
        <FactCard
          icon={<Users className="size-4" />}
          title="6 friends, one flat"
          sub={d.stay}
          className="col-span-2 sm:col-span-1"
        />
      </section>

      {/* Timeline */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight text-stone-900">
          The weekend, hour by hour
        </h2>
        <div className="mt-4 space-y-6">
          {d.itinerary.map((day) => {
            const subtotal = day.items.reduce((sum, it) => sum + it.cost, 0)
            return (
              <div key={day.label}>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-400">
                    {day.label} <span className="font-normal">· {day.date}</span>
                  </h3>
                  <span className="text-xs font-medium tabular-nums text-stone-400">
                    ≈ {euro(subtotal)} pp
                  </span>
                </div>
                <ol className="mt-3 space-y-0">
                  {day.items.map((item, i) => {
                    const Icon = CATEGORY_ICONS[item.category]
                    const last = i === day.items.length - 1
                    return (
                      <li key={item.time + item.title} className="relative flex gap-4 pb-4">
                        {!last && (
                          <span
                            aria-hidden="true"
                            className="absolute left-[17px] top-9 h-[calc(100%-36px)] w-px bg-stone-200"
                          />
                        )}
                        <span className="z-[1] flex size-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0 flex-1 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
                          <div className="flex items-baseline justify-between gap-3">
                            <p className="text-sm font-semibold text-stone-900">{item.title}</p>
                            <p className="shrink-0 text-xs font-medium tabular-nums text-stone-400">
                              {item.time}
                            </p>
                          </div>
                          <div className="mt-0.5 flex items-baseline justify-between gap-3">
                            <p className="text-xs leading-5 text-stone-500">{item.note}</p>
                            <p className="shrink-0 text-xs font-semibold tabular-nums text-stone-600">
                              {item.cost > 0 ? euro(item.cost) : "Free"}
                            </p>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </div>
            )
          })}
        </div>
      </section>

      {/* Budget recap */}
      <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-stone-900">
            What the weekend costs
          </h2>
          <span className="text-lg font-semibold tabular-nums tracking-tight text-stone-900">
            {euro(budgetTotal(d.budget))} <span className="text-xs font-medium text-stone-400">pp</span>
          </span>
        </div>
        <BudgetStack budget={d.budget} className="mt-3" />
        <div className="mt-3">
          <BudgetLegend budget={d.budget} />
        </div>
        <p className="mt-3 border-t border-stone-100 pt-3 text-xs leading-5 text-stone-400">
          Estimates per person for {TRIP.nights} nights, split six ways where it helps. Day-by-day
          amounts above are the food & activity part.
        </p>
      </section>

      <PackingCard packing={packing} onChange={onPackingChange} />
    </div>
  )
}

function FactCard({
  icon,
  title,
  sub,
  className,
}: {
  icon: React.ReactNode
  title: string
  sub: string
  className?: string
}) {
  return (
    <div className={cx("rounded-2xl border border-stone-200 bg-white p-4 shadow-sm", className)}>
      <span className="flex size-8 items-center justify-center rounded-full bg-stone-100 text-stone-600">
        {icon}
      </span>
      <p className="mt-2.5 text-sm font-semibold text-stone-900">{title}</p>
      <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-stone-500">{sub}</p>
    </div>
  )
}

function PackingCard({
  packing,
  onChange,
}: {
  packing: PackingState
  onChange: (next: PackingState) => void
}) {
  const [draft, setDraft] = useState("")
  const items = useMemo(() => [...PACKING_LIST, ...packing.custom], [packing.custom])
  const packed = items.filter((i) => packing.checked.includes(i.id)).length

  const toggle = (id: string) => {
    const checked = packing.checked.includes(id)
      ? packing.checked.filter((c) => c !== id)
      : [...packing.checked, id]
    onChange({ ...packing, checked })
  }

  const addItem = () => {
    const label = draft.trim()
    if (!label) return
    const id = `c-${label.toLowerCase().replace(/\W+/g, "-")}-${packing.custom.length}`
    onChange({ ...packing, custom: [...packing.custom, { id, label }] })
    setDraft("")
  }

  return (
    <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-stone-900">
          <Backpack className="size-5 text-stone-500" />
          Packing list
        </h2>
        <span className="text-xs font-medium tabular-nums text-stone-500">
          {packed} of {items.length} packed
        </span>
      </div>
      <div
        role="meter"
        aria-valuenow={packed}
        aria-valuemin={0}
        aria-valuemax={items.length}
        aria-label={`${packed} of ${items.length} items packed`}
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-orange-100"
      >
        <div
          className="h-full rounded-r-[4px] bg-orange-600 transition-all duration-500"
          style={{ width: `${items.length === 0 ? 0 : (packed / items.length) * 100}%` }}
        />
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {items.map((item) => {
          const checked = packing.checked.includes(item.id)
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-pressed={checked}
                className="group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition hover:bg-stone-50"
              >
                <span
                  aria-hidden="true"
                  className={cx(
                    "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                    checked
                      ? "border-orange-600 bg-orange-600 text-white"
                      : "border-stone-300 bg-white group-hover:border-stone-400",
                  )}
                >
                  {checked && <Check className="size-3.5" strokeWidth={3} />}
                </span>
                <span
                  className={cx(
                    "text-sm transition-colors",
                    checked ? "text-stone-400 line-through" : "text-stone-700",
                  )}
                >
                  {item.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <form
        className="mt-3 flex gap-2 border-t border-stone-100 pt-3"
        onSubmit={(e) => {
          e.preventDefault()
          addItem()
        }}
      >
        <label htmlFor="add-packing" className="sr-only">
          Add packing item
        </label>
        <input
          id="add-packing"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add something the group will forget…"
          className="h-9 flex-1 rounded-full border border-stone-200 bg-white px-3.5 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition focus:border-orange-400 focus-visible:ring-2 focus-visible:ring-orange-500/40"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="inline-flex h-9 items-center gap-1 rounded-full bg-stone-900 px-3.5 text-xs font-semibold text-white transition enabled:hover:bg-stone-700 disabled:opacity-40"
        >
          <Plus className="size-3.5" />
          Add
        </button>
      </form>
    </section>
  )
}

function buildPlanText(d: Destination): string {
  const travel = bestTravel(d)
  const lines: string[] = [
    `WEEKENDER · ${TRIP.name}`,
    `${d.name}, ${d.country} — ${TRIP.dates} · 6 friends from ${TRIP.origin}`,
    `Getting there: ${TRAVEL_LABELS[travel.mode]}, ${duration(travel.durationMin)} (${euro(travel.pricePerPerson)} pp)`,
    `Budget: ~${euro(budgetTotal(d.budget))} per person all-in`,
    `Stay: ${d.stay}`,
    "",
  ]
  for (const day of d.itinerary) {
    lines.push(`${day.label.toUpperCase()} · ${day.date}`)
    for (const item of day.items) {
      lines.push(
        `${item.time}  ${item.title}${item.cost > 0 ? ` (${euro(item.cost)})` : ""} — ${item.note}`,
      )
    }
    lines.push("")
  }
  lines.push("Made with Weekender")
  return lines.join("\n")
}
