import { useEffect, useMemo, useState } from "react"
import {
  ArrowUpDown,
  Bike,
  Calendar,
  Car,
  Check,
  ChevronRight,
  Cloud,
  CloudSun,
  Compass,
  Crown,
  Heart,
  MapPin,
  Plane,
  Sparkles,
  Star,
  Sun,
  TrainFront,
  Trophy,
  Users,
  Utensils,
  Wallet,
  X,
} from "lucide-react"
import {
  budgetTotal,
  destinations,
  friends as baseFriends,
  MAX_VOTES,
  TRIP_DATES,
  type Destination,
  type ItineraryStop,
  type Vibe,
} from "./data"

type Tab = "explore" | "votes" | "itinerary"
type SortKey = "votes" | "budget" | "travel" | "rating"

const VOTE_STORAGE_KEY = "weekender.myVotes.v1"
const eur = (n: number) => `€${n.toLocaleString("en-IE")}`

function loadMyVotes(): string[] {
  try {
    const raw = localStorage.getItem(VOTE_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((v): v is string => typeof v === "string" && destinations.some((d) => d.id === v))
      .slice(0, MAX_VOTES)
  } catch {
    return []
  }
}

function WeatherIcon({ icon, className }: { icon: Destination["weather"]["icon"]; className?: string }) {
  const cls = className ?? "size-4"
  if (icon === "sun") return <Sun className={cls} />
  if (icon === "cloud") return <Cloud className={cls} />
  return <CloudSun className={cls} />
}

function TravelIcon({ mode, className }: { mode: Destination["travelMode"]; className?: string }) {
  const cls = className ?? "size-4"
  if (mode === "Flight") return <Plane className={cls} />
  if (mode === "Train") return <TrainFront className={cls} />
  return <Car className={cls} />
}

function stopIcon(kind: ItineraryStop["kind"]) {
  const cls = "size-4"
  switch (kind) {
    case "food":
      return <Utensils className={cls} />
    case "travel":
      return <Compass className={cls} />
    case "chill":
      return <Sun className={cls} />
    default:
      return <Sparkles className={cls} />
  }
}

function travelLabel(hours: number) {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return m ? `${h}h ${m}m` : `${h}h`
}

export default function App() {
  const [tab, setTab] = useState<Tab>("explore")
  const [myVotes, setMyVotes] = useState<string[]>(loadMyVotes)
  const [selected, setSelected] = useState<Destination | null>(null)
  const [vibeFilter, setVibeFilter] = useState<Vibe | "All">("All")
  const [sortKey, setSortKey] = useState<SortKey>("votes")
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(VOTE_STORAGE_KEY, JSON.stringify(myVotes))
  }, [myVotes])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null)
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [selected])

  const friends = useMemo(
    () => baseFriends.map((f) => (f.id === "you" ? { ...f, votes: myVotes } : f)),
    [myVotes],
  )

  const voteCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const f of friends) for (const id of f.votes) counts.set(id, (counts.get(id) ?? 0) + 1)
    return counts
  }, [friends])

  const votersFor = (id: string) => friends.filter((f) => f.votes.includes(id))
  const totalVotesCast = friends.reduce((n, f) => n + f.votes.length, 0)

  const ranked = useMemo(
    () =>
      [...destinations].sort((a, b) => {
        const diff = (voteCounts.get(b.id) ?? 0) - (voteCounts.get(a.id) ?? 0)
        return diff !== 0 ? diff : b.rating - a.rating
      }),
    [voteCounts],
  )
  const winner = ranked[0]

  const visible = useMemo(() => {
    const filtered = destinations.filter((d) => vibeFilter === "All" || d.vibes.includes(vibeFilter))
    return filtered.sort((a, b) => {
      switch (sortKey) {
        case "budget":
          return budgetTotal(a.budget) - budgetTotal(b.budget)
        case "travel":
          return a.travelHours - b.travelHours
        case "rating":
          return b.rating - a.rating
        default:
          return (voteCounts.get(b.id) ?? 0) - (voteCounts.get(a.id) ?? 0)
      }
    })
  }, [vibeFilter, sortKey, voteCounts])

  const toggleVote = (dest: Destination) => {
    setMyVotes((prev) => {
      if (prev.includes(dest.id)) {
        setToast(`Removed your vote for ${dest.name}`)
        return prev.filter((v) => v !== dest.id)
      }
      if (prev.length >= MAX_VOTES) {
        setToast(`You only have ${MAX_VOTES} votes — remove one first`)
        return prev
      }
      setToast(`Voted for ${dest.name} ✓`)
      return [...prev, dest.id]
    })
  }

  const allVibes: (Vibe | "All")[] = [
    "All",
    "Beach",
    "City",
    "Mountains",
    "Food & Wine",
    "Nightlife",
    "Outdoors",
    "Culture",
  ]

  return (
    <div className="min-h-screen bg-stone-100 pb-24 text-stone-900 sm:pb-10">
      <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-stone-100/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-stone-900 text-white">
              <Bike className="size-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight tracking-tight">Weekender</h1>
              <p className="hidden text-xs text-stone-500 sm:block">Squad trip · {TRIP_DATES}</p>
            </div>
          </div>
          <nav className="hidden items-center gap-1 rounded-full bg-stone-200/70 p-1 sm:flex">
            {(
              [
                ["explore", "Explore", Compass],
                ["votes", "Votes", Trophy],
                ["itinerary", "Itinerary", Calendar],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  tab === key ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </nav>
          <div className="flex -space-x-2">
            {friends.map((f) => (
              <div
                key={f.id}
                title={`${f.name} · ${f.votes.length}/${MAX_VOTES} votes`}
                className={`grid size-8 place-items-center rounded-full border-2 border-stone-100 text-[10px] font-bold text-white ${f.color}`}
              >
                {f.initials}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
        {tab === "explore" && (
          <>
            <section className="mb-6 overflow-hidden rounded-3xl bg-stone-900 p-6 text-white sm:p-8">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
                <Users className="size-4" /> 6 friends · {TRIP_DATES}
              </p>
              <h2 className="mt-2 max-w-xl text-2xl font-bold tracking-tight sm:text-3xl">
                Where are we going this September?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-stone-300">
                Compare six shortlisted destinations by budget, travel time and vibe — then spend your{" "}
                <span className="font-semibold text-white">{MAX_VOTES} votes</span>. The group favorite gets a
                ready-made itinerary.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-white/10 px-3 py-1">
                  {myVotes.length}/{MAX_VOTES} of your votes used
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1">{totalVotesCast} votes cast so far</span>
                <button
                  onClick={() => setTab("votes")}
                  className="flex items-center gap-1 rounded-full bg-white px-3 py-1 font-semibold text-stone-900 transition hover:bg-stone-200"
                >
                  See standings <ChevronRight className="size-4" />
                </button>
              </div>
            </section>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap gap-1.5">
                {allVibes.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVibeFilter(v)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      vibeFilter === v
                        ? "bg-stone-900 text-white"
                        : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <label className="ml-auto flex items-center gap-1.5 text-xs text-stone-500">
                <ArrowUpDown className="size-3.5" />
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-xs font-medium text-stone-700"
                >
                  <option value="votes">Most votes</option>
                  <option value="budget">Lowest budget</option>
                  <option value="travel">Shortest travel</option>
                  <option value="rating">Highest rated</option>
                </select>
              </label>
            </div>

            {visible.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center text-sm text-stone-500">
                No destinations match that vibe — try another filter.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {visible.map((d) => {
                  const votes = voteCounts.get(d.id) ?? 0
                  const voted = myVotes.includes(d.id)
                  const leading = winner.id === d.id && votes > 0
                  return (
                    <article
                      key={d.id}
                      className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200/70 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <button onClick={() => setSelected(d)} className="block w-full text-left">
                        <div className={`relative flex h-36 items-end bg-gradient-to-br ${d.gradient} p-4`}>
                          <span className="absolute right-4 top-4 text-4xl drop-shadow-sm">{d.emoji}</span>
                          {leading && (
                            <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-amber-600">
                              <Crown className="size-3.5" /> Leading
                            </span>
                          )}
                          <div className="text-white">
                            <h3 className="text-xl font-bold drop-shadow-sm">{d.name}</h3>
                            <p className="flex items-center gap-1 text-xs font-medium text-white/90">
                              <MapPin className="size-3" /> {d.country}
                            </p>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-stone-600">{d.tagline}</p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {d.vibes.map((v) => (
                              <span
                                key={v}
                                className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600"
                              >
                                {v}
                              </span>
                            ))}
                          </div>
                          <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                            <div className="rounded-xl bg-stone-50 px-2 py-2">
                              <dt className="flex items-center justify-center gap-1 text-[10px] font-medium uppercase tracking-wide text-stone-400">
                                <Wallet className="size-3" /> Budget
                              </dt>
                              <dd className="mt-0.5 text-sm font-bold">{eur(budgetTotal(d.budget))}</dd>
                            </div>
                            <div className="rounded-xl bg-stone-50 px-2 py-2">
                              <dt className="flex items-center justify-center gap-1 text-[10px] font-medium uppercase tracking-wide text-stone-400">
                                <TravelIcon mode={d.travelMode} className="size-3" /> Travel
                              </dt>
                              <dd className="mt-0.5 text-sm font-bold">{travelLabel(d.travelHours)}</dd>
                            </div>
                            <div className="rounded-xl bg-stone-50 px-2 py-2">
                              <dt className="flex items-center justify-center gap-1 text-[10px] font-medium uppercase tracking-wide text-stone-400">
                                <WeatherIcon icon={d.weather.icon} className="size-3" /> Sept
                              </dt>
                              <dd className="mt-0.5 text-sm font-bold">{d.weather.tempC}°C</dd>
                            </div>
                          </dl>
                        </div>
                      </button>
                      <div className="flex items-center justify-between border-t border-stone-100 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1.5">
                            {votersFor(d.id).map((f) => (
                              <span
                                key={f.id}
                                title={f.name}
                                className={`grid size-6 place-items-center rounded-full border-2 border-white text-[9px] font-bold text-white ${f.color}`}
                              >
                                {f.initials}
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-stone-500">
                            {votes === 0 ? "No votes yet" : `${votes} vote${votes > 1 ? "s" : ""}`}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleVote(d)}
                          aria-pressed={voted}
                          className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                            voted
                              ? "bg-rose-500 text-white hover:bg-rose-600"
                              : "bg-stone-900 text-white hover:bg-stone-700"
                          }`}
                        >
                          <Heart className={`size-3.5 ${voted ? "fill-current" : ""}`} />
                          {voted ? "Voted" : "Vote"}
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </>
        )}

        {tab === "votes" && (
          <section>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Group standings</h2>
                <p className="mt-1 text-sm text-stone-500">
                  {totalVotesCast} of {friends.length * MAX_VOTES} possible votes cast · everyone gets {MAX_VOTES}
                </p>
              </div>
              <button
                onClick={() => setTab("itinerary")}
                className="hidden items-center gap-1 rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700 sm:flex"
              >
                Winning itinerary <ChevronRight className="size-4" />
              </button>
            </div>
            <ol className="space-y-3">
              {ranked.map((d, i) => {
                const votes = voteCounts.get(d.id) ?? 0
                const max = Math.max(1, ...ranked.map((r) => voteCounts.get(r.id) ?? 0))
                const isWinner = i === 0 && votes > 0
                return (
                  <li
                    key={d.id}
                    className={`flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 transition ${
                      isWinner ? "ring-2 ring-amber-400" : "ring-stone-200/70"
                    }`}
                  >
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold ${
                        isWinner ? "bg-amber-400 text-white" : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {isWinner ? <Crown className="size-4" /> : i + 1}
                    </span>
                    <button onClick={() => setSelected(d)} className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-semibold">{d.name}</span>
                        <span className="text-xs text-stone-400">{d.country}</span>
                        <span className="ml-auto flex items-center gap-1 text-xs font-medium text-stone-500">
                          <Star className="size-3.5 fill-amber-400 text-amber-400" /> {d.rating}
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${d.gradient} transition-all duration-500`}
                          style={{ width: `${(votes / max) * 100}%` }}
                        />
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          {votersFor(d.id).map((f) => (
                            <span
                              key={f.id}
                              title={f.name}
                              className={`grid size-5 place-items-center rounded-full border-2 border-white text-[8px] font-bold text-white ${f.color}`}
                            >
                              {f.initials}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-stone-500">
                          {votes === 0 ? "No votes yet" : `${votes} vote${votes > 1 ? "s" : ""}`}
                        </span>
                        <span className="ml-auto hidden text-xs text-stone-400 sm:block">
                          {eur(budgetTotal(d.budget))} pp · {travelLabel(d.travelHours)}{" "}
                          {d.travelMode.toLowerCase()}
                        </span>
                      </div>
                    </button>
                    <button
                      onClick={() => toggleVote(d)}
                      aria-pressed={myVotes.includes(d.id)}
                      className={`shrink-0 rounded-full p-2.5 transition ${
                        myVotes.includes(d.id)
                          ? "bg-rose-500 text-white hover:bg-rose-600"
                          : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                      }`}
                      title={myVotes.includes(d.id) ? "Remove vote" : "Vote"}
                    >
                      <Heart className={`size-4 ${myVotes.includes(d.id) ? "fill-current" : ""}`} />
                    </button>
                  </li>
                )
              })}
            </ol>
            <p className="mt-4 text-center text-xs text-stone-400">
              Your votes are saved on this device. Ties break by rating.
            </p>
          </section>
        )}

        {tab === "itinerary" && <ItineraryView dest={winner} votes={voteCounts.get(winner.id) ?? 0} />}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 backdrop-blur-md sm:hidden">
        <div className="mx-auto grid max-w-md grid-cols-3">
          {(
            [
              ["explore", "Explore", Compass],
              ["votes", "Votes", Trophy],
              ["itinerary", "Itinerary", Calendar],
            ] as const
          ).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${
                tab === key ? "text-stone-900" : "text-stone-400"
              }`}
            >
              <Icon className="size-5" />
              {label}
            </button>
          ))}
        </div>
      </nav>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 sm:bottom-8">
          <div className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white shadow-lg">{toast}</div>
        </div>
      )}

      {selected && (
        <DestinationModal
          dest={selected}
          votes={voteCounts.get(selected.id) ?? 0}
          voters={votersFor(selected.id)}
          voted={myVotes.includes(selected.id)}
          onVote={() => toggleVote(selected)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

function DestinationModal({
  dest,
  votes,
  voters,
  voted,
  onVote,
  onClose,
}: {
  dest: Destination
  votes: number
  voters: { id: string; name: string; initials: string; color: string }[]
  voted: boolean
  onVote: () => void
  onClose: () => void
}) {
  const total = budgetTotal(dest.budget)
  const rows: { label: string; value: number; color: string }[] = [
    { label: "Travel", value: dest.budget.travel, color: "bg-sky-400" },
    { label: "Lodging", value: dest.budget.lodging, color: "bg-violet-400" },
    { label: "Food & drinks", value: dest.budget.food, color: "bg-amber-400" },
    { label: "Activities", value: dest.budget.activities, color: "bg-emerald-400" },
  ]
  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-stone-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${dest.name} details`}
    >
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`relative flex h-44 items-end bg-gradient-to-br ${dest.gradient} p-6`}>
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/25 p-2 text-white transition hover:bg-white/40"
          >
            <X className="size-4" />
          </button>
          <span className="absolute bottom-6 right-6 text-5xl drop-shadow">{dest.emoji}</span>
          <div className="text-white">
            <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white/85">
              <MapPin className="size-3.5" /> {dest.country}
            </p>
            <h3 className="text-3xl font-bold drop-shadow-sm">{dest.name}</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {dest.vibes.map((v) => (
              <span key={v} className="rounded-full bg-stone-100 px-2.5 py-1 font-medium text-stone-600">
                {v}
              </span>
            ))}
            <span className="ml-auto flex items-center gap-1 font-semibold text-stone-600">
              <Star className="size-4 fill-amber-400 text-amber-400" /> {dest.rating} group fit
            </span>
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-600">{dest.description}</p>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-2xl bg-stone-50 p-3">
              <TravelIcon mode={dest.travelMode} className="mx-auto size-5 text-stone-400" />
              <p className="mt-1 font-bold">{travelLabel(dest.travelHours)}</p>
              <p className="text-xs text-stone-500">door to door, {dest.travelMode.toLowerCase()}</p>
            </div>
            <div className="rounded-2xl bg-stone-50 p-3">
              <WeatherIcon icon={dest.weather.icon} className="mx-auto size-5 text-stone-400" />
              <p className="mt-1 font-bold">{dest.weather.tempC}°C</p>
              <p className="text-xs text-stone-500">typical September</p>
            </div>
            <div className="rounded-2xl bg-stone-50 p-3">
              <Users className="mx-auto size-5 text-stone-400" />
              <p className="mt-1 font-bold">{votes}</p>
              <p className="text-xs text-stone-500">vote{votes === 1 ? "" : "s"} so far</p>
            </div>
          </div>

          <h4 className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-stone-500">
            <Wallet className="size-4" /> Budget per person · {eur(total)}
          </h4>
          <div className="mt-3 flex h-3 overflow-hidden rounded-full">
            {rows.map((r) => (
              <div key={r.label} className={r.color} style={{ width: `${(r.value / total) * 100}%` }} />
            ))}
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {rows.map((r) => (
              <li key={r.label} className="flex items-center gap-2">
                <span className={`size-2.5 rounded-full ${r.color}`} />
                <span className="text-stone-600">{r.label}</span>
                <span className="ml-auto font-semibold">{eur(r.value)}</span>
              </li>
            ))}
          </ul>

          <h4 className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-stone-500">
            <Sparkles className="size-4" /> Highlights
          </h4>
          <ul className="mt-2 grid gap-1.5 text-sm text-stone-600 sm:grid-cols-2">
            {dest.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" /> {h}
              </li>
            ))}
          </ul>

          {voters.length > 0 && (
            <div className="mt-6 flex items-center gap-2 rounded-2xl bg-stone-50 p-3 text-sm text-stone-600">
              <div className="flex -space-x-1.5">
                {voters.map((f) => (
                  <span
                    key={f.id}
                    className={`grid size-6 place-items-center rounded-full border-2 border-white text-[9px] font-bold text-white ${f.color}`}
                  >
                    {f.initials}
                  </span>
                ))}
              </div>
              {voters.map((f) => f.name).join(", ")} {voters.length === 1 ? "wants" : "want"} to go here
            </div>
          )}

          <button
            onClick={onVote}
            className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold transition ${
              voted ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-stone-900 text-white hover:bg-stone-700"
            }`}
          >
            <Heart className={`size-4 ${voted ? "fill-current" : ""}`} />
            {voted ? "Voted — tap to remove" : `Vote for ${dest.name}`}
          </button>
        </div>
      </div>
    </div>
  )
}

function ItineraryView({ dest, votes }: { dest: Destination; votes: number }) {
  const [dayIdx, setDayIdx] = useState(0)
  useEffect(() => setDayIdx(0), [dest.id])
  const day = dest.itinerary[Math.min(dayIdx, dest.itinerary.length - 1)]
  return (
    <section>
      <div className={`overflow-hidden rounded-3xl bg-gradient-to-br ${dest.gradient} p-6 text-white sm:p-8`}>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/85">
          <Trophy className="size-4" /> Current group favorite · {votes} vote{votes === 1 ? "" : "s"}
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight drop-shadow-sm">
          {dest.name}, {dest.country} {dest.emoji}
        </h2>
        <p className="mt-1 text-sm text-white/90">{dest.tagline}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5">
            <Calendar className="size-3.5" /> {TRIP_DATES}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5">
            <Wallet className="size-3.5" /> ~{eur(budgetTotal(dest.budget))} per person
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5">
            <TravelIcon mode={dest.travelMode} className="size-3.5" /> {travelLabel(dest.travelHours)} by{" "}
            {dest.travelMode.toLowerCase()}
          </span>
        </div>
      </div>

      <p className="mt-4 text-xs text-stone-500">
        The itinerary follows the vote — if the standings change, this plan updates to the new leader.
      </p>

      <div className="mt-4 flex gap-2">
        {dest.itinerary.map((d, i) => (
          <button
            key={d.label}
            onClick={() => setDayIdx(i)}
            className={`flex-1 rounded-2xl px-3 py-2.5 text-left transition ${
              i === dayIdx
                ? "bg-stone-900 text-white"
                : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50"
            }`}
          >
            <span className="block text-sm font-bold">{d.label}</span>
            <span className={`hidden text-xs sm:block ${i === dayIdx ? "text-stone-300" : "text-stone-400"}`}>
              {d.summary}
            </span>
          </button>
        ))}
      </div>

      <ol className="mt-5">
        {day.stops.map((stop, i) => (
          <li key={stop.time + stop.title} className="relative flex gap-4 pb-6 last:pb-0">
            {i < day.stops.length - 1 && (
              <span className="absolute bottom-0 left-[68px] top-10 w-px bg-stone-200 sm:left-[76px]" aria-hidden />
            )}
            <span className="w-10 pt-2.5 text-right text-xs font-bold text-stone-400 sm:w-12">{stop.time}</span>
            <span className="z-10 mt-1.5 grid size-8 shrink-0 place-items-center rounded-full bg-white text-stone-500 ring-1 ring-stone-200">
              {stopIcon(stop.kind)}
            </span>
            <div className="min-w-0 flex-1 rounded-2xl bg-white p-4 ring-1 ring-stone-200/70">
              <p className="font-semibold">{stop.title}</p>
              <p className="mt-0.5 text-sm leading-6 text-stone-500">{stop.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
