export type VibeTag =
  | "Beach"
  | "Food"
  | "Nightlife"
  | "Culture"
  | "Outdoors"
  | "Budget-friendly"
  | "Design"
  | "Adventure"

export type WeatherKind = "sunny" | "partly" | "cloudy" | "rainy"

export interface BudgetBreakdown {
  transport: number
  stay: number
  food: number
  activities: number
}

export type ItineraryKind = "travel" | "food" | "sight" | "outdoors" | "nightlife" | "chill"

export interface ItineraryItem {
  time: string
  title: string
  note: string
  kind: ItineraryKind
}

export interface ItineraryDay {
  label: string
  date: string
  summary: string
  items: ItineraryItem[]
}

export interface Destination {
  id: string
  name: string
  country: string
  flag: string
  emoji: string
  gradient: string
  tagline: string
  vibes: VibeTag[]
  travel: {
    mode: "flight" | "train"
    durationMin: number
    detail: string
  }
  budget: BudgetBreakdown
  weather: { tempC: number; kind: WeatherKind }
  scores: { food: number; nightlife: number; culture: number; outdoors: number }
  stayArea: string
  itinerary: ItineraryDay[]
}

export interface Friend {
  id: string
  name: string
  initials: string
  color: string
  votes: string[]
  comment?: string
}

export const TRIP = {
  title: "September escape",
  dates: "Fri Sep 18 – Sun Sep 20",
  origin: "Berlin",
  groupSize: 5,
  maxVotesPerPerson: 3,
}

export const YOU = {
  id: "you",
  name: "You",
  initials: "YO",
  color: "bg-amber-500",
}

export const FRIENDS: Friend[] = [
  {
    id: "maya",
    name: "Maya",
    initials: "MA",
    color: "bg-rose-500",
    votes: ["lisbon", "barcelona"],
    comment: "Sun or nothing. I want one last beach day this year.",
  },
  {
    id: "jonas",
    name: "Jonas",
    initials: "JO",
    color: "bg-sky-500",
    votes: ["prague", "lisbon", "interlaken"],
    comment: "Trying to keep it under €400 if we can.",
  },
  {
    id: "priya",
    name: "Priya",
    initials: "PR",
    color: "bg-emerald-500",
    votes: ["lisbon", "copenhagen"],
    comment: "Somewhere walkable with great food, please.",
  },
  {
    id: "leo",
    name: "Leo",
    initials: "LE",
    color: "bg-violet-500",
    votes: ["barcelona", "prague"],
    comment: "As long as there's nightlife, I'm in.",
  },
]

