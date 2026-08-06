import {
  Beer,
  Bike,
  Camera,
  Coffee,
  Compass,
  Flag,
  Grape,
  Landmark,
  Moon,
  Music,
  Sailboat,
  ShoppingBag,
  Sparkles,
  Sunrise,
  Sunset,
  Umbrella,
  Utensils,
  Waves,
  Wine,
} from "lucide-react"
import type { Destination, Member, VibeTag } from "./types"

export const VIBE_TAGS: VibeTag[] = [
  "Nature",
  "Nightlife",
  "Food & Drink",
  "Relaxing",
  "Culture",
  "Beaches",
  "Adventure",
]

export const TRIP = {
  name: "Fall Weekend Getaway",
  groupName: "The Lakeshore Crew",
  homeBase: "Chicago, IL",
  dateRange: "Friday, Oct 2 – Sunday, Oct 4, 2026",
  voteDeadline: new Date("2026-09-12T23:59:00"),
}

export const MEMBERS: Member[] = [
  { id: "you", name: "You", colorClass: "bg-amber-500", isYou: true },
  { id: "jordan", name: "Jordan", colorClass: "bg-sky-500" },
  { id: "priya", name: "Priya", colorClass: "bg-violet-500" },
  { id: "marcus", name: "Marcus", colorClass: "bg-emerald-500" },
  { id: "sam", name: "Sam", colorClass: "bg-rose-500" },
  { id: "elena", name: "Elena", colorClass: "bg-teal-500" },
]

export const SEED_VOTES: Record<string, string[]> = {
  "door-county": ["jordan", "elena"],
  "traverse-city": ["priya"],
  milwaukee: ["marcus", "sam"],
  "lake-geneva": [],
  indianapolis: [],
  saugatuck: [],
}

