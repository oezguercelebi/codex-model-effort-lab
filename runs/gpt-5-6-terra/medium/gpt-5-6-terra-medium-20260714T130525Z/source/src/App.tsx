import { useMemo, useState } from "react"
import {
  ArrowRight, BedDouble, CalendarDays, Car, Check, ChevronDown, Clock3,
  Coffee, Compass, Heart, Hotel, MapPin, MoreHorizontal, Plane, Plus,
  Sparkles, Sun, Ticket, Train, Users, Utensils, Wallet,
} from "lucide-react"

type Trip = {
  city: string
  country: string
  emoji: string
  className: string
  travel: string
  travelType: "train" | "car" | "plane"
  budget: number
  votes: number
  caption: string
  tags: string[]
}

const trips: Trip[] = [
  { city: "Copenhagen", country: "Denmark", emoji: "🇩🇰", className: "copenhagen", travel: "5h 10m", travelType: "train", budget: 465, votes: 8, caption: "Canals, bakeries & long summer nights.", tags: ["Design", "Food", "Waterfront"] },
  { city: "Porto", country: "Portugal", emoji: "🇵🇹", className: "porto", travel: "3h 05m", travelType: "plane", budget: 412, votes: 6, caption: "Golden light, tiled streets & vinho verde.", tags: ["Sun", "Wine", "Walkable"] },
  { city: "Annecy", country: "France", emoji: "🇫🇷", className: "annecy", travel: "7h 25m", travelType: "car", budget: 388, votes: 4, caption: "Alpine swims and market-morning magic.", tags: ["Lake", "Nature", "Slow days"] },
]

const members = [
  { initials: "LB", color: "#F3A978", name: "Léa" }, { initials: "SK", color: "#8494D8", name: "Sam" },
  { initials: "MJ", color: "#E7C968", name: "Maya" }, { initials: "RT", color: "#92B9A1", name: "Ravi" },
  { initials: "OS", color: "#CF91B2", name: "Omar" },
]

function TravelIcon({ type, size = 15 }: { type: Trip["travelType"], size?: number }) {
  return type === "train" ? <Train size={size} /> : type === "car" ? <Car size={size} /> : <Plane size={size} />
}

export default function App() {
  const [selected, setSelected] = useState(0)
  const [voted, setVoted] = useState<number[]>([0])
  const [tab, setTab] = useState<"overview" | "itinerary">("overview")
  const [toast, setToast] = useState("")
  const trip = trips[selected]
  const totalVotes = useMemo(() => trips.reduce((sum, item, index) => sum + item.votes + (voted.includes(index) ? 1 : 0), 0), [voted])
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2500) }
  const toggleVote = (index: number) => {
    setVoted(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index])
    notify(voted.includes(index) ? "Vote removed" : "Your vote has been added")
  }

  return (
    <div className="app-shell">
      <nav className="topbar">
        <a className="brand" href="#top" aria-label="Weekender home"><span className="brand-mark"><Compass size={20} /></span>weekender</a>
        <div className="nav-center"><button className="nav-link active">My trips</button><button className="nav-link">Explore</button></div>
        <div className="nav-actions"><button className="new-trip" onClick={() => notify("A fresh trip board is ready to create!")}><Plus size={16} /> New trip</button><button className="avatar avatar-main">OC</button></div>
      </nav>

      <main id="top" className="content">
        <section className="trip-header">
          <div className="eyebrow"><span className="status-dot" /> Planning in progress <span className="divider">•</span> 5 friends</div>
          <div className="title-row"><div><h1>Summer’s last hurrah</h1><p><CalendarDays size={16} /> Fri, Aug 16 — Sun, Aug 18 <span>·</span> Leaving from Berlin</p></div><button className="more-button" onClick={() => notify("Trip settings are coming soon")} aria-label="Trip options"><MoreHorizontal size={20} /></button></div>
          <div className="tab-row"><button className={tab === "overview" ? "tab active" : "tab"} onClick={() => setTab("overview")}>Overview</button><button className={tab === "itinerary" ? "tab active" : "tab"} onClick={() => setTab("itinerary")}>Itinerary <span className="tiny-badge">3</span></button><button className="tab">Chat <span className="tiny-badge">2</span></button></div>
        </section>

        {tab === "overview" ? <>
          <section className="section-heading"><div><p className="section-kicker">Step 1 of 2</p><h2>Pick our place</h2><p className="section-subtitle">Vote for the city you’d love to spend the weekend in.</p></div><div className="vote-summary"><div className="mini-avatars">{members.slice(0, 4).map(m => <span key={m.initials} className="avatar mini" style={{ background: m.color }}>{m.initials}</span>)}</div><span>{totalVotes} votes in</span></div></section>
          <section className="trip-cards">
            {trips.map((item, index) => { const count = item.votes + (voted.includes(index) ? 1 : 0); const isSelected = selected === index; return <article key={item.city} className={"trip-card " + (isSelected ? "selected" : "")} onClick={() => setSelected(index)}>
              <div className={"destination-image " + item.className}><div className="image-sun" /><div className="image-scene"><span className="scene-building b1" /><span className="scene-building b2" /><span className="scene-building b3" /></div><span className="country-flag">{item.emoji}</span><button className={voted.includes(index) ? "heart voted" : "heart"} onClick={(event) => { event.stopPropagation(); toggleVote(index) }} aria-label={`Vote for ${item.city}`}><Heart size={17} fill={voted.includes(index) ? "currentColor" : "none"} /></button></div>
              <div className="card-copy"><div className="city-line"><h3>{item.city}</h3>{isSelected && <span className="leading-pill"><Sparkles size={13} /> Leading</span>}</div><p>{item.country}</p><div className="fact-row"><span><TravelIcon type={item.travelType} /> {item.travel}</span><span><Wallet size={14} /> €{item.budget} pp</span></div><div className="vote-row"><div className="vote-track"><span style={{ width: `${(count / 9) * 100}%` }} /></div><span>{count} {count === 1 ? "vote" : "votes"}</span></div></div>
            </article> })}
          </section>
          <button className="add-place" onClick={() => notify("Destination suggestions are open for the group")}> <Plus size={17} /> Suggest another place</button>

          <section className="details-grid">
            <article className="plan-panel">
              <div className="panel-heading"><div><p className="section-kicker">Current favorite</p><h2>{trip.city}, here we come</h2></div><button className="change-link" onClick={() => setSelected((selected + 1) % trips.length)}>Compare <ArrowRight size={15} /></button></div>
              <p className="favorite-copy">{trip.caption}</p>
              <div className="tag-list">{trip.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
              <div className="estimate-grid"><div><span className="estimate-icon peach"><Train size={19} /></span><p>Getting there</p><strong>{trip.travel}</strong><small>from Berlin Hbf</small></div><div><span className="estimate-icon lilac"><BedDouble size={19} /></span><p>Stay</p><strong>2 nights</strong><small>central apartment</small></div><div><span className="estimate-icon yellow"><Wallet size={19} /></span><p>Est. budget</p><strong>€{trip.budget} pp</strong><small>all in, shared room</small></div></div>
              <button className="primary-action" onClick={() => { setTab("itinerary"); notify("Itinerary opened for the current favorite") }}>See the weekend plan <ArrowRight size={17} /></button>
            </article>
            <aside className="budget-panel"><div className="budget-top"><div><p className="section-kicker">Per person</p><h2>Budget snapshot</h2></div><button className="round-icon" onClick={() => notify("Budget is based on current sample prices")}><ChevronDown size={18} /></button></div><div className="budget-total"><span>Estimated total</span><strong>€{trip.budget}</strong><em>comfortable</em></div><div className="budget-bars"><div><span>Travel</span><div><i style={{ width: "82%", background: "#EA956D" }} /></div><b>€146</b></div><div><span>Stay</span><div><i style={{ width: "68%", background: "#8B8DD4" }} /></div><b>€178</b></div><div><span>Food + fun</span><div><i style={{ width: "48%", background: "#D9B647" }} /></div><b>€141</b></div></div><p className="budget-note"><Check size={14} /> Split between 5 people</p></aside>
          </section>
        </> : <Itinerary trip={trip} notify={notify} />}
      </main>
      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
    </div>
  )
}

