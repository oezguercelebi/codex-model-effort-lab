import type { Member } from "../types"

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

const SIZE_CLASSES = {
  sm: "size-6 text-[10px]",
  md: "size-8 text-xs",
  lg: "size-10 text-sm",
}

export function Avatar({
  member,
  size = "md",
  ring = false,
}: {
  member: Member
  size?: keyof typeof SIZE_CLASSES
  ring?: boolean
}) {
  return (
    <div
      title={member.name}
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${member.colorClass} ${SIZE_CLASSES[size]} ${
        ring ? "ring-2 ring-amber-300 ring-offset-2 ring-offset-white" : ""
      }`}
    >
      {initials(member.name)}
    </div>
  )
}

export function AvatarStack({
  members,
  size = "sm",
  max = 4,
}: {
  members: Member[]
  size?: keyof typeof SIZE_CLASSES
  max?: number
}) {
  if (members.length === 0) {
    return <p className="text-xs text-stone-400">No votes yet</p>
  }

  const visible = members.slice(0, max)
  const overflow = members.length - visible.length

  return (
    <div className="flex items-center -space-x-2">
      {visible.map((member) => (
        <div key={member.id} className="ring-2 ring-white rounded-full">
          <Avatar member={member} size={size} ring={member.isYou} />
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={`flex shrink-0 items-center justify-center rounded-full bg-stone-200 font-semibold text-stone-600 ring-2 ring-white ${SIZE_CLASSES[size]}`}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}
