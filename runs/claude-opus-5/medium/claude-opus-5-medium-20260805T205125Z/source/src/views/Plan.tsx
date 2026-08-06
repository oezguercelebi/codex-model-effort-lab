import type { ReactNode } from "react"
import {
  AlertTriangle,
  CalendarDays,
  Check,
  Lock,
  LockOpen,
  MapPin,
  Receipt,
  Share2,
  Trophy,
  Users,
} from "lucide-react"
import { consensusPct, formatDateRange, formatHours, formatMoney, weekdayOf } from "../lib/engine"
import { useStore } from "../lib/store"
import type { Destination, Scored } from "../lib/types"
import { Avatar, Button, EmptyState, Meter, Tag, cx } from "../components/ui"
import { Scenery } from "../components/Scenery"
import { ItineraryTimeline, planDays } from "../components/Itinerary"
import { MODE_ICON } from "../components/DestinationCard"

function packingList(d: Destination, nights: number): string[] {
  const base = [
    `Photo ID and cards`,
    `${nights + 1} days of clothes, packed light`,
    "Charger and a power bank",
    "Painkillers and plasters",
  ]
  if (d.vibes.includes("beach")) base.push("Swimwear and a quick-dry towel", "Reef-safe sun cream")
  if (d.vibes.includes("nature")) base.push("Broken-in walking shoes", "Rain shell and a warm layer")
  if (d.vibes.includes("nightlife")) base.push("One outfit you'd wear out")
  if (d.weather.rainChance > 35) base.push("Small umbrella")
  if (d.weather.lowC < 10) base.push("Something warm for the evenings")
  base.push("Group chat pinned with the address")
  return base
}

