import { useId, type ReactNode } from "react"
import type { Destination, SceneId } from "../types"

const W = 400
const H = 240

/** Deterministic PRNG so every card draws the same scene on every render. */
function makeRng(seed: string) {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = h >>> 0
  return () => {
    a += 0x6d2b79f5
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function ridge(baseY: number, amplitude: number, peaks: number, rand: () => number) {
  const step = W / peaks
  let d = `M -10 ${H} L -10 ${baseY}`
  for (let i = 0; i <= peaks; i++) {
    const x = i * step
    const peak = baseY - amplitude * (0.45 + rand() * 0.55)
    d += ` L ${x - step / 2} ${peak} L ${x} ${baseY - amplitude * 0.15 * rand()}`
  }
  return `${d} L ${W + 10} ${baseY} L ${W + 10} ${H} Z`
}

function tree(x: number, y: number, size: number, fill: string, key: string) {
  return (
    <path
      key={key}
      d={`M ${x} ${y - size} L ${x + size * 0.42} ${y} L ${x - size * 0.42} ${y} Z`}
      fill={fill}
    />
  )
}

function windows(
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  rand: () => number,
  key: string,
) {
  const cols = Math.max(1, Math.floor(width / 9))
  const rows = Math.max(1, Math.floor(height / 12))
  const cells: ReactNode[] = []
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      if (rand() > 0.55) continue
      cells.push(
        <rect
          key={`${key}-${c}-${r}`}
          x={x + 4 + c * 9}
          y={y + 7 + r * 12}
          width={3.4}
          height={5}
          rx={0.8}
          fill={fill}
          opacity={0.75}
        />,
      )
    }
  }
  return cells
}

