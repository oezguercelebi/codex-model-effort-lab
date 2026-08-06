import { useEffect, useState } from "react"

export interface Countdown {
  totalMs: number
  days: number
  hours: number
  minutes: number
  isPast: boolean
}

function computeCountdown(targetMs: number): Countdown {
  const totalMs = targetMs - Date.now()
  const isPast = totalMs <= 0
  const clamped = Math.max(totalMs, 0)
  const days = Math.floor(clamped / (24 * 60 * 60 * 1000))
  const hours = Math.floor((clamped % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  const minutes = Math.floor((clamped % (60 * 60 * 1000)) / (60 * 1000))
  return { totalMs, days, hours, minutes, isPast }
}

export function useCountdown(target: Date): Countdown {
  const targetMs = target.getTime()
  const [countdown, setCountdown] = useState(() => computeCountdown(targetMs))

  useEffect(() => {
    setCountdown(computeCountdown(targetMs))
    const id = window.setInterval(() => {
      setCountdown(computeCountdown(targetMs))
    }, 30_000)
    return () => window.clearInterval(id)
  }, [targetMs])

  return countdown
}
