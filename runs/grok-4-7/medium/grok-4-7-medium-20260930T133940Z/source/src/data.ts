import type { Destination, Friend, VibeId } from "./types"

export const tripWhen = "October 16–18, 2026"
export const tripFrom = "Austin"

export const vibeLabels: Record<VibeId, string> = {
  coast: "Coast",
  desert: "Desert",
  city: "City",
  wine: "Wine country",
  art: "Art",
}

export const friends: Friend[] = [
  { id: "maya", name: "Maya", initial: "M", color: "#0F6E62" },
  { id: "jordan", name: "Jordan", initial: "J", color: "#1D4E89" },
  { id: "priya", name: "Priya", initial: "P", color: "#9A3412" },
  { id: "sam", name: "Sam", initial: "S", color: "#243B53" },
  { id: "alex", name: "Alex", initial: "A", color: "#5C3D86" },
]

export const defaultVotes: Record<string, string | null> = {
  maya: "santa-fe",
  jordan: "new-orleans",
  priya: "santa-fe",
  sam: null,
  alex: "marfa",
}

export const destinations: Destination[] = [
  {
    id: "fredericksburg",
    name: "Fredericksburg",
    region: "Hill Country",
    tagline: "A short drive, a cabin, and Saturday at Enchanted Rock.",
    summary:
      "Leave Austin after work and be on a patio before dark. The weekend is a timed hike, two tasting rooms, and one dinner worth reserving. It is the easiest yes if the group wants to be back Sunday afternoon.",
    vibes: ["wine"],
    weather: "Clear, about 80° in the afternoon and 55° at night.",
    stay: "A two-bedroom cabin off Llano Street, a few blocks from Main Street.",
    foodNote: "Breakfast tacos, tasting rooms, and a winery dinner.",
    bestFor: "You want to leave after work and still have a full evening.",
    packing: "Walking shoes, and boots if you hike Enchanted Rock.",
    lodgingLabel: "Cabin, 2 nights",
    lodgingTotal: 880,
    transportLabel: "Gas, including the winery loop",
    transportMode: "drive",
    personalTransport: 0,
    sharedTransportTotal: 48,
    foodEach: 126,
    activitiesEach: 48,
    doorToDoorMinutes: 85,
    travelSummary: "Drive on US-290",
    travelSteps: [
      {
        label: "Leave Austin at 5:40 pm",
        detail: "One car from the office. US-290 is the direct road, about 80 miles.",
      },
      {
        label: "Arrive at 7:05 pm",
            detail: "Lockbox check-in off Llano Street. Park once and walk to dinner.",
      },
      {
        label: "Sunday return",
        detail: "Leave after the bakery and you are back in Austin around 1:15 pm.",
      },
    ],
    highlights: [
      "Enchanted Rock with a Saturday morning entry",
      "Two tasting rooms along 290",
      "A slow hour on Main Street before the drive home",
    ],
    watchouts: [
      "Enchanted Rock uses timed entry on weekends. Reserve Saturday morning.",
      "Tasting rooms are mostly walk-in. The dinner reservation is the one to make.",
      "Main Street traffic on Saturday afternoon is slow. Park once and walk.",
    ],
    itinerary: [
      {
        id: "fri",
        label: "Friday",
        date: "October 16",
        blocks: [
          {
            time: "5:40 pm",
            title: "Leave Austin",
            detail: "One car, US-290 west. The drive is about an hour and a half.",
          },
          {
            time: "7:05 pm",
            title: "Cabin check-in",
            detail: "The cabin has two bedrooms, so one person takes the sofa.",
          },
          {
            time: "8:00 pm",
            title: "Dinner at Cabernet Grill",
            detail: "Reserve this. It is the one table that will not appear at 7:30 on a Friday.",
          },
        ],
      },
      {
        id: "sat",
        label: "Saturday",
        date: "October 17",
        blocks: [
          {
            time: "8:15 am",
            title: "Breakfast tacos",
            detail: "Hilda’s or a taco counter on the way out of town. Eat before the hike.",
          },
          {
            time: "9:30 am",
            title: "Enchanted Rock",
            detail: "Timed entry. The summit loop is the plan. Bring water. It is exposed granite.",
          },
          {
            time: "1:30 pm",
            title: "Tasting rooms on 290",
            detail: "Two stops, not five. Becker Vineyards and a smaller room such as Kuhlman Cellars.",
          },
          {
            time: "7:00 pm",
            title: "Dinner in town",
            detail: "Otto’s if you want a bistro room, or a reservation wherever the group already agreed.",
          },
        ],
      },
      {
        id: "sun",
        label: "Sunday",
        date: "October 18",
        blocks: [
          {
            time: "9:00 am",
            title: "Clear River Bakery",
            detail: "Pie or kolaches for the car. This is the souvenir.",
          },
          {
            time: "10:15 am",
            title: "A last walk on Main",
            detail: "Shops open slowly. Leave before checkout turns into another tasting.",
          },
          {
            time: "11:45 am",
            title: "Drive back",
            detail: "Austin around 1:15 pm, with the afternoon still free.",
          },
        ],
      },
    ],
  },
  {
    id: "marfa",
    name: "Marfa",
    region: "West Texas",
    tagline: "The long drive, for art, quiet, and a huge night sky.",
    summary:
      "Marfa is the cheap weekend only if someone is glad to drive. Friday is mostly the road. Saturday is the Chinati tour, a burrito, and the lights after dark. It rewards a group that does not need a packed schedule.",
    vibes: ["desert", "art"],
    weather: "Dry and bright, about 78° in the afternoon and 48° at night.",
    stay: "A two-bedroom house south of downtown. Nights are quiet and dark.",
    foodNote: "Simple breakfasts and one reservation dinner.",
    bestFor: "You want the lowest cost and someone will drive.",
    packing: "A sun hat, a warm layer for the lights, and water in the car.",
    lodgingLabel: "House, 2 nights",
    lodgingTotal: 720,
    transportLabel: "Gas for the round trip",
    transportMode: "drive",
    personalTransport: 0,
    sharedTransportTotal: 136,
    foodEach: 96,
    activitiesEach: 36,
    doorToDoorMinutes: 405,
    travelSummary: "Drive west on I-10",
    travelSteps: [
      {
        label: "Leave Austin at 12:15 pm",
        detail: "Friday is the drive. I-10 west, with a real stop in Ozona.",
      },
      {
        label: "Gas in Ozona",
        detail: "Fill the tank there. The stretch past Fort Stockton is empty.",
      },
      {
        label: "Arrive at 7:00 pm",
        detail: "About 6 hours and 45 minutes to the house, then dinner in town.",
      },
      {
        label: "Sunday return",
        detail: "Leave by 10 am and you are back in Austin around 5 pm.",
      },
    ],
    highlights: [
      "A booked tour at the Chinati Foundation",
      "The Marfa lights after dark",
      "Prada Marfa while the light is still good",
    ],
    watchouts: [
      "Book the Chinati Foundation tour. Saturday walks fill up.",
      "Gas up in Ozona. Do not count on a station when you need one.",
      "Prada Marfa is about 40 minutes west. Go in late afternoon, not into dusk on a two-lane road.",
    ],
    itinerary: [
      {
        id: "fri",
        label: "Friday",
        date: "October 16",
        blocks: [
          {
            time: "12:15 pm",
            title: "Leave Austin",
            detail: "One car, tank full. The weekend starts when you clear the city.",
          },
          {
            time: "3:30 pm",
            title: "Stop in Ozona",
            detail: "Gas, water, and a stretch. The next useful stop is a long way off.",
          },
          {
            time: "7:00 pm",
            title: "House, then dinner",
            detail: "Check in and eat at Al Campo, or Cochineal if you already have the reservation.",
          },
        ],
      },
      {
        id: "sat",
        label: "Saturday",
        date: "October 17",
        blocks: [
          {
            time: "9:00 am",
            title: "Chinati Foundation",
            detail: "The guided tour is the reason to be here. Do not treat it as a drop-in.",
          },
          {
            time: "12:30 pm",
            title: "Marfa Burrito",
            detail: "A late breakfast that becomes lunch. Cash is the calm choice.",
          },
          {
            time: "3:00 pm",
            title: "Galleries, then Prada Marfa",
            detail: "Highland Avenue first, then the drive west while the sun is still high.",
          },
          {
            time: "8:30 pm",
            title: "Marfa lights",
            detail: "The viewing area is east of town. Bring the warm layer. Phones will not capture it.",
          },
        ],
      },
      {
        id: "sun",
        label: "Sunday",
        date: "October 18",
        blocks: [
          {
            time: "8:30 am",
            title: "Breakfast at Squeeze",
            detail: "A proper sit-down before a long road. Order before you are hungry.",
          },
          {
            time: "10:00 am",
            title: "Drive back",
            detail: "Same route, same Ozona stop. Austin around 5 pm.",
          },
        ],
      },
    ],
  },
  {
    id: "new-orleans",
    name: "New Orleans",
    region: "Louisiana",
    tagline: "A direct flight, a long dinner, and music after dark.",
    summary:
      "New Orleans is the food weekend. The flight is direct and the lodging is two rooms in the Marigny, close to Frenchmen Street. Saturday is a streetcar, a neighborhood afternoon, and a jazz room that does not take reservations.",
    vibes: ["city"],
    weather: "Humid, about 82° and 68°, with a shower possible.",
    stay: "Two rooms in a Marigny guesthouse, a short walk to Frenchmen Street.",
    foodNote: "Beignets, a po'boy, and two sit-down dinners.",
    bestFor: "The weekend is mostly about dinner and music.",
    packing: "Light clothes, a rain layer, and shoes you can stand in.",
    lodgingLabel: "Two rooms, 2 nights",
    lodgingTotal: 690,
    transportLabel: "Rideshares and streetcar passes",
    transportMode: "fly",
    personalTransport: 172,
    sharedTransportTotal: 80,
    foodEach: 158,
    activitiesEach: 55,
    doorToDoorMinutes: 270,
    travelSummary: "Direct flight, then a rideshare",
    travelSteps: [
      {
        label: "Leave for AUS at 3:30 pm",
        detail: "Domestic buffer included. The door-to-door time is about 4 hours and 30 minutes.",
      },
      {
        label: "5:55 pm flight to MSY",
        detail: "Direct, about 1 hour and 25 minutes in the air. You land around 7:20 pm Central.",
      },
      {
        label: "Rideshare to the Marigny",
        detail: "Bags in the rooms by 8:00 pm, then walk to dinner.",
      },
      {
        label: "Sunday flight home",
        detail: "A midafternoon departure puts you back in Austin for a late dinner.",
      },
    ],
    highlights: [
      "The Garden District by streetcar",
      "Frenchmen Street after dark",
      "The sculpture garden at City Park",
    ],
    watchouts: [
      "Reserve Saturday dinner. The good rooms are full by midweek.",
      "The Spotted Cat does not take reservations. Arrive before 8 if you want a seat.",
      "A shower can pass through in an hour. The day still works.",
    ],
    itinerary: [
      {
        id: "fri",
        label: "Friday",
        date: "October 16",
        blocks: [
          {
            time: "3:30 pm",
            title: "Leave for the airport",
            detail: "One rideshare to AUS. Check in with time for a normal Friday security line.",
          },
          {
            time: "5:55 pm",
            title: "Direct flight to MSY",
            detail: "About an hour and a half in the air. You are on the ground around 7:20 pm.",
          },
          {
            time: "8:00 pm",
            title: "Marigny, then Paladar 72",
            detail: "Drop bags and walk to dinner. This reservation is the Friday plan.",
          },
        ],
      },
      {
        id: "sat",
        label: "Saturday",
        date: "October 17",
        blocks: [
          {
            time: "9:00 am",
            title: "Coffee and beignets",
            detail: "Café Du Monde if the line is kind, or a bakery in the neighborhood if it is not.",
          },
          {
            time: "11:00 am",
            title: "St. Charles streetcar",
            detail: "Ride to the Garden District and walk a few blocks. Lafayette Cemetery if it is open.",
          },
          {
            time: "3:00 pm",
            title: "Rest, then Frenchmen",
            detail: "The afternoon is intentionally empty. Record shops if someone still has legs.",
          },
          {
            time: "8:00 pm",
            title: "Jazz at The Spotted Cat",
            detail: "No reservations. Go early, then a late plate nearby if dinner was not enough.",
          },
        ],
      },
      {
        id: "sun",
        label: "Sunday",
        date: "October 18",
        blocks: [
          {
            time: "9:30 am",
            title: "City Park",
            detail: "The sculpture garden is the calm version of the city. Stay an hour, not three.",
          },
          {
            time: "12:00 pm",
            title: "Parkway po'boy",
            detail: "Shrimp, dressed, and then straight to the airport.",
          },
          {
            time: "2:40 pm",
            title: "Flight home",
            detail: "Back in Austin in time to unpack and still have a Sunday night.",
          },
        ],
      },
    ],
  },
  {
    id: "port-aransas",
    name: "Port Aransas",
    region: "Texas coast",
    tagline: "A beach house, a ferry, and a morning in the water.",
    summary:
      "Port Aransas is the swimming weekend. The drive includes the ferry at the end, and the house is the point: sand, a kitchen breakfast, and one kayak morning. Sunday’s ferry line is the only clock that matters.",
    vibes: ["coast"],
    weather: "Warm gulf air, about 84° in the afternoon and 72° at night.",
    stay: "A three-bedroom beach house, a short walk to the sand.",
    foodNote: "Fish tacos, a shrimp basket, and groceries for breakfast.",
    bestFor: "You want water and a house to come back to.",
    packing: "Swimsuits, sunscreen, and a light layer for the ferry.",
    lodgingLabel: "Beach house, 2 nights",
    lodgingTotal: 960,
    transportLabel: "Gas for the round trip",
    transportMode: "drive",
    personalTransport: 0,
    sharedTransportTotal: 80,
    foodEach: 104,
    activitiesEach: 46,
    doorToDoorMinutes: 225,
    travelSummary: "Drive to the coast, then the ferry",
    travelSteps: [
      {
        label: "Leave Austin at 2:30 pm",
        detail: "Through San Antonio and Corpus, then Aransas Pass.",
      },
      {
        label: "The ferry",
        detail: "The free ferry is the last leg. Friday is usually kinder than Sunday afternoon.",
      },
      {
        label: "Arrive about 6:15 pm",
        detail: "Door to door is about 3 hours and 45 minutes before a bad ferry line.",
      },
      {
        label: "Sunday return",
        detail: "Leave late morning. A ferry queue can add 30 to 40 minutes.",
      },
    ],
    highlights: [
      "A morning on the beach with nowhere else to be",
      "Kayaks on the Lydia Ann Channel",
      "Sunset from Horace Caldwell Pier",
    ],
    watchouts: [
      "The Sunday ferry back to Aransas Pass can add 30 to 40 minutes.",
      "The house parks two cars. One shared car is the plan.",
      "Kayak rentals go out by late morning on Saturday. Book the first slot you will actually make.",
    ],
    itinerary: [
      {
        id: "fri",
        label: "Friday",
        date: "October 16",
        blocks: [
          {
            time: "2:30 pm",
            title: "Leave Austin",
            detail: "One car. The ferry is the only part you cannot time perfectly.",
          },
          {
            time: "6:15 pm",
            title: "Beach house",
            detail: "Keys, a walk to the sand, and a grocery stop if breakfast is going to happen.",
          },
          {
            time: "7:30 pm",
            title: "Shrimp baskets",
            detail: "Moby Dick’s or a fish-taco counter. Nobody needs a reservation tonight.",
          },
        ],
      },
      {
        id: "sat",
        label: "Saturday",
        date: "October 17",
        blocks: [
          {
            time: "8:30 am",
            title: "Beach morning",
            detail: "Coffee at the house, then the sand before the day gets bright.",
          },
          {
            time: "10:30 am",
            title: "Kayaks",
            detail: "Lydia Ann Channel. One rental window, then back before anyone is sun-tired.",
          },
          {
            time: "1:00 pm",
            title: "Lunch and a reset",
            detail: "The house is the amenity. Eat, rinse off, and do not schedule the afternoon.",
          },
          {
            time: "6:30 pm",
            title: "Pier sunset",
            detail: "Horace Caldwell Pier, then tacos again if lunch was the big meal.",
          },
        ],
      },
      {
        id: "sun",
        label: "Sunday",
        date: "October 18",
        blocks: [
          {
            time: "8:30 am",
            title: "One more swim",
            detail: "Then pack while hair is still wet. Checkout is not a leisurely hour.",
          },
          {
            time: "10:30 am",
            title: "Ferry and drive",
            detail: "Budget an extra half hour for the boat. Austin midafternoon.",
          },
        ],
      },
    ],
  },
  {
    id: "santa-fe",
    name: "Santa Fe",
    region: "New Mexico",
    tagline: "Art, green chile, and a cold night in the high desert.",
    summary:
      "Santa Fe is the art weekend. You fly to Albuquerque, pick up one car, and drive an hour north. Saturday is Canyon Road before the galleries fill, Meow Wolf on a ticket, and the O’Keeffe museum. Nights are actually cold.",
    vibes: ["desert", "art"],
    weather: "Sunny, about 68° in the afternoon and 40° at night.",
    stay: "A two-bedroom casita near Canyon Road. One friend takes the sofa.",
    foodNote: "Green chile, a reserved dinner, and breakfast near Canyon Road.",
    bestFor: "You want art and can take a flight.",
    packing: "Layers and shoes for walking. Nights drop near 40°.",
    lodgingLabel: "Casita, 2 nights",
    lodgingTotal: 840,
    transportLabel: "Rental car from Albuquerque",
    transportMode: "fly",
    personalTransport: 198,
    sharedTransportTotal: 246,
    foodEach: 118,
    activitiesEach: 72,
    doorToDoorMinutes: 340,
    travelSummary: "Flight to Albuquerque, then a car",
    travelSteps: [
      {
        label: "Leave for AUS at 1:40 pm CT",
        detail: "The door-to-door time is about 5 hours and 40 minutes, including the drive north.",
      },
      {
        label: "4:05 pm CT flight to ABQ",
        detail: "About 1 hour and 45 minutes in the air. You land at 4:55 pm Mountain.",
      },
      {
        label: "Rental car, then Santa Fe",
        detail: "The counter takes a while on Fridays. The drive north is about an hour.",
      },
      {
        label: "Casita by 6:20 pm MT",
        detail: "Dinner is a reservation, not a stroll that hopes for a table.",
      },
    ],
    highlights: [
      "Canyon Road before the galleries get busy",
      "Meow Wolf on a timed ticket",
      "A short morning at Santa Fe Canyon Preserve",
    ],
    watchouts: [
      "Book Meow Wolf before Saturday. Afternoon slots go first.",
      "Reserve the rental car at ABQ. The Friday counter line is slow.",
      "Book Sazón if that is the dinner. Walk-in green chile is the backup, not the plan.",
    ],
    itinerary: [
      {
        id: "fri",
        label: "Friday",
        date: "October 16",
        blocks: [
          {
            time: "1:40 pm CT",
            title: "Leave for the airport",
            detail: "The flight is not long. The rental car and the drive north are the rest of the trip.",
          },
          {
            time: "4:05 pm CT",
            title: "Flight to Albuquerque",
            detail: "Land at 4:55 pm Mountain. Pick up the car you already reserved.",
          },
          {
            time: "6:20 pm MT",
            title: "Casita near Canyon Road",
            detail: "One sofa sleeper. Decide who it is before you are standing in the doorway.",
          },
          {
            time: "7:30 pm MT",
            title: "Dinner at Sazón",
            detail: "The reservation. If it fell through, green chile somewhere that still has a menu at 8.",
          },
        ],
      },
      {
        id: "sat",
        label: "Saturday",
        date: "October 17",
        blocks: [
          {
            time: "8:30 am",
            title: "Canyon Road",
            detail: "Coffee and the galleries while they are still quiet. You will not see all of them.",
          },
          {
            time: "11:00 am",
            title: "Meow Wolf",
            detail: "Timed entry. Give it two hours, then leave before everyone is overstimulated.",
          },
          {
            time: "2:30 pm",
            title: "Georgia O’Keeffe Museum",
            detail: "A small museum. It is a palate cleanser after Meow Wolf, which is the point.",
          },
          {
            time: "6:30 pm",
            title: "The plaza",
            detail: "A walk and a simpler dinner. Saturday night does not need a second production.",
          },
        ],
      },
      {
        id: "sun",
        label: "Sunday",
        date: "October 18",
        blocks: [
          {
            time: "8:00 am",
            title: "Santa Fe Canyon Preserve",
            detail: "A short walk, not a summit. Be back in the car by late morning.",
          },
          {
            time: "11:00 am",
            title: "Drive to ABQ",
            detail: "Gas the car and eat near the airport. The return flight is midafternoon Mountain.",
          },
          {
            time: "2:30 pm MT",
            title: "Flight home",
            detail: "Austin in the evening, Central time. Sunday night is for laundry, not another plan.",
          },
        ],
      },
    ],
  },
]
