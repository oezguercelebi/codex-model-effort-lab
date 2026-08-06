import { useMemo, useState } from "react"
import { TripHeader } from "./components/TripHeader"
import { TabNav, type Tab } from "./components/TabNav"
import { DestinationsView } from "./components/DestinationsView"
import { CompareView } from "./components/CompareView"
import { ItineraryView } from "./components/ItineraryView"
import { useLocalStorage } from "./hooks/useLocalStorage"
import { initialVotes } from "./data/votes"
import { destinations } from "./data/destinations"
import { YOU_ID } from "./data/friends"

export default function App() {
  const [tab, setTab] = useState<Tab>("destinations")
  const [votes, setVotes] = useLocalStorage<Record<string, string[]>>("weekender:votes", initialVotes)
  const [compareIds, setCompareIds] = useLocalStorage<string[]>("weekender:compare", [])
  const [itineraryId, setItineraryId] = useState<string | null>(null)

  const leaderId = useMemo(() => {
    let best: string | null = null
    let bestCount = 0
    for (const d of destinations) {
      const count = votes[d.id]?.length ?? 0
      if (count > bestCount) {
        bestCount = count
        best = d.id
      }
    }
    return bestCount > 0 ? best : null
  }, [votes])

  function toggleVote(id: string) {
    setVotes((prev) => {
      const current = prev[id] ?? []
      const hasVoted = current.includes(YOU_ID)
      return {
        ...prev,
        [id]: hasVoted ? current.filter((f) => f !== YOU_ID) : [...current, YOU_ID],
      }
    })
  }

  function toggleCompare(id: string) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  function viewItinerary(id: string) {
    setItineraryId(id)
    setTab("itinerary")
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <TripHeader />
      <TabNav active={tab} onChange={setTab} compareCount={compareIds.length} />

      {tab === "destinations" && (
        <DestinationsView
          votes={votes}
          onToggleVote={toggleVote}
          compareIds={compareIds}
          onToggleCompare={toggleCompare}
          onViewItinerary={viewItinerary}
          onOpenCompare={() => setTab("compare")}
        />
      )}

      {tab === "compare" && (
        <CompareView
          compareIds={compareIds}
          votes={votes}
          onRemove={toggleCompare}
          onToggleVote={toggleVote}
          onViewItinerary={viewItinerary}
          onBrowse={() => setTab("destinations")}
        />
      )}

      {tab === "itinerary" && (
        <ItineraryView
          selectedId={itineraryId ?? leaderId ?? destinations[0].id}
          onSelect={setItineraryId}
          leaderId={leaderId}
          voteCount={(id) => votes[id]?.length ?? 0}
        />
      )}

      <footer className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-stone-400 sm:px-6 lg:px-8">
        Weekender &middot; sample trip data, nothing here is booked or synced.
      </footer>
    </div>
  )
}
