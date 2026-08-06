import type { ReactNode } from "react"
import { X } from "lucide-react"
import { useEscape, useFocusTrap, useScrollLock } from "../lib/hooks"
import { cx } from "../lib/format"

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  label?: string
  children: ReactNode
  footer?: ReactNode
  size?: "md" | "lg"
}

/**
 * A bottom sheet on phones, a centred dialog from `sm` up. Traps focus,
 * closes on Escape and on backdrop click.
 */
export function Modal({ open, onClose, title, label, children, footer, size = "lg" }: ModalProps) {
  const trapRef = useFocusTrap(open)
  useScrollLock(open)
  useEscape(open, onClose)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="wk-fade-in absolute inset-0 bg-canvas-deep/70 backdrop-blur-[3px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={label ?? title}
        tabIndex={-1}
        className={cx(
          "wk-dialog relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-line bg-surface shadow-pop outline-none sm:max-h-[88vh] sm:rounded-3xl",
          size === "lg" ? "sm:max-w-3xl" : "sm:max-w-lg",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-20 grid size-9 place-items-center rounded-full bg-canvas/80 text-ink backdrop-blur transition hover:bg-canvas"
        >
          <X size={17} aria-hidden="true" />
        </button>
        <div className="wk-scroll flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer ? (
          <div className="shrink-0 border-t border-line bg-surface px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] sm:px-6 sm:pb-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}
