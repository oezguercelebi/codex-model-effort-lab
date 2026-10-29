import { ArrowLeftRight, CalendarDays, LayoutList } from "lucide-react"
import { friends, tripFrom, tripWhen } from "../data"
import { cx } from "../cx"
import { joinNames } from "../logic"
import { destinationById } from "../logic"
import { useTrip } from "../trip"
import { Board } from "./Board"
import { Compare } from "./Compare"
import { Detail } from "./Detail"
import { Plan } from "./Plan"

const nav = [
  { name: "board" as const, href: "#/", label: "Board", icon: LayoutList },
  { name: "compare" as const, href: "#/compare", label: "Compare", icon: ArrowLeftRight },
  { name: "plan" as const, href: "#/plan", label: "Itinerary", icon: CalendarDays },
]

export function Shell() {
  const trip = useTrip()
  const { route, state, notice, restoreArmed } = trip
  const selectedNames = state.compareIds.map((id) => destinationById(id)?.name ?? id)
  const showTray = state.compareIds.length > 0 && route.name !== "compare"

  return (
    <div className={cx("app", showTray && "has-tray")}>
      <a className="skip" href="#content">
        Skip to content
      </a>
      <header className="site-header">
        <div className="wrap header-row">
          <a className="brand" href="#/">
            Weekender
            <small>
              {tripWhen}, from {tripFrom}
            </small>
          </a>
          <nav className="primary-nav" aria-label="Primary">
            {nav.map((item) => (
              <a key={item.name} href={item.href} aria-current={route.name === item.name ? "page" : undefined}>
                {item.label}
                {item.name === "compare" && state.compareIds.length > 0 ? ` (${state.compareIds.length})` : ""}
              </a>
            ))}
          </nav>
          <fieldset className="voter">
            <legend>
              Voting as <strong>{trip.voter.name}</strong>
            </legend>
            <div className="voter-options">
              {friends.map((friend) => (
                <label key={friend.id} className={cx(state.voterId === friend.id && "is-selected")}>
                  <input
                    type="radio"
                    name="voter"
                    checked={state.voterId === friend.id}
                    onChange={() => trip.setVoter(friend.id)}
                  />
                  <span className="initial" style={{ background: friend.color }}>
                    {friend.initial}
                  </span>
                  <span className="vname">{friend.name}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </header>
      <main id="content" className="wrap page">
        {notice ? (
          <p className="notice" role="status">
            {notice}
          </p>
        ) : null}
        {route.name === "board" ? <Board /> : null}
        {route.name === "detail" ? <Detail id={route.id} /> : null}
        {route.name === "compare" ? <Compare /> : null}
        {route.name === "plan" ? <Plan /> : null}
        <footer className="site-footer">
          <p>Votes and filters stay in this browser. Sample prices, not a live search.</p>
          {restoreArmed ? (
            <div className="restore-confirm">
              <p>Restore the original votes and clear filters?</p>
              <button type="button" className="btn primary" onClick={trip.restore}>
                Restore sample trip
              </button>
              <button type="button" className="btn quiet" onClick={() => trip.armRestore(false)}>
                Keep my changes
              </button>
            </div>
          ) : (
            <button type="button" className="btn quiet" onClick={() => trip.armRestore(true)}>
              Restore sample trip
            </button>
          )}
        </footer>
      </main>
      {showTray ? (
        <div className="compare-tray">
          <div className="wrap tray-inner">
            <p>
              {joinNames(selectedNames)} selected.
              {selectedNames.length < 2 ? " Add one more to compare them." : ""}
            </p>
            <div className="tray-actions">
              <a className="btn primary" href="#/compare">
                Compare
              </a>
              <button type="button" className="btn quiet" onClick={trip.clearCompare}>
                Clear
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <nav className="bottom-nav" aria-label="Primary">
        {nav.map((item) => {
          const Icon = item.icon
          return (
            <a key={item.name} href={item.href} aria-current={route.name === item.name ? "page" : undefined}>
              <Icon aria-hidden="true" size={20} />
              <span>
                {item.label}
                {item.name === "compare" && state.compareIds.length > 0 ? (
                  <span className="nav-count">{state.compareIds.length}</span>
                ) : null}
              </span>
            </a>
          )
        })}
      </nav>
    </div>
  )
}
