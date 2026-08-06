import { Clock, Heart, Thermometer, Users } from "lucide-react"
import { budgetTotal, type Destination, type Friend } from "../data"
import { Avatar, formatEuro, formatHours, TravelModeIcon, VibeTag } from "./ui"

interface Props {
  destination: Destination
  voters: Friend[]
  youVoted: boolean
  isLeader: boolean
  canVote: boolean
  maxBudget: number
  onToggleVote: () => void
  onOpen: () => void
}

export function DestinationCard({
  destination: d,
  voters,
  youVoted,
  isLeader,
  canVote,
  maxBudget,
  onToggleVote,
  onOpen,
}: Props) {
  const total = budgetTotal(d.budget)
  const voteCount = voters.length + (youVoted ? 1 : 0)

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <button
        type="button"
        onClick={onOpen}
        className={`relative flex h-32 w-full items-end bg-gradient-to-br ${d.gradient} p-4 text-left`}
        aria-label={`View details for ${d.name}`}
      >
        <span className="absolute right-4 top-4 text-4xl drop-shadow-sm" aria-hidden>
          {d.emoji}
        </span>
        {isLeader && (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-amber-600 shadow-sm">
            ★ Group favorite
          </span>
        )}
        <span className="text-white">
          <span className="block text-xl font-bold drop-shadow-sm">{d.name}</span>
          <span className="block text-sm font-medium text-white/85">{d.country}</span>
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-sm leading-6 text-stone-600">{d.tagline}</p>

        <div className="flex flex-wrap gap-1.5">
          {d.vibes.map((v) => (
            <VibeTag key={v} vibe={v} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-xl bg-stone-50 p-2.5">
            <div className="text-xs font-medium text-stone-500">Per person</div>
            <div className="mt-0.5 font-bold text-stone-900">{formatEuro(total)}</div>
          </div>
          <div className="rounded-xl bg-stone-50 p-2.5">
            <div className="flex items-center gap-1 text-xs font-medium text-stone-500">
              <TravelModeIcon mode={d.travelMode} className="size-3.5" />
              <Clock className="size-3" aria-hidden />
            </div>
            <div className="mt-0.5 font-bold text-stone-900">{formatHours(d.travelTimeH)}</div>
          </div>
          <div className="rounded-xl bg-stone-50 p-2.5">
            <div className="flex items-center gap-1 text-xs font-medium text-stone-500">
              <Thermometer className="size-3.5" aria-hidden />
              Sept
            </div>
            <div className="mt-0.5 font-bold text-stone-900">{d.tempC}°C</div>
          </div>
        </div>

        <div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-400"
              style={{ width: `${Math.round((total / maxBudget) * 100)}%` }}
            />
          </div>
          <div className="mt-1 text-[11px] text-stone-400">
            Budget vs. priciest option ({Math.round((total / maxBudget) * 100)}%)
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-3">
          <div className="flex items-center gap-2">
            {voteCount > 0 ? (
              <>
                <span className="flex -space-x-2">
                  {voters.map((f) => (
                    <Avatar key={f.id} initials={f.initials} color={f.color} ring />
                  ))}
                  {youVoted && <Avatar initials="YO" color="bg-amber-500" ring />}
                </span>
                <span className="text-xs font-medium text-stone-500">
                  {voteCount} vote{voteCount === 1 ? "" : "s"}
                </span>
              </>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-stone-400">
                <Users className="size-3.5" aria-hidden /> No votes yet
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleVote}
            disabled={!youVoted && !canVote}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
              youVoted
                ? "bg-rose-500 text-white hover:bg-rose-600"
                : canVote
                  ? "bg-stone-900 text-white hover:bg-stone-700"
                  : "cursor-not-allowed bg-stone-100 text-stone-400"
            }`}
            title={!youVoted && !canVote ? "You've used both votes — remove one first" : undefined}
          >
            <Heart className={`size-4 ${youVoted ? "fill-current" : ""}`} aria-hidden />
            {youVoted ? "Voted" : "Vote"}
          </button>
        </div>
      </div>
    </article>
  )
}
