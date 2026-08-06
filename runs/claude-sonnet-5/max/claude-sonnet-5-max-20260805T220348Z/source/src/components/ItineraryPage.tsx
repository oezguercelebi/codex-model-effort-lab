import { useState } from "react"
import { CalendarDays, Check, CircleCheck, Copy, Crown, Hotel, Info, MapPin, Sparkles, Wallet } from "lucide-react"
import { destinations, destinationsById } from "../data/destinations"
import type { Friend, TabKey, VotesState } from "../types"
import type { TripWeekend } from "../utils/dates"
import { formatDateRange } from "../utils/dates"
import { cn, formatBudgetRange, formatCurrency } from "../utils/format"
import { buildShareText } from "../utils/share"
import { getWinner } from "../utils/votes"
import { AvatarStack } from "./AvatarStack"
import { ItineraryTimeline } from "./ItineraryTimeline"
import { StatTile } from "./StatTile"
import { useToast } from "./ToastProvider"

interface ItineraryPageProps {
  votes: VotesState
  friends: Friend[]
  previewDestinationId: string | null
  onPreview: (destinationId: string) => void
  onClearPreview: () => void
  tripWeekend: TripWeekend
  onGoToTab: (tab: TabKey) => void
}

export function ItineraryPage({
  votes,
  friends,
  previewDestinationId,
  onPreview,
  onClearPreview,
  tripWeekend,
  onGoToTab,
}: ItineraryPageProps) {
  const { showToast } = useToast()
  const [copied, setCopied] = useState(false)

  const winner = getWinner(destinations, votes)
  const displayDestination = (previewDestinationId && destinationsById[previewDestinationId]) || winner || destinations[0]
  const isPreviewingOther = winner !== null && displayDestination.id !== winner.id
  const voters = friends.filter((friend) => votes[friend.id] === displayDestination.id)
  const HeroIcon = displayDestination.icon
  const WeatherIcon = displayDestination.weather.icon

  async function handleShare() {
    const text = buildShareText(displayDestination, tripWeekend)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      showToast("Trip summary copied to clipboard", "success")
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast("Couldn't copy automatically — try again", "default")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {winner === null ? (
        <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
          <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
          Nobody's voted yet, so here's a preview of {displayDestination.name}. Cast a vote to lock in the group's plan.
        </div>
      ) : isPreviewingOther ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-amber-900">
            Previewing <span className="font-semibold">{displayDestination.name}</span> — the group's current pick is{" "}
            <span className="font-semibold">{winner.name}</span>.
          </p>
          <button
            type="button"
            onClick={onClearPreview}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100"
          >
            <Crown className="h-3.5 w-3.5" aria-hidden="true" />
            Show {winner.name}'s plan
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <Crown className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            <span className="font-semibold">{winner.name}</span> won the vote — here's the plan.
          </span>
        </div>
      )}

      <div className={cn("relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 sm:p-10", displayDestination.gradient)}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" aria-hidden="true" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-white/80">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm">{displayDestination.region}</span>
            </div>
            <h2 className="mt-1 text-3xl font-semibold text-white sm:text-4xl">{displayDestination.name}</h2>
            <p className="mt-2 max-w-md text-sm text-white/90">{displayDestination.tagline}</p>
            <div className="mt-4 flex items-center gap-2">
              {voters.length > 0 ? (
                <>
                  <AvatarStack friends={voters} max={6} size="sm" />
                  <span className="text-xs font-medium text-white/80">
                    {voters.length} of {friends.length} picked this
                  </span>
                </>
              ) : (
                <span className="text-xs font-medium text-white/70">No votes for this one yet</span>
              )}
            </div>
          </div>
          <HeroIcon className="hidden h-20 w-20 shrink-0 text-white/30 sm:block" strokeWidth={1} aria-hidden="true" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile icon={CalendarDays} label="Dates" value={formatDateRange(tripWeekend.start, tripWeekend.end)} detail="Fri – Sun" />
        <StatTile
          icon={Wallet}
          label="Budget"
          value={formatBudgetRange(displayDestination.budget.low, displayDestination.budget.high)}
          detail="per person"
        />
        <StatTile
          icon={Hotel}
          label="Lodging"
          value={`${formatCurrency(displayDestination.lodging.pricePerNight)}/night`}
          detail={displayDestination.lodging.name}
        />
        <StatTile
          icon={WeatherIcon}
          label="Weather"
          value={`${displayDestination.weather.high}°/${displayDestination.weather.low}°F`}
          detail={displayDestination.weather.condition}
        />
      </div>

      <div className="flex flex-col gap-6 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-col gap-3 border-b border-stone-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-stone-900">The weekend plan</h3>
            <p className="text-sm text-stone-500">Friday evening through Sunday afternoon.</p>
          </div>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 self-start rounded-full border border-stone-200 px-3.5 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 sm:self-auto"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" aria-hidden="true" />
                Copy trip summary
              </>
            )}
          </button>
        </div>

        <ItineraryTimeline days={displayDestination.itinerary} tripStart={tripWeekend.start} />

        <div className="grid grid-cols-1 gap-4 border-t border-stone-100 pt-6 sm:grid-cols-2">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-stone-400">Why this weekend works</h4>
            <ul className="mt-3 space-y-2">
              {displayDestination.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2 text-sm text-stone-700">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-stone-400">Pack for it</h4>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {displayDestination.packingNotes.map((note) => (
                <span key={note} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-600">
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-stone-400">Curious about the other spots?</h4>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {destinations.map((destination) => (
            <button
              key={destination.id}
              type="button"
              onClick={() => onPreview(destination.id)}
              aria-pressed={displayDestination.id === destination.id}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition",
                displayDestination.id === destination.id
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-stone-50",
              )}
            >
              {winner?.id === destination.id && <Crown className="h-3 w-3 text-amber-400" aria-hidden="true" />}
              {destination.name}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onGoToTab("destinations")}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 transition hover:text-stone-900"
        >
          <CircleCheck className="h-4 w-4" aria-hidden="true" />
          Back to compare & vote
        </button>
      </div>
    </div>
  )
}
