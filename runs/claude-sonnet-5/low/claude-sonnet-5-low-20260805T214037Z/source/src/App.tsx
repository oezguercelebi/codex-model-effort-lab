import { useMemo, useState } from "react"
import {
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  Cloud,
  DollarSign,
  MapPin,
  Plane,
  Star,
  Trophy,
  Users,
} from "lucide-react"
import { destinations, friends, type Destination } from "./data"

const CURRENT_USER = "you"

type VoteMap = Record<string, string[]>

const initialVotes: VoteMap = {
  "big-sur": ["mia", "jonas", "priya"],
  "lake-tahoe": ["lena", "theo"],
  asheville: ["mia"],
  "santa-fe": [],
}

type View = "compare" | "itinerary"

export default function App() {
  const [votes, setVotes] = useState<VoteMap>(initialVotes)
  const [view, setView] = useState<View>("compare")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const ranked = useMemo(
    () => [...destinations].sort((a, b) => (votes[b.id]?.length ?? 0) - (votes[a.id]?.length ?? 0)),
    [votes],
  )
  const winner = ranked[0]
  const totalVoters = friends.length
  const totalCast = Object.values(votes).reduce((sum, v) => sum + v.length, 0)

  function toggleVote(destId: string) {
    setVotes((prev) => {
      const has = prev[destId]?.includes(CURRENT_USER)
      const next: VoteMap = { ...prev }
      for (const key of Object.keys(next)) {
        next[key] = next[key].filter((f) => f !== CURRENT_USER)
      }
      if (!has) {
        next[destId] = [...(next[destId] ?? []), CURRENT_USER]
      }
      return next
    })
  }

  const itineraryDest = selectedId
    ? destinations.find((d) => d.id === selectedId) ?? winner
    : winner

  return (
    <div className="min-h-screen bg-stone-100 text-stone-950">
      <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-teal-600 text-white">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold leading-none tracking-tight">Weekender</p>
              <p className="text-xs text-stone-500">Oct 9–11 · The Usual Suspects</p>
            </div>
          </div>
          <nav className="flex gap-1 rounded-full bg-stone-100 p-1">
            <button
              onClick={() => setView("compare")}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition sm:px-4 ${
                view === "compare" ? "bg-white shadow-sm" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Compare
            </button>
            <button
              onClick={() => {
                setSelectedId(winner.id)
                setView("itinerary")
              }}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition sm:px-4 ${
                view === "itinerary" ? "bg-white shadow-sm" : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Itinerary
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {view === "compare" ? (
          <CompareView
            ranked={ranked}
            votes={votes}
            winner={winner}
            totalVoters={totalVoters}
            totalCast={totalCast}
            onVote={toggleVote}
            onViewItinerary={(id) => {
              setSelectedId(id)
              setView("itinerary")
            }}
          />
        ) : (
          <ItineraryView
            destination={itineraryDest}
            isWinner={itineraryDest.id === winner.id}
            options={ranked}
            onSelect={setSelectedId}
            onBack={() => setView("compare")}
          />
        )}
      </main>
    </div>
  )
}

function CompareView({
  ranked,
  votes,
  winner,
  totalVoters,
  totalCast,
  onVote,
  onViewItinerary,
}: {
  ranked: Destination[]
  votes: VoteMap
  winner: Destination
  totalVoters: number
  totalCast: number
  onVote: (id: string) => void
  onViewItinerary: (id: string) => void
}) {
  return (
    <div>
      <section className="mb-6 flex flex-col gap-4 rounded-2xl border border-teal-200 bg-teal-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal-600 text-white">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-teal-700">Current favorite</p>
            <p className="text-xl font-semibold tracking-tight">{winner.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-stone-600">
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {totalCast} of {totalVoters} voted
          </span>
          <button
            onClick={() => onViewItinerary(winner.id)}
            className="rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            View itinerary
          </button>
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2">
        {ranked.map((dest, index) => {
          const destVotes = votes[dest.id] ?? []
          const youVoted = destVotes.includes(CURRENT_USER)
          const isLeading = index === 0 && destVotes.length > 0
          return (
            <article
              key={dest.id}
              className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
                isLeading ? "border-teal-400 ring-1 ring-teal-300" : "border-stone-200"
              }`}
            >
              <div className={`relative h-32 bg-gradient-to-br ${dest.gradient} p-4`}>
                {isLeading && (
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-teal-700">
                    <Trophy className="h-3.5 w-3.5" /> Leading
                  </span>
                )}
                <p className="text-xs font-medium uppercase tracking-wide text-white/80">{dest.region}</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">{dest.name}</h2>
              </div>

              <div className="p-4">
                <p className="text-sm text-stone-600">{dest.tagline}</p>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="rounded-lg bg-stone-50 p-2">
                    <DollarSign className="mx-auto h-4 w-4 text-stone-400" />
                    <p className="mt-1 font-semibold">${dest.budgetPerPerson}</p>
                    <p className="text-xs text-stone-500">per person</p>
                  </div>
                  <div className="rounded-lg bg-stone-50 p-2">
                    {dest.travelMode === "Fly" ? (
                      <Plane className="mx-auto h-4 w-4 text-stone-400" />
                    ) : (
                      <Car className="mx-auto h-4 w-4 text-stone-400" />
                    )}
                    <p className="mt-1 font-semibold">{dest.travelTimeHours}h</p>
                    <p className="text-xs text-stone-500">{dest.travelMode}</p>
                  </div>
                  <div className="rounded-lg bg-stone-50 p-2">
                    <Star className="mx-auto h-4 w-4 text-stone-400" />
                    <p className="mt-1 font-semibold">{dest.rating}</p>
                    <p className="text-xs text-stone-500">rating</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs text-stone-500">
                  <Cloud className="h-3.5 w-3.5" />
                  {dest.weather}
                </div>

                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {dest.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-600">
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">
                  <div className="flex -space-x-2">
                    {destVotes.length === 0 && <span className="text-xs text-stone-400">No votes yet</span>}
                    {destVotes.map((fid) => {
                      const f = friends.find((fr) => fr.id === fid)!
                      return (
                        <span
                          key={fid}
                          title={f.name}
                          className={`grid h-7 w-7 place-items-center rounded-full border-2 border-white text-[10px] font-semibold text-white ${f.color}`}
                        >
                          {f.initials}
                        </span>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => onVote(dest.id)}
                    className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition ${
                      youVoted
                        ? "bg-teal-600 text-white hover:bg-teal-700"
                        : "border border-stone-300 text-stone-700 hover:border-teal-400 hover:text-teal-700"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {youVoted ? "Voted" : "Vote"}
                  </button>
                </div>

                <button
                  onClick={() => onViewItinerary(dest.id)}
                  className="mt-3 w-full rounded-lg border border-stone-200 py-2 text-sm font-medium text-stone-600 transition hover:border-teal-400 hover:text-teal-700"
                >
                  Preview itinerary
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function ItineraryView({
  destination,
  isWinner,
  options,
  onSelect,
  onBack,
}: {
  destination: Destination
  isWinner: boolean
  options: Destination[]
  onSelect: (id: string) => void
  onBack: () => void
}) {
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 text-sm font-medium text-stone-500 transition hover:text-stone-900"
      >
        ← Back to comparison
      </button>

      <div className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${isWinner ? "border-teal-400" : "border-stone-200"}`}>
        <div className={`bg-gradient-to-br ${destination.gradient} p-6 sm:p-8`}>
          {isWinner && (
            <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-teal-700">
              <Trophy className="h-3.5 w-3.5" /> Group favorite
            </span>
          )}
          <p className="text-sm font-medium uppercase tracking-wide text-white/80">{destination.region}</p>
          <h1 className="mt-1 text-3xl font-semibold text-white sm:text-4xl">{destination.name}</h1>
          <p className="mt-2 max-w-lg text-white/90">{destination.tagline}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 border-b border-stone-100 p-5 sm:grid-cols-4">
          <Stat icon={<DollarSign className="h-4 w-4" />} label="Per person" value={`$${destination.budgetPerPerson}`} />
          <Stat
            icon={destination.travelMode === "Fly" ? <Plane className="h-4 w-4" /> : <Car className="h-4 w-4" />}
            label={destination.travelMode}
            value={`${destination.travelTimeHours}h`}
          />
          <Stat icon={<MapPin className="h-4 w-4" />} label="Distance" value={`${destination.distanceMiles} mi`} />
          <Stat icon={<Star className="h-4 w-4" />} label="Rating" value={`${destination.rating}/5`} />
        </div>

        <div className="p-5 sm:p-6">
          <h2 className="mb-4 text-lg font-semibold">Weekend itinerary</h2>
          <div className="space-y-6">
            {destination.itinerary.map((day) => (
              <div key={day.day}>
                <div className="mb-2 flex items-baseline gap-2">
                  <h3 className="text-base font-semibold">{day.day}</h3>
                  <span className="text-xs text-stone-500">{day.date}</span>
                </div>
                <ol className="space-y-3 border-l-2 border-stone-100 pl-4">
                  {day.activities.map((a) => (
                    <li key={a.time + a.title} className="relative">
                      <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-teal-500" />
                      <div className="flex items-center gap-1.5 text-xs font-medium text-teal-700">
                        <Clock className="h-3.5 w-3.5" />
                        {a.time}
                      </div>
                      <p className="mt-0.5 font-medium text-stone-900">{a.title}</p>
                      <p className="text-sm text-stone-500">{a.description}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-stone-500">Or preview another destination</p>
        <div className="flex flex-wrap gap-2">
          {options.map((d) => (
            <button
              key={d.id}
              onClick={() => onSelect(d.id)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                d.id === destination.id
                  ? "border-teal-500 bg-teal-50 text-teal-700"
                  : "border-stone-200 text-stone-600 hover:border-teal-300 hover:text-teal-700"
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-stone-100 text-stone-500">{icon}</span>
      <div>
        <p className="text-sm font-semibold leading-none">{value}</p>
        <p className="mt-1 text-xs text-stone-500">{label}</p>
      </div>
    </div>
  )
}
