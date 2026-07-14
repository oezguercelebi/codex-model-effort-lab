import { FormEvent, useMemo, useState } from "react"
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Check,
  ChevronDown,
  CircleCheck,
  Clock3,
  CloudSun,
  Coffee,
  Compass,
  Heart,
  House,
  Landmark,
  Map,
  MapPin,
  Menu,
  MessageCircle,
  Navigation,
  Plane,
  Plus,
  Search,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Sun,
  TrainFront,
  Trophy,
  Users,
  Utensils,
  WalletCards,
  X,
} from "lucide-react"

type DestinationId = "lisbon" | "copenhagen" | "ljubljana"
type Filter = "All picks" | "Best value" | "Train-friendly"

type Activity = {
  time: string
  title: string
  description: string
  type: "food" | "stay" | "sight" | "travel" | "coffee"
}

type Destination = {
  id: DestinationId
  city: string
  country: string
  tagline: string
  budget: number
  duration: string
  transport: "Flight" | "Train"
  weather: string
  baseVotes: number
  voters: string[]
  match: number
  tags: string[]
  blurb: string
  stay: string
  accent: string
  itinerary: Activity[]
}

const friends = [
  { name: "Maya", initials: "MS", color: "#df755f" },
  { name: "Jonas", initials: "JK", color: "#4f7c6d" },
  { name: "Nora", initials: "NR", color: "#7578a8" },
  { name: "Luca", initials: "LM", color: "#c18a42" },
  { name: "Elif", initials: "EA", color: "#9b6b86" },
  { name: "You", initials: "YO", color: "#23473f" },
]

const destinations: Destination[] = [
  {
    id: "lisbon",
    city: "Lisbon",
    country: "Portugal",
    tagline: "Sunshine, tiles & late dinners",
    budget: 286,
    duration: "3h 10m",
    transport: "Flight",
    weather: "22°",
    baseVotes: 3,
    voters: ["MS", "JK", "NR"],
    match: 94,
    tags: ["Sunny", "Food scene", "Walkable"],
    blurb: "The crowd-pleaser: golden light, tiny wine bars and a coastline within easy reach.",
    stay: "Casa do Jasmim · Príncipe Real",
    accent: "coral",
    itinerary: [
      { time: "Fri · 18:40", title: "Arrive & check in", description: "Drop bags at Casa do Jasmim, then walk to Miradouro de São Pedro.", type: "stay" },
      { time: "Fri · 21:00", title: "Petiscos at Taberna da Rua", description: "A relaxed first dinner of shared plates and vinho verde.", type: "food" },
      { time: "Sat · 09:30", title: "Alfama slow morning", description: "Coffee, tiled lanes and the flea market at Campo de Santa Clara.", type: "coffee" },
      { time: "Sat · 14:00", title: "Sail the Tagus", description: "Two-hour group sail from Belém with drinks included.", type: "travel" },
      { time: "Sun · 11:00", title: "Brunch & LX Factory", description: "One last long brunch before browsing studios and bookshops.", type: "sight" },
    ],
  },
  {
    id: "copenhagen",
    city: "Copenhagen",
    country: "Denmark",
    tagline: "Design, bakeries & harbour dips",
    budget: 358,
    duration: "7h 15m",
    transport: "Train",
    weather: "16°",
    baseVotes: 3,
    voters: ["EA", "LM", "JK"],
    match: 87,
    tags: ["By train", "Design", "Great food"],
    blurb: "An easy, stylish weekend of cardamom buns, bikes and long bright evenings by the water.",
    stay: "Hotel Ottilia · Carlsberg Byen",
    accent: "blue",
    itinerary: [
      { time: "Fri · 16:30", title: "Arrive by train", description: "Check into Hotel Ottilia and settle in with rooftop views.", type: "stay" },
      { time: "Fri · 19:30", title: "Dinner in Vesterbro", description: "Seasonal plates and natural wine at a neighbourhood favourite.", type: "food" },
      { time: "Sat · 09:00", title: "Buns, bikes & bridges", description: "Pick up rental bikes after breakfast at Juno the Bakery.", type: "coffee" },
      { time: "Sat · 14:30", title: "Louisiana Museum", description: "Coastal train to world-class art, sculpture and sea views.", type: "sight" },
      { time: "Sun · 10:30", title: "Harbour morning", description: "Sauna, a brave dip and brunch before the return train.", type: "travel" },
    ],
  },
  {
    id: "ljubljana",
    city: "Ljubljana",
    country: "Slovenia",
    tagline: "Green hills & riverside cafés",
    budget: 248,
    duration: "3h 45m",
    transport: "Flight",
    weather: "20°",
    baseVotes: 2,
    voters: ["NR", "LM"],
    match: 82,
    tags: ["Best value", "Nature", "Hidden gem"],
    blurb: "Compact, friendly and wonderfully green—with enough left in the budget for a Lake Bled day trip.",
    stay: "Vander Urbani Resort · Old Town",
    accent: "green",
    itinerary: [
      { time: "Fri · 19:10", title: "Arrive & riverside walk", description: "Check in beside the river and get your bearings before dinner.", type: "stay" },
      { time: "Fri · 20:30", title: "Old Town supper", description: "Modern Slovenian cooking in a candlelit courtyard.", type: "food" },
      { time: "Sat · 08:30", title: "Day trip to Lake Bled", description: "Morning shuttle, lakeside walk and a slice of kremšnita.", type: "travel" },
      { time: "Sat · 17:30", title: "Castle golden hour", description: "Ride the funicular for views across the Alps and city roofs.", type: "sight" },
      { time: "Sun · 10:00", title: "Market breakfast", description: "Coffee and local pastries at the Central Market.", type: "coffee" },
    ],
  },
]