function Itinerary({ trip, notify }: { trip: Trip, notify: (message: string) => void }) {
  const days = [
    { day: "Friday", date: "Aug 16", icon: <Train size={17} />, time: "17:40", title: "Arrive & check in", text: "Drop bags at the apartment and settle in.", tone: "peach" },
    { day: "Saturday", date: "Aug 17", icon: <Coffee size={17} />, time: "10:00", title: "Slow breakfast crawl", text: "Coffee, cardamom buns, nowhere to be.", tone: "yellow" },
    { day: "Sunday", date: "Aug 18", icon: <Sun size={17} />, time: "11:30", title: "Harbour-side picnic", text: "Pick up supplies before the journey home.", tone: "blue" },
  ]
  return <section className="itinerary-wrap"><div className="section-heading itinerary-title"><div><p className="section-kicker">Our draft plan</p><h2>A long weekend in {trip.city}</h2><p className="section-subtitle">Loose enough for spontaneous detours.</p></div><button className="new-trip" onClick={() => notify("An activity slot was added")}><Plus size={16} /> Add activity</button></div><div className="itinerary-grid"><div className="day-list">{days.map((item, i) => <article className="day-card" key={item.day}><div className="day-label"><span>{item.day}</span><small>{item.date}</small></div><div className="timeline"><i /><i /></div><div className="activity"><span className={"activity-icon " + item.tone}>{item.icon}</span><div><p>{item.time}</p><h3>{item.title}</h3><span>{item.text}</span></div><button className="activity-more" onClick={() => notify("Activity details opened")}><MoreHorizontal size={18} /></button></div>{i === 1 && <div className="mini-activity"><Utensils size={15} /> 20:00 <strong>Garden dinner</strong><span> · Saved by Maya</span></div>}</article>)}</div><aside className="ready-card"><span className="ready-icon"><Ticket size={20} /></span><h3>Ready to book?</h3><p>Once everyone’s happy, lock in {trip.city} and start sharing links.</p><div className="member-stack">{members.map(m => <span key={m.initials} className="avatar mini" style={{ background: m.color }} title={m.name}>{m.initials}</span>)}<span className="confirmed">3 of 5 in</span></div><button onClick={() => notify("Booking checklist created for the group")}>Start booking <ArrowRight size={16} /></button></aside></div></section>
}