function scene(id: SceneId, p: Destination["palette"], rand: () => number): ReactNode {
  const [, , far, mid, near, accent] = p

  switch (id) {
    case "mountains": {
      const trees: ReactNode[] = []
      for (let i = 0; i < 22; i++) {
        const x = rand() * W
        trees.push(tree(x, 200 + rand() * 26, 10 + rand() * 12, near, `t${i}`))
      }
      return (
        <g>
          <circle cx={300} cy={66} r={26} fill={accent} opacity={0.9} />
          <path d={ridge(150, 74, 4, rand)} fill={far} opacity={0.85} />
          <path d={ridge(176, 56, 6, rand)} fill={mid} />
          <path d={ridge(206, 34, 8, rand)} fill={near} opacity={0.94} />
          <rect x={-10} y={206} width={W + 20} height={H} fill={near} />
          {trees}
        </g>
      )
    }

    case "lake": {
      const trees: ReactNode[] = []
      for (let i = 0; i < 14; i++) {
        trees.push(tree(rand() * W, 158 + rand() * 6, 8 + rand() * 10, near, `lt${i}`))
      }
      return (
        <g>
          <circle cx={318} cy={58} r={20} fill={accent} opacity={0.85} />
          <path d={ridge(132, 66, 4, rand)} fill={far} opacity={0.8} />
          <path d={ridge(158, 40, 6, rand)} fill={mid} />
          {trees}
          <rect x={-10} y={162} width={W + 20} height={H} fill={near} opacity={0.92} />
          <g>
            <ellipse cx={196} cy={190} rx={34} ry={9} fill={mid} />
            <rect x={188} y={166} width={16} height={22} rx={2} fill={far} />
            <path d="M 196 148 L 205 168 L 187 168 Z" fill={accent} />
            <ellipse cx={196} cy={206} rx={30} ry={7} fill={far} opacity={0.32} />
          </g>
          {[172, 186, 202, 218].map((y, i) => (
            <rect
              key={`w${i}`}
              x={20 + i * 26}
              y={y}
              width={80 + i * 24}
              height={2}
              rx={1}
              fill="#fff"
              opacity={0.16}
            />
          ))}
        </g>
      )
    }

    case "coast": {
      return (
        <g>
          <circle cx={272} cy={104} r={30} fill={accent} opacity={0.92} />
          <rect x={-10} y={132} width={W + 20} height={H} fill={mid} />
          {[142, 156, 172, 190, 210].map((y, i) => (
            <rect
              key={`sw${i}`}
              x={-10 + ((i * 47) % 60)}
              y={y}
              width={W}
              height={2.2}
              rx={1}
              fill="#fff"
              opacity={0.13}
            />
          ))}
          <path
            d={`M -10 132 Q 60 96 130 132 L 130 148 L -10 148 Z`}
            fill={far}
            opacity={0.9}
          />
          <path d={`M -10 200 Q 200 176 ${W + 10} 206 L ${W + 10} ${H} L -10 ${H} Z`} fill={accent} opacity={0.55} />
          <path d={`M -10 214 Q 200 194 ${W + 10} 220 L ${W + 10} ${H} L -10 ${H} Z`} fill={near} opacity={0.75} />
          <path d="M 92 62 q 8 -7 16 0 q 8 -7 16 0" stroke={near} strokeWidth={2} fill="none" opacity={0.5} />
          <path d="M 132 44 q 6 -5 12 0 q 6 -5 12 0" stroke={near} strokeWidth={1.6} fill="none" opacity={0.4} />
        </g>
      )
    }

    case "harbor": {
      const cranes = [70, 150, 236].map((x, i) => (
        <g key={`c${i}`} stroke={near} strokeWidth={3.4} fill="none" strokeLinecap="round">
          <path d={`M ${x} 168 L ${x} 92`} />
          <path d={`M ${x - 26} 100 L ${x + 46} 92`} />
          <path d={`M ${x} 92 L ${x + 22} 112`} />
          <path d={`M ${x + 40} 94 L ${x + 40} 116`} strokeWidth={2} />
        </g>
      ))
      return (
        <g>
          <circle cx={330} cy={70} r={22} fill={accent} opacity={0.85} />
          <rect x={-10} y={122} width={W + 20} height={54} fill={far} opacity={0.55} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={`wh${i}`}
              x={-6 + i * 84}
              y={128 + (i % 2) * 10}
              width={72}
              height={48}
              rx={3}
              fill={mid}
            />
          ))}
          {cranes}
          <rect x={-10} y={172} width={W + 20} height={H} fill={near} />
          <g>
            <path d="M 208 176 L 372 176 L 356 206 L 224 206 Z" fill={mid} />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect
                key={`ct${i}`}
                x={222 + i * 24}
                y={162}
                width={20}
                height={13}
                rx={1.5}
                fill={i % 2 ? accent : far}
                opacity={0.95}
              />
            ))}
          </g>
          {[186, 198, 214, 228].map((y, i) => (
            <rect key={`hw${i}`} x={0} y={y} width={140 + i * 20} height={2} rx={1} fill="#fff" opacity={0.12} />
          ))}
        </g>
      )
    }

    case "canal": {
      const houses: ReactNode[] = []
      let x = -6
      let i = 0
      while (x < W + 10) {
        const width = 26 + Math.floor(rand() * 16)
        const height = 70 + Math.floor(rand() * 52)
        const y = 168 - height
        const fill = i % 2 === 0 ? mid : near
        houses.push(
          <g key={`h${i}`}>
            <rect x={x} y={y} width={width} height={height} rx={1.5} fill={fill} />
            <path d={`M ${x - 2} ${y} L ${x + width / 2} ${y - 13} L ${x + width + 2} ${y} Z`} fill={far} />
            {windows(x, y, width, height, accent, rand, `hw${i}`)}
          </g>,
        )
        x += width + 3
        i++
      }
      return (
        <g>
          <circle cx={58} cy={54} r={19} fill={accent} opacity={0.7} />
          {houses}
          <rect x={-10} y={168} width={W + 20} height={H} fill={far} opacity={0.85} />
          <path
            d="M 120 178 q 60 -34 120 0"
            stroke={near}
            strokeWidth={7}
            fill="none"
            strokeLinecap="round"
          />
          {[188, 200, 214, 228].map((y, k) => (
            <rect key={`cw${k}`} x={10 + k * 30} y={y} width={220 - k * 20} height={2.4} rx={1.2} fill="#fff" opacity={0.14} />
          ))}
        </g>
      )
    }

    case "oldtown": {
      const roofs: ReactNode[] = []
      let x = -8
      let i = 0
      while (x < W + 10) {
        const width = 34 + Math.floor(rand() * 22)
        const height = 46 + Math.floor(rand() * 46)
        const y = 190 - height
        roofs.push(
          <g key={`r${i}`}>
            <rect x={x} y={y} width={width} height={height} rx={1.5} fill={i % 2 ? near : mid} />
            <path d={`M ${x - 3} ${y} L ${x + width / 2} ${y - 15} L ${x + width + 3} ${y} Z`} fill={far} />
            {windows(x, y, width, height, accent, rand, `ow${i}`)}
          </g>,
        )
        x += width + 4
        i++
      }
      const spire = (cx: number, base: number, h: number) => (
        <g key={`s${cx}`}>
          <rect x={cx - 11} y={base - h} width={22} height={h} rx={2} fill={mid} />
          <path d={`M ${cx - 14} ${base - h} L ${cx} ${base - h - 38} L ${cx + 14} ${base - h} Z`} fill={far} />
          <rect x={cx - 3} y={base - h + 16} width={6} height={9} rx={1} fill={accent} opacity={0.85} />
        </g>
      )
      return (
        <g>
          <circle cx={214} cy={62} r={30} fill={accent} opacity={0.55} />
          {spire(96, 190, 96)}
          {spire(134, 190, 84)}
          {spire(300, 190, 90)}
          {roofs}
          <rect x={-10} y={188} width={W + 20} height={H} fill={near} />
        </g>
      )
    }

    case "city":
    default: {
      const towers: ReactNode[] = []
      let x = -8
      let i = 0
      while (x < W + 10) {
        const width = 30 + Math.floor(rand() * 26)
        const height = 52 + Math.floor(rand() * 92)
        const y = 196 - height
        towers.push(
          <g key={`b${i}`}>
            <rect x={x} y={y} width={width} height={height} rx={2} fill={i % 3 === 0 ? far : i % 3 === 1 ? mid : near} />
            {rand() > 0.6 && <rect x={x + width / 2 - 1.4} y={y - 22} width={2.8} height={22} fill={near} />}
            {windows(x, y, width, height, accent, rand, `cw${i}`)}
          </g>,
        )
        x += width + 4
        i++
      }
      return (
        <g>
          <circle cx={70} cy={58} r={24} fill={accent} opacity={0.7} />
          {towers}
          <rect x={-10} y={194} width={W + 20} height={H} fill={near} />
        </g>
      )
    }
  }
}

export function DestinationArt({
  destination,
  className,
  rounded = true,
}: {
  destination: Destination
  className?: string
  rounded?: boolean
}) {
  const gradientId = useId()
  const rand = makeRng(destination.id)
  const [skyTop, skyBottom] = destination.palette

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={`Stylised illustration of ${destination.name}`}
      style={rounded ? undefined : { borderRadius: 0 }}
    >
      <defs>
        <linearGradient id={`sky-${gradientId}`} x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0%" stopColor={skyTop} />
          <stop offset="100%" stopColor={skyBottom} />
        </linearGradient>
        <linearGradient id={`veil-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="45%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.34" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#sky-${gradientId})`} />
      {scene(destination.scene, destination.palette, rand)}
      <rect width={W} height={H} fill={`url(#veil-${gradientId})`} />
    </svg>
  )
}
