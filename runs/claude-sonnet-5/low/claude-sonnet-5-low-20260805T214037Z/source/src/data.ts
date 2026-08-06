export type Friend = {
  id: string
  name: string
  initials: string
  color: string
}

export type ItineraryActivity = {
  time: string
  title: string
  description: string
}

export type ItineraryDay = {
  day: string
  date: string
  activities: ItineraryActivity[]
}

export type Destination = {
  id: string
  name: string
  region: string
  tagline: string
  gradient: string
  budgetPerPerson: number
  travelTimeHours: number
  travelMode: string
  distanceMiles: number
  rating: number
  highlights: string[]
  weather: string
  itinerary: ItineraryDay[]
}

export const friends: Friend[] = [
  { id: "you", name: "You", initials: "YO", color: "bg-teal-500" },
  { id: "mia", name: "Mia", initials: "MI", color: "bg-rose-500" },
  { id: "jonas", name: "Jonas", initials: "JO", color: "bg-amber-500" },
  { id: "lena", name: "Lena", initials: "LE", color: "bg-violet-500" },
  { id: "theo", name: "Theo", initials: "TH", color: "bg-sky-500" },
  { id: "priya", name: "Priya", initials: "PR", color: "bg-emerald-500" },
]

export const destinations: Destination[] = [
  {
    id: "big-sur",
    name: "Big Sur",
    region: "California, USA",
    tagline: "Cliffside views and redwood trails",
    gradient: "from-emerald-500 to-teal-700",
    budgetPerPerson: 420,
    travelTimeHours: 3.5,
    travelMode: "Drive",
    distanceMiles: 145,
    rating: 4.8,
    weather: "68°F, sunny",
    highlights: ["McWay Falls hike", "Coastal camping", "Bixby Bridge photo stop", "Redwood forest walk"],
    itinerary: [
      {
        day: "Friday",
        date: "Oct 9",
        activities: [
          { time: "3:00 PM", title: "Depart & drive up PCH", description: "Scenic drive along Highway 1 with stops at overlooks." },
          { time: "6:30 PM", title: "Check in to campsite", description: "Set up camp at Pfeiffer Big Sur State Park." },
          { time: "8:00 PM", title: "Campfire dinner", description: "Grill out and swap trip playlists under the stars." },
        ],
      },
      {
        day: "Saturday",
        date: "Oct 10",
        activities: [
          { time: "8:00 AM", title: "McWay Falls hike", description: "Short, iconic hike to the waterfall overlook." },
          { time: "11:00 AM", title: "Redwood forest walk", description: "Shaded loop trail through old-growth redwoods." },
          { time: "2:00 PM", title: "Picnic lunch", description: "Sandwiches at Pfeiffer Beach with purple sand." },
          { time: "5:00 PM", title: "Bixby Bridge photos", description: "Golden hour photo stop at the iconic bridge." },
          { time: "7:30 PM", title: "Dinner in Carmel", description: "Casual dinner on the way back to camp." },
        ],
      },
      {
        day: "Sunday",
        date: "Oct 11",
        activities: [
          { time: "9:00 AM", title: "Coffee & pack up", description: "Break camp and grab coffee in town." },
          { time: "10:30 AM", title: "Scenic drive home", description: "Leisurely drive back with one last overlook stop." },
        ],
      },
    ],
  },
  {
    id: "lake-tahoe",
    name: "Lake Tahoe",
    region: "California/Nevada, USA",
    tagline: "Alpine lake with hiking and lake days",
    gradient: "from-sky-500 to-blue-800",
    budgetPerPerson: 380,
    travelTimeHours: 3,
    travelMode: "Drive",
    distanceMiles: 120,
    rating: 4.6,
    weather: "62°F, partly cloudy",
    highlights: ["Kayaking on the lake", "Emerald Bay overlook", "Cabin hot tub", "Sunset paddleboarding"],
    itinerary: [
      {
        day: "Friday",
        date: "Oct 9",
        activities: [
          { time: "4:00 PM", title: "Drive to South Lake Tahoe", description: "Head up I-80 and check into the rental cabin." },
          { time: "7:00 PM", title: "Group dinner", description: "Home-cooked pasta night at the cabin." },
        ],
      },
      {
        day: "Saturday",
        date: "Oct 10",
        activities: [
          { time: "9:00 AM", title: "Kayaking & paddleboarding", description: "Rent gear and explore the shoreline." },
          { time: "1:00 PM", title: "Lunch at the lake", description: "Lakeside food truck stop." },
          { time: "3:00 PM", title: "Emerald Bay overlook", description: "Short drive and viewpoint hike." },
          { time: "8:00 PM", title: "Hot tub & board games", description: "Wind down at the cabin." },
        ],
      },
      {
        day: "Sunday",
        date: "Oct 11",
        activities: [
          { time: "9:30 AM", title: "Farmers market", description: "Browse local stalls before heading out." },
          { time: "11:00 AM", title: "Drive home", description: "Scenic return drive." },
        ],
      },
    ],
  },
  {
    id: "asheville",
    name: "Asheville",
    region: "North Carolina, USA",
    tagline: "Mountain town with breweries and art",
    gradient: "from-orange-500 to-rose-700",
    budgetPerPerson: 340,
    travelTimeHours: 2,
    travelMode: "Drive",
    distanceMiles: 95,
    rating: 4.5,
    weather: "70°F, mild",
    highlights: ["Brewery hopping", "Blue Ridge Parkway drive", "River Arts District", "Waterfall hike"],
    itinerary: [
      {
        day: "Friday",
        date: "Oct 9",
        activities: [
          { time: "5:00 PM", title: "Arrive & check in", description: "Downtown loft rental, walk to dinner." },
          { time: "7:30 PM", title: "Brewery hopping", description: "Sample local IPAs at three downtown breweries." },
        ],
      },
      {
        day: "Saturday",
        date: "Oct 10",
        activities: [
          { time: "9:00 AM", title: "Blue Ridge Parkway drive", description: "Scenic overlooks and a short waterfall hike." },
          { time: "1:00 PM", title: "Lunch downtown", description: "Farm-to-table lunch spot." },
          { time: "3:00 PM", title: "River Arts District", description: "Browse galleries and studios." },
          { time: "7:00 PM", title: "Group dinner", description: "Reservation at a local favorite." },
        ],
      },
      {
        day: "Sunday",
        date: "Oct 11",
        activities: [
          { time: "10:00 AM", title: "Brunch", description: "Bottomless mimosas before heading out." },
          { time: "12:30 PM", title: "Drive home", description: "Wrap up the weekend." },
        ],
      },
    ],
  },
  {
    id: "santa-fe",
    name: "Santa Fe",
    region: "New Mexico, USA",
    tagline: "Desert art, adobe architecture, and spice",
    gradient: "from-amber-500 to-red-700",
    budgetPerPerson: 460,
    travelTimeHours: 4.5,
    travelMode: "Fly",
    distanceMiles: 560,
    rating: 4.4,
    weather: "75°F, dry heat",
    highlights: ["Canyon Road galleries", "Green chile tasting", "Georgia O'Keeffe Museum", "Desert stargazing"],
    itinerary: [
      {
        day: "Friday",
        date: "Oct 9",
        activities: [
          { time: "6:00 PM", title: "Fly in & check in", description: "Evening flight, adobe-style boutique hotel." },
          { time: "8:30 PM", title: "Green chile dinner", description: "Classic New Mexican dinner downtown." },
        ],
      },
      {
        day: "Saturday",
        date: "Oct 10",
        activities: [
          { time: "9:00 AM", title: "Canyon Road galleries", description: "Walk the historic art district." },
          { time: "12:00 PM", title: "O'Keeffe Museum", description: "Guided tour of the collection." },
          { time: "3:00 PM", title: "Plaza & shopping", description: "Free time around the historic plaza." },
          { time: "9:00 PM", title: "Desert stargazing", description: "Guided stargazing tour outside the city." },
        ],
      },
      {
        day: "Sunday",
        date: "Oct 11",
        activities: [
          { time: "10:00 AM", title: "Brunch & pack up", description: "Last stop before the airport." },
          { time: "1:00 PM", title: "Fly home", description: "Afternoon flight back." },
        ],
      },
    ],
  },
]
