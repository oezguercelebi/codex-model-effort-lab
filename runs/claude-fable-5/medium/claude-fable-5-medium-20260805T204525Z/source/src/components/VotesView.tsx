import { Crown, MessageCircle, RotateCcw, Vote } from "lucide-react"
import { FRIENDS, TRIP, YOU, type Destination } from "../data"
import { Avatar } from "./ui"

interface Props {
  destinations: Destination[]
  tally: Map<string, number>
  myVotes: string[]
  leaderIds: string[]
  onToggleVote: (id: string) => void
  onOpenDestination: (id: string) => void
  onResetVotes: () => void
}

export function VotesView({
  destinations,
  tally,
  myVotes,
  leaderIds,
  onToggleVote,
  onOpenDestination,
  onResetVotes,
}: Props) {
  const ranked = [...destinations].sort((a, b) => (tally.get(b.id) ?? 0) - (tally.get(a.id) ?? 0))
  const maxVotes = Math.max(1, ...ranked.map((d) => tally.get(d.id) ?? 0))
  const votesLeft = TRIP.votesPerPerson - myVotes.length
  const tie = leaderIds.length > 1

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Leaderboard</h2>
            <p className="text-sm text-stone-500">
              {tie
                ? "It's a tie at the top — your votes could decide it."
                : "Everyone gets two votes. Tap a bar to revisit a destination."}
            </p>
          </div>
          <div
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${
              votesLeft > 0 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {votesLeft > 0
              ? `${votesLeft} vote${votesLeft === 1 ? "" : "s"} left`
              : "Your votes are in ✓"}
          </div>
        </div>

        <ol className="space-y-3">
          {ranked.map((d, i) => {
            const count = tally.get(d.id) ?? 0
            const isLeader = leaderIds.includes(d.id) && count > 0
            const youVoted = myVotes.includes(d.id)
            return (
              <li key={d.id}>
                <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isLeader ? "bg-amber-400 text-white" : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {isLeader ? <Crown className="size-3.5" aria-hidden /> : i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenDestination(d.id)}
                      className="flex min-w-0 items-center gap-2 text-left font-semibold text-stone-900 hover:underline"
                    >
                      <span aria-hidden>{d.emoji}</span>
                      <span className="truncate">{d.name}</span>
                    </button>
                    <span className="ml-auto shrink-0 text-sm font-bold text-stone-700">
                      {count} vote{count === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-stone-100">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${d.gradient} transition-all duration-500`}
                        style={{ width: `${(count / maxVotes) * 100}%` }}
                      />
                    </div>
                    <div className="flex -space-x-2">
                      {FRIENDS.filter((f) => f.votes.includes(d.id)).map((f) => (
                        <Avatar key={f.id} initials={f.initials} color={f.color} size="size-6" ring />
                      ))}
                      {youVoted && <Avatar initials={YOU.initials} color={YOU.color} size="size-6" ring />}
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleVote(d.id)}
                      disabled={!youVoted && votesLeft === 0}
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${
                        youVoted
                          ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
                          : votesLeft > 0
                            ? "bg-stone-900 text-white hover:bg-stone-700"
                            : "cursor-not-allowed bg-stone-100 text-stone-400"
                      }`}
                    >
                      {youVoted ? "Unvote" : "Vote"}
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>

        {myVotes.length > 0 && (
          <button
            type="button"
            onClick={onResetVotes}
            className="mt-4 flex items-center gap-1.5 text-sm font-medium text-stone-500 transition hover:text-stone-800"
          >
            <RotateCcw className="size-3.5" aria-hidden /> Reset my votes
          </button>
        )}
      </section>

      <aside className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-stone-900">
          <MessageCircle className="size-5 text-stone-400" aria-hidden /> The group
        </h2>
        {FRIENDS.map((f) => (
          <div key={f.id} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2.5">
              <Avatar initials={f.initials} color={f.color} size="size-8" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-stone-900">{f.name}</div>
                <div className="flex items-center gap-1 text-xs text-stone-500">
                  <Vote className="size-3" aria-hidden />
                  Voted{" "}
                  {f.votes
                    .map((v) => ranked.find((d) => d.id === v)?.name)
                    .filter(Boolean)
                    .join(" + ")}
                </div>
              </div>
            </div>
            <p className="mt-2.5 rounded-xl bg-stone-50 px-3 py-2 text-sm leading-6 text-stone-600">
              “{f.comment}”
            </p>
          </div>
        ))}
        <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50/60 p-4 text-sm text-stone-500">
          <span className="font-semibold text-stone-700">{YOU.name}:</span>{" "}
          {myVotes.length === 0
            ? "You haven't voted yet — the group is waiting on you!"
            : `Backing ${myVotes
                .map((v) => ranked.find((d) => d.id === v)?.name)
                .filter(Boolean)
                .join(" + ")}.`}
        </div>
      </aside>
    </div>
  )
}
