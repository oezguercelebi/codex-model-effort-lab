import { useId, useMemo, type ReactElement } from "react"
import type { ArtPalette, Destination, Scene } from "../types"

/** Small deterministic PRNG so every card's scene is stable across renders. */
function makeRandom(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return (h >>> 0) / 4294967296
  }
}

type SceneProps = { p: ArtPalette; seed: string }

function Mountains({ p }: SceneProps) {
  return (
    <>
      <circle cx="288" cy="80" r="27" fill={p.sun} opacity="0.92" />
      <circle cx="288" cy="80" r="42" fill={p.sun} opacity="0.16" />
      <path
        d="M0,150 L48,114 L92,142 L140,102 L188,146 L236,110 L288,150 L336,122 L400,152 L400,240 L0,240 Z"
        fill={p.far}
        opacity="0.85"
      />
      <path d="M140,102 L124,113 L140,120 L156,113 Z" fill="#ffffff" opacity="0.55" />
      <path d="M236,110 L222,120 L236,126 L250,120 Z" fill="#ffffff" opacity="0.45" />
      <path
        d="M0,176 L56,144 L108,178 L164,138 L214,180 L268,146 L322,182 L400,154 L400,240 L0,240 Z"
        fill={p.mid}
        opacity="0.92"
      />
      <path
        d="M0,206 L64,183 L124,210 L192,181 L252,212 L318,187 L400,211 L400,240 L0,240 Z"
        fill={p.near}
      />
      <path
        d="M-10,170 q100,-9 200,1 q100,10 220,-3"
        stroke="#ffffff"
        strokeOpacity="0.24"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
    </>
  )
}

function Forest({ p, seed }: SceneProps) {
  const trees = useMemo(() => {
    const rand = makeRandom(seed)
    return Array.from({ length: 26 }, (_, i) => {
      const x = 6 + i * 15.6 + rand() * 8
      const h = 22 + rand() * 20
      const w = 6 + rand() * 3
      const y = 190 + rand() * 10
      return { x, h, w, y }
    })
  }, [seed])
  return (
    <>
      <circle cx="300" cy="72" r="24" fill={p.sun} opacity="0.9" />
      <circle cx="300" cy="72" r="40" fill={p.sun} opacity="0.14" />
      <path
        d="M0,158 C60,130 112,168 172,148 C232,128 282,166 342,144 C368,134 388,146 400,140 L400,240 L0,240 Z"
        fill={p.far}
        opacity="0.8"
      />
      <path
        d="M0,188 C70,164 122,198 192,181 C252,166 302,194 362,176 C382,170 393,176 400,174 L400,240 L0,240 Z"
        fill={p.mid}
        opacity="0.9"
      />
      {trees.map((t, i) => (
        <g key={i}>
          <path
            d={`M${t.x},${t.y} l${-t.w},0 l${t.w},${-t.h} l${t.w},${t.h} Z`}
            fill={p.near}
            opacity="0.9"
          />
          <path
            d={`M${t.x},${t.y - t.h * 0.45} l${-t.w * 0.78},0 l${t.w * 0.78},${-t.h * 0.4} l${t.w * 0.78},${t.h * 0.4} Z`}
            fill={p.near}
          />
        </g>
      ))}
      <path
        d="M0,214 C80,198 142,222 222,208 C292,196 342,218 400,206 L400,240 L0,240 Z"
        fill={p.near}
      />
    </>
  )
}

function City({ p, seed }: SceneProps) {
  const buildings = useMemo(() => {
    const rand = makeRandom(seed)
    const out: { x: number; w: number; h: number; windows: boolean }[] = []
    let x = -8
    while (x < 404) {
      const w = 18 + rand() * 22
      const h = 44 + rand() * 78
      out.push({ x, w, h, windows: rand() > 0.25 })
      x += w + 4 + rand() * 6
    }
    return out
  }, [seed])
  const far = useMemo(() => {
    const rand = makeRandom(`${seed}-far`)
    return Array.from({ length: 16 }, (_, i) => ({
      x: i * 26 - 6,
      w: 16 + rand() * 12,
      h: 30 + rand() * 52,
    }))
  }, [seed])
  return (
    <>
      <circle cx="316" cy="66" r="23" fill={p.sun} opacity="0.9" />
      <circle cx="316" cy="66" r="38" fill={p.sun} opacity="0.14" />
      {far.map((b, i) => (
        <rect key={i} x={b.x} y={168 - b.h} width={b.w} height={b.h + 80} fill={p.far} opacity="0.6" />
      ))}
      {buildings.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={202 - b.h} width={b.w} height={b.h + 40} fill={p.mid} />
          {b.windows &&
            Array.from({ length: Math.max(1, Math.floor(b.h / 16)) }).map((_, row) =>
              Array.from({ length: Math.max(1, Math.floor(b.w / 11)) }).map((_, col) => (
                <rect
                  key={`${row}-${col}`}
                  x={b.x + 5 + col * 11}
                  y={208 - b.h + row * 16}
                  width="4"
                  height="6"
                  rx="1"
                  fill={p.sun}
                  opacity={(row * 7 + col * 3 + i) % 4 === 0 ? 0.75 : 0.28}
                />
              )),
            )}
        </g>
      ))}
      <path d="M0,214 L400,206 L400,240 L0,240 Z" fill={p.near} />
    </>
  )
}

