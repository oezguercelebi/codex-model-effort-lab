import { useMemo, useState } from 'react'
import {
  ArrowRight, BedDouble, CalendarDays, Car, Check, ChevronDown, CircleDollarSign,
  Clock3, Coffee, Compass, Heart, MapPin, Menu, Plane, Plus, Sparkles, Star,
  Train, Users, X,
} from 'lucide-react'
import './index.css'

type Destination = {
  id: string; name: string; country: string; tag: string; color: string; image: string
  score: number; votes: number; travel: string; travelDetail: string; budget: number
  mood: string; highlights: string[]
}

const destinations: Destination[] = [
  { id: 'porto', name: 'Porto', country: 'Portugal', tag: 'Front runner', color: 'orange', image: 'porto', score: 4.8, votes: 6, travel: '2h 25m', travelDetail: 'Direct flight', budget: 486, mood: 'Sun-drenched streets & slow lunches', highlights: ['Ribeira at golden hour', 'Douro wine tasting', 'Atlantic day trip'] },
  { id: 'ljubljana', name: 'Ljubljana', country: 'Slovenia', tag: 'Best value', color: 'green', image: 'ljubljana', score: 4.7, votes: 4, travel: '1h 40m', travelDetail: 'Direct flight', budget: 398, mood: 'Riverside cafés & Alpine air', highlights: ['Car-free old town', 'Lake Bled escape', 'Market brunch'] },
  { id: 'copenhagen', name: 'Copenhagen', country: 'Denmark', tag: 'Design pick', color: 'blue', image: 'copenhagen', score: 4.6, votes: 2, travel: '1h 15m', travelDetail: 'Direct flight', budget: 624, mood: 'Big bikes, bright bakeries, good design', highlights: ['Harbour swim', 'Nørrebro food crawl', 'Louisiana museum'] },
]

const itinerary = [
  { time: '10:30', title: 'Touch down & drop bags', note: 'Casa do Conto · Check-in from 10:30', icon: BedDouble },
  { time: '12:00', title: 'Long lunch in Cedofeita', note: 'O Gaveto · Table for 8', icon: Coffee },
  { time: '15:30', title: 'Wander down to Ribeira', note: 'Self-guided · Meet at Praça da Liberdade', icon: Compass },
  { time: '18:30', title: 'Sunset sail on the Douro', note: 'Douro Azul · 90 min cruise', icon: Sparkles },
]

function DestinationArt({ kind }: { kind: string }) {
  return <div className={`destination-art ${kind}`} aria-hidden="true"><div className="sun" /><div className="cloud cloud-one" /><div className="cloud cloud-two" /><div className="hill hill-one" /><div className="hill hill-two" /><div className="city"><i /><i /><i /><i /><i /><i /></div><div className="water" /></div>
}

