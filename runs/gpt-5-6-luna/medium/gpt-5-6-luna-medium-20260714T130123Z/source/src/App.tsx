import { useMemo, useState } from "react"
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Compass,
  Euro,
  Heart,
  MapPin,
  Plus,
  Sparkles,
  TrainFront,
  Users,
  X,
} from "lucide-react"

type Destination = {
  id: string
  city: string
  country: string
  emoji: string
  color: string
  image: string
  tagline: string
  distance: string
  travel: string
  budget: string
  weather: string
  votes: number
  liked?: boolean
  reason: string
}

const initialDestinations: Destination[] = [
  { id: "lisbon", city: "Lisbon", country: "Portugal", emoji: "🇵🇹", color: "peach", image: "lisbon", tagline: "Sun, seafood & tiled streets", distance: "1,863 km", travel: "3h 25m", budget: "€385", weather: "22° / sunny", votes: 4, liked: true, reason: "The group is craving a sunny city break with great food." },
  { id: "copenhagen", city: "Copenhagen", country: "Denmark", emoji: "🇩🇰", color: "blue", image: "copenhagen", tagline: "Design, bikes & hygge", distance: "878 km", travel: "1h 25m", budget: "€420", weather: "17° / cloudy", votes: 3, reason: "Easy to get around, with a brilliant food and design scene." },
  { id: "ljubljana", city: "Ljubljana", country: "Slovenia", emoji: "🇸🇮", color: "green", image: "ljubljana", tagline: "Riverside charm & alpine air", distance: "816 km", travel: "2h 05m", budget: "€310", weather: "20° / clear", votes: 2, reason: "A left-field pick with an old town, wine bars and nature nearby." },
]

const itinerary = [
  { day: "Friday", date: "14 Jun", time: "18:40", title: "Arrive & check in", detail: "Metro to Alfama · Hotel check-in", icon: TrainFront, tag: "Travel" },
  { day: "Saturday", date: "15 Jun", time: "10:00", title: "Wander the old town", detail: "Pastéis de Belém, LX Factory & a sunset miradouro", icon: Compass, tag: "Explore" },
  { day: "Saturday", date: "15 Jun", time: "20:30", title: "Petiscos for everyone", detail: "Table booked at Taberna da Rua das Flores", icon: Sparkles, tag: "Dinner" },
  { day: "Sunday", date: "16 Jun", time: "09:30", title: "Slow morning by the river", detail: "Coffee, market browsing & one last swim", icon: Heart, tag: "Easy" },
]