function Coast({ p, seed }: SceneProps) {
  const glitter = useMemo(() => {
    const rand = makeRandom(seed)
    return Array.from({ length: 7 }, (_, i) => ({
      y: 150 + i * 11,
      w: 46 - i * 4 + rand() * 18,
    }))
  }, [seed])
  return (
    <>
      <circle cx="262" cy="118" r="30" fill={p.sun} opacity="0.95" />
      <circle cx="262" cy="118" r="50" fill={p.sun} opacity="0.15" />
      <rect x="0" y="140" width="400" height="100" fill={p.water} />
      {glitter.map((g, i) => (
        <rect
          key={i}
          x={262 - g.w / 2}
          y={g.y}
          width={g.w}
          height="3"
          rx="1.5"
          fill={p.sun}
          opacity={0.55 - i * 0.05}
        />
      ))}
      <path d="M20,166 q26,-6 52,0" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="2.5" fill="none" />
      <path d="M300,178 q30,-7 60,0" stroke="#ffffff" strokeOpacity="0.26" strokeWidth="2.5" fill="none" />
      <path d="M96,192 q34,-8 68,0" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="2.5" fill="none" />
      <path d="M0,146 C34,136 66,146 92,166 L104,240 L0,240 Z" fill={p.mid} opacity="0.95" />
      <path
        d="M0,212 C64,198 128,216 194,208 C268,199 336,218 400,206 L400,240 L0,240 Z"
        fill={p.near}
      />
      <g stroke={p.near} strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round">
        <path d="M132,64 q7,-6 14,0 q7,6 14,0" />
        <path d="M170,84 q5,-5 10,0 q5,5 10,0" />
      </g>
    </>
  )
}

function Harbor({ p, seed }: SceneProps) {
  const boats = useMemo(() => {
    const rand = makeRandom(seed)
    return [
      { x: 78, s: 1, y: 166 },
      { x: 186, s: 0.72 + rand() * 0.1, y: 156 },
      { x: 268, s: 0.86, y: 176 },
    ]
  }, [seed])
  return (
    <>
      <circle cx="322" cy="74" r="25" fill={p.sun} opacity="0.92" />
      <circle cx="322" cy="74" r="42" fill={p.sun} opacity="0.14" />
      <path d="M0,138 L88,132 L166,140 L262,130 L400,138 L400,150 L0,150 Z" fill={p.far} opacity="0.75" />
      <rect x="0" y="148" width="400" height="92" fill={p.water} />
      {boats.map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y}) scale(${b.s})`}>
          <path d="M-24,0 L24,0 L16,10 L-16,10 Z" fill={p.near} />
          <path d="M0,-2 L0,-40 L22,-4 Z" fill="#ffffff" opacity="0.92" />
          <path d="M-3,-2 L-3,-32 L-20,-4 Z" fill="#ffffff" opacity="0.72" />
        </g>
      ))}
      <g>
        <path d="M350,214 L358,116 L374,116 L382,214 Z" fill="#ffffff" opacity="0.95" />
        <rect x="357" y="128" width="18" height="9" fill={p.near} opacity="0.8" />
        <rect x="356" y="104" width="20" height="12" rx="2" fill={p.near} />
        <path d="M376,110 L400,102 L400,118 Z" fill={p.sun} opacity="0.5" />
      </g>
      <path d="M0,206 C70,196 150,212 232,204 C304,197 348,210 400,204 L400,240 L0,240 Z" fill={p.near} />
      <g fill={p.near}>
        <rect x="26" y="192" width="7" height="30" rx="2" />
        <rect x="52" y="198" width="7" height="26" rx="2" />
        <rect x="78" y="194" width="7" height="30" rx="2" />
      </g>
    </>
  )
}

const SCENES: Record<Scene, (props: SceneProps) => ReactElement> = {
  mountains: Mountains,
  forest: Forest,
  city: City,
  coast: Coast,
  harbor: Harbor,
}

export function DestinationArt({
  destination,
  className = "",
}: {
  destination: Destination
  className?: string
}) {
  const rawId = useId()
  const uid = rawId.replace(/[^a-zA-Z0-9-]/g, "")
  const p = destination.palette
  const SceneComponent = SCENES[destination.scene]

  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={`Stylised illustration of ${destination.name}`}
    >
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.skyTop} />
          <stop offset="100%" stopColor={p.skyBottom} />
        </linearGradient>
        <linearGradient id={`${uid}-veil`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="45%" stopColor="#1b1712" stopOpacity="0" />
          <stop offset="100%" stopColor="#1b1712" stopOpacity="0.42" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill={`url(#${uid}-sky)`} />
      <SceneComponent p={p} seed={destination.id} />
      <rect width="400" height="240" fill={`url(#${uid}-veil)`} />
    </svg>
  )
}