export default function App() {
  const [active, setActive] = useState('porto')
  const [voted, setVoted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [tab, setTab] = useState<'overview' | 'itinerary'>('overview')
  const [added, setAdded] = useState(false)
  const selected = destinations.find(d => d.id === active) ?? destinations[0]
  const totalVotes = useMemo(() => destinations.reduce((sum, d) => sum + d.votes, 0) + (voted ? 1 : 0), [voted])
  const estimated = selected.budget + 42

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#top"><span className="brand-mark"><Compass size={19} /></span><span>weekender</span></a>
      <nav className="desktop-nav"><a className="active" href="#compare">Plan</a><a href="#itinerary">Itinerary</a><a href="#group">Group</a></nav>
      <div className="header-actions"><button className="group-pill"><span className="avatar-stack"><b>J</b><b>M</b><b>S</b></span><span>8 friends</span><ChevronDown size={15} /></button><button className="icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></div>
      {menuOpen && <nav className="mobile-menu"><a href="#compare" onClick={() => setMenuOpen(false)}>Plan</a><a href="#itinerary" onClick={() => setMenuOpen(false)}>Itinerary</a><a href="#group" onClick={() => setMenuOpen(false)}>Group</a></nav>}
    </header>

    <main id="top">
      <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="live-dot" />Weekend away · 8–10 May</div><h1>Where are we<br /><em>heading?</em></h1><p>Three great ideas, one memorable weekend. Compare the details and make your vote count.</p><div className="hero-people"><div className="faces"><span>J</span><span>A</span><span>M</span><span>S</span><span>R</span></div><span><strong>8 friends</strong> are planning this trip</span></div></div><div className="hero-card"><div className="mini-map"><span className="route r1" /><span className="route r2" /><span className="pin pin-a">●</span><span className="pin pin-b">●</span><span className="pin pin-c">●</span><span className="map-label label-a">BERLIN</span><span className="map-label label-b">PORTO</span></div><div className="map-caption"><span><Plane size={16} /> Berlin → Porto</span><strong>2h 25m</strong></div></div></section>

      <section className="planning-wrap" id="compare">
        <div className="section-heading"><div><span className="section-kicker">The shortlist</span><h2>Pick the feeling.</h2></div><p>We found a few places with just the right mix of easy and unforgettable.</p></div>
        <div className="destination-grid">
          {destinations.map((d) => <article className={`destination-card ${active === d.id ? 'selected' : ''}`} key={d.id} onClick={() => setActive(d.id)}>
            <div className="card-art"><DestinationArt kind={d.image} /><span className={`tag ${d.color}`}>{d.tag}</span><button className="heart" onClick={(e) => { e.stopPropagation(); setActive(d.id) }} aria-label={`Save ${d.name}`}><Heart size={18} fill={active === d.id ? 'currentColor' : 'none'} /></button></div>
            <div className="card-content"><div className="place-line"><div><h3>{d.name}</h3><span>{d.country}</span></div><div className="rating"><Star size={14} fill="currentColor" /> {d.score}</div></div><p>{d.mood}</p><div className="card-stats"><span><Plane size={15} />{d.travel}</span><span><CircleDollarSign size={16} />€{d.budget} pp</span></div><button className="select-button" onClick={() => setActive(d.id)}>{active === d.id ? <><Check size={16} /> Selected</> : <>Explore <ArrowRight size={16} /></>}</button></div>
          </article>)}
        </div>
      </section>

      <section className="decision-panel">
        <div className="decision-head"><div><span className="section-kicker">The details</span><h2>{selected.name}, at a glance.</h2></div><div className="vote-status"><span>{totalVotes} votes so far</span><div className="vote-dots"><i /><i /><i /><i /><i /><i /><i /><i /></div></div></div>
        <div className="detail-layout"><div className="featured-place"><DestinationArt kind={selected.image} /><div className="featured-overlay"><span><MapPin size={15} /> {selected.country}</span><strong>{selected.name}</strong></div></div><div className="details"><div className="highlights"><h3>Why it works</h3>{selected.highlights.map((h, i) => <div key={h}><span className="highlight-num">0{i + 1}</span>{h}</div>)}</div><div className="travel-cards"><div><span className="small-icon"><Plane size={17} /></span><p>Getting there</p><strong>{selected.travel}</strong><small>{selected.travelDetail} from Berlin</small></div><div><span className="small-icon lime"><Users size={17} /></span><p>Group energy</p><strong>Just right</strong><small>Easy to explore together</small></div></div></div><aside className="budget-card"><div className="budget-title"><span className="small-icon coral"><CircleDollarSign size={17} /></span><div><p>Estimated spend</p><strong>€{estimated} <small>per person</small></strong></div></div><div className="budget-row"><span>Flights</span><b>€142</b></div><div className="meter"><i style={{ width: '35%' }} /></div><div className="budget-row"><span>Stay · 2 nights</span><b>€196</b></div><div className="meter"><i style={{ width: '52%' }} /></div><div className="budget-row"><span>Food & fun</span><b>€148</b></div><div className="meter"><i style={{ width: '42%' }} /></div><button className={`vote-button ${voted ? 'voted' : ''}`} onClick={() => setVoted(!voted)}>{voted ? <><Check size={17} /> Your vote is in</> : <><Heart size={17} /> Vote for {selected.name}</>}</button></aside></div>
      </section>

      <section className="itinerary-section" id="itinerary"><div className="itinerary-top"><div><span className="section-kicker">A little preview</span><h2>The weekend, <em>loosely planned.</em></h2></div><div className="tabs"><button className={tab === 'overview' ? 'on' : ''} onClick={() => setTab('overview')}>Overview</button><button className={tab === 'itinerary' ? 'on' : ''} onClick={() => setTab('itinerary')}>Full itinerary</button></div></div><div className="trip-days"><div className="day-nav"><span className="day-chip active"><b>Fri</b><small>8 May</small></span><span className="day-chip"><b>Sat</b><small>9 May</small></span><span className="day-chip"><b>Sun</b><small>10 May</small></span></div><div className="timeline">{itinerary.slice(0, tab === 'overview' ? 3 : 4).map(({ time, title, note, icon: Icon }) => <div className="timeline-item" key={time}><time>{time}</time><span className="timeline-icon"><Icon size={17} /></span><div><h3>{title}</h3><p>{note}</p></div></div>)}<button className="add-plan" onClick={() => setAdded(!added)}>{added ? <><Check size={17} /> Added to Friday</> : <><Plus size={17} /> Add something</>}</button></div></div><div className="stay-card"><span className="stay-label">Where we’re staying</span><div className="stay-visual"><div className="window" /><div className="plant" /></div><h3>Casa do Conto</h3><p>Artful guesthouse in Cedofeita</p><div><span><BedDouble size={15} /> 4 rooms</span><span><MapPin size={15} /> 12 min to centre</span></div></div></section>
    </main>
    <footer><div className="brand"><span className="brand-mark"><Compass size={17} /></span><span>weekender</span></div><span>Made for the good kind of indecision.</span><span>© 2026 Weekender</span></footer>
  </div>
}