function Avatar({ initials, size = "medium", label }: { initials: string; size?: "small" | "medium" | "large"; label?: string }) {
  const friend = friends.find((item) => item.initials === initials)
  return (
    <span
      className={`avatar avatar-${size}`}
      style={{ background: friend?.color ?? "#8b8b84" }}
      title={label ?? friend?.name}
      aria-label={label ?? friend?.name}
    >
      {initials}
    </span>
  )
}

function DestinationArtwork({ id }: { id: DestinationId }) {
  if (id === "lisbon") {
    return (
      <svg className="destination-art" viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration of Lisbon's colourful hillside and tram">
        <defs>
          <linearGradient id="lisbon-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#F6B888"/><stop offset="1" stopColor="#F8D9B5"/></linearGradient>
          <linearGradient id="lisbon-water" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#75A8AE"/><stop offset="1" stopColor="#A5C6C4"/></linearGradient>
        </defs>
        <rect width="600" height="360" fill="url(#lisbon-sky)"/>
        <circle cx="490" cy="66" r="34" fill="#FFE4A5" opacity=".9"/>
        <path d="M0 225 C120 192 168 232 290 203 C400 178 463 209 600 174 L600 288 L0 288Z" fill="#C87158" opacity=".55"/>
        <rect y="278" width="600" height="82" fill="url(#lisbon-water)"/>
        <g opacity=".98">
          <rect x="34" y="156" width="80" height="132" rx="3" fill="#F2E5CE"/><rect x="51" y="183" width="14" height="22" fill="#557773"/><rect x="83" y="183" width="14" height="22" fill="#557773"/><rect x="51" y="226" width="14" height="22" fill="#557773"/><rect x="83" y="226" width="14" height="22" fill="#557773"/>
          <rect x="112" y="127" width="70" height="161" rx="3" fill="#CE6652"/><path d="M106 127h82l-17-21h-50Z" fill="#8F4C40"/><rect x="128" y="158" width="16" height="28" fill="#F3DBA6"/><rect x="154" y="158" width="16" height="28" fill="#F3DBA6"/>
          <rect x="181" y="173" width="92" height="115" rx="3" fill="#EACB87"/><path d="M175 173h104l-18-19h-67Z" fill="#A75545"/><rect x="201" y="199" width="18" height="25" fill="#4D6A69"/><rect x="233" y="199" width="18" height="25" fill="#4D6A69"/>
          <rect x="272" y="140" width="73" height="148" rx="3" fill="#E58B6D"/><rect x="289" y="168" width="15" height="23" fill="#F8E6BF"/><rect x="317" y="168" width="15" height="23" fill="#F8E6BF"/>
          <rect x="344" y="181" width="95" height="107" rx="3" fill="#F2E1C1"/><rect x="363" y="208" width="17" height="25" fill="#5C7770"/><rect x="399" y="208" width="17" height="25" fill="#5C7770"/>
          <rect x="438" y="151" width="73" height="137" rx="3" fill="#B75A48"/><rect x="454" y="180" width="15" height="24" fill="#F6D790"/><rect x="484" y="180" width="15" height="24" fill="#F6D790"/>
          <rect x="510" y="188" width="64" height="100" fill="#E9C477"/><rect x="525" y="213" width="14" height="21" fill="#526E69"/><rect x="550" y="213" width="14" height="21" fill="#526E69"/>
        </g>
        <g transform="translate(313 237)">
          <path d="M5 1h98l16 18v54H0V13Z" fill="#F4C744" stroke="#7B533B" strokeWidth="4"/><rect x="17" y="12" width="34" height="23" rx="2" fill="#B9D2CE"/><rect x="58" y="12" width="34" height="23" rx="2" fill="#B9D2CE"/><path d="M17 48h79" stroke="#A26C36" strokeWidth="4"/><circle cx="25" cy="75" r="9" fill="#4A4540"/><circle cx="94" cy="75" r="9" fill="#4A4540"/><path d="M43 0V-20M78 0v-20M43-18h35" stroke="#65564A" strokeWidth="3"/>
        </g>
        <path d="M0 317c147-24 245 1 343-10 105-11 170-5 257-17" stroke="#F7F1E8" strokeWidth="5" fill="none" opacity=".6"/>
      </svg>
    )
  }

  if (id === "copenhagen") {
    return (
      <svg className="destination-art" viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration of colourful Copenhagen harbour houses">
        <defs><linearGradient id="cph-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#91BDD0"/><stop offset="1" stopColor="#D7E4DD"/></linearGradient></defs>
        <rect width="600" height="360" fill="url(#cph-sky)"/><circle cx="95" cy="70" r="34" fill="#F5E6A8" opacity=".8"/>
        <path d="M0 260h600v100H0z" fill="#5E939C"/><path d="M0 306c100-24 184 16 291-3 112-19 178 14 309-4" stroke="#A9CFCD" strokeWidth="8" fill="none" opacity=".6"/>
        <g>
          <path d="M29 116h91l-13-30H43Z" fill="#78463D"/><rect x="34" y="116" width="82" height="160" fill="#C65E4C"/><rect x="49" y="142" width="18" height="29" fill="#E8D8B5"/><rect x="83" y="142" width="18" height="29" fill="#E8D8B5"/><rect x="49" y="194" width="18" height="29" fill="#E8D8B5"/><rect x="83" y="194" width="18" height="29" fill="#E8D8B5"/>
          <path d="M116 139h88l-14-31h-60Z" fill="#735949"/><rect x="120" y="139" width="80" height="137" fill="#E3A63F"/><rect x="136" y="163" width="17" height="27" fill="#385E64"/><rect x="168" y="163" width="17" height="27" fill="#385E64"/><rect x="136" y="209" width="17" height="27" fill="#385E64"/>
          <path d="M199 96h91l-17-29h-57Z" fill="#425A59"/><rect x="204" y="96" width="82" height="180" fill="#72968A"/><rect x="222" y="125" width="17" height="30" fill="#EAD9B7"/><rect x="253" y="125" width="17" height="30" fill="#EAD9B7"/><rect x="222" y="180" width="17" height="30" fill="#EAD9B7"/><rect x="253" y="180" width="17" height="30" fill="#EAD9B7"/>
          <path d="M285 133h87l-14-33h-60Z" fill="#9E483C"/><rect x="290" y="133" width="78" height="143" fill="#D27453"/><rect x="306" y="159" width="17" height="26" fill="#E8D7B6"/><rect x="338" y="159" width="17" height="26" fill="#E8D7B6"/><rect x="306" y="207" width="17" height="26" fill="#E8D7B6"/>
          <path d="M367 109h92l-15-30h-62Z" fill="#635047"/><rect x="372" y="109" width="82" height="167" fill="#D8B75F"/><rect x="389" y="136" width="17" height="29" fill="#41636A"/><rect x="421" y="136" width="17" height="29" fill="#41636A"/><rect x="389" y="188" width="17" height="29" fill="#41636A"/>
          <path d="M453 147h89l-13-31h-62Z" fill="#7D453D"/><rect x="458" y="147" width="80" height="129" fill="#AD5549"/><rect x="474" y="172" width="17" height="27" fill="#EAD8B7"/><rect x="506" y="172" width="17" height="27" fill="#EAD8B7"/>
        </g>
        <g transform="translate(401 268)" stroke="#2E4B4C" strokeWidth="4" fill="none"><circle cx="0" cy="35" r="20"/><circle cx="68" cy="35" r="20"/><path d="m0 35 23-35 21 35H0Zm44 0 14-54M25 0h36M58-19h16"/></g>
        <g transform="translate(105 292)"><path d="M0 8c40-35 92-32 132 0Z" fill="#E6D5B2"/><path d="M66-26V7M66-26l51 29" stroke="#F6F0DF" strokeWidth="3"/></g>
      </svg>
    )
  }

  return (
    <svg className="destination-art" viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration of Ljubljana river, castle and green hills">
      <defs><linearGradient id="lju-sky" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#9BC5BE"/><stop offset="1" stopColor="#E1E2BC"/></linearGradient></defs>
      <rect width="600" height="360" fill="url(#lju-sky)"/><circle cx="495" cy="70" r="32" fill="#F5E6A9" opacity=".85"/>
      <path d="M0 179 90 87l72 73 92-116 94 126 84-85 111 98 57-40v126H0Z" fill="#749282" opacity=".6"/>
      <path d="M0 207c85-52 154-29 225-15 85 18 130-19 206-26 65-7 122 27 169 39v85H0Z" fill="#527764"/>
      <g transform="translate(227 92)"><rect x="0" y="51" width="140" height="66" fill="#D3C39D"/><rect x="15" y="16" width="29" height="101" fill="#E4D3A9"/><path d="m13 17 17-22 17 22" fill="#784D3E"/><rect x="93" y="31" width="33" height="86" fill="#C7B58E"/><path d="m90 32 20-21 20 21" fill="#744D40"/><rect x="56" y="69" width="18" height="25" fill="#547267"/></g>
      <path d="M0 262c100-18 163 13 252-2 120-21 202 6 348-18v118H0Z" fill="#6EAAA5"/>
      <path d="M0 310c115-23 191 13 293-5 120-22 206 12 307-7" stroke="#B7D3C9" strokeWidth="8" opacity=".6" fill="none"/>
      <g>
        <rect x="25" y="197" width="78" height="75" fill="#E5C985"/><path d="M19 197h90l-17-19H35Z" fill="#8D4F40"/><rect x="44" y="218" width="15" height="23" fill="#527169"/><rect x="71" y="218" width="15" height="23" fill="#527169"/>
        <rect x="102" y="182" width="73" height="90" fill="#D98264"/><path d="M97 182h83l-16-18h-52Z" fill="#874A3D"/><rect x="119" y="205" width="15" height="23" fill="#F1DBAE"/><rect x="146" y="205" width="15" height="23" fill="#F1DBAE"/>
        <rect x="174" y="208" width="88" height="64" fill="#E8DFBD"/><path d="M168 208h100l-18-18h-64Z" fill="#8E5545"/><rect x="193" y="227" width="15" height="21" fill="#52716A"/><rect x="228" y="227" width="15" height="21" fill="#52716A"/>
        <rect x="399" y="196" width="80" height="76" fill="#D59B65"/><path d="M393 196h92l-17-20h-58Z" fill="#854D40"/><rect x="418" y="217" width="15" height="23" fill="#E7E0C4"/><rect x="450" y="217" width="15" height="23" fill="#E7E0C4"/>
        <rect x="478" y="211" width="90" height="61" fill="#E6D9AD"/><path d="M472 211h102l-17-18h-68Z" fill="#7E4A3F"/><rect x="497" y="229" width="15" height="20" fill="#55736B"/><rect x="533" y="229" width="15" height="20" fill="#55736B"/>
      </g>
      <path d="M209 254c45-23 101-20 149 0" stroke="#F1D5A7" strokeWidth="8" fill="none"/><path d="M210 256c44 14 99 14 147 0" stroke="#60594D" strokeWidth="3" fill="none"/><g fill="#2D574B"><circle cx="281" cy="240" r="5"/><circle cx="302" cy="241" r="5"/></g>
    </svg>
  )
}

