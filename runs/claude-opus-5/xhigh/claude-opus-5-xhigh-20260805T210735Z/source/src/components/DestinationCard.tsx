import { Check, Clock, Columns3, Trophy, Wallet } from "lucide-react"
import type { Destination, Tally, VoteValue } from "../types"
import { crew } from "../data/trip"
import type { Fit, Plan } from "../lib/compute"
import { budgetFor, selectedTravel } from "../lib/compute"
import { currency, minutesToLabel } from "../lib/format"
import { DestinationArt } from "./DestinationArt"
import { TravelIcon, VibeIcon, VoteButtons } from "./ui"

export function FitBadge({ score, className = "" }: { score: number; className?: string }) {
  const tone =
    score >= 78
      ? "bg-pine text-white"
      : score >= 60
        ? "bg-card text-ink ring-1 ring-line-2"
        : "bg-card text-ink-2 ring-1 ring-line-2"
  return (
    <span
      title={`Fit score ${score} out of 100 — how well this matches the crew's vibes, budget and travel limit`}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold tabular-nums ${tone} ${className}`}
    >
      {score}
      <span className="font-normal opacity-80">fit</span>
    </span>
  )
}

export function DestinationCard({
  destination,
  plan,
  fit,
  tally,
  vote,
  isCompared,
  compareDisabled,
  isLeader,
  onOpen,
  onVote,
  onToggleCompare,
  index = 0,
}: {
  destination: Destination
  plan: Plan
  fit: Fit
  tally: Tally
  vote?: VoteValue
  isCompared: boolean
  compareDisabled: boolean
  isLeader: boolean
  onOpen: () => void
  onVote: (v: VoteValue) => void
  onToggleCompare: () => void
  index?: number
}) {
  const budget = budgetFor(destination, plan)
  const travel = selectedTravel(destination, plan.travelChoices)

  return (
    <article
      className="wk-rise group flex flex-col overflow-hidden rounded-2xl border border-line bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-line-2 hover:shadow-[0_12px_28px_-16px_rgb(27_23_18/0.35)]"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <div className="relative">
        <button
          type="button"
          onClick={onOpen}
          className="block w-full text-left"
          aria-label={`Open details for ${destination.name}`}
        >
          <DestinationArt destination={destination} className="h-44 w-full object-cover sm:h-40" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="font-display text-[26px] leading-tight tracking-tight text-white drop-shadow-sm">
              {destination.name}
            </h3>
            <p className="text-[12.5px] font-medium text-white/85">{destination.region}</p>
          </div>
        </button>

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <FitBadge score={fit.score} />
            {isLeader ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11.5px] font-semibold text-white">
                <Trophy className="h-3 w-3" strokeWidth={2.2} aria-hidden />
                Crew favourite
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onToggleCompare}
            disabled={compareDisabled && !isCompared}
            aria-pressed={isCompared}
            title={
              isCompared
                ? "Remove from comparison"
                : compareDisabled
                  ? "Comparison is full — remove one first"
                  : "Add to comparison"
            }
            className={`pointer-events-auto grid h-8 w-8 place-items-center rounded-full shadow-sm ring-1 backdrop-blur transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 ${
              isCompared
                ? "bg-ink text-paper ring-ink"
                : "bg-card/85 text-ink ring-line hover:bg-card"
            }`}
          >
            {isCompared ? (
              <Check className="h-4 w-4" strokeWidth={2.4} />
            ) : (
              <Columns3 className="h-4 w-4" strokeWidth={1.9} />
            )}
            <span className="sr-only">Compare {destination.name}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="line-clamp-2 text-[13.5px] leading-6 text-ink-2">{destination.tagline}</p>

        <dl className="mt-3.5 grid grid-cols-3 gap-2 border-y border-line py-3">
          <div>
            <dt className="flex items-center gap-1 text-[11px] font-medium text-ink-3">
              <Wallet className="h-3 w-3" strokeWidth={1.9} aria-hidden /> Per person
            </dt>
            <dd className="mt-0.5 text-[15px] font-semibold tabular-nums text-ink">
              {currency(budget.total)}
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 text-[11px] font-medium text-ink-3">
              <Clock className="h-3 w-3" strokeWidth={1.9} aria-hidden /> Each way
            </dt>
            <dd className="mt-0.5 flex items-center gap-1.5 text-[15px] font-semibold text-ink">
              <TravelIcon mode={travel.mode} className="h-3.5 w-3.5 text-ink-2" />
              {minutesToLabel(travel.minutes)}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] font-medium text-ink-3">Crew score</dt>
            <dd className="mt-0.5 text-[15px] font-semibold tabular-nums text-ink">
              {tally.score > 0 ? `+${tally.score}` : tally.score}
              <span className="ml-1 text-[11px] font-normal text-ink-3">
                {tally.votesCast}/{crew.length}
              </span>
            </dd>
          </div>
        </dl>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {destination.vibes.slice(0, 3).map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 rounded-full bg-sand px-2 py-1 text-[11.5px] font-medium text-ink-2"
            >
              <VibeIcon vibe={v} className="h-3 w-3" />
              {v}
            </span>
          ))}
          {destination.vibes.length > 3 ? (
            <span className="inline-flex items-center rounded-full bg-sand px-2 py-1 text-[11.5px] font-medium text-ink-3">
              +{destination.vibes.length - 3}
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 pt-1">
          <VoteButtons value={vote} onVote={onVote} size="sm" />
          <button
            type="button"
            onClick={onOpen}
            className="rounded-lg px-2 py-1.5 text-[13px] font-semibold text-clay transition-colors hover:bg-clay-tint"
          >
            Details
          </button>
        </div>
      </div>
    </article>
  )
}

export function DestinationCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card">
      <div className="wk-skeleton h-44 w-full sm:h-40" />
      <div className="space-y-3 p-4">
        <div className="wk-skeleton h-3.5 w-4/5 rounded" />
        <div className="wk-skeleton h-3.5 w-2/5 rounded" />
        <div className="flex gap-2 pt-2">
          <div className="wk-skeleton h-10 flex-1 rounded-lg" />
          <div className="wk-skeleton h-10 flex-1 rounded-lg" />
          <div className="wk-skeleton h-10 flex-1 rounded-lg" />
        </div>
        <div className="wk-skeleton h-9 w-full rounded-lg" />
      </div>
    </div>
  )
}
