import { useMemo, useState } from "react"
import {
  ArrowRight,
  Check,
  Clock,
  Equal,
  Lock,
  LockOpen,
  RotateCcw,
  Trophy,
  Wallet,
  Zap,
} from "lucide-react"
import { destinations } from "../data/destinations"
import { crew, trip } from "../data/trip"
import {
  budgetFor,
  leaderState,
  maxPossibleScore,
  selectedTravel,
  standings,
} from "../lib/compute"
import { currency, minutesToLabel, pluralize } from "../lib/format"
import type { Destination, VoteValue } from "../types"
import { useBallotProgress, useTrip } from "../state/TripContext"
import { DestinationArt } from "../components/DestinationArt"
import {
  Avatar,
  Bar,
  Button,
  Eyebrow,
  Sheet,
  SheetClose,
  VOTE_META,
  VibeIcon,
  VoteButtons,
} from "../components/ui"

export function VoteView() {
  const { state, plan, set, dispatch, voteBook, openDestination, setView, toast } = useTrip()
  const [quickOpen, setQuickOpen] = useState(false)
  const [onlyUnvoted, setOnlyUnvoted] = useState(false)

  const board = useMemo(() => standings(destinations, plan, voteBook), [plan, voteBook])
  const { leader, tiedWith } = leaderState(board)
  // A locked pick always heads the page, even if the raw scores put something else on top.
  const lockedRow = state.lockedId
    ? board.find((r) => r.destination.id === state.lockedId)
    : undefined
  const featured = lockedRow ?? leader
  const progress = useBallotProgress(voteBook)
  const yourVotes = Object.keys(state.votes).length
  const finished = progress.filter((p) => p.complete).length
  const rows = onlyUnvoted ? board.filter((r) => !state.votes[r.destination.id]) : board

  const castVote = (d: Destination, v: VoteValue) => {
    const previous = state.votes
    dispatch({ type: "vote", id: d.id, value: v })
    toast(previous[d.id] === v ? `Vote cleared for ${d.name}` : `${VOTE_META[v].label} — ${d.name}`, {
      tone: "success",
      action: { label: "Undo", run: () => set({ votes: previous }) },
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Eyebrow>The vote · closes in {trip.votingClosesIn}</Eyebrow>
          <h1 className="mt-1.5 font-display text-3xl tracking-tight text-ink sm:text-4xl">
            Where does the group stand?
          </h1>
          <p className="mt-1.5 text-[14px] text-ink-2">
            Love it is worth two points, up for it one, pass takes one away.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {yourVotes < destinations.length ? (
            <Button variant="primary" onClick={() => setQuickOpen(true)}>
              <Zap className="h-4 w-4" strokeWidth={2} />
              Quick vote
            </Button>
          ) : null}
          {yourVotes > 0 ? (
            <Button
              onClick={() => {
                const previous = state.votes
                dispatch({ type: "clearVotes" })
                toast("Your ballot was cleared", {
                  action: { label: "Undo", run: () => set({ votes: previous }) },
                })
              }}
            >
              <RotateCcw className="h-4 w-4" strokeWidth={1.9} />
              Reset my ballot
            </Button>
          ) : null}
        </div>
      </div>

      <LeaderCard
        leader={featured}
        tiedWith={lockedRow ? [] : tiedWith}
        lockedId={state.lockedId}
        onLock={(id, name) => {
          set({ lockedId: id })
          toast(`${name} is locked in`, { tone: "success" })
        }}
        onUnlock={() => {
          set({ lockedId: null })
          toast("Unlocked — voting is open again")
        }}
        onOpenPlan={() => setView("plan")}
      />

      <section className="rounded-2xl border border-line bg-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Eyebrow>Who's weighed in</Eyebrow>
            <p className="mt-1 text-[14px] text-ink-2">
              {finished} of {crew.length} finished ·{" "}
              <span className="font-semibold text-ink">
                you've voted on {yourVotes} of {destinations.length}
              </span>
            </p>
          </div>
          <div className="min-w-[180px] flex-1 sm:max-w-xs">
            <Bar fraction={yourVotes / destinations.length} color="bg-clay" height="h-2" />
          </div>
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
          {progress.map((p) => (
            <li key={p.member.id} className="flex items-center gap-2">
              <div className="relative">
                <Avatar member={p.member} size="md" />
                {p.complete ? (
                  <span className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-pine text-white ring-2 ring-card">
                    <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                  </span>
                ) : null}
              </div>
              <div className="leading-tight">
                <p className="text-[13px] font-semibold text-ink">{p.member.name}</p>
                <p className="text-[11.5px] text-ink-3">
                  {p.complete ? "Ballot in" : `${p.cast}/${p.total} voted`}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-[12px] text-ink-2">
          <span className="font-medium text-ink-3">Vote mix</span>
          {(["love", "yes", "pass"] as VoteValue[]).map((v) => (
            <span key={v} className="inline-flex items-center gap-1.5">
              <span
                className={`h-2.5 w-2.5 rounded-sm ${
                  v === "love" ? "bg-vote-love" : v === "yes" ? "bg-vote-yes" : "bg-vote-pass"
                }`}
                aria-hidden
              />
              {VOTE_META[v].label}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setOnlyUnvoted((v) => !v)}
          aria-pressed={onlyUnvoted}
          className={`rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors ${
            onlyUnvoted ? "bg-ink text-paper" : "text-ink-2 hover:bg-sand"
          }`}
        >
          {onlyUnvoted ? "Showing what's left" : "Only show what I haven't voted on"}
        </button>
      </div>

      <ol className="space-y-2.5">
        {rows.map((row) => {
          const d = row.destination
          const yourVote = state.votes[d.id]
          const missing = crew.length - row.tally.votesCast
          return (
            <li
              key={d.id}
              className={`wk-fade overflow-hidden rounded-2xl border bg-card transition-colors ${
                state.lockedId === d.id ? "border-pine ring-1 ring-pine" : "border-line"
              }`}
            >
              <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
                <div className="flex min-w-0 flex-1 items-center gap-3.5">
                  <span className="w-5 shrink-0 text-center font-display text-xl text-ink-3">
                    {row.rank}
                  </span>
                  <button
                    type="button"
                    onClick={() => openDestination(d.id)}
                    className="h-14 w-20 shrink-0 overflow-hidden rounded-xl"
                    aria-label={`Open ${d.name}`}
                  >
                    <DestinationArt destination={d} className="h-full w-full" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => openDestination(d.id)}
                      className="block truncate text-left font-display text-lg leading-tight text-ink hover:underline"
                    >
                      {d.name}
                    </button>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-ink-3">
                      <span className="inline-flex items-center gap-1">
                        <Wallet className="h-3 w-3" strokeWidth={1.9} aria-hidden />
                        {currency(budgetFor(d, plan).total)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" strokeWidth={1.9} aria-hidden />
                        {minutesToLabel(selectedTravel(d, plan.travelChoices).minutes)}
                      </span>
                      {missing > 0 ? <span>{pluralize(missing, "vote")} still out</span> : null}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:w-[38%] sm:max-w-[320px]">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[12px] text-ink-3">
                        {row.tally.love} · {row.tally.yes} · {row.tally.pass}
                      </span>
                      <span className="text-[13px] font-semibold tabular-nums text-ink">
                        {row.tally.score > 0 ? `+${row.tally.score}` : row.tally.score}
                        <span className="ml-1 text-[11px] font-normal text-ink-3">
                          /{maxPossibleScore()}
                        </span>
                      </span>
                    </div>
                    <VoteMixBar tally={row.tally} />
                  </div>
                </div>

                <div className="flex shrink-0 items-center justify-end">
                  <VoteButtons value={yourVote} onVote={(v) => castVote(d, v)} size="sm" />
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line-2 bg-card/60 px-6 py-10 text-center">
          <p className="font-display text-xl text-ink">That's your whole ballot in.</p>
          <p className="mt-1.5 text-[13.5px] text-ink-2">
            Every option has your vote on it. The board above is live.
          </p>
          <Button className="mt-4" onClick={() => setOnlyUnvoted(false)}>
            Show all {destinations.length} again
          </Button>
        </div>
      ) : null}

      {quickOpen ? <QuickVote onClose={() => setQuickOpen(false)} /> : null}
    </div>
  )
}

function VoteMixBar({ tally }: { tally: { love: number; yes: number; pass: number } }) {
  const total = tally.love + tally.yes + tally.pass
  if (total === 0) {
    return <div className="mt-1.5 h-2 w-full rounded-full bg-line" />
  }
  const segments = [
    { key: "love", value: tally.love, className: "bg-vote-love" },
    { key: "yes", value: tally.yes, className: "bg-vote-yes" },
    { key: "pass", value: tally.pass, className: "bg-vote-pass" },
  ]
  return (
    <div className="mt-1.5 flex h-2 w-full gap-[2px] overflow-hidden rounded-full">
      {segments.map((s) =>
        s.value > 0 ? (
          <div
            key={s.key}
            className={`${s.className} h-full first:rounded-l-full last:rounded-r-full`}
            style={{ width: `${(s.value / total) * 100}%` }}
            title={`${s.value} ${s.key}`}
          />
        ) : null,
      )}
    </div>
  )
}

function LeaderCard({
  leader,
  tiedWith,
  lockedId,
  onLock,
  onUnlock,
  onOpenPlan,
}: {
  leader: ReturnType<typeof leaderState>["leader"]
  tiedWith: ReturnType<typeof leaderState>["tiedWith"]
  lockedId: string | null
  onLock: (id: string, name: string) => void
  onUnlock: () => void
  onOpenPlan: () => void
}) {
  if (!leader) return null
  const tied = tiedWith.length > 0
  const locked = lockedId === leader.destination.id
  const d = leader.destination

  return (
    <section className="wk-rise relative overflow-hidden rounded-2xl border border-line bg-card">
      <div className="absolute inset-0">
        <DestinationArt destination={d} className="h-full w-full opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/88 to-card/55" aria-hidden />
      </div>
      <div className="relative grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold uppercase tracking-wide ${
              locked ? "bg-pine text-white" : tied ? "bg-ink text-paper" : "bg-gold text-white"
            }`}
          >
            {locked ? (
              <>
                <Lock className="h-3 w-3" strokeWidth={2.4} /> Locked in
              </>
            ) : tied ? (
              <>
                <Equal className="h-3 w-3" strokeWidth={2.6} /> Dead heat
              </>
            ) : (
              <>
                <Trophy className="h-3 w-3" strokeWidth={2.4} /> Leading
              </>
            )}
          </span>
          <h2 className="mt-2.5 font-display text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
            {tied ? `${d.name} and ${tiedWith[0].destination.name}` : d.name}
          </h2>
          <p className="mt-2 max-w-xl text-[14px] leading-6 text-ink-2">
            {locked
              ? `It's decided. The full ${d.name} plan is ready — three days, costed out, with the things to book first.`
              : tied
                ? `Both sitting on ${leader.tally.score} points. ${d.name} edges it on crew fit for now — your ballot is what settles it.`
                : `${leader.tally.score} points, ${Math.round(leader.tally.consensus * 100)}% of the crew positive. ${d.tagline}.`}
          </p>
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {d.vibes.slice(0, 4).map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1 rounded-full bg-card/80 px-2 py-1 text-[11.5px] font-medium text-ink-2 ring-1 ring-line"
              >
                <VibeIcon vibe={v} className="h-3 w-3" />
                {v}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
          {locked ? (
            <>
              <Button variant="dark" size="lg" onClick={onOpenPlan}>
                Open the plan
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Button>
              <Button onClick={onUnlock}>
                <LockOpen className="h-4 w-4" strokeWidth={1.9} />
                Reopen voting
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" size="lg" onClick={() => onLock(d.id, d.name)}>
                <Lock className="h-4 w-4" strokeWidth={2} />
                Lock in {d.name}
              </Button>
              <Button onClick={onOpenPlan}>Preview the plan</Button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

function QuickVote({ onClose }: { onClose: () => void }) {
  const { state, plan, dispatch, toast } = useTrip()
  const queue = useMemo(
    () => destinations.filter((d) => !state.votes[d.id]),
    // Freeze the queue when the sheet opens so cards don't jump as you vote.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const [index, setIndex] = useState(0)
  const done = index >= queue.length
  const current = queue[index]

  const answer = (v: VoteValue) => {
    if (!current) return
    dispatch({ type: "vote", id: current.id, value: v })
    setIndex((i) => i + 1)
  }

  return (
    <Sheet open onClose={onClose} labelledBy="quick-vote-title">
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <div>
          <h2 id="quick-vote-title" className="font-display text-xl text-ink">
            Quick vote
          </h2>
          <p className="text-[12.5px] text-ink-3">
            {done ? "All done" : `${index + 1} of ${queue.length} left on your ballot`}
          </p>
        </div>
        <SheetClose onClose={onClose} />
      </div>

      {done || !current ? (
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-pine-tint text-pine">
            <Check className="h-7 w-7" strokeWidth={2.4} />
          </div>
          <h3 className="mt-4 font-display text-2xl text-ink">Ballot complete</h3>
          <p className="mt-2 max-w-sm text-[13.5px] leading-6 text-ink-2">
            That's all {destinations.length} weekends rated. The standings behind this sheet already
            include your votes.
          </p>
          <Button
            variant="primary"
            className="mt-5"
            onClick={() => {
              onClose()
              toast("Your ballot is in", { tone: "success" })
            }}
          >
            See the results
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Button>
        </div>
      ) : (
        <div className="wk-pop px-5 py-5">
          <div className="overflow-hidden rounded-2xl border border-line">
            <div className="relative">
              <DestinationArt destination={current} className="h-40 w-full" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-display text-[26px] leading-tight text-white">{current.name}</h3>
                <p className="text-[12.5px] text-white/85">{current.region}</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-[13.5px] leading-6 text-ink-2">{current.tagline}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-[12.5px] text-ink-3">
                <span className="inline-flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5" strokeWidth={1.9} aria-hidden />
                  {currency(budgetFor(current, plan).total)} each
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" strokeWidth={1.9} aria-hidden />
                  {minutesToLabel(selectedTravel(current, plan.travelChoices).minutes)} each way
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {(["pass", "yes", "love"] as VoteValue[]).map((v) => {
              const meta = VOTE_META[v]
              const Icon = meta.icon
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => answer(v)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-4 text-[13px] font-semibold transition-all active:scale-[0.97] ${
                    v === "love"
                      ? "border-vote-love bg-vote-love text-white hover:brightness-110"
                      : v === "yes"
                        ? "border-line-2 bg-card text-ink hover:border-vote-love hover:text-vote-love"
                        : "border-line-2 bg-card text-ink-2 hover:border-vote-pass hover:text-vote-pass"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.9} />
                  {meta.label}
                </button>
              )
            })}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIndex((i) => i + 1)}
              className="rounded-lg px-2 py-1.5 text-[13px] font-medium text-ink-3 transition-colors hover:bg-sand hover:text-ink"
            >
              Skip for now
            </button>
            <div className="flex gap-1.5" aria-hidden>
              {queue.map((d, i) => (
                <span
                  key={d.id}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-5 bg-clay" : i < index ? "w-1.5 bg-ink-3" : "w-1.5 bg-line-2"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </Sheet>
  )
}
