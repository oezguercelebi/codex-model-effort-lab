import { useCallback, useEffect, useState } from "react"
import {
  CalendarDays,
  Columns3,
  Compass,
  Map as MapIcon,
  Moon,
  RotateCcw,
  Sun,
  Users,
  Vote,
} from "lucide-react"
import { DestinationSheet } from "./components/DestinationSheet"
import {
  Avatar,
  AvatarStack,
  Badge,
  Button,
  IconButton,
  RangeField,
  SectionHeading,
  Segmented,
  Sheet,
  Switch,
  ToastProvider,
  cx,
  useTheme,
  useToast,
} from "./components/ui"
import { HOME_CITY, WEEKENDS } from "./data/destinations"
import { MEMBERS } from "./data/group"
import { money, plural } from "./lib/format"
import {
  BUDGET_BOUNDS,
  TripProvider,
  useDerivedTrip,
  useTrip,
  type ViewId,
} from "./state/trip"
import { CompareView } from "./views/CompareView"
import { ExploreView } from "./views/ExploreView"
import { PlanView } from "./views/PlanView"
import { VoteView } from "./views/VoteView"

const NAV: Array<{ id: ViewId; label: string; icon: typeof Compass }> = [
  { id: "explore", label: "Explore", icon: Compass },
  { id: "compare", label: "Compare", icon: Columns3 },
  { id: "vote", label: "Vote", icon: Vote },
  { id: "plan", label: "Plan", icon: MapIcon },
]

export default function App() {
  return (
    <TripProvider>
      <ToastProvider>
        <Weekender />
      </ToastProvider>
    </TripProvider>
  )
}

