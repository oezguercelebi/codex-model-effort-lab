import { useState, type ReactNode } from "react"
import { CalendarDays, ChevronDown, MapPin, SlidersHorizontal, Users, Wallet } from "lucide-react"
import { ORIGINS } from "../lib/data"
import { LODGING_TIERS, formatDateRange, formatMoney } from "../lib/engine"
import { useStore } from "../lib/store"
import type { LodgingTier } from "../lib/types"
import { Button, Segmented, cx } from "./ui"

export function TripBar() {
  const { settings, updateSettings, origin, members } = useStore()
  const [open, setOpen] = useState(false)

  const summary = [
    origin.city,
    formatDateRange(settings.departure, settings.nights),
    `${settings.travelers} people`,
    `${formatMoney(settings.budgetCap)} cap`,
  ].join(" · ")

  return (
    <div className="rounded-3xl border border-stone-200 bg-white shadow-sm dark:border-white/10 dark:bg-stone-900">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left sm:px-5"
      >
        <SlidersHorizontal size={16} className="shrink-0 text-stone-500 dark:text-stone-400" />
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold tracking-[0.12em] text-stone-400 uppercase">
            Trip basics
          </div>
          <div className="truncate text-sm font-medium text-stone-900 dark:text-white">{summary}</div>
        </div>
        <ChevronDown
          size={17}
          className={cx(
            "shrink-0 text-stone-400 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className="animate-fade grid gap-4 border-t border-stone-200 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4 dark:border-white/10">
          <Field icon={<MapPin size={13} />} label="Leaving from">
            <select
              value={settings.originId}
              onChange={(e) => updateSettings({ originId: e.target.value })}
              className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none dark:border-white/15 dark:bg-stone-800 dark:text-white"
            >
              {ORIGINS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.city}, {o.country}
                </option>
              ))}
            </select>
          </Field>

          <Field icon={<CalendarDays size={13} />} label="Leaving on">
            <input
              type="date"
              value={settings.departure}
              onChange={(e) => updateSettings({ departure: e.target.value })}
              className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none dark:border-white/15 dark:bg-stone-800 dark:text-white"
            />
            <div className="mt-2">
              <Segmented<string>
                label="Nights away"
                value={String(settings.nights)}
                onChange={(v) => updateSettings({ nights: Number(v) })}
                options={[
                  { id: "1", label: "1 night" },
                  { id: "2", label: "2 nights" },
                  { id: "3", label: "3 nights" },
                ]}
              />
            </div>
          </Field>

          <Field icon={<Users size={13} />} label={`Group of ${settings.travelers}`}>
            <input
              type="range"
              min={2}
              max={10}
              value={settings.travelers}
              onChange={(e) => updateSettings({ travelers: Number(e.target.value) })}
              className="w-full accent-stone-900 dark:accent-white"
              aria-label="Number of travellers"
            />
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
              {members.length} friends are voting so far.
            </p>
          </Field>

          <Field icon={<Wallet size={13} />} label={`Budget cap ${formatMoney(settings.budgetCap)}`}>
            <input
              type="range"
              min={150}
              max={1200}
              step={10}
              value={settings.budgetCap}
              onChange={(e) => updateSettings({ budgetCap: Number(e.target.value) })}
              className="w-full accent-stone-900 dark:accent-white"
              aria-label="Budget cap per person"
            />
            <div className="mt-2">
              <Segmented<LodgingTier>
                label="Lodging tier"
                value={settings.lodging}
                onChange={(v) => updateSettings({ lodging: v })}
                options={LODGING_TIERS.map((t) => ({ id: t.id, label: t.label, hint: t.hint }))}
              />
            </div>
          </Field>

          <div className="sm:col-span-2 lg:col-span-4">
            <Button size="sm" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Field({
  icon,
  label,
  children,
}: {
  icon: ReactNode
  label: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-stone-500 dark:text-stone-400">
        {icon}
        {label}
      </span>
      {children}
    </label>
  )
}
