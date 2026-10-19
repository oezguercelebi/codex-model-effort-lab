export type Vibe =
  | "Walkable"
  | "Outdoors"
  | "Food"
  | "Quiet"
  | "Design"
  | "Water"

export type BudgetLine = {
  id: "stay" | "food" | "transit" | "activities"
  label: string
  amount: number
  note: string
}

export type Block = {
  time: string
  title: string
  detail: string
}

export type DayPlan = {
  day: string
  date: string
  title: string
  blocks: Block[]
}

export type Destination = {
  id: string
  name: string
  place: string
  tagline: string
  scene: string
  vibes: Vibe[]
  travelMinutes: number
  travelMode: string
  travelNote: string
  lodging: string
  weather: string
  crowd: string
  highlights: string[]
  watchout: string
  budget: BudgetLine[]
  itinerary: DayPlan[]
  packing: string[]
}

export type Friend = {
  id: string
  name: string
  role: string
  vote: string | null
  you?: boolean
}

export const TRIP = {
  name: "October river weekend",
  origin: "Brooklyn",
  dates: "Fri Oct 9 – Sun Oct 11",
  nights: 2,
  blurb:
    "Six friends, one long weekend, no group chat spiral. Compare the shortlist, vote once, and leave with a plan.",
}

export const VIBES: Vibe[] = [
  "Walkable",
  "Outdoors",
  "Food",
  "Quiet",
  "Design",
  "Water",
]

export const FRIENDS: Friend[] = [
  { id: "maya", name: "Maya", role: "You · keeping the plan honest", vote: null, you: true },
  { id: "jules", name: "Jules", role: "Wants a trail before dinner", vote: "catskills" },
  { id: "theo", name: "Theo", role: "Train only, if possible", vote: "beacon" },
  { id: "priya", name: "Priya", role: "Will organize the dinner reso", vote: "philly" },
  { id: "sam", name: "Sam", role: "Budget hawk", vote: "beacon" },
  { id: "noah", name: "Noah", role: "Packing the good speaker", vote: "north-fork" },
]

