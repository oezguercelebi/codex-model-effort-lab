import { Building2, Landmark, Mountain, Sun, TreePine, Waves } from "lucide-react"
import type { Destination } from "../types"

export function DestinationIcon({
  icon,
  className,
}: {
  icon: Destination["icon"]
  className?: string
}) {
  switch (icon) {
    case "mountain":
      return <Mountain className={className} />
    case "waves":
      return <Waves className={className} />
    case "building":
      return <Building2 className={className} />
    case "trees":
      return <TreePine className={className} />
    case "sun":
      return <Sun className={className} />
    case "landmark":
      return <Landmark className={className} />
  }
}
