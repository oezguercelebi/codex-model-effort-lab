import { useMemo, useState } from "react"
import {
  ArrowDownUp,
  CalendarDays,
  Car,
  Check,
  Clock3,
  Coffee,
  Compass,
  Heart,
  MapPin,
  Mountain,
  Plane,
  Plus,
  Star,
  Train,
  Users,
  Utensils,
  WalletCards,
} from "lucide-react"

type Destination = {
  id: string
  name: string
  region: string
  vibe: string
  summary: string
  fit: string
  travelMode: "Train" | "Drive" | "Flight"
  travelTime: string
  travelHours: number
  budget: number
  stay: string
  bestFor: string[]
  weather: string
  votes: number
  accent: string
  gradient: string
  highlights: string[]
  itinerary: {
    day: string
    title: string
    items: string[]
  }[]
}

const friends = ["Maya", "Jonah", "Priya", "Theo", "Sam"]

const destinations: Destination[] = [
  {
    id: "lake-como",
    name: "Lake Como",
    region: "Italy",
    vibe: "Scenic rail weekend",
    summary:
      "Easy lake towns, ferry rides, mountain views, and long dinners that still feel doable in two nights.",
    fit: "Best all-around pick",
    travelMode: "Train",
    travelTime: "4h 45m",
    travelHours: 4.75,
    budget: 420,
    stay: "Boutique guesthouse",
    bestFor: ["Views", "Food", "Low planning"],
    weather: "24 C, clear evenings",
    votes: 3,
    accent: "bg-emerald-500",
    gradient: "from-emerald-900 via-teal-700 to-sky-600",
    highlights: ["Ferry pass", "Villa gardens", "Pasta class"],
    itinerary: [
      {
        day: "Friday",
        title: "Arrive by the water",
        items: ["Train after work", "Check in near the ferry pier", "Late risotto dinner"],
      },
      {
        day: "Saturday",
        title: "Villas and villages",
        items: ["Espresso by the harbor", "Villa garden walk", "Sunset ferry to Bellagio"],
      },
      {
        day: "Sunday",
        title: "Slow morning",
        items: ["Lakeside brunch", "Swim or short hike", "Return train at 15:40"],
      },
    ],
  },
  {
    id: "black-forest",
    name: "Black Forest",
    region: "Germany",
    vibe: "Cabin reset",
    summary:
      "Forest trails, thermal baths, bakeries, and a quiet cabin base with the lowest total spend.",
    fit: "Most budget-friendly",
    travelMode: "Drive",
    travelTime: "2h 20m",
    travelHours: 2.3,
    budget: 260,
    stay: "Two-bedroom cabin",
    bestFor: ["Nature", "Wellness", "Budget"],
    weather: "20 C, light breeze",
    votes: 2,
    accent: "bg-lime-500",
    gradient: "from-stone-900 via-green-800 to-lime-700",
    highlights: ["Thermal spa", "Waterfall loop", "Cake stop"],
    itinerary: [
      {
        day: "Friday",
        title: "Cabin check-in",
        items: ["Shared rental car pickup", "Grocery stop", "Fireplace dinner"],
      },
      {
        day: "Saturday",
        title: "Trails and spa",
        items: ["Waterfall hike", "Lunch in Triberg", "Thermal baths reservation"],
      },
      {
        day: "Sunday",
        title: "Bakery route home",
        items: ["Forest breakfast", "Scenic drive", "Black Forest cake before leaving"],
      },
    ],
  },
  {
    id: "porto",
    name: "Porto",
    region: "Portugal",
    vibe: "Food and river city",
    summary:
      "A lively flight weekend with tiled streets, river views, seafood, wine cellars, and late-night music.",
    fit: "Best nightlife",
    travelMode: "Flight",
    travelTime: "2h 55m",
    travelHours: 2.9,
    budget: 510,
    stay: "Central apartment",
    bestFor: ["Food", "Nightlife", "Culture"],
    weather: "26 C, sunny",
    votes: 1,
    accent: "bg-rose-500",
    gradient: "from-rose-900 via-orange-700 to-sky-700",
    highlights: ["Seafood crawl", "Douro sunset", "Live fado"],
    itinerary: [
      {
        day: "Friday",
        title: "Ribeira arrival",
        items: ["Evening flight", "Riverfront check-in", "Petiscos crawl"],
      },
      {
        day: "Saturday",
        title: "Tiles, views, wine",
        items: ["Clerigos tower", "Tiled station photos", "Cellar tasting after sunset"],
      },
      {
        day: "Sunday",
        title: "Atlantic lunch",
        items: ["Tram to Foz", "Seafood lunch", "Airport transfer at 16:00"],
      },
    ],
  },
  {
    id: "annecy",
    name: "Annecy",
    region: "France",
    vibe: "Alpine lake town",
    summary:
      "Clear water, bike paths, old-town markets, and mountain views without needing a big itinerary.",
    fit: "Easiest logistics",
    travelMode: "Train",
    travelTime: "3h 35m",
    travelHours: 3.6,
    budget: 350,
    stay: "Canal-side hotel",
    bestFor: ["Swimming", "Markets", "Views"],
    weather: "23 C, crisp morning",
    votes: 2,
    accent: "bg-cyan-500",
    gradient: "from-cyan-900 via-blue-700 to-emerald-600",
    highlights: ["Lake bikes", "Market picnic", "Canal stroll"],
    itinerary: [
      {
        day: "Friday",
        title: "Canal-side first look",
        items: ["Direct train", "Check in near old town", "Fondue dinner"],
      },
      {
        day: "Saturday",
        title: "Lake day",
        items: ["Market picnic shop", "Cycle the lake path", "Swim at Plage d'Albigny"],
      },
      {
        day: "Sunday",
        title: "Views before home",
        items: ["Cafe breakfast", "Short hike to a viewpoint", "Train home at 14:55"],
      },
    ],
  },
]

