import { CalendarDays, Columns3, Compass, Moon, Sun, Timer, Vote } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { TRIP_DATES, TRIP_NAME } from "../data/trip"
import { cx, formatRange, plural } from "../lib/format"
import { useTrip } from "../state/store"
import type { Theme } from "../lib/hooks"
import type { ViewId } from "../types"
import { AvatarStack, IconButton } from "./ui"

export const NAV: { id: ViewId; label: string; icon: LucideIcon }[] = [
  { id: "explore", label: "Explore", icon: Compass },
  { id: "compare", label: "Compare", icon: Columns3 },
  { id: "vote", label: "Vote", icon: Vote },
  { id: "plan", label: "Plan", icon: CalendarDays },
]

function Logo() {
  return (
    <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-brand shadow-soft">
      <svg viewBox="0 0 32 32" className="size-9" aria-hidden="true">
        <circle cx="21" cy="11" r="5.5" fill="var(--color-on-brand)" opacity="0.92" />
        <path
          d="M0 26 C6 18 11 22 16 25 C21 28 27 22 32 19 L32 32 L0 32 Z"
          fill="var(--color-on-brand)"
          opacity="0.55"
        />
        <path d="M0 32 C7 24 13 29 19 30 C24 31 28 29 32 27 L32 32 Z" fill="var(--color-on-brand)" />
      </svg>
    </span>
  )
}

export function AppHeader({
  view,
  onView,
  theme,
  onToggleTheme,
  pendingVotes,
}: {
  view: ViewId
  onView: (view: ViewId) => void
  theme: Theme
  onToggleTheme: () => void
  pendingVotes: number
}) {
  const { crew, state } = useTrip()

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={() => onView("explore")}
          className="flex min-w-0 items-center gap-2.5 text-left"
        >
          <Logo />
          <span className="min-w-0">
            <span className="block text-[17px] font-bold leading-tight tracking-tight text-ink">
              Weekender
            </span>
            <span className="hidden truncate text-[11.5px] font-medium text-ink-soft sm:block">
              {TRIP_NAME} · {formatRange(TRIP_DATES.friday, TRIP_DATES.sunday)}
            </span>
          </span>
        </button>

        <nav aria-label="Sections" className="mx-auto hidden md:block">
          <ul className="flex items-center gap-1 rounded-xl border border-line bg-surface p-1 shadow-soft">
            {NAV.map((item) => {
              const active = item.id === view
              const Icon = item.icon
              const badge =
                item.id === "compare" && state.compare.length
                  ? String(state.compare.length)
                  : item.id === "vote" && pendingVotes
                    ? String(pendingVotes)
                    : null
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onView(item.id)}
                    aria-current={active ? "page" : undefined}
                    className={cx(
                      "flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold transition",
                      active
                        ? "bg-brand text-on-brand shadow-soft"
                        : "text-ink-soft hover:bg-surface-2 hover:text-ink",
                    )}
                  >
                    <Icon size={14} aria-hidden="true" />
                    {item.label}
                    {badge ? (
                      <span
                        className={cx(
                          "wk-tabular grid min-w-4 place-items-center rounded-full px-1 text-[10px] font-bold",
                          active ? "bg-on-brand/25 text-on-brand" : "bg-brand-soft text-brand",
                        )}
                      >
                        {badge}
                      </span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <span className="hidden items-center gap-2 rounded-xl border border-line bg-surface px-2.5 py-1.5 lg:flex">
            <AvatarStack members={crew} size={24} max={4} />
            <span className="text-[11.5px] font-semibold text-ink-soft">
              {plural(crew.length, "person", "people")}
            </span>
          </span>
          <span className="hidden items-center gap-1.5 rounded-xl border border-line bg-surface px-2.5 py-2 text-[11.5px] font-semibold text-ink-soft xl:flex">
            <Timer size={13} className="text-brand" aria-hidden="true" />
            {TRIP_DATES.daysToDeadline > 0
              ? `Poll closes in ${plural(TRIP_DATES.daysToDeadline, "day")}`
              : "Poll closes today"}
          </span>
          <IconButton
            icon={theme === "dark" ? Sun : Moon}
            label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={onToggleTheme}
          />
        </div>
      </div>
    </header>
  )
}

export function TabBar({
  view,
  onView,
  pendingVotes,
}: {
  view: ViewId
  onView: (view: ViewId) => void
  pendingVotes: number
}) {
  const { state } = useTrip()

  return (
    <nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-canvas/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="flex items-stretch">
        {NAV.map((item) => {
          const active = item.id === view
          const Icon = item.icon
          const badge =
            item.id === "compare" && state.compare.length
              ? state.compare.length
              : item.id === "vote" && pendingVotes
                ? pendingVotes
                : null
          return (
            <li key={item.id} className="flex-1">
              <button
                type="button"
                onClick={() => onView(item.id)}
                aria-current={active ? "page" : undefined}
                className={cx(
                  "relative flex w-full flex-col items-center gap-1 py-2.5 text-[10.5px] font-semibold transition",
                  active ? "text-brand" : "text-ink-faint",
                )}
              >
                <span className="relative">
                  <Icon size={19} aria-hidden="true" />
                  {badge ? (
                    <span className="wk-tabular absolute -right-2.5 -top-1.5 grid min-w-[15px] place-items-center rounded-full bg-brand px-1 text-[9px] font-bold text-on-brand">
                      {badge}
                    </span>
                  ) : null}
                </span>
                {item.label}
                <span
                  className={cx(
                    "absolute inset-x-5 top-0 h-0.5 rounded-full transition",
                    active ? "bg-brand" : "bg-transparent",
                  )}
                />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
