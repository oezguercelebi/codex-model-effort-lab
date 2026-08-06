import { useState } from "react"
import { Clock, Info, MapPin, Trophy, Wallet } from "lucide-react"
import type { Destination, ItineraryDay, Member } from "../types"
import { formatBudgetRange, formatDriveTime } from "../lib/format"
import { WEATHER_ICONS } from "../lib/weatherIcons"
import { AvatarStack } from "./Avatar"

export function ItineraryView({
  destinations,
  selectedId,
  onSelect,
  votesFor,
  maxVotes,
}: {
  destinations: Destination[]
  selectedId: string
  onSelect: (id: string) => void
  votesFor: (destinationId: string) => Member[]
  maxVotes: number
}) {
  const destination = destinations.find((d) => d.id === selectedId) ?? destinations[0]
  const [activeDay, setActiveDay] = useState<ItineraryDay["day"]>("Friday")

  const day = destination.itinerary.find((d) => d.day === activeDay) ?? destination.itinerary[0]
  const Icon = destination.icon

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium text-stone-500">Planning for</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {destinations.map((d) => {
            const voters = votesFor(d.id)
            const isLeading = maxVotes > 0 && voters.length === maxVotes
            const isActive = d.id === destination.id
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => onSelect(d.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-amber-500 bg-amber-500 text-white"
                    : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
                }`}
              >
                {isLeading && <Trophy className={`size-3.5 ${isActive ? "text-white" : "text-amber-500"}`} />}
                {d.name}
                <span className={isActive ? "text-white/80" : "text-stone-400"}>· {voters.length}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className={`overflow-hidden rounded-2xl bg-gradient-to-br ${destination.gradient} relative p-6 text-white`}>
        <Icon className="absolute -bottom-6 -right-6 size-36 text-white/20" strokeWidth={1.5} />
        <div className="relative">
          <p className="flex items-center gap-1.5 text-sm font-medium text-white/90">
            <MapPin className="size-4" />
            {destination.region}
          </p>
          <h2 className="mt-1 text-2xl font-bold">{destination.name}</h2>
          <p className="mt-1 text-sm text-white/90">{destination.tagline}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              {formatDriveTime(destination.driveTimeMinutes)}
            </span>
            <span className="flex items-center gap-1.5">
              <Wallet className="size-4" />
              {formatBudgetRange(destination.budget.low, destination.budget.high)} / person
            </span>
            {destination.weather.map((forecast) => {
              const WeatherIcon = WEATHER_ICONS[forecast.condition]
              return (
                <span key={forecast.day} className="flex items-center gap-1.5">
                  <WeatherIcon className="size-4" />
                  {forecast.day} {forecast.high}°
                </span>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {destination.itinerary.map((d) => (
          <button
            key={d.day}
            type="button"
            onClick={() => setActiveDay(d.day)}
            className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
              activeDay === d.day
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
            }`}
          >
            {d.day}
          </button>
        ))}
      </div>

      <div>
        <p className="mb-4 text-sm text-stone-500">{day.summary}</p>
        <ol className="relative space-y-6 border-l border-stone-200 pl-6">
          {day.activities.map((activity) => {
            const ActivityIcon = activity.icon
            return (
              <li key={activity.time + activity.title} className="relative">
                <span className="absolute -left-[calc(1.5rem+9px)] top-0.5 flex size-6 items-center justify-center rounded-full bg-amber-500 text-white ring-4 ring-white">
                  <ActivityIcon className="size-3.5" />
                </span>
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">{activity.time}</p>
                <p className="mt-0.5 font-semibold text-stone-900">{activity.title}</p>
                <p className="mt-0.5 text-sm text-stone-500">{activity.description}</p>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <Info className="size-5 shrink-0 text-amber-600" />
        <p className="text-sm text-amber-900">
          <span className="font-semibold">Good to know:</span> {destination.packingTip}
        </p>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-4">
        <p className="mb-2 text-xs font-medium text-stone-500">Who's in</p>
        <AvatarStack members={votesFor(destination.id)} size="md" max={6} />
      </div>
    </div>
  )
}
