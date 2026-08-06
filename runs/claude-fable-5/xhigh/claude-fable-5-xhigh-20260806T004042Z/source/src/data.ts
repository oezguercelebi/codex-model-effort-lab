import type { LucideIcon } from "lucide-react"
import {
  Beer,
  Bed,
  Bike,
  Camera,
  Cloud,
  CloudDrizzle,
  CloudSun,
  Coffee,
  Croissant,
  Fish,
  Landmark,
  Mountain,
  Music,
  Palette,
  PartyPopper,
  Plane,
  Ship,
  Sun,
  Sunrise,
  TrainFront,
  Utensils,
  Waves,
  Wind,
} from "lucide-react"

export type CostKey = "travel" | "stay" | "food" | "fun"

export type ArtVariant = "coast" | "city" | "mountain" | "canal"

export interface ItineraryItem {
  time: string
  icon: LucideIcon
  title: string
  detail: string
}

export interface ItineraryDay {
  label: string
  date: string
  theme: string
  items: ItineraryItem[]
}

export interface Destination {
  id: string
  name: string
  country: string
  flag: string
  tagline: string
  art: { sky: [string, string]; land: string; variant: ArtVariant }
  travel: { icon: LucideIcon; duration: string; minutes: number; detail: string }
  weather: { icon: LucideIcon; tempC: number; summary: string }
  costs: Record<CostKey, number>
  tags: string[]
  highlights: string[]
  itinerary: ItineraryDay[]
}

export interface Person {
  id: string
  name: string
  color: string
  isYou?: boolean
  quip?: string
}

export interface Friend extends Person {
  votes: string[]
  quip: string
}

export const TRIP = {
  title: "October Escape",
  origin: "Berlin",
  dateLabel: "Oct 9–11, 2026",
  departure: new Date(2026, 9, 9),
  nights: 2,
  travelers: 6,
  votesPerPerson: 2,
  votingCloses: "Friday, Aug 14",
}

export const COST_CATEGORIES: { key: CostKey; label: string; color: string }[] = [
  { key: "travel", label: "Getting there", color: "#2a78d6" },
  { key: "stay", label: "Sleeping", color: "#eb6834" },
  { key: "food", label: "Food & drink", color: "#1baf7a" },
  { key: "fun", label: "Activities", color: "#eda100" },
]

export const totalCost = (d: Destination): number =>
  d.costs.travel + d.costs.stay + d.costs.food + d.costs.fun

export const eur = (n: number): string => `€${n.toLocaleString("en-US")}`

export const YOU: Person = {
  id: "you",
  name: "You",
  color: "bg-stone-900 text-white",
  isYou: true,
}

export const FRIENDS: Friend[] = [
  {
    id: "maya",
    name: "Maya",
    color: "bg-rose-200 text-rose-900",
    votes: ["lisbon", "barcelona"],
    quip: "October sun or I'm staying home.",
  },
  {
    id: "jonas",
    name: "Jonas",
    color: "bg-sky-200 text-sky-900",
    votes: ["prague", "lisbon"],
    quip: "Under €300 and I'm happy anywhere.",
  },
  {
    id: "priya",
    name: "Priya",
    color: "bg-violet-200 text-violet-900",
    votes: ["prague", "copenhagen"],
    quip: "Short flights, long breakfasts.",
  },
  {
    id: "leo",
    name: "Leo",
    color: "bg-emerald-200 text-emerald-900",
    votes: ["barcelona", "prague"],
    quip: "I just want tapas and a late night.",
  },
  {
    id: "sofia",
    name: "Sofia",
    color: "bg-amber-200 text-amber-900",
    votes: ["lisbon", "interlaken"],
    quip: "Give me one big view for the group photo.",
  },
]

