import { useMemo, useState } from "react"
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Coffee,
  Compass,
  Download,
  Heart,
  MapPin,
  Menu,
  MoreHorizontal,
  Plus,
  Sparkles,
  Star,
  TrainFront,
  Umbrella,
  UsersRound,
  X,
} from "lucide-react"

type Destination = {
  name: string
  country: string
  emoji: string
  gradient: string
  blurb: string
  travel: string
  travelNote: string
  total: number
  stay: number
  food: number
  votes: number
  tags: string[]
}

const destinations: Destination[] = [
  { name: "Lisbon", country: "Portugal", emoji: "☀️", gradient: "lisbon", blurb: "Pastel sunsets, tiled lanes and long dinners by the river.", travel: "2h 45m", travelNote: "Direct flight", total: 485, stay: 190, food: 145, votes: 4, tags: ["Sun", "Food", "City"] },
  { name: "Copenhagen", country: "Denmark", emoji: "🚲", gradient: "copenhagen", blurb: "Design museums, harbour swims and natural wine bars.", travel: "1h 25m", travelNote: "Direct flight", total: 590, stay: 255, food: 175, votes: 3, tags: ["Design", "Food", "Walkable"] },
  { name: "Lake Como", country: "Italy", emoji: "⛵", gradient: "como", blurb: "Slow mornings, villa gardens and an aperitivo by the lake.", travel: "2h 10m", travelNote: "Flight + 40m train", total: 625, stay: 290, food: 165, votes: 2, tags: ["Nature", "Relaxed", "Scenic"] },
]

const teammates = [
  { initials: "MB", name: "Maya", color: "#e99073" },
  { initials: "JS", name: "Jonas", color: "#8b80cd" },
  { initials: "AL", name: "Alex", color: "#e8bc62" },
  { initials: "ER", name: "Emma", color: "#62a79b" },
  { initials: "You", name: "You", color: "#303432" },
]

const itinerary = [
  { day: "Fri", date: "12", color: "coral", items: [{ time: "18:10", title: "Touch down in Lisbon", detail: "Humberto Delgado Airport", icon: TrainFront }, { time: "20:00", title: "Dinner at Taberna Sal Grosso", detail: "Alfama · Booked for 5", icon: Coffee }] },
  { day: "Sat", date: "13", color: "sun", items: [{ time: "10:00", title: "Pastéis & tile walk", detail: "Baixa to Alfama", icon: Compass }, { time: "15:30", title: "Sunny afternoon at Praia da Rainha", detail: "Cascais · 35 min by train", icon: Umbrella }] },
  { day: "Sun", date: "14", color: "lavender", items: [{ time: "11:00", title: "LX Factory + brunch", detail: "LxFactory, Alcântara", icon: Sparkles }, { time: "17:40", title: "Fly home", detail: "LIS → BER", icon: TrainFront }] },
]

