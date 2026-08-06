import { Check, Circle, Minus, X } from "lucide-react"
import type { ReactNode } from "react"
import { VIBE_LABELS } from "../data"
import { cx } from "../lib"
import type { Traveler, Vibe, VoteValue } from "../types"

export function Avatar({
  traveler,
  size = "md",
  dim = false,
  ring = false,
}: {
  traveler: Traveler
  size?: "sm" | "md" | "lg"
  dim?: boolean
  ring?: boolean
}) {
  const sizes = {
    sm: "h-6 w-6 text-[10px]",
    md: "h-8 w-8 text-xs",
    lg: "h-10 w-10 text-sm",
  }
  return (
    <span
      title={traveler.name}
      className={cx(
        "inline-grid shrink-0 place-items-center rounded-full font-semibold text-white select-none",
        traveler.accent,
        sizes[size],
        dim && "opacity-30 saturate-0",
        ring && "ring-2 ring-white ring-offset-2 ring-offset-stone-900",
      )}
    >
      {traveler.initials}
    </span>
  )
}

export function VibeChip({ vibe }: { vibe: Vibe }) {
  return (
    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-600">
      {VIBE_LABELS[vibe]}
    </span>
  )
}

export function Stat({
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
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-stone-500 uppercase">
        {icon}
        {label}
      </div>
      <p className="mt-1 truncate text-sm font-semibold text-stone-900">{value}</p>
      {hint ? <p className="truncate text-xs text-stone-500">{hint}</p> : null}
    </div>
  )
}

const VOTE_STYLES: Record<
  VoteValue,
  { label: string; icon: typeof Check; active: string; idle: string }
> = {
  yes: {
    label: "In",
    icon: Check,
    active: "bg-emerald-600 text-white border-emerald-600 shadow-sm",
    idle: "border-stone-200 text-stone-600 hover:border-emerald-400 hover:text-emerald-700",
  },
  maybe: {
    label: "Maybe",
    icon: Minus,
    active: "bg-amber-500 text-white border-amber-500 shadow-sm",
    idle: "border-stone-200 text-stone-600 hover:border-amber-400 hover:text-amber-700",
  },
  no: {
    label: "Out",
    icon: X,
    active: "bg-stone-800 text-white border-stone-800 shadow-sm",
    idle: "border-stone-200 text-stone-600 hover:border-stone-500 hover:text-stone-900",
  },
}

export function VoteButtons({
  value,
  onChange,
  travelerName,
  destinationName,
  size = "md",
}: {
  value: VoteValue | undefined
  onChange: (next: VoteValue) => void
  travelerName: string
  destinationName: string
  size?: "sm" | "md"
}) {
  return (
    <div
      className="flex items-center gap-1.5"
      role="group"
      aria-label={`${travelerName}'s vote for ${destinationName}`}
    >
      {(Object.keys(VOTE_STYLES) as VoteValue[]).map((option) => {
        const style = VOTE_STYLES[option]
        const Icon = style.icon
        const active = value === option
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={cx(
              "flex flex-1 items-center justify-center gap-1 rounded-xl border font-semibold transition-all active:scale-95",
              size === "sm" ? "px-2 py-1.5 text-xs" : "px-3 py-2 text-sm",
              active ? style.active : cx("bg-white", style.idle),
            )}
          >
            <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} strokeWidth={3} />
            {style.label}
          </button>
        )
      })}
    </div>
  )
}

export function VoteDots({
  yes,
  maybe,
  no,
  pending,
}: {
  yes: number
  maybe: number
  no: number
  pending: number
}) {
  const dots: { key: string; className: string }[] = [
    ...Array.from({ length: yes }, (_, i) => ({
      key: `y${i}`,
      className: "bg-emerald-500",
    })),
    ...Array.from({ length: maybe }, (_, i) => ({
      key: `m${i}`,
      className: "bg-amber-400",
    })),
    ...Array.from({ length: no }, (_, i) => ({ key: `n${i}`, className: "bg-stone-300" })),
    ...Array.from({ length: pending }, (_, i) => ({
      key: `p${i}`,
      className: "bg-transparent ring-1 ring-stone-300 ring-inset",
    })),
  ]
  return (
    <div className="flex items-center gap-1">
      {dots.map((dot) => (
        <span key={dot.key} className={cx("h-2 w-2 rounded-full", dot.className)} />
      ))}
    </div>
  )
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-stone-300 bg-white/60 px-6 py-16 text-center">
      <Circle className="h-8 w-8 text-stone-300" strokeWidth={1.5} />
      <h3 className="mt-4 text-lg font-semibold text-stone-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-stone-500">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
