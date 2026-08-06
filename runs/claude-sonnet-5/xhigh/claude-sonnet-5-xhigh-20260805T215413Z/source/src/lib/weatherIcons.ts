import { Cloud, CloudRain, CloudSun, Sun } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { WeatherCondition } from "../types"

export const WEATHER_ICONS: Record<WeatherCondition, LucideIcon> = {
  sunny: Sun,
  "partly-cloudy": CloudSun,
  cloudy: Cloud,
  rainy: CloudRain,
}
