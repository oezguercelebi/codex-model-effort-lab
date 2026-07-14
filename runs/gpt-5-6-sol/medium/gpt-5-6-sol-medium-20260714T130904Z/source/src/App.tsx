import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  CarFront,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheckBig,
  Clock3,
  Coffee,
  Heart,
  MapPin,
  Menu,
  Mountain,
  Navigation,
  Plane,
  Plus,
  Share2,
  Sparkles,
  TrainFront,
  Trophy,
  Users,
  Utensils,
  Wallet,
  Wine,
  X,
} from 'lucide-react'

type Destination = {
  id: string
  name: string
  country: string
  kicker: string
  description: string
  cost: number
  travel: string
  route: string
  transport: 'Flight' | 'Train' | 'Drive'
  stay: string
  votes: number
  voters: string[]
  imageClass: string
  image?: string
  tags: string[]
}

const destinations: Destination[] = [
  {
    id: 'como',
    name: 'Lake Como',
    country: 'Italy',
    kicker: 'Lakeside reset',
    description: 'Slow ferries, long lunches and mountain air — a little glamorous without trying too hard.',
    cost: 428,
    travel: '3h 45m',
    route: 'Berlin → Milan',
    transport: 'Flight',
    stay: 'Casa Oliva, Varenna',
    votes: 4,
    voters: ['MJ', 'AK', 'LS', 'YN'],
    imageClass: 'como-image',
    image: '/assets/lake-como.jpg',
    tags: ['Swimming', 'Food', 'Scenery'],
  },
  {
    id: 'copenhagen',
    name: 'Copenhagen',
    country: 'Denmark',
    kicker: 'City energy',
    description: 'Harbour swims, great design and the sort of bakeries worth crossing a city for.',
    cost: 356,
    travel: '6h 55m',
    route: 'Berlin → København',
    transport: 'Train',
    stay: 'Hotel Ottilia, Vesterbro',
    votes: 3,
    voters: ['AK', 'YN', 'RB'],
    imageClass: 'cph-image',
    tags: ['Culture', 'Food', 'Nightlife'],
  },
  {
    id: 'saxon',
    name: 'Saxon Switzerland',
    country: 'Germany',
    kicker: 'Wild and close',
    description: 'Sandstone trails, forest cabins and no airport queues. Maximum weekend, minimum admin.',
    cost: 219,
    travel: '2h 35m',
    route: 'Berlin → Bad Schandau',
    transport: 'Drive',
    stay: 'Berghaus Rauschenstein',
    votes: 2,
    voters: ['LS', 'RB'],
    imageClass: 'saxon-image',
    tags: ['Hiking', 'Nature', 'Cozy'],
  },
]

const members = [
  { initials: 'MJ', color: '#dd684b' },
  { initials: 'AK', color: '#283f35' },
  { initials: 'LS', color: '#708e8c' },
  { initials: 'YN', color: '#d8a642' },
  { initials: 'RB', color: '#8a6b55' },
]

const itinerary = [
  {
    day: 'Friday',
    date: '05 Sep',
    title: 'Arrive & exhale',
    meta: '14:20 flight · 19:00 check-in',
    items: [
      { time: '14:20', title: 'Flight to Milan', note: 'BER → MXP · easyJet 5182', icon: Plane },
      { time: '19:00', title: 'Check in at Casa Oliva', note: '10 min walk from Varenna station', icon: BedDouble },
      { time: '20:30', title: 'Dinner at Vecchia Varenna', note: 'Terrace table requested', icon: Utensils },
    ],
  },
  {
    day: 'Saturday',
    date: '06 Sep',
    title: 'The lake day',
    meta: 'Ferries · swimming · aperitivo',
    items: [
      { time: '09:00', title: 'Coffee & market breakfast', note: 'Pasticceria Lorla', icon: Coffee },
      { time: '10:30', title: 'Ferry to Bellagio', note: 'Day pass · €15 per person', icon: Navigation },
      { time: '15:00', title: 'Swim at Lido di Lenno', note: 'Pack towels and sunscreen', icon: Sparkles },
      { time: '18:30', title: 'Golden-hour aperitivo', note: 'Bar Il Molo, Varenna', icon: Wine },
    ],
  },
  {
    day: 'Sunday',
    date: '07 Sep',
    title: 'One last view',
    meta: 'Hike · lunch · home',
    items: [
      { time: '09:30', title: 'Sentiero del Viandante', note: 'Easy 6 km section · trainers fine', icon: Mountain },
      { time: '13:00', title: 'Long lunch by the water', note: 'Osteria Quatro Pass', icon: Utensils },
      { time: '17:45', title: 'Train to the airport', note: 'Flight departs 20:55', icon: TrainFront },
    ],
  },
]

function AvatarStack({ small = false }: { small?: boolean }) {
  return (
    <div className={`avatar-stack ${small ? 'small' : ''}`} aria-label="5 friends are going">
      {members.slice(0, small ? 4 : 5).map((member) => (
        <span className="avatar" style={{ background: member.color }} key={member.initials}>
          {member.initials}
        </span>
      ))}
    </div>
  )
}

function TransportIcon({ type }: { type: Destination['transport'] }) {
  if (type === 'Train') return <TrainFront size={16} />
  if (type === 'Drive') return <CarFront size={16} />
  return <Plane size={16} />
}

function DestinationCard({
  destination,
  selected,
  compared,
  onVote,
  onCompare,
}: {
  destination: Destination
  selected: boolean
  compared: boolean
  onVote: () => void
  onCompare: () => void
}) {
  return (
    <article className={`destination-card ${destination.id === 'como' ? 'winner' : ''}`}>
      <div
        className={`destination-image ${destination.imageClass}`}
        style={destination.image ? { backgroundImage: `url(${destination.image})` } : undefined}
      >
        {destination.id === 'como' && (
          <div className="leading-badge"><Trophy size={14} /> Leading</div>
        )}
        <button className={`compare-check ${compared ? 'checked' : ''}`} onClick={onCompare} aria-label={`Compare ${destination.name}`}>
          {compared ? <Check size={14} strokeWidth={3} /> : <Plus size={15} />}
          <span>{compared ? 'Added' : 'Compare'}</span>
        </button>
        {!destination.image && <div className="scene-art" aria-hidden="true"><span /><i /><b /></div>}
      </div>
      <div className="destination-content">
        <div className="destination-heading">
          <div>
            <p className="eyebrow">{destination.kicker}</p>
            <h3>{destination.name}</h3>
            <p className="country"><MapPin size={13} /> {destination.country}</p>
          </div>
          <div className="vote-count"><strong>{destination.votes + (selected ? 1 : 0)}</strong><span>votes</span></div>
        </div>
        <p className="description">{destination.description}</p>
        <div className="tag-row">
          {destination.tags.map(tag => <span key={tag}>{tag}</span>)}
        </div>
        <div className="destination-stats">
          <div><Wallet size={17} /><span><small>Per person</small><strong>€{destination.cost}</strong></span></div>
          <div><Clock3 size={17} /><span><small>Door to door</small><strong>{destination.travel}</strong></span></div>
        </div>
        <div className="route-row">
          <span className="transport-icon"><TransportIcon type={destination.transport} /></span>
          <div><strong>{destination.route}</strong><small>{destination.transport} · return</small></div>
          <ChevronRight size={17} />
        </div>
        <div className="card-footer">
          <div className="mini-voters">
            {destination.voters.slice(0, 4).map((v, i) => <span key={v} style={{ background: members[i].color }}>{v}</span>)}
          </div>
          <button className={`vote-button ${selected ? 'selected' : ''}`} onClick={onVote}>
            {selected ? <><CircleCheckBig size={17} /> Voted</> : <><Heart size={17} /> Vote for this</>}
          </button>
        </div>
      </div>
    </article>
  )
}

