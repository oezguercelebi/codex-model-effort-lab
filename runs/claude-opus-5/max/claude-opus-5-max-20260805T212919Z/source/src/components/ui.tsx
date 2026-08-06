import type { ButtonHTMLAttributes, ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { cx } from "../lib/format"
import type { Member } from "../types"

/* Buttons ------------------------------------------------------------- */

type Variant = "primary" | "secondary" | "ghost" | "outline"
type Size = "sm" | "md" | "lg"

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-brand text-on-brand hover:bg-brand-hover shadow-soft disabled:bg-surface-3 disabled:text-ink-faint disabled:shadow-none",
  secondary: "bg-surface-2 text-ink hover:bg-surface-3 border border-line",
  outline: "border border-line-strong text-ink hover:bg-surface-2",
  ghost: "text-ink-soft hover:bg-surface-2 hover:text-ink",
}

const SIZE: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-5 text-[15px] gap-2 rounded-xl",
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: LucideIcon
  iconRight?: LucideIcon
}

export function Button({
  variant = "secondary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cx(
        "inline-flex shrink-0 select-none items-center justify-center font-semibold transition-[background-color,color,box-shadow,transform] duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100",
        VARIANT[variant],
        SIZE[size],
        className,
      )}
    >
      {Icon ? <Icon size={size === "sm" ? 14 : 16} aria-hidden="true" /> : null}
      {children}
      {IconRight ? <IconRight size={size === "sm" ? 14 : 16} aria-hidden="true" /> : null}
    </button>
  )
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon
  label: string
  active?: boolean
}

export function IconButton({ icon: Icon, label, active, className, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...rest}
      className={cx(
        "grid size-9 place-items-center rounded-xl border transition active:scale-95",
        active
          ? "border-brand-line bg-brand-soft text-brand"
          : "border-line bg-surface text-ink-soft hover:bg-surface-2 hover:text-ink",
        className,
      )}
    >
      <Icon size={17} aria-hidden="true" />
    </button>
  )
}

/* Chips & pills ------------------------------------------------------- */

export function Chip({
  children,
  tone = "neutral",
  className,
  icon: Icon,
}: {
  children: ReactNode
  tone?: "neutral" | "brand" | "deep" | "gold" | "yes" | "no" | "outline"
  className?: string
  icon?: LucideIcon
}) {
  const tones: Record<string, string> = {
    neutral: "bg-surface-2 text-ink-soft",
    brand: "bg-brand-soft text-brand",
    deep: "bg-deep-soft text-deep",
    gold: "bg-gold-soft text-gold",
    yes: "bg-yes-soft text-yes",
    no: "bg-no-soft text-no",
    outline: "border border-line text-ink-soft",
  }
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none",
        tones[tone],
        className,
      )}
    >
      {Icon ? <Icon size={12} aria-hidden="true" /> : null}
      {children}
    </span>
  )
}

export function ToggleChip({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "rounded-full border px-3 py-1.5 text-[13px] font-semibold transition active:scale-95",
        active
          ? "border-brand bg-brand text-on-brand shadow-soft"
          : "border-line bg-surface text-ink-soft hover:border-line-strong hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  )
}

/* Segmented control --------------------------------------------------- */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  size = "md",
  className,
}: {
  options: { value: T; label: string; icon?: LucideIcon }[]
  value: T
  onChange: (value: T) => void
  label: string
  size?: "sm" | "md"
  className?: string
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cx(
        "inline-flex w-full items-center gap-1 rounded-xl border border-line bg-surface-2 p-1",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value
        const Icon = option.icon
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cx(
              "flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg font-semibold transition",
              size === "sm" ? "h-7 px-2 text-[12px]" : "h-8 px-3 text-[13px]",
              active
                ? "bg-surface text-ink shadow-soft"
                : "text-ink-faint hover:text-ink-soft",
            )}
          >
            {Icon ? <Icon size={13} aria-hidden="true" /> : null}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/* Range --------------------------------------------------------------- */

export function RangeField({
  label,
  value,
  display,
  min,
  max,
  step = 1,
  onChange,
  hint,
}: {
  label: string
  value: number
  display: string
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  hint?: string
}) {
  const progress = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-[13px] font-semibold text-ink">{label}</label>
        <span className="wk-tabular text-[13px] font-bold text-brand">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ "--range-progress": `${progress}%` } as React.CSSProperties}
        className="mt-1"
      />
      {hint ? <p className="text-[11px] leading-4 text-ink-faint">{hint}</p> : null}
    </div>
  )
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex w-full items-center justify-between gap-3 text-left"
    >
      <span className="text-[13px] font-medium text-ink-soft group-hover:text-ink">{label}</span>
      <span
        className={cx(
          "relative h-5 w-9 shrink-0 rounded-full transition",
          checked ? "bg-brand" : "bg-surface-3",
        )}
      >
        <span
          className={cx(
            "absolute top-0.5 size-4 rounded-full bg-surface shadow-sm transition-all",
            checked ? "left-4.5" : "left-0.5",
          )}
        />
      </span>
    </button>
  )
}

