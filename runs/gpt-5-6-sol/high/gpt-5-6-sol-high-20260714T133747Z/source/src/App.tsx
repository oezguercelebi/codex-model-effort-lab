import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Bike,
  CalendarDays,
  Check,
  ChevronDown,
  CircleCheck,
  Clock3,
  Coffee,
  Compass,
  Euro,
  Heart,
  Hotel,
  Map,
  MapPin,
  Menu,
  Mountain,
  Palmtree,
  Plane,
  Plus,
  Search,
  Share2,
  Sparkles,
  Star,
  Sun,
  Sunrise,
  TramFront,
  Utensils,
  Users,
  WandSparkles,
  X,
} from 'lucide-react'
import collage from './assets/weekend-destinations.png'

type Destination = {
  id: string
  city: string
  country: string
  eyebrow: string
  tagline: string
  price: number
  travel: string
  temperature: string
  weather: string
  votes: string[]
  imagePosition: string
  accent: string
  icon: 'coast' | 'city' | 'mountain'
  highlights: string[]
  breakdown: { label: string; value: number }[]
  description: string
  route: string
}

const friends = [
  { name: 'Maya', initials: 'MA', color: '#dc775d' },
  { name: 'Jonas', initials: 'JO', color: '#3f796f' },
  { name: 'Lea', initials: 'LE', color: '#6a73a5' },
  { name: 'You', initials: 'YO', color: '#d6a23f' },
]

const destinations: Destination[] = [
  {
    id: 'cinque-terre',
    city: 'Cinque Terre',
    country: 'Italy',
    eyebrow: 'Coastal reset',
    tagline: 'Sea swims, cliffside paths & pasta after sunset.',
    price: 418,
    travel: '4h 35m',
    temperature: '24°',
    weather: 'Sunny',
    votes: ['Maya', 'You'],
    imagePosition: 'left',
    accent: '#ef6a4f',
    icon: 'coast',
    highlights: ['Ocean-view stay', 'Hike between villages', 'Sunset aperitivo'],
    breakdown: [
      { label: 'Travel', value: 148 },
      { label: 'Stay', value: 170 },
      { label: 'Food', value: 72 },
      { label: 'Things to do', value: 28 },
    ],
    description:
      'Five colorful villages, one spectacular coastal trail, and just enough time for a swim before dinner. The most relaxed option on the shortlist.',
    route: 'BER → PSA · direct flight + train',
  },
  {
    id: 'marrakech',
    city: 'Marrakech',
    country: 'Morocco',
    eyebrow: 'Culture hit',
    tagline: 'Rooftop dinners, tiled riads & a maze made for wandering.',
    price: 356,
    travel: '4h 10m',
    temperature: '29°',
    weather: 'Clear skies',
    votes: ['Lea'],
    imagePosition: 'center',
    accent: '#c85d40',
    icon: 'city',
    highlights: ['Private riad', 'Medina food tour', 'Hammam session'],
    breakdown: [
      { label: 'Travel', value: 164 },
      { label: 'Stay', value: 104 },
      { label: 'Food', value: 54 },
      { label: 'Things to do', value: 34 },
    ],
    description:
      'A full sensory change of scene: garden courtyards, spice stalls, slow breakfasts and golden-hour rooftops. Biggest adventure for the budget.',
    route: 'BER → RAK · direct flight',
  },
  {
    id: 'innsbruck',
    city: 'Innsbruck',
    country: 'Austria',
    eyebrow: 'Fresh air fix',
    tagline: 'Big mountain views, easy trails & crisp alpine mornings.',
    price: 392,
    travel: '5h 18m',
    temperature: '18°',
    weather: 'Partly sunny',
    votes: ['Jonas'],
    imagePosition: 'right',
    accent: '#3d756c',
    icon: 'mountain',
    highlights: ['Scenic night train', 'Nordkette cable car', 'Lakeside picnic'],
    breakdown: [
      { label: 'Travel', value: 92 },
      { label: 'Stay', value: 184 },
      { label: 'Food', value: 80 },
      { label: 'Things to do', value: 36 },
    ],
    description:
      'Walkable old-town charm with serious peaks right at the edge of the city. The low-carbon pick and the easiest place to mix action with downtime.',
    route: 'Berlin Hbf → Innsbruck Hbf · 1 change',
  },
]

