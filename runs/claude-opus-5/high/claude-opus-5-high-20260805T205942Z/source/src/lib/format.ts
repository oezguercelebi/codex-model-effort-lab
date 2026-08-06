const euro = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
})

export function money(value: number): string {
  return euro.format(Math.round(value))
}

/** 4.3 -> "4h 20m", 2 -> "2h", 0.75 -> "45m" */
export function duration(hours: number): string {
  const total = Math.round(hours * 60)
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function percent(value: number): string {
  return `${Math.round(value * 100)}%`
}

export function plural(count: number, one: string, many = `${one}s`): string {
  return `${count} ${count === 1 ? one : many}`
}

export function initialsOf(name: string): string {
  return name.slice(0, 2).toUpperCase()
}

/** Deterministic avatar colours that stay legible in both themes. */
export function avatarStyle(hue: number) {
  return {
    background: `oklch(0.74 0.115 ${hue})`,
    color: `oklch(0.28 0.06 ${hue})`,
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
