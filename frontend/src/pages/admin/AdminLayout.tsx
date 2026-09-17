// frontend/src/pages/admin/AdminLayout.tsx
import React from "react"
import { NavLink, Outlet } from "react-router" // Import từ react-router

const AdminLayout = () => {
  // Hàm tạo CSS tự động bôi xanh menu khi người dùng đang ở trang tương ứng
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `w-full text-left p-2 rounded block hover:bg-gray-700 transition-colors ${isActive ? "bg-blue-600" : ""}`

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Menu */}
      <div className="flex w-64 flex-col bg-gray-800 text-white">
        <div className="border-b border-gray-700 p-4 text-2xl font-bold">Admin Dashboard</div>
        <nav className="flex-1 space-y-2 p-4">
          {/* Link tới trang Sách (Chưa code) */}
          <NavLink to="/admin/books" className={getNavLinkClass}>
            📚 Quản lý Sách
          </NavLink>

          {/* Dùng thuộc tính `end` để nó chỉ bôi xanh khi chính xác ở /admin */}
          <NavLink to="/admin" end className={getNavLinkClass}>
            📑 Quản lý Thể loại
          </NavLink>

          {/* Link tới trang Tác giả vừa tạo */}
          <NavLink to="/admin/authors" className={getNavLinkClass}>
            ✍️ Quản lý Tác giả
          </NavLink>

          <NavLink to="/admin/publishers" className={getNavLinkClass}>
            🏢 Nhà xuất bản
          </NavLink>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Điểm kỳ diệu ở đây: <Outlet /> sẽ tự động lấy CategoryAdmin hoặc AuthorAdmin đắp vào tùy theo URL */}
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
