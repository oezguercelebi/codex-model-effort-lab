import { useMemo, useState } from 'react'
import {
  ArrowLeft, CalendarDays, Check, ChevronDown, Clock3, Coffee, Compass,
  Heart, Landmark, MapPin, Menu, Mountain, Plane, Search, Share2, Sparkles,
  Sun, TrainFront, Trees, Users, Utensils, Wallet, X,
} from 'lucide-react'

type Destination = {
  id: string
  name: string
  country: string
  dates: string
  price: number
  travel: string
  travelMins: number
  mode: 'train' | 'plane'
  votes: number
  voters: string[]
  match: number
  palette: string
  landscape: 'lake' | 'city' | 'coast' | 'mountain'
  tags: string[]
  description: string
}

const destinations: Destination[] = [
  { id: 'como', name: 'Lake Como', country: 'Italy', dates: 'Sep 19–21', price: 410, travel: '1h 35m flight', travelMins: 95, mode: 'plane', votes: 5, voters: ['Maya', 'Leo', 'Nora', 'You', 'Sam'], match: 96, palette: 'como', landscape: 'lake', tags: ['Lakeside', 'Food', 'Relaxed'], description: 'Ferry-hop between painted villages, swim in clear water, and linger over long lunches.' },
  { id: 'bruges', name: 'Bruges', country: 'Belgium', dates: 'Sep 19–21', price: 295, travel: '2h 15m train', travelMins: 135, mode: 'train', votes: 4, voters: ['Maya', 'Leo', 'Nora', 'Sam'], match: 91, palette: 'bruges', landscape: 'city', tags: ['Culture', 'Walkable', 'Food'], description: 'Cobblestone lanes, canal-side cafés, and enough chocolate to make the journey worthwhile.' },
  { id: 'algarve', name: 'The Algarve', country: 'Portugal', dates: 'Sep 19–22', price: 455, travel: '2h 40m flight', travelMins: 160, mode: 'plane', votes: 3, voters: ['Leo', 'Nora', 'You'], match: 88, palette: 'algarve', landscape: 'coast', tags: ['Beach', 'Sunny', 'Adventure'], description: 'Golden cliffs, hidden coves, and a late-summer forecast made for sea swims.' },
  { id: 'chamonix', name: 'Chamonix', country: 'France', dates: 'Sep 19–21', price: 365, travel: '3h 10m train', travelMins: 190, mode: 'train', votes: 2, voters: ['Maya', 'Sam'], match: 83, palette: 'chamonix', landscape: 'mountain', tags: ['Hiking', 'Nature', 'Views'], description: 'Crisp alpine air, dramatic trails, and fondue beneath the shadow of Mont Blanc.' },
]

const itinerary = [
  { day: 'Friday', date: 'Sep 19', title: 'Arrive & settle in', events: [
    { time: '18:30', title: 'Check in at Casa Lario', note: 'Bellagio · Lakeside apartments', icon: Landmark },
    { time: '20:00', title: 'Welcome dinner', note: 'La Punta · Table booked for 6', icon: Utensils },
  ]},
  { day: 'Saturday', date: 'Sep 20', title: 'The best of the lake', events: [
    { time: '09:15', title: 'Ferry to Varenna', note: 'Meet at Bellagio terminal', icon: Compass },
    { time: '10:00', title: 'Villa Monastero gardens', note: 'Tickets included in budget', icon: Trees },
    { time: '13:00', title: 'Lunch at Bar Il Molo', note: 'Casual · Terrace seating', icon: Utensils },
    { time: '16:30', title: 'Swim at San Giovanni', note: 'Bring a towel and water shoes', icon: Sun },
  ]},
  { day: 'Sunday', date: 'Sep 21', title: 'Slow morning & home', events: [
    { time: '09:30', title: 'Coffee by the water', note: 'BStyle Bellagio', icon: Coffee },
    { time: '11:00', title: 'Market stroll', note: 'Pick up picnic supplies', icon: MapPin },
    { time: '15:20', title: 'Depart for the airport', note: 'Shared transfer · 1h 10m', icon: Plane },
  ]},
]

