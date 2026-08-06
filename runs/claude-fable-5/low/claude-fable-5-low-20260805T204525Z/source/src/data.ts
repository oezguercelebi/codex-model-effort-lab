export type Vibe = "Beach" | "City" | "Mountains" | "Food & Wine" | "Nightlife" | "Outdoors" | "Culture"

export interface BudgetBreakdown {
  travel: number
  lodging: number
  food: number
  activities: number
}

export interface ItineraryStop {
  time: string
  title: string
  detail: string
  kind: "food" | "activity" | "travel" | "chill"
}

export interface ItineraryDay {
  label: string
  summary: string
  stops: ItineraryStop[]
}

export interface Destination {
  id: string
  name: string
  country: string
  tagline: string
  description: string
  vibes: Vibe[]
  travelHours: number
  travelMode: "Train" | "Flight" | "Car"
  budget: BudgetBreakdown // per person, whole weekend
  weather: { tempC: number; icon: "sun" | "cloud" | "mixed" }
  rating: number
  gradient: string
  emoji: string
  highlights: string[]
  itinerary: ItineraryDay[]
}

export interface Friend {
  id: string
  name: string
  initials: string
  color: string
  votes: string[] // destination ids
}

export const budgetTotal = (b: BudgetBreakdown) => b.travel + b.lodging + b.food + b.activities