export const DESTINATIONS: Destination[] = [
  {
    id: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    flag: "🇵🇹",
    tagline: "Golden light, pastel streets, and the Atlantic half an hour away.",
    art: { sky: ["#fcd34d", "#fb923c"], land: "#7c2d12", variant: "coast" },
    travel: {
      icon: Plane,
      duration: "3h 25m",
      minutes: 205,
      detail: "Direct flight from BER, several per day",
    },
    weather: { icon: Sun, tempC: 23, summary: "Sunny and warm in mid-October" },
    costs: { travel: 130, stay: 120, food: 85, fun: 45 },
    tags: ["Sunshine", "Food scene", "Ocean"],
    highlights: [
      "Sunset at Miradouro de Santa Catarina",
      "Tram 28 rattling through Alfama",
      "Pastéis de nata tasting crawl",
      "Atlantic beach hour at Carcavelos",
    ],
    itinerary: [
      {
        label: "Friday",
        date: "Oct 9",
        theme: "Arrive with the golden hour",
        items: [
          {
            time: "15:20",
            icon: Plane,
            title: "Fly BER → LIS",
            detail: "Direct in 3h 25m — you land right as the light turns golden.",
          },
          {
            time: "19:30",
            icon: Bed,
            title: "Check in above Alfama",
            detail: "Drop bags at the guesthouse and toast on the rooftop over the Tejo.",
          },
          {
            time: "21:00",
            icon: Utensils,
            title: "Petiscos in Bairro Alto",
            detail: "Shared plates and vinho verde, then a first wander down the lanes.",
          },
        ],
      },
      {
        label: "Saturday",
        date: "Oct 10",
        theme: "Trams, tiles, and fado",
        items: [
          {
            time: "09:30",
            icon: Croissant,
            title: "Pastéis de nata at Manteigaria",
            detail: "Warm custard tarts straight from the oven. Order two each, minimum.",
          },
          {
            time: "11:00",
            icon: Camera,
            title: "Tram 28 to the miradouros",
            detail: "Hop off at Portas do Sol for the classic tiled-roof panorama.",
          },
          {
            time: "14:00",
            icon: Fish,
            title: "Seafood at Time Out Market",
            detail: "Garlic prawns, percebes if you're brave, and a table for six.",
          },
          {
            time: "16:30",
            icon: Landmark,
            title: "Belém in the afternoon",
            detail: "The tower, the monastery cloisters, and the original nata bakery.",
          },
          {
            time: "22:00",
            icon: Music,
            title: "Fado night in Alfama",
            detail: "Candlelit fado house — book the late session and settle in.",
          },
        ],
      },
      {
        label: "Sunday",
        date: "Oct 11",
        theme: "Ocean air, then home",
        items: [
          {
            time: "10:00",
            icon: Waves,
            title: "Morning at Carcavelos beach",
            detail: "Twenty minutes by train to the Atlantic for a swim or a surf lesson.",
          },
          {
            time: "13:30",
            icon: Utensils,
            title: "Long lunch in Cais do Sodré",
            detail: "Grilled fish and one last glass before the airport run.",
          },
          {
            time: "17:45",
            icon: Plane,
            title: "Fly LIS → BER",
            detail: "Home by 22:00 with sand still in your shoes.",
          },
        ],
      },
    ],
  },
  {
    id: "prague",
    name: "Prague",
    country: "Czechia",
    flag: "🇨🇿",
    tagline: "Storybook lanes, castle views, and the best-value weekend on the list.",
    art: { sky: ["#ddd6fe", "#a78bfa"], land: "#4c1d95", variant: "city" },
    travel: {
      icon: TrainFront,
      duration: "4h 15m",
      minutes: 255,
      detail: "Direct EC train from Berlin Hbf along the Elbe",
    },
    weather: { icon: CloudSun, tempC: 14, summary: "Crisp and bright, cool evenings" },
    costs: { travel: 60, stay: 95, food: 65, fun: 35 },
    tags: ["Budget hero", "Old town", "Beer"],
    highlights: [
      "Charles Bridge at sunrise, before the crowds",
      "Castle hill and the Golden Lane",
      "Tank-fresh pilsner at Lokál",
      "Petřín funicular for the city panorama",
    ],
    itinerary: [
      {
        label: "Friday",
        date: "Oct 9",
        theme: "Roll in along the river",
        items: [
          {
            time: "13:52",
            icon: TrainFront,
            title: "EC train Berlin → Prague",
            detail: "Four hours along the Elbe valley — grab window seats on the right.",
          },
          {
            time: "18:30",
            icon: Bed,
            title: "Check in by Old Town Square",
            detail: "Apartment two lanes from the astronomical clock.",
          },
          {
            time: "20:00",
            icon: Beer,
            title: "First pour at Lokál",
            detail: "Tank pilsner and svíčková — the official start of the weekend.",
          },
        ],
      },
      {
        label: "Saturday",
        date: "Oct 10",
        theme: "The classics, done early",
        items: [
          {
            time: "08:30",
            icon: Sunrise,
            title: "Charles Bridge before the crowds",
            detail: "Mist on the Vltava and the statues to yourselves.",
          },
          {
            time: "10:30",
            icon: Landmark,
            title: "Castle hill & Golden Lane",
            detail: "St. Vitus, the tiny painted houses, and the walk down through Malá Strana.",
          },
          {
            time: "14:00",
            icon: Utensils,
            title: "Lunch in Malá Strana",
            detail: "Goulash and dumplings in a cellar that predates most countries.",
          },
          {
            time: "16:30",
            icon: Coffee,
            title: "Cafés and bookshops in Vinohrady",
            detail: "Slow coffee, secondhand paperbacks, zero tourists.",
          },
          {
            time: "20:30",
            icon: Music,
            title: "Jazz cellar on Železná",
            detail: "Tiny vaulted club — the 8:30 set, then one last pilsner.",
          },
        ],
      },
      {
        label: "Sunday",
        date: "Oct 11",
        theme: "One last panorama",
        items: [
          {
            time: "10:00",
            icon: Camera,
            title: "Petřín hill by funicular",
            detail: "Ride up, climb the mini Eiffel tower, walk down through the orchards.",
          },
          {
            time: "13:00",
            icon: Utensils,
            title: "Farewell lunch at Eska",
            detail: "Modern Czech in Karlín — the potatoes in ash are the move.",
          },
          {
            time: "16:26",
            icon: TrainFront,
            title: "EC train back to Berlin",
            detail: "Home by half past eight — cards and leftover kolache on board.",
          },
        ],
      },
    ],
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    flag: "🇪🇸",
    tagline: "Gaudí mornings, beach afternoons, and tapas that run past midnight.",
    art: { sky: ["#fecdd3", "#fb7185"], land: "#881337", variant: "coast" },
    travel: {
      icon: Plane,
      duration: "2h 55m",
      minutes: 175,
      detail: "Direct flight from BER, morning and evening",
    },
    weather: { icon: Sun, tempC: 22, summary: "Warm, sea still swimmable" },
    costs: { travel: 145, stay: 150, food: 95, fun: 60 },
    tags: ["Beach", "Architecture", "Nightlife"],
    highlights: [
      "Sagrada Família with the first-entry slot",
      "Tapas crawl along Carrer Blai",
      "Barceloneta beach and a vermouth",
      "Gaudí rooftops at La Pedrera",
    ],
    itinerary: [
      {
        label: "Friday",
        date: "Oct 9",
        theme: "Straight into the Gòtic",
        items: [
          {
            time: "16:10",
            icon: Plane,
            title: "Fly BER → BCN",
            detail: "2h 55m direct — Aerobús into town by dinner.",
          },
          {
            time: "19:45",
            icon: Bed,
            title: "Check in in the Gòtic",
            detail: "Balcony over a lane you couldn't drive a car down.",
          },
          {
            time: "21:30",
            icon: Utensils,
            title: "Pintxos on Carrer Blai",
            detail: "€2 a stick — keep the toothpicks, that's the bill.",
          },
        ],
      },
      {
        label: "Saturday",
        date: "Oct 10",
        theme: "Gaudí to the sea",
        items: [
          {
            time: "09:00",
            icon: Landmark,
            title: "Sagrada Família, first slot",
            detail: "Book the 9:00 entry — morning light through the stained glass.",
          },
          {
            time: "11:30",
            icon: Camera,
            title: "Park Güell & Gràcia",
            detail: "Mosaic terraces, then vermut in a Gràcia square.",
          },
          {
            time: "14:30",
            icon: Fish,
            title: "Paella by Barceloneta",
            detail: "Long seafood lunch a block from the sand.",
          },
          {
            time: "17:00",
            icon: Waves,
            title: "Beach hour",
            detail: "The sea holds 21° into October. Swim, then espresso on the boardwalk.",
          },
          {
            time: "22:00",
            icon: PartyPopper,
            title: "El Born after dark",
            detail: "Rooftop first, then whichever bar still has a table for six.",
          },
        ],
      },
      {
        label: "Sunday",
        date: "Oct 11",
        theme: "Slow morning, late flight",
        items: [
          {
            time: "10:00",
            icon: Coffee,
            title: "Brunch in Sant Antoni",
            detail: "Market hall pastries and the Sunday book stalls.",
          },
          {
            time: "12:00",
            icon: Palette,
            title: "Picasso Museum",
            detail: "Five medieval palaces, one very fast art history lesson.",
          },
          {
            time: "17:30",
            icon: Plane,
            title: "Fly BCN → BER",
            detail: "Back in Berlin by nine, sunburnt in October.",
          },
        ],
      },
    ],
  },
  {
    id: "amsterdam",
    name: "Amsterdam",
    country: "Netherlands",
    flag: "🇳🇱",
    tagline: "Canal loops, brown cafés, and world-class museums in walking distance.",
    art: { sky: ["#99f6e4", "#2dd4bf"], land: "#134e4a", variant: "canal" },
    travel: {
      icon: Plane,
      duration: "1h 20m",
      minutes: 80,
      detail: "Direct flight from BER, or 6h by direct IC train",
    },
    weather: { icon: CloudDrizzle, tempC: 15, summary: "Mild with passing showers" },
    costs: { travel: 120, stay: 175, food: 110, fun: 50 },
    tags: ["Museums", "Canals", "Bikes"],
    highlights: [
      "Golden-hour canal cruise through the grachten",
      "Van Gogh Museum, pre-booked",
      "Cycling the canal ring to Vondelpark",
      "Indonesian rijsttafel feast in De Pijp",
    ],
    itinerary: [
      {
        label: "Friday",
        date: "Oct 9",
        theme: "Short hop, long evening",
        items: [
          {
            time: "17:20",
            icon: Plane,
            title: "Fly BER → AMS",
            detail: "80 minutes in the air, 15 by train from Schiphol to Centraal.",
          },
          {
            time: "19:30",
            icon: Bed,
            title: "Check in in De Pijp",
            detail: "Narrow stairs, canal view, bikes reserved for the morning.",
          },
          {
            time: "21:00",
            icon: Beer,
            title: "Brown café night",
            detail: "Bitterballen and bar billiards at a café older than the tulip craze.",
          },
        ],
      },
      {
        label: "Saturday",
        date: "Oct 10",
        theme: "Museums by morning, water by dusk",
        items: [
          {
            time: "09:00",
            icon: Croissant,
            title: "Albert Cuyp market breakfast",
            detail: "Fresh stroopwafels, still warm, straight off the iron.",
          },
          {
            time: "10:30",
            icon: Palette,
            title: "Van Gogh Museum",
            detail: "Pre-book the 10:30 slot and take it slow through the sunflowers.",
          },
          {
            time: "13:30",
            icon: Bike,
            title: "Cycle the canal ring",
            detail: "Nine Streets, Jordaan, and a Vondelpark loop — flat the whole way.",
          },
          {
            time: "16:00",
            icon: Ship,
            title: "Golden-hour canal cruise",
            detail: "75 minutes through the grachten. Bring snacks aboard.",
          },
          {
            time: "20:30",
            icon: Utensils,
            title: "Rijsttafel in De Pijp",
            detail: "Two dozen little Indonesian dishes — order the works and share.",
          },
        ],
      },
      {
        label: "Sunday",
        date: "Oct 11",
        theme: "One museum more",
        items: [
          {
            time: "10:00",
            icon: Coffee,
            title: "Coffee in the Nine Streets",
            detail: "Window seats, canal view, one last apple pie at Winkel 43.",
          },
          {
            time: "12:00",
            icon: Landmark,
            title: "Rijksmuseum highlights run",
            detail: "Two hours, Rembrandt to Vermeer, then a Museumplein lie-down.",
          },
          {
            time: "17:50",
            icon: Plane,
            title: "Fly AMS → BER",
            detail: "Home in time to unpack and brag.",
          },
        ],
      },
    ],
  },
  {
    id: "copenhagen",
    name: "Copenhagen",
    country: "Denmark",
    flag: "🇩🇰",
    tagline: "Harbor swims, cardamom buns, and design in every direction.",
    art: { sky: ["#c7d2fe", "#818cf8"], land: "#312e81", variant: "city" },
    travel: {
      icon: Plane,
      duration: "1h 05m",
      minutes: 65,
      detail: "Direct flight from BER — the shortest hop on the list",
    },
    weather: { icon: Wind, tempC: 12, summary: "Fresh and breezy, pack a layer" },
    costs: { travel: 110, stay: 195, food: 140, fun: 55 },
    tags: ["Design", "Cozy", "Harbor swims"],
    highlights: [
      "Harbor swim and sauna at Islands Brygge",
      "Tivoli Gardens glowing after dark",
      "Cardamom buns at Juno the Bakery",
      "Louisiana Museum on the coast",
    ],
    itinerary: [
      {
        label: "Friday",
        date: "Oct 9",
        theme: "An hour north, a world calmer",
        items: [
          {
            time: "17:35",
            icon: Plane,
            title: "Fly BER → CPH",
            detail: "65 minutes — the metro runs straight from the terminal to town.",
          },
          {
            time: "19:00",
            icon: Bed,
            title: "Check in in Vesterbro",
            detail: "Converted warehouse rooms behind the Meatpacking District.",
          },
          {
            time: "20:30",
            icon: Utensils,
            title: "Smørrebrød and natural wine",
            detail: "Open sandwiches done seriously, in a room full of candles.",
          },
        ],
      },
      {
        label: "Saturday",
        date: "Oct 10",
        theme: "Bikes, water, and Tivoli lights",
        items: [
          {
            time: "09:30",
            icon: Croissant,
            title: "Cardamom buns at Juno",
            detail: "Worth the queue — take them to the lakes and watch the swans.",
          },
          {
            time: "11:00",
            icon: Bike,
            title: "Harbor loop by bike",
            detail: "Over the Bicycle Snake, past Nyhavn's painted townhouses.",
          },
          {
            time: "12:30",
            icon: Waves,
            title: "Harbor swim at Islands Brygge",
            detail: "Bracing but unforgettable — the sauna afterwards is the reward.",
          },
          {
            time: "15:00",
            icon: Landmark,
            title: "Designmuseum Danmark",
            detail: "A century of chairs you'll suddenly want in your flat.",
          },
          {
            time: "19:30",
            icon: PartyPopper,
            title: "Tivoli after dark",
            detail: "The gardens glow in October — ride the Demon at night.",
          },
        ],
      },
      {
        label: "Sunday",
        date: "Oct 11",
        theme: "Art with a sea view",
        items: [
          {
            time: "10:00",
            icon: TrainFront,
            title: "Coast train to Louisiana",
            detail: "35 minutes north — the museum garden runs down to the Øresund.",
          },
          {
            time: "13:30",
            icon: Utensils,
            title: "Lunch over the water",
            detail: "The museum café looks straight across to Sweden.",
          },
          {
            time: "18:20",
            icon: Plane,
            title: "Fly CPH → BER",
            detail: "Sixty-five minutes home, pockets full of licorice.",
          },
        ],
      },
    ],
  },
  {
    id: "interlaken",
    name: "Interlaken",
    country: "Switzerland",
    flag: "🇨🇭",
    tagline: "Alpine air, turquoise lakes, and postcard hikes between two shores.",
    art: { sky: ["#bae6fd", "#38bdf8"], land: "#0c4a6e", variant: "mountain" },
    travel: {
      icon: Plane,
      duration: "4h 30m",
      minutes: 270,
      detail: "Fly to Zürich, then a scenic 2h train past the lakes",
    },
    weather: { icon: Cloud, tempC: 11, summary: "Cool and clear at altitude" },
    costs: { travel: 190, stay: 185, food: 130, fun: 90 },
    tags: ["Hiking", "Big views", "Adventure"],
    highlights: [
      "Ridge hike to Bachalpsee's mirror lake",
      "A very quick dip in Lake Brienz",
      "Fondue night in old Unterseen",
      "Boat across Lake Thun to castle country",
    ],
    itinerary: [
      {
        label: "Friday",
        date: "Oct 9",
        theme: "Planes, trains, fondue",
        items: [
          {
            time: "14:00",
            icon: Plane,
            title: "Fly BER → ZRH",
            detail: "85 minutes over the Alps — sit on the left for the preview.",
          },
          {
            time: "16:30",
            icon: TrainFront,
            title: "Train Zürich → Interlaken",
            detail: "Two hours with lakes out both windows for the final stretch.",
          },
          {
            time: "19:30",
            icon: Utensils,
            title: "Fondue in Unterseen",
            detail: "Cheese, kirsch, and negotiating Saturday's hike over the pot.",
          },
        ],
      },
      {
        label: "Saturday",
        date: "Oct 10",
        theme: "The big mountain day",
        items: [
          {
            time: "08:30",
            icon: Mountain,
            title: "Gondola up to First",
            detail: "From Grindelwald village straight into the high country.",
          },
          {
            time: "10:00",
            icon: Camera,
            title: "Hike to Bachalpsee",
            detail: "Two easy hours; the Schreckhorn reflects in the lake at the top.",
          },
          {
            time: "14:00",
            icon: Utensils,
            title: "Rösti on the terrace",
            detail: "Mountain hut lunch with the Eiger filling the whole window.",
          },
          {
            time: "16:30",
            icon: Waves,
            title: "Dip in Lake Brienz",
            detail: "Turquoise, glacial, extremely quick. Photos or it didn't happen.",
          },
          {
            time: "20:00",
            icon: Beer,
            title: "Cellar bar in Unterseen",
            detail: "Local lagers under 400-year-old beams, legs happily ruined.",
          },
        ],
      },
      {
        label: "Sunday",
        date: "Oct 11",
        theme: "Across the water, then home",
        items: [
          {
            time: "09:30",
            icon: Ship,
            title: "Boat across Lake Thun",
            detail: "Glide past castles to Thun's wooden bridges.",
          },
          {
            time: "12:30",
            icon: Utensils,
            title: "Lunch in Thun old town",
            detail: "One last terrace, one last view of the Bernese peaks.",
          },
          {
            time: "15:10",
            icon: Plane,
            title: "Train to ZRH, fly home",
            detail: "Landing in Berlin by nine with 30,000 steps on the counter.",
          },
        ],
      },
    ],
  },
]

export const MAX_TOTAL = Math.max(...DESTINATIONS.map(totalCost))
export const CHEAPEST_ID = DESTINATIONS.reduce((a, b) => (totalCost(a) <= totalCost(b) ? a : b)).id
export const FASTEST_ID = DESTINATIONS.reduce((a, b) => (a.travel.minutes <= b.travel.minutes ? a : b)).id

export const PACKING_ITEMS: { id: string; label: string }[] = [
  { id: "passport", label: "Passport or ID" },
  { id: "bag", label: "Weekend bag (cabin size)" },
  { id: "chargers", label: "Chargers & power bank" },
  { id: "shoes", label: "Comfortable walking shoes" },
  { id: "rain", label: "Packable rain shell" },
  { id: "swim", label: "Swim kit & quick-dry towel" },
  { id: "book", label: "Book or downloads for the ride" },
  { id: "sunglasses", label: "Sunglasses" },
]

export function getDestination(id: string): Destination {
  const found = DESTINATIONS.find((d) => d.id === id)
  return found ?? DESTINATIONS[0]
}
