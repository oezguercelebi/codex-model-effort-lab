export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`
}

export function formatBudgetRange(low: number, high: number): string {
  return `${formatCurrency(low)}–${formatCurrency(high)}`
}

export function formatDriveTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins} min`
  if (mins === 0) return `${hours} hr`
  return `${hours} hr ${mins} min`
}

export function formatDaysUntil(target: Date, from: Date = new Date()): number {
  const msPerDay = 1000 * 60 * 60 * 24
  const diff = target.getTime() - from.getTime()
  return Math.max(0, Math.ceil(diff / msPerDay))
}
