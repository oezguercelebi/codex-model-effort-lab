import { useEffect, useRef, type ReactNode } from "react"
import {
  Building2,
  Car,
  Check,
  Heart,
  Martini,
  Mountain,
  Plane,
  Sailboat,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  TrainFront,
  TreePalm,
  TreePine,
  Utensils,
  X,
} from "lucide-react"
import type { CrewMember, ItineraryKind, TravelMode, Vibe, VoteValue } from "../types"

/* --------------------------------- button -------------------------------- */

type ButtonProps = {
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost" | "dark"
  size?: "sm" | "md" | "lg"
  className?: string
  disabled?: boolean
  title?: string
  "aria-label"?: string
  type?: "button" | "submit"
}

const BUTTON_VARIANTS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-clay text-white hover:bg-clay-2 shadow-[0_1px_2px_rgb(27_23_18/0.16)] disabled:bg-line-2 disabled:text-ink-3 disabled:shadow-none",
  secondary:
    "bg-card text-ink border border-line-2 hover:border-ink-3 hover:bg-sand/50 disabled:text-ink-3 disabled:hover:border-line-2",
  ghost: "text-ink-2 hover:bg-sand hover:text-ink",
  dark: "bg-ink text-paper hover:bg-ink/90",
}

const BUTTON_SIZES: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-[13px] rounded-lg gap-1.5",
  md: "h-10 px-4 text-sm rounded-xl gap-2",
  lg: "h-12 px-6 text-[15px] rounded-xl gap-2",
}