export const DESTINATIONS: Destination[] = [
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    flag: "🇵🇹",
    emoji: "🚋",
    gradient: "from-amber-200 via-orange-300 to-rose-300",
    tagline: "Golden light, tiled hills, and pastéis de nata on every corner.",
    vibes: ["Food", "Culture", "Nightlife"],
    travel: { mode: "flight", durationMin: 215, detail: "Direct from BER, 2× daily" },
    budget: { transport: 120, stay: 150, food: 90, activities: 60 },
    weather: { tempC: 26, kind: "sunny" },
    scores: { food: 5, nightlife: 4, culture: 4, outdoors: 3 },
    stayArea: "Alfama",
    itinerary: [
      {
        label: "Friday",
        date: "Sep 18",
        summary: "Land, drop bags, dive straight into Bairro Alto.",
        items: [
          { time: "18:40", title: "Land in Lisbon", note: "Metro + a rattling tram ride up to the flat in Alfama.", kind: "travel" },
          { time: "20:30", title: "Petiscos dinner", note: "Shared plates and vinho verde at a tasca in Bairro Alto.", kind: "food" },
          { time: "23:00", title: "Rooftop nightcap", note: "Drinks at Park with the Tagus and the bridge lit up below.", kind: "nightlife" },
        ],
      },
      {
        label: "Saturday",
        date: "Sep 19",
        summary: "Trams, castle views, and a long seafood lunch.",
        items: [
          { time: "09:30", title: "Pastéis de nata run", note: "Warm ones from Manteigaria — two each, minimum.", kind: "food" },
          { time: "10:30", title: "Tram 28 to São Jorge Castle", note: "Ride the classic line up, then walk the castle walls.", kind: "sight" },
          { time: "13:30", title: "Seafood at Time Out Market", note: "Garlic prawns, grilled octopus, and a table for five.", kind: "food" },
          { time: "16:00", title: "LX Factory wander", note: "Bookshops, murals, and coffee under the bridge.", kind: "chill" },
          { time: "19:00", title: "Sunset at Miradouro da Graça", note: "Cold drinks from the kiosk while the city goes orange.", kind: "outdoors" },
          { time: "21:00", title: "Fado night", note: "Late dinner with live fado in a candlelit Alfama cellar.", kind: "nightlife" },
        ],
      },
      {
        label: "Sunday",
        date: "Sep 20",
        summary: "Belém classics, one last nata, fly home.",
        items: [
          { time: "10:00", title: "Belém Tower & monastery", note: "Riverside stroll past the monument to the Jerónimos cloisters.", kind: "sight" },
          { time: "12:30", title: "Farewell lunch", note: "Grilled fish near the river — and the original Pastéis de Belém.", kind: "food" },
          { time: "15:40", title: "Fly home", note: "Direct back to Berlin, landing just after 20:00.", kind: "travel" },
        ],
      },
    ],
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    flag: "🇪🇸",
    emoji: "🏖️",
    gradient: "from-orange-200 via-rose-300 to-fuchsia-300",
    tagline: "Gaudí mornings, beach afternoons, tapas until late.",
    vibes: ["Beach", "Food", "Nightlife"],
    travel: { mode: "flight", durationMin: 170, detail: "Direct from BER, several daily" },
    budget: { transport: 130, stay: 160, food: 95, activities: 70 },
    weather: { tempC: 27, kind: "sunny" },
    scores: { food: 5, nightlife: 5, culture: 4, outdoors: 4 },
    stayArea: "Eixample",
    itinerary: [
      {
        label: "Friday",
        date: "Sep 18",
        summary: "Arrive hungry — El Born takes care of the rest.",
        items: [
          { time: "19:00", title: "Land in Barcelona", note: "Aerobús into town, keys picked up in Eixample.", kind: "travel" },
          { time: "21:00", title: "Tapas crawl in El Born", note: "Patatas bravas, jamón, anchovies — three bars, one street.", kind: "food" },
          { time: "23:30", title: "Beach-bar nightcap", note: "Toes in the sand at a xiringuito on Barceloneta.", kind: "nightlife" },
        ],
      },
      {
        label: "Saturday",
        date: "Sep 19",
        summary: "Sagrada Família, the Gothic Quarter, then the sea.",
        items: [
          { time: "09:30", title: "Sagrada Família", note: "Timed-entry slot booked — go straight up the Nativity tower.", kind: "sight" },
          { time: "12:00", title: "Gothic Quarter wander", note: "Narrow lanes, plaça-hopping, and a vermut stop.", kind: "sight" },
          { time: "14:00", title: "Paella by the marina", note: "Long lunch near Barceloneta — one seafood, one black rice.", kind: "food" },
          { time: "16:00", title: "Beach afternoon", note: "Swim, nap, repeat. Water's still 23° in September.", kind: "outdoors" },
          { time: "19:30", title: "Sunset at Bunkers del Carmel", note: "The whole city at your feet — bring supplies.", kind: "outdoors" },
          { time: "21:30", title: "Dinner & drinks in Gràcia", note: "Neighborhood plaças that don't wind down until late.", kind: "nightlife" },
        ],
      },
      {
        label: "Sunday",
        date: "Sep 20",
        summary: "Park Güell, a slow brunch, adiós.",
        items: [
          { time: "10:00", title: "Park Güell", note: "Mosaic terraces before the day-trippers arrive.", kind: "sight" },
          { time: "12:30", title: "Brunch in Gràcia", note: "Tortilla, tomato bread, and one last café con leche.", kind: "food" },
          { time: "15:30", title: "Fly home", note: "Direct to Berlin — home in time to unpack.", kind: "travel" },
        ],
      },
    ],
  },
  {
    id: "prague",
    name: "Prague",
    country: "Czechia",
    flag: "🇨🇿",
    emoji: "🏰",
    gradient: "from-stone-200 via-amber-200 to-orange-200",
    tagline: "Fairy-tale bridges, castle views, and Europe's best beer for €2.",
    vibes: ["Budget-friendly", "Culture", "Nightlife"],
    travel: { mode: "train", durationMin: 255, detail: "EC direct from Berlin Hbf" },
    budget: { transport: 60, stay: 95, food: 70, activities: 45 },
    weather: { tempC: 21, kind: "partly" },
    scores: { food: 3, nightlife: 4, culture: 5, outdoors: 3 },
    stayArea: "Old Town",
    itinerary: [
      {
        label: "Friday",
        date: "Sep 18",
        summary: "Roll in by train and go straight to a pivnice.",
        items: [
          { time: "18:15", title: "Arrive at Praha hl.n.", note: "Ten-minute walk to the apartment by the Old Town.", kind: "travel" },
          { time: "20:00", title: "Czech classics dinner", note: "Svíčková and dumplings at a wood-panelled pivnice.", kind: "food" },
          { time: "22:00", title: "Craft beer crawl", note: "Žižkov's taprooms — rounds are cheaper than the tram home.", kind: "nightlife" },
        ],
      },
      {
        label: "Saturday",
        date: "Sep 19",
        summary: "Beat the crowds to the bridge, end in a beer garden.",
        items: [
          { time: "09:00", title: "Charles Bridge early", note: "Statues, swans, and almost nobody else on the bridge.", kind: "sight" },
          { time: "10:30", title: "Prague Castle & Golden Lane", note: "St. Vitus Cathedral, then the tiny painted houses.", kind: "sight" },
          { time: "13:00", title: "Lunch in Malá Strana", note: "Goulash in a courtyard garden below the castle.", kind: "food" },
          { time: "15:30", title: "Letná beer garden", note: "Pilsner under the trees with the best view of the bridges.", kind: "chill" },
          { time: "19:00", title: "Dinner by the river", note: "Modern Czech tasting plates on the Vltava embankment.", kind: "food" },
          { time: "21:30", title: "Jazz in a cellar bar", note: "Live set at a vaulted club off the Old Town Square.", kind: "nightlife" },
        ],
      },
      {
        label: "Sunday",
        date: "Sep 20",
        summary: "The astronomical clock, brunch, easy train home.",
        items: [
          { time: "10:00", title: "Old Town Square", note: "Catch the astronomical clock strike the hour.", kind: "sight" },
          { time: "11:30", title: "Brunch in Vinohrady", note: "Eggs benedict and flat whites in the leafy quarter.", kind: "food" },
          { time: "14:30", title: "Train home", note: "Direct EC along the Elbe — the pretty way back to Berlin.", kind: "travel" },
        ],
      },
    ],
  },
  {
    id: "copenhagen",
    name: "Copenhagen",
    country: "Denmark",
    flag: "🇩🇰",
    emoji: "🚲",
    gradient: "from-sky-200 via-cyan-200 to-teal-200",
    tagline: "Bikes, harbor swims, and pastries that ruin all other pastries.",
    vibes: ["Design", "Food", "Outdoors"],
    travel: { mode: "flight", durationMin: 65, detail: "Direct from BER, 1h hop" },
    budget: { transport: 90, stay: 210, food: 120, activities: 70 },
    weather: { tempC: 18, kind: "partly" },
    scores: { food: 5, nightlife: 3, culture: 4, outdoors: 4 },
    stayArea: "Indre By",
    itinerary: [
      {
        label: "Friday",
        date: "Sep 18",
        summary: "A one-hour hop, then smørrebrød and Nyhavn at dusk.",
        items: [
          { time: "18:00", title: "Land at CPH", note: "Metro straight into Indre By in fifteen minutes.", kind: "travel" },
          { time: "19:30", title: "Smørrebrød dinner", note: "Open sandwiches and cold snaps at a classic bodega.", kind: "food" },
          { time: "21:30", title: "Nyhavn stroll", note: "Harbor lights, painted townhouses, one quayside beer.", kind: "chill" },
        ],
      },
      {
        label: "Saturday",
        date: "Sep 19",
        summary: "Bike the city, swim the harbor, end at Tivoli.",
        items: [
          { time: "09:00", title: "Cardamom buns at Juno", note: "Worth the queue. Grab extras for the road.", kind: "food" },
          { time: "10:00", title: "Bike-rental city loop", note: "Christianshavn canals, the opera house, Superkilen park.", kind: "outdoors" },
          { time: "12:30", title: "Street food at Reffen", note: "Harbourside food trucks — everyone picks a different stall.", kind: "food" },
          { time: "14:30", title: "Harbor swim at Islands Brygge", note: "Clean, cold, and very Copenhagen. Towels mandatory.", kind: "outdoors" },
          { time: "17:00", title: "Design-shop browsing", note: "Strøget side streets for ceramics and posters you can't afford.", kind: "chill" },
          { time: "20:00", title: "Evening at Tivoli", note: "Old rides, live music, and the gardens lit like a film set.", kind: "nightlife" },
        ],
      },
      {
        label: "Sunday",
        date: "Sep 20",
        summary: "Louisiana museum up the coast, then the short flight back.",
        items: [
          { time: "10:00", title: "Train to Louisiana", note: "Art museum on the sound — the sculpture garden is the star.", kind: "sight" },
          { time: "13:30", title: "Lunch by the sea", note: "Museum café with a view across to Sweden.", kind: "food" },
          { time: "16:30", title: "Fly home", note: "One hour back to Berlin — barely time for a nap.", kind: "travel" },
        ],
      },
    ],
  },
  {
    id: "amsterdam",
    name: "Amsterdam",
    country: "Netherlands",
    flag: "🇳🇱",
    emoji: "🛶",
    gradient: "from-violet-200 via-indigo-200 to-sky-300",
    tagline: "Canal rings, world-class museums, and bikes with right of way.",
    vibes: ["Culture", "Nightlife", "Design"],
    travel: { mode: "flight", durationMin: 85, detail: "Direct from BER, several daily" },
    budget: { transport: 80, stay: 200, food: 110, activities: 75 },
    weather: { tempC: 19, kind: "rainy" },
    scores: { food: 4, nightlife: 4, culture: 5, outdoors: 3 },
    stayArea: "Jordaan",
    itinerary: [
      {
        label: "Friday",
        date: "Sep 18",
        summary: "Touch down and settle into the Jordaan.",
        items: [
          { time: "19:00", title: "Land at Schiphol", note: "Fifteen-minute train ride into Centraal.", kind: "travel" },
          { time: "20:30", title: "Rijsttafel dinner", note: "Indonesian feast — a dozen little dishes for the table.", kind: "food" },
          { time: "22:30", title: "Brown café nightcap", note: "Candlelit canal-side bar in the Jordaan.", kind: "nightlife" },
        ],
      },
      {
        label: "Saturday",
        date: "Sep 19",
        summary: "Markets, Van Gogh, and an evening on the water.",
        items: [
          { time: "09:30", title: "Albert Cuyp market", note: "Fresh stroopwafels while they're still warm and sticky.", kind: "food" },
          { time: "11:00", title: "Van Gogh Museum", note: "Timed tickets booked — sunflowers before lunch.", kind: "sight" },
          { time: "13:30", title: "Lunch in De Pijp", note: "Broodjes and bitterballen at a corner café.", kind: "food" },
          { time: "15:00", title: "Canal cruise", note: "Small open boat through the ring — rain jackets ready.", kind: "sight" },
          { time: "17:30", title: "Vondelpark loop", note: "Stretch the legs with the joggers and herons.", kind: "outdoors" },
          { time: "21:00", title: "Live show at Paradiso", note: "Gig in a converted church — check the listings.", kind: "nightlife" },
        ],
      },
      {
        label: "Sunday",
        date: "Sep 20",
        summary: "Ferry across the IJ, brunch, fly home.",
        items: [
          { time: "10:00", title: "Bike ride to NDSM", note: "Free ferry across the IJ to the shipyard-turned-art-yard.", kind: "outdoors" },
          { time: "12:30", title: "Brunch at a bakery café", note: "Sourdough, eggs, and one last appeltaart.", kind: "food" },
          { time: "15:00", title: "Fly home", note: "Short hop back to Berlin by early evening.", kind: "travel" },
        ],
      },
    ],
  },
  {
    id: "interlaken",
    name: "Interlaken",
    country: "Switzerland",
    flag: "🇨🇭",
    emoji: "🏔️",
    gradient: "from-emerald-200 via-teal-300 to-sky-300",
    tagline: "Two lakes, one massif, and hiking straight from the doorstep.",
    vibes: ["Outdoors", "Adventure"],
    travel: { mode: "flight", durationMin: 320, detail: "Fly to Zürich + scenic train" },
    budget: { transport: 140, stay: 190, food: 110, activities: 120 },
    weather: { tempC: 15, kind: "partly" },
    scores: { food: 3, nightlife: 2, culture: 3, outdoors: 5 },
    stayArea: "Unterseen",
    itinerary: [
      {
        label: "Friday",
        date: "Sep 18",
        summary: "Scenic train in, fondue, early night before the big day.",
        items: [
          { time: "17:30", title: "Arrive via Zürich", note: "The train hugs Lake Thun for the last half hour.", kind: "travel" },
          { time: "18:30", title: "Lakeside walk", note: "Stretch the legs along the Aare between the two lakes.", kind: "chill" },
          { time: "19:30", title: "Fondue dinner", note: "Cheese, kirsch, and strict no-phone rules at the table.", kind: "food" },
        ],
      },
      {
        label: "Saturday",
        date: "Sep 19",
        summary: "Up the mountain early — hike, fly, or both.",
        items: [
          { time: "08:00", title: "Train to Grindelwald", note: "Gondola up to First with the Eiger filling the window.", kind: "travel" },
          { time: "09:00", title: "First cliff walk & hike", note: "Ridge trail to Bachalpsee — postcard views the whole way.", kind: "outdoors" },
          { time: "13:00", title: "Mountain-hut lunch", note: "Rösti and Alpine macaroni at 2,200 metres.", kind: "food" },
          { time: "15:00", title: "Paragliding or kayaking", note: "Tandem flight over Interlaken, or paddle Lake Brienz's blue water.", kind: "outdoors" },
          { time: "19:00", title: "Dinner in Unterseen", note: "Alpine plates in the old town square.", kind: "food" },
          { time: "21:00", title: "Sauna & stargazing", note: "Recovery hour — the sky up here actually has stars.", kind: "chill" },
        ],
      },
      {
        label: "Sunday",
        date: "Sep 20",
        summary: "One last viewpoint, a picnic, the long ride home.",
        items: [
          { time: "09:30", title: "Harder Kulm funicular", note: "The two-lakes viewpoint photo everyone came for.", kind: "sight" },
          { time: "12:00", title: "Lakeside picnic", note: "Bakery haul on the shore of Lake Brienz.", kind: "food" },
          { time: "14:30", title: "Head home", note: "Train to Zürich, evening flight back to Berlin.", kind: "travel" },
        ],
      },
    ],
  },
]

export const ALL_VIBES: VibeTag[] = [
  "Beach",
  "Food",
  "Nightlife",
  "Culture",
  "Outdoors",
  "Budget-friendly",
  "Design",
  "Adventure",
]

export function budgetTotal(b: BudgetBreakdown): number {
  return b.transport + b.stay + b.food + b.activities
}

export function formatDuration(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${String(m).padStart(2, "0")}`
}

export function formatEuro(n: number): string {
  return `€${n.toLocaleString("en-US")}`
}
