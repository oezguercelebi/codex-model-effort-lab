import { useEffect, useRef, type ReactNode } from "react"
import { Bus, CarFront, Heart, Plane, TrainFront, X } from "lucide-react"
import type { BudgetBreakdown, Friend, TravelMode } from "../types"
import { BUDGET_KEYS, CATEGORY_SLOTS, cx, euro } from "../utils"

const TRAVEL_ICONS = {
  flight: Plane,
  train: TrainFront,
  car: CarFront,
  bus: Bus,
} as const

export const TRAVEL_LABELS: Record<TravelMode, string> = {
  flight: "Flight",
  train: "Train",
  car: "Car pool",
  bus: "Bus",
}

export function TravelIcon({ mode, className }: { mode: TravelMode; className?: string }) {
  const Icon = TRAVEL_ICONS[mode]
  return <Icon className={className ?? "size-4"} aria-hidden="true" />
}

export function Tag({ children, tone = "stone" }: { children: ReactNode; tone?: "stone" | "amber" }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tone === "stone" && "border-stone-200 bg-stone-50 text-stone-600",
        tone === "amber" && "border-amber-200 bg-amber-50 text-amber-800",
      )}
    >
      {children}
    </span>
  )
}

export function Avatar({
  friend,
  size = "md",
  ringClass = "ring-white",
}: {
  friend: Friend
  size?: "sm" | "md" | "lg"
  ringClass?: string
}) {
  const sizeClass =
    size === "sm" ? "size-6 text-[10px]" : size === "md" ? "size-8 text-xs" : "size-10 text-sm"
  return (
    <span
      title={friend.name}
      style={{ backgroundColor: friend.color }}
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-2",
        sizeClass,
        ringClass,
      )}
    >
      {friend.isYou ? "You"[0] : friend.name[0]}
    </span>
  )
}

export function AvatarStack({
  friends,
  size = "sm",
  ringClass,
  max = 6,
}: {
  friends: Friend[]
  size?: "sm" | "md"
  ringClass?: string
  max?: number
}) {
  const shown = friends.slice(0, max)
  const extra = friends.length - shown.length
  return (
    <span className="flex -space-x-1.5">
      {shown.map((f) => (
        <Avatar key={f.id} friend={f} size={size} ringClass={ringClass} />
      ))}
      {extra > 0 && (
        <span
          className={cx(
            "inline-flex items-center justify-center rounded-full bg-stone-200 font-semibold text-stone-600 ring-2 ring-white",
            size === "sm" ? "size-6 text-[10px]" : "size-8 text-xs",
          )}
        >
          +{extra}
        </span>
      )}
    </span>
  )
}

export function StatTile({
  label,
  value,
  sub,
  icon,
}: {
  label: string
  value: ReactNode
  sub?: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-3.5">
      <div className="flex items-center gap-1.5 text-xs font-medium text-stone-500">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold tracking-tight text-stone-900">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-stone-500">{sub}</div>}
    </div>
  )
}

/** Single-series vote meter: accent fill on a lighter track of the same ramp. */
export function VoteMeter({ count, outOf }: { count: number; outOf: number }) {
  const pct = outOf === 0 ? 0 : Math.round((count / outOf) * 100)
  return (
    <div
      role="meter"
      aria-valuenow={count}
      aria-valuemin={0}
      aria-valuemax={outOf}
      aria-label={`${count} of ${outOf} votes`}
      className="h-2.5 w-full overflow-hidden rounded-full bg-orange-100"
    >
      <div
        className="h-full rounded-r-[4px] bg-orange-600 transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

/**
 * Stacked per-person budget bar. Segments use the validated categorical slots,
 * separated by 2px surface gaps; the data end carries the 4px rounding.
 */
export function BudgetStack({ budget, className }: { budget: BudgetBreakdown; className?: string }) {
  const total = BUDGET_KEYS.reduce((sum, k) => sum + budget[k], 0)
  return (
    <div className={cx("flex h-3 w-full gap-[2px]", className)} aria-hidden="true">
      {BUDGET_KEYS.map((key, i) => (
        <div
          key={key}
          style={{
            width: `${(budget[key] / total) * 100}%`,
            backgroundColor: CATEGORY_SLOTS[key].color,
          }}
          className={cx(i === BUDGET_KEYS.length - 1 && "rounded-r-[4px]")}
        />
      ))}
    </div>
  )
}

/** Legend with values — every segment is directly readable, not color-alone. */
export function BudgetLegend({
  budget,
  compact = false,
}: {
  budget: BudgetBreakdown
  compact?: boolean
}) {
  return (
    <dl className={cx("grid grid-cols-2 gap-x-4 gap-y-1.5", !compact && "sm:grid-cols-4")}>
      {BUDGET_KEYS.map((key) => (
        <div key={key} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-2.5 shrink-0 rounded-[3px]"
            style={{ backgroundColor: CATEGORY_SLOTS[key].color }}
          />
          <dt className="min-w-0 flex-1 truncate text-xs text-stone-500">
            {CATEGORY_SLOTS[key].label}
          </dt>
          <dd className="text-xs font-semibold tabular-nums text-stone-700">{euro(budget[key])}</dd>
        </div>
      ))}
    </dl>
  )
}

export function VoteHeart({
  active,
  onToggle,
  name,
}: {
  active: boolean
  onToggle: () => void
  name: string
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Remove your vote for ${name}` : `Vote for ${name}`}
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      className={cx(
        "inline-flex size-9 items-center justify-center rounded-full border shadow-sm transition-all duration-150 active:scale-90",
        active
          ? "border-orange-200 bg-orange-50 text-orange-600"
          : "border-stone-200 bg-white text-stone-400 hover:border-orange-200 hover:text-orange-500",
      )}
    >
      <Heart className="size-4.5" fill={active ? "currentColor" : "none"} strokeWidth={2} />
    </button>
  )
}

export function Modal({
  onClose,
  children,
  label,
  wide = false,
}: {
  onClose: () => void
  children: ReactNode
  label: string
  wide?: boolean
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const previous = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"
    panelRef.current?.focus()
    return () => {
      document.removeEventListener("keydown", onKey)
      document.documentElement.style.overflow = previous
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div
        className="animate-fade-in absolute inset-0 bg-stone-950/45 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cx(
          "animate-slide-up relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl outline-none sm:max-h-[86dvh] sm:rounded-3xl",
          wide ? "sm:max-w-4xl" : "sm:max-w-xl",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full bg-white/85 text-stone-600 shadow-sm backdrop-blur transition hover:bg-white hover:text-stone-900"
        >
          <X className="size-4.5" />
        </button>
        <div className="overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: ReactNode
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-stone-300 bg-white/60 px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-500">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-stone-900">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-stone-500">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
