import type { Destination } from "../types"

export const destinations: Destination[] = [
  {
    id: "tahoe",
    name: "Lake Tahoe",
    region: "California / Nevada",
    tagline: "Alpine lake escape",
    description:
      "Crisp mountain air, a lake so clear you can see 70 feet down, and a cabin with a firepit waiting for you. Perfect for a group that wants hikes by day and board games by night.",
    icon: "mountain",
    gradient: "from-sky-600 via-cyan-600 to-teal-700",
    tags: ["Mountains", "Hiking", "Lake"],
    travel: { mode: "drive", duration: "3h 30m", minutes: 210, distanceMiles: 200 },
    budget: { travel: 60, stay: 180, food: 90, activities: 50 },
    weather: { high: 78, low: 52, condition: "Sunny" },
    itinerary: [
      {
        day: "Friday",
        date: "Aug 14",
        items: [
          { time: "4:00 PM", title: "Hit the road", description: "Carpool up from the Bay, split gas three ways.", icon: "car" },
          { time: "7:30 PM", title: "Check into the cabin", description: "Lakefront cabin, wood-fired hot tub included.", icon: "tent" },
          { time: "8:30 PM", title: "Firepit dinner", description: "Foil-pack dinner and s'mores under the stars.", icon: "sparkles" },
        ],
      },
      {
        day: "Saturday",
        date: "Aug 15",
        items: [
          { time: "8:00 AM", title: "Eagle Lake trailhead", description: "Moderate 2-mile hike with a granite-basin payoff.", icon: "footprints" },
          { time: "1:00 PM", title: "Kayak the shoreline", description: "Rent kayaks at Sand Harbor, paddle the clear water.", icon: "waves" },
          { time: "7:00 PM", title: "BBQ on the deck", description: "Group cook-off, loser does dishes.", icon: "utensils" },
        ],
      },
      {
        day: "Sunday",
        date: "Aug 16",
        items: [
          { time: "9:00 AM", title: "Pancake breakfast", description: "Use up the groceries before checkout.", icon: "utensils" },
          { time: "11:00 AM", title: "Emerald Bay lookout", description: "Quick scenic stop on the drive out.", icon: "camera" },
          { time: "1:00 PM", title: "Drive home", description: "Back in the city by dinner.", icon: "car" },
        ],
      },
    ],
  },
  {
    id: "joshua-tree",
    name: "Joshua Tree",
    region: "California",
    tagline: "Desert stars & boulders",
    description:
      "Otherworldly rock formations by day, some of the darkest skies in Southern California by night. A laid-back, low-cost trip for a group that likes to scramble and stargaze.",
    icon: "sparkles",
    gradient: "from-orange-500 via-rose-500 to-purple-700",
    tags: ["Desert", "Hiking", "Stargazing"],
    travel: { mode: "drive", duration: "2h 45m", minutes: 165, distanceMiles: 140 },
    budget: { travel: 45, stay: 120, food: 70, activities: 40 },
    weather: { high: 95, low: 68, condition: "Clear" },
    itinerary: [
      {
        day: "Friday",
        date: "Aug 14",
        items: [
          { time: "5:00 PM", title: "Drive out", description: "Straight shot down the 10, beat the desert heat.", icon: "car" },
          { time: "8:00 PM", title: "Check into the house", description: "Off-grid rental with a firepit and telescope.", icon: "tent" },
          { time: "9:30 PM", title: "Stargazing", description: "Milky Way visible with the naked eye out here.", icon: "moon" },
        ],
      },
      {
        day: "Saturday",
        date: "Aug 15",
        items: [
          { time: "7:00 AM", title: "Hidden Valley loop", description: "Easy 1-mile loop through classic boulder scenery, before the heat.", icon: "footprints" },
          { time: "11:00 AM", title: "Bouldering session", description: "Scramble the rocks near Skull Rock, bring water.", icon: "mountain" },
          { time: "6:00 PM", title: "Sunset at Keys View", description: "Panoramic view over the Coachella Valley.", icon: "sun" },
        ],
      },
      {
        day: "Sunday",
        date: "Aug 16",
        items: [
          { time: "8:30 AM", title: "Coffee on the patio", description: "Slow morning before the drive back.", icon: "utensils" },
          { time: "10:30 AM", title: "Joshua Tree gift shop", description: "Grab souvenirs in the village.", icon: "shopping-bag" },
          { time: "12:00 PM", title: "Drive home", description: "Home in time for dinner.", icon: "car" },
        ],
      },
    ],
  },
  {
    id: "portland",
    name: "Portland",
    region: "Oregon",
    tagline: "Foodie city break",
    description:
      "Food carts, coffee, and a walkable downtown built for a group that wants a proper city weekend — good restaurants, live music, and no driving required once you land.",
    icon: "building-2",
    gradient: "from-emerald-600 via-teal-600 to-slate-700",
    tags: ["City", "Food", "Nightlife"],
    travel: { mode: "flight", duration: "1h 45m", minutes: 105, distanceMiles: 550 },
    budget: { travel: 220, stay: 210, food: 150, activities: 60 },
    weather: { high: 75, low: 58, condition: "Partly cloudy" },
    itinerary: [
      {
        day: "Friday",
        date: "Aug 14",
        items: [
          { time: "6:00 PM", title: "Flight out", description: "Direct flight, landing downtown by dinner.", icon: "plane" },
          { time: "8:00 PM", title: "Food cart pod", description: "Sample five carts at Cartopia in the Pearl District.", icon: "utensils" },
          { time: "10:00 PM", title: "Rooftop bar", description: "Nightcap with a skyline view.", icon: "glass-water" },
        ],
      },
      {
        day: "Saturday",
        date: "Aug 15",
        items: [
          { time: "10:00 AM", title: "Powell's City of Books", description: "Get lost in the world's largest independent bookstore.", icon: "compass" },
          { time: "1:00 PM", title: "Brewery crawl", description: "Three breweries in the Pearl, walkable route.", icon: "glass-water" },
          { time: "8:00 PM", title: "Live music", description: "Local band at a Burnside venue.", icon: "music" },
        ],
      },
      {
        day: "Sunday",
        date: "Aug 16",
        items: [
          { time: "9:00 AM", title: "Brunch", description: "Table for six, famous biscuit sandwiches.", icon: "utensils" },
          { time: "11:30 AM", title: "Japanese Garden", description: "Quiet stroll before heading to the airport.", icon: "tree-pine" },
          { time: "3:00 PM", title: "Flight home", description: "Wheels down before the workweek.", icon: "plane" },
        ],
      },
    ],
  },
  {
    id: "san-diego",
    name: "San Diego",
    region: "California",
    tagline: "Sun & surf",
    description:
      "Wide beaches, warm water, and a boardwalk scene for a group that wants sun, waves, and a bit of nightlife without straying far from the sand.",
    icon: "waves",
    gradient: "from-cyan-500 via-blue-500 to-indigo-600",
    tags: ["Beach", "Surfing", "Nightlife"],
    travel: { mode: "flight", duration: "1h 20m", minutes: 80, distanceMiles: 460 },
    budget: { travel: 180, stay: 240, food: 130, activities: 80 },
    weather: { high: 76, low: 65, condition: "Sunny" },
    itinerary: [
      {
        day: "Friday",
        date: "Aug 14",
        items: [
          { time: "5:30 PM", title: "Flight out", description: "Quick hop down the coast.", icon: "plane" },
          { time: "7:30 PM", title: "Check into the house", description: "Two blocks from Pacific Beach.", icon: "tent" },
          { time: "8:30 PM", title: "Boardwalk dinner", description: "Tacos and a walk along the water.", icon: "utensils" },
        ],
      },
      {
        day: "Saturday",
        date: "Aug 15",
        items: [
          { time: "8:00 AM", title: "Surf lesson", description: "Group lesson at Pacific Beach, boards included.", icon: "waves" },
          { time: "1:00 PM", title: "Beach lounging", description: "Volleyball, snacks, and sun.", icon: "sun" },
          { time: "9:00 PM", title: "Gaslamp Quarter", description: "Bars and dancing downtown.", icon: "party-popper" },
        ],
      },
      {
        day: "Sunday",
        date: "Aug 16",
        items: [
          { time: "9:30 AM", title: "Beachfront brunch", description: "Bottomless mimosas overlooking the water.", icon: "utensils" },
          { time: "12:00 PM", title: "Sunset Cliffs", description: "Photo stop on the way to the airport.", icon: "camera" },
          { time: "3:30 PM", title: "Flight home", description: "Sandy and sunburned, but worth it.", icon: "plane" },
        ],
      },
    ],
  },
  {
    id: "napa",
    name: "Napa Valley",
    region: "California",
    tagline: "Wine country wander",
    description:
      "Rolling vineyards, long lunches, and tastings that turn into afternoons. The most relaxed, most indulgent option — best for a group that wants good food and better wine.",
    icon: "wine",
    gradient: "from-fuchsia-600 via-rose-500 to-amber-500",
    tags: ["Wine", "Scenic", "Food"],
    travel: { mode: "drive", duration: "1h 15m", minutes: 75, distanceMiles: 55 },
    budget: { travel: 30, stay: 260, food: 140, activities: 120 },
    weather: { high: 88, low: 55, condition: "Sunny" },
    itinerary: [
      {
        day: "Friday",
        date: "Aug 14",
        items: [
          { time: "3:00 PM", title: "Short drive up", description: "Quick trip, arrive with daylight to spare.", icon: "car" },
          { time: "5:00 PM", title: "Check into the villa", description: "Pool, vineyard view, room for everyone.", icon: "tent" },
          { time: "7:30 PM", title: "Dinner in town", description: "Reservation at a downtown Napa bistro.", icon: "utensils" },
        ],
      },
      {
        day: "Saturday",
        date: "Aug 15",
        items: [
          { time: "10:00 AM", title: "Vineyard tasting #1", description: "Estate tour and flight at a family winery.", icon: "wine" },
          { time: "1:00 PM", title: "Picnic lunch", description: "Cheese board on the lawn between tastings.", icon: "utensils" },
          { time: "3:30 PM", title: "Vineyard tasting #2", description: "Second stop, more relaxed pace.", icon: "wine" },
        ],
      },
      {
        day: "Sunday",
        date: "Aug 16",
        items: [
          { time: "9:30 AM", title: "Pool morning", description: "Coffee and a slow start at the villa.", icon: "sun" },
          { time: "11:30 AM", title: "Farmers market", description: "Oxbow Public Market for lunch and snacks to go.", icon: "shopping-bag" },
          { time: "1:30 PM", title: "Drive home", description: "Short, easy drive back.", icon: "car" },
        ],
      },
    ],
  },
  {
    id: "big-sur",
    name: "Big Sur",
    region: "California",
    tagline: "Coastal cliffs",
    description:
      "Redwoods, cliffside drives, and waves crashing against rock. A quieter, more scenic trip for a group that wants to unplug and hike above the Pacific.",
    icon: "tree-pine",
    gradient: "from-slate-600 via-emerald-700 to-teal-800",
    tags: ["Coastal", "Scenic", "Hiking"],
    travel: { mode: "drive", duration: "3h 00m", minutes: 180, distanceMiles: 150 },
    budget: { travel: 55, stay: 220, food: 100, activities: 40 },
    weather: { high: 70, low: 52, condition: "Foggy mornings" },
    itinerary: [
      {
        day: "Friday",
        date: "Aug 14",
        items: [
          { time: "3:30 PM", title: "Coastal drive", description: "Highway 1 south, stop for photos along the way.", icon: "car" },
          { time: "7:00 PM", title: "Check into the cabin", description: "Redwood grove cabin, no cell signal.", icon: "tent" },
          { time: "8:00 PM", title: "Campfire dinner", description: "Cook together, no restaurants for miles.", icon: "sparkles" },
        ],
      },
      {
        day: "Saturday",
        date: "Aug 15",
        items: [
          { time: "8:30 AM", title: "McWay Falls", description: "Short walk to the iconic waterfall cove.", icon: "camera" },
          { time: "11:00 AM", title: "Julia Pfeiffer hike", description: "Redwood canyon trail with ocean views.", icon: "footprints" },
          { time: "6:00 PM", title: "Sunset at the cliffs", description: "Watch the sun drop into the Pacific.", icon: "sun" },
        ],
      },
      {
        day: "Sunday",
        date: "Aug 16",
        items: [
          { time: "9:00 AM", title: "Slow breakfast", description: "Coffee on the deck, listening to the birds.", icon: "utensils" },
          { time: "11:00 AM", title: "Bixby Bridge stop", description: "The postcard photo on the way out.", icon: "camera" },
          { time: "1:00 PM", title: "Drive home", description: "Back in the city by evening.", icon: "car" },
        ],
      },
    ],
  },
]

export function getDestination(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id)
}

export function budgetTotal(b: Destination["budget"]): number {
  return b.travel + b.stay + b.food + b.activities
}
