import { forwardRef } from "react"
import { MapPin, Moon, RotateCcw, Search, Users, X } from "lucide-react"
import { MEMBERS, ORIGINS, VIBES } from "../data/trip"
import { cx, duration, money } from "../lib/format"
import { useTrip } from "../state/store"
import type { OriginId } from "../types"
import { Avatar, Button, RangeField, Segmented, Switch, ToggleChip } from "./ui"

export const SearchInput = forwardRef<HTMLInputElement, { value: string; onChange: (v: string) => void }>(
  function SearchInput({ value, onChange }, ref) {
    return (
      <div className="relative">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
          aria-hidden="true"
        />
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search destinations"
          aria-label="Search destinations"
          className="h-10 w-full rounded-xl border border-line bg-surface pl-9 pr-9 text-[13px] font-medium text-ink outline-none transition placeholder:text-ink-faint focus:border-brand"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-ink-faint transition hover:bg-surface-2 hover:text-ink"
          >
            <X size={14} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    )
  },
)

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-faint">{title}</h3>
      {children}
    </section>
  )
}

export function FiltersPanel({
  searchRef,
}: {
  searchRef?: React.RefObject<HTMLInputElement | null>
}) {
  const { state, dispatch, crew, cards } = useTrip()

  const cheapest = Math.min(...cards.map((card) => card.budget.total))
  const quickest = Math.min(...cards.map((card) => card.travel.hours))

  return (
    <div className="space-y-6">
      <Group title="Trip setup">
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-ink">
            <MapPin size={13} className="text-ink-faint" aria-hidden="true" />
            Leaving from
          </p>
          <Segmented
            label="Departure city"
            size="sm"
            value={state.originId}
            onChange={(originId: OriginId) => dispatch({ type: "origin", originId })}
            options={ORIGINS.map((origin) => ({ value: origin.id, label: origin.city }))}
          />
        </div>

        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-ink">
            <Moon size={13} className="text-ink-faint" aria-hidden="true" />
            Length
          </p>
          <Segmented
            label="Number of nights"
            size="sm"
            value={String(state.nights)}
            onChange={(value) => dispatch({ type: "nights", nights: Number(value) })}
            options={[
              { value: "2", label: "Fri–Sun" },
              { value: "3", label: "Thu–Sun" },
            ]}
          />
        </div>

        <div>
          <p className="mb-2 flex items-center justify-between gap-2 text-[13px] font-semibold text-ink">
            <span className="flex items-center gap-1.5">
              <Users size={13} className="text-ink-faint" aria-hidden="true" />
              Who's coming
            </span>
            <span className="text-[11px] font-bold text-brand">{crew.length} in</span>
          </p>
          <ul className="space-y-1">
            {MEMBERS.map((member) => {
              const attending = state.attending[member.id] ?? member.attending
              return (
                <li key={member.id}>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({ type: "attending", memberId: member.id, value: !attending })
                    }
                    aria-pressed={attending}
                    className={cx(
                      "flex w-full items-center gap-2.5 rounded-xl border p-1.5 pr-2.5 text-left transition",
                      attending
                        ? "border-line bg-surface-2"
                        : "border-transparent bg-transparent hover:bg-surface-2",
                    )}
                  >
                    <Avatar member={member} size={26} dim={!attending} />
                    <span className="min-w-0 flex-1">
                      <span
                        className={cx(
                          "block truncate text-[12.5px] font-semibold",
                          attending ? "text-ink" : "text-ink-faint",
                        )}
                      >
                        {member.name}
                      </span>
                      <span className="block truncate text-[10.5px] leading-3.5 text-ink-faint">
                        {member.note}
                      </span>
                    </span>
                    <span
                      className={cx(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold",
                        attending ? "bg-yes-soft text-yes" : "bg-surface-3 text-ink-faint",
                      )}
                    >
                      {attending ? "In" : "Out"}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </Group>

      <div className="h-px bg-line" />

      <Group title="Narrow it down">
        <SearchInput
          ref={searchRef}
          value={state.search}
          onChange={(value) => dispatch({ type: "search", value })}
        />

        <div className="space-y-1">
          <RangeField
            label="Budget per person"
            display={money(state.budgetCap)}
            value={state.budgetCap}
            min={150}
            max={900}
            step={10}
            onChange={(value) => dispatch({ type: "budgetCap", value })}
            hint={`Cheapest weekend right now is ${money(cheapest)}`}
          />
          <Switch
            checked={state.strictBudget}
            onChange={(value) => dispatch({ type: "strict", field: "strictBudget", value })}
            label="Hide anything over budget"
          />
        </div>

        <div className="space-y-1">
          <RangeField
            label="Max travel time"
            display={duration(state.maxTravelHours)}
            value={state.maxTravelHours}
            min={1.5}
            max={12}
            step={0.5}
            onChange={(value) => dispatch({ type: "maxTravelHours", value })}
            hint={`Closest option is ${duration(quickest)} each way`}
          />
          <Switch
            checked={state.strictTravel}
            onChange={(value) => dispatch({ type: "strict", field: "strictTravel", value })}
            label="Hide anything further away"
          />
        </div>

        <div>
          <p className="mb-2 text-[13px] font-semibold text-ink">Vibe</p>
          <div className="flex flex-wrap gap-1.5">
            {VIBES.map((vibe) => (
              <ToggleChip
                key={vibe.id}
                active={state.vibes.includes(vibe.id)}
                onClick={() => dispatch({ type: "vibe", vibe: vibe.id })}
              >
                {vibe.label}
              </ToggleChip>
            ))}
          </div>
        </div>
      </Group>

      <Button
        variant="ghost"
        size="sm"
        icon={RotateCcw}
        className="w-full"
        onClick={() => dispatch({ type: "resetFilters" })}
      >
        Reset filters
      </Button>
    </div>
  )
}
