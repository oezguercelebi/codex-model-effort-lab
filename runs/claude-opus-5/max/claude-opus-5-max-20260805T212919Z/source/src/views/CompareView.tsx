import { Columns3, Lock, Plus, Sparkles, Star, X } from "lucide-react"
import { Scenery } from "../components/Scenery"
import { VoteControl } from "../components/VoteControl"
import { Button, Chip, EmptyState, Meter, ScoreRing, SectionHeading, StatBar } from "../components/ui"
import { MODE_ICON, WEATHER_ICON, WEATHER_LABEL } from "../components/icons"
import { VIBE_LABEL } from "../data/trip"
import { cx, duration, money, plural } from "../lib/format"
import type { DestinationCard } from "../lib/trip"
import { useCastVote } from "../state/actions"
import { MAX_COMPARE, useTrip } from "../state/store"

function Best() {
  return (
    <span className="ml-1.5 inline-flex items-center gap-0.5 rounded-full bg-yes-soft px-1.5 py-0.5 align-middle text-[9.5px] font-bold uppercase tracking-wide text-yes">
      <Star size={8} className="fill-current" aria-hidden="true" />
      Best
    </span>
  )
}

/** Shared column maths, so the row components below stay declared at module level. */
function useCompareShape() {
  const { compareCards, cards } = useTrip()
  const remaining = cards.filter(
    (card) => !compareCards.some((entry) => entry.destination.id === card.destination.id),
  )
  const canAdd = compareCards.length < MAX_COMPARE && remaining.length > 0
  return {
    compareCards,
    remaining,
    canAdd,
    totalColumns: compareCards.length + (canAdd ? 1 : 0),
  }
}

const ROW_LABEL =
  "sticky left-0 z-10 flex items-center px-3 py-3 text-[12px] font-semibold text-ink-soft"
const CELL = "border-l border-line px-3 py-3 text-[13px] text-ink"

function Row({
  label,
  render,
  tint,
}: {
  label: string
  render: (card: DestinationCard) => React.ReactNode
  tint?: boolean
}) {
  const { compareCards, canAdd } = useCompareShape()
  const bg = tint ? "bg-surface-2" : "bg-surface"
  return (
    <>
      <div className={cx(ROW_LABEL, bg)}>{label}</div>
      {compareCards.map((card) => (
        <div key={card.destination.id} className={cx(CELL, bg)}>
          {render(card)}
        </div>
      ))}
      {canAdd ? <div className={cx(CELL, bg)} /> : null}
    </>
  )
}

function SectionRow({ label }: { label: string }) {
  const { totalColumns } = useCompareShape()
  return (
    <>
      <div className="sticky left-0 z-10 bg-canvas px-3 pb-1.5 pt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-ink-faint">
        {label}
      </div>
      {Array.from({ length: totalColumns }, (_, index) => (
        <div key={index} className="bg-canvas" />
      ))}
    </>
  )
}

