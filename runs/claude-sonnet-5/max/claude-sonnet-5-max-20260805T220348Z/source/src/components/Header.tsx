import { Compass } from "lucide-react"
import type { Friend, TabKey } from "../types"
import type { TripWeekend } from "../utils/dates"
import { formatDateRange } from "../utils/dates"
import { AvatarStack } from "./AvatarStack"
import { NavTabs } from "./NavTabs"

interface HeaderProps {
  friends: Friend[]
  tripWeekend: TripWeekend
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
}

export function Header({ friends, tripWeekend, activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-stone-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-white">
              <Compass className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-base font-semibold leading-none text-stone-900">Weekender</p>
              <p className="mt-1 text-xs text-stone-500">{formatDateRange(tripWeekend.start, tripWeekend.end)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <AvatarStack friends={friends} max={5} size="sm" className="hidden sm:flex" />
            <span className="hidden text-xs font-medium text-stone-500 sm:inline">{friends.length} friends</span>
          </div>
        </div>

        <NavTabs activeTab={activeTab} onChange={onTabChange} />
      </div>
    </header>
  )
}
