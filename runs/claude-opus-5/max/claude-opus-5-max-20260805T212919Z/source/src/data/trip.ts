import { getTripDates } from "../lib/format"
import type { Member, Origin, OriginId, VibeId, VoteValue } from "../types"

export const YOU_ID = "you"

export const TRIP_NAME = "The Autumn Weekender"

/** Resolved once per page load so the demo always points at a real weekend. */
export const TRIP_DATES = getTripDates()

export const MEMBERS: Member[] = [
  {
    id: YOU_ID,
    name: "You",
    initials: "YO",
    color: "#d9532b",
    note: "Trip organiser · started the poll",
    attending: true,
    wants: ["food", "nature"],
  },
  {
    id: "mira",
    name: "Mira",
    initials: "MI",
    color: "#2f7d6d",
    note: "Will hike anything under 20 km",
    attending: true,
    wants: ["nature", "adventure"],
  },
  {
    id: "jonas",
    name: "Jonas",
    initials: "JO",
    color: "#3f6ea8",
    note: "Books everything three months early",
    attending: true,
    wants: ["culture", "city"],
  },
  {
    id: "leila",
    name: "Leila",
    initials: "LE",
    color: "#a8506f",
    note: "Here for the food, honestly",
    attending: true,
    wants: ["food", "nightlife"],
  },
  {
    id: "tom",
    name: "Tom",
    initials: "TO",
    color: "#8a6a2f",
    note: "Watching the budget for all of us",
    attending: true,
    wants: ["chill", "beach"],
  },
  {
    id: "ines",
    name: "Inés",
    initials: "IN",
    color: "#6b5aa8",
    note: "Can only make it if we leave Friday late",
    attending: false,
    wants: ["city", "nightlife"],
  },
]

export const ORIGINS: Origin[] = [
  { id: "berlin", city: "Berlin", hub: "BER · Hbf" },
  { id: "munich", city: "Munich", hub: "MUC · Hbf" },
  { id: "hamburg", city: "Hamburg", hub: "HAM · Hbf" },
]

export const VIBES: { id: VibeId; label: string; blurb: string }[] = [
  { id: "nature", label: "Nature", blurb: "Trails, forests, big views" },
  { id: "city", label: "City", blurb: "Streets, cafés, people-watching" },
  { id: "food", label: "Food", blurb: "Markets, long dinners, wine" },
  { id: "nightlife", label: "Nightlife", blurb: "Bars that stay open late" },
  { id: "beach", label: "Water", blurb: "Coast, lakes, swimming" },
  { id: "culture", label: "Culture", blurb: "Museums, history, design" },
  { id: "adventure", label: "Adventure", blurb: "Something slightly scary" },
  { id: "chill", label: "Slow", blurb: "Nothing scheduled before 11" },
]

export const VIBE_LABEL: Record<VibeId, string> = VIBES.reduce(
  (acc, vibe) => {
    acc[vibe.id] = vibe.label
    return acc
  },
  {} as Record<VibeId, string>,
)

/**
 * Seed votes for everyone except you — the demo opens with a poll that is
 * genuinely mid-flight, so the tally moves as soon as you cast a vote.
 */
export const SEED_VOTES: Record<string, Record<string, VoteValue>> = {
  mira: {
    "saxon-switzerland": "yes",
    chamonix: "yes",
    bled: "yes",
    ruegen: "maybe",
    lisbon: "maybe",
    prague: "no",
    krakow: "no",
    copenhagen: "maybe",
    "san-sebastian": "maybe",
    edinburgh: "maybe",
  },
  jonas: {
    prague: "yes",
    krakow: "yes",
    edinburgh: "yes",
    copenhagen: "maybe",
    lisbon: "maybe",
    bled: "maybe",
    "saxon-switzerland": "maybe",
    chamonix: "no",
    ruegen: "no",
  },
  leila: {
    lisbon: "yes",
    "san-sebastian": "yes",
    copenhagen: "yes",
    prague: "maybe",
    krakow: "maybe",
    edinburgh: "maybe",
    bled: "maybe",
    ruegen: "no",
    "saxon-switzerland": "no",
  },
  tom: {
    ruegen: "yes",
    prague: "yes",
    krakow: "yes",
    "saxon-switzerland": "yes",
    bled: "maybe",
    lisbon: "maybe",
    edinburgh: "no",
    copenhagen: "no",
    "san-sebastian": "no",
  },
  ines: {
    lisbon: "yes",
    copenhagen: "yes",
    edinburgh: "maybe",
    prague: "maybe",
  },
}

export interface PrepTask {
  id: string
  title: string
  detail: string
  ownerId: string
}

export const PREP_TASKS: PrepTask[] = [
  {
    id: "book-stay",
    title: "Book the place",
    detail: "Free cancellation until 5 days before — book it, we can still move.",
    ownerId: "jonas",
  },
  {
    id: "book-travel",
    title: "Lock the tickets",
    detail: "Same departure for everyone so nobody arrives alone at midnight.",
    ownerId: YOU_ID,
  },
  {
    id: "dinner",
    title: "Reserve Saturday dinner",
    detail: "Table for the whole crew, 20:00. Call, don't email.",
    ownerId: "leila",
  },
  {
    id: "kitty",
    title: "Start the shared kitty",
    detail: "€60 each up front covers groceries, tickets and the taxi back.",
    ownerId: "tom",
  },
  {
    id: "route",
    title: "Pick the Saturday route",
    detail: "Download the offline map before we lose signal.",
    ownerId: "mira",
  },
  {
    id: "playlist",
    title: "Build the travel playlist",
    detail: "Three hours minimum. No repeats from last time.",
    ownerId: "ines",
  },
]

/** Home base for the crew, used as the default departure city. */
export const DEFAULT_ORIGIN: OriginId = "berlin"
