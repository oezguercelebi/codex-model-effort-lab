import { Meh, ThumbsDown, ThumbsUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cx } from "../lib/format"
import type { Tally, VoteValue } from "../types"

const CHOICES: { value: VoteValue; label: string; short: string; icon: LucideIcon }[] = [
  { value: "no", label: "Not this one", short: "No", icon: ThumbsDown },
  { value: "maybe", label: "Maybe", short: "Maybe", icon: Meh },
  { value: "yes", label: "Yes, let's go", short: "Yes", icon: ThumbsUp },
]

const ACTIVE: Record<VoteValue, string> = {
  yes: "bg-yes text-white shadow-soft",
  maybe: "bg-maybe text-white shadow-soft",
  no: "bg-no text-white shadow-soft",
}

export function VoteControl({
  value,
  onVote,
  size = "md",
  destinationName,
}: {
  value: VoteValue | undefined
  onVote: (value: VoteValue) => void
  size?: "sm" | "md"
  destinationName: string
}) {
  return (
    <div
      className={cx(
        "flex items-center gap-1 rounded-xl border border-line bg-surface-2 p-1",
        size === "sm" ? "" : "gap-1.5",
      )}
      role="group"
      aria-label={`Your vote for ${destinationName}`}
    >
      {CHOICES.map((choice) => {
        const active = value === choice.value
        const Icon = choice.icon
        return (
          <button
            key={choice.value}
            type="button"
            aria-pressed={active}
            aria-label={`${choice.label} — ${destinationName}`}
            title={active ? `${choice.label} (click to clear)` : choice.label}
            onClick={(event) => {
              event.stopPropagation()
              onVote(choice.value)
            }}
            className={cx(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg font-semibold transition active:scale-95",
              size === "sm" ? "h-8 px-2 text-[12px]" : "h-9 px-3 text-[13px]",
              active ? ACTIVE[choice.value] : "text-ink-faint hover:bg-surface hover:text-ink",
            )}
          >
            <Icon size={size === "sm" ? 13 : 15} aria-hidden="true" />
            <span className={size === "sm" ? "hidden xs:inline" : ""}>{choice.short}</span>
          </button>
        )
      })}
    </div>
  )
}

export function TallyBar({ tally, showPending = true }: { tally: Tally; showPending?: boolean }) {
  const total = tally.yes + tally.maybe + tally.no + (showPending ? tally.pending : 0)
  const segments = [
    { key: "yes", count: tally.yes, className: "bg-yes" },
    { key: "maybe", count: tally.maybe, className: "bg-maybe" },
    { key: "no", count: tally.no, className: "bg-no" },
    { key: "pending", count: showPending ? tally.pending : 0, className: "bg-surface-3" },
  ].filter((segment) => segment.count > 0)

  return (
    <div
      className="flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full bg-surface-3"
      role="img"
      aria-label={`${tally.yes} yes, ${tally.maybe} maybe, ${tally.no} no, ${tally.pending} still to vote`}
    >
      {segments.map((segment) => (
        <span
          key={segment.key}
          className={cx("h-full rounded-full transition-[width] duration-500", segment.className)}
          style={{ width: `${(segment.count / Math.max(1, total)) * 100}%` }}
        />
      ))}
    </div>
  )
}

export function TallySummary({ tally }: { tally: Tally }) {
  return (
    <div className="wk-tabular flex items-center gap-2.5 text-[11px] font-semibold">
      <span className="flex items-center gap-1 text-yes">
        <ThumbsUp size={12} aria-hidden="true" />
        {tally.yes}
      </span>
      <span className="flex items-center gap-1 text-maybe">
        <Meh size={12} aria-hidden="true" />
        {tally.maybe}
      </span>
      <span className="flex items-center gap-1 text-no">
        <ThumbsDown size={12} aria-hidden="true" />
        {tally.no}
      </span>
      {tally.pending > 0 ? (
        <span className="text-ink-faint">{tally.pending} to go</span>
      ) : (
        <span className="text-ink-faint">all in</span>
      )}
    </div>
  )
}