const cinqueItinerary = {
  Friday: [
    { time: '16:20', title: 'Fly Berlin to Pisa', detail: 'Meet at BER Terminal 1 at 14:45', icon: Plane, tag: 'Booked' },
    { time: '20:10', title: 'Check in at Casa Marina', detail: '3 nights · sea-view apartment in Manarola', icon: Hotel, tag: 'Stay' },
    { time: '21:00', title: 'Late dinner at Da Aristide', detail: 'Table outside, five minutes from the apartment', icon: Utensils, tag: 'Food' },
  ],
  Saturday: [
    { time: '08:30', title: 'Breakfast by the harbor', detail: 'Focaccia, coffee, and a slow start', icon: Coffee, tag: 'Food' },
    { time: '10:00', title: 'Hike to Corniglia', detail: '7.4 km · bring swimwear and water', icon: Compass, tag: 'Explore' },
    { time: '16:30', title: 'Swim at Guvano cove', detail: 'Unstructured afternoon by the sea', icon: Sun, tag: 'Free time' },
    { time: '19:15', title: 'Sunset aperitivo', detail: 'Nessun Dorma terrace · backup saved nearby', icon: Sunrise, tag: 'Pinned' },
  ],
  Sunday: [
    { time: '09:30', title: 'Boat to Monterosso', detail: 'Weather permitting · tickets at the harbor', icon: Map, tag: 'Explore' },
    { time: '12:30', title: 'Long lunch at Miky', detail: 'Seafood tasting menu · reservation requested', icon: Utensils, tag: 'Food' },
    { time: '17:40', title: 'Train back to Pisa', detail: 'Flight departs at 20:25', icon: TramFront, tag: 'Travel' },
  ],
}

const itineraries: Record<string, typeof cinqueItinerary> = {
  'cinque-terre': cinqueItinerary,
  marrakech: {
    Friday: [
      { time: '15:45', title: 'Fly Berlin to Marrakech', detail: 'Meet at BER Terminal 1 at 13:55', icon: Plane, tag: 'Booked' },
      { time: '20:15', title: 'Check in at Riad Yasmine', detail: '3 nights · courtyard rooms in the Medina', icon: Hotel, tag: 'Stay' },
      { time: '21:30', title: 'Rooftop dinner at Nomad', detail: 'Modern Moroccan plates above the souks', icon: Utensils, tag: 'Food' },
    ],
    Saturday: [
      { time: '09:00', title: 'Breakfast in the courtyard', detail: 'Msemen, fruit, and mint tea by the pool', icon: Coffee, tag: 'Food' },
      { time: '10:30', title: 'Medina food walk', detail: 'Private guide · three hours through the souks', icon: Compass, tag: 'Explore' },
      { time: '16:00', title: 'Traditional hammam', detail: 'Steam, scrub, and a very slow afternoon', icon: Sparkles, tag: 'Reset' },
      { time: '19:30', title: 'Sunset at El Fenn', detail: 'Rooftop drinks before dinner nearby', icon: Sunrise, tag: 'Pinned' },
    ],
    Sunday: [
      { time: '09:30', title: 'Jardin Majorelle', detail: 'Early tickets to beat the crowds', icon: Palmtree, tag: 'Explore' },
      { time: '12:30', title: 'Long lunch at Plus61', detail: 'Seasonal sharing plates in Gueliz', icon: Utensils, tag: 'Food' },
      { time: '17:10', title: 'Transfer to the airport', detail: 'Flight departs at 19:50', icon: Plane, tag: 'Travel' },
    ],
  },
  innsbruck: {
    Friday: [
      { time: '18:35', title: 'Night train from Berlin', detail: 'Meet on platform 12 with dinner for the ride', icon: TramFront, tag: 'Booked' },
      { time: '22:00', title: 'Sleeper-car wind-down', detail: 'Cards, snacks, then lights out', icon: BedDouble, tag: 'Travel' },
      { time: '07:05', title: 'Arrive in Innsbruck', detail: 'Bags can go straight to the hotel', icon: MapPin, tag: 'Easy' },
    ],
    Saturday: [
      { time: '08:30', title: 'Breakfast in the old town', detail: 'Coffee and pastries under the Golden Roof', icon: Coffee, tag: 'Food' },
      { time: '10:00', title: 'Nordkette cable car', detail: 'Ride from city center to 2,256 meters', icon: Mountain, tag: 'Explore' },
      { time: '14:00', title: 'Alpine picnic and easy trail', detail: 'Panorama loop · 5.8 km', icon: Compass, tag: 'Outside' },
      { time: '19:00', title: 'Dinner at Stiftskeller', detail: 'Tyrolean classics in the courtyard', icon: Utensils, tag: 'Pinned' },
    ],
    Sunday: [
      { time: '09:00', title: 'Slow hotel breakfast', detail: 'No alarms before nine', icon: Coffee, tag: 'Easy' },
      { time: '10:30', title: 'Bike along the Inn', detail: 'Flat riverside route · rental bikes reserved', icon: Bike, tag: 'Explore' },
      { time: '15:40', title: 'Train back to Berlin', detail: 'One easy change in Munich', icon: TramFront, tag: 'Travel' },
    ],
  },
}

