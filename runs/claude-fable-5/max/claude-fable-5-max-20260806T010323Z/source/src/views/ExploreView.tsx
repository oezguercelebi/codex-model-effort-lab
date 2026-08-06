import { useMemo, useState } from "react"
import {
  ArrowLeftRight,
  CalendarDays,
  Check,
  Crown,
  MapPin,
  SearchX,
  Sun,
  Thermometer,
  Users,
  Vote,
  X,
} from "lucide-react"
import { DESTINATIONS, TRIP } from "../data"
import type { Destination, Standing, Vibe } from "../types"
import {
  bestTravel,
  budgetTotal,
  cx,
  duration,
  euro,
  tripCountdown,
  votingCountdown,
} from "../utils"
import { DestinationArt } from "../components/Art"
import { AvatarStack, Tag, TravelIcon, VoteHeart } from "../components/ui"

type SortKey = "votes" | "price" | "time" | "warm"

const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
  { key: "votes", label: "Group favorites" },
  { key: "price", label: "Lowest cost" },
  { key: "time", label: "Quickest to reach" },
  { key: "warm", label: "Warmest" },
]

export function ExploreView({
  standings,
  leaderIds,
  yourVotes,
  compareMode,
  compareIds,
  onToggleVote,
  onOpenDetail,
  onToggleCompareMode,
  onToggleCompare,
  onOpenCompare,
}: {
  standings: Standing[]
  leaderIds: string[]
  yourVotes: string[]
  compareMode: boolean
  compareIds: string[]
  onToggleVote: (id: string) => void
  onOpenDetail: (id: string) => void
  onToggleCompareMode: () => void
  onToggleCompare: (id: string) => void
  onOpenCompare: () => void
}) {
  const [sort, setSort] = useState<SortKey>("votes")
  const [vibe, setVibe] = useState<Vibe | "All">("All")

  const voteCounts = useMemo(() => {
    const map = new Map<string, Standing>()
    for (const s of standings) map.set(s.destination.id, s)
    return map
  }, [standings])

  const vibes = useMemo(() => {
    const set = new Set<Vibe>()
    for (const d of DESTINATIONS) for (const v of d.vibes) set.add(v)
    return [...set]
  }, [])

  const visible = useMemo(() => {
    const filtered = DESTINATIONS.filter((d) => vibe === "All" || d.vibes.includes(vibe))
    const sorted = [...filtered]
    switch (sort) {
      case "votes":
        sorted.sort(
          (a, b) => (voteCounts.get(b.id)?.count ?? 0) - (voteCounts.get(a.id)?.count ?? 0),
        )
        break
      case "price":
        sorted.sort((a, b) => budgetTotal(a.budget) - budgetTotal(b.budget))
        break
      case "time":
        sorted.sort((a, b) => bestTravel(a).durationMin - bestTravel(b).durationMin)
        break
      case "warm":
        sorted.sort((a, b) => b.tempHigh - a.tempHigh)
        break
    }
    return sorted
  }, [sort, vibe, voteCounts])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6">
      {/* Hero */}
      <section className="pt-6 sm:pt-10">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Where are we going?
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-stone-500 sm:text-base">
          Six candidates for the {TRIP.name.toLowerCase()}. Compare cost and travel time, vote for
          every place you'd be happy with, and the plan builds itself.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <HeroChip icon={<CalendarDays className="size-3.5" />}>
            {TRIP.dates} · {tripCountdown()}
          </HeroChip>
          <HeroChip icon={<MapPin className="size-3.5" />}>Leaving from {TRIP.origin}</HeroChip>
          <HeroChip icon={<Users className="size-3.5" />}>6 friends</HeroChip>
          <HeroChip icon={<Vote className="size-3.5" />} tone="amber">
            {votingCountdown()}
          </HeroChip>
        </div>
      </section>

      {/* Controls */}
      <section className="sticky top-14 z-30 -mx-4 mt-6 border-y border-stone-200/70 bg-[#faf9f7]/90 px-4 py-3 backdrop-blur sm:top-16 sm:mx-0 sm:rounded-2xl sm:border sm:px-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="scrollbar-none -my-1 flex w-full gap-1.5 overflow-x-auto py-1 sm:w-auto sm:flex-1">
            {(["All", ...vibes] as Array<Vibe | "All">).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVibe(v)}
                aria-pressed={vibe === v}
                className={cx(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  vibe === v
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:text-stone-900",
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0">
            <label className="sr-only" htmlFor="sort">
              Sort destinations
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-8 max-w-40 cursor-pointer appearance-none rounded-full border border-stone-200 bg-white pl-3 pr-7 text-xs font-medium text-stone-700 outline-none transition hover:border-stone-300 focus-visible:ring-2 focus-visible:ring-orange-500/50 sm:max-w-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2378716c' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onToggleCompareMode}
              aria-pressed={compareMode}
              className={cx(
                "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors",
                compareMode
                  ? "border-orange-600 bg-orange-600 text-white"
                  : "border-stone-200 bg-white text-stone-700 hover:border-stone-300",
              )}
            >
              <ArrowLeftRight className="size-3.5" />
              Compare
            </button>
          </div>
        </div>
      </section>

      {compareMode && (
        <p className="mt-3 text-xs font-medium text-orange-700">
          Compare mode — tap up to three destinations to line them up side by side.
        </p>
      )}

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="mt-6">
          <EmptyFilter onClear={() => setVibe("All")} />
        </div>
      ) : (
        <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {visible.map((d) => (
            <DestinationCard
              key={d.id}
              destination={d}
              standing={voteCounts.get(d.id)}
              isLeader={leaderIds.includes(d.id)}
              tied={leaderIds.length > 1}
              voted={yourVotes.includes(d.id)}
              compareMode={compareMode}
              compareSelected={compareIds.includes(d.id)}
              onToggleVote={() => onToggleVote(d.id)}
              onOpen={() => (compareMode ? onToggleCompare(d.id) : onOpenDetail(d.id))}
            />
          ))}
        </section>
      )}

      {/* Compare action bar */}
      {compareMode && (
        <div className="fixed inset-x-0 bottom-20 z-40 flex justify-center px-4 md:bottom-6">
          <div className="animate-slide-up flex items-center gap-2 rounded-full border border-stone-200 bg-white/95 p-1.5 pl-4 shadow-xl backdrop-blur">
            <span className="text-xs font-medium text-stone-600">
              {compareIds.length === 0
                ? "Pick destinations to compare"
                : `${compareIds.length} of 3 selected`}
            </span>
            <button
              type="button"
              disabled={compareIds.length < 2}
              onClick={onOpenCompare}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-stone-900 px-4 text-xs font-semibold text-white transition enabled:hover:bg-stone-700 disabled:opacity-40"
            >
              Compare
              <ArrowLeftRight className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={onToggleCompareMode}
              aria-label="Exit compare mode"
              className="inline-flex size-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function HeroChip({
  icon,
  children,
  tone = "stone",
}: {
  icon: React.ReactNode
  children: React.ReactNode
  tone?: "stone" | "amber"
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
        tone === "stone" && "border-stone-200 bg-white text-stone-600",
        tone === "amber" && "border-amber-200 bg-amber-50 text-amber-800",
      )}
    >
      {icon}
      {children}
    </span>
  )
}

