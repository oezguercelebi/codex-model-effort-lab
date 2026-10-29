import { Car, Plane } from "lucide-react"
import type { Destination, ItineraryDay } from "../types"
import { budgetLines, formatMoney, lineColors, perPersonCost } from "../logic"

export function ModeIcon({ mode }: { mode: Destination["transportMode"] }) {
  const Icon = mode === "fly" ? Plane : Car
  return <Icon aria-hidden="true" size={16} />
}

export function CostBar({ dest, party }: { dest: Destination; party: number }) {
  const lines = budgetLines(dest, party)
  const total = lines.reduce((sum, line) => sum + line.amount, 0)
  if (total <= 0) return null
  return (
    <div className="bar" aria-hidden="true">
      {lines.map((line) => (
        <span
          key={line.id}
          style={{ width: `${(line.amount / total) * 100}%`, background: lineColors[line.id] }}
        />
      ))}
    </div>
  )
}

export function CostPanel({ dest, party }: { dest: Destination; party: number }) {
  if (party < 1) {
    return <p>Mark someone as coming to split lodging and the shared ride.</p>
  }
  const lines = budgetLines(dest, party)
  const each = perPersonCost(dest, party)
  const airfare =
    dest.personalTransport > 0
      ? `, plus ${formatMoney(dest.personalTransport)} in airfare for each person`
      : ""
  return (
    <div className="cost-panel">
      <p className="cost-total">
        <span>{formatMoney(each)}</span>
        <span>each</span>
      </p>
      <p className="cost-group">
        {formatMoney(each * party)} for {party} {party === 1 ? "person" : "people"}.
      </p>
      <CostBar dest={dest} party={party} />
      <dl className="cost-lines">
        {lines.map((line) => (
          <div key={line.id}>
            <dt>
              <span className="swatch" style={{ background: lineColors[line.id] }} aria-hidden="true" />
              <span>
                {line.label}
                <small>{line.note}</small>
              </span>
            </dt>
            <dd>{formatMoney(line.amount)}</dd>
          </div>
        ))}
      </dl>
      <p className="fine">
        {dest.lodgingLabel} is {formatMoney(dest.lodgingTotal)} in total. {dest.transportLabel} is{" "}
        {formatMoney(dest.sharedTransportTotal)}
        {airfare}. Food and activities are estimated per person. Sample prices for this October
        weekend, not a live search.
      </p>
    </div>
  )
}

export function DayList({ days }: { days: ItineraryDay[] }) {
  return (
    <div className="days">
      {days.map((day) => (
        <section key={day.id} className="day" aria-labelledby={`day-${day.id}`}>
          <header className="day-head">
            <h3 id={`day-${day.id}`}>{day.label}</h3>
            <p>{day.date}</p>
          </header>
          <ol>
            {day.blocks.map((block) => (
              <li key={`${block.time}-${block.title}`}>
                <p className="when">{block.time}</p>
                <div>
                  <p className="what">{block.title}</p>
                  <p>{block.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}

export function WatchList({ items }: { items: string[] }) {
  return (
    <ul className="plain-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
