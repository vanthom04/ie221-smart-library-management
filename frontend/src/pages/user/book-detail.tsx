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
    return <div className="text-center py-20 text-muted-foreground text-lg">Đang tải dữ liệu sách...</div>
  }

  if (!book) {
    return (
      <div className="flex flex-col gap-6 items-center py-20">
        <h2 className="text-2xl font-bold text-destructive">Không tìm thấy sách!</h2>
        <Button onClick={() => navigate("/search")}>Quay lại tìm kiếm</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-10">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          type="button"
          variant="ghost"
          onClick={() => navigate("/search")}
          className="-ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" /> Quay lại tìm kiếm
        </Button>
      </div>

      <div className="bg-card border rounded-2xl p-8 shadow-sm flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/3 h-80 bg-muted rounded-xl flex items-center justify-center border-2 border-dashed border-border">
          <span className="text-7xl">📖</span>
        </div>

        <div className="w-full md:w-2/3 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl text-foreground mb-4">{book.title}</h1>

            <p className="text-muted-foreground text-base leading-relaxed mb-6">
              {book.description || "Cuốn sách này hiện chưa có mô tả chi tiết."}
            </p>

            <div className="bg-muted/50 p-5 rounded-xl space-y-2 mb-8 text-sm text-foreground/80">
              <p><span className="font-semibold w-28 inline-block">Mã sách (ID):</span> <span className="font-mono text-primary font-bold">#{book.id}</span></p>
              <p><span className="font-semibold w-28 inline-block">Mã Thể loại:</span> {book.category_id}</p>
              <p><span className="font-semibold w-28 inline-block">Mã Tác giả:</span> {book.author_id}</p>
              <p><span className="font-semibold w-28 inline-block">Mã Nhà xuất bản:</span> {book.publisher_id}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1 py-6 text-base font-semibold">
              Đăng ký mượn sách
            </Button>
            <Button variant="outline" className="py-6 px-6 font-semibold">
              ❤️ Yêu thích
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetailPage