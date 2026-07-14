import {
  CalendarDays,
  Check,
  Clock3,
  Coffee,
  Crown,
  Heart,
  MapPin,
  MessageCircle,
  Minus,
  Mountain,
  Plus,
  Sparkles,
  Star,
  Train,
  Users,
  Utensils,
  Wallet,
} from "lucide-react"
import { useMemo, useState } from "react"

type Destination = {
  id: string
  name: string
  region: string
  vibe: string
  summary: string
  accent: string
  scene: "river" | "mountain" | "coast"
  budget: number
  travelHours: number
  lodging: string
  votes: number
  liked: boolean
  highlights: string[]
  goodFor: string[]
  itinerary: Array<{ time: string; title: string; detail: string; icon: "food" | "coffee" | "outdoor" | "night" }>
}

const destinations: Destination[] = [
  {
    id: "hudson",
    name: "Hudson Valley",
    region: "New York",
    vibe: "Design inns, river towns, orchard stops",
    summary: "A low-friction rail weekend with great food, gentle hikes, and enough small-town browsing for mixed-energy groups.",
    accent: "from-emerald-600 to-sky-500",
    scene: "river",
    budget: 485,
    travelHours: 2.2,
    lodging: "Boutique inn",
    votes: 7,
    liked: true,
    highlights: ["Amtrak-friendly", "Farm dinners", "Short hikes"],
    goodFor: ["Food", "Nature", "No car"],
    itinerary: [
      { time: "Fri 6:30 PM", title: "Check in near Warren Street", detail: "Drop bags, grab natural wine, and keep dinner walkable.", icon: "coffee" },
      { time: "Sat 10:00 AM", title: "Olana and river views", detail: "Easy scenic loop with a flexible cafe stop after.", icon: "outdoor" },
      { time: "Sat 7:30 PM", title: "Shared farm-table dinner", detail: "Book one long reservation so the group can settle in.", icon: "food" },
      { time: "Sun 11:00 AM", title: "Bakery run and train home", detail: "Pick up pastries before the afternoon return.", icon: "coffee" },
    ],
  },
  {
    id: "asheville",
    name: "Asheville",
    region: "North Carolina",
    vibe: "Blue Ridge drives, breweries, live music",
    summary: "Best all-around choice for a group that wants mountain air without giving up a lively dinner and music scene.",
    accent: "from-rose-600 to-amber-500",
    scene: "mountain",
    budget: 565,
    travelHours: 4.6,
    lodging: "Downtown rental",
    votes: 9,
    liked: false,
    highlights: ["Peak scenery", "Brewery crawl", "Live music"],
    goodFor: ["Nightlife", "Views", "Road trip"],
    itinerary: [
      { time: "Fri 8:00 PM", title: "South Slope arrival round", detail: "Meet at a brewery with food trucks and room for late arrivals.", icon: "night" },
      { time: "Sat 9:30 AM", title: "Blue Ridge overlook drive", detail: "Two short stops, one picnic, and no all-day commitment.", icon: "outdoor" },
      { time: "Sat 6:45 PM", title: "Downtown dinner booking", detail: "Reserve early, then walk to a small venue show.", icon: "food" },
      { time: "Sun 10:30 AM", title: "Brunch and vintage shops", detail: "Slow morning before the drive or airport run.", icon: "coffee" },
    ],
  },
  {
    id: "savannah",
    name: "Savannah",
    region: "Georgia",
    vibe: "Historic squares, coastal plates, late walks",
    summary: "A warm, social weekend with strong strolling, photogenic stays, and the easiest itinerary for relaxed travelers.",
    accent: "from-cyan-600 to-lime-500",
    scene: "coast",
    budget: 525,
    travelHours: 3.8,
    lodging: "Historic home",
    votes: 6,
    liked: false,
    highlights: ["Walkable core", "Coastal seafood", "Sunny odds"],
    goodFor: ["Relaxed", "Dining", "Photos"],
    itinerary: [
      { time: "Fri 7:00 PM", title: "Squares and supper", detail: "Take the scenic walk to dinner through Monterey and Madison Square.", icon: "food" },
      { time: "Sat 10:30 AM", title: "Design district wander", detail: "Coffee, bookshops, and an easy group lunch nearby.", icon: "coffee" },
      { time: "Sat 4:00 PM", title: "Tybee sunset option", detail: "Split off for beach time or stay in town for galleries.", icon: "outdoor" },
      { time: "Sun 11:30 AM", title: "Final patio brunch", detail: "One last reservation before departures begin.", icon: "food" },
    ],
  },
]