export const DESTINATIONS: Destination[] = [
  {
    id: "beacon",
    name: "Beacon & Cold Spring",
    place: "Hudson Highlands, NY",
    tagline: "River towns, a serious hike, and galleries you can walk between.",
    scene: "beacon",
    vibes: ["Walkable", "Outdoors", "Design", "Food"],
    travelMinutes: 85,
    travelMode: "Metro-North from Grand Central",
    travelNote: "Off-peak round trip is about $38. Trains run late enough for a Sunday dinner back in the city.",
    lodging: "Split a two-bedroom on Beacon’s east end",
    weather: "Low 60s, clear Saturday, light jacket weather",
    crowd: "Busy on Main Street at lunch, quiet on the trail after 3",
    highlights: [
      "Mount Beacon fire tower if the group is up for 90 minutes uphill",
      "Dia Beacon, timed entry, then coffee on Main",
      "Cold Spring riverfront and a short walk to Little Stony Point",
    ],
    watchout: "Dia sells out of afternoon slots on holiday weekends. Book Friday.",
    budget: [
      { id: "transit", label: "Train", amount: 38, note: "Metro-North round trip, off-peak" },
      { id: "stay", label: "Stay", amount: 142, note: "Two nights, shared two-bedroom" },
      { id: "food", label: "Food", amount: 96, note: "One sit-down dinner, otherwise casual" },
      { id: "activities", label: "Activities", amount: 22, note: "Dia ticket, trail is free" },
    ],
    itinerary: [
      {
        day: "Friday",
        date: "Oct 9",
        title: "Arrive with the light",
        blocks: [
          { time: "5:40 pm", title: "Metro-North to Beacon", detail: "Meet under the departure board at Grand Central. The 5:40 gets you in before kitchens close." },
          { time: "7:20 pm", title: "Drop bags, walk Main", detail: "Check into the east-end rental. Ten minutes on foot to the restaurant." },
          { time: "8:00 pm", title: "Dinner at The Roundhouse", detail: "Patio if the weather holds. Split two starters so Saturday’s hike is not a regret." },
        ],
      },
      {
        day: "Saturday",
        date: "Oct 10",
        title: "Tower, then town",
        blocks: [
          { time: "8:30 am", title: "Coffee and pocket breakfast", detail: "Homespun or Glazed. Eat before the climb, not after the first switchback." },
          { time: "9:30 am", title: "Mount Beacon", detail: "Out and back to the fire tower. Turn around at the ridge if anyone’s knees complain." },
          { time: "1:00 pm", title: "Dia Beacon", detail: "Two hours is enough. The basement galleries are the quiet ones." },
          { time: "4:30 pm", title: "Cold Spring", detail: "One-stop Metro-North hop. Ice cream, river wall, train back before dusk." },
          { time: "7:30 pm", title: "Casual dinner in Beacon", detail: "Pizza or the ramen counter. No second tasting menu." },
        ],
      },
      {
        day: "Sunday",
        date: "Oct 11",
        title: "Slow morning, easy train",
        blocks: [
          { time: "9:00 am", title: "Farmers’ market loop", detail: "If it’s open, buy fruit for the train. If not, a long coffee and a bookstore." },
          { time: "11:30 am", title: "Little Stony Point", detail: "Flat, twenty minutes, river on both sides of the path. Goodbye view." },
          { time: "1:40 pm", title: "Train to Grand Central", detail: "Back in Brooklyn by late afternoon. No Sunday scramble." },
        ],
      },
    ],
    packing: ["Metro-North tickets in the app", "Dia timed tickets", "Trail shoes", "Light layer", "Shared grocery run for breakfast"],
  },
  {
    id: "catskills",
    name: "The Catskills",
    place: "Near Phoenicia, NY",
    tagline: "A cabin, a swim hole, and one good dinner you don’t have to dress for.",
    scene: "catskills",
    vibes: ["Outdoors", "Quiet", "Water"],
    travelMinutes: 150,
    travelMode: "Carpool up the Thruway",
    travelNote: "Two cars from Brooklyn. Gas and tolls land near $48 a person if you fill up in Kingston.",
    lodging: "Three-bedroom cabin with a wood stove",
    weather: "Crisp mornings, mid-60s by noon, clear nights",
    crowd: "Trailhead fills by 10am. Cabin road stays quiet.",
    highlights: [
      "A swim at a documented swimming hole, not a random pull-off",
      "Firepit night with a grocery-store steak plan",
      "Morning walk into Phoenicia for pastries",
    ],
    watchout: "Cell service drops on the cabin road. Download the map Friday morning.",
    budget: [
      { id: "transit", label: "Carpool", amount: 48, note: "Gas, tolls, and a contribution to the drivers" },
      { id: "stay", label: "Cabin", amount: 168, note: "Two nights split six ways" },
      { id: "food", label: "Food", amount: 84, note: "Two cooked dinners, one lunch out" },
      { id: "activities", label: "Activities", amount: 18, note: "Trail parking and cider stop" },
    ],
    itinerary: [
      {
        day: "Friday",
        date: "Oct 9",
        title: "Leave before the tunnel backs up",
        blocks: [
          { time: "3:30 pm", title: "Cars leave Park Slope", detail: "Two cars, bags in the trunk, snack split already handled." },
          { time: "6:15 pm", title: "Kingston grocery", detail: "Steak, eggs, oats, a salad that will survive the drive, and more firewood than you think." },
          { time: "7:30 pm", title: "Cabin check-in", detail: "Claim beds before anyone gets sentimental about the loft." },
          { time: "8:30 pm", title: "First fire", detail: "Simple pasta. Save the ambitious dinner for Saturday." },
        ],
      },
      {
        day: "Saturday",
        date: "Oct 10",
        title: "Water, then a long table",
        blocks: [
          { time: "8:00 am", title: "Phoenicia bakery", detail: "Walk or short drive. Coffee before anyone suggests a summit." },
          { time: "10:00 am", title: "Swim hole", detail: "Peekamoose or a milder Esopus access depending on the group’s nerve. Towels in the car." },
          { time: "2:00 pm", title: "Porch afternoon", detail: "Books, a nap, a walk to the ridge behind the cabin. No itinerary guilt." },
          { time: "7:00 pm", title: "Steak night", detail: "Cast iron, a salad, and the cider. Dishes roster is on the fridge." },
        ],
      },
      {
        day: "Sunday",
        date: "Oct 11",
        title: "One short trail, then home",
        blocks: [
          { time: "9:00 am", title: "Cabin reset", detail: "Strip beds, run the dishwasher, photograph the fireplace so you remember why you came." },
          { time: "10:30 am", title: "Rail trail hour", detail: "Flat gravel, no heroics. Turn around at the second bridge." },
          { time: "12:30 pm", title: "Drive south", detail: "Sandwich in Kingston. Brooklyn before dinner plans at home begin." },
        ],
      },
    ],
    packing: ["Offline map", "Swim suit and towel", "Headlamp", "Groceries list", "Driver snacks", "Fire starters"],
  },
  {
    id: "philly",
    name: "Philadelphia",
    place: "Center City & Fishtown",
    tagline: "A food city you can do properly in forty-eight hours.",
    scene: "philly",
    vibes: ["Walkable", "Food", "Design"],
    travelMinutes: 80,
    travelMode: "Amtrak from Moynihan",
    travelNote: "Northeast Regional, about $68–$92 depending on how early you book. 30th Street is a 15-minute rideshare to the rental.",
    lodging: "Fishtown rowhouse, two stops from Center City",
    weather: "Upper 60s, a chance of a brief Saturday shower",
    crowd: "Reading Terminal is packed at noon. Evenings in Fishtown are lively, not chaotic.",
    highlights: [
      "Reading Terminal for lunch, not a novelty cheesesteak crawl",
      "Barnes Foundation in the morning, before the rooms crowd",
      "One reservation dinner, everything else walk-in",
    ],
    watchout: "Amtrak prices jump inside two weeks. This sample assumes you book this week.",
    budget: [
      { id: "transit", label: "Amtrak", amount: 86, note: "Round trip, reserved coach" },
      { id: "stay", label: "Stay", amount: 154, note: "Two nights in a shared rowhouse" },
      { id: "food", label: "Food", amount: 128, note: "The splurge is one dinner" },
      { id: "activities", label: "Activities", amount: 28, note: "Barnes entry, SEPTA day use" },
    ],
    itinerary: [
      {
        day: "Friday",
        date: "Oct 9",
        title: "City, immediately",
        blocks: [
          { time: "4:10 pm", title: "Northeast Regional", detail: "Moynihan. Snacks from the food hall, not the cafe car." },
          { time: "6:00 pm", title: "Fishtown keys", detail: "Drop bags. The house is a short walk from Frankford Avenue." },
          { time: "7:45 pm", title: "Reservation dinner", detail: "Suraya or Laser Wolf, booked under Priya’s name. Family-style so the table stays one conversation." },
        ],
      },
      {
        day: "Saturday",
        date: "Oct 10",
        title: "Art, market, long walk",
        blocks: [
          { time: "9:30 am", title: "Barnes Foundation", detail: "Go early. The ensembles reward a slow first room and a faster second pass." },
          { time: "12:30 pm", title: "Reading Terminal", detail: "Split up, reconvene with roast pork, a pretzel, and something green." },
          { time: "3:00 pm", title: "Schuylkill walk", detail: "Rittenhouse to the river and back. Optional museum if the rain arrives." },
          { time: "8:00 pm", title: "Neighborhood night", detail: "Natural wine bar, no agenda. Last train home is tomorrow, so nobody is watching the clock." },
        ],
      },
      {
        day: "Sunday",
        date: "Oct 11",
        title: "Coffee, then 30th Street",
        blocks: [
          { time: "9:00 am", title: "Bakery breakfast", detail: "Machine Shop or a Fishtown equivalent. Sit down. The weekend is almost over." },
          { time: "11:00 am", title: "Italian Market stroll", detail: "Short rideshare. Buy olives you will forget in the fridge and not mind." },
          { time: "2:05 pm", title: "Amtrak north", detail: "Back at Moynihan mid-afternoon. Subway home." },
        ],
      },
    ],
    packing: ["Amtrak QR codes", "Barnes tickets", "Dinner reservation", "Light rain jacket", "Walking shoes"],
  },
  {
    id: "north-fork",
    name: "The North Fork",
    place: "Greenport, NY",
    tagline: "Farms, a harbor town, and a beach that doesn’t require a scene.",
    scene: "fork",
    vibes: ["Quiet", "Food", "Water", "Outdoors"],
    travelMinutes: 175,
    travelMode: "LIRR to Greenport",
    travelNote: "About two and a half hours with a Jamaica or Hunterspoint transfer. Weekend tickets are pricier than a weekday off-peak.",
    lodging: "Inn rooms a short walk from the ferry dock",
    weather: "Sunny, low 60s, wind off the Sound in the afternoon",
    crowd: "Greenport Saturdays are social. Vineyard visits before 11 stay calm.",
    highlights: [
      "One vineyard, not four",
      "Orient Beach if the wind is kind",
      "Seafood in town and a sunset from the dock",
    ],
    watchout: "The last reliable train back on Sunday is not late. Don’t miss it for a second winery.",
    budget: [
      { id: "transit", label: "LIRR", amount: 64, note: "Round trip to Greenport" },
      { id: "stay", label: "Inn", amount: 176, note: "Two nights, shared rooms" },
      { id: "food", label: "Food & wine", amount: 132, note: "Includes one tasting flight" },
      { id: "activities", label: "Activities", amount: 16, note: "Beach parking or bike share" },
    ],
    itinerary: [
      {
        day: "Friday",
        date: "Oct 9",
        title: "Eastbound, no car",
        blocks: [
          { time: "3:55 pm", title: "LIRR from Hunterspoint", detail: "Easier with bags than a midtown transfer. Sit together on the right for the marshes." },
          { time: "6:40 pm", title: "Greenport on foot", detail: "Inn is near the dock. Check in, then walk the length of Front Street once." },
          { time: "8:00 pm", title: "Early seafood", detail: "No reservation theater. Oysters, a grilled fish, bed at a reasonable hour." },
        ],
      },
      {
        day: "Saturday",
        date: "Oct 10",
        title: "One farm, one beach",
        blocks: [
          { time: "9:00 am", title: "Coffee and bikes", detail: "Rent four bikes if the group wants them, or walk. Don’t over-schedule the wheels." },
          { time: "10:30 am", title: "A single vineyard", detail: "A flight, a cheese plate, and a rule: no second tasting before lunch." },
          { time: "1:30 pm", title: "Orient or the harbor beach", detail: "Wind check first. If it’s harsh, swap for a bookshop and the maritime museum." },
          { time: "6:30 pm", title: "Sunset dock, then dinner", detail: "The good photo is the unplanned one. Dinner back on Front Street." },
        ],
      },
      {
        day: "Sunday",
        date: "Oct 11",
        title: "Market, then the train",
        blocks: [
          { time: "9:00 am", title: "Farm stand", detail: "Apples and a jar of something. Leave room in the backpack." },
          { time: "11:00 am", title: "Last harbor loop", detail: "Return bikes. Ice cream is allowed. It is October and that is fine." },
          { time: "1:15 pm", title: "Train west", detail: "The Sunday return is the constraint. Be on the platform early." },
        ],
      },
    ],
    packing: ["LIRR tickets", "Wind layer", "Inn confirmation", "Day bag for the beach", "Cash for the farm stand"],
  },
  {
    id: "hudson",
    name: "Hudson",
    place: "Columbia County, NY",
    tagline: "Antique stores, a serious main street, and dinner worth the train.",
    scene: "hudson",
    vibes: ["Walkable", "Design", "Food", "Quiet"],
    travelMinutes: 130,
    travelMode: "Amtrak Empire Service",
    travelNote: "Hudson station is at the bottom of Warren Street. Walking uphill with a roller bag is the whole commute.",
    lodging: "Rooms above a Warren Street shopfront",
    weather: "Cool nights, bright Saturday, sweater weather",
    crowd: "Saturday browsers from the city. Sunday morning is the local pace.",
    highlights: [
      "Warren Street on foot, with a spending cap",
      "Olana view if you want a half-day outing",
      "One long dinner, book the early seating",
    ],
    watchout: "Olana tours sell out. The grounds view is enough if tickets are gone.",
    budget: [
      { id: "transit", label: "Amtrak", amount: 62, note: "Round trip to Hudson station" },
      { id: "stay", label: "Stay", amount: 158, note: "Two nights, shared rooms" },
      { id: "food", label: "Food", amount: 118, note: "One destination dinner" },
      { id: "activities", label: "Activities", amount: 20, note: "Olana grounds or a gallery" },
    ],
    itinerary: [
      {
        day: "Friday",
        date: "Oct 9",
        title: "Uphill from the station",
        blocks: [
          { time: "4:25 pm", title: "Empire Service", detail: "Moynihan to Hudson. The scenic bit is the river after Poughkeepsie." },
          { time: "6:45 pm", title: "Check in on Warren", detail: "Leave bags. Walk downhill first so the return is the climb." },
          { time: "8:00 pm", title: "Early dinner", detail: "A bistro that takes the reservation seriously. Share the main courses." },
        ],
      },
      {
        day: "Saturday",
        date: "Oct 10",
        title: "Shops with a limit",
        blocks: [
          { time: "9:30 am", title: "Coffee and a plan", detail: "Agree on a per-person antique cap before the first store. It will save a friendship." },
          { time: "11:00 am", title: "Warren Street drift", detail: "Bookshops, a record store, one furniture store you will not buy from." },
          { time: "2:30 pm", title: "Olana view", detail: "Rideshare up. Walk the grounds. The house tour only if tickets are already in hand." },
          { time: "7:30 pm", title: "Long dinner", detail: "The meal the weekend is built around. Walk it off on the way home." },
        ],
      },
      {
        day: "Sunday",
        date: "Oct 11",
        title: "River, then south",
        blocks: [
          { time: "9:00 am", title: "Bakery breakfast", detail: "Sit. Nobody needs a third museum." },
          { time: "11:00 am", title: "Riverfront park", detail: "Short walk, freight trains, a last look at the water." },
          { time: "1:20 pm", title: "Amtrak to Moynihan", detail: "Downhill to the station is the easy part. Be early anyway." },
        ],
      },
    ],
    packing: ["Amtrak tickets", "Dinner reservation", "Sweater", "Spending cap agreement", "Comfortable walking shoes"],
  },
  {
    id: "new-hope",
    name: "New Hope & Lambertville",
    place: "Delaware River, PA / NJ",
    tagline: "Two small towns, a towpath, and kayaks if the weather agrees.",
    scene: "hope",
    vibes: ["Walkable", "Water", "Outdoors", "Design"],
    travelMinutes: 115,
    travelMode: "Carpool via I-95 and Route 202",
    travelNote: "No clean train all the way in. Two cars, about $42 a person with tolls. Parking in town is the annoying part.",
    lodging: "A Lambertville inn facing the bridge",
    weather: "Mild, mid-60s, best paddling window is late morning",
    crowd: "New Hope Saturdays draw day-trippers. The towpath thins out after a mile.",
    highlights: [
      "Walk both towns across the free bridge",
      "Kayak the Delaware only if the outfitter says the current is friendly",
      "Gallery afternoon and a single nice dinner on the Lambertville side",
    ],
    watchout: "Bridge traffic stacks up around 5pm Sunday. Leave after lunch, not after a last browse.",
    budget: [
      { id: "transit", label: "Carpool", amount: 42, note: "Tolls, gas, shared between two cars" },
      { id: "stay", label: "Inn", amount: 148, note: "Two nights on the Lambertville side" },
      { id: "food", label: "Food", amount: 102, note: "One proper dinner, casual otherwise" },
      { id: "activities", label: "Kayaks", amount: 36, note: "Two-hour rental, optional" },
    ],
    itinerary: [
      {
        day: "Friday",
        date: "Oct 9",
        title: "Cross the bridge before dark",
        blocks: [
          { time: "4:00 pm", title: "Leave Brooklyn", detail: "Two cars. The person who hates driving takes snacks, not the wheel." },
          { time: "6:10 pm", title: "Inn check-in", detail: "Lambertville side, so dinner is downstairs from the rooms." },
          { time: "7:30 pm", title: "Dinner, then the bridge", detail: "Eat, then walk across to see New Hope’s lights. Save the shops for Saturday." },
        ],
      },
      {
        day: "Saturday",
        date: "Oct 10",
        title: "Water or towpath",
        blocks: [
          { time: "9:00 am", title: "Coffee on Bridge Street", detail: "Decide on kayaks based on the outfitter’s morning note, not optimism." },
          { time: "10:30 am", title: "Kayaks or a long towpath walk", detail: "Two hours on the water, or an out-and-back along the canal. Both end at lunch." },
          { time: "2:00 pm", title: "New Hope galleries", detail: "Cross the bridge. A bookshop, a record bin, a rule against impulse furniture." },
          { time: "7:00 pm", title: "Dinner in Lambertville", detail: "Walk back over. Early enough that Sunday doesn’t start tired." },
        ],
      },
      {
        day: "Sunday",
        date: "Oct 11",
        title: "Market, then the highway",
        blocks: [
          { time: "9:00 am", title: "Breakfast in town", detail: "Sit-down. The drive is ordinary. The morning should not be." },
          { time: "11:00 am", title: "Last loop on the towpath", detail: "Half an hour. Benches face the river." },
          { time: "12:30 pm", title: "Drive back", detail: "Beat the later bridge queue. Brooklyn by mid-afternoon." },
        ],
      },
    ],
    packing: ["Driver assignments", "Water shoes if kayaking", "Inn confirmation", "Layer for the river wind", "Snack bag for the drive"],
  },
]

export function budgetTotal(destination: Destination): number {
  return destination.budget.reduce((sum, line) => sum + line.amount, 0)
}

export function formatMoney(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export const BUDGET_MIN = Math.min(...DESTINATIONS.map(budgetTotal))
export const BUDGET_MAX = Math.max(...DESTINATIONS.map(budgetTotal))
export const TRAVEL_MIN = Math.min(...DESTINATIONS.map((d) => d.travelMinutes))
export const TRAVEL_MAX = Math.max(...DESTINATIONS.map((d) => d.travelMinutes))
