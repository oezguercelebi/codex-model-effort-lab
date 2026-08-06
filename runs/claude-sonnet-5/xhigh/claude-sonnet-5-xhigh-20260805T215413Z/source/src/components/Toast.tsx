import { CheckCircle2 } from "lucide-react"

export function Toast({ message }: { message: string }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-stone-900 px-4 py-3 text-sm font-medium text-white shadow-lg animate-[toast-in_0.2s_ease-out]">
        <CheckCircle2 className="size-4 text-emerald-400" />
        {message}
      </div>
    </div>
  )
}
