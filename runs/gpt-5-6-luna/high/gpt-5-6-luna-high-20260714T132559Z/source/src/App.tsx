import { useMemo, useState } from "react"
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  CloudSun,
  Compass,
  Copy,
  Euro,
  Heart,
  Info,
  MapPin,
  MoreHorizontal,
  Plus,
  Send,
  Share2,
  Sparkles,
  Star,
  ThumbsUp,
  Users,
  Vote,
  X,
} from "lucide-react"

type Destination = {
  id: string
  name: string
  country: string
  price: number
  travel: string
  rating: string
  votes: number
  color: string
  label: string
  description: string
  tags: string[]
}

const destinations: Destination[] = [
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    price: 410,
    travel: "2h 55m",
    rating: "4.8",
    votes: 8,
    color: "lisbon",
    label: "Sun-soaked & soulful",
    description: "Golden hour, tiled streets, and the best pastel de nata in town.",
    tags: ["Food & wine", "Culture", "Easy-going"],
  },
  {
    id: "copenhagen",
    name: "Copenhagen",
    country: "Denmark",
    price: 465,
    travel: "1h 35m",
    rating: "4.7",
    votes: 6,
    color: "copenhagen",
    label: "Design-led & delicious",
    description: "Canals, clever design, and a long-table dinner to remember.",
    tags: ["Design", "Cycling", "Restaurants"],
  },
  {
    id: "ljubljana",
    name: "Ljubljana",
    country: "Slovenia",
    price: 355,
    travel: "2h 10m",
    rating: "4.9",
    votes: 4,
    color: "ljubljana",
    label: "Small city, big energy",
    description: "A pocket-sized capital with river cafés and a castle on the hill.",
    tags: ["Outdoors", "Value", "Local gems"],
  },
]

const friends = [
  { name: "Maya", initials: "MC", tone: "coral" },
  { name: "Jon", initials: "JW", tone: "navy" },
  { name: "Sofia", initials: "SK", tone: "peach" },
  { name: "Theo", initials: "TP", tone: "mint" },
  { name: "You", initials: "AM", tone: "lavender" },
]

const dayPlans = [
  {
    day: "Friday",
    date: "14 Jun",
    mood: "Arrive & wander",
    items: [
      { time: "15:30", title: "Check in at The Lumiares", detail: "Apartments · Bairro Alto", icon: "key" },
      { time: "18:00", title: "Sunset drinks at Park Bar", detail: "Rooftop · 8 min walk", icon: "sun" },
      { time: "20:30", title: "Petiscos at Taberna da Rua", detail: "Dinner · Booked for 5", icon: "fork" },
    ],
  },
  {
    day: "Saturday",
    date: "15 Jun",
    mood: "Tiles & tastings",
    items: [
      { time: "09:30", title: "Coffee & pastel de nata", detail: "Manteigaria · Chiado", icon: "coffee" },
      { time: "11:00", title: "Tram 28 to Alfama", detail: "Slow morning · Wander at will", icon: "tram" },
      { time: "19:30", title: "Dinner at Prado", detail: "Tasting menu · Reserved", icon: "fork" },
    ],
  },
  {
    day: "Sunday",
    date: "16 Jun",
    mood: "One last look",
    items: [
      { time: "10:00", title: "Brunch at Nicolau", detail: "Coffee · 4 min walk", icon: "coffee" },
      { time: "12:00", title: "Browse LX Factory", detail: "Markets & makers", icon: "shop" },
      { time: "15:45", title: "Head to the airport", detail: "Pre-booked transfer", icon: "plane" },
    ],
  },
]

function AvatarStack({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`avatar-stack ${compact ? "compact" : ""}`} aria-label="Trip members">
      {friends.slice(0, compact ? 4 : 5).map((friend) => (
        <span className={`avatar avatar-${friend.tone}`} title={friend.name} key={friend.name}>
          {friend.initials}
        </span>
      ))}
      {compact && <span className="avatar more-avatar">+1</span>}
    </div>
  )
}

