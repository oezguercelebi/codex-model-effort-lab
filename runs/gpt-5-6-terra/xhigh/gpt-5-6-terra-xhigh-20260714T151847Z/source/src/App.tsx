import { useMemo, useState } from "react"
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Compass,
  Euro,
  Home,
  Map,
  MapPin,
  Menu,
  MoreHorizontal,
  Plus,
  Sparkles,
  Ticket,
  Users,
  X,
} from "lucide-react"

type Destination = {
  id: string
  city: string
  country: string
  emoji: string
  style: string
  flight: string
  duration: string
  budget: number
  temperature: string
  subtitle: string
  description: string
  votes: number
  tags: string[]
  activities: string[]
  flightTime: string
}

const destinations: Destination[] = [
  {
    id: "lisbon",
    city: "Lisbon",
    country: "Portugal",
    emoji: "☀️",
    style: "lisbon-scene",
    flight: "Direct",
    duration: "2h 55m",
    budget: 485,
    temperature: "22°",
    subtitle: "Sunny streets & late dinners",
    description: "Golden viewpoints, tiled lanes, ocean air, and just enough room to wander.",
    votes: 4,
    tags: ["Food", "Culture", "Sun"],
    activities: ["Tram 28 at golden hour", "Seafood dinner in Alfama", "Sunday in Belém"],
    flightTime: "Thu · 17:40 → 20:35",
  },
  {
    id: "mallorca",
    city: "Mallorca",
    country: "Spain",
    emoji: "🌊",
    style: "mallorca-scene",
    flight: "1 stop",
    duration: "4h 10m",
    budget: 560,
    temperature: "24°",
    subtitle: "Coves, coastlines & slow mornings",
    description: "A long-table weekend shaped around clear water, small towns, and time outside.",
    votes: 2,
    tags: ["Beach", "Relaxed", "Nature"],
    activities: ["Morning swim at Caló des Moro", "Hike the Tramuntana", "Dinner in Sóller"],
    flightTime: "Thu · 16:15 → 20:25",
  },
  {
    id: "copenhagen",
    city: "Copenhagen",
    country: "Denmark",
    emoji: "🚲",
    style: "copenhagen-scene",
    flight: "Direct",
    duration: "1h 35m",
    budget: 630,
    temperature: "16°",
    subtitle: "Design, bakeries & canal swims",
    description: "A polished city break for cycling everywhere, exceptional coffee, and a little edge.",
    votes: 3,
    tags: ["Design", "City", "Food"],
    activities: ["Bikes to Refshaleøen", "Wine bar in Vesterbro", "Pastries at Juno"],
    flightTime: "Thu · 18:10 → 19:45",
  },
]

const members = [
  { name: "Mia Chen", initials: "MC", color: "peach" },
  { name: "Noah Baker", initials: "NB", color: "lavender" },
  { name: "Ari Clark", initials: "AC", color: "sky" },
  { name: "You", initials: "YO", color: "mint" },
]

const navItems = [
  { label: "Overview", icon: Home },
  { label: "Destinations", icon: Compass },
  { label: "Itinerary", icon: CalendarDays },
  { label: "Expenses", icon: Euro },
]

function Avatar({ initials, color, small = false }: { initials: string; color: string; small?: boolean }) {
  return <span className={`avatar avatar-${color} ${small ? "avatar-small" : ""}`}>{initials}</span>
}

