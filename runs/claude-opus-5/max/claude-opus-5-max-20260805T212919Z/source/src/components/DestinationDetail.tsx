import {
  CalendarDays,
  Check,
  Clock,
  Columns3,
  Leaf,
  Lock,
  Star,
  TriangleAlert,
  Users,
  Wallet,
} from "lucide-react"
import { VIBE_LABEL } from "../data/trip"
import { cx, duration, money, plural } from "../lib/format"
import type { DestinationCard } from "../lib/trip"
import { useTrip } from "../state/store"
import { useCastVote, useToggleCompare } from "../state/actions"
import { HIGHLIGHT_ICON, MODE_ICON, MODE_LABEL, WEATHER_ICON, WEATHER_LABEL } from "./icons"
import { Scenery } from "./Scenery"
import { TallyBar, TallySummary, VoteControl } from "./VoteControl"
import { Avatar, Button, Chip, Meter, ScoreRing, StatBar } from "./ui"

function Fact({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Clock
  label: string
  value: string
  tone?: "no"
}) {
  return (
    <div className="rounded-xl border border-line bg-surface-2 p-3">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
        <Icon size={12} aria-hidden="true" />
        {label}
      </p>
      <p
        className={cx(
          "wk-tabular mt-1 text-[15px] font-bold leading-tight",
          tone === "no" ? "text-no" : "text-ink",
        )}
      >
        {value}
      </p>
    </div>
  )
}

