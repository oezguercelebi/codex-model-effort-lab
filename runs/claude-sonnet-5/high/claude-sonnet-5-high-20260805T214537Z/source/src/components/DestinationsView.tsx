import { useMemo, useState } from "react"
import { Scale, X } from "lucide-react"
import { destinations, budgetTotal } from "../data/destinations"
import { friends } from "../data/friends"
import type { Destination, TagName } from "../types"
import { DestinationCard } from "./DestinationCard"
import { VoteChart } from "./VoteChart"

type SortKey = "votes" | "budget" | "travel"

const SORTS: { id: SortKey; label: string }[] = [
  { id: "votes", label: "Most votes" },
  { id: "budget", label: "Lowest budget" },
  { id: "travel", label: "Shortest travel" },
]

const ALL_TAGS = Array.from(new Set(destinations.flatMap((d) => d.tags))) as TagName[]

export function DestinationsView({
  votes,
  onToggleVote,
  compareIds,
  onToggleCompare,
  onViewItinerary,
  onOpenCompare,
}: {
  votes: Record<string, string[]>
  onToggleVote: (id: string) => void
  compareIds: string[]
  onToggleCompare: (id: string) => void
  onViewItinerary: (id: string) => void
  onOpenCompare: () => void
}) {
  const [sort, setSort] = useState<SortKey>("votes")
  const [activeTag, setActiveTag] = useState<TagName | null>(null)

  const voteCount = (id: string) => votes[id]?.length ?? 0
  const leaderId = useMemo(() => {
    let best: string | null = null
    let bestCount = 0
    for (const d of destinations) {
      const c = voteCount(d.id)
      if (c > bestCount) {
        bestCount = c
        best = d.id
      }
    }
    return bestCount > 0 ? best : null
  }, [votes])

  const filtered = useMemo(() => {
    let list: Destination[] = activeTag
      ? destinations.filter((d) => d.tags.includes(activeTag))
      : destinations.slice()

    list = list.sort((a, b) => {
      if (sort === "votes") return voteCount(b.id) - voteCount(a.id)
      if (sort === "budget") return budgetTotal(a.budget) - budgetTotal(b.budget)
      return a.travel.minutes - b.travel.minutes
    })
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTag, sort, votes])

  const chartRows = useMemo(
    () =>
      destinations
        .map((d) => ({ destination: d, votes: voteCount(d.id) }))
        .sort((a, b) => b.votes - a.votes),
    [votes],
  )

  return (
    <div className={`mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 ${compareIds.length > 0 ? "pb-28" : ""}`}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveTag(null)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTag === null
                    ? "bg-stone-900 text-white"
                    : "bg-white text-stone-600 ring-1 ring-inset ring-stone-200 hover:bg-stone-100"
                }`}
              >
                All
              </button>
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeTag === tag
                      ? "bg-stone-900 text-white"
                      : "bg-white text-stone-600 ring-1 ring-inset ring-stone-200 hover:bg-stone-100"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="w-full shrink-0 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 sm:w-auto"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  Sort: {s.label}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
              <p className="text-sm font-medium text-stone-600">No destinations match that filter.</p>
              <button
                onClick={() => setActiveTag(null)}
                className="mt-3 text-sm font-semibold text-teal-700 hover:text-teal-800"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((d) => {
                const voterIds = votes[d.id] ?? []
                const voters = friends.filter((f) => voterIds.includes(f.id))
                return (
                  <DestinationCard
                    key={d.id}
                    destination={d}
                    voters={voters}
                    votedByYou={voterIds.includes("you")}
                    isLeader={d.id === leaderId}
                    isComparing={compareIds.includes(d.id)}
                    compareDisabled={!compareIds.includes(d.id) && compareIds.length >= 3}
                    onToggleVote={() => onToggleVote(d.id)}
                    onToggleCompare={() => onToggleCompare(d.id)}
                    onViewItinerary={() => onViewItinerary(d.id)}
                  />
                )
              })}
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-4">
          <VoteChart rows={chartRows} />
        </aside>
      </div>

      {compareIds.length > 0 && (
        <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
          <div className="flex w-full max-w-md items-center justify-between gap-3 rounded-2xl bg-stone-900 px-4 py-3 text-white shadow-lg">
            <div className="flex items-center gap-2 text-sm">
              <Scale className="h-4 w-4" />
              <span>
                {compareIds.length} destination{compareIds.length === 1 ? "" : "s"} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenCompare}
                disabled={compareIds.length < 2}
                className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-stone-900 transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                Compare
              </button>
              <button
                onClick={() => compareIds.forEach((id) => onToggleCompare(id))}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-stone-300 hover:bg-white/10 hover:text-white"
                title="Clear selection"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
