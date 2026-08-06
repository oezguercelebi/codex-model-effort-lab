export type Vibe = "Culture" | "Nightlife" | "Nature" | "Food" | "Beach" | "Wellness"

export type TravelMode = "train" | "flight" | "car"

export interface BudgetBreakdown {
  travel: number
  stay: number
  food: number
  activities: number
}

export interface ItineraryItem {
  time: string
  title: string
  note: string
  cost: number
}

export interface ItineraryDay {
  label: string
  date: string
  items: ItineraryItem[]
}

export interface Destination {
  id: string
  name: string
  country: string
  tagline: string
  vibes: Vibe[]
  travelMode: TravelMode
  travelTimeH: number
  travelSummary: string
  budget: BudgetBreakdown
  tempC: number
  weather: string
  highlights: string[]
  gradient: string
  emoji: string
  stay: string
  itinerary: ItineraryDay[]
}

export interface Friend {
  id: string
  name: string
  initials: string
  color: string
  votes: string[]
  comment: string
}

export const TRIP = {
  name: "September escape",
  origin: "Berlin",
  dates: "Fri 18 – Sun 20 Sep 2026",
  nights: 2,
  votesPerPerson: 2,
}

export function budgetTotal(b: BudgetBreakdown): number {
  return b.travel + b.stay + b.food + b.activities
}

export const FRIENDS: Friend[] = [
  {
    id: "maya",
    name: "Maya",
    initials: "MK",
    color: "bg-rose-500",
    votes: ["prague", "barcelona"],
    comment: "Sun or castles, I'm easy — just not another rainy hike.",
  },
  {
    id: "jonas",
    name: "Jonas",
    initials: "JB",
    color: "bg-sky-500",
    votes: ["prague", "copenhagen"],
    comment: "Trains over airports. Prague beer garden Saturday?",
  },
  {
    id: "lena",
    name: "Lena",
    initials: "LS",
    color: "bg-violet-500",
    votes: ["barcelona", "amsterdam"],
    comment: "If we're flying anyway, let's go where it's 26°.",
  },
  {
    id: "sam",
    name: "Sam",
    initials: "SO",
    color: "bg-emerald-500",
    votes: ["ruegen", "prague"],
    comment: "Cheap + outdoors gets my vote. Budget is tight this month.",
  },
]

export const YOU = {
  id: "you",
  name: "You",
  initials: "YO",
  color: "bg-amber-500",
}

