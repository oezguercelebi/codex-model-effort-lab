import { CalendarCheck, Compass, Moon, RotateCcw, Sun, Vote as VoteIcon } from "lucide-react"
import { StoreProvider, useStore, type ViewKey } from "./lib/store"
import { Explore } from "./views/Explore"
import { Vote } from "./views/Vote"
import { Plan } from "./views/Plan"
import { cx } from "./components/ui"

const NAV: { id: ViewKey; label: string; icon: typeof Compass }[] = [
  { id: "explore", label: "Explore", icon: Compass },
  { id: "vote", label: "Vote", icon: VoteIcon },
  { id: "plan", label: "Plan", icon: CalendarCheck },
]

function Shell() {
  const { view, setView, theme, toggleTheme, resetAll, locked, winner, yourVoteCount, scored } =
    useStore()
  const pending = scored.length - yourVoteCount

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 transition-colors dark:bg-stone-950 dark:text-stone-100">
      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-stone-100/85 backdrop-blur-md dark:border-white/10 dark:bg-stone-950/85">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setView("explore")}
            className="flex items-center gap-2 rounded-full pr-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600"
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-sm font-bold text-white shadow-sm">
              W
            </span>
            <span className="text-base font-semibold tracking-tight">Weekender</span>
          </button>

          <nav aria-label="Sections" className="ml-auto hidden sm:block">
            <div className="flex rounded-full bg-stone-200/70 p-1 dark:bg-white/10">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => setView(n.id)}
                  aria-current={view === n.id ? "page" : undefined}
                  className={cx(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
                    view === n.id
                      ? "bg-white text-stone-900 shadow-sm dark:bg-stone-800 dark:text-white"
                      : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white",
                  )}
                >
                  <n.icon size={14} />
                  {n.label}
                  {n.id === "vote" && pending > 0 ? (
                    <span className="ml-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-amber-950">
                      {pending}
                    </span>
                  ) : null}
                  {n.id === "plan" && locked ? (
                    <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-teal-500" />
                  ) : null}
                </button>
              ))}
            </div>
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:ml-0">
            <button
              type="button"
              onClick={resetAll}
              title="Reset the demo"
              aria-label="Reset the demo"
              className="grid h-9 w-9 place-items-center rounded-full text-stone-500 transition-colors hover:bg-stone-200/70 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <RotateCcw size={16} />
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              title="Toggle theme"
              aria-label="Toggle colour theme"
              className="grid h-9 w-9 place-items-center rounded-full text-stone-500 transition-colors hover:bg-stone-200/70 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-5 pb-28 sm:px-6 sm:pb-10">
        {view === "explore" ? <Explore /> : null}
        {view === "vote" ? <Vote /> : null}
        {view === "plan" ? <Plan /> : null}
      </main>

      <nav
        aria-label="Sections"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 backdrop-blur-md sm:hidden dark:border-white/10 dark:bg-stone-900/95"
      >
        <div className="flex">
          {NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => setView(n.id)}
              aria-current={view === n.id ? "page" : undefined}
              className={cx(
                "relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors",
                view === n.id
                  ? "text-stone-900 dark:text-white"
                  : "text-stone-400 dark:text-stone-500",
              )}
            >
              <n.icon size={19} />
              {n.label}
              {n.id === "vote" && pending > 0 ? (
                <span className="absolute top-1.5 right-1/2 mr-2 grid h-4 min-w-4 place-items-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-amber-950">
                  {pending}
                </span>
              ) : null}
              {view === n.id ? (
                <span className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-stone-900 dark:bg-white" />
              ) : null}
            </button>
          ))}
        </div>
      </nav>

      <footer className="hidden border-t border-stone-200 py-6 text-center text-xs text-stone-400 sm:block dark:border-white/10">
        Weekender · sample data for a group of friends heading somewhere
        {winner ? ` · currently leaning ${(locked ?? winner).destination.name}` : ""}
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
