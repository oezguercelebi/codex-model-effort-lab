import { useEffect, useState } from "react"
import {
  CalendarDays,
  Check,
  Columns3,
  Compass,
  Settings2,
  Trash2,
  Users,
  Vote as VoteIcon,
  X,
} from "lucide-react"
import { destinationById } from "./data/destinations"
import { crew, trip, weekendLabel } from "./data/trip"
import { currency } from "./lib/format"
import type { ViewKey } from "./types"
import { MAX_COMPARE, TripProvider, useTrip } from "./state/TripContext"
import { DestinationArt } from "./components/DestinationArt"
import { DestinationDetail } from "./components/DestinationDetail"
import { Avatar, Button, Eyebrow, Segmented, Sheet, SheetClose, Slider } from "./components/ui"
import { ExploreView } from "./views/ExploreView"
import { CompareView } from "./views/CompareView"
import { VoteView } from "./views/VoteView"
import { PlanView } from "./views/PlanView"

const NAV: { key: ViewKey; label: string; icon: typeof Compass }[] = [
  { key: "explore", label: "Explore", icon: Compass },
  { key: "compare", label: "Compare", icon: Columns3 },
  { key: "vote", label: "Vote", icon: VoteIcon },
  { key: "plan", label: "The plan", icon: CalendarDays },
]

export default function App() {
  return (
    <TripProvider>
      <Shell />
    </TripProvider>
  )
}

function Shell() {
  const { view, setView, openId, state } = useTrip()
  const open = openId ? destinationById.get(openId) : undefined

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [view])

  return (
    <div className="wk-texture min-h-screen bg-paper">
      <Header />
      <Toasts />

      <main className="mx-auto w-full max-w-7xl px-4 pb-10 pt-5 sm:px-6 sm:pt-7">
        {view === "explore" ? <ExploreView /> : null}
        {view === "compare" ? <CompareView /> : null}
        {view === "vote" ? <VoteView /> : null}
        {view === "plan" ? <PlanView /> : null}
      </main>

      <footer className="mx-auto w-full max-w-7xl px-4 pb-28 text-[12px] text-ink-3 sm:px-6 sm:pb-10">
        <div className="border-t border-line pt-5">
          Weekender · sample trip for {crew.length} from {trip.origin}. Prices are late-September
          estimates and everything lives in your browser.
        </div>
      </footer>

      {state.compare.length > 0 && view !== "compare" ? <CompareTray onOpen={() => setView("compare")} /> : null}

      <MobileNav />

      {open ? <DestinationDetail destination={open} /> : null}
    </div>
  )
}

