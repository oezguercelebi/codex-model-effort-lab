import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { Check, Info, Undo2, X } from "lucide-react"
import { cx } from "../lib/format"

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastInput {
  message: string
  detail?: string
  tone?: "default" | "success"
  action?: ToastAction
}

interface Toast extends ToastInput {
  id: number
}

interface ToastValue {
  push: (toast: ToastInput) => void
}

const ToastContext = createContext<ToastValue | null>(null)

const LIFETIME = 5000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)
  const timers = useRef(new Map<number, number>())

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      window.clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const push = useCallback(
    (input: ToastInput) => {
      const id = nextId.current++
      setToasts((current) => [...current.slice(-2), { ...input, id }])
      timers.current.set(
        id,
        window.setTimeout(() => dismiss(id), LIFETIME),
      )
    },
    [dismiss],
  )

  const value = useMemo(() => ({ push }), [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex flex-col items-center gap-2 px-4 pb-[calc(env(safe-area-inset-bottom)+5.5rem)] sm:items-end sm:px-6 sm:pb-6"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="wk-pop-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-line bg-surface p-3 pl-3.5 shadow-lift"
          >
            <span
              className={cx(
                "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full",
                toast.tone === "success"
                  ? "bg-yes-soft text-yes"
                  : "bg-brand-soft text-brand",
              )}
              aria-hidden="true"
            >
              {toast.tone === "success" ? <Check size={15} /> : <Info size={15} />}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-5 text-ink">{toast.message}</p>
              {toast.detail ? (
                <p className="mt-0.5 text-xs leading-4 text-ink-soft">{toast.detail}</p>
              ) : null}
            </div>
            {toast.action ? (
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick()
                  dismiss(toast.id)
                }}
                className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-brand transition hover:bg-brand-soft"
              >
                <Undo2 size={13} />
                {toast.action.label}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="shrink-0 rounded-lg p-1 text-ink-faint transition hover:bg-surface-2 hover:text-ink"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastValue {
  const value = useContext(ToastContext)
  if (!value) throw new Error("useToast must be used inside <ToastProvider>")
  return value
}