export const destinations: Destination[] = [
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    tagline: "Sun-drenched hills, pastéis and Atlantic views",
    description:
      "Golden light, tiled facades and miradouros with cheap wine. Lisbon packs beach, food and nightlife into one walkable weekend, with Cascais a quick train ride away.",
    vibes: ["City", "Food & Wine", "Beach"],
    travelHours: 3,
    travelMode: "Flight",
    budget: { travel: 140, lodging: 160, food: 110, activities: 60 },
    weather: { tempC: 27, icon: "sun" },
    rating: 4.8,
    gradient: "from-amber-400 via-orange-400 to-rose-500",
    emoji: "🌅",
    highlights: ["Alfama sunset miradouros", "Pastéis de Belém", "Day trip to Cascais beach", "Fado night in Bairro Alto"],
    itinerary: [
      {
        label: "Friday",
        summary: "Land, drop bags, straight into Alfama",
        stops: [
          { time: "17:30", title: "Arrive & check in", detail: "Airbnb in Baixa — metro from the airport takes 25 min.", kind: "travel" },
          { time: "19:00", title: "Miradouro das Portas do Sol", detail: "First round of vinho verde with a view over the rooftops.", kind: "chill" },
          { time: "20:30", title: "Dinner at Taberna Sal Grosso", detail: "Small plates, order the bochechas. Book ahead for 6.", kind: "food" },
          { time: "23:00", title: "Bairro Alto bar crawl", detail: "Start at Park rooftop, end wherever the night takes us.", kind: "activity" },
        ],
      },
      {
        label: "Saturday",
        summary: "Belém pastries, tram 28, fado after dark",
        stops: [
          { time: "09:30", title: "Pastéis de Belém", detail: "Warm custard tarts straight from the source. Worth the queue.", kind: "food" },
          { time: "11:00", title: "Jerónimos & the riverfront", detail: "Wander the monastery cloisters, then walk the Tagus promenade.", kind: "activity" },
          { time: "14:00", title: "Time Out Market lunch", detail: "Everyone picks their own stall — no group indecision.", kind: "food" },
          { time: "16:00", title: "Tram 28 through Graça", detail: "The classic rattling ride up the hills. Hop off for viewpoints.", kind: "activity" },
          { time: "21:00", title: "Fado at Tasca do Chico", detail: "Cramped, candlelit, unforgettable. Arrive early to squeeze in.", kind: "activity" },
        ],
      },
      {
        label: "Sunday",
        summary: "Beach morning in Cascais, fly home tanned",
        stops: [
          { time: "10:00", title: "Train to Cascais", detail: "40 minutes along the coast from Cais do Sodré.", kind: "travel" },
          { time: "11:00", title: "Praia da Rainha", detail: "Swim, nap, one last swim. Ice cream at Santini.", kind: "chill" },
          { time: "14:30", title: "Seafood lunch at Mar do Inferno", detail: "Grilled fish by the cliffs of Boca do Inferno.", kind: "food" },
          { time: "18:00", title: "Head to the airport", detail: "Back via Cais do Sodré, metro to LIS for evening flights.", kind: "travel" },
        ],
      },
    ],
  },
  {
    id: "interlaken",
    name: "Interlaken",
    country: "Switzerland",
    tagline: "Two lakes, big peaks, bigger adrenaline",
    description:
      "The adventure capital of the Alps. Paragliding over turquoise lakes, hiking beneath the Eiger, and fondue that justifies every calorie burned.",
    vibes: ["Mountains", "Outdoors"],
    travelHours: 5.5,
    travelMode: "Train",
    budget: { travel: 120, lodging: 220, food: 150, activities: 140 },
    weather: { tempC: 19, icon: "mixed" },
    rating: 4.7,
    gradient: "from-emerald-400 via-teal-500 to-sky-600",
    emoji: "🏔️",
    highlights: ["Paragliding over Lake Thun", "Grindelwald First cliff walk", "Lake Brienz swim", "Fondue night"],
    itinerary: [
      {
        label: "Friday",
        summary: "Scenic train in, lakeside evening",
        stops: [
          { time: "16:00", title: "Train via Bern", detail: "The last hour along Lake Thun is the best window seat of the year.", kind: "travel" },
          { time: "18:30", title: "Check in at Backpackers Villa", detail: "Rooms face the Jungfrau. Grab supermarket supplies before 20:00.", kind: "travel" },
          { time: "19:30", title: "Sunset at Lake Brienz", detail: "Impossible turquoise water. Brave ones swim.", kind: "chill" },
          { time: "21:00", title: "Fondue at Bebbis", detail: "Classic moitié-moitié plus a round of kirsch.", kind: "food" },
        ],
      },
      {
        label: "Saturday",
        summary: "The big one: First cliff walk + paragliding",
        stops: [
          { time: "08:30", title: "Train to Grindelwald", detail: "Gondola up to First — book the 9:40 slot.", kind: "travel" },
          { time: "10:00", title: "First Cliff Walk & Bachalpsee hike", detail: "Two hours round trip to the mirror lake beneath the Schreckhorn.", kind: "activity" },
          { time: "13:00", title: "Rösti lunch on the terrace", detail: "Berggasthaus First, face the Eiger north face while you eat.", kind: "food" },
          { time: "16:30", title: "Paragliding over Interlaken", detail: "Tandem flight from Beatenberg — 20 minutes of pure grinning.", kind: "activity" },
          { time: "20:00", title: "Burgers at The 3 Tells", detail: "Big portions, local beer, war stories from the flight.", kind: "food" },
        ],
      },
      {
        label: "Sunday",
        summary: "Slow lake morning, home by dinner",
        stops: [
          { time: "09:30", title: "Boat across Lake Thun", detail: "Steamer to Spiez, castles and vineyards on the way.", kind: "activity" },
          { time: "12:00", title: "Picnic in Spiez", detail: "Bakery haul on the castle lawn above the bay.", kind: "food" },
          { time: "14:30", title: "Train home", detail: "Connect in Bern; nap guaranteed.", kind: "travel" },
        ],
      },
    ],
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    tagline: "Gaudí by day, vermut by night",
    description:
      "Architecture that looks like it melted in the sun, tapas crawls through El Born, and a city beach for the morning after. Barcelona is the safest crowd-pleaser on the list.",
    vibes: ["City", "Beach", "Nightlife", "Culture"],
    travelHours: 2.5,
    travelMode: "Flight",
    budget: { travel: 160, lodging: 190, food: 130, activities: 70 },
    weather: { tempC: 29, icon: "sun" },
    rating: 4.6,
    gradient: "from-fuchsia-500 via-purple-500 to-indigo-500",
    emoji: "🏖️",
    highlights: ["Sagrada Família at golden hour", "Tapas crawl in El Born", "Bunkers del Carmel sunset", "Barceloneta beach morning"],
    itinerary: [
      {
        label: "Friday",
        summary: "Vermut o'clock in El Born",
        stops: [
          { time: "18:00", title: "Arrive & check in", detail: "Aerobús to Plaça Catalunya, apartment in the Gothic Quarter.", kind: "travel" },
          { time: "19:30", title: "Vermut at Bar del Pla", detail: "House vermouth, patatas bravas, warm-up round.", kind: "food" },
          { time: "21:30", title: "Tapas crawl through El Born", detail: "El Xampanyet → Cal Pep → wherever has a free barrel table.", kind: "food" },
          { time: "00:30", title: "Drinks at Paradiso", detail: "Speakeasy behind a pastrami fridge. Trust us.", kind: "activity" },
        ],
      },
      {
        label: "Saturday",
        summary: "Gaudí greatest hits, sunset from the bunkers",
        stops: [
          { time: "09:00", title: "Sagrada Família", detail: "First entry slot beats the crowds. Book tower access.", kind: "activity" },
          { time: "11:30", title: "Passeig de Gràcia stroll", detail: "Casa Batlló and La Pedrera facades, coffee stop at Satan's.", kind: "activity" },
          { time: "14:00", title: "Paella at Can Solé", detail: "Old-school Barceloneta institution since 1903.", kind: "food" },
          { time: "16:30", title: "Beach siesta", detail: "Barceloneta or quieter Bogatell. Rent an umbrella.", kind: "chill" },
          { time: "20:00", title: "Sunset at Bunkers del Carmel", detail: "Bring cava, the whole city glows below.", kind: "chill" },
          { time: "22:30", title: "Dinner in Gràcia", detail: "Plaça del Sol terraces, then late drinks nearby.", kind: "food" },
        ],
      },
      {
        label: "Sunday",
        summary: "Park Güell then a slow goodbye",
        stops: [
          { time: "10:00", title: "Park Güell", detail: "Mosaic dragons and hazy views back to the sea.", kind: "activity" },
          { time: "13:00", title: "Long lunch at Bar Cañete", detail: "Sit at the bar, order whatever the chef points at.", kind: "food" },
          { time: "16:30", title: "Airport", detail: "Aerobús back to T1, flights home around 19:00.", kind: "travel" },
        ],
      },
    ],
  },
  {
    id: "copenhagen",
    name: "Copenhagen",
    country: "Denmark",
    tagline: "Bikes, harbour swims and world-class pastries",
    description:
      "Effortlessly cool and absurdly livable. Rent bikes, swim in the clean harbour, eat your body weight in cardamom buns, and end up at a natural wine bar by 9pm.",
    vibes: ["City", "Food & Wine", "Culture"],
    travelHours: 1.5,
    travelMode: "Flight",
    budget: { travel: 110, lodging: 240, food: 180, activities: 50 },
    weather: { tempC: 21, icon: "mixed" },
    rating: 4.5,
    gradient: "from-sky-400 via-cyan-500 to-blue-600",
    emoji: "🚲",
    highlights: ["Harbour swim at Islands Brygge", "Cardamom buns at Juno", "Reffen street food", "Louisiana museum day trip"],
    itinerary: [
      {
        label: "Friday",
        summary: "Bikes sorted, street food by the water",
        stops: [
          { time: "17:00", title: "Arrive & rent bikes", detail: "Metro from CPH in 15 min, Donkey bikes for the weekend.", kind: "travel" },
          { time: "18:30", title: "Reffen street food market", detail: "Harbourside containers — duck fries, smash burgers, sunset.", kind: "food" },
          { time: "21:00", title: "Natural wine at Den Vandrette", detail: "Glasses by the canal as the light stays impossibly late.", kind: "chill" },
        ],
      },
      {
        label: "Saturday",
        summary: "Pastry crawl, harbour swim, Tivoli after dark",
        stops: [
          { time: "09:00", title: "Cardamom buns at Juno the Bakery", detail: "Queue with the locals in Østerbro. Worth every minute.", kind: "food" },
          { time: "10:30", title: "Cycle the city loop", detail: "Nyhavn → Amalienborg → the lakes. Flat, easy, gorgeous.", kind: "activity" },
          { time: "13:00", title: "Smørrebrød at Aamanns", detail: "Open sandwiches elevated to art. Split six, taste all.", kind: "food" },
          { time: "15:00", title: "Harbour swim at Islands Brygge", detail: "Clean enough to drink (don't). Towels on the boardwalk.", kind: "activity" },
          { time: "19:00", title: "Tivoli Gardens", detail: "Old rides, fairy lights, one obligatory rollercoaster scream.", kind: "activity" },
        ],
      },
      {
        label: "Sunday",
        summary: "Art by the sea at Louisiana",
        stops: [
          { time: "10:00", title: "Train to Louisiana", detail: "35 min up the coast to the best museum café view in Europe.", kind: "travel" },
          { time: "11:00", title: "Louisiana Museum of Modern Art", detail: "Giacometti with a sea view, sculpture garden picnic.", kind: "activity" },
          { time: "15:30", title: "Back to town, last coffee", detail: "Coffee Collective flight before the airport metro.", kind: "food" },
          { time: "17:30", title: "Fly home", detail: "Short hop, home in time to unpack properly.", kind: "travel" },
        ],
      },
    ],
  },
  {
    id: "prague",
    name: "Prague",
    country: "Czechia",
    tagline: "Gothic spires and the best beer money barely buys",
    description:
      "A fairytale skyline, riverside beer gardens, and prices that let the whole group say yes to everything. Best value on the shortlist by a distance.",
    vibes: ["City", "Nightlife", "Culture"],
    travelHours: 4,
    travelMode: "Train",
    budget: { travel: 80, lodging: 120, food: 80, activities: 45 },
    weather: { tempC: 23, icon: "sun" },
    rating: 4.4,
    gradient: "from-orange-400 via-red-500 to-rose-600",
    emoji: "🏰",
    highlights: ["Charles Bridge at dawn", "Letná beer garden", "Old Town astronomical clock", "Riverside paddle boats"],
    itinerary: [
      {
        label: "Friday",
        summary: "Old Town first impressions, beer garden sunset",
        stops: [
          { time: "16:30", title: "Train in, check in", detail: "Apartment near Old Town Square, everything walkable.", kind: "travel" },
          { time: "18:00", title: "Letná beer garden", detail: "Pilsner under the trees with the whole city below.", kind: "chill" },
          { time: "20:30", title: "Dinner at Lokál", detail: "Svíčková and tank beer — the classic done perfectly.", kind: "food" },
          { time: "23:00", title: "Jazz at U Malého Glena", detail: "Tiny basement club, great live sets.", kind: "activity" },
        ],
      },
      {
        label: "Saturday",
        summary: "Castle, bridge, paddle boats, party",
        stops: [
          { time: "08:00", title: "Charles Bridge before the crowds", detail: "Dawn-ish light, statues to ourselves, coffee after.", kind: "activity" },
          { time: "10:00", title: "Prague Castle & St. Vitus", detail: "Wander the lanes of Golden Lane, views over red rooftops.", kind: "activity" },
          { time: "13:30", title: "Lunch at Eska", detail: "Modern Czech in a converted Karlín factory.", kind: "food" },
          { time: "16:00", title: "Paddle boats on the Vltava", detail: "Swan boats, obviously. Race format optional.", kind: "activity" },
          { time: "20:00", title: "Dinner & bar hop in Žižkov", detail: "More bars per capita than anywhere in Europe. Pace yourselves.", kind: "food" },
        ],
      },
      {
        label: "Sunday",
        summary: "Slow brunch and a riverside goodbye",
        stops: [
          { time: "10:30", title: "Brunch at Café Savoy", detail: "Grand café ceilings, eggs benedict, one last trdelník debate.", kind: "food" },
          { time: "12:30", title: "Náplavka riverside market", detail: "Sunday stalls along the embankment, souvenirs that aren't tat.", kind: "activity" },
          { time: "15:00", title: "Train home", detail: "Nap, photo triage, group album by Monday.", kind: "travel" },
        ],
      },
    ],
  },
  {
    id: "amalfi",
    name: "Amalfi Coast",
    country: "Italy",
    tagline: "Cliffside villages, lemon groves, la dolce vita",
    description:
      "Pastel villages stacked on cliffs, boat days on impossibly blue water, and pasta that ruins all other pasta. The splurge option — and everyone knows it's worth it.",
    vibes: ["Beach", "Food & Wine", "Outdoors"],
    travelHours: 6,
    travelMode: "Flight",
    budget: { travel: 210, lodging: 280, food: 170, activities: 120 },
    weather: { tempC: 30, icon: "sun" },
    rating: 4.9,
    gradient: "from-cyan-400 via-sky-500 to-indigo-600",
    emoji: "🍋",
    highlights: ["Boat day to Capri", "Path of the Gods hike", "Positano beach club", "Limoncello tasting"],
    itinerary: [
      {
        label: "Friday",
        summary: "The long way in, rewarded with a Positano sunset",
        stops: [
          { time: "14:00", title: "Fly to Naples, transfer", detail: "Shared car down the coast road — window seats fight it out.", kind: "travel" },
          { time: "17:30", title: "Check in above Positano", detail: "Terrace with the postcard view. Spritzes immediately.", kind: "chill" },
          { time: "20:30", title: "Dinner at Da Vincenzo", detail: "Grilled octopus and scialatielli ai frutti di mare.", kind: "food" },
        ],
      },
      {
        label: "Saturday",
        summary: "Boat day — Capri, grottos, swimming off the stern",
        stops: [
          { time: "09:00", title: "Private boat from the marina", detail: "Full-day charter split six ways. Skipper knows the coves.", kind: "activity" },
          { time: "11:00", title: "Capri & the Faraglioni", detail: "Swim through the arch, gawk at the yachts.", kind: "activity" },
          { time: "13:30", title: "Lunch at Lo Scoglio", detail: "Spaghetti alle zucchine on a pier in Nerano.", kind: "food" },
          { time: "16:00", title: "Grotto swims on the way back", detail: "Emerald water, cliff jumps for the brave.", kind: "activity" },
          { time: "21:00", title: "Limoncello on the terrace", detail: "Sunburnt, salty, extremely pleased with ourselves.", kind: "chill" },
        ],
      },
      {
        label: "Sunday",
        summary: "Path of the Gods, one last swim, home",
        stops: [
          { time: "08:30", title: "Path of the Gods hike", detail: "Bomerano to Nocelle, two hours of cliff-edge views.", kind: "activity" },
          { time: "12:00", title: "Last swim at Fornillo beach", detail: "The quieter Positano beach, one final plunge.", kind: "chill" },
          { time: "15:00", title: "Transfer to Naples, fly home", detail: "Pizza al portafoglio at the airport if timing allows.", kind: "travel" },
        ],
      },
    ],
  },
]

export const friends: Friend[] = [
  { id: "you", name: "You", initials: "YO", color: "bg-stone-900", votes: [] },
  { id: "maya", name: "Maya", initials: "MA", color: "bg-rose-500", votes: ["lisbon", "amalfi"] },
  { id: "jonas", name: "Jonas", initials: "JO", color: "bg-emerald-500", votes: ["interlaken", "prague"] },
  { id: "priya", name: "Priya", initials: "PR", color: "bg-violet-500", votes: ["lisbon", "barcelona"] },
  { id: "sam", name: "Sam", initials: "SA", color: "bg-amber-500", votes: ["copenhagen", "lisbon"] },
  { id: "leo", name: "Leo", initials: "LE", color: "bg-sky-500", votes: ["amalfi", "barcelona"] },
]

export const MAX_VOTES = 2
export const TRIP_DATES = "Fri Sep 18 – Sun Sep 20"
