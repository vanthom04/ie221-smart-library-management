import { Suspense, lazy } from "react"
import { Routes, Route } from "react-router"

import { Spinner } from "@/components/ui/spinner"

const HomePage = lazy(() => import("@/pages/home"))

export const App = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen flex-col items-center justify-center gap-1.5">
          <Spinner className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Suspense>
  )
}
