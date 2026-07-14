import {
  ArrowDownUp,
  CalendarDays,
  Car,
  Check,
  ChevronRight,
  Clock3,
  Coffee,
  DollarSign,
  Heart,
  Hotel,
  MapPin,
  Mountain,
  Plane,
  Plus,
  Sparkles,
  Star,
  Train,
  Utensils,
  Vote,
  WalletCards,
} from "lucide-react"
import { useMemo, useState } from "react"
import heroImage from "./assets/weekender-hero.png"

type Destination = {
  id: string
  name: string
  area: string
  vibe: string
  summary: string
  travelMode: "Train" | "Car" | "Flight"
  travelHours: number
  budget: number
  lodging: number
  food: number
  activities: number
  match: number
  weather: string
  tags: string[]
  bestFor: string
  votes: string[]
  imagePosition: string
  color: string
  itinerary: {
    day: string
    title: string
    items: string[]
  }[]
}

const friends = ["Mia", "Theo", "Jules", "Sam", "Priya", "Noah"]

const destinations: Destination[] = [
  {
    id: "hudson",
    name: "Hudson Valley",
    area: "New York",
    vibe: "Riverside inns, farm dinners, antique shops",
    summary:
      "An easy train weekend with river views, small-town restaurants, and enough open time for a low-stress group reset.",
    travelMode: "Train",
    travelHours: 2.4,
    budget: 470,
    lodging: 255,
    food: 135,
    activities: 80,
    match: 94,
    weather: "73° and sunny",
    tags: ["No car needed", "Food", "Walkable"],
    bestFor: "A mellow weekend where nobody needs to over-plan.",
    votes: ["Mia", "Priya", "Noah"],
    imagePosition: "63% 44%",
    color: "#0f766e",
    itinerary: [
      {
        day: "Friday",
        title: "Arrive by rail",
        items: ["5:40 PM train north", "Check into two-room inn", "Late dinner on Warren Street"],
      },
      {
        day: "Saturday",
        title: "River town crawl",
        items: ["Coffee and bakery run", "Olana morning walk", "Shared plates reservation at 7:30 PM"],
      },
      {
        day: "Sunday",
        title: "Slow exit",
        items: ["Farm stand breakfast", "Antique market loop", "2:10 PM return train"],
      },
    ],
  },
  {
    id: "asheville",
    name: "Asheville",
    area: "North Carolina",
    vibe: "Blue Ridge hikes, breweries, live music",
    summary:
      "The most outdoorsy option, with mountain trails close to town and a strong dinner-and-music plan for Saturday night.",
    travelMode: "Flight",
    travelHours: 4.8,
    budget: 650,
    lodging: 305,
    food: 175,
    activities: 170,
    match: 88,
    weather: "68° with clouds",
    tags: ["Hiking", "Music", "Breweries"],
    bestFor: "Friends who want a real change of scenery and one bigger activity.",
    votes: ["Theo", "Sam"],
    imagePosition: "83% 62%",
    color: "#2563eb",
    itinerary: [
      {
        day: "Friday",
        title: "Land and settle",
        items: ["Afternoon flight", "Apartment check-in downtown", "Casual brewery dinner"],
      },
      {
        day: "Saturday",
        title: "Blue Ridge day",
        items: ["Early trailhead shuttle", "Picnic at an overlook", "Live set after dinner"],
      },
      {
        day: "Sunday",
        title: "Market morning",
        items: ["Coffee and galleries", "Pack snacks for flight", "3:35 PM departure"],
      },
    ],
  },
  {
    id: "montreal",
    name: "Montreal",
    area: "Quebec",
    vibe: "Cafe streets, design shops, late dinners",
    summary:
      "A city escape with the richest food plan and the highest walkability, offset by passport checks and a longer return day.",
    travelMode: "Flight",
    travelHours: 5.5,
    budget: 710,
    lodging: 330,
    food: 230,
    activities: 150,
    match: 82,
    weather: "71° and breezy",
    tags: ["City", "Food", "Nightlife"],
    bestFor: "The group that wants the trip to feel international without burning vacation days.",
    votes: ["Jules"],
    imagePosition: "63% 78%",
    color: "#be123c",
    itinerary: [
      {
        day: "Friday",
        title: "Old port evening",
        items: ["Carry-on only flight", "Metro to apartment", "Late dinner in Mile End"],
      },
      {
        day: "Saturday",
        title: "Neighborhood day",
        items: ["Bagels and coffee", "Design shops in Plateau", "Shared tasting menu"],
      },
      {
        day: "Sunday",
        title: "Brunch and border",
        items: ["Museum option", "Early airport transfer", "Back home by 8:45 PM"],
      },
    ],
  },
  {
    id: "tahoe",
    name: "Lake Tahoe",
    area: "California",
    vibe: "Clear water, pine trails, cabin cooking",
    summary:
      "The biggest nature payoff, but the rental car and cabin logistics make it better if the group agrees to a shared plan.",
    travelMode: "Car",
    travelHours: 6.2,
    budget: 590,
    lodging: 280,
    food: 120,
    activities: 190,
    match: 79,
    weather: "64° and crisp",
    tags: ["Lake", "Cabin", "Scenic drive"],
    bestFor: "A scenic recharge where the house and lake access matter most.",
    votes: [],
    imagePosition: "83% 84%",
    color: "#047857",
    itinerary: [
      {
        day: "Friday",
        title: "Road trip start",
        items: ["Leave at 2:00 PM", "Grocery stop near Truckee", "Cabin dinner and fire pit"],
      },
      {
        day: "Saturday",
        title: "Lake day",
        items: ["Morning kayak rental", "Beach picnic", "Group dinner at the cabin"],
      },
      {
        day: "Sunday",
        title: "Viewpoint loop",
        items: ["Short overlook hike", "Pack and clean cabin", "Return before 7:00 PM"],
      },
    ],
  },
]

