import { useMemo, useState } from 'react'
import {
  ArrowRight, Bell, CalendarDays, Check, ChevronDown, Clock3, Compass, Euro,
  Heart, Home, MapPin, MoreHorizontal, Plane, Plus, Search, Settings, Sparkles,
  Star, Ticket, Users, Utensils, WalletCards, X, Zap,
} from 'lucide-react'

type Destination = { name: string; country: string; emoji: string; color: string; votes: number; budget: number; travel: string; rating: string; tags: string[]; blurb: string }

const initialDestinations: Destination[] = [
  { name: 'Lisbon', country: 'Portugal', emoji: '🌊', color: 'lisbon', votes: 3, budget: 460, travel: '3h 15m', rating: '4.9', tags: ['Foodie', 'Sunny'], blurb: 'Golden light, tiled streets, and the best seafood in the city.' },
  { name: 'Copenhagen', country: 'Denmark', emoji: '🚲', color: 'copenhagen', votes: 2, budget: 520, travel: '1h 45m', rating: '4.8', tags: ['Design', 'Cosy'], blurb: 'Slow mornings, thoughtful design, and impossibly good bakeries.' },
  { name: 'Lake Como', country: 'Italy', emoji: '⛰️', color: 'como', votes: 1, budget: 615, travel: '3h 40m', rating: '4.7', tags: ['Scenic', 'Chill'], blurb: 'A little lakeside magic, with mountain views at every turn.' },
]

const itinerary = [
  { time: '09:30', title: 'Coffee & pastel de nata', place: 'Fábrica Coffee Roasters', icon: Utensils, tone: 'peach' },
  { time: '11:00', title: 'Wander Alfama', place: 'Miradouro de Santa Luzia', icon: Compass, tone: 'blue' },
  { time: '13:30', title: 'Lunch by the river', place: 'Time Out Market', icon: Utensils, tone: 'yellow' },
  { time: '16:00', title: 'Tram 28 adventure', place: 'Baixa → Graça', icon: Ticket, tone: 'green' },
]

