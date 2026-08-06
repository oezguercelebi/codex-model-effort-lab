import type { ReactNode } from "react"
import { GitCompare, X } from "lucide-react"
import { consensusPct, formatHours, formatMoney } from "../lib/engine"
import { VIBE_LABELS } from "../lib/data"
import { useStore } from "../lib/store"
import type { Scored } from "../lib/types"
import { Button, Meter, Modal, cx } from "./ui"
import { Scenery } from "./Scenery"

export function CompareTray({ onOpen }: { onOpen: () => void }) {
  const { shortlist, scored, toggleShortlist, clearShortlist } = useStore()
  if (shortlist.length === 0) return null
  const items = shortlist
    .map((id) => scored.find((s) => s.destination.id === id))
    .filter((s): s is Scored => Boolean(s))

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-16 z-30 flex justify-center px-4 sm:bottom-6">
      <div className="animate-rise pointer-events-auto flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-stone-800/10 bg-stone-900 p-2.5 pl-4 text-white shadow-2xl dark:border-white/10">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
          <span className="hidden text-xs font-medium text-white/60 sm:inline">Comparing</span>
          {items.map((item) => (
            <span
              key={item.destination.id}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 py-1 pr-1 pl-2.5 text-xs font-medium"
            >
              {item.destination.name}
              <button
                type="button"
                onClick={() => toggleShortlist(item.destination.id)}
                aria-label={`Remove ${item.destination.name}`}
                className="grid h-4 w-4 place-items-center rounded-full bg-white/15 hover:bg-white/30"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={clearShortlist}
          className="hidden shrink-0 rounded-full px-2 py-1 text-xs text-white/60 hover:text-white sm:block"
        >
          Clear
        </button>
        <Button variant="primary" size="sm" onClick={onOpen} className="shrink-0 !bg-white !text-stone-900">
          <GitCompare size={13} /> Compare {items.length}
        </Button>
      </div>
    </div>
  )
}

const ROWS: {
  label: string
  render: (item: Scored) => ReactNode
  best?: (items: Scored[]) => string | null
}[] = [
  {
    label: "Per person",
    render: (i) => formatMoney(i.cost.total),
    best: (items) => items.reduce((a, b) => (a.cost.total <= b.cost.total ? a : b)).destination.id,
  },
  {
    label: "Travel each way",
    render: (i) => `${formatHours(i.travel.hours)} · ${i.travel.mode}`,
    best: (items) => items.reduce((a, b) => (a.travel.hours <= b.travel.hours ? a : b)).destination.id,
  },
  {
    label: "Group score",
    render: (i) => `${consensusPct(i.score, Object.keys(i.votes).length)}%`,
    best: (items) => items.reduce((a, b) => (a.score >= b.score ? a : b)).destination.id,
  },
  {
    label: "Over budget for",
    render: (i) => (i.overBudgetFor.length ? `${i.overBudgetFor.length} people` : "nobody"),
    best: (items) =>
      items.reduce((a, b) => (a.overBudgetFor.length <= b.overBudgetFor.length ? a : b)).destination.id,
  },
  {
    label: "Walkability",
    render: (i) => `${i.destination.easeScore}/100`,
    best: (items) =>
      items.reduce((a, b) => (a.destination.easeScore >= b.destination.easeScore ? a : b)).destination.id,
  },
  { label: "Weather", render: (i) => `${i.destination.weather.highC}° · ${i.destination.weather.rainChance}% rain` },
  { label: "Vibes", render: (i) => i.destination.vibes.map((v) => VIBE_LABELS[v]).join(", ") },
  { label: "Watch out", render: (i) => i.destination.watchOut },
]

export function CompareModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { shortlist, scored, castVote } = useStore()
  const items = shortlist
    .map((id) => scored.find((s) => s.destination.id === id))
    .filter((s): s is Scored => Boolean(s))

  if (!open || items.length === 0) return null

  return (
    <Modal open={open} onClose={onClose} labelledBy="compare-title">
      <div className="border-b border-stone-200 p-5 pr-16 dark:border-white/10">
        <h2 id="compare-title" className="text-xl font-semibold text-stone-900 dark:text-white">
          Side by side
        </h2>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Best value in each row is highlighted.
        </p>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-white dark:bg-stone-900">
            <tr>
              <th className="w-32 px-4 py-3 text-left text-xs font-medium text-stone-400" />
              {items.map((item) => (
                <th key={item.destination.id} className="px-3 pt-3 pb-2 text-left align-bottom">
                  <div className="h-14 overflow-hidden rounded-xl">
                    <Scenery destination={item.destination} seed={2} />
                  </div>
                  <div className="mt-2 text-sm font-semibold text-stone-900 dark:text-white">
                    {item.destination.name}
                  </div>
                  <div className="text-xs font-normal text-stone-500 dark:text-stone-400">
                    {item.destination.country}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => {
              const bestId = row.best?.(items) ?? null
              return (
                <tr key={row.label} className="border-t border-stone-100 dark:border-white/5">
                  <th className="px-4 py-3 text-left align-top text-xs font-medium text-stone-500 dark:text-stone-400">
                    {row.label}
                  </th>
                  {items.map((item) => (
                    <td
                      key={item.destination.id}
                      className={cx(
                        "px-3 py-3 align-top text-sm",
                        bestId === item.destination.id
                          ? "font-semibold text-teal-700 dark:text-teal-300"
                          : "text-stone-700 dark:text-stone-300",
                      )}
                    >
                      {row.render(item)}
                    </td>
                  ))}
                </tr>
              )
            })}
            <tr className="border-t border-stone-100 dark:border-white/5">
              <th className="px-4 py-3 text-left align-top text-xs font-medium text-stone-500 dark:text-stone-400">
                Consensus
              </th>
              {items.map((item) => {
                const pct = consensusPct(item.score, Object.keys(item.votes).length)
                return (
                  <td key={item.destination.id} className="px-3 py-4 align-middle">
                    <Meter value={pct} tone={pct >= 66 ? "teal" : pct >= 40 ? "amber" : "rose"} />
                  </td>
                )
              })}
            </tr>
            <tr className="border-t border-stone-100 dark:border-white/5">
              <th className="px-4 py-3 text-left align-top text-xs font-medium text-stone-500 dark:text-stone-400">
                Your vote
              </th>
              {items.map((item) => (
                <td key={item.destination.id} className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(["in", "maybe", "out"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => castVote(item.destination.id, v)}
                        className={cx(
                          "rounded-full border px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                          item.votes.you === v
                            ? "border-stone-900 bg-stone-900 text-white dark:border-white dark:bg-white dark:text-stone-900"
                            : "border-stone-300 text-stone-600 hover:border-stone-500 dark:border-white/15 dark:text-stone-300",
                        )}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  )
}
