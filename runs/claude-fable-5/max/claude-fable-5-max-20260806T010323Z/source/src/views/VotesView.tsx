import { Crown, Heart, Info, Vote, Wallet } from "lucide-react"
import { DESTINATIONS, FRIENDS, TRIP } from "../data"
import type { Standing } from "../types"
import { cx, votingCountdown, withYourVotes } from "../utils"
import { DestinationArt } from "../components/Art"
import { Avatar, AvatarStack, VoteMeter } from "../components/ui"

export function VotesView({
  standings,
  leaders,
  yourVotes,
  onToggleVote,
  onOpenDetail,
}: {
  standings: Standing[]
  leaders: Standing[]
  yourVotes: string[]
  onToggleVote: (id: string) => void
  onOpenDetail: (id: string) => void
}) {
  const ballots = withYourVotes(yourVotes)
  const votedCount = ballots.filter((f) => f.votes.length > 0).length
  const tied = leaders.length > 1
  const leader = leaders[0]

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-8 sm:px-6">
      <section className="pt-6 sm:pt-10">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          The vote
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-500 sm:text-base">
          Approval voting: everyone hearts every destination they'd genuinely enjoy.{" "}
          {votingCountdown()} — {votedCount} of {FRIENDS.length} have voted.
        </p>
      </section>

      {/* Leader banner */}
      {leader && (
        <section className="relative mt-6 overflow-hidden rounded-3xl border border-stone-200 shadow-sm">
          <DestinationArt art={leader.destination.art} className="h-40 w-full sm:h-48" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-amber-700 backdrop-blur">
                <Crown className="size-3.5" />
                {tied ? "Dead heat" : "Leading the vote"}
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                {tied
                  ? leaders.map((l) => l.destination.name).join(" & ")
                  : leader.destination.name}
              </h2>
              <p className="text-sm text-white/80">
                {leader.count} {leader.count === 1 ? "vote" : "votes"}
                {tied ? " each — someone has to blink" : " and counting"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenDetail(leader.destination.id)}
              className="rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-stone-900 shadow-sm backdrop-blur transition hover:bg-white"
            >
              View details
            </button>
          </div>
        </section>
      )}

      {tied && (
        <p className="mt-3 flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <Info className="mt-0.5 size-4 shrink-0" />
          {yourVotes.length === 0
            ? "It's a tie — and you haven't voted yet. Your ballot below literally decides the weekend."
            : "Still tied. Rally the group chat or adjust your votes below."}
        </p>
      )}

      {/* Standings */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight text-stone-900">Standings</h2>
        <ol className="mt-3 space-y-2">
          {standings.map((s, i) => (
            <li key={s.destination.id}>
              <button
                type="button"
                onClick={() => onOpenDetail(s.destination.id)}
                className="flex w-full items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3 text-left shadow-sm transition hover:border-stone-300 hover:shadow sm:gap-4"
              >
                <span
                  className={cx(
                    "w-5 shrink-0 text-center text-sm font-semibold tabular-nums",
                    i === 0 && s.count > 0 ? "text-amber-600" : "text-stone-400",
                  )}
                >
                  {i + 1}
                </span>
                <span className="hidden h-12 w-20 shrink-0 overflow-hidden rounded-xl sm:block">
                  <DestinationArt art={s.destination.art} className="h-full w-full" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="flex items-center gap-1.5 truncate text-sm font-semibold text-stone-900">
                      {s.destination.name}
                      {leaders.some((l) => l.destination.id === s.destination.id) &&
                        s.count > 0 && <Crown className="size-3.5 shrink-0 text-amber-500" />}
                    </span>
                    <span className="shrink-0 text-xs font-semibold tabular-nums text-stone-600">
                      {s.count} {s.count === 1 ? "vote" : "votes"}
                    </span>
                  </span>
                  <span className="mt-1.5 flex items-center gap-3">
                    <span className="flex-1">
                      <VoteMeter count={s.count} outOf={FRIENDS.length} />
                    </span>
                    <span className="hidden shrink-0 sm:block">
                      <AvatarStack friends={s.voters} />
                    </span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      {/* Your ballot */}
      <section className="mt-8 rounded-3xl border border-orange-200 bg-orange-50/60 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-stone-900">
              <Vote className="size-5 text-orange-600" />
              Your ballot
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              {yourVotes.length === 0
                ? "Tap every destination you'd be happy with — you can pick several."
                : `You've approved ${yourVotes.length} ${yourVotes.length === 1 ? "destination" : "destinations"} — you can change your mind until ${TRIP.votingDeadline}.`}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {DESTINATIONS.map((d) => {
            const active = yourVotes.includes(d.id)
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => onToggleVote(d.id)}
                aria-pressed={active}
                className={cx(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-all active:scale-95",
                  active
                    ? "border-orange-600 bg-orange-600 text-white shadow-sm"
                    : "border-stone-200 bg-white text-stone-700 hover:border-orange-300",
                )}
              >
                <Heart className="size-3.5" fill={active ? "currentColor" : "none"} />
                {d.name}
              </button>
            )
          })}
        </div>
      </section>

      {/* Everyone's ballots */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight text-stone-900">Everyone's ballots</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ballots.map((f) => (
            <div
              key={f.id}
              className={cx(
                "rounded-2xl border bg-white p-4 shadow-sm",
                f.isYou ? "border-orange-200" : "border-stone-200",
              )}
            >
              <div className="flex items-center gap-3">
                <Avatar friend={f} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                    {f.name}
                    {f.isYou && (
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-700">
                        That's you
                      </span>
                    )}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-stone-400">
                    <Wallet className="size-3" />
                    up to €{f.maxBudget} pp
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm italic leading-5 text-stone-500">“{f.comment}”</p>
              <div className="mt-3 flex flex-wrap gap-1.5 border-t border-stone-100 pt-3">
                {f.votes.length > 0 ? (
                  f.votes.map((id) => {
                    const dest = DESTINATIONS.find((d) => d.id === id)
                    if (!dest) return null
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700"
                      >
                        <Heart className="size-3 text-orange-500" fill="currentColor" />
                        {dest.name}
                      </span>
                    )
                  })
                ) : (
                  <span className="text-xs text-stone-400">
                    {f.isYou ? "No votes yet — the grid above awaits." : "Hasn't voted yet."}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
