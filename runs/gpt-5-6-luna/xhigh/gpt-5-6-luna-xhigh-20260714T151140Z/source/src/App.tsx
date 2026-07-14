import { useMemo, useState } from "react"
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Coffee,
  Compass,
  Copy,
  Euro,
  Heart,
  Link,
  MapPin,
  Menu,
  MoreHorizontal,
  Navigation,
  Plane,
  Plus,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Sun,
  TrendingUp,
  Users,
  Utensils,
  Vote,
  Waves,
  X,
} from "lucide-react"

type Destination = {
  id: string
  name: string
  country: string
  code: string
  theme: string
  temperature: string
  description: string
  bestFor: string
  budget: number
  travelTime: string
  hours: number
  votes: number
  voters: string[]
  badge?: string
  rating: string
}

type ItineraryItem = {
  time: string
  title: string
  description: string
  type: "food" | "walk" | "culture" | "water"
}

const destinations: Destination[] = [
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    code: "PT",
    theme: "lisbon",
    temperature: "24°",
    description: "Tile-lined streets, golden light, and the best pastel de nata in town.",
    bestFor: "Food & slow mornings",
    budget: 320,
    travelTime: "2h 40m",
    hours: 2.67,
    votes: 6,
    voters: ["AM", "JK", "SL", "NS", "MO", "TD"],
    badge: "Leading",
    rating: "4.9",
  },
  {
    id: "como",
    name: "Lake Como",
    country: "Italy",
    code: "IT",
    theme: "como",
    temperature: "21°",
    description: "A lakeside reset with slow boat rides and villages made for wandering.",
    bestFor: "Views & recharging",
    budget: 410,
    travelTime: "3h 15m",
    hours: 3.25,
    votes: 4,
    voters: ["RB", "AM", "KL", "TD"],
    rating: "4.8",
  },
  {
    id: "copenhagen",
    name: "Copenhagen",
    country: "Denmark",
    code: "DK",
    theme: "copenhagen",
    temperature: "17°",
    description: "Design, bikes, and cozy corners for a city break with plenty of hygge.",
    bestFor: "Design & good times",
    budget: 365,
    travelTime: "1h 50m",
    hours: 1.83,
    votes: 3,
    voters: ["JK", "NS", "RB"],
    rating: "4.7",
  },
]

const people = [
  { name: "Alex Morgan", initials: "AM", color: "coral", vote: "Lisbon" },
  { name: "Jamie Kim", initials: "JK", color: "yellow", vote: "Lisbon" },
  { name: "Sofia Lee", initials: "SL", color: "blue", vote: "Lisbon" },
  { name: "Nora Shah", initials: "NS", color: "purple", vote: "Copenhagen" },
  { name: "Maya Ortiz", initials: "MO", color: "green", vote: "Lisbon" },
]

const itinerary: ItineraryItem[] = [
  {
    time: "Fri · 16:40",
    title: "Land & settle in",
    description: "Check in at Casa do Bairro, then take the scenic route to Bairro Alto.",
    type: "walk",
  },
  {
    time: "Fri · 19:30",
    title: "Petiscos at Taberna",
    description: "A table of small plates, local wine, and no plans after dinner.",
    type: "food",
  },
  {
    time: "Sat · 10:00",
    title: "Tram 28 & Alfama",
    description: "Ride the yellow tram early, then wander the oldest streets in the city.",
    type: "culture",
  },
  {
    time: "Sat · 15:00",
    title: "Golden hour by the water",
    description: "Slow afternoon at Ribeira das Naus with a stop for something cold.",
    type: "water",
  },
]

const iconForItinerary = {
  food: Utensils,
  walk: Navigation,
  culture: Camera,
  water: Waves,
}

function AvatarStack({ initials, extra }: { initials: string[]; extra?: number }) {
  return (
    <div className="avatar-stack" aria-label={`${initials.length + (extra ?? 0)} voters`}>
      {initials.slice(0, 4).map((initial, index) => (
        <span className={`avatar avatar-${index}`} key={initial}>
          {initial}
        </span>
      ))}
      {extra ? <span className="avatar avatar-more">+{extra}</span> : null}
    </div>
  )
}

