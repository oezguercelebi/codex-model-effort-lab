import { Car, Plane, TrainFront } from "lucide-react"
import type { TravelMode, Vibe } from "../data"

export function formatEuro(n: number): string {
  return `€${n.toLocaleString("en-IE")}`
}

export function formatHours(h: number): string {
  const hours = Math.floor(h)
  const mins = Math.round((h - hours) * 60)
  if (mins === 0) return `${hours} h`
  return `${hours} h ${mins.toString().padStart(2, "0")}`
}

export function TravelModeIcon({ mode, className }: { mode: TravelMode; className?: string }) {
  const cls = className ?? "size-4"
  if (mode === "train") return <TrainFront className={cls} aria-label="Train" />
  if (mode === "flight") return <Plane className={cls} aria-label="Flight" />
  return <Car className={cls} aria-label="Car" />
}

const VIBE_STYLES: Record<Vibe, string> = {
  Culture: "bg-violet-100 text-violet-700",
  Nightlife: "bg-fuchsia-100 text-fuchsia-700",
  Nature: "bg-emerald-100 text-emerald-700",
  Food: "bg-orange-100 text-orange-700",
  Beach: "bg-sky-100 text-sky-700",
  Wellness: "bg-teal-100 text-teal-700",
}

export function VibeTag({ vibe }: { vibe: Vibe }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${VIBE_STYLES[vibe]}`}>
      {vibe}
    </span>
  )
}

export function Avatar({
  initials,
  color,
  size = "size-7",
  ring = false,
}: {
  initials: string
  color: string
  size?: string
  ring?: boolean
}) {
  return (
    <span
      className={`inline-flex ${size} items-center justify-center rounded-full ${color} text-[10px] font-bold text-white ${
        ring ? "ring-2 ring-white" : ""
      }`}
    >
      {initials}
    </span>
  )
}

export const BUDGET_SEGMENTS = [
  { key: "travel", label: "Travel", color: "bg-amber-400" },
  { key: "stay", label: "Stay", color: "bg-sky-400" },
  { key: "food", label: "Food", color: "bg-rose-400" },
  { key: "activities", label: "Activities", color: "bg-emerald-400" },
] as const
