import { useEffect, useMemo, useState } from "react"
import {
  ArrowLeft,
  ArrowUpRight,
  BedDouble,
  Check,
  Clock3,
  Heart,
  MapPin,
  RotateCcw,
  Scale,
  SlidersHorizontal,
  TrainFront,
  Trophy,
  Users,
  Wallet,
  X,
} from "lucide-react"
import {
  BUDGET_MAX,
  BUDGET_MIN,
  DESTINATIONS,
  FRIENDS,
  TRAVEL_MAX,
  TRAVEL_MIN,
  TRIP,
  VIBES,
  budgetTotal,
  formatDuration,
  formatMoney,
  type Destination,
  type Vibe,
} from "./data"

type Screen = "board" | "plan"
type SortKey = "votes" | "budget" | "travel" | "name"
type Stored = { myVote: string | null; checks: string[] }

const STORAGE_KEY = "weekender-october-river"

const SORTS: { id: SortKey; label: string }[] = [
  { id: "votes", label: "Most votes" },
  { id: "budget", label: "Lowest budget" },
  { id: "travel", label: "Shortest trip" },
  { id: "name", label: "A to Z" },
]

function loadStored(): Stored {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { myVote: null, checks: [] }
    const parsed = JSON.parse(raw) as Partial<Stored>
    return {
      myVote: typeof parsed.myVote === "string" ? parsed.myVote : null,
      checks: Array.isArray(parsed.checks)
        ? parsed.checks.filter((item) => typeof item === "string")
        : [],
    }
  } catch {
    return { myVote: null, checks: [] }
  }
}

function tallyVotes(myVote: string | null): Record<string, string[]> {
  const map: Record<string, string[]> = {}
  for (const destination of DESTINATIONS) map[destination.id] = []
  for (const friend of FRIENDS) {
    const choice = friend.you ? myVote : friend.vote
    if (choice && map[choice]) map[choice].push(friend.name)
  }
  return map
}

function leadersOf(votes: Record<string, string[]>): Destination[] {
  const top = Math.max(0, ...DESTINATIONS.map((d) => votes[d.id]?.length ?? 0))
  if (top === 0) return []
  return DESTINATIONS.filter((d) => (votes[d.id]?.length ?? 0) === top)
}

