import { useMemo, useState } from "react"
import { Check, Lock, LockOpen, RotateCcw, Trophy, Users, Vote } from "lucide-react"
import { DestinationArt } from "../components/DestinationArt"
import { VoteButtons } from "../components/shared"
import { Avatar, Badge, Button, EmptyState, Meter, SectionHeading, cx, useToast } from "../components/ui"
import { MEMBERS, MEMBER_BY_ID } from "../data/group"
import { money, duration, percent } from "../lib/format"
import { consensus } from "../lib/trip"
import { useDerivedTrip, useTrip } from "../state/trip"
import type { VoteValue } from "../types"

export function VoteView({
  onOpen,
  onGoPlan,
}: {
  onOpen: (destinationId: string) => void
  onGoPlan: () => void
}) {
  const { state, dispatch } = useTrip()
  const { ranked, crew, currentMember, leader, winner } = useDerivedTrip()
  const toast = useToast()
  const [showDecided, setShowDecided] = useState(true)

  const myVotes = state.votes[currentMember.id] ?? {}
  const decidedCount = ranked.filter((row) => myVotes[row.destination.id]).length
  const progress = ranked.length === 0 ? 0 : decidedCount / ranked.length

  const ballot = useMemo(() => {
    const list = [...ranked].sort((a, b) => {
      const aDone = myVotes[a.destination.id] ? 1 : 0
      const bDone = myVotes[b.destination.id] ? 1 : 0
      if (aDone !== bDone) return aDone - bDone
      return b.fit - a.fit
    })
    return showDecided ? list : list.filter((row) => !myVotes[row.destination.id])
  }, [ranked, myVotes, showDecided])

  const totalCast = ranked.reduce((sum, row) => sum + row.tally.cast, 0)
  const possible = ranked.length * crew.length
  const turnout = possible === 0 ? 0 : totalCast / possible

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <div className="space-y-5">
        <div className="rounded-card border border-line bg-surface p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight text-ink">Your ballot</h2>
              <p className="mt-0.5 text-[13px] text-muted">
                Voting as <span className="font-medium text-ink">{currentMember.name}</span> —
                switch to anyone to fill in the rest.
              </p>
            </div>
            <Button
              size="sm"
              variant="quiet"
              icon={<RotateCcw size={14} />}
              disabled={decidedCount === 0}
              onClick={() => {
                const snapshot = { ...myVotes }
                dispatch({ type: "clearVotes", memberId: currentMember.id })
                toast({
                  message: `Cleared ${currentMember.name}'s votes`,
                  action: {
                    label: "Undo",
                    onClick: () =>
                      Object.entries(snapshot).forEach(([destinationId, value]) =>
                        dispatch({
                          type: "vote",
                          memberId: currentMember.id,
                          destinationId,
                          value: value as VoteValue,
                        }),
                      ),
                  },
                })
              }}
            >
              Clear mine
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {MEMBERS.map((member) => {
              const active = member.id === currentMember.id
              const going = state.goingIds.includes(member.id)
              return (
                <button
                  key={member.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => dispatch({ type: "setCurrentMember", memberId: member.id })}
                  className={cx(
                    "focus-ring flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-[13px] font-medium transition",
                    active
                      ? "border-brand/40 bg-brand-soft text-brand-ink"
                      : "border-line bg-surface text-muted hover:border-line-strong hover:text-ink",
                    !going && "opacity-55",
                  )}
                >
                  <Avatar member={member} size={22} />
                  {member.name}
                  {!going && <span className="text-[11px] text-subtle">not going</span>}
                </button>
              )
            })}
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-baseline justify-between text-[12.5px]">
              <span className="text-muted">
                {decidedCount} of {ranked.length} decided
              </span>
              <span className="tnum font-semibold text-ink">{percent(progress)}</span>
            </div>
            <Meter value={progress} tone={progress === 1 ? "positive" : "brand"} />
          </div>

          {decidedCount > 0 && (
            <label className="mt-4 flex cursor-pointer items-center gap-2 text-[12.5px] text-muted">
              <input
                type="checkbox"
                checked={showDecided}
                onChange={(e) => setShowDecided(e.target.checked)}
                className="focus-ring size-4 accent-[var(--wk-brand)]"
              />
              Show the ones I've already voted on
            </label>
          )}
        </div>

        {ballot.length === 0 ? (
          <EmptyState
            icon={<Check size={22} />}
            title="Ballot complete"
            body={`${currentMember.name} has voted on every destination. Switch to another member or check the standings.`}
            action={<Button onClick={() => setShowDecided(true)}>Show my votes</Button>}
          />
        ) : (
          <ul className="space-y-3">
            {ballot.map((row) => {
              const vote = myVotes[row.destination.id]
              return (
                <li
                  key={row.destination.id}
                  className={cx(
                    "animate-rise overflow-hidden rounded-card border bg-surface transition",
                    vote ? "border-line" : "border-brand/25 shadow-sm",
                  )}
                >
                  <div className="flex items-stretch gap-3 p-3 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => onOpen(row.destination.id)}
                      aria-label={`Open ${row.destination.name}`}
                      className="focus-ring w-20 shrink-0 overflow-hidden rounded-xl sm:w-28"
                    >
                      <DestinationArt
                        destination={row.destination}
                        className="h-full min-h-20 w-full"
                      />
                    </button>
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-[15px] font-semibold text-ink">
                            {row.destination.name}
                          </h3>
                          {vote && (
                            <Badge
                              tone={vote === "in" ? "positive" : vote === "maybe" ? "warn" : "danger"}
                            >
                              You: {vote}
                            </Badge>
                          )}
                        </div>
                        <p className="tnum mt-0.5 truncate text-[12.5px] text-muted">
                          {money(row.cost.total)} pp · {duration(row.travel.option.hours)} each way ·{" "}
                          {Math.round(row.fit * 100)}% match
                        </p>
                      </div>
                      <VoteButtons
                        size="sm"
                        value={vote}
                        labelPrefix={row.destination.name}
                        onVote={(value) =>
                          dispatch({
                            type: "vote",
                            memberId: currentMember.id,
                            destinationId: row.destination.id,
                            value,
                          })
                        }
                      />
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-28">
        <div className="rounded-card border border-line bg-surface p-4 sm:p-5">
          <SectionHeading
            title="Where the group stands"
            hint={`${Math.round(turnout * 100)}% of ballots in · in = 2 pts, maybe = 1`}
          />
          {totalCast === 0 ? (
            <EmptyState
              icon={<Vote size={22} />}
              title="No votes yet"
              body="Cast the first vote and the standings will appear here."
            />
          ) : (
            <ol className="space-y-3">
              {ranked.slice(0, 6).map((row, index) => {
                const agreement = consensus(row.tally)
                const isWinner = winner?.destination.id === row.destination.id
                return (
                  <li key={row.destination.id}>
                    <button
                      type="button"
                      onClick={() => onOpen(row.destination.id)}
                      className="focus-ring w-full rounded-xl p-1 text-left transition hover:bg-sunken"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cx(
                            "tnum grid size-6 shrink-0 place-items-center rounded-md text-[12px] font-bold",
                            index === 0
                              ? "bg-brand text-onbrand"
                              : "bg-sunken text-muted",
                          )}
                        >
                          {index + 1}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-ink">
                          {row.destination.name}
                        </span>
                        {isWinner && <Badge tone="brand" icon={<Lock size={10} />}>Locked</Badge>}
                        <span className="tnum shrink-0 text-[12.5px] font-semibold text-muted">
                          {row.tally.score}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 pl-8">
                        <Meter value={row.tally.ratio} tone={index === 0 ? "brand" : "neutral"} className="flex-1" />
                        <span className="flex items-center">
                          {row.tally.in.map((id) => {
                            const member = MEMBER_BY_ID[id]
                            return member ? (
                              <Avatar key={id} member={member} size={18} ring className="-ml-1" />
                            ) : null
                          })}
                        </span>
                      </div>
                      {row.tally.cast > 0 && (
                        <p className="mt-1 pl-8 text-[11.5px] text-subtle">
                          {row.tally.in.length} in · {row.tally.maybe.length} maybe ·{" "}
                          {row.tally.out.length} out · {Math.round(agreement * 100)}% agree
                        </p>
                      )}
                    </button>
                  </li>
                )
              })}
            </ol>
          )}
        </div>

        <div className="rounded-card border border-line bg-surface p-4 sm:p-5">
          {winner ? (
            <div className="text-center">
              <div className="animate-pop mx-auto grid size-11 place-items-center rounded-2xl bg-brand-soft text-brand-ink">
                <Trophy size={20} />
              </div>
              <h3 className="mt-3 text-[15px] font-semibold text-ink">
                {winner.destination.name} it is
              </h3>
              <p className="mt-1 text-[13px] text-muted">
                Locked in for the weekend. The itinerary is ready to go.
              </p>
              <div className="mt-4 grid gap-2">
                <Button variant="primary" full onClick={onGoPlan}>
                  Open the plan
                </Button>
                <Button
                  variant="quiet"
                  full
                  icon={<LockOpen size={14} />}
                  onClick={() => {
                    dispatch({ type: "lockWinner", destinationId: null })
                    toast({ message: "Unlocked — voting is open again" })
                  }}
                >
                  Reopen voting
                </Button>
              </div>
            </div>
          ) : leader ? (
            <div>
              <SectionHeading title="Ready to decide?" hint="You can always reopen it." />
              <div className="flex items-center gap-3 rounded-xl bg-sunken p-3">
                <div className="size-12 shrink-0 overflow-hidden rounded-lg">
                  <DestinationArt destination={leader.destination} className="h-full w-full" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-semibold text-ink">
                    {leader.destination.name} leads
                  </p>
                  <p className="tnum truncate text-[12px] text-muted">
                    {leader.tally.score} pts · {money(leader.cost.total)} pp
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                full
                className="mt-3"
                icon={<Lock size={15} />}
                onClick={() => {
                  dispatch({ type: "lockWinner", destinationId: leader.destination.id })
                  toast({ message: `${leader.destination.name} locked in`, action: { label: "Plan it", onClick: onGoPlan } })
                }}
              >
                Lock in {leader.destination.name}
              </Button>
            </div>
          ) : (
            <div className="flex items-start gap-3 text-[13px] text-muted">
              <Users size={16} className="mt-0.5 shrink-0 text-subtle" />
              Once a few votes are in you'll be able to lock a winner and open its itinerary.
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
