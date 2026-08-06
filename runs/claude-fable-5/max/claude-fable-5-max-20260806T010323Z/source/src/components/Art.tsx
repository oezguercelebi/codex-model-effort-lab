import { useId } from "react"
import type { DestinationArt as ArtSpec } from "../types"

/**
 * Flat, travel-poster style scene rendered from a small spec — no external
 * images anywhere in the app.
 */
export function DestinationArt({ art, className }: { art: ArtSpec; className?: string }) {
  const uid = useId()
  const skyId = `sky-${uid}`
  return (
    <svg
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={art.skyFrom} />
          <stop offset="100%" stopColor={art.skyTo} />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill={`url(#${skyId})`} />
      {art.variant === "coast" && <Coast sun={art.sun} land={art.land} />}
      {art.variant === "city" && <City sun={art.sun} land={art.land} />}
      {art.variant === "mountains" && <Mountains sun={art.sun} land={art.land} />}
      {art.variant === "harbor" && <Harbor sun={art.sun} land={art.land} />}
    </svg>
  )
}

function Sun({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: string }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r * 1.55} fill={color} opacity="0.28" />
      <circle cx={cx} cy={cy} r={r} fill={color} opacity="0.95" />
    </>
  )
}

function Waves({ land }: { land: string }) {
  return (
    <>
      <path
        d="M0,130 Q50,120 100,130 T200,130 T300,130 T400,130 V200 H0 Z"
        fill={land}
        opacity="0.3"
      />
      <path
        d="M0,154 Q50,144 100,154 T200,154 T300,154 T400,154 V200 H0 Z"
        fill={land}
        opacity="0.5"
      />
      <path
        d="M0,176 Q50,167 100,176 T200,176 T300,176 T400,176 V200 H0 Z"
        fill={land}
        opacity="0.9"
      />
    </>
  )
}

function Coast({ sun, land }: { sun: string; land: string }) {
  return (
    <>
      <Sun cx={300} cy={82} r={38} color={sun} />
      <path d="M0,132 L70,96 L150,134 Z" fill={land} opacity="0.25" />
      <Waves land={land} />
    </>
  )
}

function City({ sun, land }: { sun: string; land: string }) {
  return (
    <>
      <Sun cx={86} cy={62} r={30} color={sun} />
      <g fill={land} opacity="0.35">
        <rect x="0" y="108" width="34" height="92" />
        <rect x="40" y="90" width="26" height="110" />
        <rect x="74" y="118" width="30" height="82" />
        <rect x="112" y="82" width="22" height="118" />
        <rect x="142" y="110" width="36" height="90" />
        <rect x="186" y="94" width="24" height="106" />
        <polygon points="222,118 234,64 246,118" />
        <rect x="222" y="112" width="24" height="88" />
        <rect x="254" y="100" width="30" height="100" />
        <rect x="292" y="86" width="22" height="114" />
        <rect x="322" y="112" width="40" height="88" />
        <rect x="370" y="96" width="30" height="104" />
      </g>
      <g fill={land} opacity="0.9">
        <rect x="8" y="140" width="42" height="60" />
        <rect x="58" y="124" width="30" height="76" />
        <rect x="96" y="148" width="44" height="52" />
        <rect x="148" y="130" width="26" height="70" />
        <rect x="182" y="150" width="40" height="50" />
        <polygon points="252,146 264,92 276,146" />
        <rect x="230" y="126" width="34" height="74" />
        <rect x="272" y="144" width="40" height="56" />
        <rect x="318" y="120" width="28" height="80" />
        <rect x="352" y="148" width="48" height="52" />
      </g>
    </>
  )
}

function Mountains({ sun, land }: { sun: string; land: string }) {
  return (
    <>
      <Sun cx={318} cy={56} r={28} color={sun} />
      <polygon
        points="0,150 60,88 110,140 170,68 230,135 290,94 340,140 400,108 400,200 0,200"
        fill={land}
        opacity="0.4"
      />
      <polygon
        points="0,182 70,118 130,168 200,102 260,160 330,116 400,172 400,200 0,200"
        fill={land}
        opacity="0.9"
      />
      <polygon points="189,113 200,102 211,113 205,110 200,114 195,110" fill={sun} opacity="0.85" />
      <polygon points="60,128 70,118 80,128 74,126 70,130 66,126" fill={sun} opacity="0.85" />
    </>
  )
}

function Harbor({ sun, land }: { sun: string; land: string }) {
  return (
    <>
      <Sun cx={210} cy={62} r={30} color={sun} />
      <g fill={land} opacity="0.5">
        <polygon points="0,104 13,88 26,104" />
        <rect x="0" y="104" width="26" height="96" />
        <rect x="32" y="92" width="20" height="108" />
        <polygon points="58,110 70,94 82,110" />
        <rect x="58" y="110" width="24" height="90" />
        <rect x="88" y="98" width="18" height="102" />
        <rect x="352" y="102" width="22" height="98" />
        <polygon points="380,110 390,96 400,110" />
        <rect x="380" y="110" width="20" height="90" />
      </g>
      <path
        d="M0,142 Q50,134 100,142 T200,142 T300,142 T400,142 V200 H0 Z"
        fill={land}
        opacity="0.35"
      />
      <rect x="268" y="104" width="3" height="54" fill={land} opacity="0.95" />
      <polygon points="274,110 274,152 304,152" fill={sun} opacity="0.95" />
      <polygon points="265,120 265,152 244,152" fill={sun} opacity="0.8" />
      <path d="M238,158 h70 l-10,14 h-50 Z" fill={land} opacity="0.95" />
      <path
        d="M0,176 Q50,168 100,176 T200,176 T300,176 T400,176 V200 H0 Z"
        fill={land}
        opacity="0.9"
      />
    </>
  )
}
