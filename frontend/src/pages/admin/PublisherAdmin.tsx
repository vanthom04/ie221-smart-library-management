import React, { useEffect, useState } from "react"
import { publisherAPI } from "../../services/adminService"

interface Publisher {
  id: string
  name: string
  address: string
}

const PublisherAdmin = () => {
  const [publishers, setPublishers] = useState<Publisher[]>([])
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)

  const fetchPublishers = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await publisherAPI.getAll()
      const data = res?.data || res
      setPublishers(Array.isArray(data) ? data : [])
    } catch (_error) {
      console.error("Lỗi khi tải NXB")
      setPublishers([])
    }
  }

  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res: any = await publisherAPI.getAll()
        const data = res?.data || res
        if (isMounted) {
          setPublishers(Array.isArray(data) ? data : [])
        }
      } catch (_error) {
        if (isMounted) {
          setPublishers([])
        }
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await publisherAPI.update(editingId, { name, address })
        setEditingId(null)
      } else {
        await publisherAPI.create({ name, address })
      }
      setName("")
      setAddress("")
      await fetchPublishers()
    } catch (_error) {
      alert("Có lỗi xảy ra, vui lòng xem Console!")
    }
  }

  const handleEdit = (publisher: Publisher) => {
    setName(publisher.name)
    setAddress(publisher.address || "")
    setEditingId(publisher.id)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa NXB này không?")) {
      try {
        await publisherAPI.delete(id)
        await fetchPublishers()
      } catch (_error) {
        alert("Lỗi khi xóa!")
      }
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-2xl font-bold">🏢 Quản lý Nhà xuất bản</h2>

      <form
        onSubmit={handleSubmit}
        className="mb-6 flex items-end gap-4 rounded border bg-gray-50 p-4"
      >
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Tên NXB</label>
          <input
            type="text"
            className="w-full rounded border p-2"
            placeholder="VD: NXB Trẻ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Địa chỉ</label>
          <input
            type="text"
            className="w-full rounded border p-2"
            placeholder="Nhập địa chỉ..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button type="submit" className="h-10 rounded bg-blue-600 px-6 py-2 font-medium text-white">
          {editingId ? "Cập nhật" : "+ Thêm mới"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null)
              setName("")
              setAddress("")
            }}
            className="h-10 rounded bg-gray-400 px-4 py-2 text-white"
          >
            Hủy
          </button>
        )}
      </form>

      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-16 border p-2 text-center">ID</th>
            <th className="border p-2 text-left">Tên NXB</th>
            <th className="border p-2 text-left">Địa chỉ</th>
            <th className="w-40 border p-2 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {publishers.length > 0 ? (
            publishers.map((pub) => (
              <tr key={pub.id} className="hover:bg-gray-50">
                <td className="border p-2 text-center text-xs text-gray-500">{pub.id}</td>
                <td className="border p-2 font-medium">{pub.name}</td>
                <td className="border p-2">{pub.address}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleEdit(pub)}
                    className="mr-3 font-medium text-yellow-600 hover:underline"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(pub.id)}
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
                Chưa có dữ liệu.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default PublisherAdmin
