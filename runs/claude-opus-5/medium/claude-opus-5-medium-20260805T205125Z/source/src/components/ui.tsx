import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from "react"
import { X } from "lucide-react"
import type { Member, VoteValue } from "../lib/types"

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ")
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md"
}

export function Button({
  variant = "secondary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-45 active:scale-[0.98]"
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm" }
  const variants = {
    primary:
      "bg-stone-900 text-white shadow-sm hover:bg-stone-700 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200",
    secondary:
      "border border-stone-300 bg-white text-stone-800 hover:border-stone-400 hover:bg-stone-50 dark:border-white/15 dark:bg-white/5 dark:text-stone-100 dark:hover:bg-white/10",
    ghost:
      "text-stone-600 hover:bg-stone-200/60 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-white/10 dark:hover:text-white",
    danger:
      "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300",
  }
  return <button className={cx(base, sizes[size], variants[variant], className)} {...props} />
}

export function Chip({
  active,
  children,
  onClick,
  title,
}: {
  active?: boolean
  children: ReactNode
  onClick?: () => void
  title?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={cx(
        "rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600",
        active
          ? "border-stone-900 bg-stone-900 text-white dark:border-white dark:bg-white dark:text-stone-900"
          : "border-stone-300 bg-white text-stone-600 hover:border-stone-400 hover:text-stone-900 dark:border-white/15 dark:bg-white/5 dark:text-stone-300 dark:hover:bg-white/10",
      )}
    >
      {children}
    </button>
  )
}

export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "warn" | "good" }) {
  const tones = {
    neutral: "bg-stone-100 text-stone-600 dark:bg-white/10 dark:text-stone-300",
    warn: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300",
    good: "bg-teal-100 text-teal-800 dark:bg-teal-400/15 dark:text-teal-300",
  }
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  )
}

export function Avatar({
  member,
  size = 28,
  vote,
  title,
}: {
  member: Member
  size?: number
  vote?: VoteValue
  title?: string
}) {
  const ring =
    vote === "in"
      ? "ring-2 ring-teal-500"
      : vote === "maybe"
        ? "ring-2 ring-amber-400"
        : vote === "out"
          ? "ring-2 ring-rose-400 opacity-55"
          : "ring-1 ring-stone-300 dark:ring-white/20"
  return (
    <span
      title={title ?? member.name}
      style={{ width: size, height: size, background: member.color, fontSize: size * 0.36 }}
      className={cx(
        "inline-grid shrink-0 place-items-center rounded-full font-semibold text-white select-none",
        ring,
      )}
    >
      {member.initials}
    </span>
  )
}

export function Meter({
  value,
  tone = "teal",
  className,
}: {
  value: number
  tone?: "teal" | "amber" | "rose" | "stone"
  className?: string
}) {
  const tones = {
    teal: "bg-teal-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    stone: "bg-stone-400",
  }
  return (
    <div
      className={cx(
        "h-1.5 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-white/10",
        className,
      )}
    >
      <div
        className={cx("h-full rounded-full transition-[width] duration-500 ease-out", tones[tone])}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}

export function Modal({
  open,
  onClose,
  labelledBy,
  children,
}: {
  open: boolean
  onClose: () => void
  labelledBy?: string
  children: ReactNode
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    panelRef.current?.focus()
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="animate-fade absolute inset-0 bg-stone-950/45 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className="animate-sheet relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl outline-none sm:max-w-3xl sm:rounded-3xl dark:bg-stone-900"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-stone-700 shadow-sm backdrop-blur transition-colors hover:bg-white dark:bg-stone-900/80 dark:text-stone-200 dark:hover:bg-stone-800"
        >
          <X size={17} />
        </button>
        {children}
      </div>
    </div>
  )
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: T; label: string; hint?: string }[]
  value: T
  onChange: (id: T) => void
  label?: string
}) {
  return (
    <div role="group" aria-label={label} className="flex rounded-full bg-stone-200/70 p-0.5 dark:bg-white/10">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          title={o.hint}
          onClick={() => onChange(o.id)}
          aria-pressed={value === o.id}
          className={cx(
            "flex-1 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all",
            value === o.id
              ? "bg-white text-stone-900 shadow-sm dark:bg-stone-800 dark:text-white"
              : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
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
  const options: { id: VoteValue; label: string; on: string }[] = [
    { id: "in", label: "I'm in", on: "border-teal-500 bg-teal-500 text-white" },
    { id: "maybe", label: "Maybe", on: "border-amber-500 bg-amber-500 text-white" },
    { id: "out", label: "Pass", on: "border-rose-500 bg-rose-500 text-white" },
  ]
  return (
    <div className="flex gap-1.5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onVote(o.id)}
          aria-pressed={value === o.id}
          className={cx(
            "flex-1 rounded-full border font-medium transition-all active:scale-95",
            size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm",
            value === o.id
              ? o.on
              : "border-stone-300 bg-white text-stone-600 hover:border-stone-500 hover:text-stone-900 dark:border-white/15 dark:bg-white/5 dark:text-stone-300 dark:hover:bg-white/10",
          )}
        >
          {o.label}
        </button>
      ))}
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
    <div className="col-span-full grid place-items-center rounded-3xl border border-dashed border-stone-300 bg-white/60 px-6 py-16 text-center dark:border-white/15 dark:bg-white/5">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-stone-100 text-stone-500 dark:bg-white/10 dark:text-stone-300">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-stone-900 dark:text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-stone-500 dark:text-stone-400">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
