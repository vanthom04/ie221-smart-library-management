import React, { useEffect, useState } from "react";
import { authorAPI } from "../../services/adminService";

interface Author {
  id: number; // Đổi thành số
  name: string;
  bio: string;
}

const AuthorAdmin = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null); // Đổi thành số

  const fetchAuthors = async () => {
    try {
      const data = await authorAPI.getAll();
      setAuthors(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await authorAPI.update(editingId, { name, bio });
        setEditingId(null);
      } else {
        await authorAPI.create({ name, bio });
      }
      setName("");
      setBio("");
      fetchAuthors();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra, vui lòng xem Console!");
    }
  };

  const handleEdit = (author: Author) => {
    setName(author.name);
    setBio(author.bio || "");
    setEditingId(author.id);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tác giả này không?")) {
      try {
        await authorAPI.delete(id);
        fetchAuthors();
      } catch (error) {
        console.error(error);
        alert("Lỗi khi xóa!");
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">✍️ Quản lý Tác giả</h2>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Tên tác giả</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="VD: Vũ Trọng Phụng"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Tiểu sử (Bio)</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Mô tả ngắn..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-medium">
          {editingId ? "Cập nhật" : "+ Thêm mới"}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setName(""); setBio(""); }} className="bg-gray-400 text-white px-4 py-2 rounded">
            Hủy
          </button>
        )}
      </form>

      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="border p-2 text-center w-16">ID</th>
            <th className="border p-2 text-left">Tên tác giả</th>
            <th className="border p-2 text-left">Tiểu sử</th>
            <th className="border p-2 text-center w-40">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {authors.length > 0 ? (
            authors.map((author) => (
              <tr key={author.id} className="hover:bg-gray-50">
                {/* Đã xóa hàm substring, chỉ hiển thị số nguyên */}
                <td className="border p-2 text-gray-500 text-center">{author.id}</td>
                <td className="border p-2 font-medium">{author.name}</td>
                <td className="border p-2">{author.bio}</td>
                <td className="border p-2 text-center">
                  <button onClick={() => handleEdit(author)} className="text-yellow-600 font-medium mr-3 hover:underline">Sửa</button>
                  <button onClick={() => handleDelete(author.id)} className="text-red-600 font-medium hover:underline">Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="border p-4 text-center text-gray-500">Chưa có dữ liệu.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuthorAdmin;