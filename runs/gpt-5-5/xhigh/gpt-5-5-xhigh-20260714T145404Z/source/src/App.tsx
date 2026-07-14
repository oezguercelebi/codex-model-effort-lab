import { useMemo, useState } from "react"
import {
  ArrowDownUp,
  BadgeCheck,
  BedDouble,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock,
  DollarSign,
  Heart,
  MapPin,
  Minus,
  Plane,
  Plus,
  Star,
  Ticket,
  Train,
  Trophy,
  Users,
  Utensils,
  Vote,
  WalletCards,
} from "lucide-react"
import ashevilleImage from "./assets/asheville.jpg"
import hudsonImage from "./assets/hudson-valley.jpg"
import montrealImage from "./assets/montreal.jpg"
import portlandImage from "./assets/portland-maine.jpg"

type DestinationId = "hudson" | "portland" | "montreal" | "asheville"
type BudgetMode = "shared" | "comfort"
type SortKey = "fit" | "budget" | "travel" | "votes"
type TravelKind = "drive" | "train" | "flight"

type BudgetBreakdown = {
  stay: number
  food: number
  transport: number
  activities: number
}

type ItineraryStop = {
  day: string
  time: string
  title: string
  detail: string
}

type Destination = {
  id: DestinationId
  name: string
  region: string
  image: string
  alt: string
  vibe: string
  summary: string
  bestFor: string
  travelLabel: string
  travelMinutes: number
  travelKind: TravelKind
  groupFit: number
  weather: string
  staySupply: string
  decisionNote: string
  budget: BudgetBreakdown
  highlights: string[]
  watchouts: string[]
  itinerary: ItineraryStop[]
}

type VoteRow = {
  name: string
  vote: DestinationId
  mood: string
}

const destinations: Destination[] = [
  {
    id: "hudson",
    name: "Hudson Valley",
    region: "New York",
    image: hudsonImage,
    alt: "Hudson Valley vineyards, riverside town, and green hills at golden hour",
    vibe: "Cabins, markets, river towns",
    summary:
      "A low-friction reset with enough hiking, food, and quiet time to satisfy mixed energy levels.",
    bestFor: "Lowest planning risk",
    travelLabel: "2h 15m drive",
    travelMinutes: 135,
    travelKind: "drive",
    groupFit: 92,
    weather: "75 F, mild evenings",
    staySupply: "18 good stays",
    decisionNote: "Easy departure windows and the most flexible Saturday plan.",
    budget: {
      stay: 980,
      food: 520,
      transport: 170,
      activities: 300,
    },
    highlights: ["Short drive", "Strong food options", "Easy split plans"],
    watchouts: ["Popular houses book fast", "Winery slots need deposits"],
    itinerary: [
      {
        day: "Fri",
        time: "4:30 PM",
        title: "Leave New York City",
        detail: "One car heads north, with a Beacon coffee stop if traffic is light.",
      },
      {
        day: "Fri",
        time: "7:00 PM",
        title: "Check in near Hudson",
        detail: "Dinner reservation, grocery run, and a low-key porch night.",
      },
      {
        day: "Sat",
        time: "9:30 AM",
        title: "Two-track morning",
        detail: "Hike the river overlook trail or spend the same window at Dia Beacon.",
      },
      {
        day: "Sat",
        time: "2:00 PM",
        title: "Farm lunch and tastings",
        detail: "Book one long table, then keep the evening open for town hopping.",
      },
      {
        day: "Sun",
        time: "10:30 AM",
        title: "Market stop and return",
        detail: "Pick up breakfast, leave by noon, and land back in the city before dinner.",
      },
    ],
  },
  {
    id: "portland",
    name: "Portland",
    region: "Maine",
    image: portlandImage,
    alt: "Portland Maine harbor with brick waterfront buildings, boats, and rocky shore",
    vibe: "Seafood, breweries, harbor walks",
    summary:
      "A coastal food weekend with a real change of scenery and a compact downtown base.",
    bestFor: "Food-first group",
    travelLabel: "5h 20m drive",
    travelMinutes: 320,
    travelKind: "drive",
    groupFit: 86,
    weather: "68 F, breezy coast",
    staySupply: "11 good stays",
    decisionNote: "Worth it if the group wants the best meals and a true coastal feel.",
    budget: {
      stay: 1250,
      food: 660,
      transport: 390,
      activities: 280,
    },
    highlights: ["Best restaurants", "Walkable harbor", "Easy rainy-day backup"],
    watchouts: ["Longer drive", "Lodging prices jump near the waterfront"],
    itinerary: [
      {
        day: "Fri",
        time: "3:00 PM",
        title: "Early coastal departure",
        detail: "Split snacks, podcasts, and a New Hampshire stretch stop.",
      },
      {
        day: "Fri",
        time: "8:45 PM",
        title: "Late dinner by the harbor",
        detail: "Check in, walk to Old Port, and keep the first night simple.",
      },
      {
        day: "Sat",
        time: "10:00 AM",
        title: "Ferry and lighthouse loop",
        detail: "Choose Casco Bay if skies are clear, or the museum-and-cafe route if not.",
      },
      {
        day: "Sat",
        time: "6:30 PM",
        title: "Seafood table",
        detail: "Reserve early, then leave space for a brewery crawl after dinner.",
      },
      {
        day: "Sun",
        time: "11:00 AM",
        title: "Bakery run and drive home",
        detail: "Grab pastries, take the scenic coast exit, and return before late evening.",
      },
    ],
  },
  {
    id: "montreal",
    name: "Montreal",
    region: "Quebec",
    image: montrealImage,
    alt: "Old Montreal stone street with cafes, trees, and historic architecture",
    vibe: "Old streets, cafes, late nights",
    summary:
      "The most urban option, with the strongest nightlife and a passport-sized tradeoff.",
    bestFor: "City break energy",
    travelLabel: "6h 40m drive",
    travelMinutes: 400,
    travelKind: "drive",
    groupFit: 81,
    weather: "70 F, cool nights",
    staySupply: "15 good stays",
    decisionNote: "High reward, but only works if everyone has documents ready.",
    budget: {
      stay: 1160,
      food: 620,
      transport: 520,
      activities: 260,
    },
    highlights: ["Best nightlife", "Great walking neighborhoods", "Strong value on meals"],
    watchouts: ["Passport required", "Border timing can swing the drive"],
    itinerary: [
      {
        day: "Fri",
        time: "2:30 PM",
        title: "Northbound drive",
        detail: "Leave early enough to cross before the late-evening border rush.",
      },
      {
        day: "Fri",
        time: "9:30 PM",
        title: "Old Montreal arrival",
        detail: "Check in, quick dinner, and a short walk through the old port.",
      },
      {
        day: "Sat",
        time: "10:00 AM",
        title: "Market and plateau loop",
        detail: "Start at Jean-Talon, then split between cafes, shops, and murals.",
      },
      {
        day: "Sat",
        time: "7:30 PM",
        title: "Long dinner",
        detail: "Book a bistro table, then pick one late-night stop nearby.",
      },
      {
        day: "Sun",
        time: "9:30 AM",
        title: "Mount Royal and return",
        detail: "Short overlook walk, bagels for the car, and a daylight border crossing.",
      },
    ],
  },
  {
    id: "asheville",
    name: "Asheville",
    region: "North Carolina",
    image: ashevilleImage,
    alt: "Asheville downtown and Blue Ridge Mountains viewed from a scenic overlook",
    vibe: "Blue Ridge hikes, music, breweries",
    summary:
      "A bigger-feeling adventure that works best when the group is comfortable flying.",
    bestFor: "Outdoor weekend",
    travelLabel: "4h 45m flight plan",
    travelMinutes: 285,
    travelKind: "flight",
    groupFit: 78,
    weather: "73 F, mountain storms possible",
    staySupply: "9 good stays",
    decisionNote: "Most memorable, but airfare makes the budget less forgiving.",
    budget: {
      stay: 1040,
      food: 570,
      transport: 760,
      activities: 310,
    },
    highlights: ["Best mountain views", "Strong music scene", "Memorable Saturday"],
    watchouts: ["Flight prices vary", "Rental car coordination needed"],
    itinerary: [
      {
        day: "Fri",
        time: "5:15 PM",
        title: "Fly and pick up the car",
        detail: "Land early evening, collect one rental car, and head downtown.",
      },
      {
        day: "Fri",
        time: "8:15 PM",
        title: "Downtown first night",
        detail: "Casual dinner, live music option, and an early call if the group wants sunrise.",
      },
      {
        day: "Sat",
        time: "8:30 AM",
        title: "Blue Ridge overlook",
        detail: "Drive the parkway, hike one short loop, and pack a picnic stop.",
      },
      {
        day: "Sat",
        time: "5:00 PM",
        title: "Breweries and dinner",
        detail: "Return the car to the stay, then keep the night walkable.",
      },
      {
        day: "Sun",
        time: "10:00 AM",
        title: "Brunch and airport",
        detail: "Slow brunch, one final gallery stop, and a mid-afternoon flight back.",
      },
    ],
  },
]

const friendVotes: VoteRow[] = [
  { name: "Maya", vote: "hudson", mood: "quiet mornings" },
  { name: "Leo", vote: "portland", mood: "seafood table" },
  { name: "Priya", vote: "montreal", mood: "late dinner" },
  { name: "Theo", vote: "asheville", mood: "big views" },
]

const sortOptions = [
  { key: "fit", label: "Fit", icon: Star },
  { key: "budget", label: "Budget", icon: DollarSign },
  { key: "travel", label: "Travel", icon: Clock },
  { key: "votes", label: "Votes", icon: Vote },
] satisfies Array<{ key: SortKey; label: string; icon: typeof Star }>

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

function emptyVoteCounts(): Record<DestinationId, number> {
  return {
    hudson: 0,
    portland: 0,
    montreal: 0,
    asheville: 0,
  }
}

function getDestination(id: DestinationId) {
  const destination = destinations.find((item) => item.id === id)

  if (!destination) {
    throw new Error(`Unknown destination: ${id}`)
  }

  return destination
}

function roundToTen(value: number) {
  return Math.round(value / 10) * 10
}

function roomFactor(travelers: number) {
  if (travelers <= 4) return 0.82
  if (travelers === 5) return 1
  if (travelers === 6) return 1.18
  if (travelers === 7) return 1.3
  return 1.42
}

function estimateBudget(destination: Destination, travelers: number, mode: BudgetMode) {
  const peopleFactor = travelers / 5
  const transportFactor = destination.travelKind === "flight" ? peopleFactor : Math.ceil(travelers / 5)
  const comfort = mode === "comfort"

  const breakdown = {
    stay: roundToTen(destination.budget.stay * roomFactor(travelers) * (comfort ? 1.24 : 1)),
    food: roundToTen(destination.budget.food * peopleFactor * (comfort ? 1.12 : 1)),
    transport: roundToTen(destination.budget.transport * transportFactor * (comfort ? 1.06 : 1)),
    activities: roundToTen(destination.budget.activities * peopleFactor * (comfort ? 1.1 : 1)),
  }
  const total = breakdown.stay + breakdown.food + breakdown.transport + breakdown.activities

  return {
    breakdown,
    total,
    perPerson: Math.round(total / travelers),
  }
}

function travelIcon(kind: TravelKind) {
  if (kind === "flight") return Plane
  if (kind === "train") return Train
  return Car
}

