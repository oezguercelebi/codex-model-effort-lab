import { useCallback, useEffect, useRef, useState } from "react"
import { RotateCcw, Sparkles } from "lucide-react"
import { AppHeader, TabBar } from "./components/AppHeader"
import { DestinationDetail } from "./components/DestinationDetail"
import { Modal } from "./components/Modal"
import { Button } from "./components/ui"
import { TRIP_DATES, TRIP_NAME } from "./data/trip"
import { formatRange } from "./lib/format"
import { useBooted, useTheme } from "./lib/hooks"
import { TripProvider, useTrip } from "./state/store"
import { ToastProvider, useToast } from "./state/toast"
import { CompareView } from "./views/CompareView"
import { ExploreView } from "./views/ExploreView"
import { PlanView } from "./views/PlanView"
import { VoteView } from "./views/VoteView"
import type { ViewId } from "./types"

function Shell() {
  const { cards, cardById, dispatch } = useTrip()
  const { push } = useToast()
  const [theme, toggleTheme] = useTheme()
  const booted = useBooted()

  const [view, setView] = useState<ViewId>("explore")
  const [openId, setOpenId] = useState<string | null>(null)
  const [planFocus, setPlanFocus] = useState<string | null>(null)
  const [resetOpen, setResetOpen] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const pendingVotes = cards.filter((card) => !card.yourVote).length
  const openCard = openId ? cardById.get(openId) : undefined

  const goTo = useCallback((next: ViewId) => {
    setView(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const openPlan = useCallback(
    (destinationId: string) => {
      setPlanFocus(destinationId)
      goTo("plan")
    },
    [goTo],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      if (typing || event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key === "/") {
        event.preventDefault()
        if (view !== "explore") goTo("explore")
        window.setTimeout(() => searchRef.current?.focus(), 60)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [goTo, view])

  return (
    <div className="min-h-screen bg-canvas">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-brand focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-brand"
      >
        Skip to content
      </a>

      <AppHeader
        view={view}
        onView={goTo}
        theme={theme}
        onToggleTheme={toggleTheme}
        pendingVotes={pendingVotes}
      />

      <main id="main" className="mx-auto max-w-[1400px] px-4 pb-28 pt-6 sm:px-6 sm:pt-8 md:pb-16">
        {view === "explore" ? (
          <ExploreView
            loading={!booted}
            onOpen={setOpenId}
            searchRef={searchRef}
            onGoToCompare={() => goTo("compare")}
          />
        ) : null}
        {view === "compare" ? <CompareView onOpen={setOpenId} /> : null}
        {view === "vote" ? <VoteView onOpen={setOpenId} onOpenPlan={openPlan} /> : null}
        {view === "plan" ? (
          <PlanView focusId={planFocus} onFocus={setPlanFocus} onOpen={setOpenId} />
        ) : null}

        <footer className="mt-14 flex flex-col items-start gap-3 border-t border-line pt-6 text-[12px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl leading-5">
            <span className="font-semibold text-ink-soft">
              <Sparkles size={12} className="mr-1 inline align-[-1px]" aria-hidden="true" />
              Weekender
            </span>{" "}
            — {TRIP_NAME}, {formatRange(TRIP_DATES.friday, TRIP_DATES.sunday)}. Sample data for a
            demo trip: prices, travel times and weather are realistic estimates, not live quotes.
            Your votes and settings are saved in this browser.
          </p>
          <Button size="sm" variant="ghost" icon={RotateCcw} onClick={() => setResetOpen(true)}>
            Reset the demo
          </Button>
        </footer>
      </main>

      <TabBar view={view} onView={goTo} pendingVotes={pendingVotes} />

      <Modal
        open={Boolean(openCard)}
        onClose={() => setOpenId(null)}
        title={openCard?.destination.name ?? "Destination"}
        label={`${openCard?.destination.name ?? ""} details`}
      >
        {openCard ? (
          <DestinationDetail card={openCard} onOpenPlan={openPlan} onClose={() => setOpenId(null)} />
        ) : null}
      </Modal>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset the demo"
        size="md"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setResetOpen(false)}>
              Keep my changes
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                dispatch({ type: "resetAll" })
                setPlanFocus(null)
                setResetOpen(false)
                goTo("explore")
                push({
                  message: "Demo reset",
                  detail: "Votes, filters and checklists are back to the start.",
                })
              }}
            >
              Reset everything
            </Button>
          </div>
        }
      >
        <div className="p-5 pr-12">
          <h2 className="text-lg font-bold tracking-tight text-ink">Start the weekend over?</h2>
          <p className="mt-2 text-[13.5px] leading-6 text-ink-soft">
            This clears your votes, filters, travel choices, the locked-in destination and both
            checklists, then puts the group poll back where it started. Your friends' seeded votes
            come back too.
          </p>
        </div>
      </Modal>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <TripProvider>
        <Shell />
      </TripProvider>
    </ToastProvider>
  )
}