export default function App() {
  const [selected, setSelected] = useState(0)
  const [voted, setVoted] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [added, setAdded] = useState(false)
  const winner = destinations[selected]
  const voteCount = useMemo(() => destinations.map((destination, index) => destination.votes + (voted === index ? 1 : 0)), [voted])

  function castVote(index: number) {
    setVoted((current) => current === index ? null : index)
  }

  return (
    <div className="app-shell">
      <aside className={mobileMenu ? "sidebar is-open" : "sidebar"}>
        <div className="brand-row"><div className="brand-mark"><Compass size={21} strokeWidth={2.4} /></div><span>weekender</span><button className="close-menu" onClick={() => setMobileMenu(false)} aria-label="Close menu"><X size={19} /></button></div>
        <div className="trip-switcher"><div className="trip-dot">☀</div><div><small>CURRENT TRIP</small><strong>Late summer escape</strong></div><ChevronDown size={17} /></div>
        <nav className="nav-links">
          <a className="active" href="#overview"><Compass size={19} />Overview</a>
          <a href="#destinations"><MapPin size={19} />Destinations <span>3</span></a>
          <a href="#budget"><BedDouble size={19} />Budget</a>
          <a href="#itinerary"><CalendarDays size={19} />Itinerary</a>
          <a href="#group"><UsersRound size={19} />Group <span>5</span></a>
        </nav>
        <div className="sidebar-bottom"><div className="mini-group"><div className="stacked-avatars">{teammates.slice(0, 4).map((person) => <i key={person.name} style={{ background: person.color }}>{person.initials}</i>)}</div><p><strong>5 friends</strong><br />planning together</p></div><button className="invite"><Plus size={17} />Invite friends</button></div>
      </aside>

      <main>
        <header className="topbar">
          <button className="menu-button" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu size={22} /></button>
          <div className="crumb"><span>Trips</span><ArrowRight size={14} /><strong>Late summer escape</strong></div>
          <div className="top-actions"><button className="share-button"><Download size={16} />Share plan</button><button className="avatar" style={{ background: teammates[4].color }}>You</button></div>
        </header>

        <section className="intro" id="overview">
          <div><p className="eyebrow">AUG 12–14 · 3 NIGHTS · 5 FRIENDS</p><h1>Where should we go?</h1><p className="intro-copy">A little time away with the people who make everything more fun.</p></div>
          <div className="decision-card"><div className="decision-icon"><Sparkles size={18} /></div><div><small>DECISION DEADLINE</small><strong>Vote by Wednesday</strong><span>2 days left to decide</span></div></div>
        </section>

        <section className="destination-section" id="destinations">
          <div className="section-heading"><div><p className="eyebrow">THE SHORTLIST</p><h2>Three excellent excuses to leave town</h2></div><button className="text-button" onClick={() => setShowAll(!showAll)}>{showAll ? "Show less" : "Compare all details"} <ArrowRight size={16} /></button></div>
          <div className={showAll ? "destination-grid expanded" : "destination-grid"}>
            {destinations.map((destination, index) => {
              const active = selected === index
              const wasVoted = voted === index
              return <article className={active ? "destination-card selected" : "destination-card"} key={destination.name}>
                <div className={`destination-image ${destination.gradient}`}><span className="place-emoji">{destination.emoji}</span>{active && <span className="front-runner"><Star size={13} fill="currentColor" />Front runner</span>}<button className={wasVoted ? "heart-button voted" : "heart-button"} onClick={() => castVote(index)} aria-label={`Vote for ${destination.name}`}><Heart size={18} fill={wasVoted ? "currentColor" : "none"} /></button></div>
                <div className="destination-content"><div className="place-title"><div><h3>{destination.name}</h3><p>{destination.country}</p></div><span className="vote-total">{voteCount[index]} <Heart size={13} fill="currentColor" /></span></div><p className="blurb">{destination.blurb}</p><div className="facts"><span><Clock3 size={15} />{destination.travel}<small>{destination.travelNote}</small></span><span><strong>€{destination.total}</strong><small>per person</small></span></div>{showAll && <div className="detail-row"><span>Stay <b>€{destination.stay}</b></span><span>Food & fun <b>€{destination.food}</b></span></div>}<div className="card-actions"><button className={wasVoted ? "vote-button is-voted" : "vote-button"} onClick={() => castVote(index)}>{wasVoted ? <><Check size={16} />Your pick</> : <><Heart size={16} />Vote for this</>}</button><button className="choose-button" onClick={() => setSelected(index)}>{active ? "Selected" : "View plan"}</button></div></div>
              </article>
            })}
          </div>
          <button className={added ? "add-place added" : "add-place"} onClick={() => setAdded(true)}>{added ? <><Check size={17} />Suggestion sent to the group</> : <><Plus size={17} />Suggest another place</>}</button>
        </section>

        <section className="planning-grid">
          <article className="budget-card" id="budget"><div className="section-heading compact"><div><p className="eyebrow">THE MATH</p><h2>A comfortable €{winner.total} each</h2></div><button className="icon-button"><MoreHorizontal size={20} /></button></div><p>Based on the current plan for {winner.name}, including all the good stuff.</p><div className="budget-bar"><i style={{ width: `${Math.round((winner.stay / winner.total) * 100)}%` }} /><i style={{ width: `${Math.round((winner.food / winner.total) * 100)}%` }} /><i /></div><div className="budget-legend"><span><i className="stay-dot" />Stay <b>€{winner.stay}</b></span><span><i className="food-dot" />Food & fun <b>€{winner.food}</b></span><span><i className="travel-dot" />Travel <b>€{winner.total - winner.stay - winner.food}</b></span></div><div className="budget-note"><span>✦</span><p><strong>Nice work.</strong> This is €65 under the group’s ideal budget.</p></div></article>
          <article className="group-card" id="group"><div className="section-heading compact"><div><p className="eyebrow">YOUR CREW</p><h2>Everyone’s in</h2></div><button className="text-button small">Manage</button></div><div className="people-list">{teammates.map((person, index) => <div className="person" key={person.name}><span className="person-avatar" style={{ background: person.color }}>{person.initials}</span><div><strong>{person.name}{person.name === "You" && " (you)"}</strong><small>{index === 4 ? "Voted for Lisbon" : index < 4 ? "Ready for a getaway" : ""}</small></div><span className={index === 4 ? "ready-dot voted" : "ready-dot"}></span></div>)}</div><button className="invite large"><Plus size={17} />Invite another friend</button></article>
        </section>

        <section className="itinerary-section" id="itinerary"><div className="section-heading"><div><p className="eyebrow">IF {winner.name.toUpperCase()} WINS</p><h2>A weekend with room to wander</h2></div><button className="text-button">Open itinerary <ArrowRight size={16} /></button></div><div className="itinerary-card"><div className="itinerary-top"><div><span className="plan-location"><MapPin size={15} />{winner.name}, {winner.country}</span><h3>Late summer escape</h3></div><button className="calendar-button"><CalendarDays size={17} />Aug 12–14</button></div><div className="days">{itinerary.map((day) => <div className="day-column" key={day.day}><div className="day-label"><span>{day.day}</span><b>{day.date}</b></div>{day.items.map((item) => { const Icon = item.icon; return <div className="activity" key={item.title}><div className={`activity-icon ${day.color}`}><Icon size={16} /></div><div><time>{item.time}</time><strong>{item.title}</strong><small>{item.detail}</small></div></div> })}</div>)}</div></div>
        </section>
      </main>
    </div>
  )
}
