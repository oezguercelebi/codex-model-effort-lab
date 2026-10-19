import { Clock } from "lucide-react"
import { friends, vibeLabels } from "../data"
import { cx } from "../cx"
import {
  BUDGET_FILTERS,
  SORTS,
  TRAVEL_FILTERS,
  decisionCopy,
  destinationById,
  filtersActive,
  formatDuration,
  formatMoney,
  perPersonCost,
  supportLabel,
  visibleDestinations,
  votersFor,
} from "../logic"
import { useTrip } from "../trip"
import { ModeIcon } from "./Shared"
import type { VibeId } from "../types"

export function Board() {
  const trip = useTrip()
  const { state, standings, voter, party } = trip
  const copy = decisionCopy(standings, state.votes, state.coming, state.voterId)
  const places = visibleDestinations(state)
  const filtering = filtersActive(state)
  const uniqueLeader = standings.ids.length === 1 ? standings.ids[0] : null

  return (
    <div className="board">
      <header className="decision">
        <h1 id="page-title" tabIndex={-1}>
          {copy.title}
        </h1>
        <p className="decision-detail">{copy.detail}</p>
        {standings.ids.length > 0 ? (
          <a className="text-link decision-link" href="#/plan">
            See the itinerary
          </a>
        ) : null}
      </header>

      <ul className="crew">
        {friends.map((friend) => {
          const coming = state.coming[friend.id]
          const voteId = state.votes[friend.id]
          const voteName = voteId ? destinationById(voteId)?.name : null
          const pick = !coming
            ? voteName
              ? `Saved: ${voteName}`
              : "Sitting out"
            : voteName ?? "No vote yet"
          return (
            <li key={friend.id} className={cx(!coming && "is-out")}>
              <span className="avatar" style={{ background: friend.color }}>
                {friend.initial}
              </span>
              <span className="crew-name">{friend.name}</span>
              <span className={cx("crew-pick", !voteName && "is-empty")}>{pick}</span>
              <label className="coming-toggle">
                <input
                  type="checkbox"
                  checked={coming}
                  aria-label={`${friend.name} is coming`}
                  onChange={() => trip.toggleComing(friend.id)}
                />
                Coming
              </label>
            </li>
          )
        })}
      </ul>
      <p className="fine crew-note">
        Lodging and the shared ride are split across whoever is marked coming. A vote from someone
        sitting out is saved and does not count.
      </p>
      {!state.coming[voter.id] ? (
        <p className="banner">
          {voter.name} is sitting this one out, so their vote will not count until they are marked
          as coming.
        </p>
      ) : null}

      <div className="filters">
        <fieldset className="chip-set">
          <legend>Budget per person</legend>
          <div className="chip-row">
            {BUDGET_FILTERS.map((option) => (
              <label key={option.id} className="chip">
                <input
                  type="radio"
                  name="budget"
                  checked={state.maxBudget === option.max}
                  onChange={() => trip.setMaxBudget(option.max)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="chip-set">
          <legend>Travel time from Austin</legend>
          <div className="chip-row">
            {TRAVEL_FILTERS.map((option) => (
              <label key={option.id} className="chip">
                <input
                  type="radio"
                  name="travel"
                  checked={state.maxMinutes === option.max}
                  onChange={() => trip.setMaxMinutes(option.max)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="chip-set">
          <legend>Looking for</legend>
          <div className="chip-row">
            {(Object.keys(vibeLabels) as VibeId[]).map((vibe) => (
              <label key={vibe} className="chip">
                <input
                  type="checkbox"
                  checked={state.vibes.includes(vibe)}
                  onChange={() => trip.toggleVibe(vibe)}
                />
                <span>{vibeLabels[vibe]}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="filter-foot">
          <label className="sort">
            <span>Sort by</span>
            <select
              value={state.sort}
              onChange={(event) => trip.setSort(event.target.value as typeof state.sort)}
            >
              {SORTS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {filtering ? (
            <p>
              {places.length === 0
                ? "No places fit."
                : places.length === 1
                  ? "1 place fits."
                  : `${places.length} places fit.`}
            </p>
          ) : null}
        </div>
      </div>

      {state.compareIds.length >= 3 ? (
        <p className="fine">Compare is full. Remove a place to add another.</p>
      ) : null}

      {places.length === 0 ? (
        <div className="empty">
          <h2>Nothing matches</h2>
          <p>Clear the budget, travel time, or the things you are looking for to see the list again.</p>
          <button type="button" className="btn primary" onClick={trip.clearFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="places">
          {places.map((dest) => {
            const voters = votersFor(dest.id, state.votes, state.coming)
            const yours = state.votes[voter.id] === dest.id
            const ahead = uniqueLeader === dest.id
            const comparing = state.compareIds.includes(dest.id)
            const compareFull = state.compareIds.length >= 3 && !comparing
            const each = party > 0 ? perPersonCost(dest, party) : null
            return (
              <li key={dest.id}>
                <article className={cx("place", yours && "is-yours", ahead && !yours && "is-ahead")}>
                  <div className="place-main">
                    <h2>
                      <a href={`#/place/${dest.id}`}>{dest.name}</a>
                      {ahead ? (
                        <span className="mark ahead">{standings.decided ? "Wins" : "Ahead"}</span>
                      ) : null}
                      {yours ? <span className="mark yours">Your vote</span> : null}
                    </h2>
                    <p className="region">{dest.region}</p>
                    <p className="tagline">{dest.tagline}</p>
                    <p className="meta">
                      <span>
                        <Clock aria-hidden="true" size={16} />
                        {formatDuration(dest.doorToDoorMinutes)}
                      </span>
                      <span>
                        <ModeIcon mode={dest.transportMode} />
                        {dest.travelSummary}
                      </span>
                    </p>
                    <p className="support">
                      <span className="avatar-row" aria-hidden="true">
                        {voters.map((friend) => (
                          <span key={friend.id} className="mini-avatar" style={{ background: friend.color }}>
                            {friend.initial}
                          </span>
                        ))}
                      </span>
                      <span>{supportLabel(voters.map((friend) => friend.name), voters.length)}</span>
                    </p>
                  </div>
                  <p className="fare">
                    {each == null ? (
                      <span className="fare-note">Add someone to price this</span>
                    ) : (
                      <>
                        <strong>{formatMoney(each)}</strong>
                        <span>{party === 1 ? "for 1 person" : "each"}</span>
                        {party > 1 ? <span>{formatMoney(each * party)} together</span> : null}
                      </>
                    )}
                  </p>
                  <div className="row-actions">
                    <button
                      type="button"
                      className={cx("btn", yours ? "selected" : "quiet")}
                      aria-label={yours ? `Clear ${voter.name}'s vote for ${dest.name}` : `Vote for ${dest.name}`}
                      onClick={() => trip.vote(dest.id)}
                    >
                      {yours ? "Clear vote" : "Vote"}
                    </button>
                    <button
                      type="button"
                      className={cx("btn", comparing ? "selected" : "quiet")}
                      disabled={compareFull}
                      aria-label={
                        comparing
                          ? `Remove ${dest.name} from compare`
                          : compareFull
                            ? "Compare is full"
                            : `Add ${dest.name} to compare`
                      }
                      onClick={() => trip.toggleCompare(dest.id)}
                    >
                      {comparing ? "In compare" : compareFull ? "Compare full" : "Compare"}
                    </button>
                    <a className="btn quiet" href={`#/place/${dest.id}`}>
                      Details
                    </a>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