function MiniAvatar({ name, size = 'normal' }: { name: string; size?: 'normal' | 'small' }) {
  const friend = friends.find((item) => item.name === name) ?? friends[3]
  return (
    <span
      className={`avatar avatar-${size}`}
      style={{ backgroundColor: friend.color }}
      title={friend.name}
      aria-label={friend.name}
    >
      {friend.initials}
    </span>
  )
}

function DestinationIcon({ type }: { type: Destination['icon'] }) {
  if (type === 'coast') return <Palmtree size={16} />
  if (type === 'mountain') return <Mountain size={16} />
  return <Sparkles size={16} />
}

function DestinationCard({
  destination,
  totalPrice,
  userVote,
  onVote,
  onOpen,
  rank,
}: {
  destination: Destination
  totalPrice: boolean
  userVote: string
  onVote: (id: string) => void
  onOpen: (destination: Destination) => void
  rank: number
}) {
  const isVoted = userVote === destination.id
  const voteCount = destination.votes.filter((name) => name !== 'You').length + (isVoted ? 1 : 0)
  const voters = destination.votes.filter((name) => name !== 'You').concat(isVoted ? ['You'] : [])
  const isLeader = rank === 0
  return (
    <article className={`destination-card ${isLeader ? 'leader-card' : ''}`}>
      <button className="card-image image-slice" style={{ backgroundImage: `url(${collage})`, backgroundPosition: destination.imagePosition }} onClick={() => onOpen(destination)} aria-label={`View ${destination.city}`}>
        <span className="image-shade" />
        {isLeader && <span className="leader-pill"><Star size={13} fill="currentColor" /> Group favorite</span>}
        <span className="temperature"><Sun size={15} /> {destination.temperature}</span>
        <span className="image-label">{destination.country}</span>
        <strong>{destination.city}</strong>
      </button>
      <div className="card-body">
        <div className="card-eyebrow"><DestinationIcon type={destination.icon} /> {destination.eyebrow}</div>
        <p className="card-tagline">{destination.tagline}</p>
        <div className="metric-grid">
          <div>
            <span><Euro size={15} /> Estimate</span>
            <strong>€{totalPrice ? destination.price * 4 : destination.price}</strong>
            <small>{totalPrice ? 'group total' : 'per person'}</small>
          </div>
          <div>
            <span><Clock3 size={15} /> Door to door</span>
            <strong>{destination.travel}</strong>
            <small>{destination.route.includes('Hbf') ? 'by train' : 'incl. transfer'}</small>
          </div>
        </div>
        <div className="card-highlights">
          {destination.highlights.slice(0, 2).map((highlight) => <span key={highlight}><Check size={12} /> {highlight}</span>)}
        </div>
      </div>
      <div className="vote-row">
        <div className="voters">
          <div className="avatar-stack">
            {voters.map((name) => <MiniAvatar key={name} name={name} size="small" />)}
          </div>
          <span>{voteCount === 1 ? '1 vote' : `${voteCount} votes`}</span>
        </div>
        <button className={`vote-button ${isVoted ? 'voted' : ''}`} onClick={() => onVote(destination.id)}>
          <Heart size={16} fill={isVoted ? 'currentColor' : 'none'} />
          {isVoted ? 'Your pick' : 'Vote'}
        </button>
      </div>
    </article>
  )
}

