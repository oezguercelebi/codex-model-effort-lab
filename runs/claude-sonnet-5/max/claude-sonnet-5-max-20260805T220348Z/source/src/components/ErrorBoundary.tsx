import { Component, type ReactNode } from "react"
import { TriangleAlert } from "lucide-react"

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error("Weekender crashed:", error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-stone-100 p-6">
          <div className="flex max-w-sm flex-col items-center gap-3 rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <TriangleAlert className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="text-lg font-semibold text-stone-900">Something went sideways</h1>
            <p className="text-sm text-stone-500">Weekender hit a snag loading the trip. Try refreshing the page.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
