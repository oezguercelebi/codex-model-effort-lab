import { Check, Clock, Columns3, Crown, Lock, TriangleAlert } from "lucide-react"
import { cx, duration, money } from "../lib/format"
import type { DestinationCard as CardModel } from "../lib/trip"
import { VIBE_LABEL } from "../data/trip"
import { WEATHER_ICON } from "./icons"
import { Scenery } from "./Scenery"
import { TallyBar, TallySummary, VoteControl } from "./VoteControl"
import { Chip, ScoreRing } from "./ui"
import type { VoteValue } from "../types"

interface Props {
  card: CardModel
  onOpen: () => void
  onVote: (value: VoteValue) => void
  onToggleCompare: () => void
  comparing: boolean
  isLeader: boolean
  isLocked: boolean
  index?: number
}

export function DestinationCard({
  card,
  onOpen,
  onVote,
  onToggleCompare,
  comparing,
  isLeader,
  isLocked,
  index = 0,
}: Props) {
  const { destination, budget, travel, tally, match } = card
  const Weather = WEATHER_ICON[destination.weather.condition]

  return (
    <article
      className="wk-fade-up group relative flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-soft transition-shadow duration-300 hover:shadow-lift focus-within:shadow-lift"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <div className="relative">
        <button
          type="button"
          onClick={onOpen}
          className="block w-full text-left"
          aria-label={`Open details for ${destination.name}, ${destination.country}`}
        >
          <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[16/9]">
            <Scenery
              kind={destination.scenery}
              palette={destination.palette}
              seed={destination.id}
              className="size-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/62 via-black/18 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3.5">
              <div className="min-w-0">
                <h3 className="truncate text-[19px] font-bold leading-tight text-white drop-shadow-sm">
                  {destination.name}
                </h3>
                <p className="truncate text-[12px] font-medium text-white/85">
                  {destination.country} · {destination.region}
                </p>
              </div>
              <span className="shrink-0 rounded-xl bg-black/35 p-1 backdrop-blur-sm">
                <ScoreRing value={match.score} size={40} label={`Match ${match.score} out of 100`} />
              </span>
            </div>
          </div>
        </button>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <div className="flex flex-wrap gap-1.5">
            {isLocked ? (
              <span className="pointer-events-auto flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold text-on-brand shadow-soft">
                <Lock size={11} aria-hidden="true" /> Locked in
              </span>
            ) : isLeader ? (
              <span className="pointer-events-auto flex items-center gap-1 rounded-full bg-gold-soft px-2.5 py-1 text-[11px] font-bold text-gold shadow-soft">
                <Crown size={11} aria-hidden="true" /> Group favourite
              </span>
            ) : null}
            {card.overBudget ? (
              <span className="pointer-events-auto flex items-center gap-1 rounded-full bg-no-soft px-2.5 py-1 text-[11px] font-bold text-no shadow-soft">
                <TriangleAlert size={11} aria-hidden="true" /> Over budget
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onToggleCompare}
            aria-pressed={comparing}
            aria-label={
              comparing ? `Remove ${destination.name} from compare` : `Add ${destination.name} to compare`
            }
            title={comparing ? "In compare" : "Add to compare"}
            className={cx(
              "pointer-events-auto grid size-8 shrink-0 place-items-center rounded-full backdrop-blur-sm transition active:scale-95",
              comparing
                ? "bg-brand text-on-brand shadow-soft"
                : "bg-black/35 text-white hover:bg-black/55",
            )}
          >
            {comparing ? <Check size={15} aria-hidden="true" /> : <Columns3 size={15} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 p-4">
        <p className="line-clamp-2 text-[13px] font-medium leading-5 text-ink-soft">
          {destination.tagline}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-baseline gap-1.5">
            <span className="wk-tabular text-[22px] font-bold leading-none tracking-tight text-ink">
              {money(budget.total)}
            </span>
            <span className="text-[11px] font-semibold text-ink-faint">pp</span>
          </div>
          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-ink-soft">
            <Clock size={13} className="text-ink-faint" aria-hidden="true" />
            {duration(travel.hours)}
          </span>
          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-ink-soft">
            <Weather size={14} className="text-ink-faint" aria-hidden="true" />
            {destination.weather.highC}°
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {destination.vibes.slice(0, 3).map((vibe) => (
            <Chip key={vibe}>{VIBE_LABEL[vibe]}</Chip>
          ))}
          {card.overTime ? (
            <Chip tone="no" icon={Clock}>
              Longer than your limit
            </Chip>
          ) : null}
        </div>

        <div className="mt-auto space-y-2">
          <TallyBar tally={tally} />
          <div className="flex items-center justify-between gap-2">
            <TallySummary tally={tally} />
            <button
              type="button"
              onClick={onOpen}
              className="text-[12px] font-bold text-brand transition hover:text-brand-hover"
            >
              Details
            </button>
          </div>
        </div>

        <VoteControl
          value={card.yourVote}
          onVote={onVote}
          size="sm"
          destinationName={destination.name}
        />
      </div>
    </article>
  )
}

export function DestinationCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface shadow-soft">
      <div className="wk-skeleton aspect-[16/10] sm:aspect-[16/9]" />
      <div className="space-y-3 p-4">
        <div className="wk-skeleton h-3.5 w-4/5 rounded-full" />
        <div className="wk-skeleton h-6 w-1/3 rounded-full" />
        <div className="flex gap-2">
          <div className="wk-skeleton h-5 w-16 rounded-full" />
          <div className="wk-skeleton h-5 w-14 rounded-full" />
        </div>
        <div className="wk-skeleton h-1.5 w-full rounded-full" />
        <div className="wk-skeleton h-9 w-full rounded-xl" />
      </div>
    </div>
  )
}