function Header() {
  const { view, setView, state } = useTrip()

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-lg">
      <div className="mx-auto flex h-[60px] w-full max-w-7xl items-center gap-3 px-4 sm:h-[68px] sm:px-6">
        <button
          type="button"
          onClick={() => setView("explore")}
          className="flex items-center gap-2.5 text-left"
          aria-label="Weekender home"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-clay text-white">
            <Compass className="h-5 w-5" strokeWidth={1.9} aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[19px] tracking-tight text-ink">Weekender</span>
            <span className="hidden text-[11.5px] text-ink-3 sm:block">
              {trip.name} · {weekendLabel(state.nights)}
            </span>
          </span>
        </button>

        <nav className="ml-auto hidden items-center gap-1 rounded-xl bg-card/70 p-1 ring-1 ring-line md:flex">
          {NAV.map((n) => {
            const Icon = n.icon
            const active = view === n.key
            return (
              <button
                key={n.key}
                type="button"
                onClick={() => setView(n.key)}
                aria-current={active ? "page" : undefined}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors ${
                  active ? "bg-ink text-paper" : "text-ink-2 hover:bg-sand hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.9} aria-hidden />
                {n.label}
              </button>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-4">
          <div className="hidden -space-x-2 lg:flex">
            {crew.map((m) => (
              <Avatar key={m.id} member={m} size="sm" ring />
            ))}
          </div>
          <TripSettings />
        </div>
      </div>
    </header>
  )
}

function TripSettings() {
  const { state, set, dispatch, toast } = useTrip()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center gap-2 rounded-xl border border-line-2 bg-card px-3 text-[13px] font-medium text-ink transition-colors hover:border-ink-3"
      >
        <Settings2 className="h-4 w-4" strokeWidth={1.9} aria-hidden />
        <span className="hidden sm:inline">
          {state.travelers} · {currency(state.budgetCap)}
        </span>
        <span className="sr-only">Trip settings</span>
      </button>

      {open ? (
        <Sheet open onClose={() => setOpen(false)} labelledBy="trip-settings-title">
          <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
            <div>
              <Eyebrow>Trip settings</Eyebrow>
              <h2 id="trip-settings-title" className="mt-1 font-display text-2xl text-ink">
                {trip.name}
              </h2>
              <p className="mt-0.5 text-[13px] text-ink-3">
                {weekendLabel(state.nights)} · leaving from {trip.origin}
              </p>
            </div>
            <SheetClose onClose={() => setOpen(false)} />
          </div>

          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
            <div>
              <Slider
                id="travelers"
                label="How many are going"
                min={2}
                max={10}
                value={state.travelers}
                onChange={(travelers) => set({ travelers })}
                display={`${state.travelers} people`}
              />
              <p className="mt-1 text-[12.5px] leading-5 text-ink-3">
                The place you rent splits across everyone, so more people means a cheaper night each —
                until you outgrow the listing and need a second room.
              </p>
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-[13px] font-medium text-ink-2">How long</p>
                <p className="text-[13px] font-semibold text-ink">{weekendLabel(state.nights)}</p>
              </div>
              <div className="mt-1.5">
                <Segmented
                  label="Nights away"
                  value={String(state.nights)}
                  onChange={(v) => set({ nights: Number(v) })}
                  options={[
                    { value: "2", label: "2 nights" },
                    { value: "3", label: "3 nights" },
                  ]}
                />
              </div>
              <p className="mt-1.5 text-[12.5px] leading-5 text-ink-3">
                A third night means leaving Thursday evening — cheaper per night, one more day of food.
              </p>
            </div>

            <div>
              <Slider
                id="settings-budget"
                label="Budget each"
                min={350}
                max={950}
                step={25}
                value={state.budgetCap}
                onChange={(budgetCap) => set({ budgetCap })}
                display={currency(state.budgetCap)}
              />
              <p className="mt-1 text-[12.5px] leading-5 text-ink-3">
                Anything above this is hidden from Explore and marked over budget everywhere else.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-ink-3" strokeWidth={1.9} aria-hidden />
                <Eyebrow>The crew and what they asked for</Eyebrow>
              </div>
              <ul className="mt-2.5 space-y-2.5">
                {crew.map((m) => (
                  <li key={m.id} className="flex items-center gap-3">
                    <Avatar member={m} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-semibold text-ink">
                        {m.name}
                        <span className="ml-1.5 font-normal text-ink-3">{m.role}</span>
                      </p>
                      <p className="text-[12px] text-ink-3">Wants: {m.wants.join(", ")}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-line bg-paper/60 px-5 py-3.5">
            <button
              type="button"
              onClick={() => {
                dispatch({ type: "reset" })
                setOpen(false)
                toast("Demo reset — votes, filters and the plan are back to the start")
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-ink-3 transition-colors hover:bg-clay-tint hover:text-clay"
            >
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.9} />
              Reset the demo
            </button>
            <Button variant="dark" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </Sheet>
      ) : null}
    </>
  )
}

function CompareTray({ onOpen }: { onOpen: () => void }) {
  const { state, dispatch } = useTrip()
  const picked = state.compare.map((id) => destinationById.get(id)).filter(Boolean)

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[86px] z-30 flex justify-center px-4 sm:bottom-6">
      <div className="wk-pop pointer-events-auto flex items-center gap-3 rounded-2xl border border-line bg-card/95 p-2.5 pl-3 shadow-[0_16px_40px_-18px_rgb(27_23_18/0.5)] backdrop-blur">
        <div className="flex -space-x-2">
          {picked.map((d) =>
            d ? (
              <span
                key={d.id}
                className="h-9 w-9 overflow-hidden rounded-lg ring-2 ring-card"
                title={d.name}
              >
                <DestinationArt destination={d} className="h-full w-full" />
              </span>
            ) : null,
          )}
        </div>
        <span className="hidden text-[13px] text-ink-2 sm:inline">
          {state.compare.length} of {MAX_COMPARE} picked
        </span>
        <Button variant="dark" size="sm" onClick={onOpen}>
          Compare
        </Button>
        <button
          type="button"
          onClick={() => dispatch({ type: "set", patch: { compare: [] } })}
          aria-label="Clear comparison"
          className="grid h-8 w-8 place-items-center rounded-lg text-ink-3 transition-colors hover:bg-sand hover:text-ink"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

function MobileNav() {
  const { view, setView, state } = useTrip()
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur-lg md:hidden"
      aria-label="Sections"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-lg">
        {NAV.map((n) => {
          const Icon = n.icon
          const active = view === n.key
          const badge =
            n.key === "compare" && state.compare.length > 0 ? state.compare.length : undefined
          return (
            <button
              key={n.key}
              type="button"
              onClick={() => setView(n.key)}
              aria-current={active ? "page" : undefined}
              className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                active ? "text-clay" : "text-ink-3"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.1 : 1.8} aria-hidden />
              {n.label}
              {badge ? (
                <span className="absolute right-[26%] top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-clay px-1 text-[9.5px] font-bold text-white">
                  {badge}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function Toasts() {
  const { toasts, dismissToast } = useTrip()
  if (toasts.length === 0) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 top-[70px] z-40 flex flex-col items-center gap-2 px-4 sm:top-[80px]">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="wk-pop pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-xl border border-line bg-ink px-3.5 py-2.5 text-paper shadow-lg"
        >
          {t.tone === "success" ? (
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-pine text-white">
              <Check className="h-3 w-3" strokeWidth={3.2} />
            </span>
          ) : null}
          <span className="min-w-0 flex-1 text-[13px] leading-5">{t.message}</span>
          {t.action ? (
            <button
              type="button"
              onClick={() => {
                t.action?.run()
                dismissToast(t.id)
              }}
              className="shrink-0 rounded-lg px-2 py-1 text-[12.5px] font-semibold text-paper/90 underline-offset-2 transition-colors hover:bg-white/10 hover:text-white"
            >
              {t.action.label}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => dismissToast(t.id)}
            aria-label="Dismiss"
            className="shrink-0 rounded-lg p-1 text-paper/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2.2} />
          </button>
        </div>
      ))}
    </div>
  )
}
