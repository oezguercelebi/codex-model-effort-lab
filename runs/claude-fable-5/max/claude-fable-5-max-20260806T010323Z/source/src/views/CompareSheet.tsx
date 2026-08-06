import { Crown, Heart, X } from "lucide-react"
import { FRIENDS } from "../data"
import type { Destination, Standing } from "../types"
import { bestTravel, budgetFitCount, budgetTotal, cx, duration, euro } from "../utils"
import { DestinationArt } from "../components/Art"
import { AvatarStack, BudgetStack, Modal, Tag, TravelIcon, TRAVEL_LABELS } from "../components/ui"

export function CompareSheet({
  destinations,
  standings,
  yourVotes,
  onToggleVote,
  onRemove,
  onClose,
}: {
  destinations: Destination[]
  standings: Map<string, Standing>
  yourVotes: string[]
  onToggleVote: (id: string) => void
  onRemove: (id: string) => void
  onClose: () => void
}) {
  const minCost = Math.min(...destinations.map((d) => budgetTotal(d.budget)))
  const minTime = Math.min(...destinations.map((d) => bestTravel(d).durationMin))
  const maxFit = Math.max(...destinations.map((d) => budgetFitCount(d)))
  const maxTemp = Math.max(...destinations.map((d) => d.tempHigh))
  const maxVotes = Math.max(...destinations.map((d) => standings.get(d.id)?.count ?? 0))

  return (
    <Modal onClose={onClose} label="Compare destinations" wide>
      <div className="p-5 sm:p-6">
        <h2 className="text-xl font-semibold tracking-tight text-stone-900">Side by side</h2>
        <p className="mt-1 text-sm text-stone-500">
          The best value in each row gets a crown. May the group chat stay civil.
        </p>

        <div className="scrollbar-thin -mx-5 mt-4 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
          <table className="w-full min-w-[540px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="w-24 min-w-24" aria-label="Attribute" />
                {destinations.map((d) => (
                  <th key={d.id} className="px-2 pb-3 text-left align-top font-normal">
                    <div className="relative overflow-hidden rounded-2xl border border-stone-200">
                      <DestinationArt art={d.art} className="h-16 w-full sm:h-20" />
                      <button
                        type="button"
                        onClick={() => onRemove(d.id)}
                        aria-label={`Remove ${d.name} from comparison`}
                        className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-white/85 text-stone-500 shadow-sm backdrop-blur transition hover:text-stone-900"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                    <p className="mt-2 text-sm font-semibold tracking-tight text-stone-900">
                      {d.name}
                    </p>
                    <p className="text-xs font-normal text-stone-400">{d.country}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row label="Weekend cost">
                {destinations.map((d) => {
                  const total = budgetTotal(d.budget)
                  return (
                    <Cell key={d.id} best={total === minCost}>
                      <span className="text-base font-semibold tabular-nums tracking-tight text-stone-900">
                        {euro(total)}
                      </span>
                      <span className="ml-1 text-xs text-stone-400">pp</span>
                      <BudgetStack budget={d.budget} className="mt-2 h-2" />
                    </Cell>
                  )
                })}
              </Row>
              <Row label="Fits budgets">
                {destinations.map((d) => {
                  const fit = budgetFitCount(d)
                  return (
                    <Cell key={d.id} best={fit === maxFit}>
                      <span className="font-semibold tabular-nums text-stone-900">{fit}</span>
                      <span className="text-stone-400"> of {FRIENDS.length} friends</span>
                    </Cell>
                  )
                })}
              </Row>
              <Row label="Fastest route">
                {destinations.map((d) => {
                  const t = bestTravel(d)
                  return (
                    <Cell key={d.id} best={t.durationMin === minTime}>
                      <span className="inline-flex items-center gap-1.5 font-semibold text-stone-900">
                        <TravelIcon mode={t.mode} className="size-3.5 text-stone-400" />
                        {duration(t.durationMin)}
                      </span>
                      <p className="mt-0.5 text-xs text-stone-500">
                        {TRAVEL_LABELS[t.mode]} · {euro(t.pricePerPerson)} pp
                      </p>
                    </Cell>
                  )
                })}
              </Row>
              <Row label="September">
                {destinations.map((d) => (
                  <Cell key={d.id} best={d.tempHigh === maxTemp}>
                    <span className="font-semibold tabular-nums text-stone-900">
                      {d.tempHigh}° / {d.tempLow}°
                    </span>
                    <p className="mt-0.5 text-xs text-stone-500">{d.rainChance}% rain chance</p>
                  </Cell>
                ))}
              </Row>
              <Row label="Group votes">
                {destinations.map((d) => {
                  const s = standings.get(d.id)
                  const count = s?.count ?? 0
                  return (
                    <Cell key={d.id} best={count === maxVotes && maxVotes > 0}>
                      <span className="font-semibold tabular-nums text-stone-900">{count}</span>
                      <span className="text-stone-400">
                        {" "}
                        {count === 1 ? "vote" : "votes"}
                      </span>
                      {count > 0 && (
                        <div className="mt-1.5">
                          <AvatarStack friends={s?.voters ?? []} />
                        </div>
                      )}
                    </Cell>
                  )
                })}
              </Row>
              <Row label="Vibe">
                {destinations.map((d) => (
                  <Cell key={d.id}>
                    <div className="flex flex-wrap gap-1">
                      {d.vibes.map((v) => (
                        <Tag key={v}>{v}</Tag>
                      ))}
                    </div>
                  </Cell>
                ))}
              </Row>
              <Row label="The stay">
                {destinations.map((d) => (
                  <Cell key={d.id}>
                    <p className="text-xs leading-5 text-stone-600">{d.stay}</p>
                  </Cell>
                ))}
              </Row>
              <tr>
                <th aria-hidden="true" />
                {destinations.map((d) => {
                  const voted = yourVotes.includes(d.id)
                  return (
                    <td key={d.id} className="px-2 pt-3">
                      <button
                        type="button"
                        onClick={() => onToggleVote(d.id)}
                        aria-pressed={voted}
                        className={cx(
                          "inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-full text-xs font-semibold transition active:scale-[0.97]",
                          voted
                            ? "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200"
                            : "bg-stone-900 text-white hover:bg-stone-700",
                        )}
                      >
                        <Heart className="size-3.5" fill={voted ? "currentColor" : "none"} />
                        {voted ? "Voted" : "Vote"}
                      </button>
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr>
      <th
        scope="row"
        className="border-b border-stone-100 py-3 pr-3 text-left align-top text-xs font-medium text-stone-400"
      >
        {label}
      </th>
      {children}
    </tr>
  )
}

function Cell({ children, best = false }: { children: React.ReactNode; best?: boolean }) {
  return (
    <td className="border-b border-stone-100 px-2 py-3 align-top">
      <div className={cx("relative rounded-xl p-2", best && "bg-amber-50")}>
        {best && (
          <Crown
            className="absolute right-2 top-2 size-3.5 text-amber-500"
            aria-label="Best in this row"
          />
        )}
        <div className={best ? "pr-5" : undefined}>{children}</div>
      </div>
    </td>
  )
}
