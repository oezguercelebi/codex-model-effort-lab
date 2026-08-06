import { useId, useMemo } from "react"
import type { Destination, SceneryKind } from "../types"

type Palette = Destination["palette"]

/** Small deterministic PRNG so every card looks hand-placed but never changes. */
function makeRandom(seed: string) {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let state = h >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pines(
  random: () => number,
  count: number,
  baseY: number,
  scale: number,
  color: string,
  opacity: number,
  spread = 400,
) {
  return Array.from({ length: count }, (_, index) => {
    const x = (index / count) * spread + random() * (spread / count) - 6
    const h = scale * (0.7 + random() * 0.6)
    const w = h * 0.42
    return (
      <path
        key={`pine-${index}`}
        d={`M${x} ${baseY} L${x + w / 2} ${baseY - h} L${x + w} ${baseY} Z`}
        fill={color}
        opacity={opacity}
      />
    )
  })
}

function windows(
  random: () => number,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
) {
  const cells: React.ReactNode[] = []
  const cols = Math.max(1, Math.floor(width / 9))
  const rows = Math.max(1, Math.floor(height / 12))
  for (let c = 0; c < cols; c += 1) {
    for (let r = 0; r < rows; r += 1) {
      if (random() > 0.55) continue
      cells.push(
        <rect
          key={`w-${x}-${c}-${r}`}
          x={x + 4 + c * 9}
          y={y + 6 + r * 12}
          width={3.2}
          height={4.4}
          rx={0.8}
          fill={color}
          opacity={0.55 + random() * 0.35}
        />,
      )
    }
  }
  return cells
}

function Coast({ p, random }: { p: Palette; random: () => number }) {
  return (
    <>
      <circle cx={302} cy={64} r={27} fill={p.sun} opacity={0.95} />
      <circle cx={302} cy={64} r={44} fill={p.sun} opacity={0.16} />
      <path d="M0 150 C60 120 120 132 190 148 L190 250 L0 250 Z" fill={p.far} opacity={0.55} />
      <path d="M400 158 C340 128 300 138 246 152 L246 250 L400 250 Z" fill={p.far} opacity={0.7} />
      <rect x={0} y={152} width={400} height={98} fill={p.mid} opacity={0.92} />
      {Array.from({ length: 7 }, (_, index) => {
        const y = 168 + index * 11
        const x = random() * 120
        return (
          <path
            key={`wave-${index}`}
            d={`M${x} ${y} q 22 -5 44 0 t 44 0`}
            stroke={p.accent}
            strokeWidth={1.6}
            strokeLinecap="round"
            fill="none"
            opacity={0.35 - index * 0.02}
          />
        )
      })}
      <path d="M0 214 C80 198 150 206 224 226 C300 246 350 238 400 232 L400 250 L0 250 Z" fill={p.near} />
      <path d="M292 148 l0 -30 l22 30 z" fill={p.accent} opacity={0.9} />
      <path d="M288 148 l30 0 l-4 6 l-22 0 z" fill={p.near} opacity={0.8} />
    </>
  )
}

function City({ p, random }: { p: Palette; random: () => number }) {
  const blocks = Array.from({ length: 13 }, (_, index) => {
    const w = 22 + random() * 22
    const h = 44 + random() * 78
    return { w, h, index }
  })
  let cursor = -8
  return (
    <>
      <circle cx={86} cy={62} r={24} fill={p.sun} opacity={0.9} />
      <circle cx={86} cy={62} r={40} fill={p.sun} opacity={0.14} />
      <path d="M0 148 C70 120 140 138 210 130 C280 122 340 140 400 128 L400 250 L0 250 Z" fill={p.far} opacity={0.55} />
      {blocks.map(({ w, h, index }) => {
        const x = cursor
        cursor += w + 4
        const y = 250 - h - 42
        return (
          <g key={`block-${index}`}>
            <rect x={x} y={y} width={w} height={h + 42} fill={p.mid} opacity={0.94} />
            {windows(random, x, y, w, h, p.sun)}
          </g>
        )
      })}
      <path d="M188 130 l14 -46 l14 46 z" fill={p.mid} />
      <rect x={196} y={68} width={2.4} height={18} fill={p.accent} />
      <path d="M258 250 L258 96 l30 0 L288 250 Z" fill={p.mid} />
      <path d="M254 96 l19 -26 l19 26 z" fill={p.accent} opacity={0.92} />
      <path d="M0 214 C90 202 180 220 268 212 C330 206 366 216 400 210 L400 250 L0 250 Z" fill={p.near} />
      {Array.from({ length: 9 }, (_, index) => (
        <circle
          key={`lamp-${index}`}
          cx={16 + index * 46}
          cy={216 + random() * 8}
          r={2}
          fill={p.accent}
          opacity={0.85}
        />
      ))}
    </>
  )
}

function Alpine({ p, random }: { p: Palette; random: () => number }) {
  return (
    <>
      <circle cx={318} cy={54} r={20} fill={p.sun} opacity={0.95} />
      <path d="M-20 190 L70 82 L128 148 L176 104 L250 190 Z" fill={p.far} opacity={0.75} />
      <path d="M40 116 L70 82 L100 116 L84 110 L70 118 L56 110 Z" fill={p.accent} opacity={0.95} />
      <path d="M150 130 L176 104 L204 132 L188 126 L176 134 L164 126 Z" fill={p.accent} opacity={0.9} />
      <path d="M150 210 L242 92 L300 156 L344 118 L430 210 Z" fill={p.mid} opacity={0.95} />
      <path d="M214 126 L242 92 L272 128 L256 120 L242 130 L228 120 Z" fill={p.accent} />
      <path d="M320 140 L344 118 L370 144 L356 138 L344 146 L332 138 Z" fill={p.accent} opacity={0.9} />
      <path d="M0 198 C70 182 130 202 200 194 C280 184 330 202 400 192 L400 250 L0 250 Z" fill={p.near} />
      {pines(random, 16, 212, 30, p.near, 0.92)}
      {pines(random, 11, 236, 40, p.near, 1)}
      <path
        d="M0 236 C60 228 120 240 190 236 C260 232 330 242 400 236 L400 250 L0 250 Z"
        fill={p.near}
      />
    </>
  )
}

function OldTown({ p, random }: { p: Palette; random: () => number }) {
  const houses = Array.from({ length: 11 }, () => ({
    w: 26 + random() * 20,
    h: 46 + random() * 44,
  }))
  let cursor = -10
  return (
    <>
      <circle cx={330} cy={58} r={23} fill={p.sun} opacity={0.92} />
      <circle cx={330} cy={58} r={40} fill={p.sun} opacity={0.14} />
      <path d="M0 152 C60 132 130 146 200 138 C270 130 340 146 400 134 L400 250 L0 250 Z" fill={p.far} opacity={0.5} />
      <g>
        <rect x={150} y={104} width={16} height={106} fill={p.mid} />
        <path d="M146 104 l12 -34 l12 34 z" fill={p.accent} />
        <rect x={172} y={112} width={14} height={98} fill={p.mid} />
        <path d="M168 112 l11 -30 l11 30 z" fill={p.accent} opacity={0.9} />
        <rect x={164} y={132} width={10} height={78} fill={p.mid} opacity={0.85} />
      </g>
      {houses.map(({ w, h }, index) => {
        const x = cursor
        cursor += w + 3
        const y = 250 - h - 40
        return (
          <g key={`house-${index}`}>
            <path d={`M${x} ${y} L${x + w / 2} ${y - 16} L${x + w} ${y} Z`} fill={p.accent} opacity={0.88} />
            <rect x={x} y={y} width={w} height={h + 40} fill={p.mid} opacity={0.95} />
            {windows(random, x, y, w, h, p.sun)}
          </g>
        )
      })}
      <path d="M0 206 L48 178 L96 206 L144 180 L192 208 L240 182 L288 208 L336 184 L400 210 L400 250 L0 250 Z" fill={p.near} />
    </>
  )
}

function Lake({ p, random }: { p: Palette; random: () => number }) {
  return (
    <>
      <circle cx={300} cy={54} r={22} fill={p.sun} opacity={0.95} />
      <path d="M-10 150 L60 78 L130 150 Z" fill={p.far} opacity={0.75} />
      <path d="M90 152 L180 66 L280 152 Z" fill={p.mid} opacity={0.85} />
      <path d="M154 92 L180 66 L208 94 L192 88 L180 96 L168 88 Z" fill={p.accent} opacity={0.85} />
      <path d="M240 154 L320 96 L410 154 Z" fill={p.far} opacity={0.7} />
      <path d="M0 150 C90 138 180 156 270 148 C330 142 360 152 400 148 L400 168 L0 168 Z" fill={p.near} opacity={0.5} />
      <rect x={0} y={162} width={400} height={88} fill={p.near} opacity={0.9} />
      {Array.from({ length: 6 }, (_, index) => (
        <path
          key={`ripple-${index}`}
          d={`M${20 + random() * 60 + index * 40} ${182 + index * 11} q 20 -4 40 0`}
          stroke={p.accent}
          strokeWidth={1.5}
          strokeLinecap="round"
          fill="none"
          opacity={0.4 - index * 0.04}
        />
      ))}
      <g>
        <ellipse cx={196} cy={176} rx={44} ry={11} fill={p.mid} />
        <rect x={188} y={136} width={13} height={38} fill={p.accent} />
        <path d="M185 136 l9.5 -22 l9.5 22 z" fill={p.accent} opacity={0.8} />
        <rect x={202} y={152} width={20} height={22} fill={p.accent} opacity={0.9} />
        {pines(random, 5, 174, 20, p.mid, 0.95, 60).map((pine, index) => (
          <g key={`isle-${index}`} transform="translate(156 0)">
            {pine}
          </g>
        ))}
        <ellipse cx={196} cy={188} rx={40} ry={6} fill={p.accent} opacity={0.16} />
      </g>
      <path d="M0 224 C60 212 130 226 200 220 C280 214 340 226 400 220 L400 250 L0 250 Z" fill={p.mid} opacity={0.9} />
    </>
  )
}

function Cliffs({ p, random }: { p: Palette; random: () => number }) {
  return (
    <>
      <circle cx={92} cy={58} r={22} fill={p.sun} opacity={0.9} />
      {Array.from({ length: 3 }, (_, index) => (
        <path
          key={`gull-${index}`}
          d={`M${210 + index * 34} ${58 + index * 16} q 7 -6 13 0 q 6 -6 13 0`}
          stroke={p.mid}
          strokeWidth={1.6}
          fill="none"
          strokeLinecap="round"
          opacity={0.6}
        />
      ))}
      <rect x={0} y={140} width={400} height={110} fill={p.mid} opacity={0.85} />
      {Array.from({ length: 5 }, (_, index) => (
        <path
          key={`swell-${index}`}
          d={`M${random() * 90} ${158 + index * 13} q 26 -5 52 0 t 52 0`}
          stroke={p.near}
          strokeWidth={1.6}
          strokeLinecap="round"
          fill="none"
          opacity={0.4}
        />
      ))}
      <path d="M228 250 L228 128 L268 112 L306 130 L332 108 L400 124 L400 250 Z" fill={p.near} />
      <path d="M228 128 L268 112 L306 130 L332 108 L400 124 L400 140 C350 128 300 148 262 138 C246 134 236 134 228 138 Z" fill={p.accent} opacity={0.9} />
      <path d="M0 250 L0 158 L44 142 L86 162 L120 148 L146 168 L146 250 Z" fill={p.near} opacity={0.95} />
      <path d="M0 158 L44 142 L86 162 L120 148 L146 168 L146 178 C110 164 70 176 42 166 C26 160 12 160 0 166 Z" fill={p.accent} opacity={0.85} />
      <path d="M120 250 C160 230 200 232 250 244 L250 250 Z" fill={p.near} opacity={0.6} />
      <path d="M140 250 C180 236 220 238 262 250 Z" fill={p.accent} opacity={0.18} />
    </>
  )
}

function Forest({ p, random }: { p: Palette; random: () => number }) {
  return (
    <>
      <circle cx={306} cy={52} r={21} fill={p.sun} opacity={0.9} />
      <path d="M0 154 C70 128 140 146 210 134 C280 122 340 142 400 130 L400 250 L0 250 Z" fill={p.far} opacity={0.5} />
      <g opacity={0.95}>
        <path d="M96 200 L96 108 q 12 -12 26 0 L122 200 Z" fill={p.accent} />
        <path d="M136 200 L136 126 q 9 -10 20 0 L156 200 Z" fill={p.accent} opacity={0.85} />
        <path d="M246 200 L246 96 q 14 -14 30 0 L276 200 Z" fill={p.accent} opacity={0.92} />
        <path d="M286 200 L286 132 q 10 -10 22 0 L308 200 Z" fill={p.accent} opacity={0.8} />
        <path d="M96 132 q 14 6 26 0" stroke={p.mid} strokeWidth={1.4} fill="none" opacity={0.5} />
        <path d="M246 126 q 16 6 30 0" stroke={p.mid} strokeWidth={1.4} fill="none" opacity={0.5} />
      </g>
      {pines(random, 15, 202, 44, p.mid, 0.85)}
      <path d="M0 196 C80 186 160 202 240 196 C310 190 350 200 400 194 L400 250 L0 250 Z" fill={p.mid} opacity={0.55} />
      {pines(random, 12, 232, 56, p.near, 0.95)}
      <path d="M0 234 C70 226 140 240 210 234 C290 227 340 238 400 232 L400 250 L0 250 Z" fill={p.near} />
    </>
  )
}

const SCENES: Record<
  SceneryKind,
  (props: { p: Palette; random: () => number }) => React.ReactElement
> = {
  coast: Coast,
  city: City,
  alpine: Alpine,
  oldtown: OldTown,
  lake: Lake,
  cliffs: Cliffs,
  forest: Forest,
}

interface SceneryProps {
  kind: SceneryKind
  palette: Palette
  seed: string
  className?: string
}

export function Scenery({ kind, palette, seed, className }: SceneryProps) {
  const rawId = useId()
  const gradientId = `sky-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`
  const Scene = SCENES[kind]
  const scene = useMemo(() => <Scene p={palette} random={makeRandom(seed + kind)} />, [
    Scene,
    palette,
    seed,
    kind,
  ])

  return (
    <svg
      viewBox="0 0 400 250"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.skyTop} />
          <stop offset="100%" stopColor={palette.skyBottom} />
        </linearGradient>
      </defs>
      <rect width={400} height={250} fill={`url(#${gradientId})`} />
      {scene}
    </svg>
  )
}