export default function App() {
  const stored = useMemo(loadStored, [])
  const [screen, setScreen] = useState<Screen>("board")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [myVote, setMyVote] = useState<string | null>(stored.myVote)
  const [checks, setChecks] = useState<string[]>(stored.checks)
  const [sort, setSort] = useState<SortKey>("votes")
  const [vibes, setVibes] = useState<Vibe[]>([])
  const [maxBudget, setMaxBudget] = useState(BUDGET_MAX)
  const [maxTravel, setMaxTravel] = useState(TRAVEL_MAX)
  const [query, setQuery] = useState("")
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [planId, setPlanId] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ myVote, checks }))
  }, [myVote, checks])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), 2800)
    return () => window.clearTimeout(id)
  }, [toast])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedId(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const votes = useMemo(() => tallyVotes(myVote), [myVote])
  const leaders = useMemo(() => leadersOf(votes), [votes])
  const votedCount = FRIENDS.filter((friend) => (friend.you ? myVote : friend.vote)).length
  const filtersActive =
    vibes.length > 0 || maxBudget < BUDGET_MAX || maxTravel < TRAVEL_MAX || query.trim().length > 0

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = DESTINATIONS.filter((destination) => {
      if (budgetTotal(destination) > maxBudget) return false
      if (destination.travelMinutes > maxTravel) return false
      if (vibes.length > 0 && !vibes.some((vibe) => destination.vibes.includes(vibe))) return false
      if (!q) return true
      const haystack = `${destination.name} ${destination.place} ${destination.tagline}`.toLowerCase()
      return haystack.includes(q)
    })
    const ranked = [...list]
    ranked.sort((a, b) => {
      if (sort === "budget") return budgetTotal(a) - budgetTotal(b)
      if (sort === "travel") return a.travelMinutes - b.travelMinutes
      if (sort === "name") return a.name.localeCompare(b.name)
      const diff = (votes[b.id]?.length ?? 0) - (votes[a.id]?.length ?? 0)
      if (diff !== 0) return diff
      return budgetTotal(a) - budgetTotal(b)
    })
    return ranked
  }, [maxBudget, maxTravel, query, sort, vibes, votes])

  const selected = DESTINATIONS.find((destination) => destination.id === selectedId) ?? null
  const planDestination =
    DESTINATIONS.find((destination) => destination.id === planId) ??
    leaders[0] ??
    DESTINATIONS[0]

  function castVote(id: string) {
    const destination = DESTINATIONS.find((item) => item.id === id)
    if (!destination) return
    setMyVote((current) => {
      const next = current === id ? null : id
      setToast(next ? `Your vote is in for ${destination.name}.` : "Your vote was cleared.")
      return next
    })
  }

  function toggleCompare(id: string) {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      if (current.length >= 3) {
        setToast("Compare holds three destinations. Remove one to add another.")
        return current
      }
      return [...current, id]
    })
  }

  function toggleCheck(key: string) {
    setChecks((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    )
  }

  function resetFilters() {
    setVibes([])
    setMaxBudget(BUDGET_MAX)
    setMaxTravel(TRAVEL_MAX)
    setQuery("")
  }

  function openPlan(id?: string) {
    if (id) setPlanId(id)
    else if (!planId && leaders[0]) setPlanId(leaders[0].id)
    setScreen("plan")
    setSelectedId(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const compareSet = DESTINATIONS.filter((destination) => compareIds.includes(destination.id))

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="mark" aria-hidden>
            W
          </span>
          <div>
            <p className="eyebrow">Weekender</p>
            <p className="brand-sub">{TRIP.name}</p>
          </div>
        </div>
        <nav className="nav" aria-label="Primary">
          <button
            className={screen === "board" ? "nav-btn is-on" : "nav-btn"}
            onClick={() => {
              setScreen("board")
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
            type="button"
          >
            Shortlist
          </button>
          <button
            className={screen === "plan" ? "nav-btn is-on" : "nav-btn"}
            onClick={() => openPlan()}
            type="button"
          >
            Itinerary
          </button>
        </nav>
        <div className="top-meta">
          <MapPin size={15} aria-hidden />
          <span>
            {TRIP.origin} · {TRIP.dates}
          </span>
        </div>
      </header>

      {screen === "board" ? (
        <main className="page">
          <section className="hero">
            <div>
              <p className="eyebrow">The Saturday Club · {FRIENDS.length} people</p>
              <h1>Choose the weekend before the group chat does.</h1>
              <p className="lede">{TRIP.blurb}</p>
            </div>
            <div className="hero-card">
              <p className="eyebrow">Where the vote stands</p>
              {leaders.length === 0 ? (
                <p className="hero-stat">No votes yet</p>
              ) : leaders.length > 1 ? (
                <>
                  <p className="hero-stat">It’s a tie</p>
                  <p className="muted">
                    {leaders.map((destination) => destination.name).join(" and ")} are level with{" "}
                    {votes[leaders[0].id].length} votes each.
                  </p>
                </>
              ) : (
                <>
                  <p className="hero-stat">{leaders[0].name}</p>
                  <p className="muted">
                    Leading with {votes[leaders[0].id].length} of {FRIENDS.length} votes ·{" "}
                    {formatMoney(budgetTotal(leaders[0]))} per person ·{" "}
                    {formatDuration(leaders[0].travelMinutes)} from Brooklyn
                  </p>
                </>
              )}
              <div className="hero-actions">
                <button className="btn primary" type="button" onClick={() => openPlan()}>
                  <Trophy size={16} aria-hidden />
                  {leaders.length > 1 ? "Review the tie" : "Open the itinerary"}
                </button>
                <p className="fine">
                  {votedCount} of {FRIENDS.length} have voted
                  {myVote ? "" : " · you haven’t yet"}
                </p>
              </div>
            </div>
          </section>

          <div className="layout">
            <aside className={`filters ${filtersOpen ? "is-open" : ""}`}>
              <div className="filters-head">
                <h2>Narrow it</h2>
                <button className="text-btn mobile-only" type="button" onClick={() => setFiltersOpen(false)}>
                  Close
                </button>
              </div>
              <label className="field">
                <span>Search</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Town, river, food…"
                  type="search"
                />
              </label>
              <fieldset>
                <legend>Vibe</legend>
                <div className="chips">
                  {VIBES.map((vibe) => {
                    const on = vibes.includes(vibe)
                    return (
                      <button
                        key={vibe}
                        type="button"
                        aria-pressed={on}
                        className={on ? "chip is-on" : "chip"}
                        onClick={() =>
                          setVibes((current) =>
                            current.includes(vibe)
                              ? current.filter((item) => item !== vibe)
                              : [...current, vibe],
                          )
                        }
                      >
                        {vibe}
                      </button>
                    )
                  })}
                </div>
              </fieldset>
              <label className="field">
                <span>Max budget per person · {formatMoney(maxBudget)}</span>
                <input
                  type="range"
                  min={BUDGET_MIN}
                  max={BUDGET_MAX}
                  step={5}
                  value={maxBudget}
                  onChange={(event) => setMaxBudget(Number(event.target.value))}
                />
                <span className="range-labels">
                  <span>{formatMoney(BUDGET_MIN)}</span>
                  <span>{formatMoney(BUDGET_MAX)}</span>
                </span>
              </label>
              <label className="field">
                <span>Max travel · {formatDuration(maxTravel)}</span>
                <input
                  type="range"
                  min={TRAVEL_MIN}
                  max={TRAVEL_MAX}
                  step={5}
                  value={maxTravel}
                  onChange={(event) => setMaxTravel(Number(event.target.value))}
                />
                <span className="range-labels">
                  <span>{formatDuration(TRAVEL_MIN)}</span>
                  <span>{formatDuration(TRAVEL_MAX)}</span>
                </span>
              </label>
              <button className="btn ghost" type="button" onClick={resetFilters} disabled={!filtersActive}>
                <RotateCcw size={15} aria-hidden />
                Reset filters
              </button>
              <div className="crew">
                <h3>The crew</h3>
                <ul>
                  {FRIENDS.map((friend) => {
                    const choice = friend.you ? myVote : friend.vote
                    const destination = DESTINATIONS.find((item) => item.id === choice)
                    return (
                      <li key={friend.id}>
                        <span className="avatar" aria-hidden>
                          {friend.name.slice(0, 1)}
                        </span>
                        <span>
                          <strong>
                            {friend.name}
                            {friend.you ? " · you" : ""}
                          </strong>
                          <em>{destination ? destination.name : "Still deciding"}</em>
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </aside>

            <section className="board" aria-live="polite">
              <div className="board-bar">
                <p>
                  <strong>{visible.length}</strong> destination{visible.length === 1 ? "" : "s"}
                  {filtersActive ? " match" : " on the shortlist"}
                </p>
                <div className="board-tools">
                  <button
                    className="btn ghost mobile-only"
                    type="button"
                    onClick={() => setFiltersOpen(true)}
                  >
                    <SlidersHorizontal size={15} aria-hidden />
                    Filters
                    {filtersActive ? <span className="dot" aria-label="Filters active" /> : null}
                  </button>
                  <label className="sort">
                    <span className="sr">Sort</span>
                    <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
                      {SORTS.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              {visible.length === 0 ? (
                <div className="empty">
                  <h2>Nothing on the shortlist fits.</h2>
                  <p>Loosen the budget, travel time, or vibe filters to bring towns back.</p>
                  <button className="btn primary" type="button" onClick={resetFilters}>
                    Show every destination
                  </button>
                </div>
              ) : (
                <div className="cards">
                  {visible.map((destination) => (
                    <article key={destination.id} className="card">
                      <button
                        className="card-open"
                        type="button"
                        onClick={() => setSelectedId(destination.id)}
                      >
                        <div className={`scene scene-${destination.scene}`} aria-hidden>
                          <span>{destination.place}</span>
                        </div>
                        <div className="card-body">
                          <div className="card-title">
                            <h2>{destination.name}</h2>
                            <ArrowUpRight size={18} aria-hidden />
                          </div>
                          <p>{destination.tagline}</p>
                          <dl className="stats">
                            <div>
                              <dt>
                                <Wallet size={14} aria-hidden /> Budget
                              </dt>
                              <dd>{formatMoney(budgetTotal(destination))}</dd>
                            </div>
                            <div>
                              <dt>
                                <Clock3 size={14} aria-hidden /> Travel
                              </dt>
                              <dd>{formatDuration(destination.travelMinutes)}</dd>
                            </div>
                            <div>
                              <dt>
                                <Users size={14} aria-hidden /> Votes
                              </dt>
                              <dd>
                                {votes[destination.id].length}
                                <span> / {FRIENDS.length}</span>
                              </dd>
                            </div>
                          </dl>
                          <div className="vote-names">
                            {votes[destination.id].length === 0
                              ? "No votes yet"
                              : votes[destination.id].join(", ")}
                          </div>
                        </div>
                      </button>
                      <div className="card-actions">
                        <button
                          className={myVote === destination.id ? "btn primary" : "btn"}
                          type="button"
                          aria-pressed={myVote === destination.id}
                          onClick={() => castVote(destination.id)}
                        >
                          <Heart size={15} aria-hidden />
                          {myVote === destination.id ? "Your pick" : "Vote"}
                        </button>
                        <button
                          className={compareIds.includes(destination.id) ? "btn is-compare" : "btn"}
                          type="button"
                          aria-pressed={compareIds.includes(destination.id)}
                          onClick={() => toggleCompare(destination.id)}
                        >
                          <Scale size={15} aria-hidden />
                          {compareIds.includes(destination.id) ? "In compare" : "Compare"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      ) : (
        <Plan
          destination={planDestination}
          leaders={leaders}
          votes={votes}
          myVote={myVote}
          checks={checks}
          onPick={(id) => setPlanId(id)}
          onToggleCheck={toggleCheck}
          onBack={() => setScreen("board")}
          onVote={castVote}
        />
      )}

      {compareSet.length > 0 && screen === "board" ? (
        <CompareTray
          destinations={compareSet}
          votes={votes}
          onRemove={toggleCompare}
          onOpen={setSelectedId}
          onClear={() => setCompareIds([])}
        />
      ) : null}

      {selected ? (
        <Detail
          destination={selected}
          voters={votes[selected.id]}
          mine={myVote === selected.id}
          onClose={() => setSelectedId(null)}
          onVote={() => castVote(selected.id)}
          onPlan={() => openPlan(selected.id)}
        />
      ) : null}

      {toast ? (
        <div className="toast" role="status">
          {toast}
        </div>
      ) : null}
    </div>
  )
}

function Detail({
  destination,
  voters,
  mine,
  onClose,
  onVote,
  onPlan,
}: {
  destination: Destination
  voters: string[]
  mine: boolean
  onClose: () => void
  onVote: () => void
  onPlan: () => void
}) {
  const total = budgetTotal(destination)
  return (
    <div className="overlay" role="presentation" onMouseDown={onClose}>
      <article
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={`scene scene-${destination.scene} scene-lg`}>
          <button className="icon-btn" type="button" onClick={onClose} aria-label="Close details">
            <X size={18} />
          </button>
          <p>{destination.place}</p>
        </div>
        <div className="sheet-body">
          <p className="eyebrow">{destination.travelMode}</p>
          <h2 id="detail-title">{destination.name}</h2>
          <p className="lede">{destination.tagline}</p>
          <div className="pill-row">
            {destination.vibes.map((vibe) => (
              <span key={vibe} className="pill">
                {vibe}
              </span>
            ))}
          </div>
          <dl className="detail-stats">
            <div>
              <dt>Per person</dt>
              <dd>{formatMoney(total)}</dd>
            </div>
            <div>
              <dt>Group of {FRIENDS.length}</dt>
              <dd>{formatMoney(total * FRIENDS.length)}</dd>
            </div>
            <div>
              <dt>Door to door</dt>
              <dd>{formatDuration(destination.travelMinutes)}</dd>
            </div>
            <div>
              <dt>Weather</dt>
              <dd>{destination.weather}</dd>
            </div>
          </dl>

          <section>
            <h3>Budget, per person</h3>
            <ul className="budget">
              {destination.budget.map((line) => (
                <li key={line.id}>
                  <div className="budget-row">
                    <span>{line.label}</span>
                    <strong>{formatMoney(line.amount)}</strong>
                  </div>
                  <div className="bar" aria-hidden>
                    <span style={{ width: `${Math.round((line.amount / total) * 100)}%` }} />
                  </div>
                  <p>{line.note}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="split">
            <div>
              <h3>
                <TrainFront size={16} aria-hidden /> Getting there
              </h3>
              <p>{destination.travelNote}</p>
            </div>
            <div>
              <h3>
                <BedDouble size={16} aria-hidden /> Where you sleep
              </h3>
              <p>{destination.lodging}</p>
              <p className="muted">{destination.crowd}</p>
            </div>
          </section>

          <section>
            <h3>Why it’s on the list</h3>
            <ul className="plain">
              {destination.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="callout">{destination.watchout}</p>
          </section>

          <section>
            <h3>Votes</h3>
            <p>{voters.length === 0 ? "Nobody has picked this yet." : voters.join(", ")}</p>
          </section>

          <Itinerary destination={destination} />
        </div>
        <footer className="sheet-foot">
          <button className={mine ? "btn primary" : "btn"} type="button" onClick={onVote}>
            <Heart size={16} aria-hidden />
            {mine ? "Clear my vote" : "Vote for this"}
          </button>
          <button className="btn primary" type="button" onClick={onPlan}>
            See this itinerary
          </button>
        </footer>
      </article>
    </div>
  )
}

function Itinerary({ destination }: { destination: Destination }) {
  return (
    <section>
      <h3>The shape of the weekend</h3>
      <ol className="days">
        {destination.itinerary.map((day) => (
          <li key={day.day}>
            <header>
              <span>
                {day.day} · {day.date}
              </span>
              <strong>{day.title}</strong>
            </header>
            <ul>
              {day.blocks.map((block) => (
                <li key={block.time + block.title}>
                  <time>{block.time}</time>
                  <div>
                    <strong>{block.title}</strong>
                    <p>{block.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Plan({
  destination,
  leaders,
  votes,
  myVote,
  checks,
  onPick,
  onToggleCheck,
  onBack,
  onVote,
}: {
  destination: Destination
  leaders: Destination[]
  votes: Record<string, string[]>
  myVote: string | null
  checks: string[]
  onPick: (id: string) => void
  onToggleCheck: (key: string) => void
  onBack: () => void
  onVote: (id: string) => void
}) {
  const total = budgetTotal(destination)
  const tied = leaders.length > 1
  const isLeader = leaders.some((item) => item.id === destination.id)
  const done = destination.packing.filter((item) => checks.includes(`${destination.id}:${item}`)).length

  return (
    <main className="page plan-page">
      <button className="text-btn" type="button" onClick={onBack}>
        <ArrowLeft size={16} aria-hidden />
        Back to the shortlist
      </button>
      <header className="plan-hero">
        <div>
          <p className="eyebrow">
            {tied && isLeader ? "Tied for the lead" : isLeader ? "Current favorite" : "Alternate plan"}
          </p>
          <h1>{destination.name}</h1>
          <p className="lede">{destination.tagline}</p>
          <p className="muted">
            {TRIP.dates} · {TRIP.nights} nights · leaving {TRIP.origin} ·{" "}
            {formatDuration(destination.travelMinutes)} · {formatMoney(total)} per person
          </p>
        </div>
        <div className={`scene scene-${destination.scene} scene-plan`} aria-hidden>
          <span>{destination.place}</span>
        </div>
      </header>

      {tied ? (
        <div className="tie-note">
          <p>
            The crew is split. Open either itinerary — voting again is what breaks the tie, since everyone
            else has already picked.
          </p>
          <div className="chips">
            {leaders.map((leader) => (
              <button
                key={leader.id}
                className={leader.id === destination.id ? "chip is-on" : "chip"}
                type="button"
                onClick={() => onPick(leader.id)}
              >
                {leader.name} · {votes[leader.id].length}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <section className="tally">
        <h2>Vote tally</h2>
        <ul>
          {DESTINATIONS.map((item) => {
            const count = votes[item.id].length
            const width = `${(count / FRIENDS.length) * 100}%`
            return (
              <li key={item.id}>
                <button type="button" onClick={() => onPick(item.id)} className="tally-btn">
                  <span>{item.name}</span>
                  <span className="tally-track" aria-hidden>
                    <span style={{ width }} />
                  </span>
                  <strong>
                    {count}
                    {myVote === item.id ? " · you" : ""}
                  </strong>
                </button>
              </li>
            )
          })}
        </ul>
        {!myVote ? (
          <button className="btn primary" type="button" onClick={() => onVote(destination.id)}>
            <Heart size={15} aria-hidden />
            Vote for {destination.name}
          </button>
        ) : (
          <p className="fine">Your vote is on {DESTINATIONS.find((item) => item.id === myVote)?.name}.</p>
        )}
      </section>

      <section className="plan-grid">
        <div>
          <h2>Money</h2>
          <p className="plan-total">
            {formatMoney(total)} <span>per person</span>
          </p>
          <p className="muted">
            {formatMoney(total * FRIENDS.length)} for the group of {FRIENDS.length}, before anyone upgrades a
            dinner.
          </p>
          <ul className="budget">
            {destination.budget.map((line) => (
              <li key={line.id}>
                <div className="budget-row">
                  <span>{line.label}</span>
                  <strong>{formatMoney(line.amount)}</strong>
                </div>
                <p>{line.note}</p>
              </li>
            ))}
          </ul>
          <p className="callout">{destination.watchout}</p>
        </div>
        <div>
          <h2>
            Before you leave{" "}
            <span className="fine">
              {done}/{destination.packing.length}
            </span>
          </h2>
          <ul className="checks">
            {destination.packing.map((item) => {
              const key = `${destination.id}:${item}`
              const on = checks.includes(key)
              return (
                <li key={key}>
                  <label>
                    <input type="checkbox" checked={on} onChange={() => onToggleCheck(key)} />
                    <span className={on ? "is-done" : ""}>{item}</span>
                    {on ? <Check size={15} aria-hidden /> : null}
                  </label>
                </li>
              )
            })}
          </ul>
          <h2 className="stay-title">Stay & transit</h2>
          <p>
            <BedDouble size={15} aria-hidden /> {destination.lodging}
          </p>
          <p>
            <TrainFront size={15} aria-hidden /> {destination.travelMode}. {destination.travelNote}
          </p>
        </div>
      </section>

      <Itinerary destination={destination} />
    </main>
  )
}

function CompareTray({
  destinations,
  votes,
  onRemove,
  onOpen,
  onClear,
}: {
  destinations: Destination[]
  votes: Record<string, string[]>
  onRemove: (id: string) => void
  onOpen: (id: string) => void
  onClear: () => void
}) {
  return (
    <section className="compare" aria-label="Comparison">
      <header>
        <h2>Compare</h2>
        <button className="text-btn" type="button" onClick={onClear}>
          Clear
        </button>
      </header>
      <div className="compare-table" role="table">
        <div className="compare-row head" role="row">
          <span role="columnheader"> </span>
          {destinations.map((destination) => (
            <span key={destination.id} role="columnheader">
              <button type="button" onClick={() => onOpen(destination.id)}>
                {destination.name}
              </button>
              <button
                className="icon-btn tiny"
                type="button"
                aria-label={`Remove ${destination.name} from compare`}
                onClick={() => onRemove(destination.id)}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
        {(
          [
            ["Per person", (d: Destination) => formatMoney(budgetTotal(d))],
            ["Group of 6", (d: Destination) => formatMoney(budgetTotal(d) * FRIENDS.length)],
            ["Travel", (d: Destination) => formatDuration(d.travelMinutes)],
            ["Mode", (d: Destination) => d.travelMode],
            ["Votes", (d: Destination) => `${votes[d.id].length} · ${votes[d.id].join(", ") || "—"}`],
            ["Sleep", (d: Destination) => d.lodging],
          ] as const
        ).map(([label, read]) => (
          <div className="compare-row" role="row" key={label}>
            <span role="rowheader">{label}</span>
            {destinations.map((destination) => (
              <span key={destination.id} role="cell">
                {read(destination)}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
