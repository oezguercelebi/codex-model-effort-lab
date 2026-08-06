import { useState } from "react"
import { Trophy } from "lucide-react"
import type { Destination } from "../types"
import { getIcon } from "../lib/icons"

interface Row {
  destination: Destination
  votes: number
}

export function VoteChart({ rows }: { rows: Row[] }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const max = Math.max(1, ...rows.map((r) => r.votes))
  const leaderVotes = rows[0]?.votes ?? 0

  return (
    <div className="viz-root rounded-2xl border border-stone-200 bg-white p-5">
      <style>{`
        .viz-root {
          --bar-fill: #2a78d6;
          --bar-fill-lead: #184f95;
          --track: #f0efec;
        }
      `}</style>
      <h3 className="text-sm font-semibold text-stone-900">Votes by destination</h3>
      <p className="mt-0.5 text-xs text-stone-500">Every friend can back more than one favorite</p>

      <div className="mt-4 flex flex-col gap-3">
        {rows.map((row) => {
          const Icon = getIcon(row.destination.icon)
          const widthPct = (row.votes / max) * 100
          const isLeader = row.votes === leaderVotes && row.votes > 0
          const isHovered = hovered === row.destination.id

          return (
            <div
              key={row.destination.id}
              className="group flex items-center gap-3"
              onPointerEnter={() => setHovered(row.destination.id)}
              onPointerLeave={() => setHovered((h) => (h === row.destination.id ? null : h))}
              tabIndex={0}
              onFocus={() => setHovered(row.destination.id)}
              onBlur={() => setHovered((h) => (h === row.destination.id ? null : h))}
              role="img"
              aria-label={`${row.destination.name}: ${row.votes} vote${row.votes === 1 ? "" : "s"}`}
            >
              <div className="flex w-28 shrink-0 items-center gap-1.5 text-sm text-stone-700">
                <Icon className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                <span className="truncate">{row.destination.name}</span>
              </div>
              <div className="relative h-6 flex-1 rounded-full" style={{ background: "var(--track)" }}>
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.max(widthPct, row.votes > 0 ? 6 : 0)}%`,
                    background: isLeader ? "var(--bar-fill-lead)" : "var(--bar-fill)",
                    outline: isHovered ? "2px solid rgba(24,79,149,0.35)" : "none",
                    outlineOffset: "1px",
                  }}
                />
                {isHovered && (
                  <div className="pointer-events-none absolute -top-8 left-0 z-10 whitespace-nowrap rounded-lg bg-stone-900 px-2 py-1 text-xs font-medium text-white shadow-lg">
                    <span className="tabular-nums">{row.votes}</span> vote{row.votes === 1 ? "" : "s"}
                  </div>
                )}
              </div>
              <div className="flex w-8 shrink-0 items-center justify-end gap-1 text-sm font-semibold tabular-nums text-stone-900">
                {isLeader && row.votes > 0 && <Trophy className="h-3.5 w-3.5 text-amber-500" />}
                {row.votes}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
