import { ArrowUpDown, Search, X } from "lucide-react"
import type { VibeTag } from "../types"

export type SortKey = "votes" | "budget" | "time" | "name"

const SORT_LABELS: Record<SortKey, string> = {
  votes: "Most votes",
  budget: "Lowest budget",
  time: "Shortest drive",
  name: "A–Z",
}

export function FilterBar({
  allTags,
  activeTags,
  onToggleTag,
  search,
  onSearchChange,
  sortKey,
  onSortChange,
  onReset,
}: {
  allTags: VibeTag[]
  activeTags: VibeTag[]
  onToggleTag: (tag: VibeTag) => void
  search: string
  onSearchChange: (value: string) => void
  sortKey: SortKey
  onSortChange: (key: SortKey) => void
  onReset: () => void
}) {
  const hasFilters = activeTags.length > 0 || search.length > 0

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search destinations..."
            className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-9 text-sm text-stone-800 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="relative shrink-0">
          <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <select
            value={sortKey}
            onChange={(event) => onSortChange(event.target.value as SortKey)}
            className="w-full appearance-none rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-8 text-sm text-stone-700 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 sm:w-auto"
          >
            {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {allTags.map((tag) => {
          const isActive = activeTags.includes(tag)
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onToggleTag(tag)}
              aria-pressed={isActive}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "border-amber-500 bg-amber-500 text-white"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50"
              }`}
            >
              {tag}
            </button>
          )
        })}
        {hasFilters && (
          <button
            type="button"
            onClick={onReset}
            className="ml-1 flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium text-stone-500 hover:text-stone-700"
          >
            <X className="size-3.5" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
