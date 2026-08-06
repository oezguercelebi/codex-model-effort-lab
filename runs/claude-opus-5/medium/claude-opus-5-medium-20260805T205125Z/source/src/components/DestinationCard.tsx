import { AlertTriangle, Clock, GitCompare, Plane, Train, Car, Wallet } from "lucide-react"
import { consensusPct, formatHours, formatMoney } from "../lib/engine"
import { VIBE_LABELS } from "../lib/data"
import type { Scored, TravelMode } from "../lib/types"
import { useStore } from "../lib/store"
import { Avatar, Chip, Meter, Tag, VoteButtons, cx } from "./ui"
import { Scenery } from "./Scenery"

export const MODE_ICON: Record<TravelMode, typeof Plane> = {
  fly: Plane,
  train: Train,
  drive: Car,
}

export function DestinationCard({
  item,
  index,
  onOpen,
}: {
  item: Scored
  index: number
  onOpen: () => void
}) {
  const { members, settings, shortlist, toggleShortlist, castVote, lockedId } = useStore()
  const d = item.destination
  const yourVote = item.votes.you
  const ModeIcon = MODE_ICON[item.travel.mode]
  const overCap = item.cost.total > settings.budgetCap
  const shortlisted = shortlist.includes(d.id)
  const consensus = consensusPct(item.score, Object.keys(item.votes).length)
  const isLocked = lockedId === d.id

  return (
    <article
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
      className={cx(
        "animate-rise group flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg dark:bg-stone-900",
        isLocked
          ? "border-teal-500 ring-2 ring-teal-500/25"
          : "border-stone-200 dark:border-white/10",
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        className="relative block h-40 w-full overflow-hidden text-left focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
        aria-label={`Open details for ${d.name}`}
      >
        <Scenery destination={d} className="transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/70 to-transparent p-4">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-white/75 uppercase">
            {d.country} · {d.region}
          </p>
          <h3 className="text-xl font-semibold text-white">{d.name}</h3>
        </div>
        {isLocked ? (
          <span className="absolute top-3 left-3 rounded-full bg-teal-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow">
            Locked in
          </span>
        ) : null}
      </button>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <p className="text-sm leading-6 text-stone-600 dark:text-stone-400">{d.tagline}</p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-2xl bg-stone-100 px-3 py-2 dark:bg-white/5">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500 dark:text-stone-400">
              <Wallet size={12} /> Per person
            </div>
            <div
              className={cx(
                "mt-0.5 font-semibold",
                overCap ? "text-amber-600 dark:text-amber-400" : "text-stone-900 dark:text-white",
              )}
            >
              {formatMoney(item.cost.total)}
            </div>
          </div>
          <div className="rounded-2xl bg-stone-100 px-3 py-2 dark:bg-white/5">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500 dark:text-stone-400">
              <Clock size={12} /> Each way
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 font-semibold text-stone-900 dark:text-white">
              <ModeIcon size={13} className="text-stone-500 dark:text-stone-400" />
              {formatHours(item.travel.hours)}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {d.vibes.slice(0, 3).map((v) => (
            <Tag key={v}>{VIBE_LABELS[v]}</Tag>
          ))}
          {overCap ? (
            <Tag tone="warn">
              <AlertTriangle size={11} /> {formatMoney(item.cost.total - settings.budgetCap)} over
            </Tag>
          ) : null}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-stone-500 dark:text-stone-400">
              {item.tally.in} in · {item.tally.maybe} maybe · {item.tally.out} out
            </span>
            <span className="font-semibold text-stone-900 dark:text-white">{consensus}%</span>
          </div>
          <Meter
            value={consensus}
            tone={consensus >= 66 ? "teal" : consensus >= 40 ? "amber" : "rose"}
          />
          <div className="mt-2.5 flex -space-x-1.5">
            {members.map((m) => (
              <Avatar
                key={m.id}
                member={m}
                size={24}
                vote={item.votes[m.id]}
                title={`${m.name}: ${item.votes[m.id] ?? "hasn't voted"}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-auto space-y-2">
          <VoteButtons value={yourVote} size="sm" onVote={(v) => castVote(d.id, v)} />
          <div className="flex gap-2">
            <Chip active={shortlisted} onClick={() => toggleShortlist(d.id)}>
              <span className="flex items-center gap-1.5">
                <GitCompare size={12} />
                {shortlisted ? "Comparing" : "Compare"}
              </span>
            </Chip>
            <button
              type="button"
              onClick={onOpen}
              className="ml-auto rounded-full px-3 py-1.5 text-xs font-semibold text-stone-700 underline-offset-4 hover:underline dark:text-stone-300"
            >
              See the weekend →
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
