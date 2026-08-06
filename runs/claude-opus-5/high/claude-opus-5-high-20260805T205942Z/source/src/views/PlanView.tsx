import { useState } from "react"
import {
  Backpack,
  CalendarDays,
  Lock,
  MapPin,
  Plus,
  RotateCcw,
  Trophy,
  Undo2,
  Users,
  X,
} from "lucide-react"
import { DestinationArt } from "../components/DestinationArt"
import { KIND_ICON, KIND_TONE, TravelPicker } from "../components/shared"
import {
  Avatar,
  Badge,
  Button,
  EmptyState,
  Meter,
  SectionHeading,
  cx,
  useToast,
} from "../components/ui"
import { MEMBER_BY_ID } from "../data/group"
import { DAY_LABELS, ITINERARY_BY_DESTINATION } from "../data/itineraries"
import { money, plural } from "../lib/format"
import { plannedTotal, travelOptions } from "../lib/trip"
import { useDerivedTrip, usePlanBlocks, useTrip } from "../state/trip"
import type { ItineraryBlock, Weekend } from "../types"

/** "Sep 4–6" -> ["Sep 4", "Sep 5", "Sep 6"] */
function dayDates(weekend: Weekend): string[] {
  const match = weekend.label.match(/^([A-Za-z]+)\s+(\d+)/)
  if (!match) return ["", "", ""]
  const [, month, start] = match
  const first = Number(start)
  return [0, 1, 2].map((offset) => `${month} ${first + offset}`)
}

