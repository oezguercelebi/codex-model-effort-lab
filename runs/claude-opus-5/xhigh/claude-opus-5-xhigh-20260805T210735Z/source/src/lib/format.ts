export function currency(value: number): string {
  return `$${Math.round(value).toLocaleString("en-US")}`
}

export function currencySigned(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : ""
  return `${sign}$${Math.abs(Math.round(value)).toLocaleString("en-US")}`
}

export function minutesToLabel(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function minutesToShort(minutes: number): string {
  const h = minutes / 60
  return h >= 10 ? `${Math.round(h)}h` : `${(Math.round(h * 10) / 10).toString().replace(/\.0$/, "")}h`
}

export function pluralize(count: number, one: string, many = `${one}s`): string {
  return `${count} ${count === 1 ? one : many}`
}
