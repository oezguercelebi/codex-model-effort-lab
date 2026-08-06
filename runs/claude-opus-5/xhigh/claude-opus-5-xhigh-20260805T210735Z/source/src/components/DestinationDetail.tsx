import { useState, type ReactNode } from "react"
import {
  Check,
  CircleAlert,
  Columns3,
  Footprints,
  Lock,
  MapPin,
  Sun,
  TriangleAlert,
  Users,
} from "lucide-react"
import type { Destination, VoteValue } from "../types"
import { crew, crewById, crewNotes, trip } from "../data/trip"
import { itineraryByDestination } from "../data/itineraries"
import { budgetFor, fitFor, selectedTravel, tallyFor, travelOptions } from "../lib/compute"
import { currency, minutesToLabel } from "../lib/format"
import { useTrip } from "../state/TripContext"
import { BudgetPanel } from "./BudgetPanel"
import { DestinationArt } from "./DestinationArt"
import { FitBadge } from "./DestinationCard"
import {
  Avatar,
  Button,
  Eyebrow,
  Sheet,
  SheetClose,
  TRAVEL_LABELS,
  TravelIcon,
  VibeIcon,
  VoteButtons,
} from "./ui"

type Tab = "overview" | "budget" | "travel" | "plan"

const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "budget", label: "Budget" },
  { key: "travel", label: "Getting there" },
  { key: "plan", label: "The plan" },
]

