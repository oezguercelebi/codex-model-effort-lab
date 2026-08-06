import { useMemo, useState } from "react"
import {
  ArrowUpDown,
  Heart,
  Lock,
  Plane,
  SearchX,
  TrainFront,
  Wallet,
} from "lucide-react"
import {
  ALL_VIBES,
  DESTINATIONS,
  FRIENDS,
  TRIP,
  budgetTotal,
  formatDuration,
  formatEuro,
  type Destination,
  type VibeTag,
} from "../data"
import type { Voter } from "../App"
import { AvatarStack, VibePill, WeatherBadge } from "./ui"

type SortKey = "votes" | "price" | "travel"

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "votes", label: "Most votes" },
  { key: "price", label: "Lowest price" },
  { key: "travel", label: "Shortest trip" },
]

export function ExploreView({
  votesById,
  userVotes,
  locked,
  onToggleVote,
  onOpenDetail,
  onGoToResults,
}: {
  votesById: Record<string, Voter[]>
  userVotes: string[]
  locked: boolean
  onToggleVote: (id: string) => void
  onOpenDetail: (id: string) => void
  onGoToResults: () => void
}) {
  const [sort, setSort] = useState<SortKey>("votes")
  const [activeVibes, setActiveVibes] = useState<VibeTag[]>([])

  const votesLeft = TRIP.maxVotesPerPerson - userVotes.length
  const votedFriends = FRIENDS.length + (locked ? 1 : 0)

  const visible = useMemo(() => {
    const filtered = DESTINATIONS.filter(
      (d) => activeVibes.length === 0 || activeVibes.some((v) => d.vibes.includes(v)),
    )
    return filtered.sort((a, b) => {
      if (sort === "price") return budgetTotal(a.budget) - budgetTotal(b.budget)
      if (sort === "travel") return a.travel.durationMin - b.travel.durationMin
      const diff = (votesById[b.id]?.length ?? 0) - (votesById[a.id]?.length ?? 0)
      return diff !== 0 ? diff : budgetTotal(a.budget) - budgetTotal(b.budget)
    })
  }, [sort, activeVibes, votesById])

  const toggleVibe = (vibe: VibeTag) =>
    setActiveVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe],
    )

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Where are we going?
          </h1>
          <p className="mt-2 leading-relaxed text-stone-600">
            Six ideas for {TRIP.dates.toLowerCase()}, all reachable from {TRIP.origin}. Tap the
            heart on up to {TRIP.maxVotesPerPerson} favorites — {votedFriends} of{" "}
            {TRIP.groupSize} friends have voted so far.
          </p>
        </div>
        {locked ? (
          <button
            onClick={onGoToResults}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-stone-700"
          >
            <Lock className="size-4" aria-hidden />
            Votes locked — see the result
          </button>
        ) : (
          <div className="flex w-fit items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <div className="flex gap-1.5" aria-hidden>
              {Array.from({ length: TRIP.maxVotesPerPerson }, (_, i) => (
                <Heart
                  key={i}
                  className={`size-5 ${
                    i < userVotes.length
                      ? "fill-rose-500 text-rose-500"
                      : "text-amber-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm font-medium text-amber-900">
              {votesLeft === 0
                ? "All votes used — lock them in on the Results tab"
                : `${votesLeft} vote${votesLeft === 1 ? "" : "s"} left`}
            </p>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {ALL_VIBES.map((vibe) => {
            const active = activeVibes.includes(vibe)
            return (
              <button
                key={vibe}
                onClick={() => toggleVibe(vibe)}
                aria-pressed={active}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                }`}
              >
                {vibe}
              </button>
            )
          })}
          {activeVibes.length > 0 && (
            <button
              onClick={() => setActiveVibes([])}
              className="text-xs font-medium text-amber-700 underline-offset-2 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="size-4 shrink-0 text-stone-400" aria-hidden />
          <div className="flex rounded-full bg-white p-1 shadow-sm ring-1 ring-stone-200">
            {SORT_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                aria-pressed={sort === key}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  sort === key
                    ? "bg-stone-900 text-white"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
          <SearchX className="size-8 text-stone-300" aria-hidden />
          <p className="font-semibold">No destination matches those vibes</p>
          <p className="max-w-sm text-sm text-stone-500">
            Try removing a filter — or convince the group a new destination belongs on the list.
          </p>
          <button
            onClick={() => setActiveVibes([])}
            className="mt-1 rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-stone-700"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((d) => (
            <DestinationCard
              key={d.id}
              destination={d}
              voters={votesById[d.id] ?? []}
              youVoted={userVotes.includes(d.id)}
              votesLeft={votesLeft}
              locked={locked}
              onToggleVote={() => onToggleVote(d.id)}
              onOpenDetail={() => onOpenDetail(d.id)}
            />
          ))}
        </section>
      )}
    </div>
  )
}

