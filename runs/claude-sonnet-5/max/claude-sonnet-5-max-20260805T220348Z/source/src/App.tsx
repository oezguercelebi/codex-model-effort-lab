import { useEffect, useMemo, useState } from "react"
import { DestinationsPage } from "./components/DestinationsPage"
import { Header } from "./components/Header"
import { ItineraryPage } from "./components/ItineraryPage"
import { useToast } from "./components/ToastProvider"
import { friends, initialVotes, YOU_ID } from "./data/friends"
import { useLocalStorage } from "./hooks/useLocalStorage"
import type { Destination, TabKey, VotesState } from "./types"
import { getTripWeekend, getVotingDeadline } from "./utils/dates"

export default function App() {
  const { showToast } = useToast()
  const [votes, setVotes] = useLocalStorage<VotesState>("weekender:votes", initialVotes)
  const [activeTab, setActiveTab] = useLocalStorage<TabKey>("weekender:activeTab", "destinations")
  const [previewDestinationId, setPreviewDestinationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const tripWeekend = useMemo(() => getTripWeekend(), [])
  const votingDeadline = useMemo(() => getVotingDeadline(), [])

  useEffect(() => {
    const id = window.setTimeout(() => setIsLoading(false), 700)
    return () => window.clearTimeout(id)
  }, [])

  function handleVote(destination: Destination) {
    const wasVotingForThis = votes[YOU_ID] === destination.id
    setVotes((current) => ({ ...current, [YOU_ID]: wasVotingForThis ? null : destination.id }))
    showToast(
      wasVotingForThis ? "Vote removed" : `You voted for ${destination.name}`,
      wasVotingForThis ? "default" : "success",
    )
  }

  function handlePreviewItinerary(destinationId: string) {
    setPreviewDestinationId(destinationId)
    setActiveTab("itinerary")
  }

  function handleReset() {
    setVotes(initialVotes)
    setPreviewDestinationId(null)
    setActiveTab("destinations")
    showToast("Demo reset to the original picks")
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <Header friends={friends} tripWeekend={tripWeekend} activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === "destinations" ? (
          <DestinationsPage
            votes={votes}
            onVote={handleVote}
            friends={friends}
            votingDeadline={votingDeadline}
            isLoading={isLoading}
            onPreviewItinerary={handlePreviewItinerary}
          />
        ) : (
          <ItineraryPage
            votes={votes}
            friends={friends}
            previewDestinationId={previewDestinationId}
            onPreview={setPreviewDestinationId}
            onClearPreview={() => setPreviewDestinationId(null)}
            tripWeekend={tripWeekend}
            onGoToTab={setActiveTab}
          />
        )}
      </main>
      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-2 text-center sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-medium text-stone-400 underline-offset-2 transition hover:text-stone-600 hover:underline"
        >
          Reset demo data
        </button>
      </footer>
    </div>
  )
}
