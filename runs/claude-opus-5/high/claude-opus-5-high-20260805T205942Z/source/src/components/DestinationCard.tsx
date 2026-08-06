import { Bookmark, Columns3, Wallet, Clock, TrendingUp } from "lucide-react"
import { MEMBER_BY_ID } from "../data/group"
import { money, duration } from "../lib/format"
import { topVibesFor, type Ranked } from "../lib/trip"
import { MAX_COMPARE, useTrip } from "../state/trip"
import type { Member, Weekend } from "../types"
import { DestinationArt } from "./DestinationArt"
import { FitRing, MODE_ICON, VIBE_ICON, VoteButtons, WeatherLine } from "./shared"
import { Avatar, Badge, Button, cx, useToast } from "./ui"

export function DestinationCard({
  row,
  weekend,
  budget,
  voteRank,
  onOpen,
  currentMember,
}: {
  row: Ranked
  weekend: Weekend
  budget: number
  /** Position on the group's vote leaderboard, if this one has votes. */
  voteRank?: number
  onOpen: () => void
  currentMember: Member
}) {
  const { state, dispatch } = useTrip()
  const toast = useToast()
  const { destination, cost, travel, fit, tally } = row
  const ModeIcon = MODE_ICON[travel.option.mode]
  const shortlisted = state.shortlist.includes(destination.id)
  const comparing = state.compare.includes(destination.id)
  const myVote = state.votes[currentMember.id]?.[destination.id]
  const overBudget = cost.total > budget
  const inVoters = tally.in.map((id) => MEMBER_BY_ID[id]).filter(Boolean)

  return (
    <article className="animate-rise group flex flex-col overflow-hidden rounded-card border border-line bg-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <button
        type="button"
        onClick={onOpen}
        className="focus-ring relative block w-full text-left"
        aria-label={`Open details for ${destination.name}`}
      >
        <DestinationArt
          destination={destination}
          className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <div className="flex flex-wrap gap-1.5">
            {voteRank != null && voteRank < 3 && (
              <Badge tone="brand" className="border-transparent bg-white/90 text-stone-900">
                #{voteRank + 1} with the group
              </Badge>
            )}
            {destination.knownFor.slice(0, 1).map((tag) => (
              <Badge key={tag} className="border-transparent bg-black/40 text-white backdrop-blur">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold tracking-tight text-white drop-shadow">
                {destination.name}
              </h3>
              <p className="truncate text-[12.5px] text-white/80">
                {destination.country} · {destination.tagline}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-black/35 p-0.5 backdrop-blur">
              <FitRing value={fit} size={42} />
            </span>
          </div>
        </div>
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1 text-[11px] font-medium tracking-wide text-subtle uppercase">
              <Wallet size={12} /> Per person
            </div>
            <div className="tnum mt-0.5 flex items-baseline gap-1.5">
              <span className="text-xl font-semibold text-ink">{money(cost.total)}</span>
              {overBudget && (
                <span className="text-[12px] font-medium text-danger">
                  +{money(cost.total - budget)}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-[11px] font-medium tracking-wide text-subtle uppercase">
              <Clock size={12} /> Each way
            </div>
            <div className="tnum mt-0.5 flex items-center justify-end gap-1.5 text-[15px] font-semibold text-ink">
              <ModeIcon size={15} className="text-muted" />
              {duration(travel.option.hours)}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {topVibesFor(destination).map((vibe) => {
            const Icon = VIBE_ICON[vibe]
            return (
              <span
                key={vibe}
                className="inline-flex items-center gap-1 rounded-md bg-sunken px-1.5 py-1 text-[11.5px] font-medium text-muted capitalize"
              >
                <Icon size={12} />
                {vibe}
              </span>
            )
          })}
          <WeatherLine
            destination={destination}
            weekend={weekend}
            className="ml-auto text-subtle"
          />
        </div>

        <div className="mt-auto space-y-3 border-t border-line pt-3">
          <div className="flex h-7 items-center justify-between gap-2">
            {inVoters.length > 0 ? (
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex items-center">
                  {inVoters.slice(0, 4).map((m, i) => (
                    <Avatar
                      key={m.id}
                      member={m}
                      size={22}
                      ring
                      className={i > 0 ? "-ml-1.5" : ""}
                    />
                  ))}
                </span>
                <span className="truncate text-[12px] text-muted">
                  {inVoters.length === 1
                    ? `${inVoters[0].name} is in`
                    : `${inVoters.length} are in`}
                </span>
              </div>
            ) : (
              <span className="text-[12px] text-subtle">No votes yet</span>
            )}
            <span className="flex shrink-0 items-center gap-1 text-[12px] font-medium text-muted">
              <TrendingUp size={13} />
              {tally.score} pts
            </span>
          </div>

          <VoteButtons
            value={myVote}
            size="sm"
            labelPrefix={`${destination.name}`}
            onVote={(value) => {
              dispatch({
                type: "vote",
                memberId: currentMember.id,
                destinationId: destination.id,
                value,
              })
            }}
          />

          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={onOpen}>
              Details
            </Button>
            <button
              type="button"
              aria-pressed={comparing}
              aria-label={comparing ? "Remove from compare" : "Add to compare"}
              title={comparing ? "Remove from compare" : "Add to compare"}
              onClick={() => {
                const wasComparing = comparing
                dispatch({ type: "toggleCompare", destinationId: destination.id })
                if (!wasComparing && state.compare.length >= MAX_COMPARE) {
                  toast({ message: `Compare holds ${MAX_COMPARE} spots — remove one first` })
                }
              }}
              className={cx(
                "focus-ring grid size-8 place-items-center rounded-lg border transition",
                comparing
                  ? "border-accent/40 bg-accent-soft text-accent"
                  : "border-line bg-surface text-muted hover:text-ink",
              )}
            >
              <Columns3 size={15} />
            </button>
            <button
              type="button"
              aria-pressed={shortlisted}
              aria-label={shortlisted ? "Remove from shortlist" : "Save to shortlist"}
              title={shortlisted ? "Remove from shortlist" : "Save to shortlist"}
              onClick={() => {
                dispatch({ type: "toggleShortlist", destinationId: destination.id })
                toast({
                  message: shortlisted
                    ? `${destination.name} removed from your shortlist`
                    : `${destination.name} saved to your shortlist`,
                })
              }}
              className={cx(
                "focus-ring grid size-8 place-items-center rounded-lg border transition",
                shortlisted
                  ? "border-brand/40 bg-brand-soft text-brand-ink"
                  : "border-line bg-surface text-muted hover:text-ink",
              )}
            >
              <Bookmark size={15} fill={shortlisted ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export function DestinationCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      <div className="skeleton h-44 w-full" />
      <div className="space-y-3 p-4">
        <div className="flex justify-between">
          <div className="skeleton h-7 w-24 rounded-lg" />
          <div className="skeleton h-7 w-16 rounded-lg" />
        </div>
        <div className="skeleton h-5 w-full rounded-lg" />
        <div className="skeleton h-8 w-full rounded-lg" />
        <div className="skeleton h-8 w-full rounded-lg" />
      </div>
    </div>
  )
}