const friends = ["Maya", "Theo", "Priya", "Sam", "Alex", "Nora"]

const iconFor = {
  food: Utensils,
  coffee: Coffee,
  outdoor: Mountain,
  night: Sparkles,
}

export default function App() {
  const [trips, setTrips] = useState(destinations)
  const [selectedId, setSelectedId] = useState("asheville")
  const [sortBy, setSortBy] = useState<"winner" | "budget" | "travel">("winner")
  const [splitCosts, setSplitCosts] = useState(true)

  const sortedTrips = useMemo(() => {
    return [...trips].sort((a, b) => {
      if (sortBy === "budget") return a.budget - b.budget
      if (sortBy === "travel") return a.travelHours - b.travelHours
      return b.votes - a.votes
    })
  }, [trips, sortBy])

  const winner = useMemo(() => [...trips].sort((a, b) => b.votes - a.votes)[0], [trips])
  const selected = trips.find((trip) => trip.id === selectedId) ?? winner

  function vote(id: string, direction: 1 | -1) {
    setTrips((current) =>
      current.map((trip) =>
        trip.id === id ? { ...trip, votes: Math.max(0, trip.votes + direction), liked: direction > 0 ? true : trip.liked } : trip,
      ),
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f3ec] text-stone-950">
      <section className="relative overflow-hidden bg-stone-950 text-white">
        <TripArt scene={winner.scene} className="absolute inset-0 opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,10,9,0.9),rgba(12,10,9,0.62),rgba(12,10,9,0.22))]" />
        <div className="relative mx-auto grid min-h-[520px] max-w-7xl items-end gap-8 px-4 pb-8 pt-6 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <div className="pb-4">
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-white/80">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-2 backdrop-blur">
                <CalendarDays size={16} /> Aug 16-18
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-2 backdrop-blur">
                <Users size={16} /> {friends.length} friends
              </span>
            </div>
            <p className="text-sm font-semibold uppercase text-amber-200">Weekender</p>
            <h1 className="mt-3 max-w-3xl text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
              Pick the weekend everyone can get behind.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">
              Compare realistic trip options, vote with the group, and turn the winning destination into a simple plan.
            </p>
          </div>
          <aside className="rounded-lg border border-white/16 bg-white/12 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white/70">Current leader</p>
                <h2 className="mt-1 text-3xl font-semibold">{winner.name}</h2>
                <p className="mt-2 text-white/72">{winner.vibe}</p>
              </div>
              <Crown className="shrink-0 text-amber-200" size={34} />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <Metric icon={Wallet} label="Budget" value={`$${winner.budget}`} />
              <Metric icon={Train} label="Travel" value={`${winner.travelHours}h`} />
              <Metric icon={Heart} label="Votes" value={`${winner.votes}`} />
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="space-y-5">
          <div className="flex flex-col gap-3 rounded-lg border border-stone-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-grid grid-cols-3 gap-1 rounded-md bg-stone-100 p-1">
              {[
                ["winner", "Popular"],
                ["budget", "Budget"],
                ["travel", "Fastest"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setSortBy(value as typeof sortBy)}
                  className={`rounded px-3 py-2 text-sm font-semibold transition ${
                    sortBy === value ? "bg-white text-stone-950 shadow-sm" : "text-stone-600 hover:text-stone-950"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSplitCosts((value) => !value)}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 hover:border-stone-300 hover:bg-stone-50"
            >
              {splitCosts ? <Check size={16} /> : <Users size={16} />}
              {splitCosts ? "Per person" : "Group total"}
            </button>
          </div>

          <div className="grid gap-4">
            {sortedTrips.map((trip) => {
              const isSelected = selected.id === trip.id
              const isWinner = winner.id === trip.id
              return (
                <article
                  key={trip.id}
                  className={`overflow-hidden rounded-lg border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                    isSelected ? "border-stone-950" : "border-stone-200"
                  }`}
                >
                  <button onClick={() => setSelectedId(trip.id)} className="grid w-full text-left md:grid-cols-[240px_1fr]">
                    <div className="relative h-56 md:h-full">
                      <TripArt scene={trip.scene} className="h-full w-full" />
                      <span className={`absolute left-3 top-3 rounded-full bg-gradient-to-r ${trip.accent} px-3 py-1 text-sm font-semibold text-white`}>
                        {isWinner ? "Winning" : trip.region}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h2 className="text-2xl font-semibold">{trip.name}</h2>
                          <p className="mt-1 text-stone-600">{trip.vibe}</p>
                        </div>
                        <div className="flex items-center gap-2 rounded-md bg-stone-100 px-3 py-2 font-semibold">
                          <Heart className={trip.liked ? "fill-rose-500 text-rose-500" : "text-stone-500"} size={18} />
                          {trip.votes}
                        </div>
                      </div>
                      <p className="mt-4 leading-7 text-stone-700">{trip.summary}</p>
                      <div className="mt-5 grid grid-cols-3 gap-3">
                        <Stat label={splitCosts ? "Per person" : "Group"} value={`$${splitCosts ? trip.budget : trip.budget * friends.length}`} />
                        <Stat label="Door to door" value={`${trip.travelHours}h`} />
                        <Stat label="Stay" value={trip.lodging} />
                      </div>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {trip.highlights.map((highlight) => (
                          <span key={highlight} className="rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-700">
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                  <div className="flex items-center justify-between border-t border-stone-100 px-5 py-3">
                    <p className="text-sm text-stone-500">{isSelected ? "Selected for details" : "Tap card to inspect"}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => vote(trip.id, -1)}
                        className="grid size-10 place-items-center rounded-md border border-stone-200 text-stone-600 hover:bg-stone-50"
                        aria-label={`Remove vote from ${trip.name}`}
                      >
                        <Minus size={17} />
                      </button>
                      <button
                        onClick={() => vote(trip.id, 1)}
                        className="inline-flex h-10 items-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-semibold text-white hover:bg-stone-800"
                      >
                        <Plus size={17} /> Vote
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase text-stone-500">Trip board</p>
                <h2 className="mt-1 text-2xl font-semibold">{selected.name}</h2>
              </div>
              <MapPin className="text-stone-500" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {selected.goodFor.map((item) => (
                <div key={item} className="rounded-md bg-[#f7f3ec] p-3">
                  <Star className="mb-3 fill-amber-300 text-amber-500" size={17} />
                  <p className="font-semibold">{item}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              <Progress label="Budget comfort" value={Math.max(22, 100 - (selected.budget - 420) / 2.2)} />
              <Progress label="Travel ease" value={Math.max(28, 100 - selected.travelHours * 11)} />
              <Progress label="Group pull" value={selected.votes * 9} />
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-md bg-stone-950 text-white">
                <Clock3 size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase text-stone-500">Winning itinerary</p>
                <h2 className="text-xl font-semibold">{winner.name}</h2>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {winner.itinerary.map((item) => {
                const Icon = iconFor[item.icon]
                return (
                  <div key={item.time} className="grid grid-cols-[42px_1fr] gap-3">
                    <div className="grid size-10 place-items-center rounded-md bg-stone-100 text-stone-700">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-500">{item.time}</p>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-stone-600">{item.detail}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <h2 className="font-semibold">Group notes</h2>
            </div>
            <div className="mt-4 flex -space-x-2">
              {friends.map((friend, index) => (
                <div
                  key={friend}
                  className={`grid size-9 place-items-center rounded-full border-2 border-white bg-gradient-to-br ${
                    ["from-rose-400 to-amber-300", "from-sky-400 to-emerald-300", "from-violet-400 to-pink-300"][index % 3]
                  } text-sm font-bold text-white`}
                  title={friend}
                >
                  {friend[0]}
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-md bg-stone-100 p-3 text-sm leading-6 text-stone-700">
              Consensus is strongest when travel stays under five hours and Saturday has one bookable dinner plus one flexible daytime block.
            </p>
          </section>
        </aside>
      </section>
    </main>
  )
}

function Metric({ icon: Icon, label, value }: { icon: typeof Wallet; label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/12 p-3">
      <Icon size={18} className="text-white/74" />
      <p className="mt-3 text-xs text-white/58">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md bg-[#f7f3ec] p-3">
      <p className="text-xs font-semibold uppercase text-stone-500">{label}</p>
      <p className="mt-1 truncate font-semibold">{value}</p>
    </div>
  )
}

function Progress({ label, value }: { label: string; value: number }) {
  const normalized = Math.min(100, Math.max(0, value))

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-stone-700">{label}</span>
        <span className="text-stone-500">{Math.round(normalized)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-stone-100">
        <div className="h-full rounded-full bg-stone-950" style={{ width: `${normalized}%` }} />
      </div>
    </div>
  )
}

function TripArt({ scene, className = "" }: { scene: Destination["scene"]; className?: string }) {
  const sky =
    scene === "mountain"
      ? "from-[#8fc7d6] via-[#f6c177] to-[#f7efe0]"
      : scene === "coast"
        ? "from-[#7bc7d7] via-[#bde7dc] to-[#ffe6b8]"
        : "from-[#7db6c8] via-[#cfe8d7] to-[#f6d28b]"

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${sky} ${className}`} aria-hidden="true">
      <div className="absolute inset-x-[-8%] bottom-[-18%] h-2/3 rounded-[50%] bg-gradient-to-br from-stone-950/20 to-stone-950/5" />
      {scene === "mountain" ? (
        <>
          <div className="absolute bottom-[20%] left-[-8%] h-48 w-72 rotate-[-8deg] bg-emerald-800/82 [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
          <div className="absolute bottom-[18%] right-[-5%] h-64 w-96 rotate-[7deg] bg-stone-800/78 [clip-path:polygon(50%_0,100%_100%,0_100%)]" />
          <div className="absolute bottom-0 left-0 h-[28%] w-full bg-emerald-950/64" />
        </>
      ) : scene === "coast" ? (
        <>
          <div className="absolute bottom-0 left-0 h-[35%] w-full bg-cyan-700/64" />
          <div className="absolute bottom-[27%] left-[-10%] h-16 w-[120%] rounded-[50%] bg-white/38" />
          <div className="absolute bottom-0 right-0 h-[18%] w-full bg-amber-300/70" />
        </>
      ) : (
        <>
          <div className="absolute bottom-0 left-0 h-[30%] w-full bg-sky-800/58" />
          <div className="absolute bottom-[23%] left-[-5%] h-20 w-[110%] rounded-[50%] bg-emerald-800/50" />
          <div className="absolute bottom-[34%] right-[8%] h-28 w-36 bg-stone-800/70 [clip-path:polygon(50%_0,100%_45%,100%_100%,0_100%,0_45%)]" />
        </>
      )}
      <div className="absolute right-[14%] top-[14%] size-20 rounded-full bg-amber-200/86 blur-[1px]" />
    </div>
  )
}
