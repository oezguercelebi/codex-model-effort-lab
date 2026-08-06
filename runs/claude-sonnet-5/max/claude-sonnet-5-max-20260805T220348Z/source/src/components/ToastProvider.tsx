import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react"
import { CircleCheck, Info } from "lucide-react"
import { cn } from "../utils/format"

interface ToastEntry {
  id: number
  message: string
  tone: "default" | "success"
}

interface ToastContextValue {
  showToast: (message: string, tone?: ToastEntry["tone"]) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([])
  const counter = useRef(0)

  const showToast = useCallback((message: string, tone: ToastEntry["tone"] = "default") => {
    counter.current += 1
    const id = counter.current
    setToasts((current) => [...current, { id, message, tone }].slice(-3))
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 3200)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-6"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "animate-toast-in pointer-events-auto flex max-w-sm items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium shadow-lg backdrop-blur",
              toast.tone === "success"
                ? "border-emerald-800/40 bg-emerald-900/95 text-emerald-50"
                : "border-stone-700/40 bg-stone-900/95 text-stone-50",
            )}
          >
            {toast.tone === "success" ? (
              <CircleCheck className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
            ) : (
              <Info className="h-4 w-4 shrink-0 text-stone-300" aria-hidden="true" />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
