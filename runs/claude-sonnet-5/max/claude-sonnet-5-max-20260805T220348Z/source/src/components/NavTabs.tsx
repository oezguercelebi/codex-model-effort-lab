import { CalendarDays, MapPin } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { TabKey } from "../types"
import { cn } from "../utils/format"

const tabs: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: "destinations", label: "Destinations", icon: MapPin },
  { key: "itinerary", label: "Itinerary", icon: CalendarDays },
]

interface NavTabsProps {
  activeTab: TabKey
  onChange: (tab: TabKey) => void
}

export function NavTabs({ activeTab, onChange }: NavTabsProps) {
  return (
    <div role="tablist" aria-label="Trip sections" className="inline-flex items-center gap-1 rounded-full bg-stone-200/60 p-1">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = tab.key === activeTab
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition sm:flex-none",
              isActive ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
