import { useState, type ReactNode } from "react"
import {
  AlertTriangle,
  Check,
  CloudRain,
  Footprints,
  Lock,
  Sparkles,
  Sun,
  Thermometer,
} from "lucide-react"
import { VIBE_LABELS } from "../lib/data"
import { consensusPct, formatHours, formatMoney } from "../lib/engine"
import { useStore } from "../lib/store"
import type { Scored } from "../lib/types"
import { Avatar, Button, Meter, Modal, Tag, VoteButtons, cx } from "./ui"
import { Scenery } from "./Scenery"
import { ItineraryTimeline, planDays } from "./Itinerary"
import { MODE_ICON } from "./DestinationCard"

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "budget", label: "Budget" },
  { id: "itinerary", label: "Itinerary" },
  { id: "votes", label: "Votes" },
] as const

type TabId = (typeof TABS)[number]["id"]

export function DestinationDetail({
  item,
  onClose,
}: {
  item: Scored | null
  onClose: () => void
}) {
  const [tab, setTab] = useState<TabId>("overview")
  const { members, settings, origin, castVote, lockIn, lockedId, setView } = useStore()

  if (!item) return null
  const d = item.destination
  const ModeIcon = MODE_ICON[item.travel.mode]
  const consensus = consensusPct(item.score, Object.keys(item.votes).length)
  const overCap = item.cost.total > settings.budgetCap
  const isLocked = lockedId === d.id

  const lines = [
    { label: "Getting there & back", value: item.cost.travel, hint: `${item.travel.mode} · ${item.travel.distanceKm} km` },
    { label: `Stay · ${settings.nights} nights`, value: item.cost.lodging, hint: settings.lodging },
    { label: "Food & drink", value: item.cost.food, hint: `${settings.nights + 1} days` },
    { label: "Doing things", value: item.cost.activities, hint: "entries, transit, extras" },
  ]

  return (
    <Modal open onClose={onClose} labelledBy="detail-title">
      <div className="relative h-44 shrink-0 sm:h-52">
        <Scenery destination={d} seed={1} />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/75 to-transparent p-5 pr-16">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-white/75 uppercase">
            {d.country} · {d.region}
          </p>
          <h2 id="detail-title" className="text-2xl font-semibold text-white sm:text-3xl">
            {d.name}
          </h2>
          <p className="mt-1 text-sm text-white/85">{d.tagline}</p>
        </div>
      </div>

      <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-stone-200 px-4 dark:border-white/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id}
            className={cx(
              "relative px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors",
              tab === t.id
                ? "text-stone-900 dark:text-white"
                : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200",
            )}
          >
            {t.label}
            {tab === t.id ? (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-stone-900 dark:bg-white" />
            ) : null}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === "overview" ? (
          <div className="space-y-5">
            <p className="leading-7 text-stone-700 dark:text-stone-300">{d.summary}</p>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Stat label="Per person" value={formatMoney(item.cost.total)} tone={overCap ? "warn" : "default"} />
              <Stat label="Each way" value={formatHours(item.travel.hours)} icon={<ModeIcon size={13} />} />
              <Stat label="Group score" value={`${consensus}%`} />
              <Stat label="Walkability" value={`${d.easeScore}/100`} icon={<Footprints size={13} />} />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {d.vibes.map((v) => (
                <Tag key={v}>{VIBE_LABELS[v]}</Tag>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCard icon={<Sparkles size={14} />} title="Known for" body={d.knownFor} />
              <InfoCard icon={<Check size={14} />} title="Best for" body={d.bestFor} tone="good" />
              <InfoCard icon={<AlertTriangle size={14} />} title="Watch out" body={d.watchOut} tone="warn" />
              <InfoCard
                icon={<Thermometer size={14} />}
                title={`Weather in ${new Date(`${settings.departure}T00:00:00`).toLocaleDateString("en-GB", { month: "long" })}`}
                body={`${d.weather.label} · ${d.weather.highC}° / ${d.weather.lowC}° · ${d.weather.rainChance}% chance of rain`}
              />
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-stone-900 dark:text-white">Highlights</h4>
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {d.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: d.accent.ring }} />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}

        {tab === "budget" ? (
          <div className="space-y-5">
            <p className="text-sm leading-6 text-stone-600 dark:text-stone-400">
              Estimated per person from <strong className="text-stone-900 dark:text-white">{origin.city}</strong>,{" "}
              {settings.nights} nights, {settings.lodging} stay. Flights and rooms move — treat this as the shape of
              the spend, not a quote.
            </p>

            <div className="overflow-hidden rounded-2xl border border-stone-200 dark:border-white/10">
              {lines.map((line) => {
                const pct = Math.round((line.value / item.cost.total) * 100)
                return (
                  <div
                    key={line.label}
                    className="flex items-center gap-4 border-b border-stone-100 px-4 py-3 last:border-0 dark:border-white/5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-stone-900 dark:text-white">{line.label}</div>
                      <div className="text-xs text-stone-500 capitalize dark:text-stone-400">{line.hint}</div>
                      <Meter value={pct} tone="stone" className="mt-1.5 max-w-40" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold tabular-nums text-stone-900 dark:text-white">
                        {formatMoney(line.value)}
                      </div>
                      <div className="text-xs text-stone-400">{pct}%</div>
                    </div>
                  </div>
                )
              })}
              <div className="flex items-center justify-between bg-stone-50 px-4 py-3 dark:bg-white/5">
                <span className="text-sm font-semibold text-stone-900 dark:text-white">Total per person</span>
                <span className="text-lg font-semibold tabular-nums text-stone-900 dark:text-white">
                  {formatMoney(item.cost.total)}
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-stone-50 p-4 dark:bg-white/5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-stone-900 dark:text-white">
                  Whole group ({settings.travelers} people)
                </span>
                <span className="font-semibold tabular-nums text-stone-900 dark:text-white">
                  {formatMoney(item.cost.total * settings.travelers)}
                </span>
              </div>
            </div>

            {item.overBudgetFor.length ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-400/25 dark:bg-amber-400/10">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-900 dark:text-amber-200">
                  <AlertTriangle size={15} />
                  Over budget for {item.overBudgetFor.length}{" "}
                  {item.overBudgetFor.length === 1 ? "person" : "people"}
                </div>
                <ul className="mt-2 space-y-1.5">
                  {item.overBudgetFor.map((m) => (
                    <li key={m.id} className="flex items-center gap-2 text-sm text-amber-900/85 dark:text-amber-200/85">
                      <Avatar member={m} size={22} />
                      {m.name} set a ceiling of {formatMoney(m.budget)} —{" "}
                      {formatMoney(item.cost.total - m.budget)} short
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-2xl border border-teal-200 bg-teal-50 p-4 text-sm font-medium text-teal-900 dark:border-teal-400/25 dark:bg-teal-400/10 dark:text-teal-200">
                <Check size={15} /> Inside everyone's budget.
              </div>
            )}
          </div>
        ) : null}

        {tab === "itinerary" ? (
          <div className="space-y-5">
            <div className="flex items-center gap-2 rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-600 dark:bg-white/5 dark:text-stone-400">
              {d.weather.rainChance > 35 ? <CloudRain size={15} /> : <Sun size={15} />}
              {d.weather.label}, around {d.weather.highC}° in the afternoon.
              {d.weather.rainChance > 35 ? " Pack a layer." : ""}
            </div>
            <ItineraryTimeline days={planDays(d.itinerary, settings.nights)} departure={settings.departure} />
            {settings.nights + 1 > d.itinerary.length ? (
              <p className="rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-500 dark:bg-white/5 dark:text-stone-400">
                Day {d.itinerary.length + 1} is deliberately blank — by then the group will have
                found its own thing.
              </p>
            ) : null}
          </div>
        ) : null}

        {tab === "votes" ? (
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-sm font-medium text-stone-600 dark:text-stone-400">Group consensus</span>
                <span className="text-2xl font-semibold text-stone-900 dark:text-white">{consensus}%</span>
              </div>
              <Meter value={consensus} tone={consensus >= 66 ? "teal" : consensus >= 40 ? "amber" : "rose"} />
            </div>

            <ul className="divide-y divide-stone-100 overflow-hidden rounded-2xl border border-stone-200 dark:divide-white/5 dark:border-white/10">
              {members.map((m) => {
                const v = item.votes[m.id]
                return (
                  <li key={m.id} className="flex items-center gap-3 px-4 py-3">
                    <Avatar member={m} size={32} vote={v} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-stone-900 dark:text-white">
                        {m.name}
                        {m.isYou ? <span className="ml-1 text-xs text-stone-400">(you)</span> : null}
                      </div>
                      <div className="truncate text-xs text-stone-500 dark:text-stone-400">
                        {m.note} · budget {formatMoney(m.budget)}
                      </div>
                    </div>
                    <VoteBadge value={v} />
                  </li>
                )
              })}
            </ul>

            <div>
              <p className="mb-2 text-sm font-medium text-stone-900 dark:text-white">Your call</p>
              <VoteButtons value={item.votes.you} onVote={(v) => castVote(d.id, v)} />
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-3 border-t border-stone-200 bg-white/90 p-4 backdrop-blur dark:border-white/10 dark:bg-stone-900/90">
        <div className="min-w-0">
          <div className="text-lg font-semibold text-stone-900 dark:text-white">
            {formatMoney(item.cost.total)}
            <span className="text-xs font-normal text-stone-500 dark:text-stone-400"> /person</span>
          </div>
          <div className="truncate text-xs text-stone-500 dark:text-stone-400">
            {item.travel.label} from {origin.city}
          </div>
        </div>
        <Button
          variant={isLocked ? "secondary" : "primary"}
          className="ml-auto"
          onClick={() => {
            lockIn(isLocked ? null : d.id)
            if (!isLocked) {
              setView("plan")
              onClose()
            }
          }}
        >
          <Lock size={14} />
          {isLocked ? "Unlock" : "Lock in this trip"}
        </Button>
      </div>
    </Modal>
  )
}

function VoteBadge({ value }: { value?: string }) {
  if (!value)
    return <span className="text-xs font-medium text-stone-400">no vote yet</span>
  const map: Record<string, string> = {
    in: "bg-teal-100 text-teal-800 dark:bg-teal-400/15 dark:text-teal-300",
    maybe: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300",
    out: "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-300",
  }
  const label = value === "in" ? "In" : value === "maybe" ? "Maybe" : "Pass"
  return (
    <span className={cx("rounded-full px-2.5 py-1 text-xs font-semibold", map[value])}>{label}</span>
  )
}

function Stat({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string
  value: string
  icon?: ReactNode
  tone?: "default" | "warn"
}) {
  return (
    <div className="rounded-2xl bg-stone-100 px-3 py-2.5 dark:bg-white/5">
      <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">{label}</div>
      <div
        className={cx(
          "mt-0.5 flex items-center gap-1.5 text-sm font-semibold",
          tone === "warn" ? "text-amber-600 dark:text-amber-400" : "text-stone-900 dark:text-white",
        )}
      >
        {icon}
        {value}
      </div>
    </div>
  )
}

function InfoCard({
  icon,
  title,
  body,
  tone = "default",
}: {
  icon: ReactNode
  title: string
  body: string
  tone?: "default" | "good" | "warn"
}) {
  const tones = {
    default: "border-stone-200 dark:border-white/10",
    good: "border-teal-200 bg-teal-50/50 dark:border-teal-400/20 dark:bg-teal-400/5",
    warn: "border-amber-200 bg-amber-50/50 dark:border-amber-400/20 dark:bg-amber-400/5",
  }
  return (
    <div className={cx("rounded-2xl border p-3.5", tones[tone])}>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300">
        {icon}
        {title}
      </div>
      <p className="mt-1 text-sm leading-6 text-stone-600 dark:text-stone-400">{body}</p>
    </div>
  )
}