export function DestinationDetail({ destination }: { destination: Destination }) {
  const { plan, state, set, voteBook, openDestination, toast, setView } = useTrip()
  const [tab, setTab] = useState<Tab>("overview")

  const fit = fitFor(destination, plan)
  const tally = tallyFor(destination.id, voteBook)
  const budget = budgetFor(destination, plan)
  const travel = selectedTravel(destination, plan.travelChoices)
  const vote = state.votes[destination.id]
  const isCompared = state.compare.includes(destination.id)
  const notes = crewNotes[destination.id] ?? []
  const itinerary = itineraryByDestination.get(destination.id)
  const close = () => openDestination(null)

  const castVote = (v: VoteValue) => {
    const previous = state.votes[destination.id]
    const nextVotes = { ...state.votes }
    if (previous === v) delete nextVotes[destination.id]
    else nextVotes[destination.id] = v
    set({ votes: nextVotes })
    toast(
      previous === v ? `Vote cleared for ${destination.name}` : `Vote saved for ${destination.name}`,
      {
        tone: "success",
        action: { label: "Undo", run: () => set({ votes: state.votes }) },
      },
    )
  }

  return (
    <Sheet open onClose={close} labelledBy="destination-detail-title" wide>
      <div className="relative shrink-0">
        <DestinationArt destination={destination} className="h-48 w-full sm:h-56" />
        <div className="absolute right-3 top-3">
          <SheetClose onClose={close} />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5">
          <div>
            <p className="flex items-center gap-1.5 text-[12.5px] font-medium text-white/85">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.9} aria-hidden />
              {destination.region}
            </p>
            <h2
              id="destination-detail-title"
              className="font-display text-[32px] leading-tight tracking-tight text-white sm:text-[38px]"
            >
              {destination.name}
            </h2>
          </div>
          <FitBadge score={fit.score} className="mb-1.5" />
        </div>
      </div>

      <div className="shrink-0 border-b border-line px-3">
        <div className="no-scrollbar flex gap-1 overflow-x-auto" role="tablist" aria-label="Destination sections">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`relative shrink-0 px-3 py-3 text-[13.5px] font-medium transition-colors ${
                tab === t.key ? "text-ink" : "text-ink-3 hover:text-ink-2"
              }`}
            >
              {t.label}
              {tab === t.key ? (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-clay" />
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
        {tab === "overview" ? (
          <div className="wk-fade space-y-6">
            <p className="text-[15px] leading-7 text-ink-2">{destination.summary}</p>

            <div className="flex flex-wrap gap-1.5">
              {destination.vibes.map((v) => (
                <span
                  key={v}
                  className="inline-flex items-center gap-1.5 rounded-full bg-sand px-2.5 py-1 text-[12.5px] font-medium text-ink-2"
                >
                  <VibeIcon vibe={v} />
                  {v}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <StatTile
                icon={<Sun className="h-4 w-4" strokeWidth={1.8} />}
                label="Late September"
                value={`${destination.weather.highF}° / ${destination.weather.lowF}°`}
                detail={destination.weather.label}
              />
              <StatTile
                icon={<Footprints className="h-4 w-4" strokeWidth={1.8} />}
                label="Walkable"
                value={`${destination.walkability}`}
                detail={destination.walkability > 70 ? "Leave the car" : "You'll need wheels"}
              />
              <StatTile
                icon={<Users className="h-4 w-4" strokeWidth={1.8} />}
                label="How busy"
                value={destination.crowd}
                detail="Off-peak weekend"
              />
            </div>

            <section>
              <Eyebrow>Why it fits</Eyebrow>
              <ul className="mt-2.5 space-y-2">
                {fit.reasons.map((r) => (
                  <li key={r.text} className="flex items-start gap-2.5 text-[13.5px] leading-6">
                    {r.tone === "good" ? (
                      <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-pine" strokeWidth={2.6} />
                    ) : (
                      <CircleAlert className="mt-1 h-3.5 w-3.5 shrink-0 text-clay" strokeWidth={2.2} />
                    )}
                    <span className="text-ink-2">{r.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {fit.matchedCrew.map((m) => (
                    <Avatar key={m.id} member={m} size="xs" ring />
                  ))}
                </div>
                <span className="text-[12.5px] text-ink-3">asked for something this has</span>
              </div>
            </section>

            <section>
              <Eyebrow>What you'd actually do</Eyebrow>
              <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
                {destination.highlights.map((h) => (
                  <div key={h.title} className="rounded-xl border border-line bg-paper/60 p-3.5">
                    <p className="text-[13.5px] font-semibold text-ink">{h.title}</p>
                    <p className="mt-1 text-[12.5px] leading-5 text-ink-2">{h.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex items-start gap-2.5 rounded-xl bg-gold-tint px-3.5 py-3">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={2} />
              <p className="text-[13px] leading-6 text-ink-2">
                <span className="font-semibold text-ink">Heads up. </span>
                {destination.headsUp}
              </p>
            </div>

            {notes.length > 0 ? (
              <section>
                <Eyebrow>What the crew said</Eyebrow>
                <ul className="mt-2.5 space-y-2.5">
                  {notes.map((n) => {
                    const member = crewById.get(n.memberId)
                    if (!member) return null
                    return (
                      <li key={n.memberId + n.text} className="flex gap-3">
                        <Avatar member={member} size="sm" />
                        <div className="min-w-0 rounded-xl rounded-tl-sm bg-paper px-3.5 py-2.5">
                          <p className="text-[12px] font-semibold text-ink-3">{member.name}</p>
                          <p className="mt-0.5 text-[13.5px] leading-6 text-ink-2">{n.text}</p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ) : null}
          </div>
        ) : null}

        {tab === "budget" ? (
          <div className="wk-fade">
            <BudgetPanel destination={destination} plan={plan} />
            <p className="mt-5 rounded-xl bg-paper px-3.5 py-3 text-[12.5px] leading-5 text-ink-3">
              Estimates for {plan.travelers} people over {plan.nights} nights, based on late-September
              rates. Change the group size or nights from the trip bar at the top and every number here
              moves with it.
            </p>
          </div>
        ) : null}

        {tab === "travel" ? (
          <div className="wk-fade">
            <Eyebrow>How you'd get there</Eyebrow>
            <p className="mt-1.5 text-[13.5px] leading-6 text-ink-2">
              Door to door from {trip.origin} — including the ride to the station or airport, and
              the wait once you're there.
            </p>
            <div className="mt-4 space-y-2.5">
              {travelOptions(destination).map((option) => {
                const active = option.mode === travel.mode
                return (
                  <button
                    key={option.mode}
                    type="button"
                    onClick={() =>
                      set({
                        travelChoices: { ...state.travelChoices, [destination.id]: option.mode },
                      })
                    }
                    aria-pressed={active}
                    className={`flex w-full items-start gap-3.5 rounded-xl border p-4 text-left transition-all ${
                      active
                        ? "border-clay bg-clay-tint/60 ring-1 ring-clay"
                        : "border-line bg-card hover:border-line-2 hover:bg-paper/60"
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                        active ? "bg-clay text-white" : "bg-sand text-ink-2"
                      }`}
                    >
                      <TravelIcon mode={option.mode} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="text-[14.5px] font-semibold text-ink">{option.label}</span>
                        <span className="text-[13px] font-medium tabular-nums text-ink-2">
                          {minutesToLabel(option.minutes)} · {currency(option.costPerPerson)} return
                        </span>
                      </span>
                      <span className="mt-1 block text-[12.5px] leading-5 text-ink-3">
                        {option.detail}
                      </span>
                      {active ? (
                        <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-clay">
                          <Check className="h-3.5 w-3.5" strokeWidth={2.6} /> Used in the budget
                        </span>
                      ) : null}
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="mt-4 text-[12.5px] leading-5 text-ink-3">
              {TRAVEL_LABELS[travel.mode]} puts {currency(budget.travel)} per person into the travel
              line — {Math.round((budget.travel / budget.total) * 100)}% of the weekend.
            </p>
          </div>
        ) : null}

        {tab === "plan" && itinerary ? (
          <div className="wk-fade">
            <p className="text-[14px] leading-6 text-ink-2">{itinerary.intro}</p>
            <div className="mt-4 space-y-4">
              {itinerary.days.map((day) => (
                <div key={day.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h4 className="font-display text-lg text-ink">{day.label}</h4>
                    <span className="text-[12px] text-ink-3">{day.subtitle}</span>
                  </div>
                  <ul className="mt-2 space-y-1.5 border-l border-line pl-4">
                    {day.items.map((item) => (
                      <li key={item.id} className="relative text-[13.5px] leading-6">
                        <span className="absolute -left-[21px] top-2 h-1.5 w-1.5 rounded-full bg-line-2" />
                        <span className="mr-2 inline-block w-16 shrink-0 text-[12px] font-medium tabular-nums text-ink-3">
                          {item.time}
                        </span>
                        <span className="text-ink-2">{item.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                variant="dark"
                onClick={() => {
                  set({ lockedId: destination.id })
                  close()
                  setView("plan")
                  toast(`${destination.name} is locked in — the plan is live`, { tone: "success" })
                }}
              >
                <Lock className="h-4 w-4" strokeWidth={1.9} />
                Lock this in
              </Button>
              <Button
                onClick={() => {
                  close()
                  setView("plan")
                }}
              >
                Open the full plan
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-line bg-paper/70 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <VoteButtons value={vote} onVote={castVote} />
          <span className="hidden text-[12.5px] text-ink-3 sm:inline">
            {tally.votesCast} of {crew.length} voted · {tally.score > 0 ? `+${tally.score}` : tally.score} points
          </span>
        </div>
        <Button
          variant={isCompared ? "dark" : "secondary"}
          onClick={() => {
            if (!isCompared && state.compare.length >= 3) {
              toast("Comparison holds three — drop one first")
              return
            }
            set({
              compare: isCompared
                ? state.compare.filter((id) => id !== destination.id)
                : [...state.compare, destination.id],
            })
          }}
        >
          <Columns3 className="h-4 w-4" strokeWidth={1.9} />
          {isCompared ? "In comparison" : "Compare"}
        </Button>
      </div>
    </Sheet>
  )
}

function StatTile({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="rounded-xl border border-line bg-paper/60 p-3">
      <div className="flex items-center gap-1.5 text-ink-3">
        {icon}
        <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1.5 text-[17px] font-semibold leading-none text-ink">{value}</p>
      <p className="mt-1 text-[11.5px] leading-4 text-ink-3">{detail}</p>
    </div>
  )
}
