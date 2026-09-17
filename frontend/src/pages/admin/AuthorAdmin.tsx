import React, { useEffect, useState } from "react"
import { authorAPI } from "../../services/adminService"

const AuthorAdmin = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [authors, setAuthors] = useState<any[]>([])
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchAuthors = async () => {
    try {
      const data = await authorAPI.getAll()
      setAuthors(data)
    } catch (_error) {
      console.error("Lỗi khi tải tác giả")
    }
  }

  useEffect(() => {
    authorAPI
      .getAll()
      .then(setAuthors)
      .catch(() => console.error("Lỗi tải tác giả"))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await authorAPI.update(editingId, { name, bio })
      } else {
        await authorAPI.create({ name, bio })
      }
      setName("")
      setBio("")
      setEditingId(null)
      fetchAuthors()
    } catch (_error) {
      alert("Có lỗi xảy ra khi lưu tác giả!")
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (author: any) => {
    setName(author.name)
    setBio(author.bio || "")
    setEditingId(author.id)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tác giả này?")) {
      await authorAPI.delete(id)
      fetchAuthors()
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">✍️ Quản lý Tác giả</h2>

      <form
        onSubmit={handleSubmit}
        className="mb-6 flex items-end gap-4 rounded border bg-gray-50 p-4"
      >
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Tên tác giả</label>
          <input
            type="text"
            className="w-full rounded border p-2"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Tiểu sử</label>
          <input
            type="text"
            className="w-full rounded border p-2"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <button type="submit" className="h-10 rounded bg-blue-600 px-6 py-2 text-white">
          {editingId ? "Cập nhật" : "Thêm mới"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null)
              setName("")
              setBio("")
            }}
            className="h-10 rounded bg-gray-400 px-4 py-2 text-white"
          >
            Hủy
          </button>
        )}
      </form>

      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2 text-left">Tên tác giả</th>
            <th className="border p-2 text-left">Tiểu sử</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {authors.length > 0 ? (
            authors.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="border p-2 text-center text-xs text-gray-500">{a.id}</td>
                <td className="border p-2 font-medium">{a.name}</td>
                <td className="border p-2 text-gray-600">{a.bio}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleEdit(a)}
                    className="mr-3 font-medium text-yellow-600 hover:underline"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="font-medium text-red-600 hover:underline"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="border p-4 text-center text-gray-500">
                Chưa có tác giả nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AuthorAdmin