const filterOptions = [
  { id: "all", label: "All trips" },
  { id: "budget", label: "Under $600" },
  { id: "fast", label: "Under 5h" },
  { id: "easy", label: "Low logistics" },
] as const

type FilterId = (typeof filterOptions)[number]["id"]
type SortId = "match" | "budget" | "time" | "votes"

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

function App() {
  const [selectedId, setSelectedId] = useState(destinations[0].id)
  const [userVote, setUserVote] = useState<string | null>(destinations[0].id)
  const [filter, setFilter] = useState<FilterId>("all")
  const [sort, setSort] = useState<SortId>("match")

  const rankedDestinations = useMemo(() => {
    const withVotes = destinations.map((destination) => ({
      ...destination,
      totalVotes: destination.votes.length + (userVote === destination.id ? 1 : 0),
    }))

    return withVotes
      .filter((destination) => {
        if (filter === "budget") return destination.budget < 600
        if (filter === "fast") return destination.travelHours < 5
        if (filter === "easy") return destination.travelMode !== "Flight"
        return true
      })
      .sort((a, b) => {
        if (sort === "budget") return a.budget - b.budget
        if (sort === "time") return a.travelHours - b.travelHours
        if (sort === "votes") return b.totalVotes - a.totalVotes || b.match - a.match
        return b.match - a.match
      })
  }, [filter, sort, userVote])

  const allDestinationsWithVotes = destinations.map((destination) => ({
    ...destination,
    totalVotes: destination.votes.length + (userVote === destination.id ? 1 : 0),
  }))

  const winner = [...allDestinationsWithVotes].sort(
    (a, b) => b.totalVotes - a.totalVotes || b.match - a.match,
  )[0]

  const selected =
    allDestinationsWithVotes.find((destination) => destination.id === selectedId) ?? winner

  const visibleSelected = rankedDestinations.some((destination) => destination.id === selected.id)
    ? selected
    : rankedDestinations[0] ?? selected

  const totalVotes = friends.length + (userVote ? 1 : 0)

  return (
    <main className="min-h-screen bg-[#f7f3ed] text-[#20201d]">
      <section className="relative overflow-hidden bg-[#123c3a] text-white">
        <img
          src={heroImage}
          alt="Weekend trip planning table with tickets, map, and destination postcards"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,38,37,0.94),rgba(10,38,37,0.68)_48%,rgba(10,38,37,0.16))]" />
        <div className="relative mx-auto grid min-h-[560px] max-w-7xl gap-8 px-4 py-5 sm:px-6 lg:grid-cols-[0.96fr_1.04fr] lg:px-8">
          <header className="col-span-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-white text-[#0f766e] shadow-lg shadow-black/20">
                <Sparkles size={21} />
              </div>
              <div>
                <p className="text-sm text-white/70">Weekender</p>
                <p className="font-semibold">Labor Day group plan</p>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-2 text-sm backdrop-blur md:flex">
              <CalendarDays size={16} />
              Vote closes Thursday at 6 PM
            </div>
          </header>

          <div className="flex max-w-2xl flex-col justify-end pb-4 lg:pb-12">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-white/14 px-3 py-2 text-sm text-white backdrop-blur">
              <Vote size={16} />
              {totalVotes} responses from the group
            </div>
            <h1 className="max-w-xl text-5xl font-semibold leading-[1.03] sm:text-6xl">
              Pick the weekend everyone can actually make.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/82">
              Compare trip ideas by budget, travel time, group fit, and votes. The winning plan
              stays ready with a practical three-day itinerary.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <HeroMetric icon={<MapPin size={18} />} label="Top choice" value={winner.name} />
              <HeroMetric
                icon={<WalletCards size={18} />}
                label="Expected cost"
                value={currency.format(winner.budget)}
              />
              <HeroMetric
                icon={<Clock3 size={18} />}
                label="Travel time"
                value={`${winner.travelHours}h`}
              />
            </div>
          </div>

          <aside className="self-end rounded-lg border border-white/18 bg-white/92 p-4 text-[#20201d] shadow-2xl shadow-black/25 backdrop-blur lg:mb-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#0f766e]">Current winner</p>
                <h2 className="mt-1 text-2xl font-semibold">{winner.name}</h2>
                <p className="mt-2 text-sm leading-6 text-[#62605a]">{winner.bestFor}</p>
              </div>
              <div className="rounded-lg bg-[#eef8f5] px-3 py-2 text-center">
                <p className="text-2xl font-semibold text-[#0f766e]">{winner.totalVotes}</p>
                <p className="text-xs text-[#62605a]">votes</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <MiniStat label="Match" value={`${winner.match}%`} />
              <MiniStat label="Weather" value={winner.weather} />
              <MiniStat label="Mode" value={winner.travelMode} />
            </div>
            <div className="mt-5 space-y-2">
              {allDestinationsWithVotes
                .sort((a, b) => b.totalVotes - a.totalVotes || b.match - a.match)
                .map((destination) => (
                  <VoteRow
                    key={destination.id}
                    destination={destination}
                    maxVotes={Math.max(1, totalVotes)}
                    isUserVote={userVote === destination.id}
                    onSelect={() => setSelectedId(destination.id)}
                  />
                ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-5">
            <div className="flex flex-col gap-4 rounded-lg border border-[#e5ded2] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setFilter(option.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      filter === option.id
                        ? "bg-[#20201d] text-white"
                        : "bg-[#f2eee7] text-[#59564f] hover:bg-[#e7e0d5]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 rounded-full bg-[#f2eee7] px-3 py-2 text-sm text-[#59564f]">
                <ArrowDownUp size={16} />
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortId)}
                  className="bg-transparent font-medium text-[#20201d] outline-none"
                  aria-label="Sort destinations"
                >
                  <option value="match">Best match</option>
                  <option value="votes">Most votes</option>
                  <option value="budget">Lowest budget</option>
                  <option value="time">Shortest travel</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {rankedDestinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  isSelected={visibleSelected.id === destination.id}
                  isUserVote={userVote === destination.id}
                  maxVotes={Math.max(...allDestinationsWithVotes.map((item) => item.totalVotes), 1)}
                  onSelect={() => setSelectedId(destination.id)}
                  onVote={() => setUserVote(userVote === destination.id ? null : destination.id)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <DetailPanel destination={visibleSelected} />
            <BudgetPanel destination={visibleSelected} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          <GroupPanel userVote={userVote} winner={winner} />
          <ItineraryPanel winner={winner} />
        </div>
      </section>
    </main>
  )
}

function HeroMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-white/18 bg-white/14 p-4 backdrop-blur">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/18">
        {icon}
      </div>
      <p className="text-xs text-white/64">{label}</p>
      <p className="mt-1 truncate text-lg font-semibold">{value}</p>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#f6f1ea] p-3">
      <p className="text-xs text-[#7a756d]">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  )
}

