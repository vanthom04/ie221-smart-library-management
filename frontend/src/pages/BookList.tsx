import { useState, useEffect } from "react"
import { Link } from "react-router"

const BookList = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [books, setBooks] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>([])

  const [searchTitle, setSearchTitle] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi tải thể loại:", err))
  }, [])

  const handleSearch = () => {
    const url = new URL("http://localhost:8000/api/v1/books/search")
    if (searchTitle) url.searchParams.append("title", searchTitle)
    if (selectedCategory) url.searchParams.append("category_id", selectedCategory)

    fetch(url.toString())
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Lỗi tải sách:", err))
  }

  useEffect(() => {
    const url = new URL("http://localhost:8000/api/v1/books/search")
    fetch(url.toString())
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Lỗi tải sách:", err))
  }, [])

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-8 rounded-xl bg-blue-50 p-8 text-center shadow-sm">
        <h1 className="mb-4 text-4xl font-bold text-blue-900">Khám Phá Thư Viện</h1>
        <p className="mb-6 text-gray-600">Hàng ngàn cuốn sách hấp dẫn đang chờ bạn khám phá</p>

        <div className="mx-auto flex max-w-3xl flex-col justify-center gap-3 md:flex-row">
          <input
            type="text"
            placeholder="Nhập tên sách bạn muốn tìm..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 ring-2 focus:ring-blue-500 focus:outline-none"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <select
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 ring-2 focus:ring-blue-500 focus:outline-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Tất cả thể loại</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleSearch}
            className="rounded-lg bg-blue-600 px-8 py-3 font-bold text-white transition-colors hover:bg-blue-700"
          >
            Tìm Kiếm
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {books.length > 0 ? (
          books.map((book) => (
            <div
              key={book.id}
              className="overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-64 items-center justify-center bg-gray-200 text-gray-400">
                <span className="text-5xl">📚</span>
              </div>
              <div className="p-4">
                <h3
                  className="mb-1 line-clamp-1 text-lg font-bold text-gray-800"
                  title={book.title}
                >
                  {book.title}
                </h3>
                <p className="mb-4 line-clamp-2 h-10 text-sm text-gray-500">
                  {book.description || "Chưa có mô tả cho cuốn sách này."}
                </p>
                <Link
                  to={`/books/${book.id}`}
                  className="block w-full rounded bg-gray-100 py-2 text-center font-semibold text-blue-700 transition-colors hover:bg-gray-200"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500">
            Không tìm thấy cuốn sách nào phù hợp với từ khóa của bạn. 😢
          </div>
        )}
      </div>
    </div>
  )
}

export default BookList
