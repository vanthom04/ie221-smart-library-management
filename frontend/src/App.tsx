import { Suspense, lazy } from "react"
import { Routes, Route } from "react-router"
import { Spinner } from "@/components/ui/spinner"

const HomePage = lazy(() => import("@/pages/home"))
const BookList = lazy(() => import("@/pages/BookList"))
// THÊM DÒNG NÀY: Gọi file BookDetail vào
const BookDetail = lazy(() => import("@/pages/BookDetail"))

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
        <Route path="/books" element={<BookList />} />

        {/* THÊM DÒNG NÀY: Tạo đường dẫn động /books/số_id */}
        <Route path="/books/:id" element={<BookDetail />} />
      </Routes>
    </Suspense>
  )
}
