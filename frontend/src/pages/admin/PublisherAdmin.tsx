import React, { useEffect, useState } from "react";
import { publisherAPI } from "../../services/adminService";

interface Publisher {
  id: number;
  name: string;
  address: string;
}

const PublisherAdmin = () => {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchPublishers = async () => {
    try {
      const data = await publisherAPI.getAll();
      setPublishers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPublishers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await publisherAPI.update(editingId, { name, address });
        setEditingId(null);
      } else {
        await publisherAPI.create({ name, address });
      }
      setName("");
      setAddress("");
      fetchPublishers();
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra, vui lòng xem Console!");
    }
  };

  const handleEdit = (publisher: Publisher) => {
    setName(publisher.name);
    setAddress(publisher.address || "");
    setEditingId(publisher.id);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa NXB này không?")) {
      try {
        await publisherAPI.delete(id);
        fetchPublishers();
      } catch (error) {
        console.error(error);
        alert("Lỗi khi xóa!");
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">🏢 Quản lý Nhà xuất bản</h2>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Tên NXB</label>
          <input type="text" className="w-full border p-2 rounded" placeholder="VD: NXB Trẻ" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Địa chỉ</label>
          <input type="text" className="w-full border p-2 rounded" placeholder="Nhập địa chỉ..." value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-medium">
          {editingId ? "Cập nhật" : "+ Thêm mới"}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setName(""); setAddress(""); }} className="bg-gray-400 text-white px-4 py-2 rounded">Hủy</button>
        )}
      </form>

      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="border p-2 text-center w-16">ID</th>
            <th className="border p-2 text-left">Tên NXB</th>
            <th className="border p-2 text-left">Địa chỉ</th>
            <th className="border p-2 text-center w-40">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {publishers.length > 0 ? (
            publishers.map((pub) => (
              <tr key={pub.id} className="hover:bg-gray-50">
                <td className="border p-2 text-gray-500 text-center">{pub.id}</td>
                <td className="border p-2 font-medium">{pub.name}</td>
                <td className="border p-2">{pub.address}</td>
                <td className="border p-2 text-center">
                  <button onClick={() => handleEdit(pub)} className="text-yellow-600 font-medium mr-3 hover:underline">Sửa</button>
                  <button onClick={() => handleDelete(pub.id)} className="text-red-600 font-medium hover:underline">Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={4} className="border p-4 text-center text-gray-500">Chưa có dữ liệu.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PublisherAdmin;