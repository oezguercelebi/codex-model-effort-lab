import { Heart } from "lucide-react"

export default function VoteButton({
  voted,
  outOfVotes,
  onToggle,
  size = "md",
  className = "",
}: {
  voted: boolean
  outOfVotes: boolean
  onToggle: () => void
  size?: "md" | "lg"
  className?: string
}) {
  const sizing = size === "lg" ? "px-5 py-2.5 text-sm" : "px-3.5 py-2 text-xs"
  const look = voted
    ? "border-orange-600 bg-orange-600 text-white shadow-sm hover:bg-orange-700"
    : outOfVotes
      ? "border-stone-200 bg-white text-stone-400"
      : "border-stone-300 bg-white text-stone-700 hover:border-orange-400 hover:text-orange-700"
  return (
    <button
      onClick={onToggle}
      aria-pressed={voted}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full border font-semibold transition-all active:scale-95 ${sizing} ${look} ${className}`}
    >
      <Heart
        aria-hidden
        className={`${size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5"} ${voted ? "anim-pop fill-current" : ""}`}
      />
      {voted ? "Voted" : "Vote"}
    </button>
  )
}
