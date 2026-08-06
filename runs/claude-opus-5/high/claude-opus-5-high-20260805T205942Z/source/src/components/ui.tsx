import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react"
import { Check, X } from "lucide-react"
import { avatarStyle, clamp } from "../lib/format"
import type { Member } from "../types"

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ")
}

/* ---------------------------------------------------------------- buttons */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "quiet" | "danger"
  size?: "sm" | "md" | "lg"
  icon?: ReactNode
  full?: boolean
}

const BUTTON_VARIANTS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-brand text-onbrand hover:brightness-105 active:brightness-95 shadow-sm shadow-brand/25",
  secondary: "bg-surface text-ink border border-line hover:border-line-strong hover:bg-raised",
  ghost: "bg-sunken text-ink hover:bg-line/60",
  quiet: "text-muted hover:text-ink hover:bg-sunken",
  danger: "bg-danger-soft text-danger border border-danger/25 hover:brightness-[0.98]",
}

const BUTTON_SIZES: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-[15px] gap-2 rounded-xl",
}

export function Button({
  variant = "secondary",
  size = "md",
  icon,
  full,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cx(
        "focus-ring inline-flex shrink-0 items-center justify-center font-medium transition disabled:pointer-events-none disabled:opacity-45",
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        full && "w-full",
        className,
      )}
    >
      {icon}
      {children}
    </button>
  )
}

