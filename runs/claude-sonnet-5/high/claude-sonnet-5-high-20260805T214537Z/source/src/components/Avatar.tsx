import type { Friend } from "../types"

export function Avatar({
  friend,
  size = "md",
  ring = false,
}: {
  friend: Friend
  size?: "sm" | "md" | "lg"
  ring?: boolean
}) {
  const sizeClasses = {
    sm: "h-6 w-6 text-[10px]",
    md: "h-8 w-8 text-xs",
    lg: "h-11 w-11 text-sm",
  }[size]

  const label = friend.id === "you" ? (size === "sm" ? "Y" : "You") : friend.initials

  return (
    <span
      title={friend.name}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${friend.bg} ${friend.fg} ${sizeClasses} ${
        ring ? "ring-2 ring-white" : ""
      }`}
    >
      {label}
    </span>
  )
}

export function AvatarStack({ friends, max = 4 }: { friends: Friend[]; max?: number }) {
  if (friends.length === 0) {
    return <span className="text-sm text-stone-400">No votes yet</span>
  }
  const shown = friends.slice(0, max)
  const overflow = friends.length - shown.length

  return (
    <div className="flex items-center -space-x-2">
      {shown.map((f) => (
        <Avatar key={f.id} friend={f} size="sm" ring />
      ))}
      {overflow > 0 && (
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-stone-200 text-[10px] font-semibold text-stone-600 ring-2 ring-white">
          +{overflow}
        </span>
      )}
    </div>
  )
}
