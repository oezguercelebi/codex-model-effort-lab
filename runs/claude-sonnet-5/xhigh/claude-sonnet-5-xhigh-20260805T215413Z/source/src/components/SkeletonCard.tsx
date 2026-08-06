export function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="h-36 w-full bg-stone-200" />
      <div className="space-y-3 p-4">
        <div className="h-3.5 w-2/3 rounded bg-stone-200" />
        <div className="h-3 w-1/2 rounded bg-stone-100" />
        <div className="flex gap-1.5">
          <div className="h-5 w-16 rounded-full bg-stone-100" />
          <div className="h-5 w-20 rounded-full bg-stone-100" />
        </div>
        <div className="h-8 w-full rounded bg-stone-100" />
      </div>
    </div>
  )
}
