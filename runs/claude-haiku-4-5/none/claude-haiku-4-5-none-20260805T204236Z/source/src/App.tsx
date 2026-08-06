import { useState } from "react"
import { Heart, MapPin, DollarSign, Clock, ChevronRight, Users } from "lucide-react"

interface Destination {
  id: string
  name: string
  description: string
  image: string
  budget: number
  travelTime: string
  activities: string[]
  accommodation: string
  votes: number
}

interface Friend {
  id: string
  name: string
}

const FRIENDS: Friend[] = [
  { id: "1", name: "Alex" },
  { id: "2", name: "Jordan" },
  { id: "3", name: "Casey" },
  { id: "4", name: "Morgan" },
]

const DESTINATIONS: Destination[] = [
  {
    id: "1",
    name: "Lake Tahoe",
    description: "Mountain retreat with hiking and lakeside views",
    image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    budget: 850,
    travelTime: "8 hours",
    activities: ["Hiking", "Swimming", "Scenic drives", "Picnicking"],
    accommodation: "Lakefront cabin with hot tub",
    votes: 3,
  },
  {
    id: "2",
    name: "Portland",
    description: "Vibrant city with food, art, and coffee culture",
    image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    budget: 720,
    travelTime: "2.5 hours",
    activities: ["Food tours", "Museum visits", "Powell's Books", "Waterfall hikes"],
    accommodation: "Boutique hotel in Pearl District",
    votes: 2,
  },
  {
    id: "3",
    name: "Big Sur",
    description: "Dramatic coastal cliffs and scenic drives",
    image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    budget: 950,
    travelTime: "12 hours",
    activities: ["Coastal hikes", "Photography", "Hot springs", "Wildlife viewing"],
    accommodation: "Oceanside lodge with spa",
    votes: 4,
  },
  {
    id: "4",
    name: "Wine Country",
    description: "Wineries, vineyards, and gourmet dining",
    image: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    budget: 880,
    travelTime: "4 hours",
    activities: ["Wine tastings", "Farm dinners", "Ballooning", "Cooking classes"],
    accommodation: "Vineyard cottage with pool",
    votes: 1,
  },
]

