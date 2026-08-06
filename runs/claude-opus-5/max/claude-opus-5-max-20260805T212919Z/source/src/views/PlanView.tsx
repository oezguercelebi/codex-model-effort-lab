import { useMemo, useState } from "react"
import {
  CalendarDays,
  Check,
  Crown,
  Info,
  ListChecks,
  Lock,
  LockOpen,
  Luggage,
  MapPin,
  PartyPopper,
  Users,
  Wallet,
} from "lucide-react"
import { Scenery } from "../components/Scenery"
import { Avatar, AvatarStack, Button, Chip, EmptyState, Meter, SectionHeading } from "../components/ui"
import { MODE_ICON, TAG_CLASS, TAG_ICON, TAG_LABEL, WEATHER_ICON } from "../components/icons"
import { MEMBERS, PREP_TASKS, TRIP_DATES } from "../data/trip"
import { cx, formatDay, money, plural } from "../lib/format"
import { useTrip } from "../state/store"
import { useToast } from "../state/toast"
import type { ItineraryDay } from "../types"

const EXTRA_NIGHT: ItineraryDay = {
  id: "thu",
  label: "Thursday",
  subtitle: "The extra night, straight after work",
  items: [
    {
      time: "18:30",
      title: "Leave as soon as everyone clocks off",
      detail: "The whole point of the third night is arriving before the weekend starts.",
      tag: "travel",
    },
    {
      time: "22:00",
      title: "Drop bags, no plans",
      detail: "Check in, unpack nothing, agree on tomorrow over one drink.",
      tag: "stay",
    },
    {
      time: "22:45",
      title: "Whatever is still open nearby",
      detail: "Something quick and local. Save the good restaurant for Saturday.",
      tag: "food",
      cost: 16,
    },
  ],
}