/* People -------------------------------------------------------------- */

export function Avatar({
  member,
  size = 32,
  dim,
  ring,
}: {
  member: Member
  size?: number
  dim?: boolean
  ring?: boolean
}) {
  return (
    <span
      className={cx(
        "grid shrink-0 place-items-center rounded-full font-bold text-white transition",
        ring && "ring-2 ring-surface",
        dim && "opacity-35 grayscale",
      )}
      style={{
        width: size,
        height: size,
        background: member.color,
        fontSize: Math.max(9, size * 0.36),
      }}
      title={member.name}
    >
      {member.initials}
    </span>
  )
}

export function AvatarStack({
  members,
  size = 28,
  max = 5,
}: {
  members: Member[]
  size?: number
  max?: number
}) {
  const shown = members.slice(0, max)
  const rest = members.length - shown.length
  return (
    <div className="flex items-center">
      {shown.map((member, index) => (
        <span key={member.id} style={{ marginLeft: index === 0 ? 0 : -size * 0.32 }}>
          <Avatar member={member} size={size} ring />
        </span>
      ))}
      {rest > 0 ? (
        <span
          className="grid place-items-center rounded-full bg-surface-3 font-bold text-ink-soft ring-2 ring-surface"
          style={{ width: size, height: size, marginLeft: -size * 0.32, fontSize: size * 0.34 }}
        >
          +{rest}
        </span>
      ) : null}
    </div>
  )
}

/* Data display -------------------------------------------------------- */

export function Meter({
  value,
  max = 100,
  className,
  color = "bg-brand",
  height = "h-1.5",
}: {
  value: number
  max?: number
  className?: string
  color?: string
  height?: string
}) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100))
  return (
    <div className={cx("w-full overflow-hidden rounded-full bg-surface-3", height, className)}>
      <div
        className={cx("h-full rounded-full transition-[width] duration-500 ease-out", color)}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function ScoreRing({
  value,
  size = 44,
  label,
}: {
  value: number
  size?: number
  label?: string
}) {
  const stroke = size >= 44 ? 4 : 3.5
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.max(0, Math.min(100, value)) / 100)
  const tone = value >= 75 ? "var(--color-yes)" : value >= 50 ? "var(--color-gold)" : "var(--color-no)"

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      title={label ?? `Match ${value}%`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-surface-3)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 600ms cubic-bezier(0.22,0.8,0.24,1)" }}
        />
      </svg>
      <span
        className="wk-tabular absolute inset-0 grid place-items-center font-bold text-ink"
        style={{ fontSize: size * 0.3 }}
      >
        {Math.round(value)}
      </span>
      <span className="sr-only">{label ?? `Match score ${Math.round(value)} out of 100`}</span>
    </div>
  )
}

export function StatBar({ label, value, max = 5 }: { label: string; value: number; max?: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 text-[11px] font-medium text-ink-faint">{label}</span>
      <div className="flex flex-1 gap-1" aria-label={`${label}: ${value} out of ${max}`}>
        {Array.from({ length: max }, (_, index) => (
          <span
            key={index}
            className={cx(
              "h-1.5 flex-1 rounded-full",
              index < value ? "bg-deep" : "bg-surface-3",
            )}
          />
        ))}
      </div>
    </div>
  )
}

/* Layout helpers ------------------------------------------------------ */

export function SectionHeading({
  title,
  subtitle,
  action,
  icon: Icon,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  icon?: LucideIcon
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-ink sm:text-[22px]">
          {Icon ? <Icon size={19} className="text-brand" aria-hidden="true" /> : null}
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 max-w-2xl text-[13px] leading-5 text-ink-soft">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  )
}

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode
  className?: string
  as?: "div" | "section" | "li" | "article"
}) {
  return (
    <Tag
      className={cx(
        "rounded-card border border-line bg-surface shadow-soft",
        className,
      )}
    >
      {children}
    </Tag>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: LucideIcon
  title: string
  body: string
  action?: ReactNode
}) {
  return (
    <div className="wk-fade-up grid place-items-center rounded-card border border-dashed border-line-strong bg-surface/60 px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-surface-2 text-ink-faint">
        <Icon size={22} aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-base font-bold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-[13px] leading-5 text-ink-soft">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx("wk-skeleton rounded-lg", className)} />
}
