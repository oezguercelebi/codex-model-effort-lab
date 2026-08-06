import { ArrowUpDown, LayoutGrid, ListFilter, Search, Table2, X } from "lucide-react"
import type { SortKey, ViewMode } from "../types"
import { cn } from "../utils/format"

interface FilterBarProps {
  search: string
  onSearchChange: (value: string) => void
  vibes: string[]
  selectedVibes: string[]
  onToggleVibe: (vibe: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
  sortKey: SortKey
  onSortChange: (key: SortKey) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "votes", label: "Most votes" },
  { value: "budget", label: "Lowest budget" },
  { value: "travel", label: "Shortest travel" },
  { value: "az", label: "A–Z" },
]

export function FilterBar({
  search,
  onSearchChange,
  vibes,
  selectedVibes,
  onToggleVibe,
  onClearFilters,
  hasActiveFilters,
  sortKey,
  onSortChange,
  viewMode,
  onViewModeChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search destinations or vibes"
            aria-label="Search destinations"
            className="w-full rounded-full border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-800 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-400" aria-hidden="true" />
            <select
              value={sortKey}
              onChange={(event) => onSortChange(event.target.value as SortKey)}
              aria-label="Sort destinations"
              className="appearance-none rounded-full border border-stone-200 bg-white py-2.5 pl-8 pr-8 text-sm font-medium text-stone-700 shadow-sm outline-none transition focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="hidden items-center gap-1 rounded-full border border-stone-200 bg-white p-1 shadow-sm sm:inline-flex">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
              className={cn(
                "rounded-full p-1.5 transition",
                viewMode === "grid" ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-900",
              )}
            >
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              aria-label="Table view"
              aria-pressed={viewMode === "table"}
              className={cn(
                "rounded-full p-1.5 transition",
                viewMode === "table" ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-900",
              )}
            >
              <Table2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-stone-400">
          <ListFilter className="h-3.5 w-3.5" aria-hidden="true" />
          Vibe
        </span>
        {vibes.map((vibe) => (
          <button
            key={vibe}
            type="button"
            onClick={() => onToggleVibe(vibe)}
            aria-pressed={selectedVibes.includes(vibe)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition",
              selectedVibes.includes(vibe)
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50",
            )}
          >
            {vibe}
          </button>
        ))}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-xs font-semibold text-stone-500 transition hover:text-stone-900"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