export function Plan() {
  const { locked, winner, lockIn, setView, settings, origin, members, packed, togglePacked } =
    useStore()
  const item: Scored | null = locked ?? winner
  const isLocked = Boolean(locked)

  if (!item) {
    return (
      <EmptyState
        icon={<Trophy size={20} />}
        title="No destination yet"
        body="Vote on a few options and the plan for the front-runner will appear here."
        action={
          <Button variant="primary" onClick={() => setView("vote")}>
            Go and vote
          </Button>
        }
      />
    )
  }

  const d = item.destination
  const ModeIcon = MODE_ICON[item.travel.mode]
  const items = packingList(d, settings.nights)
  const packedCount = items.filter((i) => packed.includes(i)).length
  const consensus = consensusPct(item.score, Object.keys(item.votes).length)
  const groupTotal = item.cost.total * settings.travelers

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm dark:border-white/10 dark:bg-stone-900">
        <div className="relative h-48 sm:h-60">
          <Scenery destination={d} seed={4} />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <span
                className={cx(
                  "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                  isLocked ? "bg-teal-500 text-white" : "bg-amber-400 text-amber-950",
                )}
              >
                {isLocked ? "Locked in" : "Front-runner"}
              </span>
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                {consensus}% consensus
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {d.name}
            </h1>
            <p className="text-sm text-white/80">
              {d.country} · {formatDateRange(settings.departure, settings.nights)} · from {origin.city}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-stone-200 p-4 sm:p-5 dark:border-white/10">
          <KeyFact icon={<CalendarDays size={14} />} label="Dates">
            {formatDateRange(settings.departure, settings.nights)} · {settings.nights} nights
          </KeyFact>
          <KeyFact icon={<ModeIcon size={14} />} label="Travel">
            {formatHours(item.travel.hours)} each way · {item.travel.distanceKm} km
          </KeyFact>
          <KeyFact icon={<Receipt size={14} />} label="Per person">
            {formatMoney(item.cost.total)}
          </KeyFact>
          <KeyFact icon={<Users size={14} />} label="Group">
            {settings.travelers} people · {formatMoney(groupTotal)}
          </KeyFact>

          <div className="ml-auto flex gap-2">
            <Button
              variant={isLocked ? "secondary" : "primary"}
              onClick={() => lockIn(isLocked ? null : d.id)}
            >
              {isLocked ? <LockOpen size={14} /> : <Lock size={14} />}
              {isLocked ? "Unlock" : "Lock it in"}
            </Button>
            <Button variant="ghost" onClick={() => setView("explore")}>
              <Share2 size={14} /> Change plan
            </Button>
          </div>
        </div>
      </section>

      {!isLocked ? (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-200">
          <AlertTriangle size={16} className="shrink-0" />
          <span className="flex-1">
            Nothing is locked yet — this is just whatever is winning the vote right now.
          </span>
          <Button size="sm" onClick={() => lockIn(d.id)}>
            Lock in {d.name}
          </Button>
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-stone-900">
          <header className="mb-5">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-white">The weekend</h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              A workable shape for {weekdayOf(settings.departure, 0)} to{" "}
              {weekdayOf(settings.departure, settings.nights)}. Move anything.
            </p>
          </header>
          <ItineraryTimeline days={planDays(d.itinerary, settings.nights)} departure={settings.departure} />
          {settings.nights + 1 > d.itinerary.length ? (
            <p className="mt-5 rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-500 dark:bg-white/5 dark:text-stone-400">
              Day {d.itinerary.length + 1} is left open on purpose — keep it for whatever the group
              discovers on day two.
            </p>
          ) : null}
        </section>

        <div className="space-y-5">
          <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-stone-900">
            <h2 className="text-base font-semibold text-stone-900 dark:text-white">Who's in</h2>
            <ul className="mt-3 space-y-2.5">
              {members.map((m) => {
                const v = item.votes[m.id]
                const over = item.cost.total > m.budget
                return (
                  <li key={m.id} className="flex items-center gap-3">
                    <Avatar member={m} size={30} vote={v} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-stone-900 dark:text-white">
                        {m.name}
                      </div>
                      <div className="truncate text-xs text-stone-500 dark:text-stone-400">
                        {v === "in"
                          ? "In"
                          : v === "maybe"
                            ? "On the fence"
                            : v === "out"
                              ? "Voted against"
                              : "Hasn't voted"}
                      </div>
                    </div>
                    {over ? (
                      <Tag tone="warn">{formatMoney(item.cost.total - m.budget)} over</Tag>
                    ) : (
                      <Tag tone="good">in budget</Tag>
                    )}
                  </li>
                )
              })}
            </ul>
            {item.overBudgetFor.length ? (
              <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900 dark:bg-amber-400/10 dark:text-amber-200">
                Switching to a hostel or dropping a night brings this back inside everyone's ceiling.
              </p>
            ) : null}
          </section>

          <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-stone-900">
            <h2 className="text-base font-semibold text-stone-900 dark:text-white">The money</h2>
            <ul className="mt-3 space-y-2">
              {(
                [
                  ["Travel", item.cost.travel],
                  ["Stay", item.cost.lodging],
                  ["Food & drink", item.cost.food],
                  ["Everything else", item.cost.activities],
                ] as const
              ).map(([label, value]) => (
                <li key={label} className="flex items-center justify-between text-sm">
                  <span className="text-stone-600 dark:text-stone-400">{label}</span>
                  <span className="font-medium tabular-nums text-stone-900 dark:text-white">
                    {formatMoney(value)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-stone-200 pt-3 dark:border-white/10">
              <span className="text-sm font-semibold text-stone-900 dark:text-white">Each</span>
              <span className="text-lg font-semibold tabular-nums text-stone-900 dark:text-white">
                {formatMoney(item.cost.total)}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
              <span>{settings.travelers} people, all in</span>
              <span className="tabular-nums">{formatMoney(groupTotal)}</span>
            </div>
          </section>

          <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-stone-900">
            <div className="flex items-baseline justify-between">
              <h2 className="text-base font-semibold text-stone-900 dark:text-white">Packing</h2>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {packedCount}/{items.length}
              </span>
            </div>
            <Meter value={(packedCount / items.length) * 100} className="mt-2" />
            <ul className="mt-3 space-y-1">
              {items.map((entry) => {
                const done = packed.includes(entry)
                return (
                  <li key={entry}>
                    <button
                      type="button"
                      onClick={() => togglePacked(entry)}
                      className="flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 text-left text-sm transition-colors hover:bg-stone-100 dark:hover:bg-white/5"
                    >
                      <span
                        className={cx(
                          "grid h-4 w-4 shrink-0 place-items-center rounded-md border transition-colors",
                          done
                            ? "border-teal-500 bg-teal-500 text-white"
                            : "border-stone-300 dark:border-white/25",
                        )}
                      >
                        {done ? <Check size={11} /> : null}
                      </span>
                      <span
                        className={cx(
                          done
                            ? "text-stone-400 line-through dark:text-stone-500"
                            : "text-stone-700 dark:text-stone-300",
                        )}
                      >
                        {entry}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>

          <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-stone-900">
            <h2 className="flex items-center gap-1.5 text-base font-semibold text-stone-900 dark:text-white">
              <MapPin size={15} /> Good to know
            </h2>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-xs font-medium text-stone-500 dark:text-stone-400">Weather</dt>
                <dd className="text-stone-700 dark:text-stone-300">
                  {d.weather.label} · {d.weather.highC}° / {d.weather.lowC}° ·{" "}
                  {d.weather.rainChance}% rain
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-stone-500 dark:text-stone-400">Watch out</dt>
                <dd className="text-stone-700 dark:text-stone-300">{d.watchOut}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-stone-500 dark:text-stone-400">
                  Getting there
                </dt>
                <dd className="text-stone-700 dark:text-stone-300">
                  {item.travel.label} from {origin.city}, about {formatMoney(item.cost.travel)}{" "}
                  return.
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  )
}

function KeyFact({
  icon,
  label,
  children,
}: {
  icon: ReactNode
  label: string
  children: ReactNode
}) {
  return (
    <div className="min-w-36">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500 dark:text-stone-400">
        {icon}
        {label}
      </div>
      <div className="text-sm font-medium text-stone-900 dark:text-white">{children}</div>
    </div>
  )
}