export function PlanView({
  onOpen,
  onGoVote,
  previewId,
  onClearPreview,
}: {
  onOpen: (destinationId: string) => void
  onGoVote: () => void
  /** Set when someone opened a specific itinerary instead of the group's pick. */
  previewId: string | null
  onClearPreview: () => void
}) {
  const { state, dispatch } = useTrip()
  const { winner, leader, weekend, crew, groupSize, rowById } = useDerivedTrip()
  const toast = useToast()
  const [packed, setPacked] = useState<string[]>([])

  const preview = previewId ? rowById[previewId] : undefined
  const target = preview ?? winner ?? leader
  const blocks = usePlanBlocks(target?.destination.id)

  if (!target) {
    return (
      <EmptyState
        icon={<Trophy size={22} />}
        title="No destination picked yet"
        body="Once the group has voted, the winning weekend gets a full hour-by-hour plan here — travel, beds, meals and everything in between."
        action={
          <Button variant="primary" onClick={onGoVote}>
            Go and vote
          </Button>
        }
      />
    )
  }

  const { destination, travel, cost } = target
  const itinerary = ITINERARY_BY_DESTINATION[destination.id]
  const removed = state.removedBlocks[destination.id] ?? []
  const added = state.addedBlocks[destination.id] ?? []
  const totals = plannedTotal(destination, travel, groupSize, weekend, blocks)
  const dates = dayDates(weekend)
  const budgetRatio = state.budget > 0 ? totals.total / state.budget : 0
  const overBudget = totals.total > state.budget
  const isLockedPick = winner?.destination.id === destination.id
  const lockIn = () => {
    dispatch({ type: "lockWinner", destinationId: destination.id })
    onClearPreview()
    toast({ message: `${destination.name} locked in for ${weekend.label}` })
  }

  return (
    <div className="space-y-5">
      {!isLockedPick && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-warn/30 bg-warn-soft px-4 py-3">
          <span className="min-w-48 flex-1 text-[13px] text-ink">
            {preview && winner ? (
              <>
                Previewing <span className="font-semibold">{destination.name}</span> — the group has
                locked in {winner.destination.name}.
              </>
            ) : (
              <>
                Not locked in yet — this is a preview of{" "}
                <span className="font-semibold">{destination.name}</span>,{" "}
                {preview ? "picked from Explore" : "the current vote leader"}.
              </>
            )}
          </span>
          {preview && winner && (
            <Button size="sm" onClick={onClearPreview}>
              Back to {winner.destination.name}
            </Button>
          )}
          <Button size="sm" variant="primary" icon={<Lock size={14} />} onClick={lockIn}>
            {winner ? "Switch to this" : "Lock it in"}
          </Button>
        </div>
      )}

      <div className="relative overflow-hidden rounded-card border border-line">
        <DestinationArt destination={destination} className="h-48 w-full sm:h-60" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone="brand" className="border-transparent bg-white/90 text-stone-900">
              <Trophy size={11} /> {isLockedPick ? "The pick" : preview ? "Preview" : "Front runner"}
            </Badge>
            <Badge className="border-transparent bg-black/40 text-white backdrop-blur">
              <CalendarDays size={11} /> {weekend.range}
            </Badge>
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white drop-shadow sm:text-3xl">
            {destination.name}
          </h2>
          <p className="mt-1 max-w-2xl text-[13.5px] text-white/85">{itinerary.summary}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="space-y-6">
          {[0, 1, 2].map((day) => {
            const dayBlocks = blocks.filter((block) => block.day === day)
            const skipped = itinerary.blocks.filter(
              (block) => !block.optional && block.day === day && removed.includes(block.id),
            )
            const extras = itinerary.blocks.filter(
              (block) => block.optional && block.day === day && !added.includes(block.id),
            )
            const dayTotal = dayBlocks.reduce((sum, block) => sum + block.cost, 0)

            return (
              <section key={day}>
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-[15px] font-semibold tracking-tight text-ink">
                      {DAY_LABELS[day]}
                    </h3>
                    <span className="text-[12.5px] text-subtle">{dates[day]}</span>
                  </div>
                  <span className="tnum text-[12.5px] text-muted">{money(dayTotal)} pp</span>
                </div>

                {dayBlocks.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-line px-4 py-6 text-center text-[13px] text-subtle">
                    Nothing planned for {DAY_LABELS[day].toLowerCase()} — add something below.
                  </p>
                ) : (
                  <ol className="space-y-2">
                    {dayBlocks.map((block) => (
                      <BlockRow
                        key={block.id}
                        block={block}
                        onRemove={() =>
                          dispatch({
                            type: "toggleBlock",
                            destinationId: destination.id,
                            blockId: block.id,
                            optional: Boolean(block.optional),
                          })
                        }
                      />
                    ))}
                  </ol>
                )}

                {(extras.length > 0 || skipped.length > 0) && (
                  <div className="mt-3 space-y-2">
                    {extras.map((block) => (
                      <AddRow
                        key={block.id}
                        block={block}
                        label="Add"
                        onAdd={() => {
                          dispatch({
                            type: "toggleBlock",
                            destinationId: destination.id,
                            blockId: block.id,
                            optional: true,
                          })
                          toast({ message: `${block.title} added to ${DAY_LABELS[block.day]}` })
                        }}
                      />
                    ))}
                    {skipped.map((block) => (
                      <AddRow
                        key={block.id}
                        block={block}
                        label="Put back"
                        skipped
                        onAdd={() =>
                          dispatch({
                            type: "toggleBlock",
                            destinationId: destination.id,
                            blockId: block.id,
                            optional: false,
                          })
                        }
                      />
                    ))}
                  </div>
                )}
              </section>
            )
          })}

          {(removed.length > 0 || added.length > 0) && (
            <Button
              size="sm"
              variant="quiet"
              icon={<RotateCcw size={14} />}
              onClick={() => {
                dispatch({ type: "resetPlan", destinationId: destination.id })
                toast({ message: "Plan reset to the suggested itinerary" })
              }}
            >
              Reset to the suggested plan
            </Button>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-28">
          <div className="rounded-card border border-line bg-surface p-4 sm:p-5">
            <SectionHeading title="The damage" hint="Per person, based on what's in the plan" />
            <div className="tnum flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-ink">{money(totals.total)}</span>
              <span
                className={cx(
                  "text-[12.5px] font-medium",
                  overBudget ? "text-danger" : "text-positive",
                )}
              >
                {overBudget
                  ? `${money(totals.total - state.budget)} over`
                  : `${money(state.budget - totals.total)} under`}
              </span>
            </div>
            <Meter
              value={Math.min(1, budgetRatio)}
              tone={overBudget ? "danger" : budgetRatio > 0.85 ? "warn" : "positive"}
              className="mt-2"
            />
            <p className="mt-1.5 text-[11.5px] text-subtle">
              Budget {money(state.budget)} per person
            </p>

            <dl className="mt-4 space-y-2 text-[13px]">
              <Line label="Getting there and back" value={money(totals.travel)} />
              <Line
                label={`${plural(weekend.nights, "night")} at ${destination.stay.name}`}
                value={money(totals.stay)}
              />
              <Line label="Everything on the plan" value={money(totals.onTheGround)} />
              <div className="flex justify-between border-t border-line pt-2 font-semibold text-ink">
                <dt>Group total</dt>
                <dd className="tnum">{money(totals.total * groupSize)}</dd>
              </div>
            </dl>
            <p className="mt-2 text-[11.5px] text-subtle">
              Explore's typical-weekend estimate for {destination.name} is {money(cost.total)} per
              person.
            </p>
          </div>

          <div className="rounded-card border border-line bg-surface p-4 sm:p-5">
            <SectionHeading title="Getting there" hint="Changing this updates the budget" />
            <TravelPicker
              compact
              options={travelOptions(destination, groupSize, weekend)}
              selected={travel.option.mode}
              onSelect={(mode) => dispatch({ type: "setMode", destinationId: destination.id, mode })}
            />
          </div>

          <div className="rounded-card border border-line bg-surface p-4 sm:p-5">
            <SectionHeading title="Who's coming" hint={`${plural(crew.length, "person", "people")} · split ${crew.length} ways`} />
            <ul className="space-y-2">
              {crew.map((member) => (
                <li key={member.id} className="flex items-center gap-2.5">
                  <Avatar member={member} size={26} />
                  <span className="text-[13px] font-medium text-ink">{member.name}</span>
                  <span className="tnum ml-auto text-[12.5px] text-muted">
                    {money(totals.total)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-card border border-line bg-surface p-4 sm:p-5">
            <SectionHeading title="Don't forget" hint="Tap to tick things off" />
            <ul className="space-y-1.5">
              {itinerary.packing.map((item) => {
                const done = packed.includes(item)
                return (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() =>
                        setPacked((current) =>
                          current.includes(item)
                            ? current.filter((i) => i !== item)
                            : [...current, item],
                        )
                      }
                      className="focus-ring flex w-full items-center gap-2.5 rounded-lg px-1 py-1 text-left transition hover:bg-sunken"
                    >
                      <span
                        className={cx(
                          "grid size-4.5 shrink-0 place-items-center rounded border transition",
                          done ? "border-positive bg-positive text-white" : "border-line-strong",
                        )}
                      >
                        {done && <Backpack size={10} />}
                      </span>
                      <span
                        className={cx(
                          "text-[13px]",
                          done ? "text-subtle line-through" : "text-muted",
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

          <div className="grid gap-2">
            <Button icon={<MapPin size={15} />} onClick={() => onOpen(destination.id)}>
              All the details on {destination.name}
            </Button>
            <Button variant="quiet" icon={<Users size={15} />} onClick={onGoVote}>
              Change the destination
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}

function BlockRow({ block, onRemove }: { block: ItineraryBlock; onRemove: () => void }) {
  const Icon = KIND_ICON[block.kind]
  const by = block.by ? MEMBER_BY_ID[block.by] : undefined
  return (
    <li className="group relative flex gap-3 rounded-2xl border border-line bg-surface p-3 transition hover:border-line-strong sm:gap-4">
      <span className="tnum w-11 shrink-0 pt-0.5 text-right text-[12.5px] font-semibold text-muted sm:w-12">
        {block.time}
      </span>
      <span
        className={cx(
          "grid size-8 shrink-0 place-items-center rounded-lg",
          KIND_TONE[block.kind],
        )}
      >
        <Icon size={15} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-[14px] font-semibold text-ink">{block.title}</h4>
          {block.cost > 0 && (
            <span className="tnum shrink-0 text-[12.5px] font-medium text-muted">
              {money(block.cost)}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{block.detail}</p>
        {by && (
          <p className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-subtle">
            <Avatar member={by} size={16} />
            {by.name}'s pick
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${block.title} from the plan`}
        title="Remove from the plan"
        className="focus-ring absolute top-2 right-2 grid size-7 place-items-center rounded-full text-subtle opacity-0 transition hover:bg-sunken hover:text-danger focus-visible:opacity-100 group-hover:opacity-100"
      >
        <X size={14} />
      </button>
    </li>
  )
}

function AddRow({
  block,
  onAdd,
  label,
  skipped,
}: {
  block: ItineraryBlock
  onAdd: () => void
  label: string
  skipped?: boolean
}) {
  const Icon = KIND_ICON[block.kind]
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-dashed border-line px-3 py-2.5">
      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-sunken text-subtle">
        <Icon size={14} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-ink">
          {block.title}
          {block.cost > 0 && <span className="tnum ml-2 text-subtle">{money(block.cost)}</span>}
        </p>
        <p className="truncate text-[12px] text-subtle">
          {skipped ? "Removed from the plan" : block.detail}
        </p>
      </div>
      <Button
        size="sm"
        variant="ghost"
        icon={skipped ? <Undo2 size={13} /> : <Plus size={13} />}
        onClick={onAdd}
      >
        {label}
      </Button>
    </div>
  )
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="min-w-0 truncate text-muted">{label}</dt>
      <dd className="tnum shrink-0 text-ink">{value}</dd>
    </div>
  )
}
