import { useState } from "react"
import { destinationById, decisionCopy, joinNames, votersFor } from "../logic"
import { useTrip } from "../trip"
import { CostPanel, DayList, WatchList } from "./Shared"

export function Plan() {
  const trip = useTrip()
  const { standings, state, party } = trip
  const copy = decisionCopy(standings, state.votes, state.coming, state.voterId)
  const [tiePick, setTiePick] = useState<string | null>(null)

  if (standings.coming === 0 || standings.ids.length === 0) {
    return (
      <section className="empty">
        <h1 id="page-title" tabIndex={-1}>
          {copy.title}
        </h1>
        <p>{copy.detail}</p>
        <a className="btn primary" href="#/">
          Go to the board
        </a>
      </section>
    )
  }

  const activeId = standings.ids.includes(tiePick ?? "") ? tiePick! : standings.ids[0]
  const dest = destinationById(activeId)
  if (!dest) return null
  const voters = votersFor(dest.id, state.votes, state.coming)
  const tied = standings.ids.length > 1

  return (
    <article className="detail-layout">
      <header className="detail-head">
        <h1 id="page-title" tabIndex={-1}>
          {tied ? copy.title : dest.name}
        </h1>
        <p className="decision-detail">{tied ? "Choose which plan to read. A new vote will break the tie." : copy.detail}</p>
        {standings.decided ? <p className="fine">This is the weekend.</p> : null}
        {!tied && !standings.decided ? <p className="fine">Votes can still change the lead.</p> : null}
        {tied ? (
          <fieldset className="chip-set tie-set">
            <legend>Tied places</legend>
            <div className="chip-row">
              {standings.ids.map((id) => {
                const name = destinationById(id)?.name ?? id
                return (
                  <label key={id} className="chip">
                    <input
                      type="radio"
                      name="tie"
                      checked={activeId === id}
                      onChange={() => setTiePick(id)}
                    />
                    <span>{name}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        ) : null}
        <p className="fine">Chosen by {joinNames(voters.map((friend) => friend.name))}.</p>
        <a className="text-link" href={`#/place/${dest.id}`}>
          Cost and travel details
        </a>
      </header>
      <aside className="detail-side">
        <h2>Budget</h2>
        <CostPanel dest={dest} party={party} />
        <h2>Packing</h2>
        <p>{dest.packing}</p>
      </aside>
      <div className="detail-main">
        <h2>{tied ? `The days in ${dest.name}` : "The days"}</h2>
        <DayList days={dest.itinerary} />
        <section aria-labelledby="plan-before">
          <h2 id="plan-before">Before you go</h2>
          <WatchList items={dest.watchouts} />
        </section>
      </div>
    </article>
  )
}
