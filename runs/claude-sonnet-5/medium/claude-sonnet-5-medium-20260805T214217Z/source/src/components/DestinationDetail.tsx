import { Car, Check, CloudSun, Plane, Sparkles, Star, TrainFront, X } from "lucide-react"
import type { Destination, Friend } from "../types"
import { AvatarStack } from "./AvatarStack"
import { DestinationIcon } from "./icons"

const BUDGET_LABELS: { key: keyof Destination["budget"]; label: string }[] = [
  { key: "flight", label: "Flight / Travel" },
  { key: "stay", label: "Lodging" },
  { key: "food", label: "Food" },
  { key: "activities", label: "Activities" },
]

export function DestinationDetail({
  destination,
  voters,
  hasYourVote,
  isWinner,
  onClose,
  onToggleVote,
}: {
  destination: Destination
  voters: Friend[]
  hasYourVote: boolean
  isWinner: boolean
  onClose: () => void
  onToggleVote: () => void
}) {
  const total = Object.values(destination.budget).reduce((a, b) => a + b, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div className={`relative h-40 shrink-0 bg-gradient-to-br ${destination.gradient}`}>
          <DestinationIcon
            icon={destination.icon}
            className="absolute -bottom-6 -right-6 h-40 w-40 text-white/20"
          />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm hover:bg-black/45"
          >
            <X className="h-5 w-5" />
          </button>
          {isWinner && (
            <span className="absolute left-4 top-4 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-amber-950 shadow">
              Leading destination
            </span>
          )}
          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="text-2xl font-bold leading-tight">{destination.name}</h2>
            <p className="text-sm text-white/85">{destination.region}</p>
          </div>
          <span className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-1 text-sm font-semibold text-white backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 fill-current" /> {destination.rating}
          </span>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">
          <p className="text-base text-stone-700">{destination.tagline}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {destination.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {destination.travelTimes.flight && (
              <div className="rounded-xl bg-stone-50 p-3 text-center">
                <Plane className="mx-auto h-5 w-5 text-stone-500" />
                <p className="mt-1 text-sm font-semibold text-stone-900">
                  {destination.travelTimes.flight}h
                </p>
                <p className="text-xs text-stone-500">by air</p>
              </div>
            )}
            {destination.travelTimes.drive && (
              <div className="rounded-xl bg-stone-50 p-3 text-center">
                <Car className="mx-auto h-5 w-5 text-stone-500" />
                <p className="mt-1 text-sm font-semibold text-stone-900">
                  {destination.travelTimes.drive}h
                </p>
                <p className="text-xs text-stone-500">by car</p>
              </div>
            )}
            {destination.travelTimes.train && (
              <div className="rounded-xl bg-stone-50 p-3 text-center">
                <TrainFront className="mx-auto h-5 w-5 text-stone-500" />
                <p className="mt-1 text-sm font-semibold text-stone-900">
                  {destination.travelTimes.train}h
                </p>
                <p className="text-xs text-stone-500">by train</p>
              </div>
            )}
            <div className="rounded-xl bg-stone-50 p-3 text-center">
              <CloudSun className="mx-auto h-5 w-5 text-stone-500" />
              <p className="mt-1 text-sm font-semibold text-stone-900">{destination.weather.split(",")[0]}</p>
              <p className="text-xs text-stone-500">forecast</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
              Budget per person
            </h3>
            <div className="mt-2 divide-y divide-stone-100 rounded-xl border border-stone-100">
              {BUDGET_LABELS.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span className="text-stone-600">{label}</span>
                  <span className="font-medium text-stone-900">${destination.budget[key]}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3 text-sm font-bold">
                <span>Total per person</span>
                <span>${total}</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-stone-500">
              <Sparkles className="h-4 w-4" /> Highlights
            </h3>
            <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {destination.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2 rounded-lg bg-stone-50 px-3 py-2 text-sm text-stone-700"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-400" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 text-sm italic text-stone-500">Best for: {destination.bestFor}</p>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-stone-100 p-4 sm:p-5">
          <AvatarStack voters={voters} size="md" />
          <button
            onClick={onToggleVote}
            className={`flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              hasYourVote
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-stone-900 text-white hover:bg-stone-700"
            }`}
          >
            {hasYourVote ? <Check className="h-4 w-4" /> : null}
            {hasYourVote ? "You voted for this" : "Vote for this trip"}
          </button>
        </div>
      </div>
    </div>
  )
}