export function PlanView({
  focusId,
  onFocus,
  onOpen,
}: {
  focusId: string | null
  onFocus: (destinationId: string) => void
  onOpen: (destinationId: string) => void
}) {
  const { state, dispatch, cardById, locked, leader, ranked, crew } = useTrip()
  const { push } = useToast()

  const card = (focusId ? cardById.get(focusId) : undefined) ?? locked ?? leader
  const [activeDay, setActiveDay] = useState<string>("fri")

  const days = useMemo(() => {
    if (!card) return []
    return state.nights === 3 ? [EXTRA_NIGHT, ...card.destination.itinerary] : card.destination.itinerary
  }, [card, state.nights])

  const dayDates: Record<string, Date> = {
    thu: TRIP_DATES.thursday,
    fri: TRIP_DATES.friday,
    sat: TRIP_DATES.saturday,
    sun: TRIP_DATES.sunday,
  }

  if (!card) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="No plan yet"
        body="Vote on a few destinations and the winning weekend gets a full itinerary here."
      />
    )
  }

  const { destination, budget, travel } = card
  const isLocked = state.lockedId === destination.id
  const current = days.find((day) => day.id === activeDay) ?? days[0]
  const Weather = WEATHER_ICON[destination.weather.condition]
  const Mode = MODE_ICON[travel.mode]

  const prepDone = PREP_TASKS.filter((task) => state.prepDone[task.id]).length
  const packedCount = destination.packing.filter(
    (item) => state.packed[`${destination.id}::${item}`],
  ).length
  const kitty = Math.ceil((budget.food + budget.activities) / 10) * 10

  return (
    <div className="space-y-6">
      {/* Header ------------------------------------------------------- */}
      <div className="overflow-hidden rounded-card border border-line bg-surface shadow-soft">
        <div className="relative h-40 sm:h-52">
          <Scenery
            kind={destination.scenery}
            palette={destination.palette}
            seed={destination.id}
            className="size-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-4 sm:p-5">
            <div>
              <div className="mb-2 flex flex-wrap gap-1.5">
                <span
                  className={cx(
                    "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold",
                    isLocked ? "bg-brand text-on-brand" : "bg-white/22 text-white backdrop-blur-sm",
                  )}
                >
                  {isLocked ? <Lock size={11} aria-hidden="true" /> : <Crown size={11} aria-hidden="true" />}
                  {isLocked ? "Locked in" : "Front-runner"}
                </span>
                <span className="rounded-full bg-white/22 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  {formatDay(state.nights === 3 ? TRIP_DATES.thursday : TRIP_DATES.friday)} –{" "}
                  {formatDay(TRIP_DATES.sunday)}
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {destination.name}
              </h2>
              <p className="mt-0.5 text-[13px] text-white/85">
                {destination.country} · {plural(state.nights, "night")} · {crew.length} of you
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AvatarStack members={crew} size={30} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-line p-3 sm:p-4">
          {isLocked ? (
            <Button
              variant="ghost"
              icon={LockOpen}
              onClick={() => {
                dispatch({ type: "lock", destinationId: null })
                push({ message: "Trip unlocked", detail: "Voting is open again." })
              }}
            >
              Unlock the trip
            </Button>
          ) : (
            <Button
              variant="primary"
              icon={PartyPopper}
              onClick={() => {
                dispatch({ type: "lock", destinationId: destination.id })
                push({
                  message: `${destination.name} is locked in`,
                  detail: "Prep list and packing are ready below.",
                  tone: "success",
                })
              }}
            >
              Lock this in
            </Button>
          )}
          <Button variant="secondary" icon={Info} onClick={() => onOpen(destination.id)}>
            Destination details
          </Button>

          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="plan-switch" className="text-[12px] font-semibold text-ink-faint">
              Previewing
            </label>
            <select
              id="plan-switch"
              value={destination.id}
              onChange={(event) => onFocus(event.target.value)}
              className="h-9 rounded-xl border border-line bg-surface px-2.5 text-[13px] font-semibold text-ink outline-none transition hover:border-line-strong focus:border-brand"
            >
              {ranked.map((entry) => (
                <option key={entry.destination.id} value={entry.destination.id}>
                  {entry.destination.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {!isLocked ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-gold/25 bg-gold-soft/60 p-3">
          <Info size={15} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
          <p className="text-[13px] leading-5 text-ink">
            Nothing is locked in yet, so this is a preview of{" "}
            <span className="font-semibold">{destination.name}</span> — currently{" "}
            {state.lockedId ? "your pick" : "the group's favourite"}. Lock it in to make it the plan.
          </p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
        {/* Itinerary ------------------------------------------------- */}
        <section>
          <SectionHeading
            icon={CalendarDays}
            title="The weekend, hour by hour"
            subtitle="Rough, but enough that nobody stands on a street corner arguing about lunch."
          />

          <div className="wk-scroll mb-4 flex gap-2 overflow-x-auto pb-1">
            {days.map((day) => {
              const active = day.id === current.id
              const spend = day.items.reduce((sum, item) => sum + (item.cost ?? 0), 0)
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => setActiveDay(day.id)}
                  aria-pressed={active}
                  className={cx(
                    "flex min-w-[124px] flex-1 flex-col items-start gap-0.5 rounded-xl border px-3.5 py-2.5 text-left transition",
                    active
                      ? "border-brand bg-brand-soft"
                      : "border-line bg-surface hover:border-line-strong",
                  )}
                >
                  <span
                    className={cx(
                      "text-[13px] font-bold",
                      active ? "text-brand" : "text-ink",
                    )}
                  >
                    {day.label}
                  </span>
                  <span className="text-[11px] font-medium text-ink-faint">
                    {dayDates[day.id] ? formatDay(dayDates[day.id]) : ""} · {money(spend)}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="rounded-card border border-line bg-surface p-4 shadow-soft sm:p-5">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h3 className="text-[17px] font-bold text-ink">{current.label}</h3>
                <p className="text-[12.5px] text-ink-soft">{current.subtitle}</p>
              </div>
              <span className="wk-tabular text-[12px] font-semibold text-ink-faint">
                {plural(current.items.length, "stop")} ·{" "}
                {money(current.items.reduce((sum, item) => sum + (item.cost ?? 0), 0))} planned
              </span>
            </div>

            <ol className="relative space-y-1">
              <span
                className="absolute bottom-6 left-[15px] top-3 w-px bg-line"
                aria-hidden="true"
              />
              {current.items.map((item) => {
                const Icon = TAG_ICON[item.tag]
                return (
                  <li key={`${current.id}-${item.time}-${item.title}`} className="relative flex gap-3.5 py-2.5">
                    <span
                      className={cx(
                        "relative z-10 grid size-8 shrink-0 place-items-center rounded-full ring-4 ring-surface",
                        TAG_CLASS[item.tag],
                      )}
                    >
                      <Icon size={14} aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2.5">
                        <span className="wk-tabular text-[12px] font-bold text-brand">
                          {item.time}
                        </span>
                        <span className="text-[14px] font-semibold leading-snug text-ink">
                          {item.title}
                        </span>
                        {item.cost ? (
                          <span className="wk-tabular ml-auto shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-bold text-ink-soft">
                            {money(item.cost)}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 text-[12.5px] leading-5 text-ink-soft">{item.detail}</p>
                      <span className="mt-1.5 inline-block text-[10.5px] font-bold uppercase tracking-wide text-ink-faint">
                        {TAG_LABEL[item.tag]}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ol>

            <p className="mt-3 border-t border-line pt-3 text-[11.5px] leading-4 text-ink-faint">
              Costs shown are per person and already sit inside the{" "}
              {money(destination.dailyFood + destination.dailyActivities)} a day this trip budgets
              for food and doing things.
            </p>
          </div>
        </section>

        {/* Sidebar --------------------------------------------------- */}
        <aside className="space-y-4">
          <div className="rounded-card border border-line bg-surface p-4 shadow-soft">
            <h3 className="flex items-center gap-1.5 text-[13px] font-bold text-ink">
              <Wallet size={14} className="text-brand" aria-hidden="true" />
              What it costs
            </h3>
            <p className="wk-tabular mt-2 text-3xl font-bold tracking-tight text-ink">
              {money(budget.total)}
              <span className="text-sm font-semibold text-ink-faint"> each</span>
            </p>
            <dl className="mt-3 space-y-1.5 text-[12.5px]">
              {[
                ["Getting there", budget.travel],
                ["Where you sleep", budget.lodging],
                ["Eating", budget.food],
                ["Doing things", budget.activities],
              ].map(([label, value]) => (
                <div key={label as string} className="flex justify-between gap-3">
                  <dt className="text-ink-soft">{label}</dt>
                  <dd className="wk-tabular font-semibold text-ink">{money(value as number)}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-3 border-t border-line pt-1.5">
                <dt className="font-semibold text-ink">Whole group</dt>
                <dd className="wk-tabular font-bold text-ink">{money(budget.groupTotal)}</dd>
              </div>
            </dl>
            <div className="mt-3 rounded-xl bg-surface-2 p-3">
              <p className="text-[12px] font-semibold text-ink">Shared kitty: {money(kitty)} each</p>
              <p className="mt-0.5 text-[11px] leading-4 text-ink-soft">
                Covers groceries, tickets and the taxi nobody wants to argue about at 02:00.
              </p>
            </div>
          </div>

          <div className="rounded-card border border-line bg-surface p-4 shadow-soft">
            <h3 className="flex items-center gap-1.5 text-[13px] font-bold text-ink">
              <Mode size={14} className="text-brand" aria-hidden="true" />
              Getting there
            </h3>
            <p className="mt-2 text-[13px] font-semibold text-ink">{travel.label}</p>
            <p className="mt-0.5 text-[12px] leading-5 text-ink-soft">{travel.detail}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Chip icon={MapPin}>From {state.originId[0].toUpperCase() + state.originId.slice(1)}</Chip>
              <Chip icon={Weather}>
                {destination.weather.highC}° / {destination.weather.lowC}°
              </Chip>
              <Chip icon={Users}>{plural(crew.length, "person", "people")}</Chip>
            </div>
          </div>

          <div className="rounded-card border border-line bg-surface p-4 shadow-soft">
            <div className="flex items-center justify-between gap-2">
              <h3 className="flex items-center gap-1.5 text-[13px] font-bold text-ink">
                <ListChecks size={14} className="text-brand" aria-hidden="true" />
                Before we go
              </h3>
              <span className="wk-tabular text-[11px] font-bold text-ink-faint">
                {prepDone}/{PREP_TASKS.length}
              </span>
            </div>
            <Meter value={prepDone} max={PREP_TASKS.length} className="mt-2.5" color="bg-yes" />
            <ul className="mt-3 space-y-1">
              {PREP_TASKS.map((task) => {
                const owner = MEMBERS.find((member) => member.id === task.ownerId)
                const done = Boolean(state.prepDone[task.id])
                const ownerOut = owner ? !(state.attending[owner.id] ?? owner.attending) : false
                return (
                  <li key={task.id}>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "prep", taskId: task.id, value: !done })}
                      aria-pressed={done}
                      className="flex w-full items-start gap-2.5 rounded-xl p-2 text-left transition hover:bg-surface-2"
                    >
                      <span
                        className={cx(
                          "mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-md border transition",
                          done ? "border-yes bg-yes text-white" : "border-line-strong bg-surface",
                        )}
                      >
                        {done ? <Check size={12} aria-hidden="true" /> : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cx(
                            "block text-[12.5px] font-semibold leading-snug",
                            done ? "text-ink-faint line-through" : "text-ink",
                          )}
                        >
                          {task.title}
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-4 text-ink-faint">
                          {task.detail}
                        </span>
                      </span>
                      {owner ? (
                        <span className="flex shrink-0 flex-col items-center gap-0.5">
                          <Avatar member={owner} size={20} dim={ownerOut} />
                          {ownerOut ? (
                            <span className="text-[9px] font-bold text-no">out</span>
                          ) : null}
                        </span>
                      ) : null}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="rounded-card border border-line bg-surface p-4 shadow-soft">
            <div className="flex items-center justify-between gap-2">
              <h3 className="flex items-center gap-1.5 text-[13px] font-bold text-ink">
                <Luggage size={14} className="text-brand" aria-hidden="true" />
                Pack for {destination.name}
              </h3>
              <span className="wk-tabular text-[11px] font-bold text-ink-faint">
                {packedCount}/{destination.packing.length}
              </span>
            </div>
            <ul className="mt-2.5 space-y-1">
              {destination.packing.map((item) => {
                const key = `${destination.id}::${item}`
                const done = Boolean(state.packed[key])
                return (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: "pack", key, value: !done })}
                      aria-pressed={done}
                      className="flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition hover:bg-surface-2"
                    >
                      <span
                        className={cx(
                          "grid size-[18px] shrink-0 place-items-center rounded-md border transition",
                          done ? "border-deep bg-deep text-canvas" : "border-line-strong bg-surface",
                        )}
                      >
                        {done ? <Check size={12} aria-hidden="true" /> : null}
                      </span>
                      <span
                        className={cx(
                          "text-[12.5px] font-medium",
                          done ? "text-ink-faint line-through" : "text-ink",
                        )}
                      >
                        {item}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