export default function App() {
  const [activeView, setActiveView] = useState<'compare' | 'plan'>('compare')
  const [priceMode, setPriceMode] = useState<'person' | 'group'>('person')
  const [sort, setSort] = useState<'favorite' | 'budget' | 'quickest'>('favorite')
  const [userVote, setUserVote] = useState('cinque-terre')
  const [selected, setSelected] = useState<Destination | null>(null)
  const [selectedDay, setSelectedDay] = useState<keyof typeof cinqueItinerary>('Saturday')
  const [toast, setToast] = useState('')
  const [saved, setSaved] = useState(false)
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)

  const sortedDestinations = useMemo(() => {
    const voteTotal = (d: Destination) => d.votes.filter((name) => name !== 'You').length + (userVote === d.id ? 1 : 0)
    return [...destinations].sort((a, b) => {
      if (sort === 'budget') return a.price - b.price
      if (sort === 'quickest') return Number.parseFloat(a.travel) - Number.parseFloat(b.travel)
      return voteTotal(b) - voteTotal(a)
    })
  }, [sort, userVote])

  const leaderId = useMemo(() => {
    const voteTotal = (d: Destination) => d.votes.filter((name) => name !== 'You').length + (userVote === d.id ? 1 : 0)
    return [...destinations].sort((a, b) => voteTotal(b) - voteTotal(a))[0].id
  }, [userVote])

  const leaderDestination = destinations.find((destination) => destination.id === leaderId) ?? destinations[0]
  const leaderVoteCount = leaderDestination.votes.filter((name) => name !== 'You').length + (userVote === leaderId ? 1 : 0)
  const currentItinerary = itineraries[leaderId]

  function notify(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  function handleVote(id: string) {
    const next = userVote === id ? '' : id
    setUserVote(next)
    const place = destinations.find((item) => item.id === id)?.city
    notify(next ? `${place} is now your pick` : 'Your vote was removed')
  }

  function shareTrip() {
    void navigator.clipboard?.writeText('https://weekender.local/trip/coast-or-culture')
    notify('Invite link copied to clipboard')
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Weekender home">
          <span className="brand-mark"><Sun size={20} strokeWidth={2.5} /></span>
          <span>weekender</span>
        </a>
        <nav className={mobileMenu ? 'mobile-open' : ''} aria-label="Main navigation">
          <button className={activeView === 'compare' ? 'active' : ''} onClick={() => { setActiveView('compare'); setMobileMenu(false) }}>Compare</button>
          <button className={activeView === 'plan' ? 'active' : ''} onClick={() => { setActiveView('plan'); setMobileMenu(false) }}>Weekend plan</button>
          <button onClick={() => notify('Ideas board is ready for your next shortlist')}>Saved ideas</button>
        </nav>
        <div className="header-actions">
          <div className="header-avatars" aria-label="4 travelers">
            {friends.slice(0, 3).map((friend) => <MiniAvatar key={friend.name} name={friend.name} />)}
            <span className="avatar-count">+1</span>
          </div>
          <button className="share-button" onClick={shareTrip}><Share2 size={16} /> Invite</button>
          <button className="mobile-menu" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="status-line"><span className="live-dot" /> Voting closes Thursday at 18:00</div>
            <h1>Three places.<br /><em>One great weekend.</em></h1>
            <p>Everything your group needs to pick the trip—without the 147-message group chat.</p>
          </div>
          <div className="trip-card">
            <div className="trip-card-top">
              <span>Your weekend</span>
              <button aria-label="Edit trip dates" onClick={() => notify('Trip dates are flexible by ±1 day')}><WandSparkles size={15} /> Flexible</button>
            </div>
            <div className="trip-facts">
              <div><MapPin size={19} /><span>Leaving from<strong>Berlin</strong></span></div>
              <div><CalendarDays size={19} /><span>Dates<strong>19–21 Sep</strong></span></div>
              <div><Users size={19} /><span>Travelers<strong>4 friends</strong></span></div>
            </div>
          </div>
        </section>

        {activeView === 'compare' ? (
          <>
            <section className="compare-section">
              <div className="section-heading">
                <div>
                  <span className="kicker">THE SHORTLIST</span>
                  <h2>Where should we go?</h2>
                  <p>One vote each. Change your mind whenever you like.</p>
                </div>
                <div className="controls">
                  <div className="price-toggle" aria-label="Price display">
                    <button className={priceMode === 'person' ? 'active' : ''} onClick={() => setPriceMode('person')}>Per person</button>
                    <button className={priceMode === 'group' ? 'active' : ''} onClick={() => setPriceMode('group')}>Group total</button>
                  </div>
                  <label className="sort-control">
                    <span>Sort</span>
                    <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}>
                      <option value="favorite">Group favorite</option>
                      <option value="budget">Lowest budget</option>
                      <option value="quickest">Shortest journey</option>
                    </select>
                    <ChevronDown size={15} />
                  </label>
                </div>
              </div>

              <div className="destination-grid">
                {sortedDestinations.map((destination, index) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    totalPrice={priceMode === 'group'}
                    userVote={userVote}
                    onVote={handleVote}
                    onOpen={setSelected}
                    rank={destination.id === leaderId ? 0 : index + 1}
                  />
                ))}
              </div>
              <button className="suggest-button" onClick={() => setShowSuggestion(true)}><Plus size={17} /> Suggest another place</button>
            </section>

            <section className="decision-strip">
              <div className="decision-icon"><CircleCheck size={25} /></div>
              <div>
                <span>{leaderVoteCount > 1 ? 'Clear favorite' : 'Vote is wide open'}</span>
                <h3>{leaderVoteCount > 1 ? `${leaderDestination.city} is out in front` : 'It’s anyone’s weekend'}</h3>
                <p>{leaderVoteCount} of 4 friends picked {leaderDestination.city}. {leaderVoteCount < 3 ? 'One more vote would make it a majority.' : 'The group has a majority.'}</p>
              </div>
              <button onClick={() => setActiveView('plan')}>See the weekend plan <ArrowRight size={16} /></button>
            </section>
          </>
        ) : (
          <section className="plan-intro">
            <button className="back-link" onClick={() => setActiveView('compare')}><ArrowLeft size={16} /> Back to comparison</button>
            <div className="plan-title-row">
              <div>
                <span className="kicker">CURRENT FRONT-RUNNER</span>
                <h2>A weekend in {leaderDestination.city}</h2>
                <p>The practical bits are handled. Here’s how the weekend could feel.</p>
              </div>
              <div className="plan-stat"><span>Estimated total</span><strong>€{leaderDestination.price}</strong><small>per person</small></div>
            </div>
          </section>
        )}

        <section className={`itinerary-section ${activeView === 'plan' ? 'expanded' : ''}`}>
          <div className="itinerary-photo image-slice" style={{ backgroundImage: `url(${collage})`, backgroundPosition: leaderDestination.imagePosition }}>
            <span className="image-shade" />
            <div className="photo-content">
              <span className="photo-badge"><Sun size={14} /> {leaderDestination.temperature} & {leaderDestination.weather.toLowerCase()}</span>
              <div>
                <p>THE FRONT-RUNNER</p>
                <h2>{leaderDestination.city}<br />{leaderDestination.eyebrow.toLowerCase()}</h2>
                <span><MapPin size={15} /> {leaderDestination.country} · Sep 19–21</span>
              </div>
            </div>
          </div>
          <div className="itinerary-content">
            <div className="itinerary-head">
              <div>
                <span className="kicker">YOUR WEEKEND, SKETCHED OUT</span>
                <h2>Good plans, plenty of room.</h2>
              </div>
              <button className={`save-button ${saved ? 'saved' : ''}`} onClick={() => { setSaved(!saved); notify(saved ? 'Plan removed from saved ideas' : 'Weekend plan saved') }}>
                <Heart size={17} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save plan'}
              </button>
            </div>
            <div className="day-tabs" role="tablist">
              {(Object.keys(currentItinerary) as (keyof typeof cinqueItinerary)[]).map((day, index) => (
                <button key={day} role="tab" aria-selected={selectedDay === day} className={selectedDay === day ? 'active' : ''} onClick={() => setSelectedDay(day)}>
                  <span>Day {index + 1}</span>{day}
                </button>
              ))}
            </div>
            <div className="timeline">
              {currentItinerary[selectedDay].map((item) => {
                const Icon = item.icon
                return (
                  <div className="timeline-item" key={`${item.time}-${item.title}`}>
                    <time>{item.time}</time>
                    <span className="timeline-icon"><Icon size={17} /></span>
                    <div><h4>{item.title}</h4><p>{item.detail}</p></div>
                    <span className="timeline-tag">{item.tag}</span>
                  </div>
                )
              })}
            </div>
            <div className="itinerary-note"><Bike size={18} /><span><strong>Built for wandering.</strong> The gaps are intentional—this is a weekend, not a military operation.</span></div>
          </div>
        </section>

        <section className="group-section">
          <div>
            <span className="kicker">THE CREW</span>
            <h2>Four friends, one decision.</h2>
          </div>
          <div className="friend-list">
            {friends.map((friend, index) => {
              const picks = ['Cinque Terre', 'Innsbruck', 'Marrakech', userVote ? destinations.find((d) => d.id === userVote)?.city : 'Undecided']
              return <div className="friend" key={friend.name}><MiniAvatar name={friend.name} /><span><strong>{friend.name}</strong><small>{friend.name === 'You' ? 'That’s you' : 'Ready to go'}</small></span><em>{picks[index]}</em></div>
            })}
          </div>
          <button className="invite-wide" onClick={shareTrip}><Users size={19} /><span><strong>Room for one more?</strong><small>Invite a friend to compare and vote</small></span><ArrowRight size={18} /></button>
        </section>
      </main>

      <footer>
        <a className="brand" href="#top"><span className="brand-mark"><Sun size={20} /></span><span>weekender</span></a>
        <p>Made for long weekends and short group chats.</p>
        <span>Berlin · Sep 19–21</span>
      </footer>

      {selected && (
        <div className="modal-backdrop" onMouseDown={() => setSelected(null)}>
          <div className="detail-modal" role="dialog" aria-modal="true" aria-label={`${selected.city} details`} onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}><X size={20} /></button>
            <div className="modal-image image-slice" style={{ backgroundImage: `url(${collage})`, backgroundPosition: selected.imagePosition }}>
              <span className="image-shade" /><div><span>{selected.country}</span><h2>{selected.city}</h2><p>{selected.weather} · {selected.temperature}</p></div>
            </div>
            <div className="modal-body">
              <div className="modal-main">
                <span className="kicker">WHY IT WORKS</span>
                <p className="modal-description">{selected.description}</p>
                <div className="modal-highlights">{selected.highlights.map((item) => <span key={item}><Check size={14} /> {item}</span>)}</div>
                <div className="route-box"><Plane size={19} /><span><small>Best route</small><strong>{selected.route}</strong></span></div>
              </div>
              <div className="budget-card">
                <span>Estimated budget</span><strong>€{selected.price}</strong><small>per person</small>
                <div>{selected.breakdown.map((item) => <p key={item.label}><span>{item.label}</span><strong>€{item.value}</strong></p>)}</div>
                <button className={userVote === selected.id ? 'selected-vote' : ''} onClick={() => handleVote(selected.id)}><Heart size={16} fill={userVote === selected.id ? 'currentColor' : 'none'} /> {userVote === selected.id ? 'Your pick' : `Vote for ${selected.city}`}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuggestion && (
        <div className="modal-backdrop" onMouseDown={() => setShowSuggestion(false)}>
          <form className="suggest-modal" onSubmit={(event) => { event.preventDefault(); setShowSuggestion(false); notify(`${suggestion || 'Your idea'} was added to the ideas board`); setSuggestion('') }} onMouseDown={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setShowSuggestion(false)}><X size={20} /></button>
            <span className="suggest-icon"><Compass /></span>
            <span className="kicker">ADD TO THE MIX</span>
            <h2>What place is on your mind?</h2>
            <p>We’ll save the idea for the group to consider next.</p>
            <label><span>Destination</span><div className="input-wrap"><Search size={18} /><input autoFocus value={suggestion} onChange={(event) => setSuggestion(event.target.value)} placeholder="e.g. Porto, Portugal" /></div></label>
            <button className="submit-suggestion" type="submit" disabled={!suggestion.trim()}>Add suggestion <ArrowRight size={16} /></button>
          </form>
        </div>
      )}

      {toast && <div className="toast" role="status"><CircleCheck size={18} /> {toast}</div>}
    </div>
  )
}