function DestinationCard({
  destination: d,
  standing,
  isLeader,
  tied,
  voted,
  compareMode,
  compareSelected,
  onToggleVote,
  onOpen,
}: {
  destination: Destination
  standing?: Standing
  isLeader: boolean
  tied: boolean
  voted: boolean
  compareMode: boolean
  compareSelected: boolean
  onToggleVote: () => void
  onOpen: () => void
}) {
  const travel = bestTravel(d)
  const count = standing?.count ?? 0
  return (
    <article
      className={cx(
        "group relative overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        compareSelected ? "border-orange-600 ring-2 ring-orange-600/60" : "border-stone-200",
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-pressed={compareMode ? compareSelected : undefined}
        aria-label={
          compareMode
            ? `${compareSelected ? "Remove" : "Add"} ${d.name} ${compareSelected ? "from" : "to"} comparison`
            : `Open details for ${d.name}`
        }
        className="absolute inset-0 z-[1] cursor-pointer rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-500"
      />
      <div className="relative aspect-[16/9] overflow-hidden">
        <DestinationArt
          art={d.art}
          className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {isLeader && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-amber-700 shadow-sm backdrop-blur">
            <Crown className="size-3.5" />
            {tied ? "Tied for lead" : "Leading"}
          </span>
        )}
        <div className="absolute right-3 top-3 z-[2]">
          {compareMode ? (
            <span
              aria-hidden="true"
              className={cx(
                "flex size-8 items-center justify-center rounded-full border-2 shadow-sm transition-colors",
                compareSelected
                  ? "border-orange-600 bg-orange-600 text-white"
                  : "border-white/90 bg-white/40 backdrop-blur",
              )}
            >
              {compareSelected && <Check className="size-4" strokeWidth={3} />}
            </span>
          ) : (
            <VoteHeart active={voted} onToggle={onToggleVote} name={d.name} />
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight text-stone-900">{d.name}</h3>
          <span className="shrink-0 text-xs font-medium text-stone-400">{d.country}</span>
        </div>
        <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-stone-500">{d.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {d.vibes.slice(0, 3).map((v) => (
            <Tag key={v}>{v}</Tag>
          ))}
          {d.vibes.length > 3 && <Tag>+{d.vibes.length - 3}</Tag>}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-xs font-medium text-stone-600">
          <span className="inline-flex items-center gap-1" title="Estimated cost per person">
            <span className="text-sm font-semibold text-stone-900">
              {euro(budgetTotal(d.budget))}
            </span>
            <span className="text-stone-400">pp</span>
          </span>
          <span
            className="inline-flex items-center gap-1.5"
            title={`Fastest option: ${duration(travel.durationMin)}`}
          >
            <TravelIcon mode={travel.mode} className="size-3.5 text-stone-400" />
            {duration(travel.durationMin)}
          </span>
          <span className="inline-flex items-center gap-1" title="Typical September high">
            {d.tempHigh >= 22 ? (
              <Sun className="size-3.5 text-amber-500" />
            ) : (
              <Thermometer className="size-3.5 text-stone-400" />
            )}
            {d.tempHigh}°
          </span>
        </div>
        <div className="mt-3 flex h-6 items-center justify-between">
          {count > 0 ? (
            <>
              <AvatarStack friends={standing?.voters ?? []} />
              <span className="text-xs font-medium text-stone-500">
                {count} {count === 1 ? "vote" : "votes"}
              </span>
            </>
          ) : (
            <span className="text-xs text-stone-400">No votes yet — be the first</span>
          )}
        </div>
      </div>
    </article>
  )
}

function EmptyFilter({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-stone-300 bg-white/60 px-6 py-14 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-500">
        <SearchX className="size-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-stone-900">Nothing matches that vibe</h3>
      <p className="mt-1 max-w-xs text-sm text-stone-500">
        None of the shortlisted destinations match this filter.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-4 rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-stone-700"
      >
        Show all destinations
      </button>
    </div>
  )
}