export function DestinationDetail({
  card,
  onOpenPlan,
  onClose,
}: {
  card: DestinationCard
  onOpenPlan: (destinationId: string) => void
  onClose: () => void
}) {
  const { state, dispatch, crew } = useTrip()
  const castVote = useCastVote()
  const toggleCompare = useToggleCompare()
  const { destination, budget, travel, tally, match } = card
  const Weather = WEATHER_ICON[destination.weather.condition]
  const comparing = state.compare.includes(destination.id)
  const isLocked = state.lockedId === destination.id

  const lines = [
    { key: "travel", label: "Getting there", value: budget.travel, detail: travel.label },
    {
      key: "lodging",
      label: "Where you sleep",
      value: budget.lodging,
      detail: `${money(destination.stay.nightlyTotal)}/night × ${plural(budget.units, "place")} ÷ ${crew.length}`,
    },
    {
      key: "food",
      label: "Eating and drinking",
      value: budget.food,
      detail: `${money(destination.dailyFood)} a day × ${plural(state.nights + 1, "day")}`,
    },
    {
      key: "activities",
      label: "Doing things",
      value: budget.activities,
      detail: `${money(destination.dailyActivities)} a day, tickets and transport`,
    },
  ]
  const maxLine = Math.max(...lines.map((line) => line.value))

  return (
    <div>
      <div className="relative">
        <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[2.4/1]">
          <Scenery
            kind={destination.scenery}
            palette={destination.palette}
            seed={destination.id}
            className="size-full"
          />
          <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/72 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-6">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {isLocked ? (
                  <span className="flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold text-on-brand">
                    <Lock size={11} aria-hidden="true" /> Locked in
                  </span>
                ) : null}
                {destination.vibes.map((vibe) => (
                  <span
                    key={vibe}
                    className="rounded-full bg-white/22 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"
                  >
                    {VIBE_LABEL[vibe]}
                  </span>
                ))}
              </div>
              <h2 className="text-[26px] font-bold leading-tight tracking-tight text-white sm:text-3xl">
                {destination.name}
              </h2>
              <p className="mt-0.5 text-[13px] font-medium text-white/85">
                {destination.country} · {destination.region}
              </p>
            </div>
            <span className="hidden shrink-0 rounded-2xl bg-black/35 p-2 backdrop-blur-sm sm:block">
              <ScoreRing value={match.score} size={54} />
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-7 p-4 sm:p-6">
        <div>
          <p className="text-[15px] font-semibold leading-6 text-ink">{destination.tagline}</p>
          <p className="mt-2 text-[14px] leading-6 text-ink-soft">{destination.summary}</p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <Fact
            icon={Wallet}
            label="Per person"
            value={money(budget.total)}
            tone={card.overBudget ? "no" : undefined}
          />
          <Fact
            icon={Clock}
            label="Door to door"
            value={duration(travel.hours)}
            tone={card.overTime ? "no" : undefined}
          />
          <Fact
            icon={Weather}
            label={WEATHER_LABEL[destination.weather.condition]}
            value={`${destination.weather.highC}° / ${destination.weather.lowC}°`}
          />
          <Fact icon={Users} label="Whole group" value={money(budget.groupTotal)} />
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-gold/25 bg-gold-soft/60 p-3">
          <TriangleAlert size={15} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
          <p className="text-[13px] leading-5 text-ink">
            <span className="font-bold">Heads up · </span>
            {destination.heads}
          </p>
        </div>

        {/* Budget --------------------------------------------------- */}
        <section>
          <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-ink-faint">
            Where the money goes
          </h3>
          <div className="space-y-3 rounded-2xl border border-line bg-surface-2 p-4">
            {lines.map((line) => (
              <div key={line.key}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[13px] font-semibold text-ink">{line.label}</span>
                  <span className="wk-tabular text-[13px] font-bold text-ink">
                    {money(line.value)}
                  </span>
                </div>
                <Meter value={line.value} max={maxLine} className="my-1.5" />
                <p className="text-[11px] text-ink-faint">{line.detail}</p>
              </div>
            ))}
            <div className="flex items-baseline justify-between border-t border-line pt-3">
              <span className="text-[13px] font-bold text-ink">
                Total for {plural(state.nights, "night")}, per person
              </span>
              <span className="wk-tabular text-lg font-bold text-brand">{money(budget.total)}</span>
            </div>
            <p className="text-[11px] leading-4 text-ink-faint">
              Based on {plural(crew.length, "person", "people")} sharing{" "}
              {plural(budget.units, "place")}. Change who is coming in Trip setup and this
              recalculates.
            </p>
          </div>
        </section>

        {/* Travel --------------------------------------------------- */}
        <section>
          <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-ink-faint">
            Getting there from {state.originId[0].toUpperCase() + state.originId.slice(1)}
          </h3>
          <div className="space-y-2">
            {card.travelOptions.map((option, index) => {
              const Icon = MODE_ICON[option.mode]
              const active = index === card.travelIndex
              return (
                <button
                  key={`${option.mode}-${option.label}`}
                  type="button"
                  onClick={() =>
                    dispatch({
                      type: "travelChoice",
                      originId: state.originId,
                      destinationId: destination.id,
                      index,
                    })
                  }
                  aria-pressed={active}
                  className={cx(
                    "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition",
                    active
                      ? "border-brand bg-brand-soft"
                      : "border-line bg-surface hover:border-line-strong",
                  )}
                >
                  <span
                    className={cx(
                      "grid size-9 shrink-0 place-items-center rounded-lg",
                      active ? "bg-brand text-on-brand" : "bg-surface-2 text-ink-soft",
                    )}
                  >
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-[13px] font-bold text-ink">{option.label}</span>
                      <span className="text-[11px] font-semibold text-ink-faint">
                        {MODE_LABEL[option.mode]}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-[12px] leading-4 text-ink-soft">
                      {option.detail}
                    </span>
                    <span className="mt-1 flex items-center gap-1 text-[11px] font-medium text-ink-faint">
                      <Leaf size={11} aria-hidden="true" />
                      {option.co2} kg CO₂e return
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="wk-tabular block text-[15px] font-bold text-ink">
                      {money(option.price)}
                    </span>
                    <span className="wk-tabular block text-[11px] font-semibold text-ink-faint">
                      {duration(option.hours)}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Stay + highlights ---------------------------------------- */}
        <div className="grid gap-5 sm:grid-cols-2">
          <section>
            <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-ink-faint">
              Where you'd stay
            </h3>
            <div className="rounded-2xl border border-line bg-surface-2 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[14px] font-bold leading-tight text-ink">
                    {destination.stay.name}
                  </p>
                  <p className="mt-0.5 text-[12px] text-ink-soft">{destination.stay.kind}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1 rounded-lg bg-surface px-2 py-1 text-[12px] font-bold text-ink">
                  <Star size={12} className="fill-gold text-gold" aria-hidden="true" />
                  {destination.stay.rating}
                </span>
              </div>
              <p className="mt-2 text-[12px] leading-5 text-ink-soft">{destination.stay.note}</p>
              <p className="wk-tabular mt-3 border-t border-line pt-3 text-[13px] font-semibold text-ink">
                {money(destination.stay.nightlyTotal)}{" "}
                <span className="font-medium text-ink-faint">
                  a night · sleeps {destination.stay.sleeps}
                </span>
              </p>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-ink-faint">
              What you'd actually do
            </h3>
            <ul className="space-y-2.5">
              {destination.highlights.map((highlight) => {
                const Icon = HIGHLIGHT_ICON[highlight.icon]
                return (
                  <li key={highlight.title} className="flex gap-3">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-deep-soft text-deep">
                      <Icon size={15} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-[13px] font-bold leading-snug text-ink">
                        {highlight.title}
                      </span>
                      <span className="block text-[12px] leading-5 text-ink-soft">
                        {highlight.detail}
                      </span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </section>
        </div>

        {/* Feel + crew ---------------------------------------------- */}
        <div className="grid gap-5 sm:grid-cols-2">
          <section>
            <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-ink-faint">
              How it feels
            </h3>
            <div className="space-y-2 rounded-2xl border border-line bg-surface-2 p-4">
              <StatBar label="Food" value={destination.stats.food} />
              <StatBar label="Nature" value={destination.stats.nature} />
              <StatBar label="Nightlife" value={destination.stats.nightlife} />
              <StatBar label="Walkable" value={destination.stats.walkability} />
              <StatBar label="Crowds" value={destination.stats.crowds} />
              <p className="pt-1 text-[11px] leading-4 text-ink-faint">
                {destination.weather.note}
              </p>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-ink-faint">
              How the group is leaning
            </h3>
            <div className="rounded-2xl border border-line bg-surface-2 p-4">
              <TallyBar tally={tally} />
              <div className="mt-2.5">
                <TallySummary tally={tally} />
              </div>
              <div className="mt-3 space-y-2">
                {crew.map((member) => {
                  const vote = state.votes[member.id]?.[destination.id]
                  return (
                    <div key={member.id} className="flex items-center gap-2.5">
                      <Avatar member={member} size={24} dim={!vote} />
                      <span className="flex-1 truncate text-[12px] font-medium text-ink">
                        {member.name}
                      </span>
                      <Chip
                        tone={vote === "yes" ? "yes" : vote === "no" ? "no" : "neutral"}
                        className={vote === "maybe" ? "bg-maybe-soft text-maybe" : undefined}
                      >
                        {vote ? (vote === "yes" ? "Yes" : vote === "maybe" ? "Maybe" : "No") : "No vote"}
                      </Chip>
                    </div>
                  )
                })}
              </div>
              {card.crewFans.length ? (
                <p className="mt-3 border-t border-line pt-3 text-[11px] leading-4 text-ink-faint">
                  Matches what {card.crewFans.map((member) => member.name).join(", ")}{" "}
                  {card.crewFans.length === 1 ? "asked" : "asked"} for.
                </p>
              ) : null}
            </div>
          </section>
        </div>

        {/* Plan preview --------------------------------------------- */}
        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-[13px] font-bold uppercase tracking-wide text-ink-faint">
              A weekend here, roughly
            </h3>
            <Button
              size="sm"
              variant="ghost"
              icon={CalendarDays}
              onClick={() => {
                onOpenPlan(destination.id)
                onClose()
              }}
            >
              Full plan
            </Button>
          </div>
          <ol className="space-y-2">
            {destination.itinerary.map((day) => (
              <li
                key={day.id}
                className="flex flex-wrap items-baseline gap-x-2 rounded-xl border border-line bg-surface-2 px-3.5 py-2.5"
              >
                <span className="w-16 shrink-0 text-[12px] font-bold text-ink">{day.label}</span>
                <span className="flex-1 text-[12px] leading-5 text-ink-soft">
                  {day.items
                    .slice(0, 3)
                    .map((item) => item.title)
                    .join(" · ")}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Known for ------------------------------------------------ */}
        <div className="flex flex-wrap gap-1.5">
          {destination.knownFor.map((thing) => (
            <Chip key={thing} tone="outline">
              {thing}
            </Chip>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-line pt-5">
          <Button
            variant={comparing ? "primary" : "secondary"}
            icon={comparing ? Check : Columns3}
            onClick={() => toggleCompare(destination)}
          >
            {comparing ? "In compare" : "Add to compare"}
          </Button>
          <Button
            variant="secondary"
            icon={Lock}
            onClick={() => dispatch({ type: "lock", destinationId: isLocked ? null : destination.id })}
          >
            {isLocked ? "Unlock the trip" : "Lock this in"}
          </Button>
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-line bg-surface/95 p-4 backdrop-blur sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] font-semibold text-ink-soft">Your vote</p>
          <div className="sm:w-80">
            <VoteControl
              value={card.yourVote}
              onVote={(value) => castVote(destination, value)}
              destinationName={destination.name}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
