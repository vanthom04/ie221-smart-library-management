import React, { useEffect, useState } from "react";
import { bookAPI, categoryAPI, authorAPI, publisherAPI } from "../../services/adminService";

const BookAdmin = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [books, setBooks] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [authors, setAuthors] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [publishers, setPublishers] = useState<any[]>([]);

  // Form State
  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState<number | "">(1);
  const [categoryId, setCategoryId] = useState<string>("");
  const [authorId, setAuthorId] = useState<string>("");
  const [publisherId, setPublisherId] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [bookData, catData, authData, pubData] = await Promise.all([
        bookAPI.getAll(), categoryAPI.getAll(), authorAPI.getAll(), publisherAPI.getAll()
      ]);
      setBooks(bookData); setCategories(catData); setAuthors(authData); setPublishers(pubData);
    } catch (error) {
      console.error("Lỗi khi fetch data", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      isbn,
      description,
      quantity: Number(quantity) || 1,
      available_quantity: Number(quantity) || 1,
      category_id: categoryId || null,
      author_id: authorId || null,
      publisher_id: publisherId || null,
    };

    try {
      if (editingId) await bookAPI.update(editingId, payload);
      else await bookAPI.create(payload);
      resetForm();
      fetchData();
    } catch (error) {
      alert("Có lỗi xảy ra khi lưu sách!");
    }
  };

  const resetForm = () => {
    setTitle(""); setIsbn(""); setDescription(""); setQuantity(1); setCategoryId(""); setAuthorId(""); setPublisherId(""); setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Xóa cuốn sách này?")) {
      await bookAPI.delete(id);
      fetchData();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (book: any) => {
    setTitle(book.title);
    setIsbn(book.isbn || "");
    setDescription(book.description || "");
    setQuantity(book.quantity || 1);
    setCategoryId(book.category_id || "");
    setAuthorId(book.author_id || "");
    setPublisherId(book.publisher_id || "");
    setEditingId(book.id);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">📚 Quản lý Sách</h2>

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded border">
        <div>
          <label className="block text-sm font-medium mb-1">Tên sách</label>
          <input type="text" className="w-full border p-2 rounded" required value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mã ISBN</label>
          <input type="text" className="w-full border p-2 rounded" required placeholder="VD: 978-3-16-148410-0" value={isbn} onChange={e => setIsbn(e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Mô tả sách</label>
          <textarea className="w-full border p-2 rounded" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Số lượng</label>
          <input type="number" min="1" className="w-full border p-2 rounded" required value={quantity} onChange={e => setQuantity(e.target.value === "" ? "" : Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Thể loại</label>
          <select className="w-full border p-2 rounded" required value={categoryId} onChange={e => setCategoryId(e.target.value)}>
            <option value="">-- Chọn thể loại --</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tác giả</label>
          <select className="w-full border p-2 rounded" required value={authorId} onChange={e => setAuthorId(e.target.value)}>
            <option value="">-- Chọn tác giả --</option>
            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nhà xuất bản</label>
          <select className="w-full border p-2 rounded" value={publisherId} onChange={e => setPublisherId(e.target.value)}>
            <option value="">-- Chọn NXB --</option>
            {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div className="col-span-2 flex gap-2 mt-2">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">{editingId ? "Cập nhật" : "Thêm sách mới"}</button>
          {editingId && <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded">Hủy</button>}
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
          {books.length > 0 ? books.map(b => (
            <tr key={b.id} className="hover:bg-gray-50">
              <td className="border p-2 text-center text-gray-500 text-xs">{b.id}</td>
              <td className="border p-2 font-medium">{b.title}</td>
              <td className="border p-2 text-gray-600">{b.isbn}</td>
              <td className="border p-2 text-center">{b.quantity}</td>
              <td className="border p-2 text-center">
                <button onClick={() => handleEdit(b)} className="text-yellow-600 font-medium mr-3 hover:underline">Sửa</button>
                <button onClick={() => handleDelete(b.id)} className="text-red-600 font-medium hover:underline">Xóa</button>
              </td>
            </tr>
          )) : <tr><td colSpan={5} className="border p-4 text-center text-gray-500">Chưa có cuốn sách nào.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};
export default BookAdmin;