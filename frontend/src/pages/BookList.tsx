import { useState, useEffect } from "react"
import { Link } from "react-router" // Đã thêm import Link ở đây
import { bookService } from "../services/bookService"

// Định nghĩa khung dữ liệu (Schema) cho Frontend
interface Book {
  id: number
  title: string
  description: string
}

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([])
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(false)

  // Chạy ngay khi vừa mở trang
  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const data = await bookService.getAllBooks()
      setBooks(data)
    } catch (error) {
      console.error("Lỗi tải dữ liệu", error)
    }
    setLoading(false)
  }

  const handleSearch = async () => {
    if (!keyword.trim()) {
      fetchBooks()
      return
    }
    setLoading(true)
    try {
      const data = await bookService.searchBooks(keyword)
      setBooks(data)
    } catch (error) {
      console.error("Lỗi tìm kiếm", error)
    }
    setLoading(false)
  }

  return (
    <div className="mx-auto min-h-screen max-w-6xl bg-gray-50 p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Khám Phá Thư Viện</h1>

      {/* --- PHẦN 1: SEARCH UI --- */}
      <div className="mb-8 flex gap-3">
        <input
          type="text"
          placeholder="Tìm kiếm sách theo tiêu đề hoặc mô tả..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          Tìm kiếm
        </button>
      </div>

      {/* --- PHẦN 2: BOOK LIST --- */}
      {loading ? (
        <p className="animate-pulse text-center text-lg text-gray-500">
          Đang tải dữ liệu từ Backend...
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {books.length > 0 ? (
            books.map((book) => (
              <div
                key={book.id}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
              >
                <h3 className="mb-3 text-xl font-bold text-gray-900">{book.title}</h3>
                <p className="mb-6 line-clamp-3 flex-1 text-sm text-gray-600">
                  {book.description || "Chưa có mô tả cho cuốn sách này."}
                </p>
                {/* Đã đổi button thành Link và truyền id của sách vào đây */}
                <Link
                  to={`/books/${book.id}`}
                  className="mt-auto self-start text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                  Xem chi tiết &rarr;
                </Link>
              </div>
            ))
          ) : (
            <p className="col-span-full rounded-xl border border-dashed bg-white py-10 text-center text-gray-500">
              Không tìm thấy cuốn sách nào phù hợp.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