function TransportIcon({ type }: { type: Destination["transport"] }) {
  return type === "Train" ? <TrainFront size={17} /> : <Plane size={17} />
}

function ActivityIcon({ type }: { type: Activity["type"] }) {
  const icons = {
    food: <Utensils size={17} />,
    stay: <BedDouble size={17} />,
    sight: <Landmark size={17} />,
    travel: <Navigation size={17} />,
    coffee: <Coffee size={17} />,
  }
  return icons[type]
}

function App() {
  const [myVotes, setMyVotes] = useState<DestinationId[]>(["lisbon"])
  const [filter, setFilter] = useState<Filter>("All picks")
  const [budgetMode, setBudgetMode] = useState<"person" | "group">("person")
  const [toast, setToast] = useState<string | null>(null)
  const [suggestOpen, setSuggestOpen] = useState(false)
  const [suggestion, setSuggestion] = useState("")
  const [suggestedCity, setSuggestedCity] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const visibleDestinations = destinations.filter((destination) => {
    if (filter === "Best value") return destination.budget < 300
    if (filter === "Train-friendly") return destination.transport === "Train"
    return true
  })

  const scores = useMemo(
    () => destinations.map((destination) => ({
      ...destination,
      votes: destination.baseVotes + (myVotes.includes(destination.id) ? 1 : 0),
    })).sort((a, b) => b.votes - a.votes || b.match - a.match),
    [myVotes],
  )
  const winner = scores[0]

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2600)
  }

  const toggleVote = (id: DestinationId) => {
    if (myVotes.includes(id)) {
      setMyVotes((votes) => votes.filter((vote) => vote !== id))
      notify("Vote removed — you can change your mind anytime.")
      return
    }
    if (myVotes.length >= 2) {
      notify("You have used both votes. Remove one to choose again.")
      return
    }
    setMyVotes((votes) => [...votes, id])
    const city = destinations.find((destination) => destination.id === id)?.city
    notify(`Vote added for ${city}. Nice pick!`)
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
    setMobileMenuOpen(false)
  }

  const shareTrip = async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href)
      notify("Trip link copied to your clipboard.")
    } catch {
      notify("Your Weekender trip is ready to share.")
    }
  }

  const submitSuggestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const city = suggestion.trim()
    if (!city) return
    setSuggestedCity(city)
    setSuggestion("")
    setSuggestOpen(false)
    notify(`${city} was added to the group suggestions.`)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Weekender home">
          <span className="brand-mark"><Compass size={22} strokeWidth={2.3} /></span>
          <span>weekender</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <button className="nav-link active" onClick={() => scrollTo("destinations")}>Explore</button>
          <button className="nav-link" onClick={() => scrollTo("comparison")}>Compare</button>
          <button className="nav-link" onClick={() => scrollTo("itinerary")}>Trip plan</button>
        </nav>
        <div className="topbar-actions">
          <div className="friend-stack" aria-label="6 friends in this trip">
            {friends.slice(0, 4).map((friend) => <Avatar key={friend.initials} initials={friend.initials} size="small" />)}
            <span className="avatar avatar-small avatar-more">+2</span>
          </div>
          <button className="icon-button share-button" onClick={shareTrip} aria-label="Share trip"><Share2 size={18} /><span>Share</span></button>
          <button className="icon-button mobile-menu-button" onClick={() => setMobileMenuOpen((value) => !value)} aria-label="Open navigation" aria-expanded={mobileMenuOpen}>{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <button onClick={() => scrollTo("destinations")}><Map size={17} /> Explore</button>
            <button onClick={() => scrollTo("comparison")}><SlidersHorizontal size={17} /> Compare</button>
            <button onClick={() => scrollTo("itinerary")}><CalendarDays size={17} /> Trip plan</button>
          </div>
        )}
      </header>

      <main id="top">
        <section className="hero page-width">
          <div className="hero-copy">
            <div className="eyebrow"><span className="pulse-dot" /> Voting is open · 2 days left</div>
            <h1>Where should we<br /><em>weekend?</em></h1>
            <p>Three excellent cities, one free weekend. Compare the details and cast your votes.</p>
          </div>
          <aside className="trip-brief" aria-label="Trip details">
            <div className="brief-heading">
              <div>
                <span className="micro-label">The occasion</span>
                <h2>Maya’s birthday escape</h2>
              </div>
              <span className="brief-emoji" aria-hidden="true">✦</span>
            </div>
            <div className="brief-details">
              <div><CalendarDays size={19} /><span><small>When</small><strong>16–18 May</strong></span></div>
              <div><Users size={19} /><span><small>Who's going</small><strong>6 friends</strong></span></div>
              <div><MapPin size={19} /><span><small>Leaving from</small><strong>Berlin</strong></span></div>
            </div>
          </aside>
        </section>

        <section className="destinations-section page-width" id="destinations">
          <div className="section-heading-row">
            <div>
              <span className="section-kicker">The shortlist</span>
              <h2>Pick your favourites</h2>
              <p>You have {2 - myVotes.length} of 2 votes left</p>
            </div>
            <div className="filter-group" aria-label="Filter destinations">
              {(["All picks", "Best value", "Train-friendly"] as Filter[]).map((item) => (
                <button key={item} className={filter === item ? "filter-pill active" : "filter-pill"} onClick={() => setFilter(item)}>
                  {item === "Train-friendly" && <TrainFront size={15} />}{item}
                </button>
              ))}
            </div>
          </div>

          <div className={`destination-grid ${visibleDestinations.length === 1 ? "single-card-grid" : ""}`}>
            {visibleDestinations.map((destination) => {
              const selected = myVotes.includes(destination.id)
              const score = scores.find((item) => item.id === destination.id)!
              return (
                <article className={`destination-card ${selected ? "selected" : ""}`} key={destination.id}>
                  <div className="art-wrap">
                    <DestinationArtwork id={destination.id} />
                    <span className="match-badge"><Sparkles size={13} fill="currentColor" /> {destination.match}% match</span>
                    <button className={`heart-button ${selected ? "selected" : ""}`} onClick={() => toggleVote(destination.id)} aria-label={selected ? `Remove vote for ${destination.city}` : `Vote for ${destination.city}`}>
                      <Heart size={20} fill={selected ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="city-heading">
                      <div><h3>{destination.city}</h3><p>{destination.country}</p></div>
                      <div className="weather"><CloudSun size={18} /><strong>{destination.weather}</strong></div>
                    </div>
                    <p className="tagline">{destination.tagline}</p>
                    <div className="trip-stats">
                      <div><WalletCards size={17} /><span><strong>€{destination.budget}</strong><small>per person</small></span></div>
                      <div><TransportIcon type={destination.transport} /><span><strong>{destination.duration}</strong><small>{destination.transport.toLowerCase()}</small></span></div>
                    </div>
                    <div className="tag-row">
                      {destination.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                    <div className="vote-row">
                      <div className="voter-list">
                        <div className="voter-avatars">
                          {destination.voters.map((initials) => <Avatar key={initials} initials={initials} size="small" />)}
                          {selected && <Avatar initials="YO" size="small" label="You" />}
                        </div>
                        <span><strong>{score.votes}</strong> {score.votes === 1 ? "vote" : "votes"}</span>
                      </div>
                      <button className={`vote-button ${selected ? "selected" : ""}`} onClick={() => toggleVote(destination.id)}>
                        {selected ? <><Check size={16} /> Voted</> : <>Vote <ArrowRight size={16} /></>}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
            {suggestedCity && filter === "All picks" && (
              <article className="suggestion-card">
                <span className="suggestion-icon"><MapPin size={23} /></span>
                <div><span className="micro-label">Your suggestion</span><h3>{suggestedCity}</h3><p>The group can now add dates, travel and budget details.</p></div>
                <span className="pending-pill">Pending details</span>
              </article>
            )}
          </div>
          {visibleDestinations.length === 0 && <div className="empty-state"><Search size={28} /><h3>No destinations match</h3><p>Try a different filter to see the full shortlist.</p></div>}
          <button className="suggest-button" onClick={() => setSuggestOpen(true)}><Plus size={17} /> Suggest another place</button>
        </section>

        <section className="comparison-section" id="comparison">
          <div className="page-width comparison-grid">
            <div className="leaderboard-panel">
              <div className="panel-heading">
                <div><span className="section-kicker light">Live results</span><h2>The group is leaning…</h2></div>
                <span className="live-badge"><span /> Live</span>
              </div>
              <div className="leader-list">
                {scores.map((destination, index) => {
                  const total = destination.baseVotes + (myVotes.includes(destination.id) ? 1 : 0)
                  return (
                    <div className={`leader-row ${index === 0 ? "leading" : ""}`} key={destination.id}>
                      <span className="leader-rank">{index === 0 ? <Trophy size={18} /> : index + 1}</span>
                      <div className={`leader-swatch ${destination.accent}`}><DestinationArtwork id={destination.id} /></div>
                      <div className="leader-main">
                        <div><strong>{destination.city}</strong><span>{total} votes</span></div>
                        <div className="leader-track"><span style={{ width: `${Math.max(22, total * 21)}%` }} /></div>
                      </div>
                      {index === 0 && <span className="winning-label">Leading</span>}
                    </div>
                  )
                })}
              </div>
              <div className="results-footnote"><MessageCircle size={17} /><span><strong>Jonas</strong> voted for Copenhagen 12 min ago</span></div>
            </div>

            <div className="budget-panel">
              <div className="panel-heading dark-text">
                <div><span className="section-kicker">Budget check</span><h2>What will it cost?</h2></div>
                <div className="segment-control" aria-label="Budget view">
                  <button className={budgetMode === "person" ? "active" : ""} onClick={() => setBudgetMode("person")}>Per person</button>
                  <button className={budgetMode === "group" ? "active" : ""} onClick={() => setBudgetMode("group")}>Group</button>
                </div>
              </div>
              <p className="budget-subtitle">Estimated total for travel, 2 nights, food and one activity.</p>
              <div className="budget-bars">
                {destinations.map((destination) => {
                  const value = budgetMode === "group" ? destination.budget * 6 : destination.budget
                  return (
                    <div className="budget-row" key={destination.id}>
                      <div><span>{destination.city}</span><strong>€{value.toLocaleString("en-US")}</strong></div>
                      <div className="budget-track"><span className={destination.accent} style={{ width: `${(destination.budget / 400) * 100}%` }} /></div>
                    </div>
                  )
                })}
              </div>
              <div className="budget-insight"><Sparkles size={18} /><p><strong>Ljubljana saves €660 as a group.</strong><br />That covers the Lake Bled day trip and brunch.</p></div>
            </div>
          </div>
        </section>

        <section className="plan-section page-width" id="itinerary">
          <div className="plan-intro">
            <span className="section-kicker">If voting closed now</span>
            <h2>Your {winner.city} weekend,<br /><em>already taking shape.</em></h2>
            <p>{winner.blurb}</p>
            <div className="plan-facts">
              <div><CalendarDays size={18} /><span>Fri 16 — Sun 18 May</span></div>
              <div><House size={18} /><span>{winner.stay}</span></div>
              <div><WalletCards size={18} /><span>€{winner.budget} estimated</span></div>
            </div>
            <button className="primary-button" onClick={() => notify("The detailed plan is ready for the group.")}>View full trip plan <ArrowRight size={17} /></button>
          </div>

          <div className="itinerary-card">
            <div className="itinerary-head">
              <div><span className="mini-overline">Weekend at a glance</span><h3>{winner.city} · 48 hours</h3></div>
              <button className="icon-button" aria-label="More itinerary options"><ChevronDown size={19} /></button>
            </div>
            <div className="timeline">
              {winner.itinerary.map((activity, index) => (
                <div className="timeline-item" key={activity.title}>
                  <div className="timeline-rail"><span><ActivityIcon type={activity.type} /></span>{index < winner.itinerary.length - 1 && <i />}</div>
                  <div className="timeline-content"><time>{activity.time}</time><h4>{activity.title}</h4><p>{activity.description}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="page-width cta-inner">
            <div className="cta-icon"><Sun size={29} /></div>
            <div><span className="section-kicker light">The weekend is calling</span><h2>Send a gentle nudge?</h2><p>Two friends haven’t voted yet. Remind them before voting closes Thursday.</p></div>
            <button onClick={() => notify("A friendly reminder was prepared for Elif and Luca.")}>Nudge the group <ArrowRight size={17} /></button>
          </div>
        </section>
      </main>

      <footer className="footer page-width">
        <a className="brand footer-brand" href="#top"><span className="brand-mark"><Compass size={19} /></span><span>weekender</span></a>
        <p>Less planning. More going.</p>
        <span>Made for the group chat · v1</span>
      </footer>

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <button className="active" onClick={() => scrollTo("destinations")}><Map size={19} /><span>Explore</span></button>
        <button onClick={() => scrollTo("comparison")}><SlidersHorizontal size={19} /><span>Compare</span></button>
        <button onClick={() => scrollTo("itinerary")}><CalendarDays size={19} /><span>Trip plan</span></button>
        <button onClick={shareTrip}><Share2 size={19} /><span>Share</span></button>
      </nav>

      {toast && <div className="toast" role="status"><CircleCheck size={19} />{toast}</div>}

      {suggestOpen && (
        <div className="modal-backdrop" onMouseDown={() => setSuggestOpen(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="suggest-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSuggestOpen(false)} aria-label="Close"><X size={20} /></button>
            <span className="modal-icon"><MapPin size={24} /></span>
            <span className="section-kicker">Add to the mix</span>
            <h2 id="suggest-title">Where else should<br />the group consider?</h2>
            <p>Add a city now. Everyone can help fill in the travel details later.</p>
            <form onSubmit={submitSuggestion}>
              <label htmlFor="city">City or place</label>
              <div className="input-wrap"><Search size={18} /><input id="city" autoFocus value={suggestion} onChange={(event) => setSuggestion(event.target.value)} placeholder="e.g. Valencia" /></div>
              <button className="primary-button" type="submit" disabled={!suggestion.trim()}>Add suggestion <ArrowRight size={17} /></button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