const modeIcon = {
  Train,
  Drive: Car,
  Flight: Plane,
}

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})

export default function App() {
  const [activeId, setActiveId] = useState(destinations[0].id)
  const [votes, setVotes] = useState<Record<string, number>>(
    Object.fromEntries(destinations.map((destination) => [destination.id, destination.votes])),
  )
  const [myPick, setMyPick] = useState<string>(destinations[0].id)
  const [sortBy, setSortBy] = useState<"votes" | "budget" | "time">("votes")
  const [confirmedTasks, setConfirmedTasks] = useState<string[]>(["stay", "dinner"])

  const enrichedDestinations = useMemo(
    () =>
      destinations
        .map((destination) => ({ ...destination, currentVotes: votes[destination.id] ?? 0 }))
        .sort((a, b) => {
          if (sortBy === "budget") return a.budget - b.budget
          if (sortBy === "time") return a.travelHours - b.travelHours
          return b.currentVotes - a.currentVotes || a.budget - b.budget
        }),
    [sortBy, votes],
  )

  const activeDestination =
    destinations.find((destination) => destination.id === activeId) ?? destinations[0]

  const winner = useMemo(
    () =>
      [...destinations].sort(
        (a, b) => (votes[b.id] ?? 0) - (votes[a.id] ?? 0) || a.budget - b.budget,
      )[0],
    [votes],
  )

  const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0)
  const averageBudget = Math.round(
    destinations.reduce((sum, destination) => sum + destination.budget, 0) / destinations.length,
  )

  function castVote(destinationId: string) {
    setVotes((currentVotes) => ({
      ...currentVotes,
      [myPick]: Math.max((currentVotes[myPick] ?? 1) - 1, 0),
      [destinationId]: (currentVotes[destinationId] ?? 0) + 1,
    }))
    setMyPick(destinationId)
    setActiveId(destinationId)
  }

  function toggleTask(taskId: string) {
    setConfirmedTasks((tasks) =>
      tasks.includes(taskId) ? tasks.filter((task) => task !== taskId) : [...tasks, taskId],
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-stone-950">
      <section className="relative isolate overflow-hidden bg-stone-950 text-white">
        <img
          src="/weekender-travel-collage.png"
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(12,10,9,0.90),rgba(12,10,9,0.58),rgba(12,10,9,0.16))]" />
        <div className="mx-auto flex min-h-[590px] max-w-7xl flex-col justify-between px-4 py-5 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-full bg-white text-stone-950 shadow-sm">
                <Compass className="size-5" aria-hidden="true" />
              </div>
              <span className="text-lg font-semibold">Weekender</span>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm text-white/90 backdrop-blur sm:flex">
              <Users className="size-4" aria-hidden="true" />
              {friends.length} friends planning
            </div>
          </nav>

          <div className="grid items-end gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white/90 backdrop-blur">
                <CalendarDays className="size-4" aria-hidden="true" />
                Friday to Sunday
              </div>
              <h1 className="mt-6 max-w-2xl text-5xl font-semibold leading-[0.98] tracking-normal sm:text-6xl lg:text-7xl">
                Pick the trip everyone can say yes to.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/82">
                Compare the short list, see the real cost and travel tradeoffs, vote with the
                group, then turn the winning destination into a simple weekend plan.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#destinations"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-950 shadow-sm transition hover:bg-stone-100"
                >
                  Compare trips
                  <ArrowDownUp className="size-4" aria-hidden="true" />
                </a>
                <a
                  href="#itinerary"
                  className="inline-flex items-center gap-2 rounded-full border border-white/24 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/18"
                >
                  View winner
                  <Star className="size-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <aside className="rounded-[8px] border border-white/18 bg-white/12 p-5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white/70">Current winner</p>
                  <h2 className="mt-1 text-2xl font-semibold">{winner.name}</h2>
                </div>
                <span className="rounded-full bg-lime-300 px-3 py-1 text-sm font-semibold text-stone-950">
                  {votes[winner.id]} votes
                </span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <Metric label="Avg budget" value={currency.format(averageBudget)} />
                <Metric label="Fastest" value="2h 20m" />
                <Metric label="Options" value="4" />
              </div>
              <div className="mt-5 space-y-3">
                {destinations.map((destination) => {
                  const share = totalVotes ? ((votes[destination.id] ?? 0) / totalVotes) * 100 : 0
                  return (
                    <button
                      key={destination.id}
                      type="button"
                      onClick={() => setActiveId(destination.id)}
                      className="group w-full text-left"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-white">{destination.name}</span>
                        <span className="text-white/70">{votes[destination.id]} votes</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/18">
                        <div
                          className={`h-full rounded-full ${destination.accent} transition-all group-hover:brightness-110`}
                          style={{ width: `${share}%` }}
                        />
                      </div>
                    </button>
                  )
                })}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" id="destinations">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">Destination board</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">
              Compare the weekend shortlist
            </h2>
          </div>
          <div className="flex rounded-full bg-white p-1 shadow-sm ring-1 ring-stone-200">
            {[
              ["votes", "Votes"],
              ["budget", "Budget"],
              ["time", "Travel time"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setSortBy(value as typeof sortBy)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  sortBy === value ? "bg-stone-950 text-white" : "text-stone-600 hover:text-stone-950"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-4">
          {enrichedDestinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              isActive={activeId === destination.id}
              isMyPick={myPick === destination.id}
              onSelect={() => setActiveId(destination.id)}
              onVote={() => castVote(destination.id)}
            />
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
          <section className="overflow-hidden rounded-[8px] bg-white shadow-sm ring-1 ring-stone-200">
            <div className={`h-44 bg-gradient-to-br ${activeDestination.gradient} p-6 text-white`}>
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white/76">{activeDestination.region}</p>
                    <h3 className="mt-1 text-4xl font-semibold">{activeDestination.name}</h3>
                  </div>
                  <span className="rounded-full bg-white/18 px-3 py-1 text-sm font-semibold backdrop-blur">
                    {activeDestination.fit}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeDestination.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full bg-white/16 px-3 py-1 text-sm font-medium backdrop-blur"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-lg leading-8 text-stone-700">{activeDestination.summary}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Detail icon={WalletCards} label="Expected budget" value={currency.format(activeDestination.budget)} />
                <Detail icon={Clock3} label="Travel time" value={activeDestination.travelTime} />
                <Detail icon={MapPin} label="Stay" value={activeDestination.stay} />
              </div>
            </div>
          </section>

          <section className="rounded-[8px] bg-stone-950 p-5 text-white shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase text-lime-300">Group vote</p>
                <h3 className="mt-2 text-2xl font-semibold">Cast your pick</h3>
              </div>
              <div className="flex -space-x-2">
                {friends.map((friend) => (
                  <div
                    key={friend}
                    title={friend}
                    className="grid size-9 place-items-center rounded-full border-2 border-stone-950 bg-white text-xs font-bold text-stone-950"
                  >
                    {friend[0]}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {destinations.map((destination) => (
                <button
                  key={destination.id}
                  type="button"
                  onClick={() => castVote(destination.id)}
                  className={`flex items-center justify-between rounded-[8px] border p-4 text-left transition ${
                    myPick === destination.id
                      ? "border-lime-300 bg-lime-300 text-stone-950"
                      : "border-white/12 bg-white/7 text-white hover:bg-white/12"
                  }`}
                >
                  <span>
                    <span className="block font-semibold">{destination.name}</span>
                    <span className={myPick === destination.id ? "text-stone-700" : "text-white/62"}>
                      {votes[destination.id]} group votes
                    </span>
                  </span>
                  {myPick === destination.id ? (
                    <Check className="size-5" aria-hidden="true" />
                  ) : (
                    <Plus className="size-5" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="bg-white py-10" id="itinerary">
        <div className="mx-auto grid max-w-7xl gap-7 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-700">Winning plan</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal sm:text-4xl">
              {winner.name} is ready to book
            </h2>
            <p className="mt-4 leading-7 text-stone-600">
              The plan stays intentionally light: enough structure for reservations and travel,
              enough open space for the weekend to feel relaxed.
            </p>
            <div className="mt-6 grid gap-3">
              {[
                ["stay", "Hold the guesthouse", "Refundable room for five"],
                ["dinner", "Book Saturday dinner", "Table at 20:00 near the water"],
                ["tickets", "Buy travel tickets", `${winner.travelMode} option, ${winner.travelTime}`],
              ].map(([id, title, description]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggleTask(id)}
                  className="flex items-center gap-3 rounded-[8px] border border-stone-200 bg-[#f7f4ee] p-4 text-left transition hover:border-stone-300"
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full ${
                      confirmedTasks.includes(id) ? "bg-emerald-600 text-white" : "bg-white text-stone-400"
                    }`}
                  >
                    <Check className="size-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold">{title}</span>
                    <span className="text-sm text-stone-600">{description}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {winner.itinerary.map((day, index) => (
              <article
                key={day.day}
                className="rounded-[8px] border border-stone-200 bg-[#fbfaf7] p-5 shadow-sm"
              >
                <div className="flex gap-4">
                  <div className="grid size-11 shrink-0 place-items-center rounded-full bg-stone-950 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-emerald-700">{day.day}</p>
                    <h3 className="mt-1 text-xl font-semibold">{day.title}</h3>
                    <div className="mt-4 grid gap-3">
                      {day.items.map((item, itemIndex) => {
                        const icons = [Train, Coffee, Utensils, Mountain]
                        const Icon = icons[itemIndex % icons.length]
                        return (
                          <div key={item} className="flex items-center gap-3 text-stone-700">
                            <Icon className="size-4 shrink-0 text-stone-500" aria-hidden="true" />
                            <span>{item}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] bg-white/12 p-3">
      <p className="text-xs text-white/60">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  )
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof WalletCards
  label: string
  value: string
}) {
  return (
    <div className="rounded-[8px] border border-stone-200 bg-[#f7f4ee] p-4">
      <Icon className="size-5 text-emerald-700" aria-hidden="true" />
      <p className="mt-3 text-sm text-stone-500">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  )
}

function DestinationCard({
  destination,
  isActive,
  isMyPick,
  onSelect,
  onVote,
}: {
  destination: Destination & { currentVotes: number }
  isActive: boolean
  isMyPick: boolean
  onSelect: () => void
  onVote: () => void
}) {
  const ModeIcon = modeIcon[destination.travelMode]

  return (
    <article
      className={`rounded-[8px] bg-white p-4 shadow-sm ring-1 transition ${
        isActive ? "ring-2 ring-stone-950" : "ring-stone-200 hover:ring-stone-300"
      }`}
    >
      <button type="button" onClick={onSelect} className="block w-full text-left">
        <div className={`h-24 rounded-[8px] bg-gradient-to-br ${destination.gradient} p-4 text-white`}>
          <div className="flex h-full flex-col justify-between">
            <MapPin className="size-5" aria-hidden="true" />
            <div>
              <p className="text-xs font-medium text-white/75">{destination.region}</p>
              <h3 className="text-xl font-semibold">{destination.name}</h3>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm font-semibold text-emerald-700">{destination.vibe}</p>
        <p className="mt-2 min-h-[60px] text-sm leading-6 text-stone-600">{destination.summary}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <span className="flex items-center gap-2 rounded-[8px] bg-stone-100 px-3 py-2">
            <WalletCards className="size-4 text-stone-500" aria-hidden="true" />
            {currency.format(destination.budget)}
          </span>
          <span className="flex items-center gap-2 rounded-[8px] bg-stone-100 px-3 py-2">
            <ModeIcon className="size-4 text-stone-500" aria-hidden="true" />
            {destination.travelTime}
          </span>
        </div>
      </button>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-stone-600">{destination.currentVotes} votes</span>
        <button
          type="button"
          onClick={onVote}
          className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${
            isMyPick
              ? "bg-rose-100 text-rose-700"
              : "bg-stone-950 text-white hover:bg-stone-800"
          }`}
        >
          <Heart className={`size-4 ${isMyPick ? "fill-current" : ""}`} aria-hidden="true" />
          {isMyPick ? "Your pick" : "Vote"}
        </button>
      </div>
    </article>
  )
}
