// frontend/src/pages/admin/CategoryAdmin.tsx
import React, { useEffect, useState } from 'react';
import { categoryAPI } from '@/services/adminService'; // Sử dụng đường dẫn alias chuẩn

interface Category {
  id: number;
  name: string;
  description: string;
}

const CategoryAdmin = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchCategories = async () => {
    try {
      const data = await categoryAPI.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Lỗi khi tải thể loại", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Xử lý Thêm / Sửa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await categoryAPI.update(editingId, form);
    } else {
      await categoryAPI.create(form);
    }
    setForm({ name: '', description: '' });
    setEditingId(null);
    fetchCategories(); // Load lại bảng
  };

  // Xử lý Xóa
  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thể loại này?")) {
      await categoryAPI.delete(id);
      fetchCategories();
    }
  };

  const handleEdit = (cat: Category) => {
    setForm({ name: cat.name, description: cat.description });
    setEditingId(cat.id);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">📑 Quản lý Thể loại</h2>

      {/* Khung Nhập Liệu (Form) */}
      <form onSubmit={handleSubmit} className="mb-8 flex gap-4 items-end bg-gray-50 p-4 rounded border">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Tên thể loại</label>
          <input
            type="text" required
            value={form.name} onChange={e => setForm({...form, name: e.target.value})}
            className="mt-1 p-2 w-full border rounded"
            placeholder="VD: Khoa học viễn tưởng..."
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Mô tả</label>
          <input
            type="text"
            value={form.description} onChange={e => setForm({...form, description: e.target.value})}
            className="mt-1 p-2 w-full border rounded"
            placeholder="Mô tả ngắn..."
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 h-10">
          {editingId ? '💾 Cập nhật' : '➕ Thêm mới'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '' }) }} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 h-10">
            Hủy
          </button>
        )}
      </form>

      {/* Bảng Hiển Thị (Table) */}
      <table className="min-w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-3 text-left">ID</th>
            <th className="border p-3 text-left">Tên thể loại</th>
            <th className="border p-3 text-left">Mô tả</th>
            <th className="border p-3 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="hover:bg-gray-50">
              <td className="border p-3">{cat.id}</td>
              <td className="border p-3 font-semibold">{cat.name}</td>
              <td className="border p-3 text-gray-600">{cat.description}</td>
              <td className="border p-3 text-center space-x-2">
                <button onClick={() => handleEdit(cat)} className="text-yellow-600 hover:underline">Sửa</button>
                <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:underline">Xóa</button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
             <tr><td colSpan={4} className="p-4 text-center text-gray-500">Chưa có dữ liệu.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryAdmin;