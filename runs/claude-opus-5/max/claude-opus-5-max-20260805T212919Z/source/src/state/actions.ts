import { useCallback } from "react"
import { YOU_ID } from "../data/trip"
import type { Destination, VoteValue } from "../types"
import { useTrip } from "./store"
import { useToast } from "./toast"

const VOTE_COPY: Record<VoteValue, string> = {
  yes: "Yes — I'm in",
  maybe: "Maybe",
  no: "Not this time",
}

/** Casts your vote, with an undo affordance. Clicking the active choice clears it. */
export function useCastVote() {
  const { state, dispatch } = useTrip()
  const { push } = useToast()

  return useCallback(
    (destination: Destination, value: VoteValue) => {
      const previous = state.votes[YOU_ID]?.[destination.id]
      const next = previous === value ? undefined : value

      dispatch({ type: "vote", memberId: YOU_ID, destinationId: destination.id, value: next })

      push({
        message: next ? `${destination.name}: ${VOTE_COPY[next]}` : `Vote cleared for ${destination.name}`,
        detail: next ? "The group tally updated." : undefined,
        tone: next === "yes" ? "success" : "default",
        action: {
          label: "Undo",
          onClick: () =>
            dispatch({
              type: "vote",
              memberId: YOU_ID,
              destinationId: destination.id,
              value: previous,
            }),
        },
      })
    },
    [dispatch, push, state.votes],
  )
}

export function useToggleCompare() {
  const { state, dispatch } = useTrip()
  const { push } = useToast()

  return useCallback(
    (destination: Destination) => {
      const active = state.compare.includes(destination.id)
      if (!active && state.compare.length >= 3) {
        push({
          message: "Compare holds three at a time",
          detail: `${destination.name} replaced the first one you picked.`,
        })
      }
      dispatch({ type: "toggleCompare", destinationId: destination.id })
    },
    [dispatch, push, state.compare],
  )
}
