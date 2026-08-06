import { CalendarRange, Compass } from "lucide-react"

export type TabKey = "compare" | "itinerary"

const TABS: { key: TabKey; label: string; icon: typeof Compass }[] = [
  { key: "compare", label: "Compare & Vote", icon: Compass },
  { key: "itinerary", label: "Itinerary", icon: CalendarRange },
]

export function TabNav({ active, onChange }: { active: TabKey; onChange: (tab: TabKey) => void }) {
  return (
    <nav className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl gap-1 px-4 sm:px-6 lg:px-8">
        {TABS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold transition-colors sm:flex-none sm:px-6 ${
                isActive ? "text-amber-700" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Icon className="size-4" />
              {label}
              {isActive && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-amber-500" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
