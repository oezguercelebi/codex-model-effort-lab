import type { Friend } from "../types"
import { Avatar } from "./Avatar"
import { cn } from "../utils/format"

interface AvatarStackProps {
  friends: Friend[]
  max?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

const overflowSize = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-base",
}

export function AvatarStack({ friends, max = 4, size = "sm", className }: AvatarStackProps) {
  const visible = friends.slice(0, max)
  const overflow = friends.length - visible.length

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {visible.map((friend) => (
        <Avatar key={friend.id} friend={friend} size={size} />
      ))}
      {overflow > 0 && (
        <span
          className={cn(
            "inline-flex shrink-0 items-center justify-center rounded-full bg-stone-200 font-semibold text-stone-600 ring-2 ring-white",
            overflowSize[size],
          )}
        >
          +{overflow}
        </span>
      )}
    </div>
  )
}
