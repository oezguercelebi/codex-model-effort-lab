import { useMemo, useState } from "react"
import { ChevronDown, RotateCcw, Search, SlidersHorizontal, Trophy, X } from "lucide-react"
import { destinations } from "../data/destinations"
import { allVibes, crew, trip } from "../data/trip"
import {
  budgetFor,
  fitFor,
  passesFilters,
  sortDestinations,
  standings,
  tallyFor,
  tallyFraction,
} from "../lib/compute"
import { currency, minutesToShort, pluralize } from "../lib/format"
import type { SortKey, VoteValue } from "../types"
import { MAX_COMPARE, initialState, useTrip } from "../state/TripContext"
import { DestinationCard, DestinationCardSkeleton } from "../components/DestinationCard"
import { Avatar, Bar, Button, Chip, Eyebrow, EmptyState, Slider, VibeIcon } from "../components/ui"

const SORT_LABELS: { value: SortKey; label: string }[] = [
  { value: "fit", label: "Best fit for the crew" },
  { value: "votes-desc", label: "Most votes" },
  { value: "price-asc", label: "Cheapest first" },
  { value: "travel-asc", label: "Shortest trip" },
  { value: "name", label: "A to Z" },
]

export function ExploreView() {
  const { state, plan, set, dispatch, voteBook, openDestination, toast, setView, loading } = useTrip()
  const [filtersOpen, setFiltersOpen] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 640px)").matches,
  )

  const filters = useMemo(() => ({ vibes: state.vibes, search: state.search }), [state.vibes, state.search])

  const visible = useMemo(
    () =>
      sortDestinations(
        destinations.filter((d) => passesFilters(d, plan, filters)),
        state.sort,
        plan,
        voteBook,
      ),
    [plan, filters, state.sort, voteBook],
  )

  const board = useMemo(() => standings(destinations, plan, voteBook), [plan, voteBook])
  const leaderId = board.length > 0 && board[0].tally.score > 0 ? board[0].destination.id : null
  const hidden = destinations.length - visible.length
  const filtersActive =
    state.vibes.length > 0 ||
    state.search.trim().length > 0 ||
    state.budgetCap !== initialState.budgetCap ||
    state.maxTravelMinutes !== initialState.maxTravelMinutes

  const castVote = (id: string, name: string, v: VoteValue) => {
    const previous = state.votes
    dispatch({ type: "vote", id, value: v })
    toast(previous[id] === v ? `Vote cleared for ${name}` : `Vote saved for ${name}`, {
      tone: "success",
      action: { label: "Undo", run: () => set({ votes: previous }) },
    })
  }

  return (
    <div className="space-y-6">
      <Hero board={board} onGoVote={() => setView("vote")} />

      <section
        className="sticky top-[60px] z-20 rounded-2xl border border-line bg-card/90 p-3 backdrop-blur-md sm:top-[68px] sm:p-4"
        aria-label="Filters"
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
              strokeWidth={1.9}
              aria-hidden
            />
            <input
              type="search"
              value={state.search}
              onChange={(e) => set({ search: e.target.value })}
              placeholder="Search places or vibes"
              aria-label="Search destinations"
              className="h-10 w-full rounded-xl border border-line-2 bg-paper/60 pl-9 pr-3 text-sm text-ink placeholder:text-ink-3 focus:border-clay focus:bg-card focus:outline-none"
            />
          </div>
          <div className="relative">
            <select
              value={state.sort}
              onChange={(e) => set({ sort: e.target.value as SortKey })}
              aria-label="Sort destinations"
              className="h-10 appearance-none rounded-xl border border-line-2 bg-paper/60 pl-3 pr-9 text-sm font-medium text-ink focus:border-clay focus:bg-card focus:outline-none"
            >
              {SORT_LABELS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
              strokeWidth={1.9}
              aria-hidden
            />
          </div>
          <Button
            onClick={() => setFiltersOpen((v) => !v)}
            className="sm:hidden"
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.9} />
            {state.vibes.length > 0 ? state.vibes.length : "Filters"}
          </Button>
        </div>

        {filtersOpen ? (
          <div className="mt-3 space-y-3 border-t border-line pt-3">
            <div className="flex flex-wrap gap-1.5">
              {allVibes.map((v) => (
                <Chip
                  key={v}
                  selected={state.vibes.includes(v)}
                  onClick={() => dispatch({ type: "toggleVibe", vibe: v })}
                >
                  <VibeIcon vibe={v} />
                  {v}
                </Chip>
              ))}
            </div>
            <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              <Slider
                id="budget-cap"
                label="Budget per person"
                min={350}
                max={950}
                step={25}
                value={state.budgetCap}
                onChange={(budgetCap) => set({ budgetCap })}
                display={`up to ${currency(state.budgetCap)}`}
              />
              <Slider
                id="max-travel"
                label="Longest one-way trip"
                min={120}
                max={480}
                step={15}
                value={state.maxTravelMinutes}
                onChange={(maxTravelMinutes) => set({ maxTravelMinutes })}
                display={`under ${minutesToShort(state.maxTravelMinutes)}`}
              />
            </div>
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-[13px]">
          <p className="text-ink-2">
            <span className="font-semibold text-ink">{visible.length}</span> of {destinations.length}{" "}
            {visible.length === 1 ? "place" : "places"}
            {hidden > 0 ? <span className="text-ink-3"> · {hidden} hidden by your filters</span> : null}
          </p>
          {filtersActive ? (
            <button
              type="button"
              onClick={() => dispatch({ type: "resetFilters" })}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 font-medium text-clay transition-colors hover:bg-clay-tint"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
              Clear filters
            </button>
          ) : null}
        </div>
      </section>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <DestinationCardSkeleton key={i} />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<X className="h-5 w-5" strokeWidth={1.8} />}
          title="Nothing clears that bar"
          body={`No weekend comes in under ${currency(state.budgetCap)} a head within ${minutesToShort(
            state.maxTravelMinutes,
          )} of ${trip.originShort} with those vibes. Loosen something and they'll come back.`}
          action={
            <Button variant="primary" onClick={() => dispatch({ type: "resetFilters" })}>
              <RotateCcw className="h-4 w-4" strokeWidth={2} />
              Reset the filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((d, i) => (
            <DestinationCard
              key={d.id}
              index={i}
              destination={d}
              plan={plan}
              fit={fitFor(d, plan)}
              tally={tallyFor(d.id, voteBook)}
              vote={state.votes[d.id]}
              isCompared={state.compare.includes(d.id)}
              compareDisabled={state.compare.length >= MAX_COMPARE}
              isLeader={d.id === leaderId}
              onOpen={() => openDestination(d.id)}
              onVote={(v) => castVote(d.id, d.name, v)}
              onToggleCompare={() => {
                if (!state.compare.includes(d.id) && state.compare.length >= MAX_COMPARE) {
                  toast("Comparison holds three — drop one first")
                  return
                }
                dispatch({ type: "toggleCompare", id: d.id })
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function Hero({
  board,
  onGoVote,
}: {
  board: ReturnType<typeof standings>
  onGoVote: () => void
}) {
  const { plan, state } = useTrip()
  const top = board.slice(0, 3)
  const yourVotes = Object.keys(state.votes).length
  const cheapest = destinations.reduce((best, d) =>
    budgetFor(d, plan).total < budgetFor(best, plan).total ? d : best,
  )

  return (
    <section className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
      <div className="wk-rise relative overflow-hidden rounded-2xl border border-line bg-card p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-clay/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-pine/10 blur-3xl" />
        <div className="relative">
          <Eyebrow>
            {trip.weekendLabel} · {pluralize(destinations.length, "option")} · voting closes in{" "}
            {trip.votingClosesIn}
          </Eyebrow>
          <h1 className="mt-3 font-display text-[34px] leading-[1.08] tracking-tight text-ink sm:text-[44px]">
            Six people, one weekend,
            <br className="hidden sm:block" /> zero group-chat arguments.
          </h1>
          <p className="mt-3 max-w-lg text-[14.5px] leading-7 text-ink-2">
            Every option below is priced for your group, timed door to door from {trip.origin}, and
            scored against what each person said they wanted. Vote on what you like — the plan builds
            itself around whatever wins.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button variant="primary" size="lg" onClick={onGoVote}>
              {yourVotes === 0 ? "Cast your votes" : `Your ballot · ${yourVotes}/${destinations.length}`}
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {crew.map((m) => (
                  <Avatar key={m.id} member={m} size="sm" ring />
                ))}
              </div>
              <span className="text-[12.5px] text-ink-3">
                {crew.length} going · {currency(budgetFor(cheapest, plan).total)} the
                cheapest way
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="wk-rise rounded-2xl border border-line bg-card p-5" style={{ animationDelay: "80ms" }}>
        <div className="flex items-center justify-between gap-2">
          <Eyebrow>Where it stands</Eyebrow>
          <span className="inline-flex items-center gap-1 text-[12px] font-medium text-gold">
            <Trophy className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            live
          </span>
        </div>
        <ol className="mt-3.5 space-y-3.5">
          {top.map((row) => (
            <li key={row.destination.id}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate text-[13.5px] font-semibold text-ink">
                  {row.rank}. {row.destination.name}
                </span>
                <span className="shrink-0 text-[12.5px] tabular-nums text-ink-3">
                  {row.tally.score > 0 ? `+${row.tally.score}` : row.tally.score} pts
                </span>
              </div>
              <Bar fraction={tallyFraction(row.tally)} className="mt-1.5" height="h-1.5" />
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={onGoVote}
          className="mt-4 w-full rounded-xl bg-paper py-2.5 text-[13px] font-semibold text-ink transition-colors hover:bg-sand"
        >
          See the full board
        </button>
      </div>
    </section>
  )
}