function DestinationArtwork({ type }: { type: string }) {
  return (
    <div className={`destination-artwork artwork-${type}`} aria-hidden="true">
      <div className="art-sun" />
      <div className="art-cloud cloud-one" />
      <div className="art-cloud cloud-two" />
      <div className="art-hill hill-back" />
      <div className="art-hill hill-front" />
      <div className="art-buildings">
        <i /><i /><i /><i /><i />
      </div>
      {type === "lisbon" && <div className="art-tram"><span>● ●</span></div>}
      {type === "copenhagen" && <div className="art-windmill"><b /><b /><b /><b /></div>}
      {type === "ljubljana" && <div className="art-castle"><b /><span /></div>}
      <div className="art-caption"><MapPin size={12} /> {type === "lisbon" ? "Alfama hills" : type === "copenhagen" ? "Nyhavn harbour" : "Old town"}</div>
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState<"compare" | "results">("compare")
  const [votedFor, setVotedFor] = useState<string | null>(null)
  const [activeDay, setActiveDay] = useState(0)
  const [showInvite, setShowInvite] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const voteCounts = useMemo(() => {
    return destinations.map((destination) => ({
      ...destination,
      displayVotes: destination.votes + (votedFor === destination.id ? 1 : 0),
    }))
  }, [votedFor])

  const totalVotes = voteCounts.reduce((sum, destination) => sum + destination.displayVotes, 0)
  const handleCopy = () => {
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#top" aria-label="Weekender home">
            <span className="brand-mark"><Compass size={18} strokeWidth={2.5} /></span>
            <span>weekender<span className="brand-dot">.</span></span>
          </a>
          <nav className="main-nav" aria-label="Main navigation">
            <a className="active" href="#overview">Overview</a>
            <a href="#vote">Vote</a>
            <a href="#plan">Plan</a>
          </nav>
          <div className="topbar-actions">
            <button className="trip-switcher" type="button"><span className="online-dot" />June escape <ChevronDown size={15} /></button>
            <button className="icon-button notification" type="button" aria-label="Notifications"><Bell size={18} /><span /></button>
            <button className="profile avatar avatar-lavender" type="button" aria-label="Open profile">AM</button>
          </div>
        </div>
      </header>

      <main id="top" className="page-content">
        <section className="welcome-row" id="overview">
          <div>
            <div className="eyebrow"><span className="eyebrow-line" /> Weekend planning, together</div>
            <h1>A weekend worth<br /><em>remembering.</em></h1>
            <p className="welcome-copy">The crew is choosing a destination for <strong>14–16 June.</strong><br className="desktop-break" /> Three places, one very good weekend.</p>
          </div>
          <aside className="snapshot-card">
            <div className="snapshot-top"><span className="mini-label">YOUR NEXT ESCAPE</span><button className="quiet-icon" type="button" aria-label="More trip options"><MoreHorizontal size={18} /></button></div>
            <div className="snapshot-destination"><span className="snapshot-flag">✦</span><div><strong>Lisbon</strong><span>Portugal · Draft itinerary</span></div><span className="leading-badge">Leading</span></div>
            <div className="snapshot-details"><span><CalendarDays size={15} /> 14–16 Jun</span><span><Users size={15} /> 5 friends</span></div>
            <div className="snapshot-progress"><div><span>Planning progress</span><strong>66%</strong></div><div className="progress-track"><span /></div></div>
          </aside>
        </section>

        <section className="section-block" id="vote">
          <div className="section-heading">
            <div><span className="section-kicker">01 · PICK A PLACE</span><h2>Where should we go?</h2><p>Compare the contenders, then cast your vote. You can change it anytime.</p></div>
            <div className="heading-actions"><div className="view-tabs" role="tablist" aria-label="Destination view"><button className={activeTab === "compare" ? "selected" : ""} onClick={() => setActiveTab("compare")} role="tab" aria-selected={activeTab === "compare"}>Compare</button><button className={activeTab === "results" ? "selected" : ""} onClick={() => setActiveTab("results")} role="tab" aria-selected={activeTab === "results"}>Results <span className="tab-count">18</span></button></div><button className="share-button" type="button" onClick={() => setShowInvite(true)}><Share2 size={16} /> Share trip</button></div>
          </div>

          {activeTab === "compare" ? (
            <div className="destination-grid">
              {voteCounts.map((destination, index) => {
                const isVoted = votedFor === destination.id
                const isLeading = index === 0
                return (
                  <article className={`destination-card ${isVoted ? "is-voted" : ""}`} key={destination.id}>
                    <div className="card-art-wrap"><DestinationArtwork type={destination.color} />{isLeading && <span className="leading-ribbon"><Sparkles size={13} /> Current favourite</span>}<button className={`heart-button ${saved && index === 0 ? "saved" : ""}`} type="button" aria-label={`Save ${destination.name}`} onClick={() => index === 0 && setSaved(!saved)}><Heart size={17} fill={saved && index === 0 ? "currentColor" : "none"} /></button></div>
                    <div className="destination-card-body">
                      <div className="destination-title"><div><h3>{destination.name}</h3><p><MapPin size={13} /> {destination.country}</p></div><div className="rating"><Star size={14} fill="currentColor" /> {destination.rating}</div></div>
                      <p className="destination-description">{destination.description}</p>
                      <div className="tag-row">{destination.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                      <div className="metrics-row"><div><span className="metric-label"><Euro size={13} /> Est. per person</span><strong>€{destination.price}</strong></div><div><span className="metric-label"><Clock3 size={13} /> From Berlin</span><strong>{destination.travel}</strong></div></div>
                      <div className="vote-footer"><div className="vote-count"><AvatarStack compact /><span><strong>{destination.displayVotes} votes</strong><small>{isVoted ? "Your vote is in" : "from the group"}</small></span></div><button className={`vote-button ${isVoted ? "voted" : ""}`} type="button" onClick={() => setVotedFor(isVoted ? null : destination.id)}>{isVoted ? <><Check size={15} /> Voted</> : <><ThumbsUp size={15} /> Vote</>}</button></div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="results-panel">
              <div className="results-intro"><div className="result-icon"><Vote size={20} /></div><div><h3>The group is leaning sunny.</h3><p>18 votes cast · last vote 12 minutes ago</p></div><span className="result-status"><span className="online-dot" /> Voting open</span></div>
              <div className="result-list">{voteCounts.slice().sort((a, b) => b.displayVotes - a.displayVotes).map((destination, index) => <div className="result-row" key={destination.id}><span className="result-rank">0{index + 1}</span><div className={`result-swatch ${destination.color}`}><span>{destination.name.slice(0, 1)}</span></div><div className="result-name"><strong>{destination.name}</strong><span>{destination.country}</span></div><div className="result-bar"><div><span style={{ width: `${(destination.displayVotes / totalVotes) * 100}%` }} /></div><small>{destination.displayVotes} votes</small></div><button className={`result-vote ${votedFor === destination.id ? "active" : ""}`} onClick={() => setVotedFor(votedFor === destination.id ? null : destination.id)}>{votedFor === destination.id ? <Check size={15} /> : <Plus size={15} />}</button></div>)}</div>
              <div className="results-note"><Info size={15} /> You can switch your vote until everyone has weighed in.</div>
            </div>
          )}
          <div className="vote-deadline"><Clock3 size={14} /> Voting closes in <strong>2 days</strong><span className="deadline-separator" /> <span>{totalVotes} of 20 votes in</span></div>
        </section>

        <div className="content-columns">
          <section className="itinerary-section" id="plan">
            <div className="section-heading compact-heading"><div><span className="section-kicker">02 · MAKE IT A PLAN</span><h2>A little Lisbon magic</h2><p>A relaxed draft itinerary based on the group's favourites.</p></div><button className="outline-button" type="button"><Plus size={16} /> Add activity</button></div>
            <div className="itinerary-card">
              <div className="itinerary-card-header"><div className="winning-place"><div className="place-icon"><Compass size={19} /></div><div><span>WINNING DESTINATION · FOR NOW</span><strong>Lisbon, Portugal</strong></div></div><div className="weather"><CloudSun size={23} /><div><strong>24° / 17°</strong><span>Mostly sunny</span></div></div></div>
              <div className="day-tabs">{dayPlans.map((plan, index) => <button type="button" key={plan.day} className={activeDay === index ? "active" : ""} onClick={() => setActiveDay(index)}><span>{plan.day}</span><small>{plan.date}</small></button>)}</div>
              <div className="day-summary"><div><span className="day-number">0{activeDay + 1}</span><div><h3>{dayPlans[activeDay].mood}</h3><p>{dayPlans[activeDay].day} · {dayPlans[activeDay].date}</p></div></div><button type="button" className="edit-link">Edit day <ChevronRight size={15} /></button></div>
              <div className="timeline">{dayPlans[activeDay].items.map((item, index) => <div className="timeline-item" key={item.time}><div className="timeline-time">{item.time}</div><div className="timeline-line"><span className={`timeline-dot ${index === 0 ? "filled" : ""}`} />{index !== dayPlans[activeDay].items.length - 1 && <i />}</div><div className="timeline-copy"><div className="timeline-title"><strong>{item.title}</strong><span className={`activity-icon ${item.icon}`}><ActivityIcon type={item.icon} /></span></div><p>{item.detail}</p></div></div>)}</div>
              <button className="itinerary-footer" type="button">View full itinerary <ArrowRight size={16} /></button>
            </div>
          </section>

          <aside className="crew-section">
            <div className="section-heading compact-heading"><div><span className="section-kicker">03 · THE CREW</span><h2>Who’s in?</h2></div><button className="quiet-icon" type="button" aria-label="More crew options"><MoreHorizontal size={18} /></button></div>
            <div className="crew-card"><div className="crew-card-top"><div><h3>Five friends, one escape</h3><p>Everyone's opinion counts.</p></div><div className="crew-avatars"><AvatarStack /></div></div><div className="crew-list">{friends.slice(0, 4).map((friend, index) => <div className="crew-person" key={friend.name}><span className={`avatar avatar-${friend.tone}`}>{friend.initials}</span><div><strong>{friend.name}</strong><span>{index === 0 ? "Trip organiser" : index === 1 ? "Voted · Lisbon" : index === 2 ? "Voted · Copenhagen" : "Not voted yet"}</span></div><span className={`person-status ${index === 3 ? "pending" : "done"}`}>{index === 3 ? <Clock3 size={13} /> : <Check size={13} />}</span></div>)}</div><button className="invite-button" type="button" onClick={() => setShowInvite(true)}><Send size={15} /> Invite someone</button></div>
            <div className="nudge-card"><div className="nudge-icon"><Sparkles size={17} /></div><div><strong>Keep the momentum going</strong><p>One more vote and we can lock it in.</p></div><button type="button" aria-label="Dismiss suggestion"><X size={16} /></button></div>
          </aside>
        </div>
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation"><a className="active" href="#overview"><Compass size={19} /><span>Overview</span></a><a href="#vote"><Vote size={19} /><span>Vote</span></a><a href="#plan"><CalendarDays size={19} /><span>Plan</span></a><button type="button" onClick={() => setShowInvite(true)}><Users size={19} /><span>Crew</span></button></nav>

      {showInvite && <div className="modal-backdrop" role="presentation" onClick={() => setShowInvite(false)}><div className="invite-modal" role="dialog" aria-modal="true" aria-labelledby="invite-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" type="button" aria-label="Close invite dialog" onClick={() => setShowInvite(false)}><X size={18} /></button><div className="modal-icon"><Send size={20} /></div><h2 id="invite-title">Bring someone along</h2><p>Share this trip link with a friend. They'll be able to vote without making an account.</p><div className="copy-field"><span>weekender.app/june-escape</span><button type="button" onClick={handleCopy}>{copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy link</>}</button></div><button className="modal-done" type="button" onClick={() => setShowInvite(false)}>Done</button></div></div>}
    </div>
  )
}

function ActivityIcon({ type }: { type: string }) {
  if (type === "sun") return <CloudSun size={15} />
  if (type === "coffee") return <span>☕</span>
  if (type === "fork") return <span>✦</span>
  if (type === "tram") return <span>▣</span>
  if (type === "plane") return <span>↗</span>
  if (type === "shop") return <span>⌂</span>
  return <span>⌂</span>
}

export default App