export default function App() {
  const [activeNav, setActiveNav] = useState("Overview")
  const [selectedId, setSelectedId] = useState("lisbon")
  const [votedFor, setVotedFor] = useState<string | null>(null)
  const [showItinerary, setShowItinerary] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isShared, setIsShared] = useState(false)

  const finalDestinations = useMemo(
    () => destinations.map((destination) => ({
      ...destination,
      votes: destination.votes + (votedFor === destination.id ? 1 : 0),
    })),
    [votedFor],
  )
  const winner = finalDestinations.reduce((top, destination) => destination.votes > top.votes ? destination : top)
  const selectedDestination = finalDestinations.find((destination) => destination.id === selectedId) ?? winner

  function toggleVote(id: string) {
    setVotedFor((current) => current === id ? null : id)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Sparkles size={17} /></span><span>weekender</span></div>
        <div className="trip-switcher">
          <span className="trip-icon"><MapPin size={15} /></span>
          <span><small>Current trip</small><strong>Long weekend</strong></span>
          <ChevronDown size={15} />
        </div>
        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-item ${activeNav === label ? "active" : ""}`} onClick={() => setActiveNav(label)}>
              <Icon size={18} /><span>{label}</span>{label === "Destinations" && <b>3</b>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="crew-card">
            <div className="crew-card-top"><span>THE CREW</span><button aria-label="Invite a friend"><Plus size={15} /></button></div>
            <div className="crew-faces">{members.map((member) => <Avatar key={member.initials} initials={member.initials} color={member.color} />)}<span className="crew-more">+1</span></div>
            <p>5 friends planning a trip</p>
          </div>
          <button className="nav-item support"><CircleHelp size={18} /><span>Help & feedback</span></button>
          <div className="profile-row"><Avatar initials="OR" color="charcoal" /><div><strong>Olya Ross</strong><small>Trip organizer</small></div><MoreHorizontal size={18} /></div>
        </div>
      </aside>

      <header className="mobile-header">
        <div className="brand"><span className="brand-mark"><Sparkles size={16} /></span><span>weekender</span></div>
        <button className="icon-button" aria-label="Open menu" onClick={() => setShowMobileMenu(true)}><Menu size={21} /></button>
      </header>

      {showMobileMenu && <div className="mobile-menu-backdrop" onClick={() => setShowMobileMenu(false)}>
        <aside className="mobile-menu" onClick={(event) => event.stopPropagation()}>
          <div className="mobile-menu-head"><strong>Long weekend</strong><button className="icon-button" onClick={() => setShowMobileMenu(false)}><X size={20} /></button></div>
          {navItems.map(({ label, icon: Icon }) => <button key={label} className={`nav-item ${activeNav === label ? "active" : ""}`} onClick={() => { setActiveNav(label); setShowMobileMenu(false) }}><Icon size={18} />{label}</button>)}
          <div className="mobile-crew"><span>THE CREW · 5</span><div className="crew-faces">{members.map((member) => <Avatar key={member.initials} initials={member.initials} color={member.color} />)}</div></div>
        </aside>
      </div>}

      <main className="main-content">
        <div className="topbar">
          <div className="topbar-note"><span className="live-dot" />Planning in progress <span className="topbar-divider">·</span> May 23–26</div>
          <button className={`share-button ${isShared ? "shared" : ""}`} onClick={() => setIsShared(true)}>{isShared ? <Check size={16} /> : null}{isShared ? "Link copied" : "Share plan"}</button>
        </div>

        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span>✦</span> THIS ONE'S FOR THE GROUP CHAT</p>
            <h1>Let’s make this<br /><em>weekend count.</em></h1>
            <p className="hero-subtitle">A long weekend, one great decision, zero spreadsheets.</p>
            <div className="hero-meta"><span><CalendarDays size={16} /> Thu, May 23 — Sun, May 26</span><span className="dot-divider">•</span><span><Users size={16} /> 5 friends</span></div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="sun" />
            <div className="hill hill-one" /><div className="hill hill-two" /><div className="hill hill-three" />
            <div className="postcard"><span>WEEKEND<br />AWAY</span><small>05.23 — 05.26</small></div>
            <div className="plane">✈</div>
            <div className="squiggle">⌇</div>
          </div>
        </section>

        <section className="decision-card">
          <div className="decision-copy"><span className="decision-number">01</span><div><p className="section-kicker">THE BIG QUESTION</p><h2>Where are we going?</h2><p>Three excellent options. A decision is waiting.</p></div></div>
          <button className="text-button" onClick={() => setActiveNav("Destinations")}>Compare all <ArrowRight size={16} /></button>
        </section>

        <section className="destination-grid" aria-label="Destination options">
          {finalDestinations.map((destination) => {
            const isSelected = selectedDestination.id === destination.id
            const hasVoted = votedFor === destination.id
            return <article key={destination.id} className={`destination-card ${isSelected ? "selected" : ""}`} onClick={() => setSelectedId(destination.id)}>
              <div className={`destination-art ${destination.style}`}><span className="art-emoji">{destination.emoji}</span><span className="temperature">{destination.temperature}</span><div className="art-sun" /><div className="art-hill" /></div>
              <div className="destination-body">
                <div className="destination-heading"><div><h3>{destination.city}</h3><p>{destination.country}</p></div><button className="card-menu" aria-label={`Options for ${destination.city}`} onClick={(event) => event.stopPropagation()}><MoreHorizontal size={19} /></button></div>
                <p className="destination-subtitle">{destination.subtitle}</p>
                <div className="travel-facts"><span><Ticket size={14} /> {destination.flight}</span><span><Clock3 size={14} /> {destination.duration}</span></div>
                <div className="card-bottom"><button className={`vote-button ${hasVoted ? "voted" : ""}`} onClick={(event) => { event.stopPropagation(); toggleVote(destination.id) }}><span>{hasVoted ? <Check size={14} /> : "♡"}</span>{destination.votes} {destination.votes === 1 ? "vote" : "votes"}</button><span className="budget">~€{destination.budget}<small>/ person</small></span></div>
              </div>
            </article>
          })}
        </section>

        <section className="lower-grid">
          <article className="leader-card">
            <div className="leader-top"><div><p className="section-kicker">CURRENTLY IN THE LEAD</p><h2>{winner.city} <span>is calling</span></h2></div><span className="leader-badge"><Sparkles size={14} /> FRONT RUNNER</span></div>
            <div className="leader-details"><div className={`leader-illustration ${winner.style}`}><span>{winner.emoji}</span></div><div className="leader-copy"><p>{winner.description}</p><div className="leader-tags">{winner.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="vote-progress"><div className="faces-inline">{members.slice(0, winner.votes).map((member) => <Avatar key={member.initials} initials={member.initials} color={member.color} small />)}</div><strong>{winner.votes} of 5 ready to go</strong></div></div><button className="view-plan" onClick={() => setShowItinerary(true)}>View the plan <ArrowRight size={16} /></button></div>
          </article>
          <article className="budget-card">
            <div className="budget-header"><div><p className="section-kicker">THE ROUGH MATH</p><h2>Weekend budget</h2></div><button className="icon-button"><MoreHorizontal size={19} /></button></div>
            <div className="budget-total"><span>Expected per person</span><strong>€{winner.budget}</strong><small>Flights + stay + food</small></div>
            <div className="budget-lines"><div><span><i className="line-flight" /> Flights</span><strong>€162</strong></div><div><span><i className="line-stay" /> Stay · 3 nights</span><strong>€204</strong></div><div><span><i className="line-food" /> Food & good times</span><strong>€119</strong></div></div>
            <button className="text-button budget-link" onClick={() => setActiveNav("Expenses")}>See full breakdown <ArrowRight size={16} /></button>
          </article>
        </section>

        <section className="next-step">
          <div className="step-icon"><Map size={21} /></div><div><p className="section-kicker">NEXT UP</p><h2>Pick a place to stay together</h2><p>We’ll pull in a few stays once the destination is locked.</p></div><button className="outline-button" onClick={() => setShowItinerary(true)}>Explore the itinerary <ArrowRight size={16} /></button>
        </section>

        <footer><span>Made for the moments between the moments.</span><span>Weekender · 2024</span></footer>
      </main>

      {showItinerary && <div className="modal-backdrop" role="presentation" onClick={() => setShowItinerary(false)}>
        <section className="itinerary-modal" role="dialog" aria-modal="true" aria-labelledby="itinerary-title" onClick={(event) => event.stopPropagation()}>
          <button className="modal-close" aria-label="Close itinerary" onClick={() => setShowItinerary(false)}><X size={18} /></button>
          <div className={`modal-hero ${winner.style}`}><span>{winner.emoji}</span><p>THE LONG WEEKEND</p><h2 id="itinerary-title">{winner.city}, here we come.</h2><small>May 23 — 26 · {winner.flightTime}</small></div>
          <div className="itinerary-content"><div className="itinerary-intro"><div><p className="section-kicker">A GENTLE FIRST DRAFT</p><h3>Leave room for the good stuff.</h3></div><span className="itinerary-status"><span className="live-dot" /> Draft</span></div>{winner.activities.map((activity, index) => <div className="itinerary-row" key={activity}><span className="itinerary-day">{["FRI", "SAT", "SUN"][index]}<small>{24 + index} MAY</small></span><span className="itinerary-line" /><div><strong>{activity}</strong><p>{index === 0 ? "Ease in, drop the bags, chase the afternoon." : index === 1 ? "The one thing everyone will talk about later." : "A slow last day before heading home."}</p></div></div>)}<button className="confirm-button" onClick={() => setShowItinerary(false)}>Looks perfect <Check size={17} /></button></div>
        </section>
      </div>}
    </div>
  )
}
