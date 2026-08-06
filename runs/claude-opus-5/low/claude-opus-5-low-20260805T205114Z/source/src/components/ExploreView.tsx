import { RotateCcw, SlidersHorizontal } from "lucide-react"
import { useMemo, useState } from "react"
import { ALL_VIBES, VIBE_LABELS } from "../data"
import type { Ranked } from "../lib"
import { cx, fitFor, formatHours, formatMoney, totalPerPerson } from "../lib"
import type { Vibe, VoteValue } from "../types"
import { DestinationCard } from "./DestinationCard"
import { EmptyState } from "./ui"

type SortKey = "score" | "price" | "travel"

const SORTS: { key: SortKey; label: string }[] = [
  { key: "score", label: "Group favourite" },
  { key: "price", label: "Cheapest" },
  { key: "travel", label: "Closest" },
]

const DEFAULT_BUDGET = 700
const DEFAULT_HOURS = 8

export function ExploreView({
  ranked,
  myVotes,
  travelerName,
  onVote,
  onOpen,
}: {
  ranked: Ranked[]
  myVotes: Record<string, VoteValue>
  travelerName: string
  onVote: (destinationId: string, value: VoteValue) => void
  onOpen: (destinationId: string) => void
}) {
  const [sort, setSort] = useState<SortKey>("score")
  const [maxBudget, setMaxBudget] = useState(DEFAULT_BUDGET)
  const [maxHours, setMaxHours] = useState(DEFAULT_HOURS)
  const [vibes, setVibes] = useState<Vibe[]>([])
  const [worksForAll, setWorksForAll] = useState(false)

  const dirty =
    maxBudget !== DEFAULT_BUDGET ||
    maxHours !== DEFAULT_HOURS ||
    vibes.length > 0 ||
    worksForAll

  const visible = useMemo(() => {
    const filtered = ranked.filter(({ destination }) => {
      if (totalPerPerson(destination) > maxBudget) return false
      if (destination.travelHours > maxHours) return false
      if (vibes.length > 0 && !vibes.every((v) => destination.vibes.includes(v)))
        return false
      if (worksForAll && !fitFor(destination).worksForAll) return false
      return true
    })
    const sorted = [...filtered]
    if (sort === "price")
      sorted.sort((a, b) => totalPerPerson(a.destination) - totalPerPerson(b.destination))
    if (sort === "travel")
      sorted.sort((a, b) => a.destination.travelHours - b.destination.travelHours)
    return sorted
  }, [ranked, sort, maxBudget, maxHours, vibes, worksForAll])

  const reset = () => {
    setMaxBudget(DEFAULT_BUDGET)
    setMaxHours(DEFAULT_HOURS)
    setVibes([])
    setWorksForAll(false)
  }

  const toggleVibe = (vibe: Vibe) =>
    setVibes((current) =>
      current.includes(vibe) ? current.filter((v) => v !== vibe) : [...current, vibe],
    )

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-stone-900">
            <SlidersHorizontal className="h-4 w-4 text-stone-400" />
            Narrow it down
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-stone-100 p-1">
              {SORTS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setSort(option.key)}
                  aria-pressed={sort === option.key}
                  className={cx(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                    sort === option.key
                      ? "bg-white text-stone-900 shadow-sm"
                      : "text-stone-500 hover:text-stone-800",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {dirty ? (
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-stone-500 hover:bg-stone-100 hover:text-stone-900"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <div className="flex items-baseline justify-between text-xs font-medium text-stone-500">
              <span>Max spend per person</span>
              <span className="font-semibold text-stone-900">
                {maxBudget >= DEFAULT_BUDGET ? "Any" : formatMoney(maxBudget)}
              </span>
            </div>
            <input
              type="range"
              min={250}
              max={DEFAULT_BUDGET}
              step={10}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="mt-2 w-full accent-stone-900"
            />
          </label>
          <label className="block">
            <div className="flex items-baseline justify-between text-xs font-medium text-stone-500">
              <span>Max door-to-door travel</span>
              <span className="font-semibold text-stone-900">
                {maxHours >= DEFAULT_HOURS ? "Any" : formatHours(maxHours)}
              </span>
            </div>
            <input
              type="range"
              min={2}
              max={DEFAULT_HOURS}
              step={0.5}
              value={maxHours}
              onChange={(e) => setMaxHours(Number(e.target.value))}
              className="mt-2 w-full accent-stone-900"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {ALL_VIBES.map((vibe) => {
            const active = vibes.includes(vibe)
            return (
              <button
                key={vibe}
                type="button"
                onClick={() => toggleVibe(vibe)}
                aria-pressed={active}
                className={cx(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 bg-white text-stone-600 hover:border-stone-400",
                )}
              >
                {VIBE_LABELS[vibe]}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => setWorksForAll((v) => !v)}
            aria-pressed={worksForAll}
            className={cx(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              worksForAll
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:border-emerald-400",
            )}
          >
            Works for everyone
          </button>
        </div>
      </section>

      <div className="flex items-baseline justify-between">
        <p className="text-sm text-stone-500">
          {visible.length} of {ranked.length} destinations
        </p>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="Nothing matches those limits"
          body="Try raising the budget or travel time — with five people there is always a compromise somewhere."
          action={
            <button
              type="button"
              onClick={reset}
              className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map(({ destination, tally, rank }) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              tally={tally}
              rank={rank}
              myVote={myVotes[destination.id]}
              travelerName={travelerName}
              onVote={(value) => onVote(destination.id, value)}
              onOpen={() => onOpen(destination.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
