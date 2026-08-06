import { CheckCircle2, Crown, Heart, RotateCcw, Sparkles, Timer, X } from "lucide-react"
import {
  FRIENDS,
  TRIP,
  YOU,
  eur,
  getDestination,
  totalCost,
  type Destination,
  type Person,
} from "../data"
import DestinationArt from "./DestinationArt"
import { Avatar, AvatarStack, SectionHeading } from "./ui"

interface VotesViewProps {
  standings: Destination[]
  tally: Record<string, Person[]>
  myVotes: string[]
  votesLeft: number
  isTied: boolean
  onVote: (id: string) => void
  onReset: () => void
  onExplore: () => void
  onOpen: (id: string) => void
}

export default function VotesView({
  standings,
  tally,
  myVotes,
  votesLeft,
  isTied,
  onVote,
  onReset,
  onExplore,
  onOpen,
}: VotesViewProps) {
  const leader = standings[0]
  const runnerUp = standings[1]
  const maxVotes = Math.max(tally[leader.id].length, 1)

  return (
    <div className="space-y-8">
      <SectionHeading
        eyebrow="The vote"
        title="Two votes each. No takebacks after Friday."
        description={`Everyone picks their top ${TRIP.votesPerPerson}. If it's a tie, the cheaper weekend wins — house rules.`}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="space-y-8">
          {/* Standings */}
          <section aria-label="Current standings" className="rounded-3xl border border-stone-200/70 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-stone-900">Standings</h3>
              {isTied && runnerUp ? (
                <span className="text-xs font-medium text-stone-500">
                  Tied — {leader.name} leads on budget ({eur(totalCost(leader))} vs {eur(totalCost(runnerUp))})
                </span>
              ) : (
                <span className="text-xs font-medium text-stone-500">
                  {tally[leader.id].length - (runnerUp ? tally[runnerUp.id].length : 0)} vote
                  {tally[leader.id].length - (runnerUp ? tally[runnerUp.id].length : 0) === 1 ? "" : "s"} clear
                </span>
              )}
            </div>
            <ol className="space-y-4">
              {standings.map((dest, i) => {
                const voters = tally[dest.id]
                const isLeader = i === 0
                return (
                  <li key={dest.id}>
                    <button
                      onClick={() => onOpen(dest.id)}
                      className="group block w-full rounded-xl p-1.5 text-left transition-colors hover:bg-stone-50"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${
                            isLeader ? "bg-orange-100 text-orange-700" : "bg-stone-100 text-stone-500"
                          }`}
                        >
                          {isLeader ? <Crown className="h-3.5 w-3.5" aria-hidden /> : i + 1}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-stone-900">
                          {dest.name} <span aria-hidden>{dest.flag}</span>
                        </span>
                        <AvatarStack people={voters} size="sm" max={6} />
                        <span className="w-14 shrink-0 text-right text-sm font-semibold tabular-nums text-stone-700">
                          {voters.length} {voters.length === 1 ? "vote" : "votes"}
                        </span>
                      </div>
                      <div className="mt-2 h-2.5 w-full rounded-r-[4px] bg-stone-100">
                        <div
                          className={`h-full rounded-r-[4px] transition-all duration-500 ${
                            isLeader ? "bg-orange-500" : "bg-stone-300"
                          }`}
                          style={{ width: `${(voters.length / maxVotes) * 100}%` }}
                        />
                      </div>
                    </button>
                  </li>
                )
              })}
            </ol>
          </section>

          {/* Everyone's picks */}
          <section aria-label="Everyone's picks">
            <h3 className="mb-3 text-sm font-semibold text-stone-900">The group's ballots</h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              <BallotCardRow
                person={YOU}
                picks={myVotes}
                quip={
                  myVotes.length === 0
                    ? "Still on the fence…"
                    : myVotes.length < TRIP.votesPerPerson
                      ? "One more vote to spend."
                      : "Ballot's in — feeling good."
                }
              />
              {FRIENDS.map((f) => (
                <BallotCardRow key={f.id} person={f} picks={f.votes} quip={`“${f.quip}”`} />
              ))}
            </ul>
          </section>
        </div>

        {/* Your ballot */}
        <aside className="lg:sticky lg:top-24 lg:order-none -order-1" aria-label="Your ballot">
          <div className="rounded-3xl border border-stone-200/70 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-stone-900">Your ballot</h3>
              {myVotes.length > 0 && (
                <button
                  onClick={onReset}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden /> Start over
                </button>
              )}
            </div>

            <div className="mt-3 space-y-2.5">
              {myVotes.map((id) => {
                const dest = getDestination(id)
                return (
                  <div
                    key={id}
                    className="anim-rise flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50/60 p-2.5"
                  >
                    <span className="block h-10 w-14 shrink-0 overflow-hidden rounded-lg">
                      <DestinationArt destination={dest} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-stone-900">
                        {dest.name} <span aria-hidden>{dest.flag}</span>
                      </span>
                      <span className="block text-xs text-stone-500">{eur(totalCost(dest))} pp</span>
                    </span>
                    <button
                      onClick={() => onVote(id)}
                      aria-label={`Remove your vote for ${dest.name}`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-stone-400 transition-colors hover:bg-white hover:text-stone-700"
                    >
                      <X className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                )
              })}
              {Array.from({ length: votesLeft }).map((_, i) => (
                <button
                  key={i}
                  onClick={onExplore}
                  className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-stone-200 p-2.5 text-left transition-colors hover:border-orange-300 hover:bg-orange-50/40"
                >
                  <span className="grid h-10 w-14 shrink-0 place-items-center rounded-lg bg-stone-100">
                    <Heart className="h-4 w-4 text-stone-300" aria-hidden />
                  </span>
                  <span className="text-xs font-medium text-stone-400">
                    Open vote — tap <span className="font-semibold text-stone-500">♥ Vote</span> on a
                    destination
                  </span>
                </button>
              ))}
            </div>

            {votesLeft === 0 ? (
              <p className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-2.5 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
                Ballot in! You can change your mind until {TRIP.votingCloses}.
              </p>
            ) : (
              <p className="mt-4 flex items-center gap-2 rounded-2xl bg-stone-50 px-3 py-2.5 text-xs font-medium text-stone-500">
                <Timer className="h-4 w-4 shrink-0" aria-hidden />
                Voting closes {TRIP.votingCloses} — {votesLeft}{" "}
                {votesLeft === 1 ? "vote" : "votes"} left to spend.
              </p>
            )}
          </div>

          <p className="mt-3 flex items-start gap-2 px-2 text-xs leading-5 text-stone-400">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            Your votes can flip the race — the itinerary always follows the current leader.
          </p>
        </aside>
      </div>
    </div>
  )
}

function BallotCardRow({ person, picks, quip }: { person: Person; picks: string[]; quip: string }) {
  return (
    <li className="flex items-start gap-3 rounded-2xl border border-stone-200/70 bg-white p-4 shadow-sm">
      <Avatar person={person} size="lg" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-stone-900">
          {person.name}
          {person.isYou && <span className="ml-1.5 text-xs font-medium text-orange-600">that's you</span>}
        </p>
        <p className="mt-0.5 truncate text-xs italic text-stone-400">{quip}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {picks.length > 0 ? (
            picks.map((id) => {
              const dest = getDestination(id)
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700"
                >
                  <span aria-hidden>{dest.flag}</span> {dest.name}
                </span>
              )
            })
          ) : (
            <span className="text-xs text-stone-300">No picks yet</span>
          )}
        </div>
      </div>
    </li>
  )
}
