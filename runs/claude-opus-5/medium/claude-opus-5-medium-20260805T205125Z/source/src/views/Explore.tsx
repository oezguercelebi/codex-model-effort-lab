import { useState } from "react"
import { Search, SearchX, X } from "lucide-react"
import { VIBE_LABELS } from "../lib/data"
import { formatMoney } from "../lib/engine"
import { useStore, type SortKey } from "../lib/store"
import type { Vibe } from "../lib/types"
import { Button, Chip, EmptyState, Segmented, cx } from "../components/ui"
import { DestinationCard } from "../components/DestinationCard"
import { TripBar } from "../components/TripBar"
import { CompareModal, CompareTray } from "../components/Compare"
import { DestinationDetail } from "../components/DestinationDetail"

const TIME_FILTERS = [
  { value: 0, label: "Any" },
  { value: 3, label: "Under 3h" },
  { value: 5, label: "Under 5h" },
  { value: 8, label: "Under 8h" },
]

export function Explore() {
  const { visible, scored, filters, setFilters, resetFilters, settings, origin } = useStore()
  const [openId, setOpenId] = useState<string | null>(null)
  const [compareOpen, setCompareOpen] = useState(false)

  const active = visible.find((s) => s.destination.id === openId) ?? null
  const filtersDirty =
    filters.vibes.length > 0 || filters.maxHours > 0 || filters.hideOverBudget || filters.query !== ""

  const cheapest = scored.reduce((a, b) => (a.cost.total <= b.cost.total ? a : b))
  const closest = scored.reduce((a, b) => (a.travel.hours <= b.travel.hours ? a : b))

  const toggleVibe = (v: Vibe) =>
    setFilters({
      vibes: filters.vibes.includes(v) ? filters.vibes.filter((x) => x !== v) : [...filters.vibes, v],
    })

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-teal-900 p-6 text-white sm:p-8 dark:from-stone-800 dark:via-stone-900 dark:to-teal-950">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-white/60 uppercase">
          {settings.nights + 1}-day weekend · from {origin.city}
        </p>
        <h1 className="mt-2 max-w-xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
          Eight weekends worth arguing about.
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-white/70">
          Real costs, real travel times, and a vote that settles it. Change who's coming and where
          you're leaving from — everything below recalculates.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <HeroPill label="Cheapest" value={`${cheapest.destination.name} · ${formatMoney(cheapest.cost.total)}`} />
          <HeroPill label="Closest" value={`${closest.destination.name} · ${closest.travel.label}`} />
        </div>
      </section>

      <TripBar />

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-stone-400"
            />
            <input
              type="search"
              value={filters.query}
              onChange={(e) => setFilters({ query: e.target.value })}
              placeholder="Search destinations, countries, vibes…"
              aria-label="Search destinations"
              className="w-full rounded-full border border-stone-300 bg-white py-2.5 pr-4 pl-10 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none dark:border-white/15 dark:bg-stone-900 dark:text-white"
            />
          </div>
          <div className="shrink-0 sm:w-72">
            <Segmented<SortKey>
              label="Sort destinations"
              value={filters.sort}
              onChange={(sort) => setFilters({ sort })}
              options={[
                { id: "consensus", label: "Top voted" },
                { id: "price", label: "Cheapest" },
                { id: "time", label: "Closest" },
                { id: "name", label: "A–Z" },
              ]}
            />
          </div>
        </div>

        <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {(Object.keys(VIBE_LABELS) as Vibe[]).map((v) => (
            <Chip key={v} active={filters.vibes.includes(v)} onClick={() => toggleVibe(v)}>
              {VIBE_LABELS[v]}
            </Chip>
          ))}
          <span className="mx-1 hidden w-px shrink-0 self-stretch bg-stone-200 sm:block dark:bg-white/10" />
          {TIME_FILTERS.map((t) => (
            <Chip
              key={t.value}
              active={filters.maxHours === t.value}
              onClick={() => setFilters({ maxHours: t.value })}
            >
              {t.label}
            </Chip>
          ))}
          <Chip
            active={filters.hideOverBudget}
            onClick={() => setFilters({ hideOverBudget: !filters.hideOverBudget })}
            title={`Hide anything over ${formatMoney(settings.budgetCap)} per person`}
          >
            Within budget
          </Chip>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-stone-500 dark:text-stone-400">
            <strong className="font-semibold text-stone-900 dark:text-white">{visible.length}</strong>{" "}
            of {scored.length} destinations
          </span>
          {filtersDirty ? (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 rounded-full bg-stone-200/70 px-2.5 py-1 text-xs font-medium text-stone-700 hover:bg-stone-300/70 dark:bg-white/10 dark:text-stone-300 dark:hover:bg-white/20"
            >
              <X size={11} /> Clear filters
            </button>
          ) : null}
        </div>
      </div>

      <div
        className={cx(
          "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
          visible.length === 0 && "grid-cols-1",
        )}
      >
        {visible.map((item, i) => (
          <DestinationCard
            key={item.destination.id}
            item={item}
            index={i}
            onOpen={() => setOpenId(item.destination.id)}
          />
        ))}
        {visible.length === 0 ? (
          <EmptyState
            icon={<SearchX size={20} />}
            title="Nothing matches all of that"
            body="Every destination got filtered out. Loosen the travel time or budget and try again."
            action={
              <Button variant="primary" onClick={resetFilters}>
                Reset filters
              </Button>
            }
          />
        ) : null}
      </div>

      <CompareTray onOpen={() => setCompareOpen(true)} />
      <CompareModal open={compareOpen} onClose={() => setCompareOpen(false)} />
      <DestinationDetail item={active} onClose={() => setOpenId(null)} />
      <p className="pb-2 text-center text-xs text-stone-400">
        Estimates are illustrative sample data, not live prices.
      </p>
    </div>
  )
}

function HeroPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs backdrop-blur">
      <span className="text-white/55">{label}:</span>{" "}
      <span className="font-medium text-white">{value}</span>
    </span>
  )
}
