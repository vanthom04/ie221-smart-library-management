import React, { useEffect, useState } from "react"
import { bookAPI, categoryAPI, authorAPI, publisherAPI } from "../../services/adminService"

const BookAdmin = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [books, setBooks] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [authors, setAuthors] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [publishers, setPublishers] = useState<any[]>([])

  // Form State
  const [title, setTitle] = useState("")
  const [isbn, setIsbn] = useState("")
  const [description, setDescription] = useState("")
  const [quantity, setQuantity] = useState<number | "">(1)
  const [categoryId, setCategoryId] = useState<string>("")
  const [authorId, setAuthorId] = useState<string>("")
  const [publisherId, setPublisherId] = useState<string>("")
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const [resBook, resCat, resAuth, resPub]: any = await Promise.all([
        bookAPI.getAll(),
        categoryAPI.getAll(),
        authorAPI.getAll(),
        publisherAPI.getAll()
      ])

      const bookData = resBook?.data || resBook
      const catData = resCat?.data || resCat
      const authData = resAuth?.data || resAuth
      const pubData = resPub?.data || resPub

      setBooks(Array.isArray(bookData) ? bookData : [])
      setCategories(Array.isArray(catData) ? catData : [])
      setAuthors(Array.isArray(authData) ? authData : [])
      setPublishers(Array.isArray(pubData) ? pubData : [])
    } catch (_error) {
      console.error("Lỗi khi fetch data")
      setBooks([])
      setCategories([])
      setAuthors([])
      setPublishers([])
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      title,
      isbn,
      description,
      quantity: Number(quantity) || 1,
      available_quantity: Number(quantity) || 1,
      category_id: categoryId || null,
      author_id: authorId || null,
      publisher_id: publisherId || null
    }

    try {
      if (editingId) await bookAPI.update(editingId, payload)
      else await bookAPI.create(payload)
      resetForm()
      fetchData()
    } catch (_error) {
      alert("Có lỗi xảy ra khi lưu sách!")
    }
  }

  const resetForm = () => {
    setTitle("")
    setIsbn("")
    setDescription("")
    setQuantity(1)
    setCategoryId("")
    setAuthorId("")
    setPublisherId("")
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Xóa cuốn sách này?")) {
      await bookAPI.delete(id)
      fetchData()
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (book: any) => {
    setTitle(book.title)
    setIsbn(book.isbn || "")
    setDescription(book.description || "")
    setQuantity(book.quantity || 1)
    setCategoryId(book.category_id || "")
    setAuthorId(book.author_id || "")
    setPublisherId(book.publisher_id || "")
    setEditingId(book.id)
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">📚 Quản lý Sách</h2>

      <form
        onSubmit={handleSubmit}
        className="mb-6 grid grid-cols-2 gap-4 rounded border bg-gray-50 p-4"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">Tên sách</label>
          <input
            type="text"
            className="w-full rounded border p-2"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Mã ISBN</label>
          <input
            type="text"
            className="w-full rounded border p-2"
            placeholder="VD: 978-3-16-148410-0"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <label className="mb-1 block text-sm font-medium">Mô tả sách</label>
          <textarea
            className="w-full rounded border p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Số lượng</label>
          <input
            type="number"
            min="1"
            className="w-full rounded border p-2"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Thể loại</label>
          <select
            className="w-full rounded border p-2"
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">-- Chọn thể loại --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tác giả</label>
          <select
            className="w-full rounded border p-2"
            required
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
          >
            <option value="">-- Chọn tác giả --</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Nhà xuất bản</label>
          <select
            className="w-full rounded border p-2"
            value={publisherId}
            onChange={(e) => setPublisherId(e.target.value)}
          >
            <option value="">-- Chọn NXB --</option>
            {publishers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2 mt-2 flex gap-2">
          <button type="submit" className="rounded bg-blue-600 px-6 py-2 text-white">
            {editingId ? "Cập nhật" : "Thêm sách mới"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded bg-gray-400 px-4 py-2 text-white"
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2 text-left">Tên sách</th>
            <th className="border p-2 text-left">ISBN</th>
            <th className="border p-2">Số lượng</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="border p-2 text-center text-xs text-gray-500">{b.id}</td>
                <td className="border p-2 font-medium">{b.title}</td>
                <td className="border p-2 text-gray-600">{b.isbn}</td>
                <td className="border p-2 text-center">{b.quantity}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleEdit(b)}
                    className="mr-3 font-medium text-yellow-600 hover:underline"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="font-medium text-red-600 hover:underline"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="border p-4 text-center text-gray-500">
                Chưa có cuốn sách nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
export default BookAdmin