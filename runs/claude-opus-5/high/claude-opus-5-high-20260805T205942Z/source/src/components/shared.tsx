import {
  Bed,
  Bus,
  Camera,
  Car,
  Cloud,
  CloudRain,
  Compass,
  Landmark,
  Leaf,
  Minus,
  Moon,
  Mountain,
  Music,
  Plane,
  Sun,
  ThumbsDown,
  ThumbsUp,
  Train,
  TramFront,
  Umbrella,
  Utensils,
  Waves,
  type LucideIcon,
} from "lucide-react"
import type {
  Destination,
  ItineraryBlockKind,
  TravelMode,
  VibeId,
  VoteValue,
  Weekend,
} from "../types"
import { money, duration } from "../lib/format"
import { weatherFor, type CostBreakdown, type PricedTravel } from "../lib/trip"
import { cx } from "./ui"

export const MODE_ICON: Record<TravelMode, LucideIcon> = {
  train: Train,
  flight: Plane,
  car: Car,
  bus: Bus,
}

export const MODE_LABEL: Record<TravelMode, string> = {
  train: "Train",
  flight: "Fly",
  car: "Drive",
  bus: "Bus",
}

export const VIBE_ICON: Record<VibeId, LucideIcon> = {
  nature: Leaf,
  food: Utensils,
  nightlife: Music,
  culture: Landmark,
  chill: Moon,
  adventure: Mountain,
  beach: Waves,
}

export const KIND_ICON: Record<ItineraryBlockKind, LucideIcon> = {
  travel: TramFront,
  food: Utensils,
  sight: Camera,
  outdoors: Compass,
  nightlife: Music,
  chill: Umbrella,
}

export const KIND_TONE: Record<ItineraryBlockKind, string> = {
  travel: "bg-sunken text-muted",
  food: "bg-warn-soft text-warn",
  sight: "bg-accent-soft text-accent",
  outdoors: "bg-positive-soft text-positive",
  nightlife: "bg-brand-soft text-brand-ink",
  chill: "bg-sunken text-muted",
}

export function WeatherLine({
  destination,
  weekend,
  className,
}: {
  destination: Destination
  weekend: Weekend
  className?: string
}) {
  const weather = weatherFor(destination, weekend)
  const Icon = weather.rainChance >= 45 ? CloudRain : weather.rainChance >= 28 ? Cloud : Sun
  return (
    <span className={cx("inline-flex items-center gap-1.5 text-[12.5px]", className)}>
      <Icon size={14} className="shrink-0" />
      <span className="tnum">
        {weather.highC}° / {weather.lowC}°
      </span>
      <span className="truncate opacity-80">{weather.summary}</span>
    </span>
  )
}

const VOTE_OPTIONS: Array<{
  value: VoteValue
  label: string
  Icon: LucideIcon
  active: string
}> = [
  { value: "in", label: "In", Icon: ThumbsUp, active: "bg-positive text-white border-positive" },
  { value: "maybe", label: "Maybe", Icon: Minus, active: "bg-warn text-white border-warn" },
  { value: "out", label: "Out", Icon: ThumbsDown, active: "bg-danger text-white border-danger" },
]

