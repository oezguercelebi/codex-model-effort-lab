import { LayoutGrid, ListChecks, Scale } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type Tab = "destinations" | "compare" | "itinerary"

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "destinations", label: "Destinations", icon: LayoutGrid },
  { id: "compare", label: "Compare", icon: Scale },
  { id: "itinerary", label: "Itinerary", icon: ListChecks },
]

export function TabNav({
  active,
  onChange,
  compareCount,
}: {
  active: Tab
  onChange: (tab: Tab) => void
  compareCount: number
}) {
  return (
    <nav className="sticky top-0 z-20 border-b border-stone-200 bg-stone-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8" role="tablist">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`relative flex shrink-0 items-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors ${
                isActive ? "text-teal-700" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={2.25} />
              {tab.label}
              {tab.id === "compare" && compareCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-600 px-1 text-[11px] font-semibold text-white">
                  {compareCount}
                </span>
              )}
              {isActive && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-teal-600" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
