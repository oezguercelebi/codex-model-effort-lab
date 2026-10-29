import { ChevronLeft, Clock } from "lucide-react"
import { vibeLabels } from "../data"
import { cx } from "../cx"
import { destinationById, formatDuration, supportLabel, votersFor } from "../logic"
import { useTrip } from "../trip"
import { CostPanel, DayList, ModeIcon, WatchList } from "./Shared"

export function Detail({ id }: { id: string }) {
  const trip = useTrip()
  const dest = destinationById(id)
  if (!dest) return null
  const { state, voter, party, standings } = trip
  const yours = state.votes[voter.id] === dest.id
  const voters = votersFor(dest.id, state.votes, state.coming)
  const ahead = standings.ids.length === 1 && standings.ids[0] === dest.id
  const comparing = state.compareIds.includes(dest.id)
  const compareFull = state.compareIds.length >= 3 && !comparing

  return (
    <article className="detail-layout">
      <header className="detail-head">
        <a className="back" href="#/">
          <ChevronLeft aria-hidden="true" size={18} />
          Back to the board
        </a>
        <h1 id="page-title" tabIndex={-1}>
          {dest.name}
        </h1>
        <p className="decision-detail">{dest.tagline}</p>
        <p className="meta">
          <span>{dest.region}</span>
          <span>
            <Clock aria-hidden="true" size={16} />
            {formatDuration(dest.doorToDoorMinutes)} from Austin
          </span>
          <span>
            <ModeIcon mode={dest.transportMode} />
            {dest.travelSummary}
          </span>
          <span>{supportLabel(voters.map((friend) => friend.name), voters.length)}</span>
        </p>
        <p className="vibe-line">{dest.vibes.map((vibe) => vibeLabels[vibe]).join(", ")}</p>
        {ahead ? (
          <p className="fine">{standings.decided ? "This place wins the weekend." : "This place is ahead."}</p>
        ) : null}
        <nav className="inpage" aria-label="On this page">
          <a href="#budget">Budget</a>
          <a href="#travel">Travel</a>
          <a href="#days">Days</a>
        </nav>
      </header>
      <aside className="detail-side">
        <div className="action-stack">
          <button
            type="button"
            className={cx("btn large", yours ? "selected" : "primary")}
            onClick={() => trip.vote(dest.id)}
          >
            {yours ? "Clear vote" : `Vote for ${dest.name}`}
          </button>
          <button
            type="button"
            className="btn large quiet"
            disabled={compareFull}
            onClick={() => trip.toggleCompare(dest.id)}
          >
            {comparing ? "Remove from compare" : compareFull ? "Compare is full" : "Add to compare"}
          </button>
        </div>
        {yours ? <p className="fine">This is {voter.name}&apos;s vote.</p> : null}
        {!state.coming[voter.id] ? (
          <p className="fine">It will not count until {voter.name} is marked as coming.</p>
        ) : null}
        <section id="budget" aria-labelledby="budget-heading">
          <h2 id="budget-heading">Budget</h2>
          <CostPanel dest={dest} party={party} />
        </section>
      </aside>
      <div className="detail-main">
        <p className="summary">{dest.summary}</p>
        <p>{dest.stay}</p>
        <h2>Why this one</h2>
        <WatchList items={dest.highlights} />
        <section id="travel" aria-labelledby="travel-heading">
          <h2 id="travel-heading">Getting there</h2>
          <p>
            {formatDuration(dest.doorToDoorMinutes)} from Austin to the front door. {dest.weather}
          </p>
          <ol className="steps">
            {dest.travelSteps.map((step) => (
              <li key={step.label}>
                <p className="what">{step.label}</p>
                <p>{step.detail}</p>
              </li>
            ))}
          </ol>
        </section>
        <section id="days" aria-labelledby="days-heading">
          <h2 id="days-heading">The days</h2>
          <DayList days={dest.itinerary} />
        </section>
        <section aria-labelledby="before-heading">
          <h2 id="before-heading">Before you go</h2>
          <p>{dest.packing}</p>
          <WatchList items={dest.watchouts} />
        </section>
      </div>
    </article>
  )
}