function DestinationCard({
  destination: d,
  voters,
  youVoted,
  votesLeft,
  locked,
  onToggleVote,
  onOpenDetail,
}: {
  destination: Destination
  voters: Voter[]
  youVoted: boolean
  votesLeft: number
  locked: boolean
  onToggleVote: () => void
  onOpenDetail: () => void
}) {
  const TravelIcon = d.travel.mode === "flight" ? Plane : TrainFront
  const voteDisabled = locked || (!youVoted && votesLeft === 0)

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200/70 transition-shadow hover:shadow-md">
      <button
        onClick={onOpenDetail}
        className={`relative block h-32 w-full bg-gradient-to-br ${d.gradient} text-left`}
        aria-label={`View details for ${d.name}`}
      >
        <span className="absolute left-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-stone-700 backdrop-blur">
          {d.flag} {d.country}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-white/80 px-2.5 py-1 backdrop-blur">
          <WeatherBadge kind={d.weather.kind} tempC={d.weather.tempC} />
        </span>
        <span
          className="absolute inset-0 grid place-items-center text-5xl transition-transform duration-300 group-hover:scale-110"
          aria-hidden
        >
          {d.emoji}
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <button
            onClick={onOpenDetail}
            className="text-left text-xl font-bold tracking-tight hover:text-amber-700"
          >
            {d.name}
          </button>
          <p className="mt-1 text-sm leading-relaxed text-stone-500">{d.tagline}</p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm font-medium text-stone-700">
          <span className="inline-flex items-center gap-1.5">
            <Wallet className="size-4 text-stone-400" aria-hidden />
            {formatEuro(budgetTotal(d.budget))}
            <span className="font-normal text-stone-400">/ person</span>
          </span>
          <span className="inline-flex items-center gap-1.5" title={d.travel.detail}>
            <TravelIcon className="size-4 text-stone-400" aria-hidden />
            {formatDuration(d.travel.durationMin)}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {d.vibes.map((v) => (
            <VibePill key={v} vibe={v} />
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-3">
          <div className="flex items-center gap-2">
            {voters.length > 0 ? (
              <>
                <AvatarStack people={voters} />
                <span className="text-xs font-medium text-stone-500">
                  {voters.length} vote{voters.length === 1 ? "" : "s"}
                </span>
              </>
            ) : (
              <span className="text-xs text-stone-400">No votes yet</span>
            )}
          </div>
          <button
            onClick={onToggleVote}
            disabled={voteDisabled}
            aria-pressed={youVoted}
            title={
              locked
                ? "Voting is locked"
                : !youVoted && votesLeft === 0
                  ? "All 3 votes used — remove one first"
                  : undefined
            }
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all ${
              youVoted
                ? "bg-rose-500 text-white shadow-sm hover:bg-rose-600"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            } ${voteDisabled ? "cursor-not-allowed opacity-50" : "active:scale-95"}`}
          >
            <Heart className={`size-4 ${youVoted ? "fill-current" : ""}`} aria-hidden />
            {youVoted ? "Voted" : "Vote"}
          </button>
        </div>
      </div>
    </article>
  )
}
