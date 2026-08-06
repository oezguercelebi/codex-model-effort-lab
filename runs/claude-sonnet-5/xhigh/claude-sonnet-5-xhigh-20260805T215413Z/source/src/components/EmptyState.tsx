import { SearchX } from "lucide-react"

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
      <SearchX className="mb-3 size-10 text-stone-300" />
      <p className="font-semibold text-stone-700">No destinations match your filters</p>
      <p className="mt-1 text-sm text-stone-500">Try a different search term or clear your vibe filters.</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-700"
      >
        Clear filters
      </button>
    </div>
  )
}
