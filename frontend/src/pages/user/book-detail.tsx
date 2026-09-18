import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { ArrowLeftIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

export const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [book, setBook] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/books/")
      .then((res) => res.json())
      .then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const foundBook = data.find((b: any) => b.id === Number(id))
        setBook(foundBook)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Lỗi tải chi tiết sách:", err)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="py-20 text-center text-lg text-muted-foreground">
        Đang tải dữ liệu sách...
      </div>
    )
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center gap-6 py-20">
        <h2 className="text-2xl font-bold text-destructive">Không tìm thấy sách!</h2>
        <Button onClick={() => navigate("/search")}>Quay lại tìm kiếm</Button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-10">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          type="button"
          variant="ghost"
          onClick={() => navigate("/search")}
          className="-ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="mr-1 h-4 w-4" /> Quay lại tìm kiếm
        </Button>
      </div>

      <div className="flex flex-col gap-10 rounded-2xl border bg-card p-8 shadow-sm md:flex-row">
        <div className="flex h-80 w-full items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted md:w-1/3">
          <span className="text-7xl">📖</span>
        </div>

        <div className="flex w-full flex-col justify-between md:w-2/3">
          <div>
            <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">{book.title}</h1>

            <p className="mb-6 text-base leading-relaxed text-muted-foreground">
              {book.description || "Cuốn sách này hiện chưa có mô tả chi tiết."}
            </p>

            <div className="mb-8 space-y-2 rounded-xl bg-muted/50 p-5 text-sm text-foreground/80">
              <p>
                <span className="inline-block w-28 font-semibold">Mã sách (ID):</span>{" "}
                <span className="font-mono font-bold text-primary">#{book.id}</span>
              </p>
              <p>
                <span className="inline-block w-28 font-semibold">Mã Thể loại:</span>{" "}
                {book.category_id}
              </p>
              <p>
                <span className="inline-block w-28 font-semibold">Mã Tác giả:</span>{" "}
                {book.author_id}
              </p>
              <p>
                <span className="inline-block w-28 font-semibold">Mã Nhà xuất bản:</span>{" "}
                {book.publisher_id}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1 py-6 text-base font-semibold">Đăng ký mượn sách</Button>
            <Button variant="outline" className="px-6 py-6 font-semibold">
              ❤️ Yêu thích
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetailPage
