import {
  BedDouble,
  CalendarDays,
  Crown,
  Heart,
  Sparkles,
  Thermometer,
  Users,
  Vote,
  Wallet,
  Zap,
} from "lucide-react"
import { FRIENDS } from "../data"
import type { Destination, Standing } from "../types"
import { bestTravel, budgetFitCount, budgetTotal, cx, duration, euro } from "../utils"
import { DestinationArt } from "../components/Art"
import {
  AvatarStack,
  BudgetLegend,
  BudgetStack,
  Modal,
  StatTile,
  Tag,
  TravelIcon,
  TRAVEL_LABELS,
} from "../components/ui"

export function DetailModal({
  destination: d,
  standing,
  voted,
  isLeader,
  tied,
  onToggleVote,
  onClose,
  onGoToPlan,
}: {
  destination: Destination
  standing?: Standing
  voted: boolean
  isLeader: boolean
  tied: boolean
  onToggleVote: () => void
  onClose: () => void
  onGoToPlan: () => void
}) {
  const fastest = bestTravel(d)
  const fits = budgetFitCount(d)
  const count = standing?.count ?? 0

  return (
    <Modal onClose={onClose} label={`${d.name} details`}>
      <div className="relative h-44 shrink-0 sm:h-52">
        <DestinationArt art={d.art} className="h-full w-full" />
        {isLeader && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-amber-700 shadow-sm backdrop-blur">
            <Crown className="size-3.5" />
            {tied ? "Tied for lead" : "Leading the vote"}
          </span>
        )}
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900">{d.name}</h2>
            <p className="text-sm font-medium text-stone-400">{d.country}</p>
          </div>
          <button
            type="button"
            onClick={onToggleVote}
            aria-pressed={voted}
            className={cx(
              "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold shadow-sm transition active:scale-[0.97]",
              voted
                ? "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200 hover:bg-orange-100"
                : "bg-stone-900 text-white hover:bg-stone-700",
            )}
          >
            <Heart className="size-4" fill={voted ? "currentColor" : "none"} />
            {voted ? "You voted for this" : `Vote for ${d.name}`}
          </button>
        </div>

        <p className="mt-3 text-sm leading-6 text-stone-600">{d.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {d.vibes.map((v) => (
            <Tag key={v}>{v}</Tag>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <StatTile
            label="Cost per person"
            icon={<Wallet className="size-3.5" />}
            value={euro(budgetTotal(d.budget))}
            sub="all-in weekend"
          />
          <StatTile
            label="Fastest route"
            icon={<Zap className="size-3.5" />}
            value={duration(fastest.durationMin)}
            sub={TRAVEL_LABELS[fastest.mode].toLowerCase()}
          />
          <StatTile
            label="September temps"
            icon={<Thermometer className="size-3.5" />}
            value={`${d.tempHigh}° / ${d.tempLow}°`}
            sub={`${d.rainChance}% rain chance`}
          />
          <StatTile
            label="Group votes"
            icon={<Vote className="size-3.5" />}
            value={count}
            sub={count === 0 ? "none yet" : `of ${FRIENDS.length} friends`}
          />
        </div>

        {/* Budget */}
        <Section title="Where the money goes">
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-stone-600">Estimated per person</span>
              <span className="text-lg font-semibold tracking-tight text-stone-900">
                {euro(budgetTotal(d.budget))}
              </span>
            </div>
            <BudgetStack budget={d.budget} className="mt-3" />
            <div className="mt-3">
              <BudgetLegend budget={d.budget} compact />
            </div>
            <p
              className={cx(
                "mt-3 flex items-center gap-1.5 border-t border-stone-100 pt-3 text-xs font-medium",
                fits >= 5 ? "text-emerald-700" : fits >= 3 ? "text-amber-700" : "text-red-700",
              )}
            >
              <Users className="size-3.5" />
              Within budget for {fits} of {FRIENDS.length} friends
            </p>
          </div>
        </Section>

        {/* Travel */}
        <Section title="Getting there from Berlin">
          <ul className="space-y-2">
            {d.travel.map((t, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-600">
                  <TravelIcon mode={t.mode} className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                    {TRAVEL_LABELS[t.mode]}
                    {t === fastest && d.travel.length > 1 && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                        Fastest
                      </span>
                    )}
                  </p>
                  <p className="truncate text-xs text-stone-500">{t.note}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold tabular-nums text-stone-900">
                    {duration(t.durationMin)}
                  </p>
                  <p className="text-xs tabular-nums text-stone-500">{euro(t.pricePerPerson)} pp</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* Stay */}
        <Section title="Where you'd stay">
          <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-600">
              <BedDouble className="size-4" />
            </span>
            <p className="text-sm text-stone-700">{d.stay}</p>
          </div>
        </Section>

        {/* Highlights */}
        <Section title="Don't-miss list">
          <ul className="space-y-2">
            {d.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm leading-6 text-stone-700">
                <Sparkles className="mt-1 size-4 shrink-0 text-amber-500" />
                {h}
              </li>
            ))}
          </ul>
        </Section>

        {/* Itinerary preview */}
        <Section title="Draft weekend plan">
          <div className="space-y-3">
            {d.itinerary.map((day) => (
              <div key={day.label} className="rounded-2xl border border-stone-200 bg-white p-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-stone-400">
                  <CalendarDays className="size-3.5" />
                  {day.label} · {day.date}
                </p>
                <ul className="mt-2.5 space-y-1.5">
                  {day.items.map((item) => (
                    <li key={item.time + item.title} className="flex gap-3 text-sm">
                      <span className="w-11 shrink-0 font-medium tabular-nums text-stone-400">
                        {item.time}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-stone-700">{item.title}</span>
                      {item.cost > 0 && (
                        <span className="shrink-0 text-xs font-medium tabular-nums text-stone-400">
                          {euro(item.cost)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {isLeader && !tied ? (
            <button
              type="button"
              onClick={onGoToPlan}
              className="mt-3 w-full rounded-full bg-stone-900 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              See the full group plan
            </button>
          ) : (
            <p className="mt-3 text-center text-xs text-stone-400">
              {isLeader
                ? `Tied for the lead — break the tie and this becomes the group plan.`
                : `If ${d.name} wins the vote, this becomes the group plan.`}
            </p>
          )}
        </Section>

        {/* Voters */}
        <Section title="Who's in">
          {count > 0 ? (
            <div className="flex items-center gap-3">
              <AvatarStack friends={standing?.voters ?? []} size="md" />
              <p className="text-sm text-stone-600">
                {(standing?.voters ?? []).map((v) => v.name).join(", ")}{" "}
                {count === 1 ? "voted" : "voted"} for {d.name}
              </p>
            </div>
          ) : (
            <p className="text-sm text-stone-500">
              No votes yet — someone has to be first. Could be you.
            </p>
          )}
        </Section>
      </div>
    </Modal>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
      <div className="mt-2.5">{children}</div>
    </section>
  )
}
