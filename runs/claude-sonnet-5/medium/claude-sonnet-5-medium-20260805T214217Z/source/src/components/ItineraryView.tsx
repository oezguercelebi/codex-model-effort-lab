import { Clock, MapPin, Trophy, Users } from "lucide-react"
import type { Destination, Friend } from "../types"
import { AvatarStack } from "./AvatarStack"
import { DestinationIcon } from "./icons"

export function ItineraryView({
  destination,
  voters,
  totalVoters,
  isTie,
  tiedNames,
}: {
  destination: Destination
  voters: Friend[]
  totalVoters: number
  isTie: boolean
  tiedNames: string[]
}) {
  const total = Object.values(destination.budget).reduce((a, b) => a + b, 0)

  return (
    <div className="mx-auto max-w-3xl">
      {isTie && (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          It's a tie between <strong>{tiedNames.join(" and ")}</strong>! Showing the itinerary for{" "}
          <strong>{destination.name}</strong> for now — cast another vote to break the tie.
        </div>
      )}

      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${destination.gradient} p-6 text-white sm:p-8`}>
        <DestinationIcon icon={destination.icon} className="absolute -bottom-8 -right-8 h-44 w-44 text-white/20" />
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">
          <Trophy className="h-3.5 w-3.5" /> Trip winner
        </span>
        <h2 className="mt-3 text-3xl font-bold">{destination.name}</h2>
        <p className="text-white/85">{destination.region}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" /> {voters.length} of {totalVoters} votes
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> ${total} per person
          </span>
        </div>
        <div className="mt-4">
          <AvatarStack voters={voters} size="md" />
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {destination.itinerary.map((day) => (
          <div key={day.day} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <div className="flex items-center justify-between bg-stone-50 px-5 py-3">
              <h3 className="font-bold text-stone-900">{day.day}</h3>
              <span className="text-sm text-stone-500">{day.label}</span>
            </div>
            <ol className="divide-y divide-stone-100">
              {day.items.map((item) => (
                <li key={item.time + item.activity} className="flex gap-4 px-5 py-3.5">
                  <span className="flex w-20 shrink-0 items-center gap-1.5 text-sm font-medium text-stone-500">
                    <Clock className="h-3.5 w-3.5" /> {item.time}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{item.activity}</p>
                    <p className="text-sm text-stone-500">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  )
}
