import type { LucideIcon } from "lucide-react"
import { cn } from "../utils/format"

interface StatTileProps {
  icon: LucideIcon
  label: string
  value: string
  detail?: string
  className?: string
}

export function StatTile({ icon: Icon, label, value, detail, className }: StatTileProps) {
  return (
    <div className={cn("rounded-2xl border border-stone-200 bg-white p-4 shadow-sm", className)}>
      <div className="flex items-center gap-1.5 text-stone-500">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-2 text-lg font-semibold text-stone-900">{value}</p>
      {detail && <p className="mt-0.5 text-sm text-stone-500">{detail}</p>}
    </div>
  )
}