function Scene({ type }: { type: Destination['landscape'] }) {
  return <div className={`scene scene-${type}`} aria-hidden="true"><div className="sun-or-moon"/><div className="far-shape"/><div className="near-shape"/><div className="water-lines"/></div>
}

function Avatar({ name, small = false }: { name: string; small?: boolean }) {
  const colors: Record<string,string> = { Maya: '#ec8c6b', Leo: '#5575a8', Nora: '#d89c44', You: '#166b5b', Sam: '#746390' }
  return <span className={`avatar ${small ? 'avatar-small' : ''}`} style={{ background: colors[name] || '#667' }} title={name}>{name === 'You' ? 'YO' : name.slice(0,1)}</span>
}

export default function App() {
  const [tab, setTab] = useState<'explore'|'plan'>('explore')
  const [voted, setVoted] = useState(() => new Set(['como', 'algarve']))
  const [sort, setSort] = useState<'match'|'budget'|'travel'>('match')
  const [maxBudget, setMaxBudget] = useState(500)
  const [search, setSearch] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const shown = useMemo(() => destinations.filter(d => d.price <= maxBudget && `${d.name} ${d.country} ${d.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase())).sort((a,b) => sort === 'budget' ? a.price-b.price : sort === 'travel' ? a.travelMins-b.travelMins : b.match-a.match), [maxBudget, search, sort])
  const toggleVote = (id: string) => setVoted(current => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next })

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#" aria-label="Weekender home"><span className="brand-mark"><Mountain size={18}/><Sun size={9}/></span>weekender</a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <button className={tab === 'explore' ? 'active' : ''} onClick={() => setTab('explore')}>Destinations</button>
        <button className={tab === 'plan' ? 'active' : ''} onClick={() => setTab('plan')}>Itinerary</button>
      </nav>
      <div className="header-actions">
        <button className="share-button"><Share2 size={16}/> Share trip</button>
        <div className="avatar-stack"><Avatar name="Maya"/><Avatar name="Leo"/><Avatar name="Nora"/><span className="avatar more">+3</span></div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">{menuOpen ? <X/> : <Menu/>}</button>
      </div>
      {menuOpen && <div className="mobile-menu"><button onClick={() => {setTab('explore');setMenuOpen(false)}}>Destinations</button><button onClick={() => {setTab('plan');setMenuOpen(false)}}>Itinerary</button><button><Share2 size={16}/> Share trip</button></div>}
    </header>

    {tab === 'explore' ? <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot"/> Voting closes in 2 days</div>
          <h1>Where should we<br/><em>weekend?</em></h1>
          <p>Six friends, one perfect escape. Compare the shortlist and cast your votes.</p>
          <div className="trip-meta"><span><CalendarDays/> Sep 19–21</span><span><Users/> 6 travelers</span><span><MapPin/> From Berlin</span></div>
        </div>
        <div className="vote-summary">
          <div className="summary-top"><div><small>YOUR GROUP</small><strong>Autumn Escape</strong></div><Sparkles size={20}/></div>
          <div className="friends-row"><div className="avatar-stack large"><Avatar name="Maya"/><Avatar name="Leo"/><Avatar name="Nora"/><Avatar name="You"/><Avatar name="Sam"/><span className="avatar more">+1</span></div><span>5 of 6 voted</span></div>
          <div className="progress"><i/></div>
          <div className="leading"><span><span className="trophy">★</span><span><small>CURRENTLY LEADING</small><b>Lake Como</b></span></span><strong>6 votes</strong></div>
        </div>
      </section>

      <section className="content-wrap">
        <div className="section-heading"><div><h2>The shortlist</h2><p>Vote for as many as you like — the group favorite wins.</p></div><span className="count">{shown.length} destinations</span></div>
        <div className="toolbar">
          <label className="search"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search destinations"/></label>
          <button className={`filter-button ${filtersOpen ? 'selected' : ''}`} onClick={() => setFiltersOpen(!filtersOpen)}><Wallet size={17}/> Budget <ChevronDown size={15}/></button>
          <label className="sort-label">Sort by <select value={sort} onChange={e => setSort(e.target.value as typeof sort)}><option value="match">Best match</option><option value="budget">Lowest price</option><option value="travel">Shortest journey</option></select></label>
          {filtersOpen && <div className="budget-popover"><div><b>Max budget</b><strong>€{maxBudget}</strong></div><input type="range" min="300" max="500" step="25" value={maxBudget} onChange={e => setMaxBudget(Number(e.target.value))}/><div className="range-label"><span>€300</span><span>€500+</span></div></div>}
        </div>

        <div className="destination-grid">
          {shown.map((d, idx) => { const hasVote = voted.has(d.id); const Mode = d.mode === 'train' ? TrainFront : Plane; return <article className="destination-card" key={d.id}>
            <div className={`card-visual palette-${d.palette}`}><Scene type={d.landscape}/><span className="match"><Sparkles size={12}/>{d.match}% match</span>{idx === 0 && <span className="leader-badge">★ Group favorite</span>}</div>
            <div className="card-body">
              <div className="title-row"><div><h3>{d.name}</h3><p><MapPin size={13}/>{d.country}</p></div><div className="price"><strong>€{d.price}</strong><small>per person</small></div></div>
              <p className="description">{d.description}</p>
              <div className="tags">{d.tags.map(t => <span key={t}>{t}</span>)}</div>
              <div className="facts"><span><Mode size={17}/><span><small>TRAVEL</small><b>{d.travel}</b></span></span><span><CalendarDays size={17}/><span><small>DATES</small><b>{d.dates}</b></span></span></div>
              <div className="vote-row"><div className="mini-voters">{d.voters.slice(0,4).map(n => <Avatar key={n} name={n} small/>)}<span>{d.votes + (hasVote && !d.voters.includes('You') ? 1 : hasVote || !d.voters.includes('You') ? 0 : -1)} votes</span></div><button className={hasVote ? 'voted' : ''} onClick={() => toggleVote(d.id)}>{hasVote ? <><Check size={17}/> Voted</> : <><Heart size={17}/> Vote</>}</button></div>
            </div>
          </article>})}
        </div>
        {shown.length === 0 && <div className="empty"><Compass size={34}/><h3>No destinations match</h3><p>Try increasing your budget or changing your search.</p><button onClick={() => {setSearch('');setMaxBudget(500)}}>Reset filters</button></div>}
      </section>
    </main> : <main className="plan-page">
      <button className="back-link" onClick={() => setTab('explore')}><ArrowLeft size={17}/> Back to destinations</button>
      <section className="plan-hero"><div className="plan-scene"><Scene type="lake"/></div><div className="plan-copy"><div className="winner-pill"><Sparkles size={13}/> The group’s pick</div><h1>Lake Como</h1><p>Bellagio, Italy · September 19–21</p><div className="plan-stats"><span><Plane/><small>FLIGHT</small><b>1h 35m</b></span><span><Wallet/><small>BUDGET</small><b>€410 pp</b></span><span><Sun/><small>FORECAST</small><b>24°C</b></span></div></div></section>
      <section className="itinerary-wrap"><div className="itinerary-head"><div><span className="eyebrow plain">YOUR WEEKEND, PLANNED</span><h2>Three days in Como</h2><p>A relaxed plan with enough room to wander.</p></div><button className="share-button"><Share2 size={16}/> Share itinerary</button></div>
        <div className="days">{itinerary.map((day, i) => <article className="day" key={day.day}><div className="day-label"><span>DAY {i+1}</span><h3>{day.day}</h3><p>{day.date}</p></div><div className="day-content"><h3>{day.title}</h3>{day.events.map(e => { const Icon=e.icon; return <div className="event" key={e.time}><time>{e.time}</time><span className="event-icon"><Icon size={17}/></span><div><b>{e.title}</b><p>{e.note}</p></div></div>})}</div></article>)}</div>
        <aside className="budget-card"><div><span className="budget-icon"><Wallet/></span><span><small>ESTIMATED TOTAL</small><h3>€410 <em>per person</em></h3></span></div><div className="budget-items"><span>Flights <b>€148</b></span><span>Stay <b>€172</b></span><span>Food <b>€65</b></span><span>Activities <b>€25</b></span></div></aside>
      </section>
    </main>}
    <footer><a className="brand" href="#"><span className="brand-mark"><Mountain size={16}/></span>weekender</a><p>Good friends. Great weekends.</p><span>Trip updated just now</span></footer>
  </div>
}