export default function App() {
  const [tab, setTab] = useState<'overview' | 'itinerary' | 'group'>('overview')
  const [vote, setVote] = useState<string>('como')
  const [compare, setCompare] = useState<string[]>([])
  const [toast, setToast] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const compareItems = useMemo(() => destinations.filter((d) => compare.includes(d.id)), [compare])

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const toggleCompare = (id: string) => {
    setCompare((current) => {
      if (current.includes(id)) return current.filter(item => item !== id)
      if (current.length >= 2) {
        notify('Compare up to two destinations at a time')
        return current
      }
      return [...current, id]
    })
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Weekender home">
          <span className="brand-mark"><span>W</span></span>
          <span>weekender</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a className="active" href="#trip">My trips</a>
          <a href="#ideas">Inspiration</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button" onClick={() => notify('Share link copied to your clipboard')} aria-label="Share trip"><Share2 size={18} /></button>
          <AvatarStack small />
          <button className="add-friend" onClick={() => notify('Invite link ready to share')}><Plus size={17} /> Invite</button>
          <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Open menu">{mobileOpen ? <X /> : <Menu />}</button>
        </div>
        {mobileOpen && <div className="mobile-panel"><a href="#trip">My trips</a><a href="#ideas">Inspiration</a><button onClick={() => notify('Invite link ready to share')}>Invite a friend</button></div>}
      </header>

      <main id="top">
        <section className="trip-hero" id="trip">
          <div className="trip-context">
            <span className="status-dot" /> Voting open
            <span className="divider">·</span>
            <span>Ends Thursday at 18:00</span>
          </div>
          <div className="hero-heading">
            <div>
              <p className="overline">Trip board / #08</p>
              <h1>One last summer <em>weekend.</em></h1>
              <p className="hero-copy">Five friends, three ideas, one very necessary escape. Pick your favorite and we’ll handle the rest.</p>
            </div>
            <div className="date-card">
              <div className="date-icon"><CalendarDays size={22} /></div>
              <div><small>Save the date</small><strong>5–7 September</strong><span>2 nights · 5 friends</span></div>
              <button aria-label="Change dates"><ChevronDown size={18} /></button>
            </div>
          </div>
          <div className="tab-bar" role="tablist">
            {(['overview', 'itinerary', 'group'] as const).map((item) => (
              <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>
                {item === 'overview' ? 'Destinations' : item === 'itinerary' ? 'Itinerary' : 'The group'}
                {item === 'group' && <span className="tab-count">5</span>}
              </button>
            ))}
          </div>
        </section>

        {tab === 'overview' && (
          <section className="content-section destinations-section">
            <div className="section-heading">
              <div><p className="section-index">01 / CHOOSE</p><h2>Where should we go?</h2><p>Prices include transport, two nights and a very generous food estimate.</p></div>
              <div className="budget-note"><Wallet size={18} /><span>Group budget<strong>Up to €450 each</strong></span></div>
            </div>
            <div className="destination-grid">
              {destinations.map(destination => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  selected={vote === destination.id}
                  compared={compare.includes(destination.id)}
                  onCompare={() => toggleCompare(destination.id)}
                  onVote={() => {
                    setVote(destination.id)
                    notify(`Your vote is on ${destination.name}`)
                  }}
                />
              ))}
            </div>
            <div className="decision-banner">
              <div className="decision-icon"><Sparkles size={24} /></div>
              <div><span>Current frontrunner</span><strong>Lake Como has the group dreaming</strong><p>4 of 5 friends voted · one vote still to come</p></div>
              <button onClick={() => setTab('itinerary')}>See the plan <ArrowRight size={17} /></button>
            </div>
          </section>
        )}

        {tab === 'itinerary' && (
          <section className="content-section itinerary-section">
            <div className="section-heading">
              <div><p className="section-index">02 / THE PLAN</p><h2>Lake Como, day by day</h2><p>A relaxed first draft — enough structure to book, enough room to wander.</p></div>
              <button className="outline-action" onClick={() => notify('Itinerary saved for offline viewing')}><Check size={17} /> Save plan</button>
            </div>
            <div className="itinerary-layout">
              <div className="itinerary-list">
                {itinerary.map((day) => (
                  <article className="day-card" key={day.day}>
                    <div className="day-heading"><div className="day-date"><strong>{day.date.split(' ')[0]}</strong><span>{day.date.split(' ')[1]}</span></div><div><p>{day.day}</p><h3>{day.title}</h3><span>{day.meta}</span></div></div>
                    <div className="timeline">
                      {day.items.map((item) => {
                        const Icon = item.icon
                        return <div className="timeline-item" key={item.time + item.title}><time>{item.time}</time><span className="timeline-icon"><Icon size={17} /></span><div><strong>{item.title}</strong><p>{item.note}</p></div></div>
                      })}
                    </div>
                  </article>
                ))}
              </div>
              <aside className="booking-card">
                <div className="booking-image" />
                <p className="eyebrow">THE NUMBERS</p><h3>€428 per person</h3>
                <div className="cost-row"><span>Return flight + train</span><strong>€168</strong></div>
                <div className="cost-row"><span>2 nights accommodation</span><strong>€152</strong></div>
                <div className="cost-row"><span>Food & drinks</span><strong>€78</strong></div>
                <div className="cost-row"><span>Ferries & activities</span><strong>€30</strong></div>
                <div className="cost-total"><span>Total for 5</span><strong>€2,140</strong></div>
                <button onClick={() => notify('Booking checklist added to your trip')}>Start booking <ArrowRight size={17} /></button>
                <small>Prices checked today · nothing booked yet</small>
              </aside>
            </div>
          </section>
        )}

        {tab === 'group' && (
          <section className="content-section group-section">
            <div className="section-heading">
              <div><p className="section-index">03 / THE CREW</p><h2>Five calendars, one weekend</h2><p>Everyone is free — now we just need Riley’s vote.</p></div>
              <button className="outline-action" onClick={() => notify('A friendly reminder was sent')}><Users size={17} /> Nudge the group</button>
            </div>
            <div className="group-grid">
              {members.map((member, i) => (
                <article className="member-card" key={member.initials}>
                  <span className="large-avatar" style={{ background: member.color }}>{member.initials}</span>
                  <div><h3>{['Maya Jensen', 'Anton Keller', 'Lina Schmidt', 'Yara Nouri', 'Riley Brooks'][i]}</h3><p>{i === 4 ? 'Still deciding' : `Voted for ${i === 1 ? 'Copenhagen' : 'Lake Como'}`}</p></div>
                  <span className={`member-status ${i === 4 ? 'pending' : ''}`}>{i === 4 ? 'Pending' : <><Check size={14} /> Voted</>}</span>
                </article>
              ))}
              <button className="invite-card" onClick={() => notify('Invite link ready to share')}><span><Plus size={22} /></span><strong>Bring one more?</strong><p>Invite another friend to this trip</p></button>
            </div>
          </section>
        )}
      </main>

      {compare.length > 0 && (
        <div className="compare-dock">
          <div><span className="compare-label">Compare</span>{compareItems.map(item => <strong key={item.id}>{item.name}<button onClick={() => toggleCompare(item.id)} aria-label={`Remove ${item.name}`}><X size={13} /></button></strong>)}</div>
          <button disabled={compare.length < 2} onClick={() => notify('Comparison is ready — Lake Como wins on travel mood')}>Compare now <ArrowRight size={16} /></button>
        </div>
      )}

      {toast && <div className="toast"><Check size={16} /> {toast}</div>}
      <footer><span className="brand footer-brand"><span className="brand-mark"><span>W</span></span><span>weekender</span></span><p>Less planning. More going.</p><span>Made for the group chat</span></footer>
    </div>
  )
}