export function IconButton({
  label,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...rest}
      className={cx(
        "focus-ring grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-muted transition hover:border-line-strong hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  )
}

/* ------------------------------------------------------------------ chips */

export function Chip({
  active,
  onClick,
  children,
  title,
  className,
}: {
  active?: boolean
  onClick?: () => void
  children: ReactNode
  title?: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={cx(
        "focus-ring inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition",
        active
          ? "border-brand/35 bg-brand-soft text-brand-ink"
          : "border-line bg-surface text-muted hover:border-line-strong hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  )
}

type Tone = "neutral" | "brand" | "positive" | "warn" | "danger" | "accent"

const TONES: Record<Tone, string> = {
  neutral: "bg-sunken text-muted border-line",
  brand: "bg-brand-soft text-brand-ink border-brand/25",
  positive: "bg-positive-soft text-positive border-positive/25",
  warn: "bg-warn-soft text-warn border-warn/30",
  danger: "bg-danger-soft text-danger border-danger/25",
  accent: "bg-accent-soft text-accent border-accent/25",
}

export function Badge({
  tone = "neutral",
  children,
  className,
  icon,
}: {
  tone?: Tone
  children: ReactNode
  className?: string
  icon?: ReactNode
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-tight",
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}

/* ---------------------------------------------------------------- avatars */

export function Avatar({
  member,
  size = 28,
  ring,
  className,
}: {
  member: Member
  size?: number
  ring?: boolean
  className?: string
}) {
  return (
    <span
      title={member.name}
      style={{ ...avatarStyle(member.hue), width: size, height: size, fontSize: size * 0.36 }}
      className={cx(
        "grid shrink-0 place-items-center rounded-full font-bold tracking-tight select-none",
        ring && "ring-2 ring-surface",
        className,
      )}
    >
      {member.initials}
    </span>
  )
}

export function AvatarStack({
  members,
  size = 26,
  max = 5,
}: {
  members: Member[]
  size?: number
  max?: number
}) {
  const shown = members.slice(0, max)
  const rest = members.length - shown.length
  return (
    <span className="flex items-center">
      {shown.map((m, i) => (
        <Avatar key={m.id} member={m} size={size} ring className={i > 0 ? "-ml-2" : ""} />
      ))}
      {rest > 0 && (
        <span
          style={{ width: size, height: size, fontSize: size * 0.34 }}
          className="-ml-2 grid place-items-center rounded-full bg-sunken font-semibold text-muted ring-2 ring-surface"
        >
          +{rest}
        </span>
      )}
    </span>
  )
}

/* ------------------------------------------------------------- segmented */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  label,
  className,
}: {
  options: Array<{ value: T; label: ReactNode; title?: string }>
  value: T
  onChange: (value: T) => void
  size?: "sm" | "md"
  label?: string
  className?: string
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cx(
        "inline-flex items-center gap-0.5 rounded-xl border border-line bg-sunken p-0.5",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            role="tab"
            type="button"
            aria-selected={active}
            title={option.title}
            onClick={() => onChange(option.value)}
            className={cx(
              "focus-ring flex-1 rounded-[10px] font-medium whitespace-nowrap transition",
              size === "sm" ? "h-7 px-2.5 text-[12px]" : "h-9 px-3.5 text-[13px]",
              active
                ? "bg-surface text-ink shadow-sm"
                : "text-muted hover:text-ink",
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/* ---------------------------------------------------------------- inputs */

export function RangeField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
  hint,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  display: string
  hint?: string
}) {
  const id = useId()
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[13px] font-medium text-muted">
          {label}
        </label>
        <span className="tnum text-[13px] font-semibold text-ink">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="focus-ring mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-surface [&::-moz-range-thumb]:bg-brand [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-surface [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:shadow"
        style={{
          background: `linear-gradient(to right, var(--wk-brand) ${pct}%, var(--wk-line) ${pct}%)`,
        }}
      />
      {hint && <p className="mt-1.5 text-[12px] text-subtle">{hint}</p>}
    </div>
  )
}

export function Switch({
  checked,
  onChange,
  label,
  hint,
  hideLabel,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
  hint?: string
  /** Keeps the label for screen readers when the surrounding row already names it. */
  hideLabel?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={hideLabel ? label : undefined}
      onClick={() => onChange(!checked)}
      className="focus-ring flex w-full items-center justify-between gap-3 text-left"
    >
      {!hideLabel && (
        <span>
          <span className="block text-[13px] font-medium text-ink">{label}</span>
          {hint && <span className="block text-[12px] text-subtle">{hint}</span>}
        </span>
      )}
      <span
        className={cx(
          "relative h-6 w-10 shrink-0 rounded-full transition",
          checked ? "bg-brand" : "bg-line-strong",
        )}
      >
        <span
          className={cx(
            "absolute top-0.5 size-5 rounded-full bg-white shadow transition-all",
            checked ? "left-[1.125rem]" : "left-0.5",
          )}
        />
      </span>
    </button>
  )
}

/* ----------------------------------------------------------------- meters */

export function Meter({
  value,
  tone = "brand",
  className,
  height = 6,
}: {
  value: number
  tone?: Tone
  className?: string
  height?: number
}) {
  const bg: Record<Tone, string> = {
    neutral: "bg-line-strong",
    brand: "bg-brand",
    positive: "bg-positive",
    warn: "bg-warn",
    danger: "bg-danger",
    accent: "bg-accent",
  }
  return (
    <span
      className={cx("block overflow-hidden rounded-full bg-sunken", className)}
      style={{ height }}
    >
      <span
        className={cx("block h-full rounded-full transition-[width] duration-500", bg[tone])}
        style={{ width: `${clamp(value, 0, 1) * 100}%` }}
      />
    </span>
  )
}

/* ------------------------------------------------------------------ sheet */

export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
  wide,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const { overflow } = document.body.style
    document.body.style.overflow = "hidden"
    panelRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== "Tab" || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="animate-fade absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cx(
          "animate-sheet-up relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-line bg-surface shadow-2xl outline-none sm:max-h-[88vh] sm:rounded-3xl",
          wide ? "sm:max-w-5xl" : "sm:max-w-2xl",
        )}
      >
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer && (
          <div className="shrink-0 border-t border-line bg-raised/80 px-4 py-3 backdrop-blur sm:px-6">
            {footer}
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="focus-ring absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-black/35 text-white backdrop-blur transition hover:bg-black/55"
        >
          <X size={17} />
        </button>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------- toasts */

type Toast = { id: number; message: string; action?: { label: string; onClick: () => void } }

const ToastContext = createContext<(toast: Omit<Toast, "id">) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  const push = useCallback((toast: Omit<Toast, "id">) => {
    const id = ++counter.current
    setToasts((current) => [...current.slice(-2), { ...toast, id }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id))
    }, 4200)
  }, [])

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-6"
        role="status"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-pop pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-lg"
          >
            <Check size={16} className="shrink-0 text-positive" />
            <span className="flex-1 text-[13px] text-ink">{toast.message}</span>
            {toast.action && (
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick()
                  dismiss(toast.id)
                }}
                className="focus-ring shrink-0 rounded-lg px-2 py-1 text-[13px] font-semibold text-brand-ink hover:bg-brand-soft"
              >
                {toast.action.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

/* ------------------------------------------------------------ misc states */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx("skeleton rounded-xl", className)} />
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
    <div className="animate-rise grid place-items-center rounded-card border border-dashed border-line bg-surface/60 px-6 py-16 text-center">
      <div className="grid size-12 place-items-center rounded-2xl bg-sunken text-muted">{icon}</div>
      <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-muted">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function SectionHeading({
  title,
  hint,
  action,
}: {
  title: string
  hint?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-[15px] font-semibold tracking-tight text-ink">{title}</h2>
        {hint && <p className="mt-0.5 text-[12.5px] text-subtle">{hint}</p>}
      </div>
      {action}
    </div>
  )
}

/** Small label/value pair used across cards and tables. */
export function Stat({
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
    <div className="min-w-0">
      <div className="flex items-center gap-1 text-[11px] font-medium tracking-wide text-subtle uppercase">
        {icon}
        {label}
      </div>
      <div className="tnum mt-0.5 truncate text-[15px] font-semibold text-ink">{value}</div>
      {sub && <div className="truncate text-[12px] text-subtle">{sub}</div>}
    </div>
  )
}

/** Theme handling: respects the OS by default, remembers an explicit choice. */
export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light"
    const stored = window.localStorage.getItem("weekender:theme")
    if (stored === "light" || stored === "dark") return stored
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    window.localStorage.setItem("weekender:theme", theme)
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), [])
  return useMemo(() => ({ theme, toggle }), [theme, toggle])
}