export default function App() {
  const [votes, setVotes] = useState<Record<string, string[]>>({
    "1": ["1", "3"],
    "2": ["4"],
    "3": ["2"],
    "4": [],
  })
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)

  const toggleVote = (destinationId: string, friendId: string) => {
    setVotes((prev) => {
      const current = prev[destinationId] || []
      return {
        ...prev,
        [destinationId]: current.includes(friendId)
          ? current.filter((id) => id !== friendId)
          : [...current, friendId],
      }
    })
  }

  const destinationsWithVotes = DESTINATIONS.map((dest) => ({
    ...dest,
    votes: votes[dest.id]?.length || 0,
  })).sort((a, b) => b.votes - a.votes)

  const winner = destinationsWithVotes[0]

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
            <MapPin className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-semibold uppercase tracking-wider text-stone-600">
              Weekend Getaway Planner
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-bold text-stone-950 sm:text-5xl">
            Weekender
          </h1>
          <p className="mt-2 text-lg text-stone-600">
            Pick the perfect destination for your group
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Destinations List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {destinationsWithVotes.map((destination) => (
                <button
                  key={destination.id}
                  onClick={() => setSelectedDestination(destination)}
                  className="w-full overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md active:scale-98"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Image */}
                    <div
                      className="h-48 w-full bg-cover bg-center sm:h-auto sm:w-40 sm:flex-shrink-0"
                      style={{ background: destination.image }}
                    />

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div className="text-left">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-2xl font-bold text-stone-950">
                              {destination.name}
                            </h3>
                            <p className="mt-1 text-sm text-stone-600">
                              {destination.description}
                            </p>
                          </div>
                          {destination.votes === Math.max(...destinationsWithVotes.map((d) => d.votes)) && destination.votes > 0 && (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                              <Heart className="h-5 w-5 fill-amber-600 text-amber-600" />
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2 text-stone-600">
                            <DollarSign className="h-4 w-4" />
                            <span>${destination.budget} per person</span>
                          </div>
                          <div className="flex items-center gap-2 text-stone-600">
                            <Clock className="h-4 w-4" />
                            <span>{destination.travelTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Vote Section */}
                      <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-stone-500" />
                          <span className="text-sm font-semibold text-stone-700">
                            {destination.votes} vote{destination.votes !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-stone-400" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Voting Card */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-stone-950">Your Votes</h2>
              <div className="space-y-3">
                {FRIENDS.map((friend) => (
                  <div key={friend.id}>
                    <p className="mb-2 text-sm font-semibold text-stone-700">
                      {friend.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {destinationsWithVotes.map((destination) => {
                        const hasVoted = votes[destination.id]?.includes(friend.id)
                        return (
                          <button
                            key={destination.id}
                            onClick={() => toggleVote(destination.id, friend.id)}
                            className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all sm:flex-none ${
                              hasVoted
                                ? "bg-amber-100 text-amber-900"
                                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                            }`}
                          >
                            {destination.name.split(" ")[0]}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Winner Card */}
            {winner && (
              <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm border border-amber-200">
                <div className="mb-2 flex items-center gap-2">
                  <Heart className="h-5 w-5 fill-amber-600 text-amber-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Winning Destination
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-stone-950">{winner.name}</h3>
                <p className="mt-2 text-sm text-stone-700">{winner.description}</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-amber-900">
                      {winner.votes} vote{winner.votes !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600">
                    <DollarSign className="h-4 w-4" />
                    <span>${winner.budget}</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-600">
                    <Clock className="h-4 w-4" />
                    <span>{winner.travelTime}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Destination Detail Modal */}
      {selectedDestination && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"
          onClick={() => setSelectedDestination(null)}
        >
          <div
            className="h-auto max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white sm:max-w-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8">
              {/* Close button */}
              <button
                onClick={() => setSelectedDestination(null)}
                className="mb-4 text-sm font-semibold text-stone-600 hover:text-stone-900"
              >
                ← Back
              </button>

              {/* Header */}
              <div
                className="mb-6 h-64 rounded-2xl bg-cover bg-center"
                style={{ background: selectedDestination.image }}
              />

              <h1 className="text-4xl font-bold text-stone-950">
                {selectedDestination.name}
              </h1>
              <p className="mt-2 text-lg text-stone-600">
                {selectedDestination.description}
              </p>

              {/* Key Info */}
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-stone-50 p-4">
                  <p className="text-xs font-semibold uppercase text-stone-600">Budget</p>
                  <p className="mt-1 text-2xl font-bold text-stone-950">
                    ${selectedDestination.budget}
                  </p>
                  <p className="text-xs text-stone-600">per person</p>
                </div>
                <div className="rounded-xl bg-stone-50 p-4">
                  <p className="text-xs font-semibold uppercase text-stone-600">Travel</p>
                  <p className="mt-1 text-2xl font-bold text-stone-950">
                    {selectedDestination.travelTime}
                  </p>
                </div>
                <div className="rounded-xl bg-stone-50 p-4">
                  <p className="text-xs font-semibold uppercase text-stone-600">Votes</p>
                  <p className="mt-1 text-2xl font-bold text-stone-950">
                    {selectedDestination.votes}
                  </p>
                </div>
              </div>

              {/* Activities */}
              <div className="mt-8">
                <h2 className="text-xl font-bold text-stone-950">Activities</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedDestination.activities.map((activity) => (
                    <span
                      key={activity}
                      className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Accommodation */}
              <div className="mt-8">
                <h2 className="text-xl font-bold text-stone-950">Accommodation</h2>
                <p className="mt-2 rounded-xl bg-stone-50 p-4 text-stone-700">
                  {selectedDestination.accommodation}
                </p>
              </div>

              {/* Suggested Itinerary */}
              <div className="mt-8">
                <h2 className="text-xl font-bold text-stone-950">Suggested Itinerary</h2>
                <div className="mt-4 space-y-3">
                  <div className="rounded-xl border border-stone-200 p-4">
                    <p className="font-semibold text-stone-950">Friday Evening</p>
                    <p className="mt-1 text-sm text-stone-600">
                      Drive to destination, check into accommodation, explore the local area
                    </p>
                  </div>
                  <div className="rounded-xl border border-stone-200 p-4">
                    <p className="font-semibold text-stone-950">Saturday</p>
                    <p className="mt-1 text-sm text-stone-600">
                      Full day adventure: {selectedDestination.activities.slice(0, 2).join(" and ")}
                    </p>
                  </div>
                  <div className="rounded-xl border border-stone-200 p-4">
                    <p className="font-semibold text-stone-950">Sunday</p>
                    <p className="mt-1 text-sm text-stone-600">
                      Leisurely morning, brunch, and drive back home
                    </p>
                  </div>
                </div>
              </div>

              {/* Vote Button */}
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {FRIENDS.map((friend) => {
                  const hasVoted = votes[selectedDestination.id]?.includes(friend.id)
                  return (
                    <button
                      key={friend.id}
                      onClick={() => toggleVote(selectedDestination.id, friend.id)}
                      className={`rounded-xl px-4 py-3 font-semibold transition-all ${
                        hasVoted
                          ? "bg-amber-100 text-amber-900 hover:bg-amber-200"
                          : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                      }`}
                    >
                      {hasVoted ? "✓ " : ""}{friend.name}'s Vote
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setSelectedDestination(null)}
                className="mt-6 w-full rounded-xl bg-stone-950 px-4 py-3 font-semibold text-white transition-all hover:bg-stone-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
