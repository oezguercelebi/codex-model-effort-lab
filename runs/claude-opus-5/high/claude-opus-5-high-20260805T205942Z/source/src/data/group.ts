import type { Member, VoteValue } from "../types"

/** The member the app opens as. Any member can be switched to from the crew menu. */
export const YOU_ID = "mara"

export const MEMBERS: Member[] = [
  {
    id: "mara",
    name: "Mara",
    initials: "MA",
    hue: 18,
    weights: { nature: 4, food: 4, nightlife: 2, culture: 4, chill: 3, adventure: 3, beach: 2 },
    blurb: "Started the group chat. Wants a walk and a museum.",
    going: true,
  },
  {
    id: "jonas",
    name: "Jonas",
    initials: "JO",
    hue: 265,
    weights: { nature: 2, food: 3, nightlife: 5, culture: 3, chill: 1, adventure: 2, beach: 2 },
    blurb: "Will find the one good bar within an hour of arriving.",
    going: true,
  },
  {
    id: "priya",
    name: "Priya",
    initials: "PR",
    hue: 152,
    weights: { nature: 5, food: 4, nightlife: 1, culture: 3, chill: 4, adventure: 5, beach: 3 },
    blurb: "Owns the good boots. Has opinions about elevation gain.",
    going: true,
  },
  {
    id: "tom",
    name: "Tom",
    initials: "TO",
    hue: 205,
    weights: { nature: 3, food: 5, nightlife: 3, culture: 2, chill: 4, adventure: 2, beach: 4 },
    blurb: "Books the restaurants. Trip is judged on dinner quality.",
    going: true,
  },
  {
    id: "elif",
    name: "Elif",
    initials: "EL",
    hue: 320,
    weights: { nature: 2, food: 4, nightlife: 3, culture: 5, chill: 3, adventure: 2, beach: 2 },
    blurb: "Reads the museum labels. All of them.",
    going: true,
  },
  {
    id: "nils",
    name: "Nils",
    initials: "NI",
    hue: 42,
    weights: { nature: 4, food: 3, nightlife: 2, culture: 2, chill: 5, adventure: 4, beach: 5 },
    blurb: "Might make it — depends on a Saturday shift.",
    going: false,
  },
]

export const MEMBER_BY_ID: Record<string, Member> = Object.fromEntries(
  MEMBERS.map((m) => [m.id, m]),
)

/** Votes the rest of the group has already cast. "You" start with a blank ballot. */
export const SEED_VOTES: Record<string, Record<string, VoteValue>> = {
  jonas: {
    prague: "in",
    amsterdam: "in",
    hamburg: "in",
    krakow: "in",
    saxony: "out",
    ruegen: "out",
    copenhagen: "maybe",
    lisbon: "maybe",
    vienna: "maybe",
  },
  priya: {
    saxony: "in",
    bled: "in",
    ruegen: "in",
    lisbon: "maybe",
    prague: "maybe",
    krakow: "maybe",
    amsterdam: "out",
    hamburg: "out",
  },
  tom: {
    lisbon: "in",
    copenhagen: "in",
    krakow: "in",
    vienna: "maybe",
    prague: "maybe",
    ruegen: "maybe",
    saxony: "out",
  },
  elif: {
    vienna: "in",
    prague: "in",
    krakow: "in",
    copenhagen: "maybe",
    amsterdam: "maybe",
    lisbon: "maybe",
    ruegen: "out",
    saxony: "out",
  },
}

export type Comment = {
  destinationId: string
  memberId: string
  text: string
  when: string
}

export const COMMENTS: Comment[] = [
  {
    destinationId: "prague",
    memberId: "jonas",
    text: "Four hours on a train with a dining car is not a hardship. I'm in.",
    when: "2d ago",
  },
  {
    destinationId: "prague",
    memberId: "priya",
    text: "Fine, but I want one morning that isn't in a bar.",
    when: "2d ago",
  },
  {
    destinationId: "krakow",
    memberId: "tom",
    text: "We could eat like kings for €30 a day here. Genuinely the value pick.",
    when: "1d ago",
  },
  {
    destinationId: "krakow",
    memberId: "elif",
    text: "Schindler's Factory museum alone justifies the trip.",
    when: "1d ago",
  },
  {
    destinationId: "saxony",
    memberId: "priya",
    text: "Bastei at sunrise. Two hours from our front doors. Why is this not decided already?",
    when: "3d ago",
  },
  {
    destinationId: "saxony",
    memberId: "jonas",
    text: "Because there is nowhere to go on Saturday night, Priya.",
    when: "3d ago",
  },
  {
    destinationId: "lisbon",
    memberId: "tom",
    text: "Flights are €186 return. That's the whole argument against, honestly.",
    when: "4h ago",
  },
  {
    destinationId: "copenhagen",
    memberId: "tom",
    text: "Dinner will cost what a whole weekend in Kraków costs. Worth it once.",
    when: "1d ago",
  },
  {
    destinationId: "amsterdam",
    memberId: "priya",
    text: "We've all been three times. Can we go somewhere new?",
    when: "2d ago",
  },
  {
    destinationId: "vienna",
    memberId: "elif",
    text: "Sleeper train there, sleeper train back, two full days in the city. No lost time.",
    when: "5h ago",
  },
  {
    destinationId: "bled",
    memberId: "priya",
    text: "Swimming to the island is the single best thing on this whole board.",
    when: "6h ago",
  },
  {
    destinationId: "hamburg",
    memberId: "jonas",
    text: "Leave at 6, be at the harbour by 8. Zero planning required.",
    when: "1d ago",
  },
  {
    destinationId: "ruegen",
    memberId: "priya",
    text: "Nils would come to this one. He's only free if we're near a beach.",
    when: "2d ago",
  },
]
