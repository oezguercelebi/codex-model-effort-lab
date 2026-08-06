import {
  Bookmark,
  CalendarDays,
  Columns3,
  Footprints,
  Info,
  Leaf,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react"
import { COMMENTS, MEMBER_BY_ID } from "../data/group"
import { VIBES } from "../data/destinations"
import { money, duration, plural } from "../lib/format"
import { memberFit, travelOptions, type Ranked } from "../lib/trip"
import { useTrip } from "../state/trip"
import type { Member, Weekend } from "../types"
import { DestinationArt } from "./DestinationArt"
import { CostBar, TravelPicker, VIBE_ICON, VoteButtons, WeatherLine } from "./shared"
import { Avatar, Badge, Button, Meter, Sheet, cx, useToast } from "./ui"

const CROWD_COPY = {
  quiet: "Quiet even in season",
  steady: "Busy but manageable",
  busy: "Expect crowds in the centre",
} as const

export function DestinationSheet({
  row,
  weekend,
  crew,
  currentMember,
  onClose,
  onPlan,
}: {
  row: Ranked | undefined
  weekend: Weekend
  crew: Member[]
  currentMember: Member
  onClose: () => void
  onPlan: (destinationId: string) => void
}) {
  const { state, dispatch } = useTrip()
  const toast = useToast()

  if (!row) return null
  const { destination, cost, travel, fit, tally } = row
  const options = travelOptions(destination, Math.max(1, crew.length), weekend)
  const comments = COMMENTS.filter((c) => c.destinationId === destination.id)
  const shortlisted = state.shortlist.includes(destination.id)
  const comparing = state.compare.includes(destination.id)
  const myVote = state.votes[currentMember.id]?.[destination.id]

  const fits = crew
    .map((member) => ({ member, value: memberFit(destination, member) }))
    .sort((a, b) => b.value - a.value)

  return (
    <Sheet open={Boolean(row)} onClose={onClose} title={destination.name} wide>
      <div className="relative">
        <DestinationArt destination={destination} className="h-56 w-full object-cover sm:h-64" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="flex flex-wrap gap-1.5">
            {destination.knownFor.map((tag) => (
              <Badge key={tag} className="border-transparent bg-black/40 text-white backdrop-blur">
                {tag}
              </Badge>
            ))}
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white drop-shadow sm:text-3xl">
            {destination.name}
            <span className="ml-2 text-base font-normal text-white/70">{destination.country}</span>
          </h2>
          <p className="mt-1 max-w-xl text-[13.5px] text-white/85">{destination.tagline}</p>
        </div>
      </div>

      <div className="space-y-7 p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SheetStat label="Per person" value={money(cost.total)} sub={`${plural(weekend.nights, "night")} · ${weekend.label}`} />
          <SheetStat
            label="Door to door"
            value={duration(travel.option.hours)}
            sub={`${travel.option.mode === "car" ? "Driving" : travel.option.mode === "flight" ? "Flying" : travel.option.mode === "bus" ? "By bus" : "By train"} each way`}
          />
          <SheetStat label="Group match" value={`${Math.round(fit * 100)}%`} sub={`Across ${plural(crew.length, "person", "people")}`} />
          <SheetStat
            label="Votes"
            value={`${tally.score} pts`}
            sub={`${tally.in.length} in · ${tally.maybe.length} maybe · ${tally.out.length} out`}
          />
        </div>

        <p className="text-[14.5px] leading-relaxed text-muted">{destination.blurb}</p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl bg-sunken px-4 py-3">
          <WeatherLine destination={destination} weekend={weekend} className="text-muted" />
          <span className="inline-flex items-center gap-1.5 text-[12.5px] text-muted">
            <Footprints size={14} /> Walk score {destination.walkScore}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[12.5px] text-muted">
            <Users size={14} /> {CROWD_COPY[destination.crowd]}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[12.5px] text-muted">
            <Leaf size={14} /> {travel.option.co2}kg CO₂ per person
          </span>
        </div>

        <Section title="Your vote" icon={<CalendarDays size={15} />}>
          <div className="rounded-2xl border border-line p-4">
            <div className="flex items-center gap-2 text-[13px] text-muted">
              Voting as
              <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                <Avatar member={currentMember} size={22} />
                {currentMember.name}
              </span>
            </div>
            <div className="mt-3">
              <VoteButtons
                value={myVote}
                labelPrefix={destination.name}
                onVote={(value) =>
                  dispatch({
                    type: "vote",
                    memberId: currentMember.id,
                    destinationId: destination.id,
                    value,
                  })
                }
              />
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {(["in", "maybe", "out"] as const).map((bucket) => (
                <div key={bucket} className="rounded-xl bg-sunken px-3 py-2">
                  <div className="text-[11px] font-semibold tracking-wide text-subtle uppercase">
                    {bucket}
                  </div>
                  <div className="mt-1.5 flex min-h-6 flex-wrap items-center gap-1">
                    {tally[bucket].length === 0 ? (
                      <span className="text-[12px] text-subtle">—</span>
                    ) : (
                      tally[bucket].map((id) => {
                        const member = MEMBER_BY_ID[id]
                        return member ? <Avatar key={id} member={member} size={22} /> : null
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="How it fits each of you" icon={<Sparkles size={15} />}>
          <ul className="space-y-2.5">
            {fits.map(({ member, value }) => (
              <li key={member.id} className="flex items-center gap-3">
                <Avatar member={member} size={26} />
                <span className="w-14 shrink-0 text-[13px] font-medium text-ink">
                  {member.name}
                </span>
                <Meter value={value} className="flex-1" tone={value > 0.6 ? "positive" : value > 0.42 ? "brand" : "neutral"} />
                <span className="tnum w-9 shrink-0 text-right text-[12.5px] font-semibold text-muted">
                  {Math.round(value * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="What the weekend costs" icon={<Info size={15} />}>
          <div className="rounded-2xl border border-line p-4">
            <div className="flex items-baseline justify-between">
              <span className="tnum text-2xl font-semibold text-ink">{money(cost.total)}</span>
              <span className="text-[12.5px] text-subtle">per person, everything in</span>
            </div>
            <div className="mt-3">
              <CostBar cost={cost} />
            </div>
            <p className="mt-4 rounded-xl bg-sunken px-3 py-2 text-[12.5px] leading-relaxed text-muted">
              {destination.stay.kind} · {destination.stay.name}, {destination.stay.walkMinutes} min
              from the centre. Sleeps {destination.stay.sleeps}
              {crew.length > destination.stay.sleeps
                ? ` — the ${plural(crew.length - destination.stay.sleeps, "extra bed")} add ${money(
                    (crew.length - destination.stay.sleeps) * destination.stay.extraPerPerson,
                  )} a night, then it's split ${crew.length} ways.`
                : `, so the ${crew.length} of you split it ${crew.length} ways.`}
            </p>
          </div>
        </Section>

        <Section title="Getting there" icon={<Info size={15} />}>
          <TravelPicker
            options={options}
            selected={travel.option.mode}
            onSelect={(mode) => dispatch({ type: "setMode", destinationId: destination.id, mode })}
          />
        </Section>

        <Section title="The vibe, rated" icon={<Sparkles size={15} />}>
          <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {[...VIBES]
              .sort((a, b) => destination.ratings[b.id] - destination.ratings[a.id])
              .map((vibe) => {
                const Icon = VIBE_ICON[vibe.id]
                const value = destination.ratings[vibe.id] / 100
                return (
                  <li key={vibe.id} className="flex items-center gap-3">
                    <Icon size={15} className="shrink-0 text-subtle" />
                    <span className="w-20 shrink-0 text-[13px] text-muted">{vibe.label}</span>
                    <Meter value={value} className="flex-1" tone={value > 0.7 ? "brand" : "neutral"} />
                  </li>
                )
              })}
          </ul>
        </Section>

        <Section title="Worth doing" icon={<Sparkles size={15} />}>
          <ul className="space-y-2">
            {destination.highlights.map((item) => (
              <li key={item} className="flex gap-2.5 text-[13.5px] leading-relaxed text-muted">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3 flex gap-2.5 rounded-xl border border-warn/25 bg-warn-soft px-3.5 py-3 text-[13px] leading-relaxed text-ink">
            <Info size={15} className="mt-0.5 shrink-0 text-warn" />
            <span>{destination.localTip}</span>
          </p>
        </Section>

        {comments.length > 0 && (
          <Section title="From the group chat" icon={<MessageCircle size={15} />}>
            <ul className="space-y-3">
              {comments.map((comment, index) => {
                const member = MEMBER_BY_ID[comment.memberId]
                if (!member) return null
                return (
                  <li key={index} className="flex gap-3">
                    <Avatar member={member} size={28} />
                    <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm bg-sunken px-3.5 py-2.5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[13px] font-semibold text-ink">{member.name}</span>
                        <span className="text-[11.5px] text-subtle">{comment.when}</span>
                      </div>
                      <p className="mt-0.5 text-[13.5px] leading-relaxed text-muted">
                        {comment.text}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Section>
        )}
      </div>

      <div className="sticky bottom-0 flex gap-2 border-t border-line bg-surface/95 p-4 backdrop-blur sm:px-6">
        <button
          type="button"
          onClick={() => {
            dispatch({ type: "toggleShortlist", destinationId: destination.id })
            toast({
              message: shortlisted
                ? `${destination.name} removed from your shortlist`
                : `${destination.name} saved to your shortlist`,
            })
          }}
          aria-pressed={shortlisted}
          className={cx(
            "focus-ring grid size-10 shrink-0 place-items-center rounded-xl border transition",
            shortlisted
              ? "border-brand/40 bg-brand-soft text-brand-ink"
              : "border-line bg-surface text-muted hover:text-ink",
          )}
        >
          <Bookmark size={16} fill={shortlisted ? "currentColor" : "none"} />
        </button>
        <Button
          icon={<Columns3 size={15} />}
          onClick={() => dispatch({ type: "toggleCompare", destinationId: destination.id })}
          className="shrink-0"
        >
          <span className="hidden sm:inline">{comparing ? "In compare" : "Compare"}</span>
        </Button>
        <Button variant="primary" full onClick={() => onPlan(destination.id)}>
          See the {destination.name} itinerary
        </Button>
      </div>
    </Sheet>
  )
}

function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section>
      <h3 className="mb-3 flex items-center gap-2 text-[13px] font-semibold tracking-wide text-subtle uppercase">
        {icon}
        {title}
      </h3>
      {children}
    </section>
  )
}

function SheetStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-line bg-raised px-3.5 py-3">
      <div className="text-[11px] font-medium tracking-wide text-subtle uppercase">{label}</div>
      <div className="tnum mt-1 text-lg font-semibold text-ink">{value}</div>
      <div className="mt-0.5 truncate text-[11.5px] text-subtle">{sub}</div>
    </div>
  )
}