export const DESTINATIONS: Destination[] = [
  {
    id: "prague",
    name: "Prague",
    country: "Czechia",
    tagline: "Gothic spires, riverside beer gardens, and Europe's prettiest old town.",
    vibes: ["Culture", "Nightlife", "Food"],
    travelMode: "train",
    travelTimeH: 4.2,
    travelSummary: "Direct EC train from Berlin Hbf, ~4 h 10 min",
    budget: { travel: 58, stay: 96, food: 85, activities: 40 },
    tempC: 21,
    weather: "Sunny spells",
    highlights: ["Charles Bridge at sunrise", "Letná beer garden", "Old Town Hall astronomical clock"],
    gradient: "from-orange-400 via-rose-500 to-purple-600",
    emoji: "🏰",
    stay: "Airbnb loft in Vinohrady · 2 bedrooms",
    itinerary: [
      {
        label: "Friday",
        date: "18 Sep",
        items: [
          { time: "15:24", title: "Train from Berlin Hbf", note: "EC 177, direct — grab window seats on the right for Elbe views", cost: 29 },
          { time: "19:45", title: "Check in, Vinohrady loft", note: "Keys via lockbox, 10 min tram from the station", cost: 0 },
          { time: "20:30", title: "Dinner at Lokál Dlouhá", note: "Tank Pilsner and svíčková — book the big table", cost: 22 },
          { time: "23:00", title: "Night walk over Charles Bridge", note: "Empty after 11pm, best photos of the trip", cost: 0 },
        ],
      },
      {
        label: "Saturday",
        date: "19 Sep",
        items: [
          { time: "09:30", title: "Breakfast at Eska", note: "Bakery-café in Karlín, famous potato bread", cost: 12 },
          { time: "11:00", title: "Prague Castle & St. Vitus", note: "Circuit B tickets, skip-the-line slot booked", cost: 14 },
          { time: "14:30", title: "Lunch in Malá Strana", note: "Goulash and dumplings at U Magistra Kelly", cost: 15 },
          { time: "17:00", title: "Letná beer garden", note: "Golden hour over the river — the group photo spot", cost: 10 },
          { time: "21:00", title: "Jazz at Reduta or bar crawl", note: "Split crew: jazz club vs. Dlouhá street bars", cost: 18 },
        ],
      },
      {
        label: "Sunday",
        date: "20 Sep",
        items: [
          { time: "10:00", title: "Vyšehrad fortress walk", note: "Quiet ramparts, city views, no crowds", cost: 0 },
          { time: "12:30", title: "Farewell lunch at Café Savoy", note: "Grand café brunch — reserve ahead", cost: 20 },
          { time: "16:27", title: "Train home to Berlin", note: "EC 176, arrives 20:38 — buy snacks at the station", cost: 29 },
        ],
      },
    ],
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    tagline: "Late-summer beach days, Gaudí, and tapas until midnight.",
    vibes: ["Beach", "Food", "Nightlife"],
    travelMode: "flight",
    travelTimeH: 2.8,
    travelSummary: "Direct flight BER → BCN, ~2 h 50 min",
    budget: { travel: 178, stay: 132, food: 110, activities: 55 },
    tempC: 26,
    weather: "Sunny, 26°",
    highlights: ["Barceloneta beach", "Sagrada Família", "Tapas crawl in El Born"],
    gradient: "from-amber-400 via-orange-500 to-red-500",
    emoji: "🏖️",
    stay: "Apartment near Passeig de Gràcia · sleeps 5",
    itinerary: [
      {
        label: "Friday",
        date: "18 Sep",
        items: [
          { time: "16:10", title: "Flight BER → BCN", note: "Vueling direct, land 18:55 — Aerobús into town", cost: 89 },
          { time: "20:30", title: "Check in near Passeig de Gràcia", note: "Rooftop terrace for the first cava", cost: 0 },
          { time: "21:30", title: "Tapas crawl in El Born", note: "El Xampanyet first, then follow the crowd", cost: 28 },
        ],
      },
      {
        label: "Saturday",
        date: "19 Sep",
        items: [
          { time: "09:00", title: "Sagrada Família", note: "9am tower slot booked — beat the heat and lines", cost: 33 },
          { time: "11:30", title: "Coffee & Gràcia wander", note: "Plaça del Sol, vintage shops", cost: 6 },
          { time: "13:30", title: "Beach afternoon, Barceloneta", note: "Rent two parasols, bring cards", cost: 12 },
          { time: "18:00", title: "Bunkers del Carmel sunset", note: "Best panorama in the city — carry drinks up", cost: 5 },
          { time: "21:30", title: "Dinner + bars in El Raval", note: "Paella at Can Solé earlier if the group prefers", cost: 35 },
        ],
      },
      {
        label: "Sunday",
        date: "20 Sep",
        items: [
          { time: "10:30", title: "Park Güell", note: "Timed entry 10:30, mosaic terrace photos", cost: 10 },
          { time: "13:00", title: "Long lunch in the Gothic Quarter", note: "Menu del día — last vermut of the trip", cost: 18 },
          { time: "18:40", title: "Flight BCN → BER", note: "Land 21:35, airport bus from Plaça Catalunya at 16:30", cost: 89 },
        ],
      },
    ],
  },
  {
    id: "copenhagen",
    name: "Copenhagen",
    country: "Denmark",
    tagline: "Harbor swims, world-class pastry, and design in every window.",
    vibes: ["Culture", "Food", "Wellness"],
    travelMode: "flight",
    travelTimeH: 1.1,
    travelSummary: "Direct flight BER → CPH, ~1 h 5 min",
    budget: { travel: 142, stay: 168, food: 135, activities: 50 },
    tempC: 18,
    weather: "Partly cloudy",
    highlights: ["Harbor bath at Islands Brygge", "Tivoli by night", "Cardamom buns at Juno"],
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    emoji: "🚲",
    stay: "Hotel rooms in Vesterbro · twin shares",
    itinerary: [
      {
        label: "Friday",
        date: "18 Sep",
        items: [
          { time: "17:00", title: "Flight BER → CPH", note: "Land 18:05, metro straight to Vesterbro", cost: 71 },
          { time: "19:30", title: "Check in, Vesterbro hotel", note: "Drop bags, rent city bikes for the weekend", cost: 0 },
          { time: "20:30", title: "Dinner at WarPigs", note: "Texas BBQ + Mikkeller taps in the Meatpacking District", cost: 30 },
        ],
      },
      {
        label: "Saturday",
        date: "19 Sep",
        items: [
          { time: "09:00", title: "Cardamom buns at Juno the Bakery", note: "Worth the queue — take them to the lakes", cost: 8 },
          { time: "10:30", title: "Bike loop: Nyhavn → Amalienborg", note: "Copenhagen is best by bike, ~90 min easy pace", cost: 0 },
          { time: "13:00", title: "Lunch at Reffen street food", note: "Harbourside market, something for everyone", cost: 20 },
          { time: "15:30", title: "Harbor swim at Islands Brygge", note: "18° water — the brave get bragging rights", cost: 0 },
          { time: "19:30", title: "Tivoli Gardens by night", note: "Rides optional, lights mandatory", cost: 25 },
        ],
      },
      {
        label: "Sunday",
        date: "20 Sep",
        items: [
          { time: "10:00", title: "Smørrebrød brunch", note: "Aamanns 1921 — order the herring for the table", cost: 26 },
          { time: "12:30", title: "Louisiana Museum half-day", note: "35 min train up the coast, sculpture garden on the sea", cost: 22 },
          { time: "19:25", title: "Flight CPH → BER", note: "Land 20:30 — home by 22:00", cost: 71 },
        ],
      },
    ],
  },
  {
    id: "amsterdam",
    name: "Amsterdam",
    country: "Netherlands",
    tagline: "Canal-side cafés, museum mornings, and bikes everywhere.",
    vibes: ["Culture", "Nightlife", "Food"],
    travelMode: "train",
    travelTimeH: 6.3,
    travelSummary: "Direct IC train from Berlin, ~6 h 20 min",
    budget: { travel: 80, stay: 150, food: 105, activities: 60 },
    tempC: 19,
    weather: "Light showers",
    highlights: ["Rijksmuseum", "Jordaan canal ring", "Foodhallen night out"],
    gradient: "from-teal-400 via-emerald-500 to-green-600",
    emoji: "🛶",
    stay: "Houseboat in the Jordaan · sleeps 5",
    itinerary: [
      {
        label: "Friday",
        date: "18 Sep",
        items: [
          { time: "12:34", title: "Train from Berlin Hbf", note: "IC 148 direct — long ride, bring the card deck", cost: 40 },
          { time: "19:00", title: "Check in: Jordaan houseboat", note: "Yes, an actual houseboat. Mind the gangway.", cost: 0 },
          { time: "20:30", title: "Dinner at Foodhallen", note: "Indoor food market — split up, share everything", cost: 25 },
        ],
      },
      {
        label: "Saturday",
        date: "19 Sep",
        items: [
          { time: "09:00", title: "Rijksmuseum", note: "9am slot: Night Watch before the crowds", cost: 23 },
          { time: "12:00", title: "Albert Cuyp market lunch", note: "Stroopwafels made fresh — non-negotiable", cost: 12 },
          { time: "14:30", title: "Canal boat rental, 2 h", note: "Self-drive electric boat, split six ways", cost: 25 },
          { time: "18:00", title: "Brown café hour in the Jordaan", note: "Café 't Smalle, canal-side seats", cost: 12 },
          { time: "21:00", title: "Night out: Paradiso or Melkweg", note: "Check listings — both walkable from dinner", cost: 20 },
        ],
      },
      {
        label: "Sunday",
        date: "20 Sep",
        items: [
          { time: "10:00", title: "Bike loop through Vondelpark", note: "Rentals next to the houseboat, easy 90 min", cost: 12 },
          { time: "12:30", title: "Pancakes at Moeders", note: "Farewell brunch — walls covered in mothers' photos", cost: 18 },
          { time: "15:00", title: "Train home to Berlin", note: "IC 149, arrives 21:22 — nap earned", cost: 40 },
        ],
      },
    ],
  },
  {
    id: "krakow",
    name: "Kraków",
    country: "Poland",
    tagline: "A storybook old town with the best-value food and nightlife in Europe.",
    vibes: ["Culture", "Food", "Nightlife"],
    travelMode: "train",
    travelTimeH: 7.0,
    travelSummary: "EC train via Wrocław, ~7 h",
    budget: { travel: 55, stay: 70, food: 60, activities: 35 },
    tempC: 20,
    weather: "Mostly sunny",
    highlights: ["Rynek Główny main square", "Kazimierz district", "Wawel Castle"],
    gradient: "from-red-400 via-rose-500 to-pink-600",
    emoji: "🥟",
    stay: "Apartment on the edge of Kazimierz",
    itinerary: [
      {
        label: "Friday",
        date: "18 Sep",
        items: [
          { time: "12:48", title: "Train from Berlin Hbf", note: "EC 249 via Wrocław — the long haul, worth it", cost: 28 },
          { time: "20:00", title: "Check in near Kazimierz", note: "5 min walk to the good bars", cost: 0 },
          { time: "21:00", title: "Zapiekanki at Plac Nowy", note: "Kraków's legendary late-night flatbreads", cost: 6 },
        ],
      },
      {
        label: "Saturday",
        date: "19 Sep",
        items: [
          { time: "09:30", title: "Breakfast at Charlotte", note: "French bakery on Plac Szczepański", cost: 8 },
          { time: "10:30", title: "Wawel Castle & Cathedral", note: "State rooms + dragon's den for the laughs", cost: 12 },
          { time: "13:30", title: "Pierogi lunch at Przypiecek", note: "24 h pierogi institution — try the sour cherry ones", cost: 8 },
          { time: "15:30", title: "Old Town & Cloth Hall wander", note: "Rynek Główny, St. Mary's trumpet call on the hour", cost: 5 },
          { time: "20:00", title: "Kazimierz bar crawl", note: "Alchemia → Singer → wherever the night goes", cost: 20 },
        ],
      },
      {
        label: "Sunday",
        date: "20 Sep",
        items: [
          { time: "10:30", title: "Vistula riverside walk", note: "Coffee to go, boulevards under Wawel", cost: 4 },
          { time: "12:00", title: "Obwarzanek + farewell lunch", note: "Milk-bar classics at Bar Mleczny Górnik", cost: 7 },
          { time: "14:56", title: "Train home to Berlin", note: "EC 248, arrives 21:58 — long but direct", cost: 28 },
        ],
      },
    ],
  },
  {
    id: "ruegen",
    name: "Rügen Island",
    country: "Germany",
    tagline: "Chalk cliffs, beech forests, and Baltic beach saunas — no passport needed.",
    vibes: ["Nature", "Beach", "Wellness"],
    travelMode: "car",
    travelTimeH: 3.5,
    travelSummary: "Shared car from Berlin, ~3 h 30 min",
    budget: { travel: 35, stay: 88, food: 70, activities: 30 },
    tempC: 17,
    weather: "Breezy, bright",
    highlights: ["Königsstuhl chalk cliffs", "Binz pier & promenade", "Beach sauna at Sellin"],
    gradient: "from-cyan-400 via-sky-500 to-blue-600",
    emoji: "⛰️",
    stay: "Beach house in Binz · 3 bedrooms",
    itinerary: [
      {
        label: "Friday",
        date: "18 Sep",
        items: [
          { time: "15:00", title: "Drive from Berlin", note: "Two cars, meet at the A11 — playlist duty rotates", cost: 18 },
          { time: "18:45", title: "Check in: Binz beach house", note: "Sea view from the balcony, grill in the garden", cost: 0 },
          { time: "20:00", title: "Fish sandwiches on Binz pier", note: "Sunset over the Baltic, bring jackets", cost: 12 },
        ],
      },
      {
        label: "Saturday",
        date: "19 Sep",
        items: [
          { time: "09:00", title: "Big house breakfast", note: "Supermarket run the night before — someone's on pancake duty", cost: 8 },
          { time: "10:30", title: "Hike the Königsstuhl chalk cliffs", note: "Jasmund National Park, ~3 h through beech forest", cost: 10 },
          { time: "14:30", title: "Picnic above Kieler Bach beach", note: "Pack lunch, descend the stairs if legs allow", cost: 8 },
          { time: "17:30", title: "Beach sauna in Sellin", note: "Sauna + Baltic plunge — the trip's core memory", cost: 20 },
          { time: "20:30", title: "Grill night at the house", note: "BYO everything, cards and cheap beer", cost: 15 },
        ],
      },
      {
        label: "Sunday",
        date: "20 Sep",
        items: [
          { time: "09:30", title: "Morning swim or beach run", note: "Optional, heroic", cost: 0 },
          { time: "11:00", title: "Steam train: Rasender Roland", note: "Historic narrow-gauge ride Binz → Göhren", cost: 14 },
          { time: "14:00", title: "Late lunch in Göhren, drive home", note: "Back in Berlin ~19:30", cost: 17 },
        ],
      },
    ],
  },
]
