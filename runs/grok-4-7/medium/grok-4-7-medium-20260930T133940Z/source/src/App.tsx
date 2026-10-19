import { Shell } from "./components/Shell"
import { TripProvider } from "./trip"

export default function App() {
  return (
    <TripProvider>
      <Shell />
    </TripProvider>
  )
}
