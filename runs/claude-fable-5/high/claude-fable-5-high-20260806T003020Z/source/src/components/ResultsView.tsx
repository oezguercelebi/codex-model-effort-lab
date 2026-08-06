import {
  BedDouble,
  Check,
  Coffee,
  Landmark,
  ListChecks,
  Lock,
  LockOpen,
  Martini,
  Moon,
  Mountain,
  PartyPopper,
  Plane,
  RotateCcw,
  Scale,
  TrainFront,
  Trophy,
  Utensils,
  Wallet,
} from "lucide-react"
import {
  FRIENDS,
  TRIP,
  budgetTotal,
  formatDuration,
  formatEuro,
  type Destination,
  type ItineraryKind,
} from "../data"
import type { Voter } from "../App"
import { Avatar, AvatarStack, WeatherBadge, weatherLabel } from "./ui"

const KIND_META: Record<ItineraryKind, { icon: typeof Plane; className: string }> = {
  travel: { icon: Plane, className: "bg-sky-100 text-sky-600" },
  food: { icon: Utensils, className: "bg-amber-100 text-amber-600" },
  sight: { icon: Landmark, className: "bg-violet-100 text-violet-600" },
  outdoors: { icon: Mountain, className: "bg-emerald-100 text-emerald-600" },
  nightlife: { icon: Martini, className: "bg-rose-100 text-rose-600" },
  chill: { icon: Coffee, className: "bg-stone-100 text-stone-500" },
}

