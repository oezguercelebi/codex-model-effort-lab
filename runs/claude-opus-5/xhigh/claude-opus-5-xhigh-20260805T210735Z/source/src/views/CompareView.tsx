import { useMemo, type ReactNode } from "react"
import { Columns3, Plus, Sparkles, X } from "lucide-react"
import { destinations, destinationById } from "../data/destinations"
import { crew } from "../data/trip"
import {
  budgetFor,
  fitFor,
  selectedTravel,
  sortDestinations,
  tallyFor,
  tallyFraction,
} from "../lib/compute"
import { currency, minutesToLabel } from "../lib/format"
import type { Destination, VoteValue } from "../types"
import { MAX_COMPARE, useTrip } from "../state/TripContext"
import { CostStack } from "../components/BudgetPanel"
import { DestinationArt } from "../components/DestinationArt"
import { FitBadge } from "../components/DestinationCard"
import { Avatar, Bar, Button, EmptyState, Eyebrow, VoteButtons } from "../components/ui"

export function CompareView() {
  const { state, plan, set, dispatch, voteBook, openDestination, setView, toast } = useTrip()

  const picked = useMemo(
    () => state.compare.map((id) => destinationById.get(id)).filter((d): d is Destination => !!d),
    [state.compare],
  )

  const addTopThree = () => {
    const top = sortDestinations(destinations, "fit", plan, voteBook).slice(0, MAX_COMPARE)
    set({ compare: top.map((d) => d.id) })
    toast("Loaded the three best-fitting weekends", { tone: "success" })
  }

  if (picked.length === 0) {
    return (
      <div className="space-y-5">
        <Header count={0} />
        <EmptyState
          icon={<Columns3 className="h-5 w-5" strokeWidth={1.8} />}
          title="Nothing to compare yet"
          body="Pick up to three weekends from Explore and they'll line up here side by side — budget, travel time, weather and where the group stands on each."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="primary" onClick={addTopThree}>
                <Sparkles className="h-4 w-4" strokeWidth={1.9} />
                Compare the top three
              </Button>
              <Button onClick={() => setView("explore")}>Browse all eight</Button>
            </div>
          }
        />
      </div>
    )
  }

  const budgets = picked.map((d) => budgetFor(d, plan))
  const travels = picked.map((d) => selectedTravel(d, plan.travelChoices))
  const tallies = picked.map((d) => tallyFor(d.id, voteBook))
  const fits = picked.map((d) => fitFor(d, plan))

  const cheapestIndex = budgets.reduce((b, x, i) => (x.total < budgets[b].total ? i : b), 0)
  const fastestIndex = travels.reduce((b, x, i) => (x.minutes < travels[b].minutes ? i : b), 0)
  const favouriteIndex = tallies.reduce((b, x, i) => (x.score > tallies[b].score ? i : b), 0)
  const bestFitIndex = fits.reduce((b, x, i) => (x.score > fits[b].score ? i : b), 0)

  const spread =
    picked.length > 1
      ? Math.max(...budgets.map((b) => b.total)) - Math.min(...budgets.map((b) => b.total))
      : 0

  const columns = `minmax(132px,150px) repeat(${picked.length}, minmax(210px, 1fr))${
    picked.length < MAX_COMPARE ? " minmax(180px, 0.7fr)" : ""
  }`

  const castVote = (d: Destination, v: VoteValue) => {
    const previous = state.votes
    dispatch({ type: "vote", id: d.id, value: v })
    toast(previous[d.id] === v ? `Vote cleared for ${d.name}` : `Vote saved for ${d.name}`, {
      tone: "success",
      action: { label: "Undo", run: () => set({ votes: previous }) },
    })
  }

  return (
    <div className="space-y-5">
      <Header count={picked.length} />

      {picked.length > 1 ? (
        <p className="wk-fade rounded-2xl border border-line bg-card px-4 py-3 text-[13.5px] leading-6 text-ink-2">
          <span className="font-semibold text-ink">{currency(spread)} per person</span> separates the
          cheapest of these from the priciest — {currency(spread * plan.travelers)} across the group.
          The fastest is {picked[fastestIndex].name} at {minutesToLabel(travels[fastestIndex].minutes)}{" "}
          each way.
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-line bg-card">
        <div className="grid min-w-max" style={{ gridTemplateColumns: columns }}>
          {/* header row */}
          <div className="sticky left-0 z-10 border-b border-line bg-card px-4 py-4" />
          {picked.map((d) => (
            <div key={d.id} className="relative border-b border-line p-3">
              <button
                type="button"
                onClick={() => openDestination(d.id)}
                className="block w-full overflow-hidden rounded-xl text-left"
              >
                <DestinationArt destination={d} className="h-24 w-full" />
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: "toggleCompare", id: d.id })}
                aria-label={`Remove ${d.name} from comparison`}
                className="absolute right-5 top-5 grid h-7 w-7 place-items-center rounded-full bg-card/85 text-ink shadow-sm ring-1 ring-line backdrop-blur transition-colors hover:bg-card"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.2} />
              </button>
              <h3 className="mt-2.5 font-display text-xl leading-tight text-ink">{d.name}</h3>
              <p className="text-[12px] text-ink-3">{d.region}</p>
            </div>
          ))}
          {picked.length < MAX_COMPARE ? (
            <div className="border-b border-line p-3">
              <button
                type="button"
                onClick={() => setView("explore")}
                className="flex h-full min-h-[148px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line-2 text-ink-3 transition-colors hover:border-ink-3 hover:text-ink-2"
              >
                <Plus className="h-5 w-5" strokeWidth={1.8} />
                <span className="text-[12.5px] font-medium">Add another</span>
              </button>
            </div>
          ) : null}

          {/* fit */}
          <Label>Fit for the crew</Label>
          {picked.map((d, i) => (
            <Cell key={d.id}>
              <span className="inline-flex items-center">
                <FitBadge score={fits[i].score} />
                <BestPill show={i === bestFitIndex && picked.length > 1} label="best" />
              </span>
            </Cell>
          ))}
          {picked.length < MAX_COMPARE ? <Cell /> : null}

          {/* price */}
          <Label>Per person</Label>
          {picked.map((d, i) => (
            <Cell key={d.id}>
              <p className="font-display text-2xl leading-none text-ink">
                {currency(budgets[i].total)}
                <BestPill show={i === cheapestIndex && picked.length > 1} label="cheapest" />
              </p>
              <p className="mt-1 text-[12px] text-ink-3">
                {currency(budgets[i].total * plan.travelers)} for the group
              </p>
              <div className="mt-2.5">
                <CostStack breakdown={budgets[i]} height="h-2" />
              </div>
            </Cell>
          ))}
          {picked.length < MAX_COMPARE ? <Cell /> : null}

          {(
            [
              ["travel", "Getting there"],
              ["lodging", "The stay"],
              ["food", "Food & drink"],
              ["activities", "Doing things"],
            ] as const
          ).map(([key, label]) => (
            <Row key={key} label={label}>
              {picked.map((d, i) => (
                <Cell key={d.id}>
                  <span className="text-sm font-medium tabular-nums text-ink">
                    {currency(budgets[i][key])}
                  </span>
                </Cell>
              ))}
              {picked.length < MAX_COMPARE ? <Cell /> : null}
            </Row>
          ))}

          {/* travel time */}
          <Label>Door to door</Label>
          {picked.map((d, i) => (
            <Cell key={d.id}>
              <p className="text-sm font-medium text-ink">
                {minutesToLabel(travels[i].minutes)}
                <BestPill show={i === fastestIndex && picked.length > 1} label="fastest" />
              </p>
              <p className="mt-0.5 text-[12px] text-ink-3">{travels[i].label}</p>
            </Cell>
          ))}
          {picked.length < MAX_COMPARE ? <Cell /> : null}

          <Label>Late-September weather</Label>
          {picked.map((d) => (
            <Cell key={d.id}>
              <p className="text-sm font-medium text-ink">
                {d.weather.highF}° / {d.weather.lowF}°
              </p>
              <p className="mt-0.5 text-[12px] text-ink-3">{d.weather.label}</p>
            </Cell>
          ))}
          {picked.length < MAX_COMPARE ? <Cell /> : null}

          <Label>On foot</Label>
          {picked.map((d) => (
            <Cell key={d.id}>
              <p className="text-sm font-medium text-ink">{d.walkability}/100</p>
              <p className="mt-0.5 text-[12px] text-ink-3">
                {d.walkability >= 70 ? "No car needed" : "You'll be driving"}
              </p>
            </Cell>
          ))}
          {picked.length < MAX_COMPARE ? <Cell /> : null}

          <Label>Vibes</Label>
          {picked.map((d) => (
            <Cell key={d.id}>
              <div className="flex flex-wrap gap-1">
                {d.vibes.map((v) => (
                  <span
                    key={v}
                    className="rounded-full bg-sand px-2 py-0.5 text-[11.5px] font-medium text-ink-2"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </Cell>
          ))}
          {picked.length < MAX_COMPARE ? <Cell /> : null}

          <Label>Suits</Label>
          {picked.map((d, i) => (
            <Cell key={d.id}>
              <div className="flex flex-wrap items-center gap-1">
                {fits[i].matchedCrew.map((m) => (
                  <Avatar key={m.id} member={m} size="xs" />
                ))}
                <span className="ml-1 text-[12px] text-ink-3">
                  {fits[i].matchedCrew.length}/{crew.length}
                </span>
              </div>
            </Cell>
          ))}
          {picked.length < MAX_COMPARE ? <Cell /> : null}

          <Label>Where the crew stands</Label>
          {picked.map((d, i) => (
            <Cell key={d.id}>
              <p className="text-sm font-medium tabular-nums text-ink">
                {tallies[i].score > 0 ? `+${tallies[i].score}` : tallies[i].score} pts
                <BestPill show={i === favouriteIndex && picked.length > 1} label="ahead" />
              </p>
              <Bar fraction={tallyFraction(tallies[i])} className="mt-2" height="h-1.5" />
              <p className="mt-1.5 text-[12px] text-ink-3">
                {tallies[i].love} love · {tallies[i].yes} yes · {tallies[i].pass} pass
              </p>
            </Cell>
          ))}
          {picked.length < MAX_COMPARE ? <Cell /> : null}

          <Label>Watch out for</Label>
          {picked.map((d) => (
            <Cell key={d.id}>
              <p className="text-[12.5px] leading-5 text-ink-2">{d.headsUp}</p>
            </Cell>
          ))}
          {picked.length < MAX_COMPARE ? <Cell /> : null}

          <div className="sticky left-0 z-10 bg-card px-4 py-4" />
          {picked.map((d) => (
            <div key={d.id} className="flex flex-col items-start gap-2 px-4 py-4">
              <VoteButtons value={state.votes[d.id]} onVote={(v) => castVote(d, v)} size="sm" />
              <button
                type="button"
                onClick={() => openDestination(d.id)}
                className="rounded-lg text-[13px] font-semibold text-clay transition-colors hover:underline"
              >
                Open details
              </button>
            </div>
          ))}
          {picked.length < MAX_COMPARE ? <div className="px-4 py-4" /> : null}
        </div>
      </div>
    </div>
  )
}

function Cell({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return <div className={`border-b border-line px-4 py-3.5 ${className}`}>{children}</div>
}

function Label({ children }: { children: ReactNode }) {
  return (
    <div className="sticky left-0 z-10 border-b border-line bg-card px-4 py-3.5 text-[12.5px] font-medium text-ink-3">
      {children}
    </div>
  )
}

function BestPill({ show, label }: { show: boolean; label: string }) {
  if (!show) return null
  return (
    <span className="ml-2 inline-flex items-center rounded-full bg-pine-tint px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-pine">
      {label}
    </span>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <div className="sticky left-0 z-10 border-b border-line bg-card px-4 py-3.5 text-[12.5px] font-medium text-ink-3">
        {label}
      </div>
      {children}
    </>
  )
}

function Header({ count }: { count: number }) {
  const { dispatch } = useTrip()
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <Eyebrow>Side by side</Eyebrow>
        <h1 className="mt-1.5 font-display text-3xl tracking-tight text-ink sm:text-4xl">
          Compare the finalists
        </h1>
        <p className="mt-1.5 text-[14px] text-ink-2">
          {count === 0
            ? "Up to three at a time, on the numbers that actually decide it."
            : `${count} of ${MAX_COMPARE} slots used — everything recalculates with your group size.`}
        </p>
      </div>
      {count > 0 ? (
        <Button onClick={() => dispatch({ type: "set", patch: { compare: [] } })}>Clear all</Button>
      ) : null}
    </div>
  )
}
