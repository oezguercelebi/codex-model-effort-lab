import { useState, type ReactNode } from "react"
import { Crown, Lock, RotateCcw, Trophy, Users } from "lucide-react"
import { consensusPct, formatHours, formatMoney } from "../lib/engine"
import { useStore } from "../lib/store"
import type { Scored } from "../lib/types"
import { Avatar, Button, Meter, VoteButtons, cx } from "../components/ui"
import { Scenery } from "../components/Scenery"
import { DestinationDetail } from "../components/DestinationDetail"
import { MODE_ICON } from "../components/DestinationCard"

export function Vote() {
  const { ranked, members, castVote, clearVote, lockIn, lockedId, yourVoteCount, scored, setView } =
    useStore()
  const [openId, setOpenId] = useState<string | null>(null)
  const active = scored.find((s) => s.destination.id === openId) ?? null

  const winner = ranked[0]
  const runnerUp = ranked[1]
  const undecided = ranked.filter((r) => r.votes.you === undefined)
  const margin = winner && runnerUp ? winner.score - runnerUp.score : 0
  const totalDestinations = ranked.length

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-stone-900">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-white">
              Where are we going?
            </h1>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              Everyone gets one vote per destination. In counts double, a pass counts against.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {members.map((m) => (
                <Avatar key={m.id} member={m} size={30} title={`${m.name} · ${formatMoney(m.budget)} budget`} />
              ))}
            </div>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              {members.length} voting
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Summary
            icon={<Trophy size={14} />}
            label="Leading"
            value={winner ? winner.destination.name : "—"}
            hint={winner ? `${consensusPct(winner.score, Object.keys(winner.votes).length)}% consensus` : ""}
          />
          <Summary
            icon={<Crown size={14} />}
            label="Margin"
            value={margin > 0 ? `+${margin} points` : "Dead heat"}
            hint={runnerUp ? `over ${runnerUp.destination.name}` : ""}
          />
          <Summary
            icon={<Users size={14} />}
            label="Your ballot"
            value={`${yourVoteCount} / ${totalDestinations}`}
            hint={undecided.length ? `${undecided.length} left to call` : "All done"}
          />
        </div>

        {undecided.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-400/10 dark:text-amber-200">
            <span>You still haven't voted on</span>
            {undecided.slice(0, 3).map((r) => (
              <button
                key={r.destination.id}
                type="button"
                onClick={() => setOpenId(r.destination.id)}
                className="rounded-full bg-amber-200/70 px-2 py-0.5 text-xs font-medium underline-offset-2 hover:underline dark:bg-amber-400/20"
              >
                {r.destination.name}
              </button>
            ))}
            {undecided.length > 3 ? <span>+{undecided.length - 3} more</span> : null}
          </div>
        ) : null}
      </section>

      <ol className="space-y-3">
        {ranked.map((item, i) => (
          <VoteRow
            key={item.destination.id}
            item={item}
            rank={i + 1}
            locked={lockedId === item.destination.id}
            onOpen={() => setOpenId(item.destination.id)}
            onVote={(v) => (item.votes.you === v ? clearVote(item.destination.id) : castVote(item.destination.id, v))}
            onLock={() => {
              lockIn(item.destination.id)
              setView("plan")
            }}
          />
        ))}
      </ol>

      <DestinationDetail item={active} onClose={() => setOpenId(null)} />
    </div>
  )
}

function VoteRow({
  item,
  rank,
  locked,
  onOpen,
  onVote,
  onLock,
}: {
  item: Scored
  rank: number
  locked: boolean
  onOpen: () => void
  onVote: (v: "in" | "maybe" | "out") => void
  onLock: () => void
}) {
  const { members } = useStore()
  const d = item.destination
  const pct = consensusPct(item.score, Object.keys(item.votes).length)
  const ModeIcon = MODE_ICON[item.travel.mode]

  return (
    <li
      className={cx(
        "animate-rise flex flex-col gap-4 rounded-3xl border bg-white p-4 shadow-sm transition-colors sm:flex-row sm:items-center dark:bg-stone-900",
        locked ? "border-teal-500 ring-2 ring-teal-500/20" : "border-stone-200 dark:border-white/10",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span
          className={cx(
            "grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-semibold",
            rank === 1
              ? "bg-amber-400 text-amber-950"
              : "bg-stone-100 text-stone-500 dark:bg-white/10 dark:text-stone-400",
          )}
        >
          {rank}
        </span>
        <button
          type="button"
          onClick={onOpen}
          className="h-12 w-16 shrink-0 overflow-hidden rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          aria-label={`Open ${d.name}`}
        >
          <Scenery destination={d} seed={3} />
        </button>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={onOpen}
            className="truncate text-left text-base font-semibold text-stone-900 underline-offset-4 hover:underline dark:text-white"
          >
            {d.name}
          </button>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-stone-500 dark:text-stone-400">
            <span className="font-medium">{formatMoney(item.cost.total)}</span>
            <span className="flex items-center gap-1">
              <ModeIcon size={11} /> {formatHours(item.travel.hours)}
            </span>
            {item.overBudgetFor.length ? (
              <span className="text-amber-600 dark:text-amber-400">
                over for {item.overBudgetFor.length}
              </span>
            ) : null}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Meter
              value={pct}
              tone={pct >= 66 ? "teal" : pct >= 40 ? "amber" : "rose"}
              className="max-w-40"
            />
            <span className="text-xs font-semibold text-stone-700 tabular-nums dark:text-stone-300">
              {pct}%
            </span>
            <div className="ml-1 flex -space-x-1.5">
              {members.map((m) => (
                <Avatar
                  key={m.id}
                  member={m}
                  size={20}
                  vote={item.votes[m.id]}
                  title={`${m.name}: ${item.votes[m.id] ?? "no vote"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-2 sm:w-64">
        <VoteButtons value={item.votes.you} size="sm" onVote={onVote} />
        <div className="flex items-center gap-2">
          <Button size="sm" variant={locked ? "secondary" : "primary"} onClick={onLock} className="flex-1">
            <Lock size={12} /> {locked ? "Locked in" : "Lock this in"}
          </Button>
          {item.votes.you ? (
            <button
              type="button"
              onClick={() => onVote(item.votes.you as "in")}
              aria-label="Clear your vote"
              title="Clear your vote"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <RotateCcw size={13} />
            </button>
          ) : null}
        </div>
      </div>
    </li>
  )
}

function Summary({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-2xl bg-stone-100 px-4 py-3 dark:bg-white/5">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500 dark:text-stone-400">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 truncate text-base font-semibold text-stone-900 dark:text-white">
        {value}
      </div>
      {hint ? <div className="truncate text-xs text-stone-500 dark:text-stone-400">{hint}</div> : null}
    </div>
  )
}