export function ResultsView({
  standings,
  votesById,
  userVotes,
  locked,
  isTie,
  winner,
  checked,
  onToggleCheck,
  onLock,
  onUnlock,
  onReset,
  onGoExplore,
  onOpenDetail,
}: {
  standings: Destination[]
  votesById: Record<string, Voter[]>
  userVotes: string[]
  locked: boolean
  isTie: boolean
  winner: Destination
  checked: string[]
  onToggleCheck: (key: string) => void
  onLock: () => void
  onUnlock: () => void
  onReset: () => void
  onGoExplore: () => void
  onOpenDetail: (id: string) => void
}) {
  const maxVotes = Math.max(1, ...standings.map((d) => votesById[d.id]?.length ?? 0))

  return (
    <div className="space-y-8">
      {locked ? (
        <WinnerHero winner={winner} voters={votesById[winner.id] ?? []} isTie={isTie} />
      ) : (
        <section className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">The standings</h1>
          <p className="mt-2 leading-relaxed text-stone-600">
            Live results as votes come in. Lock in your picks to crown the winner and unlock the
            full trip plan.
          </p>
        </section>
      )}

      {!locked && (
        <section className="flex flex-col gap-4 rounded-3xl border border-amber-200 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-amber-500 text-white">
              <Trophy className="size-5" aria-hidden />
            </span>
            <div>
              <p className="font-semibold text-amber-950">
                {userVotes.length === 0
                  ? "You haven't voted yet"
                  : `You've used ${userVotes.length} of ${TRIP.maxVotesPerPerson} votes`}
              </p>
              <p className="text-sm text-amber-800">
                {userVotes.length === 0
                  ? "Pick up to three favorites on the Explore tab, then come back to lock them in."
                  : "Lock them in when you're ready — that finalizes the group's decision."}
              </p>
            </div>
          </div>
          {userVotes.length === 0 ? (
            <button
              onClick={onGoExplore}
              className="w-fit shrink-0 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-stone-700"
            >
              Go vote
            </button>
          ) : (
            <button
              onClick={onLock}
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-amber-700 active:scale-95"
            >
              <Lock className="size-4" aria-hidden />
              Lock in my votes
            </button>
          )}
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200/70 sm:p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <Scale className="size-5 text-stone-400" aria-hidden />
            {locked ? "Final tally" : "Current tally"}
          </h2>
          <ol className="mt-4 space-y-3">
            {standings.map((d, i) => {
              const voters = votesById[d.id] ?? []
              const isLeader = i === 0
              return (
                <li key={d.id}>
                  <button
                    onClick={() => onOpenDetail(d.id)}
                    className="group grid w-full grid-cols-[1.5rem_1fr_auto] items-center gap-x-3 gap-y-1 rounded-2xl p-2 text-left transition-colors hover:bg-stone-50"
                  >
                    <span
                      className={`text-center text-sm font-bold ${
                        isLeader ? "text-amber-600" : "text-stone-400"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="flex min-w-0 items-center gap-2 font-semibold tracking-tight group-hover:text-amber-700">
                      <span aria-hidden>{d.emoji}</span>
                      <span className="truncate">{d.name}</span>
                      {isLeader && locked && (
                        <Trophy className="size-4 shrink-0 text-amber-500" aria-label="Winner" />
                      )}
                    </span>
                    <span className="flex items-center gap-2 justify-self-end">
                      {voters.length > 0 && <AvatarStack people={voters} max={4} />}
                      <span className="w-14 text-right text-sm font-medium text-stone-500">
                        {voters.length} vote{voters.length === 1 ? "" : "s"}
                      </span>
                    </span>
                    <span className="col-start-2 col-end-4 h-2 overflow-hidden rounded-full bg-stone-100">
                      <span
                        className={`block h-full rounded-full transition-all duration-500 ${
                          isLeader ? "bg-amber-500" : "bg-stone-300"
                        }`}
                        style={{ width: `${(voters.length / maxVotes) * 100}%` }}
                      />
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
          {isTie && !locked && (
            <p className="mt-4 rounded-xl bg-stone-50 p-3 text-xs leading-relaxed text-stone-500">
              It's currently a tie at the top — if it stays that way, the cheaper trip wins. Your
              votes could settle it.
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200/70">
            <h2 className="text-lg font-bold tracking-tight">Who's voted</h2>
            <ul className="mt-3 space-y-3">
              {FRIENDS.map((f) => (
                <li key={f.id} className="flex items-start gap-3">
                  <Avatar initials={f.initials} color={f.color} />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-sm font-semibold">
                      {f.name}
                      <Check className="size-3.5 text-emerald-500" aria-label="Voted" />
                    </p>
                    {f.comment && (
                      <p className="text-xs leading-relaxed text-stone-500">“{f.comment}”</p>
                    )}
                  </div>
                </li>
              ))}
              <li className="flex items-start gap-3 border-t border-stone-100 pt-3">
                <Avatar initials="YO" color="bg-amber-500" />
                <div className="flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-semibold">
                    You
                    {locked ? (
                      <Check className="size-3.5 text-emerald-500" aria-label="Voted" />
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                        {userVotes.length === 0 ? "Not voted" : "Not locked"}
                      </span>
                    )}
                  </p>
                  <p className="text-xs leading-relaxed text-stone-500">
                    {userVotes.length === 0
                      ? "The group is waiting on you."
                      : `Backing ${userVotes.length} destination${userVotes.length === 1 ? "" : "s"}.`}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {locked && (
            <div className="flex flex-col gap-2">
              <button
                onClick={onUnlock}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 shadow-sm ring-1 ring-stone-200 transition-colors hover:bg-stone-50"
              >
                <LockOpen className="size-4" aria-hidden />
                Reopen voting
              </button>
              <button
                onClick={onReset}
                className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-stone-400 transition-colors hover:text-stone-600"
              >
                <RotateCcw className="size-4" aria-hidden />
                Reset the demo
              </button>
            </div>
          )}
        </div>
      </section>

      {locked && (
        <>
          <Itinerary winner={winner} />
          <Checklist winner={winner} checked={checked} onToggleCheck={onToggleCheck} />
        </>
      )}
    </div>
  )
}

function WinnerHero({
  winner,
  voters,
  isTie,
}: {
  winner: Destination
  voters: Voter[]
  isTie: boolean
}) {
  const TravelIcon = winner.travel.mode === "flight" ? Plane : TrainFront
  return (
    <section
      className={`animate-fade-up overflow-hidden rounded-3xl bg-gradient-to-br ${winner.gradient} p-1 shadow-sm`}
    >
      <div className="rounded-[1.375rem] bg-white/85 p-6 backdrop-blur sm:p-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          <PartyPopper className="size-3.5" aria-hidden />
          The group has decided
        </p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {winner.name} it is! <span aria-hidden>{winner.emoji}</span>
            </h1>
            <p className="mt-2 max-w-xl leading-relaxed text-stone-600">{winner.tagline}</p>
            {isTie && (
              <p className="mt-2 text-sm font-medium text-stone-500">
                It was a tie on votes — {winner.name} takes it as the cheaper trip.
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <AvatarStack people={voters} />
            <span className="text-sm font-medium text-stone-600">
              {voters.length} vote{voters.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>
        <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-stone-700">
          <div className="inline-flex items-center gap-1.5">
            <Wallet className="size-4 text-stone-400" aria-hidden />
            <dt className="sr-only">Budget</dt>
            <dd>{formatEuro(budgetTotal(winner.budget))} / person</dd>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <TravelIcon className="size-4 text-stone-400" aria-hidden />
            <dt className="sr-only">Travel</dt>
            <dd>
              {formatDuration(winner.travel.durationMin)} · {winner.travel.detail}
            </dd>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <dt className="sr-only">Weather</dt>
            <dd className="inline-flex items-center gap-1.5">
              <WeatherBadge kind={winner.weather.kind} tempC={winner.weather.tempC} />
              <span className="text-stone-500">{weatherLabel(winner.weather.kind)}</span>
            </dd>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <BedDouble className="size-4 text-stone-400" aria-hidden />
            <dt className="sr-only">Stay</dt>
            <dd>Staying in {winner.stayArea}</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}

function Itinerary({ winner }: { winner: Destination }) {
  return (
    <section className="animate-fade-up">
      <h2 className="text-2xl font-bold tracking-tight">
        The plan · {TRIP.dates}
      </h2>
      <p className="mt-1 text-stone-600">
        A first draft for the group — loose enough to argue about over dinner.
      </p>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {winner.itinerary.map((day) => (
          <div
            key={day.label}
            className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200/70"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-bold tracking-tight">{day.label}</h3>
              <span className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                {day.date}
              </span>
            </div>
            <p className="mt-1 text-sm text-stone-500">{day.summary}</p>
            <ol className="mt-4 space-y-4">
              {day.items.map((item) => {
                const meta = KIND_META[item.kind]
                const Icon = item.kind === "chill" && item.time >= "20:00" ? Moon : meta.icon
                return (
                  <li key={`${day.label}-${item.time}`} className="flex gap-3">
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-full ${meta.className}`}
                    >
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-snug">
                        <span className="mr-1.5 font-mono text-xs font-medium text-stone-400">
                          {item.time}
                        </span>
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-stone-500">{item.note}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        ))}
      </div>
    </section>
  )
}

function Checklist({
  winner,
  checked,
  onToggleCheck,
}: {
  winner: Destination
  checked: string[]
  onToggleCheck: (key: string) => void
}) {
  const transportLabel =
    winner.travel.mode === "flight"
      ? `Book flights, ${TRIP.origin} ⇄ ${winner.name}`
      : `Book train tickets, ${TRIP.origin} ⇄ ${winner.name}`
  const items = [
    transportLabel,
    `Reserve a place for ${TRIP.groupSize} in ${winner.stayArea}`,
    `Collect ${formatEuro(budgetTotal(winner.budget))} per person into the trip pot`,
    "Start the shared packing list",
  ]
  const done = items.filter((_, i) => checked.includes(`${winner.id}:${i}`)).length

  return (
    <section className="animate-fade-up rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200/70 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <ListChecks className="size-5 text-stone-400" aria-hidden />
          Before you go
        </h2>
        <span className="text-sm font-medium text-stone-500">
          {done}/{items.length} done
        </span>
      </div>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((label, i) => {
          const key = `${winner.id}:${i}`
          const isDone = checked.includes(key)
          return (
            <li key={key}>
              <button
                onClick={() => onToggleCheck(key)}
                aria-pressed={isDone}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left text-sm font-medium transition-colors ${
                  isDone
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
                }`}
              >
                <span
                  className={`grid size-5 shrink-0 place-items-center rounded-full border transition-colors ${
                    isDone
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-stone-300 bg-white text-transparent"
                  }`}
                >
                  <Check className="size-3.5" aria-hidden />
                </span>
                <span className={isDone ? "line-through decoration-emerald-400" : ""}>
                  {label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
