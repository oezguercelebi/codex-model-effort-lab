import { CheckCircle2, Vote } from "lucide-react"
import type { Destination } from "../types"

export function StatusBanner({
  yourVote,
  isTied,
  totalVoted,
  totalMembers,
}: {
  yourVote: Destination | null
  isTied: boolean
  totalVoted: number
  totalMembers: number
}) {
  if (yourVote) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <CheckCircle2 className="size-5 shrink-0 text-emerald-600" />
        <p className="text-sm text-emerald-900">
          You're backing <span className="font-semibold">{yourVote.name}</span>. Change your mind anytime before
          voting closes.
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <Vote className="size-5 shrink-0 text-amber-600" />
      <p className="text-sm text-amber-900">
        {isTied ? (
          <>
            It's a tie so far — <span className="font-semibold">your vote decides the winner.</span>
          </>
        ) : (
          <>
            <span className="font-semibold">
              {totalVoted} of {totalMembers} friends
            </span>{" "}
            have voted. Cast yours below.
          </>
        )}
      </p>
    </div>
  )
}