function App() {
  const [destinations, setDestinations] = useState(initialDestinations)
  const [voted, setVoted] = useState<string | null>(null)
  const [tab, setTab] = useState('Overview')
  const [budget, setBudget] = useState(650)
  const [showDetails, setShowDetails] = useState(false)
  const leader = useMemo(() => [...destinations].sort((a, b) => b.votes - a.votes)[0], [destinations])

  function vote(name: string) {
    setDestinations(ds => ds.map(d => d.name === name ? { ...d, votes: d.votes + (voted === name ? -1 : 1) } : d.name === voted ? { ...d, votes: d.votes - 1 } : d))
    setVoted(voted === name ? null : name)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Sparkles size={17} fill="currentColor" /></span><span>weekender</span></div>
        <div className="workspace"><div className="avatar">SD</div><div><strong>Sunny days</strong><small>Trip workspace</small></div><ChevronDown size={15} /></div>
        <nav>
          <p className="nav-label">Workspace</p>
          {[[Home, 'Overview'], [Compass, 'Explore'], [CalendarDays, 'Itinerary'], [WalletCards, 'Budget']].map(([Icon, label]) => <button key={label as string} className={tab === label ? 'nav-item active' : 'nav-item'} onClick={() => setTab(label as string)}><Icon size={18} />{label as string}</button>)}
          <p className="nav-label friends-label">Your group</p>
          <div className="member-stack"><span className="member m1">A</span><span className="member m2">J</span><span className="member m3">M</span><span className="member m4">+3</span><span className="member-add"><Plus size={14} /></span></div>
        </nav>
        <div className="sidebar-bottom"><button className="nav-item"><Settings size={18} />Settings</button><div className="help-card"><Zap size={17} /><span><strong>Make it a trip</strong><small>Invite your friends to vote</small></span><ArrowRight size={16} /></div></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="breadcrumb"><span>Sunny days</span><span>/</span><strong>Summer escape</strong></div><div className="top-actions"><button className="icon-button"><Search size={19} /></button><button className="icon-button notification"><Bell size={19} /><i /></button><button className="profile">AK</button></div></header>
        <div className="page-wrap">
          <section className="hero"><div><div className="eyebrow"><span className="live-dot" /> Planning together</div><h1>Where should we<br /><em>go next?</em></h1><p>Three nights. One unforgettable weekend.<br />Your group is deciding now.</p></div><div className="hero-art"><div className="sun" /><div className="cloud cloud-one" /><div className="cloud cloud-two" /><div className="wave">⌁</div><span>✦</span></div></section>

          <div className="content-heading"><div><h2>Pick a destination</h2><p>Vote for your favourite and see what the group thinks.</p></div><button className="outline-button"><Plus size={17} /> Add destination</button></div>
          <section className="destination-grid">{destinations.map(d => <article className="destination-card" key={d.name}>
            <div className={`destination-photo ${d.color}`}><span className="photo-emoji">{d.emoji}</span><button className="heart"><Heart size={17} fill={voted === d.name ? 'currentColor' : 'none'} /></button><div className="photo-label"><MapPin size={13} /> {d.country}</div></div>
            <div className="card-body"><div className="card-title"><div><h3>{d.name}</h3><span className="rating"><Star size={14} fill="currentColor" /> {d.rating}</span></div><button className={voted === d.name ? 'vote-button voted' : 'vote-button'} onClick={() => vote(d.name)}>{voted === d.name ? <><Check size={16} /> Voted</> : 'Vote'}<span className="vote-count">{d.votes}</span></button></div><p className="blurb">{d.blurb}</p><div className="tags">{d.tags.map(t => <span key={t}>{t}</span>)}</div><div className="card-meta"><span><Euro size={15} /> <strong>€{d.budget}</strong> / person</span><span><Clock3 size={15} /> {d.travel}</span></div></div>
          </article>)}</section>

          <section className="bottom-grid"><div className="panel vote-panel"><div className="panel-head"><div><h2>Group votes</h2><p>Everyone gets one favourite.</p></div><span className="people-count"><Users size={16} /> 6 people</span></div><div className="vote-bars">{[...destinations].sort((a,b)=>b.votes-a.votes).map((d, i) => <div className="bar-row" key={d.name}><div className="bar-info"><span>{i === 0 && <span className="crown">✦</span>}{d.name}</span><strong>{d.votes} {d.votes === 1 ? 'vote' : 'votes'}</strong></div><div className="bar-track"><div className={`bar-fill ${d.color}`} style={{ width: `${Math.max(13, d.votes / 6 * 100)}%` }} /></div></div>)}</div><div className="vote-footer"><div className="mini-avatars"><span>AK</span><span>JS</span><span>ML</span><span>+3</span></div><span>{voted ? 'Your vote is counted ✨' : 'Your vote is still open'}</span></div></div>
            <div className="panel budget-panel"><div className="panel-head"><div><h2>Budget comfort zone</h2><p>Per person, including travel & stay.</p></div><WalletCards size={21} className="panel-icon" /></div><div className="budget-total"><span>Up to</span><strong>€{budget}</strong><small>/ person</small></div><input type="range" min="400" max="800" step="10" value={budget} onChange={e => setBudget(+e.target.value)} /><div className="range-labels"><span>€400</span><span>€800</span></div><div className="budget-note"><Check size={15} /> {leader.name} fits your budget</div></div></section>

          <section className="panel itinerary-panel"><div className="panel-head"><div><div className="eyebrow"><span className="spark-dot">✦</span> Your current front-runner</div><h2>{leader.name} weekend preview</h2><p>A loose plan for when the votes are in. Keep it flexible.</p></div><button className="outline-button details-button" onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'Hide preview' : 'View full itinerary'} <ArrowRight size={16} /></button></div><div className="itinerary-line">{itinerary.map((item, i) => { const Icon = item.icon; return <div className="itinerary-item" key={item.title}><div className={`itinerary-icon ${item.tone}`}><Icon size={18} /></div><div><small>{item.time}</small><h4>{item.title}</h4><p>{item.place}</p></div>{i < itinerary.length - 1 && <div className="connector" />}</div> })}</div>{showDetails && <div className="details-toast"><Check size={16} /> Flights and stays will appear here once the group locks in Lisbon.</div>}</section>
        </div>
      </main>
      <div className="mobile-nav">{[[Home,'Overview'],[Compass,'Explore'],[CalendarDays,'Itinerary'],[WalletCards,'Budget']].map(([Icon,label]) => <button className={tab===label?'active':''} onClick={() => setTab(label as string)} key={label as string}><Icon size={18}/><span>{label as string}</span></button>)}</div>
      {tab !== 'Overview' && <div className="tab-toast"><span>{tab} view</span><X size={16} onClick={() => setTab('Overview')} /></div>}
    </div>
  )
}

export default App
