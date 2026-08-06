import { Car, Heart, Plane, Scale, X } from "lucide-react"
import { destinations, budgetTotal } from "../data/destinations"
import { friends } from "../data/friends"
import { getIcon } from "../lib/icons"

export function CompareView({
  compareIds,
  votes,
  onRemove,
  onToggleVote,
  onViewItinerary,
  onBrowse,
}: {
  compareIds: string[]
  votes: Record<string, string[]>
  onRemove: (id: string) => void
  onToggleVote: (id: string) => void
  onViewItinerary: (id: string) => void
  onBrowse: () => void
}) {
  const items = compareIds
    .map((id) => destinations.find((d) => d.id === id))
    .filter((d): d is (typeof destinations)[number] => Boolean(d))

  if (items.length < 2) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600">
            <Scale className="h-6 w-6" strokeWidth={2} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-stone-900">Nothing to compare yet</h3>
          <p className="mt-1.5 text-sm text-stone-500">
            Pick 2 or 3 destinations from the Destinations tab using the scale icon on each card.
          </p>
          <button
            onClick={onBrowse}
            className="mt-5 rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Browse destinations
          </button>
        </div>
      </div>
    )
  }

  const budgetRows: { key: keyof (typeof items)[number]["budget"]; label: string }[] = [
    { key: "travel", label: "Travel" },
    { key: "stay", label: "Stay" },
    { key: "food", label: "Food" },
    { key: "activities", label: "Activities" },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <h2 className="text-lg font-semibold text-stone-900">Side-by-side comparison</h2>
      <p className="mt-1 text-sm text-stone-500">Estimated cost is per person, for the full weekend.</p>

      <p className="mt-4 text-xs text-stone-400 sm:hidden">Swipe sideways to see all columns &rarr;</p>
      <div className="mt-2 overflow-x-auto sm:mt-5">
        <table className="w-full min-w-[560px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="w-36" />
              {items.map((d) => {
                const Icon = getIcon(d.icon)
                return (
                  <th key={d.id} className="px-2 pb-3 text-left align-bottom">
                    <div className={`relative flex h-24 flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br p-3 text-white ${d.gradient}`}>
                      <Icon className="absolute -bottom-3 -right-3 h-16 w-16 text-white/15" strokeWidth={1.5} />
                      <button
                        onClick={() => onRemove(d.id)}
                        className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
                        title="Remove from comparison"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <div>
                        <p className="text-sm font-semibold leading-tight">{d.name}</p>
                        <p className="text-[11px] text-white/80">{d.region}</p>
                      </div>
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr>
              <td className="py-2.5 pr-3 font-medium text-stone-500">Travel time</td>
              {items.map((d) => (
                <td key={d.id} className="border-t border-stone-100 px-2 py-2.5">
                  <span className="inline-flex items-center gap-1.5 font-medium text-stone-800">
                    {d.travel.mode === "flight" ? <Plane className="h-3.5 w-3.5 text-stone-400" /> : <Car className="h-3.5 w-3.5 text-stone-400" />}
                    {d.travel.duration}
                  </span>
                </td>
              ))}
            </tr>
            {budgetRows.map((row) => (
              <tr key={row.key}>
                <td className="py-2.5 pr-3 font-medium text-stone-500">{row.label}</td>
                {items.map((d) => (
                  <td key={d.id} className="border-t border-stone-100 px-2 py-2.5 tabular-nums text-stone-700">
                    ${d.budget[row.key]}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="py-2.5 pr-3 font-semibold text-stone-700">Total / person</td>
              {items.map((d) => (
                <td key={d.id} className="border-t border-stone-200 px-2 py-2.5 text-base font-semibold tabular-nums text-stone-900">
                  ${budgetTotal(d.budget)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 pr-3 font-medium text-stone-500">Weather</td>
              {items.map((d) => (
                <td key={d.id} className="border-t border-stone-100 px-2 py-2.5 text-stone-700">
                  {d.weather.high}&deg;/{d.weather.low}&deg; &middot; {d.weather.condition}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 pr-3 font-medium text-stone-500">Vibe</td>
              {items.map((d) => (
                <td key={d.id} className="border-t border-stone-100 px-2 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {d.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 pr-3 font-medium text-stone-500">Votes</td>
              {items.map((d) => {
                const count = votes[d.id]?.length ?? 0
                const votedByYou = votes[d.id]?.includes("you") ?? false
                return (
                  <td key={d.id} className="border-t border-stone-100 px-2 py-2.5">
                    <button
                      onClick={() => onToggleVote(d.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium transition-colors ${
                        votedByYou ? "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      <Heart className="h-3.5 w-3.5" fill={votedByYou ? "currentColor" : "none"} />
                      {count}
                    </button>
                  </td>
                )
              })}
            </tr>
            <tr>
              <td className="py-3 pr-3" />
              {items.map((d) => (
                <td key={d.id} className="border-t border-stone-100 px-2 py-3">
                  <button
                    onClick={() => onViewItinerary(d.id)}
                    className="text-sm font-semibold text-teal-700 hover:text-teal-800"
                  >
                    View itinerary &rarr;
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-stone-400">
        {friends.length} friends in the group &middot; showing {items.length} of 3 possible comparison slots
      </p>
    </div>
  )
}