function App() {
  const [destinations, setDestinations] = useState(initialDestinations)
  const [activeTab, setActiveTab] = useState("Destinations")
  const [showAll, setShowAll] = useState(false)
  const [toast, setToast] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const [newPlace, setNewPlace] = useState("")
  const [voted, setVoted] = useState(false)

  const winner = useMemo(() => [...destinations].sort((a, b) => b.votes - a.votes)[0], [destinations])
  const totalVotes = destinations.reduce((sum, destination) => sum + destination.votes, 0)

  function toggleLike(id: string) {
    setDestinations((items) => items.map((item) => item.id === id ? { ...item, liked: !item.liked } : item))
  }

  function castVote(id: string) {
    setDestinations((items) => items.map((item) => item.id === id ? { ...item, votes: item.votes + 1 } : item))
    setVoted(true)
    setToast("Your vote is in — nice choice!")
    window.setTimeout(() => setToast(""), 2600)
  }

  function addDestination() {
    const trimmed = newPlace.trim()
    if (!trimmed) return
    setDestinations((items) => [...items, { id: trimmed.toLowerCase().replace(/\s+/g, "-"), city: trimmed, country: "New idea", emoji: "✨", color: "purple", image: "new", tagline: "A fresh idea for the group", distance: "—", travel: "Research needed", budget: "€?", weather: "Check forecast", votes: 0, reason: "Just added by you to the shortlist." }])
    setNewPlace("")
    setAddOpen(false)
    setToast(`${trimmed} added to the shortlist`)
    window.setTimeout(() => setToast(""), 2600)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Weekender home"><span className="brand-mark">w</span><span>weekender</span></a>
        <div className="trip-switcher"><span className="trip-dot" /> <span>Summer 2024 · 6 friends</span><ChevronDown size={15} /></div>
        <div className="header-actions"><button className="icon-btn" aria-label="View friends"><Users size={18} /></button><div className="avatar-stack"><span className="avatar avatar-a">M</span><span className="avatar avatar-b">J</span><span className="avatar avatar-c">S</span><span className="avatar-count">+3</span></div><button className="profile">AL</button></div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line" /> Your next escape</p><h1>Make a weekend<br /><em>worth remembering.</em></h1><p className="hero-sub">Six friends. One long weekend.<br />Let’s find somewhere great to go.</p><div className="hero-meta"><span><CalendarDays size={16} /> 14–16 June 2024</span><span><MapPin size={16} /> From Berlin</span></div></div>
          <div className="hero-art"><div className="sun" /><div className="art-stamp">GOOD<br />TIMES<br /><small>↗ AHEAD</small></div><div className="art-label"><span>SHORTLIST</span><strong>{destinations.length} places to go</strong></div><div className="hill hill-back" /><div className="hill hill-front" /><div className="river" /><span className="art-star star-one">✦</span><span className="art-star star-two">✦</span></div>
        </section>

        <nav className="tabs" aria-label="Trip sections">{["Destinations", "The plan", "Packing list"].map((tab) => <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>{tab}{tab === "The plan" && <span className="tab-dot" />}</button>)}<button className="share-button" onClick={() => { navigator.clipboard?.writeText("Weekender trip · 14–16 June"); setToast("Trip link copied") }}><ArrowRight size={16} /> Share trip</button></nav>

        {activeTab === "Destinations" && <div className="content-grid">
          <section className="destination-section"><div className="section-heading"><div><p className="eyebrow small">The shortlist</p><h2>Where should we go?</h2></div><button className="add-link" onClick={() => setAddOpen(true)}><Plus size={16} /> Add a place</button></div><p className="section-intro">Everyone has a say. Cast your vote, then we’ll make it happen.</p>
            <div className="cards">{destinations.slice(0, showAll ? undefined : 3).map((destination, index) => <DestinationCard key={destination.id} destination={destination} rank={index + 1} onLike={toggleLike} onVote={castVote} voted={voted} />)}</div>
            {destinations.length > 3 && <button className="view-more" onClick={() => setShowAll(!showAll)}>{showAll ? "Show less" : `View ${destinations.length - 3} more ideas`} <ChevronDown size={16} className={showAll ? "flip" : ""} /></button>}
          </section>
          <aside className="sidebar"><div className="vote-card"><div className="vote-card-top"><span className="live-pill"><i /> VOTING OPEN</span><span className="vote-count">{totalVotes}/18 votes</span></div><h3>What’s the vibe?</h3><p>Vote for your favourite. You can change it anytime.</p><div className="vote-bars">{destinations.slice(0, 3).map((d) => <div className="bar-row" key={d.id}><div className="bar-label"><span>{d.emoji} {d.city}</span><strong>{d.votes}</strong></div><div className="bar-track"><span style={{ width: `${Math.max(8, (d.votes / Math.max(...destinations.map(x => x.votes))) * 100)}%`, background: d.id === winner.id ? "#ff715b" : "#b9c6bb" }} /></div></div>)}</div><div className="vote-note"><span>✦</span> <strong>{winner.city}</strong> is leading the way</div><button className="primary-btn" onClick={() => castVote(winner.id)}>{voted ? <><Check size={17} /> Vote submitted</> : <>Vote for {winner.city} <ArrowRight size={17} /></>}</button></div><div className="friends-card"><div className="friends-title"><h3>Your travel crew</h3><span>6 people</span></div><div className="friend-row"><div className="avatar avatar-a">M</div><div><strong>Maya <span className="you">you</span></strong><small>Has voted · Lisbon</small></div><Check className="check" size={17} /></div><div className="friend-row"><div className="avatar avatar-b">J</div><div><strong>Jonas</strong><small>Has voted · Copenhagen</small></div><Check className="check" size={17} /></div><div className="friend-row faded"><div className="avatar avatar-c">S</div><div><strong>Samira</strong><small>Still deciding…</small></div><Clock3 className="waiting" size={16} /></div><button className="nudge-btn" onClick={() => setToast("A little nudge was sent to the group")}>Nudge the group <ArrowRight size={15} /></button></div></aside>
        </div>}

        {activeTab === "The plan" && <section className="plan-view"><div className="section-heading"><div><p className="eyebrow small">The plan</p><h2>{winner.city}, here we come.</h2></div><span className="confirmed"><Check size={15} /> Current front-runner</span></div><p className="section-intro">A loose plan for a very good weekend. We can fill in the gaps together.</p><div className="plan-layout"><div className="itinerary-list">{itinerary.map((item) => { const Icon = item.icon; return <div className="itinerary-item" key={item.title}><div className="date-col"><strong>{item.day}</strong><span>{item.date}</span></div><div className="timeline-dot"><Icon size={17} /></div><div className="itinerary-copy"><div><span className="item-time">{item.time}</span><span className="item-tag">{item.tag}</span></div><h3>{item.title}</h3><p>{item.detail}</p></div></div> })}</div><div className="plan-summary"><div className="mini-map"><span>✦</span><div className="map-route" /></div><h3>{winner.city} at a glance</h3><p>3 days · 2 nights · 6 friends</p><div className="summary-stats"><span><Euro size={16} /><b>{winner.budget}</b><small>per person</small></span><span><Clock3 size={16} /><b>{winner.travel}</b><small>door to door</small></span></div><button className="primary-btn">Open shared plan <ArrowRight size={17} /></button></div></div></section>}
        {activeTab === "Packing list" && <section className="empty-view"><span className="empty-icon">✦</span><h2>Pack light, live large.</h2><p>The packing list is waiting for the destination vote. In the meantime, don’t forget sunglasses.</p><button className="primary-btn" onClick={() => setActiveTab("Destinations")}>Back to destinations <ArrowRight size={17} /></button></section>}
      </main>
      <footer><span>made for the group chat <span className="footer-heart">♥</span></span><span>Weekender <span className="footer-dot" /> Berlin, DE</span></footer>
      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
      {addOpen && <div className="modal-backdrop" onClick={() => setAddOpen(false)}><div className="modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setAddOpen(false)}><X size={18} /></button><p className="eyebrow small">Add to the shortlist</p><h2>Got another idea?</h2><p>Drop in a city and let the group weigh it up.</p><input autoFocus value={newPlace} onChange={(e) => setNewPlace(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addDestination()} placeholder="e.g. Amsterdam" /><button className="primary-btn" onClick={addDestination}>Add destination <Plus size={17} /></button></div></div>}
    </div>
  )
}

function DestinationCard({ destination, rank, onLike, onVote, voted }: { destination: Destination; rank: number; onLike: (id: string) => void; onVote: (id: string) => void; voted: boolean }) {
  return <article className={`destination-card ${destination.id === "lisbon" ? "featured" : ""}`}><div className={`destination-image ${destination.image}`}><span className="rank">0{rank}</span><button className={`heart-btn ${destination.liked ? "liked" : ""}`} onClick={() => onLike(destination.id)} aria-label={`Save ${destination.city}`}><Heart size={18} fill={destination.liked ? "currentColor" : "none"} /></button><span className="image-emoji">{destination.emoji}</span><div className="image-caption"><span>{destination.country}</span><strong>{destination.city}</strong></div></div><div className="card-body"><div className="card-title"><div><h3>{destination.city}</h3><p>{destination.tagline}</p></div>{destination.id === "lisbon" && <span className="best-badge">TOP PICK</span>}</div><div className="stat-row"><span><TrainFront size={15} /> {destination.travel}</span><span><Euro size={15} /> {destination.budget}<small> / person</small></span><span className="weather">☀ {destination.weather}</span></div><p className="reason">{destination.reason}</p><div className="card-footer"><span className="vote-total"><b>{destination.votes}</b> votes</span><button className={`vote-btn ${voted ? "voted" : ""}`} onClick={() => onVote(destination.id)}>{voted ? <Check size={15} /> : "Vote"}</button></div></div></article>
}

export default App
