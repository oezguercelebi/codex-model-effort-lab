import { cx } from "../cx"
import { destinationById, joinNames } from "../logic"
import {
  bestIndex,
  formatDuration,
  formatMoney,
  perPersonCost,
  votersFor,
} from "../logic"
import { useTrip } from "../trip"
import { CostBar } from "./Shared"

export function Compare() {
  const trip = useTrip()
  const { state, party, standings, voter } = trip
  const selected = state.compareIds
    .map((id) => destinationById(id))
    .filter((dest): dest is NonNullable<typeof dest> => Boolean(dest))
  const names = selected.map((dest) => dest.name)

  if (selected.length < 2) {
    return (
      <section className="empty">
        <h1 id="page-title" tabIndex={-1}>
          Choose places to compare
        </h1>
        <p>
          {selected.length === 0
            ? "Pick two or three places on the board. The comparison shows budget, travel time, and who already voted."
            : `${names[0]} is selected. Add one more place on the board to compare them.`}
        </p>
        <a className="btn primary" href="#/">
          Back to the board
        </a>
      </section>
    )
  }

  const costs = selected.map((dest) => (party > 0 ? perPersonCost(dest, party) : Number.POSITIVE_INFINITY))
  const travels = selected.map((dest) => dest.doorToDoorMinutes)
  const voteCounts = selected.map((dest) => votersFor(dest.id, state.votes, state.coming).length)
  const lowest = party > 0 ? bestIndex(costs, "min") : null
  const shortest = bestIndex(travels, "min")
  const mostVotes = bestIndex(voteCounts, "max")

  return (
    <section className="compare-page">
      <h1 id="page-title" tabIndex={-1}>
        {joinNames(names)}
      </h1>
      <p className="decision-detail">
        Side by side for {party === 0 ? "this group" : party === 1 ? "1 person" : `${party} people`}.
        Sample prices, not a live search.
      </p>
      <div className="compare-scroll">
        <table className="compare-table">
          <caption>Budget, travel, and votes for the selected weekends.</caption>
          <thead>
            <tr>
              <th scope="col"> </th>
              {selected.map((dest) => {
                const ahead = standings.ids.length === 1 && standings.ids[0] === dest.id
                const yours = state.votes[voter.id] === dest.id
                return (
                  <th key={dest.id} scope="col">
                    <a href={`#/place/${dest.id}`}>{dest.name}</a>
                    {ahead ? (
                      <span className="mark ahead">{standings.decided ? "Wins" : "Ahead"}</span>
                    ) : null}
                    {yours ? <span className="mark yours">Your vote</span> : null}
                    <span className="th-actions">
                      <button
                        type="button"
                        className={cx("btn", yours ? "selected" : "quiet")}
                        onClick={() => trip.vote(dest.id)}
                      >
                        {yours ? "Clear vote" : "Vote"}
                      </button>
                      <button type="button" className="btn quiet" onClick={() => trip.toggleCompare(dest.id)}>
                        Remove
                      </button>
                    </span>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Each person</th>
              {selected.map((dest, index) => (
                <td key={dest.id} className={cx(lowest === index && "is-best")}>
                  {party < 1 ? (
                    "Add someone coming"
                  ) : (
                    <>
                      <strong>{formatMoney(costs[index])}</strong>
                      {lowest === index ? <small>Lowest</small> : null}
                      <CostBar dest={dest} party={party} />
                    </>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">Whole group</th>
              {selected.map((dest, index) => (
                <td key={dest.id}>{party < 1 ? "Add someone coming" : formatMoney(costs[index] * party)}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">Travel time</th>
              {selected.map((dest, index) => (
                <td key={dest.id} className={cx(shortest === index && "is-best")}>
                  <strong>{formatDuration(dest.doorToDoorMinutes)}</strong>
                  {shortest === index ? <small>Shortest</small> : null}
                  <span className="cell-note">{dest.travelSummary}</span>
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row">Stay</th>
              {selected.map((dest) => (
                <td key={dest.id}>{dest.stay}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">Weather</th>
              {selected.map((dest) => (
                <td key={dest.id}>{dest.weather}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">Food</th>
              {selected.map((dest) => (
                <td key={dest.id}>{dest.foodNote}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">Best if</th>
              {selected.map((dest) => (
                <td key={dest.id}>{dest.bestFor}</td>
              ))}
            </tr>
            <tr>
              <th scope="row">Votes</th>
              {selected.map((dest, index) => {
                const voters = votersFor(dest.id, state.votes, state.coming)
                return (
                  <td key={dest.id} className={cx(mostVotes === index && "is-best")}>
                    <strong>{voteCounts[index]}</strong>
                    {mostVotes === index ? <small>Most votes</small> : null}
                    <span className="cell-note">
                      {voters.length ? voters.map((friend) => friend.name).join(", ") : "No one yet"}
                    </span>
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
