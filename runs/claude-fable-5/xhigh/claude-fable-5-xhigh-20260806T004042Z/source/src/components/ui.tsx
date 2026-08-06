import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import type { Person } from "../data"

export function Chip({
  icon: Icon,
  children,
  className = "",
}: {
  icon?: LucideIcon
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-stone-200/80 bg-white/80 px-2.5 py-1 text-xs font-medium text-stone-600 ${className}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-stone-400" aria-hidden />}
      {children}
    </span>
  )
}

const AVATAR_SIZES = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
} as const

export function Avatar({
  person,
  size = "md",
  className = "",
}: {
  person: Person
  size?: keyof typeof AVATAR_SIZES
  className?: string
}) {
  return (
    <span
      title={person.isYou ? "You" : person.name}
      className={`grid shrink-0 place-items-center rounded-full font-semibold uppercase ring-2 ring-white ${person.color} ${AVATAR_SIZES[size]} ${className}`}
    >
      {person.isYou ? "You" : person.name.slice(0, 2)}
    </span>
  )
}

export function AvatarStack({
  people,
  size = "sm",
  max = 5,
}: {
  people: Person[]
  size?: keyof typeof AVATAR_SIZES
  max?: number
}) {
  const shown = people.slice(0, max)
  const extra = people.length - shown.length
  return (
    <span className="flex items-center -space-x-1.5">
      {shown.map((p) => (
        <Avatar key={p.id} person={p} size={size} />
      ))}
      {extra > 0 && (
        <span
          className={`grid place-items-center rounded-full bg-stone-200 font-semibold text-stone-600 ring-2 ring-white ${AVATAR_SIZES[size]}`}
        >
          +{extra}
        </span>
      )}
    </span>
  )
}

export function StatTile({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: LucideIcon
  label: string
  value: ReactNode
  sub: string
}) {
  return (
    <div className="rounded-2xl border border-stone-200/70 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-stone-500">
        <Icon className="h-4 w-4" aria-hidden />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-1.5 truncate text-2xl font-semibold tracking-tight text-stone-900">{value}</p>
      <p className="mt-0.5 truncate text-xs text-stone-500">{sub}</p>
    </div>
  )
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string; icon?: LucideIcon }[]
  value: T
  onChange: (v: T) => void
  label: string
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="inline-flex items-center gap-0.5 rounded-full bg-stone-200/60 p-1"
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
              active
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            {opt.icon && <opt.icon className="h-4 w-4" aria-hidden />}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string
  title: string
  description?: string
}) {
  return (
    <header className="max-w-2xl">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-600">{eyebrow}</p>
      )}
      <h2 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">{title}</h2>
      {description && <p className="mt-2 text-sm leading-6 text-stone-500 sm:text-base">{description}</p>}
    </header>
  )
}
