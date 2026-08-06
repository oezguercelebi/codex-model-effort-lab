import { Crown, Trophy } from "lucide-react"
import { DESTINATIONS, TRAVELERS } from "../data"
import type { Ranked } from "../lib"
import { MAX_SCORE, cx, formatMoney, totalPerPerson } from "../lib"
import type { VoteValue, Votes } from "../types"
import { Avatar, VoteButtons, VoteDots } from "./ui"

export function VoteView({
  ranked,
  votes,
  currentTravelerId,
  onVote,
  onOpen,
}: {
  ranked: Ranked[]
  votes: Votes
  currentTravelerId: string
  onVote: (travelerId: string, destinationId: string, value: VoteValue) => void
  onOpen: (destinationId: string) => void
}) {
  const currentTraveler =
    TRAVELERS.find((t) => t.id === currentTravelerId) ?? TRAVELERS[0]
  const myBallot = votes[currentTravelerId] ?? {}
  const myCount = Object.keys(myBallot).length
  const leader = ranked[0]
  const tied = ranked.filter((r) => r.tally.score === leader.tally.score).length > 1

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Your ballot</h2>
            <p className="text-sm text-stone-500">
              Voting as {currentTraveler.name} · {myCount} of {DESTINATIONS.length}{" "}
              destinations rated
            </p>
          </div>
          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-stone-200">
            <div
              className="h-full rounded-full bg-stone-900 transition-all duration-500"
              style={{ width: `${(myCount / DESTINATIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {ranked.map(({ destination, tally, rank }) => (
            <div
              key={destination.id}
              className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={cx(
                    "h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br",
                    destination.from,
                    destination.to,
                  )}
                />
                <button
                  type="button"
                  onClick={() => onOpen(destination.id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-sm font-semibold text-stone-900">
                    #{rank} {destination.name}
                    <span className="ml-1.5 font-normal text-stone-400">
                      {destination.country}
                    </span>
                  </p>
                  <p className="truncate text-xs text-stone-500">
                    {formatMoney(totalPerPerson(destination))} each · {tally.score} pts
                  </p>
                </button>
                <VoteDots
                  yes={tally.yes}
                  maybe={tally.maybe}
                  no={tally.no}
                  pending={TRAVELERS.length - tally.cast}
                />
                <div className="w-full sm:w-64">
                  <VoteButtons
                    value={myBallot[destination.id]}
                    onChange={(value) => onVote(currentTravelerId, destination.id, value)}
                    travelerName={currentTraveler.name}
                    destinationName={destination.name}
                    size="sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-stone-900">
            <Trophy className="h-4 w-4 text-amber-500" /> Live standings
          </h3>
          <p className="mt-1 text-xs text-stone-500">
            In = 2 points, Maybe = 1, Out = 0.
          </p>
          <ol className="mt-4 space-y-3">
            {ranked.map(({ destination, tally, rank }) => (
              <li key={destination.id}>
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="flex min-w-0 items-center gap-1.5">
                    {rank === 1 && tally.score > 0 ? (
                      <Crown className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                    ) : null}
                    <span className="truncate font-medium text-stone-800">
                      {destination.name}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-stone-500 tabular-nums">
                    {tally.score}/{MAX_SCORE}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className={cx(
                      "h-full rounded-full bg-gradient-to-r transition-all duration-500",
                      destination.from,
                      destination.to,
                    )}
                    style={{ width: `${Math.max(tally.share * 100, 2)}%` }}
                  />
                </div>
              </li>
            ))}
          </ol>
          {tied ? (
            <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
              It&apos;s a tie at the top. Someone needs to change their mind.
            </p>
          ) : null}
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-900">Who still owes votes</h3>
          <ul className="mt-4 space-y-3">
            {TRAVELERS.map((t) => {
              const cast = Object.keys(votes[t.id] ?? {}).length
              const done = cast === DESTINATIONS.length
              return (
                <li key={t.id} className="flex items-center gap-3">
                  <Avatar traveler={t} size="sm" dim={cast === 0} />
                  <span className="flex-1 text-sm font-medium text-stone-700">
                    {t.name}
                  </span>
                  <span
                    className={cx(
                      "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                      done
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-stone-100 text-stone-500",
                    )}
                  >
                    {done ? "Done" : `${cast}/${DESTINATIONS.length}`}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>
    </div>
  )
}
