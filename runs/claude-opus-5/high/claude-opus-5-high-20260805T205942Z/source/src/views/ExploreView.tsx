import { useState } from "react"
import { Bookmark, Compass, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react"
import { DestinationCard, DestinationCardSkeleton } from "../components/DestinationCard"
import { VIBE_ICON } from "../components/shared"
import { Button, Chip, EmptyState, RangeField, SectionHeading, Segmented, Sheet, Switch, cx } from "../components/ui"
import { VIBES } from "../data/destinations"
import { duration, money, plural } from "../lib/format"
import {
  BUDGET_BOUNDS,
  HOURS_BOUNDS,
  SORT_LABELS,
  useDerivedTrip,
  useTrip,
  type SortKey,
} from "../state/trip"

export function ExploreView({
  loading,
  onOpen,
}: {
  loading: boolean
  onOpen: (destinationId: string) => void
}) {
  const { state, dispatch } = useTrip()
  const { rows, ranked, weekend, crew, currentMember, filtersActive, rowById } = useDerivedTrip()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const voteRanks = new Map(
    ranked
      .filter((row) => row.tally.cast > 0)
      .map((row, index) => [row.destination.id, index] as const),
  )

  const shortlisted = state.shortlist
    .map((id) => rowById[id])
    .filter((row): row is NonNullable<typeof row> => Boolean(row))

  const activeFilterCount =
    state.vibes.length +
    (state.flightFreeOnly ? 1 : 0) +
    (state.hideOverBudget ? 1 : 0) +
    (state.maxHours < HOURS_BOUNDS.max ? 1 : 0)

  const overBudgetCount = rows.filter((row) => row.cost.total > state.budget).length

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search
              size={15}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-subtle"
            />
            <input
              type="search"
              value={state.query}
              onChange={(e) => dispatch({ type: "setQuery", value: e.target.value })}
              placeholder="Search destinations"
              aria-label="Search destinations"
              className="focus-ring h-10 w-full rounded-xl border border-line bg-surface pr-3 pl-9 text-sm text-ink placeholder:text-subtle"
            />
          </div>

          <Segmented<SortKey>
            label="Sort destinations"
            className="hidden sm:inline-flex"
            value={state.sort}
            onChange={(value) => dispatch({ type: "setSort", value })}
            options={(Object.keys(SORT_LABELS) as SortKey[]).map((key) => ({
              value: key,
              label: SORT_LABELS[key],
            }))}
          />

          <Button
            icon={<SlidersHorizontal size={15} />}
            onClick={() => setFiltersOpen(true)}
            className="ml-auto"
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="tnum ml-0.5 grid size-5 place-items-center rounded-full bg-brand text-[11px] font-bold text-onbrand">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
          <Segmented<SortKey>
            label="Sort destinations"
            size="sm"
            className="sm:hidden"
            value={state.sort}
            onChange={(value) => dispatch({ type: "setSort", value })}
            options={(Object.keys(SORT_LABELS) as SortKey[]).map((key) => ({
              value: key,
              label: SORT_LABELS[key],
            }))}
          />
          {VIBES.map((vibe) => {
            const Icon = VIBE_ICON[vibe.id]
            return (
              <Chip
                key={vibe.id}
                title={vibe.hint}
                active={state.vibes.includes(vibe.id)}
                onClick={() => dispatch({ type: "toggleVibe", vibe: vibe.id })}
              >
                <Icon size={13} />
                {vibe.label}
              </Chip>
            )
          })}
          {filtersActive && (
            <Chip onClick={() => dispatch({ type: "clearFilters" })} className="text-brand-ink">
              <X size={13} />
              Clear
            </Chip>
          )}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[13px] text-muted">
          {loading ? (
            "Loading destinations…"
          ) : (
            <>
              <span className="font-semibold text-ink">{plural(rows.length, "trip")}</span> for{" "}
              {plural(crew.length, "person", "people")} · {weekend.range}
            </>
          )}
        </p>
        {!loading && rows.length > 0 && (
          <p className="hidden text-[12.5px] text-subtle sm:block">
            From {money(Math.min(...rows.map((r) => r.cost.total)))} per person
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <DestinationCardSkeleton key={i} />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<Compass size={22} />}
          title="Nothing fits those limits"
          body="No destination matches this combination of vibes, travel time and budget for the weekend you picked. Loosen one of them to see options again."
          action={
            <Button
              variant="primary"
              icon={<RotateCcw size={15} />}
              onClick={() => dispatch({ type: "clearFilters" })}
            >
              Reset filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((row) => (
            <DestinationCard
              key={row.destination.id}
              row={row}
              voteRank={voteRanks.get(row.destination.id)}
              weekend={weekend}
              budget={state.budget}
              currentMember={currentMember}
              onOpen={() => onOpen(row.destination.id)}
            />
          ))}
        </div>
      )}

      {!loading && shortlisted.length > 0 && (
        <section className="pt-2">
          <SectionHeading
            title="Your shortlist"
            hint="Saved by you — only you see this list"
            action={
              <Button
                size="sm"
                variant="quiet"
                onClick={() =>
                  shortlisted.forEach((row) =>
                    dispatch({ type: "toggleShortlist", destinationId: row.destination.id }),
                  )
                }
              >
                Clear
              </Button>
            }
          />
          <ul className="flex flex-wrap gap-2">
            {shortlisted.map((row) => (
              <li key={row.destination.id}>
                <button
                  type="button"
                  onClick={() => onOpen(row.destination.id)}
                  className={cx(
                    "focus-ring flex items-center gap-2 rounded-full border border-line bg-surface py-1.5 pr-3.5 pl-2.5 text-[13px] transition hover:border-line-strong",
                  )}
                >
                  <Bookmark size={13} className="text-brand" fill="currentColor" />
                  <span className="font-medium text-ink">{row.destination.name}</span>
                  <span className="tnum text-subtle">{money(row.cost.total)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Sheet open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        <div className="space-y-6 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-ink">Narrow it down</h2>
            <p className="mt-1 text-[13px] text-muted">
              Everything updates live across the whole app.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-line p-4">
            <RangeField
              label="Budget per person"
              value={state.budget}
              min={BUDGET_BOUNDS.min}
              max={BUDGET_BOUNDS.max}
              step={BUDGET_BOUNDS.step}
              onChange={(value) => dispatch({ type: "setBudget", value })}
              display={money(state.budget)}
              hint="Travel, bed, food and doing things — the whole weekend."
            />
            <div className="border-t border-line pt-4">
              <Switch
                checked={state.hideOverBudget}
                onChange={(value) => dispatch({ type: "setHideOverBudget", value })}
                label="Hide trips over budget"
                hint={
                  overBudgetCount > 0 && !state.hideOverBudget
                    ? `${overBudgetCount} of the trips shown are above ${money(state.budget)}`
                    : "Otherwise they stay visible with the overspend flagged."
                }
              />
            </div>
          </div>

          <RangeField
            label="Longest journey each way"
            value={state.maxHours}
            min={HOURS_BOUNDS.min}
            max={HOURS_BOUNDS.max}
            step={HOURS_BOUNDS.step}
            onChange={(value) => dispatch({ type: "setMaxHours", value })}
            display={
              state.maxHours >= HOURS_BOUNDS.max ? "No limit" : `under ${duration(state.maxHours)}`
            }
            hint="Measured door to door on the fastest sensible option."
          />

          <div className="rounded-2xl border border-line p-4">
            <Switch
              checked={state.flightFreeOnly}
              onChange={(value) => dispatch({ type: "setFlightFree", value })}
              label="Flight-free options only"
              hint="Hide anywhere you can only reasonably reach by plane."
            />
          </div>

          <div>
            <p className="mb-2.5 text-[13px] font-medium text-muted">Must have</p>
            <div className="flex flex-wrap gap-2">
              {VIBES.map((vibe) => {
                const Icon = VIBE_ICON[vibe.id]
                return (
                  <Chip
                    key={vibe.id}
                    title={vibe.hint}
                    active={state.vibes.includes(vibe.id)}
                    onClick={() => dispatch({ type: "toggleVibe", vibe: vibe.id })}
                  >
                    <Icon size={13} />
                    {vibe.label}
                  </Chip>
                )
              })}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex gap-2 border-t border-line bg-surface/95 p-4 backdrop-blur sm:px-6">
          <Button onClick={() => dispatch({ type: "clearFilters" })}>Reset</Button>
          <Button variant="primary" full onClick={() => setFiltersOpen(false)}>
            Show {plural(rows.length, "trip")}
          </Button>
        </div>
      </Sheet>
    </div>
  )
}