function VoteRow({
  destination,
  maxVotes,
  isUserVote,
  onSelect,
}: {
  destination: Destination & { totalVotes: number }
  maxVotes: number
  isUserVote: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="grid w-full grid-cols-[1fr_auto] items-center gap-3 rounded-lg p-2 text-left transition hover:bg-[#f6f1ea]"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold">{destination.name}</p>
          {isUserVote ? <Check className="shrink-0 text-[#0f766e]" size={15} /> : null}
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e7e0d5]">
          <div
            className="h-full rounded-full"
            style={{
              width: `${(destination.totalVotes / maxVotes) * 100}%`,
              backgroundColor: destination.color,
            }}
          />
        </div>
      </div>
      <span className="text-sm font-semibold">{destination.totalVotes}</span>
    </button>
  )
}

function DestinationCard({
  destination,
  isSelected,
  isUserVote,
  maxVotes,
  onSelect,
  onVote,
}: {
  destination: Destination & { totalVotes: number }
  isSelected: boolean
  isUserVote: boolean
  maxVotes: number
  onSelect: () => void
  onVote: () => void
}) {
  const travelIcon =
    destination.travelMode === "Train" ? (
      <Train size={16} />
    ) : destination.travelMode === "Car" ? (
      <Car size={16} />
    ) : (
      <Plane size={16} />
    )

  return (
    <article
      className={`overflow-hidden rounded-lg border bg-white shadow-sm transition ${
        isSelected ? "border-[#0f766e] ring-4 ring-[#0f766e]/12" : "border-[#e5ded2]"
      }`}
    >
      <button type="button" onClick={onSelect} className="block w-full text-left">
        <div className="relative h-44 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundPosition: destination.imagePosition,
              transform: "scale(1.16)",
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.52))]" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-white/82">{destination.area}</p>
              <h3 className="text-2xl font-semibold text-white">{destination.name}</h3>
            </div>
            <div className="rounded-lg bg-white/92 px-3 py-2 text-right text-[#20201d] backdrop-blur">
              <p className="text-lg font-semibold">{destination.match}%</p>
              <p className="text-xs text-[#62605a]">match</p>
            </div>
          </div>
        </div>
      </button>

      <div className="p-4">
        <p className="min-h-[3rem] text-sm leading-6 text-[#62605a]">{destination.summary}</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <CardMetric icon={<DollarSign size={15} />} label="Budget" value={currency.format(destination.budget)} />
          <CardMetric icon={travelIcon} label={destination.travelMode} value={`${destination.travelHours}h`} />
          <CardMetric icon={<Heart size={15} />} label="Votes" value={`${destination.totalVotes}`} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {destination.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-[#f2eee7] px-3 py-1 text-xs text-[#59564f]">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onVote}
            className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
              isUserVote
                ? "bg-[#0f766e] text-white hover:bg-[#115e59]"
                : "bg-[#20201d] text-white hover:bg-[#34332e]"
            }`}
          >
            {isUserVote ? <Check size={17} /> : <Plus size={17} />}
            {isUserVote ? "Your vote" : "Vote for this"}
          </button>
          <button
            type="button"
            onClick={onSelect}
            className="grid h-12 w-12 place-items-center rounded-lg bg-[#f2eee7] text-[#20201d] transition hover:bg-[#e7e0d5]"
            aria-label={`View ${destination.name} details`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#ece5da]">
          <div
            className="h-full rounded-full"
            style={{
              width: `${(destination.totalVotes / maxVotes) * 100}%`,
              backgroundColor: destination.color,
            }}
          />
        </div>
      </div>
    </article>
  )
}

function CardMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg bg-[#f6f1ea] p-3">
      <div className="mb-2 text-[#0f766e]">{icon}</div>
      <p className="text-xs text-[#7a756d]">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  )
}

function DetailPanel({ destination }: { destination: Destination & { totalVotes: number } }) {
  const travelIcon =
    destination.travelMode === "Train" ? (
      <Train size={18} />
    ) : destination.travelMode === "Car" ? (
      <Car size={18} />
    ) : (
      <Plane size={18} />
    )

  return (
    <aside className="rounded-lg border border-[#e5ded2] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#0f766e]">Compare detail</p>
          <h2 className="mt-1 text-2xl font-semibold">{destination.name}</h2>
        </div>
        <div className="rounded-lg bg-[#eef8f5] px-3 py-2 text-center">
          <p className="text-xl font-semibold text-[#0f766e]">{destination.totalVotes}</p>
          <p className="text-xs text-[#62605a]">votes</p>
        </div>
      </div>
      <p className="mt-4 leading-7 text-[#62605a]">{destination.vibe}</p>

      <div className="mt-5 space-y-3">
        <DetailLine icon={<Star size={18} />} label="Group fit" value={`${destination.match}%`} />
        <DetailLine icon={travelIcon} label="Travel" value={`${destination.travelHours}h by ${destination.travelMode.toLowerCase()}`} />
        <DetailLine icon={<Mountain size={18} />} label="Best for" value={destination.bestFor} />
        <DetailLine icon={<Coffee size={18} />} label="Forecast" value={destination.weather} />
      </div>
    </aside>
  )
}

function DetailLine({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex gap-3 rounded-lg bg-[#f6f1ea] p-3">
      <div className="mt-0.5 text-[#0f766e]">{icon}</div>
      <div>
        <p className="text-xs text-[#7a756d]">{label}</p>
        <p className="mt-1 text-sm font-semibold leading-5">{value}</p>
      </div>
    </div>
  )
}

function BudgetPanel({ destination }: { destination: Destination }) {
  const items = [
    { label: "Lodging", value: destination.lodging, icon: <Hotel size={16} /> },
    { label: "Food", value: destination.food, icon: <Utensils size={16} /> },
    { label: "Activities", value: destination.activities, icon: <MapPin size={16} /> },
  ]

  return (
    <aside className="rounded-lg border border-[#e5ded2] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#0f766e]">Expected per person</p>
          <h2 className="mt-1 text-2xl font-semibold">{currency.format(destination.budget)}</h2>
        </div>
        <WalletCards className="text-[#0f766e]" size={26} />
      </div>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 text-[#62605a]">
                {item.icon}
                {item.label}
              </span>
              <span className="font-semibold">{currency.format(item.value)}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#ece5da]">
              <div
                className="h-full rounded-full bg-[#0f766e]"
                style={{ width: `${(item.value / destination.budget) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

function GroupPanel({
  userVote,
  winner,
}: {
  userVote: string | null
  winner: Destination & { totalVotes: number }
}) {
  const userChoice = destinations.find((destination) => destination.id === userVote)

  return (
    <section className="rounded-lg border border-[#e5ded2] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[#0f766e]">Friend status</p>
          <h2 className="mt-1 text-2xl font-semibold">Votes and readiness</h2>
        </div>
        <Vote className="text-[#0f766e]" size={25} />
      </div>
      <div className="mt-5 grid gap-3">
        {friends.map((friend, index) => {
          const choice = destinations.find((destination) => destination.votes.includes(friend))
          return (
            <div key={friend} className="flex items-center justify-between gap-3 rounded-lg bg-[#f6f1ea] p-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#20201d] text-sm font-semibold text-white">
                  {friend.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold">{friend}</p>
                  <p className="truncate text-sm text-[#62605a]">{choice?.name ?? "Still deciding"}</p>
                </div>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs text-[#62605a]">
                {index < 4 ? "Ready" : "Flexible"}
              </span>
            </div>
          )
        })}
        <div className="flex items-center justify-between gap-3 rounded-lg border border-[#0f766e]/20 bg-[#eef8f5] p-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0f766e] text-sm font-semibold text-white">
              You
            </div>
            <div className="min-w-0">
              <p className="font-semibold">Your vote</p>
              <p className="truncate text-sm text-[#62605a]">{userChoice?.name ?? "Not cast yet"}</p>
            </div>
          </div>
          <span className="rounded-full bg-white px-2.5 py-1 text-xs text-[#0f766e]">
            {userVote === winner.id ? "Aligned" : "Open"}
          </span>
        </div>
      </div>
    </section>
  )
}

function ItineraryPanel({ winner }: { winner: Destination & { totalVotes: number } }) {
  return (
    <section className="rounded-lg border border-[#e5ded2] bg-[#20201d] p-5 text-white shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#8bd7cd]">Winning itinerary</p>
          <h2 className="mt-1 text-3xl font-semibold">{winner.name}</h2>
          <p className="mt-2 max-w-2xl leading-7 text-white/70">
            A simple plan with one anchor activity each day, leaving room for the group to split up
            or add reservations later.
          </p>
        </div>
        <div className="rounded-lg bg-white/10 px-4 py-3">
          <p className="text-sm text-white/62">Estimated total</p>
          <p className="text-2xl font-semibold">{currency.format(winner.budget)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {winner.itinerary.map((day) => (
          <article key={day.day} className="rounded-lg border border-white/12 bg-white/8 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-[#8bd7cd] text-[#143c39]">
                <CalendarDays size={19} />
              </div>
              <div>
                <p className="text-sm text-white/62">{day.day}</p>
                <h3 className="font-semibold">{day.title}</h3>
              </div>
            </div>
            <ul className="mt-4 space-y-3">
              {day.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-6 text-white/76">
                  <Check className="mt-1 shrink-0 text-[#8bd7cd]" size={15} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

export default App
