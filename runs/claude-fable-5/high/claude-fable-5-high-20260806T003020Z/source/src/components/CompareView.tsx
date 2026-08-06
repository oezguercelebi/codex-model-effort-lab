import { Medal, Plane, TrainFront } from "lucide-react"
import {
  DESTINATIONS,
  TRIP,
  budgetTotal,
  formatDuration,
  formatEuro,
  type Destination,
} from "../data"
import type { Voter } from "../App"
import { ScoreDots, WeatherBadge, weatherLabel } from "./ui"

interface Row {
  label: string
  best?: (d: Destination, votesById: Record<string, Voter[]>) => number
  bestDir?: "min" | "max"
  render: (d: Destination, votesById: Record<string, Voter[]>) => React.ReactNode
}

const ROWS: Row[] = [
  {
    label: "Group votes",
    best: (d, votes) => votes[d.id]?.length ?? 0,
    bestDir: "max",
    render: (d, votes) => {
      const n = votes[d.id]?.length ?? 0
      return (
        <span className="font-semibold">
          {n} vote{n === 1 ? "" : "s"}
        </span>
      )
    },
  },
  {
    label: "Est. total / person",
    best: (d) => budgetTotal(d.budget),
    bestDir: "min",
    render: (d) => <span className="font-semibold">{formatEuro(budgetTotal(d.budget))}</span>,
  },
  {
    label: "Getting there",
    best: (d) => d.travel.durationMin,
    bestDir: "min",
    render: (d) => {
      const Icon = d.travel.mode === "flight" ? Plane : TrainFront
      return (
        <span className="inline-flex items-center gap-1.5">
          <Icon className="size-4 text-stone-400" aria-hidden />
          <span className="font-semibold">{formatDuration(d.travel.durationMin)}</span>
        </span>
      )
    },
  },
  {
    label: "Route",
    render: (d) => <span className="text-stone-500">{d.travel.detail}</span>,
  },
  {
    label: "Transport",
    best: (d) => d.budget.transport,
    bestDir: "min",
    render: (d) => formatEuro(d.budget.transport),
  },
  {
    label: "Stay · 2 nights",
    best: (d) => d.budget.stay,
    bestDir: "min",
    render: (d) => formatEuro(d.budget.stay),
  },
  {
    label: "Food & drink",
    best: (d) => d.budget.food,
    bestDir: "min",
    render: (d) => formatEuro(d.budget.food),
  },
  {
    label: "Activities",
    best: (d) => d.budget.activities,
    bestDir: "min",
    render: (d) => formatEuro(d.budget.activities),
  },
  {
    label: "Sep weather",
    best: (d) => d.weather.tempC,
    bestDir: "max",
    render: (d) => (
      <span className="inline-flex items-center gap-1.5">
        <WeatherBadge kind={d.weather.kind} tempC={d.weather.tempC} />
        <span className="text-stone-500">{weatherLabel(d.weather.kind)}</span>
      </span>
    ),
  },
  {
    label: "Food scene",
    best: (d) => d.scores.food,
    bestDir: "max",
    render: (d) => <ScoreDots score={d.scores.food} label="Food scene" />,
  },
  {
    label: "Nightlife",
    best: (d) => d.scores.nightlife,
    bestDir: "max",
    render: (d) => <ScoreDots score={d.scores.nightlife} label="Nightlife" />,
  },
  {
    label: "Culture",
    best: (d) => d.scores.culture,
    bestDir: "max",
    render: (d) => <ScoreDots score={d.scores.culture} label="Culture" />,
  },
  {
    label: "Outdoors",
    best: (d) => d.scores.outdoors,
    bestDir: "max",
    render: (d) => <ScoreDots score={d.scores.outdoors} label="Outdoors" />,
  },
]

export function CompareView({
  votesById,
  onOpenDetail,
}: {
  votesById: Record<string, Voter[]>
  onOpenDetail: (id: string) => void
}) {
  const bestIds = ROWS.map((row) => {
    if (!row.best) return null
    const values = DESTINATIONS.map((d) => row.best!(d, votesById))
    const target = row.bestDir === "min" ? Math.min(...values) : Math.max(...values)
    return new Set(DESTINATIONS.filter((_, i) => values[i] === target).map((d) => d.id))
  })

  return (
    <div className="space-y-6">
      <section className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Side by side</h1>
        <p className="mt-2 leading-relaxed text-stone-600">
          Every destination on one screen — budgets, travel time, and what each place does best.
          The <Medal className="inline size-4 text-emerald-600" aria-hidden />{" "}
          <span className="font-medium text-emerald-700">green highlights</span> mark the best
          value in each row. Scroll sideways to see everything.
        </p>
      </section>

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200/70">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 w-40 min-w-40 bg-white p-4 text-left align-bottom text-xs font-semibold uppercase tracking-wide text-stone-400">
                  vs.
                </th>
                {DESTINATIONS.map((d) => (
                  <th key={d.id} className="min-w-32 p-3 pb-4 text-left align-bottom">
                    <button
                      onClick={() => onOpenDetail(d.id)}
                      className="group block w-full text-left"
                      aria-label={`View details for ${d.name}`}
                    >
                      <span
                        className={`mb-2 grid h-14 w-full place-items-center rounded-2xl bg-gradient-to-br ${d.gradient} text-2xl transition-transform group-hover:scale-105`}
                        aria-hidden
                      >
                        {d.emoji}
                      </span>
                      <span className="block font-bold tracking-tight text-stone-900 group-hover:text-amber-700">
                        {d.name}
                      </span>
                      <span className="block text-xs font-normal text-stone-400">
                        {d.flag} {d.country}
                      </span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, ri) => (
                <tr key={row.label} className="border-t border-stone-100">
                  <th className="sticky left-0 z-10 bg-white p-4 text-left text-xs font-semibold text-stone-500">
                    {row.label}
                  </th>
                  {DESTINATIONS.map((d) => {
                    const isBest = bestIds[ri]?.has(d.id) ?? false
                    return (
                      <td
                        key={d.id}
                        className={`p-3 text-stone-700 ${isBest ? "bg-emerald-50/70" : ""}`}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          {row.render(d, votesById)}
                          {isBest && (
                            <Medal className="size-3.5 shrink-0 text-emerald-600" aria-label="Best in row" />
                          )}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
              <tr className="border-t border-stone-100">
                <th className="sticky left-0 z-10 bg-white p-4 text-left text-xs font-semibold text-stone-500">
                  Vibes
                </th>
                {DESTINATIONS.map((d) => (
                  <td key={d.id} className="p-3 align-top text-xs text-stone-500">
                    {d.vibes.join(" · ")}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-stone-400">
        Estimates assume {TRIP.groupSize} people splitting stays, September prices, and booking
        about six weeks out.
      </p>
    </div>
  )
}
