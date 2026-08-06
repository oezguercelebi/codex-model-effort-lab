import { useState } from "react"
import { ArrowDownUp, Columns3, Compass, Funnel, SearchX, X } from "lucide-react"
import { DestinationCard, DestinationCardSkeleton } from "../components/DestinationCard"
import { FiltersPanel } from "../components/FiltersPanel"
import { Modal } from "../components/Modal"
import { Button, EmptyState } from "../components/ui"
import { VIBE_LABEL } from "../data/trip"
import { duration, money, plural } from "../lib/format"
import { useCastVote, useToggleCompare } from "../state/actions"
import { useTrip } from "../state/store"
import type { SortKey } from "../types"

const SORTS: { value: SortKey; label: string }[] = [
  { value: "match", label: "Best match" },
  { value: "votes", label: "Most votes" },
  { value: "price", label: "Cheapest" },
  { value: "travel", label: "Quickest to reach" },
  { value: "name", label: "A–Z" },
]

export function ExploreView({
  loading,
  onOpen,
  searchRef,
  onGoToCompare,
}: {
  loading: boolean
  onOpen: (destinationId: string) => void
  searchRef: React.RefObject<HTMLInputElement | null>
  onGoToCompare: () => void
}) {
  const { state, dispatch, visible, cards, leader } = useTrip()
  const castVote = useCastVote()
  const toggleCompare = useToggleCompare()
  const [sheetOpen, setSheetOpen] = useState(false)

  const hidden = cards.length - visible.length
  const activeChips = [
    ...state.vibes.map((vibe) => ({
      key: `vibe-${vibe}`,
      label: VIBE_LABEL[vibe],
      clear: () => dispatch({ type: "vibe", vibe }),
    })),
    ...(state.strictBudget && state.budgetCap !== 600
      ? [
          {
            key: "budget",
            label: `Under ${money(state.budgetCap)}`,
            clear: () => dispatch({ type: "budgetCap", value: 600 }),
          },
        ]
      : []),
    ...(state.strictTravel && state.maxTravelHours !== 8
      ? [
          {
            key: "travel",
            label: `Under ${duration(state.maxTravelHours)}`,
            clear: () => dispatch({ type: "maxTravelHours", value: 8 }),
          },
        ]
      : []),
    ...(state.search.trim()
      ? [
          {
            key: "search",
            label: `“${state.search.trim()}”`,
            clear: () => dispatch({ type: "search", value: "" }),
          },
        ]
      : []),
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[272px_minmax(0,1fr)] lg:gap-8">
      <aside className="hidden lg:block">
        <div className="wk-scroll sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-card border border-line bg-surface p-4 pr-3 shadow-soft">
          <FiltersPanel searchRef={searchRef} />
        </div>
      </aside>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-[22px]">
              {loading ? "Finding places…" : `${plural(visible.length, "place")} to choose from`}
            </h2>
            <p className="mt-0.5 text-[13px] text-ink-soft">
              {hidden > 0
                ? `${hidden} hidden by your filters`
                : "Everything on the board fits your filters"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              icon={Funnel}
              className="lg:hidden"
              onClick={() => setSheetOpen(true)}
            >
              Filters
              {activeChips.length ? (
                <span className="ml-0.5 grid size-5 place-items-center rounded-full bg-brand text-[10px] font-bold text-on-brand">
                  {activeChips.length}
                </span>
              ) : null}
            </Button>

            <div className="relative">
              <ArrowDownUp
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
                aria-hidden="true"
              />
              <select
                value={state.sort}
                onChange={(event) => dispatch({ type: "sort", value: event.target.value as SortKey })}
                aria-label="Sort destinations"
                className="h-10 appearance-none rounded-xl border border-line bg-surface pl-9 pr-8 text-[13px] font-semibold text-ink outline-none transition hover:border-line-strong focus:border-brand"
              >
                {SORTS.map((sort) => (
                  <option key={sort.value} value={sort.value}>
                    {sort.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-ink-faint">
                ▾
              </span>
            </div>
          </div>
        </div>

        {activeChips.length ? (
          <div className="mb-4 flex flex-wrap items-center gap-1.5">
            {activeChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.clear}
                className="flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand transition hover:bg-brand-line"
              >
                {chip.label}
                <X size={11} aria-hidden="true" />
              </button>
            ))}
            <button
              type="button"
              onClick={() => dispatch({ type: "resetFilters" })}
              className="px-1.5 text-[11px] font-semibold text-ink-faint underline underline-offset-2 transition hover:text-ink"
            >
              Clear all
            </button>
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <DestinationCardSkeleton key={index} />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Nothing matches all of that"
            body="Your filters rule out every destination. Loosen the budget, allow a longer journey, or drop a vibe or two."
            action={
              <Button variant="primary" onClick={() => dispatch({ type: "resetFilters" })}>
                Reset filters
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((card, index) => (
              <DestinationCard
                key={card.destination.id}
                card={card}
                index={index}
                onOpen={() => onOpen(card.destination.id)}
                onVote={(value) => castVote(card.destination, value)}
                onToggleCompare={() => toggleCompare(card.destination)}
                comparing={state.compare.includes(card.destination.id)}
                isLeader={leader?.destination.id === card.destination.id && !state.lockedId}
                isLocked={state.lockedId === card.destination.id}
              />
            ))}
          </div>
        )}

        {!loading && visible.length > 0 ? (
          <p className="mt-6 flex items-center justify-center gap-2 text-center text-[12px] text-ink-faint">
            <Compass size={13} aria-hidden="true" />
            Prices are per person for {plural(state.nights, "night")}, everything included.
          </p>
        ) : null}
      </div>

      {/* Compare tray -------------------------------------------------- */}
      {state.compare.length > 0 ? (
        <div className="wk-fade-up pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+4.75rem)] md:pb-6">
          <div className="pointer-events-auto flex w-full max-w-lg items-center gap-3 rounded-2xl border border-line bg-surface p-2 pl-3.5 shadow-lift">
            <Columns3 size={16} className="shrink-0 text-brand" aria-hidden="true" />
            <p className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink">
              {state.compare
                .map((id) => cards.find((card) => card.destination.id === id)?.destination.name)
                .filter(Boolean)
                .join(" · ")}
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => dispatch({ type: "setCompare", ids: [] })}
            >
              Clear
            </Button>
            <Button size="sm" variant="primary" onClick={onGoToCompare}>
              Compare
            </Button>
          </div>
        </div>
      ) : null}

      <Modal
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Filters"
        size="md"
        footer={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => dispatch({ type: "resetFilters" })}
            >
              Reset
            </Button>
            <Button variant="primary" className="flex-1" onClick={() => setSheetOpen(false)}>
              Show {plural(visible.length, "place")}
            </Button>
          </div>
        }
      >
        <div className="p-4">
          <h2 className="mb-4 text-lg font-bold tracking-tight text-ink">Trip setup &amp; filters</h2>
          <FiltersPanel />
        </div>
      </Modal>
    </div>
  )
}
