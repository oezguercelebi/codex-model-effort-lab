import { CalendarDays, Crown, MapPin, Users, Wallet } from "lucide-react"
import { DESTINATIONS, TRAVELERS } from "../data"
import type { Ranked } from "../lib"
import { cx, formatHours, formatMoney, totalPerPerson, votesCast } from "../lib"
import type { Votes } from "../types"
import { MODE_ICON } from "./DestinationCard"
import { Itinerary } from "./Itinerary"
import { Avatar, EmptyState } from "./ui"

export function PlanView({
  ranked,
  votes,
  onGoVote,
}: {
  ranked: Ranked[]
  votes: Votes
  onGoVote: () => void
}) {
  const leader = ranked[0]
  const runnersUp = ranked.slice(1, 3)
  const tiedWith = ranked.filter(
    (r) => r.tally.score === leader.tally.score && r.destination.id !== leader.destination.id,
  )

  if (votesCast(votes) === 0) {
    return (
      <EmptyState
        title="No votes yet"
        body="Once the group starts voting, the winning weekend and its full itinerary show up here."
        action={
          <button
            type="button"
            onClick={onGoVote}
            className="rounded-xl bg-stone-900 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800"
          >
            Start voting
          </button>
        }
      />
    )
  }

  const destination = leader.destination
  const perPerson = totalPerPerson(destination)
  const ModeIcon = MODE_ICON[destination.travelMode]
  const itineraryTotal = destination.itinerary.reduce(
    (sum, day) => sum + day.items.reduce((s, item) => s + item.cost, 0),
    0,
  )

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <div className="relative p-6 sm:p-8">
          <div
            className={cx(
              "absolute inset-0 bg-gradient-to-br opacity-95",
              destination.from,
              destination.to,
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="relative text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold tracking-wide text-stone-900 uppercase">
              <Crown className="h-3.5 w-3.5 text-amber-500" />
              {tiedWith.length > 0 ? "Currently tied for first" : "The group has spoken"}
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {destination.name}, {destination.country}
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-6 opacity-95">
              {destination.tagline} · {leader.tally.yes} in, {leader.tally.maybe} maybe,{" "}
              {leader.tally.no} out.
            </p>
            {tiedWith.length > 0 ? (
              <p className="mt-3 max-w-lg rounded-xl bg-black/25 px-3 py-2 text-xs backdrop-blur-sm">
                Level with {tiedWith.map((r) => r.destination.name).join(" and ")}. The
                plan below assumes {destination.name} — break the tie on the Vote tab.
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 border-t border-stone-100 p-6 sm:grid-cols-4 sm:p-8">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-stone-500 uppercase">
              <CalendarDays className="h-3 w-3" /> Dates
            </div>
            <p className="mt-1 text-sm font-semibold text-stone-900">17–19 October</p>
            <p className="text-xs text-stone-500">Two nights, Fri to Sun</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-stone-500 uppercase">
              <Wallet className="h-3 w-3" /> Budget
            </div>
            <p className="mt-1 text-sm font-semibold text-stone-900">
              {formatMoney(perPerson)} each
            </p>
            <p className="text-xs text-stone-500">
              {formatMoney(perPerson * TRAVELERS.length)} for the group
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-stone-500 uppercase">
              <ModeIcon className="h-3 w-3" /> Getting there
            </div>
            <p className="mt-1 text-sm font-semibold text-stone-900">
              {formatHours(destination.travelHours)}
            </p>
            <p className="text-xs text-stone-500">{destination.travelNote}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-stone-500 uppercase">
              <Users className="h-3 w-3" /> Who&apos;s in
            </div>
            <div className="mt-1.5 flex -space-x-1.5">
              {TRAVELERS.map((t) => (
                <Avatar
                  key={t.id}
                  traveler={t}
                  size="sm"
                  dim={votes[t.id]?.[destination.id] === "no"}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-stone-500">
              {leader.tally.no > 0
                ? `${leader.tally.no} not sold yet`
                : "Nobody has voted it out"}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-stone-900">
            <MapPin className="h-4 w-4 text-stone-400" /> The weekend, hour by hour
          </h3>
          <p className="text-xs text-stone-500">
            Planned spend {formatMoney(itineraryTotal)} per person, excluding flights
          </p>
        </div>
        <div className="mt-5">
          <Itinerary destination={destination} />
        </div>
      </section>

      <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
        <h3 className="text-sm font-semibold text-stone-900">
          If the vote flips, the backups
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {runnersUp.map(({ destination: d, tally, rank }) => (
            <div
              key={d.id}
              className="flex items-center gap-3 rounded-2xl border border-stone-200 p-3"
            >
              <span
                className={cx(
                  "h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br",
                  d.from,
                  d.to,
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-stone-900">
                  #{rank} {d.name}
                </p>
                <p className="truncate text-xs text-stone-500">
                  {formatMoney(totalPerPerson(d))} each · {tally.score} pts ·{" "}
                  {formatHours(d.travelHours)}
                </p>
              </div>
            </div>
          ))}
          {runnersUp.length === 0 ? (
            <p className="text-sm text-stone-500">
              Only {DESTINATIONS.length} options on the shortlist.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  )
}
