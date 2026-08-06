import { useCallback, useEffect, useRef, useState } from "react"

export function readStored<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function writeStored(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — the app still works, it just forgets. */
  }
}

export function clearStored(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const list = window.matchMedia(query)
    const onChange = () => setMatches(list.matches)
    onChange()
    list.addEventListener("change", onChange)
    return () => list.removeEventListener("change", onChange)
  }, [query])

  return matches
}

/** True once a short artificial fetch has settled — used for the first paint. */
export function useBooted(delay = 620): boolean {
  const [booted, setBooted] = useState(false)
  useEffect(() => {
    const timer = window.setTimeout(() => setBooted(true), delay)
    return () => window.clearTimeout(timer)
  }, [delay])
  return booted
}

/** Locks body scroll while a dialog or sheet is open. */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [active])
}

export function useEscape(active: boolean, onEscape: () => void): void {
  const handler = useRef(onEscape)
  handler.current = onEscape

  useEffect(() => {
    if (!active) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation()
        handler.current()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [active])
}

/** Keeps tab focus inside an open dialog. */
export function useFocusTrap(active: boolean) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!active) return
    const node = ref.current
    if (!node) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const selector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

    const focusables = () =>
      Array.from(node.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      )

    const first = focusables()[0]
    window.requestAnimationFrame(() => (first ?? node).focus())

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return
      const items = focusables()
      if (!items.length) return
      const firstItem = items[0]
      const lastItem = items[items.length - 1]
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault()
        lastItem.focus()
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault()
        firstItem.focus()
      }
    }

    node.addEventListener("keydown", onKeyDown)
    return () => {
      node.removeEventListener("keydown", onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [active])

  return ref
}

export type Theme = "light" | "dark"

const THEME_KEY = "weekender.theme"

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = readStored<Theme>(THEME_KEY)
    if (stored === "light" || stored === "dark") return stored
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark"
    }
    return "light"
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    writeStored(THEME_KEY, theme)
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"))
  }, [])

  return [theme, toggle]
}