function App() {
  const [selectedId, setSelectedId] = useState<DestinationId>("hudson")
  const [yourVote, setYourVote] = useState<DestinationId>("hudson")
  const [sortKey, setSortKey] = useState<SortKey>("fit")
  const [budgetMode, setBudgetMode] = useState<BudgetMode>("shared")
  const [travelers, setTravelers] = useState(5)

  const votes = useMemo(() => {
    const counts = emptyVoteCounts()
    counts[yourVote] += 1
    friendVotes.forEach((row) => {
      counts[row.vote] += 1
    })
    return counts
  }, [yourVote])

  const winner = useMemo(() => {
    return [...destinations].sort((a, b) => votes[b.id] - votes[a.id] || b.groupFit - a.groupFit)[0]
  }, [votes])

  const selected = getDestination(selectedId)
  const winningBudget = estimateBudget(winner, travelers, budgetMode)
  const selectedBudget = estimateBudget(selected, travelers, budgetMode)
  const maxVotes = Math.max(...Object.values(votes))
  const sortedVoteCounts = destinations
    .map((destination) => ({ destination, count: votes[destination.id] }))
    .sort((a, b) => b.count - a.count || b.destination.groupFit - a.destination.groupFit)
  const voteLead = sortedVoteCounts[0].count - sortedVoteCounts[1].count

  const sortedDestinations = useMemo(() => {
    return [...destinations].sort((a, b) => {
      if (sortKey === "budget") {
        return estimateBudget(a, travelers, budgetMode).perPerson - estimateBudget(b, travelers, budgetMode).perPerson
      }

      if (sortKey === "travel") {
        return a.travelMinutes - b.travelMinutes
      }

      if (sortKey === "votes") {
        return votes[b.id] - votes[a.id] || b.groupFit - a.groupFit
      }

      return b.groupFit - a.groupFit
    })
  }, [budgetMode, sortKey, travelers, votes])

  const allVotes = [{ name: "You", vote: yourVote, mood: "final say" }, ...friendVotes]

  return (
    <main className="min-h-screen bg-[#f6f7f2] text-[#1e261f]">
      <header className="sticky top-0 z-30 border-b border-[#dce3d6] bg-[#fbfcf8]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#top" className="flex min-w-0 items-center gap-3 font-semibold">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#1f4f3a] text-white">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-lg leading-5">Weekender</span>
              <span className="block text-xs font-medium text-[#687466]">Sep 18-20, 2026</span>
            </span>
          </a>

          <nav className="hidden items-center gap-1 rounded-md border border-[#dce3d6] bg-white p-1 text-sm font-medium shadow-sm sm:flex">
            <a className="rounded px-3 py-2 text-[#506050] hover:bg-[#eef4ea]" href="#compare">
              Compare
            </a>
            <a className="rounded px-3 py-2 text-[#506050] hover:bg-[#eef4ea]" href="#vote">
              Vote
            </a>
            <a className="rounded px-3 py-2 text-[#506050] hover:bg-[#eef4ea]" href="#plan">
              Plan
            </a>
          </nav>

          <div className="flex items-center gap-2 rounded-md border border-[#dce3d6] bg-white px-2 py-1 shadow-sm">
            <Users className="h-4 w-4 text-[#1f7a8c]" aria-hidden="true" />
            <span className="text-sm font-semibold">{travelers}</span>
          </div>
        </div>
      </header>

      <section id="top" className="relative isolate overflow-hidden bg-[#17251d]">
        <img
          src={winner.image}
          alt={winner.alt}
          className="absolute inset-0 h-full w-full object-cover opacity-[0.58]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,32,24,0.94),rgba(18,32,24,0.72),rgba(18,32,24,0.28))]" />

        <div className="relative mx-auto grid min-h-[430px] max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
          <div className="flex flex-col justify-end pb-2 pt-20 text-white lg:pt-10">
            <div className="mb-5 flex flex-wrap items-center gap-2 text-sm font-semibold">
              <span className="inline-flex items-center gap-2 rounded-md bg-white/14 px-3 py-2 backdrop-blur">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                Fri-Sun from New York City
              </span>
              <span className="inline-flex items-center gap-2 rounded-md bg-white/14 px-3 py-2 backdrop-blur">
                <Trophy className="h-4 w-4" aria-hidden="true" />
                {winner.name} leading
              </span>
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
              {winner.name} is the current weekend pick.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/86 sm:text-lg">
              {winner.decisionNote}
            </p>
            <div className="mt-7 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              <HeroMetric icon={Vote} label="Votes" value={`${votes[winner.id]} of ${allVotes.length}`} />
              <HeroMetric icon={WalletCards} label="Per person" value={currency.format(winningBudget.perPerson)} />
              <HeroMetric icon={Clock} label="Travel" value={winner.travelLabel} />
              <HeroMetric icon={Star} label="Group fit" value={`${winner.groupFit}%`} />
            </div>
          </div>

          <section className="self-end rounded-lg border border-white/35 bg-white/95 p-4 shadow-2xl shadow-black/20">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-[#687466]">Decision status</p>
                <h2 className="mt-1 text-xl font-semibold text-[#1e261f]">
                  {voteLead > 0 ? `${voteLead} vote lead` : "Tie broken by fit"}
                </h2>
              </div>
              <BadgeCheck className="h-6 w-6 text-[#1f7a8c]" aria-hidden="true" />
            </div>

            <div className="mt-4 space-y-3">
              {sortedVoteCounts.map(({ destination, count }) => (
                <div key={destination.id}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-[#263327]">{destination.name}</span>
                    <span className="text-[#687466]">{count}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded bg-[#e3eadf]">
                    <div
                      className="h-full rounded bg-[#d45d3f]"
                      style={{ width: `${maxVotes === 0 ? 0 : (count / maxVotes) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-8">
        <div className="space-y-6">
          <section id="compare" className="rounded-lg border border-[#dce3d6] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#1f7a8c]">Short list</p>
                <h2 className="mt-1 text-2xl font-semibold">Compare destinations</h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:justify-end">
                <div className="flex items-center gap-2 rounded-md border border-[#dce3d6] bg-[#f8faf5] p-1">
                  <ArrowDownUp className="ml-2 hidden h-4 w-4 text-[#687466] sm:block" aria-hidden="true" />
                  {sortOptions.map((option) => {
                    const Icon = option.icon
                    const isActive = sortKey === option.key

                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setSortKey(option.key)}
                        aria-pressed={isActive}
                        title={`Sort by ${option.label.toLowerCase()}`}
                        className={`inline-flex min-h-10 items-center gap-2 rounded px-3 py-2 text-sm font-semibold transition ${
                          isActive
                            ? "bg-[#1f4f3a] text-white shadow-sm"
                            : "text-[#506050] hover:bg-white hover:text-[#1e261f]"
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {option.label}
                      </button>
                    )
                  })}
                </div>

                <div className="flex items-center gap-2 rounded-md border border-[#dce3d6] bg-[#f8faf5] p-1">
                  <button
                    type="button"
                    onClick={() => setBudgetMode("shared")}
                    aria-pressed={budgetMode === "shared"}
                    title="Shared stay budget"
                    className={`inline-flex min-h-10 items-center gap-2 rounded px-3 py-2 text-sm font-semibold transition ${
                      budgetMode === "shared"
                        ? "bg-[#1f7a8c] text-white shadow-sm"
                        : "text-[#506050] hover:bg-white hover:text-[#1e261f]"
                    }`}
                  >
                    <WalletCards className="h-4 w-4" aria-hidden="true" />
                    Shared
                  </button>
                  <button
                    type="button"
                    onClick={() => setBudgetMode("comfort")}
                    aria-pressed={budgetMode === "comfort"}
                    title="Comfort stay budget"
                    className={`inline-flex min-h-10 items-center gap-2 rounded px-3 py-2 text-sm font-semibold transition ${
                      budgetMode === "comfort"
                        ? "bg-[#1f7a8c] text-white shadow-sm"
                        : "text-[#506050] hover:bg-white hover:text-[#1e261f]"
                    }`}
                  >
                    <BedDouble className="h-4 w-4" aria-hidden="true" />
                    Comfort
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {sortedDestinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  budget={estimateBudget(destination, travelers, budgetMode)}
                  isSelected={selectedId === destination.id}
                  isVoted={yourVote === destination.id}
                  isWinner={winner.id === destination.id}
                  voteCount={votes[destination.id]}
                  onSelect={() => setSelectedId(destination.id)}
                  onVote={() => setYourVote(destination.id)}
                />
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[#dce3d6] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#d45d3f]">Budget snapshot</p>
                <h2 className="mt-1 text-2xl font-semibold">{selected.name}</h2>
              </div>

              <div className="flex w-full items-center justify-between rounded-md border border-[#dce3d6] bg-[#f8faf5] p-1 md:w-auto">
                <button
                  type="button"
                  onClick={() => setTravelers((value) => Math.max(3, value - 1))}
                  disabled={travelers === 3}
                  title="Decrease travelers"
                  aria-label="Decrease travelers"
                  className="grid h-10 w-10 place-items-center rounded text-[#506050] transition hover:bg-white disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="min-w-24 px-3 text-center text-sm font-semibold">
                  {travelers} travelers
                </span>
                <button
                  type="button"
                  onClick={() => setTravelers((value) => Math.min(8, value + 1))}
                  disabled={travelers === 8}
                  title="Increase travelers"
                  aria-label="Increase travelers"
                  className="grid h-10 w-10 place-items-center rounded text-[#506050] transition hover:bg-white disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
              <div className="rounded-lg border border-[#dce3d6] bg-[#f8faf5] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#687466]">Estimated total</p>
                    <p className="mt-1 text-4xl font-semibold">{currency.format(selectedBudget.total)}</p>
                  </div>
                  <div className="rounded-md bg-white px-3 py-2 text-right shadow-sm">
                    <p className="text-xs font-semibold text-[#687466]">Per person</p>
                    <p className="text-xl font-semibold text-[#1f4f3a]">
                      {currency.format(selectedBudget.perPerson)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <BudgetLine icon={BedDouble} label="Stay" value={selectedBudget.breakdown.stay} />
                  <BudgetLine icon={Utensils} label="Food" value={selectedBudget.breakdown.food} />
                  <BudgetLine icon={travelIcon(selected.travelKind)} label="Travel" value={selectedBudget.breakdown.transport} />
                  <BudgetLine icon={Ticket} label="Plans" value={selectedBudget.breakdown.activities} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-[#dce3d6] p-4">
                  <h3 className="font-semibold">Why it works</h3>
                  <ul className="mt-3 space-y-3 text-sm text-[#506050]">
                    {selected.highlights.map((item) => (
                      <li key={item} className="flex gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1f7a8c]" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-[#dce3d6] p-4">
                  <h3 className="font-semibold">Tradeoffs</h3>
                  <ul className="mt-3 space-y-3 text-sm text-[#506050]">
                    {selected.watchouts.map((item) => (
                      <li key={item} className="flex gap-2">
                        <Star className="mt-0.5 h-4 w-4 shrink-0 text-[#d45d3f]" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <section id="vote" className="rounded-lg border border-[#dce3d6] bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#1f7a8c]">Group vote</p>
                <h2 className="mt-1 text-2xl font-semibold">Your favorite</h2>
              </div>
              <Vote className="h-6 w-6 text-[#d45d3f]" aria-hidden="true" />
            </div>

            <div className="mt-5 grid gap-2">
              {destinations.map((destination) => {
                const isActive = yourVote === destination.id

                return (
                  <button
                    key={destination.id}
                    type="button"
                    onClick={() => setYourVote(destination.id)}
                    aria-pressed={isActive}
                    title={`Vote for ${destination.name}`}
                    className={`flex min-h-12 items-center justify-between gap-3 rounded-md border px-3 py-2 text-left transition ${
                      isActive
                        ? "border-[#d45d3f] bg-[#fff3ef] text-[#1e261f]"
                        : "border-[#dce3d6] bg-white text-[#506050] hover:border-[#aebca8] hover:bg-[#f8faf5]"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Heart
                        className={`h-4 w-4 shrink-0 ${isActive ? "text-[#d45d3f]" : "text-[#899586]"}`}
                        fill={isActive ? "currentColor" : "none"}
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="block font-semibold">{destination.name}</span>
                        <span className="block text-xs text-[#687466]">{destination.bestFor}</span>
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-semibold">{votes[destination.id]}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-5 divide-y divide-[#e7ece2] border-t border-[#e7ece2]">
              {allVotes.map((row) => {
                const destination = getDestination(row.vote)

                return (
                  <div key={row.name} className="flex items-center gap-3 py-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#eef4ea] text-sm font-bold text-[#1f4f3a]">
                      {row.name.slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{row.name}</p>
                      <p className="truncate text-xs text-[#687466]">{row.mood}</p>
                    </div>
                    <span className="rounded-md bg-[#f8faf5] px-2 py-1 text-xs font-semibold text-[#506050]">
                      {destination.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>

          <section id="plan" className="overflow-hidden rounded-lg border border-[#dce3d6] bg-white shadow-sm">
            <img src={winner.image} alt={winner.alt} className="h-40 w-full object-cover" />
            <div className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#d45d3f]">Winning itinerary</p>
                  <h2 className="mt-1 text-2xl font-semibold">{winner.name}</h2>
                </div>
                <Trophy className="h-6 w-6 text-[#d45d3f]" aria-hidden="true" />
              </div>

              <ol className="mt-5 space-y-4">
                {winner.itinerary.map((stop) => (
                  <li key={`${stop.day}-${stop.time}-${stop.title}`} className="grid grid-cols-[64px_1fr] gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#1f4f3a]">{stop.day}</p>
                      <p className="text-xs text-[#687466]">{stop.time}</p>
                    </div>
                    <div className="border-l border-[#dce3d6] pb-1 pl-4">
                      <p className="font-semibold">{stop.title}</p>
                      <p className="mt-1 text-sm leading-6 text-[#506050]">{stop.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        </aside>
      </div>
    </main>
  )
}

function HeroMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Star
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border border-white/22 bg-white/12 p-3 text-white backdrop-blur">
      <Icon className="h-4 w-4" aria-hidden="true" />
      <p className="mt-3 text-xs font-semibold text-white/70">{label}</p>
      <p className="mt-1 text-sm font-bold leading-5">{value}</p>
    </div>
  )
}

function BudgetLine({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Star
  label: string
  value: number
}) {
  return (
    <div className="rounded-md bg-white p-3 shadow-sm">
      <Icon className="h-4 w-4 text-[#1f7a8c]" aria-hidden="true" />
      <p className="mt-2 text-xs font-semibold text-[#687466]">{label}</p>
      <p className="mt-1 text-lg font-semibold">{currency.format(value)}</p>
    </div>
  )
}

function DestinationCard({
  destination,
  budget,
  voteCount,
  isSelected,
  isVoted,
  isWinner,
  onSelect,
  onVote,
}: {
  destination: Destination
  budget: ReturnType<typeof estimateBudget>
  voteCount: number
  isSelected: boolean
  isVoted: boolean
  isWinner: boolean
  onSelect: () => void
  onVote: () => void
}) {
  const TravelIcon = travelIcon(destination.travelKind)

  return (
    <article
      className={`overflow-hidden rounded-lg border bg-white shadow-sm transition ${
        isSelected ? "border-[#1f7a8c] ring-2 ring-[#b7dce4]" : "border-[#dce3d6]"
      }`}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-[#dce3d6]">
        <img src={destination.image} alt={destination.alt} className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <span className="inline-flex items-center gap-2 rounded-md bg-white/92 px-2.5 py-1.5 text-xs font-bold text-[#1e261f] shadow-sm">
            <MapPin className="h-3.5 w-3.5 text-[#d45d3f]" aria-hidden="true" />
            {destination.region}
          </span>
          {isWinner ? (
            <span className="inline-flex items-center gap-2 rounded-md bg-[#d45d3f] px-2.5 py-1.5 text-xs font-bold text-white shadow-sm">
              <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
              Leading
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-xl font-semibold">{destination.name}</h3>
            <p className="mt-1 text-sm font-medium text-[#687466]">{destination.vibe}</p>
          </div>
          <div className="shrink-0 rounded-md bg-[#eef4ea] px-2 py-1 text-sm font-bold text-[#1f4f3a]">
            {destination.groupFit}%
          </div>
        </div>

        <p className="mt-3 min-h-12 text-sm leading-6 text-[#506050]">{destination.summary}</p>

        <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <Metric icon={TravelIcon} label="Travel" value={destination.travelLabel} />
          <Metric icon={WalletCards} label="Person" value={currency.format(budget.perPerson)} />
          <Metric icon={Vote} label="Votes" value={`${voteCount}`} />
        </dl>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold text-[#506050]">
          <span className="rounded-md bg-[#f8faf5] px-2.5 py-2">{destination.weather}</span>
          <span className="rounded-md bg-[#f8faf5] px-2.5 py-2">{destination.staySupply}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {destination.highlights.slice(0, 2).map((item) => (
            <span key={item} className="rounded-md bg-[#edf7f8] px-2.5 py-1.5 text-xs font-semibold text-[#1f6f7d]">
              {item}
            </span>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onSelect}
            title={`Select ${destination.name}`}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
              isSelected
                ? "bg-[#1f7a8c] text-white"
                : "bg-[#eef4ea] text-[#1f4f3a] hover:bg-[#dcebd5]"
            }`}
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {isSelected ? "Selected" : "Select"}
          </button>
          <button
            type="button"
            onClick={onVote}
            title={`Vote for ${destination.name}`}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
              isVoted
                ? "bg-[#d45d3f] text-white"
                : "bg-[#fff3ef] text-[#ad432d] hover:bg-[#ffe4da]"
            }`}
          >
            <Heart className="h-4 w-4" fill={isVoted ? "currentColor" : "none"} aria-hidden="true" />
            {isVoted ? "Your vote" : "Vote"}
          </button>
        </div>
      </div>
    </article>
  )
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Star
  label: string
  value: string
}) {
  return (
    <div className="rounded-md border border-[#e2e8dd] bg-[#fbfcf8] p-2.5">
      <Icon className="h-4 w-4 text-[#1f7a8c]" aria-hidden="true" />
      <dt className="mt-2 text-xs font-semibold text-[#687466]">{label}</dt>
      <dd className="mt-1 font-semibold leading-5">{value}</dd>
    </div>
  )
}

export default App
