import { useMemo, useState } from "react"
import { Heart, Info, PiggyBank, Rabbit } from "lucide-react"
import {
  CHEAPEST_ID,
  COST_CATEGORIES,
  DESTINATIONS,
  FASTEST_ID,
  MAX_TOTAL,
  TRIP,
  eur,
  totalCost,
  type Destination,
  type Person,
} from "../data"
import { Chip, SectionHeading, SegmentedControl } from "./ui"

type SortKey = "cost" | "time" | "votes"

interface CompareViewProps {
  tally: Record<string, Person[]>
  leaderId: string
  onOpen: (id: string) => void
}

export default function CompareView({ tally, leaderId, onOpen }: CompareViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>("cost")

  const sorted = useMemo(() => {
    const list = [...DESTINATIONS]
    if (sortKey === "cost") list.sort((a, b) => totalCost(a) - totalCost(b))
    if (sortKey === "time") list.sort((a, b) => a.travel.minutes - b.travel.minutes)
    if (sortKey === "votes")
      list.sort((a, b) => tally[b.id].length - tally[a.id].length || totalCost(a) - totalCost(b))
    return list
  }, [sortKey, tally])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Side by side"
          title="What each weekend really costs"
          description={`Per person for ${TRIP.nights} nights from ${TRIP.origin} — transport, a shared place to sleep, food, and the fun stuff.`}
        />
        <SegmentedControl<SortKey>
          label="Sort destinations"
          value={sortKey}
          onChange={setSortKey}
          options={[
            { value: "cost", label: "Price" },
            { value: "time", label: "Travel time" },
            { value: "votes", label: "Votes" },
          ]}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-hidden>
        {COST_CATEGORIES.map((c) => (
          <span key={c.key} className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600">
            <span className="h-2.5 w-2.5 rounded-[3px]" style={{ backgroundColor: c.color }} />
            {c.label}
          </span>
        ))}
      </div>

      <ol className="space-y-3">
        {sorted.map((dest, i) => (
          <li key={dest.id} className="anim-rise" style={{ animationDelay: `${i * 35}ms` }}>
            <CompareRow
              dest={dest}
              rank={i + 1}
              votes={tally[dest.id].length}
              isLeader={dest.id === leaderId}
              onOpen={() => onOpen(dest.id)}
            />
          </li>
        ))}
      </ol>

      <p className="flex items-start gap-2 text-xs leading-5 text-stone-400">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
        Estimates from typical October prices: return transport, two nights in a shared rental,
        meals out, and the headline activities. Your card may vary — your memories won't.
      </p>
    </div>
  )
}

function CompareRow({
  dest,
  rank,
  votes,
  isLeader,
  onOpen,
}: {
  dest: Destination
  rank: number
  votes: number
  isLeader: boolean
  onOpen: () => void
}) {
  const total = totalCost(dest)
  const TravelIcon = dest.travel.icon
  const WeatherIcon = dest.weather.icon
  return (
    <button
      onClick={onOpen}
      className="block w-full rounded-2xl border border-stone-200/70 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-px hover:border-stone-300 hover:shadow-md sm:p-5"
      aria-label={`Open details for ${dest.name}, total ${eur(total)} per person`}
    >
      <div className="flex items-center gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-stone-100 text-xs font-semibold text-stone-500">
          {rank}
        </span>
        <span className="min-w-0 flex-1 truncate">
          <span className="font-semibold tracking-tight text-stone-900">
            {dest.name} <span aria-hidden>{dest.flag}</span>
          </span>
          <span className="ml-2 hidden text-xs text-stone-400 sm:inline">{dest.country}</span>
        </span>
        {dest.id === CHEAPEST_ID && (
          <span className="hidden items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 sm:inline-flex">
            <PiggyBank className="h-3 w-3" aria-hidden /> Best value
          </span>
        )}
        {dest.id === FASTEST_ID && (
          <span className="hidden items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700 sm:inline-flex">
            <Rabbit className="h-3 w-3" aria-hidden /> Quickest hop
          </span>
        )}
        <span className="shrink-0 text-right">
          <span className="block text-lg font-semibold tracking-tight text-stone-900">{eur(total)}</span>
          <span className="block text-[11px] leading-3 text-stone-400">per person</span>
        </span>
      </div>

      {/* stacked cost bar — lengths comparable across rows, 2px surface gaps between segments */}
      <div
        className="mt-3.5 flex h-3.5 w-full gap-[2px]"
        role="img"
        aria-label={COST_CATEGORIES.map((c) => `${c.label} ${eur(dest.costs[c.key])}`).join(", ")}
      >
        {COST_CATEGORIES.map((c, i) => (
          <span
            key={c.key}
            title={`${c.label}: ${eur(dest.costs[c.key])}`}
            className={`h-full transition-all duration-500 ${i === COST_CATEGORIES.length - 1 ? "rounded-r-[4px]" : ""}`}
            style={{
              width: `${(dest.costs[c.key] / MAX_TOTAL) * 100}%`,
              backgroundColor: c.color,
            }}
          />
        ))}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {COST_CATEGORIES.map((c) => (
          <span key={c.key} className="inline-flex items-center gap-1.5 text-xs tabular-nums text-stone-500">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} aria-hidden />
            {eur(dest.costs[c.key])}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-stone-100 pt-3">
        <Chip icon={TravelIcon}>{dest.travel.duration}</Chip>
        <Chip icon={WeatherIcon}>
          {dest.weather.tempC}° · {dest.weather.summary}
        </Chip>
        <Chip icon={Heart} className={isLeader ? "border-orange-200 bg-orange-50 text-orange-700" : ""}>
          {votes} {votes === 1 ? "vote" : "votes"}
          {isLeader ? " · leading" : ""}
        </Chip>
      </div>
    </button>
  )
}