export function Button({
  children,
  onClick,
  variant = "secondary",
  size = "md",
  className = "",
  disabled,
  title,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={rest["aria-label"]}
      className={`inline-flex shrink-0 items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100 ${BUTTON_SIZES[size]} ${BUTTON_VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

/* ---------------------------------- chip --------------------------------- */

export function Chip({
  children,
  selected = false,
  onClick,
  className = "",
}: {
  children: ReactNode
  selected?: boolean
  onClick?: () => void
  className?: string
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors duration-150"
  if (!onClick) {
    return <span className={`${base} bg-sand text-ink-2 ${className}`}>{children}</span>
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`${base} ${
        selected
          ? "bg-ink text-paper"
          : "bg-card text-ink-2 border border-line-2 hover:border-ink-3 hover:text-ink"
      } ${className}`}
    >
      {children}
    </button>
  )
}

/* --------------------------------- avatar -------------------------------- */

const AVATAR_COLORS: Record<string, string> = {
  you: "bg-ink text-paper",
  maya: "bg-clay text-white",
  devin: "bg-pine text-white",
  priya: "bg-[#6a5b96] text-white",
  jonah: "bg-[#2a6fa8] text-white",
  noor: "bg-gold text-white",
}

export function Avatar({
  member,
  size = "md",
  ring = false,
}: {
  member: CrewMember
  size?: "xs" | "sm" | "md" | "lg"
  ring?: boolean
}) {
  const sizes = {
    xs: "h-6 w-6 text-[9px]",
    sm: "h-7 w-7 text-[10px]",
    md: "h-9 w-9 text-[11px]",
    lg: "h-12 w-12 text-sm",
  }
  return (
    <span
      title={`${member.name} — ${member.role}`}
      className={`inline-grid shrink-0 place-items-center rounded-full font-semibold tracking-wide ${
        sizes[size]
      } ${AVATAR_COLORS[member.id] ?? "bg-ink-3 text-white"} ${
        ring ? "ring-2 ring-card" : ""
      }`}
    >
      {member.initials}
    </span>
  )
}

/* ---------------------------------- icons -------------------------------- */

const VIBE_ICONS: Record<Vibe, typeof Utensils> = {
  "Food & drink": Utensils,
  Nature: TreePine,
  "Big city": Building2,
  Beach: TreePalm,
  Mountains: Mountain,
  Culture: Sparkles,
  Nightlife: Martini,
  "Slow & spa": Heart,
}

export function VibeIcon({ vibe, className = "h-3.5 w-3.5" }: { vibe: Vibe; className?: string }) {
  const Icon = VIBE_ICONS[vibe]
  return <Icon className={className} strokeWidth={1.8} aria-hidden />
}

const TRAVEL_ICONS: Record<TravelMode, typeof Car> = {
  drive: Car,
  train: TrainFront,
  fly: Plane,
  ferry: Sailboat,
}

export function TravelIcon({
  mode,
  className = "h-4 w-4",
}: {
  mode: TravelMode
  className?: string
}) {
  const Icon = TRAVEL_ICONS[mode]
  return <Icon className={className} strokeWidth={1.8} aria-hidden />
}

export const TRAVEL_LABELS: Record<TravelMode, string> = {
  drive: "Drive",
  train: "Train",
  fly: "Fly",
  ferry: "Ferry",
}

export const KIND_STYLES: Record<ItineraryKind, { label: string; className: string }> = {
  travel: { label: "Travel", className: "bg-sand text-ink-2" },
  checkin: { label: "Check in", className: "bg-sand text-ink-2" },
  food: { label: "Food", className: "bg-clay-tint text-clay-2" },
  activity: { label: "Do", className: "bg-[#e8eef8] text-[#1c5cab]" },
  outdoors: { label: "Outside", className: "bg-pine-tint text-pine" },
  nightlife: { label: "Night", className: "bg-[#efeaf7] text-[#4a3aa7]" },
  rest: { label: "Slow", className: "bg-gold-tint text-gold" },
}

/* --------------------------------- votes --------------------------------- */

export const VOTE_META: Record<
  VoteValue,
  { label: string; short: string; icon: typeof Heart; color: string; chip: string }
> = {
  love: {
    label: "Love it",
    short: "Love",
    icon: Heart,
    color: "text-vote-love",
    chip: "bg-vote-love text-white",
  },
  yes: {
    label: "Up for it",
    short: "Yes",
    icon: ThumbsUp,
    color: "text-[#1c5cab]",
    chip: "bg-vote-yes text-[#123a6f]",
  },
  pass: {
    label: "Pass",
    short: "Pass",
    icon: ThumbsDown,
    color: "text-vote-pass",
    chip: "bg-vote-pass text-white",
  },
}

export function VoteButtons({
  value,
  onVote,
  size = "md",
}: {
  value?: VoteValue
  onVote: (v: VoteValue) => void
  size?: "sm" | "md"
}) {
  const order: VoteValue[] = ["love", "yes", "pass"]
  return (
    <div
      className="inline-flex items-center gap-1 rounded-xl bg-paper p-1"
      role="group"
      aria-label="Your vote"
    >
      {order.map((v) => {
        const meta = VOTE_META[v]
        const Icon = meta.icon
        const active = value === v
        return (
          <button
            key={v}
            type="button"
            onClick={() => onVote(v)}
            aria-pressed={active}
            aria-label={meta.label}
            title={meta.label}
            className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-all duration-150 active:scale-95 ${
              size === "sm" ? "h-8 px-2.5 text-[12px]" : "h-9 px-3 text-[13px]"
            } ${
              active
                ? v === "pass"
                  ? "bg-vote-pass text-white shadow-sm"
                  : v === "love"
                    ? "bg-vote-love text-white shadow-sm"
                    : "bg-vote-yes text-[#123a6f] shadow-sm"
                : "text-ink-2 hover:bg-card hover:text-ink"
            }`}
          >
            <Icon
              className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"}
              strokeWidth={1.9}
              fill={active && v === "love" ? "currentColor" : "none"}
            />
            <span className="hidden sm:inline">{meta.short}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ---------------------------------- bars --------------------------------- */

export function Bar({
  fraction,
  className = "",
  color = "bg-ink",
  height = "h-2",
  animate = true,
}: {
  fraction: number
  className?: string
  color?: string
  height?: string
  animate?: boolean
}) {
  const pct = Math.max(0, Math.min(1, fraction)) * 100
  return (
    <div className={`w-full overflow-hidden rounded-full bg-line ${height} ${className}`}>
      <div
        className={`h-full rounded-full ${color} ${animate ? "wk-bar" : ""}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

/* -------------------------------- sections ------------------------------- */

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-3 ${className}`}
    >
      {children}
    </p>
  )
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-2xl border border-line bg-card ${className}`}>{children}</div>
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
    <div className="wk-fade flex flex-col items-center justify-center rounded-2xl border border-dashed border-line-2 bg-card/60 px-6 py-14 text-center">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-sand text-ink-2">
        {icon}
      </div>
      <h3 className="font-display text-xl text-ink">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-ink-2">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`wk-skeleton rounded-lg ${className}`} />
}

/* --------------------------------- slider -------------------------------- */

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
  id,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  display: string
  id: string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[13px] font-medium text-ink-2">
          {label}
        </label>
        <span className="text-[13px] font-semibold tabular-nums text-ink">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ["--range-progress" as string]: `${pct}%` }}
        className="mt-1"
      />
    </div>
  )
}

/* -------------------------------- segmented ------------------------------ */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  label: string
}) {
  return (
    <div className="inline-flex rounded-xl bg-paper p-1" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={`h-8 rounded-lg px-3 text-[13px] font-medium transition-colors ${
            value === o.value ? "bg-card text-ink shadow-sm" : "text-ink-2 hover:text-ink"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

/* ---------------------------------- sheet -------------------------------- */

export function Sheet({
  open,
  onClose,
  labelledBy,
  children,
  wide = false,
}: {
  open: boolean
  onClose: () => void
  labelledBy: string
  children: ReactNode
  wide?: boolean
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const restoreRef = useRef<Element | null>(null)

  useEffect(() => {
    if (!open) return
    restoreRef.current = document.activeElement
    const { overflow } = document.body.style
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key !== "Tab" || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    const raf = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus()
    })
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = overflow
      cancelAnimationFrame(raf)
      if (restoreRef.current instanceof HTMLElement) restoreRef.current.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="wk-fade absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`wk-sheet relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-card shadow-2xl sm:max-h-[88vh] sm:rounded-3xl ${
          wide ? "sm:max-w-5xl" : "sm:max-w-2xl"
        }`}
      >
        {children}
      </div>
    </div>
  )
}

export function SheetClose({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={onClose}
      data-autofocus
      aria-label="Close"
      className="grid h-9 w-9 place-items-center rounded-full bg-card/85 text-ink shadow-sm ring-1 ring-line backdrop-blur transition-colors hover:bg-card"
    >
      <X className="h-4.5 w-4.5" strokeWidth={2} />
    </button>
  )
}

/* -------------------------------- checkbox ------------------------------- */

export function CheckItem({
  checked,
  onChange,
  title,
  detail,
}: {
  checked: boolean
  onChange: () => void
  title: string
  detail: string
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className="flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-paper"
    >
      <span
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors ${
          checked ? "border-pine bg-pine text-white" : "border-line-2 bg-card"
        }`}
      >
        {checked ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
      </span>
      <span className="min-w-0">
        <span
          className={`block text-sm font-medium ${checked ? "text-ink-3 line-through" : "text-ink"}`}
        >
          {title}
        </span>
        <span className="mt-0.5 block text-[13px] leading-5 text-ink-3">{detail}</span>
      </span>
    </button>
  )
}
