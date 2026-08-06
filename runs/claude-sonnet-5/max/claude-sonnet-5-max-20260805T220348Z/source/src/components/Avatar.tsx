import type { Friend } from "../types"
import { cn } from "../utils/format"

const sizeClasses = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-base",
}

interface AvatarProps {
  friend: Friend
  size?: keyof typeof sizeClasses
  muted?: boolean
  className?: string
}

export function Avatar({ friend, size = "md", muted = false, className }: AvatarProps) {
  return (
    <span
      title={friend.isYou ? "You" : friend.name}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold text-white ring-2 ring-white",
        sizeClasses[size],
        muted ? "bg-stone-300 text-stone-500" : friend.color,
        className,
      )}
    >
      {friend.initials}
    </span>
  )
}
