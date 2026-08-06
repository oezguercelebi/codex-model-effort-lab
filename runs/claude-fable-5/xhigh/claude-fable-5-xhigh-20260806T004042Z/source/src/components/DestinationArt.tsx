import { useId } from "react"
import type { Destination } from "../data"

const BACK_HILLS = "M0 162 Q80 118 160 150 T400 146 L400 220 L0 220 Z"

const FRONT: Record<Destination["art"]["variant"], string> = {
  mountain:
    "M0 200 L60 118 L104 168 L150 92 L204 170 L248 128 L302 184 L344 150 L400 196 L400 220 L0 220 Z",
  coast:
    "M0 180 Q25 172 50 180 T100 180 T150 180 T200 180 T250 180 T300 180 T350 180 T400 180 L400 220 L0 220 Z",
  city:
    "M0 190 L0 148 L26 148 L26 128 L48 128 L48 162 L72 162 L72 118 L98 118 L98 154 L122 154 L122 134 L150 134 L150 164 L174 164 L174 122 L202 122 L202 150 L228 150 L228 108 L256 108 L256 158 L282 158 L282 138 L310 138 L310 168 L338 168 L338 144 L366 144 L366 172 L400 172 L400 220 L0 220 Z",
  canal:
    "M0 196 L0 150 L15 136 L30 150 L30 196 Z M36 196 L36 142 L42 142 L42 134 L48 134 L48 126 L60 126 L60 134 L66 134 L66 142 L70 142 L70 196 Z M76 196 L76 148 L92 130 L108 148 L108 196 Z M114 196 L114 138 L130 122 L146 138 L146 196 Z M152 196 L152 150 L158 150 L158 142 L164 142 L164 134 L174 134 L174 142 L180 142 L180 150 L186 150 L186 196 Z M192 196 L192 144 L208 130 L224 144 L224 196 Z M230 196 L230 152 L247 140 L264 152 L264 196 Z M270 196 L270 142 L276 142 L276 134 L282 134 L282 126 L294 126 L294 134 L300 134 L300 142 L304 142 L304 196 Z M310 196 L310 146 L327 132 L344 146 L344 196 Z M350 196 L350 154 L366 142 L382 154 L382 196 Z M388 196 L388 148 L396 140 L400 144 L400 196 Z",
}

export default function DestinationArt({
  destination,
  className = "",
}: {
  destination: Destination
  className?: string
}) {
  const id = useId()
  const { sky, land, variant } = destination.art
  return (
    <svg
      viewBox="0 0 400 220"
      preserveAspectRatio="xMidYMid slice"
      className={`block h-full w-full ${className}`}
      role="img"
      aria-label={`Illustration of ${destination.name}`}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sky[0]} />
          <stop offset="100%" stopColor={sky[1]} />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill={`url(#${id}-sky)`} />
      {/* sun with soft halo */}
      <circle cx="308" cy="66" r="44" fill="#ffffff" opacity="0.25" />
      <circle cx="308" cy="66" r="26" fill="#fffbeb" opacity="0.95" />
      {/* distant birds */}
      <g stroke={land} strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.45">
        <path d="M64 72 q6 -7 12 0" />
        <path d="M84 62 q6 -7 12 0" />
      </g>
      <path d={BACK_HILLS} fill={land} opacity="0.3" />
      <path d={FRONT[variant]} fill={land} opacity="0.9" />
      {variant === "coast" && (
        <g fill={land} opacity="0.75">
          {/* small sailboat above the waterline */}
          <path d="M116 172 L116 148 L134 172 Z" />
          <path d="M108 174 q14 8 30 0 Z" />
        </g>
      )}
      {variant === "canal" && (
        // canal water band under the gabled houses
        <g>
          <rect y="196" width="400" height="24" fill={land} opacity="0.5" />
          <path d="M20 206 h36 M120 210 h30 M240 205 h34 M330 210 h28" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
        </g>
      )}
    </svg>
  )
}
