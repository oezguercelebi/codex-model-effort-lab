import { useState } from "react"
import {
  CalendarDays,
  Check,
  ChevronDown,
  Crown,
  Lock,
  LockOpen,
  PartyPopper,
  RotateCcw,
  Timer,
  Vote,
} from "lucide-react"
import { Scenery } from "../components/Scenery"
import { TallyBar, VoteControl } from "../components/VoteControl"
import { Avatar, Button, Chip, Meter, SectionHeading } from "../components/ui"
import { MEMBERS, TRIP_DATES, YOU_ID } from "../data/trip"
import { cx, money, plural } from "../lib/format"
import { useCastVote } from "../state/actions"
import { useTrip } from "../state/store"
import { useToast } from "../state/toast"
import type { VoteValue } from "../types"

const VOTE_DOT: Record<VoteValue, string> = {
  yes: "bg-yes",
  maybe: "bg-maybe",
  no: "bg-no",
}

function Confetti() {
  const pieces = Array.from({ length: 22 }, (_, index) => {
    const angle = (index / 22) * Math.PI * 2
    const distance = 90 + (index % 5) * 26
    const colors = ["var(--color-brand)", "var(--color-gold)", "var(--color-yes)", "var(--color-deep)"]
    return {
      id: index,
      dx: `${Math.cos(angle) * distance}px`,
      dy: `${Math.sin(angle) * distance - 40}px`,
      rot: `${(index % 2 ? 1 : -1) * (180 + index * 24)}deg`,
      color: colors[index % colors.length],
      delay: `${(index % 6) * 30}ms`,
    }
  })

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-20" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="wk-confetti-piece absolute block h-2.5 w-1.5 rounded-[2px]"
          style={
            {
              background: piece.color,
              animationDelay: piece.delay,
              "--dx": piece.dx,
              "--dy": piece.dy,
              "--rot": piece.rot,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

export function VoteView({
  onOpen,
  onOpenPlan,
}: {
  onOpen: (destinationId: string) => void
  onOpenPlan: (destinationId: string) => void
}) {
  const { state, dispatch, ranked, crew, cards, yourVoteCount, locked, leader } = useTrip()
  const castVote = useCastVote()
  const { push } = useToast()
  const [showMatrix, setShowMatrix] = useState(false)
  const [celebrating, setCelebrating] = useState(false)

  const todo = cards.filter((card) => !card.yourVote)
  const winner = locked ?? leader
  const decided = crew.reduce(
    (sum, member) => sum + Object.keys(state.votes[member.id] ?? {}).length,
    0,
  )
  const possible = crew.length * cards.length

  const lockIn = (destinationId: string, name: string) => {
    dispatch({ type: "lock", destinationId })
    setCelebrating(true)
    window.setTimeout(() => setCelebrating(false), 1800)
    push({
      message: `${name} it is!`,
      detail: "The weekend plan is ready in the Plan tab.",
      tone: "success",
      action: { label: "Open plan", onClick: () => onOpenPlan(destinationId) },
    })
  }

  return (
    <div className="space-y-8">
      {/* Status ------------------------------------------------------- */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-card border border-line bg-surface p-4 shadow-soft">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
            <Vote size={12} aria-hidden="true" /> Your ballot
          </p>
          <p className="wk-tabular mt-1.5 text-2xl font-bold text-ink">
            {yourVoteCount}
            <span className="text-base font-semibold text-ink-faint"> / {cards.length}</span>
          </p>
          <Meter value={yourVoteCount} max={cards.length} className="mt-2" />
          <p className="mt-2 text-[12px] text-ink-soft">
            {todo.length ? `${plural(todo.length, "place")} still need your call` : "You've voted on everything"}
          </p>
        </div>

        <div className="rounded-card border border-line bg-surface p-4 shadow-soft">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
            <Check size={12} aria-hidden="true" /> The crew
          </p>
          <p className="wk-tabular mt-1.5 text-2xl font-bold text-ink">
            {Math.round((decided / Math.max(1, possible)) * 100)}%
          </p>
          <Meter value={decided} max={possible} className="mt-2" color="bg-deep" />
          <p className="mt-2 text-[12px] text-ink-soft">
            {plural(crew.length, "person", "people")} voting · {decided} votes in
          </p>
        </div>

        <div className="rounded-card border border-line bg-surface p-4 shadow-soft">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">
            <Timer size={12} aria-hidden="true" /> Poll closes
          </p>
          <p className="mt-1.5 text-2xl font-bold text-ink">
            {TRIP_DATES.daysToDeadline > 0
              ? `${TRIP_DATES.daysToDeadline}d`
              : "Today"}
          </p>
          <p className="mt-3 text-[12px] text-ink-soft">
            Booking gets pricier after that — Jonas has said so twice.
          </p>
        </div>
      </div>

      {/* Winner banner ------------------------------------------------ */}
      {winner ? (
        <div className="relative overflow-hidden rounded-card border border-line bg-surface shadow-soft">
          {celebrating ? <Confetti /> : null}
          <div className="grid sm:grid-cols-[minmax(0,1fr)_260px]">
            <div className="order-2 p-5 sm:order-1">
              <div className="flex flex-wrap items-center gap-2">
                <Chip tone={locked ? "brand" : "gold"} icon={locked ? Lock : Crown}>
                  {locked ? "Locked in" : "Currently winning"}
                </Chip>
                <span className="wk-tabular text-[12px] font-semibold text-ink-faint">
                  {winner.tally.score} of {winner.tally.maxScore} points
                </span>
              </div>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink">
                {winner.destination.name}
              </h2>
              <p className="mt-1 max-w-md text-[13px] leading-5 text-ink-soft">
                {locked
                  ? "Everything is decided. The itinerary and the prep list are ready to go."
                  : `${winner.tally.yes} yes · ${winner.tally.maybe} maybe · ${winner.tally.no} no. Lock it in when the group is happy.`}
              </p>
              <p className="wk-tabular mt-3 text-[13px] font-semibold text-ink">
                {money(winner.budget.total)} each ·{" "}
                <span className="font-medium text-ink-soft">
                  {money(winner.budget.groupTotal)} for the group
                </span>
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {locked ? (
                  <>
                    <Button
                      variant="primary"
                      icon={CalendarDays}
                      onClick={() => onOpenPlan(winner.destination.id)}
                    >
                      Open the plan
                    </Button>
                    <Button
                      variant="ghost"
                      icon={LockOpen}
                      onClick={() => {
                        dispatch({ type: "lock", destinationId: null })
                        push({ message: "Trip unlocked", detail: "Voting is open again." })
                      }}
                    >
                      Unlock
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      icon={PartyPopper}
                      onClick={() => lockIn(winner.destination.id, winner.destination.name)}
                    >
                      Lock in {winner.destination.name}
                    </Button>
                    <Button variant="ghost" onClick={() => onOpen(winner.destination.id)}>
                      See details
                    </Button>
                  </>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpen(winner.destination.id)}
              className="order-1 sm:order-2"
              aria-label={`Open ${winner.destination.name}`}
            >
              <div className="relative h-36 overflow-hidden sm:h-full">
                <Scenery
                  kind={winner.destination.scenery}
                  palette={winner.destination.palette}
                  seed={winner.destination.id}
                  className="size-full"
                />
              </div>
            </button>
          </div>
        </div>
      ) : null}

      {/* Quick voting ------------------------------------------------- */}
      {todo.length > 0 ? (
        <section>
          <SectionHeading
            icon={Vote}
            title="Your turn"
            subtitle="Swipe through the ones you haven't called yet. Voting takes ten seconds."
          />
          <div className="wk-scroll -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {todo.map((card) => (
              <div
                key={card.destination.id}
                className="w-64 shrink-0 snap-start overflow-hidden rounded-card border border-line bg-surface shadow-soft"
              >
                <button
                  type="button"
                  onClick={() => onOpen(card.destination.id)}
                  className="block w-full text-left"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Scenery
                      kind={card.destination.scenery}
                      palette={card.destination.palette}
                      seed={card.destination.id}
                      className="size-full"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <p className="text-[15px] font-bold text-white">{card.destination.name}</p>
                      <p className="wk-tabular text-[11px] text-white/85">
                        {money(card.budget.total)} pp · {card.destination.country}
                      </p>
                    </div>
                  </div>
                </button>
                <div className="p-2.5">
                  <VoteControl
                    value={card.yourVote}
                    size="sm"
                    destinationName={card.destination.name}
                    onVote={(value) => castVote(card.destination, value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Leaderboard -------------------------------------------------- */}
      <section>
        <SectionHeading
          icon={Crown}
          title="The standings"
          subtitle="A yes is worth two points, a maybe is worth one. Ties break on straight yes votes."
          action={
            <Button
              size="sm"
              variant="ghost"
              icon={RotateCcw}
              onClick={() => {
                dispatch({ type: "clearMyVotes" })
                push({ message: "Your votes were cleared", detail: "Everyone else's stayed put." })
              }}
            >
              Clear my votes
            </Button>
          }
        />

        <ol className="space-y-2.5">
          {ranked.map((card, index) => {
            const isWinner = index === 0
            const yesVoters = crew.filter(
              (member) => state.votes[member.id]?.[card.destination.id] === "yes",
            )
            return (
              <li
                key={card.destination.id}
                className={cx(
                  "wk-fade-up overflow-hidden rounded-card border bg-surface shadow-soft transition",
                  state.lockedId === card.destination.id
                    ? "border-brand"
                    : isWinner
                      ? "border-gold/40"
                      : "border-line",
                )}
                style={{ animationDelay: `${Math.min(index, 9) * 35}ms` }}
              >
                <div className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
                  <span
                    className={cx(
                      "wk-tabular grid size-8 shrink-0 place-items-center rounded-full text-[13px] font-bold",
                      isWinner ? "bg-gold-soft text-gold" : "bg-surface-2 text-ink-faint",
                    )}
                  >
                    {index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => onOpen(card.destination.id)}
                    className="hidden size-14 shrink-0 overflow-hidden rounded-xl sm:block"
                    aria-label={`Open ${card.destination.name}`}
                  >
                    <Scenery
                      kind={card.destination.scenery}
                      palette={card.destination.palette}
                      seed={card.destination.id}
                      className="size-full"
                    />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <button
                        type="button"
                        onClick={() => onOpen(card.destination.id)}
                        className="truncate text-[15px] font-bold text-ink transition hover:text-brand"
                      >
                        {card.destination.name}
                      </button>
                      <span className="wk-tabular text-[11px] font-semibold text-ink-faint">
                        {money(card.budget.total)} pp
                      </span>
                      {state.lockedId === card.destination.id ? (
                        <Chip tone="brand" icon={Lock}>
                          Locked
                        </Chip>
                      ) : null}
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <TallyBar tally={card.tally} />
                      </div>
                      <span className="wk-tabular shrink-0 text-[12px] font-bold text-ink">
                        {card.tally.score}
                        <span className="font-medium text-ink-faint">/{card.tally.maxScore}</span>
                      </span>
                    </div>
                    {yesVoters.length ? (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex">
                          {yesVoters.map((member, i) => (
                            <span key={member.id} style={{ marginLeft: i === 0 ? 0 : -7 }}>
                              <Avatar member={member} size={20} ring />
                            </span>
                          ))}
                        </div>
                        <span className="truncate text-[11px] text-ink-faint">
                          {yesVoters.map((member) => member.name).join(", ")} said yes
                        </span>
                      </div>
                    ) : (
                      <p className="mt-2 text-[11px] text-ink-faint">No yes votes yet</p>
                    )}
                  </div>

                  <div className="hidden w-56 shrink-0 md:block">
                    <VoteControl
                      value={card.yourVote}
                      size="sm"
                      destinationName={card.destination.name}
                      onVote={(value) => castVote(card.destination, value)}
                    />
                  </div>
                </div>

                <div className="border-t border-line p-2.5 md:hidden">
                  <VoteControl
                    value={card.yourVote}
                    size="sm"
                    destinationName={card.destination.name}
                    onVote={(value) => castVote(card.destination, value)}
                  />
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      {/* Matrix ------------------------------------------------------- */}
      <section>
        <button
          type="button"
          onClick={() => setShowMatrix((current) => !current)}
          aria-expanded={showMatrix}
          className="flex w-full items-center justify-between gap-3 rounded-card border border-line bg-surface p-4 text-left shadow-soft transition hover:border-line-strong"
        >
          <span>
            <span className="block text-[15px] font-bold text-ink">Everyone's votes</span>
            <span className="block text-[12px] text-ink-soft">
              The full grid, including the people who are sitting this one out
            </span>
          </span>
          <ChevronDown
            size={18}
            className={cx("shrink-0 text-ink-faint transition-transform", showMatrix && "rotate-180")}
            aria-hidden="true"
          />
        </button>

        {showMatrix ? (
          <div className="wk-scroll wk-fade-up mt-3 overflow-x-auto rounded-card border border-line bg-surface p-4 shadow-soft">
            <table className="w-full min-w-[520px] border-collapse">
              <caption className="sr-only">Every member's vote for every destination</caption>
              <thead>
                <tr>
                  <th className="w-40 pb-3 text-left text-[11px] font-bold uppercase tracking-wide text-ink-faint">
                    Destination
                  </th>
                  {MEMBERS.map((member) => {
                    const attending = state.attending[member.id] ?? member.attending
                    return (
                      <th key={member.id} className="pb-3">
                        <span className="flex flex-col items-center gap-1">
                          <Avatar member={member} size={26} dim={!attending} />
                          <span
                            className={cx(
                              "text-[10px] font-semibold",
                              attending ? "text-ink-soft" : "text-ink-faint line-through",
                            )}
                          >
                            {member.id === YOU_ID ? "You" : member.name}
                          </span>
                        </span>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {ranked.map((card) => (
                  <tr key={card.destination.id} className="border-t border-line">
                    <td className="py-2 pr-3 text-[12.5px] font-semibold text-ink">
                      {card.destination.name}
                    </td>
                    {MEMBERS.map((member) => {
                      const vote = state.votes[member.id]?.[card.destination.id]
                      const attending = state.attending[member.id] ?? member.attending
                      return (
                        <td key={member.id} className="py-2 text-center">
                          <span
                            title={`${member.name}: ${vote ?? "no vote"}`}
                            className={cx(
                              "inline-block size-3 rounded-full align-middle",
                              vote ? VOTE_DOT[vote] : "bg-surface-3",
                              !attending && "opacity-30",
                            )}
                          />
                          <span className="sr-only">
                            {member.name}: {vote ?? "no vote"}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-ink-faint">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-yes" /> Yes
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-maybe" /> Maybe
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-no" /> No
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-surface-3" /> Not voted
              </span>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  )
}
