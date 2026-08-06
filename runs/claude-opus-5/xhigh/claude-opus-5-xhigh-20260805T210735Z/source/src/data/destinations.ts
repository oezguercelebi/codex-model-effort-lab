import type { Destination } from "../types"

/**
 * Sample data for the demo trip: eight realistic weekend options from New York
 * City, late September. Costs are per-person unless noted; lodging is a whole
 * property rate that splits across the group.
 */
export const destinations: Destination[] = [
  {
    id: "hudson-valley",
    name: "Hudson Valley",
    region: "New York",
    tagline: "Farm dinners, fire pits, and one very good ridge hike",
    summary:
      "Two hours up the Taconic and you're in barn-to-table country: cider mills, a Sunday flea, and a farmhouse with a hot tub you will absolutely use. The cheapest way to make the group feel like they actually went somewhere.",
    scene: "forest",
    palette: {
      skyTop: "#fde8c6",
      skyBottom: "#f7c08b",
      sun: "#ef8f4c",
      far: "#cf8f5d",
      mid: "#9c5a37",
      near: "#5f3524",
      water: "#b87a4d",
    },
    vibes: ["Nature", "Food & drink", "Slow & spa", "Culture"],
    travel: {
      primary: {
        mode: "drive",
        minutes: 130,
        label: "Van from Midtown",
        detail: "One rental van, split six ways. Leave by 4pm to beat the bridge.",
        costPerPerson: 46,
      },
      alternatives: [
        {
          mode: "train",
          minutes: 165,
          label: "Metro-North to Beacon",
          detail: "Hourly from Grand Central, then a 20-minute cab to the house.",
          costPerPerson: 38,
        },
      ],
    },
    costs: {
      lodgingPerNight: 560,
      lodgingLabel: "4-bedroom farmhouse with a hot tub",
      lodgingSleeps: 8,
      foodPerPersonPerDay: 62,
      activitiesPerPerson: 58,
    },
    weather: { highF: 68, lowF: 48, label: "Crisp, leaves just turning" },
    crowd: "Balanced",
    walkability: 32,
    highlights: [
      {
        title: "Storm King Art Center",
        detail: "Five hundred acres of outdoor sculpture. Budget three hours and real shoes.",
      },
      {
        title: "Beacon's Main Street",
        detail: "Roasters, a record shop, and Dia Beacon at the far end of it.",
      },
      {
        title: "Breakneck Ridge, short loop",
        detail: "Ninety minutes of scrambling for the best river view of the weekend.",
      },
      {
        title: "Sunday flea at the fairgrounds",
        detail: "Everyone comes home with something ridiculous. It's the point.",
      },
    ],
    headsUp: "Nothing is walkable from the house — whoever drives is committed to driving.",
    bestFor: "The lowest-friction plan. Cheap, close, and nobody burns a vacation day.",
  },
  {
    id: "montauk",
    name: "Montauk",
    region: "New York",
    tagline: "The last honest beach town on the island",
    summary:
      "Late September is Montauk's open secret: the water is still swimmable, the lines are gone, and a cottage two blocks from Ditch Plains costs half of what it did in August. Bring a wetsuit if you're serious about surfing.",
    scene: "coast",
    palette: {
      skyTop: "#ffeacd",
      skyBottom: "#ffb79c",
      sun: "#ff8f6b",
      far: "#9a6a86",
      mid: "#63456b",
      near: "#3a2843",
      water: "#e08a72",
    },
    vibes: ["Beach", "Nature", "Slow & spa", "Food & drink"],
    travel: {
      primary: {
        mode: "train",
        minutes: 200,
        label: "LIRR from Penn",
        detail: "Direct on Friday afternoons. Bikes ride free in the last car.",
        costPerPerson: 76,
      },
      alternatives: [
        {
          mode: "drive",
          minutes: 195,
          label: "Van out the LIE",
          detail: "Faster on paper, but the Friday traffic is a coin flip.",
          costPerPerson: 84,
        },
      ],
    },
    costs: {
      lodgingPerNight: 690,
      lodgingLabel: "3-bed cottage, two blocks from Ditch Plains",
      lodgingSleeps: 6,
      foodPerPersonPerDay: 78,
      activitiesPerPerson: 68,
    },
    weather: { highF: 66, lowF: 54, label: "Sunny, 62° water" },
    crowd: "Quiet",
    walkability: 45,
    highlights: [
      {
        title: "Dawn patrol at Ditch Plains",
        detail: "Rentals on the sand from 7am. Beginner-friendly on a small swell.",
      },
      {
        title: "Lighthouse bluff walk",
        detail: "Forty minutes along the cliffs to the oldest lighthouse in the state.",
      },
      {
        title: "Lobster roll at the docks",
        detail: "Paper plates, picnic tables, boats unloading behind you.",
      },
      {
        title: "Beach bonfire",
        detail: "Free permit from the town office, firewood from the hardware store.",
      },
    ],
    headsUp: "The last Sunday train back leaves early — check it before booking dinner.",
    bestFor: "Anyone who wants sand, salt, and absolutely no itinerary.",
  },
  {
    id: "boston",
    name: "Boston",
    region: "Massachusetts",
    tagline: "Three hours by train to a city you can cross on foot",
    summary:
      "No car, no transfers, no airport. Step off at Back Bay and you're already where you're staying. September Boston is all blue sky and cold beer, and dinner in the North End is worth the trip on its own.",
    scene: "city",
    palette: {
      skyTop: "#bfd8f2",
      skyBottom: "#f2d5c1",
      sun: "#f0a668",
      far: "#8296b6",
      mid: "#4e6183",
      near: "#2b3550",
      water: "#6a86ad",
    },
    vibes: ["Big city", "Culture", "Food & drink"],
    travel: {
      primary: {
        mode: "train",
        minutes: 250,
        label: "Acela from Penn Station",
        detail: "Book two weeks out or the fare doubles. Quiet car is worth it.",
        costPerPerson: 148,
      },
      alternatives: [
        {
          mode: "fly",
          minutes: 210,
          label: "Shuttle from LGA",
          detail: "Faster in the air, slower once you count both airports.",
          costPerPerson: 178,
        },
        {
          mode: "drive",
          minutes: 285,
          label: "Van up I-95",
          detail: "Cheapest per head, but parking in the city is $55 a night.",
          costPerPerson: 64,
        },
      ],
    },
    costs: {
      lodgingPerNight: 520,
      lodgingLabel: "3-bed Back Bay walk-up",
      lodgingSleeps: 6,
      foodPerPersonPerDay: 82,
      activitiesPerPerson: 52,
    },
    weather: { highF: 65, lowF: 50, label: "Blue-sky fall" },
    crowd: "Buzzing",
    walkability: 88,
    highlights: [
      {
        title: "North End dinner crawl",
        detail: "Pasta on Salem Street, cannoli on Hanover, nightcap on the water.",
      },
      {
        title: "Isabella Stewart Gardner Museum",
        detail: "A Venetian palace with a courtyard and a famous empty frame.",
      },
      {
        title: "Esplanade walk along the Charles",
        detail: "Two miles of sailboats and skyline, free and always open.",
      },
      {
        title: "Fenway, if the Sox are home",
        detail: "Standing room goes for about the price of a movie ticket.",
      },
    ],
    headsUp: "It's a college town in September — reserve dinner or you're eating at 10pm.",
    bestFor: "The group that wants to walk everywhere and never touch a car.",
  },
  {
    id: "montreal",
    name: "Montréal",
    region: "Québec, Canada",
    tagline: "France for the price of a domestic flight",
    summary:
      "Ninety minutes in the air buys a different language, a different dinner hour, and the best bagels in North America at 1am. The Plateau in early fall is as good as a city weekend gets.",
    scene: "city",
    palette: {
      skyTop: "#dcd3f2",
      skyBottom: "#f6d9d1",
      sun: "#e98a86",
      far: "#9c8fc0",
      mid: "#6a5b96",
      near: "#3d3363",
      water: "#7c6ea8",
    },
    vibes: ["Big city", "Nightlife", "Food & drink", "Culture"],
    travel: {
      primary: {
        mode: "fly",
        minutes: 265,
        label: "Nonstop from LGA",
        detail: "1h35 in the air; the rest is airports and the border.",
        costPerPerson: 258,
      },
      alternatives: [
        {
          mode: "train",
          minutes: 660,
          label: "Adirondack from Penn",
          detail: "Eleven hours along Lake Champlain. Beautiful, and a whole day gone.",
          costPerPerson: 92,
        },
      ],
    },
    costs: {
      lodgingPerNight: 470,
      lodgingLabel: "Plateau loft with a spiral staircase",
      lodgingSleeps: 6,
      foodPerPersonPerDay: 68,
      activitiesPerPerson: 58,
    },
    weather: { highF: 62, lowF: 46, label: "Cool — pack a real jacket" },
    crowd: "Buzzing",
    walkability: 82,
    highlights: [
      {
        title: "Mile End bagels, wood-fired, 24 hours",
        detail: "Sesame, hot, out of the paper bag, standing on the sidewalk.",
      },
      {
        title: "Marché Jean-Talon",
        detail: "Cider, cheese, and a dozen things you'll eat before you get home.",
      },
      {
        title: "Mont Royal lookout",
        detail: "Thirty minutes uphill for the whole city and the river behind it.",
      },
      {
        title: "Saint-Laurent after midnight",
        detail: "The reason this trip needs a late checkout on Sunday.",
      },
    ],
    headsUp: "Everyone needs a passport, and the border adds an hour in each direction.",
    bestFor: "The crew that considers 2am part of the plan.",
  },
  {
    id: "charleston",
    name: "Charleston",
    region: "South Carolina",
    tagline: "Warm water, long dinners, wide porches",
    summary:
      "The one option where it's still summer. Pastel side streets, a beach twenty minutes out, and a restaurant scene that punches far above a city this size. It's also the most expensive weekend on this list, almost entirely because of airfare.",
    scene: "harbor",
    palette: {
      skyTop: "#dff0f2",
      skyBottom: "#ffe6c4",
      sun: "#ffb257",
      far: "#a5c0b4",
      mid: "#6a8f86",
      near: "#38564f",
      water: "#7fb3ae",
    },
    vibes: ["Food & drink", "Culture", "Beach", "Slow & spa"],
    travel: {
      primary: {
        mode: "fly",
        minutes: 305,
        label: "Nonstop from EWR",
        detail: "2h05 gate to gate, plus a 25-minute ride into the historic district.",
        costPerPerson: 312,
      },
      alternatives: [
        {
          mode: "drive",
          minutes: 720,
          label: "Twelve hours down I-95",
          detail: "Only sane as an overnight. Listed for completeness.",
          costPerPerson: 96,
        },
      ],
    },
    costs: {
      lodgingPerNight: 640,
      lodgingLabel: "Historic carriage house south of Broad",
      lodgingSleeps: 6,
      foodPerPersonPerDay: 88,
      activitiesPerPerson: 62,
    },
    weather: { highF: 81, lowF: 66, label: "Still summer down there" },
    crowd: "Balanced",
    walkability: 74,
    highlights: [
      {
        title: "A proper King Street dinner",
        detail: "The kind of meal the group still references a year later.",
      },
      {
        title: "Sullivan's Island afternoon",
        detail: "Twenty minutes out, wide and empty once the season ends.",
      },
      {
        title: "Sunset sail on the harbor",
        detail: "Two hours, bring your own bottle, Fort Sumter on the way out.",
      },
      {
        title: "Saturday market on Marion Square",
        detail: "Breakfast, coffee, and the whole city's dogs in one place.",
      },
    ],
    headsUp: "The priciest option by a wide margin, and the gap is mostly airfare.",
    bestFor: "One last warm weekend before the coats come out.",
  },
  {
    id: "portland-me",
    name: "Portland",
    region: "Maine",
    tagline: "Oysters, breweries, and a lighthouse at golden hour",
    summary:
      "A working harbor town that happens to have one of the best food scenes in the country. Cobblestones, cold beer, an island ferry that takes fifteen minutes, and no flight required.",
    scene: "harbor",
    palette: {
      skyTop: "#d9edf6",
      skyBottom: "#f9e4ca",
      sun: "#f4a95e",
      far: "#96b5c6",
      mid: "#5a7f95",
      near: "#2f4a5c",
      water: "#6f9db3",
    },
    vibes: ["Food & drink", "Nature", "Slow & spa"],
    travel: {
      primary: {
        mode: "drive",
        minutes: 330,
        label: "Van up I-95",
        detail: "Five and a half hours with one stop. Leave Thursday night if you can.",
        costPerPerson: 88,
      },
      alternatives: [
        {
          mode: "fly",
          minutes: 240,
          label: "Regional jet from LGA",
          detail: "Saves 90 minutes each way and doubles the travel budget.",
          costPerPerson: 198,
        },
      ],
    },
    costs: {
      lodgingPerNight: 500,
      lodgingLabel: "Harborside townhouse on Munjoy Hill",
      lodgingSleeps: 6,
      foodPerPersonPerDay: 72,
      activitiesPerPerson: 54,
    },
    weather: { highF: 64, lowF: 47, label: "Cool and clear" },
    crowd: "Balanced",
    walkability: 76,
    highlights: [
      {
        title: "Old Port oysters",
        detail: "A dozen and a beer for less than a cocktail costs at home.",
      },
      {
        title: "Peaks Island bike loop",
        detail: "Fifteen-minute ferry, four flat miles, an ocean on both sides.",
      },
      {
        title: "Portland Head Light at sunset",
        detail: "The postcard, and it earns it. Go twenty minutes before the sun drops.",
      },
      {
        title: "Brewery row on Industrial Way",
        detail: "Four taprooms in one parking lot. Somebody has to stay sober to drive.",
      },
    ],
    headsUp: "It's a five-and-a-half-hour drive — leave Thursday or lose half of Friday.",
    bestFor: "Eating extremely well without booking a flight.",
  },
  {
    id: "washington-dc",
    name: "Washington, DC",
    region: "District of Columbia",
    tagline: "World-class museums that cost exactly nothing",
    summary:
      "The value pick. Trains every hour, a rowhouse in Shaw for less than anywhere else on this list, and a full weekend of museums, monuments and markets where the admission line is $0.",
    scene: "city",
    palette: {
      skyTop: "#e6ebf7",
      skyBottom: "#fadfd7",
      sun: "#ef9a86",
      far: "#aaa9be",
      mid: "#74738f",
      near: "#43425c",
      water: "#8d8ca8",
    },
    vibes: ["Big city", "Culture", "Food & drink"],
    travel: {
      primary: {
        mode: "train",
        minutes: 235,
        label: "Northeast Regional from Penn",
        detail: "Hourly, reserved seats, and it drops you three Metro stops from the house.",
        costPerPerson: 118,
      },
      alternatives: [
        {
          mode: "fly",
          minutes: 240,
          label: "Shuttle to DCA",
          detail: "No faster than the train once you count security.",
          costPerPerson: 168,
        },
      ],
    },
    costs: {
      lodgingPerNight: 400,
      lodgingLabel: "4-bed Shaw rowhouse with a back patio",
      lodgingSleeps: 7,
      foodPerPersonPerDay: 58,
      activitiesPerPerson: 22,
    },
    weather: { highF: 74, lowF: 58, label: "Warm, soft evenings" },
    crowd: "Balanced",
    walkability: 84,
    highlights: [
      {
        title: "Air and Space, reopened halls",
        detail: "Free, but you need a timed pass. Grab them the week before.",
      },
      {
        title: "Eastern Market on Sunday",
        detail: "Blueberry buckwheat pancakes, then the flea behind the hall.",
      },
      {
        title: "U Street half-smokes and jazz",
        detail: "A chili half-smoke at 1am is a civic tradition.",
      },
      {
        title: "Monuments by bike, after dark",
        detail: "Bikeshare, ninety minutes, and almost nobody else out there.",
      },
    ],
    headsUp: "Museums need free timed passes — someone has to claim them in advance.",
    bestFor: "Doing a great deal on a genuinely small budget.",
  },
  {
    id: "asheville",
    name: "Asheville",
    region: "North Carolina",
    tagline: "Blue Ridge mornings, brewery afternoons",
    summary:
      "A cabin with a porch, a national parkway out the front door, and more breweries per capita than anywhere in the country. Late September is the start of leaf season, which is exactly the right time to be here.",
    scene: "mountains",
    palette: {
      skyTop: "#ece5f4",
      skyBottom: "#fcdfc6",
      sun: "#f6a463",
      far: "#aba5c8",
      mid: "#7a7aa8",
      near: "#4a5580",
      water: "#6f7fa6",
    },
    vibes: ["Mountains", "Nature", "Food & drink", "Slow & spa"],
    travel: {
      primary: {
        mode: "fly",
        minutes: 290,
        label: "Nonstop from LGA",
        detail: "Two hours in the air, then a rental car you will definitely need.",
        costPerPerson: 284,
      },
      alternatives: [
        {
          mode: "drive",
          minutes: 660,
          label: "Eleven hours down I-81",
          detail: "Doable as a Thursday-night overnight, brutal as a Friday.",
          costPerPerson: 104,
        },
      ],
    },
    costs: {
      lodgingPerNight: 520,
      lodgingLabel: "Cabin with a wraparound porch, 20 minutes from town",
      lodgingSleeps: 6,
      foodPerPersonPerDay: 64,
      activitiesPerPerson: 72,
    },
    weather: { highF: 71, lowF: 50, label: "Leaf season, just starting" },
    crowd: "Balanced",
    walkability: 38,
    highlights: [
      {
        title: "Blue Ridge Parkway overlooks",
        detail: "Craggy Gardens is forty minutes up and worth every switchback.",
      },
      {
        title: "South Slope brewery walk",
        detail: "Eight taprooms in six blocks, all within stumbling distance.",
      },
      {
        title: "Sunrise above the clouds",
        detail: "Leave at 5:30am once. Everyone complains, then nobody stops talking about it.",
      },
      {
        title: "Porch, hot tub, no signal",
        detail: "The cabin has one bar of service. Consider that a feature.",
      },
    ],
    headsUp: "Add a rental car on top of the flight — the cabin base isn't walkable.",
    bestFor: "Big views and a porch to end every night on.",
  },
]

export const destinationById = new Map(destinations.map((d) => [d.id, d]))
