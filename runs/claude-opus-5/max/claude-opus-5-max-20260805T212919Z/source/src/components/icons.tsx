import {
  Bed,
  Binoculars,
  Bus,
  Camera,
  Car,
  Cloud,
  CloudRain,
  CloudSun,
  Coffee,
  Footprints,
  Landmark,
  Mountain,
  Navigation,
  Plane,
  Sailboat,
  Ship,
  ShoppingBag,
  Snowflake,
  Sparkles,
  Sun,
  TrainFront,
  Utensils,
  WavesHorizontal,
  Wine,
  type LucideIcon,
} from "lucide-react"
import type { HighlightIcon, ItineraryTag, TravelMode, WeatherCondition } from "../types"

export const MODE_ICON: Record<TravelMode, LucideIcon> = {
  plane: Plane,
  train: TrainFront,
  car: Car,
  bus: Bus,
  ferry: Ship,
}

export const MODE_LABEL: Record<TravelMode, string> = {
  plane: "Flight",
  train: "Train",
  car: "Car",
  bus: "Coach",
  ferry: "Ferry",
}

export const WEATHER_ICON: Record<WeatherCondition, LucideIcon> = {
  sunny: Sun,
  partly: CloudSun,
  cloudy: Cloud,
  rain: CloudRain,
  snow: Snowflake,
}

export const WEATHER_LABEL: Record<WeatherCondition, string> = {
  sunny: "Clear",
  partly: "Sun and cloud",
  cloudy: "Overcast",
  rain: "Showers",
  snow: "Snow",
}

export const HIGHLIGHT_ICON: Record<HighlightIcon, LucideIcon> = {
  food: Utensils,
  view: Binoculars,
  walk: Footprints,
  water: WavesHorizontal,
  night: Wine,
  museum: Landmark,
  market: ShoppingBag,
  hike: Mountain,
  coffee: Coffee,
  boat: Sailboat,
}

export const TAG_ICON: Record<ItineraryTag, LucideIcon> = {
  travel: Navigation,
  food: Utensils,
  activity: Camera,
  stay: Bed,
  free: Sparkles,
}

export const TAG_LABEL: Record<ItineraryTag, string> = {
  travel: "Getting there",
  food: "Eat",
  activity: "Do",
  stay: "Stay",
  free: "Free",
}

export const TAG_CLASS: Record<ItineraryTag, string> = {
  travel: "bg-deep-soft text-deep",
  food: "bg-brand-soft text-brand",
  activity: "bg-gold-soft text-gold",
  stay: "bg-surface-3 text-ink-soft",
  free: "bg-yes-soft text-yes",
}
