import { Cloud, CloudRain, CloudSun, Sun } from "lucide-react"
import type { WeatherKind } from "../data"

export function Avatar({
  initials,
  color,
  size = "md",
  ring = false,
  title,
}: {
  initials: string
  color: string
  size?: "sm" | "md" | "lg"
  ring?: boolean
  title?: string
}) {
  const sizes = {
    sm: "size-6 text-[10px]",
    md: "size-8 text-xs",
    lg: "size-10 text-sm",
  }
  return (
    <span
      title={title}
      className={`${sizes[size]} ${color} ${
        ring ? "ring-2 ring-white" : ""
      } inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold text-white`}
    >
      {initials}
    </span>
  )
}

export function AvatarStack({
  people,
  max = 5,
}: {
  people: { initials: string; color: string; name: string }[]
  max?: number
}) {
  const shown = people.slice(0, max)
  const extra = people.length - shown.length
  return (
    <span className="flex -space-x-2">
      {shown.map((p) => (
        <Avatar key={p.name} initials={p.initials} color={p.color} size="sm" ring title={p.name} />
      ))}
      {extra > 0 && (
        <span className="inline-flex size-6 items-center justify-center rounded-full bg-stone-200 text-[10px] font-semibold text-stone-600 ring-2 ring-white">
          +{extra}
        </span>
      )}
    </span>
  )
}

export function VibePill({ vibe }: { vibe: string }) {
  return (
    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
      {vibe}
    </span>
  )
}

const WEATHER_META: Record<WeatherKind, { icon: typeof Sun; label: string; className: string }> = {
  sunny: { icon: Sun, label: "Sunny", className: "text-amber-500" },
  partly: { icon: CloudSun, label: "Partly sunny", className: "text-amber-500" },
  cloudy: { icon: Cloud, label: "Cloudy", className: "text-stone-400" },
  rainy: { icon: CloudRain, label: "Showers", className: "text-sky-500" },
}

export function WeatherBadge({
  kind,
  tempC,
  className = "",
}: {
  kind: WeatherKind
  tempC: number
  className?: string
}) {
  const meta = WEATHER_META[kind]
  const Icon = meta.icon
  return (
    <span
      className={`inline-flex items-center gap-1 text-sm font-medium text-stone-700 ${className}`}
      title={meta.label}
    >
      <Icon className={`size-4 ${meta.className}`} aria-hidden />
      {tempC}°
    </span>
  )
}

export function weatherLabel(kind: WeatherKind): string {
  return WEATHER_META[kind].label
}

export function ScoreDots({ score, label }: { score: number; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1"
      role="img"
      aria-label={`${label}: ${score} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`size-1.5 rounded-full ${i <= score ? "bg-amber-500" : "bg-stone-200"}`}
        />
      ))}
    </span>
  )
}
