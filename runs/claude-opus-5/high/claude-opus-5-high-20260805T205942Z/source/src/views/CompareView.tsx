import { Columns3, Plus, Trophy, X } from "lucide-react"
import { DestinationArt } from "../components/DestinationArt"
import { CostBar, MODE_ICON, MODE_LABEL, VIBE_ICON, VoteButtons } from "../components/shared"
import { Avatar, Badge, Button, EmptyState, Meter, cx } from "../components/ui"
import { DESTINATIONS } from "../data/destinations"
import { MEMBER_BY_ID } from "../data/group"
import { duration, money } from "../lib/format"
import { topVibesFor, weatherFor, type Ranked } from "../lib/trip"
import { MAX_COMPARE, useDerivedTrip, useTrip } from "../state/trip"

type RowSpec = {
  label: string
  render: (row: Ranked) => React.ReactNode
  /** Index of the winning column, if the row has one. */
  best?: (rows: Ranked[]) => number
}

export function CompareView({ onOpen }: { onOpen: (destinationId: string) => void }) {
  const { state, dispatch } = useTrip()
  const { rowById, weekend, currentMember } = useDerivedTrip()

  const selected = state.compare
    .map((id) => rowById[id])
    .filter((row): row is Ranked => Boolean(row))

  const specs: RowSpec[] = [
    {
      label: "Per person",
      best: (rows) => indexOfBest(rows, (r) => -r.cost.total),
      render: (row) => (
        <span className="tnum text-lg font-semibold text-ink">{money(row.cost.total)}</span>
      ),
    },
    {
      label: "Where it goes",
      render: (row) => <CostBar cost={row.cost} showLegend={false} />,
    },
    {
      label: "Getting there",
      best: (rows) => indexOfBest(rows, (r) => -r.travel.option.hours),
      render: (row) => {
        const Icon = MODE_ICON[row.travel.option.mode]
        return (
          <span className="flex items-center gap-1.5 text-[13.5px] font-medium text-ink">
            <Icon size={15} className="text-muted" />
            {MODE_LABEL[row.travel.option.mode]} · {duration(row.travel.option.hours)}
          </span>
        )
      },
    },
    {
      label: "Travel cost",
      best: (rows) => indexOfBest(rows, (r) => -r.travel.perPerson),
      render: (row) => (
        <span className="tnum text-[13.5px] text-ink">{money(row.travel.perPerson)} return</span>
      ),
    },
    {
      label: "Group match",
      best: (rows) => indexOfBest(rows, (r) => r.fit),
      render: (row) => (
        <div className="flex items-center gap-2">
          <Meter value={row.fit} className="flex-1" />
          <span className="tnum text-[13px] font-semibold text-ink">
            {Math.round(row.fit * 100)}%
          </span>
        </div>
      ),
    },
    {
      label: "Votes",
      best: (rows) => indexOfBest(rows, (r) => r.tally.score),
      render: (row) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="tnum text-[13.5px] font-semibold text-ink">{row.tally.score} pts</span>
          {row.tally.in.map((id) => {
            const member = MEMBER_BY_ID[id]
            return member ? <Avatar key={id} member={member} size={20} /> : null
          })}
        </div>
      ),
    },
    {
      label: "Bed for the night",
      render: (row) => (
        <span className="text-[13px] text-muted">
          {row.destination.stay.kind}, {row.destination.stay.walkMinutes} min out · ★{" "}
          {row.destination.stay.rating}
        </span>
      ),
    },
    {
      label: "Forecast",
      render: (row) => {
        const weather = weatherFor(row.destination, weekend)
        return (
          <span className="tnum text-[13px] text-muted">
            {weather.highC}° / {weather.lowC}° · {weather.rainChance}% rain
          </span>
        )
      },
    },
    {
      label: "Walkability",
      best: (rows) => indexOfBest(rows, (r) => r.destination.walkScore),
      render: (row) => (
        <span className="tnum text-[13px] text-muted">{row.destination.walkScore} / 100</span>
      ),
    },
    {
      label: "CO₂ per person",
      best: (rows) => indexOfBest(rows, (r) => -r.travel.option.co2),
      render: (row) => (
        <span className="tnum text-[13px] text-muted">{row.travel.option.co2} kg return</span>
      ),
    },
    {
      label: "Best for",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {topVibesFor(row.destination).map((vibe) => {
            const Icon = VIBE_ICON[vibe]
            return (
              <span
                key={vibe}
                className="inline-flex items-center gap-1 rounded-md bg-sunken px-1.5 py-0.5 text-[11.5px] font-medium text-muted capitalize"
              >
                <Icon size={11} />
                {vibe}
              </span>
            )
          })}
        </div>
      ),
    },
    {
      label: "Your vote",
      render: (row) => (
        <VoteButtons
          size="sm"
          labelPrefix={row.destination.name}
          value={state.votes[currentMember.id]?.[row.destination.id]}
          onVote={(value) =>
            dispatch({
              type: "vote",
              memberId: currentMember.id,
              destinationId: row.destination.id,
              value,
            })
          }
        />
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-ink">Side by side</h2>
          <p className="mt-0.5 text-[13px] text-muted">
            Up to {MAX_COMPARE} destinations, using the crew size and weekend you picked. Green
            marks the best number in each row.
          </p>
        </div>
        {selected.length > 0 && (
          <Button size="sm" variant="quiet" onClick={() => dispatch({ type: "clearCompare" })}>
            Clear all
          </Button>
        )}
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
        {DESTINATIONS.map((destination) => {
          const active = state.compare.includes(destination.id)
          const full = state.compare.length >= MAX_COMPARE
          return (
            <button
              key={destination.id}
              type="button"
              aria-pressed={active}
              disabled={!active && full}
              onClick={() => dispatch({ type: "toggleCompare", destinationId: destination.id })}
              className={cx(
                "focus-ring inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition disabled:opacity-40",
                active
                  ? "border-accent/40 bg-accent-soft text-accent"
                  : "border-line bg-surface text-muted hover:border-line-strong hover:text-ink",
              )}
            >
              {active ? <X size={13} /> : <Plus size={13} />}
              {destination.name}
            </button>
          )
        })}
      </div>

      {selected.length === 0 ? (
        <EmptyState
          icon={<Columns3 size={22} />}
          title="Nothing to compare yet"
          body="Pick two to four destinations above, or tap the compare icon on any card in Explore."
        />
      ) : (
        <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          <div
            className="grid min-w-max gap-px overflow-hidden rounded-card border border-line bg-line"
            style={{
              gridTemplateColumns: `minmax(132px, 148px) repeat(${selected.length}, minmax(210px, 1fr))`,
            }}
          >
            <div className="sticky left-0 z-10 bg-surface" />
            {selected.map((row) => (
              <div key={row.destination.id} className="relative bg-surface">
                <button
                  type="button"
                  onClick={() => onOpen(row.destination.id)}
                  className="focus-ring block w-full text-left"
                >
                  <DestinationArt destination={row.destination} className="h-24 w-full" />
                  <div className="p-3">
                    <div className="truncate text-[14.5px] font-semibold text-ink">
                      {row.destination.name}
                    </div>
                    <div className="truncate text-[12px] text-subtle">{row.destination.country}</div>
                  </div>
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${row.destination.name} from compare`}
                  onClick={() =>
                    dispatch({ type: "toggleCompare", destinationId: row.destination.id })
                  }
                  className="focus-ring absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {specs.map((spec) => {
              const bestIndex = spec.best ? spec.best(selected) : -1
              return (
                <CompareRow
                  key={spec.label}
                  label={spec.label}
                  cells={selected.map((row, index) => (
                    <div key={row.destination.id} className="relative">
                      {spec.render(row)}
                      {index === bestIndex && selected.length > 1 && (
                        <Badge tone="positive" className="mt-1.5" icon={<Trophy size={10} />}>
                          Best
                        </Badge>
                      )}
                    </div>
                  ))}
                />
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function CompareRow({ label, cells }: { label: string; cells: React.ReactNode[] }) {
  return (
    <>
      <div className="sticky left-0 z-10 flex items-center bg-raised px-3 py-3 text-[12px] font-medium tracking-wide text-subtle uppercase">
        {label}
      </div>
      {cells.map((cell, index) => (
        <div key={index} className="bg-surface px-3 py-3">
          {cell}
        </div>
      ))}
    </>
  )
}

function indexOfBest(rows: Ranked[], score: (row: Ranked) => number): number {
  let best = -1
  let bestValue = -Infinity
  rows.forEach((row, index) => {
    const value = score(row)
    if (value > bestValue) {
      bestValue = value
      best = index
    }
  })
  return best
}
