import type { Destination } from "../lib/types"
import { cx } from "./ui"

/**
 * Destinations need artwork and we can't reach the network, so each card gets a
 * generated skyline: a gradient sky plus a silhouette chosen from its vibes.
 */
export function Scenery({
  destination,
  className,
  seed = 0,
}: {
  destination: Destination
  className?: string
  seed?: number
}) {
  const { accent, vibes, id } = destination
  const gid = `sky-${id}-${seed}`
  const sun = `sun-${id}-${seed}`
  const kind = vibes.includes("beach")
    ? "coast"
    : vibes.includes("nature")
      ? "mountains"
      : "city"

  return (
    <svg
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      className={cx("h-full w-full", className)}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={accent.from} />
          <stop offset="100%" stopColor={accent.to} />
        </linearGradient>
        <radialGradient id={sun} cx="0.78" cy="0.28" r="0.42">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="200" fill={`url(#${gid})`} />
      <rect width="400" height="200" fill={`url(#${sun})`} />
      <circle cx="312" cy="56" r="22" fill="#fff" fillOpacity="0.55" />

      {kind === "mountains" ? (
        <g fill="#0b1120">
          <path d="M0 200 L86 78 L134 128 L186 62 L268 200 Z" fillOpacity="0.28" />
          <path d="M120 200 L212 92 L268 148 L330 96 L400 200 Z" fillOpacity="0.42" />
          <path d="M0 200 L60 152 L118 200 Z" fillOpacity="0.5" />
        </g>
      ) : null}

      {kind === "coast" ? (
        <g>
          <path d="M0 148 L400 128 L400 200 L0 200 Z" fill="#0b1120" fillOpacity="0.35" />
          <path
            d="M0 152 q40 10 80 0 t80 0 t80 0 t80 0 t80 0 L400 200 L0 200 Z"
            fill="#0b1120"
            fillOpacity="0.22"
          />
          <path d="M296 148 q10 -46 22 -52 q12 6 22 52 Z" fill="#0b1120" fillOpacity="0.45" />
        </g>
      ) : null}

      {kind === "city" ? (
        <g fill="#0b1120" fillOpacity="0.4">
          <rect x="14" y="126" width="34" height="74" />
          <rect x="56" y="98" width="26" height="102" />
          <rect x="90" y="140" width="42" height="60" />
          <path d="M140 200 L140 118 L162 90 L184 118 L184 200 Z" />
          <rect x="192" y="132" width="30" height="68" />
          <rect x="230" y="106" width="22" height="94" />
          <path d="M260 200 L260 124 L276 104 L292 124 L292 200 Z" />
          <rect x="300" y="138" width="38" height="62" />
          <rect x="346" y="116" width="26" height="84" />
        </g>
      ) : null}

      <rect y="150" width="400" height="50" fill="#0b1120" fillOpacity="0.14" />
    </svg>
  )
}