export function CompareView({ onOpen }: { onOpen: (destinationId: string) => void }) {
  const { compareIsAuto, state, dispatch, crew } = useTrip()
  const { compareCards, remaining, canAdd, totalColumns } = useCompareShape()
  const castVote = useCastVote()

  if (compareCards.length === 0) {
    return (
      <EmptyState
        icon={Columns3}
        title="Nothing to compare yet"
        body="Pick up to three destinations from Explore and they line up side by side here — budget, travel, weather and where the group stands."
        action={null}
      />
    )
  }

  const bestTotal = Math.min(...compareCards.map((card) => card.budget.total))
  const bestHours = Math.min(...compareCards.map((card) => card.travel.hours))
  const bestMatch = Math.max(...compareCards.map((card) => card.match.score))
  const bestVotes = Math.max(...compareCards.map((card) => card.tally.score))
  const maxLine = Math.max(
    ...compareCards.flatMap((card) => [
      card.budget.travel,
      card.budget.lodging,
      card.budget.food,
      card.budget.activities,
    ]),
  )


  return (
    <div>
      <SectionHeading
        icon={Columns3}
        title="Side by side"
        subtitle={
          compareIsAuto
            ? "Automatically showing the three the group likes most. Pick your own from Explore to change this."
            : "The three you picked. Best value in each row is flagged."
        }
        action={
          !compareIsAuto ? (
            <Button size="sm" variant="ghost" onClick={() => dispatch({ type: "setCompare", ids: [] })}>
              Back to top three
            </Button>
          ) : null
        }
      />

      <div className="wk-scroll -mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <div
          className="grid min-w-[720px] overflow-hidden rounded-card border border-line bg-surface shadow-soft"
          style={{
            gridTemplateColumns: `132px repeat(${totalColumns}, minmax(196px, 1fr))`,
          }}
        >
          {/* Header ------------------------------------------------- */}
          <div className="sticky left-0 z-10 bg-surface" />
          {compareCards.map((card) => (
            <div key={card.destination.id} className="relative border-l border-line">
              <button
                type="button"
                onClick={() => onOpen(card.destination.id)}
                className="block w-full text-left"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Scenery
                    kind={card.destination.scenery}
                    palette={card.destination.palette}
                    seed={card.destination.id}
                    className="size-full"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-2.5">
                    <p className="truncate text-[15px] font-bold leading-tight text-white">
                      {card.destination.name}
                    </p>
                    <p className="truncate text-[11px] text-white/85">{card.destination.country}</p>
                  </div>
                </div>
              </button>
              {!compareIsAuto ? (
                <button
                  type="button"
                  onClick={() =>
                    dispatch({ type: "toggleCompare", destinationId: card.destination.id })
                  }
                  aria-label={`Remove ${card.destination.name} from compare`}
                  className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
                >
                  <X size={13} aria-hidden="true" />
                </button>
              ) : null}
            </div>
          ))}
          {canAdd ? (
            <div className="border-l border-line p-3">
              <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                <Plus size={12} aria-hidden="true" />
                Add one
              </label>
              <select
                value=""
                onChange={(event) =>
                  event.target.value &&
                  dispatch({ type: "toggleCompare", destinationId: event.target.value })
                }
                aria-label="Add a destination to compare"
                className="h-9 w-full rounded-lg border border-line bg-surface px-2 text-[12px] font-semibold text-ink outline-none focus:border-brand"
              >
                <option value="">Choose…</option>
                {remaining.map((card) => (
                  <option key={card.destination.id} value={card.destination.id}>
                    {card.destination.name}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-[11px] leading-4 text-ink-faint">
                Compare holds {MAX_COMPARE} at a time.
              </p>
            </div>
          ) : null}

          <SectionRow label="The numbers" />
          <Row
            label="Match for you"
            tint
            render={(card) => (
              <span className="flex items-center gap-2">
                <ScoreRing value={card.match.score} size={34} />
                {card.match.score === bestMatch ? <Best /> : null}
              </span>
            )}
          />
          <Row
            label="Per person"
            render={(card) => (
              <span className="wk-tabular flex flex-wrap items-baseline gap-x-1 text-[17px] font-bold">
                {money(card.budget.total)}
                {card.budget.total === bestTotal ? <Best /> : null}
              </span>
            )}
          />
          <Row
            label="Whole group"
            tint
            render={(card) => (
              <span className="wk-tabular font-semibold text-ink-soft">
                {money(card.budget.groupTotal)}
              </span>
            )}
          />
          <Row
            label="Cost split"
            render={(card) => (
              <div className="space-y-1.5">
                {[
                  { key: "Travel", value: card.budget.travel },
                  { key: "Stay", value: card.budget.lodging },
                  { key: "Food", value: card.budget.food },
                  { key: "Doing", value: card.budget.activities },
                ].map((line) => (
                  <div key={line.key}>
                    <div className="flex justify-between text-[11px] font-medium text-ink-soft">
                      <span>{line.key}</span>
                      <span className="wk-tabular">{money(line.value)}</span>
                    </div>
                    <Meter value={line.value} max={maxLine} height="h-1" />
                  </div>
                ))}
              </div>
            )}
          />

          <SectionRow label="Getting there" />
          <Row
            label="Journey"
            tint
            render={(card) => {
              const Icon = MODE_ICON[card.travel.mode]
              return (
                <span className="flex flex-wrap items-center gap-1.5">
                  <Icon size={15} className="text-ink-faint" aria-hidden="true" />
                  <span className="wk-tabular font-semibold">{duration(card.travel.hours)}</span>
                  {card.travel.hours === bestHours ? <Best /> : null}
                </span>
              )
            }}
          />
          <Row
            label="How"
            render={(card) => (
              <span className="text-[12px] leading-4 text-ink-soft">{card.travel.label}</span>
            )}
          />
          <Row
            label="Weather"
            tint
            render={(card) => {
              const Icon = WEATHER_ICON[card.destination.weather.condition]
              return (
                <span className="flex items-center gap-2">
                  <Icon size={16} className="text-ink-faint" aria-hidden="true" />
                  <span>
                    <span className="wk-tabular block font-semibold">
                      {card.destination.weather.highC}° / {card.destination.weather.lowC}°
                    </span>
                    <span className="block text-[11px] text-ink-faint">
                      {WEATHER_LABEL[card.destination.weather.condition]} ·{" "}
                      {card.destination.weather.rainChance}% rain
                    </span>
                  </span>
                </span>
              )
            }}
          />
          <Row
            label="Stay"
            render={(card) => (
              <span>
                <span className="block text-[12px] font-semibold leading-4">
                  {card.destination.stay.name}
                </span>
                <span className="wk-tabular mt-0.5 block text-[11px] text-ink-faint">
                  {money(card.destination.stay.nightlyTotal)}/night · sleeps{" "}
                  {card.destination.stay.sleeps}
                </span>
              </span>
            )}
          />

          <SectionRow label="The feel" />
          <Row
            label="Vibe"
            tint
            render={(card) => (
              <span className="flex flex-wrap gap-1">
                {card.destination.vibes.map((vibe) => (
                  <Chip key={vibe}>{VIBE_LABEL[vibe]}</Chip>
                ))}
              </span>
            )}
          />
          <Row
            label="Ratings"
            render={(card) => (
              <div className="space-y-1.5">
                <StatBar label="Food" value={card.destination.stats.food} />
                <StatBar label="Nature" value={card.destination.stats.nature} />
                <StatBar label="Nightlife" value={card.destination.stats.nightlife} />
                <StatBar label="Walkable" value={card.destination.stats.walkability} />
                <StatBar label="Crowds" value={card.destination.stats.crowds} />
              </div>
            )}
          />
          <Row
            label="Heads up"
            tint
            render={(card) => (
              <span className="text-[11.5px] leading-4 text-ink-soft">{card.destination.heads}</span>
            )}
          />

          <SectionRow label="The group" />
          <Row
            label="Votes"
            tint
            render={(card) => (
              <span>
                <span className="wk-tabular flex items-baseline gap-1 text-[15px] font-bold">
                  {card.tally.score}
                  <span className="text-[11px] font-semibold text-ink-faint">
                    / {card.tally.maxScore}
                  </span>
                  {card.tally.score === bestVotes ? <Best /> : null}
                </span>
                <span className="mt-1 block text-[11px] text-ink-faint">
                  {card.tally.yes} yes · {card.tally.maybe} maybe · {card.tally.no} no
                </span>
              </span>
            )}
          />
          <Row
            label="Crew fit"
            render={(card) => (
              <span className="text-[11.5px] leading-4 text-ink-soft">
                {card.crewFans.length
                  ? `${card.crewFans.map((member) => member.name).join(", ")} asked for this`
                  : "Nobody flagged this one"}
              </span>
            )}
          />
          <Row
            label="Your vote"
            tint
            render={(card) => (
              <VoteControl
                value={card.yourVote}
                size="sm"
                destinationName={card.destination.name}
                onVote={(value) => castVote(card.destination, value)}
              />
            )}
          />
          <Row
            label=""
            render={(card) => (
              <Button
                size="sm"
                variant={state.lockedId === card.destination.id ? "primary" : "secondary"}
                icon={Lock}
                className="w-full"
                onClick={() =>
                  dispatch({
                    type: "lock",
                    destinationId: state.lockedId === card.destination.id ? null : card.destination.id,
                  })
                }
              >
                {state.lockedId === card.destination.id ? "Locked in" : "Lock this in"}
              </Button>
            )}
          />
        </div>
      </div>

      <p className="mt-4 flex items-center justify-center gap-2 text-center text-[12px] text-ink-faint">
        <Sparkles size={13} aria-hidden="true" />
        Costs assume {plural(crew.length, "person", "people")} sharing and{" "}
        {plural(state.nights, "night")} away.
      </p>
    </div>
  )
}
