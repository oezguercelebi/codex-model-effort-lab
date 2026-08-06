import { useMemo, useState } from "react"
import {
  ArrowLeftRight,
  Backpack,
  Lock,
  ListChecks,
  MapPin,
  Sparkles,
  Trophy,
  Undo2,
} from "lucide-react"
import { destinationById, destinations } from "../data/destinations"
import { itineraryByDestination } from "../data/itineraries"
import { crew, weekendLabel } from "../data/trip"
import { budgetFor, selectedTravel, standings } from "../lib/compute"
import { currency, minutesToLabel } from "../lib/format"
import type { ItineraryItem } from "../types"
import { useTrip } from "../state/TripContext"
import { DestinationArt } from "../components/DestinationArt"
import { CostStack } from "../components/BudgetPanel"
import {
  Avatar,
  Button,
  CheckItem,
  Eyebrow,
  EmptyState,
  KIND_STYLES,
  TravelIcon,
} from "../components/ui"

function effective(item: ItineraryItem, swapped: boolean) {
  if (swapped && item.alt) return { ...item.alt, id: item.id, time: item.time, swapped: true }
  return { ...item, swapped: false }
}

export function PlanView() {
  const { state, plan, set, dispatch, voteBook, setView, toast } = useTrip()
  const board = useMemo(() => standings(destinations, plan, voteBook), [plan, voteBook])
  const leaderId = board[0]?.destination.id ?? null
  const activeId = state.lockedId ?? leaderId
  const destination = activeId ? destinationById.get(activeId) : undefined
  const itinerary = activeId ? itineraryByDestination.get(activeId) : undefined
  const [dayIndex, setDayIndex] = useState(0)

  if (!destination || !itinerary) {
    return (
      <EmptyState
        icon={<MapPin className="h-5 w-5" strokeWidth={1.8} />}
        title="No plan yet"
        body="Once the group votes on a weekend, the full Friday-to-Sunday plan shows up here."
        action={<Button variant="primary" onClick={() => setView("vote")}>Go to the vote</Button>}
      />
    )
  }

  const locked = state.lockedId === destination.id
  const budget = budgetFor(destination, plan)
  const travel = selectedTravel(destination, plan.travelChoices)
  const day = itinerary.days[Math.min(dayIndex, itinerary.days.length - 1)]

  const plannedTotal = itinerary.days.reduce(
    (sum, d) =>
      sum + d.items.reduce((s, item) => s + effective(item, !!state.swaps[item.id]).costPerPerson, 0),
    0,
  )
  const onTheGroundBudget = budget.food + budget.activities
  const dayTotal = day.items.reduce(
    (s, item) => s + effective(item, !!state.swaps[item.id]).costPerPerson,
    0,
  )
  const checkedCount = itinerary.bookNow.filter((b) => state.checklist[b.id]).length

  return (
    <div className="space-y-5">
      <section className="wk-rise relative overflow-hidden rounded-2xl border border-line bg-card">
        <DestinationArt destination={destination} className="absolute inset-0 h-full w-full opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/88 to-card/55" aria-hidden />
        <div className="relative p-5 sm:p-7">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold uppercase tracking-wide ${
              locked ? "bg-pine text-white" : "bg-gold text-white"
            }`}
          >
            {locked ? (
              <>
                <Lock className="h-3 w-3" strokeWidth={2.4} /> Locked in
              </>
            ) : (
              <>
                <Trophy className="h-3 w-3" strokeWidth={2.4} /> Leading — not locked yet
              </>
            )}
          </span>
          <h1 className="mt-3 font-display text-[34px] leading-tight tracking-tight text-ink sm:text-[42px]">
            {destination.name}
          </h1>
          <p className="mt-1 text-[14px] font-medium text-ink-2">
            {weekendLabel(plan.nights)} · {plan.nights} nights · {crew.length} of you
          </p>
          <p className="mt-3 max-w-2xl text-[14.5px] leading-7 text-ink-2">{itinerary.intro}</p>
          {plan.nights >= 3 ? (
            <p className="mt-2 max-w-2xl text-[13px] leading-6 text-ink-3">
              You're heading out Thursday evening on this setup — the plan below covers Friday to
              Sunday, so Thursday night is yours.
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex -space-x-2">
              {crew.map((m) => (
                <Avatar key={m.id} member={m} size="sm" ring />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
              <span className="text-ink-2">
                <span className="font-semibold text-ink">{currency(budget.total)}</span> per person
              </span>
              <span className="inline-flex items-center gap-1.5 text-ink-2">
                <TravelIcon mode={travel.mode} className="h-3.5 w-3.5" />
                {travel.label} · {minutesToLabel(travel.minutes)}
              </span>
            </div>
            {!locked ? (
              <Button
                variant="primary"
                onClick={() => {
                  set({ lockedId: destination.id })
                  toast(`${destination.name} is locked in`, { tone: "success" })
                }}
              >
                <Lock className="h-4 w-4" strokeWidth={2} />
                Lock it in
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-line bg-card p-4 sm:p-5">
          <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1" role="tablist" aria-label="Days">
            {itinerary.days.map((d, i) => (
              <button
                key={d.id}
                type="button"
                role="tab"
                aria-selected={i === dayIndex}
                onClick={() => setDayIndex(i)}
                className={`flex-1 shrink-0 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  i === dayIndex ? "bg-ink text-paper" : "bg-paper text-ink-2 hover:bg-sand"
                }`}
              >
                <span className="block text-[14px] font-semibold">{d.label}</span>
                <span
                  className={`block text-[11.5px] ${i === dayIndex ? "text-paper/70" : "text-ink-3"}`}
                >
                  {d.dayName}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[13.5px] text-ink-2">{day.subtitle}</p>
            <p className="text-[12.5px] text-ink-3">
              <span className="font-semibold text-ink">{currency(dayTotal)}</span> planned today
            </p>
          </div>

          <ol className="mt-4 space-y-1">
            {day.items.map((item, i) => {
              const swapped = !!state.swaps[item.id]
              const view = effective(item, swapped)
              const kind = KIND_STYLES[view.kind]
              return (
                <li key={item.id} className="relative flex gap-3.5 pb-5 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-card ${
                        view.swapped ? "bg-clay" : "bg-line-2"
                      }`}
                    />
                    {i < day.items.length - 1 ? (
                      <span className="mt-1 w-px flex-1 bg-line" aria-hidden />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                      <span className="text-[12.5px] font-semibold tabular-nums text-ink-3">
                        {view.time}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide ${kind.className}`}
                      >
                        {kind.label}
                      </span>
                      {view.costPerPerson > 0 ? (
                        <span className="text-[12px] font-medium tabular-nums text-ink-3">
                          {currency(view.costPerPerson)} each
                        </span>
                      ) : null}
                      <span className="text-[12px] text-ink-3">{view.durationLabel}</span>
                    </div>
                    <h3 className="mt-1 text-[15px] font-semibold leading-snug text-ink">
                      {view.title}
                    </h3>
                    <p className="mt-0.5 text-[13.5px] leading-6 text-ink-2">{view.detail}</p>
                    {item.alt ? (
                      <button
                        type="button"
                        onClick={() => {
                          dispatch({ type: "toggleSwap", id: item.id })
                          toast(
                            swapped
                              ? `Back to "${item.title}"`
                              : `Swapped in "${item.alt?.title ?? ""}"`,
                            { tone: "success" },
                          )
                        }}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-paper px-2.5 py-1.5 text-[12.5px] font-medium text-ink-2 transition-colors hover:bg-sand hover:text-ink"
                      >
                        {swapped ? (
                          <>
                            <Undo2 className="h-3.5 w-3.5" strokeWidth={2} />
                            Put back {item.title}
                          </>
                        ) : (
                          <>
                            <ArrowLeftRight className="h-3.5 w-3.5" strokeWidth={2} />
                            Swap for {item.alt.title}
                          </>
                        )}
                      </button>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-line bg-card p-4 sm:p-5">
            <Eyebrow>What it costs</Eyebrow>
            <p className="mt-2 font-display text-3xl leading-none text-ink">
              {currency(budget.total)}
              <span className="ml-1.5 text-[13px] font-sans font-normal text-ink-3">per person</span>
            </p>
            <div className="mt-3">
              <CostStack breakdown={budget} />
            </div>
            <dl className="mt-3.5 space-y-1.5 text-[12.5px]">
              <div className="flex justify-between">
                <dt className="text-ink-3">Group total</dt>
                <dd className="font-medium tabular-nums text-ink">
                  {currency(budget.total * plan.travelers)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-3">Planned on the ground</dt>
                <dd className="font-medium tabular-nums text-ink">{currency(plannedTotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-3">Spare in the food + fun line</dt>
                <dd
                  className={`font-medium tabular-nums ${
                    onTheGroundBudget - plannedTotal >= 0 ? "text-pine" : "text-clay"
                  }`}
                >
                  {currency(onTheGroundBudget - plannedTotal)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-line bg-card p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <Eyebrow>Book these first</Eyebrow>
              <span className="text-[12px] font-medium tabular-nums text-ink-3">
                {checkedCount}/{itinerary.bookNow.length}
              </span>
            </div>
            <div className="mt-1.5 -mx-3">
              {itinerary.bookNow.map((b) => (
                <CheckItem
                  key={b.id}
                  checked={!!state.checklist[b.id]}
                  onChange={() => dispatch({ type: "toggleCheck", id: b.id })}
                  title={b.label}
                  detail={b.detail}
                />
              ))}
            </div>
            {checkedCount === itinerary.bookNow.length ? (
              <p className="mt-2 flex items-center gap-1.5 rounded-xl bg-pine-tint px-3 py-2 text-[12.5px] font-medium text-pine">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                Everything's booked. Go pack.
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-line bg-card p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <Backpack className="h-4 w-4 text-ink-3" strokeWidth={1.9} aria-hidden />
              <Eyebrow>Don't forget</Eyebrow>
            </div>
            <ul className="mt-2.5 space-y-1.5">
              {itinerary.packing.map((p) => (
                <li key={p} className="flex items-start gap-2 text-[13px] leading-6 text-ink-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-line-2" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-paper/60 p-4">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-ink-3" strokeWidth={1.9} aria-hidden />
              <Eyebrow>Still deciding?</Eyebrow>
            </div>
            <p className="mt-2 text-[13px] leading-6 text-ink-2">
              This plan follows whatever is winning. Change your votes and it re-writes itself.
            </p>
            <Button className="mt-3 w-full" onClick={() => setView("vote")}>
              Back to the vote
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