function Weekender() {
  const { state, dispatch } = useTrip()
  const derived = useDerivedTrip()
  const { theme, toggle } = useTheme()
  const toast = useToast()

  const [view, setView] = useState<ViewId>("explore")
  const [openDestination, setOpenDestination] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [crewOpen, setCrewOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650)
    return () => window.clearTimeout(timer)
  }, [])

  const go = useCallback((next: ViewId) => {
    setView(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  // Number keys jump between the four screens.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const index = Number(event.key) - 1
      if (index >= 0 && index < NAV.length) go(NAV[index].id)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go])

  const undecided = derived.ranked.filter(
    (row) => !state.votes[derived.currentMember.id]?.[row.destination.id],
  ).length

  const counts: Partial<Record<ViewId, number>> = {
    compare: state.compare.length,
    vote: undecided,
  }

  const openSheetRow = openDestination ? derived.rowById[openDestination] : undefined

  return (
    <div className="min-h-screen bg-canvas pb-24 lg:pb-0">
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand text-onbrand shadow-sm shadow-brand/30">
              <Compass size={19} />
            </span>
            <div className="min-w-0">
              <h1 className="text-[15px] leading-tight font-semibold tracking-tight text-ink">
                Weekender
              </h1>
              <p className="truncate text-[11.5px] leading-tight text-subtle">
                {HOME_CITY} crew · {plural(derived.crew.length, "traveller")}
              </p>
            </div>
          </div>

          <nav className="mx-auto hidden lg:block" aria-label="Main">
            <Segmented<ViewId>
              value={view}
              onChange={go}
              label="Sections"
              options={NAV.map((item) => ({
                value: item.id,
                label: (
                  <span className="flex items-center gap-1.5">
                    <item.icon size={14} />
                    {item.label}
                    {counts[item.id] ? (
                      <span className="tnum grid size-4.5 place-items-center rounded-full bg-brand text-[10px] font-bold text-onbrand">
                        {counts[item.id]}
                      </span>
                    ) : null}
                  </span>
                ),
              }))}
            />
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCrewOpen(true)}
              className="focus-ring flex h-10 items-center gap-2 rounded-xl border border-line bg-surface pr-3 pl-2 transition hover:border-line-strong"
              aria-label="Trip settings and crew"
            >
              <AvatarStack members={derived.crew} size={24} max={4} />
              <span className="hidden text-[13px] font-medium text-ink sm:inline">Crew</span>
            </button>
            <IconButton
              label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              onClick={toggle}
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </IconButton>
          </div>
        </div>

        <div className="border-t border-line/70 bg-surface/40">
          <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-2.5 no-scrollbar sm:px-6">
            <span className="flex shrink-0 items-center gap-1.5 text-[12px] font-medium text-subtle">
              <CalendarDays size={14} />
              Weekend
            </span>
            <Segmented
              size="sm"
              label="Pick a weekend"
              value={state.weekendId}
              onChange={(id) => dispatch({ type: "setWeekend", id })}
              options={WEEKENDS.map((weekend) => ({
                value: weekend.id,
                label: weekend.label,
                title: weekend.note,
              }))}
            />
            <span className="hidden shrink-0 text-[12px] text-subtle sm:inline">
              {derived.weekend.note}
            </span>
            <button
              type="button"
              onClick={() => setCrewOpen(true)}
              className="focus-ring ml-auto shrink-0 rounded-full border border-line bg-surface px-3 py-1 text-[12px] font-medium text-muted transition hover:text-ink"
            >
              <span className="tnum">{money(state.budget)}</span> pp budget
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {view === "explore" && (
          <ExploreView loading={loading} onOpen={(id) => setOpenDestination(id)} />
        )}
        {view === "compare" && <CompareView onOpen={(id) => setOpenDestination(id)} />}
        {view === "vote" && (
          <VoteView
            onOpen={(id) => setOpenDestination(id)}
            onGoPlan={() => {
              setPreview(null)
              go("plan")
            }}
          />
        )}
        {view === "plan" && (
          <PlanView
            onOpen={(id) => setOpenDestination(id)}
            onGoVote={() => go("vote")}
            previewId={preview}
            onClearPreview={() => setPreview(null)}
          />
        )}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
        aria-label="Main"
      >
        <ul className="mx-auto flex max-w-lg">
          {NAV.map((item) => {
            const active = item.id === view
            return (
              <li key={item.id} className="flex-1">
                <button
                  type="button"
                  onClick={() => go(item.id)}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "focus-ring relative flex w-full flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition",
                    active ? "text-brand-ink" : "text-subtle",
                  )}
                >
                  <span className="relative">
                    <item.icon size={19} />
                    {counts[item.id] ? (
                      <span className="tnum absolute -top-1.5 -right-2.5 grid size-4 place-items-center rounded-full bg-brand text-[9px] font-bold text-onbrand">
                        {counts[item.id]}
                      </span>
                    ) : null}
                  </span>
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-brand" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <DestinationSheet
        row={openSheetRow}
        weekend={derived.weekend}
        crew={derived.crew}
        currentMember={derived.currentMember}
        onClose={() => setOpenDestination(null)}
        onPlan={(id) => {
          setPreview(state.lockedWinner === id ? null : id)
          setOpenDestination(null)
          go("plan")
        }}
      />

      <Sheet open={crewOpen} onClose={() => setCrewOpen(false)} title="Trip settings">
        <div className="space-y-6 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-ink">Trip settings</h2>
            <p className="mt-1 text-[13px] text-muted">
              Who's coming changes what everyone pays — beds get split across the group.
            </p>
          </div>

          <div>
            <SectionHeading
              title="Who's coming"
              hint={`${plural(derived.crew.length, "person", "people")} confirmed`}
            />
            <ul className="space-y-2">
              {MEMBERS.map((member) => {
                const going = state.goingIds.includes(member.id)
                return (
                  <li
                    key={member.id}
                    className={cx(
                      "flex items-center gap-3 rounded-2xl border p-3 transition",
                      going ? "border-line bg-surface" : "border-line/60 bg-sunken/50",
                    )}
                  >
                    <Avatar member={member} size={34} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-semibold text-ink">{member.name}</span>
                        {member.id === derived.currentMember.id && (
                          <Badge tone="brand">Voting as</Badge>
                        )}
                      </div>
                      <p className="truncate text-[12.5px] text-muted">{member.blurb}</p>
                    </div>
                    <div className="shrink-0">
                      <Switch
                        checked={going}
                        hideLabel
                        label={`${member.name} is coming`}
                        onChange={() => {
                          if (going && derived.crew.length === 1) {
                            toast({ message: "Someone has to go on this trip" })
                            return
                          }
                          dispatch({ type: "toggleGoing", memberId: member.id })
                        }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <SectionHeading title="Voting as" hint="Demo mode — switch to fill in anyone's ballot" />
            <div className="flex flex-wrap gap-2">
              {MEMBERS.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  aria-pressed={member.id === derived.currentMember.id}
                  onClick={() => dispatch({ type: "setCurrentMember", memberId: member.id })}
                  className={cx(
                    "focus-ring flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-[13px] font-medium transition",
                    member.id === derived.currentMember.id
                      ? "border-brand/40 bg-brand-soft text-brand-ink"
                      : "border-line bg-surface text-muted hover:text-ink",
                  )}
                >
                  <Avatar member={member} size={22} />
                  {member.name}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-line p-4">
            <RangeField
              label="Budget per person"
              value={state.budget}
              min={BUDGET_BOUNDS.min}
              max={BUDGET_BOUNDS.max}
              step={BUDGET_BOUNDS.step}
              onChange={(value) => dispatch({ type: "setBudget", value })}
              display={state.budget >= BUDGET_BOUNDS.max ? "No limit" : money(state.budget)}
              hint="Used to flag trips that blow the budget and to score the plan."
            />
          </div>

          <div className="rounded-2xl border border-line p-4">
            <SectionHeading title="Sample data" hint="Everything is stored in this browser only" />
            <Button
              variant="danger"
              icon={<RotateCcw size={15} />}
              onClick={() => {
                dispatch({ type: "resetAll" })
                setCrewOpen(false)
                toast({ message: "Demo reset — votes and plans are back to the start" })
              }}
            >
              Reset the demo
            </Button>
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-line bg-surface/95 p-4 backdrop-blur sm:px-6">
          <Button variant="primary" full onClick={() => setCrewOpen(false)} icon={<Users size={15} />}>
            Done
          </Button>
        </div>
      </Sheet>
    </div>
  )
}
