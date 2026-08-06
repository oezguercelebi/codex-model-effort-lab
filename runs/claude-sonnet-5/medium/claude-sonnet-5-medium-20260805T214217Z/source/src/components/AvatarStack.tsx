import type { Friend } from "../types"

export function AvatarStack({
  voters,
  size = "sm",
}: {
  voters: Friend[]
  size?: "sm" | "md"
}) {
  const dims = size === "sm" ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs"
  if (voters.length === 0) {
    return <span className="text-xs text-stone-400">No votes yet</span>
  }
  return (
    <div className="flex items-center">
      {voters.slice(0, 5).map((f, i) => (
        <div
          key={f.id}
          title={f.name}
          style={{ marginLeft: i === 0 ? 0 : "-0.5rem", zIndex: voters.length - i }}
          className={`relative flex ${dims} items-center justify-center rounded-full ${f.color} font-semibold text-white ring-2 ring-white`}
        >
          {f.initials}
        </div>
      ))}
      {voters.length > 5 && (
        <span className="ml-1.5 text-xs font-medium text-stone-500">+{voters.length - 5}</span>
      )}
    </div>
  )
}
