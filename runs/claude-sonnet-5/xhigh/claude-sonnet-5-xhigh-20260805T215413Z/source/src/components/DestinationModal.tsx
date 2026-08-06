import { useEffect, useRef } from "react"
import { ArrowRight, Clock, Heart, MapPin, Sparkles, Wallet, X } from "lucide-react"
import type { Destination, Member } from "../types"
import { formatCurrency, formatDriveTime } from "../lib/format"
import { WEATHER_ICONS } from "../lib/weatherIcons"
import { AvatarStack } from "./Avatar"

const BREAKDOWN_LABELS: { key: keyof Destination["budget"]["breakdown"]; label: string; colorClass: string }[] = [
  { key: "lodging", label: "Lodging", colorClass: "bg-amber-500" },
  { key: "food", label: "Food", colorClass: "bg-rose-400" },
  { key: "activities", label: "Activities", colorClass: "bg-teal-500" },
  { key: "transport", label: "Transport", colorClass: "bg-stone-400" },
]

export function DestinationModal({
  destination,
  voters,
  hasYourVote,
  onToggleVote,
  onClose,
  onViewItinerary,
}: {
  destination: Destination
  voters: Member[]
  hasYourVote: boolean
  onToggleVote: () => void
  onClose: () => void
  onViewItinerary: () => void
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const Icon = destination.icon

  useEffect(() => {
    closeButtonRef.current?.focus()
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  const total = Object.values(destination.budget.breakdown).reduce((sum, value) => sum + value, 0)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${destination.name} details`}
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/50 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white shadow-xl sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`relative h-40 w-full overflow-hidden bg-gradient-to-br ${destination.gradient}`}>
          <Icon className="absolute -bottom-6 -right-6 size-36 text-white/25" strokeWidth={1.5} />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-stone-700 hover:bg-white"
          >
            <X className="size-4" />
          </button>
          <div className="absolute bottom-4 left-5 text-white">
            <p className="text-2xl font-bold drop-shadow-sm">{destination.name}</p>
            <p className="flex items-center gap-1 text-sm font-medium text-white/90 drop-shadow-sm">
              <MapPin className="size-3.5" />
              {destination.region}
            </p>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-wrap gap-1.5">
            {destination.vibeTags.map((tag) => (
              <span key={tag} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
                {tag}
              </span>
            ))}
          </div>

          <p className="text-sm leading-6 text-stone-600">{destination.description}</p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-stone-50 p-3">
              <Clock className="mb-1 size-4 text-stone-400" />
              <p className="text-sm font-semibold text-stone-800">{formatDriveTime(destination.driveTimeMinutes)}</p>
              <p className="text-xs text-stone-500">{destination.distanceMiles} mi drive</p>
            </div>
            <div className="rounded-xl bg-stone-50 p-3">
              <Wallet className="mb-1 size-4 text-stone-400" />
              <p className="text-sm font-semibold text-stone-800">{formatCurrency(destination.budget.typical)}</p>
              <p className="text-xs text-stone-500">typical / person</p>
            </div>
            {destination.weather.map((forecast) => {
              const WeatherIcon = WEATHER_ICONS[forecast.condition]
              return (
                <div key={forecast.day} className="rounded-xl bg-stone-50 p-3">
                  <WeatherIcon className="mb-1 size-4 text-stone-400" />
                  <p className="text-sm font-semibold text-stone-800">
                    {forecast.high}° / {forecast.low}°
                  </p>
                  <p className="text-xs text-stone-500">{forecast.day === "Sat" ? "Saturday" : "Sunday"}</p>
                </div>
              )
            })}
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-stone-800">Budget breakdown</p>
            <div className="flex h-3 overflow-hidden rounded-full">
              {BREAKDOWN_LABELS.map(({ key, colorClass }) => (
                <div
                  key={key}
                  className={colorClass}
                  style={{ width: `${(destination.budget.breakdown[key] / total) * 100}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
              {BREAKDOWN_LABELS.map(({ key, label, colorClass }) => (
                <span key={key} className="flex items-center gap-1.5">
                  <span className={`size-2 rounded-full ${colorClass}`} />
                  {label} · {formatCurrency(destination.budget.breakdown[key])}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-stone-800">
              <Sparkles className="size-4 text-amber-500" />
              Highlights
            </p>
            <ul className="space-y-1.5 text-sm text-stone-600">
              {destination.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-400" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 p-3">
            <div>
              <p className="text-xs font-medium text-stone-500">Votes</p>
              <AvatarStack members={voters} size="sm" />
            </div>
            <button
              type="button"
              onClick={onToggleVote}
              aria-pressed={hasYourVote}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                hasYourVote ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-stone-900 text-white hover:bg-stone-700"
              }`}
            >
              <Heart className={`size-4 ${hasYourVote ? "fill-white" : ""}`} />
              {hasYourVote ? "Voted" : "Vote for this trip"}
            </button>
          </div>

          <button
            type="button"
            onClick={onViewItinerary}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white hover:bg-amber-600"
          >
            View full itinerary
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