export const DESTINATIONS: Destination[] = [
  {
    id: "door-county",
    name: "Door County",
    region: "Wisconsin",
    tagline: "Lighthouses, orchards, and quiet coastline",
    description:
      "A slow, scenic peninsula lined with lighthouses, cherry orchards, and tiny harbor towns. The pace is unhurried and the water is everywhere you look.",
    vibeTags: ["Nature", "Relaxing", "Food & Drink"],
    icon: Sailboat,
    gradient: "from-sky-400 to-blue-600",
    distanceMiles: 232,
    driveTimeMinutes: 225,
    budget: {
      low: 210,
      high: 290,
      typical: 245,
      breakdown: { lodging: 120, food: 70, activities: 35, transport: 20 },
    },
    weather: [
      { day: "Sat", high: 75, low: 58, condition: "sunny" },
      { day: "Sun", high: 71, low: 56, condition: "partly-cloudy" },
    ],
    highlights: [
      "Sunset at Cave Point County Park",
      "Cherry-picking at a local orchard",
      "Traditional fish boil in Fish Creek",
      "Bike the Peninsula State Park loop",
    ],
    packingTip: "Evenings by the water drop into the 50s — pack a light jacket.",
    itinerary: [
      {
        day: "Friday",
        summary: "Arrive and settle in for a quiet first night.",
        activities: [
          {
            time: "6:30 PM",
            title: "Check in to the harbor cottage",
            description: "Drop bags and grab the porch chairs before the light fades.",
            icon: Compass,
          },
          {
            time: "8:00 PM",
            title: "Fish boil at the White Gull Inn",
            description: "A Door County tradition — whitefish, potatoes, and a dramatic boil-over finish.",
            icon: Utensils,
          },
        ],
      },
      {
        day: "Saturday",
        summary: "Orchards, coastline, and a lighthouse sunset.",
        activities: [
          {
            time: "9:00 AM",
            title: "Coffee and pastries in Sister Bay",
            description: "Easy morning stroll through the harbor shops before they get busy.",
            icon: Coffee,
          },
          {
            time: "11:00 AM",
            title: "Cherry-picking at Seaquist Orchards",
            description: "Fill a bucket and pick up a slice of cherry pie for the road.",
            icon: Sunrise,
          },
          {
            time: "2:00 PM",
            title: "Bike the Peninsula State Park loop",
            description: "A flat, shaded 8-mile ride with water views most of the way.",
            icon: Bike,
          },
          {
            time: "7:00 PM",
            title: "Sunset at Cave Point County Park",
            description: "Limestone cliffs and crashing waves — bring a camera.",
            icon: Camera,
          },
        ],
      },
      {
        day: "Sunday",
        summary: "One more coastal walk before the drive home.",
        activities: [
          {
            time: "9:30 AM",
            title: "Breakfast at the cottage",
            description: "Pack up leftovers from the local bakery run the day before.",
            icon: Coffee,
          },
          {
            time: "11:00 AM",
            title: "Browse Egg Harbor's galleries",
            description: "Small-town shops and studios, an easy last stop before the road.",
            icon: ShoppingBag,
          },
          {
            time: "1:00 PM",
            title: "Depart for Chicago",
            description: "Grab sandwiches to go — it's a straight shot south.",
            icon: Sunset,
          },
        ],
      },
    ],
  },
  {
    id: "traverse-city",
    name: "Traverse City",
    region: "Michigan",
    tagline: "Wine country meets the dunes",
    description:
      "Rolling vineyards on one side, towering sand dunes on the other, with a lively little downtown holding it all together.",
    vibeTags: ["Food & Drink", "Nature", "Relaxing"],
    icon: Grape,
    gradient: "from-fuchsia-400 to-purple-700",
    distanceMiles: 278,
    driveTimeMinutes: 290,
    budget: {
      low: 260,
      high: 340,
      typical: 295,
      breakdown: { lodging: 140, food: 85, activities: 45, transport: 25 },
    },
    weather: [
      { day: "Sat", high: 73, low: 55, condition: "sunny" },
      { day: "Sun", high: 76, low: 57, condition: "sunny" },
    ],
    highlights: [
      "Wine flight on the Old Mission Peninsula",
      "Climb the Dune Climb at Sleeping Bear Dunes",
      "Sunset over West Grand Traverse Bay",
      "Cherry pie at a local bakery",
    ],
    packingTip: "Bring sunscreen — the dune climb has zero shade and takes longer than it looks.",
    itinerary: [
      {
        day: "Friday",
        summary: "Long drive in, easy dinner downtown.",
        activities: [
          {
            time: "7:00 PM",
            title: "Check in downtown",
            description: "A short walk to the bay from most of the downtown hotels.",
            icon: Compass,
          },
          {
            time: "8:00 PM",
            title: "Dinner on Front Street",
            description: "Wood-fired pizza and local beer to recover from the drive.",
            icon: Utensils,
          },
        ],
      },
      {
        day: "Saturday",
        summary: "Wine in the morning, dunes in the afternoon.",
        activities: [
          {
            time: "10:00 AM",
            title: "Wine flight on Old Mission Peninsula",
            description: "Three vineyards, one shared ride, views of the bay from every patio.",
            icon: Wine,
          },
          {
            time: "1:00 PM",
            title: "Lunch at a vineyard cafe",
            description: "Cherry-stuffed everything — it's the local specialty.",
            icon: Utensils,
          },
          {
            time: "3:30 PM",
            title: "Sleeping Bear Dunes Climb",
            description: "A steep, sandy climb with a payoff view of Lake Michigan.",
            icon: Waves,
          },
          {
            time: "7:30 PM",
            title: "Sunset at West Grand Traverse Bay",
            description: "Walk the beach at Clinch Park as the sky turns pink.",
            icon: Sunset,
          },
        ],
      },
      {
        day: "Sunday",
        summary: "Farmers market and a slow drive home.",
        activities: [
          {
            time: "9:00 AM",
            title: "Traverse City Farmers Market",
            description: "Local cherries, cider, and fresh pastries for the road.",
            icon: ShoppingBag,
          },
          {
            time: "11:00 AM",
            title: "Coffee at a lakeside cafe",
            description: "One last view of the bay before heading out.",
            icon: Coffee,
          },
          {
            time: "12:30 PM",
            title: "Depart for Chicago",
            description: "Budget extra time — it's a longer drive back.",
            icon: Sunset,
          },
        ],
      },
    ],
  },
  {
    id: "milwaukee",
    name: "Milwaukee",
    region: "Wisconsin",
    tagline: "Breweries, lakefront, and a walkable downtown",
    description:
      "A quick trip up the lake for beer, live music, and a genuinely great food scene, all within walking distance of each other.",
    vibeTags: ["Nightlife", "Food & Drink", "Culture"],
    icon: Beer,
    gradient: "from-amber-400 to-orange-600",
    distanceMiles: 92,
    driveTimeMinutes: 95,
    budget: {
      low: 150,
      high: 210,
      typical: 175,
      breakdown: { lodging: 80, food: 55, activities: 25, transport: 15 },
    },
    weather: [
      { day: "Sat", high: 70, low: 54, condition: "partly-cloudy" },
      { day: "Sun", high: 74, low: 56, condition: "sunny" },
    ],
    highlights: [
      "Brewery tour and tasting flight",
      "Milwaukee Public Market food crawl",
      "Lakefront walk at Veterans Park",
      "Live music in the Historic Third Ward",
    ],
    packingTip: "Third Ward patios fill up fast — grab a Saturday dinner reservation early.",
    itinerary: [
      {
        day: "Friday",
        summary: "Short drive up, straight into the Third Ward.",
        activities: [
          {
            time: "6:00 PM",
            title: "Check in near the Third Ward",
            description: "An easy 90-minute drive means you're settled before dinner.",
            icon: Compass,
          },
          {
            time: "7:30 PM",
            title: "Dinner and live music",
            description: "A cocktail bar with a small stage tucked into the Ward's old warehouses.",
            icon: Music,
          },
        ],
      },
      {
        day: "Saturday",
        summary: "Breweries, the market, and the lakefront.",
        activities: [
          {
            time: "10:30 AM",
            title: "Brewery tour and tasting flight",
            description: "A behind-the-scenes look at the brewhouse, capped with a flight of six.",
            icon: Beer,
          },
          {
            time: "1:00 PM",
            title: "Milwaukee Public Market food crawl",
            description: "Cheese curds, oysters, and a flight of Wisconsin brandy old fashioneds.",
            icon: Utensils,
          },
          {
            time: "4:00 PM",
            title: "Lakefront walk at Veterans Park",
            description: "Kite Beach and the lakefront path, with skyline views the whole way.",
            icon: Waves,
          },
          {
            time: "9:00 PM",
            title: "Third Ward nightlife",
            description: "Rooftop bars and late-night bites within stumbling distance.",
            icon: Sparkles,
          },
        ],
      },
      {
        day: "Sunday",
        summary: "Museum morning, then home in time for dinner.",
        activities: [
          {
            time: "10:00 AM",
            title: "Milwaukee Art Museum",
            description: "The Calatrava wings open like clockwork at noon — worth timing for.",
            icon: Landmark,
          },
          {
            time: "12:30 PM",
            title: "Brunch downtown",
            description: "A last round of Wisconsin classics before the short drive home.",
            icon: Coffee,
          },
          {
            time: "2:00 PM",
            title: "Depart for Chicago",
            description: "Barely two hours — you'll be home by mid-afternoon.",
            icon: Sunset,
          },
        ],
      },
    ],
  },
  {
    id: "lake-geneva",
    name: "Lake Geneva",
    region: "Wisconsin",
    tagline: "Lakeside mansions and slow afternoons",
    description:
      "A polished lake town built around one very blue lake, best experienced from a boat, a bike, or a resort lounge chair.",
    vibeTags: ["Relaxing", "Nature", "Food & Drink"],
    icon: Waves,
    gradient: "from-cyan-400 to-teal-600",
    distanceMiles: 80,
    driveTimeMinutes: 90,
    budget: {
      low: 230,
      high: 310,
      typical: 265,
      breakdown: { lodging: 150, food: 60, activities: 35, transport: 20 },
    },
    weather: [
      { day: "Sat", high: 77, low: 59, condition: "sunny" },
      { day: "Sun", high: 73, low: 57, condition: "partly-cloudy" },
    ],
    highlights: [
      "Mailboat tour past the lakeshore mansions",
      "Spa afternoon at a lake resort",
      "Bike the Geneva Lake Shore Path",
      "Dinner on the water downtown",
    ],
    packingTip: "The Shore Path is 21 miles of mostly-shaded gravel — comfortable shoes beat sandals.",
    itinerary: [
      {
        day: "Friday",
        summary: "Quick drive up, dinner right on the water.",
        activities: [
          {
            time: "6:30 PM",
            title: "Check in to the lake resort",
            description: "Under two hours from the city — plenty of evening left.",
            icon: Compass,
          },
          {
            time: "8:00 PM",
            title: "Dinner on the water",
            description: "A downtown patio with the whole lake lit up in front of you.",
            icon: Utensils,
          },
        ],
      },
      {
        day: "Saturday",
        summary: "Boat tour, spa time, and a lakeside dinner.",
        activities: [
          {
            time: "9:30 AM",
            title: "Mailboat tour",
            description: "A narrated cruise past the historic lakeshore mansions, mail delivery included.",
            icon: Sailboat,
          },
          {
            time: "12:30 PM",
            title: "Lunch downtown",
            description: "Wood-fired flatbreads a block from the pier.",
            icon: Utensils,
          },
          {
            time: "2:30 PM",
            title: "Spa afternoon",
            description: "A few hours of pools, saunas, and lake views — zero plans required.",
            icon: Sparkles,
          },
          {
            time: "7:00 PM",
            title: "Dinner on the water",
            description: "A second night, a different patio — the lake never gets old.",
            icon: Moon,
          },
        ],
      },
      {
        day: "Sunday",
        summary: "One more walk along the shore before heading home.",
        activities: [
          {
            time: "9:00 AM",
            title: "Bike the Shore Path",
            description: "Pick a scenic stretch rather than the full 21 miles — it's plenty either way.",
            icon: Bike,
          },
          {
            time: "12:00 PM",
            title: "Brunch downtown",
            description: "A patio table and a last look at the lake.",
            icon: Coffee,
          },
          {
            time: "1:30 PM",
            title: "Depart for Chicago",
            description: "Under two hours — home well before dark.",
            icon: Sunset,
          },
        ],
      },
    ],
  },
  {
    id: "indianapolis",
    name: "Indianapolis",
    region: "Indiana",
    tagline: "Speedway thrills and a lively downtown",
    description:
      "A racing pilgrimage with a genuinely underrated food scene and a walkable downtown built around a canal.",
    vibeTags: ["Culture", "Food & Drink", "Adventure"],
    icon: Flag,
    gradient: "from-red-500 to-orange-600",
    distanceMiles: 185,
    driveTimeMinutes: 180,
    budget: {
      low: 170,
      high: 230,
      typical: 195,
      breakdown: { lodging: 90, food: 55, activities: 35, transport: 15 },
    },
    weather: [
      { day: "Sat", high: 79, low: 61, condition: "sunny" },
      { day: "Sun", high: 81, low: 63, condition: "sunny" },
    ],
    highlights: [
      "Track tour at the Indianapolis Motor Speedway Museum",
      "Food hall crawl downtown",
      "Canal Walk at sunset",
      "Local sports bar on Saturday night",
    ],
    packingTip: "Downtown garages fill up on event nights — plan to park before 5pm Saturday.",
    itinerary: [
      {
        day: "Friday",
        summary: "Drive in, settle downtown near the canal.",
        activities: [
          {
            time: "6:00 PM",
            title: "Check in downtown",
            description: "Most hotels are a five-minute walk from the Canal Walk.",
            icon: Compass,
          },
          {
            time: "7:30 PM",
            title: "Dinner at a food hall",
            description: "A dozen stalls under one roof — everyone picks something different.",
            icon: Utensils,
          },
        ],
      },
      {
        day: "Saturday",
        summary: "Speedway in the morning, canal at night.",
        activities: [
          {
            time: "10:00 AM",
            title: "Indianapolis Motor Speedway Museum",
            description: "A track tour and a look at a century of race cars up close.",
            icon: Flag,
          },
          {
            time: "1:00 PM",
            title: "Lunch downtown",
            description: "A classic pork tenderloin sandwich — it's the local thing to order.",
            icon: Utensils,
          },
          {
            time: "3:30 PM",
            title: "Explore Mass Ave",
            description: "Galleries, bookshops, and patio bars along the arts district.",
            icon: ShoppingBag,
          },
          {
            time: "8:00 PM",
            title: "Canal Walk at sunset",
            description: "Rent a paddle boat or just walk the lit-up path along the water.",
            icon: Sunset,
          },
        ],
      },
      {
        day: "Sunday",
        summary: "Easy museum morning, then the drive home.",
        activities: [
          {
            time: "10:00 AM",
            title: "Brunch on Mass Ave",
            description: "A relaxed last morning before the road.",
            icon: Coffee,
          },
          {
            time: "12:00 PM",
            title: "Indianapolis Museum of Art",
            description: "The gardens alone are worth the stop if the weather holds.",
            icon: Landmark,
          },
          {
            time: "2:00 PM",
            title: "Depart for Chicago",
            description: "A straight three-hour shot up I-65.",
            icon: Sunset,
          },
        ],
      },
    ],
  },
  {
    id: "saugatuck",
    name: "Saugatuck",
    region: "Michigan",
    tagline: "An artsy beach town across the lake",
    description:
      "Dune-backed beaches, gallery-lined streets, and a chain ferry that's been running since before anyone can remember.",
    vibeTags: ["Beaches", "Relaxing", "Culture"],
    icon: Umbrella,
    gradient: "from-teal-400 to-cyan-600",
    distanceMiles: 145,
    driveTimeMinutes: 160,
    budget: {
      low: 200,
      high: 270,
      typical: 225,
      breakdown: { lodging: 120, food: 55, activities: 30, transport: 20 },
    },
    weather: [
      { day: "Sat", high: 78, low: 60, condition: "sunny" },
      { day: "Sun", high: 74, low: 58, condition: "partly-cloudy" },
    ],
    highlights: [
      "Dune rides at Saugatuck Dunes State Park",
      "Chain Ferry across the Kalamazoo River",
      "Gallery hop downtown",
      "Sunset at Oval Beach",
    ],
    packingTip: "Oval Beach parking is limited — walk or bike in from downtown if you can.",
    itinerary: [
      {
        day: "Friday",
        summary: "Drive around the lake, arrive for a beach-town dinner.",
        activities: [
          {
            time: "6:30 PM",
            title: "Check in downtown",
            description: "A short walk from the galleries and the river.",
            icon: Compass,
          },
          {
            time: "8:00 PM",
            title: "Dinner by the river",
            description: "Fresh whitefish and a patio table looking out over the water.",
            icon: Utensils,
          },
        ],
      },
      {
        day: "Saturday",
        summary: "Dunes, the ferry, and a beach sunset.",
        activities: [
          {
            time: "9:30 AM",
            title: "Saugatuck Dunes State Park",
            description: "A wooded trail that opens onto quiet, towering dunes above the lake.",
            icon: Waves,
          },
          {
            time: "1:00 PM",
            title: "Lunch downtown",
            description: "A courtyard cafe a block from the main strip.",
            icon: Utensils,
          },
          {
            time: "3:00 PM",
            title: "Ride the Chain Ferry",
            description: "A hand-cranked ferry across the Kalamazoo River — still running after a century.",
            icon: Sailboat,
          },
          {
            time: "6:30 PM",
            title: "Sunset at Oval Beach",
            description: "Consistently ranked one of the best beaches on the lake, especially at golden hour.",
            icon: Sunset,
          },
        ],
      },
      {
        day: "Sunday",
        summary: "Gallery hop, then the drive home.",
        activities: [
          {
            time: "9:30 AM",
            title: "Coffee downtown",
            description: "A quiet start before the shops open.",
            icon: Coffee,
          },
          {
            time: "11:00 AM",
            title: "Gallery hop",
            description: "A dozen small galleries within a few blocks of each other.",
            icon: ShoppingBag,
          },
          {
            time: "1:00 PM",
            title: "Depart for Chicago",
            description: "Around the southern tip of the lake, back in under three hours.",
            icon: Sunset,
          },
        ],
      },
    ],
  },
]