export function VoteButtons({
  value,
  onVote,
  size = "md",
  labelPrefix,
}: {
  value: VoteValue | undefined
  onVote: (value: VoteValue) => void
  size?: "sm" | "md"
  labelPrefix: string
}) {
  return (
    <div className="flex items-center gap-1.5" role="group" aria-label={`${labelPrefix} vote`}>
      {VOTE_OPTIONS.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            aria-label={`${labelPrefix}: ${option.label}`}
            onClick={() => onVote(option.value)}
            className={cx(
              "focus-ring inline-flex items-center justify-center gap-1.5 rounded-lg border font-semibold transition active:scale-95",
              size === "sm" ? "h-8 flex-1 px-2 text-[12px]" : "h-9 flex-1 px-3 text-[13px]",
              active
                ? option.active
                : "border-line bg-surface text-muted hover:border-line-strong hover:text-ink",
            )}
          >
            <option.Icon size={size === "sm" ? 13 : 15} />
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

const COST_PARTS = [
  { key: "travel", label: "Travel", color: "var(--wk-brand)" },
  { key: "stay", label: "Stay", color: "var(--wk-accent)" },
  { key: "food", label: "Food", color: "var(--wk-warn)" },
  { key: "activities", label: "Doing things", color: "var(--wk-positive)" },
  { key: "local", label: "Getting around", color: "var(--wk-line-strong)" },
] as const

export function CostBar({
  cost,
  showLegend = true,
}: {
  cost: CostBreakdown
  showLegend?: boolean
}) {
  return (
    <div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-sunken">
        {COST_PARTS.map((part) => (
          <span
            key={part.key}
            title={`${part.label}: ${money(cost[part.key])}`}
            style={{
              width: `${(cost[part.key] / Math.max(1, cost.total)) * 100}%`,
              background: part.color,
            }}
          />
        ))}
      </div>
      {showLegend && (
        <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
          {COST_PARTS.map((part) => (
            <li key={part.key} className="flex items-center justify-between gap-2 text-[12.5px]">
              <span className="flex min-w-0 items-center gap-1.5 text-muted">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ background: part.color }}
                  aria-hidden="true"
                />
                <span className="truncate">{part.label}</span>
              </span>
              <span className="tnum font-medium text-ink">{money(cost[part.key])}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function TravelPicker({
  options,
  selected,
  onSelect,
  compact,
}: {
  options: PricedTravel[]
  selected: TravelMode
  onSelect: (mode: TravelMode) => void
  compact?: boolean
}) {
  return (
    <div className="grid gap-2">
      {options.map(({ option, perPerson, cars }, index) => {
        const Icon = MODE_ICON[option.mode]
        const active = option.mode === selected
        return (
          <button
            key={option.mode}
            type="button"
            onClick={() => onSelect(option.mode)}
            aria-pressed={active}
            className={cx(
              "focus-ring flex w-full items-center gap-3 rounded-xl border p-3 text-left transition",
              active
                ? "border-brand/40 bg-brand-soft/60"
                : "border-line bg-surface hover:border-line-strong",
            )}
          >
            <span
              className={cx(
                "grid size-9 shrink-0 place-items-center rounded-lg",
                active ? "bg-brand text-onbrand" : "bg-sunken text-muted",
              )}
            >
              <Icon size={17} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-[13.5px] font-semibold text-ink">
                  {MODE_LABEL[option.mode]}
                </span>
                <span className="tnum text-[12.5px] text-muted">
                  {duration(option.hours)} each way
                </span>
                {index === 0 && (
                  <span className="rounded-full bg-brand-soft px-1.5 py-0.5 text-[10.5px] font-semibold text-brand-ink">
                    We'd do this
                  </span>
                )}
              </span>
              {!compact && (
                <span className="mt-0.5 block truncate text-[12px] text-subtle">
                  {option.note}
                  {cars && cars > 1 ? ` · ${cars} cars` : ""}
                </span>
              )}
            </span>
            <span className="shrink-0 text-right">
              <span className="tnum block text-[13.5px] font-semibold text-ink">
                {money(perPerson)}
              </span>
              <span className="block text-[11px] text-subtle">
                {option.co2}kg CO₂
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function FitRing({ value, size = 44 }: { value: number; size?: number }) {
  const radius = (size - 5) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.max(0, Math.min(1, value))
  return (
    <span
      className="relative grid shrink-0 place-items-center"
      style={{ width: size, height: size }}
      title={`Group match ${Math.round(pct * 100)}%`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={4}
          className="stroke-line"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={4}
          strokeLinecap="round"
          className="stroke-brand transition-[stroke-dashoffset] duration-700"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
        />
      </svg>
      <span className="tnum absolute text-[11.5px] font-bold text-ink">
        {Math.round(pct * 100)}
      </span>
    </span>
  )
}

export function StayLine({ destination }: { destination: Destination }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12.5px] text-muted">
      <Bed size={14} className="shrink-0" />
      <span className="truncate">{destination.stay.name}</span>
      <span className="tnum shrink-0 text-subtle">★ {destination.stay.rating}</span>
    </span>
  )
}
