import type { Destination, Friend } from "./types"

export const friends: Friend[] = [
  { id: "you", name: "You", initials: "YO", color: "bg-amber-500", isYou: true },
  { id: "maya", name: "Maya", initials: "MA", color: "bg-rose-500" },
  { id: "jordan", name: "Jordan", initials: "JD", color: "bg-sky-500" },
  { id: "priya", name: "Priya", initials: "PR", color: "bg-violet-500" },
  { id: "sam", name: "Sam", initials: "SM", color: "bg-emerald-500" },
]

export const seedVotes: Record<string, string[]> = {
  "lake-tahoe": ["maya", "priya"],
  charleston: ["sam"],
  asheville: ["jordan"],
}

export const destinations: Destination[] = [
  {
    id: "lake-tahoe",
    name: "Lake Tahoe",
    region: "California / Nevada",
    tagline: "Alpine lake views and slow mornings",
    tags: ["Nature", "Chill", "Lake"],
    gradient: "from-sky-400 via-cyan-500 to-blue-700",
    icon: "mountain",
    travelTimes: { flight: 1.5, drive: 3.5 },
    pricePerPerson: 480,
    budget: { flight: 180, stay: 160, food: 90, activities: 50 },
    rating: 4.7,
    highlights: [
      "Sunrise paddleboard on the lake",
      "Cabin with a private hot tub",
      "Short hike to Eagle Falls",
      "Lakeside dinner in Tahoe City",
    ],
    bestFor: "Groups who want nature and low-key luxury",
    weather: "Sunny, high 72°F / low 48°F",
    itinerary: [
      {
        day: "Fri",
        label: "Arrival & Settle In",
        items: [
          { time: "4:00 PM", activity: "Arrive & check in", detail: "Lakeside cabin, unpack and relax" },
          { time: "6:30 PM", activity: "Group dinner", detail: "Wood-fired pizza at Tahoe City Kitchen" },
          { time: "9:00 PM", activity: "Hot tub + stars", detail: "Cabin deck, bring the good snacks" },
        ],
      },
      {
        day: "Sat",
        label: "Lake & Trails",
        items: [
          { time: "8:00 AM", activity: "Sunrise paddleboard", detail: "Rentals at Sand Harbor" },
          { time: "11:00 AM", activity: "Hike to Eagle Falls", detail: "2.5 mi round trip, moderate" },
          { time: "2:00 PM", activity: "Lunch in town", detail: "Sandwiches at Tahoe Deli" },
          { time: "7:00 PM", activity: "Bonfire dinner", detail: "S'mores kit included at the cabin" },
        ],
      },
      {
        day: "Sun",
        label: "Slow Morning & Departure",
        items: [
          { time: "9:00 AM", activity: "Pancake breakfast", detail: "Whoever wakes up first cooks" },
          { time: "11:00 AM", activity: "Farmers market stop", detail: "Grab coffee and souvenirs" },
          { time: "1:00 PM", activity: "Head home", detail: "Check out and drive back" },
        ],
      },
    ],
  },
  {
    id: "austin",
    name: "Austin",
    region: "Texas",
    tagline: "Live music, tacos, and rooftop nights",
    tags: ["City", "Food", "Nightlife"],
    gradient: "from-orange-400 via-red-500 to-pink-600",
    icon: "building",
    travelTimes: { flight: 2.2, drive: 9 },
    pricePerPerson: 520,
    budget: { flight: 210, stay: 170, food: 100, activities: 40 },
    rating: 4.5,
    highlights: [
      "Live music on Rainey Street",
      "Breakfast tacos crawl",
      "Barton Springs swim",
      "Rooftop bar sunset",
    ],
    bestFor: "Groups who want energy and great food",
    weather: "Warm, high 88°F / low 68°F",
    itinerary: [
      {
        day: "Fri",
        label: "Arrival & First Night",
        items: [
          { time: "5:00 PM", activity: "Check in", detail: "Downtown loft, 4 beds" },
          { time: "7:00 PM", activity: "Taco crawl", detail: "Three stops, starting at Veracruz" },
          { time: "10:00 PM", activity: "Rainey Street bars", detail: "Live music at every porch" },
        ],
      },
      {
        day: "Sat",
        label: "Swim & Explore",
        items: [
          { time: "10:00 AM", activity: "Barton Springs swim", detail: "Bring towels and sunscreen" },
          { time: "1:00 PM", activity: "BBQ lunch", detail: "Franklin Barbecue, arrive early" },
          { time: "4:00 PM", activity: "South Congress shopping", detail: "Vintage shops and murals" },
          { time: "8:00 PM", activity: "Rooftop dinner", detail: "Sunset views downtown" },
        ],
      },
      {
        day: "Sun",
        label: "Brunch & Departure",
        items: [
          { time: "10:30 AM", activity: "Bottomless brunch", detail: "Group table booked at Justine's" },
          { time: "1:30 PM", activity: "Head to airport", detail: "Flight departs 4:00 PM" },
        ],
      },
    ],
  },
  {
    id: "asheville",
    name: "Asheville",
    region: "North Carolina",
    tagline: "Blue Ridge views and craft breweries",
    tags: ["Nature", "Food", "Mountain"],
    gradient: "from-emerald-400 via-teal-500 to-green-700",
    icon: "trees",
    travelTimes: { flight: 1.8, drive: 6.5 },
    pricePerPerson: 440,
    budget: { flight: 160, stay: 140, food: 90, activities: 50 },
    rating: 4.6,
    highlights: [
      "Blue Ridge Parkway drive",
      "Brewery hopping downtown",
      "Waterfall hike",
      "Farm-to-table dinner",
    ],
    bestFor: "Groups who want mountains and good beer",
    weather: "Mild, high 75°F / low 52°F",
    itinerary: [
      {
        day: "Fri",
        label: "Arrival & Downtown",
        items: [
          { time: "5:30 PM", activity: "Check in", detail: "Cozy Airbnb near downtown" },
          { time: "7:00 PM", activity: "Brewery hop", detail: "Three stops on the South Slope" },
          { time: "9:30 PM", activity: "Late night snacks", detail: "Food truck lot" },
        ],
      },
      {
        day: "Sat",
        label: "Mountains & Waterfalls",
        items: [
          { time: "9:00 AM", activity: "Blue Ridge Parkway drive", detail: "Stop at scenic overlooks" },
          { time: "11:30 AM", activity: "Waterfall hike", detail: "Catawba Falls, 3 mi round trip" },
          { time: "3:00 PM", activity: "Cider tasting", detail: "Local orchard tour" },
          { time: "7:30 PM", activity: "Farm-to-table dinner", detail: "Reservation for 5" },
        ],
      },
      {
        day: "Sun",
        label: "Market & Departure",
        items: [
          { time: "9:30 AM", activity: "River Arts District", detail: "Studios and coffee" },
          { time: "12:00 PM", activity: "Depart", detail: "Drive or flight home" },
        ],
      },
    ],
  },
  {
    id: "charleston",
    name: "Charleston",
    region: "South Carolina",
    tagline: "Cobblestones, coastline, and Southern charm",
    tags: ["Coastal", "History", "Food"],
    gradient: "from-amber-300 via-orange-400 to-rose-500",
    icon: "landmark",
    travelTimes: { flight: 2.0, drive: 8 },
    pricePerPerson: 500,
    budget: { flight: 190, stay: 180, food: 90, activities: 40 },
    rating: 4.4,
    highlights: [
      "Historic district walking tour",
      "Shrimp and grits everywhere",
      "Beach day at Folly Beach",
      "Rooftop cocktails",
    ],
    bestFor: "Groups who want charm and a beach day",
    weather: "Warm, high 84°F / low 66°F",
    itinerary: [
      {
        day: "Fri",
        label: "Arrival & Old City",
        items: [
          { time: "5:00 PM", activity: "Check in", detail: "Historic downtown rental" },
          { time: "6:30 PM", activity: "Walking tour", detail: "Self-guided through the historic district" },
          { time: "8:30 PM", activity: "Dinner", detail: "Shrimp and grits at Husk" },
        ],
      },
      {
        day: "Sat",
        label: "Beach Day",
        items: [
          { time: "10:00 AM", activity: "Folly Beach", detail: "Rent umbrellas and chairs" },
          { time: "1:00 PM", activity: "Beachside lunch", detail: "Fish tacos at a beach shack" },
          { time: "5:00 PM", activity: "Rooftop happy hour", detail: "Views over the harbor" },
          { time: "8:00 PM", activity: "Group dinner", detail: "Lowcountry boil" },
        ],
      },
      {
        day: "Sun",
        label: "Market & Departure",
        items: [
          { time: "9:00 AM", activity: "City Market", detail: "Sweetgrass baskets and coffee" },
          { time: "12:30 PM", activity: "Depart", detail: "Flight or drive home" },
        ],
      },
    ],
  },
  {
    id: "joshua-tree",
    name: "Joshua Tree",
    region: "California",
    tagline: "Desert stars and rock scrambles",
    tags: ["Adventure", "Desert", "Chill"],
    gradient: "from-fuchsia-400 via-purple-500 to-indigo-700",
    icon: "sun",
    travelTimes: { flight: 2.5, drive: 3 },
    pricePerPerson: 410,
    budget: { flight: 150, stay: 130, food: 80, activities: 50 },
    rating: 4.3,
    highlights: [
      "Stargazing in the national park",
      "Rock scrambling at Hidden Valley",
      "Desert-modern Airbnb with a firepit",
      "Sunset at Keys View",
    ],
    bestFor: "Groups who want a chill desert escape",
    weather: "Dry, high 90°F / low 62°F",
    itinerary: [
      {
        day: "Fri",
        label: "Arrival & Desert Night",
        items: [
          { time: "6:00 PM", activity: "Check in", detail: "Desert-modern house with firepit" },
          { time: "7:30 PM", activity: "Firepit dinner", detail: "Cook out under the stars" },
          { time: "9:30 PM", activity: "Stargazing", detail: "Dark sky, telescopes optional" },
        ],
      },
      {
        day: "Sat",
        label: "Park Day",
        items: [
          { time: "8:00 AM", activity: "Hidden Valley hike", detail: "1 mi loop with rock scrambles" },
          { time: "11:00 AM", activity: "Arch Rock trail", detail: "Short and scenic" },
          { time: "2:00 PM", activity: "Lunch in town", detail: "Pie and coffee stop" },
          { time: "6:30 PM", activity: "Keys View sunset", detail: "Best view in the park" },
        ],
      },
      {
        day: "Sun",
        label: "Slow Morning & Departure",
        items: [
          { time: "9:00 AM", activity: "Breakfast on the patio", detail: "Coffee and pastries" },
          { time: "11:00 AM", activity: "Depart", detail: "Drive or flight home" },
        ],
      },
    ],
  },
  {
    id: "portland-maine",
    name: "Portland",
    region: "Maine",
    tagline: "Lobster rolls and lighthouse walks",
    tags: ["Coastal", "Food", "Chill"],
    gradient: "from-blue-400 via-indigo-500 to-slate-700",
    icon: "waves",
    travelTimes: { flight: 2.3, drive: 6 },
    pricePerPerson: 460,
    budget: { flight: 170, stay: 150, food: 100, activities: 40 },
    rating: 4.5,
    highlights: [
      "Lobster roll tasting crawl",
      "Portland Head Light walk",
      "Cozy brewery afternoon",
      "Old Port cobblestone streets",
    ],
    bestFor: "Groups who want seafood and coastal walks",
    weather: "Crisp, high 70°F / low 54°F",
    itinerary: [
      {
        day: "Fri",
        label: "Arrival & Old Port",
        items: [
          { time: "5:30 PM", activity: "Check in", detail: "Old Port apartment" },
          { time: "7:00 PM", activity: "Lobster roll dinner", detail: "First stop of the crawl" },
          { time: "9:00 PM", activity: "Cobblestone stroll", detail: "Old Port streets at night" },
        ],
      },
      {
        day: "Sat",
        label: "Coast & Breweries",
        items: [
          { time: "9:30 AM", activity: "Portland Head Light", detail: "Photos and coastal walk" },
          { time: "12:00 PM", activity: "Lunch", detail: "Second lobster roll stop" },
          { time: "3:00 PM", activity: "Brewery afternoon", detail: "Flights at two local spots" },
          { time: "7:30 PM", activity: "Group dinner", detail: "Fresh seafood downtown" },
        ],
      },
      {
        day: "Sun",
        label: "Market & Departure",
        items: [
          { time: "9:00 AM", activity: "Farmers market", detail: "Pastries and local goods" },
          { time: "12:00 PM", activity: "Depart", detail: "Drive or flight home" },
        ],
      },
    ],
  },
]