function DestinationArt({ destination }: { destination: Destination }) {
  return (
    <div className={`destination-art art-${destination.theme}`}>
      <div className="art-grain" />
      <div className="art-sun" />
      <div className="art-cloud cloud-one" />
      <div className="art-cloud cloud-two" />
      <div className="art-hill hill-back" />
      <div className="art-hill hill-front" />
      <div className="art-building building-one" />
      <div className="art-building building-two" />
      <div className="art-building building-three" />
      <div className="art-flag" />
      <div className="art-copy">
        <span>{destination.code}</span>
        <strong>{destination.temperature}</strong>
      </div>
      <div className="art-label">
        <MapPin size={13} strokeWidth={2.5} />
        <span>{destination.country}</span>
      </div>
    </div>
  )
}

function App() {
  const [activeView, setActiveView] = useState("Overview")
  const [activeFilter, setActiveFilter] = useState("All options")
  const [votedFor, setVotedFor] = useState<string | null>(null)
  const [showInvite, setShowInvite] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  const rankedDestinations = useMemo(
    () =>
      destinations
        .map((destination) => ({
          ...destination,
          displayVotes: destination.votes + (votedFor === destination.id ? 1 : 0),
        }))
        .sort((a, b) => b.displayVotes - a.displayVotes),
    [votedFor],
  )

  const leadingDestination = rankedDestinations[0]

  const filteredDestinations = rankedDestinations.filter((destination) => {
    if (activeFilter === "Under €350") return destination.budget < 350
    if (activeFilter === "Under 3 hours") return destination.hours < 3
    return true
  })

  const handleVote = (destinationId: string) => {
    setVotedFor((current) => (current === destinationId ? null : destinationId))
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText("weekender.app/trip/late-summer-escape")
    } catch {
      // Clipboard access is optional in local previews.
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const goTo = (view: string) => {
    setActiveView(view)
    setMobileMenu(false)
    if (view === "Itinerary") {
      document.getElementById("itinerary")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    if (view === "Destinations") {
      document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    if (view === "Overview") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><Compass size={19} strokeWidth={2.5} /></div>
          <span>weekender</span>
        </div>

        <div className="trip-switcher">
          <div className="trip-switcher-icon"><Sun size={16} /></div>
          <div>
            <span className="eyebrow">Current trip</span>
            <strong>Late summer escape</strong>
          </div>
          <ChevronDown size={15} className="trip-chevron" />
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <span className="nav-label">Workspace</span>
          {[
            { label: "Overview", icon: Sparkles },
            { label: "Destinations", icon: MapPin },
            { label: "Itinerary", icon: CalendarDays },
          ].map(({ label, icon: Icon }) => (
            <button
              className={`nav-item ${activeView === label ? "active" : ""}`}
              key={label}
              onClick={() => goTo(label)}
            >
              <Icon size={18} strokeWidth={activeView === label ? 2.5 : 2} />
              <span>{label}</span>
              {label === "Itinerary" && <span className="nav-count">3</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-spark"><Sparkles size={14} /></span>
            <div>
              <strong>Tip from us</strong>
              <p>Vote early to help your favorite win.</p>
            </div>
          </div>
          <button className="profile-row">
            <span className="profile-avatar">SC</span>
            <span className="profile-copy"><strong>Sam Carter</strong><small>Trip organizer</small></span>
            <MoreHorizontal size={17} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu-button" onClick={() => setMobileMenu((open) => !open)} aria-label="Toggle menu">
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="breadcrumb"><span>Trips</span><ChevronRight size={14} /><strong>Late summer escape</strong></div>
          <div className="topbar-actions">
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setShowNotifications((open) => !open)}>
              <Bell size={19} />
              <i />
            </button>
            <div className="topbar-avatar">SC</div>
            {showNotifications && (
              <div className="notification-popover">
                <strong>You're all caught up</strong>
                <p>Jamie and Sofia just voted for Lisbon.</p>
              </div>
            )}
          </div>
        </header>

        <div className="page-wrap">
          <section className="hero-section">
            <div>
              <div className="hero-eyebrow"><span className="live-dot" /> Voting is open <span className="dot-separator">·</span> closes in 2 days</div>
              <h1>Where should we<br /><em>go next?</em></h1>
              <p className="hero-description">A great weekend starts with a little group decision-making. Compare the options, cast your vote, and let the adventure begin.</p>
            </div>
            <div className="hero-actions">
              <div className="member-avatars"><AvatarStack initials={["AM", "JK", "SL", "NS"]} extra={4} /><span>8 friends</span></div>
              <button className="primary-button" onClick={() => setShowInvite(true)}><Plus size={17} /> Invite friends</button>
            </div>
          </section>

          <section className="stats-grid" aria-label="Trip summary">
            <div className="stat-card">
              <div className="stat-icon stat-icon-peach"><MapPin size={19} /></div>
              <div><span className="stat-label">Options on the table</span><strong>3 destinations</strong><small><TrendingUp size={12} /> All looking good</small></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-yellow"><Euro size={19} /></div>
              <div><span className="stat-label">Average per person</span><strong>€365</strong><small>Flights + stay + fun</small></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-blue"><Clock3 size={19} /></div>
              <div><span className="stat-label">Shortest travel time</span><strong>1h 50m</strong><small>From Berlin · direct</small></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon stat-icon-purple"><Users size={19} /></div>
              <div><span className="stat-label">Friends have voted</span><strong>{votedFor ? "8 of 8" : "7 of 8"}</strong><small>{votedFor ? "Everyone's in" : "1 vote to go"}</small></div>
            </div>
          </section>

          <section className="content-section" id="destinations">
            <div className="section-heading">
              <div><span className="section-kicker">The shortlist</span><h2>Compare your options</h2></div>
              <div className="filter-row" role="group" aria-label="Filter destinations">
                {["All options", "Under €350", "Under 3 hours"].map((filter) => (
                  <button key={filter} className={`filter-button ${activeFilter === filter ? "active" : ""}`} onClick={() => setActiveFilter(filter)}>{filter}</button>
                ))}
                <button className="filter-settings" aria-label="More filters"><SlidersHorizontal size={17} /></button>
              </div>
            </div>
            <div className="destination-grid">
              {filteredDestinations.map((destination) => {
                const isVoted = votedFor === destination.id
                return (
                  <article className={`destination-card ${isVoted ? "voted" : ""}`} key={destination.id}>
                    <div className="card-image-wrap">
                      <DestinationArt destination={destination} />
                      {destination.badge && <span className="leading-badge"><TrendingUp size={13} /> {destination.badge}</span>}
                      <button className="save-button" aria-label={`Save ${destination.name}`}><Heart size={17} /></button>
                    </div>
                    <div className="destination-card-body">
                      <div className="destination-title-row"><div><h3>{destination.name}</h3><span className="destination-country"><MapPin size={12} /> {destination.country}</span></div><span className="rating"><span>★</span> {destination.rating}</span></div>
                      <p className="destination-description">{destination.description}</p>
                      <div className="destination-details">
                        <span><Euro size={14} /> {destination.budget} <small>/ person</small></span>
                        <span><Plane size={14} /> {destination.travelTime}</span>
                      </div>
                      <div className="destination-card-footer">
                        <div><span className="best-for-label">Best for</span><strong>{destination.bestFor}</strong><AvatarStack initials={destination.voters} /></div>
                        <button className={`vote-button ${isVoted ? "voted" : ""}`} onClick={() => handleVote(destination.id)}>{isVoted ? <><Check size={16} /> Voted</> : <><Vote size={16} /> Vote</>}</button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
            {filteredDestinations.length === 0 && <div className="empty-state">No destinations fit that filter. Try widening the search.</div>}
          </section>

          <section className="lower-grid">
            <div className="pulse-card panel-card">
              <div className="panel-heading"><div><span className="section-kicker">Group pulse</span><h2>What everyone’s feeling</h2></div><button className="more-button"><MoreHorizontal size={20} /></button></div>
              <div className="pulse-lead"><div className="pulse-circle"><span>{leadingDestination.displayVotes}</span><small>/ 13</small></div><div><strong>{leadingDestination.name} is in front</strong><p>That’s {Math.round((leadingDestination.displayVotes / 13) * 100)}% of the group’s votes so far.</p></div></div>
              <div className="vote-bars">
                {rankedDestinations.map((destination) => <div className="vote-bar-row" key={destination.id}><div className="vote-bar-label"><span>{destination.name}</span><strong>{destination.displayVotes}</strong></div><div className="vote-bar-track"><span className={`vote-bar-fill fill-${destination.theme}`} style={{ width: `${Math.max(destination.displayVotes / 13 * 100, 12)}%` }} /></div></div>)}
              </div>
              <div className="recent-votes"><span className="recent-label">Recent votes</span>{people.slice(0, 4).map((person) => <div className="recent-person" key={person.initials}><span className={`tiny-avatar ${person.color}`}>{person.initials}</span><span>{person.name.split(" ")[0]}</span><small>{person.vote}</small></div>)}</div>
            </div>

            <div className="itinerary-card panel-card" id="itinerary">
              <div className="panel-heading"><div><span className="section-kicker">If Lisbon wins</span><h2>A little taste of the plan</h2></div><button className="text-button" onClick={() => goTo("Itinerary")}>View full plan <ArrowUpRight size={16} /></button></div>
              <div className="itinerary-summary"><div className="summary-icon"><CalendarDays size={18} /></div><div><strong>October 11—13, 2024</strong><span>3 days · 2 nights · 8 friends</span></div><button className="share-button" aria-label="Share itinerary" onClick={() => setShowInvite(true)}><Share2 size={16} /></button></div>
              <div className="timeline">
                {itinerary.slice(0, 3).map((item, index) => { const Icon = iconForItinerary[item.type]; return <div className="timeline-item" key={item.title}><div className={`timeline-icon timeline-${item.type}`}><Icon size={16} /></div><div className="timeline-copy"><span>{item.time}</span><strong>{item.title}</strong><p>{item.description}</p></div>{index === 0 && <span className="next-label">Next</span>}</div> })}
              </div>
              <button className="outline-button" onClick={() => goTo("Itinerary")}>Explore the Lisbon plan <ChevronRight size={16} /></button>
            </div>
          </section>

          <section className="final-callout">
            <div className="callout-art"><div className="callout-sun" /><div className="callout-wave wave-one" /><div className="callout-wave wave-two" /><span>WEEKENDER<br /><b>2024</b></span></div>
            <div className="callout-copy"><span className="section-kicker">The good part</span><h2>One weekend.<br /><em>Zero group chat chaos.</em></h2><p>Once everyone has voted, we’ll turn the winning destination into a plan the whole group can get excited about.</p></div>
            <div className="callout-action"><span><Check size={15} /> Everyone can see the results</span><button className="secondary-button" onClick={() => setShowInvite(true)}>Share this trip <Share2 size={16} /></button></div>
          </section>

          <footer><span>Made for the group chat <span className="footer-heart">♥</span></span><span>Last updated just now</span></footer>
        </div>
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {[{ label: "Home", icon: Sparkles, view: "Overview" }, { label: "Places", icon: MapPin, view: "Destinations" }, { label: "Plan", icon: CalendarDays, view: "Itinerary" }, { label: "People", icon: Users, view: "People" }].map(({ label, icon: Icon, view }) => <button key={label} className={activeView === view ? "active" : ""} onClick={() => goTo(view)}><Icon size={19} /><span>{label}</span></button>)}
      </nav>

      {showInvite && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowInvite(false) }}>
        <div className="invite-modal" role="dialog" aria-modal="true" aria-labelledby="invite-title">
          <button className="modal-close" onClick={() => setShowInvite(false)} aria-label="Close"><X size={18} /></button>
          <div className="modal-icon"><Link size={20} /></div>
          <span className="section-kicker">Bring the crew in</span>
          <h2 id="invite-title">Share your trip</h2>
          <p>Send this link to your friends so everyone can see the shortlist and vote.</p>
          <div className="share-input"><span>weekender.app/trip/late-summer-escape</span><button onClick={handleCopy}>{copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy</>}</button></div>
          <button className="primary-button modal-done" onClick={() => setShowInvite(false)}>Done</button>
        </div>
      </div>}
    </div>
  )
}

export default App
