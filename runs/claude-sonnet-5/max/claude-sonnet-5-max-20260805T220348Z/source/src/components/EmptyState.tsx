import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "../utils/format"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-stone-300 bg-stone-50/60 px-6 py-16 text-center",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-200/80 text-stone-500">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <p className="text-base font-semibold text-stone-800">{title}</p>
      {description && <p className="max-w-sm text-sm text-stone-500">{description}</p>}
      {action}
    </div>
  )
}
