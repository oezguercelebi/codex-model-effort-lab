import { CalendarDays, Crown, Rabbit, PiggyBank, Ticket, Trophy, Wallet } from "lucide-react"
import {
  CHEAPEST_ID,
  DESTINATIONS,
  FASTEST_ID,
  FRIENDS,
  TRIP,
  eur,
  totalCost,
  type Destination,
  type Person,
} from "../data"
import DestinationArt from "./DestinationArt"
import VoteButton from "./VoteButton"
import { AvatarStack, Chip, StatTile } from "./ui"

interface ExploreViewProps {
  tally: Record<string, Person[]>
  myVotes: string[]
  votesLeft: number
  leader: Destination
  isTied: boolean
  daysToGo: number
  onVote: (id: string) => void
  onOpen: (id: string) => void
}

export default function ExploreView({
  tally,
  myVotes,
  votesLeft,
  leader,
  isTied,
  daysToGo,
  onVote,
  onOpen,
}: ExploreViewProps) {
  const totals = DESTINATIONS.map(totalCost)
  const minTotal = Math.min(...totals)
  const maxTotal = Math.max(...totals)
  const votesCast = FRIENDS.length * TRIP.votesPerPerson + myVotes.length
  const votesPossible = TRIP.travelers * TRIP.votesPerPerson

  return (
    <div className="space-y-8">
      <section className="pt-2 sm:pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-600">
          {TRIP.title} · {TRIP.dateLabel}
        </p>
        <h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          One weekend, six friends. Where are we going?
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500 sm:text-base sm:leading-7">
          Compare the shortlist, spend your {TRIP.votesPerPerson} votes, and Weekender turns the
          winner into a ready-made plan. Prices are per person for {TRIP.nights} nights, leaving
          from {TRIP.origin}.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Trip overview">
        <StatTile
          icon={CalendarDays}
          label="Days to go"
          value={daysToGo > 0 ? daysToGo : "Go!"}
          sub={daysToGo > 0 ? "Departing Fri, Oct 9" : "It's trip weekend"}
        />
        <StatTile
          icon={Wallet}
          label="Budget spread"
          value={`${eur(minTotal)}–${eur(maxTotal).slice(1)}`}
          sub="per person, all-in"
        />
        <StatTile
          icon={Ticket}
          label="Ballots in"
          value={`${votesCast} of ${votesPossible}`}
          sub={votesLeft > 0 ? `${votesLeft} of yours left` : "your ballot is in"}
        />
        <StatTile
          icon={Trophy}
          label="Front-runner"
          value={leader.name}
          sub={isTied ? "tied — cheaper city leads" : `${tally[leader.id].length} votes and counting`}
        />
      </section>

      <section aria-label="Destinations">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          {DESTINATIONS.map((dest, i) => (
            <li key={dest.id} className="anim-rise" style={{ animationDelay: `${i * 45}ms` }}>
              <DestinationCard
                dest={dest}
                voters={tally[dest.id]}
                voted={myVotes.includes(dest.id)}
                outOfVotes={votesLeft === 0}
                isLeader={dest.id === leader.id}
                onVote={() => onVote(dest.id)}
                onOpen={() => onOpen(dest.id)}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function DestinationCard({
  dest,
  voters,
  voted,
  outOfVotes,
  isLeader,
  onVote,
  onOpen,
}: {
  dest: Destination
  voters: Person[]
  voted: boolean
  outOfVotes: boolean
  isLeader: boolean
  onVote: () => void
  onOpen: () => void
}) {
  const TravelIcon = dest.travel.icon
  const WeatherIcon = dest.weather.icon
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ${
        voted ? "border-orange-300 ring-2 ring-orange-500/60" : "border-stone-200/70"
      }`}
    >
      <button
        onClick={onOpen}
        className="relative block aspect-[16/9] w-full overflow-hidden text-left"
        aria-label={`See details for ${dest.name}`}
      >
        <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
          <DestinationArt destination={dest} />
        </div>
        <div className="absolute left-3 top-3 flex gap-1.5">
          {isLeader && (
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-900/80 px-2.5 py-1 text-[11px] font-semibold text-amber-300 backdrop-blur">
              <Crown className="h-3 w-3" aria-hidden /> In the lead
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 flex gap-1.5">
          {dest.id === CHEAPEST_ID && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-stone-700 backdrop-blur">
              <PiggyBank className="h-3 w-3" aria-hidden /> Best value
            </span>
          )}
          {dest.id === FASTEST_ID && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-stone-700 backdrop-blur">
              <Rabbit className="h-3 w-3" aria-hidden /> Quickest hop
            </span>
          )}
        </div>
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold tracking-tight text-stone-900">
              {dest.name} <span aria-hidden>{dest.flag}</span>
            </h3>
            <p className="text-xs font-medium text-stone-400">{dest.country}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold tracking-tight text-stone-900">
              {eur(totalCost(dest))}
            </p>
            <p className="text-[11px] text-stone-400">per person</p>
          </div>
        </div>

        <p className="text-sm leading-5 text-stone-500">{dest.tagline}</p>

        <div className="flex flex-wrap gap-1.5">
          <Chip icon={TravelIcon}>{dest.travel.duration}</Chip>
          <Chip icon={WeatherIcon}>{dest.weather.tempC}° in Oct</Chip>
          {dest.tags.slice(0, 2).map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-stone-100 pt-3">
          <div className="flex min-w-0 items-center gap-2">
            {voters.length > 0 ? (
              <>
                <AvatarStack people={voters} size="sm" max={3} />
                <span className="whitespace-nowrap text-xs font-medium text-stone-500">
                  {voters.length} {voters.length === 1 ? "vote" : "votes"}
                </span>
              </>
            ) : (
              <span className="text-xs text-stone-400">No votes yet — be first</span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={onOpen}
              className="rounded-full px-3 py-2 text-xs font-semibold text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-900"
            >
              Details
            </button>
            <VoteButton voted={voted} outOfVotes={outOfVotes} onToggle={onVote} />
          </div>
        </div>
      </div>
    </article>
  )
}
